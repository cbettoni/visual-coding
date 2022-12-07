const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

/* const animate = () => {
  console.log("animation test");
  requestAnimationFrame(animate); //go off on each new frame (~60/sec)
};
//animate(); =>Do the same thing than return on the bottom */

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0 ,width);
    const y = random.range(0 ,height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) { //nested for loop (draw lines between all agents)
      const agent = agents[i];

      for (let j = i + 1/* =>less iterations between i and j */; j < agents.length; j++) {
        const other = agents[j]; //for each agent we go over other agents

        const dist = agent.pos.getDistance(other.pos); //get distance between agents

        if (dist > 200) continue; //draw a line only if dist > 200 or whatever

        //lineWidth based on the distance between 2 agents (Between 0 = 12 & between 200 = 1)
        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);

        //draw line = moveTo & lineTo
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) { //pythagore to find closest agents do draw line
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) { //Initializes a new instance of the Canvas class
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1)); // = the velocity of the dots
    this.radius = random.range(4, 12);
  }

bounce(width, height) { //invert velocity of the dots when touch the borders
  if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
  if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
}

update() {
  this.pos.x += this.vel.x;
  this.pos.y += this.vel.y; //update pos of dots
}

draw(context) { //draw the dots
  context.save();
  context.translate(this.pos.x, this.pos.y);

  context.lineWidth = 4; //stronger outlines

  context.beginPath(); //new drawing
  context.arc(0, 0, this.radius, 0, Math.PI * 2);
  context.fill();
  context.stroke(); //basic black outline, no need to precise this

  context.restore();
  }
}
