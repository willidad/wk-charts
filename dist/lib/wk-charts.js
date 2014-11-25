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
    require: ['^chart', '^layout', '?x', '?y'],
    scope: {
      brushExtent: '=',
      selectedValues: '=',
      selectedDomain: '=',
      change: '&'
    },
    link: function(scope, element, attrs, controllers) {
      var brush, chart, layout, scales, x, xScale, y, yScale, _brushAreaSelection, _brushGroup, _isAreaBrush, _ref, _ref1, _ref2, _selectables;
      chart = controllers[0].me;
      layout = (_ref = controllers[1]) != null ? _ref.me : void 0;
      x = (_ref1 = controllers[2]) != null ? _ref1.me : void 0;
      y = (_ref2 = controllers[3]) != null ? _ref2.me : void 0;
      xScale = void 0;
      yScale = void 0;
      _selectables = void 0;
      _brushAreaSelection = void 0;
      _isAreaBrush = !x && !y;
      _brushGroup = void 0;
      brush = chart.behavior().brush;
      if (!x && !y) {
        scales = layout.scales().getScales(['x', 'y']);
        brush.x(scales.x);
        brush.y(scales.y);
      } else {
        brush.x(x);
        brush.y(y);
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
        if (val !== void 0 && (val === '' || val === 'true')) {
          return me.showTooltip(true);
        } else {
          return me.showTooltip(false);
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

angular.module('wk.chart').directive('area', function($log) {
  var lineCntr;
  lineCntr = 0;
  return {
    restrict: 'A',
    require: 'layout',
    link: function(scope, element, attrs, controller) {
      var area, brush, draw, host, layerKeys, offset, ttMoveData, ttMoveMarker, _circles, _id, _layout, _scaleList, _showMarkers, _tooltip, _ttHighlight;
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
      area = void 0;
      ttMoveData = function(idx) {
        var ttLayers;
        ttLayers = _layout.map(function(l) {
          return {
            name: l.key,
            value: _scaleList.y.formatValue(l.value[idx].y),
            color: {
              'background-color': l.color
            }
          };
        });
        this.headerName = _scaleList.x.axisLabel();
        this.headerValue = _scaleList.x.formatValue(_layout[0].value[idx].x);
        return this.layers = this.layers.concat(ttLayers);
      };
      ttMoveMarker = function(idx) {
        _circles = this.selectAll(".wk-chart-marker-" + _id).data(_layout, function(d) {
          return d.key;
        });
        _circles.enter().append('circle').attr('class', "wk-chart-marker-" + _id).attr('r', _showMarkers ? 8 : 5).style('fill', function(d) {
          return d.color;
        }).style('fill-opacity', 0.6).style('stroke', 'black').style('pointer-events', 'none');
        _circles.attr('cy', function(d) {
          return _scaleList.y.scale()(d.value[idx].y);
        });
        _circles.exit().remove();
        return this.attr('transform', "translate(" + (_scaleList.x.scale()(_layout[0].value[idx].x) + offset) + ")");
      };
      draw = function(data, options, x, y, color) {
        var layers;
        layerKeys = y.layerKeys(data);
        _layout = layerKeys.map((function(_this) {
          return function(key) {
            return {
              key: key,
              color: color.scale()(key),
              value: data.map(function(d) {
                return {
                  x: x.value(d),
                  y: y.layerValue(d, key)
                };
              })
            };
          };
        })(this));
        offset = x.isOrdinal() ? x.scale().rangeBand() / 2 : 0;
        if (_tooltip) {
          _tooltip.data(data);
        }
        area = d3.svg.area().x(function(d) {
          return x.scale()(d.x);
        }).y0(function(d) {
          return y.scale()(d.y);
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
        layers.select('.wk-chart-line').transition().duration(options.duration).attr('d', function(d) {
          return area(d.value);
        }).style('opacity', 0.7).style('pointer-events', 'none');
        return layers.exit().transition().duration(options.duration).style('opacity', 0).remove();
      };
      brush = function(data, options, x, y, color) {
        var layers;
        layers = this.selectAll(".wk-chart-layer");
        return layers.select('.wk-chart-line').attr('d', function(d) {
          null;
          return area(d.value);
        });
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['x', 'y', 'color']);
        this.layerScale('color');
        this.getKind('y').domainCalc('extent').resetOnNewData(true);
        this.getKind('x').resetOnNewData(true).domainCalc('extent');
        _tooltip = host.behavior().tooltip;
        _tooltip.markerScale(_scaleList.x);
        _tooltip.on("enter." + _id, ttMoveData);
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
                  y0: 0
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
                  y0: 0
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
        $log.log('y-range', y.scale().range(), 'y-domain', y.scale().domain());
        $log.log('x-range', x.scale().range(), 'x-domain', x.scale().domain());
        $log.log('color-range', color.scale().range(), 'color-domain', color.scale().domain());
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
            data: d,
            key: y.value(d),
            x: x.map(d),
            y: y.map(d),
            color: color.map(d),
            height: y.scale().rangeBand(y.value(d))
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
      var barOuterPaddingOld, barPaddingOld, bars, config, draw, host, initial, ttEnter, _id, _merge, _scaleList, _selected, _tooltip;
      host = controller.me;
      _id = "simpleColumn" + (sBarCntr++);
      bars = null;
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
        var barOuterPadding, barPadding, layout;
        if (!bars) {
          bars = this.selectAll('.wk-chart-bars');
        }
        barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding;
        barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding;
        layout = data.map(function(d) {
          return {
            data: d,
            key: x.value(d),
            x: x.map(d),
            y: y.map(d),
            color: color.map(d),
            width: x.scale().rangeBand(x.value(d))
          };
        });
        _merge(layout).first({
          x: barPaddingOld / 2 - barOuterPadding
        }).last({
          x: options.width + barPadding / 2 - barOuterPaddingOld,
          width: 0
        });
        bars = bars.data(layout, function(d) {
          return d.key;
        });
        bars.enter().append('rect').attr('class', 'wk-chart-bar wk-chart-selectable').attr('x', function(d) {
          if (initial) {
            return d.x;
          } else {
            return _merge.addedPred(d).x + _merge.addedPred(d).width + barPaddingOld / 2;
          }
        }).attr('width', function(d) {
          if (initial) {
            return d.width;
          } else {
            return 0;
          }
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        bars.style('fill', function(d) {
          return d.color;
        }).transition().duration(options.duration).attr('y', function(d) {
          return Math.min(y.scale()(0), d.y);
        }).attr('width', function(d) {
          return d.width;
        }).attr('height', function(d) {
          return Math.abs(y.scale()(0) - d.y);
        }).attr('x', function(d) {
          return d.x;
        }).style('opacity', 1);
        bars.exit().transition().duration(options.duration).attr('x', function(d) {
          return _merge.deletedSucc(d).x - barPadding / 2;
        }).attr('width', 0).remove();
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
      draw = function(data, options, x, y, color, size, shape, xRange) {
        var layout, start, step;
        if (xRange.upperProperty()) {
          layout = data.map(function(d) {
            return {
              x: xRange.scale()(xRange.lowerValue(d)),
              xVal: xRange.lowerValue(d),
              width: xRange.scale()(xRange.upperValue(d)) - xRange.scale()(xRange.lowerValue(d)),
              y: y.map(d),
              height: options.height - y.map(d),
              color: color.map(d),
              data: d
            };
          });
        } else {
          if (data.length > 0) {
            start = xRange.lowerValue(data[0]);
            step = xRange.lowerValue(data[1]) - start;
            layout = data.map(function(d, i) {
              return {
                x: xRange.scale()(start + step * i),
                xVal: xRange.lowerValue(d),
                width: xRange.scale()(step),
                y: y.map(d),
                height: options.height - y.map(d),
                color: color.map(d),
                data: d
              };
            });
          }
        }
        _merge(layout).first({
          x: 0
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
        buckets.enter().append('rect').attr('class', 'wk-chart-bucket').style('fill', function(d) {
          return d.color;
        }).attr('x', function(d) {
          if (initial) {
            return d.x;
          } else {
            return _merge.addedPred(d).x + _merge.addedPred(d).width;
          }
        }).attr('width', function(d) {
          if (initial) {
            return d.width;
          } else {
            return 0;
          }
        }).attr('y', function(d) {
          return d.y;
        }).attr('height', function(d) {
          return d.height;
        }).style('opacity', initial ? 0 : 1).call(_tooltip.tooltip).call(_selected);
        buckets.transition().duration(options.duration).attr('x', function(d) {
          return d.x;
        }).attr('width', function(d) {
          return d.width;
        }).attr('y', function(d) {
          return d.y;
        }).attr('height', function(d) {
          return d.height;
        }).style('opacity', 1);
        buckets.exit().transition().duration(options.duration).attr('x', function(d) {
          return _merge.deletedSucc(d).x;
        }).attr('width', 0).remove();
        if (!labels) {
          labels = this.selectAll('.wk-chart-label');
        }
        labels = labels.data((host.showLabels() ? layout : []), function(d) {
          return d.xVal;
        });
        labels.enter().append('text').attr('class', 'wk-chart-label').style('opacity', 0);
        labels.attr('x', function(d) {
          return d.x + d.width / 2;
        }).attr('y', function(d) {
          return d.y - 20;
        }).attr('dy', '1em').style('text-anchor', 'middle').style('font-size', '1.3em').text(function(d) {
          return y.formattedValue(d.data);
        }).transition().duration(options.duration).style('opacity', 1);
        labels.exit().transition().duration(options.duration).style('opacity', 0).remove();

        /*
        else
          if labels
            labels = labels.transition().duration(options.duration)
              .style('opacity', 0)
              .remove()
         */
        return initial = false;
      };
      host.lifeCycle().on('configure', function() {
        _scaleList = this.getScales(['rangeX', 'y', 'color']);
        this.getKind('y').domainCalc('max').resetOnNewData(true);
        this.getKind('rangeX').resetOnNewData(true).scaleType('linear').domainCalc('rangeExtent');
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
        return this.attr('transform', "translate(" + (_pathArray[0][idx].x + offset) + ")");
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
              color: color.scale()(key)
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
    var body, bodyRect, me, positionBox, positionInitial, tooltipEnter, tooltipLeave, tooltipMove, _active, _area, _areaSelection, _compiledTempl, _container, _data, _hide, _markerG, _markerLine, _markerScale, _showMarkerLine, _templ, _templScope, _tooltipDispatch;
    _active = false;
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
        return s.on('mouseenter.tooltip', tooltipEnter).on('mousemove.tooltip', tooltipMove).on('mouseleave.tooltip', tooltipLeave);
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
    var me, _allScales, _animationDuration, _behavior, _brush, _container, _data, _id, _layouts, _lifeCycle, _ownedScales, _showTooltip, _subTitle, _title;
    _id = "chart" + (chartCntr++);
    me = function() {};
    _layouts = [];
    _container = void 0;
    _allScales = void 0;
    _ownedScales = void 0;
    _data = void 0;
    _showTooltip = false;
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
    var calcDomain, keys, layerMax, layerMin, layerTotal, me, parsedValue, _axis, _axisLabel, _axisOrient, _axisOrientOld, _calculatedDomain, _chart, _domain, _domainCalc, _exponent, _id, _inputFormatFn, _inputFormatString, _isHorizontal, _isOrdinal, _isVertical, _kind, _layerExclude, _layerProp, _layout, _legend, _lowerProperty, _outputFormatFn, _outputFormatString, _parent, _property, _range, _rangeOuterPadding, _rangePadding, _resetOnNewData, _rotateTickLabels, _scale, _scaleType, _showAxis, _showGrid, _showLabel, _tickFormat, _ticks, _upperProperty;
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
      var bisect, domain, idx, interval, range, val, _data;
      if (_.has(me.scale(), 'invert')) {
        _data = me.chart().getData();
        range = _scale.range();
        interval = (range[1] - range[0]) / _data.length;
        val = me.scale().invert(mappedValue - interval / 2);
        bisect = d3.bisector(me.value).left;
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

angular.module('wk.chart').service('scaleUtils', function($log, wkChartScales) {
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
      return attrs.$observe('format', function(val) {
        if (val !== void 0) {
          return me.format(val);
        }
      });
    },
    observeAxisAttributes: function(attrs, me) {
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
      return attrs.$observe('showLabel', function(val) {
        if (val !== void 0) {
          return me.showLabel(val === '' || val === 'true').update(true);
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
      scaleUtils.observeAxisAttributes(attrs, me);
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
      scaleUtils.observeAxisAttributes(attrs, me);
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
      scaleUtils.observeAxisAttributes(attrs, me);
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
      scaleUtils.observeAxisAttributes(attrs, me);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3drLWNoYXJ0cy9hcHAvY29uZmlnL3drQ2hhcnRDb25zdGFudHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL1Jlc2l6ZVNlbnNvci5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoLmNvZmZlZSIsInRlbXBsYXRlcy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9kMy5nZW8uem9vbS5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9jb250YWluZXIvY2hhcnQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9jb250YWluZXIvbGF5b3V0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL3NlbGVjdGlvbi5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2V4dGVuZGVkU2NhbGVzL3NjYWxlRXh0ZW50aW9uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvZmlsdGVycy90dEZvcm1hdC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYXJlYS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYXJlYVN0YWNrZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWFTdGFja2VkVmVydGljYWwuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWFWZXJ0aWNhbC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYmFyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9iYXJDbHVzdGVyZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2JhclN0YWNrZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2J1YmJsZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvY29sdW1uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9jb2x1bW5DbHVzdGVyZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2NvbHVtblN0YWNrZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2dhdWdlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9nZW9NYXAuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2hpc3RvZ3JhbS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvbGluZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvbGluZVZlcnRpY2FsLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9waWUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL3NjYXR0ZXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL3NwaWRlci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9iZWhhdmlvckJydXNoLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9yU2VsZWN0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9yVG9vbHRpcC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9iZWhhdmlvcnMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvY2hhcnQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvY29udGFpbmVyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2xheW91dC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9sZWdlbmQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvc2NhbGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvc2NhbGVMaXN0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL2NvbG9yLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3NjYWxlVXRpbHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2hhcGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2l6ZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy94LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3hSYW5nZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy95LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3lSYW5nZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NlcnZpY2VzL3NlbGVjdGlvblNoYXJpbmcuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zZXJ2aWNlcy90aW1lci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3V0aWwvbGF5ZXJEYXRhLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9zdmdJY29uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC91dGlsaXRpZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsVUFBZixFQUEyQixFQUEzQixDQUFBLENBQUE7O0FBQUEsT0FFTyxDQUFDLE1BQVIsQ0FBZSxVQUFmLENBQTBCLENBQUMsUUFBM0IsQ0FBb0MsaUJBQXBDLEVBQXVELENBQ3JELFNBRHFELEVBRXJELFlBRnFELEVBR3JELFlBSHFELEVBSXJELGFBSnFELEVBS3JELGFBTHFELENBQXZELENBRkEsQ0FBQTs7QUFBQSxPQVVPLENBQUMsTUFBUixDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxRQUEzQixDQUFvQyxnQkFBcEMsRUFBc0Q7QUFBQSxFQUNwRCxHQUFBLEVBQUssRUFEK0M7QUFBQSxFQUVwRCxJQUFBLEVBQU0sRUFGOEM7QUFBQSxFQUdwRCxNQUFBLEVBQVEsRUFINEM7QUFBQSxFQUlwRCxLQUFBLEVBQU8sRUFKNkM7QUFBQSxFQUtwRCxlQUFBLEVBQWdCO0FBQUEsSUFBQyxJQUFBLEVB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QVksQ0FBQyxNQUFELEVBQVksSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFULEVBQWMsT0FBZCxDQUFaLEVBQW1DLElBQUssQ0FBQSxJQUFBLENBQXhDLENBQVosQ0FBQSxDQUFBO0FBQUEsUUFFQSxJQUFBLEVBRkEsQ0FQRztPQU5QO0lBQUEsQ0FQQTtBQXdCQSxXQUFNLElBQUEsSUFBUSxPQUFkLEdBQUE7QUFFRSxNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBQyxJQUFELEVBQU0sTUFBTixFQUFpQixJQUFLLENBQUEsSUFBQSxDQUF0QixDQUFaLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQSxFQUZBLENBRkY7SUFBQSxDQXhCQTtBQThCQSxXQUFNLElBQUEsSUFBUSxPQUFkLEdBQUE7QUFFRSxNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBQyxNQUFELEVBQVksSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFULEVBQWMsT0FBZCxDQUFaLEVBQW1DLElBQUssQ0FBQSxJQUFBLENBQXhDLENBQVosQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFBLEVBRkEsQ0FGRjtJQUFBLENBOUJBO0FBb0NBLFdBQU8sTUFBUCxDQXJDYztFQUFBLENBeEhoQixDQUFBO0FBK0pBLFNBQU8sSUFBUCxDQW5LMEM7QUFBQSxDQUE1QyxDQUFBLENBQUEiLCJmaWxlIjoid2stY2hhcnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JywgW10pXG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM09yZGluYWxTY2FsZXMnLCBbXG4gICdvcmRpbmFsJ1xuICAnY2F0ZWdvcnkxMCdcbiAgJ2NhdGVnb3J5MjAnXG4gICdjYXRlZ29yeTIwYidcbiAgJ2NhdGVnb3J5MjBjJ1xuXVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNDaGFydE1hcmdpbnMnLCB7XG4gIHRvcDogMTBcbiAgbGVmdDogNTBcbiAgYm90dG9tOiA0MFxuICByaWdodDogMjBcbiAgdG9wQm90dG9tTWFyZ2luOntheGlzOjI1LCBsYWJlbDoxOH1cbiAgbGVmdFJpZ2h0TWFyZ2luOntheGlzOjQwLCBsYWJlbDoyMH1cbiAgbWluTWFyZ2luOjhcbiAgZGVmYXVsdDpcbiAgICB0b3A6IDhcbiAgICBsZWZ0OjhcbiAgICBib3R0b206OFxuICAgIHJpZ2h0OjEwXG4gIGF4aXM6XG4gICAgdG9wOjI1XG4gICAgYm90dG9tOjI1XG4gICAgbGVmdDo0MFxuICAgIHJpZ2h0OjQwXG4gIGxhYmVsOlxuICAgIHRvcDoxOFxuICAgIGJvdHRvbToxOFxuICAgIGxlZnQ6MjBcbiAgICByaWdodDoyMFxufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNTaGFwZXMnLCBbXG4gICdjaXJjbGUnLFxuICAnY3Jvc3MnLFxuICAndHJpYW5nbGUtZG93bicsXG4gICd0cmlhbmdsZS11cCcsXG4gICdzcXVhcmUnLFxuICAnZGlhbW9uZCdcbl1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2F4aXNDb25maWcnLCB7XG4gIGxhYmVsRm9udFNpemU6ICcxLjZlbSdcbiAgeDpcbiAgICBheGlzUG9zaXRpb25zOiBbJ3RvcCcsICdib3R0b20nXVxuICAgIGF4aXNPZmZzZXQ6IHtib3R0b206J2hlaWdodCd9XG4gICAgYXhpc1Bvc2l0aW9uRGVmYXVsdDogJ2JvdHRvbSdcbiAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJ1xuICAgIG1lYXN1cmU6ICd3aWR0aCdcbiAgICBsYWJlbFBvc2l0aW9uczpbJ291dHNpZGUnLCAnaW5zaWRlJ11cbiAgICBsYWJlbFBvc2l0aW9uRGVmYXVsdDogJ291dHNpZGUnXG4gICAgbGFiZWxPZmZzZXQ6XG4gICAgICB0b3A6ICcxZW0nXG4gICAgICBib3R0b206ICctMC44ZW0nXG4gIHk6XG4gICAgYXhpc1Bvc2l0aW9uczogWydsZWZ0JywgJ3JpZ2h0J11cbiAgICBheGlzT2Zmc2V0OiB7cmlnaHQ6J3dpZHRoJ31cbiAgICBheGlzUG9zaXRpb25EZWZhdWx0OiAnbGVmdCdcbiAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCdcbiAgICBtZWFzdXJlOiAnaGVpZ2h0J1xuICAgIGxhYmVsUG9zaXRpb25zOlsnb3V0c2lkZScsICdpbnNpZGUnXVxuICAgIGxhYmVsUG9zaXRpb25EZWZhdWx0OiAnb3V0c2lkZSdcbiAgICBsYWJlbE9mZnNldDpcbiAgICAgIGxlZnQ6ICcxLjJlbSdcbiAgICAgIHJpZ2h0OiAnMS4yZW0nXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM0FuaW1hdGlvbicsIHtcbiAgZHVyYXRpb246NTAwXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICd0ZW1wbGF0ZURpcicsICd0ZW1wbGF0ZXMvJ1xuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZm9ybWF0RGVmYXVsdHMnLCB7XG4gIGRhdGU6ICclZC4lbS4lWSdcbiAgbnVtYmVyIDogICcsLjJmJ1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnYmFyQ29uZmlnJywge1xuICBwYWRkaW5nOiAwLjFcbiAgb3V0ZXJQYWRkaW5nOiAwXG59XG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IE1hcmMgSi4gU2NobWlkdC4gU2VlIHRoZSBMSUNFTlNFIGZpbGUgYXQgdGhlIHRvcC1sZXZlbFxuICogZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uIGFuZCBhdFxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmNqL2Nzcy1lbGVtZW50LXF1ZXJpZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5cbiAqL1xuO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBkaW1lbnNpb24gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W118RWxlbWVudHN8alF1ZXJ5fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHRoaXMuUmVzaXplU2Vuc29yID0gZnVuY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gRXZlbnRRdWV1ZSgpIHtcbiAgICAgICAgICAgIHRoaXMucSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHRoaXMucS5wdXNoKGV2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSB0aGlzLnEubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucVtpXS5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNpemVkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCByZXNpemVkKSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQgPSBuZXcgRXZlbnRRdWV1ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmNsYXNzTmFtZSA9ICd3ay1jaGFydC1yZXNpemUtc2Vuc29yJztcbiAgICAgICAgICAgIHZhciBzdHlsZSA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IHNjcm9sbDsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xuICAgICAgICAgICAgdmFyIHN0eWxlQ2hpbGQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7JztcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3ay1jaGFydC1yZXNpemUtc2Vuc29yLWV4cGFuZFwiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwid2stY2hhcnQtcmVzaXplLXNlbnNvci1zaHJpbmtcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJyB3aWR0aDogMjAwJTsgaGVpZ2h0OiAyMDAlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQucmVzaXplU2Vuc29yKTtcbiAgICAgICAgICAgIGlmICghe2ZpeGVkOiAxLCBhYnNvbHV0ZTogMX1bZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKV0pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBleHBhbmQgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGV4cGFuZENoaWxkID0gZXhwYW5kLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgc2hyaW5rID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmtDaGlsZCA9IHNocmluay5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGxhc3RXaWR0aCwgbGFzdEhlaWdodDtcbiAgICAgICAgICAgIHZhciByZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLndpZHRoID0gZXhwYW5kLm9mZnNldFdpZHRoICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLmhlaWdodCA9IGV4cGFuZC5vZmZzZXRIZWlnaHQgKyAxMCArICdweCc7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbExlZnQgPSBleHBhbmQuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbFRvcCA9IGV4cGFuZC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbExlZnQgPSBzaHJpbmsuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbFRvcCA9IHNocmluay5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGFzdFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBsYXN0SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuY2FsbCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBjYikge1xuICAgICAgICAgICAgICAgIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgbmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGRFdmVudChleHBhbmQsICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA+IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhZGRFdmVudChzaHJpbmssICdzY3JvbGwnLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoIDwgbGFzdFdpZHRoIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IDwgbGFzdEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJbb2JqZWN0IEFycmF5XVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZWxlbWVudClcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSAmJiBlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5KSAvL2pxdWVyeVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgRWxlbWVudHMgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnRzKSAvL21vb3Rvb2xzXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBpID0gMCwgaiA9IGVsZW1lbnQubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50W2ldLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnJ1c2gnLCAoJGxvZywgc2VsZWN0aW9uU2hhcmluZywgYmVoYXZpb3IpIC0+XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6IFsnXmNoYXJ0JywgJ15sYXlvdXQnLCAnP3gnLCAnP3knXVxuICAgIHNjb3BlOlxuICAgICAgYnJ1c2hFeHRlbnQ6ICc9J1xuICAgICAgc2VsZWN0ZWRWYWx1ZXM6ICc9J1xuICAgICAgc2VsZWN0ZWREb21haW46ICc9J1xuICAgICAgY2hhbmdlOiAnJidcblxuICAgIGxpbms6KHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1sxXT8ubWVcbiAgICAgIHggPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIHkgPSBjb250cm9sbGVyc1szXT8ubWVcbiAgICAgIHhTY2FsZSA9IHVuZGVmaW5lZFxuICAgICAgeVNjYWxlID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0YWJsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9icnVzaEFyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICAgIF9pc0FyZWFCcnVzaCA9IG5vdCB4IGFuZCBub3QgeVxuICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgYnJ1c2ggPSBjaGFydC5iZWhhdmlvcigpLmJydXNoXG4gICAgICBpZiBub3QgeCBhbmQgbm90IHlcbiAgICAgICAgI2xheW91dCBicnVzaCwgZ2V0IHggYW5kIHkgZnJvbSBsYXlvdXQgc2NhbGVzXG4gICAgICAgIHNjYWxlcyA9IGxheW91dC5zY2FsZXMoKS5nZXRTY2FsZXMoWyd4JywgJ3knXSlcbiAgICAgICAgYnJ1c2gueChzY2FsZXMueClcbiAgICAgICAgYnJ1c2gueShzY2FsZXMueSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnJ1c2gueCh4KVxuICAgICAgICBicnVzaC55KHkpXG4gICAgICBicnVzaC5hY3RpdmUodHJ1ZSlcblxuICAgICAgYnJ1c2guZXZlbnRzKCkub24gJ2JydXNoJywgKGlkeFJhbmdlLCB2YWx1ZVJhbmdlLCBkb21haW4pIC0+XG4gICAgICAgIGlmIGF0dHJzLmJydXNoRXh0ZW50XG4gICAgICAgICAgc2NvcGUuYnJ1c2hFeHRlbnQgPSBpZHhSYW5nZVxuICAgICAgICBpZiBhdHRycy5zZWxlY3RlZFZhbHVlc1xuICAgICAgICAgIHNjb3BlLnNlbGVjdGVkVmFsdWVzID0gdmFsdWVSYW5nZVxuICAgICAgICBpZiBhdHRycy5zZWxlY3RlZERvbWFpblxuICAgICAgICAgIHNjb3BlLnNlbGVjdGVkRG9tYWluID0gZG9tYWluXG4gICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdy5icnVzaCcsIChkYXRhKSAtPlxuICAgICAgICBicnVzaC5kYXRhKGRhdGEpXG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2JydXNoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyh2YWwpIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIGJydXNoLmJydXNoR3JvdXAodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYnJ1c2guYnJ1c2hHcm91cCh1bmRlZmluZWQpXG4gIH0iLG51bGwsIi8vIENvcHlyaWdodCAoYykgMjAxMywgSmFzb24gRGF2aWVzLCBodHRwOi8vd3d3Lmphc29uZGF2aWVzLmNvbVxuLy8gU2VlIExJQ0VOU0UudHh0IGZvciBkZXRhaWxzLlxuKGZ1bmN0aW9uKCkge1xuXG52YXIgcmFkaWFucyA9IE1hdGguUEkgLyAxODAsXG4gICAgZGVncmVlcyA9IDE4MCAvIE1hdGguUEk7XG5cbi8vIFRPRE8gbWFrZSBpbmNyZW1lbnRhbCByb3RhdGUgb3B0aW9uYWxcblxuZDMuZ2VvLnpvb20gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByb2plY3Rpb24sXG4gICAgICB6b29tUG9pbnQsXG4gICAgICBldmVudCA9IGQzLmRpc3BhdGNoKFwiem9vbXN0YXJ0XCIsIFwiem9vbVwiLCBcInpvb21lbmRcIiksXG4gICAgICB6b29tID0gZDMuYmVoYXZpb3Iuem9vbSgpXG4gICAgICAgIC5vbihcInpvb21zdGFydFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbW91c2UwID0gZDMubW91c2UodGhpcyksXG4gICAgICAgICAgICAgIHJvdGF0ZSA9IHF1YXRlcm5pb25Gcm9tRXVsZXIocHJvamVjdGlvbi5yb3RhdGUoKSksXG4gICAgICAgICAgICAgIHBvaW50ID0gcG9zaXRpb24ocHJvamVjdGlvbiwgbW91c2UwKTtcbiAgICAgICAgICBpZiAocG9pbnQpIHpvb21Qb2ludCA9IHBvaW50O1xuXG4gICAgICAgICAgem9vbU9uLmNhbGwoem9vbSwgXCJ6b29tXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoZDMuZXZlbnQuc2NhbGUpO1xuICAgICAgICAgICAgICAgIHZhciBtb3VzZTEgPSBkMy5tb3VzZSh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYmV0d2VlbiA9IHJvdGF0ZUJldHdlZW4oem9vbVBvaW50LCBwb3NpdGlvbihwcm9qZWN0aW9uLCBtb3VzZTEpKTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnJvdGF0ZShldWxlckZyb21RdWF0ZXJuaW9uKHJvdGF0ZSA9IGJldHdlZW5cbiAgICAgICAgICAgICAgICAgICAgPyBtdWx0aXBseShyb3RhdGUsIGJldHdlZW4pXG4gICAgICAgICAgICAgICAgICAgIDogbXVsdGlwbHkoYmFuayhwcm9qZWN0aW9uLCBtb3VzZTAsIG1vdXNlMSksIHJvdGF0ZSkpKTtcbiAgICAgICAgICAgICAgICBtb3VzZTAgPSBtb3VzZTE7XG4gICAgICAgICAgICAgICAgZXZlbnQuem9vbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICBldmVudC56b29tc3RhcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwiem9vbWVuZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB6b29tT24uY2FsbCh6b29tLCBcInpvb21cIiwgbnVsbCk7XG4gICAgICAgICAgZXZlbnQuem9vbWVuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9KSxcbiAgICAgIHpvb21PbiA9IHpvb20ub247XG5cbiAgem9vbS5wcm9qZWN0aW9uID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gem9vbS5zY2FsZSgocHJvamVjdGlvbiA9IF8pLnNjYWxlKCkpIDogcHJvamVjdGlvbjtcbiAgfTtcblxuICByZXR1cm4gZDMucmViaW5kKHpvb20sIGV2ZW50LCBcIm9uXCIpO1xufTtcblxuZnVuY3Rpb24gYmFuayhwcm9qZWN0aW9uLCBwMCwgcDEpIHtcbiAgdmFyIHQgPSBwcm9qZWN0aW9uLnRyYW5zbGF0ZSgpLFxuICAgICAgYW5nbGUgPSBNYXRoLmF0YW4yKHAwWzFdIC0gdFsxXSwgcDBbMF0gLSB0WzBdKSAtIE1hdGguYXRhbjIocDFbMV0gLSB0WzFdLCBwMVswXSAtIHRbMF0pO1xuICByZXR1cm4gW01hdGguY29zKGFuZ2xlIC8gMiksIDAsIDAsIE1hdGguc2luKGFuZ2xlIC8gMildO1xufVxuXG5mdW5jdGlvbiBwb3NpdGlvbihwcm9qZWN0aW9uLCBwb2ludCkge1xuICB2YXIgdCA9IHByb2plY3Rpb24udHJhbnNsYXRlKCksXG4gICAgICBzcGhlcmljYWwgPSBwcm9qZWN0aW9uLmludmVydChwb2ludCk7XG4gIHJldHVybiBzcGhlcmljYWwgJiYgaXNGaW5pdGUoc3BoZXJpY2FsWzBdKSAmJiBpc0Zpbml0ZShzcGhlcmljYWxbMV0pICYmIGNhcnRlc2lhbihzcGhlcmljYWwpO1xufVxuXG5mdW5jdGlvbiBxdWF0ZXJuaW9uRnJvbUV1bGVyKGV1bGVyKSB7XG4gIHZhciDOuyA9IC41ICogZXVsZXJbMF0gKiByYWRpYW5zLFxuICAgICAgz4YgPSAuNSAqIGV1bGVyWzFdICogcmFkaWFucyxcbiAgICAgIM6zID0gLjUgKiBldWxlclsyXSAqIHJhZGlhbnMsXG4gICAgICBzaW7OuyA9IE1hdGguc2luKM67KSwgY29zzrsgPSBNYXRoLmNvcyjOuyksXG4gICAgICBzaW7PhiA9IE1hdGguc2luKM+GKSwgY29zz4YgPSBNYXRoLmNvcyjPhiksXG4gICAgICBzaW7OsyA9IE1hdGguc2luKM6zKSwgY29zzrMgPSBNYXRoLmNvcyjOsyk7XG4gIHJldHVybiBbXG4gICAgY29zzrsgKiBjb3PPhiAqIGNvc86zICsgc2luzrsgKiBzaW7PhiAqIHNpbs6zLFxuICAgIHNpbs67ICogY29zz4YgKiBjb3POsyAtIGNvc867ICogc2luz4YgKiBzaW7OsyxcbiAgICBjb3POuyAqIHNpbs+GICogY29zzrMgKyBzaW7OuyAqIGNvc8+GICogc2luzrMsXG4gICAgY29zzrsgKiBjb3PPhiAqIHNpbs6zIC0gc2luzrsgKiBzaW7PhiAqIGNvc86zXG4gIF07XG59XG5cbmZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXSxcbiAgICAgIGIwID0gYlswXSwgYjEgPSBiWzFdLCBiMiA9IGJbMl0sIGIzID0gYlszXTtcbiAgcmV0dXJuIFtcbiAgICBhMCAqIGIwIC0gYTEgKiBiMSAtIGEyICogYjIgLSBhMyAqIGIzLFxuICAgIGEwICogYjEgKyBhMSAqIGIwICsgYTIgKiBiMyAtIGEzICogYjIsXG4gICAgYTAgKiBiMiAtIGExICogYjMgKyBhMiAqIGIwICsgYTMgKiBiMSxcbiAgICBhMCAqIGIzICsgYTEgKiBiMiAtIGEyICogYjEgKyBhMyAqIGIwXG4gIF07XG59XG5cbmZ1bmN0aW9uIHJvdGF0ZUJldHdlZW4oYSwgYikge1xuICBpZiAoIWEgfHwgIWIpIHJldHVybjtcbiAgdmFyIGF4aXMgPSBjcm9zcyhhLCBiKSxcbiAgICAgIG5vcm0gPSBNYXRoLnNxcnQoZG90KGF4aXMsIGF4aXMpKSxcbiAgICAgIGhhbGbOsyA9IC41ICogTWF0aC5hY29zKE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBkb3QoYSwgYikpKSksXG4gICAgICBrID0gTWF0aC5zaW4oaGFsZs6zKSAvIG5vcm07XG4gIHJldHVybiBub3JtICYmIFtNYXRoLmNvcyhoYWxmzrMpLCBheGlzWzJdICogaywgLWF4aXNbMV0gKiBrLCBheGlzWzBdICoga107XG59XG5cbmZ1bmN0aW9uIGV1bGVyRnJvbVF1YXRlcm5pb24ocSkge1xuICByZXR1cm4gW1xuICAgIE1hdGguYXRhbjIoMiAqIChxWzBdICogcVsxXSArIHFbMl0gKiBxWzNdKSwgMSAtIDIgKiAocVsxXSAqIHFbMV0gKyBxWzJdICogcVsyXSkpICogZGVncmVlcyxcbiAgICBNYXRoLmFzaW4oTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIDIgKiAocVswXSAqIHFbMl0gLSBxWzNdICogcVsxXSkpKSkgKiBkZWdyZWVzLFxuICAgIE1hdGguYXRhbjIoMiAqIChxWzBdICogcVszXSArIHFbMV0gKiBxWzJdKSwgMSAtIDIgKiAocVsyXSAqIHFbMl0gKyBxWzNdICogcVszXSkpICogZGVncmVlc1xuICBdO1xufVxuXG5mdW5jdGlvbiBjYXJ0ZXNpYW4oc3BoZXJpY2FsKSB7XG4gIHZhciDOuyA9IHNwaGVyaWNhbFswXSAqIHJhZGlhbnMsXG4gICAgICDPhiA9IHNwaGVyaWNhbFsxXSAqIHJhZGlhbnMsXG4gICAgICBjb3PPhiA9IE1hdGguY29zKM+GKTtcbiAgcmV0dXJuIFtcbiAgICBjb3PPhiAqIE1hdGguY29zKM67KSxcbiAgICBjb3PPhiAqIE1hdGguc2luKM67KSxcbiAgICBNYXRoLnNpbijPhilcbiAgXTtcbn1cblxuZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBhLmxlbmd0aCwgcyA9IDA7IGkgPCBuOyArK2kpIHMgKz0gYVtpXSAqIGJbaV07XG4gIHJldHVybiBzO1xufVxuXG5mdW5jdGlvbiBjcm9zcyhhLCBiKSB7XG4gIHJldHVybiBbXG4gICAgYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSxcbiAgICBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdLFxuICAgIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF1cbiAgXTtcbn1cblxufSkoKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnJ1c2hlZCcsICgkbG9nLHNlbGVjdGlvblNoYXJpbmcsIHRpbWluZykgLT5cbiAgc0JydXNoQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiBbJ15jaGFydCcsICc/XmxheW91dCcsICc/eCcsICc/eSddXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1sxXT8ubWVcbiAgICAgIHggPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIHkgPSBjb250cm9sbGVyc1szXT8ubWVcblxuICAgICAgYXhpcyA9IHggb3IgeVxuICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgYnJ1c2hlciA9IChleHRlbnQpIC0+XG4gICAgICAgIHRpbWluZy5zdGFydChcImJydXNoZXIje2F4aXMuaWQoKX1cIilcbiAgICAgICAgaWYgbm90IGF4aXMgdGhlbiByZXR1cm5cbiAgICAgICAgI2F4aXNcbiAgICAgICAgYXhpcy5kb21haW4oZXh0ZW50KS5zY2FsZSgpLmRvbWFpbihleHRlbnQpXG4gICAgICAgIGZvciBsIGluIGNoYXJ0LmxheW91dHMoKSB3aGVuIGwuc2NhbGVzKCkuaGFzU2NhbGUoYXhpcykgI25lZWQgdG8gZG8gaXQgdGhpcyB3YXkgdG8gZW5zdXJlIHRoZSByaWdodCBheGlzIGlzIGNob3NlbiBpbiBjYXNlIG9mIHNldmVyYWwgbGF5b3V0cyBpbiBhIGNvbnRhaW5lclxuICAgICAgICAgIGwubGlmZUN5Y2xlKCkuYnJ1c2goYXhpcywgdHJ1ZSkgI25vIGFuaW1hdGlvblxuICAgICAgICB0aW1pbmcuc3RvcChcImJydXNoZXIje2F4aXMuaWQoKX1cIilcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2JydXNoZWQnLCAodmFsKSAtPlxuICAgICAgICBpZiBfLmlzU3RyaW5nKHZhbCkgYW5kIHZhbC5sZW5ndGggPiAwXG4gICAgICAgICAgX2JydXNoR3JvdXAgPSB2YWxcbiAgICAgICAgICBzZWxlY3Rpb25TaGFyaW5nLnJlZ2lzdGVyIF9icnVzaEdyb3VwLCBicnVzaGVyXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYnJ1c2hHcm91cCA9IHVuZGVmaW5lZFxuXG4gICAgICBzY29wZS4kb24gJyRkZXN0cm95JywgKCkgLT5cbiAgICAgICAgc2VsZWN0aW9uU2hhcmluZy51bnJlZ2lzdGVyIF9icnVzaEdyb3VwLCBicnVzaGVyXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY2hhcnQnLCAoJGxvZywgY2hhcnQsICRmaWx0ZXIpIC0+XG4gIGNoYXJ0Q250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiAnY2hhcnQnXG4gICAgc2NvcGU6XG4gICAgICBkYXRhOiAnPSdcbiAgICAgIGZpbHRlcjogJz0nXG4gICAgY29udHJvbGxlcjogKCkgLT5cbiAgICAgIHRoaXMubWUgPSBjaGFydCgpXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGRlZXBXYXRjaCA9IGZhbHNlXG4gICAgICB3YXRjaGVyUmVtb3ZlRm4gPSB1bmRlZmluZWRcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICAgIF9maWx0ZXIgPSB1bmRlZmluZWRcblxuICAgICAgbWUuY29udGFpbmVyKCkuZWxlbWVudChlbGVtZW50WzBdKVxuXG4gICAgICBtZS5saWZlQ3ljbGUoKS5jb25maWd1cmUoKVxuXG4gICAgICBtZS5saWZlQ3ljbGUoKS5vbiAnc2NvcGVBcHBseScsICgpIC0+XG4gICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0b29sdGlwcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZCBhbmQgKHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnKVxuICAgICAgICAgIG1lLnNob3dUb29sdGlwKHRydWUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS5zaG93VG9vbHRpcChmYWxzZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2FuaW1hdGlvbkR1cmF0aW9uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCBfLmlzTnVtYmVyKCt2YWwpIGFuZCArdmFsID49IDBcbiAgICAgICAgICBtZS5hbmltYXRpb25EdXJhdGlvbih2YWwpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0aXRsZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIG1lLnRpdGxlKHZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnRpdGxlKHVuZGVmaW5lZClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3N1YnRpdGxlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgbWUuc3ViVGl0bGUodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUuc3ViVGl0bGUodW5kZWZpbmVkKVxuXG4gICAgICBzY29wZS4kd2F0Y2ggJ2ZpbHRlcicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIF9maWx0ZXIgPSB2YWwgIyBzY29wZS4kZXZhbCh2YWwpXG4gICAgICAgICAgaWYgX2RhdGFcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEoJGZpbHRlcignZmlsdGVyJykoX2RhdGEsIF9maWx0ZXIpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2ZpbHRlciA9IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIF9kYXRhXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKF9kYXRhKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZGVlcFdhdGNoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkIGFuZCB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgZGVlcFdhdGNoID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVlcFdhdGNoID0gZmFsc2VcbiAgICAgICAgaWYgd2F0Y2hlclJlbW92ZUZuXG4gICAgICAgICAgd2F0Y2hlclJlbW92ZUZuKClcbiAgICAgICAgd2F0Y2hlclJlbW92ZUZuID0gc2NvcGUuJHdhdGNoICdkYXRhJywgZGF0YVdhdGNoRm4sIGRlZXBXYXRjaFxuXG4gICAgICBkYXRhV2F0Y2hGbiA9ICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIF9kYXRhID0gdmFsXG4gICAgICAgICAgaWYgXy5pc0FycmF5KF9kYXRhKSBhbmQgX2RhdGEubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm5cbiAgICAgICAgICBpZiBfZmlsdGVyXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKCRmaWx0ZXIoJ2ZpbHRlcicpKHZhbCwgX2ZpbHRlcikpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YSh2YWwpXG5cbiAgICAgIHdhdGNoZXJSZW1vdmVGbiA9IHNjb3BlLiR3YXRjaCAnZGF0YScsIGRhdGFXYXRjaEZuLCBkZWVwV2F0Y2hcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnbGF5b3V0JywgKCRsb2csIGxheW91dCwgY29udGFpbmVyKSAtPlxuICBsYXlvdXRDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRSdcbiAgICByZXF1aXJlOiBbJ2xheW91dCcsJ15jaGFydCddXG5cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gbGF5b3V0KClcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cblxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG5cbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIGxheW91dCBpZDonLCBtZS5pZCgpLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuICAgICAgY2hhcnQuYWRkTGF5b3V0KG1lKVxuICAgICAgY2hhcnQuY29udGFpbmVyKCkuYWRkTGF5b3V0KG1lKVxuICAgICAgbWUuY29udGFpbmVyKGNoYXJ0LmNvbnRhaW5lcigpKVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NlbGVjdGlvbicsICgkbG9nKSAtPlxuICBvYmpJZCA9IDBcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICBzY29wZTpcbiAgICAgIHNlbGVjdGVkRG9tYWluOiAnPSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUuc2VsZWN0aW9uJywgLT5cblxuICAgICAgICBfc2VsZWN0aW9uID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3NlbGVjdGlvbi5hY3RpdmUodHJ1ZSlcbiAgICAgICAgX3NlbGVjdGlvbi5vbiAnc2VsZWN0ZWQnLCAoc2VsZWN0ZWRPYmplY3RzKSAtPlxuICAgICAgICAgIHNjb3BlLnNlbGVjdGVkRG9tYWluID0gc2VsZWN0ZWRPYmplY3RzXG4gICAgICAgICAgc2NvcGUuJGFwcGx5KClcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykucHJvdmlkZXIgJ3drQ2hhcnRTY2FsZXMnLCAoKSAtPlxuXG4gIF9jdXN0b21Db2xvcnMgPSBbJ3JlZCcsICdncmVlbicsJ2JsdWUnLCd5ZWxsb3cnLCdvcmFuZ2UnXVxuXG4gIGhhc2hlZCA9ICgpIC0+XG4gICAgZDNTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXG4gICAgX2hhc2hGbiA9ICh2YWx1ZSkgLT5cbiAgICAgIGhhc2ggPSAwO1xuICAgICAgbSA9IGQzU2NhbGUucmFuZ2UoKS5sZW5ndGggLSAxXG4gICAgICBmb3IgaSBpbiBbMCAuLiB2YWx1ZS5sZW5ndGhdXG4gICAgICAgIGhhc2ggPSAoMzEgKiBoYXNoICsgdmFsdWUuY2hhckF0KGkpKSAlIG07XG5cbiAgICBtZSA9ICh2YWx1ZSkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gbWVcbiAgICAgIGQzU2NhbGUoX2hhc2hGbih2YWx1ZSkpXG5cbiAgICBtZS5yYW5nZSA9IChyYW5nZSkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gZDNTY2FsZS5yYW5nZSgpXG4gICAgICBkM1NjYWxlLmRvbWFpbihkMy5yYW5nZShyYW5nZS5sZW5ndGgpKVxuICAgICAgZDNTY2FsZS5yYW5nZShyYW5nZSlcblxuICAgIG1lLnJhbmdlUG9pbnQgPSBkM1NjYWxlLnJhbmdlUG9pbnRzXG4gICAgbWUucmFuZ2VCYW5kcyA9IGQzU2NhbGUucmFuZ2VCYW5kc1xuICAgIG1lLnJhbmdlUm91bmRCYW5kcyA9IGQzU2NhbGUucmFuZ2VSb3VuZEJhbmRzXG4gICAgbWUucmFuZ2VCYW5kID0gZDNTY2FsZS5yYW5nZUJhbmRcbiAgICBtZS5yYW5nZUV4dGVudCA9IGQzU2NhbGUucmFuZ2VFeHRlbnRcblxuICAgIG1lLmhhc2ggPSAoZm4pIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9oYXNoRm5cbiAgICAgIF9oYXNoRm4gPSBmblxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICBjYXRlZ29yeUNvbG9ycyA9ICgpIC0+IHJldHVybiBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2UoX2N1c3RvbUNvbG9ycylcblxuICBjYXRlZ29yeUNvbG9yc0hhc2hlZCA9ICgpIC0+IHJldHVybiBoYXNoZWQoKS5yYW5nZShfY3VzdG9tQ29sb3JzKVxuXG4gIHRoaXMuY29sb3JzID0gKGNvbG9ycykgLT5cbiAgICBfY3VzdG9tQ29sb3JzID0gY29sb3JzXG5cbiAgdGhpcy4kZ2V0ID0gWyckbG9nJywoJGxvZykgLT5cbiAgICByZXR1cm4ge2hhc2hlZDpoYXNoZWQsY29sb3JzOmNhdGVnb3J5Q29sb3JzLCBjb2xvcnNIYXNoZWQ6IGNhdGVnb3J5Q29sb3JzSGFzaGVkfVxuICBdXG5cbiAgcmV0dXJuIHRoaXMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5maWx0ZXIgJ3R0Rm9ybWF0JywgKCRsb2csZm9ybWF0RGVmYXVsdHMpIC0+XG4gIHJldHVybiAodmFsdWUsIGZvcm1hdCkgLT5cbiAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ29iamVjdCcgYW5kIHZhbHVlLmdldFVUQ0RhdGVcbiAgICAgIGRmID0gZDMudGltZS5mb3JtYXQoZm9ybWF0RGVmYXVsdHMuZGF0ZSlcbiAgICAgIHJldHVybiBkZih2YWx1ZSlcbiAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcicgb3Igbm90IGlzTmFOKCt2YWx1ZSlcbiAgICAgIGRmID0gZDMuZm9ybWF0KGZvcm1hdERlZmF1bHRzLm51bWJlcilcbiAgICAgIHJldHVybiBkZigrdmFsdWUpXG4gICAgcmV0dXJuIHZhbHVlIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhJywgKCRsb2cpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG4gICAgICBhcmVhID0gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0gVG9vbHRpcCBoYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBfbGF5b3V0Lm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLnZhbHVlW2lkeF0ueSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKF9sYXlvdXRbMF0udmFsdWVbaWR4XS54KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbWFya2VyLSN7X2lkfVwiKS5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gX3NjYWxlTGlzdC55LnNjYWxlKCkoZC52YWx1ZVtpZHhdLnkpKVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19zY2FsZUxpc3QueC5zY2FsZSgpKF9sYXlvdXRbMF0udmFsdWVbaWR4XS54KSArIG9mZnNldH0pXCIpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt4OngudmFsdWUoZCkseTp5LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgICBvZmZzZXQgPSBpZiB4LmlzT3JkaW5hbCgpIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAueCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAueTAoKGQpIC0+ICB5LnNjYWxlKCkoZC55KSlcbiAgICAgICAgLnkxKChkKSAtPiAgeS5zY2FsZSgpKDApKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmcm9tJywgXCJ0cmFuc2xhdGUoI3tvZmZzZXR9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC52YWx1ZSkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgYnJ1c2ggPSAoZGF0YSwgb3B0aW9ucyx4LHksY29sb3IpIC0+XG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgIGxheWVycy5zZWxlY3QoJy53ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPlxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgYXJlYShkLnZhbHVlKSlcblxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC54KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGJydXNoXG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhU3RhY2tlZCcsICgkbG9nLCB1dGlscykgLT5cbiAgc3RhY2tlZEFyZWFDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpXG4gICAgICBvZmZzZXQgPSAnemVybydcbiAgICAgIGxheWVycyA9IG51bGxcbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgbGF5ZXJEYXRhID0gW11cbiAgICAgIGxheW91dE5ldyA9IFtdXG4gICAgICBsYXlvdXRPbGQgPSBbXVxuICAgICAgbGF5ZXJLZXlzT2xkID0gW11cbiAgICAgIGFyZWEgPSB1bmRlZmluZWRcbiAgICAgIGRlbGV0ZWRTdWNjID0ge31cbiAgICAgIGFkZGVkUHJlZCA9IHt9XG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBzY2FsZVkgPSB1bmRlZmluZWRcbiAgICAgIG9mZnMgPSAwXG4gICAgICBfaWQgPSAnYXJlYScgKyBzdGFja2VkQXJlYUNudHIrK1xuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gbGF5ZXJEYXRhLm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLmxheWVyW2lkeF0ueXkpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueClcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShsYXllckRhdGEsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gc2NhbGVZKGQubGF5ZXJbaWR4XS55ICsgZC5sYXllcltpZHhdLnkwKSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19zY2FsZUxpc3QueC5zY2FsZSgpKGxheWVyRGF0YVswXS5sYXllcltpZHhdLngpK29mZnN9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRMYXllckJ5S2V5ID0gKGtleSwgbGF5b3V0KSAtPlxuICAgICAgICBmb3IgbCBpbiBsYXlvdXRcbiAgICAgICAgICBpZiBsLmtleSBpcyBrZXlcbiAgICAgICAgICAgIHJldHVybiBsXG5cbiAgICAgIGxheW91dCA9IHN0YWNrLnZhbHVlcygoZCktPmQubGF5ZXIpLnkoKGQpIC0+IGQueXkpXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMjI1xuICAgICAgcHJlcERhdGEgPSAoeCx5LGNvbG9yKSAtPlxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKEApXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBAbWFwKChkKSAtPiB7eDogeC52YWx1ZShkKSwgeXk6ICt5LmxheWVyVmFsdWUoZCxrKSwgeTA6IDB9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgI2xheW91dE5ldyA9IGxheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgZGVsZXRlZFN1Y2MgPSB1dGlscy5kaWZmKGxheWVyS2V5c09sZCwgbGF5ZXJLZXlzLCAxKVxuICAgICAgICBhZGRlZFByZWQgPSB1dGlscy5kaWZmKGxheWVyS2V5cywgbGF5ZXJLZXlzT2xkLCAtMSlcbiAgICAgICMjI1xuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBBcmVhIENoYXJ0XCJcblxuXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG5cbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IGRhdGEubWFwKChkKSAtPiB7eDogeC52YWx1ZShkKSwgeXk6ICt5LmxheWVyVmFsdWUoZCxrKSwgeTA6IDB9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgbGF5b3V0TmV3ID0gbGF5b3V0KGxheWVyRGF0YSlcblxuICAgICAgICBvZmZzID0gaWYgeC5pc09yZGluYWwoKSB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGlmIG9mZnNldCBpcyAnZXhwYW5kJ1xuICAgICAgICAgIHNjYWxlWSA9IHkuc2NhbGUoKS5jb3B5KClcbiAgICAgICAgICBzY2FsZVkuZG9tYWluKFswLCAxXSlcbiAgICAgICAgZWxzZSBzY2FsZVkgPSB5LnNjYWxlKClcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAgIC54KChkKSAtPiAgeC5zY2FsZSgpKGQueCkpXG4gICAgICAgICAgLnkwKChkKSAtPiAgc2NhbGVZKGQueTAgKyBkLnkpKVxuICAgICAgICAgIC55MSgoZCkgLT4gIHNjYWxlWShkLnkwKSlcblxuICAgICAgICBsYXllcnMgPSBsYXllcnNcbiAgICAgICAgICAuZGF0YShsYXlvdXROZXcsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBpZiBsYXlvdXRPbGQubGVuZ3RoIGlzIDBcbiAgICAgICAgICBsYXllcnMuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKS5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGlmIGFkZGVkUHJlZFtkLmtleV0gdGhlbiBnZXRMYXllckJ5S2V5KGFkZGVkUHJlZFtkLmtleV0sIGxheW91dE9sZCkucGF0aCBlbHNlIGFyZWEoZC5sYXllci5tYXAoKHApIC0+ICB7eDogcC54LCB5OiAwLCB5MDogMH0pKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcbiAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b2Zmc30pXCIpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYShkLmxheWVyKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcblxuXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIHN1Y2MgPSBkZWxldGVkU3VjY1tkLmtleV1cbiAgICAgICAgICAgIGlmIHN1Y2MgdGhlbiBhcmVhKGdldExheWVyQnlLZXkoc3VjYywgbGF5b3V0TmV3KS5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkwfSkpIGVsc2UgYXJlYShsYXlvdXROZXdbbGF5b3V0TmV3Lmxlbmd0aCAtIDFdLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueTAgKyBwLnl9KSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgbGF5b3V0T2xkID0gbGF5b3V0TmV3Lm1hcCgoZCkgLT4ge2tleTogZC5rZXksIHBhdGg6IGFyZWEoZC5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkgKyBwLnkwfSkpfSlcbiAgICAgICAgbGF5ZXJLZXlzT2xkID0gbGF5ZXJLZXlzXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueClcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXJlYVN0YWNrZWQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaW4gWyd6ZXJvJywgJ3NpbGhvdWV0dGUnLCAnZXhwYW5kJywgJ3dpZ2dsZSddXG4gICAgICAgICAgb2Zmc2V0ID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvZmZzZXQgPSBcInplcm9cIlxuICAgICAgICBzdGFjay5vZmZzZXQob2Zmc2V0KVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhU3RhY2tlZFZlcnRpY2FsJywgKCRsb2csIHV0aWxzKSAtPlxuICBhcmVhU3RhY2tlZFZlcnRDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpXG4gICAgICBvZmZzZXQgPSAnemVybydcbiAgICAgIGxheWVycyA9IG51bGxcbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgbGF5ZXJEYXRhID0gW11cbiAgICAgIGxheW91dE5ldyA9IFtdXG4gICAgICBsYXlvdXRPbGQgPSBbXVxuICAgICAgbGF5ZXJLZXlzT2xkID0gW11cbiAgICAgIGFyZWEgPSB1bmRlZmluZWRcbiAgICAgIGRlbGV0ZWRTdWNjID0ge31cbiAgICAgIGFkZGVkUHJlZCA9IHt9XG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBzY2FsZVggPSB1bmRlZmluZWRcbiAgICAgIG9mZnMgPSAwXG4gICAgICBfaWQgPSAnYXJlYS1zdGFja2VkLXZlcnQnICsgYXJlYVN0YWNrZWRWZXJ0Q250cisrXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBsYXllckRhdGEubWFwKChsKSAtPiB7bmFtZTpsLmtleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwubGF5ZXJbaWR4XS54eCksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsYXllckRhdGFbMF0ubGF5ZXJbaWR4XS55eSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShsYXllckRhdGEsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3gnLCAoZCkgLT4gc2NhbGVYKGQubGF5ZXJbaWR4XS55ICsgZC5sYXllcltpZHhdLnkwKSkgICMgd2VpcmQhISEgaG93ZXZlciwgdGhlIGRhdGEgaXMgZm9yIGEgaG9yaXpvbnRhbCBjaGFydCB3aGljaCBnZXRzIHRyYW5zZm9ybWVkXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKGxheWVyRGF0YVswXS5sYXllcltpZHhdLnl5KStvZmZzfSlcIilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZ2V0TGF5ZXJCeUtleSA9IChrZXksIGxheW91dCkgLT5cbiAgICAgICAgZm9yIGwgaW4gbGF5b3V0XG4gICAgICAgICAgaWYgbC5rZXkgaXMga2V5XG4gICAgICAgICAgICByZXR1cm4gbFxuXG4gICAgICBsYXlvdXQgPSBzdGFjay52YWx1ZXMoKGQpLT5kLmxheWVyKS55KChkKSAtPiBkLnh4KVxuXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIyNcbiAgICAgIHByZXBEYXRhID0gKHgseSxjb2xvcikgLT5cblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueSArIHAueTB9KSl9KVxuICAgICAgICBsYXllcktleXNPbGQgPSBsYXllcktleXNcblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhAKVxuICAgICAgICBsYXllckRhdGEgPSBsYXllcktleXMubWFwKChrKSA9PiB7a2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBsYXllcjogQG1hcCgoZCkgLT4ge3g6IHgudmFsdWUoZCksIHl5OiAreS5sYXllclZhbHVlKGQsayksIHkwOiAwfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgICNsYXlvdXROZXcgPSBsYXlvdXQobGF5ZXJEYXRhKVxuXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG4gICAgICAjIyNcbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgQXJlYSBDaGFydFwiXG5cblxuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBkZWxldGVkU3VjYyA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzT2xkLCBsYXllcktleXMsIDEpXG4gICAgICAgIGFkZGVkUHJlZCA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzLCBsYXllcktleXNPbGQsIC0xKVxuXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBkYXRhLm1hcCgoZCkgLT4ge3l5OiB5LnZhbHVlKGQpLCB4eDogK3gubGF5ZXJWYWx1ZShkLGspLCB5MDogMH0pfSkgIyB5eTogbmVlZCB0byBhdm9pZCBvdmVyd3JpdGluZyBieSBsYXlvdXQgY2FsYyAtPiBzZWUgc3RhY2sgeSBhY2Nlc3NvclxuICAgICAgICBsYXlvdXROZXcgPSBsYXlvdXQobGF5ZXJEYXRhKVxuXG4gICAgICAgIG9mZnMgPSBpZiB5LmlzT3JkaW5hbCgpIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC1sYXllcicpXG5cbiAgICAgICAgaWYgb2Zmc2V0IGlzICdleHBhbmQnXG4gICAgICAgICAgc2NhbGVYID0geC5zY2FsZSgpLmNvcHkoKVxuICAgICAgICAgIHNjYWxlWC5kb21haW4oWzAsIDFdKVxuICAgICAgICBlbHNlIHNjYWxlWCA9IHguc2NhbGUoKVxuXG4gICAgICAgIGFyZWEgPSBkMy5zdmcuYXJlYSgpXG4gICAgICAgICAgLngoKGQpIC0+ICB5LnNjYWxlKCkoZC55eSkpXG4gICAgICAgICAgLnkwKChkKSAtPiAgc2NhbGVYKGQueTAgKyBkLnkpKVxuICAgICAgICAgIC55MSgoZCkgLT4gIHNjYWxlWChkLnkwKSlcblxuICAgICAgICBsYXllcnMgPSBsYXllcnNcbiAgICAgICAgICAuZGF0YShsYXlvdXROZXcsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBpZiBsYXlvdXRPbGQubGVuZ3RoIGlzIDBcbiAgICAgICAgICBsYXllcnMuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKS5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGlmIGFkZGVkUHJlZFtkLmtleV0gdGhlbiBnZXRMYXllckJ5S2V5KGFkZGVkUHJlZFtkLmtleV0sIGxheW91dE9sZCkucGF0aCBlbHNlIGFyZWEoZC5sYXllci5tYXAoKHApIC0+ICB7eXk6IHAueXksIHk6IDAsIHkwOiAwfSkpKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJyb3RhdGUoOTApIHNjYWxlKDEsLTEpXCIpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYShkLmxheWVyKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcblxuXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIHN1Y2MgPSBkZWxldGVkU3VjY1tkLmtleV1cbiAgICAgICAgICAgIGlmIHN1Y2MgdGhlbiBhcmVhKGdldExheWVyQnlLZXkoc3VjYywgbGF5b3V0TmV3KS5sYXllci5tYXAoKHApIC0+IHt5eTogcC55eSwgeTogMCwgeTA6IHAueTB9KSkgZWxzZSBhcmVhKGxheW91dE5ld1tsYXlvdXROZXcubGVuZ3RoIC0gMV0ubGF5ZXIubWFwKChwKSAtPiB7eXk6IHAueXksIHk6IDAsIHkwOiBwLnkwICsgcC55fSkpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eXk6IHAueXksIHk6IDAsIHkwOiBwLnkgKyBwLnkwfSkpfSlcbiAgICAgICAgbGF5ZXJLZXlzT2xkID0gbGF5ZXJLZXlzXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueSlcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXJlYVN0YWNrZWRWZXJ0aWNhbCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpbiBbJ3plcm8nLCAnc2lsaG91ZXR0ZScsICdleHBhbmQnLCAnd2lnZ2xlJ11cbiAgICAgICAgICBvZmZzZXQgPSB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9mZnNldCA9IFwiemVyb1wiXG4gICAgICAgIHN0YWNrLm9mZnNldChvZmZzZXQpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2FyZWFWZXJ0aWNhbCcsICgkbG9nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgX2xheW91dCA9IFtdXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgb2Zmc2V0ID0gMFxuICAgICAgX2lkID0gJ2xpbmUnICsgbGluZUNudHIrK1xuXG4gICAgICAjLS0tIFRvb2x0aXAgaGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX2xheW91dC5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobC52YWx1ZVtpZHhdLngpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKCdjaXJjbGUnKS5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgIC5hdHRyKCdyJywgaWYgX3Nob3dNYXJrZXJzIHRoZW4gOCBlbHNlIDUpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3gnLCAoZCkgLT4gX3NjYWxlTGlzdC54LnNjYWxlKCkoZC52YWx1ZVtpZHhdLngpKVxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcbiAgICAgICAgdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCAje19zY2FsZUxpc3QueS5zY2FsZSgpKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KSArIG9mZnNldH0pXCIpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAkbG9nLmxvZyAneS1yYW5nZScsIHkuc2NhbGUoKS5yYW5nZSgpLCAneS1kb21haW4nLCB5LnNjYWxlKCkuZG9tYWluKClcbiAgICAgICAgJGxvZy5sb2cgJ3gtcmFuZ2UnLCB4LnNjYWxlKCkucmFuZ2UoKSwgJ3gtZG9tYWluJywgeC5zY2FsZSgpLmRvbWFpbigpXG4gICAgICAgICRsb2cubG9nICdjb2xvci1yYW5nZScsIGNvbG9yLnNjYWxlKCkucmFuZ2UoKSwgJ2NvbG9yLWRvbWFpbicsIGNvbG9yLnNjYWxlKCkuZG9tYWluKClcbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcbiAgICAgICAgX2xheW91dCA9IGxheWVyS2V5cy5tYXAoKGtleSkgPT4ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6ZGF0YS5tYXAoKGQpLT4ge3k6eS52YWx1ZShkKSx4OngubGF5ZXJWYWx1ZShkLCBrZXkpfSl9KVxuXG4gICAgICAgIG9mZnNldCA9IGlmIHkuaXNPcmRpbmFsKCkgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGFyZWEgPSBkMy5zdmcuYXJlYSgpICAgICMgdHJpY2t5LiBEcmF3IHRoaXMgbGlrZSBhIHZlcnRpY2FsIGNoYXJ0IGFuZCB0aGVuIHJvdGF0ZSBhbmQgcG9zaXRpb24gaXQuXG4gICAgICAgIC54KChkKSAtPiBvcHRpb25zLndpZHRoIC0geS5zY2FsZSgpKGQueSkpXG4gICAgICAgIC55MCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAueTEoKGQpIC0+ICB4LnNjYWxlKCkoMCkpXG5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tvcHRpb25zLndpZHRoICsgb2Zmc2V0fSlyb3RhdGUoLTkwKVwiKSAjcm90YXRlIGFuZCBwb3NpdGlvbiBjaGFydFxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQudmFsdWUpKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LnkpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG5cblxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JhcnMnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZyktPlxuICBzQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgcmVzdHJpY3Q6ICdBJ1xuICByZXF1aXJlOiAnXmxheW91dCdcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICBfaWQgPSBcImJhcnMje3NCYXJDbnRyKyt9XCJcblxuICAgIGJhcnMgPSBudWxsXG4gICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG4gICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG5cbiAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKVxuICAgIF9tZXJnZShbXSkua2V5KChkKSAtPiBkLmtleSlcblxuICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcblxuICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC54LmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgaWYgbm90IGJhcnNcbiAgICAgICAgYmFycyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1iYXJzJylcbiAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBzdGFja2VkLWJhclwiXG5cbiAgICAgIGJhclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCkgLT4ge2RhdGE6ZCwga2V5OnkudmFsdWUoZCksIHg6eC5tYXAoZCksIHk6eS5tYXAoZCksIGNvbG9yOmNvbG9yLm1hcChkKSwgaGVpZ2h0Onkuc2NhbGUoKS5yYW5nZUJhbmQoeS52YWx1ZShkKSl9KVxuXG4gICAgICBfbWVyZ2UobGF5b3V0KS5maXJzdCh7eTpvcHRpb25zLmhlaWdodCArIGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nfSkubGFzdCh7eTowLCBoZWlnaHQ6YmFyT3V0ZXJQYWRkaW5nT2xkIC0gYmFyUGFkZGluZ09sZCAvIDJ9KSAgI3kuc2NhbGUoKS5yYW5nZSgpW3kuc2NhbGUoKS5yYW5nZSgpLmxlbmd0aC0xXVxuXG4gICAgICBiYXJzID0gYmFycy5kYXRhKGxheW91dCwgKGQpIC0+IGQua2V5KVxuXG4gICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLmhlaWdodCBlbHNlIDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cigneCcsIChkKSAtPiBNYXRoLm1pbih4LnNjYWxlKCkoMCksIGQueCkpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBNYXRoLmFicyh4LnNjYWxlKCkoMCkgLSBkLngpKVxuICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLnkpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gX21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDIpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAucmVtb3ZlKClcblxuICAgICAgaW5pdGlhbCA9IGZhbHNlXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cblxuICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgX3NjYWxlTGlzdC55LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JhckNsdXN0ZXJlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG5cbiAgY2x1c3RlcmVkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJjbHVzdGVyZWRCYXIje2NsdXN0ZXJlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQubGF5ZXJLZXkpXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG4gICAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgICMkbG9nLmluZm8gXCJyZW5kZXJpbmcgY2x1c3RlcmVkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICAjIG1hcCBkYXRhIHRvIHRoZSByaWdodCBmb3JtYXQgZm9yIHJlbmRlcmluZ1xuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIGNsdXN0ZXJZID0gZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbih4LmxheWVyS2V5cyhkYXRhKSkucmFuZ2VCYW5kcyhbMCwgeS5zY2FsZSgpLnJhbmdlQmFuZCgpXSwgMCwgMClcblxuICAgICAgICBjbHVzdGVyID0gZGF0YS5tYXAoKGQpIC0+IGwgPSB7XG4gICAgICAgICAga2V5OnkudmFsdWUoZCksIGRhdGE6ZCwgeTp5Lm1hcChkKSwgaGVpZ2h0OiB5LnNjYWxlKCkucmFuZ2VCYW5kKHkudmFsdWUoZCkpXG4gICAgICAgICAgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7bGF5ZXJLZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGtleTp5LnZhbHVlKGQpLCB2YWx1ZTogZFtrXSwgeTpjbHVzdGVyWShrKSwgeDogeC5zY2FsZSgpKGRba10pLCB3aWR0aDp4LnNjYWxlKCkoZFtrXSksIGhlaWdodDpjbHVzdGVyWS5yYW5nZUJhbmQoayl9KX1cbiAgICAgICAgKVxuXG4gICAgICAgIF9tZXJnZShjbHVzdGVyKS5maXJzdCh7eTpvcHRpb25zLmhlaWdodCArIGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nLCBoZWlnaHQ6eS5zY2FsZSgpLnJhbmdlQmFuZCgpfSkubGFzdCh7eTowLCBoZWlnaHQ6YmFyT3V0ZXJQYWRkaW5nT2xkIC0gYmFyUGFkZGluZ09sZCAvIDJ9KVxuICAgICAgICBfbWVyZ2VMYXllcnMoY2x1c3RlclswXS5sYXllcnMpLmZpcnN0KHt5OjAsIGhlaWdodDowfSkubGFzdCh7eTpjbHVzdGVyWzBdLmhlaWdodCwgaGVpZ2h0OjB9KVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVycy5kYXRhKGNsdXN0ZXIsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYXllcicpLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT5cbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgIFwidHJhbnNsYXRlKDAsICN7aWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyfSkgc2NhbGUoMSwje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0pXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7ZC55fSkgc2NhbGUoMSwxKVwiKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsICN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDJ9KSBzY2FsZSgxLDApXCIpXG4gICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBiYXJzID0gbGF5ZXJzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgLmRhdGEoXG4gICAgICAgICAgICAoZCkgLT4gZC5sYXllcnNcbiAgICAgICAgICAsIChkKSAtPiBkLmxheWVyS2V5ICsgJ3wnICsgZC5rZXlcbiAgICAgICAgICApXG5cbiAgICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC55IGVsc2UgX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkKS55ICsgX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkKS5oZWlnaHQpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC5oZWlnaHQgZWxzZSAwKVxuICAgICAgICAgIC5hdHRyKCd4JywgeC5zY2FsZSgpKDApKVxuXG5cbiAgICAgICAgYmFycy5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5zY2FsZSgpKGQubGF5ZXJLZXkpKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBkLnkpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gTWF0aC5taW4oeC5zY2FsZSgpKDApLCBkLngpKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gTWF0aC5hYnMoZC5oZWlnaHQpKVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgIy5hdHRyKCd3aWR0aCcsMClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQpLnkpXG4gICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd4JykuZG9tYWluQ2FsYygnbWF4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdcblxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICAgIF9zY2FsZUxpc3QueS5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JhclN0YWNrZWQnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZykgLT5cblxuICBzdGFja2VkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBTdGFja2VkIGJhcidcblxuICAgICAgX2lkID0gXCJzdGFja2VkQ29sdW1uI3tzdGFja2VkQmFyQ250cisrfVwiXG5cbiAgICAgIGxheWVycyA9IG51bGxcblxuICAgICAgc3RhY2sgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSAoKS0+XG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgIyRsb2cuZGVidWcgXCJkcmF3aW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgc3RhY2sgPSBbXVxuICAgICAgICBmb3IgZCBpbiBkYXRhXG4gICAgICAgICAgeDAgPSAwXG4gICAgICAgICAgbCA9IHtrZXk6eS52YWx1ZShkKSwgbGF5ZXJzOltdLCBkYXRhOmQsIHk6eS5tYXAoZCksIGhlaWdodDppZiB5LnNjYWxlKCkucmFuZ2VCYW5kIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIGVsc2UgMX1cbiAgICAgICAgICBpZiBsLnkgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgIGwubGF5ZXJzID0gbGF5ZXJLZXlzLm1hcCgoaykgLT5cbiAgICAgICAgICAgICAgbGF5ZXIgPSB7bGF5ZXJLZXk6aywga2V5Omwua2V5LCB2YWx1ZTpkW2tdLCB3aWR0aDogeC5zY2FsZSgpKCtkW2tdKSwgaGVpZ2h0OiAoaWYgeS5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDEpLCB4OiB4LnNjYWxlKCkoK3gwKSwgY29sb3I6IGNvbG9yLnNjYWxlKCkoayl9XG4gICAgICAgICAgICAgIHgwICs9ICtkW2tdXG4gICAgICAgICAgICAgIHJldHVybiBsYXllclxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgc3RhY2sucHVzaChsKVxuXG4gICAgICAgIF9tZXJnZShzdGFjaykuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgaGVpZ2h0OjB9KS5sYXN0KHt5OjAsIGhlaWdodDpiYXJPdXRlclBhZGRpbmdPbGQgLSBiYXJQYWRkaW5nT2xkIC8gMn0pXG4gICAgICAgIF9tZXJnZUxheWVycyhsYXllcktleXMpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEoc3RhY2ssIChkKS0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKS5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7aWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueSAtIGJhclBhZGRpbmdPbGQgLyAyfSkgc2NhbGUoMSwje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0pXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JyxpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IHJldHVybiBcInRyYW5zbGF0ZSgwLCAje2QueX0pIHNjYWxlKDEsMSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueSArIF9tZXJnZS5kZWxldGVkU3VjYyhkKS5oZWlnaHQgKyBiYXJQYWRkaW5nIC8gMn0pIHNjYWxlKDEsMClcIilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBiYXJzID0gbGF5ZXJzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgLmRhdGEoXG4gICAgICAgICAgICAoZCkgLT4gZC5sYXllcnNcbiAgICAgICAgICAsIChkKSAtPiBkLmxheWVyS2V5ICsgJ3wnICsgZC5rZXlcbiAgICAgICAgICApXG5cbiAgICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPlxuICAgICAgICAgICAgaWYgX21lcmdlLnByZXYoZC5rZXkpXG4gICAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5hZGRlZFByZWQoZC5sYXllcktleSkpXG4gICAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLnByZXYoZC5rZXkpLmxheWVyc1tpZHhdLnggKyBfbWVyZ2UucHJldihkLmtleSkubGF5ZXJzW2lkeF0ud2lkdGggZWxzZSB4LnNjYWxlKCkoMClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZC54XG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBpZiBfbWVyZ2UucHJldihkLmtleSkgdGhlbiAwIGVsc2UgZC53aWR0aClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLngpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT5cbiAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkLmxheWVyS2V5KSlcbiAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tpZHhdLnggZWxzZSBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2xheWVyS2V5cy5sZW5ndGggLSAxXS54ICsgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ud2lkdGhcbiAgICAgICAgICApXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd4JykuZG9tYWluQ2FsYygndG90YWwnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdcblxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICAgIF9zY2FsZUxpc3QueS5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2J1YmJsZScsICgkbG9nLCB1dGlscykgLT5cbiAgYnViYmxlQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAnYnViYmxlQ2hhcnQgbGlua2VkJ1xuICAgICAgbGF5b3V0ID0gY29udHJvbGxlci5tZVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX2lkID0gJ2J1YmJsZScgKyBidWJibGVDbnRyKytcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICBmb3Igc05hbWUsIHNjYWxlIG9mIF9zY2FsZUxpc3RcbiAgICAgICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IHNjYWxlLmF4aXNMYWJlbCgpLCB2YWx1ZTogc2NhbGUuZm9ybWF0dGVkVmFsdWUoZGF0YSksIGNvbG9yOiBpZiBzTmFtZSBpcyAnY29sb3InIHRoZW4geydiYWNrZ3JvdW5kLWNvbG9yJzpzY2FsZS5tYXAoZGF0YSl9IGVsc2UgdW5kZWZpbmVkfSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUpIC0+XG5cbiAgICAgICAgYnViYmxlcyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1idWJibGUnKS5kYXRhKGRhdGEsIChkKSAtPiBjb2xvci52YWx1ZShkKSlcbiAgICAgICAgYnViYmxlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1idWJibGUgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgICAgYnViYmxlc1xuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5tYXAoZCkpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgICByOiAgKGQpIC0+IHNpemUubWFwKGQpXG4gICAgICAgICAgICAgIGN4OiAoZCkgLT4geC5tYXAoZClcbiAgICAgICAgICAgICAgY3k6IChkKSAtPiB5Lm1hcChkKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgIGJ1YmJsZXMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvcicsICdzaXplJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBfdG9vbHRpcCA9IGxheW91dC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgfVxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW4nLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZyktPlxuICBzQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgcmVzdHJpY3Q6ICdBJ1xuICByZXF1aXJlOiAnXmxheW91dCdcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICBfaWQgPSBcInNpbXBsZUNvbHVtbiN7c0JhckNudHIrK31cIlxuXG4gICAgYmFycyA9IG51bGxcbiAgICBfc2NhbGVMaXN0ID0ge31cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKVxuICAgIF9tZXJnZShbXSkua2V5KChkKSAtPiBkLmtleSlcbiAgICBpbml0aWFsID0gdHJ1ZVxuICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuXG4gICAgY29uZmlnID0ge31cbiAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuXG4gICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBfc2NhbGVMaXN0LmNvbG9yLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIHZhbHVlOiBfc2NhbGVMaXN0LnkuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogX3NjYWxlTGlzdC5jb2xvci5tYXAoZGF0YS5kYXRhKX19KVxuXG4gICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICBpZiBub3QgYmFyc1xuICAgICAgICBiYXJzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcnMnKVxuICAgICAgIyRsb2cubG9nIFwicmVuZGVyaW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgYmFyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgIGJhck91dGVyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgIGxheW91dCA9IGRhdGEubWFwKChkKSAtPiB7ZGF0YTpkLCBrZXk6eC52YWx1ZShkKSwgeDp4Lm1hcChkKSwgeTp5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCB3aWR0aDp4LnNjYWxlKCkucmFuZ2VCYW5kKHgudmFsdWUoZCkpfSlcblxuICAgICAgX21lcmdlKGxheW91dCkuZmlyc3Qoe3g6YmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmd9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOiAwfSlcblxuICAgICAgYmFycyA9IGJhcnMuZGF0YShsYXlvdXQsIChkKSAtPiBkLmtleSlcblxuICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aCAgKyBiYXJQYWRkaW5nT2xkIC8gMilcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLndpZHRoIGVsc2UgMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG5cbiAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcikudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IE1hdGgubWluKHkuc2NhbGUoKSgwKSwgZC55KSlcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gTWF0aC5hYnMoeS5zY2FsZSgpKDApIC0gZC55KSlcbiAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IF9tZXJnZS5kZWxldGVkU3VjYyhkKS54IC0gYmFyUGFkZGluZyAvIDIpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgIF9zY2FsZUxpc3QueC5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbHVtbkNsdXN0ZXJlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG5cbiAgY2x1c3RlcmVkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJjbHVzdGVyZWRDb2x1bW4je2NsdXN0ZXJlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQubGF5ZXJLZXkpXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgIyRsb2cuaW5mbyBcInJlbmRlcmluZyBjbHVzdGVyZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgICMgbWFwIGRhdGEgdG8gdGhlIHJpZ2h0IGZvcm1hdCBmb3IgcmVuZGVyaW5nXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgY2x1c3RlclggPSBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKHkubGF5ZXJLZXlzKGRhdGEpKS5yYW5nZUJhbmRzKFswLHguc2NhbGUoKS5yYW5nZUJhbmQoKV0sIDAsIDApXG5cbiAgICAgICAgY2x1c3RlciA9IGRhdGEubWFwKChkKSAtPiBsID0ge1xuICAgICAgICAgIGtleTp4LnZhbHVlKGQpLCBkYXRhOmQsIHg6eC5tYXAoZCksIHdpZHRoOiB4LnNjYWxlKCkucmFuZ2VCYW5kKHgudmFsdWUoZCkpXG4gICAgICAgICAgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7bGF5ZXJLZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGtleTp4LnZhbHVlKGQpLCB2YWx1ZTogZFtrXSwgeDpjbHVzdGVyWChrKSwgeTogeS5zY2FsZSgpKGRba10pLCBoZWlnaHQ6eS5zY2FsZSgpKDApIC0geS5zY2FsZSgpKGRba10pLCB3aWR0aDpjbHVzdGVyWC5yYW5nZUJhbmQoayl9KX1cbiAgICAgICAgKVxuXG4gICAgICAgIF9tZXJnZShjbHVzdGVyKS5maXJzdCh7eDpiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgd2lkdGg6MH0pLmxhc3Qoe3g6b3B0aW9ucy53aWR0aCArIGJhclBhZGRpbmcvMiAtIGJhck91dGVyUGFkZGluZ09sZCwgd2lkdGg6MH0pXG4gICAgICAgIF9tZXJnZUxheWVycyhjbHVzdGVyWzBdLmxheWVycykuZmlyc3Qoe3g6MCwgd2lkdGg6MH0pLmxhc3Qoe3g6Y2x1c3RlclswXS53aWR0aCwgd2lkdGg6MH0pXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1sYXllcicpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzLmRhdGEoY2x1c3RlciwgKGQpIC0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWxheWVyJykuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgYmFyUGFkZGluZ09sZCAvIDJ9LDApIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwgMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwwKSBzY2FsZSgxLDEpXCIpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueCAtIGJhclBhZGRpbmcgLyAyfSwgMCkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkueCArIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+aWYgaW5pdGlhbCB0aGVuIGQud2lkdGggZWxzZSAwKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3Iuc2NhbGUoKShkLmxheWVyS2V5KSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IE1hdGgubWluKHkuc2NhbGUoKSgwKSwgZC55KSlcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IE1hdGguYWJzKGQuaGVpZ2h0KSlcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLDApXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQpLngpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LngucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5TdGFja2VkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpIC0+XG5cbiAgc3RhY2tlZENvbHVtbkNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgU3RhY2tlZCBiYXInXG5cbiAgICAgIF9pZCA9IFwic3RhY2tlZENvbHVtbiN7c3RhY2tlZENvbHVtbkNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIHN0YWNrID0gW11cbiAgICAgIF90b29sdGlwID0gKCktPlxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKFwiLmxheWVyXCIpXG4gICAgICAgICMkbG9nLmRlYnVnIFwiZHJhd2luZyBzdGFja2VkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHN0YWNrID0gW11cbiAgICAgICAgZm9yIGQgaW4gZGF0YVxuICAgICAgICAgIHkwID0gMFxuICAgICAgICAgIGwgPSB7a2V5OngudmFsdWUoZCksIGxheWVyczpbXSwgZGF0YTpkLCB4OngubWFwKGQpLCB3aWR0aDppZiB4LnNjYWxlKCkucmFuZ2VCYW5kIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIGVsc2UgMX1cbiAgICAgICAgICBpZiBsLnggaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgIGwubGF5ZXJzID0gbGF5ZXJLZXlzLm1hcCgoaykgLT5cbiAgICAgICAgICAgICAgbGF5ZXIgPSB7bGF5ZXJLZXk6aywga2V5Omwua2V5LCB2YWx1ZTpkW2tdLCBoZWlnaHQ6ICB5LnNjYWxlKCkoMCkgLSB5LnNjYWxlKCkoK2Rba10pLCB3aWR0aDogKGlmIHguc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxKSwgeTogeS5zY2FsZSgpKCt5MCArICtkW2tdKSwgY29sb3I6IGNvbG9yLnNjYWxlKCkoayl9XG4gICAgICAgICAgICAgIHkwICs9ICtkW2tdXG4gICAgICAgICAgICAgIHJldHVybiBsYXllclxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgc3RhY2sucHVzaChsKVxuXG4gICAgICAgIF9tZXJnZShzdGFjaykuZmlyc3Qoe3g6IGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nLCB3aWR0aDowfSkubGFzdCh7eDpvcHRpb25zLndpZHRoICsgYmFyUGFkZGluZy8yIC0gYmFyT3V0ZXJQYWRkaW5nT2xkLCB3aWR0aDowfSlcbiAgICAgICAgX21lcmdlTGF5ZXJzKGxheWVyS2V5cylcblxuICAgICAgICBsYXllcnMgPSBsYXllcnNcbiAgICAgICAgICAuZGF0YShzdGFjaywgKGQpLT4gZC5rZXkpXG5cbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiBpbml0aWFsIHRoZW4gZC54IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS54ICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aCArIGJhclBhZGRpbmdPbGQgLyAyfSwwKSBzY2FsZSgje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0sIDEpXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JyxpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwwKSBzY2FsZSgxLDEpXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnggLSBiYXJQYWRkaW5nIC8gMn0sIDApIHNjYWxlKDAsMSlcIilcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGJhcnMgPSBsYXllcnMuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAuZGF0YShcbiAgICAgICAgICAgIChkKSAtPiBkLmxheWVyc1xuICAgICAgICAgICwgKGQpIC0+IGQubGF5ZXJLZXkgKyAnfCcgKyBkLmtleVxuICAgICAgICAgIClcblxuICAgICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+XG4gICAgICAgICAgICBpZiBfbWVyZ2UucHJldihkLmtleSlcbiAgICAgICAgICAgICAgaWR4ID0gbGF5ZXJLZXlzLmluZGV4T2YoX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkLmxheWVyS2V5KSlcbiAgICAgICAgICAgICAgaWYgaWR4ID49IDAgdGhlbiBfbWVyZ2UucHJldihkLmtleSkubGF5ZXJzW2lkeF0ueSBlbHNlIHkuc2NhbGUoKSgwKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBkLnlcbiAgICAgICAgICApXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLDApXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT5cbiAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkLmxheWVyS2V5KSlcbiAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tpZHhdLnkgKyBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2lkeF0uaGVpZ2h0IGVsc2UgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ueVxuICAgICAgICAgIClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdnYXVnZScsICgkbG9nLCB1dGlscykgLT5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG4gICAgY29udHJvbGxlcjogKCRzY29wZSwgJGF0dHJzKSAtPlxuICAgICAgbWUgPSB7Y2hhcnRUeXBlOiAnR2F1Z2VDaGFydCcsIGlkOnV0aWxzLmdldElkKCl9XG4gICAgICAkYXR0cnMuJHNldCgnY2hhcnQtaWQnLCBtZS5pZClcbiAgICAgIHJldHVybiBtZVxuICAgIFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGluaXRhbFNob3cgPSB0cnVlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAkbG9nLmluZm8gJ2RyYXdpbmcgR2F1Z2UgQ2hhcnQnXG5cbiAgICAgICAgZGF0ID0gW2RhdGFdXG5cbiAgICAgICAgeURvbWFpbiA9IHkuc2NhbGUoKS5kb21haW4oKVxuICAgICAgICBjb2xvckRvbWFpbiA9IGFuZ3VsYXIuY29weShjb2xvci5zY2FsZSgpLmRvbWFpbigpKVxuICAgICAgICBjb2xvckRvbWFpbi51bnNoaWZ0KHlEb21haW5bMF0pXG4gICAgICAgIGNvbG9yRG9tYWluLnB1c2goeURvbWFpblsxXSlcbiAgICAgICAgcmFuZ2VzID0gW11cbiAgICAgICAgZm9yIGkgaW4gWzEuLmNvbG9yRG9tYWluLmxlbmd0aC0xXVxuICAgICAgICAgIHJhbmdlcy5wdXNoIHtmcm9tOitjb2xvckRvbWFpbltpLTFdLHRvOitjb2xvckRvbWFpbltpXX1cblxuICAgICAgICAjZHJhdyBjb2xvciBzY2FsZVxuXG4gICAgICAgIGJhciA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICBiYXIgPSBiYXIuZGF0YShyYW5nZXMsIChkLCBpKSAtPiBpKVxuICAgICAgICBpZiBpbml0YWxTaG93XG4gICAgICAgICAgYmFyLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMCkuYXR0cignd2lkdGgnLCA1MClcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiYXIuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKS5hdHRyKCd3aWR0aCcsIDUwKVxuXG4gICAgICAgIGJhci50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4geS5zY2FsZSgpKDApIC0geS5zY2FsZSgpKGQudG8gLSBkLmZyb20pKVxuICAgICAgICAgIC5hdHRyKCd5JywoZCkgLT4geS5zY2FsZSgpKGQudG8pKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5zY2FsZSgpKGQuZnJvbSkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBiYXIuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgIyBkcmF3IHZhbHVlXG5cbiAgICAgICAgYWRkTWFya2VyID0gKHMpIC0+XG4gICAgICAgICAgcy5hcHBlbmQoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIDU1KS5hdHRyKCdoZWlnaHQnLCA0KS5zdHlsZSgnZmlsbCcsICdibGFjaycpXG4gICAgICAgICAgcy5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ3InLCAxMCkuYXR0cignY3gnLCA2NSkuYXR0cignY3knLDIpLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuXG4gICAgICAgIG1hcmtlciA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKVxuICAgICAgICBtYXJrZXIgPSBtYXJrZXIuZGF0YShkYXQsIChkKSAtPiAnd2stY2hhcnQtbWFya2VyJylcbiAgICAgICAgbWFya2VyLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1tYXJrZXInKS5jYWxsKGFkZE1hcmtlcilcblxuICAgICAgICBpZiBpbml0YWxTaG93XG4gICAgICAgICAgbWFya2VyLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7eS5zY2FsZSgpKGQudmFsdWUpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAwKVxuXG4gICAgICAgIG1hcmtlclxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje3kuc2NhbGUoKShkLnZhbHVlKX0pXCIpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBjb2xvci5zY2FsZSgpKGQudmFsdWUpKS5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgaW5pdGFsU2hvdyA9IGZhbHNlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgdGhpcy5yZXF1aXJlZFNjYWxlcyhbJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ2NvbG9yJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2dlb01hcCcsICgkbG9nLCB1dGlscykgLT5cbiAgbWFwQ250ciA9IDBcblxuICBwYXJzZUxpc3QgPSAodmFsKSAtPlxuICAgIGlmIHZhbFxuICAgICAgbCA9IHZhbC50cmltKCkucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKS5zcGxpdCgnLCcpLm1hcCgoZCkgLT4gZC5yZXBsYWNlKC9eW1xcXCJ8J118W1xcXCJ8J10kL2csICcnKSlcbiAgICAgIGwgPSBsLm1hcCgoZCkgLT4gaWYgaXNOYU4oZCkgdGhlbiBkIGVsc2UgK2QpXG4gICAgICByZXR1cm4gaWYgbC5sZW5ndGggaXMgMSB0aGVuIHJldHVybiBsWzBdIGVsc2UgbFxuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgc2NvcGU6IHtcbiAgICAgIGdlb2pzb246ICc9J1xuICAgICAgcHJvamVjdGlvbjogJz0nXG4gICAgfVxuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnZ2VvTWFwJyArIG1hcENudHIrK1xuICAgICAgX2RhdGFNYXBwaW5nID0gZDMubWFwKClcblxuICAgICAgX3NjYWxlID0gMVxuICAgICAgX3JvdGF0ZSA9IFswLDBdXG4gICAgICBfaWRQcm9wID0gJydcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cblxuICAgICAgICB2YWwgPSBfZGF0YU1hcHBpbmcuZ2V0KGRhdGEucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOnZhbC5SUywgdmFsdWU6dmFsLkRFU30pXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcGF0aFNlbCA9IFtdXG5cbiAgICAgIF9wcm9qZWN0aW9uID0gZDMuZ2VvLm9ydGhvZ3JhcGhpYygpXG4gICAgICBfd2lkdGggPSAwXG4gICAgICBfaGVpZ2h0ID0gMFxuICAgICAgX3BhdGggPSB1bmRlZmluZWRcbiAgICAgIF96b29tID0gZDMuZ2VvLnpvb20oKVxuICAgICAgICAucHJvamVjdGlvbihfcHJvamVjdGlvbilcbiAgICAgICAgIy5zY2FsZUV4dGVudChbcHJvamVjdGlvbi5zY2FsZSgpICogLjcsIHByb2plY3Rpb24uc2NhbGUoKSAqIDEwXSlcbiAgICAgICAgLm9uIFwiem9vbS5yZWRyYXdcIiwgKCkgLT5cbiAgICAgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHBhdGhTZWwuYXR0cihcImRcIiwgX3BhdGgpO1xuXG4gICAgICBfZ2VvSnNvbiA9IHVuZGVmaW5lZFxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBfd2lkdGggPSBvcHRpb25zLndpZHRoXG4gICAgICAgIF9oZWlnaHQgPSBvcHRpb25zLmhlaWdodFxuICAgICAgICBpZiBkYXRhIGFuZCBkYXRhWzBdLmhhc093blByb3BlcnR5KF9pZFByb3BbMV0pXG4gICAgICAgICAgZm9yIGUgaW4gZGF0YVxuICAgICAgICAgICAgX2RhdGFNYXBwaW5nLnNldChlW19pZFByb3BbMV1dLCBlKVxuXG4gICAgICAgIGlmIF9nZW9Kc29uXG5cbiAgICAgICAgICBfcHJvamVjdGlvbi50cmFuc2xhdGUoW193aWR0aC8yLCBfaGVpZ2h0LzJdKVxuICAgICAgICAgIHBhdGhTZWwgPSB0aGlzLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShfZ2VvSnNvbi5mZWF0dXJlcywgKGQpIC0+IGQucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgICBwYXRoU2VsXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJzdmc6cGF0aFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCdsaWdodGdyZXknKS5zdHlsZSgnc3Ryb2tlJywgJ2RhcmtncmV5JylcbiAgICAgICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICAgICAgICAuY2FsbChfem9vbSlcblxuICAgICAgICAgIHBhdGhTZWxcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBfcGF0aClcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPlxuICAgICAgICAgICAgICB2YWwgPSBfZGF0YU1hcHBpbmcuZ2V0KGQucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgICAgICAgY29sb3IubWFwKHZhbClcbiAgICAgICAgICApXG5cbiAgICAgICAgICBwYXRoU2VsLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ2NvbG9yJ10pXG4gICAgICAgIF9zY2FsZUxpc3QuY29sb3IucmVzZXRPbk5ld0RhdGEodHJ1ZSlcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICAjIEdlb01hcCBzcGVjaWZpYyBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NvcGUuJHdhdGNoICdwcm9qZWN0aW9uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgJGxvZy5sb2cgJ3NldHRpbmcgUHJvamVjdGlvbiBwYXJhbXMnLCB2YWxcbiAgICAgICAgICBpZiBkMy5nZW8uaGFzT3duUHJvcGVydHkodmFsLnByb2plY3Rpb24pXG4gICAgICAgICAgICBfcHJvamVjdGlvbiA9IGQzLmdlb1t2YWwucHJvamVjdGlvbl0oKVxuICAgICAgICAgICAgX3Byb2plY3Rpb24uY2VudGVyKHZhbC5jZW50ZXIpLnNjYWxlKHZhbC5zY2FsZSkucm90YXRlKHZhbC5yb3RhdGUpLmNsaXBBbmdsZSh2YWwuY2xpcEFuZ2xlKVxuICAgICAgICAgICAgX2lkUHJvcCA9IHZhbC5pZE1hcFxuICAgICAgICAgICAgaWYgX3Byb2plY3Rpb24ucGFyYWxsZWxzXG4gICAgICAgICAgICAgIF9wcm9qZWN0aW9uLnBhcmFsbGVscyh2YWwucGFyYWxsZWxzKVxuICAgICAgICAgICAgX3NjYWxlID0gX3Byb2plY3Rpb24uc2NhbGUoKVxuICAgICAgICAgICAgX3JvdGF0ZSA9IF9wcm9qZWN0aW9uLnJvdGF0ZSgpXG4gICAgICAgICAgICBfcGF0aCA9IGQzLmdlby5wYXRoKCkucHJvamVjdGlvbihfcHJvamVjdGlvbilcbiAgICAgICAgICAgIF96b29tLnByb2plY3Rpb24oX3Byb2plY3Rpb24pXG5cbiAgICAgICAgICAgIGxheW91dC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgICAsIHRydWUgI2RlZXAgd2F0Y2hcblxuICAgICAgc2NvcGUuJHdhdGNoICdnZW9qc29uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkIGFuZCB2YWwgaXNudCAnJ1xuICAgICAgICAgIF9nZW9Kc29uID0gdmFsXG4gICAgICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5IaXN0b2dyYW0nLCAoJGxvZywgYmFyQ29uZmlnLCB1dGlscykgLT5cblxuICBzSGlzdG9DbnRyID0gMFxuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIF9pZCA9IFwiaGlzdG9ncmFtI3tzSGlzdG9DbnRyKyt9XCJcblxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBidWNrZXRzID0gdW5kZWZpbmVkXG4gICAgICBsYWJlbHMgPSB1bmRlZmluZWRcbiAgICAgIGNvbmZpZyA9IHt9XG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCktPiBkLnhWYWwpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3QueS5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplLCBzaGFwZSwgeFJhbmdlKSAtPlxuXG4gICAgICAgIGlmIHhSYW5nZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCkgLT4ge3g6eFJhbmdlLnNjYWxlKCkoeFJhbmdlLmxvd2VyVmFsdWUoZCkpLCB4VmFsOnhSYW5nZS5sb3dlclZhbHVlKGQpLCB3aWR0aDp4UmFuZ2Uuc2NhbGUoKSh4UmFuZ2UudXBwZXJWYWx1ZShkKSkgLSB4UmFuZ2Uuc2NhbGUoKSh4UmFuZ2UubG93ZXJWYWx1ZShkKSksIHk6eS5tYXAoZCksIGhlaWdodDpvcHRpb25zLmhlaWdodCAtIHkubWFwKGQpLCBjb2xvcjpjb2xvci5tYXAoZCksIGRhdGE6ZH0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBkYXRhLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHN0YXJ0ID0geFJhbmdlLmxvd2VyVmFsdWUoZGF0YVswXSlcbiAgICAgICAgICAgIHN0ZXAgPSB4UmFuZ2UubG93ZXJWYWx1ZShkYXRhWzFdKSAtIHN0YXJ0XG4gICAgICAgICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCwgaSkgLT4ge3g6eFJhbmdlLnNjYWxlKCkoc3RhcnQgKyBzdGVwICogaSksIHhWYWw6eFJhbmdlLmxvd2VyVmFsdWUoZCksIHdpZHRoOnhSYW5nZS5zY2FsZSgpKHN0ZXApLCB5OnkubWFwKGQpLCBoZWlnaHQ6b3B0aW9ucy5oZWlnaHQgLSB5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCBkYXRhOmR9KVxuXG4gICAgICAgIF9tZXJnZShsYXlvdXQpLmZpcnN0KHt4OjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGgsIHdpZHRoOiAwfSlcblxuICAgICAgICBpZiBub3QgYnVja2V0c1xuICAgICAgICAgIGJ1Y2tldHMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYnVja2V0JylcblxuICAgICAgICBidWNrZXRzID0gYnVja2V0cy5kYXRhKGxheW91dCwgKGQpIC0+IGQueFZhbClcblxuICAgICAgICBidWNrZXRzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1idWNrZXQnKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueCAgKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC53aWR0aCBlbHNlIDApXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gZC5oZWlnaHQpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICAgIGJ1Y2tldHMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGQueSlcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcblxuICAgICAgICBidWNrZXRzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueClcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgICNpZiBob3N0LnNob3dMYWJlbHMoKVxuXG4gICAgICAgIGlmIG5vdCBsYWJlbHNcbiAgICAgICAgICBsYWJlbHMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtbGFiZWwnKVxuICAgICAgICBsYWJlbHMgPSBsYWJlbHMuZGF0YSgoaWYgaG9zdC5zaG93TGFiZWxzKCkgdGhlbiBsYXlvdXQgZWxzZSBbXSksIChkKSAtPiBkLnhWYWwpXG5cbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGFiZWwnKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG5cbiAgICAgICAgbGFiZWxzXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54ICsgZC53aWR0aCAvIDIpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55IC0gMjApXG4gICAgICAgICAgLmF0dHIoJ2R5JywgJzFlbScpXG4gICAgICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzEuM2VtJylcbiAgICAgICAgICAudGV4dCgoZCkgLT4geS5mb3JtYXR0ZWRWYWx1ZShkLmRhdGEpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgbGFiZWxzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgICAgIyMjXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBsYWJlbHNcbiAgICAgICAgICAgIGxhYmVscyA9IGxhYmVscy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgLnJlbW92ZSgpXG4gICAgICAgICMjI1xuICAgICAgICBpbml0aWFsID0gZmFsc2VcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsncmFuZ2VYJywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgncmFuZ2VYJykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuc2NhbGVUeXBlKCdsaW5lYXInKS5kb21haW5DYWxjKCdyYW5nZUV4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgaG9zdC5zaG93TGFiZWxzKGZhbHNlKVxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZScgb3IgdmFsIGlzIFwiXCJcbiAgICAgICAgICBob3N0LnNob3dMYWJlbHModHJ1ZSlcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsaW5lJywgKCRsb2csIGJlaGF2aW9yLCB1dGlscywgdGltaW5nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBfbGF5ZXJLZXlzID0gW11cbiAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgX2RhdGFPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNOZXcgPSBbXVxuICAgICAgX3BhdGhBcnJheSA9IFtdXG4gICAgICBfaW5pdGlhbE9wYWNpdHkgPSAwXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG4gICAgICBsaW5lID0gdW5kZWZpbmVkXG4gICAgICBtYXJrZXJzID0gdW5kZWZpbmVkXG5cbiAgICAgIGJydXNoTGluZSA9IHVuZGVmaW5lZFxuXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGlkeCkgLT5cbiAgICAgICAgX3BhdGhBcnJheSA9IF8udG9BcnJheShfcGF0aFZhbHVlc05ldylcbiAgICAgICAgdHRNb3ZlRGF0YS5hcHBseSh0aGlzLCBbaWR4XSlcblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX3BhdGhBcnJheS5tYXAoKGwpIC0+IHtuYW1lOmxbaWR4XS5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsW2lkeF0ueXYpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsW2lkeF0uY29sb3J9LCB4djpsW2lkeF0ueHZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueHYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbaWR4XS5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkW2lkeF0uY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gZFtpZHhdLnkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X3BhdGhBcnJheVswXVtpZHhdLnggKyBvZmZzZXR9KVwiKVxuXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgICBtZXJnZWRYID0gdXRpbHMubWVyZ2VTZXJpZXMoeC52YWx1ZShfZGF0YU9sZCksIHgudmFsdWUoZGF0YSkpXG4gICAgICAgIF9sYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBfbGF5b3V0ID0gW11cblxuICAgICAgICBfcGF0aFZhbHVlc05ldyA9IHt9XG5cbiAgICAgICAgZm9yIGtleSBpbiBfbGF5ZXJLZXlzXG4gICAgICAgICAgX3BhdGhWYWx1ZXNOZXdba2V5XSA9IGRhdGEubWFwKChkKS0+IHt4OngubWFwKGQpLHk6eS5zY2FsZSgpKHkubGF5ZXJWYWx1ZShkLCBrZXkpKSwgeHY6eC52YWx1ZShkKSwgeXY6eS5sYXllclZhbHVlKGQsa2V5KSwga2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpfSlcblxuICAgICAgICAgIGxheWVyID0ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6W119XG4gICAgICAgICAgIyBmaW5kIHN0YXJ0aW5nIHZhbHVlIGZvciBvbGRcbiAgICAgICAgICBpID0gMFxuICAgICAgICAgIHdoaWxlIGkgPCBtZXJnZWRYLmxlbmd0aFxuICAgICAgICAgICAgaWYgbWVyZ2VkWFtpXVswXSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICBvbGRMYXN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVttZXJnZWRYW2ldWzBdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3TGFzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bbWVyZ2VkWFtpXVsxXV1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgZm9yIHZhbCwgaSBpbiBtZXJnZWRYXG4gICAgICAgICAgICB2ID0ge2NvbG9yOmxheWVyLmNvbG9yLCB4OnZhbFsyXX1cbiAgICAgICAgICAgICMgc2V0IHggYW5kIHkgdmFsdWVzIGZvciBvbGQgdmFsdWVzLiBJZiB0aGVyZSBpcyBhIGFkZGVkIHZhbHVlLCBtYWludGFpbiB0aGUgbGFzdCB2YWxpZCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgdmFsWzFdIGlzIHVuZGVmaW5lZCAjaWUgYW4gb2xkIHZhbHVlIGlzIGRlbGV0ZWQsIG1haW50YWluIHRoZSBsYXN0IG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LnlOZXcgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdMYXN0LnggIyBhbmltYXRlIHRvIHRoZSBwcmVkZXNlc3NvcnMgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IHRydWVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdi55TmV3ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnhcbiAgICAgICAgICAgICAgbmV3TGFzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXVxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiBfZGF0YU9sZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgIGlmICB2YWxbMF0gaXMgdW5kZWZpbmVkICMgaWUgYSBuZXcgdmFsdWUgaGFzIGJlZW4gYWRkZWRcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV0ueVxuICAgICAgICAgICAgICAgIHYueE9sZCA9IG9sZExhc3QueCAjIHN0YXJ0IHgtYW5pbWF0aW9uIGZyb20gdGhlIHByZWRlY2Vzc29ycyBvbGQgcG9zaXRpb25cbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHYueU9sZCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS55XG4gICAgICAgICAgICAgICAgdi54T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnhcbiAgICAgICAgICAgICAgICBvbGRMYXN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueE9sZCA9IHYueE5ld1xuICAgICAgICAgICAgICB2LnlPbGQgPSB2LnlOZXdcblxuXG4gICAgICAgICAgICBsYXllci52YWx1ZS5wdXNoKHYpXG5cbiAgICAgICAgICBfbGF5b3V0LnB1c2gobGF5ZXIpXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeC5pc09yZGluYWwoKSB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgbWFya2VycyA9IChsYXllciwgZHVyYXRpb24pIC0+XG4gICAgICAgICAgaWYgX3Nob3dNYXJrZXJzXG4gICAgICAgICAgICBtID0gbGF5ZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtbWFya2VyJykuZGF0YShcbiAgICAgICAgICAgICAgICAobCkgLT4gbC52YWx1ZVxuICAgICAgICAgICAgICAsIChkKSAtPiBkLnhcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIG0uZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbWFya2VyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgICAgICAuYXR0cigncicsIDUpXG4gICAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgICAgICAgIy5zdHlsZSgnb3BhY2l0eScsIF9pbml0aWFsT3BhY2l0eSlcbiAgICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgICBtXG4gICAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSAtPiBkLnlPbGQpXG4gICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkKSAtPiBkLnhPbGQgKyBvZmZzZXQpXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCd3ay1jaGFydC1kZWxldGVkJywoZCkgLT4gZC5kZWxldGVkKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpIC0+IGQueU5ldylcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpIC0+IGQueE5ldyArIG9mZnNldClcbiAgICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQpIC0+IGlmIGQuZGVsZXRlZCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgICAgICBtLmV4aXQoKVxuICAgICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxheWVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbikuc3R5bGUoJ29wYWNpdHknLCAwKS5yZW1vdmUoKVxuXG4gICAgICAgIGxpbmVPbGQgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IGQueE9sZClcbiAgICAgICAgICAueSgoZCkgLT4gZC55T2xkKVxuXG4gICAgICAgIGxpbmVOZXcgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IGQueE5ldylcbiAgICAgICAgICAueSgoZCkgLT4gZC55TmV3KVxuXG4gICAgICAgIGJydXNoTGluZSA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAueCgoZCkgLT4geC5zY2FsZSgpKGQueCkpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU5ldylcblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgZW50ZXIgPSBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgZW50ZXIuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lTmV3KGQudmFsdWUpKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIF9pbml0aWFsT3BhY2l0eSlcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXG4gICAgICAgIGxheWVycy5zZWxlY3QoJy53ay1jaGFydC1saW5lJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tvZmZzZXR9KVwiKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmVPbGQoZC52YWx1ZSkpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmVOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGxheWVycy5jYWxsKG1hcmtlcnMsIG9wdGlvbnMuZHVyYXRpb24pXG5cbiAgICAgICAgX2luaXRpYWxPcGFjaXR5ID0gMFxuICAgICAgICBfZGF0YU9sZCA9IGRhdGFcbiAgICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBfcGF0aFZhbHVlc05ld1xuXG4gICAgICBicnVzaCA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGluZVwiKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGJydXNoTGluZShkLnZhbHVlKSlcbiAgICAgICAgbGF5ZXJzLmNhbGwobWFya2VycywgMClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueClcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBicnVzaFxuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnbGluZVZlcnRpY2FsJywgKCRsb2cpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG5cbiAgICAgIHByZXBEYXRhID0gKHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjbGF5ZXJLZXlzID0geS5sYXllcktleXMoQClcbiAgICAgICAgI19sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOkBtYXAoKGQpLT4ge3g6eC52YWx1ZShkKSx5OnkubGF5ZXJWYWx1ZShkLCBrZXkpfSl9KVxuXG4gICAgICB0dEVudGVyID0gKGlkeCwgYXhpc1gsIGNudG5yKSAtPlxuICAgICAgICBjbnRuclNlbCA9IGQzLnNlbGVjdChjbnRucilcbiAgICAgICAgY250bnJXaWR0aCA9IGNudG5yU2VsLmF0dHIoJ3dpZHRoJylcbiAgICAgICAgcGFyZW50ID0gZDMuc2VsZWN0KGNudG5yLnBhcmVudEVsZW1lbnQpXG4gICAgICAgIF90dEhpZ2hsaWdodCA9IHBhcmVudC5hcHBlbmQoJ2cnKVxuICAgICAgICBfdHRIaWdobGlnaHQuYXBwZW5kKCdsaW5lJykuYXR0cih7eDE6MCwgeDI6Y250bnJXaWR0aH0pLnN0eWxlKHsncG9pbnRlci1ldmVudHMnOidub25lJywgc3Ryb2tlOidsaWdodGdyZXknLCAnc3Ryb2tlLXdpZHRoJzoxfSlcbiAgICAgICAgX2NpcmNsZXMgPSBfdHRIaWdobGlnaHQuc2VsZWN0QWxsKCdjaXJjbGUnKS5kYXRhKF9sYXlvdXQsKGQpIC0+IGQua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cigncicsIDUpLmF0dHIoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKS5hdHRyKCdmaWxsLW9wYWNpdHknLCAwLjYpLmF0dHIoJ3N0cm9rZScsICdibGFjaycpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuXG4gICAgICAgIF90dEhpZ2hsaWdodC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7X3NjYWxlTGlzdC55LnNjYWxlKCkoX2xheW91dFswXS52YWx1ZVtpZHhdLnkpK29mZnNldH0pXCIpXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IF9sYXlvdXQubWFwKChsKSAtPiB7bmFtZTpsLmtleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwudmFsdWVbaWR4XS54KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUoX2xheW91dFswXS52YWx1ZVtpZHhdLnkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbCgnY2lyY2xlJykuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N4JywgKGQpIC0+IF9zY2FsZUxpc3QueC5zY2FsZSgpKGQudmFsdWVbaWR4XS54KSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KSArIG9mZnNldH0pXCIpXG5cblxuICAgICAgc2V0VG9vbHRpcCA9ICh0b29sdGlwLCBvdmVybGF5KSAtPlxuICAgICAgICBfdG9vbHRpcCA9IHRvb2x0aXBcbiAgICAgICAgdG9vbHRpcChvdmVybGF5KVxuICAgICAgICB0b29sdGlwLmlzSG9yaXpvbnRhbCh0cnVlKVxuICAgICAgICB0b29sdGlwLnJlZnJlc2hPbk1vdmUodHJ1ZSlcbiAgICAgICAgdG9vbHRpcC5vbiBcIm1vdmUuI3tfaWR9XCIsIHR0TW92ZVxuICAgICAgICB0b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcbiAgICAgICAgdG9vbHRpcC5vbiBcImxlYXZlLiN7X2lkfVwiLCB0dExlYXZlXG5cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcbiAgICAgICAgX2xheW91dCA9IGxheWVyS2V5cy5tYXAoKGtleSkgPT4ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6ZGF0YS5tYXAoKGQpLT4ge3k6eS52YWx1ZShkKSx4OngubGF5ZXJWYWx1ZShkLCBrZXkpfSl9KVxuXG4gICAgICAgIG9mZnNldCA9IGlmIHkuaXNPcmRpbmFsKCkgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGxpbmUgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55KChkKSAtPiB5LnNjYWxlKCkoZC55KSlcblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5zZWxlY3QoJy53ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje29mZnNldH0pXCIpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZShkLnZhbHVlKSlcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC55KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncGllJywgKCRsb2csIHV0aWxzKSAtPlxuICBwaWVDbnRyID0gMFxuXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnRUEnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICMgc2V0IGNoYXJ0IHNwZWNpZmljIGRlZmF1bHRzXG5cbiAgICBfaWQgPSBcInBpZSN7cGllQ250cisrfVwiXG5cbiAgICBpbm5lciA9IHVuZGVmaW5lZFxuICAgIG91dGVyID0gdW5kZWZpbmVkXG4gICAgbGFiZWxzID0gdW5kZWZpbmVkXG4gICAgcGllQm94ID0gdW5kZWZpbmVkXG4gICAgcG9seWxpbmUgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gW11cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgIF9zaG93TGFiZWxzID0gZmFsc2VcblxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LmNvbG9yLmF4aXNMYWJlbCgpXG4gICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnNpemUuYXhpc0xhYmVsKClcbiAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC5zaXplLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBpbml0aWFsU2hvdyA9IHRydWVcblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAnZHJhd2luZyBwaWUgY2hhcnQgdjInXG5cbiAgICAgIHIgPSBNYXRoLm1pbihvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCkgLyAyXG5cbiAgICAgIGlmIG5vdCBwaWVCb3hcbiAgICAgICAgcGllQm94PSBAYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1waWVCb3gnKVxuICAgICAgcGllQm94LmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcblxuICAgICAgaW5uZXJBcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgICAgLm91dGVyUmFkaXVzKHIgKiBpZiBfc2hvd0xhYmVscyB0aGVuIDAuOCBlbHNlIDEpXG4gICAgICAgIC5pbm5lclJhZGl1cygwKVxuXG4gICAgICBvdXRlckFyYyA9IGQzLnN2Zy5hcmMoKVxuICAgICAgICAub3V0ZXJSYWRpdXMociAqIDAuOSlcbiAgICAgICAgLmlubmVyUmFkaXVzKHIgKiAwLjkpXG5cbiAgICAgIGtleSA9IChkKSAtPiBfc2NhbGVMaXN0LmNvbG9yLnZhbHVlKGQuZGF0YSlcblxuICAgICAgcGllID0gZDMubGF5b3V0LnBpZSgpXG4gICAgICAgIC5zb3J0KG51bGwpXG4gICAgICAgIC52YWx1ZShzaXplLnZhbHVlKVxuXG4gICAgICBhcmNUd2VlbiA9IChhKSAtPlxuICAgICAgICBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSlcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IGkoMClcbiAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgIGlubmVyQXJjKGkodCkpXG5cbiAgICAgIHNlZ21lbnRzID0gcGllKGRhdGEpICMgcGllIGNvbXB1dGVzIGZvciBlYWNoIHNlZ21lbnQgdGhlIHN0YXJ0IGFuZ2xlIGFuZCB0aGUgZW5kIGFuZ2xlXG4gICAgICBfbWVyZ2Uua2V5KGtleSlcbiAgICAgIF9tZXJnZShzZWdtZW50cykuZmlyc3Qoe3N0YXJ0QW5nbGU6MCwgZW5kQW5nbGU6MH0pLmxhc3Qoe3N0YXJ0QW5nbGU6TWF0aC5QSSAqIDIsIGVuZEFuZ2xlOiBNYXRoLlBJICogMn0pXG5cbiAgICAgICMtLS0gRHJhdyBQaWUgc2VnbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBpZiBub3QgaW5uZXJcbiAgICAgICAgaW5uZXIgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtaW5uZXJBcmMnKVxuXG4gICAgICBpbm5lciA9IGlubmVyXG4gICAgICAgIC5kYXRhKHNlZ21lbnRzLGtleSlcblxuICAgICAgaW5uZXIuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuZWFjaCgoZCkgLT4gdGhpcy5fY3VycmVudCA9IGlmIGluaXRpYWxTaG93IHRoZW4gZCBlbHNlIHtzdGFydEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGUsIGVuZEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGV9KVxuICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1pbm5lckFyYyB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+ICBjb2xvci5tYXAoZC5kYXRhKSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbFNob3cgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICBpbm5lclxuICAgICAgICAjLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgLmF0dHJUd2VlbignZCcsYXJjVHdlZW4pXG5cbiAgICAgIGlubmVyLmV4aXQoKS5kYXR1bSgoZCkgLT4gIHtzdGFydEFuZ2xlOl9tZXJnZS5kZWxldGVkU3VjYyhkKS5zdGFydEFuZ2xlLCBlbmRBbmdsZTpfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuc3RhcnRBbmdsZX0pXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0clR3ZWVuKCdkJyxhcmNUd2VlbilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgIy0tLSBEcmF3IFNlZ21lbnQgTGFiZWwgVGV4dCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIG1pZEFuZ2xlID0gKGQpIC0+IGQuc3RhcnRBbmdsZSArIChkLmVuZEFuZ2xlIC0gZC5zdGFydEFuZ2xlKSAvIDJcblxuICAgICAgaWYgX3Nob3dMYWJlbHNcblxuICAgICAgICBsYWJlbHMgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtbGFiZWwnKS5kYXRhKHNlZ21lbnRzLCBrZXkpXG5cbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGFiZWwnKVxuICAgICAgICAgIC5lYWNoKChkKSAtPiBAX2N1cnJlbnQgPSBkKVxuICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywnMS4zZW0nKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnRleHQoKGQpIC0+IHNpemUuZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcblxuICAgICAgICBsYWJlbHMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgICAgIC5hdHRyVHdlZW4oJ3RyYW5zZm9ybScsIChkKSAtPlxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKF90aGlzLl9jdXJyZW50LCBkKVxuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIF90aGlzLl9jdXJyZW50ID0gZDJcbiAgICAgICAgICAgICAgcG9zID0gb3V0ZXJBcmMuY2VudHJvaWQoZDIpXG4gICAgICAgICAgICAgIHBvc1swXSArPSAxNSAqIChpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIDEgZWxzZSAtMSlcbiAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKCN7cG9zfSlcIilcbiAgICAgICAgICAuc3R5bGVUd2VlbigndGV4dC1hbmNob3InLCAoZCkgLT5cbiAgICAgICAgICAgIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoQF9jdXJyZW50LCBkKVxuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIHJldHVybiBpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIFwic3RhcnRcIiBlbHNlIFwiZW5kXCJcbiAgICAgICAgKVxuXG4gICAgICAgIGxhYmVscy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLnN0eWxlKCdvcGFjaXR5JywwKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tIERyYXcgQ29ubmVjdG9yIExpbmVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBwb2x5bGluZSA9IHBpZUJveC5zZWxlY3RBbGwoXCIud2stY2hhcnQtcG9seWxpbmVcIikuZGF0YShzZWdtZW50cywga2V5KVxuXG4gICAgICAgIHBvbHlsaW5lLmVudGVyKClcbiAgICAgICAgLiBhcHBlbmQoXCJwb2x5bGluZVwiKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LXBvbHlsaW5lJylcbiAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXG4gICAgICAgICAgLmVhY2goKGQpIC0+ICB0aGlzLl9jdXJyZW50ID0gZClcblxuICAgICAgICBwb2x5bGluZS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIChkKSAtPiBpZiBkLmRhdGEudmFsdWUgaXMgMCB0aGVuICAwIGVsc2UgLjUpXG4gICAgICAgICAgLmF0dHJUd2VlbihcInBvaW50c1wiLCAoZCkgLT5cbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9jdXJyZW50XG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGQpXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXNcbiAgICAgICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICAgICAgZDIgPSBpbnRlcnBvbGF0ZSh0KVxuICAgICAgICAgICAgICBfdGhpcy5fY3VycmVudCA9IGQyO1xuICAgICAgICAgICAgICBwb3MgPSBvdXRlckFyYy5jZW50cm9pZChkMilcbiAgICAgICAgICAgICAgcG9zWzBdICs9IDEwICogKGlmIG1pZEFuZ2xlKGQyKSA8IE1hdGguUEkgdGhlbiAgMSBlbHNlIC0xKVxuICAgICAgICAgICAgICByZXR1cm4gW2lubmVyQXJjLmNlbnRyb2lkKGQyKSwgb3V0ZXJBcmMuY2VudHJvaWQoZDIpLCBwb3NdO1xuICAgICAgICAgIClcblxuICAgICAgICBwb2x5bGluZS5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuICAgICAgICAgIC5yZW1vdmUoKTtcblxuICAgICAgZWxzZVxuICAgICAgICBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtcG9seWxpbmUnKS5yZW1vdmUoKVxuICAgICAgICBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtbGFiZWwnKS5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsU2hvdyA9IGZhbHNlXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgX3NjYWxlTGlzdCA9IHRoaXMuZ2V0U2NhbGVzKFsnc2l6ZScsICdjb2xvciddKVxuICAgICAgX3NjYWxlTGlzdC5jb2xvci5zY2FsZVR5cGUoJ2NhdGVnb3J5MjAnKVxuICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgX3Nob3dMYWJlbHMgPSBmYWxzZVxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgIF9zaG93TGFiZWxzID0gdHJ1ZVxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NjYXR0ZXInLCAoJGxvZywgdXRpbHMpIC0+XG4gIHNjYXR0ZXJDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgICBfaWQgPSAnc2NhdHRlcicgKyBzY2F0dGVyQ250KytcbiAgICAgIF9zY2FsZUxpc3QgPSBbXVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIGZvciBzTmFtZSwgc2NhbGUgb2YgX3NjYWxlTGlzdFxuICAgICAgICAgIEBsYXllcnMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBzY2FsZS5heGlzTGFiZWwoKSxcbiAgICAgICAgICAgIHZhbHVlOiBzY2FsZS5mb3JtYXR0ZWRWYWx1ZShkYXRhKSxcbiAgICAgICAgICAgIGNvbG9yOiBpZiBzTmFtZSBpcyAnY29sb3InIHRoZW4geydiYWNrZ3JvdW5kLWNvbG9yJzpzY2FsZS5tYXAoZGF0YSl9IGVsc2UgdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGF0aDogaWYgc05hbWUgaXMgJ3NoYXBlJyB0aGVuIGQzLnN2Zy5zeW1ib2woKS50eXBlKHNjYWxlLm1hcChkYXRhKSkuc2l6ZSg4MCkoKSBlbHNlIHVuZGVmaW5lZFxuICAgICAgICAgICAgY2xhc3M6IGlmIHNOYW1lIGlzICdzaGFwZScgdGhlbiAnd2stY2hhcnQtdHQtc3ZnLXNoYXBlJyBlbHNlICcnXG4gICAgICAgICAgfSlcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGluaXRpYWxTaG93ID0gdHJ1ZVxuXG5cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG4gICAgICAgICMkbG9nLmRlYnVnICdkcmF3aW5nIHNjYXR0ZXIgY2hhcnQnXG4gICAgICAgIGluaXQgPSAocykgLT5cbiAgICAgICAgICBpZiBpbml0aWFsU2hvd1xuICAgICAgICAgICAgcy5zdHlsZSgnZmlsbCcsIGNvbG9yLm1hcClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCktPiBcInRyYW5zbGF0ZSgje3gubWFwKGQpfSwje3kubWFwKGQpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICAgIGluaXRpYWxTaG93ID0gZmFsc2VcblxuICAgICAgICBwb2ludHMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtcG9pbnRzJylcbiAgICAgICAgICAuZGF0YShkYXRhKVxuICAgICAgICBwb2ludHMuZW50ZXIoKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1wb2ludHMgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+IFwidHJhbnNsYXRlKCN7eC5tYXAoZCl9LCN7eS5tYXAoZCl9KVwiKVxuICAgICAgICAgIC5jYWxsKGluaXQpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgIHBvaW50c1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIGQzLnN2Zy5zeW1ib2woKS50eXBlKChkKSAtPiBzaGFwZS5tYXAoZCkpLnNpemUoKGQpIC0+IHNpemUubWFwKGQpICogc2l6ZS5tYXAoZCkpKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGNvbG9yLm1hcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT4gXCJ0cmFuc2xhdGUoI3t4Lm1hcChkKX0sI3t5Lm1hcChkKX0pXCIpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBwb2ludHMuZXhpdCgpLnJlbW92ZSgpXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZSddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICB9XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NwaWRlcicsICgkbG9nLCB1dGlscykgLT5cbiAgc3BpZGVyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5kZWJ1ZyAnYnViYmxlQ2hhcnQgbGlua2VkJ1xuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnc3BpZGVyJyArIHNwaWRlckNudHIrK1xuICAgICAgYXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgIF9kYXRhID0gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIEBsYXllcnMgPSBfZGF0YS5tYXAoKGQpIC0+ICB7bmFtZTpfc2NhbGVMaXN0LngudmFsdWUoZCksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShkW2RhdGFdKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6X3NjYWxlTGlzdC5jb2xvci5zY2FsZSgpKGRhdGEpfX0pXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBfZGF0YSA9IGRhdGFcbiAgICAgICAgJGxvZy5sb2cgZGF0YVxuICAgICAgICAjIGNvbXB1dGUgY2VudGVyIG9mIGFyZWFcbiAgICAgICAgY2VudGVyWCA9IG9wdGlvbnMud2lkdGgvMlxuICAgICAgICBjZW50ZXJZID0gb3B0aW9ucy5oZWlnaHQvMlxuICAgICAgICByYWRpdXMgPSBkMy5taW4oW2NlbnRlclgsIGNlbnRlclldKSAqIDAuOFxuICAgICAgICB0ZXh0T2ZmcyA9IDIwXG4gICAgICAgIG5ickF4aXMgPSBkYXRhLmxlbmd0aFxuICAgICAgICBhcmMgPSBNYXRoLlBJICogMiAvIG5ickF4aXNcbiAgICAgICAgZGVnciA9IDM2MCAvIG5ickF4aXNcblxuICAgICAgICBheGlzRyA9IHRoaXMuc2VsZWN0KCcud2stY2hhcnQtYXhpcycpXG4gICAgICAgIGlmIGF4aXNHLmVtcHR5KClcbiAgICAgICAgICBheGlzRyA9IHRoaXMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcycpXG5cbiAgICAgICAgdGlja3MgPSB5LnNjYWxlKCkudGlja3MoeS50aWNrcygpKVxuICAgICAgICB5LnNjYWxlKCkucmFuZ2UoW3JhZGl1cywwXSkgIyB0cmlja3MgdGhlIHdheSBheGlzIGFyZSBkcmF3bi4gTm90IHByZXR0eSwgYnV0IHdvcmtzIDotKVxuICAgICAgICBheGlzLnNjYWxlKHkuc2NhbGUoKSkub3JpZW50KCdyaWdodCcpLnRpY2tWYWx1ZXModGlja3MpLnRpY2tGb3JtYXQoeS50aWNrRm9ybWF0KCkpXG4gICAgICAgIGF4aXNHLmNhbGwoYXhpcykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwje2NlbnRlclktcmFkaXVzfSlcIilcbiAgICAgICAgeS5zY2FsZSgpLnJhbmdlKFswLHJhZGl1c10pXG5cbiAgICAgICAgbGluZXMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMtbGluZScpLmRhdGEoZGF0YSwoZCkgLT4gZC5heGlzKVxuICAgICAgICBsaW5lcy5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWF4aXMtbGluZScpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnZGFya2dyZXknKVxuXG4gICAgICAgIGxpbmVzXG4gICAgICAgICAgLmF0dHIoe3gxOjAsIHkxOjAsIHgyOjAsIHkyOnJhZGl1c30pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQsaSkgLT4gXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwgI3tjZW50ZXJZfSlyb3RhdGUoI3tkZWdyICogaX0pXCIpXG5cbiAgICAgICAgbGluZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgI2RyYXcgdGljayBsaW5lc1xuICAgICAgICB0aWNrTGluZSA9IGQzLnN2Zy5saW5lKCkueCgoZCkgLT4gZC54KS55KChkKS0+ZC55KVxuICAgICAgICB0aWNrUGF0aCA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtdGlja1BhdGgnKS5kYXRhKHRpY2tzKVxuICAgICAgICB0aWNrUGF0aC5lbnRlcigpLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXRpY2tQYXRoJylcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnbm9uZScpLnN0eWxlKCdzdHJva2UnLCAnbGlnaHRncmV5JylcblxuICAgICAgICB0aWNrUGF0aFxuICAgICAgICAgIC5hdHRyKCdkJywoZCkgLT5cbiAgICAgICAgICAgIHAgPSBkYXRhLm1hcCgoYSwgaSkgLT4ge3g6TWF0aC5zaW4oYXJjKmkpICogeS5zY2FsZSgpKGQpLHk6TWF0aC5jb3MoYXJjKmkpICogeS5zY2FsZSgpKGQpfSlcbiAgICAgICAgICAgIHRpY2tMaW5lKHApICsgJ1onKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KVwiKVxuXG4gICAgICAgIHRpY2tQYXRoLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgIGF4aXNMYWJlbHMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMtdGV4dCcpLmRhdGEoZGF0YSwoZCkgLT4geC52YWx1ZShkKSlcbiAgICAgICAgYXhpc0xhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWF4aXMtdGV4dCcpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgICAuYXR0cignZHknLCAnMC44ZW0nKVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICBheGlzTGFiZWxzXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgICB4OiAoZCwgaSkgLT4gY2VudGVyWCArIE1hdGguc2luKGFyYyAqIGkpICogKHJhZGl1cyArIHRleHRPZmZzKVxuICAgICAgICAgICAgICB5OiAoZCwgaSkgLT4gY2VudGVyWSArIE1hdGguY29zKGFyYyAqIGkpICogKHJhZGl1cyArIHRleHRPZmZzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAudGV4dCgoZCkgLT4geC52YWx1ZShkKSlcblxuICAgICAgICAjIGRyYXcgZGF0YSBsaW5lc1xuXG4gICAgICAgIGRhdGFQYXRoID0gZDMuc3ZnLmxpbmUoKS54KChkKSAtPiBkLngpLnkoKGQpIC0+IGQueSlcblxuICAgICAgICBkYXRhTGluZSA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtZGF0YS1saW5lJykuZGF0YSh5LmxheWVyS2V5cyhkYXRhKSlcbiAgICAgICAgZGF0YUxpbmUuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1kYXRhLWxpbmUnKVxuICAgICAgICAgIC5zdHlsZSh7XG4gICAgICAgICAgICBzdHJva2U6KGQpIC0+IGNvbG9yLnNjYWxlKCkoZClcbiAgICAgICAgICAgIGZpbGw6KGQpIC0+IGNvbG9yLnNjYWxlKCkoZClcbiAgICAgICAgICAgICdmaWxsLW9wYWNpdHknOiAwLjJcbiAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAyXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICBkYXRhTGluZS5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBwID0gZGF0YS5tYXAoKGEsIGkpIC0+IHt4Ok1hdGguc2luKGFyYyppKSAqIHkuc2NhbGUoKShhW2RdKSx5Ok1hdGguY29zKGFyYyppKSAqIHkuc2NhbGUoKShhW2RdKX0pXG4gICAgICAgICAgICBkYXRhUGF0aChwKSArICdaJ1xuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tjZW50ZXJYfSwgI3tjZW50ZXJZfSlcIilcblxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIF9zY2FsZUxpc3QueS5kb21haW5DYWxjKCdtYXgnKVxuICAgICAgICBfc2NhbGVMaXN0LngucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgI0BsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JCcnVzaCcsICgkbG9nLCAkd2luZG93LCBzZWxlY3Rpb25TaGFyaW5nLCB0aW1pbmcpIC0+XG5cbiAgYmVoYXZpb3JCcnVzaCA9ICgpIC0+XG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBfYWN0aXZlID0gZmFsc2VcbiAgICBfb3ZlcmxheSA9IHVuZGVmaW5lZFxuICAgIF9leHRlbnQgPSB1bmRlZmluZWRcbiAgICBfc3RhcnRQb3MgPSB1bmRlZmluZWRcbiAgICBfZXZUYXJnZXREYXRhID0gdW5kZWZpbmVkXG4gICAgX2FyZWEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9hcmVhU2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2FyZWFCb3ggPSB1bmRlZmluZWRcbiAgICBfYmFja2dyb3VuZEJveCA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfc2VsZWN0YWJsZXMgPSAgdW5kZWZpbmVkXG4gICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcbiAgICBfeCA9IHVuZGVmaW5lZFxuICAgIF95ID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICBfYnJ1c2hYWSA9IGZhbHNlXG4gICAgX2JydXNoWCA9IGZhbHNlXG4gICAgX2JydXNoWSA9IGZhbHNlXG4gICAgX2JvdW5kc0lkeCA9IHVuZGVmaW5lZFxuICAgIF9ib3VuZHNWYWx1ZXMgPSB1bmRlZmluZWRcbiAgICBfYm91bmRzRG9tYWluID0gdW5kZWZpbmVkXG4gICAgX2JydXNoRXZlbnRzID0gZDMuZGlzcGF0Y2goJ2JydXNoU3RhcnQnLCAnYnJ1c2gnLCAnYnJ1c2hFbmQnKVxuXG4gICAgbGVmdCA9IHRvcCA9IHJpZ2h0ID0gYm90dG9tID0gc3RhcnRUb3AgPSBzdGFydExlZnQgPSBzdGFydFJpZ2h0ID0gc3RhcnRCb3R0b20gPSB1bmRlZmluZWRcblxuICAgICMtLS0gQnJ1c2ggdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcG9zaXRpb25CcnVzaEVsZW1lbnRzID0gKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSkgLT5cbiAgICAgIHdpZHRoID0gcmlnaHQgLSBsZWZ0XG4gICAgICBoZWlnaHQgPSBib3R0b20gLSB0b3BcblxuICAgICAgIyBwb3NpdGlvbiByZXNpemUtaGFuZGxlcyBpbnRvIHRoZSByaWdodCBjb3JuZXJzXG4gICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7Ym90dG9tfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbmUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje3RvcH0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW53JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tyaWdodH0sI3tib3R0b219KVwiKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3tib3R0b219KVwiKVxuICAgICAgICBfZXh0ZW50LmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCkuYXR0cigneCcsIGxlZnQpLmF0dHIoJ3knLCB0b3ApXG4gICAgICBpZiBfYnJ1c2hYXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXcnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LDApXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LDApXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodClcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBfYXJlYUJveC5oZWlnaHQpLmF0dHIoJ3gnLCBsZWZ0KS5hdHRyKCd5JywgMClcbiAgICAgIGlmIF9icnVzaFlcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbicpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje2JvdHRvbX0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW4nKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCBfYXJlYUJveC53aWR0aClcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpLmF0dHIoJ3gnLCAwKS5hdHRyKCd5JywgdG9wKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldFNlbGVjdGVkT2JqZWN0cyA9ICgpIC0+XG4gICAgICBlciA9IF9leHRlbnQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBfc2VsZWN0YWJsZXMuZWFjaCgoZCkgLT5cbiAgICAgICAgICBjciA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICB4SGl0ID0gZXIubGVmdCA8IGNyLnJpZ2h0IC0gY3Iud2lkdGggLyAzIGFuZCBjci5sZWZ0ICsgY3Iud2lkdGggLyAzIDwgZXIucmlnaHRcbiAgICAgICAgICB5SGl0ID0gZXIudG9wIDwgY3IuYm90dG9tIC0gY3IuaGVpZ2h0IC8gMyBhbmQgY3IudG9wICsgY3IuaGVpZ2h0IC8gMyA8IGVyLmJvdHRvbVxuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCd3ay1jaGFydC1zZWxlY3RlZCcsIHlIaXQgYW5kIHhIaXQpXG4gICAgICAgIClcbiAgICAgIHJldHVybiBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGVkJykuZGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgc2V0U2VsZWN0aW9uID0gKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSkgLT5cbiAgICAgIGlmIF9icnVzaFhcbiAgICAgICAgX2JvdW5kc0lkeCA9IFttZS54KCkuaW52ZXJ0KGxlZnQpLCBtZS54KCkuaW52ZXJ0KHJpZ2h0KV1cbiAgICAgICAgaWYgbWUueCgpLmlzT3JkaW5hbCgpXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IF9kYXRhLm1hcCgoZCkgLT4gbWUueCgpLnZhbHVlKGQpKS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbbWUueCgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMF1dKSwgbWUueCgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMV1dKV1cbiAgICAgICAgX2JvdW5kc0RvbWFpbiA9IF9kYXRhLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgaWYgX2JydXNoWVxuICAgICAgICBfYm91bmRzSWR4ID0gW21lLnkoKS5pbnZlcnQoYm90dG9tKSwgbWUueSgpLmludmVydCh0b3ApXVxuICAgICAgICBpZiBtZS55KCkuaXNPcmRpbmFsKClcbiAgICAgICAgICBfYm91bmRzVmFsdWVzID0gX2RhdGEubWFwKChkKSAtPiBtZS55KCkudmFsdWUoZCkpLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFttZS55KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFswXV0pLCBtZS55KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFsxXV0pXVxuICAgICAgICBfYm91bmRzRG9tYWluID0gX2RhdGEuc2xpY2UoX2JvdW5kc0lkeFswXSwgX2JvdW5kc0lkeFsxXSArIDEpXG4gICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICBfYm91bmRzSWR4ID0gW11cbiAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFtdXG4gICAgICAgIF9ib3VuZHNEb21haW4gPSBnZXRTZWxlY3RlZE9iamVjdHMoKVxuXG4gICAgIy0tLSBCcnVzaFN0YXJ0IEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG5cbiAgICBicnVzaFN0YXJ0ID0gKCkgLT5cbiAgICAgICNyZWdpc3RlciBhIG1vdXNlIGhhbmRsZXJzIGZvciB0aGUgYnJ1c2hcbiAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIF9ldlRhcmdldERhdGEgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5kYXR1bSgpXG4gICAgICBfYXJlYUJveCA9IF9hcmVhLmdldEJCb3goKVxuICAgICAgX3N0YXJ0UG9zID0gZDMubW91c2UoX2FyZWEpXG4gICAgICBzdGFydFRvcCA9IHRvcFxuICAgICAgc3RhcnRMZWZ0ID0gbGVmdFxuICAgICAgc3RhcnRSaWdodCA9IHJpZ2h0XG4gICAgICBzdGFydEJvdHRvbSA9IGJvdHRvbVxuICAgICAgZDMuc2VsZWN0KF9hcmVhKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJykuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LXJlc2l6ZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcbiAgICAgIGQzLnNlbGVjdCgnYm9keScpLnN0eWxlKCdjdXJzb3InLCBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5zdHlsZSgnY3Vyc29yJykpXG5cbiAgICAgIGQzLnNlbGVjdCgkd2luZG93KS5vbignbW91c2Vtb3ZlLmJydXNoJywgYnJ1c2hNb3ZlKS5vbignbW91c2V1cC5icnVzaCcsIGJydXNoRW5kKVxuXG4gICAgICBfdG9vbHRpcC5oaWRlKHRydWUpXG4gICAgICBfYm91bmRzSWR4ID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0YWJsZXMgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoU3RhcnQoKVxuICAgICAgdGltaW5nLmNsZWFyKClcbiAgICAgIHRpbWluZy5pbml0KClcblxuICAgICMtLS0gQnJ1c2hFbmQgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBicnVzaEVuZCA9ICgpIC0+XG4gICAgICAjZGUtcmVnaXN0ZXIgaGFuZGxlcnNcblxuICAgICAgZDMuc2VsZWN0KCR3aW5kb3cpLm9uICdtb3VzZW1vdmUuYnJ1c2gnLCBudWxsXG4gICAgICBkMy5zZWxlY3QoJHdpbmRvdykub24gJ21vdXNldXAuYnJ1c2gnLCBudWxsXG4gICAgICBkMy5zZWxlY3QoX2FyZWEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ2FsbCcpLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXJlc2l6ZScpLnN0eWxlKCdkaXNwbGF5JywgbnVsbCkgIyBzaG93IHRoZSByZXNpemUgaGFuZGxlcnNcbiAgICAgIGQzLnNlbGVjdCgnYm9keScpLnN0eWxlKCdjdXJzb3InLCBudWxsKVxuICAgICAgaWYgYm90dG9tIC0gdG9wIGlzIDAgb3IgcmlnaHQgLSBsZWZ0IGlzIDBcbiAgICAgICAgI2JydXNoIGlzIGVtcHR5XG4gICAgICAgIGQzLnNlbGVjdChfYXJlYSkuc2VsZWN0QWxsKCcud2stY2hhcnQtcmVzaXplJykuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpXG4gICAgICBfdG9vbHRpcC5oaWRlKGZhbHNlKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoRW5kKF9ib3VuZHNJZHgpXG4gICAgICB0aW1pbmcucmVwb3J0KClcblxuICAgICMtLS0gQnJ1c2hNb3ZlIEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBicnVzaE1vdmUgPSAoKSAtPlxuICAgICAgJGxvZy5pbmZvICdicnVzaG1vdmUnXG4gICAgICBwb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIGRlbHRhWCA9IHBvc1swXSAtIF9zdGFydFBvc1swXVxuICAgICAgZGVsdGFZID0gcG9zWzFdIC0gX3N0YXJ0UG9zWzFdXG5cbiAgICAgICMgdGhpcyBlbGFib3JhdGUgY29kZSBpcyBuZWVkZWQgdG8gZGVhbCB3aXRoIHNjZW5hcmlvcyB3aGVuIG1vdXNlIG1vdmVzIGZhc3QgYW5kIHRoZSBldmVudHMgZG8gbm90IGhpdCB4L3kgKyBkZWx0YVxuICAgICAgIyBkb2VzIG5vdCBoaSB0aGUgMCBwb2ludCBtYXllIHRoZXJlIGlzIGEgbW9yZSBlbGVnYW50IHdheSB0byB3cml0ZSB0aGlzLCBidXQgZm9yIG5vdyBpdCB3b3JrcyA6LSlcblxuICAgICAgbGVmdE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydExlZnQgKyBkZWx0YVxuICAgICAgICBsZWZ0ID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRSaWdodCB0aGVuIHBvcyBlbHNlIHN0YXJ0UmlnaHQpIGVsc2UgMFxuICAgICAgICByaWdodCA9IGlmIHBvcyA8PSBfYXJlYUJveC53aWR0aCB0aGVuIChpZiBwb3MgPCBzdGFydFJpZ2h0IHRoZW4gc3RhcnRSaWdodCBlbHNlIHBvcykgZWxzZSBfYXJlYUJveC53aWR0aFxuXG4gICAgICByaWdodE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydFJpZ2h0ICsgZGVsdGFcbiAgICAgICAgbGVmdCA9IGlmIHBvcyA+PSAwIHRoZW4gKGlmIHBvcyA8IHN0YXJ0TGVmdCB0aGVuIHBvcyBlbHNlIHN0YXJ0TGVmdCkgZWxzZSAwXG4gICAgICAgIHJpZ2h0ID0gaWYgcG9zIDw9IF9hcmVhQm94LndpZHRoIHRoZW4gKGlmIHBvcyA8IHN0YXJ0TGVmdCB0aGVuIHN0YXJ0TGVmdCBlbHNlIHBvcykgZWxzZSBfYXJlYUJveC53aWR0aFxuXG4gICAgICB0b3BNdiA9IChkZWx0YSkgLT5cbiAgICAgICAgcG9zID0gc3RhcnRUb3AgKyBkZWx0YVxuICAgICAgICB0b3AgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydEJvdHRvbSB0aGVuIHBvcyBlbHNlIHN0YXJ0Qm90dG9tKSBlbHNlIDBcbiAgICAgICAgYm90dG9tID0gaWYgcG9zIDw9IF9hcmVhQm94LmhlaWdodCB0aGVuIChpZiBwb3MgPiBzdGFydEJvdHRvbSB0aGVuIHBvcyBlbHNlIHN0YXJ0Qm90dG9tICkgZWxzZSBfYXJlYUJveC5oZWlnaHRcblxuICAgICAgYm90dG9tTXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0Qm90dG9tICsgZGVsdGFcbiAgICAgICAgdG9wID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRUb3AgdGhlbiBwb3MgZWxzZSBzdGFydFRvcCkgZWxzZSAwXG4gICAgICAgIGJvdHRvbSA9IGlmIHBvcyA8PSBfYXJlYUJveC5oZWlnaHQgdGhlbiAoaWYgcG9zID4gc3RhcnRUb3AgdGhlbiBwb3MgZWxzZSBzdGFydFRvcCApIGVsc2UgX2FyZWFCb3guaGVpZ2h0XG5cbiAgICAgIGhvck12ID0gKGRlbHRhKSAtPlxuICAgICAgICBpZiBzdGFydExlZnQgKyBkZWx0YSA+PSAwXG4gICAgICAgICAgaWYgc3RhcnRSaWdodCArIGRlbHRhIDw9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgICBsZWZ0ID0gc3RhcnRMZWZ0ICsgZGVsdGFcbiAgICAgICAgICAgIHJpZ2h0ID0gc3RhcnRSaWdodCArIGRlbHRhXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmlnaHQgPSBfYXJlYUJveC53aWR0aFxuICAgICAgICAgICAgbGVmdCA9IF9hcmVhQm94LndpZHRoIC0gKHN0YXJ0UmlnaHQgLSBzdGFydExlZnQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsZWZ0ID0gMFxuICAgICAgICAgIHJpZ2h0ID0gc3RhcnRSaWdodCAtIHN0YXJ0TGVmdFxuXG4gICAgICB2ZXJ0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIGlmIHN0YXJ0VG9wICsgZGVsdGEgPj0gMFxuICAgICAgICAgIGlmIHN0YXJ0Qm90dG9tICsgZGVsdGEgPD0gX2FyZWFCb3guaGVpZ2h0XG4gICAgICAgICAgICB0b3AgPSBzdGFydFRvcCArIGRlbHRhXG4gICAgICAgICAgICBib3R0b20gPSBzdGFydEJvdHRvbSArIGRlbHRhXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYm90dG9tID0gX2FyZWFCb3guaGVpZ2h0XG4gICAgICAgICAgICB0b3AgPSBfYXJlYUJveC5oZWlnaHQgLSAoc3RhcnRCb3R0b20gLSBzdGFydFRvcClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRvcCA9IDBcbiAgICAgICAgICBib3R0b20gPSBzdGFydEJvdHRvbSAtIHN0YXJ0VG9wXG5cbiAgICAgIHN3aXRjaCBfZXZUYXJnZXREYXRhLm5hbWVcbiAgICAgICAgd2hlbiAnYmFja2dyb3VuZCdcbiAgICAgICAgICBpZiBkZWx0YVggKyBfc3RhcnRQb3NbMF0gPiAwXG4gICAgICAgICAgICBsZWZ0ID0gaWYgZGVsdGFYIDwgMCB0aGVuIF9zdGFydFBvc1swXSArIGRlbHRhWCBlbHNlIF9zdGFydFBvc1swXVxuICAgICAgICAgICAgaWYgbGVmdCArIE1hdGguYWJzKGRlbHRhWCkgPCBfYXJlYUJveC53aWR0aFxuICAgICAgICAgICAgICByaWdodCA9IGxlZnQgKyBNYXRoLmFicyhkZWx0YVgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJpZ2h0ID0gX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsZWZ0ID0gMFxuXG4gICAgICAgICAgaWYgZGVsdGFZICsgX3N0YXJ0UG9zWzFdID4gMFxuICAgICAgICAgICAgdG9wID0gaWYgZGVsdGFZIDwgMCB0aGVuIF9zdGFydFBvc1sxXSArIGRlbHRhWSBlbHNlIF9zdGFydFBvc1sxXVxuICAgICAgICAgICAgaWYgdG9wICsgTWF0aC5hYnMoZGVsdGFZKSA8IF9hcmVhQm94LmhlaWdodFxuICAgICAgICAgICAgICBib3R0b20gPSB0b3AgKyBNYXRoLmFicyhkZWx0YVkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGJvdHRvbSA9IF9hcmVhQm94LmhlaWdodFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRvcCA9IDBcblxuICAgICAgICB3aGVuICdleHRlbnQnXG4gICAgICAgICAgdmVydE12KGRlbHRhWSk7IGhvck12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnbidcbiAgICAgICAgICB0b3BNdihkZWx0YVkpXG4gICAgICAgIHdoZW4gJ3MnXG4gICAgICAgICAgYm90dG9tTXYoZGVsdGFZKVxuICAgICAgICB3aGVuICd3J1xuICAgICAgICAgIGxlZnRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ2UnXG4gICAgICAgICAgcmlnaHRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ253J1xuICAgICAgICAgIHRvcE12KGRlbHRhWSk7IGxlZnRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ25lJ1xuICAgICAgICAgIHRvcE12KGRlbHRhWSk7IHJpZ2h0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICdzdydcbiAgICAgICAgICBib3R0b21NdihkZWx0YVkpOyBsZWZ0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICdzZSdcbiAgICAgICAgICBib3R0b21NdihkZWx0YVkpOyByaWdodE12KGRlbHRhWClcblxuICAgICAgcG9zaXRpb25CcnVzaEVsZW1lbnRzKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSlcbiAgICAgIHNldFNlbGVjdGlvbihsZWZ0LCByaWdodCwgdG9wLCBib3R0b20pXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2goX2JvdW5kc0lkeCwgX2JvdW5kc1ZhbHVlcywgX2JvdW5kc0RvbWFpbilcbiAgICAgIHNlbGVjdGlvblNoYXJpbmcuc2V0U2VsZWN0aW9uIF9ib3VuZHNWYWx1ZXMsIF9icnVzaEdyb3VwXG5cbiAgICAjLS0tIEJydXNoIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuYnJ1c2ggPSAocykgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfb3ZlcmxheVxuICAgICAgZWxzZVxuICAgICAgICBpZiBub3QgX2FjdGl2ZSB0aGVuIHJldHVyblxuICAgICAgICBfb3ZlcmxheSA9IHNcbiAgICAgICAgX2JydXNoWFkgPSBtZS54KCkgYW5kIG1lLnkoKVxuICAgICAgICBfYnJ1c2hYID0gbWUueCgpIGFuZCBub3QgbWUueSgpXG4gICAgICAgIF9icnVzaFkgPSBtZS55KCkgYW5kIG5vdCBtZS54KClcbiAgICAgICAgIyBjcmVhdGUgdGhlIGhhbmRsZXIgZWxlbWVudHMgYW5kIHJlZ2lzdGVyIHRoZSBoYW5kbGVyc1xuICAgICAgICBzLnN0eWxlKHsncG9pbnRlci1ldmVudHMnOiAnYWxsJywgY3Vyc29yOiAnY3Jvc3NoYWlyJ30pXG4gICAgICAgIF9leHRlbnQgPSBzLmFwcGVuZCgncmVjdCcpLmF0dHIoe2NsYXNzOid3ay1jaGFydC1leHRlbnQnLCB4OjAsIHk6MCwgd2lkdGg6MCwgaGVpZ2h0OjB9KS5zdHlsZSgnY3Vyc29yJywnbW92ZScpLmRhdHVtKHtuYW1lOidleHRlbnQnfSlcbiAgICAgICAgIyByZXNpemUgaGFuZGxlcyBmb3IgdGhlIHNpZGVzXG4gICAgICAgIGlmIF9icnVzaFkgb3IgX2JydXNoWFlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1uJykuc3R5bGUoe2N1cnNvcjonbnMtcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6MCwgeTogLTMsIHdpZHRoOjAsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J24nfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1zJykuc3R5bGUoe2N1cnNvcjonbnMtcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6MCwgeTogLTMsIHdpZHRoOjAsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J3MnfSlcbiAgICAgICAgaWYgX2JydXNoWCBvciBfYnJ1c2hYWVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LXcnKS5zdHlsZSh7Y3Vyc29yOidldy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eTowLCB4OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjB9KS5kYXR1bSh7bmFtZTondyd9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LWUnKS5zdHlsZSh7Y3Vyc29yOidldy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eTowLCB4OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjB9KS5kYXR1bSh7bmFtZTonZSd9KVxuICAgICAgICAjIHJlc2l6ZSBoYW5kbGVzIGZvciB0aGUgY29ybmVyc1xuICAgICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LW53Jykuc3R5bGUoe2N1cnNvcjonbndzZS1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6IC0zLCB5OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonbncnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1uZScpLnN0eWxlKHtjdXJzb3I6J25lc3ctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J25lJ30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtc3cnKS5zdHlsZSh7Y3Vyc29yOiduZXN3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidzdyd9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LXNlJykuc3R5bGUoe2N1cnNvcjonbndzZS1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6IC0zLCB5OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonc2UnfSlcbiAgICAgICAgI3JlZ2lzdGVyIGhhbmRsZXIuIFBsZWFzZSBub3RlLCBicnVzaCB3YW50cyB0aGUgbW91c2UgZG93biBleGNsdXNpdmVseSAhISFcbiAgICAgICAgcy5vbiAnbW91c2Vkb3duLmJydXNoJywgYnJ1c2hTdGFydFxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gRXh0ZW50IHJlc2l6ZSBoYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICByZXNpemVFeHRlbnQgPSAoKSAtPlxuICAgICAgaWYgX2FyZWFCb3hcbiAgICAgICAgJGxvZy5pbmZvICdyZXNpemVIYW5kbGVyJ1xuICAgICAgICBuZXdCb3ggPSBfYXJlYS5nZXRCQm94KClcbiAgICAgICAgaG9yaXpvbnRhbFJhdGlvID0gX2FyZWFCb3gud2lkdGggLyBuZXdCb3gud2lkdGhcbiAgICAgICAgdmVydGljYWxSYXRpbyA9IF9hcmVhQm94LmhlaWdodCAvIG5ld0JveC5oZWlnaHRcbiAgICAgICAgdG9wID0gdG9wIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBzdGFydFRvcCA9IHN0YXJ0VG9wIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBib3R0b20gPSBib3R0b20gLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIHN0YXJ0Qm90dG9tID0gc3RhcnRCb3R0b20gLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIGxlZnQgPSBsZWZ0IC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIHN0YXJ0TGVmdCA9IHN0YXJ0TGVmdCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICByaWdodCA9IHJpZ2h0IC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIHN0YXJ0UmlnaHQgPSBzdGFydFJpZ2h0IC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIF9zdGFydFBvc1swXSA9IF9zdGFydFBvc1swXSAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBfc3RhcnRQb3NbMV0gPSBfc3RhcnRQb3NbMV0gLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIF9hcmVhQm94ID0gbmV3Qm94XG4gICAgICAgIHBvc2l0aW9uQnJ1c2hFbGVtZW50cyhsZWZ0LCByaWdodCwgdG9wLCBib3R0b20pXG5cbiAgICAjLS0tIEJydXNoIFByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmNoYXJ0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY2hhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgX2NoYXJ0ID0gdmFsXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiAncmVzaXplLmJydXNoJywgcmVzaXplRXh0ZW50XG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5hY3RpdmUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hY3RpdmVcbiAgICAgIGVsc2VcbiAgICAgICAgX2FjdGl2ZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUueCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3hcbiAgICAgIGVsc2VcbiAgICAgICAgX3ggPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnkgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF95XG4gICAgICBlbHNlXG4gICAgICAgIF95ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5hcmVhID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXJlYVNlbGVjdGlvblxuICAgICAgZWxzZVxuICAgICAgICBpZiBub3QgX2FyZWFTZWxlY3Rpb25cbiAgICAgICAgICBfYXJlYVNlbGVjdGlvbiA9IHZhbFxuICAgICAgICAgIF9hcmVhID0gX2FyZWFTZWxlY3Rpb24ubm9kZSgpXG4gICAgICAgICAgI19hcmVhQm94ID0gX2FyZWEuZ2V0QkJveCgpIG5lZWQgdG8gZ2V0IHdoZW4gY2FsY3VsYXRpbmcgc2l6ZSB0byBkZWFsIHdpdGggcmVzaXppbmdcbiAgICAgICAgICBtZS5icnVzaChfYXJlYVNlbGVjdGlvbilcblxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuY29udGFpbmVyID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY29udGFpbmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9jb250YWluZXIgPSB2YWxcbiAgICAgICAgX3NlbGVjdGFibGVzID0gX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmRhdGEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9kYXRhXG4gICAgICBlbHNlXG4gICAgICAgIF9kYXRhID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5icnVzaEdyb3VwID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYnJ1c2hHcm91cFxuICAgICAgZWxzZVxuICAgICAgICBfYnJ1c2hHcm91cCA9IHZhbFxuICAgICAgICBzZWxlY3Rpb25TaGFyaW5nLmNyZWF0ZUdyb3VwKF9icnVzaEdyb3VwKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUudG9vbHRpcCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Rvb2x0aXBcbiAgICAgIGVsc2VcbiAgICAgICAgX3Rvb2x0aXAgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLm9uID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgX2JydXNoRXZlbnRzLm9uIG5hbWUsIGNhbGxiYWNrXG5cbiAgICBtZS5leHRlbnQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9ib3VuZHNJZHhcblxuICAgIG1lLmV2ZW50cyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JydXNoRXZlbnRzXG5cbiAgICBtZS5lbXB0eSA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JvdW5kc0lkeCBpcyB1bmRlZmluZWRcblxuICAgIHJldHVybiBtZVxuICByZXR1cm4gYmVoYXZpb3JCcnVzaCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2JlaGF2aW9yU2VsZWN0JywgKCRsb2cpIC0+XG4gIHNlbGVjdElkID0gMFxuXG4gIHNlbGVjdCA9ICgpIC0+XG5cbiAgICBfaWQgPSBcInNlbGVjdCN7c2VsZWN0SWQrK31cIlxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfYWN0aXZlID0gZmFsc2VcbiAgICBfc2VsZWN0aW9uRXZlbnRzID0gZDMuZGlzcGF0Y2goJ3NlbGVjdGVkJylcblxuICAgIGNsaWNrZWQgPSAoKSAtPlxuICAgICAgaWYgbm90IF9hY3RpdmUgdGhlbiByZXR1cm5cbiAgICAgIG9iaiA9IGQzLnNlbGVjdCh0aGlzKVxuICAgICAgaWYgbm90IF9hY3RpdmUgdGhlbiByZXR1cm5cbiAgICAgIGlmIG9iai5jbGFzc2VkKCd3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgaXNTZWxlY3RlZCA9IG9iai5jbGFzc2VkKCd3ay1jaGFydC1zZWxlY3RlZCcpXG4gICAgICAgIG9iai5jbGFzc2VkKCd3ay1jaGFydC1zZWxlY3RlZCcsIG5vdCBpc1NlbGVjdGVkKVxuICAgICAgICBhbGxTZWxlY3RlZCA9IF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0ZWQnKS5kYXRhKCkubWFwKChkKSAtPiBpZiBkLmRhdGEgdGhlbiBkLmRhdGEgZWxzZSBkKVxuICAgICAgICAjIGVuc3VyZSB0aGF0IG9ubHkgdGhlIG9yaWdpbmFsIHZhbHVlcyBhcmUgcmVwb3J0ZWQgYmFja1xuXG4gICAgICAgIF9zZWxlY3Rpb25FdmVudHMuc2VsZWN0ZWQoYWxsU2VsZWN0ZWQpXG5cbiAgICBtZSA9IChzZWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gbWVcbiAgICAgIGVsc2VcbiAgICAgICAgc2VsXG4gICAgICAgICAgIyByZWdpc3RlciBzZWxlY3Rpb24gZXZlbnRzXG4gICAgICAgICAgLm9uICdjbGljaycsIGNsaWNrZWRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5pZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2lkXG5cbiAgICBtZS5hY3RpdmUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hY3RpdmVcbiAgICAgIGVsc2VcbiAgICAgICAgX2FjdGl2ZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuY29udGFpbmVyID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY29udGFpbmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9jb250YWluZXIgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmV2ZW50cyA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NlbGVjdGlvbkV2ZW50c1xuXG4gICAgbWUub24gPSAobmFtZSwgY2FsbGJhY2spIC0+XG4gICAgICBfc2VsZWN0aW9uRXZlbnRzLm9uIG5hbWUsIGNhbGxiYWNrXG4gICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBzZWxlY3QiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvclRvb2x0aXAnLCAoJGxvZywgJGRvY3VtZW50LCAkcm9vdFNjb3BlLCAkY29tcGlsZSwgJHRlbXBsYXRlQ2FjaGUsIHRlbXBsYXRlRGlyKSAtPlxuXG4gIGJlaGF2aW9yVG9vbHRpcCA9ICgpIC0+XG5cbiAgICBfYWN0aXZlID0gZmFsc2VcbiAgICBfaGlkZSA9IGZhbHNlXG4gICAgX3Nob3dNYXJrZXJMaW5lID0gdW5kZWZpbmVkXG4gICAgX21hcmtlckcgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyTGluZSA9IHVuZGVmaW5lZFxuICAgIF9hcmVhU2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2FyZWE9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyU2NhbGUgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF90b29sdGlwRGlzcGF0Y2ggPSBkMy5kaXNwYXRjaCgnZW50ZXInLCAnbW92ZURhdGEnLCAnbW92ZU1hcmtlcicsICdsZWF2ZScpXG5cbiAgICBfdGVtcGwgPSAkdGVtcGxhdGVDYWNoZS5nZXQodGVtcGxhdGVEaXIgKyAndG9vbFRpcC5odG1sJylcbiAgICBfdGVtcGxTY29wZSA9ICRyb290U2NvcGUuJG5ldyh0cnVlKVxuICAgIF9jb21waWxlZFRlbXBsID0gJGNvbXBpbGUoX3RlbXBsKShfdGVtcGxTY29wZSlcbiAgICBib2R5ID0gJGRvY3VtZW50LmZpbmQoJ2JvZHknKVxuXG4gICAgYm9keVJlY3QgPSBib2R5WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICAjLS0tIGhlbHBlciBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcG9zaXRpb25Cb3ggPSAoKSAtPlxuICAgICAgcmVjdCA9IF9jb21waWxlZFRlbXBsWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjbGllbnRYID0gaWYgYm9keVJlY3QucmlnaHQgLSAyMCA+IGQzLmV2ZW50LmNsaWVudFggKyByZWN0LndpZHRoICsgMTAgdGhlbiBkMy5ldmVudC5jbGllbnRYICsgMTAgZWxzZSBkMy5ldmVudC5jbGllbnRYIC0gcmVjdC53aWR0aCAtIDEwXG4gICAgICBjbGllbnRZID0gaWYgYm9keVJlY3QuYm90dG9tIC0gMjAgPiBkMy5ldmVudC5jbGllbnRZICsgcmVjdC5oZWlnaHQgKyAxMCB0aGVuIGQzLmV2ZW50LmNsaWVudFkgKyAxMCBlbHNlIGQzLmV2ZW50LmNsaWVudFkgLSByZWN0LmhlaWdodCAtIDEwXG4gICAgICBfdGVtcGxTY29wZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgbGVmdDogY2xpZW50WCArICdweCdcbiAgICAgICAgdG9wOiBjbGllbnRZICsgJ3B4J1xuICAgICAgICAnei1pbmRleCc6IDE1MDBcbiAgICAgICAgb3BhY2l0eTogMVxuICAgICAgfVxuICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KClcblxuICAgIHBvc2l0aW9uSW5pdGlhbCA9ICgpIC0+XG4gICAgICBfdGVtcGxTY29wZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgbGVmdDogMCArICdweCdcbiAgICAgICAgdG9wOiAwICsgJ3B4J1xuICAgICAgICAnei1pbmRleCc6IDE1MDBcbiAgICAgICAgb3BhY2l0eTogMFxuICAgICAgfVxuICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KCkgICMgZW5zdXJlIHRvb2x0aXAgZ2V0cyByZW5kZXJlZFxuICAgICAgI3dheWl0IHVudGlsIGl0IGlzIHJlbmRlcmVkIGFuZCB0aGVuIHJlcG9zaXRpb25cbiAgICAgIF8udGhyb3R0bGUgcG9zaXRpb25Cb3gsIDIwMFxuXG4gICAgIy0tLSBUb29sdGlwU3RhcnQgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRvb2x0aXBFbnRlciA9ICgpIC0+XG4gICAgICBpZiBub3QgX2FjdGl2ZSBvciBfaGlkZSB0aGVuIHJldHVyblxuICAgICAgIyBhcHBlbmQgZGF0YSBkaXZcbiAgICAgIGJvZHkuYXBwZW5kKF9jb21waWxlZFRlbXBsKVxuICAgICAgX3RlbXBsU2NvcGUubGF5ZXJzID0gW11cblxuICAgICAgIyBnZXQgdG9vbHRpcCBkYXRhIHZhbHVlXG5cbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICBfcG9zID0gZDMubW91c2UodGhpcylcbiAgICAgICAgdmFsdWUgPSBfbWFya2VyU2NhbGUuaW52ZXJ0KGlmIF9tYXJrZXJTY2FsZS5pc0hvcml6b250YWwoKSB0aGVuIF9wb3NbMF0gZWxzZSBfcG9zWzFdKVxuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IGQzLnNlbGVjdCh0aGlzKS5kYXR1bSgpXG5cbiAgICAgIF90ZW1wbFNjb3BlLnR0U2hvdyA9IHRydWVcbiAgICAgIF90b29sdGlwRGlzcGF0Y2guZW50ZXIuYXBwbHkoX3RlbXBsU2NvcGUsIFt2YWx1ZV0pICMgY2FsbCBsYXlvdXQgdG8gZmlsbCBpbiBkYXRhXG4gICAgICBwb3NpdGlvbkluaXRpYWwoKVxuXG4gICAgICAjIGNyZWF0ZSBhIG1hcmtlciBsaW5lIGlmIHJlcXVpcmVkXG4gICAgICBpZiBfc2hvd01hcmtlckxpbmVcbiAgICAgICAgI19hcmVhID0gdGhpc1xuICAgICAgICBfYXJlYUJveCA9IF9hcmVhU2VsZWN0aW9uLnNlbGVjdCgnLndrLWNoYXJ0LWJhY2tncm91bmQnKS5ub2RlKCkuZ2V0QkJveCgpXG4gICAgICAgIF9wb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgICAgX21hcmtlckcgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpICAjIG5lZWQgdG8gYXBwZW5kIG1hcmtlciB0byBjaGFydCBhcmVhIHRvIGVuc3VyZSBpdCBpcyBvbiB0b3Agb2YgdGhlIGNoYXJ0IGVsZW1lbnRzIEZpeCAxMFxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC10b29sdGlwLW1hcmtlcicpXG4gICAgICAgIF9tYXJrZXJMaW5lID0gX21hcmtlckcuYXBwZW5kKCdsaW5lJylcbiAgICAgICAgaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpXG4gICAgICAgICAgX21hcmtlckxpbmUuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LW1hcmtlci1saW5lJywgeDA6MCwgeDE6MCwgeTA6MCx5MTpfYXJlYUJveC5oZWlnaHR9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX21hcmtlckxpbmUuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LW1hcmtlci1saW5lJywgeDA6MCwgeDE6X2FyZWFCb3gud2lkdGgsIHkwOjAseTE6MH0pXG5cbiAgICAgICAgX21hcmtlckxpbmUuc3R5bGUoe3N0cm9rZTogJ2RhcmtncmV5JywgJ3BvaW50ZXItZXZlbnRzJzogJ25vbmUnfSlcblxuICAgICAgICBfdG9vbHRpcERpc3BhdGNoLm1vdmVNYXJrZXIuYXBwbHkoX21hcmtlckcsIFt2YWx1ZV0pXG5cbiAgICAjLS0tIFRvb2x0aXBNb3ZlICBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcE1vdmUgPSAoKSAtPlxuICAgICAgaWYgbm90IF9hY3RpdmUgb3IgX2hpZGUgdGhlbiByZXR1cm5cbiAgICAgIF9wb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIHBvc2l0aW9uQm94KClcbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICAjX21hcmtlckcuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfcG9zWzBdfSlcIilcbiAgICAgICAgZGF0YUlkeCA9IF9tYXJrZXJTY2FsZS5pbnZlcnQoaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpIHRoZW4gX3Bvc1swXSBlbHNlIF9wb3NbMV0pXG4gICAgICAgIF90b29sdGlwRGlzcGF0Y2gubW92ZU1hcmtlci5hcHBseShfbWFya2VyRywgW2RhdGFJZHhdKVxuICAgICAgICBfdGVtcGxTY29wZS5sYXllcnMgPSBbXVxuICAgICAgICBfdG9vbHRpcERpc3BhdGNoLm1vdmVEYXRhLmFwcGx5KF90ZW1wbFNjb3BlLCBbZGF0YUlkeF0pXG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKVxuXG4gICAgIy0tLSBUb29sdGlwTGVhdmUgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRvb2x0aXBMZWF2ZSA9ICgpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAndG9vbHRpcExlYXZlJywgX2FyZWFcbiAgICAgIGlmIF9tYXJrZXJHXG4gICAgICAgIF9tYXJrZXJHLnJlbW92ZSgpXG4gICAgICBfbWFya2VyRyA9IHVuZGVmaW5lZFxuICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gZmFsc2VcbiAgICAgIF9jb21waWxlZFRlbXBsLnJlbW92ZSgpXG5cbiAgICAjLS0tIEludGVyZmFjZSB0byBicnVzaCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuaGlkZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2hpZGVcbiAgICAgIGVsc2VcbiAgICAgICAgX2hpZGUgPSB2YWxcbiAgICAgICAgaWYgX21hcmtlckdcbiAgICAgICAgICBfbWFya2VyRy5zdHlsZSgndmlzaWJpbGl0eScsIGlmIF9oaWRlIHRoZW4gJ2hpZGRlbicgZWxzZSAndmlzaWJsZScpXG4gICAgICAgIF90ZW1wbFNjb3BlLnR0U2hvdyA9IG5vdCBfaGlkZVxuICAgICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG5cbiAgICAjLS0gVG9vbHRpcCBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuYWN0aXZlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYWN0aXZlXG4gICAgICBlbHNlXG4gICAgICAgIF9hY3RpdmUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmFyZWEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hcmVhU2VsZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIF9hcmVhU2VsZWN0aW9uID0gdmFsXG4gICAgICAgIF9hcmVhID0gX2FyZWFTZWxlY3Rpb24ubm9kZSgpXG4gICAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICAgIG1lLnRvb2x0aXAoX2FyZWFTZWxlY3Rpb24pXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUubWFya2VyU2NhbGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9tYXJrZXJTY2FsZVxuICAgICAgZWxzZVxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBfc2hvd01hcmtlckxpbmUgPSB0cnVlXG4gICAgICAgICAgX21hcmtlclNjYWxlID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlckxpbmUgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGF0YSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLm9uID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5vbiBuYW1lLCBjYWxsYmFja1xuXG4gICAgIy0tLSBUb29sdGlwIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnRvb2x0aXAgPSAocykgLT4gIyByZWdpc3RlciB0aGUgdG9vbHRpcCBldmVudHMgd2l0aCB0aGUgc2VsZWN0aW9uXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gbWVcbiAgICAgIGVsc2UgICMgc2V0IHRvb2x0aXAgZm9yIGFuIG9iamVjdHMgc2VsZWN0aW9uXG4gICAgICAgIHMub24gJ21vdXNlZW50ZXIudG9vbHRpcCcsIHRvb2x0aXBFbnRlclxuICAgICAgICAgIC5vbiAnbW91c2Vtb3ZlLnRvb2x0aXAnLCB0b29sdGlwTW92ZVxuICAgICAgICAgIC5vbiAnbW91c2VsZWF2ZS50b29sdGlwJywgdG9vbHRpcExlYXZlXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gYmVoYXZpb3JUb29sdGlwIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3InLCAoJGxvZywgJHdpbmRvdywgYmVoYXZpb3JUb29sdGlwLCBiZWhhdmlvckJydXNoLCBiZWhhdmlvclNlbGVjdCkgLT5cblxuICBiZWhhdmlvciA9ICgpIC0+XG5cbiAgICBfdG9vbHRpcCA9IGJlaGF2aW9yVG9vbHRpcCgpXG4gICAgX2JydXNoID0gYmVoYXZpb3JCcnVzaCgpXG4gICAgX3NlbGVjdGlvbiA9IGJlaGF2aW9yU2VsZWN0KClcbiAgICBfYnJ1c2gudG9vbHRpcChfdG9vbHRpcClcblxuICAgIGFyZWEgPSAoYXJlYSkgLT5cbiAgICAgIF9icnVzaC5hcmVhKGFyZWEpXG4gICAgICBfdG9vbHRpcC5hcmVhKGFyZWEpXG5cbiAgICBjb250YWluZXIgPSAoY29udGFpbmVyKSAtPlxuICAgICAgX2JydXNoLmNvbnRhaW5lcihjb250YWluZXIpXG4gICAgICBfc2VsZWN0aW9uLmNvbnRhaW5lcihjb250YWluZXIpXG4gICAgICBfdG9vbHRpcC5jb250YWluZXIoY29udGFpbmVyKVxuXG4gICAgY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBfYnJ1c2guY2hhcnQoY2hhcnQpXG5cbiAgICByZXR1cm4ge3Rvb2x0aXA6X3Rvb2x0aXAsIGJydXNoOl9icnVzaCwgc2VsZWN0ZWQ6X3NlbGVjdGlvbiwgb3ZlcmxheTphcmVhLCBjb250YWluZXI6Y29udGFpbmVyLCBjaGFydDpjaGFydH1cbiAgcmV0dXJuIGJlaGF2aW9yIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnY2hhcnQnLCAoJGxvZywgc2NhbGVMaXN0LCBjb250YWluZXIsIGJlaGF2aW9yLCBkM0FuaW1hdGlvbikgLT5cblxuICBjaGFydENudHIgPSAwXG5cbiAgY2hhcnQgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJjaGFydCN7Y2hhcnRDbnRyKyt9XCJcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0gVmFyaWFibGUgZGVjbGFyYXRpb25zIGFuZCBkZWZhdWx0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfbGF5b3V0cyA9IFtdICAgICAgICAgICAgICAgIyBMaXN0IG9mIGxheW91dHMgZm9yIHRoZSBjaGFydFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWQgICAgIyB0aGUgY2hhcnRzIGRyYXdpbmcgY29udGFpbmVyIG9iamVjdFxuICAgIF9hbGxTY2FsZXMgPSB1bmRlZmluZWQgICAgIyBIb2xkcyBhbGwgc2NhbGVzIG9mIHRoZSBjaGFydCwgcmVnYXJkbGVzcyBvZiBzY2FsZSBvd25lclxuICAgIF9vd25lZFNjYWxlcyA9IHVuZGVmaW5lZCAgIyBob2xkcyB0aGUgc2NsZXMgb3duZWQgYnkgY2hhcnQsIGkuZS4gc2hhcmUgc2NhbGVzXG4gICAgX2RhdGEgPSB1bmRlZmluZWQgICAgICAgICAgICMgcG9pbnRlciB0byB0aGUgbGFzdCBkYXRhIHNldCBib3VuZCB0byBjaGFydFxuICAgIF9zaG93VG9vbHRpcCA9IGZhbHNlICAgICAgICAjIHRvb2x0aXAgcHJvcGVydHlcbiAgICBfdGl0bGUgPSB1bmRlZmluZWRcbiAgICBfc3ViVGl0bGUgPSB1bmRlZmluZWRcbiAgICBfYmVoYXZpb3IgPSBiZWhhdmlvcigpXG4gICAgX2FuaW1hdGlvbkR1cmF0aW9uID0gZDNBbmltYXRpb24uZHVyYXRpb25cblxuICAgICMtLS0gTGlmZUN5Y2xlIERpc3BhdGNoZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfbGlmZUN5Y2xlID0gZDMuZGlzcGF0Y2goJ2NvbmZpZ3VyZScsICdyZXNpemUnLCAncHJlcGFyZURhdGEnLCAnc2NhbGVEb21haW5zJywgJ3NpemVDb250YWluZXInLCAnZHJhd0F4aXMnLCAnZHJhd0NoYXJ0JywgJ25ld0RhdGEnLCAndXBkYXRlJywgJ3VwZGF0ZUF0dHJzJywgJ3Njb3BlQXBwbHknIClcbiAgICBfYnJ1c2ggPSBkMy5kaXNwYXRjaCgnZHJhdycsICdjaGFuZ2UnKVxuXG4gICAgIy0tLSBHZXR0ZXIvU2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKGlkKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuc2hvd1Rvb2x0aXAgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93VG9vbHRpcFxuICAgICAgZWxzZVxuICAgICAgICBfc2hvd1Rvb2x0aXAgPSB0cnVlRmFsc2VcbiAgICAgICAgX2JlaGF2aW9yLnRvb2x0aXAuYWN0aXZlKF9zaG93VG9vbHRpcClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50aXRsZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF90aXRsZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnN1YlRpdGxlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc3ViVGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3N1YlRpdGxlID0gdmFsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkTGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0c1xuICAgICAgZWxzZVxuICAgICAgICBfbGF5b3V0cy5wdXNoKGxheW91dClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRTY2FsZSA9IChzY2FsZSwgbGF5b3V0KSAtPlxuICAgICAgX2FsbFNjYWxlcy5hZGQoc2NhbGUpXG4gICAgICBpZiBsYXlvdXRcbiAgICAgICAgbGF5b3V0LnNjYWxlcygpLmFkZChzY2FsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgX293bmVkU2NhbGVzLmFkZChzY2FsZSlcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYW5pbWF0aW9uRHVyYXRpb24gPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hbmltYXRpb25EdXJhdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfYW5pbWF0aW9uRHVyYXRpb24gPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgICMtLS0gR2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5saWZlQ3ljbGUgPSAodmFsKSAtPlxuICAgICAgcmV0dXJuIF9saWZlQ3ljbGVcblxuICAgIG1lLmxheW91dHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9sYXlvdXRzXG5cbiAgICBtZS5zY2FsZXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9vd25lZFNjYWxlc1xuXG4gICAgbWUuYWxsU2NhbGVzID0gKCkgLT5cbiAgICAgIHJldHVybiBfYWxsU2NhbGVzXG5cbiAgICBtZS5oYXNTY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIHJldHVybiAhIV9hbGxTY2FsZXMuaGFzKHNjYWxlKVxuXG4gICAgbWUuY29udGFpbmVyID0gKCkgLT5cbiAgICAgIHJldHVybiBfY29udGFpbmVyXG5cbiAgICBtZS5icnVzaCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JydXNoXG5cbiAgICBtZS5nZXREYXRhID0gKCkgLT5cbiAgICAgIHJldHVybiBfZGF0YVxuXG4gICAgbWUuYmVoYXZpb3IgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9iZWhhdmlvclxuXG4gICAgIy0tLSBDaGFydCBkcmF3aW5nIGxpZmUgY3ljbGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmV4ZWNMaWZlQ3ljbGVGdWxsID0gKGRhdGEsIG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIGZ1bGwgbGlmZSBjeWNsZSdcbiAgICAgICAgX2RhdGEgPSBkYXRhXG4gICAgICAgIF9saWZlQ3ljbGUucHJlcGFyZURhdGEoZGF0YSwgbm9BbmltYXRpb24pICAgICMgY2FsbHMgdGhlIHJlZ2lzdGVyZWQgbGF5b3V0IHR5cGVzXG4gICAgICAgIF9saWZlQ3ljbGUuc2NhbGVEb21haW5zKGRhdGEsIG5vQW5pbWF0aW9uKSAgICMgY2FsbHMgcmVnaXN0ZXJlZCB0aGUgc2NhbGVzXG4gICAgICAgIF9saWZlQ3ljbGUuc2l6ZUNvbnRhaW5lcihkYXRhLCBub0FuaW1hdGlvbikgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KGRhdGEsIG5vQW5pbWF0aW9uKSAgICAgIyBjYWxscyBsYXlvdXRcblxuICAgIG1lLnJlc2l6ZUxpZmVDeWNsZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgcmVzaXplIGxpZmUgY3ljbGUnXG4gICAgICAgIF9saWZlQ3ljbGUuc2l6ZUNvbnRhaW5lcihfZGF0YSwgbm9BbmltYXRpb24pICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoX2RhdGEsIG5vQW5pbWF0aW9uKVxuICAgICAgICBfbGlmZUN5Y2xlLnNjb3BlQXBwbHkoKVxuXG4gICAgbWUubmV3RGF0YUxpZmVDeWNsZSA9IChkYXRhLCBub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIGRhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyBuZXcgZGF0YSBsaWZlIGN5Y2xlJ1xuICAgICAgICBfZGF0YSA9IGRhdGFcbiAgICAgICAgX2xpZmVDeWNsZS5wcmVwYXJlRGF0YShkYXRhLCBub0FuaW1hdGlvbikgICAgIyBjYWxscyB0aGUgcmVnaXN0ZXJlZCBsYXlvdXQgdHlwZXNcbiAgICAgICAgX2xpZmVDeWNsZS5zY2FsZURvbWFpbnMoZGF0YSwgbm9BbmltYXRpb24pXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChkYXRhLCBub0FuaW1hdGlvbilcblxuICAgIG1lLmF0dHJpYnV0ZUNoYW5nZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgYXR0cmlidXRlIGNoYW5nZSBsaWZlIGN5Y2xlJ1xuICAgICAgICBfbGlmZUN5Y2xlLnNpemVDb250YWluZXIoX2RhdGEsIG5vQW5pbWF0aW9uKVxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoX2RhdGEsIG5vQW5pbWF0aW9uKVxuXG4gICAgbWUuYnJ1c2hFeHRlbnRDaGFuZ2VkID0gKCkgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXModHJ1ZSkgICAgICAgICAgICAgICMgTm8gQW5pbWF0aW9uXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KF9kYXRhLCB0cnVlKVxuXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ25ld0RhdGEuY2hhcnQnLCBtZS5leGVjTGlmZUN5Y2xlRnVsbFxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICdyZXNpemUuY2hhcnQnLCBtZS5yZXNpemVMaWZlQ3ljbGVcbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAndXBkYXRlLmNoYXJ0JywgKG5vQW5pbWF0aW9uKSAtPiBtZS5leGVjTGlmZUN5Y2xlRnVsbChfZGF0YSwgbm9BbmltYXRpb24pXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ3VwZGF0ZUF0dHJzJywgbWUuYXR0cmlidXRlQ2hhbmdlXG5cbiAgICAjLS0tIEluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX2JlaGF2aW9yLmNoYXJ0KG1lKVxuICAgIF9jb250YWluZXIgPSBjb250YWluZXIoKS5jaGFydChtZSkgICAjIHRoZSBjaGFydHMgZHJhd2luZyBjb250YWluZXIgb2JqZWN0XG4gICAgX2FsbFNjYWxlcyA9IHNjYWxlTGlzdCgpICAgICMgSG9sZHMgYWxsIHNjYWxlcyBvZiB0aGUgY2hhcnQsIHJlZ2FyZGxlc3Mgb2Ygc2NhbGUgb3duZXJcbiAgICBfb3duZWRTY2FsZXMgPSBzY2FsZUxpc3QoKSAgIyBob2xkcyB0aGUgc2NsZXMgb3duZWQgYnkgY2hhcnQsIGkuZS4gc2hhcmUgc2NhbGVzXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gY2hhcnQiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdjb250YWluZXInLCAoJGxvZywgJHdpbmRvdywgZDNDaGFydE1hcmdpbnMsIHNjYWxlTGlzdCwgYXhpc0NvbmZpZywgZDNBbmltYXRpb24sIGJlaGF2aW9yKSAtPlxuXG4gIGNvbnRhaW5lckNudCA9IDBcblxuICBjb250YWluZXIgPSAoKSAtPlxuXG4gICAgbWUgPSAoKS0+XG5cbiAgICAjLS0tIFZhcmlhYmxlIGRlY2xhcmF0aW9ucyBhbmQgZGVmYXVsdHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX2NvbnRhaW5lcklkID0gJ2NudG5yJyArIGNvbnRhaW5lckNudCsrXG4gICAgX2NoYXJ0ID0gdW5kZWZpbmVkXG4gICAgX2VsZW1lbnQgPSB1bmRlZmluZWRcbiAgICBfZWxlbWVudFNlbGVjdGlvbiA9IHVuZGVmaW5lZFxuICAgIF9sYXlvdXRzID0gW11cbiAgICBfbGVnZW5kcyA9IFtdXG4gICAgX3N2ZyA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfc3BhY2VkQ29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0QXJlYSA9IHVuZGVmaW5lZFxuICAgIF9jaGFydEFyZWEgPSB1bmRlZmluZWRcbiAgICBfbWFyZ2luID0gYW5ndWxhci5jb3B5KGQzQ2hhcnRNYXJnaW5zLmRlZmF1bHQpXG4gICAgX2lubmVyV2lkdGggPSAwXG4gICAgX2lubmVySGVpZ2h0ID0gMFxuICAgIF90aXRsZUhlaWdodCA9IDBcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9vdmVybGF5ID0gdW5kZWZpbmVkXG4gICAgX2JlaGF2aW9yID0gdW5kZWZpbmVkXG4gICAgX2R1cmF0aW9uID0gMFxuXG4gICAgIy0tLSBHZXR0ZXIvU2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfY29udGFpbmVySWRcblxuICAgIG1lLmNoYXJ0ID0gKGNoYXJ0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSBjaGFydFxuICAgICAgICAjIHJlZ2lzdGVyIHRvIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgI19jaGFydC5saWZlQ3ljbGUoKS5vbiBcInNpemVDb250YWluZXIuI3ttZS5pZCgpfVwiLCBtZS5zaXplQ29udGFpbmVyXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcImRyYXdBeGlzLiN7bWUuaWQoKX1cIiwgbWUuZHJhd0NoYXJ0RnJhbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5lbGVtZW50ID0gKGVsZW0pIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2VsZW1lbnRcbiAgICAgIGVsc2VcbiAgICAgICAgX3Jlc2l6ZUhhbmRsZXIgPSAoKSAtPiAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5yZXNpemUodHJ1ZSkgIyBubyBhbmltYXRpb25cbiAgICAgICAgX2VsZW1lbnQgPSBlbGVtXG4gICAgICAgIF9lbGVtZW50U2VsZWN0aW9uID0gZDMuc2VsZWN0KF9lbGVtZW50KVxuICAgICAgICBpZiBfZWxlbWVudFNlbGVjdGlvbi5lbXB0eSgpXG4gICAgICAgICAgJGxvZy5lcnJvciBcIkVycm9yOiBFbGVtZW50ICN7X2VsZW1lbnR9IGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9nZW5DaGFydEZyYW1lKClcbiAgICAgICAgICAjIGZpbmQgdGhlIGRpdiBlbGVtZW50IHRvIGF0dGFjaCB0aGUgaGFuZGxlciB0b1xuICAgICAgICAgIHJlc2l6ZVRhcmdldCA9IF9lbGVtZW50U2VsZWN0aW9uLnNlbGVjdCgnLndrLWNoYXJ0Jykubm9kZSgpXG4gICAgICAgICAgbmV3IFJlc2l6ZVNlbnNvcihyZXNpemVUYXJnZXQsIF9yZXNpemVIYW5kbGVyKVxuXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkTGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIF9sYXlvdXRzLnB1c2gobGF5b3V0KVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5oZWlnaHQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pbm5lckhlaWdodFxuXG4gICAgbWUud2lkdGggPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pbm5lcldpZHRoXG5cbiAgICBtZS5tYXJnaW5zID0gKCkgLT5cbiAgICAgIHJldHVybiBfbWFyZ2luXG5cbiAgICBtZS5nZXRDaGFydEFyZWEgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9jaGFydEFyZWFcblxuICAgIG1lLmdldE92ZXJsYXkgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9vdmVybGF5XG5cbiAgICBtZS5nZXRDb250YWluZXIgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zcGFjZWRDb250YWluZXJcblxuICAgICMtLS0gdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgUmV0dXJuOiB0ZXh0IGhlaWdodFxuICAgIGRyYXdBbmRQb3NpdGlvblRleHQgPSAoY29udGFpbmVyLCB0ZXh0LCBzZWxlY3RvciwgZm9udFNpemUsIG9mZnNldCkgLT5cbiAgICAgIGVsZW0gPSBjb250YWluZXIuc2VsZWN0KCcuJyArIHNlbGVjdG9yKVxuICAgICAgaWYgZWxlbS5lbXB0eSgpXG4gICAgICAgIGVsZW0gPSBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cih7Y2xhc3M6c2VsZWN0b3IsICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnLCB5OmlmIG9mZnNldCB0aGVuIG9mZnNldCBlbHNlIDB9KVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJyxmb250U2l6ZSlcbiAgICAgIGVsZW0udGV4dCh0ZXh0KVxuICAgICAgI21lYXN1cmUgc2l6ZSBhbmQgcmV0dXJuIGl0XG4gICAgICByZXR1cm4gZWxlbS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodFxuXG5cbiAgICBkcmF3VGl0bGVBcmVhID0gKHRpdGxlLCBzdWJUaXRsZSkgLT5cbiAgICAgIHRpdGxlQXJlYUhlaWdodCA9IDBcbiAgICAgIGFyZWEgPSBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LXRpdGxlLWFyZWEnKVxuICAgICAgaWYgYXJlYS5lbXB0eSgpXG4gICAgICAgIGFyZWEgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtdGl0bGUtYXJlYSB3ay1jZW50ZXItaG9yJylcbiAgICAgIGlmIHRpdGxlXG4gICAgICAgIF90aXRsZUhlaWdodCA9IGRyYXdBbmRQb3NpdGlvblRleHQoYXJlYSwgdGl0bGUsICd3ay1jaGFydC10aXRsZScsICcyZW0nKVxuICAgICAgaWYgc3ViVGl0bGVcbiAgICAgICAgZHJhd0FuZFBvc2l0aW9uVGV4dChhcmVhLCBzdWJUaXRsZSwgJ3drLWNoYXJ0LXN1YnRpdGxlJywgJzEuOGVtJywgX3RpdGxlSGVpZ2h0KVxuXG4gICAgICByZXR1cm4gYXJlYS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodFxuXG4gICAgZ2V0QXhpc1JlY3QgPSAoZGltKSAtPlxuICAgICAgYXhpcyA9IF9jb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIGRpbS5zY2FsZSgpLnJhbmdlKFswLDEwMF0pXG4gICAgICBheGlzLmNhbGwoZGltLmF4aXMoKSlcblxuXG5cbiAgICAgIGlmIGRpbS5yb3RhdGVUaWNrTGFiZWxzKClcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKHtkeTonLTAuNzFlbScsIHg6LTl9KVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJyxcInRyYW5zbGF0ZSgwLDkpIHJvdGF0ZSgje2RpbS5yb3RhdGVUaWNrTGFiZWxzKCl9KVwiKVxuICAgICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgaWYgZGltLmF4aXNPcmllbnQoKSBpcyAnYm90dG9tJyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0JylcblxuICAgICAgYm94ID0gYXhpcy5ub2RlKCkuZ2V0QkJveCgpXG4gICAgICBheGlzLnJlbW92ZSgpXG4gICAgICByZXR1cm4gYm94XG5cbiAgICBkcmF3QXhpcyA9IChkaW0pIC0+XG4gICAgICBheGlzID0gX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtYXhpcy53ay1jaGFydC0je2RpbS5heGlzT3JpZW50KCl9XCIpXG4gICAgICBpZiBheGlzLmVtcHR5KClcbiAgICAgICAgYXhpcyA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcyB3ay1jaGFydC0nICsgZGltLmF4aXNPcmllbnQoKSlcbiAgICAgIGF4aXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKF9kdXJhdGlvbikuY2FsbChkaW0uYXhpcygpKVxuXG4gICAgICBpZiBkaW0ucm90YXRlVGlja0xhYmVscygpXG4gICAgICAgIGF4aXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LSN7ZGltLmF4aXNPcmllbnQoKX0ud2stY2hhcnQtYXhpcyB0ZXh0XCIpXG4gICAgICAgICAgLmF0dHIoe2R5OictMC43MWVtJywgeDotOX0pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsXCJ0cmFuc2xhdGUoMCw5KSByb3RhdGUoI3tkaW0ucm90YXRlVGlja0xhYmVscygpfSlcIilcbiAgICAgICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgaWYgZGltLmF4aXNPcmllbnQoKSBpcyAnYm90dG9tJyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0JylcbiAgICAgIGVsc2VcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtI3tkaW0uYXhpc09yaWVudCgpfS53ay1jaGFydC1heGlzIHRleHRcIikuYXR0cigndHJhbnNmb3JtJywgbnVsbClcblxuICAgIF9yZW1vdmVBeGlzID0gKG9yaWVudCkgLT5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtI3tvcmllbnR9XCIpLnJlbW92ZSgpXG5cbiAgICBfcmVtb3ZlTGFiZWwgPSAob3JpZW50KSAtPlxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtbGFiZWwud2stY2hhcnQtI3tvcmllbnR9XCIpLnJlbW92ZSgpXG5cbiAgICBkcmF3R3JpZCA9IChzLCBub0FuaW1hdGlvbikgLT5cbiAgICAgIGR1cmF0aW9uID0gaWYgbm9BbmltYXRpb24gdGhlbiAwIGVsc2UgX2R1cmF0aW9uXG4gICAgICBraW5kID0gcy5raW5kKClcbiAgICAgIHRpY2tzID0gaWYgcy5pc09yZGluYWwoKSB0aGVuIHMuc2NhbGUoKS5yYW5nZSgpIGVsc2Ugcy5zY2FsZSgpLnRpY2tzKClcbiAgICAgIGdyaWRMaW5lcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWdyaWQud2stY2hhcnQtI3traW5kfVwiKS5kYXRhKHRpY2tzLCAoZCkgLT4gZClcbiAgICAgIGdyaWRMaW5lcy5lbnRlcigpLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1ncmlkIHdrLWNoYXJ0LSN7a2luZH1cIilcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuICAgICAgaWYga2luZCBpcyAneSdcbiAgICAgICAgZ3JpZExpbmVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICB4MTowLFxuICAgICAgICAgICAgeDI6IF9pbm5lcldpZHRoLFxuICAgICAgICAgICAgeTE6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiAgZCBlbHNlIHMuc2NhbGUoKShkKSxcbiAgICAgICAgICAgIHkyOihkKSAtPiBpZiBzLmlzT3JkaW5hbCgpIHRoZW4gZCBlbHNlIHMuc2NhbGUoKShkKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgZWxzZVxuICAgICAgICBncmlkTGluZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgIHkxOjAsXG4gICAgICAgICAgICB5MjogX2lubmVySGVpZ2h0LFxuICAgICAgICAgICAgeDE6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkIGVsc2Ugcy5zY2FsZSgpKGQpLFxuICAgICAgICAgICAgeDI6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkIGVsc2Ugcy5zY2FsZSgpKGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICBncmlkTGluZXMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbikuc3R5bGUoJ29wYWNpdHknLDApLnJlbW92ZSgpXG5cbiAgICAjLS0tIEJ1aWxkIHRoZSBjb250YWluZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgYnVpbGQgZ2VuZXJpYyBlbGVtZW50cyBmaXJzdFxuXG4gICAgX2dlbkNoYXJ0RnJhbWUgPSAoKSAtPlxuICAgICAgX3N2ZyA9IF9lbGVtZW50U2VsZWN0aW9uLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQnKS5hcHBlbmQoJ3N2ZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0JylcbiAgICAgIF9zdmcuYXBwZW5kKCdkZWZzJykuYXBwZW5kKCdjbGlwUGF0aCcpLmF0dHIoJ2lkJywgXCJ3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfVwiKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgX2NvbnRhaW5lcj0gX3N2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWNvbnRhaW5lcicpXG4gICAgICBfb3ZlcmxheSA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtb3ZlcmxheScpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdhbGwnKVxuICAgICAgX292ZXJsYXkuYXBwZW5kKCdyZWN0Jykuc3R5bGUoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFja2dyb3VuZCcpLmRhdHVtKHtuYW1lOidiYWNrZ3JvdW5kJ30pXG4gICAgICBfY2hhcnRBcmVhID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcblxuICAgICMgc3RhcnQgdG8gYnVpbGQgYW5kIHNpemUgdGhlIGVsZW1lbnRzIGZyb20gdG9wIHRvIGJvdHRvbVxuXG4gICAgIy0tLSBjaGFydCBmcmFtZSAodGl0bGUsIGF4aXMsIGdyaWQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRyYXdDaGFydEZyYW1lID0gKG5vdEFuaW1hdGVkKSAtPlxuICAgICAgYm91bmRzID0gX2VsZW1lbnRTZWxlY3Rpb24ubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBfZHVyYXRpb24gPSBpZiBub3RBbmltYXRlZCB0aGVuIDAgZWxzZSBtZS5jaGFydCgpLmFuaW1hdGlvbkR1cmF0aW9uKClcbiAgICAgIF9oZWlnaHQgPSBib3VuZHMuaGVpZ2h0XG4gICAgICBfd2lkdGggPSBib3VuZHMud2lkdGhcbiAgICAgIHRpdGxlQXJlYUhlaWdodCA9IGRyYXdUaXRsZUFyZWEoX2NoYXJ0LnRpdGxlKCksIF9jaGFydC5zdWJUaXRsZSgpKVxuXG4gICAgICAjLS0tIGdldCBzaXppbmcgb2YgZnJhbWUgY29tcG9uZW50cyBiZWZvcmUgcG9zaXRpb25pbmcgdGhlbSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF4aXNSZWN0ID0ge3RvcDp7aGVpZ2h0OjAsIHdpZHRoOjB9LGJvdHRvbTp7aGVpZ2h0OjAsIHdpZHRoOjB9LGxlZnQ6e2hlaWdodDowLCB3aWR0aDowfSxyaWdodDp7aGVpZ2h0OjAsIHdpZHRoOjB9fVxuICAgICAgbGFiZWxIZWlnaHQgPSB7dG9wOjAgLGJvdHRvbTowLCBsZWZ0OjAsIHJpZ2h0OjB9XG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKVxuICAgICAgICAgICAgcy5heGlzKCkuc2NhbGUocy5zY2FsZSgpKS5vcmllbnQocy5heGlzT3JpZW50KCkpICAjIGVuc3VyZSB0aGUgYXhpcyB3b3JrcyBvbiB0aGUgcmlnaHQgc2NhbGVcbiAgICAgICAgICAgIGF4aXNSZWN0W3MuYXhpc09yaWVudCgpXSA9IGdldEF4aXNSZWN0KHMpXG4gICAgICAgICAgICAjLS0tIGRyYXcgbGFiZWwgLS0tXG4gICAgICAgICAgICBsYWJlbCA9IF9jb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LSN7cy5heGlzT3JpZW50KCl9XCIpXG4gICAgICAgICAgICBpZiBzLnNob3dMYWJlbCgpXG4gICAgICAgICAgICAgIGlmIGxhYmVsLmVtcHR5KClcbiAgICAgICAgICAgICAgICBsYWJlbCA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGFiZWwgd2stY2hhcnQtJyAgKyBzLmF4aXNPcmllbnQoKSlcbiAgICAgICAgICAgICAgbGFiZWxIZWlnaHRbcy5heGlzT3JpZW50KCldID0gZHJhd0FuZFBvc2l0aW9uVGV4dChsYWJlbCwgcy5heGlzTGFiZWwoKSwgJ3drLWNoYXJ0LWxhYmVsLXRleHQnLCAnMS41ZW0nKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbGFiZWwucmVtb3ZlKClcbiAgICAgICAgICBpZiBzLmF4aXNPcmllbnRPbGQoKSBhbmQgcy5heGlzT3JpZW50T2xkKCkgaXNudCBzLmF4aXNPcmllbnQoKVxuICAgICAgICAgICAgX3JlbW92ZUF4aXMocy5heGlzT3JpZW50T2xkKCkpXG4gICAgICAgICAgICBfcmVtb3ZlTGFiZWwocy5heGlzT3JpZW50T2xkKCkpXG5cblxuXG4gICAgICAjLS0tIGNvbXB1dGUgc2l6ZSBvZiB0aGUgZHJhd2luZyBhcmVhICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9mcmFtZUhlaWdodCA9IHRpdGxlQXJlYUhlaWdodCArIGF4aXNSZWN0LnRvcC5oZWlnaHQgKyBsYWJlbEhlaWdodC50b3AgKyBheGlzUmVjdC5ib3R0b20uaGVpZ2h0ICsgbGFiZWxIZWlnaHQuYm90dG9tICsgX21hcmdpbi50b3AgKyBfbWFyZ2luLmJvdHRvbVxuICAgICAgX2ZyYW1lV2lkdGggPSBheGlzUmVjdC5yaWdodC53aWR0aCArIGxhYmVsSGVpZ2h0LnJpZ2h0ICsgYXhpc1JlY3QubGVmdC53aWR0aCArIGxhYmVsSGVpZ2h0LmxlZnQgKyBfbWFyZ2luLmxlZnQgKyBfbWFyZ2luLnJpZ2h0XG5cbiAgICAgIGlmIF9mcmFtZUhlaWdodCA8IF9oZWlnaHRcbiAgICAgICAgX2lubmVySGVpZ2h0ID0gX2hlaWdodCAtIF9mcmFtZUhlaWdodFxuICAgICAgZWxzZVxuICAgICAgICBfaW5uZXJIZWlnaHQgPSAwXG5cbiAgICAgIGlmIF9mcmFtZVdpZHRoIDwgX3dpZHRoXG4gICAgICAgIF9pbm5lcldpZHRoID0gX3dpZHRoIC0gX2ZyYW1lV2lkdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX2lubmVyV2lkdGggPSAwXG5cbiAgICAgICMtLS0gcmVzZXQgc2NhbGUgcmFuZ2VzIGFuZCByZWRyYXcgYXhpcyB3aXRoIGFkanVzdGVkIHJhbmdlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBmb3IgbCBpbiBfbGF5b3V0c1xuICAgICAgICBmb3IgaywgcyBvZiBsLnNjYWxlcygpLmFsbEtpbmRzKClcbiAgICAgICAgICBpZiBrIGlzICd4JyBvciBrIGlzICdyYW5nZVgnXG4gICAgICAgICAgICBzLnJhbmdlKFswLCBfaW5uZXJXaWR0aF0pXG4gICAgICAgICAgZWxzZSBpZiBrIGlzICd5JyBvciBrIGlzICdyYW5nZVknXG4gICAgICAgICAgICBpZiBsLnNob3dMYWJlbHMoKVxuICAgICAgICAgICAgICBzLnJhbmdlKFtfaW5uZXJIZWlnaHQsIDIwXSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcy5yYW5nZShbX2lubmVySGVpZ2h0LCAwXSlcbiAgICAgICAgICBpZiBzLnNob3dBeGlzKClcbiAgICAgICAgICAgIGRyYXdBeGlzKHMpXG5cbiAgICAgICMtLS0gcG9zaXRpb24gZnJhbWUgZWxlbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsZWZ0TWFyZ2luID0gYXhpc1JlY3QubGVmdC53aWR0aCArIGxhYmVsSGVpZ2h0LmxlZnQgKyBfbWFyZ2luLmxlZnRcbiAgICAgIHRvcE1hcmdpbiA9IHRpdGxlQXJlYUhlaWdodCArIGF4aXNSZWN0LnRvcC5oZWlnaHQgICsgbGFiZWxIZWlnaHQudG9wICsgX21hcmdpbi50b3BcblxuICAgICAgX3NwYWNlZENvbnRhaW5lciA9IF9jb250YWluZXIuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0TWFyZ2lufSwgI3t0b3BNYXJnaW59KVwiKVxuICAgICAgX3N2Zy5zZWxlY3QoXCIjd2stY2hhcnQtY2xpcC0je19jb250YWluZXJJZH0gcmVjdFwiKS5hdHRyKCd3aWR0aCcsIF9pbm5lcldpZHRoKS5hdHRyKCdoZWlnaHQnLCBfaW5uZXJIZWlnaHQpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LW92ZXJsYXk+LndrLWNoYXJ0LWJhY2tncm91bmQnKS5hdHRyKCd3aWR0aCcsIF9pbm5lcldpZHRoKS5hdHRyKCdoZWlnaHQnLCBfaW5uZXJIZWlnaHQpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWFyZWEnKS5zdHlsZSgnY2xpcC1wYXRoJywgXCJ1cmwoI3drLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9KVwiKVxuICAgICAgX3NwYWNlZENvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ2NsaXAtcGF0aCcsIFwidXJsKCN3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfSlcIilcblxuICAgICAgX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1heGlzLndrLWNoYXJ0LXJpZ2h0JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aH0sIDApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtYm90dG9tJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwgI3tfaW5uZXJIZWlnaHR9KVwiKVxuXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LWxlZnQnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgjey1heGlzUmVjdC5sZWZ0LndpZHRoLWxhYmVsSGVpZ2h0LmxlZnQgLyAyIH0sICN7X2lubmVySGVpZ2h0LzJ9KSByb3RhdGUoLTkwKVwiKVxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1sYWJlbC53ay1jaGFydC1yaWdodCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGgrYXhpc1JlY3QucmlnaHQud2lkdGggKyBsYWJlbEhlaWdodC5yaWdodCAvIDJ9LCAje19pbm5lckhlaWdodC8yfSkgcm90YXRlKDkwKVwiKVxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1sYWJlbC53ay1jaGFydC10b3AnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19pbm5lcldpZHRoIC8gMn0sICN7LWF4aXNSZWN0LnRvcC5oZWlnaHQgLSBsYWJlbEhlaWdodC50b3AgLyAyIH0pXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LWJvdHRvbScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGggLyAyfSwgI3tfaW5uZXJIZWlnaHQgKyBheGlzUmVjdC5ib3R0b20uaGVpZ2h0ICsgbGFiZWxIZWlnaHQuYm90dG9tIH0pXCIpXG5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtdGl0bGUtYXJlYScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGgvMn0sICN7LXRvcE1hcmdpbiArIF90aXRsZUhlaWdodH0pXCIpXG5cbiAgICAgICMtLS0gZmluYWxseSwgZHJhdyBncmlkIGxpbmVzXG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKSBhbmQgcy5zaG93R3JpZCgpXG4gICAgICAgICAgICBkcmF3R3JpZChzKVxuXG4gICAgICBfY2hhcnQuYmVoYXZpb3IoKS5vdmVybGF5KF9vdmVybGF5KVxuICAgICAgX2NoYXJ0LmJlaGF2aW9yKCkuY29udGFpbmVyKF9jaGFydEFyZWEpXG5cbiAgICAjLS0tIEJydXNoIEFjY2VsZXJhdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd1NpbmdsZUF4aXMgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBzY2FsZS5zaG93QXhpcygpXG4gICAgICAgIGEgPSBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7c2NhbGUuYXhpcygpLm9yaWVudCgpfVwiKVxuICAgICAgICBhLmNhbGwoc2NhbGUuYXhpcygpKVxuXG4gICAgICAgIGlmIHNjYWxlLnNob3dHcmlkKClcbiAgICAgICAgICBkcmF3R3JpZChzY2FsZSwgdHJ1ZSlcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGNvbnRhaW5lciIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xheW91dCcsICgkbG9nLCBzY2FsZSwgc2NhbGVMaXN0LCB0aW1pbmcpIC0+XG5cbiAgbGF5b3V0Q250ciA9IDBcblxuICBsYXlvdXQgPSAoKSAtPlxuICAgIF9pZCA9IFwibGF5b3V0I3tsYXlvdXRDbnRyKyt9XCJcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gc2NhbGVMaXN0KClcbiAgICBfc2hvd0xhYmVscyA9IGZhbHNlXG4gICAgX2xheW91dExpZmVDeWNsZSA9IGQzLmRpc3BhdGNoKCdjb25maWd1cmUnLCAnZHJhdycsICdwcmVwYXJlRGF0YScsICdicnVzaCcsICdyZWRyYXcnLCAnZHJhd0F4aXMnLCAndXBkYXRlJywgJ3VwZGF0ZUF0dHJzJywgJ2JydXNoRHJhdycpXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBtZS5pZCA9IChpZCkgLT5cbiAgICAgIHJldHVybiBfaWRcblxuICAgIG1lLmNoYXJ0ID0gKGNoYXJ0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSBjaGFydFxuICAgICAgICBfc2NhbGVMaXN0LnBhcmVudFNjYWxlcyhjaGFydC5zY2FsZXMoKSlcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwiY29uZmlndXJlLiN7bWUuaWQoKX1cIiwgKCkgLT4gX2xheW91dExpZmVDeWNsZS5jb25maWd1cmUuYXBwbHkobWUuc2NhbGVzKCkpICNwYXNzdGhyb3VnaFxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJkcmF3Q2hhcnQuI3ttZS5pZCgpfVwiLCBtZS5kcmF3ICMgcmVnaXN0ZXIgZm9yIHRoZSBkcmF3aW5nIGV2ZW50XG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcInByZXBhcmVEYXRhLiN7bWUuaWQoKX1cIiwgbWUucHJlcGFyZURhdGFcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zY2FsZXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zY2FsZUxpc3RcblxuICAgIG1lLnNjYWxlUHJvcGVydGllcyA9ICgpIC0+XG4gICAgICByZXR1cm4gbWUuc2NhbGVzKCkuZ2V0U2NhbGVQcm9wZXJ0aWVzKClcblxuICAgIG1lLmNvbnRhaW5lciA9IChvYmopIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gb2JqXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc2hvd0xhYmVscyA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dMYWJlbHNcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dMYWJlbHMgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5iZWhhdmlvciA9ICgpIC0+XG4gICAgICBtZS5jaGFydCgpLmJlaGF2aW9yKClcblxuICAgIG1lLnByZXBhcmVEYXRhID0gKGRhdGEpIC0+XG4gICAgICBhcmdzID0gW11cbiAgICAgIGZvciBraW5kIGluIFsneCcsJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZScsICdyYW5nZVgnLCAncmFuZ2VZJ11cbiAgICAgICAgYXJncy5wdXNoKF9zY2FsZUxpc3QuZ2V0S2luZChraW5kKSlcbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUucHJlcGFyZURhdGEuYXBwbHkoZGF0YSwgYXJncylcblxuICAgIG1lLmxpZmVDeWNsZSA9ICgpLT5cbiAgICAgIHJldHVybiBfbGF5b3V0TGlmZUN5Y2xlXG5cblxuICAgICMtLS0gRFJZb3V0IGZyb20gZHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBnZXREcmF3QXJlYSA9ICgpIC0+XG4gICAgICBjb250YWluZXIgPSBfY29udGFpbmVyLmdldENoYXJ0QXJlYSgpXG4gICAgICBkcmF3QXJlYSA9IGNvbnRhaW5lci5zZWxlY3QoXCIuI3ttZS5pZCgpfVwiKVxuICAgICAgaWYgZHJhd0FyZWEuZW1wdHkoKVxuICAgICAgICBkcmF3QXJlYSA9IGNvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIChkKSAtPiBtZS5pZCgpKVxuICAgICAgcmV0dXJuIGRyYXdBcmVhXG5cbiAgICBidWlsZEFyZ3MgPSAoZGF0YSwgbm90QW5pbWF0ZWQpIC0+XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICBoZWlnaHQ6X2NvbnRhaW5lci5oZWlnaHQoKSxcbiAgICAgICAgd2lkdGg6X2NvbnRhaW5lci53aWR0aCgpLFxuICAgICAgICBtYXJnaW5zOl9jb250YWluZXIubWFyZ2lucygpLFxuICAgICAgICBkdXJhdGlvbjogaWYgbm90QW5pbWF0ZWQgdGhlbiAwIGVsc2UgbWUuY2hhcnQoKS5hbmltYXRpb25EdXJhdGlvbigpXG4gICAgICB9XG4gICAgICBhcmdzID0gW2RhdGEsIG9wdGlvbnNdXG4gICAgICBmb3Iga2luZCBpbiBbJ3gnLCd5JywgJ2NvbG9yJywgJ3NpemUnLCAnc2hhcGUnLCAncmFuZ2VYJywgJ3JhbmdlWSddXG4gICAgICAgIGFyZ3MucHVzaChfc2NhbGVMaXN0LmdldEtpbmQoa2luZCkpXG4gICAgICByZXR1cm4gYXJnc1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRyYXcgPSAoZGF0YSwgbm90QW5pbWF0ZWQpIC0+XG4gICAgICBfZGF0YSA9IGRhdGFcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5kcmF3LmFwcGx5KGdldERyYXdBcmVhKCksIGJ1aWxkQXJncyhkYXRhLCBub3RBbmltYXRlZCkpXG5cbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ3JlZHJhdycsIG1lLnJlZHJhd1xuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAndXBkYXRlJywgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS51cGRhdGVcbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ2RyYXdBeGlzJywgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5kcmF3QXhpc1xuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAndXBkYXRlQXR0cnMnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnVwZGF0ZUF0dHJzXG5cbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ2JydXNoJywgKGF4aXMsIG5vdEFuaW1hdGVkKSAtPlxuICAgICAgICBfY29udGFpbmVyLmRyYXdTaW5nbGVBeGlzKGF4aXMpXG4gICAgICAgIF9sYXlvdXRMaWZlQ3ljbGUuYnJ1c2hEcmF3LmFwcGx5KGdldERyYXdBcmVhKCksIGJ1aWxkQXJncyhfZGF0YSwgbm90QW5pbWF0ZWQpKVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGxheW91dCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xlZ2VuZCcsICgkbG9nLCAkY29tcGlsZSwgJHJvb3RTY29wZSwgJHRlbXBsYXRlQ2FjaGUsIHRlbXBsYXRlRGlyKSAtPlxuXG4gIGxlZ2VuZENudCA9IDBcblxuICB1bmlxdWVWYWx1ZXMgPSAoYXJyKSAtPlxuICAgIHNldCA9IHt9XG4gICAgZm9yIGUgaW4gYXJyXG4gICAgICBzZXRbZV0gPSAwXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNldClcblxuICBsZWdlbmQgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJsZWdlbmQtI3tsZWdlbmRDbnQrK31cIlxuICAgIF9wb3NpdGlvbiA9ICd0b3AtcmlnaHQnXG4gICAgX3NjYWxlID0gdW5kZWZpbmVkXG4gICAgX3RlbXBsYXRlUGF0aCA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmRTY29wZSA9ICRyb290U2NvcGUuJG5ldyh0cnVlKVxuICAgIF90ZW1wbGF0ZSA9IHVuZGVmaW5lZFxuICAgIF9wYXJzZWRUZW1wbGF0ZSA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXJEaXYgPSB1bmRlZmluZWRcbiAgICBfbGVnZW5kRGl2ID0gdW5kZWZpbmVkXG4gICAgX3RpdGxlID0gdW5kZWZpbmVkXG4gICAgX2xheW91dCA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX29wdGlvbnMgPSB1bmRlZmluZWRcbiAgICBfc2hvdyA9IGZhbHNlXG4gICAgX3Nob3dWYWx1ZXMgPSBmYWxzZVxuXG4gICAgbWUgPSB7fVxuXG4gICAgbWUucG9zaXRpb24gPSAocG9zKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wb3NpdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfcG9zaXRpb24gPSBwb3NcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zaG93ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvdyA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuc2hvd1ZhbHVlcyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dWYWx1ZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dWYWx1ZXMgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmRpdiA9IChzZWxlY3Rpb24pIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xlZ2VuZERpdlxuICAgICAgZWxzZVxuICAgICAgICBfbGVnZW5kRGl2ID0gc2VsZWN0aW9uXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0XG4gICAgICBlbHNlXG4gICAgICAgIF9sYXlvdXQgPSBsYXlvdXRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3NjYWxlID0gc2NhbGVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50aXRsZSA9ICh0aXRsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpdGxlID0gdGl0bGVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50ZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90ZW1wbGF0ZVBhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX3RlbXBsYXRlUGF0aCA9IHBhdGhcbiAgICAgICAgX3RlbXBsYXRlID0gJHRlbXBsYXRlQ2FjaGUuZ2V0KF90ZW1wbGF0ZVBhdGgpXG4gICAgICAgIF9wYXJzZWRUZW1wbGF0ZSA9ICRjb21waWxlKF90ZW1wbGF0ZSkoX2xlZ2VuZFNjb3BlKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmRyYXcgPSAoZGF0YSwgb3B0aW9ucykgLT5cbiAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgX29wdGlvbnMgPSBvcHRpb25zXG4gICAgICAjJGxvZy5pbmZvICdkcmF3aW5nIExlZ2VuZCdcbiAgICAgIF9jb250YWluZXJEaXYgPSBfbGVnZW5kRGl2IG9yIGQzLnNlbGVjdChtZS5zY2FsZSgpLnBhcmVudCgpLmNvbnRhaW5lcigpLmVsZW1lbnQoKSkuc2VsZWN0KCcud2stY2hhcnQnKVxuICAgICAgaWYgbWUuc2hvdygpXG4gICAgICAgIGlmIF9jb250YWluZXJEaXYuc2VsZWN0KCcud2stY2hhcnQtbGVnZW5kJykuZW1wdHkoKVxuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChfY29udGFpbmVyRGl2Lm5vZGUoKSkuYXBwZW5kKF9wYXJzZWRUZW1wbGF0ZSlcblxuICAgICAgICBpZiBtZS5zaG93VmFsdWVzKClcbiAgICAgICAgICBsYXllcnMgPSB1bmlxdWVWYWx1ZXMoX3NjYWxlLnZhbHVlKGRhdGEpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzID0gX3NjYWxlLmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHMgPSBfc2NhbGUuc2NhbGUoKVxuICAgICAgICBpZiBtZS5sYXlvdXQoKT8uc2NhbGVzKCkubGF5ZXJTY2FsZSgpXG4gICAgICAgICAgcyA9IG1lLmxheW91dCgpLnNjYWxlcygpLmxheWVyU2NhbGUoKS5zY2FsZSgpXG4gICAgICAgIGlmIF9zY2FsZS5raW5kKCkgaXNudCAnc2hhcGUnXG4gICAgICAgICAgX2xlZ2VuZFNjb3BlLmxlZ2VuZFJvd3MgPSBsYXllcnMubWFwKChkKSAtPiB7dmFsdWU6ZCwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzpzKGQpfX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfbGVnZW5kU2NvcGUubGVnZW5kUm93cyA9IGxheWVycy5tYXAoKGQpIC0+IHt2YWx1ZTpkLCBwYXRoOmQzLnN2Zy5zeW1ib2woKS50eXBlKHMoZCkpLnNpemUoODApKCl9KVxuICAgICAgICAgICMkbG9nLmxvZyBfbGVnZW5kU2NvcGUubGVnZW5kUm93c1xuICAgICAgICBfbGVnZW5kU2NvcGUuc2hvd0xlZ2VuZCA9IHRydWVcbiAgICAgICAgX2xlZ2VuZFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICAgIHBvc2l0aW9uOiBpZiBfbGVnZW5kRGl2IHRoZW4gJ3JlbGF0aXZlJyBlbHNlICdhYnNvbHV0ZSdcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIG5vdCBfbGVnZW5kRGl2XG4gICAgICAgICAgY29udGFpbmVyUmVjdCA9IF9jb250YWluZXJEaXYubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgY2hhcnRBcmVhUmVjdCA9IF9jb250YWluZXJEaXYuc2VsZWN0KCcud2stY2hhcnQtb3ZlcmxheSByZWN0Jykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgZm9yIHAgaW4gX3Bvc2l0aW9uLnNwbGl0KCctJylcbiAgICAgICAgICAgICAgX2xlZ2VuZFNjb3BlLnBvc2l0aW9uW3BdID0gXCIje01hdGguYWJzKGNvbnRhaW5lclJlY3RbcF0gLSBjaGFydEFyZWFSZWN0W3BdKX1weFwiXG4gICAgICAgIF9sZWdlbmRTY29wZS50aXRsZSA9IF90aXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfcGFyc2VkVGVtcGxhdGUucmVtb3ZlKClcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucmVnaXN0ZXIgPSAobGF5b3V0KSAtPlxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uIFwiZHJhdy4je19pZH1cIiwgbWUuZHJhd1xuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50ZW1wbGF0ZSh0ZW1wbGF0ZURpciArICdsZWdlbmQuaHRtbCcpXG5cbiAgICBtZS5yZWRyYXcgPSAoKSAtPlxuICAgICAgaWYgX2RhdGEgYW5kIF9vcHRpb25zXG4gICAgICAgIG1lLmRyYXcoX2RhdGEsIF9vcHRpb25zKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gbGVnZW5kIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnc2NhbGUnLCAoJGxvZywgbGVnZW5kLCBmb3JtYXREZWZhdWx0cywgd2tDaGFydFNjYWxlcykgLT5cblxuICBzY2FsZSA9ICgpIC0+XG4gICAgX2lkID0gJydcbiAgICBfc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgIF9zY2FsZVR5cGUgPSAnbGluZWFyJ1xuICAgIF9leHBvbmVudCA9IDFcbiAgICBfaXNPcmRpbmFsID0gZmFsc2VcbiAgICBfZG9tYWluID0gdW5kZWZpbmVkXG4gICAgX2RvbWFpbkNhbGMgPSB1bmRlZmluZWRcbiAgICBfY2FsY3VsYXRlZERvbWFpbiA9IHVuZGVmaW5lZFxuICAgIF9yZXNldE9uTmV3RGF0YSA9IGZhbHNlXG4gICAgX3Byb3BlcnR5ID0gJydcbiAgICBfbGF5ZXJQcm9wID0gJydcbiAgICBfbGF5ZXJFeGNsdWRlID0gW11cbiAgICBfbG93ZXJQcm9wZXJ0eSA9ICcnXG4gICAgX3VwcGVyUHJvcGVydHkgPSAnJ1xuICAgIF9yYW5nZSA9IHVuZGVmaW5lZFxuICAgIF9yYW5nZVBhZGRpbmcgPSAwLjNcbiAgICBfcmFuZ2VPdXRlclBhZGRpbmcgPSAwLjNcbiAgICBfaW5wdXRGb3JtYXRTdHJpbmcgPSB1bmRlZmluZWRcbiAgICBfaW5wdXRGb3JtYXRGbiA9IChkYXRhKSAtPiBpZiBpc05hTigrZGF0YSkgb3IgXy5pc0RhdGUoZGF0YSkgdGhlbiBkYXRhIGVsc2UgK2RhdGFcblxuICAgIF9zaG93QXhpcyA9IGZhbHNlXG4gICAgX2F4aXNPcmllbnQgPSB1bmRlZmluZWRcbiAgICBfYXhpc09yaWVudE9sZCA9IHVuZGVmaW5lZFxuICAgIF9heGlzID0gdW5kZWZpbmVkXG4gICAgX3RpY2tzID0gdW5kZWZpbmVkXG4gICAgX3RpY2tGb3JtYXQgPSB1bmRlZmluZWRcbiAgICBfcm90YXRlVGlja0xhYmVscyA9IHVuZGVmaW5lZFxuICAgIF9zaG93TGFiZWwgPSBmYWxzZVxuICAgIF9heGlzTGFiZWwgPSB1bmRlZmluZWRcbiAgICBfc2hvd0dyaWQgPSBmYWxzZVxuICAgIF9pc0hvcml6b250YWwgPSBmYWxzZVxuICAgIF9pc1ZlcnRpY2FsID0gZmFsc2VcbiAgICBfa2luZCA9IHVuZGVmaW5lZFxuICAgIF9wYXJlbnQgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfbGF5b3V0ID0gdW5kZWZpbmVkXG4gICAgX2xlZ2VuZCA9IGxlZ2VuZCgpXG4gICAgX291dHB1dEZvcm1hdFN0cmluZyA9IHVuZGVmaW5lZFxuICAgIF9vdXRwdXRGb3JtYXRGbiA9IHVuZGVmaW5lZFxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgIy0tLS0gdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAga2V5cyA9IChkYXRhKSAtPiBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBfLnJlamVjdChfLmtleXMoZGF0YVswXSksIChkKSAtPiBkIGlzICckJGhhc2hLZXknKSBlbHNlIF8ucmVqZWN0KF8ua2V5cyhkYXRhKSwgKGQpIC0+IGQgaXMgJyQkaGFzaEtleScpXG5cbiAgICBsYXllclRvdGFsID0gKGQsIGxheWVyS2V5cykgLT5cbiAgICAgIGxheWVyS2V5cy5yZWR1Y2UoXG4gICAgICAgIChwcmV2LCBuZXh0KSAtPiArcHJldiArICttZS5sYXllclZhbHVlKGQsbmV4dClcbiAgICAgICwgMClcblxuICAgIGxheWVyTWF4ID0gKGRhdGEsIGxheWVyS2V5cykgLT5cbiAgICAgIGQzLm1heChkYXRhLCAoZCkgLT4gZDMubWF4KGxheWVyS2V5cywgKGspIC0+IG1lLmxheWVyVmFsdWUoZCxrKSkpXG5cbiAgICBsYXllck1pbiA9IChkYXRhLCBsYXllcktleXMpIC0+XG4gICAgICBkMy5taW4oZGF0YSwgKGQpIC0+IGQzLm1pbihsYXllcktleXMsIChrKSAtPiBtZS5sYXllclZhbHVlKGQsaykpKVxuXG4gICAgcGFyc2VkVmFsdWUgPSAodikgLT5cbiAgICAgIGlmIF9pbnB1dEZvcm1hdEZuLnBhcnNlIHRoZW4gX2lucHV0Rm9ybWF0Rm4ucGFyc2UodikgZWxzZSBfaW5wdXRGb3JtYXRGbih2KVxuXG4gICAgY2FsY0RvbWFpbiA9IHtcbiAgICAgIGV4dGVudDogKGRhdGEpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICByZXR1cm4gW2xheWVyTWluKGRhdGEsIGxheWVyS2V5cyksIGxheWVyTWF4KGRhdGEsIGxheWVyS2V5cyldXG4gICAgICBtYXg6IChkYXRhKSAtPlxuICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgcmV0dXJuIFswLCBsYXllck1heChkYXRhLCBsYXllcktleXMpXVxuICAgICAgbWluOiAoZGF0YSkgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIHJldHVybiBbMCwgbGF5ZXJNaW4oZGF0YSwgbGF5ZXJLZXlzKV1cbiAgICAgIHRvdGFsRXh0ZW50OiAoZGF0YSkgLT5cbiAgICAgICAgaWYgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eSgndG90YWwnKVxuICAgICAgICAgIHJldHVybiBkMy5leHRlbnQoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBkLnRvdGFsKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICAgIHJldHVybiBkMy5leHRlbnQoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBsYXllclRvdGFsKGQsIGxheWVyS2V5cykpKVxuICAgICAgdG90YWw6IChkYXRhKSAtPlxuICAgICAgICBpZiBkYXRhWzBdLmhhc093blByb3BlcnR5KCd0b3RhbCcpXG4gICAgICAgICAgcmV0dXJuIFswLCBkMy5tYXgoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBkLnRvdGFsKSldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgICByZXR1cm4gWzAsIGQzLm1heChkYXRhLm1hcCgoZCkgLT5cbiAgICAgICAgICAgIGxheWVyVG90YWwoZCwgbGF5ZXJLZXlzKSkpXVxuICAgICAgcmFuZ2VFeHRlbnQ6IChkYXRhKSAtPlxuICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICByZXR1cm4gW2QzLm1pbihtZS5sb3dlclZhbHVlKGRhdGEpKSwgZDMubWF4KG1lLnVwcGVyVmFsdWUoZGF0YSkpXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgZGF0YS5sZW5ndGggPiAxXG4gICAgICAgICAgICBzdGFydCA9IG1lLmxvd2VyVmFsdWUoZGF0YVswXSlcbiAgICAgICAgICAgIHN0ZXAgPSBtZS5sb3dlclZhbHVlKGRhdGFbMV0pIC0gc3RhcnRcbiAgICAgICAgICAgIHJldHVybiBbbWUubG93ZXJWYWx1ZShkYXRhWzBdKSwgc3RhcnQgKyBzdGVwICogKGRhdGEubGVuZ3RoKSBdXG4gICAgICByYW5nZU1pbjogKGRhdGEpIC0+XG4gICAgICAgIHJldHVybiBbMCwgZDMubWluKG1lLmxvd2VyVmFsdWUoZGF0YSkpXVxuICAgICAgcmFuZ2VNYXg6IChkYXRhKSAtPlxuICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICByZXR1cm4gWzAsIGQzLm1heChtZS51cHBlclZhbHVlKGRhdGEpKV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHN0YXJ0ID0gbWUubG93ZXJWYWx1ZShkYXRhWzBdKVxuICAgICAgICAgIHN0ZXAgPSBtZS5sb3dlclZhbHVlKGRhdGFbMV0pIC0gc3RhcnRcbiAgICAgICAgICByZXR1cm4gWzAsIHN0YXJ0ICsgc3RlcCAqIChkYXRhLmxlbmd0aCkgXVxuICAgICAgfVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfa2luZCArICcuJyArIF9wYXJlbnQuaWQoKVxuXG4gICAgbWUua2luZCA9IChraW5kKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9raW5kXG4gICAgICBlbHNlXG4gICAgICAgIF9raW5kID0ga2luZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnBhcmVudCA9IChwYXJlbnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3BhcmVudFxuICAgICAgZWxzZVxuICAgICAgICBfcGFyZW50ID0gcGFyZW50XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuY2hhcnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmxheW91dCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheW91dFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5b3V0ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2NhbGUgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zY2FsZVxuXG4gICAgbWUubGVnZW5kID0gKCkgLT5cbiAgICAgIHJldHVybiBfbGVnZW5kXG5cbiAgICBtZS5pc09yZGluYWwgPSAoKSAtPlxuICAgICAgX2lzT3JkaW5hbFxuXG4gICAgbWUuaXNIb3Jpem9udGFsID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaXNIb3Jpem9udGFsXG4gICAgICBlbHNlXG4gICAgICAgIF9pc0hvcml6b250YWwgPSB0cnVlRmFsc2VcbiAgICAgICAgaWYgdHJ1ZUZhbHNlXG4gICAgICAgICAgX2lzVmVydGljYWwgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmlzVmVydGljYWwgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9pc1ZlcnRpY2FsXG4gICAgICBlbHNlXG4gICAgICAgIF9pc1ZlcnRpY2FsID0gdHJ1ZUZhbHNlXG4gICAgICAgIGlmIHRydWVGYWxzZVxuICAgICAgICAgIF9pc0hvcml6b250YWwgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLSBTY2FsZVR5cGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5zY2FsZVR5cGUgPSAodHlwZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGVUeXBlXG4gICAgICBlbHNlXG4gICAgICAgIGlmIGQzLnNjYWxlLmhhc093blByb3BlcnR5KHR5cGUpICMgc3VwcG9ydCB0aGUgZnVsbCBsaXN0IG9mIGQzIHNjYWxlIHR5cGVzXG4gICAgICAgICAgX3NjYWxlID0gZDMuc2NhbGVbdHlwZV0oKVxuICAgICAgICAgIF9zY2FsZVR5cGUgPSB0eXBlXG4gICAgICAgICAgbWUuZm9ybWF0KGZvcm1hdERlZmF1bHRzLm51bWJlcilcbiAgICAgICAgZWxzZSBpZiB0eXBlIGlzICd0aW1lJyAjIHRpbWUgc2NhbGUgaXMgaW4gZDMudGltZSBvYmplY3QsIG5vdCBpbiBkMy5zY2FsZS5cbiAgICAgICAgICBfc2NhbGUgPSBkMy50aW1lLnNjYWxlKClcbiAgICAgICAgICBfc2NhbGVUeXBlID0gJ3RpbWUnXG4gICAgICAgICAgaWYgX2lucHV0Rm9ybWF0U3RyaW5nXG4gICAgICAgICAgICBtZS5kYXRhRm9ybWF0KF9pbnB1dEZvcm1hdFN0cmluZylcbiAgICAgICAgICBtZS5mb3JtYXQoZm9ybWF0RGVmYXVsdHMuZGF0ZSlcbiAgICAgICAgZWxzZSBpZiB3a0NoYXJ0U2NhbGVzLmhhc093blByb3BlcnR5KHR5cGUpXG4gICAgICAgICAgX3NjYWxlVHlwZSA9IHR5cGVcbiAgICAgICAgICBfc2NhbGUgPSB3a0NoYXJ0U2NhbGVzW3R5cGVdKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRsb2cuZXJyb3IgJ0Vycm9yOiBpbGxlZ2FsIHNjYWxlIHR5cGU6JywgdHlwZVxuXG4gICAgICAgIF9pc09yZGluYWwgPSBfc2NhbGVUeXBlIGluIFsnb3JkaW5hbCcsICdjYXRlZ29yeTEwJywgJ2NhdGVnb3J5MjAnLCAnY2F0ZWdvcnkyMGInLCAnY2F0ZWdvcnkyMGMnXVxuICAgICAgICBpZiBfcmFuZ2VcbiAgICAgICAgICBtZS5yYW5nZShfcmFuZ2UpXG5cbiAgICAgICAgaWYgX3Nob3dBeGlzXG4gICAgICAgICAgX2F4aXMuc2NhbGUoX3NjYWxlKVxuXG4gICAgICAgIGlmIF9leHBvbmVudCBhbmQgX3NjYWxlVHlwZSBpcyAncG93J1xuICAgICAgICAgIF9zY2FsZS5leHBvbmVudChfZXhwb25lbnQpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZXhwb25lbnQgPSAodmFsdWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2V4cG9uZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9leHBvbmVudCA9IHZhbHVlXG4gICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ3BvdydcbiAgICAgICAgICBfc2NhbGUuZXhwb25lbnQoX2V4cG9uZW50KVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gRG9tYWluIGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5kb21haW4gPSAoZG9tKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9kb21haW5cbiAgICAgIGVsc2VcbiAgICAgICAgX2RvbWFpbiA9IGRvbVxuICAgICAgICBpZiBfLmlzQXJyYXkoX2RvbWFpbilcbiAgICAgICAgICBfc2NhbGUuZG9tYWluKF9kb21haW4pXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZG9tYWluQ2FsYyA9IChydWxlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBpZiBfaXNPcmRpbmFsIHRoZW4gdW5kZWZpbmVkIGVsc2UgX2RvbWFpbkNhbGNcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgY2FsY0RvbWFpbi5oYXNPd25Qcm9wZXJ0eShydWxlKVxuICAgICAgICAgIF9kb21haW5DYWxjID0gcnVsZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJGxvZy5lcnJvciAnaWxsZWdhbCBkb21haW4gY2FsY3VsYXRpb24gcnVsZTonLCBydWxlLCBcIiBleHBlY3RlZFwiLCBfLmtleXMoY2FsY0RvbWFpbilcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5nZXREb21haW4gPSAoZGF0YSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGUuZG9tYWluKClcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9kb21haW4gYW5kIG1lLmRvbWFpbkNhbGMoKVxuICAgICAgICAgICAgcmV0dXJuIF9jYWxjdWxhdGVkRG9tYWluXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBfZG9tYWluXG4gICAgICAgICAgICByZXR1cm4gX2RvbWFpblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBtZS52YWx1ZShkYXRhKVxuXG4gICAgbWUucmVzZXRPbk5ld0RhdGEgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9yZXNldE9uTmV3RGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfcmVzZXRPbk5ld0RhdGEgPSB0cnVlRmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIFJhbmdlIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUucmFuZ2UgPSAocmFuZ2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlLnJhbmdlKClcbiAgICAgIGVsc2VcbiAgICAgICAgX3JhbmdlID0gcmFuZ2VcbiAgICAgICAgaWYgX3NjYWxlVHlwZSBpcyAnb3JkaW5hbCcgYW5kIG1lLmtpbmQoKSBpbiBbJ3gnLCd5J11cbiAgICAgICAgICAgIF9zY2FsZS5yYW5nZUJhbmRzKHJhbmdlLCBfcmFuZ2VQYWRkaW5nLCBfcmFuZ2VPdXRlclBhZGRpbmcpXG4gICAgICAgIGVsc2UgaWYgbm90IChfc2NhbGVUeXBlIGluIFsnY2F0ZWdvcnkxMCcsICdjYXRlZ29yeTIwJywgJ2NhdGVnb3J5MjBiJywgJ2NhdGVnb3J5MjBjJ10pXG4gICAgICAgICAgX3NjYWxlLnJhbmdlKHJhbmdlKSAjIGlnbm9yZSByYW5nZSBmb3IgY29sb3IgY2F0ZWdvcnkgc2NhbGVzXG5cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5yYW5nZVBhZGRpbmcgPSAoY29uZmlnKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIHtwYWRkaW5nOl9yYW5nZVBhZGRpbmcsIG91dGVyUGFkZGluZzpfcmFuZ2VPdXRlclBhZGRpbmd9XG4gICAgICBlbHNlXG4gICAgICAgIF9yYW5nZVBhZGRpbmcgPSBjb25maWcucGFkZGluZ1xuICAgICAgICBfcmFuZ2VPdXRlclBhZGRpbmcgPSBjb25maWcub3V0ZXJQYWRkaW5nXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBwcm9wZXJ0eSByZWxhdGVkIGF0dHJpYnV0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Byb3BlcnR5XG4gICAgICBlbHNlXG4gICAgICAgIF9wcm9wZXJ0eSA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllclByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xheWVyUHJvcFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJQcm9wID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxheWVyRXhjbHVkZSA9IChleGNsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXllckV4Y2x1ZGVcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyRXhjbHVkZSA9IGV4Y2xcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllcktleXMgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF9wcm9wZXJ0eVxuICAgICAgICBpZiBfLmlzQXJyYXkoX3Byb3BlcnR5KVxuICAgICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihfcHJvcGVydHksIGtleXMoZGF0YSkpICMgZW5zdXJlIG9ubHkga2V5cyBhbHNvIGluIHRoZSBkYXRhIGFyZSByZXR1cm5lZCBhbmQgJCRoYXNoS2V5IGlzIG5vdCByZXR1cm5lZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIFtfcHJvcGVydHldICNhbHdheXMgcmV0dXJuIGFuIGFycmF5ICEhIVxuICAgICAgZWxzZVxuICAgICAgICBfLnJlamVjdChrZXlzKGRhdGEpLCAoZCkgLT4gZCBpbiBfbGF5ZXJFeGNsdWRlKVxuXG4gICAgbWUubG93ZXJQcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sb3dlclByb3BlcnR5XG4gICAgICBlbHNlXG4gICAgICAgIF9sb3dlclByb3BlcnR5ID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnVwcGVyUHJvcGVydHkgPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdXBwZXJQcm9wZXJ0eVxuICAgICAgZWxzZVxuICAgICAgICBfdXBwZXJQcm9wZXJ0eSA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIERhdGEgRm9ybWF0dGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZGF0YUZvcm1hdCA9IChmb3JtYXQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2lucHV0Rm9ybWF0U3RyaW5nXG4gICAgICBlbHNlXG4gICAgICAgIF9pbnB1dEZvcm1hdFN0cmluZyA9IGZvcm1hdFxuICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICd0aW1lJ1xuICAgICAgICAgIF9pbnB1dEZvcm1hdEZuID0gZDMudGltZS5mb3JtYXQoZm9ybWF0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2lucHV0Rm9ybWF0Rm4gPSAoZCkgLT4gZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gQ29yZSBkYXRhIHRyYW5zZm9ybWF0aW9uIGludGVyZmFjZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS52YWx1ZSA9IChkYXRhKSAtPlxuICAgICAgaWYgX2xheWVyUHJvcFxuICAgICAgICBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gcGFyc2VkVmFsdWUoZFtfcHJvcGVydHldW19sYXllclByb3BdKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW19wcm9wZXJ0eV1bX2xheWVyUHJvcF0pXG4gICAgICBlbHNlXG4gICAgICAgIGlmIF8uaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBwYXJzZWRWYWx1ZShkW19wcm9wZXJ0eV0pKSBlbHNlIHBhcnNlZFZhbHVlKGRhdGFbX3Byb3BlcnR5XSlcblxuICAgIG1lLmxheWVyVmFsdWUgPSAoZGF0YSwgbGF5ZXJLZXkpIC0+XG4gICAgICBpZiBfbGF5ZXJQcm9wXG4gICAgICAgIHBhcnNlZFZhbHVlKGRhdGFbbGF5ZXJLZXldW19sYXllclByb3BdKVxuICAgICAgZWxzZVxuICAgICAgICBwYXJzZWRWYWx1ZShkYXRhW2xheWVyS2V5XSlcblxuICAgIG1lLmxvd2VyVmFsdWUgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF8uaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBwYXJzZWRWYWx1ZShkW19sb3dlclByb3BlcnR5XSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfbG93ZXJQcm9wZXJ0eV0pXG5cbiAgICBtZS51cHBlclZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gcGFyc2VkVmFsdWUoZFtfdXBwZXJQcm9wZXJ0eV0pKSBlbHNlIHBhcnNlZFZhbHVlKGRhdGFbX3VwcGVyUHJvcGVydHldKVxuXG4gICAgbWUuZm9ybWF0dGVkVmFsdWUgPSAoZGF0YSkgLT5cbiAgICAgIG1lLmZvcm1hdFZhbHVlKG1lLnZhbHVlKGRhdGEpKVxuXG4gICAgbWUuZm9ybWF0VmFsdWUgPSAodmFsKSAtPlxuICAgICAgaWYgX291dHB1dEZvcm1hdFN0cmluZyBhbmQgdmFsIGFuZCAgKHZhbC5nZXRVVENEYXRlIG9yIG5vdCBpc05hTih2YWwpKVxuICAgICAgICBfb3V0cHV0Rm9ybWF0Rm4odmFsKVxuICAgICAgZWxzZVxuICAgICAgICB2YWxcblxuICAgIG1lLm1hcCA9IChkYXRhKSAtPlxuICAgICAgaWYgQXJyYXkuaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBfc2NhbGUobWUudmFsdWUoZGF0YSkpKSBlbHNlIF9zY2FsZShtZS52YWx1ZShkYXRhKSlcblxuICAgIG1lLmludmVydCA9IChtYXBwZWRWYWx1ZSkgLT5cbiAgICAgICMgdGFrZXMgYSBtYXBwZWQgdmFsdWUgKHBpeGVsIHBvc2l0aW9uICwgY29sb3IgdmFsdWUsIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgaW4gdGhlIGlucHV0IGRvbWFpblxuICAgICAgIyB0aGUgdHlwZSBvZiBpbnZlcnNlIGlzIGRlcGVuZGVudCBvbiB0aGUgc2NhbGUgdHlwZSBmb3IgcXVhbnRpdGF0aXZlIHNjYWxlcy5cbiAgICAgICMgT3JkaW5hbCBzY2FsZXMgLi4uXG5cbiAgICAgIGlmIF8uaGFzKG1lLnNjYWxlKCksJ2ludmVydCcpICMgaS5lLiB0aGUgZDMgc2NhbGUgc3VwcG9ydHMgdGhlIGludmVyc2UgY2FsY3VsYXRpb246IGxpbmVhciwgbG9nLCBwb3csIHNxcnRcbiAgICAgICAgX2RhdGEgPSBtZS5jaGFydCgpLmdldERhdGEoKVxuXG4gICAgICAgICMgYmlzZWN0LmxlZnQgbmV2ZXIgcmV0dXJucyAwIGluIHRoaXMgc3BlY2lmaWMgc2NlbmFyaW8uIFdlIG5lZWQgdG8gbW92ZSB0aGUgdmFsIGJ5IGFuIGludGVydmFsIHRvIGhpdCB0aGUgbWlkZGxlIG9mIHRoZSByYW5nZSBhbmQgdG8gZW5zdXJlXG4gICAgICAgICMgdGhhdCB0aGUgZmlyc3QgZWxlbWVudCB3aWxsIGJlIGNhcHR1cmVkLiBBbHNvIGVuc3VyZXMgYmV0dGVyIHZpc3VhbCBleHBlcmllbmNlIHdpdGggdG9vbHRpcHNcblxuICAgICAgICByYW5nZSA9IF9zY2FsZS5yYW5nZSgpXG4gICAgICAgIGludGVydmFsID0gKHJhbmdlWzFdIC0gcmFuZ2VbMF0pIC8gX2RhdGEubGVuZ3RoXG4gICAgICAgIHZhbCA9IG1lLnNjYWxlKCkuaW52ZXJ0KG1hcHBlZFZhbHVlIC0gaW50ZXJ2YWwvMilcblxuICAgICAgICBiaXNlY3QgPSBkMy5iaXNlY3RvcihtZS52YWx1ZSkubGVmdFxuICAgICAgICBpZHggPSBiaXNlY3QoX2RhdGEsIHZhbClcbiAgICAgICAgaWR4ID0gaWYgaWR4IDwgMCB0aGVuIDAgZWxzZSBpZiBpZHggPj0gX2RhdGEubGVuZ3RoIHRoZW4gX2RhdGEubGVuZ3RoIC0gMSBlbHNlIGlkeFxuICAgICAgICByZXR1cm4gaWR4ICMgdGhlIGludmVyc2UgdmFsdWUgZG9lcyBub3QgbmVjZXNzYXJpbHkgY29ycmVzcG9uZCB0byBhIHZhbHVlIGluIHRoZSBkYXRhXG5cbiAgICAgIGlmIF8uaGFzKG1lLnNjYWxlKCksJ2ludmVydEV4dGVudCcpICMgZDMgc3VwcG9ydHMgdGhpcyBmb3IgcXVhbnRpemUsIHF1YW50aWxlLCB0aHJlc2hvbGQuIHJldHVybnMgdGhlIHJhbmdlIHRoYXQgZ2V0cyBtYXBwZWQgdG8gdGhlIHZhbHVlXG4gICAgICAgIHJldHVybiBtZS5zY2FsZSgpLmludmVydEV4dGVudChtYXBwZWRWYWx1ZSkgI1RPRE8gSG93IHNob3VsZCB0aGlzIGJlIG1hcHBlZCBjb3JyZWN0bHkuIFVzZSBjYXNlPz8/XG5cbiAgICAgICMgZDMgZG9lcyBub3Qgc3VwcG9ydCBpbnZlcnQgZm9yIG9yZGluYWwgc2NhbGVzLCB0aHVzIHRoaW5ncyBiZWNvbWUgYSBiaXQgbW9yZSB0cmlja3kuXG4gICAgICAjIGluIGNhc2Ugd2UgYXJlIHNldHRpbmcgdGhlIGRvbWFpbiBleHBsaWNpdGx5LCB3ZSBrbm93IHRoYSB0aGUgcmFuZ2UgdmFsdWVzIGFuZCB0aGUgZG9tYWluIGVsZW1lbnRzIGFyZSBpbiB0aGUgc2FtZSBvcmRlclxuICAgICAgIyBpbiBjYXNlIHRoZSBkb21haW4gaXMgc2V0ICdsYXp5JyAoaS5lLiBhcyB2YWx1ZXMgYXJlIHVzZWQpIHdlIGNhbm5vdCBtYXAgcmFuZ2UgYW5kIGRvbWFpbiB2YWx1ZXMgZWFzaWx5LiBOb3QgY2xlYXIgaG93IHRvIGRvIHRoaXMgZWZmZWN0aXZlbHlcblxuICAgICAgaWYgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBkb21haW4gPSBfc2NhbGUuZG9tYWluKClcbiAgICAgICAgcmFuZ2UgPSBfc2NhbGUucmFuZ2UoKVxuICAgICAgICBpZiBfaXNWZXJ0aWNhbFxuICAgICAgICAgIGludGVydmFsID0gcmFuZ2VbMF0gLSByYW5nZVsxXVxuICAgICAgICAgIGlkeCA9IHJhbmdlLmxlbmd0aCAtIE1hdGguZmxvb3IobWFwcGVkVmFsdWUgLyBpbnRlcnZhbCkgLSAxXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpbnRlcnZhbCA9IHJhbmdlWzFdIC0gcmFuZ2VbMF1cbiAgICAgICAgICBpZHggPSBNYXRoLmZsb29yKG1hcHBlZFZhbHVlIC8gaW50ZXJ2YWwpXG4gICAgICAgIHJldHVybiBpZHhcblxuICAgIG1lLmludmVydE9yZGluYWwgPSAobWFwcGVkVmFsdWUpIC0+XG4gICAgICBpZiBtZS5pc09yZGluYWwoKSBhbmQgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBpZHggPSBtZS5pbnZlcnQobWFwcGVkVmFsdWUpXG4gICAgICAgIHJldHVybiBfc2NhbGUuZG9tYWluKClbaWR4XVxuXG5cbiAgICAjLS0tIEF4aXMgQXR0cmlidXRlcyBhbmQgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2hvd0F4aXMgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93QXhpc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0F4aXMgPSB0cnVlRmFsc2VcbiAgICAgICAgaWYgdHJ1ZUZhbHNlXG4gICAgICAgICAgX2F4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYXhpcyA9IHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmF4aXNPcmllbnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9heGlzT3JpZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9heGlzT3JpZW50T2xkID0gX2F4aXNPcmllbnRcbiAgICAgICAgX2F4aXNPcmllbnQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXNPcmllbnRPbGQgPSAodmFsKSAtPiAgI1RPRE8gVGhpcyBpcyBub3QgdGhlIGJlc3QgcGxhY2UgdG8ga2VlcCB0aGUgb2xkIGF4aXMgdmFsdWUuIE9ubHkgbmVlZGVkIGJ5IGNvbnRhaW5lciBpbiBjYXNlIHRoZSBheGlzIHBvc2l0aW9uIGNoYW5nZXNcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXhpc09yaWVudE9sZFxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc09yaWVudE9sZCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXhpcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2F4aXNcblxuICAgIG1lLnRpY2tzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja3NcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tzID0gdmFsXG4gICAgICAgIGlmIG1lLmF4aXMoKVxuICAgICAgICAgIG1lLmF4aXMoKS50aWNrcyhfdGlja3MpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50aWNrRm9ybWF0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja0Zvcm1hdFxuICAgICAgZWxzZVxuICAgICAgICBfdGlja0Zvcm1hdCA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja0Zvcm1hdCh2YWwpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5zaG93TGFiZWwgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93TGFiZWxcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dMYWJlbCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXhpc0xhYmVsID0gKHRleHQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIGlmIF9heGlzTGFiZWwgdGhlbiBfYXhpc0xhYmVsIGVsc2UgbWUucHJvcGVydHkoKVxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc0xhYmVsID0gdGV4dFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHMgPSAobmJyKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9yb3RhdGVUaWNrTGFiZWxzXG4gICAgICBlbHNlXG4gICAgICAgIF9yb3RhdGVUaWNrTGFiZWxzID0gbmJyXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZm9ybWF0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfb3V0cHV0Rm9ybWF0U3RyaW5nXG4gICAgICBlbHNlXG4gICAgICAgIGlmIHZhbC5sZW5ndGggPiAwXG4gICAgICAgICAgX291dHB1dEZvcm1hdFN0cmluZyA9IHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgX291dHB1dEZvcm1hdFN0cmluZyA9IGlmIG1lLnNjYWxlVHlwZSgpIGlzICd0aW1lJyB0aGVuIGZvcm1hdERlZmF1bHRzLmRhdGUgZWxzZSBmb3JtYXREZWZhdWx0cy5udW1iZXJcbiAgICAgICAgX291dHB1dEZvcm1hdEZuID0gaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnIHRoZW4gZDMudGltZS5mb3JtYXQoX291dHB1dEZvcm1hdFN0cmluZykgZWxzZSBkMy5mb3JtYXQoX291dHB1dEZvcm1hdFN0cmluZylcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnNob3dHcmlkID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0dyaWRcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dHcmlkID0gdHJ1ZUZhbHNlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tIFJlZ2lzdGVyIGZvciBkcmF3aW5nIGxpZmVjeWNsZSBldmVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnJlZ2lzdGVyID0gKCkgLT5cbiAgICAgIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkub24gXCJzY2FsZURvbWFpbnMuI3ttZS5pZCgpfVwiLCAoZGF0YSkgLT5cbiAgICAgICAgIyBzZXQgdGhlIGRvbWFpbiBpZiByZXF1aXJlZFxuICAgICAgICBpZiBtZS5yZXNldE9uTmV3RGF0YSgpXG4gICAgICAgICAgIyBlbnN1cmUgcm9idXN0IGJlaGF2aW9yIGluIGNhc2Ugb2YgcHJvYmxlbWF0aWMgZGVmaW5pdGlvbnNcbiAgICAgICAgICBkb21haW4gPSBtZS5nZXREb21haW4oZGF0YSlcbiAgICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICdsaW5lYXInIGFuZCBfLnNvbWUoZG9tYWluLCBpc05hTilcbiAgICAgICAgICAgIHRocm93IFwiU2NhbGUgI3ttZS5raW5kKCl9LCBUeXBlICcje19zY2FsZVR5cGV9JzogY2Fubm90IGNvbXB1dGUgZG9tYWluIGZvciBwcm9wZXJ0eSAnI3tfcHJvcGVydHl9JyAuIFBvc3NpYmxlIHJlYXNvbnM6IHByb3BlcnR5IG5vdCBzZXQsIGRhdGEgbm90IGNvbXBhdGlibGUgd2l0aCBkZWZpbmVkIHR5cGUuIERvbWFpbjoje2RvbWFpbn1cIlxuXG4gICAgICAgICAgX3NjYWxlLmRvbWFpbihkb21haW4pXG5cbiAgICAgIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkub24gXCJwcmVwYXJlRGF0YS4je21lLmlkKCl9XCIsIChkYXRhKSAtPlxuICAgICAgICAjIGNvbXB1dGUgdGhlIGRvbWFpbiByYW5nZSBjYWxjdWxhdGlvbiBpZiByZXF1aXJlZFxuICAgICAgICBjYWxjUnVsZSA9ICBtZS5kb21haW5DYWxjKClcbiAgICAgICAgaWYgbWUucGFyZW50KCkuc2NhbGVQcm9wZXJ0aWVzXG4gICAgICAgICAgbWUubGF5ZXJFeGNsdWRlKG1lLnBhcmVudCgpLnNjYWxlUHJvcGVydGllcygpKVxuICAgICAgICBpZiBjYWxjUnVsZSBhbmQgY2FsY0RvbWFpbltjYWxjUnVsZV1cbiAgICAgICAgICBfY2FsY3VsYXRlZERvbWFpbiA9IGNhbGNEb21haW5bY2FsY1J1bGVdKGRhdGEpXG5cbiAgICBtZS51cGRhdGUgPSAobm9BbmltYXRpb24pIC0+XG4gICAgICBtZS5wYXJlbnQoKS5saWZlQ3ljbGUoKS51cGRhdGUobm9BbmltYXRpb24pXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnVwZGF0ZUF0dHJzID0gKCkgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLnVwZGF0ZUF0dHJzKClcblxuICAgIG1lLmRyYXdBeGlzID0gKCkgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLmRyYXdBeGlzKClcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIHNjYWxlIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnc2NhbGVMaXN0JywgKCRsb2cpIC0+XG4gIHJldHVybiBzY2FsZUxpc3QgPSAoKSAtPlxuICAgIF9saXN0ID0ge31cbiAgICBfa2luZExpc3QgPSB7fVxuICAgIF9wYXJlbnRMaXN0ID0ge31cbiAgICBfb3duZXIgPSB1bmRlZmluZWRcbiAgICBfcmVxdWlyZWRTY2FsZXMgPSBbXVxuICAgIF9sYXllclNjYWxlID0gdW5kZWZpbmVkXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBtZS5vd25lciA9IChvd25lcikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfb3duZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX293bmVyID0gb3duZXJcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGQgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBfbGlzdFtzY2FsZS5pZCgpXVxuICAgICAgICAkbG9nLmVycm9yIFwic2NhbGVMaXN0LmFkZDogc2NhbGUgI3tzY2FsZS5pZCgpfSBhbHJlYWR5IGRlZmluZWQgaW4gc2NhbGVMaXN0IG9mICN7X293bmVyLmlkKCl9LiBEdXBsaWNhdGUgc2NhbGVzIGFyZSBub3QgYWxsb3dlZFwiXG4gICAgICBfbGlzdFtzY2FsZS5pZCgpXSA9IHNjYWxlXG4gICAgICBfa2luZExpc3Rbc2NhbGUua2luZCgpXSA9IHNjYWxlXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmhhc1NjYWxlID0gKHNjYWxlKSAtPlxuICAgICAgcyA9IG1lLmdldEtpbmQoc2NhbGUua2luZCgpKVxuICAgICAgcmV0dXJuIHMuaWQoKSBpcyBzY2FsZS5pZCgpXG5cbiAgICBtZS5nZXRLaW5kID0gKGtpbmQpIC0+XG4gICAgICBpZiBfa2luZExpc3Rba2luZF0gdGhlbiBfa2luZExpc3Rba2luZF0gZWxzZSBpZiBfcGFyZW50TGlzdC5nZXRLaW5kIHRoZW4gX3BhcmVudExpc3QuZ2V0S2luZChraW5kKSBlbHNlIHVuZGVmaW5lZFxuXG4gICAgbWUuaGFzS2luZCA9IChraW5kKSAtPlxuICAgICAgcmV0dXJuICEhbWUuZ2V0S2luZChraW5kKVxuXG4gICAgbWUucmVtb3ZlID0gKHNjYWxlKSAtPlxuICAgICAgaWYgbm90IF9saXN0W3NjYWxlLmlkKCldXG4gICAgICAgICRsb2cud2FybiBcInNjYWxlTGlzdC5kZWxldGU6IHNjYWxlICN7c2NhbGUuaWQoKX0gbm90IGRlZmluZWQgaW4gc2NhbGVMaXN0IG9mICN7X293bmVyLmlkKCl9LiBJZ25vcmluZ1wiXG4gICAgICAgIHJldHVybiBtZVxuICAgICAgZGVsZXRlIF9saXN0W3NjYWxlLmlkKCldXG4gICAgICBkZWxldGUgbWVbc2NhbGUuaWRdXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnBhcmVudFNjYWxlcyA9IChzY2FsZUxpc3QpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3BhcmVudExpc3RcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhcmVudExpc3QgPSBzY2FsZUxpc3RcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5nZXRPd25lZCA9ICgpIC0+XG4gICAgICBfbGlzdFxuXG4gICAgbWUuYWxsS2luZHMgPSAoKSAtPlxuICAgICAgcmV0ID0ge31cbiAgICAgIGlmIF9wYXJlbnRMaXN0LmFsbEtpbmRzXG4gICAgICAgIGZvciBrLCBzIG9mIF9wYXJlbnRMaXN0LmFsbEtpbmRzKClcbiAgICAgICAgICByZXRba10gPSBzXG4gICAgICBmb3IgayxzIG9mIF9raW5kTGlzdFxuICAgICAgICByZXRba10gPSBzXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5yZXF1aXJlZFNjYWxlcyA9IChyZXEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3JlcXVpcmVkU2NhbGVzXG4gICAgICBlbHNlXG4gICAgICAgIF9yZXF1aXJlZFNjYWxlcyA9IHJlcVxuICAgICAgICBmb3IgayBpbiByZXFcbiAgICAgICAgICBpZiBub3QgbWUuaGFzS2luZChrKVxuICAgICAgICAgICAgdGhyb3cgXCJGYXRhbCBFcnJvcjogc2NhbGUgJyN7a30nIHJlcXVpcmVkIGJ1dCBub3QgZGVmaW5lZFwiXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmdldFNjYWxlcyA9IChraW5kTGlzdCkgLT5cbiAgICAgIGwgPSB7fVxuICAgICAgZm9yIGtpbmQgaW4ga2luZExpc3RcbiAgICAgICAgaWYgbWUuaGFzS2luZChraW5kKVxuICAgICAgICAgIGxba2luZF0gPSBtZS5nZXRLaW5kKGtpbmQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBcIkZhdGFsIEVycm9yOiBzY2FsZSAnI3traW5kfScgcmVxdWlyZWQgYnV0IG5vdCBkZWZpbmVkXCJcbiAgICAgIHJldHVybiBsXG5cbiAgICBtZS5nZXRTY2FsZVByb3BlcnRpZXMgPSAoKSAtPlxuICAgICAgbCA9IFtdXG4gICAgICBmb3IgayxzIG9mIG1lLmFsbEtpbmRzKClcbiAgICAgICAgcHJvcCA9IHMucHJvcGVydHkoKVxuICAgICAgICBpZiBwcm9wXG4gICAgICAgICAgaWYgQXJyYXkuaXNBcnJheShwcm9wKVxuICAgICAgICAgICAgbC5jb25jYXQocHJvcClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsLnB1c2gocHJvcClcbiAgICAgIHJldHVybiBsXG5cbiAgICBtZS5sYXllclNjYWxlID0gKGtpbmQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgaWYgX2xheWVyU2NhbGVcbiAgICAgICAgICByZXR1cm4gbWUuZ2V0S2luZChfbGF5ZXJTY2FsZSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJTY2FsZSA9IGtpbmRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sb3InLCAoJGxvZywgc2NhbGUsIGxlZ2VuZCwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsnY29sb3InLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVDb2xvcidcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICBsID0gdW5kZWZpbmVkXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnY29sb3InXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2NhdGVnb3J5MjAnKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuICAgICAgbWUucmVnaXN0ZXIoKVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAnc2NhbGVVdGlscycsICgkbG9nLCB3a0NoYXJ0U2NhbGVzKSAtPlxuXG4gIHBhcnNlTGlzdCA9ICh2YWwpIC0+XG4gICAgaWYgdmFsXG4gICAgICBsID0gdmFsLnRyaW0oKS5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpLnNwbGl0KCcsJykubWFwKChkKSAtPiBkLnJlcGxhY2UoL15bXFxcInwnXXxbXFxcInwnXSQvZywgJycpKVxuICAgICAgbCA9IGwubWFwKChkKSAtPiBpZiBpc05hTihkKSB0aGVuIGQgZWxzZSArZClcbiAgICAgIHJldHVybiBpZiBsLmxlbmd0aCBpcyAxIHRoZW4gcmV0dXJuIGxbMF0gZWxzZSBsXG5cbiAgcmV0dXJuIHtcblxuICAgIG9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lKSAtPlxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3R5cGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiBkMy5zY2FsZS5oYXNPd25Qcm9wZXJ0eSh2YWwpIG9yIHZhbCBpcyAndGltZScgb3Igd2tDaGFydFNjYWxlcy5oYXNPd25Qcm9wZXJ0eSh2YWwpXG4gICAgICAgICAgICBtZS5zY2FsZVR5cGUodmFsKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIHZhbCBpc250ICcnXG4gICAgICAgICAgICAgICMjIG5vIHNjYWxlIGRlZmluZWQsIHVzZSBkZWZhdWx0XG4gICAgICAgICAgICAgICRsb2cuZXJyb3IgXCJFcnJvcjogaWxsZWdhbCBzY2FsZSB2YWx1ZTogI3t2YWx9LiBVc2luZyAnbGluZWFyJyBzY2FsZSBpbnN0ZWFkXCJcbiAgICAgICAgICBtZS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZXhwb25lbnQnLCAodmFsKSAtPlxuICAgICAgICBpZiBtZS5zY2FsZVR5cGUoKSBpcyAncG93JyBhbmQgXy5pc051bWJlcigrdmFsKVxuICAgICAgICAgIG1lLmV4cG9uZW50KCt2YWwpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIG1lLnByb3BlcnR5KHBhcnNlTGlzdCh2YWwpKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGF5ZXJQcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBtZS5sYXllclByb3BlcnR5KHZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3JhbmdlJywgKHZhbCkgLT5cbiAgICAgICAgcmFuZ2UgPSBwYXJzZUxpc3QodmFsKVxuICAgICAgICBpZiBBcnJheS5pc0FycmF5KHJhbmdlKVxuICAgICAgICAgIG1lLnJhbmdlKHJhbmdlKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZGF0ZUZvcm1hdCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIGlmIG1lLnNjYWxlVHlwZSgpIGlzICd0aW1lJ1xuICAgICAgICAgICAgbWUuZGF0YUZvcm1hdCh2YWwpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkb21haW4nLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICAkbG9nLmluZm8gJ2RvbWFpbicsIHZhbFxuICAgICAgICAgIHBhcnNlZExpc3QgPSBwYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIEFycmF5LmlzQXJyYXkocGFyc2VkTGlzdClcbiAgICAgICAgICAgIG1lLmRvbWFpbihwYXJzZWRMaXN0KS51cGRhdGUoKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICRsb2cuZXJyb3IgXCJkb21haW46IG11c3QgYmUgYXJyYXksIG9yIGNvbW1hLXNlcGFyYXRlZCBsaXN0LCBnb3RcIiwgdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLmRvbWFpbih1bmRlZmluZWQpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkb21haW5SYW5nZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIG1lLmRvbWFpbkNhbGModmFsKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGFiZWwnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5heGlzTGFiZWwodmFsKS51cGRhdGVBdHRycygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdmb3JtYXQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5mb3JtYXQodmFsKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG9ic2VydmVBeGlzQXR0cmlidXRlczogKGF0dHJzLCBtZSkgLT5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3RpY2tGb3JtYXQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS50aWNrRm9ybWF0KGQzLmZvcm1hdCh2YWwpKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndGlja3MnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS50aWNrcygrdmFsKVxuICAgICAgICAgIGlmIG1lLmF4aXMoKVxuICAgICAgICAgICAgbWUudXBkYXRlQXR0cnMoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZ3JpZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnNob3dHcmlkKHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnKS51cGRhdGVBdHRycygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdzaG93TGFiZWwnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5zaG93TGFiZWwodmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScpLnVwZGF0ZSh0cnVlKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lLCBsYXlvdXQpIC0+XG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsZWdlbmQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBsID0gbWUubGVnZW5kKClcbiAgICAgICAgICBsLnNob3dWYWx1ZXMoZmFsc2UpXG4gICAgICAgICAgc3dpdGNoIHZhbFxuICAgICAgICAgICAgd2hlbiAnZmFsc2UnXG4gICAgICAgICAgICAgIGwuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgIHdoZW4gJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24odmFsKS5kaXYodW5kZWZpbmVkKS5zaG93KHRydWUpXG4gICAgICAgICAgICB3aGVuICd0cnVlJywgJydcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbigndG9wLXJpZ2h0Jykuc2hvdyh0cnVlKS5kaXYodW5kZWZpbmVkKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsZWdlbmREaXYgPSBkMy5zZWxlY3QodmFsKVxuICAgICAgICAgICAgICBpZiBsZWdlbmREaXYuZW1wdHkoKVxuICAgICAgICAgICAgICAgICRsb2cud2FybiAnbGVnZW5kIHJlZmVyZW5jZSBkb2VzIG5vdCBleGlzdDonLCB2YWxcbiAgICAgICAgICAgICAgICBsLmRpdih1bmRlZmluZWQpLnNob3coZmFsc2UpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsLmRpdihsZWdlbmREaXYpLnBvc2l0aW9uKCd0b3AtbGVmdCcpLnNob3codHJ1ZSlcblxuICAgICAgICAgIGwuc2NhbGUobWUpLmxheW91dChsYXlvdXQpXG4gICAgICAgICAgaWYgbWUucGFyZW50KClcbiAgICAgICAgICAgIGwucmVnaXN0ZXIobWUucGFyZW50KCkpXG4gICAgICAgICAgbC5yZWRyYXcoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndmFsdWVzTGVnZW5kJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbCA9IG1lLmxlZ2VuZCgpXG4gICAgICAgICAgbC5zaG93VmFsdWVzKHRydWUpXG4gICAgICAgICAgc3dpdGNoIHZhbFxuICAgICAgICAgICAgd2hlbiAnZmFsc2UnXG4gICAgICAgICAgICAgIGwuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgIHdoZW4gJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24odmFsKS5kaXYodW5kZWZpbmVkKS5zaG93KHRydWUpXG4gICAgICAgICAgICB3aGVuICd0cnVlJywgJydcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbigndG9wLXJpZ2h0Jykuc2hvdyh0cnVlKS5kaXYodW5kZWZpbmVkKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsZWdlbmREaXYgPSBkMy5zZWxlY3QodmFsKVxuICAgICAgICAgICAgICBpZiBsZWdlbmREaXYuZW1wdHkoKVxuICAgICAgICAgICAgICAgICRsb2cud2FybiAnbGVnZW5kIHJlZmVyZW5jZSBkb2VzIG5vdCBleGlzdDonLCB2YWxcbiAgICAgICAgICAgICAgICBsLmRpdih1bmRlZmluZWQpLnNob3coZmFsc2UpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsLmRpdihsZWdlbmREaXYpLnBvc2l0aW9uKCd0b3AtbGVmdCcpLnNob3codHJ1ZSlcblxuICAgICAgICAgIGwuc2NhbGUobWUpLmxheW91dChsYXlvdXQpXG4gICAgICAgICAgaWYgbWUucGFyZW50KClcbiAgICAgICAgICAgIGwucmVnaXN0ZXIobWUucGFyZW50KCkpXG4gICAgICAgICAgbC5yZWRyYXcoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGVnZW5kVGl0bGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5sZWdlbmQoKS50aXRsZSh2YWwpLnJlZHJhdygpXG5cbiAgICAjLS0tIE9ic2VydmUgUmFuZ2UgYXR0cmlidXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb2JzZXJ2ZXJSYW5nZUF0dHJpYnV0ZXM6IChhdHRycywgbWUpIC0+XG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbG93ZXJQcm9wZXJ0eScsICh2YWwpIC0+XG4gICAgICAgIG51bGxcbiAgICAgICAgbWUubG93ZXJQcm9wZXJ0eShwYXJzZUxpc3QodmFsKSkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3VwcGVyUHJvcGVydHknLCAodmFsKSAtPlxuICAgICAgICBudWxsXG4gICAgICAgIG1lLnVwcGVyUHJvcGVydHkocGFyc2VMaXN0KHZhbCkpLnVwZGF0ZSgpXG5cblxuXG4gIH1cblxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzaGFwZScsICgkbG9nLCBzY2FsZSwgZDNTaGFwZXMsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3NoYXBlJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlU2l6ZSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnc2hhcGUnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgbWUuc2NhbGUoKS5yYW5nZShkM1NoYXBlcylcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NpemUnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3NpemUnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVTaXplJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdzaXplJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3gnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3gnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVgnXG4gICAgICB0aGlzLm1lID0gc2NhbGUoKSAjIGZvciBBbmd1bGFyIDEuM1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICd4J1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIG1lLmlzSG9yaXpvbnRhbCh0cnVlKVxuICAgICAgbWUucmVnaXN0ZXIoKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ3RvcCcsICdib3R0b20nXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnYm90dG9tJykuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5zaG93QXhpcyhmYWxzZSkuYXhpc09yaWVudCh1bmRlZmluZWQpXG4gICAgICAgICAgbWUudXBkYXRlKHRydWUpXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdyb3RhdGVUaWNrTGFiZWxzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCBfLmlzTnVtYmVyKCt2YWwpXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscygrdmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUucm90YXRlVGlja0xhYmVscyh1bmRlZmluZWQpXG4gICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdyYW5nZVgnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3JhbmdlWCcsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWCdcbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpICMgZm9yIEFuZ3VsYXIgMS4zXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3JhbmdlWCdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBtZS5pc0hvcml6b250YWwodHJ1ZSlcbiAgICAgIG1lLnJlZ2lzdGVyKClcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2F4aXMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgICBpZiB2YWwgaW4gWyd0b3AnLCAnYm90dG9tJ11cbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCh2YWwpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQoJ2JvdHRvbScpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlclJhbmdlQXR0cmlidXRlcyhhdHRycyxtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3JvdGF0ZVRpY2tMYWJlbHMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgYW5kIF8uaXNOdW1iZXIoK3ZhbClcbiAgICAgICAgICBtZS5yb3RhdGVUaWNrTGFiZWxzKCt2YWwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS5yb3RhdGVUaWNrTGFiZWxzKHVuZGVmaW5lZClcbiAgICAgICAgbWUudXBkYXRlKHRydWUpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3knLCAoJGxvZywgc2NhbGUsIGxlZ2VuZCwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsneScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVknXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3knXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2xpbmVhcicpXG4gICAgICBtZS5pc1ZlcnRpY2FsKHRydWUpXG4gICAgICBtZS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuICAgICAgbWUucmVnaXN0ZXIoKVxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2F4aXMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgICBpZiB2YWwgaW4gWydsZWZ0JywgJ3JpZ2h0J11cbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCh2YWwpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQoJ2xlZnQnKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLnNob3dBeGlzKGZhbHNlKS5heGlzT3JpZW50KHVuZGVmaW5lZClcbiAgICAgICAgICBtZS51cGRhdGUodHJ1ZSlcblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlQXhpc0F0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncmFuZ2VZJywgKCRsb2csIHNjYWxlLCBsZWdlbmQsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3JhbmdlWScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVknXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3JhbmdlWSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLmlzVmVydGljYWwodHJ1ZSlcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnbGVmdCcpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlclJhbmdlQXR0cmlidXRlcyhhdHRycyxtZSlcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnNlcnZpY2UgJ3NlbGVjdGlvblNoYXJpbmcnLCAoJGxvZykgLT5cbiAgc2VsZWN0aW9uID0ge31cbiAgY2FsbGJhY2tzID0ge31cblxuICB0aGlzLmNyZWF0ZUdyb3VwID0gKGdyb3VwKSAtPlxuXG5cbiAgdGhpcy5zZXRTZWxlY3Rpb24gPSAoc2VsZWN0aW9uLCBncm91cCkgLT5cbiAgICBpZiBncm91cFxuICAgICAgc2VsZWN0aW9uW2dyb3VwXSA9IHNlbGVjdGlvblxuICAgICAgaWYgY2FsbGJhY2tzW2dyb3VwXVxuICAgICAgICBmb3IgY2IgaW4gY2FsbGJhY2tzW2dyb3VwXVxuICAgICAgICAgIGNiKHNlbGVjdGlvbilcblxuICB0aGlzLmdldFNlbGVjdGlvbiA9IChncm91cCkgLT5cbiAgICBncnAgPSBncm91cCBvciAnZGVmYXVsdCdcbiAgICByZXR1cm4gc2VsZWN0aW9uW2dycF1cblxuICB0aGlzLnJlZ2lzdGVyID0gKGdyb3VwLCBjYWxsYmFjaykgLT5cbiAgICBpZiBncm91cFxuICAgICAgaWYgbm90IGNhbGxiYWNrc1tncm91cF1cbiAgICAgICAgY2FsbGJhY2tzW2dyb3VwXSA9IFtdXG4gICAgICAjZW5zdXJlIHRoYXQgY2FsbGJhY2tzIGFyZSBub3QgcmVnaXN0ZXJlZCBtb3JlIHRoYW4gb25jZVxuICAgICAgaWYgbm90IF8uY29udGFpbnMoY2FsbGJhY2tzW2dyb3VwXSwgY2FsbGJhY2spXG4gICAgICAgIGNhbGxiYWNrc1tncm91cF0ucHVzaChjYWxsYmFjaylcblxuICB0aGlzLnVucmVnaXN0ZXIgPSAoZ3JvdXAsIGNhbGxiYWNrKSAtPlxuICAgIGlmIGNhbGxiYWNrc1tncm91cF1cbiAgICAgIGlkeCA9IGNhbGxiYWNrc1tncm91cF0uaW5kZXhPZiBjYWxsYmFja1xuICAgICAgaWYgaWR4ID49IDBcbiAgICAgICAgY2FsbGJhY2tzW2dyb3VwXS5zcGxpY2UoaWR4LCAxKVxuXG4gIHJldHVybiB0aGlzXG5cbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnNlcnZpY2UgJ3RpbWluZycsICgkbG9nKSAtPlxuXG4gIHRpbWVycyA9IHt9XG4gIGVsYXBzZWRTdGFydCA9IDBcbiAgZWxhcHNlZCA9IDBcblxuICB0aGlzLmluaXQgPSAoKSAtPlxuICAgIGVsYXBzZWRTdGFydCA9IERhdGUubm93KClcblxuICB0aGlzLnN0YXJ0ID0gKHRvcGljKSAtPlxuICAgIHRvcCA9IHRpbWVyc1t0b3BpY11cbiAgICBpZiBub3QgdG9wXG4gICAgICB0b3AgPSB0aW1lcnNbdG9waWNdID0ge25hbWU6dG9waWMsIHN0YXJ0OjAsIHRvdGFsOjAsIGNhbGxDbnQ6MCwgYWN0aXZlOiBmYWxzZX1cbiAgICB0b3Auc3RhcnQgPSBEYXRlLm5vdygpXG4gICAgdG9wLmFjdGl2ZSA9IHRydWVcblxuICB0aGlzLnN0b3AgPSAodG9waWMpIC0+XG4gICAgaWYgdG9wID0gdGltZXJzW3RvcGljXVxuICAgICAgdG9wLmFjdGl2ZSA9IGZhbHNlXG4gICAgICB0b3AudG90YWwgKz0gRGF0ZS5ub3coKSAtIHRvcC5zdGFydFxuICAgICAgdG9wLmNhbGxDbnQgKz0gMVxuICAgIGVsYXBzZWQgPSBEYXRlLm5vdygpIC0gZWxhcHNlZFN0YXJ0XG5cbiAgdGhpcy5yZXBvcnQgPSAoKSAtPlxuICAgIGZvciB0b3BpYywgdmFsIG9mIHRpbWVyc1xuICAgICAgdmFsLmF2ZyA9IHZhbC50b3RhbCAvIHZhbC5jYWxsQ250XG4gICAgJGxvZy5pbmZvIHRpbWVyc1xuICAgICRsb2cuaW5mbyAnRWxhcHNlZCBUaW1lIChtcyknLCBlbGFwc2VkXG4gICAgcmV0dXJuIHRpbWVyc1xuXG4gIHRoaXMuY2xlYXIgPSAoKSAtPlxuICAgIHRpbWVycyA9IHt9XG5cbiAgcmV0dXJuIHRoaXMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdsYXllcmVkRGF0YScsICgkbG9nKSAtPlxuXG4gIGxheWVyZWQgPSAoKSAtPlxuICAgIF9kYXRhID0gW11cbiAgICBfbGF5ZXJLZXlzID0gW11cbiAgICBfeCA9IHVuZGVmaW5lZFxuICAgIF9jYWxjVG90YWwgPSBmYWxzZVxuICAgIF9taW4gPSBJbmZpbml0eVxuICAgIF9tYXggPSAtSW5maW5pdHlcbiAgICBfdE1pbiA9IEluZmluaXR5XG4gICAgX3RNYXggPSAtSW5maW5pdHlcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLmRhdGEgPSAoZGF0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBJcyAwXG4gICAgICAgIHJldHVybiBfZGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfZGF0YSA9IGRhdFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxheWVyS2V5cyA9IChrZXlzKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBfbGF5ZXJLZXlzXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllcktleXMgPSBrZXlzXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUueCA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBfeFxuICAgICAgZWxzZVxuICAgICAgICBfeCA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5jYWxjVG90YWwgPSAodF9mKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBfY2FsY1RvdGFsXG4gICAgICBlbHNlXG4gICAgICAgIF9jYWxjVG90YWwgPSB0X2ZcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5taW4gPSAoKSAtPlxuICAgICAgX21pblxuXG4gICAgbWUubWF4ID0gKCkgLT5cbiAgICAgIF9tYXhcblxuICAgIG1lLm1pblRvdGFsID0gKCkgLT5cbiAgICAgIF90TWluXG5cbiAgICBtZS5tYXhUb3RhbCA9ICgpIC0+XG4gICAgICBfdE1heFxuXG4gICAgbWUuZXh0ZW50ID0gKCkgLT5cbiAgICAgIFttZS5taW4oKSwgbWUubWF4KCldXG5cbiAgICBtZS50b3RhbEV4dGVudCA9ICgpIC0+XG4gICAgICBbbWUubWluVG90YWwoKSwgbWUubWF4VG90YWwoKV1cblxuICAgIG1lLmNvbHVtbnMgPSAoZGF0YSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMVxuICAgICAgICAjX2xheWVyS2V5cy5tYXAoKGspIC0+IHtrZXk6aywgdmFsdWVzOmRhdGEubWFwKChkKSAtPiB7eDogZFtfeF0sIHZhbHVlOiBkW2tdLCBkYXRhOiBkfSApfSlcbiAgICAgICAgcmVzID0gW11cbiAgICAgICAgX21pbiA9IEluZmluaXR5XG4gICAgICAgIF9tYXggPSAtSW5maW5pdHlcbiAgICAgICAgX3RNaW4gPSBJbmZpbml0eVxuICAgICAgICBfdE1heCA9IC1JbmZpbml0eVxuXG4gICAgICAgIGZvciBrLCBpIGluIF9sYXllcktleXNcbiAgICAgICAgICByZXNbaV0gPSB7a2V5OmssIHZhbHVlOltdLCBtaW46SW5maW5pdHksIG1heDotSW5maW5pdHl9XG4gICAgICAgIGZvciBkLCBpIGluIGRhdGFcbiAgICAgICAgICB0ID0gMFxuICAgICAgICAgIHh2ID0gaWYgdHlwZW9mIF94IGlzICdzdHJpbmcnIHRoZW4gZFtfeF0gZWxzZSBfeChkKVxuXG4gICAgICAgICAgZm9yIGwgaW4gcmVzXG4gICAgICAgICAgICB2ID0gK2RbbC5rZXldXG4gICAgICAgICAgICBsLnZhbHVlLnB1c2gge3g6eHYsIHZhbHVlOiB2LCBrZXk6bC5rZXl9XG4gICAgICAgICAgICBpZiBsLm1heCA8IHYgdGhlbiBsLm1heCA9IHZcbiAgICAgICAgICAgIGlmIGwubWluID4gdiB0aGVuIGwubWluID0gdlxuICAgICAgICAgICAgaWYgX21heCA8IHYgdGhlbiBfbWF4ID0gdlxuICAgICAgICAgICAgaWYgX21pbiA+IHYgdGhlbiBfbWluID0gdlxuICAgICAgICAgICAgaWYgX2NhbGNUb3RhbCB0aGVuIHQgKz0gK3ZcbiAgICAgICAgICBpZiBfY2FsY1RvdGFsXG4gICAgICAgICAgICAjdG90YWwudmFsdWUucHVzaCB7eDpkW194XSwgdmFsdWU6dCwga2V5OnRvdGFsLmtleX1cbiAgICAgICAgICAgIGlmIF90TWF4IDwgdCB0aGVuIF90TWF4ID0gdFxuICAgICAgICAgICAgaWYgX3RNaW4gPiB0IHRoZW4gX3RNaW4gPSB0XG4gICAgICAgIHJldHVybiB7bWluOl9taW4sIG1heDpfbWF4LCB0b3RhbE1pbjpfdE1pbix0b3RhbE1heDpfdE1heCwgZGF0YTpyZXN9XG4gICAgICByZXR1cm4gbWVcblxuXG5cbiAgICBtZS5yb3dzID0gKGRhdGEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcbiAgICAgICAgcmV0dXJuIGRhdGEubWFwKChkKSAtPiB7eDogZFtfeF0sIGxheWVyczogbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2tleTprLCB2YWx1ZTogZFtrXSwgeDpkW194XX0pfSlcbiAgICAgIHJldHVybiBtZVxuXG5cbiAgICByZXR1cm4gbWUiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3N2Z0ljb24nLCAoJGxvZykgLT5cbiAgIyMgaW5zZXJ0IHN2ZyBwYXRoIGludG8gaW50ZXJwb2xhdGVkIEhUTUwuIFJlcXVpcmVkIHByZXZlbnQgQW5ndWxhciBmcm9tIHRocm93aW5nIGVycm9yIChGaXggMjIpXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHRlbXBsYXRlOiAnPHN2ZyBuZy1zdHlsZT1cInN0eWxlXCI+PHBhdGg+PC9wYXRoPjwvc3ZnPidcbiAgICBzY29wZTpcbiAgICAgIHBhdGg6IFwiPVwiXG4gICAgICB3aWR0aDogXCJAXCJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHJzICkgLT5cbiAgICAgIHNjb3BlLnN0eWxlID0geyAgIyBmaXggSUUgcHJvYmxlbSB3aXRoIGludGVycG9sYXRpbmcgc3R5bGUgdmFsdWVzXG4gICAgICAgIGhlaWdodDogJzIwcHgnXG4gICAgICAgIHdpZHRoOiBzY29wZS53aWR0aCArICdweCdcbiAgICAgICAgJ3ZlcnRpY2FsLWFsaWduJzogJ21pZGRsZSdcbiAgICAgIH1cbiAgICAgIHNjb3BlLiR3YXRjaCAncGF0aCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIGQzLnNlbGVjdChlbGVtWzBdKS5zZWxlY3QoJ3BhdGgnKS5hdHRyKCdkJywgdmFsKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSg4LDgpXCIpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICd1dGlscycsICgkbG9nKSAtPlxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAZGlmZiA9IChhLGIsZGlyZWN0aW9uKSAtPlxuICAgIG5vdEluQiA9ICh2KSAtPlxuICAgICAgYi5pbmRleE9mKHYpIDwgMFxuXG4gICAgcmVzID0ge31cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCBhLmxlbmd0aFxuICAgICAgaWYgbm90SW5CKGFbaV0pXG4gICAgICAgIHJlc1thW2ldXSA9IHVuZGVmaW5lZFxuICAgICAgICBqID0gaSArIGRpcmVjdGlvblxuICAgICAgICB3aGlsZSAwIDw9IGogPCBhLmxlbmd0aFxuICAgICAgICAgIGlmIG5vdEluQihhW2pdKVxuICAgICAgICAgICAgaiArPSBkaXJlY3Rpb25cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXNbYVtpXV0gPSAgYVtqXVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgIGkrK1xuICAgIHJldHVybiByZXNcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgaWQgPSAwXG4gIEBnZXRJZCA9ICgpIC0+XG4gICAgcmV0dXJuICdDaGFydCcgKyBpZCsrXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIEBwYXJzZUxpc3QgPSAodmFsKSAtPlxuICAgIGlmIHZhbFxuICAgICAgbCA9IHZhbC50cmltKCkucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKS5zcGxpdCgnLCcpLm1hcCgoZCkgLT4gZC5yZXBsYWNlKC9eW1xcXCJ8J118W1xcXCJ8J10kL2csICcnKSlcbiAgICAgIHJldHVybiBpZiBsLmxlbmd0aCBpcyAxIHRoZW4gcmV0dXJuIGxbMF0gZWxzZSBsXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAbWVyZ2VEYXRhID0gKCkgLT5cblxuICAgIF9wcmV2RGF0YSA9IFtdXG4gICAgX2RhdGEgPSBbXVxuICAgIF9wcmV2SGFzaCA9IHt9XG4gICAgX2hhc2ggPSB7fVxuICAgIF9wcmV2Q29tbW9uID0gW11cbiAgICBfY29tbW9uID0gW11cbiAgICBfZmlyc3QgPSB1bmRlZmluZWRcbiAgICBfbGFzdCA9IHVuZGVmaW5lZFxuXG4gICAgX2tleSA9IChkKSAtPiBkICMgaWRlbnRpdHlcbiAgICBfbGF5ZXJLZXkgPSAoZCkgLT4gZFxuXG5cbiAgICBtZSA9IChkYXRhKSAtPlxuICAgICAgIyBzYXZlIF9kYXRhIHRvIF9wcmV2aW91c0RhdGEgYW5kIHVwZGF0ZSBfcHJldmlvdXNIYXNoO1xuICAgICAgX3ByZXZEYXRhID0gW11cbiAgICAgIF9wcmV2SGFzaCA9IHt9XG4gICAgICBmb3IgZCxpICBpbiBfZGF0YVxuICAgICAgICBfcHJldkRhdGFbaV0gPSBkO1xuICAgICAgICBfcHJldkhhc2hbX2tleShkKV0gPSBpXG5cbiAgICAgICNpdGVyYXRlIG92ZXIgZGF0YSBhbmQgZGV0ZXJtaW5lIHRoZSBjb21tb24gZWxlbWVudHNcbiAgICAgIF9wcmV2Q29tbW9uID0gW107XG4gICAgICBfY29tbW9uID0gW107XG4gICAgICBfaGFzaCA9IHt9O1xuICAgICAgX2RhdGEgPSBkYXRhO1xuXG4gICAgICBmb3IgZCxqIGluIF9kYXRhXG4gICAgICAgIGtleSA9IF9rZXkoZClcbiAgICAgICAgX2hhc2hba2V5XSA9IGpcbiAgICAgICAgaWYgX3ByZXZIYXNoLmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgICAjZWxlbWVudCBpcyBpbiBib3RoIGFycmF5c1xuICAgICAgICAgIF9wcmV2Q29tbW9uW19wcmV2SGFzaFtrZXldXSA9IHRydWVcbiAgICAgICAgICBfY29tbW9uW2pdID0gdHJ1ZVxuICAgICAgcmV0dXJuIG1lO1xuXG4gICAgbWUua2V5ID0gKGZuKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBfa2V5XG4gICAgICBfa2V5ID0gZm47XG4gICAgICByZXR1cm4gbWU7XG5cbiAgICBtZS5maXJzdCA9IChmaXJzdCkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2ZpcnN0XG4gICAgICBfZmlyc3QgPSBmaXJzdFxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXN0ID0gKGxhc3QpIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9sYXN0XG4gICAgICBfbGFzdCA9IGxhc3RcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkZWQgPSAoKSAtPlxuICAgICAgcmV0ID0gW107XG4gICAgICBmb3IgZCwgaSBpbiBfZGF0YVxuICAgICAgICBpZiAhX2NvbW1vbltpXSB0aGVuIHJldC5wdXNoKF9kKVxuICAgICAgcmV0dXJuIHJldFxuXG4gICAgbWUuZGVsZXRlZCA9ICgpIC0+XG4gICAgICByZXQgPSBbXTtcbiAgICAgIGZvciBwLCBpIGluIF9wcmV2RGF0YVxuICAgICAgICBpZiAhX3ByZXZDb21tb25baV0gdGhlbiByZXQucHVzaChfcHJldkRhdGFbaV0pXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5jdXJyZW50ID0gKGtleSkgLT5cbiAgICAgIHJldHVybiBfZGF0YVtfaGFzaFtrZXldXVxuXG4gICAgbWUucHJldiA9IChrZXkpIC0+XG4gICAgICByZXR1cm4gX3ByZXZEYXRhW19wcmV2SGFzaFtrZXldXVxuXG4gICAgbWUuYWRkZWRQcmVkID0gKGFkZGVkKSAtPlxuICAgICAgcHJlZElkeCA9IF9oYXNoW19rZXkoYWRkZWQpXVxuICAgICAgd2hpbGUgIV9jb21tb25bcHJlZElkeF1cbiAgICAgICAgaWYgcHJlZElkeC0tIDwgMCB0aGVuIHJldHVybiBfZmlyc3RcbiAgICAgIHJldHVybiBfcHJldkRhdGFbX3ByZXZIYXNoW19rZXkoX2RhdGFbcHJlZElkeF0pXV1cblxuICAgIG1lLmRlbGV0ZWRTdWNjID0gKGRlbGV0ZWQpIC0+XG4gICAgICBzdWNjSWR4ID0gX3ByZXZIYXNoW19rZXkoZGVsZXRlZCldXG4gICAgICB3aGlsZSAhX3ByZXZDb21tb25bc3VjY0lkeF1cbiAgICAgICAgaWYgc3VjY0lkeCsrID49IF9wcmV2RGF0YS5sZW5ndGggdGhlbiByZXR1cm4gX2xhc3RcbiAgICAgIHJldHVybiBfZGF0YVtfaGFzaFtfa2V5KF9wcmV2RGF0YVtzdWNjSWR4XSldXVxuXG4gICAgcmV0dXJuIG1lO1xuXG4gIEBtZXJnZVNlcmllcyA9ICAoYU9sZCwgYU5ldykgIC0+XG4gICAgaU9sZCA9IDBcbiAgICBpTmV3ID0gMFxuICAgIGxPbGRNYXggPSBhT2xkLmxlbmd0aCAtIDFcbiAgICBsTmV3TWF4ID0gYU5ldy5sZW5ndGggLSAxXG4gICAgbE1heCA9IE1hdGgubWF4KGxPbGRNYXgsIGxOZXdNYXgpXG4gICAgcmVzdWx0ID0gW11cblxuICAgIHdoaWxlIGlPbGQgPD0gbE9sZE1heCBhbmQgaU5ldyA8PSBsTmV3TWF4XG4gICAgICBpZiArYU9sZFtpT2xkXSBpcyArYU5ld1tpTmV3XVxuICAgICAgICByZXN1bHQucHVzaChbaU9sZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhT2xkW2lPbGRdXSk7XG4gICAgICAgICNjb25zb2xlLmxvZygnc2FtZScsIGFPbGRbaU9sZF0pO1xuICAgICAgICBpT2xkKys7XG4gICAgICAgIGlOZXcrKztcbiAgICAgIGVsc2UgaWYgK2FPbGRbaU9sZF0gPCArYU5ld1tpTmV3XVxuICAgICAgICAjIGFPbGRbaU9sZCBpcyBkZWxldGVkXG4gICAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLHVuZGVmaW5lZCwgYU9sZFtpT2xkXV0pXG4gICAgICAgICMgY29uc29sZS5sb2coJ2RlbGV0ZWQnLCBhT2xkW2lPbGRdKTtcbiAgICAgICAgaU9sZCsrXG4gICAgICBlbHNlXG4gICAgICAgICMgYU5ld1tpTmV3XSBpcyBhZGRlZFxuICAgICAgICByZXN1bHQucHVzaChbdW5kZWZpbmVkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFOZXdbaU5ld11dKVxuICAgICAgICAjIGNvbnNvbGUubG9nKCdhZGRlZCcsIGFOZXdbaU5ld10pO1xuICAgICAgICBpTmV3KytcblxuICAgIHdoaWxlIGlPbGQgPD0gbE9sZE1heFxuICAgICAgIyBpZiB0aGVyZSBpcyBtb3JlIG9sZCBpdGVtcywgbWFyayB0aGVtIGFzIGRlbGV0ZWRcbiAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLHVuZGVmaW5lZCwgYU9sZFtpT2xkXV0pO1xuICAgICAgIyBjb25zb2xlLmxvZygnZGVsZXRlZCcsIGFPbGRbaU9sZF0pO1xuICAgICAgaU9sZCsrO1xuXG4gICAgd2hpbGUgaU5ldyA8PSBsTmV3TWF4XG4gICAgICAjIGlmIHRoZXJlIGlzIG1vcmUgbmV3IGl0ZW1zLCBtYXJrIHRoZW0gYXMgYWRkZWRcbiAgICAgIHJlc3VsdC5wdXNoKFt1bmRlZmluZWQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU5ld1tpTmV3XV0pO1xuICAgICAgIyBjb25zb2xlLmxvZygnYWRkZWQnLCBhTmV3W2lOZXddKTtcbiAgICAgIGlOZXcrKztcblxuICAgIHJldHVybiByZXN1bHRcblxuICByZXR1cm4gQFxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9