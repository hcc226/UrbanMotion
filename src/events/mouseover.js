function mouseoverCom(d,g) {
    var link=edgeG.selectAll("path")
        .data(d.edges)
        .enter().append("path")
        .attr("stroke","steelblue")
        .style("fill",'none')
        .attr("class","edge")
        .attr("opacity","0.5")
        .attr("id",function (d) {
            return "link_"+d.from_nid;
        });
}