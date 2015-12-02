'use strict';
var NMap = require('./src');

NMap.onLoad(function() {
  var path = [{"latitude":31.21648799095812,"longitude":121.4431075498047},{"latitude":31.18771599095812,"longitude":121.45237654980468},{"latitude":31.20445199095812,"longitude":121.47949954980469},{"latitude":31.21883699095812,"longitude":121.46748354980468},{"latitude":31.22089199095812,"longitude":121.4431075498047},{"latitude":31.21648799095812,"longitude":121.4431075498047}];

  var div = '<div style="background-color: #999; padding: 3px; border-radius: 3px; font-size: 13px;white-space: nowrap">' +
               '<span style="text-align: center;line-height: 15px;color: #fff;background-color: green;border-radius:10px; width: 15px;display: inline-block">1</span>' +
               '<span style="display: inline-block;color: #fff;">价格123123元</span>' +
             '</div>';


  var Boiled = require('./src');

  Boiled.addFn('Polygon', 'setActive', function() {
    console.log(this);
  });

  Boiled.addFn('Polygon', 'setNormal', function() {
    console.log(this);
  });

  Boiled.addFn('Polygon', 'setDisable', function() {
    console.log(this);
  });


  var map = Boiled.create('Map', document.getElementById('map'), {
    center: new qq.maps.LatLng(31.259928358250843, 121.44005798879533),
    zoom: 16
  });

  var color = Boiled.create('Color');
  console.log(color.toHex(color.produceColor(), 0.3));

  var polygon = Boiled.create('Polygon', {
    path: (function(path) {
      var _path = [];
      for( var i = 0; i < path.length; i ++) {
        _path.push(Boiled.create('Point', path[i].latitude, path[i].longitude).target);
      }
      return _path;
    })(path)
  });

  var slabel = Boiled.create('SLabel', {
    content: div,
    position: map.target.getCenter()
  });
  console.log(polygon.getPoints());
  map.addChild(polygon);
  map.addChild(slabel);
  map.fitBounds([polygon, slabel]);

});

