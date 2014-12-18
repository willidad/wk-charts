
/**
  @ngdoc module
  @name wk.chart
  @module wk.chart
  @description
  wk-charts module - beautiful charts defined through HTML markup, based on AngularJs
  -----------------------------------------------------------------------------------

  ** wide range of charts
  ** nicely animated
  ** implemented as AngularJs Directives  -> defined as markup
  ** Angular data binding for data an chart attributes
 */
angular.module('wk.chart', []);


/**
   lists the ordinal scale objects,
 */

angular.module('wk.chart').constant('d3OrdinalScales', ['ordinal', 'category10', 'category20', 'category20b', 'category20c']);


/**
  Sets the default margins and paddings for the chart layout
 */

angular.module('wk.chart').constant('wkChartMargins', {
  top: 10,
  left: 50,
  bottom: 40,
  right: 20,
  topBottomMargin: {
    axis: 25,
    label: 18
  },
  leftRightMargin: {
    axis: 40,
    label: 20
  },
  minMargin: 8,
  "default": {
    top: 8,
    left: 8,
    bottom: 8,
    right: 10
  },
  axis: {
    top: 25,
    bottom: 25,
    left: 40,
    right: 40
  },
  label: {
    top: 18,
    bottom: 18,
    left: 20,
    right: 20
  },
  dataLabelPadding: {
    hor: 5,
    vert: 5
  }
});

angular.module('wk.chart').constant('d3Shapes', ['circle', 'cross', 'triangle-down', 'triangle-up', 'square', 'diamond']);

angular.module('wk.chart').constant('axisConfig', {
  labelFontSize: '1.6em',
  x: {
    axisPositions: ['top', 'bottom'],
    axisOffset: {
      bottom: 'height'
    },
    axisPositionDefault: 'bottom',
    direction: 'horizontal',
    measure: 'width',
    labelPositions: ['outside', 'inside'],
    labelPositionDefault: 'outside',
    labelOffset: {
      top: '1em',
      bottom: '-0.8em'
    }
  },
  y: {
    axisPositions: ['left', 'right'],
    axisOffset: {
      right: 'width'
    },
    axisPositionDefault: 'left',
    direction: 'vertical',
    measure: 'height',
    labelPositions: ['outside', 'inside'],
    labelPositionDefault: 'outside',
    labelOffset: {
      left: '1.2em',
      right: '1.2em'
    }
  }
});

angular.module('wk.chart').constant('d3Animation', {
  duration: 500
});

angular.module('wk.chart').constant('templateDir', 'templates/');

angular.module('wk.chart').constant('formatDefaults', {
  date: '%x',
  number: ',.2f'
});

angular.module('wk.chart').constant('barConfig', {
  padding: 0.1,
  outerPadding: 0
});

/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */

(function() {
    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    this.ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            this.q = [];
            this.add = function(ev) {
                this.q.push(ev);
            };
            var i, j;
            this.call = function() {
                for (i = 0, j = this.q.length; i < j; i++) {
                    this.q[i].call();
                }
            };
        }
        /**
         * @param {HTMLElement} element
         * @param {String} prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }
        /**
         *
         * @param {HTMLElement} element
         * @param {Function} resized
         */
        function attachResizeEvent(element, resized) {
            if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }
            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'wk-chart-resize-sensor';
            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0;';
            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="wk-chart-resize-sensor-expand" style="' + style + '">' +
                '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="wk-chart-resize-sensor-shrink" style="' + style + '">' +
                '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);
            if (!{fixed: 1, absolute: 1}[getComputedStyle(element, 'position')]) {
                element.style.position = 'relative';
            }
            var expand = element.resizeSensor.childNodes[0];
            var expandChild = expand.childNodes[0];
            var shrink = element.resizeSensor.childNodes[1];
            var shrinkChild = shrink.childNodes[0];
            var lastWidth, lastHeight;
            var reset = function() {
                expandChild.style.width = expand.offsetWidth + 10 + 'px';
                expandChild.style.height = expand.offsetHeight + 10 + 'px';
                expand.scrollLeft = expand.scrollWidth;
                expand.scrollTop = expand.scrollHeight;
                shrink.scrollLeft = shrink.scrollWidth;
                shrink.scrollTop = shrink.scrollHeight;
                lastWidth = element.offsetWidth;
                lastHeight = element.offsetHeight;
            };
            reset();
            var changed = function() {
                element.resizedAttached.call();
            };
            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };
            addEvent(expand, 'scroll', function() {
                if (element.offsetWidth > lastWidth || element.offsetHeight > lastHeight) {
                    changed();
                }
                reset();
            });
            addEvent(shrink, 'scroll',function() {
                if (element.offsetWidth < lastWidth || element.offsetHeight < lastHeight) {
                    changed();
                }
                reset();
            });
        }
        if ("[object Array]" === Object.prototype.toString.call(element)
            || ('undefined' !== typeof jQuery && element instanceof jQuery) //jquery
            || ('undefined' !== typeof Elements && element instanceof Elements) //mootools
            ) {
            var i = 0, j = element.length;
            for (; i < j; i++) {
                attachResizeEvent(element[i], callback);
            }
        } else {
            attachResizeEvent(element, callback);
        }
    }
})()

/**
  @ngdoc behavior
  @name brush
  @module wk.chart
  @restrict A
  @description

  enable brushing behavior
 */
angular.module('wk.chart').directive('brush', function($log, selectionSharing, behavior) {
  return {
    restrict: 'A',
    require: ['^chart', '^layout', '?x', '?y', '?rangeX', '?rangeY'],
    scope: {
      brushExtent: '=',
      selectedValues: '=',
      selectedDomain: '=',
      change: '&'
    },
    link: function(scope, element, attrs, controllers) {
      var brush, chart, layout, rangeX, rangeY, scales, x, xScale, y, yScale, _brushAreaSelection, _brushGroup, _isAreaBrush, _ref, _ref1, _ref2, _ref3, _ref4, _selectables;
      chart = controllers[0].me;
      layout = (_ref = controllers[1]) != null ? _ref.me : void 0;
      x = (_ref1 = controllers[2]) != null ? _ref1.me : void 0;
      y = (_ref2 = controllers[3]) != null ? _ref2.me : void 0;
      rangeX = (_ref3 = controllers[4]) != null ? _ref3.me : void 0;
      rangeY = (_ref4 = controllers[5]) != null ? _ref4.me : void 0;
      xScale = void 0;
      yScale = void 0;
      _selectables = void 0;
      _brushAreaSelection = void 0;
      _isAreaBrush = !x && !y;
      _brushGroup = void 0;
      brush = chart.behavior().brush;
      if (!x && !y && !rangeX && !rangeY) {
        scales = layout.scales().getScales(['x', 'y']);
        brush.x(scales.x);
        brush.y(scales.y);
      } else {
        brush.x(x || rangeX);
        brush.y(y || rangeY);
      }
      brush.active(true);
      brush.events().on('brush', function(idxRange, valueRange, domain) {
        if (attrs.brushExtent) {
          scope.brushExtent = idxRange;
        }
        if (attrs.selectedValues) {
          scope.selectedValues = valueRange;
        }
        if (attrs.selectedDomain) {
          scope.selectedDomain = domain;
        }
        return scope.$apply();
      });
      layout.lifeCycle().on('drawChart.brush', function(data) {
        return brush.data(data);
      });

      /**
        @ngdoc attr
        @name brush#brush
        @param brush {string} Brush name
       */
      return attrs.$observe('brush', function(val) {
        if (_.isString(val) && val.length > 0) {
          return brush.brushGroup(val);
        } else {
          return brush.brushGroup(void 0);
        }
      });
    }
  };
});

// Copyright (c) 2013, Jason Davies, http://www.jasondavies.com
// See LICENSE.txt for details.
(function() {

var radians = Math.PI / 180,
    degrees = 180 / Math.PI;

// TODO make incremental rotate optional

d3.geo.zoom = function() {
  var projection,
      zoomPoint,
      event = d3.dispatch("zoomstart", "zoom", "zoomend"),
      zoom = d3.behavior.zoom()
        .on("zoomstart", function() {
          var mouse0 = d3.mouse(this),
              rotate = quaternionFromEuler(projection.rotate()),
              point = position(projection, mouse0);
          if (point) zoomPoint = point;

          zoomOn.call(zoom, "zoom", function() {
                projection.scale(d3.event.scale);
                var mouse1 = d3.mouse(this),
                    between = rotateBetween(zoomPoint, position(projection, mouse1));
                projection.rotate(eulerFromQuaternion(rotate = between
                    ? multiply(rotate, between)
                    : multiply(bank(projection, mouse0, mouse1), rotate)));
                mouse0 = mouse1;
                event.zoom.apply(this, arguments);
              });
          event.zoomstart.apply(this, arguments);
        })
        .on("zoomend", function() {
          zoomOn.call(zoom, "zoom", null);
          event.zoomend.apply(this, arguments);
        }),
      zoomOn = zoom.on;

  zoom.projection = function(_) {
    return arguments.length ? zoom.scale((projection = _).scale()) : projection;
  };

  return d3.rebind(zoom, event, "on");
};

function bank(projection, p0, p1) {
  var t = projection.translate(),
      angle = Math.atan2(p0[1] - t[1], p0[0] - t[0]) - Math.atan2(p1[1] - t[1], p1[0] - t[0]);
  return [Math.cos(angle / 2), 0, 0, Math.sin(angle / 2)];
}

function position(projection, point) {
  var t = projection.translate(),
      spherical = projection.invert(point);
  return spherical && isFinite(spherical[0]) && isFinite(spherical[1]) && cartesian(spherical);
}

function quaternionFromEuler(euler) {
  var λ = .5 * euler[0] * radians,
      φ = .5 * euler[1] * radians,
      γ = .5 * euler[2] * radians,
      sinλ = Math.sin(λ), cosλ = Math.cos(λ),
      sinφ = Math.sin(φ), cosφ = Math.cos(φ),
      sinγ = Math.sin(γ), cosγ = Math.cos(γ);
  return [
    cosλ * cosφ * cosγ + sinλ * sinφ * sinγ,
    sinλ * cosφ * cosγ - cosλ * sinφ * sinγ,
    cosλ * sinφ * cosγ + sinλ * cosφ * sinγ,
    cosλ * cosφ * sinγ - sinλ * sinφ * cosγ
  ];
}

function multiply(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
      b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return [
    a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3,
    a0 * b1 + a1 * b0 + a2 * b3 - a3 * b2,
    a0 * b2 - a1 * b3 + a2 * b0 + a3 * b1,
    a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0
  ];
}

function rotateBetween(a, b) {
  if (!a || !b) return;
  var axis = cross(a, b),
      norm = Math.sqrt(dot(axis, axis)),
      halfγ = .5 * Math.acos(Math.max(-1, Math.min(1, dot(a, b)))),
      k = Math.sin(halfγ) / norm;
  return norm && [Math.cos(halfγ), axis[2] * k, -axis[1] * k, axis[0] * k];
}

function eulerFromQuaternion(q) {
  return [
    Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), 1 - 2 * (q[1] * q[1] + q[2] * q[2])) * degrees,
    Math.asin(Math.max(-1, Math.min(1, 2 * (q[0] * q[2] - q[3] * q[1])))) * degrees,
    Math.atan2(2 * (q[0] * q[3] + q[1] * q[2]), 1 - 2 * (q[2] * q[2] + q[3] * q[3])) * degrees
  ];
}

function cartesian(spherical) {
  var λ = spherical[0] * radians,
      φ = spherical[1] * radians,
      cosφ = Math.cos(φ);
  return [
    cosφ * Math.cos(λ),
    cosφ * Math.sin(λ),
    Math.sin(φ)
  ];
}

function dot(a, b) {
  for (var i = 0, n = a.length, s = 0; i < n; ++i) s += a[i] * b[i];
  return s;
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

})();

angular.module("wk.chart").run(["$templateCache", function($templateCache) {$templateCache.put("templates/legend.html","\n<div ng-style=\"position\" ng-show=\"showLegend\" class=\"wk-chart-legend\">\n  <div ng-show=\"title\" class=\"legend-title\">{{title}}</div>\n  <ul class=\"list-unstyled\">\n    <li ng-repeat=\"legendRow in legendRows track by legendRow.value\" class=\"wk-chart-legend-item\"><span ng-if=\"legendRow.color\" ng-style=\"legendRow.color\">&nbsp;&nbsp;&nbsp;</span>\n      <svg-icon ng-if=\"legendRow.path\" path=\"legendRow.path\" width=\"20\"></svg-icon><span> &nbsp;{{legendRow.value}}</span>\n    </li>\n  </ul>\n</div>");
$templateCache.put("templates/toolTip.html","\n<div ng-show=\"ttShow\" ng-style=\"position\" class=\"wk-chart-tooltip\">\n  <table class=\"table table-condensed table-bordered\">\n    <thead ng-show=\"headerValue\">\n      <tr>\n        <th colspan=\"2\">{{headerName}}</th>\n        <th>{{headerValue}}</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr ng-repeat=\"ttRow in layers\">\n        <td ng-style=\"ttRow.color\" ng-class=\"ttRow.class\">\n          <svg-icon ng-if=\"ttRow.path\" path=\"ttRow.path\" width=\"15\"></svg-icon>\n        </td>\n        <td>{{ttRow.name}}</td>\n        <td>{{ttRow.value}}</td>\n      </tr>\n    </tbody>\n  </table>\n</div>");}]);

/**
  @ngdoc behavior
  @name brushed
  @module wk.chart
  @restrict A
  @description

  enables an axis to be scaled by a named brush in a different layout
 */
angular.module('wk.chart').directive('brushed', function($log, selectionSharing, timing) {
  var sBrushCnt;
  sBrushCnt = 0;
  return {
    restrict: 'A',
    require: ['^chart', '?^layout', '?x', '?y', '?rangeX', '?rangeY'],
    link: function(scope, element, attrs, controllers) {
      var axis, brusher, chart, layout, rangeX, rangeY, x, y, _brushGroup, _ref, _ref1, _ref2, _ref3, _ref4;
      chart = controllers[0].me;
      layout = (_ref = controllers[1]) != null ? _ref.me : void 0;
      x = (_ref1 = controllers[2]) != null ? _ref1.me : void 0;
      y = (_ref2 = controllers[3]) != null ? _ref2.me : void 0;
      rangeX = (_ref3 = controllers[4]) != null ? _ref3.me : void 0;
      rangeY = (_ref4 = controllers[5]) != null ? _ref4.me : void 0;
      axis = x || y || rangeX || rangeY;
      _brushGroup = void 0;
      brusher = function(extent, idxRange) {
        var l, _i, _len, _ref5, _results;
        if (!axis) {
          return;
        }
        axis.domain(extent).scale().domain(extent);
        _ref5 = chart.layouts();
        _results = [];
        for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
          l = _ref5[_i];
          if (l.scales().hasScale(axis)) {
            _results.push(l.lifeCycle().brush(axis, true, idxRange));
          }
        }
        return _results;
      };
      attrs.$observe('brushed', function(val) {
        if (_.isString(val) && val.length > 0) {
          _brushGroup = val;
          return selectionSharing.register(_brushGroup, brusher);
        } else {
          return _brushGroup = void 0;
        }
      });
      return scope.$on('$destroy', function() {
        return selectionSharing.unregister(_brushGroup, brusher);
      });
    }
  };
});

(function() {
    var out$ = typeof exports != 'undefined' && exports || this;

    var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

    function inlineImages(callback) {
        var images = document.querySelectorAll('svg image');
        var left = images.length;
        if (left == 0) {
            callback();
        }
        for (var i = 0; i < images.length; i++) {
            (function(image) {
                if (image.getAttribute('xlink:href')) {
                    var href = image.getAttribute('xlink:href').value;
                    if (/^http/.test(href) && !(new RegExp('^' + window.location.host).test(href))) {
                        throw new Error("Cannot render embedded images linking to external hosts.");
                    }
                }
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var img = new Image();
                img.src = image.getAttribute('xlink:href');
                img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    image.setAttribute('xlink:href', canvas.toDataURL('image/png'));
                    left--;
                    if (left == 0) {
                        callback();
                    }
                }
            })(images[i]);
        }
    }

    function styles(dom) {
        var css = "";
        var sheets = document.styleSheets;
        for (var i = 0; i < sheets.length; i++) {
            var rules = sheets[i].cssRules;
            if (rules != null) {
                for (var j = 0; j < rules.length; j++) {
                    var rule = rules[j];
                    if (typeof(rule.style) != "undefined") {
                        css += rule.selectorText + " { " + rule.style.cssText + " }\n";
                    }
                }
            }
        }

        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.innerHTML = "<![CDATA[\n" + css + "\n]]>";

        var defs = document.createElement('defs');
        defs.appendChild(s);
        return defs;
    }

    out$.svgAsDataUri = function(el, scaleFactor, cb) {
        scaleFactor = scaleFactor || 1;

        inlineImages(function() {
            var outer = document.createElement("div");
            var clone = el.cloneNode(true);
            var width = parseInt(
                clone.getAttribute('width')
                || clone.style.width
                || out$.getComputedStyle(el).getPropertyValue('width')
            );
            var height = parseInt(
                clone.getAttribute('height')
                || clone.style.height
                || out$.getComputedStyle(el).getPropertyValue('height')
            );

            var xmlns = "http://www.w3.org/2000/xmlns/";

            clone.setAttribute("version", "1.1");
            clone.setAttributeNS(xmlns, "xmlns", "http://www.w3.org/2000/svg");
            clone.setAttributeNS(xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
            clone.setAttribute("width", width * scaleFactor);
            clone.setAttribute("height", height * scaleFactor);
            clone.setAttribute("viewBox", "0 0 " + width + " " + height);
            outer.appendChild(clone);

            clone.insertBefore(styles(clone), clone.firstChild);

            var svg = doctype + outer.innerHTML;
            var uri = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
            if (cb) {
                cb(uri);
            }
        });
    }

    out$.saveSvgAsPng = function(el, name, scaleFactor) {
        out$.svgAsDataUri(el, scaleFactor, function(uri) {
            var image = new Image();
            image.src = uri;
            image.onload = function() {
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);

                var a = document.createElement('a');
                a.download = name;
                a.href = canvas.toDataURL('image/png');
                document.body.appendChild(a);
                a.click();
            }
        });
    }
})();

/**
  @ngdoc container
  @name chart
  @module wk.chart
  @restrict E
  @description

  chart is the container directive for all charts.
  @param {array} data - Data to be graphed, {@link content/data ...more}
  @param {boolean} [deep-watch=false]
  @param {string} [filter] - filters the data using the angular filter function
  @param {string} [tooltip] - Show tooltip
  @param {string} [title] - The chart title
  @param {string} [subtitle] - The chart subtitle
  @param {number} [animation-duration=300] - animation duration in milliseconds
 */
angular.module('wk.chart').directive('chart', function($log, chart, $filter) {
  var chartCnt;
  chartCnt = 0;
  return {
    restrict: 'E',
    require: 'chart',
    scope: {
      data: '=',
      filter: '='
    },
    controller: function() {
      return this.me = chart();
    },
    link: function(scope, element, attrs, controller) {
      var dataWatchFn, deepWatch, me, watcherRemoveFn, _data, _filter;
      me = controller.me;
      deepWatch = false;
      watcherRemoveFn = void 0;
      element.addClass(me.id());
      _data = void 0;
      _filter = void 0;
      me.container().element(element[0]);
      me.lifeCycle().configure();
      me.lifeCycle().on('scopeApply', function() {
        return scope.$apply();
      });
      attrs.$observe('tooltips', function(val) {
        me.toolTipTemplate('');
        if (val !== void 0 && (val === '' || val === 'true')) {
          return me.showTooltip(true);
        } else if (val.length > 0 && val !== 'false') {
          me.toolTipTemplate(val);
          return me.showTooltip(true);
        } else {
          return showToolTip(false);
        }
      });
      attrs.$observe('animationDuration', function(val) {
        if (val && _.isNumber(+val) && +val >= 0) {
          return me.animationDuration(val);
        }
      });
      attrs.$observe('title', function(val) {
        if (val) {
          return me.title(val);
        } else {
          return me.title(void 0);
        }
      });
      attrs.$observe('subtitle', function(val) {
        if (val) {
          return me.subTitle(val);
        } else {
          return me.subTitle(void 0);
        }
      });
      scope.$watch('filter', function(val) {
        if (val) {
          _filter = val;
          if (_data) {
            return me.lifeCycle().newData($filter('filter')(_data, _filter));
          }
        } else {
          _filter = void 0;
          if (_data) {
            return me.lifeCycle().newData(_data);
          }
        }
      });
      attrs.$observe('deepWatch', function(val) {
        if (val !== void 0 && val !== 'false') {
          deepWatch = true;
        } else {
          deepWatch = false;
        }
        if (watcherRemoveFn) {
          watcherRemoveFn();
        }
        return watcherRemoveFn = scope.$watch('data', dataWatchFn, deepWatch);
      });
      dataWatchFn = function(val) {
        if (val) {
          _data = val;
          if (_.isArray(_data) && _data.length === 0) {
            return;
          }
          if (_filter) {
            return me.lifeCycle().newData($filter('filter')(val, _filter));
          } else {
            return me.lifeCycle().newData(val);
          }
        }
      };
      watcherRemoveFn = scope.$watch('data', dataWatchFn, deepWatch);
      return element.on('$destroy', function() {
        if (watcherRemoveFn) {
          watcherRemoveFn();
        }
        return $log.log('Destroying chart');
      });
    }
  };
});


/**
  @ngdoc container
  @name layout
  @module wk.chart
  @restrict E
  @requires chart
  @description

  Layout is the container for the layout directives. It requires chart as a parent.
 */
angular.module('wk.chart').directive('layout', function($log, layout, container) {
  var layoutCnt;
  layoutCnt = 0;
  return {
    restrict: 'AE',
    require: ['layout', '^chart'],
    controller: function($element) {
      return this.me = layout();
    },
    link: function(scope, element, attrs, controllers) {
      var chart, me;
      me = controllers[0].me;
      chart = controllers[1].me;
      me.chart(chart);
      element.addClass(me.id());
      chart.addLayout(me);
      chart.container().addLayout(me);
      return me.container(chart.container());
    }
  };
});

angular.module('wk.chart').directive('printButton', function($log) {
  return {
    require: 'chart',
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      var chart, draw;
      chart = controller.me;
      draw = function() {
        var _containerDiv;
        _containerDiv = d3.select(chart.container().element()).select('div.wk-chart');
        return _containerDiv.append('button').attr('class', 'wk-chart-print-button').style({
          position: 'absolute',
          top: 0,
          right: 0
        }).text('Print').on('click', function() {
          var svg;
          $log.log('Clicked Print Button');
          svg = _containerDiv.select('svg.wk-chart').node();
          return saveSvgAsPng(svg, 'print.png', 5);
        });
      };
      return chart.lifeCycle().on('drawChart.print', draw);
    }
  };
});


/**
  @ngdoc behavior
  @name selection
  @element layout
  @module wk.chart
  @restrict A
  @description

  enables selection of individual chart objects
 */
angular.module('wk.chart').directive('selection', function($log) {
  var objId;
  objId = 0;
  return {
    restrict: 'A',
    scope: {
      selectedDomain: '='
    },
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var layout;
      layout = controller.me;
      return layout.lifeCycle().on('configure.selection', function() {
        var _selection;
        _selection = layout.behavior().selected;
        _selection.active(true);
        return _selection.on('selected', function(selectedObjects) {
          scope.selectedDomain = selectedObjects;
          return scope.$apply();
        });
      });
    }
  };
});


/**
  @ngdoc layout
  @name area
  @module wk.chart
  @restrict A
  @area api

  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
 */
angular.module('wk.chart').directive('area', function($log, utils) {
  var lineCntr;
  lineCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var area, areaBrush, brush, draw, host, layerKeys, offset, ttEnter, ttMoveData, ttMoveMarker, _circles, _dataOld, _id, _layout, _pathArray, _pathValuesNew, _pathValuesOld, _scaleList, _showMarkers, _tooltip, _ttHighlight;
      host = controller.me;
      layerKeys = [];
      _layout = [];
      _dataOld = [];
      _pathValuesOld = [];
      _pathValuesNew = [];
      _pathArray = [];
      _tooltip = void 0;
      _ttHighlight = void 0;
      _circles = void 0;
      _scaleList = {};
      _showMarkers = false;
      offset = 0;
      _id = 'line' + lineCntr++;
      area = void 0;
      areaBrush = void 0;
      ttEnter = function(idx) {
        _pathArray = _.toArray(_pathValuesNew);
        return ttMoveData.apply(this, [idx]);
      };
      ttMoveData = function(idx) {
        var ttLayers;
        ttLayers = _pathArray.map(function(l) {
          return {
            name: l[idx].key,
            value: _scaleList.y.formatValue(l[idx].yv),
            color: {
              'background-color': l[idx].color
            },
            xv: l[idx].xv
          };
        });
        this.headerName = _scaleList.x.axisLabel();
        this.headerValue = _scaleList.x.formatValue(ttLayers[0].xv);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        _circles = this.selectAll(".wk-chart-marker-" + _id).data(_pathArray, function(d) {
          return d[idx].key;
        });
        _circles.enter().append('circle').attr('class', "wk-chart-marker-" + _id).attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d[idx].color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cy', function(d) {
          return d[idx].y;
        });
        _circles.exit().remove();
        return this.attr('transform', "translate(" + (_scaleList.x.scale()(_pathArray[0][idx].xv) + offset) + ")");
      };
      draw = function(data, options, x, y, color) {
        var areaNew, areaOld, i, key, layer, layers, mergedX, newFirst, oldFirst, v, val, _i, _j, _layerKeys, _len, _len1;
        mergedX = utils.mergeSeriesSorted(x.value(_dataOld), x.value(data));
        _layerKeys = y.layerKeys(data);
        _layout = [];
        _pathValuesNew = {};
        for (_i = 0, _len = _layerKeys.length; _i < _len; _i++) {
          key = _layerKeys[_i];
          _pathValuesNew[key] = data.map(function(d) {
            return {
              x: x.map(d),
              y: y.scale()(y.layerValue(d, key)),
              xv: x.value(d),
              yv: y.layerValue(d, key),
              key: key,
              color: color.scale()(key),
              data: d
            };
          });
          oldFirst = newFirst = void 0;
          layer = {
            key: key,
            color: color.scale()(key),
            value: []
          };
          i = 0;
          while (i < mergedX.length) {
            if (mergedX[i][0] !== void 0) {
              oldFirst = _pathValuesOld[key][mergedX[i][0]];
              break;
            }
            i++;
          }
          while (i < mergedX.length) {
            if (mergedX[i][1] !== void 0) {
              newFirst = _pathValuesNew[key][mergedX[i][1]];
              break;
            }
            i++;
          }
          for (i = _j = 0, _len1 = mergedX.length; _j < _len1; i = ++_j) {
            val = mergedX[i];
            v = {
              color: layer.color,
              x: val[2]
            };
            if (val[1] === void 0) {
              v.yNew = newFirst.y;
              v.xNew = newFirst.x;
              v.deleted = true;
            } else {
              v.yNew = _pathValuesNew[key][val[1]].y;
              v.xNew = _pathValuesNew[key][val[1]].x;
              newFirst = _pathValuesNew[key][val[1]];
              v.deleted = false;
            }
            if (_dataOld.length > 0) {
              if (val[0] === void 0) {
                v.yOld = oldFirst.y;
                v.xOld = oldFirst.x;
              } else {
                v.yOld = _pathValuesOld[key][val[0]].y;
                v.xOld = _pathValuesOld[key][val[0]].x;
                oldFirst = _pathValuesOld[key][val[0]];
              }
            } else {
              v.xOld = v.xNew;
              v.yOld = v.yNew;
            }
            layer.value.push(v);
          }
          _layout.push(layer);
        }
        offset = x.isOrdinal() ? x.scale().rangeBand() / 2 : 0;
        if (_tooltip) {
          _tooltip.data(data);
        }
        areaOld = d3.svg.area().x(function(d) {
          return d.xOld;
        }).y0(function(d) {
          return d.yOld;
        }).y1(function(d) {
          return y.scale()(0);
        });
        areaNew = d3.svg.area().x(function(d) {
          return d.xNew;
        }).y0(function(d) {
          return d.yNew;
        }).y1(function(d) {
          return y.scale()(0);
        });
        areaBrush = d3.svg.area().x(function(d) {
          return x.scale()(d.x);
        }).y0(function(d) {
          return d.yNew;
        }).y1(function(d) {
          return y.scale()(0);
        });
        layers = this.selectAll(".wk-chart-layer").data(_layout, function(d) {
          return d.key;
        });
        layers.enter().append('g').attr('class', "wk-chart-layer").append('path').attr('class', 'wk-chart-line').attr('transfrom', "translate(" + offset + ")").style('stroke', function(d) {
          return d.color;
        }).style('fill', function(d) {
          return d.color;
        }).style('opacity', 0).style('pointer-events', 'none');
        layers.select('.wk-chart-line').attr('d', function(d) {
          return areaOld(d.value);
        }).transition().duration(options.duration).attr('d', function(d) {
          return areaNew(d.value);
        }).style('opacity', 0.7).style('pointer-events', 'none');
        layers.exit().transition().duration(options.duration).style('opacity', 0).remove();
        _dataOld = data;
        return _pathValuesOld = _pathValuesNew;
      };
      brush = function(axis, idxRange) {
        var layers;
        layers = this.select('.wk-chart-line');
        if (axis.isOrdinal()) {
          return layers.attr('d', function(d) {
            return areaBrush(d.value.slice(idxRange[0], idxRange[1] + 1));
          });
        } else {
          return layers.attr('d', function(d) {
            return areaBrush(d.value);
          });
        }
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('y').domainCalc('extent').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.x);
        _tooltip.on("enter." + _id, ttEnter);
        _tooltip.on("moveData." + _id, ttMoveData);
        return _tooltip.on("moveMarker." + _id, ttMoveMarker);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', brush);
      return attrs.$observe('markers', function(val) {
        if (val === '' || val === 'true') {
          return _showMarkers = true;
        } else {
          return _showMarkers = false;
        }
      });
    }
  };
});


/**
  @ngdoc layout
  @name areaStacked
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=total]
  @usesDimension color [type=category20]
 */
angular.module('wk.chart').directive('areaStacked', function($log, utils) {
  var stackedAreaCntr;
  stackedAreaCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var addedPred, area, brush, deletedSucc, draw, getLayerByKey, host, layerData, layerKeys, layerKeysOld, layers, layoutNew, layoutOld, offs, offset, scaleY, stack, stackLayout, ttMoveData, ttMoveMarker, _circles, _id, _scaleList, _showMarkers, _tooltip, _ttHighlight;
      host = controller.me;
      stack = d3.layout.stack();
      offset = 'zero';
      layers = null;
      _showMarkers = false;
      layerKeys = [];
      layerData = [];
      layoutNew = [];
      layoutOld = [];
      layerKeysOld = [];
      area = void 0;
      deletedSucc = {};
      addedPred = {};
      _tooltip = void 0;
      _ttHighlight = void 0;
      _circles = void 0;
      _scaleList = {};
      scaleY = void 0;
      offs = 0;
      _id = 'areaStacked' + stackedAreaCntr++;
      ttMoveData = function(idx) {
        var ttLayers;
        ttLayers = layerData.map(function(l) {
          return {
            name: l.key,
            value: _scaleList.y.formatValue(l.layer[idx].yy),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.x.axisLabel();
        this.headerValue = _scaleList.x.formatValue(layerData[0].layer[idx].x);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        _circles = this.selectAll(".wk-chart-marker-" + _id).data(layerData, function(d) {
          return d.key;
        });
        _circles.enter().append('circle').attr('class', "wk-chart-marker-" + _id).attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d.color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cy', function(d) {
          return scaleY(d.layer[idx].y + d.layer[idx].y0);
        });
        _circles.exit().remove();
        return this.attr('transform', "translate(" + (_scaleList.x.scale()(layerData[0].layer[idx].x) + offs) + ")");
      };
      getLayerByKey = function(key, layout) {
        var l, _i, _len;
        for (_i = 0, _len = layout.length; _i < _len; _i++) {
          l = layout[_i];
          if (l.key === key) {
            return l;
          }
        }
      };
      stackLayout = stack.values(function(d) {
        return d.layer;
      }).y(function(d) {
        return d.yy;
      });
      draw = function(data, options, x, y, color) {
        layerKeys = y.layerKeys(data);
        deletedSucc = utils.diff(layerKeysOld, layerKeys, 1);
        addedPred = utils.diff(layerKeys, layerKeysOld, -1);
        layerData = layerKeys.map((function(_this) {
          return function(k) {
            return {
              key: k,
              color: color.scale()(k),
              layer: data.map(function(d) {
                return {
                  x: x.value(d),
                  yy: +y.layerValue(d, k),
                  y0: 0,
                  data: d
                };
              })
            };
          };
        })(this));
        layoutNew = stackLayout(layerData);
        offs = x.isOrdinal() ? x.scale().rangeBand() / 2 : 0;
        if (_tooltip) {
          _tooltip.data(data);
        }
        if (!layers) {
          layers = this.selectAll('.wk-chart-layer');
        }
        if (offset === 'expand') {
          scaleY = y.scale().copy();
          scaleY.domain([0, 1]);
        } else {
          scaleY = y.scale();
        }
        area = d3.svg.area().x(function(d) {
          return x.scale()(d.x);
        }).y0(function(d) {
          return scaleY(d.y0 + d.y);
        }).y1(function(d) {
          return scaleY(d.y0);
        });
        layers = layers.data(layoutNew, function(d) {
          return d.key;
        });
        if (layoutOld.length === 0) {
          layers.enter().append('path').attr('class', 'wk-chart-area').style('fill', function(d, i) {
            return color.scale()(d.key);
          }).style('opacity', 0).style('pointer-events', 'none').style('opacity', 0.7);
        } else {
          layers.enter().append('path').attr('class', 'wk-chart-area').attr('d', function(d) {
            if (addedPred[d.key]) {
              return getLayerByKey(addedPred[d.key], layoutOld).path;
            } else {
              return area(d.layer.map(function(p) {
                return {
                  x: p.x,
                  y: 0,
                  y0: 0
                };
              }));
            }
          }).style('fill', function(d, i) {
            return color.scale()(d.key);
          }).style('pointer-events', 'none').style('opacity', 0.7);
        }
        layers.attr('transform', "translate(" + offs + ")").transition().duration(options.duration).attr('d', function(d) {
          return area(d.layer);
        }).style('fill', function(d, i) {
          return color.scale()(d.key);
        });
        layers.exit().transition().duration(options.duration).attr('d', function(d) {
          var succ;
          succ = deletedSucc[d.key];
          if (succ) {
            return area(getLayerByKey(succ, layoutNew).layer.map(function(p) {
              return {
                x: p.x,
                y: 0,
                y0: p.y0
              };
            }));
          } else {
            return area(layoutNew[layoutNew.length - 1].layer.map(function(p) {
              return {
                x: p.x,
                y: 0,
                y0: p.y0 + p.y
              };
            }));
          }
        }).remove();
        layoutOld = layoutNew.map(function(d) {
          return {
            key: d.key,
            path: area(d.layer.map(function(p) {
              return {
                x: p.x,
                y: 0,
                y0: p.y + p.y0
              };
            }))
          };
        });
        return layerKeysOld = layerKeys;
      };
      brush = function(axis, idxRange) {
        layers = this.selectAll(".wk-chart-area");
        return layers.attr('d', function(d) {
          return area(d.layer);
        });
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('y').domainCalc('total').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.x);
        _tooltip.on("enter." + _id, ttMoveData);
        _tooltip.on("moveData." + _id, ttMoveData);
        return _tooltip.on("moveMarker." + _id, ttMoveMarker);
      });
      host.lifeCycle().on('drawChart', draw);

      /**
          @ngdoc attr
          @name areaStacked#areaStacked
          @param [areaStacked=zero] {expression}
       */
      attrs.$observe('areaStacked', function(val) {
        if (val === 'zero' || val === 'silhouette' || val === 'expand' || val === 'wiggle') {
          offset = val;
        } else {
          offset = "zero";
        }
        stack.offset(offset);
        return host.lifeCycle().update();
      });
      return attrs.$observe('markers', function(val) {
        if (val === '' || val === 'true') {
          return _showMarkers = true;
        } else {
          return _showMarkers = false;
        }
      });
    }
  };
});


/**
  @ngdoc layout
  @name areaStackedVertical
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=total] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
 */
angular.module('wk.chart').directive('areaStackedVertical', function($log, utils) {
  var areaStackedVertCntr;
  areaStackedVertCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var addedPred, area, deletedSucc, draw, getLayerByKey, host, layerData, layerKeys, layerKeysOld, layers, layout, layoutNew, layoutOld, offs, offset, scaleX, stack, ttMoveData, ttMoveMarker, _circles, _id, _scaleList, _showMarkers, _tooltip, _ttHighlight;
      host = controller.me;
      stack = d3.layout.stack();
      offset = 'zero';
      layers = null;
      _showMarkers = false;
      layerKeys = [];
      layerData = [];
      layoutNew = [];
      layoutOld = [];
      layerKeysOld = [];
      area = void 0;
      deletedSucc = {};
      addedPred = {};
      _tooltip = void 0;
      _ttHighlight = void 0;
      _circles = void 0;
      _scaleList = {};
      scaleX = void 0;
      offs = 0;
      _id = 'area-stacked-vert' + areaStackedVertCntr++;
      ttMoveData = function(idx) {
        var ttLayers;
        ttLayers = layerData.map(function(l) {
          return {
            name: l.key,
            value: _scaleList.x.formatValue(l.layer[idx].xx),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.y.axisLabel();
        this.headerValue = _scaleList.y.formatValue(layerData[0].layer[idx].yy);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        _circles = this.selectAll(".wk-chart-marker-" + _id).data(layerData, function(d) {
          return d.key;
        });
        _circles.enter().append('circle').attr('class', "wk-chart-marker-" + _id).attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d.color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cx', function(d) {
          return scaleX(d.layer[idx].y + d.layer[idx].y0);
        });
        _circles.exit().remove();
        return this.attr('transform', "translate(0," + (_scaleList.y.scale()(layerData[0].layer[idx].yy) + offs) + ")");
      };
      getLayerByKey = function(key, layout) {
        var l, _i, _len;
        for (_i = 0, _len = layout.length; _i < _len; _i++) {
          l = layout[_i];
          if (l.key === key) {
            return l;
          }
        }
      };
      layout = stack.values(function(d) {
        return d.layer;
      }).y(function(d) {
        return d.xx;
      });

      /*
      prepData = (x,y,color) ->
      
        layoutOld = layoutNew.map((d) -> {key: d.key, path: area(d.layer.map((p) -> {x: p.x, y: 0, y0: p.y + p.y0}))})
        layerKeysOld = layerKeys
      
        layerKeys = y.layerKeys(@)
        layerData = layerKeys.map((k) => {key: k, color:color.scale()(k), layer: @map((d) -> {x: x.value(d), yy: +y.layerValue(d,k), y0: 0})}) # yy: need to avoid overwriting by layout calc -> see stack y accessor
         *layoutNew = layout(layerData)
      
        deletedSucc = utils.diff(layerKeysOld, layerKeys, 1)
        addedPred = utils.diff(layerKeys, layerKeysOld, -1)
       */
      draw = function(data, options, x, y, color) {
        layerKeys = x.layerKeys(data);
        deletedSucc = utils.diff(layerKeysOld, layerKeys, 1);
        addedPred = utils.diff(layerKeys, layerKeysOld, -1);
        layerData = layerKeys.map((function(_this) {
          return function(k) {
            return {
              key: k,
              color: color.scale()(k),
              layer: data.map(function(d) {
                return {
                  yy: y.value(d),
                  xx: +x.layerValue(d, k),
                  y0: 0,
                  data: d
                };
              })
            };
          };
        })(this));
        layoutNew = layout(layerData);
        offs = y.isOrdinal() ? y.scale().rangeBand() / 2 : 0;
        if (_tooltip) {
          _tooltip.data(data);
        }
        if (!layers) {
          layers = this.selectAll('.wk-chart-layer');
        }
        if (offset === 'expand') {
          scaleX = x.scale().copy();
          scaleX.domain([0, 1]);
        } else {
          scaleX = x.scale();
        }
        area = d3.svg.area().x(function(d) {
          return y.scale()(d.yy);
        }).y0(function(d) {
          return scaleX(d.y0 + d.y);
        }).y1(function(d) {
          return scaleX(d.y0);
        });
        layers = layers.data(layoutNew, function(d) {
          return d.key;
        });
        if (layoutOld.length === 0) {
          layers.enter().append('path').attr('class', 'wk-chart-area').style('fill', function(d, i) {
            return color.scale()(d.key);
          }).style('opacity', 0).style('pointer-events', 'none').style('opacity', 0.7);
        } else {
          layers.enter().append('path').attr('class', 'wk-chart-area').attr('d', function(d) {
            if (addedPred[d.key]) {
              return getLayerByKey(addedPred[d.key], layoutOld).path;
            } else {
              return area(d.layer.map(function(p) {
                return {
                  yy: p.yy,
                  y: 0,
                  y0: 0
                };
              }));
            }
          }).style('fill', function(d, i) {
            return color.scale()(d.key);
          }).style('pointer-events', 'none').style('opacity', 0.7);
        }
        layers.attr('transform', "rotate(90) scale(1,-1)").transition().duration(options.duration).attr('d', function(d) {
          return area(d.layer);
        }).style('fill', function(d, i) {
          return color.scale()(d.key);
        });
        layers.exit().transition().duration(options.duration).attr('d', function(d) {
          var succ;
          succ = deletedSucc[d.key];
          if (succ) {
            return area(getLayerByKey(succ, layoutNew).layer.map(function(p) {
              return {
                yy: p.yy,
                y: 0,
                y0: p.y0
              };
            }));
          } else {
            return area(layoutNew[layoutNew.length - 1].layer.map(function(p) {
              return {
                yy: p.yy,
                y: 0,
                y0: p.y0 + p.y
              };
            }));
          }
        }).remove();
        layoutOld = layoutNew.map(function(d) {
          return {
            key: d.key,
            path: area(d.layer.map(function(p) {
              return {
                yy: p.yy,
                y: 0,
                y0: p.y + p.y0
              };
            }))
          };
        });
        return layerKeysOld = layerKeys;
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('x').domainCalc('total').resetOnNewData(true);
        this.getKind('y').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.y);
        _tooltip.on("enter." + _id, ttMoveData);
        _tooltip.on("moveData." + _id, ttMoveData);
        return _tooltip.on("moveMarker." + _id, ttMoveMarker);
      });
      host.lifeCycle().on('drawChart', draw);

      /**
          @ngdoc attr
          @name areaStackedVertical#areaStackedVertical
          @param [areaStackedVertical=zero] {expression}
       */
      attrs.$observe('areaStackedVertical', function(val) {
        if (val === 'zero' || val === 'silhouette' || val === 'expand' || val === 'wiggle') {
          offset = val;
        } else {
          offset = "zero";
        }
        stack.offset(offset);
        return host.lifeCycle().update();
      });
      return attrs.$observe('markers', function(val) {
        if (val === '' || val === 'true') {
          return _showMarkers = true;
        } else {
          return _showMarkers = false;
        }
      });
    }
  };
});


/**
  @ngdoc layout
  @name areaVertical
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
 */
angular.module('wk.chart').directive('areaVertical', function($log, utils) {
  var lineCntr;
  lineCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var areaBrush, brush, brushStartIdx, draw, host, layerKeys, offset, ttEnter, ttMoveData, ttMoveMarker, _circles, _dataOld, _id, _layout, _pathArray, _pathValuesNew, _pathValuesOld, _scaleList, _showMarkers, _tooltip, _ttHighlight;
      host = controller.me;
      layerKeys = [];
      _layout = [];
      _dataOld = [];
      _pathValuesOld = [];
      _pathValuesNew = [];
      _pathArray = [];
      _tooltip = void 0;
      _ttHighlight = void 0;
      _circles = void 0;
      _scaleList = {};
      _showMarkers = false;
      offset = 0;
      areaBrush = void 0;
      brushStartIdx = 0;
      _id = 'area' + lineCntr++;
      ttEnter = function(idx) {
        _pathArray = _.toArray(_pathValuesNew);
        return ttMoveData.apply(this, [idx]);
      };
      ttMoveData = function(idx) {
        var offs, ttLayers;
        offs = idx + brushStartIdx;
        ttLayers = _pathArray.map(function(l) {
          return {
            name: l[offs].key,
            value: _scaleList.x.formatValue(l[offs].xv),
            color: {
              'background-color': l[offs].color
            },
            yv: l[offs].yv
          };
        });
        this.headerName = _scaleList.y.axisLabel();
        this.headerValue = _scaleList.y.formatValue(ttLayers[0].yv);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        var o, offs;
        offs = idx + brushStartIdx;
        _circles = this.selectAll(".wk-chart-marker-" + _id).data(_pathArray, function(d) {
          return d[offs].key;
        });
        _circles.enter().append('circle').attr('class', "wk-chart-marker-" + _id).attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d[offs].color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cx', function(d) {
          return d[offs].x;
        });
        _circles.exit().remove();
        o = _scaleList.y.isOrdinal ? _scaleList.y.scale().rangeBand() / 2 : 0;
        return this.attr('transform', "translate(0," + (_scaleList.y.scale()(_pathArray[0][offs].yv) + o) + ")");
      };
      draw = function(data, options, x, y, color) {
        var areaNew, areaOld, i, key, layer, layers, mergedY, newFirst, oldFirst, v, val, _i, _j, _layerKeys, _len, _len1;
        if (y.isOrdinal()) {
          mergedY = utils.mergeSeriesUnsorted(y.value(_dataOld), y.value(data));
        } else {
          mergedY = utils.mergeSeriesSorted(y.value(_dataOld), y.value(data));
        }
        _layerKeys = x.layerKeys(data);
        _layout = [];
        _pathValuesNew = {};
        for (_i = 0, _len = _layerKeys.length; _i < _len; _i++) {
          key = _layerKeys[_i];
          _pathValuesNew[key] = data.map(function(d) {
            return {
              y: y.map(d),
              x: x.scale()(x.layerValue(d, key)),
              yv: y.value(d),
              xv: x.layerValue(d, key),
              key: key,
              color: color.scale()(key),
              data: d
            };
          });
          layer = {
            key: key,
            color: color.scale()(key),
            value: []
          };
          i = 0;
          while (i < mergedY.length) {
            if (mergedY[i][0] !== void 0) {
              oldFirst = _pathValuesOld[key][mergedY[i][0]];
              break;
            }
            i++;
          }
          while (i < mergedY.length) {
            if (mergedY[i][1] !== void 0) {
              newFirst = _pathValuesNew[key][mergedY[i][1]];
              break;
            }
            i++;
          }
          for (i = _j = 0, _len1 = mergedY.length; _j < _len1; i = ++_j) {
            val = mergedY[i];
            v = {
              color: layer.color,
              y: val[2]
            };
            if (val[1] === void 0) {
              v.yNew = newFirst.y;
              v.xNew = newFirst.x;
              v.deleted = true;
            } else {
              v.yNew = _pathValuesNew[key][val[1]].y;
              v.xNew = _pathValuesNew[key][val[1]].x;
              newFirst = _pathValuesNew[key][val[1]];
              v.deleted = false;
            }
            if (_dataOld.length > 0) {
              if (val[0] === void 0) {
                v.yOld = oldFirst.y;
                v.xOld = oldFirst.x;
              } else {
                v.yOld = _pathValuesOld[key][val[0]].y;
                v.xOld = _pathValuesOld[key][val[0]].x;
                oldFirst = _pathValuesOld[key][val[0]];
              }
            } else {
              v.xOld = v.xNew;
              v.yOld = v.yNew;
            }
            layer.value.push(v);
          }
          _layout.push(layer);
        }
        offset = y.isOrdinal() ? y.scale().rangeBand() / 2 : 0;
        if (_tooltip) {
          _tooltip.data(data);
        }
        areaOld = d3.svg.area().x(function(d) {
          return options.width - d.yOld;
        }).y0(function(d) {
          return d.xOld;
        }).y1(function(d) {
          return x.scale()(0);
        });
        areaNew = d3.svg.area().x(function(d) {
          return options.width - d.yNew;
        }).y0(function(d) {
          return d.xNew;
        }).y1(function(d) {
          return x.scale()(0);
        });
        areaBrush = d3.svg.area().x(function(d) {
          return options.width - y.scale()(d.y);
        }).y0(function(d) {
          return d.xNew;
        }).y1(function(d) {
          return x.scale()(0);
        });
        layers = this.selectAll(".wk-chart-layer").data(_layout, function(d) {
          return d.key;
        });
        layers.enter().append('g').attr('class', "wk-chart-layer").append('path').attr('class', 'wk-chart-line').style('stroke', function(d) {
          return d.color;
        }).style('fill', function(d) {
          return d.color;
        }).style('opacity', 0).style('pointer-events', 'none');
        layers.select('.wk-chart-line').attr('transform', "translate(0," + (options.width + offset) + ")rotate(-90)").attr('d', function(d) {
          return areaOld(d.value);
        }).transition().duration(options.duration).attr('d', function(d) {
          return areaNew(d.value);
        }).style('opacity', 0.7).style('pointer-events', 'none');
        layers.exit().transition().duration(options.duration).style('opacity', 0).remove();
        _dataOld = data;
        return _pathValuesOld = _pathValuesNew;
      };
      brush = function(axis, idxRange, width, height) {
        var layers;
        layers = this.selectAll(".wk-chart-line");
        if (axis.isOrdinal()) {
          layers.attr('transform', "translate(0," + (width + axis.scale().rangeBand() / 2) + ")rotate(-90)");
          layers.attr('d', function(d) {
            return areaBrush(d.value.slice(idxRange[0], idxRange[1] + 1));
          });
          return brushStartIdx = idxRange[0];
        } else {
          return layers.attr('d', function(d) {
            return areaBrush(d.value);
          });
        }
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('y').domainCalc('extent').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.y);
        _tooltip.on("enter." + _id, ttEnter);
        _tooltip.on("moveData." + _id, ttMoveData);
        return _tooltip.on("moveMarker." + _id, ttMoveMarker);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', brush);
      return attrs.$observe('markers', function(val) {
        if (val === '' || val === 'true') {
          return _showMarkers = true;
        } else {
          return _showMarkers = false;
        }
      });
    }
  };
});


/**
  @ngdoc layout
  @name bars
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
 */
angular.module('wk.chart').directive('bars', function($log, utils, barConfig, wkChartMargins) {
  var sBarCntr;
  sBarCntr = 0;
  return {
    restrict: 'A',
    require: '^layout',
    link: function(scope, element, attrs, controller) {
      var barOuterPaddingOld, barPaddingOld, bars, brush, config, draw, host, initial, ttEnter, _id, _merge, _scaleList, _selected, _tooltip;
      host = controller.me;
      _id = "bars" + (sBarCntr++);
      bars = null;
      barPaddingOld = 0;
      barOuterPaddingOld = 0;
      _scaleList = {};
      _selected = void 0;
      _merge = utils.mergeData();
      _merge([]).key(function(d) {
        return d.key;
      });
      initial = true;
      config = barConfig;
      _tooltip = void 0;
      ttEnter = function(data) {
        this.headerName = _scaleList.y.axisLabel();
        this.headerValue = _scaleList.x.axisLabel();
        return this.layers.push({
          name: _scaleList.color.formattedValue(data.data),
          value: _scaleList.x.formattedValue(data.data),
          color: {
            'background-color': _scaleList.color.map(data.data)
          }
        });
      };
      draw = function(data, options, x, y, color) {
        var barOuterPadding, barPadding, enter, layout;
        if (!bars) {
          bars = this.selectAll('.wk-chart-bars');
        }
        barPadding = y.scale().rangeBand() / (1 - config.padding) * config.padding;
        barOuterPadding = y.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding;
        layout = data.map(function(d) {
          return {
            key: y.value(d),
            x: x.map(d),
            y: y.map(d),
            color: color.map(d),
            height: y.scale().rangeBand(y.value(d)),
            data: d
          };
        });
        _merge(layout).first({
          y: options.height + barPaddingOld / 2 - barOuterPadding
        }).last({
          y: 0,
          height: barOuterPaddingOld - barPaddingOld / 2
        });
        bars = bars.data(layout, function(d) {
          return d.key;
        });
        enter = bars.enter().append('g').attr('class', 'wk-chart-bar').attr('transform', function(d) {
          return "translate(0, " + (initial ? d.y : _merge.addedPred(d).y - barPaddingOld / 2) + ") scale(1, " + (initial ? 1 : 0) + ")";
        });
        enter.append('rect').attr('class', 'wk-chart-rect wk-chart-selectable').attr('height', function(d) {
          return d.height;
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        enter.append('text').attr({
          'class': 'wk-chart-data-label'
        }).attr('y', function(d) {
          return d.height / 2;
        }).attr('x', function(d) {
          return d.x + wkChartMargins.dataLabelPadding.hor;
        }).attr({
          dy: '0.35em',
          'text-anchor': 'start'
        }).style({
          opacity: 0
        });
        bars.transition().duration(options.duration).attr('transform', function(d) {
          return "translate(0, " + d.y + ") scale(1,1)";
        });
        bars.select('rect').style('fill', function(d) {
          return d.color;
        }).transition().duration(options.duration).attr('height', function(d) {
          return d.height;
        }).attr('width', function(d) {
          return Math.abs(x.scale()(0) - d.x);
        }).style('opacity', 1);
        bars.select('text').text(function(d) {
          return x.formattedValue(d.data);
        }).transition().duration(options.duration).attr('y', function(d) {
          return d.height / 2;
        }).attr('x', function(d) {
          return d.x + wkChartMargins.dataLabelPadding.hor;
        }).style('opacity', host.showDataLabels() ? 1 : 0);
        bars.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(0," + (_merge.deletedSucc(d).y + _merge.deletedSucc(d).height + barPadding / 2) + ") scale(1,0)";
        }).attr('height', 0).remove();
        initial = false;
        barPaddingOld = barPadding;
        return barOuterPaddingOld = barOuterPadding;
      };
      brush = function(axis, idxRange) {
        bars.attr('transform', function(d) {
          var y;
          return "translate(0, " + ((y = axis.scale()(d.key)) >= 0 ? y : -1000) + ")";
        }).selectAll('.wk-chart-rect').attr('height', function(d) {
          return axis.scale().rangeBand();
        });
        return bars.selectAll('text').attr('y', axis.scale().rangeBand() / 2);
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('x').domainCalc('max').resetOnNewData(true);
        this.getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', brush);

      /**
          @ngdoc attr
          @name bars#padding
          @param padding {expression}
       */
      attrs.$observe('padding', function(val) {
        var values;
        if (val === 'false') {
          config.padding = 0;
          config.outerPadding = 0;
        } else if (val === 'true') {
          _.merge(config, barConfig);
        } else {
          values = utils.parseList(val);
          if (values) {
            if (values.length === 1) {
              config.padding = values[0] / 100;
              config.outerPadding = values[0] / 100;
            }
            if (values.length === 2) {
              config.padding = values[0] / 100;
              config.outerPadding = values[1] / 100;
            }
          }
        }
        _scaleList.y.rangePadding(config);
        return host.lifeCycle().update();
      });

      /**stackedAreaVertical
          @ngdoc attr
          @name bars#labels
          @param labels {expression}
       */
      return attrs.$observe('labels', function(val) {
        if (val === 'false') {
          host.showDataLabels(false);
        } else if (val === 'true' || val === "") {
          host.showDataLabels('x');
        }
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name barClustered
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
 */
angular.module('wk.chart').directive('barClustered', function($log, utils, barConfig) {
  var clusteredBarCntr;
  clusteredBarCntr = 0;
  return {
    restrict: 'A',
    require: '^layout',
    link: function(scope, element, attrs, controller) {
      var barOuterPaddingOld, barPaddingOld, clusterY, config, draw, drawBrush, host, initial, layers, ttEnter, _id, _merge, _mergeLayers, _scaleList, _tooltip;
      host = controller.me;
      _id = "clusteredBar" + (clusteredBarCntr++);
      layers = null;
      clusterY = void 0;
      _merge = utils.mergeData().key(function(d) {
        return d.key;
      });
      _mergeLayers = utils.mergeData().key(function(d) {
        return d.layerKey;
      });
      barPaddingOld = 0;
      barOuterPaddingOld = 0;
      config = barConfig;
      initial = true;
      _tooltip = void 0;
      _scaleList = {};
      ttEnter = function(data) {
        var ttLayers;
        ttLayers = data.layers.map(function(l) {
          return {
            name: l.layerKey,
            value: _scaleList.x.formatValue(l.value),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.y.axisLabel();
        this.headerValue = _scaleList.y.formatValue(data.key);
        return this.layers = this.layers.concat(ttLayers);
      };
      draw = function(data, options, x, y, color) {
        var barOuterPadding, barPadding, bars, cluster, layerKeys;
        barPadding = y.scale().rangeBand() / (1 - config.padding) * config.padding;
        barOuterPadding = y.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding;
        layerKeys = x.layerKeys(data);
        clusterY = d3.scale.ordinal().domain(x.layerKeys(data)).rangeBands([0, y.scale().rangeBand()], 0, 0);
        cluster = data.map(function(d) {
          var l;
          return l = {
            key: y.value(d),
            data: d,
            y: y.map(d),
            height: y.scale().rangeBand(y.value(d)),
            layers: layerKeys.map(function(k) {
              return {
                layerKey: k,
                color: color.scale()(k),
                key: y.value(d),
                value: d[k],
                y: clusterY(k),
                x: x.scale()(d[k]),
                width: x.scale()(d[k]),
                height: clusterY.rangeBand(k)
              };
            })
          };
        });
        _merge(cluster).first({
          y: options.height + barPaddingOld / 2 - barOuterPadding,
          height: y.scale().rangeBand()
        }).last({
          y: 0,
          height: barOuterPaddingOld - barPaddingOld / 2
        });
        _mergeLayers(cluster[0].layers).first({
          y: 0,
          height: 0
        }).last({
          y: cluster[0].height,
          height: 0
        });
        if (!layers) {
          layers = this.selectAll('.wk-chart-layer');
        }
        layers = layers.data(cluster, function(d) {
          return d.key;
        });
        layers.enter().append('g').attr('class', 'wk-chart-layer').call(_tooltip.tooltip).attr('transform', function(d) {
          null;
          return "translate(0, " + (initial ? d.y : _merge.addedPred(d).y - barPaddingOld / 2) + ") scale(1," + (initial ? 1 : 0) + ")";
        }).style('opacity', initial ? 0 : 1);
        layers.transition().duration(options.duration).attr('transform', function(d) {
          return "translate(0," + d.y + ") scale(1,1)";
        }).style('opacity', 1);
        layers.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(0, " + (_merge.deletedSucc(d).y + _merge.deletedSucc(d).height + barPadding / 2) + ") scale(1,0)";
        }).remove();
        bars = layers.selectAll('.wk-chart-bar').data(function(d) {
          return d.layers;
        }, function(d) {
          return d.layerKey + '|' + d.key;
        });
        bars.enter().append('rect').attr('class', 'wk-chart-bar wk-chart-selectable').attr('y', function(d) {
          if (initial) {
            return d.y;
          } else {
            return _mergeLayers.addedPred(d).y + _mergeLayers.addedPred(d).height;
          }
        }).attr('height', function(d) {
          if (initial) {
            return d.height;
          } else {
            return 0;
          }
        }).attr('x', x.scale()(0));
        bars.style('fill', function(d) {
          return color.scale()(d.layerKey);
        }).transition().duration(options.duration).attr('width', function(d) {
          return d.width;
        }).attr('y', function(d) {
          return d.y;
        }).attr('x', function(d) {
          return Math.min(x.scale()(0), d.x);
        }).attr('height', function(d) {
          return Math.abs(d.height);
        });
        bars.exit().transition().duration(options.duration).attr('height', 0).attr('y', function(d) {
          return _mergeLayers.deletedSucc(d).y;
        }).remove();
        initial = false;
        barPaddingOld = barPadding;
        return barOuterPaddingOld = barOuterPadding;
      };
      drawBrush = function(axis, idxRange) {
        var height;
        clusterY.rangeBands([0, axis.scale().rangeBand()], 0, 0);
        height = clusterY.rangeBand();
        return layers.attr('transform', function(d) {
          var y;
          return "translate(0, " + ((y = axis.scale()(d.key)) >= 0 ? y : -1000) + ")";
        }).selectAll('.wk-chart-bar').attr('height', height).attr('y', function(d) {
          return clusterY(d.layerKey);
        });
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('x').domainCalc('max').resetOnNewData(true);
        this.getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        this.layerScale('color');
        _tooltip = host.behavior().tooltip;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', drawBrush);

      /**
          @ngdoc attr
          @name barClustered#padding
          @param padding {expression}
       */
      return attrs.$observe('padding', function(val) {
        var values;
        if (val === 'false') {
          config.padding = 0;
          config.outerPadding = 0;
        } else if (val === 'true') {
          _.merge(config, barConfig);
        } else {
          values = utils.parseList(val);
          if (values) {
            if (values.length === 1) {
              config.padding = values[0] / 100;
              config.outerPadding = values[0] / 100;
            }
            if (values.length === 2) {
              config.padding = values[0] / 100;
              config.outerPadding = values[1] / 100;
            }
          }
        }
        _scaleList.y.rangePadding(config);
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name barStacked
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=total]
  @usesDimension color [type=category20]
 */
angular.module('wk.chart').directive('barStacked', function($log, utils, barConfig) {
  var stackedBarCntr;
  stackedBarCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var barOuterPaddingOld, barPaddingOld, config, draw, drawBrush, host, initial, layers, stack, ttEnter, _id, _merge, _mergeLayers, _scaleList, _selected, _tooltip;
      host = controller.me;
      _id = "stackedColumn" + (stackedBarCntr++);
      layers = null;
      stack = [];
      _tooltip = function() {};
      _scaleList = {};
      _selected = void 0;
      barPaddingOld = 0;
      barOuterPaddingOld = 0;
      _merge = utils.mergeData().key(function(d) {
        return d.key;
      });
      _mergeLayers = utils.mergeData();
      initial = true;
      config = barConfig;
      ttEnter = function(data) {
        var ttLayers;
        ttLayers = data.layers.map(function(l) {
          return {
            name: l.layerKey,
            value: _scaleList.y.formatValue(l.value),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.x.axisLabel();
        this.headerValue = _scaleList.x.formatValue(data.key);
        return this.layers = this.layers.concat(ttLayers);
      };
      draw = function(data, options, x, y, color, size, shape) {
        var barOuterPadding, barPadding, bars, d, l, layerKeys, x0, _i, _len;
        if (!layers) {
          layers = this.selectAll(".wk-chart-layer");
        }
        barPadding = y.scale().rangeBand() / (1 - config.padding) * config.padding;
        barOuterPadding = y.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding;
        layerKeys = x.layerKeys(data);
        stack = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          x0 = 0;
          l = {
            key: y.value(d),
            layers: [],
            data: d,
            y: y.map(d),
            height: y.scale().rangeBand ? y.scale().rangeBand() : 1
          };
          if (l.y !== void 0) {
            l.layers = layerKeys.map(function(k) {
              var layer;
              layer = {
                layerKey: k,
                key: l.key,
                value: d[k],
                width: x.scale()(+d[k]),
                height: (y.scale().rangeBand ? y.scale().rangeBand() : 1),
                x: x.scale()(+x0),
                color: color.scale()(k)
              };
              x0 += +d[k];
              return layer;
            });
            stack.push(l);
          }
        }
        _merge(stack).first({
          y: options.height + barPaddingOld / 2 - barOuterPadding,
          height: 0
        }).last({
          y: 0,
          height: barOuterPaddingOld - barPaddingOld / 2
        });
        _mergeLayers(layerKeys);
        layers = layers.data(stack, function(d) {
          return d.key;
        });
        layers.enter().append('g').attr('class', "wk-chart-layer").attr('transform', function(d) {
          return "translate(0," + (initial ? d.y : _merge.addedPred(d).y - barPaddingOld / 2) + ") scale(1," + (initial ? 1 : 0) + ")";
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip);
        layers.transition().duration(options.duration).attr('transform', function(d) {
          return "translate(0, " + d.y + ") scale(1,1)";
        }).style('opacity', 1);
        layers.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(0," + (_merge.deletedSucc(d).y + _merge.deletedSucc(d).height + barPadding / 2) + ") scale(1,0)";
        }).remove();
        bars = layers.selectAll('.wk-chart-bar').data(function(d) {
          return d.layers;
        }, function(d) {
          return d.layerKey + '|' + d.key;
        });
        bars.enter().append('rect').attr('class', 'wk-chart-bar wk-chart-selectable').attr('x', function(d) {
          var idx;
          if (_merge.prev(d.key)) {
            idx = layerKeys.indexOf(_mergeLayers.addedPred(d.layerKey));
            if (idx >= 0) {
              return _merge.prev(d.key).layers[idx].x + _merge.prev(d.key).layers[idx].width;
            } else {
              return x.scale()(0);
            }
          } else {
            return d.x;
          }
        }).attr('width', function(d) {
          if (_merge.prev(d.key)) {
            return 0;
          } else {
            return d.width;
          }
        }).attr('height', function(d) {
          return d.height;
        }).call(_selected);
        bars.style('fill', function(d) {
          return d.color;
        }).transition().duration(options.duration).attr('x', function(d) {
          return d.x;
        }).attr('width', function(d) {
          return d.width;
        }).attr('height', function(d) {
          return d.height;
        });
        bars.exit().transition().duration(options.duration).attr('x', function(d) {
          var idx;
          idx = layerKeys.indexOf(_mergeLayers.deletedSucc(d.layerKey));
          if (idx >= 0) {
            return _merge.current(d.key).layers[idx].x;
          } else {
            return _merge.current(d.key).layers[layerKeys.length - 1].x + _merge.current(d.key).layers[layerKeys.length - 1].width;
          }
        }).attr('width', 0).remove();
        initial = false;
        barPaddingOld = barPadding;
        return barOuterPaddingOld = barOuterPadding;
      };
      drawBrush = function(axis, idxRange) {
        return layers.attr('transform', function(d) {
          var x;
          return "translate(0, " + ((x = axis.scale()(d.key)) >= 0 ? x : -1000) + ")";
        }).selectAll('.wk-chart-bar').attr('height', function(d) {
          return axis.scale().rangeBand();
        });
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('x').domainCalc('total').resetOnNewData(true);
        this.getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        this.layerScale('color');
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', drawBrush);

      /**
          @ngdoc attr
          @name barStacked#padding
          @param padding {expression}
       */
      return attrs.$observe('padding', function(val) {
        var values;
        if (val === 'false') {
          config.padding = 0;
          config.outerPadding = 0;
        } else if (val === 'true') {
          _.merge(config, barConfig);
        } else {
          values = utils.parseList(val);
          if (values) {
            if (values.length === 1) {
              config.padding = values[0] / 100;
              config.outerPadding = values[0] / 100;
            }
            if (values.length === 2) {
              config.padding = values[0] / 100;
              config.outerPadding = values[1] / 100;
            }
          }
        }
        _scaleList.y.rangePadding(config);
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name bubble
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires size
  @requires layout
 */
angular.module('wk.chart').directive('bubble', function($log, utils) {
  var bubbleCntr;
  bubbleCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var draw, layout, ttEnter, _id, _scaleList, _selected, _tooltip;
      layout = controller.me;
      _tooltip = void 0;
      _scaleList = {};
      _id = 'bubble' + bubbleCntr++;
      _selected = void 0;
      ttEnter = function(data) {
        var sName, scale, _results;
        _results = [];
        for (sName in _scaleList) {
          scale = _scaleList[sName];
          _results.push(this.layers.push({
            name: scale.axisLabel(),
            value: scale.formattedValue(data),
            color: sName === 'color' ? {
              'background-color': scale.map(data)
            } : void 0
          }));
        }
        return _results;
      };
      draw = function(data, options, x, y, color, size) {
        var bubbles;
        bubbles = this.selectAll('.wk-chart-bubble').data(data, function(d) {
          return color.value(d);
        });
        bubbles.enter().append('circle').attr('class', 'wk-chart-bubble wk-chart-selectable').style('opacity', 0).call(_tooltip.tooltip).call(_selected);
        bubbles.style('fill', function(d) {
          return color.map(d);
        }).transition().duration(options.duration).attr({
          r: function(d) {
            return size.map(d);
          },
          cx: function(d) {
            return x.map(d);
          },
          cy: function(d) {
            return y.map(d);
          }
        }).style('opacity', 1);
        return bubbles.exit().transition().duration(options.duration).style('opacity', 0).remove();
      };
      layout.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color', 'size']);
        this.getKind('y').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true);
        _tooltip = layout.behavior().tooltip;
        _selected = layout.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      return layout.lifeCycle().on('drawChart', draw);
    }
  };
});


/**
  @ngdoc layout
  @name column
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('column', function($log, utils, barConfig, wkChartMargins) {
  var sBarCntr;
  sBarCntr = 0;
  return {
    restrict: 'A',
    require: '^layout',
    link: function(scope, element, attrs, controller) {
      var barOuterPaddingOld, barPaddingOld, brush, columns, config, draw, host, initial, ttEnter, _id, _merge, _scaleList, _selected, _tooltip;
      host = controller.me;
      _id = "simpleColumn" + (sBarCntr++);
      columns = null;
      _scaleList = {};
      _selected = void 0;
      _merge = utils.mergeData();
      _merge([]).key(function(d) {
        return d.key;
      });
      initial = true;
      barPaddingOld = 0;
      barOuterPaddingOld = 0;
      config = {};
      _.merge(config, barConfig);
      _tooltip = void 0;
      ttEnter = function(data) {
        this.headerName = _scaleList.x.axisLabel();
        this.headerValue = _scaleList.y.axisLabel();
        return this.layers.push({
          name: _scaleList.color.formattedValue(data.data),
          value: _scaleList.y.formattedValue(data.data),
          color: {
            'background-color': _scaleList.color.map(data.data)
          }
        });
      };
      draw = function(data, options, x, y, color) {
        var barOuterPadding, barPadding, enter, layout;
        if (!columns) {
          columns = this.selectAll('.wk-chart-column');
        }
        barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding;
        barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding;
        layout = data.map(function(d) {
          return {
            data: d,
            key: x.value(d),
            x: x.map(d),
            y: Math.min(y.scale()(0), y.map(d)),
            color: color.map(d),
            width: x.scale().rangeBand(x.value(d)),
            height: Math.abs(y.scale()(0) - y.map(d))
          };
        });
        _merge(layout).first({
          x: 0,
          width: 0
        }).last({
          x: options.width + barPadding / 2 - barOuterPaddingOld,
          width: barOuterPadding
        });
        columns = columns.data(layout, function(d) {
          return d.key;
        });
        enter = columns.enter().append('g').attr('class', 'wk-chart-column').attr('transform', function(d, i) {
          return "translate(" + (initial ? d.x : _merge.addedPred(d).x + _merge.addedPred(d).width + (i ? barPaddingOld / 2 : barOuterPaddingOld)) + "," + d.y + ") scale(" + (initial ? 1 : 0) + ",1)";
        });
        enter.append('rect').attr('class', 'wk-chart-rect wk-chart-selectable').attr('height', function(d) {
          return d.height;
        }).attr('width', function(d) {
          return d.width;
        }).style('fill', function(d) {
          return d.color;
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        enter.append('text').attr('class', 'wk-chart-data-label').attr('x', function(d) {
          return d.width / 2;
        }).attr('y', -wkChartMargins.dataLabelPadding.vert).attr({
          'text-anchor': 'middle'
        }).style({
          opacity: 0
        });
        columns.transition().duration(options.duration).attr("transform", function(d) {
          return "translate(" + d.x + ", " + d.y + ") scale(1,1)";
        });
        columns.select('rect').transition().duration(options.duration).attr('width', function(d) {
          return d.width;
        }).attr('height', function(d) {
          return d.height;
        }).style('opacity', 1);
        columns.select('text').text(function(d) {
          return y.formattedValue(d.data);
        }).transition().duration(options.duration).attr('x', function(d) {
          return d.width / 2;
        }).style('opacity', host.showDataLabels() ? 1 : 0);
        columns.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(" + (_merge.deletedSucc(d).x - barPadding / 2) + "," + d.y + ") scale(0,1)";
        }).remove();
        initial = false;
        barPaddingOld = barPadding;
        return barOuterPaddingOld = barOuterPadding;
      };
      brush = function(axis, idxRange) {
        columns.attr('transform', function(d) {
          var x;
          return "translate(" + ((x = axis.scale()(d.key)) >= 0 ? x : -1000) + ", " + d.y + ")";
        }).selectAll('.wk-chart-rect').attr('width', function(d) {
          return axis.scale().rangeBand();
        });
        return columns.selectAll('text').attr('x', axis.scale().rangeBand() / 2);
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('y').domainCalc('max').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', brush);
      attrs.$observe('padding', function(val) {
        var values;
        if (val === 'false') {
          config.padding = 0;
          config.outerPadding = 0;
        } else if (val === 'true') {
          _.merge(config, barConfig);
        } else {
          values = utils.parseList(val);
          if (values) {
            if (values.length === 1) {
              config.padding = values[0] / 100;
              config.outerPadding = values[0] / 100;
            }
            if (values.length === 2) {
              config.padding = values[0] / 100;
              config.outerPadding = values[1] / 100;
            }
          }
        }
        _scaleList.x.rangePadding(config);
        return host.lifeCycle().update();
      });
      return attrs.$observe('labels', function(val) {
        if (val === 'false') {
          host.showDataLabels(false);
        } else if (val === 'true' || val === "") {
          host.showDataLabels('y');
        }
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name columnClustered
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('columnClustered', function($log, utils, barConfig) {
  var clusteredBarCntr;
  clusteredBarCntr = 0;
  return {
    restrict: 'A',
    require: '^layout',
    link: function(scope, element, attrs, controller) {
      var barOuterPaddingOld, barPaddingOld, clusterX, config, draw, drawBrush, host, initial, layers, ttEnter, _id, _merge, _mergeLayers, _scaleList, _tooltip;
      host = controller.me;
      _id = "clusteredColumn" + (clusteredBarCntr++);
      layers = null;
      _merge = utils.mergeData().key(function(d) {
        return d.key;
      });
      _mergeLayers = utils.mergeData().key(function(d) {
        return d.layerKey;
      });
      barPaddingOld = 0;
      barOuterPaddingOld = 0;
      config = {};
      _.merge(config, barConfig);
      drawBrush = void 0;
      clusterX = void 0;
      initial = true;
      _tooltip = void 0;
      _scaleList = {};
      ttEnter = function(data) {
        var ttLayers;
        ttLayers = data.layers.map(function(l) {
          return {
            name: l.layerKey,
            value: _scaleList.y.formatValue(l.value),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.x.axisLabel();
        this.headerValue = _scaleList.x.formatValue(data.key);
        return this.layers = this.layers.concat(ttLayers);
      };
      draw = function(data, options, x, y, color) {
        var barOuterPadding, barPadding, bars, cluster, layerKeys;
        barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding;
        barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding;
        layerKeys = y.layerKeys(data);
        clusterX = d3.scale.ordinal().domain(y.layerKeys(data)).rangeBands([0, x.scale().rangeBand()], 0, 0);
        cluster = data.map(function(d) {
          var l;
          return l = {
            key: x.value(d),
            data: d,
            x: x.map(d),
            width: x.scale().rangeBand(x.value(d)),
            layers: layerKeys.map(function(k) {
              return {
                layerKey: k,
                color: color.scale()(k),
                key: x.value(d),
                value: d[k],
                x: clusterX(k),
                y: y.scale()(d[k]),
                height: y.scale()(0) - y.scale()(d[k]),
                width: clusterX.rangeBand(k)
              };
            })
          };
        });
        _merge(cluster).first({
          x: barPaddingOld / 2 - barOuterPadding,
          width: 0
        }).last({
          x: options.width + barPadding / 2 - barOuterPaddingOld,
          width: 0
        });
        _mergeLayers(cluster[0].layers).first({
          x: 0,
          width: 0
        }).last({
          x: cluster[0].width,
          width: 0
        });
        if (!layers) {
          layers = this.selectAll('.wk-chart-layer');
        }
        layers = layers.data(cluster, function(d) {
          return d.key;
        });
        layers.enter().append('g').attr('class', 'wk-chart-layer').call(_tooltip.tooltip).attr('transform', function(d) {
          return "translate(" + (initial ? d.x : _merge.addedPred(d).x + _merge.addedPred(d).width + barPaddingOld / 2) + ",0) scale(" + (initial ? 1 : 0) + ", 1)";
        }).style('opacity', initial ? 0 : 1);
        layers.transition().duration(options.duration).attr('transform', function(d) {
          return "translate(" + d.x + ",0) scale(1,1)";
        }).style('opacity', 1);
        layers.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(" + (_merge.deletedSucc(d).x - barPadding / 2) + ", 0) scale(0,1)";
        }).remove();
        bars = layers.selectAll('.wk-chart-bar').data(function(d) {
          return d.layers;
        }, function(d) {
          return d.layerKey + '|' + d.key;
        });
        bars.enter().append('rect').attr('class', 'wk-chart-bar wk-chart-selectable').attr('x', function(d) {
          if (initial) {
            return d.x;
          } else {
            return _mergeLayers.addedPred(d).x + _mergeLayers.addedPred(d).width;
          }
        }).attr('width', function(d) {
          if (initial) {
            return d.width;
          } else {
            return 0;
          }
        });
        bars.style('fill', function(d) {
          return color.scale()(d.layerKey);
        }).transition().duration(options.duration).attr('width', function(d) {
          return d.width;
        }).attr('x', function(d) {
          return d.x;
        }).attr('y', function(d) {
          return Math.min(y.scale()(0), d.y);
        }).attr('height', function(d) {
          return Math.abs(d.height);
        });
        bars.exit().transition().duration(options.duration).attr('width', 0).attr('x', function(d) {
          return _mergeLayers.deletedSucc(d).x;
        }).remove();
        initial = false;
        barPaddingOld = barPadding;
        return barOuterPaddingOld = barOuterPadding;
      };
      drawBrush = function(axis, idxRange) {
        var width;
        clusterX.rangeBands([0, axis.scale().rangeBand()], 0, 0);
        width = clusterX.rangeBand();
        return layers.attr('transform', function(d) {
          var x;
          return "translate(" + ((x = axis.scale()(d.key)) >= 0 ? x : -1000) + ",0)";
        }).selectAll('.wk-chart-bar').attr('width', width).attr('x', function(d) {
          return clusterX(d.layerKey);
        });
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('y').domainCalc('max').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        this.layerScale('color');
        _tooltip = host.behavior().tooltip;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', drawBrush);
      return attrs.$observe('padding', function(val) {
        var values;
        if (val === 'false') {
          config.padding = 0;
          config.outerPadding = 0;
        } else if (val === 'true') {
          _.merge(config, barConfig);
        } else {
          values = utils.parseList(val);
          if (values) {
            if (values.length === 1) {
              config.padding = values[0] / 100;
              config.outerPadding = values[0] / 100;
            }
            if (values.length === 2) {
              config.padding = values[0] / 100;
              config.outerPadding = values[1] / 100;
            }
          }
        }
        _scaleList.x.rangePadding(config);
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name columnStacked
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('columnStacked', function($log, utils, barConfig) {
  var stackedColumnCntr;
  stackedColumnCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var barOuterPaddingOld, barPaddingOld, config, draw, drawBrush, host, initial, layers, stack, ttEnter, _id, _merge, _mergeLayers, _scaleList, _selected, _tooltip;
      host = controller.me;
      _id = "stackedColumn" + (stackedColumnCntr++);
      layers = null;
      stack = [];
      _tooltip = function() {};
      _scaleList = {};
      _selected = void 0;
      barPaddingOld = 0;
      barOuterPaddingOld = 0;
      _merge = utils.mergeData().key(function(d) {
        return d.key;
      });
      _mergeLayers = utils.mergeData();
      initial = true;
      config = {};
      _.merge(config, barConfig);
      ttEnter = function(data) {
        var ttLayers;
        ttLayers = data.layers.map(function(l) {
          return {
            name: l.layerKey,
            value: _scaleList.y.formatValue(l.value),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.x.axisLabel();
        this.headerValue = _scaleList.x.formatValue(data.key);
        return this.layers = this.layers.concat(ttLayers);
      };
      draw = function(data, options, x, y, color, size, shape) {
        var barOuterPadding, barPadding, bars, d, l, layerKeys, y0, _i, _len;
        if (!layers) {
          layers = this.selectAll(".layer");
        }
        barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding;
        barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding;
        layerKeys = y.layerKeys(data);
        stack = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          y0 = 0;
          l = {
            key: x.value(d),
            layers: [],
            data: d,
            x: x.map(d),
            width: x.scale().rangeBand ? x.scale().rangeBand() : 1
          };
          if (l.x !== void 0) {
            l.layers = layerKeys.map(function(k) {
              var layer;
              layer = {
                layerKey: k,
                key: l.key,
                value: d[k],
                height: y.scale()(0) - y.scale()(+d[k]),
                width: (x.scale().rangeBand ? x.scale().rangeBand() : 1),
                y: y.scale()(+y0 + +d[k]),
                color: color.scale()(k)
              };
              y0 += +d[k];
              return layer;
            });
            stack.push(l);
          }
        }
        _merge(stack).first({
          x: barPaddingOld / 2 - barOuterPadding,
          width: 0
        }).last({
          x: options.width + barPadding / 2 - barOuterPaddingOld,
          width: 0
        });
        _mergeLayers(layerKeys);
        layers = layers.data(stack, function(d) {
          return d.key;
        });
        layers.enter().append('g').attr('transform', function(d) {
          return "translate(" + (initial ? d.x : _merge.addedPred(d).x + _merge.addedPred(d).width + barPaddingOld / 2) + ",0) scale(" + (initial ? 1 : 0) + ", 1)";
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip);
        layers.transition().duration(options.duration).attr('transform', function(d) {
          return "translate(" + d.x + ",0) scale(1,1)";
        }).style('opacity', 1);
        layers.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(" + (_merge.deletedSucc(d).x - barPadding / 2) + ", 0) scale(0,1)";
        }).remove();
        bars = layers.selectAll('.wk-chart-bar').data(function(d) {
          return d.layers;
        }, function(d) {
          return d.layerKey + '|' + d.key;
        });
        bars.enter().append('rect').attr('class', 'wk-chart-bar wk-chart-selectable').attr('y', function(d) {
          var idx;
          if (_merge.prev(d.key)) {
            idx = layerKeys.indexOf(_mergeLayers.addedPred(d.layerKey));
            if (idx >= 0) {
              return _merge.prev(d.key).layers[idx].y;
            } else {
              return y.scale()(0);
            }
          } else {
            return d.y;
          }
        }).attr('height', function(d) {
          return d.height;
        }).call(_selected);
        bars.style('fill', function(d) {
          return d.color;
        }).transition().duration(options.duration).attr('y', function(d) {
          return d.y;
        }).attr('width', function(d) {
          return d.width;
        }).attr('height', function(d) {
          return d.height;
        });
        bars.exit().transition().duration(options.duration).attr('height', 0).attr('y', function(d) {
          var idx;
          idx = layerKeys.indexOf(_mergeLayers.deletedSucc(d.layerKey));
          if (idx >= 0) {
            return _merge.current(d.key).layers[idx].y + _merge.current(d.key).layers[idx].height;
          } else {
            return _merge.current(d.key).layers[layerKeys.length - 1].y;
          }
        }).remove();
        initial = false;
        barPaddingOld = barPadding;
        return barOuterPaddingOld = barOuterPadding;
      };
      drawBrush = function(axis, idxRange) {
        return layers.attr('transform', function(d) {
          var x;
          return "translate(" + ((x = axis.scale()(d.key)) >= 0 ? x : -1000) + ",0)";
        }).selectAll('.wk-chart-bar').attr('width', function(d) {
          return axis.scale().rangeBand();
        });
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('y').domainCalc('total').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        this.layerScale('color');
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', drawBrush);
      return attrs.$observe('padding', function(val) {
        var values;
        if (val === 'false') {
          config.padding = 0;
          config.outerPadding = 0;
        } else if (val === 'true') {
          _.merge(config, barConfig);
        } else {
          values = utils.parseList(val);
          if (values) {
            if (values.length === 1) {
              config.padding = values[0] / 100;
              config.outerPadding = values[0] / 100;
            }
            if (values.length === 2) {
              config.padding = values[0] / 100;
              config.outerPadding = values[1] / 100;
            }
          }
        }
        _scaleList.x.rangePadding(config);
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name gauge
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('gauge', function($log, utils) {
  return {
    restrict: 'A',
    require: '^layout',
    controller: function($scope, $attrs) {
      var me;
      me = {
        chartType: 'GaugeChart',
        id: utils.getId()
      };
      $attrs.$set('chart-id', me.id);
      return me;
    },
    link: function(scope, element, attrs, controller) {
      var draw, initalShow, layout;
      layout = controller.me;
      initalShow = true;
      draw = function(data, options, x, y, color) {
        var addMarker, bar, colorDomain, dat, i, marker, ranges, yDomain, _i, _ref;
        $log.info('drawing Gauge Chart');
        dat = [data];
        yDomain = y.scale().domain();
        colorDomain = angular.copy(color.scale().domain());
        colorDomain.unshift(yDomain[0]);
        colorDomain.push(yDomain[1]);
        ranges = [];
        for (i = _i = 1, _ref = colorDomain.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          ranges.push({
            from: +colorDomain[i - 1],
            to: +colorDomain[i]
          });
        }
        bar = this.selectAll('.wk-chart-bar');
        bar = bar.data(ranges, function(d, i) {
          return i;
        });
        if (initalShow) {
          bar.enter().append('rect').attr('class', 'wk-chart-bar').attr('x', 0).attr('width', 50).style('opacity', 0);
        } else {
          bar.enter().append('rect').attr('class', 'wk-chart-bar').attr('x', 0).attr('width', 50);
        }
        bar.transition().duration(options.duration).attr('height', function(d) {
          return y.scale()(0) - y.scale()(d.to - d.from);
        }).attr('y', function(d) {
          return y.scale()(d.to);
        }).style('fill', function(d) {
          return color.scale()(d.from);
        }).style('opacity', 1);
        bar.exit().remove();
        addMarker = function(s) {
          s.append('rect').attr('width', 55).attr('height', 4).style('fill', 'black');
          return s.append('circle').attr('r', 10).attr('cx', 65).attr('cy', 2).style('stroke', 'black');
        };
        marker = this.selectAll('.wk-chart-marker');
        marker = marker.data(dat, function(d) {
          return 'wk-chart-marker';
        });
        marker.enter().append('g').attr('class', 'wk-chart-marker').call(addMarker);
        if (initalShow) {
          marker.attr('transform', function(d) {
            return "translate(0," + (y.scale()(d.value)) + ")";
          }).style('opacity', 0);
        }
        marker.transition().duration(options.duration).attr('transform', function(d) {
          return "translate(0," + (y.scale()(d.value)) + ")";
        }).style('fill', function(d) {
          return color.scale()(d.value);
        }).style('opacity', 1);
        return initalShow = false;
      };
      layout.lifeCycle().on('configure', function() {
        this.requiredScales(['y', 'color']);
        return this.getKind('color').resetOnNewData(true);
      });
      return layout.lifeCycle().on('drawChart', draw);
    }
  };
});


/**
  @ngdoc layout
  @name geoMap
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('geoMap', function($log, utils) {
  var mapCntr, parseList;
  mapCntr = 0;
  parseList = function(val) {
    var l;
    if (val) {
      l = val.trim().replace(/^\[|\]$/g, '').split(',').map(function(d) {
        return d.replace(/^[\"|']|[\"|']$/g, '');
      });
      l = l.map(function(d) {
        if (isNaN(d)) {
          return d;
        } else {
          return +d;
        }
      });
      if (l.length === 1) {
        return l[0];
      } else {
        return l;
      }
    }
  };
  return {
    restrict: 'A',
    require: 'layout',
    scope: {
      geojson: '=',
      projection: '='
    },
    link: function(scope, element, attrs, controller) {
      var draw, layout, pathSel, ttEnter, _dataMapping, _geoJson, _height, _id, _idProp, _path, _projection, _rotate, _scale, _scaleList, _selected, _tooltip, _width, _zoom;
      layout = controller.me;
      _tooltip = void 0;
      _selected = void 0;
      _scaleList = {};
      _id = 'geoMap' + mapCntr++;
      _dataMapping = d3.map();
      _scale = 1;
      _rotate = [0, 0];
      _idProp = '';
      ttEnter = function(data) {
        var val;
        val = _dataMapping.get(data.properties[_idProp[0]]);
        return this.layers.push({
          name: val.RS,
          value: val.DES
        });
      };
      pathSel = [];
      _projection = d3.geo.orthographic();
      _width = 0;
      _height = 0;
      _path = void 0;
      _zoom = d3.geo.zoom().projection(_projection).on("zoom.redraw", function() {
        d3.event.sourceEvent.preventDefault();
        return pathSel.attr("d", _path);
      });
      _geoJson = void 0;
      draw = function(data, options, x, y, color) {
        var e, _i, _len;
        _width = options.width;
        _height = options.height;
        if (data && data[0].hasOwnProperty(_idProp[1])) {
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            e = data[_i];
            _dataMapping.set(e[_idProp[1]], e);
          }
        }
        if (_geoJson) {
          _projection.translate([_width / 2, _height / 2]);
          pathSel = this.selectAll("path").data(_geoJson.features, function(d) {
            return d.properties[_idProp[0]];
          });
          pathSel.enter().append("svg:path").style('fill', 'lightgrey').style('stroke', 'darkgrey').call(_tooltip.tooltip).call(_selected).call(_zoom);
          pathSel.attr("d", _path).style('fill', function(d) {
            var val;
            val = _dataMapping.get(d.properties[_idProp[0]]);
            return color.map(val);
          });
          return pathSel.exit().remove();
        }
      };
      layout.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['color']);
        return _scaleList.color.resetOnNewData(true);
      });
      layout.lifeCycle().on('drawChart', draw);
      _tooltip = layout.behavior().tooltip;
      _selected = layout.behavior().selected;
      _tooltip.on("enter." + _id, ttEnter);
      scope.$watch('projection', function(val) {
        if (val !== void 0) {
          $log.log('setting Projection params', val);
          if (d3.geo.hasOwnProperty(val.projection)) {
            _projection = d3.geo[val.projection]();
            _projection.center(val.center).scale(val.scale).rotate(val.rotate).clipAngle(val.clipAngle);
            _idProp = val.idMap;
            if (_projection.parallels) {
              _projection.parallels(val.parallels);
            }
            _scale = _projection.scale();
            _rotate = _projection.rotate();
            _path = d3.geo.path().projection(_projection);
            _zoom.projection(_projection);
            return layout.lifeCycle().update();
          }
        }
      }, true);
      return scope.$watch('geojson', function(val) {
        if (val !== void 0 && val !== '') {
          _geoJson = val;
          return layout.lifeCycle().update();
        }
      });
    }
  };
});


/**
  @ngdoc layout
  @name histogram
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires rangeX
  @requires rangeY
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('columnHistogram', function($log, barConfig, utils, wkChartMargins) {
  var sHistoCntr;
  sHistoCntr = 0;
  return {
    restrict: 'A',
    require: '^layout',
    link: function(scope, element, attrs, controller) {
      var brush, buckets, config, draw, host, initial, labels, ttEnter, _id, _merge, _scaleList, _selected, _tooltip;
      host = controller.me;
      _id = "histogram" + (sHistoCntr++);
      _scaleList = {};
      buckets = void 0;
      labels = void 0;
      config = {};
      _tooltip = void 0;
      _selected = void 0;
      _.merge(config, barConfig);
      _merge = utils.mergeData().key(function(d) {
        return d.xVal;
      });
      initial = true;
      _tooltip = void 0;
      ttEnter = function(data) {
        var lower, name, upper;
        this.headerName = _scaleList.rangeX.axisLabel();
        this.headerValue = _scaleList.y.axisLabel();
        lower = _scaleList.rangeX.formatValue(_scaleList.rangeX.lowerValue(data.data));
        if (_scaleList.rangeX.upperProperty()) {
          upper = _scaleList.rangeX.formatValue(_scaleList.rangeX.upperValue(data.data));
          name = lower + ' - ' + upper;
        } else {
          name = _scaleList.rangeX.formatValue(_scaleList.rangeX.lowerValue(data.data));
        }
        return this.layers.push({
          name: name,
          value: _scaleList.y.formattedValue(data.data),
          color: {
            'background-color': _scaleList.color.map(data.data)
          }
        });
      };
      draw = function(data, options, x, y, color, size, shape, rangeX) {
        var enter, layout, start, step, width;
        if (rangeX.upperProperty()) {
          layout = data.map(function(d) {
            return {
              x: rangeX.scale()(rangeX.lowerValue(d)),
              xVal: rangeX.lowerValue(d),
              width: rangeX.scale()(rangeX.upperValue(d)) - rangeX.scale()(rangeX.lowerValue(d)),
              y: y.map(d),
              height: options.height - y.map(d),
              color: color.map(d),
              data: d
            };
          });
        } else {
          if (data.length > 0) {
            start = rangeX.lowerValue(data[0]);
            step = rangeX.lowerValue(data[1]) - start;
            width = options.width / data.length;
            layout = data.map(function(d, i) {
              return {
                x: rangeX.scale()(start + step * i),
                xVal: rangeX.lowerValue(d),
                width: width,
                y: y.map(d),
                height: options.height - y.map(d),
                color: color.map(d),
                data: d
              };
            });
          }
        }
        _merge(layout).first({
          x: 0,
          width: 0
        }).last({
          x: options.width,
          width: 0
        });
        if (!buckets) {
          buckets = this.selectAll('.wk-chart-bucket');
        }
        buckets = buckets.data(layout, function(d) {
          return d.xVal;
        });
        enter = buckets.enter().append('g').attr('class', 'wk-chart-bucket').attr('transform', function(d) {
          return "translate(" + (initial ? d.x : _merge.addedPred(d).x + _merge.addedPred(d).width) + "," + d.y + ") scale(" + (initial ? 1 : 0) + ",1)";
        });
        enter.append('rect').attr('class', 'wk-chart-selectable').attr('height', function(d) {
          return d.height;
        }).attr('width', function(d) {
          return d.width;
        }).style('fill', function(d) {
          return d.color;
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        enter.append('text').attr('class', 'wk-chart-data-label').attr('x', function(d) {
          return d.width / 2;
        }).attr('y', -wkChartMargins.dataLabelPadding.vert).attr({
          'text-anchor': 'middle'
        }).style({
          opacity: 0
        });
        buckets.transition().duration(options.duration).attr("transform", function(d) {
          return "translate(" + d.x + ", " + d.y + ") scale(1,1)";
        });
        buckets.select('rect').transition().duration(options.duration).attr('width', function(d) {
          return d.width;
        }).attr('height', function(d) {
          return d.height;
        }).style('fill', function(d) {
          return d.color;
        }).style('opacity', 1);
        buckets.select('text').text(function(d) {
          return y.formattedValue(d.data);
        }).transition().duration(options.duration).attr('x', function(d) {
          return d.width / 2;
        }).style('opacity', host.showDataLabels() ? 1 : 0);
        buckets.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(" + (_merge.deletedSucc(d).x) + "," + d.y + ") scale(0,1)";
        }).remove();
        return initial = false;
      };
      brush = function(axis, idxRange, width, height) {
        var bucketWidth;
        bucketWidth = function(axis, d) {
          if (axis.upperProperty()) {
            return axis.scale()(axis.upperValue(d.data)) - axis.scale()(axis.lowerValue(d.data));
          } else {
            return width / Math.max(idxRange[1] - idxRange[0] + 1, 1);
          }
        };
        buckets.attr('transform', function(d) {
          var x;
          null;
          return "translate(" + ((x = axis.scale()(d.xVal)) >= 0 ? x : -1000) + ", " + d.y + ")";
        });
        buckets.select('rect').attr('width', function(d) {
          return bucketWidth(axis, d);
        });
        return buckets.selectAll('text').attr('x', function(d) {
          return bucketWidth(axis, d) / 2;
        });
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['rangeX', 'y', 'color']);
        this.getKind('y').domainCalc('max').resetOnNewData(true);
        this.getKind('rangeX').resetOnNewData(true).scaleType('linear').domainCalc('rangeExtent');
        this.getKind('color').resetOnNewData(true);
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', brush);
      return attrs.$observe('labels', function(val) {
        if (val === 'false') {
          host.showDataLabels(false);
        } else if (val === 'true' || val === "") {
          host.showDataLabels('y');
        }
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name line
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('line', function($log, behavior, utils, timing) {
  var lineCntr;
  lineCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var brush, draw, host, line, lineBrush, markers, markersBrushed, offset, ttEnter, ttMoveData, ttMoveMarker, _circles, _dataOld, _id, _initialOpacity, _layerKeys, _layout, _pathArray, _pathValuesNew, _pathValuesOld, _scaleList, _showMarkers, _tooltip, _ttHighlight;
      host = controller.me;
      _layerKeys = [];
      _layout = [];
      _dataOld = [];
      _pathValuesOld = [];
      _pathValuesNew = [];
      _pathArray = [];
      _initialOpacity = 0;
      _tooltip = void 0;
      _ttHighlight = void 0;
      _circles = void 0;
      _showMarkers = false;
      _scaleList = {};
      offset = 0;
      _id = 'line' + lineCntr++;
      line = void 0;
      markers = void 0;
      markersBrushed = void 0;
      lineBrush = void 0;
      ttEnter = function(idx) {
        _pathArray = _.toArray(_pathValuesNew);
        return ttMoveData.apply(this, [idx]);
      };
      ttMoveData = function(idx) {
        var ttLayers;
        ttLayers = _pathArray.map(function(l) {
          return {
            name: l[idx].key,
            value: _scaleList.y.formatValue(l[idx].yv),
            color: {
              'background-color': l[idx].color
            },
            xv: l[idx].xv
          };
        });
        this.headerName = _scaleList.x.axisLabel();
        this.headerValue = _scaleList.x.formatValue(ttLayers[0].xv);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        _circles = this.selectAll(".wk-chart-marker-" + _id).data(_pathArray, function(d) {
          return d[idx].key;
        });
        _circles.enter().append('circle').attr('class', "wk-chart-marker-" + _id).attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d[idx].color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cy', function(d) {
          return d[idx].y;
        });
        _circles.exit().remove();
        return this.attr('transform', "translate(" + (_scaleList.x.scale()(_pathArray[0][idx].xv) + offset) + ")");
      };
      draw = function(data, options, x, y, color) {
        var enter, i, key, layer, layers, lineNew, lineOld, mergedX, newLast, oldLast, v, val, _i, _j, _len, _len1;
        mergedX = utils.mergeSeriesSorted(x.value(_dataOld), x.value(data));
        _layerKeys = y.layerKeys(data);
        _layout = [];
        _pathValuesNew = {};
        for (_i = 0, _len = _layerKeys.length; _i < _len; _i++) {
          key = _layerKeys[_i];
          _pathValuesNew[key] = data.map(function(d) {
            return {
              x: x.map(d),
              y: y.scale()(y.layerValue(d, key)),
              xv: x.value(d),
              yv: y.layerValue(d, key),
              key: key,
              color: color.scale()(key),
              data: d
            };
          });
          layer = {
            key: key,
            color: color.scale()(key),
            value: []
          };
          i = 0;
          while (i < mergedX.length) {
            if (mergedX[i][0] !== void 0) {
              oldLast = _pathValuesOld[key][mergedX[i][0]];
              break;
            }
            i++;
          }
          while (i < mergedX.length) {
            if (mergedX[i][1] !== void 0) {
              newLast = _pathValuesNew[key][mergedX[i][1]];
              break;
            }
            i++;
          }
          for (i = _j = 0, _len1 = mergedX.length; _j < _len1; i = ++_j) {
            val = mergedX[i];
            v = {
              color: layer.color,
              x: val[2]
            };
            if (val[1] === void 0) {
              v.yNew = newLast.y;
              v.xNew = newLast.x;
              v.deleted = true;
            } else {
              v.yNew = _pathValuesNew[key][val[1]].y;
              v.xNew = _pathValuesNew[key][val[1]].x;
              newLast = _pathValuesNew[key][val[1]];
              v.deleted = false;
            }
            if (_dataOld.length > 0) {
              if (val[0] === void 0) {
                v.yOld = oldLast.y;
                v.xOld = oldLast.x;
              } else {
                v.yOld = _pathValuesOld[key][val[0]].y;
                v.xOld = _pathValuesOld[key][val[0]].x;
                oldLast = _pathValuesOld[key][val[0]];
              }
            } else {
              v.xOld = v.xNew;
              v.yOld = v.yNew;
            }
            layer.value.push(v);
          }
          _layout.push(layer);
        }
        offset = x.isOrdinal() ? x.scale().rangeBand() / 2 : 0;
        if (_tooltip) {
          _tooltip.data(data);
        }
        markers = function(layer, duration) {
          var m;
          if (_showMarkers) {
            m = layer.selectAll('.wk-chart-marker').data(function(l) {
              return l.value;
            }, function(d) {
              return d.x;
            });
            m.enter().append('circle').attr('class', 'wk-chart-marker wk-chart-selectable').attr('r', 5).style('pointer-events', 'none').style('opacity', 0).style('fill', function(d) {
              return d.color;
            });
            m.attr('cy', function(d) {
              return d.yOld;
            }).attr('cx', function(d) {
              return d.xOld + offset;
            }).classed('wk-chart-deleted', function(d) {
              return d.deleted;
            }).transition().duration(duration).attr('cy', function(d) {
              return d.yNew;
            }).attr('cx', function(d) {
              return d.xNew + offset;
            }).style('opacity', function(d) {
              if (d.deleted) {
                return 0;
              } else {
                return 1;
              }
            });
            return m.exit().remove();
          } else {
            return layer.selectAll('.wk-chart-marker').transition().duration(duration).style('opacity', 0).remove();
          }
        };
        markersBrushed = function(layer) {
          if (_showMarkers) {
            return layer.attr('cx', function(d) {
              null;
              return x.scale()(d.x);
            });
          }
        };
        lineOld = d3.svg.line().x(function(d) {
          return d.xOld;
        }).y(function(d) {
          return d.yOld;
        });
        lineNew = d3.svg.line().x(function(d) {
          return d.xNew;
        }).y(function(d) {
          return d.yNew;
        });
        lineBrush = d3.svg.line().x(function(d) {
          return x.scale()(d.x);
        }).y(function(d) {
          return d.yNew;
        });
        layers = this.selectAll(".wk-chart-layer").data(_layout, function(d) {
          return d.key;
        });
        enter = layers.enter().append('g').attr('class', "wk-chart-layer");
        enter.append('path').attr('class', 'wk-chart-line').attr('d', function(d) {
          return lineNew(d.value);
        }).style('opacity', _initialOpacity).style('pointer-events', 'none');
        layers.select('.wk-chart-line').attr('transform', "translate(" + offset + ")").attr('d', function(d) {
          return lineOld(d.value);
        }).transition().duration(options.duration).attr('d', function(d) {
          return lineNew(d.value);
        }).style('stroke', function(d) {
          return d.color;
        }).style('opacity', 1).style('pointer-events', 'none');
        layers.exit().transition().duration(options.duration).style('opacity', 0).remove();
        layers.call(markers, options.duration);
        _initialOpacity = 0;
        _dataOld = data;
        return _pathValuesOld = _pathValuesNew;
      };
      brush = function(axis, idxRange) {
        var lines;
        lines = this.selectAll(".wk-chart-line");
        if (axis.isOrdinal()) {
          lines.attr('d', function(d) {
            return lineBrush(d.value.slice(idxRange[0], idxRange[1] + 1));
          });
        } else {
          lines.attr('d', function(d) {
            return lineBrush(d.value);
          });
        }
        return markers = this.selectAll('.wk-chart-marker').call(markersBrushed);
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('y').domainCalc('extent').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.x);
        _tooltip.on("enter." + _id, ttEnter);
        _tooltip.on("moveData." + _id, ttMoveData);
        return _tooltip.on("moveMarker." + _id, ttMoveMarker);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', brush);
      return attrs.$observe('markers', function(val) {
        if (val === '' || val === 'true') {
          _showMarkers = true;
        } else {
          _showMarkers = false;
        }
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name lineVertical
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('lineVertical', function($log, utils) {
  var lineCntr;
  lineCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var brush, brushStartIdx, draw, host, layerKeys, lineBrush, markers, markersBrushed, offset, prepData, ttEnter, ttMoveData, ttMoveMarker, _circles, _dataOld, _id, _layout, _pathArray, _pathValuesNew, _pathValuesOld, _scaleList, _showMarkers, _tooltip, _ttHighlight;
      host = controller.me;
      layerKeys = [];
      _layout = [];
      _dataOld = [];
      _pathValuesOld = [];
      _pathValuesNew = [];
      _pathArray = [];
      lineBrush = void 0;
      markersBrushed = void 0;
      brushStartIdx = 0;
      _tooltip = void 0;
      _ttHighlight = void 0;
      _circles = void 0;
      _showMarkers = false;
      _scaleList = {};
      offset = 0;
      _id = 'line' + lineCntr++;
      prepData = function(x, y, color) {};
      ttEnter = function(idx) {
        _pathArray = _.toArray(_pathValuesNew);
        return ttMoveData.apply(this, [idx]);
      };
      ttMoveData = function(idx) {
        var offs, ttLayers;
        offs = idx + brushStartIdx;
        ttLayers = _pathArray.map(function(l) {
          return {
            name: l[offs].key,
            value: _scaleList.x.formatValue(l[offs].xv),
            color: {
              'background-color': l[offs].color
            },
            yv: l[offs].yv
          };
        });
        this.headerName = _scaleList.y.axisLabel();
        this.headerValue = _scaleList.y.formatValue(ttLayers[0].yv);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        var o, offs;
        offs = idx + brushStartIdx;
        _circles = this.selectAll(".wk-chart-marker-" + _id).data(_pathArray, function(d) {
          return d[offs].key;
        });
        _circles.enter().append('circle').attr('class', "wk-chart-marker-" + _id).attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d[offs].color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cx', function(d) {
          return d[offs].x;
        });
        _circles.exit().remove();
        o = _scaleList.y.isOrdinal ? _scaleList.y.scale().rangeBand() / 2 : 0;
        return this.attr('transform', "translate(0," + (_scaleList.y.scale()(_pathArray[0][offs].yv) + o) + ")");
      };
      markers = function(layer, duration) {
        var m;
        if (_showMarkers) {
          m = layer.selectAll('.wk-chart-marker').data(function(l) {
            return l.value;
          }, function(d) {
            return d.y;
          });
          m.enter().append('circle').attr('class', 'wk-chart-marker wk-chart-selectable').attr('r', 5).style('pointer-events', 'none').style('opacity', 0).style('fill', function(d) {
            return d.color;
          });
          m.attr('cy', function(d) {
            return d.yOld + offset;
          }).attr('cx', function(d) {
            return d.xOld;
          }).classed('wk-chart-deleted', function(d) {
            return d.deleted;
          }).transition().duration(duration).attr('cy', function(d) {
            return d.yNew + offset;
          }).attr('cx', function(d) {
            return d.xNew;
          }).style('opacity', function(d) {
            if (d.deleted) {
              return 0;
            } else {
              return 1;
            }
          });
          return m.exit().remove();
        } else {
          return layer.selectAll('.wk-chart-marker').transition().duration(duration).style('opacity', 0).remove();
        }
      };
      draw = function(data, options, x, y, color) {
        var enter, i, key, layer, layers, lineNew, lineOld, mergedY, newFirst, oldFirst, v, val, _i, _j, _layerKeys, _len, _len1;
        if (y.isOrdinal()) {
          mergedY = utils.mergeSeriesUnsorted(y.value(_dataOld), y.value(data));
        } else {
          mergedY = utils.mergeSeriesSorted(y.value(_dataOld), y.value(data));
        }
        _layerKeys = x.layerKeys(data);
        _layout = [];
        _pathValuesNew = {};
        for (_i = 0, _len = _layerKeys.length; _i < _len; _i++) {
          key = _layerKeys[_i];
          _pathValuesNew[key] = data.map(function(d) {
            return {
              y: y.map(d),
              x: x.scale()(x.layerValue(d, key)),
              yv: y.value(d),
              xv: x.layerValue(d, key),
              key: key,
              color: color.scale()(key),
              data: d
            };
          });
          layer = {
            key: key,
            color: color.scale()(key),
            value: []
          };
          i = 0;
          while (i < mergedY.length) {
            if (mergedY[i][0] !== void 0) {
              oldFirst = _pathValuesOld[key][mergedY[i][0]];
              break;
            }
            i++;
          }
          while (i < mergedY.length) {
            if (mergedY[i][1] !== void 0) {
              newFirst = _pathValuesNew[key][mergedY[i][1]];
              break;
            }
            i++;
          }
          for (i = _j = 0, _len1 = mergedY.length; _j < _len1; i = ++_j) {
            val = mergedY[i];
            v = {
              color: layer.color,
              y: val[2]
            };
            if (val[1] === void 0) {
              v.yNew = newFirst.y;
              v.xNew = newFirst.x;
              v.deleted = true;
            } else {
              v.yNew = _pathValuesNew[key][val[1]].y;
              v.xNew = _pathValuesNew[key][val[1]].x;
              newFirst = _pathValuesNew[key][val[1]];
              v.deleted = false;
            }
            if (_dataOld.length > 0) {
              if (val[0] === void 0) {
                v.yOld = oldFirst.y;
                v.xOld = oldFirst.x;
              } else {
                v.yOld = _pathValuesOld[key][val[0]].y;
                v.xOld = _pathValuesOld[key][val[0]].x;
                oldFirst = _pathValuesOld[key][val[0]];
              }
            } else {
              v.xOld = v.xNew;
              v.yOld = v.yNew;
            }
            layer.value.push(v);
          }
          _layout.push(layer);
        }
        offset = y.isOrdinal() ? y.scale().rangeBand() / 2 : 0;
        markersBrushed = function(layer) {
          if (_showMarkers) {
            return layer.attr('cy', function(d) {
              null;
              return y.scale()(d.y) + (y.isOrdinal() ? y.scale().rangeBand() / 2 : 0);
            });
          }
        };
        if (_tooltip) {
          _tooltip.data(data);
        }
        lineOld = d3.svg.line().x(function(d) {
          return d.xOld;
        }).y(function(d) {
          return d.yOld;
        });
        lineNew = d3.svg.line().x(function(d) {
          return d.xNew;
        }).y(function(d) {
          return d.yNew;
        });
        lineBrush = d3.svg.line().x(function(d) {
          return d.xNew;
        }).y(function(d) {
          return y.scale()(d.y);
        });
        layers = this.selectAll(".wk-chart-layer").data(_layout, function(d) {
          return d.key;
        });
        enter = layers.enter().append('g').attr('class', "wk-chart-layer");
        enter.append('path').attr('class', 'wk-chart-line').style('stroke', function(d) {
          return d.color;
        }).style('opacity', 0).style('pointer-events', 'none');
        layers.select('.wk-chart-line').attr('transform', "translate(0," + offset + ")").attr('d', function(d) {
          return lineOld(d.value);
        }).transition().duration(options.duration).attr('d', function(d) {
          return lineNew(d.value);
        }).style('opacity', 1).style('pointer-events', 'none');
        layers.exit().transition().duration(options.duration).style('opacity', 0).remove();
        layers.call(markers, options.duration);
        _dataOld = data;
        return _pathValuesOld = _pathValuesNew;
      };
      brush = function(axis, idxRange) {
        var layers;
        layers = this.selectAll(".wk-chart-line");
        if (axis.isOrdinal()) {
          brushStartIdx = idxRange[0];
          layers.attr('d', function(d) {
            return lineBrush(d.value.slice(idxRange[0], idxRange[1] + 1));
          }).attr('transform', "translate(0," + (axis.scale().rangeBand() / 2) + ")");
        } else {
          layers.attr('d', function(d) {
            return lineBrush(d.value);
          });
        }
        return markers = this.selectAll('.wk-chart-marker').call(markersBrushed);
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('y').domainCalc('extent').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.y);
        _tooltip.on("enter." + _id, ttEnter);
        _tooltip.on("moveData." + _id, ttMoveData);
        return _tooltip.on("moveMarker." + _id, ttMoveMarker);
      });
      host.lifeCycle().on('drawChart', draw);
      host.lifeCycle().on('brushDraw', brush);
      return attrs.$observe('markers', function(val) {
        if (val === '' || val === 'true') {
          _showMarkers = true;
        } else {
          _showMarkers = false;
        }
        return host.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name pie
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires size
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('pie', function($log, utils) {
  var pieCntr;
  pieCntr = 0;
  return {
    restrict: 'EA',
    require: '^layout',
    link: function(scope, element, attrs, controller) {
      var draw, initialShow, inner, labels, layout, outer, pieBox, polyline, ttEnter, _id, _merge, _scaleList, _selected, _showLabels, _tooltip;
      layout = controller.me;
      _id = "pie" + (pieCntr++);
      inner = void 0;
      outer = void 0;
      labels = void 0;
      pieBox = void 0;
      polyline = void 0;
      _scaleList = [];
      _selected = void 0;
      _tooltip = void 0;
      _showLabels = false;
      _merge = utils.mergeData();
      ttEnter = function(data) {
        this.headerName = _scaleList.color.axisLabel();
        this.headerValue = _scaleList.size.axisLabel();
        return this.layers.push({
          name: _scaleList.color.formattedValue(data.data),
          value: _scaleList.size.formattedValue(data.data),
          color: {
            'background-color': _scaleList.color.map(data.data)
          }
        });
      };
      initialShow = true;
      draw = function(data, options, x, y, color, size) {
        var arcTween, innerArc, key, midAngle, outerArc, pie, r, segments;
        r = Math.min(options.width, options.height) / 2;
        if (!pieBox) {
          pieBox = this.append('g').attr('class', 'wk-chart-pieBox');
        }
        pieBox.attr('transform', "translate(" + (options.width / 2) + "," + (options.height / 2) + ")");
        innerArc = d3.svg.arc().outerRadius(r * (_showLabels ? 0.8 : 1)).innerRadius(0);
        outerArc = d3.svg.arc().outerRadius(r * 0.9).innerRadius(r * 0.9);
        key = function(d) {
          return _scaleList.color.value(d.data);
        };
        pie = d3.layout.pie().sort(null).value(size.value);
        arcTween = function(a) {
          var i;
          i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
            return innerArc(i(t));
          };
        };
        segments = pie(data);
        _merge.key(key);
        _merge(segments).first({
          startAngle: 0,
          endAngle: 0
        }).last({
          startAngle: Math.PI * 2,
          endAngle: Math.PI * 2
        });
        if (!inner) {
          inner = pieBox.selectAll('.wk-chart-innerArc');
        }
        inner = inner.data(segments, key);
        inner.enter().append('path').each(function(d) {
          return this._current = initialShow ? d : {
            startAngle: _merge.addedPred(d).endAngle,
            endAngle: _merge.addedPred(d).endAngle
          };
        }).attr('class', 'wk-chart-innerArc wk-chart-selectable').style('fill', function(d) {
          return color.map(d.data);
        }).style('opacity', initialShow ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        inner.transition().duration(options.duration).style('opacity', 1).attrTween('d', arcTween);
        inner.exit().datum(function(d) {
          return {
            startAngle: _merge.deletedSucc(d).startAngle,
            endAngle: _merge.deletedSucc(d).startAngle
          };
        }).transition().duration(options.duration).attrTween('d', arcTween).remove();
        midAngle = function(d) {
          return d.startAngle + (d.endAngle - d.startAngle) / 2;
        };
        if (_showLabels) {
          labels = pieBox.selectAll('.wk-chart-data-label').data(segments, key);
          labels.enter().append('text').attr('class', 'wk-chart-data-label').each(function(d) {
            return this._current = d;
          }).attr("dy", ".35em").style('font-size', '1.3em').style('opacity', 0).text(function(d) {
            return size.formattedValue(d.data);
          });
          labels.transition().duration(options.duration).style('opacity', 1).attrTween('transform', function(d) {
            var interpolate, _this;
            _this = this;
            interpolate = d3.interpolate(_this._current, d);
            return function(t) {
              var d2, pos;
              d2 = interpolate(t);
              _this._current = d2;
              pos = outerArc.centroid(d2);
              pos[0] += 15 * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate(" + pos + ")";
            };
          }).styleTween('text-anchor', function(d) {
            var interpolate;
            interpolate = d3.interpolate(this._current, d);
            return function(t) {
              var d2;
              d2 = interpolate(t);
              if (midAngle(d2) < Math.PI) {
                return "start";
              } else {
                return "end";
              }
            };
          });
          labels.exit().transition().duration(options.duration).style('opacity', 0).remove();
          polyline = pieBox.selectAll(".wk-chart-polyline").data(segments, key);
          polyline.enter().append("polyline").attr('class', 'wk-chart-polyline').style("opacity", 0).each(function(d) {
            return this._current = d;
          });
          polyline.transition().duration(options.duration).style("opacity", function(d) {
            if (d.data.value === 0) {
              return 0;
            } else {
              return .5;
            }
          }).attrTween("points", function(d) {
            var interpolate, _this;
            this._current = this._current;
            interpolate = d3.interpolate(this._current, d);
            _this = this;
            return function(t) {
              var d2, pos;
              d2 = interpolate(t);
              _this._current = d2;
              pos = outerArc.centroid(d2);
              pos[0] += 10 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
            };
          });
          polyline.exit().transition().duration(options.duration).style('opacity', 0).remove();
        } else {
          pieBox.selectAll('.wk-chart-polyline').remove();
          pieBox.selectAll('.wk-chart-data-label').remove();
        }
        return initialShow = false;
      };
      layout.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['size', 'color']);
        _scaleList.color.scaleType('category20');
        _tooltip = layout.behavior().tooltip;
        _selected = layout.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      layout.lifeCycle().on('drawChart', draw);
      return attrs.$observe('labels', function(val) {
        if (val === 'false') {
          _showLabels = false;
        } else if (val === 'true' || val === "") {
          _showLabels = true;
        }
        return layout.lifeCycle().update();
      });
    }
  };
});


/**
  @ngdoc layout
  @name scatter
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires size
  @requires shape
  @requires layout
 */
angular.module('wk.chart').directive('scatter', function($log, utils) {
  var scatterCnt;
  scatterCnt = 0;
  return {
    restrict: 'A',
    require: '^layout',
    link: function(scope, element, attrs, controller) {
      var draw, initialShow, layout, ttEnter, _id, _scaleList, _selected, _tooltip;
      layout = controller.me;
      _tooltip = void 0;
      _selected = void 0;
      _id = 'scatter' + scatterCnt++;
      _scaleList = [];
      ttEnter = function(data) {
        var sName, scale, _results;
        _results = [];
        for (sName in _scaleList) {
          scale = _scaleList[sName];
          _results.push(this.layers.push({
            name: scale.axisLabel(),
            value: scale.formattedValue(data),
            color: sName === 'color' ? {
              'background-color': scale.map(data)
            } : void 0,
            path: sName === 'shape' ? d3.svg.symbol().type(scale.map(data)).size(80)() : void 0,
            "class": sName === 'shape' ? 'wk-chart-tt-svg-shape' : ''
          }));
        }
        return _results;
      };
      initialShow = true;
      draw = function(data, options, x, y, color, size, shape) {
        var init, points;
        init = function(s) {
          if (initialShow) {
            s.style('fill', color.map).attr('transform', function(d) {
              return "translate(" + (x.map(d)) + "," + (y.map(d)) + ")";
            }).style('opacity', 1);
          }
          return initialShow = false;
        };
        points = this.selectAll('.wk-chart-points').data(data);
        points.enter().append('path').attr('class', 'wk-chart-points wk-chart-selectable').attr('transform', function(d) {
          return "translate(" + (x.map(d)) + "," + (y.map(d)) + ")";
        }).call(init).call(_tooltip.tooltip).call(_selected);
        points.transition().duration(options.duration).attr('d', d3.svg.symbol().type(function(d) {
          return shape.map(d);
        }).size(function(d) {
          return size.map(d) * size.map(d);
        })).style('fill', color.map).attr('transform', function(d) {
          return "translate(" + (x.map(d)) + "," + (y.map(d)) + ")";
        }).style('opacity', 1);
        return points.exit().remove();
      };
      layout.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color', 'size', 'shape']);
        this.getKind('y').domainCalc('extent').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = layout.behavior().tooltip;
        _selected = layout.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      return layout.lifeCycle().on('drawChart', draw);
    }
  };
});


/**
  @ngdoc layout
  @name spider
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout
 */
angular.module('wk.chart').directive('spider', function($log, utils) {
  var spiderCntr;
  spiderCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var axis, draw, layout, ttEnter, _data, _id, _scaleList, _tooltip;
      layout = controller.me;
      _tooltip = void 0;
      _scaleList = {};
      _id = 'spider' + spiderCntr++;
      axis = d3.svg.axis();
      _data = void 0;
      ttEnter = function(data) {
        return this.layers = _data.map(function(d) {
          return {
            name: _scaleList.x.value(d),
            value: _scaleList.y.formatValue(d[data]),
            color: {
              'background-color': _scaleList.color.scale()(data)
            }
          };
        });
      };
      draw = function(data, options, x, y, color) {
        var arc, axisG, axisLabels, centerX, centerY, dataLine, dataPath, degr, lines, nbrAxis, radius, textOffs, tickLine, tickPath, ticks;
        _data = data;
        $log.log(data);
        centerX = options.width / 2;
        centerY = options.height / 2;
        radius = d3.min([centerX, centerY]) * 0.8;
        textOffs = 20;
        nbrAxis = data.length;
        arc = Math.PI * 2 / nbrAxis;
        degr = 360 / nbrAxis;
        axisG = this.select('.wk-chart-axis');
        if (axisG.empty()) {
          axisG = this.append('g').attr('class', 'wk-chart-axis');
        }
        ticks = y.scale().ticks(y.ticks());
        y.scale().range([radius, 0]);
        axis.scale(y.scale()).orient('right').tickValues(ticks).tickFormat(y.tickFormat());
        axisG.call(axis).attr('transform', "translate(" + centerX + "," + (centerY - radius) + ")");
        y.scale().range([0, radius]);
        lines = this.selectAll('.wk-chart-axis-line').data(data, function(d) {
          return d.axis;
        });
        lines.enter().append('line').attr('class', 'wk-chart-axis-line').style('stroke', 'darkgrey');
        lines.attr({
          x1: 0,
          y1: 0,
          x2: 0,
          y2: radius
        }).attr('transform', function(d, i) {
          return "translate(" + centerX + ", " + centerY + ")rotate(" + (degr * i) + ")";
        });
        lines.exit().remove();
        tickLine = d3.svg.line().x(function(d) {
          return d.x;
        }).y(function(d) {
          return d.y;
        });
        tickPath = this.selectAll('.wk-chart-tickPath').data(ticks);
        tickPath.enter().append('path').attr('class', 'wk-chart-tickPath').style('fill', 'none').style('stroke', 'lightgrey');
        tickPath.attr('d', function(d) {
          var p;
          p = data.map(function(a, i) {
            return {
              x: Math.sin(arc * i) * y.scale()(d),
              y: Math.cos(arc * i) * y.scale()(d)
            };
          });
          return tickLine(p) + 'Z';
        }).attr('transform', "translate(" + centerX + ", " + centerY + ")");
        tickPath.exit().remove();
        axisLabels = this.selectAll('.wk-chart-axis-text').data(data, function(d) {
          return x.value(d);
        });
        axisLabels.enter().append('text').attr('class', 'wk-chart-axis-text').style('fill', 'black').attr('dy', '0.8em').attr('text-anchor', 'middle');
        axisLabels.attr({
          x: function(d, i) {
            return centerX + Math.sin(arc * i) * (radius + textOffs);
          },
          y: function(d, i) {
            return centerY + Math.cos(arc * i) * (radius + textOffs);
          }
        }).text(function(d) {
          return x.value(d);
        });
        dataPath = d3.svg.line().x(function(d) {
          return d.x;
        }).y(function(d) {
          return d.y;
        });
        dataLine = this.selectAll('.wk-chart-data-line').data(y.layerKeys(data));
        dataLine.enter().append('path').attr('class', 'wk-chart-data-line').style({
          stroke: function(d) {
            return color.scale()(d);
          },
          fill: function(d) {
            return color.scale()(d);
          },
          'fill-opacity': 0.2,
          'stroke-width': 2
        }).call(_tooltip.tooltip);
        return dataLine.attr('d', function(d) {
          var p;
          p = data.map(function(a, i) {
            return {
              x: Math.sin(arc * i) * y.scale()(a[d]),
              y: Math.cos(arc * i) * y.scale()(a[d])
            };
          });
          return dataPath(p) + 'Z';
        }).attr('transform', "translate(" + centerX + ", " + centerY + ")");
      };
      layout.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        _scaleList.y.domainCalc('max');
        _scaleList.x.resetOnNewData(true);
        _tooltip = layout.behavior().tooltip;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      return layout.lifeCycle().on('drawChart', draw);
    }
  };
});

angular.module('wk.chart').factory('behaviorBrush', function($log, $window, selectionSharing, timing) {
  var behaviorBrush;
  behaviorBrush = function() {
    var bottom, brushEnd, brushMove, brushStart, getSelectedObjects, left, me, positionBrushElements, resizeExtent, right, setSelection, startBottom, startLeft, startRight, startTop, top, _active, _area, _areaBox, _areaSelection, _backgroundBox, _boundsDomain, _boundsIdx, _boundsValues, _brushEvents, _brushGroup, _brushX, _brushXY, _brushY, _chart, _container, _data, _evTargetData, _extent, _overlay, _selectables, _startPos, _tooltip, _x, _y;
    me = function() {};
    _active = false;
    _overlay = void 0;
    _extent = void 0;
    _startPos = void 0;
    _evTargetData = void 0;
    _area = void 0;
    _chart = void 0;
    _data = void 0;
    _areaSelection = void 0;
    _areaBox = void 0;
    _backgroundBox = void 0;
    _container = void 0;
    _selectables = void 0;
    _brushGroup = void 0;
    _x = void 0;
    _y = void 0;
    _tooltip = void 0;
    _brushXY = false;
    _brushX = false;
    _brushY = false;
    _boundsIdx = void 0;
    _boundsValues = void 0;
    _boundsDomain = void 0;
    _brushEvents = d3.dispatch('brushStart', 'brush', 'brushEnd');
    left = top = right = bottom = startTop = startLeft = startRight = startBottom = void 0;
    positionBrushElements = function(left, right, top, bottom) {
      var height, width;
      width = right - left;
      height = bottom - top;
      if (_brushXY) {
        _overlay.selectAll('.wk-chart-n').attr('transform', "translate(" + left + "," + top + ")").select('rect').attr('width', width);
        _overlay.selectAll('.wk-chart-s').attr('transform', "translate(" + left + "," + bottom + ")").select('rect').attr('width', width);
        _overlay.selectAll('.wk-chart-w').attr('transform', "translate(" + left + "," + top + ")").select('rect').attr('height', height);
        _overlay.selectAll('.wk-chart-e').attr('transform', "translate(" + right + "," + top + ")").select('rect').attr('height', height);
        _overlay.selectAll('.wk-chart-ne').attr('transform', "translate(" + right + "," + top + ")");
        _overlay.selectAll('.wk-chart-nw').attr('transform', "translate(" + left + "," + top + ")");
        _overlay.selectAll('.wk-chart-se').attr('transform', "translate(" + right + "," + bottom + ")");
        _overlay.selectAll('.wk-chart-sw').attr('transform', "translate(" + left + "," + bottom + ")");
        _extent.attr('width', width).attr('height', height).attr('x', left).attr('y', top);
      }
      if (_brushX) {
        _overlay.selectAll('.wk-chart-w').attr('transform', "translate(" + left + ",0)").select('rect').attr('height', height);
        _overlay.selectAll('.wk-chart-e').attr('transform', "translate(" + right + ",0)").select('rect').attr('height', height);
        _overlay.selectAll('.wk-chart-e').select('rect').attr('height', _areaBox.height);
        _overlay.selectAll('.wk-chart-w').select('rect').attr('height', _areaBox.height);
        _extent.attr('width', width).attr('height', _areaBox.height).attr('x', left).attr('y', 0);
      }
      if (_brushY) {
        _overlay.selectAll('.wk-chart-n').attr('transform', "translate(0," + top + ")").select('rect').attr('width', width);
        _overlay.selectAll('.wk-chart-s').attr('transform', "translate(0," + bottom + ")").select('rect').attr('width', width);
        _overlay.selectAll('.wk-chart-n').select('rect').attr('width', _areaBox.width);
        _overlay.selectAll('.wk-chart-s').select('rect').attr('width', _areaBox.width);
        return _extent.attr('width', _areaBox.width).attr('height', height).attr('x', 0).attr('y', top);
      }
    };
    getSelectedObjects = function() {
      var er;
      er = _extent.node().getBoundingClientRect();
      _selectables.each(function(d) {
        var cr, xHit, yHit;
        cr = this.getBoundingClientRect();
        xHit = er.left < cr.right - cr.width / 3 && cr.left + cr.width / 3 < er.right;
        yHit = er.top < cr.bottom - cr.height / 3 && cr.top + cr.height / 3 < er.bottom;
        return d3.select(this).classed('wk-chart-selected', yHit && xHit);
      });
      return _container.selectAll('.wk-chart-selected').data();
    };
    setSelection = function(left, right, top, bottom) {
      var step;
      if (_brushX) {
        _boundsIdx = [me.x().invert(left), me.x().invert(right)];
        if (me.x().isOrdinal()) {
          _boundsValues = _data.map(function(d) {
            return me.x().value(d);
          }).slice(_boundsIdx[0], _boundsIdx[1] + 1);
        } else {
          if (me.x().kind() === 'rangeX') {
            if (me.x().upperProperty()) {
              _boundsValues = [me.x().lowerValue(_data[_boundsIdx[0]]), me.x().upperValue(_data[_boundsIdx[1]])];
            } else {
              step = me.x().lowerValue(_data[1]) - me.x().lowerValue(_data[0]);
              _boundsValues = [me.x().lowerValue(_data[_boundsIdx[0]]), me.x().lowerValue(_data[_boundsIdx[1]]) + step];
            }
          } else {
            _boundsValues = [me.x().value(_data[_boundsIdx[0]]), me.x().value(_data[_boundsIdx[1]])];
          }
        }
        _boundsDomain = _data.slice(_boundsIdx[0], _boundsIdx[1] + 1);
      }
      if (_brushY) {
        _boundsIdx = [me.y().invert(bottom), me.y().invert(top)];
        if (me.y().isOrdinal()) {
          _boundsValues = _data.map(function(d) {
            return me.y().value(d);
          }).slice(_boundsIdx[0], _boundsIdx[1] + 1);
        } else {
          if (me.y().kind() === 'rangeY') {
            step = me.y().lowerValue(_data[1]) - me.y().lowerValue(_data[0]);
            _boundsValues = [me.y().lowerValue(_data[_boundsIdx[0]]), me.y().lowerValue(_data[_boundsIdx[1]]) + step];
          } else {
            _boundsValues = [me.y().value(_data[_boundsIdx[0]]), me.y().value(_data[_boundsIdx[1]])];
          }
        }
        _boundsDomain = _data.slice(_boundsIdx[0], _boundsIdx[1] + 1);
      }
      if (_brushXY) {
        _boundsIdx = [];
        _boundsValues = [];
        return _boundsDomain = getSelectedObjects();
      }
    };
    brushStart = function() {
      d3.event.preventDefault();
      _evTargetData = d3.select(d3.event.target).datum();
      _(!_evTargetData ? _evTargetData = {
        name: 'forwarded'
      } : void 0);
      _areaBox = _area.getBBox();
      _startPos = d3.mouse(_area);
      startTop = top;
      startLeft = left;
      startRight = right;
      startBottom = bottom;
      d3.select(_area).style('pointer-events', 'none').selectAll(".wk-chart-resize").style("display", null);
      d3.select('body').style('cursor', d3.select(d3.event.target).style('cursor'));
      d3.select($window).on('mousemove.brush', brushMove).on('mouseup.brush', brushEnd);
      _tooltip.hide(true);
      _boundsIdx = void 0;
      _selectables = _container.selectAll('.wk-chart-selectable');
      _brushEvents.brushStart();
      timing.clear();
      return timing.init();
    };
    brushEnd = function() {
      d3.select($window).on('mousemove.brush', null);
      d3.select($window).on('mouseup.brush', null);
      d3.select(_area).style('pointer-events', 'all').selectAll('.wk-chart-resize').style('display', null);
      d3.select('body').style('cursor', null);
      if (bottom - top === 0 || right - left === 0) {
        d3.select(_area).selectAll('.wk-chart-resize').style('display', 'none');
      }
      _tooltip.hide(false);
      _brushEvents.brushEnd(_boundsIdx);
      return timing.report();
    };
    brushMove = function() {
      var bottomMv, deltaX, deltaY, horMv, leftMv, pos, rightMv, topMv, vertMv;
      $log.info('brushmove');
      pos = d3.mouse(_area);
      deltaX = pos[0] - _startPos[0];
      deltaY = pos[1] - _startPos[1];
      leftMv = function(delta) {
        pos = startLeft + delta;
        left = pos >= 0 ? (pos < startRight ? pos : startRight) : 0;
        return right = pos <= _areaBox.width ? (pos < startRight ? startRight : pos) : _areaBox.width;
      };
      rightMv = function(delta) {
        pos = startRight + delta;
        left = pos >= 0 ? (pos < startLeft ? pos : startLeft) : 0;
        return right = pos <= _areaBox.width ? (pos < startLeft ? startLeft : pos) : _areaBox.width;
      };
      topMv = function(delta) {
        pos = startTop + delta;
        top = pos >= 0 ? (pos < startBottom ? pos : startBottom) : 0;
        return bottom = pos <= _areaBox.height ? (pos > startBottom ? pos : startBottom) : _areaBox.height;
      };
      bottomMv = function(delta) {
        pos = startBottom + delta;
        top = pos >= 0 ? (pos < startTop ? pos : startTop) : 0;
        return bottom = pos <= _areaBox.height ? (pos > startTop ? pos : startTop) : _areaBox.height;
      };
      horMv = function(delta) {
        if (startLeft + delta >= 0) {
          if (startRight + delta <= _areaBox.width) {
            left = startLeft + delta;
            return right = startRight + delta;
          } else {
            right = _areaBox.width;
            return left = _areaBox.width - (startRight - startLeft);
          }
        } else {
          left = 0;
          return right = startRight - startLeft;
        }
      };
      vertMv = function(delta) {
        if (startTop + delta >= 0) {
          if (startBottom + delta <= _areaBox.height) {
            top = startTop + delta;
            return bottom = startBottom + delta;
          } else {
            bottom = _areaBox.height;
            return top = _areaBox.height - (startBottom - startTop);
          }
        } else {
          top = 0;
          return bottom = startBottom - startTop;
        }
      };
      switch (_evTargetData.name) {
        case 'background':
        case 'forwarded':
          if (deltaX + _startPos[0] > 0) {
            left = deltaX < 0 ? _startPos[0] + deltaX : _startPos[0];
            if (left + Math.abs(deltaX) < _areaBox.width) {
              right = left + Math.abs(deltaX);
            } else {
              right = _areaBox.width;
            }
          } else {
            left = 0;
          }
          if (deltaY + _startPos[1] > 0) {
            top = deltaY < 0 ? _startPos[1] + deltaY : _startPos[1];
            if (top + Math.abs(deltaY) < _areaBox.height) {
              bottom = top + Math.abs(deltaY);
            } else {
              bottom = _areaBox.height;
            }
          } else {
            top = 0;
          }
          break;
        case 'extent':
          vertMv(deltaY);
          horMv(deltaX);
          break;
        case 'n':
          topMv(deltaY);
          break;
        case 's':
          bottomMv(deltaY);
          break;
        case 'w':
          leftMv(deltaX);
          break;
        case 'e':
          rightMv(deltaX);
          break;
        case 'nw':
          topMv(deltaY);
          leftMv(deltaX);
          break;
        case 'ne':
          topMv(deltaY);
          rightMv(deltaX);
          break;
        case 'sw':
          bottomMv(deltaY);
          leftMv(deltaX);
          break;
        case 'se':
          bottomMv(deltaY);
          rightMv(deltaX);
      }
      positionBrushElements(left, right, top, bottom);
      setSelection(left, right, top, bottom);
      _brushEvents.brush(_boundsIdx, _boundsValues, _boundsDomain);
      return selectionSharing.setSelection(_boundsValues, _boundsIdx, _brushGroup);
    };
    me.brush = function(s) {
      if (arguments.length === 0) {
        return _overlay;
      } else {
        if (!_active) {
          return;
        }
        _overlay = s;
        _brushXY = me.x() && me.y();
        _brushX = me.x() && !me.y();
        _brushY = me.y() && !me.x();
        s.style({
          'pointer-events': 'all',
          cursor: 'crosshair'
        });
        _extent = s.append('rect').attr({
          "class": 'wk-chart-extent',
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }).style('cursor', 'move').datum({
          name: 'extent'
        });
        if (_brushY || _brushXY) {
          s.append('g').attr('class', 'wk-chart-resize wk-chart-n').style({
            cursor: 'ns-resize',
            display: 'none'
          }).append('rect').attr({
            x: 0,
            y: -3,
            width: 0,
            height: 6
          }).datum({
            name: 'n'
          });
          s.append('g').attr('class', 'wk-chart-resize wk-chart-s').style({
            cursor: 'ns-resize',
            display: 'none'
          }).append('rect').attr({
            x: 0,
            y: -3,
            width: 0,
            height: 6
          }).datum({
            name: 's'
          });
        }
        if (_brushX || _brushXY) {
          s.append('g').attr('class', 'wk-chart-resize wk-chart-w').style({
            cursor: 'ew-resize',
            display: 'none'
          }).append('rect').attr({
            y: 0,
            x: -3,
            width: 6,
            height: 0
          }).datum({
            name: 'w'
          });
          s.append('g').attr('class', 'wk-chart-resize wk-chart-e').style({
            cursor: 'ew-resize',
            display: 'none'
          }).append('rect').attr({
            y: 0,
            x: -3,
            width: 6,
            height: 0
          }).datum({
            name: 'e'
          });
        }
        if (_brushXY) {
          s.append('g').attr('class', 'wk-chart-resize wk-chart-nw').style({
            cursor: 'nwse-resize',
            display: 'none'
          }).append('rect').attr({
            x: -3,
            y: -3,
            width: 6,
            height: 6
          }).datum({
            name: 'nw'
          });
          s.append('g').attr('class', 'wk-chart-resize wk-chart-ne').style({
            cursor: 'nesw-resize',
            display: 'none'
          }).append('rect').attr({
            x: -3,
            y: -3,
            width: 6,
            height: 6
          }).datum({
            name: 'ne'
          });
          s.append('g').attr('class', 'wk-chart-resize wk-chart-sw').style({
            cursor: 'nesw-resize',
            display: 'none'
          }).append('rect').attr({
            x: -3,
            y: -3,
            width: 6,
            height: 6
          }).datum({
            name: 'sw'
          });
          s.append('g').attr('class', 'wk-chart-resize wk-chart-se').style({
            cursor: 'nwse-resize',
            display: 'none'
          }).append('rect').attr({
            x: -3,
            y: -3,
            width: 6,
            height: 6
          }).datum({
            name: 'se'
          });
        }
        s.on('mousedown.brush', brushStart);
        return me;
      }
    };
    resizeExtent = function() {
      var horizontalRatio, newBox, verticalRatio;
      if (_areaBox) {
        $log.info('resizeHandler');
        newBox = _area.getBBox();
        horizontalRatio = _areaBox.width / newBox.width;
        verticalRatio = _areaBox.height / newBox.height;
        top = top / verticalRatio;
        startTop = startTop / verticalRatio;
        bottom = bottom / verticalRatio;
        startBottom = startBottom / verticalRatio;
        left = left / horizontalRatio;
        startLeft = startLeft / horizontalRatio;
        right = right / horizontalRatio;
        startRight = startRight / horizontalRatio;
        _startPos[0] = _startPos[0] / horizontalRatio;
        _startPos[1] = _startPos[1] / verticalRatio;
        _areaBox = newBox;
        return positionBrushElements(left, right, top, bottom);
      }
    };
    me.chart = function(val) {
      if (arguments.length === 0) {
        return _chart;
      } else {
        _chart = val;
        _chart.lifeCycle().on('resize.brush', resizeExtent);
        return me;
      }
    };
    me.active = function(val) {
      if (arguments.length === 0) {
        return _active;
      } else {
        _active = val;
        return me;
      }
    };
    me.x = function(val) {
      if (arguments.length === 0) {
        return _x;
      } else {
        _x = val;
        return me;
      }
    };
    me.y = function(val) {
      if (arguments.length === 0) {
        return _y;
      } else {
        _y = val;
        return me;
      }
    };
    me.area = function(val) {
      if (arguments.length === 0) {
        return _areaSelection;
      } else {
        if (!_areaSelection) {
          _areaSelection = val;
          _area = _areaSelection.node();
          me.brush(_areaSelection);
        }
        return me;
      }
    };
    me.container = function(val) {
      if (arguments.length === 0) {
        return _container;
      } else {
        _container = val;
        _selectables = _container.selectAll('.wk-chart-selectable');
        return me;
      }
    };
    me.data = function(val) {
      if (arguments.length === 0) {
        return _data;
      } else {
        _data = val;
        return me;
      }
    };
    me.brushGroup = function(val) {
      if (arguments.length === 0) {
        return _brushGroup;
      } else {
        _brushGroup = val;
        selectionSharing.createGroup(_brushGroup);
        return me;
      }
    };
    me.tooltip = function(val) {
      if (arguments.length === 0) {
        return _tooltip;
      } else {
        _tooltip = val;
        return me;
      }
    };
    me.on = function(name, callback) {
      return _brushEvents.on(name, callback);
    };
    me.extent = function() {
      return _boundsIdx;
    };
    me.events = function() {
      return _brushEvents;
    };
    me.empty = function() {
      return _boundsIdx === void 0;
    };
    return me;
  };
  return behaviorBrush;
});

angular.module('wk.chart').factory('behaviorSelect', function($log) {
  var select, selectId;
  selectId = 0;
  select = function() {
    var clicked, me, _active, _container, _id, _selectionEvents;
    _id = "select" + (selectId++);
    _container = void 0;
    _active = false;
    _selectionEvents = d3.dispatch('selected');
    clicked = function() {
      var allSelected, isSelected, obj;
      if (!_active) {
        return;
      }
      obj = d3.select(this);
      if (!_active) {
        return;
      }
      if (obj.classed('wk-chart-selectable')) {
        isSelected = obj.classed('wk-chart-selected');
        obj.classed('wk-chart-selected', !isSelected);
        allSelected = _container.selectAll('.wk-chart-selected').data().map(function(d) {
          if (d.data) {
            return d.data;
          } else {
            return d;
          }
        });
        return _selectionEvents.selected(allSelected);
      }
    };
    me = function(sel) {
      if (arguments.length === 0) {
        return me;
      } else {
        sel.on('click', clicked);
        return me;
      }
    };
    me.id = function() {
      return _id;
    };
    me.active = function(val) {
      if (arguments.length === 0) {
        return _active;
      } else {
        _active = val;
        return me;
      }
    };
    me.container = function(val) {
      if (arguments.length === 0) {
        return _container;
      } else {
        _container = val;
        return me;
      }
    };
    me.events = function() {
      return _selectionEvents;
    };
    me.on = function(name, callback) {
      _selectionEvents.on(name, callback);
      return me;
    };
    return me;
  };
  return select;
});

angular.module('wk.chart').factory('behaviorTooltip', function($log, $document, $rootScope, $compile, $templateCache, templateDir) {
  var behaviorTooltip;
  behaviorTooltip = function() {
    var body, bodyRect, forwardToBrush, me, positionBox, positionInitial, tooltipEnter, tooltipLeave, tooltipMove, _active, _area, _areaSelection, _compiledTempl, _container, _data, _hide, _markerG, _markerLine, _markerScale, _path, _showMarkerLine, _templ, _templScope, _tooltipDispatch;
    _active = false;
    _path = '';
    _hide = false;
    _showMarkerLine = void 0;
    _markerG = void 0;
    _markerLine = void 0;
    _areaSelection = void 0;
    _area = void 0;
    _container = void 0;
    _markerScale = void 0;
    _data = void 0;
    _tooltipDispatch = d3.dispatch('enter', 'moveData', 'moveMarker', 'leave');
    _templ = $templateCache.get(templateDir + 'toolTip.html');
    _templScope = $rootScope.$new(true);
    _compiledTempl = $compile(_templ)(_templScope);
    body = $document.find('body');
    bodyRect = body[0].getBoundingClientRect();
    me = function() {};
    positionBox = function() {
      var clientX, clientY, rect;
      rect = _compiledTempl[0].getBoundingClientRect();
      clientX = bodyRect.right - 20 > d3.event.clientX + rect.width + 10 ? d3.event.clientX + 10 : d3.event.clientX - rect.width - 10;
      clientY = bodyRect.bottom - 20 > d3.event.clientY + rect.height + 10 ? d3.event.clientY + 10 : d3.event.clientY - rect.height - 10;
      _templScope.position = {
        position: 'absolute',
        left: clientX + 'px',
        top: clientY + 'px',
        'z-index': 1500,
        opacity: 1
      };
      return _templScope.$apply();
    };
    positionInitial = function() {
      _templScope.position = {
        position: 'absolute',
        left: 0 + 'px',
        top: 0 + 'px',
        'z-index': 1500,
        opacity: 0
      };
      _templScope.$apply();
      return _.throttle(positionBox, 200);
    };
    tooltipEnter = function() {
      var value, _areaBox, _pos;
      if (!_active || _hide) {
        return;
      }
      body.append(_compiledTempl);
      _templScope.layers = [];
      if (_showMarkerLine) {
        _pos = d3.mouse(this);
        value = _markerScale.invert(_markerScale.isHorizontal() ? _pos[0] : _pos[1]);
        _templScope.ttData = me.data()[value];
      } else {
        value = d3.select(this).datum();
        _templScope.ttData = value.data ? value.data : value;
      }
      _templScope.ttShow = true;
      _tooltipDispatch.enter.apply(_templScope, [value]);
      positionInitial();
      if (_showMarkerLine) {
        _areaBox = _areaSelection.select('.wk-chart-background').node().getBBox();
        _pos = d3.mouse(_area);
        _markerG = _container.append('g').attr('class', 'wk-chart-tooltip-marker');
        _markerLine = _markerG.append('line');
        if (_markerScale.isHorizontal()) {
          _markerLine.attr({
            "class": 'wk-chart-marker-line',
            x0: 0,
            x1: 0,
            y0: 0,
            y1: _areaBox.height
          });
        } else {
          _markerLine.attr({
            "class": 'wk-chart-marker-line',
            x0: 0,
            x1: _areaBox.width,
            y0: 0,
            y1: 0
          });
        }
        _markerLine.style({
          stroke: 'darkgrey',
          'pointer-events': 'none'
        });
        return _tooltipDispatch.moveMarker.apply(_markerG, [value]);
      }
    };
    tooltipMove = function() {
      var dataIdx, _pos;
      if (!_active || _hide) {
        return;
      }
      _pos = d3.mouse(_area);
      positionBox();
      if (_showMarkerLine) {
        dataIdx = _markerScale.invert(_markerScale.isHorizontal() ? _pos[0] : _pos[1]);
        _tooltipDispatch.moveMarker.apply(_markerG, [dataIdx]);
        _templScope.layers = [];
        _templScope.ttData = me.data()[dataIdx];
        _tooltipDispatch.moveData.apply(_templScope, [dataIdx]);
      }
      return _templScope.$apply();
    };
    tooltipLeave = function() {
      if (_markerG) {
        _markerG.remove();
      }
      _markerG = void 0;
      _templScope.ttShow = false;
      return _compiledTempl.remove();
    };
    forwardToBrush = function(e) {
      var brush_elm, new_click_event;
      brush_elm = d3.select(_container.node().parentElement).select(".wk-chart-overlay").node();
      if (d3.event.target !== brush_elm) {
        new_click_event = new Event('mousedown');
        new_click_event.pageX = d3.event.pageX;
        new_click_event.clientX = d3.event.clientX;
        new_click_event.pageY = d3.event.pageY;
        new_click_event.clientY = d3.event.clientY;
        return brush_elm.dispatchEvent(new_click_event);
      }
    };
    me.hide = function(val) {
      if (arguments.length === 0) {
        return _hide;
      } else {
        _hide = val;
        if (_markerG) {
          _markerG.style('visibility', _hide ? 'hidden' : 'visible');
        }
        _templScope.ttShow = !_hide;
        _templScope.$apply();
        return me;
      }
    };
    me.active = function(val) {
      if (arguments.length === 0) {
        return _active;
      } else {
        _active = val;
        return me;
      }
    };
    me.template = function(path) {
      var _customTempl, _customTemplWrapped;
      if (arguments === 0) {
        return _path;
      } else {
        _path = path;
        if (_path.length > 0) {
          _customTempl = $templateCache.get('templates/' + _path);
          _customTemplWrapped = "<div class=\"wk-chart-tooltip\" ng-show=\"ttShow\" ng-style=\"position\">" + _customTempl + "</div>";
          _compiledTempl = $compile(_customTemplWrapped)(_templScope);
        }
        return me;
      }
    };
    me.area = function(val) {
      if (arguments.length === 0) {
        return _areaSelection;
      } else {
        _areaSelection = val;
        _area = _areaSelection.node();
        if (_showMarkerLine) {
          me.tooltip(_areaSelection);
        }
        return me;
      }
    };
    me.container = function(val) {
      if (arguments.length === 0) {
        return _container;
      } else {
        _container = val;
        return me;
      }
    };
    me.markerScale = function(val) {
      if (arguments.length === 0) {
        return _markerScale;
      } else {
        if (val) {
          _showMarkerLine = true;
          _markerScale = val;
        } else {
          _showMarkerLine = false;
        }
        return me;
      }
    };
    me.data = function(val) {
      if (arguments.length === 0) {
        return _data;
      } else {
        _data = val;
        return me;
      }
    };
    me.on = function(name, callback) {
      return _tooltipDispatch.on(name, callback);
    };
    me.tooltip = function(s) {
      if (arguments.length === 0) {
        return me;
      } else {
        s.on('mouseenter.tooltip', tooltipEnter).on('mousemove.tooltip', tooltipMove).on('mouseleave.tooltip', tooltipLeave);
        if (!s.empty() && !s.classed('wk-chart-overlay')) {
          return s.on('mousedown.tooltip', forwardToBrush);
        }
      }
    };
    return me;
  };
  return behaviorTooltip;
});

angular.module('wk.chart').factory('behavior', function($log, $window, behaviorTooltip, behaviorBrush, behaviorSelect) {
  var behavior;
  behavior = function() {
    var area, chart, container, _brush, _selection, _tooltip;
    _tooltip = behaviorTooltip();
    _brush = behaviorBrush();
    _selection = behaviorSelect();
    _brush.tooltip(_tooltip);
    area = function(area) {
      _brush.area(area);
      return _tooltip.area(area);
    };
    container = function(container) {
      _brush.container(container);
      _selection.container(container);
      return _tooltip.container(container);
    };
    chart = function(chart) {
      return _brush.chart(chart);
    };
    return {
      tooltip: _tooltip,
      brush: _brush,
      selected: _selection,
      overlay: area,
      container: container,
      chart: chart
    };
  };
  return behavior;
});

angular.module('wk.chart').factory('chart', function($log, scaleList, container, behavior, d3Animation) {
  var chart, chartCntr;
  chartCntr = 0;
  chart = function() {
    var debounced, lifecycleFull, me, _allScales, _animationDuration, _behavior, _brush, _container, _data, _id, _layouts, _lifeCycle, _ownedScales, _showTooltip, _subTitle, _title, _toolTipTemplate;
    _id = "chart" + (chartCntr++);
    me = function() {};
    _layouts = [];
    _container = void 0;
    _allScales = void 0;
    _ownedScales = void 0;
    _data = void 0;
    _showTooltip = false;
    _toolTipTemplate = '';
    _title = void 0;
    _subTitle = void 0;
    _behavior = behavior();
    _animationDuration = d3Animation.duration;
    _lifeCycle = d3.dispatch('configure', 'resize', 'prepareData', 'scaleDomains', 'sizeContainer', 'drawAxis', 'drawChart', 'newData', 'update', 'updateAttrs', 'scopeApply');
    _brush = d3.dispatch('draw', 'change');
    me.id = function(id) {
      return _id;
    };
    me.showTooltip = function(trueFalse) {
      if (arguments.length === 0) {
        return _showTooltip;
      } else {
        _showTooltip = trueFalse;
        _behavior.tooltip.active(_showTooltip);
        return me;
      }
    };
    me.toolTipTemplate = function(path) {
      if (arguments.length === 0) {
        return _toolTipTemplate;
      } else {
        _toolTipTemplate = path;
        _behavior.tooltip.template(path);
        return me;
      }
    };
    me.title = function(val) {
      if (arguments.length === 0) {
        return _title;
      } else {
        _title = val;
        return me;
      }
    };
    me.subTitle = function(val) {
      if (arguments.length === 0) {
        return _subTitle;
      } else {
        _subTitle = val;
        return me;
      }
    };
    me.addLayout = function(layout) {
      if (arguments.length === 0) {
        return _layouts;
      } else {
        _layouts.push(layout);
        return me;
      }
    };
    me.addScale = function(scale, layout) {
      _allScales.add(scale);
      if (layout) {
        layout.scales().add(scale);
      } else {
        _ownedScales.add(scale);
      }
      return me;
    };
    me.animationDuration = function(val) {
      if (arguments.length === 0) {
        return _animationDuration;
      } else {
        _animationDuration = val;
        return me;
      }
    };
    me.lifeCycle = function(val) {
      return _lifeCycle;
    };
    me.layouts = function() {
      return _layouts;
    };
    me.scales = function() {
      return _ownedScales;
    };
    me.allScales = function() {
      return _allScales;
    };
    me.hasScale = function(scale) {
      return !!_allScales.has(scale);
    };
    me.container = function() {
      return _container;
    };
    me.brush = function() {
      return _brush;
    };
    me.getData = function() {
      return _data;
    };
    me.behavior = function() {
      return _behavior;
    };
    lifecycleFull = function(data, noAnimation) {
      if (data) {
        $log.log('executing full life cycle');
        _data = data;
        _lifeCycle.prepareData(data, noAnimation);
        _lifeCycle.scaleDomains(data, noAnimation);
        _lifeCycle.sizeContainer(data, noAnimation);
        _lifeCycle.drawAxis(noAnimation);
        _lifeCycle.drawChart(data, noAnimation);
        return _lifeCycle.scopeApply();
      }
    };
    debounced = _.debounce(lifecycleFull, 100);
    me.execLifeCycleFull = debounced;
    me.resizeLifeCycle = function(noAnimation) {
      if (_data) {
        $log.log('executing resize life cycle');
        _lifeCycle.sizeContainer(_data, noAnimation);
        _lifeCycle.drawAxis(noAnimation);
        _lifeCycle.drawChart(_data, noAnimation);
        return _lifeCycle.scopeApply();
      }
    };
    me.newDataLifeCycle = function(data, noAnimation) {
      if (data) {
        $log.log('executing new data life cycle');
        _data = data;
        _lifeCycle.prepareData(data, noAnimation);
        _lifeCycle.scaleDomains(data, noAnimation);
        _lifeCycle.drawAxis(noAnimation);
        return _lifeCycle.drawChart(data, noAnimation);
      }
    };
    me.attributeChange = function(noAnimation) {
      if (_data) {
        $log.log('executing attribute change life cycle');
        _lifeCycle.sizeContainer(_data, noAnimation);
        _lifeCycle.drawAxis(noAnimation);
        return _lifeCycle.drawChart(_data, noAnimation);
      }
    };
    me.brushExtentChanged = function() {
      if (_data) {
        _lifeCycle.drawAxis(true);
        return _lifeCycle.drawChart(_data, true);
      }
    };
    me.lifeCycle().on('newData.chart', me.execLifeCycleFull);
    me.lifeCycle().on('resize.chart', me.resizeLifeCycle);
    me.lifeCycle().on('update.chart', function(noAnimation) {
      return me.execLifeCycleFull(_data, noAnimation);
    });
    me.lifeCycle().on('updateAttrs', me.attributeChange);
    _behavior.chart(me);
    _container = container().chart(me);
    _allScales = scaleList();
    _ownedScales = scaleList();
    return me;
  };
  return chart;
});

angular.module('wk.chart').factory('container', function($log, $window, wkChartMargins, scaleList, axisConfig, d3Animation, behavior) {
  var container, containerCnt;
  containerCnt = 0;
  container = function() {
    var drawAndPositionText, drawAxis, drawGrid, drawTitleArea, getAxisRect, me, measureText, _behavior, _chart, _chartArea, _container, _containerId, _data, _duration, _element, _elementSelection, _genChartFrame, _innerHeight, _innerWidth, _layouts, _legends, _margin, _overlay, _removeAxis, _removeLabel, _spacedContainer, _svg, _titleHeight;
    me = function() {};
    _containerId = 'cntnr' + containerCnt++;
    _chart = void 0;
    _element = void 0;
    _elementSelection = void 0;
    _layouts = [];
    _legends = [];
    _svg = void 0;
    _container = void 0;
    _spacedContainer = void 0;
    _chartArea = void 0;
    _chartArea = void 0;
    _margin = angular.copy(wkChartMargins["default"]);
    _innerWidth = 0;
    _innerHeight = 0;
    _titleHeight = 0;
    _data = void 0;
    _overlay = void 0;
    _behavior = void 0;
    _duration = 0;
    me.id = function() {
      return _containerId;
    };
    me.chart = function(chart) {
      if (arguments.length === 0) {
        return _chart;
      } else {
        _chart = chart;
        _chart.lifeCycle().on("sizeContainer." + (me.id()), me.drawChartFrame);
        return me;
      }
    };
    me.element = function(elem) {
      var resizeTarget, _resizeHandler;
      if (arguments.length === 0) {
        return _element;
      } else {
        _resizeHandler = function() {
          return me.chart().lifeCycle().resize(true);
        };
        _element = elem;
        _elementSelection = d3.select(_element);
        if (_elementSelection.empty()) {
          $log.error("Error: Element " + _element + " does not exist");
        } else {
          _genChartFrame();
          resizeTarget = _elementSelection.select('.wk-chart').node();
          new ResizeSensor(resizeTarget, _resizeHandler);
        }
        return me;
      }
    };
    me.addLayout = function(layout) {
      _layouts.push(layout);
      return me;
    };
    me.height = function() {
      return _innerHeight;
    };
    me.width = function() {
      return _innerWidth;
    };
    me.margins = function() {
      return _margin;
    };
    me.getChartArea = function() {
      return _chartArea;
    };
    me.getOverlay = function() {
      return _overlay;
    };
    me.getContainer = function() {
      return _spacedContainer;
    };
    drawAndPositionText = function(container, text, selector, fontSize, offset) {
      var elem;
      elem = container.select('.' + selector);
      if (elem.empty()) {
        elem = container.append('text').attr({
          "class": selector,
          'text-anchor': 'middle',
          y: offset ? offset : 0
        }).style('font-size', fontSize);
      }
      elem.text(text);
      return elem.node().getBBox().height;
    };
    drawTitleArea = function(title, subTitle) {
      var area, titleAreaHeight;
      titleAreaHeight = 0;
      area = _container.select('.wk-chart-title-area');
      if (area.empty()) {
        area = _container.append('g').attr('class', 'wk-chart-title-area wk-center-hor');
      }
      if (title) {
        _titleHeight = drawAndPositionText(area, title, 'wk-chart-title', '2em');
      }
      if (subTitle) {
        drawAndPositionText(area, subTitle, 'wk-chart-subtitle', '1.8em', _titleHeight);
      }
      return area.node().getBBox().height;
    };
    measureText = function(textList, container, textClasses) {
      var bounds, measureContainer, t, _i, _len;
      measureContainer = container.append('g');
      for (_i = 0, _len = textList.length; _i < _len; _i++) {
        t = textList[_i];
        measureContainer.append('text').attr({
          'class': textClasses
        }).text(t);
      }
      bounds = measureContainer.node().getBBox();
      measureContainer.remove();
      return bounds;
    };
    getAxisRect = function(dim) {
      var axis, box;
      axis = _container.append('g');
      dim.range([0, 500]);
      axis.call(dim.axis());
      if (dim.rotateTickLabels()) {
        axis.selectAll("text").attr({
          dy: '0.35em'
        }).attr('transform', "rotate(" + (dim.rotateTickLabels()) + ", 0, " + (dim.axisOrient() === 'bottom' ? 10 : -10) + ")").style('text-anchor', dim.axisOrient() === 'bottom' ? 'end' : 'start');
      }
      box = axis.node().getBBox();
      axis.remove();
      return box;
    };
    drawAxis = function(dim) {
      var axis;
      axis = _container.select(".wk-chart-axis.wk-chart-" + (dim.axisOrient()));
      if (axis.empty()) {
        axis = _container.append('g').attr('class', 'wk-chart-axis wk-chart-' + dim.axisOrient());
      }
      axis.transition().duration(_duration).call(dim.axis());
      if (dim.rotateTickLabels()) {
        return axis.selectAll(".wk-chart-" + (dim.axisOrient()) + ".wk-chart-axis text").attr({
          dy: '0.35em'
        }).attr('transform', "rotate(" + (dim.rotateTickLabels()) + ", 0, " + (dim.axisOrient() === 'bottom' ? 10 : -10) + ")").style('text-anchor', dim.axisOrient() === 'bottom' ? 'end' : 'start');
      } else {
        return axis.selectAll(".wk-chart-" + (dim.axisOrient()) + ".wk-chart-axis text").attr('transform', null);
      }
    };
    _removeAxis = function(orient) {
      return _container.select(".wk-chart-axis.wk-chart-" + orient).remove();
    };
    _removeLabel = function(orient) {
      return _container.select(".wk-chart-label.wk-chart-" + orient).remove();
    };
    drawGrid = function(s, noAnimation) {
      var duration, gridLines, kind, offset, ticks;
      duration = noAnimation ? 0 : _duration;
      kind = s.kind();
      ticks = s.isOrdinal() ? s.scale().range() : s.scale().ticks();
      offset = s.isOrdinal() ? s.scale().rangeBand() / 2 : 0;
      gridLines = _container.selectAll(".wk-chart-grid.wk-chart-" + kind).data(ticks, function(d) {
        return d;
      });
      gridLines.enter().append('line').attr('class', "wk-chart-grid wk-chart-" + kind).style('pointer-events', 'none').style('opacity', 0);
      if (kind === 'y') {
        gridLines.transition().duration(duration).attr({
          x1: 0,
          x2: _innerWidth,
          y1: function(d) {
            if (s.isOrdinal()) {
              return d + offset;
            } else {
              return s.scale()(d);
            }
          },
          y2: function(d) {
            if (s.isOrdinal()) {
              return d + offset;
            } else {
              return s.scale()(d);
            }
          }
        }).style('opacity', 1);
      } else {
        gridLines.transition().duration(duration).attr({
          y1: 0,
          y2: _innerHeight,
          x1: function(d) {
            if (s.isOrdinal()) {
              return d + offset;
            } else {
              return s.scale()(d);
            }
          },
          x2: function(d) {
            if (s.isOrdinal()) {
              return d + offset;
            } else {
              return s.scale()(d);
            }
          }
        }).style('opacity', 1);
      }
      return gridLines.exit().transition().duration(duration).style('opacity', 0).remove();
    };
    _genChartFrame = function() {
      _svg = _elementSelection.append('div').attr('class', 'wk-chart').append('svg').attr('class', 'wk-chart');
      _svg.append('defs').append('clipPath').attr('id', "wk-chart-clip-" + _containerId).append('rect');
      _container = _svg.append('g').attr('class', 'wk-chart-container');
      _overlay = _container.append('g').attr('class', 'wk-chart-overlay').style('pointer-events', 'all');
      _overlay.append('rect').style('visibility', 'hidden').attr('class', 'wk-chart-background').datum({
        name: 'background'
      });
      return _chartArea = _container.append('g').attr('class', 'wk-chart-area');
    };
    me.drawChartFrame = function(data, notAnimated) {
      var axis, axisRect, bounds, dataLabelHeight, dataLabelRect, dataLabelWidth, k, l, label, labelHeight, leftMargin, s, titleAreaHeight, topMargin, _frameHeight, _frameWidth, _height, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _width;
      bounds = _elementSelection.node().getBoundingClientRect();
      _duration = notAnimated ? 0 : me.chart().animationDuration();
      _height = bounds.height;
      _width = bounds.width;
      titleAreaHeight = drawTitleArea(_chart.title(), _chart.subTitle());
      axisRect = {
        top: {
          height: 0,
          width: 0
        },
        bottom: {
          height: 0,
          width: 0
        },
        left: {
          height: 0,
          width: 0
        },
        right: {
          height: 0,
          width: 0
        }
      };
      labelHeight = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };
      dataLabelRect = {
        width: 0,
        height: 0
      };
      for (_i = 0, _len = _layouts.length; _i < _len; _i++) {
        l = _layouts[_i];
        dataLabelHeight = dataLabelWidth = 0;
        _ref = l.scales().allKinds();
        for (k in _ref) {
          s = _ref[k];
          if (s.showAxis()) {
            s.axis().scale(s.scale()).orient(s.axisOrient());
            axis = _container.select(".wk-chart-axis.wk-chart-" + (s.axisOrient()));
            axisRect[s.axisOrient()] = getAxisRect(s);
            label = _container.select(".wk-chart-label.wk-chart-" + (s.axisOrient()));
            if (s.showLabel()) {
              if (label.empty()) {
                label = _container.append('g').attr('class', 'wk-chart-label wk-chart-' + s.axisOrient());
              }
              labelHeight[s.axisOrient()] = drawAndPositionText(label, s.axisLabel(), 'wk-chart-label-text', '1.5em');
            } else {
              label.remove();
            }
          }
          if (s.axisOrientOld() && s.axisOrientOld() !== s.axisOrient()) {
            _removeAxis(s.axisOrientOld());
            _removeLabel(s.axisOrientOld());
          }
          if (l.showDataLabels() === k) {
            if (s.isHorizontal()) {
              dataLabelWidth = wkChartMargins.dataLabelPadding.hor + measureText(s.formattedValue(data), _container, 'wk-chart-data-label').width;
            } else {
              dataLabelHeight = wkChartMargins.dataLabelPadding.vert + measureText(s.formattedValue(data), _container, 'wk-chart-data-label').height;
            }
          }
        }
      }
      _frameHeight = titleAreaHeight + axisRect.top.height + labelHeight.top + axisRect.bottom.height + labelHeight.bottom + _margin.top + _margin.bottom;
      _frameWidth = axisRect.right.width + labelHeight.right + axisRect.left.width + labelHeight.left + _margin.left + _margin.right;
      if (_frameHeight < _height) {
        _innerHeight = _height - _frameHeight;
      } else {
        _innerHeight = 0;
      }
      if (_frameWidth < _width) {
        _innerWidth = _width - _frameWidth;
      } else {
        _innerWidth = 0;
      }
      for (_j = 0, _len1 = _layouts.length; _j < _len1; _j++) {
        l = _layouts[_j];
        _ref1 = l.scales().allKinds();
        for (k in _ref1) {
          s = _ref1[k];
          if (k === 'x' || k === 'rangeX') {
            if (l.showDataLabels() === 'x') {
              s.range([0, _innerWidth - dataLabelWidth]);
            } else {
              s.range([0, _innerWidth]);
            }
          } else if (k === 'y' || k === 'rangeY') {
            if (l.showDataLabels() === 'y') {
              s.range([_innerHeight, dataLabelHeight]);
            } else {
              s.range([_innerHeight, 0]);
            }
          }
          if (s.showAxis()) {
            drawAxis(s);
          }
        }
      }
      leftMargin = axisRect.left.width + labelHeight.left + _margin.left;
      topMargin = titleAreaHeight + axisRect.top.height + labelHeight.top + _margin.top;
      _spacedContainer = _container.attr('transform', "translate(" + leftMargin + ", " + topMargin + ")");
      _svg.select("#wk-chart-clip-" + _containerId + " rect").attr('width', _innerWidth).attr('height', _innerHeight);
      _spacedContainer.select('.wk-chart-overlay>.wk-chart-background').attr('width', _innerWidth).attr('height', _innerHeight);
      _spacedContainer.select('.wk-chart-area').style('clip-path', "url(#wk-chart-clip-" + _containerId + ")");
      _spacedContainer.select('.wk-chart-overlay').style('clip-path', "url(#wk-chart-clip-" + _containerId + ")");
      _container.selectAll('.wk-chart-axis.wk-chart-right').attr('transform', "translate(" + _innerWidth + ", 0)");
      _container.selectAll('.wk-chart-axis.wk-chart-bottom').attr('transform', "translate(0, " + _innerHeight + ")");
      _container.select('.wk-chart-label.wk-chart-left').attr('transform', "translate(" + (-axisRect.left.width - labelHeight.left / 2) + ", " + (_innerHeight / 2) + ") rotate(-90)");
      _container.select('.wk-chart-label.wk-chart-right').attr('transform', "translate(" + (_innerWidth + axisRect.right.width + labelHeight.right / 2) + ", " + (_innerHeight / 2) + ") rotate(90)");
      _container.select('.wk-chart-label.wk-chart-top').attr('transform', "translate(" + (_innerWidth / 2) + ", " + (-axisRect.top.height - labelHeight.top / 2) + ")");
      _container.select('.wk-chart-label.wk-chart-bottom').attr('transform', "translate(" + (_innerWidth / 2) + ", " + (_innerHeight + axisRect.bottom.height + labelHeight.bottom) + ")");
      _container.selectAll('.wk-chart-title-area').attr('transform', "translate(" + (_innerWidth / 2) + ", " + (-topMargin + _titleHeight) + ")");
      for (_k = 0, _len2 = _layouts.length; _k < _len2; _k++) {
        l = _layouts[_k];
        _ref2 = l.scales().allKinds();
        for (k in _ref2) {
          s = _ref2[k];
          if (s.showAxis() && s.showGrid()) {
            drawGrid(s);
          }
        }
      }
      _chart.behavior().overlay(_overlay);
      return _chart.behavior().container(_chartArea);
    };
    me.drawSingleAxis = function(scale) {
      var a;
      if (scale.showAxis()) {
        a = _spacedContainer.select(".wk-chart-axis.wk-chart-" + (scale.axis().orient()));
        a.call(scale.axis());
        if (scale.showGrid()) {
          drawGrid(scale, true);
        }
      }
      return me;
    };
    return me;
  };
  return container;
});

angular.module('wk.chart').factory('layout', function($log, scale, scaleList, timing) {
  var layout, layoutCntr;
  layoutCntr = 0;
  layout = function() {
    var buildArgs, getDrawArea, me, _chart, _container, _data, _id, _layoutLifeCycle, _scaleList, _showLabels;
    _id = "layout" + (layoutCntr++);
    _container = void 0;
    _data = void 0;
    _chart = void 0;
    _scaleList = scaleList();
    _showLabels = false;
    _layoutLifeCycle = d3.dispatch('configure', 'drawChart', 'prepareData', 'brush', 'redraw', 'drawAxis', 'update', 'updateAttrs', 'brushDraw');
    me = function() {};
    me.id = function(id) {
      return _id;
    };
    me.chart = function(chart) {
      if (arguments.length === 0) {
        return _chart;
      } else {
        _chart = chart;
        _scaleList.parentScales(chart.scales());
        _chart.lifeCycle().on("configure." + (me.id()), function() {
          return _layoutLifeCycle.configure.apply(me.scales());
        });
        _chart.lifeCycle().on("drawChart." + (me.id()), me.draw);
        _chart.lifeCycle().on("prepareData." + (me.id()), me.prepareData);
        return me;
      }
    };
    me.scales = function() {
      return _scaleList;
    };
    me.scaleProperties = function() {
      return me.scales().getScaleProperties();
    };
    me.container = function(obj) {
      if (arguments.length === 0) {
        return _container;
      } else {
        _container = obj;
        return me;
      }
    };
    me.showDataLabels = function(trueFalse) {
      if (arguments.length === 0) {
        return _showLabels;
      } else {
        _showLabels = trueFalse;
        return me;
      }
    };
    me.behavior = function() {
      return me.chart().behavior();
    };
    me.prepareData = function(data) {
      var args, kind, _i, _len, _ref;
      args = [];
      _ref = ['x', 'y', 'color', 'size', 'shape', 'rangeX', 'rangeY'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        kind = _ref[_i];
        args.push(_scaleList.getKind(kind));
      }
      return _layoutLifeCycle.prepareData.apply(data, args);
    };
    me.lifeCycle = function() {
      return _layoutLifeCycle;
    };
    getDrawArea = function() {
      var container, drawArea;
      container = _container.getChartArea();
      drawArea = container.select("." + (me.id()));
      if (drawArea.empty()) {
        drawArea = container.append('g').attr('class', function(d) {
          return me.id();
        });
      }
      return drawArea;
    };
    buildArgs = function(data, notAnimated) {
      var args, kind, options, _i, _len, _ref;
      options = {
        height: _container.height(),
        width: _container.width(),
        margins: _container.margins(),
        duration: notAnimated ? 0 : me.chart().animationDuration()
      };
      args = [data, options];
      _ref = ['x', 'y', 'color', 'size', 'shape', 'rangeX', 'rangeY'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        kind = _ref[_i];
        args.push(_scaleList.getKind(kind));
      }
      return args;
    };
    me.draw = function(data, notAnimated) {
      _data = data;
      _layoutLifeCycle.drawChart.apply(getDrawArea(), buildArgs(data, notAnimated));
      _layoutLifeCycle.on('redraw', me.redraw);
      _layoutLifeCycle.on('update', me.chart().lifeCycle().update);
      _layoutLifeCycle.on('drawAxis', me.chart().lifeCycle().drawAxis);
      _layoutLifeCycle.on('updateAttrs', me.chart().lifeCycle().updateAttrs);
      return _layoutLifeCycle.on('brush', function(axis, notAnimated, idxRange) {
        _container.drawSingleAxis(axis);
        return _layoutLifeCycle.brushDraw.apply(getDrawArea(), [axis, idxRange, _container.width(), _container.height()]);
      });
    };
    return me;
  };
  return layout;
});

angular.module('wk.chart').factory('legend', function($log, $compile, $rootScope, $templateCache, templateDir) {
  var legend, legendCnt, uniqueValues;
  legendCnt = 0;
  uniqueValues = function(arr) {
    var e, set, _i, _len;
    set = {};
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      e = arr[_i];
      set[e] = 0;
    }
    return Object.keys(set);
  };
  legend = function() {
    var me, _containerDiv, _data, _id, _layout, _legendDiv, _legendScope, _options, _parsedTemplate, _position, _scale, _show, _showValues, _template, _templatePath, _title;
    _id = "legend-" + (legendCnt++);
    _position = 'top-right';
    _scale = void 0;
    _templatePath = void 0;
    _legendScope = $rootScope.$new(true);
    _template = void 0;
    _parsedTemplate = void 0;
    _containerDiv = void 0;
    _legendDiv = void 0;
    _title = void 0;
    _layout = void 0;
    _data = void 0;
    _options = void 0;
    _show = false;
    _showValues = false;
    me = {};
    me.position = function(pos) {
      if (arguments.length === 0) {
        return _position;
      } else {
        _position = pos;
        return me;
      }
    };
    me.show = function(val) {
      if (arguments.length === 0) {
        return _show;
      } else {
        _show = val;
        return me;
      }
    };
    me.showValues = function(val) {
      if (arguments.length === 0) {
        return _showValues;
      } else {
        _showValues = val;
        return me;
      }
    };
    me.div = function(selection) {
      if (arguments.length === 0) {
        return _legendDiv;
      } else {
        _legendDiv = selection;
        return me;
      }
    };
    me.layout = function(layout) {
      if (arguments.length === 0) {
        return _layout;
      } else {
        _layout = layout;
        return me;
      }
    };
    me.scale = function(scale) {
      if (arguments.length === 0) {
        return _scale;
      } else {
        _scale = scale;
        return me;
      }
    };
    me.title = function(title) {
      if (arguments.length === 0) {
        return _title;
      } else {
        _title = title;
        return me;
      }
    };
    me.template = function(path) {
      if (arguments.length === 0) {
        return _templatePath;
      } else {
        _templatePath = path;
        _template = $templateCache.get(_templatePath);
        _parsedTemplate = $compile(_template)(_legendScope);
        return me;
      }
    };
    me.draw = function(data, options) {
      var chartAreaRect, containerRect, layers, p, s, _i, _len, _ref, _ref1;
      _data = data;
      _options = options;
      _containerDiv = _legendDiv || d3.select(me.scale().parent().container().element()).select('.wk-chart');
      if (me.show()) {
        if (_containerDiv.select('.wk-chart-legend').empty()) {
          angular.element(_containerDiv.node()).append(_parsedTemplate);
        }
        if (me.showValues()) {
          layers = uniqueValues(_scale.value(data));
        } else {
          layers = _scale.layerKeys(data);
        }
        s = _scale.scale();
        if ((_ref = me.layout()) != null ? _ref.scales().layerScale() : void 0) {
          s = me.layout().scales().layerScale().scale();
        }
        if (_scale.kind() !== 'shape') {
          _legendScope.legendRows = layers.map(function(d) {
            return {
              value: d,
              color: {
                'background-color': s(d)
              }
            };
          });
        } else {
          _legendScope.legendRows = layers.map(function(d) {
            return {
              value: d,
              path: d3.svg.symbol().type(s(d)).size(80)()
            };
          });
        }
        _legendScope.showLegend = true;
        _legendScope.position = {
          position: _legendDiv ? 'relative' : 'absolute'
        };
        if (!_legendDiv) {
          containerRect = _containerDiv.node().getBoundingClientRect();
          chartAreaRect = _containerDiv.select('.wk-chart-overlay rect').node().getBoundingClientRect();
          _ref1 = _position.split('-');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            p = _ref1[_i];
            _legendScope.position[p] = "" + (Math.abs(containerRect[p] - chartAreaRect[p])) + "px";
          }
        }
        _legendScope.title = _title;
      } else {
        _parsedTemplate.remove();
      }
      return me;
    };
    me.register = function(layout) {
      layout.lifeCycle().on("drawChart." + _id, me.draw);
      return me;
    };
    me.template(templateDir + 'legend.html');
    me.redraw = function() {
      if (_data && _options) {
        me.draw(_data, _options);
      }
      return me;
    };
    return me;
  };
  return legend;
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('wk.chart').factory('scale', function($log, legend, formatDefaults, wkChartScales, wkChartLocale) {
  var scale;
  scale = function() {
    var calcDomain, keys, layerMax, layerMin, layerTotal, me, parsedValue, _axis, _axisLabel, _axisOrient, _axisOrientOld, _calculatedDomain, _chart, _domain, _domainCalc, _exponent, _id, _inputFormatFn, _inputFormatString, _isHorizontal, _isOrdinal, _isVertical, _kind, _layerExclude, _layerProp, _layout, _legend, _lowerProperty, _outputFormatFn, _outputFormatString, _parent, _property, _range, _rangeOuterPadding, _rangePadding, _resetOnNewData, _rotateTickLabels, _scale, _scaleType, _showAxis, _showGrid, _showLabel, _tickFormat, _tickValues, _ticks, _upperProperty;
    _id = '';
    _scale = d3.scale.linear();
    _scaleType = 'linear';
    _exponent = 1;
    _isOrdinal = false;
    _domain = void 0;
    _domainCalc = void 0;
    _calculatedDomain = void 0;
    _resetOnNewData = false;
    _property = '';
    _layerProp = '';
    _layerExclude = [];
    _lowerProperty = '';
    _upperProperty = '';
    _range = void 0;
    _rangePadding = 0.3;
    _rangeOuterPadding = 0.3;
    _inputFormatString = void 0;
    _inputFormatFn = function(data) {
      if (isNaN(+data) || _.isDate(data)) {
        return data;
      } else {
        return +data;
      }
    };
    _showAxis = false;
    _axisOrient = void 0;
    _axisOrientOld = void 0;
    _axis = void 0;
    _ticks = void 0;
    _tickFormat = void 0;
    _tickValues = void 0;
    _rotateTickLabels = void 0;
    _showLabel = false;
    _axisLabel = void 0;
    _showGrid = false;
    _isHorizontal = false;
    _isVertical = false;
    _kind = void 0;
    _parent = void 0;
    _chart = void 0;
    _layout = void 0;
    _legend = legend();
    _outputFormatString = void 0;
    _outputFormatFn = void 0;
    _tickFormat = wkChartLocale.timeFormat.multi([
      [
        ".%L", function(d) {
          return d.getMilliseconds();
        }
      ], [
        ":%S", function(d) {
          return d.getSeconds();
        }
      ], [
        "%I:%M", function(d) {
          return d.getMinutes();
        }
      ], [
        "%I %p", function(d) {
          return d.getHours();
        }
      ], [
        "%a %d", function(d) {
          return d.getDay() && d.getDate() !== 1;
        }
      ], [
        "%b %d", function(d) {
          return d.getDate() !== 1;
        }
      ], [
        "%B", function(d) {
          return d.getMonth();
        }
      ], [
        "%Y", function() {
          return true;
        }
      ]
    ]);
    me = function() {};
    keys = function(data) {
      if (_.isArray(data)) {
        return _.reject(_.keys(data[0]), function(d) {
          return d === '$$hashKey';
        });
      } else {
        return _.reject(_.keys(data), function(d) {
          return d === '$$hashKey';
        });
      }
    };
    layerTotal = function(d, layerKeys) {
      return layerKeys.reduce(function(prev, next) {
        return +prev + +me.layerValue(d, next);
      }, 0);
    };
    layerMax = function(data, layerKeys) {
      return d3.max(data, function(d) {
        return d3.max(layerKeys, function(k) {
          return me.layerValue(d, k);
        });
      });
    };
    layerMin = function(data, layerKeys) {
      return d3.min(data, function(d) {
        return d3.min(layerKeys, function(k) {
          return me.layerValue(d, k);
        });
      });
    };
    parsedValue = function(v) {
      if (_inputFormatFn.parse) {
        return _inputFormatFn.parse(v);
      } else {
        return _inputFormatFn(v);
      }
    };
    calcDomain = {
      extent: function(data) {
        var layerKeys;
        layerKeys = me.layerKeys(data);
        return [layerMin(data, layerKeys), layerMax(data, layerKeys)];
      },
      max: function(data) {
        var layerKeys;
        layerKeys = me.layerKeys(data);
        return [0, layerMax(data, layerKeys)];
      },
      min: function(data) {
        var layerKeys;
        layerKeys = me.layerKeys(data);
        return [0, layerMin(data, layerKeys)];
      },
      totalExtent: function(data) {
        var layerKeys;
        if (data[0].hasOwnProperty('total')) {
          return d3.extent(data.map(function(d) {
            return d.total;
          }));
        } else {
          layerKeys = me.layerKeys(data);
          return d3.extent(data.map(function(d) {
            return layerTotal(d, layerKeys);
          }));
        }
      },
      total: function(data) {
        var layerKeys;
        if (data[0].hasOwnProperty('total')) {
          return [
            0, d3.max(data.map(function(d) {
              return d.total;
            }))
          ];
        } else {
          layerKeys = me.layerKeys(data);
          return [
            0, d3.max(data.map(function(d) {
              return layerTotal(d, layerKeys);
            }))
          ];
        }
      },
      rangeExtent: function(data) {
        var start, step;
        if (me.upperProperty()) {
          return [d3.min(me.lowerValue(data)), d3.max(me.upperValue(data))];
        } else {
          if (data.length > 1) {
            start = me.lowerValue(data[0]);
            step = me.lowerValue(data[1]) - start;
            return [me.lowerValue(data[0]), start + step * data.length];
          }
        }
      },
      rangeMin: function(data) {
        return [0, d3.min(me.lowerValue(data))];
      },
      rangeMax: function(data) {
        var start, step;
        if (me.upperProperty()) {
          return [0, d3.max(me.upperValue(data))];
        } else {
          start = me.lowerValue(data[0]);
          step = me.lowerValue(data[1]) - start;
          return [0, start + step * data.length];
        }
      }
    };
    me.id = function() {
      return _kind + '.' + _parent.id();
    };
    me.kind = function(kind) {
      if (arguments.length === 0) {
        return _kind;
      } else {
        _kind = kind;
        return me;
      }
    };
    me.parent = function(parent) {
      if (arguments.length === 0) {
        return _parent;
      } else {
        _parent = parent;
        return me;
      }
    };
    me.chart = function(val) {
      if (arguments.length === 0) {
        return _chart;
      } else {
        _chart = val;
        return me;
      }
    };
    me.layout = function(val) {
      if (arguments.length === 0) {
        return _layout;
      } else {
        _layout = val;
        return me;
      }
    };
    me.scale = function() {
      return _scale;
    };
    me.legend = function() {
      return _legend;
    };
    me.isOrdinal = function() {
      return _isOrdinal;
    };
    me.isHorizontal = function(trueFalse) {
      if (arguments.length === 0) {
        return _isHorizontal;
      } else {
        _isHorizontal = trueFalse;
        if (trueFalse) {
          _isVertical = false;
        }
        return me;
      }
    };
    me.isVertical = function(trueFalse) {
      if (arguments.length === 0) {
        return _isVertical;
      } else {
        _isVertical = trueFalse;
        if (trueFalse) {
          _isHorizontal = false;
        }
        return me;
      }
    };
    me.scaleType = function(type) {
      if (arguments.length === 0) {
        return _scaleType;
      } else {
        if (d3.scale.hasOwnProperty(type)) {
          _scale = d3.scale[type]();
          _scaleType = type;
          me.format(formatDefaults.number);
        } else if (type === 'time') {
          _scale = d3.time.scale();
          _scaleType = 'time';
          if (_inputFormatString) {
            me.dataFormat(_inputFormatString);
          }
          me.format(formatDefaults.date);
        } else if (wkChartScales.hasOwnProperty(type)) {
          _scaleType = type;
          _scale = wkChartScales[type]();
        } else {
          $log.error('Error: illegal scale type:', type);
        }
        _isOrdinal = _scaleType === 'ordinal' || _scaleType === 'category10' || _scaleType === 'category20' || _scaleType === 'category20b' || _scaleType === 'category20c';
        if (_range) {
          me.range(_range);
        }
        if (_showAxis) {
          _axis.scale(_scale);
        }
        if (_exponent && _scaleType === 'pow') {
          _scale.exponent(_exponent);
        }
        return me;
      }
    };
    me.exponent = function(value) {
      if (arguments.length === 0) {
        return _exponent;
      } else {
        _exponent = value;
        if (_scaleType === 'pow') {
          _scale.exponent(_exponent);
        }
        return me;
      }
    };
    me.domain = function(dom) {
      if (arguments.length === 0) {
        return _domain;
      } else {
        _domain = dom;
        if (_.isArray(_domain)) {
          _scale.domain(_domain);
        }
        return me;
      }
    };
    me.domainCalc = function(rule) {
      if (arguments.length === 0) {
        if (_isOrdinal) {
          return void 0;
        } else {
          return _domainCalc;
        }
      } else {
        if (calcDomain.hasOwnProperty(rule)) {
          _domainCalc = rule;
        } else {
          $log.error('illegal domain calculation rule:', rule, " expected", _.keys(calcDomain));
        }
        return me;
      }
    };
    me.getDomain = function(data) {
      if (arguments.length === 0) {
        return _scale.domain();
      } else {
        if (!_domain && me.domainCalc()) {
          return _calculatedDomain;
        } else {
          if (_domain) {
            return _domain;
          } else {
            return me.value(data);
          }
        }
      }
    };
    me.resetOnNewData = function(trueFalse) {
      if (arguments.length === 0) {
        return _resetOnNewData;
      } else {
        _resetOnNewData = trueFalse;
        return me;
      }
    };
    me.range = function(range) {
      var _ref;
      if (arguments.length === 0) {
        return _scale.range();
      } else {
        _range = range;
        if (_scaleType === 'ordinal' && ((_ref = me.kind()) === 'x' || _ref === 'y')) {
          _scale.rangeBands(range, _rangePadding, _rangeOuterPadding);
        } else if (!(_scaleType === 'category10' || _scaleType === 'category20' || _scaleType === 'category20b' || _scaleType === 'category20c')) {
          _scale.range(range);
        }
        return me;
      }
    };
    me.rangePadding = function(config) {
      if (arguments.length === 0) {
        return {
          padding: _rangePadding,
          outerPadding: _rangeOuterPadding
        };
      } else {
        _rangePadding = config.padding;
        _rangeOuterPadding = config.outerPadding;
        return me;
      }
    };
    me.property = function(name) {
      if (arguments.length === 0) {
        return _property;
      } else {
        _property = name;
        return me;
      }
    };
    me.layerProperty = function(name) {
      if (arguments.length === 0) {
        return _layerProp;
      } else {
        _layerProp = name;
        return me;
      }
    };
    me.layerExclude = function(excl) {
      if (arguments.length === 0) {
        return _layerExclude;
      } else {
        _layerExclude = excl;
        return me;
      }
    };
    me.layerKeys = function(data) {
      if (_property) {
        if (_.isArray(_property)) {
          return _.intersection(_property, keys(data));
        } else {
          return [_property];
        }
      } else {
        return _.reject(keys(data), function(d) {
          return __indexOf.call(_layerExclude, d) >= 0;
        });
      }
    };
    me.lowerProperty = function(name) {
      if (arguments.length === 0) {
        return _lowerProperty;
      } else {
        _lowerProperty = name;
        return me;
      }
    };
    me.upperProperty = function(name) {
      if (arguments.length === 0) {
        return _upperProperty;
      } else {
        _upperProperty = name;
        return me;
      }
    };
    me.dataFormat = function(format) {
      if (arguments.length === 0) {
        return _inputFormatString;
      } else {
        _inputFormatString = format;
        if (_scaleType === 'time') {
          _inputFormatFn = wkChartLocale.timeFormat(format);
        } else {
          _inputFormatFn = function(d) {
            return d;
          };
        }
        return me;
      }
    };
    me.value = function(data) {
      if (_layerProp) {
        if (_.isArray(data)) {
          return data.map(function(d) {
            return parsedValue(d[_property][_layerProp]);
          });
        } else {
          return parsedValue(data[_property][_layerProp]);
        }
      } else {
        if (_.isArray(data)) {
          return data.map(function(d) {
            return parsedValue(d[_property]);
          });
        } else {
          return parsedValue(data[_property]);
        }
      }
    };
    me.layerValue = function(data, layerKey) {
      if (_layerProp) {
        return parsedValue(data[layerKey][_layerProp]);
      } else {
        return parsedValue(data[layerKey]);
      }
    };
    me.lowerValue = function(data) {
      if (_.isArray(data)) {
        return data.map(function(d) {
          return parsedValue(d[_lowerProperty]);
        });
      } else {
        return parsedValue(data[_lowerProperty]);
      }
    };
    me.upperValue = function(data) {
      if (_.isArray(data)) {
        return data.map(function(d) {
          return parsedValue(d[_upperProperty]);
        });
      } else {
        return parsedValue(data[_upperProperty]);
      }
    };
    me.formattedValue = function(data) {
      if (_.isArray(data)) {
        return data.map(function(d) {
          return me.formatValue(me.value(d));
        });
      } else {
        return me.formatValue(me.value(data));
      }
    };
    me.formatValue = function(val) {
      if (_outputFormatString && val && (val.getUTCDate || !isNaN(val))) {
        return _outputFormatFn(val);
      } else {
        return val;
      }
    };
    me.map = function(data) {
      if (Array.isArray(data)) {
        return data.map(function(d) {
          return _scale(me.value(data));
        });
      } else {
        return _scale(me.value(data));
      }
    };
    me.invert = function(mappedValue) {
      var bisect, domain, idx, interval, range, step, val, _data;
      if (_.has(me.scale(), 'invert')) {
        _data = me.chart().getData();
        if (me.kind() === 'rangeX' || me.kind() === 'rangeY') {
          val = me.scale().invert(mappedValue);
          if (me.upperProperty()) {
            bisect = d3.bisector(me.upperValue).left;
          } else {
            step = me.lowerValue(_data[1]) - me.lowerValue(_data[0]);
            bisect = d3.bisector(function(d) {
              return me.lowerValue(d) + step;
            }).left;
          }
        } else {
          range = _scale.range();
          interval = (range[1] - range[0]) / _data.length;
          val = me.scale().invert(mappedValue - interval / 2);
          bisect = d3.bisector(me.value).left;
        }
        idx = bisect(_data, val);
        idx = idx < 0 ? 0 : idx >= _data.length ? _data.length - 1 : idx;
        return idx;
      }
      if (_.has(me.scale(), 'invertExtent')) {
        return me.scale().invertExtent(mappedValue);
      }
      if (me.resetOnNewData()) {
        domain = _scale.domain();
        range = _scale.range();
        if (_isVertical) {
          interval = range[0] - range[1];
          idx = range.length - Math.floor(mappedValue / interval) - 1;
          if (idx < 0) {
            idx = 0;
          }
        } else {
          interval = range[1] - range[0];
          idx = Math.floor(mappedValue / interval);
        }
        return idx;
      }
    };
    me.invertOrdinal = function(mappedValue) {
      var idx;
      if (me.isOrdinal() && me.resetOnNewData()) {
        idx = me.invert(mappedValue);
        return _scale.domain()[idx];
      }
    };
    me.showAxis = function(trueFalse) {
      if (arguments.length === 0) {
        return _showAxis;
      } else {
        _showAxis = trueFalse;
        if (trueFalse) {
          _axis = d3.svg.axis();
          if (me.scaleType() === 'time') {
            _axis.tickFormat(_tickFormat);
          }
        } else {
          _axis = void 0;
        }
        return me;
      }
    };
    me.axisOrient = function(val) {
      if (arguments.length === 0) {
        return _axisOrient;
      } else {
        _axisOrientOld = _axisOrient;
        _axisOrient = val;
        return me;
      }
    };
    me.axisOrientOld = function(val) {
      if (arguments.length === 0) {
        return _axisOrientOld;
      } else {
        _axisOrientOld = val;
        return me;
      }
    };
    me.axis = function() {
      return _axis;
    };
    me.ticks = function(val) {
      if (arguments.length === 0) {
        return _ticks;
      } else {
        _ticks = val;
        if (me.axis()) {
          me.axis().ticks(_ticks);
        }
        return me;
      }
    };
    me.tickFormat = function(val) {
      if (arguments.length === 0) {
        return _tickFormat;
      } else {
        _tickFormat = val;
        if (me.axis()) {
          me.axis().tickFormat(val);
        }
        return me;
      }
    };
    me.tickValues = function(val) {
      if (arguments.length === 0) {
        return _tickValues;
      } else {
        _tickValues = val;
        if (me.axis()) {
          me.axis().tickValues(val);
        }
        return me;
      }
    };
    me.showLabel = function(val) {
      if (arguments.length === 0) {
        return _showLabel;
      } else {
        _showLabel = val;
        return me;
      }
    };
    me.axisLabel = function(text) {
      if (arguments.length === 0) {
        if (_axisLabel) {
          return _axisLabel;
        } else {
          return me.property();
        }
      } else {
        _axisLabel = text;
        return me;
      }
    };
    me.rotateTickLabels = function(nbr) {
      if (arguments.length === 0) {
        return _rotateTickLabels;
      } else {
        _rotateTickLabels = nbr;
        return me;
      }
    };
    me.format = function(val) {
      if (arguments.length === 0) {
        return _outputFormatString;
      } else {
        if (val.length > 0) {
          _outputFormatString = val;
        } else {
          _outputFormatString = me.scaleType() === 'time' ? formatDefaults.date : formatDefaults.number;
        }
        _outputFormatFn = me.scaleType() === 'time' ? wkChartLocale.timeFormat(_outputFormatString) : wkChartLocale.numberFormat(_outputFormatString);
        return me;
      }
    };
    me.showGrid = function(trueFalse) {
      if (arguments.length === 0) {
        return _showGrid;
      } else {
        _showGrid = trueFalse;
        return me;
      }
    };
    me.register = function() {
      me.chart().lifeCycle().on("scaleDomains." + (me.id()), function(data) {
        var domain;
        if (me.resetOnNewData()) {
          domain = me.getDomain(data);
          if (_scaleType === 'linear' && _.some(domain, isNaN)) {
            throw "Scale " + (me.kind()) + ", Type '" + _scaleType + "': cannot compute domain for property '" + _property + "' . Possible reasons: property not set, data not compatible with defined type. Domain:" + domain;
          }
          return _scale.domain(domain);
        }
      });
      return me.chart().lifeCycle().on("prepareData." + (me.id()), function(data) {
        var calcRule;
        calcRule = me.domainCalc();
        if (me.parent().scaleProperties) {
          me.layerExclude(me.parent().scaleProperties());
        }
        if (calcRule && calcDomain[calcRule]) {
          return _calculatedDomain = calcDomain[calcRule](data);
        }
      });
    };
    me.update = function(noAnimation) {
      me.parent().lifeCycle().update(noAnimation);
      return me;
    };
    me.updateAttrs = function() {
      return me.parent().lifeCycle().updateAttrs();
    };
    me.drawAxis = function() {
      me.parent().lifeCycle().drawAxis();
      return me;
    };
    return me;
  };
  return scale;
});

angular.module('wk.chart').factory('scaleList', function($log) {
  var scaleList;
  return scaleList = function() {
    var me, _kindList, _layerScale, _list, _owner, _parentList, _requiredScales;
    _list = {};
    _kindList = {};
    _parentList = {};
    _owner = void 0;
    _requiredScales = [];
    _layerScale = void 0;
    me = function() {};
    me.owner = function(owner) {
      if (arguments.length === 0) {
        return _owner;
      } else {
        _owner = owner;
        return me;
      }
    };
    me.add = function(scale) {
      if (_list[scale.id()]) {
        $log.error("scaleList.add: scale " + (scale.id()) + " already defined in scaleList of " + (_owner.id()) + ". Duplicate scales are not allowed");
      }
      _list[scale.id()] = scale;
      _kindList[scale.kind()] = scale;
      return me;
    };
    me.hasScale = function(scale) {
      var s;
      s = me.getKind(scale.kind());
      return s.id() === scale.id();
    };
    me.getKind = function(kind) {
      if (_kindList[kind]) {
        return _kindList[kind];
      } else if (_parentList.getKind) {
        return _parentList.getKind(kind);
      } else {
        return void 0;
      }
    };
    me.hasKind = function(kind) {
      return !!me.getKind(kind);
    };
    me.remove = function(scale) {
      if (!_list[scale.id()]) {
        $log.warn("scaleList.delete: scale " + (scale.id()) + " not defined in scaleList of " + (_owner.id()) + ". Ignoring");
        return me;
      }
      delete _list[scale.id()];
      delete me[scale.id];
      return me;
    };
    me.parentScales = function(scaleList) {
      if (arguments.length === 0) {
        return _parentList;
      } else {
        _parentList = scaleList;
        return me;
      }
    };
    me.getOwned = function() {
      return _list;
    };
    me.allKinds = function() {
      var k, ret, s, _ref;
      ret = {};
      if (_parentList.allKinds) {
        _ref = _parentList.allKinds();
        for (k in _ref) {
          s = _ref[k];
          ret[k] = s;
        }
      }
      for (k in _kindList) {
        s = _kindList[k];
        ret[k] = s;
      }
      return ret;
    };
    me.requiredScales = function(req) {
      var k, _i, _len;
      if (arguments.length === 0) {
        return _requiredScales;
      } else {
        _requiredScales = req;
        for (_i = 0, _len = req.length; _i < _len; _i++) {
          k = req[_i];
          if (!me.hasKind(k)) {
            throw "Fatal Error: scale '" + k + "' required but not defined";
          }
        }
      }
      return me;
    };
    me.getScales = function(kindList) {
      var kind, l, _i, _len;
      l = {};
      for (_i = 0, _len = kindList.length; _i < _len; _i++) {
        kind = kindList[_i];
        if (me.hasKind(kind)) {
          l[kind] = me.getKind(kind);
        } else {
          throw "Fatal Error: scale '" + kind + "' required but not defined";
        }
      }
      return l;
    };
    me.getScaleProperties = function() {
      var k, l, prop, s, _ref;
      l = [];
      _ref = me.allKinds();
      for (k in _ref) {
        s = _ref[k];
        prop = s.property();
        if (prop) {
          if (Array.isArray(prop)) {
            l.concat(prop);
          } else {
            l.push(prop);
          }
        }
      }
      return l;
    };
    me.layerScale = function(kind) {
      if (arguments.length === 0) {
        if (_layerScale) {
          return me.getKind(_layerScale);
        }
        return void 0;
      } else {
        _layerScale = kind;
        return me;
      }
    };
    return me;
  };
});

angular.module('wk.chart').provider('wkChartLocale', function() {
  var locale, locales;
  locale = 'en_US';
  locales = {
    de_DE: d3.locale({
      decimal: ",",
      thousands: ".",
      grouping: [3],
      currency: ["", " €"],
      dateTime: "%A, der %e. %B %Y, %X",
      date: "%e.%m.%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
    }),
    'en_US': d3.locale({
      "decimal": ".",
      "thousands": ",",
      "grouping": [3],
      "currency": ["$", ""],
      "dateTime": "%a %b %e %X %Y",
      "date": "%m/%d/%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    })
  };
  this.setLocale = function(l) {
    if (_.has(locales, l)) {
      return locale = l;
    } else {
      throw "unknowm locale '" + l + "' using 'en-US' instead";
    }
  };
  this.$get = [
    '$log', function($log) {
      return locales[locale];
    }
  ];
  return this;
});

angular.module('wk.chart').provider('wkChartScales', function() {
  var categoryColors, categoryColorsHashed, hashed, _customColors;
  _customColors = ['red', 'green', 'blue', 'yellow', 'orange'];
  hashed = function() {
    var d3Scale, me, _hashFn;
    d3Scale = d3.scale.ordinal();
    _hashFn = function(value) {
      var hash, i, m, _i, _ref, _results;
      hash = 0;
      m = d3Scale.range().length - 1;
      _results = [];
      for (i = _i = 0, _ref = value.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(hash = (31 * hash + value.charAt(i)) % m);
      }
      return _results;
    };
    me = function(value) {
      if (!arguments) {
        return me;
      }
      return d3Scale(_hashFn(value));
    };
    me.range = function(range) {
      if (!arguments) {
        return d3Scale.range();
      }
      d3Scale.domain(d3.range(range.length));
      return d3Scale.range(range);
    };
    me.rangePoint = d3Scale.rangePoints;
    me.rangeBands = d3Scale.rangeBands;
    me.rangeRoundBands = d3Scale.rangeRoundBands;
    me.rangeBand = d3Scale.rangeBand;
    me.rangeExtent = d3Scale.rangeExtent;
    me.hash = function(fn) {
      if (!arguments) {
        return _hashFn;
      }
      _hashFn = fn;
      return me;
    };
    return me;
  };
  categoryColors = function() {
    return d3.scale.ordinal().range(_customColors);
  };
  categoryColorsHashed = function() {
    return hashed().range(_customColors);
  };
  this.colors = function(colors) {
    return _customColors = colors;
  };
  this.$get = [
    '$log', function($log) {
      return {
        hashed: hashed,
        colors: categoryColors,
        colorsHashed: categoryColorsHashed
      };
    }
  ];
  return this;
});


/**
  @ngdoc dimension
  @name color
  @module wk.chart
  @restrict E
  @description

  describes how the chart data is translated into colors for chart objects
 */
angular.module('wk.chart').directive('color', function($log, scale, legend, scaleUtils) {
  var scaleCnt;
  scaleCnt = 0;
  return {
    restrict: 'E',
    require: ['color', '^chart', '?^layout'],
    controller: function($element) {
      return this.me = scale();
    },
    link: function(scope, element, attrs, controllers) {
      var chart, l, layout, me, name, _ref;
      me = controllers[0].me;
      chart = controllers[1].me;
      layout = (_ref = controllers[2]) != null ? _ref.me : void 0;
      l = void 0;
      if (!(chart || layout)) {
        $log.error('scale needs to be contained in a chart or layout directive ');
        return;
      }
      name = 'color';
      me.kind(name);
      me.parent(layout || chart);
      me.chart(chart);
      me.scaleType('category20');
      element.addClass(me.id());
      chart.addScale(me, layout);
      me.register();
      scaleUtils.observeSharedAttributes(attrs, me);
      return scaleUtils.observeLegendAttributes(attrs, me, layout);
    }
  };
});

angular.module('wk.chart').service('scaleUtils', function($log, wkChartScales, utils) {
  var parseList;
  parseList = function(val) {
    var l;
    if (val) {
      l = val.trim().replace(/^\[|\]$/g, '').split(',').map(function(d) {
        return d.replace(/^[\"|']|[\"|']$/g, '');
      });
      l = l.map(function(d) {
        if (isNaN(d)) {
          return d;
        } else {
          return +d;
        }
      });
      if (l.length === 1) {
        return l[0];
      } else {
        return l;
      }
    }
  };
  return {
    observeSharedAttributes: function(attrs, me) {

      /**
        @ngdoc attr
        @name type
        @usedBy dimension
        @param type{expression}
       */
      attrs.$observe('type', function(val) {
        if (val !== void 0) {
          if (d3.scale.hasOwnProperty(val) || val === 'time' || wkChartScales.hasOwnProperty(val)) {
            me.scaleType(val);
          } else {
            if (val !== '') {
              $log.error("Error: illegal scale value: " + val + ". Using 'linear' scale instead");
            }
          }
          return me.update();
        }
      });

      /**
        @ngdoc attr
        @name exponent
        @usedBy dimension
        @param exponent{expression}
       */
      attrs.$observe('exponent', function(val) {
        if (me.scaleType() === 'pow' && _.isNumber(+val)) {
          return me.exponent(+val).update();
        }
      });

      /**
        @ngdoc attr
        @name property
        @usedBy dimension
        @param property{expression}
       */
      attrs.$observe('property', function(val) {
        return me.property(parseList(val)).update();
      });

      /**
        @ngdoc attr
        @name layerProperty
        @usedBy dimension
        @param layerProperty{expression}
       */
      attrs.$observe('layerProperty', function(val) {
        if (val && val.length > 0) {
          return me.layerProperty(val).update();
        }
      });

      /**
        @ngdoc attr
        @name range
        @usedBy dimension
        @param range{expression}
       */
      attrs.$observe('range', function(val) {
        var range;
        range = parseList(val);
        if (Array.isArray(range)) {
          return me.range(range).update();
        }
      });

      /**
        @ngdoc attr
        @name dateFormat
        @usedBy dimension
        @param dateFormat{expression}
       */
      attrs.$observe('dateFormat', function(val) {
        if (val) {
          if (me.scaleType() === 'time') {
            return me.dataFormat(val).update();
          }
        }
      });

      /**
        @ngdoc attr
        @name domain
        @usedBy dimension
        @param domain{expression}
       */
      attrs.$observe('domain', function(val) {
        var parsedList;
        if (val) {
          $log.info('domain', val);
          parsedList = parseList(val);
          if (Array.isArray(parsedList)) {
            return me.domain(parsedList).update();
          } else {
            return $log.error("domain: must be array, or comma-separated list, got", val);
          }
        } else {
          return me.domain(void 0).update();
        }
      });

      /**
        @ngdoc attr
        @name domainRange
        @usedBy dimension
        @param domainRange{expression}
       */
      attrs.$observe('domainRange', function(val) {
        if (val) {
          return me.domainCalc(val).update();
        }
      });

      /**
        @ngdoc attr
        @name label
        @usedBy dimension
        @param label{expression}
       */
      attrs.$observe('label', function(val) {
        if (val !== void 0) {
          return me.axisLabel(val).updateAttrs();
        }
      });

      /**
        @ngdoc attr
        @name format
        @usedBy dimension
        @param format{expression}
       */
      attrs.$observe('format', function(val) {
        if (val !== void 0) {
          return me.format(val);
        }
      });

      /**
        @ngdoc attr
        @name reset
        @usedBy dimension
        @param reset{expression}
       */
      attrs.$observe('reset', function(val) {
        return me.resetOnNewData(utils.parseTrueFalse(val));
      });
      ({
        observeAxisAttributes: function(attrs, me, scope) {}
      });

      /**
          @ngdoc attr
          @name tickFormat
          @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
          @param tickFormat {expression}
       */
      attrs.$observe('tickFormat', function(val) {});
      if (val !== void 0) {
        me.tickFormat(d3.format(val)).update();
      }

      /**
          @ngdoc attr
          @name ticks
          @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
          @param ticks {expression}
       */
      attrs.$observe('ticks', function(val) {});
      if (val !== void 0) {
        me.ticks(+val);
        if (me.axis()) {
          me.updateAttrs();
        }
      }

      /**
          @ngdoc attr
          @name grid
          @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
          @param grid {expression}
       */
      attrs.$observe('grid', function(val) {});
      if (val !== void 0) {
        me.showGrid(val === '' || val === 'true').updateAttrs();
      }

      /**
          @ngdoc attr
          @name showLabel
          @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
          @param showLabel {expression}
       */
      attrs.$observe('showLabel', function(val) {});
      if (val !== void 0) {
        me.showLabel(val === '' || val === 'true').update(true);
      }

      /**
          @ngdoc attr
          @name axisFormatters
          @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
          @param axisFormatters {expression}
       */
      scope.$watch(attrs.axisFormatters, function(val) {});
      if (_.isObject(val)) {
        if (_.has(val, 'tickFormat') && _.isFunction(val.tickFormat)) {
          me.tickFormat(val.tickFormat);
        } else if (_.isString(val.tickFormat)) {
          me.tickFormat(d3.format(val));
        }
        if (_.has(val, 'tickValues') && _.isArray(val.tickValues)) {
          me.tickValues(val.tickValues);
        }
        return me.update();
      }
    },
    observeLegendAttributes: function(attrs, me, layout) {

      /**
          @ngdoc attr
          @name legend
          @usedBy dimension
          @param legend {expression}
       */
      attrs.$observe('legend', function(val) {
        var l, legendDiv;
        if (val !== void 0) {
          l = me.legend();
          l.showValues(false);
          switch (val) {
            case 'false':
              l.show(false);
              break;
            case 'top-left':
            case 'top-right':
            case 'bottom-left':
            case 'bottom-right':
              l.position(val).div(void 0).show(true);
              break;
            case 'true':
            case '':
              l.position('top-right').show(true).div(void 0);
              break;
            default:
              legendDiv = d3.select(val);
              if (legendDiv.empty()) {
                $log.warn('legend reference does not exist:', val);
                l.div(void 0).show(false);
              } else {
                l.div(legendDiv).position('top-left').show(true);
              }
          }
          l.scale(me).layout(layout);
          if (me.parent()) {
            l.register(me.parent());
          }
          return l.redraw();
        }
      });

      /**
          @ngdoc attr
          @name valuesLegend
          @usedBy dimension
          @param valuesLegend {expression}
       */
      attrs.$observe('valuesLegend', function(val) {
        var l, legendDiv;
        if (val !== void 0) {
          l = me.legend();
          l.showValues(true);
          switch (val) {
            case 'false':
              l.show(false);
              break;
            case 'top-left':
            case 'top-right':
            case 'bottom-left':
            case 'bottom-right':
              l.position(val).div(void 0).show(true);
              break;
            case 'true':
            case '':
              l.position('top-right').show(true).div(void 0);
              break;
            default:
              legendDiv = d3.select(val);
              if (legendDiv.empty()) {
                $log.warn('legend reference does not exist:', val);
                l.div(void 0).show(false);
              } else {
                l.div(legendDiv).position('top-left').show(true);
              }
          }
          l.scale(me).layout(layout);
          if (me.parent()) {
            l.register(me.parent());
          }
          return l.redraw();
        }
      });

      /**
          @ngdoc attr
          @name legendTitle
          @usedBy dimension
          @param legendTitle {expression}
       */
      return attrs.$observe('legendTitle', function(val) {
        if (val !== void 0) {
          return me.legend().title(val).redraw();
        }
      });
    },
    observerRangeAttributes: function(attrs, me) {

      /**
          @ngdoc attr
          @name lowerProperty
          @usedBy dimension.rangeX, dimension.rangeY
          @param lowerProperty {expression}
       */
      attrs.$observe('lowerProperty', function(val) {
        null;
        return me.lowerProperty(parseList(val)).update();
      });

      /**
          @ngdoc attr
          @name upperProperty
          @usedBy dimension.rangeX, dimension.rangeY
          @param upperProperty {expression}
       */
      return attrs.$observe('upperProperty', function(val) {
        null;
        return me.upperProperty(parseList(val)).update();
      });
    }
  };
});


/**
  @ngdoc dimension
  @name shape
  @module wk.chart
  @restrict E
  @description

  describes how the chart data is translated into shape objects in teh chart
 */
angular.module('wk.chart').directive('shape', function($log, scale, d3Shapes, scaleUtils) {
  var scaleCnt;
  scaleCnt = 0;
  return {
    restrict: 'E',
    require: ['shape', '^chart', '?^layout'],
    controller: function($element) {
      return this.me = scale();
    },
    link: function(scope, element, attrs, controllers) {
      var chart, layout, me, name, _ref;
      me = controllers[0].me;
      chart = controllers[1].me;
      layout = (_ref = controllers[2]) != null ? _ref.me : void 0;
      if (!(chart || layout)) {
        $log.error('scale needs to be contained in a chart or layout directive ');
        return;
      }
      name = 'shape';
      me.kind(name);
      me.parent(layout || chart);
      me.chart(chart);
      me.scaleType('ordinal');
      me.scale().range(d3Shapes);
      element.addClass(me.id());
      chart.addScale(me, layout);
      me.register();
      scaleUtils.observeSharedAttributes(attrs, me);
      return scaleUtils.observeLegendAttributes(attrs, me, layout);
    }
  };
});


/**
  @ngdoc dimension
  @name size
  @module wk.chart
  @restrict E
  @description

  describes how the chart data is translated into the size of chart objects
 */
angular.module('wk.chart').directive('size', function($log, scale, scaleUtils) {
  var scaleCnt;
  scaleCnt = 0;
  return {
    restrict: 'E',
    require: ['size', '^chart', '?^layout'],
    controller: function($element) {
      return this.me = scale();
    },
    link: function(scope, element, attrs, controllers) {
      var chart, layout, me, name, _ref;
      me = controllers[0].me;
      chart = controllers[1].me;
      layout = (_ref = controllers[2]) != null ? _ref.me : void 0;
      if (!(chart || layout)) {
        $log.error('scale needs to be contained in a chart or layout directive ');
        return;
      }
      name = 'size';
      me.kind(name);
      me.parent(layout || chart);
      me.chart(chart);
      me.scaleType('linear');
      me.resetOnNewData(true);
      element.addClass(me.id());
      chart.addScale(me, layout);
      me.register();
      scaleUtils.observeSharedAttributes(attrs, me);
      return scaleUtils.observeLegendAttributes(attrs, me, layout);
    }
  };
});


/**
  @ngdoc dimension
  @name x
  @module wk.chart
  @restrict E
  @description

  This dimension defined the horizontal axis of the chart

  @param {string} axis
  Define if a horizontal axis should be displayed Possible values:
 */
angular.module('wk.chart').directive('x', function($log, scale, scaleUtils) {
  var scaleCnt;
  scaleCnt = 0;
  return {
    restrict: 'E',
    require: ['x', '^chart', '?^layout'],
    controller: function($element) {
      return this.me = scale();
    },
    link: function(scope, element, attrs, controllers) {
      var chart, layout, me, name, _ref;
      me = controllers[0].me;
      chart = controllers[1].me;
      layout = (_ref = controllers[2]) != null ? _ref.me : void 0;
      if (!(chart || layout)) {
        $log.error('scale needs to be contained in a chart or layout directive ');
        return;
      }
      name = 'x';
      me.kind(name);
      me.parent(layout || chart);
      me.chart(chart);
      me.scaleType('linear');
      me.resetOnNewData(true);
      me.isHorizontal(true);
      me.register();
      element.addClass(me.id());
      chart.addScale(me, layout);
      scaleUtils.observeSharedAttributes(attrs, me);
      attrs.$observe('axis', function(val) {
        if (val !== void 0) {
          if (val !== 'false') {
            if (val === 'top' || val === 'bottom') {
              me.axisOrient(val).showAxis(true);
            } else {
              me.axisOrient('bottom').showAxis(true);
            }
          } else {
            me.showAxis(false).axisOrient(void 0);
          }
          return me.update(true);
        }
      });
      scaleUtils.observeAxisAttributes(attrs, me, scope);
      scaleUtils.observeLegendAttributes(attrs, me, layout);
      return attrs.$observe('rotateTickLabels', function(val) {
        if (val && _.isNumber(+val)) {
          me.rotateTickLabels(+val);
        } else {
          me.rotateTickLabels(void 0);
        }
        return me.update(true);
      });
    }
  };
});


/**
  @ngdoc dimension
  @name rangeX
  @module wk.chart
  @restrict E
  @description

  describes how the chart data is translated into horizontal ranges for the chart objects
 */
angular.module('wk.chart').directive('rangeX', function($log, scale, scaleUtils) {
  var scaleCnt;
  scaleCnt = 0;
  return {
    restrict: 'E',
    require: ['rangeX', '^chart', '?^layout'],
    controller: function($element) {
      return this.me = scale();
    },
    link: function(scope, element, attrs, controllers) {
      var chart, layout, me, name, _ref;
      me = controllers[0].me;
      chart = controllers[1].me;
      layout = (_ref = controllers[2]) != null ? _ref.me : void 0;
      if (!(chart || layout)) {
        $log.error('scale needs to be contained in a chart or layout directive ');
        return;
      }
      name = 'rangeX';
      me.kind(name);
      me.parent(layout || chart);
      me.chart(chart);
      me.scaleType('linear');
      me.resetOnNewData(true);
      me.isHorizontal(true);
      me.register();
      element.addClass(me.id());
      chart.addScale(me, layout);
      scaleUtils.observeSharedAttributes(attrs, me);
      attrs.$observe('axis', function(val) {
        if (val !== void 0) {
          if (val !== 'false') {
            if (val === 'top' || val === 'bottom') {
              me.axisOrient(val).showAxis(true);
            } else {
              me.axisOrient('bottom').showAxis(true);
            }
          } else {
            me.showAxis(false).axisOrient(void 0);
          }
          return me.update(true);
        }
      });
      scaleUtils.observeAxisAttributes(attrs, me, scope);
      scaleUtils.observeLegendAttributes(attrs, me, layout);
      scaleUtils.observerRangeAttributes(attrs, me);
      return attrs.$observe('rotateTickLabels', function(val) {
        if (val && _.isNumber(+val)) {
          me.rotateTickLabels(+val);
        } else {
          me.rotateTickLabels(void 0);
        }
        return me.update(true);
      });
    }
  };
});


/**
  @ngdoc dimension
  @name y
  @module wk.chart
  @restrict E
  @description

  This dimension defined the vertical axis of the chart

  @param {string} axis
  Define if a vertical axis should be displayed Possible values:
 */
angular.module('wk.chart').directive('y', function($log, scale, legend, scaleUtils) {
  var scaleCnt;
  scaleCnt = 0;
  return {
    restrict: 'E',
    require: ['y', '^chart', '?^layout'],
    controller: function($element) {
      return this.me = scale();
    },
    link: function(scope, element, attrs, controllers) {
      var chart, layout, me, name, _ref;
      me = controllers[0].me;
      chart = controllers[1].me;
      layout = (_ref = controllers[2]) != null ? _ref.me : void 0;
      if (!(chart || layout)) {
        $log.error('scale needs to be contained in a chart or layout directive ');
        return;
      }
      name = 'y';
      me.kind(name);
      me.parent(layout || chart);
      me.chart(chart);
      me.scaleType('linear');
      me.isVertical(true);
      me.resetOnNewData(true);
      element.addClass(me.id());
      chart.addScale(me, layout);
      me.register();
      scaleUtils.observeSharedAttributes(attrs, me);
      attrs.$observe('axis', function(val) {
        if (val !== void 0) {
          if (val !== 'false') {
            if (val === 'left' || val === 'right') {
              me.axisOrient(val).showAxis(true);
            } else {
              me.axisOrient('left').showAxis(true);
            }
          } else {
            me.showAxis(false).axisOrient(void 0);
          }
          return me.update(true);
        }
      });
      scaleUtils.observeAxisAttributes(attrs, me, scope);
      return scaleUtils.observeLegendAttributes(attrs, me, layout);
    }
  };
});


/**
  @ngdoc dimension
  @name rangeY
  @module wk.chart
  @restrict E
  @description

  describes how the chart data is translated into vertical ranges for the chart objects
 */
angular.module('wk.chart').directive('rangeY', function($log, scale, legend, scaleUtils) {
  var scaleCnt;
  scaleCnt = 0;
  return {
    restrict: 'E',
    require: ['rangeY', '^chart', '?^layout'],
    controller: function($element) {
      return this.me = scale();
    },
    link: function(scope, element, attrs, controllers) {
      var chart, layout, me, name, _ref;
      me = controllers[0].me;
      chart = controllers[1].me;
      layout = (_ref = controllers[2]) != null ? _ref.me : void 0;
      if (!(chart || layout)) {
        $log.error('scale needs to be contained in a chart or layout directive ');
        return;
      }
      name = 'rangeY';
      me.kind(name);
      me.parent(layout || chart);
      me.chart(chart);
      me.scaleType('linear');
      me.isVertical(true);
      me.resetOnNewData(true);
      element.addClass(me.id());
      chart.addScale(me, layout);
      me.register();
      scaleUtils.observeSharedAttributes(attrs, me);
      attrs.$observe('axis', function(val) {
        if (val !== void 0) {
          if (val !== 'false') {
            if (val === 'left' || val === 'right') {
              me.axisOrient(val).showAxis(true);
            } else {
              me.axisOrient('left').showAxis(true);
            }
          } else {
            me.showAxis(false).axisOrient(void 0);
          }
          return me.update(true);
        }
      });
      scaleUtils.observeAxisAttributes(attrs, me, scope);
      scaleUtils.observeLegendAttributes(attrs, me, layout);
      return scaleUtils.observerRangeAttributes(attrs, me);
    }
  };
});

angular.module('wk.chart').service('selectionSharing', function($log) {
  var callbacks, _selection, _selectionIdxRange;
  _selection = {};
  _selectionIdxRange = {};
  callbacks = {};
  this.createGroup = function(group) {};
  this.setSelection = function(selection, selectionIdxRange, group) {
    var cb, _i, _len, _ref, _results;
    if (group) {
      _selection[group] = selection;
      _selectionIdxRange[group] = selectionIdxRange;
      if (callbacks[group]) {
        _ref = callbacks[group];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          _results.push(cb(selection, selectionIdxRange));
        }
        return _results;
      }
    }
  };
  this.getSelection = function(group) {
    var grp;
    grp = group || 'default';
    return selection[grp];
  };
  this.register = function(group, callback) {
    if (group) {
      if (!callbacks[group]) {
        callbacks[group] = [];
      }
      if (!_.contains(callbacks[group], callback)) {
        return callbacks[group].push(callback);
      }
    }
  };
  this.unregister = function(group, callback) {
    var idx;
    if (callbacks[group]) {
      idx = callbacks[group].indexOf(callback);
      if (idx >= 0) {
        return callbacks[group].splice(idx, 1);
      }
    }
  };
  return this;
});

angular.module('wk.chart').service('timing', function($log) {
  var elapsed, elapsedStart, timers;
  timers = {};
  elapsedStart = 0;
  elapsed = 0;
  this.init = function() {
    return elapsedStart = Date.now();
  };
  this.start = function(topic) {
    var top;
    top = timers[topic];
    if (!top) {
      top = timers[topic] = {
        name: topic,
        start: 0,
        total: 0,
        callCnt: 0,
        active: false
      };
    }
    top.start = Date.now();
    return top.active = true;
  };
  this.stop = function(topic) {
    var top;
    if (top = timers[topic]) {
      top.active = false;
      top.total += Date.now() - top.start;
      top.callCnt += 1;
    }
    return elapsed = Date.now() - elapsedStart;
  };
  this.report = function() {
    var topic, val;
    for (topic in timers) {
      val = timers[topic];
      val.avg = val.total / val.callCnt;
    }
    $log.info(timers);
    $log.info('Elapsed Time (ms)', elapsed);
    return timers;
  };
  this.clear = function() {
    return timers = {};
  };
  return this;
});

angular.module('wk.chart').factory('layeredData', function($log) {
  var layered;
  return layered = function() {
    var me, _calcTotal, _data, _layerKeys, _max, _min, _tMax, _tMin, _x;
    _data = [];
    _layerKeys = [];
    _x = void 0;
    _calcTotal = false;
    _min = Infinity;
    _max = -Infinity;
    _tMin = Infinity;
    _tMax = -Infinity;
    me = function() {};
    me.data = function(dat) {
      if (arguments.length(Is(0))) {
        return _data;
      } else {
        _data = dat;
        return me;
      }
    };
    me.layerKeys = function(keys) {
      if (arguments.length === 0) {
        return _layerKeys;
      } else {
        _layerKeys = keys;
        return me;
      }
    };
    me.x = function(name) {
      if (arguments.length === 0) {
        return _x;
      } else {
        _x = name;
        return me;
      }
    };
    me.calcTotal = function(t_f) {
      if (arguments.length === 0) {
        return _calcTotal;
      } else {
        _calcTotal = t_f;
        return me;
      }
    };
    me.min = function() {
      return _min;
    };
    me.max = function() {
      return _max;
    };
    me.minTotal = function() {
      return _tMin;
    };
    me.maxTotal = function() {
      return _tMax;
    };
    me.extent = function() {
      return [me.min(), me.max()];
    };
    me.totalExtent = function() {
      return [me.minTotal(), me.maxTotal()];
    };
    me.columns = function(data) {
      var d, i, k, l, res, t, v, xv, _i, _j, _k, _len, _len1, _len2;
      if (arguments.length === 1) {
        res = [];
        _min = Infinity;
        _max = -Infinity;
        _tMin = Infinity;
        _tMax = -Infinity;
        for (i = _i = 0, _len = _layerKeys.length; _i < _len; i = ++_i) {
          k = _layerKeys[i];
          res[i] = {
            key: k,
            value: [],
            min: Infinity,
            max: -Infinity
          };
        }
        for (i = _j = 0, _len1 = data.length; _j < _len1; i = ++_j) {
          d = data[i];
          t = 0;
          xv = typeof _x === 'string' ? d[_x] : _x(d);
          for (_k = 0, _len2 = res.length; _k < _len2; _k++) {
            l = res[_k];
            v = +d[l.key];
            l.value.push({
              x: xv,
              value: v,
              key: l.key
            });
            if (l.max < v) {
              l.max = v;
            }
            if (l.min > v) {
              l.min = v;
            }
            if (_max < v) {
              _max = v;
            }
            if (_min > v) {
              _min = v;
            }
            if (_calcTotal) {
              t += +v;
            }
          }
          if (_calcTotal) {
            if (_tMax < t) {
              _tMax = t;
            }
            if (_tMin > t) {
              _tMin = t;
            }
          }
        }
        return {
          min: _min,
          max: _max,
          totalMin: _tMin,
          totalMax: _tMax,
          data: res
        };
      }
      return me;
    };
    me.rows = function(data) {
      if (arguments.length === 1) {
        return data.map(function(d) {
          return {
            x: d[_x],
            layers: layerKeys.map(function(k) {
              return {
                key: k,
                value: d[k],
                x: d[_x]
              };
            })
          };
        });
      }
      return me;
    };
    return me;
  };
});

angular.module('wk.chart').directive('svgIcon', function($log) {
  return {
    restrict: 'E',
    template: '<svg ng-style="style"><path></path></svg>',
    scope: {
      path: "=",
      width: "@"
    },
    link: function(scope, elem, attrs) {
      scope.style = {
        height: '20px',
        width: scope.width + 'px',
        'vertical-align': 'middle'
      };
      return scope.$watch('path', function(val) {
        if (val) {
          return d3.select(elem[0]).select('path').attr('d', val).attr('transform', "translate(8,8)");
        }
      });
    }
  };
});

angular.module('wk.chart').service('utils', function($log) {
  var id;
  this.diff = function(a, b, direction) {
    var i, j, notInB, res;
    notInB = function(v) {
      return b.indexOf(v) < 0;
    };
    res = {};
    i = 0;
    while (i < a.length) {
      if (notInB(a[i])) {
        res[a[i]] = void 0;
        j = i + direction;
        while ((0 <= j && j < a.length)) {
          if (notInB(a[j])) {
            j += direction;
          } else {
            res[a[i]] = a[j];
            break;
          }
        }
      }
      i++;
    }
    return res;
  };
  id = 0;
  this.getId = function() {
    return 'Chart' + id++;
  };
  this.parseList = function(val) {
    var l;
    if (val) {
      l = val.trim().replace(/^\[|\]$/g, '').split(',').map(function(d) {
        return d.replace(/^[\"|']|[\"|']$/g, '');
      });
      if (l.length === 1) {
        return l[0];
      } else {
        return l;
      }
    }
    return void 0;
  };
  this.parseTrueFalse = function(val) {
    if (val === '' || val === 'true') {
      return true;
    } else {
      if (val === 'false') {
        return false;
      } else {
        return void 0;
      }
    }
  };
  this.mergeData = function() {
    var me, _common, _data, _first, _hash, _key, _last, _layerKey, _prevCommon, _prevData, _prevHash;
    _prevData = [];
    _data = [];
    _prevHash = {};
    _hash = {};
    _prevCommon = [];
    _common = [];
    _first = void 0;
    _last = void 0;
    _key = function(d) {
      return d;
    };
    _layerKey = function(d) {
      return d;
    };
    me = function(data) {
      var d, i, j, key, _i, _j, _len, _len1;
      _prevData = [];
      _prevHash = {};
      for (i = _i = 0, _len = _data.length; _i < _len; i = ++_i) {
        d = _data[i];
        _prevData[i] = d;
        _prevHash[_key(d)] = i;
      }
      _prevCommon = [];
      _common = [];
      _hash = {};
      _data = data;
      for (j = _j = 0, _len1 = _data.length; _j < _len1; j = ++_j) {
        d = _data[j];
        key = _key(d);
        _hash[key] = j;
        if (_prevHash.hasOwnProperty(key)) {
          _prevCommon[_prevHash[key]] = true;
          _common[j] = true;
        }
      }
      return me;
    };
    me.key = function(fn) {
      if (!arguments) {
        return _key;
      }
      _key = fn;
      return me;
    };
    me.first = function(first) {
      if (!arguments) {
        return _first;
      }
      _first = first;
      return me;
    };
    me.last = function(last) {
      if (!arguments) {
        return _last;
      }
      _last = last;
      return me;
    };
    me.added = function() {
      var d, i, ret, _i, _len;
      ret = [];
      for (i = _i = 0, _len = _data.length; _i < _len; i = ++_i) {
        d = _data[i];
        if (!_common[i]) {
          ret.push(_d);
        }
      }
      return ret;
    };
    me.deleted = function() {
      var i, p, ret, _i, _len;
      ret = [];
      for (i = _i = 0, _len = _prevData.length; _i < _len; i = ++_i) {
        p = _prevData[i];
        if (!_prevCommon[i]) {
          ret.push(_prevData[i]);
        }
      }
      return ret;
    };
    me.current = function(key) {
      return _data[_hash[key]];
    };
    me.prev = function(key) {
      return _prevData[_prevHash[key]];
    };
    me.addedPred = function(added) {
      var predIdx;
      predIdx = _hash[_key(added)];
      while (!_common[predIdx]) {
        if (predIdx-- < 0) {
          return _first;
        }
      }
      return _prevData[_prevHash[_key(_data[predIdx])]];
    };
    me.addedPred.left = function(added) {
      return me.addedPred(added).x;
    };
    me.addedPred.right = function(added) {
      var obj;
      obj = me.addedPred(added);
      if (_.has(obj, 'width')) {
        return obj.x + obj.width;
      } else {
        return obj.x;
      }
    };
    me.deletedSucc = function(deleted) {
      var succIdx;
      succIdx = _prevHash[_key(deleted)];
      while (!_prevCommon[succIdx]) {
        if (succIdx++ >= _prevData.length) {
          return _last;
        }
      }
      return _data[_hash[_key(_prevData[succIdx])]];
    };
    return me;
  };
  this.mergeSeriesSorted = function(aOld, aNew) {
    var iNew, iOld, lMax, lNewMax, lOldMax, result;
    iOld = 0;
    iNew = 0;
    lOldMax = aOld.length - 1;
    lNewMax = aNew.length - 1;
    lMax = Math.max(lOldMax, lNewMax);
    result = [];
    while (iOld <= lOldMax && iNew <= lNewMax) {
      if (+aOld[iOld] === +aNew[iNew]) {
        result.push([iOld, Math.min(iNew, lNewMax), aOld[iOld]]);
        iOld++;
        iNew++;
      } else if (+aOld[iOld] < +aNew[iNew]) {
        result.push([iOld, void 0, aOld[iOld]]);
        iOld++;
      } else {
        result.push([void 0, Math.min(iNew, lNewMax), aNew[iNew]]);
        iNew++;
      }
    }
    while (iOld <= lOldMax) {
      result.push([iOld, void 0, aOld[iOld]]);
      iOld++;
    }
    while (iNew <= lNewMax) {
      result.push([void 0, Math.min(iNew, lNewMax), aNew[iNew]]);
      iNew++;
    }
    return result;
  };
  this.mergeSeriesUnsorted = function(aOld, aNew) {
    var iNew, iOld, lMax, lNewMax, lOldMax, result;
    iOld = 0;
    iNew = 0;
    lOldMax = aOld.length - 1;
    lNewMax = aNew.length - 1;
    lMax = Math.max(lOldMax, lNewMax);
    result = [];
    while (iOld <= lOldMax && iNew <= lNewMax) {
      if (aOld[iOld] === aNew[iNew]) {
        result.push([iOld, Math.min(iNew, lNewMax), aOld[iOld]]);
        iOld++;
        iNew++;
      } else if (aNew.indexOf(aOld[iOld]) < 0) {
        result.push([iOld, void 0, aOld[iOld]]);
        iOld++;
      } else {
        result.push([void 0, Math.min(iNew, lNewMax), aNew[iNew]]);
        iNew++;
      }
    }
    while (iOld <= lOldMax) {
      result.push([iOld, void 0, aOld[iOld]]);
      iOld++;
    }
    while (iNew <= lNewMax) {
      result.push([void 0, Math.min(iNew, lNewMax), aNew[iNew]]);
      iNew++;
    }
    return result;
  };
  return this;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3drLWNoYXJ0cy9hcHAvY29uZmlnL3drQ2hhcnRDb25zdGFudHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL1Jlc2l6ZVNlbnNvci5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9kMy5nZW8uem9vbS5qcyIsInRlbXBsYXRlcy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL3NhdmVTdmdBc1BuZy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2NoYXJ0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2xheW91dC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2NvbnRhaW5lci9wcmludC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2NvbnRhaW5lci9zZWxlY3Rpb24uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWEuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWFTdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhU3RhY2tlZFZlcnRpY2FsLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhVmVydGljYWwuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2Jhci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYmFyQ2x1c3RlcmVkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9iYXJTdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9idWJibGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2NvbHVtbi5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvY29sdW1uQ2x1c3RlcmVkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9jb2x1bW5TdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9nYXVnZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvZ2VvTWFwLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9oaXN0b2dyYW0uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2xpbmUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2xpbmVWZXJ0aWNhbC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvcGllLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9zY2F0dGVyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9zcGlkZXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JCcnVzaC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9iZWhhdmlvclNlbGVjdC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9iZWhhdmlvclRvb2x0aXAuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JzLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2NoYXJ0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2NvbnRhaW5lci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9sYXlvdXQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvbGVnZW5kLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL3NjYWxlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL3NjYWxlTGlzdC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3Byb3ZpZGVycy9sb2NhbGl6YXRpb24uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9wcm92aWRlcnMvc2NhbGVFeHRlbnRpb24uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvY29sb3IuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2NhbGVVdGlscy5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy9zaGFwZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy9zaXplLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3guY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMveFJhbmdlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3kuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMveVJhbmdlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2VydmljZXMvc2VsZWN0aW9uU2hhcmluZy5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NlcnZpY2VzL3RpbWVyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9sYXllckRhdGEuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL3N2Z0ljb24uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL3V0aWxpdGllcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQTs7Ozs7Ozs7Ozs7O0dBQUE7QUFBQSxPQWFPLENBQUMsTUFBUixDQUFlLFVBQWYsRUFBMkIsRUFBM0IsQ0FiQSxDQUFBOztBQWlCQTtBQUFBOztHQWpCQTs7QUFBQSxPQW9CTyxDQUFDLE1BQVIsQ0FBZSxVQUFmLENBQTBCLENBQUMsUUFBM0IsQ0FBb0MsaUJBQXBDLEVBQXVELENBQ25ELFNBRG1ELEVBRW5ELFlBRm1ELEVBR25ELFlBSG1ELEVBSW5ELGFBSm1ELEVBS25ELGFBTG1ELENBQXZELENBcEJBLENBQUE7O0FBNEJBO0FBQUE7O0dBNUJBOztBQUFBLE9BK0JPLENBQUMsTUFBUixDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxRQUEzQixDQUFvQyxnQkFBcEMsRUFB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SUFBSyxDQUFBLElBQUEsQ0FBdEIsQ0FBWixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUEsRUFGQSxDQUZGO0lBQUEsQ0F4QkE7QUE4QkEsV0FBTSxJQUFBLElBQVEsT0FBZCxHQUFBO0FBRUUsTUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLENBQUMsTUFBRCxFQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBVCxFQUFjLE9BQWQsQ0FBWixFQUFtQyxJQUFLLENBQUEsSUFBQSxDQUF4QyxDQUFaLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQSxFQUZBLENBRkY7SUFBQSxDQTlCQTtBQW9DQSxXQUFPLE1BQVAsQ0FyQ3FCO0VBQUEsQ0F6S3ZCLENBQUE7QUFnTkEsU0FBTyxJQUFQLENBcE4wQztBQUFBLENBQTVDLENBQUEsQ0FBQSIsImZpbGUiOiJ3ay1jaGFydHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMjIypcbiAgQG5nZG9jIG1vZHVsZVxuICBAbmFtZSB3ay5jaGFydFxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEBkZXNjcmlwdGlvblxuICB3ay1jaGFydHMgbW9kdWxlIC0gYmVhdXRpZnVsIGNoYXJ0cyBkZWZpbmVkIHRocm91Z2ggSFRNTCBtYXJrdXAsIGJhc2VkIG9uIEFuZ3VsYXJKc1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICoqIHdpZGUgcmFuZ2Ugb2YgY2hhcnRzXG4gICoqIG5pY2VseSBhbmltYXRlZFxuICAqKiBpbXBsZW1lbnRlZCBhcyBBbmd1bGFySnMgRGlyZWN0aXZlcyAgLT4gZGVmaW5lZCBhcyBtYXJrdXBcbiAgKiogQW5ndWxhciBkYXRhIGJpbmRpbmcgZm9yIGRhdGEgYW4gY2hhcnQgYXR0cmlidXRlc1xuIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnLCBbXSlcblxuXG5cbiMjIypcbiAgIGxpc3RzIHRoZSBvcmRpbmFsIHNjYWxlIG9iamVjdHMsXG4gIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNPcmRpbmFsU2NhbGVzJywgW1xuICAgICdvcmRpbmFsJ1xuICAgICdjYXRlZ29yeTEwJ1xuICAgICdjYXRlZ29yeTIwJ1xuICAgICdjYXRlZ29yeTIwYidcbiAgICAnY2F0ZWdvcnkyMGMnXG5dXG5cbiMjIypcbiAgU2V0cyB0aGUgZGVmYXVsdCBtYXJnaW5zIGFuZCBwYWRkaW5ncyBmb3IgdGhlIGNoYXJ0IGxheW91dFxuIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnd2tDaGFydE1hcmdpbnMnLCB7XG4gIHRvcDogMTBcbiAgbGVmdDogNTBcbiAgYm90dG9tOiA0MFxuICByaWdodDogMjBcbiAgdG9wQm90dG9tTWFyZ2luOntheGlzOjI1LCBsYWJlbDoxOH1cbiAgbGVmdFJpZ2h0TWFyZ2luOntheGlzOjQwLCBsYWJlbDoyMH1cbiAgbWluTWFyZ2luOjhcbiAgZGVmYXVsdDpcbiAgICB0b3A6IDhcbiAgICBsZWZ0OjhcbiAgICBib3R0b206OFxuICAgIHJpZ2h0OjEwXG4gIGF4aXM6XG4gICAgdG9wOjI1XG4gICAgYm90dG9tOjI1XG4gICAgbGVmdDo0MFxuICAgIHJpZ2h0OjQwXG4gIGxhYmVsOlxuICAgIHRvcDoxOFxuICAgIGJvdHRvbToxOFxuICAgIGxlZnQ6MjBcbiAgICByaWdodDoyMFxuICBkYXRhTGFiZWxQYWRkaW5nOiB7XG4gICAgaG9yOjVcbiAgICB2ZXJ0OjVcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNTaGFwZXMnLCBbXG4gICdjaXJjbGUnLFxuICAnY3Jvc3MnLFxuICAndHJpYW5nbGUtZG93bicsXG4gICd0cmlhbmdsZS11cCcsXG4gICdzcXVhcmUnLFxuICAnZGlhbW9uZCdcbl1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2F4aXNDb25maWcnLCB7XG4gIGxhYmVsRm9udFNpemU6ICcxLjZlbSdcbiAgeDpcbiAgICBheGlzUG9zaXRpb25zOiBbJ3RvcCcsICdib3R0b20nXVxuICAgIGF4aXNPZmZzZXQ6IHtib3R0b206J2hlaWdodCd9XG4gICAgYXhpc1Bvc2l0aW9uRGVmYXVsdDogJ2JvdHRvbSdcbiAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJ1xuICAgIG1lYXN1cmU6ICd3aWR0aCdcbiAgICBsYWJlbFBvc2l0aW9uczpbJ291dHNpZGUnLCAnaW5zaWRlJ11cbiAgICBsYWJlbFBvc2l0aW9uRGVmYXVsdDogJ291dHNpZGUnXG4gICAgbGFiZWxPZmZzZXQ6XG4gICAgICB0b3A6ICcxZW0nXG4gICAgICBib3R0b206ICctMC44ZW0nXG4gIHk6XG4gICAgYXhpc1Bvc2l0aW9uczogWydsZWZ0JywgJ3JpZ2h0J11cbiAgICBheGlzT2Zmc2V0OiB7cmlnaHQ6J3dpZHRoJ31cbiAgICBheGlzUG9zaXRpb25EZWZhdWx0OiAnbGVmdCdcbiAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCdcbiAgICBtZWFzdXJlOiAnaGVpZ2h0J1xuICAgIGxhYmVsUG9zaXRpb25zOlsnb3V0c2lkZScsICdpbnNpZGUnXVxuICAgIGxhYmVsUG9zaXRpb25EZWZhdWx0OiAnb3V0c2lkZSdcbiAgICBsYWJlbE9mZnNldDpcbiAgICAgIGxlZnQ6ICcxLjJlbSdcbiAgICAgIHJpZ2h0OiAnMS4yZW0nXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM0FuaW1hdGlvbicsIHtcbiAgZHVyYXRpb246NTAwXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICd0ZW1wbGF0ZURpcicsICd0ZW1wbGF0ZXMvJ1xuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZm9ybWF0RGVmYXVsdHMnLCB7XG4gIGRhdGU6ICcleCcgIyAnJWQuJW0uJVknXG4gIG51bWJlciA6ICAnLC4yZidcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2JhckNvbmZpZycsIHtcbiAgcGFkZGluZzogMC4xXG4gIG91dGVyUGFkZGluZzogMFxufVxuXG4iLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBkaW1lbnNpb24gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W118RWxlbWVudHN8alF1ZXJ5fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHRoaXMuUmVzaXplU2Vuc29yID0gZnVuY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gRXZlbnRRdWV1ZSgpIHtcbiAgICAgICAgICAgIHRoaXMucSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHRoaXMucS5wdXNoKGV2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSB0aGlzLnEubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucVtpXS5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNpemVkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCByZXNpemVkKSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQgPSBuZXcgRXZlbnRRdWV1ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmNsYXNzTmFtZSA9ICd3ay1jaGFydC1yZXNpemUtc2Vuc29yJztcbiAgICAgICAgICAgIHZhciBzdHlsZSA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IHNjcm9sbDsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xuICAgICAgICAgICAgdmFyIHN0eWxlQ2hpbGQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7JztcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3ay1jaGFydC1yZXNpemUtc2Vuc29yLWV4cGFuZFwiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwid2stY2hhcnQtcmVzaXplLXNlbnNvci1zaHJpbmtcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJyB3aWR0aDogMjAwJTsgaGVpZ2h0OiAyMDAlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQucmVzaXplU2Vuc29yKTtcbiAgICAgICAgICAgIGlmICghe2ZpeGVkOiAxLCBhYnNvbHV0ZTogMX1bZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKV0pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBleHBhbmQgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGV4cGFuZENoaWxkID0gZXhwYW5kLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgc2hyaW5rID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmtDaGlsZCA9IHNocmluay5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGxhc3RXaWR0aCwgbGFzdEhlaWdodDtcbiAgICAgICAgICAgIHZhciByZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLndpZHRoID0gZXhwYW5kLm9mZnNldFdpZHRoICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLmhlaWdodCA9IGV4cGFuZC5vZmZzZXRIZWlnaHQgKyAxMCArICdweCc7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbExlZnQgPSBleHBhbmQuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbFRvcCA9IGV4cGFuZC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbExlZnQgPSBzaHJpbmsuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbFRvcCA9IHNocmluay5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGFzdFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBsYXN0SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuY2FsbCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBjYikge1xuICAgICAgICAgICAgICAgIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgbmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGRFdmVudChleHBhbmQsICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA+IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhZGRFdmVudChzaHJpbmssICdzY3JvbGwnLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoIDwgbGFzdFdpZHRoIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IDwgbGFzdEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJbb2JqZWN0IEFycmF5XVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZWxlbWVudClcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSAmJiBlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5KSAvL2pxdWVyeVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgRWxlbWVudHMgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnRzKSAvL21vb3Rvb2xzXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBpID0gMCwgaiA9IGVsZW1lbnQubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50W2ldLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpIiwiIyMjKlxuICBAbmdkb2MgYmVoYXZpb3JcbiAgQG5hbWUgYnJ1c2hcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgQVxuICBAZGVzY3JpcHRpb25cblxuICBlbmFibGUgYnJ1c2hpbmcgYmVoYXZpb3JcbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdicnVzaCcsICgkbG9nLCBzZWxlY3Rpb25TaGFyaW5nLCBiZWhhdmlvcikgLT5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogWydeY2hhcnQnLCAnXmxheW91dCcsICc/eCcsICc/eScsJz9yYW5nZVgnLCAnP3JhbmdlWSddXG4gICAgc2NvcGU6XG4gICAgICBicnVzaEV4dGVudDogJz0nXG4gICAgICBzZWxlY3RlZFZhbHVlczogJz0nXG4gICAgICBzZWxlY3RlZERvbWFpbjogJz0nXG4gICAgICBjaGFuZ2U6ICcmJ1xuXG4gICAgbGluazooc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzFdPy5tZVxuICAgICAgeCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuICAgICAgeSA9IGNvbnRyb2xsZXJzWzNdPy5tZVxuICAgICAgcmFuZ2VYID0gY29udHJvbGxlcnNbNF0/Lm1lXG4gICAgICByYW5nZVkgPSBjb250cm9sbGVyc1s1XT8ubWVcbiAgICAgIHhTY2FsZSA9IHVuZGVmaW5lZFxuICAgICAgeVNjYWxlID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0YWJsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9icnVzaEFyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICAgIF9pc0FyZWFCcnVzaCA9IG5vdCB4IGFuZCBub3QgeVxuICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgYnJ1c2ggPSBjaGFydC5iZWhhdmlvcigpLmJydXNoXG4gICAgICBpZiBub3QgeCBhbmQgbm90IHkgYW5kIG5vdCByYW5nZVggYW5kIG5vdCByYW5nZVlcbiAgICAgICAgI2xheW91dCBicnVzaCwgZ2V0IHggYW5kIHkgZnJvbSBsYXlvdXQgc2NhbGVzXG4gICAgICAgIHNjYWxlcyA9IGxheW91dC5zY2FsZXMoKS5nZXRTY2FsZXMoWyd4JywgJ3knXSlcbiAgICAgICAgYnJ1c2gueChzY2FsZXMueClcbiAgICAgICAgYnJ1c2gueShzY2FsZXMueSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnJ1c2gueCh4IG9yIHJhbmdlWClcbiAgICAgICAgYnJ1c2gueSh5IG9yIHJhbmdlWSlcbiAgICAgIGJydXNoLmFjdGl2ZSh0cnVlKVxuXG4gICAgICBicnVzaC5ldmVudHMoKS5vbiAnYnJ1c2gnLCAoaWR4UmFuZ2UsIHZhbHVlUmFuZ2UsIGRvbWFpbikgLT5cbiAgICAgICAgaWYgYXR0cnMuYnJ1c2hFeHRlbnRcbiAgICAgICAgICBzY29wZS5icnVzaEV4dGVudCA9IGlkeFJhbmdlXG4gICAgICAgIGlmIGF0dHJzLnNlbGVjdGVkVmFsdWVzXG4gICAgICAgICAgc2NvcGUuc2VsZWN0ZWRWYWx1ZXMgPSB2YWx1ZVJhbmdlXG4gICAgICAgIGlmIGF0dHJzLnNlbGVjdGVkRG9tYWluXG4gICAgICAgICAgc2NvcGUuc2VsZWN0ZWREb21haW4gPSBkb21haW5cbiAgICAgICAgc2NvcGUuJGFwcGx5KClcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQuYnJ1c2gnLCAoZGF0YSkgLT5cbiAgICAgICAgYnJ1c2guZGF0YShkYXRhKVxuXG4gICAgICAjIyMqXG4gICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgIEBuYW1lIGJydXNoI2JydXNoXG4gICAgICAgIEBwYXJhbSBicnVzaCB7c3RyaW5nfSBCcnVzaCBuYW1lXG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdicnVzaCcsICh2YWwpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcodmFsKSBhbmQgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBicnVzaC5icnVzaEdyb3VwKHZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJydXNoLmJydXNoR3JvdXAodW5kZWZpbmVkKVxuICB9IiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzLCBKYXNvbiBEYXZpZXMsIGh0dHA6Ly93d3cuamFzb25kYXZpZXMuY29tXG4vLyBTZWUgTElDRU5TRS50eHQgZm9yIGRldGFpbHMuXG4oZnVuY3Rpb24oKSB7XG5cbnZhciByYWRpYW5zID0gTWF0aC5QSSAvIDE4MCxcbiAgICBkZWdyZWVzID0gMTgwIC8gTWF0aC5QSTtcblxuLy8gVE9ETyBtYWtlIGluY3JlbWVudGFsIHJvdGF0ZSBvcHRpb25hbFxuXG5kMy5nZW8uem9vbSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcHJvamVjdGlvbixcbiAgICAgIHpvb21Qb2ludCxcbiAgICAgIGV2ZW50ID0gZDMuZGlzcGF0Y2goXCJ6b29tc3RhcnRcIiwgXCJ6b29tXCIsIFwiem9vbWVuZFwiKSxcbiAgICAgIHpvb20gPSBkMy5iZWhhdmlvci56b29tKClcbiAgICAgICAgLm9uKFwiem9vbXN0YXJ0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBtb3VzZTAgPSBkMy5tb3VzZSh0aGlzKSxcbiAgICAgICAgICAgICAgcm90YXRlID0gcXVhdGVybmlvbkZyb21FdWxlcihwcm9qZWN0aW9uLnJvdGF0ZSgpKSxcbiAgICAgICAgICAgICAgcG9pbnQgPSBwb3NpdGlvbihwcm9qZWN0aW9uLCBtb3VzZTApO1xuICAgICAgICAgIGlmIChwb2ludCkgem9vbVBvaW50ID0gcG9pbnQ7XG5cbiAgICAgICAgICB6b29tT24uY2FsbCh6b29tLCBcInpvb21cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbi5zY2FsZShkMy5ldmVudC5zY2FsZSk7XG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlMSA9IGQzLm1vdXNlKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBiZXR3ZWVuID0gcm90YXRlQmV0d2Vlbih6b29tUG9pbnQsIHBvc2l0aW9uKHByb2plY3Rpb24sIG1vdXNlMSkpO1xuICAgICAgICAgICAgICAgIHByb2plY3Rpb24ucm90YXRlKGV1bGVyRnJvbVF1YXRlcm5pb24ocm90YXRlID0gYmV0d2VlblxuICAgICAgICAgICAgICAgICAgICA/IG11bHRpcGx5KHJvdGF0ZSwgYmV0d2VlbilcbiAgICAgICAgICAgICAgICAgICAgOiBtdWx0aXBseShiYW5rKHByb2plY3Rpb24sIG1vdXNlMCwgbW91c2UxKSwgcm90YXRlKSkpO1xuICAgICAgICAgICAgICAgIG1vdXNlMCA9IG1vdXNlMTtcbiAgICAgICAgICAgICAgICBldmVudC56b29tLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGV2ZW50Lnpvb21zdGFydC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJ6b29tZW5kXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHpvb21Pbi5jYWxsKHpvb20sIFwiem9vbVwiLCBudWxsKTtcbiAgICAgICAgICBldmVudC56b29tZW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0pLFxuICAgICAgem9vbU9uID0gem9vbS5vbjtcblxuICB6b29tLnByb2plY3Rpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB6b29tLnNjYWxlKChwcm9qZWN0aW9uID0gXykuc2NhbGUoKSkgOiBwcm9qZWN0aW9uO1xuICB9O1xuXG4gIHJldHVybiBkMy5yZWJpbmQoem9vbSwgZXZlbnQsIFwib25cIik7XG59O1xuXG5mdW5jdGlvbiBiYW5rKHByb2plY3Rpb24sIHAwLCBwMSkge1xuICB2YXIgdCA9IHByb2plY3Rpb24udHJhbnNsYXRlKCksXG4gICAgICBhbmdsZSA9IE1hdGguYXRhbjIocDBbMV0gLSB0WzFdLCBwMFswXSAtIHRbMF0pIC0gTWF0aC5hdGFuMihwMVsxXSAtIHRbMV0sIHAxWzBdIC0gdFswXSk7XG4gIHJldHVybiBbTWF0aC5jb3MoYW5nbGUgLyAyKSwgMCwgMCwgTWF0aC5zaW4oYW5nbGUgLyAyKV07XG59XG5cbmZ1bmN0aW9uIHBvc2l0aW9uKHByb2plY3Rpb24sIHBvaW50KSB7XG4gIHZhciB0ID0gcHJvamVjdGlvbi50cmFuc2xhdGUoKSxcbiAgICAgIHNwaGVyaWNhbCA9IHByb2plY3Rpb24uaW52ZXJ0KHBvaW50KTtcbiAgcmV0dXJuIHNwaGVyaWNhbCAmJiBpc0Zpbml0ZShzcGhlcmljYWxbMF0pICYmIGlzRmluaXRlKHNwaGVyaWNhbFsxXSkgJiYgY2FydGVzaWFuKHNwaGVyaWNhbCk7XG59XG5cbmZ1bmN0aW9uIHF1YXRlcm5pb25Gcm9tRXVsZXIoZXVsZXIpIHtcbiAgdmFyIM67ID0gLjUgKiBldWxlclswXSAqIHJhZGlhbnMsXG4gICAgICDPhiA9IC41ICogZXVsZXJbMV0gKiByYWRpYW5zLFxuICAgICAgzrMgPSAuNSAqIGV1bGVyWzJdICogcmFkaWFucyxcbiAgICAgIHNpbs67ID0gTWF0aC5zaW4ozrspLCBjb3POuyA9IE1hdGguY29zKM67KSxcbiAgICAgIHNpbs+GID0gTWF0aC5zaW4oz4YpLCBjb3PPhiA9IE1hdGguY29zKM+GKSxcbiAgICAgIHNpbs6zID0gTWF0aC5zaW4ozrMpLCBjb3POsyA9IE1hdGguY29zKM6zKTtcbiAgcmV0dXJuIFtcbiAgICBjb3POuyAqIGNvc8+GICogY29zzrMgKyBzaW7OuyAqIHNpbs+GICogc2luzrMsXG4gICAgc2luzrsgKiBjb3PPhiAqIGNvc86zIC0gY29zzrsgKiBzaW7PhiAqIHNpbs6zLFxuICAgIGNvc867ICogc2luz4YgKiBjb3POsyArIHNpbs67ICogY29zz4YgKiBzaW7OsyxcbiAgICBjb3POuyAqIGNvc8+GICogc2luzrMgLSBzaW7OuyAqIHNpbs+GICogY29zzrNcbiAgXTtcbn1cblxuZnVuY3Rpb24gbXVsdGlwbHkoYSwgYikge1xuICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLFxuICAgICAgYjAgPSBiWzBdLCBiMSA9IGJbMV0sIGIyID0gYlsyXSwgYjMgPSBiWzNdO1xuICByZXR1cm4gW1xuICAgIGEwICogYjAgLSBhMSAqIGIxIC0gYTIgKiBiMiAtIGEzICogYjMsXG4gICAgYTAgKiBiMSArIGExICogYjAgKyBhMiAqIGIzIC0gYTMgKiBiMixcbiAgICBhMCAqIGIyIC0gYTEgKiBiMyArIGEyICogYjAgKyBhMyAqIGIxLFxuICAgIGEwICogYjMgKyBhMSAqIGIyIC0gYTIgKiBiMSArIGEzICogYjBcbiAgXTtcbn1cblxuZnVuY3Rpb24gcm90YXRlQmV0d2VlbihhLCBiKSB7XG4gIGlmICghYSB8fCAhYikgcmV0dXJuO1xuICB2YXIgYXhpcyA9IGNyb3NzKGEsIGIpLFxuICAgICAgbm9ybSA9IE1hdGguc3FydChkb3QoYXhpcywgYXhpcykpLFxuICAgICAgaGFsZs6zID0gLjUgKiBNYXRoLmFjb3MoTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIGRvdChhLCBiKSkpKSxcbiAgICAgIGsgPSBNYXRoLnNpbihoYWxmzrMpIC8gbm9ybTtcbiAgcmV0dXJuIG5vcm0gJiYgW01hdGguY29zKGhhbGbOsyksIGF4aXNbMl0gKiBrLCAtYXhpc1sxXSAqIGssIGF4aXNbMF0gKiBrXTtcbn1cblxuZnVuY3Rpb24gZXVsZXJGcm9tUXVhdGVybmlvbihxKSB7XG4gIHJldHVybiBbXG4gICAgTWF0aC5hdGFuMigyICogKHFbMF0gKiBxWzFdICsgcVsyXSAqIHFbM10pLCAxIC0gMiAqIChxWzFdICogcVsxXSArIHFbMl0gKiBxWzJdKSkgKiBkZWdyZWVzLFxuICAgIE1hdGguYXNpbihNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgMiAqIChxWzBdICogcVsyXSAtIHFbM10gKiBxWzFdKSkpKSAqIGRlZ3JlZXMsXG4gICAgTWF0aC5hdGFuMigyICogKHFbMF0gKiBxWzNdICsgcVsxXSAqIHFbMl0pLCAxIC0gMiAqIChxWzJdICogcVsyXSArIHFbM10gKiBxWzNdKSkgKiBkZWdyZWVzXG4gIF07XG59XG5cbmZ1bmN0aW9uIGNhcnRlc2lhbihzcGhlcmljYWwpIHtcbiAgdmFyIM67ID0gc3BoZXJpY2FsWzBdICogcmFkaWFucyxcbiAgICAgIM+GID0gc3BoZXJpY2FsWzFdICogcmFkaWFucyxcbiAgICAgIGNvc8+GID0gTWF0aC5jb3Moz4YpO1xuICByZXR1cm4gW1xuICAgIGNvc8+GICogTWF0aC5jb3MozrspLFxuICAgIGNvc8+GICogTWF0aC5zaW4ozrspLFxuICAgIE1hdGguc2luKM+GKVxuICBdO1xufVxuXG5mdW5jdGlvbiBkb3QoYSwgYikge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGEubGVuZ3RoLCBzID0gMDsgaSA8IG47ICsraSkgcyArPSBhW2ldICogYltpXTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGNyb3NzKGEsIGIpIHtcbiAgcmV0dXJuIFtcbiAgICBhWzFdICogYlsyXSAtIGFbMl0gKiBiWzFdLFxuICAgIGFbMl0gKiBiWzBdIC0gYVswXSAqIGJbMl0sXG4gICAgYVswXSAqIGJbMV0gLSBhWzFdICogYlswXVxuICBdO1xufVxuXG59KSgpO1xuIixudWxsLCIjIyMqXG4gIEBuZ2RvYyBiZWhhdmlvclxuICBAbmFtZSBicnVzaGVkXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEFcbiAgQGRlc2NyaXB0aW9uXG5cbiAgZW5hYmxlcyBhbiBheGlzIHRvIGJlIHNjYWxlZCBieSBhIG5hbWVkIGJydXNoIGluIGEgZGlmZmVyZW50IGxheW91dFxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdicnVzaGVkJywgKCRsb2csc2VsZWN0aW9uU2hhcmluZywgdGltaW5nKSAtPlxuICBzQnJ1c2hDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6IFsnXmNoYXJ0JywgJz9ebGF5b3V0JywgJz94JywgJz95JywgJz9yYW5nZVgnLCAnP3JhbmdlWSddXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1sxXT8ubWVcbiAgICAgIHggPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIHkgPSBjb250cm9sbGVyc1szXT8ubWVcbiAgICAgIHJhbmdlWCA9IGNvbnRyb2xsZXJzWzRdPy5tZVxuICAgICAgcmFuZ2VZID0gY29udHJvbGxlcnNbNV0/Lm1lXG5cbiAgICAgIGF4aXMgPSB4IG9yIHkgb3IgcmFuZ2VYIG9yIHJhbmdlWVxuICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgYnJ1c2hlciA9IChleHRlbnQsIGlkeFJhbmdlKSAtPlxuICAgICAgICAjdGltaW5nLnN0YXJ0KFwiYnJ1c2hlciN7YXhpcy5pZCgpfVwiKVxuICAgICAgICBpZiBub3QgYXhpcyB0aGVuIHJldHVyblxuICAgICAgICAjYXhpc1xuICAgICAgICBheGlzLmRvbWFpbihleHRlbnQpLnNjYWxlKCkuZG9tYWluKGV4dGVudClcbiAgICAgICAgZm9yIGwgaW4gY2hhcnQubGF5b3V0cygpIHdoZW4gbC5zY2FsZXMoKS5oYXNTY2FsZShheGlzKSAjbmVlZCB0byBkbyBpdCB0aGlzIHdheSB0byBlbnN1cmUgdGhlIHJpZ2h0IGF4aXMgaXMgY2hvc2VuIGluIGNhc2Ugb2Ygc2V2ZXJhbCBsYXlvdXRzIGluIGEgY29udGFpbmVyXG4gICAgICAgICAgbC5saWZlQ3ljbGUoKS5icnVzaChheGlzLCB0cnVlLCBpZHhSYW5nZSkgI25vIGFuaW1hdGlvblxuICAgICAgICAjdGltaW5nLnN0b3AoXCJicnVzaGVyI3theGlzLmlkKCl9XCIpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdicnVzaGVkJywgKHZhbCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyh2YWwpIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIF9icnVzaEdyb3VwID0gdmFsXG4gICAgICAgICAgc2VsZWN0aW9uU2hhcmluZy5yZWdpc3RlciBfYnJ1c2hHcm91cCwgYnJ1c2hlclxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgc2NvcGUuJG9uICckZGVzdHJveScsICgpIC0+XG4gICAgICAgIHNlbGVjdGlvblNoYXJpbmcudW5yZWdpc3RlciBfYnJ1c2hHcm91cCwgYnJ1c2hlclxuXG4gIH0iLCIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCQgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyAmJiBleHBvcnRzIHx8IHRoaXM7XG5cbiAgICB2YXIgZG9jdHlwZSA9ICc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgc3RhbmRhbG9uZT1cIm5vXCI/PjwhRE9DVFlQRSBzdmcgUFVCTElDIFwiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU5cIiBcImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZFwiPic7XG5cbiAgICBmdW5jdGlvbiBpbmxpbmVJbWFnZXMoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2ZyBpbWFnZScpO1xuICAgICAgICB2YXIgbGVmdCA9IGltYWdlcy5sZW5ndGg7XG4gICAgICAgIGlmIChsZWZ0ID09IDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIChmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICAgICAgICAgIGlmIChpbWFnZS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IGltYWdlLmdldEF0dHJpYnV0ZSgneGxpbms6aHJlZicpLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoL15odHRwLy50ZXN0KGhyZWYpICYmICEobmV3IFJlZ0V4cCgnXicgKyB3aW5kb3cubG9jYXRpb24uaG9zdCkudGVzdChocmVmKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZW5kZXIgZW1iZWRkZWQgaW1hZ2VzIGxpbmtpbmcgdG8gZXh0ZXJuYWwgaG9zdHMuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKTtcbiAgICAgICAgICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCd4bGluazpocmVmJywgY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJykpO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0LS07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KShpbWFnZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3R5bGVzKGRvbSkge1xuICAgICAgICB2YXIgY3NzID0gXCJcIjtcbiAgICAgICAgdmFyIHNoZWV0cyA9IGRvY3VtZW50LnN0eWxlU2hlZXRzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNoZWV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHJ1bGVzID0gc2hlZXRzW2ldLmNzc1J1bGVzO1xuICAgICAgICAgICAgaWYgKHJ1bGVzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJ1bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBydWxlID0gcnVsZXNbal07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YocnVsZS5zdHlsZSkgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3NzICs9IHJ1bGUuc2VsZWN0b3JUZXh0ICsgXCIgeyBcIiArIHJ1bGUuc3R5bGUuY3NzVGV4dCArIFwiIH1cXG5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgcy5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgcy5pbm5lckhUTUwgPSBcIjwhW0NEQVRBW1xcblwiICsgY3NzICsgXCJcXG5dXT5cIjtcblxuICAgICAgICB2YXIgZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RlZnMnKTtcbiAgICAgICAgZGVmcy5hcHBlbmRDaGlsZChzKTtcbiAgICAgICAgcmV0dXJuIGRlZnM7XG4gICAgfVxuXG4gICAgb3V0JC5zdmdBc0RhdGFVcmkgPSBmdW5jdGlvbihlbCwgc2NhbGVGYWN0b3IsIGNiKSB7XG4gICAgICAgIHNjYWxlRmFjdG9yID0gc2NhbGVGYWN0b3IgfHwgMTtcblxuICAgICAgICBpbmxpbmVJbWFnZXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdmFyIGNsb25lID0gZWwuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgY2xvbmUuZ2V0QXR0cmlidXRlKCd3aWR0aCcpXG4gICAgICAgICAgICAgICAgfHwgY2xvbmUuc3R5bGUud2lkdGhcbiAgICAgICAgICAgICAgICB8fCBvdXQkLmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgY2xvbmUuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKVxuICAgICAgICAgICAgICAgIHx8IGNsb25lLnN0eWxlLmhlaWdodFxuICAgICAgICAgICAgICAgIHx8IG91dCQuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JylcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHZhciB4bWxucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy9cIjtcblxuICAgICAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKFwidmVyc2lvblwiLCBcIjEuMVwiKTtcbiAgICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZU5TKHhtbG5zLCBcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIik7XG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGVOUyh4bWxucywgXCJ4bWxuczp4bGlua1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIik7XG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB3aWR0aCAqIHNjYWxlRmFjdG9yKTtcbiAgICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBoZWlnaHQgKiBzY2FsZUZhY3Rvcik7XG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodCk7XG4gICAgICAgICAgICBvdXRlci5hcHBlbmRDaGlsZChjbG9uZSk7XG5cbiAgICAgICAgICAgIGNsb25lLmluc2VydEJlZm9yZShzdHlsZXMoY2xvbmUpLCBjbG9uZS5maXJzdENoaWxkKTtcblxuICAgICAgICAgICAgdmFyIHN2ZyA9IGRvY3R5cGUgKyBvdXRlci5pbm5lckhUTUw7XG4gICAgICAgICAgICB2YXIgdXJpID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdmcpKSk7XG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICBjYih1cmkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvdXQkLnNhdmVTdmdBc1BuZyA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBzY2FsZUZhY3Rvcikge1xuICAgICAgICBvdXQkLnN2Z0FzRGF0YVVyaShlbCwgc2NhbGVGYWN0b3IsIGZ1bmN0aW9uKHVyaSkge1xuICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmk7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwKTtcblxuICAgICAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgIGEuZG93bmxvYWQgPSBuYW1lO1xuICAgICAgICAgICAgICAgIGEuaHJlZiA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgICAgICAgICAgYS5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIiMjIypcbiAgQG5nZG9jIGNvbnRhaW5lclxuICBAbmFtZSBjaGFydFxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBFXG4gIEBkZXNjcmlwdGlvblxuXG4gIGNoYXJ0IGlzIHRoZSBjb250YWluZXIgZGlyZWN0aXZlIGZvciBhbGwgY2hhcnRzLlxuICBAcGFyYW0ge2FycmF5fSBkYXRhIC0gRGF0YSB0byBiZSBncmFwaGVkLCB7QGxpbmsgY29udGVudC9kYXRhIC4uLm1vcmV9XG4gIEBwYXJhbSB7Ym9vbGVhbn0gW2RlZXAtd2F0Y2g9ZmFsc2VdXG4gIEBwYXJhbSB7c3RyaW5nfSBbZmlsdGVyXSAtIGZpbHRlcnMgdGhlIGRhdGEgdXNpbmcgdGhlIGFuZ3VsYXIgZmlsdGVyIGZ1bmN0aW9uXG4gIEBwYXJhbSB7c3RyaW5nfSBbdG9vbHRpcF0gLSBTaG93IHRvb2x0aXBcbiAgQHBhcmFtIHtzdHJpbmd9IFt0aXRsZV0gLSBUaGUgY2hhcnQgdGl0bGVcbiAgQHBhcmFtIHtzdHJpbmd9IFtzdWJ0aXRsZV0gLSBUaGUgY2hhcnQgc3VidGl0bGVcbiAgQHBhcmFtIHtudW1iZXJ9IFthbmltYXRpb24tZHVyYXRpb249MzAwXSAtIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHNcbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjaGFydCcsICgkbG9nLCBjaGFydCwgJGZpbHRlcikgLT5cbiAgY2hhcnRDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6ICdjaGFydCdcbiAgICBzY29wZTpcbiAgICAgIGRhdGE6ICc9J1xuICAgICAgZmlsdGVyOiAnPSdcbiAgICBjb250cm9sbGVyOiAoKSAtPlxuICAgICAgdGhpcy5tZSA9IGNoYXJ0KClcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgZGVlcFdhdGNoID0gZmFsc2VcbiAgICAgIHdhdGNoZXJSZW1vdmVGbiA9IHVuZGVmaW5lZFxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgICAgX2ZpbHRlciA9IHVuZGVmaW5lZFxuXG4gICAgICBtZS5jb250YWluZXIoKS5lbGVtZW50KGVsZW1lbnRbMF0pXG5cbiAgICAgIG1lLmxpZmVDeWNsZSgpLmNvbmZpZ3VyZSgpXG5cbiAgICAgIG1lLmxpZmVDeWNsZSgpLm9uICdzY29wZUFwcGx5JywgKCkgLT5cbiAgICAgICAgc2NvcGUuJGFwcGx5KClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3Rvb2x0aXBzJywgKHZhbCkgLT5cbiAgICAgICAgbWUudG9vbFRpcFRlbXBsYXRlKCcnKVxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWQgYW5kICh2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJylcbiAgICAgICAgICBtZS5zaG93VG9vbHRpcCh0cnVlKVxuICAgICAgICBlbHNlIGlmIHZhbC5sZW5ndGggPiAwIGFuZCB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgbWUudG9vbFRpcFRlbXBsYXRlKHZhbClcbiAgICAgICAgICBtZS5zaG93VG9vbHRpcCh0cnVlKVxuICAgICAgICBlbHNlIHNob3dUb29sVGlwKGZhbHNlKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYW5pbWF0aW9uRHVyYXRpb24nLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgYW5kIF8uaXNOdW1iZXIoK3ZhbCkgYW5kICt2YWwgPj0gMFxuICAgICAgICAgIG1lLmFuaW1hdGlvbkR1cmF0aW9uKHZhbClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3RpdGxlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgbWUudGl0bGUodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUudGl0bGUodW5kZWZpbmVkKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnc3VidGl0bGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBtZS5zdWJUaXRsZSh2YWwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS5zdWJUaXRsZSh1bmRlZmluZWQpXG5cbiAgICAgIHNjb3BlLiR3YXRjaCAnZmlsdGVyJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgX2ZpbHRlciA9IHZhbCAjIHNjb3BlLiRldmFsKHZhbClcbiAgICAgICAgICBpZiBfZGF0YVxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YSgkZmlsdGVyKCdmaWx0ZXInKShfZGF0YSwgX2ZpbHRlcikpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfZmlsdGVyID0gdW5kZWZpbmVkXG4gICAgICAgICAgaWYgX2RhdGFcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEoX2RhdGEpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkZWVwV2F0Y2gnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWQgYW5kIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICBkZWVwV2F0Y2ggPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWVwV2F0Y2ggPSBmYWxzZVxuICAgICAgICBpZiB3YXRjaGVyUmVtb3ZlRm5cbiAgICAgICAgICB3YXRjaGVyUmVtb3ZlRm4oKVxuICAgICAgICB3YXRjaGVyUmVtb3ZlRm4gPSBzY29wZS4kd2F0Y2ggJ2RhdGEnLCBkYXRhV2F0Y2hGbiwgZGVlcFdhdGNoXG5cbiAgICAgIGRhdGFXYXRjaEZuID0gKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgICBpZiBfLmlzQXJyYXkoX2RhdGEpIGFuZCBfZGF0YS5sZW5ndGggaXMgMCB0aGVuIHJldHVyblxuICAgICAgICAgIGlmIF9maWx0ZXJcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEoJGZpbHRlcignZmlsdGVyJykodmFsLCBfZmlsdGVyKSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKHZhbClcblxuICAgICAgd2F0Y2hlclJlbW92ZUZuID0gc2NvcGUuJHdhdGNoICdkYXRhJywgZGF0YVdhdGNoRm4sIGRlZXBXYXRjaFxuXG4gICAgICAjIGNsZWFudXAgd2hlbiBkZXN0cm95ZWRcblxuICAgICAgZWxlbWVudC5vbiAnJGRlc3Ryb3knLCAoKSAtPlxuICAgICAgICBpZiB3YXRjaGVyUmVtb3ZlRm5cbiAgICAgICAgICB3YXRjaGVyUmVtb3ZlRm4oKVxuICAgICAgICAkbG9nLmxvZyAnRGVzdHJveWluZyBjaGFydCdcbiAgfSIsIiMjIypcbiAgQG5nZG9jIGNvbnRhaW5lclxuICBAbmFtZSBsYXlvdXRcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgRVxuICBAcmVxdWlyZXMgY2hhcnRcbiAgQGRlc2NyaXB0aW9uXG5cbiAgTGF5b3V0IGlzIHRoZSBjb250YWluZXIgZm9yIHRoZSBsYXlvdXQgZGlyZWN0aXZlcy4gSXQgcmVxdWlyZXMgY2hhcnQgYXMgYSBwYXJlbnQuXG4jIyNcbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnbGF5b3V0JywgKCRsb2csIGxheW91dCwgY29udGFpbmVyKSAtPlxuICBsYXlvdXRDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRSdcbiAgICByZXF1aXJlOiBbJ2xheW91dCcsJ15jaGFydCddXG5cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gbGF5b3V0KClcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cblxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG5cbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIGxheW91dCBpZDonLCBtZS5pZCgpLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuICAgICAgY2hhcnQuYWRkTGF5b3V0KG1lKVxuICAgICAgY2hhcnQuY29udGFpbmVyKCkuYWRkTGF5b3V0KG1lKVxuICAgICAgbWUuY29udGFpbmVyKGNoYXJ0LmNvbnRhaW5lcigpKVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3ByaW50QnV0dG9uJywgKCRsb2cpIC0+XG5cbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOidjaGFydCdcbiAgICByZXN0cmljdDogJ0EnXG4gICAgbGluazooc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGRyYXcgPSAoKSAtPlxuICAgICAgICBfY29udGFpbmVyRGl2ID0gZDMuc2VsZWN0KGNoYXJ0LmNvbnRhaW5lcigpLmVsZW1lbnQoKSkuc2VsZWN0KCdkaXYud2stY2hhcnQnKVxuICAgICAgICBfY29udGFpbmVyRGl2LmFwcGVuZCgnYnV0dG9uJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1wcmludC1idXR0b24nKVxuICAgICAgICAgIC5zdHlsZSh7cG9zaXRpb246J2Fic29sdXRlJywgdG9wOjAsIHJpZ2h0OjB9KVxuICAgICAgICAgIC50ZXh0KCdQcmludCcpXG4gICAgICAgICAgLm9uICdjbGljaycsICgpLT5cbiAgICAgICAgICAgICRsb2cubG9nICdDbGlja2VkIFByaW50IEJ1dHRvbidcblxuICAgICAgICAgICAgc3ZnICA9IF9jb250YWluZXJEaXYuc2VsZWN0KCdzdmcud2stY2hhcnQnKS5ub2RlKClcbiAgICAgICAgICAgIHNhdmVTdmdBc1BuZyhzdmcsICdwcmludC5wbmcnLDUpXG5cblxuICAgICAgY2hhcnQubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydC5wcmludCcsIGRyYXdcbiAgfSIsIiMjIypcbiAgQG5nZG9jIGJlaGF2aW9yXG4gIEBuYW1lIHNlbGVjdGlvblxuICBAZWxlbWVudCBsYXlvdXRcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgQVxuICBAZGVzY3JpcHRpb25cblxuICBlbmFibGVzIHNlbGVjdGlvbiBvZiBpbmRpdmlkdWFsIGNoYXJ0IG9iamVjdHNcblxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzZWxlY3Rpb24nLCAoJGxvZykgLT5cbiAgb2JqSWQgPSAwXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgc2NvcGU6XG4gICAgICBzZWxlY3RlZERvbWFpbjogJz0nXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlLnNlbGVjdGlvbicsIC0+XG5cbiAgICAgICAgX3NlbGVjdGlvbiA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF9zZWxlY3Rpb24uYWN0aXZlKHRydWUpXG4gICAgICAgIF9zZWxlY3Rpb24ub24gJ3NlbGVjdGVkJywgKHNlbGVjdGVkT2JqZWN0cykgLT5cbiAgICAgICAgICBzY29wZS5zZWxlY3RlZERvbWFpbiA9IHNlbGVjdGVkT2JqZWN0c1xuICAgICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgfSIsIiMjIypcbiAgQG5nZG9jIGxheW91dFxuICBAbmFtZSBhcmVhXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEFcbiAgQGFyZWEgYXBpXG5cbiAgQGRlc2NyaXB0aW9uXG5cbiAgZHJhd3MgYSBhcmVhIGNoYXJ0IGxheW91dFxuXG4gIEB1c2VzRGltZW5zaW9uIHggW3R5cGU9bGluZWFyLCBkb21haW5SYW5nZT1leHRlbnRdIFRoZSBob3Jpem9udGFsIGRpbWVuc2lvblxuICBAdXNlc0RpbWVuc2lvbiB5IFt0eXBlPWxpbmVhciwgZG9tYWluUmFuZ2U9ZXh0ZW50XVxuICBAdXNlc0RpbWVuc2lvbiBjb2xvciBbdHlwZT1jYXRlZ29yeTIwXVxuIyMjXG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYXJlYScsICgkbG9nLCB1dGlscykgLT5cbiAgbGluZUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgcy1saW5lJ1xuICAgICAgbGF5ZXJLZXlzID0gW11cbiAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgX2RhdGFPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNOZXcgPSBbXVxuICAgICAgX3BhdGhBcnJheSA9IFtdXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgb2Zmc2V0ID0gMFxuICAgICAgX2lkID0gJ2xpbmUnICsgbGluZUNudHIrK1xuICAgICAgYXJlYSA9IHVuZGVmaW5lZFxuICAgICAgYXJlYUJydXNoID0gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0gVG9vbHRpcCBoYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGlkeCkgLT5cbiAgICAgICAgX3BhdGhBcnJheSA9IF8udG9BcnJheShfcGF0aFZhbHVlc05ldylcbiAgICAgICAgdHRNb3ZlRGF0YS5hcHBseSh0aGlzLCBbaWR4XSlcblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX3BhdGhBcnJheS5tYXAoKGwpIC0+IHtuYW1lOmxbaWR4XS5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsW2lkeF0ueXYpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsW2lkeF0uY29sb3J9LCB4djpsW2lkeF0ueHZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueHYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbaWR4XS5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGRbaWR4XS5jb2xvcilcbiAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeScsIChkKSAtPiBkW2lkeF0ueSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfc2NhbGVMaXN0Lnguc2NhbGUoKShfcGF0aEFycmF5WzBdW2lkeF0ueHYpICsgb2Zmc2V0fSlcIilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgICAgbWVyZ2VkWCA9IHV0aWxzLm1lcmdlU2VyaWVzU29ydGVkKHgudmFsdWUoX2RhdGFPbGQpLCB4LnZhbHVlKGRhdGEpKVxuICAgICAgICBfbGF5ZXJLZXlzID0geS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgX2xheW91dCA9IFtdXG5cbiAgICAgICAgX3BhdGhWYWx1ZXNOZXcgPSB7fVxuXG4gICAgICAgIGZvciBrZXkgaW4gX2xheWVyS2V5c1xuICAgICAgICAgIF9wYXRoVmFsdWVzTmV3W2tleV0gPSBkYXRhLm1hcCgoZCktPiB7eDp4Lm1hcChkKSx5Onkuc2NhbGUoKSh5LmxheWVyVmFsdWUoZCwga2V5KSksIHh2OngudmFsdWUoZCksIHl2OnkubGF5ZXJWYWx1ZShkLGtleSksIGtleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgZGF0YTpkfSlcblxuICAgICAgICAgIG9sZEZpcnN0ID0gbmV3Rmlyc3QgPSB1bmRlZmluZWRcblxuICAgICAgICAgIGxheWVyID0ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6W119XG4gICAgICAgICAgIyBmaW5kIHN0YXJ0aW5nIHZhbHVlIGZvciBvbGRcbiAgICAgICAgICBpID0gMFxuICAgICAgICAgIHdoaWxlIGkgPCBtZXJnZWRYLmxlbmd0aFxuICAgICAgICAgICAgaWYgbWVyZ2VkWFtpXVswXSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICBvbGRGaXJzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bbWVyZ2VkWFtpXVswXV1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGkrK1xuICAgICAgICAgICMgZmluZCBzdGFydGluZyB2YWx1ZSBmb3IgbmV3XG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3Rmlyc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW21lcmdlZFhbaV1bMV1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIGZvciB2YWwsIGkgaW4gbWVyZ2VkWFxuICAgICAgICAgICAgdiA9IHtjb2xvcjpsYXllci5jb2xvciwgeDp2YWxbMl19XG4gICAgICAgICAgICAjIHNldCB4IGFuZCB5IHZhbHVlcyBmb3Igb2xkIHZhbHVlcy4gSWYgdGhlcmUgaXMgYSBhZGRlZCB2YWx1ZSwgbWFpbnRhaW4gdGhlIGxhc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIHZhbFsxXSBpcyB1bmRlZmluZWQgI2llIGFuIG9sZCB2YWx1ZSBpcyBkZWxldGVkLCBtYWludGFpbiB0aGUgbGFzdCBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi55TmV3ID0gbmV3Rmlyc3QueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdGaXJzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0ZpcnN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIF9kYXRhT2xkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgaWYgIHZhbFswXSBpcyB1bmRlZmluZWQgIyBpZSBhIG5ldyB2YWx1ZSBoYXMgYmVlbiBhZGRlZFxuICAgICAgICAgICAgICAgIHYueU9sZCA9IG9sZEZpcnN0LnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRGaXJzdC54ICMgc3RhcnQgeC1hbmltYXRpb24gZnJvbSB0aGUgcHJlZGVjZXNzb3JzIG9sZCBwb3NpdGlvblxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueFxuICAgICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueE9sZCA9IHYueE5ld1xuICAgICAgICAgICAgICB2LnlPbGQgPSB2LnlOZXdcblxuXG4gICAgICAgICAgICBsYXllci52YWx1ZS5wdXNoKHYpXG5cbiAgICAgICAgICBfbGF5b3V0LnB1c2gobGF5ZXIpXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeC5pc09yZGluYWwoKSB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgYXJlYU9sZCA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIGQueE9sZClcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnlPbGQpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeS5zY2FsZSgpKDApKVxuXG4gICAgICAgIGFyZWFOZXcgPSBkMy5zdmcuYXJlYSgpXG4gICAgICAgICAgLngoKGQpIC0+ICBkLnhOZXcpXG4gICAgICAgICAgLnkwKChkKSAtPiAgZC55TmV3KVxuICAgICAgICAgIC55MSgoZCkgLT4gIHkuc2NhbGUoKSgwKSlcblxuICAgICAgICBhcmVhQnJ1c2ggPSBkMy5zdmcuYXJlYSgpXG4gICAgICAgICAgLngoKGQpIC0+ICB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnlOZXcpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeS5zY2FsZSgpKDApKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmcm9tJywgXCJ0cmFuc2xhdGUoI3tvZmZzZXR9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYU9sZChkLnZhbHVlKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhTmV3KGQudmFsdWUpKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBfZGF0YU9sZCA9IGRhdGFcbiAgICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBfcGF0aFZhbHVlc05ld1xuXG4gICAgICBicnVzaCA9IChheGlzLCBpZHhSYW5nZSkgLT5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3QoJy53ay1jaGFydC1saW5lJylcbiAgICAgICAgaWYgYXhpcy5pc09yZGluYWwoKVxuICAgICAgICAgIGxheWVycy5hdHRyKCdkJywgKGQpIC0+IGFyZWFCcnVzaChkLnZhbHVlLnNsaWNlKGlkeFJhbmdlWzBdLGlkeFJhbmdlWzFdICsgMSkpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYUJydXNoKGQudmFsdWUpKVxuXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LngpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBicnVzaFxuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG5cbiAgfSIsIiMjIypcbiAgQG5nZG9jIGxheW91dFxuICBAbmFtZSBhcmVhU3RhY2tlZFxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBBXG4gIEBhcmVhIGFwaVxuICBAZGVzY3JpcHRpb25cblxuICBkcmF3cyBhIGFyZWEgY2hhcnQgbGF5b3V0XG5cbiAgQHVzZXNEaW1lbnNpb24geCBbdHlwZT1saW5lYXIsIGRvbWFpblJhbmdlPWV4dGVudF0gVGhlIGhvcml6b250YWwgZGltZW5zaW9uXG4gIEB1c2VzRGltZW5zaW9uIHkgW3R5cGU9bGluZWFyLCBkb21haW5SYW5nZT10b3RhbF1cbiAgQHVzZXNEaW1lbnNpb24gY29sb3IgW3R5cGU9Y2F0ZWdvcnkyMF1cbiMjI1xuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWFTdGFja2VkJywgKCRsb2csIHV0aWxzKSAtPlxuICBzdGFja2VkQXJlYUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKClcbiAgICAgIG9mZnNldCA9ICd6ZXJvJ1xuICAgICAgbGF5ZXJzID0gbnVsbFxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBsYXllckRhdGEgPSBbXVxuICAgICAgbGF5b3V0TmV3ID0gW11cbiAgICAgIGxheW91dE9sZCA9IFtdXG4gICAgICBsYXllcktleXNPbGQgPSBbXVxuICAgICAgYXJlYSA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlZFN1Y2MgPSB7fVxuICAgICAgYWRkZWRQcmVkID0ge31cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIHNjYWxlWSA9IHVuZGVmaW5lZFxuICAgICAgb2ZmcyA9IDBcbiAgICAgIF9pZCA9ICdhcmVhU3RhY2tlZCcgKyBzdGFja2VkQXJlYUNudHIrK1xuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gbGF5ZXJEYXRhLm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLmxheWVyW2lkeF0ueXkpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueClcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShsYXllckRhdGEsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gc2NhbGVZKGQubGF5ZXJbaWR4XS55ICsgZC5sYXllcltpZHhdLnkwKSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19zY2FsZUxpc3QueC5zY2FsZSgpKGxheWVyRGF0YVswXS5sYXllcltpZHhdLngpK29mZnN9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRMYXllckJ5S2V5ID0gKGtleSwgbGF5b3V0KSAtPlxuICAgICAgICBmb3IgbCBpbiBsYXlvdXRcbiAgICAgICAgICBpZiBsLmtleSBpcyBrZXlcbiAgICAgICAgICAgIHJldHVybiBsXG5cbiAgICAgIHN0YWNrTGF5b3V0ID0gc3RhY2sudmFsdWVzKChkKS0+ZC5sYXllcikueSgoZCkgLT4gZC55eSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBBcmVhIENoYXJ0XCJcblxuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG5cbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IGRhdGEubWFwKChkKSAtPiB7eDogeC52YWx1ZShkKSwgeXk6ICt5LmxheWVyVmFsdWUoZCxrKSwgeTA6IDAsIGRhdGE6ZH0pfSkgIyB5eTogbmVlZCB0byBhdm9pZCBvdmVyd3JpdGluZyBieSBsYXlvdXQgY2FsYyAtPiBzZWUgc3RhY2sgeSBhY2Nlc3NvclxuICAgICAgICBsYXlvdXROZXcgPSBzdGFja0xheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgb2ZmcyA9IGlmIHguaXNPcmRpbmFsKCkgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBpZiBvZmZzZXQgaXMgJ2V4cGFuZCdcbiAgICAgICAgICBzY2FsZVkgPSB5LnNjYWxlKCkuY29weSgpXG4gICAgICAgICAgc2NhbGVZLmRvbWFpbihbMCwgMV0pXG4gICAgICAgIGVsc2Ugc2NhbGVZID0geS5zY2FsZSgpXG5cbiAgICAgICAgYXJlYSA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55MCgoZCkgLT4gIHNjYWxlWShkLnkwICsgZC55KSlcbiAgICAgICAgICAueTEoKGQpIC0+ICBzY2FsZVkoZC55MCkpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEobGF5b3V0TmV3LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgaWYgbGF5b3V0T2xkLmxlbmd0aCBpcyAwXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSkuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBpZiBhZGRlZFByZWRbZC5rZXldIHRoZW4gZ2V0TGF5ZXJCeUtleShhZGRlZFByZWRbZC5rZXldLCBsYXlvdXRPbGQpLnBhdGggZWxzZSBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiAge3g6IHAueCwgeTogMCwgeTA6IDB9KSkpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29mZnN9KVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC5sYXllcikpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG5cblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBzdWNjID0gZGVsZXRlZFN1Y2NbZC5rZXldXG4gICAgICAgICAgICBpZiBzdWNjIHRoZW4gYXJlYShnZXRMYXllckJ5S2V5KHN1Y2MsIGxheW91dE5ldykubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55MH0pKSBlbHNlIGFyZWEobGF5b3V0TmV3W2xheW91dE5ldy5sZW5ndGggLSAxXS5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkwICsgcC55fSkpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICBicnVzaCA9IChheGlzLCBpZHhSYW5nZSkgLT5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtYXJlYVwiKVxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQubGF5ZXIpKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LngpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAjIyMqXG4gICAgICAgICAgQG5nZG9jIGF0dHJcbiAgICAgICAgICBAbmFtZSBhcmVhU3RhY2tlZCNhcmVhU3RhY2tlZFxuICAgICAgICAgIEBwYXJhbSBbYXJlYVN0YWNrZWQ9emVyb10ge2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdhcmVhU3RhY2tlZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpbiBbJ3plcm8nLCAnc2lsaG91ZXR0ZScsICdleHBhbmQnLCAnd2lnZ2xlJ11cbiAgICAgICAgICBvZmZzZXQgPSB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9mZnNldCA9IFwiemVyb1wiXG4gICAgICAgIHN0YWNrLm9mZnNldChvZmZzZXQpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGVudGVyIC8gZXhpdCBhbmltYXRpb25zIGxpa2UgaW4gbGluZVxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCIjIyMqXG4gIEBuZ2RvYyBsYXlvdXRcbiAgQG5hbWUgYXJlYVN0YWNrZWRWZXJ0aWNhbFxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBBXG4gIEBhcmVhIGFwaVxuICBAZGVzY3JpcHRpb25cblxuICBkcmF3cyBhIGFyZWEgY2hhcnQgbGF5b3V0XG5cbiAgQHVzZXNEaW1lbnNpb24geCBbdHlwZT1saW5lYXIsIGRvbWFpblJhbmdlPXRvdGFsXSBUaGUgaG9yaXpvbnRhbCBkaW1lbnNpb25cbiAgQHVzZXNEaW1lbnNpb24geSBbdHlwZT1saW5lYXIsIGRvbWFpblJhbmdlPWV4dGVudF1cbiAgQHVzZXNEaW1lbnNpb24gY29sb3IgW3R5cGU9Y2F0ZWdvcnkyMF1cblxuIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWFTdGFja2VkVmVydGljYWwnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGFyZWFTdGFja2VkVmVydENudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKClcbiAgICAgIG9mZnNldCA9ICd6ZXJvJ1xuICAgICAgbGF5ZXJzID0gbnVsbFxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBsYXllckRhdGEgPSBbXVxuICAgICAgbGF5b3V0TmV3ID0gW11cbiAgICAgIGxheW91dE9sZCA9IFtdXG4gICAgICBsYXllcktleXNPbGQgPSBbXVxuICAgICAgYXJlYSA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlZFN1Y2MgPSB7fVxuICAgICAgYWRkZWRQcmVkID0ge31cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIHNjYWxlWCA9IHVuZGVmaW5lZFxuICAgICAgb2ZmcyA9IDBcbiAgICAgIF9pZCA9ICdhcmVhLXN0YWNrZWQtdmVydCcgKyBhcmVhU3RhY2tlZFZlcnRDbnRyKytcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IGxheWVyRGF0YS5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobC5sYXllcltpZHhdLnh4KSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGxheWVyRGF0YVswXS5sYXllcltpZHhdLnl5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKGxheWVyRGF0YSwgKGQpIC0+IGQua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeCcsIChkKSAtPiBzY2FsZVgoZC5sYXllcltpZHhdLnkgKyBkLmxheWVyW2lkeF0ueTApKSAgIyB3ZWlyZCEhISBob3dldmVyLCB0aGUgZGF0YSBpcyBmb3IgYSBob3Jpem9udGFsIGNoYXJ0IHdoaWNoIGdldHMgdHJhbnNmb3JtZWRcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7X3NjYWxlTGlzdC55LnNjYWxlKCkobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueXkpK29mZnN9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRMYXllckJ5S2V5ID0gKGtleSwgbGF5b3V0KSAtPlxuICAgICAgICBmb3IgbCBpbiBsYXlvdXRcbiAgICAgICAgICBpZiBsLmtleSBpcyBrZXlcbiAgICAgICAgICAgIHJldHVybiBsXG5cbiAgICAgIGxheW91dCA9IHN0YWNrLnZhbHVlcygoZCktPmQubGF5ZXIpLnkoKGQpIC0+IGQueHgpXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMjI1xuICAgICAgcHJlcERhdGEgPSAoeCx5LGNvbG9yKSAtPlxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKEApXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBAbWFwKChkKSAtPiB7eDogeC52YWx1ZShkKSwgeXk6ICt5LmxheWVyVmFsdWUoZCxrKSwgeTA6IDB9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgI2xheW91dE5ldyA9IGxheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgZGVsZXRlZFN1Y2MgPSB1dGlscy5kaWZmKGxheWVyS2V5c09sZCwgbGF5ZXJLZXlzLCAxKVxuICAgICAgICBhZGRlZFByZWQgPSB1dGlscy5kaWZmKGxheWVyS2V5cywgbGF5ZXJLZXlzT2xkLCAtMSlcbiAgICAgICMjI1xuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBBcmVhIENoYXJ0XCJcblxuXG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG5cbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IGRhdGEubWFwKChkKSAtPiB7eXk6IHkudmFsdWUoZCksIHh4OiAreC5sYXllclZhbHVlKGQsayksIHkwOiAwLCBkYXRhOmR9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgbGF5b3V0TmV3ID0gbGF5b3V0KGxheWVyRGF0YSlcblxuICAgICAgICBvZmZzID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGlmIG9mZnNldCBpcyAnZXhwYW5kJ1xuICAgICAgICAgIHNjYWxlWCA9IHguc2NhbGUoKS5jb3B5KClcbiAgICAgICAgICBzY2FsZVguZG9tYWluKFswLCAxXSlcbiAgICAgICAgZWxzZSBzY2FsZVggPSB4LnNjYWxlKClcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAgIC54KChkKSAtPiAgeS5zY2FsZSgpKGQueXkpKVxuICAgICAgICAgIC55MCgoZCkgLT4gIHNjYWxlWChkLnkwICsgZC55KSlcbiAgICAgICAgICAueTEoKGQpIC0+ICBzY2FsZVgoZC55MCkpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEobGF5b3V0TmV3LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgaWYgbGF5b3V0T2xkLmxlbmd0aCBpcyAwXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSkuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBpZiBhZGRlZFByZWRbZC5rZXldIHRoZW4gZ2V0TGF5ZXJCeUtleShhZGRlZFByZWRbZC5rZXldLCBsYXlvdXRPbGQpLnBhdGggZWxzZSBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiAge3l5OiBwLnl5LCB5OiAwLCB5MDogMH0pKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcbiAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwicm90YXRlKDkwKSBzY2FsZSgxLC0xKVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC5sYXllcikpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG5cblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBzdWNjID0gZGVsZXRlZFN1Y2NbZC5rZXldXG4gICAgICAgICAgICBpZiBzdWNjIHRoZW4gYXJlYShnZXRMYXllckJ5S2V5KHN1Y2MsIGxheW91dE5ldykubGF5ZXIubWFwKChwKSAtPiB7eXk6IHAueXksIHk6IDAsIHkwOiBwLnkwfSkpIGVsc2UgYXJlYShsYXlvdXROZXdbbGF5b3V0TmV3Lmxlbmd0aCAtIDFdLmxheWVyLm1hcCgocCkgLT4ge3l5OiBwLnl5LCB5OiAwLCB5MDogcC55MCArIHAueX0pKVxuICAgICAgICAgIClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3l5OiBwLnl5LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LnkpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAjIyMqXG4gICAgICAgICAgQG5nZG9jIGF0dHJcbiAgICAgICAgICBAbmFtZSBhcmVhU3RhY2tlZFZlcnRpY2FsI2FyZWFTdGFja2VkVmVydGljYWxcbiAgICAgICAgICBAcGFyYW0gW2FyZWFTdGFja2VkVmVydGljYWw9emVyb10ge2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdhcmVhU3RhY2tlZFZlcnRpY2FsJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGluIFsnemVybycsICdzaWxob3VldHRlJywgJ2V4cGFuZCcsICd3aWdnbGUnXVxuICAgICAgICAgIG9mZnNldCA9IHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgb2Zmc2V0ID0gXCJ6ZXJvXCJcbiAgICAgICAgc3RhY2sub2Zmc2V0KG9mZnNldClcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZW50ZXIgLyBleGl0IGFuaW1hdGlvbnMgbGlrZSBpbiBsaW5lXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsIiMjIypcbiAgQG5nZG9jIGxheW91dFxuICBAbmFtZSBhcmVhVmVydGljYWxcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgQVxuICBAYXJlYSBhcGlcbiAgQGRlc2NyaXB0aW9uXG5cbiAgZHJhd3MgYSBhcmVhIGNoYXJ0IGxheW91dFxuXG4gIEB1c2VzRGltZW5zaW9uIHggW3R5cGU9bGluZWFyLCBkb21haW5SYW5nZT1leHRlbnRdIFRoZSBob3Jpem9udGFsIGRpbWVuc2lvblxuICBAdXNlc0RpbWVuc2lvbiB5IFt0eXBlPWxpbmVhciwgZG9tYWluUmFuZ2U9ZXh0ZW50XVxuICBAdXNlc0RpbWVuc2lvbiBjb2xvciBbdHlwZT1jYXRlZ29yeTIwXVxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhVmVydGljYWwnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF9kYXRhT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzTmV3ID0gW11cbiAgICAgIF9wYXRoQXJyYXkgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIGFyZWFCcnVzaCA9IHVuZGVmaW5lZFxuICAgICAgYnJ1c2hTdGFydElkeCA9IDBcbiAgICAgIF9pZCA9ICdhcmVhJyArIGxpbmVDbnRyKytcblxuICAgICAgIy0tLSBUb29sdGlwIGhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoaWR4KSAtPlxuICAgICAgICBfcGF0aEFycmF5ID0gXy50b0FycmF5KF9wYXRoVmFsdWVzTmV3KVxuICAgICAgICB0dE1vdmVEYXRhLmFwcGx5KHRoaXMsIFtpZHhdKVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgb2ZmcyA9IGlkeCArIGJydXNoU3RhcnRJZHhcbiAgICAgICAgdHRMYXllcnMgPSBfcGF0aEFycmF5Lm1hcCgobCkgLT4ge25hbWU6bFtvZmZzXS5rZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsW29mZnNdLnh2KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbFtvZmZzXS5jb2xvcn0sIHl2Omxbb2Zmc10ueXZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueXYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgb2ZmcyA9IGlkeCArIGJydXNoU3RhcnRJZHhcbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbb2Zmc10ua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZFtvZmZzXS5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeCcsIChkKSAtPiBkW29mZnNdLngpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICBvID0gaWYgX3NjYWxlTGlzdC55LmlzT3JkaW5hbCB0aGVuIF9zY2FsZUxpc3QueS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7X3NjYWxlTGlzdC55LnNjYWxlKCkoX3BhdGhBcnJheVswXVtvZmZzXS55dikgKyBvfSlcIikgIyBuZWVkIHRvIGNvbXB1dGUgZm9ybSBzY2FsZSBiZWNhdXNlIG9mIGJydXNoaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIGlmIHkuaXNPcmRpbmFsKClcbiAgICAgICAgICBtZXJnZWRZID0gdXRpbHMubWVyZ2VTZXJpZXNVbnNvcnRlZCh5LnZhbHVlKF9kYXRhT2xkKSwgeS52YWx1ZShkYXRhKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lcmdlZFkgPSB1dGlscy5tZXJnZVNlcmllc1NvcnRlZCh5LnZhbHVlKF9kYXRhT2xkKSwgeS52YWx1ZShkYXRhKSlcbiAgICAgICAgX2xheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgICBfcGF0aFZhbHVlc05ldyA9IHt9XG5cbiAgICAgICAgI19sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt5OnkudmFsdWUoZCkseDp4LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgICBmb3Iga2V5IGluIF9sYXllcktleXNcbiAgICAgICAgICBfcGF0aFZhbHVlc05ld1trZXldID0gZGF0YS5tYXAoKGQpLT4ge3k6eS5tYXAoZCksIHg6eC5zY2FsZSgpKHgubGF5ZXJWYWx1ZShkLCBrZXkpKSwgeXY6eS52YWx1ZShkKSwgeHY6eC5sYXllclZhbHVlKGQsa2V5KSwga2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCBkYXRhOmR9KVxuXG4gICAgICAgICAgbGF5ZXIgPSB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpbXX1cbiAgICAgICAgICAjIGZpbmQgc3RhcnRpbmcgdmFsdWUgZm9yIG9sZFxuICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFkubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRZW2ldWzBdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVttZXJnZWRZW2ldWzBdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWS5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFlbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3Rmlyc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW21lcmdlZFlbaV1bMV1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIGZvciB2YWwsIGkgaW4gbWVyZ2VkWVxuICAgICAgICAgICAgdiA9IHtjb2xvcjpsYXllci5jb2xvciwgeTp2YWxbMl19XG4gICAgICAgICAgICAjIHNldCB4IGFuZCB5IHZhbHVlcyBmb3Igb2xkIHZhbHVlcy4gSWYgdGhlcmUgaXMgYSBhZGRlZCB2YWx1ZSwgbWFpbnRhaW4gdGhlIGxhc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIHZhbFsxXSBpcyB1bmRlZmluZWQgI2llIGFuIG9sZCB2YWx1ZSBpcyBkZWxldGVkLCBtYWludGFpbiB0aGUgbGFzdCBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi55TmV3ID0gbmV3Rmlyc3QueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdGaXJzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0ZpcnN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIF9kYXRhT2xkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgaWYgIHZhbFswXSBpcyB1bmRlZmluZWQgIyBpZSBhIG5ldyB2YWx1ZSBoYXMgYmVlbiBhZGRlZFxuICAgICAgICAgICAgICAgIHYueU9sZCA9IG9sZEZpcnN0LnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRGaXJzdC54ICMgc3RhcnQgeC1hbmltYXRpb24gZnJvbSB0aGUgcHJlZGVjZXNzb3JzIG9sZCBwb3NpdGlvblxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueFxuICAgICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueE9sZCA9IHYueE5ld1xuICAgICAgICAgICAgICB2LnlPbGQgPSB2LnlOZXdcblxuXG4gICAgICAgICAgICBsYXllci52YWx1ZS5wdXNoKHYpXG5cbiAgICAgICAgICBfbGF5b3V0LnB1c2gobGF5ZXIpXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgYXJlYU9sZCA9IGQzLnN2Zy5hcmVhKCkgICAgIyB0cmlja3kuIERyYXcgdGhpcyBsaWtlIGEgdmVydGljYWwgY2hhcnQgYW5kIHRoZW4gcm90YXRlIGFuZCBwb3NpdGlvbiBpdC5cbiAgICAgICAgICAueCgoZCkgLT4gb3B0aW9ucy53aWR0aCAtIGQueU9sZClcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnhPbGQpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeC5zY2FsZSgpKDApKVxuXG4gICAgICAgIGFyZWFOZXcgPSBkMy5zdmcuYXJlYSgpICAgICMgdHJpY2t5LiBEcmF3IHRoaXMgbGlrZSBhIHZlcnRpY2FsIGNoYXJ0IGFuZCB0aGVuIHJvdGF0ZSBhbmQgcG9zaXRpb24gaXQuXG4gICAgICAgICAgLngoKGQpIC0+IG9wdGlvbnMud2lkdGggLSBkLnlOZXcpXG4gICAgICAgICAgLnkwKChkKSAtPiAgZC54TmV3KVxuICAgICAgICAgIC55MSgoZCkgLT4gIHguc2NhbGUoKSgwKSlcblxuICAgICAgICBhcmVhQnJ1c2ggPSBkMy5zdmcuYXJlYSgpICAgICMgdHJpY2t5LiBEcmF3IHRoaXMgbGlrZSBhIHZlcnRpY2FsIGNoYXJ0IGFuZCB0aGVuIHJvdGF0ZSBhbmQgcG9zaXRpb24gaXQuXG4gICAgICAgICAgLngoKGQpIC0+IG9wdGlvbnMud2lkdGggLSB5LnNjYWxlKCkoZC55KSlcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnhOZXcpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeC5zY2FsZSgpKDApKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7b3B0aW9ucy53aWR0aCArIG9mZnNldH0pcm90YXRlKC05MClcIikgI3JvdGF0ZSBhbmQgcG9zaXRpb24gY2hhcnRcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWFPbGQoZC52YWx1ZSkpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWFOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgX2RhdGFPbGQgPSBkYXRhXG4gICAgICAgIF9wYXRoVmFsdWVzT2xkID0gX3BhdGhWYWx1ZXNOZXdcblxuICAgICAgYnJ1c2ggPSAoYXhpcywgaWR4UmFuZ2UsIHdpZHRoLCBoZWlnaHQpIC0+XG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxpbmVcIilcbiAgICAgICAgaWYgYXhpcy5pc09yZGluYWwoKVxuICAgICAgICAgIGxheWVycy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7d2lkdGggKyBheGlzLnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyfSlyb3RhdGUoLTkwKVwiKVxuICAgICAgICAgIGxheWVycy5hdHRyKCdkJywgKGQpIC0+ICBhcmVhQnJ1c2goZC52YWx1ZS5zbGljZShpZHhSYW5nZVswXSwgaWR4UmFuZ2VbMV0gKyAxKSkpXG4gICAgICAgICAgYnJ1c2hTdGFydElkeCA9IGlkeFJhbmdlWzBdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMuYXR0cignZCcsIChkKSAtPiBhcmVhQnJ1c2goZC52YWx1ZSkpXG4gICAgICAgICNsYXllcnMuY2FsbChtYXJrZXJzLCAwKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC55KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9IiwiIyMjKlxuICBAbmdkb2MgbGF5b3V0XG4gIEBuYW1lIGJhcnNcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgQVxuICBAYXJlYSBhcGlcbiAgQGRlc2NyaXB0aW9uXG5cbiAgZHJhd3MgYSBhcmVhIGNoYXJ0IGxheW91dFxuXG4gIEB1c2VzRGltZW5zaW9uIHggW3R5cGU9bGluZWFyLCBkb21haW5SYW5nZT1leHRlbnRdIFRoZSBob3Jpem9udGFsIGRpbWVuc2lvblxuICBAdXNlc0RpbWVuc2lvbiB5IFt0eXBlPWxpbmVhciwgZG9tYWluUmFuZ2U9ZXh0ZW50XVxuICBAdXNlc0RpbWVuc2lvbiBjb2xvciBbdHlwZT1jYXRlZ29yeTIwXVxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJzJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcsIHdrQ2hhcnRNYXJnaW5zKS0+XG4gIHNCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICByZXN0cmljdDogJ0EnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgIF9pZCA9IFwiYmFycyN7c0JhckNudHIrK31cIlxuXG4gICAgYmFycyA9IG51bGxcbiAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcbiAgICBfc2NhbGVMaXN0ID0ge31cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG4gICAgX21lcmdlKFtdKS5rZXkoKGQpIC0+IGQua2V5KVxuXG4gICAgaW5pdGlhbCA9IHRydWVcblxuICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBfc2NhbGVMaXN0LmNvbG9yLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIHZhbHVlOiBfc2NhbGVMaXN0LnguZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogX3NjYWxlTGlzdC5jb2xvci5tYXAoZGF0YS5kYXRhKX19KVxuXG4gICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICBpZiBub3QgYmFyc1xuICAgICAgICBiYXJzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcnMnKVxuICAgICAgIyRsb2cubG9nIFwicmVuZGVyaW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgYmFyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgIGJhck91dGVyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgIGxheW91dCA9IGRhdGEubWFwKChkKSAtPiB7a2V5OnkudmFsdWUoZCksIHg6eC5tYXAoZCksIHk6eS5tYXAoZCksIGNvbG9yOmNvbG9yLm1hcChkKSwgaGVpZ2h0Onkuc2NhbGUoKS5yYW5nZUJhbmQoeS52YWx1ZShkKSksIGRhdGE6ZH0pXG5cbiAgICAgIF9tZXJnZShsYXlvdXQpLmZpcnN0KHt5Om9wdGlvbnMuaGVpZ2h0ICsgYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmd9KS5sYXN0KHt5OjAsIGhlaWdodDpiYXJPdXRlclBhZGRpbmdPbGQgLSBiYXJQYWRkaW5nT2xkIC8gMn0pICAjeS5zY2FsZSgpLnJhbmdlKClbeS5zY2FsZSgpLnJhbmdlKCkubGVuZ3RoLTFdXG5cbiAgICAgIGJhcnMgPSBiYXJzLmRhdGEobGF5b3V0LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgIGVudGVyID0gYmFycy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtYmFyJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+IFwidHJhbnNsYXRlKDAsICN7aWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyfSkgc2NhbGUoMSwgI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9KVwiKVxuICAgICAgZW50ZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlY3Qgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICMuYXR0cigneScsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC55IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS55IC0gYmFyUGFkZGluZ09sZCAvIDIpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgZW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJzond2stY2hhcnQtZGF0YS1sYWJlbCcpXG4gICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGQuaGVpZ2h0IC8gMiApXG4gICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGQueCArIHdrQ2hhcnRNYXJnaW5zLmRhdGFMYWJlbFBhZGRpbmcuaG9yKVxuICAgICAgICAuYXR0cih7ZHk6ICcwLjM1ZW0nLCAndGV4dC1hbmNob3InOidzdGFydCd9KVxuICAgICAgICAuc3R5bGUoe29wYWNpdHk6IDB9KVxuXG4gICAgICBiYXJzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKDAsICN7ZC55fSkgc2NhbGUoMSwxKVwiKVxuICAgICAgYmFycy5zZWxlY3QoJ3JlY3QnKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IE1hdGguYWJzKHguc2NhbGUoKSgwKSAtIGQueCkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcbiAgICAgIGJhcnMuc2VsZWN0KCd0ZXh0JylcbiAgICAgICAgLnRleHQoKGQpIC0+IHguZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGQuaGVpZ2h0IC8gMilcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLnggKyB3a0NoYXJ0TWFyZ2lucy5kYXRhTGFiZWxQYWRkaW5nLmhvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBob3N0LnNob3dEYXRhTGFiZWxzKCkgdGhlbiAxIGVsc2UgMClcblxuXG4gICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDJ9KSBzY2FsZSgxLDApXCIpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgIGluaXRpYWwgPSBmYWxzZVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICBicnVzaCA9IChheGlzLCBpZHhSYW5nZSkgLT5cbiAgICAgIGJhcnNcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsICN7aWYgKHkgPSBheGlzLnNjYWxlKCkoZC5rZXkpKSA+PSAwIHRoZW4geSBlbHNlIC0xMDAwfSlcIilcbiAgICAgICAgLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXJlY3QnKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGF4aXMuc2NhbGUoKS5yYW5nZUJhbmQoKSlcbiAgICAgIGJhcnMuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3knLGF4aXMuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIpXG5cbiAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuXG4gICAgIyMjKlxuICAgICAgICBAbmdkb2MgYXR0clxuICAgICAgICBAbmFtZSBiYXJzI3BhZGRpbmdcbiAgICAgICAgQHBhcmFtIHBhZGRpbmcge2V4cHJlc3Npb259XG4gICAgIyMjXG4gICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgICMjIypzdGFja2VkQXJlYVZlcnRpY2FsXG4gICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgIEBuYW1lIGJhcnMjbGFiZWxzXG4gICAgICAgIEBwYXJhbSBsYWJlbHMge2V4cHJlc3Npb259XG4gICAgIyMjXG4gICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVscycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBob3N0LnNob3dEYXRhTGFiZWxzKGZhbHNlKVxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgIGhvc3Quc2hvd0RhdGFMYWJlbHMoJ3gnKVxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiIyMjKlxuICBAbmdkb2MgbGF5b3V0XG4gIEBuYW1lIGJhckNsdXN0ZXJlZFxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBBXG4gIEBhcmVhIGFwaVxuICBAZGVzY3JpcHRpb25cblxuICBkcmF3cyBhIGFyZWEgY2hhcnQgbGF5b3V0XG5cbiAgQHVzZXNEaW1lbnNpb24geCBbdHlwZT1saW5lYXIsIGRvbWFpblJhbmdlPWV4dGVudF0gVGhlIGhvcml6b250YWwgZGltZW5zaW9uXG4gIEB1c2VzRGltZW5zaW9uIHkgW3R5cGU9bGluZWFyLCBkb21haW5SYW5nZT1leHRlbnRdXG4gIEB1c2VzRGltZW5zaW9uIGNvbG9yIFt0eXBlPWNhdGVnb3J5MjBdXG5cblxuIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JhckNsdXN0ZXJlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG5cbiAgY2x1c3RlcmVkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJjbHVzdGVyZWRCYXIje2NsdXN0ZXJlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG4gICAgICBjbHVzdGVyWSA9IHVuZGVmaW5lZFxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgICAgX21lcmdlTGF5ZXJzID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmxheWVyS2V5KVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuICAgICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBkYXRhLmxheWVycy5tYXAoKGwpIC0+IHtuYW1lOmwubGF5ZXJLZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsLnZhbHVlKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGRhdGEua2V5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5pbmZvIFwicmVuZGVyaW5nIGNsdXN0ZXJlZC1iYXJcIlxuXG4gICAgICAgIGJhclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgICAgIyBtYXAgZGF0YSB0byB0aGUgcmlnaHQgZm9ybWF0IGZvciByZW5kZXJpbmdcbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcblxuICAgICAgICBjbHVzdGVyWSA9IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oeC5sYXllcktleXMoZGF0YSkpLnJhbmdlQmFuZHMoWzAsIHkuc2NhbGUoKS5yYW5nZUJhbmQoKV0sIDAsIDApXG5cbiAgICAgICAgY2x1c3RlciA9IGRhdGEubWFwKChkKSAtPiBsID0ge1xuICAgICAgICAgIGtleTp5LnZhbHVlKGQpLCBkYXRhOmQsIHk6eS5tYXAoZCksIGhlaWdodDogeS5zY2FsZSgpLnJhbmdlQmFuZCh5LnZhbHVlKGQpKVxuICAgICAgICAgIGxheWVyczogbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2xheWVyS2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBrZXk6eS52YWx1ZShkKSwgdmFsdWU6IGRba10sIHk6Y2x1c3RlclkoayksIHg6IHguc2NhbGUoKShkW2tdKSwgd2lkdGg6eC5zY2FsZSgpKGRba10pLCBoZWlnaHQ6Y2x1c3RlclkucmFuZ2VCYW5kKGspfSl9XG4gICAgICAgIClcblxuICAgICAgICBfbWVyZ2UoY2x1c3RlcikuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgaGVpZ2h0Onkuc2NhbGUoKS5yYW5nZUJhbmQoKX0pLmxhc3Qoe3k6MCwgaGVpZ2h0OmJhck91dGVyUGFkZGluZ09sZCAtIGJhclBhZGRpbmdPbGQgLyAyfSlcbiAgICAgICAgX21lcmdlTGF5ZXJzKGNsdXN0ZXJbMF0ubGF5ZXJzKS5maXJzdCh7eTowLCBoZWlnaHQ6MH0pLmxhc3Qoe3k6Y2x1c3RlclswXS5oZWlnaHQsIGhlaWdodDowfSlcblxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBsYXllcnMgPSBsYXllcnMuZGF0YShjbHVzdGVyLCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGF5ZXInKS5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+XG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgICBcInRyYW5zbGF0ZSgwLCAje2lmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMn0pIHNjYWxlKDEsI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje2QueX0pIHNjYWxlKDEsMSlcIilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCAje19tZXJnZS5kZWxldGVkU3VjYyhkKS55ICsgX21lcmdlLmRlbGV0ZWRTdWNjKGQpLmhlaWdodCArIGJhclBhZGRpbmcgLyAyfSkgc2NhbGUoMSwwKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkueSArIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkuaGVpZ2h0KVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQuaGVpZ2h0IGVsc2UgMClcbiAgICAgICAgICAuYXR0cigneCcsIHguc2NhbGUoKSgwKSlcblxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3Iuc2NhbGUoKShkLmxheWVyS2V5KSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IE1hdGgubWluKHguc2NhbGUoKSgwKSwgZC54KSlcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IE1hdGguYWJzKGQuaGVpZ2h0KSlcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgICMuYXR0cignd2lkdGgnLDApXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkKS55KVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICBkcmF3QnJ1c2ggPSAoYXhpcywgaWR4UmFuZ2UpIC0+XG4gICAgICAgIGNsdXN0ZXJZLnJhbmdlQmFuZHMoWzAsYXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpXSwgMCwgMClcbiAgICAgICAgaGVpZ2h0ID0gY2x1c3RlclkucmFuZ2VCYW5kKClcbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsICN7aWYgKHkgPSBheGlzLnNjYWxlKCkoZC5rZXkpKSA+PSAwIHRoZW4geSBlbHNlIC0xMDAwfSlcIilcbiAgICAgICAgICAuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBjbHVzdGVyWShkLmxheWVyS2V5KSlcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3QnJ1c2hcblxuICAgICAgIyMjKlxuICAgICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgICAgQG5hbWUgYmFyQ2x1c3RlcmVkI3BhZGRpbmdcbiAgICAgICAgICBAcGFyYW0gcGFkZGluZyB7ZXhwcmVzc2lvbn1cbiAgICAgICMjI1xuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG5cbiIsIiMjIypcbiAgQG5nZG9jIGxheW91dFxuICBAbmFtZSBiYXJTdGFja2VkXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEFcbiAgQGFyZWEgYXBpXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRyYXdzIGEgYXJlYSBjaGFydCBsYXlvdXRcblxuICBAdXNlc0RpbWVuc2lvbiB4IFt0eXBlPWxpbmVhciwgZG9tYWluUmFuZ2U9ZXh0ZW50XSBUaGUgaG9yaXpvbnRhbCBkaW1lbnNpb25cbiAgQHVzZXNEaW1lbnNpb24geSBbdHlwZT1saW5lYXIsIGRvbWFpblJhbmdlPXRvdGFsXVxuICBAdXNlc0RpbWVuc2lvbiBjb2xvciBbdHlwZT1jYXRlZ29yeTIwXVxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJTdGFja2VkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpIC0+XG5cbiAgc3RhY2tlZEJhckNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgU3RhY2tlZCBiYXInXG5cbiAgICAgIF9pZCA9IFwic3RhY2tlZENvbHVtbiN7c3RhY2tlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIHN0YWNrID0gW11cbiAgICAgIF90b29sdGlwID0gKCktPlxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKVxuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUsIHNoYXBlKSAtPlxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICMkbG9nLmRlYnVnIFwiZHJhd2luZyBzdGFja2VkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHN0YWNrID0gW11cbiAgICAgICAgZm9yIGQgaW4gZGF0YVxuICAgICAgICAgIHgwID0gMFxuICAgICAgICAgIGwgPSB7a2V5OnkudmFsdWUoZCksIGxheWVyczpbXSwgZGF0YTpkLCB5OnkubWFwKGQpLCBoZWlnaHQ6aWYgeS5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDF9XG4gICAgICAgICAgaWYgbC55IGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICBsLmxheWVycyA9IGxheWVyS2V5cy5tYXAoKGspIC0+XG4gICAgICAgICAgICAgIGxheWVyID0ge2xheWVyS2V5OmssIGtleTpsLmtleSwgdmFsdWU6ZFtrXSwgd2lkdGg6IHguc2NhbGUoKSgrZFtrXSksIGhlaWdodDogKGlmIHkuc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxKSwgeDogeC5zY2FsZSgpKCt4MCksIGNvbG9yOiBjb2xvci5zY2FsZSgpKGspfVxuICAgICAgICAgICAgICB4MCArPSArZFtrXVxuICAgICAgICAgICAgICByZXR1cm4gbGF5ZXJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobClcblxuICAgICAgICBfbWVyZ2Uoc3RhY2spLmZpcnN0KHt5Om9wdGlvbnMuaGVpZ2h0ICsgYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIGhlaWdodDowfSkubGFzdCh7eTowLCBoZWlnaHQ6YmFyT3V0ZXJQYWRkaW5nT2xkIC0gYmFyUGFkZGluZ09sZCAvIDJ9KVxuICAgICAgICBfbWVyZ2VMYXllcnMobGF5ZXJLZXlzKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKHN0YWNrLCAoZCktPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIikuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje2lmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMn0pIHNjYWxlKDEsI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgI3tkLnl9KSBzY2FsZSgxLDEpXCIpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDJ9KSBzY2FsZSgxLDApXCIpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT5cbiAgICAgICAgICAgIGlmIF9tZXJnZS5wcmV2KGQua2V5KVxuICAgICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5wcmV2KGQua2V5KS5sYXllcnNbaWR4XS54ICsgX21lcmdlLnByZXYoZC5rZXkpLmxheWVyc1tpZHhdLndpZHRoIGVsc2UgeC5zY2FsZSgpKDApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGQueFxuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gaWYgX21lcmdlLnByZXYoZC5rZXkpIHRoZW4gMCBlbHNlIGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+XG4gICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuZGVsZXRlZFN1Y2MoZC5sYXllcktleSkpXG4gICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbaWR4XS54IGVsc2UgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ueCArIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbbGF5ZXJLZXlzLmxlbmd0aCAtIDFdLndpZHRoXG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICBkcmF3QnJ1c2ggPSAoYXhpcywgaWR4UmFuZ2UpIC0+XG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCAje2lmICh4ID0gYXhpcy5zY2FsZSgpKGQua2V5KSkgPj0gMCB0aGVuIHggZWxzZSAtMTAwMH0pXCIpXG4gICAgICAgICAgLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGF4aXMuc2NhbGUoKS5yYW5nZUJhbmQoKSlcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3QnJ1c2hcblxuICAgICAgIyMjKlxuICAgICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgICAgQG5hbWUgYmFyU3RhY2tlZCNwYWRkaW5nXG4gICAgICAgICAgQHBhcmFtIHBhZGRpbmcge2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgICAgX3NjYWxlTGlzdC55LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuIiwiIyMjKlxuICBAbmdkb2MgbGF5b3V0XG4gIEBuYW1lIGJ1YmJsZVxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBBXG4gIEBhcmVhIGFwaVxuICBAZGVzY3JpcHRpb25cblxuICBkcmF3cyBhIGFyZWEgY2hhcnQgbGF5b3V0XG5cbiAgQHJlcXVpcmVzIHhcbiAgQHJlcXVpcmVzIHlcbiAgQHJlcXVpcmVzIGNvbG9yXG4gIEByZXF1aXJlcyBzaXplXG4gIEByZXF1aXJlcyBsYXlvdXRcblxuXG4jIyNcbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnViYmxlJywgKCRsb2csIHV0aWxzKSAtPlxuICBidWJibGVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgICMkbG9nLmRlYnVnICdidWJibGVDaGFydCBsaW5rZWQnXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnYnViYmxlJyArIGJ1YmJsZUNudHIrK1xuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIGZvciBzTmFtZSwgc2NhbGUgb2YgX3NjYWxlTGlzdFxuICAgICAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogc2NhbGUuYXhpc0xhYmVsKCksIHZhbHVlOiBzY2FsZS5mb3JtYXR0ZWRWYWx1ZShkYXRhKSwgY29sb3I6IGlmIHNOYW1lIGlzICdjb2xvcicgdGhlbiB7J2JhY2tncm91bmQtY29sb3InOnNjYWxlLm1hcChkYXRhKX0gZWxzZSB1bmRlZmluZWR9KVxuXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSkgLT5cblxuICAgICAgICBidWJibGVzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJ1YmJsZScpLmRhdGEoZGF0YSwgKGQpIC0+IGNvbG9yLnZhbHVlKGQpKVxuICAgICAgICBidWJibGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWJ1YmJsZSB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICBidWJibGVzXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGNvbG9yLm1hcChkKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIHI6ICAoZCkgLT4gc2l6ZS5tYXAoZClcbiAgICAgICAgICAgICAgY3g6IChkKSAtPiB4Lm1hcChkKVxuICAgICAgICAgICAgICBjeTogKGQpIC0+IHkubWFwKGQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcbiAgICAgICAgYnViYmxlcy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApLnJlbW92ZSgpXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuXG4gIH1cblxuICAjVE9ETyB2ZXJpZnkgYW5kIHRlc3QgY3VzdG9tIHRvb2x0aXBzIGJlaGF2aW9yIiwiIyMjKlxuICBAbmdkb2MgbGF5b3V0XG4gIEBuYW1lIGNvbHVtblxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBBXG4gIEBhcmVhIGFwaVxuICBAZGVzY3JpcHRpb25cblxuICBkcmF3cyBhIGFyZWEgY2hhcnQgbGF5b3V0XG5cbiAgQHJlcXVpcmVzIHhcbiAgQHJlcXVpcmVzIHlcbiAgQHJlcXVpcmVzIGNvbG9yXG4gIEByZXF1aXJlcyBsYXlvdXRcblxuXG4jIyNcbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sdW1uJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcsIHdrQ2hhcnRNYXJnaW5zKS0+XG4gIHNCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICByZXN0cmljdDogJ0EnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgIF9pZCA9IFwic2ltcGxlQ29sdW1uI3tzQmFyQ250cisrfVwiXG5cbiAgICBjb2x1bW5zID0gbnVsbFxuICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG4gICAgX21lcmdlKFtdKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgIGluaXRpYWwgPSB0cnVlXG4gICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICBjb25maWcgPSB7fVxuICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG5cbiAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG5cbiAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3QueS5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgIGlmIG5vdCBjb2x1bW5zXG4gICAgICAgIGNvbHVtbnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtY29sdW1uJylcbiAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBzdGFja2VkLWJhclwiXG5cbiAgICAgIGJhclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCkgLT4ge2RhdGE6ZCwga2V5OngudmFsdWUoZCksIHg6eC5tYXAoZCksIHk6TWF0aC5taW4oeS5zY2FsZSgpKDApLCB5Lm1hcChkKSksIGNvbG9yOmNvbG9yLm1hcChkKSwgd2lkdGg6eC5zY2FsZSgpLnJhbmdlQmFuZCh4LnZhbHVlKGQpKSwgaGVpZ2h0Ok1hdGguYWJzKHkuc2NhbGUoKSgwKSAtIHkubWFwKGQpKX0pXG5cbiAgICAgIF9tZXJnZShsYXlvdXQpLmZpcnN0KHt4OjAsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOiBiYXJPdXRlclBhZGRpbmd9KVxuXG5cbiAgICAgIGNvbHVtbnMgPSBjb2x1bW5zLmRhdGEobGF5b3V0LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgIGVudGVyID0gY29sdW1ucy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtY29sdW1uJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLGkpIC0+IFwidHJhbnNsYXRlKCN7aWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueCAgKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgaWYgaSB0aGVuIGJhclBhZGRpbmdPbGQgLyAyIGVsc2UgYmFyT3V0ZXJQYWRkaW5nT2xkfSwje2QueX0pIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwxKVwiKVxuICAgICAgZW50ZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlY3Qgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgIGVudGVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1kYXRhLWxhYmVsJylcbiAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC53aWR0aCAvIDIpXG4gICAgICAgIC5hdHRyKCd5JywgLSB3a0NoYXJ0TWFyZ2lucy5kYXRhTGFiZWxQYWRkaW5nLnZlcnQpXG4gICAgICAgIC5hdHRyKHsndGV4dC1hbmNob3InOidtaWRkbGUnfSlcbiAgICAgICAgLnN0eWxlKHtvcGFjaXR5OiAwfSlcblxuICAgICAgY29sdW1ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwgI3tkLnl9KSBzY2FsZSgxLDEpXCIpXG4gICAgICBjb2x1bW5zLnNlbGVjdCgncmVjdCcpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgY29sdW1ucy5zZWxlY3QoJ3RleHQnKVxuICAgICAgICAudGV4dCgoZCkgLT4geS5mb3JtYXR0ZWRWYWx1ZShkLmRhdGEpKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC53aWR0aCAvIDIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaG9zdC5zaG93RGF0YUxhYmVscygpIHRoZW4gMSBlbHNlIDApXG5cbiAgICAgIGNvbHVtbnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnggLSBiYXJQYWRkaW5nIC8gMn0sI3tkLnl9KSBzY2FsZSgwLDEpXCIpXG4gICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgIGJydXNoID0gKGF4aXMsIGlkeFJhbmdlKSAtPlxuICAgICAgY29sdW1uc1xuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiAoeCA9IGF4aXMuc2NhbGUoKShkLmtleSkpID49IDAgdGhlbiB4IGVsc2UgLTEwMDB9LCAje2QueX0pXCIpXG4gICAgICAgIC5zZWxlY3RBbGwoJy53ay1jaGFydC1yZWN0JylcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGF4aXMuc2NhbGUoKS5yYW5nZUJhbmQoKSlcbiAgICAgIGNvbHVtbnMuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cigneCcsYXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMilcblxuICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBicnVzaFxuXG4gICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICBfc2NhbGVMaXN0LngucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgaG9zdC5zaG93RGF0YUxhYmVscyhmYWxzZSlcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJyBvciB2YWwgaXMgXCJcIlxuICAgICAgICBob3N0LnNob3dEYXRhTGFiZWxzKCd5JylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICB9XG4iLCIjIyMqXG4gIEBuZ2RvYyBsYXlvdXRcbiAgQG5hbWUgY29sdW1uQ2x1c3RlcmVkXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEFcbiAgQGFyZWEgYXBpXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRyYXdzIGEgYXJlYSBjaGFydCBsYXlvdXRcblxuICBAcmVxdWlyZXMgeFxuICBAcmVxdWlyZXMgeVxuICBAcmVxdWlyZXMgY29sb3JcbiAgQHJlcXVpcmVzIGxheW91dFxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5DbHVzdGVyZWQnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZyktPlxuXG4gIGNsdXN0ZXJlZEJhckNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIF9pZCA9IFwiY2x1c3RlcmVkQ29sdW1uI3tjbHVzdGVyZWRCYXJDbnRyKyt9XCJcblxuICAgICAgbGF5ZXJzID0gbnVsbFxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgICAgX21lcmdlTGF5ZXJzID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmxheWVyS2V5KVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuXG4gICAgICBjb25maWcgPSB7fVxuICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgIGRyYXdCcnVzaCA9IHVuZGVmaW5lZFxuICAgICAgY2x1c3RlclggPSB1bmRlZmluZWRcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmluZm8gXCJyZW5kZXJpbmcgY2x1c3RlcmVkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICAjIG1hcCBkYXRhIHRvIHRoZSByaWdodCBmb3JtYXQgZm9yIHJlbmRlcmluZ1xuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIGNsdXN0ZXJYID0gZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbih5LmxheWVyS2V5cyhkYXRhKSkucmFuZ2VCYW5kcyhbMCx4LnNjYWxlKCkucmFuZ2VCYW5kKCldLCAwLCAwKVxuXG4gICAgICAgIGNsdXN0ZXIgPSBkYXRhLm1hcCgoZCkgLT4gbCA9IHtcbiAgICAgICAgICBrZXk6eC52YWx1ZShkKSwgZGF0YTpkLCB4OngubWFwKGQpLCB3aWR0aDogeC5zY2FsZSgpLnJhbmdlQmFuZCh4LnZhbHVlKGQpKVxuICAgICAgICAgIGxheWVyczogbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2xheWVyS2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBrZXk6eC52YWx1ZShkKSwgdmFsdWU6IGRba10sIHg6Y2x1c3RlclgoayksIHk6IHkuc2NhbGUoKShkW2tdKSwgaGVpZ2h0Onkuc2NhbGUoKSgwKSAtIHkuc2NhbGUoKShkW2tdKSwgd2lkdGg6Y2x1c3RlclgucmFuZ2VCYW5kKGspfSl9XG4gICAgICAgIClcblxuICAgICAgICBfbWVyZ2UoY2x1c3RlcikuZmlyc3Qoe3g6YmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOjB9KVxuICAgICAgICBfbWVyZ2VMYXllcnMoY2x1c3RlclswXS5sYXllcnMpLmZpcnN0KHt4OjAsIHdpZHRoOjB9KS5sYXN0KHt4OmNsdXN0ZXJbMF0ud2lkdGgsIHdpZHRoOjB9KVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVycy5kYXRhKGNsdXN0ZXIsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYXllcicpLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiBpbml0aWFsIHRoZW4gZC54IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS54ICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aCArIGJhclBhZGRpbmdPbGQgLyAyfSwwKSBzY2FsZSgje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0sIDEpXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2QueH0sMCkgc2NhbGUoMSwxKVwiKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnggLSBiYXJQYWRkaW5nIC8gMn0sIDApIHNjYWxlKDAsMSlcIilcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGJhcnMgPSBsYXllcnMuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAuZGF0YShcbiAgICAgICAgICAgIChkKSAtPiBkLmxheWVyc1xuICAgICAgICAgICwgKGQpIC0+IGQubGF5ZXJLZXkgKyAnfCcgKyBkLmtleVxuICAgICAgICAgIClcblxuICAgICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQpLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPmlmIGluaXRpYWwgdGhlbiBkLndpZHRoIGVsc2UgMClcblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC5sYXllcktleSkpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGQueClcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBNYXRoLm1pbih5LnNjYWxlKCkoMCksIGQueSkpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBNYXRoLmFicyhkLmhlaWdodCkpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywwKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkKS54KVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGluaXRpYWwgPSBmYWxzZVxuICAgICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICAgZHJhd0JydXNoID0gKGF4aXMsIGlkeFJhbmdlKSAtPlxuICAgICAgICBjbHVzdGVyWC5yYW5nZUJhbmRzKFswLGF4aXMuc2NhbGUoKS5yYW5nZUJhbmQoKV0sIDAsIDApXG4gICAgICAgIHdpZHRoID0gY2x1c3RlclgucmFuZ2VCYW5kKClcbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7aWYgKHggPSBheGlzLnNjYWxlKCkoZC5rZXkpKSA+PSAwIHRoZW4geCBlbHNlIC0xMDAwfSwwKVwiKVxuICAgICAgICAgIC5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBjbHVzdGVyWChkLmxheWVyS2V5KSlcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3QnJ1c2hcblxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICAgIF9zY2FsZUxpc3QueC5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cbiIsIiMjIypcbiAgQG5nZG9jIGxheW91dFxuICBAbmFtZSBjb2x1bW5TdGFja2VkXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEFcbiAgQGFyZWEgYXBpXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRyYXdzIGEgYXJlYSBjaGFydCBsYXlvdXRcblxuICBAcmVxdWlyZXMgeFxuICBAcmVxdWlyZXMgeVxuICBAcmVxdWlyZXMgY29sb3JcbiAgQHJlcXVpcmVzIGxheW91dFxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5TdGFja2VkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpIC0+XG5cbiAgc3RhY2tlZENvbHVtbkNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgU3RhY2tlZCBiYXInXG5cbiAgICAgIF9pZCA9IFwic3RhY2tlZENvbHVtbiN7c3RhY2tlZENvbHVtbkNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIHN0YWNrID0gW11cbiAgICAgIF90b29sdGlwID0gKCktPlxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgIGNvbmZpZyA9IHt9XG4gICAgICBfLm1lcmdlKGNvbmZpZyxiYXJDb25maWcpXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBkYXRhLmxheWVycy5tYXAoKGwpIC0+IHtuYW1lOmwubGF5ZXJLZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLnZhbHVlKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGRhdGEua2V5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplLCBzaGFwZSkgLT5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoXCIubGF5ZXJcIilcbiAgICAgICAgIyRsb2cuZGVidWcgXCJkcmF3aW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgc3RhY2sgPSBbXVxuICAgICAgICBmb3IgZCBpbiBkYXRhXG4gICAgICAgICAgeTAgPSAwXG4gICAgICAgICAgbCA9IHtrZXk6eC52YWx1ZShkKSwgbGF5ZXJzOltdLCBkYXRhOmQsIHg6eC5tYXAoZCksIHdpZHRoOmlmIHguc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxfVxuICAgICAgICAgIGlmIGwueCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgbC5sYXllcnMgPSBsYXllcktleXMubWFwKChrKSAtPlxuICAgICAgICAgICAgICBsYXllciA9IHtsYXllcktleTprLCBrZXk6bC5rZXksIHZhbHVlOmRba10sIGhlaWdodDogIHkuc2NhbGUoKSgwKSAtIHkuc2NhbGUoKSgrZFtrXSksIHdpZHRoOiAoaWYgeC5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDEpLCB5OiB5LnNjYWxlKCkoK3kwICsgK2Rba10pLCBjb2xvcjogY29sb3Iuc2NhbGUoKShrKX1cbiAgICAgICAgICAgICAgeTAgKz0gK2Rba11cbiAgICAgICAgICAgICAgcmV0dXJuIGxheWVyXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBzdGFjay5wdXNoKGwpXG5cbiAgICAgICAgX21lcmdlKHN0YWNrKS5maXJzdCh7eDogYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOjB9KVxuICAgICAgICBfbWVyZ2VMYXllcnMobGF5ZXJLZXlzKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKHN0YWNrLCAoZCktPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgYmFyUGFkZGluZ09sZCAvIDJ9LDApIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwgMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tkLnh9LDApIHNjYWxlKDEsMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueCAtIGJhclBhZGRpbmcgLyAyfSwgMCkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT5cbiAgICAgICAgICAgIGlmIF9tZXJnZS5wcmV2KGQua2V5KVxuICAgICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5wcmV2KGQua2V5KS5sYXllcnNbaWR4XS55IGVsc2UgeS5zY2FsZSgpKDApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGQueVxuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLnkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsMClcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPlxuICAgICAgICAgICAgaWR4ID0gbGF5ZXJLZXlzLmluZGV4T2YoX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgaWYgaWR4ID49IDAgdGhlbiBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2lkeF0ueSArIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbaWR4XS5oZWlnaHQgZWxzZSBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2xheWVyS2V5cy5sZW5ndGggLSAxXS55XG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGluaXRpYWwgPSBmYWxzZVxuICAgICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICAgZHJhd0JydXNoID0gKGF4aXMsIGlkeFJhbmdlKSAtPlxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiAoeCA9IGF4aXMuc2NhbGUoKShkLmtleSkpID49IDAgdGhlbiB4IGVsc2UgLTEwMDB9LDApXCIpXG4gICAgICAgICAgLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gYXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpKVxuXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygndG90YWwnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgZHJhd0JydXNoXG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LngucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG4iLCIjIyMqXG4gIEBuZ2RvYyBsYXlvdXRcbiAgQG5hbWUgZ2F1Z2VcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgQVxuICBAYXJlYSBhcGlcbiAgQGRlc2NyaXB0aW9uXG5cbiAgZHJhd3MgYSBhcmVhIGNoYXJ0IGxheW91dFxuXG4gIEByZXF1aXJlcyB4XG4gIEByZXF1aXJlcyB5XG4gIEByZXF1aXJlcyBjb2xvclxuICBAcmVxdWlyZXMgbGF5b3V0XG5cblxuIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2dhdWdlJywgKCRsb2csIHV0aWxzKSAtPlxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcbiAgICBjb250cm9sbGVyOiAoJHNjb3BlLCAkYXR0cnMpIC0+XG4gICAgICBtZSA9IHtjaGFydFR5cGU6ICdHYXVnZUNoYXJ0JywgaWQ6dXRpbHMuZ2V0SWQoKX1cbiAgICAgICRhdHRycy4kc2V0KCdjaGFydC1pZCcsIG1lLmlkKVxuICAgICAgcmV0dXJuIG1lXG4gICAgXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgaW5pdGFsU2hvdyA9IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICRsb2cuaW5mbyAnZHJhd2luZyBHYXVnZSBDaGFydCdcblxuICAgICAgICBkYXQgPSBbZGF0YV1cblxuICAgICAgICB5RG9tYWluID0geS5zY2FsZSgpLmRvbWFpbigpXG4gICAgICAgIGNvbG9yRG9tYWluID0gYW5ndWxhci5jb3B5KGNvbG9yLnNjYWxlKCkuZG9tYWluKCkpXG4gICAgICAgIGNvbG9yRG9tYWluLnVuc2hpZnQoeURvbWFpblswXSlcbiAgICAgICAgY29sb3JEb21haW4ucHVzaCh5RG9tYWluWzFdKVxuICAgICAgICByYW5nZXMgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMS4uY29sb3JEb21haW4ubGVuZ3RoLTFdXG4gICAgICAgICAgcmFuZ2VzLnB1c2gge2Zyb206K2NvbG9yRG9tYWluW2ktMV0sdG86K2NvbG9yRG9tYWluW2ldfVxuXG4gICAgICAgICNkcmF3IGNvbG9yIHNjYWxlXG5cbiAgICAgICAgYmFyID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgIGJhciA9IGJhci5kYXRhKHJhbmdlcywgKGQsIGkpIC0+IGkpXG4gICAgICAgIGlmIGluaXRhbFNob3dcbiAgICAgICAgICBiYXIuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKS5hdHRyKCd3aWR0aCcsIDUwKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJhci5lbnRlcigpLmFwcGVuZCgncmVjdCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhcicpXG4gICAgICAgICAgICAuYXR0cigneCcsIDApLmF0dHIoJ3dpZHRoJywgNTApXG5cbiAgICAgICAgYmFyLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLChkKSAtPiB5LnNjYWxlKCkoMCkgLSB5LnNjYWxlKCkoZC50byAtIGQuZnJvbSkpXG4gICAgICAgICAgLmF0dHIoJ3knLChkKSAtPiB5LnNjYWxlKCkoZC50bykpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC5mcm9tKSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGJhci5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICAjIGRyYXcgdmFsdWVcblxuICAgICAgICBhZGRNYXJrZXIgPSAocykgLT5cbiAgICAgICAgICBzLmFwcGVuZCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgNTUpLmF0dHIoJ2hlaWdodCcsIDQpLnN0eWxlKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgICBzLmFwcGVuZCgnY2lyY2xlJykuYXR0cigncicsIDEwKS5hdHRyKCdjeCcsIDY1KS5hdHRyKCdjeScsMikuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG5cbiAgICAgICAgbWFya2VyID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpXG4gICAgICAgIG1hcmtlciA9IG1hcmtlci5kYXRhKGRhdCwgKGQpIC0+ICd3ay1jaGFydC1tYXJrZXInKVxuICAgICAgICBtYXJrZXIuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LW1hcmtlcicpLmNhbGwoYWRkTWFya2VyKVxuXG4gICAgICAgIGlmIGluaXRhbFNob3dcbiAgICAgICAgICBtYXJrZXIuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKDAsI3t5LnNjYWxlKCkoZC52YWx1ZSl9KVwiKS5zdHlsZSgnb3BhY2l0eScsIDApXG5cbiAgICAgICAgbWFya2VyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7eS5zY2FsZSgpKGQudmFsdWUpfSlcIilcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC52YWx1ZSkpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBpbml0YWxTaG93ID0gZmFsc2VcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICB0aGlzLnJlcXVpcmVkU2NhbGVzKFsneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgnY29sb3InKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcblxuICB9XG5cbiAgI3RvZG8gcmVmZWN0b3IiLCIjIyMqXG4gIEBuZ2RvYyBsYXlvdXRcbiAgQG5hbWUgZ2VvTWFwXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEFcbiAgQGFyZWEgYXBpXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRyYXdzIGEgYXJlYSBjaGFydCBsYXlvdXRcblxuICBAcmVxdWlyZXMgeFxuICBAcmVxdWlyZXMgeVxuICBAcmVxdWlyZXMgY29sb3JcbiAgQHJlcXVpcmVzIGxheW91dFxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdnZW9NYXAnLCAoJGxvZywgdXRpbHMpIC0+XG4gIG1hcENudHIgPSAwXG5cbiAgcGFyc2VMaXN0ID0gKHZhbCkgLT5cbiAgICBpZiB2YWxcbiAgICAgIGwgPSB2YWwudHJpbSgpLnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJykuc3BsaXQoJywnKS5tYXAoKGQpIC0+IGQucmVwbGFjZSgvXltcXFwifCddfFtcXFwifCddJC9nLCAnJykpXG4gICAgICBsID0gbC5tYXAoKGQpIC0+IGlmIGlzTmFOKGQpIHRoZW4gZCBlbHNlICtkKVxuICAgICAgcmV0dXJuIGlmIGwubGVuZ3RoIGlzIDEgdGhlbiByZXR1cm4gbFswXSBlbHNlIGxcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIHNjb3BlOiB7XG4gICAgICBnZW9qc29uOiAnPSdcbiAgICAgIHByb2plY3Rpb246ICc9J1xuICAgIH1cblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX2lkID0gJ2dlb01hcCcgKyBtYXBDbnRyKytcbiAgICAgIF9kYXRhTWFwcGluZyA9IGQzLm1hcCgpXG5cbiAgICAgIF9zY2FsZSA9IDFcbiAgICAgIF9yb3RhdGUgPSBbMCwwXVxuICAgICAgX2lkUHJvcCA9ICcnXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG5cbiAgICAgICAgdmFsID0gX2RhdGFNYXBwaW5nLmdldChkYXRhLnByb3BlcnRpZXNbX2lkUHJvcFswXV0pXG4gICAgICAgIEBsYXllcnMucHVzaCh7bmFtZTp2YWwuUlMsIHZhbHVlOnZhbC5ERVN9KVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHBhdGhTZWwgPSBbXVxuXG4gICAgICBfcHJvamVjdGlvbiA9IGQzLmdlby5vcnRob2dyYXBoaWMoKVxuICAgICAgX3dpZHRoID0gMFxuICAgICAgX2hlaWdodCA9IDBcbiAgICAgIF9wYXRoID0gdW5kZWZpbmVkXG4gICAgICBfem9vbSA9IGQzLmdlby56b29tKClcbiAgICAgICAgLnByb2plY3Rpb24oX3Byb2plY3Rpb24pXG4gICAgICAgICMuc2NhbGVFeHRlbnQoW3Byb2plY3Rpb24uc2NhbGUoKSAqIC43LCBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxMF0pXG4gICAgICAgIC5vbiBcInpvb20ucmVkcmF3XCIsICgpIC0+XG4gICAgICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBwYXRoU2VsLmF0dHIoXCJkXCIsIF9wYXRoKTtcblxuICAgICAgX2dlb0pzb24gPSB1bmRlZmluZWRcblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgX3dpZHRoID0gb3B0aW9ucy53aWR0aFxuICAgICAgICBfaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcbiAgICAgICAgaWYgZGF0YSBhbmQgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eShfaWRQcm9wWzFdKVxuICAgICAgICAgIGZvciBlIGluIGRhdGFcbiAgICAgICAgICAgIF9kYXRhTWFwcGluZy5zZXQoZVtfaWRQcm9wWzFdXSwgZSlcblxuICAgICAgICBpZiBfZ2VvSnNvblxuXG4gICAgICAgICAgX3Byb2plY3Rpb24udHJhbnNsYXRlKFtfd2lkdGgvMiwgX2hlaWdodC8yXSlcbiAgICAgICAgICBwYXRoU2VsID0gdGhpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEoX2dlb0pzb24uZmVhdHVyZXMsIChkKSAtPiBkLnByb3BlcnRpZXNbX2lkUHJvcFswXV0pXG4gICAgICAgICAgcGF0aFNlbFxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwic3ZnOnBhdGhcIilcbiAgICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywnbGlnaHRncmV5Jykuc3R5bGUoJ3N0cm9rZScsICdkYXJrZ3JleScpXG4gICAgICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgICAgICAgICAgLmNhbGwoX3pvb20pXG5cbiAgICAgICAgICBwYXRoU2VsXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgX3BhdGgpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT5cbiAgICAgICAgICAgICAgdmFsID0gX2RhdGFNYXBwaW5nLmdldChkLnByb3BlcnRpZXNbX2lkUHJvcFswXV0pXG4gICAgICAgICAgICAgIGNvbG9yLm1hcCh2YWwpXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgcGF0aFNlbC5leGl0KCkucmVtb3ZlKClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWydjb2xvciddKVxuICAgICAgICBfc2NhbGVMaXN0LmNvbG9yLnJlc2V0T25OZXdEYXRhKHRydWUpXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICAjIEdlb01hcCBzcGVjaWZpYyBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NvcGUuJHdhdGNoICdwcm9qZWN0aW9uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgJGxvZy5sb2cgJ3NldHRpbmcgUHJvamVjdGlvbiBwYXJhbXMnLCB2YWxcbiAgICAgICAgICBpZiBkMy5nZW8uaGFzT3duUHJvcGVydHkodmFsLnByb2plY3Rpb24pXG4gICAgICAgICAgICBfcHJvamVjdGlvbiA9IGQzLmdlb1t2YWwucHJvamVjdGlvbl0oKVxuICAgICAgICAgICAgX3Byb2plY3Rpb24uY2VudGVyKHZhbC5jZW50ZXIpLnNjYWxlKHZhbC5zY2FsZSkucm90YXRlKHZhbC5yb3RhdGUpLmNsaXBBbmdsZSh2YWwuY2xpcEFuZ2xlKVxuICAgICAgICAgICAgX2lkUHJvcCA9IHZhbC5pZE1hcFxuICAgICAgICAgICAgaWYgX3Byb2plY3Rpb24ucGFyYWxsZWxzXG4gICAgICAgICAgICAgIF9wcm9qZWN0aW9uLnBhcmFsbGVscyh2YWwucGFyYWxsZWxzKVxuICAgICAgICAgICAgX3NjYWxlID0gX3Byb2plY3Rpb24uc2NhbGUoKVxuICAgICAgICAgICAgX3JvdGF0ZSA9IF9wcm9qZWN0aW9uLnJvdGF0ZSgpXG4gICAgICAgICAgICBfcGF0aCA9IGQzLmdlby5wYXRoKCkucHJvamVjdGlvbihfcHJvamVjdGlvbilcbiAgICAgICAgICAgIF96b29tLnByb2plY3Rpb24oX3Byb2plY3Rpb24pXG5cbiAgICAgICAgICAgIGxheW91dC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgICAsIHRydWUgI2RlZXAgd2F0Y2hcblxuICAgICAgc2NvcGUuJHdhdGNoICdnZW9qc29uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkIGFuZCB2YWwgaXNudCAnJ1xuICAgICAgICAgIF9nZW9Kc29uID0gdmFsXG4gICAgICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cblxuICB9XG5cbiAgI1RPRE8gcmUtdGVzdCBhbmQgdmVyaWZ5IGluIG5ldyBhcHBsaWNhaXRvbi4iLCIjIyMqXG4gIEBuZ2RvYyBsYXlvdXRcbiAgQG5hbWUgaGlzdG9ncmFtXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEFcbiAgQGFyZWEgYXBpXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRyYXdzIGEgYXJlYSBjaGFydCBsYXlvdXRcblxuICBAcmVxdWlyZXMgcmFuZ2VYXG4gIEByZXF1aXJlcyByYW5nZVlcbiAgQHJlcXVpcmVzIGNvbG9yXG4gIEByZXF1aXJlcyBsYXlvdXRcblxuXG4jIyNcbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sdW1uSGlzdG9ncmFtJywgKCRsb2csIGJhckNvbmZpZywgdXRpbHMsIHdrQ2hhcnRNYXJnaW5zKSAtPlxuXG4gIHNIaXN0b0NudHIgPSAwXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJoaXN0b2dyYW0je3NIaXN0b0NudHIrK31cIlxuXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIGJ1Y2tldHMgPSB1bmRlZmluZWRcbiAgICAgIGxhYmVscyA9IHVuZGVmaW5lZFxuICAgICAgY29uZmlnID0ge31cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKS0+IGQueFZhbClcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnJhbmdlWC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgbG93ZXIgPSBfc2NhbGVMaXN0LnJhbmdlWC5mb3JtYXRWYWx1ZShfc2NhbGVMaXN0LnJhbmdlWC5sb3dlclZhbHVlKGRhdGEuZGF0YSkpXG4gICAgICAgIGlmIF9zY2FsZUxpc3QucmFuZ2VYLnVwcGVyUHJvcGVydHkoKVxuICAgICAgICAgIHVwcGVyID0gX3NjYWxlTGlzdC5yYW5nZVguZm9ybWF0VmFsdWUoX3NjYWxlTGlzdC5yYW5nZVgudXBwZXJWYWx1ZShkYXRhLmRhdGEpKVxuICAgICAgICAgIG5hbWUgPSBsb3dlciArICcgLSAnICsgdXBwZXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5hbWUgPSBfc2NhbGVMaXN0LnJhbmdlWC5mb3JtYXRWYWx1ZShfc2NhbGVMaXN0LnJhbmdlWC5sb3dlclZhbHVlKGRhdGEuZGF0YSkpXG5cbiAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogX3NjYWxlTGlzdC55LmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUsIHNoYXBlLCByYW5nZVgpIC0+XG5cbiAgICAgICAgaWYgcmFuZ2VYLnVwcGVyUHJvcGVydHkoKVxuICAgICAgICAgIGxheW91dCA9IGRhdGEubWFwKChkKSAtPiB7eDpyYW5nZVguc2NhbGUoKShyYW5nZVgubG93ZXJWYWx1ZShkKSksIHhWYWw6cmFuZ2VYLmxvd2VyVmFsdWUoZCksIHdpZHRoOnJhbmdlWC5zY2FsZSgpKHJhbmdlWC51cHBlclZhbHVlKGQpKSAtIHJhbmdlWC5zY2FsZSgpKHJhbmdlWC5sb3dlclZhbHVlKGQpKSwgeTp5Lm1hcChkKSwgaGVpZ2h0Om9wdGlvbnMuaGVpZ2h0IC0geS5tYXAoZCksIGNvbG9yOmNvbG9yLm1hcChkKSwgZGF0YTpkfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIGRhdGEubGVuZ3RoID4gMFxuICAgICAgICAgICAgc3RhcnQgPSByYW5nZVgubG93ZXJWYWx1ZShkYXRhWzBdKVxuICAgICAgICAgICAgc3RlcCA9IHJhbmdlWC5sb3dlclZhbHVlKGRhdGFbMV0pIC0gc3RhcnRcbiAgICAgICAgICAgIHdpZHRoID0gb3B0aW9ucy53aWR0aCAvIGRhdGEubGVuZ3RoXG4gICAgICAgICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCwgaSkgLT4ge3g6cmFuZ2VYLnNjYWxlKCkoc3RhcnQgKyBzdGVwICogaSksIHhWYWw6cmFuZ2VYLmxvd2VyVmFsdWUoZCksIHdpZHRoOndpZHRoLCB5OnkubWFwKGQpLCBoZWlnaHQ6b3B0aW9ucy5oZWlnaHQgLSB5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCBkYXRhOmR9KVxuXG4gICAgICAgIF9tZXJnZShsYXlvdXQpLmZpcnN0KHt4OjAsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGgsIHdpZHRoOiAwfSlcblxuICAgICAgICBpZiBub3QgYnVja2V0c1xuICAgICAgICAgIGJ1Y2tldHMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYnVja2V0JylcblxuICAgICAgICBidWNrZXRzID0gYnVja2V0cy5kYXRhKGxheW91dCwgKGQpIC0+IGQueFZhbClcblxuICAgICAgICBlbnRlciA9IGJ1Y2tldHMuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWJ1Y2tldCcpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aH0sI3tkLnl9KSBzY2FsZSgje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0sMSlcIilcbiAgICAgICAgZW50ZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgICAgZW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1kYXRhLWxhYmVsJylcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLndpZHRoIC8gMilcbiAgICAgICAgICAuYXR0cigneScsIC13a0NoYXJ0TWFyZ2lucy5kYXRhTGFiZWxQYWRkaW5nLnZlcnQpXG4gICAgICAgICAgLmF0dHIoeyd0ZXh0LWFuY2hvcic6J21pZGRsZSd9KVxuICAgICAgICAgIC5zdHlsZSh7b3BhY2l0eTogMH0pXG5cbiAgICAgICAgYnVja2V0cy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tkLnh9LCAje2QueX0pIHNjYWxlKDEsMSlcIilcbiAgICAgICAgYnVja2V0cy5zZWxlY3QoJ3JlY3QnKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgICBidWNrZXRzLnNlbGVjdCgndGV4dCcpXG4gICAgICAgICAgLnRleHQoKGQpIC0+IHkuZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLndpZHRoIC8gMilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGhvc3Quc2hvd0RhdGFMYWJlbHMoKSB0aGVuIDEgZWxzZSAwKVxuXG4gICAgICAgIGJ1Y2tldHMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueH0sI3tkLnl9KSBzY2FsZSgwLDEpXCIpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG5cbiAgICAgIGJydXNoID0gKGF4aXMsIGlkeFJhbmdlLCB3aWR0aCwgaGVpZ2h0KSAtPlxuICAgICAgICBidWNrZXRXaWR0aCA9IChheGlzLCBkKSAtPlxuICAgICAgICAgIGlmIGF4aXMudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgICByZXR1cm4gYXhpcy5zY2FsZSgpKGF4aXMudXBwZXJWYWx1ZShkLmRhdGEpKSAtIGF4aXMuc2NhbGUoKShheGlzLmxvd2VyVmFsdWUoZC5kYXRhKSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gd2lkdGggLyBNYXRoLm1heChpZHhSYW5nZVsxXSAtIGlkeFJhbmdlWzBdICsgMSwgMSlcblxuICAgICAgICBidWNrZXRzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+XG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgICBcInRyYW5zbGF0ZSgje2lmICh4ID0gYXhpcy5zY2FsZSgpKGQueFZhbCkpID49IDAgdGhlbiB4IGVsc2UgLTEwMDB9LCAje2QueX0pXCIpXG4gICAgICAgIGJ1Y2tldHMuc2VsZWN0KCdyZWN0JylcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gYnVja2V0V2lkdGgoYXhpcywgZCkpXG4gICAgICAgIGJ1Y2tldHMuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cigneCcsKGQpIC0+IGJ1Y2tldFdpZHRoKGF4aXMsIGQpIC8gMilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsncmFuZ2VYJywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgncmFuZ2VYJykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuc2NhbGVUeXBlKCdsaW5lYXInKS5kb21haW5DYWxjKCdyYW5nZUV4dGVudCcpXG4gICAgICAgIEBnZXRLaW5kKCdjb2xvcicpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgaG9zdC5zaG93RGF0YUxhYmVscyhmYWxzZSlcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgICAgaG9zdC5zaG93RGF0YUxhYmVscygneScpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuIiwiIyMjKlxuICBAbmdkb2MgbGF5b3V0XG4gIEBuYW1lIGxpbmVcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgQVxuICBAYXJlYSBhcGlcbiAgQGRlc2NyaXB0aW9uXG5cbiAgZHJhd3MgYSBhcmVhIGNoYXJ0IGxheW91dFxuXG4gIEByZXF1aXJlcyB4XG4gIEByZXF1aXJlcyB5XG4gIEByZXF1aXJlcyBjb2xvclxuICBAcmVxdWlyZXMgbGF5b3V0XG5cblxuIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2xpbmUnLCAoJGxvZywgYmVoYXZpb3IsIHV0aWxzLCB0aW1pbmcpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIF9sYXllcktleXMgPSBbXVxuICAgICAgX2xheW91dCA9IFtdXG4gICAgICBfZGF0YU9sZCA9IFtdXG4gICAgICBfcGF0aFZhbHVlc09sZCA9IFtdXG4gICAgICBfcGF0aFZhbHVlc05ldyA9IFtdXG4gICAgICBfcGF0aEFycmF5ID0gW11cbiAgICAgIF9pbml0aWFsT3BhY2l0eSA9IDBcblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIF9pZCA9ICdsaW5lJyArIGxpbmVDbnRyKytcbiAgICAgIGxpbmUgPSB1bmRlZmluZWRcbiAgICAgIG1hcmtlcnMgPSB1bmRlZmluZWRcbiAgICAgIG1hcmtlcnNCcnVzaGVkID0gdW5kZWZpbmVkXG5cbiAgICAgIGxpbmVCcnVzaCA9IHVuZGVmaW5lZFxuXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGlkeCkgLT5cbiAgICAgICAgX3BhdGhBcnJheSA9IF8udG9BcnJheShfcGF0aFZhbHVlc05ldylcbiAgICAgICAgdHRNb3ZlRGF0YS5hcHBseSh0aGlzLCBbaWR4XSlcblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX3BhdGhBcnJheS5tYXAoKGwpIC0+IHtuYW1lOmxbaWR4XS5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsW2lkeF0ueXYpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsW2lkeF0uY29sb3J9LCB4djpsW2lkeF0ueHZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueHYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbaWR4XS5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkW2lkeF0uY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gZFtpZHhdLnkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X3NjYWxlTGlzdC54LnNjYWxlKCkoX3BhdGhBcnJheVswXVtpZHhdLnh2KSArIG9mZnNldH0pXCIpICMgbmVlZCB0byBjb21wdXRlIGZvcm0gc2NhbGUgYmVjYXVzZSBvZiBicnVzaGluZ1xuXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgICBtZXJnZWRYID0gdXRpbHMubWVyZ2VTZXJpZXNTb3J0ZWQoeC52YWx1ZShfZGF0YU9sZCksIHgudmFsdWUoZGF0YSkpXG4gICAgICAgIF9sYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBfbGF5b3V0ID0gW11cblxuICAgICAgICBfcGF0aFZhbHVlc05ldyA9IHt9XG5cbiAgICAgICAgZm9yIGtleSBpbiBfbGF5ZXJLZXlzXG4gICAgICAgICAgX3BhdGhWYWx1ZXNOZXdba2V5XSA9IGRhdGEubWFwKChkKS0+IHt4OngubWFwKGQpLHk6eS5zY2FsZSgpKHkubGF5ZXJWYWx1ZShkLCBrZXkpKSwgeHY6eC52YWx1ZShkKSwgeXY6eS5sYXllclZhbHVlKGQsa2V5KSwga2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCBkYXRhOmR9KVxuXG4gICAgICAgICAgbGF5ZXIgPSB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpbXX1cbiAgICAgICAgICAjIGZpbmQgc3RhcnRpbmcgdmFsdWUgZm9yIG9sZFxuICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFgubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRYW2ldWzBdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG9sZExhc3QgPSBfcGF0aFZhbHVlc09sZFtrZXldW21lcmdlZFhbaV1bMF1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIHdoaWxlIGkgPCBtZXJnZWRYLmxlbmd0aFxuICAgICAgICAgICAgaWYgbWVyZ2VkWFtpXVsxXSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICBuZXdMYXN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVttZXJnZWRYW2ldWzFdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICBmb3IgdmFsLCBpIGluIG1lcmdlZFhcbiAgICAgICAgICAgIHYgPSB7Y29sb3I6bGF5ZXIuY29sb3IsIHg6dmFsWzJdfVxuICAgICAgICAgICAgIyBzZXQgeCBhbmQgeSB2YWx1ZXMgZm9yIG9sZCB2YWx1ZXMuIElmIHRoZXJlIGlzIGEgYWRkZWQgdmFsdWUsIG1haW50YWluIHRoZSBsYXN0IHZhbGlkIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiB2YWxbMV0gaXMgdW5kZWZpbmVkICNpZSBhbiBvbGQgdmFsdWUgaXMgZGVsZXRlZCwgbWFpbnRhaW4gdGhlIGxhc3QgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgIHYueU5ldyA9IG5ld0xhc3QueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdMYXN0LnggIyBhbmltYXRlIHRvIHRoZSBwcmVkZXNlc3NvcnMgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IHRydWVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdi55TmV3ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnhcbiAgICAgICAgICAgICAgbmV3TGFzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXVxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiBfZGF0YU9sZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgIGlmICB2YWxbMF0gaXMgdW5kZWZpbmVkICMgaWUgYSBuZXcgdmFsdWUgaGFzIGJlZW4gYWRkZWRcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBvbGRMYXN0LnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRMYXN0LnggIyBzdGFydCB4LWFuaW1hdGlvbiBmcm9tIHRoZSBwcmVkZWNlc3NvcnMgb2xkIHBvc2l0aW9uXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueVxuICAgICAgICAgICAgICAgIHYueE9sZCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS54XG4gICAgICAgICAgICAgICAgb2xkTGFzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2LnhPbGQgPSB2LnhOZXdcbiAgICAgICAgICAgICAgdi55T2xkID0gdi55TmV3XG5cblxuICAgICAgICAgICAgbGF5ZXIudmFsdWUucHVzaCh2KVxuXG4gICAgICAgICAgX2xheW91dC5wdXNoKGxheWVyKVxuXG4gICAgICAgIG9mZnNldCA9IGlmIHguaXNPcmRpbmFsKCkgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIG1hcmtlcnMgPSAobGF5ZXIsIGR1cmF0aW9uKSAtPlxuICAgICAgICAgIGlmIF9zaG93TWFya2Vyc1xuICAgICAgICAgICAgbSA9IGxheWVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpLmRhdGEoXG4gICAgICAgICAgICAgICAgKGwpIC0+IGwudmFsdWVcbiAgICAgICAgICAgICAgLCAoZCkgLT4gZC54XG4gICAgICAgICAgICApXG4gICAgICAgICAgICBtLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LW1hcmtlciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCA1KVxuICAgICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgICAgbVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgLT4gZC55T2xkKVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgLT4gZC54T2xkICsgb2Zmc2V0KVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnd2stY2hhcnQtZGVsZXRlZCcsKGQpIC0+IGQuZGVsZXRlZClcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSAtPiBkLnlOZXcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkKSAtPiBkLnhOZXcgKyBvZmZzZXQpXG4gICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkKSAtPiBpZiBkLmRlbGV0ZWQgdGhlbiAwIGVsc2UgMSlcblxuICAgICAgICAgICAgbS5leGl0KClcbiAgICAgICAgICAgICAgLnJlbW92ZSgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGF5ZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtbWFya2VyJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsIDApLnJlbW92ZSgpXG5cbiAgICAgICAgbWFya2Vyc0JydXNoZWQgPSAobGF5ZXIpIC0+XG4gICAgICAgICAgaWYgX3Nob3dNYXJrZXJzXG4gICAgICAgICAgICBsYXllclxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgLT5cbiAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgeC5zY2FsZSgpKGQueClcbiAgICAgICAgICAgIClcblxuICAgICAgICBsaW5lT2xkID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhPbGQpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU9sZClcblxuICAgICAgICBsaW5lTmV3ID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhOZXcpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU5ldylcblxuICAgICAgICBsaW5lQnJ1c2ggPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55KChkKSAtPiBkLnlOZXcpXG5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIGVudGVyID0gbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgIGVudGVyLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZU5ldyhkLnZhbHVlKSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBfaW5pdGlhbE9wYWNpdHkpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcblxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b2Zmc2V0fSlcIilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lT2xkKGQudmFsdWUpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lTmV3KGQudmFsdWUpKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSkuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXllcnMuY2FsbChtYXJrZXJzLCBvcHRpb25zLmR1cmF0aW9uKVxuXG4gICAgICAgIF9pbml0aWFsT3BhY2l0eSA9IDBcbiAgICAgICAgX2RhdGFPbGQgPSBkYXRhXG4gICAgICAgIF9wYXRoVmFsdWVzT2xkID0gX3BhdGhWYWx1ZXNOZXdcblxuICAgICAgYnJ1c2ggPSAoYXhpcywgaWR4UmFuZ2UpIC0+XG4gICAgICAgIGxpbmVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGluZVwiKVxuICAgICAgICBpZiBheGlzLmlzT3JkaW5hbCgpXG4gICAgICAgICAgbGluZXMuYXR0cignZCcsIChkKSAtPiBsaW5lQnJ1c2goZC52YWx1ZS5zbGljZShpZHhSYW5nZVswXSxpZHhSYW5nZVsxXSArIDEpKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxpbmVzLmF0dHIoJ2QnLCAoZCkgLT4gbGluZUJydXNoKGQudmFsdWUpKVxuICAgICAgICBtYXJrZXJzID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKS5jYWxsKG1hcmtlcnNCcnVzaGVkKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC54KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH0iLCIjIyMqXG4gIEBuZ2RvYyBsYXlvdXRcbiAgQG5hbWUgbGluZVZlcnRpY2FsXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEFcbiAgQGFyZWEgYXBpXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRyYXdzIGEgYXJlYSBjaGFydCBsYXlvdXRcblxuICBAcmVxdWlyZXMgeFxuICBAcmVxdWlyZXMgeVxuICBAcmVxdWlyZXMgY29sb3JcbiAgQHJlcXVpcmVzIGxheW91dFxuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsaW5lVmVydGljYWwnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF9kYXRhT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzTmV3ID0gW11cbiAgICAgIF9wYXRoQXJyYXkgPSBbXVxuICAgICAgbGluZUJydXNoID0gdW5kZWZpbmVkXG4gICAgICBtYXJrZXJzQnJ1c2hlZCA9IHVuZGVmaW5lZFxuICAgICAgYnJ1c2hTdGFydElkeCA9IDBcbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG5cbiAgICAgIHByZXBEYXRhID0gKHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjbGF5ZXJLZXlzID0geS5sYXllcktleXMoQClcbiAgICAgICAgI19sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOkBtYXAoKGQpLT4ge3g6eC52YWx1ZShkKSx5OnkubGF5ZXJWYWx1ZShkLCBrZXkpfSl9KVxuXG4gICAgICB0dEVudGVyID0gKGlkeCkgLT5cbiAgICAgICAgX3BhdGhBcnJheSA9IF8udG9BcnJheShfcGF0aFZhbHVlc05ldylcbiAgICAgICAgdHRNb3ZlRGF0YS5hcHBseSh0aGlzLCBbaWR4XSlcblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIG9mZnMgPSBpZHggKyBicnVzaFN0YXJ0SWR4XG4gICAgICAgIHR0TGF5ZXJzID0gX3BhdGhBcnJheS5tYXAoKGwpIC0+IHtuYW1lOmxbb2Zmc10ua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobFtvZmZzXS54diksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IGxbb2Zmc10uY29sb3J9LCB5djpsW29mZnNdLnl2fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKHR0TGF5ZXJzWzBdLnl2KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIG9mZnMgPSBpZHggKyBicnVzaFN0YXJ0SWR4XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKF9wYXRoQXJyYXksIChkKSAtPiBkW29mZnNdLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGRbb2Zmc10uY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3gnLCAoZCkgLT4gZFtvZmZzXS54KVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcbiAgICAgICAgbyA9IGlmIF9zY2FsZUxpc3QueS5pc09yZGluYWwgdGhlbiBfc2NhbGVMaXN0Lnkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKF9wYXRoQXJyYXlbMF1bb2Zmc10ueXYpICsgb30pXCIpICMgbmVlZCB0byBjb21wdXRlIGZvcm0gc2NhbGUgYmVjYXVzZSBvZiBicnVzaGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbWFya2VycyA9IChsYXllciwgZHVyYXRpb24pIC0+XG4gICAgICAgIGlmIF9zaG93TWFya2Vyc1xuICAgICAgICAgIG0gPSBsYXllci5zZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKS5kYXRhKFxuICAgICAgICAgICAgKGwpIC0+IGwudmFsdWVcbiAgICAgICAgICAsIChkKSAtPiBkLnlcbiAgICAgICAgICApXG4gICAgICAgICAgbS5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1tYXJrZXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgICAuYXR0cigncicsIDUpXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICBtXG4gICAgICAgICAgICAuYXR0cignY3knLCAoZCkgLT4gZC55T2xkICsgb2Zmc2V0KVxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpIC0+IGQueE9sZClcbiAgICAgICAgICAgIC5jbGFzc2VkKCd3ay1jaGFydC1kZWxldGVkJywoZCkgLT4gZC5kZWxldGVkKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSAtPiBkLnlOZXcgKyBvZmZzZXQpXG4gICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgLT4gZC54TmV3KVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQpIC0+IGlmIGQuZGVsZXRlZCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgICAgbS5leGl0KClcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtbWFya2VyJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsIDApLnJlbW92ZSgpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIGlmIHkuaXNPcmRpbmFsKClcbiAgICAgICAgICBtZXJnZWRZID0gdXRpbHMubWVyZ2VTZXJpZXNVbnNvcnRlZCh5LnZhbHVlKF9kYXRhT2xkKSwgeS52YWx1ZShkYXRhKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lcmdlZFkgPSB1dGlscy5tZXJnZVNlcmllc1NvcnRlZCh5LnZhbHVlKF9kYXRhT2xkKSwgeS52YWx1ZShkYXRhKSlcbiAgICAgICAgX2xheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgICBfcGF0aFZhbHVlc05ldyA9IHt9XG5cbiAgICAgICAgI19sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt5OnkudmFsdWUoZCkseDp4LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgICBmb3Iga2V5IGluIF9sYXllcktleXNcbiAgICAgICAgICBfcGF0aFZhbHVlc05ld1trZXldID0gZGF0YS5tYXAoKGQpLT4ge3k6eS5tYXAoZCksIHg6eC5zY2FsZSgpKHgubGF5ZXJWYWx1ZShkLCBrZXkpKSwgeXY6eS52YWx1ZShkKSwgeHY6eC5sYXllclZhbHVlKGQsa2V5KSwga2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCBkYXRhOmR9KVxuXG4gICAgICAgICAgbGF5ZXIgPSB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpbXX1cbiAgICAgICAgICAjIGZpbmQgc3RhcnRpbmcgdmFsdWUgZm9yIG9sZFxuICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFkubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRZW2ldWzBdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVttZXJnZWRZW2ldWzBdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWS5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFlbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3Rmlyc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW21lcmdlZFlbaV1bMV1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIGZvciB2YWwsIGkgaW4gbWVyZ2VkWVxuICAgICAgICAgICAgdiA9IHtjb2xvcjpsYXllci5jb2xvciwgeTp2YWxbMl19XG4gICAgICAgICAgICAjIHNldCB4IGFuZCB5IHZhbHVlcyBmb3Igb2xkIHZhbHVlcy4gSWYgdGhlcmUgaXMgYSBhZGRlZCB2YWx1ZSwgbWFpbnRhaW4gdGhlIGxhc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIHZhbFsxXSBpcyB1bmRlZmluZWQgI2llIGFuIG9sZCB2YWx1ZSBpcyBkZWxldGVkLCBtYWludGFpbiB0aGUgbGFzdCBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi55TmV3ID0gbmV3Rmlyc3QueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdGaXJzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0ZpcnN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIF9kYXRhT2xkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgaWYgIHZhbFswXSBpcyB1bmRlZmluZWQgIyBpZSBhIG5ldyB2YWx1ZSBoYXMgYmVlbiBhZGRlZFxuICAgICAgICAgICAgICAgIHYueU9sZCA9IG9sZEZpcnN0LnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRGaXJzdC54ICMgc3RhcnQgeC1hbmltYXRpb24gZnJvbSB0aGUgcHJlZGVjZXNzb3JzIG9sZCBwb3NpdGlvblxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueFxuICAgICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueE9sZCA9IHYueE5ld1xuICAgICAgICAgICAgICB2LnlPbGQgPSB2LnlOZXdcblxuXG4gICAgICAgICAgICBsYXllci52YWx1ZS5wdXNoKHYpXG5cbiAgICAgICAgICBfbGF5b3V0LnB1c2gobGF5ZXIpXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgbWFya2Vyc0JydXNoZWQgPSAobGF5ZXIpIC0+XG4gICAgICAgICAgaWYgX3Nob3dNYXJrZXJzXG4gICAgICAgICAgICBsYXllclxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpIC0+XG4gICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgeS5zY2FsZSgpKGQueSkgKyBpZiB5LmlzT3JkaW5hbCgpIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcbiAgICAgICAgICAgIClcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBsaW5lT2xkID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhPbGQpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU9sZClcblxuICAgICAgICBsaW5lTmV3ID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhOZXcpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU5ldylcblxuICAgICAgICBsaW5lQnJ1c2ggPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IGQueE5ldylcbiAgICAgICAgICAueSgoZCkgLT4geS5zY2FsZSgpKGQueSkpXG5cblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgZW50ZXIgPSBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgZW50ZXIuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7b2Zmc2V0fSlcIilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lT2xkKGQudmFsdWUpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmVOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXllcnMuY2FsbChtYXJrZXJzLCBvcHRpb25zLmR1cmF0aW9uKVxuXG4gICAgICAgIF9kYXRhT2xkID0gZGF0YVxuICAgICAgICBfcGF0aFZhbHVlc09sZCA9IF9wYXRoVmFsdWVzTmV3XG5cbiAgICAgIGJydXNoID0gKGF4aXMsIGlkeFJhbmdlKSAtPlxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1saW5lXCIpXG4gICAgICAgIGlmIGF4aXMuaXNPcmRpbmFsKClcbiAgICAgICAgICBicnVzaFN0YXJ0SWR4ID0gaWR4UmFuZ2VbMF1cbiAgICAgICAgICBsYXllcnMuYXR0cignZCcsIChkKSAtPiBsaW5lQnJ1c2goZC52YWx1ZS5zbGljZShpZHhSYW5nZVswXSxpZHhSYW5nZVsxXSArIDEpKSlcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7YXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMn0pXCIpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMuYXR0cignZCcsIChkKSAtPiBsaW5lQnJ1c2goZC52YWx1ZSkpXG4gICAgICAgIG1hcmtlcnMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpLmNhbGwobWFya2Vyc0JydXNoZWQpXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LnkpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBicnVzaFxuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfSIsIiMjIypcbiAgQG5nZG9jIGxheW91dFxuICBAbmFtZSBwaWVcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgQVxuICBAYXJlYSBhcGlcbiAgQGRlc2NyaXB0aW9uXG5cbiAgZHJhd3MgYSBhcmVhIGNoYXJ0IGxheW91dFxuXG4gIEByZXF1aXJlcyBzaXplXG4gIEByZXF1aXJlcyBjb2xvclxuICBAcmVxdWlyZXMgbGF5b3V0XG5cblxuIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3BpZScsICgkbG9nLCB1dGlscykgLT5cbiAgcGllQ250ciA9IDBcblxuICByZXR1cm4ge1xuICByZXN0cmljdDogJ0VBJ1xuICByZXF1aXJlOiAnXmxheW91dCdcbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAjIHNldCBjaGFydCBzcGVjaWZpYyBkZWZhdWx0c1xuXG4gICAgX2lkID0gXCJwaWUje3BpZUNudHIrK31cIlxuXG4gICAgaW5uZXIgPSB1bmRlZmluZWRcbiAgICBvdXRlciA9IHVuZGVmaW5lZFxuICAgIGxhYmVscyA9IHVuZGVmaW5lZFxuICAgIHBpZUJveCA9IHVuZGVmaW5lZFxuICAgIHBvbHlsaW5lID0gdW5kZWZpbmVkXG4gICAgX3NjYWxlTGlzdCA9IFtdXG4gICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICBfc2hvd0xhYmVscyA9IGZhbHNlXG5cbiAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC5jb2xvci5heGlzTGFiZWwoKVxuICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC5zaXplLmF4aXNMYWJlbCgpXG4gICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3Quc2l6ZS5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaW5pdGlhbFNob3cgPSB0cnVlXG5cbiAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplKSAtPlxuICAgICAgIyRsb2cuZGVidWcgJ2RyYXdpbmcgcGllIGNoYXJ0IHYyJ1xuXG4gICAgICByID0gTWF0aC5taW4ob3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHQpIC8gMlxuXG4gICAgICBpZiBub3QgcGllQm94XG4gICAgICAgIHBpZUJveD0gQGFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtcGllQm94JylcbiAgICAgIHBpZUJveC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29wdGlvbnMud2lkdGggLyAyfSwje29wdGlvbnMuaGVpZ2h0IC8gMn0pXCIpXG5cbiAgICAgIGlubmVyQXJjID0gZDMuc3ZnLmFyYygpXG4gICAgICAgIC5vdXRlclJhZGl1cyhyICogaWYgX3Nob3dMYWJlbHMgdGhlbiAwLjggZWxzZSAxKVxuICAgICAgICAuaW5uZXJSYWRpdXMoMClcblxuICAgICAgb3V0ZXJBcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgICAgLm91dGVyUmFkaXVzKHIgKiAwLjkpXG4gICAgICAgIC5pbm5lclJhZGl1cyhyICogMC45KVxuXG4gICAgICBrZXkgPSAoZCkgLT4gX3NjYWxlTGlzdC5jb2xvci52YWx1ZShkLmRhdGEpXG5cbiAgICAgIHBpZSA9IGQzLmxheW91dC5waWUoKVxuICAgICAgICAuc29ydChudWxsKVxuICAgICAgICAudmFsdWUoc2l6ZS52YWx1ZSlcblxuICAgICAgYXJjVHdlZW4gPSAoYSkgLT5cbiAgICAgICAgaSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGEpXG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApXG4gICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICBpbm5lckFyYyhpKHQpKVxuXG4gICAgICBzZWdtZW50cyA9IHBpZShkYXRhKSAjIHBpZSBjb21wdXRlcyBmb3IgZWFjaCBzZWdtZW50IHRoZSBzdGFydCBhbmdsZSBhbmQgdGhlIGVuZCBhbmdsZVxuICAgICAgX21lcmdlLmtleShrZXkpXG4gICAgICBfbWVyZ2Uoc2VnbWVudHMpLmZpcnN0KHtzdGFydEFuZ2xlOjAsIGVuZEFuZ2xlOjB9KS5sYXN0KHtzdGFydEFuZ2xlOk1hdGguUEkgKiAyLCBlbmRBbmdsZTogTWF0aC5QSSAqIDJ9KVxuXG4gICAgICAjLS0tIERyYXcgUGllIHNlZ21lbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaWYgbm90IGlubmVyXG4gICAgICAgIGlubmVyID0gcGllQm94LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWlubmVyQXJjJylcblxuICAgICAgaW5uZXIgPSBpbm5lclxuICAgICAgICAuZGF0YShzZWdtZW50cyxrZXkpXG5cbiAgICAgIGlubmVyLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmVhY2goKGQpIC0+IHRoaXMuX2N1cnJlbnQgPSBpZiBpbml0aWFsU2hvdyB0aGVuIGQgZWxzZSB7c3RhcnRBbmdsZTpfbWVyZ2UuYWRkZWRQcmVkKGQpLmVuZEFuZ2xlLCBlbmRBbmdsZTpfbWVyZ2UuYWRkZWRQcmVkKGQpLmVuZEFuZ2xlfSlcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtaW5uZXJBcmMgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiAgY29sb3IubWFwKGQuZGF0YSkpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWxTaG93IHRoZW4gMCBlbHNlIDEpXG4gICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgaW5uZXJcbiAgICAgICAgIy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29wdGlvbnMud2lkdGggLyAyfSwje29wdGlvbnMuaGVpZ2h0IC8gMn0pXCIpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICAgIC5hdHRyVHdlZW4oJ2QnLGFyY1R3ZWVuKVxuXG4gICAgICBpbm5lci5leGl0KCkuZGF0dW0oKGQpIC0+ICB7c3RhcnRBbmdsZTpfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuc3RhcnRBbmdsZSwgZW5kQW5nbGU6X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnN0YXJ0QW5nbGV9KVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHJUd2VlbignZCcsYXJjVHdlZW4pXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICMtLS0gRHJhdyBTZWdtZW50IExhYmVsIFRleHQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBtaWRBbmdsZSA9IChkKSAtPiBkLnN0YXJ0QW5nbGUgKyAoZC5lbmRBbmdsZSAtIGQuc3RhcnRBbmdsZSkgLyAyXG5cbiAgICAgIGlmIF9zaG93TGFiZWxzXG5cbiAgICAgICAgbGFiZWxzID0gcGllQm94LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWRhdGEtbGFiZWwnKS5kYXRhKHNlZ21lbnRzLCBrZXkpXG5cbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtZGF0YS1sYWJlbCcpXG4gICAgICAgICAgLmVhY2goKGQpIC0+IEBfY3VycmVudCA9IGQpXG4gICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi4zNWVtXCIpXG4gICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCcxLjNlbScpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAudGV4dCgoZCkgLT4gc2l6ZS5mb3JtYXR0ZWRWYWx1ZShkLmRhdGEpKVxuXG4gICAgICAgIGxhYmVscy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICAgICAgLmF0dHJUd2VlbigndHJhbnNmb3JtJywgKGQpIC0+XG4gICAgICAgICAgICBfdGhpcyA9IHRoaXNcbiAgICAgICAgICAgIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoX3RoaXMuX2N1cnJlbnQsIGQpXG4gICAgICAgICAgICByZXR1cm4gKHQpIC0+XG4gICAgICAgICAgICAgIGQyID0gaW50ZXJwb2xhdGUodClcbiAgICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnQgPSBkMlxuICAgICAgICAgICAgICBwb3MgPSBvdXRlckFyYy5jZW50cm9pZChkMilcbiAgICAgICAgICAgICAgcG9zWzBdICs9IDE1ICogKGlmIG1pZEFuZ2xlKGQyKSA8IE1hdGguUEkgdGhlbiAgMSBlbHNlIC0xKVxuICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoI3twb3N9KVwiKVxuICAgICAgICAgIC5zdHlsZVR3ZWVuKCd0ZXh0LWFuY2hvcicsIChkKSAtPlxuICAgICAgICAgICAgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZShAX2N1cnJlbnQsIGQpXG4gICAgICAgICAgICByZXR1cm4gKHQpIC0+XG4gICAgICAgICAgICAgIGQyID0gaW50ZXJwb2xhdGUodClcbiAgICAgICAgICAgICAgcmV0dXJuIGlmIG1pZEFuZ2xlKGQyKSA8IE1hdGguUEkgdGhlbiAgXCJzdGFydFwiIGVsc2UgXCJlbmRcIlxuICAgICAgICApXG5cbiAgICAgICAgbGFiZWxzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuc3R5bGUoJ29wYWNpdHknLDApLnJlbW92ZSgpXG5cbiAgICAgICMtLS0gRHJhdyBDb25uZWN0b3IgTGluZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHBvbHlsaW5lID0gcGllQm94LnNlbGVjdEFsbChcIi53ay1jaGFydC1wb2x5bGluZVwiKS5kYXRhKHNlZ21lbnRzLCBrZXkpXG5cbiAgICAgICAgcG9seWxpbmUuZW50ZXIoKVxuICAgICAgICAuIGFwcGVuZChcInBvbHlsaW5lXCIpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtcG9seWxpbmUnKVxuICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMClcbiAgICAgICAgICAuZWFjaCgoZCkgLT4gIHRoaXMuX2N1cnJlbnQgPSBkKVxuXG4gICAgICAgIHBvbHlsaW5lLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgKGQpIC0+IGlmIGQuZGF0YS52YWx1ZSBpcyAwIHRoZW4gIDAgZWxzZSAuNSlcbiAgICAgICAgICAuYXR0clR3ZWVuKFwicG9pbnRzXCIsIChkKSAtPlxuICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHRoaXMuX2N1cnJlbnRcbiAgICAgICAgICAgIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgZClcbiAgICAgICAgICAgIF90aGlzID0gdGhpc1xuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIF90aGlzLl9jdXJyZW50ID0gZDI7XG4gICAgICAgICAgICAgIHBvcyA9IG91dGVyQXJjLmNlbnRyb2lkKGQyKVxuICAgICAgICAgICAgICBwb3NbMF0gKz0gMTAgKiAoaWYgbWlkQW5nbGUoZDIpIDwgTWF0aC5QSSB0aGVuICAxIGVsc2UgLTEpXG4gICAgICAgICAgICAgIHJldHVybiBbaW5uZXJBcmMuY2VudHJvaWQoZDIpLCBvdXRlckFyYy5jZW50cm9pZChkMiksIHBvc107XG4gICAgICAgICAgKVxuXG4gICAgICAgIHBvbHlsaW5lLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApXG4gICAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHBpZUJveC5zZWxlY3RBbGwoJy53ay1jaGFydC1wb2x5bGluZScpLnJlbW92ZSgpXG4gICAgICAgIHBpZUJveC5zZWxlY3RBbGwoJy53ay1jaGFydC1kYXRhLWxhYmVsJykucmVtb3ZlKClcblxuICAgICAgaW5pdGlhbFNob3cgPSBmYWxzZVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSB0aGlzLmdldFNjYWxlcyhbJ3NpemUnLCAnY29sb3InXSlcbiAgICAgIF9zY2FsZUxpc3QuY29sb3Iuc2NhbGVUeXBlKCdjYXRlZ29yeTIwJylcbiAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgX3NlbGVjdGVkID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgX3Nob3dMYWJlbHMgPSBmYWxzZVxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgIF9zaG93TGFiZWxzID0gdHJ1ZVxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuICAjVE9ETyB2ZXJpZnkgYmVoYXZpb3Igd2l0aCBjdXN0b20gdG9vbHRpcHMiLCIjIyMqXG4gIEBuZ2RvYyBsYXlvdXRcbiAgQG5hbWUgc2NhdHRlclxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBBXG4gIEBhcmVhIGFwaVxuICBAZGVzY3JpcHRpb25cblxuICBkcmF3cyBhIGFyZWEgY2hhcnQgbGF5b3V0XG5cbiAgQHJlcXVpcmVzIHhcbiAgQHJlcXVpcmVzIHlcbiAgQHJlcXVpcmVzIGNvbG9yXG4gIEByZXF1aXJlcyBzaXplXG4gIEByZXF1aXJlcyBzaGFwZVxuICBAcmVxdWlyZXMgbGF5b3V0XG5cblxuIyMjXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NjYXR0ZXInLCAoJGxvZywgdXRpbHMpIC0+XG4gIHNjYXR0ZXJDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgICBfaWQgPSAnc2NhdHRlcicgKyBzY2F0dGVyQ250KytcbiAgICAgIF9zY2FsZUxpc3QgPSBbXVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIGZvciBzTmFtZSwgc2NhbGUgb2YgX3NjYWxlTGlzdFxuICAgICAgICAgIEBsYXllcnMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBzY2FsZS5heGlzTGFiZWwoKSxcbiAgICAgICAgICAgIHZhbHVlOiBzY2FsZS5mb3JtYXR0ZWRWYWx1ZShkYXRhKSxcbiAgICAgICAgICAgIGNvbG9yOiBpZiBzTmFtZSBpcyAnY29sb3InIHRoZW4geydiYWNrZ3JvdW5kLWNvbG9yJzpzY2FsZS5tYXAoZGF0YSl9IGVsc2UgdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGF0aDogaWYgc05hbWUgaXMgJ3NoYXBlJyB0aGVuIGQzLnN2Zy5zeW1ib2woKS50eXBlKHNjYWxlLm1hcChkYXRhKSkuc2l6ZSg4MCkoKSBlbHNlIHVuZGVmaW5lZFxuICAgICAgICAgICAgY2xhc3M6IGlmIHNOYW1lIGlzICdzaGFwZScgdGhlbiAnd2stY2hhcnQtdHQtc3ZnLXNoYXBlJyBlbHNlICcnXG4gICAgICAgICAgfSlcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGluaXRpYWxTaG93ID0gdHJ1ZVxuXG5cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG4gICAgICAgICMkbG9nLmRlYnVnICdkcmF3aW5nIHNjYXR0ZXIgY2hhcnQnXG4gICAgICAgIGluaXQgPSAocykgLT5cbiAgICAgICAgICBpZiBpbml0aWFsU2hvd1xuICAgICAgICAgICAgcy5zdHlsZSgnZmlsbCcsIGNvbG9yLm1hcClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCktPiBcInRyYW5zbGF0ZSgje3gubWFwKGQpfSwje3kubWFwKGQpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICAgIGluaXRpYWxTaG93ID0gZmFsc2VcblxuICAgICAgICBwb2ludHMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtcG9pbnRzJylcbiAgICAgICAgICAuZGF0YShkYXRhKVxuICAgICAgICBwb2ludHMuZW50ZXIoKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1wb2ludHMgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+IFwidHJhbnNsYXRlKCN7eC5tYXAoZCl9LCN7eS5tYXAoZCl9KVwiKVxuICAgICAgICAgIC5jYWxsKGluaXQpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgIHBvaW50c1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIGQzLnN2Zy5zeW1ib2woKS50eXBlKChkKSAtPiBzaGFwZS5tYXAoZCkpLnNpemUoKGQpIC0+IHNpemUubWFwKGQpICogc2l6ZS5tYXAoZCkpKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGNvbG9yLm1hcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT4gXCJ0cmFuc2xhdGUoI3t4Lm1hcChkKX0sI3t5Lm1hcChkKX0pXCIpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBwb2ludHMuZXhpdCgpLnJlbW92ZSgpXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZSddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gIH1cblxuI1RPRE8gdmVyaWZ5IGJlaGF2aW9yIHdpdGggY3VzdG9tIHRvb2x0aXBzXG4jVE9ETyBJbXBsZW1lbnQgaW4gbmV3IGRlbW8gYXBwIiwiIyMjKlxuICBAbmdkb2MgbGF5b3V0XG4gIEBuYW1lIHNwaWRlclxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBBXG4gIEBhcmVhIGFwaVxuICBAZGVzY3JpcHRpb25cblxuICBkcmF3cyBhIGFyZWEgY2hhcnQgbGF5b3V0XG5cbiAgQHJlcXVpcmVzIHhcbiAgQHJlcXVpcmVzIHlcbiAgQHJlcXVpcmVzIGNvbG9yXG4gIEByZXF1aXJlcyBsYXlvdXRcblxuXG4jIyNcbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc3BpZGVyJywgKCRsb2csIHV0aWxzKSAtPlxuICBzcGlkZXJDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmRlYnVnICdidWJibGVDaGFydCBsaW5rZWQnXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9pZCA9ICdzcGlkZXInICsgc3BpZGVyQ250cisrXG4gICAgICBheGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgX2RhdGEgPSB1bmRlZmluZWRcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgQGxheWVycyA9IF9kYXRhLm1hcCgoZCkgLT4gIHtuYW1lOl9zY2FsZUxpc3QueC52YWx1ZShkKSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGRbZGF0YV0pLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzpfc2NhbGVMaXN0LmNvbG9yLnNjYWxlKCkoZGF0YSl9fSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgICAkbG9nLmxvZyBkYXRhXG4gICAgICAgICMgY29tcHV0ZSBjZW50ZXIgb2YgYXJlYVxuICAgICAgICBjZW50ZXJYID0gb3B0aW9ucy53aWR0aC8yXG4gICAgICAgIGNlbnRlclkgPSBvcHRpb25zLmhlaWdodC8yXG4gICAgICAgIHJhZGl1cyA9IGQzLm1pbihbY2VudGVyWCwgY2VudGVyWV0pICogMC44XG4gICAgICAgIHRleHRPZmZzID0gMjBcbiAgICAgICAgbmJyQXhpcyA9IGRhdGEubGVuZ3RoXG4gICAgICAgIGFyYyA9IE1hdGguUEkgKiAyIC8gbmJyQXhpc1xuICAgICAgICBkZWdyID0gMzYwIC8gbmJyQXhpc1xuXG4gICAgICAgIGF4aXNHID0gdGhpcy5zZWxlY3QoJy53ay1jaGFydC1heGlzJylcbiAgICAgICAgaWYgYXhpc0cuZW1wdHkoKVxuICAgICAgICAgIGF4aXNHID0gdGhpcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1heGlzJylcblxuICAgICAgICB0aWNrcyA9IHkuc2NhbGUoKS50aWNrcyh5LnRpY2tzKCkpXG4gICAgICAgIHkuc2NhbGUoKS5yYW5nZShbcmFkaXVzLDBdKSAjIHRyaWNrcyB0aGUgd2F5IGF4aXMgYXJlIGRyYXduLiBOb3QgcHJldHR5LCBidXQgd29ya3MgOi0pXG4gICAgICAgIGF4aXMuc2NhbGUoeS5zY2FsZSgpKS5vcmllbnQoJ3JpZ2h0JykudGlja1ZhbHVlcyh0aWNrcykudGlja0Zvcm1hdCh5LnRpY2tGb3JtYXQoKSlcbiAgICAgICAgYXhpc0cuY2FsbChheGlzKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCN7Y2VudGVyWS1yYWRpdXN9KVwiKVxuICAgICAgICB5LnNjYWxlKCkucmFuZ2UoWzAscmFkaXVzXSlcblxuICAgICAgICBsaW5lcyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy1saW5lJykuZGF0YShkYXRhLChkKSAtPiBkLmF4aXMpXG4gICAgICAgIGxpbmVzLmVudGVyKClcbiAgICAgICAgICAuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcy1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdkYXJrZ3JleScpXG5cbiAgICAgICAgbGluZXNcbiAgICAgICAgICAuYXR0cih7eDE6MCwgeTE6MCwgeDI6MCwgeTI6cmFkaXVzfSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCxpKSAtPiBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KXJvdGF0ZSgje2RlZ3IgKiBpfSlcIilcblxuICAgICAgICBsaW5lcy5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICAjZHJhdyB0aWNrIGxpbmVzXG4gICAgICAgIHRpY2tMaW5lID0gZDMuc3ZnLmxpbmUoKS54KChkKSAtPiBkLngpLnkoKGQpLT5kLnkpXG4gICAgICAgIHRpY2tQYXRoID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC10aWNrUGF0aCcpLmRhdGEodGlja3MpXG4gICAgICAgIHRpY2tQYXRoLmVudGVyKCkuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtdGlja1BhdGgnKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsICdub25lJykuc3R5bGUoJ3N0cm9rZScsICdsaWdodGdyZXknKVxuXG4gICAgICAgIHRpY2tQYXRoXG4gICAgICAgICAgLmF0dHIoJ2QnLChkKSAtPlxuICAgICAgICAgICAgcCA9IGRhdGEubWFwKChhLCBpKSAtPiB7eDpNYXRoLnNpbihhcmMqaSkgKiB5LnNjYWxlKCkoZCkseTpNYXRoLmNvcyhhcmMqaSkgKiB5LnNjYWxlKCkoZCl9KVxuICAgICAgICAgICAgdGlja0xpbmUocCkgKyAnWicpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7Y2VudGVyWH0sICN7Y2VudGVyWX0pXCIpXG5cbiAgICAgICAgdGlja1BhdGguZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgYXhpc0xhYmVscyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy10ZXh0JykuZGF0YShkYXRhLChkKSAtPiB4LnZhbHVlKGQpKVxuICAgICAgICBheGlzTGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcy10ZXh0JylcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgICAgIC5hdHRyKCdkeScsICcwLjhlbScpXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgIGF4aXNMYWJlbHNcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIHg6IChkLCBpKSAtPiBjZW50ZXJYICsgTWF0aC5zaW4oYXJjICogaSkgKiAocmFkaXVzICsgdGV4dE9mZnMpXG4gICAgICAgICAgICAgIHk6IChkLCBpKSAtPiBjZW50ZXJZICsgTWF0aC5jb3MoYXJjICogaSkgKiAocmFkaXVzICsgdGV4dE9mZnMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIC50ZXh0KChkKSAtPiB4LnZhbHVlKGQpKVxuXG4gICAgICAgICMgZHJhdyBkYXRhIGxpbmVzXG5cbiAgICAgICAgZGF0YVBhdGggPSBkMy5zdmcubGluZSgpLngoKGQpIC0+IGQueCkueSgoZCkgLT4gZC55KVxuXG4gICAgICAgIGRhdGFMaW5lID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC1kYXRhLWxpbmUnKS5kYXRhKHkubGF5ZXJLZXlzKGRhdGEpKVxuICAgICAgICBkYXRhTGluZS5lbnRlcigpLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWRhdGEtbGluZScpXG4gICAgICAgICAgLnN0eWxlKHtcbiAgICAgICAgICAgIHN0cm9rZTooZCkgLT4gY29sb3Iuc2NhbGUoKShkKVxuICAgICAgICAgICAgZmlsbDooZCkgLT4gY29sb3Iuc2NhbGUoKShkKVxuICAgICAgICAgICAgJ2ZpbGwtb3BhY2l0eSc6IDAuMlxuICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDJcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIGRhdGFMaW5lLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIHAgPSBkYXRhLm1hcCgoYSwgaSkgLT4ge3g6TWF0aC5zaW4oYXJjKmkpICogeS5zY2FsZSgpKGFbZF0pLHk6TWF0aC5jb3MoYXJjKmkpICogeS5zY2FsZSgpKGFbZF0pfSlcbiAgICAgICAgICAgIGRhdGFQYXRoKHApICsgJ1onXG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KVwiKVxuXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgX3NjYWxlTGlzdC55LmRvbWFpbkNhbGMoJ21heCcpXG4gICAgICAgIF9zY2FsZUxpc3QueC5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICAjQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG5cbiAgfVxuXG4jVE9ETyB2ZXJpZnkgYmVoYXZpb3Igd2l0aCBjdXN0b20gdG9vbHRpcHNcbiNUT0RPIGZpeCAndG9vbHRpcCBhdHRyaWJ1dGUgbGlzdCB0b28gbG9uZycgcHJvYmxlbVxuI1RPRE8gYWRkIGVudGVyIC8gZXhpdCBhbmltYXRpb24gYmVoYXZpb3JcbiNUT0RPIEltcGxlbWVudCBkYXRhIGxhYmVsc1xuI1RPRE8gaW1wbGVtZW50IGFuZCB0ZXN0IG9iamVjdCBzZWxlY3Rpb24iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvckJydXNoJywgKCRsb2csICR3aW5kb3csIHNlbGVjdGlvblNoYXJpbmcsIHRpbWluZykgLT5cblxuICBiZWhhdmlvckJydXNoID0gKCkgLT5cblxuICAgIG1lID0gKCkgLT5cblxuICAgIF9hY3RpdmUgPSBmYWxzZVxuICAgIF9vdmVybGF5ID0gdW5kZWZpbmVkXG4gICAgX2V4dGVudCA9IHVuZGVmaW5lZFxuICAgIF9zdGFydFBvcyA9IHVuZGVmaW5lZFxuICAgIF9ldlRhcmdldERhdGEgPSB1bmRlZmluZWRcbiAgICBfYXJlYSA9IHVuZGVmaW5lZFxuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX2FyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICBfYXJlYUJveCA9IHVuZGVmaW5lZFxuICAgIF9iYWNrZ3JvdW5kQm94ID0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9zZWxlY3RhYmxlcyA9ICB1bmRlZmluZWRcbiAgICBfYnJ1c2hHcm91cCA9IHVuZGVmaW5lZFxuICAgIF94ID0gdW5kZWZpbmVkXG4gICAgX3kgPSB1bmRlZmluZWRcbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgIF9icnVzaFhZID0gZmFsc2VcbiAgICBfYnJ1c2hYID0gZmFsc2VcbiAgICBfYnJ1c2hZID0gZmFsc2VcbiAgICBfYm91bmRzSWR4ID0gdW5kZWZpbmVkXG4gICAgX2JvdW5kc1ZhbHVlcyA9IHVuZGVmaW5lZFxuICAgIF9ib3VuZHNEb21haW4gPSB1bmRlZmluZWRcbiAgICBfYnJ1c2hFdmVudHMgPSBkMy5kaXNwYXRjaCgnYnJ1c2hTdGFydCcsICdicnVzaCcsICdicnVzaEVuZCcpXG5cbiAgICBsZWZ0ID0gdG9wID0gcmlnaHQgPSBib3R0b20gPSBzdGFydFRvcCA9IHN0YXJ0TGVmdCA9IHN0YXJ0UmlnaHQgPSBzdGFydEJvdHRvbSA9IHVuZGVmaW5lZFxuXG4gICAgIy0tLSBCcnVzaCB1dGlsaXR5IGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBwb3NpdGlvbkJydXNoRWxlbWVudHMgPSAobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKSAtPlxuICAgICAgd2lkdGggPSByaWdodCAtIGxlZnRcbiAgICAgIGhlaWdodCA9IGJvdHRvbSAtIHRvcFxuXG4gICAgICAjIHBvc2l0aW9uIHJlc2l6ZS1oYW5kbGVzIGludG8gdGhlIHJpZ2h0IGNvcm5lcnNcbiAgICAgIGlmIF9icnVzaFhZXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW4nKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7dG9wfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtcycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3tib3R0b219KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC13JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LCN7dG9wfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LCN7dG9wfSlcIilcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbncnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7dG9wfSlcIilcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtc2UnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje2JvdHRvbX0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXN3JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje2JvdHRvbX0pXCIpXG4gICAgICAgIF9leHRlbnQuYXR0cignd2lkdGgnLCB3aWR0aCkuYXR0cignaGVpZ2h0JywgaGVpZ2h0KS5hdHRyKCd4JywgbGVmdCkuYXR0cigneScsIHRvcClcbiAgICAgIGlmIF9icnVzaFhcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sMClcIikuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1lJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tyaWdodH0sMClcIikuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1lJykuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgX2FyZWFCb3guaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC13Jykuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgX2FyZWFCb3guaGVpZ2h0KVxuICAgICAgICBfZXh0ZW50LmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodCkuYXR0cigneCcsIGxlZnQpLmF0dHIoJ3knLCAwKVxuICAgICAgaWYgX2JydXNoWVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7Ym90dG9tfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbicpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgX2FyZWFCb3gud2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXMnKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKVxuICAgICAgICBfZXh0ZW50LmF0dHIoJ3dpZHRoJywgX2FyZWFCb3gud2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCkuYXR0cigneCcsIDApLmF0dHIoJ3knLCB0b3ApXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZ2V0U2VsZWN0ZWRPYmplY3RzID0gKCkgLT5cbiAgICAgIGVyID0gX2V4dGVudC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIF9zZWxlY3RhYmxlcy5lYWNoKChkKSAtPlxuICAgICAgICAgIGNyID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgIHhIaXQgPSBlci5sZWZ0IDwgY3IucmlnaHQgLSBjci53aWR0aCAvIDMgYW5kIGNyLmxlZnQgKyBjci53aWR0aCAvIDMgPCBlci5yaWdodFxuICAgICAgICAgIHlIaXQgPSBlci50b3AgPCBjci5ib3R0b20gLSBjci5oZWlnaHQgLyAzIGFuZCBjci50b3AgKyBjci5oZWlnaHQgLyAzIDwgZXIuYm90dG9tXG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGVkJywgeUhpdCBhbmQgeEhpdClcbiAgICAgICAgKVxuICAgICAgcmV0dXJuIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0ZWQnKS5kYXRhKClcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBzZXRTZWxlY3Rpb24gPSAobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKSAtPlxuICAgICAgaWYgX2JydXNoWFxuICAgICAgICBfYm91bmRzSWR4ID0gW21lLngoKS5pbnZlcnQobGVmdCksIG1lLngoKS5pbnZlcnQocmlnaHQpXVxuICAgICAgICBpZiBtZS54KCkuaXNPcmRpbmFsKClcbiAgICAgICAgICBfYm91bmRzVmFsdWVzID0gX2RhdGEubWFwKChkKSAtPiBtZS54KCkudmFsdWUoZCkpLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbWUueCgpLmtpbmQoKSBpcyAncmFuZ2VYJ1xuICAgICAgICAgICAgaWYgbWUueCgpLnVwcGVyUHJvcGVydHkoKVxuICAgICAgICAgICAgICBfYm91bmRzVmFsdWVzID0gW21lLngoKS5sb3dlclZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMF1dKSwgbWUueCgpLnVwcGVyVmFsdWUoX2RhdGFbX2JvdW5kc0lkeFsxXV0pXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBzdGVwID0gbWUueCgpLmxvd2VyVmFsdWUoX2RhdGFbMV0pIC0gbWUueCgpLmxvd2VyVmFsdWUoX2RhdGFbMF0pXG4gICAgICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbbWUueCgpLmxvd2VyVmFsdWUoX2RhdGFbX2JvdW5kc0lkeFswXV0pLCBtZS54KCkubG93ZXJWYWx1ZShfZGF0YVtfYm91bmRzSWR4WzFdXSkgKyBzdGVwXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbbWUueCgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMF1dKSwgbWUueCgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMV1dKV1cbiAgICAgICAgX2JvdW5kc0RvbWFpbiA9IF9kYXRhLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgaWYgX2JydXNoWVxuICAgICAgICBfYm91bmRzSWR4ID0gW21lLnkoKS5pbnZlcnQoYm90dG9tKSwgbWUueSgpLmludmVydCh0b3ApXVxuICAgICAgICBpZiBtZS55KCkuaXNPcmRpbmFsKClcbiAgICAgICAgICBfYm91bmRzVmFsdWVzID0gX2RhdGEubWFwKChkKSAtPiBtZS55KCkudmFsdWUoZCkpLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbWUueSgpLmtpbmQoKSBpcyAncmFuZ2VZJ1xuICAgICAgICAgICAgc3RlcCA9IG1lLnkoKS5sb3dlclZhbHVlKF9kYXRhWzFdKSAtIG1lLnkoKS5sb3dlclZhbHVlKF9kYXRhWzBdKVxuICAgICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFttZS55KCkubG93ZXJWYWx1ZShfZGF0YVtfYm91bmRzSWR4WzBdXSksIG1lLnkoKS5sb3dlclZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMV1dKSArIHN0ZXBdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFttZS55KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFswXV0pLCBtZS55KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFsxXV0pXVxuICAgICAgICBfYm91bmRzRG9tYWluID0gX2RhdGEuc2xpY2UoX2JvdW5kc0lkeFswXSwgX2JvdW5kc0lkeFsxXSArIDEpXG4gICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICBfYm91bmRzSWR4ID0gW11cbiAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFtdXG4gICAgICAgIF9ib3VuZHNEb21haW4gPSBnZXRTZWxlY3RlZE9iamVjdHMoKVxuXG4gICAgIy0tLSBCcnVzaFN0YXJ0IEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG5cbiAgICBicnVzaFN0YXJ0ID0gKCkgLT5cbiAgICAgICNyZWdpc3RlciBhIG1vdXNlIGhhbmRsZXJzIGZvciB0aGUgYnJ1c2hcbiAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIF9ldlRhcmdldERhdGEgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5kYXR1bSgpXG4gICAgICBfIGlmIG5vdCBfZXZUYXJnZXREYXRhXG4gICAgICAgIF9ldlRhcmdldERhdGEgPSB7bmFtZTonZm9yd2FyZGVkJ31cbiAgICAgIF9hcmVhQm94ID0gX2FyZWEuZ2V0QkJveCgpXG4gICAgICBfc3RhcnRQb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIHN0YXJ0VG9wID0gdG9wXG4gICAgICBzdGFydExlZnQgPSBsZWZ0XG4gICAgICBzdGFydFJpZ2h0ID0gcmlnaHRcbiAgICAgIHN0YXJ0Qm90dG9tID0gYm90dG9tXG4gICAgICBkMy5zZWxlY3QoX2FyZWEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKS5zZWxlY3RBbGwoXCIud2stY2hhcnQtcmVzaXplXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKVxuICAgICAgZDMuc2VsZWN0KCdib2R5Jykuc3R5bGUoJ2N1cnNvcicsIGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpLnN0eWxlKCdjdXJzb3InKSlcblxuICAgICAgZDMuc2VsZWN0KCR3aW5kb3cpLm9uKCdtb3VzZW1vdmUuYnJ1c2gnLCBicnVzaE1vdmUpLm9uKCdtb3VzZXVwLmJydXNoJywgYnJ1c2hFbmQpXG5cbiAgICAgIF90b29sdGlwLmhpZGUodHJ1ZSlcbiAgICAgIF9ib3VuZHNJZHggPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RhYmxlcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2hTdGFydCgpXG4gICAgICB0aW1pbmcuY2xlYXIoKVxuICAgICAgdGltaW5nLmluaXQoKVxuXG4gICAgIy0tLSBCcnVzaEVuZCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGJydXNoRW5kID0gKCkgLT5cbiAgICAgICNkZS1yZWdpc3RlciBoYW5kbGVyc1xuXG4gICAgICBkMy5zZWxlY3QoJHdpbmRvdykub24gJ21vdXNlbW92ZS5icnVzaCcsIG51bGxcbiAgICAgIGQzLnNlbGVjdCgkd2luZG93KS5vbiAnbW91c2V1cC5icnVzaCcsIG51bGxcbiAgICAgIGQzLnNlbGVjdChfYXJlYSkuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnYWxsJykuc2VsZWN0QWxsKCcud2stY2hhcnQtcmVzaXplJykuc3R5bGUoJ2Rpc3BsYXknLCBudWxsKSAjIHNob3cgdGhlIHJlc2l6ZSBoYW5kbGVyc1xuICAgICAgZDMuc2VsZWN0KCdib2R5Jykuc3R5bGUoJ2N1cnNvcicsIG51bGwpXG4gICAgICBpZiBib3R0b20gLSB0b3AgaXMgMCBvciByaWdodCAtIGxlZnQgaXMgMFxuICAgICAgICAjYnJ1c2ggaXMgZW1wdHlcbiAgICAgICAgZDMuc2VsZWN0KF9hcmVhKS5zZWxlY3RBbGwoJy53ay1jaGFydC1yZXNpemUnKS5zdHlsZSgnZGlzcGxheScsICdub25lJylcbiAgICAgIF90b29sdGlwLmhpZGUoZmFsc2UpXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2hFbmQoX2JvdW5kc0lkeClcbiAgICAgIHRpbWluZy5yZXBvcnQoKVxuXG4gICAgIy0tLSBCcnVzaE1vdmUgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGJydXNoTW92ZSA9ICgpIC0+XG4gICAgICAkbG9nLmluZm8gJ2JydXNobW92ZSdcbiAgICAgIHBvcyA9IGQzLm1vdXNlKF9hcmVhKVxuICAgICAgZGVsdGFYID0gcG9zWzBdIC0gX3N0YXJ0UG9zWzBdXG4gICAgICBkZWx0YVkgPSBwb3NbMV0gLSBfc3RhcnRQb3NbMV1cblxuICAgICAgIyB0aGlzIGVsYWJvcmF0ZSBjb2RlIGlzIG5lZWRlZCB0byBkZWFsIHdpdGggc2NlbmFyaW9zIHdoZW4gbW91c2UgbW92ZXMgZmFzdCBhbmQgdGhlIGV2ZW50cyBkbyBub3QgaGl0IHgveSArIGRlbHRhXG4gICAgICAjIGRvZXMgbm90IGhpIHRoZSAwIHBvaW50IG1heWUgdGhlcmUgaXMgYSBtb3JlIGVsZWdhbnQgd2F5IHRvIHdyaXRlIHRoaXMsIGJ1dCBmb3Igbm93IGl0IHdvcmtzIDotKVxuXG4gICAgICBsZWZ0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0TGVmdCArIGRlbHRhXG4gICAgICAgIGxlZnQgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydFJpZ2h0IHRoZW4gcG9zIGVsc2Ugc3RhcnRSaWdodCkgZWxzZSAwXG4gICAgICAgIHJpZ2h0ID0gaWYgcG9zIDw9IF9hcmVhQm94LndpZHRoIHRoZW4gKGlmIHBvcyA8IHN0YXJ0UmlnaHQgdGhlbiBzdGFydFJpZ2h0IGVsc2UgcG9zKSBlbHNlIF9hcmVhQm94LndpZHRoXG5cbiAgICAgIHJpZ2h0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0UmlnaHQgKyBkZWx0YVxuICAgICAgICBsZWZ0ID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRMZWZ0IHRoZW4gcG9zIGVsc2Ugc3RhcnRMZWZ0KSBlbHNlIDBcbiAgICAgICAgcmlnaHQgPSBpZiBwb3MgPD0gX2FyZWFCb3gud2lkdGggdGhlbiAoaWYgcG9zIDwgc3RhcnRMZWZ0IHRoZW4gc3RhcnRMZWZ0IGVsc2UgcG9zKSBlbHNlIF9hcmVhQm94LndpZHRoXG5cbiAgICAgIHRvcE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydFRvcCArIGRlbHRhXG4gICAgICAgIHRvcCA9IGlmIHBvcyA+PSAwIHRoZW4gKGlmIHBvcyA8IHN0YXJ0Qm90dG9tIHRoZW4gcG9zIGVsc2Ugc3RhcnRCb3R0b20pIGVsc2UgMFxuICAgICAgICBib3R0b20gPSBpZiBwb3MgPD0gX2FyZWFCb3guaGVpZ2h0IHRoZW4gKGlmIHBvcyA+IHN0YXJ0Qm90dG9tIHRoZW4gcG9zIGVsc2Ugc3RhcnRCb3R0b20gKSBlbHNlIF9hcmVhQm94LmhlaWdodFxuXG4gICAgICBib3R0b21NdiA9IChkZWx0YSkgLT5cbiAgICAgICAgcG9zID0gc3RhcnRCb3R0b20gKyBkZWx0YVxuICAgICAgICB0b3AgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydFRvcCB0aGVuIHBvcyBlbHNlIHN0YXJ0VG9wKSBlbHNlIDBcbiAgICAgICAgYm90dG9tID0gaWYgcG9zIDw9IF9hcmVhQm94LmhlaWdodCB0aGVuIChpZiBwb3MgPiBzdGFydFRvcCB0aGVuIHBvcyBlbHNlIHN0YXJ0VG9wICkgZWxzZSBfYXJlYUJveC5oZWlnaHRcblxuICAgICAgaG9yTXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIGlmIHN0YXJ0TGVmdCArIGRlbHRhID49IDBcbiAgICAgICAgICBpZiBzdGFydFJpZ2h0ICsgZGVsdGEgPD0gX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICAgIGxlZnQgPSBzdGFydExlZnQgKyBkZWx0YVxuICAgICAgICAgICAgcmlnaHQgPSBzdGFydFJpZ2h0ICsgZGVsdGFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByaWdodCA9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgICBsZWZ0ID0gX2FyZWFCb3gud2lkdGggLSAoc3RhcnRSaWdodCAtIHN0YXJ0TGVmdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxlZnQgPSAwXG4gICAgICAgICAgcmlnaHQgPSBzdGFydFJpZ2h0IC0gc3RhcnRMZWZ0XG5cbiAgICAgIHZlcnRNdiA9IChkZWx0YSkgLT5cbiAgICAgICAgaWYgc3RhcnRUb3AgKyBkZWx0YSA+PSAwXG4gICAgICAgICAgaWYgc3RhcnRCb3R0b20gKyBkZWx0YSA8PSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgIHRvcCA9IHN0YXJ0VG9wICsgZGVsdGFcbiAgICAgICAgICAgIGJvdHRvbSA9IHN0YXJ0Qm90dG9tICsgZGVsdGFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBib3R0b20gPSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgIHRvcCA9IF9hcmVhQm94LmhlaWdodCAtIChzdGFydEJvdHRvbSAtIHN0YXJ0VG9wKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdG9wID0gMFxuICAgICAgICAgIGJvdHRvbSA9IHN0YXJ0Qm90dG9tIC0gc3RhcnRUb3BcblxuICAgICAgc3dpdGNoIF9ldlRhcmdldERhdGEubmFtZVxuICAgICAgICB3aGVuICdiYWNrZ3JvdW5kJywgJ2ZvcndhcmRlZCdcbiAgICAgICAgICBpZiBkZWx0YVggKyBfc3RhcnRQb3NbMF0gPiAwXG4gICAgICAgICAgICBsZWZ0ID0gaWYgZGVsdGFYIDwgMCB0aGVuIF9zdGFydFBvc1swXSArIGRlbHRhWCBlbHNlIF9zdGFydFBvc1swXVxuICAgICAgICAgICAgaWYgbGVmdCArIE1hdGguYWJzKGRlbHRhWCkgPCBfYXJlYUJveC53aWR0aFxuICAgICAgICAgICAgICByaWdodCA9IGxlZnQgKyBNYXRoLmFicyhkZWx0YVgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJpZ2h0ID0gX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsZWZ0ID0gMFxuXG4gICAgICAgICAgaWYgZGVsdGFZICsgX3N0YXJ0UG9zWzFdID4gMFxuICAgICAgICAgICAgdG9wID0gaWYgZGVsdGFZIDwgMCB0aGVuIF9zdGFydFBvc1sxXSArIGRlbHRhWSBlbHNlIF9zdGFydFBvc1sxXVxuICAgICAgICAgICAgaWYgdG9wICsgTWF0aC5hYnMoZGVsdGFZKSA8IF9hcmVhQm94LmhlaWdodFxuICAgICAgICAgICAgICBib3R0b20gPSB0b3AgKyBNYXRoLmFicyhkZWx0YVkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGJvdHRvbSA9IF9hcmVhQm94LmhlaWdodFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRvcCA9IDBcbiAgICAgICAgd2hlbiAnZXh0ZW50J1xuICAgICAgICAgIHZlcnRNdihkZWx0YVkpOyBob3JNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ24nXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKVxuICAgICAgICB3aGVuICdzJ1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSlcbiAgICAgICAgd2hlbiAndydcbiAgICAgICAgICBsZWZ0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICdlJ1xuICAgICAgICAgIHJpZ2h0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICdudydcbiAgICAgICAgICB0b3BNdihkZWx0YVkpOyBsZWZ0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICduZSdcbiAgICAgICAgICB0b3BNdihkZWx0YVkpOyByaWdodE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnc3cnXG4gICAgICAgICAgYm90dG9tTXYoZGVsdGFZKTsgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnc2UnXG4gICAgICAgICAgYm90dG9tTXYoZGVsdGFZKTsgcmlnaHRNdihkZWx0YVgpXG5cbiAgICAgIHBvc2l0aW9uQnJ1c2hFbGVtZW50cyhsZWZ0LCByaWdodCwgdG9wLCBib3R0b20pXG4gICAgICBzZXRTZWxlY3Rpb24obGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoKF9ib3VuZHNJZHgsIF9ib3VuZHNWYWx1ZXMsIF9ib3VuZHNEb21haW4pXG4gICAgICBzZWxlY3Rpb25TaGFyaW5nLnNldFNlbGVjdGlvbiBfYm91bmRzVmFsdWVzLCBfYm91bmRzSWR4LCBfYnJ1c2hHcm91cFxuXG4gICAgIy0tLSBCcnVzaCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmJydXNoID0gKHMpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX292ZXJsYXlcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9hY3RpdmUgdGhlbiByZXR1cm5cbiAgICAgICAgX292ZXJsYXkgPSBzXG4gICAgICAgIF9icnVzaFhZID0gbWUueCgpIGFuZCBtZS55KClcbiAgICAgICAgX2JydXNoWCA9IG1lLngoKSBhbmQgbm90IG1lLnkoKVxuICAgICAgICBfYnJ1c2hZID0gbWUueSgpIGFuZCBub3QgbWUueCgpXG4gICAgICAgICMgY3JlYXRlIHRoZSBoYW5kbGVyIGVsZW1lbnRzIGFuZCByZWdpc3RlciB0aGUgaGFuZGxlcnNcbiAgICAgICAgcy5zdHlsZSh7J3BvaW50ZXItZXZlbnRzJzogJ2FsbCcsIGN1cnNvcjogJ2Nyb3NzaGFpcid9KVxuICAgICAgICBfZXh0ZW50ID0gcy5hcHBlbmQoJ3JlY3QnKS5hdHRyKHtjbGFzczond2stY2hhcnQtZXh0ZW50JywgeDowLCB5OjAsIHdpZHRoOjAsIGhlaWdodDowfSkuc3R5bGUoJ2N1cnNvcicsJ21vdmUnKS5kYXR1bSh7bmFtZTonZXh0ZW50J30pXG4gICAgICAgICMgcmVzaXplIGhhbmRsZXMgZm9yIHRoZSBzaWRlc1xuICAgICAgICBpZiBfYnJ1c2hZIG9yIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbicpLnN0eWxlKHtjdXJzb3I6J25zLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OjAsIHk6IC0zLCB3aWR0aDowLCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOiduJ30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtcycpLnN0eWxlKHtjdXJzb3I6J25zLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OjAsIHk6IC0zLCB3aWR0aDowLCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidzJ30pXG4gICAgICAgIGlmIF9icnVzaFggb3IgX2JydXNoWFlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC13Jykuc3R5bGUoe2N1cnNvcjonZXctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3k6MCwgeDogLTMsIHdpZHRoOjYsIGhlaWdodDowfSkuZGF0dW0oe25hbWU6J3cnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1lJykuc3R5bGUoe2N1cnNvcjonZXctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3k6MCwgeDogLTMsIHdpZHRoOjYsIGhlaWdodDowfSkuZGF0dW0oe25hbWU6J2UnfSlcbiAgICAgICAgIyByZXNpemUgaGFuZGxlcyBmb3IgdGhlIGNvcm5lcnNcbiAgICAgICAgaWYgX2JydXNoWFlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1udycpLnN0eWxlKHtjdXJzb3I6J253c2UtcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J253J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbmUnKS5zdHlsZSh7Y3Vyc29yOiduZXN3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOiduZSd9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LXN3Jykuc3R5bGUoe2N1cnNvcjonbmVzdy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6IC0zLCB5OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonc3cnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1zZScpLnN0eWxlKHtjdXJzb3I6J253c2UtcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J3NlJ30pXG4gICAgICAgICNyZWdpc3RlciBoYW5kbGVyLiBQbGVhc2Ugbm90ZSwgYnJ1c2ggd2FudHMgdGhlIG1vdXNlIGRvd24gZXhjbHVzaXZlbHkgISEhXG4gICAgICAgIHMub24gJ21vdXNlZG93bi5icnVzaCcsIGJydXNoU3RhcnRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIEV4dGVudCByZXNpemUgaGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcmVzaXplRXh0ZW50ID0gKCkgLT5cbiAgICAgIGlmIF9hcmVhQm94XG4gICAgICAgICRsb2cuaW5mbyAncmVzaXplSGFuZGxlcidcbiAgICAgICAgbmV3Qm94ID0gX2FyZWEuZ2V0QkJveCgpXG4gICAgICAgIGhvcml6b250YWxSYXRpbyA9IF9hcmVhQm94LndpZHRoIC8gbmV3Qm94LndpZHRoXG4gICAgICAgIHZlcnRpY2FsUmF0aW8gPSBfYXJlYUJveC5oZWlnaHQgLyBuZXdCb3guaGVpZ2h0XG4gICAgICAgIHRvcCA9IHRvcCAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgc3RhcnRUb3AgPSBzdGFydFRvcCAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgYm90dG9tID0gYm90dG9tIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBzdGFydEJvdHRvbSA9IHN0YXJ0Qm90dG9tIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBsZWZ0ID0gbGVmdCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBzdGFydExlZnQgPSBzdGFydExlZnQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgcmlnaHQgPSByaWdodCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBzdGFydFJpZ2h0ID0gc3RhcnRSaWdodCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBfc3RhcnRQb3NbMF0gPSBfc3RhcnRQb3NbMF0gLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgX3N0YXJ0UG9zWzFdID0gX3N0YXJ0UG9zWzFdIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBfYXJlYUJveCA9IG5ld0JveFxuICAgICAgICBwb3NpdGlvbkJydXNoRWxlbWVudHMobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuXG4gICAgIy0tLSBCcnVzaCBQcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5jaGFydCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IHZhbFxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gJ3Jlc2l6ZS5icnVzaCcsIHJlc2l6ZUV4dGVudFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYWN0aXZlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYWN0aXZlXG4gICAgICBlbHNlXG4gICAgICAgIF9hY3RpdmUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnggPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF94XG4gICAgICBlbHNlXG4gICAgICAgIF94ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS55ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfeVxuICAgICAgZWxzZVxuICAgICAgICBfeSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXJlYSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FyZWFTZWxlY3Rpb25cbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9hcmVhU2VsZWN0aW9uXG4gICAgICAgICAgX2FyZWFTZWxlY3Rpb24gPSB2YWxcbiAgICAgICAgICBfYXJlYSA9IF9hcmVhU2VsZWN0aW9uLm5vZGUoKVxuICAgICAgICAgICNfYXJlYUJveCA9IF9hcmVhLmdldEJCb3goKSBuZWVkIHRvIGdldCB3aGVuIGNhbGN1bGF0aW5nIHNpemUgdG8gZGVhbCB3aXRoIHJlc2l6aW5nXG4gICAgICAgICAgbWUuYnJ1c2goX2FyZWFTZWxlY3Rpb24pXG5cbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmNvbnRhaW5lciA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gdmFsXG4gICAgICAgIF9zZWxlY3RhYmxlcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5kYXRhID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfZGF0YSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYnJ1c2hHcm91cCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2JydXNoR3JvdXBcbiAgICAgIGVsc2VcbiAgICAgICAgX2JydXNoR3JvdXAgPSB2YWxcbiAgICAgICAgc2VsZWN0aW9uU2hhcmluZy5jcmVhdGVHcm91cChfYnJ1c2hHcm91cClcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnRvb2x0aXAgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90b29sdGlwXG4gICAgICBlbHNlXG4gICAgICAgIF90b29sdGlwID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgIF9icnVzaEV2ZW50cy5vbiBuYW1lLCBjYWxsYmFja1xuXG4gICAgbWUuZXh0ZW50ID0gKCkgLT5cbiAgICAgIHJldHVybiBfYm91bmRzSWR4XG5cbiAgICBtZS5ldmVudHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9icnVzaEV2ZW50c1xuXG4gICAgbWUuZW1wdHkgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9ib3VuZHNJZHggaXMgdW5kZWZpbmVkXG5cbiAgICByZXR1cm4gbWVcbiAgcmV0dXJuIGJlaGF2aW9yQnJ1c2giLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvclNlbGVjdCcsICgkbG9nKSAtPlxuICBzZWxlY3RJZCA9IDBcblxuICBzZWxlY3QgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJzZWxlY3Qje3NlbGVjdElkKyt9XCJcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2FjdGl2ZSA9IGZhbHNlXG4gICAgX3NlbGVjdGlvbkV2ZW50cyA9IGQzLmRpc3BhdGNoKCdzZWxlY3RlZCcpXG5cbiAgICBjbGlja2VkID0gKCkgLT5cbiAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICBvYmogPSBkMy5zZWxlY3QodGhpcylcbiAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICBpZiBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIGlzU2VsZWN0ZWQgPSBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0ZWQnKVxuICAgICAgICBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0ZWQnLCBub3QgaXNTZWxlY3RlZClcbiAgICAgICAgYWxsU2VsZWN0ZWQgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGVkJykuZGF0YSgpLm1hcCgoZCkgLT4gaWYgZC5kYXRhIHRoZW4gZC5kYXRhIGVsc2UgZClcbiAgICAgICAgIyBlbnN1cmUgdGhhdCBvbmx5IHRoZSBvcmlnaW5hbCB2YWx1ZXMgYXJlIHJlcG9ydGVkIGJhY2tcblxuICAgICAgICBfc2VsZWN0aW9uRXZlbnRzLnNlbGVjdGVkKGFsbFNlbGVjdGVkKVxuXG4gICAgbWUgPSAoc2VsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIG1lXG4gICAgICBlbHNlXG4gICAgICAgIHNlbFxuICAgICAgICAgICMgcmVnaXN0ZXIgc2VsZWN0aW9uIGV2ZW50c1xuICAgICAgICAgIC5vbiAnY2xpY2snLCBjbGlja2VkXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuaWQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuYWN0aXZlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYWN0aXZlXG4gICAgICBlbHNlXG4gICAgICAgIF9hY3RpdmUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmNvbnRhaW5lciA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5ldmVudHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zZWxlY3Rpb25FdmVudHNcblxuICAgIG1lLm9uID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgX3NlbGVjdGlvbkV2ZW50cy5vbiBuYW1lLCBjYWxsYmFja1xuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gc2VsZWN0IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JUb29sdGlwJywgKCRsb2csICRkb2N1bWVudCwgJHJvb3RTY29wZSwgJGNvbXBpbGUsICR0ZW1wbGF0ZUNhY2hlLCB0ZW1wbGF0ZURpcikgLT5cblxuICBiZWhhdmlvclRvb2x0aXAgPSAoKSAtPlxuXG4gICAgX2FjdGl2ZSA9IGZhbHNlXG4gICAgX3BhdGggPSAnJ1xuICAgIF9oaWRlID0gZmFsc2VcbiAgICBfc2hvd01hcmtlckxpbmUgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyRyA9IHVuZGVmaW5lZFxuICAgIF9tYXJrZXJMaW5lID0gdW5kZWZpbmVkXG4gICAgX2FyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICBfYXJlYT0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9tYXJrZXJTY2FsZSA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXBEaXNwYXRjaCA9IGQzLmRpc3BhdGNoKCdlbnRlcicsICdtb3ZlRGF0YScsICdtb3ZlTWFya2VyJywgJ2xlYXZlJylcblxuICAgIF90ZW1wbCA9ICR0ZW1wbGF0ZUNhY2hlLmdldCh0ZW1wbGF0ZURpciArICd0b29sVGlwLmh0bWwnKVxuICAgIF90ZW1wbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpXG4gICAgX2NvbXBpbGVkVGVtcGwgPSAkY29tcGlsZShfdGVtcGwpKF90ZW1wbFNjb3BlKVxuICAgIGJvZHkgPSAkZG9jdW1lbnQuZmluZCgnYm9keScpXG5cbiAgICBib2R5UmVjdCA9IGJvZHlbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0gaGVscGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBwb3NpdGlvbkJveCA9ICgpIC0+XG4gICAgICByZWN0ID0gX2NvbXBpbGVkVGVtcGxbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNsaWVudFggPSBpZiBib2R5UmVjdC5yaWdodCAtIDIwID4gZDMuZXZlbnQuY2xpZW50WCArIHJlY3Qud2lkdGggKyAxMCB0aGVuIGQzLmV2ZW50LmNsaWVudFggKyAxMCBlbHNlIGQzLmV2ZW50LmNsaWVudFggLSByZWN0LndpZHRoIC0gMTBcbiAgICAgIGNsaWVudFkgPSBpZiBib2R5UmVjdC5ib3R0b20gLSAyMCA+IGQzLmV2ZW50LmNsaWVudFkgKyByZWN0LmhlaWdodCArIDEwIHRoZW4gZDMuZXZlbnQuY2xpZW50WSArIDEwIGVsc2UgZDMuZXZlbnQuY2xpZW50WSAtIHJlY3QuaGVpZ2h0IC0gMTBcbiAgICAgIF90ZW1wbFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICBsZWZ0OiBjbGllbnRYICsgJ3B4J1xuICAgICAgICB0b3A6IGNsaWVudFkgKyAncHgnXG4gICAgICAgICd6LWluZGV4JzogMTUwMFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9XG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKVxuXG4gICAgcG9zaXRpb25Jbml0aWFsID0gKCkgLT5cbiAgICAgIF90ZW1wbFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICBsZWZ0OiAwICsgJ3B4J1xuICAgICAgICB0b3A6IDAgKyAncHgnXG4gICAgICAgICd6LWluZGV4JzogMTUwMFxuICAgICAgICBvcGFjaXR5OiAwXG4gICAgICB9XG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKSAgIyBlbnN1cmUgdG9vbHRpcCBnZXRzIHJlbmRlcmVkXG4gICAgICAjd2F5aXQgdW50aWwgaXQgaXMgcmVuZGVyZWQgYW5kIHRoZW4gcmVwb3NpdGlvblxuICAgICAgXy50aHJvdHRsZSBwb3NpdGlvbkJveCwgMjAwXG5cbiAgICAjLS0tIFRvb2x0aXBTdGFydCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcEVudGVyID0gKCkgLT5cbiAgICAgIGlmIG5vdCBfYWN0aXZlIG9yIF9oaWRlIHRoZW4gcmV0dXJuXG4gICAgICAjIGFwcGVuZCBkYXRhIGRpdlxuICAgICAgYm9keS5hcHBlbmQoX2NvbXBpbGVkVGVtcGwpXG4gICAgICBfdGVtcGxTY29wZS5sYXllcnMgPSBbXVxuXG4gICAgICAjIGdldCB0b29sdGlwIGRhdGEgdmFsdWVcblxuICAgICAgaWYgX3Nob3dNYXJrZXJMaW5lXG4gICAgICAgIF9wb3MgPSBkMy5tb3VzZSh0aGlzKVxuICAgICAgICB2YWx1ZSA9IF9tYXJrZXJTY2FsZS5pbnZlcnQoaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpIHRoZW4gX3Bvc1swXSBlbHNlIF9wb3NbMV0pXG4gICAgICAgIF90ZW1wbFNjb3BlLnR0RGF0YSA9IG1lLmRhdGEoKVt2YWx1ZV1cbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWUgPSBkMy5zZWxlY3QodGhpcykuZGF0dW0oKVxuICAgICAgICBfdGVtcGxTY29wZS50dERhdGEgPSBpZiB2YWx1ZS5kYXRhIHRoZW4gdmFsdWUuZGF0YSBlbHNlIHZhbHVlXG5cbiAgICAgIF90ZW1wbFNjb3BlLnR0U2hvdyA9IHRydWVcblxuICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5lbnRlci5hcHBseShfdGVtcGxTY29wZSwgW3ZhbHVlXSkgIyBjYWxsIGxheW91dCB0byBmaWxsIGluIGRhdGFcbiAgICAgIHBvc2l0aW9uSW5pdGlhbCgpXG5cbiAgICAgICMgY3JlYXRlIGEgbWFya2VyIGxpbmUgaWYgcmVxdWlyZWRcbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICAjX2FyZWEgPSB0aGlzXG4gICAgICAgIF9hcmVhQm94ID0gX2FyZWFTZWxlY3Rpb24uc2VsZWN0KCcud2stY2hhcnQtYmFja2dyb3VuZCcpLm5vZGUoKS5nZXRCQm94KClcbiAgICAgICAgX3BvcyA9IGQzLm1vdXNlKF9hcmVhKVxuICAgICAgICBfbWFya2VyRyA9IF9jb250YWluZXIuYXBwZW5kKCdnJykgICMgbmVlZCB0byBhcHBlbmQgbWFya2VyIHRvIGNoYXJ0IGFyZWEgdG8gZW5zdXJlIGl0IGlzIG9uIHRvcCBvZiB0aGUgY2hhcnQgZWxlbWVudHMgRml4IDEwXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXRvb2x0aXAtbWFya2VyJylcbiAgICAgICAgX21hcmtlckxpbmUgPSBfbWFya2VyRy5hcHBlbmQoJ2xpbmUnKVxuICAgICAgICBpZiBfbWFya2VyU2NhbGUuaXNIb3Jpem9udGFsKClcbiAgICAgICAgICBfbWFya2VyTGluZS5hdHRyKHtjbGFzczond2stY2hhcnQtbWFya2VyLWxpbmUnLCB4MDowLCB4MTowLCB5MDowLHkxOl9hcmVhQm94LmhlaWdodH0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfbWFya2VyTGluZS5hdHRyKHtjbGFzczond2stY2hhcnQtbWFya2VyLWxpbmUnLCB4MDowLCB4MTpfYXJlYUJveC53aWR0aCwgeTA6MCx5MTowfSlcblxuICAgICAgICBfbWFya2VyTGluZS5zdHlsZSh7c3Ryb2tlOiAnZGFya2dyZXknLCAncG9pbnRlci1ldmVudHMnOiAnbm9uZSd9KVxuXG4gICAgICAgIF90b29sdGlwRGlzcGF0Y2gubW92ZU1hcmtlci5hcHBseShfbWFya2VyRywgW3ZhbHVlXSlcblxuICAgICMtLS0gVG9vbHRpcE1vdmUgIEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICB0b29sdGlwTW92ZSA9ICgpIC0+XG4gICAgICBpZiBub3QgX2FjdGl2ZSBvciBfaGlkZSB0aGVuIHJldHVyblxuICAgICAgX3BvcyA9IGQzLm1vdXNlKF9hcmVhKVxuICAgICAgcG9zaXRpb25Cb3goKVxuICAgICAgaWYgX3Nob3dNYXJrZXJMaW5lXG4gICAgICAgIGRhdGFJZHggPSBfbWFya2VyU2NhbGUuaW52ZXJ0KGlmIF9tYXJrZXJTY2FsZS5pc0hvcml6b250YWwoKSB0aGVuIF9wb3NbMF0gZWxzZSBfcG9zWzFdKVxuICAgICAgICBfdG9vbHRpcERpc3BhdGNoLm1vdmVNYXJrZXIuYXBwbHkoX21hcmtlckcsIFtkYXRhSWR4XSlcbiAgICAgICAgX3RlbXBsU2NvcGUubGF5ZXJzID0gW11cbiAgICAgICAgX3RlbXBsU2NvcGUudHREYXRhID0gbWUuZGF0YSgpW2RhdGFJZHhdXG4gICAgICAgIF90b29sdGlwRGlzcGF0Y2gubW92ZURhdGEuYXBwbHkoX3RlbXBsU2NvcGUsIFtkYXRhSWR4XSlcbiAgICAgIF90ZW1wbFNjb3BlLiRhcHBseSgpXG5cbiAgICAjLS0tIFRvb2x0aXBMZWF2ZSBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcExlYXZlID0gKCkgLT5cbiAgICAgICMkbG9nLmRlYnVnICd0b29sdGlwTGVhdmUnLCBfYXJlYVxuICAgICAgaWYgX21hcmtlckdcbiAgICAgICAgX21hcmtlckcucmVtb3ZlKClcbiAgICAgIF9tYXJrZXJHID0gdW5kZWZpbmVkXG4gICAgICBfdGVtcGxTY29wZS50dFNob3cgPSBmYWxzZVxuICAgICAgX2NvbXBpbGVkVGVtcGwucmVtb3ZlKClcblxuICAgICMtLS0gSW50ZXJmYWNlIHRvIGJydXNoIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBmb3J3YXJkVG9CcnVzaCA9IChlKSAtPlxuICAgICAgIyBmb3J3YXJkIHRoZSBtb3VzZG93biBldmVudCB0byB0aGUgYnJ1c2ggb3ZlcmxheSB0byBlbnN1cmUgdGhhdCBicnVzaGluZyBjYW4gc3RhcnQgYXQgYW55IHBvaW50IGluIHRoZSBkcmF3aW5nIGFyZWFcblxuICAgICAgYnJ1c2hfZWxtID0gZDMuc2VsZWN0KF9jb250YWluZXIubm9kZSgpLnBhcmVudEVsZW1lbnQpLnNlbGVjdChcIi53ay1jaGFydC1vdmVybGF5XCIpLm5vZGUoKTtcbiAgICAgIGlmIGQzLmV2ZW50LnRhcmdldCBpc250IGJydXNoX2VsbSAjZG8gbm90IGRpc3BhdGNoIGlmIHRhcmdldCBpcyBvdmVybGF5XG4gICAgICAgIG5ld19jbGlja19ldmVudCA9IG5ldyBFdmVudCgnbW91c2Vkb3duJyk7XG4gICAgICAgIG5ld19jbGlja19ldmVudC5wYWdlWCA9IGQzLmV2ZW50LnBhZ2VYO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQuY2xpZW50WCA9IGQzLmV2ZW50LmNsaWVudFg7XG4gICAgICAgIG5ld19jbGlja19ldmVudC5wYWdlWSA9IGQzLmV2ZW50LnBhZ2VZO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQuY2xpZW50WSA9IGQzLmV2ZW50LmNsaWVudFk7XG4gICAgICAgIGJydXNoX2VsbS5kaXNwYXRjaEV2ZW50KG5ld19jbGlja19ldmVudCk7XG5cblxuICAgIG1lLmhpZGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9oaWRlXG4gICAgICBlbHNlXG4gICAgICAgIF9oaWRlID0gdmFsXG4gICAgICAgIGlmIF9tYXJrZXJHXG4gICAgICAgICAgX21hcmtlckcuc3R5bGUoJ3Zpc2liaWxpdHknLCBpZiBfaGlkZSB0aGVuICdoaWRkZW4nIGVsc2UgJ3Zpc2libGUnKVxuICAgICAgICBfdGVtcGxTY29wZS50dFNob3cgPSBub3QgX2hpZGVcbiAgICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KClcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuXG4gICAgIy0tIFRvb2x0aXAgcHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50ZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzIGlzIDAgdGhlbiByZXR1cm4gX3BhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhdGggPSBwYXRoXG4gICAgICAgIGlmIF9wYXRoLmxlbmd0aCA+IDBcbiAgICAgICAgICBfY3VzdG9tVGVtcGwgPSAkdGVtcGxhdGVDYWNoZS5nZXQoJ3RlbXBsYXRlcy8nICsgX3BhdGgpXG4gICAgICAgICAgIyB3cmFwIHRlbXBsYXRlIGludG8gcG9zaXRpb25pbmcgZGl2XG4gICAgICAgICAgX2N1c3RvbVRlbXBsV3JhcHBlZCA9IFwiPGRpdiBjbGFzcz1cXFwid2stY2hhcnQtdG9vbHRpcFxcXCIgbmctc2hvdz1cXFwidHRTaG93XFxcIiBuZy1zdHlsZT1cXFwicG9zaXRpb25cXFwiPiN7X2N1c3RvbVRlbXBsfTwvZGl2PlwiXG4gICAgICAgICAgX2NvbXBpbGVkVGVtcGwgPSAkY29tcGlsZShfY3VzdG9tVGVtcGxXcmFwcGVkKShfdGVtcGxTY29wZSlcblxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFyZWEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hcmVhU2VsZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIF9hcmVhU2VsZWN0aW9uID0gdmFsXG4gICAgICAgIF9hcmVhID0gX2FyZWFTZWxlY3Rpb24ubm9kZSgpXG4gICAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICAgIG1lLnRvb2x0aXAoX2FyZWFTZWxlY3Rpb24pXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUubWFya2VyU2NhbGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9tYXJrZXJTY2FsZVxuICAgICAgZWxzZVxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBfc2hvd01hcmtlckxpbmUgPSB0cnVlXG4gICAgICAgICAgX21hcmtlclNjYWxlID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlckxpbmUgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGF0YSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLm9uID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5vbiBuYW1lLCBjYWxsYmFja1xuXG4gICAgIy0tLSBUb29sdGlwIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnRvb2x0aXAgPSAocykgLT4gIyByZWdpc3RlciB0aGUgdG9vbHRpcCBldmVudHMgd2l0aCB0aGUgc2VsZWN0aW9uXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gbWVcbiAgICAgIGVsc2UgICMgc2V0IHRvb2x0aXAgZm9yIGFuIG9iamVjdHMgc2VsZWN0aW9uXG4gICAgICAgIHMub24gJ21vdXNlZW50ZXIudG9vbHRpcCcsIHRvb2x0aXBFbnRlclxuICAgICAgICAgIC5vbiAnbW91c2Vtb3ZlLnRvb2x0aXAnLCB0b29sdGlwTW92ZVxuICAgICAgICAgIC5vbiAnbW91c2VsZWF2ZS50b29sdGlwJywgdG9vbHRpcExlYXZlXG4gICAgICAgIGlmIG5vdCBzLmVtcHR5KCkgYW5kIG5vdCBzLmNsYXNzZWQoJ3drLWNoYXJ0LW92ZXJsYXknKVxuICAgICAgICAgIHMub24gJ21vdXNlZG93bi50b29sdGlwJywgZm9yd2FyZFRvQnJ1c2hcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBiZWhhdmlvclRvb2x0aXAiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvcicsICgkbG9nLCAkd2luZG93LCBiZWhhdmlvclRvb2x0aXAsIGJlaGF2aW9yQnJ1c2gsIGJlaGF2aW9yU2VsZWN0KSAtPlxuXG4gIGJlaGF2aW9yID0gKCkgLT5cblxuICAgIF90b29sdGlwID0gYmVoYXZpb3JUb29sdGlwKClcbiAgICBfYnJ1c2ggPSBiZWhhdmlvckJydXNoKClcbiAgICBfc2VsZWN0aW9uID0gYmVoYXZpb3JTZWxlY3QoKVxuICAgIF9icnVzaC50b29sdGlwKF90b29sdGlwKVxuXG4gICAgYXJlYSA9IChhcmVhKSAtPlxuICAgICAgX2JydXNoLmFyZWEoYXJlYSlcbiAgICAgIF90b29sdGlwLmFyZWEoYXJlYSlcblxuICAgIGNvbnRhaW5lciA9IChjb250YWluZXIpIC0+XG4gICAgICBfYnJ1c2guY29udGFpbmVyKGNvbnRhaW5lcilcbiAgICAgIF9zZWxlY3Rpb24uY29udGFpbmVyKGNvbnRhaW5lcilcbiAgICAgIF90b29sdGlwLmNvbnRhaW5lcihjb250YWluZXIpXG5cbiAgICBjaGFydCA9IChjaGFydCkgLT5cbiAgICAgIF9icnVzaC5jaGFydChjaGFydClcblxuICAgIHJldHVybiB7dG9vbHRpcDpfdG9vbHRpcCwgYnJ1c2g6X2JydXNoLCBzZWxlY3RlZDpfc2VsZWN0aW9uLCBvdmVybGF5OmFyZWEsIGNvbnRhaW5lcjpjb250YWluZXIsIGNoYXJ0OmNoYXJ0fVxuICByZXR1cm4gYmVoYXZpb3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdjaGFydCcsICgkbG9nLCBzY2FsZUxpc3QsIGNvbnRhaW5lciwgYmVoYXZpb3IsIGQzQW5pbWF0aW9uKSAtPlxuXG4gIGNoYXJ0Q250ciA9IDBcblxuICBjaGFydCA9ICgpIC0+XG5cbiAgICBfaWQgPSBcImNoYXJ0I3tjaGFydENudHIrK31cIlxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgIy0tLSBWYXJpYWJsZSBkZWNsYXJhdGlvbnMgYW5kIGRlZmF1bHRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9sYXlvdXRzID0gW10gICAgICAgICAgICAgICAjIExpc3Qgb2YgbGF5b3V0cyBmb3IgdGhlIGNoYXJ0XG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZCAgICAjIHRoZSBjaGFydHMgZHJhd2luZyBjb250YWluZXIgb2JqZWN0XG4gICAgX2FsbFNjYWxlcyA9IHVuZGVmaW5lZCAgICAjIEhvbGRzIGFsbCBzY2FsZXMgb2YgdGhlIGNoYXJ0LCByZWdhcmRsZXNzIG9mIHNjYWxlIG93bmVyXG4gICAgX293bmVkU2NhbGVzID0gdW5kZWZpbmVkICAjIGhvbGRzIHRoZSBzY2xlcyBvd25lZCBieSBjaGFydCwgaS5lLiBzaGFyZSBzY2FsZXNcbiAgICBfZGF0YSA9IHVuZGVmaW5lZCAgICAgICAgICAgIyBwb2ludGVyIHRvIHRoZSBsYXN0IGRhdGEgc2V0IGJvdW5kIHRvIGNoYXJ0XG4gICAgX3Nob3dUb29sdGlwID0gZmFsc2UgICAgICAgICMgdG9vbHRpcCBwcm9wZXJ0eVxuICAgIF90b29sVGlwVGVtcGxhdGUgPSAnJ1xuICAgIF90aXRsZSA9IHVuZGVmaW5lZFxuICAgIF9zdWJUaXRsZSA9IHVuZGVmaW5lZFxuICAgIF9iZWhhdmlvciA9IGJlaGF2aW9yKClcbiAgICBfYW5pbWF0aW9uRHVyYXRpb24gPSBkM0FuaW1hdGlvbi5kdXJhdGlvblxuXG4gICAgIy0tLSBMaWZlQ3ljbGUgRGlzcGF0Y2hlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9saWZlQ3ljbGUgPSBkMy5kaXNwYXRjaCgnY29uZmlndXJlJywgJ3Jlc2l6ZScsICdwcmVwYXJlRGF0YScsICdzY2FsZURvbWFpbnMnLCAnc2l6ZUNvbnRhaW5lcicsICdkcmF3QXhpcycsICdkcmF3Q2hhcnQnLCAnbmV3RGF0YScsICd1cGRhdGUnLCAndXBkYXRlQXR0cnMnLCAnc2NvcGVBcHBseScgKVxuICAgIF9icnVzaCA9IGQzLmRpc3BhdGNoKCdkcmF3JywgJ2NoYW5nZScpXG5cbiAgICAjLS0tIEdldHRlci9TZXR0ZXIgRnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuaWQgPSAoaWQpIC0+XG4gICAgICByZXR1cm4gX2lkXG5cbiAgICBtZS5zaG93VG9vbHRpcCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dUb29sdGlwXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93VG9vbHRpcCA9IHRydWVGYWxzZVxuICAgICAgICBfYmVoYXZpb3IudG9vbHRpcC5hY3RpdmUoX3Nob3dUb29sdGlwKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRvb2xUaXBUZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90b29sVGlwVGVtcGxhdGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3Rvb2xUaXBUZW1wbGF0ZSA9IHBhdGhcbiAgICAgICAgX2JlaGF2aW9yLnRvb2x0aXAudGVtcGxhdGUocGF0aClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50aXRsZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF90aXRsZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnN1YlRpdGxlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc3ViVGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3N1YlRpdGxlID0gdmFsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkTGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0c1xuICAgICAgZWxzZVxuICAgICAgICBfbGF5b3V0cy5wdXNoKGxheW91dClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRTY2FsZSA9IChzY2FsZSwgbGF5b3V0KSAtPlxuICAgICAgX2FsbFNjYWxlcy5hZGQoc2NhbGUpXG4gICAgICBpZiBsYXlvdXRcbiAgICAgICAgbGF5b3V0LnNjYWxlcygpLmFkZChzY2FsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgX293bmVkU2NhbGVzLmFkZChzY2FsZSlcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYW5pbWF0aW9uRHVyYXRpb24gPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hbmltYXRpb25EdXJhdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfYW5pbWF0aW9uRHVyYXRpb24gPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgICMtLS0gR2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5saWZlQ3ljbGUgPSAodmFsKSAtPlxuICAgICAgcmV0dXJuIF9saWZlQ3ljbGVcblxuICAgIG1lLmxheW91dHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9sYXlvdXRzXG5cbiAgICBtZS5zY2FsZXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9vd25lZFNjYWxlc1xuXG4gICAgbWUuYWxsU2NhbGVzID0gKCkgLT5cbiAgICAgIHJldHVybiBfYWxsU2NhbGVzXG5cbiAgICBtZS5oYXNTY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIHJldHVybiAhIV9hbGxTY2FsZXMuaGFzKHNjYWxlKVxuXG4gICAgbWUuY29udGFpbmVyID0gKCkgLT5cbiAgICAgIHJldHVybiBfY29udGFpbmVyXG5cbiAgICBtZS5icnVzaCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JydXNoXG5cbiAgICBtZS5nZXREYXRhID0gKCkgLT5cbiAgICAgIHJldHVybiBfZGF0YVxuXG4gICAgbWUuYmVoYXZpb3IgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9iZWhhdmlvclxuXG4gICAgIy0tLSBDaGFydCBkcmF3aW5nIGxpZmUgY3ljbGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGxpZmVjeWNsZUZ1bGwgPSAoZGF0YSxub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIGRhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyBmdWxsIGxpZmUgY3ljbGUnXG4gICAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgICBfbGlmZUN5Y2xlLnByZXBhcmVEYXRhKGRhdGEsIG5vQW5pbWF0aW9uKSAgICAjIGNhbGxzIHRoZSByZWdpc3RlcmVkIGxheW91dCB0eXBlc1xuICAgICAgICBfbGlmZUN5Y2xlLnNjYWxlRG9tYWlucyhkYXRhLCBub0FuaW1hdGlvbikgICAjIGNhbGxzIHJlZ2lzdGVyZWQgdGhlIHNjYWxlc1xuICAgICAgICBfbGlmZUN5Y2xlLnNpemVDb250YWluZXIoZGF0YSwgbm9BbmltYXRpb24pICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChkYXRhLCBub0FuaW1hdGlvbikgICAgICMgY2FsbHMgbGF5b3V0XG4gICAgICAgIF9saWZlQ3ljbGUuc2NvcGVBcHBseSgpICAgICAgICAgICAgICAgICAgICAgIyBuZWVkIGEgZGlnZXN0IGN5Y2xlIGFmdGVyIHRoZSBkZWJvdWNlIHRvIGVuc3VyZSBsZWdlbmQgYW5pbWF0aW9ucyBleGVjdXRlXG5cbiAgICBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGxpZmVjeWNsZUZ1bGwsIDEwMClcblxuICAgIG1lLmV4ZWNMaWZlQ3ljbGVGdWxsID0gZGVib3VuY2VkXG5cbiAgICBtZS5yZXNpemVMaWZlQ3ljbGUgPSAobm9BbmltYXRpb24pIC0+XG4gICAgICBpZiBfZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIHJlc2l6ZSBsaWZlIGN5Y2xlJ1xuICAgICAgICBfbGlmZUN5Y2xlLnNpemVDb250YWluZXIoX2RhdGEsIG5vQW5pbWF0aW9uKSAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyhub0FuaW1hdGlvbikgICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KF9kYXRhLCBub0FuaW1hdGlvbilcbiAgICAgICAgX2xpZmVDeWNsZS5zY29wZUFwcGx5KClcblxuICAgIG1lLm5ld0RhdGFMaWZlQ3ljbGUgPSAoZGF0YSwgbm9BbmltYXRpb24pIC0+XG4gICAgICBpZiBkYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgbmV3IGRhdGEgbGlmZSBjeWNsZSdcbiAgICAgICAgX2RhdGEgPSBkYXRhXG4gICAgICAgIF9saWZlQ3ljbGUucHJlcGFyZURhdGEoZGF0YSwgbm9BbmltYXRpb24pICAgICMgY2FsbHMgdGhlIHJlZ2lzdGVyZWQgbGF5b3V0IHR5cGVzXG4gICAgICAgIF9saWZlQ3ljbGUuc2NhbGVEb21haW5zKGRhdGEsIG5vQW5pbWF0aW9uKVxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoZGF0YSwgbm9BbmltYXRpb24pXG5cbiAgICBtZS5hdHRyaWJ1dGVDaGFuZ2UgPSAobm9BbmltYXRpb24pIC0+XG4gICAgICBpZiBfZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIGF0dHJpYnV0ZSBjaGFuZ2UgbGlmZSBjeWNsZSdcbiAgICAgICAgX2xpZmVDeWNsZS5zaXplQ29udGFpbmVyKF9kYXRhLCBub0FuaW1hdGlvbilcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyhub0FuaW1hdGlvbikgICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KF9kYXRhLCBub0FuaW1hdGlvbilcblxuICAgIG1lLmJydXNoRXh0ZW50Q2hhbmdlZCA9ICgpIC0+XG4gICAgICBpZiBfZGF0YVxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKHRydWUpICAgICAgICAgICAgICAjIE5vIEFuaW1hdGlvblxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChfZGF0YSwgdHJ1ZSlcblxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICduZXdEYXRhLmNoYXJ0JywgbWUuZXhlY0xpZmVDeWNsZUZ1bGxcbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAncmVzaXplLmNoYXJ0JywgbWUucmVzaXplTGlmZUN5Y2xlXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ3VwZGF0ZS5jaGFydCcsIChub0FuaW1hdGlvbikgLT4gbWUuZXhlY0xpZmVDeWNsZUZ1bGwoX2RhdGEsIG5vQW5pbWF0aW9uKVxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICd1cGRhdGVBdHRycycsIG1lLmF0dHJpYnV0ZUNoYW5nZVxuXG4gICAgIy0tLSBJbml0aWFsaXphdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9iZWhhdmlvci5jaGFydChtZSlcbiAgICBfY29udGFpbmVyID0gY29udGFpbmVyKCkuY2hhcnQobWUpICAgIyB0aGUgY2hhcnRzIGRyYXdpbmcgY29udGFpbmVyIG9iamVjdFxuICAgIF9hbGxTY2FsZXMgPSBzY2FsZUxpc3QoKSAgICAjIEhvbGRzIGFsbCBzY2FsZXMgb2YgdGhlIGNoYXJ0LCByZWdhcmRsZXNzIG9mIHNjYWxlIG93bmVyXG4gICAgX293bmVkU2NhbGVzID0gc2NhbGVMaXN0KCkgICMgaG9sZHMgdGhlIHNjbGVzIG93bmVkIGJ5IGNoYXJ0LCBpLmUuIHNoYXJlIHNjYWxlc1xuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGNoYXJ0IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnY29udGFpbmVyJywgKCRsb2csICR3aW5kb3csIHdrQ2hhcnRNYXJnaW5zLCBzY2FsZUxpc3QsIGF4aXNDb25maWcsIGQzQW5pbWF0aW9uLCBiZWhhdmlvcikgLT5cblxuICBjb250YWluZXJDbnQgPSAwXG5cbiAgY29udGFpbmVyID0gKCkgLT5cblxuICAgIG1lID0gKCktPlxuXG4gICAgIy0tLSBWYXJpYWJsZSBkZWNsYXJhdGlvbnMgYW5kIGRlZmF1bHRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9jb250YWluZXJJZCA9ICdjbnRucicgKyBjb250YWluZXJDbnQrK1xuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9lbGVtZW50ID0gdW5kZWZpbmVkXG4gICAgX2VsZW1lbnRTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICBfbGF5b3V0cyA9IFtdXG4gICAgX2xlZ2VuZHMgPSBbXVxuICAgIF9zdmcgPSB1bmRlZmluZWRcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX3NwYWNlZENvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9jaGFydEFyZWEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnRBcmVhID0gdW5kZWZpbmVkXG4gICAgX21hcmdpbiA9IGFuZ3VsYXIuY29weSh3a0NoYXJ0TWFyZ2lucy5kZWZhdWx0KVxuICAgIF9pbm5lcldpZHRoID0gMFxuICAgIF9pbm5lckhlaWdodCA9IDBcbiAgICBfdGl0bGVIZWlnaHQgPSAwXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfb3ZlcmxheSA9IHVuZGVmaW5lZFxuICAgIF9iZWhhdmlvciA9IHVuZGVmaW5lZFxuICAgIF9kdXJhdGlvbiA9IDBcblxuICAgICMtLS0gR2V0dGVyL1NldHRlciBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5pZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2NvbnRhaW5lcklkXG5cbiAgICBtZS5jaGFydCA9IChjaGFydCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY2hhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgX2NoYXJ0ID0gY2hhcnRcbiAgICAgICAgIyByZWdpc3RlciB0byBsaWZlY3ljbGUgZXZlbnRzXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcInNpemVDb250YWluZXIuI3ttZS5pZCgpfVwiLCBtZS5kcmF3Q2hhcnRGcmFtZVxuICAgICAgICAjX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwiZHJhd0F4aXMuI3ttZS5pZCgpfVwiLCBtZS5kcmF3Q2hhcnRGcmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmVsZW1lbnQgPSAoZWxlbSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZWxlbWVudFxuICAgICAgZWxzZVxuICAgICAgICBfcmVzaXplSGFuZGxlciA9ICgpIC0+ICBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnJlc2l6ZSh0cnVlKSAjIG5vIGFuaW1hdGlvblxuICAgICAgICBfZWxlbWVudCA9IGVsZW1cbiAgICAgICAgX2VsZW1lbnRTZWxlY3Rpb24gPSBkMy5zZWxlY3QoX2VsZW1lbnQpXG4gICAgICAgIGlmIF9lbGVtZW50U2VsZWN0aW9uLmVtcHR5KClcbiAgICAgICAgICAkbG9nLmVycm9yIFwiRXJyb3I6IEVsZW1lbnQgI3tfZWxlbWVudH0gZG9lcyBub3QgZXhpc3RcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2dlbkNoYXJ0RnJhbWUoKVxuICAgICAgICAgICMgZmluZCB0aGUgZGl2IGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBoYW5kbGVyIHRvXG4gICAgICAgICAgcmVzaXplVGFyZ2V0ID0gX2VsZW1lbnRTZWxlY3Rpb24uc2VsZWN0KCcud2stY2hhcnQnKS5ub2RlKClcbiAgICAgICAgICBuZXcgUmVzaXplU2Vuc29yKHJlc2l6ZVRhcmdldCwgX3Jlc2l6ZUhhbmRsZXIpXG5cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRMYXlvdXQgPSAobGF5b3V0KSAtPlxuICAgICAgX2xheW91dHMucHVzaChsYXlvdXQpXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmhlaWdodCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2lubmVySGVpZ2h0XG5cbiAgICBtZS53aWR0aCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2lubmVyV2lkdGhcblxuICAgIG1lLm1hcmdpbnMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9tYXJnaW5cblxuICAgIG1lLmdldENoYXJ0QXJlYSA9ICgpIC0+XG4gICAgICByZXR1cm4gX2NoYXJ0QXJlYVxuXG4gICAgbWUuZ2V0T3ZlcmxheSA9ICgpIC0+XG4gICAgICByZXR1cm4gX292ZXJsYXlcblxuICAgIG1lLmdldENvbnRhaW5lciA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NwYWNlZENvbnRhaW5lclxuXG4gICAgIy0tLSB1dGlsaXR5IGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBSZXR1cm46IHRleHQgaGVpZ2h0XG4gICAgZHJhd0FuZFBvc2l0aW9uVGV4dCA9IChjb250YWluZXIsIHRleHQsIHNlbGVjdG9yLCBmb250U2l6ZSwgb2Zmc2V0KSAtPlxuICAgICAgZWxlbSA9IGNvbnRhaW5lci5zZWxlY3QoJy4nICsgc2VsZWN0b3IpXG4gICAgICBpZiBlbGVtLmVtcHR5KClcbiAgICAgICAgZWxlbSA9IGNvbnRhaW5lci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKHtjbGFzczpzZWxlY3RvciwgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsIHk6aWYgb2Zmc2V0IHRoZW4gb2Zmc2V0IGVsc2UgMH0pXG4gICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLGZvbnRTaXplKVxuICAgICAgZWxlbS50ZXh0KHRleHQpXG4gICAgICAjbWVhc3VyZSBzaXplIGFuZCByZXR1cm4gaXRcbiAgICAgIHJldHVybiBlbGVtLm5vZGUoKS5nZXRCQm94KCkuaGVpZ2h0XG5cblxuICAgIGRyYXdUaXRsZUFyZWEgPSAodGl0bGUsIHN1YlRpdGxlKSAtPlxuICAgICAgdGl0bGVBcmVhSGVpZ2h0ID0gMFxuICAgICAgYXJlYSA9IF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtdGl0bGUtYXJlYScpXG4gICAgICBpZiBhcmVhLmVtcHR5KClcbiAgICAgICAgYXJlYSA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC10aXRsZS1hcmVhIHdrLWNlbnRlci1ob3InKVxuICAgICAgaWYgdGl0bGVcbiAgICAgICAgX3RpdGxlSGVpZ2h0ID0gZHJhd0FuZFBvc2l0aW9uVGV4dChhcmVhLCB0aXRsZSwgJ3drLWNoYXJ0LXRpdGxlJywgJzJlbScpXG4gICAgICBpZiBzdWJUaXRsZVxuICAgICAgICBkcmF3QW5kUG9zaXRpb25UZXh0KGFyZWEsIHN1YlRpdGxlLCAnd2stY2hhcnQtc3VidGl0bGUnLCAnMS44ZW0nLCBfdGl0bGVIZWlnaHQpXG5cbiAgICAgIHJldHVybiBhcmVhLm5vZGUoKS5nZXRCQm94KCkuaGVpZ2h0XG5cbiAgICBtZWFzdXJlVGV4dCA9ICh0ZXh0TGlzdCwgY29udGFpbmVyLCB0ZXh0Q2xhc3NlcykgLT5cbiAgICAgIG1lYXN1cmVDb250YWluZXIgPSBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIGZvciB0IGluIHRleHRMaXN0XG4gICAgICAgIG1lYXN1cmVDb250YWluZXIuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnOnRleHRDbGFzc2VzKS50ZXh0KHQpXG5cbiAgICAgIGJvdW5kcyA9IG1lYXN1cmVDb250YWluZXIubm9kZSgpLmdldEJCb3goKVxuICAgICAgbWVhc3VyZUNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgcmV0dXJuIGJvdW5kc1xuXG4gICAgZ2V0QXhpc1JlY3QgPSAoZGltKSAtPlxuICAgICAgYXhpcyA9IF9jb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIGRpbS5yYW5nZShbMCw1MDBdKVxuICAgICAgYXhpcy5jYWxsKGRpbS5heGlzKCkpXG5cbiAgICAgIGlmIGRpbS5yb3RhdGVUaWNrTGFiZWxzKClcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKHtkeTonMC4zNWVtJ30pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLFwicm90YXRlKCN7ZGltLnJvdGF0ZVRpY2tMYWJlbHMoKX0sIDAsICN7aWYgZGltLmF4aXNPcmllbnQoKSBpcyAnYm90dG9tJyB0aGVuIDEwIGVsc2UgLTEwfSlcIilcbiAgICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsIGlmIGRpbS5heGlzT3JpZW50KCkgaXMgJ2JvdHRvbScgdGhlbiAnZW5kJyBlbHNlICdzdGFydCcpXG5cbiAgICAgIGJveCA9IGF4aXMubm9kZSgpLmdldEJCb3goKVxuICAgICAgYXhpcy5yZW1vdmUoKVxuICAgICAgcmV0dXJuIGJveFxuXG4gICAgZHJhd0F4aXMgPSAoZGltKSAtPlxuICAgICAgYXhpcyA9IF9jb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtI3tkaW0uYXhpc09yaWVudCgpfVwiKVxuICAgICAgaWYgYXhpcy5lbXB0eSgpXG4gICAgICAgIGF4aXMgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWF4aXMgd2stY2hhcnQtJyArIGRpbS5heGlzT3JpZW50KCkpXG5cbiAgICAgIGF4aXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKF9kdXJhdGlvbikuY2FsbChkaW0uYXhpcygpKVxuXG4gICAgICBpZiBkaW0ucm90YXRlVGlja0xhYmVscygpXG4gICAgICAgIGF4aXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LSN7ZGltLmF4aXNPcmllbnQoKX0ud2stY2hhcnQtYXhpcyB0ZXh0XCIpXG4gICAgICAgICAgLmF0dHIoe2R5OicwLjM1ZW0nfSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJyxcInJvdGF0ZSgje2RpbS5yb3RhdGVUaWNrTGFiZWxzKCl9LCAwLCAje2lmIGRpbS5heGlzT3JpZW50KCkgaXMgJ2JvdHRvbScgdGhlbiAxMCBlbHNlIC0xMH0pXCIpXG4gICAgICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsIGlmIGRpbS5heGlzT3JpZW50KCkgaXMgJ2JvdHRvbScgdGhlbiAnZW5kJyBlbHNlICdzdGFydCcpXG4gICAgICBlbHNlXG4gICAgICAgIGF4aXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LSN7ZGltLmF4aXNPcmllbnQoKX0ud2stY2hhcnQtYXhpcyB0ZXh0XCIpLmF0dHIoJ3RyYW5zZm9ybScsIG51bGwpXG5cbiAgICBfcmVtb3ZlQXhpcyA9IChvcmllbnQpIC0+XG4gICAgICBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7b3JpZW50fVwiKS5yZW1vdmUoKVxuXG4gICAgX3JlbW92ZUxhYmVsID0gKG9yaWVudCkgLT5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LSN7b3JpZW50fVwiKS5yZW1vdmUoKVxuXG4gICAgZHJhd0dyaWQgPSAocywgbm9BbmltYXRpb24pIC0+XG4gICAgICBkdXJhdGlvbiA9IGlmIG5vQW5pbWF0aW9uIHRoZW4gMCBlbHNlIF9kdXJhdGlvblxuICAgICAga2luZCA9IHMua2luZCgpXG4gICAgICB0aWNrcyA9IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBzLnNjYWxlKCkucmFuZ2UoKSBlbHNlIHMuc2NhbGUoKS50aWNrcygpXG4gICAgICBvZmZzZXQgPSBpZiBzLmlzT3JkaW5hbCgpIHRoZW4gcy5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcbiAgICAgIGdyaWRMaW5lcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWdyaWQud2stY2hhcnQtI3traW5kfVwiKS5kYXRhKHRpY2tzLCAoZCkgLT4gZClcbiAgICAgIGdyaWRMaW5lcy5lbnRlcigpLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1ncmlkIHdrLWNoYXJ0LSN7a2luZH1cIilcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuICAgICAgaWYga2luZCBpcyAneSdcbiAgICAgICAgZ3JpZExpbmVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICB4MTowLFxuICAgICAgICAgICAgeDI6IF9pbm5lcldpZHRoLFxuICAgICAgICAgICAgeTE6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkICsgb2Zmc2V0IGVsc2Ugcy5zY2FsZSgpKGQpLFxuICAgICAgICAgICAgeTI6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkICsgb2Zmc2V0IGVsc2Ugcy5zY2FsZSgpKGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICBlbHNlXG4gICAgICAgIGdyaWRMaW5lcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgeTE6MCxcbiAgICAgICAgICAgIHkyOiBfaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICB4MTooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgKyBvZmZzZXQgZWxzZSBzLnNjYWxlKCkoZCksXG4gICAgICAgICAgICB4MjooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgKyBvZmZzZXQgZWxzZSBzLnNjYWxlKCkoZClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgIGdyaWRMaW5lcy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICMtLS0gQnVpbGQgdGhlIGNvbnRhaW5lciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBidWlsZCBnZW5lcmljIGVsZW1lbnRzIGZpcnN0XG5cbiAgICBfZ2VuQ2hhcnRGcmFtZSA9ICgpIC0+XG4gICAgICBfc3ZnID0gX2VsZW1lbnRTZWxlY3Rpb24uYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydCcpLmFwcGVuZCgnc3ZnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQnKVxuICAgICAgX3N2Zy5hcHBlbmQoJ2RlZnMnKS5hcHBlbmQoJ2NsaXBQYXRoJykuYXR0cignaWQnLCBcIndrLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9XCIpLmFwcGVuZCgncmVjdCcpXG4gICAgICBfY29udGFpbmVyPSBfc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtY29udGFpbmVyJylcbiAgICAgIF9vdmVybGF5ID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ2FsbCcpXG4gICAgICBfb3ZlcmxheS5hcHBlbmQoJ3JlY3QnKS5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYWNrZ3JvdW5kJykuZGF0dW0oe25hbWU6J2JhY2tncm91bmQnfSlcbiAgICAgIF9jaGFydEFyZWEgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuXG4gICAgIyBzdGFydCB0byBidWlsZCBhbmQgc2l6ZSB0aGUgZWxlbWVudHMgZnJvbSB0b3AgdG8gYm90dG9tXG5cbiAgICAjLS0tIGNoYXJ0IGZyYW1lICh0aXRsZSwgYXhpcywgZ3JpZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd0NoYXJ0RnJhbWUgPSAoZGF0YSwgbm90QW5pbWF0ZWQpIC0+XG4gICAgICBib3VuZHMgPSBfZWxlbWVudFNlbGVjdGlvbi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIF9kdXJhdGlvbiA9IGlmIG5vdEFuaW1hdGVkIHRoZW4gMCBlbHNlIG1lLmNoYXJ0KCkuYW5pbWF0aW9uRHVyYXRpb24oKVxuICAgICAgX2hlaWdodCA9IGJvdW5kcy5oZWlnaHRcbiAgICAgIF93aWR0aCA9IGJvdW5kcy53aWR0aFxuICAgICAgdGl0bGVBcmVhSGVpZ2h0ID0gZHJhd1RpdGxlQXJlYShfY2hhcnQudGl0bGUoKSwgX2NoYXJ0LnN1YlRpdGxlKCkpXG5cbiAgICAgICMtLS0gZ2V0IHNpemluZyBvZiBmcmFtZSBjb21wb25lbnRzIGJlZm9yZSBwb3NpdGlvbmluZyB0aGVtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXhpc1JlY3QgPSB7dG9wOntoZWlnaHQ6MCwgd2lkdGg6MH0sYm90dG9tOntoZWlnaHQ6MCwgd2lkdGg6MH0sbGVmdDp7aGVpZ2h0OjAsIHdpZHRoOjB9LHJpZ2h0OntoZWlnaHQ6MCwgd2lkdGg6MH19XG4gICAgICBsYWJlbEhlaWdodCA9IHt0b3A6MCAsYm90dG9tOjAsIGxlZnQ6MCwgcmlnaHQ6MH1cbiAgICAgIGRhdGFMYWJlbFJlY3QgPSB7d2lkdGg6MCwgaGVpZ2h0OjB9XG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGRhdGFMYWJlbEhlaWdodCA9IGRhdGFMYWJlbFdpZHRoID0gMFxuXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKVxuICAgICAgICAgICAgcy5heGlzKCkuc2NhbGUocy5zY2FsZSgpKS5vcmllbnQocy5heGlzT3JpZW50KCkpICAjIGVuc3VyZSB0aGUgYXhpcyB3b3JrcyBvbiB0aGUgcmlnaHQgc2NhbGVcbiAgICAgICAgICAgIGF4aXMgPSBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7cy5heGlzT3JpZW50KCl9XCIpXG4gICAgICAgICAgICBheGlzUmVjdFtzLmF4aXNPcmllbnQoKV0gPSBnZXRBeGlzUmVjdChzKVxuICAgICAgICAgICAgIy0tLSBkcmF3IGxhYmVsIC0tLVxuICAgICAgICAgICAgbGFiZWwgPSBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1sYWJlbC53ay1jaGFydC0je3MuYXhpc09yaWVudCgpfVwiKVxuICAgICAgICAgICAgaWYgcy5zaG93TGFiZWwoKVxuICAgICAgICAgICAgICBpZiBsYWJlbC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgbGFiZWwgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWxhYmVsIHdrLWNoYXJ0LScgICsgcy5heGlzT3JpZW50KCkpXG4gICAgICAgICAgICAgIGxhYmVsSGVpZ2h0W3MuYXhpc09yaWVudCgpXSA9IGRyYXdBbmRQb3NpdGlvblRleHQobGFiZWwsIHMuYXhpc0xhYmVsKCksICd3ay1jaGFydC1sYWJlbC10ZXh0JywgJzEuNWVtJyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGxhYmVsLnJlbW92ZSgpXG4gICAgICAgICAgaWYgcy5heGlzT3JpZW50T2xkKCkgYW5kIHMuYXhpc09yaWVudE9sZCgpIGlzbnQgcy5heGlzT3JpZW50KClcbiAgICAgICAgICAgIF9yZW1vdmVBeGlzKHMuYXhpc09yaWVudE9sZCgpKVxuICAgICAgICAgICAgX3JlbW92ZUxhYmVsKHMuYXhpc09yaWVudE9sZCgpKVxuXG4gICAgICAgICAgIyBjYWxjdWxhdGUgc3BhY2UgcmVxdWlyZWQgZm9yIGRhdGEgbGFiZWxzXG5cblxuXG4gICAgICAgICAgaWYgbC5zaG93RGF0YUxhYmVscygpIGlzIGtcbiAgICAgICAgICAgIGlmIHMuaXNIb3Jpem9udGFsKClcbiAgICAgICAgICAgICAgZGF0YUxhYmVsV2lkdGggPSB3a0NoYXJ0TWFyZ2lucy5kYXRhTGFiZWxQYWRkaW5nLmhvciArIG1lYXN1cmVUZXh0KHMuZm9ybWF0dGVkVmFsdWUoZGF0YSksIF9jb250YWluZXIsICd3ay1jaGFydC1kYXRhLWxhYmVsJykud2lkdGhcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZGF0YUxhYmVsSGVpZ2h0ID0gd2tDaGFydE1hcmdpbnMuZGF0YUxhYmVsUGFkZGluZy52ZXJ0ICsgbWVhc3VyZVRleHQocy5mb3JtYXR0ZWRWYWx1ZShkYXRhKSwgX2NvbnRhaW5lciwgJ3drLWNoYXJ0LWRhdGEtbGFiZWwnKS5oZWlnaHRcblxuICAgICAgIy0tLSBjb21wdXRlIHNpemUgb2YgdGhlIGRyYXdpbmcgYXJlYSAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZnJhbWVIZWlnaHQgPSB0aXRsZUFyZWFIZWlnaHQgKyBheGlzUmVjdC50b3AuaGVpZ2h0ICsgbGFiZWxIZWlnaHQudG9wICsgYXhpc1JlY3QuYm90dG9tLmhlaWdodCArIGxhYmVsSGVpZ2h0LmJvdHRvbSArIF9tYXJnaW4udG9wICsgX21hcmdpbi5ib3R0b21cblxuICAgICAgX2ZyYW1lV2lkdGggPSBheGlzUmVjdC5yaWdodC53aWR0aCArIGxhYmVsSGVpZ2h0LnJpZ2h0ICsgYXhpc1JlY3QubGVmdC53aWR0aCArIGxhYmVsSGVpZ2h0LmxlZnQgKyBfbWFyZ2luLmxlZnQgKyBfbWFyZ2luLnJpZ2h0XG5cbiAgICAgIGlmIF9mcmFtZUhlaWdodCA8IF9oZWlnaHRcbiAgICAgICAgX2lubmVySGVpZ2h0ID0gX2hlaWdodCAtIF9mcmFtZUhlaWdodFxuICAgICAgZWxzZVxuICAgICAgICBfaW5uZXJIZWlnaHQgPSAwXG5cbiAgICAgIGlmIF9mcmFtZVdpZHRoIDwgX3dpZHRoXG4gICAgICAgIF9pbm5lcldpZHRoID0gX3dpZHRoIC0gX2ZyYW1lV2lkdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX2lubmVyV2lkdGggPSAwXG5cbiAgICAgICMtLS0gcmVzZXQgc2NhbGUgcmFuZ2VzIGFuZCByZWRyYXcgYXhpcyB3aXRoIGFkanVzdGVkIHJhbmdlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBmb3IgbCBpbiBfbGF5b3V0c1xuICAgICAgICBmb3IgaywgcyBvZiBsLnNjYWxlcygpLmFsbEtpbmRzKClcbiAgICAgICAgICBpZiBrIGlzICd4JyBvciBrIGlzICdyYW5nZVgnXG4gICAgICAgICAgICBpZiBsLnNob3dEYXRhTGFiZWxzKCkgaXMgJ3gnXG4gICAgICAgICAgICAgIHMucmFuZ2UoWzAsIF9pbm5lcldpZHRoIC0gZGF0YUxhYmVsV2lkdGhdKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBzLnJhbmdlKFswLCBfaW5uZXJXaWR0aF0pXG4gICAgICAgICAgZWxzZSBpZiBrIGlzICd5JyBvciBrIGlzICdyYW5nZVknXG4gICAgICAgICAgICBpZiBsLnNob3dEYXRhTGFiZWxzKCkgaXMgJ3knXG4gICAgICAgICAgICAgIHMucmFuZ2UoW19pbm5lckhlaWdodCwgZGF0YUxhYmVsSGVpZ2h0XSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcy5yYW5nZShbX2lubmVySGVpZ2h0LCAwXSlcbiAgICAgICAgICBpZiBzLnNob3dBeGlzKClcbiAgICAgICAgICAgIGRyYXdBeGlzKHMpXG5cbiAgICAgICMtLS0gcG9zaXRpb24gZnJhbWUgZWxlbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsZWZ0TWFyZ2luID0gYXhpc1JlY3QubGVmdC53aWR0aCArIGxhYmVsSGVpZ2h0LmxlZnQgKyBfbWFyZ2luLmxlZnRcbiAgICAgIHRvcE1hcmdpbiA9IHRpdGxlQXJlYUhlaWdodCArIGF4aXNSZWN0LnRvcC5oZWlnaHQgICsgbGFiZWxIZWlnaHQudG9wICsgX21hcmdpbi50b3BcblxuICAgICAgX3NwYWNlZENvbnRhaW5lciA9IF9jb250YWluZXIuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0TWFyZ2lufSwgI3t0b3BNYXJnaW59KVwiKVxuICAgICAgX3N2Zy5zZWxlY3QoXCIjd2stY2hhcnQtY2xpcC0je19jb250YWluZXJJZH0gcmVjdFwiKS5hdHRyKCd3aWR0aCcsIF9pbm5lcldpZHRoKS5hdHRyKCdoZWlnaHQnLCBfaW5uZXJIZWlnaHQpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LW92ZXJsYXk+LndrLWNoYXJ0LWJhY2tncm91bmQnKS5hdHRyKCd3aWR0aCcsIF9pbm5lcldpZHRoKS5hdHRyKCdoZWlnaHQnLCBfaW5uZXJIZWlnaHQpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWFyZWEnKS5zdHlsZSgnY2xpcC1wYXRoJywgXCJ1cmwoI3drLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9KVwiKVxuICAgICAgX3NwYWNlZENvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ2NsaXAtcGF0aCcsIFwidXJsKCN3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfSlcIilcblxuICAgICAgX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1heGlzLndrLWNoYXJ0LXJpZ2h0JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aH0sIDApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtYm90dG9tJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwgI3tfaW5uZXJIZWlnaHR9KVwiKVxuXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LWxlZnQnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgjey1heGlzUmVjdC5sZWZ0LndpZHRoLWxhYmVsSGVpZ2h0LmxlZnQgLyAyIH0sICN7X2lubmVySGVpZ2h0LzJ9KSByb3RhdGUoLTkwKVwiKVxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1sYWJlbC53ay1jaGFydC1yaWdodCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGgrYXhpc1JlY3QucmlnaHQud2lkdGggKyBsYWJlbEhlaWdodC5yaWdodCAvIDJ9LCAje19pbm5lckhlaWdodC8yfSkgcm90YXRlKDkwKVwiKVxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1sYWJlbC53ay1jaGFydC10b3AnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19pbm5lcldpZHRoIC8gMn0sICN7LWF4aXNSZWN0LnRvcC5oZWlnaHQgLSBsYWJlbEhlaWdodC50b3AgLyAyIH0pXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LWJvdHRvbScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGggLyAyfSwgI3tfaW5uZXJIZWlnaHQgKyBheGlzUmVjdC5ib3R0b20uaGVpZ2h0ICsgbGFiZWxIZWlnaHQuYm90dG9tIH0pXCIpXG5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtdGl0bGUtYXJlYScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGgvMn0sICN7LXRvcE1hcmdpbiArIF90aXRsZUhlaWdodH0pXCIpXG5cbiAgICAgICMtLS0gZmluYWxseSwgZHJhdyBncmlkIGxpbmVzXG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKSBhbmQgcy5zaG93R3JpZCgpXG4gICAgICAgICAgICBkcmF3R3JpZChzKVxuXG4gICAgICBfY2hhcnQuYmVoYXZpb3IoKS5vdmVybGF5KF9vdmVybGF5KVxuICAgICAgX2NoYXJ0LmJlaGF2aW9yKCkuY29udGFpbmVyKF9jaGFydEFyZWEpXG5cbiAgICAjLS0tIEJydXNoIEFjY2VsZXJhdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd1NpbmdsZUF4aXMgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBzY2FsZS5zaG93QXhpcygpXG4gICAgICAgIGEgPSBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7c2NhbGUuYXhpcygpLm9yaWVudCgpfVwiKVxuICAgICAgICBhLmNhbGwoc2NhbGUuYXhpcygpKVxuXG4gICAgICAgIGlmIHNjYWxlLnNob3dHcmlkKClcbiAgICAgICAgICBkcmF3R3JpZChzY2FsZSwgdHJ1ZSlcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGNvbnRhaW5lciIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xheW91dCcsICgkbG9nLCBzY2FsZSwgc2NhbGVMaXN0LCB0aW1pbmcpIC0+XG5cbiAgbGF5b3V0Q250ciA9IDBcblxuICBsYXlvdXQgPSAoKSAtPlxuICAgIF9pZCA9IFwibGF5b3V0I3tsYXlvdXRDbnRyKyt9XCJcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gc2NhbGVMaXN0KClcbiAgICBfc2hvd0xhYmVscyA9IGZhbHNlXG4gICAgX2xheW91dExpZmVDeWNsZSA9IGQzLmRpc3BhdGNoKCdjb25maWd1cmUnLCAnZHJhd0NoYXJ0JywgJ3ByZXBhcmVEYXRhJywgJ2JydXNoJywgJ3JlZHJhdycsICdkcmF3QXhpcycsICd1cGRhdGUnLCAndXBkYXRlQXR0cnMnLCAnYnJ1c2hEcmF3JylcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLmlkID0gKGlkKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IGNoYXJ0XG4gICAgICAgIF9zY2FsZUxpc3QucGFyZW50U2NhbGVzKGNoYXJ0LnNjYWxlcygpKVxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJjb25maWd1cmUuI3ttZS5pZCgpfVwiLCAoKSAtPiBfbGF5b3V0TGlmZUN5Y2xlLmNvbmZpZ3VyZS5hcHBseShtZS5zY2FsZXMoKSkgI3Bhc3N0aHJvdWdoXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcImRyYXdDaGFydC4je21lLmlkKCl9XCIsIG1lLmRyYXcgIyByZWdpc3RlciBmb3IgdGhlIGRyYXdpbmcgZXZlbnRcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwicHJlcGFyZURhdGEuI3ttZS5pZCgpfVwiLCBtZS5wcmVwYXJlRGF0YVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNjYWxlcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NjYWxlTGlzdFxuXG4gICAgbWUuc2NhbGVQcm9wZXJ0aWVzID0gKCkgLT5cbiAgICAgIHJldHVybiBtZS5zY2FsZXMoKS5nZXRTY2FsZVByb3BlcnRpZXMoKVxuXG4gICAgbWUuY29udGFpbmVyID0gKG9iaikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY29udGFpbmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9jb250YWluZXIgPSBvYmpcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zaG93RGF0YUxhYmVscyA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dMYWJlbHNcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dMYWJlbHMgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5iZWhhdmlvciA9ICgpIC0+XG4gICAgICBtZS5jaGFydCgpLmJlaGF2aW9yKClcblxuICAgIG1lLnByZXBhcmVEYXRhID0gKGRhdGEpIC0+XG4gICAgICBhcmdzID0gW11cbiAgICAgIGZvciBraW5kIGluIFsneCcsJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZScsICdyYW5nZVgnLCAncmFuZ2VZJ11cbiAgICAgICAgYXJncy5wdXNoKF9zY2FsZUxpc3QuZ2V0S2luZChraW5kKSlcbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUucHJlcGFyZURhdGEuYXBwbHkoZGF0YSwgYXJncylcblxuICAgIG1lLmxpZmVDeWNsZSA9ICgpLT5cbiAgICAgIHJldHVybiBfbGF5b3V0TGlmZUN5Y2xlXG5cblxuICAgICMtLS0gRFJZb3V0IGZyb20gZHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBnZXREcmF3QXJlYSA9ICgpIC0+XG4gICAgICBjb250YWluZXIgPSBfY29udGFpbmVyLmdldENoYXJ0QXJlYSgpXG4gICAgICBkcmF3QXJlYSA9IGNvbnRhaW5lci5zZWxlY3QoXCIuI3ttZS5pZCgpfVwiKVxuICAgICAgaWYgZHJhd0FyZWEuZW1wdHkoKVxuICAgICAgICBkcmF3QXJlYSA9IGNvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIChkKSAtPiBtZS5pZCgpKVxuICAgICAgcmV0dXJuIGRyYXdBcmVhXG5cbiAgICBidWlsZEFyZ3MgPSAoZGF0YSwgbm90QW5pbWF0ZWQpIC0+XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICBoZWlnaHQ6X2NvbnRhaW5lci5oZWlnaHQoKSxcbiAgICAgICAgd2lkdGg6X2NvbnRhaW5lci53aWR0aCgpLFxuICAgICAgICBtYXJnaW5zOl9jb250YWluZXIubWFyZ2lucygpLFxuICAgICAgICBkdXJhdGlvbjogaWYgbm90QW5pbWF0ZWQgdGhlbiAwIGVsc2UgbWUuY2hhcnQoKS5hbmltYXRpb25EdXJhdGlvbigpXG4gICAgICB9XG4gICAgICBhcmdzID0gW2RhdGEsIG9wdGlvbnNdXG4gICAgICBmb3Iga2luZCBpbiBbJ3gnLCd5JywgJ2NvbG9yJywgJ3NpemUnLCAnc2hhcGUnLCAncmFuZ2VYJywgJ3JhbmdlWSddXG4gICAgICAgIGFyZ3MucHVzaChfc2NhbGVMaXN0LmdldEtpbmQoa2luZCkpXG4gICAgICByZXR1cm4gYXJnc1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRyYXcgPSAoZGF0YSwgbm90QW5pbWF0ZWQpIC0+XG4gICAgICBfZGF0YSA9IGRhdGFcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5kcmF3Q2hhcnQuYXBwbHkoZ2V0RHJhd0FyZWEoKSwgYnVpbGRBcmdzKGRhdGEsIG5vdEFuaW1hdGVkKSlcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAncmVkcmF3JywgbWUucmVkcmF3XG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICd1cGRhdGUnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnVwZGF0ZVxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAnZHJhd0F4aXMnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLmRyYXdBeGlzXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICd1cGRhdGVBdHRycycsIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkudXBkYXRlQXR0cnNcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAnYnJ1c2gnLCAoYXhpcywgbm90QW5pbWF0ZWQsIGlkeFJhbmdlKSAtPlxuICAgICAgICBfY29udGFpbmVyLmRyYXdTaW5nbGVBeGlzKGF4aXMpXG4gICAgICAgIF9sYXlvdXRMaWZlQ3ljbGUuYnJ1c2hEcmF3LmFwcGx5KGdldERyYXdBcmVhKCksIFtheGlzLCBpZHhSYW5nZSwgX2NvbnRhaW5lci53aWR0aCgpLCBfY29udGFpbmVyLmhlaWdodCgpXSlcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBsYXlvdXQiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdsZWdlbmQnLCAoJGxvZywgJGNvbXBpbGUsICRyb290U2NvcGUsICR0ZW1wbGF0ZUNhY2hlLCB0ZW1wbGF0ZURpcikgLT5cblxuICBsZWdlbmRDbnQgPSAwXG5cbiAgdW5pcXVlVmFsdWVzID0gKGFycikgLT5cbiAgICBzZXQgPSB7fVxuICAgIGZvciBlIGluIGFyclxuICAgICAgc2V0W2VdID0gMFxuICAgIHJldHVybiBPYmplY3Qua2V5cyhzZXQpXG5cbiAgbGVnZW5kID0gKCkgLT5cblxuICAgIF9pZCA9IFwibGVnZW5kLSN7bGVnZW5kQ250Kyt9XCJcbiAgICBfcG9zaXRpb24gPSAndG9wLXJpZ2h0J1xuICAgIF9zY2FsZSA9IHVuZGVmaW5lZFxuICAgIF90ZW1wbGF0ZVBhdGggPSB1bmRlZmluZWRcbiAgICBfbGVnZW5kU2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcodHJ1ZSlcbiAgICBfdGVtcGxhdGUgPSB1bmRlZmluZWRcbiAgICBfcGFyc2VkVGVtcGxhdGUgPSB1bmRlZmluZWRcbiAgICBfY29udGFpbmVyRGl2ID0gdW5kZWZpbmVkXG4gICAgX2xlZ2VuZERpdiA9IHVuZGVmaW5lZFxuICAgIF90aXRsZSA9IHVuZGVmaW5lZFxuICAgIF9sYXlvdXQgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9vcHRpb25zID0gdW5kZWZpbmVkXG4gICAgX3Nob3cgPSBmYWxzZVxuICAgIF9zaG93VmFsdWVzID0gZmFsc2VcblxuICAgIG1lID0ge31cblxuICAgIG1lLnBvc2l0aW9uID0gKHBvcykgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcG9zaXRpb25cbiAgICAgIGVsc2VcbiAgICAgICAgX3Bvc2l0aW9uID0gcG9zXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc2hvdyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3cgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnNob3dWYWx1ZXMgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93VmFsdWVzXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93VmFsdWVzID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5kaXYgPSAoc2VsZWN0aW9uKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sZWdlbmREaXZcbiAgICAgIGVsc2VcbiAgICAgICAgX2xlZ2VuZERpdiA9IHNlbGVjdGlvblxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxheW91dCA9IChsYXlvdXQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheW91dFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5b3V0ID0gbGF5b3V0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc2NhbGUgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlXG4gICAgICBlbHNlXG4gICAgICAgIF9zY2FsZSA9IHNjYWxlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUudGl0bGUgPSAodGl0bGUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF90aXRsZSA9IHRpdGxlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUudGVtcGxhdGUgPSAocGF0aCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGVtcGxhdGVQYXRoXG4gICAgICBlbHNlXG4gICAgICAgIF90ZW1wbGF0ZVBhdGggPSBwYXRoXG4gICAgICAgIF90ZW1wbGF0ZSA9ICR0ZW1wbGF0ZUNhY2hlLmdldChfdGVtcGxhdGVQYXRoKVxuICAgICAgICBfcGFyc2VkVGVtcGxhdGUgPSAkY29tcGlsZShfdGVtcGxhdGUpKF9sZWdlbmRTY29wZSlcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5kcmF3ID0gKGRhdGEsIG9wdGlvbnMpIC0+XG4gICAgICBfZGF0YSA9IGRhdGFcbiAgICAgIF9vcHRpb25zID0gb3B0aW9uc1xuICAgICAgIyRsb2cuaW5mbyAnZHJhd2luZyBMZWdlbmQnXG4gICAgICBfY29udGFpbmVyRGl2ID0gX2xlZ2VuZERpdiBvciBkMy5zZWxlY3QobWUuc2NhbGUoKS5wYXJlbnQoKS5jb250YWluZXIoKS5lbGVtZW50KCkpLnNlbGVjdCgnLndrLWNoYXJ0JylcbiAgICAgIGlmIG1lLnNob3coKVxuICAgICAgICBpZiBfY29udGFpbmVyRGl2LnNlbGVjdCgnLndrLWNoYXJ0LWxlZ2VuZCcpLmVtcHR5KClcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoX2NvbnRhaW5lckRpdi5ub2RlKCkpLmFwcGVuZChfcGFyc2VkVGVtcGxhdGUpXG5cbiAgICAgICAgaWYgbWUuc2hvd1ZhbHVlcygpXG4gICAgICAgICAgbGF5ZXJzID0gdW5pcXVlVmFsdWVzKF9zY2FsZS52YWx1ZShkYXRhKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycyA9IF9zY2FsZS5sYXllcktleXMoZGF0YSlcblxuICAgICAgICBzID0gX3NjYWxlLnNjYWxlKClcbiAgICAgICAgaWYgbWUubGF5b3V0KCk/LnNjYWxlcygpLmxheWVyU2NhbGUoKVxuICAgICAgICAgIHMgPSBtZS5sYXlvdXQoKS5zY2FsZXMoKS5sYXllclNjYWxlKCkuc2NhbGUoKVxuICAgICAgICBpZiBfc2NhbGUua2luZCgpIGlzbnQgJ3NoYXBlJ1xuICAgICAgICAgIF9sZWdlbmRTY29wZS5sZWdlbmRSb3dzID0gbGF5ZXJzLm1hcCgoZCkgLT4ge3ZhbHVlOmQsIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6cyhkKX19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2xlZ2VuZFNjb3BlLmxlZ2VuZFJvd3MgPSBsYXllcnMubWFwKChkKSAtPiB7dmFsdWU6ZCwgcGF0aDpkMy5zdmcuc3ltYm9sKCkudHlwZShzKGQpKS5zaXplKDgwKSgpfSlcbiAgICAgICAgICAjJGxvZy5sb2cgX2xlZ2VuZFNjb3BlLmxlZ2VuZFJvd3NcbiAgICAgICAgX2xlZ2VuZFNjb3BlLnNob3dMZWdlbmQgPSB0cnVlXG4gICAgICAgIF9sZWdlbmRTY29wZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogaWYgX2xlZ2VuZERpdiB0aGVuICdyZWxhdGl2ZScgZWxzZSAnYWJzb2x1dGUnXG4gICAgICAgIH1cblxuICAgICAgICBpZiBub3QgX2xlZ2VuZERpdlxuICAgICAgICAgIGNvbnRhaW5lclJlY3QgPSBfY29udGFpbmVyRGl2Lm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgIGNoYXJ0QXJlYVJlY3QgPSBfY29udGFpbmVyRGl2LnNlbGVjdCgnLndrLWNoYXJ0LW92ZXJsYXkgcmVjdCcpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgIGZvciBwIGluIF9wb3NpdGlvbi5zcGxpdCgnLScpXG4gICAgICAgICAgICAgIF9sZWdlbmRTY29wZS5wb3NpdGlvbltwXSA9IFwiI3tNYXRoLmFicyhjb250YWluZXJSZWN0W3BdIC0gY2hhcnRBcmVhUmVjdFtwXSl9cHhcIlxuICAgICAgICBfbGVnZW5kU2NvcGUudGl0bGUgPSBfdGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhcnNlZFRlbXBsYXRlLnJlbW92ZSgpXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnJlZ2lzdGVyID0gKGxheW91dCkgLT5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiBcImRyYXdDaGFydC4je19pZH1cIiwgbWUuZHJhd1xuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50ZW1wbGF0ZSh0ZW1wbGF0ZURpciArICdsZWdlbmQuaHRtbCcpXG5cbiAgICBtZS5yZWRyYXcgPSAoKSAtPlxuICAgICAgaWYgX2RhdGEgYW5kIF9vcHRpb25zXG4gICAgICAgIG1lLmRyYXcoX2RhdGEsIF9vcHRpb25zKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gbGVnZW5kIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnc2NhbGUnLCAoJGxvZywgbGVnZW5kLCBmb3JtYXREZWZhdWx0cywgd2tDaGFydFNjYWxlcywgd2tDaGFydExvY2FsZSkgLT5cblxuICBzY2FsZSA9ICgpIC0+XG4gICAgX2lkID0gJydcbiAgICBfc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgIF9zY2FsZVR5cGUgPSAnbGluZWFyJ1xuICAgIF9leHBvbmVudCA9IDFcbiAgICBfaXNPcmRpbmFsID0gZmFsc2VcbiAgICBfZG9tYWluID0gdW5kZWZpbmVkXG4gICAgX2RvbWFpbkNhbGMgPSB1bmRlZmluZWRcbiAgICBfY2FsY3VsYXRlZERvbWFpbiA9IHVuZGVmaW5lZFxuICAgIF9yZXNldE9uTmV3RGF0YSA9IGZhbHNlXG4gICAgX3Byb3BlcnR5ID0gJydcbiAgICBfbGF5ZXJQcm9wID0gJydcbiAgICBfbGF5ZXJFeGNsdWRlID0gW11cbiAgICBfbG93ZXJQcm9wZXJ0eSA9ICcnXG4gICAgX3VwcGVyUHJvcGVydHkgPSAnJ1xuICAgIF9yYW5nZSA9IHVuZGVmaW5lZFxuICAgIF9yYW5nZVBhZGRpbmcgPSAwLjNcbiAgICBfcmFuZ2VPdXRlclBhZGRpbmcgPSAwLjNcbiAgICBfaW5wdXRGb3JtYXRTdHJpbmcgPSB1bmRlZmluZWRcbiAgICBfaW5wdXRGb3JtYXRGbiA9IChkYXRhKSAtPiBpZiBpc05hTigrZGF0YSkgb3IgXy5pc0RhdGUoZGF0YSkgdGhlbiBkYXRhIGVsc2UgK2RhdGFcblxuICAgIF9zaG93QXhpcyA9IGZhbHNlXG4gICAgX2F4aXNPcmllbnQgPSB1bmRlZmluZWRcbiAgICBfYXhpc09yaWVudE9sZCA9IHVuZGVmaW5lZFxuICAgIF9heGlzID0gdW5kZWZpbmVkXG4gICAgX3RpY2tzID0gdW5kZWZpbmVkXG4gICAgX3RpY2tGb3JtYXQgPSB1bmRlZmluZWRcbiAgICBfdGlja1ZhbHVlcyA9IHVuZGVmaW5lZFxuICAgIF9yb3RhdGVUaWNrTGFiZWxzID0gdW5kZWZpbmVkXG4gICAgX3Nob3dMYWJlbCA9IGZhbHNlXG4gICAgX2F4aXNMYWJlbCA9IHVuZGVmaW5lZFxuICAgIF9zaG93R3JpZCA9IGZhbHNlXG4gICAgX2lzSG9yaXpvbnRhbCA9IGZhbHNlXG4gICAgX2lzVmVydGljYWwgPSBmYWxzZVxuICAgIF9raW5kID0gdW5kZWZpbmVkXG4gICAgX3BhcmVudCA9IHVuZGVmaW5lZFxuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9sYXlvdXQgPSB1bmRlZmluZWRcbiAgICBfbGVnZW5kID0gbGVnZW5kKClcbiAgICBfb3V0cHV0Rm9ybWF0U3RyaW5nID0gdW5kZWZpbmVkXG4gICAgX291dHB1dEZvcm1hdEZuID0gdW5kZWZpbmVkXG5cbiAgICBfdGlja0Zvcm1hdCA9IHdrQ2hhcnRMb2NhbGUudGltZUZvcm1hdC5tdWx0aShbXG4gICAgICBbXCIuJUxcIiwgKGQpIC0+ICBkLmdldE1pbGxpc2Vjb25kcygpXSxcbiAgICAgIFtcIjolU1wiLCAoZCkgLT4gIGQuZ2V0U2Vjb25kcygpXSxcbiAgICAgIFtcIiVJOiVNXCIsIChkKSAtPiAgZC5nZXRNaW51dGVzKCldLFxuICAgICAgW1wiJUkgJXBcIiwgKGQpIC0+ICBkLmdldEhvdXJzKCldLFxuICAgICAgW1wiJWEgJWRcIiwgKGQpIC0+ICBkLmdldERheSgpIGFuZCBkLmdldERhdGUoKSBpc250IDFdLFxuICAgICAgW1wiJWIgJWRcIiwgKGQpIC0+ICBkLmdldERhdGUoKSBpc250IDFdLFxuICAgICAgW1wiJUJcIiwgKGQpIC0+ICBkLmdldE1vbnRoKCldLFxuICAgICAgW1wiJVlcIiwgKCkgLT4gIHRydWVdXG4gICAgXSlcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0tIHV0aWxpdHkgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGtleXMgPSAoZGF0YSkgLT4gaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gXy5yZWplY3QoXy5rZXlzKGRhdGFbMF0pLCAoZCkgLT4gZCBpcyAnJCRoYXNoS2V5JykgZWxzZSBfLnJlamVjdChfLmtleXMoZGF0YSksIChkKSAtPiBkIGlzICckJGhhc2hLZXknKVxuXG4gICAgbGF5ZXJUb3RhbCA9IChkLCBsYXllcktleXMpIC0+XG4gICAgICBsYXllcktleXMucmVkdWNlKFxuICAgICAgICAocHJldiwgbmV4dCkgLT4gK3ByZXYgKyArbWUubGF5ZXJWYWx1ZShkLG5leHQpXG4gICAgICAsIDApXG5cbiAgICBsYXllck1heCA9IChkYXRhLCBsYXllcktleXMpIC0+XG4gICAgICBkMy5tYXgoZGF0YSwgKGQpIC0+IGQzLm1heChsYXllcktleXMsIChrKSAtPiBtZS5sYXllclZhbHVlKGQsaykpKVxuXG4gICAgbGF5ZXJNaW4gPSAoZGF0YSwgbGF5ZXJLZXlzKSAtPlxuICAgICAgZDMubWluKGRhdGEsIChkKSAtPiBkMy5taW4obGF5ZXJLZXlzLCAoaykgLT4gbWUubGF5ZXJWYWx1ZShkLGspKSlcblxuICAgIHBhcnNlZFZhbHVlID0gKHYpIC0+XG4gICAgICBpZiBfaW5wdXRGb3JtYXRGbi5wYXJzZSB0aGVuIF9pbnB1dEZvcm1hdEZuLnBhcnNlKHYpIGVsc2UgX2lucHV0Rm9ybWF0Rm4odilcblxuICAgIGNhbGNEb21haW4gPSB7XG4gICAgICBleHRlbnQ6IChkYXRhKSAtPlxuICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgcmV0dXJuIFtsYXllck1pbihkYXRhLCBsYXllcktleXMpLCBsYXllck1heChkYXRhLCBsYXllcktleXMpXVxuICAgICAgbWF4OiAoZGF0YSkgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIHJldHVybiBbMCwgbGF5ZXJNYXgoZGF0YSwgbGF5ZXJLZXlzKV1cbiAgICAgIG1pbjogKGRhdGEpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICByZXR1cm4gWzAsIGxheWVyTWluKGRhdGEsIGxheWVyS2V5cyldXG4gICAgICB0b3RhbEV4dGVudDogKGRhdGEpIC0+XG4gICAgICAgIGlmIGRhdGFbMF0uaGFzT3duUHJvcGVydHkoJ3RvdGFsJylcbiAgICAgICAgICByZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgZC50b3RhbCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgICByZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgbGF5ZXJUb3RhbChkLCBsYXllcktleXMpKSlcbiAgICAgIHRvdGFsOiAoZGF0YSkgLT5cbiAgICAgICAgaWYgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eSgndG90YWwnKVxuICAgICAgICAgIHJldHVybiBbMCwgZDMubWF4KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgZC50b3RhbCkpXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgICAgcmV0dXJuIFswLCBkMy5tYXgoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBsYXllclRvdGFsKGQsIGxheWVyS2V5cykpKV1cbiAgICAgIHJhbmdlRXh0ZW50OiAoZGF0YSkgLT5cbiAgICAgICAgaWYgbWUudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgcmV0dXJuIFtkMy5taW4obWUubG93ZXJWYWx1ZShkYXRhKSksIGQzLm1heChtZS51cHBlclZhbHVlKGRhdGEpKV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIGRhdGEubGVuZ3RoID4gMVxuICAgICAgICAgICAgc3RhcnQgPSBtZS5sb3dlclZhbHVlKGRhdGFbMF0pXG4gICAgICAgICAgICBzdGVwID0gbWUubG93ZXJWYWx1ZShkYXRhWzFdKSAtIHN0YXJ0XG4gICAgICAgICAgICByZXR1cm4gW21lLmxvd2VyVmFsdWUoZGF0YVswXSksIHN0YXJ0ICsgc3RlcCAqIChkYXRhLmxlbmd0aCkgXVxuICAgICAgcmFuZ2VNaW46IChkYXRhKSAtPlxuICAgICAgICByZXR1cm4gWzAsIGQzLm1pbihtZS5sb3dlclZhbHVlKGRhdGEpKV1cbiAgICAgIHJhbmdlTWF4OiAoZGF0YSkgLT5cbiAgICAgICAgaWYgbWUudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgcmV0dXJuIFswLCBkMy5tYXgobWUudXBwZXJWYWx1ZShkYXRhKSldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzdGFydCA9IG1lLmxvd2VyVmFsdWUoZGF0YVswXSlcbiAgICAgICAgICBzdGVwID0gbWUubG93ZXJWYWx1ZShkYXRhWzFdKSAtIHN0YXJ0XG4gICAgICAgICAgcmV0dXJuIFswLCBzdGFydCArIHN0ZXAgKiAoZGF0YS5sZW5ndGgpIF1cbiAgICAgIH1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5pZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2tpbmQgKyAnLicgKyBfcGFyZW50LmlkKClcblxuICAgIG1lLmtpbmQgPSAoa2luZCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfa2luZFxuICAgICAgZWxzZVxuICAgICAgICBfa2luZCA9IGtpbmRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5wYXJlbnQgPSAocGFyZW50KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wYXJlbnRcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhcmVudCA9IHBhcmVudFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmNoYXJ0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY2hhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgX2NoYXJ0ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5sYXlvdXQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXlvdXRcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheW91dCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnNjYWxlID0gKCkgLT5cbiAgICAgIHJldHVybiBfc2NhbGVcblxuICAgIG1lLmxlZ2VuZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2xlZ2VuZFxuXG4gICAgbWUuaXNPcmRpbmFsID0gKCkgLT5cbiAgICAgIF9pc09yZGluYWxcblxuICAgIG1lLmlzSG9yaXpvbnRhbCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2lzSG9yaXpvbnRhbFxuICAgICAgZWxzZVxuICAgICAgICBfaXNIb3Jpem9udGFsID0gdHJ1ZUZhbHNlXG4gICAgICAgIGlmIHRydWVGYWxzZVxuICAgICAgICAgIF9pc1ZlcnRpY2FsID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5pc1ZlcnRpY2FsID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaXNWZXJ0aWNhbFxuICAgICAgZWxzZVxuICAgICAgICBfaXNWZXJ0aWNhbCA9IHRydWVGYWxzZVxuICAgICAgICBpZiB0cnVlRmFsc2VcbiAgICAgICAgICBfaXNIb3Jpem9udGFsID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0gU2NhbGVUeXBlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2NhbGVUeXBlID0gKHR5cGUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlVHlwZVxuICAgICAgZWxzZVxuICAgICAgICBpZiBkMy5zY2FsZS5oYXNPd25Qcm9wZXJ0eSh0eXBlKSAjIHN1cHBvcnQgdGhlIGZ1bGwgbGlzdCBvZiBkMyBzY2FsZSB0eXBlc1xuICAgICAgICAgIF9zY2FsZSA9IGQzLnNjYWxlW3R5cGVdKClcbiAgICAgICAgICBfc2NhbGVUeXBlID0gdHlwZVxuICAgICAgICAgIG1lLmZvcm1hdChmb3JtYXREZWZhdWx0cy5udW1iZXIpXG4gICAgICAgIGVsc2UgaWYgdHlwZSBpcyAndGltZScgIyB0aW1lIHNjYWxlIGlzIGluIGQzLnRpbWUgb2JqZWN0LCBub3QgaW4gZDMuc2NhbGUuXG4gICAgICAgICAgX3NjYWxlID0gZDMudGltZS5zY2FsZSgpXG4gICAgICAgICAgX3NjYWxlVHlwZSA9ICd0aW1lJ1xuICAgICAgICAgIGlmIF9pbnB1dEZvcm1hdFN0cmluZ1xuICAgICAgICAgICAgbWUuZGF0YUZvcm1hdChfaW5wdXRGb3JtYXRTdHJpbmcpXG4gICAgICAgICAgbWUuZm9ybWF0KGZvcm1hdERlZmF1bHRzLmRhdGUpXG4gICAgICAgIGVsc2UgaWYgd2tDaGFydFNjYWxlcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKVxuICAgICAgICAgIF9zY2FsZVR5cGUgPSB0eXBlXG4gICAgICAgICAgX3NjYWxlID0gd2tDaGFydFNjYWxlc1t0eXBlXSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkbG9nLmVycm9yICdFcnJvcjogaWxsZWdhbCBzY2FsZSB0eXBlOicsIHR5cGVcblxuICAgICAgICBfaXNPcmRpbmFsID0gX3NjYWxlVHlwZSBpbiBbJ29yZGluYWwnLCAnY2F0ZWdvcnkxMCcsICdjYXRlZ29yeTIwJywgJ2NhdGVnb3J5MjBiJywgJ2NhdGVnb3J5MjBjJ11cbiAgICAgICAgaWYgX3JhbmdlXG4gICAgICAgICAgbWUucmFuZ2UoX3JhbmdlKVxuXG4gICAgICAgIGlmIF9zaG93QXhpc1xuICAgICAgICAgIF9heGlzLnNjYWxlKF9zY2FsZSlcblxuICAgICAgICBpZiBfZXhwb25lbnQgYW5kIF9zY2FsZVR5cGUgaXMgJ3BvdydcbiAgICAgICAgICBfc2NhbGUuZXhwb25lbnQoX2V4cG9uZW50KVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmV4cG9uZW50ID0gKHZhbHVlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9leHBvbmVudFxuICAgICAgZWxzZVxuICAgICAgICBfZXhwb25lbnQgPSB2YWx1ZVxuICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICdwb3cnXG4gICAgICAgICAgX3NjYWxlLmV4cG9uZW50KF9leHBvbmVudClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIERvbWFpbiBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZG9tYWluID0gKGRvbSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZG9tYWluXG4gICAgICBlbHNlXG4gICAgICAgIF9kb21haW4gPSBkb21cbiAgICAgICAgaWYgXy5pc0FycmF5KF9kb21haW4pXG4gICAgICAgICAgX3NjYWxlLmRvbWFpbihfZG9tYWluKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmRvbWFpbkNhbGMgPSAocnVsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gaWYgX2lzT3JkaW5hbCB0aGVuIHVuZGVmaW5lZCBlbHNlIF9kb21haW5DYWxjXG4gICAgICBlbHNlXG4gICAgICAgIGlmIGNhbGNEb21haW4uaGFzT3duUHJvcGVydHkocnVsZSlcbiAgICAgICAgICBfZG9tYWluQ2FsYyA9IHJ1bGVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRsb2cuZXJyb3IgJ2lsbGVnYWwgZG9tYWluIGNhbGN1bGF0aW9uIHJ1bGU6JywgcnVsZSwgXCIgZXhwZWN0ZWRcIiwgXy5rZXlzKGNhbGNEb21haW4pXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZ2V0RG9tYWluID0gKGRhdGEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlLmRvbWFpbigpXG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfZG9tYWluIGFuZCBtZS5kb21haW5DYWxjKClcbiAgICAgICAgICAgIHJldHVybiBfY2FsY3VsYXRlZERvbWFpblxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgX2RvbWFpblxuICAgICAgICAgICAgcmV0dXJuIF9kb21haW5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gbWUudmFsdWUoZGF0YSlcblxuICAgIG1lLnJlc2V0T25OZXdEYXRhID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcmVzZXRPbk5ld0RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX3Jlc2V0T25OZXdEYXRhID0gdHJ1ZUZhbHNlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBSYW5nZSBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnJhbmdlID0gKHJhbmdlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zY2FsZS5yYW5nZSgpXG4gICAgICBlbHNlXG4gICAgICAgIF9yYW5nZSA9IHJhbmdlXG4gICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ29yZGluYWwnIGFuZCBtZS5raW5kKCkgaW4gWyd4JywneSddXG4gICAgICAgICAgICBfc2NhbGUucmFuZ2VCYW5kcyhyYW5nZSwgX3JhbmdlUGFkZGluZywgX3JhbmdlT3V0ZXJQYWRkaW5nKVxuICAgICAgICBlbHNlIGlmIG5vdCAoX3NjYWxlVHlwZSBpbiBbJ2NhdGVnb3J5MTAnLCAnY2F0ZWdvcnkyMCcsICdjYXRlZ29yeTIwYicsICdjYXRlZ29yeTIwYyddKVxuICAgICAgICAgIF9zY2FsZS5yYW5nZShyYW5nZSkgIyBpZ25vcmUgcmFuZ2UgZm9yIGNvbG9yIGNhdGVnb3J5IHNjYWxlc1xuXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucmFuZ2VQYWRkaW5nID0gKGNvbmZpZykgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiB7cGFkZGluZzpfcmFuZ2VQYWRkaW5nLCBvdXRlclBhZGRpbmc6X3JhbmdlT3V0ZXJQYWRkaW5nfVxuICAgICAgZWxzZVxuICAgICAgICBfcmFuZ2VQYWRkaW5nID0gY29uZmlnLnBhZGRpbmdcbiAgICAgICAgX3JhbmdlT3V0ZXJQYWRkaW5nID0gY29uZmlnLm91dGVyUGFkZGluZ1xuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gcHJvcGVydHkgcmVsYXRlZCBhdHRyaWJ1dGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5wcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wcm9wZXJ0eVxuICAgICAgZWxzZVxuICAgICAgICBfcHJvcGVydHkgPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJQcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXllclByb3BcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyUHJvcCA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllckV4Y2x1ZGUgPSAoZXhjbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5ZXJFeGNsdWRlXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllckV4Y2x1ZGUgPSBleGNsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJLZXlzID0gKGRhdGEpIC0+XG4gICAgICBpZiBfcHJvcGVydHlcbiAgICAgICAgaWYgXy5pc0FycmF5KF9wcm9wZXJ0eSlcbiAgICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oX3Byb3BlcnR5LCBrZXlzKGRhdGEpKSAjIGVuc3VyZSBvbmx5IGtleXMgYWxzbyBpbiB0aGUgZGF0YSBhcmUgcmV0dXJuZWQgYW5kICQkaGFzaEtleSBpcyBub3QgcmV0dXJuZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBbX3Byb3BlcnR5XSAjYWx3YXlzIHJldHVybiBhbiBhcnJheSAhISFcbiAgICAgIGVsc2VcbiAgICAgICAgXy5yZWplY3Qoa2V5cyhkYXRhKSwgKGQpIC0+IGQgaW4gX2xheWVyRXhjbHVkZSlcblxuICAgIG1lLmxvd2VyUHJvcGVydHkgPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbG93ZXJQcm9wZXJ0eVxuICAgICAgZWxzZVxuICAgICAgICBfbG93ZXJQcm9wZXJ0eSA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS51cHBlclByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3VwcGVyUHJvcGVydHlcbiAgICAgIGVsc2VcbiAgICAgICAgX3VwcGVyUHJvcGVydHkgPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBEYXRhIEZvcm1hdHRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRhdGFGb3JtYXQgPSAoZm9ybWF0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9pbnB1dEZvcm1hdFN0cmluZ1xuICAgICAgZWxzZVxuICAgICAgICBfaW5wdXRGb3JtYXRTdHJpbmcgPSBmb3JtYXRcbiAgICAgICAgaWYgX3NjYWxlVHlwZSBpcyAndGltZSdcbiAgICAgICAgICBfaW5wdXRGb3JtYXRGbiA9IHdrQ2hhcnRMb2NhbGUudGltZUZvcm1hdChmb3JtYXQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfaW5wdXRGb3JtYXRGbiA9IChkKSAtPiBkXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBDb3JlIGRhdGEgdHJhbnNmb3JtYXRpb24gaW50ZXJmYWNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBpZiBfbGF5ZXJQcm9wXG4gICAgICAgIGlmIF8uaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBwYXJzZWRWYWx1ZShkW19wcm9wZXJ0eV1bX2xheWVyUHJvcF0pKSBlbHNlIHBhcnNlZFZhbHVlKGRhdGFbX3Byb3BlcnR5XVtfbGF5ZXJQcm9wXSlcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3Byb3BlcnR5XSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfcHJvcGVydHldKVxuXG4gICAgbWUubGF5ZXJWYWx1ZSA9IChkYXRhLCBsYXllcktleSkgLT5cbiAgICAgIGlmIF9sYXllclByb3BcbiAgICAgICAgcGFyc2VkVmFsdWUoZGF0YVtsYXllcktleV1bX2xheWVyUHJvcF0pXG4gICAgICBlbHNlXG4gICAgICAgIHBhcnNlZFZhbHVlKGRhdGFbbGF5ZXJLZXldKVxuXG4gICAgbWUubG93ZXJWYWx1ZSA9IChkYXRhKSAtPlxuICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX2xvd2VyUHJvcGVydHldKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW19sb3dlclByb3BlcnR5XSlcblxuICAgIG1lLnVwcGVyVmFsdWUgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF8uaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBwYXJzZWRWYWx1ZShkW191cHBlclByb3BlcnR5XSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfdXBwZXJQcm9wZXJ0eV0pXG5cbiAgICBtZS5mb3JtYXR0ZWRWYWx1ZSA9IChkYXRhKSAtPlxuICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IG1lLmZvcm1hdFZhbHVlKG1lLnZhbHVlKGQpKSkgZWxzZSBtZS5mb3JtYXRWYWx1ZShtZS52YWx1ZShkYXRhKSlcblxuICAgIG1lLmZvcm1hdFZhbHVlID0gKHZhbCkgLT5cbiAgICAgIGlmIF9vdXRwdXRGb3JtYXRTdHJpbmcgYW5kIHZhbCBhbmQgICh2YWwuZ2V0VVRDRGF0ZSBvciBub3QgaXNOYU4odmFsKSlcbiAgICAgICAgX291dHB1dEZvcm1hdEZuKHZhbClcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsXG5cbiAgICBtZS5tYXAgPSAoZGF0YSkgLT5cbiAgICAgIGlmIEFycmF5LmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gX3NjYWxlKG1lLnZhbHVlKGRhdGEpKSkgZWxzZSBfc2NhbGUobWUudmFsdWUoZGF0YSkpXG5cbiAgICBtZS5pbnZlcnQgPSAobWFwcGVkVmFsdWUpIC0+XG4gICAgICAjIHRha2VzIGEgbWFwcGVkIHZhbHVlIChwaXhlbCBwb3NpdGlvbiAsIGNvbG9yIHZhbHVlLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluIHRoZSBpbnB1dCBkb21haW5cbiAgICAgICMgdGhlIHR5cGUgb2YgaW52ZXJzZSBpcyBkZXBlbmRlbnQgb24gdGhlIHNjYWxlIHR5cGUgZm9yIHF1YW50aXRhdGl2ZSBzY2FsZXMuXG4gICAgICAjIE9yZGluYWwgc2NhbGVzIC4uLlxuXG4gICAgICBpZiBfLmhhcyhtZS5zY2FsZSgpLCdpbnZlcnQnKSAjIGkuZS4gdGhlIGQzIHNjYWxlIHN1cHBvcnRzIHRoZSBpbnZlcnNlIGNhbGN1bGF0aW9uOiBsaW5lYXIsIGxvZywgcG93LCBzcXJ0XG4gICAgICAgIF9kYXRhID0gbWUuY2hhcnQoKS5nZXREYXRhKClcblxuICAgICAgICAjIGJpc2VjdC5sZWZ0IG5ldmVyIHJldHVybnMgMCBpbiB0aGlzIHNwZWNpZmljIHNjZW5hcmlvLiBXZSBuZWVkIHRvIG1vdmUgdGhlIHZhbCBieSBhbiBpbnRlcnZhbCB0byBoaXQgdGhlIG1pZGRsZSBvZiB0aGUgcmFuZ2UgYW5kIHRvIGVuc3VyZVxuICAgICAgICAjIHRoYXQgdGhlIGZpcnN0IGVsZW1lbnQgd2lsbCBiZSBjYXB0dXJlZC4gQWxzbyBlbnN1cmVzIGJldHRlciB2aXN1YWwgZXhwZXJpZW5jZSB3aXRoIHRvb2x0aXBzXG4gICAgICAgIGlmIG1lLmtpbmQoKSBpcyAncmFuZ2VYJyBvciBtZS5raW5kKCkgaXMgJ3JhbmdlWSdcbiAgICAgICAgICB2YWwgPSBtZS5zY2FsZSgpLmludmVydChtYXBwZWRWYWx1ZSlcbiAgICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICAgIGJpc2VjdCA9IGQzLmJpc2VjdG9yKG1lLnVwcGVyVmFsdWUpLmxlZnRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGVwID0gbWUubG93ZXJWYWx1ZShfZGF0YVsxXSkgLSBtZS5sb3dlclZhbHVlKF9kYXRhWzBdKVxuICAgICAgICAgICAgYmlzZWN0ID0gZDMuYmlzZWN0b3IoKGQpIC0+IG1lLmxvd2VyVmFsdWUoZCkgKyBzdGVwKS5sZWZ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByYW5nZSA9IF9zY2FsZS5yYW5nZSgpXG4gICAgICAgICAgaW50ZXJ2YWwgPSAocmFuZ2VbMV0gLSByYW5nZVswXSkgLyBfZGF0YS5sZW5ndGhcbiAgICAgICAgICB2YWwgPSBtZS5zY2FsZSgpLmludmVydChtYXBwZWRWYWx1ZSAtIGludGVydmFsLzIpXG4gICAgICAgICAgYmlzZWN0ID0gZDMuYmlzZWN0b3IobWUudmFsdWUpLmxlZnRcblxuICAgICAgICBpZHggPSBiaXNlY3QoX2RhdGEsIHZhbClcbiAgICAgICAgaWR4ID0gaWYgaWR4IDwgMCB0aGVuIDAgZWxzZSBpZiBpZHggPj0gX2RhdGEubGVuZ3RoIHRoZW4gX2RhdGEubGVuZ3RoIC0gMSBlbHNlIGlkeFxuICAgICAgICByZXR1cm4gaWR4ICMgdGhlIGludmVyc2UgdmFsdWUgZG9lcyBub3QgbmVjZXNzYXJpbHkgY29ycmVzcG9uZCB0byBhIHZhbHVlIGluIHRoZSBkYXRhXG5cbiAgICAgIGlmIF8uaGFzKG1lLnNjYWxlKCksJ2ludmVydEV4dGVudCcpICMgZDMgc3VwcG9ydHMgdGhpcyBmb3IgcXVhbnRpemUsIHF1YW50aWxlLCB0aHJlc2hvbGQuIHJldHVybnMgdGhlIHJhbmdlIHRoYXQgZ2V0cyBtYXBwZWQgdG8gdGhlIHZhbHVlXG4gICAgICAgIHJldHVybiBtZS5zY2FsZSgpLmludmVydEV4dGVudChtYXBwZWRWYWx1ZSkgI1RPRE8gSG93IHNob3VsZCB0aGlzIGJlIG1hcHBlZCBjb3JyZWN0bHkuIFVzZSBjYXNlPz8/XG5cbiAgICAgICMgZDMgZG9lcyBub3Qgc3VwcG9ydCBpbnZlcnQgZm9yIG9yZGluYWwgc2NhbGVzLCB0aHVzIHRoaW5ncyBiZWNvbWUgYSBiaXQgbW9yZSB0cmlja3kuXG4gICAgICAjIGluIGNhc2Ugd2UgYXJlIHNldHRpbmcgdGhlIGRvbWFpbiBleHBsaWNpdGx5LCB3ZSBrbm93IHRoYSB0aGUgcmFuZ2UgdmFsdWVzIGFuZCB0aGUgZG9tYWluIGVsZW1lbnRzIGFyZSBpbiB0aGUgc2FtZSBvcmRlclxuICAgICAgIyBpbiBjYXNlIHRoZSBkb21haW4gaXMgc2V0ICdsYXp5JyAoaS5lLiBhcyB2YWx1ZXMgYXJlIHVzZWQpIHdlIGNhbm5vdCBtYXAgcmFuZ2UgYW5kIGRvbWFpbiB2YWx1ZXMgZWFzaWx5LiBOb3QgY2xlYXIgaG93IHRvIGRvIHRoaXMgZWZmZWN0aXZlbHlcblxuICAgICAgaWYgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBkb21haW4gPSBfc2NhbGUuZG9tYWluKClcbiAgICAgICAgcmFuZ2UgPSBfc2NhbGUucmFuZ2UoKVxuICAgICAgICBpZiBfaXNWZXJ0aWNhbFxuICAgICAgICAgIGludGVydmFsID0gcmFuZ2VbMF0gLSByYW5nZVsxXVxuICAgICAgICAgIGlkeCA9IHJhbmdlLmxlbmd0aCAtIE1hdGguZmxvb3IobWFwcGVkVmFsdWUgLyBpbnRlcnZhbCkgLSAxXG4gICAgICAgICAgaWYgaWR4IDwgMCB0aGVuIGlkeCA9IDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGludGVydmFsID0gcmFuZ2VbMV0gLSByYW5nZVswXVxuICAgICAgICAgIGlkeCA9IE1hdGguZmxvb3IobWFwcGVkVmFsdWUgLyBpbnRlcnZhbClcbiAgICAgICAgcmV0dXJuIGlkeFxuXG4gICAgbWUuaW52ZXJ0T3JkaW5hbCA9IChtYXBwZWRWYWx1ZSkgLT5cbiAgICAgIGlmIG1lLmlzT3JkaW5hbCgpIGFuZCBtZS5yZXNldE9uTmV3RGF0YSgpXG4gICAgICAgIGlkeCA9IG1lLmludmVydChtYXBwZWRWYWx1ZSlcbiAgICAgICAgcmV0dXJuIF9zY2FsZS5kb21haW4oKVtpZHhdXG5cblxuICAgICMtLS0gQXhpcyBBdHRyaWJ1dGVzIGFuZCBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5zaG93QXhpcyA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dBeGlzXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93QXhpcyA9IHRydWVGYWxzZVxuICAgICAgICBpZiB0cnVlRmFsc2VcbiAgICAgICAgICBfYXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgICAgICBpZiBtZS5zY2FsZVR5cGUoKSBpcyAndGltZSdcbiAgICAgICAgICAgIF9heGlzLnRpY2tGb3JtYXQoX3RpY2tGb3JtYXQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYXhpcyA9IHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmF4aXNPcmllbnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9heGlzT3JpZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9heGlzT3JpZW50T2xkID0gX2F4aXNPcmllbnRcbiAgICAgICAgX2F4aXNPcmllbnQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXNPcmllbnRPbGQgPSAodmFsKSAtPiAgI1RPRE8gVGhpcyBpcyBub3QgdGhlIGJlc3QgcGxhY2UgdG8ga2VlcCB0aGUgb2xkIGF4aXMgdmFsdWUuIE9ubHkgbmVlZGVkIGJ5IGNvbnRhaW5lciBpbiBjYXNlIHRoZSBheGlzIHBvc2l0aW9uIGNoYW5nZXNcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXhpc09yaWVudE9sZFxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc09yaWVudE9sZCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXhpcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2F4aXNcblxuICAgIG1lLnRpY2tzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja3NcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tzID0gdmFsXG4gICAgICAgIGlmIG1lLmF4aXMoKVxuICAgICAgICAgIG1lLmF4aXMoKS50aWNrcyhfdGlja3MpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50aWNrRm9ybWF0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja0Zvcm1hdFxuICAgICAgZWxzZVxuICAgICAgICBfdGlja0Zvcm1hdCA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja0Zvcm1hdCh2YWwpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50aWNrVmFsdWVzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja1ZhbHVlc1xuICAgICAgZWxzZVxuICAgICAgICBfdGlja1ZhbHVlcyA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja1ZhbHVlcyh2YWwpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc2hvd0xhYmVsID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0xhYmVsXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93TGFiZWwgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXNMYWJlbCA9ICh0ZXh0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBpZiBfYXhpc0xhYmVsIHRoZW4gX2F4aXNMYWJlbCBlbHNlIG1lLnByb3BlcnR5KClcbiAgICAgIGVsc2VcbiAgICAgICAgX2F4aXNMYWJlbCA9IHRleHRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5yb3RhdGVUaWNrTGFiZWxzID0gKG5icikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcm90YXRlVGlja0xhYmVsc1xuICAgICAgZWxzZVxuICAgICAgICBfcm90YXRlVGlja0xhYmVscyA9IG5iclxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmZvcm1hdCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX291dHB1dEZvcm1hdFN0cmluZ1xuICAgICAgZWxzZVxuICAgICAgICBpZiB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSBpZiBtZS5zY2FsZVR5cGUoKSBpcyAndGltZScgdGhlbiBmb3JtYXREZWZhdWx0cy5kYXRlIGVsc2UgZm9ybWF0RGVmYXVsdHMubnVtYmVyXG4gICAgICAgIF9vdXRwdXRGb3JtYXRGbiA9IGlmIG1lLnNjYWxlVHlwZSgpIGlzICd0aW1lJyB0aGVuIHdrQ2hhcnRMb2NhbGUudGltZUZvcm1hdChfb3V0cHV0Rm9ybWF0U3RyaW5nKSBlbHNlIHdrQ2hhcnRMb2NhbGUubnVtYmVyRm9ybWF0KF9vdXRwdXRGb3JtYXRTdHJpbmcpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nRlxuXG4gICAgbWUuc2hvd0dyaWQgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93R3JpZFxuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0dyaWQgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0gUmVnaXN0ZXIgZm9yIGRyYXdpbmcgbGlmZWN5Y2xlIGV2ZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUucmVnaXN0ZXIgPSAoKSAtPlxuICAgICAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5vbiBcInNjYWxlRG9tYWlucy4je21lLmlkKCl9XCIsIChkYXRhKSAtPlxuICAgICAgICAjIHNldCB0aGUgZG9tYWluIGlmIHJlcXVpcmVkXG4gICAgICAgIGlmIG1lLnJlc2V0T25OZXdEYXRhKClcbiAgICAgICAgICAjIGVuc3VyZSByb2J1c3QgYmVoYXZpb3IgaW4gY2FzZSBvZiBwcm9ibGVtYXRpYyBkZWZpbml0aW9uc1xuICAgICAgICAgIGRvbWFpbiA9IG1lLmdldERvbWFpbihkYXRhKVxuICAgICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ2xpbmVhcicgYW5kIF8uc29tZShkb21haW4sIGlzTmFOKVxuICAgICAgICAgICAgdGhyb3cgXCJTY2FsZSAje21lLmtpbmQoKX0sIFR5cGUgJyN7X3NjYWxlVHlwZX0nOiBjYW5ub3QgY29tcHV0ZSBkb21haW4gZm9yIHByb3BlcnR5ICcje19wcm9wZXJ0eX0nIC4gUG9zc2libGUgcmVhc29uczogcHJvcGVydHkgbm90IHNldCwgZGF0YSBub3QgY29tcGF0aWJsZSB3aXRoIGRlZmluZWQgdHlwZS4gRG9tYWluOiN7ZG9tYWlufVwiXG5cbiAgICAgICAgICBfc2NhbGUuZG9tYWluKGRvbWFpbilcblxuICAgICAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5vbiBcInByZXBhcmVEYXRhLiN7bWUuaWQoKX1cIiwgKGRhdGEpIC0+XG4gICAgICAgICMgY29tcHV0ZSB0aGUgZG9tYWluIHJhbmdlIGNhbGN1bGF0aW9uIGlmIHJlcXVpcmVkXG4gICAgICAgIGNhbGNSdWxlID0gIG1lLmRvbWFpbkNhbGMoKVxuICAgICAgICBpZiBtZS5wYXJlbnQoKS5zY2FsZVByb3BlcnRpZXNcbiAgICAgICAgICBtZS5sYXllckV4Y2x1ZGUobWUucGFyZW50KCkuc2NhbGVQcm9wZXJ0aWVzKCkpXG4gICAgICAgIGlmIGNhbGNSdWxlIGFuZCBjYWxjRG9tYWluW2NhbGNSdWxlXVxuICAgICAgICAgIF9jYWxjdWxhdGVkRG9tYWluID0gY2FsY0RvbWFpbltjYWxjUnVsZV0oZGF0YSlcblxuICAgIG1lLnVwZGF0ZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLnVwZGF0ZShub0FuaW1hdGlvbilcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUudXBkYXRlQXR0cnMgPSAoKSAtPlxuICAgICAgbWUucGFyZW50KCkubGlmZUN5Y2xlKCkudXBkYXRlQXR0cnMoKVxuXG4gICAgbWUuZHJhd0F4aXMgPSAoKSAtPlxuICAgICAgbWUucGFyZW50KCkubGlmZUN5Y2xlKCkuZHJhd0F4aXMoKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gc2NhbGUiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdzY2FsZUxpc3QnLCAoJGxvZykgLT5cbiAgcmV0dXJuIHNjYWxlTGlzdCA9ICgpIC0+XG4gICAgX2xpc3QgPSB7fVxuICAgIF9raW5kTGlzdCA9IHt9XG4gICAgX3BhcmVudExpc3QgPSB7fVxuICAgIF9vd25lciA9IHVuZGVmaW5lZFxuICAgIF9yZXF1aXJlZFNjYWxlcyA9IFtdXG4gICAgX2xheWVyU2NhbGUgPSB1bmRlZmluZWRcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLm93bmVyID0gKG93bmVyKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9vd25lclxuICAgICAgZWxzZVxuICAgICAgICBfb3duZXIgPSBvd25lclxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFkZCA9IChzY2FsZSkgLT5cbiAgICAgIGlmIF9saXN0W3NjYWxlLmlkKCldXG4gICAgICAgICRsb2cuZXJyb3IgXCJzY2FsZUxpc3QuYWRkOiBzY2FsZSAje3NjYWxlLmlkKCl9IGFscmVhZHkgZGVmaW5lZCBpbiBzY2FsZUxpc3Qgb2YgI3tfb3duZXIuaWQoKX0uIER1cGxpY2F0ZSBzY2FsZXMgYXJlIG5vdCBhbGxvd2VkXCJcbiAgICAgIF9saXN0W3NjYWxlLmlkKCldID0gc2NhbGVcbiAgICAgIF9raW5kTGlzdFtzY2FsZS5raW5kKCldID0gc2NhbGVcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuaGFzU2NhbGUgPSAoc2NhbGUpIC0+XG4gICAgICBzID0gbWUuZ2V0S2luZChzY2FsZS5raW5kKCkpXG4gICAgICByZXR1cm4gcy5pZCgpIGlzIHNjYWxlLmlkKClcblxuICAgIG1lLmdldEtpbmQgPSAoa2luZCkgLT5cbiAgICAgIGlmIF9raW5kTGlzdFtraW5kXSB0aGVuIF9raW5kTGlzdFtraW5kXSBlbHNlIGlmIF9wYXJlbnRMaXN0LmdldEtpbmQgdGhlbiBfcGFyZW50TGlzdC5nZXRLaW5kKGtpbmQpIGVsc2UgdW5kZWZpbmVkXG5cbiAgICBtZS5oYXNLaW5kID0gKGtpbmQpIC0+XG4gICAgICByZXR1cm4gISFtZS5nZXRLaW5kKGtpbmQpXG5cbiAgICBtZS5yZW1vdmUgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBub3QgX2xpc3Rbc2NhbGUuaWQoKV1cbiAgICAgICAgJGxvZy53YXJuIFwic2NhbGVMaXN0LmRlbGV0ZTogc2NhbGUgI3tzY2FsZS5pZCgpfSBub3QgZGVmaW5lZCBpbiBzY2FsZUxpc3Qgb2YgI3tfb3duZXIuaWQoKX0uIElnbm9yaW5nXCJcbiAgICAgICAgcmV0dXJuIG1lXG4gICAgICBkZWxldGUgX2xpc3Rbc2NhbGUuaWQoKV1cbiAgICAgIGRlbGV0ZSBtZVtzY2FsZS5pZF1cbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucGFyZW50U2NhbGVzID0gKHNjYWxlTGlzdCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcGFyZW50TGlzdFxuICAgICAgZWxzZVxuICAgICAgICBfcGFyZW50TGlzdCA9IHNjYWxlTGlzdFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmdldE93bmVkID0gKCkgLT5cbiAgICAgIF9saXN0XG5cbiAgICBtZS5hbGxLaW5kcyA9ICgpIC0+XG4gICAgICByZXQgPSB7fVxuICAgICAgaWYgX3BhcmVudExpc3QuYWxsS2luZHNcbiAgICAgICAgZm9yIGssIHMgb2YgX3BhcmVudExpc3QuYWxsS2luZHMoKVxuICAgICAgICAgIHJldFtrXSA9IHNcbiAgICAgIGZvciBrLHMgb2YgX2tpbmRMaXN0XG4gICAgICAgIHJldFtrXSA9IHNcbiAgICAgIHJldHVybiByZXRcblxuICAgIG1lLnJlcXVpcmVkU2NhbGVzID0gKHJlcSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcmVxdWlyZWRTY2FsZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3JlcXVpcmVkU2NhbGVzID0gcmVxXG4gICAgICAgIGZvciBrIGluIHJlcVxuICAgICAgICAgIGlmIG5vdCBtZS5oYXNLaW5kKGspXG4gICAgICAgICAgICB0aHJvdyBcIkZhdGFsIEVycm9yOiBzY2FsZSAnI3trfScgcmVxdWlyZWQgYnV0IG5vdCBkZWZpbmVkXCJcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZ2V0U2NhbGVzID0gKGtpbmRMaXN0KSAtPlxuICAgICAgbCA9IHt9XG4gICAgICBmb3Iga2luZCBpbiBraW5kTGlzdFxuICAgICAgICBpZiBtZS5oYXNLaW5kKGtpbmQpXG4gICAgICAgICAgbFtraW5kXSA9IG1lLmdldEtpbmQoa2luZClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IFwiRmF0YWwgRXJyb3I6IHNjYWxlICcje2tpbmR9JyByZXF1aXJlZCBidXQgbm90IGRlZmluZWRcIlxuICAgICAgcmV0dXJuIGxcblxuICAgIG1lLmdldFNjYWxlUHJvcGVydGllcyA9ICgpIC0+XG4gICAgICBsID0gW11cbiAgICAgIGZvciBrLHMgb2YgbWUuYWxsS2luZHMoKVxuICAgICAgICBwcm9wID0gcy5wcm9wZXJ0eSgpXG4gICAgICAgIGlmIHByb3BcbiAgICAgICAgICBpZiBBcnJheS5pc0FycmF5KHByb3ApXG4gICAgICAgICAgICBsLmNvbmNhdChwcm9wKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGwucHVzaChwcm9wKVxuICAgICAgcmV0dXJuIGxcblxuICAgIG1lLmxheWVyU2NhbGUgPSAoa2luZCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICBpZiBfbGF5ZXJTY2FsZVxuICAgICAgICAgIHJldHVybiBtZS5nZXRLaW5kKF9sYXllclNjYWxlKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllclNjYWxlID0ga2luZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykucHJvdmlkZXIgJ3drQ2hhcnRMb2NhbGUnLCAoKSAtPlxuXG4gIGxvY2FsZSA9ICdlbl9VUydcblxuICBsb2NhbGVzID0ge1xuXG4gICAgZGVfREU6ZDMubG9jYWxlKHtcbiAgICAgIGRlY2ltYWw6IFwiLFwiLFxuICAgICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICAgIGdyb3VwaW5nOiBbM10sXG4gICAgICBjdXJyZW5jeTogW1wiXCIsIFwiIOKCrFwiXSxcbiAgICAgIGRhdGVUaW1lOiBcIiVBLCBkZXIgJWUuICVCICVZLCAlWFwiLFxuICAgICAgZGF0ZTogXCIlZS4lbS4lWVwiLFxuICAgICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgICAgcGVyaW9kczogW1wiQU1cIiwgXCJQTVwiXSwgIyB1bnVzZWRcbiAgICAgIGRheXM6IFtcIlNvbm50YWdcIiwgXCJNb250YWdcIiwgXCJEaWVuc3RhZ1wiLCBcIk1pdHR3b2NoXCIsIFwiRG9ubmVyc3RhZ1wiLCBcIkZyZWl0YWdcIiwgXCJTYW1zdGFnXCJdLFxuICAgICAgc2hvcnREYXlzOiBbXCJTb1wiLCBcIk1vXCIsIFwiRGlcIiwgXCJNaVwiLCBcIkRvXCIsIFwiRnJcIiwgXCJTYVwiXSxcbiAgICAgIG1vbnRoczogW1wiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk3DpHJ6XCIsIFwiQXByaWxcIiwgXCJNYWlcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIixcbiAgICAgICAgICAgICAgIFwiTm92ZW1iZXJcIiwgXCJEZXplbWJlclwiXSxcbiAgICAgIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNcnpcIiwgXCJBcHJcIiwgXCJNYWlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPa3RcIiwgXCJOb3ZcIiwgXCJEZXpcIl1cbiAgICB9KSxcblxuICAgICdlbl9VUyc6IGQzLmxvY2FsZSh7XG4gICAgICBcImRlY2ltYWxcIjogXCIuXCIsXG4gICAgICBcInRob3VzYW5kc1wiOiBcIixcIixcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdLFxuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsIFwiXCJdLFxuICAgICAgXCJkYXRlVGltZVwiOiBcIiVhICViICVlICVYICVZXCIsXG4gICAgICBcImRhdGVcIjogXCIlbS8lZC8lWVwiLFxuICAgICAgXCJ0aW1lXCI6IFwiJUg6JU06JVNcIixcbiAgICAgIFwicGVyaW9kc1wiOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgICAgXCJkYXlzXCI6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICAgICAgXCJzaG9ydERheXNcIjogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdLFxuICAgICAgXCJtb250aHNcIjogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLFxuICAgICAgICAgICAgICAgICBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl0sXG4gICAgICBcInNob3J0TW9udGhzXCI6IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnNldExvY2FsZSA9IChsKSAtPlxuICAgIGlmIF8uaGFzKGxvY2FsZXMsIGwpXG4gICAgICBsb2NhbGUgPSBsXG4gICAgZWxzZVxuICAgICAgdGhyb3cgXCJ1bmtub3dtIGxvY2FsZSAnI3tsfScgdXNpbmcgJ2VuLVVTJyBpbnN0ZWFkXCJcblxuXG4gIHRoaXMuJGdldCA9IFsnJGxvZycsKCRsb2cpIC0+XG4gICAgcmV0dXJuIGxvY2FsZXNbbG9jYWxlXVxuICBdXG5cbiAgcmV0dXJuIHRoaXMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5wcm92aWRlciAnd2tDaGFydFNjYWxlcycsICgpIC0+XG5cbiAgX2N1c3RvbUNvbG9ycyA9IFsncmVkJywgJ2dyZWVuJywnYmx1ZScsJ3llbGxvdycsJ29yYW5nZSddXG5cbiAgaGFzaGVkID0gKCkgLT5cbiAgICBkM1NjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG5cbiAgICBfaGFzaEZuID0gKHZhbHVlKSAtPlxuICAgICAgaGFzaCA9IDA7XG4gICAgICBtID0gZDNTY2FsZS5yYW5nZSgpLmxlbmd0aCAtIDFcbiAgICAgIGZvciBpIGluIFswIC4uIHZhbHVlLmxlbmd0aF1cbiAgICAgICAgaGFzaCA9ICgzMSAqIGhhc2ggKyB2YWx1ZS5jaGFyQXQoaSkpICUgbTtcblxuICAgIG1lID0gKHZhbHVlKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBtZVxuICAgICAgZDNTY2FsZShfaGFzaEZuKHZhbHVlKSlcblxuICAgIG1lLnJhbmdlID0gKHJhbmdlKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBkM1NjYWxlLnJhbmdlKClcbiAgICAgIGQzU2NhbGUuZG9tYWluKGQzLnJhbmdlKHJhbmdlLmxlbmd0aCkpXG4gICAgICBkM1NjYWxlLnJhbmdlKHJhbmdlKVxuXG4gICAgbWUucmFuZ2VQb2ludCA9IGQzU2NhbGUucmFuZ2VQb2ludHNcbiAgICBtZS5yYW5nZUJhbmRzID0gZDNTY2FsZS5yYW5nZUJhbmRzXG4gICAgbWUucmFuZ2VSb3VuZEJhbmRzID0gZDNTY2FsZS5yYW5nZVJvdW5kQmFuZHNcbiAgICBtZS5yYW5nZUJhbmQgPSBkM1NjYWxlLnJhbmdlQmFuZFxuICAgIG1lLnJhbmdlRXh0ZW50ID0gZDNTY2FsZS5yYW5nZUV4dGVudFxuXG4gICAgbWUuaGFzaCA9IChmbikgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2hhc2hGblxuICAgICAgX2hhc2hGbiA9IGZuXG4gICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuXG4gIGNhdGVnb3J5Q29sb3JzID0gKCkgLT4gcmV0dXJuIGQzLnNjYWxlLm9yZGluYWwoKS5yYW5nZShfY3VzdG9tQ29sb3JzKVxuXG4gIGNhdGVnb3J5Q29sb3JzSGFzaGVkID0gKCkgLT4gcmV0dXJuIGhhc2hlZCgpLnJhbmdlKF9jdXN0b21Db2xvcnMpXG5cbiAgdGhpcy5jb2xvcnMgPSAoY29sb3JzKSAtPlxuICAgIF9jdXN0b21Db2xvcnMgPSBjb2xvcnNcblxuICB0aGlzLiRnZXQgPSBbJyRsb2cnLCgkbG9nKSAtPlxuICAgIHJldHVybiB7aGFzaGVkOmhhc2hlZCxjb2xvcnM6Y2F0ZWdvcnlDb2xvcnMsIGNvbG9yc0hhc2hlZDogY2F0ZWdvcnlDb2xvcnNIYXNoZWR9XG4gIF1cblxuICByZXR1cm4gdGhpcyIsIiMjIypcbiAgQG5nZG9jIGRpbWVuc2lvblxuICBAbmFtZSBjb2xvclxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBFXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRlc2NyaWJlcyBob3cgdGhlIGNoYXJ0IGRhdGEgaXMgdHJhbnNsYXRlZCBpbnRvIGNvbG9ycyBmb3IgY2hhcnQgb2JqZWN0c1xuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2xvcicsICgkbG9nLCBzY2FsZSwgbGVnZW5kLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydjb2xvcicsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZUNvbG9yJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIGwgPSB1bmRlZmluZWRcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdjb2xvcidcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnY2F0ZWdvcnkyMCcpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICdzY2FsZVV0aWxzJywgKCRsb2csIHdrQ2hhcnRTY2FsZXMsIHV0aWxzKSAtPlxuXG4gIHBhcnNlTGlzdCA9ICh2YWwpIC0+XG4gICAgaWYgdmFsXG4gICAgICBsID0gdmFsLnRyaW0oKS5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpLnNwbGl0KCcsJykubWFwKChkKSAtPiBkLnJlcGxhY2UoL15bXFxcInwnXXxbXFxcInwnXSQvZywgJycpKVxuICAgICAgbCA9IGwubWFwKChkKSAtPiBpZiBpc05hTihkKSB0aGVuIGQgZWxzZSArZClcbiAgICAgIHJldHVybiBpZiBsLmxlbmd0aCBpcyAxIHRoZW4gcmV0dXJuIGxbMF0gZWxzZSBsXG5cbiAgcmV0dXJuIHtcblxuICAgIG9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lKSAtPlxuICAgICAgIyMjKlxuICAgICAgICBAbmdkb2MgYXR0clxuICAgICAgICBAbmFtZSB0eXBlXG4gICAgICAgIEB1c2VkQnkgZGltZW5zaW9uXG4gICAgICAgIEBwYXJhbSB0eXBle2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0eXBlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgZDMuc2NhbGUuaGFzT3duUHJvcGVydHkodmFsKSBvciB2YWwgaXMgJ3RpbWUnIG9yIHdrQ2hhcnRTY2FsZXMuaGFzT3duUHJvcGVydHkodmFsKVxuICAgICAgICAgICAgbWUuc2NhbGVUeXBlKHZhbClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiB2YWwgaXNudCAnJ1xuICAgICAgICAgICAgICAjIyBubyBzY2FsZSBkZWZpbmVkLCB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgICAkbG9nLmVycm9yIFwiRXJyb3I6IGlsbGVnYWwgc2NhbGUgdmFsdWU6ICN7dmFsfS4gVXNpbmcgJ2xpbmVhcicgc2NhbGUgaW5zdGVhZFwiXG4gICAgICAgICAgbWUudXBkYXRlKClcblxuICAgICAgIyMjKlxuICAgICAgICBAbmdkb2MgYXR0clxuICAgICAgICBAbmFtZSBleHBvbmVudFxuICAgICAgICBAdXNlZEJ5IGRpbWVuc2lvblxuICAgICAgICBAcGFyYW0gZXhwb25lbnR7ZXhwcmVzc2lvbn1cbiAgICAgICMjI1xuICAgICAgYXR0cnMuJG9ic2VydmUgJ2V4cG9uZW50JywgKHZhbCkgLT5cbiAgICAgICAgaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3BvdycgYW5kIF8uaXNOdW1iZXIoK3ZhbClcbiAgICAgICAgIG1lLmV4cG9uZW50KCt2YWwpLnVwZGF0ZSgpXG5cbiAgICAgICMjIypcbiAgICAgICAgQG5nZG9jIGF0dHJcbiAgICAgICAgQG5hbWUgcHJvcGVydHlcbiAgICAgICAgQHVzZWRCeSBkaW1lbnNpb25cbiAgICAgICAgQHBhcmFtIHByb3BlcnR5e2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIG1lLnByb3BlcnR5KHBhcnNlTGlzdCh2YWwpKS51cGRhdGUoKVxuXG4gICAgICAjIyMqXG4gICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgIEBuYW1lIGxheWVyUHJvcGVydHlcbiAgICAgICAgQHVzZWRCeSBkaW1lbnNpb25cbiAgICAgICAgQHBhcmFtIGxheWVyUHJvcGVydHl7ZXhwcmVzc2lvbn1cbiAgICAgICMjI1xuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGF5ZXJQcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBtZS5sYXllclByb3BlcnR5KHZhbCkudXBkYXRlKClcblxuICAgICAgIyMjKlxuICAgICAgICBAbmdkb2MgYXR0clxuICAgICAgICBAbmFtZSByYW5nZVxuICAgICAgICBAdXNlZEJ5IGRpbWVuc2lvblxuICAgICAgICBAcGFyYW0gcmFuZ2V7ZXhwcmVzc2lvbn1cbiAgICAgICMjI1xuICAgICAgYXR0cnMuJG9ic2VydmUgJ3JhbmdlJywgKHZhbCkgLT5cbiAgICAgICByYW5nZSA9IHBhcnNlTGlzdCh2YWwpXG4gICAgICAgaWYgQXJyYXkuaXNBcnJheShyYW5nZSlcbiAgICAgICAgIG1lLnJhbmdlKHJhbmdlKS51cGRhdGUoKVxuXG4gICAgICAjIyMqXG4gICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgIEBuYW1lIGRhdGVGb3JtYXRcbiAgICAgICAgQHVzZWRCeSBkaW1lbnNpb25cbiAgICAgICAgQHBhcmFtIGRhdGVGb3JtYXR7ZXhwcmVzc2lvbn1cbiAgICAgICMjI1xuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RhdGVGb3JtYXQnLCAodmFsKSAtPlxuICAgICAgIGlmIHZhbFxuICAgICAgICAgaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnXG4gICAgICAgICAgIG1lLmRhdGFGb3JtYXQodmFsKS51cGRhdGUoKVxuXG4gICAgICAjIyMqXG4gICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgIEBuYW1lIGRvbWFpblxuICAgICAgICBAdXNlZEJ5IGRpbWVuc2lvblxuICAgICAgICBAcGFyYW0gZG9tYWlue2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkb21haW4nLCAodmFsKSAtPlxuICAgICAgIGlmIHZhbFxuICAgICAgICAgJGxvZy5pbmZvICdkb21haW4nLCB2YWxcbiAgICAgICAgIHBhcnNlZExpc3QgPSBwYXJzZUxpc3QodmFsKVxuICAgICAgICAgaWYgQXJyYXkuaXNBcnJheShwYXJzZWRMaXN0KVxuICAgICAgICAgICBtZS5kb21haW4ocGFyc2VkTGlzdCkudXBkYXRlKClcbiAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvZy5lcnJvciBcImRvbWFpbjogbXVzdCBiZSBhcnJheSwgb3IgY29tbWEtc2VwYXJhdGVkIGxpc3QsIGdvdFwiLCB2YWxcbiAgICAgICBlbHNlXG4gICAgICAgICAgIG1lLmRvbWFpbih1bmRlZmluZWQpLnVwZGF0ZSgpXG4gICAgICAjIyMqXG4gICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgIEBuYW1lIGRvbWFpblJhbmdlXG4gICAgICAgIEB1c2VkQnkgZGltZW5zaW9uXG4gICAgICAgIEBwYXJhbSBkb21haW5SYW5nZXtleHByZXNzaW9ufVxuICAgICAgIyMjXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZG9tYWluUmFuZ2UnLCAodmFsKSAtPlxuICAgICAgIGlmIHZhbFxuICAgICAgICAgbWUuZG9tYWluQ2FsYyh2YWwpLnVwZGF0ZSgpXG5cbiAgICAgICMjIypcbiAgICAgICAgQG5nZG9jIGF0dHJcbiAgICAgICAgQG5hbWUgbGFiZWxcbiAgICAgICAgQHVzZWRCeSBkaW1lbnNpb25cbiAgICAgICAgQHBhcmFtIGxhYmVse2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbCcsICh2YWwpIC0+XG4gICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICBtZS5heGlzTGFiZWwodmFsKS51cGRhdGVBdHRycygpXG5cbiAgICAgICMjIypcbiAgICAgICAgQG5nZG9jIGF0dHJcbiAgICAgICAgQG5hbWUgZm9ybWF0XG4gICAgICAgIEB1c2VkQnkgZGltZW5zaW9uXG4gICAgICAgIEBwYXJhbSBmb3JtYXR7ZXhwcmVzc2lvbn1cbiAgICAgICMjI1xuICAgICAgYXR0cnMuJG9ic2VydmUgJ2Zvcm1hdCcsICh2YWwpIC0+XG4gICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICBtZS5mb3JtYXQodmFsKVxuXG4gICAgICAjIyMqXG4gICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgIEBuYW1lIHJlc2V0XG4gICAgICAgIEB1c2VkQnkgZGltZW5zaW9uXG4gICAgICAgIEBwYXJhbSByZXNldHtleHByZXNzaW9ufVxuICAgICAgIyMjXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncmVzZXQnLCAodmFsKSAtPlxuICAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHV0aWxzLnBhcnNlVHJ1ZUZhbHNlKHZhbCkpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIG9ic2VydmVBeGlzQXR0cmlidXRlczogKGF0dHJzLCBtZSwgc2NvcGUpIC0+XG5cbiAgICAgICMjIypcbiAgICAgICAgICBAbmdkb2MgYXR0clxuICAgICAgICAgIEBuYW1lIHRpY2tGb3JtYXRcbiAgICAgICAgICBAdXNlZEJ5IGRpbWVuc2lvbi54LCBkaW1lbnNpb24ueSwgZGltZW5zaW9uLnJhbmdlWCwgZGltZW5zaW9uLnJhbmdlWVxuICAgICAgICAgIEBwYXJhbSB0aWNrRm9ybWF0IHtleHByZXNzaW9ufVxuICAgICAgIyMjXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndGlja0Zvcm1hdCcsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgbWUudGlja0Zvcm1hdChkMy5mb3JtYXQodmFsKSkudXBkYXRlKClcblxuICAgICAgIyMjKlxuICAgICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgICAgQG5hbWUgdGlja3NcbiAgICAgICAgICBAdXNlZEJ5IGRpbWVuc2lvbi54LCBkaW1lbnNpb24ueSwgZGltZW5zaW9uLnJhbmdlWCwgZGltZW5zaW9uLnJhbmdlWVxuICAgICAgICAgIEBwYXJhbSB0aWNrcyB7ZXhwcmVzc2lvbn1cbiAgICAgICMjI1xuICAgICAgYXR0cnMuJG9ic2VydmUgJ3RpY2tzJywgKHZhbCkgLT5cbiAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICBtZS50aWNrcygrdmFsKVxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS51cGRhdGVBdHRycygpXG5cbiAgICAgICMjIypcbiAgICAgICAgICBAbmdkb2MgYXR0clxuICAgICAgICAgIEBuYW1lIGdyaWRcbiAgICAgICAgICBAdXNlZEJ5IGRpbWVuc2lvbi54LCBkaW1lbnNpb24ueSwgZGltZW5zaW9uLnJhbmdlWCwgZGltZW5zaW9uLnJhbmdlWVxuICAgICAgICAgIEBwYXJhbSBncmlkIHtleHByZXNzaW9ufVxuICAgICAgIyMjXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZ3JpZCcsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgbWUuc2hvd0dyaWQodmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScpLnVwZGF0ZUF0dHJzKClcblxuICAgICAgIyMjKlxuICAgICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgICAgQG5hbWUgc2hvd0xhYmVsXG4gICAgICAgICAgQHVzZWRCeSBkaW1lbnNpb24ueCwgZGltZW5zaW9uLnksIGRpbWVuc2lvbi5yYW5nZVgsIGRpbWVuc2lvbi5yYW5nZVlcbiAgICAgICAgICBAcGFyYW0gc2hvd0xhYmVsIHtleHByZXNzaW9ufVxuICAgICAgIyMjXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnc2hvd0xhYmVsJywgKHZhbCkgLT5cbiAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICBtZS5zaG93TGFiZWwodmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScpLnVwZGF0ZSh0cnVlKVxuXG4gICAgICAjIyMqXG4gICAgICAgICAgQG5nZG9jIGF0dHJcbiAgICAgICAgICBAbmFtZSBheGlzRm9ybWF0dGVyc1xuICAgICAgICAgIEB1c2VkQnkgZGltZW5zaW9uLngsIGRpbWVuc2lvbi55LCBkaW1lbnNpb24ucmFuZ2VYLCBkaW1lbnNpb24ucmFuZ2VZXG4gICAgICAgICAgQHBhcmFtIGF4aXNGb3JtYXR0ZXJzIHtleHByZXNzaW9ufVxuICAgICAgIyMjXG4gICAgICBzY29wZS4kd2F0Y2ggYXR0cnMuYXhpc0Zvcm1hdHRlcnMsICAodmFsKSAtPlxuICAgICAgaWYgXy5pc09iamVjdCh2YWwpXG4gICAgICAgIGlmIF8uaGFzKHZhbCwgJ3RpY2tGb3JtYXQnKSBhbmQgXy5pc0Z1bmN0aW9uKHZhbC50aWNrRm9ybWF0KVxuICAgICAgICAgIG1lLnRpY2tGb3JtYXQodmFsLnRpY2tGb3JtYXQpXG4gICAgICAgIGVsc2UgaWYgXy5pc1N0cmluZyh2YWwudGlja0Zvcm1hdClcbiAgICAgICAgICBtZS50aWNrRm9ybWF0KGQzLmZvcm1hdCh2YWwpKVxuICAgICAgICBpZiBfLmhhcyh2YWwsJ3RpY2tWYWx1ZXMnKSBhbmQgXy5pc0FycmF5KHZhbC50aWNrVmFsdWVzKVxuICAgICAgICAgIG1lLnRpY2tWYWx1ZXModmFsLnRpY2tWYWx1ZXMpXG4gICAgICAgIG1lLnVwZGF0ZSgpXG5cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBvYnNlcnZlTGVnZW5kQXR0cmlidXRlczogKGF0dHJzLCBtZSwgbGF5b3V0KSAtPlxuXG4gICAgICAjIyMqXG4gICAgICAgICAgQG5nZG9jIGF0dHJcbiAgICAgICAgICBAbmFtZSBsZWdlbmRcbiAgICAgICAgICBAdXNlZEJ5IGRpbWVuc2lvblxuICAgICAgICAgIEBwYXJhbSBsZWdlbmQge2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsZWdlbmQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBsID0gbWUubGVnZW5kKClcbiAgICAgICAgICBsLnNob3dWYWx1ZXMoZmFsc2UpXG4gICAgICAgICAgc3dpdGNoIHZhbFxuICAgICAgICAgICAgd2hlbiAnZmFsc2UnXG4gICAgICAgICAgICAgIGwuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgIHdoZW4gJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24odmFsKS5kaXYodW5kZWZpbmVkKS5zaG93KHRydWUpXG4gICAgICAgICAgICB3aGVuICd0cnVlJywgJydcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbigndG9wLXJpZ2h0Jykuc2hvdyh0cnVlKS5kaXYodW5kZWZpbmVkKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsZWdlbmREaXYgPSBkMy5zZWxlY3QodmFsKVxuICAgICAgICAgICAgICBpZiBsZWdlbmREaXYuZW1wdHkoKVxuICAgICAgICAgICAgICAgICRsb2cud2FybiAnbGVnZW5kIHJlZmVyZW5jZSBkb2VzIG5vdCBleGlzdDonLCB2YWxcbiAgICAgICAgICAgICAgICBsLmRpdih1bmRlZmluZWQpLnNob3coZmFsc2UpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsLmRpdihsZWdlbmREaXYpLnBvc2l0aW9uKCd0b3AtbGVmdCcpLnNob3codHJ1ZSlcblxuICAgICAgICAgIGwuc2NhbGUobWUpLmxheW91dChsYXlvdXQpXG4gICAgICAgICAgaWYgbWUucGFyZW50KClcbiAgICAgICAgICAgIGwucmVnaXN0ZXIobWUucGFyZW50KCkpXG4gICAgICAgICAgbC5yZWRyYXcoKVxuXG4gICAgICAjIyMqXG4gICAgICAgICAgQG5nZG9jIGF0dHJcbiAgICAgICAgICBAbmFtZSB2YWx1ZXNMZWdlbmRcbiAgICAgICAgICBAdXNlZEJ5IGRpbWVuc2lvblxuICAgICAgICAgIEBwYXJhbSB2YWx1ZXNMZWdlbmQge2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICd2YWx1ZXNMZWdlbmQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBsID0gbWUubGVnZW5kKClcbiAgICAgICAgICBsLnNob3dWYWx1ZXModHJ1ZSlcbiAgICAgICAgICBzd2l0Y2ggdmFsXG4gICAgICAgICAgICB3aGVuICdmYWxzZSdcbiAgICAgICAgICAgICAgbC5zaG93KGZhbHNlKVxuICAgICAgICAgICAgd2hlbiAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCdcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbih2YWwpLmRpdih1bmRlZmluZWQpLnNob3codHJ1ZSlcbiAgICAgICAgICAgIHdoZW4gJ3RydWUnLCAnJ1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKCd0b3AtcmlnaHQnKS5zaG93KHRydWUpLmRpdih1bmRlZmluZWQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGxlZ2VuZERpdiA9IGQzLnNlbGVjdCh2YWwpXG4gICAgICAgICAgICAgIGlmIGxlZ2VuZERpdi5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJGxvZy53YXJuICdsZWdlbmQgcmVmZXJlbmNlIGRvZXMgbm90IGV4aXN0OicsIHZhbFxuICAgICAgICAgICAgICAgIGwuZGl2KHVuZGVmaW5lZCkuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGwuZGl2KGxlZ2VuZERpdikucG9zaXRpb24oJ3RvcC1sZWZ0Jykuc2hvdyh0cnVlKVxuXG4gICAgICAgICAgbC5zY2FsZShtZSkubGF5b3V0KGxheW91dClcbiAgICAgICAgICBpZiBtZS5wYXJlbnQoKVxuICAgICAgICAgICAgbC5yZWdpc3RlcihtZS5wYXJlbnQoKSlcbiAgICAgICAgICBsLnJlZHJhdygpXG5cbiAgICAgICMjIypcbiAgICAgICAgICBAbmdkb2MgYXR0clxuICAgICAgICAgIEBuYW1lIGxlZ2VuZFRpdGxlXG4gICAgICAgICAgQHVzZWRCeSBkaW1lbnNpb25cbiAgICAgICAgICBAcGFyYW0gbGVnZW5kVGl0bGUge2V4cHJlc3Npb259XG4gICAgICAjIyNcbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsZWdlbmRUaXRsZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmxlZ2VuZCgpLnRpdGxlKHZhbCkucmVkcmF3KClcblxuICAgICMtLS0gT2JzZXJ2ZSBSYW5nZSBhdHRyaWJ1dGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBvYnNlcnZlclJhbmdlQXR0cmlidXRlczogKGF0dHJzLCBtZSkgLT5cblxuICAgICAgIyMjKlxuICAgICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgICAgQG5hbWUgbG93ZXJQcm9wZXJ0eVxuICAgICAgICAgIEB1c2VkQnkgZGltZW5zaW9uLnJhbmdlWCwgZGltZW5zaW9uLnJhbmdlWVxuICAgICAgICAgIEBwYXJhbSBsb3dlclByb3BlcnR5IHtleHByZXNzaW9ufVxuICAgICAgIyMjXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbG93ZXJQcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIG51bGxcbiAgICAgICAgbWUubG93ZXJQcm9wZXJ0eShwYXJzZUxpc3QodmFsKSkudXBkYXRlKClcblxuICAgICAgIyMjKlxuICAgICAgICAgIEBuZ2RvYyBhdHRyXG4gICAgICAgICAgQG5hbWUgdXBwZXJQcm9wZXJ0eVxuICAgICAgICAgIEB1c2VkQnkgZGltZW5zaW9uLnJhbmdlWCwgZGltZW5zaW9uLnJhbmdlWVxuICAgICAgICAgIEBwYXJhbSB1cHBlclByb3BlcnR5IHtleHByZXNzaW9ufVxuICAgICAgIyMjXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndXBwZXJQcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIG51bGxcbiAgICAgICAgbWUudXBwZXJQcm9wZXJ0eShwYXJzZUxpc3QodmFsKSkudXBkYXRlKClcblxuICAgIH1cblxuIiwiIyMjKlxuICBAbmdkb2MgZGltZW5zaW9uXG4gIEBuYW1lIHNoYXBlXG4gIEBtb2R1bGUgd2suY2hhcnRcbiAgQHJlc3RyaWN0IEVcbiAgQGRlc2NyaXB0aW9uXG5cbiAgZGVzY3JpYmVzIGhvdyB0aGUgY2hhcnQgZGF0YSBpcyB0cmFuc2xhdGVkIGludG8gc2hhcGUgb2JqZWN0cyBpbiB0ZWggY2hhcnRcblxuXG4jIyNcblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzaGFwZScsICgkbG9nLCBzY2FsZSwgZDNTaGFwZXMsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3NoYXBlJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlU2l6ZSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnc2hhcGUnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgbWUuc2NhbGUoKS5yYW5nZShkM1NoYXBlcylcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gIH0iLCIjIyMqXG4gIEBuZ2RvYyBkaW1lbnNpb25cbiAgQG5hbWUgc2l6ZVxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBFXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRlc2NyaWJlcyBob3cgdGhlIGNoYXJ0IGRhdGEgaXMgdHJhbnNsYXRlZCBpbnRvIHRoZSBzaXplIG9mIGNoYXJ0IG9iamVjdHNcblxuXG4jIyNcblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzaXplJywgKCRsb2csIHNjYWxlLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydzaXplJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlU2l6ZSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnc2l6ZSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICB9IiwiIyMjKlxuICBAbmdkb2MgZGltZW5zaW9uXG4gIEBuYW1lIHhcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgRVxuICBAZGVzY3JpcHRpb25cblxuICBUaGlzIGRpbWVuc2lvbiBkZWZpbmVkIHRoZSBob3Jpem9udGFsIGF4aXMgb2YgdGhlIGNoYXJ0XG5cbiAgQHBhcmFtIHtzdHJpbmd9IGF4aXNcbiAgRGVmaW5lIGlmIGEgaG9yaXpvbnRhbCBheGlzIHNob3VsZCBiZSBkaXNwbGF5ZWQgUG9zc2libGUgdmFsdWVzOlxuXG4jIyNcbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAneCcsICgkbG9nLCBzY2FsZSwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsneCcsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWCdcbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpICMgZm9yIEFuZ3VsYXIgMS4zXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3gnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2xpbmVhcicpXG4gICAgICBtZS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgbWUuaXNIb3Jpem9udGFsKHRydWUpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdheGlzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgICAgaWYgdmFsIGluIFsndG9wJywgJ2JvdHRvbSddXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQodmFsKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KCdib3R0b20nKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLnNob3dBeGlzKGZhbHNlKS5heGlzT3JpZW50KHVuZGVmaW5lZClcbiAgICAgICAgICBtZS51cGRhdGUodHJ1ZSlcblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlQXhpc0F0dHJpYnV0ZXMoYXR0cnMsIG1lLCBzY29wZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdyb3RhdGVUaWNrTGFiZWxzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCBfLmlzTnVtYmVyKCt2YWwpXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscygrdmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscyh1bmRlZmluZWQpXG4gICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuICB9IiwiIyMjKlxuICBAbmdkb2MgZGltZW5zaW9uXG4gIEBuYW1lIHJhbmdlWFxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBFXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRlc2NyaWJlcyBob3cgdGhlIGNoYXJ0IGRhdGEgaXMgdHJhbnNsYXRlZCBpbnRvIGhvcml6b250YWwgcmFuZ2VzIGZvciB0aGUgY2hhcnQgb2JqZWN0c1xuXG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdyYW5nZVgnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3JhbmdlWCcsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWCdcbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpICMgZm9yIEFuZ3VsYXIgMS4zXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3JhbmdlWCdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBtZS5pc0hvcml6b250YWwodHJ1ZSlcbiAgICAgIG1lLnJlZ2lzdGVyKClcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2F4aXMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgICBpZiB2YWwgaW4gWyd0b3AnLCAnYm90dG9tJ11cbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCh2YWwpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQoJ2JvdHRvbScpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUsIHNjb3BlKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZXJSYW5nZUF0dHJpYnV0ZXMoYXR0cnMsbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdyb3RhdGVUaWNrTGFiZWxzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCBfLmlzTnVtYmVyKCt2YWwpXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscygrdmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscyh1bmRlZmluZWQpXG4gICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuICB9IiwiIyMjKlxuICBAbmdkb2MgZGltZW5zaW9uXG4gIEBuYW1lIHlcbiAgQG1vZHVsZSB3ay5jaGFydFxuICBAcmVzdHJpY3QgRVxuICBAZGVzY3JpcHRpb25cblxuICBUaGlzIGRpbWVuc2lvbiBkZWZpbmVkIHRoZSB2ZXJ0aWNhbCBheGlzIG9mIHRoZSBjaGFydFxuXG4gIEBwYXJhbSB7c3RyaW5nfSBheGlzXG4gIERlZmluZSBpZiBhIHZlcnRpY2FsIGF4aXMgc2hvdWxkIGJlIGRpc3BsYXllZCBQb3NzaWJsZSB2YWx1ZXM6XG5cbiMjI1xuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICd5JywgKCRsb2csIHNjYWxlLCBsZWdlbmQsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3knLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVZJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICd5J1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUuaXNWZXJ0aWNhbCh0cnVlKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdheGlzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgICAgaWYgdmFsIGluIFsnbGVmdCcsICdyaWdodCddXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQodmFsKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KCdsZWZ0Jykuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5zaG93QXhpcyhmYWxzZSkuYXhpc09yaWVudCh1bmRlZmluZWQpXG4gICAgICAgICAgbWUudXBkYXRlKHRydWUpXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgc2NvcGUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICB9IiwiIyMjKlxuICBAbmdkb2MgZGltZW5zaW9uXG4gIEBuYW1lIHJhbmdlWVxuICBAbW9kdWxlIHdrLmNoYXJ0XG4gIEByZXN0cmljdCBFXG4gIEBkZXNjcmlwdGlvblxuXG4gIGRlc2NyaWJlcyBob3cgdGhlIGNoYXJ0IGRhdGEgaXMgdHJhbnNsYXRlZCBpbnRvIHZlcnRpY2FsIHJhbmdlcyBmb3IgdGhlIGNoYXJ0IG9iamVjdHNcblxuXG4jIyNcbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncmFuZ2VZJywgKCRsb2csIHNjYWxlLCBsZWdlbmQsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3JhbmdlWScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVknXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3JhbmdlWSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLmlzVmVydGljYWwodHJ1ZSlcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnbGVmdCcpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUsIHNjb3BlKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZXJSYW5nZUF0dHJpYnV0ZXMoYXR0cnMsbWUpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICdzZWxlY3Rpb25TaGFyaW5nJywgKCRsb2cpIC0+XG4gIF9zZWxlY3Rpb24gPSB7fVxuICBfc2VsZWN0aW9uSWR4UmFuZ2UgPSB7fVxuICBjYWxsYmFja3MgPSB7fVxuXG4gIHRoaXMuY3JlYXRlR3JvdXAgPSAoZ3JvdXApIC0+XG5cblxuICB0aGlzLnNldFNlbGVjdGlvbiA9IChzZWxlY3Rpb24sIHNlbGVjdGlvbklkeFJhbmdlLCBncm91cCkgLT5cbiAgICBpZiBncm91cFxuICAgICAgX3NlbGVjdGlvbltncm91cF0gPSBzZWxlY3Rpb25cbiAgICAgIF9zZWxlY3Rpb25JZHhSYW5nZVtncm91cF0gPSBzZWxlY3Rpb25JZHhSYW5nZVxuICAgICAgaWYgY2FsbGJhY2tzW2dyb3VwXVxuICAgICAgICBmb3IgY2IgaW4gY2FsbGJhY2tzW2dyb3VwXVxuICAgICAgICAgIGNiKHNlbGVjdGlvbiwgc2VsZWN0aW9uSWR4UmFuZ2UpXG5cbiAgdGhpcy5nZXRTZWxlY3Rpb24gPSAoZ3JvdXApIC0+XG4gICAgZ3JwID0gZ3JvdXAgb3IgJ2RlZmF1bHQnXG4gICAgcmV0dXJuIHNlbGVjdGlvbltncnBdXG5cbiAgdGhpcy5yZWdpc3RlciA9IChncm91cCwgY2FsbGJhY2spIC0+XG4gICAgaWYgZ3JvdXBcbiAgICAgIGlmIG5vdCBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgIGNhbGxiYWNrc1tncm91cF0gPSBbXVxuICAgICAgI2Vuc3VyZSB0aGF0IGNhbGxiYWNrcyBhcmUgbm90IHJlZ2lzdGVyZWQgbW9yZSB0aGFuIG9uY2VcbiAgICAgIGlmIG5vdCBfLmNvbnRhaW5zKGNhbGxiYWNrc1tncm91cF0sIGNhbGxiYWNrKVxuICAgICAgICBjYWxsYmFja3NbZ3JvdXBdLnB1c2goY2FsbGJhY2spXG5cbiAgdGhpcy51bnJlZ2lzdGVyID0gKGdyb3VwLCBjYWxsYmFjaykgLT5cbiAgICBpZiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICBpZHggPSBjYWxsYmFja3NbZ3JvdXBdLmluZGV4T2YgY2FsbGJhY2tcbiAgICAgIGlmIGlkeCA+PSAwXG4gICAgICAgIGNhbGxiYWNrc1tncm91cF0uc3BsaWNlKGlkeCwgMSlcblxuICByZXR1cm4gdGhpc1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICd0aW1pbmcnLCAoJGxvZykgLT5cblxuICB0aW1lcnMgPSB7fVxuICBlbGFwc2VkU3RhcnQgPSAwXG4gIGVsYXBzZWQgPSAwXG5cbiAgdGhpcy5pbml0ID0gKCkgLT5cbiAgICBlbGFwc2VkU3RhcnQgPSBEYXRlLm5vdygpXG5cbiAgdGhpcy5zdGFydCA9ICh0b3BpYykgLT5cbiAgICB0b3AgPSB0aW1lcnNbdG9waWNdXG4gICAgaWYgbm90IHRvcFxuICAgICAgdG9wID0gdGltZXJzW3RvcGljXSA9IHtuYW1lOnRvcGljLCBzdGFydDowLCB0b3RhbDowLCBjYWxsQ250OjAsIGFjdGl2ZTogZmFsc2V9XG4gICAgdG9wLnN0YXJ0ID0gRGF0ZS5ub3coKVxuICAgIHRvcC5hY3RpdmUgPSB0cnVlXG5cbiAgdGhpcy5zdG9wID0gKHRvcGljKSAtPlxuICAgIGlmIHRvcCA9IHRpbWVyc1t0b3BpY11cbiAgICAgIHRvcC5hY3RpdmUgPSBmYWxzZVxuICAgICAgdG9wLnRvdGFsICs9IERhdGUubm93KCkgLSB0b3Auc3RhcnRcbiAgICAgIHRvcC5jYWxsQ250ICs9IDFcbiAgICBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIGVsYXBzZWRTdGFydFxuXG4gIHRoaXMucmVwb3J0ID0gKCkgLT5cbiAgICBmb3IgdG9waWMsIHZhbCBvZiB0aW1lcnNcbiAgICAgIHZhbC5hdmcgPSB2YWwudG90YWwgLyB2YWwuY2FsbENudFxuICAgICRsb2cuaW5mbyB0aW1lcnNcbiAgICAkbG9nLmluZm8gJ0VsYXBzZWQgVGltZSAobXMpJywgZWxhcHNlZFxuICAgIHJldHVybiB0aW1lcnNcblxuICB0aGlzLmNsZWFyID0gKCkgLT5cbiAgICB0aW1lcnMgPSB7fVxuXG4gIHJldHVybiB0aGlzIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnbGF5ZXJlZERhdGEnLCAoJGxvZykgLT5cblxuICBsYXllcmVkID0gKCkgLT5cbiAgICBfZGF0YSA9IFtdXG4gICAgX2xheWVyS2V5cyA9IFtdXG4gICAgX3ggPSB1bmRlZmluZWRcbiAgICBfY2FsY1RvdGFsID0gZmFsc2VcbiAgICBfbWluID0gSW5maW5pdHlcbiAgICBfbWF4ID0gLUluZmluaXR5XG4gICAgX3RNaW4gPSBJbmZpbml0eVxuICAgIF90TWF4ID0gLUluZmluaXR5XG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBtZS5kYXRhID0gKGRhdCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggSXMgMFxuICAgICAgICByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSBkYXRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllcktleXMgPSAoa2V5cykgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX2xheWVyS2V5c1xuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJLZXlzID0ga2V5c1xuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnggPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX3hcbiAgICAgIGVsc2VcbiAgICAgICAgX3ggPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuY2FsY1RvdGFsID0gKHRfZikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX2NhbGNUb3RhbFxuICAgICAgZWxzZVxuICAgICAgICBfY2FsY1RvdGFsID0gdF9mXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubWluID0gKCkgLT5cbiAgICAgIF9taW5cblxuICAgIG1lLm1heCA9ICgpIC0+XG4gICAgICBfbWF4XG5cbiAgICBtZS5taW5Ub3RhbCA9ICgpIC0+XG4gICAgICBfdE1pblxuXG4gICAgbWUubWF4VG90YWwgPSAoKSAtPlxuICAgICAgX3RNYXhcblxuICAgIG1lLmV4dGVudCA9ICgpIC0+XG4gICAgICBbbWUubWluKCksIG1lLm1heCgpXVxuXG4gICAgbWUudG90YWxFeHRlbnQgPSAoKSAtPlxuICAgICAgW21lLm1pblRvdGFsKCksIG1lLm1heFRvdGFsKCldXG5cbiAgICBtZS5jb2x1bW5zID0gKGRhdGEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcbiAgICAgICAgI19sYXllcktleXMubWFwKChrKSAtPiB7a2V5OmssIHZhbHVlczpkYXRhLm1hcCgoZCkgLT4ge3g6IGRbX3hdLCB2YWx1ZTogZFtrXSwgZGF0YTogZH0gKX0pXG4gICAgICAgIHJlcyA9IFtdXG4gICAgICAgIF9taW4gPSBJbmZpbml0eVxuICAgICAgICBfbWF4ID0gLUluZmluaXR5XG4gICAgICAgIF90TWluID0gSW5maW5pdHlcbiAgICAgICAgX3RNYXggPSAtSW5maW5pdHlcblxuICAgICAgICBmb3IgaywgaSBpbiBfbGF5ZXJLZXlzXG4gICAgICAgICAgcmVzW2ldID0ge2tleTprLCB2YWx1ZTpbXSwgbWluOkluZmluaXR5LCBtYXg6LUluZmluaXR5fVxuICAgICAgICBmb3IgZCwgaSBpbiBkYXRhXG4gICAgICAgICAgdCA9IDBcbiAgICAgICAgICB4diA9IGlmIHR5cGVvZiBfeCBpcyAnc3RyaW5nJyB0aGVuIGRbX3hdIGVsc2UgX3goZClcblxuICAgICAgICAgIGZvciBsIGluIHJlc1xuICAgICAgICAgICAgdiA9ICtkW2wua2V5XVxuICAgICAgICAgICAgbC52YWx1ZS5wdXNoIHt4Onh2LCB2YWx1ZTogdiwga2V5Omwua2V5fVxuICAgICAgICAgICAgaWYgbC5tYXggPCB2IHRoZW4gbC5tYXggPSB2XG4gICAgICAgICAgICBpZiBsLm1pbiA+IHYgdGhlbiBsLm1pbiA9IHZcbiAgICAgICAgICAgIGlmIF9tYXggPCB2IHRoZW4gX21heCA9IHZcbiAgICAgICAgICAgIGlmIF9taW4gPiB2IHRoZW4gX21pbiA9IHZcbiAgICAgICAgICAgIGlmIF9jYWxjVG90YWwgdGhlbiB0ICs9ICt2XG4gICAgICAgICAgaWYgX2NhbGNUb3RhbFxuICAgICAgICAgICAgI3RvdGFsLnZhbHVlLnB1c2gge3g6ZFtfeF0sIHZhbHVlOnQsIGtleTp0b3RhbC5rZXl9XG4gICAgICAgICAgICBpZiBfdE1heCA8IHQgdGhlbiBfdE1heCA9IHRcbiAgICAgICAgICAgIGlmIF90TWluID4gdCB0aGVuIF90TWluID0gdFxuICAgICAgICByZXR1cm4ge21pbjpfbWluLCBtYXg6X21heCwgdG90YWxNaW46X3RNaW4sdG90YWxNYXg6X3RNYXgsIGRhdGE6cmVzfVxuICAgICAgcmV0dXJuIG1lXG5cblxuXG4gICAgbWUucm93cyA9IChkYXRhKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxXG4gICAgICAgIHJldHVybiBkYXRhLm1hcCgoZCkgLT4ge3g6IGRbX3hdLCBsYXllcnM6IGxheWVyS2V5cy5tYXAoKGspIC0+IHtrZXk6aywgdmFsdWU6IGRba10sIHg6ZFtfeF19KX0pXG4gICAgICByZXR1cm4gbWVcblxuXG4gICAgcmV0dXJuIG1lIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzdmdJY29uJywgKCRsb2cpIC0+XG4gICMjIGluc2VydCBzdmcgcGF0aCBpbnRvIGludGVycG9sYXRlZCBIVE1MLiBSZXF1aXJlZCBwcmV2ZW50IEFuZ3VsYXIgZnJvbSB0aHJvd2luZyBlcnJvciAoRml4IDIyKVxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICB0ZW1wbGF0ZTogJzxzdmcgbmctc3R5bGU9XCJzdHlsZVwiPjxwYXRoPjwvcGF0aD48L3N2Zz4nXG4gICAgc2NvcGU6XG4gICAgICBwYXRoOiBcIj1cIlxuICAgICAgd2lkdGg6IFwiQFwiXG4gICAgbGluazogKHNjb3BlLCBlbGVtLCBhdHRycyApIC0+XG4gICAgICBzY29wZS5zdHlsZSA9IHsgICMgZml4IElFIHByb2JsZW0gd2l0aCBpbnRlcnBvbGF0aW5nIHN0eWxlIHZhbHVlc1xuICAgICAgICBoZWlnaHQ6ICcyMHB4J1xuICAgICAgICB3aWR0aDogc2NvcGUud2lkdGggKyAncHgnXG4gICAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICdtaWRkbGUnXG4gICAgICB9XG4gICAgICBzY29wZS4kd2F0Y2ggJ3BhdGgnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBkMy5zZWxlY3QoZWxlbVswXSkuc2VsZWN0KCdwYXRoJykuYXR0cignZCcsIHZhbCkuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoOCw4KVwiKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAndXRpbHMnLCAoJGxvZykgLT5cblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgQGRpZmYgPSAoYSxiLGRpcmVjdGlvbikgLT5cbiAgICBub3RJbkIgPSAodikgLT5cbiAgICAgIGIuaW5kZXhPZih2KSA8IDBcblxuICAgIHJlcyA9IHt9XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgYS5sZW5ndGhcbiAgICAgIGlmIG5vdEluQihhW2ldKVxuICAgICAgICByZXNbYVtpXV0gPSB1bmRlZmluZWRcbiAgICAgICAgaiA9IGkgKyBkaXJlY3Rpb25cbiAgICAgICAgd2hpbGUgMCA8PSBqIDwgYS5sZW5ndGhcbiAgICAgICAgICBpZiBub3RJbkIoYVtqXSlcbiAgICAgICAgICAgIGogKz0gZGlyZWN0aW9uXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzW2FbaV1dID0gIGFbal1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICBpKytcbiAgICByZXR1cm4gcmVzXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGlkID0gMFxuICBAZ2V0SWQgPSAoKSAtPlxuICAgIHJldHVybiAnQ2hhcnQnICsgaWQrK1xuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAcGFyc2VMaXN0ID0gKHZhbCkgLT5cbiAgICBpZiB2YWxcbiAgICAgIGwgPSB2YWwudHJpbSgpLnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJykuc3BsaXQoJywnKS5tYXAoKGQpIC0+IGQucmVwbGFjZSgvXltcXFwifCddfFtcXFwifCddJC9nLCAnJykpXG4gICAgICByZXR1cm4gaWYgbC5sZW5ndGggaXMgMSB0aGVuIHJldHVybiBsWzBdIGVsc2UgbFxuICAgIHJldHVybiB1bmRlZmluZWRcblxuICBAcGFyc2VUcnVlRmFsc2UgPSAodmFsKSAtPlxuICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnIHRoZW4gdHJ1ZSBlbHNlIChpZiB2YWwgaXMgJ2ZhbHNlJyB0aGVuIGZhbHNlIGVsc2UgdW5kZWZpbmVkKVxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAbWVyZ2VEYXRhID0gKCkgLT5cblxuICAgIF9wcmV2RGF0YSA9IFtdXG4gICAgX2RhdGEgPSBbXVxuICAgIF9wcmV2SGFzaCA9IHt9XG4gICAgX2hhc2ggPSB7fVxuICAgIF9wcmV2Q29tbW9uID0gW11cbiAgICBfY29tbW9uID0gW11cbiAgICBfZmlyc3QgPSB1bmRlZmluZWRcbiAgICBfbGFzdCA9IHVuZGVmaW5lZFxuXG4gICAgX2tleSA9IChkKSAtPiBkICMgaWRlbnRpdHlcbiAgICBfbGF5ZXJLZXkgPSAoZCkgLT4gZFxuXG5cbiAgICBtZSA9IChkYXRhKSAtPlxuICAgICAgIyBzYXZlIF9kYXRhIHRvIF9wcmV2aW91c0RhdGEgYW5kIHVwZGF0ZSBfcHJldmlvdXNIYXNoO1xuICAgICAgX3ByZXZEYXRhID0gW11cbiAgICAgIF9wcmV2SGFzaCA9IHt9XG4gICAgICBmb3IgZCxpICBpbiBfZGF0YVxuICAgICAgICBfcHJldkRhdGFbaV0gPSBkO1xuICAgICAgICBfcHJldkhhc2hbX2tleShkKV0gPSBpXG5cbiAgICAgICNpdGVyYXRlIG92ZXIgZGF0YSBhbmQgZGV0ZXJtaW5lIHRoZSBjb21tb24gZWxlbWVudHNcbiAgICAgIF9wcmV2Q29tbW9uID0gW107XG4gICAgICBfY29tbW9uID0gW107XG4gICAgICBfaGFzaCA9IHt9O1xuICAgICAgX2RhdGEgPSBkYXRhO1xuXG4gICAgICBmb3IgZCxqIGluIF9kYXRhXG4gICAgICAgIGtleSA9IF9rZXkoZClcbiAgICAgICAgX2hhc2hba2V5XSA9IGpcbiAgICAgICAgaWYgX3ByZXZIYXNoLmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgICAjZWxlbWVudCBpcyBpbiBib3RoIGFycmF5c1xuICAgICAgICAgIF9wcmV2Q29tbW9uW19wcmV2SGFzaFtrZXldXSA9IHRydWVcbiAgICAgICAgICBfY29tbW9uW2pdID0gdHJ1ZVxuICAgICAgcmV0dXJuIG1lO1xuXG4gICAgbWUua2V5ID0gKGZuKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBfa2V5XG4gICAgICBfa2V5ID0gZm47XG4gICAgICByZXR1cm4gbWU7XG5cbiAgICBtZS5maXJzdCA9IChmaXJzdCkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2ZpcnN0XG4gICAgICBfZmlyc3QgPSBmaXJzdFxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXN0ID0gKGxhc3QpIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9sYXN0XG4gICAgICBfbGFzdCA9IGxhc3RcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkZWQgPSAoKSAtPlxuICAgICAgcmV0ID0gW107XG4gICAgICBmb3IgZCwgaSBpbiBfZGF0YVxuICAgICAgICBpZiAhX2NvbW1vbltpXSB0aGVuIHJldC5wdXNoKF9kKVxuICAgICAgcmV0dXJuIHJldFxuXG4gICAgbWUuZGVsZXRlZCA9ICgpIC0+XG4gICAgICByZXQgPSBbXTtcbiAgICAgIGZvciBwLCBpIGluIF9wcmV2RGF0YVxuICAgICAgICBpZiAhX3ByZXZDb21tb25baV0gdGhlbiByZXQucHVzaChfcHJldkRhdGFbaV0pXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5jdXJyZW50ID0gKGtleSkgLT5cbiAgICAgIHJldHVybiBfZGF0YVtfaGFzaFtrZXldXVxuXG4gICAgbWUucHJldiA9IChrZXkpIC0+XG4gICAgICByZXR1cm4gX3ByZXZEYXRhW19wcmV2SGFzaFtrZXldXVxuXG4gICAgbWUuYWRkZWRQcmVkID0gKGFkZGVkKSAtPlxuICAgICAgcHJlZElkeCA9IF9oYXNoW19rZXkoYWRkZWQpXVxuICAgICAgd2hpbGUgIV9jb21tb25bcHJlZElkeF1cbiAgICAgICAgaWYgcHJlZElkeC0tIDwgMCB0aGVuIHJldHVybiBfZmlyc3RcbiAgICAgIHJldHVybiBfcHJldkRhdGFbX3ByZXZIYXNoW19rZXkoX2RhdGFbcHJlZElkeF0pXV1cblxuICAgIG1lLmFkZGVkUHJlZC5sZWZ0ID0gKGFkZGVkKSAtPlxuICAgICAgbWUuYWRkZWRQcmVkKGFkZGVkKS54XG5cbiAgICBtZS5hZGRlZFByZWQucmlnaHQgPSAoYWRkZWQpIC0+XG4gICAgICBvYmogPSBtZS5hZGRlZFByZWQoYWRkZWQpXG4gICAgICBpZiBfLmhhcyhvYmosICd3aWR0aCcpIHRoZW4gb2JqLnggKyBvYmoud2lkdGggZWxzZSBvYmoueFxuXG4gICAgbWUuZGVsZXRlZFN1Y2MgPSAoZGVsZXRlZCkgLT5cbiAgICAgIHN1Y2NJZHggPSBfcHJldkhhc2hbX2tleShkZWxldGVkKV1cbiAgICAgIHdoaWxlICFfcHJldkNvbW1vbltzdWNjSWR4XVxuICAgICAgICBpZiBzdWNjSWR4KysgPj0gX3ByZXZEYXRhLmxlbmd0aCB0aGVuIHJldHVybiBfbGFzdFxuICAgICAgcmV0dXJuIF9kYXRhW19oYXNoW19rZXkoX3ByZXZEYXRhW3N1Y2NJZHhdKV1dXG5cbiAgICByZXR1cm4gbWU7XG5cbiAgQG1lcmdlU2VyaWVzU29ydGVkID0gIChhT2xkLCBhTmV3KSAgLT5cbiAgICBpT2xkID0gMFxuICAgIGlOZXcgPSAwXG4gICAgbE9sZE1heCA9IGFPbGQubGVuZ3RoIC0gMVxuICAgIGxOZXdNYXggPSBhTmV3Lmxlbmd0aCAtIDFcbiAgICBsTWF4ID0gTWF0aC5tYXgobE9sZE1heCwgbE5ld01heClcbiAgICByZXN1bHQgPSBbXVxuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4IGFuZCBpTmV3IDw9IGxOZXdNYXhcbiAgICAgIGlmICthT2xkW2lPbGRdIGlzICthTmV3W2lOZXddXG4gICAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFPbGRbaU9sZF1dKTtcbiAgICAgICAgI2NvbnNvbGUubG9nKCdzYW1lJywgYU9sZFtpT2xkXSk7XG4gICAgICAgIGlPbGQrKztcbiAgICAgICAgaU5ldysrO1xuICAgICAgZWxzZSBpZiArYU9sZFtpT2xkXSA8ICthTmV3W2lOZXddXG4gICAgICAgICMgYU9sZFtpT2xkIGlzIGRlbGV0ZWRcbiAgICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSlcbiAgICAgICAgIyBjb25zb2xlLmxvZygnZGVsZXRlZCcsIGFPbGRbaU9sZF0pO1xuICAgICAgICBpT2xkKytcbiAgICAgIGVsc2VcbiAgICAgICAgIyBhTmV3W2lOZXddIGlzIGFkZGVkXG4gICAgICAgIHJlc3VsdC5wdXNoKFt1bmRlZmluZWQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU5ld1tpTmV3XV0pXG4gICAgICAgICMgY29uc29sZS5sb2coJ2FkZGVkJywgYU5ld1tpTmV3XSk7XG4gICAgICAgIGlOZXcrK1xuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4XG4gICAgICAjIGlmIHRoZXJlIGlzIG1vcmUgb2xkIGl0ZW1zLCBtYXJrIHRoZW0gYXMgZGVsZXRlZFxuICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdkZWxldGVkJywgYU9sZFtpT2xkXSk7XG4gICAgICBpT2xkKys7XG5cbiAgICB3aGlsZSBpTmV3IDw9IGxOZXdNYXhcbiAgICAgICMgaWYgdGhlcmUgaXMgbW9yZSBuZXcgaXRlbXMsIG1hcmsgdGhlbSBhcyBhZGRlZFxuICAgICAgcmVzdWx0LnB1c2goW3VuZGVmaW5lZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhTmV3W2lOZXddXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdhZGRlZCcsIGFOZXdbaU5ld10pO1xuICAgICAgaU5ldysrO1xuXG4gICAgcmV0dXJuIHJlc3VsdFxuXG4gIEBtZXJnZVNlcmllc1Vuc29ydGVkID0gKGFPbGQsYU5ldykgLT5cbiAgICBpT2xkID0gMFxuICAgIGlOZXcgPSAwXG4gICAgbE9sZE1heCA9IGFPbGQubGVuZ3RoIC0gMVxuICAgIGxOZXdNYXggPSBhTmV3Lmxlbmd0aCAtIDFcbiAgICBsTWF4ID0gTWF0aC5tYXgobE9sZE1heCwgbE5ld01heClcbiAgICByZXN1bHQgPSBbXVxuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4IGFuZCBpTmV3IDw9IGxOZXdNYXhcbiAgICAgIGlmIGFPbGRbaU9sZF0gaXMgYU5ld1tpTmV3XVxuICAgICAgICByZXN1bHQucHVzaChbaU9sZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhT2xkW2lPbGRdXSk7XG4gICAgICAgICNjb25zb2xlLmxvZygnc2FtZScsIGFPbGRbaU9sZF0pO1xuICAgICAgICBpT2xkKys7XG4gICAgICAgIGlOZXcrKztcbiAgICAgIGVsc2UgaWYgYU5ldy5pbmRleE9mKGFPbGRbaU9sZF0pIDwgMFxuICAgICAgICAjIGFPbGRbaU9sZCBpcyBkZWxldGVkXG4gICAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLHVuZGVmaW5lZCwgYU9sZFtpT2xkXV0pXG4gICAgICAgICMgY29uc29sZS5sb2coJ2RlbGV0ZWQnLCBhT2xkW2lPbGRdKTtcbiAgICAgICAgaU9sZCsrXG4gICAgICBlbHNlXG4gICAgICAgICMgYU5ld1tpTmV3XSBpcyBhZGRlZFxuICAgICAgICByZXN1bHQucHVzaChbdW5kZWZpbmVkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFOZXdbaU5ld11dKVxuICAgICAgICAjIGNvbnNvbGUubG9nKCdhZGRlZCcsIGFOZXdbaU5ld10pO1xuICAgICAgICBpTmV3KytcblxuICAgIHdoaWxlIGlPbGQgPD0gbE9sZE1heFxuICAgICAgIyBpZiB0aGVyZSBpcyBtb3JlIG9sZCBpdGVtcywgbWFyayB0aGVtIGFzIGRlbGV0ZWRcbiAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLHVuZGVmaW5lZCwgYU9sZFtpT2xkXV0pO1xuICAgICAgIyBjb25zb2xlLmxvZygnZGVsZXRlZCcsIGFPbGRbaU9sZF0pO1xuICAgICAgaU9sZCsrO1xuXG4gICAgd2hpbGUgaU5ldyA8PSBsTmV3TWF4XG4gICAgICAjIGlmIHRoZXJlIGlzIG1vcmUgbmV3IGl0ZW1zLCBtYXJrIHRoZW0gYXMgYWRkZWRcbiAgICAgIHJlc3VsdC5wdXNoKFt1bmRlZmluZWQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU5ld1tpTmV3XV0pO1xuICAgICAgIyBjb25zb2xlLmxvZygnYWRkZWQnLCBhTmV3W2lOZXddKTtcbiAgICAgIGlOZXcrKztcblxuICAgIHJldHVybiByZXN1bHRcblxuICByZXR1cm4gQFxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9