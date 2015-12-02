'use strict';
var Shape = require('../libiary/base.shape.js');
var _ = require('lodash');
function Point(latitude, longitude) {
  Shape.call(this);
  this.type = 'POINT';
  this.config(latitude, longitude).init();
}

Point.prototype = _.create(Shape.prototype, {
  'constructor': Point
});

Point.prototype.config = function(latitude, longitude) {
  this.latitude = latitude;
  this.longitude = longitude;
  return this;
};

Point.prototype.init = function() {
  this.target = new qq.maps.LatLng(this.latitude, this.longitude);
};

module.exports = Point;