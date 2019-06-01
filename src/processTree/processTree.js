function getPath(){

}

function getSplinePoints(points, drawedSet,g) {
    var newPathNodesList = [];
    drawedSet.forEach(function (e) {
        var firstPoint = []
        if ($.inArray(points[0], e) != 0 && $.inArray(points[0], e) != -1 && e[$.inArray(points[0], e) + 1] == points[1]) {
            //alert("found tree")
            var index = Math.floor($.inArray(points[0], e) / 4)-1
            var pathNodesList = [];
            for (var i = 0; i < e.length; i = i + 4) {
                //var point = self.map.latLngToLayerPoint(new L.LatLng(points[i+1], points[i]));
                var point = {}
                point.x = e[i]
                point.y = e[i + 1]
                point.num = e[i + 2]
                point.speed = e[i + 3]
                pathNodesList.push(point)
            }
            var path = getPathSegment(g,pathNodesList);
            var pathSegment = getSegmentList(path,pathNodesList);
            var forePath = pathSegment[index];
            var paths = path.split(",");
            var forePoint;

           // console.log(forePath)
            var tmpPath = g.append('path')
                .attr('d', forePath.d)
                .style('stroke', 'none')
                .style('fill', 'none')
                .each(function () {
                    var thisEdge = d3.select(this);
                    var totalLength = thisEdge.node().getTotalLength();
                    forePoint = thisEdge.node().getPointAtLength((totalLength * 0.95));
                    forePoint.num = 0;
                    forePoint.speed = 0;
                    newPathNodesList.push(forePoint.x,forePoint.y,forePoint.num,forePoint.speed)
                    //var point = thisEdge.node().getPointAtLength((totalLength ));
                   // forePath += 'M' + asspoint.x + ' ' + asspoint.y + 'M' + point.x + ' ' + point.y
                })
                .remove();

            newPathNodesList = newPathNodesList.concat(points)
          //  console.log(newPathNodesList)

           /* for (var j = 1; j < paths.length - 5; j = j + 5) {
                if (paths[j].indexOf("C") != -1) {
                    var f = paths[j].indexOf("C");
                    if (index == Math.floor(j / 5)+1) {
                        var p1 = {};
                        if (j - 1 === 0) {
                            p1.x = parseFloat(paths[j - 1].slice(1));
                        }
                        else {
                            p1.x = parseFloat(paths[j - 1]);
                        }
                        p1.y = paths[j].slice(0, f)
                        var c1 = {}
                        c1.x = parseFloat(paths[j].slice(f + 1));
                        c1.y = paths[j + 1];
                        var c2 = {}
                        c2.x = parseFloat(paths[j + 2])
                        c2.y = paths[j + 3]
                        var p2 = {}
                        p2.x = parseFloat(paths[j + 4])
                        p2.y = paths[j + 5].slice(0, paths[j + 5].indexOf("C"))
                        var t = 0.1;
                        firstPoint.push(p1.x * (Math.pow((1 - t), 3)) + 3 * c1.x * t * (Math.pow((1 - t), 2) ) + 3 * c2.x * (t * t) * (1 - t) + p2.x * (t * t * t));
                        firstPoint.push(p1.y * (Math.pow((1 - t), 3)) + 3 * c1.y * t * (Math.pow((1 - t), 2) ) + 3 * c2.y * (t * t) * (1 - t) + p2.y * (t * t * t));
                        firstPoint.push(1)
                        points = points.slice(0, 3).concat(firstPoint).concat(points.slice(3))
                        //return points.slice(0,2).concat(firstPoint).concat(points.slice(2))

                    }
                }
            }
*/
        }
    })
    return newPathNodesList;
}

