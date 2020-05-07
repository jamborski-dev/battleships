const boardSize = 8;
const currentShipSize = 5;
let currentRotation = false;

// fill board array
const board = Array(boardSize).fill(0).map(() => Array(boardSize));

const setBoard = (root, size) => {
  for (let i = 0; i < size; i++) {
    // create rows
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < size; j++) {
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

const parseLocation = (location) => {
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

const hoverShipOn = (location, shipSize, rotation) => {
  const topCells = [];
  const leftCells = [];

  if (rotation) {
    for (let i = 0; i < shipSize; i++) {
      topCells[i] = getTop(location, i);
    }
  } else {
    for (let i = 0; i < shipSize; i++) {
      leftCells[i] = getLeft(location, i);
    }
  }

  if (topCells) {
    topCells.forEach((cell) => {
      const div = document.querySelector(`[data-location='${cell.posX}-${cell.posY}']`);
      if (div) div.classList.add('ship');
    });
  }

  if (leftCells) {
    leftCells.forEach((cell) => {
      const div = document.querySelector(`[data-location='${cell.posX}-${cell.posY}']`);
      if (div) div.classList.add('ship');
    });
  }
}

const hoverShipOff = (location, shipSize, rotation) => {
  const topCells = [];
  const leftCells = [];

  if (rotation) {
    for (let i = 0; i < shipSize; i++) {
      topCells[i] = getTop(location, i);
    }
  } else {
    for (let i = 0; i < shipSize; i++) {
      leftCells[i] = getLeft(location, i);
    }
  }

  if (topCells) {
    topCells.forEach((cell) => {
      const div = document.querySelector(`[data-location='${cell.posX}-${cell.posY}']`);
      if (div) div.classList.remove('ship');
    });
  }

  if (leftCells) {
    leftCells.forEach((cell) => {
      const div = document.querySelector(`[data-location='${cell.posX}-${cell.posY}']`);
      if (div) div.classList.remove('ship');
    });
  }
}

const hoverOffAll = () => {
  const allHovered = document.querySelectorAll('.ship');
  allHovered.forEach(div => {
    console.log(div);
    div.classList.remove('ship');
  });
}

// select container div
const boardDiv = document.querySelector("#board");

// Event Listeners
// --------------------------------------

// mouseover
boardDiv.addEventListener('mouseover', event => {
  if (event.target !== event.currentTarget) {
    const { location } = event.target.dataset;
    hoverShipOn(parseLocation(location), currentShipSize, currentRotation);
}});

// mouseout
boardDiv.addEventListener('mouseout', event => {
  if (event.target !== event.currentTarget) {
    const { location } = event.target.dataset;
    hoverShipOff(parseLocation(location), currentShipSize, currentRotation);
  }
});

// mouse click 
boardDiv.addEventListener('mousedown', event => {

  if (event.button === 2) {
    hoverOffAll();
    hoverShipOn(parseLocation(event.target.dataset.location), currentShipSize, currentRotation);
  
    // change current rotation [true: vertical, false: horizontal]
    if (currentRotation) {
      currentRotation = false;
    } else {
      currentRotation = true;
    }
  }
});

// prevent context menu to open over board
boardDiv.addEventListener('contextmenu', event => {
  event.preventDefault();
});

// init board
setBoard(boardDiv, boardSize);
