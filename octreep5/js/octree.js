
class Point3D {    
    constructor(x,y,z){
        this.x = x; // origen x
        this.y = y; // origen y
        this.z = z; // origen z
    }
}

class Cube{    
    constructor(x,y,z,w,h,d){
        this.x = x; // origen x
        this.y = y; // origen y
        this.z = z; // origen z
        this.w = w; // ancho
        this.h = h; // alto
        this.d = d; // profundidad
    }
    // verifica si un punto 3D pertenece al cubo
    constains(point){

        return (
            (this.x <= point.x && point.x <= (this.x + this.w)) && 
            (this.y <= point.y && point.y <= (this.y + this.h)) &&
            (this.z <= point.z && point.z <= (this.z + this.d))
        );
    }
    // verifica si existen interseccion entre Cubo A y Cubo B
    intersects(range){
        // cubo A(seis puntos por cubo).
        var RectALeft = range.x,RectARight = (range.x + range.w),RectATop = (range.y + range.h),RectABottom = range.y,RectAFront = range.z,RectABack = (range.z + range.d);
        // cubo B(seis puntos por cubo).
        var RectBLeft = this.x,RectBRight = (this.x + this.w),RectBTop = (this.y + this.h),RectBBottom = this.y,RectBFront = this.z, RectBBack = (this.z + this.d);                   
        
        return (
            RectALeft < RectBRight && 
            RectARight > RectBLeft &&
            RectABottom < RectBTop &&
            RectATop > RectBBottom && 
            RectAFront < RectBBack &&
            RectABack > RectBFront
        );         
    }
}


class OctTree {
    northwestInf; // cuadrante norte-oeste-inferior
    northeastInf; // cuadrante norte-este-inferior
    southwestInf; // cuadrante sur-oeste-inferior
    southeastInf; // cuadrante sur-este-inferior
    northwestSup; // cuadrante norte-oeste-superior
    northeastSup; // cuadrante norte-este-superior
    southwestSup; // cuadrante sur-oeste-superior
    southeastSup; // cuadrante sur-este-superior
    
    constructor(boundary, n){
        this.boundary = boundary; // cubo
        this.capacity = n; // maxima cantidad de puntos en el cubo
        this.points = []; // almacena los puntos
        this.divided = false; // indica que tiene cubos internos
    }  

    // subdivide el OctTree en 8 regiones, si supera la capacidad de puntos.
    subdivide(){
        var x = this.boundary.x; // x coordenada
        var y = this.boundary.y; // y coordenada
        var z = this.boundary.z; // z coordenada
        var w2 = this.boundary.w / 2.0; // mitad del ancho
        var h2 = this.boundary.h / 2.0; // mitad del alto 
        var d2 = this.boundary.d / 2.0; // mitad de la profundidad               

        this.northwestInf = new OctTree(new Cube(x, y, z + d2, w2, h2, d2),this.capacity);
        this.northeastInf = new OctTree(new Cube(x + w2, y, z + d2, w2, h2, d2),this.capacity)
        this.southwestInf = new OctTree(new Cube(x,y, z, w2, h2, d2),this.capacity)
        this.southeastInf = new OctTree(new Cube(x + w2, y, z, w2, h2, d2),this.capacity)
        this.northwestSup = new OctTree(new Cube(x, y + h2, z + d2, w2, h2, d2),this.capacity);
        this.northeastSup = new OctTree(new Cube(x + w2, y + h2, z + d2, w2, h2, d2),this.capacity)
        this.southwestSup = new OctTree(new Cube(x, y + h2, z, w2, h2, d2),this.capacity)
        this.southeastSup = new OctTree(new Cube(x + w2, y + w2, z, w2, h2, d2),this.capacity)
                
        this.divided = true; // indica que ya esta dividido
    }

    // verifica si un punto ya existe, para no repetirlo
    pointDuplicated(point){
        let duplicated = false;
        for (let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            if(p.x === point.x && p.y === point.y && p.z === point.z){
                duplicated = true;
                break;
            }
        }
        return duplicated;
    }

