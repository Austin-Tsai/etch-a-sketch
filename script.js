const enter = (square) => {
  if (draw) {
    if (rainbow) {
      square.dataset.rainbow = getRandomRainbowColor();
      square.style.backgroundColor = square.dataset.rainbow;
    } else square.style.backgroundColor = color;
  } else square.style.backgroundColor = "transparent";
};

const leave = (square) => {
  square.style.backgroundColor = square.dataset.color;
};

const changeColor = (square) => {
  if (isPaintBucketActive) {
    // If paint bucket is active, fill the area
    paintBucket();
  } else {
    if (draw) {
      if (rainbow) {
        square.dataset.color = square.dataset.rainbow;
        square.style.backgroundColor = square.dataset.color;
      } else {
        square.dataset.color = color;
        square.style.backgroundColor = square.dataset.color;
      }
    } else {
      square.dataset.color = "transparent";
      square.style.backgroundColor = "transparent";
    }
  }
};

const paintBucket = (square) => {
  const targetColor = square.dataset.color; // Original color to replace
  const replacementColor = color; // New color

  if (targetColor !== replacementColor) { // Only fill if colors are different
    floodFill(square, targetColor, replacementColor);
  }
};

const floodFill = (square, targetColor, replacementColor) => {
  const queue = [square];
  const squares = document.querySelectorAll('.square');

  while (queue.length > 0) {
    const currentSquare = queue.shift();

    // If the current square's color is not the target color, skip it
    if (currentSquare.dataset.color !== targetColor) continue;

    // Update the square's color
    currentSquare.dataset.color = replacementColor;
    currentSquare.style.backgroundColor = replacementColor;

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

const getRandomRainbowColor = () => {
  const rainbowColors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];
  const randomIndex = Math.floor(Math.random() * rainbowColors.length);
  return rainbowColors[randomIndex];
};

const resetColors = () => {
  document.querySelectorAll(".square").forEach((square) => {
    square.dataset.color = "transparent"; // Clear the dataset color
    square.style.backgroundColor = "transparent"; // Reset the background color
  });
};

const toggleGridLines = () => {
  if (gridLines) {
    document.querySelectorAll(".square").forEach((square) => {
      square.style.border = "none";
    });
    gridLines = false;
  } else {
    document.querySelectorAll(".square").forEach((square) => {
      square.style.borderRight = `solid #000 ${1 / numSquares}px`;
      square.style.borderBottom = `solid #000 ${1 / numSquares}px`;
    });
    gridLines = true;
  }
};

const changeSize = () => {
  let result;
  do {
    result = +prompt(
      "Choose the number of squares in the grid per row/column 1-100 (0 exits)"
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
  }
};

const createGrid = () => {
  for (let i = 0; i < numSquares; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < numSquares; j++) {
      const square = document.createElement("div");
      square.classList.add("square");

      square.dataset.color = "transparent";
      square.dataset.rainbow = getRandomRainbowColor();
      square.style.width = `${560 / numSquares}px`;
      square.style.height = `${560 / numSquares}px`;
      if (gridLines) {
        square.style.borderRightWidth = `${1 / numSquares}px`;
        square.style.borderBottomWidth = `${1 / numSquares}px`;
      } else {
        square.style.border = "none";
      }
      square.addEventListener("mouseenter", () => enter(square));
      square.addEventListener("mouseleave", () => leave(square));

      square.addEventListener("mouseover", () => {
        if (isMouseDown) {
          changeColor(square);
        }
      });

      square.addEventListener("click", () => changeColor(square));

      row.appendChild(square);
    }
    grid.appendChild(row);
  }
};

const body = document.querySelector("body");
const grid = document.getElementById("grid");
const colorPicker = document.getElementById("color-picker");

let isMouseDown = false;

// Set up event listeners for the grid
grid.addEventListener("mousedown", () => {
  event.preventDefault();
  isMouseDown = true;
  const square = event.target.closest(".square");
  if (square) {
    captureState();
    changeColor(square);
  }
});

grid.addEventListener("click", (event) => {
  const square = event.target.closest(".square");
  if (square) {
    if (isPaintBucketActive) {
      paintBucket(square);
    } else {
      changeColor(square); // Regular color change logic
    }
  }
});

grid.addEventListener("mouseup", () => {
  isMouseDown = false;
});
grid.addEventListener("mouseenter", () => {
  color = colorPicker.value;
});
body.addEventListener("mouseup", () => {
  isMouseDown = false;
});

let draw = true;

const drawButton = document.getElementById("draw");
drawButton.addEventListener("click", () => {
  draw = true;
  rainbow = false;
  isPaintBucketActive = false;
  // document
  //   .querySelectorAll(".square")
  //   .forEach((square) => (square.style.cursor = "pointer"));
});

const eraserButton = document.getElementById("eraser");
eraserButton.addEventListener("click", () => {
  draw = false;
  isPaintBucketActive = false;
  // document
  //   .querySelectorAll(".square")
  //   .forEach(
  //     (square) =>
  //       (square.style.cursor = "url(./assets/eraser-cursor.png), auto")
  //   );
});

const paintBucketButton = document.getElementById("paint-bucket");
let isPaintBucketActive = false;

paintBucketButton.addEventListener("click", () => {
  draw = true;
  isPaintBucketActive = true;
});

const rainbowButton = document.getElementById("rainbow");
let rainbow = false;
rainbowButton.addEventListener("click", () => {
  draw = true;
  rainbow = true;
  isPaintBucketActive = false;
});

const gridButton = document.getElementById("grid-lines");
let gridLines = true;
gridButton.addEventListener("click", toggleGridLines);

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", resetColors);

const sizeChange = document.getElementById("size-change");
sizeChange.addEventListener("click", changeSize);
let numSquares = 16;

let color = "#000";
createGrid();

const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");

undoButton.addEventListener("click", () => undo());
redoButton.addEventListener("click", () => redo());
//undo and redo buttons
let undoStack = [];
let redoStack = [];

const undo = () => {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop();
    const currentState = Array.from(document.querySelectorAll(".square")).map(
      (square) => square.dataset.color
    );
    redoStack.push(currentState);
    applyState(lastState);
  }
};