function getPathSegment(g,pathNodesList) {
   // console.log(pathNodesList)
    var res;
    g.append("path")
        .attr('class', 'monotoneX')
        .datum(pathNodesList)
        .attr('d', d3.line()
            .curve(d3.curveMonotoneX)
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
        )
        .each(function () {
            res =  d3.select(this).attr('d');
        })
        .remove();
   // console.log(res)
    return res;
}
function getSegmentList(pathString,pathNodeList,mainPath) {
    var fisrtLevel;
    if(mainPath){
        fisrtLevel = generatePathLevel(paths,pathNodeList,mainPath);
       // console.log(fisrtLevel)
    }
    //console.log(mainPath)

    //console.log(pathString)
    var paths = pathString.split(",");
    var res = []

    if(paths.length === 7 || paths.length === 3){
        var path = {}
        path.d = pathString;
        path.num = pathNodeList[1].num
        if(mainPath){
            path.level = fisrtLevel;
        }
        path.isDrawed = false;
        res.push(path);
        return res;
    }
    for (var j = 1; j < paths.length - 5; j = j + 5) {
        var path = {};
        if(j == 1 ){
            path.d = paths[j-1] +","+ paths[j]+","+paths[j+1]+","+paths[j+2]+","+paths[j+3]+","+paths[j+4]+","+paths[j+5].slice(0,paths[j+5].indexOf("C"))
        }
        else if( j!= paths.length-6){
            path.d = "M" + paths[j-1] +","+ paths[j]+","+paths[j+1] +","+ paths[j+2]+","+paths[j+3]+","+paths[j+4]+","+paths[j+5].slice(0,paths[j+5].indexOf("C"))
        }
        else{
            path.d = "M" + paths[j-1] + ","+paths[j] +","+paths[j+1] +","+ paths[j+2]+","+paths[j+3]+","+paths[j+4]+","+paths[j+5]
        }
        path.num = pathNodeList[Math.floor(j/5)+1].num
        path.isDrawed = false;
       if(mainPath){
           path.level = fisrtLevel + Math.floor(j/5)
       }

        res.push(path)
    }
    //console.log(res)
  return res;
}
function isInArray(node,arr) {
    for(var i = 0; i < arr.length; i++){
        if(node.lat === arr[i].lat && node.lng === arr[i].lng){
            return i;
        }
    }
    return -1;
}
function generatePathLevel(paths,pathNodeList,mainPath){
   /* console.log("find level")
    console.log(mainPath)
    console.log(pathNodeList[1])*/
    var index = -1;
    for(var i = 0 ; i<mainPath.length;i++){
        index = isInArray(pathNodeList[1],mainPath[i]);
        if(index!=-1){
            return index-1
        }
    }
}
function getCtrlPoint(g,pathNodesList,map) {
    console.log("getCtrlPoint")
    console.log(map.layerPointToLatLng)
    console.log(pathNodesList)
    var res;
    g.append("path")
        .attr('class', 'monotoneX')
        .datum(pathNodesList)
        .attr('d', d3.line()
            .curve(d3.curveMonotoneX)
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
        )
        .each(function () {
            var thisEdge = d3.select(this);
            var totalLength = thisEdge.node().getTotalLength();
            if(!d.speed){
                d.speed = 10;
            }

            forePoint = thisEdge.node().getPointAtLength((totalLength * 0.95));
            forePoint.num = 0;
            newPathNodesList.push(forePoint.x,forePoint.y,forePoint.num)
            res = d3.select(this).attr('d');
        })
        .remove();
    console.log(res)
    if (pathNodesList.length === 2 || res.split(",").length ===3) {
        pathNodesList[0].label = "line";
    }
    else if (pathNodesList.length > 2) {
        var paths = res.split(",");
        for (var i = 0; i < pathNodesList.length - 1; i++) {
            var node = pathNodesList[i];
            node.label = "curve";
            node.cp1x = paths[i * 5 + 1].slice(paths[i * 5 + 1].indexOf("C")+1);
            node.cp1y = paths[i * 5 + 2];
            var point = {};
            point.x = parseFloat(node.cp1x);
            point.y = parseFloat(node.cp1y);
            console.log(point)
            var latlng = map.layerPointToLatLng(point);
            console.log(latlng)
            node.cp1Lat = latlng.lat;
            node.cp1Lng = latlng.lng;
            node.cp2x = paths[i * 5 + 3];
            node.cp2y = paths[i * 5 + 4];
            var point1 = {};
            point1.x = parseFloat(node.cp2x);
            point1.y = parseFloat(node.cp2y);
            var latlng2 = map.layerPointToLatLng(point1);
            node.cp2Lat = latlng2.lat;
            node.cp2Lng = latlng2.lng;
        }
    }
   return pathNodesList;
}

