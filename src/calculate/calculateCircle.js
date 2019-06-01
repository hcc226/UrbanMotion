//get radius of community
function getRadius(num,min,max) {
    return (num-min)/(max-min)*5 +1;
}

export{getRadius}