const redo = () => {
  if (redoStack.length > 0) {
    const nextState = redoStack.pop();
    const currentState = Array.from(document.querySelectorAll(".square")).map(
      (square) => square.dataset.color
    );
    undoStack.push(currentState);
    applyState(nextState);
  }
};

const captureState = () => {
  const currentState = Array.from(document.querySelectorAll(".square")).map(
    (square) => square.dataset.color
  );
  undoStack.push(currentState);
  redoStack = []; // Clear redo stack on new action
};

// Function to apply a state to the grid
const applyState = (state) => {
  document.querySelectorAll(".square").forEach((square, index) => {
    square.dataset.color = state[index];
    square.style.backgroundColor = state[index];
  });
};

document.addEventListener("keydown", (event) => {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const isUndo = (isMac ? event.metaKey : event.ctrlKey) && event.key === "z";
  const isRedo =
    (isMac ? event.metaKey : event.ctrlKey) &&
    (event.key === "y" || (event.key === "Z" && event.shiftKey)); // Shift + Z for redo

  if (isUndo) {
    event.preventDefault(); // Prevent default behavior
    undo();
  } else if (isRedo) {
    event.preventDefault(); // Prevent default behavior
    redo();
  }
});

const downloadButton = document.getElementById("download");

downloadButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const squareSize = 560 / numSquares; // Ensure this matches your CSS square size
  canvas.width = squareSize * numSquares; // Set width based on number of squares
  canvas.height = squareSize * numSquares; // Set height based on number of squares

  // Flip the canvas horizontally
  ctx.scale(-1, 1); // Flip horizontally
  ctx.translate(-canvas.width, 0); // Translate back to the original position

  // Rotate the canvas 90 degrees
  ctx.translate(canvas.width / 2, canvas.height / 2); // Move to center
  ctx.rotate(Math.PI / 2); // Rotate 90 degrees
  ctx.translate(-canvas.height / 2, -canvas.width / 2); // Move back to the top left

  // Draw each square
  document.querySelectorAll(".square").forEach((square, index) => {
    const x = (index % numSquares) * squareSize; // Calculate x position
    const y = Math.floor(index / numSquares) * squareSize; // Calculate y position

    // Set the fill color to the square's dataset color
    ctx.fillStyle = square.dataset.color || "transparent"; // Fallback to transparent
    ctx.fillRect(x, y, squareSize, squareSize); // Draw the square
  });

  // Convert canvas to Blob and save it
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, "sketch-image.png"); // Prompt the user to save the file
    } else {
      console.error("Blob conversion failed.");
    }
  }, "image/png");
});
