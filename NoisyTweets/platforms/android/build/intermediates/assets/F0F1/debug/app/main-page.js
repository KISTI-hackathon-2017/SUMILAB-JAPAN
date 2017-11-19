exports.pageLoaded = function() {

};

exports.loadData = function() {
    var http = require('http');
    http.getJSON("http://192.168.41.71:1337/").then(function(r){
        alert(r);
    }, function(e) {

    });
}