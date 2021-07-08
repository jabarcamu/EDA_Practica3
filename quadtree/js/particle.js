class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.highlight = false;
      this.r = 8;
    }
  
    move() {
      this.x += random(-1, 1);
      this.y += random(-1, 1);
    }
  
    render(graph) {
        graph.noStroke();
      if (this.highlight) graph.fill(255);
      else graph.fill(100);
      graph.ellipse(this.x, this.y, this.r, this.r);
    }
  
    checkCollision(others) {
      this.highlight = false;
      for (let other of others) {
        if (other.userData) {
          other = other.userData;
        }
        if (this != other) {
          let d = dist(this.x, this.y, other.x, other.y);
          if (d < other.r / 2 + this.r / 2) {
            this.highlight = true;
          }
        }
      }
    }
  }