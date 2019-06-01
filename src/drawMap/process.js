import{wgs84_to_gcj02}from "../util/base"
const sdcurve = require('./SDCurve');
const simplify = require('./simplify');
function getGridID(lat,lng,LngSPLIT=0.0064, LatSPLIT=0.005, locs={
    north: 41.0500,
    south: 39.4570,
    west: 115.4220,
    east: 117.5000
}) {
    var LNGNUM = parseInt( (locs.east - locs.west) / LngSPLIT + 1 );
    var lngind = parseInt( ((lng - locs.west) / LngSPLIT ));
    var latind = parseInt( ((lat - locs.south) / LatSPLIT ));

    return {
        gid: lngind + latind * LNGNUM,
        lngind: lngind,
        latind: latind
    }
}

function  parseFormatGID(id, direction='n', LngSPLIT=0.0064, LatSPLIT=0.005, locs={
    north: 41.0500,
    south: 39.4570,
    west: 115.4220,
    east: 117.5000,
}){

var id = parseInt(id)
var LNGNUM = parseInt((locs.east - locs.west) / LngSPLIT + 1)

var latind = parseInt(id / LNGNUM);
var lngind = id - latind * LNGNUM;

var lat = (locs.south + latind * LatSPLIT);
var lng = (locs.west + lngind * LngSPLIT);
var lngcen = (lng + LngSPLIT/2.0);
var latcen = (lat + LatSPLIT/2.0);
var dlineDict = {
    n: lat + LatSPLIT,
    s: lat,
    e: lng + LngSPLIT,
    w: lng
}

return {
    'lat': latcen,
    'lng': lngcen,
    'nid': id,
    'pid': -1,
    'y': latind,
    'x': lngind
}
}

function getnearby(currentId) {
    return [currentId-326, currentId-325, currentId-324, currentId-1,currentId+1,currentId+324, currentId+325, currentId+326]
}
function getNearByGridsFun(res, currentId, gridIdsArray){
    let nearbyIds = getnearby(currentId)
    nearbyIds.forEach(function (t) {
        if(isInArray(gridIdsArray, t) && !isInArray(res,t)){
            res.push(t)
            getNearByGridsFun(res,t,gridIdsArray)
        }
    })
}
function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}
function getNearByGrids(currentId, gridIdsArray) {
    let res = [currentId]
    let nearbyIds = getnearby(currentId)
    //console.log(nearbyIds)

    for (var i=0;i<nearbyIds.length;i++){
        var id = nearbyIds[i]
        // console.log(isInArray(gridIdsArray, id))
        // console.log(!isInArray(res,id))
        if(isInArray(gridIdsArray, id) && !isInArray(res,id)){
            // console.log('push')
            res.push(id)
            getNearByGridsFun(res,id,gridIdsArray)
        }
    }
    //console.log(res)
    return res
}


function getString(objarr){
    var typeNO = objarr.length;
    var tree = "[";
    for (var i = 0 ;i < typeNO ; i++){
        tree += "[";
        tree +="'"+ objarr[i][0].toString()+"',";
        tree +="'"+ objarr[i][1].toString()+"'";
        tree += "]";
        if(i<typeNO-1){
            tree+=",";
        }
    }
    tree+="]";
    return tree;
}
function getstring(objarr){
    var tree = "['";
    console.log(objarr)
    tree += objarr[0].toString() + "','";
    tree += objarr[1].toString() + "']";
    return tree;
}

