'use strict';
var s = document.createElement('script');

s.src = 'http://map.qq.com/api/js?v=2.exp&libraries=geometry&key=FGBBZ-LXIRQ-EIN5W-G6TB5-SDDI7-U4BQ6&callback=nmapInit';

document.getElementsByTagName('head')[0].appendChild(s);

var NMap = {};

NMap.loaded = false;

NMap.cbs = [];

NMap.onLoad = function (fn) {
  if (this.loaded) {
    fn();
  } else {
    this.cbs.push(fn);
  }
};

/**
 * 腾讯地图加载后的callback
 *
 * @return {[type]} [description]
 */
function nmapInit() {
  NMap.loaded = true;

  fillNMapProp(NMap);

  while(NMap.cbs.length > 0) {
    var fn = NMap.cbs.pop();
    fn();
  }
}

function fillNMapProp(obj) {
  var CoreShape = require('./shape');

  obj.create = function(type) {
    var args = Array.prototype.slice.call(arguments);
    var shape = new (CoreShape[type].bind.apply(CoreShape[type], args));


    return shape;
  };

  obj.addFn = function(type, key, fn) {
    if (!CoreShape[type]) {
      throw new Error( type + ' is not exist' );
    }
    if (CoreShape[type].prototype[key]) {
      console.warn(type + 'has key' + key + ', you rewrite it;');
    }
    CoreShape[type].prototype[key] = fn;
  };
}

global.nmapInit = nmapInit;

module.exports = NMap;