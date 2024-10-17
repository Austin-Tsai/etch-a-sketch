// variables
let isMouseDown = false;
let numSquares = 16; // default grid size
let color = "#000000"; // default color option
let draw = true; // keep track of if eraser mode is enabled (is true for all other modes)
let activeSquare = null; // keep track of square the cursor is in
let gridLines = true;
let isPaintBucketActive = false;
let rainbow = false;
let backgroundOn = true;
//undo and redo buttons
let undoStack = [];
let redoStack = [];
let squarePixels = 1; // default pixels per square in the downloaded image
let mouseX = 0;
let mouseY = 0;

const hiddenColorPicker = document.getElementById("hidden-color-picker");
const body = document.querySelector("body");
const grid = document.getElementById("grid");
const colorPicker = document.getElementById("color-picker");
const drawButton = document.getElementById("draw");
const eraserButton = document.getElementById("eraser");
const paintBucketButton = document.getElementById("paint-bucket");
const rainbowButton = document.getElementById("rainbow");
const gridButton = document.getElementById("grid-lines");
const clearButton = document.getElementById("clear");
const sizeChange = document.getElementById("size-change");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const downloadButton = document.getElementById("download");
const downloadChangeButton = document.getElementById("download-change");

//functions

// get a random rainbow color for rainbow mode
const getRandomRainbowColor = () => {
  const rainbowColors = [
    "#ff0000",
    "#ffa500",
    "#ffff00",
    "#008000",
    "#0000ff",
    "#4b0082",
    "#ee82ee",
  ];
  const randomIndex = Math.floor(Math.random() * rainbowColors.length);
  return rainbowColors[randomIndex];
};

// for highlighting a square with the correct color when the mouse hovers over it
const enter = (square) => {
  activeSquare = square; // make active square the one the mouse is in
  if (draw) {
    if (rainbow) {
      square.dataset.rainbow = getRandomRainbowColor();
      square.style.backgroundColor = square.dataset.rainbow;
    } else square.style.backgroundColor = color;
  } else square.style.backgroundColor = "transparent";
};

// reset color of the square when the mouse leaves it
const leave = (square) => {
  if (square === activeSquare) {
    activeSquare = null; // Clear active square if the mouse leaves
  }
  square.style.backgroundColor = square.dataset.color;
};

// change color of the selected square according to the drawing mode
const changeColor = (square, checkShift = false) => {
  // If paint bucket is active, color fill the area
  if (isPaintBucketActive) {
    paintBucket(square);
  } else {
    if (draw) {
      // bucket option for rainbow
      if (rainbow && checkShift) paintBucket(square, "rainbow");
      else if (rainbow) {
        square.dataset.color = square.dataset.rainbow;
        square.style.backgroundColor = square.dataset.color;
      } else {
        square.dataset.color = color;
        square.style.backgroundColor = square.dataset.color;
      }
    } else {
      // bucket option for erase
      if (checkShift) paintBucket(square, "transparent");
      else {
        square.dataset.color = "transparent";
        square.style.backgroundColor = "transparent";
      }
    }
  }
};

// set up algorithm to fill the area with the corresponding
const paintBucket = (square, replacementColor = color) => {
  const targetColor = square.dataset.color; // original color
  if (replacementColor === "rainbow") {
    // fill with rainbow pattern
    floodFill(square, targetColor, "rainbow");
  } else if (targetColor !== replacementColor) {
    // Only fill if colors are different
    floodFill(square, targetColor, replacementColor);
  }
};

// used with paintBucket
const floodFill = (square, targetColor, replacementColor) => {
  const queue = [square];
  const squares = document.querySelectorAll(".square");

  // prevent rainbow fill from changing the first square to a different color than hover color
  let first = true;

  while (queue.length > 0) {
    const currentSquare = queue.shift();
    // If the current square's color is not the intended target color, skip it
    if (currentSquare.dataset.color !== targetColor) continue;

    if (first && replacementColor === "rainbow") {
      first = false;
      currentSquare.dataset.color = currentSquare.dataset.rainbow;
      currentSquare.style.backgroundColor = currentSquare.dataset.rainbow;
    }

    // Update the square's color
    else if (replacementColor === "rainbow") {
      const random = getRandomRainbowColor();
      currentSquare.dataset.color = random;
      currentSquare.style.backgroundColor = random;
    } else {
      currentSquare.dataset.color = replacementColor;
      currentSquare.style.backgroundColor = replacementColor;
    }

    // Get the index of the current square
    const index = Array.from(squares).indexOf(currentSquare);
    const row = Math.floor(index / numSquares);
    const col = index % numSquares;

    // Check neighboring squares (up, down, left, right)
    if (row > 0) queue.push(squares[index - numSquares]); // Up
    if (row < numSquares - 1) queue.push(squares[index + numSquares]); // Down
    if (col > 0) queue.push(squares[index - 1]); // Left
    if (col < numSquares - 1) queue.push(squares[index + 1]); // Right
  }
};

