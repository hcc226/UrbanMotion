import $ from 'jquery'


function getdata(url) {
    let p = new Promise(function(resolve, reject) {
        $.get(url, function(res, err) {
            if (res['scode']) {
                resolve(res['data']);
            } else {
                reject(err);
            }
        })
    });
    return p;
}

let getdistrictData = function () {
    $.getJSON('/data/sample.json',function (dt) {
        return dt;
    })
    /*let p = new Promise(function(resolve, reject) {
        $.get('/data/sample.json', function(res, err) {
            if (res['scode']) {
                resolve(res['data']);
            } else {
                reject(err);
            }
        })
    });
   return p;*/
}

let getBoundary = function () {
    $.getJSON('/data/beijingBoundary.json',function (dt) {
        return dt;
    })
    /*let p = new Promise(function(resolve, reject) {
        $.get('/data/beijingBoundary.json', function(res, err) {
            if (res['scode']) {
                resolve(res['data']);
            } else {
                reject(err);
            }
        })
    });
    return p;*/

}


export {
    getdistrictData,
    getdata,
    getBoundary
};