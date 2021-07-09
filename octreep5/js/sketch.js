

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

function setup() {

    createCanvas(dim * 2, dim * 2, WEBGL); // canvas en 3D

    let cube = new Cube(-1 * dim / 2, dim / 2, dim / 2, dim, dim, dim); // cubo    
    ot = new OctTree(cube, capacidad); // octree
    console.log(ot);


    let vectorTraslacion = createVector(dim / 2, -dim / 2, -dim / 2); // mostrar cubo correctamente en el canvas        
    // numeros aleatorios en 3D
    for (let i = 0; i < 200; i++) {
        let vecrnd = p5.Vector.random3D(); // generar numeros aleatorios - vector unitario        
        let p = new Point3D(vecrnd.x * dim / 2, vecrnd.y * dim / 2, vecrnd.z * dim / 2);
        ot.insert(p);
    }


    // testing
    let dimTest = 100;
    let testing = new Test(new Cube(0,0,0,dimTest,dimTest,dimTest));
    let pointTesting = [];

    for (let j = 0; j < 100; j++) {        
        let x = Math.random() * dimTest; // origen x
        let y = Math.random() * -1 * dimTest; // origen y
        let z = Math.random() * -1 * dimTest; // origen z  
        let np = new Point3D(x,y,z); 
        // console.log('point ...........',np);
        pointTesting.push(np); 
    }

    console.log('cube ...........',testing);
    testing.contains(pointTesting);
    console.log('Cube Testing ...', testing.cube.x,' * ',testing.cube.y,' * ',testing.cube.z,' * ',
    testing.cube.x + testing.cube.w,' * ', testing.cube.y - testing.cube.h,' * ', testing.cube.z - testing.cube.d);
    console.log('Contains ...', testing.containsInCube);
    console.log('No Contains ...', testing.noContainsInCube);

    pointTesting = [];
    testing.containsInCube = [];
    testing.noContainsInCube = [];
    for (let j = 0; j < 20; j++) {  
        let vecrnd = p5.Vector.random3D(); // generar numeros aleatorios - vector unitario                  
        let x = vecrnd.x * dimTest; // origen x
        let y = vecrnd.y * dimTest; // origen y
        let z = vecrnd.y * dimTest; // origen z  
        let np = new Point3D(x,y,z); 
        // console.log('point ...........',np);
        pointTesting.push(np); 
    }

    testing.contains(pointTesting);
    console.log('cube  ...........',testing);    
    console.log('Cube Testing Random...', testing.cube.x,' * ',testing.cube.y,' * ',testing.cube.z,' * ',
    testing.cube.x + testing.cube.w,' * ', testing.cube.y - testing.cube.h,' * ', testing.cube.z - testing.cube.d);
    console.log('Contains Random...', testing.containsInCube.length,' * ',testing.containsInCube);
    console.log('No Contains Random...',testing.noContainsInCube.length, ' * ', testing.noContainsInCube);

    let cubeTesting = [];
    for (let k = 0; k < 10; k++) {
        cubeTesting.push(generateMask(dimTest));                
    }
    testing.intersects(cubeTesting);
    console.log('Cube Testing Intersect ...........',testing);    
    console.log('Cube Testing Random...', testing.cube.x,' * ',testing.cube.y,' * ',testing.cube.z,' * ',
    testing.cube.x + testing.cube.w,' * ', testing.cube.y - testing.cube.h,' * ', testing.cube.z - testing.cube.d);
    console.log('Intersect Random...', testing.intersectCube.length,' * ',testing.intersectCube);
    console.log('No Intersect Random...',testing.noIntersectCube.length, ' * ', testing.noIntersectCube);


    // ot.insert(new Point3D(0, 0, 0));
    // ot.insert(new Point3D(-dim / 4, dim / 4, -dim / 4));
    // ot.insert(new Point3D(dim / 4, dim / 4, -dim / 4));
    // ot.insert(new Point3D(-dim / 4, dim / 4, dim / 4));
    // ot.insert(new Point3D(dim / 4, dim / 4, dim / 4));
    // ot.insert(new Point3D(-dim / 4, -dim / 4, -dim / 4));
    // ot.insert(new Point3D(dim / 4, -dim / 4, -dim / 4));
    // ot.insert(new Point3D(-dim / 4, -dim / 4, dim / 4));
    // ot.insert(new Point3D(dim / 4, -dim / 4, dim / 4));    

    // // crean mascara
    // let mask0 = new Cube(-dim/2,dim/2,dim/2,dim,dim,dim);
    // let mask1 = new Cube(-dim/2,0,0,dim/2,dim/2,dim/2);
    // let mask2 = new Cube(0,0,0,dim/2,dim/2,dim/2);
    // let mask3 = new Cube(-dim/2,0,dim/2,dim/2,dim/2,dim/2);
    // let mask4 = new Cube(0,0,dim/2,dim/2,dim/2,dim/2);
    // let mask5 = new Cube(-dim/2,dim/2,0,dim/2,dim/2,dim/2);
    // let mask6 = new Cube(0,dim/2,0,dim/2,dim/2,dim/2);
    // let mask7 = new Cube(-dim/2,dim/2,dim/2,dim/2,dim/2,dim/2);
    // let mask8 = new Cube(0,dim/2,dim/2,dim/2,dim/2,dim/2);

    // let pts0 = [];
    // let pts1 = [];
    // let pts2 = [];
    // let pts3 = [];
    // let pts4 = [];
    // let pts5 = [];
    // let pts6 = [];
    // let pts7 = [];
    // let pts8 = [];


    // ot.query(mask0,pts0);
    // ot.query(mask1,pts1);
    // ot.query(mask2,pts2);
    // ot.query(mask3,pts3);
    // ot.query(mask4,pts4);
    // ot.query(mask5,pts5);
    // ot.query(mask6,pts6);
    // ot.query(mask7,pts7);
    // ot.query(mask8,pts8);
    // console.log('Imprimir los puntos 0 query ...', pts0);
    // console.log('Imprimir los puntos 1 query ...', pts1);
    // console.log('Imprimir los puntos 2 query ...', pts2);
    // console.log('Imprimir los puntos 3 query ...', pts3);
    // console.log('Imprimir los puntos 4 query ...', pts4);
    // console.log('Imprimir los puntos 5 query ...', pts5);
    // console.log('Imprimir los puntos 6 query ...', pts6);
    // console.log('Imprimir los puntos 7 query ...', pts7);
    // console.log('Imprimir los puntos 8 query ...', pts8);



    
    // rotateX(PI / 3)
    // rotateZ(PI / 3)
    background(20);
    ot.show(); // mostrar octree recursivamente
    // setTimeout(create, 2000);
    
    frameRate(0.5);
    
}

