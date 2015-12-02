/**
 * 说明：自定义的覆盖物
 */
'use strict';
var eventEmitter = require('event-emitter');
var _ = require('lodash');
function Overlay(options) {
  this.element = document.createElement('div');
  this.config(options);
}

Overlay.prototype = new qq.maps.Overlay();

eventEmitter(Overlay.prototype);

Overlay.prototype.config = function(options) {
  if (!options) {
    return;
  }
  this.options = options;
};


Overlay.prototype.construct = function () {
  this.panes = this.getPanes();
  this.panes.overlayMouseTarget.appendChild(this.element);
};

Overlay.prototype.draw = function () {
  this.element.style.position = 'absolute';
  this.element.innerHTML = this.options.content;
  var overlayProjection = this.getProjection();
  var pixel = overlayProjection.fromLatLngToDivPixel(this.options.position);
  var offsetHeight = this.element.offsetHeight / 2;
  var offsetWidth = this.element.offsetWidth / 2;
  this.element.style.left = pixel.x - offsetWidth + 'px';
  this.element.style.top = pixel.y - offsetHeight + 'px';
};

Overlay.prototype.setOptions = function(options) {
  this.config(options);
  this.draw();
};

Overlay.prototype.getCenter = function() {
  return this.options.position;
};

Overlay.prototype.setZIndex = function(zIndex) {
  this.element.style.zIndex = zIndex;
};

Overlay.prototype.destory = function() {
  this.element.onclick = null;
  this.element.parentNode.removeChild(this.element);
  this.element = null;
};

module.exports = Overlay;