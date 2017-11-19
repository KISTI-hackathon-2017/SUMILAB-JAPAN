var mapsModule = require("nativescript-google-maps-sdk");
var TNSTwitter = require("nativescript-twitter").TNSTwitter;

exports.pageLoaded = function() {
    
};

var mapView;
exports.onMapReady = function(args) {
    mapView = args.object;
};

exports.loadData = function() {
    var http = require('http');
    http.getJSON("http://192.168.41.71:1337/").then(function(r){
        for(var data of r) {

        }
    }, function(e) {

    });
}

exports.onReload = function() {
    var marker = new mapsModule.Marker();
    marker.position = mapsModule.Position.positionFromLatLng(35.870399, 128.601332);
    marker.title = "91.6";
    mapView.addMarker(marker);    
}

exports.onMarkerSelect = function(args) {
    console.dir(args.marker.position);
};