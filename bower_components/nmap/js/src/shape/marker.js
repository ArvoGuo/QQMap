'use strict';
var Shape = require('../libiary/base.shape.js');
var _ = require('lodash');
function Marker(options) {
  Shape.call(this);
  this.type = 'POINT';
  this.config(options).init();
}

Marker.prototype = _.create(Shape.prototype, {
  'constructor': Marker
});

Marker.prototype.config = function(options) {
  this.targetOptions = this.targetOptions || {
  };
  this.targetOptions = _.merge(this.targetOptions, options);
  return this;
};

Marker.prototype.init = function() {
  this.target = new qq.maps.Marker(this.targetOptions);
};

module.exports = Marker;