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
      layout.lifeCycle().on('draw.brush', function(data) {
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
    require: ['^chart', '?^layout', '?x', '?y'],
    link: function(scope, element, attrs, controllers) {
      var axis, brusher, chart, layout, x, y, _brushGroup, _ref, _ref1, _ref2;
      chart = controllers[0].me;
      layout = (_ref = controllers[1]) != null ? _ref.me : void 0;
      x = (_ref1 = controllers[2]) != null ? _ref1.me : void 0;
      y = (_ref2 = controllers[3]) != null ? _ref2.me : void 0;
      axis = x || y;
      _brushGroup = void 0;
      brusher = function(extent) {
        var l, _i, _len, _ref3;
        timing.start("brusher" + (axis.id()));
        if (!axis) {
          return;
        }
        axis.domain(extent).scale().domain(extent);
        _ref3 = chart.layouts();
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          l = _ref3[_i];
          if (l.scales().hasScale(axis)) {
            l.lifeCycle().brush(axis, true);
          }
        }
        return timing.stop("brusher" + (axis.id()));
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
      return watcherRemoveFn = scope.$watch('data', dataWatchFn, deepWatch);
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
            value: _scaleList.y.formatValue(l[idx].y),
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
        var areaNew, areaOld, i, key, layer, layers, mergedX, newLast, oldLast, v, val, _i, _j, _layerKeys, _len, _len1;
        mergedX = utils.mergeSeries(x.value(_dataOld), x.value(data));
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
              v.yNew = _pathValuesOld[key][val[0]].y;
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
                v.yOld = _pathValuesNew[key][val[1]].y;
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
      brush = function(data, options, x, y, color) {
        var layers;
        layers = this.selectAll(".wk-chart-layer");
        return layers.select('.wk-chart-line').attr('d', function(d) {
          return areaBrush(d.value);
        });
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
      host.lifeCycle().on('draw', draw);
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
      var addedPred, area, brush, deletedSucc, draw, getLayerByKey, host, layerData, layerKeys, layerKeysOld, layers, layout, layoutNew, layoutOld, offs, offset, scaleY, stack, ttMoveData, ttMoveMarker, _circles, _id, _scaleList, _showMarkers, _tooltip, _ttHighlight;
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
      _id = 'area' + stackedAreaCntr++;
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
      layout = stack.values(function(d) {
        return d.layer;
      }).y(function(d) {
        return d.yy;
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
        layoutNew = layout(layerData);
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
      brush = function(data, options, x, y, color) {
        layers = this.selectAll(".wk-chart-layer");
        return layers.select('.wk-chart-area').attr('d', function(d) {
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
      host.lifeCycle().on('draw', draw);
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
      host.lifeCycle().on('draw', draw);
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

angular.module('wk.chart').directive('areaVertical', function($log) {
  var lineCntr;
  lineCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var draw, host, layerKeys, offset, ttMoveData, ttMoveMarker, _circles, _id, _layout, _scaleList, _showMarkers, _tooltip, _ttHighlight;
      host = controller.me;
      layerKeys = [];
      _layout = [];
      _tooltip = void 0;
      _ttHighlight = void 0;
      _circles = void 0;
      _scaleList = {};
      _showMarkers = false;
      offset = 0;
      _id = 'line' + lineCntr++;
      ttMoveData = function(idx) {
        var ttLayers;
        ttLayers = _layout.map(function(l) {
          return {
            name: l.key,
            value: _scaleList.x.formatValue(l.value[idx].x),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.y.axisLabel();
        this.headerValue = _scaleList.y.formatValue(_layout[0].value[idx].y);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        _circles = this.selectAll('circle').data(_layout, function(d) {
          return d.key;
        });
        _circles.enter().append('circle').attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d.color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cx', function(d) {
          return _scaleList.x.scale()(d.value[idx].x);
        });
        _circles.exit().remove();
        return this.attr('transform', "translate(0, " + (_scaleList.y.scale()(_layout[0].value[idx].y) + offset) + ")");
      };
      draw = function(data, options, x, y, color) {
        var area, layers;
        layerKeys = x.layerKeys(data);
        _layout = layerKeys.map((function(_this) {
          return function(key) {
            return {
              key: key,
              color: color.scale()(key),
              value: data.map(function(d) {
                return {
                  y: y.value(d),
                  x: x.layerValue(d, key),
                  data: d
                };
              })
            };
          };
        })(this));
        offset = y.isOrdinal() ? y.scale().rangeBand() / 2 : 0;
        if (_tooltip) {
          _tooltip.data(data);
        }
        area = d3.svg.area().x(function(d) {
          return options.width - y.scale()(d.y);
        }).y0(function(d) {
          return x.scale()(d.x);
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
        layers.select('.wk-chart-line').attr('transform', "translate(0," + (options.width + offset) + ")rotate(-90)").transition().duration(options.duration).attr('d', function(d) {
          return area(d.value);
        }).style('opacity', 0.7).style('pointer-events', 'none');
        return layers.exit().transition().duration(options.duration).style('opacity', 0).remove();
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('y').domainCalc('extent').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.y);
        _tooltip.on("enter." + _id, ttMoveData);
        _tooltip.on("moveData." + _id, ttMoveData);
        return _tooltip.on("moveMarker." + _id, ttMoveMarker);
      });
      host.lifeCycle().on('draw', draw);
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
      var barOuterPaddingOld, barPaddingOld, bars, config, draw, host, initial, ttEnter, _id, _merge, _scaleList, _selected, _tooltip;
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
        var barOuterPadding, barPadding, layout;
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
        bars.enter().append('rect').attr('class', 'wk-chart-bar wk-chart-selectable').attr('y', function(d) {
          if (initial) {
            return d.y;
          } else {
            return _merge.addedPred(d).y - barPaddingOld / 2;
          }
        }).attr('height', function(d) {
          if (initial) {
            return d.height;
          } else {
            return 0;
          }
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        bars.style('fill', function(d) {
          return d.color;
        }).transition().duration(options.duration).attr('x', function(d) {
          return Math.min(x.scale()(0), d.x);
        }).attr('height', function(d) {
          return d.height;
        }).attr('width', function(d) {
          return Math.abs(x.scale()(0) - d.x);
        }).attr('y', function(d) {
          return d.y;
        }).style('opacity', 1);
        bars.exit().transition().duration(options.duration).attr('y', function(d) {
          return _merge.deletedSucc(d).y + _merge.deletedSucc(d).height + barPadding / 2;
        }).attr('height', 0).remove();
        initial = false;
        barPaddingOld = barPadding;
        return barOuterPaddingOld = barOuterPadding;
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('x').domainCalc('max').resetOnNewData(true);
        this.getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('draw', draw);
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

angular.module('wk.chart').directive('barClustered', function($log, utils, barConfig) {
  var clusteredBarCntr;
  clusteredBarCntr = 0;
  return {
    restrict: 'A',
    require: '^layout',
    link: function(scope, element, attrs, controller) {
      var barOuterPaddingOld, barPaddingOld, config, draw, host, initial, layers, ttEnter, _id, _merge, _mergeLayers, _scaleList, _tooltip;
      host = controller.me;
      _id = "clusteredBar" + (clusteredBarCntr++);
      layers = null;
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
        var barOuterPadding, barPadding, bars, cluster, clusterY, layerKeys;
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
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('x').domainCalc('max').resetOnNewData(true);
        this.getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        this.layerScale('color');
        _tooltip = host.behavior().tooltip;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('draw', draw);
      host.lifeCycle().on('brushDraw', draw);
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
      var barOuterPaddingOld, barPaddingOld, config, draw, host, initial, layers, stack, ttEnter, _id, _merge, _mergeLayers, _scaleList, _selected, _tooltip;
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
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('x').domainCalc('total').resetOnNewData(true);
        this.getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        this.layerScale('color');
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('draw', draw);
      host.lifeCycle().on('brushDraw', draw);
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
      return layout.lifeCycle().on('draw', draw);
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
      var barOuterPaddingOld, barPaddingOld, columns, config, draw, host, initial, ttEnter, _id, _merge, _scaleList, _selected, _tooltip;
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
          columns = this.selectAll('.wk-chart-columns');
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
        enter = columns.enter().append('g').attr('class', 'wk-chart-columns wk-chart-selectable').attr('transform', function(d, i) {
          return "translate(" + (initial ? d.x : _merge.addedPred(d).x + _merge.addedPred(d).width + (i ? barPaddingOld / 2 : barOuterPaddingOld)) + "," + d.y + ") scale(" + (initial ? 1 : 0) + ",1)";
        });
        enter.append('rect').attr('height', function(d) {
          return d.height;
        }).attr('width', function(d) {
          return d.width;
        }).style('fill', function(d) {
          return d.color;
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        enter.append('text').attr('x', function(d) {
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
        }).transition().duration(options.duration).style('opacity', host.showLabels() ? 1 : 0);
        columns.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(" + (_merge.deletedSucc(d).x - barPadding / 2) + "," + d.y + ") scale(0,1)";
        }).remove();
        initial = false;
        barPaddingOld = barPadding;
        return barOuterPaddingOld = barOuterPadding;
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('y').domainCalc('max').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('draw', draw);
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
          host.showLabels(false);
        } else if (val === 'true' || val === "") {
          host.showLabels(true);
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
      var barOuterPaddingOld, barPaddingOld, config, draw, host, initial, layers, ttEnter, _id, _merge, _mergeLayers, _scaleList, _tooltip;
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
      config = barConfig;
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
        var barOuterPadding, barPadding, bars, cluster, clusterX, layerKeys;
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
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('y').domainCalc('max').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        this.layerScale('color');
        _tooltip = host.behavior().tooltip;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('draw', draw);
      host.lifeCycle().on('brushDraw', draw);
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
      var barOuterPaddingOld, barPaddingOld, config, draw, host, initial, layers, stack, ttEnter, _id, _merge, _mergeLayers, _scaleList, _selected, _tooltip;
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
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.getKind('y').domainCalc('total').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal');
        this.layerScale('color');
        _tooltip = host.behavior().tooltip;
        _selected = host.behavior().selected;
        return _tooltip.on("enter." + _id, ttEnter);
      });
      host.lifeCycle().on('draw', draw);
      host.lifeCycle().on('brushDraw', draw);
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
      return layout.lifeCycle().on('draw', draw);
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
      layout.lifeCycle().on('draw', draw);
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
      var buckets, config, draw, host, initial, labels, ttEnter, _id, _merge, _scaleList, _selected, _tooltip;
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
        this.headerName = _scaleList.rangeX.axisLabel();
        this.headerValue = _scaleList.y.axisLabel();
        return this.layers.push({
          name: _scaleList.color.formattedValue(data.data),
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
        enter = buckets.enter().append('g').attr('class', 'wk-chart-bucket wk-chart-selectable').attr('transform', function(d) {
          return "translate(" + (initial ? d.x : _merge.addedPred(d).x + _merge.addedPred(d).width) + "," + d.y + ") scale(" + (initial ? 1 : 0) + ",1)";
        });
        enter.append('rect').attr('height', function(d) {
          return d.height;
        }).attr('width', function(d) {
          return d.width;
        }).style('fill', function(d) {
          return d.color;
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        enter.append('text').attr('x', function(d) {
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
        }).transition().duration(options.duration).style('opacity', host.showLabels() ? 1 : 0);
        buckets.exit().transition().duration(options.duration).attr('transform', function(d) {
          return "translate(" + (_merge.deletedSucc(d).x) + "," + d.y + ") scale(0,1)";
        }).remove();
        return initial = false;
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
      host.lifeCycle().on('draw', draw);
      return attrs.$observe('labels', function(val) {
        if (val === 'false') {
          host.showLabels(false);
        } else if (val === 'true' || val === "") {
          host.showLabels(true);
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
      var brush, brushLine, draw, host, line, markers, offset, ttEnter, ttMoveData, ttMoveMarker, _circles, _dataOld, _id, _initialOpacity, _layerKeys, _layout, _pathArray, _pathValuesNew, _pathValuesOld, _scaleList, _showMarkers, _tooltip, _ttHighlight;
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
      brushLine = void 0;
      ttEnter = function(idx) {
        _pathArray = _.toArray(_pathValuesNew);
        return ttMoveData.apply(this, [idx]);
      };
      ttMoveData = function(idx) {
        var ttLayers;
        ttLayers = _pathArray.map(function(l) {
          return {
            name: l[idx].key,
            value: _scaleList.y.formatValue(l[idx].y),
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
        mergedX = utils.mergeSeries(x.value(_dataOld), x.value(data));
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
              v.yNew = _pathValuesOld[key][val[0]].y;
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
                v.yOld = _pathValuesNew[key][val[1]].y;
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
            m.enter().append('circle').attr('class', 'wk-chart-marker wk-chart-selectable').attr('r', 5).style('pointer-events', 'none').style('fill', function(d) {
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
        brushLine = d3.svg.line().x(function(d) {
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
      brush = function(data, options, x, y, color) {
        var layers;
        layers = this.selectAll(".wk-chart-line").attr('d', function(d) {
          return brushLine(d.value);
        });
        return layers.call(markers, 0);
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
      host.lifeCycle().on('draw', draw);
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

angular.module('wk.chart').directive('lineVertical', function($log) {
  var lineCntr;
  lineCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var draw, host, layerKeys, offset, prepData, setTooltip, ttEnter, ttMoveData, ttMoveMarker, _circles, _id, _layout, _scaleList, _showMarkers, _tooltip, _ttHighlight;
      host = controller.me;
      layerKeys = [];
      _layout = [];
      _tooltip = void 0;
      _ttHighlight = void 0;
      _circles = void 0;
      _showMarkers = false;
      _scaleList = {};
      offset = 0;
      _id = 'line' + lineCntr++;
      prepData = function(x, y, color) {};
      ttEnter = function(idx, axisX, cntnr) {
        var cntnrSel, cntnrWidth, parent;
        cntnrSel = d3.select(cntnr);
        cntnrWidth = cntnrSel.attr('width');
        parent = d3.select(cntnr.parentElement);
        _ttHighlight = parent.append('g');
        _ttHighlight.append('line').attr({
          x1: 0,
          x2: cntnrWidth
        }).style({
          'pointer-events': 'none',
          stroke: 'lightgrey',
          'stroke-width': 1
        });
        _circles = _ttHighlight.selectAll('circle').data(_layout, function(d) {
          return d.key;
        });
        _circles.enter().append('circle').attr('r', 5).attr('fill', function(d) {
          return d.color;
        }).attr('fill-opacity', 0.6).attr('stroke', 'black').style('pointer-events', 'none');
        return _ttHighlight.attr('transform', "translate(0," + (_scaleList.y.scale()(_layout[0].value[idx].y) + offset) + ")");
      };
      ttMoveData = function(idx) {
        var ttLayers;
        ttLayers = _layout.map(function(l) {
          return {
            name: l.key,
            value: _scaleList.x.formatValue(l.value[idx].x),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.y.axisLabel();
        this.headerValue = _scaleList.y.formatValue(_layout[0].value[idx].y);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        _circles = this.selectAll('circle').data(_layout, function(d) {
          return d.key;
        });
        _circles.enter().append('circle').attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d.color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cx', function(d) {
          return _scaleList.x.scale()(d.value[idx].x);
        });
        _circles.exit().remove();
        return this.attr('transform', "translate(0," + (_scaleList.y.scale()(_layout[0].value[idx].y) + offset) + ")");
      };
      setTooltip = function(tooltip, overlay) {
        _tooltip = tooltip;
        tooltip(overlay);
        tooltip.isHorizontal(true);
        tooltip.refreshOnMove(true);
        tooltip.on("move." + _id, ttMove);
        tooltip.on("enter." + _id, ttEnter);
        return tooltip.on("leave." + _id, ttLeave);
      };
      draw = function(data, options, x, y, color) {
        var layers, line;
        layerKeys = x.layerKeys(data);
        _layout = layerKeys.map((function(_this) {
          return function(key) {
            return {
              key: key,
              color: color.scale()(key),
              value: data.map(function(d) {
                return {
                  y: y.value(d),
                  x: x.layerValue(d, key)
                };
              })
            };
          };
        })(this));
        offset = y.isOrdinal() ? y.scale().rangeBand() / 2 : 0;
        if (_tooltip) {
          _tooltip.data(data);
        }
        line = d3.svg.line().x(function(d) {
          return x.scale()(d.x);
        }).y(function(d) {
          return y.scale()(d.y);
        });
        layers = this.selectAll(".wk-chart-layer").data(_layout, function(d) {
          return d.key;
        });
        layers.enter().append('g').attr('class', "wk-chart-layer").append('path').attr('class', 'wk-chart-line').style('stroke', function(d) {
          return d.color;
        }).style('opacity', 0).style('pointer-events', 'none');
        layers.select('.wk-chart-line').attr('transform', "translate(0," + offset + ")").transition().duration(options.duration).attr('d', function(d) {
          return line(d.value);
        }).style('opacity', 1).style('pointer-events', 'none');
        return layers.exit().transition().duration(options.duration).style('opacity', 0).remove();
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('y').domainCalc('extent').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.y);
        _tooltip.on("enter." + _id, ttMoveData);
        _tooltip.on("moveData." + _id, ttMoveData);
        return _tooltip.on("moveMarker." + _id, ttMoveMarker);
      });
      host.lifeCycle().on('draw', draw);
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
          labels = pieBox.selectAll('.wk-chart-label').data(segments, key);
          labels.enter().append('text').attr('class', 'wk-chart-label').each(function(d) {
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
          pieBox.selectAll('.wk-chart-label').remove();
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
      layout.lifeCycle().on('draw', draw);
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
      return layout.lifeCycle().on('draw', draw);
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
      return layout.lifeCycle().on('draw', draw);
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
      if (_brushX) {
        _boundsIdx = [me.x().invert(left), me.x().invert(right)];
        if (me.x().isOrdinal()) {
          _boundsValues = _data.map(function(d) {
            return me.x().value(d);
          }).slice(_boundsIdx[0], _boundsIdx[1] + 1);
        } else {
          _boundsValues = [me.x().value(_data[_boundsIdx[0]]), me.x().value(_data[_boundsIdx[1]])];
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
          _boundsValues = [me.y().value(_data[_boundsIdx[0]]), me.y().value(_data[_boundsIdx[1]])];
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
      return selectionSharing.setSelection(_boundsValues, _brushGroup);
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
      } else {
        value = d3.select(this).datum();
      }
      _templScope.ttShow = true;
      _templScope.ttData = value;
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
    var me, _allScales, _animationDuration, _behavior, _brush, _container, _data, _id, _layouts, _lifeCycle, _ownedScales, _showTooltip, _subTitle, _title, _toolTipTemplate;
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
    me.execLifeCycleFull = function(data, noAnimation) {
      if (data) {
        $log.log('executing full life cycle');
        _data = data;
        _lifeCycle.prepareData(data, noAnimation);
        _lifeCycle.scaleDomains(data, noAnimation);
        _lifeCycle.sizeContainer(data, noAnimation);
        _lifeCycle.drawAxis(noAnimation);
        return _lifeCycle.drawChart(data, noAnimation);
      }
    };
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
      var duration, gridLines, kind, ticks;
      duration = noAnimation ? 0 : _duration;
      kind = s.kind();
      ticks = s.isOrdinal() ? s.scale().range() : s.scale().ticks();
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
              return d;
            } else {
              return s.scale()(d);
            }
          },
          y2: function(d) {
            if (s.isOrdinal()) {
              return d;
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
              return d;
            } else {
              return s.scale()(d);
            }
          },
          x2: function(d) {
            if (s.isOrdinal()) {
              return d;
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
            s.range([0, _innerWidth]);
          } else if (k === 'y' || k === 'rangeY') {
            if (l.showLabels()) {
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
    _layoutLifeCycle = d3.dispatch('configure', 'draw', 'prepareData', 'brush', 'redraw', 'drawAxis', 'update', 'updateAttrs', 'brushDraw');
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
    me.showLabels = function(trueFalse) {
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
      _layoutLifeCycle.draw.apply(getDrawArea(), buildArgs(data, notAnimated));
      _layoutLifeCycle.on('redraw', me.redraw);
      _layoutLifeCycle.on('update', me.chart().lifeCycle().update);
      _layoutLifeCycle.on('drawAxis', me.chart().lifeCycle().drawAxis);
      _layoutLifeCycle.on('updateAttrs', me.chart().lifeCycle().updateAttrs);
      return _layoutLifeCycle.on('brush', function(axis, notAnimated) {
        _container.drawSingleAxis(axis);
        return _layoutLifeCycle.brushDraw.apply(getDrawArea(), buildArgs(_data, notAnimated));
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
      layout.lifeCycle().on("draw." + _id, me.draw);
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
  var callbacks, selection;
  selection = {};
  callbacks = {};
  this.createGroup = function(group) {};
  this.setSelection = function(selection, group) {
    var cb, _i, _len, _ref, _results;
    if (group) {
      selection[group] = selection;
      if (callbacks[group]) {
        _ref = callbacks[group];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          _results.push(cb(selection));
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
  this.mergeSeries = function(aOld, aNew) {
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
  return this;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3drLWNoYXJ0cy9hcHAvY29uZmlnL3drQ2hhcnRDb25zdGFudHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL1Jlc2l6ZVNlbnNvci5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoLmNvZmZlZSIsInRlbXBsYXRlcy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9kMy5nZW8uem9vbS5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL3NhdmVTdmdBc1BuZy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2NoYXJ0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2xheW91dC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2NvbnRhaW5lci9wcmludC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2NvbnRhaW5lci9zZWxlY3Rpb24uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9maWx0ZXJzL3R0Rm9ybWF0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhU3RhY2tlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYXJlYVN0YWNrZWRWZXJ0aWNhbC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYXJlYVZlcnRpY2FsLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9iYXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2JhckNsdXN0ZXJlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYmFyU3RhY2tlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYnViYmxlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9jb2x1bW4uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2NvbHVtbkNsdXN0ZXJlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvY29sdW1uU3RhY2tlZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvZ2F1Z2UuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2dlb01hcC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvaGlzdG9ncmFtLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9saW5lLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9saW5lVmVydGljYWwuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL3BpZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvc2NhdHRlci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvc3BpZGVyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9yQnJ1c2guY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JTZWxlY3QuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JUb29sdGlwLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9ycy5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9jaGFydC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9jb250YWluZXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvbGF5b3V0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2xlZ2VuZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9zY2FsZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9zY2FsZUxpc3QuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9wcm92aWRlcnMvbG9jYWxpemF0aW9uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvcHJvdmlkZXJzL3NjYWxlRXh0ZW50aW9uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL2NvbG9yLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3NjYWxlVXRpbHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2hhcGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2l6ZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy94LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3hSYW5nZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy95LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3lSYW5nZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NlcnZpY2VzL3NlbGVjdGlvblNoYXJpbmcuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zZXJ2aWNlcy90aW1lci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3V0aWwvbGF5ZXJEYXRhLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9zdmdJY29uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC91dGlsaXRpZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsVUFBZixFQUEyQixFQUEzQixDQUFBLENBQUE7O0FBQUEsT0FFTyxDQUFDLE1BQVIsQ0FBZSxVQUFmLENBQTBCLENBQUMsUUFBM0IsQ0FBb0MsaUJBQXBDLEVBQXVELENBQ3JELFNBRHFELEVBRXJELFlBRnFELEVBR3JELFlBSHFELEVBSXJELGFBSnFELEVBS3JELGFBTHFELENBQXZELENBRkEsQ0FBQTs7QUFBQSxPQVVPLENBQUMsTUFBUixDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxRQUEzQixDQUFvQyxnQkFBcEMsRUFBc0Q7QUFBQSxFQUNwRCxHQUFBLEVBQUss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SEEsQ0FERjtPQUFBLE1BS0ssSUFBRyxDQUFBLElBQU0sQ0FBQSxJQUFBLENBQU4sR0FBYyxDQUFBLElBQU0sQ0FBQSxJQUFBLENBQXZCO0FBRUgsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFNLE1BQU4sRUFBaUIsSUFBSyxDQUFBLElBQUEsQ0FBdEIsQ0FBWixDQUFBLENBQUE7QUFBQSxRQUVBLElBQUEsRUFGQSxDQUZHO09BQUEsTUFBQTtBQU9ILFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFDLE1BQUQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsRUFBYyxPQUFkLENBQVosRUFBbUMsSUFBSyxDQUFBLElBQUEsQ0FBeEMsQ0FBWixDQUFBLENBQUE7QUFBQSxRQUVBLElBQUEsRUFGQSxDQVBHO09BTlA7SUFBQSxDQVBBO0FBd0JBLFdBQU0sSUFBQSxJQUFRLE9BQWQsR0FBQTtBQUVFLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTSxNQUFOLEVBQWlCLElBQUssQ0FBQSxJQUFBLENBQXRCLENBQVosQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFBLEVBRkEsQ0FGRjtJQUFBLENBeEJBO0FBOEJBLFdBQU0sSUFBQSxJQUFRLE9BQWQsR0FBQTtBQUVFLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFDLE1BQUQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsRUFBYyxPQUFkLENBQVosRUFBbUMsSUFBSyxDQUFBLElBQUEsQ0FBeEMsQ0FBWixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUEsRUFGQSxDQUZGO0lBQUEsQ0E5QkE7QUFvQ0EsV0FBTyxNQUFQLENBckNjO0VBQUEsQ0FsSWhCLENBQUE7QUF5S0EsU0FBTyxJQUFQLENBN0swQztBQUFBLENBQTVDLENBQUEsQ0FBQSIsImZpbGUiOiJ3ay1jaGFydHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnLCBbXSlcblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2QzT3JkaW5hbFNjYWxlcycsIFtcbiAgJ29yZGluYWwnXG4gICdjYXRlZ29yeTEwJ1xuICAnY2F0ZWdvcnkyMCdcbiAgJ2NhdGVnb3J5MjBiJ1xuICAnY2F0ZWdvcnkyMGMnXG5dXG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM0NoYXJ0TWFyZ2lucycsIHtcbiAgdG9wOiAxMFxuICBsZWZ0OiA1MFxuICBib3R0b206IDQwXG4gIHJpZ2h0OiAyMFxuICB0b3BCb3R0b21NYXJnaW46e2F4aXM6MjUsIGxhYmVsOjE4fVxuICBsZWZ0UmlnaHRNYXJnaW46e2F4aXM6NDAsIGxhYmVsOjIwfVxuICBtaW5NYXJnaW46OFxuICBkZWZhdWx0OlxuICAgIHRvcDogOFxuICAgIGxlZnQ6OFxuICAgIGJvdHRvbTo4XG4gICAgcmlnaHQ6MTBcbiAgYXhpczpcbiAgICB0b3A6MjVcbiAgICBib3R0b206MjVcbiAgICBsZWZ0OjQwXG4gICAgcmlnaHQ6NDBcbiAgbGFiZWw6XG4gICAgdG9wOjE4XG4gICAgYm90dG9tOjE4XG4gICAgbGVmdDoyMFxuICAgIHJpZ2h0OjIwXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM1NoYXBlcycsIFtcbiAgJ2NpcmNsZScsXG4gICdjcm9zcycsXG4gICd0cmlhbmdsZS1kb3duJyxcbiAgJ3RyaWFuZ2xlLXVwJyxcbiAgJ3NxdWFyZScsXG4gICdkaWFtb25kJ1xuXVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnYXhpc0NvbmZpZycsIHtcbiAgbGFiZWxGb250U2l6ZTogJzEuNmVtJ1xuICB4OlxuICAgIGF4aXNQb3NpdGlvbnM6IFsndG9wJywgJ2JvdHRvbSddXG4gICAgYXhpc09mZnNldDoge2JvdHRvbTonaGVpZ2h0J31cbiAgICBheGlzUG9zaXRpb25EZWZhdWx0OiAnYm90dG9tJ1xuICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnXG4gICAgbWVhc3VyZTogJ3dpZHRoJ1xuICAgIGxhYmVsUG9zaXRpb25zOlsnb3V0c2lkZScsICdpbnNpZGUnXVxuICAgIGxhYmVsUG9zaXRpb25EZWZhdWx0OiAnb3V0c2lkZSdcbiAgICBsYWJlbE9mZnNldDpcbiAgICAgIHRvcDogJzFlbSdcbiAgICAgIGJvdHRvbTogJy0wLjhlbSdcbiAgeTpcbiAgICBheGlzUG9zaXRpb25zOiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgIGF4aXNPZmZzZXQ6IHtyaWdodDond2lkdGgnfVxuICAgIGF4aXNQb3NpdGlvbkRlZmF1bHQ6ICdsZWZ0J1xuICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJ1xuICAgIG1lYXN1cmU6ICdoZWlnaHQnXG4gICAgbGFiZWxQb3NpdGlvbnM6WydvdXRzaWRlJywgJ2luc2lkZSddXG4gICAgbGFiZWxQb3NpdGlvbkRlZmF1bHQ6ICdvdXRzaWRlJ1xuICAgIGxhYmVsT2Zmc2V0OlxuICAgICAgbGVmdDogJzEuMmVtJ1xuICAgICAgcmlnaHQ6ICcxLjJlbSdcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2QzQW5pbWF0aW9uJywge1xuICBkdXJhdGlvbjo1MDBcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ3RlbXBsYXRlRGlyJywgJ3RlbXBsYXRlcy8nXG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdmb3JtYXREZWZhdWx0cycsIHtcbiAgZGF0ZTogJyV4JyAjICclZC4lbS4lWSdcbiAgbnVtYmVyIDogICcsLjJmJ1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnYmFyQ29uZmlnJywge1xuICBwYWRkaW5nOiAwLjFcbiAgb3V0ZXJQYWRkaW5nOiAwXG59XG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IE1hcmMgSi4gU2NobWlkdC4gU2VlIHRoZSBMSUNFTlNFIGZpbGUgYXQgdGhlIHRvcC1sZXZlbFxuICogZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uIGFuZCBhdFxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmNqL2Nzcy1lbGVtZW50LXF1ZXJpZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5cbiAqL1xuO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBkaW1lbnNpb24gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W118RWxlbWVudHN8alF1ZXJ5fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHRoaXMuUmVzaXplU2Vuc29yID0gZnVuY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gRXZlbnRRdWV1ZSgpIHtcbiAgICAgICAgICAgIHRoaXMucSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHRoaXMucS5wdXNoKGV2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSB0aGlzLnEubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucVtpXS5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNpemVkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCByZXNpemVkKSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQgPSBuZXcgRXZlbnRRdWV1ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmNsYXNzTmFtZSA9ICd3ay1jaGFydC1yZXNpemUtc2Vuc29yJztcbiAgICAgICAgICAgIHZhciBzdHlsZSA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IHNjcm9sbDsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xuICAgICAgICAgICAgdmFyIHN0eWxlQ2hpbGQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7JztcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3ay1jaGFydC1yZXNpemUtc2Vuc29yLWV4cGFuZFwiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwid2stY2hhcnQtcmVzaXplLXNlbnNvci1zaHJpbmtcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJyB3aWR0aDogMjAwJTsgaGVpZ2h0OiAyMDAlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQucmVzaXplU2Vuc29yKTtcbiAgICAgICAgICAgIGlmICghe2ZpeGVkOiAxLCBhYnNvbHV0ZTogMX1bZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKV0pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBleHBhbmQgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGV4cGFuZENoaWxkID0gZXhwYW5kLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgc2hyaW5rID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmtDaGlsZCA9IHNocmluay5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGxhc3RXaWR0aCwgbGFzdEhlaWdodDtcbiAgICAgICAgICAgIHZhciByZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLndpZHRoID0gZXhwYW5kLm9mZnNldFdpZHRoICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLmhlaWdodCA9IGV4cGFuZC5vZmZzZXRIZWlnaHQgKyAxMCArICdweCc7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbExlZnQgPSBleHBhbmQuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbFRvcCA9IGV4cGFuZC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbExlZnQgPSBzaHJpbmsuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbFRvcCA9IHNocmluay5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGFzdFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBsYXN0SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuY2FsbCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBjYikge1xuICAgICAgICAgICAgICAgIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgbmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGRFdmVudChleHBhbmQsICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA+IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhZGRFdmVudChzaHJpbmssICdzY3JvbGwnLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoIDwgbGFzdFdpZHRoIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IDwgbGFzdEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJbb2JqZWN0IEFycmF5XVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZWxlbWVudClcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSAmJiBlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5KSAvL2pxdWVyeVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgRWxlbWVudHMgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnRzKSAvL21vb3Rvb2xzXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBpID0gMCwgaiA9IGVsZW1lbnQubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50W2ldLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnJ1c2gnLCAoJGxvZywgc2VsZWN0aW9uU2hhcmluZywgYmVoYXZpb3IpIC0+XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6IFsnXmNoYXJ0JywgJ15sYXlvdXQnLCAnP3gnLCAnP3knLCc/cmFuZ2VYJywgJz9yYW5nZVknXVxuICAgIHNjb3BlOlxuICAgICAgYnJ1c2hFeHRlbnQ6ICc9J1xuICAgICAgc2VsZWN0ZWRWYWx1ZXM6ICc9J1xuICAgICAgc2VsZWN0ZWREb21haW46ICc9J1xuICAgICAgY2hhbmdlOiAnJidcblxuICAgIGxpbms6KHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1sxXT8ubWVcbiAgICAgIHggPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIHkgPSBjb250cm9sbGVyc1szXT8ubWVcbiAgICAgIHJhbmdlWCA9IGNvbnRyb2xsZXJzWzRdPy5tZVxuICAgICAgcmFuZ2VZID0gY29udHJvbGxlcnNbNV0/Lm1lXG4gICAgICB4U2NhbGUgPSB1bmRlZmluZWRcbiAgICAgIHlTY2FsZSA9IHVuZGVmaW5lZFxuICAgICAgX3NlbGVjdGFibGVzID0gdW5kZWZpbmVkXG4gICAgICBfYnJ1c2hBcmVhU2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgICBfaXNBcmVhQnJ1c2ggPSBub3QgeCBhbmQgbm90IHlcbiAgICAgIF9icnVzaEdyb3VwID0gdW5kZWZpbmVkXG5cbiAgICAgIGJydXNoID0gY2hhcnQuYmVoYXZpb3IoKS5icnVzaFxuICAgICAgaWYgbm90IHggYW5kIG5vdCB5IGFuZCBub3QgcmFuZ2VYIGFuZCBub3QgcmFuZ2VZXG4gICAgICAgICNsYXlvdXQgYnJ1c2gsIGdldCB4IGFuZCB5IGZyb20gbGF5b3V0IHNjYWxlc1xuICAgICAgICBzY2FsZXMgPSBsYXlvdXQuc2NhbGVzKCkuZ2V0U2NhbGVzKFsneCcsICd5J10pXG4gICAgICAgIGJydXNoLngoc2NhbGVzLngpXG4gICAgICAgIGJydXNoLnkoc2NhbGVzLnkpXG4gICAgICBlbHNlXG4gICAgICAgIGJydXNoLngoeCBvciByYW5nZVgpXG4gICAgICAgIGJydXNoLnkoeSBvciByYW5nZVkpXG4gICAgICBicnVzaC5hY3RpdmUodHJ1ZSlcblxuICAgICAgYnJ1c2guZXZlbnRzKCkub24gJ2JydXNoJywgKGlkeFJhbmdlLCB2YWx1ZVJhbmdlLCBkb21haW4pIC0+XG4gICAgICAgIGlmIGF0dHJzLmJydXNoRXh0ZW50XG4gICAgICAgICAgc2NvcGUuYnJ1c2hFeHRlbnQgPSBpZHhSYW5nZVxuICAgICAgICBpZiBhdHRycy5zZWxlY3RlZFZhbHVlc1xuICAgICAgICAgIHNjb3BlLnNlbGVjdGVkVmFsdWVzID0gdmFsdWVSYW5nZVxuICAgICAgICBpZiBhdHRycy5zZWxlY3RlZERvbWFpblxuICAgICAgICAgIHNjb3BlLnNlbGVjdGVkRG9tYWluID0gZG9tYWluXG4gICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdy5icnVzaCcsIChkYXRhKSAtPlxuICAgICAgICBicnVzaC5kYXRhKGRhdGEpXG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2JydXNoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyh2YWwpIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIGJydXNoLmJydXNoR3JvdXAodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYnJ1c2guYnJ1c2hHcm91cCh1bmRlZmluZWQpXG4gIH0iLG51bGwsIi8vIENvcHlyaWdodCAoYykgMjAxMywgSmFzb24gRGF2aWVzLCBodHRwOi8vd3d3Lmphc29uZGF2aWVzLmNvbVxuLy8gU2VlIExJQ0VOU0UudHh0IGZvciBkZXRhaWxzLlxuKGZ1bmN0aW9uKCkge1xuXG52YXIgcmFkaWFucyA9IE1hdGguUEkgLyAxODAsXG4gICAgZGVncmVlcyA9IDE4MCAvIE1hdGguUEk7XG5cbi8vIFRPRE8gbWFrZSBpbmNyZW1lbnRhbCByb3RhdGUgb3B0aW9uYWxcblxuZDMuZ2VvLnpvb20gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByb2plY3Rpb24sXG4gICAgICB6b29tUG9pbnQsXG4gICAgICBldmVudCA9IGQzLmRpc3BhdGNoKFwiem9vbXN0YXJ0XCIsIFwiem9vbVwiLCBcInpvb21lbmRcIiksXG4gICAgICB6b29tID0gZDMuYmVoYXZpb3Iuem9vbSgpXG4gICAgICAgIC5vbihcInpvb21zdGFydFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbW91c2UwID0gZDMubW91c2UodGhpcyksXG4gICAgICAgICAgICAgIHJvdGF0ZSA9IHF1YXRlcm5pb25Gcm9tRXVsZXIocHJvamVjdGlvbi5yb3RhdGUoKSksXG4gICAgICAgICAgICAgIHBvaW50ID0gcG9zaXRpb24ocHJvamVjdGlvbiwgbW91c2UwKTtcbiAgICAgICAgICBpZiAocG9pbnQpIHpvb21Qb2ludCA9IHBvaW50O1xuXG4gICAgICAgICAgem9vbU9uLmNhbGwoem9vbSwgXCJ6b29tXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoZDMuZXZlbnQuc2NhbGUpO1xuICAgICAgICAgICAgICAgIHZhciBtb3VzZTEgPSBkMy5tb3VzZSh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYmV0d2VlbiA9IHJvdGF0ZUJldHdlZW4oem9vbVBvaW50LCBwb3NpdGlvbihwcm9qZWN0aW9uLCBtb3VzZTEpKTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnJvdGF0ZShldWxlckZyb21RdWF0ZXJuaW9uKHJvdGF0ZSA9IGJldHdlZW5cbiAgICAgICAgICAgICAgICAgICAgPyBtdWx0aXBseShyb3RhdGUsIGJldHdlZW4pXG4gICAgICAgICAgICAgICAgICAgIDogbXVsdGlwbHkoYmFuayhwcm9qZWN0aW9uLCBtb3VzZTAsIG1vdXNlMSksIHJvdGF0ZSkpKTtcbiAgICAgICAgICAgICAgICBtb3VzZTAgPSBtb3VzZTE7XG4gICAgICAgICAgICAgICAgZXZlbnQuem9vbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICBldmVudC56b29tc3RhcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwiem9vbWVuZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB6b29tT24uY2FsbCh6b29tLCBcInpvb21cIiwgbnVsbCk7XG4gICAgICAgICAgZXZlbnQuem9vbWVuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9KSxcbiAgICAgIHpvb21PbiA9IHpvb20ub247XG5cbiAgem9vbS5wcm9qZWN0aW9uID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gem9vbS5zY2FsZSgocHJvamVjdGlvbiA9IF8pLnNjYWxlKCkpIDogcHJvamVjdGlvbjtcbiAgfTtcblxuICByZXR1cm4gZDMucmViaW5kKHpvb20sIGV2ZW50LCBcIm9uXCIpO1xufTtcblxuZnVuY3Rpb24gYmFuayhwcm9qZWN0aW9uLCBwMCwgcDEpIHtcbiAgdmFyIHQgPSBwcm9qZWN0aW9uLnRyYW5zbGF0ZSgpLFxuICAgICAgYW5nbGUgPSBNYXRoLmF0YW4yKHAwWzFdIC0gdFsxXSwgcDBbMF0gLSB0WzBdKSAtIE1hdGguYXRhbjIocDFbMV0gLSB0WzFdLCBwMVswXSAtIHRbMF0pO1xuICByZXR1cm4gW01hdGguY29zKGFuZ2xlIC8gMiksIDAsIDAsIE1hdGguc2luKGFuZ2xlIC8gMildO1xufVxuXG5mdW5jdGlvbiBwb3NpdGlvbihwcm9qZWN0aW9uLCBwb2ludCkge1xuICB2YXIgdCA9IHByb2plY3Rpb24udHJhbnNsYXRlKCksXG4gICAgICBzcGhlcmljYWwgPSBwcm9qZWN0aW9uLmludmVydChwb2ludCk7XG4gIHJldHVybiBzcGhlcmljYWwgJiYgaXNGaW5pdGUoc3BoZXJpY2FsWzBdKSAmJiBpc0Zpbml0ZShzcGhlcmljYWxbMV0pICYmIGNhcnRlc2lhbihzcGhlcmljYWwpO1xufVxuXG5mdW5jdGlvbiBxdWF0ZXJuaW9uRnJvbUV1bGVyKGV1bGVyKSB7XG4gIHZhciDOuyA9IC41ICogZXVsZXJbMF0gKiByYWRpYW5zLFxuICAgICAgz4YgPSAuNSAqIGV1bGVyWzFdICogcmFkaWFucyxcbiAgICAgIM6zID0gLjUgKiBldWxlclsyXSAqIHJhZGlhbnMsXG4gICAgICBzaW7OuyA9IE1hdGguc2luKM67KSwgY29zzrsgPSBNYXRoLmNvcyjOuyksXG4gICAgICBzaW7PhiA9IE1hdGguc2luKM+GKSwgY29zz4YgPSBNYXRoLmNvcyjPhiksXG4gICAgICBzaW7OsyA9IE1hdGguc2luKM6zKSwgY29zzrMgPSBNYXRoLmNvcyjOsyk7XG4gIHJldHVybiBbXG4gICAgY29zzrsgKiBjb3PPhiAqIGNvc86zICsgc2luzrsgKiBzaW7PhiAqIHNpbs6zLFxuICAgIHNpbs67ICogY29zz4YgKiBjb3POsyAtIGNvc867ICogc2luz4YgKiBzaW7OsyxcbiAgICBjb3POuyAqIHNpbs+GICogY29zzrMgKyBzaW7OuyAqIGNvc8+GICogc2luzrMsXG4gICAgY29zzrsgKiBjb3PPhiAqIHNpbs6zIC0gc2luzrsgKiBzaW7PhiAqIGNvc86zXG4gIF07XG59XG5cbmZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXSxcbiAgICAgIGIwID0gYlswXSwgYjEgPSBiWzFdLCBiMiA9IGJbMl0sIGIzID0gYlszXTtcbiAgcmV0dXJuIFtcbiAgICBhMCAqIGIwIC0gYTEgKiBiMSAtIGEyICogYjIgLSBhMyAqIGIzLFxuICAgIGEwICogYjEgKyBhMSAqIGIwICsgYTIgKiBiMyAtIGEzICogYjIsXG4gICAgYTAgKiBiMiAtIGExICogYjMgKyBhMiAqIGIwICsgYTMgKiBiMSxcbiAgICBhMCAqIGIzICsgYTEgKiBiMiAtIGEyICogYjEgKyBhMyAqIGIwXG4gIF07XG59XG5cbmZ1bmN0aW9uIHJvdGF0ZUJldHdlZW4oYSwgYikge1xuICBpZiAoIWEgfHwgIWIpIHJldHVybjtcbiAgdmFyIGF4aXMgPSBjcm9zcyhhLCBiKSxcbiAgICAgIG5vcm0gPSBNYXRoLnNxcnQoZG90KGF4aXMsIGF4aXMpKSxcbiAgICAgIGhhbGbOsyA9IC41ICogTWF0aC5hY29zKE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBkb3QoYSwgYikpKSksXG4gICAgICBrID0gTWF0aC5zaW4oaGFsZs6zKSAvIG5vcm07XG4gIHJldHVybiBub3JtICYmIFtNYXRoLmNvcyhoYWxmzrMpLCBheGlzWzJdICogaywgLWF4aXNbMV0gKiBrLCBheGlzWzBdICoga107XG59XG5cbmZ1bmN0aW9uIGV1bGVyRnJvbVF1YXRlcm5pb24ocSkge1xuICByZXR1cm4gW1xuICAgIE1hdGguYXRhbjIoMiAqIChxWzBdICogcVsxXSArIHFbMl0gKiBxWzNdKSwgMSAtIDIgKiAocVsxXSAqIHFbMV0gKyBxWzJdICogcVsyXSkpICogZGVncmVlcyxcbiAgICBNYXRoLmFzaW4oTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIDIgKiAocVswXSAqIHFbMl0gLSBxWzNdICogcVsxXSkpKSkgKiBkZWdyZWVzLFxuICAgIE1hdGguYXRhbjIoMiAqIChxWzBdICogcVszXSArIHFbMV0gKiBxWzJdKSwgMSAtIDIgKiAocVsyXSAqIHFbMl0gKyBxWzNdICogcVszXSkpICogZGVncmVlc1xuICBdO1xufVxuXG5mdW5jdGlvbiBjYXJ0ZXNpYW4oc3BoZXJpY2FsKSB7XG4gIHZhciDOuyA9IHNwaGVyaWNhbFswXSAqIHJhZGlhbnMsXG4gICAgICDPhiA9IHNwaGVyaWNhbFsxXSAqIHJhZGlhbnMsXG4gICAgICBjb3PPhiA9IE1hdGguY29zKM+GKTtcbiAgcmV0dXJuIFtcbiAgICBjb3PPhiAqIE1hdGguY29zKM67KSxcbiAgICBjb3PPhiAqIE1hdGguc2luKM67KSxcbiAgICBNYXRoLnNpbijPhilcbiAgXTtcbn1cblxuZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBhLmxlbmd0aCwgcyA9IDA7IGkgPCBuOyArK2kpIHMgKz0gYVtpXSAqIGJbaV07XG4gIHJldHVybiBzO1xufVxuXG5mdW5jdGlvbiBjcm9zcyhhLCBiKSB7XG4gIHJldHVybiBbXG4gICAgYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSxcbiAgICBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdLFxuICAgIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF1cbiAgXTtcbn1cblxufSkoKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnJ1c2hlZCcsICgkbG9nLHNlbGVjdGlvblNoYXJpbmcsIHRpbWluZykgLT5cbiAgc0JydXNoQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiBbJ15jaGFydCcsICc/XmxheW91dCcsICc/eCcsICc/eSddXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1sxXT8ubWVcbiAgICAgIHggPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIHkgPSBjb250cm9sbGVyc1szXT8ubWVcblxuICAgICAgYXhpcyA9IHggb3IgeVxuICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgYnJ1c2hlciA9IChleHRlbnQpIC0+XG4gICAgICAgIHRpbWluZy5zdGFydChcImJydXNoZXIje2F4aXMuaWQoKX1cIilcbiAgICAgICAgaWYgbm90IGF4aXMgdGhlbiByZXR1cm5cbiAgICAgICAgI2F4aXNcbiAgICAgICAgYXhpcy5kb21haW4oZXh0ZW50KS5zY2FsZSgpLmRvbWFpbihleHRlbnQpXG4gICAgICAgIGZvciBsIGluIGNoYXJ0LmxheW91dHMoKSB3aGVuIGwuc2NhbGVzKCkuaGFzU2NhbGUoYXhpcykgI25lZWQgdG8gZG8gaXQgdGhpcyB3YXkgdG8gZW5zdXJlIHRoZSByaWdodCBheGlzIGlzIGNob3NlbiBpbiBjYXNlIG9mIHNldmVyYWwgbGF5b3V0cyBpbiBhIGNvbnRhaW5lclxuICAgICAgICAgIGwubGlmZUN5Y2xlKCkuYnJ1c2goYXhpcywgdHJ1ZSkgI25vIGFuaW1hdGlvblxuICAgICAgICB0aW1pbmcuc3RvcChcImJydXNoZXIje2F4aXMuaWQoKX1cIilcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2JydXNoZWQnLCAodmFsKSAtPlxuICAgICAgICBpZiBfLmlzU3RyaW5nKHZhbCkgYW5kIHZhbC5sZW5ndGggPiAwXG4gICAgICAgICAgX2JydXNoR3JvdXAgPSB2YWxcbiAgICAgICAgICBzZWxlY3Rpb25TaGFyaW5nLnJlZ2lzdGVyIF9icnVzaEdyb3VwLCBicnVzaGVyXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYnJ1c2hHcm91cCA9IHVuZGVmaW5lZFxuXG4gICAgICBzY29wZS4kb24gJyRkZXN0cm95JywgKCkgLT5cbiAgICAgICAgc2VsZWN0aW9uU2hhcmluZy51bnJlZ2lzdGVyIF9icnVzaEdyb3VwLCBicnVzaGVyXG5cbiAgfSIsIihmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcblxuICAgIHZhciBkb2N0eXBlID0gJzw/eG1sIHZlcnNpb249XCIxLjBcIiBzdGFuZGFsb25lPVwibm9cIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgXCItLy9XM0MvL0RURCBTVkcgMS4xLy9FTlwiIFwiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkXCI+JztcblxuICAgIGZ1bmN0aW9uIGlubGluZUltYWdlcyhjYWxsYmFjaykge1xuICAgICAgICB2YXIgaW1hZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc3ZnIGltYWdlJyk7XG4gICAgICAgIHZhciBsZWZ0ID0gaW1hZ2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlZnQgPT0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgKGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGltYWdlLmdldEF0dHJpYnV0ZSgneGxpbms6aHJlZicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBocmVmID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCd4bGluazpocmVmJykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICgvXmh0dHAvLnRlc3QoaHJlZikgJiYgIShuZXcgUmVnRXhwKCdeJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0KS50ZXN0KGhyZWYpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJlbmRlciBlbWJlZGRlZCBpbWFnZXMgbGlua2luZyB0byBleHRlcm5hbCBob3N0cy5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IGltYWdlLmdldEF0dHJpYnV0ZSgneGxpbms6aHJlZicpO1xuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gaW1nLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xuICAgICAgICAgICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnLCBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQtLTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKGltYWdlc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHlsZXMoZG9tKSB7XG4gICAgICAgIHZhciBjc3MgPSBcIlwiO1xuICAgICAgICB2YXIgc2hlZXRzID0gZG9jdW1lbnQuc3R5bGVTaGVldHM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2hlZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcnVsZXMgPSBzaGVldHNbaV0uY3NzUnVsZXM7XG4gICAgICAgICAgICBpZiAocnVsZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcnVsZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bGUgPSBydWxlc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZihydWxlLnN0eWxlKSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3MgKz0gcnVsZS5zZWxlY3RvclRleHQgKyBcIiB7IFwiICsgcnVsZS5zdHlsZS5jc3NUZXh0ICsgXCIgfVxcblwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICBzLmlubmVySFRNTCA9IFwiPCFbQ0RBVEFbXFxuXCIgKyBjc3MgKyBcIlxcbl1dPlwiO1xuXG4gICAgICAgIHZhciBkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGVmcycpO1xuICAgICAgICBkZWZzLmFwcGVuZENoaWxkKHMpO1xuICAgICAgICByZXR1cm4gZGVmcztcbiAgICB9XG5cbiAgICBvdXQkLnN2Z0FzRGF0YVVyaSA9IGZ1bmN0aW9uKGVsLCBzY2FsZUZhY3RvciwgY2IpIHtcbiAgICAgICAgc2NhbGVGYWN0b3IgPSBzY2FsZUZhY3RvciB8fCAxO1xuXG4gICAgICAgIGlubGluZUltYWdlcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBvdXRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB2YXIgY2xvbmUgPSBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBwYXJzZUludChcbiAgICAgICAgICAgICAgICBjbG9uZS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJylcbiAgICAgICAgICAgICAgICB8fCBjbG9uZS5zdHlsZS53aWR0aFxuICAgICAgICAgICAgICAgIHx8IG91dCQuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBwYXJzZUludChcbiAgICAgICAgICAgICAgICBjbG9uZS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpXG4gICAgICAgICAgICAgICAgfHwgY2xvbmUuc3R5bGUuaGVpZ2h0XG4gICAgICAgICAgICAgICAgfHwgb3V0JC5nZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdmFyIHhtbG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiO1xuXG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGUoXCJ2ZXJzaW9uXCIsIFwiMS4xXCIpO1xuICAgICAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlTlMoeG1sbnMsIFwieG1sbnNcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiKTtcbiAgICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZU5TKHhtbG5zLCBcInhtbG5zOnhsaW5rXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiKTtcbiAgICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIHdpZHRoICogc2NhbGVGYWN0b3IpO1xuICAgICAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIGhlaWdodCAqIHNjYWxlRmFjdG9yKTtcbiAgICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShcInZpZXdCb3hcIiwgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcbiAgICAgICAgICAgIG91dGVyLmFwcGVuZENoaWxkKGNsb25lKTtcblxuICAgICAgICAgICAgY2xvbmUuaW5zZXJ0QmVmb3JlKHN0eWxlcyhjbG9uZSksIGNsb25lLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgICAgICB2YXIgc3ZnID0gZG9jdHlwZSArIG91dGVyLmlubmVySFRNTDtcbiAgICAgICAgICAgIHZhciB1cmkgPSAnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICsgd2luZG93LmJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN2ZykpKTtcbiAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgIGNiKHVyaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG91dCQuc2F2ZVN2Z0FzUG5nID0gZnVuY3Rpb24oZWwsIG5hbWUsIHNjYWxlRmFjdG9yKSB7XG4gICAgICAgIG91dCQuc3ZnQXNEYXRhVXJpKGVsLCBzY2FsZUZhY3RvciwgZnVuY3Rpb24odXJpKSB7XG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHVyaTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSBpbWFnZS53aWR0aDtcbiAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDApO1xuXG4gICAgICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgYS5kb3dubG9hZCA9IG5hbWU7XG4gICAgICAgICAgICAgICAgYS5ocmVmID0gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjaGFydCcsICgkbG9nLCBjaGFydCwgJGZpbHRlcikgLT5cbiAgY2hhcnRDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6ICdjaGFydCdcbiAgICBzY29wZTpcbiAgICAgIGRhdGE6ICc9J1xuICAgICAgZmlsdGVyOiAnPSdcbiAgICBjb250cm9sbGVyOiAoKSAtPlxuICAgICAgdGhpcy5tZSA9IGNoYXJ0KClcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgZGVlcFdhdGNoID0gZmFsc2VcbiAgICAgIHdhdGNoZXJSZW1vdmVGbiA9IHVuZGVmaW5lZFxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgICAgX2ZpbHRlciA9IHVuZGVmaW5lZFxuXG4gICAgICBtZS5jb250YWluZXIoKS5lbGVtZW50KGVsZW1lbnRbMF0pXG5cbiAgICAgIG1lLmxpZmVDeWNsZSgpLmNvbmZpZ3VyZSgpXG5cbiAgICAgIG1lLmxpZmVDeWNsZSgpLm9uICdzY29wZUFwcGx5JywgKCkgLT5cbiAgICAgICAgc2NvcGUuJGFwcGx5KClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3Rvb2x0aXBzJywgKHZhbCkgLT5cbiAgICAgICAgbWUudG9vbFRpcFRlbXBsYXRlKCcnKVxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWQgYW5kICh2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJylcbiAgICAgICAgICBtZS5zaG93VG9vbHRpcCh0cnVlKVxuICAgICAgICBlbHNlIGlmIHZhbC5sZW5ndGggPiAwIGFuZCB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgbWUudG9vbFRpcFRlbXBsYXRlKHZhbClcbiAgICAgICAgICBtZS5zaG93VG9vbHRpcCh0cnVlKVxuICAgICAgICBlbHNlIHNob3dUb29sVGlwKGZhbHNlKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYW5pbWF0aW9uRHVyYXRpb24nLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgYW5kIF8uaXNOdW1iZXIoK3ZhbCkgYW5kICt2YWwgPj0gMFxuICAgICAgICAgIG1lLmFuaW1hdGlvbkR1cmF0aW9uKHZhbClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3RpdGxlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgbWUudGl0bGUodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUudGl0bGUodW5kZWZpbmVkKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnc3VidGl0bGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBtZS5zdWJUaXRsZSh2YWwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS5zdWJUaXRsZSh1bmRlZmluZWQpXG5cbiAgICAgIHNjb3BlLiR3YXRjaCAnZmlsdGVyJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgX2ZpbHRlciA9IHZhbCAjIHNjb3BlLiRldmFsKHZhbClcbiAgICAgICAgICBpZiBfZGF0YVxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YSgkZmlsdGVyKCdmaWx0ZXInKShfZGF0YSwgX2ZpbHRlcikpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfZmlsdGVyID0gdW5kZWZpbmVkXG4gICAgICAgICAgaWYgX2RhdGFcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEoX2RhdGEpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkZWVwV2F0Y2gnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWQgYW5kIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICBkZWVwV2F0Y2ggPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWVwV2F0Y2ggPSBmYWxzZVxuICAgICAgICBpZiB3YXRjaGVyUmVtb3ZlRm5cbiAgICAgICAgICB3YXRjaGVyUmVtb3ZlRm4oKVxuICAgICAgICB3YXRjaGVyUmVtb3ZlRm4gPSBzY29wZS4kd2F0Y2ggJ2RhdGEnLCBkYXRhV2F0Y2hGbiwgZGVlcFdhdGNoXG5cbiAgICAgIGRhdGFXYXRjaEZuID0gKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgICBpZiBfLmlzQXJyYXkoX2RhdGEpIGFuZCBfZGF0YS5sZW5ndGggaXMgMCB0aGVuIHJldHVyblxuICAgICAgICAgIGlmIF9maWx0ZXJcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEoJGZpbHRlcignZmlsdGVyJykodmFsLCBfZmlsdGVyKSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKHZhbClcblxuICAgICAgd2F0Y2hlclJlbW92ZUZuID0gc2NvcGUuJHdhdGNoICdkYXRhJywgZGF0YVdhdGNoRm4sIGRlZXBXYXRjaFxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsYXlvdXQnLCAoJGxvZywgbGF5b3V0LCBjb250YWluZXIpIC0+XG4gIGxheW91dENudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJ1xuICAgIHJlcXVpcmU6IFsnbGF5b3V0JywnXmNoYXJ0J11cblxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBsYXlvdXQoKVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuXG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBtZS5jaGFydChjaGFydClcblxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgbGF5b3V0IGlkOicsIG1lLmlkKCksICdjaGFydDonLCBjaGFydC5pZCgpXG4gICAgICBjaGFydC5hZGRMYXlvdXQobWUpXG4gICAgICBjaGFydC5jb250YWluZXIoKS5hZGRMYXlvdXQobWUpXG4gICAgICBtZS5jb250YWluZXIoY2hhcnQuY29udGFpbmVyKCkpXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncHJpbnRCdXR0b24nLCAoJGxvZykgLT5cblxuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6J2NoYXJ0J1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICBsaW5rOihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgZHJhdyA9ICgpIC0+XG4gICAgICAgIF9jb250YWluZXJEaXYgPSBkMy5zZWxlY3QoY2hhcnQuY29udGFpbmVyKCkuZWxlbWVudCgpKS5zZWxlY3QoJ2Rpdi53ay1jaGFydCcpXG4gICAgICAgIF9jb250YWluZXJEaXYuYXBwZW5kKCdidXR0b24nKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LXByaW50LWJ1dHRvbicpXG4gICAgICAgICAgLnN0eWxlKHtwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6MCwgcmlnaHQ6MH0pXG4gICAgICAgICAgLnRleHQoJ1ByaW50JylcbiAgICAgICAgICAub24gJ2NsaWNrJywgKCktPlxuICAgICAgICAgICAgJGxvZy5sb2cgJ0NsaWNrZWQgUHJpbnQgQnV0dG9uJ1xuXG4gICAgICAgICAgICBzdmcgID0gX2NvbnRhaW5lckRpdi5zZWxlY3QoJ3N2Zy53ay1jaGFydCcpLm5vZGUoKVxuICAgICAgICAgICAgc2F2ZVN2Z0FzUG5nKHN2ZywgJ3ByaW50LnBuZycsNSlcblxuXG4gICAgICBjaGFydC5saWZlQ3ljbGUoKS5vbiAnZHJhd0NoYXJ0LnByaW50JywgZHJhd1xuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzZWxlY3Rpb24nLCAoJGxvZykgLT5cbiAgb2JqSWQgPSAwXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgc2NvcGU6XG4gICAgICBzZWxlY3RlZERvbWFpbjogJz0nXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlLnNlbGVjdGlvbicsIC0+XG5cbiAgICAgICAgX3NlbGVjdGlvbiA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF9zZWxlY3Rpb24uYWN0aXZlKHRydWUpXG4gICAgICAgIF9zZWxlY3Rpb24ub24gJ3NlbGVjdGVkJywgKHNlbGVjdGVkT2JqZWN0cykgLT5cbiAgICAgICAgICBzY29wZS5zZWxlY3RlZERvbWFpbiA9IHNlbGVjdGVkT2JqZWN0c1xuICAgICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZpbHRlciAndHRGb3JtYXQnLCAoJGxvZyxmb3JtYXREZWZhdWx0cykgLT5cbiAgcmV0dXJuICh2YWx1ZSwgZm9ybWF0KSAtPlxuICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnb2JqZWN0JyBhbmQgdmFsdWUuZ2V0VVRDRGF0ZVxuICAgICAgZGYgPSBkMy50aW1lLmZvcm1hdChmb3JtYXREZWZhdWx0cy5kYXRlKVxuICAgICAgcmV0dXJuIGRmKHZhbHVlKVxuICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJyBvciBub3QgaXNOYU4oK3ZhbHVlKVxuICAgICAgZGYgPSBkMy5mb3JtYXQoZm9ybWF0RGVmYXVsdHMubnVtYmVyKVxuICAgICAgcmV0dXJuIGRmKCt2YWx1ZSlcbiAgICByZXR1cm4gdmFsdWUiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWEnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF9kYXRhT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzTmV3ID0gW11cbiAgICAgIF9wYXRoQXJyYXkgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIF9pZCA9ICdsaW5lJyArIGxpbmVDbnRyKytcbiAgICAgIGFyZWEgPSB1bmRlZmluZWRcbiAgICAgIGFyZWFCcnVzaCA9IHVuZGVmaW5lZFxuXG4gICAgICAjLS0tIFRvb2x0aXAgaGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRFbnRlciA9IChpZHgpIC0+XG4gICAgICAgIF9wYXRoQXJyYXkgPSBfLnRvQXJyYXkoX3BhdGhWYWx1ZXNOZXcpXG4gICAgICAgIHR0TW92ZURhdGEuYXBwbHkodGhpcywgW2lkeF0pXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IF9wYXRoQXJyYXkubWFwKChsKSAtPiB7bmFtZTpsW2lkeF0ua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobFtpZHhdLnkpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsW2lkeF0uY29sb3J9LCB4djpsW2lkeF0ueHZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueHYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbaWR4XS5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGRbaWR4XS5jb2xvcilcbiAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeScsIChkKSAtPiBkW2lkeF0ueSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfc2NhbGVMaXN0Lnguc2NhbGUoKShfcGF0aEFycmF5WzBdW2lkeF0ueHYpICsgb2Zmc2V0fSlcIilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgICAgbWVyZ2VkWCA9IHV0aWxzLm1lcmdlU2VyaWVzKHgudmFsdWUoX2RhdGFPbGQpLCB4LnZhbHVlKGRhdGEpKVxuICAgICAgICBfbGF5ZXJLZXlzID0geS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgX2xheW91dCA9IFtdXG5cbiAgICAgICAgX3BhdGhWYWx1ZXNOZXcgPSB7fVxuXG4gICAgICAgIGZvciBrZXkgaW4gX2xheWVyS2V5c1xuICAgICAgICAgIF9wYXRoVmFsdWVzTmV3W2tleV0gPSBkYXRhLm1hcCgoZCktPiB7eDp4Lm1hcChkKSx5Onkuc2NhbGUoKSh5LmxheWVyVmFsdWUoZCwga2V5KSksIHh2OngudmFsdWUoZCksIHl2OnkubGF5ZXJWYWx1ZShkLGtleSksIGtleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgZGF0YTpkfSlcblxuICAgICAgICAgIGxheWVyID0ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6W119XG4gICAgICAgICAgIyBmaW5kIHN0YXJ0aW5nIHZhbHVlIGZvciBvbGRcbiAgICAgICAgICBpID0gMFxuICAgICAgICAgIHdoaWxlIGkgPCBtZXJnZWRYLmxlbmd0aFxuICAgICAgICAgICAgaWYgbWVyZ2VkWFtpXVswXSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICBvbGRMYXN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVttZXJnZWRYW2ldWzBdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3TGFzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bbWVyZ2VkWFtpXVsxXV1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgZm9yIHZhbCwgaSBpbiBtZXJnZWRYXG4gICAgICAgICAgICB2ID0ge2NvbG9yOmxheWVyLmNvbG9yLCB4OnZhbFsyXX1cbiAgICAgICAgICAgICMgc2V0IHggYW5kIHkgdmFsdWVzIGZvciBvbGQgdmFsdWVzLiBJZiB0aGVyZSBpcyBhIGFkZGVkIHZhbHVlLCBtYWludGFpbiB0aGUgbGFzdCB2YWxpZCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgdmFsWzFdIGlzIHVuZGVmaW5lZCAjaWUgYW4gb2xkIHZhbHVlIGlzIGRlbGV0ZWQsIG1haW50YWluIHRoZSBsYXN0IG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LnlOZXcgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdMYXN0LnggIyBhbmltYXRlIHRvIHRoZSBwcmVkZXNlc3NvcnMgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IHRydWVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdi55TmV3ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnhcbiAgICAgICAgICAgICAgbmV3TGFzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXVxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiBfZGF0YU9sZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgIGlmICB2YWxbMF0gaXMgdW5kZWZpbmVkICMgaWUgYSBuZXcgdmFsdWUgaGFzIGJlZW4gYWRkZWRcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV0ueVxuICAgICAgICAgICAgICAgIHYueE9sZCA9IG9sZExhc3QueCAjIHN0YXJ0IHgtYW5pbWF0aW9uIGZyb20gdGhlIHByZWRlY2Vzc29ycyBvbGQgcG9zaXRpb25cbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHYueU9sZCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS55XG4gICAgICAgICAgICAgICAgdi54T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnhcbiAgICAgICAgICAgICAgICBvbGRMYXN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueE9sZCA9IHYueE5ld1xuICAgICAgICAgICAgICB2LnlPbGQgPSB2LnlOZXdcblxuXG4gICAgICAgICAgICBsYXllci52YWx1ZS5wdXNoKHYpXG5cbiAgICAgICAgICBfbGF5b3V0LnB1c2gobGF5ZXIpXG5cbiAgICAgICAgI2xheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgICNfbGF5b3V0ID0gbGF5ZXJLZXlzLm1hcCgoa2V5KSA9PiB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpkYXRhLm1hcCgoZCktPiB7eDp4LnZhbHVlKGQpLHk6eS5sYXllclZhbHVlKGQsIGtleSksIGRhdGE6ZH0pfSlcblxuICAgICAgICBvZmZzZXQgPSBpZiB4LmlzT3JkaW5hbCgpIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBhcmVhT2xkID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAgIC54KChkKSAtPiAgZC54T2xkKVxuICAgICAgICAgIC55MCgoZCkgLT4gIGQueU9sZClcbiAgICAgICAgICAueTEoKGQpIC0+ICB5LnNjYWxlKCkoMCkpXG5cbiAgICAgICAgYXJlYU5ldyA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIGQueE5ldylcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnlOZXcpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeS5zY2FsZSgpKDApKVxuXG4gICAgICAgIGFyZWFCcnVzaCA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55MCgoZCkgLT4gIGQueU5ldylcbiAgICAgICAgICAueTEoKGQpIC0+ICB5LnNjYWxlKCkoMCkpXG5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zyb20nLCBcInRyYW5zbGF0ZSgje29mZnNldH0pXCIpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5zZWxlY3QoJy53ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhT2xkKGQudmFsdWUpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWFOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIF9kYXRhT2xkID0gZGF0YVxuICAgICAgICBfcGF0aFZhbHVlc09sZCA9IF9wYXRoVmFsdWVzTmV3XG5cbiAgICAgIGJydXNoID0gKGRhdGEsIG9wdGlvbnMseCx5LGNvbG9yKSAtPlxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYUJydXNoKGQudmFsdWUpKVxuXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LngpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWFTdGFja2VkJywgKCRsb2csIHV0aWxzKSAtPlxuICBzdGFja2VkQXJlYUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKClcbiAgICAgIG9mZnNldCA9ICd6ZXJvJ1xuICAgICAgbGF5ZXJzID0gbnVsbFxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBsYXllckRhdGEgPSBbXVxuICAgICAgbGF5b3V0TmV3ID0gW11cbiAgICAgIGxheW91dE9sZCA9IFtdXG4gICAgICBsYXllcktleXNPbGQgPSBbXVxuICAgICAgYXJlYSA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlZFN1Y2MgPSB7fVxuICAgICAgYWRkZWRQcmVkID0ge31cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIHNjYWxlWSA9IHVuZGVmaW5lZFxuICAgICAgb2ZmcyA9IDBcbiAgICAgIF9pZCA9ICdhcmVhJyArIHN0YWNrZWRBcmVhQ250cisrXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBsYXllckRhdGEubWFwKChsKSAtPiB7bmFtZTpsLmtleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGwubGF5ZXJbaWR4XS55eSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsYXllckRhdGFbMF0ubGF5ZXJbaWR4XS54KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKGxheWVyRGF0YSwgKGQpIC0+IGQua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeScsIChkKSAtPiBzY2FsZVkoZC5sYXllcltpZHhdLnkgKyBkLmxheWVyW2lkeF0ueTApKVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X3NjYWxlTGlzdC54LnNjYWxlKCkobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueCkrb2Zmc30pXCIpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGdldExheWVyQnlLZXkgPSAoa2V5LCBsYXlvdXQpIC0+XG4gICAgICAgIGZvciBsIGluIGxheW91dFxuICAgICAgICAgIGlmIGwua2V5IGlzIGtleVxuICAgICAgICAgICAgcmV0dXJuIGxcblxuICAgICAgbGF5b3V0ID0gc3RhY2sudmFsdWVzKChkKS0+ZC5sYXllcikueSgoZCkgLT4gZC55eSlcblxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyMjXG4gICAgICBwcmVwRGF0YSA9ICh4LHksY29sb3IpIC0+XG5cbiAgICAgICAgbGF5b3V0T2xkID0gbGF5b3V0TmV3Lm1hcCgoZCkgLT4ge2tleTogZC5rZXksIHBhdGg6IGFyZWEoZC5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkgKyBwLnkwfSkpfSlcbiAgICAgICAgbGF5ZXJLZXlzT2xkID0gbGF5ZXJLZXlzXG5cbiAgICAgICAgbGF5ZXJLZXlzID0geS5sYXllcktleXMoQClcbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IEBtYXAoKGQpIC0+IHt4OiB4LnZhbHVlKGQpLCB5eTogK3kubGF5ZXJWYWx1ZShkLGspLCB5MDogMH0pfSkgIyB5eTogbmVlZCB0byBhdm9pZCBvdmVyd3JpdGluZyBieSBsYXlvdXQgY2FsYyAtPiBzZWUgc3RhY2sgeSBhY2Nlc3NvclxuICAgICAgICAjbGF5b3V0TmV3ID0gbGF5b3V0KGxheWVyRGF0YSlcblxuICAgICAgICBkZWxldGVkU3VjYyA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzT2xkLCBsYXllcktleXMsIDEpXG4gICAgICAgIGFkZGVkUHJlZCA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzLCBsYXllcktleXNPbGQsIC0xKVxuICAgICAgIyMjXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgIyRsb2cubG9nIFwicmVuZGVyaW5nIEFyZWEgQ2hhcnRcIlxuXG5cbiAgICAgICAgbGF5ZXJLZXlzID0geS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgZGVsZXRlZFN1Y2MgPSB1dGlscy5kaWZmKGxheWVyS2V5c09sZCwgbGF5ZXJLZXlzLCAxKVxuICAgICAgICBhZGRlZFByZWQgPSB1dGlscy5kaWZmKGxheWVyS2V5cywgbGF5ZXJLZXlzT2xkLCAtMSlcblxuICAgICAgICBsYXllckRhdGEgPSBsYXllcktleXMubWFwKChrKSA9PiB7a2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBsYXllcjogZGF0YS5tYXAoKGQpIC0+IHt4OiB4LnZhbHVlKGQpLCB5eTogK3kubGF5ZXJWYWx1ZShkLGspLCB5MDogMCwgZGF0YTpkfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgIGxheW91dE5ldyA9IGxheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgb2ZmcyA9IGlmIHguaXNPcmRpbmFsKCkgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBpZiBvZmZzZXQgaXMgJ2V4cGFuZCdcbiAgICAgICAgICBzY2FsZVkgPSB5LnNjYWxlKCkuY29weSgpXG4gICAgICAgICAgc2NhbGVZLmRvbWFpbihbMCwgMV0pXG4gICAgICAgIGVsc2Ugc2NhbGVZID0geS5zY2FsZSgpXG5cbiAgICAgICAgYXJlYSA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55MCgoZCkgLT4gIHNjYWxlWShkLnkwICsgZC55KSlcbiAgICAgICAgICAueTEoKGQpIC0+ICBzY2FsZVkoZC55MCkpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEobGF5b3V0TmV3LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgaWYgbGF5b3V0T2xkLmxlbmd0aCBpcyAwXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSkuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBpZiBhZGRlZFByZWRbZC5rZXldIHRoZW4gZ2V0TGF5ZXJCeUtleShhZGRlZFByZWRbZC5rZXldLCBsYXlvdXRPbGQpLnBhdGggZWxzZSBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiAge3g6IHAueCwgeTogMCwgeTA6IDB9KSkpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29mZnN9KVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC5sYXllcikpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG5cblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBzdWNjID0gZGVsZXRlZFN1Y2NbZC5rZXldXG4gICAgICAgICAgICBpZiBzdWNjIHRoZW4gYXJlYShnZXRMYXllckJ5S2V5KHN1Y2MsIGxheW91dE5ldykubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55MH0pKSBlbHNlIGFyZWEobGF5b3V0TmV3W2xheW91dE5ldy5sZW5ndGggLSAxXS5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkwICsgcC55fSkpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICBicnVzaCA9IChkYXRhLCBvcHRpb25zLHgseSxjb2xvcikgLT5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWFyZWEnKVxuICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQubGF5ZXIpKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LngpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2FyZWFTdGFja2VkJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGluIFsnemVybycsICdzaWxob3VldHRlJywgJ2V4cGFuZCcsICd3aWdnbGUnXVxuICAgICAgICAgIG9mZnNldCA9IHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgb2Zmc2V0ID0gXCJ6ZXJvXCJcbiAgICAgICAgc3RhY2sub2Zmc2V0KG9mZnNldClcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZW50ZXIgLyBleGl0IGFuaW1hdGlvbnMgbGlrZSBpbiBsaW5lXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYXJlYVN0YWNrZWRWZXJ0aWNhbCcsICgkbG9nLCB1dGlscykgLT5cbiAgYXJlYVN0YWNrZWRWZXJ0Q250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKVxuICAgICAgb2Zmc2V0ID0gJ3plcm8nXG4gICAgICBsYXllcnMgPSBudWxsXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgbGF5ZXJLZXlzID0gW11cbiAgICAgIGxheWVyRGF0YSA9IFtdXG4gICAgICBsYXlvdXROZXcgPSBbXVxuICAgICAgbGF5b3V0T2xkID0gW11cbiAgICAgIGxheWVyS2V5c09sZCA9IFtdXG4gICAgICBhcmVhID0gdW5kZWZpbmVkXG4gICAgICBkZWxldGVkU3VjYyA9IHt9XG4gICAgICBhZGRlZFByZWQgPSB7fVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgc2NhbGVYID0gdW5kZWZpbmVkXG4gICAgICBvZmZzID0gMFxuICAgICAgX2lkID0gJ2FyZWEtc3RhY2tlZC12ZXJ0JyArIGFyZWFTdGFja2VkVmVydENudHIrK1xuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gbGF5ZXJEYXRhLm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsLmxheWVyW2lkeF0ueHgpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEobGF5ZXJEYXRhLCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N4JywgKGQpIC0+IHNjYWxlWChkLmxheWVyW2lkeF0ueSArIGQubGF5ZXJbaWR4XS55MCkpICAjIHdlaXJkISEhIGhvd2V2ZXIsIHRoZSBkYXRhIGlzIGZvciBhIGhvcml6b250YWwgY2hhcnQgd2hpY2ggZ2V0cyB0cmFuc2Zvcm1lZFxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tfc2NhbGVMaXN0Lnkuc2NhbGUoKShsYXllckRhdGFbMF0ubGF5ZXJbaWR4XS55eSkrb2Zmc30pXCIpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGdldExheWVyQnlLZXkgPSAoa2V5LCBsYXlvdXQpIC0+XG4gICAgICAgIGZvciBsIGluIGxheW91dFxuICAgICAgICAgIGlmIGwua2V5IGlzIGtleVxuICAgICAgICAgICAgcmV0dXJuIGxcblxuICAgICAgbGF5b3V0ID0gc3RhY2sudmFsdWVzKChkKS0+ZC5sYXllcikueSgoZCkgLT4gZC54eClcblxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyMjXG4gICAgICBwcmVwRGF0YSA9ICh4LHksY29sb3IpIC0+XG5cbiAgICAgICAgbGF5b3V0T2xkID0gbGF5b3V0TmV3Lm1hcCgoZCkgLT4ge2tleTogZC5rZXksIHBhdGg6IGFyZWEoZC5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkgKyBwLnkwfSkpfSlcbiAgICAgICAgbGF5ZXJLZXlzT2xkID0gbGF5ZXJLZXlzXG5cbiAgICAgICAgbGF5ZXJLZXlzID0geS5sYXllcktleXMoQClcbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IEBtYXAoKGQpIC0+IHt4OiB4LnZhbHVlKGQpLCB5eTogK3kubGF5ZXJWYWx1ZShkLGspLCB5MDogMH0pfSkgIyB5eTogbmVlZCB0byBhdm9pZCBvdmVyd3JpdGluZyBieSBsYXlvdXQgY2FsYyAtPiBzZWUgc3RhY2sgeSBhY2Nlc3NvclxuICAgICAgICAjbGF5b3V0TmV3ID0gbGF5b3V0KGxheWVyRGF0YSlcblxuICAgICAgICBkZWxldGVkU3VjYyA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzT2xkLCBsYXllcktleXMsIDEpXG4gICAgICAgIGFkZGVkUHJlZCA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzLCBsYXllcktleXNPbGQsIC0xKVxuICAgICAgIyMjXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgIyRsb2cubG9nIFwicmVuZGVyaW5nIEFyZWEgQ2hhcnRcIlxuXG5cbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcbiAgICAgICAgZGVsZXRlZFN1Y2MgPSB1dGlscy5kaWZmKGxheWVyS2V5c09sZCwgbGF5ZXJLZXlzLCAxKVxuICAgICAgICBhZGRlZFByZWQgPSB1dGlscy5kaWZmKGxheWVyS2V5cywgbGF5ZXJLZXlzT2xkLCAtMSlcblxuICAgICAgICBsYXllckRhdGEgPSBsYXllcktleXMubWFwKChrKSA9PiB7a2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBsYXllcjogZGF0YS5tYXAoKGQpIC0+IHt5eTogeS52YWx1ZShkKSwgeHg6ICt4LmxheWVyVmFsdWUoZCxrKSwgeTA6IDAsIGRhdGE6ZH0pfSkgIyB5eTogbmVlZCB0byBhdm9pZCBvdmVyd3JpdGluZyBieSBsYXlvdXQgY2FsYyAtPiBzZWUgc3RhY2sgeSBhY2Nlc3NvclxuICAgICAgICBsYXlvdXROZXcgPSBsYXlvdXQobGF5ZXJEYXRhKVxuXG4gICAgICAgIG9mZnMgPSBpZiB5LmlzT3JkaW5hbCgpIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC1sYXllcicpXG5cbiAgICAgICAgaWYgb2Zmc2V0IGlzICdleHBhbmQnXG4gICAgICAgICAgc2NhbGVYID0geC5zY2FsZSgpLmNvcHkoKVxuICAgICAgICAgIHNjYWxlWC5kb21haW4oWzAsIDFdKVxuICAgICAgICBlbHNlIHNjYWxlWCA9IHguc2NhbGUoKVxuXG4gICAgICAgIGFyZWEgPSBkMy5zdmcuYXJlYSgpXG4gICAgICAgICAgLngoKGQpIC0+ICB5LnNjYWxlKCkoZC55eSkpXG4gICAgICAgICAgLnkwKChkKSAtPiAgc2NhbGVYKGQueTAgKyBkLnkpKVxuICAgICAgICAgIC55MSgoZCkgLT4gIHNjYWxlWChkLnkwKSlcblxuICAgICAgICBsYXllcnMgPSBsYXllcnNcbiAgICAgICAgICAuZGF0YShsYXlvdXROZXcsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBpZiBsYXlvdXRPbGQubGVuZ3RoIGlzIDBcbiAgICAgICAgICBsYXllcnMuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKS5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGlmIGFkZGVkUHJlZFtkLmtleV0gdGhlbiBnZXRMYXllckJ5S2V5KGFkZGVkUHJlZFtkLmtleV0sIGxheW91dE9sZCkucGF0aCBlbHNlIGFyZWEoZC5sYXllci5tYXAoKHApIC0+ICB7eXk6IHAueXksIHk6IDAsIHkwOiAwfSkpKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJyb3RhdGUoOTApIHNjYWxlKDEsLTEpXCIpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYShkLmxheWVyKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcblxuXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIHN1Y2MgPSBkZWxldGVkU3VjY1tkLmtleV1cbiAgICAgICAgICAgIGlmIHN1Y2MgdGhlbiBhcmVhKGdldExheWVyQnlLZXkoc3VjYywgbGF5b3V0TmV3KS5sYXllci5tYXAoKHApIC0+IHt5eTogcC55eSwgeTogMCwgeTA6IHAueTB9KSkgZWxzZSBhcmVhKGxheW91dE5ld1tsYXlvdXROZXcubGVuZ3RoIC0gMV0ubGF5ZXIubWFwKChwKSAtPiB7eXk6IHAueXksIHk6IDAsIHkwOiBwLnkwICsgcC55fSkpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eXk6IHAueXksIHk6IDAsIHkwOiBwLnkgKyBwLnkwfSkpfSlcbiAgICAgICAgbGF5ZXJLZXlzT2xkID0gbGF5ZXJLZXlzXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueSlcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXJlYVN0YWNrZWRWZXJ0aWNhbCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpbiBbJ3plcm8nLCAnc2lsaG91ZXR0ZScsICdleHBhbmQnLCAnd2lnZ2xlJ11cbiAgICAgICAgICBvZmZzZXQgPSB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9mZnNldCA9IFwiemVyb1wiXG4gICAgICAgIHN0YWNrLm9mZnNldChvZmZzZXQpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGVudGVyIC8gZXhpdCBhbmltYXRpb25zIGxpa2UgaW4gbGluZVxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWFWZXJ0aWNhbCcsICgkbG9nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgX2xheW91dCA9IFtdXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgb2Zmc2V0ID0gMFxuICAgICAgX2lkID0gJ2xpbmUnICsgbGluZUNudHIrK1xuXG4gICAgICAjLS0tIFRvb2x0aXAgaGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX2xheW91dC5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobC52YWx1ZVtpZHhdLngpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKCdjaXJjbGUnKS5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3gnLCAoZCkgLT4gX3NjYWxlTGlzdC54LnNjYWxlKCkoZC52YWx1ZVtpZHhdLngpKVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCAje19zY2FsZUxpc3QueS5zY2FsZSgpKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KSArIG9mZnNldH0pXCIpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt5OnkudmFsdWUoZCkseDp4LmxheWVyVmFsdWUoZCwga2V5KSwgZGF0YTpkfSl9KVxuXG4gICAgICAgIG9mZnNldCA9IGlmIHkuaXNPcmRpbmFsKCkgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGFyZWEgPSBkMy5zdmcuYXJlYSgpICAgICMgdHJpY2t5LiBEcmF3IHRoaXMgbGlrZSBhIHZlcnRpY2FsIGNoYXJ0IGFuZCB0aGVuIHJvdGF0ZSBhbmQgcG9zaXRpb24gaXQuXG4gICAgICAgIC54KChkKSAtPiBvcHRpb25zLndpZHRoIC0geS5zY2FsZSgpKGQueSkpXG4gICAgICAgIC55MCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAueTEoKGQpIC0+ICB4LnNjYWxlKCkoMCkpXG5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tvcHRpb25zLndpZHRoICsgb2Zmc2V0fSlyb3RhdGUoLTkwKVwiKSAjcm90YXRlIGFuZCBwb3NpdGlvbiBjaGFydFxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQudmFsdWUpKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LnkpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGVudGVyIC8gZXhpdCBhbmltYXRpb25zIGxpa2UgaW4gbGluZVxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JhcnMnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZyktPlxuICBzQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgcmVzdHJpY3Q6ICdBJ1xuICByZXF1aXJlOiAnXmxheW91dCdcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICBfaWQgPSBcImJhcnMje3NCYXJDbnRyKyt9XCJcblxuICAgIGJhcnMgPSBudWxsXG4gICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG4gICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG5cbiAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKVxuICAgIF9tZXJnZShbXSkua2V5KChkKSAtPiBkLmtleSlcblxuICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcblxuICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC54LmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgaWYgbm90IGJhcnNcbiAgICAgICAgYmFycyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1iYXJzJylcbiAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBzdGFja2VkLWJhclwiXG5cbiAgICAgIGJhclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCkgLT4ge2tleTp5LnZhbHVlKGQpLCB4OngubWFwKGQpLCB5OnkubWFwKGQpLCBjb2xvcjpjb2xvci5tYXAoZCksIGhlaWdodDp5LnNjYWxlKCkucmFuZ2VCYW5kKHkudmFsdWUoZCkpLCBkYXRhOmR9KVxuXG4gICAgICBfbWVyZ2UobGF5b3V0KS5maXJzdCh7eTpvcHRpb25zLmhlaWdodCArIGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nfSkubGFzdCh7eTowLCBoZWlnaHQ6YmFyT3V0ZXJQYWRkaW5nT2xkIC0gYmFyUGFkZGluZ09sZCAvIDJ9KSAgI3kuc2NhbGUoKS5yYW5nZSgpW3kuc2NhbGUoKS5yYW5nZSgpLmxlbmd0aC0xXVxuXG4gICAgICBiYXJzID0gYmFycy5kYXRhKGxheW91dCwgKGQpIC0+IGQua2V5KVxuXG4gICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLmhlaWdodCBlbHNlIDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cigneCcsIChkKSAtPiBNYXRoLm1pbih4LnNjYWxlKCkoMCksIGQueCkpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBNYXRoLmFicyh4LnNjYWxlKCkoMCkgLSBkLngpKVxuICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLnkpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gX21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDIpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAucmVtb3ZlKClcblxuICAgICAgaW5pdGlhbCA9IGZhbHNlXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cblxuICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgX3NjYWxlTGlzdC55LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JhckNsdXN0ZXJlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG5cbiAgY2x1c3RlcmVkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJjbHVzdGVyZWRCYXIje2NsdXN0ZXJlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQubGF5ZXJLZXkpXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG4gICAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmluZm8gXCJyZW5kZXJpbmcgY2x1c3RlcmVkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICAjIG1hcCBkYXRhIHRvIHRoZSByaWdodCBmb3JtYXQgZm9yIHJlbmRlcmluZ1xuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIGNsdXN0ZXJZID0gZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbih4LmxheWVyS2V5cyhkYXRhKSkucmFuZ2VCYW5kcyhbMCwgeS5zY2FsZSgpLnJhbmdlQmFuZCgpXSwgMCwgMClcblxuICAgICAgICBjbHVzdGVyID0gZGF0YS5tYXAoKGQpIC0+IGwgPSB7XG4gICAgICAgICAga2V5OnkudmFsdWUoZCksIGRhdGE6ZCwgeTp5Lm1hcChkKSwgaGVpZ2h0OiB5LnNjYWxlKCkucmFuZ2VCYW5kKHkudmFsdWUoZCkpXG4gICAgICAgICAgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7bGF5ZXJLZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGtleTp5LnZhbHVlKGQpLCB2YWx1ZTogZFtrXSwgeTpjbHVzdGVyWShrKSwgeDogeC5zY2FsZSgpKGRba10pLCB3aWR0aDp4LnNjYWxlKCkoZFtrXSksIGhlaWdodDpjbHVzdGVyWS5yYW5nZUJhbmQoayl9KX1cbiAgICAgICAgKVxuXG4gICAgICAgIF9tZXJnZShjbHVzdGVyKS5maXJzdCh7eTpvcHRpb25zLmhlaWdodCArIGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nLCBoZWlnaHQ6eS5zY2FsZSgpLnJhbmdlQmFuZCgpfSkubGFzdCh7eTowLCBoZWlnaHQ6YmFyT3V0ZXJQYWRkaW5nT2xkIC0gYmFyUGFkZGluZ09sZCAvIDJ9KVxuICAgICAgICBfbWVyZ2VMYXllcnMoY2x1c3RlclswXS5sYXllcnMpLmZpcnN0KHt5OjAsIGhlaWdodDowfSkubGFzdCh7eTpjbHVzdGVyWzBdLmhlaWdodCwgaGVpZ2h0OjB9KVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVycy5kYXRhKGNsdXN0ZXIsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYXllcicpLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT5cbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgIFwidHJhbnNsYXRlKDAsICN7aWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyfSkgc2NhbGUoMSwje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0pXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7ZC55fSkgc2NhbGUoMSwxKVwiKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsICN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDJ9KSBzY2FsZSgxLDApXCIpXG4gICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBiYXJzID0gbGF5ZXJzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgLmRhdGEoXG4gICAgICAgICAgICAoZCkgLT4gZC5sYXllcnNcbiAgICAgICAgICAsIChkKSAtPiBkLmxheWVyS2V5ICsgJ3wnICsgZC5rZXlcbiAgICAgICAgICApXG5cbiAgICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC55IGVsc2UgX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkKS55ICsgX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkKS5oZWlnaHQpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC5oZWlnaHQgZWxzZSAwKVxuICAgICAgICAgIC5hdHRyKCd4JywgeC5zY2FsZSgpKDApKVxuXG5cbiAgICAgICAgYmFycy5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5zY2FsZSgpKGQubGF5ZXJLZXkpKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLnkpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gTWF0aC5taW4oeC5zY2FsZSgpKDApLCBkLngpKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gTWF0aC5hYnMoZC5oZWlnaHQpKVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgIy5hdHRyKCd3aWR0aCcsMClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQpLnkpXG4gICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd4JykuZG9tYWluQ2FsYygnbWF4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdcblxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICAgIF9zY2FsZUxpc3QueS5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JhclN0YWNrZWQnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZykgLT5cblxuICBzdGFja2VkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBTdGFja2VkIGJhcidcblxuICAgICAgX2lkID0gXCJzdGFja2VkQ29sdW1uI3tzdGFja2VkQmFyQ250cisrfVwiXG5cbiAgICAgIGxheWVycyA9IG51bGxcblxuICAgICAgc3RhY2sgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSAoKS0+XG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgIyRsb2cuZGVidWcgXCJkcmF3aW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgc3RhY2sgPSBbXVxuICAgICAgICBmb3IgZCBpbiBkYXRhXG4gICAgICAgICAgeDAgPSAwXG4gICAgICAgICAgbCA9IHtrZXk6eS52YWx1ZShkKSwgbGF5ZXJzOltdLCBkYXRhOmQsIHk6eS5tYXAoZCksIGhlaWdodDppZiB5LnNjYWxlKCkucmFuZ2VCYW5kIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIGVsc2UgMX1cbiAgICAgICAgICBpZiBsLnkgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgIGwubGF5ZXJzID0gbGF5ZXJLZXlzLm1hcCgoaykgLT5cbiAgICAgICAgICAgICAgbGF5ZXIgPSB7bGF5ZXJLZXk6aywga2V5Omwua2V5LCB2YWx1ZTpkW2tdLCB3aWR0aDogeC5zY2FsZSgpKCtkW2tdKSwgaGVpZ2h0OiAoaWYgeS5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDEpLCB4OiB4LnNjYWxlKCkoK3gwKSwgY29sb3I6IGNvbG9yLnNjYWxlKCkoayl9XG4gICAgICAgICAgICAgIHgwICs9ICtkW2tdXG4gICAgICAgICAgICAgIHJldHVybiBsYXllclxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgc3RhY2sucHVzaChsKVxuXG4gICAgICAgIF9tZXJnZShzdGFjaykuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgaGVpZ2h0OjB9KS5sYXN0KHt5OjAsIGhlaWdodDpiYXJPdXRlclBhZGRpbmdPbGQgLSBiYXJQYWRkaW5nT2xkIC8gMn0pXG4gICAgICAgIF9tZXJnZUxheWVycyhsYXllcktleXMpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEoc3RhY2ssIChkKS0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKS5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7aWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyfSkgc2NhbGUoMSwje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0pXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JyxpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IHJldHVybiBcInRyYW5zbGF0ZSgwLCAje2QueX0pIHNjYWxlKDEsMSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueSArIF9tZXJnZS5kZWxldGVkU3VjYyhkKS5oZWlnaHQgKyBiYXJQYWRkaW5nIC8gMn0pIHNjYWxlKDEsMClcIilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBiYXJzID0gbGF5ZXJzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgLmRhdGEoXG4gICAgICAgICAgICAoZCkgLT4gZC5sYXllcnNcbiAgICAgICAgICAsIChkKSAtPiBkLmxheWVyS2V5ICsgJ3wnICsgZC5rZXlcbiAgICAgICAgICApXG5cbiAgICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPlxuICAgICAgICAgICAgaWYgX21lcmdlLnByZXYoZC5rZXkpXG4gICAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5hZGRlZFByZWQoZC5sYXllcktleSkpXG4gICAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLnByZXYoZC5rZXkpLmxheWVyc1tpZHhdLnggKyBfbWVyZ2UucHJldihkLmtleSkubGF5ZXJzW2lkeF0ud2lkdGggZWxzZSB4LnNjYWxlKCkoMClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZC54XG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBpZiBfbWVyZ2UucHJldihkLmtleSkgdGhlbiAwIGVsc2UgZC53aWR0aClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLngpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT5cbiAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkLmxheWVyS2V5KSlcbiAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tpZHhdLnggZWxzZSBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2xheWVyS2V5cy5sZW5ndGggLSAxXS54ICsgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ud2lkdGhcbiAgICAgICAgICApXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd4JykuZG9tYWluQ2FsYygndG90YWwnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdcblxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICAgIF9zY2FsZUxpc3QueS5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2J1YmJsZScsICgkbG9nLCB1dGlscykgLT5cbiAgYnViYmxlQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAnYnViYmxlQ2hhcnQgbGlua2VkJ1xuICAgICAgbGF5b3V0ID0gY29udHJvbGxlci5tZVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX2lkID0gJ2J1YmJsZScgKyBidWJibGVDbnRyKytcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICBmb3Igc05hbWUsIHNjYWxlIG9mIF9zY2FsZUxpc3RcbiAgICAgICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IHNjYWxlLmF4aXNMYWJlbCgpLCB2YWx1ZTogc2NhbGUuZm9ybWF0dGVkVmFsdWUoZGF0YSksIGNvbG9yOiBpZiBzTmFtZSBpcyAnY29sb3InIHRoZW4geydiYWNrZ3JvdW5kLWNvbG9yJzpzY2FsZS5tYXAoZGF0YSl9IGVsc2UgdW5kZWZpbmVkfSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUpIC0+XG5cbiAgICAgICAgYnViYmxlcyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1idWJibGUnKS5kYXRhKGRhdGEsIChkKSAtPiBjb2xvci52YWx1ZShkKSlcbiAgICAgICAgYnViYmxlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1idWJibGUgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgICAgYnViYmxlc1xuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5tYXAoZCkpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgICByOiAgKGQpIC0+IHNpemUubWFwKGQpXG4gICAgICAgICAgICAgIGN4OiAoZCkgLT4geC5tYXAoZClcbiAgICAgICAgICAgICAgY3k6IChkKSAtPiB5Lm1hcChkKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgIGJ1YmJsZXMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvcicsICdzaXplJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBfdG9vbHRpcCA9IGxheW91dC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgfVxuXG4gICNUT0RPIHZlcmlmeSBhbmQgdGVzdCBjdXN0b20gdG9vbHRpcHMgYmVoYXZpb3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbHVtbicsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG4gIHNCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICByZXN0cmljdDogJ0EnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgIF9pZCA9IFwic2ltcGxlQ29sdW1uI3tzQmFyQ250cisrfVwiXG5cbiAgICBjb2x1bW5zID0gbnVsbFxuICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG4gICAgX21lcmdlKFtdKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgIGluaXRpYWwgPSB0cnVlXG4gICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICBjb25maWcgPSB7fVxuICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG5cbiAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG5cbiAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3QueS5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgIGlmIG5vdCBjb2x1bW5zXG4gICAgICAgIGNvbHVtbnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtY29sdW1ucycpXG4gICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgc3RhY2tlZC1iYXJcIlxuXG4gICAgICBiYXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgbGF5b3V0ID0gZGF0YS5tYXAoKGQpIC0+IHtkYXRhOmQsIGtleTp4LnZhbHVlKGQpLCB4OngubWFwKGQpLCB5Ok1hdGgubWluKHkuc2NhbGUoKSgwKSwgeS5tYXAoZCkpLCBjb2xvcjpjb2xvci5tYXAoZCksIHdpZHRoOnguc2NhbGUoKS5yYW5nZUJhbmQoeC52YWx1ZShkKSksIGhlaWdodDpNYXRoLmFicyh5LnNjYWxlKCkoMCkgLSB5Lm1hcChkKSl9KVxuXG4gICAgICBfbWVyZ2UobGF5b3V0KS5maXJzdCh7eDowLCB3aWR0aDowfSkubGFzdCh7eDpvcHRpb25zLndpZHRoICsgYmFyUGFkZGluZy8yIC0gYmFyT3V0ZXJQYWRkaW5nT2xkLCB3aWR0aDogYmFyT3V0ZXJQYWRkaW5nfSlcblxuXG4gICAgICBjb2x1bW5zID0gY29sdW1ucy5kYXRhKGxheW91dCwgKGQpIC0+IGQua2V5KVxuXG4gICAgICBlbnRlciA9IGNvbHVtbnMuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWNvbHVtbnMgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCxpKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aCArIGlmIGkgdGhlbiBiYXJQYWRkaW5nT2xkIC8gMiBlbHNlIGJhck91dGVyUGFkZGluZ09sZH0sI3tkLnl9KSBzY2FsZSgje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0sMSlcIilcbiAgICAgIGVudGVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgIGVudGVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGQud2lkdGggLyAyKVxuICAgICAgICAuYXR0cigneScsIC0yMClcbiAgICAgICAgLmF0dHIoe2R5OiAnMWVtJywgJ3RleHQtYW5jaG9yJzonbWlkZGxlJ30pXG4gICAgICAgIC5zdHlsZSh7J2ZvbnQtc2l6ZSc6JzEuM2VtJywgb3BhY2l0eTogMH0pXG5cbiAgICAgIGNvbHVtbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkKSAtPiBcInRyYW5zbGF0ZSgje2QueH0sICN7ZC55fSkgc2NhbGUoMSwxKVwiKVxuICAgICAgY29sdW1ucy5zZWxlY3QoJ3JlY3QnKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgIGNvbHVtbnMuc2VsZWN0KCd0ZXh0JylcbiAgICAgICAgLnRleHQoKGQpIC0+IHkuZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBob3N0LnNob3dMYWJlbHMoKSB0aGVuIDEgZWxzZSAwKVxuXG4gICAgICBjb2x1bW5zLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgje19tZXJnZS5kZWxldGVkU3VjYyhkKS54IC0gYmFyUGFkZGluZyAvIDJ9LCN7ZC55fSkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAucmVtb3ZlKClcblxuICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICBfc2NhbGVMaXN0LngucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgaG9zdC5zaG93TGFiZWxzKGZhbHNlKVxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgIGhvc3Quc2hvd0xhYmVscyh0cnVlKVxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbHVtbkNsdXN0ZXJlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG5cbiAgY2x1c3RlcmVkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJjbHVzdGVyZWRDb2x1bW4je2NsdXN0ZXJlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQubGF5ZXJLZXkpXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgIyRsb2cuaW5mbyBcInJlbmRlcmluZyBjbHVzdGVyZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgICMgbWFwIGRhdGEgdG8gdGhlIHJpZ2h0IGZvcm1hdCBmb3IgcmVuZGVyaW5nXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgY2x1c3RlclggPSBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKHkubGF5ZXJLZXlzKGRhdGEpKS5yYW5nZUJhbmRzKFswLHguc2NhbGUoKS5yYW5nZUJhbmQoKV0sIDAsIDApXG5cbiAgICAgICAgY2x1c3RlciA9IGRhdGEubWFwKChkKSAtPiBsID0ge1xuICAgICAgICAgIGtleTp4LnZhbHVlKGQpLCBkYXRhOmQsIHg6eC5tYXAoZCksIHdpZHRoOiB4LnNjYWxlKCkucmFuZ2VCYW5kKHgudmFsdWUoZCkpXG4gICAgICAgICAgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7bGF5ZXJLZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGtleTp4LnZhbHVlKGQpLCB2YWx1ZTogZFtrXSwgeDpjbHVzdGVyWChrKSwgeTogeS5zY2FsZSgpKGRba10pLCBoZWlnaHQ6eS5zY2FsZSgpKDApIC0geS5zY2FsZSgpKGRba10pLCB3aWR0aDpjbHVzdGVyWC5yYW5nZUJhbmQoayl9KX1cbiAgICAgICAgKVxuXG4gICAgICAgIF9tZXJnZShjbHVzdGVyKS5maXJzdCh7eDpiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgd2lkdGg6MH0pLmxhc3Qoe3g6b3B0aW9ucy53aWR0aCArIGJhclBhZGRpbmcvMiAtIGJhck91dGVyUGFkZGluZ09sZCwgd2lkdGg6MH0pXG4gICAgICAgIF9tZXJnZUxheWVycyhjbHVzdGVyWzBdLmxheWVycykuZmlyc3Qoe3g6MCwgd2lkdGg6MH0pLmxhc3Qoe3g6Y2x1c3RlclswXS53aWR0aCwgd2lkdGg6MH0pXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1sYXllcicpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzLmRhdGEoY2x1c3RlciwgKGQpIC0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWxheWVyJykuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgYmFyUGFkZGluZ09sZCAvIDJ9LDApIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwgMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwwKSBzY2FsZSgxLDEpXCIpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueCAtIGJhclBhZGRpbmcgLyAyfSwgMCkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkueCArIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+aWYgaW5pdGlhbCB0aGVuIGQud2lkdGggZWxzZSAwKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3Iuc2NhbGUoKShkLmxheWVyS2V5KSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IE1hdGgubWluKHkuc2NhbGUoKSgwKSwgZC55KSlcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IE1hdGguYWJzKGQuaGVpZ2h0KSlcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLDApXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQpLngpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LngucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG5cblxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbHVtblN0YWNrZWQnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZykgLT5cblxuICBzdGFja2VkQ29sdW1uQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBTdGFja2VkIGJhcidcblxuICAgICAgX2lkID0gXCJzdGFja2VkQ29sdW1uI3tzdGFja2VkQ29sdW1uQ250cisrfVwiXG5cbiAgICAgIGxheWVycyA9IG51bGxcblxuICAgICAgc3RhY2sgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSAoKS0+XG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgICAgX21lcmdlTGF5ZXJzID0gdXRpbHMubWVyZ2VEYXRhKClcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBkYXRhLmxheWVycy5tYXAoKGwpIC0+IHtuYW1lOmwubGF5ZXJLZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLnZhbHVlKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGRhdGEua2V5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplLCBzaGFwZSkgLT5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoXCIubGF5ZXJcIilcbiAgICAgICAgIyRsb2cuZGVidWcgXCJkcmF3aW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgc3RhY2sgPSBbXVxuICAgICAgICBmb3IgZCBpbiBkYXRhXG4gICAgICAgICAgeTAgPSAwXG4gICAgICAgICAgbCA9IHtrZXk6eC52YWx1ZShkKSwgbGF5ZXJzOltdLCBkYXRhOmQsIHg6eC5tYXAoZCksIHdpZHRoOmlmIHguc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxfVxuICAgICAgICAgIGlmIGwueCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgbC5sYXllcnMgPSBsYXllcktleXMubWFwKChrKSAtPlxuICAgICAgICAgICAgICBsYXllciA9IHtsYXllcktleTprLCBrZXk6bC5rZXksIHZhbHVlOmRba10sIGhlaWdodDogIHkuc2NhbGUoKSgwKSAtIHkuc2NhbGUoKSgrZFtrXSksIHdpZHRoOiAoaWYgeC5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDEpLCB5OiB5LnNjYWxlKCkoK3kwICsgK2Rba10pLCBjb2xvcjogY29sb3Iuc2NhbGUoKShrKX1cbiAgICAgICAgICAgICAgeTAgKz0gK2Rba11cbiAgICAgICAgICAgICAgcmV0dXJuIGxheWVyXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBzdGFjay5wdXNoKGwpXG5cbiAgICAgICAgX21lcmdlKHN0YWNrKS5maXJzdCh7eDogYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOjB9KVxuICAgICAgICBfbWVyZ2VMYXllcnMobGF5ZXJLZXlzKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKHN0YWNrLCAoZCktPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgYmFyUGFkZGluZ09sZCAvIDJ9LDApIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwgMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tkLnh9LDApIHNjYWxlKDEsMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueCAtIGJhclBhZGRpbmcgLyAyfSwgMCkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT5cbiAgICAgICAgICAgIGlmIF9tZXJnZS5wcmV2KGQua2V5KVxuICAgICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5wcmV2KGQua2V5KS5sYXllcnNbaWR4XS55IGVsc2UgeS5zY2FsZSgpKDApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGQueVxuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLnkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsMClcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPlxuICAgICAgICAgICAgaWR4ID0gbGF5ZXJLZXlzLmluZGV4T2YoX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgaWYgaWR4ID49IDAgdGhlbiBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2lkeF0ueSArIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbaWR4XS5oZWlnaHQgZWxzZSBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2xheWVyS2V5cy5sZW5ndGggLSAxXS55XG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGluaXRpYWwgPSBmYWxzZVxuICAgICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygndG90YWwnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdcblxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICAgIF9zY2FsZUxpc3QueS5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2dhdWdlJywgKCRsb2csIHV0aWxzKSAtPlxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcbiAgICBjb250cm9sbGVyOiAoJHNjb3BlLCAkYXR0cnMpIC0+XG4gICAgICBtZSA9IHtjaGFydFR5cGU6ICdHYXVnZUNoYXJ0JywgaWQ6dXRpbHMuZ2V0SWQoKX1cbiAgICAgICRhdHRycy4kc2V0KCdjaGFydC1pZCcsIG1lLmlkKVxuICAgICAgcmV0dXJuIG1lXG4gICAgXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgaW5pdGFsU2hvdyA9IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICRsb2cuaW5mbyAnZHJhd2luZyBHYXVnZSBDaGFydCdcblxuICAgICAgICBkYXQgPSBbZGF0YV1cblxuICAgICAgICB5RG9tYWluID0geS5zY2FsZSgpLmRvbWFpbigpXG4gICAgICAgIGNvbG9yRG9tYWluID0gYW5ndWxhci5jb3B5KGNvbG9yLnNjYWxlKCkuZG9tYWluKCkpXG4gICAgICAgIGNvbG9yRG9tYWluLnVuc2hpZnQoeURvbWFpblswXSlcbiAgICAgICAgY29sb3JEb21haW4ucHVzaCh5RG9tYWluWzFdKVxuICAgICAgICByYW5nZXMgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMS4uY29sb3JEb21haW4ubGVuZ3RoLTFdXG4gICAgICAgICAgcmFuZ2VzLnB1c2gge2Zyb206K2NvbG9yRG9tYWluW2ktMV0sdG86K2NvbG9yRG9tYWluW2ldfVxuXG4gICAgICAgICNkcmF3IGNvbG9yIHNjYWxlXG5cbiAgICAgICAgYmFyID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgIGJhciA9IGJhci5kYXRhKHJhbmdlcywgKGQsIGkpIC0+IGkpXG4gICAgICAgIGlmIGluaXRhbFNob3dcbiAgICAgICAgICBiYXIuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKS5hdHRyKCd3aWR0aCcsIDUwKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJhci5lbnRlcigpLmFwcGVuZCgncmVjdCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhcicpXG4gICAgICAgICAgICAuYXR0cigneCcsIDApLmF0dHIoJ3dpZHRoJywgNTApXG5cbiAgICAgICAgYmFyLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLChkKSAtPiB5LnNjYWxlKCkoMCkgLSB5LnNjYWxlKCkoZC50byAtIGQuZnJvbSkpXG4gICAgICAgICAgLmF0dHIoJ3knLChkKSAtPiB5LnNjYWxlKCkoZC50bykpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC5mcm9tKSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGJhci5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICAjIGRyYXcgdmFsdWVcblxuICAgICAgICBhZGRNYXJrZXIgPSAocykgLT5cbiAgICAgICAgICBzLmFwcGVuZCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgNTUpLmF0dHIoJ2hlaWdodCcsIDQpLnN0eWxlKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgICBzLmFwcGVuZCgnY2lyY2xlJykuYXR0cigncicsIDEwKS5hdHRyKCdjeCcsIDY1KS5hdHRyKCdjeScsMikuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG5cbiAgICAgICAgbWFya2VyID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpXG4gICAgICAgIG1hcmtlciA9IG1hcmtlci5kYXRhKGRhdCwgKGQpIC0+ICd3ay1jaGFydC1tYXJrZXInKVxuICAgICAgICBtYXJrZXIuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LW1hcmtlcicpLmNhbGwoYWRkTWFya2VyKVxuXG4gICAgICAgIGlmIGluaXRhbFNob3dcbiAgICAgICAgICBtYXJrZXIuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKDAsI3t5LnNjYWxlKCkoZC52YWx1ZSl9KVwiKS5zdHlsZSgnb3BhY2l0eScsIDApXG5cbiAgICAgICAgbWFya2VyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7eS5zY2FsZSgpKGQudmFsdWUpfSlcIilcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC52YWx1ZSkpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBpbml0YWxTaG93ID0gZmFsc2VcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICB0aGlzLnJlcXVpcmVkU2NhbGVzKFsneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgnY29sb3InKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgfVxuXG4gICN0b2RvIHJlZmVjdG9yIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdnZW9NYXAnLCAoJGxvZywgdXRpbHMpIC0+XG4gIG1hcENudHIgPSAwXG5cbiAgcGFyc2VMaXN0ID0gKHZhbCkgLT5cbiAgICBpZiB2YWxcbiAgICAgIGwgPSB2YWwudHJpbSgpLnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJykuc3BsaXQoJywnKS5tYXAoKGQpIC0+IGQucmVwbGFjZSgvXltcXFwifCddfFtcXFwifCddJC9nLCAnJykpXG4gICAgICBsID0gbC5tYXAoKGQpIC0+IGlmIGlzTmFOKGQpIHRoZW4gZCBlbHNlICtkKVxuICAgICAgcmV0dXJuIGlmIGwubGVuZ3RoIGlzIDEgdGhlbiByZXR1cm4gbFswXSBlbHNlIGxcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIHNjb3BlOiB7XG4gICAgICBnZW9qc29uOiAnPSdcbiAgICAgIHByb2plY3Rpb246ICc9J1xuICAgIH1cblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX2lkID0gJ2dlb01hcCcgKyBtYXBDbnRyKytcbiAgICAgIF9kYXRhTWFwcGluZyA9IGQzLm1hcCgpXG5cbiAgICAgIF9zY2FsZSA9IDFcbiAgICAgIF9yb3RhdGUgPSBbMCwwXVxuICAgICAgX2lkUHJvcCA9ICcnXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG5cbiAgICAgICAgdmFsID0gX2RhdGFNYXBwaW5nLmdldChkYXRhLnByb3BlcnRpZXNbX2lkUHJvcFswXV0pXG4gICAgICAgIEBsYXllcnMucHVzaCh7bmFtZTp2YWwuUlMsIHZhbHVlOnZhbC5ERVN9KVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHBhdGhTZWwgPSBbXVxuXG4gICAgICBfcHJvamVjdGlvbiA9IGQzLmdlby5vcnRob2dyYXBoaWMoKVxuICAgICAgX3dpZHRoID0gMFxuICAgICAgX2hlaWdodCA9IDBcbiAgICAgIF9wYXRoID0gdW5kZWZpbmVkXG4gICAgICBfem9vbSA9IGQzLmdlby56b29tKClcbiAgICAgICAgLnByb2plY3Rpb24oX3Byb2plY3Rpb24pXG4gICAgICAgICMuc2NhbGVFeHRlbnQoW3Byb2plY3Rpb24uc2NhbGUoKSAqIC43LCBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxMF0pXG4gICAgICAgIC5vbiBcInpvb20ucmVkcmF3XCIsICgpIC0+XG4gICAgICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBwYXRoU2VsLmF0dHIoXCJkXCIsIF9wYXRoKTtcblxuICAgICAgX2dlb0pzb24gPSB1bmRlZmluZWRcblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgX3dpZHRoID0gb3B0aW9ucy53aWR0aFxuICAgICAgICBfaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcbiAgICAgICAgaWYgZGF0YSBhbmQgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eShfaWRQcm9wWzFdKVxuICAgICAgICAgIGZvciBlIGluIGRhdGFcbiAgICAgICAgICAgIF9kYXRhTWFwcGluZy5zZXQoZVtfaWRQcm9wWzFdXSwgZSlcblxuICAgICAgICBpZiBfZ2VvSnNvblxuXG4gICAgICAgICAgX3Byb2plY3Rpb24udHJhbnNsYXRlKFtfd2lkdGgvMiwgX2hlaWdodC8yXSlcbiAgICAgICAgICBwYXRoU2VsID0gdGhpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEoX2dlb0pzb24uZmVhdHVyZXMsIChkKSAtPiBkLnByb3BlcnRpZXNbX2lkUHJvcFswXV0pXG4gICAgICAgICAgcGF0aFNlbFxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwic3ZnOnBhdGhcIilcbiAgICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywnbGlnaHRncmV5Jykuc3R5bGUoJ3N0cm9rZScsICdkYXJrZ3JleScpXG4gICAgICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgICAgICAgICAgLmNhbGwoX3pvb20pXG5cbiAgICAgICAgICBwYXRoU2VsXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgX3BhdGgpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT5cbiAgICAgICAgICAgICAgdmFsID0gX2RhdGFNYXBwaW5nLmdldChkLnByb3BlcnRpZXNbX2lkUHJvcFswXV0pXG4gICAgICAgICAgICAgIGNvbG9yLm1hcCh2YWwpXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgcGF0aFNlbC5leGl0KCkucmVtb3ZlKClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWydjb2xvciddKVxuICAgICAgICBfc2NhbGVMaXN0LmNvbG9yLnJlc2V0T25OZXdEYXRhKHRydWUpXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgX3NlbGVjdGVkID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgIyBHZW9NYXAgc3BlY2lmaWMgcHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjb3BlLiR3YXRjaCAncHJvamVjdGlvbicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICRsb2cubG9nICdzZXR0aW5nIFByb2plY3Rpb24gcGFyYW1zJywgdmFsXG4gICAgICAgICAgaWYgZDMuZ2VvLmhhc093blByb3BlcnR5KHZhbC5wcm9qZWN0aW9uKVxuICAgICAgICAgICAgX3Byb2plY3Rpb24gPSBkMy5nZW9bdmFsLnByb2plY3Rpb25dKClcbiAgICAgICAgICAgIF9wcm9qZWN0aW9uLmNlbnRlcih2YWwuY2VudGVyKS5zY2FsZSh2YWwuc2NhbGUpLnJvdGF0ZSh2YWwucm90YXRlKS5jbGlwQW5nbGUodmFsLmNsaXBBbmdsZSlcbiAgICAgICAgICAgIF9pZFByb3AgPSB2YWwuaWRNYXBcbiAgICAgICAgICAgIGlmIF9wcm9qZWN0aW9uLnBhcmFsbGVsc1xuICAgICAgICAgICAgICBfcHJvamVjdGlvbi5wYXJhbGxlbHModmFsLnBhcmFsbGVscylcbiAgICAgICAgICAgIF9zY2FsZSA9IF9wcm9qZWN0aW9uLnNjYWxlKClcbiAgICAgICAgICAgIF9yb3RhdGUgPSBfcHJvamVjdGlvbi5yb3RhdGUoKVxuICAgICAgICAgICAgX3BhdGggPSBkMy5nZW8ucGF0aCgpLnByb2plY3Rpb24oX3Byb2plY3Rpb24pXG4gICAgICAgICAgICBfem9vbS5wcm9qZWN0aW9uKF9wcm9qZWN0aW9uKVxuXG4gICAgICAgICAgICBsYXlvdXQubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgICAgLCB0cnVlICNkZWVwIHdhdGNoXG5cbiAgICAgIHNjb3BlLiR3YXRjaCAnZ2VvanNvbicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZCBhbmQgdmFsIGlzbnQgJydcbiAgICAgICAgICBfZ2VvSnNvbiA9IHZhbFxuICAgICAgICAgIGxheW91dC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG5cbiAgfVxuXG4gICNUT0RPIHJlLXRlc3QgYW5kIHZlcmlmeSBpbiBuZXcgYXBwbGljYWl0b24uIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5IaXN0b2dyYW0nLCAoJGxvZywgYmFyQ29uZmlnLCB1dGlscykgLT5cblxuICBzSGlzdG9DbnRyID0gMFxuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIF9pZCA9IFwiaGlzdG9ncmFtI3tzSGlzdG9DbnRyKyt9XCJcblxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBidWNrZXRzID0gdW5kZWZpbmVkXG4gICAgICBsYWJlbHMgPSB1bmRlZmluZWRcbiAgICAgIGNvbmZpZyA9IHt9XG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCktPiBkLnhWYWwpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC5yYW5nZVguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC55LmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUsIHNoYXBlLCByYW5nZVgpIC0+XG5cbiAgICAgICAgaWYgcmFuZ2VYLnVwcGVyUHJvcGVydHkoKVxuICAgICAgICAgIGxheW91dCA9IGRhdGEubWFwKChkKSAtPiB7eDpyYW5nZVguc2NhbGUoKShyYW5nZVgubG93ZXJWYWx1ZShkKSksIHhWYWw6cmFuZ2VYLmxvd2VyVmFsdWUoZCksIHdpZHRoOnJhbmdlWC5zY2FsZSgpKHJhbmdlWC51cHBlclZhbHVlKGQpKSAtIHJhbmdlWC5zY2FsZSgpKHJhbmdlWC5sb3dlclZhbHVlKGQpKSwgeTp5Lm1hcChkKSwgaGVpZ2h0Om9wdGlvbnMuaGVpZ2h0IC0geS5tYXAoZCksIGNvbG9yOmNvbG9yLm1hcChkKSwgZGF0YTpkfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIGRhdGEubGVuZ3RoID4gMFxuICAgICAgICAgICAgc3RhcnQgPSByYW5nZVgubG93ZXJWYWx1ZShkYXRhWzBdKVxuICAgICAgICAgICAgc3RlcCA9IHJhbmdlWC5sb3dlclZhbHVlKGRhdGFbMV0pIC0gc3RhcnRcbiAgICAgICAgICAgIHdpZHRoID0gb3B0aW9ucy53aWR0aCAvIGRhdGEubGVuZ3RoXG4gICAgICAgICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCwgaSkgLT4ge3g6cmFuZ2VYLnNjYWxlKCkoc3RhcnQgKyBzdGVwICogaSksIHhWYWw6cmFuZ2VYLmxvd2VyVmFsdWUoZCksIHdpZHRoOndpZHRoLCB5OnkubWFwKGQpLCBoZWlnaHQ6b3B0aW9ucy5oZWlnaHQgLSB5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCBkYXRhOmR9KVxuXG4gICAgICAgIF9tZXJnZShsYXlvdXQpLmZpcnN0KHt4OjAsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGgsIHdpZHRoOiAwfSlcblxuICAgICAgICBpZiBub3QgYnVja2V0c1xuICAgICAgICAgIGJ1Y2tldHMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYnVja2V0JylcblxuICAgICAgICBidWNrZXRzID0gYnVja2V0cy5kYXRhKGxheW91dCwgKGQpIC0+IGQueFZhbClcblxuICAgICAgICBlbnRlciA9IGJ1Y2tldHMuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWJ1Y2tldCB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKCN7aWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueCAgKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRofSwje2QueX0pIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwxKVwiKVxuICAgICAgICBlbnRlci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgIGVudGVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC53aWR0aCAvIDIpXG4gICAgICAgICAgLmF0dHIoJ3knLCAtMjApXG4gICAgICAgICAgLmF0dHIoe2R5OiAnMWVtJywgJ3RleHQtYW5jaG9yJzonbWlkZGxlJ30pXG4gICAgICAgICAgLnN0eWxlKHsnZm9udC1zaXplJzonMS4zZW0nLCBvcGFjaXR5OiAwfSlcblxuICAgICAgICBidWNrZXRzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkKSAtPiBcInRyYW5zbGF0ZSgje2QueH0sICN7ZC55fSkgc2NhbGUoMSwxKVwiKVxuICAgICAgICBidWNrZXRzLnNlbGVjdCgncmVjdCcpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICAgIGJ1Y2tldHMuc2VsZWN0KCd0ZXh0JylcbiAgICAgICAgICAudGV4dCgoZCkgLT4geS5mb3JtYXR0ZWRWYWx1ZShkLmRhdGEpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGhvc3Quc2hvd0xhYmVscygpIHRoZW4gMSBlbHNlIDApXG5cbiAgICAgICAgYnVja2V0cy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgje19tZXJnZS5kZWxldGVkU3VjYyhkKS54fSwje2QueX0pIHNjYWxlKDAsMSlcIilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsncmFuZ2VYJywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgncmFuZ2VYJykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuc2NhbGVUeXBlKCdsaW5lYXInKS5kb21haW5DYWxjKCdyYW5nZUV4dGVudCcpXG4gICAgICAgIEBnZXRLaW5kKCdjb2xvcicpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgaG9zdC5zaG93TGFiZWxzKGZhbHNlKVxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZScgb3IgdmFsIGlzIFwiXCJcbiAgICAgICAgICBob3N0LnNob3dMYWJlbHModHJ1ZSlcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zXG4jVE9ETyB0ZXN0IHNlbGVjdGlvbiBiZWhhdmlvciIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnbGluZScsICgkbG9nLCBiZWhhdmlvciwgdXRpbHMsIHRpbWluZykgLT5cbiAgbGluZUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgcy1saW5lJ1xuICAgICAgX2xheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF9kYXRhT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzTmV3ID0gW11cbiAgICAgIF9wYXRoQXJyYXkgPSBbXVxuICAgICAgX2luaXRpYWxPcGFjaXR5ID0gMFxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgb2Zmc2V0ID0gMFxuICAgICAgX2lkID0gJ2xpbmUnICsgbGluZUNudHIrK1xuICAgICAgbGluZSA9IHVuZGVmaW5lZFxuICAgICAgbWFya2VycyA9IHVuZGVmaW5lZFxuXG4gICAgICBicnVzaExpbmUgPSB1bmRlZmluZWRcblxuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRFbnRlciA9IChpZHgpIC0+XG4gICAgICAgIF9wYXRoQXJyYXkgPSBfLnRvQXJyYXkoX3BhdGhWYWx1ZXNOZXcpXG4gICAgICAgIHR0TW92ZURhdGEuYXBwbHkodGhpcywgW2lkeF0pXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IF9wYXRoQXJyYXkubWFwKChsKSAtPiB7bmFtZTpsW2lkeF0ua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobFtpZHhdLnkpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsW2lkeF0uY29sb3J9LCB4djpsW2lkeF0ueHZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueHYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbaWR4XS5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkW2lkeF0uY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gZFtpZHhdLnkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X3NjYWxlTGlzdC54LnNjYWxlKCkoX3BhdGhBcnJheVswXVtpZHhdLnh2KSArIG9mZnNldH0pXCIpXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIG1lcmdlZFggPSB1dGlscy5tZXJnZVNlcmllcyh4LnZhbHVlKF9kYXRhT2xkKSwgeC52YWx1ZShkYXRhKSlcbiAgICAgICAgX2xheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBbXVxuXG4gICAgICAgIF9wYXRoVmFsdWVzTmV3ID0ge31cblxuICAgICAgICBmb3Iga2V5IGluIF9sYXllcktleXNcbiAgICAgICAgICBfcGF0aFZhbHVlc05ld1trZXldID0gZGF0YS5tYXAoKGQpLT4ge3g6eC5tYXAoZCkseTp5LnNjYWxlKCkoeS5sYXllclZhbHVlKGQsIGtleSkpLCB4djp4LnZhbHVlKGQpLCB5djp5LmxheWVyVmFsdWUoZCxrZXkpLCBrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIGRhdGE6ZH0pXG5cbiAgICAgICAgICBsYXllciA9IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOltdfVxuICAgICAgICAgICMgZmluZCBzdGFydGluZyB2YWx1ZSBmb3Igb2xkXG4gICAgICAgICAgaSA9IDBcbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMF0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgb2xkTGFzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bbWVyZ2VkWFtpXVswXV1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFgubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRYW2ldWzFdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG5ld0xhc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW21lcmdlZFhbaV1bMV1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIGZvciB2YWwsIGkgaW4gbWVyZ2VkWFxuICAgICAgICAgICAgdiA9IHtjb2xvcjpsYXllci5jb2xvciwgeDp2YWxbMl19XG4gICAgICAgICAgICAjIHNldCB4IGFuZCB5IHZhbHVlcyBmb3Igb2xkIHZhbHVlcy4gSWYgdGhlcmUgaXMgYSBhZGRlZCB2YWx1ZSwgbWFpbnRhaW4gdGhlIGxhc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIHZhbFsxXSBpcyB1bmRlZmluZWQgI2llIGFuIG9sZCB2YWx1ZSBpcyBkZWxldGVkLCBtYWludGFpbiB0aGUgbGFzdCBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi55TmV3ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gbmV3TGFzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0xhc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV1cbiAgICAgICAgICAgICAgdi5kZWxldGVkID0gZmFsc2VcblxuICAgICAgICAgICAgaWYgX2RhdGFPbGQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICBpZiAgdmFsWzBdIGlzIHVuZGVmaW5lZCAjIGllIGEgbmV3IHZhbHVlIGhhcyBiZWVuIGFkZGVkXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRMYXN0LnggIyBzdGFydCB4LWFuaW1hdGlvbiBmcm9tIHRoZSBwcmVkZWNlc3NvcnMgb2xkIHBvc2l0aW9uXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueVxuICAgICAgICAgICAgICAgIHYueE9sZCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS54XG4gICAgICAgICAgICAgICAgb2xkTGFzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2LnhPbGQgPSB2LnhOZXdcbiAgICAgICAgICAgICAgdi55T2xkID0gdi55TmV3XG5cblxuICAgICAgICAgICAgbGF5ZXIudmFsdWUucHVzaCh2KVxuXG4gICAgICAgICAgX2xheW91dC5wdXNoKGxheWVyKVxuXG4gICAgICAgIG9mZnNldCA9IGlmIHguaXNPcmRpbmFsKCkgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIG1hcmtlcnMgPSAobGF5ZXIsIGR1cmF0aW9uKSAtPlxuICAgICAgICAgIGlmIF9zaG93TWFya2Vyc1xuICAgICAgICAgICAgbSA9IGxheWVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpLmRhdGEoXG4gICAgICAgICAgICAgICAgKGwpIC0+IGwudmFsdWVcbiAgICAgICAgICAgICAgLCAoZCkgLT4gZC54XG4gICAgICAgICAgICApXG4gICAgICAgICAgICBtLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LW1hcmtlciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCA1KVxuICAgICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgICAgICAgICMuc3R5bGUoJ29wYWNpdHknLCBfaW5pdGlhbE9wYWNpdHkpXG4gICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgICAgbVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgLT4gZC55T2xkKVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgLT4gZC54T2xkICsgb2Zmc2V0KVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnd2stY2hhcnQtZGVsZXRlZCcsKGQpIC0+IGQuZGVsZXRlZClcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSAtPiBkLnlOZXcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkKSAtPiBkLnhOZXcgKyBvZmZzZXQpXG4gICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkKSAtPiBpZiBkLmRlbGV0ZWQgdGhlbiAwIGVsc2UgMSlcblxuICAgICAgICAgICAgbS5leGl0KClcbiAgICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsYXllci5zZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pLnN0eWxlKCdvcGFjaXR5JywgMCkucmVtb3ZlKClcblxuICAgICAgICBsaW5lT2xkID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhPbGQpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU9sZClcblxuICAgICAgICBsaW5lTmV3ID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhOZXcpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU5ldylcblxuICAgICAgICBicnVzaExpbmUgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55KChkKSAtPiBkLnlOZXcpXG5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIGVudGVyID0gbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgIGVudGVyLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZU5ldyhkLnZhbHVlKSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBfaW5pdGlhbE9wYWNpdHkpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcblxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b2Zmc2V0fSlcIilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lT2xkKGQudmFsdWUpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lTmV3KGQudmFsdWUpKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSkuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXllcnMuY2FsbChtYXJrZXJzLCBvcHRpb25zLmR1cmF0aW9uKVxuXG4gICAgICAgIF9pbml0aWFsT3BhY2l0eSA9IDBcbiAgICAgICAgX2RhdGFPbGQgPSBkYXRhXG4gICAgICAgIF9wYXRoVmFsdWVzT2xkID0gX3BhdGhWYWx1ZXNOZXdcblxuICAgICAgYnJ1c2ggPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxpbmVcIilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBicnVzaExpbmUoZC52YWx1ZSkpXG4gICAgICAgIGxheWVycy5jYWxsKG1hcmtlcnMsIDApXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LngpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2xpbmVWZXJ0aWNhbCcsICgkbG9nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgX2xheW91dCA9IFtdXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgb2Zmc2V0ID0gMFxuICAgICAgX2lkID0gJ2xpbmUnICsgbGluZUNudHIrK1xuXG4gICAgICBwcmVwRGF0YSA9ICh4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgI2xheWVyS2V5cyA9IHkubGF5ZXJLZXlzKEApXG4gICAgICAgICNfbGF5b3V0ID0gbGF5ZXJLZXlzLm1hcCgoa2V5KSA9PiB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpAbWFwKChkKS0+IHt4OngudmFsdWUoZCkseTp5LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgdHRFbnRlciA9IChpZHgsIGF4aXNYLCBjbnRucikgLT5cbiAgICAgICAgY250bnJTZWwgPSBkMy5zZWxlY3QoY250bnIpXG4gICAgICAgIGNudG5yV2lkdGggPSBjbnRuclNlbC5hdHRyKCd3aWR0aCcpXG4gICAgICAgIHBhcmVudCA9IGQzLnNlbGVjdChjbnRuci5wYXJlbnRFbGVtZW50KVxuICAgICAgICBfdHRIaWdobGlnaHQgPSBwYXJlbnQuYXBwZW5kKCdnJylcbiAgICAgICAgX3R0SGlnaGxpZ2h0LmFwcGVuZCgnbGluZScpLmF0dHIoe3gxOjAsIHgyOmNudG5yV2lkdGh9KS5zdHlsZSh7J3BvaW50ZXItZXZlbnRzJzonbm9uZScsIHN0cm9rZTonbGlnaHRncmV5JywgJ3N0cm9rZS13aWR0aCc6MX0pXG4gICAgICAgIF9jaXJjbGVzID0gX3R0SGlnaGxpZ2h0LnNlbGVjdEFsbCgnY2lyY2xlJykuZGF0YShfbGF5b3V0LChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ3InLCA1KS5hdHRyKCdmaWxsJywgKGQpLT4gZC5jb2xvcikuYXR0cignZmlsbC1vcGFjaXR5JywgMC42KS5hdHRyKCdzdHJva2UnLCAnYmxhY2snKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcblxuICAgICAgICBfdHRIaWdobGlnaHQuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KStvZmZzZXR9KVwiKVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBfbGF5b3V0Lm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsLnZhbHVlW2lkeF0ueCksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoJ2NpcmNsZScpLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZC5jb2xvcilcbiAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeCcsIChkKSAtPiBfc2NhbGVMaXN0Lnguc2NhbGUoKShkLnZhbHVlW2lkeF0ueCkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tfc2NhbGVMaXN0Lnkuc2NhbGUoKShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueSkgKyBvZmZzZXR9KVwiKVxuXG5cbiAgICAgIHNldFRvb2x0aXAgPSAodG9vbHRpcCwgb3ZlcmxheSkgLT5cbiAgICAgICAgX3Rvb2x0aXAgPSB0b29sdGlwXG4gICAgICAgIHRvb2x0aXAob3ZlcmxheSlcbiAgICAgICAgdG9vbHRpcC5pc0hvcml6b250YWwodHJ1ZSlcbiAgICAgICAgdG9vbHRpcC5yZWZyZXNoT25Nb3ZlKHRydWUpXG4gICAgICAgIHRvb2x0aXAub24gXCJtb3ZlLiN7X2lkfVwiLCB0dE1vdmVcbiAgICAgICAgdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG4gICAgICAgIHRvb2x0aXAub24gXCJsZWF2ZS4je19pZH1cIiwgdHRMZWF2ZVxuXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt5OnkudmFsdWUoZCkseDp4LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgICBvZmZzZXQgPSBpZiB5LmlzT3JkaW5hbCgpIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBsaW5lID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgICAueSgoZCkgLT4geS5zY2FsZSgpKGQueSkpXG5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tvZmZzZXR9KVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmUoZC52YWx1ZSkpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueSlcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZW50ZXIgLyBleGl0IGFuaW1hdGlvbnMgbGlrZSBpbiBsaW5lXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncGllJywgKCRsb2csIHV0aWxzKSAtPlxuICBwaWVDbnRyID0gMFxuXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnRUEnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICMgc2V0IGNoYXJ0IHNwZWNpZmljIGRlZmF1bHRzXG5cbiAgICBfaWQgPSBcInBpZSN7cGllQ250cisrfVwiXG5cbiAgICBpbm5lciA9IHVuZGVmaW5lZFxuICAgIG91dGVyID0gdW5kZWZpbmVkXG4gICAgbGFiZWxzID0gdW5kZWZpbmVkXG4gICAgcGllQm94ID0gdW5kZWZpbmVkXG4gICAgcG9seWxpbmUgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gW11cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgIF9zaG93TGFiZWxzID0gZmFsc2VcblxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LmNvbG9yLmF4aXNMYWJlbCgpXG4gICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnNpemUuYXhpc0xhYmVsKClcbiAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC5zaXplLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBpbml0aWFsU2hvdyA9IHRydWVcblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAnZHJhd2luZyBwaWUgY2hhcnQgdjInXG5cbiAgICAgIHIgPSBNYXRoLm1pbihvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCkgLyAyXG5cbiAgICAgIGlmIG5vdCBwaWVCb3hcbiAgICAgICAgcGllQm94PSBAYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1waWVCb3gnKVxuICAgICAgcGllQm94LmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcblxuICAgICAgaW5uZXJBcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgICAgLm91dGVyUmFkaXVzKHIgKiBpZiBfc2hvd0xhYmVscyB0aGVuIDAuOCBlbHNlIDEpXG4gICAgICAgIC5pbm5lclJhZGl1cygwKVxuXG4gICAgICBvdXRlckFyYyA9IGQzLnN2Zy5hcmMoKVxuICAgICAgICAub3V0ZXJSYWRpdXMociAqIDAuOSlcbiAgICAgICAgLmlubmVyUmFkaXVzKHIgKiAwLjkpXG5cbiAgICAgIGtleSA9IChkKSAtPiBfc2NhbGVMaXN0LmNvbG9yLnZhbHVlKGQuZGF0YSlcblxuICAgICAgcGllID0gZDMubGF5b3V0LnBpZSgpXG4gICAgICAgIC5zb3J0KG51bGwpXG4gICAgICAgIC52YWx1ZShzaXplLnZhbHVlKVxuXG4gICAgICBhcmNUd2VlbiA9IChhKSAtPlxuICAgICAgICBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSlcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IGkoMClcbiAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgIGlubmVyQXJjKGkodCkpXG5cbiAgICAgIHNlZ21lbnRzID0gcGllKGRhdGEpICMgcGllIGNvbXB1dGVzIGZvciBlYWNoIHNlZ21lbnQgdGhlIHN0YXJ0IGFuZ2xlIGFuZCB0aGUgZW5kIGFuZ2xlXG4gICAgICBfbWVyZ2Uua2V5KGtleSlcbiAgICAgIF9tZXJnZShzZWdtZW50cykuZmlyc3Qoe3N0YXJ0QW5nbGU6MCwgZW5kQW5nbGU6MH0pLmxhc3Qoe3N0YXJ0QW5nbGU6TWF0aC5QSSAqIDIsIGVuZEFuZ2xlOiBNYXRoLlBJICogMn0pXG5cbiAgICAgICMtLS0gRHJhdyBQaWUgc2VnbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBpZiBub3QgaW5uZXJcbiAgICAgICAgaW5uZXIgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtaW5uZXJBcmMnKVxuXG4gICAgICBpbm5lciA9IGlubmVyXG4gICAgICAgIC5kYXRhKHNlZ21lbnRzLGtleSlcblxuICAgICAgaW5uZXIuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuZWFjaCgoZCkgLT4gdGhpcy5fY3VycmVudCA9IGlmIGluaXRpYWxTaG93IHRoZW4gZCBlbHNlIHtzdGFydEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGUsIGVuZEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGV9KVxuICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1pbm5lckFyYyB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+ICBjb2xvci5tYXAoZC5kYXRhKSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbFNob3cgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICBpbm5lclxuICAgICAgICAjLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgLmF0dHJUd2VlbignZCcsYXJjVHdlZW4pXG5cbiAgICAgIGlubmVyLmV4aXQoKS5kYXR1bSgoZCkgLT4gIHtzdGFydEFuZ2xlOl9tZXJnZS5kZWxldGVkU3VjYyhkKS5zdGFydEFuZ2xlLCBlbmRBbmdsZTpfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuc3RhcnRBbmdsZX0pXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0clR3ZWVuKCdkJyxhcmNUd2VlbilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgIy0tLSBEcmF3IFNlZ21lbnQgTGFiZWwgVGV4dCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIG1pZEFuZ2xlID0gKGQpIC0+IGQuc3RhcnRBbmdsZSArIChkLmVuZEFuZ2xlIC0gZC5zdGFydEFuZ2xlKSAvIDJcblxuICAgICAgaWYgX3Nob3dMYWJlbHNcblxuICAgICAgICBsYWJlbHMgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtbGFiZWwnKS5kYXRhKHNlZ21lbnRzLCBrZXkpXG5cbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGFiZWwnKVxuICAgICAgICAgIC5lYWNoKChkKSAtPiBAX2N1cnJlbnQgPSBkKVxuICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywnMS4zZW0nKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnRleHQoKGQpIC0+IHNpemUuZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcblxuICAgICAgICBsYWJlbHMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgICAgIC5hdHRyVHdlZW4oJ3RyYW5zZm9ybScsIChkKSAtPlxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKF90aGlzLl9jdXJyZW50LCBkKVxuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIF90aGlzLl9jdXJyZW50ID0gZDJcbiAgICAgICAgICAgICAgcG9zID0gb3V0ZXJBcmMuY2VudHJvaWQoZDIpXG4gICAgICAgICAgICAgIHBvc1swXSArPSAxNSAqIChpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIDEgZWxzZSAtMSlcbiAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKCN7cG9zfSlcIilcbiAgICAgICAgICAuc3R5bGVUd2VlbigndGV4dC1hbmNob3InLCAoZCkgLT5cbiAgICAgICAgICAgIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoQF9jdXJyZW50LCBkKVxuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIHJldHVybiBpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIFwic3RhcnRcIiBlbHNlIFwiZW5kXCJcbiAgICAgICAgKVxuXG4gICAgICAgIGxhYmVscy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLnN0eWxlKCdvcGFjaXR5JywwKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tIERyYXcgQ29ubmVjdG9yIExpbmVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBwb2x5bGluZSA9IHBpZUJveC5zZWxlY3RBbGwoXCIud2stY2hhcnQtcG9seWxpbmVcIikuZGF0YShzZWdtZW50cywga2V5KVxuXG4gICAgICAgIHBvbHlsaW5lLmVudGVyKClcbiAgICAgICAgLiBhcHBlbmQoXCJwb2x5bGluZVwiKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LXBvbHlsaW5lJylcbiAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXG4gICAgICAgICAgLmVhY2goKGQpIC0+ICB0aGlzLl9jdXJyZW50ID0gZClcblxuICAgICAgICBwb2x5bGluZS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIChkKSAtPiBpZiBkLmRhdGEudmFsdWUgaXMgMCB0aGVuICAwIGVsc2UgLjUpXG4gICAgICAgICAgLmF0dHJUd2VlbihcInBvaW50c1wiLCAoZCkgLT5cbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9jdXJyZW50XG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGQpXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXNcbiAgICAgICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICAgICAgZDIgPSBpbnRlcnBvbGF0ZSh0KVxuICAgICAgICAgICAgICBfdGhpcy5fY3VycmVudCA9IGQyO1xuICAgICAgICAgICAgICBwb3MgPSBvdXRlckFyYy5jZW50cm9pZChkMilcbiAgICAgICAgICAgICAgcG9zWzBdICs9IDEwICogKGlmIG1pZEFuZ2xlKGQyKSA8IE1hdGguUEkgdGhlbiAgMSBlbHNlIC0xKVxuICAgICAgICAgICAgICByZXR1cm4gW2lubmVyQXJjLmNlbnRyb2lkKGQyKSwgb3V0ZXJBcmMuY2VudHJvaWQoZDIpLCBwb3NdO1xuICAgICAgICAgIClcblxuICAgICAgICBwb2x5bGluZS5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuICAgICAgICAgIC5yZW1vdmUoKTtcblxuICAgICAgZWxzZVxuICAgICAgICBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtcG9seWxpbmUnKS5yZW1vdmUoKVxuICAgICAgICBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtbGFiZWwnKS5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsU2hvdyA9IGZhbHNlXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgX3NjYWxlTGlzdCA9IHRoaXMuZ2V0U2NhbGVzKFsnc2l6ZScsICdjb2xvciddKVxuICAgICAgX3NjYWxlTGlzdC5jb2xvci5zY2FsZVR5cGUoJ2NhdGVnb3J5MjAnKVxuICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgX3Nob3dMYWJlbHMgPSBmYWxzZVxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgIF9zaG93TGFiZWxzID0gdHJ1ZVxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuICAjVE9ETyB2ZXJpZnkgYmVoYXZpb3Igd2l0aCBjdXN0b20gdG9vbHRpcHMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NjYXR0ZXInLCAoJGxvZywgdXRpbHMpIC0+XG4gIHNjYXR0ZXJDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgICBfaWQgPSAnc2NhdHRlcicgKyBzY2F0dGVyQ250KytcbiAgICAgIF9zY2FsZUxpc3QgPSBbXVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIGZvciBzTmFtZSwgc2NhbGUgb2YgX3NjYWxlTGlzdFxuICAgICAgICAgIEBsYXllcnMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBzY2FsZS5heGlzTGFiZWwoKSxcbiAgICAgICAgICAgIHZhbHVlOiBzY2FsZS5mb3JtYXR0ZWRWYWx1ZShkYXRhKSxcbiAgICAgICAgICAgIGNvbG9yOiBpZiBzTmFtZSBpcyAnY29sb3InIHRoZW4geydiYWNrZ3JvdW5kLWNvbG9yJzpzY2FsZS5tYXAoZGF0YSl9IGVsc2UgdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGF0aDogaWYgc05hbWUgaXMgJ3NoYXBlJyB0aGVuIGQzLnN2Zy5zeW1ib2woKS50eXBlKHNjYWxlLm1hcChkYXRhKSkuc2l6ZSg4MCkoKSBlbHNlIHVuZGVmaW5lZFxuICAgICAgICAgICAgY2xhc3M6IGlmIHNOYW1lIGlzICdzaGFwZScgdGhlbiAnd2stY2hhcnQtdHQtc3ZnLXNoYXBlJyBlbHNlICcnXG4gICAgICAgICAgfSlcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGluaXRpYWxTaG93ID0gdHJ1ZVxuXG5cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG4gICAgICAgICMkbG9nLmRlYnVnICdkcmF3aW5nIHNjYXR0ZXIgY2hhcnQnXG4gICAgICAgIGluaXQgPSAocykgLT5cbiAgICAgICAgICBpZiBpbml0aWFsU2hvd1xuICAgICAgICAgICAgcy5zdHlsZSgnZmlsbCcsIGNvbG9yLm1hcClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCktPiBcInRyYW5zbGF0ZSgje3gubWFwKGQpfSwje3kubWFwKGQpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICAgIGluaXRpYWxTaG93ID0gZmFsc2VcblxuICAgICAgICBwb2ludHMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtcG9pbnRzJylcbiAgICAgICAgICAuZGF0YShkYXRhKVxuICAgICAgICBwb2ludHMuZW50ZXIoKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1wb2ludHMgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+IFwidHJhbnNsYXRlKCN7eC5tYXAoZCl9LCN7eS5tYXAoZCl9KVwiKVxuICAgICAgICAgIC5jYWxsKGluaXQpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgIHBvaW50c1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIGQzLnN2Zy5zeW1ib2woKS50eXBlKChkKSAtPiBzaGFwZS5tYXAoZCkpLnNpemUoKGQpIC0+IHNpemUubWFwKGQpICogc2l6ZS5tYXAoZCkpKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGNvbG9yLm1hcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT4gXCJ0cmFuc2xhdGUoI3t4Lm1hcChkKX0sI3t5Lm1hcChkKX0pXCIpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBwb2ludHMuZXhpdCgpLnJlbW92ZSgpXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZSddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICB9XG5cbiNUT0RPIHZlcmlmeSBiZWhhdmlvciB3aXRoIGN1c3RvbSB0b29sdGlwc1xuI1RPRE8gSW1wbGVtZW50IGluIG5ldyBkZW1vIGFwcCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc3BpZGVyJywgKCRsb2csIHV0aWxzKSAtPlxuICBzcGlkZXJDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmRlYnVnICdidWJibGVDaGFydCBsaW5rZWQnXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9pZCA9ICdzcGlkZXInICsgc3BpZGVyQ250cisrXG4gICAgICBheGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgX2RhdGEgPSB1bmRlZmluZWRcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgQGxheWVycyA9IF9kYXRhLm1hcCgoZCkgLT4gIHtuYW1lOl9zY2FsZUxpc3QueC52YWx1ZShkKSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGRbZGF0YV0pLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzpfc2NhbGVMaXN0LmNvbG9yLnNjYWxlKCkoZGF0YSl9fSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgICAkbG9nLmxvZyBkYXRhXG4gICAgICAgICMgY29tcHV0ZSBjZW50ZXIgb2YgYXJlYVxuICAgICAgICBjZW50ZXJYID0gb3B0aW9ucy53aWR0aC8yXG4gICAgICAgIGNlbnRlclkgPSBvcHRpb25zLmhlaWdodC8yXG4gICAgICAgIHJhZGl1cyA9IGQzLm1pbihbY2VudGVyWCwgY2VudGVyWV0pICogMC44XG4gICAgICAgIHRleHRPZmZzID0gMjBcbiAgICAgICAgbmJyQXhpcyA9IGRhdGEubGVuZ3RoXG4gICAgICAgIGFyYyA9IE1hdGguUEkgKiAyIC8gbmJyQXhpc1xuICAgICAgICBkZWdyID0gMzYwIC8gbmJyQXhpc1xuXG4gICAgICAgIGF4aXNHID0gdGhpcy5zZWxlY3QoJy53ay1jaGFydC1heGlzJylcbiAgICAgICAgaWYgYXhpc0cuZW1wdHkoKVxuICAgICAgICAgIGF4aXNHID0gdGhpcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1heGlzJylcblxuICAgICAgICB0aWNrcyA9IHkuc2NhbGUoKS50aWNrcyh5LnRpY2tzKCkpXG4gICAgICAgIHkuc2NhbGUoKS5yYW5nZShbcmFkaXVzLDBdKSAjIHRyaWNrcyB0aGUgd2F5IGF4aXMgYXJlIGRyYXduLiBOb3QgcHJldHR5LCBidXQgd29ya3MgOi0pXG4gICAgICAgIGF4aXMuc2NhbGUoeS5zY2FsZSgpKS5vcmllbnQoJ3JpZ2h0JykudGlja1ZhbHVlcyh0aWNrcykudGlja0Zvcm1hdCh5LnRpY2tGb3JtYXQoKSlcbiAgICAgICAgYXhpc0cuY2FsbChheGlzKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCN7Y2VudGVyWS1yYWRpdXN9KVwiKVxuICAgICAgICB5LnNjYWxlKCkucmFuZ2UoWzAscmFkaXVzXSlcblxuICAgICAgICBsaW5lcyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy1saW5lJykuZGF0YShkYXRhLChkKSAtPiBkLmF4aXMpXG4gICAgICAgIGxpbmVzLmVudGVyKClcbiAgICAgICAgICAuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcy1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdkYXJrZ3JleScpXG5cbiAgICAgICAgbGluZXNcbiAgICAgICAgICAuYXR0cih7eDE6MCwgeTE6MCwgeDI6MCwgeTI6cmFkaXVzfSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCxpKSAtPiBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KXJvdGF0ZSgje2RlZ3IgKiBpfSlcIilcblxuICAgICAgICBsaW5lcy5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICAjZHJhdyB0aWNrIGxpbmVzXG4gICAgICAgIHRpY2tMaW5lID0gZDMuc3ZnLmxpbmUoKS54KChkKSAtPiBkLngpLnkoKGQpLT5kLnkpXG4gICAgICAgIHRpY2tQYXRoID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC10aWNrUGF0aCcpLmRhdGEodGlja3MpXG4gICAgICAgIHRpY2tQYXRoLmVudGVyKCkuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtdGlja1BhdGgnKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsICdub25lJykuc3R5bGUoJ3N0cm9rZScsICdsaWdodGdyZXknKVxuXG4gICAgICAgIHRpY2tQYXRoXG4gICAgICAgICAgLmF0dHIoJ2QnLChkKSAtPlxuICAgICAgICAgICAgcCA9IGRhdGEubWFwKChhLCBpKSAtPiB7eDpNYXRoLnNpbihhcmMqaSkgKiB5LnNjYWxlKCkoZCkseTpNYXRoLmNvcyhhcmMqaSkgKiB5LnNjYWxlKCkoZCl9KVxuICAgICAgICAgICAgdGlja0xpbmUocCkgKyAnWicpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7Y2VudGVyWH0sICN7Y2VudGVyWX0pXCIpXG5cbiAgICAgICAgdGlja1BhdGguZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgYXhpc0xhYmVscyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy10ZXh0JykuZGF0YShkYXRhLChkKSAtPiB4LnZhbHVlKGQpKVxuICAgICAgICBheGlzTGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcy10ZXh0JylcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgICAgIC5hdHRyKCdkeScsICcwLjhlbScpXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgIGF4aXNMYWJlbHNcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIHg6IChkLCBpKSAtPiBjZW50ZXJYICsgTWF0aC5zaW4oYXJjICogaSkgKiAocmFkaXVzICsgdGV4dE9mZnMpXG4gICAgICAgICAgICAgIHk6IChkLCBpKSAtPiBjZW50ZXJZICsgTWF0aC5jb3MoYXJjICogaSkgKiAocmFkaXVzICsgdGV4dE9mZnMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIC50ZXh0KChkKSAtPiB4LnZhbHVlKGQpKVxuXG4gICAgICAgICMgZHJhdyBkYXRhIGxpbmVzXG5cbiAgICAgICAgZGF0YVBhdGggPSBkMy5zdmcubGluZSgpLngoKGQpIC0+IGQueCkueSgoZCkgLT4gZC55KVxuXG4gICAgICAgIGRhdGFMaW5lID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC1kYXRhLWxpbmUnKS5kYXRhKHkubGF5ZXJLZXlzKGRhdGEpKVxuICAgICAgICBkYXRhTGluZS5lbnRlcigpLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWRhdGEtbGluZScpXG4gICAgICAgICAgLnN0eWxlKHtcbiAgICAgICAgICAgIHN0cm9rZTooZCkgLT4gY29sb3Iuc2NhbGUoKShkKVxuICAgICAgICAgICAgZmlsbDooZCkgLT4gY29sb3Iuc2NhbGUoKShkKVxuICAgICAgICAgICAgJ2ZpbGwtb3BhY2l0eSc6IDAuMlxuICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDJcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIGRhdGFMaW5lLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIHAgPSBkYXRhLm1hcCgoYSwgaSkgLT4ge3g6TWF0aC5zaW4oYXJjKmkpICogeS5zY2FsZSgpKGFbZF0pLHk6TWF0aC5jb3MoYXJjKmkpICogeS5zY2FsZSgpKGFbZF0pfSlcbiAgICAgICAgICAgIGRhdGFQYXRoKHApICsgJ1onXG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KVwiKVxuXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgX3NjYWxlTGlzdC55LmRvbWFpbkNhbGMoJ21heCcpXG4gICAgICAgIF9zY2FsZUxpc3QueC5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICAjQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gIH1cblxuI1RPRE8gdmVyaWZ5IGJlaGF2aW9yIHdpdGggY3VzdG9tIHRvb2x0aXBzXG4jVE9ETyBmaXggJ3Rvb2x0aXAgYXR0cmlidXRlIGxpc3QgdG9vIGxvbmcnIHByb2JsZW1cbiNUT0RPIGFkZCBlbnRlciAvIGV4aXQgYW5pbWF0aW9uIGJlaGF2aW9yXG4jVE9ETyBJbXBsZW1lbnQgZGF0YSBsYWJlbHNcbiNUT0RPIGltcGxlbWVudCBhbmQgdGVzdCBvYmplY3Qgc2VsZWN0aW9uIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JCcnVzaCcsICgkbG9nLCAkd2luZG93LCBzZWxlY3Rpb25TaGFyaW5nLCB0aW1pbmcpIC0+XG5cbiAgYmVoYXZpb3JCcnVzaCA9ICgpIC0+XG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBfYWN0aXZlID0gZmFsc2VcbiAgICBfb3ZlcmxheSA9IHVuZGVmaW5lZFxuICAgIF9leHRlbnQgPSB1bmRlZmluZWRcbiAgICBfc3RhcnRQb3MgPSB1bmRlZmluZWRcbiAgICBfZXZUYXJnZXREYXRhID0gdW5kZWZpbmVkXG4gICAgX2FyZWEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9hcmVhU2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2FyZWFCb3ggPSB1bmRlZmluZWRcbiAgICBfYmFja2dyb3VuZEJveCA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfc2VsZWN0YWJsZXMgPSAgdW5kZWZpbmVkXG4gICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcbiAgICBfeCA9IHVuZGVmaW5lZFxuICAgIF95ID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICBfYnJ1c2hYWSA9IGZhbHNlXG4gICAgX2JydXNoWCA9IGZhbHNlXG4gICAgX2JydXNoWSA9IGZhbHNlXG4gICAgX2JvdW5kc0lkeCA9IHVuZGVmaW5lZFxuICAgIF9ib3VuZHNWYWx1ZXMgPSB1bmRlZmluZWRcbiAgICBfYm91bmRzRG9tYWluID0gdW5kZWZpbmVkXG4gICAgX2JydXNoRXZlbnRzID0gZDMuZGlzcGF0Y2goJ2JydXNoU3RhcnQnLCAnYnJ1c2gnLCAnYnJ1c2hFbmQnKVxuXG4gICAgbGVmdCA9IHRvcCA9IHJpZ2h0ID0gYm90dG9tID0gc3RhcnRUb3AgPSBzdGFydExlZnQgPSBzdGFydFJpZ2h0ID0gc3RhcnRCb3R0b20gPSB1bmRlZmluZWRcblxuICAgICMtLS0gQnJ1c2ggdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcG9zaXRpb25CcnVzaEVsZW1lbnRzID0gKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSkgLT5cbiAgICAgIHdpZHRoID0gcmlnaHQgLSBsZWZ0XG4gICAgICBoZWlnaHQgPSBib3R0b20gLSB0b3BcblxuICAgICAgIyBwb3NpdGlvbiByZXNpemUtaGFuZGxlcyBpbnRvIHRoZSByaWdodCBjb3JuZXJzXG4gICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7Ym90dG9tfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbmUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje3RvcH0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW53JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tyaWdodH0sI3tib3R0b219KVwiKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3tib3R0b219KVwiKVxuICAgICAgICBfZXh0ZW50LmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCkuYXR0cigneCcsIGxlZnQpLmF0dHIoJ3knLCB0b3ApXG4gICAgICBpZiBfYnJ1c2hYXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXcnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LDApXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LDApXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodClcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBfYXJlYUJveC5oZWlnaHQpLmF0dHIoJ3gnLCBsZWZ0KS5hdHRyKCd5JywgMClcbiAgICAgIGlmIF9icnVzaFlcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbicpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje2JvdHRvbX0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW4nKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCBfYXJlYUJveC53aWR0aClcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpLmF0dHIoJ3gnLCAwKS5hdHRyKCd5JywgdG9wKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldFNlbGVjdGVkT2JqZWN0cyA9ICgpIC0+XG4gICAgICBlciA9IF9leHRlbnQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBfc2VsZWN0YWJsZXMuZWFjaCgoZCkgLT5cbiAgICAgICAgICBjciA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICB4SGl0ID0gZXIubGVmdCA8IGNyLnJpZ2h0IC0gY3Iud2lkdGggLyAzIGFuZCBjci5sZWZ0ICsgY3Iud2lkdGggLyAzIDwgZXIucmlnaHRcbiAgICAgICAgICB5SGl0ID0gZXIudG9wIDwgY3IuYm90dG9tIC0gY3IuaGVpZ2h0IC8gMyBhbmQgY3IudG9wICsgY3IuaGVpZ2h0IC8gMyA8IGVyLmJvdHRvbVxuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCd3ay1jaGFydC1zZWxlY3RlZCcsIHlIaXQgYW5kIHhIaXQpXG4gICAgICAgIClcbiAgICAgIHJldHVybiBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGVkJykuZGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgc2V0U2VsZWN0aW9uID0gKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSkgLT5cbiAgICAgIGlmIF9icnVzaFhcbiAgICAgICAgX2JvdW5kc0lkeCA9IFttZS54KCkuaW52ZXJ0KGxlZnQpLCBtZS54KCkuaW52ZXJ0KHJpZ2h0KV1cbiAgICAgICAgaWYgbWUueCgpLmlzT3JkaW5hbCgpXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IF9kYXRhLm1hcCgoZCkgLT4gbWUueCgpLnZhbHVlKGQpKS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbbWUueCgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMF1dKSwgbWUueCgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMV1dKV1cbiAgICAgICAgX2JvdW5kc0RvbWFpbiA9IF9kYXRhLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgaWYgX2JydXNoWVxuICAgICAgICBfYm91bmRzSWR4ID0gW21lLnkoKS5pbnZlcnQoYm90dG9tKSwgbWUueSgpLmludmVydCh0b3ApXVxuICAgICAgICBpZiBtZS55KCkuaXNPcmRpbmFsKClcbiAgICAgICAgICBfYm91bmRzVmFsdWVzID0gX2RhdGEubWFwKChkKSAtPiBtZS55KCkudmFsdWUoZCkpLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFttZS55KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFswXV0pLCBtZS55KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFsxXV0pXVxuICAgICAgICBfYm91bmRzRG9tYWluID0gX2RhdGEuc2xpY2UoX2JvdW5kc0lkeFswXSwgX2JvdW5kc0lkeFsxXSArIDEpXG4gICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICBfYm91bmRzSWR4ID0gW11cbiAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFtdXG4gICAgICAgIF9ib3VuZHNEb21haW4gPSBnZXRTZWxlY3RlZE9iamVjdHMoKVxuXG4gICAgIy0tLSBCcnVzaFN0YXJ0IEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG5cbiAgICBicnVzaFN0YXJ0ID0gKCkgLT5cbiAgICAgICNyZWdpc3RlciBhIG1vdXNlIGhhbmRsZXJzIGZvciB0aGUgYnJ1c2hcbiAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIF9ldlRhcmdldERhdGEgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5kYXR1bSgpXG4gICAgICBfIGlmIG5vdCBfZXZUYXJnZXREYXRhXG4gICAgICAgIF9ldlRhcmdldERhdGEgPSB7bmFtZTonZm9yd2FyZGVkJ31cbiAgICAgIF9hcmVhQm94ID0gX2FyZWEuZ2V0QkJveCgpXG4gICAgICBfc3RhcnRQb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIHN0YXJ0VG9wID0gdG9wXG4gICAgICBzdGFydExlZnQgPSBsZWZ0XG4gICAgICBzdGFydFJpZ2h0ID0gcmlnaHRcbiAgICAgIHN0YXJ0Qm90dG9tID0gYm90dG9tXG4gICAgICBkMy5zZWxlY3QoX2FyZWEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKS5zZWxlY3RBbGwoXCIud2stY2hhcnQtcmVzaXplXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKVxuICAgICAgZDMuc2VsZWN0KCdib2R5Jykuc3R5bGUoJ2N1cnNvcicsIGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpLnN0eWxlKCdjdXJzb3InKSlcblxuICAgICAgZDMuc2VsZWN0KCR3aW5kb3cpLm9uKCdtb3VzZW1vdmUuYnJ1c2gnLCBicnVzaE1vdmUpLm9uKCdtb3VzZXVwLmJydXNoJywgYnJ1c2hFbmQpXG5cbiAgICAgIF90b29sdGlwLmhpZGUodHJ1ZSlcbiAgICAgIF9ib3VuZHNJZHggPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RhYmxlcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2hTdGFydCgpXG4gICAgICB0aW1pbmcuY2xlYXIoKVxuICAgICAgdGltaW5nLmluaXQoKVxuXG4gICAgIy0tLSBCcnVzaEVuZCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGJydXNoRW5kID0gKCkgLT5cbiAgICAgICNkZS1yZWdpc3RlciBoYW5kbGVyc1xuXG4gICAgICBkMy5zZWxlY3QoJHdpbmRvdykub24gJ21vdXNlbW92ZS5icnVzaCcsIG51bGxcbiAgICAgIGQzLnNlbGVjdCgkd2luZG93KS5vbiAnbW91c2V1cC5icnVzaCcsIG51bGxcbiAgICAgIGQzLnNlbGVjdChfYXJlYSkuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnYWxsJykuc2VsZWN0QWxsKCcud2stY2hhcnQtcmVzaXplJykuc3R5bGUoJ2Rpc3BsYXknLCBudWxsKSAjIHNob3cgdGhlIHJlc2l6ZSBoYW5kbGVyc1xuICAgICAgZDMuc2VsZWN0KCdib2R5Jykuc3R5bGUoJ2N1cnNvcicsIG51bGwpXG4gICAgICBpZiBib3R0b20gLSB0b3AgaXMgMCBvciByaWdodCAtIGxlZnQgaXMgMFxuICAgICAgICAjYnJ1c2ggaXMgZW1wdHlcbiAgICAgICAgZDMuc2VsZWN0KF9hcmVhKS5zZWxlY3RBbGwoJy53ay1jaGFydC1yZXNpemUnKS5zdHlsZSgnZGlzcGxheScsICdub25lJylcbiAgICAgIF90b29sdGlwLmhpZGUoZmFsc2UpXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2hFbmQoX2JvdW5kc0lkeClcbiAgICAgIHRpbWluZy5yZXBvcnQoKVxuXG4gICAgIy0tLSBCcnVzaE1vdmUgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGJydXNoTW92ZSA9ICgpIC0+XG4gICAgICAkbG9nLmluZm8gJ2JydXNobW92ZSdcbiAgICAgIHBvcyA9IGQzLm1vdXNlKF9hcmVhKVxuICAgICAgZGVsdGFYID0gcG9zWzBdIC0gX3N0YXJ0UG9zWzBdXG4gICAgICBkZWx0YVkgPSBwb3NbMV0gLSBfc3RhcnRQb3NbMV1cblxuICAgICAgIyB0aGlzIGVsYWJvcmF0ZSBjb2RlIGlzIG5lZWRlZCB0byBkZWFsIHdpdGggc2NlbmFyaW9zIHdoZW4gbW91c2UgbW92ZXMgZmFzdCBhbmQgdGhlIGV2ZW50cyBkbyBub3QgaGl0IHgveSArIGRlbHRhXG4gICAgICAjIGRvZXMgbm90IGhpIHRoZSAwIHBvaW50IG1heWUgdGhlcmUgaXMgYSBtb3JlIGVsZWdhbnQgd2F5IHRvIHdyaXRlIHRoaXMsIGJ1dCBmb3Igbm93IGl0IHdvcmtzIDotKVxuXG4gICAgICBsZWZ0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0TGVmdCArIGRlbHRhXG4gICAgICAgIGxlZnQgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydFJpZ2h0IHRoZW4gcG9zIGVsc2Ugc3RhcnRSaWdodCkgZWxzZSAwXG4gICAgICAgIHJpZ2h0ID0gaWYgcG9zIDw9IF9hcmVhQm94LndpZHRoIHRoZW4gKGlmIHBvcyA8IHN0YXJ0UmlnaHQgdGhlbiBzdGFydFJpZ2h0IGVsc2UgcG9zKSBlbHNlIF9hcmVhQm94LndpZHRoXG5cbiAgICAgIHJpZ2h0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0UmlnaHQgKyBkZWx0YVxuICAgICAgICBsZWZ0ID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRMZWZ0IHRoZW4gcG9zIGVsc2Ugc3RhcnRMZWZ0KSBlbHNlIDBcbiAgICAgICAgcmlnaHQgPSBpZiBwb3MgPD0gX2FyZWFCb3gud2lkdGggdGhlbiAoaWYgcG9zIDwgc3RhcnRMZWZ0IHRoZW4gc3RhcnRMZWZ0IGVsc2UgcG9zKSBlbHNlIF9hcmVhQm94LndpZHRoXG5cbiAgICAgIHRvcE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydFRvcCArIGRlbHRhXG4gICAgICAgIHRvcCA9IGlmIHBvcyA+PSAwIHRoZW4gKGlmIHBvcyA8IHN0YXJ0Qm90dG9tIHRoZW4gcG9zIGVsc2Ugc3RhcnRCb3R0b20pIGVsc2UgMFxuICAgICAgICBib3R0b20gPSBpZiBwb3MgPD0gX2FyZWFCb3guaGVpZ2h0IHRoZW4gKGlmIHBvcyA+IHN0YXJ0Qm90dG9tIHRoZW4gcG9zIGVsc2Ugc3RhcnRCb3R0b20gKSBlbHNlIF9hcmVhQm94LmhlaWdodFxuXG4gICAgICBib3R0b21NdiA9IChkZWx0YSkgLT5cbiAgICAgICAgcG9zID0gc3RhcnRCb3R0b20gKyBkZWx0YVxuICAgICAgICB0b3AgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydFRvcCB0aGVuIHBvcyBlbHNlIHN0YXJ0VG9wKSBlbHNlIDBcbiAgICAgICAgYm90dG9tID0gaWYgcG9zIDw9IF9hcmVhQm94LmhlaWdodCB0aGVuIChpZiBwb3MgPiBzdGFydFRvcCB0aGVuIHBvcyBlbHNlIHN0YXJ0VG9wICkgZWxzZSBfYXJlYUJveC5oZWlnaHRcblxuICAgICAgaG9yTXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIGlmIHN0YXJ0TGVmdCArIGRlbHRhID49IDBcbiAgICAgICAgICBpZiBzdGFydFJpZ2h0ICsgZGVsdGEgPD0gX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICAgIGxlZnQgPSBzdGFydExlZnQgKyBkZWx0YVxuICAgICAgICAgICAgcmlnaHQgPSBzdGFydFJpZ2h0ICsgZGVsdGFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByaWdodCA9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgICBsZWZ0ID0gX2FyZWFCb3gud2lkdGggLSAoc3RhcnRSaWdodCAtIHN0YXJ0TGVmdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxlZnQgPSAwXG4gICAgICAgICAgcmlnaHQgPSBzdGFydFJpZ2h0IC0gc3RhcnRMZWZ0XG5cbiAgICAgIHZlcnRNdiA9IChkZWx0YSkgLT5cbiAgICAgICAgaWYgc3RhcnRUb3AgKyBkZWx0YSA+PSAwXG4gICAgICAgICAgaWYgc3RhcnRCb3R0b20gKyBkZWx0YSA8PSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgIHRvcCA9IHN0YXJ0VG9wICsgZGVsdGFcbiAgICAgICAgICAgIGJvdHRvbSA9IHN0YXJ0Qm90dG9tICsgZGVsdGFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBib3R0b20gPSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgIHRvcCA9IF9hcmVhQm94LmhlaWdodCAtIChzdGFydEJvdHRvbSAtIHN0YXJ0VG9wKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdG9wID0gMFxuICAgICAgICAgIGJvdHRvbSA9IHN0YXJ0Qm90dG9tIC0gc3RhcnRUb3BcblxuICAgICAgc3dpdGNoIF9ldlRhcmdldERhdGEubmFtZVxuICAgICAgICB3aGVuICdiYWNrZ3JvdW5kJywgJ2ZvcndhcmRlZCdcbiAgICAgICAgICBpZiBkZWx0YVggKyBfc3RhcnRQb3NbMF0gPiAwXG4gICAgICAgICAgICBsZWZ0ID0gaWYgZGVsdGFYIDwgMCB0aGVuIF9zdGFydFBvc1swXSArIGRlbHRhWCBlbHNlIF9zdGFydFBvc1swXVxuICAgICAgICAgICAgaWYgbGVmdCArIE1hdGguYWJzKGRlbHRhWCkgPCBfYXJlYUJveC53aWR0aFxuICAgICAgICAgICAgICByaWdodCA9IGxlZnQgKyBNYXRoLmFicyhkZWx0YVgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJpZ2h0ID0gX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsZWZ0ID0gMFxuXG4gICAgICAgICAgaWYgZGVsdGFZICsgX3N0YXJ0UG9zWzFdID4gMFxuICAgICAgICAgICAgdG9wID0gaWYgZGVsdGFZIDwgMCB0aGVuIF9zdGFydFBvc1sxXSArIGRlbHRhWSBlbHNlIF9zdGFydFBvc1sxXVxuICAgICAgICAgICAgaWYgdG9wICsgTWF0aC5hYnMoZGVsdGFZKSA8IF9hcmVhQm94LmhlaWdodFxuICAgICAgICAgICAgICBib3R0b20gPSB0b3AgKyBNYXRoLmFicyhkZWx0YVkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGJvdHRvbSA9IF9hcmVhQm94LmhlaWdodFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRvcCA9IDBcbiAgICAgICAgd2hlbiAnZXh0ZW50J1xuICAgICAgICAgIHZlcnRNdihkZWx0YVkpOyBob3JNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ24nXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKVxuICAgICAgICB3aGVuICdzJ1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSlcbiAgICAgICAgd2hlbiAndydcbiAgICAgICAgICBsZWZ0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICdlJ1xuICAgICAgICAgIHJpZ2h0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICdudydcbiAgICAgICAgICB0b3BNdihkZWx0YVkpOyBsZWZ0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICduZSdcbiAgICAgICAgICB0b3BNdihkZWx0YVkpOyByaWdodE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnc3cnXG4gICAgICAgICAgYm90dG9tTXYoZGVsdGFZKTsgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnc2UnXG4gICAgICAgICAgYm90dG9tTXYoZGVsdGFZKTsgcmlnaHRNdihkZWx0YVgpXG5cbiAgICAgIHBvc2l0aW9uQnJ1c2hFbGVtZW50cyhsZWZ0LCByaWdodCwgdG9wLCBib3R0b20pXG4gICAgICBzZXRTZWxlY3Rpb24obGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoKF9ib3VuZHNJZHgsIF9ib3VuZHNWYWx1ZXMsIF9ib3VuZHNEb21haW4pXG4gICAgICBzZWxlY3Rpb25TaGFyaW5nLnNldFNlbGVjdGlvbiBfYm91bmRzVmFsdWVzLCBfYnJ1c2hHcm91cFxuXG4gICAgIy0tLSBCcnVzaCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmJydXNoID0gKHMpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX292ZXJsYXlcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9hY3RpdmUgdGhlbiByZXR1cm5cbiAgICAgICAgX292ZXJsYXkgPSBzXG4gICAgICAgIF9icnVzaFhZID0gbWUueCgpIGFuZCBtZS55KClcbiAgICAgICAgX2JydXNoWCA9IG1lLngoKSBhbmQgbm90IG1lLnkoKVxuICAgICAgICBfYnJ1c2hZID0gbWUueSgpIGFuZCBub3QgbWUueCgpXG4gICAgICAgICMgY3JlYXRlIHRoZSBoYW5kbGVyIGVsZW1lbnRzIGFuZCByZWdpc3RlciB0aGUgaGFuZGxlcnNcbiAgICAgICAgcy5zdHlsZSh7J3BvaW50ZXItZXZlbnRzJzogJ2FsbCcsIGN1cnNvcjogJ2Nyb3NzaGFpcid9KVxuICAgICAgICBfZXh0ZW50ID0gcy5hcHBlbmQoJ3JlY3QnKS5hdHRyKHtjbGFzczond2stY2hhcnQtZXh0ZW50JywgeDowLCB5OjAsIHdpZHRoOjAsIGhlaWdodDowfSkuc3R5bGUoJ2N1cnNvcicsJ21vdmUnKS5kYXR1bSh7bmFtZTonZXh0ZW50J30pXG4gICAgICAgICMgcmVzaXplIGhhbmRsZXMgZm9yIHRoZSBzaWRlc1xuICAgICAgICBpZiBfYnJ1c2hZIG9yIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbicpLnN0eWxlKHtjdXJzb3I6J25zLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OjAsIHk6IC0zLCB3aWR0aDowLCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOiduJ30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtcycpLnN0eWxlKHtjdXJzb3I6J25zLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OjAsIHk6IC0zLCB3aWR0aDowLCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidzJ30pXG4gICAgICAgIGlmIF9icnVzaFggb3IgX2JydXNoWFlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC13Jykuc3R5bGUoe2N1cnNvcjonZXctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3k6MCwgeDogLTMsIHdpZHRoOjYsIGhlaWdodDowfSkuZGF0dW0oe25hbWU6J3cnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1lJykuc3R5bGUoe2N1cnNvcjonZXctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3k6MCwgeDogLTMsIHdpZHRoOjYsIGhlaWdodDowfSkuZGF0dW0oe25hbWU6J2UnfSlcbiAgICAgICAgIyByZXNpemUgaGFuZGxlcyBmb3IgdGhlIGNvcm5lcnNcbiAgICAgICAgaWYgX2JydXNoWFlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1udycpLnN0eWxlKHtjdXJzb3I6J253c2UtcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J253J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbmUnKS5zdHlsZSh7Y3Vyc29yOiduZXN3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOiduZSd9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LXN3Jykuc3R5bGUoe2N1cnNvcjonbmVzdy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6IC0zLCB5OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonc3cnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1zZScpLnN0eWxlKHtjdXJzb3I6J253c2UtcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J3NlJ30pXG4gICAgICAgICNyZWdpc3RlciBoYW5kbGVyLiBQbGVhc2Ugbm90ZSwgYnJ1c2ggd2FudHMgdGhlIG1vdXNlIGRvd24gZXhjbHVzaXZlbHkgISEhXG4gICAgICAgIHMub24gJ21vdXNlZG93bi5icnVzaCcsIGJydXNoU3RhcnRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIEV4dGVudCByZXNpemUgaGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcmVzaXplRXh0ZW50ID0gKCkgLT5cbiAgICAgIGlmIF9hcmVhQm94XG4gICAgICAgICRsb2cuaW5mbyAncmVzaXplSGFuZGxlcidcbiAgICAgICAgbmV3Qm94ID0gX2FyZWEuZ2V0QkJveCgpXG4gICAgICAgIGhvcml6b250YWxSYXRpbyA9IF9hcmVhQm94LndpZHRoIC8gbmV3Qm94LndpZHRoXG4gICAgICAgIHZlcnRpY2FsUmF0aW8gPSBfYXJlYUJveC5oZWlnaHQgLyBuZXdCb3guaGVpZ2h0XG4gICAgICAgIHRvcCA9IHRvcCAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgc3RhcnRUb3AgPSBzdGFydFRvcCAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgYm90dG9tID0gYm90dG9tIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBzdGFydEJvdHRvbSA9IHN0YXJ0Qm90dG9tIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBsZWZ0ID0gbGVmdCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBzdGFydExlZnQgPSBzdGFydExlZnQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgcmlnaHQgPSByaWdodCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBzdGFydFJpZ2h0ID0gc3RhcnRSaWdodCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBfc3RhcnRQb3NbMF0gPSBfc3RhcnRQb3NbMF0gLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgX3N0YXJ0UG9zWzFdID0gX3N0YXJ0UG9zWzFdIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBfYXJlYUJveCA9IG5ld0JveFxuICAgICAgICBwb3NpdGlvbkJydXNoRWxlbWVudHMobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuXG4gICAgIy0tLSBCcnVzaCBQcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5jaGFydCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IHZhbFxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gJ3Jlc2l6ZS5icnVzaCcsIHJlc2l6ZUV4dGVudFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYWN0aXZlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYWN0aXZlXG4gICAgICBlbHNlXG4gICAgICAgIF9hY3RpdmUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnggPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF94XG4gICAgICBlbHNlXG4gICAgICAgIF94ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS55ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfeVxuICAgICAgZWxzZVxuICAgICAgICBfeSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXJlYSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FyZWFTZWxlY3Rpb25cbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9hcmVhU2VsZWN0aW9uXG4gICAgICAgICAgX2FyZWFTZWxlY3Rpb24gPSB2YWxcbiAgICAgICAgICBfYXJlYSA9IF9hcmVhU2VsZWN0aW9uLm5vZGUoKVxuICAgICAgICAgICNfYXJlYUJveCA9IF9hcmVhLmdldEJCb3goKSBuZWVkIHRvIGdldCB3aGVuIGNhbGN1bGF0aW5nIHNpemUgdG8gZGVhbCB3aXRoIHJlc2l6aW5nXG4gICAgICAgICAgbWUuYnJ1c2goX2FyZWFTZWxlY3Rpb24pXG5cbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmNvbnRhaW5lciA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gdmFsXG4gICAgICAgIF9zZWxlY3RhYmxlcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5kYXRhID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfZGF0YSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYnJ1c2hHcm91cCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2JydXNoR3JvdXBcbiAgICAgIGVsc2VcbiAgICAgICAgX2JydXNoR3JvdXAgPSB2YWxcbiAgICAgICAgc2VsZWN0aW9uU2hhcmluZy5jcmVhdGVHcm91cChfYnJ1c2hHcm91cClcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnRvb2x0aXAgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90b29sdGlwXG4gICAgICBlbHNlXG4gICAgICAgIF90b29sdGlwID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgIF9icnVzaEV2ZW50cy5vbiBuYW1lLCBjYWxsYmFja1xuXG4gICAgbWUuZXh0ZW50ID0gKCkgLT5cbiAgICAgIHJldHVybiBfYm91bmRzSWR4XG5cbiAgICBtZS5ldmVudHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9icnVzaEV2ZW50c1xuXG4gICAgbWUuZW1wdHkgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9ib3VuZHNJZHggaXMgdW5kZWZpbmVkXG5cbiAgICByZXR1cm4gbWVcbiAgcmV0dXJuIGJlaGF2aW9yQnJ1c2giLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvclNlbGVjdCcsICgkbG9nKSAtPlxuICBzZWxlY3RJZCA9IDBcblxuICBzZWxlY3QgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJzZWxlY3Qje3NlbGVjdElkKyt9XCJcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2FjdGl2ZSA9IGZhbHNlXG4gICAgX3NlbGVjdGlvbkV2ZW50cyA9IGQzLmRpc3BhdGNoKCdzZWxlY3RlZCcpXG5cbiAgICBjbGlja2VkID0gKCkgLT5cbiAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICBvYmogPSBkMy5zZWxlY3QodGhpcylcbiAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICBpZiBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIGlzU2VsZWN0ZWQgPSBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0ZWQnKVxuICAgICAgICBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0ZWQnLCBub3QgaXNTZWxlY3RlZClcbiAgICAgICAgYWxsU2VsZWN0ZWQgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGVkJykuZGF0YSgpLm1hcCgoZCkgLT4gaWYgZC5kYXRhIHRoZW4gZC5kYXRhIGVsc2UgZClcbiAgICAgICAgIyBlbnN1cmUgdGhhdCBvbmx5IHRoZSBvcmlnaW5hbCB2YWx1ZXMgYXJlIHJlcG9ydGVkIGJhY2tcblxuICAgICAgICBfc2VsZWN0aW9uRXZlbnRzLnNlbGVjdGVkKGFsbFNlbGVjdGVkKVxuXG4gICAgbWUgPSAoc2VsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIG1lXG4gICAgICBlbHNlXG4gICAgICAgIHNlbFxuICAgICAgICAgICMgcmVnaXN0ZXIgc2VsZWN0aW9uIGV2ZW50c1xuICAgICAgICAgIC5vbiAnY2xpY2snLCBjbGlja2VkXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuaWQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuYWN0aXZlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYWN0aXZlXG4gICAgICBlbHNlXG4gICAgICAgIF9hY3RpdmUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmNvbnRhaW5lciA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5ldmVudHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zZWxlY3Rpb25FdmVudHNcblxuICAgIG1lLm9uID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgX3NlbGVjdGlvbkV2ZW50cy5vbiBuYW1lLCBjYWxsYmFja1xuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gc2VsZWN0IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JUb29sdGlwJywgKCRsb2csICRkb2N1bWVudCwgJHJvb3RTY29wZSwgJGNvbXBpbGUsICR0ZW1wbGF0ZUNhY2hlLCB0ZW1wbGF0ZURpcikgLT5cblxuICBiZWhhdmlvclRvb2x0aXAgPSAoKSAtPlxuXG4gICAgX2FjdGl2ZSA9IGZhbHNlXG4gICAgX3BhdGggPSAnJ1xuICAgIF9oaWRlID0gZmFsc2VcbiAgICBfc2hvd01hcmtlckxpbmUgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyRyA9IHVuZGVmaW5lZFxuICAgIF9tYXJrZXJMaW5lID0gdW5kZWZpbmVkXG4gICAgX2FyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICBfYXJlYT0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9tYXJrZXJTY2FsZSA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXBEaXNwYXRjaCA9IGQzLmRpc3BhdGNoKCdlbnRlcicsICdtb3ZlRGF0YScsICdtb3ZlTWFya2VyJywgJ2xlYXZlJylcblxuICAgIF90ZW1wbCA9ICR0ZW1wbGF0ZUNhY2hlLmdldCh0ZW1wbGF0ZURpciArICd0b29sVGlwLmh0bWwnKVxuICAgIF90ZW1wbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpXG4gICAgX2NvbXBpbGVkVGVtcGwgPSAkY29tcGlsZShfdGVtcGwpKF90ZW1wbFNjb3BlKVxuICAgIGJvZHkgPSAkZG9jdW1lbnQuZmluZCgnYm9keScpXG5cbiAgICBib2R5UmVjdCA9IGJvZHlbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0gaGVscGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBwb3NpdGlvbkJveCA9ICgpIC0+XG4gICAgICByZWN0ID0gX2NvbXBpbGVkVGVtcGxbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNsaWVudFggPSBpZiBib2R5UmVjdC5yaWdodCAtIDIwID4gZDMuZXZlbnQuY2xpZW50WCArIHJlY3Qud2lkdGggKyAxMCB0aGVuIGQzLmV2ZW50LmNsaWVudFggKyAxMCBlbHNlIGQzLmV2ZW50LmNsaWVudFggLSByZWN0LndpZHRoIC0gMTBcbiAgICAgIGNsaWVudFkgPSBpZiBib2R5UmVjdC5ib3R0b20gLSAyMCA+IGQzLmV2ZW50LmNsaWVudFkgKyByZWN0LmhlaWdodCArIDEwIHRoZW4gZDMuZXZlbnQuY2xpZW50WSArIDEwIGVsc2UgZDMuZXZlbnQuY2xpZW50WSAtIHJlY3QuaGVpZ2h0IC0gMTBcbiAgICAgIF90ZW1wbFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICBsZWZ0OiBjbGllbnRYICsgJ3B4J1xuICAgICAgICB0b3A6IGNsaWVudFkgKyAncHgnXG4gICAgICAgICd6LWluZGV4JzogMTUwMFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9XG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKVxuXG4gICAgcG9zaXRpb25Jbml0aWFsID0gKCkgLT5cbiAgICAgIF90ZW1wbFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICBsZWZ0OiAwICsgJ3B4J1xuICAgICAgICB0b3A6IDAgKyAncHgnXG4gICAgICAgICd6LWluZGV4JzogMTUwMFxuICAgICAgICBvcGFjaXR5OiAwXG4gICAgICB9XG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKSAgIyBlbnN1cmUgdG9vbHRpcCBnZXRzIHJlbmRlcmVkXG4gICAgICAjd2F5aXQgdW50aWwgaXQgaXMgcmVuZGVyZWQgYW5kIHRoZW4gcmVwb3NpdGlvblxuICAgICAgXy50aHJvdHRsZSBwb3NpdGlvbkJveCwgMjAwXG5cbiAgICAjLS0tIFRvb2x0aXBTdGFydCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcEVudGVyID0gKCkgLT5cbiAgICAgIGlmIG5vdCBfYWN0aXZlIG9yIF9oaWRlIHRoZW4gcmV0dXJuXG4gICAgICAjIGFwcGVuZCBkYXRhIGRpdlxuICAgICAgYm9keS5hcHBlbmQoX2NvbXBpbGVkVGVtcGwpXG4gICAgICBfdGVtcGxTY29wZS5sYXllcnMgPSBbXVxuXG4gICAgICAjIGdldCB0b29sdGlwIGRhdGEgdmFsdWVcblxuICAgICAgaWYgX3Nob3dNYXJrZXJMaW5lXG4gICAgICAgIF9wb3MgPSBkMy5tb3VzZSh0aGlzKVxuICAgICAgICB2YWx1ZSA9IF9tYXJrZXJTY2FsZS5pbnZlcnQoaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpIHRoZW4gX3Bvc1swXSBlbHNlIF9wb3NbMV0pXG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlID0gZDMuc2VsZWN0KHRoaXMpLmRhdHVtKClcblxuICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gdHJ1ZVxuICAgICAgX3RlbXBsU2NvcGUudHREYXRhID0gdmFsdWVcbiAgICAgIF90b29sdGlwRGlzcGF0Y2guZW50ZXIuYXBwbHkoX3RlbXBsU2NvcGUsIFt2YWx1ZV0pICMgY2FsbCBsYXlvdXQgdG8gZmlsbCBpbiBkYXRhXG4gICAgICBwb3NpdGlvbkluaXRpYWwoKVxuXG4gICAgICAjIGNyZWF0ZSBhIG1hcmtlciBsaW5lIGlmIHJlcXVpcmVkXG4gICAgICBpZiBfc2hvd01hcmtlckxpbmVcbiAgICAgICAgI19hcmVhID0gdGhpc1xuICAgICAgICBfYXJlYUJveCA9IF9hcmVhU2VsZWN0aW9uLnNlbGVjdCgnLndrLWNoYXJ0LWJhY2tncm91bmQnKS5ub2RlKCkuZ2V0QkJveCgpXG4gICAgICAgIF9wb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgICAgX21hcmtlckcgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpICAjIG5lZWQgdG8gYXBwZW5kIG1hcmtlciB0byBjaGFydCBhcmVhIHRvIGVuc3VyZSBpdCBpcyBvbiB0b3Agb2YgdGhlIGNoYXJ0IGVsZW1lbnRzIEZpeCAxMFxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC10b29sdGlwLW1hcmtlcicpXG4gICAgICAgIF9tYXJrZXJMaW5lID0gX21hcmtlckcuYXBwZW5kKCdsaW5lJylcbiAgICAgICAgaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpXG4gICAgICAgICAgX21hcmtlckxpbmUuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LW1hcmtlci1saW5lJywgeDA6MCwgeDE6MCwgeTA6MCx5MTpfYXJlYUJveC5oZWlnaHR9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX21hcmtlckxpbmUuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LW1hcmtlci1saW5lJywgeDA6MCwgeDE6X2FyZWFCb3gud2lkdGgsIHkwOjAseTE6MH0pXG5cbiAgICAgICAgX21hcmtlckxpbmUuc3R5bGUoe3N0cm9rZTogJ2RhcmtncmV5JywgJ3BvaW50ZXItZXZlbnRzJzogJ25vbmUnfSlcblxuICAgICAgICBfdG9vbHRpcERpc3BhdGNoLm1vdmVNYXJrZXIuYXBwbHkoX21hcmtlckcsIFt2YWx1ZV0pXG5cbiAgICAjLS0tIFRvb2x0aXBNb3ZlICBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcE1vdmUgPSAoKSAtPlxuICAgICAgaWYgbm90IF9hY3RpdmUgb3IgX2hpZGUgdGhlbiByZXR1cm5cbiAgICAgIF9wb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIHBvc2l0aW9uQm94KClcbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICBkYXRhSWR4ID0gX21hcmtlclNjYWxlLmludmVydChpZiBfbWFya2VyU2NhbGUuaXNIb3Jpem9udGFsKCkgdGhlbiBfcG9zWzBdIGVsc2UgX3Bvc1sxXSlcbiAgICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5tb3ZlTWFya2VyLmFwcGx5KF9tYXJrZXJHLCBbZGF0YUlkeF0pXG4gICAgICAgIF90ZW1wbFNjb3BlLmxheWVycyA9IFtdXG4gICAgICAgIF90b29sdGlwRGlzcGF0Y2gubW92ZURhdGEuYXBwbHkoX3RlbXBsU2NvcGUsIFtkYXRhSWR4XSlcbiAgICAgIF90ZW1wbFNjb3BlLiRhcHBseSgpXG5cbiAgICAjLS0tIFRvb2x0aXBMZWF2ZSBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcExlYXZlID0gKCkgLT5cbiAgICAgICMkbG9nLmRlYnVnICd0b29sdGlwTGVhdmUnLCBfYXJlYVxuICAgICAgaWYgX21hcmtlckdcbiAgICAgICAgX21hcmtlckcucmVtb3ZlKClcbiAgICAgIF9tYXJrZXJHID0gdW5kZWZpbmVkXG4gICAgICBfdGVtcGxTY29wZS50dFNob3cgPSBmYWxzZVxuICAgICAgX2NvbXBpbGVkVGVtcGwucmVtb3ZlKClcblxuICAgICMtLS0gSW50ZXJmYWNlIHRvIGJydXNoIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBmb3J3YXJkVG9CcnVzaCA9IChlKSAtPlxuICAgICAgIyBmb3J3YXJkIHRoZSBtb3VzZG93biBldmVudCB0byB0aGUgYnJ1c2ggb3ZlcmxheSB0byBlbnN1cmUgdGhhdCBicnVzaGluZyBjYW4gc3RhcnQgYXQgYW55IHBvaW50IGluIHRoZSBkcmF3aW5nIGFyZWFcblxuICAgICAgYnJ1c2hfZWxtID0gZDMuc2VsZWN0KF9jb250YWluZXIubm9kZSgpLnBhcmVudEVsZW1lbnQpLnNlbGVjdChcIi53ay1jaGFydC1vdmVybGF5XCIpLm5vZGUoKTtcbiAgICAgIGlmIGQzLmV2ZW50LnRhcmdldCBpc250IGJydXNoX2VsbSAjZG8gbm90IGRpc3BhdGNoIGlmIHRhcmdldCBpcyBvdmVybGF5XG4gICAgICAgIG5ld19jbGlja19ldmVudCA9IG5ldyBFdmVudCgnbW91c2Vkb3duJyk7XG4gICAgICAgIG5ld19jbGlja19ldmVudC5wYWdlWCA9IGQzLmV2ZW50LnBhZ2VYO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQuY2xpZW50WCA9IGQzLmV2ZW50LmNsaWVudFg7XG4gICAgICAgIG5ld19jbGlja19ldmVudC5wYWdlWSA9IGQzLmV2ZW50LnBhZ2VZO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQuY2xpZW50WSA9IGQzLmV2ZW50LmNsaWVudFk7XG4gICAgICAgIGJydXNoX2VsbS5kaXNwYXRjaEV2ZW50KG5ld19jbGlja19ldmVudCk7XG5cblxuICAgIG1lLmhpZGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9oaWRlXG4gICAgICBlbHNlXG4gICAgICAgIF9oaWRlID0gdmFsXG4gICAgICAgIGlmIF9tYXJrZXJHXG4gICAgICAgICAgX21hcmtlckcuc3R5bGUoJ3Zpc2liaWxpdHknLCBpZiBfaGlkZSB0aGVuICdoaWRkZW4nIGVsc2UgJ3Zpc2libGUnKVxuICAgICAgICBfdGVtcGxTY29wZS50dFNob3cgPSBub3QgX2hpZGVcbiAgICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KClcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuXG4gICAgIy0tIFRvb2x0aXAgcHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50ZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzIGlzIDAgdGhlbiByZXR1cm4gX3BhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhdGggPSBwYXRoXG4gICAgICAgIGlmIF9wYXRoLmxlbmd0aCA+IDBcbiAgICAgICAgICBfY3VzdG9tVGVtcGwgPSAkdGVtcGxhdGVDYWNoZS5nZXQoJ3RlbXBsYXRlcy8nICsgX3BhdGgpXG4gICAgICAgICAgIyB3cmFwIHRlbXBsYXRlIGludG8gcG9zaXRpb25pbmcgZGl2XG4gICAgICAgICAgX2N1c3RvbVRlbXBsV3JhcHBlZCA9IFwiPGRpdiBjbGFzcz1cXFwid2stY2hhcnQtdG9vbHRpcFxcXCIgbmctc2hvdz1cXFwidHRTaG93XFxcIiBuZy1zdHlsZT1cXFwicG9zaXRpb25cXFwiPiN7X2N1c3RvbVRlbXBsfTwvZGl2PlwiXG4gICAgICAgICAgX2NvbXBpbGVkVGVtcGwgPSAkY29tcGlsZShfY3VzdG9tVGVtcGxXcmFwcGVkKShfdGVtcGxTY29wZSlcblxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFyZWEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hcmVhU2VsZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIF9hcmVhU2VsZWN0aW9uID0gdmFsXG4gICAgICAgIF9hcmVhID0gX2FyZWFTZWxlY3Rpb24ubm9kZSgpXG4gICAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICAgIG1lLnRvb2x0aXAoX2FyZWFTZWxlY3Rpb24pXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUubWFya2VyU2NhbGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9tYXJrZXJTY2FsZVxuICAgICAgZWxzZVxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBfc2hvd01hcmtlckxpbmUgPSB0cnVlXG4gICAgICAgICAgX21hcmtlclNjYWxlID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlckxpbmUgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGF0YSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLm9uID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5vbiBuYW1lLCBjYWxsYmFja1xuXG4gICAgIy0tLSBUb29sdGlwIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnRvb2x0aXAgPSAocykgLT4gIyByZWdpc3RlciB0aGUgdG9vbHRpcCBldmVudHMgd2l0aCB0aGUgc2VsZWN0aW9uXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gbWVcbiAgICAgIGVsc2UgICMgc2V0IHRvb2x0aXAgZm9yIGFuIG9iamVjdHMgc2VsZWN0aW9uXG4gICAgICAgIHMub24gJ21vdXNlZW50ZXIudG9vbHRpcCcsIHRvb2x0aXBFbnRlclxuICAgICAgICAgIC5vbiAnbW91c2Vtb3ZlLnRvb2x0aXAnLCB0b29sdGlwTW92ZVxuICAgICAgICAgIC5vbiAnbW91c2VsZWF2ZS50b29sdGlwJywgdG9vbHRpcExlYXZlXG4gICAgICAgIGlmIG5vdCBzLmVtcHR5KCkgYW5kIG5vdCBzLmNsYXNzZWQoJ3drLWNoYXJ0LW92ZXJsYXknKVxuICAgICAgICAgIHMub24gJ21vdXNlZG93bi50b29sdGlwJywgZm9yd2FyZFRvQnJ1c2hcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBiZWhhdmlvclRvb2x0aXAiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvcicsICgkbG9nLCAkd2luZG93LCBiZWhhdmlvclRvb2x0aXAsIGJlaGF2aW9yQnJ1c2gsIGJlaGF2aW9yU2VsZWN0KSAtPlxuXG4gIGJlaGF2aW9yID0gKCkgLT5cblxuICAgIF90b29sdGlwID0gYmVoYXZpb3JUb29sdGlwKClcbiAgICBfYnJ1c2ggPSBiZWhhdmlvckJydXNoKClcbiAgICBfc2VsZWN0aW9uID0gYmVoYXZpb3JTZWxlY3QoKVxuICAgIF9icnVzaC50b29sdGlwKF90b29sdGlwKVxuXG4gICAgYXJlYSA9IChhcmVhKSAtPlxuICAgICAgX2JydXNoLmFyZWEoYXJlYSlcbiAgICAgIF90b29sdGlwLmFyZWEoYXJlYSlcblxuICAgIGNvbnRhaW5lciA9IChjb250YWluZXIpIC0+XG4gICAgICBfYnJ1c2guY29udGFpbmVyKGNvbnRhaW5lcilcbiAgICAgIF9zZWxlY3Rpb24uY29udGFpbmVyKGNvbnRhaW5lcilcbiAgICAgIF90b29sdGlwLmNvbnRhaW5lcihjb250YWluZXIpXG5cbiAgICBjaGFydCA9IChjaGFydCkgLT5cbiAgICAgIF9icnVzaC5jaGFydChjaGFydClcblxuICAgIHJldHVybiB7dG9vbHRpcDpfdG9vbHRpcCwgYnJ1c2g6X2JydXNoLCBzZWxlY3RlZDpfc2VsZWN0aW9uLCBvdmVybGF5OmFyZWEsIGNvbnRhaW5lcjpjb250YWluZXIsIGNoYXJ0OmNoYXJ0fVxuICByZXR1cm4gYmVoYXZpb3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdjaGFydCcsICgkbG9nLCBzY2FsZUxpc3QsIGNvbnRhaW5lciwgYmVoYXZpb3IsIGQzQW5pbWF0aW9uKSAtPlxuXG4gIGNoYXJ0Q250ciA9IDBcblxuICBjaGFydCA9ICgpIC0+XG5cbiAgICBfaWQgPSBcImNoYXJ0I3tjaGFydENudHIrK31cIlxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgIy0tLSBWYXJpYWJsZSBkZWNsYXJhdGlvbnMgYW5kIGRlZmF1bHRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9sYXlvdXRzID0gW10gICAgICAgICAgICAgICAjIExpc3Qgb2YgbGF5b3V0cyBmb3IgdGhlIGNoYXJ0XG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZCAgICAjIHRoZSBjaGFydHMgZHJhd2luZyBjb250YWluZXIgb2JqZWN0XG4gICAgX2FsbFNjYWxlcyA9IHVuZGVmaW5lZCAgICAjIEhvbGRzIGFsbCBzY2FsZXMgb2YgdGhlIGNoYXJ0LCByZWdhcmRsZXNzIG9mIHNjYWxlIG93bmVyXG4gICAgX293bmVkU2NhbGVzID0gdW5kZWZpbmVkICAjIGhvbGRzIHRoZSBzY2xlcyBvd25lZCBieSBjaGFydCwgaS5lLiBzaGFyZSBzY2FsZXNcbiAgICBfZGF0YSA9IHVuZGVmaW5lZCAgICAgICAgICAgIyBwb2ludGVyIHRvIHRoZSBsYXN0IGRhdGEgc2V0IGJvdW5kIHRvIGNoYXJ0XG4gICAgX3Nob3dUb29sdGlwID0gZmFsc2UgICAgICAgICMgdG9vbHRpcCBwcm9wZXJ0eVxuICAgIF90b29sVGlwVGVtcGxhdGUgPSAnJ1xuICAgIF90aXRsZSA9IHVuZGVmaW5lZFxuICAgIF9zdWJUaXRsZSA9IHVuZGVmaW5lZFxuICAgIF9iZWhhdmlvciA9IGJlaGF2aW9yKClcbiAgICBfYW5pbWF0aW9uRHVyYXRpb24gPSBkM0FuaW1hdGlvbi5kdXJhdGlvblxuXG4gICAgIy0tLSBMaWZlQ3ljbGUgRGlzcGF0Y2hlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9saWZlQ3ljbGUgPSBkMy5kaXNwYXRjaCgnY29uZmlndXJlJywgJ3Jlc2l6ZScsICdwcmVwYXJlRGF0YScsICdzY2FsZURvbWFpbnMnLCAnc2l6ZUNvbnRhaW5lcicsICdkcmF3QXhpcycsICdkcmF3Q2hhcnQnLCAnbmV3RGF0YScsICd1cGRhdGUnLCAndXBkYXRlQXR0cnMnLCAnc2NvcGVBcHBseScgKVxuICAgIF9icnVzaCA9IGQzLmRpc3BhdGNoKCdkcmF3JywgJ2NoYW5nZScpXG5cbiAgICAjLS0tIEdldHRlci9TZXR0ZXIgRnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuaWQgPSAoaWQpIC0+XG4gICAgICByZXR1cm4gX2lkXG5cbiAgICBtZS5zaG93VG9vbHRpcCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dUb29sdGlwXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93VG9vbHRpcCA9IHRydWVGYWxzZVxuICAgICAgICBfYmVoYXZpb3IudG9vbHRpcC5hY3RpdmUoX3Nob3dUb29sdGlwKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRvb2xUaXBUZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90b29sVGlwVGVtcGxhdGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3Rvb2xUaXBUZW1wbGF0ZSA9IHBhdGhcbiAgICAgICAgX2JlaGF2aW9yLnRvb2x0aXAudGVtcGxhdGUocGF0aClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50aXRsZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF90aXRsZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnN1YlRpdGxlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc3ViVGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3N1YlRpdGxlID0gdmFsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkTGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0c1xuICAgICAgZWxzZVxuICAgICAgICBfbGF5b3V0cy5wdXNoKGxheW91dClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRTY2FsZSA9IChzY2FsZSwgbGF5b3V0KSAtPlxuICAgICAgX2FsbFNjYWxlcy5hZGQoc2NhbGUpXG4gICAgICBpZiBsYXlvdXRcbiAgICAgICAgbGF5b3V0LnNjYWxlcygpLmFkZChzY2FsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgX293bmVkU2NhbGVzLmFkZChzY2FsZSlcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYW5pbWF0aW9uRHVyYXRpb24gPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hbmltYXRpb25EdXJhdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfYW5pbWF0aW9uRHVyYXRpb24gPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgICMtLS0gR2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5saWZlQ3ljbGUgPSAodmFsKSAtPlxuICAgICAgcmV0dXJuIF9saWZlQ3ljbGVcblxuICAgIG1lLmxheW91dHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9sYXlvdXRzXG5cbiAgICBtZS5zY2FsZXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9vd25lZFNjYWxlc1xuXG4gICAgbWUuYWxsU2NhbGVzID0gKCkgLT5cbiAgICAgIHJldHVybiBfYWxsU2NhbGVzXG5cbiAgICBtZS5oYXNTY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIHJldHVybiAhIV9hbGxTY2FsZXMuaGFzKHNjYWxlKVxuXG4gICAgbWUuY29udGFpbmVyID0gKCkgLT5cbiAgICAgIHJldHVybiBfY29udGFpbmVyXG5cbiAgICBtZS5icnVzaCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JydXNoXG5cbiAgICBtZS5nZXREYXRhID0gKCkgLT5cbiAgICAgIHJldHVybiBfZGF0YVxuXG4gICAgbWUuYmVoYXZpb3IgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9iZWhhdmlvclxuXG4gICAgIy0tLSBDaGFydCBkcmF3aW5nIGxpZmUgY3ljbGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmV4ZWNMaWZlQ3ljbGVGdWxsID0gKGRhdGEsIG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIGZ1bGwgbGlmZSBjeWNsZSdcbiAgICAgICAgX2RhdGEgPSBkYXRhXG4gICAgICAgIF9saWZlQ3ljbGUucHJlcGFyZURhdGEoZGF0YSwgbm9BbmltYXRpb24pICAgICMgY2FsbHMgdGhlIHJlZ2lzdGVyZWQgbGF5b3V0IHR5cGVzXG4gICAgICAgIF9saWZlQ3ljbGUuc2NhbGVEb21haW5zKGRhdGEsIG5vQW5pbWF0aW9uKSAgICMgY2FsbHMgcmVnaXN0ZXJlZCB0aGUgc2NhbGVzXG4gICAgICAgIF9saWZlQ3ljbGUuc2l6ZUNvbnRhaW5lcihkYXRhLCBub0FuaW1hdGlvbikgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KGRhdGEsIG5vQW5pbWF0aW9uKSAgICAgIyBjYWxscyBsYXlvdXRcblxuICAgIG1lLnJlc2l6ZUxpZmVDeWNsZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgcmVzaXplIGxpZmUgY3ljbGUnXG4gICAgICAgIF9saWZlQ3ljbGUuc2l6ZUNvbnRhaW5lcihfZGF0YSwgbm9BbmltYXRpb24pICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoX2RhdGEsIG5vQW5pbWF0aW9uKVxuICAgICAgICBfbGlmZUN5Y2xlLnNjb3BlQXBwbHkoKVxuXG4gICAgbWUubmV3RGF0YUxpZmVDeWNsZSA9IChkYXRhLCBub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIGRhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyBuZXcgZGF0YSBsaWZlIGN5Y2xlJ1xuICAgICAgICBfZGF0YSA9IGRhdGFcbiAgICAgICAgX2xpZmVDeWNsZS5wcmVwYXJlRGF0YShkYXRhLCBub0FuaW1hdGlvbikgICAgIyBjYWxscyB0aGUgcmVnaXN0ZXJlZCBsYXlvdXQgdHlwZXNcbiAgICAgICAgX2xpZmVDeWNsZS5zY2FsZURvbWFpbnMoZGF0YSwgbm9BbmltYXRpb24pXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChkYXRhLCBub0FuaW1hdGlvbilcblxuICAgIG1lLmF0dHJpYnV0ZUNoYW5nZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgYXR0cmlidXRlIGNoYW5nZSBsaWZlIGN5Y2xlJ1xuICAgICAgICBfbGlmZUN5Y2xlLnNpemVDb250YWluZXIoX2RhdGEsIG5vQW5pbWF0aW9uKVxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoX2RhdGEsIG5vQW5pbWF0aW9uKVxuXG4gICAgbWUuYnJ1c2hFeHRlbnRDaGFuZ2VkID0gKCkgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXModHJ1ZSkgICAgICAgICAgICAgICMgTm8gQW5pbWF0aW9uXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KF9kYXRhLCB0cnVlKVxuXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ25ld0RhdGEuY2hhcnQnLCBtZS5leGVjTGlmZUN5Y2xlRnVsbFxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICdyZXNpemUuY2hhcnQnLCBtZS5yZXNpemVMaWZlQ3ljbGVcbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAndXBkYXRlLmNoYXJ0JywgKG5vQW5pbWF0aW9uKSAtPiBtZS5leGVjTGlmZUN5Y2xlRnVsbChfZGF0YSwgbm9BbmltYXRpb24pXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ3VwZGF0ZUF0dHJzJywgbWUuYXR0cmlidXRlQ2hhbmdlXG5cbiAgICAjLS0tIEluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX2JlaGF2aW9yLmNoYXJ0KG1lKVxuICAgIF9jb250YWluZXIgPSBjb250YWluZXIoKS5jaGFydChtZSkgICAjIHRoZSBjaGFydHMgZHJhd2luZyBjb250YWluZXIgb2JqZWN0XG4gICAgX2FsbFNjYWxlcyA9IHNjYWxlTGlzdCgpICAgICMgSG9sZHMgYWxsIHNjYWxlcyBvZiB0aGUgY2hhcnQsIHJlZ2FyZGxlc3Mgb2Ygc2NhbGUgb3duZXJcbiAgICBfb3duZWRTY2FsZXMgPSBzY2FsZUxpc3QoKSAgIyBob2xkcyB0aGUgc2NsZXMgb3duZWQgYnkgY2hhcnQsIGkuZS4gc2hhcmUgc2NhbGVzXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gY2hhcnQiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdjb250YWluZXInLCAoJGxvZywgJHdpbmRvdywgZDNDaGFydE1hcmdpbnMsIHNjYWxlTGlzdCwgYXhpc0NvbmZpZywgZDNBbmltYXRpb24sIGJlaGF2aW9yKSAtPlxuXG4gIGNvbnRhaW5lckNudCA9IDBcblxuICBjb250YWluZXIgPSAoKSAtPlxuXG4gICAgbWUgPSAoKS0+XG5cbiAgICAjLS0tIFZhcmlhYmxlIGRlY2xhcmF0aW9ucyBhbmQgZGVmYXVsdHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX2NvbnRhaW5lcklkID0gJ2NudG5yJyArIGNvbnRhaW5lckNudCsrXG4gICAgX2NoYXJ0ID0gdW5kZWZpbmVkXG4gICAgX2VsZW1lbnQgPSB1bmRlZmluZWRcbiAgICBfZWxlbWVudFNlbGVjdGlvbiA9IHVuZGVmaW5lZFxuICAgIF9sYXlvdXRzID0gW11cbiAgICBfbGVnZW5kcyA9IFtdXG4gICAgX3N2ZyA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfc3BhY2VkQ29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0QXJlYSA9IHVuZGVmaW5lZFxuICAgIF9jaGFydEFyZWEgPSB1bmRlZmluZWRcbiAgICBfbWFyZ2luID0gYW5ndWxhci5jb3B5KGQzQ2hhcnRNYXJnaW5zLmRlZmF1bHQpXG4gICAgX2lubmVyV2lkdGggPSAwXG4gICAgX2lubmVySGVpZ2h0ID0gMFxuICAgIF90aXRsZUhlaWdodCA9IDBcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9vdmVybGF5ID0gdW5kZWZpbmVkXG4gICAgX2JlaGF2aW9yID0gdW5kZWZpbmVkXG4gICAgX2R1cmF0aW9uID0gMFxuXG4gICAgIy0tLSBHZXR0ZXIvU2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfY29udGFpbmVySWRcblxuICAgIG1lLmNoYXJ0ID0gKGNoYXJ0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSBjaGFydFxuICAgICAgICAjIHJlZ2lzdGVyIHRvIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgI19jaGFydC5saWZlQ3ljbGUoKS5vbiBcInNpemVDb250YWluZXIuI3ttZS5pZCgpfVwiLCBtZS5zaXplQ29udGFpbmVyXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcImRyYXdBeGlzLiN7bWUuaWQoKX1cIiwgbWUuZHJhd0NoYXJ0RnJhbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5lbGVtZW50ID0gKGVsZW0pIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2VsZW1lbnRcbiAgICAgIGVsc2VcbiAgICAgICAgX3Jlc2l6ZUhhbmRsZXIgPSAoKSAtPiAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5yZXNpemUodHJ1ZSkgIyBubyBhbmltYXRpb25cbiAgICAgICAgX2VsZW1lbnQgPSBlbGVtXG4gICAgICAgIF9lbGVtZW50U2VsZWN0aW9uID0gZDMuc2VsZWN0KF9lbGVtZW50KVxuICAgICAgICBpZiBfZWxlbWVudFNlbGVjdGlvbi5lbXB0eSgpXG4gICAgICAgICAgJGxvZy5lcnJvciBcIkVycm9yOiBFbGVtZW50ICN7X2VsZW1lbnR9IGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9nZW5DaGFydEZyYW1lKClcbiAgICAgICAgICAjIGZpbmQgdGhlIGRpdiBlbGVtZW50IHRvIGF0dGFjaCB0aGUgaGFuZGxlciB0b1xuICAgICAgICAgIHJlc2l6ZVRhcmdldCA9IF9lbGVtZW50U2VsZWN0aW9uLnNlbGVjdCgnLndrLWNoYXJ0Jykubm9kZSgpXG4gICAgICAgICAgbmV3IFJlc2l6ZVNlbnNvcihyZXNpemVUYXJnZXQsIF9yZXNpemVIYW5kbGVyKVxuXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkTGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIF9sYXlvdXRzLnB1c2gobGF5b3V0KVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5oZWlnaHQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pbm5lckhlaWdodFxuXG4gICAgbWUud2lkdGggPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pbm5lcldpZHRoXG5cbiAgICBtZS5tYXJnaW5zID0gKCkgLT5cbiAgICAgIHJldHVybiBfbWFyZ2luXG5cbiAgICBtZS5nZXRDaGFydEFyZWEgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9jaGFydEFyZWFcblxuICAgIG1lLmdldE92ZXJsYXkgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9vdmVybGF5XG5cbiAgICBtZS5nZXRDb250YWluZXIgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zcGFjZWRDb250YWluZXJcblxuICAgICMtLS0gdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgUmV0dXJuOiB0ZXh0IGhlaWdodFxuICAgIGRyYXdBbmRQb3NpdGlvblRleHQgPSAoY29udGFpbmVyLCB0ZXh0LCBzZWxlY3RvciwgZm9udFNpemUsIG9mZnNldCkgLT5cbiAgICAgIGVsZW0gPSBjb250YWluZXIuc2VsZWN0KCcuJyArIHNlbGVjdG9yKVxuICAgICAgaWYgZWxlbS5lbXB0eSgpXG4gICAgICAgIGVsZW0gPSBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cih7Y2xhc3M6c2VsZWN0b3IsICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnLCB5OmlmIG9mZnNldCB0aGVuIG9mZnNldCBlbHNlIDB9KVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJyxmb250U2l6ZSlcbiAgICAgIGVsZW0udGV4dCh0ZXh0KVxuICAgICAgI21lYXN1cmUgc2l6ZSBhbmQgcmV0dXJuIGl0XG4gICAgICByZXR1cm4gZWxlbS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodFxuXG5cbiAgICBkcmF3VGl0bGVBcmVhID0gKHRpdGxlLCBzdWJUaXRsZSkgLT5cbiAgICAgIHRpdGxlQXJlYUhlaWdodCA9IDBcbiAgICAgIGFyZWEgPSBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LXRpdGxlLWFyZWEnKVxuICAgICAgaWYgYXJlYS5lbXB0eSgpXG4gICAgICAgIGFyZWEgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtdGl0bGUtYXJlYSB3ay1jZW50ZXItaG9yJylcbiAgICAgIGlmIHRpdGxlXG4gICAgICAgIF90aXRsZUhlaWdodCA9IGRyYXdBbmRQb3NpdGlvblRleHQoYXJlYSwgdGl0bGUsICd3ay1jaGFydC10aXRsZScsICcyZW0nKVxuICAgICAgaWYgc3ViVGl0bGVcbiAgICAgICAgZHJhd0FuZFBvc2l0aW9uVGV4dChhcmVhLCBzdWJUaXRsZSwgJ3drLWNoYXJ0LXN1YnRpdGxlJywgJzEuOGVtJywgX3RpdGxlSGVpZ2h0KVxuXG4gICAgICByZXR1cm4gYXJlYS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodFxuXG4gICAgZ2V0QXhpc1JlY3QgPSAoZGltKSAtPlxuICAgICAgYXhpcyA9IF9jb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIGRpbS5zY2FsZSgpLnJhbmdlKFswLDEwMF0pXG4gICAgICBheGlzLmNhbGwoZGltLmF4aXMoKSlcblxuXG5cbiAgICAgIGlmIGRpbS5yb3RhdGVUaWNrTGFiZWxzKClcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKHtkeTonLTAuNzFlbScsIHg6LTl9KVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJyxcInRyYW5zbGF0ZSgwLDkpIHJvdGF0ZSgje2RpbS5yb3RhdGVUaWNrTGFiZWxzKCl9KVwiKVxuICAgICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgaWYgZGltLmF4aXNPcmllbnQoKSBpcyAnYm90dG9tJyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0JylcblxuICAgICAgYm94ID0gYXhpcy5ub2RlKCkuZ2V0QkJveCgpXG4gICAgICBheGlzLnJlbW92ZSgpXG4gICAgICByZXR1cm4gYm94XG5cbiAgICBkcmF3QXhpcyA9IChkaW0pIC0+XG4gICAgICBheGlzID0gX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtYXhpcy53ay1jaGFydC0je2RpbS5heGlzT3JpZW50KCl9XCIpXG4gICAgICBpZiBheGlzLmVtcHR5KClcbiAgICAgICAgYXhpcyA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcyB3ay1jaGFydC0nICsgZGltLmF4aXNPcmllbnQoKSlcblxuICAgICAgYXhpcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oX2R1cmF0aW9uKS5jYWxsKGRpbS5heGlzKCkpXG5cbiAgICAgIGlmIGRpbS5yb3RhdGVUaWNrTGFiZWxzKClcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtI3tkaW0uYXhpc09yaWVudCgpfS53ay1jaGFydC1heGlzIHRleHRcIilcbiAgICAgICAgICAuYXR0cih7ZHk6Jy0wLjcxZW0nLCB4Oi05fSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJyxcInRyYW5zbGF0ZSgwLDkpIHJvdGF0ZSgje2RpbS5yb3RhdGVUaWNrTGFiZWxzKCl9KVwiKVxuICAgICAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCBpZiBkaW0uYXhpc09yaWVudCgpIGlzICdib3R0b20nIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnKVxuICAgICAgZWxzZVxuICAgICAgICBheGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC0je2RpbS5heGlzT3JpZW50KCl9LndrLWNoYXJ0LWF4aXMgdGV4dFwiKS5hdHRyKCd0cmFuc2Zvcm0nLCBudWxsKVxuXG4gICAgX3JlbW92ZUF4aXMgPSAob3JpZW50KSAtPlxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtYXhpcy53ay1jaGFydC0je29yaWVudH1cIikucmVtb3ZlKClcblxuICAgIF9yZW1vdmVMYWJlbCA9IChvcmllbnQpIC0+XG4gICAgICBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1sYWJlbC53ay1jaGFydC0je29yaWVudH1cIikucmVtb3ZlKClcblxuICAgIGRyYXdHcmlkID0gKHMsIG5vQW5pbWF0aW9uKSAtPlxuICAgICAgZHVyYXRpb24gPSBpZiBub0FuaW1hdGlvbiB0aGVuIDAgZWxzZSBfZHVyYXRpb25cbiAgICAgIGtpbmQgPSBzLmtpbmQoKVxuICAgICAgdGlja3MgPSBpZiBzLmlzT3JkaW5hbCgpIHRoZW4gcy5zY2FsZSgpLnJhbmdlKCkgZWxzZSBzLnNjYWxlKCkudGlja3MoKVxuICAgICAgZ3JpZExpbmVzID0gX2NvbnRhaW5lci5zZWxlY3RBbGwoXCIud2stY2hhcnQtZ3JpZC53ay1jaGFydC0je2tpbmR9XCIpLmRhdGEodGlja3MsIChkKSAtPiBkKVxuICAgICAgZ3JpZExpbmVzLmVudGVyKCkuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWdyaWQgd2stY2hhcnQtI3traW5kfVwiKVxuICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApXG4gICAgICBpZiBraW5kIGlzICd5J1xuICAgICAgICBncmlkTGluZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgIHgxOjAsXG4gICAgICAgICAgICB4MjogX2lubmVyV2lkdGgsXG4gICAgICAgICAgICB5MTooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuICBkIGVsc2Ugcy5zY2FsZSgpKGQpLFxuICAgICAgICAgICAgeTI6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkIGVsc2Ugcy5zY2FsZSgpKGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICBlbHNlXG4gICAgICAgIGdyaWRMaW5lcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgeTE6MCxcbiAgICAgICAgICAgIHkyOiBfaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICB4MTooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgZWxzZSBzLnNjYWxlKCkoZCksXG4gICAgICAgICAgICB4MjooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgZWxzZSBzLnNjYWxlKCkoZClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgIGdyaWRMaW5lcy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICMtLS0gQnVpbGQgdGhlIGNvbnRhaW5lciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBidWlsZCBnZW5lcmljIGVsZW1lbnRzIGZpcnN0XG5cbiAgICBfZ2VuQ2hhcnRGcmFtZSA9ICgpIC0+XG4gICAgICBfc3ZnID0gX2VsZW1lbnRTZWxlY3Rpb24uYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydCcpLmFwcGVuZCgnc3ZnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQnKVxuICAgICAgX3N2Zy5hcHBlbmQoJ2RlZnMnKS5hcHBlbmQoJ2NsaXBQYXRoJykuYXR0cignaWQnLCBcIndrLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9XCIpLmFwcGVuZCgncmVjdCcpXG4gICAgICBfY29udGFpbmVyPSBfc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtY29udGFpbmVyJylcbiAgICAgIF9vdmVybGF5ID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ2FsbCcpXG4gICAgICBfb3ZlcmxheS5hcHBlbmQoJ3JlY3QnKS5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYWNrZ3JvdW5kJykuZGF0dW0oe25hbWU6J2JhY2tncm91bmQnfSlcbiAgICAgIF9jaGFydEFyZWEgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuXG4gICAgIyBzdGFydCB0byBidWlsZCBhbmQgc2l6ZSB0aGUgZWxlbWVudHMgZnJvbSB0b3AgdG8gYm90dG9tXG5cbiAgICAjLS0tIGNoYXJ0IGZyYW1lICh0aXRsZSwgYXhpcywgZ3JpZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd0NoYXJ0RnJhbWUgPSAobm90QW5pbWF0ZWQpIC0+XG4gICAgICBib3VuZHMgPSBfZWxlbWVudFNlbGVjdGlvbi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIF9kdXJhdGlvbiA9IGlmIG5vdEFuaW1hdGVkIHRoZW4gMCBlbHNlIG1lLmNoYXJ0KCkuYW5pbWF0aW9uRHVyYXRpb24oKVxuICAgICAgX2hlaWdodCA9IGJvdW5kcy5oZWlnaHRcbiAgICAgIF93aWR0aCA9IGJvdW5kcy53aWR0aFxuICAgICAgdGl0bGVBcmVhSGVpZ2h0ID0gZHJhd1RpdGxlQXJlYShfY2hhcnQudGl0bGUoKSwgX2NoYXJ0LnN1YlRpdGxlKCkpXG5cbiAgICAgICMtLS0gZ2V0IHNpemluZyBvZiBmcmFtZSBjb21wb25lbnRzIGJlZm9yZSBwb3NpdGlvbmluZyB0aGVtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXhpc1JlY3QgPSB7dG9wOntoZWlnaHQ6MCwgd2lkdGg6MH0sYm90dG9tOntoZWlnaHQ6MCwgd2lkdGg6MH0sbGVmdDp7aGVpZ2h0OjAsIHdpZHRoOjB9LHJpZ2h0OntoZWlnaHQ6MCwgd2lkdGg6MH19XG4gICAgICBsYWJlbEhlaWdodCA9IHt0b3A6MCAsYm90dG9tOjAsIGxlZnQ6MCwgcmlnaHQ6MH1cblxuICAgICAgZm9yIGwgaW4gX2xheW91dHNcbiAgICAgICAgZm9yIGssIHMgb2YgbC5zY2FsZXMoKS5hbGxLaW5kcygpXG4gICAgICAgICAgaWYgcy5zaG93QXhpcygpXG4gICAgICAgICAgICBzLmF4aXMoKS5zY2FsZShzLnNjYWxlKCkpLm9yaWVudChzLmF4aXNPcmllbnQoKSkgICMgZW5zdXJlIHRoZSBheGlzIHdvcmtzIG9uIHRoZSByaWdodCBzY2FsZVxuICAgICAgICAgICAgYXhpc1JlY3Rbcy5heGlzT3JpZW50KCldID0gZ2V0QXhpc1JlY3QocylcbiAgICAgICAgICAgICMtLS0gZHJhdyBsYWJlbCAtLS1cbiAgICAgICAgICAgIGxhYmVsID0gX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtbGFiZWwud2stY2hhcnQtI3tzLmF4aXNPcmllbnQoKX1cIilcbiAgICAgICAgICAgIGlmIHMuc2hvd0xhYmVsKClcbiAgICAgICAgICAgICAgaWYgbGFiZWwuZW1wdHkoKVxuICAgICAgICAgICAgICAgIGxhYmVsID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYWJlbCB3ay1jaGFydC0nICArIHMuYXhpc09yaWVudCgpKVxuICAgICAgICAgICAgICBsYWJlbEhlaWdodFtzLmF4aXNPcmllbnQoKV0gPSBkcmF3QW5kUG9zaXRpb25UZXh0KGxhYmVsLCBzLmF4aXNMYWJlbCgpLCAnd2stY2hhcnQtbGFiZWwtdGV4dCcsICcxLjVlbScpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsYWJlbC5yZW1vdmUoKVxuICAgICAgICAgIGlmIHMuYXhpc09yaWVudE9sZCgpIGFuZCBzLmF4aXNPcmllbnRPbGQoKSBpc250IHMuYXhpc09yaWVudCgpXG4gICAgICAgICAgICBfcmVtb3ZlQXhpcyhzLmF4aXNPcmllbnRPbGQoKSlcbiAgICAgICAgICAgIF9yZW1vdmVMYWJlbChzLmF4aXNPcmllbnRPbGQoKSlcblxuXG5cbiAgICAgICMtLS0gY29tcHV0ZSBzaXplIG9mIHRoZSBkcmF3aW5nIGFyZWEgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2ZyYW1lSGVpZ2h0ID0gdGl0bGVBcmVhSGVpZ2h0ICsgYXhpc1JlY3QudG9wLmhlaWdodCArIGxhYmVsSGVpZ2h0LnRvcCArIGF4aXNSZWN0LmJvdHRvbS5oZWlnaHQgKyBsYWJlbEhlaWdodC5ib3R0b20gKyBfbWFyZ2luLnRvcCArIF9tYXJnaW4uYm90dG9tXG4gICAgICBfZnJhbWVXaWR0aCA9IGF4aXNSZWN0LnJpZ2h0LndpZHRoICsgbGFiZWxIZWlnaHQucmlnaHQgKyBheGlzUmVjdC5sZWZ0LndpZHRoICsgbGFiZWxIZWlnaHQubGVmdCArIF9tYXJnaW4ubGVmdCArIF9tYXJnaW4ucmlnaHRcblxuICAgICAgaWYgX2ZyYW1lSGVpZ2h0IDwgX2hlaWdodFxuICAgICAgICBfaW5uZXJIZWlnaHQgPSBfaGVpZ2h0IC0gX2ZyYW1lSGVpZ2h0XG4gICAgICBlbHNlXG4gICAgICAgIF9pbm5lckhlaWdodCA9IDBcblxuICAgICAgaWYgX2ZyYW1lV2lkdGggPCBfd2lkdGhcbiAgICAgICAgX2lubmVyV2lkdGggPSBfd2lkdGggLSBfZnJhbWVXaWR0aFxuICAgICAgZWxzZVxuICAgICAgICBfaW5uZXJXaWR0aCA9IDBcblxuICAgICAgIy0tLSByZXNldCBzY2FsZSByYW5nZXMgYW5kIHJlZHJhdyBheGlzIHdpdGggYWRqdXN0ZWQgcmFuZ2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIGsgaXMgJ3gnIG9yIGsgaXMgJ3JhbmdlWCdcbiAgICAgICAgICAgIHMucmFuZ2UoWzAsIF9pbm5lcldpZHRoXSlcbiAgICAgICAgICBlbHNlIGlmIGsgaXMgJ3knIG9yIGsgaXMgJ3JhbmdlWSdcbiAgICAgICAgICAgIGlmIGwuc2hvd0xhYmVscygpXG4gICAgICAgICAgICAgIHMucmFuZ2UoW19pbm5lckhlaWdodCwgMjBdKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBzLnJhbmdlKFtfaW5uZXJIZWlnaHQsIDBdKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKVxuICAgICAgICAgICAgZHJhd0F4aXMocylcblxuICAgICAgIy0tLSBwb3NpdGlvbiBmcmFtZSBlbGVtZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxlZnRNYXJnaW4gPSBheGlzUmVjdC5sZWZ0LndpZHRoICsgbGFiZWxIZWlnaHQubGVmdCArIF9tYXJnaW4ubGVmdFxuICAgICAgdG9wTWFyZ2luID0gdGl0bGVBcmVhSGVpZ2h0ICsgYXhpc1JlY3QudG9wLmhlaWdodCAgKyBsYWJlbEhlaWdodC50b3AgKyBfbWFyZ2luLnRvcFxuXG4gICAgICBfc3BhY2VkQ29udGFpbmVyID0gX2NvbnRhaW5lci5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnRNYXJnaW59LCAje3RvcE1hcmdpbn0pXCIpXG4gICAgICBfc3ZnLnNlbGVjdChcIiN3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfSByZWN0XCIpLmF0dHIoJ3dpZHRoJywgX2lubmVyV2lkdGgpLmF0dHIoJ2hlaWdodCcsIF9pbm5lckhlaWdodClcbiAgICAgIF9zcGFjZWRDb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtb3ZlcmxheT4ud2stY2hhcnQtYmFja2dyb3VuZCcpLmF0dHIoJ3dpZHRoJywgX2lubmVyV2lkdGgpLmF0dHIoJ2hlaWdodCcsIF9pbm5lckhlaWdodClcbiAgICAgIF9zcGFjZWRDb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtYXJlYScpLnN0eWxlKCdjbGlwLXBhdGgnLCBcInVybCgjd2stY2hhcnQtY2xpcC0je19jb250YWluZXJJZH0pXCIpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LW92ZXJsYXknKS5zdHlsZSgnY2xpcC1wYXRoJywgXCJ1cmwoI3drLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9KVwiKVxuXG4gICAgICBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtcmlnaHQnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19pbm5lcldpZHRofSwgMClcIilcbiAgICAgIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy53ay1jaGFydC1ib3R0b20nKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCAje19pbm5lckhlaWdodH0pXCIpXG5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtbGFiZWwud2stY2hhcnQtbGVmdCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7LWF4aXNSZWN0LmxlZnQud2lkdGgtbGFiZWxIZWlnaHQubGVmdCAvIDIgfSwgI3tfaW5uZXJIZWlnaHQvMn0pIHJvdGF0ZSgtOTApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LXJpZ2h0JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aCtheGlzUmVjdC5yaWdodC53aWR0aCArIGxhYmVsSGVpZ2h0LnJpZ2h0IC8gMn0sICN7X2lubmVySGVpZ2h0LzJ9KSByb3RhdGUoOTApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LXRvcCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGggLyAyfSwgI3stYXhpc1JlY3QudG9wLmhlaWdodCAtIGxhYmVsSGVpZ2h0LnRvcCAvIDIgfSlcIilcbiAgICAgIF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtbGFiZWwud2stY2hhcnQtYm90dG9tJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aCAvIDJ9LCAje19pbm5lckhlaWdodCArIGF4aXNSZWN0LmJvdHRvbS5oZWlnaHQgKyBsYWJlbEhlaWdodC5ib3R0b20gfSlcIilcblxuICAgICAgX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC10aXRsZS1hcmVhJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aC8yfSwgI3stdG9wTWFyZ2luICsgX3RpdGxlSGVpZ2h0fSlcIilcblxuICAgICAgIy0tLSBmaW5hbGx5LCBkcmF3IGdyaWQgbGluZXNcblxuICAgICAgZm9yIGwgaW4gX2xheW91dHNcbiAgICAgICAgZm9yIGssIHMgb2YgbC5zY2FsZXMoKS5hbGxLaW5kcygpXG4gICAgICAgICAgaWYgcy5zaG93QXhpcygpIGFuZCBzLnNob3dHcmlkKClcbiAgICAgICAgICAgIGRyYXdHcmlkKHMpXG5cbiAgICAgIF9jaGFydC5iZWhhdmlvcigpLm92ZXJsYXkoX292ZXJsYXkpXG4gICAgICBfY2hhcnQuYmVoYXZpb3IoKS5jb250YWluZXIoX2NoYXJ0QXJlYSlcblxuICAgICMtLS0gQnJ1c2ggQWNjZWxlcmF0b3IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5kcmF3U2luZ2xlQXhpcyA9IChzY2FsZSkgLT5cbiAgICAgIGlmIHNjYWxlLnNob3dBeGlzKClcbiAgICAgICAgYSA9IF9zcGFjZWRDb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtI3tzY2FsZS5heGlzKCkub3JpZW50KCl9XCIpXG4gICAgICAgIGEuY2FsbChzY2FsZS5heGlzKCkpXG5cbiAgICAgICAgaWYgc2NhbGUuc2hvd0dyaWQoKVxuICAgICAgICAgIGRyYXdHcmlkKHNjYWxlLCB0cnVlKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gY29udGFpbmVyIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnbGF5b3V0JywgKCRsb2csIHNjYWxlLCBzY2FsZUxpc3QsIHRpbWluZykgLT5cblxuICBsYXlvdXRDbnRyID0gMFxuXG4gIGxheW91dCA9ICgpIC0+XG4gICAgX2lkID0gXCJsYXlvdXQje2xheW91dENudHIrK31cIlxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9zY2FsZUxpc3QgPSBzY2FsZUxpc3QoKVxuICAgIF9zaG93TGFiZWxzID0gZmFsc2VcbiAgICBfbGF5b3V0TGlmZUN5Y2xlID0gZDMuZGlzcGF0Y2goJ2NvbmZpZ3VyZScsICdkcmF3JywgJ3ByZXBhcmVEYXRhJywgJ2JydXNoJywgJ3JlZHJhdycsICdkcmF3QXhpcycsICd1cGRhdGUnLCAndXBkYXRlQXR0cnMnLCAnYnJ1c2hEcmF3JylcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLmlkID0gKGlkKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IGNoYXJ0XG4gICAgICAgIF9zY2FsZUxpc3QucGFyZW50U2NhbGVzKGNoYXJ0LnNjYWxlcygpKVxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJjb25maWd1cmUuI3ttZS5pZCgpfVwiLCAoKSAtPiBfbGF5b3V0TGlmZUN5Y2xlLmNvbmZpZ3VyZS5hcHBseShtZS5zY2FsZXMoKSkgI3Bhc3N0aHJvdWdoXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcImRyYXdDaGFydC4je21lLmlkKCl9XCIsIG1lLmRyYXcgIyByZWdpc3RlciBmb3IgdGhlIGRyYXdpbmcgZXZlbnRcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwicHJlcGFyZURhdGEuI3ttZS5pZCgpfVwiLCBtZS5wcmVwYXJlRGF0YVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNjYWxlcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NjYWxlTGlzdFxuXG4gICAgbWUuc2NhbGVQcm9wZXJ0aWVzID0gKCkgLT5cbiAgICAgIHJldHVybiBtZS5zY2FsZXMoKS5nZXRTY2FsZVByb3BlcnRpZXMoKVxuXG4gICAgbWUuY29udGFpbmVyID0gKG9iaikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY29udGFpbmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9jb250YWluZXIgPSBvYmpcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zaG93TGFiZWxzID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0xhYmVsc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0xhYmVscyA9IHRydWVGYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmJlaGF2aW9yID0gKCkgLT5cbiAgICAgIG1lLmNoYXJ0KCkuYmVoYXZpb3IoKVxuXG4gICAgbWUucHJlcGFyZURhdGEgPSAoZGF0YSkgLT5cbiAgICAgIGFyZ3MgPSBbXVxuICAgICAgZm9yIGtpbmQgaW4gWyd4JywneScsICdjb2xvcicsICdzaXplJywgJ3NoYXBlJywgJ3JhbmdlWCcsICdyYW5nZVknXVxuICAgICAgICBhcmdzLnB1c2goX3NjYWxlTGlzdC5nZXRLaW5kKGtpbmQpKVxuICAgICAgX2xheW91dExpZmVDeWNsZS5wcmVwYXJlRGF0YS5hcHBseShkYXRhLCBhcmdzKVxuXG4gICAgbWUubGlmZUN5Y2xlID0gKCktPlxuICAgICAgcmV0dXJuIF9sYXlvdXRMaWZlQ3ljbGVcblxuXG4gICAgIy0tLSBEUllvdXQgZnJvbSBkcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldERyYXdBcmVhID0gKCkgLT5cbiAgICAgIGNvbnRhaW5lciA9IF9jb250YWluZXIuZ2V0Q2hhcnRBcmVhKClcbiAgICAgIGRyYXdBcmVhID0gY29udGFpbmVyLnNlbGVjdChcIi4je21lLmlkKCl9XCIpXG4gICAgICBpZiBkcmF3QXJlYS5lbXB0eSgpXG4gICAgICAgIGRyYXdBcmVhID0gY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgKGQpIC0+IG1lLmlkKCkpXG4gICAgICByZXR1cm4gZHJhd0FyZWFcblxuICAgIGJ1aWxkQXJncyA9IChkYXRhLCBub3RBbmltYXRlZCkgLT5cbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGhlaWdodDpfY29udGFpbmVyLmhlaWdodCgpLFxuICAgICAgICB3aWR0aDpfY29udGFpbmVyLndpZHRoKCksXG4gICAgICAgIG1hcmdpbnM6X2NvbnRhaW5lci5tYXJnaW5zKCksXG4gICAgICAgIGR1cmF0aW9uOiBpZiBub3RBbmltYXRlZCB0aGVuIDAgZWxzZSBtZS5jaGFydCgpLmFuaW1hdGlvbkR1cmF0aW9uKClcbiAgICAgIH1cbiAgICAgIGFyZ3MgPSBbZGF0YSwgb3B0aW9uc11cbiAgICAgIGZvciBraW5kIGluIFsneCcsJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZScsICdyYW5nZVgnLCAncmFuZ2VZJ11cbiAgICAgICAgYXJncy5wdXNoKF9zY2FsZUxpc3QuZ2V0S2luZChraW5kKSlcbiAgICAgIHJldHVybiBhcmdzXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhdyA9IChkYXRhLCBub3RBbmltYXRlZCkgLT5cbiAgICAgIF9kYXRhID0gZGF0YVxuXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLmRyYXcuYXBwbHkoZ2V0RHJhd0FyZWEoKSwgYnVpbGRBcmdzKGRhdGEsIG5vdEFuaW1hdGVkKSlcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAncmVkcmF3JywgbWUucmVkcmF3XG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICd1cGRhdGUnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnVwZGF0ZVxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAnZHJhd0F4aXMnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLmRyYXdBeGlzXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICd1cGRhdGVBdHRycycsIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkudXBkYXRlQXR0cnNcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAnYnJ1c2gnLCAoYXhpcywgbm90QW5pbWF0ZWQpIC0+XG4gICAgICAgIF9jb250YWluZXIuZHJhd1NpbmdsZUF4aXMoYXhpcylcbiAgICAgICAgX2xheW91dExpZmVDeWNsZS5icnVzaERyYXcuYXBwbHkoZ2V0RHJhd0FyZWEoKSwgYnVpbGRBcmdzKF9kYXRhLCBub3RBbmltYXRlZCkpXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gbGF5b3V0IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnbGVnZW5kJywgKCRsb2csICRjb21waWxlLCAkcm9vdFNjb3BlLCAkdGVtcGxhdGVDYWNoZSwgdGVtcGxhdGVEaXIpIC0+XG5cbiAgbGVnZW5kQ250ID0gMFxuXG4gIHVuaXF1ZVZhbHVlcyA9IChhcnIpIC0+XG4gICAgc2V0ID0ge31cbiAgICBmb3IgZSBpbiBhcnJcbiAgICAgIHNldFtlXSA9IDBcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc2V0KVxuXG4gIGxlZ2VuZCA9ICgpIC0+XG5cbiAgICBfaWQgPSBcImxlZ2VuZC0je2xlZ2VuZENudCsrfVwiXG4gICAgX3Bvc2l0aW9uID0gJ3RvcC1yaWdodCdcbiAgICBfc2NhbGUgPSB1bmRlZmluZWRcbiAgICBfdGVtcGxhdGVQYXRoID0gdW5kZWZpbmVkXG4gICAgX2xlZ2VuZFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpXG4gICAgX3RlbXBsYXRlID0gdW5kZWZpbmVkXG4gICAgX3BhcnNlZFRlbXBsYXRlID0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lckRpdiA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmREaXYgPSB1bmRlZmluZWRcbiAgICBfdGl0bGUgPSB1bmRlZmluZWRcbiAgICBfbGF5b3V0ID0gdW5kZWZpbmVkXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfb3B0aW9ucyA9IHVuZGVmaW5lZFxuICAgIF9zaG93ID0gZmFsc2VcbiAgICBfc2hvd1ZhbHVlcyA9IGZhbHNlXG5cbiAgICBtZSA9IHt9XG5cbiAgICBtZS5wb3NpdGlvbiA9IChwb3MpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Bvc2l0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIF9wb3NpdGlvbiA9IHBvc1xuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNob3cgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93XG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5zaG93VmFsdWVzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd1ZhbHVlc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd1ZhbHVlcyA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGl2ID0gKHNlbGVjdGlvbikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGVnZW5kRGl2XG4gICAgICBlbHNlXG4gICAgICAgIF9sZWdlbmREaXYgPSBzZWxlY3Rpb25cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXlvdXQgPSAobGF5b3V0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXlvdXRcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheW91dCA9IGxheW91dFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNjYWxlID0gKHNjYWxlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zY2FsZVxuICAgICAgZWxzZVxuICAgICAgICBfc2NhbGUgPSBzY2FsZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRpdGxlID0gKHRpdGxlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90aXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfdGl0bGUgPSB0aXRsZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRlbXBsYXRlID0gKHBhdGgpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RlbXBsYXRlUGF0aFxuICAgICAgZWxzZVxuICAgICAgICBfdGVtcGxhdGVQYXRoID0gcGF0aFxuICAgICAgICBfdGVtcGxhdGUgPSAkdGVtcGxhdGVDYWNoZS5nZXQoX3RlbXBsYXRlUGF0aClcbiAgICAgICAgX3BhcnNlZFRlbXBsYXRlID0gJGNvbXBpbGUoX3RlbXBsYXRlKShfbGVnZW5kU2NvcGUpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZHJhdyA9IChkYXRhLCBvcHRpb25zKSAtPlxuICAgICAgX2RhdGEgPSBkYXRhXG4gICAgICBfb3B0aW9ucyA9IG9wdGlvbnNcbiAgICAgICMkbG9nLmluZm8gJ2RyYXdpbmcgTGVnZW5kJ1xuICAgICAgX2NvbnRhaW5lckRpdiA9IF9sZWdlbmREaXYgb3IgZDMuc2VsZWN0KG1lLnNjYWxlKCkucGFyZW50KCkuY29udGFpbmVyKCkuZWxlbWVudCgpKS5zZWxlY3QoJy53ay1jaGFydCcpXG4gICAgICBpZiBtZS5zaG93KClcbiAgICAgICAgaWYgX2NvbnRhaW5lckRpdi5zZWxlY3QoJy53ay1jaGFydC1sZWdlbmQnKS5lbXB0eSgpXG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KF9jb250YWluZXJEaXYubm9kZSgpKS5hcHBlbmQoX3BhcnNlZFRlbXBsYXRlKVxuXG4gICAgICAgIGlmIG1lLnNob3dWYWx1ZXMoKVxuICAgICAgICAgIGxheWVycyA9IHVuaXF1ZVZhbHVlcyhfc2NhbGUudmFsdWUoZGF0YSkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMgPSBfc2NhbGUubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgcyA9IF9zY2FsZS5zY2FsZSgpXG4gICAgICAgIGlmIG1lLmxheW91dCgpPy5zY2FsZXMoKS5sYXllclNjYWxlKClcbiAgICAgICAgICBzID0gbWUubGF5b3V0KCkuc2NhbGVzKCkubGF5ZXJTY2FsZSgpLnNjYWxlKClcbiAgICAgICAgaWYgX3NjYWxlLmtpbmQoKSBpc250ICdzaGFwZSdcbiAgICAgICAgICBfbGVnZW5kU2NvcGUubGVnZW5kUm93cyA9IGxheWVycy5tYXAoKGQpIC0+IHt2YWx1ZTpkLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOnMoZCl9fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9sZWdlbmRTY29wZS5sZWdlbmRSb3dzID0gbGF5ZXJzLm1hcCgoZCkgLT4ge3ZhbHVlOmQsIHBhdGg6ZDMuc3ZnLnN5bWJvbCgpLnR5cGUocyhkKSkuc2l6ZSg4MCkoKX0pXG4gICAgICAgICAgIyRsb2cubG9nIF9sZWdlbmRTY29wZS5sZWdlbmRSb3dzXG4gICAgICAgIF9sZWdlbmRTY29wZS5zaG93TGVnZW5kID0gdHJ1ZVxuICAgICAgICBfbGVnZW5kU2NvcGUucG9zaXRpb24gPSB7XG4gICAgICAgICAgcG9zaXRpb246IGlmIF9sZWdlbmREaXYgdGhlbiAncmVsYXRpdmUnIGVsc2UgJ2Fic29sdXRlJ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgbm90IF9sZWdlbmREaXZcbiAgICAgICAgICBjb250YWluZXJSZWN0ID0gX2NvbnRhaW5lckRpdi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICBjaGFydEFyZWFSZWN0ID0gX2NvbnRhaW5lckRpdi5zZWxlY3QoJy53ay1jaGFydC1vdmVybGF5IHJlY3QnKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICBmb3IgcCBpbiBfcG9zaXRpb24uc3BsaXQoJy0nKVxuICAgICAgICAgICAgICBfbGVnZW5kU2NvcGUucG9zaXRpb25bcF0gPSBcIiN7TWF0aC5hYnMoY29udGFpbmVyUmVjdFtwXSAtIGNoYXJ0QXJlYVJlY3RbcF0pfXB4XCJcbiAgICAgICAgX2xlZ2VuZFNjb3BlLnRpdGxlID0gX3RpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF9wYXJzZWRUZW1wbGF0ZS5yZW1vdmUoKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5yZWdpc3RlciA9IChsYXlvdXQpIC0+XG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gXCJkcmF3LiN7X2lkfVwiLCBtZS5kcmF3XG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRlbXBsYXRlKHRlbXBsYXRlRGlyICsgJ2xlZ2VuZC5odG1sJylcblxuICAgIG1lLnJlZHJhdyA9ICgpIC0+XG4gICAgICBpZiBfZGF0YSBhbmQgX29wdGlvbnNcbiAgICAgICAgbWUuZHJhdyhfZGF0YSwgX29wdGlvbnMpXG4gICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBsZWdlbmQiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdzY2FsZScsICgkbG9nLCBsZWdlbmQsIGZvcm1hdERlZmF1bHRzLCB3a0NoYXJ0U2NhbGVzLCB3a0NoYXJ0TG9jYWxlKSAtPlxuXG4gIHNjYWxlID0gKCkgLT5cbiAgICBfaWQgPSAnJ1xuICAgIF9zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgX3NjYWxlVHlwZSA9ICdsaW5lYXInXG4gICAgX2V4cG9uZW50ID0gMVxuICAgIF9pc09yZGluYWwgPSBmYWxzZVxuICAgIF9kb21haW4gPSB1bmRlZmluZWRcbiAgICBfZG9tYWluQ2FsYyA9IHVuZGVmaW5lZFxuICAgIF9jYWxjdWxhdGVkRG9tYWluID0gdW5kZWZpbmVkXG4gICAgX3Jlc2V0T25OZXdEYXRhID0gZmFsc2VcbiAgICBfcHJvcGVydHkgPSAnJ1xuICAgIF9sYXllclByb3AgPSAnJ1xuICAgIF9sYXllckV4Y2x1ZGUgPSBbXVxuICAgIF9sb3dlclByb3BlcnR5ID0gJydcbiAgICBfdXBwZXJQcm9wZXJ0eSA9ICcnXG4gICAgX3JhbmdlID0gdW5kZWZpbmVkXG4gICAgX3JhbmdlUGFkZGluZyA9IDAuM1xuICAgIF9yYW5nZU91dGVyUGFkZGluZyA9IDAuM1xuICAgIF9pbnB1dEZvcm1hdFN0cmluZyA9IHVuZGVmaW5lZFxuICAgIF9pbnB1dEZvcm1hdEZuID0gKGRhdGEpIC0+IGlmIGlzTmFOKCtkYXRhKSBvciBfLmlzRGF0ZShkYXRhKSB0aGVuIGRhdGEgZWxzZSArZGF0YVxuXG4gICAgX3Nob3dBeGlzID0gZmFsc2VcbiAgICBfYXhpc09yaWVudCA9IHVuZGVmaW5lZFxuICAgIF9heGlzT3JpZW50T2xkID0gdW5kZWZpbmVkXG4gICAgX2F4aXMgPSB1bmRlZmluZWRcbiAgICBfdGlja3MgPSB1bmRlZmluZWRcbiAgICBfdGlja0Zvcm1hdCA9IHVuZGVmaW5lZFxuICAgIF90aWNrVmFsdWVzID0gdW5kZWZpbmVkXG4gICAgX3JvdGF0ZVRpY2tMYWJlbHMgPSB1bmRlZmluZWRcbiAgICBfc2hvd0xhYmVsID0gZmFsc2VcbiAgICBfYXhpc0xhYmVsID0gdW5kZWZpbmVkXG4gICAgX3Nob3dHcmlkID0gZmFsc2VcbiAgICBfaXNIb3Jpem9udGFsID0gZmFsc2VcbiAgICBfaXNWZXJ0aWNhbCA9IGZhbHNlXG4gICAgX2tpbmQgPSB1bmRlZmluZWRcbiAgICBfcGFyZW50ID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0ID0gdW5kZWZpbmVkXG4gICAgX2xheW91dCA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmQgPSBsZWdlbmQoKVxuICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSB1bmRlZmluZWRcbiAgICBfb3V0cHV0Rm9ybWF0Rm4gPSB1bmRlZmluZWRcblxuICAgIF90aWNrRm9ybWF0ID0gd2tDaGFydExvY2FsZS50aW1lRm9ybWF0Lm11bHRpKFtcbiAgICAgIFtcIi4lTFwiLCAoZCkgLT4gIGQuZ2V0TWlsbGlzZWNvbmRzKCldLFxuICAgICAgW1wiOiVTXCIsIChkKSAtPiAgZC5nZXRTZWNvbmRzKCldLFxuICAgICAgW1wiJUk6JU1cIiwgKGQpIC0+ICBkLmdldE1pbnV0ZXMoKV0sXG4gICAgICBbXCIlSSAlcFwiLCAoZCkgLT4gIGQuZ2V0SG91cnMoKV0sXG4gICAgICBbXCIlYSAlZFwiLCAoZCkgLT4gIGQuZ2V0RGF5KCkgYW5kIGQuZ2V0RGF0ZSgpIGlzbnQgMV0sXG4gICAgICBbXCIlYiAlZFwiLCAoZCkgLT4gIGQuZ2V0RGF0ZSgpIGlzbnQgMV0sXG4gICAgICBbXCIlQlwiLCAoZCkgLT4gIGQuZ2V0TW9udGgoKV0sXG4gICAgICBbXCIlWVwiLCAoKSAtPiAgdHJ1ZV1cbiAgICBdKVxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgIy0tLS0gdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAga2V5cyA9IChkYXRhKSAtPiBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBfLnJlamVjdChfLmtleXMoZGF0YVswXSksIChkKSAtPiBkIGlzICckJGhhc2hLZXknKSBlbHNlIF8ucmVqZWN0KF8ua2V5cyhkYXRhKSwgKGQpIC0+IGQgaXMgJyQkaGFzaEtleScpXG5cbiAgICBsYXllclRvdGFsID0gKGQsIGxheWVyS2V5cykgLT5cbiAgICAgIGxheWVyS2V5cy5yZWR1Y2UoXG4gICAgICAgIChwcmV2LCBuZXh0KSAtPiArcHJldiArICttZS5sYXllclZhbHVlKGQsbmV4dClcbiAgICAgICwgMClcblxuICAgIGxheWVyTWF4ID0gKGRhdGEsIGxheWVyS2V5cykgLT5cbiAgICAgIGQzLm1heChkYXRhLCAoZCkgLT4gZDMubWF4KGxheWVyS2V5cywgKGspIC0+IG1lLmxheWVyVmFsdWUoZCxrKSkpXG5cbiAgICBsYXllck1pbiA9IChkYXRhLCBsYXllcktleXMpIC0+XG4gICAgICBkMy5taW4oZGF0YSwgKGQpIC0+IGQzLm1pbihsYXllcktleXMsIChrKSAtPiBtZS5sYXllclZhbHVlKGQsaykpKVxuXG4gICAgcGFyc2VkVmFsdWUgPSAodikgLT5cbiAgICAgIGlmIF9pbnB1dEZvcm1hdEZuLnBhcnNlIHRoZW4gX2lucHV0Rm9ybWF0Rm4ucGFyc2UodikgZWxzZSBfaW5wdXRGb3JtYXRGbih2KVxuXG4gICAgY2FsY0RvbWFpbiA9IHtcbiAgICAgIGV4dGVudDogKGRhdGEpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICByZXR1cm4gW2xheWVyTWluKGRhdGEsIGxheWVyS2V5cyksIGxheWVyTWF4KGRhdGEsIGxheWVyS2V5cyldXG4gICAgICBtYXg6IChkYXRhKSAtPlxuICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgcmV0dXJuIFswLCBsYXllck1heChkYXRhLCBsYXllcktleXMpXVxuICAgICAgbWluOiAoZGF0YSkgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIHJldHVybiBbMCwgbGF5ZXJNaW4oZGF0YSwgbGF5ZXJLZXlzKV1cbiAgICAgIHRvdGFsRXh0ZW50OiAoZGF0YSkgLT5cbiAgICAgICAgaWYgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eSgndG90YWwnKVxuICAgICAgICAgIHJldHVybiBkMy5leHRlbnQoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBkLnRvdGFsKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICAgIHJldHVybiBkMy5leHRlbnQoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBsYXllclRvdGFsKGQsIGxheWVyS2V5cykpKVxuICAgICAgdG90YWw6IChkYXRhKSAtPlxuICAgICAgICBpZiBkYXRhWzBdLmhhc093blByb3BlcnR5KCd0b3RhbCcpXG4gICAgICAgICAgcmV0dXJuIFswLCBkMy5tYXgoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBkLnRvdGFsKSldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgICByZXR1cm4gWzAsIGQzLm1heChkYXRhLm1hcCgoZCkgLT5cbiAgICAgICAgICAgIGxheWVyVG90YWwoZCwgbGF5ZXJLZXlzKSkpXVxuICAgICAgcmFuZ2VFeHRlbnQ6IChkYXRhKSAtPlxuICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICByZXR1cm4gW2QzLm1pbihtZS5sb3dlclZhbHVlKGRhdGEpKSwgZDMubWF4KG1lLnVwcGVyVmFsdWUoZGF0YSkpXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgZGF0YS5sZW5ndGggPiAxXG4gICAgICAgICAgICBzdGFydCA9IG1lLmxvd2VyVmFsdWUoZGF0YVswXSlcbiAgICAgICAgICAgIHN0ZXAgPSBtZS5sb3dlclZhbHVlKGRhdGFbMV0pIC0gc3RhcnRcbiAgICAgICAgICAgIHJldHVybiBbbWUubG93ZXJWYWx1ZShkYXRhWzBdKSwgc3RhcnQgKyBzdGVwICogKGRhdGEubGVuZ3RoKSBdXG4gICAgICByYW5nZU1pbjogKGRhdGEpIC0+XG4gICAgICAgIHJldHVybiBbMCwgZDMubWluKG1lLmxvd2VyVmFsdWUoZGF0YSkpXVxuICAgICAgcmFuZ2VNYXg6IChkYXRhKSAtPlxuICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICByZXR1cm4gWzAsIGQzLm1heChtZS51cHBlclZhbHVlKGRhdGEpKV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHN0YXJ0ID0gbWUubG93ZXJWYWx1ZShkYXRhWzBdKVxuICAgICAgICAgIHN0ZXAgPSBtZS5sb3dlclZhbHVlKGRhdGFbMV0pIC0gc3RhcnRcbiAgICAgICAgICByZXR1cm4gWzAsIHN0YXJ0ICsgc3RlcCAqIChkYXRhLmxlbmd0aCkgXVxuICAgICAgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfa2luZCArICcuJyArIF9wYXJlbnQuaWQoKVxuXG4gICAgbWUua2luZCA9IChraW5kKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9raW5kXG4gICAgICBlbHNlXG4gICAgICAgIF9raW5kID0ga2luZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnBhcmVudCA9IChwYXJlbnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3BhcmVudFxuICAgICAgZWxzZVxuICAgICAgICBfcGFyZW50ID0gcGFyZW50XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuY2hhcnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmxheW91dCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheW91dFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5b3V0ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2NhbGUgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zY2FsZVxuXG4gICAgbWUubGVnZW5kID0gKCkgLT5cbiAgICAgIHJldHVybiBfbGVnZW5kXG5cbiAgICBtZS5pc09yZGluYWwgPSAoKSAtPlxuICAgICAgX2lzT3JkaW5hbFxuXG4gICAgbWUuaXNIb3Jpem9udGFsID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaXNIb3Jpem9udGFsXG4gICAgICBlbHNlXG4gICAgICAgIF9pc0hvcml6b250YWwgPSB0cnVlRmFsc2VcbiAgICAgICAgaWYgdHJ1ZUZhbHNlXG4gICAgICAgICAgX2lzVmVydGljYWwgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmlzVmVydGljYWwgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9pc1ZlcnRpY2FsXG4gICAgICBlbHNlXG4gICAgICAgIF9pc1ZlcnRpY2FsID0gdHJ1ZUZhbHNlXG4gICAgICAgIGlmIHRydWVGYWxzZVxuICAgICAgICAgIF9pc0hvcml6b250YWwgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLSBTY2FsZVR5cGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5zY2FsZVR5cGUgPSAodHlwZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGVUeXBlXG4gICAgICBlbHNlXG4gICAgICAgIGlmIGQzLnNjYWxlLmhhc093blByb3BlcnR5KHR5cGUpICMgc3VwcG9ydCB0aGUgZnVsbCBsaXN0IG9mIGQzIHNjYWxlIHR5cGVzXG4gICAgICAgICAgX3NjYWxlID0gZDMuc2NhbGVbdHlwZV0oKVxuICAgICAgICAgIF9zY2FsZVR5cGUgPSB0eXBlXG4gICAgICAgICAgbWUuZm9ybWF0KGZvcm1hdERlZmF1bHRzLm51bWJlcilcbiAgICAgICAgZWxzZSBpZiB0eXBlIGlzICd0aW1lJyAjIHRpbWUgc2NhbGUgaXMgaW4gZDMudGltZSBvYmplY3QsIG5vdCBpbiBkMy5zY2FsZS5cbiAgICAgICAgICBfc2NhbGUgPSBkMy50aW1lLnNjYWxlKClcbiAgICAgICAgICBfc2NhbGVUeXBlID0gJ3RpbWUnXG4gICAgICAgICAgaWYgX2lucHV0Rm9ybWF0U3RyaW5nXG4gICAgICAgICAgICBtZS5kYXRhRm9ybWF0KF9pbnB1dEZvcm1hdFN0cmluZylcbiAgICAgICAgICBtZS5mb3JtYXQoZm9ybWF0RGVmYXVsdHMuZGF0ZSlcbiAgICAgICAgZWxzZSBpZiB3a0NoYXJ0U2NhbGVzLmhhc093blByb3BlcnR5KHR5cGUpXG4gICAgICAgICAgX3NjYWxlVHlwZSA9IHR5cGVcbiAgICAgICAgICBfc2NhbGUgPSB3a0NoYXJ0U2NhbGVzW3R5cGVdKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRsb2cuZXJyb3IgJ0Vycm9yOiBpbGxlZ2FsIHNjYWxlIHR5cGU6JywgdHlwZVxuXG4gICAgICAgIF9pc09yZGluYWwgPSBfc2NhbGVUeXBlIGluIFsnb3JkaW5hbCcsICdjYXRlZ29yeTEwJywgJ2NhdGVnb3J5MjAnLCAnY2F0ZWdvcnkyMGInLCAnY2F0ZWdvcnkyMGMnXVxuICAgICAgICBpZiBfcmFuZ2VcbiAgICAgICAgICBtZS5yYW5nZShfcmFuZ2UpXG5cbiAgICAgICAgaWYgX3Nob3dBeGlzXG4gICAgICAgICAgX2F4aXMuc2NhbGUoX3NjYWxlKVxuXG4gICAgICAgIGlmIF9leHBvbmVudCBhbmQgX3NjYWxlVHlwZSBpcyAncG93J1xuICAgICAgICAgIF9zY2FsZS5leHBvbmVudChfZXhwb25lbnQpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZXhwb25lbnQgPSAodmFsdWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2V4cG9uZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9leHBvbmVudCA9IHZhbHVlXG4gICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ3BvdydcbiAgICAgICAgICBfc2NhbGUuZXhwb25lbnQoX2V4cG9uZW50KVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gRG9tYWluIGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5kb21haW4gPSAoZG9tKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9kb21haW5cbiAgICAgIGVsc2VcbiAgICAgICAgX2RvbWFpbiA9IGRvbVxuICAgICAgICBpZiBfLmlzQXJyYXkoX2RvbWFpbilcbiAgICAgICAgICBfc2NhbGUuZG9tYWluKF9kb21haW4pXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZG9tYWluQ2FsYyA9IChydWxlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBpZiBfaXNPcmRpbmFsIHRoZW4gdW5kZWZpbmVkIGVsc2UgX2RvbWFpbkNhbGNcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgY2FsY0RvbWFpbi5oYXNPd25Qcm9wZXJ0eShydWxlKVxuICAgICAgICAgIF9kb21haW5DYWxjID0gcnVsZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJGxvZy5lcnJvciAnaWxsZWdhbCBkb21haW4gY2FsY3VsYXRpb24gcnVsZTonLCBydWxlLCBcIiBleHBlY3RlZFwiLCBfLmtleXMoY2FsY0RvbWFpbilcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5nZXREb21haW4gPSAoZGF0YSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGUuZG9tYWluKClcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9kb21haW4gYW5kIG1lLmRvbWFpbkNhbGMoKVxuICAgICAgICAgICAgcmV0dXJuIF9jYWxjdWxhdGVkRG9tYWluXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBfZG9tYWluXG4gICAgICAgICAgICByZXR1cm4gX2RvbWFpblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBtZS52YWx1ZShkYXRhKVxuXG4gICAgbWUucmVzZXRPbk5ld0RhdGEgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9yZXNldE9uTmV3RGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfcmVzZXRPbk5ld0RhdGEgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIFJhbmdlIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUucmFuZ2UgPSAocmFuZ2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlLnJhbmdlKClcbiAgICAgIGVsc2VcbiAgICAgICAgX3JhbmdlID0gcmFuZ2VcbiAgICAgICAgaWYgX3NjYWxlVHlwZSBpcyAnb3JkaW5hbCcgYW5kIG1lLmtpbmQoKSBpbiBbJ3gnLCd5J11cbiAgICAgICAgICAgIF9zY2FsZS5yYW5nZUJhbmRzKHJhbmdlLCBfcmFuZ2VQYWRkaW5nLCBfcmFuZ2VPdXRlclBhZGRpbmcpXG4gICAgICAgIGVsc2UgaWYgbm90IChfc2NhbGVUeXBlIGluIFsnY2F0ZWdvcnkxMCcsICdjYXRlZ29yeTIwJywgJ2NhdGVnb3J5MjBiJywgJ2NhdGVnb3J5MjBjJ10pXG4gICAgICAgICAgX3NjYWxlLnJhbmdlKHJhbmdlKSAjIGlnbm9yZSByYW5nZSBmb3IgY29sb3IgY2F0ZWdvcnkgc2NhbGVzXG5cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5yYW5nZVBhZGRpbmcgPSAoY29uZmlnKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIHtwYWRkaW5nOl9yYW5nZVBhZGRpbmcsIG91dGVyUGFkZGluZzpfcmFuZ2VPdXRlclBhZGRpbmd9XG4gICAgICBlbHNlXG4gICAgICAgIF9yYW5nZVBhZGRpbmcgPSBjb25maWcucGFkZGluZ1xuICAgICAgICBfcmFuZ2VPdXRlclBhZGRpbmcgPSBjb25maWcub3V0ZXJQYWRkaW5nXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBwcm9wZXJ0eSByZWxhdGVkIGF0dHJpYnV0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Byb3BlcnR5XG4gICAgICBlbHNlXG4gICAgICAgIF9wcm9wZXJ0eSA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllclByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheWVyUHJvcFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJQcm9wID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxheWVyRXhjbHVkZSA9IChleGNsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXllckV4Y2x1ZGVcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyRXhjbHVkZSA9IGV4Y2xcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllcktleXMgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF9wcm9wZXJ0eVxuICAgICAgICBpZiBfLmlzQXJyYXkoX3Byb3BlcnR5KVxuICAgICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihfcHJvcGVydHksIGtleXMoZGF0YSkpICMgZW5zdXJlIG9ubHkga2V5cyBhbHNvIGluIHRoZSBkYXRhIGFyZSByZXR1cm5lZCBhbmQgJCRoYXNoS2V5IGlzIG5vdCByZXR1cm5lZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIFtfcHJvcGVydHldICNhbHdheXMgcmV0dXJuIGFuIGFycmF5ICEhIVxuICAgICAgZWxzZVxuICAgICAgICBfLnJlamVjdChrZXlzKGRhdGEpLCAoZCkgLT4gZCBpbiBfbGF5ZXJFeGNsdWRlKVxuXG4gICAgbWUubG93ZXJQcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sb3dlclByb3BlcnR5XG4gICAgICBlbHNlXG4gICAgICAgIF9sb3dlclByb3BlcnR5ID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnVwcGVyUHJvcGVydHkgPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdXBwZXJQcm9wZXJ0eVxuICAgICAgZWxzZVxuICAgICAgICBfdXBwZXJQcm9wZXJ0eSA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIERhdGEgRm9ybWF0dGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZGF0YUZvcm1hdCA9IChmb3JtYXQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2lucHV0Rm9ybWF0U3RyaW5nXG4gICAgICBlbHNlXG4gICAgICAgIF9pbnB1dEZvcm1hdFN0cmluZyA9IGZvcm1hdFxuICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICd0aW1lJ1xuICAgICAgICAgIF9pbnB1dEZvcm1hdEZuID0gd2tDaGFydExvY2FsZS50aW1lRm9ybWF0KGZvcm1hdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9pbnB1dEZvcm1hdEZuID0gKGQpIC0+IGRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIENvcmUgZGF0YSB0cmFuc2Zvcm1hdGlvbiBpbnRlcmZhY2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUudmFsdWUgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF9sYXllclByb3BcbiAgICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3Byb3BlcnR5XVtfbGF5ZXJQcm9wXSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfcHJvcGVydHldW19sYXllclByb3BdKVxuICAgICAgZWxzZVxuICAgICAgICBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gcGFyc2VkVmFsdWUoZFtfcHJvcGVydHldKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW19wcm9wZXJ0eV0pXG5cbiAgICBtZS5sYXllclZhbHVlID0gKGRhdGEsIGxheWVyS2V5KSAtPlxuICAgICAgaWYgX2xheWVyUHJvcFxuICAgICAgICBwYXJzZWRWYWx1ZShkYXRhW2xheWVyS2V5XVtfbGF5ZXJQcm9wXSlcbiAgICAgIGVsc2VcbiAgICAgICAgcGFyc2VkVmFsdWUoZGF0YVtsYXllcktleV0pXG5cbiAgICBtZS5sb3dlclZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gcGFyc2VkVmFsdWUoZFtfbG93ZXJQcm9wZXJ0eV0pKSBlbHNlIHBhcnNlZFZhbHVlKGRhdGFbX2xvd2VyUHJvcGVydHldKVxuXG4gICAgbWUudXBwZXJWYWx1ZSA9IChkYXRhKSAtPlxuICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3VwcGVyUHJvcGVydHldKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW191cHBlclByb3BlcnR5XSlcblxuICAgIG1lLmZvcm1hdHRlZFZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBtZS5mb3JtYXRWYWx1ZShtZS52YWx1ZShkYXRhKSlcblxuICAgIG1lLmZvcm1hdFZhbHVlID0gKHZhbCkgLT5cbiAgICAgIGlmIF9vdXRwdXRGb3JtYXRTdHJpbmcgYW5kIHZhbCBhbmQgICh2YWwuZ2V0VVRDRGF0ZSBvciBub3QgaXNOYU4odmFsKSlcbiAgICAgICAgX291dHB1dEZvcm1hdEZuKHZhbClcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsXG5cbiAgICBtZS5tYXAgPSAoZGF0YSkgLT5cbiAgICAgIGlmIEFycmF5LmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gX3NjYWxlKG1lLnZhbHVlKGRhdGEpKSkgZWxzZSBfc2NhbGUobWUudmFsdWUoZGF0YSkpXG5cbiAgICBtZS5pbnZlcnQgPSAobWFwcGVkVmFsdWUpIC0+XG4gICAgICAjIHRha2VzIGEgbWFwcGVkIHZhbHVlIChwaXhlbCBwb3NpdGlvbiAsIGNvbG9yIHZhbHVlLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluIHRoZSBpbnB1dCBkb21haW5cbiAgICAgICMgdGhlIHR5cGUgb2YgaW52ZXJzZSBpcyBkZXBlbmRlbnQgb24gdGhlIHNjYWxlIHR5cGUgZm9yIHF1YW50aXRhdGl2ZSBzY2FsZXMuXG4gICAgICAjIE9yZGluYWwgc2NhbGVzIC4uLlxuXG4gICAgICBpZiBfLmhhcyhtZS5zY2FsZSgpLCdpbnZlcnQnKSAjIGkuZS4gdGhlIGQzIHNjYWxlIHN1cHBvcnRzIHRoZSBpbnZlcnNlIGNhbGN1bGF0aW9uOiBsaW5lYXIsIGxvZywgcG93LCBzcXJ0XG4gICAgICAgIF9kYXRhID0gbWUuY2hhcnQoKS5nZXREYXRhKClcblxuICAgICAgICAjIGJpc2VjdC5sZWZ0IG5ldmVyIHJldHVybnMgMCBpbiB0aGlzIHNwZWNpZmljIHNjZW5hcmlvLiBXZSBuZWVkIHRvIG1vdmUgdGhlIHZhbCBieSBhbiBpbnRlcnZhbCB0byBoaXQgdGhlIG1pZGRsZSBvZiB0aGUgcmFuZ2UgYW5kIHRvIGVuc3VyZVxuICAgICAgICAjIHRoYXQgdGhlIGZpcnN0IGVsZW1lbnQgd2lsbCBiZSBjYXB0dXJlZC4gQWxzbyBlbnN1cmVzIGJldHRlciB2aXN1YWwgZXhwZXJpZW5jZSB3aXRoIHRvb2x0aXBzXG4gICAgICAgIGlmIG1lLmtpbmQoKSBpcyAncmFuZ2VYJyBvciBtZS5raW5kKCkgaXMgJ3JhbmdlWSdcbiAgICAgICAgICB2YWwgPSBtZS5zY2FsZSgpLmludmVydChtYXBwZWRWYWx1ZSlcbiAgICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICAgIGJpc2VjdCA9IGQzLmJpc2VjdG9yKG1lLnVwcGVyVmFsdWUpLmxlZnRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGVwID0gbWUubG93ZXJWYWx1ZShfZGF0YVsxXSkgLSBtZS5sb3dlclZhbHVlKF9kYXRhWzBdKVxuICAgICAgICAgICAgYmlzZWN0ID0gZDMuYmlzZWN0b3IoKGQpIC0+IG1lLmxvd2VyVmFsdWUoZCkgKyBzdGVwKS5sZWZ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByYW5nZSA9IF9zY2FsZS5yYW5nZSgpXG4gICAgICAgICAgaW50ZXJ2YWwgPSAocmFuZ2VbMV0gLSByYW5nZVswXSkgLyBfZGF0YS5sZW5ndGhcbiAgICAgICAgICB2YWwgPSBtZS5zY2FsZSgpLmludmVydChtYXBwZWRWYWx1ZSAtIGludGVydmFsLzIpXG4gICAgICAgICAgYmlzZWN0ID0gZDMuYmlzZWN0b3IobWUudmFsdWUpLmxlZnRcblxuICAgICAgICBpZHggPSBiaXNlY3QoX2RhdGEsIHZhbClcbiAgICAgICAgaWR4ID0gaWYgaWR4IDwgMCB0aGVuIDAgZWxzZSBpZiBpZHggPj0gX2RhdGEubGVuZ3RoIHRoZW4gX2RhdGEubGVuZ3RoIC0gMSBlbHNlIGlkeFxuICAgICAgICByZXR1cm4gaWR4ICMgdGhlIGludmVyc2UgdmFsdWUgZG9lcyBub3QgbmVjZXNzYXJpbHkgY29ycmVzcG9uZCB0byBhIHZhbHVlIGluIHRoZSBkYXRhXG5cbiAgICAgIGlmIF8uaGFzKG1lLnNjYWxlKCksJ2ludmVydEV4dGVudCcpICMgZDMgc3VwcG9ydHMgdGhpcyBmb3IgcXVhbnRpemUsIHF1YW50aWxlLCB0aHJlc2hvbGQuIHJldHVybnMgdGhlIHJhbmdlIHRoYXQgZ2V0cyBtYXBwZWQgdG8gdGhlIHZhbHVlXG4gICAgICAgIHJldHVybiBtZS5zY2FsZSgpLmludmVydEV4dGVudChtYXBwZWRWYWx1ZSkgI1RPRE8gSG93IHNob3VsZCB0aGlzIGJlIG1hcHBlZCBjb3JyZWN0bHkuIFVzZSBjYXNlPz8/XG5cbiAgICAgICMgZDMgZG9lcyBub3Qgc3VwcG9ydCBpbnZlcnQgZm9yIG9yZGluYWwgc2NhbGVzLCB0aHVzIHRoaW5ncyBiZWNvbWUgYSBiaXQgbW9yZSB0cmlja3kuXG4gICAgICAjIGluIGNhc2Ugd2UgYXJlIHNldHRpbmcgdGhlIGRvbWFpbiBleHBsaWNpdGx5LCB3ZSBrbm93IHRoYSB0aGUgcmFuZ2UgdmFsdWVzIGFuZCB0aGUgZG9tYWluIGVsZW1lbnRzIGFyZSBpbiB0aGUgc2FtZSBvcmRlclxuICAgICAgIyBpbiBjYXNlIHRoZSBkb21haW4gaXMgc2V0ICdsYXp5JyAoaS5lLiBhcyB2YWx1ZXMgYXJlIHVzZWQpIHdlIGNhbm5vdCBtYXAgcmFuZ2UgYW5kIGRvbWFpbiB2YWx1ZXMgZWFzaWx5LiBOb3QgY2xlYXIgaG93IHRvIGRvIHRoaXMgZWZmZWN0aXZlbHlcblxuICAgICAgaWYgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBkb21haW4gPSBfc2NhbGUuZG9tYWluKClcbiAgICAgICAgcmFuZ2UgPSBfc2NhbGUucmFuZ2UoKVxuICAgICAgICBpZiBfaXNWZXJ0aWNhbFxuICAgICAgICAgIGludGVydmFsID0gcmFuZ2VbMF0gLSByYW5nZVsxXVxuICAgICAgICAgIGlkeCA9IHJhbmdlLmxlbmd0aCAtIE1hdGguZmxvb3IobWFwcGVkVmFsdWUgLyBpbnRlcnZhbCkgLSAxXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpbnRlcnZhbCA9IHJhbmdlWzFdIC0gcmFuZ2VbMF1cbiAgICAgICAgICBpZHggPSBNYXRoLmZsb29yKG1hcHBlZFZhbHVlIC8gaW50ZXJ2YWwpXG4gICAgICAgIHJldHVybiBpZHhcblxuICAgIG1lLmludmVydE9yZGluYWwgPSAobWFwcGVkVmFsdWUpIC0+XG4gICAgICBpZiBtZS5pc09yZGluYWwoKSBhbmQgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBpZHggPSBtZS5pbnZlcnQobWFwcGVkVmFsdWUpXG4gICAgICAgIHJldHVybiBfc2NhbGUuZG9tYWluKClbaWR4XVxuXG5cbiAgICAjLS0tIEF4aXMgQXR0cmlidXRlcyBhbmQgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2hvd0F4aXMgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93QXhpc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0F4aXMgPSB0cnVlRmFsc2VcbiAgICAgICAgaWYgdHJ1ZUZhbHNlXG4gICAgICAgICAgX2F4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAgICAgaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnXG4gICAgICAgICAgICBfYXhpcy50aWNrRm9ybWF0KF90aWNrRm9ybWF0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2F4aXMgPSB1bmRlZmluZWRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5heGlzT3JpZW50ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXhpc09yaWVudFxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc09yaWVudE9sZCA9IF9heGlzT3JpZW50XG4gICAgICAgIF9heGlzT3JpZW50ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5heGlzT3JpZW50T2xkID0gKHZhbCkgLT4gICNUT0RPIFRoaXMgaXMgbm90IHRoZSBiZXN0IHBsYWNlIHRvIGtlZXAgdGhlIG9sZCBheGlzIHZhbHVlLiBPbmx5IG5lZWRlZCBieSBjb250YWluZXIgaW4gY2FzZSB0aGUgYXhpcyBwb3NpdGlvbiBjaGFuZ2VzXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2F4aXNPcmllbnRPbGRcbiAgICAgIGVsc2VcbiAgICAgICAgX2F4aXNPcmllbnRPbGQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9heGlzXG5cbiAgICBtZS50aWNrcyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpY2tzXG4gICAgICBlbHNlXG4gICAgICAgIF90aWNrcyA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja3MoX3RpY2tzKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUudGlja0Zvcm1hdCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpY2tGb3JtYXRcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tGb3JtYXQgPSB2YWxcbiAgICAgICAgaWYgbWUuYXhpcygpXG4gICAgICAgICAgbWUuYXhpcygpLnRpY2tGb3JtYXQodmFsKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUudGlja1ZhbHVlcyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpY2tWYWx1ZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tWYWx1ZXMgPSB2YWxcbiAgICAgICAgaWYgbWUuYXhpcygpXG4gICAgICAgICAgbWUuYXhpcygpLnRpY2tWYWx1ZXModmFsKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNob3dMYWJlbCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dMYWJlbFxuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0xhYmVsID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5heGlzTGFiZWwgPSAodGV4dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gaWYgX2F4aXNMYWJlbCB0aGVuIF9heGlzTGFiZWwgZWxzZSBtZS5wcm9wZXJ0eSgpXG4gICAgICBlbHNlXG4gICAgICAgIF9heGlzTGFiZWwgPSB0ZXh0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucm90YXRlVGlja0xhYmVscyA9IChuYnIpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3JvdGF0ZVRpY2tMYWJlbHNcbiAgICAgIGVsc2VcbiAgICAgICAgX3JvdGF0ZVRpY2tMYWJlbHMgPSBuYnJcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5mb3JtYXQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9vdXRwdXRGb3JtYXRTdHJpbmdcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBfb3V0cHV0Rm9ybWF0U3RyaW5nID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfb3V0cHV0Rm9ybWF0U3RyaW5nID0gaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnIHRoZW4gZm9ybWF0RGVmYXVsdHMuZGF0ZSBlbHNlIGZvcm1hdERlZmF1bHRzLm51bWJlclxuICAgICAgICBfb3V0cHV0Rm9ybWF0Rm4gPSBpZiBtZS5zY2FsZVR5cGUoKSBpcyAndGltZScgdGhlbiB3a0NoYXJ0TG9jYWxlLnRpbWVGb3JtYXQoX291dHB1dEZvcm1hdFN0cmluZykgZWxzZSB3a0NoYXJ0TG9jYWxlLm51bWJlckZvcm1hdChfb3V0cHV0Rm9ybWF0U3RyaW5nKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ0ZcblxuICAgIG1lLnNob3dHcmlkID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0dyaWRcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dHcmlkID0gdHJ1ZUZhbHNlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tIFJlZ2lzdGVyIGZvciBkcmF3aW5nIGxpZmVjeWNsZSBldmVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnJlZ2lzdGVyID0gKCkgLT5cbiAgICAgIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkub24gXCJzY2FsZURvbWFpbnMuI3ttZS5pZCgpfVwiLCAoZGF0YSkgLT5cbiAgICAgICAgIyBzZXQgdGhlIGRvbWFpbiBpZiByZXF1aXJlZFxuICAgICAgICBpZiBtZS5yZXNldE9uTmV3RGF0YSgpXG4gICAgICAgICAgIyBlbnN1cmUgcm9idXN0IGJlaGF2aW9yIGluIGNhc2Ugb2YgcHJvYmxlbWF0aWMgZGVmaW5pdGlvbnNcbiAgICAgICAgICBkb21haW4gPSBtZS5nZXREb21haW4oZGF0YSlcbiAgICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICdsaW5lYXInIGFuZCBfLnNvbWUoZG9tYWluLCBpc05hTilcbiAgICAgICAgICAgIHRocm93IFwiU2NhbGUgI3ttZS5raW5kKCl9LCBUeXBlICcje19zY2FsZVR5cGV9JzogY2Fubm90IGNvbXB1dGUgZG9tYWluIGZvciBwcm9wZXJ0eSAnI3tfcHJvcGVydHl9JyAuIFBvc3NpYmxlIHJlYXNvbnM6IHByb3BlcnR5IG5vdCBzZXQsIGRhdGEgbm90IGNvbXBhdGlibGUgd2l0aCBkZWZpbmVkIHR5cGUuIERvbWFpbjoje2RvbWFpbn1cIlxuXG4gICAgICAgICAgX3NjYWxlLmRvbWFpbihkb21haW4pXG5cbiAgICAgIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkub24gXCJwcmVwYXJlRGF0YS4je21lLmlkKCl9XCIsIChkYXRhKSAtPlxuICAgICAgICAjIGNvbXB1dGUgdGhlIGRvbWFpbiByYW5nZSBjYWxjdWxhdGlvbiBpZiByZXF1aXJlZFxuICAgICAgICBjYWxjUnVsZSA9ICBtZS5kb21haW5DYWxjKClcbiAgICAgICAgaWYgbWUucGFyZW50KCkuc2NhbGVQcm9wZXJ0aWVzXG4gICAgICAgICAgbWUubGF5ZXJFeGNsdWRlKG1lLnBhcmVudCgpLnNjYWxlUHJvcGVydGllcygpKVxuICAgICAgICBpZiBjYWxjUnVsZSBhbmQgY2FsY0RvbWFpbltjYWxjUnVsZV1cbiAgICAgICAgICBfY2FsY3VsYXRlZERvbWFpbiA9IGNhbGNEb21haW5bY2FsY1J1bGVdKGRhdGEpXG5cbiAgICBtZS51cGRhdGUgPSAobm9BbmltYXRpb24pIC0+XG4gICAgICBtZS5wYXJlbnQoKS5saWZlQ3ljbGUoKS51cGRhdGUobm9BbmltYXRpb24pXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnVwZGF0ZUF0dHJzID0gKCkgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLnVwZGF0ZUF0dHJzKClcblxuICAgIG1lLmRyYXdBeGlzID0gKCkgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLmRyYXdBeGlzKClcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIHNjYWxlIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnc2NhbGVMaXN0JywgKCRsb2cpIC0+XG4gIHJldHVybiBzY2FsZUxpc3QgPSAoKSAtPlxuICAgIF9saXN0ID0ge31cbiAgICBfa2luZExpc3QgPSB7fVxuICAgIF9wYXJlbnRMaXN0ID0ge31cbiAgICBfb3duZXIgPSB1bmRlZmluZWRcbiAgICBfcmVxdWlyZWRTY2FsZXMgPSBbXVxuICAgIF9sYXllclNjYWxlID0gdW5kZWZpbmVkXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBtZS5vd25lciA9IChvd25lcikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfb3duZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX293bmVyID0gb3duZXJcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGQgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBfbGlzdFtzY2FsZS5pZCgpXVxuICAgICAgICAkbG9nLmVycm9yIFwic2NhbGVMaXN0LmFkZDogc2NhbGUgI3tzY2FsZS5pZCgpfSBhbHJlYWR5IGRlZmluZWQgaW4gc2NhbGVMaXN0IG9mICN7X293bmVyLmlkKCl9LiBEdXBsaWNhdGUgc2NhbGVzIGFyZSBub3QgYWxsb3dlZFwiXG4gICAgICBfbGlzdFtzY2FsZS5pZCgpXSA9IHNjYWxlXG4gICAgICBfa2luZExpc3Rbc2NhbGUua2luZCgpXSA9IHNjYWxlXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmhhc1NjYWxlID0gKHNjYWxlKSAtPlxuICAgICAgcyA9IG1lLmdldEtpbmQoc2NhbGUua2luZCgpKVxuICAgICAgcmV0dXJuIHMuaWQoKSBpcyBzY2FsZS5pZCgpXG5cbiAgICBtZS5nZXRLaW5kID0gKGtpbmQpIC0+XG4gICAgICBpZiBfa2luZExpc3Rba2luZF0gdGhlbiBfa2luZExpc3Rba2luZF0gZWxzZSBpZiBfcGFyZW50TGlzdC5nZXRLaW5kIHRoZW4gX3BhcmVudExpc3QuZ2V0S2luZChraW5kKSBlbHNlIHVuZGVmaW5lZFxuXG4gICAgbWUuaGFzS2luZCA9IChraW5kKSAtPlxuICAgICAgcmV0dXJuICEhbWUuZ2V0S2luZChraW5kKVxuXG4gICAgbWUucmVtb3ZlID0gKHNjYWxlKSAtPlxuICAgICAgaWYgbm90IF9saXN0W3NjYWxlLmlkKCldXG4gICAgICAgICRsb2cud2FybiBcInNjYWxlTGlzdC5kZWxldGU6IHNjYWxlICN7c2NhbGUuaWQoKX0gbm90IGRlZmluZWQgaW4gc2NhbGVMaXN0IG9mICN7X293bmVyLmlkKCl9LiBJZ25vcmluZ1wiXG4gICAgICAgIHJldHVybiBtZVxuICAgICAgZGVsZXRlIF9saXN0W3NjYWxlLmlkKCldXG4gICAgICBkZWxldGUgbWVbc2NhbGUuaWRdXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnBhcmVudFNjYWxlcyA9IChzY2FsZUxpc3QpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3BhcmVudExpc3RcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhcmVudExpc3QgPSBzY2FsZUxpc3RcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5nZXRPd25lZCA9ICgpIC0+XG4gICAgICBfbGlzdFxuXG4gICAgbWUuYWxsS2luZHMgPSAoKSAtPlxuICAgICAgcmV0ID0ge31cbiAgICAgIGlmIF9wYXJlbnRMaXN0LmFsbEtpbmRzXG4gICAgICAgIGZvciBrLCBzIG9mIF9wYXJlbnRMaXN0LmFsbEtpbmRzKClcbiAgICAgICAgICByZXRba10gPSBzXG4gICAgICBmb3IgayxzIG9mIF9raW5kTGlzdFxuICAgICAgICByZXRba10gPSBzXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5yZXF1aXJlZFNjYWxlcyA9IChyZXEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3JlcXVpcmVkU2NhbGVzXG4gICAgICBlbHNlXG4gICAgICAgIF9yZXF1aXJlZFNjYWxlcyA9IHJlcVxuICAgICAgICBmb3IgayBpbiByZXFcbiAgICAgICAgICBpZiBub3QgbWUuaGFzS2luZChrKVxuICAgICAgICAgICAgdGhyb3cgXCJGYXRhbCBFcnJvcjogc2NhbGUgJyN7a30nIHJlcXVpcmVkIGJ1dCBub3QgZGVmaW5lZFwiXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmdldFNjYWxlcyA9IChraW5kTGlzdCkgLT5cbiAgICAgIGwgPSB7fVxuICAgICAgZm9yIGtpbmQgaW4ga2luZExpc3RcbiAgICAgICAgaWYgbWUuaGFzS2luZChraW5kKVxuICAgICAgICAgIGxba2luZF0gPSBtZS5nZXRLaW5kKGtpbmQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBcIkZhdGFsIEVycm9yOiBzY2FsZSAnI3traW5kfScgcmVxdWlyZWQgYnV0IG5vdCBkZWZpbmVkXCJcbiAgICAgIHJldHVybiBsXG5cbiAgICBtZS5nZXRTY2FsZVByb3BlcnRpZXMgPSAoKSAtPlxuICAgICAgbCA9IFtdXG4gICAgICBmb3IgayxzIG9mIG1lLmFsbEtpbmRzKClcbiAgICAgICAgcHJvcCA9IHMucHJvcGVydHkoKVxuICAgICAgICBpZiBwcm9wXG4gICAgICAgICAgaWYgQXJyYXkuaXNBcnJheShwcm9wKVxuICAgICAgICAgICAgbC5jb25jYXQocHJvcClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsLnB1c2gocHJvcClcbiAgICAgIHJldHVybiBsXG5cbiAgICBtZS5sYXllclNjYWxlID0gKGtpbmQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgaWYgX2xheWVyU2NhbGVcbiAgICAgICAgICByZXR1cm4gbWUuZ2V0S2luZChfbGF5ZXJTY2FsZSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJTY2FsZSA9IGtpbmRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnByb3ZpZGVyICd3a0NoYXJ0TG9jYWxlJywgKCkgLT5cblxuICBsb2NhbGUgPSAnZW5fVVMnXG5cbiAgbG9jYWxlcyA9IHtcblxuICAgIGRlX0RFOmQzLmxvY2FsZSh7XG4gICAgICBkZWNpbWFsOiBcIixcIixcbiAgICAgIHRob3VzYW5kczogXCIuXCIsXG4gICAgICBncm91cGluZzogWzNdLFxuICAgICAgY3VycmVuY3k6IFtcIlwiLCBcIiDigqxcIl0sXG4gICAgICBkYXRlVGltZTogXCIlQSwgZGVyICVlLiAlQiAlWSwgJVhcIixcbiAgICAgIGRhdGU6IFwiJWUuJW0uJVlcIixcbiAgICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sICMgdW51c2VkXG4gICAgICBkYXlzOiBbXCJTb25udGFnXCIsIFwiTW9udGFnXCIsIFwiRGllbnN0YWdcIiwgXCJNaXR0d29jaFwiLCBcIkRvbm5lcnN0YWdcIiwgXCJGcmVpdGFnXCIsIFwiU2Ftc3RhZ1wiXSxcbiAgICAgIHNob3J0RGF5czogW1wiU29cIiwgXCJNb1wiLCBcIkRpXCIsIFwiTWlcIiwgXCJEb1wiLCBcIkZyXCIsIFwiU2FcIl0sXG4gICAgICBtb250aHM6IFtcIkphbnVhclwiLCBcIkZlYnJ1YXJcIiwgXCJNw6RyelwiLCBcIkFwcmlsXCIsIFwiTWFpXCIsIFwiSnVuaVwiLCBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsXG4gICAgICAgICAgICAgICBcIk5vdmVtYmVyXCIsIFwiRGV6ZW1iZXJcIl0sXG4gICAgICBzaG9ydE1vbnRoczogW1wiSmFuXCIsIFwiRmViXCIsIFwiTXJ6XCIsIFwiQXByXCIsIFwiTWFpXCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2t0XCIsIFwiTm92XCIsIFwiRGV6XCJdXG4gICAgfSksXG5cbiAgICAnZW5fVVMnOiBkMy5sb2NhbGUoe1xuICAgICAgXCJkZWNpbWFsXCI6IFwiLlwiLFxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIsXCIsXG4gICAgICBcImdyb3VwaW5nXCI6IFszXSxcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLCBcIlwiXSxcbiAgICAgIFwiZGF0ZVRpbWVcIjogXCIlYSAlYiAlZSAlWCAlWVwiLFxuICAgICAgXCJkYXRlXCI6IFwiJW0vJWQvJVlcIixcbiAgICAgIFwidGltZVwiOiBcIiVIOiVNOiVTXCIsXG4gICAgICBcInBlcmlvZHNcIjogW1wiQU1cIiwgXCJQTVwiXSxcbiAgICAgIFwiZGF5c1wiOiBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXSxcbiAgICAgIFwic2hvcnREYXlzXCI6IFtcIlN1blwiLCBcIk1vblwiLCBcIlR1ZVwiLCBcIldlZFwiLCBcIlRodVwiLCBcIkZyaVwiLCBcIlNhdFwiXSxcbiAgICAgIFwibW9udGhzXCI6IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIixcbiAgICAgICAgICAgICAgICAgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdLFxuICAgICAgXCJzaG9ydE1vbnRoc1wiOiBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNYXJcIiwgXCJBcHJcIiwgXCJNYXlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPY3RcIiwgXCJOb3ZcIiwgXCJEZWNcIl1cbiAgICB9KVxuICB9XG5cbiAgdGhpcy5zZXRMb2NhbGUgPSAobCkgLT5cbiAgICBpZiBfLmhhcyhsb2NhbGVzLCBsKVxuICAgICAgbG9jYWxlID0gbFxuICAgIGVsc2VcbiAgICAgIHRocm93IFwidW5rbm93bSBsb2NhbGUgJyN7bH0nIHVzaW5nICdlbi1VUycgaW5zdGVhZFwiXG5cblxuICB0aGlzLiRnZXQgPSBbJyRsb2cnLCgkbG9nKSAtPlxuICAgIHJldHVybiBsb2NhbGVzW2xvY2FsZV1cbiAgXVxuXG4gIHJldHVybiB0aGlzIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykucHJvdmlkZXIgJ3drQ2hhcnRTY2FsZXMnLCAoKSAtPlxuXG4gIF9jdXN0b21Db2xvcnMgPSBbJ3JlZCcsICdncmVlbicsJ2JsdWUnLCd5ZWxsb3cnLCdvcmFuZ2UnXVxuXG4gIGhhc2hlZCA9ICgpIC0+XG4gICAgZDNTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXG4gICAgX2hhc2hGbiA9ICh2YWx1ZSkgLT5cbiAgICAgIGhhc2ggPSAwO1xuICAgICAgbSA9IGQzU2NhbGUucmFuZ2UoKS5sZW5ndGggLSAxXG4gICAgICBmb3IgaSBpbiBbMCAuLiB2YWx1ZS5sZW5ndGhdXG4gICAgICAgIGhhc2ggPSAoMzEgKiBoYXNoICsgdmFsdWUuY2hhckF0KGkpKSAlIG07XG5cbiAgICBtZSA9ICh2YWx1ZSkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gbWVcbiAgICAgIGQzU2NhbGUoX2hhc2hGbih2YWx1ZSkpXG5cbiAgICBtZS5yYW5nZSA9IChyYW5nZSkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gZDNTY2FsZS5yYW5nZSgpXG4gICAgICBkM1NjYWxlLmRvbWFpbihkMy5yYW5nZShyYW5nZS5sZW5ndGgpKVxuICAgICAgZDNTY2FsZS5yYW5nZShyYW5nZSlcblxuICAgIG1lLnJhbmdlUG9pbnQgPSBkM1NjYWxlLnJhbmdlUG9pbnRzXG4gICAgbWUucmFuZ2VCYW5kcyA9IGQzU2NhbGUucmFuZ2VCYW5kc1xuICAgIG1lLnJhbmdlUm91bmRCYW5kcyA9IGQzU2NhbGUucmFuZ2VSb3VuZEJhbmRzXG4gICAgbWUucmFuZ2VCYW5kID0gZDNTY2FsZS5yYW5nZUJhbmRcbiAgICBtZS5yYW5nZUV4dGVudCA9IGQzU2NhbGUucmFuZ2VFeHRlbnRcblxuICAgIG1lLmhhc2ggPSAoZm4pIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9oYXNoRm5cbiAgICAgIF9oYXNoRm4gPSBmblxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICBjYXRlZ29yeUNvbG9ycyA9ICgpIC0+IHJldHVybiBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2UoX2N1c3RvbUNvbG9ycylcblxuICBjYXRlZ29yeUNvbG9yc0hhc2hlZCA9ICgpIC0+IHJldHVybiBoYXNoZWQoKS5yYW5nZShfY3VzdG9tQ29sb3JzKVxuXG4gIHRoaXMuY29sb3JzID0gKGNvbG9ycykgLT5cbiAgICBfY3VzdG9tQ29sb3JzID0gY29sb3JzXG5cbiAgdGhpcy4kZ2V0ID0gWyckbG9nJywoJGxvZykgLT5cbiAgICByZXR1cm4ge2hhc2hlZDpoYXNoZWQsY29sb3JzOmNhdGVnb3J5Q29sb3JzLCBjb2xvcnNIYXNoZWQ6IGNhdGVnb3J5Q29sb3JzSGFzaGVkfVxuICBdXG5cbiAgcmV0dXJuIHRoaXMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbG9yJywgKCRsb2csIHNjYWxlLCBsZWdlbmQsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ2NvbG9yJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlQ29sb3InXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuICAgICAgbCA9IHVuZGVmaW5lZFxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ2NvbG9yJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdjYXRlZ29yeTIwJylcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnNlcnZpY2UgJ3NjYWxlVXRpbHMnLCAoJGxvZywgd2tDaGFydFNjYWxlcywgdXRpbHMpIC0+XG5cbiAgcGFyc2VMaXN0ID0gKHZhbCkgLT5cbiAgICBpZiB2YWxcbiAgICAgIGwgPSB2YWwudHJpbSgpLnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJykuc3BsaXQoJywnKS5tYXAoKGQpIC0+IGQucmVwbGFjZSgvXltcXFwifCddfFtcXFwifCddJC9nLCAnJykpXG4gICAgICBsID0gbC5tYXAoKGQpIC0+IGlmIGlzTmFOKGQpIHRoZW4gZCBlbHNlICtkKVxuICAgICAgcmV0dXJuIGlmIGwubGVuZ3RoIGlzIDEgdGhlbiByZXR1cm4gbFswXSBlbHNlIGxcblxuICByZXR1cm4ge1xuXG4gICAgb2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXM6IChhdHRycywgbWUpIC0+XG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndHlwZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIGQzLnNjYWxlLmhhc093blByb3BlcnR5KHZhbCkgb3IgdmFsIGlzICd0aW1lJyBvciB3a0NoYXJ0U2NhbGVzLmhhc093blByb3BlcnR5KHZhbClcbiAgICAgICAgICAgIG1lLnNjYWxlVHlwZSh2YWwpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgdmFsIGlzbnQgJydcbiAgICAgICAgICAgICAgIyMgbm8gc2NhbGUgZGVmaW5lZCwgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgICAgJGxvZy5lcnJvciBcIkVycm9yOiBpbGxlZ2FsIHNjYWxlIHZhbHVlOiAje3ZhbH0uIFVzaW5nICdsaW5lYXInIHNjYWxlIGluc3RlYWRcIlxuICAgICAgICAgIG1lLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdleHBvbmVudCcsICh2YWwpIC0+XG4gICAgICAgIGlmIG1lLnNjYWxlVHlwZSgpIGlzICdwb3cnIGFuZCBfLmlzTnVtYmVyKCt2YWwpXG4gICAgICAgICAgbWUuZXhwb25lbnQoK3ZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3Byb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgbWUucHJvcGVydHkocGFyc2VMaXN0KHZhbCkpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsYXllclByb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIG1lLmxheWVyUHJvcGVydHkodmFsKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncmFuZ2UnLCAodmFsKSAtPlxuICAgICAgICByYW5nZSA9IHBhcnNlTGlzdCh2YWwpXG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkocmFuZ2UpXG4gICAgICAgICAgbWUucmFuZ2UocmFuZ2UpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkYXRlRm9ybWF0JywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnXG4gICAgICAgICAgICBtZS5kYXRhRm9ybWF0KHZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RvbWFpbicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgICRsb2cuaW5mbyAnZG9tYWluJywgdmFsXG4gICAgICAgICAgcGFyc2VkTGlzdCA9IHBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgQXJyYXkuaXNBcnJheShwYXJzZWRMaXN0KVxuICAgICAgICAgICAgbWUuZG9tYWluKHBhcnNlZExpc3QpLnVwZGF0ZSgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgJGxvZy5lcnJvciBcImRvbWFpbjogbXVzdCBiZSBhcnJheSwgb3IgY29tbWEtc2VwYXJhdGVkIGxpc3QsIGdvdFwiLCB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuZG9tYWluKHVuZGVmaW5lZCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RvbWFpblJhbmdlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgbWUuZG9tYWluQ2FsYyh2YWwpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmF4aXNMYWJlbCh2YWwpLnVwZGF0ZUF0dHJzKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2Zvcm1hdCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmZvcm1hdCh2YWwpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdyZXNldCcsICh2YWwpIC0+XG4gICAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHV0aWxzLnBhcnNlVHJ1ZUZhbHNlKHZhbCkpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lLCBzY29wZSkgLT5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3RpY2tGb3JtYXQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS50aWNrRm9ybWF0KGQzLmZvcm1hdCh2YWwpKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndGlja3MnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS50aWNrcygrdmFsKVxuICAgICAgICAgIGlmIG1lLmF4aXMoKVxuICAgICAgICAgICAgbWUudXBkYXRlQXR0cnMoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZ3JpZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnNob3dHcmlkKHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnKS51cGRhdGVBdHRycygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdzaG93TGFiZWwnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5zaG93TGFiZWwodmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScpLnVwZGF0ZSh0cnVlKVxuXG5cbiAgICAgIHNjb3BlLiR3YXRjaCBhdHRycy5heGlzRm9ybWF0dGVycywgICh2YWwpIC0+XG4gICAgICAgIGlmIF8uaXNPYmplY3QodmFsKVxuICAgICAgICAgIGlmIF8uaGFzKHZhbCwgJ3RpY2tGb3JtYXQnKSBhbmQgXy5pc0Z1bmN0aW9uKHZhbC50aWNrRm9ybWF0KVxuICAgICAgICAgICAgbWUudGlja0Zvcm1hdCh2YWwudGlja0Zvcm1hdClcbiAgICAgICAgICBlbHNlIGlmIF8uaXNTdHJpbmcodmFsLnRpY2tGb3JtYXQpXG4gICAgICAgICAgICBtZS50aWNrRm9ybWF0KGQzLmZvcm1hdCh2YWwpKVxuICAgICAgICAgIGlmIF8uaGFzKHZhbCwndGlja1ZhbHVlcycpIGFuZCBfLmlzQXJyYXkodmFsLnRpY2tWYWx1ZXMpXG4gICAgICAgICAgICBtZS50aWNrVmFsdWVzKHZhbC50aWNrVmFsdWVzKVxuICAgICAgICAgIG1lLnVwZGF0ZSgpXG5cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBvYnNlcnZlTGVnZW5kQXR0cmlidXRlczogKGF0dHJzLCBtZSwgbGF5b3V0KSAtPlxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGVnZW5kJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbCA9IG1lLmxlZ2VuZCgpXG4gICAgICAgICAgbC5zaG93VmFsdWVzKGZhbHNlKVxuICAgICAgICAgIHN3aXRjaCB2YWxcbiAgICAgICAgICAgIHdoZW4gJ2ZhbHNlJ1xuICAgICAgICAgICAgICBsLnNob3coZmFsc2UpXG4gICAgICAgICAgICB3aGVuICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0J1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKHZhbCkuZGl2KHVuZGVmaW5lZCkuc2hvdyh0cnVlKVxuICAgICAgICAgICAgd2hlbiAndHJ1ZScsICcnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24oJ3RvcC1yaWdodCcpLnNob3codHJ1ZSkuZGl2KHVuZGVmaW5lZClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbGVnZW5kRGl2ID0gZDMuc2VsZWN0KHZhbClcbiAgICAgICAgICAgICAgaWYgbGVnZW5kRGl2LmVtcHR5KClcbiAgICAgICAgICAgICAgICAkbG9nLndhcm4gJ2xlZ2VuZCByZWZlcmVuY2UgZG9lcyBub3QgZXhpc3Q6JywgdmFsXG4gICAgICAgICAgICAgICAgbC5kaXYodW5kZWZpbmVkKS5zaG93KGZhbHNlKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbC5kaXYobGVnZW5kRGl2KS5wb3NpdGlvbigndG9wLWxlZnQnKS5zaG93KHRydWUpXG5cbiAgICAgICAgICBsLnNjYWxlKG1lKS5sYXlvdXQobGF5b3V0KVxuICAgICAgICAgIGlmIG1lLnBhcmVudCgpXG4gICAgICAgICAgICBsLnJlZ2lzdGVyKG1lLnBhcmVudCgpKVxuICAgICAgICAgIGwucmVkcmF3KClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3ZhbHVlc0xlZ2VuZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGwgPSBtZS5sZWdlbmQoKVxuICAgICAgICAgIGwuc2hvd1ZhbHVlcyh0cnVlKVxuICAgICAgICAgIHN3aXRjaCB2YWxcbiAgICAgICAgICAgIHdoZW4gJ2ZhbHNlJ1xuICAgICAgICAgICAgICBsLnNob3coZmFsc2UpXG4gICAgICAgICAgICB3aGVuICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0J1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKHZhbCkuZGl2KHVuZGVmaW5lZCkuc2hvdyh0cnVlKVxuICAgICAgICAgICAgd2hlbiAndHJ1ZScsICcnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24oJ3RvcC1yaWdodCcpLnNob3codHJ1ZSkuZGl2KHVuZGVmaW5lZClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbGVnZW5kRGl2ID0gZDMuc2VsZWN0KHZhbClcbiAgICAgICAgICAgICAgaWYgbGVnZW5kRGl2LmVtcHR5KClcbiAgICAgICAgICAgICAgICAkbG9nLndhcm4gJ2xlZ2VuZCByZWZlcmVuY2UgZG9lcyBub3QgZXhpc3Q6JywgdmFsXG4gICAgICAgICAgICAgICAgbC5kaXYodW5kZWZpbmVkKS5zaG93KGZhbHNlKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbC5kaXYobGVnZW5kRGl2KS5wb3NpdGlvbigndG9wLWxlZnQnKS5zaG93KHRydWUpXG5cbiAgICAgICAgICBsLnNjYWxlKG1lKS5sYXlvdXQobGF5b3V0KVxuICAgICAgICAgIGlmIG1lLnBhcmVudCgpXG4gICAgICAgICAgICBsLnJlZ2lzdGVyKG1lLnBhcmVudCgpKVxuICAgICAgICAgIGwucmVkcmF3KClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xlZ2VuZFRpdGxlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUubGVnZW5kKCkudGl0bGUodmFsKS5yZWRyYXcoKVxuXG4gICAgIy0tLSBPYnNlcnZlIFJhbmdlIGF0dHJpYnV0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG9ic2VydmVyUmFuZ2VBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lKSAtPlxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xvd2VyUHJvcGVydHknLCAodmFsKSAtPlxuICAgICAgICBudWxsXG4gICAgICAgIG1lLmxvd2VyUHJvcGVydHkocGFyc2VMaXN0KHZhbCkpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd1cHBlclByb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgbnVsbFxuICAgICAgICBtZS51cHBlclByb3BlcnR5KHBhcnNlTGlzdCh2YWwpKS51cGRhdGUoKVxuXG4gIH1cblxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzaGFwZScsICgkbG9nLCBzY2FsZSwgZDNTaGFwZXMsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3NoYXBlJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlU2l6ZSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnc2hhcGUnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgbWUuc2NhbGUoKS5yYW5nZShkM1NoYXBlcylcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NpemUnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3NpemUnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVTaXplJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdzaXplJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3gnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3gnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVgnXG4gICAgICB0aGlzLm1lID0gc2NhbGUoKSAjIGZvciBBbmd1bGFyIDEuM1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICd4J1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIG1lLmlzSG9yaXpvbnRhbCh0cnVlKVxuICAgICAgbWUucmVnaXN0ZXIoKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ3RvcCcsICdib3R0b20nXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnYm90dG9tJykuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5zaG93QXhpcyhmYWxzZSkuYXhpc09yaWVudCh1bmRlZmluZWQpXG4gICAgICAgICAgbWUudXBkYXRlKHRydWUpXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgc2NvcGUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncm90YXRlVGlja0xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgXy5pc051bWJlcigrdmFsKVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHMoK3ZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHModW5kZWZpbmVkKVxuICAgICAgICBtZS51cGRhdGUodHJ1ZSlcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncmFuZ2VYJywgKCRsb2csIHNjYWxlLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydyYW5nZVgnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVgnXG4gICAgICB0aGlzLm1lID0gc2NhbGUoKSAjIGZvciBBbmd1bGFyIDEuM1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdyYW5nZVgnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2xpbmVhcicpXG4gICAgICBtZS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgbWUuaXNIb3Jpem9udGFsKHRydWUpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdheGlzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgICAgaWYgdmFsIGluIFsndG9wJywgJ2JvdHRvbSddXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQodmFsKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KCdib3R0b20nKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLnNob3dBeGlzKGZhbHNlKS5heGlzT3JpZW50KHVuZGVmaW5lZClcbiAgICAgICAgICBtZS51cGRhdGUodHJ1ZSlcblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlQXhpc0F0dHJpYnV0ZXMoYXR0cnMsIG1lLCBzY29wZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVyUmFuZ2VBdHRyaWJ1dGVzKGF0dHJzLG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncm90YXRlVGlja0xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgXy5pc051bWJlcigrdmFsKVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHMoK3ZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHModW5kZWZpbmVkKVxuICAgICAgICBtZS51cGRhdGUodHJ1ZSlcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAneScsICgkbG9nLCBzY2FsZSwgbGVnZW5kLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWyd5JywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAneSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLmlzVmVydGljYWwodHJ1ZSlcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnbGVmdCcpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUsIHNjb3BlKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncmFuZ2VZJywgKCRsb2csIHNjYWxlLCBsZWdlbmQsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3JhbmdlWScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVknXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3JhbmdlWSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLmlzVmVydGljYWwodHJ1ZSlcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnbGVmdCcpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUsIHNjb3BlKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZXJSYW5nZUF0dHJpYnV0ZXMoYXR0cnMsbWUpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICdzZWxlY3Rpb25TaGFyaW5nJywgKCRsb2cpIC0+XG4gIHNlbGVjdGlvbiA9IHt9XG4gIGNhbGxiYWNrcyA9IHt9XG5cbiAgdGhpcy5jcmVhdGVHcm91cCA9IChncm91cCkgLT5cblxuXG4gIHRoaXMuc2V0U2VsZWN0aW9uID0gKHNlbGVjdGlvbiwgZ3JvdXApIC0+XG4gICAgaWYgZ3JvdXBcbiAgICAgIHNlbGVjdGlvbltncm91cF0gPSBzZWxlY3Rpb25cbiAgICAgIGlmIGNhbGxiYWNrc1tncm91cF1cbiAgICAgICAgZm9yIGNiIGluIGNhbGxiYWNrc1tncm91cF1cbiAgICAgICAgICBjYihzZWxlY3Rpb24pXG5cbiAgdGhpcy5nZXRTZWxlY3Rpb24gPSAoZ3JvdXApIC0+XG4gICAgZ3JwID0gZ3JvdXAgb3IgJ2RlZmF1bHQnXG4gICAgcmV0dXJuIHNlbGVjdGlvbltncnBdXG5cbiAgdGhpcy5yZWdpc3RlciA9IChncm91cCwgY2FsbGJhY2spIC0+XG4gICAgaWYgZ3JvdXBcbiAgICAgIGlmIG5vdCBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgIGNhbGxiYWNrc1tncm91cF0gPSBbXVxuICAgICAgI2Vuc3VyZSB0aGF0IGNhbGxiYWNrcyBhcmUgbm90IHJlZ2lzdGVyZWQgbW9yZSB0aGFuIG9uY2VcbiAgICAgIGlmIG5vdCBfLmNvbnRhaW5zKGNhbGxiYWNrc1tncm91cF0sIGNhbGxiYWNrKVxuICAgICAgICBjYWxsYmFja3NbZ3JvdXBdLnB1c2goY2FsbGJhY2spXG5cbiAgdGhpcy51bnJlZ2lzdGVyID0gKGdyb3VwLCBjYWxsYmFjaykgLT5cbiAgICBpZiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICBpZHggPSBjYWxsYmFja3NbZ3JvdXBdLmluZGV4T2YgY2FsbGJhY2tcbiAgICAgIGlmIGlkeCA+PSAwXG4gICAgICAgIGNhbGxiYWNrc1tncm91cF0uc3BsaWNlKGlkeCwgMSlcblxuICByZXR1cm4gdGhpc1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICd0aW1pbmcnLCAoJGxvZykgLT5cblxuICB0aW1lcnMgPSB7fVxuICBlbGFwc2VkU3RhcnQgPSAwXG4gIGVsYXBzZWQgPSAwXG5cbiAgdGhpcy5pbml0ID0gKCkgLT5cbiAgICBlbGFwc2VkU3RhcnQgPSBEYXRlLm5vdygpXG5cbiAgdGhpcy5zdGFydCA9ICh0b3BpYykgLT5cbiAgICB0b3AgPSB0aW1lcnNbdG9waWNdXG4gICAgaWYgbm90IHRvcFxuICAgICAgdG9wID0gdGltZXJzW3RvcGljXSA9IHtuYW1lOnRvcGljLCBzdGFydDowLCB0b3RhbDowLCBjYWxsQ250OjAsIGFjdGl2ZTogZmFsc2V9XG4gICAgdG9wLnN0YXJ0ID0gRGF0ZS5ub3coKVxuICAgIHRvcC5hY3RpdmUgPSB0cnVlXG5cbiAgdGhpcy5zdG9wID0gKHRvcGljKSAtPlxuICAgIGlmIHRvcCA9IHRpbWVyc1t0b3BpY11cbiAgICAgIHRvcC5hY3RpdmUgPSBmYWxzZVxuICAgICAgdG9wLnRvdGFsICs9IERhdGUubm93KCkgLSB0b3Auc3RhcnRcbiAgICAgIHRvcC5jYWxsQ250ICs9IDFcbiAgICBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIGVsYXBzZWRTdGFydFxuXG4gIHRoaXMucmVwb3J0ID0gKCkgLT5cbiAgICBmb3IgdG9waWMsIHZhbCBvZiB0aW1lcnNcbiAgICAgIHZhbC5hdmcgPSB2YWwudG90YWwgLyB2YWwuY2FsbENudFxuICAgICRsb2cuaW5mbyB0aW1lcnNcbiAgICAkbG9nLmluZm8gJ0VsYXBzZWQgVGltZSAobXMpJywgZWxhcHNlZFxuICAgIHJldHVybiB0aW1lcnNcblxuICB0aGlzLmNsZWFyID0gKCkgLT5cbiAgICB0aW1lcnMgPSB7fVxuXG4gIHJldHVybiB0aGlzIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnbGF5ZXJlZERhdGEnLCAoJGxvZykgLT5cblxuICBsYXllcmVkID0gKCkgLT5cbiAgICBfZGF0YSA9IFtdXG4gICAgX2xheWVyS2V5cyA9IFtdXG4gICAgX3ggPSB1bmRlZmluZWRcbiAgICBfY2FsY1RvdGFsID0gZmFsc2VcbiAgICBfbWluID0gSW5maW5pdHlcbiAgICBfbWF4ID0gLUluZmluaXR5XG4gICAgX3RNaW4gPSBJbmZpbml0eVxuICAgIF90TWF4ID0gLUluZmluaXR5XG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBtZS5kYXRhID0gKGRhdCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggSXMgMFxuICAgICAgICByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSBkYXRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllcktleXMgPSAoa2V5cykgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX2xheWVyS2V5c1xuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJLZXlzID0ga2V5c1xuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnggPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX3hcbiAgICAgIGVsc2VcbiAgICAgICAgX3ggPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuY2FsY1RvdGFsID0gKHRfZikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX2NhbGNUb3RhbFxuICAgICAgZWxzZVxuICAgICAgICBfY2FsY1RvdGFsID0gdF9mXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubWluID0gKCkgLT5cbiAgICAgIF9taW5cblxuICAgIG1lLm1heCA9ICgpIC0+XG4gICAgICBfbWF4XG5cbiAgICBtZS5taW5Ub3RhbCA9ICgpIC0+XG4gICAgICBfdE1pblxuXG4gICAgbWUubWF4VG90YWwgPSAoKSAtPlxuICAgICAgX3RNYXhcblxuICAgIG1lLmV4dGVudCA9ICgpIC0+XG4gICAgICBbbWUubWluKCksIG1lLm1heCgpXVxuXG4gICAgbWUudG90YWxFeHRlbnQgPSAoKSAtPlxuICAgICAgW21lLm1pblRvdGFsKCksIG1lLm1heFRvdGFsKCldXG5cbiAgICBtZS5jb2x1bW5zID0gKGRhdGEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcbiAgICAgICAgI19sYXllcktleXMubWFwKChrKSAtPiB7a2V5OmssIHZhbHVlczpkYXRhLm1hcCgoZCkgLT4ge3g6IGRbX3hdLCB2YWx1ZTogZFtrXSwgZGF0YTogZH0gKX0pXG4gICAgICAgIHJlcyA9IFtdXG4gICAgICAgIF9taW4gPSBJbmZpbml0eVxuICAgICAgICBfbWF4ID0gLUluZmluaXR5XG4gICAgICAgIF90TWluID0gSW5maW5pdHlcbiAgICAgICAgX3RNYXggPSAtSW5maW5pdHlcblxuICAgICAgICBmb3IgaywgaSBpbiBfbGF5ZXJLZXlzXG4gICAgICAgICAgcmVzW2ldID0ge2tleTprLCB2YWx1ZTpbXSwgbWluOkluZmluaXR5LCBtYXg6LUluZmluaXR5fVxuICAgICAgICBmb3IgZCwgaSBpbiBkYXRhXG4gICAgICAgICAgdCA9IDBcbiAgICAgICAgICB4diA9IGlmIHR5cGVvZiBfeCBpcyAnc3RyaW5nJyB0aGVuIGRbX3hdIGVsc2UgX3goZClcblxuICAgICAgICAgIGZvciBsIGluIHJlc1xuICAgICAgICAgICAgdiA9ICtkW2wua2V5XVxuICAgICAgICAgICAgbC52YWx1ZS5wdXNoIHt4Onh2LCB2YWx1ZTogdiwga2V5Omwua2V5fVxuICAgICAgICAgICAgaWYgbC5tYXggPCB2IHRoZW4gbC5tYXggPSB2XG4gICAgICAgICAgICBpZiBsLm1pbiA+IHYgdGhlbiBsLm1pbiA9IHZcbiAgICAgICAgICAgIGlmIF9tYXggPCB2IHRoZW4gX21heCA9IHZcbiAgICAgICAgICAgIGlmIF9taW4gPiB2IHRoZW4gX21pbiA9IHZcbiAgICAgICAgICAgIGlmIF9jYWxjVG90YWwgdGhlbiB0ICs9ICt2XG4gICAgICAgICAgaWYgX2NhbGNUb3RhbFxuICAgICAgICAgICAgI3RvdGFsLnZhbHVlLnB1c2gge3g6ZFtfeF0sIHZhbHVlOnQsIGtleTp0b3RhbC5rZXl9XG4gICAgICAgICAgICBpZiBfdE1heCA8IHQgdGhlbiBfdE1heCA9IHRcbiAgICAgICAgICAgIGlmIF90TWluID4gdCB0aGVuIF90TWluID0gdFxuICAgICAgICByZXR1cm4ge21pbjpfbWluLCBtYXg6X21heCwgdG90YWxNaW46X3RNaW4sdG90YWxNYXg6X3RNYXgsIGRhdGE6cmVzfVxuICAgICAgcmV0dXJuIG1lXG5cblxuXG4gICAgbWUucm93cyA9IChkYXRhKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxXG4gICAgICAgIHJldHVybiBkYXRhLm1hcCgoZCkgLT4ge3g6IGRbX3hdLCBsYXllcnM6IGxheWVyS2V5cy5tYXAoKGspIC0+IHtrZXk6aywgdmFsdWU6IGRba10sIHg6ZFtfeF19KX0pXG4gICAgICByZXR1cm4gbWVcblxuXG4gICAgcmV0dXJuIG1lIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzdmdJY29uJywgKCRsb2cpIC0+XG4gICMjIGluc2VydCBzdmcgcGF0aCBpbnRvIGludGVycG9sYXRlZCBIVE1MLiBSZXF1aXJlZCBwcmV2ZW50IEFuZ3VsYXIgZnJvbSB0aHJvd2luZyBlcnJvciAoRml4IDIyKVxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICB0ZW1wbGF0ZTogJzxzdmcgbmctc3R5bGU9XCJzdHlsZVwiPjxwYXRoPjwvcGF0aD48L3N2Zz4nXG4gICAgc2NvcGU6XG4gICAgICBwYXRoOiBcIj1cIlxuICAgICAgd2lkdGg6IFwiQFwiXG4gICAgbGluazogKHNjb3BlLCBlbGVtLCBhdHRycyApIC0+XG4gICAgICBzY29wZS5zdHlsZSA9IHsgICMgZml4IElFIHByb2JsZW0gd2l0aCBpbnRlcnBvbGF0aW5nIHN0eWxlIHZhbHVlc1xuICAgICAgICBoZWlnaHQ6ICcyMHB4J1xuICAgICAgICB3aWR0aDogc2NvcGUud2lkdGggKyAncHgnXG4gICAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICdtaWRkbGUnXG4gICAgICB9XG4gICAgICBzY29wZS4kd2F0Y2ggJ3BhdGgnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBkMy5zZWxlY3QoZWxlbVswXSkuc2VsZWN0KCdwYXRoJykuYXR0cignZCcsIHZhbCkuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoOCw4KVwiKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAndXRpbHMnLCAoJGxvZykgLT5cblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgQGRpZmYgPSAoYSxiLGRpcmVjdGlvbikgLT5cbiAgICBub3RJbkIgPSAodikgLT5cbiAgICAgIGIuaW5kZXhPZih2KSA8IDBcblxuICAgIHJlcyA9IHt9XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgYS5sZW5ndGhcbiAgICAgIGlmIG5vdEluQihhW2ldKVxuICAgICAgICByZXNbYVtpXV0gPSB1bmRlZmluZWRcbiAgICAgICAgaiA9IGkgKyBkaXJlY3Rpb25cbiAgICAgICAgd2hpbGUgMCA8PSBqIDwgYS5sZW5ndGhcbiAgICAgICAgICBpZiBub3RJbkIoYVtqXSlcbiAgICAgICAgICAgIGogKz0gZGlyZWN0aW9uXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzW2FbaV1dID0gIGFbal1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICBpKytcbiAgICByZXR1cm4gcmVzXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGlkID0gMFxuICBAZ2V0SWQgPSAoKSAtPlxuICAgIHJldHVybiAnQ2hhcnQnICsgaWQrK1xuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAcGFyc2VMaXN0ID0gKHZhbCkgLT5cbiAgICBpZiB2YWxcbiAgICAgIGwgPSB2YWwudHJpbSgpLnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJykuc3BsaXQoJywnKS5tYXAoKGQpIC0+IGQucmVwbGFjZSgvXltcXFwifCddfFtcXFwifCddJC9nLCAnJykpXG4gICAgICByZXR1cm4gaWYgbC5sZW5ndGggaXMgMSB0aGVuIHJldHVybiBsWzBdIGVsc2UgbFxuICAgIHJldHVybiB1bmRlZmluZWRcblxuICBAcGFyc2VUcnVlRmFsc2UgPSAodmFsKSAtPlxuICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnIHRoZW4gdHJ1ZSBlbHNlIChpZiB2YWwgaXMgJ2ZhbHNlJyB0aGVuIGZhbHNlIGVsc2UgdW5kZWZpbmVkKVxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAbWVyZ2VEYXRhID0gKCkgLT5cblxuICAgIF9wcmV2RGF0YSA9IFtdXG4gICAgX2RhdGEgPSBbXVxuICAgIF9wcmV2SGFzaCA9IHt9XG4gICAgX2hhc2ggPSB7fVxuICAgIF9wcmV2Q29tbW9uID0gW11cbiAgICBfY29tbW9uID0gW11cbiAgICBfZmlyc3QgPSB1bmRlZmluZWRcbiAgICBfbGFzdCA9IHVuZGVmaW5lZFxuXG4gICAgX2tleSA9IChkKSAtPiBkICMgaWRlbnRpdHlcbiAgICBfbGF5ZXJLZXkgPSAoZCkgLT4gZFxuXG5cbiAgICBtZSA9IChkYXRhKSAtPlxuICAgICAgIyBzYXZlIF9kYXRhIHRvIF9wcmV2aW91c0RhdGEgYW5kIHVwZGF0ZSBfcHJldmlvdXNIYXNoO1xuICAgICAgX3ByZXZEYXRhID0gW11cbiAgICAgIF9wcmV2SGFzaCA9IHt9XG4gICAgICBmb3IgZCxpICBpbiBfZGF0YVxuICAgICAgICBfcHJldkRhdGFbaV0gPSBkO1xuICAgICAgICBfcHJldkhhc2hbX2tleShkKV0gPSBpXG5cbiAgICAgICNpdGVyYXRlIG92ZXIgZGF0YSBhbmQgZGV0ZXJtaW5lIHRoZSBjb21tb24gZWxlbWVudHNcbiAgICAgIF9wcmV2Q29tbW9uID0gW107XG4gICAgICBfY29tbW9uID0gW107XG4gICAgICBfaGFzaCA9IHt9O1xuICAgICAgX2RhdGEgPSBkYXRhO1xuXG4gICAgICBmb3IgZCxqIGluIF9kYXRhXG4gICAgICAgIGtleSA9IF9rZXkoZClcbiAgICAgICAgX2hhc2hba2V5XSA9IGpcbiAgICAgICAgaWYgX3ByZXZIYXNoLmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgICAjZWxlbWVudCBpcyBpbiBib3RoIGFycmF5c1xuICAgICAgICAgIF9wcmV2Q29tbW9uW19wcmV2SGFzaFtrZXldXSA9IHRydWVcbiAgICAgICAgICBfY29tbW9uW2pdID0gdHJ1ZVxuICAgICAgcmV0dXJuIG1lO1xuXG4gICAgbWUua2V5ID0gKGZuKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBfa2V5XG4gICAgICBfa2V5ID0gZm47XG4gICAgICByZXR1cm4gbWU7XG5cbiAgICBtZS5maXJzdCA9IChmaXJzdCkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2ZpcnN0XG4gICAgICBfZmlyc3QgPSBmaXJzdFxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXN0ID0gKGxhc3QpIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9sYXN0XG4gICAgICBfbGFzdCA9IGxhc3RcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkZWQgPSAoKSAtPlxuICAgICAgcmV0ID0gW107XG4gICAgICBmb3IgZCwgaSBpbiBfZGF0YVxuICAgICAgICBpZiAhX2NvbW1vbltpXSB0aGVuIHJldC5wdXNoKF9kKVxuICAgICAgcmV0dXJuIHJldFxuXG4gICAgbWUuZGVsZXRlZCA9ICgpIC0+XG4gICAgICByZXQgPSBbXTtcbiAgICAgIGZvciBwLCBpIGluIF9wcmV2RGF0YVxuICAgICAgICBpZiAhX3ByZXZDb21tb25baV0gdGhlbiByZXQucHVzaChfcHJldkRhdGFbaV0pXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5jdXJyZW50ID0gKGtleSkgLT5cbiAgICAgIHJldHVybiBfZGF0YVtfaGFzaFtrZXldXVxuXG4gICAgbWUucHJldiA9IChrZXkpIC0+XG4gICAgICByZXR1cm4gX3ByZXZEYXRhW19wcmV2SGFzaFtrZXldXVxuXG4gICAgbWUuYWRkZWRQcmVkID0gKGFkZGVkKSAtPlxuICAgICAgcHJlZElkeCA9IF9oYXNoW19rZXkoYWRkZWQpXVxuICAgICAgd2hpbGUgIV9jb21tb25bcHJlZElkeF1cbiAgICAgICAgaWYgcHJlZElkeC0tIDwgMCB0aGVuIHJldHVybiBfZmlyc3RcbiAgICAgIHJldHVybiBfcHJldkRhdGFbX3ByZXZIYXNoW19rZXkoX2RhdGFbcHJlZElkeF0pXV1cblxuICAgIG1lLmFkZGVkUHJlZC5sZWZ0ID0gKGFkZGVkKSAtPlxuICAgICAgbWUuYWRkZWRQcmVkKGFkZGVkKS54XG5cbiAgICBtZS5hZGRlZFByZWQucmlnaHQgPSAoYWRkZWQpIC0+XG4gICAgICBvYmogPSBtZS5hZGRlZFByZWQoYWRkZWQpXG4gICAgICBpZiBfLmhhcyhvYmosICd3aWR0aCcpIHRoZW4gb2JqLnggKyBvYmoud2lkdGggZWxzZSBvYmoueFxuXG4gICAgbWUuZGVsZXRlZFN1Y2MgPSAoZGVsZXRlZCkgLT5cbiAgICAgIHN1Y2NJZHggPSBfcHJldkhhc2hbX2tleShkZWxldGVkKV1cbiAgICAgIHdoaWxlICFfcHJldkNvbW1vbltzdWNjSWR4XVxuICAgICAgICBpZiBzdWNjSWR4KysgPj0gX3ByZXZEYXRhLmxlbmd0aCB0aGVuIHJldHVybiBfbGFzdFxuICAgICAgcmV0dXJuIF9kYXRhW19oYXNoW19rZXkoX3ByZXZEYXRhW3N1Y2NJZHhdKV1dXG5cbiAgICByZXR1cm4gbWU7XG5cbiAgQG1lcmdlU2VyaWVzID0gIChhT2xkLCBhTmV3KSAgLT5cbiAgICBpT2xkID0gMFxuICAgIGlOZXcgPSAwXG4gICAgbE9sZE1heCA9IGFPbGQubGVuZ3RoIC0gMVxuICAgIGxOZXdNYXggPSBhTmV3Lmxlbmd0aCAtIDFcbiAgICBsTWF4ID0gTWF0aC5tYXgobE9sZE1heCwgbE5ld01heClcbiAgICByZXN1bHQgPSBbXVxuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4IGFuZCBpTmV3IDw9IGxOZXdNYXhcbiAgICAgIGlmICthT2xkW2lPbGRdIGlzICthTmV3W2lOZXddXG4gICAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFPbGRbaU9sZF1dKTtcbiAgICAgICAgI2NvbnNvbGUubG9nKCdzYW1lJywgYU9sZFtpT2xkXSk7XG4gICAgICAgIGlPbGQrKztcbiAgICAgICAgaU5ldysrO1xuICAgICAgZWxzZSBpZiArYU9sZFtpT2xkXSA8ICthTmV3W2lOZXddXG4gICAgICAgICMgYU9sZFtpT2xkIGlzIGRlbGV0ZWRcbiAgICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSlcbiAgICAgICAgIyBjb25zb2xlLmxvZygnZGVsZXRlZCcsIGFPbGRbaU9sZF0pO1xuICAgICAgICBpT2xkKytcbiAgICAgIGVsc2VcbiAgICAgICAgIyBhTmV3W2lOZXddIGlzIGFkZGVkXG4gICAgICAgIHJlc3VsdC5wdXNoKFt1bmRlZmluZWQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU5ld1tpTmV3XV0pXG4gICAgICAgICMgY29uc29sZS5sb2coJ2FkZGVkJywgYU5ld1tpTmV3XSk7XG4gICAgICAgIGlOZXcrK1xuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4XG4gICAgICAjIGlmIHRoZXJlIGlzIG1vcmUgb2xkIGl0ZW1zLCBtYXJrIHRoZW0gYXMgZGVsZXRlZFxuICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdkZWxldGVkJywgYU9sZFtpT2xkXSk7XG4gICAgICBpT2xkKys7XG5cbiAgICB3aGlsZSBpTmV3IDw9IGxOZXdNYXhcbiAgICAgICMgaWYgdGhlcmUgaXMgbW9yZSBuZXcgaXRlbXMsIG1hcmsgdGhlbSBhcyBhZGRlZFxuICAgICAgcmVzdWx0LnB1c2goW3VuZGVmaW5lZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhTmV3W2lOZXddXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdhZGRlZCcsIGFOZXdbaU5ld10pO1xuICAgICAgaU5ldysrO1xuXG4gICAgcmV0dXJuIHJlc3VsdFxuXG4gIHJldHVybiBAXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=