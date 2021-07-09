var alpha = 0.2;
var niveles = 1;
class Point{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.geometry = new THREE.SphereGeometry( 2, 10, 10 );
        this.material = new THREE.MeshBasicMaterial();
        this.sphere = new THREE.Mesh( this.geometry, this.material );
        this.sphere.position.set(x,y,z);
        scene.add( this.sphere );
        //*** Trasladar Puntos al Centro
        this.geometry.translate( -50, -50, -50);
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
        return (
            point.x >= (this.x - this.w) && 
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

class Octree{
    constructor(box,n){
        this.box = box;
        this.capacity = n;
        this.points = [];
        this.divided = false;

        this.col_r = Math.random()*250;
        this.col_g = Math.random()*250;
        this.col_b = Math.random()*250;
        this.color = new THREE.Color("rgb("+this.col_r+","+this.col_g+","+this.col_b+")");
        
        
        //this.geometry = new THREE.BoxGeometry(box.w*2,box.h*2,box.d*2);
        //this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: alpha , transparent: true, } );
        //this.material.color.set(this.color);
        //this.cube = new THREE.Mesh( this.geometry, this.material );
        //this.cube.position.set(box.x,box.y,box.z);
        
        this.geometry = new THREE.BoxBufferGeometry(box.w*2,box.h*2, box.w*2,box.h*2);//BoxBufferGeometry,BoxGeometry
        this.edges = new THREE.EdgesGeometry(this.geometry);
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        this.cube = new THREE.LineSegments(this.edges, this.material );
        this.cube.position.set(box.x,box.y,box.z);
        //*** Trasladas Aristas al Centro
        this.edges.translate( -50, -50, -50);
        
        scene.add(this.cube);
    }

    subdivide(){
        let x = this.box.x;
        let y = this.box.y;
        let z = this.box.z;
        let w = this.box.w/2;
        let h = this.box.h/2;
        let d = this.box.d/2;

        let nof = new Box(x-w,y-h,z-d,w,h,d); 
        let nef = new Box(x+w,y-h,z-d,w,h,d);
        let sof = new Box(x-w,y+h,z-d,w,h,d);
        let sef = new Box(x+w,y+h,z-d,w,h,d);
        let nob = new Box(x-w,y-h,z+d,w,h,d);
        let neb = new Box(x+w,y-h,z+d,w,h,d);
        let sob = new Box(x-w,y+h,z+d,w,h,d);
        let seb = new Box(x+w,y+h,z+d,w,h,d);

        this.sonNOF = new Octree(nof,this.capacity);
        this.sonNEF = new Octree(nef,this.capacity);
        this.sonSOF = new Octree(sof,this.capacity);
        this.sonSEF = new Octree(sef,this.capacity);
        this.sonNOB = new Octree(nob,this.capacity);
        this.sonNEB = new Octree(neb,this.capacity);
        this.sonSOB = new Octree(sob,this.capacity);
        this.sonSEB = new Octree(seb,this.capacity);

        alpha = alpha + 0.1;
        niveles++;
        this.divided = true;
    }

    insert(point){
        if(!this.box.contains(point)){
            return false;
        }
        if(this.points.length<this.capacity){
            this.points.push(point);
            var R = Math.floor(Math.random()*250);
            var G = Math.floor(Math.random()*250);
            var B = Math.floor(Math.random()*250);
            var COL = new THREE.Color("rgb("+R+","+G+","+B+")")
            //point.material.color.set(this.color);
            point.material.color.set(COL);
            //alert(JSON.stringify(COL));
            $("#codigo_puntos").html(
                    $("#codigo_puntos").html()+
                    "<button type=\"button\" class=\"btn btn-success\" "+
                    "   onclick=\"buscar_punto('"+R+"','"+G+"','"+B+"','"+point.x+"','"+point.y+"','"+point.z+"')\" "+
                    "   style=\"background: rgb("+R+","+G+","+B+") \" "+
                    ">&nbsp;</button>"
                    );
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

    query(box,found){
        if(!this.box.intersects(box)){
            return;
        }
        else{
            for(let p of this.points){
                if(box.contains(p)){
                    p.material.color.set(new THREE.Color(1,1,2));
                    found.push(p);
                    //*** Trasladar Puntos al Centro
                    //p.edges.translate( -50, -50, -50);
                }
            }
            if(this.divided){
                this.sonNOF.query(box,found);
                this.sonNEF.query(box,found);
                this.sonSOF.query(box,found);
                this.sonSEF.query(box,found);
                this.sonNOB.query(box,found);
                this.sonNEB.query(box,found);
                this.sonSOB.query(box,found);
                this.sonSEB.query(box,found);
            }
        }
    }

    cleanQuery(box){
        if(!this.box.intersects(box)){
            return;
        }
        else{
            for(let p of this.points){
                if(box.contains(p)){
                    //*** DABA COLOR EN QUERY ORIGINAL
                    //p.material.color.set(this.color);
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
    
    
    buscar_punto_octree(point,found,lado,nivel){
        if(!this.box.contains(point)){
            found.push(""+nivel+"."+lado+" nnn "+"("+this.box.x+","+this.box.y+","+this.box.z+")\n");
            return;
        }
        else{
            //for(let p of this.points){
                if(this.box.contains(point)){
                    //p.material.color.set(new THREE.Color(1,1,2));
                    found.push(""+nivel+"."+lado+" sss ["+nivel+". "+lado+" ("+this.box.x+","+this.box.y+","+this.box.z+")]\n");
                    //*** Trasladar Puntos al Centro
                    //p.edges.translate( -50, -50, -50);
                }
            //}
            if(this.divided){
                this.sonNOF.buscar_punto_octree(point,found,"NOF",nivel+1);
                this.sonNEF.buscar_punto_octree(point,found,"NEF",nivel+1);
                this.sonSOF.buscar_punto_octree(point,found,"SOF",nivel+1);
                this.sonSEF.buscar_punto_octree(point,found,"SEF",nivel+1);
                this.sonNOB.buscar_punto_octree(point,found,"NOB",nivel+1);
                this.sonNEB.buscar_punto_octree(point,found,"NEB",nivel+1);
                this.sonSOB.buscar_punto_octree(point,found,"SOB",nivel+1);
                this.sonSEB.buscar_punto_octree(point,found,"SEB",nivel+1);
            }
        }
    }
    
    
}