var mapsModule = require("nativescript-google-maps-sdk");
var twitterModule = require("nativescript-twitter");

exports.pageLoaded = function() {
};

var mapView;
exports.onMapReady = function(args) {
    mapView = args.object;
};

exports.loadData = function() {
    var http = require('http');
    http.getJSON("http://192.168.41.71:1337/").then(function(r){
        console.log(Object.prototype.toString.call(r));
        for(var i = 0; i < r.length; i ++){
            var data = r[i];
            console.log(data.timestamp);
            makeMarker(data.lat, data.lng, data.mcp_value);
        }
    }, function(e) {
        console.log(e);        
    });
}

function makeMarker(lat, lng, vol) {
    var marker = new mapsModule.Marker();
    marker.position = mapsModule.Position.positionFromLatLng(lat, lng);
    marker.title = vol + "dB\n";

    twitterModule.TNSTwitter.init("Xrq00LxDleVI7ywoM6BUlOWIn", "kDXKFMMXkwZChpNhSt2tDCDVHolDdpIjPoJ1oIFUY1hdAof11V");
    var api = new twitterModule.CustomApiService();

    // api.makeRequest("https://api.twitter.com/1.1/search/tweets.json?q=a&geocode=35.870399,128.601332,60km", "get").then(function(r){
    api.makeRequest("https://api.twitter.com/1.1/search/tweets.json?geocode=" + lat + "," + lng + ",1km&count=3", "get").then(function(r){
        var statuses = r.content.toJSON().statuses;
        for(var i = 0; i < statuses.length; i ++){
            var status = statuses[i];
            marker.title += status.text;
        }
        console.log(marker.title);
    }, function(e){
        console.log(e);
    });
    marker.infoWindowTemplate = 'testWindow';
    mapView.addMarker(marker);    
}

exports.onMarkerSelect = function(args) {
    var marker = args.marker;
    console.dir(args.marker.position);
};