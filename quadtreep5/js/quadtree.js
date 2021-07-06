
class Point2D {
  constructor(x, y){
      this.x = x; // origen x
      this.y = y; // origen y
  }
}

class Rectangle {
  constructor(x, y, w, h) { 
      this.x = x; // origen x
      this.y = y; // origen y
      this.w = w; // ancho
      this.h = h; // alto
  }
  // verifica si un punto pertenece al rectangulo
  constains(point){

      return (this.x <= point.x && point.x <= (this.x + this.w)) && (this.y <= point.y && point.y <= (this.y + this.h));
  }
  // verifica si existen interseccion de rectangulo A y rectangulo B
  intersects(range){

      var RectALeft = range.x, RectARight = (range.x + range.w), RectATop = (range.y + range.h), RectABottom = range.y;
      var RectBLeft = this.x, RectBRight = (this.x + this.w), RectBTop = (this.y + this.h), RectBBottom = this.y;           
      return (
          RectALeft < RectBRight && 
          RectARight > RectBLeft &&
          RectATop > RectBBottom && 
          RectABottom < RectBTop
      );         
  }
}

class QuadTree {
  northwest; // cuadrante norte-oeste
  northeast; // cuadrante norte-este
  southwest; // cuadrante sur-oeste
  southeast; // cuadrante sur-este
  
  constructor(boundary, n){
      this.boundary = boundary; // rectangulo
      this.capacity = n; // maxima cantidad de puntos en el rectangulo
      this.points = []; // almacena los puntos
      this.divided = false; // indica si tiene cuadrantes internos
  }  
  // subdivide el quadtree en 4 regiones, si supera la capacidad de puntos.
  subdivide(){
      var x = this.boundary.x; // origen x
      var y = this.boundary.y; // origen y
      var w2 = this.boundary.w / 2.0; // mitad del ancho del rectangulo
      var h2 = this.boundary.h / 2.0; // mitad del alto del rectangulo

      this.northwest = new QuadTree(new Rectangle(x, y + h2, w2, h2),this.capacity);
      this.northeast = new QuadTree(new Rectangle(x + w2,y + h2, w2, h2),this.capacity)
      this.southwest = new QuadTree(new Rectangle(x,y, w2, h2),this.capacity)
      this.southeast = new QuadTree(new Rectangle(x + w2, y, w2, h2),this.capacity)
              
      this.divided = true; // para indicar que ya se dividio
  }

  // verifica si un punto ya existe, para no repetirlo.
  pointDuplicated(point){
      let duplicated = false;
      for (let i = 0; i < this.points.length; i++) {
          let p = this.points[i];
          if(p.x === point.x && p.y === point.y){
              duplicated = true;
              break;
          }
      }
      return duplicated;
  }

  // inserta puntos en el quadtree
  insert(point){
      
      // Verifica que el punto este en los limites del rectangulo.
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
              // Crea las 4 regiones NW, NE, SW, SE
              this.subdivide();                
          }            
          // insertando recursivamente el punto en los quadtree hijos
          this.northwest.insert(point);
          this.northeast.insert(point);
          this.southwest.insert(point);
          this.southeast.insert(point);
      }
  }  

  // retorna los puntos que encontro, en base al rectangulo seleccionado
  query(boundaryExtern, pointsReturn){
      
      // verificar si existe interseccion de rectangulos(rectangulo padre vs rectangulo externo)
      if(this.boundary.intersects(boundaryExtern)){
          // Obtener los puntos
          for (let i = 0; i < this.points.length; i++) {
              let p = this.points[i];
              // verifica el punto pertence al rectangulo externo
              if(boundaryExtern.constains(p)){
                  pointsReturn.push(p);
              }                
          }
      }

      // verifica si tiene quadtree hijos y obtiene los puntos recursivamente
      if(this.divided) {
          this.northwest.query(boundaryExtern,pointsReturn);        
          this.northeast.query(boundaryExtern,pointsReturn);        
          this.southwest.query(boundaryExtern,pointsReturn);        
          this.southeast.query(boundaryExtern,pointsReturn);            
      }
      
  }

  // muestra recursivamente los quadtree padre e hijos
  show() {
      stroke(255); // color del rectangulo
      strokeWeight(1); // grosor del rectangulo 
      noFill(); // transparente para no sobreponer elementos
      //rectMode(CENTER); // rectangulo en el centro
      rect(this.boundary.x,this.boundary.y,this.boundary.w,this.boundary.h); // un rectangulo
      if(this.divided){
          this.northwest.show();
          this.northeast.show();
          this.southwest.show();
          this.southeast.show();
      }

      // dibuja los puntos
      for (let p of this.points) {
          strokeWeight(4); // grosor de los puntos
          point(p.x,p.y);
      }
  }

}