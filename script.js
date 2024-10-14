const enter = (square, color = "#ffffff") => {
  square.setAttribute("style", `background-color: ${color};`);
};

const leave = (square, original) => {
    square.setAttribute("style", `background-color: ${original};`);
  };


const grid = document.getElementById("grid");
let color;

for (let i = 0; i < 16; i++)
{
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 16; j++)
    {
        const square = document.createElement("div");
        square.classList.add("square");
        const original = getComputedStyle(square).backgroundColor;
        square.addEventListener("mouseenter", () => enter(square, color));
        square.addEventListener("mouseleave", () => leave(square, original));

        row.appendChild(square);
    }
    grid.appendChild(row);
}

