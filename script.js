const enter = (square) => {
  square.setAttribute("style", "background-color: #000;");
};

const leave = (square) => {
    square.setAttribute("style", `background-color: ${square.dataset.color};`);
  
};

const changeColor = (square, color = "#000") => {
  square.dataset.color = color;
  square.setAttribute("style", `background-color: ${color};`);
};

const resetColors = () => {
    document.querySelectorAll(".square").forEach(square => {
      square.dataset.color = "#cbcbcb"; // Clear the dataset color
      square.setAttribute("style", "background-color: #cbcbcb;"); // Reset the background color
    });
  };

const grid = document.getElementById("grid");

let isMouseDown = false;

// Set up event listeners for the grid
grid.addEventListener("mousedown", () => {
  isMouseDown = true;
});

grid.addEventListener("mouseup", () => {
  isMouseDown = false;
});

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", resetColors);

let color;

for (let i = 0; i < 16; i++) {
  const row = document.createElement("div");
  row.classList.add("row");
  for (let j = 0; j < 16; j++) {
    const square = document.createElement("div");
    square.classList.add("square");

    square.dataset.color = getComputedStyle(square).backgroundColor;

    square.addEventListener("mouseenter", () => enter(square));
    square.addEventListener("mouseleave", () => leave(square));

    square.addEventListener("mousedown", () => changeColor(square, color));
    square.addEventListener("mouseover", () => {
        if (isMouseDown) {
          changeColor(square, color);
        }
      });

    row.appendChild(square);
  }
  grid.appendChild(row);
}
