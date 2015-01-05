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
    self.liDemoId = opts.liDemoId;
    self.addBtnId = opts.addBtnId;
    self.ulAreaId = opts.ulAreaId;
    self.model = opts.model || 'edit';
    self.infoWindowZIndex = 3000;
    self.zIndex = 19;
    self.Color = new Color();
    self.polygonList = opts.polygonList || [];
    self.mapInit();
    self.infoWindowInit();
    self.showAreaInit();
  };

  fn.mapInit = function() {
    var self = this;
    self.mapObj = new qq.maps.Map(document.getElementById(self.opts.mapAreaId), {
      center: new qq.maps.LatLng(self.opts.center.lat, self.opts.center.lng),
      zoom: 16,
      minZoom: self.opts.minZoom,
      maxZoom: self.opts.maxZoom,
      mapTypeControl: false,
      zoomControlOptions: {
        style: qq.maps.ZoomControlStyle.SMALL
      }
    });
    if (self.model === 'edit') {
      qq.maps.event.addListener(self.mapObj, 'mousemove', function(e) {
        self.mousePos = e.latLng;
      });
    }
  };

  fn.showAreaInit = function() {
    var self = this;
    self.addBtn = $('#' + self.addBtnId);
    self.ulArea = $('#' + self.ulAreaId);
    self.itemDemo = $('#' + self.liDemoId).html();
    self.addBtn.on('click', function() {
      var newPolyon = self.newPolgon();
      self.reflashUlArea();
    });
  };

  fn.reflashUlArea = function() {
    var self = this;
    self.ulArea.html('');
    self.polygonList.forEach(function(value, index) {
      var newItem = $(self.itemDemo);
      newItem
        .find('.color').css({
          'background-color': value.fillColor,
          'opacity': '.3',
          'color': '#FFF'
        }).end()
        .find('.price').val(value.extData.price).end()
        .find('.delete').on('click', function() {
          value.extData.li.remove();
          self.delOne(value);
          value = null;
        }).end()
        .appendTo(self.ulArea);
      newItem.on('click', function(e) {
        e.stopPropagation();
        value.setZIndex(++self.zIndex);
        //self.openEditor(value);
        self.infoWindowOpen(value);
      });
      value.extData.li = newItem;
    });
  };

  fn.repaintMap = function(data) {
    var self = this;
    var polygonLngLats = data.areas;
    //reinitMap

    self.polygonList = [];
    polygonLngLats.forEach(function(obj) {
      var price = obj.price;
      var path = obj.path.map(function(index) {
        return self.pathEle({
          lng: index.lng,
          lat: index.lat
        });
      });
      self.newPolgon({
        path: path,
        price: price
      });
    });
    self.reflashUlArea();
  };

  fn.reInitMap = function() {
    var self = this;

  };

  fn.pathEle = function(obj) {
    return new qq.maps.LatLng(obj.lat, obj.lng);
  };

  fn.delOne = function(polygon) {
    var self = this;
    self.infoWindow.close();
    var index = self.polygonList.indexOf(polygon);
    self.polygonList.splice(index, 1);
    polygon.extData.editable = false;
    polygon.setOptions({
      map: null,
      visible: false,
      editable: false
    });
    return true;
  };

  fn.openEditor = function(polygon) {
    var self = this;
    self.closeOtherEditor();
    polygon.extData.editable = true;
    polygon.setOptions({
      editable: true
    });
    return polygon;
  };

  fn.closeOtherEditor = function(polygon) {
    var self = this;
    self.polygonList.forEach(function(value) {
      if (polygon && value === polygon) {
        return;
      }
      if (value.extData.editable) {
        value.setOptions({
          editable: false
        });
        value.extData.editable = false;
      }
    });
    return true;
  };

  /** Polygon Factory */
  fn.newPolgon = function(opt) {
    var self = this;
    var color = self.Color.getColor();
    var mapCenter = self.mapObj.getCenter();
    var newPath = [],
      len = 1000 * Math.sin(2 * Math.PI / 45);
    var points = [45, 135, 225, 315];
    points.forEach(function(value) {
      newPath.push(qq.maps.geometry.spherical.computeOffset(mapCenter, len, value));
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
    if (self.model === 'edit') {
      self.bindAction(newPolygon);
    }
    self.polygonList.push(newPolygon);
    return newPolygon;
  };

  /*覆盖物绑定事件部分*/
  fn.bindAction = function(polygon) {
    var self = this;
    var interval;
    var startTime = 0;
    var endTime = 0;
    qq.maps.event.addListener(polygon, 'click', function() {
      if (Math.abs(startTime - endTime) > 300) {
        return;
      }
      this.setZIndex(++self.zIndex);
      self.closeOtherEditor(this);
      if (this.extData.editable === false) {
        this.setOptions({
          editable: true
        });
        this.extData.editable = true;
      } else if (this.extData.editable === true) {
        this.setOptions({
          editable: false
        });
        this.extData.editable = false;
      }
    });
    qq.maps.event.addListener(polygon, 'mousedown', function() {
      var _this = this;
      if (_this.extData.editable === true) {
        return;
      }
      startTime = (new Date()).getTime();
      //cancel info
      //cansel dragmap
      self.mapObj.setOptions({
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: false
      });
      //change index
      _this.setZIndex(++self.zIndex);
      var oldPath = _this.getPath().getArray().map(function(item) {
        return {
          lat: item.lat,
          lng: item.lng
        };
      });
      var mouselat = self.mousePos.lat;
      var mouselng = self.mousePos.lng;
      var newPath;
      interval = setInterval(function() {
        var disLat = self.mousePos.lat - mouselat;
        var disLng = self.mousePos.lng - mouselng;
        newPath = oldPath.map(function(item) {
          return new qq.maps.LatLng(item.lat + disLat, item.lng + disLng);
        });
        _this.setPath(newPath);
      }, 67);
    });
    qq.maps.event.addListener(polygon, 'mouseup', function(e) {
      var _this = this;
      if (_this.extData.editable === true) {
        return;
      }
      endTime = (new Date()).getTime();
      clearInterval(interval);
      self.mapObj.setOptions({
        draggable: true,
        scrollwheel: true,
        disableDoubleClickZoom: true
      });
    });
  };

  /*提示框部分*/
  fn.infoWindowInit = function() {
    var self = this;
    self.infoWindow = new qq.maps.InfoWindow({
      content: self.infoWindowContent(''),
      position: self.mapObj.getCenter(),
      map: self.mapObj,
      zIndex: self.infoWindowZIndex
    });
  };

  fn.infoWindowOpen = function(polygon){
    var self = this;
    self.infoWindow.close();
    self.infoWindow.setPosition(polygon.getBounds().getCenter());
    self.infoWindow.setContent(self.infoWindowContent(polygon.extData.li.find('.price').val()));
    self.infoWindow.open();
    clearTimeout(self.t);
    self.t = setTimeout(function(){
      self.infoWindow.close();
    },10000)
  };

  fn.infoWindowContent = function(content) {
    return '<div style="padding-bottom:10px;"><div class="tooltip top" style="position:relative!important;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"> 起送价：' + content + '元</div></div></div>';
  };

  /*输出数据部分*/
  fn.getOneInfo = function(polygon) {
    var self = this;
    var path = polygon.getPath().getArray();
    path = path.map(function(point) {
      return {
        lat: point.lat,
        lng: point.lng
      };
    });
    return {
      price: polygon.extData.li.find('.price').val(),
      path: path
    };
  };

  fn.getAllInfo = function() {
    var self = this;
    return self.polygonList.map(function(polygon) {
      return self.getOneInfo(polygon);
    });
  };

  fn.outPutData = function() {
    var self = this;
    return {
      center: {
        lat: self.mapObj.getCenter().getLat(),
        lng: self.mapObj.getCenter().getLng()
      },
      areas: self.getAllInfo()
    };
  };


  $.MapQQ = function(options) {
    return new MapQQ(options);
  };

})($);