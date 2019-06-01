function getCoverScale(len,speed,num){
   // console.log(1.5/len*num/10*speed/100)
   //return 1.5/len*num/10*speed/100;
   //return 1/len;
    return 0.05;
}
function getLineWidth(allNum) {
    var len = allNum.length;
    var sScale=d3.scaleLinear()
        .domain([1,allNum[len-1]])
        .range([1,10]);
    return sScale
}
function getSeg(allNum,count =4) {
    var len = allNum.length;
    var res = [];
    for(var i = 0;i<count;i++){
        var index = parseInt(len*i/count);
        res.push(allNum[index])
    }
    return res;
}
function getStrokeColor(num,type,seg){

    if(type=="normal"){
      if(num>=seg[0] && num <seg[1]){
          return "#646464";
      }
      else if(num>=seg[1] && num< seg[2]){
          return "#808080";
      }
      else if(num >=seg[2] && num < seg[3]){
          return "#c0c0c0";
      }
      else if(num>=seg[3]){
          return "#ffffff";
      }
  }
  else if(type == "highlight"){
      if(num>=seg[0] && num <seg[1]){
          return "#640000";
      }
      else if(num>=seg[1] && num< seg[2]){
          return "#800000";
      }
      else if(num >=seg[2] && num < seg[3]){
          return "#c00000";
      }
      else if(num>=seg[3]){
          return "#ff0000";
      }
  }
  else if(type=="none"){
      return "none"
  }
  else if(type=='light'){
        if(num>=seg[0] && num <seg[1]){
            return "#FFC6C6"
            //return "#640000";
            //return "#feb24c";
        }
        else if(num>=seg[1] && num< seg[2]){
            return "#FF9E9E"
            //return "#800000";
            //return "#fd8d3c";
        }
        else if(num >=seg[2] && num < seg[3]){
            return "#FF6B6B"
            //return "#c00000";
            //return "#f03b20";
        }
        else if(num>=seg[3]){
            return "#ff0000";
            //return "#bd0026";
        }
    }
}

function getNormalize(x,y) {
    var r1 = x/Math.sqrt(x*x+y*y);
    var r2 = y/Math.sqrt(x*x+y*y);
    return [r1,r2]
}
function getColorBySpeed(speed,type) {
    if(type=="normal"){
        if(speed>0 && speed <10){
            return "#646464";
        }
        else if(speed>=10 && speed< 20){
            return "#808080";
        }
        else if(speed >=20 && speed < 30){
            return "#c0c0c0";
        }
        else if(speed>=30){
            return "#ffffff";
        }
    }
    else if(type == "highlight"){
        if(speed>0 && speed <10){
            return "#640000";
        }
        else if(speed>=10 && speed< 30){
            return "#800000";
        }
        else if(speed >=30 && speed < 70){
            return "#c00000";
        }
        else if(speed>=70){
            return "#ff0000";
        }
    }
    else if(type=="none"){
        return "none"
    }
    else if(type == 'light'){
        // if(speed>0 && speed <10){
        //     return "#8290A5";
        // }
        // else if(speed>=10 && speed< 30){
        //     return "#5C79A5";
        // }
        // else if(speed >=30 && speed < 70){
        //     return "#2C5DA5";
        // }
        // else if(speed>=70){
        //     return "#0042A5";
        // }
        //
        // if(speed>0 && speed <10){
        //     return "#9ecae1";
        // }
        // else if(speed>=10 && speed< 30){
        //     return "#6baed6";
        // }
        // else if(speed >=30 && speed < 70){
        //     return "#3182bd";
        // }
        // else if(speed>=70){
        //     return "#08519c";
        // }
        if(speed>0 && speed <10){
            return "#FFC6C6"
            //return "#9E0000"
           // return "#640000";
            //return "#bd0026";
            //return "#feb24c";
        }
        else if(speed>=10 && speed< 20){
            return "#FF9E9E"
            //return "#B20000"
            //return "#800000";
            //return "#f03b20";
            //return "#fd8d3c";
        }
        else if(speed >=20 && speed < 30){
            return "#FF6B6B"
            //return "#D50000"
            //return "#c00000";
            //return "#fd8d3c";
            //return "#f03b20";
        }
        else if(speed>=30)
            return "#ff0000";
            //return "#feb24c";
            //return "#bd0026";
        }
}
export{getCoverScale,getStrokeColor,getNormalize,getColorBySpeed,getSeg,getLineWidth}