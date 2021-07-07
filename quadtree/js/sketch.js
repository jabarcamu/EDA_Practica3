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
    createCanvas(400, 400);
    let boundary = new Rectangle(200, 200, 200, 200);
    qt = new QuadTree(boundary, 4);

    console.log(qt);
    for (let i = 0; i < particleCount; i++) {
        let p = new Point(Math.random() * 400, Math.random() * 400);
        particles.push(p);
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

        createCanvas(400, 400);
        let boundary = new Rectangle(200, 200, 200, 200);
        qt = new QuadTree(boundary, 4);

        //console.log(qt);

      for (let i = 0; i < particleCount; i++) {
        let p1 = new Point(Math.random() * 400, Math.random() * 400);
        qt.insert(p1);
      }
      if (particleCount < particles.length) {
        particles.splice(0, particles.length - particleCount);
      }
    });

    background(0);
    qt.show();
}

function draw() {
    background(0);
    qt.show();

    if (withQuery.checked()) {
        let count =0
        let points = []

        stroke(0, 255, 0);
        rectMode(CENTER);    
        let range = new Rectangle(mouseX, mouseY, 50, 50)
        rect(range.x, range.y, range.w * 2, range.h * 2);
        let puntos = [];
        qt.query(range, points);

        for (let p of points) {
            strokeWeight(4);
            point(p.x, p.y);
            puntos.push([p.x, p.y])
            count++;
        }
        //console.log(count, puntos);
    }

    
}

