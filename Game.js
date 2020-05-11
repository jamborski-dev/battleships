class Game {
  constructor(root) {
    this.root = root;
    this.boardSize = 10;
    this.playerOneBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
    this.playerTwoBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
    this.scoreBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
    // setView('start') off for dev
    // this.setView('start');
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
        const header = document.createElement('h1');
        header.innerHTML = 'Set your fleet';
        const legend = document.createElement('legend');
        legend.innerHTML = `
          <strong>Left-click</strong> to place ship<br>
          <strong>Right-click</strong> to change rotation
          `;

        const settingBoard = document.createElement('div');
        settingBoard.id = 'settingBoard';
        settingBoard.classList.add('board');

        const bRandomShip = this.newButton('randomShip', 'Random next ship', this.randomShip);
        const bRandomShipAll = this.newButton('randomShipAll', 'Random all fleet', this.randomShipAll);

        view.appendChild(header);
        view.appendChild(legend);
        view.appendChild(settingBoard);
        view.appendChild(bRandomShip);
        view.appendChild(bRandomShipAll);
        
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

    // 2. Show board setting screen for the player
    //    1. Board
    //    2. 'Random ships' button
    //    3. 'Clear board' button
    //    4. 'Undo' button
    // 3. Randomly set AI's board
    this.setBoardFor('ai');
    // 4. Show 'Start game' button with action to:
    //    Game.startGame()
  }

  setBoardFor(player) {
    if (player === 'player') {
      // draw new empty board to the screen
      const board = document.querySelector('#settingBoard');
      this.drawBoard(board);

      // enable Events setEvents(rootElement, isGame);
      this.setEvents(board, false);
    } else if (player === 'ai') {
      // init new board
      // randomize ship setting
    }
  }

  drawBoard (root) {
    for (let i = 0; i < this.boardSize; i++) {
      // create rows
      const row = document.createElement("div");
      row.classList.add("row");
  
      for (let j = 0; j < this.boardSize; j++) {
        // create columns
        const cell = document.createElement("div");
        cell.classList.add("cell");
  
        // set location for each cell
        //  data-location attr in HTML elements
        cell.setAttribute("data-location", `${root.id}-${i}-${j}`);
        row.appendChild(cell);
      }  
      root.appendChild(row);
    }
  }

  setEvents(root, isGame) {
    root.addEventListener('mouseover', event => {
      if (event.target !== event.currentTarget) {
        console.log('mouse over');
    }});

    root.addEventListener('mouseout', event => {
      if (event.target !== event.currentTarget) {
        console.log('mouse out');
      }
    });

    root.addEventListener('mousedown', event => {
      console.log('mouse click');
    });

    // prevent context menu to open over board
    root.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
  }

  // Fleet setting functions;
  randomShip () {
    console.log('New random ship');
  }

  randomShipAll () {
    console.log('All random fleet');
  }

  // Main game function

  startGame() {
    // 1. Show player's fleet
    // 2. Show targeting board
    // 3. Start round (loop until WIN)
    //    1. Fire players torpedo
    //    2. Update targeting board
    //    3. Check if WIN
    //    4. Switch players (Player => AI || AI => Player)
  }

  win() {}

  // helper functions
  newButton (name, desc, action) {
    const button = document.createElement('button');
    button.id = name;
    button.innerHTML = desc;
    button.addEventListener('click', () => {
      action();
    });
    return button;
  }
}

const gameContainer = document.querySelector('#game');
const game = new Game(gameContainer);