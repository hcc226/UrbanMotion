import $ from "jquery"
import {getDisWidth} from "../calculate/calculateEdge"
import {getRadius} from "../calculate/calculateCircle"
import {maps} from "../init/mapVueInit"

let objClone = function (obj) {
    let res = {};

    return JSON.parse(JSON.stringify(obj));;
};

function getNodes(data,isZero) {
    var resdata = data;
    var res = [];
    var nodes;
    var edges;
    if(isZero === false){
        nodes = data.nodes;
        edges = data.edges;
    }
    else{
        nodes = data.nodes[0]
        edges = data.edges[0]
    }
    $.each(nodes, function (i, node) {
        var new_node = node;
        new_node.in = 0;
        new_node.out = 0;
        new_node.all = 0;
        new_node.self = 0;
        for (var j = 0; j < edges.length; j++) {
            var f = 0;
            if (edges[j].from_nid == new_node.id) {
                f++;
                new_node.out = new_node.out + edges[j].travel_device_num;
                new_node.all = new_node.all + edges[j].travel_device_num;
            }
            if (edges[j].to_nid == new_node.id) {
                new_node.in = new_node.in + edges[j].travel_device_num;
                new_node.all = new_node.all + edges[j].travel_device_num;
                f++;
            }
            if( f == 2){
                new_node.self = new_node.self + edges[j].travel_device_num;
            }
        }
        res.push(new_node);
    });
    resdata.nodes = res;
    return resdata;
}
function updateGraph(dt) {
    var old_graph = maps.mapObj[0].graph;
    var new_graph = {};
    new_graph.nodes = [];
    new_graph.edges = [];
    var dt_nodes = dt.nodes[0], dtNodeLen = dt.nodes[0].length;
    var dt_edges = dt.edges[0], dtEdgeLen = dt.edges[0].length;
    var nodes = old_graph.nodes, nodeLen = old_graph.nodes.length;
    var edges = old_graph.edges, edgeLen = old_graph.edges.length;
    var id_updated = [];
    var eid_updated = [];
    for (var i = 0; i < dtNodeLen; i++) {
        var node = dt_nodes[i];
        for (var j = 0; j < nodeLen; j++) {
            if (nodes[j].id == dt_nodes[i].id) {
                node.stay_device_num += nodes[j].stay_device_num;
                node.stay_record_num += nodes[j].stay_record_num;
                id_updated.push(nodes[j].id);
                break;
            }
        }
        new_graph.nodes.push(node);
    }
    console.log(id_updated);

    for (var i = 0; i < nodeLen; i++) {
        var flag = false;
        var node = nodes[i];
        for (var j = 0; j < id_updated.length; j++) {
            if (nodes[i].id == id_updated[j]) {
                flag = true;
            }
        }
        if (!flag) {
            console.log("add")
            new_graph.nodes.push(node);
        }
    }

    for (var i = 0; i < dtEdgeLen; i++) {
        var edge = dt_edges[i];
        for (var j = 0; j < edgeLen; j++) {
            //    console.log(edges[j]);
            if (edges[j].from_nid === dt_edges[i].from_nid && edges[j].to_nid === dt_edges[i].to_nid) {
                console.log("found!")
                edge.travel_device_num += edges[j].travel_device_num;
                edge.travel_record_num += edges[j].travel_record_num;
                eid_updated.push([edges[j].from_nid, edges[j].to_nid]);
            }
        }
        new_graph.edges.push(edge);
    }
    console.log(eid_updated);
    for (var i = 0; i < edgeLen; i++) {
        var flag = false;
        var edge = edges[i]
        for (var j = 0; j < eid_updated.length; j++) {
            if (edges[i].from_nid == eid_updated[j][0] && edges[i].to_nid == eid_updated[j][1]) {
                flag = true;
            }
        }
        if (!flag) {
            console.log("e_add");
            new_graph.edges.push(edge);
        }
    }
    console.log(new_graph);
    maps.mapObj[0].graph = new_graph;
    return new_graph;
}
// for　district data get start point and end point of each line
function getLinePos(data,isZero) {
    var res = [];
    console.log(data)
    console.log(data.edges[0]);
    console.log(data.nodes)
    var edges;
    if(isZero === false){
        edges = data.edges;
    }
    else{
        edges = data.edges[0];
    }
    var range = d3.extent(edges,function (d) {
        return d.travel_device_num;
    })
    var min = range[0];
    var max = range[1];
    console.log(range)

    $.each(edges, function (j, edge) {
        var nodes = data.nodes;
        var link = edge;
        //console.log(link.from_nid)
        var count = 0;
        link.width = getDisWidth(link.travel_device_num,min,max)
        //console.log(link.width);
        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (nodes[i].id === link.to_nid) {
                count++;
                //console.log("found!")
                link.to_x = nodes[i].x;
                link.to_y = nodes[i].y;
                break;
            }
        }

        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (link.from_nid === nodes[i].id) {
                count++;
                //console.log("found!")
                link.from_x = nodes[i].x;
                link.from_y = nodes[i].y;
                break;
                // res.push(link);
            }
        }
        if (count == 2) res.push(link);
    });
    console.log(res);
    return res;
}

