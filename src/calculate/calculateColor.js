function getColor(h,s,l) {
    var colors=[0,0];
    //var colors=204;
    var sRange=[1,0];
    var lRange=[0.9,0.4];
    var sScale=d3.scaleLinear()
        .domain([0,1])
        .range(sRange);
    var lScale=d3.scaleLinear()
        .domain([0,1])
        .range(lRange);
    var value='hsl('+colors[h]+','+(sScale(s)*100)+'%,'+(lScale(l)*100)+'%)';
    return value
}

function getClusterColor(h,s,l) {
    var colors=[0,0];
    //var colors=204;
    var sRange=[1,0];
    var lRange=[0.7,1];
    var sScale=d3.scaleLinear()
        .domain([0,1])
        .range(sRange);
    var lScale=d3.scaleLinear()
        .domain([0,1])
        .range(lRange);
    var value='hsl('+colors[h]+','+(sScale(s)*100)+'%,'+(lScale(l)*100)+'%)';
    return value
}

function getSegmentColor(num){
    if(num>30){
        return  "#ffffff"
    }
    else if(num>20){
        return "#d0d0d0"
    }
    else if(num>10){
        return "#c0c0c0"
    }
    else if(num>5){
        return "#a0a0a0"
    }
    else{
        return "#666666"
    }

}
export {getColor,getSegmentColor,getClusterColor}