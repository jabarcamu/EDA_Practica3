/**
 * Para graficar el rectangulo: cada vez que se senhale la trayectoria
 * colorear tambien los puntos al cual se esta hacendo seguimiento
 */

let qt;
let count = 0;

let withQuery;
let total;

let particleCount = 20;
let particles = []

function setup() {
    createCanvas(800, 400);

    // Create both of your off-screen graphics buffers
    leftBuffer = createGraphics(400, 400);
    rightBuffer = createGraphics(600, 400);


    let boundary = new Rectangle(200, 200, 200, 200);
    qt = new QuadTree(boundary, 4);

    console.log(qt);
    for (let i = 0; i < particleCount; i++) {
        let p = new Point(Math.random() * 400, Math.random() * 400);
        //particles.push(p);
        particles.push(new Particle(random(width), random(height)));
        qt.insert(p);
    }

    withQuery = createCheckbox('Activar Query');
    withQuery.checked(true);

    let totalP = createP(particleCount);
    totalP.html(`Cantidad de Puntos: ${particleCount}`);
    total = createSlider(1, 1000, 20);
    total.size(400, 20);
    total.input(function() {
      particleCount = total.value();
      totalP.html(`Cantidad de Puntos: ${particleCount}`);
      particles=[];

      leftBuffer = createGraphics(400, 400);
      rightBuffer = createGraphics(600, 400);
        let boundary = new Rectangle(200, 200, 200, 200);
        qt = new QuadTree(boundary, 4);

        //console.log(qt);

      for (let i = 0; i < particleCount; i++) {
        let p1 = new Point(Math.random() * 400, Math.random() * 400);
        particles.push(new Particle(random(width), random(height)));
        qt.insert(p1);
      }
      if (particleCount < particles.length) {
        particles.splice(0, particles.length - particleCount);
      }
    });

    background(0);
    qt.show(leftBuffer);
    
}

function draw() {
  // Draw on your buffers however you like
  drawQuadtree();
  drawParticles();
  // Paint the off-screen buffers onto the main canvas
  image(leftBuffer, 0, 0);
  image(rightBuffer, 400, 0);
}

function drawQuadtree() {
    leftBuffer.background(0);
    qt.show(leftBuffer);

    if (withQuery.checked()) {
        let count =0
        let points = []

        leftBuffer.stroke(0, 255, 0);
        leftBuffer.rectMode(CENTER);    
        let range = new Rectangle(mouseX, mouseY, 50, 50)
        leftBuffer.rect(range.x, range.y, range.w * 2, range.h * 2);
        let puntos = [];
        qt.query(range, points);

        for (let p of points) {
          leftBuffer.strokeWeight(4);
          leftBuffer.point(p.x, p.y);
            puntos.push([p.x, p.y])
            count++;
        }
        //console.log(count, puntos);
    }
}

function drawParticles() {

  let boundary = new Rectangle(200, 200, 200, 200);
  qtree = new QuadTree(boundary, 4);

  rightBuffer.background(0);
  rightBuffer.fill(255);
  rightBuffer.noStroke();
  // Run through the Grid
  rightBuffer.stroke(255);

  // Display and move all Things
  for (let p of particles) {
    let point = new Point(p.x, p.y, p);
    qtree.insert(point);
  }

  for (let p of particles) {
    let range = new Circle(p.x, p.y, p.r * 2);
    //if (withQuadTree.checked()) {
      let points = qtree.query(range);
      p.checkCollision(points);
    // } else {
    //   p.checkCollision(particles);
    // }
  }

  for (let p of particles) {
    p.render(rightBuffer);
    p.move();
  }

  // let fr = floor(frameRate());
  // framerateP.html('Framerate: ' + fr);

   //show(qtree);
}

