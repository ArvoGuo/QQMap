'use strict';
var Shape = require('../libiary/base.shape.js');
var _ = require('lodash');
function Polygon(options) {
  Shape.call(this);
  this.type = 'POLYGON';
  this.config(options).init();
}

Polygon.prototype = _.create(Shape.prototype, {
  'constructor': Polygon
});

Polygon.prototype.config = function(options) {
  var self = this;
  this.targetOptions = this.targetOptions || {
  };
  this.targetOptions = _.merge(this.targetOptions, options);
  if (!this.targetOptions.path) {
    if (!this.targetOptions.position) {
      throw new Error('the polygon without path need set position');
    }
    this.targetOptions.path = (function() {
      var _path = [], len = 1200 * Math.sin(2 * Math.PI / 45);
      [45, 135, 225, 315].forEach(function(value) {
        _path.push(qq.maps.geometry.spherical.computeOffset(self.targetOptions.position, len, value));
      });
      return _path;
    })();
  }
  return this;
};

Polygon.prototype.init = function() {
  var self = this;
  this.target = new qq.maps.Polygon(this.targetOptions);

  this.on('enableEdit', function() {
    self.target.setOptions({
      editable: true
    });
  });
  this.on('disableEdit', function() {
    self.target.setOptions({
      editable: false
    });
  });
};


Polygon.prototype.getBrothers = function() {
  var self = this;
  if (this.parent) {
    var list = _.clone(this.parent.childs);
    _.remove(list, function(item) {
      return item == self;
    });
    return list;
  }
  console.warn("parent isn't exist");
  return [];
};


Polygon.prototype.enableEdit = function() {
  if (this.editable) {
    return;
  }
  var self = this;
  var interval;
  var startTime = 0;
  var endTime = 0;
  self.editable = true;
  this.eventClick = qq.maps.event.addListener(this.target, 'click', function () {
    if (!self.editable) {
      return;
    }
    if (Math.abs(startTime - endTime) > 300) {
      return;
    }
    self.getBrothers().forEach(function(item) {
      item.emit('disableEdit');
    });
    if (self.target.getEditable()) {
      self.emit('disableEdit');
    } else {
      self.emit('enableEdit');
    }

  });
  this.eventMouseDown = qq.maps.event.addListener(this.target, 'mousedown', function () {
    if (this.getEditable()) {
      return;
    }
    startTime = (new Date()).getTime();
    self.parent.emit('enableEdit');
    var oldPath = this.getPath().getArray().map(function (item) {
      return {
        lat: item.lat,
        lng: item.lng
      };
    });
    var mouselat = self.parent.mousePos.lat;
    var mouselng = self.parent.mousePos.lng;
    var newPath;

    interval = setInterval(function () {
      var disLat = self.parent.mousePos.lat - mouselat;
      var disLng = self.parent.mousePos.lng - mouselng;
      newPath = oldPath.map(function (item) {
        return new qq.maps.LatLng(item.lat + disLat, item.lng + disLng);
      });
      self.target.setPath(newPath);
    }, 67);
  });
  this.eventMouseUp = qq.maps.event.addListener(this.target, 'mouseup', function () {
    if (this.getEditable()) {
      return;
    }
    endTime = (new Date()).getTime();
    clearInterval(interval);
    self.parent.emit('disableEdit');
  });
};

Polygon.prototype.getPoints = function() {
  return this.target.getPath().getArray();
};

Polygon.prototype.disableEdit =function() {
  qq.maps.event.removeListener(this.eventClick);
  qq.maps.event.removeListener(this.eventMouseUp);
  qq.maps.event.removeListener(this.eventMouseDown);
  this.editable = false;
  this.emit('disableEdit');
};



module.exports = Polygon;