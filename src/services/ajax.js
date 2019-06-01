import $ from 'jquery'

export const ajax = function (url, method) {
    console.log(url)
    return new Promise(function (resolve, reject) {
        $.ajax({
            url:url,
            type: method,
            contentType: "application/json",
            dataType: 'jsonp',
            async:true,
            success: function (data) {
                resolve(data)
            }
        })
    })
}