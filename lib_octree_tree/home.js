
$(document).ready(function(){
    $("#codigo_puntos").html("");
});

var cx_a = -1;
var cy_a = -1;
var cz_a = -1;
var cw_a = -1;
var ch_a = -1;
var cd_a = -1;

function buscar_punto(r, g, b, x, y, z){
    var cx_x = x;
    var cy_x = y;
    var cz_x = z;
    var cw_x = 10;
    var ch_x = 10;
    var cd_x = 10;
    
    if(cx_a !== -1){
        let box = new Box(cx_a,cy_a,cz_a,cw_a,ch_a,cd_a);
        scene.remove(q);
        q = null;
        octree.cleanQuery(box);
    }
    
    cx_a = cx_x;
    cy_a = cy_x;
    cz_a = cz_x;
    cw_a = cw_x;
    ch_a = ch_x;
    cd_a = cd_x;
    
    var geometry = new THREE.BoxGeometry(cw_x*2,ch_x*2,cd_x*2);
    var material = new THREE.MeshBasicMaterial( { color: /*0x00ff00*/"white", opacity: alpha , transparent: true, } );
    material.color.set(this.color);
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(cx_x,cy_x,cz_x);
    q = cube;
    scene.add(q);
    //*** Trasladar Puntos al Centro
    geometry.translate( -50, -50, -50);
    
    //*** Extraer Cubos
    extraer_cubos(x, y, z);
}


function extraer_cubos(x, y, z){
    var cx = 0;
    var cy = 0;
    var cz = 0;
    var cw = 100;
    var ch = 100;
    var cd = 100;
    let point = new Point(x, y, z);
    let found = [];
    //buscar_punto(box,found);
    
    /*dquery();
    var cx = document.getElementById("CX").value;
    var cy = document.getElementById("CY").value;
    var cz = document.getElementById("CZ").value;
    var cw = document.getElementById("CW").value;
    var ch = document.getElementById("CH").value;
    var cd = document.getElementById("CD").value;
    let box = new Box(cx,cy,cz,cw,ch,cd);
    let found = [];*/
    octree.buscar_punto_octree(point,found,"GEN",1);
    //document.getElementById("found").innerHTML = "Found points : " + found.length;
    //alert("RECO: "+found);
    
    var cont = 0;
    scene_x.remove(text_1);
    scene_x.remove(text_2);
    scene_x.remove(text_3);
    scene_x.remove(text_4);
    opc_1 = false;
    opc_2 = false;
    opc_3 = false;
    opc_4 = false;
    for(var i=0; i<found.length; i++){
        if(found[i].indexOf("sss") >= 0){
            cont++;
            if(cont == 1){
                var texto_1 = found[i].substring(found[i].indexOf("[")+1, found[i].indexOf("]"));
                loader_1 = new THREE.FontLoader();
                loader_1.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',function (font){
                   var message = texto_1;
                   var matLite = new THREE.MeshBasicMaterial({
                    color: 'white',
                    transparent: true,
                    size: 10,
                    side: THREE.DoubleSide
                   });
                   var shapes = font.generateShapes(message,20);
                   var geometry = new THREE.ShapeBufferGeometry(shapes)
                                           .translate( -300, 200, 0);
                   text_1 = new THREE.Mesh( geometry, matLite );
                   text_1.position.z = -450;
                   scene_x.add(text_1);
                });
                opc_1 = true;
            }
            if(cont == 2){
                var texto_2 = found[i].substring(found[i].indexOf("[")+1, found[i].indexOf("]"));
                loader_2 = new THREE.FontLoader();
                loader_2.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',function (font){
                   var message = texto_2;
                   var matLite = new THREE.MeshBasicMaterial({
                    color: 'white',
                    transparent: true,
                    size: 10,
                    side: THREE.DoubleSide
                   });
                   var shapes = font.generateShapes(message,20);
                   var geometry = new THREE.ShapeBufferGeometry(shapes)
                                            .translate( -300, 0, 0);
                   text_2 = new THREE.Mesh( geometry, matLite );
                   text_2.position.z = -450;
                   scene_x.add(text_2);
                });
                opc_2 = true;
            }
            if(cont == 3){
                var texto_3 = found[i].substring(found[i].indexOf("[")+1, found[i].indexOf("]"));
                loader_3 = new THREE.FontLoader();
                loader_3.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',function (font){
                   var message = texto_3;
                   var matLite = new THREE.MeshBasicMaterial({
                    color: 'white',
                    transparent: true,
                    size: 10,
                    side: THREE.DoubleSide
                   });
                   var shapes = font.generateShapes(message,20);
                   var geometry = new THREE.ShapeBufferGeometry(shapes)
                                            .translate( -300, -150, 0);
                   text_3 = new THREE.Mesh( geometry, matLite );
                   text_3.position.z = -450;
                   scene_x.add(text_3);
                });
                opc_3 = true;
            }
            if(cont == 4){
                var texto_4 = found[i].substring(found[i].indexOf("[")+1, found[i].indexOf("]"));
                loader_4 = new THREE.FontLoader();
                loader_4.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',function (font){
                   var message = texto_4;
                   var matLite = new THREE.MeshBasicMaterial({
                    color: 'white',
                    transparent: true,
                    size: 10,
                    side: THREE.DoubleSide
                   });
                   var shapes = font.generateShapes(message,20);
                   var geometry = new THREE.ShapeBufferGeometry(shapes)
                                            .translate( -300, -250, 0);
                   text_4 = new THREE.Mesh( geometry, matLite );
                   text_4.position.z = -450;
                   scene_x.add(text_4);
                });
                opc_4 = true;
            }
        }
    }
}
