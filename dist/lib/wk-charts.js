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
  date: '%d.%m.%Y',
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
      var area, brush, draw, host, layerKeys, offset, ttEnter, ttMoveData, ttMoveMarker, _circles, _dataOld, _id, _layout, _pathArray, _pathValuesNew, _pathValuesOld, _scaleList, _showMarkers, _tooltip, _ttHighlight;
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
        var areaBrush, areaNew, areaOld, i, key, layer, layers, mergedX, newLast, oldLast, v, val, _i, _j, _layerKeys, _len, _len1;
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
      var addedPred, area, deletedSucc, draw, getLayerByKey, host, layerData, layerKeys, layerKeysOld, layers, layout, layoutNew, layoutOld, offs, offset, scaleY, stack, ttMoveData, ttMoveMarker, _circles, _id, _scaleList, _showMarkers, _tooltip, _ttHighlight;
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

angular.module('wk.chart').factory('scale', function($log, legend, formatDefaults, wkChartScales) {
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
          _inputFormatFn = d3.time.format(format);
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
        _outputFormatFn = me.scaleType() === 'time' ? d3.time.format(_outputFormatString) : d3.format(_outputFormatString);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3drLWNoYXJ0cy9hcHAvY29uZmlnL3drQ2hhcnRDb25zdGFudHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL1Jlc2l6ZVNlbnNvci5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoLmNvZmZlZSIsInRlbXBsYXRlcy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9kMy5nZW8uem9vbS5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL3NhdmVTdmdBc1BuZy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2NoYXJ0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2xheW91dC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2NvbnRhaW5lci9wcmludC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2NvbnRhaW5lci9zZWxlY3Rpb24uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9leHRlbmRlZFNjYWxlcy9zY2FsZUV4dGVudGlvbi5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2ZpbHRlcnMvdHRGb3JtYXQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWEuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWFTdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhU3RhY2tlZFZlcnRpY2FsLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhVmVydGljYWwuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2Jhci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYmFyQ2x1c3RlcmVkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9iYXJTdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9idWJibGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2NvbHVtbi5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvY29sdW1uQ2x1c3RlcmVkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9jb2x1bW5TdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9nYXVnZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvZ2VvTWFwLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9oaXN0b2dyYW0uY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2xpbmUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2xpbmVWZXJ0aWNhbC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvcGllLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9zY2F0dGVyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9zcGlkZXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JCcnVzaC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9iZWhhdmlvclNlbGVjdC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9iZWhhdmlvclRvb2x0aXAuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JzLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2NoYXJ0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2NvbnRhaW5lci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9sYXlvdXQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvbGVnZW5kLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL3NjYWxlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL3NjYWxlTGlzdC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy9jb2xvci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy9zY2FsZVV0aWxzLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3NoYXBlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3NpemUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMveC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy94UmFuZ2UuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMveS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy95UmFuZ2UuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zZXJ2aWNlcy9zZWxlY3Rpb25TaGFyaW5nLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2VydmljZXMvdGltZXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL2xheWVyRGF0YS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3V0aWwvc3ZnSWNvbi5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3V0aWwvdXRpbGl0aWVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLFVBQWYsRUFBMkIsRUFBM0IsQ0FBQSxDQUFBOztBQUFBLE9BRU8sQ0FBQyxNQUFSLENBQWUsVUFBZixDQUEwQixDQUFDLFFBQTNCLENBQW9DLGlCQUFwQyxFQUF1RCxDQUNyRCxTQURxRCxFQUVyRCxZQUZxRCxFQUdyRCxZQUhxRCxFQUlyRCxhQUpxRCxFQUtyRCxhQUxxRCxDQUF2RCxDQUZBLENBQUE7O0FBQUEsT0FVTyxDQUFDLE1BQVIsQ0FBZSxVQUFmLENBQTBCLENBQUMsUUFBM0IsQ0FBb0MsZ0JBQXBDLEVBQXNEO0FBQUEsRUFDcEQsR0FBQSxFQUFLLEVBRCtDO0FBQUEsRUFFcEQsSUFBQSxFQUFNLEVBRjhDO0FBQUEsRUFHcEQs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QTlCQTtBQW9DQSxXQUFPLE1BQVAsQ0FyQ2M7RUFBQSxDQWxJaEIsQ0FBQTtBQXlLQSxTQUFPLElBQVAsQ0E3SzBDO0FBQUEsQ0FBNUMsQ0FBQSxDQUFBIiwiZmlsZSI6IndrLWNoYXJ0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcsIFtdKVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNPcmRpbmFsU2NhbGVzJywgW1xuICAnb3JkaW5hbCdcbiAgJ2NhdGVnb3J5MTAnXG4gICdjYXRlZ29yeTIwJ1xuICAnY2F0ZWdvcnkyMGInXG4gICdjYXRlZ29yeTIwYydcbl1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2QzQ2hhcnRNYXJnaW5zJywge1xuICB0b3A6IDEwXG4gIGxlZnQ6IDUwXG4gIGJvdHRvbTogNDBcbiAgcmlnaHQ6IDIwXG4gIHRvcEJvdHRvbU1hcmdpbjp7YXhpczoyNSwgbGFiZWw6MTh9XG4gIGxlZnRSaWdodE1hcmdpbjp7YXhpczo0MCwgbGFiZWw6MjB9XG4gIG1pbk1hcmdpbjo4XG4gIGRlZmF1bHQ6XG4gICAgdG9wOiA4XG4gICAgbGVmdDo4XG4gICAgYm90dG9tOjhcbiAgICByaWdodDoxMFxuICBheGlzOlxuICAgIHRvcDoyNVxuICAgIGJvdHRvbToyNVxuICAgIGxlZnQ6NDBcbiAgICByaWdodDo0MFxuICBsYWJlbDpcbiAgICB0b3A6MThcbiAgICBib3R0b206MThcbiAgICBsZWZ0OjIwXG4gICAgcmlnaHQ6MjBcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2QzU2hhcGVzJywgW1xuICAnY2lyY2xlJyxcbiAgJ2Nyb3NzJyxcbiAgJ3RyaWFuZ2xlLWRvd24nLFxuICAndHJpYW5nbGUtdXAnLFxuICAnc3F1YXJlJyxcbiAgJ2RpYW1vbmQnXG5dXG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdheGlzQ29uZmlnJywge1xuICBsYWJlbEZvbnRTaXplOiAnMS42ZW0nXG4gIHg6XG4gICAgYXhpc1Bvc2l0aW9uczogWyd0b3AnLCAnYm90dG9tJ11cbiAgICBheGlzT2Zmc2V0OiB7Ym90dG9tOidoZWlnaHQnfVxuICAgIGF4aXNQb3NpdGlvbkRlZmF1bHQ6ICdib3R0b20nXG4gICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBtZWFzdXJlOiAnd2lkdGgnXG4gICAgbGFiZWxQb3NpdGlvbnM6WydvdXRzaWRlJywgJ2luc2lkZSddXG4gICAgbGFiZWxQb3NpdGlvbkRlZmF1bHQ6ICdvdXRzaWRlJ1xuICAgIGxhYmVsT2Zmc2V0OlxuICAgICAgdG9wOiAnMWVtJ1xuICAgICAgYm90dG9tOiAnLTAuOGVtJ1xuICB5OlxuICAgIGF4aXNQb3NpdGlvbnM6IFsnbGVmdCcsICdyaWdodCddXG4gICAgYXhpc09mZnNldDoge3JpZ2h0Oid3aWR0aCd9XG4gICAgYXhpc1Bvc2l0aW9uRGVmYXVsdDogJ2xlZnQnXG4gICAgZGlyZWN0aW9uOiAndmVydGljYWwnXG4gICAgbWVhc3VyZTogJ2hlaWdodCdcbiAgICBsYWJlbFBvc2l0aW9uczpbJ291dHNpZGUnLCAnaW5zaWRlJ11cbiAgICBsYWJlbFBvc2l0aW9uRGVmYXVsdDogJ291dHNpZGUnXG4gICAgbGFiZWxPZmZzZXQ6XG4gICAgICBsZWZ0OiAnMS4yZW0nXG4gICAgICByaWdodDogJzEuMmVtJ1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNBbmltYXRpb24nLCB7XG4gIGR1cmF0aW9uOjUwMFxufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAndGVtcGxhdGVEaXInLCAndGVtcGxhdGVzLydcblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2Zvcm1hdERlZmF1bHRzJywge1xuICBkYXRlOiAnJWQuJW0uJVknXG4gIG51bWJlciA6ICAnLC4yZidcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2JhckNvbmZpZycsIHtcbiAgcGFkZGluZzogMC4xXG4gIG91dGVyUGFkZGluZzogMFxufVxuXG4iLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgZGltZW5zaW9uIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfEVsZW1lbnRzfGpRdWVyeX0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB0aGlzLlJlc2l6ZVNlbnNvciA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50UXVldWUoKSB7XG4gICAgICAgICAgICB0aGlzLnEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnEucHVzaChldik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBqID0gdGhpcy5xLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnFbaV0uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAgICAgICAgICogQHJldHVybnMge1N0cmluZ3xOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIHByb3ApIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmN1cnJlbnRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmN1cnJlbnRTdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuc3R5bGVbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzaXplZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgcmVzaXplZCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5jbGFzc05hbWUgPSAnd2stY2hhcnQtcmVzaXplLXNlbnNvcic7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBib3R0b206IDA7IG92ZXJmbG93OiBzY3JvbGw7IHotaW5kZXg6IC0xOyB2aXNpYmlsaXR5OiBoaWRkZW47JztcbiAgICAgICAgICAgIHZhciBzdHlsZUNoaWxkID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyc7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwid2stY2hhcnQtcmVzaXplLXNlbnNvci1leHBhbmRcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJ1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIndrLWNoYXJ0LXJlc2l6ZS1zZW5zb3Itc2hyaW5rXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICcgd2lkdGg6IDIwMCU7IGhlaWdodDogMjAwJVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50LnJlc2l6ZVNlbnNvcik7XG4gICAgICAgICAgICBpZiAoIXtmaXhlZDogMSwgYWJzb2x1dGU6IDF9W2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJyldKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZXhwYW5kID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBleHBhbmRDaGlsZCA9IGV4cGFuZC5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIHNocmluayA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMV07XG4gICAgICAgICAgICB2YXIgc2hyaW5rQ2hpbGQgPSBzaHJpbmsuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBsYXN0V2lkdGgsIGxhc3RIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS53aWR0aCA9IGV4cGFuZC5vZmZzZXRXaWR0aCArIDEwICsgJ3B4JztcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS5oZWlnaHQgPSBleHBhbmQub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxMZWZ0ID0gZXhwYW5kLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxUb3AgPSBleHBhbmQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxMZWZ0ID0gc2hyaW5rLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxUb3AgPSBzaHJpbmsuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxhc3RXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgbGFzdEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgY2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmNhbGwoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgYWRkRXZlbnQgPSBmdW5jdGlvbihlbCwgbmFtZSwgY2IpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoJ29uJyArIG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkRXZlbnQoZXhwYW5kLCAnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiBsYXN0V2lkdGggfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiBsYXN0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYWRkRXZlbnQoc2hyaW5rLCAnc2Nyb2xsJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA8IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA8IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFwiW29iamVjdCBBcnJheV1cIiA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVsZW1lbnQpXG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBqUXVlcnkgJiYgZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSkgLy9qcXVlcnlcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIEVsZW1lbnRzICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50cykgLy9tb290b29sc1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgaSA9IDAsIGogPSBlbGVtZW50Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudFtpXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JydXNoJywgKCRsb2csIHNlbGVjdGlvblNoYXJpbmcsIGJlaGF2aW9yKSAtPlxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiBbJ15jaGFydCcsICdebGF5b3V0JywgJz94JywgJz95JywnP3JhbmdlWCcsICc/cmFuZ2VZJ11cbiAgICBzY29wZTpcbiAgICAgIGJydXNoRXh0ZW50OiAnPSdcbiAgICAgIHNlbGVjdGVkVmFsdWVzOiAnPSdcbiAgICAgIHNlbGVjdGVkRG9tYWluOiAnPSdcbiAgICAgIGNoYW5nZTogJyYnXG5cbiAgICBsaW5rOihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMV0/Lm1lXG4gICAgICB4ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICB5ID0gY29udHJvbGxlcnNbM10/Lm1lXG4gICAgICByYW5nZVggPSBjb250cm9sbGVyc1s0XT8ubWVcbiAgICAgIHJhbmdlWSA9IGNvbnRyb2xsZXJzWzVdPy5tZVxuICAgICAgeFNjYWxlID0gdW5kZWZpbmVkXG4gICAgICB5U2NhbGUgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RhYmxlcyA9IHVuZGVmaW5lZFxuICAgICAgX2JydXNoQXJlYVNlbGVjdGlvbiA9IHVuZGVmaW5lZFxuICAgICAgX2lzQXJlYUJydXNoID0gbm90IHggYW5kIG5vdCB5XG4gICAgICBfYnJ1c2hHcm91cCA9IHVuZGVmaW5lZFxuXG4gICAgICBicnVzaCA9IGNoYXJ0LmJlaGF2aW9yKCkuYnJ1c2hcbiAgICAgIGlmIG5vdCB4IGFuZCBub3QgeSBhbmQgbm90IHJhbmdlWCBhbmQgbm90IHJhbmdlWVxuICAgICAgICAjbGF5b3V0IGJydXNoLCBnZXQgeCBhbmQgeSBmcm9tIGxheW91dCBzY2FsZXNcbiAgICAgICAgc2NhbGVzID0gbGF5b3V0LnNjYWxlcygpLmdldFNjYWxlcyhbJ3gnLCAneSddKVxuICAgICAgICBicnVzaC54KHNjYWxlcy54KVxuICAgICAgICBicnVzaC55KHNjYWxlcy55KVxuICAgICAgZWxzZVxuICAgICAgICBicnVzaC54KHggb3IgcmFuZ2VYKVxuICAgICAgICBicnVzaC55KHkgb3IgcmFuZ2VZKVxuICAgICAgYnJ1c2guYWN0aXZlKHRydWUpXG5cbiAgICAgIGJydXNoLmV2ZW50cygpLm9uICdicnVzaCcsIChpZHhSYW5nZSwgdmFsdWVSYW5nZSwgZG9tYWluKSAtPlxuICAgICAgICBpZiBhdHRycy5icnVzaEV4dGVudFxuICAgICAgICAgIHNjb3BlLmJydXNoRXh0ZW50ID0gaWR4UmFuZ2VcbiAgICAgICAgaWYgYXR0cnMuc2VsZWN0ZWRWYWx1ZXNcbiAgICAgICAgICBzY29wZS5zZWxlY3RlZFZhbHVlcyA9IHZhbHVlUmFuZ2VcbiAgICAgICAgaWYgYXR0cnMuc2VsZWN0ZWREb21haW5cbiAgICAgICAgICBzY29wZS5zZWxlY3RlZERvbWFpbiA9IGRvbWFpblxuICAgICAgICBzY29wZS4kYXBwbHkoKVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXcuYnJ1c2gnLCAoZGF0YSkgLT5cbiAgICAgICAgYnJ1c2guZGF0YShkYXRhKVxuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdicnVzaCcsICh2YWwpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcodmFsKSBhbmQgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBicnVzaC5icnVzaEdyb3VwKHZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJydXNoLmJydXNoR3JvdXAodW5kZWZpbmVkKVxuICB9IixudWxsLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMsIEphc29uIERhdmllcywgaHR0cDovL3d3dy5qYXNvbmRhdmllcy5jb21cbi8vIFNlZSBMSUNFTlNFLnR4dCBmb3IgZGV0YWlscy5cbihmdW5jdGlvbigpIHtcblxudmFyIHJhZGlhbnMgPSBNYXRoLlBJIC8gMTgwLFxuICAgIGRlZ3JlZXMgPSAxODAgLyBNYXRoLlBJO1xuXG4vLyBUT0RPIG1ha2UgaW5jcmVtZW50YWwgcm90YXRlIG9wdGlvbmFsXG5cbmQzLmdlby56b29tID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwcm9qZWN0aW9uLFxuICAgICAgem9vbVBvaW50LFxuICAgICAgZXZlbnQgPSBkMy5kaXNwYXRjaChcInpvb21zdGFydFwiLCBcInpvb21cIiwgXCJ6b29tZW5kXCIpLFxuICAgICAgem9vbSA9IGQzLmJlaGF2aW9yLnpvb20oKVxuICAgICAgICAub24oXCJ6b29tc3RhcnRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIG1vdXNlMCA9IGQzLm1vdXNlKHRoaXMpLFxuICAgICAgICAgICAgICByb3RhdGUgPSBxdWF0ZXJuaW9uRnJvbUV1bGVyKHByb2plY3Rpb24ucm90YXRlKCkpLFxuICAgICAgICAgICAgICBwb2ludCA9IHBvc2l0aW9uKHByb2plY3Rpb24sIG1vdXNlMCk7XG4gICAgICAgICAgaWYgKHBvaW50KSB6b29tUG9pbnQgPSBwb2ludDtcblxuICAgICAgICAgIHpvb21Pbi5jYWxsKHpvb20sIFwiem9vbVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnNjYWxlKGQzLmV2ZW50LnNjYWxlKTtcbiAgICAgICAgICAgICAgICB2YXIgbW91c2UxID0gZDMubW91c2UodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGJldHdlZW4gPSByb3RhdGVCZXR3ZWVuKHpvb21Qb2ludCwgcG9zaXRpb24ocHJvamVjdGlvbiwgbW91c2UxKSk7XG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbi5yb3RhdGUoZXVsZXJGcm9tUXVhdGVybmlvbihyb3RhdGUgPSBiZXR3ZWVuXG4gICAgICAgICAgICAgICAgICAgID8gbXVsdGlwbHkocm90YXRlLCBiZXR3ZWVuKVxuICAgICAgICAgICAgICAgICAgICA6IG11bHRpcGx5KGJhbmsocHJvamVjdGlvbiwgbW91c2UwLCBtb3VzZTEpLCByb3RhdGUpKSk7XG4gICAgICAgICAgICAgICAgbW91c2UwID0gbW91c2UxO1xuICAgICAgICAgICAgICAgIGV2ZW50Lnpvb20uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgZXZlbnQuem9vbXN0YXJ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcInpvb21lbmRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgem9vbU9uLmNhbGwoem9vbSwgXCJ6b29tXCIsIG51bGwpO1xuICAgICAgICAgIGV2ZW50Lnpvb21lbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSksXG4gICAgICB6b29tT24gPSB6b29tLm9uO1xuXG4gIHpvb20ucHJvamVjdGlvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IHpvb20uc2NhbGUoKHByb2plY3Rpb24gPSBfKS5zY2FsZSgpKSA6IHByb2plY3Rpb247XG4gIH07XG5cbiAgcmV0dXJuIGQzLnJlYmluZCh6b29tLCBldmVudCwgXCJvblwiKTtcbn07XG5cbmZ1bmN0aW9uIGJhbmsocHJvamVjdGlvbiwgcDAsIHAxKSB7XG4gIHZhciB0ID0gcHJvamVjdGlvbi50cmFuc2xhdGUoKSxcbiAgICAgIGFuZ2xlID0gTWF0aC5hdGFuMihwMFsxXSAtIHRbMV0sIHAwWzBdIC0gdFswXSkgLSBNYXRoLmF0YW4yKHAxWzFdIC0gdFsxXSwgcDFbMF0gLSB0WzBdKTtcbiAgcmV0dXJuIFtNYXRoLmNvcyhhbmdsZSAvIDIpLCAwLCAwLCBNYXRoLnNpbihhbmdsZSAvIDIpXTtcbn1cblxuZnVuY3Rpb24gcG9zaXRpb24ocHJvamVjdGlvbiwgcG9pbnQpIHtcbiAgdmFyIHQgPSBwcm9qZWN0aW9uLnRyYW5zbGF0ZSgpLFxuICAgICAgc3BoZXJpY2FsID0gcHJvamVjdGlvbi5pbnZlcnQocG9pbnQpO1xuICByZXR1cm4gc3BoZXJpY2FsICYmIGlzRmluaXRlKHNwaGVyaWNhbFswXSkgJiYgaXNGaW5pdGUoc3BoZXJpY2FsWzFdKSAmJiBjYXJ0ZXNpYW4oc3BoZXJpY2FsKTtcbn1cblxuZnVuY3Rpb24gcXVhdGVybmlvbkZyb21FdWxlcihldWxlcikge1xuICB2YXIgzrsgPSAuNSAqIGV1bGVyWzBdICogcmFkaWFucyxcbiAgICAgIM+GID0gLjUgKiBldWxlclsxXSAqIHJhZGlhbnMsXG4gICAgICDOsyA9IC41ICogZXVsZXJbMl0gKiByYWRpYW5zLFxuICAgICAgc2luzrsgPSBNYXRoLnNpbijOuyksIGNvc867ID0gTWF0aC5jb3MozrspLFxuICAgICAgc2luz4YgPSBNYXRoLnNpbijPhiksIGNvc8+GID0gTWF0aC5jb3Moz4YpLFxuICAgICAgc2luzrMgPSBNYXRoLnNpbijOsyksIGNvc86zID0gTWF0aC5jb3MozrMpO1xuICByZXR1cm4gW1xuICAgIGNvc867ICogY29zz4YgKiBjb3POsyArIHNpbs67ICogc2luz4YgKiBzaW7OsyxcbiAgICBzaW7OuyAqIGNvc8+GICogY29zzrMgLSBjb3POuyAqIHNpbs+GICogc2luzrMsXG4gICAgY29zzrsgKiBzaW7PhiAqIGNvc86zICsgc2luzrsgKiBjb3PPhiAqIHNpbs6zLFxuICAgIGNvc867ICogY29zz4YgKiBzaW7OsyAtIHNpbs67ICogc2luz4YgKiBjb3POs1xuICBdO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG4gIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM10sXG4gICAgICBiMCA9IGJbMF0sIGIxID0gYlsxXSwgYjIgPSBiWzJdLCBiMyA9IGJbM107XG4gIHJldHVybiBbXG4gICAgYTAgKiBiMCAtIGExICogYjEgLSBhMiAqIGIyIC0gYTMgKiBiMyxcbiAgICBhMCAqIGIxICsgYTEgKiBiMCArIGEyICogYjMgLSBhMyAqIGIyLFxuICAgIGEwICogYjIgLSBhMSAqIGIzICsgYTIgKiBiMCArIGEzICogYjEsXG4gICAgYTAgKiBiMyArIGExICogYjIgLSBhMiAqIGIxICsgYTMgKiBiMFxuICBdO1xufVxuXG5mdW5jdGlvbiByb3RhdGVCZXR3ZWVuKGEsIGIpIHtcbiAgaWYgKCFhIHx8ICFiKSByZXR1cm47XG4gIHZhciBheGlzID0gY3Jvc3MoYSwgYiksXG4gICAgICBub3JtID0gTWF0aC5zcXJ0KGRvdChheGlzLCBheGlzKSksXG4gICAgICBoYWxmzrMgPSAuNSAqIE1hdGguYWNvcyhNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZG90KGEsIGIpKSkpLFxuICAgICAgayA9IE1hdGguc2luKGhhbGbOsykgLyBub3JtO1xuICByZXR1cm4gbm9ybSAmJiBbTWF0aC5jb3MoaGFsZs6zKSwgYXhpc1syXSAqIGssIC1heGlzWzFdICogaywgYXhpc1swXSAqIGtdO1xufVxuXG5mdW5jdGlvbiBldWxlckZyb21RdWF0ZXJuaW9uKHEpIHtcbiAgcmV0dXJuIFtcbiAgICBNYXRoLmF0YW4yKDIgKiAocVswXSAqIHFbMV0gKyBxWzJdICogcVszXSksIDEgLSAyICogKHFbMV0gKiBxWzFdICsgcVsyXSAqIHFbMl0pKSAqIGRlZ3JlZXMsXG4gICAgTWF0aC5hc2luKE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCAyICogKHFbMF0gKiBxWzJdIC0gcVszXSAqIHFbMV0pKSkpICogZGVncmVlcyxcbiAgICBNYXRoLmF0YW4yKDIgKiAocVswXSAqIHFbM10gKyBxWzFdICogcVsyXSksIDEgLSAyICogKHFbMl0gKiBxWzJdICsgcVszXSAqIHFbM10pKSAqIGRlZ3JlZXNcbiAgXTtcbn1cblxuZnVuY3Rpb24gY2FydGVzaWFuKHNwaGVyaWNhbCkge1xuICB2YXIgzrsgPSBzcGhlcmljYWxbMF0gKiByYWRpYW5zLFxuICAgICAgz4YgPSBzcGhlcmljYWxbMV0gKiByYWRpYW5zLFxuICAgICAgY29zz4YgPSBNYXRoLmNvcyjPhik7XG4gIHJldHVybiBbXG4gICAgY29zz4YgKiBNYXRoLmNvcyjOuyksXG4gICAgY29zz4YgKiBNYXRoLnNpbijOuyksXG4gICAgTWF0aC5zaW4oz4YpXG4gIF07XG59XG5cbmZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gYS5sZW5ndGgsIHMgPSAwOyBpIDwgbjsgKytpKSBzICs9IGFbaV0gKiBiW2ldO1xuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gY3Jvc3MoYSwgYikge1xuICByZXR1cm4gW1xuICAgIGFbMV0gKiBiWzJdIC0gYVsyXSAqIGJbMV0sXG4gICAgYVsyXSAqIGJbMF0gLSBhWzBdICogYlsyXSxcbiAgICBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdXG4gIF07XG59XG5cbn0pKCk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JydXNoZWQnLCAoJGxvZyxzZWxlY3Rpb25TaGFyaW5nLCB0aW1pbmcpIC0+XG4gIHNCcnVzaENudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogWydeY2hhcnQnLCAnP15sYXlvdXQnLCAnP3gnLCAnP3knXVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMV0/Lm1lXG4gICAgICB4ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICB5ID0gY29udHJvbGxlcnNbM10/Lm1lXG5cbiAgICAgIGF4aXMgPSB4IG9yIHlcbiAgICAgIF9icnVzaEdyb3VwID0gdW5kZWZpbmVkXG5cbiAgICAgIGJydXNoZXIgPSAoZXh0ZW50KSAtPlxuICAgICAgICB0aW1pbmcuc3RhcnQoXCJicnVzaGVyI3theGlzLmlkKCl9XCIpXG4gICAgICAgIGlmIG5vdCBheGlzIHRoZW4gcmV0dXJuXG4gICAgICAgICNheGlzXG4gICAgICAgIGF4aXMuZG9tYWluKGV4dGVudCkuc2NhbGUoKS5kb21haW4oZXh0ZW50KVxuICAgICAgICBmb3IgbCBpbiBjaGFydC5sYXlvdXRzKCkgd2hlbiBsLnNjYWxlcygpLmhhc1NjYWxlKGF4aXMpICNuZWVkIHRvIGRvIGl0IHRoaXMgd2F5IHRvIGVuc3VyZSB0aGUgcmlnaHQgYXhpcyBpcyBjaG9zZW4gaW4gY2FzZSBvZiBzZXZlcmFsIGxheW91dHMgaW4gYSBjb250YWluZXJcbiAgICAgICAgICBsLmxpZmVDeWNsZSgpLmJydXNoKGF4aXMsIHRydWUpICNubyBhbmltYXRpb25cbiAgICAgICAgdGltaW5nLnN0b3AoXCJicnVzaGVyI3theGlzLmlkKCl9XCIpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdicnVzaGVkJywgKHZhbCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyh2YWwpIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIF9icnVzaEdyb3VwID0gdmFsXG4gICAgICAgICAgc2VsZWN0aW9uU2hhcmluZy5yZWdpc3RlciBfYnJ1c2hHcm91cCwgYnJ1c2hlclxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgc2NvcGUuJG9uICckZGVzdHJveScsICgpIC0+XG4gICAgICAgIHNlbGVjdGlvblNoYXJpbmcudW5yZWdpc3RlciBfYnJ1c2hHcm91cCwgYnJ1c2hlclxuXG4gIH0iLCIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCQgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyAmJiBleHBvcnRzIHx8IHRoaXM7XG5cbiAgICB2YXIgZG9jdHlwZSA9ICc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgc3RhbmRhbG9uZT1cIm5vXCI/PjwhRE9DVFlQRSBzdmcgUFVCTElDIFwiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU5cIiBcImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZFwiPic7XG5cbiAgICBmdW5jdGlvbiBpbmxpbmVJbWFnZXMoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2ZyBpbWFnZScpO1xuICAgICAgICB2YXIgbGVmdCA9IGltYWdlcy5sZW5ndGg7XG4gICAgICAgIGlmIChsZWZ0ID09IDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIChmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICAgICAgICAgIGlmIChpbWFnZS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IGltYWdlLmdldEF0dHJpYnV0ZSgneGxpbms6aHJlZicpLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoL15odHRwLy50ZXN0KGhyZWYpICYmICEobmV3IFJlZ0V4cCgnXicgKyB3aW5kb3cubG9jYXRpb24uaG9zdCkudGVzdChocmVmKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZW5kZXIgZW1iZWRkZWQgaW1hZ2VzIGxpbmtpbmcgdG8gZXh0ZXJuYWwgaG9zdHMuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKTtcbiAgICAgICAgICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCd4bGluazpocmVmJywgY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJykpO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0LS07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KShpbWFnZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3R5bGVzKGRvbSkge1xuICAgICAgICB2YXIgY3NzID0gXCJcIjtcbiAgICAgICAgdmFyIHNoZWV0cyA9IGRvY3VtZW50LnN0eWxlU2hlZXRzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNoZWV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHJ1bGVzID0gc2hlZXRzW2ldLmNzc1J1bGVzO1xuICAgICAgICAgICAgaWYgKHJ1bGVzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJ1bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBydWxlID0gcnVsZXNbal07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YocnVsZS5zdHlsZSkgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3NzICs9IHJ1bGUuc2VsZWN0b3JUZXh0ICsgXCIgeyBcIiArIHJ1bGUuc3R5bGUuY3NzVGV4dCArIFwiIH1cXG5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgcy5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgcy5pbm5lckhUTUwgPSBcIjwhW0NEQVRBW1xcblwiICsgY3NzICsgXCJcXG5dXT5cIjtcblxuICAgICAgICB2YXIgZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RlZnMnKTtcbiAgICAgICAgZGVmcy5hcHBlbmRDaGlsZChzKTtcbiAgICAgICAgcmV0dXJuIGRlZnM7XG4gICAgfVxuXG4gICAgb3V0JC5zdmdBc0RhdGFVcmkgPSBmdW5jdGlvbihlbCwgc2NhbGVGYWN0b3IsIGNiKSB7XG4gICAgICAgIHNjYWxlRmFjdG9yID0gc2NhbGVGYWN0b3IgfHwgMTtcblxuICAgICAgICBpbmxpbmVJbWFnZXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdmFyIGNsb25lID0gZWwuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgY2xvbmUuZ2V0QXR0cmlidXRlKCd3aWR0aCcpXG4gICAgICAgICAgICAgICAgfHwgY2xvbmUuc3R5bGUud2lkdGhcbiAgICAgICAgICAgICAgICB8fCBvdXQkLmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgY2xvbmUuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKVxuICAgICAgICAgICAgICAgIHx8IGNsb25lLnN0eWxlLmhlaWdodFxuICAgICAgICAgICAgICAgIHx8IG91dCQuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JylcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHZhciB4bWxucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy9cIjtcblxuICAgICAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKFwidmVyc2lvblwiLCBcIjEuMVwiKTtcbiAgICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZU5TKHhtbG5zLCBcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIik7XG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGVOUyh4bWxucywgXCJ4bWxuczp4bGlua1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIik7XG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB3aWR0aCAqIHNjYWxlRmFjdG9yKTtcbiAgICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBoZWlnaHQgKiBzY2FsZUZhY3Rvcik7XG4gICAgICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodCk7XG4gICAgICAgICAgICBvdXRlci5hcHBlbmRDaGlsZChjbG9uZSk7XG5cbiAgICAgICAgICAgIGNsb25lLmluc2VydEJlZm9yZShzdHlsZXMoY2xvbmUpLCBjbG9uZS5maXJzdENoaWxkKTtcblxuICAgICAgICAgICAgdmFyIHN2ZyA9IGRvY3R5cGUgKyBvdXRlci5pbm5lckhUTUw7XG4gICAgICAgICAgICB2YXIgdXJpID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdmcpKSk7XG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICBjYih1cmkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvdXQkLnNhdmVTdmdBc1BuZyA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBzY2FsZUZhY3Rvcikge1xuICAgICAgICBvdXQkLnN2Z0FzRGF0YVVyaShlbCwgc2NhbGVGYWN0b3IsIGZ1bmN0aW9uKHVyaSkge1xuICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmk7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwKTtcblxuICAgICAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgIGEuZG93bmxvYWQgPSBuYW1lO1xuICAgICAgICAgICAgICAgIGEuaHJlZiA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgICAgICAgICAgYS5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY2hhcnQnLCAoJGxvZywgY2hhcnQsICRmaWx0ZXIpIC0+XG4gIGNoYXJ0Q250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiAnY2hhcnQnXG4gICAgc2NvcGU6XG4gICAgICBkYXRhOiAnPSdcbiAgICAgIGZpbHRlcjogJz0nXG4gICAgY29udHJvbGxlcjogKCkgLT5cbiAgICAgIHRoaXMubWUgPSBjaGFydCgpXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGRlZXBXYXRjaCA9IGZhbHNlXG4gICAgICB3YXRjaGVyUmVtb3ZlRm4gPSB1bmRlZmluZWRcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICAgIF9maWx0ZXIgPSB1bmRlZmluZWRcblxuICAgICAgbWUuY29udGFpbmVyKCkuZWxlbWVudChlbGVtZW50WzBdKVxuXG4gICAgICBtZS5saWZlQ3ljbGUoKS5jb25maWd1cmUoKVxuXG4gICAgICBtZS5saWZlQ3ljbGUoKS5vbiAnc2NvcGVBcHBseScsICgpIC0+XG4gICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0b29sdGlwcycsICh2YWwpIC0+XG4gICAgICAgIG1lLnRvb2xUaXBUZW1wbGF0ZSgnJylcbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkIGFuZCAodmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScpXG4gICAgICAgICAgbWUuc2hvd1Rvb2x0aXAodHJ1ZSlcbiAgICAgICAgZWxzZSBpZiB2YWwubGVuZ3RoID4gMCBhbmQgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgIG1lLnRvb2xUaXBUZW1wbGF0ZSh2YWwpXG4gICAgICAgICAgbWUuc2hvd1Rvb2x0aXAodHJ1ZSlcbiAgICAgICAgZWxzZSBzaG93VG9vbFRpcChmYWxzZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2FuaW1hdGlvbkR1cmF0aW9uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCBfLmlzTnVtYmVyKCt2YWwpIGFuZCArdmFsID49IDBcbiAgICAgICAgICBtZS5hbmltYXRpb25EdXJhdGlvbih2YWwpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0aXRsZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIG1lLnRpdGxlKHZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnRpdGxlKHVuZGVmaW5lZClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3N1YnRpdGxlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgbWUuc3ViVGl0bGUodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUuc3ViVGl0bGUodW5kZWZpbmVkKVxuXG4gICAgICBzY29wZS4kd2F0Y2ggJ2ZpbHRlcicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIF9maWx0ZXIgPSB2YWwgIyBzY29wZS4kZXZhbCh2YWwpXG4gICAgICAgICAgaWYgX2RhdGFcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEoJGZpbHRlcignZmlsdGVyJykoX2RhdGEsIF9maWx0ZXIpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2ZpbHRlciA9IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIF9kYXRhXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKF9kYXRhKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZGVlcFdhdGNoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkIGFuZCB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgZGVlcFdhdGNoID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVlcFdhdGNoID0gZmFsc2VcbiAgICAgICAgaWYgd2F0Y2hlclJlbW92ZUZuXG4gICAgICAgICAgd2F0Y2hlclJlbW92ZUZuKClcbiAgICAgICAgd2F0Y2hlclJlbW92ZUZuID0gc2NvcGUuJHdhdGNoICdkYXRhJywgZGF0YVdhdGNoRm4sIGRlZXBXYXRjaFxuXG4gICAgICBkYXRhV2F0Y2hGbiA9ICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIF9kYXRhID0gdmFsXG4gICAgICAgICAgaWYgXy5pc0FycmF5KF9kYXRhKSBhbmQgX2RhdGEubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm5cbiAgICAgICAgICBpZiBfZmlsdGVyXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKCRmaWx0ZXIoJ2ZpbHRlcicpKHZhbCwgX2ZpbHRlcikpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YSh2YWwpXG5cbiAgICAgIHdhdGNoZXJSZW1vdmVGbiA9IHNjb3BlLiR3YXRjaCAnZGF0YScsIGRhdGFXYXRjaEZuLCBkZWVwV2F0Y2hcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnbGF5b3V0JywgKCRsb2csIGxheW91dCwgY29udGFpbmVyKSAtPlxuICBsYXlvdXRDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRSdcbiAgICByZXF1aXJlOiBbJ2xheW91dCcsJ15jaGFydCddXG5cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gbGF5b3V0KClcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cblxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG5cbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIGxheW91dCBpZDonLCBtZS5pZCgpLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuICAgICAgY2hhcnQuYWRkTGF5b3V0KG1lKVxuICAgICAgY2hhcnQuY29udGFpbmVyKCkuYWRkTGF5b3V0KG1lKVxuICAgICAgbWUuY29udGFpbmVyKGNoYXJ0LmNvbnRhaW5lcigpKVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3ByaW50QnV0dG9uJywgKCRsb2cpIC0+XG5cbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOidjaGFydCdcbiAgICByZXN0cmljdDogJ0EnXG4gICAgbGluazooc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGRyYXcgPSAoKSAtPlxuICAgICAgICBfY29udGFpbmVyRGl2ID0gZDMuc2VsZWN0KGNoYXJ0LmNvbnRhaW5lcigpLmVsZW1lbnQoKSkuc2VsZWN0KCdkaXYud2stY2hhcnQnKVxuICAgICAgICBfY29udGFpbmVyRGl2LmFwcGVuZCgnYnV0dG9uJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1wcmludC1idXR0b24nKVxuICAgICAgICAgIC5zdHlsZSh7cG9zaXRpb246J2Fic29sdXRlJywgdG9wOjAsIHJpZ2h0OjB9KVxuICAgICAgICAgIC50ZXh0KCdQcmludCcpXG4gICAgICAgICAgLm9uICdjbGljaycsICgpLT5cbiAgICAgICAgICAgICRsb2cubG9nICdDbGlja2VkIFByaW50IEJ1dHRvbidcblxuICAgICAgICAgICAgc3ZnICA9IF9jb250YWluZXJEaXYuc2VsZWN0KCdzdmcud2stY2hhcnQnKS5ub2RlKClcbiAgICAgICAgICAgIHNhdmVTdmdBc1BuZyhzdmcsICdwcmludC5wbmcnLDUpXG5cblxuICAgICAgY2hhcnQubGlmZUN5Y2xlKCkub24gJ2RyYXdDaGFydC5wcmludCcsIGRyYXdcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc2VsZWN0aW9uJywgKCRsb2cpIC0+XG4gIG9iaklkID0gMFxuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHNjb3BlOlxuICAgICAgc2VsZWN0ZWREb21haW46ICc9J1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZS5zZWxlY3Rpb24nLCAtPlxuXG4gICAgICAgIF9zZWxlY3Rpb24gPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfc2VsZWN0aW9uLmFjdGl2ZSh0cnVlKVxuICAgICAgICBfc2VsZWN0aW9uLm9uICdzZWxlY3RlZCcsIChzZWxlY3RlZE9iamVjdHMpIC0+XG4gICAgICAgICAgc2NvcGUuc2VsZWN0ZWREb21haW4gPSBzZWxlY3RlZE9iamVjdHNcbiAgICAgICAgICBzY29wZS4kYXBwbHkoKVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5wcm92aWRlciAnd2tDaGFydFNjYWxlcycsICgpIC0+XG5cbiAgX2N1c3RvbUNvbG9ycyA9IFsncmVkJywgJ2dyZWVuJywnYmx1ZScsJ3llbGxvdycsJ29yYW5nZSddXG5cbiAgaGFzaGVkID0gKCkgLT5cbiAgICBkM1NjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG5cbiAgICBfaGFzaEZuID0gKHZhbHVlKSAtPlxuICAgICAgaGFzaCA9IDA7XG4gICAgICBtID0gZDNTY2FsZS5yYW5nZSgpLmxlbmd0aCAtIDFcbiAgICAgIGZvciBpIGluIFswIC4uIHZhbHVlLmxlbmd0aF1cbiAgICAgICAgaGFzaCA9ICgzMSAqIGhhc2ggKyB2YWx1ZS5jaGFyQXQoaSkpICUgbTtcblxuICAgIG1lID0gKHZhbHVlKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBtZVxuICAgICAgZDNTY2FsZShfaGFzaEZuKHZhbHVlKSlcblxuICAgIG1lLnJhbmdlID0gKHJhbmdlKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBkM1NjYWxlLnJhbmdlKClcbiAgICAgIGQzU2NhbGUuZG9tYWluKGQzLnJhbmdlKHJhbmdlLmxlbmd0aCkpXG4gICAgICBkM1NjYWxlLnJhbmdlKHJhbmdlKVxuXG4gICAgbWUucmFuZ2VQb2ludCA9IGQzU2NhbGUucmFuZ2VQb2ludHNcbiAgICBtZS5yYW5nZUJhbmRzID0gZDNTY2FsZS5yYW5nZUJhbmRzXG4gICAgbWUucmFuZ2VSb3VuZEJhbmRzID0gZDNTY2FsZS5yYW5nZVJvdW5kQmFuZHNcbiAgICBtZS5yYW5nZUJhbmQgPSBkM1NjYWxlLnJhbmdlQmFuZFxuICAgIG1lLnJhbmdlRXh0ZW50ID0gZDNTY2FsZS5yYW5nZUV4dGVudFxuXG4gICAgbWUuaGFzaCA9IChmbikgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2hhc2hGblxuICAgICAgX2hhc2hGbiA9IGZuXG4gICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuXG4gIGNhdGVnb3J5Q29sb3JzID0gKCkgLT4gcmV0dXJuIGQzLnNjYWxlLm9yZGluYWwoKS5yYW5nZShfY3VzdG9tQ29sb3JzKVxuXG4gIGNhdGVnb3J5Q29sb3JzSGFzaGVkID0gKCkgLT4gcmV0dXJuIGhhc2hlZCgpLnJhbmdlKF9jdXN0b21Db2xvcnMpXG5cbiAgdGhpcy5jb2xvcnMgPSAoY29sb3JzKSAtPlxuICAgIF9jdXN0b21Db2xvcnMgPSBjb2xvcnNcblxuICB0aGlzLiRnZXQgPSBbJyRsb2cnLCgkbG9nKSAtPlxuICAgIHJldHVybiB7aGFzaGVkOmhhc2hlZCxjb2xvcnM6Y2F0ZWdvcnlDb2xvcnMsIGNvbG9yc0hhc2hlZDogY2F0ZWdvcnlDb2xvcnNIYXNoZWR9XG4gIF1cblxuICByZXR1cm4gdGhpcyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZpbHRlciAndHRGb3JtYXQnLCAoJGxvZyxmb3JtYXREZWZhdWx0cykgLT5cbiAgcmV0dXJuICh2YWx1ZSwgZm9ybWF0KSAtPlxuICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnb2JqZWN0JyBhbmQgdmFsdWUuZ2V0VVRDRGF0ZVxuICAgICAgZGYgPSBkMy50aW1lLmZvcm1hdChmb3JtYXREZWZhdWx0cy5kYXRlKVxuICAgICAgcmV0dXJuIGRmKHZhbHVlKVxuICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJyBvciBub3QgaXNOYU4oK3ZhbHVlKVxuICAgICAgZGYgPSBkMy5mb3JtYXQoZm9ybWF0RGVmYXVsdHMubnVtYmVyKVxuICAgICAgcmV0dXJuIGRmKCt2YWx1ZSlcbiAgICByZXR1cm4gdmFsdWUiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWEnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF9kYXRhT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzT2xkID0gW11cbiAgICAgIF9wYXRoVmFsdWVzTmV3ID0gW11cbiAgICAgIF9wYXRoQXJyYXkgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIF9pZCA9ICdsaW5lJyArIGxpbmVDbnRyKytcbiAgICAgIGFyZWEgPSB1bmRlZmluZWRcblxuICAgICAgIy0tLSBUb29sdGlwIGhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoaWR4KSAtPlxuICAgICAgICBfcGF0aEFycmF5ID0gXy50b0FycmF5KF9wYXRoVmFsdWVzTmV3KVxuICAgICAgICB0dE1vdmVEYXRhLmFwcGx5KHRoaXMsIFtpZHhdKVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBfcGF0aEFycmF5Lm1hcCgobCkgLT4ge25hbWU6bFtpZHhdLmtleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGxbaWR4XS55KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbFtpZHhdLmNvbG9yfSwgeHY6bFtpZHhdLnh2fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKHR0TGF5ZXJzWzBdLnh2KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKF9wYXRoQXJyYXksIChkKSAtPiBkW2lkeF0ua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkW2lkeF0uY29sb3IpXG4gICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gZFtpZHhdLnkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X3NjYWxlTGlzdC54LnNjYWxlKCkoX3BhdGhBcnJheVswXVtpZHhdLnh2KSArIG9mZnNldH0pXCIpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIG1lcmdlZFggPSB1dGlscy5tZXJnZVNlcmllcyh4LnZhbHVlKF9kYXRhT2xkKSwgeC52YWx1ZShkYXRhKSlcbiAgICAgICAgX2xheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBbXVxuXG4gICAgICAgIF9wYXRoVmFsdWVzTmV3ID0ge31cblxuICAgICAgICBmb3Iga2V5IGluIF9sYXllcktleXNcbiAgICAgICAgICBfcGF0aFZhbHVlc05ld1trZXldID0gZGF0YS5tYXAoKGQpLT4ge3g6eC5tYXAoZCkseTp5LnNjYWxlKCkoeS5sYXllclZhbHVlKGQsIGtleSkpLCB4djp4LnZhbHVlKGQpLCB5djp5LmxheWVyVmFsdWUoZCxrZXkpLCBrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIGRhdGE6ZH0pXG5cbiAgICAgICAgICBsYXllciA9IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOltdfVxuICAgICAgICAgICMgZmluZCBzdGFydGluZyB2YWx1ZSBmb3Igb2xkXG4gICAgICAgICAgaSA9IDBcbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMF0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgb2xkTGFzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bbWVyZ2VkWFtpXVswXV1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFgubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRYW2ldWzFdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG5ld0xhc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW21lcmdlZFhbaV1bMV1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIGZvciB2YWwsIGkgaW4gbWVyZ2VkWFxuICAgICAgICAgICAgdiA9IHtjb2xvcjpsYXllci5jb2xvciwgeDp2YWxbMl19XG4gICAgICAgICAgICAjIHNldCB4IGFuZCB5IHZhbHVlcyBmb3Igb2xkIHZhbHVlcy4gSWYgdGhlcmUgaXMgYSBhZGRlZCB2YWx1ZSwgbWFpbnRhaW4gdGhlIGxhc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIHZhbFsxXSBpcyB1bmRlZmluZWQgI2llIGFuIG9sZCB2YWx1ZSBpcyBkZWxldGVkLCBtYWludGFpbiB0aGUgbGFzdCBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi55TmV3ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gbmV3TGFzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0xhc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV1cbiAgICAgICAgICAgICAgdi5kZWxldGVkID0gZmFsc2VcblxuICAgICAgICAgICAgaWYgX2RhdGFPbGQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICBpZiAgdmFsWzBdIGlzIHVuZGVmaW5lZCAjIGllIGEgbmV3IHZhbHVlIGhhcyBiZWVuIGFkZGVkXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRMYXN0LnggIyBzdGFydCB4LWFuaW1hdGlvbiBmcm9tIHRoZSBwcmVkZWNlc3NvcnMgb2xkIHBvc2l0aW9uXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueVxuICAgICAgICAgICAgICAgIHYueE9sZCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS54XG4gICAgICAgICAgICAgICAgb2xkTGFzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2LnhPbGQgPSB2LnhOZXdcbiAgICAgICAgICAgICAgdi55T2xkID0gdi55TmV3XG5cblxuICAgICAgICAgICAgbGF5ZXIudmFsdWUucHVzaCh2KVxuXG4gICAgICAgICAgX2xheW91dC5wdXNoKGxheWVyKVxuXG4gICAgICAgICNsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICAjX2xheW91dCA9IGxheWVyS2V5cy5tYXAoKGtleSkgPT4ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6ZGF0YS5tYXAoKGQpLT4ge3g6eC52YWx1ZShkKSx5OnkubGF5ZXJWYWx1ZShkLCBrZXkpLCBkYXRhOmR9KX0pXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeC5pc09yZGluYWwoKSB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgYXJlYU9sZCA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIGQueE9sZClcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnlPbGQpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeS5zY2FsZSgpKDApKVxuXG4gICAgICAgIGFyZWFOZXcgPSBkMy5zdmcuYXJlYSgpXG4gICAgICAgICAgLngoKGQpIC0+ICBkLnhOZXcpXG4gICAgICAgICAgLnkwKChkKSAtPiAgZC55TmV3KVxuICAgICAgICAgIC55MSgoZCkgLT4gIHkuc2NhbGUoKSgwKSlcblxuICAgICAgICBhcmVhQnJ1c2ggPSBkMy5zdmcuYXJlYSgpXG4gICAgICAgICAgLngoKGQpIC0+ICB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgICAueTAoKGQpIC0+ICBkLnlOZXcpXG4gICAgICAgICAgLnkxKChkKSAtPiAgeS5zY2FsZSgpKDApKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmcm9tJywgXCJ0cmFuc2xhdGUoI3tvZmZzZXR9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYU9sZChkLnZhbHVlKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhTmV3KGQudmFsdWUpKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBfZGF0YU9sZCA9IGRhdGFcbiAgICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBfcGF0aFZhbHVlc05ld1xuXG4gICAgICBicnVzaCA9IChkYXRhLCBvcHRpb25zLHgseSxjb2xvcikgLT5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWFCcnVzaChkLnZhbHVlKSlcblxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC54KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGJydXNoXG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhU3RhY2tlZCcsICgkbG9nLCB1dGlscykgLT5cbiAgc3RhY2tlZEFyZWFDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpXG4gICAgICBvZmZzZXQgPSAnemVybydcbiAgICAgIGxheWVycyA9IG51bGxcbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgbGF5ZXJEYXRhID0gW11cbiAgICAgIGxheW91dE5ldyA9IFtdXG4gICAgICBsYXlvdXRPbGQgPSBbXVxuICAgICAgbGF5ZXJLZXlzT2xkID0gW11cbiAgICAgIGFyZWEgPSB1bmRlZmluZWRcbiAgICAgIGRlbGV0ZWRTdWNjID0ge31cbiAgICAgIGFkZGVkUHJlZCA9IHt9XG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBzY2FsZVkgPSB1bmRlZmluZWRcbiAgICAgIG9mZnMgPSAwXG4gICAgICBfaWQgPSAnYXJlYScgKyBzdGFja2VkQXJlYUNudHIrK1xuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gbGF5ZXJEYXRhLm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLmxheWVyW2lkeF0ueXkpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueClcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShsYXllckRhdGEsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gc2NhbGVZKGQubGF5ZXJbaWR4XS55ICsgZC5sYXllcltpZHhdLnkwKSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19zY2FsZUxpc3QueC5zY2FsZSgpKGxheWVyRGF0YVswXS5sYXllcltpZHhdLngpK29mZnN9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRMYXllckJ5S2V5ID0gKGtleSwgbGF5b3V0KSAtPlxuICAgICAgICBmb3IgbCBpbiBsYXlvdXRcbiAgICAgICAgICBpZiBsLmtleSBpcyBrZXlcbiAgICAgICAgICAgIHJldHVybiBsXG5cbiAgICAgIGxheW91dCA9IHN0YWNrLnZhbHVlcygoZCktPmQubGF5ZXIpLnkoKGQpIC0+IGQueXkpXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMjI1xuICAgICAgcHJlcERhdGEgPSAoeCx5LGNvbG9yKSAtPlxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKEApXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBAbWFwKChkKSAtPiB7eDogeC52YWx1ZShkKSwgeXk6ICt5LmxheWVyVmFsdWUoZCxrKSwgeTA6IDB9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgI2xheW91dE5ldyA9IGxheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgZGVsZXRlZFN1Y2MgPSB1dGlscy5kaWZmKGxheWVyS2V5c09sZCwgbGF5ZXJLZXlzLCAxKVxuICAgICAgICBhZGRlZFByZWQgPSB1dGlscy5kaWZmKGxheWVyS2V5cywgbGF5ZXJLZXlzT2xkLCAtMSlcbiAgICAgICMjI1xuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBBcmVhIENoYXJ0XCJcblxuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG5cbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IGRhdGEubWFwKChkKSAtPiB7eDogeC52YWx1ZShkKSwgeXk6ICt5LmxheWVyVmFsdWUoZCxrKSwgeTA6IDAsIGRhdGE6ZH0pfSkgIyB5eTogbmVlZCB0byBhdm9pZCBvdmVyd3JpdGluZyBieSBsYXlvdXQgY2FsYyAtPiBzZWUgc3RhY2sgeSBhY2Nlc3NvclxuICAgICAgICBsYXlvdXROZXcgPSBsYXlvdXQobGF5ZXJEYXRhKVxuXG4gICAgICAgIG9mZnMgPSBpZiB4LmlzT3JkaW5hbCgpIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC1sYXllcicpXG5cbiAgICAgICAgaWYgb2Zmc2V0IGlzICdleHBhbmQnXG4gICAgICAgICAgc2NhbGVZID0geS5zY2FsZSgpLmNvcHkoKVxuICAgICAgICAgIHNjYWxlWS5kb21haW4oWzAsIDFdKVxuICAgICAgICBlbHNlIHNjYWxlWSA9IHkuc2NhbGUoKVxuXG4gICAgICAgIGFyZWEgPSBkMy5zdmcuYXJlYSgpXG4gICAgICAgICAgLngoKGQpIC0+ICB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgICAueTAoKGQpIC0+ICBzY2FsZVkoZC55MCArIGQueSkpXG4gICAgICAgICAgLnkxKChkKSAtPiAgc2NhbGVZKGQueTApKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKGxheW91dE5ldywgKGQpIC0+IGQua2V5KVxuXG4gICAgICAgIGlmIGxheW91dE9sZC5sZW5ndGggaXMgMFxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gaWYgYWRkZWRQcmVkW2Qua2V5XSB0aGVuIGdldExheWVyQnlLZXkoYWRkZWRQcmVkW2Qua2V5XSwgbGF5b3V0T2xkKS5wYXRoIGVsc2UgYXJlYShkLmxheWVyLm1hcCgocCkgLT4gIHt4OiBwLngsIHk6IDAsIHkwOiAwfSkpKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tvZmZzfSlcIilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQubGF5ZXIpKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKVxuXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPlxuICAgICAgICAgICAgc3VjYyA9IGRlbGV0ZWRTdWNjW2Qua2V5XVxuICAgICAgICAgICAgaWYgc3VjYyB0aGVuIGFyZWEoZ2V0TGF5ZXJCeUtleShzdWNjLCBsYXlvdXROZXcpLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueTB9KSkgZWxzZSBhcmVhKGxheW91dE5ld1tsYXlvdXROZXcubGVuZ3RoIC0gMV0ubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55MCArIHAueX0pKVxuICAgICAgICAgIClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueSArIHAueTB9KSl9KVxuICAgICAgICBsYXllcktleXNPbGQgPSBsYXllcktleXNcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygndG90YWwnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC54KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdhcmVhU3RhY2tlZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpbiBbJ3plcm8nLCAnc2lsaG91ZXR0ZScsICdleHBhbmQnLCAnd2lnZ2xlJ11cbiAgICAgICAgICBvZmZzZXQgPSB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9mZnNldCA9IFwiemVyb1wiXG4gICAgICAgIHN0YWNrLm9mZnNldChvZmZzZXQpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGVudGVyIC8gZXhpdCBhbmltYXRpb25zIGxpa2UgaW4gbGluZVxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWFTdGFja2VkVmVydGljYWwnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGFyZWFTdGFja2VkVmVydENudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKClcbiAgICAgIG9mZnNldCA9ICd6ZXJvJ1xuICAgICAgbGF5ZXJzID0gbnVsbFxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBsYXllckRhdGEgPSBbXVxuICAgICAgbGF5b3V0TmV3ID0gW11cbiAgICAgIGxheW91dE9sZCA9IFtdXG4gICAgICBsYXllcktleXNPbGQgPSBbXVxuICAgICAgYXJlYSA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlZFN1Y2MgPSB7fVxuICAgICAgYWRkZWRQcmVkID0ge31cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIHNjYWxlWCA9IHVuZGVmaW5lZFxuICAgICAgb2ZmcyA9IDBcbiAgICAgIF9pZCA9ICdhcmVhLXN0YWNrZWQtdmVydCcgKyBhcmVhU3RhY2tlZFZlcnRDbnRyKytcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IGxheWVyRGF0YS5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobC5sYXllcltpZHhdLnh4KSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGxheWVyRGF0YVswXS5sYXllcltpZHhdLnl5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKGxheWVyRGF0YSwgKGQpIC0+IGQua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeCcsIChkKSAtPiBzY2FsZVgoZC5sYXllcltpZHhdLnkgKyBkLmxheWVyW2lkeF0ueTApKSAgIyB3ZWlyZCEhISBob3dldmVyLCB0aGUgZGF0YSBpcyBmb3IgYSBob3Jpem9udGFsIGNoYXJ0IHdoaWNoIGdldHMgdHJhbnNmb3JtZWRcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7X3NjYWxlTGlzdC55LnNjYWxlKCkobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueXkpK29mZnN9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRMYXllckJ5S2V5ID0gKGtleSwgbGF5b3V0KSAtPlxuICAgICAgICBmb3IgbCBpbiBsYXlvdXRcbiAgICAgICAgICBpZiBsLmtleSBpcyBrZXlcbiAgICAgICAgICAgIHJldHVybiBsXG5cbiAgICAgIGxheW91dCA9IHN0YWNrLnZhbHVlcygoZCktPmQubGF5ZXIpLnkoKGQpIC0+IGQueHgpXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMjI1xuICAgICAgcHJlcERhdGEgPSAoeCx5LGNvbG9yKSAtPlxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKEApXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBAbWFwKChkKSAtPiB7eDogeC52YWx1ZShkKSwgeXk6ICt5LmxheWVyVmFsdWUoZCxrKSwgeTA6IDB9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgI2xheW91dE5ldyA9IGxheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgZGVsZXRlZFN1Y2MgPSB1dGlscy5kaWZmKGxheWVyS2V5c09sZCwgbGF5ZXJLZXlzLCAxKVxuICAgICAgICBhZGRlZFByZWQgPSB1dGlscy5kaWZmKGxheWVyS2V5cywgbGF5ZXJLZXlzT2xkLCAtMSlcbiAgICAgICMjI1xuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBBcmVhIENoYXJ0XCJcblxuXG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG5cbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IGRhdGEubWFwKChkKSAtPiB7eXk6IHkudmFsdWUoZCksIHh4OiAreC5sYXllclZhbHVlKGQsayksIHkwOiAwLCBkYXRhOmR9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgbGF5b3V0TmV3ID0gbGF5b3V0KGxheWVyRGF0YSlcblxuICAgICAgICBvZmZzID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGlmIG9mZnNldCBpcyAnZXhwYW5kJ1xuICAgICAgICAgIHNjYWxlWCA9IHguc2NhbGUoKS5jb3B5KClcbiAgICAgICAgICBzY2FsZVguZG9tYWluKFswLCAxXSlcbiAgICAgICAgZWxzZSBzY2FsZVggPSB4LnNjYWxlKClcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAgIC54KChkKSAtPiAgeS5zY2FsZSgpKGQueXkpKVxuICAgICAgICAgIC55MCgoZCkgLT4gIHNjYWxlWChkLnkwICsgZC55KSlcbiAgICAgICAgICAueTEoKGQpIC0+ICBzY2FsZVgoZC55MCkpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEobGF5b3V0TmV3LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgaWYgbGF5b3V0T2xkLmxlbmd0aCBpcyAwXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSkuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBpZiBhZGRlZFByZWRbZC5rZXldIHRoZW4gZ2V0TGF5ZXJCeUtleShhZGRlZFByZWRbZC5rZXldLCBsYXlvdXRPbGQpLnBhdGggZWxzZSBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiAge3l5OiBwLnl5LCB5OiAwLCB5MDogMH0pKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcbiAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwicm90YXRlKDkwKSBzY2FsZSgxLC0xKVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC5sYXllcikpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG5cblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBzdWNjID0gZGVsZXRlZFN1Y2NbZC5rZXldXG4gICAgICAgICAgICBpZiBzdWNjIHRoZW4gYXJlYShnZXRMYXllckJ5S2V5KHN1Y2MsIGxheW91dE5ldykubGF5ZXIubWFwKChwKSAtPiB7eXk6IHAueXksIHk6IDAsIHkwOiBwLnkwfSkpIGVsc2UgYXJlYShsYXlvdXROZXdbbGF5b3V0TmV3Lmxlbmd0aCAtIDFdLmxheWVyLm1hcCgocCkgLT4ge3l5OiBwLnl5LCB5OiAwLCB5MDogcC55MCArIHAueX0pKVxuICAgICAgICAgIClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3l5OiBwLnl5LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LnkpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2FyZWFTdGFja2VkVmVydGljYWwnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaW4gWyd6ZXJvJywgJ3NpbGhvdWV0dGUnLCAnZXhwYW5kJywgJ3dpZ2dsZSddXG4gICAgICAgICAgb2Zmc2V0ID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvZmZzZXQgPSBcInplcm9cIlxuICAgICAgICBzdGFjay5vZmZzZXQob2Zmc2V0KVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBlbnRlciAvIGV4aXQgYW5pbWF0aW9ucyBsaWtlIGluIGxpbmVcbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhVmVydGljYWwnLCAoJGxvZykgLT5cbiAgbGluZUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgcy1saW5lJ1xuICAgICAgbGF5ZXJLZXlzID0gW11cbiAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIF9pZCA9ICdsaW5lJyArIGxpbmVDbnRyKytcblxuICAgICAgIy0tLSBUb29sdGlwIGhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IF9sYXlvdXQubWFwKChsKSAtPiB7bmFtZTpsLmtleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwudmFsdWVbaWR4XS54KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUoX2xheW91dFswXS52YWx1ZVtpZHhdLnkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbCgnY2lyY2xlJykuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N4JywgKGQpIC0+IF9zY2FsZUxpc3QueC5zY2FsZSgpKGQudmFsdWVbaWR4XS54KSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwgI3tfc2NhbGVMaXN0Lnkuc2NhbGUoKShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueSkgKyBvZmZzZXR9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBfbGF5b3V0ID0gbGF5ZXJLZXlzLm1hcCgoa2V5KSA9PiB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpkYXRhLm1hcCgoZCktPiB7eTp5LnZhbHVlKGQpLHg6eC5sYXllclZhbHVlKGQsIGtleSksIGRhdGE6ZH0pfSlcblxuICAgICAgICBvZmZzZXQgPSBpZiB5LmlzT3JkaW5hbCgpIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKSAgICAjIHRyaWNreS4gRHJhdyB0aGlzIGxpa2UgYSB2ZXJ0aWNhbCBjaGFydCBhbmQgdGhlbiByb3RhdGUgYW5kIHBvc2l0aW9uIGl0LlxuICAgICAgICAueCgoZCkgLT4gb3B0aW9ucy53aWR0aCAtIHkuc2NhbGUoKShkLnkpKVxuICAgICAgICAueTAoKGQpIC0+ICB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgLnkxKChkKSAtPiAgeC5zY2FsZSgpKDApKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7b3B0aW9ucy53aWR0aCArIG9mZnNldH0pcm90YXRlKC05MClcIikgI3JvdGF0ZSBhbmQgcG9zaXRpb24gY2hhcnRcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYShkLnZhbHVlKSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC55KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBlbnRlciAvIGV4aXQgYW5pbWF0aW9ucyBsaWtlIGluIGxpbmVcbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJzJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpLT5cbiAgc0JhckNudHIgPSAwXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnQSdcbiAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgX2lkID0gXCJiYXJzI3tzQmFyQ250cisrfVwiXG5cbiAgICBiYXJzID0gbnVsbFxuICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuXG4gICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKClcbiAgICBfbWVyZ2UoW10pLmtleSgoZCkgLT4gZC5rZXkpXG5cbiAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG5cbiAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3QueC5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgIGlmIG5vdCBiYXJzXG4gICAgICAgIGJhcnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYmFycycpXG4gICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgc3RhY2tlZC1iYXJcIlxuXG4gICAgICBiYXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgbGF5b3V0ID0gZGF0YS5tYXAoKGQpIC0+IHtrZXk6eS52YWx1ZShkKSwgeDp4Lm1hcChkKSwgeTp5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCBoZWlnaHQ6eS5zY2FsZSgpLnJhbmdlQmFuZCh5LnZhbHVlKGQpKSwgZGF0YTpkfSlcblxuICAgICAgX21lcmdlKGxheW91dCkuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZ30pLmxhc3Qoe3k6MCwgaGVpZ2h0OmJhck91dGVyUGFkZGluZ09sZCAtIGJhclBhZGRpbmdPbGQgLyAyfSkgICN5LnNjYWxlKCkucmFuZ2UoKVt5LnNjYWxlKCkucmFuZ2UoKS5sZW5ndGgtMV1cblxuICAgICAgYmFycyA9IGJhcnMuZGF0YShsYXlvdXQsIChkKSAtPiBkLmtleSlcblxuICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMilcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC5oZWlnaHQgZWxzZSAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgYmFycy5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gTWF0aC5taW4oeC5zY2FsZSgpKDApLCBkLngpKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gTWF0aC5hYnMoeC5zY2FsZSgpKDApIC0gZC54KSlcbiAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IF9tZXJnZS5kZWxldGVkU3VjYyhkKS55ICsgX21lcmdlLmRlbGV0ZWRTdWNjKGQpLmhlaWdodCArIGJhclBhZGRpbmcgLyAyKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgIGluaXRpYWwgPSBmYWxzZVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG5cbiAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgIF9zY2FsZUxpc3QueS5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJDbHVzdGVyZWQnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZyktPlxuXG4gIGNsdXN0ZXJlZEJhckNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIF9pZCA9IFwiY2x1c3RlcmVkQmFyI3tjbHVzdGVyZWRCYXJDbnRyKyt9XCJcblxuICAgICAgbGF5ZXJzID0gbnVsbFxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgICAgX21lcmdlTGF5ZXJzID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmxheWVyS2V5KVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuICAgICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBkYXRhLmxheWVycy5tYXAoKGwpIC0+IHtuYW1lOmwubGF5ZXJLZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsLnZhbHVlKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGRhdGEua2V5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5pbmZvIFwicmVuZGVyaW5nIGNsdXN0ZXJlZC1iYXJcIlxuXG4gICAgICAgIGJhclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgICAgIyBtYXAgZGF0YSB0byB0aGUgcmlnaHQgZm9ybWF0IGZvciByZW5kZXJpbmdcbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcblxuICAgICAgICBjbHVzdGVyWSA9IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oeC5sYXllcktleXMoZGF0YSkpLnJhbmdlQmFuZHMoWzAsIHkuc2NhbGUoKS5yYW5nZUJhbmQoKV0sIDAsIDApXG5cbiAgICAgICAgY2x1c3RlciA9IGRhdGEubWFwKChkKSAtPiBsID0ge1xuICAgICAgICAgIGtleTp5LnZhbHVlKGQpLCBkYXRhOmQsIHk6eS5tYXAoZCksIGhlaWdodDogeS5zY2FsZSgpLnJhbmdlQmFuZCh5LnZhbHVlKGQpKVxuICAgICAgICAgIGxheWVyczogbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2xheWVyS2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBrZXk6eS52YWx1ZShkKSwgdmFsdWU6IGRba10sIHk6Y2x1c3RlclkoayksIHg6IHguc2NhbGUoKShkW2tdKSwgd2lkdGg6eC5zY2FsZSgpKGRba10pLCBoZWlnaHQ6Y2x1c3RlclkucmFuZ2VCYW5kKGspfSl9XG4gICAgICAgIClcblxuICAgICAgICBfbWVyZ2UoY2x1c3RlcikuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgaGVpZ2h0Onkuc2NhbGUoKS5yYW5nZUJhbmQoKX0pLmxhc3Qoe3k6MCwgaGVpZ2h0OmJhck91dGVyUGFkZGluZ09sZCAtIGJhclBhZGRpbmdPbGQgLyAyfSlcbiAgICAgICAgX21lcmdlTGF5ZXJzKGNsdXN0ZXJbMF0ubGF5ZXJzKS5maXJzdCh7eTowLCBoZWlnaHQ6MH0pLmxhc3Qoe3k6Y2x1c3RlclswXS5oZWlnaHQsIGhlaWdodDowfSlcblxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBsYXllcnMgPSBsYXllcnMuZGF0YShjbHVzdGVyLCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGF5ZXInKS5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+XG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgICBcInRyYW5zbGF0ZSgwLCAje2lmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMn0pIHNjYWxlKDEsI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje2QueX0pIHNjYWxlKDEsMSlcIilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCAje19tZXJnZS5kZWxldGVkU3VjYyhkKS55ICsgX21lcmdlLmRlbGV0ZWRTdWNjKGQpLmhlaWdodCArIGJhclBhZGRpbmcgLyAyfSkgc2NhbGUoMSwwKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkueSArIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkuaGVpZ2h0KVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQuaGVpZ2h0IGVsc2UgMClcbiAgICAgICAgICAuYXR0cigneCcsIHguc2NhbGUoKSgwKSlcblxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3Iuc2NhbGUoKShkLmxheWVyS2V5KSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IE1hdGgubWluKHguc2NhbGUoKSgwKSwgZC54KSlcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IE1hdGguYWJzKGQuaGVpZ2h0KSlcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgICMuYXR0cignd2lkdGgnLDApXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkKS55KVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJTdGFja2VkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpIC0+XG5cbiAgc3RhY2tlZEJhckNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgU3RhY2tlZCBiYXInXG5cbiAgICAgIF9pZCA9IFwic3RhY2tlZENvbHVtbiN7c3RhY2tlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIHN0YWNrID0gW11cbiAgICAgIF90b29sdGlwID0gKCktPlxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKVxuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUsIHNoYXBlKSAtPlxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICMkbG9nLmRlYnVnIFwiZHJhd2luZyBzdGFja2VkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHN0YWNrID0gW11cbiAgICAgICAgZm9yIGQgaW4gZGF0YVxuICAgICAgICAgIHgwID0gMFxuICAgICAgICAgIGwgPSB7a2V5OnkudmFsdWUoZCksIGxheWVyczpbXSwgZGF0YTpkLCB5OnkubWFwKGQpLCBoZWlnaHQ6aWYgeS5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDF9XG4gICAgICAgICAgaWYgbC55IGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICBsLmxheWVycyA9IGxheWVyS2V5cy5tYXAoKGspIC0+XG4gICAgICAgICAgICAgIGxheWVyID0ge2xheWVyS2V5OmssIGtleTpsLmtleSwgdmFsdWU6ZFtrXSwgd2lkdGg6IHguc2NhbGUoKSgrZFtrXSksIGhlaWdodDogKGlmIHkuc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxKSwgeDogeC5zY2FsZSgpKCt4MCksIGNvbG9yOiBjb2xvci5zY2FsZSgpKGspfVxuICAgICAgICAgICAgICB4MCArPSArZFtrXVxuICAgICAgICAgICAgICByZXR1cm4gbGF5ZXJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobClcblxuICAgICAgICBfbWVyZ2Uoc3RhY2spLmZpcnN0KHt5Om9wdGlvbnMuaGVpZ2h0ICsgYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIGhlaWdodDowfSkubGFzdCh7eTowLCBoZWlnaHQ6YmFyT3V0ZXJQYWRkaW5nT2xkIC0gYmFyUGFkZGluZ09sZCAvIDJ9KVxuICAgICAgICBfbWVyZ2VMYXllcnMobGF5ZXJLZXlzKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKHN0YWNrLCAoZCktPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIikuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje2lmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMn0pIHNjYWxlKDEsI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgI3tkLnl9KSBzY2FsZSgxLDEpXCIpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDJ9KSBzY2FsZSgxLDApXCIpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT5cbiAgICAgICAgICAgIGlmIF9tZXJnZS5wcmV2KGQua2V5KVxuICAgICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5wcmV2KGQua2V5KS5sYXllcnNbaWR4XS54ICsgX21lcmdlLnByZXYoZC5rZXkpLmxheWVyc1tpZHhdLndpZHRoIGVsc2UgeC5zY2FsZSgpKDApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGQueFxuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gaWYgX21lcmdlLnByZXYoZC5rZXkpIHRoZW4gMCBlbHNlIGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+XG4gICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuZGVsZXRlZFN1Y2MoZC5sYXllcktleSkpXG4gICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbaWR4XS54IGVsc2UgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ueCArIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbbGF5ZXJLZXlzLmxlbmd0aCAtIDFdLndpZHRoXG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdidWJibGUnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGJ1YmJsZUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgIyRsb2cuZGVidWcgJ2J1YmJsZUNoYXJ0IGxpbmtlZCdcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9pZCA9ICdidWJibGUnICsgYnViYmxlQ250cisrXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgZm9yIHNOYW1lLCBzY2FsZSBvZiBfc2NhbGVMaXN0XG4gICAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBzY2FsZS5heGlzTGFiZWwoKSwgdmFsdWU6IHNjYWxlLmZvcm1hdHRlZFZhbHVlKGRhdGEpLCBjb2xvcjogaWYgc05hbWUgaXMgJ2NvbG9yJyB0aGVuIHsnYmFja2dyb3VuZC1jb2xvcic6c2NhbGUubWFwKGRhdGEpfSBlbHNlIHVuZGVmaW5lZH0pXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplKSAtPlxuXG4gICAgICAgIGJ1YmJsZXMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYnViYmxlJykuZGF0YShkYXRhLCAoZCkgLT4gY29sb3IudmFsdWUoZCkpXG4gICAgICAgIGJ1YmJsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtYnViYmxlIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgIGJ1YmJsZXNcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3IubWFwKGQpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgICAgcjogIChkKSAtPiBzaXplLm1hcChkKVxuICAgICAgICAgICAgICBjeDogKGQpIC0+IHgubWFwKGQpXG4gICAgICAgICAgICAgIGN5OiAoZCkgLT4geS5tYXAoZClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICBidWJibGVzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InLCAnc2l6ZSddKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gIH1cblxuICAjVE9ETyB2ZXJpZnkgYW5kIHRlc3QgY3VzdG9tIHRvb2x0aXBzIGJlaGF2aW9yIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW4nLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZyktPlxuICBzQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgcmVzdHJpY3Q6ICdBJ1xuICByZXF1aXJlOiAnXmxheW91dCdcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICBfaWQgPSBcInNpbXBsZUNvbHVtbiN7c0JhckNudHIrK31cIlxuXG4gICAgY29sdW1ucyA9IG51bGxcbiAgICBfc2NhbGVMaXN0ID0ge31cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKVxuICAgIF9tZXJnZShbXSkua2V5KChkKSAtPiBkLmtleSlcbiAgICBpbml0aWFsID0gdHJ1ZVxuICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuXG4gICAgY29uZmlnID0ge31cbiAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuXG4gICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBfc2NhbGVMaXN0LmNvbG9yLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIHZhbHVlOiBfc2NhbGVMaXN0LnkuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogX3NjYWxlTGlzdC5jb2xvci5tYXAoZGF0YS5kYXRhKX19KVxuXG4gICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICBpZiBub3QgY29sdW1uc1xuICAgICAgICBjb2x1bW5zID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWNvbHVtbnMnKVxuICAgICAgIyRsb2cubG9nIFwicmVuZGVyaW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgYmFyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgIGJhck91dGVyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgIGxheW91dCA9IGRhdGEubWFwKChkKSAtPiB7ZGF0YTpkLCBrZXk6eC52YWx1ZShkKSwgeDp4Lm1hcChkKSwgeTpNYXRoLm1pbih5LnNjYWxlKCkoMCksIHkubWFwKGQpKSwgY29sb3I6Y29sb3IubWFwKGQpLCB3aWR0aDp4LnNjYWxlKCkucmFuZ2VCYW5kKHgudmFsdWUoZCkpLCBoZWlnaHQ6TWF0aC5hYnMoeS5zY2FsZSgpKDApIC0geS5tYXAoZCkpfSlcblxuICAgICAgX21lcmdlKGxheW91dCkuZmlyc3Qoe3g6MCwgd2lkdGg6MH0pLmxhc3Qoe3g6b3B0aW9ucy53aWR0aCArIGJhclBhZGRpbmcvMiAtIGJhck91dGVyUGFkZGluZ09sZCwgd2lkdGg6IGJhck91dGVyUGFkZGluZ30pXG5cblxuICAgICAgY29sdW1ucyA9IGNvbHVtbnMuZGF0YShsYXlvdXQsIChkKSAtPiBkLmtleSlcblxuICAgICAgZW50ZXIgPSBjb2x1bW5zLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1jb2x1bW5zIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsaSkgLT4gXCJ0cmFuc2xhdGUoI3tpZiBpbml0aWFsIHRoZW4gZC54IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS54ICArIF9tZXJnZS5hZGRlZFByZWQoZCkud2lkdGggKyBpZiBpIHRoZW4gYmFyUGFkZGluZ09sZCAvIDIgZWxzZSBiYXJPdXRlclBhZGRpbmdPbGR9LCN7ZC55fSkgc2NhbGUoI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9LDEpXCIpXG4gICAgICBlbnRlci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgLnN0eWxlKCdmaWxsJywoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICBlbnRlci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLndpZHRoIC8gMilcbiAgICAgICAgLmF0dHIoJ3knLCAtMjApXG4gICAgICAgIC5hdHRyKHtkeTogJzFlbScsICd0ZXh0LWFuY2hvcic6J21pZGRsZSd9KVxuICAgICAgICAuc3R5bGUoeydmb250LXNpemUnOicxLjNlbScsIG9wYWNpdHk6IDB9KVxuXG4gICAgICBjb2x1bW5zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tkLnh9LCAje2QueX0pIHNjYWxlKDEsMSlcIilcbiAgICAgIGNvbHVtbnMuc2VsZWN0KCdyZWN0JykudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICBjb2x1bW5zLnNlbGVjdCgndGV4dCcpXG4gICAgICAgIC50ZXh0KChkKSAtPiB5LmZvcm1hdHRlZFZhbHVlKGQuZGF0YSkpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaG9zdC5zaG93TGFiZWxzKCkgdGhlbiAxIGVsc2UgMClcblxuICAgICAgY29sdW1ucy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueCAtIGJhclBhZGRpbmcgLyAyfSwje2QueX0pIHNjYWxlKDAsMSlcIilcbiAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgIGluaXRpYWwgPSBmYWxzZVxuICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnbWF4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgX3NjYWxlTGlzdC54LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICBhdHRycy4kb2JzZXJ2ZSAnbGFiZWxzJywgKHZhbCkgLT5cbiAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgIGhvc3Quc2hvd0xhYmVscyhmYWxzZSlcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJyBvciB2YWwgaXMgXCJcIlxuICAgICAgICBob3N0LnNob3dMYWJlbHModHJ1ZSlcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5DbHVzdGVyZWQnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZyktPlxuXG4gIGNsdXN0ZXJlZEJhckNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIF9pZCA9IFwiY2x1c3RlcmVkQ29sdW1uI3tjbHVzdGVyZWRCYXJDbnRyKyt9XCJcblxuICAgICAgbGF5ZXJzID0gbnVsbFxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgICAgX21lcmdlTGF5ZXJzID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmxheWVyS2V5KVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuXG4gICAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmluZm8gXCJyZW5kZXJpbmcgY2x1c3RlcmVkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICAjIG1hcCBkYXRhIHRvIHRoZSByaWdodCBmb3JtYXQgZm9yIHJlbmRlcmluZ1xuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIGNsdXN0ZXJYID0gZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbih5LmxheWVyS2V5cyhkYXRhKSkucmFuZ2VCYW5kcyhbMCx4LnNjYWxlKCkucmFuZ2VCYW5kKCldLCAwLCAwKVxuXG4gICAgICAgIGNsdXN0ZXIgPSBkYXRhLm1hcCgoZCkgLT4gbCA9IHtcbiAgICAgICAgICBrZXk6eC52YWx1ZShkKSwgZGF0YTpkLCB4OngubWFwKGQpLCB3aWR0aDogeC5zY2FsZSgpLnJhbmdlQmFuZCh4LnZhbHVlKGQpKVxuICAgICAgICAgIGxheWVyczogbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2xheWVyS2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBrZXk6eC52YWx1ZShkKSwgdmFsdWU6IGRba10sIHg6Y2x1c3RlclgoayksIHk6IHkuc2NhbGUoKShkW2tdKSwgaGVpZ2h0Onkuc2NhbGUoKSgwKSAtIHkuc2NhbGUoKShkW2tdKSwgd2lkdGg6Y2x1c3RlclgucmFuZ2VCYW5kKGspfSl9XG4gICAgICAgIClcblxuICAgICAgICBfbWVyZ2UoY2x1c3RlcikuZmlyc3Qoe3g6YmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOjB9KVxuICAgICAgICBfbWVyZ2VMYXllcnMoY2x1c3RlclswXS5sYXllcnMpLmZpcnN0KHt4OjAsIHdpZHRoOjB9KS5sYXN0KHt4OmNsdXN0ZXJbMF0ud2lkdGgsIHdpZHRoOjB9KVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVycy5kYXRhKGNsdXN0ZXIsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYXllcicpLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiBpbml0aWFsIHRoZW4gZC54IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS54ICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aCArIGJhclBhZGRpbmdPbGQgLyAyfSwwKSBzY2FsZSgje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0sIDEpXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2QueH0sMCkgc2NhbGUoMSwxKVwiKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnggLSBiYXJQYWRkaW5nIC8gMn0sIDApIHNjYWxlKDAsMSlcIilcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGJhcnMgPSBsYXllcnMuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAuZGF0YShcbiAgICAgICAgICAgIChkKSAtPiBkLmxheWVyc1xuICAgICAgICAgICwgKGQpIC0+IGQubGF5ZXJLZXkgKyAnfCcgKyBkLmtleVxuICAgICAgICAgIClcblxuICAgICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQpLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPmlmIGluaXRpYWwgdGhlbiBkLndpZHRoIGVsc2UgMClcblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC5sYXllcktleSkpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGQueClcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBNYXRoLm1pbih5LnNjYWxlKCkoMCksIGQueSkpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBNYXRoLmFicyhkLmhlaWdodCkpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywwKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkKS54KVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGluaXRpYWwgPSBmYWxzZVxuICAgICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgZHJhd1xuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgICAgX3NjYWxlTGlzdC54LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuXG5cbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5TdGFja2VkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpIC0+XG5cbiAgc3RhY2tlZENvbHVtbkNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgU3RhY2tlZCBiYXInXG5cbiAgICAgIF9pZCA9IFwic3RhY2tlZENvbHVtbiN7c3RhY2tlZENvbHVtbkNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIHN0YWNrID0gW11cbiAgICAgIF90b29sdGlwID0gKCktPlxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKFwiLmxheWVyXCIpXG4gICAgICAgICMkbG9nLmRlYnVnIFwiZHJhd2luZyBzdGFja2VkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHN0YWNrID0gW11cbiAgICAgICAgZm9yIGQgaW4gZGF0YVxuICAgICAgICAgIHkwID0gMFxuICAgICAgICAgIGwgPSB7a2V5OngudmFsdWUoZCksIGxheWVyczpbXSwgZGF0YTpkLCB4OngubWFwKGQpLCB3aWR0aDppZiB4LnNjYWxlKCkucmFuZ2VCYW5kIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIGVsc2UgMX1cbiAgICAgICAgICBpZiBsLnggaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgIGwubGF5ZXJzID0gbGF5ZXJLZXlzLm1hcCgoaykgLT5cbiAgICAgICAgICAgICAgbGF5ZXIgPSB7bGF5ZXJLZXk6aywga2V5Omwua2V5LCB2YWx1ZTpkW2tdLCBoZWlnaHQ6ICB5LnNjYWxlKCkoMCkgLSB5LnNjYWxlKCkoK2Rba10pLCB3aWR0aDogKGlmIHguc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxKSwgeTogeS5zY2FsZSgpKCt5MCArICtkW2tdKSwgY29sb3I6IGNvbG9yLnNjYWxlKCkoayl9XG4gICAgICAgICAgICAgIHkwICs9ICtkW2tdXG4gICAgICAgICAgICAgIHJldHVybiBsYXllclxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgc3RhY2sucHVzaChsKVxuXG4gICAgICAgIF9tZXJnZShzdGFjaykuZmlyc3Qoe3g6IGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nLCB3aWR0aDowfSkubGFzdCh7eDpvcHRpb25zLndpZHRoICsgYmFyUGFkZGluZy8yIC0gYmFyT3V0ZXJQYWRkaW5nT2xkLCB3aWR0aDowfSlcbiAgICAgICAgX21lcmdlTGF5ZXJzKGxheWVyS2V5cylcblxuICAgICAgICBsYXllcnMgPSBsYXllcnNcbiAgICAgICAgICAuZGF0YShzdGFjaywgKGQpLT4gZC5rZXkpXG5cbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiBpbml0aWFsIHRoZW4gZC54IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS54ICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aCArIGJhclBhZGRpbmdPbGQgLyAyfSwwKSBzY2FsZSgje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0sIDEpXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JyxpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwwKSBzY2FsZSgxLDEpXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnggLSBiYXJQYWRkaW5nIC8gMn0sIDApIHNjYWxlKDAsMSlcIilcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGJhcnMgPSBsYXllcnMuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAuZGF0YShcbiAgICAgICAgICAgIChkKSAtPiBkLmxheWVyc1xuICAgICAgICAgICwgKGQpIC0+IGQubGF5ZXJLZXkgKyAnfCcgKyBkLmtleVxuICAgICAgICAgIClcblxuICAgICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+XG4gICAgICAgICAgICBpZiBfbWVyZ2UucHJldihkLmtleSlcbiAgICAgICAgICAgICAgaWR4ID0gbGF5ZXJLZXlzLmluZGV4T2YoX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkLmxheWVyS2V5KSlcbiAgICAgICAgICAgICAgaWYgaWR4ID49IDAgdGhlbiBfbWVyZ2UucHJldihkLmtleSkubGF5ZXJzW2lkeF0ueSBlbHNlIHkuc2NhbGUoKSgwKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBkLnlcbiAgICAgICAgICApXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLDApXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT5cbiAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkLmxheWVyS2V5KSlcbiAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tpZHhdLnkgKyBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2lkeF0uaGVpZ2h0IGVsc2UgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ueVxuICAgICAgICAgIClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdnYXVnZScsICgkbG9nLCB1dGlscykgLT5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG4gICAgY29udHJvbGxlcjogKCRzY29wZSwgJGF0dHJzKSAtPlxuICAgICAgbWUgPSB7Y2hhcnRUeXBlOiAnR2F1Z2VDaGFydCcsIGlkOnV0aWxzLmdldElkKCl9XG4gICAgICAkYXR0cnMuJHNldCgnY2hhcnQtaWQnLCBtZS5pZClcbiAgICAgIHJldHVybiBtZVxuICAgIFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGluaXRhbFNob3cgPSB0cnVlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAkbG9nLmluZm8gJ2RyYXdpbmcgR2F1Z2UgQ2hhcnQnXG5cbiAgICAgICAgZGF0ID0gW2RhdGFdXG5cbiAgICAgICAgeURvbWFpbiA9IHkuc2NhbGUoKS5kb21haW4oKVxuICAgICAgICBjb2xvckRvbWFpbiA9IGFuZ3VsYXIuY29weShjb2xvci5zY2FsZSgpLmRvbWFpbigpKVxuICAgICAgICBjb2xvckRvbWFpbi51bnNoaWZ0KHlEb21haW5bMF0pXG4gICAgICAgIGNvbG9yRG9tYWluLnB1c2goeURvbWFpblsxXSlcbiAgICAgICAgcmFuZ2VzID0gW11cbiAgICAgICAgZm9yIGkgaW4gWzEuLmNvbG9yRG9tYWluLmxlbmd0aC0xXVxuICAgICAgICAgIHJhbmdlcy5wdXNoIHtmcm9tOitjb2xvckRvbWFpbltpLTFdLHRvOitjb2xvckRvbWFpbltpXX1cblxuICAgICAgICAjZHJhdyBjb2xvciBzY2FsZVxuXG4gICAgICAgIGJhciA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICBiYXIgPSBiYXIuZGF0YShyYW5nZXMsIChkLCBpKSAtPiBpKVxuICAgICAgICBpZiBpbml0YWxTaG93XG4gICAgICAgICAgYmFyLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMCkuYXR0cignd2lkdGgnLCA1MClcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiYXIuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKS5hdHRyKCd3aWR0aCcsIDUwKVxuXG4gICAgICAgIGJhci50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4geS5zY2FsZSgpKDApIC0geS5zY2FsZSgpKGQudG8gLSBkLmZyb20pKVxuICAgICAgICAgIC5hdHRyKCd5JywoZCkgLT4geS5zY2FsZSgpKGQudG8pKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5zY2FsZSgpKGQuZnJvbSkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBiYXIuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgIyBkcmF3IHZhbHVlXG5cbiAgICAgICAgYWRkTWFya2VyID0gKHMpIC0+XG4gICAgICAgICAgcy5hcHBlbmQoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIDU1KS5hdHRyKCdoZWlnaHQnLCA0KS5zdHlsZSgnZmlsbCcsICdibGFjaycpXG4gICAgICAgICAgcy5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ3InLCAxMCkuYXR0cignY3gnLCA2NSkuYXR0cignY3knLDIpLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuXG4gICAgICAgIG1hcmtlciA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKVxuICAgICAgICBtYXJrZXIgPSBtYXJrZXIuZGF0YShkYXQsIChkKSAtPiAnd2stY2hhcnQtbWFya2VyJylcbiAgICAgICAgbWFya2VyLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1tYXJrZXInKS5jYWxsKGFkZE1hcmtlcilcblxuICAgICAgICBpZiBpbml0YWxTaG93XG4gICAgICAgICAgbWFya2VyLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7eS5zY2FsZSgpKGQudmFsdWUpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAwKVxuXG4gICAgICAgIG1hcmtlclxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje3kuc2NhbGUoKShkLnZhbHVlKX0pXCIpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBjb2xvci5zY2FsZSgpKGQudmFsdWUpKS5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgaW5pdGFsU2hvdyA9IGZhbHNlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgdGhpcy5yZXF1aXJlZFNjYWxlcyhbJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ2NvbG9yJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gIH1cblxuICAjdG9kbyByZWZlY3RvciIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnZ2VvTWFwJywgKCRsb2csIHV0aWxzKSAtPlxuICBtYXBDbnRyID0gMFxuXG4gIHBhcnNlTGlzdCA9ICh2YWwpIC0+XG4gICAgaWYgdmFsXG4gICAgICBsID0gdmFsLnRyaW0oKS5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpLnNwbGl0KCcsJykubWFwKChkKSAtPiBkLnJlcGxhY2UoL15bXFxcInwnXXxbXFxcInwnXSQvZywgJycpKVxuICAgICAgbCA9IGwubWFwKChkKSAtPiBpZiBpc05hTihkKSB0aGVuIGQgZWxzZSArZClcbiAgICAgIHJldHVybiBpZiBsLmxlbmd0aCBpcyAxIHRoZW4gcmV0dXJuIGxbMF0gZWxzZSBsXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBzY29wZToge1xuICAgICAgZ2VvanNvbjogJz0nXG4gICAgICBwcm9qZWN0aW9uOiAnPSdcbiAgICB9XG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9pZCA9ICdnZW9NYXAnICsgbWFwQ250cisrXG4gICAgICBfZGF0YU1hcHBpbmcgPSBkMy5tYXAoKVxuXG4gICAgICBfc2NhbGUgPSAxXG4gICAgICBfcm90YXRlID0gWzAsMF1cbiAgICAgIF9pZFByb3AgPSAnJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuXG4gICAgICAgIHZhbCA9IF9kYXRhTWFwcGluZy5nZXQoZGF0YS5wcm9wZXJ0aWVzW19pZFByb3BbMF1dKVxuICAgICAgICBAbGF5ZXJzLnB1c2goe25hbWU6dmFsLlJTLCB2YWx1ZTp2YWwuREVTfSlcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBwYXRoU2VsID0gW11cblxuICAgICAgX3Byb2plY3Rpb24gPSBkMy5nZW8ub3J0aG9ncmFwaGljKClcbiAgICAgIF93aWR0aCA9IDBcbiAgICAgIF9oZWlnaHQgPSAwXG4gICAgICBfcGF0aCA9IHVuZGVmaW5lZFxuICAgICAgX3pvb20gPSBkMy5nZW8uem9vbSgpXG4gICAgICAgIC5wcm9qZWN0aW9uKF9wcm9qZWN0aW9uKVxuICAgICAgICAjLnNjYWxlRXh0ZW50KFtwcm9qZWN0aW9uLnNjYWxlKCkgKiAuNywgcHJvamVjdGlvbi5zY2FsZSgpICogMTBdKVxuICAgICAgICAub24gXCJ6b29tLnJlZHJhd1wiLCAoKSAtPlxuICAgICAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgcGF0aFNlbC5hdHRyKFwiZFwiLCBfcGF0aCk7XG5cbiAgICAgIF9nZW9Kc29uID0gdW5kZWZpbmVkXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIF93aWR0aCA9IG9wdGlvbnMud2lkdGhcbiAgICAgICAgX2hlaWdodCA9IG9wdGlvbnMuaGVpZ2h0XG4gICAgICAgIGlmIGRhdGEgYW5kIGRhdGFbMF0uaGFzT3duUHJvcGVydHkoX2lkUHJvcFsxXSlcbiAgICAgICAgICBmb3IgZSBpbiBkYXRhXG4gICAgICAgICAgICBfZGF0YU1hcHBpbmcuc2V0KGVbX2lkUHJvcFsxXV0sIGUpXG5cbiAgICAgICAgaWYgX2dlb0pzb25cblxuICAgICAgICAgIF9wcm9qZWN0aW9uLnRyYW5zbGF0ZShbX3dpZHRoLzIsIF9oZWlnaHQvMl0pXG4gICAgICAgICAgcGF0aFNlbCA9IHRoaXMuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKF9nZW9Kc29uLmZlYXR1cmVzLCAoZCkgLT4gZC5wcm9wZXJ0aWVzW19pZFByb3BbMF1dKVxuICAgICAgICAgIHBhdGhTZWxcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInN2ZzpwYXRoXCIpXG4gICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsJ2xpZ2h0Z3JleScpLnN0eWxlKCdzdHJva2UnLCAnZGFya2dyZXknKVxuICAgICAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgICAgICAgIC5jYWxsKF96b29tKVxuXG4gICAgICAgICAgcGF0aFNlbFxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIF9wYXRoKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+XG4gICAgICAgICAgICAgIHZhbCA9IF9kYXRhTWFwcGluZy5nZXQoZC5wcm9wZXJ0aWVzW19pZFByb3BbMF1dKVxuICAgICAgICAgICAgICBjb2xvci5tYXAodmFsKVxuICAgICAgICAgIClcblxuICAgICAgICAgIHBhdGhTZWwuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsnY29sb3InXSlcbiAgICAgICAgX3NjYWxlTGlzdC5jb2xvci5yZXNldE9uTmV3RGF0YSh0cnVlKVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBfdG9vbHRpcCA9IGxheW91dC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgICMgR2VvTWFwIHNwZWNpZmljIHByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY29wZS4kd2F0Y2ggJ3Byb2plY3Rpb24nLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAkbG9nLmxvZyAnc2V0dGluZyBQcm9qZWN0aW9uIHBhcmFtcycsIHZhbFxuICAgICAgICAgIGlmIGQzLmdlby5oYXNPd25Qcm9wZXJ0eSh2YWwucHJvamVjdGlvbilcbiAgICAgICAgICAgIF9wcm9qZWN0aW9uID0gZDMuZ2VvW3ZhbC5wcm9qZWN0aW9uXSgpXG4gICAgICAgICAgICBfcHJvamVjdGlvbi5jZW50ZXIodmFsLmNlbnRlcikuc2NhbGUodmFsLnNjYWxlKS5yb3RhdGUodmFsLnJvdGF0ZSkuY2xpcEFuZ2xlKHZhbC5jbGlwQW5nbGUpXG4gICAgICAgICAgICBfaWRQcm9wID0gdmFsLmlkTWFwXG4gICAgICAgICAgICBpZiBfcHJvamVjdGlvbi5wYXJhbGxlbHNcbiAgICAgICAgICAgICAgX3Byb2plY3Rpb24ucGFyYWxsZWxzKHZhbC5wYXJhbGxlbHMpXG4gICAgICAgICAgICBfc2NhbGUgPSBfcHJvamVjdGlvbi5zY2FsZSgpXG4gICAgICAgICAgICBfcm90YXRlID0gX3Byb2plY3Rpb24ucm90YXRlKClcbiAgICAgICAgICAgIF9wYXRoID0gZDMuZ2VvLnBhdGgoKS5wcm9qZWN0aW9uKF9wcm9qZWN0aW9uKVxuICAgICAgICAgICAgX3pvb20ucHJvamVjdGlvbihfcHJvamVjdGlvbilcblxuICAgICAgICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICAgICwgdHJ1ZSAjZGVlcCB3YXRjaFxuXG4gICAgICBzY29wZS4kd2F0Y2ggJ2dlb2pzb24nLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWQgYW5kIHZhbCBpc250ICcnXG4gICAgICAgICAgX2dlb0pzb24gPSB2YWxcbiAgICAgICAgICBsYXlvdXQubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuXG4gIH1cblxuICAjVE9ETyByZS10ZXN0IGFuZCB2ZXJpZnkgaW4gbmV3IGFwcGxpY2FpdG9uLiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sdW1uSGlzdG9ncmFtJywgKCRsb2csIGJhckNvbmZpZywgdXRpbHMpIC0+XG5cbiAgc0hpc3RvQ250ciA9IDBcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBfaWQgPSBcImhpc3RvZ3JhbSN7c0hpc3RvQ250cisrfVwiXG5cbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgYnVja2V0cyA9IHVuZGVmaW5lZFxuICAgICAgbGFiZWxzID0gdW5kZWZpbmVkXG4gICAgICBjb25maWcgPSB7fVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpLT4gZC54VmFsKVxuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QucmFuZ2VYLmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3QueS5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplLCBzaGFwZSwgcmFuZ2VYKSAtPlxuXG4gICAgICAgIGlmIHJhbmdlWC51cHBlclByb3BlcnR5KClcbiAgICAgICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCkgLT4ge3g6cmFuZ2VYLnNjYWxlKCkocmFuZ2VYLmxvd2VyVmFsdWUoZCkpLCB4VmFsOnJhbmdlWC5sb3dlclZhbHVlKGQpLCB3aWR0aDpyYW5nZVguc2NhbGUoKShyYW5nZVgudXBwZXJWYWx1ZShkKSkgLSByYW5nZVguc2NhbGUoKShyYW5nZVgubG93ZXJWYWx1ZShkKSksIHk6eS5tYXAoZCksIGhlaWdodDpvcHRpb25zLmhlaWdodCAtIHkubWFwKGQpLCBjb2xvcjpjb2xvci5tYXAoZCksIGRhdGE6ZH0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBkYXRhLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHN0YXJ0ID0gcmFuZ2VYLmxvd2VyVmFsdWUoZGF0YVswXSlcbiAgICAgICAgICAgIHN0ZXAgPSByYW5nZVgubG93ZXJWYWx1ZShkYXRhWzFdKSAtIHN0YXJ0XG4gICAgICAgICAgICB3aWR0aCA9IG9wdGlvbnMud2lkdGggLyBkYXRhLmxlbmd0aFxuICAgICAgICAgICAgbGF5b3V0ID0gZGF0YS5tYXAoKGQsIGkpIC0+IHt4OnJhbmdlWC5zY2FsZSgpKHN0YXJ0ICsgc3RlcCAqIGkpLCB4VmFsOnJhbmdlWC5sb3dlclZhbHVlKGQpLCB3aWR0aDp3aWR0aCwgeTp5Lm1hcChkKSwgaGVpZ2h0Om9wdGlvbnMuaGVpZ2h0IC0geS5tYXAoZCksIGNvbG9yOmNvbG9yLm1hcChkKSwgZGF0YTpkfSlcblxuICAgICAgICBfbWVyZ2UobGF5b3V0KS5maXJzdCh7eDowLCB3aWR0aDowfSkubGFzdCh7eDpvcHRpb25zLndpZHRoLCB3aWR0aDogMH0pXG5cbiAgICAgICAgaWYgbm90IGJ1Y2tldHNcbiAgICAgICAgICBidWNrZXRzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJ1Y2tldCcpXG5cbiAgICAgICAgYnVja2V0cyA9IGJ1Y2tldHMuZGF0YShsYXlvdXQsIChkKSAtPiBkLnhWYWwpXG5cbiAgICAgICAgZW50ZXIgPSBidWNrZXRzLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1idWNrZXQgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aH0sI3tkLnl9KSBzY2FsZSgje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0sMSlcIilcbiAgICAgICAgZW50ZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICBlbnRlci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGQud2lkdGggLyAyKVxuICAgICAgICAgIC5hdHRyKCd5JywgLTIwKVxuICAgICAgICAgIC5hdHRyKHtkeTogJzFlbScsICd0ZXh0LWFuY2hvcic6J21pZGRsZSd9KVxuICAgICAgICAgIC5zdHlsZSh7J2ZvbnQtc2l6ZSc6JzEuM2VtJywgb3BhY2l0eTogMH0pXG5cbiAgICAgICAgYnVja2V0cy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tkLnh9LCAje2QueX0pIHNjYWxlKDEsMSlcIilcbiAgICAgICAgYnVja2V0cy5zZWxlY3QoJ3JlY3QnKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgICBidWNrZXRzLnNlbGVjdCgndGV4dCcpXG4gICAgICAgICAgLnRleHQoKGQpIC0+IHkuZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBob3N0LnNob3dMYWJlbHMoKSB0aGVuIDEgZWxzZSAwKVxuXG4gICAgICAgIGJ1Y2tldHMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueH0sI3tkLnl9KSBzY2FsZSgwLDEpXCIpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3JhbmdlWCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnbWF4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3JhbmdlWCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnNjYWxlVHlwZSgnbGluZWFyJykuZG9tYWluQ2FsYygncmFuZ2VFeHRlbnQnKVxuICAgICAgICBAZ2V0S2luZCgnY29sb3InKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGhvc3Quc2hvd0xhYmVscyhmYWxzZSlcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgICAgaG9zdC5zaG93TGFiZWxzKHRydWUpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9uc1xuI1RPRE8gdGVzdCBzZWxlY3Rpb24gYmVoYXZpb3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2xpbmUnLCAoJGxvZywgYmVoYXZpb3IsIHV0aWxzLCB0aW1pbmcpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIF9sYXllcktleXMgPSBbXVxuICAgICAgX2xheW91dCA9IFtdXG4gICAgICBfZGF0YU9sZCA9IFtdXG4gICAgICBfcGF0aFZhbHVlc09sZCA9IFtdXG4gICAgICBfcGF0aFZhbHVlc05ldyA9IFtdXG4gICAgICBfcGF0aEFycmF5ID0gW11cbiAgICAgIF9pbml0aWFsT3BhY2l0eSA9IDBcblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIF9pZCA9ICdsaW5lJyArIGxpbmVDbnRyKytcbiAgICAgIGxpbmUgPSB1bmRlZmluZWRcbiAgICAgIG1hcmtlcnMgPSB1bmRlZmluZWRcblxuICAgICAgYnJ1c2hMaW5lID0gdW5kZWZpbmVkXG5cblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoaWR4KSAtPlxuICAgICAgICBfcGF0aEFycmF5ID0gXy50b0FycmF5KF9wYXRoVmFsdWVzTmV3KVxuICAgICAgICB0dE1vdmVEYXRhLmFwcGx5KHRoaXMsIFtpZHhdKVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBfcGF0aEFycmF5Lm1hcCgobCkgLT4ge25hbWU6bFtpZHhdLmtleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGxbaWR4XS55KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbFtpZHhdLmNvbG9yfSwgeHY6bFtpZHhdLnh2fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKHR0TGF5ZXJzWzBdLnh2KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKF9wYXRoQXJyYXksIChkKSAtPiBkW2lkeF0ua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLFwid2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKVxuICAgICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZFtpZHhdLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N5JywgKGQpIC0+IGRbaWR4XS55KVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19zY2FsZUxpc3QueC5zY2FsZSgpKF9wYXRoQXJyYXlbMF1baWR4XS54dikgKyBvZmZzZXR9KVwiKVxuXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgICBtZXJnZWRYID0gdXRpbHMubWVyZ2VTZXJpZXMoeC52YWx1ZShfZGF0YU9sZCksIHgudmFsdWUoZGF0YSkpXG4gICAgICAgIF9sYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBfbGF5b3V0ID0gW11cblxuICAgICAgICBfcGF0aFZhbHVlc05ldyA9IHt9XG5cbiAgICAgICAgZm9yIGtleSBpbiBfbGF5ZXJLZXlzXG4gICAgICAgICAgX3BhdGhWYWx1ZXNOZXdba2V5XSA9IGRhdGEubWFwKChkKS0+IHt4OngubWFwKGQpLHk6eS5zY2FsZSgpKHkubGF5ZXJWYWx1ZShkLCBrZXkpKSwgeHY6eC52YWx1ZShkKSwgeXY6eS5sYXllclZhbHVlKGQsa2V5KSwga2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCBkYXRhOmR9KVxuXG4gICAgICAgICAgbGF5ZXIgPSB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpbXX1cbiAgICAgICAgICAjIGZpbmQgc3RhcnRpbmcgdmFsdWUgZm9yIG9sZFxuICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFgubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRYW2ldWzBdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG9sZExhc3QgPSBfcGF0aFZhbHVlc09sZFtrZXldW21lcmdlZFhbaV1bMF1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIHdoaWxlIGkgPCBtZXJnZWRYLmxlbmd0aFxuICAgICAgICAgICAgaWYgbWVyZ2VkWFtpXVsxXSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICBuZXdMYXN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVttZXJnZWRYW2ldWzFdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICBmb3IgdmFsLCBpIGluIG1lcmdlZFhcbiAgICAgICAgICAgIHYgPSB7Y29sb3I6bGF5ZXIuY29sb3IsIHg6dmFsWzJdfVxuICAgICAgICAgICAgIyBzZXQgeCBhbmQgeSB2YWx1ZXMgZm9yIG9sZCB2YWx1ZXMuIElmIHRoZXJlIGlzIGEgYWRkZWQgdmFsdWUsIG1haW50YWluIHRoZSBsYXN0IHZhbGlkIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiB2YWxbMV0gaXMgdW5kZWZpbmVkICNpZSBhbiBvbGQgdmFsdWUgaXMgZGVsZXRlZCwgbWFpbnRhaW4gdGhlIGxhc3QgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IG5ld0xhc3QueCAjIGFuaW1hdGUgdG8gdGhlIHByZWRlc2Vzc29ycyBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi5kZWxldGVkID0gdHJ1ZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2LnlOZXcgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV0ueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV0ueFxuICAgICAgICAgICAgICBuZXdMYXN0ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIF9kYXRhT2xkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgaWYgIHZhbFswXSBpcyB1bmRlZmluZWQgIyBpZSBhIG5ldyB2YWx1ZSBoYXMgYmVlbiBhZGRlZFxuICAgICAgICAgICAgICAgIHYueU9sZCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgICAgdi54T2xkID0gb2xkTGFzdC54ICMgc3RhcnQgeC1hbmltYXRpb24gZnJvbSB0aGUgcHJlZGVjZXNzb3JzIG9sZCBwb3NpdGlvblxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueFxuICAgICAgICAgICAgICAgIG9sZExhc3QgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdi54T2xkID0gdi54TmV3XG4gICAgICAgICAgICAgIHYueU9sZCA9IHYueU5ld1xuXG5cbiAgICAgICAgICAgIGxheWVyLnZhbHVlLnB1c2godilcblxuICAgICAgICAgIF9sYXlvdXQucHVzaChsYXllcilcblxuICAgICAgICBvZmZzZXQgPSBpZiB4LmlzT3JkaW5hbCgpIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBtYXJrZXJzID0gKGxheWVyLCBkdXJhdGlvbikgLT5cbiAgICAgICAgICBpZiBfc2hvd01hcmtlcnNcbiAgICAgICAgICAgIG0gPSBsYXllci5zZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKS5kYXRhKFxuICAgICAgICAgICAgICAgIChsKSAtPiBsLnZhbHVlXG4gICAgICAgICAgICAgICwgKGQpIC0+IGQueFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgbS5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1tYXJrZXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgICAgIC5hdHRyKCdyJywgNSlcbiAgICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICAgICAgICAjLnN0eWxlKCdvcGFjaXR5JywgX2luaXRpYWxPcGFjaXR5KVxuICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAgIG1cbiAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpIC0+IGQueU9sZClcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpIC0+IGQueE9sZCArIG9mZnNldClcbiAgICAgICAgICAgICAgLmNsYXNzZWQoJ3drLWNoYXJ0LWRlbGV0ZWQnLChkKSAtPiBkLmRlbGV0ZWQpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgLT4gZC55TmV3KVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgLT4gZC54TmV3ICsgb2Zmc2V0KVxuICAgICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoZCkgLT4gaWYgZC5kZWxldGVkIHRoZW4gMCBlbHNlIDEpXG5cbiAgICAgICAgICAgIG0uZXhpdCgpXG4gICAgICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGF5ZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtbWFya2VyJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsIDApLnJlbW92ZSgpXG5cbiAgICAgICAgbGluZU9sZCA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAueCgoZCkgLT4gZC54T2xkKVxuICAgICAgICAgIC55KChkKSAtPiBkLnlPbGQpXG5cbiAgICAgICAgbGluZU5ldyA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAueCgoZCkgLT4gZC54TmV3KVxuICAgICAgICAgIC55KChkKSAtPiBkLnlOZXcpXG5cbiAgICAgICAgYnJ1c2hMaW5lID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgICAueSgoZCkgLT4gZC55TmV3KVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBlbnRlciA9IGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKVxuICAgICAgICBlbnRlci5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmVOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgX2luaXRpYWxPcGFjaXR5KVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG5cbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29mZnNldH0pXCIpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZU9sZChkLnZhbHVlKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZU5ldyhkLnZhbHVlKSlcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgbGF5ZXJzLmNhbGwobWFya2Vycywgb3B0aW9ucy5kdXJhdGlvbilcblxuICAgICAgICBfaW5pdGlhbE9wYWNpdHkgPSAwXG4gICAgICAgIF9kYXRhT2xkID0gZGF0YVxuICAgICAgICBfcGF0aFZhbHVlc09sZCA9IF9wYXRoVmFsdWVzTmV3XG5cbiAgICAgIGJydXNoID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1saW5lXCIpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYnJ1c2hMaW5lKGQudmFsdWUpKVxuICAgICAgICBsYXllcnMuY2FsbChtYXJrZXJzLCAwKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC54KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGJydXNoXG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsaW5lVmVydGljYWwnLCAoJGxvZykgLT5cbiAgbGluZUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgcy1saW5lJ1xuICAgICAgbGF5ZXJLZXlzID0gW11cbiAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIF9pZCA9ICdsaW5lJyArIGxpbmVDbnRyKytcblxuICAgICAgcHJlcERhdGEgPSAoeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICNsYXllcktleXMgPSB5LmxheWVyS2V5cyhAKVxuICAgICAgICAjX2xheW91dCA9IGxheWVyS2V5cy5tYXAoKGtleSkgPT4ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6QG1hcCgoZCktPiB7eDp4LnZhbHVlKGQpLHk6eS5sYXllclZhbHVlKGQsIGtleSl9KX0pXG5cbiAgICAgIHR0RW50ZXIgPSAoaWR4LCBheGlzWCwgY250bnIpIC0+XG4gICAgICAgIGNudG5yU2VsID0gZDMuc2VsZWN0KGNudG5yKVxuICAgICAgICBjbnRucldpZHRoID0gY250bnJTZWwuYXR0cignd2lkdGgnKVxuICAgICAgICBwYXJlbnQgPSBkMy5zZWxlY3QoY250bnIucGFyZW50RWxlbWVudClcbiAgICAgICAgX3R0SGlnaGxpZ2h0ID0gcGFyZW50LmFwcGVuZCgnZycpXG4gICAgICAgIF90dEhpZ2hsaWdodC5hcHBlbmQoJ2xpbmUnKS5hdHRyKHt4MTowLCB4MjpjbnRucldpZHRofSkuc3R5bGUoeydwb2ludGVyLWV2ZW50cyc6J25vbmUnLCBzdHJva2U6J2xpZ2h0Z3JleScsICdzdHJva2Utd2lkdGgnOjF9KVxuICAgICAgICBfY2lyY2xlcyA9IF90dEhpZ2hsaWdodC5zZWxlY3RBbGwoJ2NpcmNsZScpLmRhdGEoX2xheW91dCwoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdyJywgNSkuYXR0cignZmlsbCcsIChkKS0+IGQuY29sb3IpLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIDAuNikuYXR0cignc3Ryb2tlJywgJ2JsYWNrJykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG5cbiAgICAgICAgX3R0SGlnaGxpZ2h0LmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tfc2NhbGVMaXN0Lnkuc2NhbGUoKShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueSkrb2Zmc2V0fSlcIilcblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX2xheW91dC5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobC52YWx1ZVtpZHhdLngpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKCdjaXJjbGUnKS5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3gnLCAoZCkgLT4gX3NjYWxlTGlzdC54LnNjYWxlKCkoZC52YWx1ZVtpZHhdLngpKVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7X3NjYWxlTGlzdC55LnNjYWxlKCkoX2xheW91dFswXS52YWx1ZVtpZHhdLnkpICsgb2Zmc2V0fSlcIilcblxuXG4gICAgICBzZXRUb29sdGlwID0gKHRvb2x0aXAsIG92ZXJsYXkpIC0+XG4gICAgICAgIF90b29sdGlwID0gdG9vbHRpcFxuICAgICAgICB0b29sdGlwKG92ZXJsYXkpXG4gICAgICAgIHRvb2x0aXAuaXNIb3Jpem9udGFsKHRydWUpXG4gICAgICAgIHRvb2x0aXAucmVmcmVzaE9uTW92ZSh0cnVlKVxuICAgICAgICB0b29sdGlwLm9uIFwibW92ZS4je19pZH1cIiwgdHRNb3ZlXG4gICAgICAgIHRvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuICAgICAgICB0b29sdGlwLm9uIFwibGVhdmUuI3tfaWR9XCIsIHR0TGVhdmVcblxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBfbGF5b3V0ID0gbGF5ZXJLZXlzLm1hcCgoa2V5KSA9PiB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpkYXRhLm1hcCgoZCktPiB7eTp5LnZhbHVlKGQpLHg6eC5sYXllclZhbHVlKGQsIGtleSl9KX0pXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgbGluZSA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAueCgoZCkgLT4geC5zY2FsZSgpKGQueCkpXG4gICAgICAgICAgLnkoKGQpIC0+IHkuc2NhbGUoKShkLnkpKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7b2Zmc2V0fSlcIilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lKGQudmFsdWUpKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSkuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LnkpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGVudGVyIC8gZXhpdCBhbmltYXRpb25zIGxpa2UgaW4gbGluZVxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3BpZScsICgkbG9nLCB1dGlscykgLT5cbiAgcGllQ250ciA9IDBcblxuICByZXR1cm4ge1xuICByZXN0cmljdDogJ0VBJ1xuICByZXF1aXJlOiAnXmxheW91dCdcbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAjIHNldCBjaGFydCBzcGVjaWZpYyBkZWZhdWx0c1xuXG4gICAgX2lkID0gXCJwaWUje3BpZUNudHIrK31cIlxuXG4gICAgaW5uZXIgPSB1bmRlZmluZWRcbiAgICBvdXRlciA9IHVuZGVmaW5lZFxuICAgIGxhYmVscyA9IHVuZGVmaW5lZFxuICAgIHBpZUJveCA9IHVuZGVmaW5lZFxuICAgIHBvbHlsaW5lID0gdW5kZWZpbmVkXG4gICAgX3NjYWxlTGlzdCA9IFtdXG4gICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICBfc2hvd0xhYmVscyA9IGZhbHNlXG5cbiAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC5jb2xvci5heGlzTGFiZWwoKVxuICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC5zaXplLmF4aXNMYWJlbCgpXG4gICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3Quc2l6ZS5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaW5pdGlhbFNob3cgPSB0cnVlXG5cbiAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplKSAtPlxuICAgICAgIyRsb2cuZGVidWcgJ2RyYXdpbmcgcGllIGNoYXJ0IHYyJ1xuXG4gICAgICByID0gTWF0aC5taW4ob3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHQpIC8gMlxuXG4gICAgICBpZiBub3QgcGllQm94XG4gICAgICAgIHBpZUJveD0gQGFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtcGllQm94JylcbiAgICAgIHBpZUJveC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29wdGlvbnMud2lkdGggLyAyfSwje29wdGlvbnMuaGVpZ2h0IC8gMn0pXCIpXG5cbiAgICAgIGlubmVyQXJjID0gZDMuc3ZnLmFyYygpXG4gICAgICAgIC5vdXRlclJhZGl1cyhyICogaWYgX3Nob3dMYWJlbHMgdGhlbiAwLjggZWxzZSAxKVxuICAgICAgICAuaW5uZXJSYWRpdXMoMClcblxuICAgICAgb3V0ZXJBcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgICAgLm91dGVyUmFkaXVzKHIgKiAwLjkpXG4gICAgICAgIC5pbm5lclJhZGl1cyhyICogMC45KVxuXG4gICAgICBrZXkgPSAoZCkgLT4gX3NjYWxlTGlzdC5jb2xvci52YWx1ZShkLmRhdGEpXG5cbiAgICAgIHBpZSA9IGQzLmxheW91dC5waWUoKVxuICAgICAgICAuc29ydChudWxsKVxuICAgICAgICAudmFsdWUoc2l6ZS52YWx1ZSlcblxuICAgICAgYXJjVHdlZW4gPSAoYSkgLT5cbiAgICAgICAgaSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGEpXG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSBpKDApXG4gICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICBpbm5lckFyYyhpKHQpKVxuXG4gICAgICBzZWdtZW50cyA9IHBpZShkYXRhKSAjIHBpZSBjb21wdXRlcyBmb3IgZWFjaCBzZWdtZW50IHRoZSBzdGFydCBhbmdsZSBhbmQgdGhlIGVuZCBhbmdsZVxuICAgICAgX21lcmdlLmtleShrZXkpXG4gICAgICBfbWVyZ2Uoc2VnbWVudHMpLmZpcnN0KHtzdGFydEFuZ2xlOjAsIGVuZEFuZ2xlOjB9KS5sYXN0KHtzdGFydEFuZ2xlOk1hdGguUEkgKiAyLCBlbmRBbmdsZTogTWF0aC5QSSAqIDJ9KVxuXG4gICAgICAjLS0tIERyYXcgUGllIHNlZ21lbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaWYgbm90IGlubmVyXG4gICAgICAgIGlubmVyID0gcGllQm94LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWlubmVyQXJjJylcblxuICAgICAgaW5uZXIgPSBpbm5lclxuICAgICAgICAuZGF0YShzZWdtZW50cyxrZXkpXG5cbiAgICAgIGlubmVyLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmVhY2goKGQpIC0+IHRoaXMuX2N1cnJlbnQgPSBpZiBpbml0aWFsU2hvdyB0aGVuIGQgZWxzZSB7c3RhcnRBbmdsZTpfbWVyZ2UuYWRkZWRQcmVkKGQpLmVuZEFuZ2xlLCBlbmRBbmdsZTpfbWVyZ2UuYWRkZWRQcmVkKGQpLmVuZEFuZ2xlfSlcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtaW5uZXJBcmMgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiAgY29sb3IubWFwKGQuZGF0YSkpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWxTaG93IHRoZW4gMCBlbHNlIDEpXG4gICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgaW5uZXJcbiAgICAgICAgIy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29wdGlvbnMud2lkdGggLyAyfSwje29wdGlvbnMuaGVpZ2h0IC8gMn0pXCIpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICAgIC5hdHRyVHdlZW4oJ2QnLGFyY1R3ZWVuKVxuXG4gICAgICBpbm5lci5leGl0KCkuZGF0dW0oKGQpIC0+ICB7c3RhcnRBbmdsZTpfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuc3RhcnRBbmdsZSwgZW5kQW5nbGU6X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnN0YXJ0QW5nbGV9KVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHJUd2VlbignZCcsYXJjVHdlZW4pXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICMtLS0gRHJhdyBTZWdtZW50IExhYmVsIFRleHQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBtaWRBbmdsZSA9IChkKSAtPiBkLnN0YXJ0QW5nbGUgKyAoZC5lbmRBbmdsZSAtIGQuc3RhcnRBbmdsZSkgLyAyXG5cbiAgICAgIGlmIF9zaG93TGFiZWxzXG5cbiAgICAgICAgbGFiZWxzID0gcGllQm94LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWxhYmVsJykuZGF0YShzZWdtZW50cywga2V5KVxuXG4gICAgICAgIGxhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWxhYmVsJylcbiAgICAgICAgICAuZWFjaCgoZCkgLT4gQF9jdXJyZW50ID0gZClcbiAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLjM1ZW1cIilcbiAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsJzEuM2VtJylcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC50ZXh0KChkKSAtPiBzaXplLmZvcm1hdHRlZFZhbHVlKGQuZGF0YSkpXG5cbiAgICAgICAgbGFiZWxzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgICAgICAuYXR0clR3ZWVuKCd0cmFuc2Zvcm0nLCAoZCkgLT5cbiAgICAgICAgICAgIF90aGlzID0gdGhpc1xuICAgICAgICAgICAgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZShfdGhpcy5fY3VycmVudCwgZClcbiAgICAgICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICAgICAgZDIgPSBpbnRlcnBvbGF0ZSh0KVxuICAgICAgICAgICAgICBfdGhpcy5fY3VycmVudCA9IGQyXG4gICAgICAgICAgICAgIHBvcyA9IG91dGVyQXJjLmNlbnRyb2lkKGQyKVxuICAgICAgICAgICAgICBwb3NbMF0gKz0gMTUgKiAoaWYgbWlkQW5nbGUoZDIpIDwgTWF0aC5QSSB0aGVuICAxIGVsc2UgLTEpXG4gICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZSgje3Bvc30pXCIpXG4gICAgICAgICAgLnN0eWxlVHdlZW4oJ3RleHQtYW5jaG9yJywgKGQpIC0+XG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKEBfY3VycmVudCwgZClcbiAgICAgICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICAgICAgZDIgPSBpbnRlcnBvbGF0ZSh0KVxuICAgICAgICAgICAgICByZXR1cm4gaWYgbWlkQW5nbGUoZDIpIDwgTWF0aC5QSSB0aGVuICBcInN0YXJ0XCIgZWxzZSBcImVuZFwiXG4gICAgICAgIClcblxuICAgICAgICBsYWJlbHMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICAgIy0tLSBEcmF3IENvbm5lY3RvciBMaW5lcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgcG9seWxpbmUgPSBwaWVCb3guc2VsZWN0QWxsKFwiLndrLWNoYXJ0LXBvbHlsaW5lXCIpLmRhdGEoc2VnbWVudHMsIGtleSlcblxuICAgICAgICBwb2x5bGluZS5lbnRlcigpXG4gICAgICAgIC4gYXBwZW5kKFwicG9seWxpbmVcIikuYXR0cignY2xhc3MnLCd3ay1jaGFydC1wb2x5bGluZScpXG4gICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKVxuICAgICAgICAgIC5lYWNoKChkKSAtPiAgdGhpcy5fY3VycmVudCA9IGQpXG5cbiAgICAgICAgcG9seWxpbmUudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAoZCkgLT4gaWYgZC5kYXRhLnZhbHVlIGlzIDAgdGhlbiAgMCBlbHNlIC41KVxuICAgICAgICAgIC5hdHRyVHdlZW4oXCJwb2ludHNcIiwgKGQpIC0+XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gdGhpcy5fY3VycmVudFxuICAgICAgICAgICAgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZSh0aGlzLl9jdXJyZW50LCBkKVxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzXG4gICAgICAgICAgICByZXR1cm4gKHQpIC0+XG4gICAgICAgICAgICAgIGQyID0gaW50ZXJwb2xhdGUodClcbiAgICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnQgPSBkMjtcbiAgICAgICAgICAgICAgcG9zID0gb3V0ZXJBcmMuY2VudHJvaWQoZDIpXG4gICAgICAgICAgICAgIHBvc1swXSArPSAxMCAqIChpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIDEgZWxzZSAtMSlcbiAgICAgICAgICAgICAgcmV0dXJuIFtpbm5lckFyYy5jZW50cm9pZChkMiksIG91dGVyQXJjLmNlbnRyb2lkKGQyKSwgcG9zXTtcbiAgICAgICAgICApXG5cbiAgICAgICAgcG9seWxpbmUuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMClcbiAgICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICAgIGVsc2VcbiAgICAgICAgcGllQm94LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXBvbHlsaW5lJykucmVtb3ZlKClcbiAgICAgICAgcGllQm94LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWxhYmVsJykucmVtb3ZlKClcblxuICAgICAgaW5pdGlhbFNob3cgPSBmYWxzZVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSB0aGlzLmdldFNjYWxlcyhbJ3NpemUnLCAnY29sb3InXSlcbiAgICAgIF9zY2FsZUxpc3QuY29sb3Iuc2NhbGVUeXBlKCdjYXRlZ29yeTIwJylcbiAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgX3NlbGVjdGVkID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBhdHRycy4kb2JzZXJ2ZSAnbGFiZWxzJywgKHZhbCkgLT5cbiAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgIF9zaG93TGFiZWxzID0gZmFsc2VcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJyBvciB2YWwgaXMgXCJcIlxuICAgICAgICBfc2hvd0xhYmVscyA9IHRydWVcbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9XG5cbiAgI1RPRE8gdmVyaWZ5IGJlaGF2aW9yIHdpdGggY3VzdG9tIHRvb2x0aXBzIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzY2F0dGVyJywgKCRsb2csIHV0aWxzKSAtPlxuICBzY2F0dGVyQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlci5tZVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgX2lkID0gJ3NjYXR0ZXInICsgc2NhdHRlckNudCsrXG4gICAgICBfc2NhbGVMaXN0ID0gW11cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICBmb3Igc05hbWUsIHNjYWxlIG9mIF9zY2FsZUxpc3RcbiAgICAgICAgICBAbGF5ZXJzLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogc2NhbGUuYXhpc0xhYmVsKCksXG4gICAgICAgICAgICB2YWx1ZTogc2NhbGUuZm9ybWF0dGVkVmFsdWUoZGF0YSksXG4gICAgICAgICAgICBjb2xvcjogaWYgc05hbWUgaXMgJ2NvbG9yJyB0aGVuIHsnYmFja2dyb3VuZC1jb2xvcic6c2NhbGUubWFwKGRhdGEpfSBlbHNlIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBhdGg6IGlmIHNOYW1lIGlzICdzaGFwZScgdGhlbiBkMy5zdmcuc3ltYm9sKCkudHlwZShzY2FsZS5tYXAoZGF0YSkpLnNpemUoODApKCkgZWxzZSB1bmRlZmluZWRcbiAgICAgICAgICAgIGNsYXNzOiBpZiBzTmFtZSBpcyAnc2hhcGUnIHRoZW4gJ3drLWNoYXJ0LXR0LXN2Zy1zaGFwZScgZWxzZSAnJ1xuICAgICAgICAgIH0pXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBpbml0aWFsU2hvdyA9IHRydWVcblxuXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUsIHNoYXBlKSAtPlxuICAgICAgICAjJGxvZy5kZWJ1ZyAnZHJhd2luZyBzY2F0dGVyIGNoYXJ0J1xuICAgICAgICBpbml0ID0gKHMpIC0+XG4gICAgICAgICAgaWYgaW5pdGlhbFNob3dcbiAgICAgICAgICAgIHMuc3R5bGUoJ2ZpbGwnLCBjb2xvci5tYXApXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT4gXCJ0cmFuc2xhdGUoI3t4Lm1hcChkKX0sI3t5Lm1hcChkKX0pXCIpLnN0eWxlKCdvcGFjaXR5JywgMSlcbiAgICAgICAgICBpbml0aWFsU2hvdyA9IGZhbHNlXG5cbiAgICAgICAgcG9pbnRzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LXBvaW50cycpXG4gICAgICAgICAgLmRhdGEoZGF0YSlcbiAgICAgICAgcG9pbnRzLmVudGVyKClcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcG9pbnRzIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCktPiBcInRyYW5zbGF0ZSgje3gubWFwKGQpfSwje3kubWFwKGQpfSlcIilcbiAgICAgICAgICAuY2FsbChpbml0KVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICBwb2ludHNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCBkMy5zdmcuc3ltYm9sKCkudHlwZSgoZCkgLT4gc2hhcGUubWFwKGQpKS5zaXplKChkKSAtPiBzaXplLm1hcChkKSAqIHNpemUubWFwKGQpKSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBjb2xvci5tYXApXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+IFwidHJhbnNsYXRlKCN7eC5tYXAoZCl9LCN7eS5tYXAoZCl9KVwiKS5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgcG9pbnRzLmV4aXQoKS5yZW1vdmUoKVxuXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAnc2hhcGUnXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgfVxuXG4jVE9ETyB2ZXJpZnkgYmVoYXZpb3Igd2l0aCBjdXN0b20gdG9vbHRpcHNcbiNUT0RPIEltcGxlbWVudCBpbiBuZXcgZGVtbyBhcHAiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NwaWRlcicsICgkbG9nLCB1dGlscykgLT5cbiAgc3BpZGVyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5kZWJ1ZyAnYnViYmxlQ2hhcnQgbGlua2VkJ1xuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnc3BpZGVyJyArIHNwaWRlckNudHIrK1xuICAgICAgYXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgIF9kYXRhID0gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIEBsYXllcnMgPSBfZGF0YS5tYXAoKGQpIC0+ICB7bmFtZTpfc2NhbGVMaXN0LngudmFsdWUoZCksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShkW2RhdGFdKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6X3NjYWxlTGlzdC5jb2xvci5zY2FsZSgpKGRhdGEpfX0pXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBfZGF0YSA9IGRhdGFcbiAgICAgICAgJGxvZy5sb2cgZGF0YVxuICAgICAgICAjIGNvbXB1dGUgY2VudGVyIG9mIGFyZWFcbiAgICAgICAgY2VudGVyWCA9IG9wdGlvbnMud2lkdGgvMlxuICAgICAgICBjZW50ZXJZID0gb3B0aW9ucy5oZWlnaHQvMlxuICAgICAgICByYWRpdXMgPSBkMy5taW4oW2NlbnRlclgsIGNlbnRlclldKSAqIDAuOFxuICAgICAgICB0ZXh0T2ZmcyA9IDIwXG4gICAgICAgIG5ickF4aXMgPSBkYXRhLmxlbmd0aFxuICAgICAgICBhcmMgPSBNYXRoLlBJICogMiAvIG5ickF4aXNcbiAgICAgICAgZGVnciA9IDM2MCAvIG5ickF4aXNcblxuICAgICAgICBheGlzRyA9IHRoaXMuc2VsZWN0KCcud2stY2hhcnQtYXhpcycpXG4gICAgICAgIGlmIGF4aXNHLmVtcHR5KClcbiAgICAgICAgICBheGlzRyA9IHRoaXMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcycpXG5cbiAgICAgICAgdGlja3MgPSB5LnNjYWxlKCkudGlja3MoeS50aWNrcygpKVxuICAgICAgICB5LnNjYWxlKCkucmFuZ2UoW3JhZGl1cywwXSkgIyB0cmlja3MgdGhlIHdheSBheGlzIGFyZSBkcmF3bi4gTm90IHByZXR0eSwgYnV0IHdvcmtzIDotKVxuICAgICAgICBheGlzLnNjYWxlKHkuc2NhbGUoKSkub3JpZW50KCdyaWdodCcpLnRpY2tWYWx1ZXModGlja3MpLnRpY2tGb3JtYXQoeS50aWNrRm9ybWF0KCkpXG4gICAgICAgIGF4aXNHLmNhbGwoYXhpcykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwje2NlbnRlclktcmFkaXVzfSlcIilcbiAgICAgICAgeS5zY2FsZSgpLnJhbmdlKFswLHJhZGl1c10pXG5cbiAgICAgICAgbGluZXMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMtbGluZScpLmRhdGEoZGF0YSwoZCkgLT4gZC5heGlzKVxuICAgICAgICBsaW5lcy5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWF4aXMtbGluZScpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnZGFya2dyZXknKVxuXG4gICAgICAgIGxpbmVzXG4gICAgICAgICAgLmF0dHIoe3gxOjAsIHkxOjAsIHgyOjAsIHkyOnJhZGl1c30pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQsaSkgLT4gXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwgI3tjZW50ZXJZfSlyb3RhdGUoI3tkZWdyICogaX0pXCIpXG5cbiAgICAgICAgbGluZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgI2RyYXcgdGljayBsaW5lc1xuICAgICAgICB0aWNrTGluZSA9IGQzLnN2Zy5saW5lKCkueCgoZCkgLT4gZC54KS55KChkKS0+ZC55KVxuICAgICAgICB0aWNrUGF0aCA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtdGlja1BhdGgnKS5kYXRhKHRpY2tzKVxuICAgICAgICB0aWNrUGF0aC5lbnRlcigpLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXRpY2tQYXRoJylcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnbm9uZScpLnN0eWxlKCdzdHJva2UnLCAnbGlnaHRncmV5JylcblxuICAgICAgICB0aWNrUGF0aFxuICAgICAgICAgIC5hdHRyKCdkJywoZCkgLT5cbiAgICAgICAgICAgIHAgPSBkYXRhLm1hcCgoYSwgaSkgLT4ge3g6TWF0aC5zaW4oYXJjKmkpICogeS5zY2FsZSgpKGQpLHk6TWF0aC5jb3MoYXJjKmkpICogeS5zY2FsZSgpKGQpfSlcbiAgICAgICAgICAgIHRpY2tMaW5lKHApICsgJ1onKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KVwiKVxuXG4gICAgICAgIHRpY2tQYXRoLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgIGF4aXNMYWJlbHMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMtdGV4dCcpLmRhdGEoZGF0YSwoZCkgLT4geC52YWx1ZShkKSlcbiAgICAgICAgYXhpc0xhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWF4aXMtdGV4dCcpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgICAuYXR0cignZHknLCAnMC44ZW0nKVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICBheGlzTGFiZWxzXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgICB4OiAoZCwgaSkgLT4gY2VudGVyWCArIE1hdGguc2luKGFyYyAqIGkpICogKHJhZGl1cyArIHRleHRPZmZzKVxuICAgICAgICAgICAgICB5OiAoZCwgaSkgLT4gY2VudGVyWSArIE1hdGguY29zKGFyYyAqIGkpICogKHJhZGl1cyArIHRleHRPZmZzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAudGV4dCgoZCkgLT4geC52YWx1ZShkKSlcblxuICAgICAgICAjIGRyYXcgZGF0YSBsaW5lc1xuXG4gICAgICAgIGRhdGFQYXRoID0gZDMuc3ZnLmxpbmUoKS54KChkKSAtPiBkLngpLnkoKGQpIC0+IGQueSlcblxuICAgICAgICBkYXRhTGluZSA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtZGF0YS1saW5lJykuZGF0YSh5LmxheWVyS2V5cyhkYXRhKSlcbiAgICAgICAgZGF0YUxpbmUuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1kYXRhLWxpbmUnKVxuICAgICAgICAgIC5zdHlsZSh7XG4gICAgICAgICAgICBzdHJva2U6KGQpIC0+IGNvbG9yLnNjYWxlKCkoZClcbiAgICAgICAgICAgIGZpbGw6KGQpIC0+IGNvbG9yLnNjYWxlKCkoZClcbiAgICAgICAgICAgICdmaWxsLW9wYWNpdHknOiAwLjJcbiAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAyXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICBkYXRhTGluZS5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBwID0gZGF0YS5tYXAoKGEsIGkpIC0+IHt4Ok1hdGguc2luKGFyYyppKSAqIHkuc2NhbGUoKShhW2RdKSx5Ok1hdGguY29zKGFyYyppKSAqIHkuc2NhbGUoKShhW2RdKX0pXG4gICAgICAgICAgICBkYXRhUGF0aChwKSArICdaJ1xuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwgI3tjZW50ZXJZfSlcIilcblxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIF9zY2FsZUxpc3QueS5kb21haW5DYWxjKCdtYXgnKVxuICAgICAgICBfc2NhbGVMaXN0LngucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgI0BsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICB9XG5cbiNUT0RPIHZlcmlmeSBiZWhhdmlvciB3aXRoIGN1c3RvbSB0b29sdGlwc1xuI1RPRE8gZml4ICd0b29sdGlwIGF0dHJpYnV0ZSBsaXN0IHRvbyBsb25nJyBwcm9ibGVtXG4jVE9ETyBhZGQgZW50ZXIgLyBleGl0IGFuaW1hdGlvbiBiZWhhdmlvclxuI1RPRE8gSW1wbGVtZW50IGRhdGEgbGFiZWxzXG4jVE9ETyBpbXBsZW1lbnQgYW5kIHRlc3Qgb2JqZWN0IHNlbGVjdGlvbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2JlaGF2aW9yQnJ1c2gnLCAoJGxvZywgJHdpbmRvdywgc2VsZWN0aW9uU2hhcmluZywgdGltaW5nKSAtPlxuXG4gIGJlaGF2aW9yQnJ1c2ggPSAoKSAtPlxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgX2FjdGl2ZSA9IGZhbHNlXG4gICAgX292ZXJsYXkgPSB1bmRlZmluZWRcbiAgICBfZXh0ZW50ID0gdW5kZWZpbmVkXG4gICAgX3N0YXJ0UG9zID0gdW5kZWZpbmVkXG4gICAgX2V2VGFyZ2V0RGF0YSA9IHVuZGVmaW5lZFxuICAgIF9hcmVhID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0ID0gdW5kZWZpbmVkXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfYXJlYVNlbGVjdGlvbiA9IHVuZGVmaW5lZFxuICAgIF9hcmVhQm94ID0gdW5kZWZpbmVkXG4gICAgX2JhY2tncm91bmRCb3ggPSB1bmRlZmluZWRcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX3NlbGVjdGFibGVzID0gIHVuZGVmaW5lZFxuICAgIF9icnVzaEdyb3VwID0gdW5kZWZpbmVkXG4gICAgX3ggPSB1bmRlZmluZWRcbiAgICBfeSA9IHVuZGVmaW5lZFxuICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgX2JydXNoWFkgPSBmYWxzZVxuICAgIF9icnVzaFggPSBmYWxzZVxuICAgIF9icnVzaFkgPSBmYWxzZVxuICAgIF9ib3VuZHNJZHggPSB1bmRlZmluZWRcbiAgICBfYm91bmRzVmFsdWVzID0gdW5kZWZpbmVkXG4gICAgX2JvdW5kc0RvbWFpbiA9IHVuZGVmaW5lZFxuICAgIF9icnVzaEV2ZW50cyA9IGQzLmRpc3BhdGNoKCdicnVzaFN0YXJ0JywgJ2JydXNoJywgJ2JydXNoRW5kJylcblxuICAgIGxlZnQgPSB0b3AgPSByaWdodCA9IGJvdHRvbSA9IHN0YXJ0VG9wID0gc3RhcnRMZWZ0ID0gc3RhcnRSaWdodCA9IHN0YXJ0Qm90dG9tID0gdW5kZWZpbmVkXG5cbiAgICAjLS0tIEJydXNoIHV0aWxpdHkgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHBvc2l0aW9uQnJ1c2hFbGVtZW50cyA9IChsZWZ0LCByaWdodCwgdG9wLCBib3R0b20pIC0+XG4gICAgICB3aWR0aCA9IHJpZ2h0IC0gbGVmdFxuICAgICAgaGVpZ2h0ID0gYm90dG9tIC0gdG9wXG5cbiAgICAgICMgcG9zaXRpb24gcmVzaXplLWhhbmRsZXMgaW50byB0aGUgcmlnaHQgY29ybmVyc1xuICAgICAgaWYgX2JydXNoWFlcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbicpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje2JvdHRvbX0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXcnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7dG9wfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1lJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tyaWdodH0sI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW5lJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tyaWdodH0sI3t0b3B9KVwiKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1udycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3t0b3B9KVwiKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LCN7Ym90dG9tfSlcIilcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtc3cnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7Ym90dG9tfSlcIilcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpLmF0dHIoJ3gnLCBsZWZ0KS5hdHRyKCd5JywgdG9wKVxuICAgICAgaWYgX2JydXNoWFxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC13JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwwKVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwwKVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWUnKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBfYXJlYUJveC5oZWlnaHQpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXcnKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBfYXJlYUJveC5oZWlnaHQpXG4gICAgICAgIF9leHRlbnQuYXR0cignd2lkdGgnLCB3aWR0aCkuYXR0cignaGVpZ2h0JywgX2FyZWFCb3guaGVpZ2h0KS5hdHRyKCd4JywgbGVmdCkuYXR0cigneScsIDApXG4gICAgICBpZiBfYnJ1c2hZXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW4nKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7dG9wfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtcycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tib3R0b219KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uJykuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCBfYXJlYUJveC53aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtcycpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgX2FyZWFCb3gud2lkdGgpXG4gICAgICAgIF9leHRlbnQuYXR0cignd2lkdGgnLCBfYXJlYUJveC53aWR0aCkuYXR0cignaGVpZ2h0JywgaGVpZ2h0KS5hdHRyKCd4JywgMCkuYXR0cigneScsIHRvcClcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBnZXRTZWxlY3RlZE9iamVjdHMgPSAoKSAtPlxuICAgICAgZXIgPSBfZXh0ZW50Lm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgX3NlbGVjdGFibGVzLmVhY2goKGQpIC0+XG4gICAgICAgICAgY3IgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgeEhpdCA9IGVyLmxlZnQgPCBjci5yaWdodCAtIGNyLndpZHRoIC8gMyBhbmQgY3IubGVmdCArIGNyLndpZHRoIC8gMyA8IGVyLnJpZ2h0XG4gICAgICAgICAgeUhpdCA9IGVyLnRvcCA8IGNyLmJvdHRvbSAtIGNyLmhlaWdodCAvIDMgYW5kIGNyLnRvcCArIGNyLmhlaWdodCAvIDMgPCBlci5ib3R0b21cbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0ZWQnLCB5SGl0IGFuZCB4SGl0KVxuICAgICAgICApXG4gICAgICByZXR1cm4gX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1zZWxlY3RlZCcpLmRhdGEoKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHNldFNlbGVjdGlvbiA9IChsZWZ0LCByaWdodCwgdG9wLCBib3R0b20pIC0+XG4gICAgICBpZiBfYnJ1c2hYXG4gICAgICAgIF9ib3VuZHNJZHggPSBbbWUueCgpLmludmVydChsZWZ0KSwgbWUueCgpLmludmVydChyaWdodCldXG4gICAgICAgIGlmIG1lLngoKS5pc09yZGluYWwoKVxuICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBfZGF0YS5tYXAoKGQpIC0+IG1lLngoKS52YWx1ZShkKSkuc2xpY2UoX2JvdW5kc0lkeFswXSwgX2JvdW5kc0lkeFsxXSArIDEpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYm91bmRzVmFsdWVzID0gW21lLngoKS52YWx1ZShfZGF0YVtfYm91bmRzSWR4WzBdXSksIG1lLngoKS52YWx1ZShfZGF0YVtfYm91bmRzSWR4WzFdXSldXG4gICAgICAgIF9ib3VuZHNEb21haW4gPSBfZGF0YS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgIGlmIF9icnVzaFlcbiAgICAgICAgX2JvdW5kc0lkeCA9IFttZS55KCkuaW52ZXJ0KGJvdHRvbSksIG1lLnkoKS5pbnZlcnQodG9wKV1cbiAgICAgICAgaWYgbWUueSgpLmlzT3JkaW5hbCgpXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IF9kYXRhLm1hcCgoZCkgLT4gbWUueSgpLnZhbHVlKGQpKS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbbWUueSgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMF1dKSwgbWUueSgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMV1dKV1cbiAgICAgICAgX2JvdW5kc0RvbWFpbiA9IF9kYXRhLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgaWYgX2JydXNoWFlcbiAgICAgICAgX2JvdW5kc0lkeCA9IFtdXG4gICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbXVxuICAgICAgICBfYm91bmRzRG9tYWluID0gZ2V0U2VsZWN0ZWRPYmplY3RzKClcblxuICAgICMtLS0gQnJ1c2hTdGFydCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuXG4gICAgYnJ1c2hTdGFydCA9ICgpIC0+XG4gICAgICAjcmVnaXN0ZXIgYSBtb3VzZSBoYW5kbGVycyBmb3IgdGhlIGJydXNoXG4gICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBfZXZUYXJnZXREYXRhID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldCkuZGF0dW0oKVxuICAgICAgXyBpZiBub3QgX2V2VGFyZ2V0RGF0YVxuICAgICAgICBfZXZUYXJnZXREYXRhID0ge25hbWU6J2ZvcndhcmRlZCd9XG4gICAgICBfYXJlYUJveCA9IF9hcmVhLmdldEJCb3goKVxuICAgICAgX3N0YXJ0UG9zID0gZDMubW91c2UoX2FyZWEpXG4gICAgICBzdGFydFRvcCA9IHRvcFxuICAgICAgc3RhcnRMZWZ0ID0gbGVmdFxuICAgICAgc3RhcnRSaWdodCA9IHJpZ2h0XG4gICAgICBzdGFydEJvdHRvbSA9IGJvdHRvbVxuICAgICAgZDMuc2VsZWN0KF9hcmVhKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJykuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LXJlc2l6ZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcbiAgICAgIGQzLnNlbGVjdCgnYm9keScpLnN0eWxlKCdjdXJzb3InLCBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5zdHlsZSgnY3Vyc29yJykpXG5cbiAgICAgIGQzLnNlbGVjdCgkd2luZG93KS5vbignbW91c2Vtb3ZlLmJydXNoJywgYnJ1c2hNb3ZlKS5vbignbW91c2V1cC5icnVzaCcsIGJydXNoRW5kKVxuXG4gICAgICBfdG9vbHRpcC5oaWRlKHRydWUpXG4gICAgICBfYm91bmRzSWR4ID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0YWJsZXMgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoU3RhcnQoKVxuICAgICAgdGltaW5nLmNsZWFyKClcbiAgICAgIHRpbWluZy5pbml0KClcblxuICAgICMtLS0gQnJ1c2hFbmQgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBicnVzaEVuZCA9ICgpIC0+XG4gICAgICAjZGUtcmVnaXN0ZXIgaGFuZGxlcnNcblxuICAgICAgZDMuc2VsZWN0KCR3aW5kb3cpLm9uICdtb3VzZW1vdmUuYnJ1c2gnLCBudWxsXG4gICAgICBkMy5zZWxlY3QoJHdpbmRvdykub24gJ21vdXNldXAuYnJ1c2gnLCBudWxsXG4gICAgICBkMy5zZWxlY3QoX2FyZWEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ2FsbCcpLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXJlc2l6ZScpLnN0eWxlKCdkaXNwbGF5JywgbnVsbCkgIyBzaG93IHRoZSByZXNpemUgaGFuZGxlcnNcbiAgICAgIGQzLnNlbGVjdCgnYm9keScpLnN0eWxlKCdjdXJzb3InLCBudWxsKVxuICAgICAgaWYgYm90dG9tIC0gdG9wIGlzIDAgb3IgcmlnaHQgLSBsZWZ0IGlzIDBcbiAgICAgICAgI2JydXNoIGlzIGVtcHR5XG4gICAgICAgIGQzLnNlbGVjdChfYXJlYSkuc2VsZWN0QWxsKCcud2stY2hhcnQtcmVzaXplJykuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpXG4gICAgICBfdG9vbHRpcC5oaWRlKGZhbHNlKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoRW5kKF9ib3VuZHNJZHgpXG4gICAgICB0aW1pbmcucmVwb3J0KClcblxuICAgICMtLS0gQnJ1c2hNb3ZlIEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBicnVzaE1vdmUgPSAoKSAtPlxuICAgICAgJGxvZy5pbmZvICdicnVzaG1vdmUnXG4gICAgICBwb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIGRlbHRhWCA9IHBvc1swXSAtIF9zdGFydFBvc1swXVxuICAgICAgZGVsdGFZID0gcG9zWzFdIC0gX3N0YXJ0UG9zWzFdXG5cbiAgICAgICMgdGhpcyBlbGFib3JhdGUgY29kZSBpcyBuZWVkZWQgdG8gZGVhbCB3aXRoIHNjZW5hcmlvcyB3aGVuIG1vdXNlIG1vdmVzIGZhc3QgYW5kIHRoZSBldmVudHMgZG8gbm90IGhpdCB4L3kgKyBkZWx0YVxuICAgICAgIyBkb2VzIG5vdCBoaSB0aGUgMCBwb2ludCBtYXllIHRoZXJlIGlzIGEgbW9yZSBlbGVnYW50IHdheSB0byB3cml0ZSB0aGlzLCBidXQgZm9yIG5vdyBpdCB3b3JrcyA6LSlcblxuICAgICAgbGVmdE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydExlZnQgKyBkZWx0YVxuICAgICAgICBsZWZ0ID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRSaWdodCB0aGVuIHBvcyBlbHNlIHN0YXJ0UmlnaHQpIGVsc2UgMFxuICAgICAgICByaWdodCA9IGlmIHBvcyA8PSBfYXJlYUJveC53aWR0aCB0aGVuIChpZiBwb3MgPCBzdGFydFJpZ2h0IHRoZW4gc3RhcnRSaWdodCBlbHNlIHBvcykgZWxzZSBfYXJlYUJveC53aWR0aFxuXG4gICAgICByaWdodE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydFJpZ2h0ICsgZGVsdGFcbiAgICAgICAgbGVmdCA9IGlmIHBvcyA+PSAwIHRoZW4gKGlmIHBvcyA8IHN0YXJ0TGVmdCB0aGVuIHBvcyBlbHNlIHN0YXJ0TGVmdCkgZWxzZSAwXG4gICAgICAgIHJpZ2h0ID0gaWYgcG9zIDw9IF9hcmVhQm94LndpZHRoIHRoZW4gKGlmIHBvcyA8IHN0YXJ0TGVmdCB0aGVuIHN0YXJ0TGVmdCBlbHNlIHBvcykgZWxzZSBfYXJlYUJveC53aWR0aFxuXG4gICAgICB0b3BNdiA9IChkZWx0YSkgLT5cbiAgICAgICAgcG9zID0gc3RhcnRUb3AgKyBkZWx0YVxuICAgICAgICB0b3AgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydEJvdHRvbSB0aGVuIHBvcyBlbHNlIHN0YXJ0Qm90dG9tKSBlbHNlIDBcbiAgICAgICAgYm90dG9tID0gaWYgcG9zIDw9IF9hcmVhQm94LmhlaWdodCB0aGVuIChpZiBwb3MgPiBzdGFydEJvdHRvbSB0aGVuIHBvcyBlbHNlIHN0YXJ0Qm90dG9tICkgZWxzZSBfYXJlYUJveC5oZWlnaHRcblxuICAgICAgYm90dG9tTXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0Qm90dG9tICsgZGVsdGFcbiAgICAgICAgdG9wID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRUb3AgdGhlbiBwb3MgZWxzZSBzdGFydFRvcCkgZWxzZSAwXG4gICAgICAgIGJvdHRvbSA9IGlmIHBvcyA8PSBfYXJlYUJveC5oZWlnaHQgdGhlbiAoaWYgcG9zID4gc3RhcnRUb3AgdGhlbiBwb3MgZWxzZSBzdGFydFRvcCApIGVsc2UgX2FyZWFCb3guaGVpZ2h0XG5cbiAgICAgIGhvck12ID0gKGRlbHRhKSAtPlxuICAgICAgICBpZiBzdGFydExlZnQgKyBkZWx0YSA+PSAwXG4gICAgICAgICAgaWYgc3RhcnRSaWdodCArIGRlbHRhIDw9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgICBsZWZ0ID0gc3RhcnRMZWZ0ICsgZGVsdGFcbiAgICAgICAgICAgIHJpZ2h0ID0gc3RhcnRSaWdodCArIGRlbHRhXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmlnaHQgPSBfYXJlYUJveC53aWR0aFxuICAgICAgICAgICAgbGVmdCA9IF9hcmVhQm94LndpZHRoIC0gKHN0YXJ0UmlnaHQgLSBzdGFydExlZnQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsZWZ0ID0gMFxuICAgICAgICAgIHJpZ2h0ID0gc3RhcnRSaWdodCAtIHN0YXJ0TGVmdFxuXG4gICAgICB2ZXJ0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIGlmIHN0YXJ0VG9wICsgZGVsdGEgPj0gMFxuICAgICAgICAgIGlmIHN0YXJ0Qm90dG9tICsgZGVsdGEgPD0gX2FyZWFCb3guaGVpZ2h0XG4gICAgICAgICAgICB0b3AgPSBzdGFydFRvcCArIGRlbHRhXG4gICAgICAgICAgICBib3R0b20gPSBzdGFydEJvdHRvbSArIGRlbHRhXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYm90dG9tID0gX2FyZWFCb3guaGVpZ2h0XG4gICAgICAgICAgICB0b3AgPSBfYXJlYUJveC5oZWlnaHQgLSAoc3RhcnRCb3R0b20gLSBzdGFydFRvcClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRvcCA9IDBcbiAgICAgICAgICBib3R0b20gPSBzdGFydEJvdHRvbSAtIHN0YXJ0VG9wXG5cbiAgICAgIHN3aXRjaCBfZXZUYXJnZXREYXRhLm5hbWVcbiAgICAgICAgd2hlbiAnYmFja2dyb3VuZCcsICdmb3J3YXJkZWQnXG4gICAgICAgICAgaWYgZGVsdGFYICsgX3N0YXJ0UG9zWzBdID4gMFxuICAgICAgICAgICAgbGVmdCA9IGlmIGRlbHRhWCA8IDAgdGhlbiBfc3RhcnRQb3NbMF0gKyBkZWx0YVggZWxzZSBfc3RhcnRQb3NbMF1cbiAgICAgICAgICAgIGlmIGxlZnQgKyBNYXRoLmFicyhkZWx0YVgpIDwgX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICAgICAgcmlnaHQgPSBsZWZ0ICsgTWF0aC5hYnMoZGVsdGFYKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByaWdodCA9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGVmdCA9IDBcblxuICAgICAgICAgIGlmIGRlbHRhWSArIF9zdGFydFBvc1sxXSA+IDBcbiAgICAgICAgICAgIHRvcCA9IGlmIGRlbHRhWSA8IDAgdGhlbiBfc3RhcnRQb3NbMV0gKyBkZWx0YVkgZWxzZSBfc3RhcnRQb3NbMV1cbiAgICAgICAgICAgIGlmIHRvcCArIE1hdGguYWJzKGRlbHRhWSkgPCBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgICAgYm90dG9tID0gdG9wICsgTWF0aC5hYnMoZGVsdGFZKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBib3R0b20gPSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0b3AgPSAwXG4gICAgICAgIHdoZW4gJ2V4dGVudCdcbiAgICAgICAgICB2ZXJ0TXYoZGVsdGFZKTsgaG9yTXYoZGVsdGFYKVxuICAgICAgICB3aGVuICduJ1xuICAgICAgICAgIHRvcE12KGRlbHRhWSlcbiAgICAgICAgd2hlbiAncydcbiAgICAgICAgICBib3R0b21NdihkZWx0YVkpXG4gICAgICAgIHdoZW4gJ3cnXG4gICAgICAgICAgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnZSdcbiAgICAgICAgICByaWdodE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnbncnXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKTsgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnbmUnXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKTsgcmlnaHRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ3N3J1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSk7IGxlZnRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ3NlJ1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSk7IHJpZ2h0TXYoZGVsdGFYKVxuXG4gICAgICBwb3NpdGlvbkJydXNoRWxlbWVudHMobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuICAgICAgc2V0U2VsZWN0aW9uKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSlcbiAgICAgIF9icnVzaEV2ZW50cy5icnVzaChfYm91bmRzSWR4LCBfYm91bmRzVmFsdWVzLCBfYm91bmRzRG9tYWluKVxuICAgICAgc2VsZWN0aW9uU2hhcmluZy5zZXRTZWxlY3Rpb24gX2JvdW5kc1ZhbHVlcywgX2JydXNoR3JvdXBcblxuICAgICMtLS0gQnJ1c2ggLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5icnVzaCA9IChzKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9vdmVybGF5XG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICAgIF9vdmVybGF5ID0gc1xuICAgICAgICBfYnJ1c2hYWSA9IG1lLngoKSBhbmQgbWUueSgpXG4gICAgICAgIF9icnVzaFggPSBtZS54KCkgYW5kIG5vdCBtZS55KClcbiAgICAgICAgX2JydXNoWSA9IG1lLnkoKSBhbmQgbm90IG1lLngoKVxuICAgICAgICAjIGNyZWF0ZSB0aGUgaGFuZGxlciBlbGVtZW50cyBhbmQgcmVnaXN0ZXIgdGhlIGhhbmRsZXJzXG4gICAgICAgIHMuc3R5bGUoeydwb2ludGVyLWV2ZW50cyc6ICdhbGwnLCBjdXJzb3I6ICdjcm9zc2hhaXInfSlcbiAgICAgICAgX2V4dGVudCA9IHMuYXBwZW5kKCdyZWN0JykuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LWV4dGVudCcsIHg6MCwgeTowLCB3aWR0aDowLCBoZWlnaHQ6MH0pLnN0eWxlKCdjdXJzb3InLCdtb3ZlJykuZGF0dW0oe25hbWU6J2V4dGVudCd9KVxuICAgICAgICAjIHJlc2l6ZSBoYW5kbGVzIGZvciB0aGUgc2lkZXNcbiAgICAgICAgaWYgX2JydXNoWSBvciBfYnJ1c2hYWVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LW4nKS5zdHlsZSh7Y3Vyc29yOiducy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDowLCB5OiAtMywgd2lkdGg6MCwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonbid9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LXMnKS5zdHlsZSh7Y3Vyc29yOiducy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDowLCB5OiAtMywgd2lkdGg6MCwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZToncyd9KVxuICAgICAgICBpZiBfYnJ1c2hYIG9yIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtdycpLnN0eWxlKHtjdXJzb3I6J2V3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt5OjAsIHg6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6MH0pLmRhdHVtKHtuYW1lOid3J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtZScpLnN0eWxlKHtjdXJzb3I6J2V3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt5OjAsIHg6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6MH0pLmRhdHVtKHtuYW1lOidlJ30pXG4gICAgICAgICMgcmVzaXplIGhhbmRsZXMgZm9yIHRoZSBjb3JuZXJzXG4gICAgICAgIGlmIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbncnKS5zdHlsZSh7Y3Vyc29yOidud3NlLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidudyd9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LW5lJykuc3R5bGUoe2N1cnNvcjonbmVzdy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6IC0zLCB5OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonbmUnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1zdycpLnN0eWxlKHtjdXJzb3I6J25lc3ctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J3N3J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtc2UnKS5zdHlsZSh7Y3Vyc29yOidud3NlLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidzZSd9KVxuICAgICAgICAjcmVnaXN0ZXIgaGFuZGxlci4gUGxlYXNlIG5vdGUsIGJydXNoIHdhbnRzIHRoZSBtb3VzZSBkb3duIGV4Y2x1c2l2ZWx5ICEhIVxuICAgICAgICBzLm9uICdtb3VzZWRvd24uYnJ1c2gnLCBicnVzaFN0YXJ0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBFeHRlbnQgcmVzaXplIGhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHJlc2l6ZUV4dGVudCA9ICgpIC0+XG4gICAgICBpZiBfYXJlYUJveFxuICAgICAgICAkbG9nLmluZm8gJ3Jlc2l6ZUhhbmRsZXInXG4gICAgICAgIG5ld0JveCA9IF9hcmVhLmdldEJCb3goKVxuICAgICAgICBob3Jpem9udGFsUmF0aW8gPSBfYXJlYUJveC53aWR0aCAvIG5ld0JveC53aWR0aFxuICAgICAgICB2ZXJ0aWNhbFJhdGlvID0gX2FyZWFCb3guaGVpZ2h0IC8gbmV3Qm94LmhlaWdodFxuICAgICAgICB0b3AgPSB0b3AgLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIHN0YXJ0VG9wID0gc3RhcnRUb3AgLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIGJvdHRvbSA9IGJvdHRvbSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgc3RhcnRCb3R0b20gPSBzdGFydEJvdHRvbSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgbGVmdCA9IGxlZnQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgc3RhcnRMZWZ0ID0gc3RhcnRMZWZ0IC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIHJpZ2h0ID0gcmlnaHQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgc3RhcnRSaWdodCA9IHN0YXJ0UmlnaHQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgX3N0YXJ0UG9zWzBdID0gX3N0YXJ0UG9zWzBdIC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIF9zdGFydFBvc1sxXSA9IF9zdGFydFBvc1sxXSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgX2FyZWFCb3ggPSBuZXdCb3hcbiAgICAgICAgcG9zaXRpb25CcnVzaEVsZW1lbnRzKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSlcblxuICAgICMtLS0gQnJ1c2ggUHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuY2hhcnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSB2YWxcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uICdyZXNpemUuYnJ1c2gnLCByZXNpemVFeHRlbnRcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS54ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfeFxuICAgICAgZWxzZVxuICAgICAgICBfeCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUueSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3lcbiAgICAgIGVsc2VcbiAgICAgICAgX3kgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmFyZWEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hcmVhU2VsZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfYXJlYVNlbGVjdGlvblxuICAgICAgICAgIF9hcmVhU2VsZWN0aW9uID0gdmFsXG4gICAgICAgICAgX2FyZWEgPSBfYXJlYVNlbGVjdGlvbi5ub2RlKClcbiAgICAgICAgICAjX2FyZWFCb3ggPSBfYXJlYS5nZXRCQm94KCkgbmVlZCB0byBnZXQgd2hlbiBjYWxjdWxhdGluZyBzaXplIHRvIGRlYWwgd2l0aCByZXNpemluZ1xuICAgICAgICAgIG1lLmJydXNoKF9hcmVhU2VsZWN0aW9uKVxuXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICBfc2VsZWN0YWJsZXMgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGF0YSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmJydXNoR3JvdXAgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9icnVzaEdyb3VwXG4gICAgICBlbHNlXG4gICAgICAgIF9icnVzaEdyb3VwID0gdmFsXG4gICAgICAgIHNlbGVjdGlvblNoYXJpbmcuY3JlYXRlR3JvdXAoX2JydXNoR3JvdXApXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50b29sdGlwID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdG9vbHRpcFxuICAgICAgZWxzZVxuICAgICAgICBfdG9vbHRpcCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUub24gPSAobmFtZSwgY2FsbGJhY2spIC0+XG4gICAgICBfYnJ1c2hFdmVudHMub24gbmFtZSwgY2FsbGJhY2tcblxuICAgIG1lLmV4dGVudCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JvdW5kc0lkeFxuXG4gICAgbWUuZXZlbnRzID0gKCkgLT5cbiAgICAgIHJldHVybiBfYnJ1c2hFdmVudHNcblxuICAgIG1lLmVtcHR5ID0gKCkgLT5cbiAgICAgIHJldHVybiBfYm91bmRzSWR4IGlzIHVuZGVmaW5lZFxuXG4gICAgcmV0dXJuIG1lXG4gIHJldHVybiBiZWhhdmlvckJydXNoIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JTZWxlY3QnLCAoJGxvZykgLT5cbiAgc2VsZWN0SWQgPSAwXG5cbiAgc2VsZWN0ID0gKCkgLT5cblxuICAgIF9pZCA9IFwic2VsZWN0I3tzZWxlY3RJZCsrfVwiXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9hY3RpdmUgPSBmYWxzZVxuICAgIF9zZWxlY3Rpb25FdmVudHMgPSBkMy5kaXNwYXRjaCgnc2VsZWN0ZWQnKVxuXG4gICAgY2xpY2tlZCA9ICgpIC0+XG4gICAgICBpZiBub3QgX2FjdGl2ZSB0aGVuIHJldHVyblxuICAgICAgb2JqID0gZDMuc2VsZWN0KHRoaXMpXG4gICAgICBpZiBub3QgX2FjdGl2ZSB0aGVuIHJldHVyblxuICAgICAgaWYgb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICBpc1NlbGVjdGVkID0gb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGVkJylcbiAgICAgICAgb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGVkJywgbm90IGlzU2VsZWN0ZWQpXG4gICAgICAgIGFsbFNlbGVjdGVkID0gX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1zZWxlY3RlZCcpLmRhdGEoKS5tYXAoKGQpIC0+IGlmIGQuZGF0YSB0aGVuIGQuZGF0YSBlbHNlIGQpXG4gICAgICAgICMgZW5zdXJlIHRoYXQgb25seSB0aGUgb3JpZ2luYWwgdmFsdWVzIGFyZSByZXBvcnRlZCBiYWNrXG5cbiAgICAgICAgX3NlbGVjdGlvbkV2ZW50cy5zZWxlY3RlZChhbGxTZWxlY3RlZClcblxuICAgIG1lID0gKHNlbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBtZVxuICAgICAgZWxzZVxuICAgICAgICBzZWxcbiAgICAgICAgICAjIHJlZ2lzdGVyIHNlbGVjdGlvbiBldmVudHNcbiAgICAgICAgICAub24gJ2NsaWNrJywgY2xpY2tlZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfaWRcblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZXZlbnRzID0gKCkgLT5cbiAgICAgIHJldHVybiBfc2VsZWN0aW9uRXZlbnRzXG5cbiAgICBtZS5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgIF9zZWxlY3Rpb25FdmVudHMub24gbmFtZSwgY2FsbGJhY2tcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIHNlbGVjdCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2JlaGF2aW9yVG9vbHRpcCcsICgkbG9nLCAkZG9jdW1lbnQsICRyb290U2NvcGUsICRjb21waWxlLCAkdGVtcGxhdGVDYWNoZSwgdGVtcGxhdGVEaXIpIC0+XG5cbiAgYmVoYXZpb3JUb29sdGlwID0gKCkgLT5cblxuICAgIF9hY3RpdmUgPSBmYWxzZVxuICAgIF9wYXRoID0gJydcbiAgICBfaGlkZSA9IGZhbHNlXG4gICAgX3Nob3dNYXJrZXJMaW5lID0gdW5kZWZpbmVkXG4gICAgX21hcmtlckcgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyTGluZSA9IHVuZGVmaW5lZFxuICAgIF9hcmVhU2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2FyZWE9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyU2NhbGUgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF90b29sdGlwRGlzcGF0Y2ggPSBkMy5kaXNwYXRjaCgnZW50ZXInLCAnbW92ZURhdGEnLCAnbW92ZU1hcmtlcicsICdsZWF2ZScpXG5cbiAgICBfdGVtcGwgPSAkdGVtcGxhdGVDYWNoZS5nZXQodGVtcGxhdGVEaXIgKyAndG9vbFRpcC5odG1sJylcbiAgICBfdGVtcGxTY29wZSA9ICRyb290U2NvcGUuJG5ldyh0cnVlKVxuICAgIF9jb21waWxlZFRlbXBsID0gJGNvbXBpbGUoX3RlbXBsKShfdGVtcGxTY29wZSlcbiAgICBib2R5ID0gJGRvY3VtZW50LmZpbmQoJ2JvZHknKVxuXG4gICAgYm9keVJlY3QgPSBib2R5WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICAjLS0tIGhlbHBlciBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcG9zaXRpb25Cb3ggPSAoKSAtPlxuICAgICAgcmVjdCA9IF9jb21waWxlZFRlbXBsWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjbGllbnRYID0gaWYgYm9keVJlY3QucmlnaHQgLSAyMCA+IGQzLmV2ZW50LmNsaWVudFggKyByZWN0LndpZHRoICsgMTAgdGhlbiBkMy5ldmVudC5jbGllbnRYICsgMTAgZWxzZSBkMy5ldmVudC5jbGllbnRYIC0gcmVjdC53aWR0aCAtIDEwXG4gICAgICBjbGllbnRZID0gaWYgYm9keVJlY3QuYm90dG9tIC0gMjAgPiBkMy5ldmVudC5jbGllbnRZICsgcmVjdC5oZWlnaHQgKyAxMCB0aGVuIGQzLmV2ZW50LmNsaWVudFkgKyAxMCBlbHNlIGQzLmV2ZW50LmNsaWVudFkgLSByZWN0LmhlaWdodCAtIDEwXG4gICAgICBfdGVtcGxTY29wZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgbGVmdDogY2xpZW50WCArICdweCdcbiAgICAgICAgdG9wOiBjbGllbnRZICsgJ3B4J1xuICAgICAgICAnei1pbmRleCc6IDE1MDBcbiAgICAgICAgb3BhY2l0eTogMVxuICAgICAgfVxuICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KClcblxuICAgIHBvc2l0aW9uSW5pdGlhbCA9ICgpIC0+XG4gICAgICBfdGVtcGxTY29wZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgbGVmdDogMCArICdweCdcbiAgICAgICAgdG9wOiAwICsgJ3B4J1xuICAgICAgICAnei1pbmRleCc6IDE1MDBcbiAgICAgICAgb3BhY2l0eTogMFxuICAgICAgfVxuICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KCkgICMgZW5zdXJlIHRvb2x0aXAgZ2V0cyByZW5kZXJlZFxuICAgICAgI3dheWl0IHVudGlsIGl0IGlzIHJlbmRlcmVkIGFuZCB0aGVuIHJlcG9zaXRpb25cbiAgICAgIF8udGhyb3R0bGUgcG9zaXRpb25Cb3gsIDIwMFxuXG4gICAgIy0tLSBUb29sdGlwU3RhcnQgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRvb2x0aXBFbnRlciA9ICgpIC0+XG4gICAgICBpZiBub3QgX2FjdGl2ZSBvciBfaGlkZSB0aGVuIHJldHVyblxuICAgICAgIyBhcHBlbmQgZGF0YSBkaXZcbiAgICAgIGJvZHkuYXBwZW5kKF9jb21waWxlZFRlbXBsKVxuICAgICAgX3RlbXBsU2NvcGUubGF5ZXJzID0gW11cblxuICAgICAgIyBnZXQgdG9vbHRpcCBkYXRhIHZhbHVlXG5cbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICBfcG9zID0gZDMubW91c2UodGhpcylcbiAgICAgICAgdmFsdWUgPSBfbWFya2VyU2NhbGUuaW52ZXJ0KGlmIF9tYXJrZXJTY2FsZS5pc0hvcml6b250YWwoKSB0aGVuIF9wb3NbMF0gZWxzZSBfcG9zWzFdKVxuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IGQzLnNlbGVjdCh0aGlzKS5kYXR1bSgpXG5cbiAgICAgIF90ZW1wbFNjb3BlLnR0U2hvdyA9IHRydWVcbiAgICAgIF90ZW1wbFNjb3BlLnR0RGF0YSA9IHZhbHVlXG4gICAgICBfdG9vbHRpcERpc3BhdGNoLmVudGVyLmFwcGx5KF90ZW1wbFNjb3BlLCBbdmFsdWVdKSAjIGNhbGwgbGF5b3V0IHRvIGZpbGwgaW4gZGF0YVxuICAgICAgcG9zaXRpb25Jbml0aWFsKClcblxuICAgICAgIyBjcmVhdGUgYSBtYXJrZXIgbGluZSBpZiByZXF1aXJlZFxuICAgICAgaWYgX3Nob3dNYXJrZXJMaW5lXG4gICAgICAgICNfYXJlYSA9IHRoaXNcbiAgICAgICAgX2FyZWFCb3ggPSBfYXJlYVNlbGVjdGlvbi5zZWxlY3QoJy53ay1jaGFydC1iYWNrZ3JvdW5kJykubm9kZSgpLmdldEJCb3goKVxuICAgICAgICBfcG9zID0gZDMubW91c2UoX2FyZWEpXG4gICAgICAgIF9tYXJrZXJHID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKSAgIyBuZWVkIHRvIGFwcGVuZCBtYXJrZXIgdG8gY2hhcnQgYXJlYSB0byBlbnN1cmUgaXQgaXMgb24gdG9wIG9mIHRoZSBjaGFydCBlbGVtZW50cyBGaXggMTBcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtdG9vbHRpcC1tYXJrZXInKVxuICAgICAgICBfbWFya2VyTGluZSA9IF9tYXJrZXJHLmFwcGVuZCgnbGluZScpXG4gICAgICAgIGlmIF9tYXJrZXJTY2FsZS5pc0hvcml6b250YWwoKVxuICAgICAgICAgIF9tYXJrZXJMaW5lLmF0dHIoe2NsYXNzOid3ay1jaGFydC1tYXJrZXItbGluZScsIHgwOjAsIHgxOjAsIHkwOjAseTE6X2FyZWFCb3guaGVpZ2h0fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9tYXJrZXJMaW5lLmF0dHIoe2NsYXNzOid3ay1jaGFydC1tYXJrZXItbGluZScsIHgwOjAsIHgxOl9hcmVhQm94LndpZHRoLCB5MDowLHkxOjB9KVxuXG4gICAgICAgIF9tYXJrZXJMaW5lLnN0eWxlKHtzdHJva2U6ICdkYXJrZ3JleScsICdwb2ludGVyLWV2ZW50cyc6ICdub25lJ30pXG5cbiAgICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5tb3ZlTWFya2VyLmFwcGx5KF9tYXJrZXJHLCBbdmFsdWVdKVxuXG4gICAgIy0tLSBUb29sdGlwTW92ZSAgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRvb2x0aXBNb3ZlID0gKCkgLT5cbiAgICAgIGlmIG5vdCBfYWN0aXZlIG9yIF9oaWRlIHRoZW4gcmV0dXJuXG4gICAgICBfcG9zID0gZDMubW91c2UoX2FyZWEpXG4gICAgICBwb3NpdGlvbkJveCgpXG4gICAgICBpZiBfc2hvd01hcmtlckxpbmVcbiAgICAgICAgZGF0YUlkeCA9IF9tYXJrZXJTY2FsZS5pbnZlcnQoaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpIHRoZW4gX3Bvc1swXSBlbHNlIF9wb3NbMV0pXG4gICAgICAgIF90b29sdGlwRGlzcGF0Y2gubW92ZU1hcmtlci5hcHBseShfbWFya2VyRywgW2RhdGFJZHhdKVxuICAgICAgICBfdGVtcGxTY29wZS5sYXllcnMgPSBbXVxuICAgICAgICBfdG9vbHRpcERpc3BhdGNoLm1vdmVEYXRhLmFwcGx5KF90ZW1wbFNjb3BlLCBbZGF0YUlkeF0pXG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKVxuXG4gICAgIy0tLSBUb29sdGlwTGVhdmUgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRvb2x0aXBMZWF2ZSA9ICgpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAndG9vbHRpcExlYXZlJywgX2FyZWFcbiAgICAgIGlmIF9tYXJrZXJHXG4gICAgICAgIF9tYXJrZXJHLnJlbW92ZSgpXG4gICAgICBfbWFya2VyRyA9IHVuZGVmaW5lZFxuICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gZmFsc2VcbiAgICAgIF9jb21waWxlZFRlbXBsLnJlbW92ZSgpXG5cbiAgICAjLS0tIEludGVyZmFjZSB0byBicnVzaCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZm9yd2FyZFRvQnJ1c2ggPSAoZSkgLT5cbiAgICAgICMgZm9yd2FyZCB0aGUgbW91c2Rvd24gZXZlbnQgdG8gdGhlIGJydXNoIG92ZXJsYXkgdG8gZW5zdXJlIHRoYXQgYnJ1c2hpbmcgY2FuIHN0YXJ0IGF0IGFueSBwb2ludCBpbiB0aGUgZHJhd2luZyBhcmVhXG5cbiAgICAgIGJydXNoX2VsbSA9IGQzLnNlbGVjdChfY29udGFpbmVyLm5vZGUoKS5wYXJlbnRFbGVtZW50KS5zZWxlY3QoXCIud2stY2hhcnQtb3ZlcmxheVwiKS5ub2RlKCk7XG4gICAgICBpZiBkMy5ldmVudC50YXJnZXQgaXNudCBicnVzaF9lbG0gI2RvIG5vdCBkaXNwYXRjaCBpZiB0YXJnZXQgaXMgb3ZlcmxheVxuICAgICAgICBuZXdfY2xpY2tfZXZlbnQgPSBuZXcgRXZlbnQoJ21vdXNlZG93bicpO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQucGFnZVggPSBkMy5ldmVudC5wYWdlWDtcbiAgICAgICAgbmV3X2NsaWNrX2V2ZW50LmNsaWVudFggPSBkMy5ldmVudC5jbGllbnRYO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQucGFnZVkgPSBkMy5ldmVudC5wYWdlWTtcbiAgICAgICAgbmV3X2NsaWNrX2V2ZW50LmNsaWVudFkgPSBkMy5ldmVudC5jbGllbnRZO1xuICAgICAgICBicnVzaF9lbG0uZGlzcGF0Y2hFdmVudChuZXdfY2xpY2tfZXZlbnQpO1xuXG5cbiAgICBtZS5oaWRlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaGlkZVxuICAgICAgZWxzZVxuICAgICAgICBfaGlkZSA9IHZhbFxuICAgICAgICBpZiBfbWFya2VyR1xuICAgICAgICAgIF9tYXJrZXJHLnN0eWxlKCd2aXNpYmlsaXR5JywgaWYgX2hpZGUgdGhlbiAnaGlkZGVuJyBlbHNlICd2aXNpYmxlJylcbiAgICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gbm90IF9oaWRlXG4gICAgICAgIF90ZW1wbFNjb3BlLiRhcHBseSgpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cblxuICAgICMtLSBUb29sdGlwIHByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5hY3RpdmUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hY3RpdmVcbiAgICAgIGVsc2VcbiAgICAgICAgX2FjdGl2ZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUudGVtcGxhdGUgPSAocGF0aCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cyBpcyAwIHRoZW4gcmV0dXJuIF9wYXRoXG4gICAgICBlbHNlXG4gICAgICAgIF9wYXRoID0gcGF0aFxuICAgICAgICBpZiBfcGF0aC5sZW5ndGggPiAwXG4gICAgICAgICAgX2N1c3RvbVRlbXBsID0gJHRlbXBsYXRlQ2FjaGUuZ2V0KCd0ZW1wbGF0ZXMvJyArIF9wYXRoKVxuICAgICAgICAgICMgd3JhcCB0ZW1wbGF0ZSBpbnRvIHBvc2l0aW9uaW5nIGRpdlxuICAgICAgICAgIF9jdXN0b21UZW1wbFdyYXBwZWQgPSBcIjxkaXYgY2xhc3M9XFxcIndrLWNoYXJ0LXRvb2x0aXBcXFwiIG5nLXNob3c9XFxcInR0U2hvd1xcXCIgbmctc3R5bGU9XFxcInBvc2l0aW9uXFxcIj4je19jdXN0b21UZW1wbH08L2Rpdj5cIlxuICAgICAgICAgIF9jb21waWxlZFRlbXBsID0gJGNvbXBpbGUoX2N1c3RvbVRlbXBsV3JhcHBlZCkoX3RlbXBsU2NvcGUpXG5cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hcmVhID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXJlYVNlbGVjdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfYXJlYVNlbGVjdGlvbiA9IHZhbFxuICAgICAgICBfYXJlYSA9IF9hcmVhU2VsZWN0aW9uLm5vZGUoKVxuICAgICAgICBpZiBfc2hvd01hcmtlckxpbmVcbiAgICAgICAgICBtZS50b29sdGlwKF9hcmVhU2VsZWN0aW9uKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuY29udGFpbmVyID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY29udGFpbmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9jb250YWluZXIgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLm1hcmtlclNjYWxlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbWFya2VyU2NhbGVcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgX3Nob3dNYXJrZXJMaW5lID0gdHJ1ZVxuICAgICAgICAgIF9tYXJrZXJTY2FsZSA9IHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJMaW5lID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmRhdGEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9kYXRhXG4gICAgICBlbHNlXG4gICAgICAgIF9kYXRhID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgIF90b29sdGlwRGlzcGF0Y2gub24gbmFtZSwgY2FsbGJhY2tcblxuICAgICMtLS0gVG9vbHRpcCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS50b29sdGlwID0gKHMpIC0+ICMgcmVnaXN0ZXIgdGhlIHRvb2x0aXAgZXZlbnRzIHdpdGggdGhlIHNlbGVjdGlvblxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIG1lXG4gICAgICBlbHNlICAjIHNldCB0b29sdGlwIGZvciBhbiBvYmplY3RzIHNlbGVjdGlvblxuICAgICAgICBzLm9uICdtb3VzZWVudGVyLnRvb2x0aXAnLCB0b29sdGlwRW50ZXJcbiAgICAgICAgICAub24gJ21vdXNlbW92ZS50b29sdGlwJywgdG9vbHRpcE1vdmVcbiAgICAgICAgICAub24gJ21vdXNlbGVhdmUudG9vbHRpcCcsIHRvb2x0aXBMZWF2ZVxuICAgICAgICBpZiBub3Qgcy5lbXB0eSgpIGFuZCBub3Qgcy5jbGFzc2VkKCd3ay1jaGFydC1vdmVybGF5JylcbiAgICAgICAgICBzLm9uICdtb3VzZWRvd24udG9vbHRpcCcsIGZvcndhcmRUb0JydXNoXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gYmVoYXZpb3JUb29sdGlwIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3InLCAoJGxvZywgJHdpbmRvdywgYmVoYXZpb3JUb29sdGlwLCBiZWhhdmlvckJydXNoLCBiZWhhdmlvclNlbGVjdCkgLT5cblxuICBiZWhhdmlvciA9ICgpIC0+XG5cbiAgICBfdG9vbHRpcCA9IGJlaGF2aW9yVG9vbHRpcCgpXG4gICAgX2JydXNoID0gYmVoYXZpb3JCcnVzaCgpXG4gICAgX3NlbGVjdGlvbiA9IGJlaGF2aW9yU2VsZWN0KClcbiAgICBfYnJ1c2gudG9vbHRpcChfdG9vbHRpcClcblxuICAgIGFyZWEgPSAoYXJlYSkgLT5cbiAgICAgIF9icnVzaC5hcmVhKGFyZWEpXG4gICAgICBfdG9vbHRpcC5hcmVhKGFyZWEpXG5cbiAgICBjb250YWluZXIgPSAoY29udGFpbmVyKSAtPlxuICAgICAgX2JydXNoLmNvbnRhaW5lcihjb250YWluZXIpXG4gICAgICBfc2VsZWN0aW9uLmNvbnRhaW5lcihjb250YWluZXIpXG4gICAgICBfdG9vbHRpcC5jb250YWluZXIoY29udGFpbmVyKVxuXG4gICAgY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBfYnJ1c2guY2hhcnQoY2hhcnQpXG5cbiAgICByZXR1cm4ge3Rvb2x0aXA6X3Rvb2x0aXAsIGJydXNoOl9icnVzaCwgc2VsZWN0ZWQ6X3NlbGVjdGlvbiwgb3ZlcmxheTphcmVhLCBjb250YWluZXI6Y29udGFpbmVyLCBjaGFydDpjaGFydH1cbiAgcmV0dXJuIGJlaGF2aW9yIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnY2hhcnQnLCAoJGxvZywgc2NhbGVMaXN0LCBjb250YWluZXIsIGJlaGF2aW9yLCBkM0FuaW1hdGlvbikgLT5cblxuICBjaGFydENudHIgPSAwXG5cbiAgY2hhcnQgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJjaGFydCN7Y2hhcnRDbnRyKyt9XCJcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0gVmFyaWFibGUgZGVjbGFyYXRpb25zIGFuZCBkZWZhdWx0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfbGF5b3V0cyA9IFtdICAgICAgICAgICAgICAgIyBMaXN0IG9mIGxheW91dHMgZm9yIHRoZSBjaGFydFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWQgICAgIyB0aGUgY2hhcnRzIGRyYXdpbmcgY29udGFpbmVyIG9iamVjdFxuICAgIF9hbGxTY2FsZXMgPSB1bmRlZmluZWQgICAgIyBIb2xkcyBhbGwgc2NhbGVzIG9mIHRoZSBjaGFydCwgcmVnYXJkbGVzcyBvZiBzY2FsZSBvd25lclxuICAgIF9vd25lZFNjYWxlcyA9IHVuZGVmaW5lZCAgIyBob2xkcyB0aGUgc2NsZXMgb3duZWQgYnkgY2hhcnQsIGkuZS4gc2hhcmUgc2NhbGVzXG4gICAgX2RhdGEgPSB1bmRlZmluZWQgICAgICAgICAgICMgcG9pbnRlciB0byB0aGUgbGFzdCBkYXRhIHNldCBib3VuZCB0byBjaGFydFxuICAgIF9zaG93VG9vbHRpcCA9IGZhbHNlICAgICAgICAjIHRvb2x0aXAgcHJvcGVydHlcbiAgICBfdG9vbFRpcFRlbXBsYXRlID0gJydcbiAgICBfdGl0bGUgPSB1bmRlZmluZWRcbiAgICBfc3ViVGl0bGUgPSB1bmRlZmluZWRcbiAgICBfYmVoYXZpb3IgPSBiZWhhdmlvcigpXG4gICAgX2FuaW1hdGlvbkR1cmF0aW9uID0gZDNBbmltYXRpb24uZHVyYXRpb25cblxuICAgICMtLS0gTGlmZUN5Y2xlIERpc3BhdGNoZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfbGlmZUN5Y2xlID0gZDMuZGlzcGF0Y2goJ2NvbmZpZ3VyZScsICdyZXNpemUnLCAncHJlcGFyZURhdGEnLCAnc2NhbGVEb21haW5zJywgJ3NpemVDb250YWluZXInLCAnZHJhd0F4aXMnLCAnZHJhd0NoYXJ0JywgJ25ld0RhdGEnLCAndXBkYXRlJywgJ3VwZGF0ZUF0dHJzJywgJ3Njb3BlQXBwbHknIClcbiAgICBfYnJ1c2ggPSBkMy5kaXNwYXRjaCgnZHJhdycsICdjaGFuZ2UnKVxuXG4gICAgIy0tLSBHZXR0ZXIvU2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKGlkKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuc2hvd1Rvb2x0aXAgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93VG9vbHRpcFxuICAgICAgZWxzZVxuICAgICAgICBfc2hvd1Rvb2x0aXAgPSB0cnVlRmFsc2VcbiAgICAgICAgX2JlaGF2aW9yLnRvb2x0aXAuYWN0aXZlKF9zaG93VG9vbHRpcClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50b29sVGlwVGVtcGxhdGUgPSAocGF0aCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdG9vbFRpcFRlbXBsYXRlXG4gICAgICBlbHNlXG4gICAgICAgIF90b29sVGlwVGVtcGxhdGUgPSBwYXRoXG4gICAgICAgIF9iZWhhdmlvci50b29sdGlwLnRlbXBsYXRlKHBhdGgpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUudGl0bGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90aXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfdGl0bGUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zdWJUaXRsZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3N1YlRpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF9zdWJUaXRsZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFkZExheW91dCA9IChsYXlvdXQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheW91dHNcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheW91dHMucHVzaChsYXlvdXQpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkU2NhbGUgPSAoc2NhbGUsIGxheW91dCkgLT5cbiAgICAgIF9hbGxTY2FsZXMuYWRkKHNjYWxlKVxuICAgICAgaWYgbGF5b3V0XG4gICAgICAgIGxheW91dC5zY2FsZXMoKS5hZGQoc2NhbGUpXG4gICAgICBlbHNlXG4gICAgICAgIF9vd25lZFNjYWxlcy5hZGQoc2NhbGUpXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFuaW1hdGlvbkR1cmF0aW9uID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYW5pbWF0aW9uRHVyYXRpb25cbiAgICAgIGVsc2VcbiAgICAgICAgX2FuaW1hdGlvbkR1cmF0aW9uID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICAjLS0tIEdldHRlciBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUubGlmZUN5Y2xlID0gKHZhbCkgLT5cbiAgICAgIHJldHVybiBfbGlmZUN5Y2xlXG5cbiAgICBtZS5sYXlvdXRzID0gKCkgLT5cbiAgICAgIHJldHVybiBfbGF5b3V0c1xuXG4gICAgbWUuc2NhbGVzID0gKCkgLT5cbiAgICAgIHJldHVybiBfb3duZWRTY2FsZXNcblxuICAgIG1lLmFsbFNjYWxlcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2FsbFNjYWxlc1xuXG4gICAgbWUuaGFzU2NhbGUgPSAoc2NhbGUpIC0+XG4gICAgICByZXR1cm4gISFfYWxsU2NhbGVzLmhhcyhzY2FsZSlcblxuICAgIG1lLmNvbnRhaW5lciA9ICgpIC0+XG4gICAgICByZXR1cm4gX2NvbnRhaW5lclxuXG4gICAgbWUuYnJ1c2ggPSAoKSAtPlxuICAgICAgcmV0dXJuIF9icnVzaFxuXG4gICAgbWUuZ2V0RGF0YSA9ICgpIC0+XG4gICAgICByZXR1cm4gX2RhdGFcblxuICAgIG1lLmJlaGF2aW9yID0gKCkgLT5cbiAgICAgIHJldHVybiBfYmVoYXZpb3JcblxuICAgICMtLS0gQ2hhcnQgZHJhd2luZyBsaWZlIGN5Y2xlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5leGVjTGlmZUN5Y2xlRnVsbCA9IChkYXRhLCBub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIGRhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyBmdWxsIGxpZmUgY3ljbGUnXG4gICAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgICBfbGlmZUN5Y2xlLnByZXBhcmVEYXRhKGRhdGEsIG5vQW5pbWF0aW9uKSAgICAjIGNhbGxzIHRoZSByZWdpc3RlcmVkIGxheW91dCB0eXBlc1xuICAgICAgICBfbGlmZUN5Y2xlLnNjYWxlRG9tYWlucyhkYXRhLCBub0FuaW1hdGlvbikgICAjIGNhbGxzIHJlZ2lzdGVyZWQgdGhlIHNjYWxlc1xuICAgICAgICBfbGlmZUN5Y2xlLnNpemVDb250YWluZXIoZGF0YSwgbm9BbmltYXRpb24pICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChkYXRhLCBub0FuaW1hdGlvbikgICAgICMgY2FsbHMgbGF5b3V0XG5cbiAgICBtZS5yZXNpemVMaWZlQ3ljbGUgPSAobm9BbmltYXRpb24pIC0+XG4gICAgICBpZiBfZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIHJlc2l6ZSBsaWZlIGN5Y2xlJ1xuICAgICAgICBfbGlmZUN5Y2xlLnNpemVDb250YWluZXIoX2RhdGEsIG5vQW5pbWF0aW9uKSAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyhub0FuaW1hdGlvbikgICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KF9kYXRhLCBub0FuaW1hdGlvbilcbiAgICAgICAgX2xpZmVDeWNsZS5zY29wZUFwcGx5KClcblxuICAgIG1lLm5ld0RhdGFMaWZlQ3ljbGUgPSAoZGF0YSwgbm9BbmltYXRpb24pIC0+XG4gICAgICBpZiBkYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgbmV3IGRhdGEgbGlmZSBjeWNsZSdcbiAgICAgICAgX2RhdGEgPSBkYXRhXG4gICAgICAgIF9saWZlQ3ljbGUucHJlcGFyZURhdGEoZGF0YSwgbm9BbmltYXRpb24pICAgICMgY2FsbHMgdGhlIHJlZ2lzdGVyZWQgbGF5b3V0IHR5cGVzXG4gICAgICAgIF9saWZlQ3ljbGUuc2NhbGVEb21haW5zKGRhdGEsIG5vQW5pbWF0aW9uKVxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoZGF0YSwgbm9BbmltYXRpb24pXG5cbiAgICBtZS5hdHRyaWJ1dGVDaGFuZ2UgPSAobm9BbmltYXRpb24pIC0+XG4gICAgICBpZiBfZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIGF0dHJpYnV0ZSBjaGFuZ2UgbGlmZSBjeWNsZSdcbiAgICAgICAgX2xpZmVDeWNsZS5zaXplQ29udGFpbmVyKF9kYXRhLCBub0FuaW1hdGlvbilcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyhub0FuaW1hdGlvbikgICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KF9kYXRhLCBub0FuaW1hdGlvbilcblxuICAgIG1lLmJydXNoRXh0ZW50Q2hhbmdlZCA9ICgpIC0+XG4gICAgICBpZiBfZGF0YVxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKHRydWUpICAgICAgICAgICAgICAjIE5vIEFuaW1hdGlvblxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChfZGF0YSwgdHJ1ZSlcblxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICduZXdEYXRhLmNoYXJ0JywgbWUuZXhlY0xpZmVDeWNsZUZ1bGxcbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAncmVzaXplLmNoYXJ0JywgbWUucmVzaXplTGlmZUN5Y2xlXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ3VwZGF0ZS5jaGFydCcsIChub0FuaW1hdGlvbikgLT4gbWUuZXhlY0xpZmVDeWNsZUZ1bGwoX2RhdGEsIG5vQW5pbWF0aW9uKVxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICd1cGRhdGVBdHRycycsIG1lLmF0dHJpYnV0ZUNoYW5nZVxuXG4gICAgIy0tLSBJbml0aWFsaXphdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9iZWhhdmlvci5jaGFydChtZSlcbiAgICBfY29udGFpbmVyID0gY29udGFpbmVyKCkuY2hhcnQobWUpICAgIyB0aGUgY2hhcnRzIGRyYXdpbmcgY29udGFpbmVyIG9iamVjdFxuICAgIF9hbGxTY2FsZXMgPSBzY2FsZUxpc3QoKSAgICAjIEhvbGRzIGFsbCBzY2FsZXMgb2YgdGhlIGNoYXJ0LCByZWdhcmRsZXNzIG9mIHNjYWxlIG93bmVyXG4gICAgX293bmVkU2NhbGVzID0gc2NhbGVMaXN0KCkgICMgaG9sZHMgdGhlIHNjbGVzIG93bmVkIGJ5IGNoYXJ0LCBpLmUuIHNoYXJlIHNjYWxlc1xuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGNoYXJ0IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnY29udGFpbmVyJywgKCRsb2csICR3aW5kb3csIGQzQ2hhcnRNYXJnaW5zLCBzY2FsZUxpc3QsIGF4aXNDb25maWcsIGQzQW5pbWF0aW9uLCBiZWhhdmlvcikgLT5cblxuICBjb250YWluZXJDbnQgPSAwXG5cbiAgY29udGFpbmVyID0gKCkgLT5cblxuICAgIG1lID0gKCktPlxuXG4gICAgIy0tLSBWYXJpYWJsZSBkZWNsYXJhdGlvbnMgYW5kIGRlZmF1bHRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9jb250YWluZXJJZCA9ICdjbnRucicgKyBjb250YWluZXJDbnQrK1xuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9lbGVtZW50ID0gdW5kZWZpbmVkXG4gICAgX2VsZW1lbnRTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICBfbGF5b3V0cyA9IFtdXG4gICAgX2xlZ2VuZHMgPSBbXVxuICAgIF9zdmcgPSB1bmRlZmluZWRcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX3NwYWNlZENvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9jaGFydEFyZWEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnRBcmVhID0gdW5kZWZpbmVkXG4gICAgX21hcmdpbiA9IGFuZ3VsYXIuY29weShkM0NoYXJ0TWFyZ2lucy5kZWZhdWx0KVxuICAgIF9pbm5lcldpZHRoID0gMFxuICAgIF9pbm5lckhlaWdodCA9IDBcbiAgICBfdGl0bGVIZWlnaHQgPSAwXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfb3ZlcmxheSA9IHVuZGVmaW5lZFxuICAgIF9iZWhhdmlvciA9IHVuZGVmaW5lZFxuICAgIF9kdXJhdGlvbiA9IDBcblxuICAgICMtLS0gR2V0dGVyL1NldHRlciBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5pZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2NvbnRhaW5lcklkXG5cbiAgICBtZS5jaGFydCA9IChjaGFydCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY2hhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgX2NoYXJ0ID0gY2hhcnRcbiAgICAgICAgIyByZWdpc3RlciB0byBsaWZlY3ljbGUgZXZlbnRzXG4gICAgICAgICNfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJzaXplQ29udGFpbmVyLiN7bWUuaWQoKX1cIiwgbWUuc2l6ZUNvbnRhaW5lclxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJkcmF3QXhpcy4je21lLmlkKCl9XCIsIG1lLmRyYXdDaGFydEZyYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZWxlbWVudCA9IChlbGVtKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9lbGVtZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9yZXNpemVIYW5kbGVyID0gKCkgLT4gIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkucmVzaXplKHRydWUpICMgbm8gYW5pbWF0aW9uXG4gICAgICAgIF9lbGVtZW50ID0gZWxlbVxuICAgICAgICBfZWxlbWVudFNlbGVjdGlvbiA9IGQzLnNlbGVjdChfZWxlbWVudClcbiAgICAgICAgaWYgX2VsZW1lbnRTZWxlY3Rpb24uZW1wdHkoKVxuICAgICAgICAgICRsb2cuZXJyb3IgXCJFcnJvcjogRWxlbWVudCAje19lbGVtZW50fSBkb2VzIG5vdCBleGlzdFwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfZ2VuQ2hhcnRGcmFtZSgpXG4gICAgICAgICAgIyBmaW5kIHRoZSBkaXYgZWxlbWVudCB0byBhdHRhY2ggdGhlIGhhbmRsZXIgdG9cbiAgICAgICAgICByZXNpemVUYXJnZXQgPSBfZWxlbWVudFNlbGVjdGlvbi5zZWxlY3QoJy53ay1jaGFydCcpLm5vZGUoKVxuICAgICAgICAgIG5ldyBSZXNpemVTZW5zb3IocmVzaXplVGFyZ2V0LCBfcmVzaXplSGFuZGxlcilcblxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFkZExheW91dCA9IChsYXlvdXQpIC0+XG4gICAgICBfbGF5b3V0cy5wdXNoKGxheW91dClcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuaGVpZ2h0ID0gKCkgLT5cbiAgICAgIHJldHVybiBfaW5uZXJIZWlnaHRcblxuICAgIG1lLndpZHRoID0gKCkgLT5cbiAgICAgIHJldHVybiBfaW5uZXJXaWR0aFxuXG4gICAgbWUubWFyZ2lucyA9ICgpIC0+XG4gICAgICByZXR1cm4gX21hcmdpblxuXG4gICAgbWUuZ2V0Q2hhcnRBcmVhID0gKCkgLT5cbiAgICAgIHJldHVybiBfY2hhcnRBcmVhXG5cbiAgICBtZS5nZXRPdmVybGF5ID0gKCkgLT5cbiAgICAgIHJldHVybiBfb3ZlcmxheVxuXG4gICAgbWUuZ2V0Q29udGFpbmVyID0gKCkgLT5cbiAgICAgIHJldHVybiBfc3BhY2VkQ29udGFpbmVyXG5cbiAgICAjLS0tIHV0aWxpdHkgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIFJldHVybjogdGV4dCBoZWlnaHRcbiAgICBkcmF3QW5kUG9zaXRpb25UZXh0ID0gKGNvbnRhaW5lciwgdGV4dCwgc2VsZWN0b3IsIGZvbnRTaXplLCBvZmZzZXQpIC0+XG4gICAgICBlbGVtID0gY29udGFpbmVyLnNlbGVjdCgnLicgKyBzZWxlY3RvcilcbiAgICAgIGlmIGVsZW0uZW1wdHkoKVxuICAgICAgICBlbGVtID0gY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoe2NsYXNzOnNlbGVjdG9yLCAndGV4dC1hbmNob3InOiAnbWlkZGxlJywgeTppZiBvZmZzZXQgdGhlbiBvZmZzZXQgZWxzZSAwfSlcbiAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsZm9udFNpemUpXG4gICAgICBlbGVtLnRleHQodGV4dClcbiAgICAgICNtZWFzdXJlIHNpemUgYW5kIHJldHVybiBpdFxuICAgICAgcmV0dXJuIGVsZW0ubm9kZSgpLmdldEJCb3goKS5oZWlnaHRcblxuXG4gICAgZHJhd1RpdGxlQXJlYSA9ICh0aXRsZSwgc3ViVGl0bGUpIC0+XG4gICAgICB0aXRsZUFyZWFIZWlnaHQgPSAwXG4gICAgICBhcmVhID0gX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC10aXRsZS1hcmVhJylcbiAgICAgIGlmIGFyZWEuZW1wdHkoKVxuICAgICAgICBhcmVhID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LXRpdGxlLWFyZWEgd2stY2VudGVyLWhvcicpXG4gICAgICBpZiB0aXRsZVxuICAgICAgICBfdGl0bGVIZWlnaHQgPSBkcmF3QW5kUG9zaXRpb25UZXh0KGFyZWEsIHRpdGxlLCAnd2stY2hhcnQtdGl0bGUnLCAnMmVtJylcbiAgICAgIGlmIHN1YlRpdGxlXG4gICAgICAgIGRyYXdBbmRQb3NpdGlvblRleHQoYXJlYSwgc3ViVGl0bGUsICd3ay1jaGFydC1zdWJ0aXRsZScsICcxLjhlbScsIF90aXRsZUhlaWdodClcblxuICAgICAgcmV0dXJuIGFyZWEubm9kZSgpLmdldEJCb3goKS5oZWlnaHRcblxuICAgIGdldEF4aXNSZWN0ID0gKGRpbSkgLT5cbiAgICAgIGF4aXMgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICBkaW0uc2NhbGUoKS5yYW5nZShbMCwxMDBdKVxuICAgICAgYXhpcy5jYWxsKGRpbS5heGlzKCkpXG5cblxuXG4gICAgICBpZiBkaW0ucm90YXRlVGlja0xhYmVscygpXG4gICAgICAgIGF4aXMuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAuYXR0cih7ZHk6Jy0wLjcxZW0nLCB4Oi05fSlcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsXCJ0cmFuc2xhdGUoMCw5KSByb3RhdGUoI3tkaW0ucm90YXRlVGlja0xhYmVscygpfSlcIilcbiAgICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsIGlmIGRpbS5heGlzT3JpZW50KCkgaXMgJ2JvdHRvbScgdGhlbiAnZW5kJyBlbHNlICdzdGFydCcpXG5cbiAgICAgIGJveCA9IGF4aXMubm9kZSgpLmdldEJCb3goKVxuICAgICAgYXhpcy5yZW1vdmUoKVxuICAgICAgcmV0dXJuIGJveFxuXG4gICAgZHJhd0F4aXMgPSAoZGltKSAtPlxuICAgICAgYXhpcyA9IF9jb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtI3tkaW0uYXhpc09yaWVudCgpfVwiKVxuICAgICAgaWYgYXhpcy5lbXB0eSgpXG4gICAgICAgIGF4aXMgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWF4aXMgd2stY2hhcnQtJyArIGRpbS5heGlzT3JpZW50KCkpXG5cbiAgICAgIGF4aXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKF9kdXJhdGlvbikuY2FsbChkaW0uYXhpcygpKVxuXG4gICAgICBpZiBkaW0ucm90YXRlVGlja0xhYmVscygpXG4gICAgICAgIGF4aXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LSN7ZGltLmF4aXNPcmllbnQoKX0ud2stY2hhcnQtYXhpcyB0ZXh0XCIpXG4gICAgICAgICAgLmF0dHIoe2R5OictMC43MWVtJywgeDotOX0pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsXCJ0cmFuc2xhdGUoMCw5KSByb3RhdGUoI3tkaW0ucm90YXRlVGlja0xhYmVscygpfSlcIilcbiAgICAgICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgaWYgZGltLmF4aXNPcmllbnQoKSBpcyAnYm90dG9tJyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0JylcbiAgICAgIGVsc2VcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtI3tkaW0uYXhpc09yaWVudCgpfS53ay1jaGFydC1heGlzIHRleHRcIikuYXR0cigndHJhbnNmb3JtJywgbnVsbClcblxuICAgIF9yZW1vdmVBeGlzID0gKG9yaWVudCkgLT5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtI3tvcmllbnR9XCIpLnJlbW92ZSgpXG5cbiAgICBfcmVtb3ZlTGFiZWwgPSAob3JpZW50KSAtPlxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtbGFiZWwud2stY2hhcnQtI3tvcmllbnR9XCIpLnJlbW92ZSgpXG5cbiAgICBkcmF3R3JpZCA9IChzLCBub0FuaW1hdGlvbikgLT5cbiAgICAgIGR1cmF0aW9uID0gaWYgbm9BbmltYXRpb24gdGhlbiAwIGVsc2UgX2R1cmF0aW9uXG4gICAgICBraW5kID0gcy5raW5kKClcbiAgICAgIHRpY2tzID0gaWYgcy5pc09yZGluYWwoKSB0aGVuIHMuc2NhbGUoKS5yYW5nZSgpIGVsc2Ugcy5zY2FsZSgpLnRpY2tzKClcbiAgICAgIGdyaWRMaW5lcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWdyaWQud2stY2hhcnQtI3traW5kfVwiKS5kYXRhKHRpY2tzLCAoZCkgLT4gZClcbiAgICAgIGdyaWRMaW5lcy5lbnRlcigpLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1ncmlkIHdrLWNoYXJ0LSN7a2luZH1cIilcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuICAgICAgaWYga2luZCBpcyAneSdcbiAgICAgICAgZ3JpZExpbmVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICB4MTowLFxuICAgICAgICAgICAgeDI6IF9pbm5lcldpZHRoLFxuICAgICAgICAgICAgeTE6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiAgZCBlbHNlIHMuc2NhbGUoKShkKSxcbiAgICAgICAgICAgIHkyOihkKSAtPiBpZiBzLmlzT3JkaW5hbCgpIHRoZW4gZCBlbHNlIHMuc2NhbGUoKShkKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgZWxzZVxuICAgICAgICBncmlkTGluZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgIHkxOjAsXG4gICAgICAgICAgICB5MjogX2lubmVySGVpZ2h0LFxuICAgICAgICAgICAgeDE6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkIGVsc2Ugcy5zY2FsZSgpKGQpLFxuICAgICAgICAgICAgeDI6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkIGVsc2Ugcy5zY2FsZSgpKGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICBncmlkTGluZXMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbikuc3R5bGUoJ29wYWNpdHknLDApLnJlbW92ZSgpXG5cbiAgICAjLS0tIEJ1aWxkIHRoZSBjb250YWluZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgYnVpbGQgZ2VuZXJpYyBlbGVtZW50cyBmaXJzdFxuXG4gICAgX2dlbkNoYXJ0RnJhbWUgPSAoKSAtPlxuICAgICAgX3N2ZyA9IF9lbGVtZW50U2VsZWN0aW9uLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQnKS5hcHBlbmQoJ3N2ZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0JylcbiAgICAgIF9zdmcuYXBwZW5kKCdkZWZzJykuYXBwZW5kKCdjbGlwUGF0aCcpLmF0dHIoJ2lkJywgXCJ3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfVwiKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgX2NvbnRhaW5lcj0gX3N2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWNvbnRhaW5lcicpXG4gICAgICBfb3ZlcmxheSA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtb3ZlcmxheScpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdhbGwnKVxuICAgICAgX292ZXJsYXkuYXBwZW5kKCdyZWN0Jykuc3R5bGUoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFja2dyb3VuZCcpLmRhdHVtKHtuYW1lOidiYWNrZ3JvdW5kJ30pXG4gICAgICBfY2hhcnRBcmVhID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcblxuICAgICMgc3RhcnQgdG8gYnVpbGQgYW5kIHNpemUgdGhlIGVsZW1lbnRzIGZyb20gdG9wIHRvIGJvdHRvbVxuXG4gICAgIy0tLSBjaGFydCBmcmFtZSAodGl0bGUsIGF4aXMsIGdyaWQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRyYXdDaGFydEZyYW1lID0gKG5vdEFuaW1hdGVkKSAtPlxuICAgICAgYm91bmRzID0gX2VsZW1lbnRTZWxlY3Rpb24ubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBfZHVyYXRpb24gPSBpZiBub3RBbmltYXRlZCB0aGVuIDAgZWxzZSBtZS5jaGFydCgpLmFuaW1hdGlvbkR1cmF0aW9uKClcbiAgICAgIF9oZWlnaHQgPSBib3VuZHMuaGVpZ2h0XG4gICAgICBfd2lkdGggPSBib3VuZHMud2lkdGhcbiAgICAgIHRpdGxlQXJlYUhlaWdodCA9IGRyYXdUaXRsZUFyZWEoX2NoYXJ0LnRpdGxlKCksIF9jaGFydC5zdWJUaXRsZSgpKVxuXG4gICAgICAjLS0tIGdldCBzaXppbmcgb2YgZnJhbWUgY29tcG9uZW50cyBiZWZvcmUgcG9zaXRpb25pbmcgdGhlbSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF4aXNSZWN0ID0ge3RvcDp7aGVpZ2h0OjAsIHdpZHRoOjB9LGJvdHRvbTp7aGVpZ2h0OjAsIHdpZHRoOjB9LGxlZnQ6e2hlaWdodDowLCB3aWR0aDowfSxyaWdodDp7aGVpZ2h0OjAsIHdpZHRoOjB9fVxuICAgICAgbGFiZWxIZWlnaHQgPSB7dG9wOjAgLGJvdHRvbTowLCBsZWZ0OjAsIHJpZ2h0OjB9XG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKVxuICAgICAgICAgICAgcy5heGlzKCkuc2NhbGUocy5zY2FsZSgpKS5vcmllbnQocy5heGlzT3JpZW50KCkpICAjIGVuc3VyZSB0aGUgYXhpcyB3b3JrcyBvbiB0aGUgcmlnaHQgc2NhbGVcbiAgICAgICAgICAgIGF4aXNSZWN0W3MuYXhpc09yaWVudCgpXSA9IGdldEF4aXNSZWN0KHMpXG4gICAgICAgICAgICAjLS0tIGRyYXcgbGFiZWwgLS0tXG4gICAgICAgICAgICBsYWJlbCA9IF9jb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LSN7cy5heGlzT3JpZW50KCl9XCIpXG4gICAgICAgICAgICBpZiBzLnNob3dMYWJlbCgpXG4gICAgICAgICAgICAgIGlmIGxhYmVsLmVtcHR5KClcbiAgICAgICAgICAgICAgICBsYWJlbCA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGFiZWwgd2stY2hhcnQtJyAgKyBzLmF4aXNPcmllbnQoKSlcbiAgICAgICAgICAgICAgbGFiZWxIZWlnaHRbcy5heGlzT3JpZW50KCldID0gZHJhd0FuZFBvc2l0aW9uVGV4dChsYWJlbCwgcy5heGlzTGFiZWwoKSwgJ3drLWNoYXJ0LWxhYmVsLXRleHQnLCAnMS41ZW0nKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbGFiZWwucmVtb3ZlKClcbiAgICAgICAgICBpZiBzLmF4aXNPcmllbnRPbGQoKSBhbmQgcy5heGlzT3JpZW50T2xkKCkgaXNudCBzLmF4aXNPcmllbnQoKVxuICAgICAgICAgICAgX3JlbW92ZUF4aXMocy5heGlzT3JpZW50T2xkKCkpXG4gICAgICAgICAgICBfcmVtb3ZlTGFiZWwocy5heGlzT3JpZW50T2xkKCkpXG5cblxuXG4gICAgICAjLS0tIGNvbXB1dGUgc2l6ZSBvZiB0aGUgZHJhd2luZyBhcmVhICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9mcmFtZUhlaWdodCA9IHRpdGxlQXJlYUhlaWdodCArIGF4aXNSZWN0LnRvcC5oZWlnaHQgKyBsYWJlbEhlaWdodC50b3AgKyBheGlzUmVjdC5ib3R0b20uaGVpZ2h0ICsgbGFiZWxIZWlnaHQuYm90dG9tICsgX21hcmdpbi50b3AgKyBfbWFyZ2luLmJvdHRvbVxuICAgICAgX2ZyYW1lV2lkdGggPSBheGlzUmVjdC5yaWdodC53aWR0aCArIGxhYmVsSGVpZ2h0LnJpZ2h0ICsgYXhpc1JlY3QubGVmdC53aWR0aCArIGxhYmVsSGVpZ2h0LmxlZnQgKyBfbWFyZ2luLmxlZnQgKyBfbWFyZ2luLnJpZ2h0XG5cbiAgICAgIGlmIF9mcmFtZUhlaWdodCA8IF9oZWlnaHRcbiAgICAgICAgX2lubmVySGVpZ2h0ID0gX2hlaWdodCAtIF9mcmFtZUhlaWdodFxuICAgICAgZWxzZVxuICAgICAgICBfaW5uZXJIZWlnaHQgPSAwXG5cbiAgICAgIGlmIF9mcmFtZVdpZHRoIDwgX3dpZHRoXG4gICAgICAgIF9pbm5lcldpZHRoID0gX3dpZHRoIC0gX2ZyYW1lV2lkdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX2lubmVyV2lkdGggPSAwXG5cbiAgICAgICMtLS0gcmVzZXQgc2NhbGUgcmFuZ2VzIGFuZCByZWRyYXcgYXhpcyB3aXRoIGFkanVzdGVkIHJhbmdlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBmb3IgbCBpbiBfbGF5b3V0c1xuICAgICAgICBmb3IgaywgcyBvZiBsLnNjYWxlcygpLmFsbEtpbmRzKClcbiAgICAgICAgICBpZiBrIGlzICd4JyBvciBrIGlzICdyYW5nZVgnXG4gICAgICAgICAgICBzLnJhbmdlKFswLCBfaW5uZXJXaWR0aF0pXG4gICAgICAgICAgZWxzZSBpZiBrIGlzICd5JyBvciBrIGlzICdyYW5nZVknXG4gICAgICAgICAgICBpZiBsLnNob3dMYWJlbHMoKVxuICAgICAgICAgICAgICBzLnJhbmdlKFtfaW5uZXJIZWlnaHQsIDIwXSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcy5yYW5nZShbX2lubmVySGVpZ2h0LCAwXSlcbiAgICAgICAgICBpZiBzLnNob3dBeGlzKClcbiAgICAgICAgICAgIGRyYXdBeGlzKHMpXG5cbiAgICAgICMtLS0gcG9zaXRpb24gZnJhbWUgZWxlbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsZWZ0TWFyZ2luID0gYXhpc1JlY3QubGVmdC53aWR0aCArIGxhYmVsSGVpZ2h0LmxlZnQgKyBfbWFyZ2luLmxlZnRcbiAgICAgIHRvcE1hcmdpbiA9IHRpdGxlQXJlYUhlaWdodCArIGF4aXNSZWN0LnRvcC5oZWlnaHQgICsgbGFiZWxIZWlnaHQudG9wICsgX21hcmdpbi50b3BcblxuICAgICAgX3NwYWNlZENvbnRhaW5lciA9IF9jb250YWluZXIuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0TWFyZ2lufSwgI3t0b3BNYXJnaW59KVwiKVxuICAgICAgX3N2Zy5zZWxlY3QoXCIjd2stY2hhcnQtY2xpcC0je19jb250YWluZXJJZH0gcmVjdFwiKS5hdHRyKCd3aWR0aCcsIF9pbm5lcldpZHRoKS5hdHRyKCdoZWlnaHQnLCBfaW5uZXJIZWlnaHQpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LW92ZXJsYXk+LndrLWNoYXJ0LWJhY2tncm91bmQnKS5hdHRyKCd3aWR0aCcsIF9pbm5lcldpZHRoKS5hdHRyKCdoZWlnaHQnLCBfaW5uZXJIZWlnaHQpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWFyZWEnKS5zdHlsZSgnY2xpcC1wYXRoJywgXCJ1cmwoI3drLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9KVwiKVxuICAgICAgX3NwYWNlZENvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ2NsaXAtcGF0aCcsIFwidXJsKCN3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfSlcIilcblxuICAgICAgX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1heGlzLndrLWNoYXJ0LXJpZ2h0JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aH0sIDApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtYm90dG9tJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwgI3tfaW5uZXJIZWlnaHR9KVwiKVxuXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LWxlZnQnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgjey1heGlzUmVjdC5sZWZ0LndpZHRoLWxhYmVsSGVpZ2h0LmxlZnQgLyAyIH0sICN7X2lubmVySGVpZ2h0LzJ9KSByb3RhdGUoLTkwKVwiKVxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1sYWJlbC53ay1jaGFydC1yaWdodCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGgrYXhpc1JlY3QucmlnaHQud2lkdGggKyBsYWJlbEhlaWdodC5yaWdodCAvIDJ9LCAje19pbm5lckhlaWdodC8yfSkgcm90YXRlKDkwKVwiKVxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1sYWJlbC53ay1jaGFydC10b3AnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19pbm5lcldpZHRoIC8gMn0sICN7LWF4aXNSZWN0LnRvcC5oZWlnaHQgLSBsYWJlbEhlaWdodC50b3AgLyAyIH0pXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LWJvdHRvbScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGggLyAyfSwgI3tfaW5uZXJIZWlnaHQgKyBheGlzUmVjdC5ib3R0b20uaGVpZ2h0ICsgbGFiZWxIZWlnaHQuYm90dG9tIH0pXCIpXG5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtdGl0bGUtYXJlYScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGgvMn0sICN7LXRvcE1hcmdpbiArIF90aXRsZUhlaWdodH0pXCIpXG5cbiAgICAgICMtLS0gZmluYWxseSwgZHJhdyBncmlkIGxpbmVzXG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKSBhbmQgcy5zaG93R3JpZCgpXG4gICAgICAgICAgICBkcmF3R3JpZChzKVxuXG4gICAgICBfY2hhcnQuYmVoYXZpb3IoKS5vdmVybGF5KF9vdmVybGF5KVxuICAgICAgX2NoYXJ0LmJlaGF2aW9yKCkuY29udGFpbmVyKF9jaGFydEFyZWEpXG5cbiAgICAjLS0tIEJydXNoIEFjY2VsZXJhdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd1NpbmdsZUF4aXMgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBzY2FsZS5zaG93QXhpcygpXG4gICAgICAgIGEgPSBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7c2NhbGUuYXhpcygpLm9yaWVudCgpfVwiKVxuICAgICAgICBhLmNhbGwoc2NhbGUuYXhpcygpKVxuXG4gICAgICAgIGlmIHNjYWxlLnNob3dHcmlkKClcbiAgICAgICAgICBkcmF3R3JpZChzY2FsZSwgdHJ1ZSlcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGNvbnRhaW5lciIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xheW91dCcsICgkbG9nLCBzY2FsZSwgc2NhbGVMaXN0LCB0aW1pbmcpIC0+XG5cbiAgbGF5b3V0Q250ciA9IDBcblxuICBsYXlvdXQgPSAoKSAtPlxuICAgIF9pZCA9IFwibGF5b3V0I3tsYXlvdXRDbnRyKyt9XCJcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gc2NhbGVMaXN0KClcbiAgICBfc2hvd0xhYmVscyA9IGZhbHNlXG4gICAgX2xheW91dExpZmVDeWNsZSA9IGQzLmRpc3BhdGNoKCdjb25maWd1cmUnLCAnZHJhdycsICdwcmVwYXJlRGF0YScsICdicnVzaCcsICdyZWRyYXcnLCAnZHJhd0F4aXMnLCAndXBkYXRlJywgJ3VwZGF0ZUF0dHJzJywgJ2JydXNoRHJhdycpXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBtZS5pZCA9IChpZCkgLT5cbiAgICAgIHJldHVybiBfaWRcblxuICAgIG1lLmNoYXJ0ID0gKGNoYXJ0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSBjaGFydFxuICAgICAgICBfc2NhbGVMaXN0LnBhcmVudFNjYWxlcyhjaGFydC5zY2FsZXMoKSlcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwiY29uZmlndXJlLiN7bWUuaWQoKX1cIiwgKCkgLT4gX2xheW91dExpZmVDeWNsZS5jb25maWd1cmUuYXBwbHkobWUuc2NhbGVzKCkpICNwYXNzdGhyb3VnaFxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJkcmF3Q2hhcnQuI3ttZS5pZCgpfVwiLCBtZS5kcmF3ICMgcmVnaXN0ZXIgZm9yIHRoZSBkcmF3aW5nIGV2ZW50XG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcInByZXBhcmVEYXRhLiN7bWUuaWQoKX1cIiwgbWUucHJlcGFyZURhdGFcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zY2FsZXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zY2FsZUxpc3RcblxuICAgIG1lLnNjYWxlUHJvcGVydGllcyA9ICgpIC0+XG4gICAgICByZXR1cm4gbWUuc2NhbGVzKCkuZ2V0U2NhbGVQcm9wZXJ0aWVzKClcblxuICAgIG1lLmNvbnRhaW5lciA9IChvYmopIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gb2JqXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc2hvd0xhYmVscyA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dMYWJlbHNcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dMYWJlbHMgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5iZWhhdmlvciA9ICgpIC0+XG4gICAgICBtZS5jaGFydCgpLmJlaGF2aW9yKClcblxuICAgIG1lLnByZXBhcmVEYXRhID0gKGRhdGEpIC0+XG4gICAgICBhcmdzID0gW11cbiAgICAgIGZvciBraW5kIGluIFsneCcsJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZScsICdyYW5nZVgnLCAncmFuZ2VZJ11cbiAgICAgICAgYXJncy5wdXNoKF9zY2FsZUxpc3QuZ2V0S2luZChraW5kKSlcbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUucHJlcGFyZURhdGEuYXBwbHkoZGF0YSwgYXJncylcblxuICAgIG1lLmxpZmVDeWNsZSA9ICgpLT5cbiAgICAgIHJldHVybiBfbGF5b3V0TGlmZUN5Y2xlXG5cblxuICAgICMtLS0gRFJZb3V0IGZyb20gZHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBnZXREcmF3QXJlYSA9ICgpIC0+XG4gICAgICBjb250YWluZXIgPSBfY29udGFpbmVyLmdldENoYXJ0QXJlYSgpXG4gICAgICBkcmF3QXJlYSA9IGNvbnRhaW5lci5zZWxlY3QoXCIuI3ttZS5pZCgpfVwiKVxuICAgICAgaWYgZHJhd0FyZWEuZW1wdHkoKVxuICAgICAgICBkcmF3QXJlYSA9IGNvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIChkKSAtPiBtZS5pZCgpKVxuICAgICAgcmV0dXJuIGRyYXdBcmVhXG5cbiAgICBidWlsZEFyZ3MgPSAoZGF0YSwgbm90QW5pbWF0ZWQpIC0+XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICBoZWlnaHQ6X2NvbnRhaW5lci5oZWlnaHQoKSxcbiAgICAgICAgd2lkdGg6X2NvbnRhaW5lci53aWR0aCgpLFxuICAgICAgICBtYXJnaW5zOl9jb250YWluZXIubWFyZ2lucygpLFxuICAgICAgICBkdXJhdGlvbjogaWYgbm90QW5pbWF0ZWQgdGhlbiAwIGVsc2UgbWUuY2hhcnQoKS5hbmltYXRpb25EdXJhdGlvbigpXG4gICAgICB9XG4gICAgICBhcmdzID0gW2RhdGEsIG9wdGlvbnNdXG4gICAgICBmb3Iga2luZCBpbiBbJ3gnLCd5JywgJ2NvbG9yJywgJ3NpemUnLCAnc2hhcGUnLCAncmFuZ2VYJywgJ3JhbmdlWSddXG4gICAgICAgIGFyZ3MucHVzaChfc2NhbGVMaXN0LmdldEtpbmQoa2luZCkpXG4gICAgICByZXR1cm4gYXJnc1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRyYXcgPSAoZGF0YSwgbm90QW5pbWF0ZWQpIC0+XG4gICAgICBfZGF0YSA9IGRhdGFcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5kcmF3LmFwcGx5KGdldERyYXdBcmVhKCksIGJ1aWxkQXJncyhkYXRhLCBub3RBbmltYXRlZCkpXG5cbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ3JlZHJhdycsIG1lLnJlZHJhd1xuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAndXBkYXRlJywgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS51cGRhdGVcbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ2RyYXdBeGlzJywgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5kcmF3QXhpc1xuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAndXBkYXRlQXR0cnMnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnVwZGF0ZUF0dHJzXG5cbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ2JydXNoJywgKGF4aXMsIG5vdEFuaW1hdGVkKSAtPlxuICAgICAgICBfY29udGFpbmVyLmRyYXdTaW5nbGVBeGlzKGF4aXMpXG4gICAgICAgIF9sYXlvdXRMaWZlQ3ljbGUuYnJ1c2hEcmF3LmFwcGx5KGdldERyYXdBcmVhKCksIGJ1aWxkQXJncyhfZGF0YSwgbm90QW5pbWF0ZWQpKVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGxheW91dCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xlZ2VuZCcsICgkbG9nLCAkY29tcGlsZSwgJHJvb3RTY29wZSwgJHRlbXBsYXRlQ2FjaGUsIHRlbXBsYXRlRGlyKSAtPlxuXG4gIGxlZ2VuZENudCA9IDBcblxuICB1bmlxdWVWYWx1ZXMgPSAoYXJyKSAtPlxuICAgIHNldCA9IHt9XG4gICAgZm9yIGUgaW4gYXJyXG4gICAgICBzZXRbZV0gPSAwXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNldClcblxuICBsZWdlbmQgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJsZWdlbmQtI3tsZWdlbmRDbnQrK31cIlxuICAgIF9wb3NpdGlvbiA9ICd0b3AtcmlnaHQnXG4gICAgX3NjYWxlID0gdW5kZWZpbmVkXG4gICAgX3RlbXBsYXRlUGF0aCA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmRTY29wZSA9ICRyb290U2NvcGUuJG5ldyh0cnVlKVxuICAgIF90ZW1wbGF0ZSA9IHVuZGVmaW5lZFxuICAgIF9wYXJzZWRUZW1wbGF0ZSA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXJEaXYgPSB1bmRlZmluZWRcbiAgICBfbGVnZW5kRGl2ID0gdW5kZWZpbmVkXG4gICAgX3RpdGxlID0gdW5kZWZpbmVkXG4gICAgX2xheW91dCA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX29wdGlvbnMgPSB1bmRlZmluZWRcbiAgICBfc2hvdyA9IGZhbHNlXG4gICAgX3Nob3dWYWx1ZXMgPSBmYWxzZVxuXG4gICAgbWUgPSB7fVxuXG4gICAgbWUucG9zaXRpb24gPSAocG9zKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wb3NpdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfcG9zaXRpb24gPSBwb3NcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zaG93ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvdyA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuc2hvd1ZhbHVlcyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dWYWx1ZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dWYWx1ZXMgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmRpdiA9IChzZWxlY3Rpb24pIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xlZ2VuZERpdlxuICAgICAgZWxzZVxuICAgICAgICBfbGVnZW5kRGl2ID0gc2VsZWN0aW9uXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0XG4gICAgICBlbHNlXG4gICAgICAgIF9sYXlvdXQgPSBsYXlvdXRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3NjYWxlID0gc2NhbGVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50aXRsZSA9ICh0aXRsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpdGxlID0gdGl0bGVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50ZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90ZW1wbGF0ZVBhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX3RlbXBsYXRlUGF0aCA9IHBhdGhcbiAgICAgICAgX3RlbXBsYXRlID0gJHRlbXBsYXRlQ2FjaGUuZ2V0KF90ZW1wbGF0ZVBhdGgpXG4gICAgICAgIF9wYXJzZWRUZW1wbGF0ZSA9ICRjb21waWxlKF90ZW1wbGF0ZSkoX2xlZ2VuZFNjb3BlKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmRyYXcgPSAoZGF0YSwgb3B0aW9ucykgLT5cbiAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgX29wdGlvbnMgPSBvcHRpb25zXG4gICAgICAjJGxvZy5pbmZvICdkcmF3aW5nIExlZ2VuZCdcbiAgICAgIF9jb250YWluZXJEaXYgPSBfbGVnZW5kRGl2IG9yIGQzLnNlbGVjdChtZS5zY2FsZSgpLnBhcmVudCgpLmNvbnRhaW5lcigpLmVsZW1lbnQoKSkuc2VsZWN0KCcud2stY2hhcnQnKVxuICAgICAgaWYgbWUuc2hvdygpXG4gICAgICAgIGlmIF9jb250YWluZXJEaXYuc2VsZWN0KCcud2stY2hhcnQtbGVnZW5kJykuZW1wdHkoKVxuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChfY29udGFpbmVyRGl2Lm5vZGUoKSkuYXBwZW5kKF9wYXJzZWRUZW1wbGF0ZSlcblxuICAgICAgICBpZiBtZS5zaG93VmFsdWVzKClcbiAgICAgICAgICBsYXllcnMgPSB1bmlxdWVWYWx1ZXMoX3NjYWxlLnZhbHVlKGRhdGEpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzID0gX3NjYWxlLmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHMgPSBfc2NhbGUuc2NhbGUoKVxuICAgICAgICBpZiBtZS5sYXlvdXQoKT8uc2NhbGVzKCkubGF5ZXJTY2FsZSgpXG4gICAgICAgICAgcyA9IG1lLmxheW91dCgpLnNjYWxlcygpLmxheWVyU2NhbGUoKS5zY2FsZSgpXG4gICAgICAgIGlmIF9zY2FsZS5raW5kKCkgaXNudCAnc2hhcGUnXG4gICAgICAgICAgX2xlZ2VuZFNjb3BlLmxlZ2VuZFJvd3MgPSBsYXllcnMubWFwKChkKSAtPiB7dmFsdWU6ZCwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzpzKGQpfX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfbGVnZW5kU2NvcGUubGVnZW5kUm93cyA9IGxheWVycy5tYXAoKGQpIC0+IHt2YWx1ZTpkLCBwYXRoOmQzLnN2Zy5zeW1ib2woKS50eXBlKHMoZCkpLnNpemUoODApKCl9KVxuICAgICAgICAgICMkbG9nLmxvZyBfbGVnZW5kU2NvcGUubGVnZW5kUm93c1xuICAgICAgICBfbGVnZW5kU2NvcGUuc2hvd0xlZ2VuZCA9IHRydWVcbiAgICAgICAgX2xlZ2VuZFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICAgIHBvc2l0aW9uOiBpZiBfbGVnZW5kRGl2IHRoZW4gJ3JlbGF0aXZlJyBlbHNlICdhYnNvbHV0ZSdcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIG5vdCBfbGVnZW5kRGl2XG4gICAgICAgICAgY29udGFpbmVyUmVjdCA9IF9jb250YWluZXJEaXYubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgY2hhcnRBcmVhUmVjdCA9IF9jb250YWluZXJEaXYuc2VsZWN0KCcud2stY2hhcnQtb3ZlcmxheSByZWN0Jykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgZm9yIHAgaW4gX3Bvc2l0aW9uLnNwbGl0KCctJylcbiAgICAgICAgICAgICAgX2xlZ2VuZFNjb3BlLnBvc2l0aW9uW3BdID0gXCIje01hdGguYWJzKGNvbnRhaW5lclJlY3RbcF0gLSBjaGFydEFyZWFSZWN0W3BdKX1weFwiXG4gICAgICAgIF9sZWdlbmRTY29wZS50aXRsZSA9IF90aXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfcGFyc2VkVGVtcGxhdGUucmVtb3ZlKClcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucmVnaXN0ZXIgPSAobGF5b3V0KSAtPlxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uIFwiZHJhdy4je19pZH1cIiwgbWUuZHJhd1xuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50ZW1wbGF0ZSh0ZW1wbGF0ZURpciArICdsZWdlbmQuaHRtbCcpXG5cbiAgICBtZS5yZWRyYXcgPSAoKSAtPlxuICAgICAgaWYgX2RhdGEgYW5kIF9vcHRpb25zXG4gICAgICAgIG1lLmRyYXcoX2RhdGEsIF9vcHRpb25zKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gbGVnZW5kIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnc2NhbGUnLCAoJGxvZywgbGVnZW5kLCBmb3JtYXREZWZhdWx0cywgd2tDaGFydFNjYWxlcykgLT5cblxuICBzY2FsZSA9ICgpIC0+XG4gICAgX2lkID0gJydcbiAgICBfc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgIF9zY2FsZVR5cGUgPSAnbGluZWFyJ1xuICAgIF9leHBvbmVudCA9IDFcbiAgICBfaXNPcmRpbmFsID0gZmFsc2VcbiAgICBfZG9tYWluID0gdW5kZWZpbmVkXG4gICAgX2RvbWFpbkNhbGMgPSB1bmRlZmluZWRcbiAgICBfY2FsY3VsYXRlZERvbWFpbiA9IHVuZGVmaW5lZFxuICAgIF9yZXNldE9uTmV3RGF0YSA9IGZhbHNlXG4gICAgX3Byb3BlcnR5ID0gJydcbiAgICBfbGF5ZXJQcm9wID0gJydcbiAgICBfbGF5ZXJFeGNsdWRlID0gW11cbiAgICBfbG93ZXJQcm9wZXJ0eSA9ICcnXG4gICAgX3VwcGVyUHJvcGVydHkgPSAnJ1xuICAgIF9yYW5nZSA9IHVuZGVmaW5lZFxuICAgIF9yYW5nZVBhZGRpbmcgPSAwLjNcbiAgICBfcmFuZ2VPdXRlclBhZGRpbmcgPSAwLjNcbiAgICBfaW5wdXRGb3JtYXRTdHJpbmcgPSB1bmRlZmluZWRcbiAgICBfaW5wdXRGb3JtYXRGbiA9IChkYXRhKSAtPiBpZiBpc05hTigrZGF0YSkgb3IgXy5pc0RhdGUoZGF0YSkgdGhlbiBkYXRhIGVsc2UgK2RhdGFcblxuICAgIF9zaG93QXhpcyA9IGZhbHNlXG4gICAgX2F4aXNPcmllbnQgPSB1bmRlZmluZWRcbiAgICBfYXhpc09yaWVudE9sZCA9IHVuZGVmaW5lZFxuICAgIF9heGlzID0gdW5kZWZpbmVkXG4gICAgX3RpY2tzID0gdW5kZWZpbmVkXG4gICAgX3RpY2tGb3JtYXQgPSB1bmRlZmluZWRcbiAgICBfdGlja1ZhbHVlcyA9IHVuZGVmaW5lZFxuICAgIF9yb3RhdGVUaWNrTGFiZWxzID0gdW5kZWZpbmVkXG4gICAgX3Nob3dMYWJlbCA9IGZhbHNlXG4gICAgX2F4aXNMYWJlbCA9IHVuZGVmaW5lZFxuICAgIF9zaG93R3JpZCA9IGZhbHNlXG4gICAgX2lzSG9yaXpvbnRhbCA9IGZhbHNlXG4gICAgX2lzVmVydGljYWwgPSBmYWxzZVxuICAgIF9raW5kID0gdW5kZWZpbmVkXG4gICAgX3BhcmVudCA9IHVuZGVmaW5lZFxuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9sYXlvdXQgPSB1bmRlZmluZWRcbiAgICBfbGVnZW5kID0gbGVnZW5kKClcbiAgICBfb3V0cHV0Rm9ybWF0U3RyaW5nID0gdW5kZWZpbmVkXG4gICAgX291dHB1dEZvcm1hdEZuID0gdW5kZWZpbmVkXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICAjLS0tLSB1dGlsaXR5IGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBrZXlzID0gKGRhdGEpIC0+IGlmIF8uaXNBcnJheShkYXRhKSB0aGVuIF8ucmVqZWN0KF8ua2V5cyhkYXRhWzBdKSwgKGQpIC0+IGQgaXMgJyQkaGFzaEtleScpIGVsc2UgXy5yZWplY3QoXy5rZXlzKGRhdGEpLCAoZCkgLT4gZCBpcyAnJCRoYXNoS2V5JylcblxuICAgIGxheWVyVG90YWwgPSAoZCwgbGF5ZXJLZXlzKSAtPlxuICAgICAgbGF5ZXJLZXlzLnJlZHVjZShcbiAgICAgICAgKHByZXYsIG5leHQpIC0+ICtwcmV2ICsgK21lLmxheWVyVmFsdWUoZCxuZXh0KVxuICAgICAgLCAwKVxuXG4gICAgbGF5ZXJNYXggPSAoZGF0YSwgbGF5ZXJLZXlzKSAtPlxuICAgICAgZDMubWF4KGRhdGEsIChkKSAtPiBkMy5tYXgobGF5ZXJLZXlzLCAoaykgLT4gbWUubGF5ZXJWYWx1ZShkLGspKSlcblxuICAgIGxheWVyTWluID0gKGRhdGEsIGxheWVyS2V5cykgLT5cbiAgICAgIGQzLm1pbihkYXRhLCAoZCkgLT4gZDMubWluKGxheWVyS2V5cywgKGspIC0+IG1lLmxheWVyVmFsdWUoZCxrKSkpXG5cbiAgICBwYXJzZWRWYWx1ZSA9ICh2KSAtPlxuICAgICAgaWYgX2lucHV0Rm9ybWF0Rm4ucGFyc2UgdGhlbiBfaW5wdXRGb3JtYXRGbi5wYXJzZSh2KSBlbHNlIF9pbnB1dEZvcm1hdEZuKHYpXG5cbiAgICBjYWxjRG9tYWluID0ge1xuICAgICAgZXh0ZW50OiAoZGF0YSkgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIHJldHVybiBbbGF5ZXJNaW4oZGF0YSwgbGF5ZXJLZXlzKSwgbGF5ZXJNYXgoZGF0YSwgbGF5ZXJLZXlzKV1cbiAgICAgIG1heDogKGRhdGEpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICByZXR1cm4gWzAsIGxheWVyTWF4KGRhdGEsIGxheWVyS2V5cyldXG4gICAgICBtaW46IChkYXRhKSAtPlxuICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgcmV0dXJuIFswLCBsYXllck1pbihkYXRhLCBsYXllcktleXMpXVxuICAgICAgdG90YWxFeHRlbnQ6IChkYXRhKSAtPlxuICAgICAgICBpZiBkYXRhWzBdLmhhc093blByb3BlcnR5KCd0b3RhbCcpXG4gICAgICAgICAgcmV0dXJuIGQzLmV4dGVudChkYXRhLm1hcCgoZCkgLT5cbiAgICAgICAgICAgIGQudG90YWwpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgICAgcmV0dXJuIGQzLmV4dGVudChkYXRhLm1hcCgoZCkgLT5cbiAgICAgICAgICAgIGxheWVyVG90YWwoZCwgbGF5ZXJLZXlzKSkpXG4gICAgICB0b3RhbDogKGRhdGEpIC0+XG4gICAgICAgIGlmIGRhdGFbMF0uaGFzT3duUHJvcGVydHkoJ3RvdGFsJylcbiAgICAgICAgICByZXR1cm4gWzAsIGQzLm1heChkYXRhLm1hcCgoZCkgLT5cbiAgICAgICAgICAgIGQudG90YWwpKV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICAgIHJldHVybiBbMCwgZDMubWF4KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgbGF5ZXJUb3RhbChkLCBsYXllcktleXMpKSldXG4gICAgICByYW5nZUV4dGVudDogKGRhdGEpIC0+XG4gICAgICAgIGlmIG1lLnVwcGVyUHJvcGVydHkoKVxuICAgICAgICAgIHJldHVybiBbZDMubWluKG1lLmxvd2VyVmFsdWUoZGF0YSkpLCBkMy5tYXgobWUudXBwZXJWYWx1ZShkYXRhKSldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBkYXRhLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIHN0YXJ0ID0gbWUubG93ZXJWYWx1ZShkYXRhWzBdKVxuICAgICAgICAgICAgc3RlcCA9IG1lLmxvd2VyVmFsdWUoZGF0YVsxXSkgLSBzdGFydFxuICAgICAgICAgICAgcmV0dXJuIFttZS5sb3dlclZhbHVlKGRhdGFbMF0pLCBzdGFydCArIHN0ZXAgKiAoZGF0YS5sZW5ndGgpIF1cbiAgICAgIHJhbmdlTWluOiAoZGF0YSkgLT5cbiAgICAgICAgcmV0dXJuIFswLCBkMy5taW4obWUubG93ZXJWYWx1ZShkYXRhKSldXG4gICAgICByYW5nZU1heDogKGRhdGEpIC0+XG4gICAgICAgIGlmIG1lLnVwcGVyUHJvcGVydHkoKVxuICAgICAgICAgIHJldHVybiBbMCwgZDMubWF4KG1lLnVwcGVyVmFsdWUoZGF0YSkpXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgc3RhcnQgPSBtZS5sb3dlclZhbHVlKGRhdGFbMF0pXG4gICAgICAgICAgc3RlcCA9IG1lLmxvd2VyVmFsdWUoZGF0YVsxXSkgLSBzdGFydFxuICAgICAgICAgIHJldHVybiBbMCwgc3RhcnQgKyBzdGVwICogKGRhdGEubGVuZ3RoKSBdXG4gICAgICB9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuaWQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9raW5kICsgJy4nICsgX3BhcmVudC5pZCgpXG5cbiAgICBtZS5raW5kID0gKGtpbmQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2tpbmRcbiAgICAgIGVsc2VcbiAgICAgICAgX2tpbmQgPSBraW5kXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucGFyZW50ID0gKHBhcmVudCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcGFyZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5jaGFydCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUubGF5b3V0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0XG4gICAgICBlbHNlXG4gICAgICAgIF9sYXlvdXQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5zY2FsZSA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NjYWxlXG5cbiAgICBtZS5sZWdlbmQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9sZWdlbmRcblxuICAgIG1lLmlzT3JkaW5hbCA9ICgpIC0+XG4gICAgICBfaXNPcmRpbmFsXG5cbiAgICBtZS5pc0hvcml6b250YWwgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9pc0hvcml6b250YWxcbiAgICAgIGVsc2VcbiAgICAgICAgX2lzSG9yaXpvbnRhbCA9IHRydWVGYWxzZVxuICAgICAgICBpZiB0cnVlRmFsc2VcbiAgICAgICAgICBfaXNWZXJ0aWNhbCA9IGZhbHNlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuaXNWZXJ0aWNhbCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2lzVmVydGljYWxcbiAgICAgIGVsc2VcbiAgICAgICAgX2lzVmVydGljYWwgPSB0cnVlRmFsc2VcbiAgICAgICAgaWYgdHJ1ZUZhbHNlXG4gICAgICAgICAgX2lzSG9yaXpvbnRhbCA9IGZhbHNlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tIFNjYWxlVHlwZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnNjYWxlVHlwZSA9ICh0eXBlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zY2FsZVR5cGVcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgZDMuc2NhbGUuaGFzT3duUHJvcGVydHkodHlwZSkgIyBzdXBwb3J0IHRoZSBmdWxsIGxpc3Qgb2YgZDMgc2NhbGUgdHlwZXNcbiAgICAgICAgICBfc2NhbGUgPSBkMy5zY2FsZVt0eXBlXSgpXG4gICAgICAgICAgX3NjYWxlVHlwZSA9IHR5cGVcbiAgICAgICAgICBtZS5mb3JtYXQoZm9ybWF0RGVmYXVsdHMubnVtYmVyKVxuICAgICAgICBlbHNlIGlmIHR5cGUgaXMgJ3RpbWUnICMgdGltZSBzY2FsZSBpcyBpbiBkMy50aW1lIG9iamVjdCwgbm90IGluIGQzLnNjYWxlLlxuICAgICAgICAgIF9zY2FsZSA9IGQzLnRpbWUuc2NhbGUoKVxuICAgICAgICAgIF9zY2FsZVR5cGUgPSAndGltZSdcbiAgICAgICAgICBpZiBfaW5wdXRGb3JtYXRTdHJpbmdcbiAgICAgICAgICAgIG1lLmRhdGFGb3JtYXQoX2lucHV0Rm9ybWF0U3RyaW5nKVxuICAgICAgICAgIG1lLmZvcm1hdChmb3JtYXREZWZhdWx0cy5kYXRlKVxuICAgICAgICBlbHNlIGlmIHdrQ2hhcnRTY2FsZXMuaGFzT3duUHJvcGVydHkodHlwZSlcbiAgICAgICAgICBfc2NhbGVUeXBlID0gdHlwZVxuICAgICAgICAgIF9zY2FsZSA9IHdrQ2hhcnRTY2FsZXNbdHlwZV0oKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJGxvZy5lcnJvciAnRXJyb3I6IGlsbGVnYWwgc2NhbGUgdHlwZTonLCB0eXBlXG5cbiAgICAgICAgX2lzT3JkaW5hbCA9IF9zY2FsZVR5cGUgaW4gWydvcmRpbmFsJywgJ2NhdGVnb3J5MTAnLCAnY2F0ZWdvcnkyMCcsICdjYXRlZ29yeTIwYicsICdjYXRlZ29yeTIwYyddXG4gICAgICAgIGlmIF9yYW5nZVxuICAgICAgICAgIG1lLnJhbmdlKF9yYW5nZSlcblxuICAgICAgICBpZiBfc2hvd0F4aXNcbiAgICAgICAgICBfYXhpcy5zY2FsZShfc2NhbGUpXG5cbiAgICAgICAgaWYgX2V4cG9uZW50IGFuZCBfc2NhbGVUeXBlIGlzICdwb3cnXG4gICAgICAgICAgX3NjYWxlLmV4cG9uZW50KF9leHBvbmVudClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5leHBvbmVudCA9ICh2YWx1ZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZXhwb25lbnRcbiAgICAgIGVsc2VcbiAgICAgICAgX2V4cG9uZW50ID0gdmFsdWVcbiAgICAgICAgaWYgX3NjYWxlVHlwZSBpcyAncG93J1xuICAgICAgICAgIF9zY2FsZS5leHBvbmVudChfZXhwb25lbnQpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBEb21haW4gZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRvbWFpbiA9IChkb20pIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2RvbWFpblxuICAgICAgZWxzZVxuICAgICAgICBfZG9tYWluID0gZG9tXG4gICAgICAgIGlmIF8uaXNBcnJheShfZG9tYWluKVxuICAgICAgICAgIF9zY2FsZS5kb21haW4oX2RvbWFpbilcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5kb21haW5DYWxjID0gKHJ1bGUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIGlmIF9pc09yZGluYWwgdGhlbiB1bmRlZmluZWQgZWxzZSBfZG9tYWluQ2FsY1xuICAgICAgZWxzZVxuICAgICAgICBpZiBjYWxjRG9tYWluLmhhc093blByb3BlcnR5KHJ1bGUpXG4gICAgICAgICAgX2RvbWFpbkNhbGMgPSBydWxlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkbG9nLmVycm9yICdpbGxlZ2FsIGRvbWFpbiBjYWxjdWxhdGlvbiBydWxlOicsIHJ1bGUsIFwiIGV4cGVjdGVkXCIsIF8ua2V5cyhjYWxjRG9tYWluKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmdldERvbWFpbiA9IChkYXRhKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zY2FsZS5kb21haW4oKVxuICAgICAgZWxzZVxuICAgICAgICBpZiBub3QgX2RvbWFpbiBhbmQgbWUuZG9tYWluQ2FsYygpXG4gICAgICAgICAgICByZXR1cm4gX2NhbGN1bGF0ZWREb21haW5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIF9kb21haW5cbiAgICAgICAgICAgIHJldHVybiBfZG9tYWluXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG1lLnZhbHVlKGRhdGEpXG5cbiAgICBtZS5yZXNldE9uTmV3RGF0YSA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Jlc2V0T25OZXdEYXRhXG4gICAgICBlbHNlXG4gICAgICAgIF9yZXNldE9uTmV3RGF0YSA9IHRydWVGYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gUmFuZ2UgRnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5yYW5nZSA9IChyYW5nZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGUucmFuZ2UoKVxuICAgICAgZWxzZVxuICAgICAgICBfcmFuZ2UgPSByYW5nZVxuICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICdvcmRpbmFsJyBhbmQgbWUua2luZCgpIGluIFsneCcsJ3knXVxuICAgICAgICAgICAgX3NjYWxlLnJhbmdlQmFuZHMocmFuZ2UsIF9yYW5nZVBhZGRpbmcsIF9yYW5nZU91dGVyUGFkZGluZylcbiAgICAgICAgZWxzZSBpZiBub3QgKF9zY2FsZVR5cGUgaW4gWydjYXRlZ29yeTEwJywgJ2NhdGVnb3J5MjAnLCAnY2F0ZWdvcnkyMGInLCAnY2F0ZWdvcnkyMGMnXSlcbiAgICAgICAgICBfc2NhbGUucmFuZ2UocmFuZ2UpICMgaWdub3JlIHJhbmdlIGZvciBjb2xvciBjYXRlZ29yeSBzY2FsZXNcblxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnJhbmdlUGFkZGluZyA9IChjb25maWcpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4ge3BhZGRpbmc6X3JhbmdlUGFkZGluZywgb3V0ZXJQYWRkaW5nOl9yYW5nZU91dGVyUGFkZGluZ31cbiAgICAgIGVsc2VcbiAgICAgICAgX3JhbmdlUGFkZGluZyA9IGNvbmZpZy5wYWRkaW5nXG4gICAgICAgIF9yYW5nZU91dGVyUGFkZGluZyA9IGNvbmZpZy5vdXRlclBhZGRpbmdcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIHByb3BlcnR5IHJlbGF0ZWQgYXR0cmlidXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUucHJvcGVydHkgPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcHJvcGVydHlcbiAgICAgIGVsc2VcbiAgICAgICAgX3Byb3BlcnR5ID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxheWVyUHJvcGVydHkgPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5ZXJQcm9wXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllclByb3AgPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJFeGNsdWRlID0gKGV4Y2wpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheWVyRXhjbHVkZVxuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJFeGNsdWRlID0gZXhjbFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxheWVyS2V5cyA9IChkYXRhKSAtPlxuICAgICAgaWYgX3Byb3BlcnR5XG4gICAgICAgIGlmIF8uaXNBcnJheShfcHJvcGVydHkpXG4gICAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKF9wcm9wZXJ0eSwga2V5cyhkYXRhKSkgIyBlbnN1cmUgb25seSBrZXlzIGFsc28gaW4gdGhlIGRhdGEgYXJlIHJldHVybmVkIGFuZCAkJGhhc2hLZXkgaXMgbm90IHJldHVybmVkXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gW19wcm9wZXJ0eV0gI2Fsd2F5cyByZXR1cm4gYW4gYXJyYXkgISEhXG4gICAgICBlbHNlXG4gICAgICAgIF8ucmVqZWN0KGtleXMoZGF0YSksIChkKSAtPiBkIGluIF9sYXllckV4Y2x1ZGUpXG5cbiAgICBtZS5sb3dlclByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xvd2VyUHJvcGVydHlcbiAgICAgIGVsc2VcbiAgICAgICAgX2xvd2VyUHJvcGVydHkgPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUudXBwZXJQcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF91cHBlclByb3BlcnR5XG4gICAgICBlbHNlXG4gICAgICAgIF91cHBlclByb3BlcnR5ID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gRGF0YSBGb3JtYXR0aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5kYXRhRm9ybWF0ID0gKGZvcm1hdCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaW5wdXRGb3JtYXRTdHJpbmdcbiAgICAgIGVsc2VcbiAgICAgICAgX2lucHV0Rm9ybWF0U3RyaW5nID0gZm9ybWF0XG4gICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ3RpbWUnXG4gICAgICAgICAgX2lucHV0Rm9ybWF0Rm4gPSBkMy50aW1lLmZvcm1hdChmb3JtYXQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfaW5wdXRGb3JtYXRGbiA9IChkKSAtPiBkXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBDb3JlIGRhdGEgdHJhbnNmb3JtYXRpb24gaW50ZXJmYWNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBpZiBfbGF5ZXJQcm9wXG4gICAgICAgIGlmIF8uaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBwYXJzZWRWYWx1ZShkW19wcm9wZXJ0eV1bX2xheWVyUHJvcF0pKSBlbHNlIHBhcnNlZFZhbHVlKGRhdGFbX3Byb3BlcnR5XVtfbGF5ZXJQcm9wXSlcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3Byb3BlcnR5XSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfcHJvcGVydHldKVxuXG4gICAgbWUubGF5ZXJWYWx1ZSA9IChkYXRhLCBsYXllcktleSkgLT5cbiAgICAgIGlmIF9sYXllclByb3BcbiAgICAgICAgcGFyc2VkVmFsdWUoZGF0YVtsYXllcktleV1bX2xheWVyUHJvcF0pXG4gICAgICBlbHNlXG4gICAgICAgIHBhcnNlZFZhbHVlKGRhdGFbbGF5ZXJLZXldKVxuXG4gICAgbWUubG93ZXJWYWx1ZSA9IChkYXRhKSAtPlxuICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX2xvd2VyUHJvcGVydHldKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW19sb3dlclByb3BlcnR5XSlcblxuICAgIG1lLnVwcGVyVmFsdWUgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF8uaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBwYXJzZWRWYWx1ZShkW191cHBlclByb3BlcnR5XSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfdXBwZXJQcm9wZXJ0eV0pXG5cbiAgICBtZS5mb3JtYXR0ZWRWYWx1ZSA9IChkYXRhKSAtPlxuICAgICAgbWUuZm9ybWF0VmFsdWUobWUudmFsdWUoZGF0YSkpXG5cbiAgICBtZS5mb3JtYXRWYWx1ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBfb3V0cHV0Rm9ybWF0U3RyaW5nIGFuZCB2YWwgYW5kICAodmFsLmdldFVUQ0RhdGUgb3Igbm90IGlzTmFOKHZhbCkpXG4gICAgICAgIF9vdXRwdXRGb3JtYXRGbih2YWwpXG4gICAgICBlbHNlXG4gICAgICAgIHZhbFxuXG4gICAgbWUubWFwID0gKGRhdGEpIC0+XG4gICAgICBpZiBBcnJheS5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IF9zY2FsZShtZS52YWx1ZShkYXRhKSkpIGVsc2UgX3NjYWxlKG1lLnZhbHVlKGRhdGEpKVxuXG4gICAgbWUuaW52ZXJ0ID0gKG1hcHBlZFZhbHVlKSAtPlxuICAgICAgIyB0YWtlcyBhIG1hcHBlZCB2YWx1ZSAocGl4ZWwgcG9zaXRpb24gLCBjb2xvciB2YWx1ZSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSBpbiB0aGUgaW5wdXQgZG9tYWluXG4gICAgICAjIHRoZSB0eXBlIG9mIGludmVyc2UgaXMgZGVwZW5kZW50IG9uIHRoZSBzY2FsZSB0eXBlIGZvciBxdWFudGl0YXRpdmUgc2NhbGVzLlxuICAgICAgIyBPcmRpbmFsIHNjYWxlcyAuLi5cblxuICAgICAgaWYgXy5oYXMobWUuc2NhbGUoKSwnaW52ZXJ0JykgIyBpLmUuIHRoZSBkMyBzY2FsZSBzdXBwb3J0cyB0aGUgaW52ZXJzZSBjYWxjdWxhdGlvbjogbGluZWFyLCBsb2csIHBvdywgc3FydFxuICAgICAgICBfZGF0YSA9IG1lLmNoYXJ0KCkuZ2V0RGF0YSgpXG5cbiAgICAgICAgIyBiaXNlY3QubGVmdCBuZXZlciByZXR1cm5zIDAgaW4gdGhpcyBzcGVjaWZpYyBzY2VuYXJpby4gV2UgbmVlZCB0byBtb3ZlIHRoZSB2YWwgYnkgYW4gaW50ZXJ2YWwgdG8gaGl0IHRoZSBtaWRkbGUgb2YgdGhlIHJhbmdlIGFuZCB0byBlbnN1cmVcbiAgICAgICAgIyB0aGF0IHRoZSBmaXJzdCBlbGVtZW50IHdpbGwgYmUgY2FwdHVyZWQuIEFsc28gZW5zdXJlcyBiZXR0ZXIgdmlzdWFsIGV4cGVyaWVuY2Ugd2l0aCB0b29sdGlwc1xuICAgICAgICBpZiBtZS5raW5kKCkgaXMgJ3JhbmdlWCcgb3IgbWUua2luZCgpIGlzICdyYW5nZVknXG4gICAgICAgICAgdmFsID0gbWUuc2NhbGUoKS5pbnZlcnQobWFwcGVkVmFsdWUpXG4gICAgICAgICAgaWYgbWUudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgICBiaXNlY3QgPSBkMy5iaXNlY3RvcihtZS51cHBlclZhbHVlKS5sZWZ0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RlcCA9IG1lLmxvd2VyVmFsdWUoX2RhdGFbMV0pIC0gbWUubG93ZXJWYWx1ZShfZGF0YVswXSlcbiAgICAgICAgICAgIGJpc2VjdCA9IGQzLmJpc2VjdG9yKChkKSAtPiBtZS5sb3dlclZhbHVlKGQpICsgc3RlcCkubGVmdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmFuZ2UgPSBfc2NhbGUucmFuZ2UoKVxuICAgICAgICAgIGludGVydmFsID0gKHJhbmdlWzFdIC0gcmFuZ2VbMF0pIC8gX2RhdGEubGVuZ3RoXG4gICAgICAgICAgdmFsID0gbWUuc2NhbGUoKS5pbnZlcnQobWFwcGVkVmFsdWUgLSBpbnRlcnZhbC8yKVxuICAgICAgICAgIGJpc2VjdCA9IGQzLmJpc2VjdG9yKG1lLnZhbHVlKS5sZWZ0XG5cbiAgICAgICAgaWR4ID0gYmlzZWN0KF9kYXRhLCB2YWwpXG4gICAgICAgIGlkeCA9IGlmIGlkeCA8IDAgdGhlbiAwIGVsc2UgaWYgaWR4ID49IF9kYXRhLmxlbmd0aCB0aGVuIF9kYXRhLmxlbmd0aCAtIDEgZWxzZSBpZHhcbiAgICAgICAgcmV0dXJuIGlkeCAjIHRoZSBpbnZlcnNlIHZhbHVlIGRvZXMgbm90IG5lY2Vzc2FyaWx5IGNvcnJlc3BvbmQgdG8gYSB2YWx1ZSBpbiB0aGUgZGF0YVxuXG4gICAgICBpZiBfLmhhcyhtZS5zY2FsZSgpLCdpbnZlcnRFeHRlbnQnKSAjIGQzIHN1cHBvcnRzIHRoaXMgZm9yIHF1YW50aXplLCBxdWFudGlsZSwgdGhyZXNob2xkLiByZXR1cm5zIHRoZSByYW5nZSB0aGF0IGdldHMgbWFwcGVkIHRvIHRoZSB2YWx1ZVxuICAgICAgICByZXR1cm4gbWUuc2NhbGUoKS5pbnZlcnRFeHRlbnQobWFwcGVkVmFsdWUpICNUT0RPIEhvdyBzaG91bGQgdGhpcyBiZSBtYXBwZWQgY29ycmVjdGx5LiBVc2UgY2FzZT8/P1xuXG4gICAgICAjIGQzIGRvZXMgbm90IHN1cHBvcnQgaW52ZXJ0IGZvciBvcmRpbmFsIHNjYWxlcywgdGh1cyB0aGluZ3MgYmVjb21lIGEgYml0IG1vcmUgdHJpY2t5LlxuICAgICAgIyBpbiBjYXNlIHdlIGFyZSBzZXR0aW5nIHRoZSBkb21haW4gZXhwbGljaXRseSwgd2Uga25vdyB0aGEgdGhlIHJhbmdlIHZhbHVlcyBhbmQgdGhlIGRvbWFpbiBlbGVtZW50cyBhcmUgaW4gdGhlIHNhbWUgb3JkZXJcbiAgICAgICMgaW4gY2FzZSB0aGUgZG9tYWluIGlzIHNldCAnbGF6eScgKGkuZS4gYXMgdmFsdWVzIGFyZSB1c2VkKSB3ZSBjYW5ub3QgbWFwIHJhbmdlIGFuZCBkb21haW4gdmFsdWVzIGVhc2lseS4gTm90IGNsZWFyIGhvdyB0byBkbyB0aGlzIGVmZmVjdGl2ZWx5XG5cbiAgICAgIGlmIG1lLnJlc2V0T25OZXdEYXRhKClcbiAgICAgICAgZG9tYWluID0gX3NjYWxlLmRvbWFpbigpXG4gICAgICAgIHJhbmdlID0gX3NjYWxlLnJhbmdlKClcbiAgICAgICAgaWYgX2lzVmVydGljYWxcbiAgICAgICAgICBpbnRlcnZhbCA9IHJhbmdlWzBdIC0gcmFuZ2VbMV1cbiAgICAgICAgICBpZHggPSByYW5nZS5sZW5ndGggLSBNYXRoLmZsb29yKG1hcHBlZFZhbHVlIC8gaW50ZXJ2YWwpIC0gMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaW50ZXJ2YWwgPSByYW5nZVsxXSAtIHJhbmdlWzBdXG4gICAgICAgICAgaWR4ID0gTWF0aC5mbG9vcihtYXBwZWRWYWx1ZSAvIGludGVydmFsKVxuICAgICAgICByZXR1cm4gaWR4XG5cbiAgICBtZS5pbnZlcnRPcmRpbmFsID0gKG1hcHBlZFZhbHVlKSAtPlxuICAgICAgaWYgbWUuaXNPcmRpbmFsKCkgYW5kIG1lLnJlc2V0T25OZXdEYXRhKClcbiAgICAgICAgaWR4ID0gbWUuaW52ZXJ0KG1hcHBlZFZhbHVlKVxuICAgICAgICByZXR1cm4gX3NjYWxlLmRvbWFpbigpW2lkeF1cblxuXG4gICAgIy0tLSBBeGlzIEF0dHJpYnV0ZXMgYW5kIGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnNob3dBeGlzID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0F4aXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dBeGlzID0gdHJ1ZUZhbHNlXG4gICAgICAgIGlmIHRydWVGYWxzZVxuICAgICAgICAgIF9heGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2F4aXMgPSB1bmRlZmluZWRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5heGlzT3JpZW50ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXhpc09yaWVudFxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc09yaWVudE9sZCA9IF9heGlzT3JpZW50XG4gICAgICAgIF9heGlzT3JpZW50ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5heGlzT3JpZW50T2xkID0gKHZhbCkgLT4gICNUT0RPIFRoaXMgaXMgbm90IHRoZSBiZXN0IHBsYWNlIHRvIGtlZXAgdGhlIG9sZCBheGlzIHZhbHVlLiBPbmx5IG5lZWRlZCBieSBjb250YWluZXIgaW4gY2FzZSB0aGUgYXhpcyBwb3NpdGlvbiBjaGFuZ2VzXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2F4aXNPcmllbnRPbGRcbiAgICAgIGVsc2VcbiAgICAgICAgX2F4aXNPcmllbnRPbGQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9heGlzXG5cbiAgICBtZS50aWNrcyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpY2tzXG4gICAgICBlbHNlXG4gICAgICAgIF90aWNrcyA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja3MoX3RpY2tzKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUudGlja0Zvcm1hdCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpY2tGb3JtYXRcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tGb3JtYXQgPSB2YWxcbiAgICAgICAgaWYgbWUuYXhpcygpXG4gICAgICAgICAgbWUuYXhpcygpLnRpY2tGb3JtYXQodmFsKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUudGlja1ZhbHVlcyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpY2tWYWx1ZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tWYWx1ZXMgPSB2YWxcbiAgICAgICAgaWYgbWUuYXhpcygpXG4gICAgICAgICAgbWUuYXhpcygpLnRpY2tWYWx1ZXModmFsKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNob3dMYWJlbCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dMYWJlbFxuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0xhYmVsID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5heGlzTGFiZWwgPSAodGV4dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gaWYgX2F4aXNMYWJlbCB0aGVuIF9heGlzTGFiZWwgZWxzZSBtZS5wcm9wZXJ0eSgpXG4gICAgICBlbHNlXG4gICAgICAgIF9heGlzTGFiZWwgPSB0ZXh0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucm90YXRlVGlja0xhYmVscyA9IChuYnIpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3JvdGF0ZVRpY2tMYWJlbHNcbiAgICAgIGVsc2VcbiAgICAgICAgX3JvdGF0ZVRpY2tMYWJlbHMgPSBuYnJcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5mb3JtYXQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9vdXRwdXRGb3JtYXRTdHJpbmdcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBfb3V0cHV0Rm9ybWF0U3RyaW5nID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfb3V0cHV0Rm9ybWF0U3RyaW5nID0gaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnIHRoZW4gZm9ybWF0RGVmYXVsdHMuZGF0ZSBlbHNlIGZvcm1hdERlZmF1bHRzLm51bWJlclxuICAgICAgICBfb3V0cHV0Rm9ybWF0Rm4gPSBpZiBtZS5zY2FsZVR5cGUoKSBpcyAndGltZScgdGhlbiBkMy50aW1lLmZvcm1hdChfb3V0cHV0Rm9ybWF0U3RyaW5nKSBlbHNlIGQzLmZvcm1hdChfb3V0cHV0Rm9ybWF0U3RyaW5nKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuc2hvd0dyaWQgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93R3JpZFxuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0dyaWQgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0gUmVnaXN0ZXIgZm9yIGRyYXdpbmcgbGlmZWN5Y2xlIGV2ZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUucmVnaXN0ZXIgPSAoKSAtPlxuICAgICAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5vbiBcInNjYWxlRG9tYWlucy4je21lLmlkKCl9XCIsIChkYXRhKSAtPlxuICAgICAgICAjIHNldCB0aGUgZG9tYWluIGlmIHJlcXVpcmVkXG4gICAgICAgIGlmIG1lLnJlc2V0T25OZXdEYXRhKClcbiAgICAgICAgICAjIGVuc3VyZSByb2J1c3QgYmVoYXZpb3IgaW4gY2FzZSBvZiBwcm9ibGVtYXRpYyBkZWZpbml0aW9uc1xuICAgICAgICAgIGRvbWFpbiA9IG1lLmdldERvbWFpbihkYXRhKVxuICAgICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ2xpbmVhcicgYW5kIF8uc29tZShkb21haW4sIGlzTmFOKVxuICAgICAgICAgICAgdGhyb3cgXCJTY2FsZSAje21lLmtpbmQoKX0sIFR5cGUgJyN7X3NjYWxlVHlwZX0nOiBjYW5ub3QgY29tcHV0ZSBkb21haW4gZm9yIHByb3BlcnR5ICcje19wcm9wZXJ0eX0nIC4gUG9zc2libGUgcmVhc29uczogcHJvcGVydHkgbm90IHNldCwgZGF0YSBub3QgY29tcGF0aWJsZSB3aXRoIGRlZmluZWQgdHlwZS4gRG9tYWluOiN7ZG9tYWlufVwiXG5cbiAgICAgICAgICBfc2NhbGUuZG9tYWluKGRvbWFpbilcblxuICAgICAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5vbiBcInByZXBhcmVEYXRhLiN7bWUuaWQoKX1cIiwgKGRhdGEpIC0+XG4gICAgICAgICMgY29tcHV0ZSB0aGUgZG9tYWluIHJhbmdlIGNhbGN1bGF0aW9uIGlmIHJlcXVpcmVkXG4gICAgICAgIGNhbGNSdWxlID0gIG1lLmRvbWFpbkNhbGMoKVxuICAgICAgICBpZiBtZS5wYXJlbnQoKS5zY2FsZVByb3BlcnRpZXNcbiAgICAgICAgICBtZS5sYXllckV4Y2x1ZGUobWUucGFyZW50KCkuc2NhbGVQcm9wZXJ0aWVzKCkpXG4gICAgICAgIGlmIGNhbGNSdWxlIGFuZCBjYWxjRG9tYWluW2NhbGNSdWxlXVxuICAgICAgICAgIF9jYWxjdWxhdGVkRG9tYWluID0gY2FsY0RvbWFpbltjYWxjUnVsZV0oZGF0YSlcblxuICAgIG1lLnVwZGF0ZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLnVwZGF0ZShub0FuaW1hdGlvbilcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUudXBkYXRlQXR0cnMgPSAoKSAtPlxuICAgICAgbWUucGFyZW50KCkubGlmZUN5Y2xlKCkudXBkYXRlQXR0cnMoKVxuXG4gICAgbWUuZHJhd0F4aXMgPSAoKSAtPlxuICAgICAgbWUucGFyZW50KCkubGlmZUN5Y2xlKCkuZHJhd0F4aXMoKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gc2NhbGUiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdzY2FsZUxpc3QnLCAoJGxvZykgLT5cbiAgcmV0dXJuIHNjYWxlTGlzdCA9ICgpIC0+XG4gICAgX2xpc3QgPSB7fVxuICAgIF9raW5kTGlzdCA9IHt9XG4gICAgX3BhcmVudExpc3QgPSB7fVxuICAgIF9vd25lciA9IHVuZGVmaW5lZFxuICAgIF9yZXF1aXJlZFNjYWxlcyA9IFtdXG4gICAgX2xheWVyU2NhbGUgPSB1bmRlZmluZWRcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLm93bmVyID0gKG93bmVyKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9vd25lclxuICAgICAgZWxzZVxuICAgICAgICBfb3duZXIgPSBvd25lclxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFkZCA9IChzY2FsZSkgLT5cbiAgICAgIGlmIF9saXN0W3NjYWxlLmlkKCldXG4gICAgICAgICRsb2cuZXJyb3IgXCJzY2FsZUxpc3QuYWRkOiBzY2FsZSAje3NjYWxlLmlkKCl9IGFscmVhZHkgZGVmaW5lZCBpbiBzY2FsZUxpc3Qgb2YgI3tfb3duZXIuaWQoKX0uIER1cGxpY2F0ZSBzY2FsZXMgYXJlIG5vdCBhbGxvd2VkXCJcbiAgICAgIF9saXN0W3NjYWxlLmlkKCldID0gc2NhbGVcbiAgICAgIF9raW5kTGlzdFtzY2FsZS5raW5kKCldID0gc2NhbGVcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuaGFzU2NhbGUgPSAoc2NhbGUpIC0+XG4gICAgICBzID0gbWUuZ2V0S2luZChzY2FsZS5raW5kKCkpXG4gICAgICByZXR1cm4gcy5pZCgpIGlzIHNjYWxlLmlkKClcblxuICAgIG1lLmdldEtpbmQgPSAoa2luZCkgLT5cbiAgICAgIGlmIF9raW5kTGlzdFtraW5kXSB0aGVuIF9raW5kTGlzdFtraW5kXSBlbHNlIGlmIF9wYXJlbnRMaXN0LmdldEtpbmQgdGhlbiBfcGFyZW50TGlzdC5nZXRLaW5kKGtpbmQpIGVsc2UgdW5kZWZpbmVkXG5cbiAgICBtZS5oYXNLaW5kID0gKGtpbmQpIC0+XG4gICAgICByZXR1cm4gISFtZS5nZXRLaW5kKGtpbmQpXG5cbiAgICBtZS5yZW1vdmUgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBub3QgX2xpc3Rbc2NhbGUuaWQoKV1cbiAgICAgICAgJGxvZy53YXJuIFwic2NhbGVMaXN0LmRlbGV0ZTogc2NhbGUgI3tzY2FsZS5pZCgpfSBub3QgZGVmaW5lZCBpbiBzY2FsZUxpc3Qgb2YgI3tfb3duZXIuaWQoKX0uIElnbm9yaW5nXCJcbiAgICAgICAgcmV0dXJuIG1lXG4gICAgICBkZWxldGUgX2xpc3Rbc2NhbGUuaWQoKV1cbiAgICAgIGRlbGV0ZSBtZVtzY2FsZS5pZF1cbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucGFyZW50U2NhbGVzID0gKHNjYWxlTGlzdCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcGFyZW50TGlzdFxuICAgICAgZWxzZVxuICAgICAgICBfcGFyZW50TGlzdCA9IHNjYWxlTGlzdFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmdldE93bmVkID0gKCkgLT5cbiAgICAgIF9saXN0XG5cbiAgICBtZS5hbGxLaW5kcyA9ICgpIC0+XG4gICAgICByZXQgPSB7fVxuICAgICAgaWYgX3BhcmVudExpc3QuYWxsS2luZHNcbiAgICAgICAgZm9yIGssIHMgb2YgX3BhcmVudExpc3QuYWxsS2luZHMoKVxuICAgICAgICAgIHJldFtrXSA9IHNcbiAgICAgIGZvciBrLHMgb2YgX2tpbmRMaXN0XG4gICAgICAgIHJldFtrXSA9IHNcbiAgICAgIHJldHVybiByZXRcblxuICAgIG1lLnJlcXVpcmVkU2NhbGVzID0gKHJlcSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcmVxdWlyZWRTY2FsZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3JlcXVpcmVkU2NhbGVzID0gcmVxXG4gICAgICAgIGZvciBrIGluIHJlcVxuICAgICAgICAgIGlmIG5vdCBtZS5oYXNLaW5kKGspXG4gICAgICAgICAgICB0aHJvdyBcIkZhdGFsIEVycm9yOiBzY2FsZSAnI3trfScgcmVxdWlyZWQgYnV0IG5vdCBkZWZpbmVkXCJcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZ2V0U2NhbGVzID0gKGtpbmRMaXN0KSAtPlxuICAgICAgbCA9IHt9XG4gICAgICBmb3Iga2luZCBpbiBraW5kTGlzdFxuICAgICAgICBpZiBtZS5oYXNLaW5kKGtpbmQpXG4gICAgICAgICAgbFtraW5kXSA9IG1lLmdldEtpbmQoa2luZClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IFwiRmF0YWwgRXJyb3I6IHNjYWxlICcje2tpbmR9JyByZXF1aXJlZCBidXQgbm90IGRlZmluZWRcIlxuICAgICAgcmV0dXJuIGxcblxuICAgIG1lLmdldFNjYWxlUHJvcGVydGllcyA9ICgpIC0+XG4gICAgICBsID0gW11cbiAgICAgIGZvciBrLHMgb2YgbWUuYWxsS2luZHMoKVxuICAgICAgICBwcm9wID0gcy5wcm9wZXJ0eSgpXG4gICAgICAgIGlmIHByb3BcbiAgICAgICAgICBpZiBBcnJheS5pc0FycmF5KHByb3ApXG4gICAgICAgICAgICBsLmNvbmNhdChwcm9wKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGwucHVzaChwcm9wKVxuICAgICAgcmV0dXJuIGxcblxuICAgIG1lLmxheWVyU2NhbGUgPSAoa2luZCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICBpZiBfbGF5ZXJTY2FsZVxuICAgICAgICAgIHJldHVybiBtZS5nZXRLaW5kKF9sYXllclNjYWxlKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllclNjYWxlID0ga2luZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2xvcicsICgkbG9nLCBzY2FsZSwgbGVnZW5kLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydjb2xvcicsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZUNvbG9yJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIGwgPSB1bmRlZmluZWRcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdjb2xvcidcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnY2F0ZWdvcnkyMCcpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICdzY2FsZVV0aWxzJywgKCRsb2csIHdrQ2hhcnRTY2FsZXMsIHV0aWxzKSAtPlxuXG4gIHBhcnNlTGlzdCA9ICh2YWwpIC0+XG4gICAgaWYgdmFsXG4gICAgICBsID0gdmFsLnRyaW0oKS5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpLnNwbGl0KCcsJykubWFwKChkKSAtPiBkLnJlcGxhY2UoL15bXFxcInwnXXxbXFxcInwnXSQvZywgJycpKVxuICAgICAgbCA9IGwubWFwKChkKSAtPiBpZiBpc05hTihkKSB0aGVuIGQgZWxzZSArZClcbiAgICAgIHJldHVybiBpZiBsLmxlbmd0aCBpcyAxIHRoZW4gcmV0dXJuIGxbMF0gZWxzZSBsXG5cbiAgcmV0dXJuIHtcblxuICAgIG9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lKSAtPlxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3R5cGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiBkMy5zY2FsZS5oYXNPd25Qcm9wZXJ0eSh2YWwpIG9yIHZhbCBpcyAndGltZScgb3Igd2tDaGFydFNjYWxlcy5oYXNPd25Qcm9wZXJ0eSh2YWwpXG4gICAgICAgICAgICBtZS5zY2FsZVR5cGUodmFsKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIHZhbCBpc250ICcnXG4gICAgICAgICAgICAgICMjIG5vIHNjYWxlIGRlZmluZWQsIHVzZSBkZWZhdWx0XG4gICAgICAgICAgICAgICRsb2cuZXJyb3IgXCJFcnJvcjogaWxsZWdhbCBzY2FsZSB2YWx1ZTogI3t2YWx9LiBVc2luZyAnbGluZWFyJyBzY2FsZSBpbnN0ZWFkXCJcbiAgICAgICAgICBtZS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZXhwb25lbnQnLCAodmFsKSAtPlxuICAgICAgICBpZiBtZS5zY2FsZVR5cGUoKSBpcyAncG93JyBhbmQgXy5pc051bWJlcigrdmFsKVxuICAgICAgICAgIG1lLmV4cG9uZW50KCt2YWwpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIG1lLnByb3BlcnR5KHBhcnNlTGlzdCh2YWwpKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGF5ZXJQcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBtZS5sYXllclByb3BlcnR5KHZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3JhbmdlJywgKHZhbCkgLT5cbiAgICAgICAgcmFuZ2UgPSBwYXJzZUxpc3QodmFsKVxuICAgICAgICBpZiBBcnJheS5pc0FycmF5KHJhbmdlKVxuICAgICAgICAgIG1lLnJhbmdlKHJhbmdlKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZGF0ZUZvcm1hdCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIGlmIG1lLnNjYWxlVHlwZSgpIGlzICd0aW1lJ1xuICAgICAgICAgICAgbWUuZGF0YUZvcm1hdCh2YWwpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkb21haW4nLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICAkbG9nLmluZm8gJ2RvbWFpbicsIHZhbFxuICAgICAgICAgIHBhcnNlZExpc3QgPSBwYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIEFycmF5LmlzQXJyYXkocGFyc2VkTGlzdClcbiAgICAgICAgICAgIG1lLmRvbWFpbihwYXJzZWRMaXN0KS51cGRhdGUoKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICRsb2cuZXJyb3IgXCJkb21haW46IG11c3QgYmUgYXJyYXksIG9yIGNvbW1hLXNlcGFyYXRlZCBsaXN0LCBnb3RcIiwgdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLmRvbWFpbih1bmRlZmluZWQpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkb21haW5SYW5nZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIG1lLmRvbWFpbkNhbGModmFsKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGFiZWwnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5heGlzTGFiZWwodmFsKS51cGRhdGVBdHRycygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdmb3JtYXQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5mb3JtYXQodmFsKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncmVzZXQnLCAodmFsKSAtPlxuICAgICAgICBtZS5yZXNldE9uTmV3RGF0YSh1dGlscy5wYXJzZVRydWVGYWxzZSh2YWwpKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG9ic2VydmVBeGlzQXR0cmlidXRlczogKGF0dHJzLCBtZSwgc2NvcGUpIC0+XG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0aWNrRm9ybWF0JywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUudGlja0Zvcm1hdChkMy5mb3JtYXQodmFsKSkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3RpY2tzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUudGlja3MoK3ZhbClcbiAgICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICAgIG1lLnVwZGF0ZUF0dHJzKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2dyaWQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5zaG93R3JpZCh2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJykudXBkYXRlQXR0cnMoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnc2hvd0xhYmVsJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUuc2hvd0xhYmVsKHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnKS51cGRhdGUodHJ1ZSlcblxuXG4gICAgICBzY29wZS4kd2F0Y2ggYXR0cnMuYXhpc0Zvcm1hdHRlcnMsICAodmFsKSAtPlxuICAgICAgICBpZiBfLmlzT2JqZWN0KHZhbClcbiAgICAgICAgICBpZiBfLmhhcyh2YWwsICd0aWNrRm9ybWF0JykgYW5kIF8uaXNGdW5jdGlvbih2YWwudGlja0Zvcm1hdClcbiAgICAgICAgICAgIG1lLnRpY2tGb3JtYXQodmFsLnRpY2tGb3JtYXQpXG4gICAgICAgICAgZWxzZSBpZiBfLmlzU3RyaW5nKHZhbC50aWNrRm9ybWF0KVxuICAgICAgICAgICAgbWUudGlja0Zvcm1hdChkMy5mb3JtYXQodmFsKSlcbiAgICAgICAgICBpZiBfLmhhcyh2YWwsJ3RpY2tWYWx1ZXMnKSBhbmQgXy5pc0FycmF5KHZhbC50aWNrVmFsdWVzKVxuICAgICAgICAgICAgbWUudGlja1ZhbHVlcyh2YWwudGlja1ZhbHVlcylcbiAgICAgICAgICBtZS51cGRhdGUoKVxuXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXM6IChhdHRycywgbWUsIGxheW91dCkgLT5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xlZ2VuZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGwgPSBtZS5sZWdlbmQoKVxuICAgICAgICAgIGwuc2hvd1ZhbHVlcyhmYWxzZSlcbiAgICAgICAgICBzd2l0Y2ggdmFsXG4gICAgICAgICAgICB3aGVuICdmYWxzZSdcbiAgICAgICAgICAgICAgbC5zaG93KGZhbHNlKVxuICAgICAgICAgICAgd2hlbiAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCdcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbih2YWwpLmRpdih1bmRlZmluZWQpLnNob3codHJ1ZSlcbiAgICAgICAgICAgIHdoZW4gJ3RydWUnLCAnJ1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKCd0b3AtcmlnaHQnKS5zaG93KHRydWUpLmRpdih1bmRlZmluZWQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGxlZ2VuZERpdiA9IGQzLnNlbGVjdCh2YWwpXG4gICAgICAgICAgICAgIGlmIGxlZ2VuZERpdi5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJGxvZy53YXJuICdsZWdlbmQgcmVmZXJlbmNlIGRvZXMgbm90IGV4aXN0OicsIHZhbFxuICAgICAgICAgICAgICAgIGwuZGl2KHVuZGVmaW5lZCkuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGwuZGl2KGxlZ2VuZERpdikucG9zaXRpb24oJ3RvcC1sZWZ0Jykuc2hvdyh0cnVlKVxuXG4gICAgICAgICAgbC5zY2FsZShtZSkubGF5b3V0KGxheW91dClcbiAgICAgICAgICBpZiBtZS5wYXJlbnQoKVxuICAgICAgICAgICAgbC5yZWdpc3RlcihtZS5wYXJlbnQoKSlcbiAgICAgICAgICBsLnJlZHJhdygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd2YWx1ZXNMZWdlbmQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBsID0gbWUubGVnZW5kKClcbiAgICAgICAgICBsLnNob3dWYWx1ZXModHJ1ZSlcbiAgICAgICAgICBzd2l0Y2ggdmFsXG4gICAgICAgICAgICB3aGVuICdmYWxzZSdcbiAgICAgICAgICAgICAgbC5zaG93KGZhbHNlKVxuICAgICAgICAgICAgd2hlbiAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCdcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbih2YWwpLmRpdih1bmRlZmluZWQpLnNob3codHJ1ZSlcbiAgICAgICAgICAgIHdoZW4gJ3RydWUnLCAnJ1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKCd0b3AtcmlnaHQnKS5zaG93KHRydWUpLmRpdih1bmRlZmluZWQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGxlZ2VuZERpdiA9IGQzLnNlbGVjdCh2YWwpXG4gICAgICAgICAgICAgIGlmIGxlZ2VuZERpdi5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJGxvZy53YXJuICdsZWdlbmQgcmVmZXJlbmNlIGRvZXMgbm90IGV4aXN0OicsIHZhbFxuICAgICAgICAgICAgICAgIGwuZGl2KHVuZGVmaW5lZCkuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGwuZGl2KGxlZ2VuZERpdikucG9zaXRpb24oJ3RvcC1sZWZ0Jykuc2hvdyh0cnVlKVxuXG4gICAgICAgICAgbC5zY2FsZShtZSkubGF5b3V0KGxheW91dClcbiAgICAgICAgICBpZiBtZS5wYXJlbnQoKVxuICAgICAgICAgICAgbC5yZWdpc3RlcihtZS5wYXJlbnQoKSlcbiAgICAgICAgICBsLnJlZHJhdygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsZWdlbmRUaXRsZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmxlZ2VuZCgpLnRpdGxlKHZhbCkucmVkcmF3KClcblxuICAgICMtLS0gT2JzZXJ2ZSBSYW5nZSBhdHRyaWJ1dGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBvYnNlcnZlclJhbmdlQXR0cmlidXRlczogKGF0dHJzLCBtZSkgLT5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsb3dlclByb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgbnVsbFxuICAgICAgICBtZS5sb3dlclByb3BlcnR5KHBhcnNlTGlzdCh2YWwpKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndXBwZXJQcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIG51bGxcbiAgICAgICAgbWUudXBwZXJQcm9wZXJ0eShwYXJzZUxpc3QodmFsKSkudXBkYXRlKClcblxuICB9XG5cbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc2hhcGUnLCAoJGxvZywgc2NhbGUsIGQzU2hhcGVzLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydzaGFwZScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVNpemUnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3NoYXBlJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgIG1lLnNjYWxlKCkucmFuZ2UoZDNTaGFwZXMpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzaXplJywgKCRsb2csIHNjYWxlLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydzaXplJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlU2l6ZSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnc2l6ZSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICd4JywgKCRsb2csIHNjYWxlLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWyd4JywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVYJ1xuICAgICAgdGhpcy5tZSA9IHNjYWxlKCkgIyBmb3IgQW5ndWxhciAxLjNcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAneCdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBtZS5pc0hvcml6b250YWwodHJ1ZSlcbiAgICAgIG1lLnJlZ2lzdGVyKClcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2F4aXMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgICBpZiB2YWwgaW4gWyd0b3AnLCAnYm90dG9tJ11cbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCh2YWwpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQoJ2JvdHRvbScpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUsIHNjb3BlKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3JvdGF0ZVRpY2tMYWJlbHMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgYW5kIF8uaXNOdW1iZXIoK3ZhbClcbiAgICAgICAgICBtZS5yb3RhdGVUaWNrTGFiZWxzKCt2YWwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS5yb3RhdGVUaWNrTGFiZWxzKHVuZGVmaW5lZClcbiAgICAgICAgbWUudXBkYXRlKHRydWUpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3JhbmdlWCcsICgkbG9nLCBzY2FsZSwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsncmFuZ2VYJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVYJ1xuICAgICAgdGhpcy5tZSA9IHNjYWxlKCkgIyBmb3IgQW5ndWxhciAxLjNcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAncmFuZ2VYJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIG1lLmlzSG9yaXpvbnRhbCh0cnVlKVxuICAgICAgbWUucmVnaXN0ZXIoKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ3RvcCcsICdib3R0b20nXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnYm90dG9tJykuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5zaG93QXhpcyhmYWxzZSkuYXhpc09yaWVudCh1bmRlZmluZWQpXG4gICAgICAgICAgbWUudXBkYXRlKHRydWUpXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgc2NvcGUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlclJhbmdlQXR0cmlidXRlcyhhdHRycyxtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3JvdGF0ZVRpY2tMYWJlbHMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgYW5kIF8uaXNOdW1iZXIoK3ZhbClcbiAgICAgICAgICBtZS5yb3RhdGVUaWNrTGFiZWxzKCt2YWwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS5yb3RhdGVUaWNrTGFiZWxzKHVuZGVmaW5lZClcbiAgICAgICAgbWUudXBkYXRlKHRydWUpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3knLCAoJGxvZywgc2NhbGUsIGxlZ2VuZCwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsneScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVknXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3knXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2xpbmVhcicpXG4gICAgICBtZS5pc1ZlcnRpY2FsKHRydWUpXG4gICAgICBtZS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuICAgICAgbWUucmVnaXN0ZXIoKVxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2F4aXMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgICBpZiB2YWwgaW4gWydsZWZ0JywgJ3JpZ2h0J11cbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCh2YWwpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQoJ2xlZnQnKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLnNob3dBeGlzKGZhbHNlKS5heGlzT3JpZW50KHVuZGVmaW5lZClcbiAgICAgICAgICBtZS51cGRhdGUodHJ1ZSlcblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlQXhpc0F0dHJpYnV0ZXMoYXR0cnMsIG1lLCBzY29wZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3JhbmdlWScsICgkbG9nLCBzY2FsZSwgbGVnZW5kLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydyYW5nZVknLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVZJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdyYW5nZVknXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2xpbmVhcicpXG4gICAgICBtZS5pc1ZlcnRpY2FsKHRydWUpXG4gICAgICBtZS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuICAgICAgbWUucmVnaXN0ZXIoKVxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2F4aXMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgICBpZiB2YWwgaW4gWydsZWZ0JywgJ3JpZ2h0J11cbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCh2YWwpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQoJ2xlZnQnKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLnNob3dBeGlzKGZhbHNlKS5heGlzT3JpZW50KHVuZGVmaW5lZClcbiAgICAgICAgICBtZS51cGRhdGUodHJ1ZSlcblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlQXhpc0F0dHJpYnV0ZXMoYXR0cnMsIG1lLCBzY29wZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVyUmFuZ2VBdHRyaWJ1dGVzKGF0dHJzLG1lKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAnc2VsZWN0aW9uU2hhcmluZycsICgkbG9nKSAtPlxuICBzZWxlY3Rpb24gPSB7fVxuICBjYWxsYmFja3MgPSB7fVxuXG4gIHRoaXMuY3JlYXRlR3JvdXAgPSAoZ3JvdXApIC0+XG5cblxuICB0aGlzLnNldFNlbGVjdGlvbiA9IChzZWxlY3Rpb24sIGdyb3VwKSAtPlxuICAgIGlmIGdyb3VwXG4gICAgICBzZWxlY3Rpb25bZ3JvdXBdID0gc2VsZWN0aW9uXG4gICAgICBpZiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgIGZvciBjYiBpbiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgICAgY2Ioc2VsZWN0aW9uKVxuXG4gIHRoaXMuZ2V0U2VsZWN0aW9uID0gKGdyb3VwKSAtPlxuICAgIGdycCA9IGdyb3VwIG9yICdkZWZhdWx0J1xuICAgIHJldHVybiBzZWxlY3Rpb25bZ3JwXVxuXG4gIHRoaXMucmVnaXN0ZXIgPSAoZ3JvdXAsIGNhbGxiYWNrKSAtPlxuICAgIGlmIGdyb3VwXG4gICAgICBpZiBub3QgY2FsbGJhY2tzW2dyb3VwXVxuICAgICAgICBjYWxsYmFja3NbZ3JvdXBdID0gW11cbiAgICAgICNlbnN1cmUgdGhhdCBjYWxsYmFja3MgYXJlIG5vdCByZWdpc3RlcmVkIG1vcmUgdGhhbiBvbmNlXG4gICAgICBpZiBub3QgXy5jb250YWlucyhjYWxsYmFja3NbZ3JvdXBdLCBjYWxsYmFjaylcbiAgICAgICAgY2FsbGJhY2tzW2dyb3VwXS5wdXNoKGNhbGxiYWNrKVxuXG4gIHRoaXMudW5yZWdpc3RlciA9IChncm91cCwgY2FsbGJhY2spIC0+XG4gICAgaWYgY2FsbGJhY2tzW2dyb3VwXVxuICAgICAgaWR4ID0gY2FsbGJhY2tzW2dyb3VwXS5pbmRleE9mIGNhbGxiYWNrXG4gICAgICBpZiBpZHggPj0gMFxuICAgICAgICBjYWxsYmFja3NbZ3JvdXBdLnNwbGljZShpZHgsIDEpXG5cbiAgcmV0dXJuIHRoaXNcblxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAndGltaW5nJywgKCRsb2cpIC0+XG5cbiAgdGltZXJzID0ge31cbiAgZWxhcHNlZFN0YXJ0ID0gMFxuICBlbGFwc2VkID0gMFxuXG4gIHRoaXMuaW5pdCA9ICgpIC0+XG4gICAgZWxhcHNlZFN0YXJ0ID0gRGF0ZS5ub3coKVxuXG4gIHRoaXMuc3RhcnQgPSAodG9waWMpIC0+XG4gICAgdG9wID0gdGltZXJzW3RvcGljXVxuICAgIGlmIG5vdCB0b3BcbiAgICAgIHRvcCA9IHRpbWVyc1t0b3BpY10gPSB7bmFtZTp0b3BpYywgc3RhcnQ6MCwgdG90YWw6MCwgY2FsbENudDowLCBhY3RpdmU6IGZhbHNlfVxuICAgIHRvcC5zdGFydCA9IERhdGUubm93KClcbiAgICB0b3AuYWN0aXZlID0gdHJ1ZVxuXG4gIHRoaXMuc3RvcCA9ICh0b3BpYykgLT5cbiAgICBpZiB0b3AgPSB0aW1lcnNbdG9waWNdXG4gICAgICB0b3AuYWN0aXZlID0gZmFsc2VcbiAgICAgIHRvcC50b3RhbCArPSBEYXRlLm5vdygpIC0gdG9wLnN0YXJ0XG4gICAgICB0b3AuY2FsbENudCArPSAxXG4gICAgZWxhcHNlZCA9IERhdGUubm93KCkgLSBlbGFwc2VkU3RhcnRcblxuICB0aGlzLnJlcG9ydCA9ICgpIC0+XG4gICAgZm9yIHRvcGljLCB2YWwgb2YgdGltZXJzXG4gICAgICB2YWwuYXZnID0gdmFsLnRvdGFsIC8gdmFsLmNhbGxDbnRcbiAgICAkbG9nLmluZm8gdGltZXJzXG4gICAgJGxvZy5pbmZvICdFbGFwc2VkIFRpbWUgKG1zKScsIGVsYXBzZWRcbiAgICByZXR1cm4gdGltZXJzXG5cbiAgdGhpcy5jbGVhciA9ICgpIC0+XG4gICAgdGltZXJzID0ge31cblxuICByZXR1cm4gdGhpcyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xheWVyZWREYXRhJywgKCRsb2cpIC0+XG5cbiAgbGF5ZXJlZCA9ICgpIC0+XG4gICAgX2RhdGEgPSBbXVxuICAgIF9sYXllcktleXMgPSBbXVxuICAgIF94ID0gdW5kZWZpbmVkXG4gICAgX2NhbGNUb3RhbCA9IGZhbHNlXG4gICAgX21pbiA9IEluZmluaXR5XG4gICAgX21heCA9IC1JbmZpbml0eVxuICAgIF90TWluID0gSW5maW5pdHlcbiAgICBfdE1heCA9IC1JbmZpbml0eVxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgbWUuZGF0YSA9IChkYXQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIElzIDBcbiAgICAgICAgcmV0dXJuIF9kYXRhXG4gICAgICBlbHNlXG4gICAgICAgIF9kYXRhID0gZGF0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJLZXlzID0gKGtleXMpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIF9sYXllcktleXNcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyS2V5cyA9IGtleXNcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS54ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIF94XG4gICAgICBlbHNlXG4gICAgICAgIF94ID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmNhbGNUb3RhbCA9ICh0X2YpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIF9jYWxjVG90YWxcbiAgICAgIGVsc2VcbiAgICAgICAgX2NhbGNUb3RhbCA9IHRfZlxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLm1pbiA9ICgpIC0+XG4gICAgICBfbWluXG5cbiAgICBtZS5tYXggPSAoKSAtPlxuICAgICAgX21heFxuXG4gICAgbWUubWluVG90YWwgPSAoKSAtPlxuICAgICAgX3RNaW5cblxuICAgIG1lLm1heFRvdGFsID0gKCkgLT5cbiAgICAgIF90TWF4XG5cbiAgICBtZS5leHRlbnQgPSAoKSAtPlxuICAgICAgW21lLm1pbigpLCBtZS5tYXgoKV1cblxuICAgIG1lLnRvdGFsRXh0ZW50ID0gKCkgLT5cbiAgICAgIFttZS5taW5Ub3RhbCgpLCBtZS5tYXhUb3RhbCgpXVxuXG4gICAgbWUuY29sdW1ucyA9IChkYXRhKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxXG4gICAgICAgICNfbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2tleTprLCB2YWx1ZXM6ZGF0YS5tYXAoKGQpIC0+IHt4OiBkW194XSwgdmFsdWU6IGRba10sIGRhdGE6IGR9ICl9KVxuICAgICAgICByZXMgPSBbXVxuICAgICAgICBfbWluID0gSW5maW5pdHlcbiAgICAgICAgX21heCA9IC1JbmZpbml0eVxuICAgICAgICBfdE1pbiA9IEluZmluaXR5XG4gICAgICAgIF90TWF4ID0gLUluZmluaXR5XG5cbiAgICAgICAgZm9yIGssIGkgaW4gX2xheWVyS2V5c1xuICAgICAgICAgIHJlc1tpXSA9IHtrZXk6aywgdmFsdWU6W10sIG1pbjpJbmZpbml0eSwgbWF4Oi1JbmZpbml0eX1cbiAgICAgICAgZm9yIGQsIGkgaW4gZGF0YVxuICAgICAgICAgIHQgPSAwXG4gICAgICAgICAgeHYgPSBpZiB0eXBlb2YgX3ggaXMgJ3N0cmluZycgdGhlbiBkW194XSBlbHNlIF94KGQpXG5cbiAgICAgICAgICBmb3IgbCBpbiByZXNcbiAgICAgICAgICAgIHYgPSArZFtsLmtleV1cbiAgICAgICAgICAgIGwudmFsdWUucHVzaCB7eDp4diwgdmFsdWU6IHYsIGtleTpsLmtleX1cbiAgICAgICAgICAgIGlmIGwubWF4IDwgdiB0aGVuIGwubWF4ID0gdlxuICAgICAgICAgICAgaWYgbC5taW4gPiB2IHRoZW4gbC5taW4gPSB2XG4gICAgICAgICAgICBpZiBfbWF4IDwgdiB0aGVuIF9tYXggPSB2XG4gICAgICAgICAgICBpZiBfbWluID4gdiB0aGVuIF9taW4gPSB2XG4gICAgICAgICAgICBpZiBfY2FsY1RvdGFsIHRoZW4gdCArPSArdlxuICAgICAgICAgIGlmIF9jYWxjVG90YWxcbiAgICAgICAgICAgICN0b3RhbC52YWx1ZS5wdXNoIHt4OmRbX3hdLCB2YWx1ZTp0LCBrZXk6dG90YWwua2V5fVxuICAgICAgICAgICAgaWYgX3RNYXggPCB0IHRoZW4gX3RNYXggPSB0XG4gICAgICAgICAgICBpZiBfdE1pbiA+IHQgdGhlbiBfdE1pbiA9IHRcbiAgICAgICAgcmV0dXJuIHttaW46X21pbiwgbWF4Ol9tYXgsIHRvdGFsTWluOl90TWluLHRvdGFsTWF4Ol90TWF4LCBkYXRhOnJlc31cbiAgICAgIHJldHVybiBtZVxuXG5cblxuICAgIG1lLnJvd3MgPSAoZGF0YSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMVxuICAgICAgICByZXR1cm4gZGF0YS5tYXAoKGQpIC0+IHt4OiBkW194XSwgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7a2V5OmssIHZhbHVlOiBkW2tdLCB4OmRbX3hdfSl9KVxuICAgICAgcmV0dXJuIG1lXG5cblxuICAgIHJldHVybiBtZSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc3ZnSWNvbicsICgkbG9nKSAtPlxuICAjIyBpbnNlcnQgc3ZnIHBhdGggaW50byBpbnRlcnBvbGF0ZWQgSFRNTC4gUmVxdWlyZWQgcHJldmVudCBBbmd1bGFyIGZyb20gdGhyb3dpbmcgZXJyb3IgKEZpeCAyMilcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgdGVtcGxhdGU6ICc8c3ZnIG5nLXN0eWxlPVwic3R5bGVcIj48cGF0aD48L3BhdGg+PC9zdmc+J1xuICAgIHNjb3BlOlxuICAgICAgcGF0aDogXCI9XCJcbiAgICAgIHdpZHRoOiBcIkBcIlxuICAgIGxpbms6IChzY29wZSwgZWxlbSwgYXR0cnMgKSAtPlxuICAgICAgc2NvcGUuc3R5bGUgPSB7ICAjIGZpeCBJRSBwcm9ibGVtIHdpdGggaW50ZXJwb2xhdGluZyBzdHlsZSB2YWx1ZXNcbiAgICAgICAgaGVpZ2h0OiAnMjBweCdcbiAgICAgICAgd2lkdGg6IHNjb3BlLndpZHRoICsgJ3B4J1xuICAgICAgICAndmVydGljYWwtYWxpZ24nOiAnbWlkZGxlJ1xuICAgICAgfVxuICAgICAgc2NvcGUuJHdhdGNoICdwYXRoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgZDMuc2VsZWN0KGVsZW1bMF0pLnNlbGVjdCgncGF0aCcpLmF0dHIoJ2QnLCB2YWwpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDgsOClcIilcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnNlcnZpY2UgJ3V0aWxzJywgKCRsb2cpIC0+XG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIEBkaWZmID0gKGEsYixkaXJlY3Rpb24pIC0+XG4gICAgbm90SW5CID0gKHYpIC0+XG4gICAgICBiLmluZGV4T2YodikgPCAwXG5cbiAgICByZXMgPSB7fVxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IGEubGVuZ3RoXG4gICAgICBpZiBub3RJbkIoYVtpXSlcbiAgICAgICAgcmVzW2FbaV1dID0gdW5kZWZpbmVkXG4gICAgICAgIGogPSBpICsgZGlyZWN0aW9uXG4gICAgICAgIHdoaWxlIDAgPD0gaiA8IGEubGVuZ3RoXG4gICAgICAgICAgaWYgbm90SW5CKGFbal0pXG4gICAgICAgICAgICBqICs9IGRpcmVjdGlvblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc1thW2ldXSA9ICBhW2pdXG4gICAgICAgICAgICBicmVha1xuICAgICAgaSsrXG4gICAgcmV0dXJuIHJlc1xuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBpZCA9IDBcbiAgQGdldElkID0gKCkgLT5cbiAgICByZXR1cm4gJ0NoYXJ0JyArIGlkKytcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgQHBhcnNlTGlzdCA9ICh2YWwpIC0+XG4gICAgaWYgdmFsXG4gICAgICBsID0gdmFsLnRyaW0oKS5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpLnNwbGl0KCcsJykubWFwKChkKSAtPiBkLnJlcGxhY2UoL15bXFxcInwnXXxbXFxcInwnXSQvZywgJycpKVxuICAgICAgcmV0dXJuIGlmIGwubGVuZ3RoIGlzIDEgdGhlbiByZXR1cm4gbFswXSBlbHNlIGxcbiAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgQHBhcnNlVHJ1ZUZhbHNlID0gKHZhbCkgLT5cbiAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJyB0aGVuIHRydWUgZWxzZSAoaWYgdmFsIGlzICdmYWxzZScgdGhlbiBmYWxzZSBlbHNlIHVuZGVmaW5lZClcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgQG1lcmdlRGF0YSA9ICgpIC0+XG5cbiAgICBfcHJldkRhdGEgPSBbXVxuICAgIF9kYXRhID0gW11cbiAgICBfcHJldkhhc2ggPSB7fVxuICAgIF9oYXNoID0ge31cbiAgICBfcHJldkNvbW1vbiA9IFtdXG4gICAgX2NvbW1vbiA9IFtdXG4gICAgX2ZpcnN0ID0gdW5kZWZpbmVkXG4gICAgX2xhc3QgPSB1bmRlZmluZWRcblxuICAgIF9rZXkgPSAoZCkgLT4gZCAjIGlkZW50aXR5XG4gICAgX2xheWVyS2V5ID0gKGQpIC0+IGRcblxuXG4gICAgbWUgPSAoZGF0YSkgLT5cbiAgICAgICMgc2F2ZSBfZGF0YSB0byBfcHJldmlvdXNEYXRhIGFuZCB1cGRhdGUgX3ByZXZpb3VzSGFzaDtcbiAgICAgIF9wcmV2RGF0YSA9IFtdXG4gICAgICBfcHJldkhhc2ggPSB7fVxuICAgICAgZm9yIGQsaSAgaW4gX2RhdGFcbiAgICAgICAgX3ByZXZEYXRhW2ldID0gZDtcbiAgICAgICAgX3ByZXZIYXNoW19rZXkoZCldID0gaVxuXG4gICAgICAjaXRlcmF0ZSBvdmVyIGRhdGEgYW5kIGRldGVybWluZSB0aGUgY29tbW9uIGVsZW1lbnRzXG4gICAgICBfcHJldkNvbW1vbiA9IFtdO1xuICAgICAgX2NvbW1vbiA9IFtdO1xuICAgICAgX2hhc2ggPSB7fTtcbiAgICAgIF9kYXRhID0gZGF0YTtcblxuICAgICAgZm9yIGQsaiBpbiBfZGF0YVxuICAgICAgICBrZXkgPSBfa2V5KGQpXG4gICAgICAgIF9oYXNoW2tleV0gPSBqXG4gICAgICAgIGlmIF9wcmV2SGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpXG4gICAgICAgICAgI2VsZW1lbnQgaXMgaW4gYm90aCBhcnJheXNcbiAgICAgICAgICBfcHJldkNvbW1vbltfcHJldkhhc2hba2V5XV0gPSB0cnVlXG4gICAgICAgICAgX2NvbW1vbltqXSA9IHRydWVcbiAgICAgIHJldHVybiBtZTtcblxuICAgIG1lLmtleSA9IChmbikgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2tleVxuICAgICAgX2tleSA9IGZuO1xuICAgICAgcmV0dXJuIG1lO1xuXG4gICAgbWUuZmlyc3QgPSAoZmlyc3QpIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9maXJzdFxuICAgICAgX2ZpcnN0ID0gZmlyc3RcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGFzdCA9IChsYXN0KSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBfbGFzdFxuICAgICAgX2xhc3QgPSBsYXN0XG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFkZGVkID0gKCkgLT5cbiAgICAgIHJldCA9IFtdO1xuICAgICAgZm9yIGQsIGkgaW4gX2RhdGFcbiAgICAgICAgaWYgIV9jb21tb25baV0gdGhlbiByZXQucHVzaChfZClcbiAgICAgIHJldHVybiByZXRcblxuICAgIG1lLmRlbGV0ZWQgPSAoKSAtPlxuICAgICAgcmV0ID0gW107XG4gICAgICBmb3IgcCwgaSBpbiBfcHJldkRhdGFcbiAgICAgICAgaWYgIV9wcmV2Q29tbW9uW2ldIHRoZW4gcmV0LnB1c2goX3ByZXZEYXRhW2ldKVxuICAgICAgcmV0dXJuIHJldFxuXG4gICAgbWUuY3VycmVudCA9IChrZXkpIC0+XG4gICAgICByZXR1cm4gX2RhdGFbX2hhc2hba2V5XV1cblxuICAgIG1lLnByZXYgPSAoa2V5KSAtPlxuICAgICAgcmV0dXJuIF9wcmV2RGF0YVtfcHJldkhhc2hba2V5XV1cblxuICAgIG1lLmFkZGVkUHJlZCA9IChhZGRlZCkgLT5cbiAgICAgIHByZWRJZHggPSBfaGFzaFtfa2V5KGFkZGVkKV1cbiAgICAgIHdoaWxlICFfY29tbW9uW3ByZWRJZHhdXG4gICAgICAgIGlmIHByZWRJZHgtLSA8IDAgdGhlbiByZXR1cm4gX2ZpcnN0XG4gICAgICByZXR1cm4gX3ByZXZEYXRhW19wcmV2SGFzaFtfa2V5KF9kYXRhW3ByZWRJZHhdKV1dXG5cbiAgICBtZS5hZGRlZFByZWQubGVmdCA9IChhZGRlZCkgLT5cbiAgICAgIG1lLmFkZGVkUHJlZChhZGRlZCkueFxuXG4gICAgbWUuYWRkZWRQcmVkLnJpZ2h0ID0gKGFkZGVkKSAtPlxuICAgICAgb2JqID0gbWUuYWRkZWRQcmVkKGFkZGVkKVxuICAgICAgaWYgXy5oYXMob2JqLCAnd2lkdGgnKSB0aGVuIG9iai54ICsgb2JqLndpZHRoIGVsc2Ugb2JqLnhcblxuICAgIG1lLmRlbGV0ZWRTdWNjID0gKGRlbGV0ZWQpIC0+XG4gICAgICBzdWNjSWR4ID0gX3ByZXZIYXNoW19rZXkoZGVsZXRlZCldXG4gICAgICB3aGlsZSAhX3ByZXZDb21tb25bc3VjY0lkeF1cbiAgICAgICAgaWYgc3VjY0lkeCsrID49IF9wcmV2RGF0YS5sZW5ndGggdGhlbiByZXR1cm4gX2xhc3RcbiAgICAgIHJldHVybiBfZGF0YVtfaGFzaFtfa2V5KF9wcmV2RGF0YVtzdWNjSWR4XSldXVxuXG4gICAgcmV0dXJuIG1lO1xuXG4gIEBtZXJnZVNlcmllcyA9ICAoYU9sZCwgYU5ldykgIC0+XG4gICAgaU9sZCA9IDBcbiAgICBpTmV3ID0gMFxuICAgIGxPbGRNYXggPSBhT2xkLmxlbmd0aCAtIDFcbiAgICBsTmV3TWF4ID0gYU5ldy5sZW5ndGggLSAxXG4gICAgbE1heCA9IE1hdGgubWF4KGxPbGRNYXgsIGxOZXdNYXgpXG4gICAgcmVzdWx0ID0gW11cblxuICAgIHdoaWxlIGlPbGQgPD0gbE9sZE1heCBhbmQgaU5ldyA8PSBsTmV3TWF4XG4gICAgICBpZiArYU9sZFtpT2xkXSBpcyArYU5ld1tpTmV3XVxuICAgICAgICByZXN1bHQucHVzaChbaU9sZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhT2xkW2lPbGRdXSk7XG4gICAgICAgICNjb25zb2xlLmxvZygnc2FtZScsIGFPbGRbaU9sZF0pO1xuICAgICAgICBpT2xkKys7XG4gICAgICAgIGlOZXcrKztcbiAgICAgIGVsc2UgaWYgK2FPbGRbaU9sZF0gPCArYU5ld1tpTmV3XVxuICAgICAgICAjIGFPbGRbaU9sZCBpcyBkZWxldGVkXG4gICAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLHVuZGVmaW5lZCwgYU9sZFtpT2xkXV0pXG4gICAgICAgICMgY29uc29sZS5sb2coJ2RlbGV0ZWQnLCBhT2xkW2lPbGRdKTtcbiAgICAgICAgaU9sZCsrXG4gICAgICBlbHNlXG4gICAgICAgICMgYU5ld1tpTmV3XSBpcyBhZGRlZFxuICAgICAgICByZXN1bHQucHVzaChbdW5kZWZpbmVkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFOZXdbaU5ld11dKVxuICAgICAgICAjIGNvbnNvbGUubG9nKCdhZGRlZCcsIGFOZXdbaU5ld10pO1xuICAgICAgICBpTmV3KytcblxuICAgIHdoaWxlIGlPbGQgPD0gbE9sZE1heFxuICAgICAgIyBpZiB0aGVyZSBpcyBtb3JlIG9sZCBpdGVtcywgbWFyayB0aGVtIGFzIGRlbGV0ZWRcbiAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLHVuZGVmaW5lZCwgYU9sZFtpT2xkXV0pO1xuICAgICAgIyBjb25zb2xlLmxvZygnZGVsZXRlZCcsIGFPbGRbaU9sZF0pO1xuICAgICAgaU9sZCsrO1xuXG4gICAgd2hpbGUgaU5ldyA8PSBsTmV3TWF4XG4gICAgICAjIGlmIHRoZXJlIGlzIG1vcmUgbmV3IGl0ZW1zLCBtYXJrIHRoZW0gYXMgYWRkZWRcbiAgICAgIHJlc3VsdC5wdXNoKFt1bmRlZmluZWQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU5ld1tpTmV3XV0pO1xuICAgICAgIyBjb25zb2xlLmxvZygnYWRkZWQnLCBhTmV3W2lOZXddKTtcbiAgICAgIGlOZXcrKztcblxuICAgIHJldHVybiByZXN1bHRcblxuICByZXR1cm4gQFxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9