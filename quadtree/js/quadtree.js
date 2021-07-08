class Point {
  constructor(x, y, userData) {
      this.x = x;
      this.y = y;
      this.userData = userData; //para detectar colisiones
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x; // centro x
    this.y = y; // centro y
    this.w = w; // mitad ancho
    this.h = h; // mitad alto
  }

  contains(point) {
    return (
      (point.x >= this.x - this.w) &&
      (point.x <= this.x + this.w) && // ancho
      (point.y >= this.y - this.h) &&
      (point.y <= this.y + this.h) // alto
    );
  }


  intersects(range) {
    return !(
      (range.x - range.w > this.x + this.w) || 
      (range.x + range.w < this.x - this.w) ||
      (range.y - range.h > this.y + this.h) || 
      (range.y + range.h < this.y - this.h)
    )
  }
}

// clase circulo para una consulta circular
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
  }

  contains(point) {
    // check if the point is in the circle by checking if the euclidean distance of
    // the point and the center of the circle if smaller or equal to the radius of
    // the circle
    let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
    return d <= this.rSquared;
  }

  intersects(range) {

    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    // radius of the circle
    let r = this.r;

    let w = range.w / 2;
    let h = range.h / 2;

    let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

    // no intersection
    if (xDist > (r + w) || yDist > (r + h))
      return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h)
      return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
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
      let x = this.boundary.x;
      let y = this.boundary.y;
      let w = this.boundary.w * 0.5;
      let h = this.boundary.h * 0.5; 
      
      let px0 = x + w;
      let px1 = x - w;
      let py0 = y + h;
      let py1 = y - h; 

      // 2: Asignar los QuadTree creados a cada hijo 
      let qt_northeast = new Rectangle(px0, py1, w, h);
      this.northeast = new QuadTree(qt_northeast, this.capacity);
      
      let qt_northwest = new Rectangle(px1, py1, w, h);
      this.northwest = new QuadTree(qt_northwest, this.capacity);
      
      let qt_southeast = new Rectangle(px0, py0, w, h);
      this.southeast = new QuadTree(qt_southeast, this.capacity);
      
      let qt_southwest = new Rectangle(px1, py0, w, h);
      this.southwest = new QuadTree(qt_southwest, this.capacity);
      
      // 3.- Hacer: this.divided <- true
      this.divided = true;
      
  }

  // implentar el query
  query(range, found) {
    if (!found) {
      found = [];
    }      

    if (!range.intersects(this.boundary)) {
      return found;
    }

    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }

    return found;
  }

  insert(point) {

    // Algoritmo
    // 1: Si el punto no esta en los limites ( boundary ) del quadtree Return
    if (!this.boundary.contains(point)) {
      return false;
    // 2: Si ( this.points.length ) < ( this.capacity ),
    } 
    if (this.points.length < this.capacity) {
      // 2.1 Insertamos en el vector this.points
        this.points.push(point);
        return true;
      // Sino
      // 2.2 Dividimos si aun no ha sido dividido
    } else {
        if (!this.divided) {
            this.subdivide();
        }
        // 2.3 Insertamos recursivamente en los 4 hijos.      
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

  show(graph) {
    graph.stroke(255);
    graph.strokeWeight(1);
    graph.noFill();
    graph.rectMode(CENTER);
    graph.rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h*2);
      if (this.divided) {
          this.northeast.show(graph);
          this.northwest.show(graph);
          this.southeast.show(graph);
          this.southwest.show(graph);
      }

      for (let p of this.points) {
        graph.strokeWeight(4);
        graph.point(p.x, p.y);
      }
  }
}