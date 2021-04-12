// Randomizing Function
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Distance between points function
function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

// Rotate Function
function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
  return rotatedVelocities;
}

// Collision Resolver Function
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

var amt =80;
var r;
var width ;

var colors = [
  "#272F32",
  "#FF3D2E",
  "#5B2D87",
  "#E62591",
  "#009AB8",
  "#F57A20",
  "#E8E615",
];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

window.addEventListener(
  "touchmove",
  function (ev) {
    mouse.x = ev.touches[0].clientX;
    mouse.y = ev.touches[0].clientY;
  },
  false
);

// Objects
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.lineWidth = width;
    c.stroke();
    c.closePath();
  }

  update(balls) {
    this.draw();
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0)
      this.velocity.x = -this.velocity.x;
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0)
      this.velocity.y = -this.velocity.y;
    for (let j = 0; j < balls.length; j++) {
      if (this == balls[j]) continue;
      if (
        distance(this.x, this.y, balls[j].x, balls[j].y) - this.radius * 2 <
        0
      ) {
        resolveCollision(this, balls[j]);
      }
      if (
        distance(mouse.x, mouse.y, this.x, this.y) < 120 &&
        this.opacity < 0.8
      ) {
        this.opacity += 0.05;
      } else if (this.opacity > 0) {
        this.opacity -= 0.05;
        this.opacity = Math.max(0, this.opacity);
      }
    }
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}

// Implementation
let balls;
function init() {
  balls = [];
  if (innerWidth > 600) {
    amt = 200;
    r = 20;
    width = 4;
  } else {
    amt = 80;
    r = 10;
    width = 2;
  }

  for (let i = 0; i < amt; i++) {
    var radius = r;
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    if (i !== 0) {
      for (j = 0; j < balls.length; j++) {
        if (distance(x, y, balls[j].x, balls[j].y) - radius * 2 < 0) {
          x = Math.random() * (innerWidth - radius * 2) + radius;
          y = Math.random() * (innerHeight - radius * 2) + radius;
          j = -1;
        }
      }
    }
    balls.push(new Ball(x, y, radius, colors[randomIntFromRange(0, 6)]));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(255,255,255,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  balls.forEach((Ball) => {
    Ball.update(balls);
  });
}

init();
animate();
