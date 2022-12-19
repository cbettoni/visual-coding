const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
	dimensions: [ 1080, 1080 ]
};

let manager;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');//create a 2nd smaller canvas
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);//find the nbr of cols(in every 20px in our main canvas, we gonna have 1px in the smaller one)
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width  = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
		typeContext.fillRect(0, 0, cols, rows);

		fontSize = cols * 1.2;//size of the front

		typeContext.fillStyle = 'white';
		typeContext.font = `${fontSize}px ${fontFamily}`;
		typeContext.textBaseline = 'top';//baseline on the top of the txt

    const metrics = typeContext.measureText(text);//const who measure the text
    //console.log(metrics); = console log metrics
    const mx = metrics.actualBoundingBoxLeft * -1;
		const my = metrics.actualBoundingBoxAscent * -1;
		const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
		const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		const tx = (cols - mw) * 0.5 - mx;//center the glyph
		const ty = (rows - mh) * 0.5 - my;

    typeContext.save();//saves the current drawing state of the canvas by pushing it onto a stack
    typeContext.translate(tx, ty);//center vertically the txt on the middle of the sketch

    //DRAW BOUNDING BOX AROUND THE GLYPH :
    typeContext.beginPath();
		typeContext.rect(mx, my, mw, mh);
		typeContext.stroke();

		typeContext.fillText(text, 0, 0);
		typeContext.restore();//restores the most recently saved drawing state by popping it from the stack

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;//data property of the object
    /* console.log(typeData); */

    context.fillStyle = 'black';
		context.fillRect(0, 0, width, height); //big rectangle filling all the canvas

		context.textBaseline = 'middle';//aligh the glyph on the middle
		context.textAlign = 'center';

    //context.drawImage(typeCanvas, 0, 0);

    for (let i = 0; i < numCells; i++) {//find cols & rows on a grid
      const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cell;
			const y = row * cell;

      const r = typeData[i * 4 + 0];//read RGBA values to change color of the little squares based on typeData
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);//change the glyph depending of the color of the px

			context.font = `${cell * 2}px ${fontFamily}`;//size of the police *2 size of the cell
			if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;//get 10% of chance to be more bigger randomly

			context.fillStyle = 'white';

      context.save();//draw a square(or circle) for each cells
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      //context.fillRect(0, 0, cell, cell);

      context.fillText(glyph, 0, 0);

      context.restore();// => draw 54x54 black squares(or circles)
    }
  };
};

const getGlyph = (v) => {//depends of how bright the px is
	if (v < 50) return '';
	if (v < 100) return '.';
	if (v < 150) return '-';
	if (v < 200) return '+';

	const glyphs = '_= /'.split('');//convert glyph onto an array

	return random.pick(glyphs);//pick any glyph on an array randomly
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
