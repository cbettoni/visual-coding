const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const cols = 10;
    const rows = 10;
    const numCells = cols * rows;

    const gridw = width * 0.8; //width of the grid: 80% width canvas
    const gridh = height * 0.8; //height of the grid:80% height canvas
    const cellw = gridw / cols; //width of each cell
    const cellh = gridh / rows; //height of each cell
    const margx = (width - gridw) * 0.5; //x cells margin /2
    const margy = (height - gridh) * 0.5; //y cells margin /2

    for (let i = 0; i < numCells; i++) { //go on each cells & do something
      const col = i % cols; // % = remainder operator (left over) the result is 1 col on 4 = 0
      const row = Math.floor(i /cols); //check the nb of cols to know the end of a row (=> EVERY 4 STEPS, THE VALUE OF ROWS IS INCREASED BY 1)

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      context.save(); //saves the current drawing state of the canvas by pushing it onto a stack
      context.translate(x, y); //remaps the (0,0) position on the canvas
      context.translate(margx, margy); //remaps the (0,0) position on the canvas taking margins on count
      context.translate(cellw * 0.5, cellh * 0.5); //remaps the (0,0) position on the canvas taking the center of the cells on count

      context.lineWidth = 4;

      context.beginPath(); //begins a path, or resets the current path
      context.moveTo(w * -0.5, 0); //minus half of the w of the line
      context.lineTo(w * 0.5, 0); //half of the w of the line
      context.stroke(); // draws the path you have defined with moveTo() and lineTo() (default color black)

      context.restore(); //restores the most recently saved drawing state by popping it from the stack
    }
  };
};

canvasSketch(sketch, settings);
