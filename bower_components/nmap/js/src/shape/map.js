'use strict';
var Shape = require('../libiary/base.shape.js');
var _ = require('lodash');

function Map(element, options) {
  Shape.call(this);
  this.type = 'MAP';
  this.config(element, options).init();
}

Map.prototype = _.create(Shape.prototype, {
  'constructor': Map
});

Map.prototype.config = function(element, options) {
  this.childs = [];
  this.element = element;
  this.targetOptions = this.targetOptions || {
  };

  this.targetOptions = _.merge(this.targetOptions, options);
  return this;
};

Map.prototype.init = function() {
  var self = this;
  this.target = new qq.maps.Map(this.element, this.targetOptions);
  qq.maps.event.addListener(this.target, 'mousemove', function(e) {
    self.mousePos = e.latLng;
  });
  this.on('enableEdit', function() {
    self.target.setOptions({
      draggable: false,
      scrollwheel: false,
      disableDoubleClickZoom: false
    });
  });
  this.on('disableEdit', function() {
    self.target.setOptions({
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: true
    });
  });
};

Map.prototype.fitBounds = function(shapes) {
  var _shapes = shapes || this.childs;
  var latlngBounds = new qq.maps.LatLngBounds();
  _shapes.forEach(function(_shape) {
    if (_shape.type == 'POLYGON') {
      latlngBounds.union(_shape.target.getBounds());
    }
    if (_shape.type == 'SLABEL') {
      latlngBounds.extend(_shape.target.getCenter());
    }
  });
  this.target.fitBounds(latlngBounds);
};


module.exports  = Map;