// makes the grid the canvas is on
const createGrid = () => {
  for (let i = 0; i < numSquares; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < numSquares; j++) {
      const square = document.createElement("div");
      square.classList.add("square");

      // initialize and declare attributes to each square in the grid
      square.dataset.color = "transparent";
      square.dataset.rainbow = getRandomRainbowColor();
      square.style.width = `${640 / numSquares}px`;
      square.style.height = `${640 / numSquares}px`;
      if (gridLines) {
        square.style.borderRightWidth = `${1 / numSquares}px`;
        square.style.borderBottomWidth = `${1 / numSquares}px`;
      } else {
        square.style.border = "none";
      }

      // interaction between mouse and square to draw
      square.addEventListener("mouseenter", () => {
        enter(square);
      });
      square.addEventListener("mouseleave", () => {
        leave(square);
      });
      square.addEventListener("mouseover", (event) => {
        if (isMouseDown) {
          if (event.shiftKey) changeColor(square, true); // for bucket options
          else changeColor(square);
        }
      });

      row.appendChild(square);
    }
    grid.appendChild(row);
  }
};

// used for clear button
const resetColors = () => {
  document.querySelectorAll(".square").forEach((square) => {
    square.dataset.color = "transparent"; // Clear the dataset color
    square.style.backgroundColor = "transparent"; // Reset the background color
  });
};

// toggles the grid lines for the user to get a better view of the canvas
const toggleGridLines = () => {
  if (gridLines) {
    document.querySelectorAll(".square").forEach((square) => {
      square.style.border = "none";
    });
    gridLines = false;
  } else {
    document.querySelectorAll(".square").forEach((square) => {
      square.style.borderRight = `solid #000000 ${1 / numSquares}px`;
      square.style.borderBottom = `solid #000000 ${1 / numSquares}px`;
    });
    gridLines = true;
  }
};

// changes the amount of squares in the grid according to user input
const changeSize = () => {
  let result;
  do {
    result = +prompt(
      "Choose the number of squares in the grid per row/column: 1-100 (0 exits)"
    );
  } while (
    Number.isNaN(result) ||
    !Number.isInteger(result) ||
    result < 0 ||
    result > 100
  );
  if (result !== 0) {
    numSquares = result;
    grid.innerHTML = "";
    createGrid();
    changeMode("draw");
  }
};

const downloadGrid = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // set squareSize based on squarePixels
  const squareSize = squarePixels;
  canvas.width = squareSize * numSquares;
  canvas.height = squareSize * numSquares;

  // mirror image so the png matches the view of the grid
  ctx.scale(-1, 1); // flip horizontally
  ctx.translate(-canvas.width, 0); // translate back to the original position

  ctx.translate(canvas.width / 2, canvas.height / 2); // move to center
  ctx.rotate(Math.PI / 2); // rotate 90 degrees
  ctx.translate(-canvas.height / 2, -canvas.width / 2); // move back to the top left

  // draw each square
  document.querySelectorAll(".square").forEach((square, index) => {
    const x = (index % numSquares) * squareSize; // calculate x position
    const y = Math.floor(index / numSquares) * squareSize; // calculate y position

    // Set the fill color to the square's dataset color
    ctx.fillStyle = square.dataset.color || "transparent"; // fallback to transparent
    ctx.fillRect(x, y, squareSize, squareSize); // draw the square
  });

  // convert canvas to Blob and save it
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, "sketch-image.png"); // prompt the user to save the file
    } else {
      console.error("Blob conversion failed.");
    }
  }, "image/png");
};

