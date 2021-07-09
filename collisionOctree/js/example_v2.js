//el tamanio de la escena
var WIDTH= window.innerWidth, HEIGHT = window.innerHeight;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
//atributos de la camara
var VIEW_ANGLE = 75, ASPECT = WIDTH / HEIGHT, NEAR  = 0.1, FAR = 5000;

//anclar a un tag del index.html
var midoc = document.body;

//creamos un rendere WebGL, la camara y la escena
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var scene  = new THREE.Scene();

//la camara inicializara en 0,0,0 y lo atraeremos
camera.position.z = 200;
camera.focalLength = 2000;

//iniciar render con fondo oscuro
//renderer.setClearColor(new THREE.Color(0,1));
renderer.setSize(WIDTH,HEIGHT);

//adjuntamos el renderer al elemento DOM del index.html
midoc.append(renderer.domElement);
midoc.addEventListener('mousemove', onDocumentMouseMove);
window.addEventListener('resize', onWindowResize);

//controles de orbit
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

//estadisticas de frame por sec
var stats = new Stats();
stats.showPanel(3);
midoc.appendChild(stats.dom);

//Parametros desde el gui
var params
var particleCount = 50;

//controle gui
function createControlPanels(){
	params = {
		tamOctree: 100,
		capOctree: 4,
		nroEsferas: 600
	};

	gui = new dat.GUI();
	gui.width = 300;
	//creacion de un folder para alberga los controles
	gui.add(params, 'tamOctree').name("Tamanio del Octree");
	gui.add(params, 'capOctree').name("Capacidad del Octree");
	gui.add(params, "nroEsferas",0,2000,1).listen().onChange(function(nroesferas){
		particleCount = nroesferas;
		createParticles();
	});
}

//var octree;
//Creacion del Octree
/*function createOctree(m,n){
	let box = new Box(-m/2,-m/2,-m/2,m/2,m/2,m/2);
	octree = new Octree(box,n);
}*/

var spheres;
var geometry;
var wireframe;
var particle;

var newmat = new THREE.MeshBasicMaterial({color:0x888765});

//creamos el conjunto de particulas
function createParticles(){
	scene.remove.apply(scene, scene.children);
	spheres = [];
	geometry =  new THREE.SphereGeometry(2,10,10);
	material = new THREE.MeshBasicMaterial({color:0xffffff});

	//lineMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.1 } );
	//ahora creamos cada particula
	for(var p=0; p < particleCount; p++){
		//creamos una particula con posiciones aleatorias a partir del cero
		//el canvas mide 400,400 asi que el random sera entre -200 a 200

		//las particulas pueden salirse fuera del render
		var pX = (Math.random() * params.tamOctree) - params.tamOctree;
		var pY = (Math.random() * params.tamOctree) - params.tamOctree;
		var pZ = (Math.random() * params.tamOctree) - params.tamOctree;

		
		particle = new THREE.Mesh(geometry,material);
		//particle.material.transparent = true;
		particle.position.set(pX,pY,pZ);
		//agregamos a la geometria de particulas
		spheres.push(particle);
		scene.add( particle );
	}
}

//agregando panel de controles
createControlPanels();

//Creacion del octree (primero es la creacion del octree)
//createOctree(params.tamOctree,params.capOctree);
//Creacion de particulas en el master
createParticles();


//agregar a la escena el sistema de particulas
scene.background = new THREE.Color(0x000000);
//scene.add( particles );

//console.log(spheres[0]);

//controles
//para controlar la reduccion o ampliacion de la ventana
function onWindowResize(){
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth,window.innerHeight);	
}

var mouseX = 0;
var mouseY = 0;
function onDocumentMouseMove(event){
	mouseX = (event.clientX - windowHalfX) / 100;
	mouseY = (event.clientY - windowHalfY) / 100;
}


function animate(){
	requestAnimationFrame(animate);
	stats.begin();	
	render();
	//scene.remove.apply(scene, scene.children);
	//renderer.renderLists.dispose();
	stats.end();
}
function insertPointOctree(ppX,ppY,ppZ,currentMesh){
	//agregamos los puntos al Octree
	var point = new Point(ppX,ppY,ppZ,currentMesh);
	octree.insert(point);

}
function render(){
	//numero aleatorio de acuerdo a fecha
	const timer = 0.0001 * Date.now();

	//cambiar posicion de camara a la posicion del mouse
	//camera.position.x += (mouseX - camera.position.x)*0.5;
	//camera.position.y += (mouseY - camera.position.y)*0.5;
	//camera.lookAt(scene.position);
	var m = params.tamOctree;
	var n = params.capOctree;
	

	//la creacion del octree debe estar en el render
	//ya que siempre se actualizan los puntos
	//por ende el octree debe ser rearmado
	var box = new Box(-m/2,-m/2,-m/2,m/2,m/2,m/2);
	var octree = new Octree(box,n);

		

	//iterar sobre los puntos
	for(let i=0, il=spheres.length; i < il; i++){
		//actual particula capturada
		let currentMesh = spheres[i];
		
		//posiciones de la particula actual
		let ppX = currentMesh.position.x;
		let ppY = currentMesh.position.y;
		let ppZ = currentMesh.position.z;
		
		//Insercion de punto en Octree
		//insertPointOctree(currentMesh);	
		var point = new Point(ppX,ppY,ppZ,currentMesh);
		octree.insert(point);

		currentMesh.position.x = 50 *Math.cos(timer+i) - 50;
		currentMesh.position.y = 50 *Math.sin(timer+i * 1.1) - 50;
		currentMesh.material.color = new THREE.Color(1,1,1);
	}
	
	//console.log(spheres[0]);	
	//verificar que contenga boundarySphere:ToDo
	let particlesFound = [];
	//debugger;*/
	//if(spheres[0] != null){
		//verificar intersecciones entre esferas
		for(let i=0, il=spheres.length; i<il; i++){
			//debugger;
			let oneParticle = spheres[i];
			//posiciones de la primera particula
			let opx = oneParticle.position.x;
			let opy = oneParticle.position.y;
			let opz = oneParticle.position.z;
			let oRadius = oneParticle.geometry.parameters.radius;
			
			let rangeSphere = new Sphere(opx,opy,opz,oRadius);
						
			//oneParticle.material.color  = new THREE.Color(1,1,1);
 	
			let particlesFound = octree.query(rangeSphere);
			var idx = 0;
			for(let partFound of particlesFound){
				//debugger;
				let filterPart = partFound.userData;
				
				let bb = filterPart.geometry;
				if(bb && (oneParticle.id != filterPart.id) && interseccion(oneParticle,filterPart)){
					console.log("NroDeColisiones:", idx);

					idx = idx + 1;
					//cambiamos de color a la particula
					oneParticle.material.color = new THREE.Color(Math.random(),Math.random(),Math.random());

					//oneParticle.position.y -= 40;

				}
			}
		}
	//}

	controls.update();
	renderer.render( scene, camera );
};
animate();

//funciones para la clase de particulas
function interseccion(onePart, otherPart){
	//compute la distancia euclideana entre los centros de las esferas
	let distEuc = Math.sqrt(Math.pow(onePart.position.x - otherPart.position.x,2) + 
				Math.pow(onePart.position.y - otherPart.position.y,2) +
				Math.pow(onePart.position.z - otherPart.position.z,2));
	//en caso que distEuc sea mayor a la suma de sus radios, las esferas no colisiona	
	return distEuc < onePart.geometry.parameters.radius + otherPart.geometry.parameters.radius;
}
