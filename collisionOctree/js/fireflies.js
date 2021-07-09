(function(){
  'use strict';
  
  var tau = Math.PI * 2;
  var width, height;
  var scene, camera, renderer, pointCloud;
  
  function onDocumentReady(){
    initialize();
    
    /* DO STUFF! */
    var material = new THREE.PointCloudMaterial({
      size: 5,
      vertexColors: THREE.VertexColors
    });
    
    var geometry = new THREE.Geometry();
    var x, y, z;
    _.times(1000, function(n){
      x = (Math.random() * 800) - 400;
      y = (Math.random() * 800) - 400;
      z = (Math.random() * 800) - 400;
      
      geometry.vertices.push(new THREE.Vector3(x, y, z));
      geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
    });
    
    var pointCloud = new THREE.PointCloud(geometry, material);
    scene.add(pointCloud);
    
    function render(){
      window.requestAnimationFrame(render);
      
      _.forEach(geometry.vertices, function(particle, index){
        var dX, dY, dZ;
        dX = Math.random() * 2 - 1;
        dY = Math.random() * 2 - 1;
        dZ = Math.random() * 2 - 1;
        
        particle.add(new THREE.Vector3(dX, dY, dZ));
        geometry.colors[index] = new THREE.Color(Math.random(), Math.random(), Math.random());
      });
      geometry.verticesNeedUpdate = true;
      geometry.colorsNeedUpdate = true;
      
      renderer.render(scene, camera);
    }
    
    render();
  }
  
  function initialize(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(120, 16 / 9, 1, 1000);
    renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
  } 
  
  function onWindowResize(){
    width = window.innerWidth;
    height = window.innerHeight;
    updateRendererSize();
  }
  
  function updateRendererSize(){
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  
  document.addEventListener('DOMContentLoaded', onDocumentReady);
})();



ontainer = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 100 );
				camera.position.z = 3;
				camera.focalLength = 3;

				const path = "textures/cube/pisa/";
				const format = '.png';
				const urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];

				const textureCube = new THREE.CubeTextureLoader().load( urls );

				scene = new THREE.Scene();
				scene.background = textureCube;

				const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
				const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

				for ( let i = 0; i < 500; i ++ ) {

					const mesh = new THREE.Mesh( geometry, material );

					mesh.position.x = Math.random() * 10 - 5;
					mesh.position.y = Math.random() * 10 - 5;
					mesh.position.z = Math.random() * 10 - 5;

					mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

					scene.add( mesh );

					spheres.push( mesh );

				}

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				container.appendChild( renderer.domElement );

				const width = window.innerWidth || 2;
				const height = window.innerHeight || 2;

				effect = new AnaglyphEffect( renderer );
				effect.setSize( width, height );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				effect.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) / 100;
				mouseY = ( event.clientY - windowHalfY ) / 100;

			}