// changes the pixels per square in the downloaded image according to user input
const downloadSize = () => {
  let result;
  do {
    result = +prompt(
      "Choose the number of pixels each square in the grid takes up in the downloaded image: 1-128 (0 exits, 1 is default)"
    );
  } while (
    Number.isNaN(result) ||
    !Number.isInteger(result) ||
    result < 0 ||
    result > 128
  );
  if (result !== 0) {
    squarePixels = result;
  }
};

const undo = () => {
  if (undoStack.length > 0) {
    // save current state to be put in the redo stack
    const currentState = Array.from(document.querySelectorAll(".square")).map(
      (square) => square.dataset.color
    );
    redoStack.push(currentState);
    // redo stack is not empty
    redoButton.setAttribute(
      "style",
      "color: #ffffff; background-color: #bdbcbc; border-color: #717171;"
    );

    // revert to previous state
    const lastState = undoStack.pop();
    applyState(lastState);

    // save new state if user is still drawing while undoing
    if (isMouseDown) captureState();

    // if undo stack is now empty, change appearance
    if (undoStack.length == 0)
      undoButton.setAttribute(
        "style",
        "color: none; background-color: none; border-color: none;"
      );

    if (activeSquare) enter(activeSquare); // update square hovering effect
  }
};

const redo = () => {
  if (redoStack.length > 0) {
    // save current state to be put in the undo stack
    const currentState = Array.from(document.querySelectorAll(".square")).map(
      (square) => square.dataset.color
    );
    undoStack.push(currentState);

    // undo stack is not empty
    undoButton.setAttribute(
      "style",
      "color: #ffffff; background-color: #bdbcbc; border-color: #717171;"
    );

    // revert to previous state
    const nextState = redoStack.pop();
    applyState(nextState);

    // if redo stack is now empty, change appearance
    if (redoStack.length == 0)
      redoButton.setAttribute(
        "style",
        "color: none; background-color: none; border-color: none;"
      );
    if (activeSquare) enter(activeSquare); // update square hovering effect
  }
};

// save state to be used for undo and redo calls
const captureState = () => {
  // allow for an undo as a new action was made
  const currentState = Array.from(document.querySelectorAll(".square")).map(
    (square) => square.dataset.color
  );
  undoStack.push(currentState);

  // indicate undo stack is not empty now
  undoButton.setAttribute(
    "style",
    "color: #ffffff; background-color: #bdbcbc; border-color: #717171;"
  );

  redoStack = []; // Clear redo stack on new action
  // indicate redo stack is empty now
  redoButton.setAttribute(
    "style",
    "color: none; background-color: none; border-color: none;"
  );
};

// function to apply a state to the grid
const applyState = (state) => {
  document.querySelectorAll(".square").forEach((square, index) => {
    square.dataset.color = state[index];
    square.style.backgroundColor = state[index];
  });
};

