function getAngle(x1,y1,x2,y2,f){

   /* a=arcatn(|dy/dx|)（这好像叫象限角）
    当dx>0dy>0时方位角=a;
    当dx<0dy>0时方位角=180-a;
    当dx<0dy<0时方位角=180+a;
    当dx>0dy<0时方位角=360-a;*/
   var dx = x2-x1;
   var dy = y2-y1;
   var k = y1/x1;
   var a = 2*Math.asin(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))/2);
    /* var a = 2*Math.asin(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))/2);
     if(dx>0 && dy>0){
         return a;
     }
     else if(dx<0 && dy>0){
         return  2*Math.PI-a;
     }
     else if(dx<0 && dy<0){
         return  2*Math.PI-a;
     }
     else if(dx>0 && dy<0){
         return  a;
     }*/
    //return 2*Math.asin(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))/2);

    if(f){
        if(x2>=0){
            return 2*Math.asin(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))/2);
        }
        else if(x2<0){
            return 2*Math.PI - 2*Math.asin(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))/2);
        }
    }
    else{
        return  2*Math.PI - 2*Math.asin(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))/2);
        if(x1>0){
            if(x2*y1-y2*x1>0){
                return a;
            }
            else {
                return 2*Math.PI-a;
            }
        }
        else if(x1<0){
            if(x2*y1-y2*x1<0){
                return a;
            }
            else {
                return 2*Math.PI-a;
            }
        }
        else if(x1===0 && y1==1){
            console.log("x1=0")
           if(x2>=0){
               return a;
           }
           else if(x2<0){
               return 2*Math.PI-a;
           }
           else if(x1===0 && y1==-1) {
               console.log("x1=0")
               if (x2 < 0) {
                   return a;
               }
               else if (x2 < 0) {
                   return 2 * Math.PI - a;
               }
           }
        }
      /*  if(x2*y1-y2*x1>=0){
            return 2*Math.asin(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))/2);
        }
        else if(x2*y1-y2*x1<0){
            return 2*Math.PI - 2*Math.asin(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))/2);
        }*/

    }

}

export {getAngle}