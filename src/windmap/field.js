
var Vector = function(x, y) {
    this.x = x;
    this.y = y;
}
Vector.polar = function(r, theta) {
    return new Vector(r * Math.cos(theta), r * Math.sin(theta));
};


Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};


Vector.prototype.copy = function(){
    return new Vector(this.x, this.y);
};


Vector.prototype.setLength = function(length) {
    var current = this.length();
    if (current) {
        var scale = length / current;
        this.x *= scale;
        this.y *= scale;
    }
    return this;
};


Vector.prototype.setAngle = function(theta) {
    var r = length();
    this.x = r * Math.cos(theta);
    this.y = r * Math.sin(theta);
    return this;
};


Vector.prototype.getAngle = function() {
    return Math.atan2(this.y, this.x);
};


Vector.prototype.d = function(v) {
    var dx = v.x - this.x;
    var dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Represents a vector field based on an array of data,
 * with specified grid coordinates, using bilinear interpolation
 * for values that don't lie on grid points.
 */

/**
 *
 * @param field 2D array of Vectors
 *
 * next params are corners of region.
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
var VectorField = function(field, x0, y0, x1, y1, map) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.field = field;
    map.field = field;
    this.w = field.length;
    this.h = field[0].length;
    this.maxLength = 0;
    var mx = 0;
    var my = 0;
    for (var i = 0; i < this.w; i++) {
        for (var j = 0; j < this.h; j++) {
            if (field[i][j].length() > this.maxLength) {
                mx = i;
                my = j;
            }
            this.maxLength = Math.max(this.maxLength, field[i][j].length());
        }
    }
    console.log(this.maxLength)
    mx = (mx / this.w) * (x1 - x0) + x0;
    my = (my / this.h) * (y1 - y0) + y0;
};

/**
 * Reads data from raw object in form:
 * {
 *   x0: -126.292942,
 *   y0: 23.525552,
 *   x1: -66.922962,
 *   y1: 49.397231,
 *   gridWidth: 501.0,
 *   gridHeight: 219.0,
 *   field: [
 *     0,0,
 *     0,0,
 *     ... (list of vectors)
 *   ]
 * }
 *
 * If the correctForSphere flag is set, we correct for the
 * distortions introduced by an equirectangular projection.
 */
VectorField.read = function(data, map, correctForSphere) {
    var field = [];
    console.log(data)
    var w = data.gridWidth;
    var h = data.gridHeight;
    var n = 2 * w * h;
    var i = 0;
    // OK, "total" and "weight"
    // are kludges that you should totally ignore,
    // unless you are interested in the average
    // vector length on vector field over lat/lon domain.
    var total = 0;
    var weight = 0;
    for (var x = 0; x < h; x++) {
        field[x] = [];
        for (var y = 0; y < w; y++) {
            var vx = data.field[i++];
            var vy = data.field[i++];
            var v = new Vector(vx, vy);
            // Uncomment to test a constant field:
            // v = new Vector(10, 0);
            if (correctForSphere) {
                var ux = x / (w - 1);
                var uy = y / (h - 1);
                var lon = data.x0 * (1 - ux) + data.x1 * ux;
                var lat = data.y0 * (1 - uy) + data.y1 * uy;
                var m = Math.PI * lat / 180;
                var length = v.length();
                if (length) {
                    total += length * m;
                    weight += m;
                }
                v.x /= Math.cos(m);
                v.setLength(length);
            }
            field[x][y] = v;
        }
    }
    var result = new VectorField(field, data.x0, data.y0, data.x1, data.y1, map);
    //window.console.log('total = ' + total);
    //window.console.log('weight = ' + weight);
    if (total && weight) {

        result.averageLength = total / weight;
    }
    console.log(result)
    return result;

};

VectorField.prototype.inBounds = function(x, y) {
    return x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1;
};


VectorField.prototype.bilinear = function(coord, a, b) {
    var na = Math.floor(a);
    var nb = Math.floor(b);
    var ma = Math.ceil(a);
    var mb = Math.ceil(b);
    var fa = a - na;
    var fb = b - nb;
    /*console.log(a)
        console.log(b)
        console.log(na)
        console.log(nb)
        console.log()
        console.log(ma)
        console.log(mb)
        this.field[na][nb][coord];

        console.log(this.field[na][nb][coord] * (1 - fa) * (1 - fb) +
            this.field[ma][nb][coord] * fa * (1 - fb) +
            this.field[na][mb][coord] * (1 - fa) * fb +
            this.field[ma][mb][coord] * fa * fb)*/
    return this.field[na][nb][coord] * (1 - fa) * (1 - fb) +
        this.field[ma][nb][coord] * fa * (1 - fb) +
        this.field[na][mb][coord] * (1 - fa) * fb +
        this.field[ma][mb][coord] * fa * fb;
};


VectorField.prototype.getValue = function(x, y, opt_result) {
    /*console.log(x)
    console.log(y)*/
    var a = (this.w - 1 - 1e-6) * (x - this.x0) / (this.x1 - this.x0);
    var b = (this.h - 1 - 1e-6) * (y - this.y0) / (this.y1 - this.y0);
    //console.log( Math.floor(a), Math.floor(b))
    var vx = this.bilinear('x', a, b);
    var vy = this.bilinear('y', a, b);
    if (opt_result) {
        opt_result.x = vx;
        opt_result.y = vy;
        /*console.log("opt_result")*/
        return opt_result;
    }
    return new Vector(vx, vy);
};


VectorField.prototype.vectValue = function(vector) {
    return this.getValue(vector.x, vector.y);
};


VectorField.constant = function(dx, dy, x0, y0, x1, y1) {
    var field = new VectorField([[]], x0, y0, x1, y1);
    field.maxLength = Math.sqrt(dx * dx + dy * dy);
    field.getValue = function() {
        return new Vector(dx, dy);
    }
    return field;
}

export {
    VectorField
}