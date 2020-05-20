class Game {
  constructor(root) {
    this.root = root;
    this.boardSize = 10;
    this.shipSize = 5;
    this.shipAmount = 0;
    this.currentBoard = '';
    this.rotation = true;
    this.isAvailable = true;
    this.isOnMap = true;
    this.isEmpty = true;
    this.shipState = 'ship-hover';

    this.roundCount = 0;
    this.isFired = false;
    this.canFire = true;
    this.randomLocation = {};
    this.currentLocation = {};
    this.history = [];

    // TEST BOARDS
    // example default board
    this.playerOneBoard = [
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1], // 0
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 1], // 1
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 1], // 2
      [1, 0, 1, 1, 0, 0, 0, 1, 1, 1], // 3
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 1], // 4
      [1, 0, 1, 1, 0, 1, 0, 1, 0, 1], // 5
      [1, 0, 0, 1, 0, 1, 0, 1, 0, 1], // 6
      [1, 0, 0, 1, 0, 1, 0, 1, 0, 1], // 7
      [1, 1, 0, 1, 0, 0, 0, 1, 0, 1], // 8
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 1] // 9
    ];

    this.playerTwoBoard = [
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 0], // 0
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0], // 3
      [0, 0, 1, 0, 0, 1, 0, 0, 1, 0], // 4
      [0, 0, 1, 0, 0, 1, 0, 0, 0, 0], // 5
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // 6
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // 7
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 8
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 9
    ];

    this.scoreBoard = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 9
    ];

    // setView('start') off for dev
    // this.setView('game');
    this.startGame();
  }

  setView(setting) {
    const view = document.createElement('div');
    view.classList.add(setting);
    switch (setting) {
      case 'start':
        const startGameButton = document.createElement('button');
        startGameButton.innerHTML = 'Start new game';
        startGameButton.addEventListener('click', () => {
          this.createNewGame();
        });
        view.appendChild(startGameButton);
        break;
      case 'setting':
        // header & legend
        view.innerHTML = `
          <h1>Set your fleet</h1>
          <legend>
            <strong>Left-click</strong> to place ship<br>
            <strong>Right-click</strong> to change rotation
          </legend>
        `;

        const settingBoard = document.createElement('div');
        settingBoard.id = 'player';
        settingBoard.classList.add('board');

        // buttons
        const buttons = document.createElement('div');
        buttons.classList.add('buttons');

        const bRandomShip = this.newButton('randomShip', 'Random next ship');
        bRandomShip.addEventListener('click', () => {
          this.randomShip();
        });

        const bRandomShipAll = this.newButton('randomShipAll', 'Random all fleet');
        bRandomShipAll.addEventListener('click', () => {
          this.randomShipAll();
        });

        const bStartGame = this.newButton('startGame', 'Start game', 'disabled');
        bStartGame.disabled = true;
        bStartGame.addEventListener('click', () => {
          this.startGame();
        });

        buttons.appendChild(bRandomShip);
        buttons.appendChild(bRandomShipAll);
        buttons.appendChild(bStartGame);

        view.appendChild(settingBoard);
        view.appendChild(buttons);

        break;
      case 'game':
        // header & legend

        // main container
        const section = document.createElement('section');
        section.classList.add('game-view');

        // LEFT
        const left = document.createElement('div');
        left.innerHTML = `
          <div id="game-text">
            <h1>Prepare for battle!</h1>
          </div>
          <h3>Target opponent's fleet here</h3>
        `;

        const leftBoard = document.createElement('div');
        leftBoard.id = 'score';
        leftBoard.classList.add('board', 'score');

        left.appendChild(leftBoard);

        // RIGHT
        const right = document.createElement('div');
        right.innerHTML = `<h3>Your fleet</h3>`;

        const rightBoard = document.createElement('div');
        rightBoard.id = 'player';
        rightBoard.classList.add('board');

        right.appendChild(rightBoard);

        section.appendChild(left);
        section.appendChild(right);

        view.appendChild(section);

        break;
      case 'win':
        // view for wining the game
        break;
    }
    this.root.innerHTML = '';
    this.root.appendChild(view);
  }

  createNewGame() {
    this.setView('setting');
    this.roundCount = 0;

    // init empty arrays to store boards, randomize opponent's board, enable setting player's board
    this.isWin = false;

    this.playerOneBoard = Array(this.boardSize)
      .fill()
      .map(() => Array(this.boardSize).fill(0));
    this.playerTwoBoard = Array(this.boardSize)
      .fill()
      .map(() => Array(this.boardSize).fill(0));
    this.scoreBoard = Array(this.boardSize)
      .fill()
      .map(() => Array(this.boardSize).fill(0));
    this.setBoardFor('ai');
    this.setBoardFor('player');
  }

  drawBoard(board) {
    const root = document.querySelector(`#${board}`);
    let targetArray = [];
    if (board === 'player') targetArray = this.playerOneBoard;
    if (board === 'score') targetArray = this.scoreBoard;

    targetArray.forEach((arr, i) => {
      const row = document.createElement('div');
      row.classList.add('row');

      arr.forEach((item, j) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (item === 1) cell.classList.add('ship');
        if (item === 2) cell.classList.add('hit');
        if (item === 3) cell.classList.add('miss');

        cell.setAttribute('data-location', `${board}-${i}-${j}`);
        row.appendChild(cell);
      });
      root.appendChild(row);
    });
  }

  setBoardFor(player) {
    this.currentBoard = player;
    if (player === 'player') {
      // init new board & anable buttons
      this.shipSize = 5;
      this.shipAmount = 0;
      this.enableButton('randomShip');
      this.enableButton('randomShipAll');
      this.disableButton('startGame');

      this.drawBoard('player');

      // enable Events setEvents(rootElement, isGame);
      this.setEvents('player', false);
    }

    if (player === 'ai') {
      // init new board
      this.shipSize = 5;
      this.shipAmount = 0;
      this.randomShipAll();
    }
  }

  setEvents(board, isGame) {
    const root = document.querySelector(`#${board}`);

    if (!isGame) {
      root.addEventListener('mouseover', event => {
        if (event.target !== event.currentTarget) {
          const location = this.parseLocation(event);
          const ship = this.getShip(location);
          this.checkAvailable(ship);
          this.hover(ship, true);
        }
      });
    }

    root.addEventListener('mouseout', event => {
      if (!isGame) {
        if (event.target !== event.currentTarget) {
          // hover ship off
          const location = this.parseLocation(event);
          const ship = this.getShip(location);
          this.hover(ship, false);
        }
      }
    });

    root.addEventListener('mousedown', event => {
      // LEFT-CLICK
      if (event.target !== event.currentTarget) {
        if (event.button === 0) {
          if (!isGame) {
            // get location
            const location = this.parseLocation(event);
            const ship = this.getShip(location);
            this.checkAvailable(ship);
            if (this.isAvailable && this.shipAmount <= 5) this.placeShip(ship);
          }

          if (isGame && this.currentPlayer === 'player' && this.canFire) {
            this.canFire = false;
            this.currentLocation = this.parseLocation(event);
            this.fireTorpedo();
            this.activeBoard.classList.add('wait');
          }
        }
      }

      // RIGHT-CLICK - vertical/horizontal ship
      if (!isGame) {
        if (event.button === 2) {
          // hover off current cells & toggle value of rotation
          const allHovered = document.querySelectorAll('.cell');
          allHovered.forEach(div => {
            div.classList.remove('ship-hover', 'ship-hover-alert');
          });
          this.rotation === true ? (this.rotation = false) : (this.rotation = true);
          const location = this.parseLocation(event);
          const ship = this.getShip(location);
          this.checkAvailable(ship);
          this.hover(ship, true);
        }
      }
    });

    // prevent context menu to open over board
    root.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
  }

  // Fleet setting functions

  hover(shipBody, isHover) {
    if (this.isAvailable) this.shipState = 'ship-hover';
    else this.shipState = 'ship-hover-alert';

    if (shipBody) this.toggleHover(shipBody, isHover);
  }

  toggleHover(cells, isHover) {
    cells.forEach(cell => {
      const selectedCell = this.selectCell(cell);
      if (isHover) {
        if (selectedCell) selectedCell.classList.add(this.shipState);
      } else {
        if (selectedCell) selectedCell.classList.remove(this.shipState);
      }
    });
  }

  placeShip(ship) {
    ship.forEach(segment => {
      const div = document.querySelector(
        `[data-location='${segment.board}-${segment.posX}-${segment.posY}']`
      );
      if (div) div.classList.add('ship');

      if (segment.board === 'player') {
        this.playerOneBoard[segment.posX][segment.posY] = 1;
      } else if (segment.board === 'ai') {
        this.playerTwoBoard[segment.posX][segment.posY] = 1;
      }
    });

    this.shipSize--;
    this.shipAmount++;

    if (this.shipSize === 0) {
      this.disableButton('randomShip');
      this.disableButton('randomShipAll');
      this.enableButton('startGame');
    }
  }

  randomShip() {
    let isPlaced = false;
    while (!isPlaced) {
      this.getRandomLocation();
      const ship = this.getShip(this.randomLocation, true);
      this.checkAvailable(ship);
      if (this.isAvailable) {
        this.placeShip(ship);
        isPlaced = true;
      }
    }
  }

  randomShipAll() {
    while (this.shipSize > 0) {
      this.randomShip();
    }
  }

  getRandomLocation() {
    this.randomLocation = {
      board: this.currentBoard,
      posX: Math.floor(Math.random() * this.boardSize),
      posY: Math.floor(Math.random() * this.boardSize)
    };
  }

  // Main game function

  startGame() {
    this.setView('game');

    this.drawBoard('player');
    this.drawBoard('score');
    this.setEvents('score', true);
    this.gameText = document.querySelector('#game-text');
    this.activeBoard = document.querySelector('#score');
    this.round();
    console.log(this.playerTwoBoard);
  }

  async round() {
    // init round count
    this.roundCount++;

    this.activeBoard.classList.add('wait');

    // player turn
    this.currentPlayer = 'player';
    this.canFire = true;
    let delay = 500;
    if (this.roundCount === 1) {
      delay = 2000;
    } else {
      delay = 500;
    }

    // change heading content to:
    // 1st round - wait 2s than show first round count
    // 2nd round+ - wait .5s than show next round count
    setTimeout(() => {
      this.gameText.innerHTML = `<h1>Round ${this.roundCount}<h1>`;
      this.gameText.innerHTML += `<h2>Your turn!</h2>`;
      this.activeBoard.classList.remove('wait');
    }, delay);

    // wait for player's move
    await this.turn();

    // check win
    this.checkIsWin();
    if (this.isWin) {
      this.win();
      return;
    }

    // AI turn
    this.currentPlayer = 'ai';
    this.canFire = true;
    this.gameText.innerHTML = `<h1>Round ${this.roundCount}<h1>`;
    this.gameText.innerHTML += `<h2>Wait for opponent's turn...</h2>`;

    console.log('Round', this.roundCount);
    // wait for player's move
    await this.turn();

    // check win
    this.checkIsWin();
    if (this.isWin) {
      this.win();
      return;
    }

    // start new round if no win
    this.round();
  }

  turn() {
    this.isFired = false;
    if (this.currentPlayer === 'ai' && this.canFire === true) this.fireTorpedo();
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.isFired) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  }

  pickRandomLocation() {
    let targetLocation = {};
    let validLocation = false;
    while (!validLocation) {
      // generates random X, Y for currently set board
      this.getRandomLocation();
      targetLocation = this.randomLocation;
      if (
        this.playerOneBoard[targetLocation.posX][targetLocation.posY] === 2 ||
        this.playerOneBoard[targetLocation.posX][targetLocation.posY] === 3
      )
        validLocation = false;
      else validLocation = true;
    }
    return targetLocation;
  }

  getNeighbours(currentLocation) {
    console.log('checking for neighbours of ', currentLocation);
    const { posX, posY } = currentLocation;
    const neighbours = {};

    // get all neighbours of current cell
    neighbours.top = {
      id: 'top',
      posX: posX - 1,
      posY: posY
    };
    neighbours.left = {
      id: 'left',
      posX: posX,
      posY: posY - 1
    };
    neighbours.right = {
      id: 'right',
      posX: posX,
      posY: posY + 1
    };
    neighbours.bottom = {
      id: 'bottom',
      posX: posX + 1,
      posY: posY
    };

    const { top, left, right, bottom } = neighbours;
    const validNeighbours = [];

    if (top.posX >= 0 && top.posX < this.boardSize && top.posY >= 0 && top.posY < this.boardSize) {
      validNeighbours.push(top);
    }
    if (
      left.posX >= 0 &&
      left.posX < this.boardSize &&
      left.posY >= 0 &&
      left.posY < this.boardSize
    ) {
      validNeighbours.push(left);
    }
    if (
      right.posX >= 0 &&
      right.posX < this.boardSize &&
      right.posY >= 0 &&
      right.posY < this.boardSize
    ) {
      validNeighbours.push(right);
    }
    if (
      bottom.posX >= 0 &&
      bottom.posX < this.boardSize &&
      bottom.posY >= 0 &&
      bottom.posY < this.boardSize
    ) {
      validNeighbours.push(bottom);
    }

    return validNeighbours;
  }

  checkForHitRows() {
    const allHits = [];
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.playerOneBoard[i][j] == 2) allHits.push({ posX: i, posY: j });
      }
    }
    console.log('all hits on the board', allHits);

    const horizontals = [];
    const verticals = [];
    for (let i = 1; i < allHits.length; i++) {
      if (allHits[i].posX - allHits[i - 1].posX == 0) {
        horizontals.push(allHits[i - 1]);
      }

      if (allHits[i].posY - allHits[i - 1].posY == 0) {
        verticals.push(allHits[i - 1]);
      }
    }

    if (horizontals.length) console.log('horizontals: ', horizontals);
    if (verticals.length) console.log('verticals: ', verticals);

    return {
      verticals,
      horizontals
    };
  }

  fireTorpedo() {
    let targetLocation = {};

    // player's turn
    if (this.currentPlayer === 'player') {
      this.currentBoard = 'score';
      targetLocation = this.currentLocation;
      const cell = this.selectCell(targetLocation);

      if (this.playerTwoBoard[targetLocation.posX][targetLocation.posY] === 1) {
        this.playerTwoBoard[targetLocation.posX][targetLocation.posY] = 2;
        cell.classList.add('hit');
      } else {
        this.playerTwoBoard[targetLocation.posX][targetLocation.posY] = 3;
        cell.classList.add('miss');
      }
      setTimeout(() => (this.isFired = true), 1000);
    }

    // AI turn
    if (this.currentPlayer === 'ai') {
      this.currentBoard = 'player';

      const rows = this.checkForHitRows();

      // if history[] empty pick random location
      if (!this.history.length) {
        this.isRandomHit = true;
        targetLocation = this.pickRandomLocation();
      } else {
        // check history for hit locations
        let hits = this.history.filter(entry => entry.isHit === true);
        const lastHit = hits[hits.length - 1];

        if (hits.length) {
          // console.log('hits log:', hits);
          const neighbours = this.getNeighbours(lastHit);
          let availableLocations = [];

          // check if all neighbouring locations are in the bounds of the borad

          // console.log('validNeighbours:', neighbours);

          availableLocations = neighbours.filter(item => {
            return (
              this.playerOneBoard[item.posX][item.posY] !== 2 &&
              this.playerOneBoard[item.posX][item.posY] !== 3
            );
          });
          console.log('availableLocations:', availableLocations);

          // check if last 5 hits were next to each other
          // AND determine in what direction next hit should be
          let nextHit = [];
          if (hits.length > 1) {
            const secondLastHit = hits[hits.length - 2];
            // console.log('last hit: ', lastHit);
            // console.log('2nd to last hit: ', secondLastHit);
            if (secondLastHit.posX - lastHit.posX == 0) {
              console.log('next hit should be horizontal');
              nextHit = availableLocations.filter(item => {
                if (item.id == 'left' || item.id == 'right') return item;
              });
            }

            if (secondLastHit.posY - lastHit.posY == 0) {
              console.log('next hit should be vertical');
              nextHit = availableLocations.filter(item => {
                if (item.id == 'top' || item.id == 'bottom') return item;
              });
            }

            if (lastHit.hasOwnProperty('id')) {
              let nextHitInDirection = nextHit.filter(hit => hit.id === lastHit.id);
              targetLocation = nextHitInDirection;
            }

            if (!availableLocations.length) {
              this.isRandomHit = true;
              targetLocation = this.pickRandomLocation();
            }
          } else {
            let randomIndex = Math.floor(Math.random() * availableLocations.length);
            targetLocation = availableLocations[randomIndex];
          }
        } else {
          this.isRandomHit = true;
          targetLocation = this.pickRandomLocation();
        }
      }

      let cell = this.selectCell(targetLocation, 'player');

      // 0 - empty space
      // 1 - ship
      // 2 - hit
      // 3 - miss

      // make pause for AI to 'make move'
      setTimeout(() => {
        if (this.playerOneBoard[targetLocation.posX][targetLocation.posY] === 1) {
          this.playerOneBoard[targetLocation.posX][targetLocation.posY] = 2;
          cell.classList.add('hit');
          this.isHit = true;
        } else {
          this.playerOneBoard[targetLocation.posX][targetLocation.posY] = 3;
          cell.classList.add('miss');
          this.isHit = false;
        }

        targetLocation.isHit = this.isHit;
        this.history.push(targetLocation);

        this.canFire = false;
        this.isFired = true;
        // setTimeout(() => this.isFired = true, 2000);
      }, 2000);
    }
  }

  checkIsWin() {
    let shipsLeft = 0;
    if (this.currentPlayer === 'player') {
      // const score = this.playerTwoBoard.filter(cell => cell === 2).reduce();
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (this.playerTwoBoard[i][j] === 1) shipsLeft++;
        }
      }
    }

    if (this.currentPlayer === 'ai') {
      // const score = this.playerTwoBoard.filter(cell => cell === 2).reduce();
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (this.playerOneBoard[i][j] === 1) shipsLeft++;
        }
      }
    }

    if (shipsLeft === 0) this.isWin = true;
  }

  win() {
    let winner = this.currentPlayer === 'player' ? 'You' : 'Opponent';
    this.gameText.innerHTML = `<h1>${winner} won the battle!<h1>`;
    const bTryAgain = this.newButton('tryAgain', 'Try again..');
    bTryAgain.addEventListener('click', () => this.createNewGame());
    this.gameText.appendChild(bTryAgain);
  }

  // helper functions
  newButton(name, desc, style) {
    const button = document.createElement('button');
    if (style) button.classList.add(style);
    button.id = name;
    button.innerHTML = desc;
    return button;
  }

  enableButton(name) {
    const button = document.querySelector(`#${name}`);
    button.disabled = false;
    button.classList.remove('disabled');
  }

  disableButton(name) {
    const button = document.querySelector(`#${name}`);
    button.disabled = true;
    button.classList.add('disabled');
  }

  parseLocation(event) {
    const { location } = event.target.dataset;
    return {
      board: location.split('-')[0],
      posX: parseInt(location.split('-')[1]),
      posY: parseInt(location.split('-')[2])
    };
  }

  getShip(location, isRandom = false) {
    if (isRandom) this.rotation = Boolean(Math.floor(Math.random() * 2));
    const shipBody = [];
    if (this.rotation) {
      // vertical
      for (let i = 0; i < this.shipSize; i++) {
        shipBody[i] = this.getTop(location, i);
      }
    } else {
      // horizontal
      for (let i = 0; i < this.shipSize; i++) {
        shipBody[i] = this.getLeft(location, i);
      }
    }
    return shipBody;
  }

  getTop(currentCell, amount) {
    if (currentCell.posX < 0) return false;
    const newTop = currentCell.posX - amount;
    return {
      board: currentCell.board,
      posX: newTop,
      posY: currentCell.posY
    };
  }

  getLeft(currentCell, amount) {
    if (currentCell.posY < 0) return false;
    const newLeft = currentCell.posY - amount;
    return {
      board: currentCell.board,
      posX: currentCell.posX,
      posY: newLeft
    };
  }

  selectCell(cell, board) {
    const targetBoard = board || cell.board;
    const selectedCell = document.querySelector(
      `[data-location='${targetBoard}-${cell.posX}-${cell.posY}']`
    );
    if (!selectedCell) return false;
    return selectedCell;
  }

  checkAvailable(cells) {
    let board = '';

    this.isAvailable = cells.every(cell => {
      cell.board === 'player' ? (board = this.playerOneBoard) : (board = this.playerTwoBoard);

      if (
        cell.posX >= 0 &&
        cell.posX < this.boardSize &&
        cell.posY >= 0 &&
        cell.posY < this.boardSize
      ) {
        this.isOnMap = true;
        board[cell.posX][cell.posY] === 1 ? (this.isEmpty = false) : (this.isEmpty = true);
      } else {
        this.isOnMap = false;
      }

      return this.isOnMap && this.isEmpty;
    });
  }
}

const gameContainer = document.querySelector('#game');
const game = new Game(gameContainer);