function getLinkStr(p1,p2) {
    return p1[0].toFixed(4).toString()+'_'+p1[1].toFixed(4).toString()+'_'+p2[0].toFixed(4).toString()+'_'+p2[1].toFixed(4).toString()
}
function getbounds(data, res) {
    let links = []
    let linkCounted = []
    console.log(data)
    //return;
    for (var i=0;i<data.length;i++){
        let rectangleData = data[i]
        for (var j=0;j<4;j++){
            let link_str = getLinkStr(rectangleData[j],rectangleData[j+1])
            let neglink_str = getLinkStr(rectangleData[j+1],rectangleData[j])

            if(!isInArray(linkCounted,neglink_str)){
                links.push([[rectangleData[j][0].toFixed(4),rectangleData[j][1].toFixed(4)], [rectangleData[j+1][0].toFixed(4),rectangleData[j+1][1].toFixed(4)]])
                linkCounted.push(link_str)
            }
            else{
                links = links.filter(function (t) {
                    return !(t[0][0]==rectangleData[j+1][0].toFixed(4) && t[0][1]==rectangleData[j+1][1].toFixed(4) && t[1][0]==rectangleData[j][0].toFixed(4) && t[1][1]==rectangleData[j][1].toFixed(4))
                })
            }
        }
    }
    console.log(links)
    let link = links[0]
    //记录已经找到的点
    res.push(link[0])
    res.push(link[1])
    //res = [link[0],link[1]]
    //记录被访问过的link
    let visit = new Array(links.length)
    visit[0] = 1
    let endPoint = link[1]
    //寻找剩下的link里以endpoint开头的link
    for (var i=1;i<links.length;i++){
        let tmplink = links[i]
        if(tmplink[0][0] == endPoint[0] && tmplink[0][1]== endPoint[1] && !visit[i]){
            visit[i] = 1
            res.push(tmplink[1])
            findBoundFun(res, visit,links)
            break
        }
    }

}
function findBoundFun(res,visit,links) {
    console.log(res)
    let resLen = res.length
    //判断是否遍历完
    if (visit.filter(function (t) { return t }).length == links.length) {
        //判断是否闭合
        let resLen = res.length
        if (res[0][0] == res[resLen - 1][0] && res[0][1] == res[resLen - 1][1]) {
            //只有当所有边都遍历完毕且闭合是正确的，否则退回处理
            return;
        }
    }


    let endPoint = res[resLen-1]
    //寻找剩下的link里以res最后一个点开头的link
    for (var i=0;i<links.length;i++){
        let tmplink = links[i]
        if(tmplink[0][0] == endPoint[0] && tmplink[0][1]== endPoint[1] && !visit[i]){
            visit[i] = 1
            res.push(tmplink[1])
            //判断所有边是否遍历完毕
            // if (res[0][0] == res[resLen-1][0] && res[0][1] == res[resLen-1][1]){
            //     //判断是否闭合
            //     if(visit.filter(function (t) { return t }).length == links.length){
            //         //只有当所有边都遍历完毕且闭合是正确的，否则退回处理
            //         return true;
            //     }
            //     else{
            //         //return false
            //         res.pop()
            //         visit[i] = undefined
            //         continue
            //     }
            // }
            //如果既没有遍历完毕也没有闭合那么继续寻找
            findBoundFun(res, visit,links)
            break
        }
        //return false
    }

}
function drawmap(c, data ,result, svg_num){
    let bound = {},
        link = {}
    console.log("data len"  + data.length)
    for(var a = 0; a < data.length; a++){
        let varr = data[a];
        for(var i = 0; i < 4; i++){
            let p1 = [varr[i][0], varr[i][1]],
                p2 = [varr[i+1][0], varr[i+1][1]];
            if(varr[i][0] == varr[i+1][0]){
                if(varr[i][1] < varr[i+1][1]){
                    var li = getString([p1,p2]);
                }
                else{
                    var li = getString([p2,p1]);
                }
            }
            else{
                if(varr[i][0] < varr[i+1][0]){
                    var li = getString([p1,p2]);
                }
                else{
                    var li = getString([p2,p1]);
                }
            }
            if(bound.hasOwnProperty(li)){
                bound[li].push(a);
            }
            else{
                bound[li] = [];
                bound[li].push(a);
            }
        }
    }
    for(var i in bound){
        if(bound[i].length == 2){
            if(link.hasOwnProperty(bound[i][0])){
                link[bound[i][0]].push(bound[i][1]);
            }
            else{
                link[bound[i][0]] = [];
                link[bound[i][0]].push(bound[i][1]);
            }
            if(link.hasOwnProperty(bound[i][1])){
                link[bound[i][1]].push(bound[i][0]);
            }
            else{
                link[bound[i][1]] = [];
                link[bound[i][1]].push(bound[i][0]);
            }
        }
    }
    console.log(link)
    if(link.length != 0){
        let visit = [];
        for(var i = 0; i < data.length; i++){
            visit.push(0);
        }
        for(var each in link){
            if(visit[each] == 0){
                let tree = [];
                tree.push(data[each])
                console.log(tree)
                DFS_rectangle(link, each, tree, visit, data)
                console.log("after")
                console.log(tree)
                if (tree.length > 2){
                    drawflower(c, tree, result, svg_num);
                }
            }
        }
    }
}
function DFS_rectangle(link, num, tree, visit, data){
    let nums = [num];
    visit[nums[0]] = 1;
    while(nums.length > 0){
        num = nums[0];
        for(var i in link[num]){
            if(visit[link[num][i]] == 0){
                tree.push(data[link[num][i]]);
                visit[link[num][i]] = 1;
                nums.push(link[num][i]);
            }
        }
        nums.splice(0,1);
    }
}
function drawflower(c, data, result, svg_num){
    let boundary = {};
    boundary['type'] = 'Feature';
    boundary['properties'] = {};
    boundary['geometry'] = {};
    boundary['geometry']['type'] = 'Polygon';
    boundary['geometry']['coordinates'] = [];
    let bound = {};
    boundary['properties']['color'] = svg_num;

    for(var a = 0; a < data.length; a++){
        let varr = data[a];
        for(var i = 0; i < 4; i++){
            let p1 = [varr[i][0], varr[i][1]],
                p2 = [varr[i+1][0], varr[i+1][1]];
            if(varr[i][0] == varr[i+1][0]){
                if(varr[i][1] < varr[i+1][1]){
                    var li = getString([p1,p2]);
                }
                else{
                    var li = getString([p2,p1]);
                }
            }
            else{
                if(varr[i][0] < varr[i+1][0]){
                    var li = getString([p1,p2]);
                }
                else{
                    var li = getString([p2,p1]);
                }
            }
            if(bound.hasOwnProperty(li)){
                bound[li] += 1;
            }
            else{
                bound[li] = 1;
            }
        }
    }

    let line = {};
    for(var each in bound){
        if(bound[each] == 1){
            let li = eval(each),
                li_x = getstring(li[0]),
                li_y = getstring(li[1]);
            if(line.hasOwnProperty(li_x)){
                line[li_x].push(li_y);
            }
            else{
                line[li_x] = [];
                line[li_x].push(li_y);
            }
            if(line.hasOwnProperty(li_y)){
                line[li_y].push(li_x);
            }
            else{
                line[li_y] = [];
                line[li_y].push(li_x);
            }
        }
    }

    console.log("line: " + JSON.stringify(line))

    for(var each in line){
        let i = 0;
        if(line.length != 0){
            i += 1;
            let tree = [];
            DFS(line, each, tree, boundary, c, result);
        }
    }
}

