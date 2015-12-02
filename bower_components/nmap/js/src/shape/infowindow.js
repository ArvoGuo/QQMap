'use strict';
var Shape = require('../libiary/base.shape.js');
var _ = require('lodash');
function InfoWindow(options) {
  Shape.call(this);
  this.type = 'POINT';
  this.config(options).init();
}

InfoWindow.prototype = _.create(Shape.prototype, {
  'constructor': InfoWindow
});

InfoWindow.prototype.config = function(options) {
  this.targetOptions = this.targetOptions || {
  };
  this.targetOptions = _.merge(this.targetOptions, options);
  return this;
};

InfoWindow.prototype.init = function() {
  this.target = new qq.maps.InfoWindow(this.targetOptions);
};

module.exports = InfoWindow;