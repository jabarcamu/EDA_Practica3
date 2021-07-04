class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

    class Rectangle {
    constructor(x, y, w, h) {
        this.x = x; // center
        this.y = y;
        this.w = w; // half width
        this.h = h; // half height
    }
    
    contains(point) {
        var temp = (
            (point.x >= this.x - this.w) && (point.x < this.x + this.w) && // ancho
            (point.y >= this.y - this.h) && (point.y < this.y + this.h) // alto
          )
        return temp;
    }

    
    intersects(range) {
        var temp = (
            (range.x - range.w > this.x + this.w) || (range.x + range.w < this.x - this.w) ||
            (range.y - range.h > this.y + this.h )||(range.y + range.h < this.y - this.h)
          )
          return temp 
    }
}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary; // Rectangle
        this.capacity = n; // capacidad maxima de cada cuadrante
        this.points = []; // vector , almacena los puntos a almacenar
        this.divided = false;
    }

    // divide el quadtree en 4 quadtrees
    subdivide() {

        // Algoritmo
        // 1: Crear 4 hijos: qt_northeast , qt_northwest , qt_southeast ,qt_southwest
        // 2: Asignar los QuadTree creados a cada hijo
        // this.northeast = qt_northeast;
        // this.northwest = qt_northwest;
        // this.southeast = qt_southeast;
        // this.southwest = qt_southwest;

        let _x = this.boundary.x;
        let _y = this.boundary.y;
        let _w = this.boundary.w * 0.5;
        let _h = this.boundary.h * 0.5; 
        
        let px0 = _x + _w;
        let px1 = _x - _w;
        let py0 = _y + _h;
        let py1 = _y - _h;

        let ne = new Rectangle(px0, py1, _w, _h);
        this.northeast = new QuadTree(ne, this.capacity);

        let nw = new Rectangle(px1, py1, _w, _h);
        this.northwest = new QuadTree(nw, this.capacity);

        let se = new Rectangle(px0, py0, _w, _h);
        this.southeast = new QuadTree(se, this.capacity);

        let sw = new Rectangle(px1, py0, _w, _h);
        this.southwest = new QuadTree(sw, this.capacity);
        
        this.divided = true;
        // 3.- Hacer: this.divided <- true
    }

    insert(point) {

        // Algoritmo
        // 1: Si el punto no esta en los limites ( boundary ) del quadtree Return

        // 2: Si ( this.points.length ) < ( this.capacity ),
        // 2.1 Insertamos en el vector this.points
        // Sino
        // 2.2 Dividimos si aun no ha sido dividido
        // 2.3 Insertamos recursivamente en los 4 hijos.
        // this.northeast.insert ( point );
        // this.northwest.insert ( point );
        // this.southeast.insert ( point );
        // this.southwest.insert ( point );

        if (!this.boundary.contains(point)) {
            return false;
          }    if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
          } else {
            if (!this.divided) {
              this.subdivide();
            }
            if (this.northeast.insert(point)) {
              return true;
            } else if (this.northwest.insert(point)) {
              return true;
            } else if (this.southeast.insert(point)) {
              return true;
            } else if (this.southwest.insert(point)) {
              return true;
            }
          }
    }

    // implentar el query
    query(range, found) {
      
    }

    show() {
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h*2);
        if (this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }

        for (let p of this.points) {
            strokeWeight(4);
            point(p.x, p.y);
        }
    }
}


//setup()


// var punto = new Point(1,2,4);
// var rect = new Rectangle(0,0,5,5);

// var quad = new QuadTree(rect,2);

// var punto1 = new Point(1,2,4);
// quad.insert(punto1)

// var punto2 = new Point(2,3,4);
// quad.insert(punto2)

// var punto3 = new Point(3,3,4);
// quad.insert(punto3)

// console.log(quad)
// quad.show()
        