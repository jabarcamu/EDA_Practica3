class Test {

    constructor(cube) {
        this.cube = cube;
        this.containsInCube = [];
        this.noContainsInCube = [];
        this.intersectCube = [];
        this.noIntersectCube = [];
    }

    // arreglo de puntos a comparar
    contains(pointsCompare) {
        for (let i = 0; i < pointsCompare.length; i++) {
            let p = pointsCompare[i];  // punto en 3D          
            if(this.cube.contains(p)) {
                this.containsInCube.push(p);
            } else {
                this.noContainsInCube.push(p);
            }    
        }
        
    }

    // arreglo de cubos a comparar
    intersects(cubesCompare) {
        for (let i = 0; i < cubesCompare.length; i++) {
            let c = cubesCompare[i];  // punto en 3D          
            if(this.cube.intersects(c)) {
                this.intersectCube.push(c);
            } else {
                this.noIntersectCube.push(c);
            }    
        }
        
    }
     
}

