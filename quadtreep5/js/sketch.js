
/**
 * 
 * Quadtree
 * 
*/


let qt; // objeto quadtree
let capacidad = 4; // capacidad de puntos por quadtree
let mask = {w:100, h:100}; // mascara de puntos.
let dim = 400; // dmension del canvas

function setup() {
    createCanvas(dim, dim);
    // crear un rectangulo padre
    let boundary = new Rectangle(0, 0, dim, dim);

    qt = new QuadTree(boundary, capacidad); // crea el quadtree
    console.log(qt);

    // genera puntos aleatorios
    for (let i = 0; i < 100; i++) {
        let p = new Point2D(Math.random() * dim, Math.random() * dim);        
        qt.insert(p);
    }
    background(20); // color de fondo.    
    qt.show(); // mostrar quadtree recursivamente

}


function draw () {
    background (0);
    qt.show ();

        stroke (0 ,255 ,0) ;
        // rectMode ( CENTER );
        let maskRectangle = new Rectangle(mouseX, mouseY, mask.w, mask.h);
        rect (maskRectangle.x, maskRectangle.y, maskRectangle.w, maskRectangle.h);
        let points = [];
        qt.query (maskRectangle , points );

        for (let p of points ){
            strokeWeight (4) ;
            point (p.x , p.y );
        }
}



// function draw() {    
  
//     if (mouseIsPressed) {        
//         qt.insert({x:mouseX,y:mouseY});
//         qt.show();
//         console.log('mouseIsPressed ', mouseX, ' - ', mouseY);
//     }    

// }
