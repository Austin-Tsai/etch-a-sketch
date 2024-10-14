const enter = (square) => {
  if (draw) {
    square.style.backgroundColor = `${color}`;
  } else square.style.backgroundColor = "transparent";
};

const leave = (square) => {
  square.style.backgroundColor = `${square.dataset.color}`;
};

const changeColor = (square) => {
  if (draw) {
    square.dataset.color = color;
    square.style.backgroundColor = `${color}`;
  } else {
    square.dataset.color = "transparent";
    square.style.backgroundColor = "transparent";
  }
};

const resetColors = () => {
  document.querySelectorAll(".square").forEach((square) => {
    square.dataset.color = "#cbcbcb"; // Clear the dataset color
    square.style.backgroundColor = "transparent"; // Reset the background color
  });
};

const toggleGridLines = () => {
  if (gridLines) {
    console.log("here");
    document.querySelectorAll(".square").forEach((square) => {
      square.style.border = "none";
    });
    gridLines = false;
  } else {
    document.querySelectorAll(".square").forEach((square) => {
      square.style.borderRight = `solid #000 ${1/numSquares}px`;
      square.style.borderBottom = `solid #000 ${1/numSquares}px`;
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
      square.style.width = `${560/numSquares}px`;
      square.style.height = `${560/numSquares}px`;
      square.style.borderRightWidth = `${1/numSquares}px`;
      square.style.borderBottomWidth = `${1/numSquares}px`;
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
    changeColor(square);
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
});
const eraserButton = document.getElementById("eraser");
eraserButton.addEventListener("click", () => {
  draw = false;
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
