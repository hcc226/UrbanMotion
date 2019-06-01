/**
 * Displays a geographic vector field using moving particles.
 * Positions in the field are drawn onscreen using the Alber
 * "Projection" file.
 */

var Particle = function(x, y, age) {
    this.x = x;
    this.y = y;
    this.oldX = -1;
    this.oldY = -1;
    this.age = age;
    this.rnd = Math.random();
}

export{
    Particle
}