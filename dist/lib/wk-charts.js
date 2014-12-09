angular.module('wk.chart', []);

angular.module('wk.chart').constant('d3OrdinalScales', ['ordinal', 'category10', 'category20', 'category20b', 'category20c']);

angular.module('wk.chart').constant('d3ChartMargins', {
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
;
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
})();
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

angular.module("wk.chart").run(["$templateCache", function($templateCache) {$templateCache.put("templates/legend.html","\n<div ng-style=\"position\" ng-show=\"showLegend\" class=\"wk-chart-legend\">\n  <div ng-show=\"title\" class=\"legend-title\">{{title}}</div>\n  <ul class=\"list-unstyled\">\n    <li ng-repeat=\"legendRow in legendRows track by legendRow.value\" class=\"wk-chart-legend-item\"><span ng-if=\"legendRow.color\" ng-style=\"legendRow.color\">&nbsp;&nbsp;&nbsp;</span>\n      <svg-icon ng-if=\"legendRow.path\" path=\"legendRow.path\" width=\"20\"></svg-icon><span> &nbsp;{{legendRow.value}}</span>\n    </li>\n  </ul>\n</div>");
$templateCache.put("templates/toolTip.html","\n<div ng-show=\"ttShow\" ng-style=\"position\" class=\"wk-chart-tooltip\">\n  <table class=\"table table-condensed table-bordered\">\n    <thead ng-show=\"headerValue\">\n      <tr>\n        <th colspan=\"2\">{{headerName}}</th>\n        <th>{{headerValue}}</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr ng-repeat=\"ttRow in layers\">\n        <td ng-style=\"ttRow.color\" ng-class=\"ttRow.class\">\n          <svg-icon ng-if=\"ttRow.path\" path=\"ttRow.path\" width=\"15\"></svg-icon>\n        </td>\n        <td>{{ttRow.name}}</td>\n        <td>{{ttRow.value}}</td>\n      </tr>\n    </tbody>\n  </table>\n</div>");}]);
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

angular.module('wk.chart').filter('ttFormat', function($log, formatDefaults) {
  return function(value, format) {
    var df;
    if (typeof value === 'object' && value.getUTCDate) {
      df = d3.time.format(formatDefaults.date);
      return df(value);
    }
    if (typeof value === 'number' || !isNaN(+value)) {
      df = d3.format(formatDefaults.number);
      return df(+value);
    }
    return value;
  };
});

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

angular.module('wk.chart').directive('bars', function($log, utils, barConfig) {
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
        enter.append('text').attr('y', function(d) {
          return d.height / 2;
        }).attr('x', function(d) {
          return d.x + 10;
        }).attr({
          dy: '0.35em',
          'text-anchor': 'start'
        }).style({
          'font-size': '1.3em',
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
        bars.select('text').attr('class', 'wk-chart-data-label').text(function(d) {
          return x.formattedValue(d.data);
        }).transition().duration(options.duration).attr('y', function(d) {
          return d.height / 2;
        }).attr('x', function(d) {
          return d.x + 10;
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

angular.module('wk.chart').directive('column', function($log, utils, barConfig) {
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
        }).attr('y', -20).attr({
          dy: '1em',
          'text-anchor': 'middle'
        }).style({
          'font-size': '1.3em',
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

angular.module('wk.chart').directive('columnHistogram', function($log, barConfig, utils) {
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
        }).attr('y', -20).attr({
          dy: '1em',
          'text-anchor': 'middle'
        }).style({
          'font-size': '1.3em',
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

angular.module('wk.chart').factory('container', function($log, $window, d3ChartMargins, scaleList, axisConfig, d3Animation, behavior) {
  var container, containerCnt;
  containerCnt = 0;
  container = function() {
    var drawAndPositionText, drawAxis, drawGrid, drawTitleArea, getAxisRect, me, _behavior, _chart, _chartArea, _container, _containerId, _data, _duration, _element, _elementSelection, _genChartFrame, _innerHeight, _innerWidth, _layouts, _legends, _margin, _overlay, _removeAxis, _removeLabel, _spacedContainer, _svg, _titleHeight;
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
    _margin = angular.copy(d3ChartMargins["default"]);
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
        _chart.lifeCycle().on("drawAxis." + (me.id()), me.drawChartFrame);
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
    getAxisRect = function(dim) {
      var axis, box;
      axis = _container.append('g');
      dim.scale().range([0, 100]);
      axis.call(dim.axis());
      if (dim.rotateTickLabels()) {
        axis.selectAll("text").attr({
          dy: '-0.71em',
          x: -9
        }).attr('transform', "translate(0,9) rotate(" + (dim.rotateTickLabels()) + ")").style('text-anchor', dim.axisOrient() === 'bottom' ? 'end' : 'start');
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
          dy: '-0.71em',
          x: -9
        }).attr('transform', "translate(0,9) rotate(" + (dim.rotateTickLabels()) + ")").style('text-anchor', dim.axisOrient() === 'bottom' ? 'end' : 'start');
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
    me.drawChartFrame = function(notAnimated) {
      var axisRect, bounds, k, l, label, labelHeight, leftMargin, s, titleAreaHeight, topMargin, _frameHeight, _frameWidth, _height, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _width;
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
      for (_i = 0, _len = _layouts.length; _i < _len; _i++) {
        l = _layouts[_i];
        _ref = l.scales().allKinds();
        for (k in _ref) {
          s = _ref[k];
          if (s.showAxis()) {
            s.axis().scale(s.scale()).orient(s.axisOrient());
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
              s.range([0, _innerWidth - 50]);
            } else {
              s.range([0, _innerWidth]);
            }
          } else if (k === 'y' || k === 'rangeY') {
            if (l.showDataLabels() === 'y') {
              s.range([_innerHeight, 20]);
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
      return me.formatValue(me.value(data));
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
      attrs.$observe('exponent', function(val) {
        if (me.scaleType() === 'pow' && _.isNumber(+val)) {
          return me.exponent(+val).update();
        }
      });
      attrs.$observe('property', function(val) {
        return me.property(parseList(val)).update();
      });
      attrs.$observe('layerProperty', function(val) {
        if (val && val.length > 0) {
          return me.layerProperty(val).update();
        }
      });
      attrs.$observe('range', function(val) {
        var range;
        range = parseList(val);
        if (Array.isArray(range)) {
          return me.range(range).update();
        }
      });
      attrs.$observe('dateFormat', function(val) {
        if (val) {
          if (me.scaleType() === 'time') {
            return me.dataFormat(val).update();
          }
        }
      });
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
      attrs.$observe('domainRange', function(val) {
        if (val) {
          return me.domainCalc(val).update();
        }
      });
      attrs.$observe('label', function(val) {
        if (val !== void 0) {
          return me.axisLabel(val).updateAttrs();
        }
      });
      attrs.$observe('format', function(val) {
        if (val !== void 0) {
          return me.format(val);
        }
      });
      return attrs.$observe('reset', function(val) {
        return me.resetOnNewData(utils.parseTrueFalse(val));
      });
    },
    observeAxisAttributes: function(attrs, me, scope) {
      attrs.$observe('tickFormat', function(val) {
        if (val !== void 0) {
          return me.tickFormat(d3.format(val)).update();
        }
      });
      attrs.$observe('ticks', function(val) {
        if (val !== void 0) {
          me.ticks(+val);
          if (me.axis()) {
            return me.updateAttrs();
          }
        }
      });
      attrs.$observe('grid', function(val) {
        if (val !== void 0) {
          return me.showGrid(val === '' || val === 'true').updateAttrs();
        }
      });
      attrs.$observe('showLabel', function(val) {
        if (val !== void 0) {
          return me.showLabel(val === '' || val === 'true').update(true);
        }
      });
      return scope.$watch(attrs.axisFormatters, function(val) {
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
      });
    },
    observeLegendAttributes: function(attrs, me, layout) {
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
      return attrs.$observe('legendTitle', function(val) {
        if (val !== void 0) {
          return me.legend().title(val).redraw();
        }
      });
    },
    observerRangeAttributes: function(attrs, me) {
      attrs.$observe('lowerProperty', function(val) {
        null;
        return me.lowerProperty(parseList(val)).update();
      });
      return attrs.$observe('upperProperty', function(val) {
        null;
        return me.upperProperty(parseList(val)).update();
      });
    }
  };
});

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3drLWNoYXJ0cy9hcHAvY29uZmlnL3drQ2hhcnRDb25zdGFudHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL1Jlc2l6ZVNlbnNvci5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoLmNvZmZlZSIsInRlbXBsYXRlcy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9kMy5nZW8uem9vbS5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL3NhdmVTdmdBc1BuZy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2NoYXJ0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2xheW91dC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2NvbnRhaW5lci9wcmludC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2NvbnRhaW5lci9zZWxlY3Rpb24uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9maWx0ZXJzL3R0Rm9ybWF0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhU3RhY2tlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYXJlYVN0YWNrZWRWZXJ0aWNhbC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYXJlYVZlcnRpY2FsLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9iYXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2JhckNsdXN0ZXJlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYmFyU3RhY2tlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYnViYmxlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9jb2x1bW4uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2NvbHVtbkNsdXN0ZXJlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvY29sdW1uU3RhY2tlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvZ2F1Z2UuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2dlb01hcC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvaGlzdG9ncmFtLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9saW5lLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9saW5lVmVydGljYWwuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL3BpZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvc2NhdHRlci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvc3BpZGVyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9yQnJ1c2guY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JTZWxlY3QuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JUb29sdGlwLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9ycy5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9jaGFydC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9jb250YWluZXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvbGF5b3V0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2xlZ2VuZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9zY2FsZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9zY2FsZUxpc3QuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9wcm92aWRlcnMvbG9jYWxpemF0aW9uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvcHJvdmlkZXJzL3NjYWxlRXh0ZW50aW9uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL2NvbG9yLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3NjYWxlVXRpbHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2hhcGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2l6ZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy94LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3hSYW5nZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy95LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3lSYW5nZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NlcnZpY2VzL3NlbGVjdGlvblNoYXJpbmcuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zZXJ2aWNlcy90aW1lci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3V0aWwvbGF5ZXJEYXRhLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9zdmdJY29uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC91dGlsaXRpZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsVUFBZixFQUEyQixFQUEzQixDQUFBLENBQUE7O0FBQUEsT0FFTyxDQUFDLE1BQVIsQ0FBZSxVQUFmLENBQTBCLENBQUMsUUFBM0IsQ0FBb0MsaUJBQXBDLEVBQXVELENBQ3JELFNBRHFELEVBRXJELFlBRnFELEVBR3JELFlBSHFELEVBSXJELGFBSnFELEVBS3JELGFBTHFELENBQXZELENBRkEsQ0FBQTs7QUFBQSxPQVVPLENBQUMsTUFBUixDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxRQUEzQixDQUFvQyxnQkFBcEMsRUFBc0Q7QUFBQSxFQUNwRCxHQUFBLEVBQUss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QUFBLENBQUE7QUFBQSxRQUVBLElBQUEsRUFGQSxDQUZHO09BQUEsTUFBQTtBQU9ILFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFDLE1BQUQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsRUFBYyxPQUFkLENBQVosRUFBbUMsSUFBSyxDQUFBLElBQUEsQ0FBeEMsQ0FBWixDQUFBLENBQUE7QUFBQSxRQUVBLElBQUEsRUFGQSxDQVBHO09BTlA7SUFBQSxDQVBBO0FBd0JBLFdBQU0sSUFBQSxJQUFRLE9BQWQsR0FBQTtBQUVFLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTSxNQUFOLEVBQWlCLElBQUssQ0FBQSxJQUFBLENBQXRCLENBQVosQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFBLEVBRkEsQ0FGRjtJQUFBLENBeEJBO0FBOEJBLFdBQU0sSUFBQSxJQUFRLE9BQWQsR0FBQTtBQUVFLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFDLE1BQUQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsRUFBYyxPQUFkLENBQVosRUFBbUMsSUFBSyxDQUFBLElBQUEsQ0FBeEMsQ0FBWixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUEsRUFGQSxDQUZGO0lBQUEsQ0E5QkE7QUFvQ0EsV0FBTyxNQUFQLENBckNxQjtFQUFBLENBekt2QixDQUFBO0FBZ05BLFNBQU8sSUFBUCxDQXBOMEM7QUFBQSxDQUE1QyxDQUFBLENBQUEiLCJmaWxlIjoid2stY2hhcnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JywgW10pXG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM09yZGluYWxTY2FsZXMnLCBbXG4gICdvcmRpbmFsJ1xuICAnY2F0ZWdvcnkxMCdcbiAgJ2NhdGVnb3J5MjAnXG4gICdjYXRlZ29yeTIwYidcbiAgJ2NhdGVnb3J5MjBjJ1xuXVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNDaGFydE1hcmdpbnMnLCB7XG4gIHRvcDogMTBcbiAgbGVmdDogNTBcbiAgYm90dG9tOiA0MFxuICByaWdodDogMjBcbiAgdG9wQm90dG9tTWFyZ2luOntheGlzOjI1LCBsYWJlbDoxOH1cbiAgbGVmdFJpZ2h0TWFyZ2luOntheGlzOjQwLCBsYWJlbDoyMH1cbiAgbWluTWFyZ2luOjhcbiAgZGVmYXVsdDpcbiAgICB0b3A6IDhcbiAgICBsZWZ0OjhcbiAgICBib3R0b206OFxuICAgIHJpZ2h0OjEwXG4gIGF4aXM6XG4gICAgdG9wOjI1XG4gICAgYm90dG9tOjI1XG4gICAgbGVmdDo0MFxuICAgIHJpZ2h0OjQwXG4gIGxhYmVsOlxuICAgIHRvcDoxOFxuICAgIGJvdHRvbToxOFxuICAgIGxlZnQ6MjBcbiAgICByaWdodDoyMFxufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNTaGFwZXMnLCBbXG4gICdjaXJjbGUnLFxuICAnY3Jvc3MnLFxuICAndHJpYW5nbGUtZG93bicsXG4gICd0cmlhbmdsZS11cCcsXG4gICdzcXVhcmUnLFxuICAnZGlhbW9uZCdcbl1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2F4aXNDb25maWcnLCB7XG4gIGxhYmVsRm9udFNpemU6ICcxLjZlbSdcbiAgeDpcbiAgICBheGlzUG9zaXRpb25zOiBbJ3RvcCcsICdib3R0b20nXVxuICAgIGF4aXNPZmZzZXQ6IHtib3R0b206J2hlaWdodCd9XG4gICAgYXhpc1Bvc2l0aW9uRGVmYXVsdDogJ2JvdHRvbSdcbiAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJ1xuICAgIG1lYXN1cmU6ICd3aWR0aCdcbiAgICBsYWJlbFBvc2l0aW9uczpbJ291dHNpZGUnLCAnaW5zaWRlJ11cbiAgICBsYWJlbFBvc2l0aW9uRGVmYXVsdDogJ291dHNpZGUnXG4gICAgbGFiZWxPZmZzZXQ6XG4gICAgICB0b3A6ICcxZW0nXG4gICAgICBib3R0b206ICctMC44ZW0nXG4gIHk6XG4gICAgYXhpc1Bvc2l0aW9uczogWydsZWZ0JywgJ3JpZ2h0J11cbiAgICBheGlzT2Zmc2V0OiB7cmlnaHQ6J3dpZHRoJ31cbiAgICBheGlzUG9zaXRpb25EZWZhdWx0OiAnbGVmdCdcbiAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCdcbiAgICBtZWFzdXJlOiAnaGVpZ2h0J1xuICAgIGxhYmVsUG9zaXRpb25zOlsnb3V0c2lkZScsICdpbnNpZGUnXVxuICAgIGxhYmVsUG9zaXRpb25EZWZhdWx0OiAnb3V0c2lkZSdcbiAgICBsYWJlbE9mZnNldDpcbiAgICAgIGxlZnQ6ICcxLjJlbSdcbiAgICAgIHJpZ2h0OiAnMS4yZW0nXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM0FuaW1hdGlvbicsIHtcbiAgZHVyYXRpb246NTAwXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICd0ZW1wbGF0ZURpcicsICd0ZW1wbGF0ZXMvJ1xuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZm9ybWF0RGVmYXVsdHMnLCB7XG4gIGRhdGU6ICcleCcgIyAnJWQuJW0uJVknXG4gIG51bWJlciA6ICAnLC4yZidcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2JhckNvbmZpZycsIHtcbiAgcGFkZGluZzogMC4xXG4gIG91dGVyUGFkZGluZzogMFxufVxuXG4iLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgZGltZW5zaW9uIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfEVsZW1lbnRzfGpRdWVyeX0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB0aGlzLlJlc2l6ZVNlbnNvciA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50UXVldWUoKSB7XG4gICAgICAgICAgICB0aGlzLnEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnEucHVzaChldik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBqID0gdGhpcy5xLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnFbaV0uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAgICAgICAgICogQHJldHVybnMge1N0cmluZ3xOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIHByb3ApIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmN1cnJlbnRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmN1cnJlbnRTdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuc3R5bGVbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzaXplZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgcmVzaXplZCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5jbGFzc05hbWUgPSAnd2stY2hhcnQtcmVzaXplLXNlbnNvcic7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBib3R0b206IDA7IG92ZXJmbG93OiBzY3JvbGw7IHotaW5kZXg6IC0xOyB2aXNpYmlsaXR5OiBoaWRkZW47JztcbiAgICAgICAgICAgIHZhciBzdHlsZUNoaWxkID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyc7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwid2stY2hhcnQtcmVzaXplLXNlbnNvci1leHBhbmRcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJ1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIndrLWNoYXJ0LXJlc2l6ZS1zZW5zb3Itc2hyaW5rXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICcgd2lkdGg6IDIwMCU7IGhlaWdodDogMjAwJVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50LnJlc2l6ZVNlbnNvcik7XG4gICAgICAgICAgICBpZiAoIXtmaXhlZDogMSwgYWJzb2x1dGU6IDF9W2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJyldKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZXhwYW5kID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBleHBhbmRDaGlsZCA9IGV4cGFuZC5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIHNocmluayA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMV07XG4gICAgICAgICAgICB2YXIgc2hyaW5rQ2hpbGQgPSBzaHJpbmsuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBsYXN0V2lkdGgsIGxhc3RIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS53aWR0aCA9IGV4cGFuZC5vZmZzZXRXaWR0aCArIDEwICsgJ3B4JztcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS5oZWlnaHQgPSBleHBhbmQub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxMZWZ0ID0gZXhwYW5kLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxUb3AgPSBleHBhbmQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxMZWZ0ID0gc2hyaW5rLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxUb3AgPSBzaHJpbmsuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxhc3RXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgbGFzdEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgY2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmNhbGwoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgYWRkRXZlbnQgPSBmdW5jdGlvbihlbCwgbmFtZSwgY2IpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoJ29uJyArIG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkRXZlbnQoZXhwYW5kLCAnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiBsYXN0V2lkdGggfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiBsYXN0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYWRkRXZlbnQoc2hyaW5rLCAnc2Nyb2xsJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA8IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA8IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFwiW29iamVjdCBBcnJheV1cIiA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVsZW1lbnQpXG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBqUXVlcnkgJiYgZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSkgLy9qcXVlcnlcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIEVsZW1lbnRzICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50cykgLy9tb290b29sc1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgaSA9IDAsIGogPSBlbGVtZW50Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudFtpXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JydXNoJywgKCRsb2csIHNlbGVjdGlvblNoYXJpbmcsIGJlaGF2aW9yKSAtPlxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiBbJ15jaGFydCcsICdebGF5b3V0JywgJz94JywgJz95JywnP3JhbmdlWCcsICc/cmFuZ2VZJ11cbiAgICBzY29wZTpcbiAgICAgIGJydXNoRXh0ZW50OiAnPSdcbiAgICAgIHNlbGVjdGVkVmFsdWVzOiAnPSdcbiAgICAgIHNlbGVjdGVkRG9tYWluOiAnPSdcbiAgICAgIGNoYW5nZTogJyYnXG5cbiAgICBsaW5rOihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMV0/Lm1lXG4gICAgICB4ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICB5ID0gY29udHJvbGxlcnNbM10/Lm1lXG4gICAgICByYW5nZVggPSBjb250cm9sbGVyc1s0XT8ubWVcbiAgICAgIHJhbmdlWSA9IGNvbnRyb2xsZXJzWzVdPy5tZVxuICAgICAgeFNjYWxlID0gdW5kZWZpbmVkXG4gICAgICB5U2NhbGUgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RhYmxlcyA9IHVuZGVmaW5lZFxuICAgICAgX2JydXNoQXJlYVNlbGVjdGlvbiA9IHVuZGVmaW5lZFxuICAgICAgX2lzQXJlYUJydXNoID0gbm90IHggYW5kIG5vdCB5XG4gICAgICBfYnJ1c2hHcm91cCA9IHVuZGVmaW5lZFxuXG4gICAgICBicnVzaCA9IGNoYXJ0LmJlaGF2aW9yKCkuYnJ1c2hcbiAgICAgIGlmIG5vdCB4IGFuZCBub3QgeSBhbmQgbm90IHJhbmdlWCBhbmQgbm90IHJhbmdlWVxuICAgICAgICAjbGF5b3V0IGJydXNoLCBnZXQgeCBhbmQgeSBmcm9tIGxheW91dCBzY2FsZXNcbiAgICAgICAgc2NhbGVzID0gbGF5b3V0LnNjYWxlcygpLmdldFNjYWxlcyhbJ3gnLCAneSddKVxuICAgICAgICBicnVzaC54KHNjYWxlcy54KVxuICAgICAgICBicnVzaC55KHNjYWxlcy55KVxuICAgICAgZWxzZVxuICAgICAgICBicnVzaC54KHggb3IgcmFuZ2VYKVxuICAgICAgICBicnVzaC55KHkgb3IgcmFuZ2VZKVxuICAgICAgYnJ1c2guYWN0aXZlKHRydWUpXG5cbiAgICAgIGJydXNoLmV2ZW50cygpLm9uICdicnVzaCcsIChpZHhSYW5nZSwgdmFsdWVSYW5nZSwgZG9tYWluKSAtPlxuICAgICAgICBpZiBhdHRycy5icnVzaEV4dGVudFxuICAgICAgICAgIHNjb3BlLmJydXNoRXh0ZW50ID0gaWR4UmFuZ2VcbiAgICAgICAgaWYgYXR0cnMuc2VsZWN0ZWRWYWx1ZXNcbiAgICAgICAgICBzY29wZS5zZWxlY3RlZFZhbHVlcyA9IHZhbHVlUmFuZ2VcbiAgICAgICAgaWYgYXR0cnMuc2VsZWN0ZWREb21haW5cbiAgICAgICAgICBzY29wZS5zZWxlY3RlZERvbWFpbiA9IGRvbWFpblxuICAgICAgICBzY29wZS4kYXBwbHkoKVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydC5icnVzaCcsIChkYXRhKSAtPlxuICAgICAgICBicnVzaC5kYXRhKGRhdGEpXG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2JydXNoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyh2YWwpIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIGJydXNoLmJydXNoR3JvdXAodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYnJ1c2guYnJ1c2hHcm91cCh1bmRlZmluZWQpXG4gIH0iLG51bGwsIi8vIENvcHlyaWdodCAoYykgMjAxMywgSmFzb24gRGF2aWVzLCBodHRwOi8vd3d3Lmphc29uZGF2aWVzLmNvbVxuLy8gU2VlIExJQ0VOU0UudHh0IGZvciBkZXRhaWxzLlxuKGZ1bmN0aW9uKCkge1xuXG52YXIgcmFkaWFucyA9IE1hdGguUEkgLyAxODAsXG4gICAgZGVncmVlcyA9IDE4MCAvIE1hdGguUEk7XG5cbi8vIFRPRE8gbWFrZSBpbmNyZW1lbnRhbCByb3RhdGUgb3B0aW9uYWxcblxuZDMuZ2VvLnpvb20gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByb2plY3Rpb24sXG4gICAgICB6b29tUG9pbnQsXG4gICAgICBldmVudCA9IGQzLmRpc3BhdGNoKFwiem9vbXN0YXJ0XCIsIFwiem9vbVwiLCBcInpvb21lbmRcIiksXG4gICAgICB6b29tID0gZDMuYmVoYXZpb3Iuem9vbSgpXG4gICAgICAgIC5vbihcInpvb21zdGFydFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbW91c2UwID0gZDMubW91c2UodGhpcyksXG4gICAgICAgICAgICAgIHJvdGF0ZSA9IHF1YXRlcm5pb25Gcm9tRXVsZXIocHJvamVjdGlvbi5yb3RhdGUoKSksXG4gICAgICAgICAgICAgIHBvaW50ID0gcG9zaXRpb24ocHJvamVjdGlvbiwgbW91c2UwKTtcbiAgICAgICAgICBpZiAocG9pbnQpIHpvb21Qb2ludCA9IHBvaW50O1xuXG4gICAgICAgICAgem9vbU9uLmNhbGwoem9vbSwgXCJ6b29tXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoZDMuZXZlbnQuc2NhbGUpO1xuICAgICAgICAgICAgICAgIHZhciBtb3VzZTEgPSBkMy5tb3VzZSh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYmV0d2VlbiA9IHJvdGF0ZUJldHdlZW4oem9vbVBvaW50LCBwb3NpdGlvbihwcm9qZWN0aW9uLCBtb3VzZTEpKTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnJvdGF0ZShldWxlckZyb21RdWF0ZXJuaW9uKHJvdGF0ZSA9IGJldHdlZW5cbiAgICAgICAgICAgICAgICAgICAgPyBtdWx0aXBseShyb3RhdGUsIGJldHdlZW4pXG4gICAgICAgICAgICAgICAgICAgIDogbXVsdGlwbHkoYmFuayhwcm9qZWN0aW9uLCBtb3VzZTAsIG1vdXNlMSksIHJvdGF0ZSkpKTtcbiAgICAgICAgICAgICAgICBtb3VzZTAgPSBtb3VzZTE7XG4gICAgICAgICAgICAgICAgZXZlbnQuem9vbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICBldmVudC56b29tc3RhcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwiem9vbWVuZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB6b29tT24uY2FsbCh6b29tLCBcInpvb21cIiwgbnVsbCk7XG4gICAgICAgICAgZXZlbnQuem9vbWVuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9KSxcbiAgICAgIHpvb21PbiA9IHpvb20ub247XG5cbiAgem9vbS5wcm9qZWN0aW9uID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gem9vbS5zY2FsZSgocHJvamVjdGlvbiA9IF8pLnNjYWxlKCkpIDogcHJvamVjdGlvbjtcbiAgfTtcblxuICByZXR1cm4gZDMucmViaW5kKHpvb20sIGV2ZW50LCBcIm9uXCIpO1xufTtcblxuZnVuY3Rpb24gYmFuayhwcm9qZWN0aW9uLCBwMCwgcDEpIHtcbiAgdmFyIHQgPSBwcm9qZWN0aW9uLnRyYW5zbGF0ZSgpLFxuICAgICAgYW5nbGUgPSBNYXRoLmF0YW4yKHAwWzFdIC0gdFsxXSwgcDBbMF0gLSB0WzBdKSAtIE1hdGguYXRhbjIocDFbMV0gLSB0WzFdLCBwMVswXSAtIHRbMF0pO1xuICByZXR1cm4gW01hdGguY29zKGFuZ2xlIC8gMiksIDAsIDAsIE1hdGguc2luKGFuZ2xlIC8gMildO1xufVxuXG5mdW5jdGlvbiBwb3NpdGlvbihwcm9qZWN0aW9uLCBwb2ludCkge1xuICB2YXIgdCA9IHByb2plY3Rpb24udHJhbnNsYXRlKCksXG4gICAgICBzcGhlcmljYWwgPSBwcm9qZWN0aW9uLmludmVydChwb2ludCk7XG4gIHJldHVybiBzcGhlcmljYWwgJiYgaXNGaW5pdGUoc3BoZXJpY2FsWzBdKSAmJiBpc0Zpbml0ZShzcGhlcmljYWxbMV0pICYmIGNhcnRlc2lhbihzcGhlcmljYWwpO1xufVxuXG5mdW5jdGlvbiBxdWF0ZXJuaW9uRnJvbUV1bGVyKGV1bGVyKSB7XG4gIHZhciDOuyA9IC41ICogZXVsZXJbMF0gKiByYWRpYW5zLFxuICAgICAgz4YgPSAuNSAqIGV1bGVyWzFdICogcmFkaWFucyxcbiAgICAgIM6zID0gLjUgKiBldWxlclsyXSAqIHJhZGlhbnMsXG4gICAgICBzaW7OuyA9IE1hdGguc2luKM67KSwgY29zzrsgPSBNYXRoLmNvcyjOuyksXG4gICAgICBzaW7PhiA9IE1hdGguc2luKM+GKSwgY29zz4YgPSBNYXRoLmNvcyjPhiksXG4gICAgICBzaW7OsyA9IE1hdGguc2luKM6zKSwgY29zzrMgPSBNYXRoLmNvcyjOsyk7XG4gIHJldHVybiBbXG4gICAgY29zzrsgKiBjb3PPhiAqIGNvc86zICsgc2luzrsgKiBzaW7PhiAqIHNpbs6zLFxuICAgIHNpbs67ICogY29zz4YgKiBjb3POsyAtIGNvc867ICogc2luz4YgKiBzaW7OsyxcbiAgICBjb3POuyAqIHNpbs+GICogY29zzrMgKyBzaW7OuyAqIGNvc8+GICogc2luzrMsXG4gICAgY29zzrsgKiBjb3PPhiAqIHNpbs6zIC0gc2luzrsgKiBzaW7PhiAqIGNvc86zXG4gIF07XG59XG5cbmZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXSxcbiAgICAgIGIwID0gYlswXSwgYjEgPSBiWzFdLCBiMiA9IGJbMl0sIGIzID0gYlszXTtcbiAgcmV0dXJuIFtcbiAgICBhMCAqIGIwIC0gYTEgKiBiMSAtIGEyICogYjIgLSBhMyAqIGIzLFxuICAgIGEwICogYjEgKyBhMSAqIGIwICsgYTIgKiBiMyAtIGEzICogYjIsXG4gICAgYTAgKiBiMiAtIGExICogYjMgKyBhMiAqIGIwICsgYTMgKiBiMSxcbiAgICBhMCAqIGIzICsgYTEgKiBiMiAtIGEyICogYjEgKyBhMyAqIGIwXG4gIF07XG59XG5cbmZ1bmN0aW9uIHJvdGF0ZUJldHdlZW4oYSwgYikge1xuICBpZiAoIWEgfHwgIWIpIHJldHVybjtcbiAgdmFyIGF4aXMgPSBjcm9zcyhhLCBiKSxcbiAgICAgIG5vcm0gPSBNYXRoLnNxcnQoZG90KGF4aXMsIGF4aXMpKSxcbiAgICAgIGhhbGbOsyA9IC41ICogTWF0aC5hY29zKE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBkb3QoYSwgYikpKSksXG4gICAgICBrID0gTWF0aC5zaW4oaGFsZs6zKSAvIG5vcm07XG4gIHJldHVybiBub3JtICYmIFtNYXRoLmNvcyhoYWxmzrMpLCBheGlzWzJdICogaywgLWF4aXNbMV0gKiBrLCBheGlzWzBdICoga107XG59XG5cbmZ1bmN0aW9uIGV1bGVyRnJvbVF1YXRlcm5pb24ocSkge1xuICByZXR1cm4gW1xuICAgIE1hdGguYXRhbjIoMiAqIChxWzBdICogcVsxXSArIHFbMl0gKiBxWzNdKSwgMSAtIDIgKiAocVsxXSAqIHFbMV0gKyBxWzJdICogcVsyXSkpICogZGVncmVlcyxcbiAgICBNYXRoLmFzaW4oTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIDIgKiAocVswXSAqIHFbMl0gLSBxWzNdICogcVsxXSkpKSkgKiBkZWdyZWVzLFxuICAgIE1hdGguYXRhbjIoMiAqIChxWzBdICogcVszXSArIHFbMV0gKiBxWzJdKSwgMSAtIDIgKiAocVsyXSAqIHFbMl0gKyBxWzNdICogcVszXSkpICogZGVncmVlc1xuICBdO1xufVxuXG5mdW5jdGlvbiBjYXJ0ZXNpYW4oc3BoZXJpY2FsKSB7XG4gIHZhciDOuyA9IHNwaGVyaWNhbFswXSAqIHJhZGlhbnMsXG4gICAgICDPhiA9IHNwaGVyaWNhbFsxXSAqIHJhZGlhbnMsXG4gICAgICBjb3PPhiA9IE1hdGguY29zKM+GKTtcbiAgcmV0dXJuIFtcbiAgICBjb3PPhiAqIE1hdGguY29zKM67KSxcbiAgICBjb3PPhiAqIE1hdGguc2luKM67KSxcbiAgICBNYXRoLnNpbijPhilcbiAgXTtcbn1cblxuZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBhLmxlbmd0aCwgcyA9IDA7IGkgPCBuOyArK2kpIHMgKz0gYVtpXSAqIGJbaV07XG4gIHJldHVybiBzO1xufVxuXG5mdW5jdGlvbiBjcm9zcyhhLCBiKSB7XG4gIHJldHVybiBbXG4gICAgYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSxcbiAgICBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdLFxuICAgIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF1cbiAgXTtcbn1cblxufSkoKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnJ1c2hlZCcsICgkbG9nLHNlbGVjdGlvblNoYXJpbmcsIHRpbWluZykgLT5cbiAgc0JydXNoQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiBbJ15jaGFydCcsICc/XmxheW91dCcsICc/eCcsICc/eScsICc/cmFuZ2VYJywgJz9yYW5nZVknXVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMV0/Lm1lXG4gICAgICB4ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICB5ID0gY29udHJvbGxlcnNbM10/Lm1lXG4gICAgICByYW5nZVggPSBjb250cm9sbGVyc1s0XT8ubWVcbiAgICAgIHJhbmdlWSA9IGNvbnRyb2xsZXJzWzVdPy5tZVxuXG4gICAgICBheGlzID0geCBvciB5IG9yIHJhbmdlWCBvciByYW5nZVlcbiAgICAgIF9icnVzaEdyb3VwID0gdW5kZWZpbmVkXG5cbiAgICAgIGJydXNoZXIgPSAoZXh0ZW50LCBpZHhSYW5nZSkgLT5cbiAgICAgICAgI3RpbWluZy5zdGFydChcImJydXNoZXIje2F4aXMuaWQoKX1cIilcbiAgICAgICAgaWYgbm90IGF4aXMgdGhlbiByZXR1cm5cbiAgICAgICAgI2F4aXNcbiAgICAgICAgYXhpcy5kb21haW4oZXh0ZW50KS5zY2FsZSgpLmRvbWFpbihleHRlbnQpXG4gICAgICAgIGZvciBsIGluIGNoYXJ0LmxheW91dHMoKSB3aGVuIGwuc2NhbGVzKCkuaGFzU2NhbGUoYXhpcykgI25lZWQgdG8gZG8gaXQgdGhpcyB3YXkgdG8gZW5zdXJlIHRoZSByaWdodCBheGlzIGlzIGNob3NlbiBpbiBjYXNlIG9mIHNldmVyYWwgbGF5b3V0cyBpbiBhIGNvbnRhaW5lclxuICAgICAgICAgIGwubGlmZUN5Y2xlKCkuYnJ1c2goYXhpcywgdHJ1ZSwgaWR4UmFuZ2UpICNubyBhbmltYXRpb25cbiAgICAgICAgI3RpbWluZy5zdG9wKFwiYnJ1c2hlciN7YXhpcy5pZCgpfVwiKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYnJ1c2hlZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcodmFsKSBhbmQgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBfYnJ1c2hHcm91cCA9IHZhbFxuICAgICAgICAgIHNlbGVjdGlvblNoYXJpbmcucmVnaXN0ZXIgX2JydXNoR3JvdXAsIGJydXNoZXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9icnVzaEdyb3VwID0gdW5kZWZpbmVkXG5cbiAgICAgIHNjb3BlLiRvbiAnJGRlc3Ryb3knLCAoKSAtPlxuICAgICAgICBzZWxlY3Rpb25TaGFyaW5nLnVucmVnaXN0ZXIgX2JydXNoR3JvdXAsIGJydXNoZXJcblxuICB9IiwiKGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXQkID0gdHlwZW9mIGV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0cyB8fCB0aGlzO1xuXG4gICAgdmFyIGRvY3R5cGUgPSAnPD94bWwgdmVyc2lvbj1cIjEuMFwiIHN0YW5kYWxvbmU9XCJub1wiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyBcIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOXCIgXCJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGRcIj4nO1xuXG4gICAgZnVuY3Rpb24gaW5saW5lSW1hZ2VzKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzdmcgaW1hZ2UnKTtcbiAgICAgICAgdmFyIGxlZnQgPSBpbWFnZXMubGVuZ3RoO1xuICAgICAgICBpZiAobGVmdCA9PSAwKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2UuZ2V0QXR0cmlidXRlKCd4bGluazpocmVmJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhyZWYgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eaHR0cC8udGVzdChocmVmKSAmJiAhKG5ldyBSZWdFeHAoJ14nICsgd2luZG93LmxvY2F0aW9uLmhvc3QpLnRlc3QoaHJlZikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmVuZGVyIGVtYmVkZGVkIGltYWdlcyBsaW5raW5nIHRvIGV4dGVybmFsIGhvc3RzLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCd4bGluazpocmVmJyk7XG4gICAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgneGxpbms6aHJlZicsIGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpKTtcbiAgICAgICAgICAgICAgICAgICAgbGVmdC0tO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoaW1hZ2VzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0eWxlcyhkb20pIHtcbiAgICAgICAgdmFyIGNzcyA9IFwiXCI7XG4gICAgICAgIHZhciBzaGVldHMgPSBkb2N1bWVudC5zdHlsZVNoZWV0cztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaGVldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBydWxlcyA9IHNoZWV0c1tpXS5jc3NSdWxlcztcbiAgICAgICAgICAgIGlmIChydWxlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBydWxlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcnVsZSA9IHJ1bGVzW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHJ1bGUuc3R5bGUpICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzcyArPSBydWxlLnNlbGVjdG9yVGV4dCArIFwiIHsgXCIgKyBydWxlLnN0eWxlLmNzc1RleHQgKyBcIiB9XFxuXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHMuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgIHMuaW5uZXJIVE1MID0gXCI8IVtDREFUQVtcXG5cIiArIGNzcyArIFwiXFxuXV0+XCI7XG5cbiAgICAgICAgdmFyIGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkZWZzJyk7XG4gICAgICAgIGRlZnMuYXBwZW5kQ2hpbGQocyk7XG4gICAgICAgIHJldHVybiBkZWZzO1xuICAgIH1cblxuICAgIG91dCQuc3ZnQXNEYXRhVXJpID0gZnVuY3Rpb24oZWwsIHNjYWxlRmFjdG9yLCBjYikge1xuICAgICAgICBzY2FsZUZhY3RvciA9IHNjYWxlRmFjdG9yIHx8IDE7XG5cbiAgICAgICAgaW5saW5lSW1hZ2VzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IGVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHBhcnNlSW50KFxuICAgICAgICAgICAgICAgIGNsb25lLmdldEF0dHJpYnV0ZSgnd2lkdGgnKVxuICAgICAgICAgICAgICAgIHx8IGNsb25lLnN0eWxlLndpZHRoXG4gICAgICAgICAgICAgICAgfHwgb3V0JC5nZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IHBhcnNlSW50KFxuICAgICAgICAgICAgICAgIGNsb25lLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JylcbiAgICAgICAgICAgICAgICB8fCBjbG9uZS5zdHlsZS5oZWlnaHRcbiAgICAgICAgICAgICAgICB8fCBvdXQkLmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgeG1sbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCI7XG5cbiAgICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShcInZlcnNpb25cIiwgXCIxLjFcIik7XG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGVOUyh4bWxucywgXCJ4bWxuc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpO1xuICAgICAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlTlMoeG1sbnMsIFwieG1sbnM6eGxpbmtcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIpO1xuICAgICAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgd2lkdGggKiBzY2FsZUZhY3Rvcik7XG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgaGVpZ2h0ICogc2NhbGVGYWN0b3IpO1xuICAgICAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCBcIjAgMCBcIiArIHdpZHRoICsgXCIgXCIgKyBoZWlnaHQpO1xuICAgICAgICAgICAgb3V0ZXIuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuXG4gICAgICAgICAgICBjbG9uZS5pbnNlcnRCZWZvcmUoc3R5bGVzKGNsb25lKSwgY2xvbmUuZmlyc3RDaGlsZCk7XG5cbiAgICAgICAgICAgIHZhciBzdmcgPSBkb2N0eXBlICsgb3V0ZXIuaW5uZXJIVE1MO1xuICAgICAgICAgICAgdmFyIHVyaSA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCcgKyB3aW5kb3cuYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3ZnKSkpO1xuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICAgY2IodXJpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3V0JC5zYXZlU3ZnQXNQbmcgPSBmdW5jdGlvbihlbCwgbmFtZSwgc2NhbGVGYWN0b3IpIHtcbiAgICAgICAgb3V0JC5zdmdBc0RhdGFVcmkoZWwsIHNjYWxlRmFjdG9yLCBmdW5jdGlvbih1cmkpIHtcbiAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gdXJpO1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGltYWdlLndpZHRoO1xuICAgICAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgICAgICBhLmRvd25sb2FkID0gbmFtZTtcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICAgICAgICAgIGEuY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSkoKTsiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NoYXJ0JywgKCRsb2csIGNoYXJ0LCAkZmlsdGVyKSAtPlxuICBjaGFydENudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogJ2NoYXJ0J1xuICAgIHNjb3BlOlxuICAgICAgZGF0YTogJz0nXG4gICAgICBmaWx0ZXI6ICc9J1xuICAgIGNvbnRyb2xsZXI6ICgpIC0+XG4gICAgICB0aGlzLm1lID0gY2hhcnQoKVxuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIG1lID0gY29udHJvbGxlci5tZVxuXG4gICAgICBkZWVwV2F0Y2ggPSBmYWxzZVxuICAgICAgd2F0Y2hlclJlbW92ZUZuID0gdW5kZWZpbmVkXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgICBfZmlsdGVyID0gdW5kZWZpbmVkXG5cbiAgICAgIG1lLmNvbnRhaW5lcigpLmVsZW1lbnQoZWxlbWVudFswXSlcblxuICAgICAgbWUubGlmZUN5Y2xlKCkuY29uZmlndXJlKClcblxuICAgICAgbWUubGlmZUN5Y2xlKCkub24gJ3Njb3BlQXBwbHknLCAoKSAtPlxuICAgICAgICBzY29wZS4kYXBwbHkoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndG9vbHRpcHMnLCAodmFsKSAtPlxuICAgICAgICBtZS50b29sVGlwVGVtcGxhdGUoJycpXG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZCBhbmQgKHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnKVxuICAgICAgICAgIG1lLnNob3dUb29sdGlwKHRydWUpXG4gICAgICAgIGVsc2UgaWYgdmFsLmxlbmd0aCA+IDAgYW5kIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICBtZS50b29sVGlwVGVtcGxhdGUodmFsKVxuICAgICAgICAgIG1lLnNob3dUb29sdGlwKHRydWUpXG4gICAgICAgIGVsc2Ugc2hvd1Rvb2xUaXAoZmFsc2UpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdhbmltYXRpb25EdXJhdGlvbicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgXy5pc051bWJlcigrdmFsKSBhbmQgK3ZhbCA+PSAwXG4gICAgICAgICAgbWUuYW5pbWF0aW9uRHVyYXRpb24odmFsKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndGl0bGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBtZS50aXRsZSh2YWwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS50aXRsZSh1bmRlZmluZWQpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdzdWJ0aXRsZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIG1lLnN1YlRpdGxlKHZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnN1YlRpdGxlKHVuZGVmaW5lZClcblxuICAgICAgc2NvcGUuJHdhdGNoICdmaWx0ZXInLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBfZmlsdGVyID0gdmFsICMgc2NvcGUuJGV2YWwodmFsKVxuICAgICAgICAgIGlmIF9kYXRhXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKCRmaWx0ZXIoJ2ZpbHRlcicpKF9kYXRhLCBfZmlsdGVyKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9maWx0ZXIgPSB1bmRlZmluZWRcbiAgICAgICAgICBpZiBfZGF0YVxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YShfZGF0YSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RlZXBXYXRjaCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZCBhbmQgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgIGRlZXBXYXRjaCA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlZXBXYXRjaCA9IGZhbHNlXG4gICAgICAgIGlmIHdhdGNoZXJSZW1vdmVGblxuICAgICAgICAgIHdhdGNoZXJSZW1vdmVGbigpXG4gICAgICAgIHdhdGNoZXJSZW1vdmVGbiA9IHNjb3BlLiR3YXRjaCAnZGF0YScsIGRhdGFXYXRjaEZuLCBkZWVwV2F0Y2hcblxuICAgICAgZGF0YVdhdGNoRm4gPSAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBfZGF0YSA9IHZhbFxuICAgICAgICAgIGlmIF8uaXNBcnJheShfZGF0YSkgYW5kIF9kYXRhLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuXG4gICAgICAgICAgaWYgX2ZpbHRlclxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YSgkZmlsdGVyKCdmaWx0ZXInKSh2YWwsIF9maWx0ZXIpKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEodmFsKVxuXG4gICAgICB3YXRjaGVyUmVtb3ZlRm4gPSBzY29wZS4kd2F0Y2ggJ2RhdGEnLCBkYXRhV2F0Y2hGbiwgZGVlcFdhdGNoXG5cbiAgICAgICMgY2xlYW51cCB3aGVuIGRlc3Ryb3llZFxuXG4gICAgICBlbGVtZW50Lm9uICckZGVzdHJveScsICgpIC0+XG4gICAgICAgIGlmIHdhdGNoZXJSZW1vdmVGblxuICAgICAgICAgIHdhdGNoZXJSZW1vdmVGbigpXG4gICAgICAgICRsb2cubG9nICdEZXN0cm95aW5nIGNoYXJ0J1xuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsYXlvdXQnLCAoJGxvZywgbGF5b3V0LCBjb250YWluZXIpIC0+XG4gIGxheW91dENudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJ1xuICAgIHJlcXVpcmU6IFsnbGF5b3V0JywnXmNoYXJ0J11cblxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBsYXlvdXQoKVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuXG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBtZS5jaGFydChjaGFydClcblxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgbGF5b3V0IGlkOicsIG1lLmlkKCksICdjaGFydDonLCBjaGFydC5pZCgpXG4gICAgICBjaGFydC5hZGRMYXlvdXQobWUpXG4gICAgICBjaGFydC5jb250YWluZXIoKS5hZGRMYXlvdXQobWUpXG4gICAgICBtZS5jb250YWluZXIoY2hhcnQuY29udGFpbmVyKCkpXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncHJpbnRCdXR0b24nLCAoJGxvZykgLT5cblxuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6J2NoYXJ0J1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICBsaW5rOihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgZHJhdyA9ICgpIC0+XG4gICAgICAgIF9jb250YWluZXJEaXYgPSBkMy5zZWxlY3QoY2hhcnQuY29udGFpbmVyKCkuZWxlbWVudCgpKS5zZWxlY3QoJ2Rpdi53ay1jaGFydCcpXG4gICAgICAgIF9jb250YWluZXJEaXYuYXBwZW5kKCdidXR0b24nKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LXByaW50LWJ1dHRvbicpXG4gICAgICAgICAgLnN0eWxlKHtwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6MCwgcmlnaHQ6MH0pXG4gICAgICAgICAgLnRleHQoJ1ByaW50JylcbiAgICAgICAgICAub24gJ2NsaWNrJywgKCktPlxuICAgICAgICAgICAgJGxvZy5sb2cgJ0NsaWNrZWQgUHJpbnQgQnV0dG9uJ1xuXG4gICAgICAgICAgICBzdmcgID0gX2NvbnRhaW5lckRpdi5zZWxlY3QoJ3N2Zy53ay1jaGFydCcpLm5vZGUoKVxuICAgICAgICAgICAgc2F2ZVN2Z0FzUG5nKHN2ZywgJ3ByaW50LnBuZycsNSlcblxuXG4gICAgICBjaGFydC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0LnByaW50JywgZHJhd1xuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzZWxlY3Rpb24nLCAoJGxvZykgLT5cbiAgb2JqSWQgPSAwXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgc2NvcGU6XG4gICAgICBzZWxlY3RlZERvbWFpbjogJz0nXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlLnNlbGVjdGlvbicsIC0+XG5cbiAgICAgICAgX3NlbGVjdGlvbiA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF9zZWxlY3Rpb24uYWN0aXZlKHRydWUpXG4gICAgICAgIF9zZWxlY3Rpb24ub24gJ3NlbGVjdGVkJywgKHNlbGVjdGVkT2JqZWN0cykgLT5cbiAgICAgICAgICBzY29wZS5zZWxlY3RlZERvbWFpbiA9IHNlbGVjdGVkT2JqZWN0c1xuICAgICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZpbHRlciAndHRGb3JtYXQnLCAoJGxvZyxmb3JtYXREZWZhdWx0cykgLT5cbiAgcmV0dXJuICh2YWx1ZSwgZm9ybWF0KSAtPlxuICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnb2JqZWN0JyBhbmQgdmFsdWUuZ2V0VVRDRGF0ZVxuICAgICAgZGYgPSBkMy50aW1lLmZvcm1hdChmb3JtYXREZWZhdWx0cy5kYXRlKVxuICAgICAgcmV0dXJuIGRmKHZhbHVlKVxuICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJyBvciBub3QgaXNOYU4oK3ZhbHVlKVxuICAgICAgZGYgPSBkMy5mb3JtYXQoZm9ybWF0RGVmYXVsdHMubnVtYmVyKVxuICAgICAgcmV0dXJuIGRmKCt2YWx1ZSlcbiAgICByZXR1cm4gdmFsdWUiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWEnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF9kYXRhT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzTmV3ID0gW11cbiAgICAgIF9wYXRoQXJyYXkgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIF9pZCA9ICdsaW5lJyArIGxpbmVDbnRyKytcbiAgICAgIGFyZWEgPSB1bmRlZmluZWRcbiAgICAgIGFyZWFCcnVzaCA9IHVuZGVmaW5lZFxuXG4gICAgICAjLS0tIFRvb2x0aXAgaGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRFbnRlciA9IChpZHgpIC0+XG4gICAgICAgIF9wYXRoQXJyYXkgPSBfLnRvQXJyYXkoX3BhdGhWYWx1ZXNOZXcpXG4gICAgICAgIHR0TW92ZURhdGEuYXBwbHkodGhpcywgW2lkeF0pXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IF9wYXRoQXJyYXkubWFwKChsKSAtPiB7bmFtZTpsW2lkeF0ua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobFtpZHhdLnl2KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbFtpZHhdLmNvbG9yfSwgeHY6bFtpZHhdLnh2fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKHR0TGF5ZXJzWzBdLnh2KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKF9wYXRoQXJyYXksIChkKSAtPiBkW2lkeF0ua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkW2lkeF0uY29sb3IpXG4gICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gZFtpZHhdLnkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X3NjYWxlTGlzdC54LnNjYWxlKCkoX3BhdGhBcnJheVswXVtpZHhdLnh2KSArIG9mZnNldH0pXCIpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIG1lcmdlZFggPSB1dGlscy5tZXJnZVNlcmllc1NvcnRlZCh4LnZhbHVlKF9kYXRhT2xkKSwgeC52YWx1ZShkYXRhKSlcbiAgICAgICAgX2xheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBbXVxuXG4gICAgICAgIF9wYXRoVmFsdWVzTmV3ID0ge31cblxuICAgICAgICBmb3Iga2V5IGluIF9sYXllcktleXNcbiAgICAgICAgICBfcGF0aFZhbHVlc05ld1trZXldID0gZGF0YS5tYXAoKGQpLT4ge3g6eC5tYXAoZCkseTp5LnNjYWxlKCkoeS5sYXllclZhbHVlKGQsIGtleSkpLCB4djp4LnZhbHVlKGQpLCB5djp5LmxheWVyVmFsdWUoZCxrZXkpLCBrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIGRhdGE6ZH0pXG5cbiAgICAgICAgICBvbGRGaXJzdCA9IG5ld0ZpcnN0ID0gdW5kZWZpbmVkXG5cbiAgICAgICAgICBsYXllciA9IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOltdfVxuICAgICAgICAgICMgZmluZCBzdGFydGluZyB2YWx1ZSBmb3Igb2xkXG4gICAgICAgICAgaSA9IDBcbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMF0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgb2xkRmlyc3QgPSBfcGF0aFZhbHVlc09sZFtrZXldW21lcmdlZFhbaV1bMF1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcbiAgICAgICAgICAjIGZpbmQgc3RhcnRpbmcgdmFsdWUgZm9yIG5ld1xuXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFgubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRYW2ldWzFdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG5ld0ZpcnN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVttZXJnZWRYW2ldWzFdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICBmb3IgdmFsLCBpIGluIG1lcmdlZFhcbiAgICAgICAgICAgIHYgPSB7Y29sb3I6bGF5ZXIuY29sb3IsIHg6dmFsWzJdfVxuICAgICAgICAgICAgIyBzZXQgeCBhbmQgeSB2YWx1ZXMgZm9yIG9sZCB2YWx1ZXMuIElmIHRoZXJlIGlzIGEgYWRkZWQgdmFsdWUsIG1haW50YWluIHRoZSBsYXN0IHZhbGlkIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiB2YWxbMV0gaXMgdW5kZWZpbmVkICNpZSBhbiBvbGQgdmFsdWUgaXMgZGVsZXRlZCwgbWFpbnRhaW4gdGhlIGxhc3QgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgIHYueU5ldyA9IG5ld0ZpcnN0LnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gbmV3Rmlyc3QueCAjIGFuaW1hdGUgdG8gdGhlIHByZWRlc2Vzc29ycyBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi5kZWxldGVkID0gdHJ1ZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2LnlOZXcgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV0ueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV0ueFxuICAgICAgICAgICAgICBuZXdGaXJzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXVxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiBfZGF0YU9sZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgIGlmICB2YWxbMF0gaXMgdW5kZWZpbmVkICMgaWUgYSBuZXcgdmFsdWUgaGFzIGJlZW4gYWRkZWRcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBvbGRGaXJzdC55XG4gICAgICAgICAgICAgICAgdi54T2xkID0gb2xkRmlyc3QueCAjIHN0YXJ0IHgtYW5pbWF0aW9uIGZyb20gdGhlIHByZWRlY2Vzc29ycyBvbGQgcG9zaXRpb25cbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHYueU9sZCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS55XG4gICAgICAgICAgICAgICAgdi54T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnhcbiAgICAgICAgICAgICAgICBvbGRGaXJzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2LnhPbGQgPSB2LnhOZXdcbiAgICAgICAgICAgICAgdi55T2xkID0gdi55TmV3XG5cblxuICAgICAgICAgICAgbGF5ZXIudmFsdWUucHVzaCh2KVxuXG4gICAgICAgICAgX2xheW91dC5wdXNoKGxheWVyKVxuXG4gICAgICAgIG9mZnNldCA9IGlmIHguaXNPcmRpbmFsKCkgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGFyZWFPbGQgPSBkMy5zdmcuYXJlYSgpXG4gICAgICAgICAgLngoKGQpIC0+ICBkLnhPbGQpXG4gICAgICAgICAgLnkwKChkKSAtPiAgZC55T2xkKVxuICAgICAgICAgIC55MSgoZCkgLT4gIHkuc2NhbGUoKSgwKSlcblxuICAgICAgICBhcmVhTmV3ID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAgIC54KChkKSAtPiAgZC54TmV3KVxuICAgICAgICAgIC55MCgoZCkgLT4gIGQueU5ldylcbiAgICAgICAgICAueTEoKGQpIC0+ICB5LnNjYWxlKCkoMCkpXG5cbiAgICAgICAgYXJlYUJydXNoID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAgIC54KChkKSAtPiAgeC5zY2FsZSgpKGQueCkpXG4gICAgICAgICAgLnkwKChkKSAtPiAgZC55TmV3KVxuICAgICAgICAgIC55MSgoZCkgLT4gIHkuc2NhbGUoKSgwKSlcblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZnJvbScsIFwidHJhbnNsYXRlKCN7b2Zmc2V0fSlcIilcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWFPbGQoZC52YWx1ZSkpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYU5ldyhkLnZhbHVlKSlcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgX2RhdGFPbGQgPSBkYXRhXG4gICAgICAgIF9wYXRoVmFsdWVzT2xkID0gX3BhdGhWYWx1ZXNOZXdcblxuICAgICAgYnJ1c2ggPSAoYXhpcywgaWR4UmFuZ2UpIC0+XG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgIGlmIGF4aXMuaXNPcmRpbmFsKClcbiAgICAgICAgICBsYXllcnMuYXR0cignZCcsIChkKSAtPiBhcmVhQnJ1c2goZC52YWx1ZS5zbGljZShpZHhSYW5nZVswXSxpZHhSYW5nZVsxXSArIDEpKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycy5hdHRyKCdkJywgKGQpIC0+IGFyZWFCcnVzaChkLnZhbHVlKSlcblxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC54KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWFTdGFja2VkJywgKCRsb2csIHV0aWxzKSAtPlxuICBzdGFja2VkQXJlYUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKClcbiAgICAgIG9mZnNldCA9ICd6ZXJvJ1xuICAgICAgbGF5ZXJzID0gbnVsbFxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBsYXllckRhdGEgPSBbXVxuICAgICAgbGF5b3V0TmV3ID0gW11cbiAgICAgIGxheW91dE9sZCA9IFtdXG4gICAgICBsYXllcktleXNPbGQgPSBbXVxuICAgICAgYXJlYSA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlZFN1Y2MgPSB7fVxuICAgICAgYWRkZWRQcmVkID0ge31cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIHNjYWxlWSA9IHVuZGVmaW5lZFxuICAgICAgb2ZmcyA9IDBcbiAgICAgIF9pZCA9ICdhcmVhU3RhY2tlZCcgKyBzdGFja2VkQXJlYUNudHIrK1xuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gbGF5ZXJEYXRhLm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLmxheWVyW2lkeF0ueXkpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueClcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShsYXllckRhdGEsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gc2NhbGVZKGQubGF5ZXJbaWR4XS55ICsgZC5sYXllcltpZHhdLnkwKSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19zY2FsZUxpc3QueC5zY2FsZSgpKGxheWVyRGF0YVswXS5sYXllcltpZHhdLngpK29mZnN9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRMYXllckJ5S2V5ID0gKGtleSwgbGF5b3V0KSAtPlxuICAgICAgICBmb3IgbCBpbiBsYXlvdXRcbiAgICAgICAgICBpZiBsLmtleSBpcyBrZXlcbiAgICAgICAgICAgIHJldHVybiBsXG5cbiAgICAgIHN0YWNrTGF5b3V0ID0gc3RhY2sudmFsdWVzKChkKS0+ZC5sYXllcikueSgoZCkgLT4gZC55eSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBBcmVhIENoYXJ0XCJcblxuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG5cbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IGRhdGEubWFwKChkKSAtPiB7eDogeC52YWx1ZShkKSwgeXk6ICt5LmxheWVyVmFsdWUoZCxrKSwgeTA6IDAsIGRhdGE6ZH0pfSkgIyB5eTogbmVlZCB0byBhdm9pZCBvdmVyd3JpdGluZyBieSBsYXlvdXQgY2FsYyAtPiBzZWUgc3RhY2sgeSBhY2Nlc3NvclxuICAgICAgICBsYXlvdXROZXcgPSBzdGFja0xheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgb2ZmcyA9IGlmIHguaXNPcmRpbmFsKCkgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBpZiBvZmZzZXQgaXMgJ2V4cGFuZCdcbiAgICAgICAgICBzY2FsZVkgPSB5LnNjYWxlKCkuY29weSgpXG4gICAgICAgICAgc2NhbGVZLmRvbWFpbihbMCwgMV0pXG4gICAgICAgIGVsc2Ugc2NhbGVZID0geS5zY2FsZSgpXG5cbiAgICAgICAgYXJlYSA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55MCgoZCkgLT4gIHNjYWxlWShkLnkwICsgZC55KSlcbiAgICAgICAgICAueTEoKGQpIC0+ICBzY2FsZVkoZC55MCkpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEobGF5b3V0TmV3LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgaWYgbGF5b3V0T2xkLmxlbmd0aCBpcyAwXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSkuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBpZiBhZGRlZFByZWRbZC5rZXldIHRoZW4gZ2V0TGF5ZXJCeUtleShhZGRlZFByZWRbZC5rZXldLCBsYXlvdXRPbGQpLnBhdGggZWxzZSBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiAge3g6IHAueCwgeTogMCwgeTA6IDB9KSkpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29mZnN9KVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC5sYXllcikpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG5cblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBzdWNjID0gZGVsZXRlZFN1Y2NbZC5rZXldXG4gICAgICAgICAgICBpZiBzdWNjIHRoZW4gYXJlYShnZXRMYXllckJ5S2V5KHN1Y2MsIGxheW91dE5ldykubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55MH0pKSBlbHNlIGFyZWEobGF5b3V0TmV3W2xheW91dE5ldy5sZW5ndGggLSAxXS5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkwICsgcC55fSkpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICBicnVzaCA9IChheGlzLCBpZHhSYW5nZSkgLT5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtYXJlYVwiKVxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQubGF5ZXIpKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LngpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXJlYVN0YWNrZWQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaW4gWyd6ZXJvJywgJ3NpbGhvdWV0dGUnLCAnZXhwYW5kJywgJ3dpZ2dsZSddXG4gICAgICAgICAgb2Zmc2V0ID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvZmZzZXQgPSBcInplcm9cIlxuICAgICAgICBzdGFjay5vZmZzZXQob2Zmc2V0KVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBlbnRlciAvIGV4aXQgYW5pbWF0aW9ucyBsaWtlIGluIGxpbmVcbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhU3RhY2tlZFZlcnRpY2FsJywgKCRsb2csIHV0aWxzKSAtPlxuICBhcmVhU3RhY2tlZFZlcnRDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpXG4gICAgICBvZmZzZXQgPSAnemVybydcbiAgICAgIGxheWVycyA9IG51bGxcbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgbGF5ZXJEYXRhID0gW11cbiAgICAgIGxheW91dE5ldyA9IFtdXG4gICAgICBsYXlvdXRPbGQgPSBbXVxuICAgICAgbGF5ZXJLZXlzT2xkID0gW11cbiAgICAgIGFyZWEgPSB1bmRlZmluZWRcbiAgICAgIGRlbGV0ZWRTdWNjID0ge31cbiAgICAgIGFkZGVkUHJlZCA9IHt9XG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBzY2FsZVggPSB1bmRlZmluZWRcbiAgICAgIG9mZnMgPSAwXG4gICAgICBfaWQgPSAnYXJlYS1zdGFja2VkLXZlcnQnICsgYXJlYVN0YWNrZWRWZXJ0Q250cisrXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBsYXllckRhdGEubWFwKChsKSAtPiB7bmFtZTpsLmtleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwubGF5ZXJbaWR4XS54eCksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsYXllckRhdGFbMF0ubGF5ZXJbaWR4XS55eSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShsYXllckRhdGEsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3gnLCAoZCkgLT4gc2NhbGVYKGQubGF5ZXJbaWR4XS55ICsgZC5sYXllcltpZHhdLnkwKSkgICMgd2VpcmQhISEgaG93ZXZlciwgdGhlIGRhdGEgaXMgZm9yIGEgaG9yaXpvbnRhbCBjaGFydCB3aGljaCBnZXRzIHRyYW5zZm9ybWVkXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKGxheWVyRGF0YVswXS5sYXllcltpZHhdLnl5KStvZmZzfSlcIilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZ2V0TGF5ZXJCeUtleSA9IChrZXksIGxheW91dCkgLT5cbiAgICAgICAgZm9yIGwgaW4gbGF5b3V0XG4gICAgICAgICAgaWYgbC5rZXkgaXMga2V5XG4gICAgICAgICAgICByZXR1cm4gbFxuXG4gICAgICBsYXlvdXQgPSBzdGFjay52YWx1ZXMoKGQpLT5kLmxheWVyKS55KChkKSAtPiBkLnh4KVxuXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIyNcbiAgICAgIHByZXBEYXRhID0gKHgseSxjb2xvcikgLT5cblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueSArIHAueTB9KSl9KVxuICAgICAgICBsYXllcktleXNPbGQgPSBsYXllcktleXNcblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhAKVxuICAgICAgICBsYXllckRhdGEgPSBsYXllcktleXMubWFwKChrKSA9PiB7a2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBsYXllcjogQG1hcCgoZCkgLT4ge3g6IHgudmFsdWUoZCksIHl5OiAreS5sYXllclZhbHVlKGQsayksIHkwOiAwfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgICNsYXlvdXROZXcgPSBsYXlvdXQobGF5ZXJEYXRhKVxuXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG4gICAgICAjIyNcbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgQXJlYSBDaGFydFwiXG5cblxuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBkZWxldGVkU3VjYyA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzT2xkLCBsYXllcktleXMsIDEpXG4gICAgICAgIGFkZGVkUHJlZCA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzLCBsYXllcktleXNPbGQsIC0xKVxuXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBkYXRhLm1hcCgoZCkgLT4ge3l5OiB5LnZhbHVlKGQpLCB4eDogK3gubGF5ZXJWYWx1ZShkLGspLCB5MDogMCwgZGF0YTpkfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgIGxheW91dE5ldyA9IGxheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgb2ZmcyA9IGlmIHkuaXNPcmRpbmFsKCkgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBpZiBvZmZzZXQgaXMgJ2V4cGFuZCdcbiAgICAgICAgICBzY2FsZVggPSB4LnNjYWxlKCkuY29weSgpXG4gICAgICAgICAgc2NhbGVYLmRvbWFpbihbMCwgMV0pXG4gICAgICAgIGVsc2Ugc2NhbGVYID0geC5zY2FsZSgpXG5cbiAgICAgICAgYXJlYSA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIHkuc2NhbGUoKShkLnl5KSlcbiAgICAgICAgICAueTAoKGQpIC0+ICBzY2FsZVgoZC55MCArIGQueSkpXG4gICAgICAgICAgLnkxKChkKSAtPiAgc2NhbGVYKGQueTApKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKGxheW91dE5ldywgKGQpIC0+IGQua2V5KVxuXG4gICAgICAgIGlmIGxheW91dE9sZC5sZW5ndGggaXMgMFxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gaWYgYWRkZWRQcmVkW2Qua2V5XSB0aGVuIGdldExheWVyQnlLZXkoYWRkZWRQcmVkW2Qua2V5XSwgbGF5b3V0T2xkKS5wYXRoIGVsc2UgYXJlYShkLmxheWVyLm1hcCgocCkgLT4gIHt5eTogcC55eSwgeTogMCwgeTA6IDB9KSkpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZSg5MCkgc2NhbGUoMSwtMSlcIilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQubGF5ZXIpKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKVxuXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPlxuICAgICAgICAgICAgc3VjYyA9IGRlbGV0ZWRTdWNjW2Qua2V5XVxuICAgICAgICAgICAgaWYgc3VjYyB0aGVuIGFyZWEoZ2V0TGF5ZXJCeUtleShzdWNjLCBsYXlvdXROZXcpLmxheWVyLm1hcCgocCkgLT4ge3l5OiBwLnl5LCB5OiAwLCB5MDogcC55MH0pKSBlbHNlIGFyZWEobGF5b3V0TmV3W2xheW91dE5ldy5sZW5ndGggLSAxXS5sYXllci5tYXAoKHApIC0+IHt5eTogcC55eSwgeTogMCwgeTA6IHAueTAgKyBwLnl9KSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgbGF5b3V0T2xkID0gbGF5b3V0TmV3Lm1hcCgoZCkgLT4ge2tleTogZC5rZXksIHBhdGg6IGFyZWEoZC5sYXllci5tYXAoKHApIC0+IHt5eTogcC55eSwgeTogMCwgeTA6IHAueSArIHAueTB9KSl9KVxuICAgICAgICBsYXllcktleXNPbGQgPSBsYXllcktleXNcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd4JykuZG9tYWluQ2FsYygndG90YWwnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC55KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2FyZWFTdGFja2VkVmVydGljYWwnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaW4gWyd6ZXJvJywgJ3NpbGhvdWV0dGUnLCAnZXhwYW5kJywgJ3dpZ2dsZSddXG4gICAgICAgICAgb2Zmc2V0ID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvZmZzZXQgPSBcInplcm9cIlxuICAgICAgICBzdGFjay5vZmZzZXQob2Zmc2V0KVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBlbnRlciAvIGV4aXQgYW5pbWF0aW9ucyBsaWtlIGluIGxpbmVcbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhVmVydGljYWwnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF9kYXRhT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzTmV3ID0gW11cbiAgICAgIF9wYXRoQXJyYXkgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIGFyZWFCcnVzaCA9IHVuZGVmaW5lZFxuICAgICAgYnJ1c2hTdGFydElkeCA9IDBcbiAgICAgIF9pZCA9ICdhcmVhJyArIGxpbmVDbnRyKytcblxuICAgICAgIy0tLSBUb29sdGlwIGhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoaWR4KSAtPlxuICAgICAgICBfcGF0aEFycmF5ID0gXy50b0FycmF5KF9wYXRoVmFsdWVzTmV3KVxuICAgICAgICB0dE1vdmVEYXRhLmFwcGx5KHRoaXMsIFtpZHhdKVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgb2ZmcyA9IGlkeCArIGJydXNoU3RhcnRJZHhcbiAgICAgICAgdHRMYXllcnMgPSBfcGF0aEFycmF5Lm1hcCgobCkgLT4ge25hbWU6bFtvZmZzXS5rZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsW29mZnNdLnh2KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbFtvZmZzXS5jb2xvcn0sIHl2Omxbb2Zmc10ueXZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueXYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgb2ZmcyA9IGlkeCArIGJydXNoU3RhcnRJZHhcbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbb2Zmc10ua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZFtvZmZzXS5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeCcsIChkKSAtPiBkW29mZnNdLngpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICBvID0gaWYgX3NjYWxlTGlzdC55LmlzT3JkaW5hbCB0aGVuIF9zY2FsZUxpc3QueS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7X3NjYWxlTGlzdC55LnNjYWxlKCkoX3BhdGhBcnJheVswXVtvZmZzXS55dikgKyBvfSlcIikgIyBuZWVkIHRvIGNvbXB1dGUgZm9ybSBzY2FsZSBiZWNhdXNlIG9mIGJydXNoaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIGlmIHkuaXNPcmRpbmFsKClcbiAgICAgICAgICBtZXJnZWRZID0gdXRpbHMubWVyZ2VTZXJpZXNVbnNvcnRlZCh5LnZhbHVlKF9kYXRhT2xkKSwgeS52YWx1ZShkYXRhKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lcmdlZFkgPSB1dGlscy5tZXJnZVNlcmllc1NvcnRlZCh5LnZhbHVlKF9kYXRhT2xkKSwgeS52YWx1ZShkYXRhKSlcbiAgICAgICAgX2xheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgICBfcGF0aFZhbHVlc05ldyA9IHt9XG5cbiAgICAgICAgI19sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt5OnkudmFsdWUoZCkseDp4LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgICBmb3Iga2V5IGluIF9sYXllcktleXNcbiAgICAgICAgICBfcGF0aFZhbHVlc05ld1trZXldID0gZGF0YS5tYXAoKGQpLT4ge3k6eS5tYXAoZCksIHg6eC5zY2FsZSgpKHgubGF5ZXJWYWx1ZShkLCBrZXkpKSwgeXY6eS52YWx1ZShkKSwgeHY6eC5sYXllclZhbHVlKGQsa2V5KSwga2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCBkYXRhOmR9KVxuXG4gICAgICAgICAgbGF5ZXIgPSB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpbXX1cbiAgICAgICAgICAjIGZpbmQgc3RhcnRpbmcgdmFsdWUgZm9yIG9sZFxuICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFkubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRZW2ldWzBdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVttZXJnZWRZW2ldWzBdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWS5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFlbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3Rmlyc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW21lcmdlZFlbaV1bMV1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIGZvciB2YWwsIGkgaW4gbWVyZ2VkWVxuICAgICAgICAgICAgdiA9IHtjb2xvcjpsYXllci5jb2xvciwgeTp2YWxbMl19XG4gICAgICAgICAgICAjIHNldCB4IGFuZCB5IHZhbHVlcyBmb3Igb2xkIHZhbHVlcy4gSWYgdGhlcmUgaXMgYSBhZGRlZCB2YWx1ZSwgbWFpbnRhaW4gdGhlIGxhc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIHZhbFsxXSBpcyB1bmRlZmluZWQgI2llIGFuIG9sZCB2YWx1ZSBpcyBkZWxldGVkLCBtYWludGFpbiB0aGUgbGFzdCBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi55TmV3ID0gbmV3Rmlyc3QueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdGaXJzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0ZpcnN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIF9kYXRhT2xkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgaWYgIHZhbFswXSBpcyB1bmRlZmluZWQgIyBpZSBhIG5ldyB2YWx1ZSBoYXMgYmVlbiBhZGRlZFxuICAgICAgICAgICAgICAgIHYueU9sZCA9IG9sZEZpcnN0LnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRGaXJzdC54ICMgc3RhcnQgeC1hbmltYXRpb24gZnJvbSB0aGUgcHJlZGVjZXNzb3JzIG9sZCBwb3NpdGlvblxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueFxuICAgICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueE9sZCA9IHYueE5ld1xuICAgICAgICAgICAgICB2LnlPbGQgPSB2LnlOZXdcblxuXG4gICAgICAgICAgICBsYXllci52YWx1ZS5wdXNoKHYpXG5cbiAgICAgICAgICBfbGF5b3V0LnB1c2gobGF5ZXIpXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgYXJlYU9sZCA9IGQzLnN2Zy5hcmVhKCkgICAgIyB0cmlja3kuIERyYXcgdGhpcyBsaWtlIGEgdmVydGljYWwgY2hhcnQgYW5kIHRoZW4gcm90YXRlIGFuZCBwb3NpdGlvbiBpdC5cbiAgICAgICAgICAueCgoZCkgLT4gb3B0aW9ucy53aWR0aCAtIGQueU9sZClcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnhPbGQpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeC5zY2FsZSgpKDApKVxuXG4gICAgICAgIGFyZWFOZXcgPSBkMy5zdmcuYXJlYSgpICAgICMgdHJpY2t5LiBEcmF3IHRoaXMgbGlrZSBhIHZlcnRpY2FsIGNoYXJ0IGFuZCB0aGVuIHJvdGF0ZSBhbmQgcG9zaXRpb24gaXQuXG4gICAgICAgICAgLngoKGQpIC0+IG9wdGlvbnMud2lkdGggLSBkLnlOZXcpXG4gICAgICAgICAgLnkwKChkKSAtPiAgZC54TmV3KVxuICAgICAgICAgIC55MSgoZCkgLT4gIHguc2NhbGUoKSgwKSlcblxuICAgICAgICBhcmVhQnJ1c2ggPSBkMy5zdmcuYXJlYSgpICAgICMgdHJpY2t5LiBEcmF3IHRoaXMgbGlrZSBhIHZlcnRpY2FsIGNoYXJ0IGFuZCB0aGVuIHJvdGF0ZSBhbmQgcG9zaXRpb24gaXQuXG4gICAgICAgICAgLngoKGQpIC0+IG9wdGlvbnMud2lkdGggLSB5LnNjYWxlKCkoZC55KSlcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnhOZXcpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeC5zY2FsZSgpKDApKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7b3B0aW9ucy53aWR0aCArIG9mZnNldH0pcm90YXRlKC05MClcIikgI3JvdGF0ZSBhbmQgcG9zaXRpb24gY2hhcnRcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWFPbGQoZC52YWx1ZSkpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWFOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgX2RhdGFPbGQgPSBkYXRhXG4gICAgICAgIF9wYXRoVmFsdWVzT2xkID0gX3BhdGhWYWx1ZXNOZXdcblxuICAgICAgYnJ1c2ggPSAoYXhpcywgaWR4UmFuZ2UsIHdpZHRoLCBoZWlnaHQpIC0+XG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxpbmVcIilcbiAgICAgICAgaWYgYXhpcy5pc09yZGluYWwoKVxuICAgICAgICAgIGxheWVycy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7d2lkdGggKyBheGlzLnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyfSlyb3RhdGUoLTkwKVwiKVxuICAgICAgICAgIGxheWVycy5hdHRyKCdkJywgKGQpIC0+ICBhcmVhQnJ1c2goZC52YWx1ZS5zbGljZShpZHhSYW5nZVswXSwgaWR4UmFuZ2VbMV0gKyAxKSkpXG4gICAgICAgICAgYnJ1c2hTdGFydElkeCA9IGlkeFJhbmdlWzBdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMuYXR0cignZCcsIChkKSAtPiBhcmVhQnJ1c2goZC52YWx1ZSkpXG4gICAgICAgICNsYXllcnMuY2FsbChtYXJrZXJzLCAwKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC55KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJzJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpLT5cbiAgc0JhckNudHIgPSAwXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnQSdcbiAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgX2lkID0gXCJiYXJzI3tzQmFyQ250cisrfVwiXG5cbiAgICBiYXJzID0gbnVsbFxuICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuXG4gICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKClcbiAgICBfbWVyZ2UoW10pLmtleSgoZCkgLT4gZC5rZXkpXG5cbiAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG5cbiAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3QueC5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgIGlmIG5vdCBiYXJzXG4gICAgICAgIGJhcnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYmFycycpXG4gICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgc3RhY2tlZC1iYXJcIlxuXG4gICAgICBiYXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgbGF5b3V0ID0gZGF0YS5tYXAoKGQpIC0+IHtrZXk6eS52YWx1ZShkKSwgeDp4Lm1hcChkKSwgeTp5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCBoZWlnaHQ6eS5zY2FsZSgpLnJhbmdlQmFuZCh5LnZhbHVlKGQpKSwgZGF0YTpkfSlcblxuICAgICAgX21lcmdlKGxheW91dCkuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZ30pLmxhc3Qoe3k6MCwgaGVpZ2h0OmJhck91dGVyUGFkZGluZ09sZCAtIGJhclBhZGRpbmdPbGQgLyAyfSkgICN5LnNjYWxlKCkucmFuZ2UoKVt5LnNjYWxlKCkucmFuZ2UoKS5sZW5ndGgtMV1cblxuICAgICAgYmFycyA9IGJhcnMuZGF0YShsYXlvdXQsIChkKSAtPiBkLmtleSlcblxuICAgICAgZW50ZXIgPSBiYXJzLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1iYXInKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT4gXCJ0cmFuc2xhdGUoMCwgI3tpZiBpbml0aWFsIHRoZW4gZC55IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS55IC0gYmFyUGFkZGluZ09sZCAvIDJ9KSBzY2FsZSgxLCAje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0pXCIpXG4gICAgICBlbnRlci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVjdCB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgIy5hdHRyKCd5JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMilcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICBlbnRlci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLmhlaWdodCAvIDIgKVxuICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLnggKyAxMClcbiAgICAgICAgLmF0dHIoe2R5OiAnMC4zNWVtJywgJ3RleHQtYW5jaG9yJzonc3RhcnQnfSlcbiAgICAgICAgLnN0eWxlKHsnZm9udC1zaXplJzonMS4zZW0nLCBvcGFjaXR5OiAwfSlcblxuICAgICAgYmFycy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCAje2QueX0pIHNjYWxlKDEsMSlcIilcbiAgICAgIGJhcnMuc2VsZWN0KCdyZWN0JylcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBNYXRoLmFicyh4LnNjYWxlKCkoMCkgLSBkLngpKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICBiYXJzLnNlbGVjdCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1kYXRhLWxhYmVsJylcbiAgICAgICAgLnRleHQoKGQpIC0+IHguZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGQuaGVpZ2h0IC8gMilcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLnggKyAxMClcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBob3N0LnNob3dEYXRhTGFiZWxzKCkgdGhlbiAxIGVsc2UgMClcblxuXG4gICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDJ9KSBzY2FsZSgxLDApXCIpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgIGluaXRpYWwgPSBmYWxzZVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICBicnVzaCA9IChheGlzLCBpZHhSYW5nZSkgLT5cbiAgICAgIGJhcnNcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsICN7aWYgKHkgPSBheGlzLnNjYWxlKCkoZC5rZXkpKSA+PSAwIHRoZW4geSBlbHNlIC0xMDAwfSlcIilcbiAgICAgICAgLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXJlY3QnKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGF4aXMuc2NhbGUoKS5yYW5nZUJhbmQoKSlcbiAgICAgIGJhcnMuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3knLGF4aXMuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIpXG5cbiAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuXG4gICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgaG9zdC5zaG93RGF0YUxhYmVscyhmYWxzZSlcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJyBvciB2YWwgaXMgXCJcIlxuICAgICAgICBob3N0LnNob3dEYXRhTGFiZWxzKCd4JylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYmFyQ2x1c3RlcmVkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpLT5cblxuICBjbHVzdGVyZWRCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBfaWQgPSBcImNsdXN0ZXJlZEJhciN7Y2x1c3RlcmVkQmFyQ250cisrfVwiXG5cbiAgICAgIGxheWVycyA9IG51bGxcbiAgICAgIGNsdXN0ZXJZID0gdW5kZWZpbmVkXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQubGF5ZXJLZXkpXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG4gICAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmluZm8gXCJyZW5kZXJpbmcgY2x1c3RlcmVkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICAjIG1hcCBkYXRhIHRvIHRoZSByaWdodCBmb3JtYXQgZm9yIHJlbmRlcmluZ1xuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIGNsdXN0ZXJZID0gZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbih4LmxheWVyS2V5cyhkYXRhKSkucmFuZ2VCYW5kcyhbMCwgeS5zY2FsZSgpLnJhbmdlQmFuZCgpXSwgMCwgMClcblxuICAgICAgICBjbHVzdGVyID0gZGF0YS5tYXAoKGQpIC0+IGwgPSB7XG4gICAgICAgICAga2V5OnkudmFsdWUoZCksIGRhdGE6ZCwgeTp5Lm1hcChkKSwgaGVpZ2h0OiB5LnNjYWxlKCkucmFuZ2VCYW5kKHkudmFsdWUoZCkpXG4gICAgICAgICAgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7bGF5ZXJLZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGtleTp5LnZhbHVlKGQpLCB2YWx1ZTogZFtrXSwgeTpjbHVzdGVyWShrKSwgeDogeC5zY2FsZSgpKGRba10pLCB3aWR0aDp4LnNjYWxlKCkoZFtrXSksIGhlaWdodDpjbHVzdGVyWS5yYW5nZUJhbmQoayl9KX1cbiAgICAgICAgKVxuXG4gICAgICAgIF9tZXJnZShjbHVzdGVyKS5maXJzdCh7eTpvcHRpb25zLmhlaWdodCArIGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nLCBoZWlnaHQ6eS5zY2FsZSgpLnJhbmdlQmFuZCgpfSkubGFzdCh7eTowLCBoZWlnaHQ6YmFyT3V0ZXJQYWRkaW5nT2xkIC0gYmFyUGFkZGluZ09sZCAvIDJ9KVxuICAgICAgICBfbWVyZ2VMYXllcnMoY2x1c3RlclswXS5sYXllcnMpLmZpcnN0KHt5OjAsIGhlaWdodDowfSkubGFzdCh7eTpjbHVzdGVyWzBdLmhlaWdodCwgaGVpZ2h0OjB9KVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVycy5kYXRhKGNsdXN0ZXIsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYXllcicpLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT5cbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgIFwidHJhbnNsYXRlKDAsICN7aWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyfSkgc2NhbGUoMSwje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0pXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7ZC55fSkgc2NhbGUoMSwxKVwiKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsICN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDJ9KSBzY2FsZSgxLDApXCIpXG4gICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBiYXJzID0gbGF5ZXJzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgLmRhdGEoXG4gICAgICAgICAgICAoZCkgLT4gZC5sYXllcnNcbiAgICAgICAgICAsIChkKSAtPiBkLmxheWVyS2V5ICsgJ3wnICsgZC5rZXlcbiAgICAgICAgICApXG5cbiAgICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC55IGVsc2UgX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkKS55ICsgX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkKS5oZWlnaHQpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC5oZWlnaHQgZWxzZSAwKVxuICAgICAgICAgIC5hdHRyKCd4JywgeC5zY2FsZSgpKDApKVxuXG5cbiAgICAgICAgYmFycy5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5zY2FsZSgpKGQubGF5ZXJLZXkpKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLnkpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gTWF0aC5taW4oeC5zY2FsZSgpKDApLCBkLngpKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gTWF0aC5hYnMoZC5oZWlnaHQpKVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgIy5hdHRyKCd3aWR0aCcsMClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQpLnkpXG4gICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgIGRyYXdCcnVzaCA9IChheGlzLCBpZHhSYW5nZSkgLT5cbiAgICAgICAgY2x1c3RlclkucmFuZ2VCYW5kcyhbMCxheGlzLnNjYWxlKCkucmFuZ2VCYW5kKCldLCAwLCAwKVxuICAgICAgICBoZWlnaHQgPSBjbHVzdGVyWS5yYW5nZUJhbmQoKVxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwgI3tpZiAoeSA9IGF4aXMuc2NhbGUoKShkLmtleSkpID49IDAgdGhlbiB5IGVsc2UgLTEwMDB9KVwiKVxuICAgICAgICAgIC5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGNsdXN0ZXJZKGQubGF5ZXJLZXkpKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdCcnVzaFxuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgICAgX3NjYWxlTGlzdC55LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JhclN0YWNrZWQnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZykgLT5cblxuICBzdGFja2VkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBTdGFja2VkIGJhcidcblxuICAgICAgX2lkID0gXCJzdGFja2VkQ29sdW1uI3tzdGFja2VkQmFyQ250cisrfVwiXG5cbiAgICAgIGxheWVycyA9IG51bGxcblxuICAgICAgc3RhY2sgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSAoKS0+XG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgIyRsb2cuZGVidWcgXCJkcmF3aW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgc3RhY2sgPSBbXVxuICAgICAgICBmb3IgZCBpbiBkYXRhXG4gICAgICAgICAgeDAgPSAwXG4gICAgICAgICAgbCA9IHtrZXk6eS52YWx1ZShkKSwgbGF5ZXJzOltdLCBkYXRhOmQsIHk6eS5tYXAoZCksIGhlaWdodDppZiB5LnNjYWxlKCkucmFuZ2VCYW5kIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIGVsc2UgMX1cbiAgICAgICAgICBpZiBsLnkgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgIGwubGF5ZXJzID0gbGF5ZXJLZXlzLm1hcCgoaykgLT5cbiAgICAgICAgICAgICAgbGF5ZXIgPSB7bGF5ZXJLZXk6aywga2V5Omwua2V5LCB2YWx1ZTpkW2tdLCB3aWR0aDogeC5zY2FsZSgpKCtkW2tdKSwgaGVpZ2h0OiAoaWYgeS5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDEpLCB4OiB4LnNjYWxlKCkoK3gwKSwgY29sb3I6IGNvbG9yLnNjYWxlKCkoayl9XG4gICAgICAgICAgICAgIHgwICs9ICtkW2tdXG4gICAgICAgICAgICAgIHJldHVybiBsYXllclxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgc3RhY2sucHVzaChsKVxuXG4gICAgICAgIF9tZXJnZShzdGFjaykuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgaGVpZ2h0OjB9KS5sYXN0KHt5OjAsIGhlaWdodDpiYXJPdXRlclBhZGRpbmdPbGQgLSBiYXJQYWRkaW5nT2xkIC8gMn0pXG4gICAgICAgIF9tZXJnZUxheWVycyhsYXllcktleXMpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEoc3RhY2ssIChkKS0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKS5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7aWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyfSkgc2NhbGUoMSwje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0pXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JyxpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IHJldHVybiBcInRyYW5zbGF0ZSgwLCAje2QueX0pIHNjYWxlKDEsMSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueSArIF9tZXJnZS5kZWxldGVkU3VjYyhkKS5oZWlnaHQgKyBiYXJQYWRkaW5nIC8gMn0pIHNjYWxlKDEsMClcIilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBiYXJzID0gbGF5ZXJzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgLmRhdGEoXG4gICAgICAgICAgICAoZCkgLT4gZC5sYXllcnNcbiAgICAgICAgICAsIChkKSAtPiBkLmxheWVyS2V5ICsgJ3wnICsgZC5rZXlcbiAgICAgICAgICApXG5cbiAgICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPlxuICAgICAgICAgICAgaWYgX21lcmdlLnByZXYoZC5rZXkpXG4gICAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5hZGRlZFByZWQoZC5sYXllcktleSkpXG4gICAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLnByZXYoZC5rZXkpLmxheWVyc1tpZHhdLnggKyBfbWVyZ2UucHJldihkLmtleSkubGF5ZXJzW2lkeF0ud2lkdGggZWxzZSB4LnNjYWxlKCkoMClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZC54XG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBpZiBfbWVyZ2UucHJldihkLmtleSkgdGhlbiAwIGVsc2UgZC53aWR0aClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLngpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT5cbiAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkLmxheWVyS2V5KSlcbiAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tpZHhdLnggZWxzZSBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2xheWVyS2V5cy5sZW5ndGggLSAxXS54ICsgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ud2lkdGhcbiAgICAgICAgICApXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgIGRyYXdCcnVzaCA9IChheGlzLCBpZHhSYW5nZSkgLT5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsICN7aWYgKHggPSBheGlzLnNjYWxlKCkoZC5rZXkpKSA+PSAwIHRoZW4geCBlbHNlIC0xMDAwfSlcIilcbiAgICAgICAgICAuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gYXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdCcnVzaFxuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgICAgX3NjYWxlTGlzdC55LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdidWJibGUnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGJ1YmJsZUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgIyRsb2cuZGVidWcgJ2J1YmJsZUNoYXJ0IGxpbmtlZCdcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9pZCA9ICdidWJibGUnICsgYnViYmxlQ250cisrXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgZm9yIHNOYW1lLCBzY2FsZSBvZiBfc2NhbGVMaXN0XG4gICAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBzY2FsZS5heGlzTGFiZWwoKSwgdmFsdWU6IHNjYWxlLmZvcm1hdHRlZFZhbHVlKGRhdGEpLCBjb2xvcjogaWYgc05hbWUgaXMgJ2NvbG9yJyB0aGVuIHsnYmFja2dyb3VuZC1jb2xvcic6c2NhbGUubWFwKGRhdGEpfSBlbHNlIHVuZGVmaW5lZH0pXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplKSAtPlxuXG4gICAgICAgIGJ1YmJsZXMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYnViYmxlJykuZGF0YShkYXRhLCAoZCkgLT4gY29sb3IudmFsdWUoZCkpXG4gICAgICAgIGJ1YmJsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtYnViYmxlIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgIGJ1YmJsZXNcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3IubWFwKGQpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgICAgcjogIChkKSAtPiBzaXplLm1hcChkKVxuICAgICAgICAgICAgICBjeDogKGQpIC0+IHgubWFwKGQpXG4gICAgICAgICAgICAgIGN5OiAoZCkgLT4geS5tYXAoZClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICBidWJibGVzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InLCAnc2l6ZSddKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG5cbiAgfVxuXG4gICNUT0RPIHZlcmlmeSBhbmQgdGVzdCBjdXN0b20gdG9vbHRpcHMgYmVoYXZpb3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbHVtbicsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG4gIHNCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICByZXN0cmljdDogJ0EnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgIF9pZCA9IFwic2ltcGxlQ29sdW1uI3tzQmFyQ250cisrfVwiXG5cbiAgICBjb2x1bW5zID0gbnVsbFxuICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG4gICAgX21lcmdlKFtdKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgIGluaXRpYWwgPSB0cnVlXG4gICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICBjb25maWcgPSB7fVxuICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG5cbiAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG5cbiAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3QueS5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgIGlmIG5vdCBjb2x1bW5zXG4gICAgICAgIGNvbHVtbnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtY29sdW1uJylcbiAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBzdGFja2VkLWJhclwiXG5cbiAgICAgIGJhclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCkgLT4ge2RhdGE6ZCwga2V5OngudmFsdWUoZCksIHg6eC5tYXAoZCksIHk6TWF0aC5taW4oeS5zY2FsZSgpKDApLCB5Lm1hcChkKSksIGNvbG9yOmNvbG9yLm1hcChkKSwgd2lkdGg6eC5zY2FsZSgpLnJhbmdlQmFuZCh4LnZhbHVlKGQpKSwgaGVpZ2h0Ok1hdGguYWJzKHkuc2NhbGUoKSgwKSAtIHkubWFwKGQpKX0pXG5cbiAgICAgIF9tZXJnZShsYXlvdXQpLmZpcnN0KHt4OjAsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOiBiYXJPdXRlclBhZGRpbmd9KVxuXG5cbiAgICAgIGNvbHVtbnMgPSBjb2x1bW5zLmRhdGEobGF5b3V0LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgIGVudGVyID0gY29sdW1ucy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtY29sdW1uJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLGkpIC0+IFwidHJhbnNsYXRlKCN7aWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueCAgKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgaWYgaSB0aGVuIGJhclBhZGRpbmdPbGQgLyAyIGVsc2UgYmFyT3V0ZXJQYWRkaW5nT2xkfSwje2QueX0pIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwxKVwiKVxuICAgICAgZW50ZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlY3Qgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgIGVudGVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1kYXRhLWxhYmVsJylcbiAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC53aWR0aCAvIDIpXG4gICAgICAgIC5hdHRyKCd5JywgLTIwKVxuICAgICAgICAuYXR0cih7ZHk6ICcxZW0nLCAndGV4dC1hbmNob3InOidtaWRkbGUnfSlcbiAgICAgICAgLnN0eWxlKHsnZm9udC1zaXplJzonMS4zZW0nLCBvcGFjaXR5OiAwfSlcblxuICAgICAgY29sdW1ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwgI3tkLnl9KSBzY2FsZSgxLDEpXCIpXG4gICAgICBjb2x1bW5zLnNlbGVjdCgncmVjdCcpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgY29sdW1ucy5zZWxlY3QoJ3RleHQnKVxuICAgICAgICAudGV4dCgoZCkgLT4geS5mb3JtYXR0ZWRWYWx1ZShkLmRhdGEpKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC53aWR0aCAvIDIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaG9zdC5zaG93RGF0YUxhYmVscygpIHRoZW4gMSBlbHNlIDApXG5cbiAgICAgIGNvbHVtbnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnggLSBiYXJQYWRkaW5nIC8gMn0sI3tkLnl9KSBzY2FsZSgwLDEpXCIpXG4gICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgIGJydXNoID0gKGF4aXMsIGlkeFJhbmdlKSAtPlxuICAgICAgY29sdW1uc1xuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiAoeCA9IGF4aXMuc2NhbGUoKShkLmtleSkpID49IDAgdGhlbiB4IGVsc2UgLTEwMDB9LCAje2QueX0pXCIpXG4gICAgICAgIC5zZWxlY3RBbGwoJy53ay1jaGFydC1yZWN0JylcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGF4aXMuc2NhbGUoKS5yYW5nZUJhbmQoKSlcbiAgICAgIGNvbHVtbnMuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cigneCcsYXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMilcblxuICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBicnVzaFxuXG4gICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICBfc2NhbGVMaXN0LngucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgaG9zdC5zaG93RGF0YUxhYmVscyhmYWxzZSlcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJyBvciB2YWwgaXMgXCJcIlxuICAgICAgICBob3N0LnNob3dEYXRhTGFiZWxzKCd5JylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICB9XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbHVtbkNsdXN0ZXJlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG5cbiAgY2x1c3RlcmVkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJjbHVzdGVyZWRDb2x1bW4je2NsdXN0ZXJlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQubGF5ZXJLZXkpXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICAgIGNvbmZpZyA9IHt9XG4gICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgZHJhd0JydXNoID0gdW5kZWZpbmVkXG4gICAgICBjbHVzdGVyWCA9IHVuZGVmaW5lZFxuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgIyRsb2cuaW5mbyBcInJlbmRlcmluZyBjbHVzdGVyZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgICMgbWFwIGRhdGEgdG8gdGhlIHJpZ2h0IGZvcm1hdCBmb3IgcmVuZGVyaW5nXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgY2x1c3RlclggPSBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKHkubGF5ZXJLZXlzKGRhdGEpKS5yYW5nZUJhbmRzKFswLHguc2NhbGUoKS5yYW5nZUJhbmQoKV0sIDAsIDApXG5cbiAgICAgICAgY2x1c3RlciA9IGRhdGEubWFwKChkKSAtPiBsID0ge1xuICAgICAgICAgIGtleTp4LnZhbHVlKGQpLCBkYXRhOmQsIHg6eC5tYXAoZCksIHdpZHRoOiB4LnNjYWxlKCkucmFuZ2VCYW5kKHgudmFsdWUoZCkpXG4gICAgICAgICAgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7bGF5ZXJLZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGtleTp4LnZhbHVlKGQpLCB2YWx1ZTogZFtrXSwgeDpjbHVzdGVyWChrKSwgeTogeS5zY2FsZSgpKGRba10pLCBoZWlnaHQ6eS5zY2FsZSgpKDApIC0geS5zY2FsZSgpKGRba10pLCB3aWR0aDpjbHVzdGVyWC5yYW5nZUJhbmQoayl9KX1cbiAgICAgICAgKVxuXG4gICAgICAgIF9tZXJnZShjbHVzdGVyKS5maXJzdCh7eDpiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgd2lkdGg6MH0pLmxhc3Qoe3g6b3B0aW9ucy53aWR0aCArIGJhclBhZGRpbmcvMiAtIGJhck91dGVyUGFkZGluZ09sZCwgd2lkdGg6MH0pXG4gICAgICAgIF9tZXJnZUxheWVycyhjbHVzdGVyWzBdLmxheWVycykuZmlyc3Qoe3g6MCwgd2lkdGg6MH0pLmxhc3Qoe3g6Y2x1c3RlclswXS53aWR0aCwgd2lkdGg6MH0pXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1sYXllcicpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzLmRhdGEoY2x1c3RlciwgKGQpIC0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWxheWVyJykuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgYmFyUGFkZGluZ09sZCAvIDJ9LDApIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwgMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwwKSBzY2FsZSgxLDEpXCIpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueCAtIGJhclBhZGRpbmcgLyAyfSwgMCkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkueCArIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+aWYgaW5pdGlhbCB0aGVuIGQud2lkdGggZWxzZSAwKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3Iuc2NhbGUoKShkLmxheWVyS2V5KSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IE1hdGgubWluKHkuc2NhbGUoKSgwKSwgZC55KSlcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IE1hdGguYWJzKGQuaGVpZ2h0KSlcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLDApXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQpLngpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICBkcmF3QnJ1c2ggPSAoYXhpcywgaWR4UmFuZ2UpIC0+XG4gICAgICAgIGNsdXN0ZXJYLnJhbmdlQmFuZHMoWzAsYXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpXSwgMCwgMClcbiAgICAgICAgd2lkdGggPSBjbHVzdGVyWC5yYW5nZUJhbmQoKVxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiAoeCA9IGF4aXMuc2NhbGUoKShkLmtleSkpID49IDAgdGhlbiB4IGVsc2UgLTEwMDB9LDApXCIpXG4gICAgICAgICAgLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGNsdXN0ZXJYKGQubGF5ZXJLZXkpKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdCcnVzaFxuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgICAgX3NjYWxlTGlzdC54LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5TdGFja2VkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpIC0+XG5cbiAgc3RhY2tlZENvbHVtbkNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgU3RhY2tlZCBiYXInXG5cbiAgICAgIF9pZCA9IFwic3RhY2tlZENvbHVtbiN7c3RhY2tlZENvbHVtbkNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIHN0YWNrID0gW11cbiAgICAgIF90b29sdGlwID0gKCktPlxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgIGNvbmZpZyA9IHt9XG4gICAgICBfLm1lcmdlKGNvbmZpZyxiYXJDb25maWcpXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBkYXRhLmxheWVycy5tYXAoKGwpIC0+IHtuYW1lOmwubGF5ZXJLZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLnZhbHVlKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGRhdGEua2V5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplLCBzaGFwZSkgLT5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoXCIubGF5ZXJcIilcbiAgICAgICAgIyRsb2cuZGVidWcgXCJkcmF3aW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgc3RhY2sgPSBbXVxuICAgICAgICBmb3IgZCBpbiBkYXRhXG4gICAgICAgICAgeTAgPSAwXG4gICAgICAgICAgbCA9IHtrZXk6eC52YWx1ZShkKSwgbGF5ZXJzOltdLCBkYXRhOmQsIHg6eC5tYXAoZCksIHdpZHRoOmlmIHguc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxfVxuICAgICAgICAgIGlmIGwueCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgbC5sYXllcnMgPSBsYXllcktleXMubWFwKChrKSAtPlxuICAgICAgICAgICAgICBsYXllciA9IHtsYXllcktleTprLCBrZXk6bC5rZXksIHZhbHVlOmRba10sIGhlaWdodDogIHkuc2NhbGUoKSgwKSAtIHkuc2NhbGUoKSgrZFtrXSksIHdpZHRoOiAoaWYgeC5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDEpLCB5OiB5LnNjYWxlKCkoK3kwICsgK2Rba10pLCBjb2xvcjogY29sb3Iuc2NhbGUoKShrKX1cbiAgICAgICAgICAgICAgeTAgKz0gK2Rba11cbiAgICAgICAgICAgICAgcmV0dXJuIGxheWVyXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBzdGFjay5wdXNoKGwpXG5cbiAgICAgICAgX21lcmdlKHN0YWNrKS5maXJzdCh7eDogYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOjB9KVxuICAgICAgICBfbWVyZ2VMYXllcnMobGF5ZXJLZXlzKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKHN0YWNrLCAoZCktPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgYmFyUGFkZGluZ09sZCAvIDJ9LDApIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwgMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tkLnh9LDApIHNjYWxlKDEsMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueCAtIGJhclBhZGRpbmcgLyAyfSwgMCkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT5cbiAgICAgICAgICAgIGlmIF9tZXJnZS5wcmV2KGQua2V5KVxuICAgICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5wcmV2KGQua2V5KS5sYXllcnNbaWR4XS55IGVsc2UgeS5zY2FsZSgpKDApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGQueVxuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLnkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsMClcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPlxuICAgICAgICAgICAgaWR4ID0gbGF5ZXJLZXlzLmluZGV4T2YoX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgaWYgaWR4ID49IDAgdGhlbiBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2lkeF0ueSArIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbaWR4XS5oZWlnaHQgZWxzZSBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2xheWVyS2V5cy5sZW5ndGggLSAxXS55XG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGluaXRpYWwgPSBmYWxzZVxuICAgICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICAgZHJhd0JydXNoID0gKGF4aXMsIGlkeFJhbmdlKSAtPlxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiAoeCA9IGF4aXMuc2NhbGUoKShkLmtleSkpID49IDAgdGhlbiB4IGVsc2UgLTEwMDB9LDApXCIpXG4gICAgICAgICAgLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gYXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpKVxuXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygndG90YWwnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgZHJhd0JydXNoXG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LngucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2dhdWdlJywgKCRsb2csIHV0aWxzKSAtPlxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcbiAgICBjb250cm9sbGVyOiAoJHNjb3BlLCAkYXR0cnMpIC0+XG4gICAgICBtZSA9IHtjaGFydFR5cGU6ICdHYXVnZUNoYXJ0JywgaWQ6dXRpbHMuZ2V0SWQoKX1cbiAgICAgICRhdHRycy4kc2V0KCdjaGFydC1pZCcsIG1lLmlkKVxuICAgICAgcmV0dXJuIG1lXG4gICAgXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgaW5pdGFsU2hvdyA9IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICRsb2cuaW5mbyAnZHJhd2luZyBHYXVnZSBDaGFydCdcblxuICAgICAgICBkYXQgPSBbZGF0YV1cblxuICAgICAgICB5RG9tYWluID0geS5zY2FsZSgpLmRvbWFpbigpXG4gICAgICAgIGNvbG9yRG9tYWluID0gYW5ndWxhci5jb3B5KGNvbG9yLnNjYWxlKCkuZG9tYWluKCkpXG4gICAgICAgIGNvbG9yRG9tYWluLnVuc2hpZnQoeURvbWFpblswXSlcbiAgICAgICAgY29sb3JEb21haW4ucHVzaCh5RG9tYWluWzFdKVxuICAgICAgICByYW5nZXMgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMS4uY29sb3JEb21haW4ubGVuZ3RoLTFdXG4gICAgICAgICAgcmFuZ2VzLnB1c2gge2Zyb206K2NvbG9yRG9tYWluW2ktMV0sdG86K2NvbG9yRG9tYWluW2ldfVxuXG4gICAgICAgICNkcmF3IGNvbG9yIHNjYWxlXG5cbiAgICAgICAgYmFyID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgIGJhciA9IGJhci5kYXRhKHJhbmdlcywgKGQsIGkpIC0+IGkpXG4gICAgICAgIGlmIGluaXRhbFNob3dcbiAgICAgICAgICBiYXIuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKS5hdHRyKCd3aWR0aCcsIDUwKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJhci5lbnRlcigpLmFwcGVuZCgncmVjdCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhcicpXG4gICAgICAgICAgICAuYXR0cigneCcsIDApLmF0dHIoJ3dpZHRoJywgNTApXG5cbiAgICAgICAgYmFyLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLChkKSAtPiB5LnNjYWxlKCkoMCkgLSB5LnNjYWxlKCkoZC50byAtIGQuZnJvbSkpXG4gICAgICAgICAgLmF0dHIoJ3knLChkKSAtPiB5LnNjYWxlKCkoZC50bykpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC5mcm9tKSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGJhci5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICAjIGRyYXcgdmFsdWVcblxuICAgICAgICBhZGRNYXJrZXIgPSAocykgLT5cbiAgICAgICAgICBzLmFwcGVuZCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgNTUpLmF0dHIoJ2hlaWdodCcsIDQpLnN0eWxlKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgICBzLmFwcGVuZCgnY2lyY2xlJykuYXR0cigncicsIDEwKS5hdHRyKCdjeCcsIDY1KS5hdHRyKCdjeScsMikuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG5cbiAgICAgICAgbWFya2VyID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpXG4gICAgICAgIG1hcmtlciA9IG1hcmtlci5kYXRhKGRhdCwgKGQpIC0+ICd3ay1jaGFydC1tYXJrZXInKVxuICAgICAgICBtYXJrZXIuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LW1hcmtlcicpLmNhbGwoYWRkTWFya2VyKVxuXG4gICAgICAgIGlmIGluaXRhbFNob3dcbiAgICAgICAgICBtYXJrZXIuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKDAsI3t5LnNjYWxlKCkoZC52YWx1ZSl9KVwiKS5zdHlsZSgnb3BhY2l0eScsIDApXG5cbiAgICAgICAgbWFya2VyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7eS5zY2FsZSgpKGQudmFsdWUpfSlcIilcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC52YWx1ZSkpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBpbml0YWxTaG93ID0gZmFsc2VcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICB0aGlzLnJlcXVpcmVkU2NhbGVzKFsneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgnY29sb3InKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcblxuICB9XG5cbiAgI3RvZG8gcmVmZWN0b3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2dlb01hcCcsICgkbG9nLCB1dGlscykgLT5cbiAgbWFwQ250ciA9IDBcblxuICBwYXJzZUxpc3QgPSAodmFsKSAtPlxuICAgIGlmIHZhbFxuICAgICAgbCA9IHZhbC50cmltKCkucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKS5zcGxpdCgnLCcpLm1hcCgoZCkgLT4gZC5yZXBsYWNlKC9eW1xcXCJ8J118W1xcXCJ8J10kL2csICcnKSlcbiAgICAgIGwgPSBsLm1hcCgoZCkgLT4gaWYgaXNOYU4oZCkgdGhlbiBkIGVsc2UgK2QpXG4gICAgICByZXR1cm4gaWYgbC5sZW5ndGggaXMgMSB0aGVuIHJldHVybiBsWzBdIGVsc2UgbFxuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgc2NvcGU6IHtcbiAgICAgIGdlb2pzb246ICc9J1xuICAgICAgcHJvamVjdGlvbjogJz0nXG4gICAgfVxuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnZ2VvTWFwJyArIG1hcENudHIrK1xuICAgICAgX2RhdGFNYXBwaW5nID0gZDMubWFwKClcblxuICAgICAgX3NjYWxlID0gMVxuICAgICAgX3JvdGF0ZSA9IFswLDBdXG4gICAgICBfaWRQcm9wID0gJydcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cblxuICAgICAgICB2YWwgPSBfZGF0YU1hcHBpbmcuZ2V0KGRhdGEucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOnZhbC5SUywgdmFsdWU6dmFsLkRFU30pXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcGF0aFNlbCA9IFtdXG5cbiAgICAgIF9wcm9qZWN0aW9uID0gZDMuZ2VvLm9ydGhvZ3JhcGhpYygpXG4gICAgICBfd2lkdGggPSAwXG4gICAgICBfaGVpZ2h0ID0gMFxuICAgICAgX3BhdGggPSB1bmRlZmluZWRcbiAgICAgIF96b29tID0gZDMuZ2VvLnpvb20oKVxuICAgICAgICAucHJvamVjdGlvbihfcHJvamVjdGlvbilcbiAgICAgICAgIy5zY2FsZUV4dGVudChbcHJvamVjdGlvbi5zY2FsZSgpICogLjcsIHByb2plY3Rpb24uc2NhbGUoKSAqIDEwXSlcbiAgICAgICAgLm9uIFwiem9vbS5yZWRyYXdcIiwgKCkgLT5cbiAgICAgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHBhdGhTZWwuYXR0cihcImRcIiwgX3BhdGgpO1xuXG4gICAgICBfZ2VvSnNvbiA9IHVuZGVmaW5lZFxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBfd2lkdGggPSBvcHRpb25zLndpZHRoXG4gICAgICAgIF9oZWlnaHQgPSBvcHRpb25zLmhlaWdodFxuICAgICAgICBpZiBkYXRhIGFuZCBkYXRhWzBdLmhhc093blByb3BlcnR5KF9pZFByb3BbMV0pXG4gICAgICAgICAgZm9yIGUgaW4gZGF0YVxuICAgICAgICAgICAgX2RhdGFNYXBwaW5nLnNldChlW19pZFByb3BbMV1dLCBlKVxuXG4gICAgICAgIGlmIF9nZW9Kc29uXG5cbiAgICAgICAgICBfcHJvamVjdGlvbi50cmFuc2xhdGUoW193aWR0aC8yLCBfaGVpZ2h0LzJdKVxuICAgICAgICAgIHBhdGhTZWwgPSB0aGlzLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShfZ2VvSnNvbi5mZWF0dXJlcywgKGQpIC0+IGQucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgICBwYXRoU2VsXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJzdmc6cGF0aFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCdsaWdodGdyZXknKS5zdHlsZSgnc3Ryb2tlJywgJ2RhcmtncmV5JylcbiAgICAgICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICAgICAgICAuY2FsbChfem9vbSlcblxuICAgICAgICAgIHBhdGhTZWxcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBfcGF0aClcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPlxuICAgICAgICAgICAgICB2YWwgPSBfZGF0YU1hcHBpbmcuZ2V0KGQucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgICAgICAgY29sb3IubWFwKHZhbClcbiAgICAgICAgICApXG5cbiAgICAgICAgICBwYXRoU2VsLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ2NvbG9yJ10pXG4gICAgICAgIF9zY2FsZUxpc3QuY29sb3IucmVzZXRPbk5ld0RhdGEodHJ1ZSlcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgICBfdG9vbHRpcCA9IGxheW91dC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgICMgR2VvTWFwIHNwZWNpZmljIHByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY29wZS4kd2F0Y2ggJ3Byb2plY3Rpb24nLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAkbG9nLmxvZyAnc2V0dGluZyBQcm9qZWN0aW9uIHBhcmFtcycsIHZhbFxuICAgICAgICAgIGlmIGQzLmdlby5oYXNPd25Qcm9wZXJ0eSh2YWwucHJvamVjdGlvbilcbiAgICAgICAgICAgIF9wcm9qZWN0aW9uID0gZDMuZ2VvW3ZhbC5wcm9qZWN0aW9uXSgpXG4gICAgICAgICAgICBfcHJvamVjdGlvbi5jZW50ZXIodmFsLmNlbnRlcikuc2NhbGUodmFsLnNjYWxlKS5yb3RhdGUodmFsLnJvdGF0ZSkuY2xpcEFuZ2xlKHZhbC5jbGlwQW5nbGUpXG4gICAgICAgICAgICBfaWRQcm9wID0gdmFsLmlkTWFwXG4gICAgICAgICAgICBpZiBfcHJvamVjdGlvbi5wYXJhbGxlbHNcbiAgICAgICAgICAgICAgX3Byb2plY3Rpb24ucGFyYWxsZWxzKHZhbC5wYXJhbGxlbHMpXG4gICAgICAgICAgICBfc2NhbGUgPSBfcHJvamVjdGlvbi5zY2FsZSgpXG4gICAgICAgICAgICBfcm90YXRlID0gX3Byb2plY3Rpb24ucm90YXRlKClcbiAgICAgICAgICAgIF9wYXRoID0gZDMuZ2VvLnBhdGgoKS5wcm9qZWN0aW9uKF9wcm9qZWN0aW9uKVxuICAgICAgICAgICAgX3pvb20ucHJvamVjdGlvbihfcHJvamVjdGlvbilcblxuICAgICAgICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICAgICwgdHJ1ZSAjZGVlcCB3YXRjaFxuXG4gICAgICBzY29wZS4kd2F0Y2ggJ2dlb2pzb24nLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWQgYW5kIHZhbCBpc250ICcnXG4gICAgICAgICAgX2dlb0pzb24gPSB2YWxcbiAgICAgICAgICBsYXlvdXQubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuXG4gIH1cblxuICAjVE9ETyByZS10ZXN0IGFuZCB2ZXJpZnkgaW4gbmV3IGFwcGxpY2FpdG9uLiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sdW1uSGlzdG9ncmFtJywgKCRsb2csIGJhckNvbmZpZywgdXRpbHMpIC0+XG5cbiAgc0hpc3RvQ250ciA9IDBcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBfaWQgPSBcImhpc3RvZ3JhbSN7c0hpc3RvQ250cisrfVwiXG5cbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgYnVja2V0cyA9IHVuZGVmaW5lZFxuICAgICAgbGFiZWxzID0gdW5kZWZpbmVkXG4gICAgICBjb25maWcgPSB7fVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpLT4gZC54VmFsKVxuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QucmFuZ2VYLmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBsb3dlciA9IF9zY2FsZUxpc3QucmFuZ2VYLmZvcm1hdFZhbHVlKF9zY2FsZUxpc3QucmFuZ2VYLmxvd2VyVmFsdWUoZGF0YS5kYXRhKSlcbiAgICAgICAgaWYgX3NjYWxlTGlzdC5yYW5nZVgudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgdXBwZXIgPSBfc2NhbGVMaXN0LnJhbmdlWC5mb3JtYXRWYWx1ZShfc2NhbGVMaXN0LnJhbmdlWC51cHBlclZhbHVlKGRhdGEuZGF0YSkpXG4gICAgICAgICAgbmFtZSA9IGxvd2VyICsgJyAtICcgKyB1cHBlclxuICAgICAgICBlbHNlXG4gICAgICAgICAgbmFtZSA9IF9zY2FsZUxpc3QucmFuZ2VYLmZvcm1hdFZhbHVlKF9zY2FsZUxpc3QucmFuZ2VYLmxvd2VyVmFsdWUoZGF0YS5kYXRhKSlcblxuICAgICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiBfc2NhbGVMaXN0LnkuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogX3NjYWxlTGlzdC5jb2xvci5tYXAoZGF0YS5kYXRhKX19KVxuXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUsIHJhbmdlWCkgLT5cblxuICAgICAgICBpZiByYW5nZVgudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgbGF5b3V0ID0gZGF0YS5tYXAoKGQpIC0+IHt4OnJhbmdlWC5zY2FsZSgpKHJhbmdlWC5sb3dlclZhbHVlKGQpKSwgeFZhbDpyYW5nZVgubG93ZXJWYWx1ZShkKSwgd2lkdGg6cmFuZ2VYLnNjYWxlKCkocmFuZ2VYLnVwcGVyVmFsdWUoZCkpIC0gcmFuZ2VYLnNjYWxlKCkocmFuZ2VYLmxvd2VyVmFsdWUoZCkpLCB5OnkubWFwKGQpLCBoZWlnaHQ6b3B0aW9ucy5oZWlnaHQgLSB5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCBkYXRhOmR9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgZGF0YS5sZW5ndGggPiAwXG4gICAgICAgICAgICBzdGFydCA9IHJhbmdlWC5sb3dlclZhbHVlKGRhdGFbMF0pXG4gICAgICAgICAgICBzdGVwID0gcmFuZ2VYLmxvd2VyVmFsdWUoZGF0YVsxXSkgLSBzdGFydFxuICAgICAgICAgICAgd2lkdGggPSBvcHRpb25zLndpZHRoIC8gZGF0YS5sZW5ndGhcbiAgICAgICAgICAgIGxheW91dCA9IGRhdGEubWFwKChkLCBpKSAtPiB7eDpyYW5nZVguc2NhbGUoKShzdGFydCArIHN0ZXAgKiBpKSwgeFZhbDpyYW5nZVgubG93ZXJWYWx1ZShkKSwgd2lkdGg6d2lkdGgsIHk6eS5tYXAoZCksIGhlaWdodDpvcHRpb25zLmhlaWdodCAtIHkubWFwKGQpLCBjb2xvcjpjb2xvci5tYXAoZCksIGRhdGE6ZH0pXG5cbiAgICAgICAgX21lcmdlKGxheW91dCkuZmlyc3Qoe3g6MCwgd2lkdGg6MH0pLmxhc3Qoe3g6b3B0aW9ucy53aWR0aCwgd2lkdGg6IDB9KVxuXG4gICAgICAgIGlmIG5vdCBidWNrZXRzXG4gICAgICAgICAgYnVja2V0cyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1idWNrZXQnKVxuXG4gICAgICAgIGJ1Y2tldHMgPSBidWNrZXRzLmRhdGEobGF5b3V0LCAoZCkgLT4gZC54VmFsKVxuXG4gICAgICAgIGVudGVyID0gYnVja2V0cy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtYnVja2V0JylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKCN7aWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueCAgKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRofSwje2QueX0pIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwxKVwiKVxuICAgICAgICBlbnRlci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICBlbnRlci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWRhdGEtbGFiZWwnKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGQud2lkdGggLyAyKVxuICAgICAgICAgIC5hdHRyKCd5JywgLTIwKVxuICAgICAgICAgIC5hdHRyKHtkeTogJzFlbScsICd0ZXh0LWFuY2hvcic6J21pZGRsZSd9KVxuICAgICAgICAgIC5zdHlsZSh7J2ZvbnQtc2l6ZSc6JzEuM2VtJywgb3BhY2l0eTogMH0pXG5cbiAgICAgICAgYnVja2V0cy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tkLnh9LCAje2QueX0pIHNjYWxlKDEsMSlcIilcbiAgICAgICAgYnVja2V0cy5zZWxlY3QoJ3JlY3QnKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgICBidWNrZXRzLnNlbGVjdCgndGV4dCcpXG4gICAgICAgICAgLnRleHQoKGQpIC0+IHkuZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLndpZHRoIC8gMilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGhvc3Quc2hvd0RhdGFMYWJlbHMoKSB0aGVuIDEgZWxzZSAwKVxuXG4gICAgICAgIGJ1Y2tldHMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueH0sI3tkLnl9KSBzY2FsZSgwLDEpXCIpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG5cbiAgICAgIGJydXNoID0gKGF4aXMsIGlkeFJhbmdlLCB3aWR0aCwgaGVpZ2h0KSAtPlxuICAgICAgICBidWNrZXRXaWR0aCA9IChheGlzLCBkKSAtPlxuICAgICAgICAgIGlmIGF4aXMudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgICByZXR1cm4gYXhpcy5zY2FsZSgpKGF4aXMudXBwZXJWYWx1ZShkLmRhdGEpKSAtIGF4aXMuc2NhbGUoKShheGlzLmxvd2VyVmFsdWUoZC5kYXRhKSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gd2lkdGggLyBNYXRoLm1heChpZHhSYW5nZVsxXSAtIGlkeFJhbmdlWzBdICsgMSwgMSlcblxuICAgICAgICBidWNrZXRzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+XG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgICBcInRyYW5zbGF0ZSgje2lmICh4ID0gYXhpcy5zY2FsZSgpKGQueFZhbCkpID49IDAgdGhlbiB4IGVsc2UgLTEwMDB9LCAje2QueX0pXCIpXG4gICAgICAgIGJ1Y2tldHMuc2VsZWN0KCdyZWN0JylcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gYnVja2V0V2lkdGgoYXhpcywgZCkpXG4gICAgICAgIGJ1Y2tldHMuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cigneCcsKGQpIC0+IGJ1Y2tldFdpZHRoKGF4aXMsIGQpIC8gMilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsncmFuZ2VYJywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgncmFuZ2VYJykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuc2NhbGVUeXBlKCdsaW5lYXInKS5kb21haW5DYWxjKCdyYW5nZUV4dGVudCcpXG4gICAgICAgIEBnZXRLaW5kKCdjb2xvcicpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgaG9zdC5zaG93RGF0YUxhYmVscyhmYWxzZSlcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgICAgaG9zdC5zaG93RGF0YUxhYmVscygneScpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsaW5lJywgKCRsb2csIGJlaGF2aW9yLCB1dGlscywgdGltaW5nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBfbGF5ZXJLZXlzID0gW11cbiAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgX2RhdGFPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNOZXcgPSBbXVxuICAgICAgX3BhdGhBcnJheSA9IFtdXG4gICAgICBfaW5pdGlhbE9wYWNpdHkgPSAwXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG4gICAgICBsaW5lID0gdW5kZWZpbmVkXG4gICAgICBtYXJrZXJzID0gdW5kZWZpbmVkXG4gICAgICBtYXJrZXJzQnJ1c2hlZCA9IHVuZGVmaW5lZFxuXG4gICAgICBsaW5lQnJ1c2ggPSB1bmRlZmluZWRcblxuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRFbnRlciA9IChpZHgpIC0+XG4gICAgICAgIF9wYXRoQXJyYXkgPSBfLnRvQXJyYXkoX3BhdGhWYWx1ZXNOZXcpXG4gICAgICAgIHR0TW92ZURhdGEuYXBwbHkodGhpcywgW2lkeF0pXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IF9wYXRoQXJyYXkubWFwKChsKSAtPiB7bmFtZTpsW2lkeF0ua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobFtpZHhdLnl2KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbFtpZHhdLmNvbG9yfSwgeHY6bFtpZHhdLnh2fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKHR0TGF5ZXJzWzBdLnh2KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKF9wYXRoQXJyYXksIChkKSAtPiBkW2lkeF0ua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZFtpZHhdLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N5JywgKGQpIC0+IGRbaWR4XS55KVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19zY2FsZUxpc3QueC5zY2FsZSgpKF9wYXRoQXJyYXlbMF1baWR4XS54dikgKyBvZmZzZXR9KVwiKSAjIG5lZWQgdG8gY29tcHV0ZSBmb3JtIHNjYWxlIGJlY2F1c2Ugb2YgYnJ1c2hpbmdcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgICAgbWVyZ2VkWCA9IHV0aWxzLm1lcmdlU2VyaWVzU29ydGVkKHgudmFsdWUoX2RhdGFPbGQpLCB4LnZhbHVlKGRhdGEpKVxuICAgICAgICBfbGF5ZXJLZXlzID0geS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgX2xheW91dCA9IFtdXG5cbiAgICAgICAgX3BhdGhWYWx1ZXNOZXcgPSB7fVxuXG4gICAgICAgIGZvciBrZXkgaW4gX2xheWVyS2V5c1xuICAgICAgICAgIF9wYXRoVmFsdWVzTmV3W2tleV0gPSBkYXRhLm1hcCgoZCktPiB7eDp4Lm1hcChkKSx5Onkuc2NhbGUoKSh5LmxheWVyVmFsdWUoZCwga2V5KSksIHh2OngudmFsdWUoZCksIHl2OnkubGF5ZXJWYWx1ZShkLGtleSksIGtleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgZGF0YTpkfSlcblxuICAgICAgICAgIGxheWVyID0ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6W119XG4gICAgICAgICAgIyBmaW5kIHN0YXJ0aW5nIHZhbHVlIGZvciBvbGRcbiAgICAgICAgICBpID0gMFxuICAgICAgICAgIHdoaWxlIGkgPCBtZXJnZWRYLmxlbmd0aFxuICAgICAgICAgICAgaWYgbWVyZ2VkWFtpXVswXSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICBvbGRMYXN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVttZXJnZWRYW2ldWzBdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3TGFzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bbWVyZ2VkWFtpXVsxXV1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgZm9yIHZhbCwgaSBpbiBtZXJnZWRYXG4gICAgICAgICAgICB2ID0ge2NvbG9yOmxheWVyLmNvbG9yLCB4OnZhbFsyXX1cbiAgICAgICAgICAgICMgc2V0IHggYW5kIHkgdmFsdWVzIGZvciBvbGQgdmFsdWVzLiBJZiB0aGVyZSBpcyBhIGFkZGVkIHZhbHVlLCBtYWludGFpbiB0aGUgbGFzdCB2YWxpZCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgdmFsWzFdIGlzIHVuZGVmaW5lZCAjaWUgYW4gb2xkIHZhbHVlIGlzIGRlbGV0ZWQsIG1haW50YWluIHRoZSBsYXN0IG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LnlOZXcgPSBuZXdMYXN0LnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gbmV3TGFzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0xhc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV1cbiAgICAgICAgICAgICAgdi5kZWxldGVkID0gZmFsc2VcblxuICAgICAgICAgICAgaWYgX2RhdGFPbGQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICBpZiAgdmFsWzBdIGlzIHVuZGVmaW5lZCAjIGllIGEgbmV3IHZhbHVlIGhhcyBiZWVuIGFkZGVkXG4gICAgICAgICAgICAgICAgdi55T2xkID0gb2xkTGFzdC55XG4gICAgICAgICAgICAgICAgdi54T2xkID0gb2xkTGFzdC54ICMgc3RhcnQgeC1hbmltYXRpb24gZnJvbSB0aGUgcHJlZGVjZXNzb3JzIG9sZCBwb3NpdGlvblxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueFxuICAgICAgICAgICAgICAgIG9sZExhc3QgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdi54T2xkID0gdi54TmV3XG4gICAgICAgICAgICAgIHYueU9sZCA9IHYueU5ld1xuXG5cbiAgICAgICAgICAgIGxheWVyLnZhbHVlLnB1c2godilcblxuICAgICAgICAgIF9sYXlvdXQucHVzaChsYXllcilcblxuICAgICAgICBvZmZzZXQgPSBpZiB4LmlzT3JkaW5hbCgpIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBtYXJrZXJzID0gKGxheWVyLCBkdXJhdGlvbikgLT5cbiAgICAgICAgICBpZiBfc2hvd01hcmtlcnNcbiAgICAgICAgICAgIG0gPSBsYXllci5zZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKS5kYXRhKFxuICAgICAgICAgICAgICAgIChsKSAtPiBsLnZhbHVlXG4gICAgICAgICAgICAgICwgKGQpIC0+IGQueFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgbS5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1tYXJrZXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgICAgIC5hdHRyKCdyJywgNSlcbiAgICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAgIG1cbiAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpIC0+IGQueU9sZClcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpIC0+IGQueE9sZCArIG9mZnNldClcbiAgICAgICAgICAgICAgLmNsYXNzZWQoJ3drLWNoYXJ0LWRlbGV0ZWQnLChkKSAtPiBkLmRlbGV0ZWQpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgLT4gZC55TmV3KVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgLT4gZC54TmV3ICsgb2Zmc2V0KVxuICAgICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoZCkgLT4gaWYgZC5kZWxldGVkIHRoZW4gMCBlbHNlIDEpXG5cbiAgICAgICAgICAgIG0uZXhpdCgpXG4gICAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxheWVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbikuc3R5bGUoJ29wYWNpdHknLCAwKS5yZW1vdmUoKVxuXG4gICAgICAgIG1hcmtlcnNCcnVzaGVkID0gKGxheWVyKSAtPlxuICAgICAgICAgIGlmIF9zaG93TWFya2Vyc1xuICAgICAgICAgICAgbGF5ZXJcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpIC0+XG4gICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgIHguc2NhbGUoKShkLngpXG4gICAgICAgICAgICApXG5cbiAgICAgICAgbGluZU9sZCA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAueCgoZCkgLT4gZC54T2xkKVxuICAgICAgICAgIC55KChkKSAtPiBkLnlPbGQpXG5cbiAgICAgICAgbGluZU5ldyA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAueCgoZCkgLT4gZC54TmV3KVxuICAgICAgICAgIC55KChkKSAtPiBkLnlOZXcpXG5cbiAgICAgICAgbGluZUJydXNoID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgICAueSgoZCkgLT4gZC55TmV3KVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBlbnRlciA9IGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKVxuICAgICAgICBlbnRlci5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmVOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgX2luaXRpYWxPcGFjaXR5KVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG5cbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29mZnNldH0pXCIpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZU9sZChkLnZhbHVlKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZU5ldyhkLnZhbHVlKSlcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgbGF5ZXJzLmNhbGwobWFya2Vycywgb3B0aW9ucy5kdXJhdGlvbilcblxuICAgICAgICBfaW5pdGlhbE9wYWNpdHkgPSAwXG4gICAgICAgIF9kYXRhT2xkID0gZGF0YVxuICAgICAgICBfcGF0aFZhbHVlc09sZCA9IF9wYXRoVmFsdWVzTmV3XG5cbiAgICAgIGJydXNoID0gKGF4aXMsIGlkeFJhbmdlKSAtPlxuICAgICAgICBsaW5lcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxpbmVcIilcbiAgICAgICAgaWYgYXhpcy5pc09yZGluYWwoKVxuICAgICAgICAgIGxpbmVzLmF0dHIoJ2QnLCAoZCkgLT4gbGluZUJydXNoKGQudmFsdWUuc2xpY2UoaWR4UmFuZ2VbMF0saWR4UmFuZ2VbMV0gKyAxKSkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsaW5lcy5hdHRyKCdkJywgKGQpIC0+IGxpbmVCcnVzaChkLnZhbHVlKSlcbiAgICAgICAgbWFya2VycyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtbWFya2VyJykuY2FsbChtYXJrZXJzQnJ1c2hlZClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueClcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGJydXNoXG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsaW5lVmVydGljYWwnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF9kYXRhT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzTmV3ID0gW11cbiAgICAgIF9wYXRoQXJyYXkgPSBbXVxuICAgICAgbGluZUJydXNoID0gdW5kZWZpbmVkXG4gICAgICBtYXJrZXJzQnJ1c2hlZCA9IHVuZGVmaW5lZFxuICAgICAgYnJ1c2hTdGFydElkeCA9IDBcbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG5cbiAgICAgIHByZXBEYXRhID0gKHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjbGF5ZXJLZXlzID0geS5sYXllcktleXMoQClcbiAgICAgICAgI19sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOkBtYXAoKGQpLT4ge3g6eC52YWx1ZShkKSx5OnkubGF5ZXJWYWx1ZShkLCBrZXkpfSl9KVxuXG4gICAgICB0dEVudGVyID0gKGlkeCkgLT5cbiAgICAgICAgX3BhdGhBcnJheSA9IF8udG9BcnJheShfcGF0aFZhbHVlc05ldylcbiAgICAgICAgdHRNb3ZlRGF0YS5hcHBseSh0aGlzLCBbaWR4XSlcblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIG9mZnMgPSBpZHggKyBicnVzaFN0YXJ0SWR4XG4gICAgICAgIHR0TGF5ZXJzID0gX3BhdGhBcnJheS5tYXAoKGwpIC0+IHtuYW1lOmxbb2Zmc10ua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobFtvZmZzXS54diksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IGxbb2Zmc10uY29sb3J9LCB5djpsW29mZnNdLnl2fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKHR0TGF5ZXJzWzBdLnl2KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIG9mZnMgPSBpZHggKyBicnVzaFN0YXJ0SWR4XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKF9wYXRoQXJyYXksIChkKSAtPiBkW29mZnNdLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGRbb2Zmc10uY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3gnLCAoZCkgLT4gZFtvZmZzXS54KVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcbiAgICAgICAgbyA9IGlmIF9zY2FsZUxpc3QueS5pc09yZGluYWwgdGhlbiBfc2NhbGVMaXN0Lnkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKF9wYXRoQXJyYXlbMF1bb2Zmc10ueXYpICsgb30pXCIpICMgbmVlZCB0byBjb21wdXRlIGZvcm0gc2NhbGUgYmVjYXVzZSBvZiBicnVzaGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbWFya2VycyA9IChsYXllciwgZHVyYXRpb24pIC0+XG4gICAgICAgIGlmIF9zaG93TWFya2Vyc1xuICAgICAgICAgIG0gPSBsYXllci5zZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKS5kYXRhKFxuICAgICAgICAgICAgKGwpIC0+IGwudmFsdWVcbiAgICAgICAgICAsIChkKSAtPiBkLnlcbiAgICAgICAgICApXG4gICAgICAgICAgbS5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1tYXJrZXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgICAuYXR0cigncicsIDUpXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICBtXG4gICAgICAgICAgICAuYXR0cignY3knLCAoZCkgLT4gZC55T2xkICsgb2Zmc2V0KVxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpIC0+IGQueE9sZClcbiAgICAgICAgICAgIC5jbGFzc2VkKCd3ay1jaGFydC1kZWxldGVkJywoZCkgLT4gZC5kZWxldGVkKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSAtPiBkLnlOZXcgKyBvZmZzZXQpXG4gICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgLT4gZC54TmV3KVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQpIC0+IGlmIGQuZGVsZXRlZCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgICAgbS5leGl0KClcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtbWFya2VyJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsIDApLnJlbW92ZSgpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIGlmIHkuaXNPcmRpbmFsKClcbiAgICAgICAgICBtZXJnZWRZID0gdXRpbHMubWVyZ2VTZXJpZXNVbnNvcnRlZCh5LnZhbHVlKF9kYXRhT2xkKSwgeS52YWx1ZShkYXRhKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lcmdlZFkgPSB1dGlscy5tZXJnZVNlcmllc1NvcnRlZCh5LnZhbHVlKF9kYXRhT2xkKSwgeS52YWx1ZShkYXRhKSlcbiAgICAgICAgX2xheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgICBfcGF0aFZhbHVlc05ldyA9IHt9XG5cbiAgICAgICAgI19sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt5OnkudmFsdWUoZCkseDp4LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgICBmb3Iga2V5IGluIF9sYXllcktleXNcbiAgICAgICAgICBfcGF0aFZhbHVlc05ld1trZXldID0gZGF0YS5tYXAoKGQpLT4ge3k6eS5tYXAoZCksIHg6eC5zY2FsZSgpKHgubGF5ZXJWYWx1ZShkLCBrZXkpKSwgeXY6eS52YWx1ZShkKSwgeHY6eC5sYXllclZhbHVlKGQsa2V5KSwga2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCBkYXRhOmR9KVxuXG4gICAgICAgICAgbGF5ZXIgPSB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpbXX1cbiAgICAgICAgICAjIGZpbmQgc3RhcnRpbmcgdmFsdWUgZm9yIG9sZFxuICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFkubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRZW2ldWzBdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVttZXJnZWRZW2ldWzBdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWS5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFlbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3Rmlyc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW21lcmdlZFlbaV1bMV1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIGZvciB2YWwsIGkgaW4gbWVyZ2VkWVxuICAgICAgICAgICAgdiA9IHtjb2xvcjpsYXllci5jb2xvciwgeTp2YWxbMl19XG4gICAgICAgICAgICAjIHNldCB4IGFuZCB5IHZhbHVlcyBmb3Igb2xkIHZhbHVlcy4gSWYgdGhlcmUgaXMgYSBhZGRlZCB2YWx1ZSwgbWFpbnRhaW4gdGhlIGxhc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIHZhbFsxXSBpcyB1bmRlZmluZWQgI2llIGFuIG9sZCB2YWx1ZSBpcyBkZWxldGVkLCBtYWludGFpbiB0aGUgbGFzdCBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi55TmV3ID0gbmV3Rmlyc3QueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdGaXJzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0ZpcnN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIF9kYXRhT2xkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgaWYgIHZhbFswXSBpcyB1bmRlZmluZWQgIyBpZSBhIG5ldyB2YWx1ZSBoYXMgYmVlbiBhZGRlZFxuICAgICAgICAgICAgICAgIHYueU9sZCA9IG9sZEZpcnN0LnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRGaXJzdC54ICMgc3RhcnQgeC1hbmltYXRpb24gZnJvbSB0aGUgcHJlZGVjZXNzb3JzIG9sZCBwb3NpdGlvblxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueFxuICAgICAgICAgICAgICAgIG9sZEZpcnN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueE9sZCA9IHYueE5ld1xuICAgICAgICAgICAgICB2LnlPbGQgPSB2LnlOZXdcblxuXG4gICAgICAgICAgICBsYXllci52YWx1ZS5wdXNoKHYpXG5cbiAgICAgICAgICBfbGF5b3V0LnB1c2gobGF5ZXIpXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgbWFya2Vyc0JydXNoZWQgPSAobGF5ZXIpIC0+XG4gICAgICAgICAgaWYgX3Nob3dNYXJrZXJzXG4gICAgICAgICAgICBsYXllclxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpIC0+XG4gICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgeS5zY2FsZSgpKGQueSkgKyBpZiB5LmlzT3JkaW5hbCgpIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcbiAgICAgICAgICAgIClcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBsaW5lT2xkID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhPbGQpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU9sZClcblxuICAgICAgICBsaW5lTmV3ID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhOZXcpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU5ldylcblxuICAgICAgICBsaW5lQnJ1c2ggPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IGQueE5ldylcbiAgICAgICAgICAueSgoZCkgLT4geS5zY2FsZSgpKGQueSkpXG5cblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgZW50ZXIgPSBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgZW50ZXIuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7b2Zmc2V0fSlcIilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lT2xkKGQudmFsdWUpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmVOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXllcnMuY2FsbChtYXJrZXJzLCBvcHRpb25zLmR1cmF0aW9uKVxuXG4gICAgICAgIF9kYXRhT2xkID0gZGF0YVxuICAgICAgICBfcGF0aFZhbHVlc09sZCA9IF9wYXRoVmFsdWVzTmV3XG5cbiAgICAgIGJydXNoID0gKGF4aXMsIGlkeFJhbmdlKSAtPlxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1saW5lXCIpXG4gICAgICAgIGlmIGF4aXMuaXNPcmRpbmFsKClcbiAgICAgICAgICBicnVzaFN0YXJ0SWR4ID0gaWR4UmFuZ2VbMF1cbiAgICAgICAgICBsYXllcnMuYXR0cignZCcsIChkKSAtPiBsaW5lQnJ1c2goZC52YWx1ZS5zbGljZShpZHhSYW5nZVswXSxpZHhSYW5nZVsxXSArIDEpKSlcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7YXhpcy5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMn0pXCIpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMuYXR0cignZCcsIChkKSAtPiBsaW5lQnJ1c2goZC52YWx1ZSkpXG4gICAgICAgIG1hcmtlcnMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpLmNhbGwobWFya2Vyc0JydXNoZWQpXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LnkpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBicnVzaFxuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncGllJywgKCRsb2csIHV0aWxzKSAtPlxuICBwaWVDbnRyID0gMFxuXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnRUEnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICMgc2V0IGNoYXJ0IHNwZWNpZmljIGRlZmF1bHRzXG5cbiAgICBfaWQgPSBcInBpZSN7cGllQ250cisrfVwiXG5cbiAgICBpbm5lciA9IHVuZGVmaW5lZFxuICAgIG91dGVyID0gdW5kZWZpbmVkXG4gICAgbGFiZWxzID0gdW5kZWZpbmVkXG4gICAgcGllQm94ID0gdW5kZWZpbmVkXG4gICAgcG9seWxpbmUgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gW11cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgIF9zaG93TGFiZWxzID0gZmFsc2VcblxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LmNvbG9yLmF4aXNMYWJlbCgpXG4gICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnNpemUuYXhpc0xhYmVsKClcbiAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC5zaXplLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBpbml0aWFsU2hvdyA9IHRydWVcblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAnZHJhd2luZyBwaWUgY2hhcnQgdjInXG5cbiAgICAgIHIgPSBNYXRoLm1pbihvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCkgLyAyXG5cbiAgICAgIGlmIG5vdCBwaWVCb3hcbiAgICAgICAgcGllQm94PSBAYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1waWVCb3gnKVxuICAgICAgcGllQm94LmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcblxuICAgICAgaW5uZXJBcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgICAgLm91dGVyUmFkaXVzKHIgKiBpZiBfc2hvd0xhYmVscyB0aGVuIDAuOCBlbHNlIDEpXG4gICAgICAgIC5pbm5lclJhZGl1cygwKVxuXG4gICAgICBvdXRlckFyYyA9IGQzLnN2Zy5hcmMoKVxuICAgICAgICAub3V0ZXJSYWRpdXMociAqIDAuOSlcbiAgICAgICAgLmlubmVyUmFkaXVzKHIgKiAwLjkpXG5cbiAgICAgIGtleSA9IChkKSAtPiBfc2NhbGVMaXN0LmNvbG9yLnZhbHVlKGQuZGF0YSlcblxuICAgICAgcGllID0gZDMubGF5b3V0LnBpZSgpXG4gICAgICAgIC5zb3J0KG51bGwpXG4gICAgICAgIC52YWx1ZShzaXplLnZhbHVlKVxuXG4gICAgICBhcmNUd2VlbiA9IChhKSAtPlxuICAgICAgICBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSlcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IGkoMClcbiAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgIGlubmVyQXJjKGkodCkpXG5cbiAgICAgIHNlZ21lbnRzID0gcGllKGRhdGEpICMgcGllIGNvbXB1dGVzIGZvciBlYWNoIHNlZ21lbnQgdGhlIHN0YXJ0IGFuZ2xlIGFuZCB0aGUgZW5kIGFuZ2xlXG4gICAgICBfbWVyZ2Uua2V5KGtleSlcbiAgICAgIF9tZXJnZShzZWdtZW50cykuZmlyc3Qoe3N0YXJ0QW5nbGU6MCwgZW5kQW5nbGU6MH0pLmxhc3Qoe3N0YXJ0QW5nbGU6TWF0aC5QSSAqIDIsIGVuZEFuZ2xlOiBNYXRoLlBJICogMn0pXG5cbiAgICAgICMtLS0gRHJhdyBQaWUgc2VnbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBpZiBub3QgaW5uZXJcbiAgICAgICAgaW5uZXIgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtaW5uZXJBcmMnKVxuXG4gICAgICBpbm5lciA9IGlubmVyXG4gICAgICAgIC5kYXRhKHNlZ21lbnRzLGtleSlcblxuICAgICAgaW5uZXIuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuZWFjaCgoZCkgLT4gdGhpcy5fY3VycmVudCA9IGlmIGluaXRpYWxTaG93IHRoZW4gZCBlbHNlIHtzdGFydEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGUsIGVuZEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGV9KVxuICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1pbm5lckFyYyB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+ICBjb2xvci5tYXAoZC5kYXRhKSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbFNob3cgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICBpbm5lclxuICAgICAgICAjLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgLmF0dHJUd2VlbignZCcsYXJjVHdlZW4pXG5cbiAgICAgIGlubmVyLmV4aXQoKS5kYXR1bSgoZCkgLT4gIHtzdGFydEFuZ2xlOl9tZXJnZS5kZWxldGVkU3VjYyhkKS5zdGFydEFuZ2xlLCBlbmRBbmdsZTpfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuc3RhcnRBbmdsZX0pXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0clR3ZWVuKCdkJyxhcmNUd2VlbilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgIy0tLSBEcmF3IFNlZ21lbnQgTGFiZWwgVGV4dCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIG1pZEFuZ2xlID0gKGQpIC0+IGQuc3RhcnRBbmdsZSArIChkLmVuZEFuZ2xlIC0gZC5zdGFydEFuZ2xlKSAvIDJcblxuICAgICAgaWYgX3Nob3dMYWJlbHNcblxuICAgICAgICBsYWJlbHMgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtZGF0YS1sYWJlbCcpLmRhdGEoc2VnbWVudHMsIGtleSlcblxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1kYXRhLWxhYmVsJylcbiAgICAgICAgICAuZWFjaCgoZCkgLT4gQF9jdXJyZW50ID0gZClcbiAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLjM1ZW1cIilcbiAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsJzEuM2VtJylcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC50ZXh0KChkKSAtPiBzaXplLmZvcm1hdHRlZFZhbHVlKGQuZGF0YSkpXG5cbiAgICAgICAgbGFiZWxzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgICAgICAuYXR0clR3ZWVuKCd0cmFuc2Zvcm0nLCAoZCkgLT5cbiAgICAgICAgICAgIF90aGlzID0gdGhpc1xuICAgICAgICAgICAgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZShfdGhpcy5fY3VycmVudCwgZClcbiAgICAgICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICAgICAgZDIgPSBpbnRlcnBvbGF0ZSh0KVxuICAgICAgICAgICAgICBfdGhpcy5fY3VycmVudCA9IGQyXG4gICAgICAgICAgICAgIHBvcyA9IG91dGVyQXJjLmNlbnRyb2lkKGQyKVxuICAgICAgICAgICAgICBwb3NbMF0gKz0gMTUgKiAoaWYgbWlkQW5nbGUoZDIpIDwgTWF0aC5QSSB0aGVuICAxIGVsc2UgLTEpXG4gICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZSgje3Bvc30pXCIpXG4gICAgICAgICAgLnN0eWxlVHdlZW4oJ3RleHQtYW5jaG9yJywgKGQpIC0+XG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKEBfY3VycmVudCwgZClcbiAgICAgICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICAgICAgZDIgPSBpbnRlcnBvbGF0ZSh0KVxuICAgICAgICAgICAgICByZXR1cm4gaWYgbWlkQW5nbGUoZDIpIDwgTWF0aC5QSSB0aGVuICBcInN0YXJ0XCIgZWxzZSBcImVuZFwiXG4gICAgICAgIClcblxuICAgICAgICBsYWJlbHMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICAgIy0tLSBEcmF3IENvbm5lY3RvciBMaW5lcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgcG9seWxpbmUgPSBwaWVCb3guc2VsZWN0QWxsKFwiLndrLWNoYXJ0LXBvbHlsaW5lXCIpLmRhdGEoc2VnbWVudHMsIGtleSlcblxuICAgICAgICBwb2x5bGluZS5lbnRlcigpXG4gICAgICAgIC4gYXBwZW5kKFwicG9seWxpbmVcIikuYXR0cignY2xhc3MnLCd3ay1jaGFydC1wb2x5bGluZScpXG4gICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKVxuICAgICAgICAgIC5lYWNoKChkKSAtPiAgdGhpcy5fY3VycmVudCA9IGQpXG5cbiAgICAgICAgcG9seWxpbmUudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAoZCkgLT4gaWYgZC5kYXRhLnZhbHVlIGlzIDAgdGhlbiAgMCBlbHNlIC41KVxuICAgICAgICAgIC5hdHRyVHdlZW4oXCJwb2ludHNcIiwgKGQpIC0+XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gdGhpcy5fY3VycmVudFxuICAgICAgICAgICAgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZSh0aGlzLl9jdXJyZW50LCBkKVxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzXG4gICAgICAgICAgICByZXR1cm4gKHQpIC0+XG4gICAgICAgICAgICAgIGQyID0gaW50ZXJwb2xhdGUodClcbiAgICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnQgPSBkMjtcbiAgICAgICAgICAgICAgcG9zID0gb3V0ZXJBcmMuY2VudHJvaWQoZDIpXG4gICAgICAgICAgICAgIHBvc1swXSArPSAxMCAqIChpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIDEgZWxzZSAtMSlcbiAgICAgICAgICAgICAgcmV0dXJuIFtpbm5lckFyYy5jZW50cm9pZChkMiksIG91dGVyQXJjLmNlbnRyb2lkKGQyKSwgcG9zXTtcbiAgICAgICAgICApXG5cbiAgICAgICAgcG9seWxpbmUuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMClcbiAgICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICAgIGVsc2VcbiAgICAgICAgcGllQm94LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXBvbHlsaW5lJykucmVtb3ZlKClcbiAgICAgICAgcGllQm94LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWRhdGEtbGFiZWwnKS5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsU2hvdyA9IGZhbHNlXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgX3NjYWxlTGlzdCA9IHRoaXMuZ2V0U2NhbGVzKFsnc2l6ZScsICdjb2xvciddKVxuICAgICAgX3NjYWxlTGlzdC5jb2xvci5zY2FsZVR5cGUoJ2NhdGVnb3J5MjAnKVxuICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3Q2hhcnQnLCBkcmF3XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVscycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBfc2hvd0xhYmVscyA9IGZhbHNlXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZScgb3IgdmFsIGlzIFwiXCJcbiAgICAgICAgX3Nob3dMYWJlbHMgPSB0cnVlXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuXG4gICNUT0RPIHZlcmlmeSBiZWhhdmlvciB3aXRoIGN1c3RvbSB0b29sdGlwcyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc2NhdHRlcicsICgkbG9nLCB1dGlscykgLT5cbiAgc2NhdHRlckNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIF9pZCA9ICdzY2F0dGVyJyArIHNjYXR0ZXJDbnQrK1xuICAgICAgX3NjYWxlTGlzdCA9IFtdXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgZm9yIHNOYW1lLCBzY2FsZSBvZiBfc2NhbGVMaXN0XG4gICAgICAgICAgQGxheWVycy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IHNjYWxlLmF4aXNMYWJlbCgpLFxuICAgICAgICAgICAgdmFsdWU6IHNjYWxlLmZvcm1hdHRlZFZhbHVlKGRhdGEpLFxuICAgICAgICAgICAgY29sb3I6IGlmIHNOYW1lIGlzICdjb2xvcicgdGhlbiB7J2JhY2tncm91bmQtY29sb3InOnNjYWxlLm1hcChkYXRhKX0gZWxzZSB1bmRlZmluZWQsXG4gICAgICAgICAgICBwYXRoOiBpZiBzTmFtZSBpcyAnc2hhcGUnIHRoZW4gZDMuc3ZnLnN5bWJvbCgpLnR5cGUoc2NhbGUubWFwKGRhdGEpKS5zaXplKDgwKSgpIGVsc2UgdW5kZWZpbmVkXG4gICAgICAgICAgICBjbGFzczogaWYgc05hbWUgaXMgJ3NoYXBlJyB0aGVuICd3ay1jaGFydC10dC1zdmctc2hhcGUnIGVsc2UgJydcbiAgICAgICAgICB9KVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaW5pdGlhbFNob3cgPSB0cnVlXG5cblxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplLCBzaGFwZSkgLT5cbiAgICAgICAgIyRsb2cuZGVidWcgJ2RyYXdpbmcgc2NhdHRlciBjaGFydCdcbiAgICAgICAgaW5pdCA9IChzKSAtPlxuICAgICAgICAgIGlmIGluaXRpYWxTaG93XG4gICAgICAgICAgICBzLnN0eWxlKCdmaWxsJywgY29sb3IubWFwKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+IFwidHJhbnNsYXRlKCN7eC5tYXAoZCl9LCN7eS5tYXAoZCl9KVwiKS5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgaW5pdGlhbFNob3cgPSBmYWxzZVxuXG4gICAgICAgIHBvaW50cyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1wb2ludHMnKVxuICAgICAgICAgIC5kYXRhKGRhdGEpXG4gICAgICAgIHBvaW50cy5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXBvaW50cyB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT4gXCJ0cmFuc2xhdGUoI3t4Lm1hcChkKX0sI3t5Lm1hcChkKX0pXCIpXG4gICAgICAgICAgLmNhbGwoaW5pdClcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgICAgcG9pbnRzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgZDMuc3ZnLnN5bWJvbCgpLnR5cGUoKGQpIC0+IHNoYXBlLm1hcChkKSkuc2l6ZSgoZCkgLT4gc2l6ZS5tYXAoZCkgKiBzaXplLm1hcChkKSkpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgY29sb3IubWFwKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCktPiBcInRyYW5zbGF0ZSgje3gubWFwKGQpfSwje3kubWFwKGQpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIHBvaW50cy5leGl0KCkucmVtb3ZlKClcblxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvcicsICdzaXplJywgJ3NoYXBlJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGxheW91dC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydCcsIGRyYXdcbiAgfVxuXG4jVE9ETyB2ZXJpZnkgYmVoYXZpb3Igd2l0aCBjdXN0b20gdG9vbHRpcHNcbiNUT0RPIEltcGxlbWVudCBpbiBuZXcgZGVtbyBhcHAiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NwaWRlcicsICgkbG9nLCB1dGlscykgLT5cbiAgc3BpZGVyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5kZWJ1ZyAnYnViYmxlQ2hhcnQgbGlua2VkJ1xuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnc3BpZGVyJyArIHNwaWRlckNudHIrK1xuICAgICAgYXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgIF9kYXRhID0gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIEBsYXllcnMgPSBfZGF0YS5tYXAoKGQpIC0+ICB7bmFtZTpfc2NhbGVMaXN0LngudmFsdWUoZCksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShkW2RhdGFdKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6X3NjYWxlTGlzdC5jb2xvci5zY2FsZSgpKGRhdGEpfX0pXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBfZGF0YSA9IGRhdGFcbiAgICAgICAgJGxvZy5sb2cgZGF0YVxuICAgICAgICAjIGNvbXB1dGUgY2VudGVyIG9mIGFyZWFcbiAgICAgICAgY2VudGVyWCA9IG9wdGlvbnMud2lkdGgvMlxuICAgICAgICBjZW50ZXJZID0gb3B0aW9ucy5oZWlnaHQvMlxuICAgICAgICByYWRpdXMgPSBkMy5taW4oW2NlbnRlclgsIGNlbnRlclldKSAqIDAuOFxuICAgICAgICB0ZXh0T2ZmcyA9IDIwXG4gICAgICAgIG5ickF4aXMgPSBkYXRhLmxlbmd0aFxuICAgICAgICBhcmMgPSBNYXRoLlBJICogMiAvIG5ickF4aXNcbiAgICAgICAgZGVnciA9IDM2MCAvIG5ickF4aXNcblxuICAgICAgICBheGlzRyA9IHRoaXMuc2VsZWN0KCcud2stY2hhcnQtYXhpcycpXG4gICAgICAgIGlmIGF4aXNHLmVtcHR5KClcbiAgICAgICAgICBheGlzRyA9IHRoaXMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcycpXG5cbiAgICAgICAgdGlja3MgPSB5LnNjYWxlKCkudGlja3MoeS50aWNrcygpKVxuICAgICAgICB5LnNjYWxlKCkucmFuZ2UoW3JhZGl1cywwXSkgIyB0cmlja3MgdGhlIHdheSBheGlzIGFyZSBkcmF3bi4gTm90IHByZXR0eSwgYnV0IHdvcmtzIDotKVxuICAgICAgICBheGlzLnNjYWxlKHkuc2NhbGUoKSkub3JpZW50KCdyaWdodCcpLnRpY2tWYWx1ZXModGlja3MpLnRpY2tGb3JtYXQoeS50aWNrRm9ybWF0KCkpXG4gICAgICAgIGF4aXNHLmNhbGwoYXhpcykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwje2NlbnRlclktcmFkaXVzfSlcIilcbiAgICAgICAgeS5zY2FsZSgpLnJhbmdlKFswLHJhZGl1c10pXG5cbiAgICAgICAgbGluZXMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMtbGluZScpLmRhdGEoZGF0YSwoZCkgLT4gZC5heGlzKVxuICAgICAgICBsaW5lcy5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWF4aXMtbGluZScpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnZGFya2dyZXknKVxuXG4gICAgICAgIGxpbmVzXG4gICAgICAgICAgLmF0dHIoe3gxOjAsIHkxOjAsIHgyOjAsIHkyOnJhZGl1c30pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQsaSkgLT4gXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwgI3tjZW50ZXJZfSlyb3RhdGUoI3tkZWdyICogaX0pXCIpXG5cbiAgICAgICAgbGluZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgI2RyYXcgdGljayBsaW5lc1xuICAgICAgICB0aWNrTGluZSA9IGQzLnN2Zy5saW5lKCkueCgoZCkgLT4gZC54KS55KChkKS0+ZC55KVxuICAgICAgICB0aWNrUGF0aCA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtdGlja1BhdGgnKS5kYXRhKHRpY2tzKVxuICAgICAgICB0aWNrUGF0aC5lbnRlcigpLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXRpY2tQYXRoJylcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnbm9uZScpLnN0eWxlKCdzdHJva2UnLCAnbGlnaHRncmV5JylcblxuICAgICAgICB0aWNrUGF0aFxuICAgICAgICAgIC5hdHRyKCdkJywoZCkgLT5cbiAgICAgICAgICAgIHAgPSBkYXRhLm1hcCgoYSwgaSkgLT4ge3g6TWF0aC5zaW4oYXJjKmkpICogeS5zY2FsZSgpKGQpLHk6TWF0aC5jb3MoYXJjKmkpICogeS5zY2FsZSgpKGQpfSlcbiAgICAgICAgICAgIHRpY2tMaW5lKHApICsgJ1onKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KVwiKVxuXG4gICAgICAgIHRpY2tQYXRoLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgIGF4aXNMYWJlbHMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMtdGV4dCcpLmRhdGEoZGF0YSwoZCkgLT4geC52YWx1ZShkKSlcbiAgICAgICAgYXhpc0xhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWF4aXMtdGV4dCcpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgICAuYXR0cignZHknLCAnMC44ZW0nKVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICBheGlzTGFiZWxzXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgICB4OiAoZCwgaSkgLT4gY2VudGVyWCArIE1hdGguc2luKGFyYyAqIGkpICogKHJhZGl1cyArIHRleHRPZmZzKVxuICAgICAgICAgICAgICB5OiAoZCwgaSkgLT4gY2VudGVyWSArIE1hdGguY29zKGFyYyAqIGkpICogKHJhZGl1cyArIHRleHRPZmZzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAudGV4dCgoZCkgLT4geC52YWx1ZShkKSlcblxuICAgICAgICAjIGRyYXcgZGF0YSBsaW5lc1xuXG4gICAgICAgIGRhdGFQYXRoID0gZDMuc3ZnLmxpbmUoKS54KChkKSAtPiBkLngpLnkoKGQpIC0+IGQueSlcblxuICAgICAgICBkYXRhTGluZSA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtZGF0YS1saW5lJykuZGF0YSh5LmxheWVyS2V5cyhkYXRhKSlcbiAgICAgICAgZGF0YUxpbmUuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1kYXRhLWxpbmUnKVxuICAgICAgICAgIC5zdHlsZSh7XG4gICAgICAgICAgICBzdHJva2U6KGQpIC0+IGNvbG9yLnNjYWxlKCkoZClcbiAgICAgICAgICAgIGZpbGw6KGQpIC0+IGNvbG9yLnNjYWxlKCkoZClcbiAgICAgICAgICAgICdmaWxsLW9wYWNpdHknOiAwLjJcbiAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAyXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICBkYXRhTGluZS5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBwID0gZGF0YS5tYXAoKGEsIGkpIC0+IHt4Ok1hdGguc2luKGFyYyppKSAqIHkuc2NhbGUoKShhW2RdKSx5Ok1hdGguY29zKGFyYyppKSAqIHkuc2NhbGUoKShhW2RdKX0pXG4gICAgICAgICAgICBkYXRhUGF0aChwKSArICdaJ1xuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwgI3tjZW50ZXJZfSlcIilcblxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIF9zY2FsZUxpc3QueS5kb21haW5DYWxjKCdtYXgnKVxuICAgICAgICBfc2NhbGVMaXN0LngucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgI0BsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0JywgZHJhd1xuXG4gIH1cblxuI1RPRE8gdmVyaWZ5IGJlaGF2aW9yIHdpdGggY3VzdG9tIHRvb2x0aXBzXG4jVE9ETyBmaXggJ3Rvb2x0aXAgYXR0cmlidXRlIGxpc3QgdG9vIGxvbmcnIHByb2JsZW1cbiNUT0RPIGFkZCBlbnRlciAvIGV4aXQgYW5pbWF0aW9uIGJlaGF2aW9yXG4jVE9ETyBJbXBsZW1lbnQgZGF0YSBsYWJlbHNcbiNUT0RPIGltcGxlbWVudCBhbmQgdGVzdCBvYmplY3Qgc2VsZWN0aW9uIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JCcnVzaCcsICgkbG9nLCAkd2luZG93LCBzZWxlY3Rpb25TaGFyaW5nLCB0aW1pbmcpIC0+XG5cbiAgYmVoYXZpb3JCcnVzaCA9ICgpIC0+XG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBfYWN0aXZlID0gZmFsc2VcbiAgICBfb3ZlcmxheSA9IHVuZGVmaW5lZFxuICAgIF9leHRlbnQgPSB1bmRlZmluZWRcbiAgICBfc3RhcnRQb3MgPSB1bmRlZmluZWRcbiAgICBfZXZUYXJnZXREYXRhID0gdW5kZWZpbmVkXG4gICAgX2FyZWEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9hcmVhU2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2FyZWFCb3ggPSB1bmRlZmluZWRcbiAgICBfYmFja2dyb3VuZEJveCA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfc2VsZWN0YWJsZXMgPSAgdW5kZWZpbmVkXG4gICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcbiAgICBfeCA9IHVuZGVmaW5lZFxuICAgIF95ID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICBfYnJ1c2hYWSA9IGZhbHNlXG4gICAgX2JydXNoWCA9IGZhbHNlXG4gICAgX2JydXNoWSA9IGZhbHNlXG4gICAgX2JvdW5kc0lkeCA9IHVuZGVmaW5lZFxuICAgIF9ib3VuZHNWYWx1ZXMgPSB1bmRlZmluZWRcbiAgICBfYm91bmRzRG9tYWluID0gdW5kZWZpbmVkXG4gICAgX2JydXNoRXZlbnRzID0gZDMuZGlzcGF0Y2goJ2JydXNoU3RhcnQnLCAnYnJ1c2gnLCAnYnJ1c2hFbmQnKVxuXG4gICAgbGVmdCA9IHRvcCA9IHJpZ2h0ID0gYm90dG9tID0gc3RhcnRUb3AgPSBzdGFydExlZnQgPSBzdGFydFJpZ2h0ID0gc3RhcnRCb3R0b20gPSB1bmRlZmluZWRcblxuICAgICMtLS0gQnJ1c2ggdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcG9zaXRpb25CcnVzaEVsZW1lbnRzID0gKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSkgLT5cbiAgICAgIHdpZHRoID0gcmlnaHQgLSBsZWZ0XG4gICAgICBoZWlnaHQgPSBib3R0b20gLSB0b3BcblxuICAgICAgIyBwb3NpdGlvbiByZXNpemUtaGFuZGxlcyBpbnRvIHRoZSByaWdodCBjb3JuZXJzXG4gICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7Ym90dG9tfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbmUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje3RvcH0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW53JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tyaWdodH0sI3tib3R0b219KVwiKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3tib3R0b219KVwiKVxuICAgICAgICBfZXh0ZW50LmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCkuYXR0cigneCcsIGxlZnQpLmF0dHIoJ3knLCB0b3ApXG4gICAgICBpZiBfYnJ1c2hYXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXcnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LDApXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LDApXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodClcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBfYXJlYUJveC5oZWlnaHQpLmF0dHIoJ3gnLCBsZWZ0KS5hdHRyKCd5JywgMClcbiAgICAgIGlmIF9icnVzaFlcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbicpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje2JvdHRvbX0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW4nKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCBfYXJlYUJveC53aWR0aClcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpLmF0dHIoJ3gnLCAwKS5hdHRyKCd5JywgdG9wKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldFNlbGVjdGVkT2JqZWN0cyA9ICgpIC0+XG4gICAgICBlciA9IF9leHRlbnQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBfc2VsZWN0YWJsZXMuZWFjaCgoZCkgLT5cbiAgICAgICAgICBjciA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICB4SGl0ID0gZXIubGVmdCA8IGNyLnJpZ2h0IC0gY3Iud2lkdGggLyAzIGFuZCBjci5sZWZ0ICsgY3Iud2lkdGggLyAzIDwgZXIucmlnaHRcbiAgICAgICAgICB5SGl0ID0gZXIudG9wIDwgY3IuYm90dG9tIC0gY3IuaGVpZ2h0IC8gMyBhbmQgY3IudG9wICsgY3IuaGVpZ2h0IC8gMyA8IGVyLmJvdHRvbVxuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCd3ay1jaGFydC1zZWxlY3RlZCcsIHlIaXQgYW5kIHhIaXQpXG4gICAgICAgIClcbiAgICAgIHJldHVybiBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGVkJykuZGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgc2V0U2VsZWN0aW9uID0gKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSkgLT5cbiAgICAgIGlmIF9icnVzaFhcbiAgICAgICAgX2JvdW5kc0lkeCA9IFttZS54KCkuaW52ZXJ0KGxlZnQpLCBtZS54KCkuaW52ZXJ0KHJpZ2h0KV1cbiAgICAgICAgaWYgbWUueCgpLmlzT3JkaW5hbCgpXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IF9kYXRhLm1hcCgoZCkgLT4gbWUueCgpLnZhbHVlKGQpKS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIG1lLngoKS5raW5kKCkgaXMgJ3JhbmdlWCdcbiAgICAgICAgICAgIGlmIG1lLngoKS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFttZS54KCkubG93ZXJWYWx1ZShfZGF0YVtfYm91bmRzSWR4WzBdXSksIG1lLngoKS51cHBlclZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMV1dKV1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgc3RlcCA9IG1lLngoKS5sb3dlclZhbHVlKF9kYXRhWzFdKSAtIG1lLngoKS5sb3dlclZhbHVlKF9kYXRhWzBdKVxuICAgICAgICAgICAgICBfYm91bmRzVmFsdWVzID0gW21lLngoKS5sb3dlclZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMF1dKSwgbWUueCgpLmxvd2VyVmFsdWUoX2RhdGFbX2JvdW5kc0lkeFsxXV0pICsgc3RlcF1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBfYm91bmRzVmFsdWVzID0gW21lLngoKS52YWx1ZShfZGF0YVtfYm91bmRzSWR4WzBdXSksIG1lLngoKS52YWx1ZShfZGF0YVtfYm91bmRzSWR4WzFdXSldXG4gICAgICAgIF9ib3VuZHNEb21haW4gPSBfZGF0YS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgIGlmIF9icnVzaFlcbiAgICAgICAgX2JvdW5kc0lkeCA9IFttZS55KCkuaW52ZXJ0KGJvdHRvbSksIG1lLnkoKS5pbnZlcnQodG9wKV1cbiAgICAgICAgaWYgbWUueSgpLmlzT3JkaW5hbCgpXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IF9kYXRhLm1hcCgoZCkgLT4gbWUueSgpLnZhbHVlKGQpKS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIG1lLnkoKS5raW5kKCkgaXMgJ3JhbmdlWSdcbiAgICAgICAgICAgIHN0ZXAgPSBtZS55KCkubG93ZXJWYWx1ZShfZGF0YVsxXSkgLSBtZS55KCkubG93ZXJWYWx1ZShfZGF0YVswXSlcbiAgICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbbWUueSgpLmxvd2VyVmFsdWUoX2RhdGFbX2JvdW5kc0lkeFswXV0pLCBtZS55KCkubG93ZXJWYWx1ZShfZGF0YVtfYm91bmRzSWR4WzFdXSkgKyBzdGVwXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbbWUueSgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMF1dKSwgbWUueSgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMV1dKV1cbiAgICAgICAgX2JvdW5kc0RvbWFpbiA9IF9kYXRhLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgaWYgX2JydXNoWFlcbiAgICAgICAgX2JvdW5kc0lkeCA9IFtdXG4gICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbXVxuICAgICAgICBfYm91bmRzRG9tYWluID0gZ2V0U2VsZWN0ZWRPYmplY3RzKClcblxuICAgICMtLS0gQnJ1c2hTdGFydCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuXG4gICAgYnJ1c2hTdGFydCA9ICgpIC0+XG4gICAgICAjcmVnaXN0ZXIgYSBtb3VzZSBoYW5kbGVycyBmb3IgdGhlIGJydXNoXG4gICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBfZXZUYXJnZXREYXRhID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldCkuZGF0dW0oKVxuICAgICAgXyBpZiBub3QgX2V2VGFyZ2V0RGF0YVxuICAgICAgICBfZXZUYXJnZXREYXRhID0ge25hbWU6J2ZvcndhcmRlZCd9XG4gICAgICBfYXJlYUJveCA9IF9hcmVhLmdldEJCb3goKVxuICAgICAgX3N0YXJ0UG9zID0gZDMubW91c2UoX2FyZWEpXG4gICAgICBzdGFydFRvcCA9IHRvcFxuICAgICAgc3RhcnRMZWZ0ID0gbGVmdFxuICAgICAgc3RhcnRSaWdodCA9IHJpZ2h0XG4gICAgICBzdGFydEJvdHRvbSA9IGJvdHRvbVxuICAgICAgZDMuc2VsZWN0KF9hcmVhKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJykuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LXJlc2l6ZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcbiAgICAgIGQzLnNlbGVjdCgnYm9keScpLnN0eWxlKCdjdXJzb3InLCBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5zdHlsZSgnY3Vyc29yJykpXG5cbiAgICAgIGQzLnNlbGVjdCgkd2luZG93KS5vbignbW91c2Vtb3ZlLmJydXNoJywgYnJ1c2hNb3ZlKS5vbignbW91c2V1cC5icnVzaCcsIGJydXNoRW5kKVxuXG4gICAgICBfdG9vbHRpcC5oaWRlKHRydWUpXG4gICAgICBfYm91bmRzSWR4ID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0YWJsZXMgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoU3RhcnQoKVxuICAgICAgdGltaW5nLmNsZWFyKClcbiAgICAgIHRpbWluZy5pbml0KClcblxuICAgICMtLS0gQnJ1c2hFbmQgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBicnVzaEVuZCA9ICgpIC0+XG4gICAgICAjZGUtcmVnaXN0ZXIgaGFuZGxlcnNcblxuICAgICAgZDMuc2VsZWN0KCR3aW5kb3cpLm9uICdtb3VzZW1vdmUuYnJ1c2gnLCBudWxsXG4gICAgICBkMy5zZWxlY3QoJHdpbmRvdykub24gJ21vdXNldXAuYnJ1c2gnLCBudWxsXG4gICAgICBkMy5zZWxlY3QoX2FyZWEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ2FsbCcpLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXJlc2l6ZScpLnN0eWxlKCdkaXNwbGF5JywgbnVsbCkgIyBzaG93IHRoZSByZXNpemUgaGFuZGxlcnNcbiAgICAgIGQzLnNlbGVjdCgnYm9keScpLnN0eWxlKCdjdXJzb3InLCBudWxsKVxuICAgICAgaWYgYm90dG9tIC0gdG9wIGlzIDAgb3IgcmlnaHQgLSBsZWZ0IGlzIDBcbiAgICAgICAgI2JydXNoIGlzIGVtcHR5XG4gICAgICAgIGQzLnNlbGVjdChfYXJlYSkuc2VsZWN0QWxsKCcud2stY2hhcnQtcmVzaXplJykuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpXG4gICAgICBfdG9vbHRpcC5oaWRlKGZhbHNlKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoRW5kKF9ib3VuZHNJZHgpXG4gICAgICB0aW1pbmcucmVwb3J0KClcblxuICAgICMtLS0gQnJ1c2hNb3ZlIEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBicnVzaE1vdmUgPSAoKSAtPlxuICAgICAgJGxvZy5pbmZvICdicnVzaG1vdmUnXG4gICAgICBwb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIGRlbHRhWCA9IHBvc1swXSAtIF9zdGFydFBvc1swXVxuICAgICAgZGVsdGFZID0gcG9zWzFdIC0gX3N0YXJ0UG9zWzFdXG5cbiAgICAgICMgdGhpcyBlbGFib3JhdGUgY29kZSBpcyBuZWVkZWQgdG8gZGVhbCB3aXRoIHNjZW5hcmlvcyB3aGVuIG1vdXNlIG1vdmVzIGZhc3QgYW5kIHRoZSBldmVudHMgZG8gbm90IGhpdCB4L3kgKyBkZWx0YVxuICAgICAgIyBkb2VzIG5vdCBoaSB0aGUgMCBwb2ludCBtYXllIHRoZXJlIGlzIGEgbW9yZSBlbGVnYW50IHdheSB0byB3cml0ZSB0aGlzLCBidXQgZm9yIG5vdyBpdCB3b3JrcyA6LSlcblxuICAgICAgbGVmdE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydExlZnQgKyBkZWx0YVxuICAgICAgICBsZWZ0ID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRSaWdodCB0aGVuIHBvcyBlbHNlIHN0YXJ0UmlnaHQpIGVsc2UgMFxuICAgICAgICByaWdodCA9IGlmIHBvcyA8PSBfYXJlYUJveC53aWR0aCB0aGVuIChpZiBwb3MgPCBzdGFydFJpZ2h0IHRoZW4gc3RhcnRSaWdodCBlbHNlIHBvcykgZWxzZSBfYXJlYUJveC53aWR0aFxuXG4gICAgICByaWdodE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydFJpZ2h0ICsgZGVsdGFcbiAgICAgICAgbGVmdCA9IGlmIHBvcyA+PSAwIHRoZW4gKGlmIHBvcyA8IHN0YXJ0TGVmdCB0aGVuIHBvcyBlbHNlIHN0YXJ0TGVmdCkgZWxzZSAwXG4gICAgICAgIHJpZ2h0ID0gaWYgcG9zIDw9IF9hcmVhQm94LndpZHRoIHRoZW4gKGlmIHBvcyA8IHN0YXJ0TGVmdCB0aGVuIHN0YXJ0TGVmdCBlbHNlIHBvcykgZWxzZSBfYXJlYUJveC53aWR0aFxuXG4gICAgICB0b3BNdiA9IChkZWx0YSkgLT5cbiAgICAgICAgcG9zID0gc3RhcnRUb3AgKyBkZWx0YVxuICAgICAgICB0b3AgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydEJvdHRvbSB0aGVuIHBvcyBlbHNlIHN0YXJ0Qm90dG9tKSBlbHNlIDBcbiAgICAgICAgYm90dG9tID0gaWYgcG9zIDw9IF9hcmVhQm94LmhlaWdodCB0aGVuIChpZiBwb3MgPiBzdGFydEJvdHRvbSB0aGVuIHBvcyBlbHNlIHN0YXJ0Qm90dG9tICkgZWxzZSBfYXJlYUJveC5oZWlnaHRcblxuICAgICAgYm90dG9tTXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0Qm90dG9tICsgZGVsdGFcbiAgICAgICAgdG9wID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRUb3AgdGhlbiBwb3MgZWxzZSBzdGFydFRvcCkgZWxzZSAwXG4gICAgICAgIGJvdHRvbSA9IGlmIHBvcyA8PSBfYXJlYUJveC5oZWlnaHQgdGhlbiAoaWYgcG9zID4gc3RhcnRUb3AgdGhlbiBwb3MgZWxzZSBzdGFydFRvcCApIGVsc2UgX2FyZWFCb3guaGVpZ2h0XG5cbiAgICAgIGhvck12ID0gKGRlbHRhKSAtPlxuICAgICAgICBpZiBzdGFydExlZnQgKyBkZWx0YSA+PSAwXG4gICAgICAgICAgaWYgc3RhcnRSaWdodCArIGRlbHRhIDw9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgICBsZWZ0ID0gc3RhcnRMZWZ0ICsgZGVsdGFcbiAgICAgICAgICAgIHJpZ2h0ID0gc3RhcnRSaWdodCArIGRlbHRhXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmlnaHQgPSBfYXJlYUJveC53aWR0aFxuICAgICAgICAgICAgbGVmdCA9IF9hcmVhQm94LndpZHRoIC0gKHN0YXJ0UmlnaHQgLSBzdGFydExlZnQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsZWZ0ID0gMFxuICAgICAgICAgIHJpZ2h0ID0gc3RhcnRSaWdodCAtIHN0YXJ0TGVmdFxuXG4gICAgICB2ZXJ0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIGlmIHN0YXJ0VG9wICsgZGVsdGEgPj0gMFxuICAgICAgICAgIGlmIHN0YXJ0Qm90dG9tICsgZGVsdGEgPD0gX2FyZWFCb3guaGVpZ2h0XG4gICAgICAgICAgICB0b3AgPSBzdGFydFRvcCArIGRlbHRhXG4gICAgICAgICAgICBib3R0b20gPSBzdGFydEJvdHRvbSArIGRlbHRhXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYm90dG9tID0gX2FyZWFCb3guaGVpZ2h0XG4gICAgICAgICAgICB0b3AgPSBfYXJlYUJveC5oZWlnaHQgLSAoc3RhcnRCb3R0b20gLSBzdGFydFRvcClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRvcCA9IDBcbiAgICAgICAgICBib3R0b20gPSBzdGFydEJvdHRvbSAtIHN0YXJ0VG9wXG5cbiAgICAgIHN3aXRjaCBfZXZUYXJnZXREYXRhLm5hbWVcbiAgICAgICAgd2hlbiAnYmFja2dyb3VuZCcsICdmb3J3YXJkZWQnXG4gICAgICAgICAgaWYgZGVsdGFYICsgX3N0YXJ0UG9zWzBdID4gMFxuICAgICAgICAgICAgbGVmdCA9IGlmIGRlbHRhWCA8IDAgdGhlbiBfc3RhcnRQb3NbMF0gKyBkZWx0YVggZWxzZSBfc3RhcnRQb3NbMF1cbiAgICAgICAgICAgIGlmIGxlZnQgKyBNYXRoLmFicyhkZWx0YVgpIDwgX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICAgICAgcmlnaHQgPSBsZWZ0ICsgTWF0aC5hYnMoZGVsdGFYKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByaWdodCA9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGVmdCA9IDBcblxuICAgICAgICAgIGlmIGRlbHRhWSArIF9zdGFydFBvc1sxXSA+IDBcbiAgICAgICAgICAgIHRvcCA9IGlmIGRlbHRhWSA8IDAgdGhlbiBfc3RhcnRQb3NbMV0gKyBkZWx0YVkgZWxzZSBfc3RhcnRQb3NbMV1cbiAgICAgICAgICAgIGlmIHRvcCArIE1hdGguYWJzKGRlbHRhWSkgPCBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgICAgYm90dG9tID0gdG9wICsgTWF0aC5hYnMoZGVsdGFZKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBib3R0b20gPSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0b3AgPSAwXG4gICAgICAgIHdoZW4gJ2V4dGVudCdcbiAgICAgICAgICB2ZXJ0TXYoZGVsdGFZKTsgaG9yTXYoZGVsdGFYKVxuICAgICAgICB3aGVuICduJ1xuICAgICAgICAgIHRvcE12KGRlbHRhWSlcbiAgICAgICAgd2hlbiAncydcbiAgICAgICAgICBib3R0b21NdihkZWx0YVkpXG4gICAgICAgIHdoZW4gJ3cnXG4gICAgICAgICAgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnZSdcbiAgICAgICAgICByaWdodE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnbncnXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKTsgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnbmUnXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKTsgcmlnaHRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ3N3J1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSk7IGxlZnRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ3NlJ1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSk7IHJpZ2h0TXYoZGVsdGFYKVxuXG4gICAgICBwb3NpdGlvbkJydXNoRWxlbWVudHMobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuICAgICAgc2V0U2VsZWN0aW9uKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSlcbiAgICAgIF9icnVzaEV2ZW50cy5icnVzaChfYm91bmRzSWR4LCBfYm91bmRzVmFsdWVzLCBfYm91bmRzRG9tYWluKVxuICAgICAgc2VsZWN0aW9uU2hhcmluZy5zZXRTZWxlY3Rpb24gX2JvdW5kc1ZhbHVlcywgX2JvdW5kc0lkeCwgX2JydXNoR3JvdXBcblxuICAgICMtLS0gQnJ1c2ggLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5icnVzaCA9IChzKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9vdmVybGF5XG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICAgIF9vdmVybGF5ID0gc1xuICAgICAgICBfYnJ1c2hYWSA9IG1lLngoKSBhbmQgbWUueSgpXG4gICAgICAgIF9icnVzaFggPSBtZS54KCkgYW5kIG5vdCBtZS55KClcbiAgICAgICAgX2JydXNoWSA9IG1lLnkoKSBhbmQgbm90IG1lLngoKVxuICAgICAgICAjIGNyZWF0ZSB0aGUgaGFuZGxlciBlbGVtZW50cyBhbmQgcmVnaXN0ZXIgdGhlIGhhbmRsZXJzXG4gICAgICAgIHMuc3R5bGUoeydwb2ludGVyLWV2ZW50cyc6ICdhbGwnLCBjdXJzb3I6ICdjcm9zc2hhaXInfSlcbiAgICAgICAgX2V4dGVudCA9IHMuYXBwZW5kKCdyZWN0JykuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LWV4dGVudCcsIHg6MCwgeTowLCB3aWR0aDowLCBoZWlnaHQ6MH0pLnN0eWxlKCdjdXJzb3InLCdtb3ZlJykuZGF0dW0oe25hbWU6J2V4dGVudCd9KVxuICAgICAgICAjIHJlc2l6ZSBoYW5kbGVzIGZvciB0aGUgc2lkZXNcbiAgICAgICAgaWYgX2JydXNoWSBvciBfYnJ1c2hYWVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LW4nKS5zdHlsZSh7Y3Vyc29yOiducy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDowLCB5OiAtMywgd2lkdGg6MCwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonbid9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LXMnKS5zdHlsZSh7Y3Vyc29yOiducy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDowLCB5OiAtMywgd2lkdGg6MCwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZToncyd9KVxuICAgICAgICBpZiBfYnJ1c2hYIG9yIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtdycpLnN0eWxlKHtjdXJzb3I6J2V3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt5OjAsIHg6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6MH0pLmRhdHVtKHtuYW1lOid3J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtZScpLnN0eWxlKHtjdXJzb3I6J2V3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt5OjAsIHg6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6MH0pLmRhdHVtKHtuYW1lOidlJ30pXG4gICAgICAgICMgcmVzaXplIGhhbmRsZXMgZm9yIHRoZSBjb3JuZXJzXG4gICAgICAgIGlmIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbncnKS5zdHlsZSh7Y3Vyc29yOidud3NlLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidudyd9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LW5lJykuc3R5bGUoe2N1cnNvcjonbmVzdy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6IC0zLCB5OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonbmUnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1zdycpLnN0eWxlKHtjdXJzb3I6J25lc3ctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J3N3J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtc2UnKS5zdHlsZSh7Y3Vyc29yOidud3NlLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidzZSd9KVxuICAgICAgICAjcmVnaXN0ZXIgaGFuZGxlci4gUGxlYXNlIG5vdGUsIGJydXNoIHdhbnRzIHRoZSBtb3VzZSBkb3duIGV4Y2x1c2l2ZWx5ICEhIVxuICAgICAgICBzLm9uICdtb3VzZWRvd24uYnJ1c2gnLCBicnVzaFN0YXJ0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBFeHRlbnQgcmVzaXplIGhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHJlc2l6ZUV4dGVudCA9ICgpIC0+XG4gICAgICBpZiBfYXJlYUJveFxuICAgICAgICAkbG9nLmluZm8gJ3Jlc2l6ZUhhbmRsZXInXG4gICAgICAgIG5ld0JveCA9IF9hcmVhLmdldEJCb3goKVxuICAgICAgICBob3Jpem9udGFsUmF0aW8gPSBfYXJlYUJveC53aWR0aCAvIG5ld0JveC53aWR0aFxuICAgICAgICB2ZXJ0aWNhbFJhdGlvID0gX2FyZWFCb3guaGVpZ2h0IC8gbmV3Qm94LmhlaWdodFxuICAgICAgICB0b3AgPSB0b3AgLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIHN0YXJ0VG9wID0gc3RhcnRUb3AgLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIGJvdHRvbSA9IGJvdHRvbSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgc3RhcnRCb3R0b20gPSBzdGFydEJvdHRvbSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgbGVmdCA9IGxlZnQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgc3RhcnRMZWZ0ID0gc3RhcnRMZWZ0IC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIHJpZ2h0ID0gcmlnaHQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgc3RhcnRSaWdodCA9IHN0YXJ0UmlnaHQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgX3N0YXJ0UG9zWzBdID0gX3N0YXJ0UG9zWzBdIC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIF9zdGFydFBvc1sxXSA9IF9zdGFydFBvc1sxXSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgX2FyZWFCb3ggPSBuZXdCb3hcbiAgICAgICAgcG9zaXRpb25CcnVzaEVsZW1lbnRzKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSlcblxuICAgICMtLS0gQnJ1c2ggUHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuY2hhcnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSB2YWxcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uICdyZXNpemUuYnJ1c2gnLCByZXNpemVFeHRlbnRcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS54ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfeFxuICAgICAgZWxzZVxuICAgICAgICBfeCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUueSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3lcbiAgICAgIGVsc2VcbiAgICAgICAgX3kgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmFyZWEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hcmVhU2VsZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfYXJlYVNlbGVjdGlvblxuICAgICAgICAgIF9hcmVhU2VsZWN0aW9uID0gdmFsXG4gICAgICAgICAgX2FyZWEgPSBfYXJlYVNlbGVjdGlvbi5ub2RlKClcbiAgICAgICAgICAjX2FyZWFCb3ggPSBfYXJlYS5nZXRCQm94KCkgbmVlZCB0byBnZXQgd2hlbiBjYWxjdWxhdGluZyBzaXplIHRvIGRlYWwgd2l0aCByZXNpemluZ1xuICAgICAgICAgIG1lLmJydXNoKF9hcmVhU2VsZWN0aW9uKVxuXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICBfc2VsZWN0YWJsZXMgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGF0YSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmJydXNoR3JvdXAgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9icnVzaEdyb3VwXG4gICAgICBlbHNlXG4gICAgICAgIF9icnVzaEdyb3VwID0gdmFsXG4gICAgICAgIHNlbGVjdGlvblNoYXJpbmcuY3JlYXRlR3JvdXAoX2JydXNoR3JvdXApXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50b29sdGlwID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdG9vbHRpcFxuICAgICAgZWxzZVxuICAgICAgICBfdG9vbHRpcCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUub24gPSAobmFtZSwgY2FsbGJhY2spIC0+XG4gICAgICBfYnJ1c2hFdmVudHMub24gbmFtZSwgY2FsbGJhY2tcblxuICAgIG1lLmV4dGVudCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JvdW5kc0lkeFxuXG4gICAgbWUuZXZlbnRzID0gKCkgLT5cbiAgICAgIHJldHVybiBfYnJ1c2hFdmVudHNcblxuICAgIG1lLmVtcHR5ID0gKCkgLT5cbiAgICAgIHJldHVybiBfYm91bmRzSWR4IGlzIHVuZGVmaW5lZFxuXG4gICAgcmV0dXJuIG1lXG4gIHJldHVybiBiZWhhdmlvckJydXNoIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JTZWxlY3QnLCAoJGxvZykgLT5cbiAgc2VsZWN0SWQgPSAwXG5cbiAgc2VsZWN0ID0gKCkgLT5cblxuICAgIF9pZCA9IFwic2VsZWN0I3tzZWxlY3RJZCsrfVwiXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9hY3RpdmUgPSBmYWxzZVxuICAgIF9zZWxlY3Rpb25FdmVudHMgPSBkMy5kaXNwYXRjaCgnc2VsZWN0ZWQnKVxuXG4gICAgY2xpY2tlZCA9ICgpIC0+XG4gICAgICBpZiBub3QgX2FjdGl2ZSB0aGVuIHJldHVyblxuICAgICAgb2JqID0gZDMuc2VsZWN0KHRoaXMpXG4gICAgICBpZiBub3QgX2FjdGl2ZSB0aGVuIHJldHVyblxuICAgICAgaWYgb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICBpc1NlbGVjdGVkID0gb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGVkJylcbiAgICAgICAgb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGVkJywgbm90IGlzU2VsZWN0ZWQpXG4gICAgICAgIGFsbFNlbGVjdGVkID0gX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1zZWxlY3RlZCcpLmRhdGEoKS5tYXAoKGQpIC0+IGlmIGQuZGF0YSB0aGVuIGQuZGF0YSBlbHNlIGQpXG4gICAgICAgICMgZW5zdXJlIHRoYXQgb25seSB0aGUgb3JpZ2luYWwgdmFsdWVzIGFyZSByZXBvcnRlZCBiYWNrXG5cbiAgICAgICAgX3NlbGVjdGlvbkV2ZW50cy5zZWxlY3RlZChhbGxTZWxlY3RlZClcblxuICAgIG1lID0gKHNlbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBtZVxuICAgICAgZWxzZVxuICAgICAgICBzZWxcbiAgICAgICAgICAjIHJlZ2lzdGVyIHNlbGVjdGlvbiBldmVudHNcbiAgICAgICAgICAub24gJ2NsaWNrJywgY2xpY2tlZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfaWRcblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZXZlbnRzID0gKCkgLT5cbiAgICAgIHJldHVybiBfc2VsZWN0aW9uRXZlbnRzXG5cbiAgICBtZS5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgIF9zZWxlY3Rpb25FdmVudHMub24gbmFtZSwgY2FsbGJhY2tcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIHNlbGVjdCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2JlaGF2aW9yVG9vbHRpcCcsICgkbG9nLCAkZG9jdW1lbnQsICRyb290U2NvcGUsICRjb21waWxlLCAkdGVtcGxhdGVDYWNoZSwgdGVtcGxhdGVEaXIpIC0+XG5cbiAgYmVoYXZpb3JUb29sdGlwID0gKCkgLT5cblxuICAgIF9hY3RpdmUgPSBmYWxzZVxuICAgIF9wYXRoID0gJydcbiAgICBfaGlkZSA9IGZhbHNlXG4gICAgX3Nob3dNYXJrZXJMaW5lID0gdW5kZWZpbmVkXG4gICAgX21hcmtlckcgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyTGluZSA9IHVuZGVmaW5lZFxuICAgIF9hcmVhU2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2FyZWE9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyU2NhbGUgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF90b29sdGlwRGlzcGF0Y2ggPSBkMy5kaXNwYXRjaCgnZW50ZXInLCAnbW92ZURhdGEnLCAnbW92ZU1hcmtlcicsICdsZWF2ZScpXG5cbiAgICBfdGVtcGwgPSAkdGVtcGxhdGVDYWNoZS5nZXQodGVtcGxhdGVEaXIgKyAndG9vbFRpcC5odG1sJylcbiAgICBfdGVtcGxTY29wZSA9ICRyb290U2NvcGUuJG5ldyh0cnVlKVxuICAgIF9jb21waWxlZFRlbXBsID0gJGNvbXBpbGUoX3RlbXBsKShfdGVtcGxTY29wZSlcbiAgICBib2R5ID0gJGRvY3VtZW50LmZpbmQoJ2JvZHknKVxuXG4gICAgYm9keVJlY3QgPSBib2R5WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICAjLS0tIGhlbHBlciBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcG9zaXRpb25Cb3ggPSAoKSAtPlxuICAgICAgcmVjdCA9IF9jb21waWxlZFRlbXBsWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjbGllbnRYID0gaWYgYm9keVJlY3QucmlnaHQgLSAyMCA+IGQzLmV2ZW50LmNsaWVudFggKyByZWN0LndpZHRoICsgMTAgdGhlbiBkMy5ldmVudC5jbGllbnRYICsgMTAgZWxzZSBkMy5ldmVudC5jbGllbnRYIC0gcmVjdC53aWR0aCAtIDEwXG4gICAgICBjbGllbnRZID0gaWYgYm9keVJlY3QuYm90dG9tIC0gMjAgPiBkMy5ldmVudC5jbGllbnRZICsgcmVjdC5oZWlnaHQgKyAxMCB0aGVuIGQzLmV2ZW50LmNsaWVudFkgKyAxMCBlbHNlIGQzLmV2ZW50LmNsaWVudFkgLSByZWN0LmhlaWdodCAtIDEwXG4gICAgICBfdGVtcGxTY29wZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgbGVmdDogY2xpZW50WCArICdweCdcbiAgICAgICAgdG9wOiBjbGllbnRZICsgJ3B4J1xuICAgICAgICAnei1pbmRleCc6IDE1MDBcbiAgICAgICAgb3BhY2l0eTogMVxuICAgICAgfVxuICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KClcblxuICAgIHBvc2l0aW9uSW5pdGlhbCA9ICgpIC0+XG4gICAgICBfdGVtcGxTY29wZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgbGVmdDogMCArICdweCdcbiAgICAgICAgdG9wOiAwICsgJ3B4J1xuICAgICAgICAnei1pbmRleCc6IDE1MDBcbiAgICAgICAgb3BhY2l0eTogMFxuICAgICAgfVxuICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KCkgICMgZW5zdXJlIHRvb2x0aXAgZ2V0cyByZW5kZXJlZFxuICAgICAgI3dheWl0IHVudGlsIGl0IGlzIHJlbmRlcmVkIGFuZCB0aGVuIHJlcG9zaXRpb25cbiAgICAgIF8udGhyb3R0bGUgcG9zaXRpb25Cb3gsIDIwMFxuXG4gICAgIy0tLSBUb29sdGlwU3RhcnQgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRvb2x0aXBFbnRlciA9ICgpIC0+XG4gICAgICBpZiBub3QgX2FjdGl2ZSBvciBfaGlkZSB0aGVuIHJldHVyblxuICAgICAgIyBhcHBlbmQgZGF0YSBkaXZcbiAgICAgIGJvZHkuYXBwZW5kKF9jb21waWxlZFRlbXBsKVxuICAgICAgX3RlbXBsU2NvcGUubGF5ZXJzID0gW11cblxuICAgICAgIyBnZXQgdG9vbHRpcCBkYXRhIHZhbHVlXG5cbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICBfcG9zID0gZDMubW91c2UodGhpcylcbiAgICAgICAgdmFsdWUgPSBfbWFya2VyU2NhbGUuaW52ZXJ0KGlmIF9tYXJrZXJTY2FsZS5pc0hvcml6b250YWwoKSB0aGVuIF9wb3NbMF0gZWxzZSBfcG9zWzFdKVxuICAgICAgICBfdGVtcGxTY29wZS50dERhdGEgPSBtZS5kYXRhKClbdmFsdWVdXG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlID0gZDMuc2VsZWN0KHRoaXMpLmRhdHVtKClcbiAgICAgICAgX3RlbXBsU2NvcGUudHREYXRhID0gaWYgdmFsdWUuZGF0YSB0aGVuIHZhbHVlLmRhdGEgZWxzZSB2YWx1ZVxuXG4gICAgICBfdGVtcGxTY29wZS50dFNob3cgPSB0cnVlXG5cbiAgICAgIF90b29sdGlwRGlzcGF0Y2guZW50ZXIuYXBwbHkoX3RlbXBsU2NvcGUsIFt2YWx1ZV0pICMgY2FsbCBsYXlvdXQgdG8gZmlsbCBpbiBkYXRhXG4gICAgICBwb3NpdGlvbkluaXRpYWwoKVxuXG4gICAgICAjIGNyZWF0ZSBhIG1hcmtlciBsaW5lIGlmIHJlcXVpcmVkXG4gICAgICBpZiBfc2hvd01hcmtlckxpbmVcbiAgICAgICAgI19hcmVhID0gdGhpc1xuICAgICAgICBfYXJlYUJveCA9IF9hcmVhU2VsZWN0aW9uLnNlbGVjdCgnLndrLWNoYXJ0LWJhY2tncm91bmQnKS5ub2RlKCkuZ2V0QkJveCgpXG4gICAgICAgIF9wb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgICAgX21hcmtlckcgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpICAjIG5lZWQgdG8gYXBwZW5kIG1hcmtlciB0byBjaGFydCBhcmVhIHRvIGVuc3VyZSBpdCBpcyBvbiB0b3Agb2YgdGhlIGNoYXJ0IGVsZW1lbnRzIEZpeCAxMFxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC10b29sdGlwLW1hcmtlcicpXG4gICAgICAgIF9tYXJrZXJMaW5lID0gX21hcmtlckcuYXBwZW5kKCdsaW5lJylcbiAgICAgICAgaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpXG4gICAgICAgICAgX21hcmtlckxpbmUuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LW1hcmtlci1saW5lJywgeDA6MCwgeDE6MCwgeTA6MCx5MTpfYXJlYUJveC5oZWlnaHR9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX21hcmtlckxpbmUuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LW1hcmtlci1saW5lJywgeDA6MCwgeDE6X2FyZWFCb3gud2lkdGgsIHkwOjAseTE6MH0pXG5cbiAgICAgICAgX21hcmtlckxpbmUuc3R5bGUoe3N0cm9rZTogJ2RhcmtncmV5JywgJ3BvaW50ZXItZXZlbnRzJzogJ25vbmUnfSlcblxuICAgICAgICBfdG9vbHRpcERpc3BhdGNoLm1vdmVNYXJrZXIuYXBwbHkoX21hcmtlckcsIFt2YWx1ZV0pXG5cbiAgICAjLS0tIFRvb2x0aXBNb3ZlICBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcE1vdmUgPSAoKSAtPlxuICAgICAgaWYgbm90IF9hY3RpdmUgb3IgX2hpZGUgdGhlbiByZXR1cm5cbiAgICAgIF9wb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIHBvc2l0aW9uQm94KClcbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICBkYXRhSWR4ID0gX21hcmtlclNjYWxlLmludmVydChpZiBfbWFya2VyU2NhbGUuaXNIb3Jpem9udGFsKCkgdGhlbiBfcG9zWzBdIGVsc2UgX3Bvc1sxXSlcbiAgICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5tb3ZlTWFya2VyLmFwcGx5KF9tYXJrZXJHLCBbZGF0YUlkeF0pXG4gICAgICAgIF90ZW1wbFNjb3BlLmxheWVycyA9IFtdXG4gICAgICAgIF90ZW1wbFNjb3BlLnR0RGF0YSA9IG1lLmRhdGEoKVtkYXRhSWR4XVxuICAgICAgICBfdG9vbHRpcERpc3BhdGNoLm1vdmVEYXRhLmFwcGx5KF90ZW1wbFNjb3BlLCBbZGF0YUlkeF0pXG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKVxuXG4gICAgIy0tLSBUb29sdGlwTGVhdmUgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRvb2x0aXBMZWF2ZSA9ICgpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAndG9vbHRpcExlYXZlJywgX2FyZWFcbiAgICAgIGlmIF9tYXJrZXJHXG4gICAgICAgIF9tYXJrZXJHLnJlbW92ZSgpXG4gICAgICBfbWFya2VyRyA9IHVuZGVmaW5lZFxuICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gZmFsc2VcbiAgICAgIF9jb21waWxlZFRlbXBsLnJlbW92ZSgpXG5cbiAgICAjLS0tIEludGVyZmFjZSB0byBicnVzaCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZm9yd2FyZFRvQnJ1c2ggPSAoZSkgLT5cbiAgICAgICMgZm9yd2FyZCB0aGUgbW91c2Rvd24gZXZlbnQgdG8gdGhlIGJydXNoIG92ZXJsYXkgdG8gZW5zdXJlIHRoYXQgYnJ1c2hpbmcgY2FuIHN0YXJ0IGF0IGFueSBwb2ludCBpbiB0aGUgZHJhd2luZyBhcmVhXG5cbiAgICAgIGJydXNoX2VsbSA9IGQzLnNlbGVjdChfY29udGFpbmVyLm5vZGUoKS5wYXJlbnRFbGVtZW50KS5zZWxlY3QoXCIud2stY2hhcnQtb3ZlcmxheVwiKS5ub2RlKCk7XG4gICAgICBpZiBkMy5ldmVudC50YXJnZXQgaXNudCBicnVzaF9lbG0gI2RvIG5vdCBkaXNwYXRjaCBpZiB0YXJnZXQgaXMgb3ZlcmxheVxuICAgICAgICBuZXdfY2xpY2tfZXZlbnQgPSBuZXcgRXZlbnQoJ21vdXNlZG93bicpO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQucGFnZVggPSBkMy5ldmVudC5wYWdlWDtcbiAgICAgICAgbmV3X2NsaWNrX2V2ZW50LmNsaWVudFggPSBkMy5ldmVudC5jbGllbnRYO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQucGFnZVkgPSBkMy5ldmVudC5wYWdlWTtcbiAgICAgICAgbmV3X2NsaWNrX2V2ZW50LmNsaWVudFkgPSBkMy5ldmVudC5jbGllbnRZO1xuICAgICAgICBicnVzaF9lbG0uZGlzcGF0Y2hFdmVudChuZXdfY2xpY2tfZXZlbnQpO1xuXG5cbiAgICBtZS5oaWRlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaGlkZVxuICAgICAgZWxzZVxuICAgICAgICBfaGlkZSA9IHZhbFxuICAgICAgICBpZiBfbWFya2VyR1xuICAgICAgICAgIF9tYXJrZXJHLnN0eWxlKCd2aXNpYmlsaXR5JywgaWYgX2hpZGUgdGhlbiAnaGlkZGVuJyBlbHNlICd2aXNpYmxlJylcbiAgICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gbm90IF9oaWRlXG4gICAgICAgIF90ZW1wbFNjb3BlLiRhcHBseSgpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cblxuICAgICMtLSBUb29sdGlwIHByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5hY3RpdmUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hY3RpdmVcbiAgICAgIGVsc2VcbiAgICAgICAgX2FjdGl2ZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUudGVtcGxhdGUgPSAocGF0aCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cyBpcyAwIHRoZW4gcmV0dXJuIF9wYXRoXG4gICAgICBlbHNlXG4gICAgICAgIF9wYXRoID0gcGF0aFxuICAgICAgICBpZiBfcGF0aC5sZW5ndGggPiAwXG4gICAgICAgICAgX2N1c3RvbVRlbXBsID0gJHRlbXBsYXRlQ2FjaGUuZ2V0KCd0ZW1wbGF0ZXMvJyArIF9wYXRoKVxuICAgICAgICAgICMgd3JhcCB0ZW1wbGF0ZSBpbnRvIHBvc2l0aW9uaW5nIGRpdlxuICAgICAgICAgIF9jdXN0b21UZW1wbFdyYXBwZWQgPSBcIjxkaXYgY2xhc3M9XFxcIndrLWNoYXJ0LXRvb2x0aXBcXFwiIG5nLXNob3c9XFxcInR0U2hvd1xcXCIgbmctc3R5bGU9XFxcInBvc2l0aW9uXFxcIj4je19jdXN0b21UZW1wbH08L2Rpdj5cIlxuICAgICAgICAgIF9jb21waWxlZFRlbXBsID0gJGNvbXBpbGUoX2N1c3RvbVRlbXBsV3JhcHBlZCkoX3RlbXBsU2NvcGUpXG5cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hcmVhID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXJlYVNlbGVjdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfYXJlYVNlbGVjdGlvbiA9IHZhbFxuICAgICAgICBfYXJlYSA9IF9hcmVhU2VsZWN0aW9uLm5vZGUoKVxuICAgICAgICBpZiBfc2hvd01hcmtlckxpbmVcbiAgICAgICAgICBtZS50b29sdGlwKF9hcmVhU2VsZWN0aW9uKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuY29udGFpbmVyID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY29udGFpbmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9jb250YWluZXIgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLm1hcmtlclNjYWxlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbWFya2VyU2NhbGVcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgX3Nob3dNYXJrZXJMaW5lID0gdHJ1ZVxuICAgICAgICAgIF9tYXJrZXJTY2FsZSA9IHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJMaW5lID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmRhdGEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9kYXRhXG4gICAgICBlbHNlXG4gICAgICAgIF9kYXRhID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgIF90b29sdGlwRGlzcGF0Y2gub24gbmFtZSwgY2FsbGJhY2tcblxuICAgICMtLS0gVG9vbHRpcCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS50b29sdGlwID0gKHMpIC0+ICMgcmVnaXN0ZXIgdGhlIHRvb2x0aXAgZXZlbnRzIHdpdGggdGhlIHNlbGVjdGlvblxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIG1lXG4gICAgICBlbHNlICAjIHNldCB0b29sdGlwIGZvciBhbiBvYmplY3RzIHNlbGVjdGlvblxuICAgICAgICBzLm9uICdtb3VzZWVudGVyLnRvb2x0aXAnLCB0b29sdGlwRW50ZXJcbiAgICAgICAgICAub24gJ21vdXNlbW92ZS50b29sdGlwJywgdG9vbHRpcE1vdmVcbiAgICAgICAgICAub24gJ21vdXNlbGVhdmUudG9vbHRpcCcsIHRvb2x0aXBMZWF2ZVxuICAgICAgICBpZiBub3Qgcy5lbXB0eSgpIGFuZCBub3Qgcy5jbGFzc2VkKCd3ay1jaGFydC1vdmVybGF5JylcbiAgICAgICAgICBzLm9uICdtb3VzZWRvd24udG9vbHRpcCcsIGZvcndhcmRUb0JydXNoXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gYmVoYXZpb3JUb29sdGlwIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3InLCAoJGxvZywgJHdpbmRvdywgYmVoYXZpb3JUb29sdGlwLCBiZWhhdmlvckJydXNoLCBiZWhhdmlvclNlbGVjdCkgLT5cblxuICBiZWhhdmlvciA9ICgpIC0+XG5cbiAgICBfdG9vbHRpcCA9IGJlaGF2aW9yVG9vbHRpcCgpXG4gICAgX2JydXNoID0gYmVoYXZpb3JCcnVzaCgpXG4gICAgX3NlbGVjdGlvbiA9IGJlaGF2aW9yU2VsZWN0KClcbiAgICBfYnJ1c2gudG9vbHRpcChfdG9vbHRpcClcblxuICAgIGFyZWEgPSAoYXJlYSkgLT5cbiAgICAgIF9icnVzaC5hcmVhKGFyZWEpXG4gICAgICBfdG9vbHRpcC5hcmVhKGFyZWEpXG5cbiAgICBjb250YWluZXIgPSAoY29udGFpbmVyKSAtPlxuICAgICAgX2JydXNoLmNvbnRhaW5lcihjb250YWluZXIpXG4gICAgICBfc2VsZWN0aW9uLmNvbnRhaW5lcihjb250YWluZXIpXG4gICAgICBfdG9vbHRpcC5jb250YWluZXIoY29udGFpbmVyKVxuXG4gICAgY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBfYnJ1c2guY2hhcnQoY2hhcnQpXG5cbiAgICByZXR1cm4ge3Rvb2x0aXA6X3Rvb2x0aXAsIGJydXNoOl9icnVzaCwgc2VsZWN0ZWQ6X3NlbGVjdGlvbiwgb3ZlcmxheTphcmVhLCBjb250YWluZXI6Y29udGFpbmVyLCBjaGFydDpjaGFydH1cbiAgcmV0dXJuIGJlaGF2aW9yIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnY2hhcnQnLCAoJGxvZywgc2NhbGVMaXN0LCBjb250YWluZXIsIGJlaGF2aW9yLCBkM0FuaW1hdGlvbikgLT5cblxuICBjaGFydENudHIgPSAwXG5cbiAgY2hhcnQgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJjaGFydCN7Y2hhcnRDbnRyKyt9XCJcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0gVmFyaWFibGUgZGVjbGFyYXRpb25zIGFuZCBkZWZhdWx0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfbGF5b3V0cyA9IFtdICAgICAgICAgICAgICAgIyBMaXN0IG9mIGxheW91dHMgZm9yIHRoZSBjaGFydFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWQgICAgIyB0aGUgY2hhcnRzIGRyYXdpbmcgY29udGFpbmVyIG9iamVjdFxuICAgIF9hbGxTY2FsZXMgPSB1bmRlZmluZWQgICAgIyBIb2xkcyBhbGwgc2NhbGVzIG9mIHRoZSBjaGFydCwgcmVnYXJkbGVzcyBvZiBzY2FsZSBvd25lclxuICAgIF9vd25lZFNjYWxlcyA9IHVuZGVmaW5lZCAgIyBob2xkcyB0aGUgc2NsZXMgb3duZWQgYnkgY2hhcnQsIGkuZS4gc2hhcmUgc2NhbGVzXG4gICAgX2RhdGEgPSB1bmRlZmluZWQgICAgICAgICAgICMgcG9pbnRlciB0byB0aGUgbGFzdCBkYXRhIHNldCBib3VuZCB0byBjaGFydFxuICAgIF9zaG93VG9vbHRpcCA9IGZhbHNlICAgICAgICAjIHRvb2x0aXAgcHJvcGVydHlcbiAgICBfdG9vbFRpcFRlbXBsYXRlID0gJydcbiAgICBfdGl0bGUgPSB1bmRlZmluZWRcbiAgICBfc3ViVGl0bGUgPSB1bmRlZmluZWRcbiAgICBfYmVoYXZpb3IgPSBiZWhhdmlvcigpXG4gICAgX2FuaW1hdGlvbkR1cmF0aW9uID0gZDNBbmltYXRpb24uZHVyYXRpb25cblxuICAgICMtLS0gTGlmZUN5Y2xlIERpc3BhdGNoZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfbGlmZUN5Y2xlID0gZDMuZGlzcGF0Y2goJ2NvbmZpZ3VyZScsICdyZXNpemUnLCAncHJlcGFyZURhdGEnLCAnc2NhbGVEb21haW5zJywgJ3NpemVDb250YWluZXInLCAnZHJhd0F4aXMnLCAnZHJhd0NoYXJ0JywgJ25ld0RhdGEnLCAndXBkYXRlJywgJ3VwZGF0ZUF0dHJzJywgJ3Njb3BlQXBwbHknIClcbiAgICBfYnJ1c2ggPSBkMy5kaXNwYXRjaCgnZHJhdycsICdjaGFuZ2UnKVxuXG4gICAgIy0tLSBHZXR0ZXIvU2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKGlkKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuc2hvd1Rvb2x0aXAgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93VG9vbHRpcFxuICAgICAgZWxzZVxuICAgICAgICBfc2hvd1Rvb2x0aXAgPSB0cnVlRmFsc2VcbiAgICAgICAgX2JlaGF2aW9yLnRvb2x0aXAuYWN0aXZlKF9zaG93VG9vbHRpcClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50b29sVGlwVGVtcGxhdGUgPSAocGF0aCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdG9vbFRpcFRlbXBsYXRlXG4gICAgICBlbHNlXG4gICAgICAgIF90b29sVGlwVGVtcGxhdGUgPSBwYXRoXG4gICAgICAgIF9iZWhhdmlvci50b29sdGlwLnRlbXBsYXRlKHBhdGgpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUudGl0bGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90aXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfdGl0bGUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zdWJUaXRsZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3N1YlRpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF9zdWJUaXRsZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFkZExheW91dCA9IChsYXlvdXQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheW91dHNcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheW91dHMucHVzaChsYXlvdXQpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkU2NhbGUgPSAoc2NhbGUsIGxheW91dCkgLT5cbiAgICAgIF9hbGxTY2FsZXMuYWRkKHNjYWxlKVxuICAgICAgaWYgbGF5b3V0XG4gICAgICAgIGxheW91dC5zY2FsZXMoKS5hZGQoc2NhbGUpXG4gICAgICBlbHNlXG4gICAgICAgIF9vd25lZFNjYWxlcy5hZGQoc2NhbGUpXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFuaW1hdGlvbkR1cmF0aW9uID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYW5pbWF0aW9uRHVyYXRpb25cbiAgICAgIGVsc2VcbiAgICAgICAgX2FuaW1hdGlvbkR1cmF0aW9uID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICAjLS0tIEdldHRlciBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUubGlmZUN5Y2xlID0gKHZhbCkgLT5cbiAgICAgIHJldHVybiBfbGlmZUN5Y2xlXG5cbiAgICBtZS5sYXlvdXRzID0gKCkgLT5cbiAgICAgIHJldHVybiBfbGF5b3V0c1xuXG4gICAgbWUuc2NhbGVzID0gKCkgLT5cbiAgICAgIHJldHVybiBfb3duZWRTY2FsZXNcblxuICAgIG1lLmFsbFNjYWxlcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2FsbFNjYWxlc1xuXG4gICAgbWUuaGFzU2NhbGUgPSAoc2NhbGUpIC0+XG4gICAgICByZXR1cm4gISFfYWxsU2NhbGVzLmhhcyhzY2FsZSlcblxuICAgIG1lLmNvbnRhaW5lciA9ICgpIC0+XG4gICAgICByZXR1cm4gX2NvbnRhaW5lclxuXG4gICAgbWUuYnJ1c2ggPSAoKSAtPlxuICAgICAgcmV0dXJuIF9icnVzaFxuXG4gICAgbWUuZ2V0RGF0YSA9ICgpIC0+XG4gICAgICByZXR1cm4gX2RhdGFcblxuICAgIG1lLmJlaGF2aW9yID0gKCkgLT5cbiAgICAgIHJldHVybiBfYmVoYXZpb3JcblxuICAgICMtLS0gQ2hhcnQgZHJhd2luZyBsaWZlIGN5Y2xlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBsaWZlY3ljbGVGdWxsID0gKGRhdGEsbm9BbmltYXRpb24pIC0+XG4gICAgICBpZiBkYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgZnVsbCBsaWZlIGN5Y2xlJ1xuICAgICAgICBfZGF0YSA9IGRhdGFcbiAgICAgICAgX2xpZmVDeWNsZS5wcmVwYXJlRGF0YShkYXRhLCBub0FuaW1hdGlvbikgICAgIyBjYWxscyB0aGUgcmVnaXN0ZXJlZCBsYXlvdXQgdHlwZXNcbiAgICAgICAgX2xpZmVDeWNsZS5zY2FsZURvbWFpbnMoZGF0YSwgbm9BbmltYXRpb24pICAgIyBjYWxscyByZWdpc3RlcmVkIHRoZSBzY2FsZXNcbiAgICAgICAgX2xpZmVDeWNsZS5zaXplQ29udGFpbmVyKGRhdGEsIG5vQW5pbWF0aW9uKSAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyhub0FuaW1hdGlvbikgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoZGF0YSwgbm9BbmltYXRpb24pICAgICAjIGNhbGxzIGxheW91dFxuICAgICAgICBfbGlmZUN5Y2xlLnNjb3BlQXBwbHkoKSAgICAgICAgICAgICAgICAgICAgICMgbmVlZCBhIGRpZ2VzdCBjeWNsZSBhZnRlciB0aGUgZGVib3VjZSB0byBlbnN1cmUgbGVnZW5kIGFuaW1hdGlvbnMgZXhlY3V0ZVxuXG4gICAgZGVib3VuY2VkID0gXy5kZWJvdW5jZShsaWZlY3ljbGVGdWxsLCAxMDApXG5cbiAgICBtZS5leGVjTGlmZUN5Y2xlRnVsbCA9IGRlYm91bmNlZFxuXG4gICAgbWUucmVzaXplTGlmZUN5Y2xlID0gKG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgX2RhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyByZXNpemUgbGlmZSBjeWNsZSdcbiAgICAgICAgX2xpZmVDeWNsZS5zaXplQ29udGFpbmVyKF9kYXRhLCBub0FuaW1hdGlvbikgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChfZGF0YSwgbm9BbmltYXRpb24pXG4gICAgICAgIF9saWZlQ3ljbGUuc2NvcGVBcHBseSgpXG5cbiAgICBtZS5uZXdEYXRhTGlmZUN5Y2xlID0gKGRhdGEsIG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIG5ldyBkYXRhIGxpZmUgY3ljbGUnXG4gICAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgICBfbGlmZUN5Y2xlLnByZXBhcmVEYXRhKGRhdGEsIG5vQW5pbWF0aW9uKSAgICAjIGNhbGxzIHRoZSByZWdpc3RlcmVkIGxheW91dCB0eXBlc1xuICAgICAgICBfbGlmZUN5Y2xlLnNjYWxlRG9tYWlucyhkYXRhLCBub0FuaW1hdGlvbilcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyhub0FuaW1hdGlvbikgICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KGRhdGEsIG5vQW5pbWF0aW9uKVxuXG4gICAgbWUuYXR0cmlidXRlQ2hhbmdlID0gKG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgX2RhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyBhdHRyaWJ1dGUgY2hhbmdlIGxpZmUgY3ljbGUnXG4gICAgICAgIF9saWZlQ3ljbGUuc2l6ZUNvbnRhaW5lcihfZGF0YSwgbm9BbmltYXRpb24pXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChfZGF0YSwgbm9BbmltYXRpb24pXG5cbiAgICBtZS5icnVzaEV4dGVudENoYW5nZWQgPSAoKSAtPlxuICAgICAgaWYgX2RhdGFcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyh0cnVlKSAgICAgICAgICAgICAgIyBObyBBbmltYXRpb25cbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoX2RhdGEsIHRydWUpXG5cbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAnbmV3RGF0YS5jaGFydCcsIG1lLmV4ZWNMaWZlQ3ljbGVGdWxsXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ3Jlc2l6ZS5jaGFydCcsIG1lLnJlc2l6ZUxpZmVDeWNsZVxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICd1cGRhdGUuY2hhcnQnLCAobm9BbmltYXRpb24pIC0+IG1lLmV4ZWNMaWZlQ3ljbGVGdWxsKF9kYXRhLCBub0FuaW1hdGlvbilcbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAndXBkYXRlQXR0cnMnLCBtZS5hdHRyaWJ1dGVDaGFuZ2VcblxuICAgICMtLS0gSW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfYmVoYXZpb3IuY2hhcnQobWUpXG4gICAgX2NvbnRhaW5lciA9IGNvbnRhaW5lcigpLmNoYXJ0KG1lKSAgICMgdGhlIGNoYXJ0cyBkcmF3aW5nIGNvbnRhaW5lciBvYmplY3RcbiAgICBfYWxsU2NhbGVzID0gc2NhbGVMaXN0KCkgICAgIyBIb2xkcyBhbGwgc2NhbGVzIG9mIHRoZSBjaGFydCwgcmVnYXJkbGVzcyBvZiBzY2FsZSBvd25lclxuICAgIF9vd25lZFNjYWxlcyA9IHNjYWxlTGlzdCgpICAjIGhvbGRzIHRoZSBzY2xlcyBvd25lZCBieSBjaGFydCwgaS5lLiBzaGFyZSBzY2FsZXNcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBjaGFydCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2NvbnRhaW5lcicsICgkbG9nLCAkd2luZG93LCBkM0NoYXJ0TWFyZ2lucywgc2NhbGVMaXN0LCBheGlzQ29uZmlnLCBkM0FuaW1hdGlvbiwgYmVoYXZpb3IpIC0+XG5cbiAgY29udGFpbmVyQ250ID0gMFxuXG4gIGNvbnRhaW5lciA9ICgpIC0+XG5cbiAgICBtZSA9ICgpLT5cblxuICAgICMtLS0gVmFyaWFibGUgZGVjbGFyYXRpb25zIGFuZCBkZWZhdWx0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfY29udGFpbmVySWQgPSAnY250bnInICsgY29udGFpbmVyQ250KytcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfZWxlbWVudCA9IHVuZGVmaW5lZFxuICAgIF9lbGVtZW50U2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2xheW91dHMgPSBbXVxuICAgIF9sZWdlbmRzID0gW11cbiAgICBfc3ZnID0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9zcGFjZWRDb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfY2hhcnRBcmVhID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0QXJlYSA9IHVuZGVmaW5lZFxuICAgIF9tYXJnaW4gPSBhbmd1bGFyLmNvcHkoZDNDaGFydE1hcmdpbnMuZGVmYXVsdClcbiAgICBfaW5uZXJXaWR0aCA9IDBcbiAgICBfaW5uZXJIZWlnaHQgPSAwXG4gICAgX3RpdGxlSGVpZ2h0ID0gMFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX292ZXJsYXkgPSB1bmRlZmluZWRcbiAgICBfYmVoYXZpb3IgPSB1bmRlZmluZWRcbiAgICBfZHVyYXRpb24gPSAwXG5cbiAgICAjLS0tIEdldHRlci9TZXR0ZXIgRnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuaWQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9jb250YWluZXJJZFxuXG4gICAgbWUuY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IGNoYXJ0XG4gICAgICAgICMgcmVnaXN0ZXIgdG8gbGlmZWN5Y2xlIGV2ZW50c1xuICAgICAgICAjX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwic2l6ZUNvbnRhaW5lci4je21lLmlkKCl9XCIsIG1lLnNpemVDb250YWluZXJcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwiZHJhd0F4aXMuI3ttZS5pZCgpfVwiLCBtZS5kcmF3Q2hhcnRGcmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmVsZW1lbnQgPSAoZWxlbSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZWxlbWVudFxuICAgICAgZWxzZVxuICAgICAgICBfcmVzaXplSGFuZGxlciA9ICgpIC0+ICBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnJlc2l6ZSh0cnVlKSAjIG5vIGFuaW1hdGlvblxuICAgICAgICBfZWxlbWVudCA9IGVsZW1cbiAgICAgICAgX2VsZW1lbnRTZWxlY3Rpb24gPSBkMy5zZWxlY3QoX2VsZW1lbnQpXG4gICAgICAgIGlmIF9lbGVtZW50U2VsZWN0aW9uLmVtcHR5KClcbiAgICAgICAgICAkbG9nLmVycm9yIFwiRXJyb3I6IEVsZW1lbnQgI3tfZWxlbWVudH0gZG9lcyBub3QgZXhpc3RcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2dlbkNoYXJ0RnJhbWUoKVxuICAgICAgICAgICMgZmluZCB0aGUgZGl2IGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBoYW5kbGVyIHRvXG4gICAgICAgICAgcmVzaXplVGFyZ2V0ID0gX2VsZW1lbnRTZWxlY3Rpb24uc2VsZWN0KCcud2stY2hhcnQnKS5ub2RlKClcbiAgICAgICAgICBuZXcgUmVzaXplU2Vuc29yKHJlc2l6ZVRhcmdldCwgX3Jlc2l6ZUhhbmRsZXIpXG5cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRMYXlvdXQgPSAobGF5b3V0KSAtPlxuICAgICAgX2xheW91dHMucHVzaChsYXlvdXQpXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmhlaWdodCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2lubmVySGVpZ2h0XG5cbiAgICBtZS53aWR0aCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2lubmVyV2lkdGhcblxuICAgIG1lLm1hcmdpbnMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9tYXJnaW5cblxuICAgIG1lLmdldENoYXJ0QXJlYSA9ICgpIC0+XG4gICAgICByZXR1cm4gX2NoYXJ0QXJlYVxuXG4gICAgbWUuZ2V0T3ZlcmxheSA9ICgpIC0+XG4gICAgICByZXR1cm4gX292ZXJsYXlcblxuICAgIG1lLmdldENvbnRhaW5lciA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NwYWNlZENvbnRhaW5lclxuXG4gICAgIy0tLSB1dGlsaXR5IGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBSZXR1cm46IHRleHQgaGVpZ2h0XG4gICAgZHJhd0FuZFBvc2l0aW9uVGV4dCA9IChjb250YWluZXIsIHRleHQsIHNlbGVjdG9yLCBmb250U2l6ZSwgb2Zmc2V0KSAtPlxuICAgICAgZWxlbSA9IGNvbnRhaW5lci5zZWxlY3QoJy4nICsgc2VsZWN0b3IpXG4gICAgICBpZiBlbGVtLmVtcHR5KClcbiAgICAgICAgZWxlbSA9IGNvbnRhaW5lci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKHtjbGFzczpzZWxlY3RvciwgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsIHk6aWYgb2Zmc2V0IHRoZW4gb2Zmc2V0IGVsc2UgMH0pXG4gICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLGZvbnRTaXplKVxuICAgICAgZWxlbS50ZXh0KHRleHQpXG4gICAgICAjbWVhc3VyZSBzaXplIGFuZCByZXR1cm4gaXRcbiAgICAgIHJldHVybiBlbGVtLm5vZGUoKS5nZXRCQm94KCkuaGVpZ2h0XG5cblxuICAgIGRyYXdUaXRsZUFyZWEgPSAodGl0bGUsIHN1YlRpdGxlKSAtPlxuICAgICAgdGl0bGVBcmVhSGVpZ2h0ID0gMFxuICAgICAgYXJlYSA9IF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtdGl0bGUtYXJlYScpXG4gICAgICBpZiBhcmVhLmVtcHR5KClcbiAgICAgICAgYXJlYSA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC10aXRsZS1hcmVhIHdrLWNlbnRlci1ob3InKVxuICAgICAgaWYgdGl0bGVcbiAgICAgICAgX3RpdGxlSGVpZ2h0ID0gZHJhd0FuZFBvc2l0aW9uVGV4dChhcmVhLCB0aXRsZSwgJ3drLWNoYXJ0LXRpdGxlJywgJzJlbScpXG4gICAgICBpZiBzdWJUaXRsZVxuICAgICAgICBkcmF3QW5kUG9zaXRpb25UZXh0KGFyZWEsIHN1YlRpdGxlLCAnd2stY2hhcnQtc3VidGl0bGUnLCAnMS44ZW0nLCBfdGl0bGVIZWlnaHQpXG5cbiAgICAgIHJldHVybiBhcmVhLm5vZGUoKS5nZXRCQm94KCkuaGVpZ2h0XG5cbiAgICBnZXRBeGlzUmVjdCA9IChkaW0pIC0+XG4gICAgICBheGlzID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgZGltLnNjYWxlKCkucmFuZ2UoWzAsMTAwXSlcbiAgICAgIGF4aXMuY2FsbChkaW0uYXhpcygpKVxuXG5cblxuICAgICAgaWYgZGltLnJvdGF0ZVRpY2tMYWJlbHMoKVxuICAgICAgICBheGlzLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgLmF0dHIoe2R5OictMC43MWVtJywgeDotOX0pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLFwidHJhbnNsYXRlKDAsOSkgcm90YXRlKCN7ZGltLnJvdGF0ZVRpY2tMYWJlbHMoKX0pXCIpXG4gICAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCBpZiBkaW0uYXhpc09yaWVudCgpIGlzICdib3R0b20nIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnKVxuXG4gICAgICBib3ggPSBheGlzLm5vZGUoKS5nZXRCQm94KClcbiAgICAgIGF4aXMucmVtb3ZlKClcbiAgICAgIHJldHVybiBib3hcblxuICAgIGRyYXdBeGlzID0gKGRpbSkgLT5cbiAgICAgIGF4aXMgPSBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7ZGltLmF4aXNPcmllbnQoKX1cIilcbiAgICAgIGlmIGF4aXMuZW1wdHkoKVxuICAgICAgICBheGlzID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1heGlzIHdrLWNoYXJ0LScgKyBkaW0uYXhpc09yaWVudCgpKVxuXG4gICAgICBheGlzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihfZHVyYXRpb24pLmNhbGwoZGltLmF4aXMoKSlcblxuICAgICAgaWYgZGltLnJvdGF0ZVRpY2tMYWJlbHMoKVxuICAgICAgICBheGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC0je2RpbS5heGlzT3JpZW50KCl9LndrLWNoYXJ0LWF4aXMgdGV4dFwiKVxuICAgICAgICAgIC5hdHRyKHtkeTonLTAuNzFlbScsIHg6LTl9KVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLFwidHJhbnNsYXRlKDAsOSkgcm90YXRlKCN7ZGltLnJvdGF0ZVRpY2tMYWJlbHMoKX0pXCIpXG4gICAgICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsIGlmIGRpbS5heGlzT3JpZW50KCkgaXMgJ2JvdHRvbScgdGhlbiAnZW5kJyBlbHNlICdzdGFydCcpXG4gICAgICBlbHNlXG4gICAgICAgIGF4aXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LSN7ZGltLmF4aXNPcmllbnQoKX0ud2stY2hhcnQtYXhpcyB0ZXh0XCIpLmF0dHIoJ3RyYW5zZm9ybScsIG51bGwpXG5cbiAgICBfcmVtb3ZlQXhpcyA9IChvcmllbnQpIC0+XG4gICAgICBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7b3JpZW50fVwiKS5yZW1vdmUoKVxuXG4gICAgX3JlbW92ZUxhYmVsID0gKG9yaWVudCkgLT5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LSN7b3JpZW50fVwiKS5yZW1vdmUoKVxuXG4gICAgZHJhd0dyaWQgPSAocywgbm9BbmltYXRpb24pIC0+XG4gICAgICBkdXJhdGlvbiA9IGlmIG5vQW5pbWF0aW9uIHRoZW4gMCBlbHNlIF9kdXJhdGlvblxuICAgICAga2luZCA9IHMua2luZCgpXG4gICAgICB0aWNrcyA9IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBzLnNjYWxlKCkucmFuZ2UoKSBlbHNlIHMuc2NhbGUoKS50aWNrcygpXG4gICAgICBvZmZzZXQgPSBpZiBzLmlzT3JkaW5hbCgpIHRoZW4gcy5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcbiAgICAgIGdyaWRMaW5lcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWdyaWQud2stY2hhcnQtI3traW5kfVwiKS5kYXRhKHRpY2tzLCAoZCkgLT4gZClcbiAgICAgIGdyaWRMaW5lcy5lbnRlcigpLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1ncmlkIHdrLWNoYXJ0LSN7a2luZH1cIilcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuICAgICAgaWYga2luZCBpcyAneSdcbiAgICAgICAgZ3JpZExpbmVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICB4MTowLFxuICAgICAgICAgICAgeDI6IF9pbm5lcldpZHRoLFxuICAgICAgICAgICAgeTE6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkICsgb2Zmc2V0IGVsc2Ugcy5zY2FsZSgpKGQpLFxuICAgICAgICAgICAgeTI6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkICsgb2Zmc2V0IGVsc2Ugcy5zY2FsZSgpKGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICBlbHNlXG4gICAgICAgIGdyaWRMaW5lcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgeTE6MCxcbiAgICAgICAgICAgIHkyOiBfaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICB4MTooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgKyBvZmZzZXQgZWxzZSBzLnNjYWxlKCkoZCksXG4gICAgICAgICAgICB4MjooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgKyBvZmZzZXQgZWxzZSBzLnNjYWxlKCkoZClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgIGdyaWRMaW5lcy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICMtLS0gQnVpbGQgdGhlIGNvbnRhaW5lciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBidWlsZCBnZW5lcmljIGVsZW1lbnRzIGZpcnN0XG5cbiAgICBfZ2VuQ2hhcnRGcmFtZSA9ICgpIC0+XG4gICAgICBfc3ZnID0gX2VsZW1lbnRTZWxlY3Rpb24uYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydCcpLmFwcGVuZCgnc3ZnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQnKVxuICAgICAgX3N2Zy5hcHBlbmQoJ2RlZnMnKS5hcHBlbmQoJ2NsaXBQYXRoJykuYXR0cignaWQnLCBcIndrLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9XCIpLmFwcGVuZCgncmVjdCcpXG4gICAgICBfY29udGFpbmVyPSBfc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtY29udGFpbmVyJylcbiAgICAgIF9vdmVybGF5ID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ2FsbCcpXG4gICAgICBfb3ZlcmxheS5hcHBlbmQoJ3JlY3QnKS5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYWNrZ3JvdW5kJykuZGF0dW0oe25hbWU6J2JhY2tncm91bmQnfSlcbiAgICAgIF9jaGFydEFyZWEgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuXG4gICAgIyBzdGFydCB0byBidWlsZCBhbmQgc2l6ZSB0aGUgZWxlbWVudHMgZnJvbSB0b3AgdG8gYm90dG9tXG5cbiAgICAjLS0tIGNoYXJ0IGZyYW1lICh0aXRsZSwgYXhpcywgZ3JpZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd0NoYXJ0RnJhbWUgPSAobm90QW5pbWF0ZWQpIC0+XG4gICAgICBib3VuZHMgPSBfZWxlbWVudFNlbGVjdGlvbi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIF9kdXJhdGlvbiA9IGlmIG5vdEFuaW1hdGVkIHRoZW4gMCBlbHNlIG1lLmNoYXJ0KCkuYW5pbWF0aW9uRHVyYXRpb24oKVxuICAgICAgX2hlaWdodCA9IGJvdW5kcy5oZWlnaHRcbiAgICAgIF93aWR0aCA9IGJvdW5kcy53aWR0aFxuICAgICAgdGl0bGVBcmVhSGVpZ2h0ID0gZHJhd1RpdGxlQXJlYShfY2hhcnQudGl0bGUoKSwgX2NoYXJ0LnN1YlRpdGxlKCkpXG5cbiAgICAgICMtLS0gZ2V0IHNpemluZyBvZiBmcmFtZSBjb21wb25lbnRzIGJlZm9yZSBwb3NpdGlvbmluZyB0aGVtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXhpc1JlY3QgPSB7dG9wOntoZWlnaHQ6MCwgd2lkdGg6MH0sYm90dG9tOntoZWlnaHQ6MCwgd2lkdGg6MH0sbGVmdDp7aGVpZ2h0OjAsIHdpZHRoOjB9LHJpZ2h0OntoZWlnaHQ6MCwgd2lkdGg6MH19XG4gICAgICBsYWJlbEhlaWdodCA9IHt0b3A6MCAsYm90dG9tOjAsIGxlZnQ6MCwgcmlnaHQ6MH1cblxuICAgICAgZm9yIGwgaW4gX2xheW91dHNcbiAgICAgICAgZm9yIGssIHMgb2YgbC5zY2FsZXMoKS5hbGxLaW5kcygpXG4gICAgICAgICAgaWYgcy5zaG93QXhpcygpXG4gICAgICAgICAgICBzLmF4aXMoKS5zY2FsZShzLnNjYWxlKCkpLm9yaWVudChzLmF4aXNPcmllbnQoKSkgICMgZW5zdXJlIHRoZSBheGlzIHdvcmtzIG9uIHRoZSByaWdodCBzY2FsZVxuICAgICAgICAgICAgYXhpc1JlY3Rbcy5heGlzT3JpZW50KCldID0gZ2V0QXhpc1JlY3QocylcbiAgICAgICAgICAgICMtLS0gZHJhdyBsYWJlbCAtLS1cbiAgICAgICAgICAgIGxhYmVsID0gX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtbGFiZWwud2stY2hhcnQtI3tzLmF4aXNPcmllbnQoKX1cIilcbiAgICAgICAgICAgIGlmIHMuc2hvd0xhYmVsKClcbiAgICAgICAgICAgICAgaWYgbGFiZWwuZW1wdHkoKVxuICAgICAgICAgICAgICAgIGxhYmVsID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYWJlbCB3ay1jaGFydC0nICArIHMuYXhpc09yaWVudCgpKVxuICAgICAgICAgICAgICBsYWJlbEhlaWdodFtzLmF4aXNPcmllbnQoKV0gPSBkcmF3QW5kUG9zaXRpb25UZXh0KGxhYmVsLCBzLmF4aXNMYWJlbCgpLCAnd2stY2hhcnQtbGFiZWwtdGV4dCcsICcxLjVlbScpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsYWJlbC5yZW1vdmUoKVxuICAgICAgICAgIGlmIHMuYXhpc09yaWVudE9sZCgpIGFuZCBzLmF4aXNPcmllbnRPbGQoKSBpc250IHMuYXhpc09yaWVudCgpXG4gICAgICAgICAgICBfcmVtb3ZlQXhpcyhzLmF4aXNPcmllbnRPbGQoKSlcbiAgICAgICAgICAgIF9yZW1vdmVMYWJlbChzLmF4aXNPcmllbnRPbGQoKSlcblxuXG5cbiAgICAgICMtLS0gY29tcHV0ZSBzaXplIG9mIHRoZSBkcmF3aW5nIGFyZWEgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2ZyYW1lSGVpZ2h0ID0gdGl0bGVBcmVhSGVpZ2h0ICsgYXhpc1JlY3QudG9wLmhlaWdodCArIGxhYmVsSGVpZ2h0LnRvcCArIGF4aXNSZWN0LmJvdHRvbS5oZWlnaHQgKyBsYWJlbEhlaWdodC5ib3R0b20gKyBfbWFyZ2luLnRvcCArIF9tYXJnaW4uYm90dG9tXG4gICAgICBfZnJhbWVXaWR0aCA9IGF4aXNSZWN0LnJpZ2h0LndpZHRoICsgbGFiZWxIZWlnaHQucmlnaHQgKyBheGlzUmVjdC5sZWZ0LndpZHRoICsgbGFiZWxIZWlnaHQubGVmdCArIF9tYXJnaW4ubGVmdCArIF9tYXJnaW4ucmlnaHRcblxuICAgICAgaWYgX2ZyYW1lSGVpZ2h0IDwgX2hlaWdodFxuICAgICAgICBfaW5uZXJIZWlnaHQgPSBfaGVpZ2h0IC0gX2ZyYW1lSGVpZ2h0XG4gICAgICBlbHNlXG4gICAgICAgIF9pbm5lckhlaWdodCA9IDBcblxuICAgICAgaWYgX2ZyYW1lV2lkdGggPCBfd2lkdGhcbiAgICAgICAgX2lubmVyV2lkdGggPSBfd2lkdGggLSBfZnJhbWVXaWR0aFxuICAgICAgZWxzZVxuICAgICAgICBfaW5uZXJXaWR0aCA9IDBcblxuICAgICAgIy0tLSByZXNldCBzY2FsZSByYW5nZXMgYW5kIHJlZHJhdyBheGlzIHdpdGggYWRqdXN0ZWQgcmFuZ2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIGsgaXMgJ3gnIG9yIGsgaXMgJ3JhbmdlWCdcbiAgICAgICAgICAgIGlmIGwuc2hvd0RhdGFMYWJlbHMoKSBpcyAneCdcbiAgICAgICAgICAgICAgcy5yYW5nZShbMCwgX2lubmVyV2lkdGggLSA1MF0pICNUT0RPIGNvbXB1dGUgc3BhY2UgcmVxdWlyZW1lbnQgZnJvbSBmb250IHNpemVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcy5yYW5nZShbMCwgX2lubmVyV2lkdGhdKVxuICAgICAgICAgIGVsc2UgaWYgayBpcyAneScgb3IgayBpcyAncmFuZ2VZJ1xuICAgICAgICAgICAgaWYgbC5zaG93RGF0YUxhYmVscygpIGlzICd5J1xuICAgICAgICAgICAgICBzLnJhbmdlKFtfaW5uZXJIZWlnaHQsIDIwXSkgI1RPRE8gY29tcHV0ZSBzcGFjZSByZXF1aXJlbWVudCBmcm9tIGZvbnQgc2l6ZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBzLnJhbmdlKFtfaW5uZXJIZWlnaHQsIDBdKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKVxuICAgICAgICAgICAgZHJhd0F4aXMocylcblxuICAgICAgIy0tLSBwb3NpdGlvbiBmcmFtZSBlbGVtZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxlZnRNYXJnaW4gPSBheGlzUmVjdC5sZWZ0LndpZHRoICsgbGFiZWxIZWlnaHQubGVmdCArIF9tYXJnaW4ubGVmdFxuICAgICAgdG9wTWFyZ2luID0gdGl0bGVBcmVhSGVpZ2h0ICsgYXhpc1JlY3QudG9wLmhlaWdodCAgKyBsYWJlbEhlaWdodC50b3AgKyBfbWFyZ2luLnRvcFxuXG4gICAgICBfc3BhY2VkQ29udGFpbmVyID0gX2NvbnRhaW5lci5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnRNYXJnaW59LCAje3RvcE1hcmdpbn0pXCIpXG4gICAgICBfc3ZnLnNlbGVjdChcIiN3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfSByZWN0XCIpLmF0dHIoJ3dpZHRoJywgX2lubmVyV2lkdGgpLmF0dHIoJ2hlaWdodCcsIF9pbm5lckhlaWdodClcbiAgICAgIF9zcGFjZWRDb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtb3ZlcmxheT4ud2stY2hhcnQtYmFja2dyb3VuZCcpLmF0dHIoJ3dpZHRoJywgX2lubmVyV2lkdGgpLmF0dHIoJ2hlaWdodCcsIF9pbm5lckhlaWdodClcbiAgICAgIF9zcGFjZWRDb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtYXJlYScpLnN0eWxlKCdjbGlwLXBhdGgnLCBcInVybCgjd2stY2hhcnQtY2xpcC0je19jb250YWluZXJJZH0pXCIpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LW92ZXJsYXknKS5zdHlsZSgnY2xpcC1wYXRoJywgXCJ1cmwoI3drLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9KVwiKVxuXG4gICAgICBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtcmlnaHQnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19pbm5lcldpZHRofSwgMClcIilcbiAgICAgIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy53ay1jaGFydC1ib3R0b20nKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCAje19pbm5lckhlaWdodH0pXCIpXG5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtbGFiZWwud2stY2hhcnQtbGVmdCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7LWF4aXNSZWN0LmxlZnQud2lkdGgtbGFiZWxIZWlnaHQubGVmdCAvIDIgfSwgI3tfaW5uZXJIZWlnaHQvMn0pIHJvdGF0ZSgtOTApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LXJpZ2h0JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aCtheGlzUmVjdC5yaWdodC53aWR0aCArIGxhYmVsSGVpZ2h0LnJpZ2h0IC8gMn0sICN7X2lubmVySGVpZ2h0LzJ9KSByb3RhdGUoOTApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LXRvcCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGggLyAyfSwgI3stYXhpc1JlY3QudG9wLmhlaWdodCAtIGxhYmVsSGVpZ2h0LnRvcCAvIDIgfSlcIilcbiAgICAgIF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtbGFiZWwud2stY2hhcnQtYm90dG9tJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aCAvIDJ9LCAje19pbm5lckhlaWdodCArIGF4aXNSZWN0LmJvdHRvbS5oZWlnaHQgKyBsYWJlbEhlaWdodC5ib3R0b20gfSlcIilcblxuICAgICAgX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC10aXRsZS1hcmVhJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aC8yfSwgI3stdG9wTWFyZ2luICsgX3RpdGxlSGVpZ2h0fSlcIilcblxuICAgICAgIy0tLSBmaW5hbGx5LCBkcmF3IGdyaWQgbGluZXNcblxuICAgICAgZm9yIGwgaW4gX2xheW91dHNcbiAgICAgICAgZm9yIGssIHMgb2YgbC5zY2FsZXMoKS5hbGxLaW5kcygpXG4gICAgICAgICAgaWYgcy5zaG93QXhpcygpIGFuZCBzLnNob3dHcmlkKClcbiAgICAgICAgICAgIGRyYXdHcmlkKHMpXG5cbiAgICAgIF9jaGFydC5iZWhhdmlvcigpLm92ZXJsYXkoX292ZXJsYXkpXG4gICAgICBfY2hhcnQuYmVoYXZpb3IoKS5jb250YWluZXIoX2NoYXJ0QXJlYSlcblxuICAgICMtLS0gQnJ1c2ggQWNjZWxlcmF0b3IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5kcmF3U2luZ2xlQXhpcyA9IChzY2FsZSkgLT5cbiAgICAgIGlmIHNjYWxlLnNob3dBeGlzKClcbiAgICAgICAgYSA9IF9zcGFjZWRDb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtI3tzY2FsZS5heGlzKCkub3JpZW50KCl9XCIpXG4gICAgICAgIGEuY2FsbChzY2FsZS5heGlzKCkpXG5cbiAgICAgICAgaWYgc2NhbGUuc2hvd0dyaWQoKVxuICAgICAgICAgIGRyYXdHcmlkKHNjYWxlLCB0cnVlKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gY29udGFpbmVyIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnbGF5b3V0JywgKCRsb2csIHNjYWxlLCBzY2FsZUxpc3QsIHRpbWluZykgLT5cblxuICBsYXlvdXRDbnRyID0gMFxuXG4gIGxheW91dCA9ICgpIC0+XG4gICAgX2lkID0gXCJsYXlvdXQje2xheW91dENudHIrK31cIlxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9zY2FsZUxpc3QgPSBzY2FsZUxpc3QoKVxuICAgIF9zaG93TGFiZWxzID0gZmFsc2VcbiAgICBfbGF5b3V0TGlmZUN5Y2xlID0gZDMuZGlzcGF0Y2goJ2NvbmZpZ3VyZScsICdkcmF3Q2hhcnQnLCAncHJlcGFyZURhdGEnLCAnYnJ1c2gnLCAncmVkcmF3JywgJ2RyYXdBeGlzJywgJ3VwZGF0ZScsICd1cGRhdGVBdHRycycsICdicnVzaERyYXcnKVxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgbWUuaWQgPSAoaWQpIC0+XG4gICAgICByZXR1cm4gX2lkXG5cbiAgICBtZS5jaGFydCA9IChjaGFydCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY2hhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgX2NoYXJ0ID0gY2hhcnRcbiAgICAgICAgX3NjYWxlTGlzdC5wYXJlbnRTY2FsZXMoY2hhcnQuc2NhbGVzKCkpXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcImNvbmZpZ3VyZS4je21lLmlkKCl9XCIsICgpIC0+IF9sYXlvdXRMaWZlQ3ljbGUuY29uZmlndXJlLmFwcGx5KG1lLnNjYWxlcygpKSAjcGFzc3Rocm91Z2hcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwiZHJhd0NoYXJ0LiN7bWUuaWQoKX1cIiwgbWUuZHJhdyAjIHJlZ2lzdGVyIGZvciB0aGUgZHJhd2luZyBldmVudFxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJwcmVwYXJlRGF0YS4je21lLmlkKCl9XCIsIG1lLnByZXBhcmVEYXRhXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc2NhbGVzID0gKCkgLT5cbiAgICAgIHJldHVybiBfc2NhbGVMaXN0XG5cbiAgICBtZS5zY2FsZVByb3BlcnRpZXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIG1lLnNjYWxlcygpLmdldFNjYWxlUHJvcGVydGllcygpXG5cbiAgICBtZS5jb250YWluZXIgPSAob2JqKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IG9ialxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNob3dEYXRhTGFiZWxzID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0xhYmVsc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0xhYmVscyA9IHRydWVGYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmJlaGF2aW9yID0gKCkgLT5cbiAgICAgIG1lLmNoYXJ0KCkuYmVoYXZpb3IoKVxuXG4gICAgbWUucHJlcGFyZURhdGEgPSAoZGF0YSkgLT5cbiAgICAgIGFyZ3MgPSBbXVxuICAgICAgZm9yIGtpbmQgaW4gWyd4JywneScsICdjb2xvcicsICdzaXplJywgJ3NoYXBlJywgJ3JhbmdlWCcsICdyYW5nZVknXVxuICAgICAgICBhcmdzLnB1c2goX3NjYWxlTGlzdC5nZXRLaW5kKGtpbmQpKVxuICAgICAgX2xheW91dExpZmVDeWNsZS5wcmVwYXJlRGF0YS5hcHBseShkYXRhLCBhcmdzKVxuXG4gICAgbWUubGlmZUN5Y2xlID0gKCktPlxuICAgICAgcmV0dXJuIF9sYXlvdXRMaWZlQ3ljbGVcblxuXG4gICAgIy0tLSBEUllvdXQgZnJvbSBkcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldERyYXdBcmVhID0gKCkgLT5cbiAgICAgIGNvbnRhaW5lciA9IF9jb250YWluZXIuZ2V0Q2hhcnRBcmVhKClcbiAgICAgIGRyYXdBcmVhID0gY29udGFpbmVyLnNlbGVjdChcIi4je21lLmlkKCl9XCIpXG4gICAgICBpZiBkcmF3QXJlYS5lbXB0eSgpXG4gICAgICAgIGRyYXdBcmVhID0gY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgKGQpIC0+IG1lLmlkKCkpXG4gICAgICByZXR1cm4gZHJhd0FyZWFcblxuICAgIGJ1aWxkQXJncyA9IChkYXRhLCBub3RBbmltYXRlZCkgLT5cbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGhlaWdodDpfY29udGFpbmVyLmhlaWdodCgpLFxuICAgICAgICB3aWR0aDpfY29udGFpbmVyLndpZHRoKCksXG4gICAgICAgIG1hcmdpbnM6X2NvbnRhaW5lci5tYXJnaW5zKCksXG4gICAgICAgIGR1cmF0aW9uOiBpZiBub3RBbmltYXRlZCB0aGVuIDAgZWxzZSBtZS5jaGFydCgpLmFuaW1hdGlvbkR1cmF0aW9uKClcbiAgICAgIH1cbiAgICAgIGFyZ3MgPSBbZGF0YSwgb3B0aW9uc11cbiAgICAgIGZvciBraW5kIGluIFsneCcsJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZScsICdyYW5nZVgnLCAncmFuZ2VZJ11cbiAgICAgICAgYXJncy5wdXNoKF9zY2FsZUxpc3QuZ2V0S2luZChraW5kKSlcbiAgICAgIHJldHVybiBhcmdzXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhdyA9IChkYXRhLCBub3RBbmltYXRlZCkgLT5cbiAgICAgIF9kYXRhID0gZGF0YVxuXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLmRyYXdDaGFydC5hcHBseShnZXREcmF3QXJlYSgpLCBidWlsZEFyZ3MoZGF0YSwgbm90QW5pbWF0ZWQpKVxuXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICdyZWRyYXcnLCBtZS5yZWRyYXdcbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ3VwZGF0ZScsIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkudXBkYXRlXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICdkcmF3QXhpcycsIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkuZHJhd0F4aXNcbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ3VwZGF0ZUF0dHJzJywgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS51cGRhdGVBdHRyc1xuXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICdicnVzaCcsIChheGlzLCBub3RBbmltYXRlZCwgaWR4UmFuZ2UpIC0+XG4gICAgICAgIF9jb250YWluZXIuZHJhd1NpbmdsZUF4aXMoYXhpcylcbiAgICAgICAgX2xheW91dExpZmVDeWNsZS5icnVzaERyYXcuYXBwbHkoZ2V0RHJhd0FyZWEoKSwgW2F4aXMsIGlkeFJhbmdlLCBfY29udGFpbmVyLndpZHRoKCksIF9jb250YWluZXIuaGVpZ2h0KCldKVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGxheW91dCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xlZ2VuZCcsICgkbG9nLCAkY29tcGlsZSwgJHJvb3RTY29wZSwgJHRlbXBsYXRlQ2FjaGUsIHRlbXBsYXRlRGlyKSAtPlxuXG4gIGxlZ2VuZENudCA9IDBcblxuICB1bmlxdWVWYWx1ZXMgPSAoYXJyKSAtPlxuICAgIHNldCA9IHt9XG4gICAgZm9yIGUgaW4gYXJyXG4gICAgICBzZXRbZV0gPSAwXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNldClcblxuICBsZWdlbmQgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJsZWdlbmQtI3tsZWdlbmRDbnQrK31cIlxuICAgIF9wb3NpdGlvbiA9ICd0b3AtcmlnaHQnXG4gICAgX3NjYWxlID0gdW5kZWZpbmVkXG4gICAgX3RlbXBsYXRlUGF0aCA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmRTY29wZSA9ICRyb290U2NvcGUuJG5ldyh0cnVlKVxuICAgIF90ZW1wbGF0ZSA9IHVuZGVmaW5lZFxuICAgIF9wYXJzZWRUZW1wbGF0ZSA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXJEaXYgPSB1bmRlZmluZWRcbiAgICBfbGVnZW5kRGl2ID0gdW5kZWZpbmVkXG4gICAgX3RpdGxlID0gdW5kZWZpbmVkXG4gICAgX2xheW91dCA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX29wdGlvbnMgPSB1bmRlZmluZWRcbiAgICBfc2hvdyA9IGZhbHNlXG4gICAgX3Nob3dWYWx1ZXMgPSBmYWxzZVxuXG4gICAgbWUgPSB7fVxuXG4gICAgbWUucG9zaXRpb24gPSAocG9zKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wb3NpdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfcG9zaXRpb24gPSBwb3NcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zaG93ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvdyA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuc2hvd1ZhbHVlcyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dWYWx1ZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dWYWx1ZXMgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmRpdiA9IChzZWxlY3Rpb24pIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xlZ2VuZERpdlxuICAgICAgZWxzZVxuICAgICAgICBfbGVnZW5kRGl2ID0gc2VsZWN0aW9uXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0XG4gICAgICBlbHNlXG4gICAgICAgIF9sYXlvdXQgPSBsYXlvdXRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3NjYWxlID0gc2NhbGVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50aXRsZSA9ICh0aXRsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpdGxlID0gdGl0bGVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50ZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90ZW1wbGF0ZVBhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX3RlbXBsYXRlUGF0aCA9IHBhdGhcbiAgICAgICAgX3RlbXBsYXRlID0gJHRlbXBsYXRlQ2FjaGUuZ2V0KF90ZW1wbGF0ZVBhdGgpXG4gICAgICAgIF9wYXJzZWRUZW1wbGF0ZSA9ICRjb21waWxlKF90ZW1wbGF0ZSkoX2xlZ2VuZFNjb3BlKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmRyYXcgPSAoZGF0YSwgb3B0aW9ucykgLT5cbiAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgX29wdGlvbnMgPSBvcHRpb25zXG4gICAgICAjJGxvZy5pbmZvICdkcmF3aW5nIExlZ2VuZCdcbiAgICAgIF9jb250YWluZXJEaXYgPSBfbGVnZW5kRGl2IG9yIGQzLnNlbGVjdChtZS5zY2FsZSgpLnBhcmVudCgpLmNvbnRhaW5lcigpLmVsZW1lbnQoKSkuc2VsZWN0KCcud2stY2hhcnQnKVxuICAgICAgaWYgbWUuc2hvdygpXG4gICAgICAgIGlmIF9jb250YWluZXJEaXYuc2VsZWN0KCcud2stY2hhcnQtbGVnZW5kJykuZW1wdHkoKVxuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChfY29udGFpbmVyRGl2Lm5vZGUoKSkuYXBwZW5kKF9wYXJzZWRUZW1wbGF0ZSlcblxuICAgICAgICBpZiBtZS5zaG93VmFsdWVzKClcbiAgICAgICAgICBsYXllcnMgPSB1bmlxdWVWYWx1ZXMoX3NjYWxlLnZhbHVlKGRhdGEpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzID0gX3NjYWxlLmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHMgPSBfc2NhbGUuc2NhbGUoKVxuICAgICAgICBpZiBtZS5sYXlvdXQoKT8uc2NhbGVzKCkubGF5ZXJTY2FsZSgpXG4gICAgICAgICAgcyA9IG1lLmxheW91dCgpLnNjYWxlcygpLmxheWVyU2NhbGUoKS5zY2FsZSgpXG4gICAgICAgIGlmIF9zY2FsZS5raW5kKCkgaXNudCAnc2hhcGUnXG4gICAgICAgICAgX2xlZ2VuZFNjb3BlLmxlZ2VuZFJvd3MgPSBsYXllcnMubWFwKChkKSAtPiB7dmFsdWU6ZCwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzpzKGQpfX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfbGVnZW5kU2NvcGUubGVnZW5kUm93cyA9IGxheWVycy5tYXAoKGQpIC0+IHt2YWx1ZTpkLCBwYXRoOmQzLnN2Zy5zeW1ib2woKS50eXBlKHMoZCkpLnNpemUoODApKCl9KVxuICAgICAgICAgICMkbG9nLmxvZyBfbGVnZW5kU2NvcGUubGVnZW5kUm93c1xuICAgICAgICBfbGVnZW5kU2NvcGUuc2hvd0xlZ2VuZCA9IHRydWVcbiAgICAgICAgX2xlZ2VuZFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICAgIHBvc2l0aW9uOiBpZiBfbGVnZW5kRGl2IHRoZW4gJ3JlbGF0aXZlJyBlbHNlICdhYnNvbHV0ZSdcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIG5vdCBfbGVnZW5kRGl2XG4gICAgICAgICAgY29udGFpbmVyUmVjdCA9IF9jb250YWluZXJEaXYubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgY2hhcnRBcmVhUmVjdCA9IF9jb250YWluZXJEaXYuc2VsZWN0KCcud2stY2hhcnQtb3ZlcmxheSByZWN0Jykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgZm9yIHAgaW4gX3Bvc2l0aW9uLnNwbGl0KCctJylcbiAgICAgICAgICAgICAgX2xlZ2VuZFNjb3BlLnBvc2l0aW9uW3BdID0gXCIje01hdGguYWJzKGNvbnRhaW5lclJlY3RbcF0gLSBjaGFydEFyZWFSZWN0W3BdKX1weFwiXG4gICAgICAgIF9sZWdlbmRTY29wZS50aXRsZSA9IF90aXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfcGFyc2VkVGVtcGxhdGUucmVtb3ZlKClcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucmVnaXN0ZXIgPSAobGF5b3V0KSAtPlxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uIFwiZHJhd0NoYXJ0LiN7X2lkfVwiLCBtZS5kcmF3XG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRlbXBsYXRlKHRlbXBsYXRlRGlyICsgJ2xlZ2VuZC5odG1sJylcblxuICAgIG1lLnJlZHJhdyA9ICgpIC0+XG4gICAgICBpZiBfZGF0YSBhbmQgX29wdGlvbnNcbiAgICAgICAgbWUuZHJhdyhfZGF0YSwgX29wdGlvbnMpXG4gICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBsZWdlbmQiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdzY2FsZScsICgkbG9nLCBsZWdlbmQsIGZvcm1hdERlZmF1bHRzLCB3a0NoYXJ0U2NhbGVzLCB3a0NoYXJ0TG9jYWxlKSAtPlxuXG4gIHNjYWxlID0gKCkgLT5cbiAgICBfaWQgPSAnJ1xuICAgIF9zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgX3NjYWxlVHlwZSA9ICdsaW5lYXInXG4gICAgX2V4cG9uZW50ID0gMVxuICAgIF9pc09yZGluYWwgPSBmYWxzZVxuICAgIF9kb21haW4gPSB1bmRlZmluZWRcbiAgICBfZG9tYWluQ2FsYyA9IHVuZGVmaW5lZFxuICAgIF9jYWxjdWxhdGVkRG9tYWluID0gdW5kZWZpbmVkXG4gICAgX3Jlc2V0T25OZXdEYXRhID0gZmFsc2VcbiAgICBfcHJvcGVydHkgPSAnJ1xuICAgIF9sYXllclByb3AgPSAnJ1xuICAgIF9sYXllckV4Y2x1ZGUgPSBbXVxuICAgIF9sb3dlclByb3BlcnR5ID0gJydcbiAgICBfdXBwZXJQcm9wZXJ0eSA9ICcnXG4gICAgX3JhbmdlID0gdW5kZWZpbmVkXG4gICAgX3JhbmdlUGFkZGluZyA9IDAuM1xuICAgIF9yYW5nZU91dGVyUGFkZGluZyA9IDAuM1xuICAgIF9pbnB1dEZvcm1hdFN0cmluZyA9IHVuZGVmaW5lZFxuICAgIF9pbnB1dEZvcm1hdEZuID0gKGRhdGEpIC0+IGlmIGlzTmFOKCtkYXRhKSBvciBfLmlzRGF0ZShkYXRhKSB0aGVuIGRhdGEgZWxzZSArZGF0YVxuXG4gICAgX3Nob3dBeGlzID0gZmFsc2VcbiAgICBfYXhpc09yaWVudCA9IHVuZGVmaW5lZFxuICAgIF9heGlzT3JpZW50T2xkID0gdW5kZWZpbmVkXG4gICAgX2F4aXMgPSB1bmRlZmluZWRcbiAgICBfdGlja3MgPSB1bmRlZmluZWRcbiAgICBfdGlja0Zvcm1hdCA9IHVuZGVmaW5lZFxuICAgIF90aWNrVmFsdWVzID0gdW5kZWZpbmVkXG4gICAgX3JvdGF0ZVRpY2tMYWJlbHMgPSB1bmRlZmluZWRcbiAgICBfc2hvd0xhYmVsID0gZmFsc2VcbiAgICBfYXhpc0xhYmVsID0gdW5kZWZpbmVkXG4gICAgX3Nob3dHcmlkID0gZmFsc2VcbiAgICBfaXNIb3Jpem9udGFsID0gZmFsc2VcbiAgICBfaXNWZXJ0aWNhbCA9IGZhbHNlXG4gICAgX2tpbmQgPSB1bmRlZmluZWRcbiAgICBfcGFyZW50ID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0ID0gdW5kZWZpbmVkXG4gICAgX2xheW91dCA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmQgPSBsZWdlbmQoKVxuICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSB1bmRlZmluZWRcbiAgICBfb3V0cHV0Rm9ybWF0Rm4gPSB1bmRlZmluZWRcblxuICAgIF90aWNrRm9ybWF0ID0gd2tDaGFydExvY2FsZS50aW1lRm9ybWF0Lm11bHRpKFtcbiAgICAgIFtcIi4lTFwiLCAoZCkgLT4gIGQuZ2V0TWlsbGlzZWNvbmRzKCldLFxuICAgICAgW1wiOiVTXCIsIChkKSAtPiAgZC5nZXRTZWNvbmRzKCldLFxuICAgICAgW1wiJUk6JU1cIiwgKGQpIC0+ICBkLmdldE1pbnV0ZXMoKV0sXG4gICAgICBbXCIlSSAlcFwiLCAoZCkgLT4gIGQuZ2V0SG91cnMoKV0sXG4gICAgICBbXCIlYSAlZFwiLCAoZCkgLT4gIGQuZ2V0RGF5KCkgYW5kIGQuZ2V0RGF0ZSgpIGlzbnQgMV0sXG4gICAgICBbXCIlYiAlZFwiLCAoZCkgLT4gIGQuZ2V0RGF0ZSgpIGlzbnQgMV0sXG4gICAgICBbXCIlQlwiLCAoZCkgLT4gIGQuZ2V0TW9udGgoKV0sXG4gICAgICBbXCIlWVwiLCAoKSAtPiAgdHJ1ZV1cbiAgICBdKVxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgIy0tLS0gdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAga2V5cyA9IChkYXRhKSAtPiBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBfLnJlamVjdChfLmtleXMoZGF0YVswXSksIChkKSAtPiBkIGlzICckJGhhc2hLZXknKSBlbHNlIF8ucmVqZWN0KF8ua2V5cyhkYXRhKSwgKGQpIC0+IGQgaXMgJyQkaGFzaEtleScpXG5cbiAgICBsYXllclRvdGFsID0gKGQsIGxheWVyS2V5cykgLT5cbiAgICAgIGxheWVyS2V5cy5yZWR1Y2UoXG4gICAgICAgIChwcmV2LCBuZXh0KSAtPiArcHJldiArICttZS5sYXllclZhbHVlKGQsbmV4dClcbiAgICAgICwgMClcblxuICAgIGxheWVyTWF4ID0gKGRhdGEsIGxheWVyS2V5cykgLT5cbiAgICAgIGQzLm1heChkYXRhLCAoZCkgLT4gZDMubWF4KGxheWVyS2V5cywgKGspIC0+IG1lLmxheWVyVmFsdWUoZCxrKSkpXG5cbiAgICBsYXllck1pbiA9IChkYXRhLCBsYXllcktleXMpIC0+XG4gICAgICBkMy5taW4oZGF0YSwgKGQpIC0+IGQzLm1pbihsYXllcktleXMsIChrKSAtPiBtZS5sYXllclZhbHVlKGQsaykpKVxuXG4gICAgcGFyc2VkVmFsdWUgPSAodikgLT5cbiAgICAgIGlmIF9pbnB1dEZvcm1hdEZuLnBhcnNlIHRoZW4gX2lucHV0Rm9ybWF0Rm4ucGFyc2UodikgZWxzZSBfaW5wdXRGb3JtYXRGbih2KVxuXG4gICAgY2FsY0RvbWFpbiA9IHtcbiAgICAgIGV4dGVudDogKGRhdGEpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICByZXR1cm4gW2xheWVyTWluKGRhdGEsIGxheWVyS2V5cyksIGxheWVyTWF4KGRhdGEsIGxheWVyS2V5cyldXG4gICAgICBtYXg6IChkYXRhKSAtPlxuICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgcmV0dXJuIFswLCBsYXllck1heChkYXRhLCBsYXllcktleXMpXVxuICAgICAgbWluOiAoZGF0YSkgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIHJldHVybiBbMCwgbGF5ZXJNaW4oZGF0YSwgbGF5ZXJLZXlzKV1cbiAgICAgIHRvdGFsRXh0ZW50OiAoZGF0YSkgLT5cbiAgICAgICAgaWYgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eSgndG90YWwnKVxuICAgICAgICAgIHJldHVybiBkMy5leHRlbnQoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBkLnRvdGFsKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICAgIHJldHVybiBkMy5leHRlbnQoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBsYXllclRvdGFsKGQsIGxheWVyS2V5cykpKVxuICAgICAgdG90YWw6IChkYXRhKSAtPlxuICAgICAgICBpZiBkYXRhWzBdLmhhc093blByb3BlcnR5KCd0b3RhbCcpXG4gICAgICAgICAgcmV0dXJuIFswLCBkMy5tYXgoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBkLnRvdGFsKSldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgICByZXR1cm4gWzAsIGQzLm1heChkYXRhLm1hcCgoZCkgLT5cbiAgICAgICAgICAgIGxheWVyVG90YWwoZCwgbGF5ZXJLZXlzKSkpXVxuICAgICAgcmFuZ2VFeHRlbnQ6IChkYXRhKSAtPlxuICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICByZXR1cm4gW2QzLm1pbihtZS5sb3dlclZhbHVlKGRhdGEpKSwgZDMubWF4KG1lLnVwcGVyVmFsdWUoZGF0YSkpXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgZGF0YS5sZW5ndGggPiAxXG4gICAgICAgICAgICBzdGFydCA9IG1lLmxvd2VyVmFsdWUoZGF0YVswXSlcbiAgICAgICAgICAgIHN0ZXAgPSBtZS5sb3dlclZhbHVlKGRhdGFbMV0pIC0gc3RhcnRcbiAgICAgICAgICAgIHJldHVybiBbbWUubG93ZXJWYWx1ZShkYXRhWzBdKSwgc3RhcnQgKyBzdGVwICogKGRhdGEubGVuZ3RoKSBdXG4gICAgICByYW5nZU1pbjogKGRhdGEpIC0+XG4gICAgICAgIHJldHVybiBbMCwgZDMubWluKG1lLmxvd2VyVmFsdWUoZGF0YSkpXVxuICAgICAgcmFuZ2VNYXg6IChkYXRhKSAtPlxuICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICByZXR1cm4gWzAsIGQzLm1heChtZS51cHBlclZhbHVlKGRhdGEpKV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHN0YXJ0ID0gbWUubG93ZXJWYWx1ZShkYXRhWzBdKVxuICAgICAgICAgIHN0ZXAgPSBtZS5sb3dlclZhbHVlKGRhdGFbMV0pIC0gc3RhcnRcbiAgICAgICAgICByZXR1cm4gWzAsIHN0YXJ0ICsgc3RlcCAqIChkYXRhLmxlbmd0aCkgXVxuICAgICAgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfa2luZCArICcuJyArIF9wYXJlbnQuaWQoKVxuXG4gICAgbWUua2luZCA9IChraW5kKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9raW5kXG4gICAgICBlbHNlXG4gICAgICAgIF9raW5kID0ga2luZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnBhcmVudCA9IChwYXJlbnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3BhcmVudFxuICAgICAgZWxzZVxuICAgICAgICBfcGFyZW50ID0gcGFyZW50XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuY2hhcnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmxheW91dCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheW91dFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5b3V0ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2NhbGUgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zY2FsZVxuXG4gICAgbWUubGVnZW5kID0gKCkgLT5cbiAgICAgIHJldHVybiBfbGVnZW5kXG5cbiAgICBtZS5pc09yZGluYWwgPSAoKSAtPlxuICAgICAgX2lzT3JkaW5hbFxuXG4gICAgbWUuaXNIb3Jpem9udGFsID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaXNIb3Jpem9udGFsXG4gICAgICBlbHNlXG4gICAgICAgIF9pc0hvcml6b250YWwgPSB0cnVlRmFsc2VcbiAgICAgICAgaWYgdHJ1ZUZhbHNlXG4gICAgICAgICAgX2lzVmVydGljYWwgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmlzVmVydGljYWwgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9pc1ZlcnRpY2FsXG4gICAgICBlbHNlXG4gICAgICAgIF9pc1ZlcnRpY2FsID0gdHJ1ZUZhbHNlXG4gICAgICAgIGlmIHRydWVGYWxzZVxuICAgICAgICAgIF9pc0hvcml6b250YWwgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLSBTY2FsZVR5cGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5zY2FsZVR5cGUgPSAodHlwZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGVUeXBlXG4gICAgICBlbHNlXG4gICAgICAgIGlmIGQzLnNjYWxlLmhhc093blByb3BlcnR5KHR5cGUpICMgc3VwcG9ydCB0aGUgZnVsbCBsaXN0IG9mIGQzIHNjYWxlIHR5cGVzXG4gICAgICAgICAgX3NjYWxlID0gZDMuc2NhbGVbdHlwZV0oKVxuICAgICAgICAgIF9zY2FsZVR5cGUgPSB0eXBlXG4gICAgICAgICAgbWUuZm9ybWF0KGZvcm1hdERlZmF1bHRzLm51bWJlcilcbiAgICAgICAgZWxzZSBpZiB0eXBlIGlzICd0aW1lJyAjIHRpbWUgc2NhbGUgaXMgaW4gZDMudGltZSBvYmplY3QsIG5vdCBpbiBkMy5zY2FsZS5cbiAgICAgICAgICBfc2NhbGUgPSBkMy50aW1lLnNjYWxlKClcbiAgICAgICAgICBfc2NhbGVUeXBlID0gJ3RpbWUnXG4gICAgICAgICAgaWYgX2lucHV0Rm9ybWF0U3RyaW5nXG4gICAgICAgICAgICBtZS5kYXRhRm9ybWF0KF9pbnB1dEZvcm1hdFN0cmluZylcbiAgICAgICAgICBtZS5mb3JtYXQoZm9ybWF0RGVmYXVsdHMuZGF0ZSlcbiAgICAgICAgZWxzZSBpZiB3a0NoYXJ0U2NhbGVzLmhhc093blByb3BlcnR5KHR5cGUpXG4gICAgICAgICAgX3NjYWxlVHlwZSA9IHR5cGVcbiAgICAgICAgICBfc2NhbGUgPSB3a0NoYXJ0U2NhbGVzW3R5cGVdKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRsb2cuZXJyb3IgJ0Vycm9yOiBpbGxlZ2FsIHNjYWxlIHR5cGU6JywgdHlwZVxuXG4gICAgICAgIF9pc09yZGluYWwgPSBfc2NhbGVUeXBlIGluIFsnb3JkaW5hbCcsICdjYXRlZ29yeTEwJywgJ2NhdGVnb3J5MjAnLCAnY2F0ZWdvcnkyMGInLCAnY2F0ZWdvcnkyMGMnXVxuICAgICAgICBpZiBfcmFuZ2VcbiAgICAgICAgICBtZS5yYW5nZShfcmFuZ2UpXG5cbiAgICAgICAgaWYgX3Nob3dBeGlzXG4gICAgICAgICAgX2F4aXMuc2NhbGUoX3NjYWxlKVxuXG4gICAgICAgIGlmIF9leHBvbmVudCBhbmQgX3NjYWxlVHlwZSBpcyAncG93J1xuICAgICAgICAgIF9zY2FsZS5leHBvbmVudChfZXhwb25lbnQpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZXhwb25lbnQgPSAodmFsdWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2V4cG9uZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9leHBvbmVudCA9IHZhbHVlXG4gICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ3BvdydcbiAgICAgICAgICBfc2NhbGUuZXhwb25lbnQoX2V4cG9uZW50KVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gRG9tYWluIGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5kb21haW4gPSAoZG9tKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9kb21haW5cbiAgICAgIGVsc2VcbiAgICAgICAgX2RvbWFpbiA9IGRvbVxuICAgICAgICBpZiBfLmlzQXJyYXkoX2RvbWFpbilcbiAgICAgICAgICBfc2NhbGUuZG9tYWluKF9kb21haW4pXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZG9tYWluQ2FsYyA9IChydWxlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBpZiBfaXNPcmRpbmFsIHRoZW4gdW5kZWZpbmVkIGVsc2UgX2RvbWFpbkNhbGNcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgY2FsY0RvbWFpbi5oYXNPd25Qcm9wZXJ0eShydWxlKVxuICAgICAgICAgIF9kb21haW5DYWxjID0gcnVsZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJGxvZy5lcnJvciAnaWxsZWdhbCBkb21haW4gY2FsY3VsYXRpb24gcnVsZTonLCBydWxlLCBcIiBleHBlY3RlZFwiLCBfLmtleXMoY2FsY0RvbWFpbilcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5nZXREb21haW4gPSAoZGF0YSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGUuZG9tYWluKClcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9kb21haW4gYW5kIG1lLmRvbWFpbkNhbGMoKVxuICAgICAgICAgICAgcmV0dXJuIF9jYWxjdWxhdGVkRG9tYWluXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBfZG9tYWluXG4gICAgICAgICAgICByZXR1cm4gX2RvbWFpblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBtZS52YWx1ZShkYXRhKVxuXG4gICAgbWUucmVzZXRPbk5ld0RhdGEgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9yZXNldE9uTmV3RGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfcmVzZXRPbk5ld0RhdGEgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIFJhbmdlIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUucmFuZ2UgPSAocmFuZ2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlLnJhbmdlKClcbiAgICAgIGVsc2VcbiAgICAgICAgX3JhbmdlID0gcmFuZ2VcbiAgICAgICAgaWYgX3NjYWxlVHlwZSBpcyAnb3JkaW5hbCcgYW5kIG1lLmtpbmQoKSBpbiBbJ3gnLCd5J11cbiAgICAgICAgICAgIF9zY2FsZS5yYW5nZUJhbmRzKHJhbmdlLCBfcmFuZ2VQYWRkaW5nLCBfcmFuZ2VPdXRlclBhZGRpbmcpXG4gICAgICAgIGVsc2UgaWYgbm90IChfc2NhbGVUeXBlIGluIFsnY2F0ZWdvcnkxMCcsICdjYXRlZ29yeTIwJywgJ2NhdGVnb3J5MjBiJywgJ2NhdGVnb3J5MjBjJ10pXG4gICAgICAgICAgX3NjYWxlLnJhbmdlKHJhbmdlKSAjIGlnbm9yZSByYW5nZSBmb3IgY29sb3IgY2F0ZWdvcnkgc2NhbGVzXG5cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5yYW5nZVBhZGRpbmcgPSAoY29uZmlnKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIHtwYWRkaW5nOl9yYW5nZVBhZGRpbmcsIG91dGVyUGFkZGluZzpfcmFuZ2VPdXRlclBhZGRpbmd9XG4gICAgICBlbHNlXG4gICAgICAgIF9yYW5nZVBhZGRpbmcgPSBjb25maWcucGFkZGluZ1xuICAgICAgICBfcmFuZ2VPdXRlclBhZGRpbmcgPSBjb25maWcub3V0ZXJQYWRkaW5nXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBwcm9wZXJ0eSByZWxhdGVkIGF0dHJpYnV0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Byb3BlcnR5XG4gICAgICBlbHNlXG4gICAgICAgIF9wcm9wZXJ0eSA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllclByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheWVyUHJvcFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJQcm9wID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxheWVyRXhjbHVkZSA9IChleGNsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXllckV4Y2x1ZGVcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyRXhjbHVkZSA9IGV4Y2xcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllcktleXMgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF9wcm9wZXJ0eVxuICAgICAgICBpZiBfLmlzQXJyYXkoX3Byb3BlcnR5KVxuICAgICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihfcHJvcGVydHksIGtleXMoZGF0YSkpICMgZW5zdXJlIG9ubHkga2V5cyBhbHNvIGluIHRoZSBkYXRhIGFyZSByZXR1cm5lZCBhbmQgJCRoYXNoS2V5IGlzIG5vdCByZXR1cm5lZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIFtfcHJvcGVydHldICNhbHdheXMgcmV0dXJuIGFuIGFycmF5ICEhIVxuICAgICAgZWxzZVxuICAgICAgICBfLnJlamVjdChrZXlzKGRhdGEpLCAoZCkgLT4gZCBpbiBfbGF5ZXJFeGNsdWRlKVxuXG4gICAgbWUubG93ZXJQcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sb3dlclByb3BlcnR5XG4gICAgICBlbHNlXG4gICAgICAgIF9sb3dlclByb3BlcnR5ID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnVwcGVyUHJvcGVydHkgPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdXBwZXJQcm9wZXJ0eVxuICAgICAgZWxzZVxuICAgICAgICBfdXBwZXJQcm9wZXJ0eSA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIERhdGEgRm9ybWF0dGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZGF0YUZvcm1hdCA9IChmb3JtYXQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2lucHV0Rm9ybWF0U3RyaW5nXG4gICAgICBlbHNlXG4gICAgICAgIF9pbnB1dEZvcm1hdFN0cmluZyA9IGZvcm1hdFxuICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICd0aW1lJ1xuICAgICAgICAgIF9pbnB1dEZvcm1hdEZuID0gd2tDaGFydExvY2FsZS50aW1lRm9ybWF0KGZvcm1hdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9pbnB1dEZvcm1hdEZuID0gKGQpIC0+IGRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIENvcmUgZGF0YSB0cmFuc2Zvcm1hdGlvbiBpbnRlcmZhY2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUudmFsdWUgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF9sYXllclByb3BcbiAgICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3Byb3BlcnR5XVtfbGF5ZXJQcm9wXSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfcHJvcGVydHldW19sYXllclByb3BdKVxuICAgICAgZWxzZVxuICAgICAgICBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gcGFyc2VkVmFsdWUoZFtfcHJvcGVydHldKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW19wcm9wZXJ0eV0pXG5cbiAgICBtZS5sYXllclZhbHVlID0gKGRhdGEsIGxheWVyS2V5KSAtPlxuICAgICAgaWYgX2xheWVyUHJvcFxuICAgICAgICBwYXJzZWRWYWx1ZShkYXRhW2xheWVyS2V5XVtfbGF5ZXJQcm9wXSlcbiAgICAgIGVsc2VcbiAgICAgICAgcGFyc2VkVmFsdWUoZGF0YVtsYXllcktleV0pXG5cbiAgICBtZS5sb3dlclZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gcGFyc2VkVmFsdWUoZFtfbG93ZXJQcm9wZXJ0eV0pKSBlbHNlIHBhcnNlZFZhbHVlKGRhdGFbX2xvd2VyUHJvcGVydHldKVxuXG4gICAgbWUudXBwZXJWYWx1ZSA9IChkYXRhKSAtPlxuICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3VwcGVyUHJvcGVydHldKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW191cHBlclByb3BlcnR5XSlcblxuICAgIG1lLmZvcm1hdHRlZFZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBtZS5mb3JtYXRWYWx1ZShtZS52YWx1ZShkYXRhKSlcblxuICAgIG1lLmZvcm1hdFZhbHVlID0gKHZhbCkgLT5cbiAgICAgIGlmIF9vdXRwdXRGb3JtYXRTdHJpbmcgYW5kIHZhbCBhbmQgICh2YWwuZ2V0VVRDRGF0ZSBvciBub3QgaXNOYU4odmFsKSlcbiAgICAgICAgX291dHB1dEZvcm1hdEZuKHZhbClcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsXG5cbiAgICBtZS5tYXAgPSAoZGF0YSkgLT5cbiAgICAgIGlmIEFycmF5LmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gX3NjYWxlKG1lLnZhbHVlKGRhdGEpKSkgZWxzZSBfc2NhbGUobWUudmFsdWUoZGF0YSkpXG5cbiAgICBtZS5pbnZlcnQgPSAobWFwcGVkVmFsdWUpIC0+XG4gICAgICAjIHRha2VzIGEgbWFwcGVkIHZhbHVlIChwaXhlbCBwb3NpdGlvbiAsIGNvbG9yIHZhbHVlLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluIHRoZSBpbnB1dCBkb21haW5cbiAgICAgICMgdGhlIHR5cGUgb2YgaW52ZXJzZSBpcyBkZXBlbmRlbnQgb24gdGhlIHNjYWxlIHR5cGUgZm9yIHF1YW50aXRhdGl2ZSBzY2FsZXMuXG4gICAgICAjIE9yZGluYWwgc2NhbGVzIC4uLlxuXG4gICAgICBpZiBfLmhhcyhtZS5zY2FsZSgpLCdpbnZlcnQnKSAjIGkuZS4gdGhlIGQzIHNjYWxlIHN1cHBvcnRzIHRoZSBpbnZlcnNlIGNhbGN1bGF0aW9uOiBsaW5lYXIsIGxvZywgcG93LCBzcXJ0XG4gICAgICAgIF9kYXRhID0gbWUuY2hhcnQoKS5nZXREYXRhKClcblxuICAgICAgICAjIGJpc2VjdC5sZWZ0IG5ldmVyIHJldHVybnMgMCBpbiB0aGlzIHNwZWNpZmljIHNjZW5hcmlvLiBXZSBuZWVkIHRvIG1vdmUgdGhlIHZhbCBieSBhbiBpbnRlcnZhbCB0byBoaXQgdGhlIG1pZGRsZSBvZiB0aGUgcmFuZ2UgYW5kIHRvIGVuc3VyZVxuICAgICAgICAjIHRoYXQgdGhlIGZpcnN0IGVsZW1lbnQgd2lsbCBiZSBjYXB0dXJlZC4gQWxzbyBlbnN1cmVzIGJldHRlciB2aXN1YWwgZXhwZXJpZW5jZSB3aXRoIHRvb2x0aXBzXG4gICAgICAgIGlmIG1lLmtpbmQoKSBpcyAncmFuZ2VYJyBvciBtZS5raW5kKCkgaXMgJ3JhbmdlWSdcbiAgICAgICAgICB2YWwgPSBtZS5zY2FsZSgpLmludmVydChtYXBwZWRWYWx1ZSlcbiAgICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICAgIGJpc2VjdCA9IGQzLmJpc2VjdG9yKG1lLnVwcGVyVmFsdWUpLmxlZnRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGVwID0gbWUubG93ZXJWYWx1ZShfZGF0YVsxXSkgLSBtZS5sb3dlclZhbHVlKF9kYXRhWzBdKVxuICAgICAgICAgICAgYmlzZWN0ID0gZDMuYmlzZWN0b3IoKGQpIC0+IG1lLmxvd2VyVmFsdWUoZCkgKyBzdGVwKS5sZWZ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByYW5nZSA9IF9zY2FsZS5yYW5nZSgpXG4gICAgICAgICAgaW50ZXJ2YWwgPSAocmFuZ2VbMV0gLSByYW5nZVswXSkgLyBfZGF0YS5sZW5ndGhcbiAgICAgICAgICB2YWwgPSBtZS5zY2FsZSgpLmludmVydChtYXBwZWRWYWx1ZSAtIGludGVydmFsLzIpXG4gICAgICAgICAgYmlzZWN0ID0gZDMuYmlzZWN0b3IobWUudmFsdWUpLmxlZnRcblxuICAgICAgICBpZHggPSBiaXNlY3QoX2RhdGEsIHZhbClcbiAgICAgICAgaWR4ID0gaWYgaWR4IDwgMCB0aGVuIDAgZWxzZSBpZiBpZHggPj0gX2RhdGEubGVuZ3RoIHRoZW4gX2RhdGEubGVuZ3RoIC0gMSBlbHNlIGlkeFxuICAgICAgICByZXR1cm4gaWR4ICMgdGhlIGludmVyc2UgdmFsdWUgZG9lcyBub3QgbmVjZXNzYXJpbHkgY29ycmVzcG9uZCB0byBhIHZhbHVlIGluIHRoZSBkYXRhXG5cbiAgICAgIGlmIF8uaGFzKG1lLnNjYWxlKCksJ2ludmVydEV4dGVudCcpICMgZDMgc3VwcG9ydHMgdGhpcyBmb3IgcXVhbnRpemUsIHF1YW50aWxlLCB0aHJlc2hvbGQuIHJldHVybnMgdGhlIHJhbmdlIHRoYXQgZ2V0cyBtYXBwZWQgdG8gdGhlIHZhbHVlXG4gICAgICAgIHJldHVybiBtZS5zY2FsZSgpLmludmVydEV4dGVudChtYXBwZWRWYWx1ZSkgI1RPRE8gSG93IHNob3VsZCB0aGlzIGJlIG1hcHBlZCBjb3JyZWN0bHkuIFVzZSBjYXNlPz8/XG5cbiAgICAgICMgZDMgZG9lcyBub3Qgc3VwcG9ydCBpbnZlcnQgZm9yIG9yZGluYWwgc2NhbGVzLCB0aHVzIHRoaW5ncyBiZWNvbWUgYSBiaXQgbW9yZSB0cmlja3kuXG4gICAgICAjIGluIGNhc2Ugd2UgYXJlIHNldHRpbmcgdGhlIGRvbWFpbiBleHBsaWNpdGx5LCB3ZSBrbm93IHRoYSB0aGUgcmFuZ2UgdmFsdWVzIGFuZCB0aGUgZG9tYWluIGVsZW1lbnRzIGFyZSBpbiB0aGUgc2FtZSBvcmRlclxuICAgICAgIyBpbiBjYXNlIHRoZSBkb21haW4gaXMgc2V0ICdsYXp5JyAoaS5lLiBhcyB2YWx1ZXMgYXJlIHVzZWQpIHdlIGNhbm5vdCBtYXAgcmFuZ2UgYW5kIGRvbWFpbiB2YWx1ZXMgZWFzaWx5LiBOb3QgY2xlYXIgaG93IHRvIGRvIHRoaXMgZWZmZWN0aXZlbHlcblxuICAgICAgaWYgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBkb21haW4gPSBfc2NhbGUuZG9tYWluKClcbiAgICAgICAgcmFuZ2UgPSBfc2NhbGUucmFuZ2UoKVxuICAgICAgICBpZiBfaXNWZXJ0aWNhbFxuICAgICAgICAgIGludGVydmFsID0gcmFuZ2VbMF0gLSByYW5nZVsxXVxuICAgICAgICAgIGlkeCA9IHJhbmdlLmxlbmd0aCAtIE1hdGguZmxvb3IobWFwcGVkVmFsdWUgLyBpbnRlcnZhbCkgLSAxXG4gICAgICAgICAgaWYgaWR4IDwgMCB0aGVuIGlkeCA9IDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGludGVydmFsID0gcmFuZ2VbMV0gLSByYW5nZVswXVxuICAgICAgICAgIGlkeCA9IE1hdGguZmxvb3IobWFwcGVkVmFsdWUgLyBpbnRlcnZhbClcbiAgICAgICAgcmV0dXJuIGlkeFxuXG4gICAgbWUuaW52ZXJ0T3JkaW5hbCA9IChtYXBwZWRWYWx1ZSkgLT5cbiAgICAgIGlmIG1lLmlzT3JkaW5hbCgpIGFuZCBtZS5yZXNldE9uTmV3RGF0YSgpXG4gICAgICAgIGlkeCA9IG1lLmludmVydChtYXBwZWRWYWx1ZSlcbiAgICAgICAgcmV0dXJuIF9zY2FsZS5kb21haW4oKVtpZHhdXG5cblxuICAgICMtLS0gQXhpcyBBdHRyaWJ1dGVzIGFuZCBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5zaG93QXhpcyA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dBeGlzXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93QXhpcyA9IHRydWVGYWxzZVxuICAgICAgICBpZiB0cnVlRmFsc2VcbiAgICAgICAgICBfYXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgICAgICBpZiBtZS5zY2FsZVR5cGUoKSBpcyAndGltZSdcbiAgICAgICAgICAgIF9heGlzLnRpY2tGb3JtYXQoX3RpY2tGb3JtYXQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYXhpcyA9IHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmF4aXNPcmllbnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9heGlzT3JpZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9heGlzT3JpZW50T2xkID0gX2F4aXNPcmllbnRcbiAgICAgICAgX2F4aXNPcmllbnQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXNPcmllbnRPbGQgPSAodmFsKSAtPiAgI1RPRE8gVGhpcyBpcyBub3QgdGhlIGJlc3QgcGxhY2UgdG8ga2VlcCB0aGUgb2xkIGF4aXMgdmFsdWUuIE9ubHkgbmVlZGVkIGJ5IGNvbnRhaW5lciBpbiBjYXNlIHRoZSBheGlzIHBvc2l0aW9uIGNoYW5nZXNcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXhpc09yaWVudE9sZFxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc09yaWVudE9sZCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXhpcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2F4aXNcblxuICAgIG1lLnRpY2tzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja3NcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tzID0gdmFsXG4gICAgICAgIGlmIG1lLmF4aXMoKVxuICAgICAgICAgIG1lLmF4aXMoKS50aWNrcyhfdGlja3MpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50aWNrRm9ybWF0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja0Zvcm1hdFxuICAgICAgZWxzZVxuICAgICAgICBfdGlja0Zvcm1hdCA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja0Zvcm1hdCh2YWwpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50aWNrVmFsdWVzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja1ZhbHVlc1xuICAgICAgZWxzZVxuICAgICAgICBfdGlja1ZhbHVlcyA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja1ZhbHVlcyh2YWwpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc2hvd0xhYmVsID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0xhYmVsXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93TGFiZWwgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXNMYWJlbCA9ICh0ZXh0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBpZiBfYXhpc0xhYmVsIHRoZW4gX2F4aXNMYWJlbCBlbHNlIG1lLnByb3BlcnR5KClcbiAgICAgIGVsc2VcbiAgICAgICAgX2F4aXNMYWJlbCA9IHRleHRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5yb3RhdGVUaWNrTGFiZWxzID0gKG5icikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcm90YXRlVGlja0xhYmVsc1xuICAgICAgZWxzZVxuICAgICAgICBfcm90YXRlVGlja0xhYmVscyA9IG5iclxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmZvcm1hdCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX291dHB1dEZvcm1hdFN0cmluZ1xuICAgICAgZWxzZVxuICAgICAgICBpZiB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSBpZiBtZS5zY2FsZVR5cGUoKSBpcyAndGltZScgdGhlbiBmb3JtYXREZWZhdWx0cy5kYXRlIGVsc2UgZm9ybWF0RGVmYXVsdHMubnVtYmVyXG4gICAgICAgIF9vdXRwdXRGb3JtYXRGbiA9IGlmIG1lLnNjYWxlVHlwZSgpIGlzICd0aW1lJyB0aGVuIHdrQ2hhcnRMb2NhbGUudGltZUZvcm1hdChfb3V0cHV0Rm9ybWF0U3RyaW5nKSBlbHNlIHdrQ2hhcnRMb2NhbGUubnVtYmVyRm9ybWF0KF9vdXRwdXRGb3JtYXRTdHJpbmcpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nRlxuXG4gICAgbWUuc2hvd0dyaWQgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93R3JpZFxuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0dyaWQgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0gUmVnaXN0ZXIgZm9yIGRyYXdpbmcgbGlmZWN5Y2xlIGV2ZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUucmVnaXN0ZXIgPSAoKSAtPlxuICAgICAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5vbiBcInNjYWxlRG9tYWlucy4je21lLmlkKCl9XCIsIChkYXRhKSAtPlxuICAgICAgICAjIHNldCB0aGUgZG9tYWluIGlmIHJlcXVpcmVkXG4gICAgICAgIGlmIG1lLnJlc2V0T25OZXdEYXRhKClcbiAgICAgICAgICAjIGVuc3VyZSByb2J1c3QgYmVoYXZpb3IgaW4gY2FzZSBvZiBwcm9ibGVtYXRpYyBkZWZpbml0aW9uc1xuICAgICAgICAgIGRvbWFpbiA9IG1lLmdldERvbWFpbihkYXRhKVxuICAgICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ2xpbmVhcicgYW5kIF8uc29tZShkb21haW4sIGlzTmFOKVxuICAgICAgICAgICAgdGhyb3cgXCJTY2FsZSAje21lLmtpbmQoKX0sIFR5cGUgJyN7X3NjYWxlVHlwZX0nOiBjYW5ub3QgY29tcHV0ZSBkb21haW4gZm9yIHByb3BlcnR5ICcje19wcm9wZXJ0eX0nIC4gUG9zc2libGUgcmVhc29uczogcHJvcGVydHkgbm90IHNldCwgZGF0YSBub3QgY29tcGF0aWJsZSB3aXRoIGRlZmluZWQgdHlwZS4gRG9tYWluOiN7ZG9tYWlufVwiXG5cbiAgICAgICAgICBfc2NhbGUuZG9tYWluKGRvbWFpbilcblxuICAgICAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5vbiBcInByZXBhcmVEYXRhLiN7bWUuaWQoKX1cIiwgKGRhdGEpIC0+XG4gICAgICAgICMgY29tcHV0ZSB0aGUgZG9tYWluIHJhbmdlIGNhbGN1bGF0aW9uIGlmIHJlcXVpcmVkXG4gICAgICAgIGNhbGNSdWxlID0gIG1lLmRvbWFpbkNhbGMoKVxuICAgICAgICBpZiBtZS5wYXJlbnQoKS5zY2FsZVByb3BlcnRpZXNcbiAgICAgICAgICBtZS5sYXllckV4Y2x1ZGUobWUucGFyZW50KCkuc2NhbGVQcm9wZXJ0aWVzKCkpXG4gICAgICAgIGlmIGNhbGNSdWxlIGFuZCBjYWxjRG9tYWluW2NhbGNSdWxlXVxuICAgICAgICAgIF9jYWxjdWxhdGVkRG9tYWluID0gY2FsY0RvbWFpbltjYWxjUnVsZV0oZGF0YSlcblxuICAgIG1lLnVwZGF0ZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLnVwZGF0ZShub0FuaW1hdGlvbilcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUudXBkYXRlQXR0cnMgPSAoKSAtPlxuICAgICAgbWUucGFyZW50KCkubGlmZUN5Y2xlKCkudXBkYXRlQXR0cnMoKVxuXG4gICAgbWUuZHJhd0F4aXMgPSAoKSAtPlxuICAgICAgbWUucGFyZW50KCkubGlmZUN5Y2xlKCkuZHJhd0F4aXMoKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gc2NhbGUiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdzY2FsZUxpc3QnLCAoJGxvZykgLT5cbiAgcmV0dXJuIHNjYWxlTGlzdCA9ICgpIC0+XG4gICAgX2xpc3QgPSB7fVxuICAgIF9raW5kTGlzdCA9IHt9XG4gICAgX3BhcmVudExpc3QgPSB7fVxuICAgIF9vd25lciA9IHVuZGVmaW5lZFxuICAgIF9yZXF1aXJlZFNjYWxlcyA9IFtdXG4gICAgX2xheWVyU2NhbGUgPSB1bmRlZmluZWRcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLm93bmVyID0gKG93bmVyKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9vd25lclxuICAgICAgZWxzZVxuICAgICAgICBfb3duZXIgPSBvd25lclxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFkZCA9IChzY2FsZSkgLT5cbiAgICAgIGlmIF9saXN0W3NjYWxlLmlkKCldXG4gICAgICAgICRsb2cuZXJyb3IgXCJzY2FsZUxpc3QuYWRkOiBzY2FsZSAje3NjYWxlLmlkKCl9IGFscmVhZHkgZGVmaW5lZCBpbiBzY2FsZUxpc3Qgb2YgI3tfb3duZXIuaWQoKX0uIER1cGxpY2F0ZSBzY2FsZXMgYXJlIG5vdCBhbGxvd2VkXCJcbiAgICAgIF9saXN0W3NjYWxlLmlkKCldID0gc2NhbGVcbiAgICAgIF9raW5kTGlzdFtzY2FsZS5raW5kKCldID0gc2NhbGVcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuaGFzU2NhbGUgPSAoc2NhbGUpIC0+XG4gICAgICBzID0gbWUuZ2V0S2luZChzY2FsZS5raW5kKCkpXG4gICAgICByZXR1cm4gcy5pZCgpIGlzIHNjYWxlLmlkKClcblxuICAgIG1lLmdldEtpbmQgPSAoa2luZCkgLT5cbiAgICAgIGlmIF9raW5kTGlzdFtraW5kXSB0aGVuIF9raW5kTGlzdFtraW5kXSBlbHNlIGlmIF9wYXJlbnRMaXN0LmdldEtpbmQgdGhlbiBfcGFyZW50TGlzdC5nZXRLaW5kKGtpbmQpIGVsc2UgdW5kZWZpbmVkXG5cbiAgICBtZS5oYXNLaW5kID0gKGtpbmQpIC0+XG4gICAgICByZXR1cm4gISFtZS5nZXRLaW5kKGtpbmQpXG5cbiAgICBtZS5yZW1vdmUgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBub3QgX2xpc3Rbc2NhbGUuaWQoKV1cbiAgICAgICAgJGxvZy53YXJuIFwic2NhbGVMaXN0LmRlbGV0ZTogc2NhbGUgI3tzY2FsZS5pZCgpfSBub3QgZGVmaW5lZCBpbiBzY2FsZUxpc3Qgb2YgI3tfb3duZXIuaWQoKX0uIElnbm9yaW5nXCJcbiAgICAgICAgcmV0dXJuIG1lXG4gICAgICBkZWxldGUgX2xpc3Rbc2NhbGUuaWQoKV1cbiAgICAgIGRlbGV0ZSBtZVtzY2FsZS5pZF1cbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucGFyZW50U2NhbGVzID0gKHNjYWxlTGlzdCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcGFyZW50TGlzdFxuICAgICAgZWxzZVxuICAgICAgICBfcGFyZW50TGlzdCA9IHNjYWxlTGlzdFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmdldE93bmVkID0gKCkgLT5cbiAgICAgIF9saXN0XG5cbiAgICBtZS5hbGxLaW5kcyA9ICgpIC0+XG4gICAgICByZXQgPSB7fVxuICAgICAgaWYgX3BhcmVudExpc3QuYWxsS2luZHNcbiAgICAgICAgZm9yIGssIHMgb2YgX3BhcmVudExpc3QuYWxsS2luZHMoKVxuICAgICAgICAgIHJldFtrXSA9IHNcbiAgICAgIGZvciBrLHMgb2YgX2tpbmRMaXN0XG4gICAgICAgIHJldFtrXSA9IHNcbiAgICAgIHJldHVybiByZXRcblxuICAgIG1lLnJlcXVpcmVkU2NhbGVzID0gKHJlcSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcmVxdWlyZWRTY2FsZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3JlcXVpcmVkU2NhbGVzID0gcmVxXG4gICAgICAgIGZvciBrIGluIHJlcVxuICAgICAgICAgIGlmIG5vdCBtZS5oYXNLaW5kKGspXG4gICAgICAgICAgICB0aHJvdyBcIkZhdGFsIEVycm9yOiBzY2FsZSAnI3trfScgcmVxdWlyZWQgYnV0IG5vdCBkZWZpbmVkXCJcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZ2V0U2NhbGVzID0gKGtpbmRMaXN0KSAtPlxuICAgICAgbCA9IHt9XG4gICAgICBmb3Iga2luZCBpbiBraW5kTGlzdFxuICAgICAgICBpZiBtZS5oYXNLaW5kKGtpbmQpXG4gICAgICAgICAgbFtraW5kXSA9IG1lLmdldEtpbmQoa2luZClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IFwiRmF0YWwgRXJyb3I6IHNjYWxlICcje2tpbmR9JyByZXF1aXJlZCBidXQgbm90IGRlZmluZWRcIlxuICAgICAgcmV0dXJuIGxcblxuICAgIG1lLmdldFNjYWxlUHJvcGVydGllcyA9ICgpIC0+XG4gICAgICBsID0gW11cbiAgICAgIGZvciBrLHMgb2YgbWUuYWxsS2luZHMoKVxuICAgICAgICBwcm9wID0gcy5wcm9wZXJ0eSgpXG4gICAgICAgIGlmIHByb3BcbiAgICAgICAgICBpZiBBcnJheS5pc0FycmF5KHByb3ApXG4gICAgICAgICAgICBsLmNvbmNhdChwcm9wKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGwucHVzaChwcm9wKVxuICAgICAgcmV0dXJuIGxcblxuICAgIG1lLmxheWVyU2NhbGUgPSAoa2luZCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICBpZiBfbGF5ZXJTY2FsZVxuICAgICAgICAgIHJldHVybiBtZS5nZXRLaW5kKF9sYXllclNjYWxlKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllclNjYWxlID0ga2luZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykucHJvdmlkZXIgJ3drQ2hhcnRMb2NhbGUnLCAoKSAtPlxuXG4gIGxvY2FsZSA9ICdlbl9VUydcblxuICBsb2NhbGVzID0ge1xuXG4gICAgZGVfREU6ZDMubG9jYWxlKHtcbiAgICAgIGRlY2ltYWw6IFwiLFwiLFxuICAgICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICAgIGdyb3VwaW5nOiBbM10sXG4gICAgICBjdXJyZW5jeTogW1wiXCIsIFwiIOKCrFwiXSxcbiAgICAgIGRhdGVUaW1lOiBcIiVBLCBkZXIgJWUuICVCICVZLCAlWFwiLFxuICAgICAgZGF0ZTogXCIlZS4lbS4lWVwiLFxuICAgICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgICAgcGVyaW9kczogW1wiQU1cIiwgXCJQTVwiXSwgIyB1bnVzZWRcbiAgICAgIGRheXM6IFtcIlNvbm50YWdcIiwgXCJNb250YWdcIiwgXCJEaWVuc3RhZ1wiLCBcIk1pdHR3b2NoXCIsIFwiRG9ubmVyc3RhZ1wiLCBcIkZyZWl0YWdcIiwgXCJTYW1zdGFnXCJdLFxuICAgICAgc2hvcnREYXlzOiBbXCJTb1wiLCBcIk1vXCIsIFwiRGlcIiwgXCJNaVwiLCBcIkRvXCIsIFwiRnJcIiwgXCJTYVwiXSxcbiAgICAgIG1vbnRoczogW1wiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk3DpHJ6XCIsIFwiQXByaWxcIiwgXCJNYWlcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIixcbiAgICAgICAgICAgICAgIFwiTm92ZW1iZXJcIiwgXCJEZXplbWJlclwiXSxcbiAgICAgIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNcnpcIiwgXCJBcHJcIiwgXCJNYWlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPa3RcIiwgXCJOb3ZcIiwgXCJEZXpcIl1cbiAgICB9KSxcblxuICAgICdlbl9VUyc6IGQzLmxvY2FsZSh7XG4gICAgICBcImRlY2ltYWxcIjogXCIuXCIsXG4gICAgICBcInRob3VzYW5kc1wiOiBcIixcIixcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdLFxuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsIFwiXCJdLFxuICAgICAgXCJkYXRlVGltZVwiOiBcIiVhICViICVlICVYICVZXCIsXG4gICAgICBcImRhdGVcIjogXCIlbS8lZC8lWVwiLFxuICAgICAgXCJ0aW1lXCI6IFwiJUg6JU06JVNcIixcbiAgICAgIFwicGVyaW9kc1wiOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgICAgXCJkYXlzXCI6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICAgICAgXCJzaG9ydERheXNcIjogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdLFxuICAgICAgXCJtb250aHNcIjogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLFxuICAgICAgICAgICAgICAgICBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl0sXG4gICAgICBcInNob3J0TW9udGhzXCI6IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnNldExvY2FsZSA9IChsKSAtPlxuICAgIGlmIF8uaGFzKGxvY2FsZXMsIGwpXG4gICAgICBsb2NhbGUgPSBsXG4gICAgZWxzZVxuICAgICAgdGhyb3cgXCJ1bmtub3dtIGxvY2FsZSAnI3tsfScgdXNpbmcgJ2VuLVVTJyBpbnN0ZWFkXCJcblxuXG4gIHRoaXMuJGdldCA9IFsnJGxvZycsKCRsb2cpIC0+XG4gICAgcmV0dXJuIGxvY2FsZXNbbG9jYWxlXVxuICBdXG5cbiAgcmV0dXJuIHRoaXMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5wcm92aWRlciAnd2tDaGFydFNjYWxlcycsICgpIC0+XG5cbiAgX2N1c3RvbUNvbG9ycyA9IFsncmVkJywgJ2dyZWVuJywnYmx1ZScsJ3llbGxvdycsJ29yYW5nZSddXG5cbiAgaGFzaGVkID0gKCkgLT5cbiAgICBkM1NjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG5cbiAgICBfaGFzaEZuID0gKHZhbHVlKSAtPlxuICAgICAgaGFzaCA9IDA7XG4gICAgICBtID0gZDNTY2FsZS5yYW5nZSgpLmxlbmd0aCAtIDFcbiAgICAgIGZvciBpIGluIFswIC4uIHZhbHVlLmxlbmd0aF1cbiAgICAgICAgaGFzaCA9ICgzMSAqIGhhc2ggKyB2YWx1ZS5jaGFyQXQoaSkpICUgbTtcblxuICAgIG1lID0gKHZhbHVlKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBtZVxuICAgICAgZDNTY2FsZShfaGFzaEZuKHZhbHVlKSlcblxuICAgIG1lLnJhbmdlID0gKHJhbmdlKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBkM1NjYWxlLnJhbmdlKClcbiAgICAgIGQzU2NhbGUuZG9tYWluKGQzLnJhbmdlKHJhbmdlLmxlbmd0aCkpXG4gICAgICBkM1NjYWxlLnJhbmdlKHJhbmdlKVxuXG4gICAgbWUucmFuZ2VQb2ludCA9IGQzU2NhbGUucmFuZ2VQb2ludHNcbiAgICBtZS5yYW5nZUJhbmRzID0gZDNTY2FsZS5yYW5nZUJhbmRzXG4gICAgbWUucmFuZ2VSb3VuZEJhbmRzID0gZDNTY2FsZS5yYW5nZVJvdW5kQmFuZHNcbiAgICBtZS5yYW5nZUJhbmQgPSBkM1NjYWxlLnJhbmdlQmFuZFxuICAgIG1lLnJhbmdlRXh0ZW50ID0gZDNTY2FsZS5yYW5nZUV4dGVudFxuXG4gICAgbWUuaGFzaCA9IChmbikgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2hhc2hGblxuICAgICAgX2hhc2hGbiA9IGZuXG4gICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuXG4gIGNhdGVnb3J5Q29sb3JzID0gKCkgLT4gcmV0dXJuIGQzLnNjYWxlLm9yZGluYWwoKS5yYW5nZShfY3VzdG9tQ29sb3JzKVxuXG4gIGNhdGVnb3J5Q29sb3JzSGFzaGVkID0gKCkgLT4gcmV0dXJuIGhhc2hlZCgpLnJhbmdlKF9jdXN0b21Db2xvcnMpXG5cbiAgdGhpcy5jb2xvcnMgPSAoY29sb3JzKSAtPlxuICAgIF9jdXN0b21Db2xvcnMgPSBjb2xvcnNcblxuICB0aGlzLiRnZXQgPSBbJyRsb2cnLCgkbG9nKSAtPlxuICAgIHJldHVybiB7aGFzaGVkOmhhc2hlZCxjb2xvcnM6Y2F0ZWdvcnlDb2xvcnMsIGNvbG9yc0hhc2hlZDogY2F0ZWdvcnlDb2xvcnNIYXNoZWR9XG4gIF1cblxuICByZXR1cm4gdGhpcyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sb3InLCAoJGxvZywgc2NhbGUsIGxlZ2VuZCwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsnY29sb3InLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVDb2xvcidcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICBsID0gdW5kZWZpbmVkXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnY29sb3InXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2NhdGVnb3J5MjAnKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuICAgICAgbWUucmVnaXN0ZXIoKVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAnc2NhbGVVdGlscycsICgkbG9nLCB3a0NoYXJ0U2NhbGVzLCB1dGlscykgLT5cblxuICBwYXJzZUxpc3QgPSAodmFsKSAtPlxuICAgIGlmIHZhbFxuICAgICAgbCA9IHZhbC50cmltKCkucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKS5zcGxpdCgnLCcpLm1hcCgoZCkgLT4gZC5yZXBsYWNlKC9eW1xcXCJ8J118W1xcXCJ8J10kL2csICcnKSlcbiAgICAgIGwgPSBsLm1hcCgoZCkgLT4gaWYgaXNOYU4oZCkgdGhlbiBkIGVsc2UgK2QpXG4gICAgICByZXR1cm4gaWYgbC5sZW5ndGggaXMgMSB0aGVuIHJldHVybiBsWzBdIGVsc2UgbFxuXG4gIHJldHVybiB7XG5cbiAgICBvYnNlcnZlU2hhcmVkQXR0cmlidXRlczogKGF0dHJzLCBtZSkgLT5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0eXBlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgZDMuc2NhbGUuaGFzT3duUHJvcGVydHkodmFsKSBvciB2YWwgaXMgJ3RpbWUnIG9yIHdrQ2hhcnRTY2FsZXMuaGFzT3duUHJvcGVydHkodmFsKVxuICAgICAgICAgICAgbWUuc2NhbGVUeXBlKHZhbClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiB2YWwgaXNudCAnJ1xuICAgICAgICAgICAgICAjIyBubyBzY2FsZSBkZWZpbmVkLCB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgICAkbG9nLmVycm9yIFwiRXJyb3I6IGlsbGVnYWwgc2NhbGUgdmFsdWU6ICN7dmFsfS4gVXNpbmcgJ2xpbmVhcicgc2NhbGUgaW5zdGVhZFwiXG4gICAgICAgICAgbWUudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2V4cG9uZW50JywgKHZhbCkgLT5cbiAgICAgICAgaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3BvdycgYW5kIF8uaXNOdW1iZXIoK3ZhbClcbiAgICAgICAgICBtZS5leHBvbmVudCgrdmFsKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncHJvcGVydHknLCAodmFsKSAtPlxuICAgICAgICBtZS5wcm9wZXJ0eShwYXJzZUxpc3QodmFsKSkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xheWVyUHJvcGVydHknLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgYW5kIHZhbC5sZW5ndGggPiAwXG4gICAgICAgICAgbWUubGF5ZXJQcm9wZXJ0eSh2YWwpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdyYW5nZScsICh2YWwpIC0+XG4gICAgICAgIHJhbmdlID0gcGFyc2VMaXN0KHZhbClcbiAgICAgICAgaWYgQXJyYXkuaXNBcnJheShyYW5nZSlcbiAgICAgICAgICBtZS5yYW5nZShyYW5nZSkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RhdGVGb3JtYXQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBpZiBtZS5zY2FsZVR5cGUoKSBpcyAndGltZSdcbiAgICAgICAgICAgIG1lLmRhdGFGb3JtYXQodmFsKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZG9tYWluJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgJGxvZy5pbmZvICdkb21haW4nLCB2YWxcbiAgICAgICAgICBwYXJzZWRMaXN0ID0gcGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiBBcnJheS5pc0FycmF5KHBhcnNlZExpc3QpXG4gICAgICAgICAgICBtZS5kb21haW4ocGFyc2VkTGlzdCkudXBkYXRlKClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAkbG9nLmVycm9yIFwiZG9tYWluOiBtdXN0IGJlIGFycmF5LCBvciBjb21tYS1zZXBhcmF0ZWQgbGlzdCwgZ290XCIsIHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5kb21haW4odW5kZWZpbmVkKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZG9tYWluUmFuZ2UnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBtZS5kb21haW5DYWxjKHZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVsJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUuYXhpc0xhYmVsKHZhbCkudXBkYXRlQXR0cnMoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZm9ybWF0JywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUuZm9ybWF0KHZhbClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3Jlc2V0JywgKHZhbCkgLT5cbiAgICAgICAgbWUucmVzZXRPbk5ld0RhdGEodXRpbHMucGFyc2VUcnVlRmFsc2UodmFsKSlcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBvYnNlcnZlQXhpc0F0dHJpYnV0ZXM6IChhdHRycywgbWUsIHNjb3BlKSAtPlxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndGlja0Zvcm1hdCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnRpY2tGb3JtYXQoZDMuZm9ybWF0KHZhbCkpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0aWNrcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnRpY2tzKCt2YWwpXG4gICAgICAgICAgaWYgbWUuYXhpcygpXG4gICAgICAgICAgICBtZS51cGRhdGVBdHRycygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdncmlkJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUuc2hvd0dyaWQodmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScpLnVwZGF0ZUF0dHJzKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3Nob3dMYWJlbCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnNob3dMYWJlbCh2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJykudXBkYXRlKHRydWUpXG5cblxuICAgICAgc2NvcGUuJHdhdGNoIGF0dHJzLmF4aXNGb3JtYXR0ZXJzLCAgKHZhbCkgLT5cbiAgICAgICAgaWYgXy5pc09iamVjdCh2YWwpXG4gICAgICAgICAgaWYgXy5oYXModmFsLCAndGlja0Zvcm1hdCcpIGFuZCBfLmlzRnVuY3Rpb24odmFsLnRpY2tGb3JtYXQpXG4gICAgICAgICAgICBtZS50aWNrRm9ybWF0KHZhbC50aWNrRm9ybWF0KVxuICAgICAgICAgIGVsc2UgaWYgXy5pc1N0cmluZyh2YWwudGlja0Zvcm1hdClcbiAgICAgICAgICAgIG1lLnRpY2tGb3JtYXQoZDMuZm9ybWF0KHZhbCkpXG4gICAgICAgICAgaWYgXy5oYXModmFsLCd0aWNrVmFsdWVzJykgYW5kIF8uaXNBcnJheSh2YWwudGlja1ZhbHVlcylcbiAgICAgICAgICAgIG1lLnRpY2tWYWx1ZXModmFsLnRpY2tWYWx1ZXMpXG4gICAgICAgICAgbWUudXBkYXRlKClcblxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lLCBsYXlvdXQpIC0+XG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsZWdlbmQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBsID0gbWUubGVnZW5kKClcbiAgICAgICAgICBsLnNob3dWYWx1ZXMoZmFsc2UpXG4gICAgICAgICAgc3dpdGNoIHZhbFxuICAgICAgICAgICAgd2hlbiAnZmFsc2UnXG4gICAgICAgICAgICAgIGwuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgIHdoZW4gJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24odmFsKS5kaXYodW5kZWZpbmVkKS5zaG93KHRydWUpXG4gICAgICAgICAgICB3aGVuICd0cnVlJywgJydcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbigndG9wLXJpZ2h0Jykuc2hvdyh0cnVlKS5kaXYodW5kZWZpbmVkKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsZWdlbmREaXYgPSBkMy5zZWxlY3QodmFsKVxuICAgICAgICAgICAgICBpZiBsZWdlbmREaXYuZW1wdHkoKVxuICAgICAgICAgICAgICAgICRsb2cud2FybiAnbGVnZW5kIHJlZmVyZW5jZSBkb2VzIG5vdCBleGlzdDonLCB2YWxcbiAgICAgICAgICAgICAgICBsLmRpdih1bmRlZmluZWQpLnNob3coZmFsc2UpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsLmRpdihsZWdlbmREaXYpLnBvc2l0aW9uKCd0b3AtbGVmdCcpLnNob3codHJ1ZSlcblxuICAgICAgICAgIGwuc2NhbGUobWUpLmxheW91dChsYXlvdXQpXG4gICAgICAgICAgaWYgbWUucGFyZW50KClcbiAgICAgICAgICAgIGwucmVnaXN0ZXIobWUucGFyZW50KCkpXG4gICAgICAgICAgbC5yZWRyYXcoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndmFsdWVzTGVnZW5kJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbCA9IG1lLmxlZ2VuZCgpXG4gICAgICAgICAgbC5zaG93VmFsdWVzKHRydWUpXG4gICAgICAgICAgc3dpdGNoIHZhbFxuICAgICAgICAgICAgd2hlbiAnZmFsc2UnXG4gICAgICAgICAgICAgIGwuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgIHdoZW4gJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24odmFsKS5kaXYodW5kZWZpbmVkKS5zaG93KHRydWUpXG4gICAgICAgICAgICB3aGVuICd0cnVlJywgJydcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbigndG9wLXJpZ2h0Jykuc2hvdyh0cnVlKS5kaXYodW5kZWZpbmVkKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsZWdlbmREaXYgPSBkMy5zZWxlY3QodmFsKVxuICAgICAgICAgICAgICBpZiBsZWdlbmREaXYuZW1wdHkoKVxuICAgICAgICAgICAgICAgICRsb2cud2FybiAnbGVnZW5kIHJlZmVyZW5jZSBkb2VzIG5vdCBleGlzdDonLCB2YWxcbiAgICAgICAgICAgICAgICBsLmRpdih1bmRlZmluZWQpLnNob3coZmFsc2UpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsLmRpdihsZWdlbmREaXYpLnBvc2l0aW9uKCd0b3AtbGVmdCcpLnNob3codHJ1ZSlcblxuICAgICAgICAgIGwuc2NhbGUobWUpLmxheW91dChsYXlvdXQpXG4gICAgICAgICAgaWYgbWUucGFyZW50KClcbiAgICAgICAgICAgIGwucmVnaXN0ZXIobWUucGFyZW50KCkpXG4gICAgICAgICAgbC5yZWRyYXcoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGVnZW5kVGl0bGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5sZWdlbmQoKS50aXRsZSh2YWwpLnJlZHJhdygpXG5cbiAgICAjLS0tIE9ic2VydmUgUmFuZ2UgYXR0cmlidXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb2JzZXJ2ZXJSYW5nZUF0dHJpYnV0ZXM6IChhdHRycywgbWUpIC0+XG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbG93ZXJQcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIG51bGxcbiAgICAgICAgbWUubG93ZXJQcm9wZXJ0eShwYXJzZUxpc3QodmFsKSkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3VwcGVyUHJvcGVydHknLCAodmFsKSAtPlxuICAgICAgICBudWxsXG4gICAgICAgIG1lLnVwcGVyUHJvcGVydHkocGFyc2VMaXN0KHZhbCkpLnVwZGF0ZSgpXG5cbiAgfVxuXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NoYXBlJywgKCRsb2csIHNjYWxlLCBkM1NoYXBlcywgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsnc2hhcGUnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVTaXplJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdzaGFwZSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICBtZS5zY2FsZSgpLnJhbmdlKGQzU2hhcGVzKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuICAgICAgbWUucmVnaXN0ZXIoKVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc2l6ZScsICgkbG9nLCBzY2FsZSwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsnc2l6ZScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVNpemUnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3NpemUnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2xpbmVhcicpXG4gICAgICBtZS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuICAgICAgbWUucmVnaXN0ZXIoKVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAneCcsICgkbG9nLCBzY2FsZSwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsneCcsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWCdcbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpICMgZm9yIEFuZ3VsYXIgMS4zXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3gnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2xpbmVhcicpXG4gICAgICBtZS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgbWUuaXNIb3Jpem9udGFsKHRydWUpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdheGlzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgICAgaWYgdmFsIGluIFsndG9wJywgJ2JvdHRvbSddXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQodmFsKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KCdib3R0b20nKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLnNob3dBeGlzKGZhbHNlKS5heGlzT3JpZW50KHVuZGVmaW5lZClcbiAgICAgICAgICBtZS51cGRhdGUodHJ1ZSlcblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlQXhpc0F0dHJpYnV0ZXMoYXR0cnMsIG1lLCBzY29wZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdyb3RhdGVUaWNrTGFiZWxzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCBfLmlzTnVtYmVyKCt2YWwpXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscygrdmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscyh1bmRlZmluZWQpXG4gICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdyYW5nZVgnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3JhbmdlWCcsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWCdcbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpICMgZm9yIEFuZ3VsYXIgMS4zXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3JhbmdlWCdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBtZS5pc0hvcml6b250YWwodHJ1ZSlcbiAgICAgIG1lLnJlZ2lzdGVyKClcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2F4aXMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgICBpZiB2YWwgaW4gWyd0b3AnLCAnYm90dG9tJ11cbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCh2YWwpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQoJ2JvdHRvbScpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUsIHNjb3BlKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZXJSYW5nZUF0dHJpYnV0ZXMoYXR0cnMsbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdyb3RhdGVUaWNrTGFiZWxzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCBfLmlzTnVtYmVyKCt2YWwpXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscygrdmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscyh1bmRlZmluZWQpXG4gICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICd5JywgKCRsb2csIHNjYWxlLCBsZWdlbmQsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3knLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVZJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICd5J1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUuaXNWZXJ0aWNhbCh0cnVlKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdheGlzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgICAgaWYgdmFsIGluIFsnbGVmdCcsICdyaWdodCddXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQodmFsKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KCdsZWZ0Jykuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5zaG93QXhpcyhmYWxzZSkuYXhpc09yaWVudCh1bmRlZmluZWQpXG4gICAgICAgICAgbWUudXBkYXRlKHRydWUpXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgc2NvcGUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdyYW5nZVknLCAoJGxvZywgc2NhbGUsIGxlZ2VuZCwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsncmFuZ2VZJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAncmFuZ2VZJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUuaXNWZXJ0aWNhbCh0cnVlKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdheGlzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgICAgaWYgdmFsIGluIFsnbGVmdCcsICdyaWdodCddXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQodmFsKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KCdsZWZ0Jykuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5zaG93QXhpcyhmYWxzZSkuYXhpc09yaWVudCh1bmRlZmluZWQpXG4gICAgICAgICAgbWUudXBkYXRlKHRydWUpXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgc2NvcGUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlclJhbmdlQXR0cmlidXRlcyhhdHRycyxtZSlcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnNlcnZpY2UgJ3NlbGVjdGlvblNoYXJpbmcnLCAoJGxvZykgLT5cbiAgX3NlbGVjdGlvbiA9IHt9XG4gIF9zZWxlY3Rpb25JZHhSYW5nZSA9IHt9XG4gIGNhbGxiYWNrcyA9IHt9XG5cbiAgdGhpcy5jcmVhdGVHcm91cCA9IChncm91cCkgLT5cblxuXG4gIHRoaXMuc2V0U2VsZWN0aW9uID0gKHNlbGVjdGlvbiwgc2VsZWN0aW9uSWR4UmFuZ2UsIGdyb3VwKSAtPlxuICAgIGlmIGdyb3VwXG4gICAgICBfc2VsZWN0aW9uW2dyb3VwXSA9IHNlbGVjdGlvblxuICAgICAgX3NlbGVjdGlvbklkeFJhbmdlW2dyb3VwXSA9IHNlbGVjdGlvbklkeFJhbmdlXG4gICAgICBpZiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgIGZvciBjYiBpbiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgICAgY2Ioc2VsZWN0aW9uLCBzZWxlY3Rpb25JZHhSYW5nZSlcblxuICB0aGlzLmdldFNlbGVjdGlvbiA9IChncm91cCkgLT5cbiAgICBncnAgPSBncm91cCBvciAnZGVmYXVsdCdcbiAgICByZXR1cm4gc2VsZWN0aW9uW2dycF1cblxuICB0aGlzLnJlZ2lzdGVyID0gKGdyb3VwLCBjYWxsYmFjaykgLT5cbiAgICBpZiBncm91cFxuICAgICAgaWYgbm90IGNhbGxiYWNrc1tncm91cF1cbiAgICAgICAgY2FsbGJhY2tzW2dyb3VwXSA9IFtdXG4gICAgICAjZW5zdXJlIHRoYXQgY2FsbGJhY2tzIGFyZSBub3QgcmVnaXN0ZXJlZCBtb3JlIHRoYW4gb25jZVxuICAgICAgaWYgbm90IF8uY29udGFpbnMoY2FsbGJhY2tzW2dyb3VwXSwgY2FsbGJhY2spXG4gICAgICAgIGNhbGxiYWNrc1tncm91cF0ucHVzaChjYWxsYmFjaylcblxuICB0aGlzLnVucmVnaXN0ZXIgPSAoZ3JvdXAsIGNhbGxiYWNrKSAtPlxuICAgIGlmIGNhbGxiYWNrc1tncm91cF1cbiAgICAgIGlkeCA9IGNhbGxiYWNrc1tncm91cF0uaW5kZXhPZiBjYWxsYmFja1xuICAgICAgaWYgaWR4ID49IDBcbiAgICAgICAgY2FsbGJhY2tzW2dyb3VwXS5zcGxpY2UoaWR4LCAxKVxuXG4gIHJldHVybiB0aGlzXG5cbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnNlcnZpY2UgJ3RpbWluZycsICgkbG9nKSAtPlxuXG4gIHRpbWVycyA9IHt9XG4gIGVsYXBzZWRTdGFydCA9IDBcbiAgZWxhcHNlZCA9IDBcblxuICB0aGlzLmluaXQgPSAoKSAtPlxuICAgIGVsYXBzZWRTdGFydCA9IERhdGUubm93KClcblxuICB0aGlzLnN0YXJ0ID0gKHRvcGljKSAtPlxuICAgIHRvcCA9IHRpbWVyc1t0b3BpY11cbiAgICBpZiBub3QgdG9wXG4gICAgICB0b3AgPSB0aW1lcnNbdG9waWNdID0ge25hbWU6dG9waWMsIHN0YXJ0OjAsIHRvdGFsOjAsIGNhbGxDbnQ6MCwgYWN0aXZlOiBmYWxzZX1cbiAgICB0b3Auc3RhcnQgPSBEYXRlLm5vdygpXG4gICAgdG9wLmFjdGl2ZSA9IHRydWVcblxuICB0aGlzLnN0b3AgPSAodG9waWMpIC0+XG4gICAgaWYgdG9wID0gdGltZXJzW3RvcGljXVxuICAgICAgdG9wLmFjdGl2ZSA9IGZhbHNlXG4gICAgICB0b3AudG90YWwgKz0gRGF0ZS5ub3coKSAtIHRvcC5zdGFydFxuICAgICAgdG9wLmNhbGxDbnQgKz0gMVxuICAgIGVsYXBzZWQgPSBEYXRlLm5vdygpIC0gZWxhcHNlZFN0YXJ0XG5cbiAgdGhpcy5yZXBvcnQgPSAoKSAtPlxuICAgIGZvciB0b3BpYywgdmFsIG9mIHRpbWVyc1xuICAgICAgdmFsLmF2ZyA9IHZhbC50b3RhbCAvIHZhbC5jYWxsQ250XG4gICAgJGxvZy5pbmZvIHRpbWVyc1xuICAgICRsb2cuaW5mbyAnRWxhcHNlZCBUaW1lIChtcyknLCBlbGFwc2VkXG4gICAgcmV0dXJuIHRpbWVyc1xuXG4gIHRoaXMuY2xlYXIgPSAoKSAtPlxuICAgIHRpbWVycyA9IHt9XG5cbiAgcmV0dXJuIHRoaXMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdsYXllcmVkRGF0YScsICgkbG9nKSAtPlxuXG4gIGxheWVyZWQgPSAoKSAtPlxuICAgIF9kYXRhID0gW11cbiAgICBfbGF5ZXJLZXlzID0gW11cbiAgICBfeCA9IHVuZGVmaW5lZFxuICAgIF9jYWxjVG90YWwgPSBmYWxzZVxuICAgIF9taW4gPSBJbmZpbml0eVxuICAgIF9tYXggPSAtSW5maW5pdHlcbiAgICBfdE1pbiA9IEluZmluaXR5XG4gICAgX3RNYXggPSAtSW5maW5pdHlcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLmRhdGEgPSAoZGF0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBJcyAwXG4gICAgICAgIHJldHVybiBfZGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfZGF0YSA9IGRhdFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxheWVyS2V5cyA9IChrZXlzKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBfbGF5ZXJLZXlzXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllcktleXMgPSBrZXlzXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUueCA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBfeFxuICAgICAgZWxzZVxuICAgICAgICBfeCA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5jYWxjVG90YWwgPSAodF9mKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBfY2FsY1RvdGFsXG4gICAgICBlbHNlXG4gICAgICAgIF9jYWxjVG90YWwgPSB0X2ZcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5taW4gPSAoKSAtPlxuICAgICAgX21pblxuXG4gICAgbWUubWF4ID0gKCkgLT5cbiAgICAgIF9tYXhcblxuICAgIG1lLm1pblRvdGFsID0gKCkgLT5cbiAgICAgIF90TWluXG5cbiAgICBtZS5tYXhUb3RhbCA9ICgpIC0+XG4gICAgICBfdE1heFxuXG4gICAgbWUuZXh0ZW50ID0gKCkgLT5cbiAgICAgIFttZS5taW4oKSwgbWUubWF4KCldXG5cbiAgICBtZS50b3RhbEV4dGVudCA9ICgpIC0+XG4gICAgICBbbWUubWluVG90YWwoKSwgbWUubWF4VG90YWwoKV1cblxuICAgIG1lLmNvbHVtbnMgPSAoZGF0YSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMVxuICAgICAgICAjX2xheWVyS2V5cy5tYXAoKGspIC0+IHtrZXk6aywgdmFsdWVzOmRhdGEubWFwKChkKSAtPiB7eDogZFtfeF0sIHZhbHVlOiBkW2tdLCBkYXRhOiBkfSApfSlcbiAgICAgICAgcmVzID0gW11cbiAgICAgICAgX21pbiA9IEluZmluaXR5XG4gICAgICAgIF9tYXggPSAtSW5maW5pdHlcbiAgICAgICAgX3RNaW4gPSBJbmZpbml0eVxuICAgICAgICBfdE1heCA9IC1JbmZpbml0eVxuXG4gICAgICAgIGZvciBrLCBpIGluIF9sYXllcktleXNcbiAgICAgICAgICByZXNbaV0gPSB7a2V5OmssIHZhbHVlOltdLCBtaW46SW5maW5pdHksIG1heDotSW5maW5pdHl9XG4gICAgICAgIGZvciBkLCBpIGluIGRhdGFcbiAgICAgICAgICB0ID0gMFxuICAgICAgICAgIHh2ID0gaWYgdHlwZW9mIF94IGlzICdzdHJpbmcnIHRoZW4gZFtfeF0gZWxzZSBfeChkKVxuXG4gICAgICAgICAgZm9yIGwgaW4gcmVzXG4gICAgICAgICAgICB2ID0gK2RbbC5rZXldXG4gICAgICAgICAgICBsLnZhbHVlLnB1c2gge3g6eHYsIHZhbHVlOiB2LCBrZXk6bC5rZXl9XG4gICAgICAgICAgICBpZiBsLm1heCA8IHYgdGhlbiBsLm1heCA9IHZcbiAgICAgICAgICAgIGlmIGwubWluID4gdiB0aGVuIGwubWluID0gdlxuICAgICAgICAgICAgaWYgX21heCA8IHYgdGhlbiBfbWF4ID0gdlxuICAgICAgICAgICAgaWYgX21pbiA+IHYgdGhlbiBfbWluID0gdlxuICAgICAgICAgICAgaWYgX2NhbGNUb3RhbCB0aGVuIHQgKz0gK3ZcbiAgICAgICAgICBpZiBfY2FsY1RvdGFsXG4gICAgICAgICAgICAjdG90YWwudmFsdWUucHVzaCB7eDpkW194XSwgdmFsdWU6dCwga2V5OnRvdGFsLmtleX1cbiAgICAgICAgICAgIGlmIF90TWF4IDwgdCB0aGVuIF90TWF4ID0gdFxuICAgICAgICAgICAgaWYgX3RNaW4gPiB0IHRoZW4gX3RNaW4gPSB0XG4gICAgICAgIHJldHVybiB7bWluOl9taW4sIG1heDpfbWF4LCB0b3RhbE1pbjpfdE1pbix0b3RhbE1heDpfdE1heCwgZGF0YTpyZXN9XG4gICAgICByZXR1cm4gbWVcblxuXG5cbiAgICBtZS5yb3dzID0gKGRhdGEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcbiAgICAgICAgcmV0dXJuIGRhdGEubWFwKChkKSAtPiB7eDogZFtfeF0sIGxheWVyczogbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2tleTprLCB2YWx1ZTogZFtrXSwgeDpkW194XX0pfSlcbiAgICAgIHJldHVybiBtZVxuXG5cbiAgICByZXR1cm4gbWUiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3N2Z0ljb24nLCAoJGxvZykgLT5cbiAgIyMgaW5zZXJ0IHN2ZyBwYXRoIGludG8gaW50ZXJwb2xhdGVkIEhUTUwuIFJlcXVpcmVkIHByZXZlbnQgQW5ndWxhciBmcm9tIHRocm93aW5nIGVycm9yIChGaXggMjIpXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHRlbXBsYXRlOiAnPHN2ZyBuZy1zdHlsZT1cInN0eWxlXCI+PHBhdGg+PC9wYXRoPjwvc3ZnPidcbiAgICBzY29wZTpcbiAgICAgIHBhdGg6IFwiPVwiXG4gICAgICB3aWR0aDogXCJAXCJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHJzICkgLT5cbiAgICAgIHNjb3BlLnN0eWxlID0geyAgIyBmaXggSUUgcHJvYmxlbSB3aXRoIGludGVycG9sYXRpbmcgc3R5bGUgdmFsdWVzXG4gICAgICAgIGhlaWdodDogJzIwcHgnXG4gICAgICAgIHdpZHRoOiBzY29wZS53aWR0aCArICdweCdcbiAgICAgICAgJ3ZlcnRpY2FsLWFsaWduJzogJ21pZGRsZSdcbiAgICAgIH1cbiAgICAgIHNjb3BlLiR3YXRjaCAncGF0aCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIGQzLnNlbGVjdChlbGVtWzBdKS5zZWxlY3QoJ3BhdGgnKS5hdHRyKCdkJywgdmFsKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSg4LDgpXCIpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICd1dGlscycsICgkbG9nKSAtPlxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAZGlmZiA9IChhLGIsZGlyZWN0aW9uKSAtPlxuICAgIG5vdEluQiA9ICh2KSAtPlxuICAgICAgYi5pbmRleE9mKHYpIDwgMFxuXG4gICAgcmVzID0ge31cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCBhLmxlbmd0aFxuICAgICAgaWYgbm90SW5CKGFbaV0pXG4gICAgICAgIHJlc1thW2ldXSA9IHVuZGVmaW5lZFxuICAgICAgICBqID0gaSArIGRpcmVjdGlvblxuICAgICAgICB3aGlsZSAwIDw9IGogPCBhLmxlbmd0aFxuICAgICAgICAgIGlmIG5vdEluQihhW2pdKVxuICAgICAgICAgICAgaiArPSBkaXJlY3Rpb25cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXNbYVtpXV0gPSAgYVtqXVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgIGkrK1xuICAgIHJldHVybiByZXNcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgaWQgPSAwXG4gIEBnZXRJZCA9ICgpIC0+XG4gICAgcmV0dXJuICdDaGFydCcgKyBpZCsrXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIEBwYXJzZUxpc3QgPSAodmFsKSAtPlxuICAgIGlmIHZhbFxuICAgICAgbCA9IHZhbC50cmltKCkucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKS5zcGxpdCgnLCcpLm1hcCgoZCkgLT4gZC5yZXBsYWNlKC9eW1xcXCJ8J118W1xcXCJ8J10kL2csICcnKSlcbiAgICAgIHJldHVybiBpZiBsLmxlbmd0aCBpcyAxIHRoZW4gcmV0dXJuIGxbMF0gZWxzZSBsXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gIEBwYXJzZVRydWVGYWxzZSA9ICh2YWwpIC0+XG4gICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScgdGhlbiB0cnVlIGVsc2UgKGlmIHZhbCBpcyAnZmFsc2UnIHRoZW4gZmFsc2UgZWxzZSB1bmRlZmluZWQpXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIEBtZXJnZURhdGEgPSAoKSAtPlxuXG4gICAgX3ByZXZEYXRhID0gW11cbiAgICBfZGF0YSA9IFtdXG4gICAgX3ByZXZIYXNoID0ge31cbiAgICBfaGFzaCA9IHt9XG4gICAgX3ByZXZDb21tb24gPSBbXVxuICAgIF9jb21tb24gPSBbXVxuICAgIF9maXJzdCA9IHVuZGVmaW5lZFxuICAgIF9sYXN0ID0gdW5kZWZpbmVkXG5cbiAgICBfa2V5ID0gKGQpIC0+IGQgIyBpZGVudGl0eVxuICAgIF9sYXllcktleSA9IChkKSAtPiBkXG5cblxuICAgIG1lID0gKGRhdGEpIC0+XG4gICAgICAjIHNhdmUgX2RhdGEgdG8gX3ByZXZpb3VzRGF0YSBhbmQgdXBkYXRlIF9wcmV2aW91c0hhc2g7XG4gICAgICBfcHJldkRhdGEgPSBbXVxuICAgICAgX3ByZXZIYXNoID0ge31cbiAgICAgIGZvciBkLGkgIGluIF9kYXRhXG4gICAgICAgIF9wcmV2RGF0YVtpXSA9IGQ7XG4gICAgICAgIF9wcmV2SGFzaFtfa2V5KGQpXSA9IGlcblxuICAgICAgI2l0ZXJhdGUgb3ZlciBkYXRhIGFuZCBkZXRlcm1pbmUgdGhlIGNvbW1vbiBlbGVtZW50c1xuICAgICAgX3ByZXZDb21tb24gPSBbXTtcbiAgICAgIF9jb21tb24gPSBbXTtcbiAgICAgIF9oYXNoID0ge307XG4gICAgICBfZGF0YSA9IGRhdGE7XG5cbiAgICAgIGZvciBkLGogaW4gX2RhdGFcbiAgICAgICAga2V5ID0gX2tleShkKVxuICAgICAgICBfaGFzaFtrZXldID0galxuICAgICAgICBpZiBfcHJldkhhc2guaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICAgICNlbGVtZW50IGlzIGluIGJvdGggYXJyYXlzXG4gICAgICAgICAgX3ByZXZDb21tb25bX3ByZXZIYXNoW2tleV1dID0gdHJ1ZVxuICAgICAgICAgIF9jb21tb25bal0gPSB0cnVlXG4gICAgICByZXR1cm4gbWU7XG5cbiAgICBtZS5rZXkgPSAoZm4pIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9rZXlcbiAgICAgIF9rZXkgPSBmbjtcbiAgICAgIHJldHVybiBtZTtcblxuICAgIG1lLmZpcnN0ID0gKGZpcnN0KSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBfZmlyc3RcbiAgICAgIF9maXJzdCA9IGZpcnN0XG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxhc3QgPSAobGFzdCkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2xhc3RcbiAgICAgIF9sYXN0ID0gbGFzdFxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRlZCA9ICgpIC0+XG4gICAgICByZXQgPSBbXTtcbiAgICAgIGZvciBkLCBpIGluIF9kYXRhXG4gICAgICAgIGlmICFfY29tbW9uW2ldIHRoZW4gcmV0LnB1c2goX2QpXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5kZWxldGVkID0gKCkgLT5cbiAgICAgIHJldCA9IFtdO1xuICAgICAgZm9yIHAsIGkgaW4gX3ByZXZEYXRhXG4gICAgICAgIGlmICFfcHJldkNvbW1vbltpXSB0aGVuIHJldC5wdXNoKF9wcmV2RGF0YVtpXSlcbiAgICAgIHJldHVybiByZXRcblxuICAgIG1lLmN1cnJlbnQgPSAoa2V5KSAtPlxuICAgICAgcmV0dXJuIF9kYXRhW19oYXNoW2tleV1dXG5cbiAgICBtZS5wcmV2ID0gKGtleSkgLT5cbiAgICAgIHJldHVybiBfcHJldkRhdGFbX3ByZXZIYXNoW2tleV1dXG5cbiAgICBtZS5hZGRlZFByZWQgPSAoYWRkZWQpIC0+XG4gICAgICBwcmVkSWR4ID0gX2hhc2hbX2tleShhZGRlZCldXG4gICAgICB3aGlsZSAhX2NvbW1vbltwcmVkSWR4XVxuICAgICAgICBpZiBwcmVkSWR4LS0gPCAwIHRoZW4gcmV0dXJuIF9maXJzdFxuICAgICAgcmV0dXJuIF9wcmV2RGF0YVtfcHJldkhhc2hbX2tleShfZGF0YVtwcmVkSWR4XSldXVxuXG4gICAgbWUuYWRkZWRQcmVkLmxlZnQgPSAoYWRkZWQpIC0+XG4gICAgICBtZS5hZGRlZFByZWQoYWRkZWQpLnhcblxuICAgIG1lLmFkZGVkUHJlZC5yaWdodCA9IChhZGRlZCkgLT5cbiAgICAgIG9iaiA9IG1lLmFkZGVkUHJlZChhZGRlZClcbiAgICAgIGlmIF8uaGFzKG9iaiwgJ3dpZHRoJykgdGhlbiBvYmoueCArIG9iai53aWR0aCBlbHNlIG9iai54XG5cbiAgICBtZS5kZWxldGVkU3VjYyA9IChkZWxldGVkKSAtPlxuICAgICAgc3VjY0lkeCA9IF9wcmV2SGFzaFtfa2V5KGRlbGV0ZWQpXVxuICAgICAgd2hpbGUgIV9wcmV2Q29tbW9uW3N1Y2NJZHhdXG4gICAgICAgIGlmIHN1Y2NJZHgrKyA+PSBfcHJldkRhdGEubGVuZ3RoIHRoZW4gcmV0dXJuIF9sYXN0XG4gICAgICByZXR1cm4gX2RhdGFbX2hhc2hbX2tleShfcHJldkRhdGFbc3VjY0lkeF0pXV1cblxuICAgIHJldHVybiBtZTtcblxuICBAbWVyZ2VTZXJpZXNTb3J0ZWQgPSAgKGFPbGQsIGFOZXcpICAtPlxuICAgIGlPbGQgPSAwXG4gICAgaU5ldyA9IDBcbiAgICBsT2xkTWF4ID0gYU9sZC5sZW5ndGggLSAxXG4gICAgbE5ld01heCA9IGFOZXcubGVuZ3RoIC0gMVxuICAgIGxNYXggPSBNYXRoLm1heChsT2xkTWF4LCBsTmV3TWF4KVxuICAgIHJlc3VsdCA9IFtdXG5cbiAgICB3aGlsZSBpT2xkIDw9IGxPbGRNYXggYW5kIGlOZXcgPD0gbE5ld01heFxuICAgICAgaWYgK2FPbGRbaU9sZF0gaXMgK2FOZXdbaU5ld11cbiAgICAgICAgcmVzdWx0LnB1c2goW2lPbGQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU9sZFtpT2xkXV0pO1xuICAgICAgICAjY29uc29sZS5sb2coJ3NhbWUnLCBhT2xkW2lPbGRdKTtcbiAgICAgICAgaU9sZCsrO1xuICAgICAgICBpTmV3Kys7XG4gICAgICBlbHNlIGlmICthT2xkW2lPbGRdIDwgK2FOZXdbaU5ld11cbiAgICAgICAgIyBhT2xkW2lPbGQgaXMgZGVsZXRlZFxuICAgICAgICByZXN1bHQucHVzaChbaU9sZCx1bmRlZmluZWQsIGFPbGRbaU9sZF1dKVxuICAgICAgICAjIGNvbnNvbGUubG9nKCdkZWxldGVkJywgYU9sZFtpT2xkXSk7XG4gICAgICAgIGlPbGQrK1xuICAgICAgZWxzZVxuICAgICAgICAjIGFOZXdbaU5ld10gaXMgYWRkZWRcbiAgICAgICAgcmVzdWx0LnB1c2goW3VuZGVmaW5lZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhTmV3W2lOZXddXSlcbiAgICAgICAgIyBjb25zb2xlLmxvZygnYWRkZWQnLCBhTmV3W2lOZXddKTtcbiAgICAgICAgaU5ldysrXG5cbiAgICB3aGlsZSBpT2xkIDw9IGxPbGRNYXhcbiAgICAgICMgaWYgdGhlcmUgaXMgbW9yZSBvbGQgaXRlbXMsIG1hcmsgdGhlbSBhcyBkZWxldGVkXG4gICAgICByZXN1bHQucHVzaChbaU9sZCx1bmRlZmluZWQsIGFPbGRbaU9sZF1dKTtcbiAgICAgICMgY29uc29sZS5sb2coJ2RlbGV0ZWQnLCBhT2xkW2lPbGRdKTtcbiAgICAgIGlPbGQrKztcblxuICAgIHdoaWxlIGlOZXcgPD0gbE5ld01heFxuICAgICAgIyBpZiB0aGVyZSBpcyBtb3JlIG5ldyBpdGVtcywgbWFyayB0aGVtIGFzIGFkZGVkXG4gICAgICByZXN1bHQucHVzaChbdW5kZWZpbmVkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFOZXdbaU5ld11dKTtcbiAgICAgICMgY29uc29sZS5sb2coJ2FkZGVkJywgYU5ld1tpTmV3XSk7XG4gICAgICBpTmV3Kys7XG5cbiAgICByZXR1cm4gcmVzdWx0XG5cbiAgQG1lcmdlU2VyaWVzVW5zb3J0ZWQgPSAoYU9sZCxhTmV3KSAtPlxuICAgIGlPbGQgPSAwXG4gICAgaU5ldyA9IDBcbiAgICBsT2xkTWF4ID0gYU9sZC5sZW5ndGggLSAxXG4gICAgbE5ld01heCA9IGFOZXcubGVuZ3RoIC0gMVxuICAgIGxNYXggPSBNYXRoLm1heChsT2xkTWF4LCBsTmV3TWF4KVxuICAgIHJlc3VsdCA9IFtdXG5cbiAgICB3aGlsZSBpT2xkIDw9IGxPbGRNYXggYW5kIGlOZXcgPD0gbE5ld01heFxuICAgICAgaWYgYU9sZFtpT2xkXSBpcyBhTmV3W2lOZXddXG4gICAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFPbGRbaU9sZF1dKTtcbiAgICAgICAgI2NvbnNvbGUubG9nKCdzYW1lJywgYU9sZFtpT2xkXSk7XG4gICAgICAgIGlPbGQrKztcbiAgICAgICAgaU5ldysrO1xuICAgICAgZWxzZSBpZiBhTmV3LmluZGV4T2YoYU9sZFtpT2xkXSkgPCAwXG4gICAgICAgICMgYU9sZFtpT2xkIGlzIGRlbGV0ZWRcbiAgICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSlcbiAgICAgICAgIyBjb25zb2xlLmxvZygnZGVsZXRlZCcsIGFPbGRbaU9sZF0pO1xuICAgICAgICBpT2xkKytcbiAgICAgIGVsc2VcbiAgICAgICAgIyBhTmV3W2lOZXddIGlzIGFkZGVkXG4gICAgICAgIHJlc3VsdC5wdXNoKFt1bmRlZmluZWQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU5ld1tpTmV3XV0pXG4gICAgICAgICMgY29uc29sZS5sb2coJ2FkZGVkJywgYU5ld1tpTmV3XSk7XG4gICAgICAgIGlOZXcrK1xuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4XG4gICAgICAjIGlmIHRoZXJlIGlzIG1vcmUgb2xkIGl0ZW1zLCBtYXJrIHRoZW0gYXMgZGVsZXRlZFxuICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdkZWxldGVkJywgYU9sZFtpT2xkXSk7XG4gICAgICBpT2xkKys7XG5cbiAgICB3aGlsZSBpTmV3IDw9IGxOZXdNYXhcbiAgICAgICMgaWYgdGhlcmUgaXMgbW9yZSBuZXcgaXRlbXMsIG1hcmsgdGhlbSBhcyBhZGRlZFxuICAgICAgcmVzdWx0LnB1c2goW3VuZGVmaW5lZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhTmV3W2lOZXddXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdhZGRlZCcsIGFOZXdbaU5ld10pO1xuICAgICAgaU5ldysrO1xuXG4gICAgcmV0dXJuIHJlc3VsdFxuXG4gIHJldHVybiBAXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=