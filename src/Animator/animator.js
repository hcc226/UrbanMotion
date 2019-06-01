var Animator = function(element) {
    this.element = element;
    this.mouseIsDown = false;
    this.mouseX = -1;
    this.mouseY = -1;
    this.animating = true;
    this.state = 'animate';
    this.listeners = [];
    this.dx = 0;
    this.dy = 0;
    this.scale = 1;
    this.zoomProgress = 0;
    this.scaleTarget = 1;
    this.scaleStart = 1;
   // this.animFunc = opt_animFunc;
    //this.unzoomButton = opt_unzoomButton;

    if (element) {
        var self = this;
        $(element).mousedown(function(e){
            self.mouseX = e.pageX - this.offsetLeft;
            self.mouseY = e.pageY - this.offsetTop;
            self.mousedown();
        });
        $(element).mouseup(function(e){
            self.mouseX = e.pageX - this.offsetLeft;
            self.mouseY = e.pageY - this.offsetTop;
            self.mouseup();
        });
        $(element).mousemove(function(e){
            self.mouseX = e.pageX - this.offsetLeft;
            self.mouseY = e.pageY - this.offsetTop;
            self.mousemove();
        });
    }
};

function projectPoint(x, y) {
    let self = this;
    let point = self.map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}
let transform = d3.geoTransform({point: self.projectPoint}),
    path = d3.geoPath().projection(transform);

var Particle = function(x, y, age,line) {
    this.x = x;
    this.y = y;
    this.oldX = -1;
    this.oldY = -1;
    this.age = age;
    this.rnd = Math.random();
    if(line){
        this.num = line.num;
        this.type = line.type;
        this.dx = line.x;
        this.dy = line.y;
    }
}

function getgridW(SPLIT){
    var x0 = 115.4220;
    var y0 = 39.4570;
    var x1 = 117.5000;
    var y1 = 41.0500;
    return parseInt((x1 - x0) / SPLIT + 1)
  /*  LATNUM = int((locs['north'] - locs['south']) / SPLIT + 1)
    LNGNUM = int( (locs['east'] - locs['west']) / SPLIT + 1 )*/

}
function getgridH(SPLIT) {
    var x0 = 115.4220;
    var y0 = 39.4570;
    var x1 = 117.5000;
    var y1 = 41.0500;
    return parseInt((y1 - y0) / SPLIT + 1);
}

function getNextGrid(line){
    var eps1  = 0.923880;
    var eps2 = 0.382683;
   // var line = lines[i];
    var grid = getgrid(line.lng,line.lat);
    var nextGrid = grid
    if(line.y > eps1 && line.x <eps2 && line.x >= 0-eps2){
        nextGrid.a = grid.a + 1;
        nextGrid.b = grid.b;
    }
    else if(line.y < eps1 && line.y > eps2 && line.x >= eps2 && line.x < eps1){
        nextGrid.a = grid.a + 1;
        nextGrid.b = grid.b + 1;
    }
    else if(line.y < eps2 && line.y > 0-eps2 && line.x >=eps1){
        nextGrid.a = grid.a ;
        nextGrid.b = grid.b + 1;
    }
    else if(line.y < 0 - eps2 && line.y > 0 - eps1 && line.x >= eps2 && line.x < eps1){
        nextGrid.a = grid.a - 1;
        nextGrid.b = grid.b + 1;
    }
    else if(line.y < 0-eps1 && line.x <eps2 && line.x >= 0-eps2){
        nextGrid.a = grid.a - 1;
        nextGrid.b = grid.b;
    }
    else if(line.y < 0 - eps2 && line.y > 0 - eps1 && line.x >= 0 - eps1 && line.x < 0-eps1){
        nextGrid.a = grid.a - 1;
        nextGrid.b = grid.b - 1;
    }
    else if(line.y < eps2 && line.y > 0-eps2 && line.x <= 0-eps1){
        nextGrid.a = grid.a ;
        nextGrid.b = grid.b - 1;
    }
    else if(line.y > eps2 && line.y < eps1 && line.x >= 0-eps1 && line.x < 0-eps2){
        nextGrid.a = grid.a + 1;
        nextGrid.b = grid.b - 1;
    }
    return nextGrid;
}

