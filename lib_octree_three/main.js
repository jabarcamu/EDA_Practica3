var scene = new THREE.Scene();


//var camera = new THREE.PerspectiveCamera( 100, 1/*window.innerWidth/window.innerHeight*/, 1, 1000);
const fov = 45;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 1000;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);//0, 10, 20
  
var canvas = document.querySelector('#canvas_panel');
var renderer = new THREE.WebGLRenderer();
canvas.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
//renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setSize(document.getElementById("panel_octree").clientWidth, 700);
//renderer.setSize(600, 600);
//document.body.appendChild( renderer.domElement );

camera.position.y = -100;//-20;
camera.position.x = -100;//-100;
camera.position.z = -200;//-100;

var axisHelper = new THREE.AxisHelper( 1.25 );
scene.add( axisHelper );

var octree;
var q;

function createOctree(m,n){
    let box = new Box(m/2,m/2,m/2,m/2,m/2,m/2);
    octree = new Octree(box,n);
    
    this.sphere = new THREE.Mesh( this.geometry, this.material );
    this.sphere.position.set(50,50,50);
    scene.add( this.sphere );
}


function rand(n,m){
    for(i=0;i<n;i++){
        let x = Math.random()*m;
        let y = Math.random()*m;
        let z = Math.random()*m;
        let point = new Point(x,y,z);
        octree.insert(point);
    }
}


controls.update();


var animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );

    //*** ROTAR TODA LA ESCENA
    scene.rotation.x += 0.01;
    scene.rotation.y += 0.01;

};

animate(); 