var compareobject = function (x, y) {//比较函数
    if (x.travel_device_num > y.travel_device_num) {
        return -1;
    } else if (x.travel_device_num < y.travel_device_num) {
        return 1;
    } else {
        return 0;
    }
}
/*function getlines(data,count) {
    var res ={};
    res.in = [];
    res.out = [];
    var nodes = data.nodes[0];
    $.each(data.nodes[0],function (i,node) {
        console.log(node)
        var new_node = node;
        new_node.inedges = [];
        new_node.outedges = [];
        var edges = data.edges[0];
            for (var j = 0; j < edges.length; j++) {
                var f = 0;
                var new_edge = edges[j];
                if (edges[j].from_nid == node.id) {
                    f++;
                    new_edge.from_x = node.x;
                    new_edge.from_y = node.y;
                    for(var k = 0;k<nodes.length;k++){
                        if(nodes[k].id == new_edge.to_nid){
                            new_edge.to_x = nodes[k].x;
                            new_edge.to_y = nodes[k].y;
                            break;
                        }
                    }
                    if(new_edge.from_x && new_edge.to_x){
                        new_node.outedges.push(new_edge)
                    }

                }
                if (edges[j].to_nid == node.id) {
                   if(f === 0){
                       new_edge.to_x = node.x;
                       new_edge.to_y = node.y;
                       for(var k = 0;k < nodes.length;k++){
                           if(nodes[k].id == new_edge.from_nid){
                               new_edge.from_x = nodes[k].x;
                               new_edge.from_y = nodes[k].y;
                               break;
                           }
                       }
                       if(new_edge.from_x && new_edge.to_x){
                           new_node.inedges.push(new_edge)
                       }

                    }
                    f++;
                }
            }
        new_node.inedges.sort(compareobject)
        new_node.outedges.sort(compareobject)
        var k = 0;
        var cin= count*new_node.inedges.length ;
        while (cin >0){
            cin = cin -1;
            if(new_node.inedges.length>k){
                res.in.push(new_node.inedges[k]);
            }
            k++;
        }
        var cout= count*new_node.outedges.length ;
        k = 0;
        while (cout>0){
            cout = cout -1 ;

            if(new_node.outedges.length>k){
                res.out.push(new_node.outedges[k]);
            }

            k++;
        }
    })
return res;

}*/

function getlines(data,c) {
    /*var res = []
    var tmp = []
    console.log(data.edges[0])
    $.each(data.edges[0], function (j, edge) {
        var nodes = data.nodes[0];
        var link = edge;
        //console.log(link.from_nid)
        var count = 0;
            for (var i = 0; i < nodes.length; i++) {
                //console.log(nodes[i].nid)
                if (nodes[i].id === link.to_nid) {
                    count++;
                    //console.log("found!")
                    link.to_x = nodes[i].x;
                    link.to_y = nodes[i].y;
                    break;
                }
            }

        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (link.from_nid === nodes[i].id) {
                count++;
                //console.log("found!")
                link.from_x = nodes[i].x;
                link.from_y = nodes[i].y;
                break;
                // res.push(link);
            }
        }
        /!* for(var i = 0; i<nodes.length;i++){
             //console.log(nodes[i].nid)
             if(link.to_nid === 438 || link.to_nid === 603){
                 count ++;
                 //console.log("found!")
                 link.to_x = nodes[i].x;
                 link.to_y = nodes[i].y;
                 break;
             }
         }*!/
        if (count == 2 && link.from_nid != link.to_nid)  tmp.push(link);
    });

    tmp.sort(compareobject);
    console.log(tmp)
    var k = 0;
    var cc = c;
    while(cc > 0){
        res.push(tmp[k]);
        k++;
        cc = cc - 1 ;
    }*/
    var res ={};
    res.in = [];
    res.out = [];
    var nodes = data.nodes[0];
    $.each(data.nodes[0],function (i,node) {
       // console.log(node)
        var new_node = node;
        new_node.inedges = [];
        new_node.outedges = [];
        var edges = data.edges[0];
        for (var j = 0; j < edges.length; j++) {
            var f = 0;
            var new_edge = edges[j];
            if (edges[j].from_nid == node.id) {
                f++;
                new_edge.from_x = node.x;
                new_edge.from_y = node.y;
                for(var k = 0;k<nodes.length;k++){
                    if(nodes[k].id == new_edge.to_nid){
                        new_edge.to_x = nodes[k].x;
                        new_edge.to_y = nodes[k].y;
                        break;
                    }
                }
                if(new_edge.from_x && new_edge.to_x && new_edge.from_nid!= new_edge.to_nid){
                    new_node.outedges.push(new_edge)
                }

            }
            if (edges[j].to_nid == node.id) {
                if(f === 0){
                    new_edge.to_x = node.x;
                    new_edge.to_y = node.y;
                    for(var k = 0;k < nodes.length;k++){
                        if(nodes[k].id == new_edge.from_nid){
                            new_edge.from_x = nodes[k].x;
                            new_edge.from_y = nodes[k].y;
                            break;
                        }
                    }
                    if(new_edge.from_x && new_edge.to_x && new_edge.from_nid!= new_edge.to_nid){
                        new_node.inedges.push(new_edge)
                    }

                }
                f++;
            }
        }
        new_node.inedges.sort(compareobject)
        new_node.outedges.sort(compareobject)
        var k = 0;
       /* var cin= c*new_node.inedges.length/100 ;*/
       var cin = 1;
        /*console.log(new_node.inedges.length)
        console.log(cin)*/
        while (cin >=1){
            cin = cin -1;
            if(new_node.inedges.length>k){
                res.in.push(new_node.inedges[k]);
            }
            k++;
        }
        /*var cout= c*new_node.outedges.length/100 ;
*/
        var cout = 1;
        k = 0;
        while (cout>=1){
            cout = cout -1 ;

            if(new_node.outedges.length>k){
                res.out.push(new_node.outedges[k]);
            }

            k++;
        }
    })
    console.log(res);
    return res;

}