function makeTree(directions,particle,p,lines,res,maxParticleLen,directionNum,num,dict) {
    /*console.log(directions.length)
    console.log(directions)*/
    if(directions.length === 0 || particle.length > maxParticleLen){
        return ;
    }
    for(var j = 0; j<directions.length;j++){
        var tp = [].concat(particle);
        /*if(j > 0){
            tp.pop();
        }*/
        var d = directions[j];
        tp.push(d);
        var r = getDirection(d,d.lng-p.lng,d.lat-p.lat,lines,directionNum,num,dict);
        var  newDirections = r[0]
        var newdict = r[1]
        makeTree(newDirections,tp,d,lines,res,maxParticleLen,directionNum,num,newdict)
        console.log(tp)
        res.push(tp);
    }
}
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].x == val.x && this[i].y == val.y && this[i].lng == val.lng && this[i].lat == val.lat) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function removeDict(dict,line) {
    //console.log("removedict")
   // console.log(dict)
   // console.log(line)
    var key = getgrid(line.lng,line.lat)
    key = key.a+"_"+key.b;
    //console.log(key)

    var newDict = dict;
   // console.log(newDict[key])
    if(newDict.hasOwnProperty(key)){
        if ( newDict[key].length === 1) {
            delete newDict[key];

        }
        else {
            var v = newDict[key];

            v.remove(line);

            newDict[key] = v;

        }
    }
    return newDict;
}
function makeParticleTree(lines,i,maxParticleLen,directionNum,linesDict) {
    var res = [];
    var particle = new Array();
   // console.log(particle)
    var line = lines[i];
    var nextGrid = getNextGrid(line);

    var dict = removeDict(linesDict,line)

    var root = {};
    root.lng = line.lng;
    root.lat = line.lat;
    //root.num = line.num;
    //console.log(root)
    particle.push(root);
    //console.log(particle)
    var p = getLngLat(nextGrid)
    p.num = line.num;
    //console.log(p)
    particle.push(p);
    //console.log(particle)
    var r = getDirection(p,line.x,line.y,lines,directionNum,line.num, dict);
    var directions = r[0]
    dict = r[1]
    //console.log(dict)
    //var tp = [];
    //console.log(particle)
    //var tmp = particle;
   makeTree(directions,particle,p,lines,res,maxParticleLen,directionNum,line.num,dict)

    //console.log(res);
    return [res,dict];
    //todo
}

function makeParticle(map,canvas,lines,i,maxParticleLen,directionNum,linesDict) {


   var line = lines[i]
    var x0 = 115.4220;
    var y0 = 39.4570;
    var x1 = 117.5000;
    var y1 = 41.0500;
    return makeParticleTree(lines,i,maxParticleLen,directionNum,linesDict)
    //return new Particle(line.lng,line.lat,1 + 40 * Math.random(),line);

}


