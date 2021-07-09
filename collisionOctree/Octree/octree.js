var alpha = 0.2;

class Point{
	constructor(x,y,z,userData){
		this.x = x;
		this.y = y;
		this.z = z;
		this.userData = userData;
		//this.geometry = new THREE.SphereGeometry( 2, 10, 10 );
		//this.material = new THREE.MeshBasicMaterial();
		//this.sphere = new THREE.Mesh( this.geometry, this.material );
		//this.sphere.position.set(x,y,z);
		//scene.add( this.sphere );
	}
}

//clase esfera un nuevo bounding box para la query
class Sphere{
	constructor(x,y,z,r){
		this.x = x;
		this.y = y;
		this.z = z;
		this.r = r;
		this.rSquared = this.r * this.r;
	}

	//funcion contains en base a un punto
	contains(point){
		//revisar el punto al interior de la esferea
		//distancia del punto al centro es mas pequeño que el radio de la esfera
		let d = Math.pow((point.x - this.x),2) + Math.pow((point.y - this.y),2) +  Math.pow((point.z - this.z),2);
		return d <= this.rSquared;
	}

	//funcion de interseccion de un bb con la esfera
	intersects(range){
		//componentes de la distancia, a partir de los centros de la esferea y del bb
		let xDist = Math.abs(range.x - this.x);
		let yDist = Math.abs(range.y - this.y);
		let zDist = Math.abs(range.z - this.z);

		//radio de la esfera
		let r = this.r;

		//obtener los limites a partir de la combinacion con
		//el ancho y largo del bounding box
		let w = range.w / 2;
		let h = range.h / 2;
		let d = range.d / 2;

		//la circuferencia dada por diferentes vectores a partir del centro de la esferea
		let edges = Math.pow((xDist - w),2) + Math.pow((yDist - h),2) + Math.pow((zDist - d),2);
		//cuando no hay interseccion
		if(xDist > (r+w) || yDist > (r+h) || zDist > (r+d))
			return false;
		//cuando hay interseccion al interior de la esfera
		if(xDist <= w || yDist <= h || zDist <= d)
			return true;
		//interseccion sobre la circunferencia de la esfera
		return edges <= this.rSquared;
	}
}


class Box{
	constructor(x,y,z,w,h,d){
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.h = h;
		this.d = d;
	}

	contains(point){
		return (point.x >= (this.x - this.w) && 
			point.x <= (this.x + this.w) && 
			point.y >= (this.y - this.h) && 
			point.y <= (this.y + this.h) &&
			point.z >= (this.z - this.d) &&
			point.z <= (this.z + this.d)); 
	}

	intersects(box){
		return !(box.x - box.w > this.x + this.w  ||
			box.x + box.w < this.x - this.w  ||
			box.y - box.h > this.y + this.h  ||
			box.y + box.h < this.y - this.h  ||
			box.z - box.d > this.z + this.d  ||
			box.z + box.d < this.z - this.d);
	}
}

//clase octree
class Octree{
	constructor(box,n){
		this.box = box;
		this.capacity = n;
		this.points = [];
		this.divided = false;

		//random color
		this.color = new THREE.Color( Math.random()*1,Math.random()*1,Math.random()*1);

		this.geometry = new THREE.BoxGeometry(box.w*2,box.h*2,box.d*2);
		this.edges = new THREE.EdgesGeometry(this.geometry);
		this.cube = new THREE.LineSegments(this.edges,new THREE.LineBasicMaterial({color: 0xffffff}));
		//this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: alpha , transparent: true, } );
		//this.material.color.set(this.color);

		//this.cube = new THREE.Mesh( this.geometry, this.material );
		this.cube.position.set(box.x,box.y,box.z);
		scene.add(this.cube);
	}

