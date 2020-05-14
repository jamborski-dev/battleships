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

    // this.playerOneBoard = [
    //   [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],  // 0
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 1
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 2
    //   [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],  // 3
    //   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0],  // 4
    //   [0, 0, 1, 0, 0, 1, 0, 0, 0, 0],  // 5
    //   [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],  // 6
    //   [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],  // 7
    //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],  // 8
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // 9
    // ];

    // this.playerTwoBoard = [
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 0
    //   [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],  // 1
    //   [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],  // 2
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 3
    //   [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],  // 4
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 5
    //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],  // 6
    //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],  // 7
    //   [0, 0, 0, 0, 1, 1, 1, 1, 0, 0],  // 8
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // 9
    // ];
    
    // this.scoreBoard = [
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 0
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 1
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 2
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 3
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 4
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 5
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 6
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 7
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 8
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // 9
    // ];

    this.playerOneBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
    this.playerTwoBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
    this.scoreBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
    // setView('start') off for dev
    this.setView('setting');
    // this.startGame();
    this.createGame();
  }

  setView(setting) {
    const view = document.createElement('div');
    view.classList.add(setting);
    switch (setting) {
      case 'start':
        const startGameButton = document.createElement('button');
        startGameButton.innerHTML = 'Start new game';
        startGameButton.addEventListener('click', () => {
          this.createGame();
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
        left.innerHTML = `<h1>Let's play!</h1>`;

        const playerBoard = document.createElement('div');
        playerBoard.id = 'player';
        playerBoard.classList.add('board');

        left.appendChild(playerBoard);

        // RIGHT
        const right = document.createElement('div');
        right.innerHTML = `<h1>Target opponent's fleet here</h1>`;

        const targetBoard = document.createElement('div');
        targetBoard.id = 'target';
        targetBoard.classList.add('board');

        right.appendChild(targetBoard);

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

  createGame() {
    this.setView('setting');
    this.setBoardFor('player'); 
  }

  drawBoard (board) {
    const root = document.querySelector(`#${board}`);
    let targetContent = []
    if (board === 'player') targetContent = this.playerOneBoard;
    if (board === 'target') targetContent = this.scoreBoard;
    
    targetContent.forEach((arr, i) => {
      const row = document.createElement('div');
      row.classList.add('row');

      arr.forEach((item, j) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (item === 1) cell.classList.add('ship');

        cell.setAttribute("data-location", `${board}-${i}-${j}`);       
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

    root.addEventListener('mouseover', event => {
      if (event.target !== event.currentTarget) { 
        // hover ship on
        const location = this.parseLocation(event);
        const ship = this.getShip(location);
        this.checkAvailable(ship);
        this.hover(ship, true);
    }});

    root.addEventListener('mouseout', event => {
      if (event.target !== event.currentTarget) {
        // hover ship off
        const location = this.parseLocation(event);
        const ship = this.getShip(location);
        this.hover(ship, false);
      }
    });

    root.addEventListener('mousedown', event => {
      // LEFT-CLICK
      if (event.button === 0) {
        // get location
        const location = this.parseLocation(event);
        const ship = this.getShip(location);
        this.checkAvailable(ship);
        if (this.isAvailable && this.shipAmount <= 5) this.placeShip(ship);
        // console.log('Ships amount', this.shipAmount);
        // console.log('Ships size', this.shipSize);
      }  

      // RIGHT-CLICK - vertical/horizontal ship
      if (event.button === 2) {
        // hover off current cells & toggle value of rotation
        const allHovered = document.querySelectorAll('.cell');
        allHovered.forEach(div => {
          div.classList.remove('ship-hover', 'ship-hover-alert');
        });
        this.rotation === true ? this.rotation = false : this.rotation = true;
        const location = this.parseLocation(event);
        const ship = this.getShip(location);
        this.checkAvailable(ship);
        this.hover(ship, true);
      }
    });

    // prevent context menu to open over board
    root.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
  }

  // Fleet setting functions;

  hover (shipBody, isHover) {
    if (this.isAvailable) this.shipState = 'ship-hover';
    else this.shipState = 'ship-hover-alert';
  
    if (shipBody) this.toggleHover(shipBody, isHover);
  }

  toggleHover (cells, isHover) {
    cells.forEach(cell => {
      const selectedCell = this.selectCell(cell);
      if (isHover) {
        if (selectedCell) selectedCell.classList.add(this.shipState);
      } else {
        if (selectedCell) selectedCell.classList.remove(this.shipState);
      }
    });
  }

  placeShip (ship) {
    ship.forEach(segment => {
      const div = document.querySelector(`[data-location='${segment.board}-${segment.posX}-${segment.posY}']`);
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
    };
  }

  randomShip () {
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

  randomShipAll () {
    while (this.shipSize > 0) {
      this.randomShip();
    }
  }

  getRandomLocation () {
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
    this.drawBoard('target');
  }

  win() {}

  // helper functions
  newButton (name, desc, style) {
    const button = document.createElement('button');
    if (style) button.classList.add(style);
    button.id = name;
    button.innerHTML = desc;
    return button;
  }

  enableButton (name) {
    const button = document.querySelector(`#${name}`);
    button.disabled = false;
    button.classList.remove('disabled');
  }

  disableButton (name) {
    const button = document.querySelector(`#${name}`);
    button.disabled = true;
    button.classList.add('disabled');
  }

  parseLocation (event) {
    const { location } = event.target.dataset;
    return {
      board: location.split('-')[0],
      posX: parseInt(location.split('-')[1]),
      posY: parseInt(location.split('-')[2])
    }
  }

  getShip (location, isRandom = false) {
    if (isRandom) this.rotation = Boolean(Math.floor(Math.random() * 2));
    const shipBody = [];
    if (this.rotation) { // vertical
      for (let i = 0; i < this.shipSize; i++) {
        shipBody[i] = this.getTop(location, i);
      }
    } else { // horizontal
      for (let i = 0; i < this.shipSize; i++) {
        shipBody[i] = this.getLeft(location, i);
      }
    }
    return shipBody;
  }

  getTop (currentCell, amount) {
    if (currentCell.posX < 0) return false;
    const newTop = currentCell.posX - amount;
    return {
      board: currentCell.board,
      posX: newTop,
      posY: currentCell.posY
    }
  }
  
  getLeft (currentCell, amount) {
    if (currentCell.posY < 0) return false;
    const newLeft = currentCell.posY - amount;
    return {
      board: currentCell.board,
      posX: currentCell.posX,
      posY: newLeft
    }
  }

  selectCell (cell) {
    const selectedCell = document.querySelector(`[data-location='${cell.board}-${cell.posX}-${cell.posY}']`);
    if (!selectedCell) return false;
    return selectedCell;
  }

  checkAvailable (cells) {
    let board = '';
    
    this.isAvailable = cells.every(cell => {
      cell.board === 'player' ? board = this.playerOneBoard : board = this.playerTwoBoard;
      
      if (cell.posX >= 0 && cell.posX < this.boardSize && cell.posY >= 0 && cell.posY < this.boardSize) {
        this.isOnMap = true;
        board[cell.posX][cell.posY] === 1 ? this.isEmpty = false : this.isEmpty = true;
      } else {
        this.isOnMap = false;
      }
  
      return this.isOnMap && this.isEmpty;
    });
  }
}

const gameContainer = document.querySelector('#game');
const game = new Game(gameContainer);