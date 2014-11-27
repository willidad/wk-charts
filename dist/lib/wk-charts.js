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
                  y: y.layerValue(d, key),
                  data: d
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3drLWNoYXJ0cy9hcHAvY29uZmlnL3drQ2hhcnRDb25zdGFudHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL1Jlc2l6ZVNlbnNvci5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoLmNvZmZlZSIsInRlbXBsYXRlcy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9kMy5nZW8uem9vbS5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9jb250YWluZXIvY2hhcnQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9jb250YWluZXIvbGF5b3V0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL3NlbGVjdGlvbi5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2V4dGVuZGVkU2NhbGVzL3NjYWxlRXh0ZW50aW9uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvZmlsdGVycy90dEZvcm1hdC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYXJlYS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYXJlYVN0YWNrZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWFTdGFja2VkVmVydGljYWwuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWFWZXJ0aWNhbC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYmFyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9iYXJDbHVzdGVyZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2JhclN0YWNrZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2J1YmJsZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvY29sdW1uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9jb2x1bW5DbHVzdGVyZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2NvbHVtblN0YWNrZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2dhdWdlLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9nZW9NYXAuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2hpc3RvZ3JhbS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvbGluZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvbGluZVZlcnRpY2FsLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9waWUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL3NjYXR0ZXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL3NwaWRlci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9iZWhhdmlvckJydXNoLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9yU2VsZWN0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9yVG9vbHRpcC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9iZWhhdmlvcnMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvY2hhcnQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvY29udGFpbmVyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2xheW91dC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9sZWdlbmQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvc2NhbGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvc2NhbGVMaXN0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL2NvbG9yLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3NjYWxlVXRpbHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2hhcGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2l6ZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy94LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3hSYW5nZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy95LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3lSYW5nZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NlcnZpY2VzL3NlbGVjdGlvblNoYXJpbmcuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zZXJ2aWNlcy90aW1lci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3V0aWwvbGF5ZXJEYXRhLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9zdmdJY29uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC91dGlsaXRpZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsVUFBZixFQUEyQixFQUEzQixDQUFBLENBQUE7O0FBQUEsT0FFTyxDQUFDLE1BQVIsQ0FBZSxVQUFmLENBQTBCLENBQUMsUUFBM0IsQ0FBb0MsaUJBQXBDLEVBQXVELENBQ3JELFNBRHFELEVBRXJELFlBRnFELEVBR3JELFlBSHFELEVBSXJELGFBSnFELEVBS3JELGFBTHFELENBQXZELENBRkEsQ0FBQTs7QUFBQSxPQVVPLENBQUMsTUFBUixDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxRQUEzQixDQUFvQyxnQkFBcEMsRUFBc0Q7QUFBQSxFQUNwRCxHQUFBLEVBQUssRUFEK0M7QUFBQSxFQUVwRCxJQUFBLEVBQU0sRUFGOEM7QUFBQSxFQUdwRCxNQUFBLEVBQVEsRUFINEM7QUFBQSxFQUlwRCxLQUFBLEVBQU8sRUFKNkM7QUFBQSxFQUtwRCxlQUFBLEVBQWdCO0FBQUEsSUFBQyxJQUFBLEVB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SUFBQSxFQUZBLENBUEc7T0FOUDtJQUFBLENBUEE7QUF3QkEsV0FBTSxJQUFBLElBQVEsT0FBZCxHQUFBO0FBRUUsTUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFNLE1BQU4sRUFBaUIsSUFBSyxDQUFBLElBQUEsQ0FBdEIsQ0FBWixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUEsRUFGQSxDQUZGO0lBQUEsQ0F4QkE7QUE4QkEsV0FBTSxJQUFBLElBQVEsT0FBZCxHQUFBO0FBRUUsTUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLENBQUMsTUFBRCxFQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBVCxFQUFjLE9BQWQsQ0FBWixFQUFtQyxJQUFLLENBQUEsSUFBQSxDQUF4QyxDQUFaLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQSxFQUZBLENBRkY7SUFBQSxDQTlCQTtBQW9DQSxXQUFPLE1BQVAsQ0FyQ2M7RUFBQSxDQWxJaEIsQ0FBQTtBQXlLQSxTQUFPLElBQVAsQ0E3SzBDO0FBQUEsQ0FBNUMsQ0FBQSxDQUFBIiwiZmlsZSI6IndrLWNoYXJ0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcsIFtdKVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNPcmRpbmFsU2NhbGVzJywgW1xuICAnb3JkaW5hbCdcbiAgJ2NhdGVnb3J5MTAnXG4gICdjYXRlZ29yeTIwJ1xuICAnY2F0ZWdvcnkyMGInXG4gICdjYXRlZ29yeTIwYydcbl1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2QzQ2hhcnRNYXJnaW5zJywge1xuICB0b3A6IDEwXG4gIGxlZnQ6IDUwXG4gIGJvdHRvbTogNDBcbiAgcmlnaHQ6IDIwXG4gIHRvcEJvdHRvbU1hcmdpbjp7YXhpczoyNSwgbGFiZWw6MTh9XG4gIGxlZnRSaWdodE1hcmdpbjp7YXhpczo0MCwgbGFiZWw6MjB9XG4gIG1pbk1hcmdpbjo4XG4gIGRlZmF1bHQ6XG4gICAgdG9wOiA4XG4gICAgbGVmdDo4XG4gICAgYm90dG9tOjhcbiAgICByaWdodDoxMFxuICBheGlzOlxuICAgIHRvcDoyNVxuICAgIGJvdHRvbToyNVxuICAgIGxlZnQ6NDBcbiAgICByaWdodDo0MFxuICBsYWJlbDpcbiAgICB0b3A6MThcbiAgICBib3R0b206MThcbiAgICBsZWZ0OjIwXG4gICAgcmlnaHQ6MjBcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2QzU2hhcGVzJywgW1xuICAnY2lyY2xlJyxcbiAgJ2Nyb3NzJyxcbiAgJ3RyaWFuZ2xlLWRvd24nLFxuICAndHJpYW5nbGUtdXAnLFxuICAnc3F1YXJlJyxcbiAgJ2RpYW1vbmQnXG5dXG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdheGlzQ29uZmlnJywge1xuICBsYWJlbEZvbnRTaXplOiAnMS42ZW0nXG4gIHg6XG4gICAgYXhpc1Bvc2l0aW9uczogWyd0b3AnLCAnYm90dG9tJ11cbiAgICBheGlzT2Zmc2V0OiB7Ym90dG9tOidoZWlnaHQnfVxuICAgIGF4aXNQb3NpdGlvbkRlZmF1bHQ6ICdib3R0b20nXG4gICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBtZWFzdXJlOiAnd2lkdGgnXG4gICAgbGFiZWxQb3NpdGlvbnM6WydvdXRzaWRlJywgJ2luc2lkZSddXG4gICAgbGFiZWxQb3NpdGlvbkRlZmF1bHQ6ICdvdXRzaWRlJ1xuICAgIGxhYmVsT2Zmc2V0OlxuICAgICAgdG9wOiAnMWVtJ1xuICAgICAgYm90dG9tOiAnLTAuOGVtJ1xuICB5OlxuICAgIGF4aXNQb3NpdGlvbnM6IFsnbGVmdCcsICdyaWdodCddXG4gICAgYXhpc09mZnNldDoge3JpZ2h0Oid3aWR0aCd9XG4gICAgYXhpc1Bvc2l0aW9uRGVmYXVsdDogJ2xlZnQnXG4gICAgZGlyZWN0aW9uOiAndmVydGljYWwnXG4gICAgbWVhc3VyZTogJ2hlaWdodCdcbiAgICBsYWJlbFBvc2l0aW9uczpbJ291dHNpZGUnLCAnaW5zaWRlJ11cbiAgICBsYWJlbFBvc2l0aW9uRGVmYXVsdDogJ291dHNpZGUnXG4gICAgbGFiZWxPZmZzZXQ6XG4gICAgICBsZWZ0OiAnMS4yZW0nXG4gICAgICByaWdodDogJzEuMmVtJ1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNBbmltYXRpb24nLCB7XG4gIGR1cmF0aW9uOjUwMFxufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAndGVtcGxhdGVEaXInLCAndGVtcGxhdGVzLydcblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2Zvcm1hdERlZmF1bHRzJywge1xuICBkYXRlOiAnJWQuJW0uJVknXG4gIG51bWJlciA6ICAnLC4yZidcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2JhckNvbmZpZycsIHtcbiAgcGFkZGluZzogMC4xXG4gIG91dGVyUGFkZGluZzogMFxufVxuXG4iLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgZGltZW5zaW9uIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfEVsZW1lbnRzfGpRdWVyeX0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB0aGlzLlJlc2l6ZVNlbnNvciA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50UXVldWUoKSB7XG4gICAgICAgICAgICB0aGlzLnEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnEucHVzaChldik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBqID0gdGhpcy5xLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnFbaV0uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAgICAgICAgICogQHJldHVybnMge1N0cmluZ3xOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIHByb3ApIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmN1cnJlbnRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmN1cnJlbnRTdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuc3R5bGVbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzaXplZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgcmVzaXplZCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5jbGFzc05hbWUgPSAnd2stY2hhcnQtcmVzaXplLXNlbnNvcic7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBib3R0b206IDA7IG92ZXJmbG93OiBzY3JvbGw7IHotaW5kZXg6IC0xOyB2aXNpYmlsaXR5OiBoaWRkZW47JztcbiAgICAgICAgICAgIHZhciBzdHlsZUNoaWxkID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyc7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwid2stY2hhcnQtcmVzaXplLXNlbnNvci1leHBhbmRcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJ1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIndrLWNoYXJ0LXJlc2l6ZS1zZW5zb3Itc2hyaW5rXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICcgd2lkdGg6IDIwMCU7IGhlaWdodDogMjAwJVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50LnJlc2l6ZVNlbnNvcik7XG4gICAgICAgICAgICBpZiAoIXtmaXhlZDogMSwgYWJzb2x1dGU6IDF9W2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJyldKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZXhwYW5kID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBleHBhbmRDaGlsZCA9IGV4cGFuZC5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIHNocmluayA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMV07XG4gICAgICAgICAgICB2YXIgc2hyaW5rQ2hpbGQgPSBzaHJpbmsuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBsYXN0V2lkdGgsIGxhc3RIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS53aWR0aCA9IGV4cGFuZC5vZmZzZXRXaWR0aCArIDEwICsgJ3B4JztcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS5oZWlnaHQgPSBleHBhbmQub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxMZWZ0ID0gZXhwYW5kLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxUb3AgPSBleHBhbmQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxMZWZ0ID0gc2hyaW5rLnNjcm9sbFdpZHRoO1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxUb3AgPSBzaHJpbmsuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxhc3RXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgbGFzdEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgY2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmNhbGwoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgYWRkRXZlbnQgPSBmdW5jdGlvbihlbCwgbmFtZSwgY2IpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoJ29uJyArIG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkRXZlbnQoZXhwYW5kLCAnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiBsYXN0V2lkdGggfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiBsYXN0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYWRkRXZlbnQoc2hyaW5rLCAnc2Nyb2xsJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA8IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA8IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFwiW29iamVjdCBBcnJheV1cIiA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVsZW1lbnQpXG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBqUXVlcnkgJiYgZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSkgLy9qcXVlcnlcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIEVsZW1lbnRzICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50cykgLy9tb290b29sc1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgaSA9IDAsIGogPSBlbGVtZW50Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudFtpXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JydXNoJywgKCRsb2csIHNlbGVjdGlvblNoYXJpbmcsIGJlaGF2aW9yKSAtPlxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiBbJ15jaGFydCcsICdebGF5b3V0JywgJz94JywgJz95JywnP3JhbmdlWCcsICc/cmFuZ2VZJ11cbiAgICBzY29wZTpcbiAgICAgIGJydXNoRXh0ZW50OiAnPSdcbiAgICAgIHNlbGVjdGVkVmFsdWVzOiAnPSdcbiAgICAgIHNlbGVjdGVkRG9tYWluOiAnPSdcbiAgICAgIGNoYW5nZTogJyYnXG5cbiAgICBsaW5rOihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMV0/Lm1lXG4gICAgICB4ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICB5ID0gY29udHJvbGxlcnNbM10/Lm1lXG4gICAgICByYW5nZVggPSBjb250cm9sbGVyc1s0XT8ubWVcbiAgICAgIHJhbmdlWSA9IGNvbnRyb2xsZXJzWzVdPy5tZVxuICAgICAgeFNjYWxlID0gdW5kZWZpbmVkXG4gICAgICB5U2NhbGUgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RhYmxlcyA9IHVuZGVmaW5lZFxuICAgICAgX2JydXNoQXJlYVNlbGVjdGlvbiA9IHVuZGVmaW5lZFxuICAgICAgX2lzQXJlYUJydXNoID0gbm90IHggYW5kIG5vdCB5XG4gICAgICBfYnJ1c2hHcm91cCA9IHVuZGVmaW5lZFxuXG4gICAgICBicnVzaCA9IGNoYXJ0LmJlaGF2aW9yKCkuYnJ1c2hcbiAgICAgIGlmIG5vdCB4IGFuZCBub3QgeSBhbmQgbm90IHJhbmdlWCBhbmQgbm90IHJhbmdlWVxuICAgICAgICAjbGF5b3V0IGJydXNoLCBnZXQgeCBhbmQgeSBmcm9tIGxheW91dCBzY2FsZXNcbiAgICAgICAgc2NhbGVzID0gbGF5b3V0LnNjYWxlcygpLmdldFNjYWxlcyhbJ3gnLCAneSddKVxuICAgICAgICBicnVzaC54KHNjYWxlcy54KVxuICAgICAgICBicnVzaC55KHNjYWxlcy55KVxuICAgICAgZWxzZVxuICAgICAgICBicnVzaC54KHggb3IgcmFuZ2VYKVxuICAgICAgICBicnVzaC55KHkgb3IgcmFuZ2VZKVxuICAgICAgYnJ1c2guYWN0aXZlKHRydWUpXG5cbiAgICAgIGJydXNoLmV2ZW50cygpLm9uICdicnVzaCcsIChpZHhSYW5nZSwgdmFsdWVSYW5nZSwgZG9tYWluKSAtPlxuICAgICAgICBpZiBhdHRycy5icnVzaEV4dGVudFxuICAgICAgICAgIHNjb3BlLmJydXNoRXh0ZW50ID0gaWR4UmFuZ2VcbiAgICAgICAgaWYgYXR0cnMuc2VsZWN0ZWRWYWx1ZXNcbiAgICAgICAgICBzY29wZS5zZWxlY3RlZFZhbHVlcyA9IHZhbHVlUmFuZ2VcbiAgICAgICAgaWYgYXR0cnMuc2VsZWN0ZWREb21haW5cbiAgICAgICAgICBzY29wZS5zZWxlY3RlZERvbWFpbiA9IGRvbWFpblxuICAgICAgICBzY29wZS4kYXBwbHkoKVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXcuYnJ1c2gnLCAoZGF0YSkgLT5cbiAgICAgICAgYnJ1c2guZGF0YShkYXRhKVxuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdicnVzaCcsICh2YWwpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcodmFsKSBhbmQgdmFsLmxlbmd0aCA+IDBcbiAgICAgICAgICBicnVzaC5icnVzaEdyb3VwKHZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJydXNoLmJydXNoR3JvdXAodW5kZWZpbmVkKVxuICB9IixudWxsLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMsIEphc29uIERhdmllcywgaHR0cDovL3d3dy5qYXNvbmRhdmllcy5jb21cbi8vIFNlZSBMSUNFTlNFLnR4dCBmb3IgZGV0YWlscy5cbihmdW5jdGlvbigpIHtcblxudmFyIHJhZGlhbnMgPSBNYXRoLlBJIC8gMTgwLFxuICAgIGRlZ3JlZXMgPSAxODAgLyBNYXRoLlBJO1xuXG4vLyBUT0RPIG1ha2UgaW5jcmVtZW50YWwgcm90YXRlIG9wdGlvbmFsXG5cbmQzLmdlby56b29tID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwcm9qZWN0aW9uLFxuICAgICAgem9vbVBvaW50LFxuICAgICAgZXZlbnQgPSBkMy5kaXNwYXRjaChcInpvb21zdGFydFwiLCBcInpvb21cIiwgXCJ6b29tZW5kXCIpLFxuICAgICAgem9vbSA9IGQzLmJlaGF2aW9yLnpvb20oKVxuICAgICAgICAub24oXCJ6b29tc3RhcnRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIG1vdXNlMCA9IGQzLm1vdXNlKHRoaXMpLFxuICAgICAgICAgICAgICByb3RhdGUgPSBxdWF0ZXJuaW9uRnJvbUV1bGVyKHByb2plY3Rpb24ucm90YXRlKCkpLFxuICAgICAgICAgICAgICBwb2ludCA9IHBvc2l0aW9uKHByb2plY3Rpb24sIG1vdXNlMCk7XG4gICAgICAgICAgaWYgKHBvaW50KSB6b29tUG9pbnQgPSBwb2ludDtcblxuICAgICAgICAgIHpvb21Pbi5jYWxsKHpvb20sIFwiem9vbVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnNjYWxlKGQzLmV2ZW50LnNjYWxlKTtcbiAgICAgICAgICAgICAgICB2YXIgbW91c2UxID0gZDMubW91c2UodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGJldHdlZW4gPSByb3RhdGVCZXR3ZWVuKHpvb21Qb2ludCwgcG9zaXRpb24ocHJvamVjdGlvbiwgbW91c2UxKSk7XG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbi5yb3RhdGUoZXVsZXJGcm9tUXVhdGVybmlvbihyb3RhdGUgPSBiZXR3ZWVuXG4gICAgICAgICAgICAgICAgICAgID8gbXVsdGlwbHkocm90YXRlLCBiZXR3ZWVuKVxuICAgICAgICAgICAgICAgICAgICA6IG11bHRpcGx5KGJhbmsocHJvamVjdGlvbiwgbW91c2UwLCBtb3VzZTEpLCByb3RhdGUpKSk7XG4gICAgICAgICAgICAgICAgbW91c2UwID0gbW91c2UxO1xuICAgICAgICAgICAgICAgIGV2ZW50Lnpvb20uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgZXZlbnQuem9vbXN0YXJ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcInpvb21lbmRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgem9vbU9uLmNhbGwoem9vbSwgXCJ6b29tXCIsIG51bGwpO1xuICAgICAgICAgIGV2ZW50Lnpvb21lbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSksXG4gICAgICB6b29tT24gPSB6b29tLm9uO1xuXG4gIHpvb20ucHJvamVjdGlvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IHpvb20uc2NhbGUoKHByb2plY3Rpb24gPSBfKS5zY2FsZSgpKSA6IHByb2plY3Rpb247XG4gIH07XG5cbiAgcmV0dXJuIGQzLnJlYmluZCh6b29tLCBldmVudCwgXCJvblwiKTtcbn07XG5cbmZ1bmN0aW9uIGJhbmsocHJvamVjdGlvbiwgcDAsIHAxKSB7XG4gIHZhciB0ID0gcHJvamVjdGlvbi50cmFuc2xhdGUoKSxcbiAgICAgIGFuZ2xlID0gTWF0aC5hdGFuMihwMFsxXSAtIHRbMV0sIHAwWzBdIC0gdFswXSkgLSBNYXRoLmF0YW4yKHAxWzFdIC0gdFsxXSwgcDFbMF0gLSB0WzBdKTtcbiAgcmV0dXJuIFtNYXRoLmNvcyhhbmdsZSAvIDIpLCAwLCAwLCBNYXRoLnNpbihhbmdsZSAvIDIpXTtcbn1cblxuZnVuY3Rpb24gcG9zaXRpb24ocHJvamVjdGlvbiwgcG9pbnQpIHtcbiAgdmFyIHQgPSBwcm9qZWN0aW9uLnRyYW5zbGF0ZSgpLFxuICAgICAgc3BoZXJpY2FsID0gcHJvamVjdGlvbi5pbnZlcnQocG9pbnQpO1xuICByZXR1cm4gc3BoZXJpY2FsICYmIGlzRmluaXRlKHNwaGVyaWNhbFswXSkgJiYgaXNGaW5pdGUoc3BoZXJpY2FsWzFdKSAmJiBjYXJ0ZXNpYW4oc3BoZXJpY2FsKTtcbn1cblxuZnVuY3Rpb24gcXVhdGVybmlvbkZyb21FdWxlcihldWxlcikge1xuICB2YXIgzrsgPSAuNSAqIGV1bGVyWzBdICogcmFkaWFucyxcbiAgICAgIM+GID0gLjUgKiBldWxlclsxXSAqIHJhZGlhbnMsXG4gICAgICDOsyA9IC41ICogZXVsZXJbMl0gKiByYWRpYW5zLFxuICAgICAgc2luzrsgPSBNYXRoLnNpbijOuyksIGNvc867ID0gTWF0aC5jb3MozrspLFxuICAgICAgc2luz4YgPSBNYXRoLnNpbijPhiksIGNvc8+GID0gTWF0aC5jb3Moz4YpLFxuICAgICAgc2luzrMgPSBNYXRoLnNpbijOsyksIGNvc86zID0gTWF0aC5jb3MozrMpO1xuICByZXR1cm4gW1xuICAgIGNvc867ICogY29zz4YgKiBjb3POsyArIHNpbs67ICogc2luz4YgKiBzaW7OsyxcbiAgICBzaW7OuyAqIGNvc8+GICogY29zzrMgLSBjb3POuyAqIHNpbs+GICogc2luzrMsXG4gICAgY29zzrsgKiBzaW7PhiAqIGNvc86zICsgc2luzrsgKiBjb3PPhiAqIHNpbs6zLFxuICAgIGNvc867ICogY29zz4YgKiBzaW7OsyAtIHNpbs67ICogc2luz4YgKiBjb3POs1xuICBdO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG4gIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM10sXG4gICAgICBiMCA9IGJbMF0sIGIxID0gYlsxXSwgYjIgPSBiWzJdLCBiMyA9IGJbM107XG4gIHJldHVybiBbXG4gICAgYTAgKiBiMCAtIGExICogYjEgLSBhMiAqIGIyIC0gYTMgKiBiMyxcbiAgICBhMCAqIGIxICsgYTEgKiBiMCArIGEyICogYjMgLSBhMyAqIGIyLFxuICAgIGEwICogYjIgLSBhMSAqIGIzICsgYTIgKiBiMCArIGEzICogYjEsXG4gICAgYTAgKiBiMyArIGExICogYjIgLSBhMiAqIGIxICsgYTMgKiBiMFxuICBdO1xufVxuXG5mdW5jdGlvbiByb3RhdGVCZXR3ZWVuKGEsIGIpIHtcbiAgaWYgKCFhIHx8ICFiKSByZXR1cm47XG4gIHZhciBheGlzID0gY3Jvc3MoYSwgYiksXG4gICAgICBub3JtID0gTWF0aC5zcXJ0KGRvdChheGlzLCBheGlzKSksXG4gICAgICBoYWxmzrMgPSAuNSAqIE1hdGguYWNvcyhNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZG90KGEsIGIpKSkpLFxuICAgICAgayA9IE1hdGguc2luKGhhbGbOsykgLyBub3JtO1xuICByZXR1cm4gbm9ybSAmJiBbTWF0aC5jb3MoaGFsZs6zKSwgYXhpc1syXSAqIGssIC1heGlzWzFdICogaywgYXhpc1swXSAqIGtdO1xufVxuXG5mdW5jdGlvbiBldWxlckZyb21RdWF0ZXJuaW9uKHEpIHtcbiAgcmV0dXJuIFtcbiAgICBNYXRoLmF0YW4yKDIgKiAocVswXSAqIHFbMV0gKyBxWzJdICogcVszXSksIDEgLSAyICogKHFbMV0gKiBxWzFdICsgcVsyXSAqIHFbMl0pKSAqIGRlZ3JlZXMsXG4gICAgTWF0aC5hc2luKE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCAyICogKHFbMF0gKiBxWzJdIC0gcVszXSAqIHFbMV0pKSkpICogZGVncmVlcyxcbiAgICBNYXRoLmF0YW4yKDIgKiAocVswXSAqIHFbM10gKyBxWzFdICogcVsyXSksIDEgLSAyICogKHFbMl0gKiBxWzJdICsgcVszXSAqIHFbM10pKSAqIGRlZ3JlZXNcbiAgXTtcbn1cblxuZnVuY3Rpb24gY2FydGVzaWFuKHNwaGVyaWNhbCkge1xuICB2YXIgzrsgPSBzcGhlcmljYWxbMF0gKiByYWRpYW5zLFxuICAgICAgz4YgPSBzcGhlcmljYWxbMV0gKiByYWRpYW5zLFxuICAgICAgY29zz4YgPSBNYXRoLmNvcyjPhik7XG4gIHJldHVybiBbXG4gICAgY29zz4YgKiBNYXRoLmNvcyjOuyksXG4gICAgY29zz4YgKiBNYXRoLnNpbijOuyksXG4gICAgTWF0aC5zaW4oz4YpXG4gIF07XG59XG5cbmZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gYS5sZW5ndGgsIHMgPSAwOyBpIDwgbjsgKytpKSBzICs9IGFbaV0gKiBiW2ldO1xuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gY3Jvc3MoYSwgYikge1xuICByZXR1cm4gW1xuICAgIGFbMV0gKiBiWzJdIC0gYVsyXSAqIGJbMV0sXG4gICAgYVsyXSAqIGJbMF0gLSBhWzBdICogYlsyXSxcbiAgICBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdXG4gIF07XG59XG5cbn0pKCk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2JydXNoZWQnLCAoJGxvZyxzZWxlY3Rpb25TaGFyaW5nLCB0aW1pbmcpIC0+XG4gIHNCcnVzaENudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogWydeY2hhcnQnLCAnP15sYXlvdXQnLCAnP3gnLCAnP3knXVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMV0/Lm1lXG4gICAgICB4ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICB5ID0gY29udHJvbGxlcnNbM10/Lm1lXG5cbiAgICAgIGF4aXMgPSB4IG9yIHlcbiAgICAgIF9icnVzaEdyb3VwID0gdW5kZWZpbmVkXG5cbiAgICAgIGJydXNoZXIgPSAoZXh0ZW50KSAtPlxuICAgICAgICB0aW1pbmcuc3RhcnQoXCJicnVzaGVyI3theGlzLmlkKCl9XCIpXG4gICAgICAgIGlmIG5vdCBheGlzIHRoZW4gcmV0dXJuXG4gICAgICAgICNheGlzXG4gICAgICAgIGF4aXMuZG9tYWluKGV4dGVudCkuc2NhbGUoKS5kb21haW4oZXh0ZW50KVxuICAgICAgICBmb3IgbCBpbiBjaGFydC5sYXlvdXRzKCkgd2hlbiBsLnNjYWxlcygpLmhhc1NjYWxlKGF4aXMpICNuZWVkIHRvIGRvIGl0IHRoaXMgd2F5IHRvIGVuc3VyZSB0aGUgcmlnaHQgYXhpcyBpcyBjaG9zZW4gaW4gY2FzZSBvZiBzZXZlcmFsIGxheW91dHMgaW4gYSBjb250YWluZXJcbiAgICAgICAgICBsLmxpZmVDeWNsZSgpLmJydXNoKGF4aXMsIHRydWUpICNubyBhbmltYXRpb25cbiAgICAgICAgdGltaW5nLnN0b3AoXCJicnVzaGVyI3theGlzLmlkKCl9XCIpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdicnVzaGVkJywgKHZhbCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyh2YWwpIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIF9icnVzaEdyb3VwID0gdmFsXG4gICAgICAgICAgc2VsZWN0aW9uU2hhcmluZy5yZWdpc3RlciBfYnJ1c2hHcm91cCwgYnJ1c2hlclxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgc2NvcGUuJG9uICckZGVzdHJveScsICgpIC0+XG4gICAgICAgIHNlbGVjdGlvblNoYXJpbmcudW5yZWdpc3RlciBfYnJ1c2hHcm91cCwgYnJ1c2hlclxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NoYXJ0JywgKCRsb2csIGNoYXJ0LCAkZmlsdGVyKSAtPlxuICBjaGFydENudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogJ2NoYXJ0J1xuICAgIHNjb3BlOlxuICAgICAgZGF0YTogJz0nXG4gICAgICBmaWx0ZXI6ICc9J1xuICAgIGNvbnRyb2xsZXI6ICgpIC0+XG4gICAgICB0aGlzLm1lID0gY2hhcnQoKVxuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIG1lID0gY29udHJvbGxlci5tZVxuXG4gICAgICBkZWVwV2F0Y2ggPSBmYWxzZVxuICAgICAgd2F0Y2hlclJlbW92ZUZuID0gdW5kZWZpbmVkXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgICBfZmlsdGVyID0gdW5kZWZpbmVkXG5cbiAgICAgIG1lLmNvbnRhaW5lcigpLmVsZW1lbnQoZWxlbWVudFswXSlcblxuICAgICAgbWUubGlmZUN5Y2xlKCkuY29uZmlndXJlKClcblxuICAgICAgbWUubGlmZUN5Y2xlKCkub24gJ3Njb3BlQXBwbHknLCAoKSAtPlxuICAgICAgICBzY29wZS4kYXBwbHkoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndG9vbHRpcHMnLCAodmFsKSAtPlxuICAgICAgICBtZS50b29sVGlwVGVtcGxhdGUoJycpXG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZCBhbmQgKHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnKVxuICAgICAgICAgIG1lLnNob3dUb29sdGlwKHRydWUpXG4gICAgICAgIGVsc2UgaWYgdmFsLmxlbmd0aCA+IDAgYW5kIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICBtZS50b29sVGlwVGVtcGxhdGUodmFsKVxuICAgICAgICAgIG1lLnNob3dUb29sdGlwKHRydWUpXG4gICAgICAgIGVsc2Ugc2hvd1Rvb2xUaXAoZmFsc2UpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdhbmltYXRpb25EdXJhdGlvbicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgXy5pc051bWJlcigrdmFsKSBhbmQgK3ZhbCA+PSAwXG4gICAgICAgICAgbWUuYW5pbWF0aW9uRHVyYXRpb24odmFsKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndGl0bGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBtZS50aXRsZSh2YWwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS50aXRsZSh1bmRlZmluZWQpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdzdWJ0aXRsZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIG1lLnN1YlRpdGxlKHZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnN1YlRpdGxlKHVuZGVmaW5lZClcblxuICAgICAgc2NvcGUuJHdhdGNoICdmaWx0ZXInLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBfZmlsdGVyID0gdmFsICMgc2NvcGUuJGV2YWwodmFsKVxuICAgICAgICAgIGlmIF9kYXRhXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKCRmaWx0ZXIoJ2ZpbHRlcicpKF9kYXRhLCBfZmlsdGVyKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9maWx0ZXIgPSB1bmRlZmluZWRcbiAgICAgICAgICBpZiBfZGF0YVxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YShfZGF0YSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RlZXBXYXRjaCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZCBhbmQgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgIGRlZXBXYXRjaCA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlZXBXYXRjaCA9IGZhbHNlXG4gICAgICAgIGlmIHdhdGNoZXJSZW1vdmVGblxuICAgICAgICAgIHdhdGNoZXJSZW1vdmVGbigpXG4gICAgICAgIHdhdGNoZXJSZW1vdmVGbiA9IHNjb3BlLiR3YXRjaCAnZGF0YScsIGRhdGFXYXRjaEZuLCBkZWVwV2F0Y2hcblxuICAgICAgZGF0YVdhdGNoRm4gPSAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBfZGF0YSA9IHZhbFxuICAgICAgICAgIGlmIF8uaXNBcnJheShfZGF0YSkgYW5kIF9kYXRhLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuXG4gICAgICAgICAgaWYgX2ZpbHRlclxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YSgkZmlsdGVyKCdmaWx0ZXInKSh2YWwsIF9maWx0ZXIpKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEodmFsKVxuXG4gICAgICB3YXRjaGVyUmVtb3ZlRm4gPSBzY29wZS4kd2F0Y2ggJ2RhdGEnLCBkYXRhV2F0Y2hGbiwgZGVlcFdhdGNoXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2xheW91dCcsICgkbG9nLCBsYXlvdXQsIGNvbnRhaW5lcikgLT5cbiAgbGF5b3V0Q250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnXG4gICAgcmVxdWlyZTogWydsYXlvdXQnLCdeY2hhcnQnXVxuXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IGxheW91dCgpXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBsYXlvdXQgaWQ6JywgbWUuaWQoKSwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcbiAgICAgIGNoYXJ0LmFkZExheW91dChtZSlcbiAgICAgIGNoYXJ0LmNvbnRhaW5lcigpLmFkZExheW91dChtZSlcbiAgICAgIG1lLmNvbnRhaW5lcihjaGFydC5jb250YWluZXIoKSlcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzZWxlY3Rpb24nLCAoJGxvZykgLT5cbiAgb2JqSWQgPSAwXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgc2NvcGU6XG4gICAgICBzZWxlY3RlZERvbWFpbjogJz0nXG4gICAgcmVxdWlyZTogJ2xheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlLnNlbGVjdGlvbicsIC0+XG5cbiAgICAgICAgX3NlbGVjdGlvbiA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF9zZWxlY3Rpb24uYWN0aXZlKHRydWUpXG4gICAgICAgIF9zZWxlY3Rpb24ub24gJ3NlbGVjdGVkJywgKHNlbGVjdGVkT2JqZWN0cykgLT5cbiAgICAgICAgICBzY29wZS5zZWxlY3RlZERvbWFpbiA9IHNlbGVjdGVkT2JqZWN0c1xuICAgICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnByb3ZpZGVyICd3a0NoYXJ0U2NhbGVzJywgKCkgLT5cblxuICBfY3VzdG9tQ29sb3JzID0gWydyZWQnLCAnZ3JlZW4nLCdibHVlJywneWVsbG93Jywnb3JhbmdlJ11cblxuICBoYXNoZWQgPSAoKSAtPlxuICAgIGQzU2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblxuICAgIF9oYXNoRm4gPSAodmFsdWUpIC0+XG4gICAgICBoYXNoID0gMDtcbiAgICAgIG0gPSBkM1NjYWxlLnJhbmdlKCkubGVuZ3RoIC0gMVxuICAgICAgZm9yIGkgaW4gWzAgLi4gdmFsdWUubGVuZ3RoXVxuICAgICAgICBoYXNoID0gKDMxICogaGFzaCArIHZhbHVlLmNoYXJBdChpKSkgJSBtO1xuXG4gICAgbWUgPSAodmFsdWUpIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIG1lXG4gICAgICBkM1NjYWxlKF9oYXNoRm4odmFsdWUpKVxuXG4gICAgbWUucmFuZ2UgPSAocmFuZ2UpIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIGQzU2NhbGUucmFuZ2UoKVxuICAgICAgZDNTY2FsZS5kb21haW4oZDMucmFuZ2UocmFuZ2UubGVuZ3RoKSlcbiAgICAgIGQzU2NhbGUucmFuZ2UocmFuZ2UpXG5cbiAgICBtZS5yYW5nZVBvaW50ID0gZDNTY2FsZS5yYW5nZVBvaW50c1xuICAgIG1lLnJhbmdlQmFuZHMgPSBkM1NjYWxlLnJhbmdlQmFuZHNcbiAgICBtZS5yYW5nZVJvdW5kQmFuZHMgPSBkM1NjYWxlLnJhbmdlUm91bmRCYW5kc1xuICAgIG1lLnJhbmdlQmFuZCA9IGQzU2NhbGUucmFuZ2VCYW5kXG4gICAgbWUucmFuZ2VFeHRlbnQgPSBkM1NjYWxlLnJhbmdlRXh0ZW50XG5cbiAgICBtZS5oYXNoID0gKGZuKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBfaGFzaEZuXG4gICAgICBfaGFzaEZuID0gZm5cbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgY2F0ZWdvcnlDb2xvcnMgPSAoKSAtPiByZXR1cm4gZDMuc2NhbGUub3JkaW5hbCgpLnJhbmdlKF9jdXN0b21Db2xvcnMpXG5cbiAgY2F0ZWdvcnlDb2xvcnNIYXNoZWQgPSAoKSAtPiByZXR1cm4gaGFzaGVkKCkucmFuZ2UoX2N1c3RvbUNvbG9ycylcblxuICB0aGlzLmNvbG9ycyA9IChjb2xvcnMpIC0+XG4gICAgX2N1c3RvbUNvbG9ycyA9IGNvbG9yc1xuXG4gIHRoaXMuJGdldCA9IFsnJGxvZycsKCRsb2cpIC0+XG4gICAgcmV0dXJuIHtoYXNoZWQ6aGFzaGVkLGNvbG9yczpjYXRlZ29yeUNvbG9ycywgY29sb3JzSGFzaGVkOiBjYXRlZ29yeUNvbG9yc0hhc2hlZH1cbiAgXVxuXG4gIHJldHVybiB0aGlzIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmlsdGVyICd0dEZvcm1hdCcsICgkbG9nLGZvcm1hdERlZmF1bHRzKSAtPlxuICByZXR1cm4gKHZhbHVlLCBmb3JtYXQpIC0+XG4gICAgaWYgdHlwZW9mIHZhbHVlIGlzICdvYmplY3QnIGFuZCB2YWx1ZS5nZXRVVENEYXRlXG4gICAgICBkZiA9IGQzLnRpbWUuZm9ybWF0KGZvcm1hdERlZmF1bHRzLmRhdGUpXG4gICAgICByZXR1cm4gZGYodmFsdWUpXG4gICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInIG9yIG5vdCBpc05hTigrdmFsdWUpXG4gICAgICBkZiA9IGQzLmZvcm1hdChmb3JtYXREZWZhdWx0cy5udW1iZXIpXG4gICAgICByZXR1cm4gZGYoK3ZhbHVlKVxuICAgIHJldHVybiB2YWx1ZSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYXJlYScsICgkbG9nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgX2xheW91dCA9IFtdXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgb2Zmc2V0ID0gMFxuICAgICAgX2lkID0gJ2xpbmUnICsgbGluZUNudHIrK1xuICAgICAgYXJlYSA9IHVuZGVmaW5lZFxuXG4gICAgICAjLS0tIFRvb2x0aXAgaGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX2xheW91dC5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZVtpZHhdLnkpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueClcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N5JywgKGQpIC0+IF9zY2FsZUxpc3QueS5zY2FsZSgpKGQudmFsdWVbaWR4XS55KSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfc2NhbGVMaXN0Lnguc2NhbGUoKShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueCkgKyBvZmZzZXR9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBfbGF5b3V0ID0gbGF5ZXJLZXlzLm1hcCgoa2V5KSA9PiB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpkYXRhLm1hcCgoZCktPiB7eDp4LnZhbHVlKGQpLHk6eS5sYXllclZhbHVlKGQsIGtleSksIGRhdGE6ZH0pfSlcblxuICAgICAgICBvZmZzZXQgPSBpZiB4LmlzT3JkaW5hbCgpIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAueCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAueTAoKGQpIC0+ICB5LnNjYWxlKCkoZC55KSlcbiAgICAgICAgLnkxKChkKSAtPiAgeS5zY2FsZSgpKDApKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmcm9tJywgXCJ0cmFuc2xhdGUoI3tvZmZzZXR9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC52YWx1ZSkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgYnJ1c2ggPSAoZGF0YSwgb3B0aW9ucyx4LHksY29sb3IpIC0+XG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgIGxheWVycy5zZWxlY3QoJy53ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPlxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgYXJlYShkLnZhbHVlKSlcblxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC54KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGJydXNoXG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcblxuICB9XG5cbiAgI1RPRE8gaW1wbGVtZW50IGVudGVyIC8gZXhpdCBhbmltYXRpb25zIGxpa2UgaW4gbGluZSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYXJlYVN0YWNrZWQnLCAoJGxvZywgdXRpbHMpIC0+XG4gIHN0YWNrZWRBcmVhQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKVxuICAgICAgb2Zmc2V0ID0gJ3plcm8nXG4gICAgICBsYXllcnMgPSBudWxsXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgbGF5ZXJLZXlzID0gW11cbiAgICAgIGxheWVyRGF0YSA9IFtdXG4gICAgICBsYXlvdXROZXcgPSBbXVxuICAgICAgbGF5b3V0T2xkID0gW11cbiAgICAgIGxheWVyS2V5c09sZCA9IFtdXG4gICAgICBhcmVhID0gdW5kZWZpbmVkXG4gICAgICBkZWxldGVkU3VjYyA9IHt9XG4gICAgICBhZGRlZFByZWQgPSB7fVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgc2NhbGVZID0gdW5kZWZpbmVkXG4gICAgICBvZmZzID0gMFxuICAgICAgX2lkID0gJ2FyZWEnICsgc3RhY2tlZEFyZWFDbnRyKytcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IGxheWVyRGF0YS5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC5sYXllcltpZHhdLnl5KSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGxheWVyRGF0YVswXS5sYXllcltpZHhdLngpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEobGF5ZXJEYXRhLCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N5JywgKGQpIC0+IHNjYWxlWShkLmxheWVyW2lkeF0ueSArIGQubGF5ZXJbaWR4XS55MCkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfc2NhbGVMaXN0Lnguc2NhbGUoKShsYXllckRhdGFbMF0ubGF5ZXJbaWR4XS54KStvZmZzfSlcIilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZ2V0TGF5ZXJCeUtleSA9IChrZXksIGxheW91dCkgLT5cbiAgICAgICAgZm9yIGwgaW4gbGF5b3V0XG4gICAgICAgICAgaWYgbC5rZXkgaXMga2V5XG4gICAgICAgICAgICByZXR1cm4gbFxuXG4gICAgICBsYXlvdXQgPSBzdGFjay52YWx1ZXMoKGQpLT5kLmxheWVyKS55KChkKSAtPiBkLnl5KVxuXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIyNcbiAgICAgIHByZXBEYXRhID0gKHgseSxjb2xvcikgLT5cblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueSArIHAueTB9KSl9KVxuICAgICAgICBsYXllcktleXNPbGQgPSBsYXllcktleXNcblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhAKVxuICAgICAgICBsYXllckRhdGEgPSBsYXllcktleXMubWFwKChrKSA9PiB7a2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBsYXllcjogQG1hcCgoZCkgLT4ge3g6IHgudmFsdWUoZCksIHl5OiAreS5sYXllclZhbHVlKGQsayksIHkwOiAwfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgICNsYXlvdXROZXcgPSBsYXlvdXQobGF5ZXJEYXRhKVxuXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG4gICAgICAjIyNcbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgQXJlYSBDaGFydFwiXG5cblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBkZWxldGVkU3VjYyA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzT2xkLCBsYXllcktleXMsIDEpXG4gICAgICAgIGFkZGVkUHJlZCA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzLCBsYXllcktleXNPbGQsIC0xKVxuXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBkYXRhLm1hcCgoZCkgLT4ge3g6IHgudmFsdWUoZCksIHl5OiAreS5sYXllclZhbHVlKGQsayksIHkwOiAwLCBkYXRhOmR9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgbGF5b3V0TmV3ID0gbGF5b3V0KGxheWVyRGF0YSlcblxuICAgICAgICBvZmZzID0gaWYgeC5pc09yZGluYWwoKSB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGlmIG9mZnNldCBpcyAnZXhwYW5kJ1xuICAgICAgICAgIHNjYWxlWSA9IHkuc2NhbGUoKS5jb3B5KClcbiAgICAgICAgICBzY2FsZVkuZG9tYWluKFswLCAxXSlcbiAgICAgICAgZWxzZSBzY2FsZVkgPSB5LnNjYWxlKClcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAgIC54KChkKSAtPiAgeC5zY2FsZSgpKGQueCkpXG4gICAgICAgICAgLnkwKChkKSAtPiAgc2NhbGVZKGQueTAgKyBkLnkpKVxuICAgICAgICAgIC55MSgoZCkgLT4gIHNjYWxlWShkLnkwKSlcblxuICAgICAgICBsYXllcnMgPSBsYXllcnNcbiAgICAgICAgICAuZGF0YShsYXlvdXROZXcsIChkKSAtPiBkLmtleSlcblxuICAgICAgICBpZiBsYXlvdXRPbGQubGVuZ3RoIGlzIDBcbiAgICAgICAgICBsYXllcnMuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKS5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGlmIGFkZGVkUHJlZFtkLmtleV0gdGhlbiBnZXRMYXllckJ5S2V5KGFkZGVkUHJlZFtkLmtleV0sIGxheW91dE9sZCkucGF0aCBlbHNlIGFyZWEoZC5sYXllci5tYXAoKHApIC0+ICB7eDogcC54LCB5OiAwLCB5MDogMH0pKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcbiAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b2Zmc30pXCIpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYShkLmxheWVyKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcblxuXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIHN1Y2MgPSBkZWxldGVkU3VjY1tkLmtleV1cbiAgICAgICAgICAgIGlmIHN1Y2MgdGhlbiBhcmVhKGdldExheWVyQnlLZXkoc3VjYywgbGF5b3V0TmV3KS5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkwfSkpIGVsc2UgYXJlYShsYXlvdXROZXdbbGF5b3V0TmV3Lmxlbmd0aCAtIDFdLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueTAgKyBwLnl9KSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgbGF5b3V0T2xkID0gbGF5b3V0TmV3Lm1hcCgoZCkgLT4ge2tleTogZC5rZXksIHBhdGg6IGFyZWEoZC5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkgKyBwLnkwfSkpfSlcbiAgICAgICAgbGF5ZXJLZXlzT2xkID0gbGF5ZXJLZXlzXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueClcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXJlYVN0YWNrZWQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaW4gWyd6ZXJvJywgJ3NpbGhvdWV0dGUnLCAnZXhwYW5kJywgJ3dpZ2dsZSddXG4gICAgICAgICAgb2Zmc2V0ID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvZmZzZXQgPSBcInplcm9cIlxuICAgICAgICBzdGFjay5vZmZzZXQob2Zmc2V0KVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9XG5cbiNUT0RPIGltcGxlbWVudCBlbnRlciAvIGV4aXQgYW5pbWF0aW9ucyBsaWtlIGluIGxpbmVcbiNUT0RPIGltcGxlbWVudCBleHRlcm5hbCBicnVzaGluZyBvcHRpbWl6YXRpb25zIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhU3RhY2tlZFZlcnRpY2FsJywgKCRsb2csIHV0aWxzKSAtPlxuICBhcmVhU3RhY2tlZFZlcnRDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpXG4gICAgICBvZmZzZXQgPSAnemVybydcbiAgICAgIGxheWVycyA9IG51bGxcbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgbGF5ZXJEYXRhID0gW11cbiAgICAgIGxheW91dE5ldyA9IFtdXG4gICAgICBsYXlvdXRPbGQgPSBbXVxuICAgICAgbGF5ZXJLZXlzT2xkID0gW11cbiAgICAgIGFyZWEgPSB1bmRlZmluZWRcbiAgICAgIGRlbGV0ZWRTdWNjID0ge31cbiAgICAgIGFkZGVkUHJlZCA9IHt9XG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBzY2FsZVggPSB1bmRlZmluZWRcbiAgICAgIG9mZnMgPSAwXG4gICAgICBfaWQgPSAnYXJlYS1zdGFja2VkLXZlcnQnICsgYXJlYVN0YWNrZWRWZXJ0Q250cisrXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBsYXllckRhdGEubWFwKChsKSAtPiB7bmFtZTpsLmtleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwubGF5ZXJbaWR4XS54eCksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsYXllckRhdGFbMF0ubGF5ZXJbaWR4XS55eSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShsYXllckRhdGEsIChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJyxcIndrLWNoYXJ0LW1hcmtlci0je19pZH1cIilcbiAgICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKS0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3gnLCAoZCkgLT4gc2NhbGVYKGQubGF5ZXJbaWR4XS55ICsgZC5sYXllcltpZHhdLnkwKSkgICMgd2VpcmQhISEgaG93ZXZlciwgdGhlIGRhdGEgaXMgZm9yIGEgaG9yaXpvbnRhbCBjaGFydCB3aGljaCBnZXRzIHRyYW5zZm9ybWVkXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKGxheWVyRGF0YVswXS5sYXllcltpZHhdLnl5KStvZmZzfSlcIilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZ2V0TGF5ZXJCeUtleSA9IChrZXksIGxheW91dCkgLT5cbiAgICAgICAgZm9yIGwgaW4gbGF5b3V0XG4gICAgICAgICAgaWYgbC5rZXkgaXMga2V5XG4gICAgICAgICAgICByZXR1cm4gbFxuXG4gICAgICBsYXlvdXQgPSBzdGFjay52YWx1ZXMoKGQpLT5kLmxheWVyKS55KChkKSAtPiBkLnh4KVxuXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIyNcbiAgICAgIHByZXBEYXRhID0gKHgseSxjb2xvcikgLT5cblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueSArIHAueTB9KSl9KVxuICAgICAgICBsYXllcktleXNPbGQgPSBsYXllcktleXNcblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhAKVxuICAgICAgICBsYXllckRhdGEgPSBsYXllcktleXMubWFwKChrKSA9PiB7a2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBsYXllcjogQG1hcCgoZCkgLT4ge3g6IHgudmFsdWUoZCksIHl5OiAreS5sYXllclZhbHVlKGQsayksIHkwOiAwfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgICNsYXlvdXROZXcgPSBsYXlvdXQobGF5ZXJEYXRhKVxuXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG4gICAgICAjIyNcbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgQXJlYSBDaGFydFwiXG5cblxuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBkZWxldGVkU3VjYyA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzT2xkLCBsYXllcktleXMsIDEpXG4gICAgICAgIGFkZGVkUHJlZCA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzLCBsYXllcktleXNPbGQsIC0xKVxuXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBkYXRhLm1hcCgoZCkgLT4ge3l5OiB5LnZhbHVlKGQpLCB4eDogK3gubGF5ZXJWYWx1ZShkLGspLCB5MDogMCwgZGF0YTpkfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgIGxheW91dE5ldyA9IGxheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgb2ZmcyA9IGlmIHkuaXNPcmRpbmFsKCkgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBpZiBvZmZzZXQgaXMgJ2V4cGFuZCdcbiAgICAgICAgICBzY2FsZVggPSB4LnNjYWxlKCkuY29weSgpXG4gICAgICAgICAgc2NhbGVYLmRvbWFpbihbMCwgMV0pXG4gICAgICAgIGVsc2Ugc2NhbGVYID0geC5zY2FsZSgpXG5cbiAgICAgICAgYXJlYSA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIHkuc2NhbGUoKShkLnl5KSlcbiAgICAgICAgICAueTAoKGQpIC0+ICBzY2FsZVgoZC55MCArIGQueSkpXG4gICAgICAgICAgLnkxKChkKSAtPiAgc2NhbGVYKGQueTApKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKGxheW91dE5ldywgKGQpIC0+IGQua2V5KVxuXG4gICAgICAgIGlmIGxheW91dE9sZC5sZW5ndGggaXMgMFxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gaWYgYWRkZWRQcmVkW2Qua2V5XSB0aGVuIGdldExheWVyQnlLZXkoYWRkZWRQcmVkW2Qua2V5XSwgbGF5b3V0T2xkKS5wYXRoIGVsc2UgYXJlYShkLmxheWVyLm1hcCgocCkgLT4gIHt5eTogcC55eSwgeTogMCwgeTA6IDB9KSkpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZSg5MCkgc2NhbGUoMSwtMSlcIilcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQubGF5ZXIpKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpIC0+IGNvbG9yLnNjYWxlKCkoZC5rZXkpKVxuXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPlxuICAgICAgICAgICAgc3VjYyA9IGRlbGV0ZWRTdWNjW2Qua2V5XVxuICAgICAgICAgICAgaWYgc3VjYyB0aGVuIGFyZWEoZ2V0TGF5ZXJCeUtleShzdWNjLCBsYXlvdXROZXcpLmxheWVyLm1hcCgocCkgLT4ge3l5OiBwLnl5LCB5OiAwLCB5MDogcC55MH0pKSBlbHNlIGFyZWEobGF5b3V0TmV3W2xheW91dE5ldy5sZW5ndGggLSAxXS5sYXllci5tYXAoKHApIC0+IHt5eTogcC55eSwgeTogMCwgeTA6IHAueTAgKyBwLnl9KSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgbGF5b3V0T2xkID0gbGF5b3V0TmV3Lm1hcCgoZCkgLT4ge2tleTogZC5rZXksIHBhdGg6IGFyZWEoZC5sYXllci5tYXAoKHApIC0+IHt5eTogcC55eSwgeTogMCwgeTA6IHAueSArIHAueTB9KSl9KVxuICAgICAgICBsYXllcktleXNPbGQgPSBsYXllcktleXNcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd4JykuZG9tYWluQ2FsYygndG90YWwnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC55KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdhcmVhU3RhY2tlZFZlcnRpY2FsJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGluIFsnemVybycsICdzaWxob3VldHRlJywgJ2V4cGFuZCcsICd3aWdnbGUnXVxuICAgICAgICAgIG9mZnNldCA9IHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgb2Zmc2V0ID0gXCJ6ZXJvXCJcbiAgICAgICAgc3RhY2sub2Zmc2V0KG9mZnNldClcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZW50ZXIgLyBleGl0IGFuaW1hdGlvbnMgbGlrZSBpbiBsaW5lXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYXJlYVZlcnRpY2FsJywgKCRsb2cpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG5cbiAgICAgICMtLS0gVG9vbHRpcCBoYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBfbGF5b3V0Lm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsLnZhbHVlW2lkeF0ueCksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoJ2NpcmNsZScpLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZC5jb2xvcilcbiAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeCcsIChkKSAtPiBfc2NhbGVMaXN0Lnguc2NhbGUoKShkLnZhbHVlW2lkeF0ueCkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsICN7X3NjYWxlTGlzdC55LnNjYWxlKCkoX2xheW91dFswXS52YWx1ZVtpZHhdLnkpICsgb2Zmc2V0fSlcIilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcbiAgICAgICAgX2xheW91dCA9IGxheWVyS2V5cy5tYXAoKGtleSkgPT4ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6ZGF0YS5tYXAoKGQpLT4ge3k6eS52YWx1ZShkKSx4OngubGF5ZXJWYWx1ZShkLCBrZXkpLCBkYXRhOmR9KX0pXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgYXJlYSA9IGQzLnN2Zy5hcmVhKCkgICAgIyB0cmlja3kuIERyYXcgdGhpcyBsaWtlIGEgdmVydGljYWwgY2hhcnQgYW5kIHRoZW4gcm90YXRlIGFuZCBwb3NpdGlvbiBpdC5cbiAgICAgICAgLngoKGQpIC0+IG9wdGlvbnMud2lkdGggLSB5LnNjYWxlKCkoZC55KSlcbiAgICAgICAgLnkwKChkKSAtPiAgeC5zY2FsZSgpKGQueCkpXG4gICAgICAgIC55MSgoZCkgLT4gIHguc2NhbGUoKSgwKSlcblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5zZWxlY3QoJy53ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje29wdGlvbnMud2lkdGggKyBvZmZzZXR9KXJvdGF0ZSgtOTApXCIpICNyb3RhdGUgYW5kIHBvc2l0aW9uIGNoYXJ0XG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC52YWx1ZSkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueSlcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZW50ZXIgLyBleGl0IGFuaW1hdGlvbnMgbGlrZSBpbiBsaW5lXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYmFycycsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG4gIHNCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICByZXN0cmljdDogJ0EnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgIF9pZCA9IFwiYmFycyN7c0JhckNudHIrK31cIlxuXG4gICAgYmFycyA9IG51bGxcbiAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcbiAgICBfc2NhbGVMaXN0ID0ge31cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG4gICAgX21lcmdlKFtdKS5rZXkoKGQpIC0+IGQua2V5KVxuXG4gICAgaW5pdGlhbCA9IHRydWVcblxuICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBfc2NhbGVMaXN0LmNvbG9yLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIHZhbHVlOiBfc2NhbGVMaXN0LnguZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogX3NjYWxlTGlzdC5jb2xvci5tYXAoZGF0YS5kYXRhKX19KVxuXG4gICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICBpZiBub3QgYmFyc1xuICAgICAgICBiYXJzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcnMnKVxuICAgICAgIyRsb2cubG9nIFwicmVuZGVyaW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgYmFyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgIGJhck91dGVyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgIGxheW91dCA9IGRhdGEubWFwKChkKSAtPiB7a2V5OnkudmFsdWUoZCksIHg6eC5tYXAoZCksIHk6eS5tYXAoZCksIGNvbG9yOmNvbG9yLm1hcChkKSwgaGVpZ2h0Onkuc2NhbGUoKS5yYW5nZUJhbmQoeS52YWx1ZShkKSksIGRhdGE6ZH0pXG5cbiAgICAgIF9tZXJnZShsYXlvdXQpLmZpcnN0KHt5Om9wdGlvbnMuaGVpZ2h0ICsgYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmd9KS5sYXN0KHt5OjAsIGhlaWdodDpiYXJPdXRlclBhZGRpbmdPbGQgLSBiYXJQYWRkaW5nT2xkIC8gMn0pICAjeS5zY2FsZSgpLnJhbmdlKClbeS5zY2FsZSgpLnJhbmdlKCkubGVuZ3RoLTFdXG5cbiAgICAgIGJhcnMgPSBiYXJzLmRhdGEobGF5b3V0LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAuYXR0cigneScsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC55IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS55IC0gYmFyUGFkZGluZ09sZCAvIDIpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQuaGVpZ2h0IGVsc2UgMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG5cbiAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcikudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IE1hdGgubWluKHguc2NhbGUoKSgwKSwgZC54KSlcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IE1hdGguYWJzKHguc2NhbGUoKSgwKSAtIGQueCkpXG4gICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGQueSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgYmFycy5leGl0KClcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cigneScsIChkKSAtPiBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueSArIF9tZXJnZS5kZWxldGVkU3VjYyhkKS5oZWlnaHQgKyBiYXJQYWRkaW5nIC8gMilcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsID0gZmFsc2VcblxuICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgIEBnZXRLaW5kKCd4JykuZG9tYWluQ2FsYygnbWF4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuXG4gICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYmFyQ2x1c3RlcmVkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpLT5cblxuICBjbHVzdGVyZWRCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBfaWQgPSBcImNsdXN0ZXJlZEJhciN7Y2x1c3RlcmVkQmFyQ250cisrfVwiXG5cbiAgICAgIGxheWVycyA9IG51bGxcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5sYXllcktleSlcblxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC55LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgIyRsb2cuaW5mbyBcInJlbmRlcmluZyBjbHVzdGVyZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgICMgbWFwIGRhdGEgdG8gdGhlIHJpZ2h0IGZvcm1hdCBmb3IgcmVuZGVyaW5nXG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgY2x1c3RlclkgPSBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKHgubGF5ZXJLZXlzKGRhdGEpKS5yYW5nZUJhbmRzKFswLCB5LnNjYWxlKCkucmFuZ2VCYW5kKCldLCAwLCAwKVxuXG4gICAgICAgIGNsdXN0ZXIgPSBkYXRhLm1hcCgoZCkgLT4gbCA9IHtcbiAgICAgICAgICBrZXk6eS52YWx1ZShkKSwgZGF0YTpkLCB5OnkubWFwKGQpLCBoZWlnaHQ6IHkuc2NhbGUoKS5yYW5nZUJhbmQoeS52YWx1ZShkKSlcbiAgICAgICAgICBsYXllcnM6IGxheWVyS2V5cy5tYXAoKGspIC0+IHtsYXllcktleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwga2V5OnkudmFsdWUoZCksIHZhbHVlOiBkW2tdLCB5OmNsdXN0ZXJZKGspLCB4OiB4LnNjYWxlKCkoZFtrXSksIHdpZHRoOnguc2NhbGUoKShkW2tdKSwgaGVpZ2h0OmNsdXN0ZXJZLnJhbmdlQmFuZChrKX0pfVxuICAgICAgICApXG5cbiAgICAgICAgX21lcmdlKGNsdXN0ZXIpLmZpcnN0KHt5Om9wdGlvbnMuaGVpZ2h0ICsgYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIGhlaWdodDp5LnNjYWxlKCkucmFuZ2VCYW5kKCl9KS5sYXN0KHt5OjAsIGhlaWdodDpiYXJPdXRlclBhZGRpbmdPbGQgLSBiYXJQYWRkaW5nT2xkIC8gMn0pXG4gICAgICAgIF9tZXJnZUxheWVycyhjbHVzdGVyWzBdLmxheWVycykuZmlyc3Qoe3k6MCwgaGVpZ2h0OjB9KS5sYXN0KHt5OmNsdXN0ZXJbMF0uaGVpZ2h0LCBoZWlnaHQ6MH0pXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1sYXllcicpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzLmRhdGEoY2x1c3RlciwgKGQpIC0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWxheWVyJykuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCktPlxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgXCJ0cmFuc2xhdGUoMCwgI3tpZiBpbml0aWFsIHRoZW4gZC55IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS55IC0gYmFyUGFkZGluZ09sZCAvIDJ9KSBzY2FsZSgxLCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsI3tkLnl9KSBzY2FsZSgxLDEpXCIpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwgI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueSArIF9tZXJnZS5kZWxldGVkU3VjYyhkKS5oZWlnaHQgKyBiYXJQYWRkaW5nIC8gMn0pIHNjYWxlKDEsMClcIilcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGJhcnMgPSBsYXllcnMuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAuZGF0YShcbiAgICAgICAgICAgIChkKSAtPiBkLmxheWVyc1xuICAgICAgICAgICwgKGQpIC0+IGQubGF5ZXJLZXkgKyAnfCcgKyBkLmtleVxuICAgICAgICAgIClcblxuICAgICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQpLnkgKyBfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQpLmhlaWdodClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLmhlaWdodCBlbHNlIDApXG4gICAgICAgICAgLmF0dHIoJ3gnLCB4LnNjYWxlKCkoMCkpXG5cblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGNvbG9yLnNjYWxlKCkoZC5sYXllcktleSkpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGQueSlcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBNYXRoLm1pbih4LnNjYWxlKCkoMCksIGQueCkpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBNYXRoLmFicyhkLmhlaWdodCkpXG5cbiAgICAgICAgYmFycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAjLmF0dHIoJ3dpZHRoJywwKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSAtPiBfbWVyZ2VMYXllcnMuZGVsZXRlZFN1Y2MoZCkueSlcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGluaXRpYWwgPSBmYWxzZVxuICAgICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgZHJhd1xuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgICAgX3NjYWxlTGlzdC55LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYmFyU3RhY2tlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKSAtPlxuXG4gIHN0YWNrZWRCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIFN0YWNrZWQgYmFyJ1xuXG4gICAgICBfaWQgPSBcInN0YWNrZWRDb2x1bW4je3N0YWNrZWRCYXJDbnRyKyt9XCJcblxuICAgICAgbGF5ZXJzID0gbnVsbFxuXG4gICAgICBzdGFjayA9IFtdXG4gICAgICBfdG9vbHRpcCA9ICgpLT5cbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgICAgX21lcmdlTGF5ZXJzID0gdXRpbHMubWVyZ2VEYXRhKClcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBkYXRhLmxheWVycy5tYXAoKGwpIC0+IHtuYW1lOmwubGF5ZXJLZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLnZhbHVlKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGRhdGEua2V5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplLCBzaGFwZSkgLT5cblxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gQHNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAjJGxvZy5kZWJ1ZyBcImRyYXdpbmcgc3RhY2tlZC1iYXJcIlxuXG4gICAgICAgIGJhclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcblxuICAgICAgICBzdGFjayA9IFtdXG4gICAgICAgIGZvciBkIGluIGRhdGFcbiAgICAgICAgICB4MCA9IDBcbiAgICAgICAgICBsID0ge2tleTp5LnZhbHVlKGQpLCBsYXllcnM6W10sIGRhdGE6ZCwgeTp5Lm1hcChkKSwgaGVpZ2h0OmlmIHkuc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxfVxuICAgICAgICAgIGlmIGwueSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgbC5sYXllcnMgPSBsYXllcktleXMubWFwKChrKSAtPlxuICAgICAgICAgICAgICBsYXllciA9IHtsYXllcktleTprLCBrZXk6bC5rZXksIHZhbHVlOmRba10sIHdpZHRoOiB4LnNjYWxlKCkoK2Rba10pLCBoZWlnaHQ6IChpZiB5LnNjYWxlKCkucmFuZ2VCYW5kIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIGVsc2UgMSksIHg6IHguc2NhbGUoKSgreDApLCBjb2xvcjogY29sb3Iuc2NhbGUoKShrKX1cbiAgICAgICAgICAgICAgeDAgKz0gK2Rba11cbiAgICAgICAgICAgICAgcmV0dXJuIGxheWVyXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBzdGFjay5wdXNoKGwpXG5cbiAgICAgICAgX21lcmdlKHN0YWNrKS5maXJzdCh7eTpvcHRpb25zLmhlaWdodCArIGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nLCBoZWlnaHQ6MH0pLmxhc3Qoe3k6MCwgaGVpZ2h0OmJhck91dGVyUGFkZGluZ09sZCAtIGJhclBhZGRpbmdPbGQgLyAyfSlcbiAgICAgICAgX21lcmdlTGF5ZXJzKGxheWVyS2V5cylcblxuICAgICAgICBsYXllcnMgPSBsYXllcnNcbiAgICAgICAgICAuZGF0YShzdGFjaywgKGQpLT4gZC5rZXkpXG5cbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKDAsI3tpZiBpbml0aWFsIHRoZW4gZC55IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS55IC0gYmFyUGFkZGluZ09sZCAvIDJ9KSBzY2FsZSgxLCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gcmV0dXJuIFwidHJhbnNsYXRlKDAsICN7ZC55fSkgc2NhbGUoMSwxKVwiKS5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje19tZXJnZS5kZWxldGVkU3VjYyhkKS55ICsgX21lcmdlLmRlbGV0ZWRTdWNjKGQpLmhlaWdodCArIGJhclBhZGRpbmcgLyAyfSkgc2NhbGUoMSwwKVwiKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGJhcnMgPSBsYXllcnMuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAuZGF0YShcbiAgICAgICAgICAgIChkKSAtPiBkLmxheWVyc1xuICAgICAgICAgICwgKGQpIC0+IGQubGF5ZXJLZXkgKyAnfCcgKyBkLmtleVxuICAgICAgICAgIClcblxuICAgICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+XG4gICAgICAgICAgICBpZiBfbWVyZ2UucHJldihkLmtleSlcbiAgICAgICAgICAgICAgaWR4ID0gbGF5ZXJLZXlzLmluZGV4T2YoX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkLmxheWVyS2V5KSlcbiAgICAgICAgICAgICAgaWYgaWR4ID49IDAgdGhlbiBfbWVyZ2UucHJldihkLmtleSkubGF5ZXJzW2lkeF0ueCArIF9tZXJnZS5wcmV2KGQua2V5KS5sYXllcnNbaWR4XS53aWR0aCBlbHNlIHguc2NhbGUoKSgwKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBkLnhcbiAgICAgICAgICApXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGlmIF9tZXJnZS5wcmV2KGQua2V5KSB0aGVuIDAgZWxzZSBkLndpZHRoKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG5cbiAgICAgICAgYmFycy5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGQueClcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPlxuICAgICAgICAgICAgaWR4ID0gbGF5ZXJLZXlzLmluZGV4T2YoX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgaWYgaWR4ID49IDAgdGhlbiBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2lkeF0ueCBlbHNlIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbbGF5ZXJLZXlzLmxlbmd0aCAtIDFdLnggKyBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2xheWVyS2V5cy5sZW5ndGggLSAxXS53aWR0aFxuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGluaXRpYWwgPSBmYWxzZVxuICAgICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgZHJhd1xuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgICAgX3NjYWxlTGlzdC55LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnViYmxlJywgKCRsb2csIHV0aWxzKSAtPlxuICBidWJibGVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgICMkbG9nLmRlYnVnICdidWJibGVDaGFydCBsaW5rZWQnXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnYnViYmxlJyArIGJ1YmJsZUNudHIrK1xuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIGZvciBzTmFtZSwgc2NhbGUgb2YgX3NjYWxlTGlzdFxuICAgICAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogc2NhbGUuYXhpc0xhYmVsKCksIHZhbHVlOiBzY2FsZS5mb3JtYXR0ZWRWYWx1ZShkYXRhKSwgY29sb3I6IGlmIHNOYW1lIGlzICdjb2xvcicgdGhlbiB7J2JhY2tncm91bmQtY29sb3InOnNjYWxlLm1hcChkYXRhKX0gZWxzZSB1bmRlZmluZWR9KVxuXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSkgLT5cblxuICAgICAgICBidWJibGVzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJ1YmJsZScpLmRhdGEoZGF0YSwgKGQpIC0+IGNvbG9yLnZhbHVlKGQpKVxuICAgICAgICBidWJibGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWJ1YmJsZSB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICBidWJibGVzXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGNvbG9yLm1hcChkKSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIHI6ICAoZCkgLT4gc2l6ZS5tYXAoZClcbiAgICAgICAgICAgICAgY3g6IChkKSAtPiB4Lm1hcChkKVxuICAgICAgICAgICAgICBjeTogKGQpIC0+IHkubWFwKGQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcbiAgICAgICAgYnViYmxlcy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApLnJlbW92ZSgpXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIF90b29sdGlwID0gbGF5b3V0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICB9XG5cbiAgI1RPRE8gdmVyaWZ5IGFuZCB0ZXN0IGN1c3RvbSB0b29sdGlwcyBiZWhhdmlvciIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sdW1uJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpLT5cbiAgc0JhckNudHIgPSAwXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnQSdcbiAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgX2lkID0gXCJzaW1wbGVDb2x1bW4je3NCYXJDbnRyKyt9XCJcblxuICAgIGNvbHVtbnMgPSBudWxsXG4gICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKClcbiAgICBfbWVyZ2UoW10pLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgaW5pdGlhbCA9IHRydWVcbiAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgIGNvbmZpZyA9IHt9XG4gICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcblxuICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcblxuICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC55LmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgaWYgbm90IGNvbHVtbnNcbiAgICAgICAgY29sdW1ucyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1jb2x1bW5zJylcbiAgICAgICMkbG9nLmxvZyBcInJlbmRlcmluZyBzdGFja2VkLWJhclwiXG5cbiAgICAgIGJhclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICBsYXlvdXQgPSBkYXRhLm1hcCgoZCkgLT4ge2RhdGE6ZCwga2V5OngudmFsdWUoZCksIHg6eC5tYXAoZCksIHk6TWF0aC5taW4oeS5zY2FsZSgpKDApLCB5Lm1hcChkKSksIGNvbG9yOmNvbG9yLm1hcChkKSwgd2lkdGg6eC5zY2FsZSgpLnJhbmdlQmFuZCh4LnZhbHVlKGQpKSwgaGVpZ2h0Ok1hdGguYWJzKHkuc2NhbGUoKSgwKSAtIHkubWFwKGQpKX0pXG5cbiAgICAgIF9tZXJnZShsYXlvdXQpLmZpcnN0KHt4OjAsIHdpZHRoOjB9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOiBiYXJPdXRlclBhZGRpbmd9KVxuXG5cbiAgICAgIGNvbHVtbnMgPSBjb2x1bW5zLmRhdGEobGF5b3V0LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgIGVudGVyID0gY29sdW1ucy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtY29sdW1ucyB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLGkpIC0+IFwidHJhbnNsYXRlKCN7aWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueCAgKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgaWYgaSB0aGVuIGJhclBhZGRpbmdPbGQgLyAyIGVsc2UgYmFyT3V0ZXJQYWRkaW5nT2xkfSwje2QueX0pIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwxKVwiKVxuICAgICAgZW50ZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsKGQpIC0+IGQuY29sb3IpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgZW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC53aWR0aCAvIDIpXG4gICAgICAgIC5hdHRyKCd5JywgLTIwKVxuICAgICAgICAuYXR0cih7ZHk6ICcxZW0nLCAndGV4dC1hbmNob3InOidtaWRkbGUnfSlcbiAgICAgICAgLnN0eWxlKHsnZm9udC1zaXplJzonMS4zZW0nLCBvcGFjaXR5OiAwfSlcblxuICAgICAgY29sdW1ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwgI3tkLnl9KSBzY2FsZSgxLDEpXCIpXG4gICAgICBjb2x1bW5zLnNlbGVjdCgncmVjdCcpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgY29sdW1ucy5zZWxlY3QoJ3RleHQnKVxuICAgICAgICAudGV4dCgoZCkgLT4geS5mb3JtYXR0ZWRWYWx1ZShkLmRhdGEpKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGhvc3Quc2hvd0xhYmVscygpIHRoZW4gMSBlbHNlIDApXG5cbiAgICAgIGNvbHVtbnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnggLSBiYXJQYWRkaW5nIC8gMn0sI3tkLnl9KSBzY2FsZSgwLDEpXCIpXG4gICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgIF9zY2FsZUxpc3QueC5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVscycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBob3N0LnNob3dMYWJlbHMoZmFsc2UpXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZScgb3IgdmFsIGlzIFwiXCJcbiAgICAgICAgaG9zdC5zaG93TGFiZWxzKHRydWUpXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sdW1uQ2x1c3RlcmVkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpLT5cblxuICBjbHVzdGVyZWRCYXJDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnXmxheW91dCdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBfaWQgPSBcImNsdXN0ZXJlZENvbHVtbiN7Y2x1c3RlcmVkQmFyQ250cisrfVwiXG5cbiAgICAgIGxheWVycyA9IG51bGxcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5sYXllcktleSlcblxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBkYXRhLmxheWVycy5tYXAoKGwpIC0+IHtuYW1lOmwubGF5ZXJLZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsLnZhbHVlKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGRhdGEua2V5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5pbmZvIFwicmVuZGVyaW5nIGNsdXN0ZXJlZC1iYXJcIlxuXG4gICAgICAgIGJhclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgICAgIyBtYXAgZGF0YSB0byB0aGUgcmlnaHQgZm9ybWF0IGZvciByZW5kZXJpbmdcbiAgICAgICAgbGF5ZXJLZXlzID0geS5sYXllcktleXMoZGF0YSlcblxuICAgICAgICBjbHVzdGVyWCA9IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oeS5sYXllcktleXMoZGF0YSkpLnJhbmdlQmFuZHMoWzAseC5zY2FsZSgpLnJhbmdlQmFuZCgpXSwgMCwgMClcblxuICAgICAgICBjbHVzdGVyID0gZGF0YS5tYXAoKGQpIC0+IGwgPSB7XG4gICAgICAgICAga2V5OngudmFsdWUoZCksIGRhdGE6ZCwgeDp4Lm1hcChkKSwgd2lkdGg6IHguc2NhbGUoKS5yYW5nZUJhbmQoeC52YWx1ZShkKSlcbiAgICAgICAgICBsYXllcnM6IGxheWVyS2V5cy5tYXAoKGspIC0+IHtsYXllcktleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwga2V5OngudmFsdWUoZCksIHZhbHVlOiBkW2tdLCB4OmNsdXN0ZXJYKGspLCB5OiB5LnNjYWxlKCkoZFtrXSksIGhlaWdodDp5LnNjYWxlKCkoMCkgLSB5LnNjYWxlKCkoZFtrXSksIHdpZHRoOmNsdXN0ZXJYLnJhbmdlQmFuZChrKX0pfVxuICAgICAgICApXG5cbiAgICAgICAgX21lcmdlKGNsdXN0ZXIpLmZpcnN0KHt4OmJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nLCB3aWR0aDowfSkubGFzdCh7eDpvcHRpb25zLndpZHRoICsgYmFyUGFkZGluZy8yIC0gYmFyT3V0ZXJQYWRkaW5nT2xkLCB3aWR0aDowfSlcbiAgICAgICAgX21lcmdlTGF5ZXJzKGNsdXN0ZXJbMF0ubGF5ZXJzKS5maXJzdCh7eDowLCB3aWR0aDowfSkubGFzdCh7eDpjbHVzdGVyWzBdLndpZHRoLCB3aWR0aDowfSlcblxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBsYXllcnMgPSBsYXllcnMuZGF0YShjbHVzdGVyLCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGF5ZXInKS5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7aWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueCArIF9tZXJnZS5hZGRlZFByZWQoZCkud2lkdGggKyBiYXJQYWRkaW5nT2xkIC8gMn0sMCkgc2NhbGUoI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9LCAxKVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tkLnh9LDApIHNjYWxlKDEsMSlcIilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje19tZXJnZS5kZWxldGVkU3VjYyhkKS54IC0gYmFyUGFkZGluZyAvIDJ9LCAwKSBzY2FsZSgwLDEpXCIpXG4gICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBiYXJzID0gbGF5ZXJzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgLmRhdGEoXG4gICAgICAgICAgICAoZCkgLT4gZC5sYXllcnNcbiAgICAgICAgICAsIChkKSAtPiBkLmxheWVyS2V5ICsgJ3wnICsgZC5rZXlcbiAgICAgICAgICApXG5cbiAgICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC54IGVsc2UgX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkKS54ICsgX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkKS53aWR0aClcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT5pZiBpbml0aWFsIHRoZW4gZC53aWR0aCBlbHNlIDApXG5cbiAgICAgICAgYmFycy5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5zY2FsZSgpKGQubGF5ZXJLZXkpKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLngpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gTWF0aC5taW4oeS5zY2FsZSgpKDApLCBkLnkpKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gTWF0aC5hYnMoZC5oZWlnaHQpKVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsMClcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBfbWVyZ2VMYXllcnMuZGVsZXRlZFN1Y2MoZCkueClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnbWF4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2JydXNoRHJhdycsIGRyYXdcblxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnZmFsc2UnXG4gICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSAwXG4gICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZhbHVlcyA9IHV0aWxzLnBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgdmFsdWVzXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgICAgY29uZmlnLnBhZGRpbmcgPSB2YWx1ZXNbMF0vMTAwXG4gICAgICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSB2YWx1ZXNbMV0vMTAwXG4gICAgICAgIF9zY2FsZUxpc3QueC5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sdW1uU3RhY2tlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKSAtPlxuXG4gIHN0YWNrZWRDb2x1bW5DbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIFN0YWNrZWQgYmFyJ1xuXG4gICAgICBfaWQgPSBcInN0YWNrZWRDb2x1bW4je3N0YWNrZWRDb2x1bW5DbnRyKyt9XCJcblxuICAgICAgbGF5ZXJzID0gbnVsbFxuXG4gICAgICBzdGFjayA9IFtdXG4gICAgICBfdG9vbHRpcCA9ICgpLT5cbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKVxuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUsIHNoYXBlKSAtPlxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gQHNlbGVjdEFsbChcIi5sYXllclwiKVxuICAgICAgICAjJGxvZy5kZWJ1ZyBcImRyYXdpbmcgc3RhY2tlZC1iYXJcIlxuXG4gICAgICAgIGJhclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgICAgbGF5ZXJLZXlzID0geS5sYXllcktleXMoZGF0YSlcblxuICAgICAgICBzdGFjayA9IFtdXG4gICAgICAgIGZvciBkIGluIGRhdGFcbiAgICAgICAgICB5MCA9IDBcbiAgICAgICAgICBsID0ge2tleTp4LnZhbHVlKGQpLCBsYXllcnM6W10sIGRhdGE6ZCwgeDp4Lm1hcChkKSwgd2lkdGg6aWYgeC5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDF9XG4gICAgICAgICAgaWYgbC54IGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICBsLmxheWVycyA9IGxheWVyS2V5cy5tYXAoKGspIC0+XG4gICAgICAgICAgICAgIGxheWVyID0ge2xheWVyS2V5OmssIGtleTpsLmtleSwgdmFsdWU6ZFtrXSwgaGVpZ2h0OiAgeS5zY2FsZSgpKDApIC0geS5zY2FsZSgpKCtkW2tdKSwgd2lkdGg6IChpZiB4LnNjYWxlKCkucmFuZ2VCYW5kIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIGVsc2UgMSksIHk6IHkuc2NhbGUoKSgreTAgKyArZFtrXSksIGNvbG9yOiBjb2xvci5zY2FsZSgpKGspfVxuICAgICAgICAgICAgICB5MCArPSArZFtrXVxuICAgICAgICAgICAgICByZXR1cm4gbGF5ZXJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobClcblxuICAgICAgICBfbWVyZ2Uoc3RhY2spLmZpcnN0KHt4OiBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgd2lkdGg6MH0pLmxhc3Qoe3g6b3B0aW9ucy53aWR0aCArIGJhclBhZGRpbmcvMiAtIGJhck91dGVyUGFkZGluZ09sZCwgd2lkdGg6MH0pXG4gICAgICAgIF9tZXJnZUxheWVycyhsYXllcktleXMpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEoc3RhY2ssIChkKS0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7aWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZS5hZGRlZFByZWQoZCkueCArIF9tZXJnZS5hZGRlZFByZWQoZCkud2lkdGggKyBiYXJQYWRkaW5nT2xkIC8gMn0sMCkgc2NhbGUoI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9LCAxKVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2QueH0sMCkgc2NhbGUoMSwxKVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje19tZXJnZS5kZWxldGVkU3VjYyhkKS54IC0gYmFyUGFkZGluZyAvIDJ9LCAwKSBzY2FsZSgwLDEpXCIpXG4gICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBiYXJzID0gbGF5ZXJzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcicpXG4gICAgICAgICAgLmRhdGEoXG4gICAgICAgICAgICAoZCkgLT4gZC5sYXllcnNcbiAgICAgICAgICAsIChkKSAtPiBkLmxheWVyS2V5ICsgJ3wnICsgZC5rZXlcbiAgICAgICAgICApXG5cbiAgICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigneScsIChkKSAtPlxuICAgICAgICAgICAgaWYgX21lcmdlLnByZXYoZC5rZXkpXG4gICAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5hZGRlZFByZWQoZC5sYXllcktleSkpXG4gICAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLnByZXYoZC5rZXkpLmxheWVyc1tpZHhdLnkgZWxzZSB5LnNjYWxlKCkoMClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZC55XG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG5cbiAgICAgICAgYmFycy5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGQueSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSAtPiBkLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywwKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+XG4gICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuZGVsZXRlZFN1Y2MoZC5sYXllcktleSkpXG4gICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbaWR4XS55ICsgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tpZHhdLmhlaWdodCBlbHNlIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbbGF5ZXJLZXlzLmxlbmd0aCAtIDFdLnlcbiAgICAgICAgICApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgZHJhd1xuXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdwYWRkaW5nJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gMFxuICAgICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFsdWVzID0gdXRpbHMucGFyc2VMaXN0KHZhbClcbiAgICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICBjb25maWcucGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgICAgX3NjYWxlTGlzdC55LnJhbmdlUGFkZGluZyhjb25maWcpXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnZ2F1Z2UnLCAoJGxvZywgdXRpbHMpIC0+XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuICAgIGNvbnRyb2xsZXI6ICgkc2NvcGUsICRhdHRycykgLT5cbiAgICAgIG1lID0ge2NoYXJ0VHlwZTogJ0dhdWdlQ2hhcnQnLCBpZDp1dGlscy5nZXRJZCgpfVxuICAgICAgJGF0dHJzLiRzZXQoJ2NoYXJ0LWlkJywgbWUuaWQpXG4gICAgICByZXR1cm4gbWVcbiAgICBcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlci5tZVxuXG4gICAgICBpbml0YWxTaG93ID0gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgJGxvZy5pbmZvICdkcmF3aW5nIEdhdWdlIENoYXJ0J1xuXG4gICAgICAgIGRhdCA9IFtkYXRhXVxuXG4gICAgICAgIHlEb21haW4gPSB5LnNjYWxlKCkuZG9tYWluKClcbiAgICAgICAgY29sb3JEb21haW4gPSBhbmd1bGFyLmNvcHkoY29sb3Iuc2NhbGUoKS5kb21haW4oKSlcbiAgICAgICAgY29sb3JEb21haW4udW5zaGlmdCh5RG9tYWluWzBdKVxuICAgICAgICBjb2xvckRvbWFpbi5wdXNoKHlEb21haW5bMV0pXG4gICAgICAgIHJhbmdlcyA9IFtdXG4gICAgICAgIGZvciBpIGluIFsxLi5jb2xvckRvbWFpbi5sZW5ndGgtMV1cbiAgICAgICAgICByYW5nZXMucHVzaCB7ZnJvbTorY29sb3JEb21haW5baS0xXSx0bzorY29sb3JEb21haW5baV19XG5cbiAgICAgICAgI2RyYXcgY29sb3Igc2NhbGVcblxuICAgICAgICBiYXIgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgYmFyID0gYmFyLmRhdGEocmFuZ2VzLCAoZCwgaSkgLT4gaSlcbiAgICAgICAgaWYgaW5pdGFsU2hvd1xuICAgICAgICAgIGJhci5lbnRlcigpLmFwcGVuZCgncmVjdCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWJhcicpXG4gICAgICAgICAgICAuYXR0cigneCcsIDApLmF0dHIoJ3dpZHRoJywgNTApXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYmFyLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMCkuYXR0cignd2lkdGgnLCA1MClcblxuICAgICAgICBiYXIudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsKGQpIC0+IHkuc2NhbGUoKSgwKSAtIHkuc2NhbGUoKShkLnRvIC0gZC5mcm9tKSlcbiAgICAgICAgICAuYXR0cigneScsKGQpIC0+IHkuc2NhbGUoKShkLnRvKSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3Iuc2NhbGUoKShkLmZyb20pKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgYmFyLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgICMgZHJhdyB2YWx1ZVxuXG4gICAgICAgIGFkZE1hcmtlciA9IChzKSAtPlxuICAgICAgICAgIHMuYXBwZW5kKCdyZWN0JykuYXR0cignd2lkdGgnLCA1NSkuYXR0cignaGVpZ2h0JywgNCkuc3R5bGUoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgICAgIHMuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdyJywgMTApLmF0dHIoJ2N4JywgNjUpLmF0dHIoJ2N5JywyKS5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcblxuICAgICAgICBtYXJrZXIgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtbWFya2VyJylcbiAgICAgICAgbWFya2VyID0gbWFya2VyLmRhdGEoZGF0LCAoZCkgLT4gJ3drLWNoYXJ0LW1hcmtlcicpXG4gICAgICAgIG1hcmtlci5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbWFya2VyJykuY2FsbChhZGRNYXJrZXIpXG5cbiAgICAgICAgaWYgaW5pdGFsU2hvd1xuICAgICAgICAgIG1hcmtlci5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje3kuc2NhbGUoKShkLnZhbHVlKX0pXCIpLnN0eWxlKCdvcGFjaXR5JywgMClcblxuICAgICAgICBtYXJrZXJcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKDAsI3t5LnNjYWxlKCkoZC52YWx1ZSl9KVwiKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywoZCkgLT4gY29sb3Iuc2NhbGUoKShkLnZhbHVlKSkuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGluaXRhbFNob3cgPSBmYWxzZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIHRoaXMucmVxdWlyZWRTY2FsZXMoWyd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBnZXRLaW5kKCdjb2xvcicpLnJlc2V0T25OZXdEYXRhKHRydWUpXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICB9XG5cbiAgI3RvZG8gcmVmZWN0b3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2dlb01hcCcsICgkbG9nLCB1dGlscykgLT5cbiAgbWFwQ250ciA9IDBcblxuICBwYXJzZUxpc3QgPSAodmFsKSAtPlxuICAgIGlmIHZhbFxuICAgICAgbCA9IHZhbC50cmltKCkucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKS5zcGxpdCgnLCcpLm1hcCgoZCkgLT4gZC5yZXBsYWNlKC9eW1xcXCJ8J118W1xcXCJ8J10kL2csICcnKSlcbiAgICAgIGwgPSBsLm1hcCgoZCkgLT4gaWYgaXNOYU4oZCkgdGhlbiBkIGVsc2UgK2QpXG4gICAgICByZXR1cm4gaWYgbC5sZW5ndGggaXMgMSB0aGVuIHJldHVybiBsWzBdIGVsc2UgbFxuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgc2NvcGU6IHtcbiAgICAgIGdlb2pzb246ICc9J1xuICAgICAgcHJvamVjdGlvbjogJz0nXG4gICAgfVxuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnZ2VvTWFwJyArIG1hcENudHIrK1xuICAgICAgX2RhdGFNYXBwaW5nID0gZDMubWFwKClcblxuICAgICAgX3NjYWxlID0gMVxuICAgICAgX3JvdGF0ZSA9IFswLDBdXG4gICAgICBfaWRQcm9wID0gJydcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cblxuICAgICAgICB2YWwgPSBfZGF0YU1hcHBpbmcuZ2V0KGRhdGEucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOnZhbC5SUywgdmFsdWU6dmFsLkRFU30pXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcGF0aFNlbCA9IFtdXG5cbiAgICAgIF9wcm9qZWN0aW9uID0gZDMuZ2VvLm9ydGhvZ3JhcGhpYygpXG4gICAgICBfd2lkdGggPSAwXG4gICAgICBfaGVpZ2h0ID0gMFxuICAgICAgX3BhdGggPSB1bmRlZmluZWRcbiAgICAgIF96b29tID0gZDMuZ2VvLnpvb20oKVxuICAgICAgICAucHJvamVjdGlvbihfcHJvamVjdGlvbilcbiAgICAgICAgIy5zY2FsZUV4dGVudChbcHJvamVjdGlvbi5zY2FsZSgpICogLjcsIHByb2plY3Rpb24uc2NhbGUoKSAqIDEwXSlcbiAgICAgICAgLm9uIFwiem9vbS5yZWRyYXdcIiwgKCkgLT5cbiAgICAgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHBhdGhTZWwuYXR0cihcImRcIiwgX3BhdGgpO1xuXG4gICAgICBfZ2VvSnNvbiA9IHVuZGVmaW5lZFxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBfd2lkdGggPSBvcHRpb25zLndpZHRoXG4gICAgICAgIF9oZWlnaHQgPSBvcHRpb25zLmhlaWdodFxuICAgICAgICBpZiBkYXRhIGFuZCBkYXRhWzBdLmhhc093blByb3BlcnR5KF9pZFByb3BbMV0pXG4gICAgICAgICAgZm9yIGUgaW4gZGF0YVxuICAgICAgICAgICAgX2RhdGFNYXBwaW5nLnNldChlW19pZFByb3BbMV1dLCBlKVxuXG4gICAgICAgIGlmIF9nZW9Kc29uXG5cbiAgICAgICAgICBfcHJvamVjdGlvbi50cmFuc2xhdGUoW193aWR0aC8yLCBfaGVpZ2h0LzJdKVxuICAgICAgICAgIHBhdGhTZWwgPSB0aGlzLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShfZ2VvSnNvbi5mZWF0dXJlcywgKGQpIC0+IGQucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgICBwYXRoU2VsXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJzdmc6cGF0aFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCdsaWdodGdyZXknKS5zdHlsZSgnc3Ryb2tlJywgJ2RhcmtncmV5JylcbiAgICAgICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICAgICAgICAuY2FsbChfem9vbSlcblxuICAgICAgICAgIHBhdGhTZWxcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBfcGF0aClcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPlxuICAgICAgICAgICAgICB2YWwgPSBfZGF0YU1hcHBpbmcuZ2V0KGQucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgICAgICAgY29sb3IubWFwKHZhbClcbiAgICAgICAgICApXG5cbiAgICAgICAgICBwYXRoU2VsLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ2NvbG9yJ10pXG4gICAgICAgIF9zY2FsZUxpc3QuY29sb3IucmVzZXRPbk5ld0RhdGEodHJ1ZSlcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICAjIEdlb01hcCBzcGVjaWZpYyBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NvcGUuJHdhdGNoICdwcm9qZWN0aW9uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgJGxvZy5sb2cgJ3NldHRpbmcgUHJvamVjdGlvbiBwYXJhbXMnLCB2YWxcbiAgICAgICAgICBpZiBkMy5nZW8uaGFzT3duUHJvcGVydHkodmFsLnByb2plY3Rpb24pXG4gICAgICAgICAgICBfcHJvamVjdGlvbiA9IGQzLmdlb1t2YWwucHJvamVjdGlvbl0oKVxuICAgICAgICAgICAgX3Byb2plY3Rpb24uY2VudGVyKHZhbC5jZW50ZXIpLnNjYWxlKHZhbC5zY2FsZSkucm90YXRlKHZhbC5yb3RhdGUpLmNsaXBBbmdsZSh2YWwuY2xpcEFuZ2xlKVxuICAgICAgICAgICAgX2lkUHJvcCA9IHZhbC5pZE1hcFxuICAgICAgICAgICAgaWYgX3Byb2plY3Rpb24ucGFyYWxsZWxzXG4gICAgICAgICAgICAgIF9wcm9qZWN0aW9uLnBhcmFsbGVscyh2YWwucGFyYWxsZWxzKVxuICAgICAgICAgICAgX3NjYWxlID0gX3Byb2plY3Rpb24uc2NhbGUoKVxuICAgICAgICAgICAgX3JvdGF0ZSA9IF9wcm9qZWN0aW9uLnJvdGF0ZSgpXG4gICAgICAgICAgICBfcGF0aCA9IGQzLmdlby5wYXRoKCkucHJvamVjdGlvbihfcHJvamVjdGlvbilcbiAgICAgICAgICAgIF96b29tLnByb2plY3Rpb24oX3Byb2plY3Rpb24pXG5cbiAgICAgICAgICAgIGxheW91dC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgICAsIHRydWUgI2RlZXAgd2F0Y2hcblxuICAgICAgc2NvcGUuJHdhdGNoICdnZW9qc29uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkIGFuZCB2YWwgaXNudCAnJ1xuICAgICAgICAgIF9nZW9Kc29uID0gdmFsXG4gICAgICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cblxuICB9XG5cbiAgI1RPRE8gcmUtdGVzdCBhbmQgdmVyaWZ5IGluIG5ldyBhcHBsaWNhaXRvbi4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbHVtbkhpc3RvZ3JhbScsICgkbG9nLCBiYXJDb25maWcsIHV0aWxzKSAtPlxuXG4gIHNIaXN0b0NudHIgPSAwXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJoaXN0b2dyYW0je3NIaXN0b0NudHIrK31cIlxuXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIGJ1Y2tldHMgPSB1bmRlZmluZWRcbiAgICAgIGxhYmVscyA9IHVuZGVmaW5lZFxuICAgICAgY29uZmlnID0ge31cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgXy5tZXJnZShjb25maWcsIGJhckNvbmZpZylcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKS0+IGQueFZhbClcblxuICAgICAgaW5pdGlhbCA9IHRydWVcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnJhbmdlWC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBfc2NhbGVMaXN0LmNvbG9yLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIHZhbHVlOiBfc2NhbGVMaXN0LnkuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogX3NjYWxlTGlzdC5jb2xvci5tYXAoZGF0YS5kYXRhKX19KVxuXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUsIHJhbmdlWCkgLT5cblxuICAgICAgICBpZiByYW5nZVgudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgbGF5b3V0ID0gZGF0YS5tYXAoKGQpIC0+IHt4OnJhbmdlWC5zY2FsZSgpKHJhbmdlWC5sb3dlclZhbHVlKGQpKSwgeFZhbDpyYW5nZVgubG93ZXJWYWx1ZShkKSwgd2lkdGg6cmFuZ2VYLnNjYWxlKCkocmFuZ2VYLnVwcGVyVmFsdWUoZCkpIC0gcmFuZ2VYLnNjYWxlKCkocmFuZ2VYLmxvd2VyVmFsdWUoZCkpLCB5OnkubWFwKGQpLCBoZWlnaHQ6b3B0aW9ucy5oZWlnaHQgLSB5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCBkYXRhOmR9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgZGF0YS5sZW5ndGggPiAwXG4gICAgICAgICAgICBzdGFydCA9IHJhbmdlWC5sb3dlclZhbHVlKGRhdGFbMF0pXG4gICAgICAgICAgICBzdGVwID0gcmFuZ2VYLmxvd2VyVmFsdWUoZGF0YVsxXSkgLSBzdGFydFxuICAgICAgICAgICAgd2lkdGggPSBvcHRpb25zLndpZHRoIC8gZGF0YS5sZW5ndGhcbiAgICAgICAgICAgIGxheW91dCA9IGRhdGEubWFwKChkLCBpKSAtPiB7eDpyYW5nZVguc2NhbGUoKShzdGFydCArIHN0ZXAgKiBpKSwgeFZhbDpyYW5nZVgubG93ZXJWYWx1ZShkKSwgd2lkdGg6d2lkdGgsIHk6eS5tYXAoZCksIGhlaWdodDpvcHRpb25zLmhlaWdodCAtIHkubWFwKGQpLCBjb2xvcjpjb2xvci5tYXAoZCksIGRhdGE6ZH0pXG5cbiAgICAgICAgX21lcmdlKGxheW91dCkuZmlyc3Qoe3g6MCwgd2lkdGg6MH0pLmxhc3Qoe3g6b3B0aW9ucy53aWR0aCwgd2lkdGg6IDB9KVxuXG4gICAgICAgIGlmIG5vdCBidWNrZXRzXG4gICAgICAgICAgYnVja2V0cyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1idWNrZXQnKVxuXG4gICAgICAgIGJ1Y2tldHMgPSBidWNrZXRzLmRhdGEobGF5b3V0LCAoZCkgLT4gZC54VmFsKVxuXG4gICAgICAgIGVudGVyID0gYnVja2V0cy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtYnVja2V0IHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiBpbml0aWFsIHRoZW4gZC54IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS54ICArIF9tZXJnZS5hZGRlZFByZWQoZCkud2lkdGh9LCN7ZC55fSkgc2NhbGUoI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9LDEpXCIpXG4gICAgICAgIGVudGVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gZC53aWR0aClcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgICAgZW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cigneCcsIChkKSAtPiBkLndpZHRoIC8gMilcbiAgICAgICAgICAuYXR0cigneScsIC0yMClcbiAgICAgICAgICAuYXR0cih7ZHk6ICcxZW0nLCAndGV4dC1hbmNob3InOidtaWRkbGUnfSlcbiAgICAgICAgICAuc3R5bGUoeydmb250LXNpemUnOicxLjNlbScsIG9wYWNpdHk6IDB9KVxuXG4gICAgICAgIGJ1Y2tldHMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwgI3tkLnl9KSBzY2FsZSgxLDEpXCIpXG4gICAgICAgIGJ1Y2tldHMuc2VsZWN0KCdyZWN0JykudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBkLmhlaWdodClcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgICAgYnVja2V0cy5zZWxlY3QoJ3RleHQnKVxuICAgICAgICAgIC50ZXh0KChkKSAtPiB5LmZvcm1hdHRlZFZhbHVlKGQuZGF0YSkpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaG9zdC5zaG93TGFiZWxzKCkgdGhlbiAxIGVsc2UgMClcblxuICAgICAgICBidWNrZXRzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnh9LCN7ZC55fSkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGluaXRpYWwgPSBmYWxzZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWydyYW5nZVgnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCdyYW5nZVgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5zY2FsZVR5cGUoJ2xpbmVhcicpLmRvbWFpbkNhbGMoJ3JhbmdlRXh0ZW50JylcbiAgICAgICAgQGdldEtpbmQoJ2NvbG9yJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGFiZWxzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgICBob3N0LnNob3dMYWJlbHMoZmFsc2UpXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJyBvciB2YWwgaXMgXCJcIlxuICAgICAgICAgIGhvc3Quc2hvd0xhYmVscyh0cnVlKVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuI1RPRE8gaW1wbGVtZW50IGV4dGVybmFsIGJydXNoaW5nIG9wdGltaXphdGlvbnNcbiNUT0RPIHRlc3Qgc2VsZWN0aW9uIGJlaGF2aW9yIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsaW5lJywgKCRsb2csIGJlaGF2aW9yLCB1dGlscywgdGltaW5nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBfbGF5ZXJLZXlzID0gW11cbiAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgX2RhdGFPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNOZXcgPSBbXVxuICAgICAgX3BhdGhBcnJheSA9IFtdXG4gICAgICBfaW5pdGlhbE9wYWNpdHkgPSAwXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG4gICAgICBsaW5lID0gdW5kZWZpbmVkXG4gICAgICBtYXJrZXJzID0gdW5kZWZpbmVkXG5cbiAgICAgIGJydXNoTGluZSA9IHVuZGVmaW5lZFxuXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGlkeCkgLT5cbiAgICAgICAgX3BhdGhBcnJheSA9IF8udG9BcnJheShfcGF0aFZhbHVlc05ldylcbiAgICAgICAgdHRNb3ZlRGF0YS5hcHBseSh0aGlzLCBbaWR4XSlcblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX3BhdGhBcnJheS5tYXAoKGwpIC0+IHtuYW1lOmxbaWR4XS5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsW2lkeF0ueXYpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsW2lkeF0uY29sb3J9LCB4djpsW2lkeF0ueHZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueHYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbaWR4XS5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkW2lkeF0uY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gZFtpZHhdLnkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X3NjYWxlTGlzdC54LnNjYWxlKCkoX3BhdGhBcnJheVswXVtpZHhdLnh2KSArIG9mZnNldH0pXCIpXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICAgIG1lcmdlZFggPSB1dGlscy5tZXJnZVNlcmllcyh4LnZhbHVlKF9kYXRhT2xkKSwgeC52YWx1ZShkYXRhKSlcbiAgICAgICAgX2xheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBbXVxuXG4gICAgICAgIF9wYXRoVmFsdWVzTmV3ID0ge31cblxuICAgICAgICBmb3Iga2V5IGluIF9sYXllcktleXNcbiAgICAgICAgICBfcGF0aFZhbHVlc05ld1trZXldID0gZGF0YS5tYXAoKGQpLT4ge3g6eC5tYXAoZCkseTp5LnNjYWxlKCkoeS5sYXllclZhbHVlKGQsIGtleSkpLCB4djp4LnZhbHVlKGQpLCB5djp5LmxheWVyVmFsdWUoZCxrZXkpLCBrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIGRhdGE6ZH0pXG5cbiAgICAgICAgICBsYXllciA9IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOltdfVxuICAgICAgICAgICMgZmluZCBzdGFydGluZyB2YWx1ZSBmb3Igb2xkXG4gICAgICAgICAgaSA9IDBcbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMF0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgb2xkTGFzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bbWVyZ2VkWFtpXVswXV1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgd2hpbGUgaSA8IG1lcmdlZFgubGVuZ3RoXG4gICAgICAgICAgICBpZiBtZXJnZWRYW2ldWzFdIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIG5ld0xhc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW21lcmdlZFhbaV1bMV1dXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBpKytcblxuICAgICAgICAgIGZvciB2YWwsIGkgaW4gbWVyZ2VkWFxuICAgICAgICAgICAgdiA9IHtjb2xvcjpsYXllci5jb2xvciwgeDp2YWxbMl19XG4gICAgICAgICAgICAjIHNldCB4IGFuZCB5IHZhbHVlcyBmb3Igb2xkIHZhbHVlcy4gSWYgdGhlcmUgaXMgYSBhZGRlZCB2YWx1ZSwgbWFpbnRhaW4gdGhlIGxhc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIHZhbFsxXSBpcyB1bmRlZmluZWQgI2llIGFuIG9sZCB2YWx1ZSBpcyBkZWxldGVkLCBtYWludGFpbiB0aGUgbGFzdCBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgdi55TmV3ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gbmV3TGFzdC54ICMgYW5pbWF0ZSB0byB0aGUgcHJlZGVzZXNzb3JzIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSB0cnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueU5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS55XG4gICAgICAgICAgICAgIHYueE5ldyA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXS54XG4gICAgICAgICAgICAgIG5ld0xhc3QgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV1cbiAgICAgICAgICAgICAgdi5kZWxldGVkID0gZmFsc2VcblxuICAgICAgICAgICAgaWYgX2RhdGFPbGQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICBpZiAgdmFsWzBdIGlzIHVuZGVmaW5lZCAjIGllIGEgbmV3IHZhbHVlIGhhcyBiZWVuIGFkZGVkXG4gICAgICAgICAgICAgICAgdi55T2xkID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnlcbiAgICAgICAgICAgICAgICB2LnhPbGQgPSBvbGRMYXN0LnggIyBzdGFydCB4LWFuaW1hdGlvbiBmcm9tIHRoZSBwcmVkZWNlc3NvcnMgb2xkIHBvc2l0aW9uXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueVxuICAgICAgICAgICAgICAgIHYueE9sZCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS54XG4gICAgICAgICAgICAgICAgb2xkTGFzdCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2LnhPbGQgPSB2LnhOZXdcbiAgICAgICAgICAgICAgdi55T2xkID0gdi55TmV3XG5cblxuICAgICAgICAgICAgbGF5ZXIudmFsdWUucHVzaCh2KVxuXG4gICAgICAgICAgX2xheW91dC5wdXNoKGxheWVyKVxuXG4gICAgICAgIG9mZnNldCA9IGlmIHguaXNPcmRpbmFsKCkgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIG1hcmtlcnMgPSAobGF5ZXIsIGR1cmF0aW9uKSAtPlxuICAgICAgICAgIGlmIF9zaG93TWFya2Vyc1xuICAgICAgICAgICAgbSA9IGxheWVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpLmRhdGEoXG4gICAgICAgICAgICAgICAgKGwpIC0+IGwudmFsdWVcbiAgICAgICAgICAgICAgLCAoZCkgLT4gZC54XG4gICAgICAgICAgICApXG4gICAgICAgICAgICBtLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LW1hcmtlciB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCA1KVxuICAgICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgICAgICAgICMuc3R5bGUoJ29wYWNpdHknLCBfaW5pdGlhbE9wYWNpdHkpXG4gICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgICAgbVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgLT4gZC55T2xkKVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgLT4gZC54T2xkICsgb2Zmc2V0KVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnd2stY2hhcnQtZGVsZXRlZCcsKGQpIC0+IGQuZGVsZXRlZClcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSAtPiBkLnlOZXcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkKSAtPiBkLnhOZXcgKyBvZmZzZXQpXG4gICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkKSAtPiBpZiBkLmRlbGV0ZWQgdGhlbiAwIGVsc2UgMSlcblxuICAgICAgICAgICAgbS5leGl0KClcbiAgICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsYXllci5zZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pLnN0eWxlKCdvcGFjaXR5JywgMCkucmVtb3ZlKClcblxuICAgICAgICBsaW5lT2xkID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhPbGQpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU9sZClcblxuICAgICAgICBsaW5lTmV3ID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiBkLnhOZXcpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU5ldylcblxuICAgICAgICBicnVzaExpbmUgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55KChkKSAtPiBkLnlOZXcpXG5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIGVudGVyID0gbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgIGVudGVyLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZU5ldyhkLnZhbHVlKSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBfaW5pdGlhbE9wYWNpdHkpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcblxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b2Zmc2V0fSlcIilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lT2xkKGQudmFsdWUpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lTmV3KGQudmFsdWUpKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSkuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXllcnMuY2FsbChtYXJrZXJzLCBvcHRpb25zLmR1cmF0aW9uKVxuXG4gICAgICAgIF9pbml0aWFsT3BhY2l0eSA9IDBcbiAgICAgICAgX2RhdGFPbGQgPSBkYXRhXG4gICAgICAgIF9wYXRoVmFsdWVzT2xkID0gX3BhdGhWYWx1ZXNOZXdcblxuICAgICAgYnJ1c2ggPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxpbmVcIilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBicnVzaExpbmUoZC52YWx1ZSkpXG4gICAgICAgIGxheWVycy5jYWxsKG1hcmtlcnMsIDApXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LngpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnYnJ1c2hEcmF3JywgYnJ1c2hcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2xpbmVWZXJ0aWNhbCcsICgkbG9nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgX2xheW91dCA9IFtdXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgb2Zmc2V0ID0gMFxuICAgICAgX2lkID0gJ2xpbmUnICsgbGluZUNudHIrK1xuXG4gICAgICBwcmVwRGF0YSA9ICh4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgI2xheWVyS2V5cyA9IHkubGF5ZXJLZXlzKEApXG4gICAgICAgICNfbGF5b3V0ID0gbGF5ZXJLZXlzLm1hcCgoa2V5KSA9PiB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpAbWFwKChkKS0+IHt4OngudmFsdWUoZCkseTp5LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgdHRFbnRlciA9IChpZHgsIGF4aXNYLCBjbnRucikgLT5cbiAgICAgICAgY250bnJTZWwgPSBkMy5zZWxlY3QoY250bnIpXG4gICAgICAgIGNudG5yV2lkdGggPSBjbnRuclNlbC5hdHRyKCd3aWR0aCcpXG4gICAgICAgIHBhcmVudCA9IGQzLnNlbGVjdChjbnRuci5wYXJlbnRFbGVtZW50KVxuICAgICAgICBfdHRIaWdobGlnaHQgPSBwYXJlbnQuYXBwZW5kKCdnJylcbiAgICAgICAgX3R0SGlnaGxpZ2h0LmFwcGVuZCgnbGluZScpLmF0dHIoe3gxOjAsIHgyOmNudG5yV2lkdGh9KS5zdHlsZSh7J3BvaW50ZXItZXZlbnRzJzonbm9uZScsIHN0cm9rZTonbGlnaHRncmV5JywgJ3N0cm9rZS13aWR0aCc6MX0pXG4gICAgICAgIF9jaXJjbGVzID0gX3R0SGlnaGxpZ2h0LnNlbGVjdEFsbCgnY2lyY2xlJykuZGF0YShfbGF5b3V0LChkKSAtPiBkLmtleSlcbiAgICAgICAgX2NpcmNsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ3InLCA1KS5hdHRyKCdmaWxsJywgKGQpLT4gZC5jb2xvcikuYXR0cignZmlsbC1vcGFjaXR5JywgMC42KS5hdHRyKCdzdHJva2UnLCAnYmxhY2snKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcblxuICAgICAgICBfdHRIaWdobGlnaHQuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KStvZmZzZXR9KVwiKVxuXG4gICAgICB0dE1vdmVEYXRhID0gKGlkeCkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBfbGF5b3V0Lm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsLnZhbHVlW2lkeF0ueCksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgIHR0TW92ZU1hcmtlciA9IChpZHgpIC0+XG4gICAgICAgIF9jaXJjbGVzID0gdGhpcy5zZWxlY3RBbGwoJ2NpcmNsZScpLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpLT4gZC5jb2xvcilcbiAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuICAgICAgICBfY2lyY2xlcy5hdHRyKCdjeCcsIChkKSAtPiBfc2NhbGVMaXN0Lnguc2NhbGUoKShkLnZhbHVlW2lkeF0ueCkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tfc2NhbGVMaXN0Lnkuc2NhbGUoKShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueSkgKyBvZmZzZXR9KVwiKVxuXG5cbiAgICAgIHNldFRvb2x0aXAgPSAodG9vbHRpcCwgb3ZlcmxheSkgLT5cbiAgICAgICAgX3Rvb2x0aXAgPSB0b29sdGlwXG4gICAgICAgIHRvb2x0aXAob3ZlcmxheSlcbiAgICAgICAgdG9vbHRpcC5pc0hvcml6b250YWwodHJ1ZSlcbiAgICAgICAgdG9vbHRpcC5yZWZyZXNoT25Nb3ZlKHRydWUpXG4gICAgICAgIHRvb2x0aXAub24gXCJtb3ZlLiN7X2lkfVwiLCB0dE1vdmVcbiAgICAgICAgdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG4gICAgICAgIHRvb2x0aXAub24gXCJsZWF2ZS4je19pZH1cIiwgdHRMZWF2ZVxuXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt5OnkudmFsdWUoZCkseDp4LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgICBvZmZzZXQgPSBpZiB5LmlzT3JkaW5hbCgpIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBsaW5lID0gZDMuc3ZnLmxpbmUoKVxuICAgICAgICAgIC54KChkKSAtPiB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgICAueSgoZCkgLT4geS5zY2FsZSgpKGQueSkpXG5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJ3ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tvZmZzZXR9KVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmUoZC52YWx1ZSkpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueSlcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAgICMtLS0gUHJvcGVydHkgT2JzZXJ2ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgfVxuXG4jVE9ETyBpbXBsZW1lbnQgZW50ZXIgLyBleGl0IGFuaW1hdGlvbnMgbGlrZSBpbiBsaW5lXG4jVE9ETyBpbXBsZW1lbnQgZXh0ZXJuYWwgYnJ1c2hpbmcgb3B0aW1pemF0aW9ucyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncGllJywgKCRsb2csIHV0aWxzKSAtPlxuICBwaWVDbnRyID0gMFxuXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnRUEnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICMgc2V0IGNoYXJ0IHNwZWNpZmljIGRlZmF1bHRzXG5cbiAgICBfaWQgPSBcInBpZSN7cGllQ250cisrfVwiXG5cbiAgICBpbm5lciA9IHVuZGVmaW5lZFxuICAgIG91dGVyID0gdW5kZWZpbmVkXG4gICAgbGFiZWxzID0gdW5kZWZpbmVkXG4gICAgcGllQm94ID0gdW5kZWZpbmVkXG4gICAgcG9seWxpbmUgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gW11cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgIF9zaG93TGFiZWxzID0gZmFsc2VcblxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LmNvbG9yLmF4aXNMYWJlbCgpXG4gICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnNpemUuYXhpc0xhYmVsKClcbiAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC5zaXplLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBpbml0aWFsU2hvdyA9IHRydWVcblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAnZHJhd2luZyBwaWUgY2hhcnQgdjInXG5cbiAgICAgIHIgPSBNYXRoLm1pbihvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCkgLyAyXG5cbiAgICAgIGlmIG5vdCBwaWVCb3hcbiAgICAgICAgcGllQm94PSBAYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1waWVCb3gnKVxuICAgICAgcGllQm94LmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcblxuICAgICAgaW5uZXJBcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgICAgLm91dGVyUmFkaXVzKHIgKiBpZiBfc2hvd0xhYmVscyB0aGVuIDAuOCBlbHNlIDEpXG4gICAgICAgIC5pbm5lclJhZGl1cygwKVxuXG4gICAgICBvdXRlckFyYyA9IGQzLnN2Zy5hcmMoKVxuICAgICAgICAub3V0ZXJSYWRpdXMociAqIDAuOSlcbiAgICAgICAgLmlubmVyUmFkaXVzKHIgKiAwLjkpXG5cbiAgICAgIGtleSA9IChkKSAtPiBfc2NhbGVMaXN0LmNvbG9yLnZhbHVlKGQuZGF0YSlcblxuICAgICAgcGllID0gZDMubGF5b3V0LnBpZSgpXG4gICAgICAgIC5zb3J0KG51bGwpXG4gICAgICAgIC52YWx1ZShzaXplLnZhbHVlKVxuXG4gICAgICBhcmNUd2VlbiA9IChhKSAtPlxuICAgICAgICBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSlcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IGkoMClcbiAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgIGlubmVyQXJjKGkodCkpXG5cbiAgICAgIHNlZ21lbnRzID0gcGllKGRhdGEpICMgcGllIGNvbXB1dGVzIGZvciBlYWNoIHNlZ21lbnQgdGhlIHN0YXJ0IGFuZ2xlIGFuZCB0aGUgZW5kIGFuZ2xlXG4gICAgICBfbWVyZ2Uua2V5KGtleSlcbiAgICAgIF9tZXJnZShzZWdtZW50cykuZmlyc3Qoe3N0YXJ0QW5nbGU6MCwgZW5kQW5nbGU6MH0pLmxhc3Qoe3N0YXJ0QW5nbGU6TWF0aC5QSSAqIDIsIGVuZEFuZ2xlOiBNYXRoLlBJICogMn0pXG5cbiAgICAgICMtLS0gRHJhdyBQaWUgc2VnbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBpZiBub3QgaW5uZXJcbiAgICAgICAgaW5uZXIgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtaW5uZXJBcmMnKVxuXG4gICAgICBpbm5lciA9IGlubmVyXG4gICAgICAgIC5kYXRhKHNlZ21lbnRzLGtleSlcblxuICAgICAgaW5uZXIuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuZWFjaCgoZCkgLT4gdGhpcy5fY3VycmVudCA9IGlmIGluaXRpYWxTaG93IHRoZW4gZCBlbHNlIHtzdGFydEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGUsIGVuZEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGV9KVxuICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1pbm5lckFyYyB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+ICBjb2xvci5tYXAoZC5kYXRhKSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbFNob3cgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICBpbm5lclxuICAgICAgICAjLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgLmF0dHJUd2VlbignZCcsYXJjVHdlZW4pXG5cbiAgICAgIGlubmVyLmV4aXQoKS5kYXR1bSgoZCkgLT4gIHtzdGFydEFuZ2xlOl9tZXJnZS5kZWxldGVkU3VjYyhkKS5zdGFydEFuZ2xlLCBlbmRBbmdsZTpfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuc3RhcnRBbmdsZX0pXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0clR3ZWVuKCdkJyxhcmNUd2VlbilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgIy0tLSBEcmF3IFNlZ21lbnQgTGFiZWwgVGV4dCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIG1pZEFuZ2xlID0gKGQpIC0+IGQuc3RhcnRBbmdsZSArIChkLmVuZEFuZ2xlIC0gZC5zdGFydEFuZ2xlKSAvIDJcblxuICAgICAgaWYgX3Nob3dMYWJlbHNcblxuICAgICAgICBsYWJlbHMgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtbGFiZWwnKS5kYXRhKHNlZ21lbnRzLCBrZXkpXG5cbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGFiZWwnKVxuICAgICAgICAgIC5lYWNoKChkKSAtPiBAX2N1cnJlbnQgPSBkKVxuICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywnMS4zZW0nKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnRleHQoKGQpIC0+IHNpemUuZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcblxuICAgICAgICBsYWJlbHMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgICAgIC5hdHRyVHdlZW4oJ3RyYW5zZm9ybScsIChkKSAtPlxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKF90aGlzLl9jdXJyZW50LCBkKVxuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIF90aGlzLl9jdXJyZW50ID0gZDJcbiAgICAgICAgICAgICAgcG9zID0gb3V0ZXJBcmMuY2VudHJvaWQoZDIpXG4gICAgICAgICAgICAgIHBvc1swXSArPSAxNSAqIChpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIDEgZWxzZSAtMSlcbiAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKCN7cG9zfSlcIilcbiAgICAgICAgICAuc3R5bGVUd2VlbigndGV4dC1hbmNob3InLCAoZCkgLT5cbiAgICAgICAgICAgIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoQF9jdXJyZW50LCBkKVxuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIHJldHVybiBpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIFwic3RhcnRcIiBlbHNlIFwiZW5kXCJcbiAgICAgICAgKVxuXG4gICAgICAgIGxhYmVscy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLnN0eWxlKCdvcGFjaXR5JywwKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tIERyYXcgQ29ubmVjdG9yIExpbmVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBwb2x5bGluZSA9IHBpZUJveC5zZWxlY3RBbGwoXCIud2stY2hhcnQtcG9seWxpbmVcIikuZGF0YShzZWdtZW50cywga2V5KVxuXG4gICAgICAgIHBvbHlsaW5lLmVudGVyKClcbiAgICAgICAgLiBhcHBlbmQoXCJwb2x5bGluZVwiKS5hdHRyKCdjbGFzcycsJ3drLWNoYXJ0LXBvbHlsaW5lJylcbiAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXG4gICAgICAgICAgLmVhY2goKGQpIC0+ICB0aGlzLl9jdXJyZW50ID0gZClcblxuICAgICAgICBwb2x5bGluZS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIChkKSAtPiBpZiBkLmRhdGEudmFsdWUgaXMgMCB0aGVuICAwIGVsc2UgLjUpXG4gICAgICAgICAgLmF0dHJUd2VlbihcInBvaW50c1wiLCAoZCkgLT5cbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9jdXJyZW50XG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGQpXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXNcbiAgICAgICAgICAgIHJldHVybiAodCkgLT5cbiAgICAgICAgICAgICAgZDIgPSBpbnRlcnBvbGF0ZSh0KVxuICAgICAgICAgICAgICBfdGhpcy5fY3VycmVudCA9IGQyO1xuICAgICAgICAgICAgICBwb3MgPSBvdXRlckFyYy5jZW50cm9pZChkMilcbiAgICAgICAgICAgICAgcG9zWzBdICs9IDEwICogKGlmIG1pZEFuZ2xlKGQyKSA8IE1hdGguUEkgdGhlbiAgMSBlbHNlIC0xKVxuICAgICAgICAgICAgICByZXR1cm4gW2lubmVyQXJjLmNlbnRyb2lkKGQyKSwgb3V0ZXJBcmMuY2VudHJvaWQoZDIpLCBwb3NdO1xuICAgICAgICAgIClcblxuICAgICAgICBwb2x5bGluZS5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuICAgICAgICAgIC5yZW1vdmUoKTtcblxuICAgICAgZWxzZVxuICAgICAgICBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtcG9seWxpbmUnKS5yZW1vdmUoKVxuICAgICAgICBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtbGFiZWwnKS5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsU2hvdyA9IGZhbHNlXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgX3NjYWxlTGlzdCA9IHRoaXMuZ2V0U2NhbGVzKFsnc2l6ZScsICdjb2xvciddKVxuICAgICAgX3NjYWxlTGlzdC5jb2xvci5zY2FsZVR5cGUoJ2NhdGVnb3J5MjAnKVxuICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbHMnLCAodmFsKSAtPlxuICAgICAgaWYgdmFsIGlzICdmYWxzZSdcbiAgICAgICAgX3Nob3dMYWJlbHMgPSBmYWxzZVxuICAgICAgZWxzZSBpZiB2YWwgaXMgJ3RydWUnIG9yIHZhbCBpcyBcIlwiXG4gICAgICAgIF9zaG93TGFiZWxzID0gdHJ1ZVxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG4gIH1cblxuICAjVE9ETyB2ZXJpZnkgYmVoYXZpb3Igd2l0aCBjdXN0b20gdG9vbHRpcHMiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NjYXR0ZXInLCAoJGxvZywgdXRpbHMpIC0+XG4gIHNjYXR0ZXJDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgICBfaWQgPSAnc2NhdHRlcicgKyBzY2F0dGVyQ250KytcbiAgICAgIF9zY2FsZUxpc3QgPSBbXVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIGZvciBzTmFtZSwgc2NhbGUgb2YgX3NjYWxlTGlzdFxuICAgICAgICAgIEBsYXllcnMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBzY2FsZS5heGlzTGFiZWwoKSxcbiAgICAgICAgICAgIHZhbHVlOiBzY2FsZS5mb3JtYXR0ZWRWYWx1ZShkYXRhKSxcbiAgICAgICAgICAgIGNvbG9yOiBpZiBzTmFtZSBpcyAnY29sb3InIHRoZW4geydiYWNrZ3JvdW5kLWNvbG9yJzpzY2FsZS5tYXAoZGF0YSl9IGVsc2UgdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGF0aDogaWYgc05hbWUgaXMgJ3NoYXBlJyB0aGVuIGQzLnN2Zy5zeW1ib2woKS50eXBlKHNjYWxlLm1hcChkYXRhKSkuc2l6ZSg4MCkoKSBlbHNlIHVuZGVmaW5lZFxuICAgICAgICAgICAgY2xhc3M6IGlmIHNOYW1lIGlzICdzaGFwZScgdGhlbiAnd2stY2hhcnQtdHQtc3ZnLXNoYXBlJyBlbHNlICcnXG4gICAgICAgICAgfSlcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGluaXRpYWxTaG93ID0gdHJ1ZVxuXG5cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG4gICAgICAgICMkbG9nLmRlYnVnICdkcmF3aW5nIHNjYXR0ZXIgY2hhcnQnXG4gICAgICAgIGluaXQgPSAocykgLT5cbiAgICAgICAgICBpZiBpbml0aWFsU2hvd1xuICAgICAgICAgICAgcy5zdHlsZSgnZmlsbCcsIGNvbG9yLm1hcClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCktPiBcInRyYW5zbGF0ZSgje3gubWFwKGQpfSwje3kubWFwKGQpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICAgIGluaXRpYWxTaG93ID0gZmFsc2VcblxuICAgICAgICBwb2ludHMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtcG9pbnRzJylcbiAgICAgICAgICAuZGF0YShkYXRhKVxuICAgICAgICBwb2ludHMuZW50ZXIoKVxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1wb2ludHMgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+IFwidHJhbnNsYXRlKCN7eC5tYXAoZCl9LCN7eS5tYXAoZCl9KVwiKVxuICAgICAgICAgIC5jYWxsKGluaXQpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgIHBvaW50c1xuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIGQzLnN2Zy5zeW1ib2woKS50eXBlKChkKSAtPiBzaGFwZS5tYXAoZCkpLnNpemUoKGQpIC0+IHNpemUubWFwKGQpICogc2l6ZS5tYXAoZCkpKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGNvbG9yLm1hcClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT4gXCJ0cmFuc2xhdGUoI3t4Lm1hcChkKX0sI3t5Lm1hcChkKX0pXCIpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBwb2ludHMuZXhpdCgpLnJlbW92ZSgpXG5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZSddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ2V4dGVudCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICB9XG5cbiNUT0RPIHZlcmlmeSBiZWhhdmlvciB3aXRoIGN1c3RvbSB0b29sdGlwc1xuI1RPRE8gSW1wbGVtZW50IGluIG5ldyBkZW1vIGFwcCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc3BpZGVyJywgKCRsb2csIHV0aWxzKSAtPlxuICBzcGlkZXJDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmRlYnVnICdidWJibGVDaGFydCBsaW5rZWQnXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9pZCA9ICdzcGlkZXInICsgc3BpZGVyQ250cisrXG4gICAgICBheGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgX2RhdGEgPSB1bmRlZmluZWRcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgQGxheWVycyA9IF9kYXRhLm1hcCgoZCkgLT4gIHtuYW1lOl9zY2FsZUxpc3QueC52YWx1ZShkKSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGRbZGF0YV0pLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzpfc2NhbGVMaXN0LmNvbG9yLnNjYWxlKCkoZGF0YSl9fSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgICAkbG9nLmxvZyBkYXRhXG4gICAgICAgICMgY29tcHV0ZSBjZW50ZXIgb2YgYXJlYVxuICAgICAgICBjZW50ZXJYID0gb3B0aW9ucy53aWR0aC8yXG4gICAgICAgIGNlbnRlclkgPSBvcHRpb25zLmhlaWdodC8yXG4gICAgICAgIHJhZGl1cyA9IGQzLm1pbihbY2VudGVyWCwgY2VudGVyWV0pICogMC44XG4gICAgICAgIHRleHRPZmZzID0gMjBcbiAgICAgICAgbmJyQXhpcyA9IGRhdGEubGVuZ3RoXG4gICAgICAgIGFyYyA9IE1hdGguUEkgKiAyIC8gbmJyQXhpc1xuICAgICAgICBkZWdyID0gMzYwIC8gbmJyQXhpc1xuXG4gICAgICAgIGF4aXNHID0gdGhpcy5zZWxlY3QoJy53ay1jaGFydC1heGlzJylcbiAgICAgICAgaWYgYXhpc0cuZW1wdHkoKVxuICAgICAgICAgIGF4aXNHID0gdGhpcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1heGlzJylcblxuICAgICAgICB0aWNrcyA9IHkuc2NhbGUoKS50aWNrcyh5LnRpY2tzKCkpXG4gICAgICAgIHkuc2NhbGUoKS5yYW5nZShbcmFkaXVzLDBdKSAjIHRyaWNrcyB0aGUgd2F5IGF4aXMgYXJlIGRyYXduLiBOb3QgcHJldHR5LCBidXQgd29ya3MgOi0pXG4gICAgICAgIGF4aXMuc2NhbGUoeS5zY2FsZSgpKS5vcmllbnQoJ3JpZ2h0JykudGlja1ZhbHVlcyh0aWNrcykudGlja0Zvcm1hdCh5LnRpY2tGb3JtYXQoKSlcbiAgICAgICAgYXhpc0cuY2FsbChheGlzKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCN7Y2VudGVyWS1yYWRpdXN9KVwiKVxuICAgICAgICB5LnNjYWxlKCkucmFuZ2UoWzAscmFkaXVzXSlcblxuICAgICAgICBsaW5lcyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy1saW5lJykuZGF0YShkYXRhLChkKSAtPiBkLmF4aXMpXG4gICAgICAgIGxpbmVzLmVudGVyKClcbiAgICAgICAgICAuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcy1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdkYXJrZ3JleScpXG5cbiAgICAgICAgbGluZXNcbiAgICAgICAgICAuYXR0cih7eDE6MCwgeTE6MCwgeDI6MCwgeTI6cmFkaXVzfSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCxpKSAtPiBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KXJvdGF0ZSgje2RlZ3IgKiBpfSlcIilcblxuICAgICAgICBsaW5lcy5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICAjZHJhdyB0aWNrIGxpbmVzXG4gICAgICAgIHRpY2tMaW5lID0gZDMuc3ZnLmxpbmUoKS54KChkKSAtPiBkLngpLnkoKGQpLT5kLnkpXG4gICAgICAgIHRpY2tQYXRoID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC10aWNrUGF0aCcpLmRhdGEodGlja3MpXG4gICAgICAgIHRpY2tQYXRoLmVudGVyKCkuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtdGlja1BhdGgnKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsICdub25lJykuc3R5bGUoJ3N0cm9rZScsICdsaWdodGdyZXknKVxuXG4gICAgICAgIHRpY2tQYXRoXG4gICAgICAgICAgLmF0dHIoJ2QnLChkKSAtPlxuICAgICAgICAgICAgcCA9IGRhdGEubWFwKChhLCBpKSAtPiB7eDpNYXRoLnNpbihhcmMqaSkgKiB5LnNjYWxlKCkoZCkseTpNYXRoLmNvcyhhcmMqaSkgKiB5LnNjYWxlKCkoZCl9KVxuICAgICAgICAgICAgdGlja0xpbmUocCkgKyAnWicpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7Y2VudGVyWH0sICN7Y2VudGVyWX0pXCIpXG5cbiAgICAgICAgdGlja1BhdGguZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgYXhpc0xhYmVscyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy10ZXh0JykuZGF0YShkYXRhLChkKSAtPiB4LnZhbHVlKGQpKVxuICAgICAgICBheGlzTGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcy10ZXh0JylcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgICAgIC5hdHRyKCdkeScsICcwLjhlbScpXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgIGF4aXNMYWJlbHNcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIHg6IChkLCBpKSAtPiBjZW50ZXJYICsgTWF0aC5zaW4oYXJjICogaSkgKiAocmFkaXVzICsgdGV4dE9mZnMpXG4gICAgICAgICAgICAgIHk6IChkLCBpKSAtPiBjZW50ZXJZICsgTWF0aC5jb3MoYXJjICogaSkgKiAocmFkaXVzICsgdGV4dE9mZnMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIC50ZXh0KChkKSAtPiB4LnZhbHVlKGQpKVxuXG4gICAgICAgICMgZHJhdyBkYXRhIGxpbmVzXG5cbiAgICAgICAgZGF0YVBhdGggPSBkMy5zdmcubGluZSgpLngoKGQpIC0+IGQueCkueSgoZCkgLT4gZC55KVxuXG4gICAgICAgIGRhdGFMaW5lID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC1kYXRhLWxpbmUnKS5kYXRhKHkubGF5ZXJLZXlzKGRhdGEpKVxuICAgICAgICBkYXRhTGluZS5lbnRlcigpLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWRhdGEtbGluZScpXG4gICAgICAgICAgLnN0eWxlKHtcbiAgICAgICAgICAgIHN0cm9rZTooZCkgLT4gY29sb3Iuc2NhbGUoKShkKVxuICAgICAgICAgICAgZmlsbDooZCkgLT4gY29sb3Iuc2NhbGUoKShkKVxuICAgICAgICAgICAgJ2ZpbGwtb3BhY2l0eSc6IDAuMlxuICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDJcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIGRhdGFMaW5lLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIHAgPSBkYXRhLm1hcCgoYSwgaSkgLT4ge3g6TWF0aC5zaW4oYXJjKmkpICogeS5zY2FsZSgpKGFbZF0pLHk6TWF0aC5jb3MoYXJjKmkpICogeS5zY2FsZSgpKGFbZF0pfSlcbiAgICAgICAgICAgIGRhdGFQYXRoKHApICsgJ1onXG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KVwiKVxuXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgX3NjYWxlTGlzdC55LmRvbWFpbkNhbGMoJ21heCcpXG4gICAgICAgIF9zY2FsZUxpc3QueC5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICAjQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gIH1cblxuI1RPRE8gdmVyaWZ5IGJlaGF2aW9yIHdpdGggY3VzdG9tIHRvb2x0aXBzXG4jVE9ETyBmaXggJ3Rvb2x0aXAgYXR0cmlidXRlIGxpc3QgdG9vIGxvbmcnIHByb2JsZW1cbiNUT0RPIGFkZCBlbnRlciAvIGV4aXQgYW5pbWF0aW9uIGJlaGF2aW9yXG4jVE9ETyBJbXBsZW1lbnQgZGF0YSBsYWJlbHNcbiNUT0RPIGltcGxlbWVudCBhbmQgdGVzdCBvYmplY3Qgc2VsZWN0aW9uIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JCcnVzaCcsICgkbG9nLCAkd2luZG93LCBzZWxlY3Rpb25TaGFyaW5nLCB0aW1pbmcpIC0+XG5cbiAgYmVoYXZpb3JCcnVzaCA9ICgpIC0+XG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBfYWN0aXZlID0gZmFsc2VcbiAgICBfb3ZlcmxheSA9IHVuZGVmaW5lZFxuICAgIF9leHRlbnQgPSB1bmRlZmluZWRcbiAgICBfc3RhcnRQb3MgPSB1bmRlZmluZWRcbiAgICBfZXZUYXJnZXREYXRhID0gdW5kZWZpbmVkXG4gICAgX2FyZWEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9hcmVhU2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2FyZWFCb3ggPSB1bmRlZmluZWRcbiAgICBfYmFja2dyb3VuZEJveCA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfc2VsZWN0YWJsZXMgPSAgdW5kZWZpbmVkXG4gICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcbiAgICBfeCA9IHVuZGVmaW5lZFxuICAgIF95ID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICBfYnJ1c2hYWSA9IGZhbHNlXG4gICAgX2JydXNoWCA9IGZhbHNlXG4gICAgX2JydXNoWSA9IGZhbHNlXG4gICAgX2JvdW5kc0lkeCA9IHVuZGVmaW5lZFxuICAgIF9ib3VuZHNWYWx1ZXMgPSB1bmRlZmluZWRcbiAgICBfYm91bmRzRG9tYWluID0gdW5kZWZpbmVkXG4gICAgX2JydXNoRXZlbnRzID0gZDMuZGlzcGF0Y2goJ2JydXNoU3RhcnQnLCAnYnJ1c2gnLCAnYnJ1c2hFbmQnKVxuXG4gICAgbGVmdCA9IHRvcCA9IHJpZ2h0ID0gYm90dG9tID0gc3RhcnRUb3AgPSBzdGFydExlZnQgPSBzdGFydFJpZ2h0ID0gc3RhcnRCb3R0b20gPSB1bmRlZmluZWRcblxuICAgICMtLS0gQnJ1c2ggdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcG9zaXRpb25CcnVzaEVsZW1lbnRzID0gKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSkgLT5cbiAgICAgIHdpZHRoID0gcmlnaHQgLSBsZWZ0XG4gICAgICBoZWlnaHQgPSBib3R0b20gLSB0b3BcblxuICAgICAgIyBwb3NpdGlvbiByZXNpemUtaGFuZGxlcyBpbnRvIHRoZSByaWdodCBjb3JuZXJzXG4gICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7Ym90dG9tfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LWUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbmUnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje3RvcH0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW53JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tyaWdodH0sI3tib3R0b219KVwiKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3tib3R0b219KVwiKVxuICAgICAgICBfZXh0ZW50LmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCkuYXR0cigneCcsIGxlZnQpLmF0dHIoJ3knLCB0b3ApXG4gICAgICBpZiBfYnJ1c2hYXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXcnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LDApXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LDApXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodClcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBfYXJlYUJveC5oZWlnaHQpLmF0dHIoJ3gnLCBsZWZ0KS5hdHRyKCd5JywgMClcbiAgICAgIGlmIF9icnVzaFlcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbicpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3t0b3B9KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje2JvdHRvbX0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW4nKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1zJykuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCBfYXJlYUJveC53aWR0aClcbiAgICAgICAgX2V4dGVudC5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpLmF0dHIoJ3gnLCAwKS5hdHRyKCd5JywgdG9wKVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldFNlbGVjdGVkT2JqZWN0cyA9ICgpIC0+XG4gICAgICBlciA9IF9leHRlbnQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBfc2VsZWN0YWJsZXMuZWFjaCgoZCkgLT5cbiAgICAgICAgICBjciA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICB4SGl0ID0gZXIubGVmdCA8IGNyLnJpZ2h0IC0gY3Iud2lkdGggLyAzIGFuZCBjci5sZWZ0ICsgY3Iud2lkdGggLyAzIDwgZXIucmlnaHRcbiAgICAgICAgICB5SGl0ID0gZXIudG9wIDwgY3IuYm90dG9tIC0gY3IuaGVpZ2h0IC8gMyBhbmQgY3IudG9wICsgY3IuaGVpZ2h0IC8gMyA8IGVyLmJvdHRvbVxuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCd3ay1jaGFydC1zZWxlY3RlZCcsIHlIaXQgYW5kIHhIaXQpXG4gICAgICAgIClcbiAgICAgIHJldHVybiBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGVkJykuZGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgc2V0U2VsZWN0aW9uID0gKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSkgLT5cbiAgICAgIGlmIF9icnVzaFhcbiAgICAgICAgX2JvdW5kc0lkeCA9IFttZS54KCkuaW52ZXJ0KGxlZnQpLCBtZS54KCkuaW52ZXJ0KHJpZ2h0KV1cbiAgICAgICAgaWYgbWUueCgpLmlzT3JkaW5hbCgpXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IF9kYXRhLm1hcCgoZCkgLT4gbWUueCgpLnZhbHVlKGQpKS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBbbWUueCgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMF1dKSwgbWUueCgpLnZhbHVlKF9kYXRhW19ib3VuZHNJZHhbMV1dKV1cbiAgICAgICAgX2JvdW5kc0RvbWFpbiA9IF9kYXRhLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgaWYgX2JydXNoWVxuICAgICAgICBfYm91bmRzSWR4ID0gW21lLnkoKS5pbnZlcnQoYm90dG9tKSwgbWUueSgpLmludmVydCh0b3ApXVxuICAgICAgICBpZiBtZS55KCkuaXNPcmRpbmFsKClcbiAgICAgICAgICBfYm91bmRzVmFsdWVzID0gX2RhdGEubWFwKChkKSAtPiBtZS55KCkudmFsdWUoZCkpLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFttZS55KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFswXV0pLCBtZS55KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFsxXV0pXVxuICAgICAgICBfYm91bmRzRG9tYWluID0gX2RhdGEuc2xpY2UoX2JvdW5kc0lkeFswXSwgX2JvdW5kc0lkeFsxXSArIDEpXG4gICAgICBpZiBfYnJ1c2hYWVxuICAgICAgICBfYm91bmRzSWR4ID0gW11cbiAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFtdXG4gICAgICAgIF9ib3VuZHNEb21haW4gPSBnZXRTZWxlY3RlZE9iamVjdHMoKVxuXG4gICAgIy0tLSBCcnVzaFN0YXJ0IEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG5cbiAgICBicnVzaFN0YXJ0ID0gKCkgLT5cbiAgICAgICNyZWdpc3RlciBhIG1vdXNlIGhhbmRsZXJzIGZvciB0aGUgYnJ1c2hcbiAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIF9ldlRhcmdldERhdGEgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5kYXR1bSgpXG4gICAgICBfIGlmIG5vdCBfZXZUYXJnZXREYXRhXG4gICAgICAgIF9ldlRhcmdldERhdGEgPSB7bmFtZTonZm9yd2FyZGVkJ31cbiAgICAgIF9hcmVhQm94ID0gX2FyZWEuZ2V0QkJveCgpXG4gICAgICBfc3RhcnRQb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIHN0YXJ0VG9wID0gdG9wXG4gICAgICBzdGFydExlZnQgPSBsZWZ0XG4gICAgICBzdGFydFJpZ2h0ID0gcmlnaHRcbiAgICAgIHN0YXJ0Qm90dG9tID0gYm90dG9tXG4gICAgICBkMy5zZWxlY3QoX2FyZWEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKS5zZWxlY3RBbGwoXCIud2stY2hhcnQtcmVzaXplXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKVxuICAgICAgZDMuc2VsZWN0KCdib2R5Jykuc3R5bGUoJ2N1cnNvcicsIGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpLnN0eWxlKCdjdXJzb3InKSlcblxuICAgICAgZDMuc2VsZWN0KCR3aW5kb3cpLm9uKCdtb3VzZW1vdmUuYnJ1c2gnLCBicnVzaE1vdmUpLm9uKCdtb3VzZXVwLmJydXNoJywgYnJ1c2hFbmQpXG5cbiAgICAgIF90b29sdGlwLmhpZGUodHJ1ZSlcbiAgICAgIF9ib3VuZHNJZHggPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RhYmxlcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2hTdGFydCgpXG4gICAgICB0aW1pbmcuY2xlYXIoKVxuICAgICAgdGltaW5nLmluaXQoKVxuXG4gICAgIy0tLSBCcnVzaEVuZCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGJydXNoRW5kID0gKCkgLT5cbiAgICAgICNkZS1yZWdpc3RlciBoYW5kbGVyc1xuXG4gICAgICBkMy5zZWxlY3QoJHdpbmRvdykub24gJ21vdXNlbW92ZS5icnVzaCcsIG51bGxcbiAgICAgIGQzLnNlbGVjdCgkd2luZG93KS5vbiAnbW91c2V1cC5icnVzaCcsIG51bGxcbiAgICAgIGQzLnNlbGVjdChfYXJlYSkuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnYWxsJykuc2VsZWN0QWxsKCcud2stY2hhcnQtcmVzaXplJykuc3R5bGUoJ2Rpc3BsYXknLCBudWxsKSAjIHNob3cgdGhlIHJlc2l6ZSBoYW5kbGVyc1xuICAgICAgZDMuc2VsZWN0KCdib2R5Jykuc3R5bGUoJ2N1cnNvcicsIG51bGwpXG4gICAgICBpZiBib3R0b20gLSB0b3AgaXMgMCBvciByaWdodCAtIGxlZnQgaXMgMFxuICAgICAgICAjYnJ1c2ggaXMgZW1wdHlcbiAgICAgICAgZDMuc2VsZWN0KF9hcmVhKS5zZWxlY3RBbGwoJy53ay1jaGFydC1yZXNpemUnKS5zdHlsZSgnZGlzcGxheScsICdub25lJylcbiAgICAgIF90b29sdGlwLmhpZGUoZmFsc2UpXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2hFbmQoX2JvdW5kc0lkeClcbiAgICAgIHRpbWluZy5yZXBvcnQoKVxuXG4gICAgIy0tLSBCcnVzaE1vdmUgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGJydXNoTW92ZSA9ICgpIC0+XG4gICAgICAkbG9nLmluZm8gJ2JydXNobW92ZSdcbiAgICAgIHBvcyA9IGQzLm1vdXNlKF9hcmVhKVxuICAgICAgZGVsdGFYID0gcG9zWzBdIC0gX3N0YXJ0UG9zWzBdXG4gICAgICBkZWx0YVkgPSBwb3NbMV0gLSBfc3RhcnRQb3NbMV1cblxuICAgICAgIyB0aGlzIGVsYWJvcmF0ZSBjb2RlIGlzIG5lZWRlZCB0byBkZWFsIHdpdGggc2NlbmFyaW9zIHdoZW4gbW91c2UgbW92ZXMgZmFzdCBhbmQgdGhlIGV2ZW50cyBkbyBub3QgaGl0IHgveSArIGRlbHRhXG4gICAgICAjIGRvZXMgbm90IGhpIHRoZSAwIHBvaW50IG1heWUgdGhlcmUgaXMgYSBtb3JlIGVsZWdhbnQgd2F5IHRvIHdyaXRlIHRoaXMsIGJ1dCBmb3Igbm93IGl0IHdvcmtzIDotKVxuXG4gICAgICBsZWZ0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0TGVmdCArIGRlbHRhXG4gICAgICAgIGxlZnQgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydFJpZ2h0IHRoZW4gcG9zIGVsc2Ugc3RhcnRSaWdodCkgZWxzZSAwXG4gICAgICAgIHJpZ2h0ID0gaWYgcG9zIDw9IF9hcmVhQm94LndpZHRoIHRoZW4gKGlmIHBvcyA8IHN0YXJ0UmlnaHQgdGhlbiBzdGFydFJpZ2h0IGVsc2UgcG9zKSBlbHNlIF9hcmVhQm94LndpZHRoXG5cbiAgICAgIHJpZ2h0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0UmlnaHQgKyBkZWx0YVxuICAgICAgICBsZWZ0ID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRMZWZ0IHRoZW4gcG9zIGVsc2Ugc3RhcnRMZWZ0KSBlbHNlIDBcbiAgICAgICAgcmlnaHQgPSBpZiBwb3MgPD0gX2FyZWFCb3gud2lkdGggdGhlbiAoaWYgcG9zIDwgc3RhcnRMZWZ0IHRoZW4gc3RhcnRMZWZ0IGVsc2UgcG9zKSBlbHNlIF9hcmVhQm94LndpZHRoXG5cbiAgICAgIHRvcE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydFRvcCArIGRlbHRhXG4gICAgICAgIHRvcCA9IGlmIHBvcyA+PSAwIHRoZW4gKGlmIHBvcyA8IHN0YXJ0Qm90dG9tIHRoZW4gcG9zIGVsc2Ugc3RhcnRCb3R0b20pIGVsc2UgMFxuICAgICAgICBib3R0b20gPSBpZiBwb3MgPD0gX2FyZWFCb3guaGVpZ2h0IHRoZW4gKGlmIHBvcyA+IHN0YXJ0Qm90dG9tIHRoZW4gcG9zIGVsc2Ugc3RhcnRCb3R0b20gKSBlbHNlIF9hcmVhQm94LmhlaWdodFxuXG4gICAgICBib3R0b21NdiA9IChkZWx0YSkgLT5cbiAgICAgICAgcG9zID0gc3RhcnRCb3R0b20gKyBkZWx0YVxuICAgICAgICB0b3AgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydFRvcCB0aGVuIHBvcyBlbHNlIHN0YXJ0VG9wKSBlbHNlIDBcbiAgICAgICAgYm90dG9tID0gaWYgcG9zIDw9IF9hcmVhQm94LmhlaWdodCB0aGVuIChpZiBwb3MgPiBzdGFydFRvcCB0aGVuIHBvcyBlbHNlIHN0YXJ0VG9wICkgZWxzZSBfYXJlYUJveC5oZWlnaHRcblxuICAgICAgaG9yTXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIGlmIHN0YXJ0TGVmdCArIGRlbHRhID49IDBcbiAgICAgICAgICBpZiBzdGFydFJpZ2h0ICsgZGVsdGEgPD0gX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICAgIGxlZnQgPSBzdGFydExlZnQgKyBkZWx0YVxuICAgICAgICAgICAgcmlnaHQgPSBzdGFydFJpZ2h0ICsgZGVsdGFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByaWdodCA9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgICBsZWZ0ID0gX2FyZWFCb3gud2lkdGggLSAoc3RhcnRSaWdodCAtIHN0YXJ0TGVmdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxlZnQgPSAwXG4gICAgICAgICAgcmlnaHQgPSBzdGFydFJpZ2h0IC0gc3RhcnRMZWZ0XG5cbiAgICAgIHZlcnRNdiA9IChkZWx0YSkgLT5cbiAgICAgICAgaWYgc3RhcnRUb3AgKyBkZWx0YSA+PSAwXG4gICAgICAgICAgaWYgc3RhcnRCb3R0b20gKyBkZWx0YSA8PSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgIHRvcCA9IHN0YXJ0VG9wICsgZGVsdGFcbiAgICAgICAgICAgIGJvdHRvbSA9IHN0YXJ0Qm90dG9tICsgZGVsdGFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBib3R0b20gPSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgIHRvcCA9IF9hcmVhQm94LmhlaWdodCAtIChzdGFydEJvdHRvbSAtIHN0YXJ0VG9wKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdG9wID0gMFxuICAgICAgICAgIGJvdHRvbSA9IHN0YXJ0Qm90dG9tIC0gc3RhcnRUb3BcblxuICAgICAgc3dpdGNoIF9ldlRhcmdldERhdGEubmFtZVxuICAgICAgICB3aGVuICdiYWNrZ3JvdW5kJywgJ2ZvcndhcmRlZCdcbiAgICAgICAgICBpZiBkZWx0YVggKyBfc3RhcnRQb3NbMF0gPiAwXG4gICAgICAgICAgICBsZWZ0ID0gaWYgZGVsdGFYIDwgMCB0aGVuIF9zdGFydFBvc1swXSArIGRlbHRhWCBlbHNlIF9zdGFydFBvc1swXVxuICAgICAgICAgICAgaWYgbGVmdCArIE1hdGguYWJzKGRlbHRhWCkgPCBfYXJlYUJveC53aWR0aFxuICAgICAgICAgICAgICByaWdodCA9IGxlZnQgKyBNYXRoLmFicyhkZWx0YVgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJpZ2h0ID0gX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsZWZ0ID0gMFxuXG4gICAgICAgICAgaWYgZGVsdGFZICsgX3N0YXJ0UG9zWzFdID4gMFxuICAgICAgICAgICAgdG9wID0gaWYgZGVsdGFZIDwgMCB0aGVuIF9zdGFydFBvc1sxXSArIGRlbHRhWSBlbHNlIF9zdGFydFBvc1sxXVxuICAgICAgICAgICAgaWYgdG9wICsgTWF0aC5hYnMoZGVsdGFZKSA8IF9hcmVhQm94LmhlaWdodFxuICAgICAgICAgICAgICBib3R0b20gPSB0b3AgKyBNYXRoLmFicyhkZWx0YVkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGJvdHRvbSA9IF9hcmVhQm94LmhlaWdodFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRvcCA9IDBcbiAgICAgICAgd2hlbiAnZXh0ZW50J1xuICAgICAgICAgIHZlcnRNdihkZWx0YVkpOyBob3JNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ24nXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKVxuICAgICAgICB3aGVuICdzJ1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSlcbiAgICAgICAgd2hlbiAndydcbiAgICAgICAgICBsZWZ0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICdlJ1xuICAgICAgICAgIHJpZ2h0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICdudydcbiAgICAgICAgICB0b3BNdihkZWx0YVkpOyBsZWZ0TXYoZGVsdGFYKVxuICAgICAgICB3aGVuICduZSdcbiAgICAgICAgICB0b3BNdihkZWx0YVkpOyByaWdodE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnc3cnXG4gICAgICAgICAgYm90dG9tTXYoZGVsdGFZKTsgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnc2UnXG4gICAgICAgICAgYm90dG9tTXYoZGVsdGFZKTsgcmlnaHRNdihkZWx0YVgpXG5cbiAgICAgIHBvc2l0aW9uQnJ1c2hFbGVtZW50cyhsZWZ0LCByaWdodCwgdG9wLCBib3R0b20pXG4gICAgICBzZXRTZWxlY3Rpb24obGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuICAgICAgX2JydXNoRXZlbnRzLmJydXNoKF9ib3VuZHNJZHgsIF9ib3VuZHNWYWx1ZXMsIF9ib3VuZHNEb21haW4pXG4gICAgICBzZWxlY3Rpb25TaGFyaW5nLnNldFNlbGVjdGlvbiBfYm91bmRzVmFsdWVzLCBfYnJ1c2hHcm91cFxuXG4gICAgIy0tLSBCcnVzaCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmJydXNoID0gKHMpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX292ZXJsYXlcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9hY3RpdmUgdGhlbiByZXR1cm5cbiAgICAgICAgX292ZXJsYXkgPSBzXG4gICAgICAgIF9icnVzaFhZID0gbWUueCgpIGFuZCBtZS55KClcbiAgICAgICAgX2JydXNoWCA9IG1lLngoKSBhbmQgbm90IG1lLnkoKVxuICAgICAgICBfYnJ1c2hZID0gbWUueSgpIGFuZCBub3QgbWUueCgpXG4gICAgICAgICMgY3JlYXRlIHRoZSBoYW5kbGVyIGVsZW1lbnRzIGFuZCByZWdpc3RlciB0aGUgaGFuZGxlcnNcbiAgICAgICAgcy5zdHlsZSh7J3BvaW50ZXItZXZlbnRzJzogJ2FsbCcsIGN1cnNvcjogJ2Nyb3NzaGFpcid9KVxuICAgICAgICBfZXh0ZW50ID0gcy5hcHBlbmQoJ3JlY3QnKS5hdHRyKHtjbGFzczond2stY2hhcnQtZXh0ZW50JywgeDowLCB5OjAsIHdpZHRoOjAsIGhlaWdodDowfSkuc3R5bGUoJ2N1cnNvcicsJ21vdmUnKS5kYXR1bSh7bmFtZTonZXh0ZW50J30pXG4gICAgICAgICMgcmVzaXplIGhhbmRsZXMgZm9yIHRoZSBzaWRlc1xuICAgICAgICBpZiBfYnJ1c2hZIG9yIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbicpLnN0eWxlKHtjdXJzb3I6J25zLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OjAsIHk6IC0zLCB3aWR0aDowLCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOiduJ30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtcycpLnN0eWxlKHtjdXJzb3I6J25zLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OjAsIHk6IC0zLCB3aWR0aDowLCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidzJ30pXG4gICAgICAgIGlmIF9icnVzaFggb3IgX2JydXNoWFlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC13Jykuc3R5bGUoe2N1cnNvcjonZXctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3k6MCwgeDogLTMsIHdpZHRoOjYsIGhlaWdodDowfSkuZGF0dW0oe25hbWU6J3cnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1lJykuc3R5bGUoe2N1cnNvcjonZXctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3k6MCwgeDogLTMsIHdpZHRoOjYsIGhlaWdodDowfSkuZGF0dW0oe25hbWU6J2UnfSlcbiAgICAgICAgIyByZXNpemUgaGFuZGxlcyBmb3IgdGhlIGNvcm5lcnNcbiAgICAgICAgaWYgX2JydXNoWFlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1udycpLnN0eWxlKHtjdXJzb3I6J253c2UtcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J253J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbmUnKS5zdHlsZSh7Y3Vyc29yOiduZXN3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOiduZSd9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LXN3Jykuc3R5bGUoe2N1cnNvcjonbmVzdy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6IC0zLCB5OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonc3cnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1zZScpLnN0eWxlKHtjdXJzb3I6J253c2UtcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J3NlJ30pXG4gICAgICAgICNyZWdpc3RlciBoYW5kbGVyLiBQbGVhc2Ugbm90ZSwgYnJ1c2ggd2FudHMgdGhlIG1vdXNlIGRvd24gZXhjbHVzaXZlbHkgISEhXG4gICAgICAgIHMub24gJ21vdXNlZG93bi5icnVzaCcsIGJydXNoU3RhcnRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIEV4dGVudCByZXNpemUgaGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcmVzaXplRXh0ZW50ID0gKCkgLT5cbiAgICAgIGlmIF9hcmVhQm94XG4gICAgICAgICRsb2cuaW5mbyAncmVzaXplSGFuZGxlcidcbiAgICAgICAgbmV3Qm94ID0gX2FyZWEuZ2V0QkJveCgpXG4gICAgICAgIGhvcml6b250YWxSYXRpbyA9IF9hcmVhQm94LndpZHRoIC8gbmV3Qm94LndpZHRoXG4gICAgICAgIHZlcnRpY2FsUmF0aW8gPSBfYXJlYUJveC5oZWlnaHQgLyBuZXdCb3guaGVpZ2h0XG4gICAgICAgIHRvcCA9IHRvcCAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgc3RhcnRUb3AgPSBzdGFydFRvcCAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgYm90dG9tID0gYm90dG9tIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBzdGFydEJvdHRvbSA9IHN0YXJ0Qm90dG9tIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBsZWZ0ID0gbGVmdCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBzdGFydExlZnQgPSBzdGFydExlZnQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgcmlnaHQgPSByaWdodCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBzdGFydFJpZ2h0ID0gc3RhcnRSaWdodCAvIGhvcml6b250YWxSYXRpb1xuICAgICAgICBfc3RhcnRQb3NbMF0gPSBfc3RhcnRQb3NbMF0gLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgX3N0YXJ0UG9zWzFdID0gX3N0YXJ0UG9zWzFdIC8gdmVydGljYWxSYXRpb1xuICAgICAgICBfYXJlYUJveCA9IG5ld0JveFxuICAgICAgICBwb3NpdGlvbkJydXNoRWxlbWVudHMobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuXG4gICAgIy0tLSBCcnVzaCBQcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5jaGFydCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IHZhbFxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gJ3Jlc2l6ZS5icnVzaCcsIHJlc2l6ZUV4dGVudFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYWN0aXZlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYWN0aXZlXG4gICAgICBlbHNlXG4gICAgICAgIF9hY3RpdmUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnggPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF94XG4gICAgICBlbHNlXG4gICAgICAgIF94ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS55ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfeVxuICAgICAgZWxzZVxuICAgICAgICBfeSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXJlYSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FyZWFTZWxlY3Rpb25cbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbm90IF9hcmVhU2VsZWN0aW9uXG4gICAgICAgICAgX2FyZWFTZWxlY3Rpb24gPSB2YWxcbiAgICAgICAgICBfYXJlYSA9IF9hcmVhU2VsZWN0aW9uLm5vZGUoKVxuICAgICAgICAgICNfYXJlYUJveCA9IF9hcmVhLmdldEJCb3goKSBuZWVkIHRvIGdldCB3aGVuIGNhbGN1bGF0aW5nIHNpemUgdG8gZGVhbCB3aXRoIHJlc2l6aW5nXG4gICAgICAgICAgbWUuYnJ1c2goX2FyZWFTZWxlY3Rpb24pXG5cbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmNvbnRhaW5lciA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gdmFsXG4gICAgICAgIF9zZWxlY3RhYmxlcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5kYXRhID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfZGF0YSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYnJ1c2hHcm91cCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2JydXNoR3JvdXBcbiAgICAgIGVsc2VcbiAgICAgICAgX2JydXNoR3JvdXAgPSB2YWxcbiAgICAgICAgc2VsZWN0aW9uU2hhcmluZy5jcmVhdGVHcm91cChfYnJ1c2hHcm91cClcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnRvb2x0aXAgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90b29sdGlwXG4gICAgICBlbHNlXG4gICAgICAgIF90b29sdGlwID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgIF9icnVzaEV2ZW50cy5vbiBuYW1lLCBjYWxsYmFja1xuXG4gICAgbWUuZXh0ZW50ID0gKCkgLT5cbiAgICAgIHJldHVybiBfYm91bmRzSWR4XG5cbiAgICBtZS5ldmVudHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9icnVzaEV2ZW50c1xuXG4gICAgbWUuZW1wdHkgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9ib3VuZHNJZHggaXMgdW5kZWZpbmVkXG5cbiAgICByZXR1cm4gbWVcbiAgcmV0dXJuIGJlaGF2aW9yQnJ1c2giLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvclNlbGVjdCcsICgkbG9nKSAtPlxuICBzZWxlY3RJZCA9IDBcblxuICBzZWxlY3QgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJzZWxlY3Qje3NlbGVjdElkKyt9XCJcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2FjdGl2ZSA9IGZhbHNlXG4gICAgX3NlbGVjdGlvbkV2ZW50cyA9IGQzLmRpc3BhdGNoKCdzZWxlY3RlZCcpXG5cbiAgICBjbGlja2VkID0gKCkgLT5cbiAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICBvYmogPSBkMy5zZWxlY3QodGhpcylcbiAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICBpZiBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIGlzU2VsZWN0ZWQgPSBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0ZWQnKVxuICAgICAgICBvYmouY2xhc3NlZCgnd2stY2hhcnQtc2VsZWN0ZWQnLCBub3QgaXNTZWxlY3RlZClcbiAgICAgICAgYWxsU2VsZWN0ZWQgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGVkJykuZGF0YSgpLm1hcCgoZCkgLT4gaWYgZC5kYXRhIHRoZW4gZC5kYXRhIGVsc2UgZClcbiAgICAgICAgIyBlbnN1cmUgdGhhdCBvbmx5IHRoZSBvcmlnaW5hbCB2YWx1ZXMgYXJlIHJlcG9ydGVkIGJhY2tcblxuICAgICAgICBfc2VsZWN0aW9uRXZlbnRzLnNlbGVjdGVkKGFsbFNlbGVjdGVkKVxuXG4gICAgbWUgPSAoc2VsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIG1lXG4gICAgICBlbHNlXG4gICAgICAgIHNlbFxuICAgICAgICAgICMgcmVnaXN0ZXIgc2VsZWN0aW9uIGV2ZW50c1xuICAgICAgICAgIC5vbiAnY2xpY2snLCBjbGlja2VkXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuaWQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuYWN0aXZlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYWN0aXZlXG4gICAgICBlbHNlXG4gICAgICAgIF9hY3RpdmUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmNvbnRhaW5lciA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5ldmVudHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zZWxlY3Rpb25FdmVudHNcblxuICAgIG1lLm9uID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgX3NlbGVjdGlvbkV2ZW50cy5vbiBuYW1lLCBjYWxsYmFja1xuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gc2VsZWN0IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JUb29sdGlwJywgKCRsb2csICRkb2N1bWVudCwgJHJvb3RTY29wZSwgJGNvbXBpbGUsICR0ZW1wbGF0ZUNhY2hlLCB0ZW1wbGF0ZURpcikgLT5cblxuICBiZWhhdmlvclRvb2x0aXAgPSAoKSAtPlxuXG4gICAgX2FjdGl2ZSA9IGZhbHNlXG4gICAgX3BhdGggPSAnJ1xuICAgIF9oaWRlID0gZmFsc2VcbiAgICBfc2hvd01hcmtlckxpbmUgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyRyA9IHVuZGVmaW5lZFxuICAgIF9tYXJrZXJMaW5lID0gdW5kZWZpbmVkXG4gICAgX2FyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICBfYXJlYT0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9tYXJrZXJTY2FsZSA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXBEaXNwYXRjaCA9IGQzLmRpc3BhdGNoKCdlbnRlcicsICdtb3ZlRGF0YScsICdtb3ZlTWFya2VyJywgJ2xlYXZlJylcblxuICAgIF90ZW1wbCA9ICR0ZW1wbGF0ZUNhY2hlLmdldCh0ZW1wbGF0ZURpciArICd0b29sVGlwLmh0bWwnKVxuICAgIF90ZW1wbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpXG4gICAgX2NvbXBpbGVkVGVtcGwgPSAkY29tcGlsZShfdGVtcGwpKF90ZW1wbFNjb3BlKVxuICAgIGJvZHkgPSAkZG9jdW1lbnQuZmluZCgnYm9keScpXG5cbiAgICBib2R5UmVjdCA9IGJvZHlbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0gaGVscGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBwb3NpdGlvbkJveCA9ICgpIC0+XG4gICAgICByZWN0ID0gX2NvbXBpbGVkVGVtcGxbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNsaWVudFggPSBpZiBib2R5UmVjdC5yaWdodCAtIDIwID4gZDMuZXZlbnQuY2xpZW50WCArIHJlY3Qud2lkdGggKyAxMCB0aGVuIGQzLmV2ZW50LmNsaWVudFggKyAxMCBlbHNlIGQzLmV2ZW50LmNsaWVudFggLSByZWN0LndpZHRoIC0gMTBcbiAgICAgIGNsaWVudFkgPSBpZiBib2R5UmVjdC5ib3R0b20gLSAyMCA+IGQzLmV2ZW50LmNsaWVudFkgKyByZWN0LmhlaWdodCArIDEwIHRoZW4gZDMuZXZlbnQuY2xpZW50WSArIDEwIGVsc2UgZDMuZXZlbnQuY2xpZW50WSAtIHJlY3QuaGVpZ2h0IC0gMTBcbiAgICAgIF90ZW1wbFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICBsZWZ0OiBjbGllbnRYICsgJ3B4J1xuICAgICAgICB0b3A6IGNsaWVudFkgKyAncHgnXG4gICAgICAgICd6LWluZGV4JzogMTUwMFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9XG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKVxuXG4gICAgcG9zaXRpb25Jbml0aWFsID0gKCkgLT5cbiAgICAgIF90ZW1wbFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICBsZWZ0OiAwICsgJ3B4J1xuICAgICAgICB0b3A6IDAgKyAncHgnXG4gICAgICAgICd6LWluZGV4JzogMTUwMFxuICAgICAgICBvcGFjaXR5OiAwXG4gICAgICB9XG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKSAgIyBlbnN1cmUgdG9vbHRpcCBnZXRzIHJlbmRlcmVkXG4gICAgICAjd2F5aXQgdW50aWwgaXQgaXMgcmVuZGVyZWQgYW5kIHRoZW4gcmVwb3NpdGlvblxuICAgICAgXy50aHJvdHRsZSBwb3NpdGlvbkJveCwgMjAwXG5cbiAgICAjLS0tIFRvb2x0aXBTdGFydCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcEVudGVyID0gKCkgLT5cbiAgICAgIGlmIG5vdCBfYWN0aXZlIG9yIF9oaWRlIHRoZW4gcmV0dXJuXG4gICAgICAjIGFwcGVuZCBkYXRhIGRpdlxuICAgICAgYm9keS5hcHBlbmQoX2NvbXBpbGVkVGVtcGwpXG4gICAgICBfdGVtcGxTY29wZS5sYXllcnMgPSBbXVxuXG4gICAgICAjIGdldCB0b29sdGlwIGRhdGEgdmFsdWVcblxuICAgICAgaWYgX3Nob3dNYXJrZXJMaW5lXG4gICAgICAgIF9wb3MgPSBkMy5tb3VzZSh0aGlzKVxuICAgICAgICB2YWx1ZSA9IF9tYXJrZXJTY2FsZS5pbnZlcnQoaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpIHRoZW4gX3Bvc1swXSBlbHNlIF9wb3NbMV0pXG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlID0gZDMuc2VsZWN0KHRoaXMpLmRhdHVtKClcblxuICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gdHJ1ZVxuICAgICAgX3RlbXBsU2NvcGUudHREYXRhID0gdmFsdWVcbiAgICAgIF90b29sdGlwRGlzcGF0Y2guZW50ZXIuYXBwbHkoX3RlbXBsU2NvcGUsIFt2YWx1ZV0pICMgY2FsbCBsYXlvdXQgdG8gZmlsbCBpbiBkYXRhXG4gICAgICBwb3NpdGlvbkluaXRpYWwoKVxuXG4gICAgICAjIGNyZWF0ZSBhIG1hcmtlciBsaW5lIGlmIHJlcXVpcmVkXG4gICAgICBpZiBfc2hvd01hcmtlckxpbmVcbiAgICAgICAgI19hcmVhID0gdGhpc1xuICAgICAgICBfYXJlYUJveCA9IF9hcmVhU2VsZWN0aW9uLnNlbGVjdCgnLndrLWNoYXJ0LWJhY2tncm91bmQnKS5ub2RlKCkuZ2V0QkJveCgpXG4gICAgICAgIF9wb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgICAgX21hcmtlckcgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpICAjIG5lZWQgdG8gYXBwZW5kIG1hcmtlciB0byBjaGFydCBhcmVhIHRvIGVuc3VyZSBpdCBpcyBvbiB0b3Agb2YgdGhlIGNoYXJ0IGVsZW1lbnRzIEZpeCAxMFxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC10b29sdGlwLW1hcmtlcicpXG4gICAgICAgIF9tYXJrZXJMaW5lID0gX21hcmtlckcuYXBwZW5kKCdsaW5lJylcbiAgICAgICAgaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpXG4gICAgICAgICAgX21hcmtlckxpbmUuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LW1hcmtlci1saW5lJywgeDA6MCwgeDE6MCwgeTA6MCx5MTpfYXJlYUJveC5oZWlnaHR9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX21hcmtlckxpbmUuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LW1hcmtlci1saW5lJywgeDA6MCwgeDE6X2FyZWFCb3gud2lkdGgsIHkwOjAseTE6MH0pXG5cbiAgICAgICAgX21hcmtlckxpbmUuc3R5bGUoe3N0cm9rZTogJ2RhcmtncmV5JywgJ3BvaW50ZXItZXZlbnRzJzogJ25vbmUnfSlcblxuICAgICAgICBfdG9vbHRpcERpc3BhdGNoLm1vdmVNYXJrZXIuYXBwbHkoX21hcmtlckcsIFt2YWx1ZV0pXG5cbiAgICAjLS0tIFRvb2x0aXBNb3ZlICBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcE1vdmUgPSAoKSAtPlxuICAgICAgaWYgbm90IF9hY3RpdmUgb3IgX2hpZGUgdGhlbiByZXR1cm5cbiAgICAgIF9wb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIHBvc2l0aW9uQm94KClcbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICBkYXRhSWR4ID0gX21hcmtlclNjYWxlLmludmVydChpZiBfbWFya2VyU2NhbGUuaXNIb3Jpem9udGFsKCkgdGhlbiBfcG9zWzBdIGVsc2UgX3Bvc1sxXSlcbiAgICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5tb3ZlTWFya2VyLmFwcGx5KF9tYXJrZXJHLCBbZGF0YUlkeF0pXG4gICAgICAgIF90ZW1wbFNjb3BlLmxheWVycyA9IFtdXG4gICAgICAgIF90b29sdGlwRGlzcGF0Y2gubW92ZURhdGEuYXBwbHkoX3RlbXBsU2NvcGUsIFtkYXRhSWR4XSlcbiAgICAgIF90ZW1wbFNjb3BlLiRhcHBseSgpXG5cbiAgICAjLS0tIFRvb2x0aXBMZWF2ZSBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcExlYXZlID0gKCkgLT5cbiAgICAgICMkbG9nLmRlYnVnICd0b29sdGlwTGVhdmUnLCBfYXJlYVxuICAgICAgaWYgX21hcmtlckdcbiAgICAgICAgX21hcmtlckcucmVtb3ZlKClcbiAgICAgIF9tYXJrZXJHID0gdW5kZWZpbmVkXG4gICAgICBfdGVtcGxTY29wZS50dFNob3cgPSBmYWxzZVxuICAgICAgX2NvbXBpbGVkVGVtcGwucmVtb3ZlKClcblxuICAgICMtLS0gSW50ZXJmYWNlIHRvIGJydXNoIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBmb3J3YXJkVG9CcnVzaCA9IChlKSAtPlxuICAgICAgIyBmb3J3YXJkIHRoZSBtb3VzZG93biBldmVudCB0byB0aGUgYnJ1c2ggb3ZlcmxheSB0byBlbnN1cmUgdGhhdCBicnVzaGluZyBjYW4gc3RhcnQgYXQgYW55IHBvaW50IGluIHRoZSBkcmF3aW5nIGFyZWFcblxuICAgICAgYnJ1c2hfZWxtID0gZDMuc2VsZWN0KF9jb250YWluZXIubm9kZSgpLnBhcmVudEVsZW1lbnQpLnNlbGVjdChcIi53ay1jaGFydC1vdmVybGF5XCIpLm5vZGUoKTtcbiAgICAgIGlmIGQzLmV2ZW50LnRhcmdldCBpc250IGJydXNoX2VsbSAjZG8gbm90IGRpc3BhdGNoIGlmIHRhcmdldCBpcyBvdmVybGF5XG4gICAgICAgIG5ld19jbGlja19ldmVudCA9IG5ldyBFdmVudCgnbW91c2Vkb3duJyk7XG4gICAgICAgIG5ld19jbGlja19ldmVudC5wYWdlWCA9IGQzLmV2ZW50LnBhZ2VYO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQuY2xpZW50WCA9IGQzLmV2ZW50LmNsaWVudFg7XG4gICAgICAgIG5ld19jbGlja19ldmVudC5wYWdlWSA9IGQzLmV2ZW50LnBhZ2VZO1xuICAgICAgICBuZXdfY2xpY2tfZXZlbnQuY2xpZW50WSA9IGQzLmV2ZW50LmNsaWVudFk7XG4gICAgICAgIGJydXNoX2VsbS5kaXNwYXRjaEV2ZW50KG5ld19jbGlja19ldmVudCk7XG5cblxuICAgIG1lLmhpZGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9oaWRlXG4gICAgICBlbHNlXG4gICAgICAgIF9oaWRlID0gdmFsXG4gICAgICAgIGlmIF9tYXJrZXJHXG4gICAgICAgICAgX21hcmtlckcuc3R5bGUoJ3Zpc2liaWxpdHknLCBpZiBfaGlkZSB0aGVuICdoaWRkZW4nIGVsc2UgJ3Zpc2libGUnKVxuICAgICAgICBfdGVtcGxTY29wZS50dFNob3cgPSBub3QgX2hpZGVcbiAgICAgICAgX3RlbXBsU2NvcGUuJGFwcGx5KClcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuXG4gICAgIy0tIFRvb2x0aXAgcHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50ZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzIGlzIDAgdGhlbiByZXR1cm4gX3BhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhdGggPSBwYXRoXG4gICAgICAgIGlmIF9wYXRoLmxlbmd0aCA+IDBcbiAgICAgICAgICBfY3VzdG9tVGVtcGwgPSAkdGVtcGxhdGVDYWNoZS5nZXQoJ3RlbXBsYXRlcy8nICsgX3BhdGgpXG4gICAgICAgICAgIyB3cmFwIHRlbXBsYXRlIGludG8gcG9zaXRpb25pbmcgZGl2XG4gICAgICAgICAgX2N1c3RvbVRlbXBsV3JhcHBlZCA9IFwiPGRpdiBjbGFzcz1cXFwid2stY2hhcnQtdG9vbHRpcFxcXCIgbmctc2hvdz1cXFwidHRTaG93XFxcIiBuZy1zdHlsZT1cXFwicG9zaXRpb25cXFwiPiN7X2N1c3RvbVRlbXBsfTwvZGl2PlwiXG4gICAgICAgICAgX2NvbXBpbGVkVGVtcGwgPSAkY29tcGlsZShfY3VzdG9tVGVtcGxXcmFwcGVkKShfdGVtcGxTY29wZSlcblxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFyZWEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hcmVhU2VsZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIF9hcmVhU2VsZWN0aW9uID0gdmFsXG4gICAgICAgIF9hcmVhID0gX2FyZWFTZWxlY3Rpb24ubm9kZSgpXG4gICAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICAgIG1lLnRvb2x0aXAoX2FyZWFTZWxlY3Rpb24pXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUubWFya2VyU2NhbGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9tYXJrZXJTY2FsZVxuICAgICAgZWxzZVxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBfc2hvd01hcmtlckxpbmUgPSB0cnVlXG4gICAgICAgICAgX21hcmtlclNjYWxlID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlckxpbmUgPSBmYWxzZVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGF0YSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLm9uID0gKG5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5vbiBuYW1lLCBjYWxsYmFja1xuXG4gICAgIy0tLSBUb29sdGlwIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnRvb2x0aXAgPSAocykgLT4gIyByZWdpc3RlciB0aGUgdG9vbHRpcCBldmVudHMgd2l0aCB0aGUgc2VsZWN0aW9uXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gbWVcbiAgICAgIGVsc2UgICMgc2V0IHRvb2x0aXAgZm9yIGFuIG9iamVjdHMgc2VsZWN0aW9uXG4gICAgICAgIHMub24gJ21vdXNlZW50ZXIudG9vbHRpcCcsIHRvb2x0aXBFbnRlclxuICAgICAgICAgIC5vbiAnbW91c2Vtb3ZlLnRvb2x0aXAnLCB0b29sdGlwTW92ZVxuICAgICAgICAgIC5vbiAnbW91c2VsZWF2ZS50b29sdGlwJywgdG9vbHRpcExlYXZlXG4gICAgICAgIGlmIG5vdCBzLmVtcHR5KCkgYW5kIG5vdCBzLmNsYXNzZWQoJ3drLWNoYXJ0LW92ZXJsYXknKVxuICAgICAgICAgIHMub24gJ21vdXNlZG93bi50b29sdGlwJywgZm9yd2FyZFRvQnJ1c2hcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBiZWhhdmlvclRvb2x0aXAiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvcicsICgkbG9nLCAkd2luZG93LCBiZWhhdmlvclRvb2x0aXAsIGJlaGF2aW9yQnJ1c2gsIGJlaGF2aW9yU2VsZWN0KSAtPlxuXG4gIGJlaGF2aW9yID0gKCkgLT5cblxuICAgIF90b29sdGlwID0gYmVoYXZpb3JUb29sdGlwKClcbiAgICBfYnJ1c2ggPSBiZWhhdmlvckJydXNoKClcbiAgICBfc2VsZWN0aW9uID0gYmVoYXZpb3JTZWxlY3QoKVxuICAgIF9icnVzaC50b29sdGlwKF90b29sdGlwKVxuXG4gICAgYXJlYSA9IChhcmVhKSAtPlxuICAgICAgX2JydXNoLmFyZWEoYXJlYSlcbiAgICAgIF90b29sdGlwLmFyZWEoYXJlYSlcblxuICAgIGNvbnRhaW5lciA9IChjb250YWluZXIpIC0+XG4gICAgICBfYnJ1c2guY29udGFpbmVyKGNvbnRhaW5lcilcbiAgICAgIF9zZWxlY3Rpb24uY29udGFpbmVyKGNvbnRhaW5lcilcbiAgICAgIF90b29sdGlwLmNvbnRhaW5lcihjb250YWluZXIpXG5cbiAgICBjaGFydCA9IChjaGFydCkgLT5cbiAgICAgIF9icnVzaC5jaGFydChjaGFydClcblxuICAgIHJldHVybiB7dG9vbHRpcDpfdG9vbHRpcCwgYnJ1c2g6X2JydXNoLCBzZWxlY3RlZDpfc2VsZWN0aW9uLCBvdmVybGF5OmFyZWEsIGNvbnRhaW5lcjpjb250YWluZXIsIGNoYXJ0OmNoYXJ0fVxuICByZXR1cm4gYmVoYXZpb3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdjaGFydCcsICgkbG9nLCBzY2FsZUxpc3QsIGNvbnRhaW5lciwgYmVoYXZpb3IsIGQzQW5pbWF0aW9uKSAtPlxuXG4gIGNoYXJ0Q250ciA9IDBcblxuICBjaGFydCA9ICgpIC0+XG5cbiAgICBfaWQgPSBcImNoYXJ0I3tjaGFydENudHIrK31cIlxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgIy0tLSBWYXJpYWJsZSBkZWNsYXJhdGlvbnMgYW5kIGRlZmF1bHRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9sYXlvdXRzID0gW10gICAgICAgICAgICAgICAjIExpc3Qgb2YgbGF5b3V0cyBmb3IgdGhlIGNoYXJ0XG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZCAgICAjIHRoZSBjaGFydHMgZHJhd2luZyBjb250YWluZXIgb2JqZWN0XG4gICAgX2FsbFNjYWxlcyA9IHVuZGVmaW5lZCAgICAjIEhvbGRzIGFsbCBzY2FsZXMgb2YgdGhlIGNoYXJ0LCByZWdhcmRsZXNzIG9mIHNjYWxlIG93bmVyXG4gICAgX293bmVkU2NhbGVzID0gdW5kZWZpbmVkICAjIGhvbGRzIHRoZSBzY2xlcyBvd25lZCBieSBjaGFydCwgaS5lLiBzaGFyZSBzY2FsZXNcbiAgICBfZGF0YSA9IHVuZGVmaW5lZCAgICAgICAgICAgIyBwb2ludGVyIHRvIHRoZSBsYXN0IGRhdGEgc2V0IGJvdW5kIHRvIGNoYXJ0XG4gICAgX3Nob3dUb29sdGlwID0gZmFsc2UgICAgICAgICMgdG9vbHRpcCBwcm9wZXJ0eVxuICAgIF90b29sVGlwVGVtcGxhdGUgPSAnJ1xuICAgIF90aXRsZSA9IHVuZGVmaW5lZFxuICAgIF9zdWJUaXRsZSA9IHVuZGVmaW5lZFxuICAgIF9iZWhhdmlvciA9IGJlaGF2aW9yKClcbiAgICBfYW5pbWF0aW9uRHVyYXRpb24gPSBkM0FuaW1hdGlvbi5kdXJhdGlvblxuXG4gICAgIy0tLSBMaWZlQ3ljbGUgRGlzcGF0Y2hlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9saWZlQ3ljbGUgPSBkMy5kaXNwYXRjaCgnY29uZmlndXJlJywgJ3Jlc2l6ZScsICdwcmVwYXJlRGF0YScsICdzY2FsZURvbWFpbnMnLCAnc2l6ZUNvbnRhaW5lcicsICdkcmF3QXhpcycsICdkcmF3Q2hhcnQnLCAnbmV3RGF0YScsICd1cGRhdGUnLCAndXBkYXRlQXR0cnMnLCAnc2NvcGVBcHBseScgKVxuICAgIF9icnVzaCA9IGQzLmRpc3BhdGNoKCdkcmF3JywgJ2NoYW5nZScpXG5cbiAgICAjLS0tIEdldHRlci9TZXR0ZXIgRnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuaWQgPSAoaWQpIC0+XG4gICAgICByZXR1cm4gX2lkXG5cbiAgICBtZS5zaG93VG9vbHRpcCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dUb29sdGlwXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93VG9vbHRpcCA9IHRydWVGYWxzZVxuICAgICAgICBfYmVoYXZpb3IudG9vbHRpcC5hY3RpdmUoX3Nob3dUb29sdGlwKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRvb2xUaXBUZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90b29sVGlwVGVtcGxhdGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3Rvb2xUaXBUZW1wbGF0ZSA9IHBhdGhcbiAgICAgICAgX2JlaGF2aW9yLnRvb2x0aXAudGVtcGxhdGUocGF0aClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50aXRsZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF90aXRsZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnN1YlRpdGxlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc3ViVGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3N1YlRpdGxlID0gdmFsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkTGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0c1xuICAgICAgZWxzZVxuICAgICAgICBfbGF5b3V0cy5wdXNoKGxheW91dClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRTY2FsZSA9IChzY2FsZSwgbGF5b3V0KSAtPlxuICAgICAgX2FsbFNjYWxlcy5hZGQoc2NhbGUpXG4gICAgICBpZiBsYXlvdXRcbiAgICAgICAgbGF5b3V0LnNjYWxlcygpLmFkZChzY2FsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgX293bmVkU2NhbGVzLmFkZChzY2FsZSlcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYW5pbWF0aW9uRHVyYXRpb24gPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hbmltYXRpb25EdXJhdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfYW5pbWF0aW9uRHVyYXRpb24gPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgICMtLS0gR2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5saWZlQ3ljbGUgPSAodmFsKSAtPlxuICAgICAgcmV0dXJuIF9saWZlQ3ljbGVcblxuICAgIG1lLmxheW91dHMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9sYXlvdXRzXG5cbiAgICBtZS5zY2FsZXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9vd25lZFNjYWxlc1xuXG4gICAgbWUuYWxsU2NhbGVzID0gKCkgLT5cbiAgICAgIHJldHVybiBfYWxsU2NhbGVzXG5cbiAgICBtZS5oYXNTY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIHJldHVybiAhIV9hbGxTY2FsZXMuaGFzKHNjYWxlKVxuXG4gICAgbWUuY29udGFpbmVyID0gKCkgLT5cbiAgICAgIHJldHVybiBfY29udGFpbmVyXG5cbiAgICBtZS5icnVzaCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JydXNoXG5cbiAgICBtZS5nZXREYXRhID0gKCkgLT5cbiAgICAgIHJldHVybiBfZGF0YVxuXG4gICAgbWUuYmVoYXZpb3IgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9iZWhhdmlvclxuXG4gICAgIy0tLSBDaGFydCBkcmF3aW5nIGxpZmUgY3ljbGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmV4ZWNMaWZlQ3ljbGVGdWxsID0gKGRhdGEsIG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIGZ1bGwgbGlmZSBjeWNsZSdcbiAgICAgICAgX2RhdGEgPSBkYXRhXG4gICAgICAgIF9saWZlQ3ljbGUucHJlcGFyZURhdGEoZGF0YSwgbm9BbmltYXRpb24pICAgICMgY2FsbHMgdGhlIHJlZ2lzdGVyZWQgbGF5b3V0IHR5cGVzXG4gICAgICAgIF9saWZlQ3ljbGUuc2NhbGVEb21haW5zKGRhdGEsIG5vQW5pbWF0aW9uKSAgICMgY2FsbHMgcmVnaXN0ZXJlZCB0aGUgc2NhbGVzXG4gICAgICAgIF9saWZlQ3ljbGUuc2l6ZUNvbnRhaW5lcihkYXRhLCBub0FuaW1hdGlvbikgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KGRhdGEsIG5vQW5pbWF0aW9uKSAgICAgIyBjYWxscyBsYXlvdXRcblxuICAgIG1lLnJlc2l6ZUxpZmVDeWNsZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgcmVzaXplIGxpZmUgY3ljbGUnXG4gICAgICAgIF9saWZlQ3ljbGUuc2l6ZUNvbnRhaW5lcihfZGF0YSwgbm9BbmltYXRpb24pICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoX2RhdGEsIG5vQW5pbWF0aW9uKVxuICAgICAgICBfbGlmZUN5Y2xlLnNjb3BlQXBwbHkoKVxuXG4gICAgbWUubmV3RGF0YUxpZmVDeWNsZSA9IChkYXRhLCBub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIGRhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyBuZXcgZGF0YSBsaWZlIGN5Y2xlJ1xuICAgICAgICBfZGF0YSA9IGRhdGFcbiAgICAgICAgX2xpZmVDeWNsZS5wcmVwYXJlRGF0YShkYXRhLCBub0FuaW1hdGlvbikgICAgIyBjYWxscyB0aGUgcmVnaXN0ZXJlZCBsYXlvdXQgdHlwZXNcbiAgICAgICAgX2xpZmVDeWNsZS5zY2FsZURvbWFpbnMoZGF0YSwgbm9BbmltYXRpb24pXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChkYXRhLCBub0FuaW1hdGlvbilcblxuICAgIG1lLmF0dHJpYnV0ZUNoYW5nZSA9IChub0FuaW1hdGlvbikgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgYXR0cmlidXRlIGNoYW5nZSBsaWZlIGN5Y2xlJ1xuICAgICAgICBfbGlmZUN5Y2xlLnNpemVDb250YWluZXIoX2RhdGEsIG5vQW5pbWF0aW9uKVxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdBeGlzKG5vQW5pbWF0aW9uKSAgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoX2RhdGEsIG5vQW5pbWF0aW9uKVxuXG4gICAgbWUuYnJ1c2hFeHRlbnRDaGFuZ2VkID0gKCkgLT5cbiAgICAgIGlmIF9kYXRhXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXModHJ1ZSkgICAgICAgICAgICAgICMgTm8gQW5pbWF0aW9uXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KF9kYXRhLCB0cnVlKVxuXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ25ld0RhdGEuY2hhcnQnLCBtZS5leGVjTGlmZUN5Y2xlRnVsbFxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICdyZXNpemUuY2hhcnQnLCBtZS5yZXNpemVMaWZlQ3ljbGVcbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAndXBkYXRlLmNoYXJ0JywgKG5vQW5pbWF0aW9uKSAtPiBtZS5leGVjTGlmZUN5Y2xlRnVsbChfZGF0YSwgbm9BbmltYXRpb24pXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ3VwZGF0ZUF0dHJzJywgbWUuYXR0cmlidXRlQ2hhbmdlXG5cbiAgICAjLS0tIEluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX2JlaGF2aW9yLmNoYXJ0KG1lKVxuICAgIF9jb250YWluZXIgPSBjb250YWluZXIoKS5jaGFydChtZSkgICAjIHRoZSBjaGFydHMgZHJhd2luZyBjb250YWluZXIgb2JqZWN0XG4gICAgX2FsbFNjYWxlcyA9IHNjYWxlTGlzdCgpICAgICMgSG9sZHMgYWxsIHNjYWxlcyBvZiB0aGUgY2hhcnQsIHJlZ2FyZGxlc3Mgb2Ygc2NhbGUgb3duZXJcbiAgICBfb3duZWRTY2FsZXMgPSBzY2FsZUxpc3QoKSAgIyBob2xkcyB0aGUgc2NsZXMgb3duZWQgYnkgY2hhcnQsIGkuZS4gc2hhcmUgc2NhbGVzXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gY2hhcnQiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdjb250YWluZXInLCAoJGxvZywgJHdpbmRvdywgZDNDaGFydE1hcmdpbnMsIHNjYWxlTGlzdCwgYXhpc0NvbmZpZywgZDNBbmltYXRpb24sIGJlaGF2aW9yKSAtPlxuXG4gIGNvbnRhaW5lckNudCA9IDBcblxuICBjb250YWluZXIgPSAoKSAtPlxuXG4gICAgbWUgPSAoKS0+XG5cbiAgICAjLS0tIFZhcmlhYmxlIGRlY2xhcmF0aW9ucyBhbmQgZGVmYXVsdHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX2NvbnRhaW5lcklkID0gJ2NudG5yJyArIGNvbnRhaW5lckNudCsrXG4gICAgX2NoYXJ0ID0gdW5kZWZpbmVkXG4gICAgX2VsZW1lbnQgPSB1bmRlZmluZWRcbiAgICBfZWxlbWVudFNlbGVjdGlvbiA9IHVuZGVmaW5lZFxuICAgIF9sYXlvdXRzID0gW11cbiAgICBfbGVnZW5kcyA9IFtdXG4gICAgX3N2ZyA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfc3BhY2VkQ29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0QXJlYSA9IHVuZGVmaW5lZFxuICAgIF9jaGFydEFyZWEgPSB1bmRlZmluZWRcbiAgICBfbWFyZ2luID0gYW5ndWxhci5jb3B5KGQzQ2hhcnRNYXJnaW5zLmRlZmF1bHQpXG4gICAgX2lubmVyV2lkdGggPSAwXG4gICAgX2lubmVySGVpZ2h0ID0gMFxuICAgIF90aXRsZUhlaWdodCA9IDBcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9vdmVybGF5ID0gdW5kZWZpbmVkXG4gICAgX2JlaGF2aW9yID0gdW5kZWZpbmVkXG4gICAgX2R1cmF0aW9uID0gMFxuXG4gICAgIy0tLSBHZXR0ZXIvU2V0dGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfY29udGFpbmVySWRcblxuICAgIG1lLmNoYXJ0ID0gKGNoYXJ0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSBjaGFydFxuICAgICAgICAjIHJlZ2lzdGVyIHRvIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgI19jaGFydC5saWZlQ3ljbGUoKS5vbiBcInNpemVDb250YWluZXIuI3ttZS5pZCgpfVwiLCBtZS5zaXplQ29udGFpbmVyXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcImRyYXdBeGlzLiN7bWUuaWQoKX1cIiwgbWUuZHJhd0NoYXJ0RnJhbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5lbGVtZW50ID0gKGVsZW0pIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2VsZW1lbnRcbiAgICAgIGVsc2VcbiAgICAgICAgX3Jlc2l6ZUhhbmRsZXIgPSAoKSAtPiAgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5yZXNpemUodHJ1ZSkgIyBubyBhbmltYXRpb25cbiAgICAgICAgX2VsZW1lbnQgPSBlbGVtXG4gICAgICAgIF9lbGVtZW50U2VsZWN0aW9uID0gZDMuc2VsZWN0KF9lbGVtZW50KVxuICAgICAgICBpZiBfZWxlbWVudFNlbGVjdGlvbi5lbXB0eSgpXG4gICAgICAgICAgJGxvZy5lcnJvciBcIkVycm9yOiBFbGVtZW50ICN7X2VsZW1lbnR9IGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9nZW5DaGFydEZyYW1lKClcbiAgICAgICAgICAjIGZpbmQgdGhlIGRpdiBlbGVtZW50IHRvIGF0dGFjaCB0aGUgaGFuZGxlciB0b1xuICAgICAgICAgIHJlc2l6ZVRhcmdldCA9IF9lbGVtZW50U2VsZWN0aW9uLnNlbGVjdCgnLndrLWNoYXJ0Jykubm9kZSgpXG4gICAgICAgICAgbmV3IFJlc2l6ZVNlbnNvcihyZXNpemVUYXJnZXQsIF9yZXNpemVIYW5kbGVyKVxuXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkTGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIF9sYXlvdXRzLnB1c2gobGF5b3V0KVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5oZWlnaHQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pbm5lckhlaWdodFxuXG4gICAgbWUud2lkdGggPSAoKSAtPlxuICAgICAgcmV0dXJuIF9pbm5lcldpZHRoXG5cbiAgICBtZS5tYXJnaW5zID0gKCkgLT5cbiAgICAgIHJldHVybiBfbWFyZ2luXG5cbiAgICBtZS5nZXRDaGFydEFyZWEgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9jaGFydEFyZWFcblxuICAgIG1lLmdldE92ZXJsYXkgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9vdmVybGF5XG5cbiAgICBtZS5nZXRDb250YWluZXIgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9zcGFjZWRDb250YWluZXJcblxuICAgICMtLS0gdXRpbGl0eSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgUmV0dXJuOiB0ZXh0IGhlaWdodFxuICAgIGRyYXdBbmRQb3NpdGlvblRleHQgPSAoY29udGFpbmVyLCB0ZXh0LCBzZWxlY3RvciwgZm9udFNpemUsIG9mZnNldCkgLT5cbiAgICAgIGVsZW0gPSBjb250YWluZXIuc2VsZWN0KCcuJyArIHNlbGVjdG9yKVxuICAgICAgaWYgZWxlbS5lbXB0eSgpXG4gICAgICAgIGVsZW0gPSBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cih7Y2xhc3M6c2VsZWN0b3IsICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnLCB5OmlmIG9mZnNldCB0aGVuIG9mZnNldCBlbHNlIDB9KVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJyxmb250U2l6ZSlcbiAgICAgIGVsZW0udGV4dCh0ZXh0KVxuICAgICAgI21lYXN1cmUgc2l6ZSBhbmQgcmV0dXJuIGl0XG4gICAgICByZXR1cm4gZWxlbS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodFxuXG5cbiAgICBkcmF3VGl0bGVBcmVhID0gKHRpdGxlLCBzdWJUaXRsZSkgLT5cbiAgICAgIHRpdGxlQXJlYUhlaWdodCA9IDBcbiAgICAgIGFyZWEgPSBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LXRpdGxlLWFyZWEnKVxuICAgICAgaWYgYXJlYS5lbXB0eSgpXG4gICAgICAgIGFyZWEgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtdGl0bGUtYXJlYSB3ay1jZW50ZXItaG9yJylcbiAgICAgIGlmIHRpdGxlXG4gICAgICAgIF90aXRsZUhlaWdodCA9IGRyYXdBbmRQb3NpdGlvblRleHQoYXJlYSwgdGl0bGUsICd3ay1jaGFydC10aXRsZScsICcyZW0nKVxuICAgICAgaWYgc3ViVGl0bGVcbiAgICAgICAgZHJhd0FuZFBvc2l0aW9uVGV4dChhcmVhLCBzdWJUaXRsZSwgJ3drLWNoYXJ0LXN1YnRpdGxlJywgJzEuOGVtJywgX3RpdGxlSGVpZ2h0KVxuXG4gICAgICByZXR1cm4gYXJlYS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodFxuXG4gICAgZ2V0QXhpc1JlY3QgPSAoZGltKSAtPlxuICAgICAgYXhpcyA9IF9jb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIGRpbS5zY2FsZSgpLnJhbmdlKFswLDEwMF0pXG4gICAgICBheGlzLmNhbGwoZGltLmF4aXMoKSlcblxuXG5cbiAgICAgIGlmIGRpbS5yb3RhdGVUaWNrTGFiZWxzKClcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKHtkeTonLTAuNzFlbScsIHg6LTl9KVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJyxcInRyYW5zbGF0ZSgwLDkpIHJvdGF0ZSgje2RpbS5yb3RhdGVUaWNrTGFiZWxzKCl9KVwiKVxuICAgICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgaWYgZGltLmF4aXNPcmllbnQoKSBpcyAnYm90dG9tJyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0JylcblxuICAgICAgYm94ID0gYXhpcy5ub2RlKCkuZ2V0QkJveCgpXG4gICAgICBheGlzLnJlbW92ZSgpXG4gICAgICByZXR1cm4gYm94XG5cbiAgICBkcmF3QXhpcyA9IChkaW0pIC0+XG4gICAgICBheGlzID0gX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtYXhpcy53ay1jaGFydC0je2RpbS5heGlzT3JpZW50KCl9XCIpXG4gICAgICBpZiBheGlzLmVtcHR5KClcbiAgICAgICAgYXhpcyA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcyB3ay1jaGFydC0nICsgZGltLmF4aXNPcmllbnQoKSlcblxuICAgICAgYXhpcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oX2R1cmF0aW9uKS5jYWxsKGRpbS5heGlzKCkpXG5cbiAgICAgIGlmIGRpbS5yb3RhdGVUaWNrTGFiZWxzKClcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtI3tkaW0uYXhpc09yaWVudCgpfS53ay1jaGFydC1heGlzIHRleHRcIilcbiAgICAgICAgICAuYXR0cih7ZHk6Jy0wLjcxZW0nLCB4Oi05fSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJyxcInRyYW5zbGF0ZSgwLDkpIHJvdGF0ZSgje2RpbS5yb3RhdGVUaWNrTGFiZWxzKCl9KVwiKVxuICAgICAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCBpZiBkaW0uYXhpc09yaWVudCgpIGlzICdib3R0b20nIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnKVxuICAgICAgZWxzZVxuICAgICAgICBheGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC0je2RpbS5heGlzT3JpZW50KCl9LndrLWNoYXJ0LWF4aXMgdGV4dFwiKS5hdHRyKCd0cmFuc2Zvcm0nLCBudWxsKVxuXG4gICAgX3JlbW92ZUF4aXMgPSAob3JpZW50KSAtPlxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtYXhpcy53ay1jaGFydC0je29yaWVudH1cIikucmVtb3ZlKClcblxuICAgIF9yZW1vdmVMYWJlbCA9IChvcmllbnQpIC0+XG4gICAgICBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1sYWJlbC53ay1jaGFydC0je29yaWVudH1cIikucmVtb3ZlKClcblxuICAgIGRyYXdHcmlkID0gKHMsIG5vQW5pbWF0aW9uKSAtPlxuICAgICAgZHVyYXRpb24gPSBpZiBub0FuaW1hdGlvbiB0aGVuIDAgZWxzZSBfZHVyYXRpb25cbiAgICAgIGtpbmQgPSBzLmtpbmQoKVxuICAgICAgdGlja3MgPSBpZiBzLmlzT3JkaW5hbCgpIHRoZW4gcy5zY2FsZSgpLnJhbmdlKCkgZWxzZSBzLnNjYWxlKCkudGlja3MoKVxuICAgICAgZ3JpZExpbmVzID0gX2NvbnRhaW5lci5zZWxlY3RBbGwoXCIud2stY2hhcnQtZ3JpZC53ay1jaGFydC0je2tpbmR9XCIpLmRhdGEodGlja3MsIChkKSAtPiBkKVxuICAgICAgZ3JpZExpbmVzLmVudGVyKCkuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWdyaWQgd2stY2hhcnQtI3traW5kfVwiKVxuICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApXG4gICAgICBpZiBraW5kIGlzICd5J1xuICAgICAgICBncmlkTGluZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgIHgxOjAsXG4gICAgICAgICAgICB4MjogX2lubmVyV2lkdGgsXG4gICAgICAgICAgICB5MTooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuICBkIGVsc2Ugcy5zY2FsZSgpKGQpLFxuICAgICAgICAgICAgeTI6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkIGVsc2Ugcy5zY2FsZSgpKGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICBlbHNlXG4gICAgICAgIGdyaWRMaW5lcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgeTE6MCxcbiAgICAgICAgICAgIHkyOiBfaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICB4MTooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgZWxzZSBzLnNjYWxlKCkoZCksXG4gICAgICAgICAgICB4MjooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgZWxzZSBzLnNjYWxlKCkoZClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgIGdyaWRMaW5lcy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICMtLS0gQnVpbGQgdGhlIGNvbnRhaW5lciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBidWlsZCBnZW5lcmljIGVsZW1lbnRzIGZpcnN0XG5cbiAgICBfZ2VuQ2hhcnRGcmFtZSA9ICgpIC0+XG4gICAgICBfc3ZnID0gX2VsZW1lbnRTZWxlY3Rpb24uYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydCcpLmFwcGVuZCgnc3ZnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQnKVxuICAgICAgX3N2Zy5hcHBlbmQoJ2RlZnMnKS5hcHBlbmQoJ2NsaXBQYXRoJykuYXR0cignaWQnLCBcIndrLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9XCIpLmFwcGVuZCgncmVjdCcpXG4gICAgICBfY29udGFpbmVyPSBfc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtY29udGFpbmVyJylcbiAgICAgIF9vdmVybGF5ID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ2FsbCcpXG4gICAgICBfb3ZlcmxheS5hcHBlbmQoJ3JlY3QnKS5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYWNrZ3JvdW5kJykuZGF0dW0oe25hbWU6J2JhY2tncm91bmQnfSlcbiAgICAgIF9jaGFydEFyZWEgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuXG4gICAgIyBzdGFydCB0byBidWlsZCBhbmQgc2l6ZSB0aGUgZWxlbWVudHMgZnJvbSB0b3AgdG8gYm90dG9tXG5cbiAgICAjLS0tIGNoYXJ0IGZyYW1lICh0aXRsZSwgYXhpcywgZ3JpZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd0NoYXJ0RnJhbWUgPSAobm90QW5pbWF0ZWQpIC0+XG4gICAgICBib3VuZHMgPSBfZWxlbWVudFNlbGVjdGlvbi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIF9kdXJhdGlvbiA9IGlmIG5vdEFuaW1hdGVkIHRoZW4gMCBlbHNlIG1lLmNoYXJ0KCkuYW5pbWF0aW9uRHVyYXRpb24oKVxuICAgICAgX2hlaWdodCA9IGJvdW5kcy5oZWlnaHRcbiAgICAgIF93aWR0aCA9IGJvdW5kcy53aWR0aFxuICAgICAgdGl0bGVBcmVhSGVpZ2h0ID0gZHJhd1RpdGxlQXJlYShfY2hhcnQudGl0bGUoKSwgX2NoYXJ0LnN1YlRpdGxlKCkpXG5cbiAgICAgICMtLS0gZ2V0IHNpemluZyBvZiBmcmFtZSBjb21wb25lbnRzIGJlZm9yZSBwb3NpdGlvbmluZyB0aGVtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXhpc1JlY3QgPSB7dG9wOntoZWlnaHQ6MCwgd2lkdGg6MH0sYm90dG9tOntoZWlnaHQ6MCwgd2lkdGg6MH0sbGVmdDp7aGVpZ2h0OjAsIHdpZHRoOjB9LHJpZ2h0OntoZWlnaHQ6MCwgd2lkdGg6MH19XG4gICAgICBsYWJlbEhlaWdodCA9IHt0b3A6MCAsYm90dG9tOjAsIGxlZnQ6MCwgcmlnaHQ6MH1cblxuICAgICAgZm9yIGwgaW4gX2xheW91dHNcbiAgICAgICAgZm9yIGssIHMgb2YgbC5zY2FsZXMoKS5hbGxLaW5kcygpXG4gICAgICAgICAgaWYgcy5zaG93QXhpcygpXG4gICAgICAgICAgICBzLmF4aXMoKS5zY2FsZShzLnNjYWxlKCkpLm9yaWVudChzLmF4aXNPcmllbnQoKSkgICMgZW5zdXJlIHRoZSBheGlzIHdvcmtzIG9uIHRoZSByaWdodCBzY2FsZVxuICAgICAgICAgICAgYXhpc1JlY3Rbcy5heGlzT3JpZW50KCldID0gZ2V0QXhpc1JlY3QocylcbiAgICAgICAgICAgICMtLS0gZHJhdyBsYWJlbCAtLS1cbiAgICAgICAgICAgIGxhYmVsID0gX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtbGFiZWwud2stY2hhcnQtI3tzLmF4aXNPcmllbnQoKX1cIilcbiAgICAgICAgICAgIGlmIHMuc2hvd0xhYmVsKClcbiAgICAgICAgICAgICAgaWYgbGFiZWwuZW1wdHkoKVxuICAgICAgICAgICAgICAgIGxhYmVsID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYWJlbCB3ay1jaGFydC0nICArIHMuYXhpc09yaWVudCgpKVxuICAgICAgICAgICAgICBsYWJlbEhlaWdodFtzLmF4aXNPcmllbnQoKV0gPSBkcmF3QW5kUG9zaXRpb25UZXh0KGxhYmVsLCBzLmF4aXNMYWJlbCgpLCAnd2stY2hhcnQtbGFiZWwtdGV4dCcsICcxLjVlbScpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsYWJlbC5yZW1vdmUoKVxuICAgICAgICAgIGlmIHMuYXhpc09yaWVudE9sZCgpIGFuZCBzLmF4aXNPcmllbnRPbGQoKSBpc250IHMuYXhpc09yaWVudCgpXG4gICAgICAgICAgICBfcmVtb3ZlQXhpcyhzLmF4aXNPcmllbnRPbGQoKSlcbiAgICAgICAgICAgIF9yZW1vdmVMYWJlbChzLmF4aXNPcmllbnRPbGQoKSlcblxuXG5cbiAgICAgICMtLS0gY29tcHV0ZSBzaXplIG9mIHRoZSBkcmF3aW5nIGFyZWEgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2ZyYW1lSGVpZ2h0ID0gdGl0bGVBcmVhSGVpZ2h0ICsgYXhpc1JlY3QudG9wLmhlaWdodCArIGxhYmVsSGVpZ2h0LnRvcCArIGF4aXNSZWN0LmJvdHRvbS5oZWlnaHQgKyBsYWJlbEhlaWdodC5ib3R0b20gKyBfbWFyZ2luLnRvcCArIF9tYXJnaW4uYm90dG9tXG4gICAgICBfZnJhbWVXaWR0aCA9IGF4aXNSZWN0LnJpZ2h0LndpZHRoICsgbGFiZWxIZWlnaHQucmlnaHQgKyBheGlzUmVjdC5sZWZ0LndpZHRoICsgbGFiZWxIZWlnaHQubGVmdCArIF9tYXJnaW4ubGVmdCArIF9tYXJnaW4ucmlnaHRcblxuICAgICAgaWYgX2ZyYW1lSGVpZ2h0IDwgX2hlaWdodFxuICAgICAgICBfaW5uZXJIZWlnaHQgPSBfaGVpZ2h0IC0gX2ZyYW1lSGVpZ2h0XG4gICAgICBlbHNlXG4gICAgICAgIF9pbm5lckhlaWdodCA9IDBcblxuICAgICAgaWYgX2ZyYW1lV2lkdGggPCBfd2lkdGhcbiAgICAgICAgX2lubmVyV2lkdGggPSBfd2lkdGggLSBfZnJhbWVXaWR0aFxuICAgICAgZWxzZVxuICAgICAgICBfaW5uZXJXaWR0aCA9IDBcblxuICAgICAgIy0tLSByZXNldCBzY2FsZSByYW5nZXMgYW5kIHJlZHJhdyBheGlzIHdpdGggYWRqdXN0ZWQgcmFuZ2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIGsgaXMgJ3gnIG9yIGsgaXMgJ3JhbmdlWCdcbiAgICAgICAgICAgIHMucmFuZ2UoWzAsIF9pbm5lcldpZHRoXSlcbiAgICAgICAgICBlbHNlIGlmIGsgaXMgJ3knIG9yIGsgaXMgJ3JhbmdlWSdcbiAgICAgICAgICAgIGlmIGwuc2hvd0xhYmVscygpXG4gICAgICAgICAgICAgIHMucmFuZ2UoW19pbm5lckhlaWdodCwgMjBdKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBzLnJhbmdlKFtfaW5uZXJIZWlnaHQsIDBdKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKVxuICAgICAgICAgICAgZHJhd0F4aXMocylcblxuICAgICAgIy0tLSBwb3NpdGlvbiBmcmFtZSBlbGVtZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxlZnRNYXJnaW4gPSBheGlzUmVjdC5sZWZ0LndpZHRoICsgbGFiZWxIZWlnaHQubGVmdCArIF9tYXJnaW4ubGVmdFxuICAgICAgdG9wTWFyZ2luID0gdGl0bGVBcmVhSGVpZ2h0ICsgYXhpc1JlY3QudG9wLmhlaWdodCAgKyBsYWJlbEhlaWdodC50b3AgKyBfbWFyZ2luLnRvcFxuXG4gICAgICBfc3BhY2VkQ29udGFpbmVyID0gX2NvbnRhaW5lci5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnRNYXJnaW59LCAje3RvcE1hcmdpbn0pXCIpXG4gICAgICBfc3ZnLnNlbGVjdChcIiN3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfSByZWN0XCIpLmF0dHIoJ3dpZHRoJywgX2lubmVyV2lkdGgpLmF0dHIoJ2hlaWdodCcsIF9pbm5lckhlaWdodClcbiAgICAgIF9zcGFjZWRDb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtb3ZlcmxheT4ud2stY2hhcnQtYmFja2dyb3VuZCcpLmF0dHIoJ3dpZHRoJywgX2lubmVyV2lkdGgpLmF0dHIoJ2hlaWdodCcsIF9pbm5lckhlaWdodClcbiAgICAgIF9zcGFjZWRDb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtYXJlYScpLnN0eWxlKCdjbGlwLXBhdGgnLCBcInVybCgjd2stY2hhcnQtY2xpcC0je19jb250YWluZXJJZH0pXCIpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LW92ZXJsYXknKS5zdHlsZSgnY2xpcC1wYXRoJywgXCJ1cmwoI3drLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9KVwiKVxuXG4gICAgICBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtcmlnaHQnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19pbm5lcldpZHRofSwgMClcIilcbiAgICAgIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy53ay1jaGFydC1ib3R0b20nKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCAje19pbm5lckhlaWdodH0pXCIpXG5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtbGFiZWwud2stY2hhcnQtbGVmdCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7LWF4aXNSZWN0LmxlZnQud2lkdGgtbGFiZWxIZWlnaHQubGVmdCAvIDIgfSwgI3tfaW5uZXJIZWlnaHQvMn0pIHJvdGF0ZSgtOTApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LXJpZ2h0JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aCtheGlzUmVjdC5yaWdodC53aWR0aCArIGxhYmVsSGVpZ2h0LnJpZ2h0IC8gMn0sICN7X2lubmVySGVpZ2h0LzJ9KSByb3RhdGUoOTApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LXRvcCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGggLyAyfSwgI3stYXhpc1JlY3QudG9wLmhlaWdodCAtIGxhYmVsSGVpZ2h0LnRvcCAvIDIgfSlcIilcbiAgICAgIF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtbGFiZWwud2stY2hhcnQtYm90dG9tJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aCAvIDJ9LCAje19pbm5lckhlaWdodCArIGF4aXNSZWN0LmJvdHRvbS5oZWlnaHQgKyBsYWJlbEhlaWdodC5ib3R0b20gfSlcIilcblxuICAgICAgX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC10aXRsZS1hcmVhJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aC8yfSwgI3stdG9wTWFyZ2luICsgX3RpdGxlSGVpZ2h0fSlcIilcblxuICAgICAgIy0tLSBmaW5hbGx5LCBkcmF3IGdyaWQgbGluZXNcblxuICAgICAgZm9yIGwgaW4gX2xheW91dHNcbiAgICAgICAgZm9yIGssIHMgb2YgbC5zY2FsZXMoKS5hbGxLaW5kcygpXG4gICAgICAgICAgaWYgcy5zaG93QXhpcygpIGFuZCBzLnNob3dHcmlkKClcbiAgICAgICAgICAgIGRyYXdHcmlkKHMpXG5cbiAgICAgIF9jaGFydC5iZWhhdmlvcigpLm92ZXJsYXkoX292ZXJsYXkpXG4gICAgICBfY2hhcnQuYmVoYXZpb3IoKS5jb250YWluZXIoX2NoYXJ0QXJlYSlcblxuICAgICMtLS0gQnJ1c2ggQWNjZWxlcmF0b3IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5kcmF3U2luZ2xlQXhpcyA9IChzY2FsZSkgLT5cbiAgICAgIGlmIHNjYWxlLnNob3dBeGlzKClcbiAgICAgICAgYSA9IF9zcGFjZWRDb250YWluZXIuc2VsZWN0KFwiLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtI3tzY2FsZS5heGlzKCkub3JpZW50KCl9XCIpXG4gICAgICAgIGEuY2FsbChzY2FsZS5heGlzKCkpXG5cbiAgICAgICAgaWYgc2NhbGUuc2hvd0dyaWQoKVxuICAgICAgICAgIGRyYXdHcmlkKHNjYWxlLCB0cnVlKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gY29udGFpbmVyIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnbGF5b3V0JywgKCRsb2csIHNjYWxlLCBzY2FsZUxpc3QsIHRpbWluZykgLT5cblxuICBsYXlvdXRDbnRyID0gMFxuXG4gIGxheW91dCA9ICgpIC0+XG4gICAgX2lkID0gXCJsYXlvdXQje2xheW91dENudHIrK31cIlxuICAgIF9jb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfZGF0YSA9IHVuZGVmaW5lZFxuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9zY2FsZUxpc3QgPSBzY2FsZUxpc3QoKVxuICAgIF9zaG93TGFiZWxzID0gZmFsc2VcbiAgICBfbGF5b3V0TGlmZUN5Y2xlID0gZDMuZGlzcGF0Y2goJ2NvbmZpZ3VyZScsICdkcmF3JywgJ3ByZXBhcmVEYXRhJywgJ2JydXNoJywgJ3JlZHJhdycsICdkcmF3QXhpcycsICd1cGRhdGUnLCAndXBkYXRlQXR0cnMnLCAnYnJ1c2hEcmF3JylcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLmlkID0gKGlkKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IGNoYXJ0XG4gICAgICAgIF9zY2FsZUxpc3QucGFyZW50U2NhbGVzKGNoYXJ0LnNjYWxlcygpKVxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJjb25maWd1cmUuI3ttZS5pZCgpfVwiLCAoKSAtPiBfbGF5b3V0TGlmZUN5Y2xlLmNvbmZpZ3VyZS5hcHBseShtZS5zY2FsZXMoKSkgI3Bhc3N0aHJvdWdoXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcImRyYXdDaGFydC4je21lLmlkKCl9XCIsIG1lLmRyYXcgIyByZWdpc3RlciBmb3IgdGhlIGRyYXdpbmcgZXZlbnRcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwicHJlcGFyZURhdGEuI3ttZS5pZCgpfVwiLCBtZS5wcmVwYXJlRGF0YVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNjYWxlcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NjYWxlTGlzdFxuXG4gICAgbWUuc2NhbGVQcm9wZXJ0aWVzID0gKCkgLT5cbiAgICAgIHJldHVybiBtZS5zY2FsZXMoKS5nZXRTY2FsZVByb3BlcnRpZXMoKVxuXG4gICAgbWUuY29udGFpbmVyID0gKG9iaikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY29udGFpbmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9jb250YWluZXIgPSBvYmpcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zaG93TGFiZWxzID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0xhYmVsc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0xhYmVscyA9IHRydWVGYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmJlaGF2aW9yID0gKCkgLT5cbiAgICAgIG1lLmNoYXJ0KCkuYmVoYXZpb3IoKVxuXG4gICAgbWUucHJlcGFyZURhdGEgPSAoZGF0YSkgLT5cbiAgICAgIGFyZ3MgPSBbXVxuICAgICAgZm9yIGtpbmQgaW4gWyd4JywneScsICdjb2xvcicsICdzaXplJywgJ3NoYXBlJywgJ3JhbmdlWCcsICdyYW5nZVknXVxuICAgICAgICBhcmdzLnB1c2goX3NjYWxlTGlzdC5nZXRLaW5kKGtpbmQpKVxuICAgICAgX2xheW91dExpZmVDeWNsZS5wcmVwYXJlRGF0YS5hcHBseShkYXRhLCBhcmdzKVxuXG4gICAgbWUubGlmZUN5Y2xlID0gKCktPlxuICAgICAgcmV0dXJuIF9sYXlvdXRMaWZlQ3ljbGVcblxuXG4gICAgIy0tLSBEUllvdXQgZnJvbSBkcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldERyYXdBcmVhID0gKCkgLT5cbiAgICAgIGNvbnRhaW5lciA9IF9jb250YWluZXIuZ2V0Q2hhcnRBcmVhKClcbiAgICAgIGRyYXdBcmVhID0gY29udGFpbmVyLnNlbGVjdChcIi4je21lLmlkKCl9XCIpXG4gICAgICBpZiBkcmF3QXJlYS5lbXB0eSgpXG4gICAgICAgIGRyYXdBcmVhID0gY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgKGQpIC0+IG1lLmlkKCkpXG4gICAgICByZXR1cm4gZHJhd0FyZWFcblxuICAgIGJ1aWxkQXJncyA9IChkYXRhLCBub3RBbmltYXRlZCkgLT5cbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGhlaWdodDpfY29udGFpbmVyLmhlaWdodCgpLFxuICAgICAgICB3aWR0aDpfY29udGFpbmVyLndpZHRoKCksXG4gICAgICAgIG1hcmdpbnM6X2NvbnRhaW5lci5tYXJnaW5zKCksXG4gICAgICAgIGR1cmF0aW9uOiBpZiBub3RBbmltYXRlZCB0aGVuIDAgZWxzZSBtZS5jaGFydCgpLmFuaW1hdGlvbkR1cmF0aW9uKClcbiAgICAgIH1cbiAgICAgIGFyZ3MgPSBbZGF0YSwgb3B0aW9uc11cbiAgICAgIGZvciBraW5kIGluIFsneCcsJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZScsICdyYW5nZVgnLCAncmFuZ2VZJ11cbiAgICAgICAgYXJncy5wdXNoKF9zY2FsZUxpc3QuZ2V0S2luZChraW5kKSlcbiAgICAgIHJldHVybiBhcmdzXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhdyA9IChkYXRhLCBub3RBbmltYXRlZCkgLT5cbiAgICAgIF9kYXRhID0gZGF0YVxuXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLmRyYXcuYXBwbHkoZ2V0RHJhd0FyZWEoKSwgYnVpbGRBcmdzKGRhdGEsIG5vdEFuaW1hdGVkKSlcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAncmVkcmF3JywgbWUucmVkcmF3XG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICd1cGRhdGUnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnVwZGF0ZVxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAnZHJhd0F4aXMnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLmRyYXdBeGlzXG4gICAgICBfbGF5b3V0TGlmZUN5Y2xlLm9uICd1cGRhdGVBdHRycycsIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkudXBkYXRlQXR0cnNcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAnYnJ1c2gnLCAoYXhpcywgbm90QW5pbWF0ZWQpIC0+XG4gICAgICAgIF9jb250YWluZXIuZHJhd1NpbmdsZUF4aXMoYXhpcylcbiAgICAgICAgX2xheW91dExpZmVDeWNsZS5icnVzaERyYXcuYXBwbHkoZ2V0RHJhd0FyZWEoKSwgYnVpbGRBcmdzKF9kYXRhLCBub3RBbmltYXRlZCkpXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gbGF5b3V0IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnbGVnZW5kJywgKCRsb2csICRjb21waWxlLCAkcm9vdFNjb3BlLCAkdGVtcGxhdGVDYWNoZSwgdGVtcGxhdGVEaXIpIC0+XG5cbiAgbGVnZW5kQ250ID0gMFxuXG4gIHVuaXF1ZVZhbHVlcyA9IChhcnIpIC0+XG4gICAgc2V0ID0ge31cbiAgICBmb3IgZSBpbiBhcnJcbiAgICAgIHNldFtlXSA9IDBcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc2V0KVxuXG4gIGxlZ2VuZCA9ICgpIC0+XG5cbiAgICBfaWQgPSBcImxlZ2VuZC0je2xlZ2VuZENudCsrfVwiXG4gICAgX3Bvc2l0aW9uID0gJ3RvcC1yaWdodCdcbiAgICBfc2NhbGUgPSB1bmRlZmluZWRcbiAgICBfdGVtcGxhdGVQYXRoID0gdW5kZWZpbmVkXG4gICAgX2xlZ2VuZFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpXG4gICAgX3RlbXBsYXRlID0gdW5kZWZpbmVkXG4gICAgX3BhcnNlZFRlbXBsYXRlID0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lckRpdiA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmREaXYgPSB1bmRlZmluZWRcbiAgICBfdGl0bGUgPSB1bmRlZmluZWRcbiAgICBfbGF5b3V0ID0gdW5kZWZpbmVkXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfb3B0aW9ucyA9IHVuZGVmaW5lZFxuICAgIF9zaG93ID0gZmFsc2VcbiAgICBfc2hvd1ZhbHVlcyA9IGZhbHNlXG5cbiAgICBtZSA9IHt9XG5cbiAgICBtZS5wb3NpdGlvbiA9IChwb3MpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Bvc2l0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIF9wb3NpdGlvbiA9IHBvc1xuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNob3cgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93XG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5zaG93VmFsdWVzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd1ZhbHVlc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd1ZhbHVlcyA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGl2ID0gKHNlbGVjdGlvbikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGVnZW5kRGl2XG4gICAgICBlbHNlXG4gICAgICAgIF9sZWdlbmREaXYgPSBzZWxlY3Rpb25cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXlvdXQgPSAobGF5b3V0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXlvdXRcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheW91dCA9IGxheW91dFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNjYWxlID0gKHNjYWxlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zY2FsZVxuICAgICAgZWxzZVxuICAgICAgICBfc2NhbGUgPSBzY2FsZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRpdGxlID0gKHRpdGxlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90aXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfdGl0bGUgPSB0aXRsZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRlbXBsYXRlID0gKHBhdGgpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3RlbXBsYXRlUGF0aFxuICAgICAgZWxzZVxuICAgICAgICBfdGVtcGxhdGVQYXRoID0gcGF0aFxuICAgICAgICBfdGVtcGxhdGUgPSAkdGVtcGxhdGVDYWNoZS5nZXQoX3RlbXBsYXRlUGF0aClcbiAgICAgICAgX3BhcnNlZFRlbXBsYXRlID0gJGNvbXBpbGUoX3RlbXBsYXRlKShfbGVnZW5kU2NvcGUpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZHJhdyA9IChkYXRhLCBvcHRpb25zKSAtPlxuICAgICAgX2RhdGEgPSBkYXRhXG4gICAgICBfb3B0aW9ucyA9IG9wdGlvbnNcbiAgICAgICMkbG9nLmluZm8gJ2RyYXdpbmcgTGVnZW5kJ1xuICAgICAgX2NvbnRhaW5lckRpdiA9IF9sZWdlbmREaXYgb3IgZDMuc2VsZWN0KG1lLnNjYWxlKCkucGFyZW50KCkuY29udGFpbmVyKCkuZWxlbWVudCgpKS5zZWxlY3QoJy53ay1jaGFydCcpXG4gICAgICBpZiBtZS5zaG93KClcbiAgICAgICAgaWYgX2NvbnRhaW5lckRpdi5zZWxlY3QoJy53ay1jaGFydC1sZWdlbmQnKS5lbXB0eSgpXG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KF9jb250YWluZXJEaXYubm9kZSgpKS5hcHBlbmQoX3BhcnNlZFRlbXBsYXRlKVxuXG4gICAgICAgIGlmIG1lLnNob3dWYWx1ZXMoKVxuICAgICAgICAgIGxheWVycyA9IHVuaXF1ZVZhbHVlcyhfc2NhbGUudmFsdWUoZGF0YSkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcnMgPSBfc2NhbGUubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgcyA9IF9zY2FsZS5zY2FsZSgpXG4gICAgICAgIGlmIG1lLmxheW91dCgpPy5zY2FsZXMoKS5sYXllclNjYWxlKClcbiAgICAgICAgICBzID0gbWUubGF5b3V0KCkuc2NhbGVzKCkubGF5ZXJTY2FsZSgpLnNjYWxlKClcbiAgICAgICAgaWYgX3NjYWxlLmtpbmQoKSBpc250ICdzaGFwZSdcbiAgICAgICAgICBfbGVnZW5kU2NvcGUubGVnZW5kUm93cyA9IGxheWVycy5tYXAoKGQpIC0+IHt2YWx1ZTpkLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOnMoZCl9fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9sZWdlbmRTY29wZS5sZWdlbmRSb3dzID0gbGF5ZXJzLm1hcCgoZCkgLT4ge3ZhbHVlOmQsIHBhdGg6ZDMuc3ZnLnN5bWJvbCgpLnR5cGUocyhkKSkuc2l6ZSg4MCkoKX0pXG4gICAgICAgICAgIyRsb2cubG9nIF9sZWdlbmRTY29wZS5sZWdlbmRSb3dzXG4gICAgICAgIF9sZWdlbmRTY29wZS5zaG93TGVnZW5kID0gdHJ1ZVxuICAgICAgICBfbGVnZW5kU2NvcGUucG9zaXRpb24gPSB7XG4gICAgICAgICAgcG9zaXRpb246IGlmIF9sZWdlbmREaXYgdGhlbiAncmVsYXRpdmUnIGVsc2UgJ2Fic29sdXRlJ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgbm90IF9sZWdlbmREaXZcbiAgICAgICAgICBjb250YWluZXJSZWN0ID0gX2NvbnRhaW5lckRpdi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICBjaGFydEFyZWFSZWN0ID0gX2NvbnRhaW5lckRpdi5zZWxlY3QoJy53ay1jaGFydC1vdmVybGF5IHJlY3QnKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICBmb3IgcCBpbiBfcG9zaXRpb24uc3BsaXQoJy0nKVxuICAgICAgICAgICAgICBfbGVnZW5kU2NvcGUucG9zaXRpb25bcF0gPSBcIiN7TWF0aC5hYnMoY29udGFpbmVyUmVjdFtwXSAtIGNoYXJ0QXJlYVJlY3RbcF0pfXB4XCJcbiAgICAgICAgX2xlZ2VuZFNjb3BlLnRpdGxlID0gX3RpdGxlXG4gICAgICBlbHNlXG4gICAgICAgIF9wYXJzZWRUZW1wbGF0ZS5yZW1vdmUoKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5yZWdpc3RlciA9IChsYXlvdXQpIC0+XG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gXCJkcmF3LiN7X2lkfVwiLCBtZS5kcmF3XG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRlbXBsYXRlKHRlbXBsYXRlRGlyICsgJ2xlZ2VuZC5odG1sJylcblxuICAgIG1lLnJlZHJhdyA9ICgpIC0+XG4gICAgICBpZiBfZGF0YSBhbmQgX29wdGlvbnNcbiAgICAgICAgbWUuZHJhdyhfZGF0YSwgX29wdGlvbnMpXG4gICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBsZWdlbmQiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdzY2FsZScsICgkbG9nLCBsZWdlbmQsIGZvcm1hdERlZmF1bHRzLCB3a0NoYXJ0U2NhbGVzKSAtPlxuXG4gIHNjYWxlID0gKCkgLT5cbiAgICBfaWQgPSAnJ1xuICAgIF9zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgX3NjYWxlVHlwZSA9ICdsaW5lYXInXG4gICAgX2V4cG9uZW50ID0gMVxuICAgIF9pc09yZGluYWwgPSBmYWxzZVxuICAgIF9kb21haW4gPSB1bmRlZmluZWRcbiAgICBfZG9tYWluQ2FsYyA9IHVuZGVmaW5lZFxuICAgIF9jYWxjdWxhdGVkRG9tYWluID0gdW5kZWZpbmVkXG4gICAgX3Jlc2V0T25OZXdEYXRhID0gZmFsc2VcbiAgICBfcHJvcGVydHkgPSAnJ1xuICAgIF9sYXllclByb3AgPSAnJ1xuICAgIF9sYXllckV4Y2x1ZGUgPSBbXVxuICAgIF9sb3dlclByb3BlcnR5ID0gJydcbiAgICBfdXBwZXJQcm9wZXJ0eSA9ICcnXG4gICAgX3JhbmdlID0gdW5kZWZpbmVkXG4gICAgX3JhbmdlUGFkZGluZyA9IDAuM1xuICAgIF9yYW5nZU91dGVyUGFkZGluZyA9IDAuM1xuICAgIF9pbnB1dEZvcm1hdFN0cmluZyA9IHVuZGVmaW5lZFxuICAgIF9pbnB1dEZvcm1hdEZuID0gKGRhdGEpIC0+IGlmIGlzTmFOKCtkYXRhKSBvciBfLmlzRGF0ZShkYXRhKSB0aGVuIGRhdGEgZWxzZSArZGF0YVxuXG4gICAgX3Nob3dBeGlzID0gZmFsc2VcbiAgICBfYXhpc09yaWVudCA9IHVuZGVmaW5lZFxuICAgIF9heGlzT3JpZW50T2xkID0gdW5kZWZpbmVkXG4gICAgX2F4aXMgPSB1bmRlZmluZWRcbiAgICBfdGlja3MgPSB1bmRlZmluZWRcbiAgICBfdGlja0Zvcm1hdCA9IHVuZGVmaW5lZFxuICAgIF90aWNrVmFsdWVzID0gdW5kZWZpbmVkXG4gICAgX3JvdGF0ZVRpY2tMYWJlbHMgPSB1bmRlZmluZWRcbiAgICBfc2hvd0xhYmVsID0gZmFsc2VcbiAgICBfYXhpc0xhYmVsID0gdW5kZWZpbmVkXG4gICAgX3Nob3dHcmlkID0gZmFsc2VcbiAgICBfaXNIb3Jpem9udGFsID0gZmFsc2VcbiAgICBfaXNWZXJ0aWNhbCA9IGZhbHNlXG4gICAgX2tpbmQgPSB1bmRlZmluZWRcbiAgICBfcGFyZW50ID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0ID0gdW5kZWZpbmVkXG4gICAgX2xheW91dCA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmQgPSBsZWdlbmQoKVxuICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSB1bmRlZmluZWRcbiAgICBfb3V0cHV0Rm9ybWF0Rm4gPSB1bmRlZmluZWRcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0tIHV0aWxpdHkgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGtleXMgPSAoZGF0YSkgLT4gaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gXy5yZWplY3QoXy5rZXlzKGRhdGFbMF0pLCAoZCkgLT4gZCBpcyAnJCRoYXNoS2V5JykgZWxzZSBfLnJlamVjdChfLmtleXMoZGF0YSksIChkKSAtPiBkIGlzICckJGhhc2hLZXknKVxuXG4gICAgbGF5ZXJUb3RhbCA9IChkLCBsYXllcktleXMpIC0+XG4gICAgICBsYXllcktleXMucmVkdWNlKFxuICAgICAgICAocHJldiwgbmV4dCkgLT4gK3ByZXYgKyArbWUubGF5ZXJWYWx1ZShkLG5leHQpXG4gICAgICAsIDApXG5cbiAgICBsYXllck1heCA9IChkYXRhLCBsYXllcktleXMpIC0+XG4gICAgICBkMy5tYXgoZGF0YSwgKGQpIC0+IGQzLm1heChsYXllcktleXMsIChrKSAtPiBtZS5sYXllclZhbHVlKGQsaykpKVxuXG4gICAgbGF5ZXJNaW4gPSAoZGF0YSwgbGF5ZXJLZXlzKSAtPlxuICAgICAgZDMubWluKGRhdGEsIChkKSAtPiBkMy5taW4obGF5ZXJLZXlzLCAoaykgLT4gbWUubGF5ZXJWYWx1ZShkLGspKSlcblxuICAgIHBhcnNlZFZhbHVlID0gKHYpIC0+XG4gICAgICBpZiBfaW5wdXRGb3JtYXRGbi5wYXJzZSB0aGVuIF9pbnB1dEZvcm1hdEZuLnBhcnNlKHYpIGVsc2UgX2lucHV0Rm9ybWF0Rm4odilcblxuICAgIGNhbGNEb21haW4gPSB7XG4gICAgICBleHRlbnQ6IChkYXRhKSAtPlxuICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgcmV0dXJuIFtsYXllck1pbihkYXRhLCBsYXllcktleXMpLCBsYXllck1heChkYXRhLCBsYXllcktleXMpXVxuICAgICAgbWF4OiAoZGF0YSkgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIHJldHVybiBbMCwgbGF5ZXJNYXgoZGF0YSwgbGF5ZXJLZXlzKV1cbiAgICAgIG1pbjogKGRhdGEpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICByZXR1cm4gWzAsIGxheWVyTWluKGRhdGEsIGxheWVyS2V5cyldXG4gICAgICB0b3RhbEV4dGVudDogKGRhdGEpIC0+XG4gICAgICAgIGlmIGRhdGFbMF0uaGFzT3duUHJvcGVydHkoJ3RvdGFsJylcbiAgICAgICAgICByZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgZC50b3RhbCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgICByZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgbGF5ZXJUb3RhbChkLCBsYXllcktleXMpKSlcbiAgICAgIHRvdGFsOiAoZGF0YSkgLT5cbiAgICAgICAgaWYgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eSgndG90YWwnKVxuICAgICAgICAgIHJldHVybiBbMCwgZDMubWF4KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgZC50b3RhbCkpXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgICAgcmV0dXJuIFswLCBkMy5tYXgoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBsYXllclRvdGFsKGQsIGxheWVyS2V5cykpKV1cbiAgICAgIHJhbmdlRXh0ZW50OiAoZGF0YSkgLT5cbiAgICAgICAgaWYgbWUudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgcmV0dXJuIFtkMy5taW4obWUubG93ZXJWYWx1ZShkYXRhKSksIGQzLm1heChtZS51cHBlclZhbHVlKGRhdGEpKV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIGRhdGEubGVuZ3RoID4gMVxuICAgICAgICAgICAgc3RhcnQgPSBtZS5sb3dlclZhbHVlKGRhdGFbMF0pXG4gICAgICAgICAgICBzdGVwID0gbWUubG93ZXJWYWx1ZShkYXRhWzFdKSAtIHN0YXJ0XG4gICAgICAgICAgICByZXR1cm4gW21lLmxvd2VyVmFsdWUoZGF0YVswXSksIHN0YXJ0ICsgc3RlcCAqIChkYXRhLmxlbmd0aCkgXVxuICAgICAgcmFuZ2VNaW46IChkYXRhKSAtPlxuICAgICAgICByZXR1cm4gWzAsIGQzLm1pbihtZS5sb3dlclZhbHVlKGRhdGEpKV1cbiAgICAgIHJhbmdlTWF4OiAoZGF0YSkgLT5cbiAgICAgICAgaWYgbWUudXBwZXJQcm9wZXJ0eSgpXG4gICAgICAgICAgcmV0dXJuIFswLCBkMy5tYXgobWUudXBwZXJWYWx1ZShkYXRhKSldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzdGFydCA9IG1lLmxvd2VyVmFsdWUoZGF0YVswXSlcbiAgICAgICAgICBzdGVwID0gbWUubG93ZXJWYWx1ZShkYXRhWzFdKSAtIHN0YXJ0XG4gICAgICAgICAgcmV0dXJuIFswLCBzdGFydCArIHN0ZXAgKiAoZGF0YS5sZW5ndGgpIF1cbiAgICAgIH1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5pZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2tpbmQgKyAnLicgKyBfcGFyZW50LmlkKClcblxuICAgIG1lLmtpbmQgPSAoa2luZCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfa2luZFxuICAgICAgZWxzZVxuICAgICAgICBfa2luZCA9IGtpbmRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5wYXJlbnQgPSAocGFyZW50KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wYXJlbnRcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhcmVudCA9IHBhcmVudFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmNoYXJ0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY2hhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgX2NoYXJ0ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5sYXlvdXQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXlvdXRcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheW91dCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnNjYWxlID0gKCkgLT5cbiAgICAgIHJldHVybiBfc2NhbGVcblxuICAgIG1lLmxlZ2VuZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2xlZ2VuZFxuXG4gICAgbWUuaXNPcmRpbmFsID0gKCkgLT5cbiAgICAgIF9pc09yZGluYWxcblxuICAgIG1lLmlzSG9yaXpvbnRhbCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2lzSG9yaXpvbnRhbFxuICAgICAgZWxzZVxuICAgICAgICBfaXNIb3Jpem9udGFsID0gdHJ1ZUZhbHNlXG4gICAgICAgIGlmIHRydWVGYWxzZVxuICAgICAgICAgIF9pc1ZlcnRpY2FsID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5pc1ZlcnRpY2FsID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaXNWZXJ0aWNhbFxuICAgICAgZWxzZVxuICAgICAgICBfaXNWZXJ0aWNhbCA9IHRydWVGYWxzZVxuICAgICAgICBpZiB0cnVlRmFsc2VcbiAgICAgICAgICBfaXNIb3Jpem9udGFsID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0gU2NhbGVUeXBlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2NhbGVUeXBlID0gKHR5cGUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlVHlwZVxuICAgICAgZWxzZVxuICAgICAgICBpZiBkMy5zY2FsZS5oYXNPd25Qcm9wZXJ0eSh0eXBlKSAjIHN1cHBvcnQgdGhlIGZ1bGwgbGlzdCBvZiBkMyBzY2FsZSB0eXBlc1xuICAgICAgICAgIF9zY2FsZSA9IGQzLnNjYWxlW3R5cGVdKClcbiAgICAgICAgICBfc2NhbGVUeXBlID0gdHlwZVxuICAgICAgICAgIG1lLmZvcm1hdChmb3JtYXREZWZhdWx0cy5udW1iZXIpXG4gICAgICAgIGVsc2UgaWYgdHlwZSBpcyAndGltZScgIyB0aW1lIHNjYWxlIGlzIGluIGQzLnRpbWUgb2JqZWN0LCBub3QgaW4gZDMuc2NhbGUuXG4gICAgICAgICAgX3NjYWxlID0gZDMudGltZS5zY2FsZSgpXG4gICAgICAgICAgX3NjYWxlVHlwZSA9ICd0aW1lJ1xuICAgICAgICAgIGlmIF9pbnB1dEZvcm1hdFN0cmluZ1xuICAgICAgICAgICAgbWUuZGF0YUZvcm1hdChfaW5wdXRGb3JtYXRTdHJpbmcpXG4gICAgICAgICAgbWUuZm9ybWF0KGZvcm1hdERlZmF1bHRzLmRhdGUpXG4gICAgICAgIGVsc2UgaWYgd2tDaGFydFNjYWxlcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKVxuICAgICAgICAgIF9zY2FsZVR5cGUgPSB0eXBlXG4gICAgICAgICAgX3NjYWxlID0gd2tDaGFydFNjYWxlc1t0eXBlXSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkbG9nLmVycm9yICdFcnJvcjogaWxsZWdhbCBzY2FsZSB0eXBlOicsIHR5cGVcblxuICAgICAgICBfaXNPcmRpbmFsID0gX3NjYWxlVHlwZSBpbiBbJ29yZGluYWwnLCAnY2F0ZWdvcnkxMCcsICdjYXRlZ29yeTIwJywgJ2NhdGVnb3J5MjBiJywgJ2NhdGVnb3J5MjBjJ11cbiAgICAgICAgaWYgX3JhbmdlXG4gICAgICAgICAgbWUucmFuZ2UoX3JhbmdlKVxuXG4gICAgICAgIGlmIF9zaG93QXhpc1xuICAgICAgICAgIF9heGlzLnNjYWxlKF9zY2FsZSlcblxuICAgICAgICBpZiBfZXhwb25lbnQgYW5kIF9zY2FsZVR5cGUgaXMgJ3BvdydcbiAgICAgICAgICBfc2NhbGUuZXhwb25lbnQoX2V4cG9uZW50KVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmV4cG9uZW50ID0gKHZhbHVlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9leHBvbmVudFxuICAgICAgZWxzZVxuICAgICAgICBfZXhwb25lbnQgPSB2YWx1ZVxuICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICdwb3cnXG4gICAgICAgICAgX3NjYWxlLmV4cG9uZW50KF9leHBvbmVudClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIERvbWFpbiBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZG9tYWluID0gKGRvbSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZG9tYWluXG4gICAgICBlbHNlXG4gICAgICAgIF9kb21haW4gPSBkb21cbiAgICAgICAgaWYgXy5pc0FycmF5KF9kb21haW4pXG4gICAgICAgICAgX3NjYWxlLmRvbWFpbihfZG9tYWluKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmRvbWFpbkNhbGMgPSAocnVsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gaWYgX2lzT3JkaW5hbCB0aGVuIHVuZGVmaW5lZCBlbHNlIF9kb21haW5DYWxjXG4gICAgICBlbHNlXG4gICAgICAgIGlmIGNhbGNEb21haW4uaGFzT3duUHJvcGVydHkocnVsZSlcbiAgICAgICAgICBfZG9tYWluQ2FsYyA9IHJ1bGVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRsb2cuZXJyb3IgJ2lsbGVnYWwgZG9tYWluIGNhbGN1bGF0aW9uIHJ1bGU6JywgcnVsZSwgXCIgZXhwZWN0ZWRcIiwgXy5rZXlzKGNhbGNEb21haW4pXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZ2V0RG9tYWluID0gKGRhdGEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlLmRvbWFpbigpXG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfZG9tYWluIGFuZCBtZS5kb21haW5DYWxjKClcbiAgICAgICAgICAgIHJldHVybiBfY2FsY3VsYXRlZERvbWFpblxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgX2RvbWFpblxuICAgICAgICAgICAgcmV0dXJuIF9kb21haW5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gbWUudmFsdWUoZGF0YSlcblxuICAgIG1lLnJlc2V0T25OZXdEYXRhID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcmVzZXRPbk5ld0RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX3Jlc2V0T25OZXdEYXRhID0gdHJ1ZUZhbHNlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBSYW5nZSBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnJhbmdlID0gKHJhbmdlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zY2FsZS5yYW5nZSgpXG4gICAgICBlbHNlXG4gICAgICAgIF9yYW5nZSA9IHJhbmdlXG4gICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ29yZGluYWwnIGFuZCBtZS5raW5kKCkgaW4gWyd4JywneSddXG4gICAgICAgICAgICBfc2NhbGUucmFuZ2VCYW5kcyhyYW5nZSwgX3JhbmdlUGFkZGluZywgX3JhbmdlT3V0ZXJQYWRkaW5nKVxuICAgICAgICBlbHNlIGlmIG5vdCAoX3NjYWxlVHlwZSBpbiBbJ2NhdGVnb3J5MTAnLCAnY2F0ZWdvcnkyMCcsICdjYXRlZ29yeTIwYicsICdjYXRlZ29yeTIwYyddKVxuICAgICAgICAgIF9zY2FsZS5yYW5nZShyYW5nZSkgIyBpZ25vcmUgcmFuZ2UgZm9yIGNvbG9yIGNhdGVnb3J5IHNjYWxlc1xuXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucmFuZ2VQYWRkaW5nID0gKGNvbmZpZykgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiB7cGFkZGluZzpfcmFuZ2VQYWRkaW5nLCBvdXRlclBhZGRpbmc6X3JhbmdlT3V0ZXJQYWRkaW5nfVxuICAgICAgZWxzZVxuICAgICAgICBfcmFuZ2VQYWRkaW5nID0gY29uZmlnLnBhZGRpbmdcbiAgICAgICAgX3JhbmdlT3V0ZXJQYWRkaW5nID0gY29uZmlnLm91dGVyUGFkZGluZ1xuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gcHJvcGVydHkgcmVsYXRlZCBhdHRyaWJ1dGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5wcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wcm9wZXJ0eVxuICAgICAgZWxzZVxuICAgICAgICBfcHJvcGVydHkgPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJQcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXllclByb3BcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyUHJvcCA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllckV4Y2x1ZGUgPSAoZXhjbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5ZXJFeGNsdWRlXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllckV4Y2x1ZGUgPSBleGNsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJLZXlzID0gKGRhdGEpIC0+XG4gICAgICBpZiBfcHJvcGVydHlcbiAgICAgICAgaWYgXy5pc0FycmF5KF9wcm9wZXJ0eSlcbiAgICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oX3Byb3BlcnR5LCBrZXlzKGRhdGEpKSAjIGVuc3VyZSBvbmx5IGtleXMgYWxzbyBpbiB0aGUgZGF0YSBhcmUgcmV0dXJuZWQgYW5kICQkaGFzaEtleSBpcyBub3QgcmV0dXJuZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBbX3Byb3BlcnR5XSAjYWx3YXlzIHJldHVybiBhbiBhcnJheSAhISFcbiAgICAgIGVsc2VcbiAgICAgICAgXy5yZWplY3Qoa2V5cyhkYXRhKSwgKGQpIC0+IGQgaW4gX2xheWVyRXhjbHVkZSlcblxuICAgIG1lLmxvd2VyUHJvcGVydHkgPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbG93ZXJQcm9wZXJ0eVxuICAgICAgZWxzZVxuICAgICAgICBfbG93ZXJQcm9wZXJ0eSA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS51cHBlclByb3BlcnR5ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3VwcGVyUHJvcGVydHlcbiAgICAgIGVsc2VcbiAgICAgICAgX3VwcGVyUHJvcGVydHkgPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBEYXRhIEZvcm1hdHRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRhdGFGb3JtYXQgPSAoZm9ybWF0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9pbnB1dEZvcm1hdFN0cmluZ1xuICAgICAgZWxzZVxuICAgICAgICBfaW5wdXRGb3JtYXRTdHJpbmcgPSBmb3JtYXRcbiAgICAgICAgaWYgX3NjYWxlVHlwZSBpcyAndGltZSdcbiAgICAgICAgICBfaW5wdXRGb3JtYXRGbiA9IGQzLnRpbWUuZm9ybWF0KGZvcm1hdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9pbnB1dEZvcm1hdEZuID0gKGQpIC0+IGRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIENvcmUgZGF0YSB0cmFuc2Zvcm1hdGlvbiBpbnRlcmZhY2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUudmFsdWUgPSAoZGF0YSkgLT5cbiAgICAgIGlmIF9sYXllclByb3BcbiAgICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3Byb3BlcnR5XVtfbGF5ZXJQcm9wXSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfcHJvcGVydHldW19sYXllclByb3BdKVxuICAgICAgZWxzZVxuICAgICAgICBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gcGFyc2VkVmFsdWUoZFtfcHJvcGVydHldKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW19wcm9wZXJ0eV0pXG5cbiAgICBtZS5sYXllclZhbHVlID0gKGRhdGEsIGxheWVyS2V5KSAtPlxuICAgICAgaWYgX2xheWVyUHJvcFxuICAgICAgICBwYXJzZWRWYWx1ZShkYXRhW2xheWVyS2V5XVtfbGF5ZXJQcm9wXSlcbiAgICAgIGVsc2VcbiAgICAgICAgcGFyc2VkVmFsdWUoZGF0YVtsYXllcktleV0pXG5cbiAgICBtZS5sb3dlclZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBpZiBfLmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gcGFyc2VkVmFsdWUoZFtfbG93ZXJQcm9wZXJ0eV0pKSBlbHNlIHBhcnNlZFZhbHVlKGRhdGFbX2xvd2VyUHJvcGVydHldKVxuXG4gICAgbWUudXBwZXJWYWx1ZSA9IChkYXRhKSAtPlxuICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3VwcGVyUHJvcGVydHldKSkgZWxzZSBwYXJzZWRWYWx1ZShkYXRhW191cHBlclByb3BlcnR5XSlcblxuICAgIG1lLmZvcm1hdHRlZFZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBtZS5mb3JtYXRWYWx1ZShtZS52YWx1ZShkYXRhKSlcblxuICAgIG1lLmZvcm1hdFZhbHVlID0gKHZhbCkgLT5cbiAgICAgIGlmIF9vdXRwdXRGb3JtYXRTdHJpbmcgYW5kIHZhbCBhbmQgICh2YWwuZ2V0VVRDRGF0ZSBvciBub3QgaXNOYU4odmFsKSlcbiAgICAgICAgX291dHB1dEZvcm1hdEZuKHZhbClcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsXG5cbiAgICBtZS5tYXAgPSAoZGF0YSkgLT5cbiAgICAgIGlmIEFycmF5LmlzQXJyYXkoZGF0YSkgdGhlbiBkYXRhLm1hcCgoZCkgLT4gX3NjYWxlKG1lLnZhbHVlKGRhdGEpKSkgZWxzZSBfc2NhbGUobWUudmFsdWUoZGF0YSkpXG5cbiAgICBtZS5pbnZlcnQgPSAobWFwcGVkVmFsdWUpIC0+XG4gICAgICAjIHRha2VzIGEgbWFwcGVkIHZhbHVlIChwaXhlbCBwb3NpdGlvbiAsIGNvbG9yIHZhbHVlLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluIHRoZSBpbnB1dCBkb21haW5cbiAgICAgICMgdGhlIHR5cGUgb2YgaW52ZXJzZSBpcyBkZXBlbmRlbnQgb24gdGhlIHNjYWxlIHR5cGUgZm9yIHF1YW50aXRhdGl2ZSBzY2FsZXMuXG4gICAgICAjIE9yZGluYWwgc2NhbGVzIC4uLlxuXG4gICAgICBpZiBfLmhhcyhtZS5zY2FsZSgpLCdpbnZlcnQnKSAjIGkuZS4gdGhlIGQzIHNjYWxlIHN1cHBvcnRzIHRoZSBpbnZlcnNlIGNhbGN1bGF0aW9uOiBsaW5lYXIsIGxvZywgcG93LCBzcXJ0XG4gICAgICAgIF9kYXRhID0gbWUuY2hhcnQoKS5nZXREYXRhKClcblxuICAgICAgICAjIGJpc2VjdC5sZWZ0IG5ldmVyIHJldHVybnMgMCBpbiB0aGlzIHNwZWNpZmljIHNjZW5hcmlvLiBXZSBuZWVkIHRvIG1vdmUgdGhlIHZhbCBieSBhbiBpbnRlcnZhbCB0byBoaXQgdGhlIG1pZGRsZSBvZiB0aGUgcmFuZ2UgYW5kIHRvIGVuc3VyZVxuICAgICAgICAjIHRoYXQgdGhlIGZpcnN0IGVsZW1lbnQgd2lsbCBiZSBjYXB0dXJlZC4gQWxzbyBlbnN1cmVzIGJldHRlciB2aXN1YWwgZXhwZXJpZW5jZSB3aXRoIHRvb2x0aXBzXG4gICAgICAgIGlmIG1lLmtpbmQoKSBpcyAncmFuZ2VYJyBvciBtZS5raW5kKCkgaXMgJ3JhbmdlWSdcbiAgICAgICAgICB2YWwgPSBtZS5zY2FsZSgpLmludmVydChtYXBwZWRWYWx1ZSlcbiAgICAgICAgICBpZiBtZS51cHBlclByb3BlcnR5KClcbiAgICAgICAgICAgIGJpc2VjdCA9IGQzLmJpc2VjdG9yKG1lLnVwcGVyVmFsdWUpLmxlZnRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGVwID0gbWUubG93ZXJWYWx1ZShfZGF0YVsxXSkgLSBtZS5sb3dlclZhbHVlKF9kYXRhWzBdKVxuICAgICAgICAgICAgYmlzZWN0ID0gZDMuYmlzZWN0b3IoKGQpIC0+IG1lLmxvd2VyVmFsdWUoZCkgKyBzdGVwKS5sZWZ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByYW5nZSA9IF9zY2FsZS5yYW5nZSgpXG4gICAgICAgICAgaW50ZXJ2YWwgPSAocmFuZ2VbMV0gLSByYW5nZVswXSkgLyBfZGF0YS5sZW5ndGhcbiAgICAgICAgICB2YWwgPSBtZS5zY2FsZSgpLmludmVydChtYXBwZWRWYWx1ZSAtIGludGVydmFsLzIpXG4gICAgICAgICAgYmlzZWN0ID0gZDMuYmlzZWN0b3IobWUudmFsdWUpLmxlZnRcblxuICAgICAgICBpZHggPSBiaXNlY3QoX2RhdGEsIHZhbClcbiAgICAgICAgaWR4ID0gaWYgaWR4IDwgMCB0aGVuIDAgZWxzZSBpZiBpZHggPj0gX2RhdGEubGVuZ3RoIHRoZW4gX2RhdGEubGVuZ3RoIC0gMSBlbHNlIGlkeFxuICAgICAgICByZXR1cm4gaWR4ICMgdGhlIGludmVyc2UgdmFsdWUgZG9lcyBub3QgbmVjZXNzYXJpbHkgY29ycmVzcG9uZCB0byBhIHZhbHVlIGluIHRoZSBkYXRhXG5cbiAgICAgIGlmIF8uaGFzKG1lLnNjYWxlKCksJ2ludmVydEV4dGVudCcpICMgZDMgc3VwcG9ydHMgdGhpcyBmb3IgcXVhbnRpemUsIHF1YW50aWxlLCB0aHJlc2hvbGQuIHJldHVybnMgdGhlIHJhbmdlIHRoYXQgZ2V0cyBtYXBwZWQgdG8gdGhlIHZhbHVlXG4gICAgICAgIHJldHVybiBtZS5zY2FsZSgpLmludmVydEV4dGVudChtYXBwZWRWYWx1ZSkgI1RPRE8gSG93IHNob3VsZCB0aGlzIGJlIG1hcHBlZCBjb3JyZWN0bHkuIFVzZSBjYXNlPz8/XG5cbiAgICAgICMgZDMgZG9lcyBub3Qgc3VwcG9ydCBpbnZlcnQgZm9yIG9yZGluYWwgc2NhbGVzLCB0aHVzIHRoaW5ncyBiZWNvbWUgYSBiaXQgbW9yZSB0cmlja3kuXG4gICAgICAjIGluIGNhc2Ugd2UgYXJlIHNldHRpbmcgdGhlIGRvbWFpbiBleHBsaWNpdGx5LCB3ZSBrbm93IHRoYSB0aGUgcmFuZ2UgdmFsdWVzIGFuZCB0aGUgZG9tYWluIGVsZW1lbnRzIGFyZSBpbiB0aGUgc2FtZSBvcmRlclxuICAgICAgIyBpbiBjYXNlIHRoZSBkb21haW4gaXMgc2V0ICdsYXp5JyAoaS5lLiBhcyB2YWx1ZXMgYXJlIHVzZWQpIHdlIGNhbm5vdCBtYXAgcmFuZ2UgYW5kIGRvbWFpbiB2YWx1ZXMgZWFzaWx5LiBOb3QgY2xlYXIgaG93IHRvIGRvIHRoaXMgZWZmZWN0aXZlbHlcblxuICAgICAgaWYgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBkb21haW4gPSBfc2NhbGUuZG9tYWluKClcbiAgICAgICAgcmFuZ2UgPSBfc2NhbGUucmFuZ2UoKVxuICAgICAgICBpZiBfaXNWZXJ0aWNhbFxuICAgICAgICAgIGludGVydmFsID0gcmFuZ2VbMF0gLSByYW5nZVsxXVxuICAgICAgICAgIGlkeCA9IHJhbmdlLmxlbmd0aCAtIE1hdGguZmxvb3IobWFwcGVkVmFsdWUgLyBpbnRlcnZhbCkgLSAxXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpbnRlcnZhbCA9IHJhbmdlWzFdIC0gcmFuZ2VbMF1cbiAgICAgICAgICBpZHggPSBNYXRoLmZsb29yKG1hcHBlZFZhbHVlIC8gaW50ZXJ2YWwpXG4gICAgICAgIHJldHVybiBpZHhcblxuICAgIG1lLmludmVydE9yZGluYWwgPSAobWFwcGVkVmFsdWUpIC0+XG4gICAgICBpZiBtZS5pc09yZGluYWwoKSBhbmQgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBpZHggPSBtZS5pbnZlcnQobWFwcGVkVmFsdWUpXG4gICAgICAgIHJldHVybiBfc2NhbGUuZG9tYWluKClbaWR4XVxuXG5cbiAgICAjLS0tIEF4aXMgQXR0cmlidXRlcyBhbmQgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2hvd0F4aXMgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93QXhpc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0F4aXMgPSB0cnVlRmFsc2VcbiAgICAgICAgaWYgdHJ1ZUZhbHNlXG4gICAgICAgICAgX2F4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYXhpcyA9IHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmF4aXNPcmllbnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9heGlzT3JpZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9heGlzT3JpZW50T2xkID0gX2F4aXNPcmllbnRcbiAgICAgICAgX2F4aXNPcmllbnQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXNPcmllbnRPbGQgPSAodmFsKSAtPiAgI1RPRE8gVGhpcyBpcyBub3QgdGhlIGJlc3QgcGxhY2UgdG8ga2VlcCB0aGUgb2xkIGF4aXMgdmFsdWUuIE9ubHkgbmVlZGVkIGJ5IGNvbnRhaW5lciBpbiBjYXNlIHRoZSBheGlzIHBvc2l0aW9uIGNoYW5nZXNcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXhpc09yaWVudE9sZFxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc09yaWVudE9sZCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXhpcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2F4aXNcblxuICAgIG1lLnRpY2tzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja3NcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tzID0gdmFsXG4gICAgICAgIGlmIG1lLmF4aXMoKVxuICAgICAgICAgIG1lLmF4aXMoKS50aWNrcyhfdGlja3MpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50aWNrRm9ybWF0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja0Zvcm1hdFxuICAgICAgZWxzZVxuICAgICAgICBfdGlja0Zvcm1hdCA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja0Zvcm1hdCh2YWwpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50aWNrVmFsdWVzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja1ZhbHVlc1xuICAgICAgZWxzZVxuICAgICAgICBfdGlja1ZhbHVlcyA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja1ZhbHVlcyh2YWwpXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc2hvd0xhYmVsID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0xhYmVsXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93TGFiZWwgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXNMYWJlbCA9ICh0ZXh0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBpZiBfYXhpc0xhYmVsIHRoZW4gX2F4aXNMYWJlbCBlbHNlIG1lLnByb3BlcnR5KClcbiAgICAgIGVsc2VcbiAgICAgICAgX2F4aXNMYWJlbCA9IHRleHRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5yb3RhdGVUaWNrTGFiZWxzID0gKG5icikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcm90YXRlVGlja0xhYmVsc1xuICAgICAgZWxzZVxuICAgICAgICBfcm90YXRlVGlja0xhYmVscyA9IG5iclxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmZvcm1hdCA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX291dHB1dEZvcm1hdFN0cmluZ1xuICAgICAgZWxzZVxuICAgICAgICBpZiB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSBpZiBtZS5zY2FsZVR5cGUoKSBpcyAndGltZScgdGhlbiBmb3JtYXREZWZhdWx0cy5kYXRlIGVsc2UgZm9ybWF0RGVmYXVsdHMubnVtYmVyXG4gICAgICAgIF9vdXRwdXRGb3JtYXRGbiA9IGlmIG1lLnNjYWxlVHlwZSgpIGlzICd0aW1lJyB0aGVuIGQzLnRpbWUuZm9ybWF0KF9vdXRwdXRGb3JtYXRTdHJpbmcpIGVsc2UgZDMuZm9ybWF0KF9vdXRwdXRGb3JtYXRTdHJpbmcpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5zaG93R3JpZCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dHcmlkXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93R3JpZCA9IHRydWVGYWxzZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLSBSZWdpc3RlciBmb3IgZHJhd2luZyBsaWZlY3ljbGUgZXZlbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5yZWdpc3RlciA9ICgpIC0+XG4gICAgICBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLm9uIFwic2NhbGVEb21haW5zLiN7bWUuaWQoKX1cIiwgKGRhdGEpIC0+XG4gICAgICAgICMgc2V0IHRoZSBkb21haW4gaWYgcmVxdWlyZWRcbiAgICAgICAgaWYgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICAgICMgZW5zdXJlIHJvYnVzdCBiZWhhdmlvciBpbiBjYXNlIG9mIHByb2JsZW1hdGljIGRlZmluaXRpb25zXG4gICAgICAgICAgZG9tYWluID0gbWUuZ2V0RG9tYWluKGRhdGEpXG4gICAgICAgICAgaWYgX3NjYWxlVHlwZSBpcyAnbGluZWFyJyBhbmQgXy5zb21lKGRvbWFpbiwgaXNOYU4pXG4gICAgICAgICAgICB0aHJvdyBcIlNjYWxlICN7bWUua2luZCgpfSwgVHlwZSAnI3tfc2NhbGVUeXBlfSc6IGNhbm5vdCBjb21wdXRlIGRvbWFpbiBmb3IgcHJvcGVydHkgJyN7X3Byb3BlcnR5fScgLiBQb3NzaWJsZSByZWFzb25zOiBwcm9wZXJ0eSBub3Qgc2V0LCBkYXRhIG5vdCBjb21wYXRpYmxlIHdpdGggZGVmaW5lZCB0eXBlLiBEb21haW46I3tkb21haW59XCJcblxuICAgICAgICAgIF9zY2FsZS5kb21haW4oZG9tYWluKVxuXG4gICAgICBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLm9uIFwicHJlcGFyZURhdGEuI3ttZS5pZCgpfVwiLCAoZGF0YSkgLT5cbiAgICAgICAgIyBjb21wdXRlIHRoZSBkb21haW4gcmFuZ2UgY2FsY3VsYXRpb24gaWYgcmVxdWlyZWRcbiAgICAgICAgY2FsY1J1bGUgPSAgbWUuZG9tYWluQ2FsYygpXG4gICAgICAgIGlmIG1lLnBhcmVudCgpLnNjYWxlUHJvcGVydGllc1xuICAgICAgICAgIG1lLmxheWVyRXhjbHVkZShtZS5wYXJlbnQoKS5zY2FsZVByb3BlcnRpZXMoKSlcbiAgICAgICAgaWYgY2FsY1J1bGUgYW5kIGNhbGNEb21haW5bY2FsY1J1bGVdXG4gICAgICAgICAgX2NhbGN1bGF0ZWREb21haW4gPSBjYWxjRG9tYWluW2NhbGNSdWxlXShkYXRhKVxuXG4gICAgbWUudXBkYXRlID0gKG5vQW5pbWF0aW9uKSAtPlxuICAgICAgbWUucGFyZW50KCkubGlmZUN5Y2xlKCkudXBkYXRlKG5vQW5pbWF0aW9uKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS51cGRhdGVBdHRycyA9ICgpIC0+XG4gICAgICBtZS5wYXJlbnQoKS5saWZlQ3ljbGUoKS51cGRhdGVBdHRycygpXG5cbiAgICBtZS5kcmF3QXhpcyA9ICgpIC0+XG4gICAgICBtZS5wYXJlbnQoKS5saWZlQ3ljbGUoKS5kcmF3QXhpcygpXG4gICAgICByZXR1cm4gbWVcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBzY2FsZSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ3NjYWxlTGlzdCcsICgkbG9nKSAtPlxuICByZXR1cm4gc2NhbGVMaXN0ID0gKCkgLT5cbiAgICBfbGlzdCA9IHt9XG4gICAgX2tpbmRMaXN0ID0ge31cbiAgICBfcGFyZW50TGlzdCA9IHt9XG4gICAgX293bmVyID0gdW5kZWZpbmVkXG4gICAgX3JlcXVpcmVkU2NhbGVzID0gW11cbiAgICBfbGF5ZXJTY2FsZSA9IHVuZGVmaW5lZFxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgbWUub3duZXIgPSAob3duZXIpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX293bmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9vd25lciA9IG93bmVyXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkID0gKHNjYWxlKSAtPlxuICAgICAgaWYgX2xpc3Rbc2NhbGUuaWQoKV1cbiAgICAgICAgJGxvZy5lcnJvciBcInNjYWxlTGlzdC5hZGQ6IHNjYWxlICN7c2NhbGUuaWQoKX0gYWxyZWFkeSBkZWZpbmVkIGluIHNjYWxlTGlzdCBvZiAje19vd25lci5pZCgpfS4gRHVwbGljYXRlIHNjYWxlcyBhcmUgbm90IGFsbG93ZWRcIlxuICAgICAgX2xpc3Rbc2NhbGUuaWQoKV0gPSBzY2FsZVxuICAgICAgX2tpbmRMaXN0W3NjYWxlLmtpbmQoKV0gPSBzY2FsZVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5oYXNTY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIHMgPSBtZS5nZXRLaW5kKHNjYWxlLmtpbmQoKSlcbiAgICAgIHJldHVybiBzLmlkKCkgaXMgc2NhbGUuaWQoKVxuXG4gICAgbWUuZ2V0S2luZCA9IChraW5kKSAtPlxuICAgICAgaWYgX2tpbmRMaXN0W2tpbmRdIHRoZW4gX2tpbmRMaXN0W2tpbmRdIGVsc2UgaWYgX3BhcmVudExpc3QuZ2V0S2luZCB0aGVuIF9wYXJlbnRMaXN0LmdldEtpbmQoa2luZCkgZWxzZSB1bmRlZmluZWRcblxuICAgIG1lLmhhc0tpbmQgPSAoa2luZCkgLT5cbiAgICAgIHJldHVybiAhIW1lLmdldEtpbmQoa2luZClcblxuICAgIG1lLnJlbW92ZSA9IChzY2FsZSkgLT5cbiAgICAgIGlmIG5vdCBfbGlzdFtzY2FsZS5pZCgpXVxuICAgICAgICAkbG9nLndhcm4gXCJzY2FsZUxpc3QuZGVsZXRlOiBzY2FsZSAje3NjYWxlLmlkKCl9IG5vdCBkZWZpbmVkIGluIHNjYWxlTGlzdCBvZiAje19vd25lci5pZCgpfS4gSWdub3JpbmdcIlxuICAgICAgICByZXR1cm4gbWVcbiAgICAgIGRlbGV0ZSBfbGlzdFtzY2FsZS5pZCgpXVxuICAgICAgZGVsZXRlIG1lW3NjYWxlLmlkXVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5wYXJlbnRTY2FsZXMgPSAoc2NhbGVMaXN0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wYXJlbnRMaXN0XG4gICAgICBlbHNlXG4gICAgICAgIF9wYXJlbnRMaXN0ID0gc2NhbGVMaXN0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZ2V0T3duZWQgPSAoKSAtPlxuICAgICAgX2xpc3RcblxuICAgIG1lLmFsbEtpbmRzID0gKCkgLT5cbiAgICAgIHJldCA9IHt9XG4gICAgICBpZiBfcGFyZW50TGlzdC5hbGxLaW5kc1xuICAgICAgICBmb3IgaywgcyBvZiBfcGFyZW50TGlzdC5hbGxLaW5kcygpXG4gICAgICAgICAgcmV0W2tdID0gc1xuICAgICAgZm9yIGsscyBvZiBfa2luZExpc3RcbiAgICAgICAgcmV0W2tdID0gc1xuICAgICAgcmV0dXJuIHJldFxuXG4gICAgbWUucmVxdWlyZWRTY2FsZXMgPSAocmVxKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9yZXF1aXJlZFNjYWxlc1xuICAgICAgZWxzZVxuICAgICAgICBfcmVxdWlyZWRTY2FsZXMgPSByZXFcbiAgICAgICAgZm9yIGsgaW4gcmVxXG4gICAgICAgICAgaWYgbm90IG1lLmhhc0tpbmQoaylcbiAgICAgICAgICAgIHRocm93IFwiRmF0YWwgRXJyb3I6IHNjYWxlICcje2t9JyByZXF1aXJlZCBidXQgbm90IGRlZmluZWRcIlxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5nZXRTY2FsZXMgPSAoa2luZExpc3QpIC0+XG4gICAgICBsID0ge31cbiAgICAgIGZvciBraW5kIGluIGtpbmRMaXN0XG4gICAgICAgIGlmIG1lLmhhc0tpbmQoa2luZClcbiAgICAgICAgICBsW2tpbmRdID0gbWUuZ2V0S2luZChraW5kKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgXCJGYXRhbCBFcnJvcjogc2NhbGUgJyN7a2luZH0nIHJlcXVpcmVkIGJ1dCBub3QgZGVmaW5lZFwiXG4gICAgICByZXR1cm4gbFxuXG4gICAgbWUuZ2V0U2NhbGVQcm9wZXJ0aWVzID0gKCkgLT5cbiAgICAgIGwgPSBbXVxuICAgICAgZm9yIGsscyBvZiBtZS5hbGxLaW5kcygpXG4gICAgICAgIHByb3AgPSBzLnByb3BlcnR5KClcbiAgICAgICAgaWYgcHJvcFxuICAgICAgICAgIGlmIEFycmF5LmlzQXJyYXkocHJvcClcbiAgICAgICAgICAgIGwuY29uY2F0KHByb3ApXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbC5wdXNoKHByb3ApXG4gICAgICByZXR1cm4gbFxuXG4gICAgbWUubGF5ZXJTY2FsZSA9IChraW5kKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG4gICAgICAgIGlmIF9sYXllclNjYWxlXG4gICAgICAgICAgcmV0dXJuIG1lLmdldEtpbmQoX2xheWVyU2NhbGUpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyU2NhbGUgPSBraW5kXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbG9yJywgKCRsb2csIHNjYWxlLCBsZWdlbmQsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ2NvbG9yJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlQ29sb3InXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuICAgICAgbCA9IHVuZGVmaW5lZFxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ2NvbG9yJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdjYXRlZ29yeTIwJylcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnNlcnZpY2UgJ3NjYWxlVXRpbHMnLCAoJGxvZywgd2tDaGFydFNjYWxlcywgdXRpbHMpIC0+XG5cbiAgcGFyc2VMaXN0ID0gKHZhbCkgLT5cbiAgICBpZiB2YWxcbiAgICAgIGwgPSB2YWwudHJpbSgpLnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJykuc3BsaXQoJywnKS5tYXAoKGQpIC0+IGQucmVwbGFjZSgvXltcXFwifCddfFtcXFwifCddJC9nLCAnJykpXG4gICAgICBsID0gbC5tYXAoKGQpIC0+IGlmIGlzTmFOKGQpIHRoZW4gZCBlbHNlICtkKVxuICAgICAgcmV0dXJuIGlmIGwubGVuZ3RoIGlzIDEgdGhlbiByZXR1cm4gbFswXSBlbHNlIGxcblxuICByZXR1cm4ge1xuXG4gICAgb2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXM6IChhdHRycywgbWUpIC0+XG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndHlwZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIGQzLnNjYWxlLmhhc093blByb3BlcnR5KHZhbCkgb3IgdmFsIGlzICd0aW1lJyBvciB3a0NoYXJ0U2NhbGVzLmhhc093blByb3BlcnR5KHZhbClcbiAgICAgICAgICAgIG1lLnNjYWxlVHlwZSh2YWwpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgdmFsIGlzbnQgJydcbiAgICAgICAgICAgICAgIyMgbm8gc2NhbGUgZGVmaW5lZCwgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgICAgJGxvZy5lcnJvciBcIkVycm9yOiBpbGxlZ2FsIHNjYWxlIHZhbHVlOiAje3ZhbH0uIFVzaW5nICdsaW5lYXInIHNjYWxlIGluc3RlYWRcIlxuICAgICAgICAgIG1lLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdleHBvbmVudCcsICh2YWwpIC0+XG4gICAgICAgIGlmIG1lLnNjYWxlVHlwZSgpIGlzICdwb3cnIGFuZCBfLmlzTnVtYmVyKCt2YWwpXG4gICAgICAgICAgbWUuZXhwb25lbnQoK3ZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3Byb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgbWUucHJvcGVydHkocGFyc2VMaXN0KHZhbCkpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsYXllclByb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIG1lLmxheWVyUHJvcGVydHkodmFsKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncmFuZ2UnLCAodmFsKSAtPlxuICAgICAgICByYW5nZSA9IHBhcnNlTGlzdCh2YWwpXG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkocmFuZ2UpXG4gICAgICAgICAgbWUucmFuZ2UocmFuZ2UpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkYXRlRm9ybWF0JywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnXG4gICAgICAgICAgICBtZS5kYXRhRm9ybWF0KHZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RvbWFpbicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgICRsb2cuaW5mbyAnZG9tYWluJywgdmFsXG4gICAgICAgICAgcGFyc2VkTGlzdCA9IHBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgQXJyYXkuaXNBcnJheShwYXJzZWRMaXN0KVxuICAgICAgICAgICAgbWUuZG9tYWluKHBhcnNlZExpc3QpLnVwZGF0ZSgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgJGxvZy5lcnJvciBcImRvbWFpbjogbXVzdCBiZSBhcnJheSwgb3IgY29tbWEtc2VwYXJhdGVkIGxpc3QsIGdvdFwiLCB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuZG9tYWluKHVuZGVmaW5lZCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RvbWFpblJhbmdlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgbWUuZG9tYWluQ2FsYyh2YWwpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmF4aXNMYWJlbCh2YWwpLnVwZGF0ZUF0dHJzKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2Zvcm1hdCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmZvcm1hdCh2YWwpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdyZXNldCcsICh2YWwpIC0+XG4gICAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHV0aWxzLnBhcnNlVHJ1ZUZhbHNlKHZhbCkpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lLCBzY29wZSkgLT5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3RpY2tGb3JtYXQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS50aWNrRm9ybWF0KGQzLmZvcm1hdCh2YWwpKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndGlja3MnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS50aWNrcygrdmFsKVxuICAgICAgICAgIGlmIG1lLmF4aXMoKVxuICAgICAgICAgICAgbWUudXBkYXRlQXR0cnMoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZ3JpZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnNob3dHcmlkKHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnKS51cGRhdGVBdHRycygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdzaG93TGFiZWwnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBtZS5zaG93TGFiZWwodmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScpLnVwZGF0ZSh0cnVlKVxuXG5cbiAgICAgIHNjb3BlLiR3YXRjaCBhdHRycy5heGlzRm9ybWF0dGVycywgICh2YWwpIC0+XG4gICAgICAgIGlmIF8uaXNPYmplY3QodmFsKVxuICAgICAgICAgIGlmIF8uaGFzKHZhbCwgJ3RpY2tGb3JtYXQnKSBhbmQgXy5pc0Z1bmN0aW9uKHZhbC50aWNrRm9ybWF0KVxuICAgICAgICAgICAgbWUudGlja0Zvcm1hdCh2YWwudGlja0Zvcm1hdClcbiAgICAgICAgICBlbHNlIGlmIF8uaXNTdHJpbmcodmFsLnRpY2tGb3JtYXQpXG4gICAgICAgICAgICBtZS50aWNrRm9ybWF0KGQzLmZvcm1hdCh2YWwpKVxuICAgICAgICAgIGlmIF8uaGFzKHZhbCwndGlja1ZhbHVlcycpIGFuZCBfLmlzQXJyYXkodmFsLnRpY2tWYWx1ZXMpXG4gICAgICAgICAgICBtZS50aWNrVmFsdWVzKHZhbC50aWNrVmFsdWVzKVxuICAgICAgICAgIG1lLnVwZGF0ZSgpXG5cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBvYnNlcnZlTGVnZW5kQXR0cmlidXRlczogKGF0dHJzLCBtZSwgbGF5b3V0KSAtPlxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbGVnZW5kJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbCA9IG1lLmxlZ2VuZCgpXG4gICAgICAgICAgbC5zaG93VmFsdWVzKGZhbHNlKVxuICAgICAgICAgIHN3aXRjaCB2YWxcbiAgICAgICAgICAgIHdoZW4gJ2ZhbHNlJ1xuICAgICAgICAgICAgICBsLnNob3coZmFsc2UpXG4gICAgICAgICAgICB3aGVuICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0J1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKHZhbCkuZGl2KHVuZGVmaW5lZCkuc2hvdyh0cnVlKVxuICAgICAgICAgICAgd2hlbiAndHJ1ZScsICcnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24oJ3RvcC1yaWdodCcpLnNob3codHJ1ZSkuZGl2KHVuZGVmaW5lZClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbGVnZW5kRGl2ID0gZDMuc2VsZWN0KHZhbClcbiAgICAgICAgICAgICAgaWYgbGVnZW5kRGl2LmVtcHR5KClcbiAgICAgICAgICAgICAgICAkbG9nLndhcm4gJ2xlZ2VuZCByZWZlcmVuY2UgZG9lcyBub3QgZXhpc3Q6JywgdmFsXG4gICAgICAgICAgICAgICAgbC5kaXYodW5kZWZpbmVkKS5zaG93KGZhbHNlKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbC5kaXYobGVnZW5kRGl2KS5wb3NpdGlvbigndG9wLWxlZnQnKS5zaG93KHRydWUpXG5cbiAgICAgICAgICBsLnNjYWxlKG1lKS5sYXlvdXQobGF5b3V0KVxuICAgICAgICAgIGlmIG1lLnBhcmVudCgpXG4gICAgICAgICAgICBsLnJlZ2lzdGVyKG1lLnBhcmVudCgpKVxuICAgICAgICAgIGwucmVkcmF3KClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3ZhbHVlc0xlZ2VuZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGwgPSBtZS5sZWdlbmQoKVxuICAgICAgICAgIGwuc2hvd1ZhbHVlcyh0cnVlKVxuICAgICAgICAgIHN3aXRjaCB2YWxcbiAgICAgICAgICAgIHdoZW4gJ2ZhbHNlJ1xuICAgICAgICAgICAgICBsLnNob3coZmFsc2UpXG4gICAgICAgICAgICB3aGVuICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0J1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKHZhbCkuZGl2KHVuZGVmaW5lZCkuc2hvdyh0cnVlKVxuICAgICAgICAgICAgd2hlbiAndHJ1ZScsICcnXG4gICAgICAgICAgICAgIGwucG9zaXRpb24oJ3RvcC1yaWdodCcpLnNob3codHJ1ZSkuZGl2KHVuZGVmaW5lZClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbGVnZW5kRGl2ID0gZDMuc2VsZWN0KHZhbClcbiAgICAgICAgICAgICAgaWYgbGVnZW5kRGl2LmVtcHR5KClcbiAgICAgICAgICAgICAgICAkbG9nLndhcm4gJ2xlZ2VuZCByZWZlcmVuY2UgZG9lcyBub3QgZXhpc3Q6JywgdmFsXG4gICAgICAgICAgICAgICAgbC5kaXYodW5kZWZpbmVkKS5zaG93KGZhbHNlKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbC5kaXYobGVnZW5kRGl2KS5wb3NpdGlvbigndG9wLWxlZnQnKS5zaG93KHRydWUpXG5cbiAgICAgICAgICBsLnNjYWxlKG1lKS5sYXlvdXQobGF5b3V0KVxuICAgICAgICAgIGlmIG1lLnBhcmVudCgpXG4gICAgICAgICAgICBsLnJlZ2lzdGVyKG1lLnBhcmVudCgpKVxuICAgICAgICAgIGwucmVkcmF3KClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xlZ2VuZFRpdGxlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUubGVnZW5kKCkudGl0bGUodmFsKS5yZWRyYXcoKVxuXG4gICAgIy0tLSBPYnNlcnZlIFJhbmdlIGF0dHJpYnV0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG9ic2VydmVyUmFuZ2VBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lKSAtPlxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xvd2VyUHJvcGVydHknLCAodmFsKSAtPlxuICAgICAgICBudWxsXG4gICAgICAgIG1lLmxvd2VyUHJvcGVydHkocGFyc2VMaXN0KHZhbCkpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd1cHBlclByb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgbnVsbFxuICAgICAgICBtZS51cHBlclByb3BlcnR5KHBhcnNlTGlzdCh2YWwpKS51cGRhdGUoKVxuXG4gIH1cblxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzaGFwZScsICgkbG9nLCBzY2FsZSwgZDNTaGFwZXMsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3NoYXBlJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlU2l6ZSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnc2hhcGUnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgbWUuc2NhbGUoKS5yYW5nZShkM1NoYXBlcylcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NpemUnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3NpemUnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVTaXplJ1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdzaXplJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcbiAgICAgIG1lLnJlZ2lzdGVyKClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3gnLCAoJGxvZywgc2NhbGUsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3gnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVgnXG4gICAgICB0aGlzLm1lID0gc2NhbGUoKSAjIGZvciBBbmd1bGFyIDEuM1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICd4J1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdsaW5lYXInKVxuICAgICAgbWUucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgIG1lLmlzSG9yaXpvbnRhbCh0cnVlKVxuICAgICAgbWUucmVnaXN0ZXIoKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ3RvcCcsICdib3R0b20nXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnYm90dG9tJykuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZS5zaG93QXhpcyhmYWxzZSkuYXhpc09yaWVudCh1bmRlZmluZWQpXG4gICAgICAgICAgbWUudXBkYXRlKHRydWUpXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgc2NvcGUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncm90YXRlVGlja0xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgXy5pc051bWJlcigrdmFsKVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHMoK3ZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHModW5kZWZpbmVkKVxuICAgICAgICBtZS51cGRhdGUodHJ1ZSlcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncmFuZ2VYJywgKCRsb2csIHNjYWxlLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydyYW5nZVgnLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVgnXG4gICAgICB0aGlzLm1lID0gc2NhbGUoKSAjIGZvciBBbmd1bGFyIDEuM1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBtZSA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzFdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1syXT8ubWVcblxuICAgICAgaWYgbm90IChjaGFydCBvciBsYXlvdXQpXG4gICAgICAgICRsb2cuZXJyb3IgJ3NjYWxlIG5lZWRzIHRvIGJlIGNvbnRhaW5lZCBpbiBhIGNoYXJ0IG9yIGxheW91dCBkaXJlY3RpdmUgJ1xuICAgICAgICByZXR1cm5cblxuICAgICAgbmFtZSA9ICdyYW5nZVgnXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2xpbmVhcicpXG4gICAgICBtZS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgbWUuaXNIb3Jpem9udGFsKHRydWUpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdheGlzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgdmFsIGlzbnQgJ2ZhbHNlJ1xuICAgICAgICAgICAgaWYgdmFsIGluIFsndG9wJywgJ2JvdHRvbSddXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQodmFsKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KCdib3R0b20nKS5zaG93QXhpcyh0cnVlKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1lLnNob3dBeGlzKGZhbHNlKS5heGlzT3JpZW50KHVuZGVmaW5lZClcbiAgICAgICAgICBtZS51cGRhdGUodHJ1ZSlcblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlQXhpc0F0dHJpYnV0ZXMoYXR0cnMsIG1lLCBzY29wZSlcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXMoYXR0cnMsIG1lLCBsYXlvdXQpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVyUmFuZ2VBdHRyaWJ1dGVzKGF0dHJzLG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncm90YXRlVGlja0xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgXy5pc051bWJlcigrdmFsKVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHMoK3ZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHModW5kZWZpbmVkKVxuICAgICAgICBtZS51cGRhdGUodHJ1ZSlcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAneScsICgkbG9nLCBzY2FsZSwgbGVnZW5kLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWyd5JywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAneSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLmlzVmVydGljYWwodHJ1ZSlcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnbGVmdCcpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUsIHNjb3BlKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncmFuZ2VZJywgKCRsb2csIHNjYWxlLCBsZWdlbmQsIHNjYWxlVXRpbHMpIC0+XG4gIHNjYWxlQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiBbJ3JhbmdlWScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVknXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3JhbmdlWSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLmlzVmVydGljYWwodHJ1ZSlcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnbGVmdCcpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUsIHNjb3BlKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZXJSYW5nZUF0dHJpYnV0ZXMoYXR0cnMsbWUpXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICdzZWxlY3Rpb25TaGFyaW5nJywgKCRsb2cpIC0+XG4gIHNlbGVjdGlvbiA9IHt9XG4gIGNhbGxiYWNrcyA9IHt9XG5cbiAgdGhpcy5jcmVhdGVHcm91cCA9IChncm91cCkgLT5cblxuXG4gIHRoaXMuc2V0U2VsZWN0aW9uID0gKHNlbGVjdGlvbiwgZ3JvdXApIC0+XG4gICAgaWYgZ3JvdXBcbiAgICAgIHNlbGVjdGlvbltncm91cF0gPSBzZWxlY3Rpb25cbiAgICAgIGlmIGNhbGxiYWNrc1tncm91cF1cbiAgICAgICAgZm9yIGNiIGluIGNhbGxiYWNrc1tncm91cF1cbiAgICAgICAgICBjYihzZWxlY3Rpb24pXG5cbiAgdGhpcy5nZXRTZWxlY3Rpb24gPSAoZ3JvdXApIC0+XG4gICAgZ3JwID0gZ3JvdXAgb3IgJ2RlZmF1bHQnXG4gICAgcmV0dXJuIHNlbGVjdGlvbltncnBdXG5cbiAgdGhpcy5yZWdpc3RlciA9IChncm91cCwgY2FsbGJhY2spIC0+XG4gICAgaWYgZ3JvdXBcbiAgICAgIGlmIG5vdCBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgIGNhbGxiYWNrc1tncm91cF0gPSBbXVxuICAgICAgI2Vuc3VyZSB0aGF0IGNhbGxiYWNrcyBhcmUgbm90IHJlZ2lzdGVyZWQgbW9yZSB0aGFuIG9uY2VcbiAgICAgIGlmIG5vdCBfLmNvbnRhaW5zKGNhbGxiYWNrc1tncm91cF0sIGNhbGxiYWNrKVxuICAgICAgICBjYWxsYmFja3NbZ3JvdXBdLnB1c2goY2FsbGJhY2spXG5cbiAgdGhpcy51bnJlZ2lzdGVyID0gKGdyb3VwLCBjYWxsYmFjaykgLT5cbiAgICBpZiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICBpZHggPSBjYWxsYmFja3NbZ3JvdXBdLmluZGV4T2YgY2FsbGJhY2tcbiAgICAgIGlmIGlkeCA+PSAwXG4gICAgICAgIGNhbGxiYWNrc1tncm91cF0uc3BsaWNlKGlkeCwgMSlcblxuICByZXR1cm4gdGhpc1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5zZXJ2aWNlICd0aW1pbmcnLCAoJGxvZykgLT5cblxuICB0aW1lcnMgPSB7fVxuICBlbGFwc2VkU3RhcnQgPSAwXG4gIGVsYXBzZWQgPSAwXG5cbiAgdGhpcy5pbml0ID0gKCkgLT5cbiAgICBlbGFwc2VkU3RhcnQgPSBEYXRlLm5vdygpXG5cbiAgdGhpcy5zdGFydCA9ICh0b3BpYykgLT5cbiAgICB0b3AgPSB0aW1lcnNbdG9waWNdXG4gICAgaWYgbm90IHRvcFxuICAgICAgdG9wID0gdGltZXJzW3RvcGljXSA9IHtuYW1lOnRvcGljLCBzdGFydDowLCB0b3RhbDowLCBjYWxsQ250OjAsIGFjdGl2ZTogZmFsc2V9XG4gICAgdG9wLnN0YXJ0ID0gRGF0ZS5ub3coKVxuICAgIHRvcC5hY3RpdmUgPSB0cnVlXG5cbiAgdGhpcy5zdG9wID0gKHRvcGljKSAtPlxuICAgIGlmIHRvcCA9IHRpbWVyc1t0b3BpY11cbiAgICAgIHRvcC5hY3RpdmUgPSBmYWxzZVxuICAgICAgdG9wLnRvdGFsICs9IERhdGUubm93KCkgLSB0b3Auc3RhcnRcbiAgICAgIHRvcC5jYWxsQ250ICs9IDFcbiAgICBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIGVsYXBzZWRTdGFydFxuXG4gIHRoaXMucmVwb3J0ID0gKCkgLT5cbiAgICBmb3IgdG9waWMsIHZhbCBvZiB0aW1lcnNcbiAgICAgIHZhbC5hdmcgPSB2YWwudG90YWwgLyB2YWwuY2FsbENudFxuICAgICRsb2cuaW5mbyB0aW1lcnNcbiAgICAkbG9nLmluZm8gJ0VsYXBzZWQgVGltZSAobXMpJywgZWxhcHNlZFxuICAgIHJldHVybiB0aW1lcnNcblxuICB0aGlzLmNsZWFyID0gKCkgLT5cbiAgICB0aW1lcnMgPSB7fVxuXG4gIHJldHVybiB0aGlzIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnbGF5ZXJlZERhdGEnLCAoJGxvZykgLT5cblxuICBsYXllcmVkID0gKCkgLT5cbiAgICBfZGF0YSA9IFtdXG4gICAgX2xheWVyS2V5cyA9IFtdXG4gICAgX3ggPSB1bmRlZmluZWRcbiAgICBfY2FsY1RvdGFsID0gZmFsc2VcbiAgICBfbWluID0gSW5maW5pdHlcbiAgICBfbWF4ID0gLUluZmluaXR5XG4gICAgX3RNaW4gPSBJbmZpbml0eVxuICAgIF90TWF4ID0gLUluZmluaXR5XG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBtZS5kYXRhID0gKGRhdCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggSXMgMFxuICAgICAgICByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSBkYXRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllcktleXMgPSAoa2V5cykgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX2xheWVyS2V5c1xuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJLZXlzID0ga2V5c1xuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnggPSAobmFtZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX3hcbiAgICAgIGVsc2VcbiAgICAgICAgX3ggPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuY2FsY1RvdGFsID0gKHRfZikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gX2NhbGNUb3RhbFxuICAgICAgZWxzZVxuICAgICAgICBfY2FsY1RvdGFsID0gdF9mXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubWluID0gKCkgLT5cbiAgICAgIF9taW5cblxuICAgIG1lLm1heCA9ICgpIC0+XG4gICAgICBfbWF4XG5cbiAgICBtZS5taW5Ub3RhbCA9ICgpIC0+XG4gICAgICBfdE1pblxuXG4gICAgbWUubWF4VG90YWwgPSAoKSAtPlxuICAgICAgX3RNYXhcblxuICAgIG1lLmV4dGVudCA9ICgpIC0+XG4gICAgICBbbWUubWluKCksIG1lLm1heCgpXVxuXG4gICAgbWUudG90YWxFeHRlbnQgPSAoKSAtPlxuICAgICAgW21lLm1pblRvdGFsKCksIG1lLm1heFRvdGFsKCldXG5cbiAgICBtZS5jb2x1bW5zID0gKGRhdGEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcbiAgICAgICAgI19sYXllcktleXMubWFwKChrKSAtPiB7a2V5OmssIHZhbHVlczpkYXRhLm1hcCgoZCkgLT4ge3g6IGRbX3hdLCB2YWx1ZTogZFtrXSwgZGF0YTogZH0gKX0pXG4gICAgICAgIHJlcyA9IFtdXG4gICAgICAgIF9taW4gPSBJbmZpbml0eVxuICAgICAgICBfbWF4ID0gLUluZmluaXR5XG4gICAgICAgIF90TWluID0gSW5maW5pdHlcbiAgICAgICAgX3RNYXggPSAtSW5maW5pdHlcblxuICAgICAgICBmb3IgaywgaSBpbiBfbGF5ZXJLZXlzXG4gICAgICAgICAgcmVzW2ldID0ge2tleTprLCB2YWx1ZTpbXSwgbWluOkluZmluaXR5LCBtYXg6LUluZmluaXR5fVxuICAgICAgICBmb3IgZCwgaSBpbiBkYXRhXG4gICAgICAgICAgdCA9IDBcbiAgICAgICAgICB4diA9IGlmIHR5cGVvZiBfeCBpcyAnc3RyaW5nJyB0aGVuIGRbX3hdIGVsc2UgX3goZClcblxuICAgICAgICAgIGZvciBsIGluIHJlc1xuICAgICAgICAgICAgdiA9ICtkW2wua2V5XVxuICAgICAgICAgICAgbC52YWx1ZS5wdXNoIHt4Onh2LCB2YWx1ZTogdiwga2V5Omwua2V5fVxuICAgICAgICAgICAgaWYgbC5tYXggPCB2IHRoZW4gbC5tYXggPSB2XG4gICAgICAgICAgICBpZiBsLm1pbiA+IHYgdGhlbiBsLm1pbiA9IHZcbiAgICAgICAgICAgIGlmIF9tYXggPCB2IHRoZW4gX21heCA9IHZcbiAgICAgICAgICAgIGlmIF9taW4gPiB2IHRoZW4gX21pbiA9IHZcbiAgICAgICAgICAgIGlmIF9jYWxjVG90YWwgdGhlbiB0ICs9ICt2XG4gICAgICAgICAgaWYgX2NhbGNUb3RhbFxuICAgICAgICAgICAgI3RvdGFsLnZhbHVlLnB1c2gge3g6ZFtfeF0sIHZhbHVlOnQsIGtleTp0b3RhbC5rZXl9XG4gICAgICAgICAgICBpZiBfdE1heCA8IHQgdGhlbiBfdE1heCA9IHRcbiAgICAgICAgICAgIGlmIF90TWluID4gdCB0aGVuIF90TWluID0gdFxuICAgICAgICByZXR1cm4ge21pbjpfbWluLCBtYXg6X21heCwgdG90YWxNaW46X3RNaW4sdG90YWxNYXg6X3RNYXgsIGRhdGE6cmVzfVxuICAgICAgcmV0dXJuIG1lXG5cblxuXG4gICAgbWUucm93cyA9IChkYXRhKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxXG4gICAgICAgIHJldHVybiBkYXRhLm1hcCgoZCkgLT4ge3g6IGRbX3hdLCBsYXllcnM6IGxheWVyS2V5cy5tYXAoKGspIC0+IHtrZXk6aywgdmFsdWU6IGRba10sIHg6ZFtfeF19KX0pXG4gICAgICByZXR1cm4gbWVcblxuXG4gICAgcmV0dXJuIG1lIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzdmdJY29uJywgKCRsb2cpIC0+XG4gICMjIGluc2VydCBzdmcgcGF0aCBpbnRvIGludGVycG9sYXRlZCBIVE1MLiBSZXF1aXJlZCBwcmV2ZW50IEFuZ3VsYXIgZnJvbSB0aHJvd2luZyBlcnJvciAoRml4IDIyKVxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICB0ZW1wbGF0ZTogJzxzdmcgbmctc3R5bGU9XCJzdHlsZVwiPjxwYXRoPjwvcGF0aD48L3N2Zz4nXG4gICAgc2NvcGU6XG4gICAgICBwYXRoOiBcIj1cIlxuICAgICAgd2lkdGg6IFwiQFwiXG4gICAgbGluazogKHNjb3BlLCBlbGVtLCBhdHRycyApIC0+XG4gICAgICBzY29wZS5zdHlsZSA9IHsgICMgZml4IElFIHByb2JsZW0gd2l0aCBpbnRlcnBvbGF0aW5nIHN0eWxlIHZhbHVlc1xuICAgICAgICBoZWlnaHQ6ICcyMHB4J1xuICAgICAgICB3aWR0aDogc2NvcGUud2lkdGggKyAncHgnXG4gICAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICdtaWRkbGUnXG4gICAgICB9XG4gICAgICBzY29wZS4kd2F0Y2ggJ3BhdGgnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWxcbiAgICAgICAgICBkMy5zZWxlY3QoZWxlbVswXSkuc2VsZWN0KCdwYXRoJykuYXR0cignZCcsIHZhbCkuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoOCw4KVwiKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAndXRpbHMnLCAoJGxvZykgLT5cblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgQGRpZmYgPSAoYSxiLGRpcmVjdGlvbikgLT5cbiAgICBub3RJbkIgPSAodikgLT5cbiAgICAgIGIuaW5kZXhPZih2KSA8IDBcblxuICAgIHJlcyA9IHt9XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgYS5sZW5ndGhcbiAgICAgIGlmIG5vdEluQihhW2ldKVxuICAgICAgICByZXNbYVtpXV0gPSB1bmRlZmluZWRcbiAgICAgICAgaiA9IGkgKyBkaXJlY3Rpb25cbiAgICAgICAgd2hpbGUgMCA8PSBqIDwgYS5sZW5ndGhcbiAgICAgICAgICBpZiBub3RJbkIoYVtqXSlcbiAgICAgICAgICAgIGogKz0gZGlyZWN0aW9uXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzW2FbaV1dID0gIGFbal1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICBpKytcbiAgICByZXR1cm4gcmVzXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGlkID0gMFxuICBAZ2V0SWQgPSAoKSAtPlxuICAgIHJldHVybiAnQ2hhcnQnICsgaWQrK1xuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAcGFyc2VMaXN0ID0gKHZhbCkgLT5cbiAgICBpZiB2YWxcbiAgICAgIGwgPSB2YWwudHJpbSgpLnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJykuc3BsaXQoJywnKS5tYXAoKGQpIC0+IGQucmVwbGFjZSgvXltcXFwifCddfFtcXFwifCddJC9nLCAnJykpXG4gICAgICByZXR1cm4gaWYgbC5sZW5ndGggaXMgMSB0aGVuIHJldHVybiBsWzBdIGVsc2UgbFxuICAgIHJldHVybiB1bmRlZmluZWRcblxuICBAcGFyc2VUcnVlRmFsc2UgPSAodmFsKSAtPlxuICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnIHRoZW4gdHJ1ZSBlbHNlIChpZiB2YWwgaXMgJ2ZhbHNlJyB0aGVuIGZhbHNlIGVsc2UgdW5kZWZpbmVkKVxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBAbWVyZ2VEYXRhID0gKCkgLT5cblxuICAgIF9wcmV2RGF0YSA9IFtdXG4gICAgX2RhdGEgPSBbXVxuICAgIF9wcmV2SGFzaCA9IHt9XG4gICAgX2hhc2ggPSB7fVxuICAgIF9wcmV2Q29tbW9uID0gW11cbiAgICBfY29tbW9uID0gW11cbiAgICBfZmlyc3QgPSB1bmRlZmluZWRcbiAgICBfbGFzdCA9IHVuZGVmaW5lZFxuXG4gICAgX2tleSA9IChkKSAtPiBkICMgaWRlbnRpdHlcbiAgICBfbGF5ZXJLZXkgPSAoZCkgLT4gZFxuXG5cbiAgICBtZSA9IChkYXRhKSAtPlxuICAgICAgIyBzYXZlIF9kYXRhIHRvIF9wcmV2aW91c0RhdGEgYW5kIHVwZGF0ZSBfcHJldmlvdXNIYXNoO1xuICAgICAgX3ByZXZEYXRhID0gW11cbiAgICAgIF9wcmV2SGFzaCA9IHt9XG4gICAgICBmb3IgZCxpICBpbiBfZGF0YVxuICAgICAgICBfcHJldkRhdGFbaV0gPSBkO1xuICAgICAgICBfcHJldkhhc2hbX2tleShkKV0gPSBpXG5cbiAgICAgICNpdGVyYXRlIG92ZXIgZGF0YSBhbmQgZGV0ZXJtaW5lIHRoZSBjb21tb24gZWxlbWVudHNcbiAgICAgIF9wcmV2Q29tbW9uID0gW107XG4gICAgICBfY29tbW9uID0gW107XG4gICAgICBfaGFzaCA9IHt9O1xuICAgICAgX2RhdGEgPSBkYXRhO1xuXG4gICAgICBmb3IgZCxqIGluIF9kYXRhXG4gICAgICAgIGtleSA9IF9rZXkoZClcbiAgICAgICAgX2hhc2hba2V5XSA9IGpcbiAgICAgICAgaWYgX3ByZXZIYXNoLmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgICAjZWxlbWVudCBpcyBpbiBib3RoIGFycmF5c1xuICAgICAgICAgIF9wcmV2Q29tbW9uW19wcmV2SGFzaFtrZXldXSA9IHRydWVcbiAgICAgICAgICBfY29tbW9uW2pdID0gdHJ1ZVxuICAgICAgcmV0dXJuIG1lO1xuXG4gICAgbWUua2V5ID0gKGZuKSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBfa2V5XG4gICAgICBfa2V5ID0gZm47XG4gICAgICByZXR1cm4gbWU7XG5cbiAgICBtZS5maXJzdCA9IChmaXJzdCkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2ZpcnN0XG4gICAgICBfZmlyc3QgPSBmaXJzdFxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXN0ID0gKGxhc3QpIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9sYXN0XG4gICAgICBfbGFzdCA9IGxhc3RcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuYWRkZWQgPSAoKSAtPlxuICAgICAgcmV0ID0gW107XG4gICAgICBmb3IgZCwgaSBpbiBfZGF0YVxuICAgICAgICBpZiAhX2NvbW1vbltpXSB0aGVuIHJldC5wdXNoKF9kKVxuICAgICAgcmV0dXJuIHJldFxuXG4gICAgbWUuZGVsZXRlZCA9ICgpIC0+XG4gICAgICByZXQgPSBbXTtcbiAgICAgIGZvciBwLCBpIGluIF9wcmV2RGF0YVxuICAgICAgICBpZiAhX3ByZXZDb21tb25baV0gdGhlbiByZXQucHVzaChfcHJldkRhdGFbaV0pXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5jdXJyZW50ID0gKGtleSkgLT5cbiAgICAgIHJldHVybiBfZGF0YVtfaGFzaFtrZXldXVxuXG4gICAgbWUucHJldiA9IChrZXkpIC0+XG4gICAgICByZXR1cm4gX3ByZXZEYXRhW19wcmV2SGFzaFtrZXldXVxuXG4gICAgbWUuYWRkZWRQcmVkID0gKGFkZGVkKSAtPlxuICAgICAgcHJlZElkeCA9IF9oYXNoW19rZXkoYWRkZWQpXVxuICAgICAgd2hpbGUgIV9jb21tb25bcHJlZElkeF1cbiAgICAgICAgaWYgcHJlZElkeC0tIDwgMCB0aGVuIHJldHVybiBfZmlyc3RcbiAgICAgIHJldHVybiBfcHJldkRhdGFbX3ByZXZIYXNoW19rZXkoX2RhdGFbcHJlZElkeF0pXV1cblxuICAgIG1lLmFkZGVkUHJlZC5sZWZ0ID0gKGFkZGVkKSAtPlxuICAgICAgbWUuYWRkZWRQcmVkKGFkZGVkKS54XG5cbiAgICBtZS5hZGRlZFByZWQucmlnaHQgPSAoYWRkZWQpIC0+XG4gICAgICBvYmogPSBtZS5hZGRlZFByZWQoYWRkZWQpXG4gICAgICBpZiBfLmhhcyhvYmosICd3aWR0aCcpIHRoZW4gb2JqLnggKyBvYmoud2lkdGggZWxzZSBvYmoueFxuXG4gICAgbWUuZGVsZXRlZFN1Y2MgPSAoZGVsZXRlZCkgLT5cbiAgICAgIHN1Y2NJZHggPSBfcHJldkhhc2hbX2tleShkZWxldGVkKV1cbiAgICAgIHdoaWxlICFfcHJldkNvbW1vbltzdWNjSWR4XVxuICAgICAgICBpZiBzdWNjSWR4KysgPj0gX3ByZXZEYXRhLmxlbmd0aCB0aGVuIHJldHVybiBfbGFzdFxuICAgICAgcmV0dXJuIF9kYXRhW19oYXNoW19rZXkoX3ByZXZEYXRhW3N1Y2NJZHhdKV1dXG5cbiAgICByZXR1cm4gbWU7XG5cbiAgQG1lcmdlU2VyaWVzID0gIChhT2xkLCBhTmV3KSAgLT5cbiAgICBpT2xkID0gMFxuICAgIGlOZXcgPSAwXG4gICAgbE9sZE1heCA9IGFPbGQubGVuZ3RoIC0gMVxuICAgIGxOZXdNYXggPSBhTmV3Lmxlbmd0aCAtIDFcbiAgICBsTWF4ID0gTWF0aC5tYXgobE9sZE1heCwgbE5ld01heClcbiAgICByZXN1bHQgPSBbXVxuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4IGFuZCBpTmV3IDw9IGxOZXdNYXhcbiAgICAgIGlmICthT2xkW2lPbGRdIGlzICthTmV3W2lOZXddXG4gICAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFPbGRbaU9sZF1dKTtcbiAgICAgICAgI2NvbnNvbGUubG9nKCdzYW1lJywgYU9sZFtpT2xkXSk7XG4gICAgICAgIGlPbGQrKztcbiAgICAgICAgaU5ldysrO1xuICAgICAgZWxzZSBpZiArYU9sZFtpT2xkXSA8ICthTmV3W2lOZXddXG4gICAgICAgICMgYU9sZFtpT2xkIGlzIGRlbGV0ZWRcbiAgICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSlcbiAgICAgICAgIyBjb25zb2xlLmxvZygnZGVsZXRlZCcsIGFPbGRbaU9sZF0pO1xuICAgICAgICBpT2xkKytcbiAgICAgIGVsc2VcbiAgICAgICAgIyBhTmV3W2lOZXddIGlzIGFkZGVkXG4gICAgICAgIHJlc3VsdC5wdXNoKFt1bmRlZmluZWQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU5ld1tpTmV3XV0pXG4gICAgICAgICMgY29uc29sZS5sb2coJ2FkZGVkJywgYU5ld1tpTmV3XSk7XG4gICAgICAgIGlOZXcrK1xuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4XG4gICAgICAjIGlmIHRoZXJlIGlzIG1vcmUgb2xkIGl0ZW1zLCBtYXJrIHRoZW0gYXMgZGVsZXRlZFxuICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdkZWxldGVkJywgYU9sZFtpT2xkXSk7XG4gICAgICBpT2xkKys7XG5cbiAgICB3aGlsZSBpTmV3IDw9IGxOZXdNYXhcbiAgICAgICMgaWYgdGhlcmUgaXMgbW9yZSBuZXcgaXRlbXMsIG1hcmsgdGhlbSBhcyBhZGRlZFxuICAgICAgcmVzdWx0LnB1c2goW3VuZGVmaW5lZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhTmV3W2lOZXddXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdhZGRlZCcsIGFOZXdbaU5ld10pO1xuICAgICAgaU5ldysrO1xuXG4gICAgcmV0dXJuIHJlc3VsdFxuXG4gIHJldHVybiBAXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=