	subdivide(){
		//sigue siendo el mismo centro
		let x = this.box.x;
		let y = this.box.y;
		let z = this.box.z;
		let w = this.box.w/2;
		let h = this.box.h/2;
		let d = this.box.d/2;

		//parte del front (z-d)
		let nof = new Box(x-w,y-h,z-d,w,h,d); 
		let nef = new Box(x+w,y-h,z-d,w,h,d);
		let sof = new Box(x-w,y+h,z-d,w,h,d);
		let sef = new Box(x+w,y+h,z-d,w,h,d);

		//parte del back (z+d)
		let nob = new Box(x-w,y-h,z+d,w,h,d);
		let neb = new Box(x+w,y-h,z+d,w,h,d);
		let sob = new Box(x-w,y+h,z+d,w,h,d);
		let seb = new Box(x+w,y+h,z+d,w,h,d);

		//parte del front
		this.sonNOF = new Octree(nof,this.capacity);
		this.sonNEF = new Octree(nef,this.capacity);
		this.sonSOF = new Octree(sof,this.capacity);
		this.sonSEF = new Octree(sef,this.capacity);

		//parte del back
		this.sonNOB = new Octree(nob,this.capacity);
		this.sonNEB = new Octree(neb,this.capacity);
		this.sonSOB = new Octree(sob,this.capacity);
		this.sonSEB = new Octree(seb,this.capacity);

		alpha = alpha + 0.1;
		this.divided = true;
	}

	insert(point){
		if(!this.box.contains(point)){
			return false;
		}
		if(this.points.length<this.capacity){
			this.points.push(point);
			//elige el color random que fue asignado a este quadtree
			//point.material.color.set(new THREE.Color(1,1,1));
			return true;
		}
		if(!this.divided){
			this.subdivide();
		}
		return (this.sonNOF.insert(point) ||
			this.sonNEF.insert(point) ||
			this.sonSOF.insert(point) ||
			this.sonSEF.insert(point) ||
			this.sonNOB.insert(point) ||
			this.sonNEB.insert(point) ||
			this.sonSOB.insert(point) ||
			this.sonSEB.insert(point) );
	}

	//consulta de existencia de punto
	query(box,found){
		if(!found){
			found = [];
		}
		//debugger;
		//si el querybox no intersecciona al actual octree (cubo en n' nivel)
		//retorna, esta zona queda descartada de la consulta.
		if(!this.box.intersects(box)){
			return found;
		}


		//para todos los puntos de este cuadrante (actual cubo octree)
		for(let p of this.points){
			//preguntamos si el querybox contiene los puntos (sin importar su posicion)
			if(box.contains(p)){
				//el punto es cambiado a color negro 
				//p.material.color.set(new THREE.Color(1,1,1));
				//recolectamos los puntos
				found.push(p);
			}
		}
		if(this.divided){
			//recursivamente pasamos por los cubos hijos pasando
			//con el recolector de puntos y el querybox
			this.sonNOF.query(box,found);
			this.sonNEF.query(box,found);
			this.sonSOF.query(box,found);
			this.sonSEF.query(box,found);
			this.sonNOB.query(box,found);
			this.sonNEB.query(box,found);
			this.sonSOB.query(box,found);
			this.sonSEB.query(box,found);
		}
		return found;

	}

	cleanQuery(box){
		//realizar el mismo proceso de consulta pero
		//ya no recolectamos los puntos y regresamos
		//el color del punto al color asignado aleatoriamente al cuadrante
		if(!this.box.intersects(box)){
			return;
		}
		else{
			for(let p of this.points){
				if(box.contains(p)){
					//regresar al color del quadrante
					p.material.color.set(this.color);
				}
			}
			if(this.divided){
				this.sonNOF.cleanQuery(box);
				this.sonNEF.cleanQuery(box);
				this.sonSOF.cleanQuery(box);
				this.sonSEF.cleanQuery(box);
				this.sonNOB.cleanQuery(box);
				this.sonNEB.cleanQuery(box);
				this.sonSOB.cleanQuery(box);
				this.sonSEB.cleanQuery(box);
			}
		}
	}
}
