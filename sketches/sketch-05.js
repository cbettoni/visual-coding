const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager;

let text = 'B';
let fontSize = 1200;
let fontFamily = 'serif';

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    /* context.font = fontSize + 'px ' + fontFamily; */
    context.font = `${fontSize}px ${fontFamily}`; //same than the line above
    context.textBaseline = 'top'; //baseline on the middle of the txt
/*     context.textAlign = 'center'; //center horizontally the txt on the middle of the sketch
 */
    const metrics = context.measureText(text); //const who measure the text
/*     console.log(metrics); = console log metrics*/
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x = (width - mw) * 0.5 - mx; //center the glyph
    const y = (height - mh) * 0.5 - my;

    context.save(); //saves the current drawing state of the canvas by pushing it onto a stack
    context.translate(x, y); //center vertically the txt on the middle of the sketch

    //DRAW BOUNDING BOX AROUND THE GLYPH :
    context.beginPath();
    context.rect(mx, my, mw, mh);
    context.stroke();

    context.fillText(text, 0, 0);
    context.restore(); //restores the most recently saved drawing state by popping it from the stack
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