var compareobject = function (x, y) {//比较函数
    if (x.num > y.num ) {
        return -1;
    } else if (x.num < y.num) {
        return 1;
    } else {
        return 0;
    }
}
function makeParticles(numParticle,map,canvas,lines,maxParticleLen,directionNum,particleNum,linesDict) {
    var particles = [];
    var particle;
    if(lines){
            for(var i = 0 ;i<particleNum;i++){
                var r = makeParticle(map,canvas,lines,i,maxParticleLen,directionNum,linesDict);
                particle =  r[0]
                linesDict = r[1];
                particles.push(particle)

                /* var grid = getgrid(lines[i].lng,lines[i].lat);
                 var flag = false;
                 for(var j = 0; j < grids.length;j++){
                     if(grids[j].a === grid.a && grids[j].b === grid.b){
                         flag = true;
                         grids[j].num ++;
                         break;
                     }
                 }
                 if(!flag){
                     grid.num = 1;
                     grids.push(grid);
                 }*/

            }

       /* for(var i = 0 ;i<particleNum;i++){
            particle = makeParticle(map,canvas,lines,i,maxParticleLen,directionNum);
            particles.push(particle)
           /!* var grid = getgrid(lines[i].lng,lines[i].lat);
            var flag = false;
            for(var j = 0; j < grids.length;j++){
                if(grids[j].a === grid.a && grids[j].b === grid.b){
                    flag = true;
                    grids[j].num ++;
                    break;
                }
            }
            if(!flag){
                grid.num = 1;
                grids.push(grid);
            }*!/

        }*/
    }
    else{
        for (var i = 0; i < numParticle; i++) {
            particles.push(makeParticle(map,canvas));
        }
    }
    console.log(particles)
   /* var res = grids.sort(compareobject)
    console.log(res)*/
    return particles;
}

