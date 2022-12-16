const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager;

let text = 'B';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas'); //create a 2nd smaller canvas
const typeContext = typeCanvas.getContext('2D');

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell); //find the nbr of cols(in every 20px in our main canvas, we gonna have 1px in the smaller one)
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width  = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'white';
    typeContext.fillRect(0, 0, cols, rows);

    typeContext.fillStyle = 'black';
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = 'top'; //baseline on the top of the txt

    const metrics = typeContext.measureText(text); //const who measure the text
    //console.log(metrics); = console log metrics
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx; //center the glyph
    const ty = (rows - mh) * 0.5 - my;

    typeContext.save(); //saves the current drawing state of the canvas by pushing it onto a stack
    typeContext.translate(tx, ty); //center vertically the txt on the middle of the sketch

    //DRAW BOUNDING BOX AROUND THE GLYPH :
    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    typeContext.fillText(text, 0, 0);
    typeContext.restore(); //restores the most recently saved drawing state by popping it from the stack

    context.typeData = typeContext.getImageData(0, 0, cols, rows).data; //data property of the object
    /* console.log(typeData); */

    context.drawImage(typeCanvas, 0, 0);
    for (let i = 0; i < numCells; i++) { //find cols & rows on a grid
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;

    }
  };
};

const onKeyUp= (e) => {
  //console.log(e); => string wth the key has been pressed
  text = e.key.toUpperCase();
  manager.render();
};

document.addEventListener('keyup', onKeyUp);


const start = async () => {
    manager = await canvasSketch(sketch, settings);
};
start();


/*
const url = 'https://picsum.photos/200';

const loadMeSomeImage = (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject();
		img.src = url;
	});
};

const start = async () => {
	const img = await loadMeSomeImage(url);
	console.log('image width', img.width);
	console.log('this line');
};

// const start = () => {
// 	loadMeSomeImage(url).then(img => {
// 		console.log('image width', img.width);
// 	});
// 	console.log('this line');
// };


start();
*/
