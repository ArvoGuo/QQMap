(function($) {
  'use strict';
  /* Model Color (copy old)*/
  var Color = function() {
    this.reset();
  };
  (function() {
    function toRgb(color) {
      /* jshint bitwise: false */
      var rgb = color ?
        parseInt(String(color).substr(1), 16) :
        Math.floor(Math.random() * (0xFFFFFF + 1));
      return {
        r: Math.abs((rgb >> 16) & 0xFF),
        g: Math.abs((rgb >> 8) & 0xFF),
        b: Math.abs(rgb & 0xFF)
      };
    }

    function decToHex(dec) {
      var hex = dec.toString(16);
      return hex.length == 1 ? ('0' + hex) : hex;
    }

    function toHex(rgb) {
      return '#' + decToHex(rgb.r) + decToHex(rgb.g) + decToHex(rgb.b);
    }

    // Adjust color (darken when v < 0, linghten when v > 0)
    function adjustRgb(rgb, v) {
      rgb.r = Math.min(Math.max(rgb.r + v, 0), 255);
      rgb.g = Math.min(Math.max(rgb.g + v, 0), 255);
      rgb.b = Math.min(Math.max(rgb.b + v, 0), 255);
    }

    function randomColor() {
      var rgb = toRgb(Math.floor(Math.random() * (0xFFFFFF + 1)));
      adjustRgb(rgb, -50);
      return toHex(rgb);
    }

    function adjustColor(color, v) {
      var rgb = toRgb(color);
      adjustRgb(rgb, v);
      return toHex(rgb);
    }

    var colors = [
      '#321400', '#26000f', '#201f41', '#414537', '#410044',
      '#011653', '#003007', '#006045', '#57214f', '#0e4200',
      '#650000', '#000047', '#005612', '#13130e', '#000000',
      '#002027', '#003f65', '#03150e', '#032701', '#050000',
      '#000034', '#404561', '#040051', '#000054', '#001300',
      '#162203', '#341012', '#3f6700', '#435f00', '#130000'
    ];

    Color.prototype.random = function() {
      var color;
      do {
        color = randomColor();
      } while (colors.indexOf(color) != -1);
      return color;
    };

    Color.prototype.reset = function() {
      this.colorIndex = 0;
    };
    Color.prototype.toColor = function(color, alpha) {
      var rgb = color ?
        parseInt(String(color).substr(1), 16) :
        Math.floor(Math.random() * (0xFFFFFF + 1));
      return new qq.maps.Color(Math.abs((rgb >> 16) & 0xFF), Math.abs((rgb >> 8) & 0xFF), Math.abs(rgb & 0xFF), alpha);
    };
    Color.prototype.getColor = function() {
      if (!colors[this.colorIndex]) {
        colors[this.colorIndex] = this.random();
      }
      var color = colors[this.colorIndex++];
      return {
        border: this.toColor(color, 0.8),
        background: this.toColor(adjustColor(color, 100), 0.5)
      };
    };
  })();

  /* Model Map*/
  var MapQQ = function(options) {
    this.init(options);
  };
  var fn = MapQQ.prototype;

  fn.init = function(options) {
    var self = this;
    var opts = options || {};
    self.opts = $.extend({}, opts);
    self.opts.minZoom = self.opts.minZoom || 11;
    self.opts.maxZoom = self.opts.maxZoom || 17;
    self.Color = new Color();
    self.polygonList = opts.polygonList || [];
    self.mapInit();
  };
  fn.mapInit = function() {
    var self = this;
    self.mapObj = new qq.maps.Map(document.getElementById(self.opts.mapAreaId), {
      center: new qq.maps.LatLng(self.opts.center.lat, self.opts.center.lng),
      zoom: 16,
      minZoom: self.opts.minZoom,
      maxZoom: self.opts.maxZoom
    });
  };
  /** Polygon Factory */
  fn.newPolgon = function(opt) {
    var self = this;
    var color = self.Color.getColor();
    var mapCenter = self.mapObj.getCenter();
    var newPath = [],len = 1000 * Math.sin(2*Math.PI / 45);
    var points = [45,135,225,315];
    points.forEach(function(value){
      newPath.push(qq.maps.geometry.spherical.computeOffset(mapCenter,len,value));
    });
    var newPolygon = new qq.maps.Polygon({
      path: opt && opt.path || newPath,
      map: self.mapObj,
      strokeColor: color.border,
      fillColor: color.background,
      strokeWeight: 2
    });
    newPolygon.extData = {
      price: opt && opt.price || 0,
      editable: false
    };
    return newPolygon;
  };

  $.MapQQ = function(options) {
    return new MapQQ(options);
  };

})($);