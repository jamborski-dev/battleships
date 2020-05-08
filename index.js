const boardSize = 10;
const shipSize = 5;
let rotation = true;
let isOnMap = true;
let shipState = 'ship-hover';


// fill board array
const board = Array(boardSize).fill(0).map(() => Array(boardSize));

// set HTML board & set 'data-location' attr for each cell
const setBoard = (root) => {
  for (let i = 0; i < boardSize; i++) {
    // create rows
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < boardSize; j++) {
      // create columns
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // set location for each cell
      //  data-location attr in HTML elements
      cell.setAttribute("data-location", `${i}-${j}`);
      row.appendChild(cell);
    }

    root.appendChild(row);
  }
}

// helper functions
const parseLocation = (event) => {
  const { location } = event.target.dataset;
  return {
    posX: parseInt(location.split('-')[0]),
    posY: parseInt(location.split('-')[1])
  }
}

const getTop = (currentCell, amount) => {
  if (currentCell.posX < 0) return false;
  const newTop = currentCell.posX - amount;
  return {
    posX: newTop,
    posY: currentCell.posY
  }
}

const getLeft = (currentCell, amount) => {
  if (currentCell.posY < 0) return false;
  const newLeft = currentCell.posY - amount;
  return {
    posX: currentCell.posX,
    posY: newLeft
  }
}

const getCell = (cell) => {
  const selectedCell = document.querySelector(`[data-location='${cell.posX}-${cell.posY}']`);
  if (!selectedCell) return false;
  return selectedCell;
}

// show ship to set it on board / right-click to change rotation
const hoverShip = (event, isHover, isClick = false) => {
  const topCells = [];
  const leftCells = [];
  const location = parseLocation(event);

  // if 'rotatation' === true ship is vertical, if false horizontaly
  // get all cells of the ship and store it in the top or left array
  if (rotation) {
    for (let i = 0; i < shipSize; i++) {
      topCells[i] = getTop(location, i);
    }
  } else {
    for (let i = 0; i < shipSize; i++) {
      leftCells[i] = getLeft(location, i);
    }
  }

  // check if whole ship is inside the board
  if (topCells) checkBounds(topCells);
  if (leftCells) checkBounds(leftCells);

  if (!isClick) {
  // if either arrays is not empty select all cells and add or remove class of 'ship'
    if (topCells) toggleHover(topCells, isHover);
    if (leftCells) toggleHover(leftCells, isHover);
  } else {
    if (!isOnMap) return;
    // OR place ship at this position
    if (topCells) placeShip(topCells);
    if (leftCells) placeShip(leftCells);
  }
}

const toggleHover = (cells, isHover) => {
  cells.forEach(cell => {
    const ship = getCell(cell);
    if (isHover) {
      if (ship) ship.classList.add(shipState);
    } else {
      if (ship) ship.classList.remove(shipState);
    }
  });
}

const checkBounds = (cells) => {
  cells.forEach(cell => {
    if (!getCell(cell)) {
      isOnMap = false;
      return;
    } else { isOnMap = true } 
  });

  if (isOnMap) {
    shipState = 'ship-hover';
  } else { 
    shipState = 'ship-hover-alert'
  }
}

const hoverOffAll = () => {
  const allHovered = document.querySelectorAll('.ship-hover');
  allHovered.forEach(div => {
    div.classList.remove('ship-hover');
  });
}

// place ship where hovered
const placeShip = (cells) => {
  cells.forEach((cell) => {
    const div = document.querySelector(`[data-location='${cell.posX}-${cell.posY}']`);
    if (div) div.classList.add('ship');
  });
}





// Event Listeners & board initialisation
// ---------------------------------------------------------

// select container div & init boarrd
const boardDiv = document.querySelector("#board");
setBoard(boardDiv, boardSize);

// mouseover
boardDiv.addEventListener('mouseover', event => {
  if (event.target !== event.currentTarget) {
    hoverShip(event, true);
}});

// mouseout
boardDiv.addEventListener('mouseout', event => {
  if (event.target !== event.currentTarget) {
    hoverShip(event, false);
  }
});

// mouse click 
boardDiv.addEventListener('mousedown', event => {
  if (event.button === 2) { // right-click
    hoverOffAll();
  
    // change current rotation [true: vertical, false: horizontal]
    rotation ? rotation = false : rotation = true;
    hoverShip(event, true); 
  }

  if (event.button === 0) { // left-click
    hoverShip(event, true, true); // 3rd arg as true will place ship at current location
  }
});

// prevent context menu to open over board
boardDiv.addEventListener('contextmenu', event => {
  event.preventDefault();
});
