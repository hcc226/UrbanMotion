function parseGid(id, LngSPLIT=0.0064, LatSPLIT=0.005, locs={
    'north': 41.0500,
    'south': 39.4570,
    'west': 115.4220,
    'east': 117.5000})
{

    let LNGNUM = parseInt((locs['east'] - locs['west']) / LngSPLIT + 1)

    let latind = parseInt(id / LNGNUM)
    let lngind = id - latind * LNGNUM

    let lat = (locs['south'] + latind * LatSPLIT)
    let lng = (locs['west'] + lngind * LngSPLIT)
    let lngcen = (lng + LngSPLIT/2.0)
    let latcen = (lat + LatSPLIT/2.0)

    return {
        "cp":[lngcen, latcen]
    }
}
var cityLatLngDict = {
    'BJ':{
        'north': 41.0500,
    'south': 39.4570,
    'west': 115.4220,
    'east': 117.5000,
},
'TJ': {
    'north': 40.2500,
        'south': 38.5667,
        'west': 116.7167,
        'east': 118.3233,
},
'TS':{
    'north': 40.3333,
        'south': 35.9167,
        'west': 117.50,
        'east': 119.3167,
}
}


var x_pi = 3.14159265358979324 * 3000.0 / 180.0
var pi = 3.1415926535897932384626
var a = 6378245.0
var ee = 0.00669342162296594323


function _transformlat(lng, lat) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
    ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(lat / 12.0 * pi) + 320 * Math.sin(lat * pi / 30.0)) * 2.0 / 3.0
    return ret
}



function _transformlng(lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
    ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(lng * pi) + 40.0 * Math.sin(lng / 3.0 * pi)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(lng / 12.0 * pi) + 300.0 * Math.sin(lng / 30.0 * pi)) * 2.0 / 3.0
    return ret
}



function out_of_china(lng, lat) {
    return  !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
}


function gcj02_to_wgs84(lng, lat){
    if (out_of_china(lng, lat)){
        return lng, lat
    }
    let dlat = _transformlat(lng - 105.0, lat - 35.0)
    let dlng = _transformlng(lng - 105.0, lat - 35.0)
    let radlat = lat / 180.0 * pi
    let magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    let  sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * pi)
    let mglat = lat + dlat
    let mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]
}

function wgs84_to_gcj02(lng, lat) {
    /**
     * WGS84转GCJ02(火星坐标系)
     :param lng:WGS84坐标系的经度
     :param lat:WGS84坐标系的纬度
     :return:
     */
    if (out_of_china(lng, lat)){
        return [lng, lat]
    }
    let dlat = _transformlat(lng - 105.0, lat - 35.0)
    let dlng = _transformlng(lng - 105.0, lat - 35.0)
    let radlat = lat / 180.0 * pi
    let magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    let sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * pi)
    let mglat = lat + dlat
    let mglng = lng + dlng
    return [mglng, mglat]

}

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}
function addWaitingLogo(classname){
    $("<div id='shade' style='opacity:0.85;background:white'></div>" +
        "<img src='/img/loading2.gif'/>").css({
        position:'absolute',
        top:0,
        left:0,
        zIndex:1,
        height:'100%',
        width:'100%'
    }).appendTo('.'+classname);
}

function removeWaitingLogo(classname) {
    $('#shade').remove()
    $("."+classname+" > img").remove()
}




export {removeWaitingLogo,addWaitingLogo,cityLatLngDict, parseGid, gcj02_to_wgs84, wgs84_to_gcj02, timestampToTime}