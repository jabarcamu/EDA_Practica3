let qtree;
let particleCount = 300;
let particles = []

let withCircle;

function setup() {
  
  let dibujo = createCanvas(700, 700);
  dibujo.parent("dibujo");
  background(255);  
  
  let boundary = new Rectangle(width , height , width *2 , height *2 );
  qtree = QuadTree.create(boundary,4);
  
  for (let i = 0; i < particleCount; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let p = new Point(x, y);
    particles.push(p);
    qtree.insert(p);
  }

  withCircle= createCheckbox('Circular');
  withCircle.parent("menu");
  withCircle.checked(true);

  let totalP = createP(particleCount);
  totalP.parent("menu");
  totalP.html(`Cantidad de Puntos: ${particleCount}`);
  total = createSlider(1, 1000, 300);
  total.parent("menu");
  total.size(400, 20);

  total.input(function() {
    particleCount = total.value();
    totalP.html(`Cantidad de Puntos: ${particleCount}`);
    particles=[];

    let dibujo = createCanvas(700, 700);
    dibujo.parent("dibujo");
    background(255);  
    
    let boundary = new Rectangle(width , height , width *2 , height *2 );
    qtree = QuadTree.create(boundary,4);      

    for (let i = 0; i < particleCount; i++) {
      let x = randomGaussian(width / 2, width / 8);
      let y = randomGaussian(height / 2, height / 8);
      let p = new Point(x, y);
      particles.push(p);
      qtree.insert(p);
    }
    if (particleCount < particles.length) {
      particles.splice(0, particles.length - particleCount);
    }
  });

}

function draw() {
  background(0);

  let range;
  if (withCircle.checked()) {
    range = new Circle(mouseX, mouseY, 48);  
    ellipse(range.x, range.y, range.r * 2);
  }
  else {
    range = new Rectangle(mouseX, mouseY, 50, 50)
    rect(range.x, range.y, range.w , range.h );
  }
  show(qtree, range);
  stroke("red");
  
  let points = qtree.query(range);
  for (let p of points) {
    stroke(0, 255, 0);
    strokeWeight(4);
    point(p.x, p.y);

    if (mouseIsPressed) {
      let neighbors = qtree.closest(new Point(p.x, p.y), 8);
      stroke(0, 255, 0, 50);
      strokeWeight(1);
      for (let n of neighbors) {
        line(p.x, p.y, n.x, n.y);
      }
    }
  }
}

function show(qtree, range) {
  noFill();
  strokeWeight(1);
  rectMode(CENTER);
  stroke(255, 41);
  if (range.intersects(qtree.boundary)) {
    stroke(255);
  }
  rect(qtree.boundary.x, qtree.boundary.y, qtree.boundary.w, qtree.boundary.h);

  stroke(255);
  strokeWeight(2);
  for (let p of qtree.points) {
    point(p.x, p.y);
  }

  if (qtree.divided) {
    show(qtree.northeast, range);
    show(qtree.northwest, range);
    show(qtree.southeast, range);
    show(qtree.southwest, range);
  }
}
