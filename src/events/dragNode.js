function get_leaflet_offset(){
    var trfm = $(".leaflet-map-pane").css('transform');
    trfm = trfm.split(", ");
    return [parseInt(trfm[4]), parseInt(trfm[5])];
}

function dragstarted(d) {
    this.map.dragging.disable();
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging",true)

}

function dragmove(d) {
    console.log("drag!")
    alert("drag");
    var offset = get_leaflet_offset();
    var size = d3.select(this).attr("r")/2;
    var pt = [d3.event.sourceEvent.clientX - size - offset[0], d3.event.sourceEvent.clientY - size - offset[1]];
    var hackpath = "M" + pt[0] + "," + pt[1] + d_string;
    d3.select(this).attr("d", hackpath);
}

function dragended() {
    var offset = get_leaflet_offset();
    var size = d3.select(this).attr("r")/2;
    var pt = layer_to_LL(d3.event.sourceEvent.clientX - size - offset[0], d3.event.sourceEvent.clientY - size - offset[1]);
    d.geometry.coordinates = [pt.lng, pt.lat];
    d3.select(this).classed("dragging", false);
}


var drag = d3.drag()
    .subject(function(d) { return d; })
    .on('start', dragstarted)
    .on("drag",dragmove)
    .on("end",dragended);


export{drag}