function bilinear(coord,a,b,field) {
    var na = Math.floor(a);
    var nb = Math.floor(b);
    var ma = Math.ceil(a);
    var mb = Math.ceil(b);
    ma = ma > 31?31:ma;
    mb = mb >41?41:mb;
    var fa = a - na;
    var fb = b - nb;
    /*console.log(field);
    console.log(na);
    console.log(nb)*/
    return field[na][nb][coord] * (1 - fa) * (1 - fb) +
        field[ma][nb][coord] * fa * (1 - fb) +
        field[na][mb][coord] * (1 - fa) * fb +
        field[ma][mb][coord] * fa * fb;
}
function getValue(x,y,filed) {
    var x0 = 115.4220;
    var y0 = 39.4570;
    var x1 = 117.5000;
    var y1 = 41.0500;
    var w = 42;
    var h = 32;
    var a = (h - 1 - 1e-6) * (x - x0) / (x1 - x0);
    var b = (w - 1 - 1e-6) * (y - y0) / (y1 - y0);
    b = ( (parseFloat(x) - x0) / 0.05 )
    a = ( (parseFloat(y) - y0) / 0.05 )
    var vx = bilinear('x', a, b,filed);
    var vy = bilinear('y', a, b, filed);
    var res = {};
    res.x = vx;
    res.y = vy;
    return res ;
}
function getNum(x,y,field){
    var x0 = 115.4220;
    var y0 = 39.4570;
    var x1 = 117.5000;
    var y1 = 41.0500;
    var w = 42;
    var h = 32;
    var a = (h - 1 - 1e-6) * (x - x0) / (x1 - x0);
    var b = (w - 1 - 1e-6) * (y - y0) / (y1 - y0);
    b = parseInt( (parseFloat(x) - x0) / 0.05 )
    a = parseInt( (parseFloat(y) - y0) / 0.05 )
    return field[Math.floor(a)][Math.floor(b)]["num"];
}
function getLngLat(grid) {
    var x0 = 115.4220;
    var y0 = 39.4570;
    var a = grid.a;
    var b = grid.b;
    var p = {};
    p.lng = b*0.005 + x0 + 0.0025;
    p.lat = a*0.005 + y0 + 0.0025;
    p.lng = parseFloat(p.lng.toFixed(4));
    p.lat = parseFloat(p.lat.toFixed(4))
    return p;
}
function  getgrid(x,y) {
    var x0 = 115.4220;
    var y0 = 39.4570;
    var x1 = 117.5000;
    var y1 = 41.0500;
    var w = 416;
    var h = 319;
    var a;
    var b;
    var res = {};
    b = parseInt( (parseFloat(x) - x0) / 0.005 )
    a = parseInt( (parseFloat(y) - y0) / 0.005 )
    res.a = a;
    res.b = b;
    return res;
}
function getDirection(p,lastX,lastY,lines,directionNum,num,dict) {
    var res = {};
    var directions = [];
    var pgrid = getgrid(p.lng,p.lat);
    var key = getgrid(p.lng,p.lat)
    key = key.a+"_"+key.b;
    var lines1 = dict[key]
    var newDict = dict;
    if(dict.hasOwnProperty(key)){
        for (var i = 0; i<lines1.length;i++){
            var lgrid = getgrid(lines1[i].lng,lines1[i].lat);
            if(pgrid.a === lgrid.a && pgrid.b === lgrid.b){
                var dx = lines1[i].x;
                var dy = lines1[i].y;
                var distance = Math.sqrt((dx-lastX)*(dx-lastX)+(dy-lastY)*(dy-lastY))
                if(distance<1 && lines1[i].num > directionNum && lines1[i].num < num ){
                    res.x = dx;
                    res.y = dy;
                    res.num = lines1[i].num;
                    var p = getNextGrid(lines1[i])
                    if(p.a && (p.a != lgrid.a || p.b!= lgrid.b)){
                        p = getLngLat(p)
                        p.num = lines1[i].num;
                        var f = 0
                        for(var j = 0; j<directions.length;j++){
                            if(p.lng === directions[j].lng && p.lat === directions[j].lat){
                                f = f + 1 ;
                            }
                        }
                        if(f === 0){
                            directions.push(p);
                            newDict = removeDict(dict,lines1[i])
                        }

                    }

                }
                /* if(minDistance>distance && distance<1){
                    minDistance = distance;
                    res.x = dx;
                    res.y = dy;
                    res.num = lines[i].num;
                }*/
            }
        }
    }
    else{
        for (var i = 0; i<lines.length;i++){
            var lgrid = getgrid(lines[i].lng,lines[i].lat);
            if(pgrid.a === lgrid.a && pgrid.b === lgrid.b){
                var dx = lines[i].x;
                var dy = lines[i].y;
                var distance = Math.sqrt((dx-lastX)*(dx-lastX)+(dy-lastY)*(dy-lastY))
                if(distance<1 && lines[i].num > directionNum && lines[i].num < num ){
                    res.x = dx;
                    res.y = dy;
                    res.num = lines[i].num;
                    var p = getNextGrid(lines[i])
                    if(p.a && (p.a != lgrid.a || p.b!= lgrid.b)){
                        p = getLngLat(p)
                        p.num = lines[i].num;
                        var f = 0
                        for(var j = 0; j<directions.length;j++){
                            if(p.lng === directions[j].lng && p.lat === directions[j].lat){
                                f = f + 1 ;
                            }
                        }
                        if(f === 0){
                            directions.push(p);
                            newDict = removeDict(dict,lines[i])
                        }

                    }

                }
                /* if(minDistance>distance && distance<1){
                    minDistance = distance;
                    res.x = dx;
                    res.y = dy;
                    res.num = lines[i].num;
                }*/
            }
        }
    }

    /* if(!res.x){
         return {
             x:0,y:0,num:0,dx:0,dy:0
         }
     }
     var x0 = 115.4220;
     var y0 = 39.4570;
     for(var i = 1;;i=i+0.1){
         var db = parseInt( (parseFloat(p.x+res.x*0.0025*i) - x0) / 0.005 );
         var da = parseInt( (parseFloat(p.y+res.y*0.0025*i) - y0) / 0.005 );
         if(da!= pgrid.a || db != pgrid.b){

            /!*console.log(i)
              console.log(da)
             console.log(db)*!/
             res.dx = res.x;
             res.dy = res.y;
             res.x *= 0.0025*i;
             res.y *= 0.0025*i;

             return res;
         }
     }*/

return [directions,newDict];
}

export{Animator,makeParticles,getgridH,getgridW,makeParticle,getDirection,getValue,getNum,getgrid}