function draw(){

    background(20); // color de fondo.
    rotateY(frameCount * 0.2);
    ot.show(); // mostrar octree recursivamente
    // rotateX(PI/Math.random()*4);
    // rotateY(PI/Math.random()*4);

    // let dimrnd = Math.random() * dim; // ancho - alto - profundidad, aleatorios   
    
    // let vecrnd = p5.Vector.random3D(); // generar numeros aleatorios - vector unitario            
    // let x = vecrnd.x * (dim / 2); // origen x
    // let y = vecrnd.y * (dim / 2); // origen y
    // let z = vecrnd.z * (dim / 2); // origen z    
    // let mindimvalue = dimrnd;    

    // dimrnd = (Math.abs((dim / 2) - x)) > dimrnd ? dimrnd : (Math.abs((dim / 2) - x));
    // dimrnd = (Math.abs((-dim / 2) - y)) > dimrnd ? dimrnd : (Math.abs((-dim / 2) - y));
    // dimrnd = (Math.abs((-dim / 2) - z)) > dimrnd ? dimrnd : (Math.abs((-dim / 2) - z));
    
    // // console.log('dimention ...',Math.round(x),' * ',Math.round(y),' * ',Math.round(z),' * ', Math.round(mindimvalue),' * ', Math.round(dimrnd));         

    mask = generateMask(dim);

    let vt = createVector(mask.w / 2, -mask.h / 2, -mask.d / 2); // mostrar cubo correctamente en el canvas
    let vo = createVector(mask.x, mask.y, mask.z);

    push();
    stroke(255, 128, 64); // color del cubo
    strokeWeight(1); // espesor del cubo
    translate(vo.add(vt));
    box(mask.w, mask.h, mask.d); // un cubo        
    pop();


    points = [];
    ot.query(mask, points);
    // console.log('puntos ..', points);
    // dibuja los puntos
    for (let p of points) {
        push();
        translate(p.x, p.y, p.z);
        stroke(255, 128, 64)
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