    // inserta puntos en el octree
    insert(point){
        // console.log('Insert point ... ', point);
        // Verifica que el punto este en los limites del cubo.
        if(!this.boundary.constains(point)){
            return;
        }
        // verifica que hay espacio para insertar puntos
        if(this.points.length < this.capacity){
            // verificar que el punto no exista    
            if(!this.pointDuplicated(point)){
                this.points.push(point);
            }            
        }else {          
            if(!this.divided){ // verifica que no esta dividido
                // Crea las 8 regiones NWI, NEI, SWI, SEI, NWS, NES, SWS, SES
                this.subdivide();                
            }            
            // insertando recursivamente el punto en los octree hijos
            this.northwestInf.insert(point);
            this.northeastInf.insert(point);
            this.southwestInf.insert(point);
            this.southeastInf.insert(point);
            this.northwestSup.insert(point);
            this.northeastSup.insert(point);
            this.southwestSup.insert(point);
            this.southeastSup.insert(point);
        }
    }  

    // retorna los puntos que encontro, en base al cubo seleccionado
    query(boundaryExtern,pointsReturn){
        
        // verificar si existe interseccion de cubos(cubo padre vs cubo externo)
        if(this.boundary.intersects(boundaryExtern)){
            // Obtener los puntos
            for (let i = 0; i < this.points.length; i++) {
                let p = this.points[i];
                // verifica el punto pertence al cubo externo
                if(boundaryExtern.constains(p)){
                    pointsReturn.push(p);
                }                
            }
        }
        // verifica si tiene octree hijos y obtiene los puntos recursivamente
        if(this.divided){
            this.northwestInf.query(boundaryExtern,pointsReturn);            
            this.northeastInf.query(boundaryExtern,pointsReturn);        
            this.southwestInf.query(boundaryExtern,pointsReturn);        
            this.southeastInf.query(boundaryExtern,pointsReturn);
            this.northwestSup.query(boundaryExtern,pointsReturn);            
            this.northeastSup.query(boundaryExtern,pointsReturn);        
            this.southwestSup.query(boundaryExtern,pointsReturn);        
            this.southeastSup.query(boundaryExtern,pointsReturn);
        }
        
    }

    printBoundary(boundary){
        let b = boundary;
        console.log('(',b.x,',',b.y,',',b.z,') -> (',b.w,',',b.h,',',b.d,')', ' -> ', this.points.length);        
    }
    // muestra recursivamente los octree padre e hijos
    show(dimension) {        
        // this.printBoundary(this.boundary);
        stroke(255); // color del cubo
        strokeWeight(1); // espesor del cubo
        noFill(); // transparente para no sobreponer elementos
        //rectMode(CENTER); // rectangulo en el centro
        let vector = createVector(-dimension/2,-dimension/2,-dimension/2);                
        let b = this.boundary; // cubo        
        let v = createVector(b.w/2 + b.x,b.h/2 + b.y, b.d/2 + b.z);
        vector.add(v);

        let cube = this.boundary;
        push();

        // translate(cube.x - dimension / 2,cube.y - dimension / 2,cube.z - dimension / 2);
        // translate(0,0,0);
        // console.log('translate ...   ', vector,' * ',b.w/2 - b.x,' * ',b.h/2 - b.y,' * ',b.d/2 - b.z);  
        rotateY(Math.PI / 3);      
        translate(vector);
        box(cube.w, cube.h, cube.d); // un cubo
        pop();
        if(this.divided){
            this.northwestInf.show(dimension);
            this.northeastInf.show(dimension);
            this.southwestInf.show(dimension);
            this.southeastInf.show(dimension);
            this.northwestSup.show(dimension);
            this.northeastSup.show(dimension);
            this.southwestSup.show(dimension);
            this.southeastSup.show(dimension);
        }
        
        // dibuja los puntos
        for (let p of this.points) {                                    
            push();    
            let vec = createVector(-dimension/2,-dimension/2,-dimension/2);        
            let pp = createVector(p.x,p.y,p.z);
            translate(vec.add(pp));
            strokeWeight(1);
            fill(255);            
            sphere(2);            
            pop();
        }
        
    }

}