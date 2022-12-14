const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    context.font = '400px serif';
    context.textBaseline = 'middle'; //baseline on the middle of the txt
    context.textAlign = 'center'; //center vertically the txt on the middle of the sketch

    context.save(); //saves the current drawing state of the canvas by pushing it onto a stack
    context.translate(width * 0.5, height * 0.5); //center horizontally the txt on the middle of the sketch

    context.fillText('A', 0, 0);
    context.restore() //restores the most recently saved drawing state by popping it from the stack
  };
};

canvasSketch(sketch, settings);
