const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

//create object to store parameters of the GUI:
const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0, //button animate or not
  animate: true,
  lineCap: 'butt', //form of the line
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const cols = params.cols; //use the GUI parameters
    const rows = params.rows; //use the GUI parameters
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

      const f = params.animate ? frame /* istrue? */ : params.frame /* else */; //ternary operator if the frame is animate or not

      //const n = random.noise2D(x + frame * 10, y, params.freq); //see simplex-noise in the doc od canvas-sketch-util
      const n = random.noise3D(x, y, f * 10, params.freq); //3D = more organic pattern

      const angle = n * Math.PI * params.amp; //angle of the rotation of the lines on the grid (-180 deg to 180 deg)
      //const scale = (n + 1) / 2 * 30;//use the noise to change the scale of the lines which is btwn -1  & 1 (we don`t want neg scale si we remaping to be between 0 and 1)
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax); //scale min & max of the GUI

      context.save(); //saves the current drawing state of the canvas by pushing it onto a stack
      context.translate(x, y); //remaps the (0,0) position on the canvas
      context.translate(margx, margy); //remaps the (0,0) position on the canvas taking margins on count
      context.translate(cellw * 0.5, cellh * 0.5); //remaps the (0,0) position on the canvas taking the center of the cells on count
      context.rotate(angle); //see the angle rotation of the noise

      context.lineWidth = scale;
      context.lineCap = params.lineCap; //form of the line

      context.beginPath(); //begins a path, or resets the current path
      context.moveTo(w * -0.5, 0); //minus half of the w of the line
      context.lineTo(w * 0.5, 0); //half of the w of the line
      context.stroke(); // draws the path you have defined with moveTo() and lineTo() (default color black)

      context.restore(); //restores the most recently saved drawing state by popping it from the stack
    }
  };
};

const createPane = () => { //create GUI (graphic interface)
  const pane = new Tweakpane.Pane();

  //modify the grid values:
  folder = pane.addFolder({ title: 'Grid '});
  folder.addInput(params, 'lineCap', { options: {butt: 'butt', round: 'round', square: 'square'} }); //form of the line with DD menu
  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 }); //sliders from 2 to 50
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 1, max: 100 });
  folder.addInput(params, 'scaleMax', { min: 0, max: 100 });

  //modify the noise values:
  folder = pane.addFolder({ title: 'Noise '});
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01 });
  folder.addInput(params, 'amp', { min: 0, max: 1 });
  folder.addInput(params, 'animate' ); //animate button
  folder.addInput(params, 'frame', { min: 0, max: 999 }); //frame button
};

createPane();
canvasSketch(sketch, settings);