function DFS(line, num , tree, boundary, c, result){
    let visit = {},
        length =1;
    tree.push(num)
    visit[num] = length;
    while(line[num].length > 0){
        for (var each in line[num]){
            each = line[num][each];
            if(tree.indexOf(each) <= -1){
                length += 1;
                tree.push(each);
                visit[each] = length;
            }
            else{
                let begin = visit[each],
                    end = length,
                    tree1 = [];
                for(var n = begin-1; n < length; n ++){
                    tree1.push(eval(tree[n]));
                }
                tree1.push(eval(each));
                tree.splice(begin, length-begin);
                //console.log("tree1.len:   " + tree1.length)
                if(tree1.length > c){
                    let end_boundary = boundary,
                        pointset = [];
                    for(var i in tree1){
                        i = tree1[i];
                        pointset.push({x:parseFloat(i[0]), y:parseFloat(i[1])})
                    }

                    var simplified_points = simplify(pointset, 0.001);
                    if (simplified_points.length>4){
                        pointset = simplified_points;
                    }
                    simplified_points = null;

                    var curve = new sdcurve.SDCurve({
                        points: pointset,
                        open: false,
                        degree: 4,
                        resolution: 6
                    });
                    var curve_line = [];
                    var step_size = 1.0/(pointset.length*10);
                    for(var u=0.0; u<1.0; u+= step_size){
                        var p = curve.pointAt(u).pointOnCurve;
                        //console.log("p:"+JSON.stringify(p));
                        curve_line.push([p.x, p.y]);
                    }
                    var last_point = pointset[pointset.length-1];
                    curve_line.push([last_point.x, last_point.y]);
                    //console.log("curve:"+JSON.stringify(curve_line));
                    end_boundary['geometry']['coordinates'].push(curve_line);
                    result.push(end_boundary);
                    console.log(result)
                }
                console.log(tree1)
                for(var i= 0;i<tree1.length;i++){
                    console.log(i)
                    visit[getstring(tree1[i])] = 0;
                }
                visit[each] = begin;
                length = begin;
            }
            removeByValue(line[each], num);
            removeByValue(line[num], each);
            num = each;
            break;
        }
    }
}