//for poi_to_div_data get in ,all,all ,self,edges of each node
function  processPoiToDivNodes(data,num,cluster) {
    var res = [];
    console.log("edges is ")
    console.log(data.edges[0])
    $.each(data.nodes[parseInt(num)], function (i, node) {
        var edges = data.edges[0];
        var new_node = node;
        new_node.in = 0;
        new_node.out = 0;
        new_node.all = 0;
        new_node.self = 0;
        new_node.edges = [];
            for(var k = 0;k<cluster.length;k++){
                if(cluster[k].id == node.id){
                    new_node.msType = cluster[k].msType;
                    new_node.dsType = cluster[k].dsType;
                    break;
                }
            }

            for (var j = 0; j < edges.length; j++) {
                var f = 0;
                if (edges[j].from_nid == new_node.id) {
                    f++;
                    new_node.out = new_node.out + edges[j].travel_device_num;
                    new_node.all = new_node.all + edges[j].travel_device_num;
                    new_node.edges.push(edges[j])
                }
                if (edges[j].to_nid == new_node.id) {
                    new_node.in = new_node.in + edges[j].travel_device_num;
                    if(f === 0){
                        new_node.all = new_node.all + edges[j].travel_device_num;
                        new_node.edges.push(edges[j])
                    }
                    f++;
                }
                if( f == 2){
                    new_node.self = new_node.self + edges[j].travel_device_num;

                }
            }
            res.push(new_node);
        });
    return res;

}

//for poitodivdata get start and end point of each line
function getPoiToDivLinePos(data) {
    var res = [];
    console.log(data)
    console.log(data.edges[0]);
    console.log(data.nodes);

    $.each(data.edges[0], function (j, edge) {
        var nodes = data.nodes[1];
        /*data.nodes[0].forEach(function (node) {
            nodes.push(node);
        })*/
        var link = edge;
        //console.log(link.from_nid)
        var count = 0;
        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (nodes[i].id === link.to_nid) {
                count++;
                //console.log("found!")
                link.to_x = nodes[i].x;
                link.to_y = nodes[i].y;
                break;
            }
        }
        nodes = data.nodes[0]
        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (link.from_nid === nodes[i].id) {
                count++;
                //console.log("found!")
                link.from_x = nodes[i].x;
                link.from_y = nodes[i].y;
                break;
                // res.push(link);
            }
        }
        if (count == 2) res.push(link);
    });
    console.log(res);
    return res;
}

//process poi_to_div_data
function processPoiToDiv(data,cluster){
    console.log(data);
    var resdata = data;
    var res0 = processPoiToDivNodes(data,0,cluster);
    var res1 = processPoiToDivNodes(data,1,cluster)
    var resLink = getPoiToDivLinePos(data);
    resdata.edges[0] = resLink;


    resdata.nodes[0] = res0;
    resdata.nodes[1] = res1;

    console.log(resdata)
    return resdata;
}

// process div_to_poi line
function processDivToPoi(data) {

    var resLink = getPoiToDivLinePos(data);
    return resLink;

}
var compare = function (x, y) {//比较函数
    if (x > y) {
        return -1;
    } else if (x < y) {
        return 1;
    } else {
        return 0;
    }
}

//sort arrays
function sortline(lines,nodes,type) {
    var res = [];
    var tmp = [];
    if(type === "com"){
        nodes.forEach(function (node) {
            tmp.push(parseInt(node.stay_device_num))
            tmp.push(parseInt(node.all))
        })
        var min = d3.min(tmp);
        var max = d3.max(tmp);
        nodes.forEach(function (node) {
            res.push(parseFloat(getRadius(node.stay_device_num,min,max)));
            res.push(parseFloat(getRadius(node.all,min,max)));
        })
    }
    else{
        lines.forEach(function (line) {
            res.push(parseFloat(line.width))
        })
    }
    /*else{
        nodes.forEach(function (node) {
            //res.push(parseInt(node.stay_device_num))
            //res.push(parseInt(node.self))
        })
    }*/
    console.log(res);
    res.sort(compare);
    console.log(res);
    return res;
}

export {objClone,getNodes,getlines,sortline,getLinePos,updateGraph,processPoiToDiv,processDivToPoi}