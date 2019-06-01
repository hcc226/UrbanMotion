import {maps} from "../init/mapVueInit"
class Selectors {
    constructor(map){
        var newoptionSVG=d3.select('.filter');
        var inputDiv=newoptionSVG.select('dl');
        $(function (){
            $(".filter dd ").hover(function(){
                $(".nav_right",this).show();
            });
            $(".filter dd ").mouseleave(function(){
                $(".nav_right",this).hide();
            });
        });

        $(function (){
            $(".hide").click(function(){
                if($(".filter dl dd ").css('display')=='none')
                    $(".filter dl dd ").show();
                else if($(".filter dl dd ").css('display')=='block')
                    $(".filter dl dd ").hide();
                //$(".left_nav dl dd ").attr('display','none');
            });
            /*$(".left_nav dd ").mouseleave(function(){
                $(".nav_right",this).hide();
            });*/
        });
        inputDiv.selectAll('whatever').data(maps.optionData)
            .enter()
            .append('dd')
            .attr('class',function (d) {
                return 'option'+d.index;
            })

            .append('a')
            .attr("class","nav_left")
            .attr('id',function (d) {
                return 'optionId'+d.index;
            })
            .html(function(d){return d.text+d.init;});

        inputDiv.selectAll('dd').data(maps.optionData)
            .append('div')
            .attr('class',"nav_right")
            .style('top',function (d,i) {
                if(i==5) return '150px';
                else if(i==7) return '220px'
                else  return (10+i*21)+'px';
            })
            .each(function (d) {
                var thisG=d3.select(this);
                for (var i=0;i<d.values.length;i++){
                    thisG.append('a')
                        .attr('href','javascript:')
                        .attr('father',d.index)
                        .attr('selectId',i)
                        .html(function(d){return d.values[i];})
                        .on('click',function(d){
                            d3.select('#optionId'+d3.select(this).attr('father'))
                                .html(d.text+d.values[d3.select(this).attr('selectId')]);
                            var data={fatherID:parseInt(d3.select(this).attr('father')),selectID:parseInt(d3.select(this).attr('selectId')),values: d.values};
                           // alert(data.values[d3.select(this).attr('selectId')])
                            //var prop = data.values[d3.select(this).attr('selectId')]
                            //this.changeOption(map,data);
                            /*maps.mapObj[0].optionData.forEach(function (t,i) {

                            })*/
                            //console.log(maps);
                            maps.optionData[data.fatherID-1].init = data.values[data.selectID];
                            var prop = maps.optionData[0].init;
                            $.getJSON("/data/tmres-pack-with-200-distance/tmres-angle-9_"+prop+"_60_0.10.json",function (d) {
                                var res = d.res;

                                var loopTime =maps.optionData[4].init;
                                map.allLatLngNodes = []
                                res.forEach(function (tree) {
                                    var path = [];
                                    var drawedSet = new Set()
                                    map.generate(tree,path,drawedSet)
                                    //map[0].drawTree(tree,path,drawedSet)

                                })
                                console.log(loopTime)
                                // map[0].drawAnimationTree();
                                map.drawLoopTree(maps.optionData);
                            })
                            //changeOption(data);
                            //reSearch();
                        });
                }
            });

    }
    changeOption(map,d){
        maps.mapObj[0].optionData[d.fatherID].init = d.values[d.selectID];
        var prop = maps.mapObj[0].optionData[0].init;
        var loopTime = maps.mapObj[0].optionData[4].init;
        $.getJSON("/data/tmres-pack/tmres-angle-9-top"+prop+".json",function (d) {
            var res = d.res;
            map.allLatLngNodes = []
            res.forEach(function (tree) {
                var path = [];
                var drawedSet = new Set()
                map.generate(tree,path,drawedSet)
                //map[0].drawTree(tree,path,drawedSet)

            })
            // map[0].drawAnimationTree();
            map.drawLoopTree(loopTime);
        })
    }
}

export{Selectors}