const keyPress = (event) => {
  // shortcuts for undoing and redoing
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const isUndo = (isMac ? event.metaKey : event.ctrlKey) && event.key === "z";
  const isRedo =
    (isMac ? event.metaKey : event.ctrlKey) &&
    (event.key === "y" || (event.key === "Z" && event.shiftKey)); // shift + Z for redo

  if (isUndo) {
    event.preventDefault();
    undo();
  } else if (isRedo) {
    event.preventDefault();
    redo();
  } else {
    // shortcuts to change drawing mode
    let key = Number(event.key);
    if (!(isNaN(key) || event.key === null || event.key === " ")) {
      if (key >= 3 && key <= 6) {
        let button; // indicate the corresponding button for each shortcut
        let color; // used to replicate the effect of a button being pressed
        if (key === 3) {
          button = drawButton;
          color = "#f4c55f";
          changeMode("draw");
        } else if (key === 4) {
          button = eraserButton;
          color = "#f6abde";
          changeMode("eraser");
        } else if (key === 5) {
          button = paintBucketButton;
          color = "#78bfda";
          changeMode("bucket");
        } else if (key === 6) {
          button = rainbowButton;
          changeMode("rainbow");
        }
        // if draw mode is changed while hovering over a square, update the hover effect
        if (activeSquare) enter(activeSquare);

        // replicate the effect of the corresponding button being clicked
        button.classList.add("hover");
        button.style.backgroundColor = color;
        setTimeout(() => {
          button.classList.add("active");
        }, 150);
        setTimeout(() => {
          button.style.backgroundColor = null;
          button.classList.remove("hover");
          button.classList.remove("active");
        }, 150);
      } else if (key === 2) {
        // active color picker next to mouse
        hiddenColorPicker.value = colorPicker.value;
        hiddenColorPicker.style.left = `${mouseX - 75}px`;
        hiddenColorPicker.style.top = `${mouseY - 50}px`;
        hiddenColorPicker.style.display = "block";

        // timeout for 0ms because for some reason no timeout makes the color picker appear in the corner
        setTimeout(() => {
          hiddenColorPicker.click();
        }, 0);
      } else if (key === 1) {
        if (
          activeSquare &&
          activeSquare.dataset.color !== "transparent" &&
          draw &&
          !rainbow
        ) {
          hiddenColorPicker.value =
            colorPicker.value =
            color =
              activeSquare.dataset.color;
          enter(activeSquare);
        }
      } else if (key === 7) {
        if (backgroundOn) {
          document.body.style.backgroundImage = "none";
          backgroundOn = false;
        } else {
          document.body.style.backgroundImage =
            "url('./assets/pix-art-background.png')";
            backgroundOn = true;
        }
      }
    }
  }
};

const changeMode = (mode) => {
  let cursor = "";
  draw = true;
  rainbow = false;
  isPaintBucketActive = false;
  switch (mode) {
    case "draw":
      cursor = "fixed-paint-cursor.cur";
      break;
    case "eraser":
      draw = false;
      cursor = "fixed-eraser-cursor.cur";
      break;
    case "bucket":
      isPaintBucketActive = true;
      cursor = "fixed-bucket-cursor.cur";
      break;
    case "rainbow":
      rainbow = true;
      cursor = "fixed-rainbow-cursor.cur";
      break;
  }
  document
    .querySelectorAll(".square")
    .forEach(
      (square) => (square.style.cursor = `url(./assets/${cursor}), auto`)
    );
};

// event listeners
// grid/body
grid.addEventListener("mousedown", (event) => {
  event.preventDefault();
  isMouseDown = true;
  const square = event.target.closest(".square");
  if (square) {
    captureState(); // for undo/redo functions

    // change first square mouse is on when dragging and allow for clicking
    if (event.shiftKey) changeColor(square, true);
    else changeColor(square);
  }
});
body.addEventListener("mouseup", () => {
  isMouseDown = false;
});
document.addEventListener("keydown", (event) => keyPress(event)); // keyboard shortcuts
// updates mouse coordinates
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});
// initialize mouse coordinates to a place other than 0,0
document.addEventListener("DOMContentLoaded", () => {
  mouseX = window.innerWidth / 2;
  mouseY = window.innerWidth / 2;
});
// makes hidden color picker disappear when clicked off of
document.addEventListener("click", (event) => {
  if (!hiddenColorPicker.contains(event.target)) {
    hiddenColorPicker.style.display = "none";
  }
});
// matches color picker values
hiddenColorPicker.addEventListener("input", () => {
  color = hiddenColorPicker.value;
  colorPicker.value = hiddenColorPicker.value;
});

// sidebar buttons
colorPicker.addEventListener("input", function () {
  color = colorPicker.value;
});
drawButton.addEventListener("click", () => {
  changeMode("draw");
});
eraserButton.addEventListener("click", () => {
  changeMode("eraser");
});
paintBucketButton.addEventListener("click", () => {
  changeMode("bucket");
});
rainbowButton.addEventListener("click", () => {
  changeMode("rainbow");
});
gridButton.addEventListener("click", toggleGridLines);
clearButton.addEventListener("click", () => {
  captureState(); // allow for undoing/redoing
  resetColors();
});
downloadButton.addEventListener("click", () => downloadGrid());
downloadChangeButton.addEventListener("click", downloadSize);
sizeChange.addEventListener("click", changeSize);
undoButton.addEventListener("click", () => undo());
redoButton.addEventListener("click", () => redo());

createGrid();
window.onbeforeunload = function(e) {
  return 'Are you sure you want to close the page?';
};