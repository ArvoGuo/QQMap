'use strict';
var Shape = require('../libiary/base.shape.js');
var Overlay = require('../libiary/proto.overlay.js');
var _ = require('lodash');

function SLable(options) {
  Shape.call(this);
  this.type = 'SLABEL';
  this.config(options).init();
}

SLable.prototype = _.create(Shape.prototype, {
  'constructor': SLable
});

SLable.prototype.config = function(options) {
  this.targetOptions = this.targetOptions || {
  };
  this.targetOptions = _.merge(this.targetOptions, options);
  return this;
};


SLable.prototype.init = function() {
  this.target = new Overlay(this.targetOptions);
};

module.exports  = SLable;