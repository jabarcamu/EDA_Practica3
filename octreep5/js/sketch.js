

/**
 * 
 * Octree
 * 
*/

let ot;
let capacidad = 4;
let mask = {w:200, h:200, d: 200};
let dim = 400; // dimension

function setup() {

    createCanvas(dim * 2, dim * 2, WEBGL); // canvas en 3D
    
    let cube = new Cube(0,0,0,dim,dim,dim); // cubo

    ot = new OctTree(cube,capacidad); // octree
    console.log(ot);

    // numeros aleatorios en 3D
    for (let i = 0; i < 100; i++) {
        let p = new Point3D(Math.random() * dim, Math.random() * dim, Math.random() * dim);        
        ot.insert(p);
    }
    background(20); // color de fondo.    
    ot.show(dim); // mostrar octree recursivamente
}