function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
function getGridsBoundary(gridIds) {
    let latcenterincrement = 0.0025
    let lngcenterincrement = 0.0032
    let lngSPLIT = 0.0064
    let latSPLIT = 0.005
    let hdata = gridIds.map(id =>{
        let latlngObj = parseFormatGID(id);
        let lat = (latlngObj["lat"] - latcenterincrement),
        lng = (latlngObj["lng"] - lngcenterincrement),
        lnginc = (lng + lngSPLIT),
        latinc = (lat + latSPLIT),
        lngcen = latlngObj["lng"],
        latcen = latlngObj["lat"],
        coordarr = [
            [lng, lat],
            [lnginc, lat],
            [lnginc, latinc],
            [lng, latinc],
            [lng, lat]
        ]
        return coordarr
    })
    let result = []
    getbounds(hdata,result)
    for (var i=0; i < result.length; i++){
        let p = wgs84_to_gcj02(parseFloat(result[i][0]),parseFloat(result[i][1]))
        result[i][0] = p[0]
        result[i][1] = p[1]
    }

    //drawmap(4,hdata,result,1)
    return [{
        "type": "Feature",
        "properties": {"color": 1},
        "geometry":
            {
                "type": "Polygon",
                "coordinates": [result]
            }
    }]
    // {
    //     "type": "FeatureCollection",
    //     "features": result
    // }
}
//console.log(getNearByGrids(38487,[34939, 33937, 44066, 33938, 29735, 21302, 34614, 34613, 27493, 21619, 17661, 40778, 47249, 27818, 40156, 38159, 35263, 46665, 20331, 34263, 40442, 42766, 38487, 22592, 35913, 35912, 30342, 30385, 35264, 22924, 19618, 34265, 21590, 34293, 22277, 38481, 34262, 17041, 33641, 33614, 34616, 33612, 34940, 12125, 31067, 35265, 30061, 29736, 36557, 19947, 38207, 20649, 29414, 29085, 28806, 27170, 40796, 42443, 22591, 21627, 44984, 45311, 21300, 20976, 49523, 49850, 50176, 28804, 22264, 29076, 29084, 20970, 18636, 29720, 19992, 20323, 35590, 30059, 23535, 30089, 37831, 37832, 37835, 38156, 24509, 26118, 30408, 38483, 38486, 26474, 38811, 40112, 40114, 60022, 20648, 40773, 33613, 27816, 41774, 42072]))
//console.log(getGridsBoundary([34940, 34614, 34613, 34939, 35263, 35264, 35265, 34616] ))
function smoothRegionBoundary(dataGeoJson, layerid) {
    let data = dataGeoJson[0]["geometry"]["coordinates"][0]

    let pointset = []
    for(let i=0;i<data.length-1;i++){
        pointset.push({x:data[i][0],y:data[i][1]})
    }

    var simplified_points = simplify(pointset, 0.001);
    if (simplified_points.length>4){
        pointset = simplified_points;
    }
    simplified_points = null;

    var curve = new sdcurve.SDCurve({
        points: pointset,
        open: false,
        degree: 4,
        resolution: 6
    });
    var curve_line = [];
    var step_size = 1.0/(pointset.length*10);
    for(var u=0.0; u<1.0; u+= step_size){
        var p = curve.pointAt(u).pointOnCurve;
        //console.log("p:"+JSON.stringify(p));
        curve_line.push([p.x, p.y]);
    }
    //var last_point = pointset[pointset.length-1];
    console.log(curve_line)
    var last_point = curve_line[0];
    //curve_line.push([last_point.x, last_point.y]);
    curve_line.push([last_point[0], last_point[1]]);
    dataGeoJson[0]["geometry"]["coordinates"][0] = curve_line
}
// drawHeatRegionBoundary(dataGeoJson,layerid){
//     //首先对data改成gettmppoints所需格式
//     let data = dataGeoJson[0]["geometry"]["coordinates"][0]
//     let d = []
//     for (let i=0;i<data.length;i++){
//         let point = {
//             "lat":parseFloat(data[i][1]),
//             "lng":parseFloat(data[i][0]),
//             "num":15,
//             "speed":15
//         }
//         if (i===0){
//             point.num = 0;
//             point.speed = 0;
//         }
//         let p = this.map.latLngToLayerPoint(new L.LatLng(point.lat,point.lng));
//         point.x = p.x;
//         point.y = p.y;
//         d.push(point)
//     }
//     let g = d3.select(this.map.getPanes().overlayPane).select("svg").select("g")
//         .style("fill", "none")
//         .style("stroke", "white")
//     let ss = getTmpPoints(g,d,this.map, 10)
//     console.log(ss)
//     let smoothPointsArray = []
//     for (let i =0;i<ss.length;i++){
//         let tmp = [ss[i].lng,ss[i].lat]
//         smoothPointsArray.push(tmp)
//     }
//     dataGeoJson[0]["geometry"]["coordinates"][0] = smoothPointsArray
// }
export {smoothRegionBoundary,getGridID,parseFormatGID,getNearByGrids,getGridsBoundary, isInArray}