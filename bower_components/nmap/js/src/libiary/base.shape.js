/**
 * 说明：实体父级
 */
'use strict';
var eventEmitter = require('event-emitter');

function Shape() {
  this.childs = [];
}

eventEmitter(Shape.prototype);

Shape.prototype.setParent = function(parent) {
  this.parent = parent;
  this.target.setMap(parent.target);
  return this;
};

Shape.prototype.addChild = function(child) {
  child.setParent(this);
  this.childs.push(child);
  return this;
};

Shape.prototype.removeChild = function(child) {
  if (this.childs.indexOf(child) != -1) {
    this.childs.splice(child, 1);
  }
  return this;
};

Shape.prototype.destory = function() {
  if (this.target) {
    this.target.setMap(null);
  }
  if (this.childs) {
    this.childs.forEach(function(item) {
      item.destory();
    });
  }
  this.parent.removeChild(this);
  return null;
};

Shape.prototype.update = function() {
  this.repaint();
  this.childs.forEach(function(item) {
    item.repaint();
  });
};

Shape.prototype.repaint = function() {
  this.target.setOptions(this.targetOptions);
};


module.exports = Shape;