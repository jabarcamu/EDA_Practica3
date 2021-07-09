

/**
 * 
 * Octree
 * 
*/

let ot;
let capacidad = 4; // capacidad de puntos por dimension
let mask;
let dim = 320; // dimension
let vectorTraslacion; // vector para hacer la traslacion de puntos.
let points = [];
let colorMaskAndPoints = 'red';
function setup() {

    createCanvas(dim * 2, dim * 2, WEBGL); // canvas en 3D

    let cube = new Cube(-1 * dim / 2, dim / 2, dim / 2, dim, dim, dim); // cubo    
    ot = new OctTree(cube, capacidad); // octree
    // console.log(ot);


    let vectorTraslacion = createVector(dim / 2, -dim / 2, -dim / 2); // mostrar cubo correctamente en el canvas        
    // numeros aleatorios en 3D
    for (let i = 0; i < 200; i++) {
        let vecrnd = p5.Vector.random3D(); // generar numeros aleatorios - vector unitario        
        let p = new Point3D(vecrnd.x * dim / 2, vecrnd.y * dim / 2, vecrnd.z * dim / 2);
        ot.insert(p);
    }

    background(0);
    ot.show(); // mostrar octree recursivamente    
    
    frameRate(1); // ejecucion del draw, por cada segundo
    
}

function draw(){

    background(0); // color de fondo.
    rotateY(frameCount * 0.2);
    ot.show(); // mostrar octree recursivamente
    
    mask = generateMask(dim);
    // mask = (new Cube(-dim/2,dim/2,dim/2,dim,dim,dim)); // mascara total
    // mask = (new Cube(0,0,0,dim/2,dim/2,dim/2)); // marcara superior
    // mask = (new Cube(-dim/2,dim/2,dim/2,dim/2,dim/2,dim/2)); // marcara superior


    let vt = createVector(mask.w / 2, -mask.h / 2, -mask.d / 2); // mostrar cubo correctamente en el canvas
    let vo = createVector(mask.x, mask.y, mask.z);
    
    push();
    stroke(colorMaskAndPoints); // color del cubo
    strokeWeight(3); // espesor del cubo
    translate(vo.add(vt));
    box(mask.w, mask.h, mask.d); // un cubo        
    pop();


    points = [];
    ot.query(mask, points);
    
    // dibuja los puntos
    for (let p of points) {
        push();
        translate(p.x, p.y, p.z);
        stroke(colorMaskAndPoints);
        strokeWeight(1);
        sphere(4);
        pop();
    }
    
}


function generateMask(dim){

    let dimrnd = Math.random() * dim; // ancho - alto - profundidad, aleatorios   
    
    let vecrnd = p5.Vector.random3D(); // generar numeros aleatorios - vector unitario            
    let x = vecrnd.x * (dim / 2); // origen x
    let y = vecrnd.y * (dim / 2); // origen y
    let z = vecrnd.z * (dim / 2); // origen z          

    dimrnd = (Math.abs((dim / 2) - x)) > dimrnd ? dimrnd : (Math.abs((dim / 2) - x));
    dimrnd = (Math.abs((-dim / 2) - y)) > dimrnd ? dimrnd : (Math.abs((-dim / 2) - y));
    dimrnd = (Math.abs((-dim / 2) - z)) > dimrnd ? dimrnd : (Math.abs((-dim / 2) - z));
    
    // console.log('dimention ...',Math.round(x),' * ',Math.round(y),' * ',Math.round(z),' * ', Math.round(mindimvalue),' * ', Math.round(dimrnd));         
    return new Cube(x, y, z, dimrnd, dimrnd, dimrnd);
    
}