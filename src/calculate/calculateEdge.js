function getWidth(num,min,max){
    return (num-min)/(max-min)*5+0.5;
}
function getDisWidth(num,min,max) {
    return parseFloat(parseFloat((num-min))/parseFloat((max-min))*10+0.5);
}

export{getWidth,
    getDisWidth
}