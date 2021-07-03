let qt;
let count = 0;

function setup() {
    createCanvas(400, 400);

    // centre point and half of width and height
    let boundary = new Rectangle(200, 200, 200, 200);

    // each leave just could have 4 elements
    qt = new QuadTree(boundary, 4);

    
    for (let i = 0; i < 80; i++) {
        let p = new Point(Math.random() * 400, Math.random() * 400);
        qt.insert(p);
    }

    console.log(qt);

    background(0);
    qt.show();
}