function getAllNodes(g,pathString,pathNodeList,map,loopTime){
    var paths = pathString.split(",");
    var res = []

    if(paths.length === 7 ){
        alert("code error")
    }
    for (var j = 1; j < paths.length - 5; j = j + 5) {
        var path = {};
        if(j == 1 ){
            path.d = paths[j-1] +","+ paths[j]+","+paths[j+1]+","+paths[j+2]+","+paths[j+3]+","+paths[j+4]+","+paths[j+5].slice(0,paths[j+5].indexOf("C"))
        }
        else if( j!= paths.length-6){
            path.d = "M" + paths[j-1] +","+ paths[j]+","+paths[j+1] +","+ paths[j+2]+","+paths[j+3]+","+paths[j+4]+","+paths[j+5].slice(0,paths[j+5].indexOf("C"))
        }
        else{
            path.d = "M" + paths[j-1] + ","+paths[j] +","+paths[j+1] +","+ paths[j+2]+","+paths[j+3]+","+paths[j+4]+","+paths[j+5]
        }
        g.append('path')
            .attr('d', path.d)
            .style('stroke', 'none')
            .style('fill', 'none')
            .each(function () {
                var point = {};
                var thisEdge = d3.select(this);
                var totalLength = thisEdge.node().getTotalLength();
               // console.log(pathNodeList)
                point.speed = pathNodeList[parseInt(j/5)+1].speed;
                /*if(!pathNodeList[parseInt(j/5)+1].hasOwnProperty("speed")){
                    point.speed = 10;
                }
               else{
                    point.speed = pathNodeList[parseInt(j/5)+1].speed;
                }*/
                var step = parseInt(totalLength/40 / (point.speed*(loopTime/1000)))+1;
                //console.log(step);
                var i ;
                if(j === 1){
                    i = 0;
                }
                else{
                    i =1;
                }
                for(;i<=step;i++){
                    var p = thisEdge.node().getPointAtLength((totalLength * i/step));
                    var latlng = map.layerPointToLatLng(p);
                    p.lat = latlng.lat;
                    p.lng = latlng.lng;
                    p.num =  pathNodeList[parseInt(j/5)+1].num;
                    p.speed =  point.speed;
                    res.push(p);
                }
            })
    }
    return res;
}
function getTmpPoints(g,pathNodesList,map,loopTime) {
    /*console.log("getTmpPoints")
    console.log(map.layerPointToLatLng)
    console.log(pathNodesList)*/
    var res = [];
    g.append("path")
        .attr('class', 'monotoneX')
        .datum(pathNodesList)
        .attr('d', d3.line()
            .curve(d3.curveMonotoneX)
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
        )
        .each(function (d) {
            if(pathNodesList.length === 2){
                var thisEdge = d3.select(this);
                var totalLength = thisEdge.node().getTotalLength();
                var speed = pathNodesList[1].speed;
                /*if(!pathNodesList[1].hasOwnProperty("speed")){
                    speed = 10;
                }
                else {
                    speed = pathNodesList[1].speed
                }*/
                var step = parseInt(totalLength/40/(speed*(loopTime/1000)))+1;
                //console.log(step);
                /*if(step == 0){
                    step = 1;
                }*/
                for(var i = 0;i<=step;i++){
                    var p = thisEdge.node().getPointAtLength((totalLength * i/step));
                    var latlng = map.layerPointToLatLng(p);
                    p.lat = latlng.lat;
                    p.lng = latlng.lng;
                    p.num = pathNodesList[1].num;
                    p.speed = speed;
                    res.push(p);
                }
            }
            else{
                var path = d3.select(this).attr('d')
                res = getAllNodes(g,path,pathNodesList,map,loopTime)
            }
            //console.log(res)
            /*forePoint = thisEdge.node().getPointAtLength((totalLength * 0.95));
            forePoint.num = 0;
            newPathNodesList.push(forePoint.x,forePoint.y,forePoint.num)
            res = d3.select(this).attr('d');*/
        })
        .remove();
    return res;
}
function getMaxSpeed(allLatLngNodes) {
    var res = 0;
    allLatLngNodes.forEach(function (latLngNodes) {
        latLngNodes.forEach(function (d) {
            d.forEach(function (pp) {
               /* var p = self.map.latLngToLayerPoint(new L.LatLng(pp.lat, pp.lng));
                pp.x = p.x;
                pp.y = p.y;*/
               if(pp.num > res){
                   res = pp.num ;
               }
            })
        })
    })
    return res;
}
function cutPath(allLatLngNodes,maxSpeed,loopTime){

}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function getDistance(lon1,lat1,lon2,lat2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}
function getInfo(pathNodesList){
    var totalFlow = 0;
    var totalSpeed = 0;
    var len = pathNodesList.length;
    for(var i = 0;i<len-1;i++){
        totalFlow += pathNodesList[i+1].num;
        totalSpeed += pathNodesList[i+1].speed;
    }
    var trajLen = getDistance(pathNodesList[0].lng,pathNodesList[0].lat,pathNodesList[len-1].lng,pathNodesList[len-1].lat);
    return [trajLen,totalFlow,totalSpeed/(len-1)]
}
export{getPath,getSplinePoints,getPathSegment,getSegmentList,getCtrlPoint,getInfo,getMaxSpeed,getTmpPoints,cutPath}