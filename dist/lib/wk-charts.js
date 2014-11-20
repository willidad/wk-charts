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
      config = barConfig;
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
          polyline = pieBox.selectAll("wk-chart-polyline").data(segments, key);
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
          if (k === 'x') {
            s.range([0, _innerWidth]);
          } else if (k === 'y') {
            s.range([_innerHeight, 0]);
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
    var buildArgs, getDrawArea, me, _chart, _container, _data, _id, _layoutLifeCycle, _scaleList;
    _id = "layout" + (layoutCntr++);
    _container = void 0;
    _data = void 0;
    _chart = void 0;
    _scaleList = scaleList();
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
    me.behavior = function() {
      return me.chart().behavior();
    };
    me.prepareData = function(data) {
      var args, kind, _i, _len, _ref;
      args = [];
      _ref = ['x', 'y', 'color'];
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
      _ref = ['x', 'y', 'color', 'size', 'shape'];
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

angular.module('wk.chart').factory('scale', function($log, legend, formatDefaults) {
  var scale;
  scale = function() {
    var calcDomain, keys, layerMax, layerMin, layerTotal, me, parsedValue, _axis, _axisLabel, _axisOrient, _axisOrientOld, _calculatedDomain, _chart, _domain, _domainCalc, _exponent, _id, _inputFormatFn, _inputFormatString, _isHorizontal, _isOrdinal, _isVertical, _kind, _layerExclude, _layerProp, _layout, _legend, _outputFormatFn, _outputFormatString, _parent, _property, _range, _rangeOuterPadding, _rangePadding, _resetOnNewData, _rotateTickLabels, _scale, _scaleType, _showAxis, _showGrid, _showLabel, _tickFormat, _ticks;
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
        if (rule === 'min' || rule === 'max' || rule === 'extent' || rule === 'total' || rule === 'totalExtent') {
          _domainCalc = rule;
        } else {
          $log.error('illegal domain calculation rule:', rule, " expected 'min', 'max', 'extent', 'total' or 'totalExtent'");
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

angular.module('wk.chart').service('scaleUtils', function($log) {
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
          if (d3.scale.hasOwnProperty(val) || val === 'time') {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3drLWNoYXJ0cy9hcHAvY29uZmlnL3drQ2hhcnRDb25zdGFudHMuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC91dGlsL1Jlc2l6ZVNlbnNvci5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoLmNvZmZlZSIsInRlbXBsYXRlcy5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9kMy5nZW8uem9vbS5qcyIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL2JydXNoZWQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9jb250YWluZXIvY2hhcnQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9jb250YWluZXIvbGF5b3V0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvY29udGFpbmVyL3NlbGVjdGlvbi5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2ZpbHRlcnMvdHRGb3JtYXQuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWEuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2FyZWFTdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhU3RhY2tlZFZlcnRpY2FsLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9hcmVhVmVydGljYWwuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2Jhci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvYmFyQ2x1c3RlcmVkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9iYXJTdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9idWJibGUuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL2NvbHVtbi5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvY29sdW1uQ2x1c3RlcmVkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9jb2x1bW5TdGFja2VkLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9nYXVnZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvZ2VvTWFwLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9saW5lLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbGF5b3V0cy9saW5lVmVydGljYWwuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9sYXlvdXRzL3BpZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvc2NhdHRlci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL2xheW91dHMvc3BpZGVyLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9yQnJ1c2guY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JTZWxlY3QuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvYmVoYXZpb3JUb29sdGlwLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2JlaGF2aW9ycy5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9jaGFydC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9jb250YWluZXIuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9tb2RlbHMvbGF5b3V0LmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvbW9kZWxzL2xlZ2VuZC5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9zY2FsZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL21vZGVscy9zY2FsZUxpc3QuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvY29sb3IuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMvc2NhbGVVdGlscy5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy9zaGFwZS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NjYWxlcy9zaXplLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvc2NhbGVzL3guY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zY2FsZXMveS5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3NlcnZpY2VzL3NlbGVjdGlvblNoYXJpbmcuY29mZmVlIiwiLi4vd2stY2hhcnRzL2FwcC9zZXJ2aWNlcy90aW1lci5jb2ZmZWUiLCIuLi93ay1jaGFydHMvYXBwL3V0aWwvbGF5ZXJEYXRhLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC9zdmdJY29uLmNvZmZlZSIsIi4uL3drLWNoYXJ0cy9hcHAvdXRpbC91dGlsaXRpZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsVUFBZixFQUEyQixFQUEzQixDQUFBLENBQUE7O0FBQUEsT0FFTyxDQUFDLE1BQVIsQ0FBZSxVQUFmLENBQTBCLENBQUMsUUFBM0IsQ0FBb0MsaUJBQXBDLEVBQXVELENBQ3JELFNBRHFELEVBRXJELFlBRnFELEVBR3JELFlBSHFELEVBSXJELGFBSnFELEVBS3JELGFBTHFELENBQXZELENBRkEsQ0FBQTs7QUFBQSxPQVVPLENBQUMsTUFBUixDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxRQUEzQixDQUFvQyxnQkFBcEMsRUFBc0Q7QUFBQSxFQUNwRCxHQUFBLEVBQUssRUFEK0M7QUFBQSxFQUVwRCxJQUFBLEVBQU0sRUFGOEM7QUFBQSxFQUdwRCxNQUFBLEVBQVEsRUFINEM7QUFBQSxFQUlwRCxLQUFBLEVBQU8sRUFKNkM7QUFBQSxFQUtwRCxlQUFBLEVBQWdCO0FBQUEsSUFBQyxJQUFBLEVBQUssRUFBTjtBQUFBLElBQVUsS0FBQSxFQUFNLEVBQWhCO0dBTG9DO0FBQUEsRUFNcEQsZUFBQSxFQUFnQjtBQUFBLElBQUMsSUFBQSxFQUFLLEVBQU47QUFBQSxJQUFVLEtBQUEsRUFBTSxFQUFoQjtHQU5vQztBQUFBLEVBT3BELFNBQUEsRUFBVSxDQVAwQztBQUFBLEVBUXBELFNBQUEsRUFDRTtBQUFBLElBQUEsR0FB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QTs7QUNBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0hBLE9BQU8sQ0FBQyxNQUFSLENBQWUsVUFBZixDQUEwQixDQUFDLFNBQTNCLENBQXFDLFNBQXJDLEVBQWdELFNBQUMsSUFBRCxFQUFNLGdCQUFOLEVBQXdCLE1BQXhCLEdBQUE7QUFDOUMsTUFBQSxTQUFBO0FBQUEsRUFBQSxTQUFBLEdBQVksQ0FBWixDQUFBO0FBQ0EsU0FBTztBQUFBLElBQ0wsUUFBQSxFQUFVLEdBREw7QUFBQSxJQUVMLE9BQUEsRUFBUyxDQUFDLFFBQUQsRUFBVyxVQUFYLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLENBRko7QUFB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QXhDLENBQVosQ0FBQSxDQUFBO0FBQUEsUUFFQSxJQUFBLEVBRkEsQ0FQRztPQU5QO0lBQUEsQ0FQQTtBQXdCQSxXQUFNLElBQUEsSUFBUSxPQUFkLEdBQUE7QUFFRSxNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBQyxJQUFELEVBQU0sTUFBTixFQUFpQixJQUFLLENBQUEsSUFBQSxDQUF0QixDQUFaLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQSxFQUZBLENBRkY7SUFBQSxDQXhCQTtBQThCQSxXQUFNLElBQUEsSUFBUSxPQUFkLEdBQUE7QUFFRSxNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBQyxNQUFELEVBQVksSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFULEVBQWMsT0FBZCxDQUFaLEVBQW1DLElBQUssQ0FBQSxJQUFBLENBQXhDLENBQVosQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFBLEVBRkEsQ0FGRjtJQUFBLENBOUJBO0FBb0NBLFdBQU8sTUFBUCxDQXJDYztFQUFBLENBeEhoQixDQUFBO0FBK0pBLFNBQU8sSUFBUCxDQW5LMEM7QUFBQSxDQUE1QyxDQUFBLENBQUEiLCJmaWxlIjoid2stY2hhcnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JywgW10pXG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM09yZGluYWxTY2FsZXMnLCBbXG4gICdvcmRpbmFsJ1xuICAnY2F0ZWdvcnkxMCdcbiAgJ2NhdGVnb3J5MjAnXG4gICdjYXRlZ29yeTIwYidcbiAgJ2NhdGVnb3J5MjBjJ1xuXVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNDaGFydE1hcmdpbnMnLCB7XG4gIHRvcDogMTBcbiAgbGVmdDogNTBcbiAgYm90dG9tOiA0MFxuICByaWdodDogMjBcbiAgdG9wQm90dG9tTWFyZ2luOntheGlzOjI1LCBsYWJlbDoxOH1cbiAgbGVmdFJpZ2h0TWFyZ2luOntheGlzOjQwLCBsYWJlbDoyMH1cbiAgbWluTWFyZ2luOjhcbiAgZGVmYXVsdDpcbiAgICB0b3A6IDhcbiAgICBsZWZ0OjhcbiAgICBib3R0b206OFxuICAgIHJpZ2h0OjEwXG4gIGF4aXM6XG4gICAgdG9wOjI1XG4gICAgYm90dG9tOjI1XG4gICAgbGVmdDo0MFxuICAgIHJpZ2h0OjQwXG4gIGxhYmVsOlxuICAgIHRvcDoxOFxuICAgIGJvdHRvbToxOFxuICAgIGxlZnQ6MjBcbiAgICByaWdodDoyMFxufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZDNTaGFwZXMnLCBbXG4gICdjaXJjbGUnLFxuICAnY3Jvc3MnLFxuICAndHJpYW5nbGUtZG93bicsXG4gICd0cmlhbmdsZS11cCcsXG4gICdzcXVhcmUnLFxuICAnZGlhbW9uZCdcbl1cblxuYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuY29uc3RhbnQgJ2F4aXNDb25maWcnLCB7XG4gIGxhYmVsRm9udFNpemU6ICcxLjZlbSdcbiAgeDpcbiAgICBheGlzUG9zaXRpb25zOiBbJ3RvcCcsICdib3R0b20nXVxuICAgIGF4aXNPZmZzZXQ6IHtib3R0b206J2hlaWdodCd9XG4gICAgYXhpc1Bvc2l0aW9uRGVmYXVsdDogJ2JvdHRvbSdcbiAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJ1xuICAgIG1lYXN1cmU6ICd3aWR0aCdcbiAgICBsYWJlbFBvc2l0aW9uczpbJ291dHNpZGUnLCAnaW5zaWRlJ11cbiAgICBsYWJlbFBvc2l0aW9uRGVmYXVsdDogJ291dHNpZGUnXG4gICAgbGFiZWxPZmZzZXQ6XG4gICAgICB0b3A6ICcxZW0nXG4gICAgICBib3R0b206ICctMC44ZW0nXG4gIHk6XG4gICAgYXhpc1Bvc2l0aW9uczogWydsZWZ0JywgJ3JpZ2h0J11cbiAgICBheGlzT2Zmc2V0OiB7cmlnaHQ6J3dpZHRoJ31cbiAgICBheGlzUG9zaXRpb25EZWZhdWx0OiAnbGVmdCdcbiAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCdcbiAgICBtZWFzdXJlOiAnaGVpZ2h0J1xuICAgIGxhYmVsUG9zaXRpb25zOlsnb3V0c2lkZScsICdpbnNpZGUnXVxuICAgIGxhYmVsUG9zaXRpb25EZWZhdWx0OiAnb3V0c2lkZSdcbiAgICBsYWJlbE9mZnNldDpcbiAgICAgIGxlZnQ6ICcxLjJlbSdcbiAgICAgIHJpZ2h0OiAnMS4yZW0nXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICdkM0FuaW1hdGlvbicsIHtcbiAgZHVyYXRpb246NTAwXG59XG5cbmFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmNvbnN0YW50ICd0ZW1wbGF0ZURpcicsICd0ZW1wbGF0ZXMvJ1xuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnZm9ybWF0RGVmYXVsdHMnLCB7XG4gIGRhdGU6ICclZC4lbS4lWSdcbiAgbnVtYmVyIDogICcsLjJmJ1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5jb25zdGFudCAnYmFyQ29uZmlnJywge1xuICBwYWRkaW5nOiAwLjFcbiAgb3V0ZXJQYWRkaW5nOiAwXG59XG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IE1hcmMgSi4gU2NobWlkdC4gU2VlIHRoZSBMSUNFTlNFIGZpbGUgYXQgdGhlIHRvcC1sZXZlbFxuICogZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uIGFuZCBhdFxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmNqL2Nzcy1lbGVtZW50LXF1ZXJpZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5cbiAqL1xuO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBkaW1lbnNpb24gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W118RWxlbWVudHN8alF1ZXJ5fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHRoaXMuUmVzaXplU2Vuc29yID0gZnVuY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gRXZlbnRRdWV1ZSgpIHtcbiAgICAgICAgICAgIHRoaXMucSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHRoaXMucS5wdXNoKGV2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSB0aGlzLnEubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucVtpXS5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNpemVkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCByZXNpemVkKSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQgPSBuZXcgRXZlbnRRdWV1ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmNsYXNzTmFtZSA9ICd3ay1jaGFydC1yZXNpemUtc2Vuc29yJztcbiAgICAgICAgICAgIHZhciBzdHlsZSA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IHNjcm9sbDsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xuICAgICAgICAgICAgdmFyIHN0eWxlQ2hpbGQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7JztcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3ay1jaGFydC1yZXNpemUtc2Vuc29yLWV4cGFuZFwiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwid2stY2hhcnQtcmVzaXplLXNlbnNvci1zaHJpbmtcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJyB3aWR0aDogMjAwJTsgaGVpZ2h0OiAyMDAlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQucmVzaXplU2Vuc29yKTtcbiAgICAgICAgICAgIGlmICghe2ZpeGVkOiAxLCBhYnNvbHV0ZTogMX1bZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKV0pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBleHBhbmQgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGV4cGFuZENoaWxkID0gZXhwYW5kLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgc2hyaW5rID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmtDaGlsZCA9IHNocmluay5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGxhc3RXaWR0aCwgbGFzdEhlaWdodDtcbiAgICAgICAgICAgIHZhciByZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLndpZHRoID0gZXhwYW5kLm9mZnNldFdpZHRoICsgMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLmhlaWdodCA9IGV4cGFuZC5vZmZzZXRIZWlnaHQgKyAxMCArICdweCc7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbExlZnQgPSBleHBhbmQuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbFRvcCA9IGV4cGFuZC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbExlZnQgPSBzaHJpbmsuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbFRvcCA9IHNocmluay5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGFzdFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBsYXN0SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuY2FsbCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBjYikge1xuICAgICAgICAgICAgICAgIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgbmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGRFdmVudChleHBhbmQsICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IGxhc3RXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA+IGxhc3RIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhZGRFdmVudChzaHJpbmssICdzY3JvbGwnLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoIDwgbGFzdFdpZHRoIHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IDwgbGFzdEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJbb2JqZWN0IEFycmF5XVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZWxlbWVudClcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSAmJiBlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5KSAvL2pxdWVyeVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgRWxlbWVudHMgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnRzKSAvL21vb3Rvb2xzXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBpID0gMCwgaiA9IGVsZW1lbnQubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50W2ldLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnJ1c2gnLCAoJGxvZywgc2VsZWN0aW9uU2hhcmluZywgYmVoYXZpb3IpIC0+XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6IFsnXmNoYXJ0JywgJ15sYXlvdXQnLCAnP3gnLCAnP3knXVxuICAgIHNjb3BlOlxuICAgICAgYnJ1c2hFeHRlbnQ6ICc9J1xuICAgICAgc2VsZWN0ZWRWYWx1ZXM6ICc9J1xuICAgICAgc2VsZWN0ZWREb21haW46ICc9J1xuICAgICAgY2hhbmdlOiAnJidcblxuICAgIGxpbms6KHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1sxXT8ubWVcbiAgICAgIHggPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIHkgPSBjb250cm9sbGVyc1szXT8ubWVcbiAgICAgIHhTY2FsZSA9IHVuZGVmaW5lZFxuICAgICAgeVNjYWxlID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0YWJsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9icnVzaEFyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICAgIF9pc0FyZWFCcnVzaCA9IG5vdCB4IGFuZCBub3QgeVxuICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgYnJ1c2ggPSBjaGFydC5iZWhhdmlvcigpLmJydXNoXG4gICAgICBpZiBub3QgeCBhbmQgbm90IHlcbiAgICAgICAgI2xheW91dCBicnVzaCwgZ2V0IHggYW5kIHkgZnJvbSBsYXlvdXQgc2NhbGVzXG4gICAgICAgIHNjYWxlcyA9IGxheW91dC5zY2FsZXMoKS5nZXRTY2FsZXMoWyd4JywgJ3knXSlcbiAgICAgICAgYnJ1c2gueChzY2FsZXMueClcbiAgICAgICAgYnJ1c2gueShzY2FsZXMueSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnJ1c2gueCh4KVxuICAgICAgICBicnVzaC55KHkpXG4gICAgICBicnVzaC5hY3RpdmUodHJ1ZSlcblxuICAgICAgYnJ1c2guZXZlbnRzKCkub24gJ2JydXNoJywgKGlkeFJhbmdlLCB2YWx1ZVJhbmdlLCBkb21haW4pIC0+XG4gICAgICAgIGlmIGF0dHJzLmJydXNoRXh0ZW50XG4gICAgICAgICAgc2NvcGUuYnJ1c2hFeHRlbnQgPSBpZHhSYW5nZVxuICAgICAgICBpZiBhdHRycy5zZWxlY3RlZFZhbHVlc1xuICAgICAgICAgIHNjb3BlLnNlbGVjdGVkVmFsdWVzID0gdmFsdWVSYW5nZVxuICAgICAgICBpZiBhdHRycy5zZWxlY3RlZERvbWFpblxuICAgICAgICAgIHNjb3BlLnNlbGVjdGVkRG9tYWluID0gZG9tYWluXG4gICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnZHJhdy5icnVzaCcsIChkYXRhKSAtPlxuICAgICAgICBicnVzaC5kYXRhKGRhdGEpXG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2JydXNoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyh2YWwpIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIGJydXNoLmJydXNoR3JvdXAodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYnJ1c2guYnJ1c2hHcm91cCh1bmRlZmluZWQpXG4gIH0iLG51bGwsIi8vIENvcHlyaWdodCAoYykgMjAxMywgSmFzb24gRGF2aWVzLCBodHRwOi8vd3d3Lmphc29uZGF2aWVzLmNvbVxuLy8gU2VlIExJQ0VOU0UudHh0IGZvciBkZXRhaWxzLlxuKGZ1bmN0aW9uKCkge1xuXG52YXIgcmFkaWFucyA9IE1hdGguUEkgLyAxODAsXG4gICAgZGVncmVlcyA9IDE4MCAvIE1hdGguUEk7XG5cbi8vIFRPRE8gbWFrZSBpbmNyZW1lbnRhbCByb3RhdGUgb3B0aW9uYWxcblxuZDMuZ2VvLnpvb20gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByb2plY3Rpb24sXG4gICAgICB6b29tUG9pbnQsXG4gICAgICBldmVudCA9IGQzLmRpc3BhdGNoKFwiem9vbXN0YXJ0XCIsIFwiem9vbVwiLCBcInpvb21lbmRcIiksXG4gICAgICB6b29tID0gZDMuYmVoYXZpb3Iuem9vbSgpXG4gICAgICAgIC5vbihcInpvb21zdGFydFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbW91c2UwID0gZDMubW91c2UodGhpcyksXG4gICAgICAgICAgICAgIHJvdGF0ZSA9IHF1YXRlcm5pb25Gcm9tRXVsZXIocHJvamVjdGlvbi5yb3RhdGUoKSksXG4gICAgICAgICAgICAgIHBvaW50ID0gcG9zaXRpb24ocHJvamVjdGlvbiwgbW91c2UwKTtcbiAgICAgICAgICBpZiAocG9pbnQpIHpvb21Qb2ludCA9IHBvaW50O1xuXG4gICAgICAgICAgem9vbU9uLmNhbGwoem9vbSwgXCJ6b29tXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoZDMuZXZlbnQuc2NhbGUpO1xuICAgICAgICAgICAgICAgIHZhciBtb3VzZTEgPSBkMy5tb3VzZSh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYmV0d2VlbiA9IHJvdGF0ZUJldHdlZW4oem9vbVBvaW50LCBwb3NpdGlvbihwcm9qZWN0aW9uLCBtb3VzZTEpKTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnJvdGF0ZShldWxlckZyb21RdWF0ZXJuaW9uKHJvdGF0ZSA9IGJldHdlZW5cbiAgICAgICAgICAgICAgICAgICAgPyBtdWx0aXBseShyb3RhdGUsIGJldHdlZW4pXG4gICAgICAgICAgICAgICAgICAgIDogbXVsdGlwbHkoYmFuayhwcm9qZWN0aW9uLCBtb3VzZTAsIG1vdXNlMSksIHJvdGF0ZSkpKTtcbiAgICAgICAgICAgICAgICBtb3VzZTAgPSBtb3VzZTE7XG4gICAgICAgICAgICAgICAgZXZlbnQuem9vbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICBldmVudC56b29tc3RhcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwiem9vbWVuZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB6b29tT24uY2FsbCh6b29tLCBcInpvb21cIiwgbnVsbCk7XG4gICAgICAgICAgZXZlbnQuem9vbWVuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9KSxcbiAgICAgIHpvb21PbiA9IHpvb20ub247XG5cbiAgem9vbS5wcm9qZWN0aW9uID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gem9vbS5zY2FsZSgocHJvamVjdGlvbiA9IF8pLnNjYWxlKCkpIDogcHJvamVjdGlvbjtcbiAgfTtcblxuICByZXR1cm4gZDMucmViaW5kKHpvb20sIGV2ZW50LCBcIm9uXCIpO1xufTtcblxuZnVuY3Rpb24gYmFuayhwcm9qZWN0aW9uLCBwMCwgcDEpIHtcbiAgdmFyIHQgPSBwcm9qZWN0aW9uLnRyYW5zbGF0ZSgpLFxuICAgICAgYW5nbGUgPSBNYXRoLmF0YW4yKHAwWzFdIC0gdFsxXSwgcDBbMF0gLSB0WzBdKSAtIE1hdGguYXRhbjIocDFbMV0gLSB0WzFdLCBwMVswXSAtIHRbMF0pO1xuICByZXR1cm4gW01hdGguY29zKGFuZ2xlIC8gMiksIDAsIDAsIE1hdGguc2luKGFuZ2xlIC8gMildO1xufVxuXG5mdW5jdGlvbiBwb3NpdGlvbihwcm9qZWN0aW9uLCBwb2ludCkge1xuICB2YXIgdCA9IHByb2plY3Rpb24udHJhbnNsYXRlKCksXG4gICAgICBzcGhlcmljYWwgPSBwcm9qZWN0aW9uLmludmVydChwb2ludCk7XG4gIHJldHVybiBzcGhlcmljYWwgJiYgaXNGaW5pdGUoc3BoZXJpY2FsWzBdKSAmJiBpc0Zpbml0ZShzcGhlcmljYWxbMV0pICYmIGNhcnRlc2lhbihzcGhlcmljYWwpO1xufVxuXG5mdW5jdGlvbiBxdWF0ZXJuaW9uRnJvbUV1bGVyKGV1bGVyKSB7XG4gIHZhciDOuyA9IC41ICogZXVsZXJbMF0gKiByYWRpYW5zLFxuICAgICAgz4YgPSAuNSAqIGV1bGVyWzFdICogcmFkaWFucyxcbiAgICAgIM6zID0gLjUgKiBldWxlclsyXSAqIHJhZGlhbnMsXG4gICAgICBzaW7OuyA9IE1hdGguc2luKM67KSwgY29zzrsgPSBNYXRoLmNvcyjOuyksXG4gICAgICBzaW7PhiA9IE1hdGguc2luKM+GKSwgY29zz4YgPSBNYXRoLmNvcyjPhiksXG4gICAgICBzaW7OsyA9IE1hdGguc2luKM6zKSwgY29zzrMgPSBNYXRoLmNvcyjOsyk7XG4gIHJldHVybiBbXG4gICAgY29zzrsgKiBjb3PPhiAqIGNvc86zICsgc2luzrsgKiBzaW7PhiAqIHNpbs6zLFxuICAgIHNpbs67ICogY29zz4YgKiBjb3POsyAtIGNvc867ICogc2luz4YgKiBzaW7OsyxcbiAgICBjb3POuyAqIHNpbs+GICogY29zzrMgKyBzaW7OuyAqIGNvc8+GICogc2luzrMsXG4gICAgY29zzrsgKiBjb3PPhiAqIHNpbs6zIC0gc2luzrsgKiBzaW7PhiAqIGNvc86zXG4gIF07XG59XG5cbmZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXSxcbiAgICAgIGIwID0gYlswXSwgYjEgPSBiWzFdLCBiMiA9IGJbMl0sIGIzID0gYlszXTtcbiAgcmV0dXJuIFtcbiAgICBhMCAqIGIwIC0gYTEgKiBiMSAtIGEyICogYjIgLSBhMyAqIGIzLFxuICAgIGEwICogYjEgKyBhMSAqIGIwICsgYTIgKiBiMyAtIGEzICogYjIsXG4gICAgYTAgKiBiMiAtIGExICogYjMgKyBhMiAqIGIwICsgYTMgKiBiMSxcbiAgICBhMCAqIGIzICsgYTEgKiBiMiAtIGEyICogYjEgKyBhMyAqIGIwXG4gIF07XG59XG5cbmZ1bmN0aW9uIHJvdGF0ZUJldHdlZW4oYSwgYikge1xuICBpZiAoIWEgfHwgIWIpIHJldHVybjtcbiAgdmFyIGF4aXMgPSBjcm9zcyhhLCBiKSxcbiAgICAgIG5vcm0gPSBNYXRoLnNxcnQoZG90KGF4aXMsIGF4aXMpKSxcbiAgICAgIGhhbGbOsyA9IC41ICogTWF0aC5hY29zKE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBkb3QoYSwgYikpKSksXG4gICAgICBrID0gTWF0aC5zaW4oaGFsZs6zKSAvIG5vcm07XG4gIHJldHVybiBub3JtICYmIFtNYXRoLmNvcyhoYWxmzrMpLCBheGlzWzJdICogaywgLWF4aXNbMV0gKiBrLCBheGlzWzBdICoga107XG59XG5cbmZ1bmN0aW9uIGV1bGVyRnJvbVF1YXRlcm5pb24ocSkge1xuICByZXR1cm4gW1xuICAgIE1hdGguYXRhbjIoMiAqIChxWzBdICogcVsxXSArIHFbMl0gKiBxWzNdKSwgMSAtIDIgKiAocVsxXSAqIHFbMV0gKyBxWzJdICogcVsyXSkpICogZGVncmVlcyxcbiAgICBNYXRoLmFzaW4oTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIDIgKiAocVswXSAqIHFbMl0gLSBxWzNdICogcVsxXSkpKSkgKiBkZWdyZWVzLFxuICAgIE1hdGguYXRhbjIoMiAqIChxWzBdICogcVszXSArIHFbMV0gKiBxWzJdKSwgMSAtIDIgKiAocVsyXSAqIHFbMl0gKyBxWzNdICogcVszXSkpICogZGVncmVlc1xuICBdO1xufVxuXG5mdW5jdGlvbiBjYXJ0ZXNpYW4oc3BoZXJpY2FsKSB7XG4gIHZhciDOuyA9IHNwaGVyaWNhbFswXSAqIHJhZGlhbnMsXG4gICAgICDPhiA9IHNwaGVyaWNhbFsxXSAqIHJhZGlhbnMsXG4gICAgICBjb3PPhiA9IE1hdGguY29zKM+GKTtcbiAgcmV0dXJuIFtcbiAgICBjb3PPhiAqIE1hdGguY29zKM67KSxcbiAgICBjb3PPhiAqIE1hdGguc2luKM67KSxcbiAgICBNYXRoLnNpbijPhilcbiAgXTtcbn1cblxuZnVuY3Rpb24gZG90KGEsIGIpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBhLmxlbmd0aCwgcyA9IDA7IGkgPCBuOyArK2kpIHMgKz0gYVtpXSAqIGJbaV07XG4gIHJldHVybiBzO1xufVxuXG5mdW5jdGlvbiBjcm9zcyhhLCBiKSB7XG4gIHJldHVybiBbXG4gICAgYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSxcbiAgICBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdLFxuICAgIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF1cbiAgXTtcbn1cblxufSkoKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYnJ1c2hlZCcsICgkbG9nLHNlbGVjdGlvblNoYXJpbmcsIHRpbWluZykgLT5cbiAgc0JydXNoQ250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiBbJ15jaGFydCcsICc/XmxheW91dCcsICc/eCcsICc/eSddXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIC0+XG4gICAgICBjaGFydCA9IGNvbnRyb2xsZXJzWzBdLm1lXG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyc1sxXT8ubWVcbiAgICAgIHggPSBjb250cm9sbGVyc1syXT8ubWVcbiAgICAgIHkgPSBjb250cm9sbGVyc1szXT8ubWVcblxuICAgICAgYXhpcyA9IHggb3IgeVxuICAgICAgX2JydXNoR3JvdXAgPSB1bmRlZmluZWRcblxuICAgICAgYnJ1c2hlciA9IChleHRlbnQpIC0+XG4gICAgICAgIHRpbWluZy5zdGFydChcImJydXNoZXIje2F4aXMuaWQoKX1cIilcbiAgICAgICAgaWYgbm90IGF4aXMgdGhlbiByZXR1cm5cbiAgICAgICAgI2F4aXNcbiAgICAgICAgYXhpcy5kb21haW4oZXh0ZW50KS5zY2FsZSgpLmRvbWFpbihleHRlbnQpXG4gICAgICAgIGZvciBsIGluIGNoYXJ0LmxheW91dHMoKSB3aGVuIGwuc2NhbGVzKCkuaGFzU2NhbGUoYXhpcykgI25lZWQgdG8gZG8gaXQgdGhpcyB3YXkgdG8gZW5zdXJlIHRoZSByaWdodCBheGlzIGlzIGNob3NlbiBpbiBjYXNlIG9mIHNldmVyYWwgbGF5b3V0cyBpbiBhIGNvbnRhaW5lclxuICAgICAgICAgIGwubGlmZUN5Y2xlKCkuYnJ1c2goYXhpcywgdHJ1ZSkgI25vIGFuaW1hdGlvblxuICAgICAgICB0aW1pbmcuc3RvcChcImJydXNoZXIje2F4aXMuaWQoKX1cIilcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2JydXNoZWQnLCAodmFsKSAtPlxuICAgICAgICBpZiBfLmlzU3RyaW5nKHZhbCkgYW5kIHZhbC5sZW5ndGggPiAwXG4gICAgICAgICAgX2JydXNoR3JvdXAgPSB2YWxcbiAgICAgICAgICBzZWxlY3Rpb25TaGFyaW5nLnJlZ2lzdGVyIF9icnVzaEdyb3VwLCBicnVzaGVyXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYnJ1c2hHcm91cCA9IHVuZGVmaW5lZFxuXG4gICAgICBzY29wZS4kb24gJyRkZXN0cm95JywgKCkgLT5cbiAgICAgICAgc2VsZWN0aW9uU2hhcmluZy51bnJlZ2lzdGVyIF9icnVzaEdyb3VwLCBicnVzaGVyXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY2hhcnQnLCAoJGxvZywgY2hhcnQsICRmaWx0ZXIpIC0+XG4gIGNoYXJ0Q250ID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXF1aXJlOiAnY2hhcnQnXG4gICAgc2NvcGU6XG4gICAgICBkYXRhOiAnPSdcbiAgICAgIGZpbHRlcjogJz0nXG4gICAgY29udHJvbGxlcjogKCkgLT5cbiAgICAgIHRoaXMubWUgPSBjaGFydCgpXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGRlZXBXYXRjaCA9IGZhbHNlXG4gICAgICB3YXRjaGVyUmVtb3ZlRm4gPSB1bmRlZmluZWRcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICAgIF9maWx0ZXIgPSB1bmRlZmluZWRcblxuICAgICAgbWUuY29udGFpbmVyKCkuZWxlbWVudChlbGVtZW50WzBdKVxuXG4gICAgICBtZS5saWZlQ3ljbGUoKS5jb25maWd1cmUoKVxuXG4gICAgICBtZS5saWZlQ3ljbGUoKS5vbiAnc2NvcGVBcHBseScsICgpIC0+XG4gICAgICAgIHNjb3BlLiRhcHBseSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0b29sdGlwcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZCBhbmQgKHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnKVxuICAgICAgICAgIG1lLnNob3dUb29sdGlwKHRydWUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtZS5zaG93VG9vbHRpcChmYWxzZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2FuaW1hdGlvbkR1cmF0aW9uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCBfLmlzTnVtYmVyKCt2YWwpIGFuZCArdmFsID49IDBcbiAgICAgICAgICBtZS5hbmltYXRpb25EdXJhdGlvbih2YWwpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0aXRsZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIG1lLnRpdGxlKHZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnRpdGxlKHVuZGVmaW5lZClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3N1YnRpdGxlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgbWUuc3ViVGl0bGUodmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWUuc3ViVGl0bGUodW5kZWZpbmVkKVxuXG4gICAgICBzY29wZS4kd2F0Y2ggJ2ZpbHRlcicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIF9maWx0ZXIgPSB2YWwgIyBzY29wZS4kZXZhbCh2YWwpXG4gICAgICAgICAgaWYgX2RhdGFcbiAgICAgICAgICAgIG1lLmxpZmVDeWNsZSgpLm5ld0RhdGEoJGZpbHRlcignZmlsdGVyJykoX2RhdGEsIF9maWx0ZXIpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2ZpbHRlciA9IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIF9kYXRhXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKF9kYXRhKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnZGVlcFdhdGNoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkIGFuZCB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgZGVlcFdhdGNoID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVlcFdhdGNoID0gZmFsc2VcbiAgICAgICAgaWYgd2F0Y2hlclJlbW92ZUZuXG4gICAgICAgICAgd2F0Y2hlclJlbW92ZUZuKClcbiAgICAgICAgd2F0Y2hlclJlbW92ZUZuID0gc2NvcGUuJHdhdGNoICdkYXRhJywgZGF0YVdhdGNoRm4sIGRlZXBXYXRjaFxuXG4gICAgICBkYXRhV2F0Y2hGbiA9ICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIF9kYXRhID0gdmFsXG4gICAgICAgICAgaWYgXy5pc0FycmF5KF9kYXRhKSBhbmQgX2RhdGEubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm5cbiAgICAgICAgICBpZiBfZmlsdGVyXG4gICAgICAgICAgICBtZS5saWZlQ3ljbGUoKS5uZXdEYXRhKCRmaWx0ZXIoJ2ZpbHRlcicpKHZhbCwgX2ZpbHRlcikpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUubGlmZUN5Y2xlKCkubmV3RGF0YSh2YWwpXG5cbiAgICAgIHdhdGNoZXJSZW1vdmVGbiA9IHNjb3BlLiR3YXRjaCAnZGF0YScsIGRhdGFXYXRjaEZuLCBkZWVwV2F0Y2hcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnbGF5b3V0JywgKCRsb2csIGxheW91dCwgY29udGFpbmVyKSAtPlxuICBsYXlvdXRDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRSdcbiAgICByZXF1aXJlOiBbJ2xheW91dCcsJ15jaGFydCddXG5cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gbGF5b3V0KClcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cblxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG5cbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIGxheW91dCBpZDonLCBtZS5pZCgpLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuICAgICAgY2hhcnQuYWRkTGF5b3V0KG1lKVxuICAgICAgY2hhcnQuY29udGFpbmVyKCkuYWRkTGF5b3V0KG1lKVxuICAgICAgbWUuY29udGFpbmVyKGNoYXJ0LmNvbnRhaW5lcigpKVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ3NlbGVjdGlvbicsICgkbG9nKSAtPlxuICBvYmpJZCA9IDBcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICBzY29wZTpcbiAgICAgIHNlbGVjdGVkRG9tYWluOiAnPSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUuc2VsZWN0aW9uJywgLT5cblxuICAgICAgICBfc2VsZWN0aW9uID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3NlbGVjdGlvbi5hY3RpdmUodHJ1ZSlcbiAgICAgICAgX3NlbGVjdGlvbi5vbiAnc2VsZWN0ZWQnLCAoc2VsZWN0ZWRPYmplY3RzKSAtPlxuICAgICAgICAgIHNjb3BlLnNlbGVjdGVkRG9tYWluID0gc2VsZWN0ZWRPYmplY3RzXG4gICAgICAgICAgc2NvcGUuJGFwcGx5KClcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmlsdGVyICd0dEZvcm1hdCcsICgkbG9nLGZvcm1hdERlZmF1bHRzKSAtPlxuICByZXR1cm4gKHZhbHVlLCBmb3JtYXQpIC0+XG4gICAgaWYgdHlwZW9mIHZhbHVlIGlzICdvYmplY3QnIGFuZCB2YWx1ZS5nZXRVVENEYXRlXG4gICAgICBkZiA9IGQzLnRpbWUuZm9ybWF0KGZvcm1hdERlZmF1bHRzLmRhdGUpXG4gICAgICByZXR1cm4gZGYodmFsdWUpXG4gICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInIG9yIG5vdCBpc05hTigrdmFsdWUpXG4gICAgICBkZiA9IGQzLmZvcm1hdChmb3JtYXREZWZhdWx0cy5udW1iZXIpXG4gICAgICByZXR1cm4gZGYoK3ZhbHVlKVxuICAgIHJldHVybiB2YWx1ZSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYXJlYScsICgkbG9nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBsYXllcktleXMgPSBbXVxuICAgICAgX2xheW91dCA9IFtdXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3R0SGlnaGxpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICBfY2lyY2xlcyA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgb2Zmc2V0ID0gMFxuICAgICAgX2lkID0gJ2xpbmUnICsgbGluZUNudHIrK1xuICAgICAgYXJlYSA9IHVuZGVmaW5lZFxuXG4gICAgICAjLS0tIFRvb2x0aXAgaGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX2xheW91dC5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZVtpZHhdLnkpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueClcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICB0dE1vdmVNYXJrZXIgPSAoaWR4KSAtPlxuICAgICAgICBfY2lyY2xlcyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LW1hcmtlci0je19pZH1cIikuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N5JywgKGQpIC0+IF9zY2FsZUxpc3QueS5zY2FsZSgpKGQudmFsdWVbaWR4XS55KSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfc2NhbGVMaXN0Lnguc2NhbGUoKShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueCkgKyBvZmZzZXR9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBfbGF5b3V0ID0gbGF5ZXJLZXlzLm1hcCgoa2V5KSA9PiB7a2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpLCB2YWx1ZTpkYXRhLm1hcCgoZCktPiB7eDp4LnZhbHVlKGQpLHk6eS5sYXllclZhbHVlKGQsIGtleSl9KX0pXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeC5pc09yZGluYWwoKSB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgYXJlYSA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgLngoKGQpIC0+ICB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgLnkwKChkKSAtPiAgeS5zY2FsZSgpKGQueSkpXG4gICAgICAgIC55MSgoZCkgLT4gIHkuc2NhbGUoKSgwKSlcblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZnJvbScsIFwidHJhbnNsYXRlKCN7b2Zmc2V0fSlcIilcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBhcmVhKGQudmFsdWUpKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgIGJydXNoID0gKGRhdGEsIG9wdGlvbnMseCx5LGNvbG9yKSAtPlxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICBsYXllcnMuc2VsZWN0KCcud2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgIGFyZWEoZC52YWx1ZSkpXG5cblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueClcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBicnVzaFxuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYXJlYVN0YWNrZWQnLCAoJGxvZywgdXRpbHMpIC0+XG4gIHN0YWNrZWRBcmVhQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKVxuICAgICAgb2Zmc2V0ID0gJ3plcm8nXG4gICAgICBsYXllcnMgPSBudWxsXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgbGF5ZXJLZXlzID0gW11cbiAgICAgIGxheWVyRGF0YSA9IFtdXG4gICAgICBsYXlvdXROZXcgPSBbXVxuICAgICAgbGF5b3V0T2xkID0gW11cbiAgICAgIGxheWVyS2V5c09sZCA9IFtdXG4gICAgICBhcmVhID0gdW5kZWZpbmVkXG4gICAgICBkZWxldGVkU3VjYyA9IHt9XG4gICAgICBhZGRlZFByZWQgPSB7fVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgc2NhbGVZID0gdW5kZWZpbmVkXG4gICAgICBvZmZzID0gMFxuICAgICAgX2lkID0gJ2FyZWEnICsgc3RhY2tlZEFyZWFDbnRyKytcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IGxheWVyRGF0YS5tYXAoKGwpIC0+IHtuYW1lOmwua2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC5sYXllcltpZHhdLnl5KSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGxheWVyRGF0YVswXS5sYXllcltpZHhdLngpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEobGF5ZXJEYXRhLCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N5JywgKGQpIC0+IHNjYWxlWShkLmxheWVyW2lkeF0ueSArIGQubGF5ZXJbaWR4XS55MCkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfc2NhbGVMaXN0Lnguc2NhbGUoKShsYXllckRhdGFbMF0ubGF5ZXJbaWR4XS54KStvZmZzfSlcIilcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZ2V0TGF5ZXJCeUtleSA9IChrZXksIGxheW91dCkgLT5cbiAgICAgICAgZm9yIGwgaW4gbGF5b3V0XG4gICAgICAgICAgaWYgbC5rZXkgaXMga2V5XG4gICAgICAgICAgICByZXR1cm4gbFxuXG4gICAgICBsYXlvdXQgPSBzdGFjay52YWx1ZXMoKGQpLT5kLmxheWVyKS55KChkKSAtPiBkLnl5KVxuXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIyNcbiAgICAgIHByZXBEYXRhID0gKHgseSxjb2xvcikgLT5cblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3g6IHAueCwgeTogMCwgeTA6IHAueSArIHAueTB9KSl9KVxuICAgICAgICBsYXllcktleXNPbGQgPSBsYXllcktleXNcblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhAKVxuICAgICAgICBsYXllckRhdGEgPSBsYXllcktleXMubWFwKChrKSA9PiB7a2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBsYXllcjogQG1hcCgoZCkgLT4ge3g6IHgudmFsdWUoZCksIHl5OiAreS5sYXllclZhbHVlKGQsayksIHkwOiAwfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgICNsYXlvdXROZXcgPSBsYXlvdXQobGF5ZXJEYXRhKVxuXG4gICAgICAgIGRlbGV0ZWRTdWNjID0gdXRpbHMuZGlmZihsYXllcktleXNPbGQsIGxheWVyS2V5cywgMSlcbiAgICAgICAgYWRkZWRQcmVkID0gdXRpbHMuZGlmZihsYXllcktleXMsIGxheWVyS2V5c09sZCwgLTEpXG4gICAgICAjIyNcbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgQXJlYSBDaGFydFwiXG5cblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBkZWxldGVkU3VjYyA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzT2xkLCBsYXllcktleXMsIDEpXG4gICAgICAgIGFkZGVkUHJlZCA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzLCBsYXllcktleXNPbGQsIC0xKVxuXG4gICAgICAgIGxheWVyRGF0YSA9IGxheWVyS2V5cy5tYXAoKGspID0+IHtrZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGxheWVyOiBkYXRhLm1hcCgoZCkgLT4ge3g6IHgudmFsdWUoZCksIHl5OiAreS5sYXllclZhbHVlKGQsayksIHkwOiAwfSl9KSAjIHl5OiBuZWVkIHRvIGF2b2lkIG92ZXJ3cml0aW5nIGJ5IGxheW91dCBjYWxjIC0+IHNlZSBzdGFjayB5IGFjY2Vzc29yXG4gICAgICAgIGxheW91dE5ldyA9IGxheW91dChsYXllckRhdGEpXG5cbiAgICAgICAgb2ZmcyA9IGlmIHguaXNPcmRpbmFsKCkgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBpZiBvZmZzZXQgaXMgJ2V4cGFuZCdcbiAgICAgICAgICBzY2FsZVkgPSB5LnNjYWxlKCkuY29weSgpXG4gICAgICAgICAgc2NhbGVZLmRvbWFpbihbMCwgMV0pXG4gICAgICAgIGVsc2Ugc2NhbGVZID0geS5zY2FsZSgpXG5cbiAgICAgICAgYXJlYSA9IGQzLnN2Zy5hcmVhKClcbiAgICAgICAgICAueCgoZCkgLT4gIHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55MCgoZCkgLT4gIHNjYWxlWShkLnkwICsgZC55KSlcbiAgICAgICAgICAueTEoKGQpIC0+ICBzY2FsZVkoZC55MCkpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEobGF5b3V0TmV3LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgaWYgbGF5b3V0T2xkLmxlbmd0aCBpcyAwXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSkuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBpZiBhZGRlZFByZWRbZC5rZXldIHRoZW4gZ2V0TGF5ZXJCeUtleShhZGRlZFByZWRbZC5rZXldLCBsYXlvdXRPbGQpLnBhdGggZWxzZSBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiAge3g6IHAueCwgeTogMCwgeTA6IDB9KSkpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG4gICAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC43KVxuXG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje29mZnN9KVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC5sYXllcikpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG5cblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBzdWNjID0gZGVsZXRlZFN1Y2NbZC5rZXldXG4gICAgICAgICAgICBpZiBzdWNjIHRoZW4gYXJlYShnZXRMYXllckJ5S2V5KHN1Y2MsIGxheW91dE5ldykubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55MH0pKSBlbHNlIGFyZWEobGF5b3V0TmV3W2xheW91dE5ldy5sZW5ndGggLSAxXS5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkwICsgcC55fSkpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGxheW91dE9sZCA9IGxheW91dE5ldy5tYXAoKGQpIC0+IHtrZXk6IGQua2V5LCBwYXRoOiBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiB7eDogcC54LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LngpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2FyZWFTdGFja2VkJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGluIFsnemVybycsICdzaWxob3VldHRlJywgJ2V4cGFuZCcsICd3aWdnbGUnXVxuICAgICAgICAgIG9mZnNldCA9IHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgb2Zmc2V0ID0gXCJ6ZXJvXCJcbiAgICAgICAgc3RhY2sub2Zmc2V0KG9mZnNldClcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnbWFya2VycycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpcyAnJyBvciB2YWwgaXMgJ3RydWUnXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnYXJlYVN0YWNrZWRWZXJ0aWNhbCcsICgkbG9nLCB1dGlscykgLT5cbiAgYXJlYVN0YWNrZWRWZXJ0Q250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKVxuICAgICAgb2Zmc2V0ID0gJ3plcm8nXG4gICAgICBsYXllcnMgPSBudWxsXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgbGF5ZXJLZXlzID0gW11cbiAgICAgIGxheWVyRGF0YSA9IFtdXG4gICAgICBsYXlvdXROZXcgPSBbXVxuICAgICAgbGF5b3V0T2xkID0gW11cbiAgICAgIGxheWVyS2V5c09sZCA9IFtdXG4gICAgICBhcmVhID0gdW5kZWZpbmVkXG4gICAgICBkZWxldGVkU3VjYyA9IHt9XG4gICAgICBhZGRlZFByZWQgPSB7fVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgc2NhbGVYID0gdW5kZWZpbmVkXG4gICAgICBvZmZzID0gMFxuICAgICAgX2lkID0gJ2FyZWEtc3RhY2tlZC12ZXJ0JyArIGFyZWFTdGFja2VkVmVydENudHIrK1xuXG4gICAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gbGF5ZXJEYXRhLm1hcCgobCkgLT4ge25hbWU6bC5rZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsLmxheWVyW2lkeF0ueHgpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobGF5ZXJEYXRhWzBdLmxheWVyW2lkeF0ueXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEobGF5ZXJEYXRhLCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC42KVxuICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N4JywgKGQpIC0+IHNjYWxlWChkLmxheWVyW2lkeF0ueSArIGQubGF5ZXJbaWR4XS55MCkpICAjIHdlaXJkISEhIGhvd2V2ZXIsIHRoZSBkYXRhIGlzIGZvciBhIGhvcml6b250YWwgY2hhcnQgd2hpY2ggZ2V0cyB0cmFuc2Zvcm1lZFxuICAgICAgICBfY2lyY2xlcy5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDAsI3tfc2NhbGVMaXN0Lnkuc2NhbGUoKShsYXllckRhdGFbMF0ubGF5ZXJbaWR4XS55eSkrb2Zmc30pXCIpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGdldExheWVyQnlLZXkgPSAoa2V5LCBsYXlvdXQpIC0+XG4gICAgICAgIGZvciBsIGluIGxheW91dFxuICAgICAgICAgIGlmIGwua2V5IGlzIGtleVxuICAgICAgICAgICAgcmV0dXJuIGxcblxuICAgICAgbGF5b3V0ID0gc3RhY2sudmFsdWVzKChkKS0+ZC5sYXllcikueSgoZCkgLT4gZC54eClcblxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyMjXG4gICAgICBwcmVwRGF0YSA9ICh4LHksY29sb3IpIC0+XG5cbiAgICAgICAgbGF5b3V0T2xkID0gbGF5b3V0TmV3Lm1hcCgoZCkgLT4ge2tleTogZC5rZXksIHBhdGg6IGFyZWEoZC5sYXllci5tYXAoKHApIC0+IHt4OiBwLngsIHk6IDAsIHkwOiBwLnkgKyBwLnkwfSkpfSlcbiAgICAgICAgbGF5ZXJLZXlzT2xkID0gbGF5ZXJLZXlzXG5cbiAgICAgICAgbGF5ZXJLZXlzID0geS5sYXllcktleXMoQClcbiAgICAgICAgbGF5ZXJEYXRhID0gbGF5ZXJLZXlzLm1hcCgoaykgPT4ge2tleTogaywgY29sb3I6Y29sb3Iuc2NhbGUoKShrKSwgbGF5ZXI6IEBtYXAoKGQpIC0+IHt4OiB4LnZhbHVlKGQpLCB5eTogK3kubGF5ZXJWYWx1ZShkLGspLCB5MDogMH0pfSkgIyB5eTogbmVlZCB0byBhdm9pZCBvdmVyd3JpdGluZyBieSBsYXlvdXQgY2FsYyAtPiBzZWUgc3RhY2sgeSBhY2Nlc3NvclxuICAgICAgICAjbGF5b3V0TmV3ID0gbGF5b3V0KGxheWVyRGF0YSlcblxuICAgICAgICBkZWxldGVkU3VjYyA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzT2xkLCBsYXllcktleXMsIDEpXG4gICAgICAgIGFkZGVkUHJlZCA9IHV0aWxzLmRpZmYobGF5ZXJLZXlzLCBsYXllcktleXNPbGQsIC0xKVxuICAgICAgIyMjXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgIyRsb2cubG9nIFwicmVuZGVyaW5nIEFyZWEgQ2hhcnRcIlxuXG5cbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcbiAgICAgICAgZGVsZXRlZFN1Y2MgPSB1dGlscy5kaWZmKGxheWVyS2V5c09sZCwgbGF5ZXJLZXlzLCAxKVxuICAgICAgICBhZGRlZFByZWQgPSB1dGlscy5kaWZmKGxheWVyS2V5cywgbGF5ZXJLZXlzT2xkLCAtMSlcblxuICAgICAgICBsYXllckRhdGEgPSBsYXllcktleXMubWFwKChrKSA9PiB7a2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBsYXllcjogZGF0YS5tYXAoKGQpIC0+IHt5eTogeS52YWx1ZShkKSwgeHg6ICt4LmxheWVyVmFsdWUoZCxrKSwgeTA6IDB9KX0pICMgeXk6IG5lZWQgdG8gYXZvaWQgb3ZlcndyaXRpbmcgYnkgbGF5b3V0IGNhbGMgLT4gc2VlIHN0YWNrIHkgYWNjZXNzb3JcbiAgICAgICAgbGF5b3V0TmV3ID0gbGF5b3V0KGxheWVyRGF0YSlcblxuICAgICAgICBvZmZzID0gaWYgeS5pc09yZGluYWwoKSB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtbGF5ZXInKVxuXG4gICAgICAgIGlmIG9mZnNldCBpcyAnZXhwYW5kJ1xuICAgICAgICAgIHNjYWxlWCA9IHguc2NhbGUoKS5jb3B5KClcbiAgICAgICAgICBzY2FsZVguZG9tYWluKFswLCAxXSlcbiAgICAgICAgZWxzZSBzY2FsZVggPSB4LnNjYWxlKClcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKVxuICAgICAgICAgIC54KChkKSAtPiAgeS5zY2FsZSgpKGQueXkpKVxuICAgICAgICAgIC55MCgoZCkgLT4gIHNjYWxlWChkLnkwICsgZC55KSlcbiAgICAgICAgICAueTEoKGQpIC0+ICBzY2FsZVgoZC55MCkpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzXG4gICAgICAgICAgLmRhdGEobGF5b3V0TmV3LCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgaWYgbGF5b3V0T2xkLmxlbmd0aCBpcyAwXG4gICAgICAgICAgbGF5ZXJzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1hcmVhJylcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSkuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxheWVycy5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXJlYScpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBpZiBhZGRlZFByZWRbZC5rZXldIHRoZW4gZ2V0TGF5ZXJCeUtleShhZGRlZFByZWRbZC5rZXldLCBsYXlvdXRPbGQpLnBhdGggZWxzZSBhcmVhKGQubGF5ZXIubWFwKChwKSAtPiAge3l5OiBwLnl5LCB5OiAwLCB5MDogMH0pKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSAtPiBjb2xvci5zY2FsZSgpKGQua2V5KSlcbiAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwicm90YXRlKDkwKSBzY2FsZSgxLC0xKVwiKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGFyZWEoZC5sYXllcikpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgLT4gY29sb3Iuc2NhbGUoKShkLmtleSkpXG5cblxuICAgICAgICBsYXllcnMuZXhpdCgpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+XG4gICAgICAgICAgICBzdWNjID0gZGVsZXRlZFN1Y2NbZC5rZXldXG4gICAgICAgICAgICBpZiBzdWNjIHRoZW4gYXJlYShnZXRMYXllckJ5S2V5KHN1Y2MsIGxheW91dE5ldykubGF5ZXIubWFwKChwKSAtPiB7eXk6IHAueXksIHk6IDAsIHkwOiBwLnkwfSkpIGVsc2UgYXJlYShsYXlvdXROZXdbbGF5b3V0TmV3Lmxlbmd0aCAtIDFdLmxheWVyLm1hcCgocCkgLT4ge3l5OiBwLnl5LCB5OiAwLCB5MDogcC55MCArIHAueX0pKVxuICAgICAgICAgIClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBsYXlvdXRPbGQgPSBsYXlvdXROZXcubWFwKChkKSAtPiB7a2V5OiBkLmtleSwgcGF0aDogYXJlYShkLmxheWVyLm1hcCgocCkgLT4ge3l5OiBwLnl5LCB5OiAwLCB5MDogcC55ICsgcC55MH0pKX0pXG4gICAgICAgIGxheWVyS2V5c09sZCA9IGxheWVyS2V5c1xuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCd0b3RhbCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkuZG9tYWluQ2FsYygnZXh0ZW50JylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5tYXJrZXJTY2FsZShfc2NhbGVMaXN0LnkpXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlRGF0YS4je19pZH1cIiwgdHRNb3ZlRGF0YVxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVNYXJrZXIuI3tfaWR9XCIsIHR0TW92ZU1hcmtlclxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2FyZWFTdGFja2VkVmVydGljYWwnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaW4gWyd6ZXJvJywgJ3NpbGhvdWV0dGUnLCAnZXhwYW5kJywgJ3dpZ2dsZSddXG4gICAgICAgICAgb2Zmc2V0ID0gdmFsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvZmZzZXQgPSBcInplcm9cIlxuICAgICAgICBzdGFjay5vZmZzZXQob2Zmc2V0KVxuICAgICAgICBob3N0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdhcmVhVmVydGljYWwnLCAoJGxvZykgLT5cbiAgbGluZUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgcy1saW5lJ1xuICAgICAgbGF5ZXJLZXlzID0gW11cbiAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF90dEhpZ2hsaWdodCA9IHVuZGVmaW5lZFxuICAgICAgX2NpcmNsZXMgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgICAgX3Nob3dNYXJrZXJzID0gZmFsc2VcbiAgICAgIG9mZnNldCA9IDBcbiAgICAgIF9pZCA9ICdsaW5lJyArIGxpbmVDbnRyKytcblxuICAgICAgIy0tLSBUb29sdGlwIGhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IF9sYXlvdXQubWFwKChsKSAtPiB7bmFtZTpsLmtleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwudmFsdWVbaWR4XS54KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUoX2xheW91dFswXS52YWx1ZVtpZHhdLnkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbCgnY2lyY2xlJykuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N4JywgKGQpIC0+IF9zY2FsZUxpc3QueC5zY2FsZSgpKGQudmFsdWVbaWR4XS54KSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwgI3tfc2NhbGVMaXN0Lnkuc2NhbGUoKShfbGF5b3V0WzBdLnZhbHVlW2lkeF0ueSkgKyBvZmZzZXR9KVwiKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgJGxvZy5sb2cgJ3ktcmFuZ2UnLCB5LnNjYWxlKCkucmFuZ2UoKSwgJ3ktZG9tYWluJywgeS5zY2FsZSgpLmRvbWFpbigpXG4gICAgICAgICRsb2cubG9nICd4LXJhbmdlJywgeC5zY2FsZSgpLnJhbmdlKCksICd4LWRvbWFpbicsIHguc2NhbGUoKS5kb21haW4oKVxuICAgICAgICAkbG9nLmxvZyAnY29sb3ItcmFuZ2UnLCBjb2xvci5zY2FsZSgpLnJhbmdlKCksICdjb2xvci1kb21haW4nLCBjb2xvci5zY2FsZSgpLmRvbWFpbigpXG4gICAgICAgIGxheWVyS2V5cyA9IHgubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIF9sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOmRhdGEubWFwKChkKS0+IHt5OnkudmFsdWUoZCkseDp4LmxheWVyVmFsdWUoZCwga2V5KX0pfSlcblxuICAgICAgICBvZmZzZXQgPSBpZiB5LmlzT3JkaW5hbCgpIHRoZW4geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gMiBlbHNlIDBcblxuICAgICAgICBpZiBfdG9vbHRpcCB0aGVuIF90b29sdGlwLmRhdGEoZGF0YSlcblxuICAgICAgICBhcmVhID0gZDMuc3ZnLmFyZWEoKSAgICAjIHRyaWNreS4gRHJhdyB0aGlzIGxpa2UgYSB2ZXJ0aWNhbCBjaGFydCBhbmQgdGhlbiByb3RhdGUgYW5kIHBvc2l0aW9uIGl0LlxuICAgICAgICAueCgoZCkgLT4gb3B0aW9ucy53aWR0aCAtIHkuc2NhbGUoKShkLnkpKVxuICAgICAgICAueTAoKGQpIC0+ICB4LnNjYWxlKCkoZC54KSlcbiAgICAgICAgLnkxKChkKSAtPiAgeC5zY2FsZSgpKDApKVxuXG4gICAgICAgIGxheWVycyA9IHRoaXMuc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmRhdGEoX2xheW91dCwgKGQpIC0+IGQua2V5KVxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLnNlbGVjdCgnLndrLWNoYXJ0LWxpbmUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7b3B0aW9ucy53aWR0aCArIG9mZnNldH0pcm90YXRlKC05MClcIikgI3JvdGF0ZSBhbmQgcG9zaXRpb24gY2hhcnRcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gYXJlYShkLnZhbHVlKSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC55KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuXG5cblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJzJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpLT5cbiAgc0JhckNudHIgPSAwXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnQSdcbiAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgX2lkID0gXCJiYXJzI3tzQmFyQ250cisrfVwiXG5cbiAgICBiYXJzID0gbnVsbFxuICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuICAgIF9zY2FsZUxpc3QgPSB7fVxuICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuXG4gICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKClcbiAgICBfbWVyZ2UoW10pLmtleSgoZCkgLT4gZC5rZXkpXG5cbiAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAjLS0tIFRvb2x0aXAgRXZlbnQgSGFuZGxlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG5cbiAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICBAbGF5ZXJzLnB1c2goe25hbWU6IF9zY2FsZUxpc3QuY29sb3IuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgdmFsdWU6IF9zY2FsZUxpc3QueC5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBfc2NhbGVMaXN0LmNvbG9yLm1hcChkYXRhLmRhdGEpfX0pXG5cbiAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG5cbiAgICAgIGlmIG5vdCBiYXJzXG4gICAgICAgIGJhcnMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYmFycycpXG4gICAgICAjJGxvZy5sb2cgXCJyZW5kZXJpbmcgc3RhY2tlZC1iYXJcIlxuXG4gICAgICBiYXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgbGF5b3V0ID0gZGF0YS5tYXAoKGQpIC0+IHtkYXRhOmQsIGtleTp5LnZhbHVlKGQpLCB4OngubWFwKGQpLCB5OnkubWFwKGQpLCBjb2xvcjpjb2xvci5tYXAoZCksIGhlaWdodDp5LnNjYWxlKCkucmFuZ2VCYW5kKHkudmFsdWUoZCkpfSlcblxuICAgICAgX21lcmdlKGxheW91dCkuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZ30pLmxhc3Qoe3k6MCwgaGVpZ2h0OmJhck91dGVyUGFkZGluZ09sZCAtIGJhclBhZGRpbmdPbGQgLyAyfSkgICN5LnNjYWxlKCkucmFuZ2UoKVt5LnNjYWxlKCkucmFuZ2UoKS5sZW5ndGgtMV1cblxuICAgICAgYmFycyA9IGJhcnMuZGF0YShsYXlvdXQsIChkKSAtPiBkLmtleSlcblxuICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMilcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSAtPiBpZiBpbml0aWFsIHRoZW4gZC5oZWlnaHQgZWxzZSAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgYmFycy5zdHlsZSgnZmlsbCcsIChkKSAtPiBkLmNvbG9yKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gTWF0aC5taW4oeC5zY2FsZSgpKDApLCBkLngpKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gTWF0aC5hYnMoeC5zY2FsZSgpKDApIC0gZC54KSlcbiAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IF9tZXJnZS5kZWxldGVkU3VjYyhkKS55ICsgX21lcmdlLmRlbGV0ZWRTdWNjKGQpLmhlaWdodCArIGJhclBhZGRpbmcgLyAyKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgIGluaXRpYWwgPSBmYWxzZVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gYmFyUGFkZGluZ1xuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgQGdldEtpbmQoJ3gnKS5kb21haW5DYWxjKCdtYXgnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgX3NlbGVjdGVkID0gaG9zdC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG5cbiAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgIF9zY2FsZUxpc3QueS5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJDbHVzdGVyZWQnLCAoJGxvZywgdXRpbHMsIGJhckNvbmZpZyktPlxuXG4gIGNsdXN0ZXJlZEJhckNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdebGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIF9pZCA9IFwiY2x1c3RlcmVkQmFyI3tjbHVzdGVyZWRCYXJDbnRyKyt9XCJcblxuICAgICAgbGF5ZXJzID0gbnVsbFxuXG4gICAgICBfbWVyZ2UgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQua2V5KVxuICAgICAgX21lcmdlTGF5ZXJzID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmxheWVyS2V5KVxuXG4gICAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gMFxuICAgICAgY29uZmlnID0gYmFyQ29uZmlnXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgdHRMYXllcnMgPSBkYXRhLmxheWVycy5tYXAoKGwpIC0+IHtuYW1lOmwubGF5ZXJLZXksIHZhbHVlOl9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShsLnZhbHVlKSwgY29sb3I6IHsnYmFja2dyb3VuZC1jb2xvcic6IGwuY29sb3J9fSlcbiAgICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnkuYXhpc0xhYmVsKClcbiAgICAgICAgQGhlYWRlclZhbHVlID0gX3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGRhdGEua2V5KVxuICAgICAgICBAbGF5ZXJzID0gQGxheWVycy5jb25jYXQodHRMYXllcnMpXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjJGxvZy5pbmZvIFwicmVuZGVyaW5nIGNsdXN0ZXJlZC1iYXJcIlxuXG4gICAgICAgIGJhclBhZGRpbmcgPSB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5wYWRkaW5nKSAqIGNvbmZpZy5wYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgICAgIyBtYXAgZGF0YSB0byB0aGUgcmlnaHQgZm9ybWF0IGZvciByZW5kZXJpbmdcbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcblxuICAgICAgICBjbHVzdGVyWSA9IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oeC5sYXllcktleXMoZGF0YSkpLnJhbmdlQmFuZHMoWzAsIHkuc2NhbGUoKS5yYW5nZUJhbmQoKV0sIDAsIDApXG5cbiAgICAgICAgY2x1c3RlciA9IGRhdGEubWFwKChkKSAtPiBsID0ge1xuICAgICAgICAgIGtleTp5LnZhbHVlKGQpLCBkYXRhOmQsIHk6eS5tYXAoZCksIGhlaWdodDogeS5zY2FsZSgpLnJhbmdlQmFuZCh5LnZhbHVlKGQpKVxuICAgICAgICAgIGxheWVyczogbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2xheWVyS2V5OiBrLCBjb2xvcjpjb2xvci5zY2FsZSgpKGspLCBrZXk6eS52YWx1ZShkKSwgdmFsdWU6IGRba10sIHk6Y2x1c3RlclkoayksIHg6IHguc2NhbGUoKShkW2tdKSwgd2lkdGg6eC5zY2FsZSgpKGRba10pLCBoZWlnaHQ6Y2x1c3RlclkucmFuZ2VCYW5kKGspfSl9XG4gICAgICAgIClcblxuICAgICAgICBfbWVyZ2UoY2x1c3RlcikuZmlyc3Qoe3k6b3B0aW9ucy5oZWlnaHQgKyBiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgaGVpZ2h0Onkuc2NhbGUoKS5yYW5nZUJhbmQoKX0pLmxhc3Qoe3k6MCwgaGVpZ2h0OmJhck91dGVyUGFkZGluZ09sZCAtIGJhclBhZGRpbmdPbGQgLyAyfSlcbiAgICAgICAgX21lcmdlTGF5ZXJzKGNsdXN0ZXJbMF0ubGF5ZXJzKS5maXJzdCh7eTowLCBoZWlnaHQ6MH0pLmxhc3Qoe3k6Y2x1c3RlclswXS5oZWlnaHQsIGhlaWdodDowfSlcblxuICAgICAgICBpZiBub3QgbGF5ZXJzXG4gICAgICAgICAgbGF5ZXJzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWxheWVyJylcblxuICAgICAgICBsYXllcnMgPSBsYXllcnMuZGF0YShjbHVzdGVyLCAoZCkgLT4gZC5rZXkpXG5cbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGF5ZXInKS5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+XG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgICBcInRyYW5zbGF0ZSgwLCAje2lmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMn0pIHNjYWxlKDEsI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGlmIGluaXRpYWwgdGhlbiAwIGVsc2UgMSlcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje2QueX0pIHNjYWxlKDEsMSlcIilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCAje19tZXJnZS5kZWxldGVkU3VjYyhkKS55ICsgX21lcmdlLmRlbGV0ZWRTdWNjKGQpLmhlaWdodCArIGJhclBhZGRpbmcgLyAyfSkgc2NhbGUoMSwwKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueSBlbHNlIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkueSArIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkuaGVpZ2h0KVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQuaGVpZ2h0IGVsc2UgMClcbiAgICAgICAgICAuYXR0cigneCcsIHguc2NhbGUoKSgwKSlcblxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3Iuc2NhbGUoKShkLmxheWVyS2V5KSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IE1hdGgubWluKHguc2NhbGUoKSgwKSwgZC54KSlcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IE1hdGguYWJzKGQuaGVpZ2h0KSlcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgICMuYXR0cignd2lkdGgnLDApXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkKS55KVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd5JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdiYXJTdGFja2VkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpIC0+XG5cbiAgc3RhY2tlZEJhckNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgU3RhY2tlZCBiYXInXG5cbiAgICAgIF9pZCA9IFwic3RhY2tlZENvbHVtbiN7c3RhY2tlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIHN0YWNrID0gW11cbiAgICAgIF90b29sdGlwID0gKCktPlxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKVxuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICBjb25maWcgPSBiYXJDb25maWdcblxuICAgICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgICB0dExheWVycyA9IGRhdGEubGF5ZXJzLm1hcCgobCkgLT4ge25hbWU6bC5sYXllcktleSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGwudmFsdWUpLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUoZGF0YS5rZXkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUsIHNoYXBlKSAtPlxuXG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKFwiLndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICMkbG9nLmRlYnVnIFwiZHJhd2luZyBzdGFja2VkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHkuc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geS5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICBsYXllcktleXMgPSB4LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHN0YWNrID0gW11cbiAgICAgICAgZm9yIGQgaW4gZGF0YVxuICAgICAgICAgIHgwID0gMFxuICAgICAgICAgIGwgPSB7a2V5OnkudmFsdWUoZCksIGxheWVyczpbXSwgZGF0YTpkLCB5OnkubWFwKGQpLCBoZWlnaHQ6aWYgeS5zY2FsZSgpLnJhbmdlQmFuZCB0aGVuIHkuc2NhbGUoKS5yYW5nZUJhbmQoKSBlbHNlIDF9XG4gICAgICAgICAgaWYgbC55IGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICBsLmxheWVycyA9IGxheWVyS2V5cy5tYXAoKGspIC0+XG4gICAgICAgICAgICAgIGxheWVyID0ge2xheWVyS2V5OmssIGtleTpsLmtleSwgdmFsdWU6ZFtrXSwgd2lkdGg6IHguc2NhbGUoKSgrZFtrXSksIGhlaWdodDogKGlmIHkuc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxKSwgeDogeC5zY2FsZSgpKCt4MCksIGNvbG9yOiBjb2xvci5zY2FsZSgpKGspfVxuICAgICAgICAgICAgICB4MCArPSArZFtrXVxuICAgICAgICAgICAgICByZXR1cm4gbGF5ZXJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobClcblxuICAgICAgICBfbWVyZ2Uoc3RhY2spLmZpcnN0KHt5Om9wdGlvbnMuaGVpZ2h0ICsgYmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmcsIGhlaWdodDowfSkubGFzdCh7eTowLCBoZWlnaHQ6YmFyT3V0ZXJQYWRkaW5nT2xkIC0gYmFyUGFkZGluZ09sZCAvIDJ9KVxuICAgICAgICBfbWVyZ2VMYXllcnMobGF5ZXJLZXlzKVxuXG4gICAgICAgIGxheWVycyA9IGxheWVyc1xuICAgICAgICAgIC5kYXRhKHN0YWNrLCAoZCktPiBkLmtleSlcblxuICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIikuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje2lmIGluaXRpYWwgdGhlbiBkLnkgZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnkgLSBiYXJQYWRkaW5nT2xkIC8gMn0pIHNjYWxlKDEsI3tpZiBpbml0aWFsIHRoZW4gMSBlbHNlIDB9KVwiKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgI3tkLnl9KSBzY2FsZSgxLDEpXCIpLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnkgKyBfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuaGVpZ2h0ICsgYmFyUGFkZGluZyAvIDJ9KSBzY2FsZSgxLDApXCIpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT5cbiAgICAgICAgICAgIGlmIF9tZXJnZS5wcmV2KGQua2V5KVxuICAgICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuYWRkZWRQcmVkKGQubGF5ZXJLZXkpKVxuICAgICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5wcmV2KGQua2V5KS5sYXllcnNbaWR4XS54ICsgX21lcmdlLnByZXYoZC5rZXkpLmxheWVyc1tpZHhdLndpZHRoIGVsc2UgeC5zY2FsZSgpKDApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGQueFxuICAgICAgICAgIClcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgLT4gaWYgX21lcmdlLnByZXYoZC5rZXkpIHRoZW4gMCBlbHNlIGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpIC0+XG4gICAgICAgICAgICBpZHggPSBsYXllcktleXMuaW5kZXhPZihfbWVyZ2VMYXllcnMuZGVsZXRlZFN1Y2MoZC5sYXllcktleSkpXG4gICAgICAgICAgICBpZiBpZHggPj0gMCB0aGVuIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbaWR4XS54IGVsc2UgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ueCArIF9tZXJnZS5jdXJyZW50KGQua2V5KS5sYXllcnNbbGF5ZXJLZXlzLmxlbmd0aCAtIDFdLndpZHRoXG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneCcpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3knKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdidWJibGUnLCAoJGxvZywgdXRpbHMpIC0+XG4gIGJ1YmJsZUNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgIyRsb2cuZGVidWcgJ2J1YmJsZUNoYXJ0IGxpbmtlZCdcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9pZCA9ICdidWJibGUnICsgYnViYmxlQ250cisrXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgZm9yIHNOYW1lLCBzY2FsZSBvZiBfc2NhbGVMaXN0XG4gICAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBzY2FsZS5heGlzTGFiZWwoKSwgdmFsdWU6IHNjYWxlLmZvcm1hdHRlZFZhbHVlKGRhdGEpLCBjb2xvcjogaWYgc05hbWUgaXMgJ2NvbG9yJyB0aGVuIHsnYmFja2dyb3VuZC1jb2xvcic6c2NhbGUubWFwKGRhdGEpfSBlbHNlIHVuZGVmaW5lZH0pXG5cbiAgICAgICMtLS0gRHJhdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplKSAtPlxuXG4gICAgICAgIGJ1YmJsZXMgPSBAc2VsZWN0QWxsKCcud2stY2hhcnQtYnViYmxlJykuZGF0YShkYXRhLCAoZCkgLT4gY29sb3IudmFsdWUoZCkpXG4gICAgICAgIGJ1YmJsZXMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtYnViYmxlIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG4gICAgICAgIGJ1YmJsZXNcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3IubWFwKGQpKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgICAgcjogIChkKSAtPiBzaXplLm1hcChkKVxuICAgICAgICAgICAgICBjeDogKGQpIC0+IHgubWFwKGQpXG4gICAgICAgICAgICAgIGN5OiAoZCkgLT4geS5tYXAoZClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICBidWJibGVzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InLCAnc2l6ZSddKVxuICAgICAgICBAZ2V0S2luZCgneScpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gIH1cbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sdW1uJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpLT5cbiAgc0JhckNudHIgPSAwXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnQSdcbiAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICBob3N0ID0gY29udHJvbGxlci5tZVxuXG4gICAgX2lkID0gXCJzaW1wbGVDb2x1bW4je3NCYXJDbnRyKyt9XCJcblxuICAgIGJhcnMgPSBudWxsXG4gICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgX3NlbGVjdGVkID0gdW5kZWZpbmVkXG4gICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKClcbiAgICBfbWVyZ2UoW10pLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgaW5pdGlhbCA9IHRydWVcbiAgICBiYXJQYWRkaW5nT2xkID0gMFxuICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LnguYXhpc0xhYmVsKClcbiAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgQGxheWVycy5wdXNoKHtuYW1lOiBfc2NhbGVMaXN0LmNvbG9yLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIHZhbHVlOiBfc2NhbGVMaXN0LnkuZm9ybWF0dGVkVmFsdWUoZGF0YS5kYXRhKSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogX3NjYWxlTGlzdC5jb2xvci5tYXAoZGF0YS5kYXRhKX19KVxuXG4gICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuXG4gICAgICBpZiBub3QgYmFyc1xuICAgICAgICBiYXJzID0gQHNlbGVjdEFsbCgnLndrLWNoYXJ0LWJhcnMnKVxuICAgICAgIyRsb2cubG9nIFwicmVuZGVyaW5nIHN0YWNrZWQtYmFyXCJcblxuICAgICAgYmFyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgIGJhck91dGVyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLm91dGVyUGFkZGluZykgKiBjb25maWcub3V0ZXJQYWRkaW5nXG5cbiAgICAgIGxheW91dCA9IGRhdGEubWFwKChkKSAtPiB7ZGF0YTpkLCBrZXk6eC52YWx1ZShkKSwgeDp4Lm1hcChkKSwgeTp5Lm1hcChkKSwgY29sb3I6Y29sb3IubWFwKGQpLCB3aWR0aDp4LnNjYWxlKCkucmFuZ2VCYW5kKHgudmFsdWUoZCkpfSlcblxuICAgICAgX21lcmdlKGxheW91dCkuZmlyc3Qoe3g6YmFyUGFkZGluZ09sZCAvIDIgLSBiYXJPdXRlclBhZGRpbmd9KS5sYXN0KHt4Om9wdGlvbnMud2lkdGggKyBiYXJQYWRkaW5nLzIgLSBiYXJPdXRlclBhZGRpbmdPbGQsIHdpZHRoOiAwfSlcblxuICAgICAgYmFycyA9IGJhcnMuZGF0YShsYXlvdXQsIChkKSAtPiBkLmtleSlcblxuICAgICAgYmFycy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aCAgKyBiYXJQYWRkaW5nT2xkIC8gMilcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGlmIGluaXRpYWwgdGhlbiBkLndpZHRoIGVsc2UgMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbCB0aGVuIDAgZWxzZSAxKVxuICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAuY2FsbChfc2VsZWN0ZWQpXG5cbiAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gZC5jb2xvcikudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IE1hdGgubWluKHkuc2NhbGUoKSgwKSwgZC55KSlcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgLT4gTWF0aC5hYnMoeS5zY2FsZSgpKDApIC0gZC55KSlcbiAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd4JywgKGQpIC0+IF9tZXJnZS5kZWxldGVkU3VjYyhkKS54IC0gYmFyUGFkZGluZyAvIDIpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSBiYXJPdXRlclBhZGRpbmdcblxuICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLnJhbmdlUGFkZGluZyhjb25maWcpLnNjYWxlVHlwZSgnb3JkaW5hbCcpXG4gICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBob3N0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICBhdHRycy4kb2JzZXJ2ZSAncGFkZGluZycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBjb25maWcucGFkZGluZyA9IDBcbiAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IDBcbiAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICBfLm1lcmdlKGNvbmZpZywgYmFyQ29uZmlnKVxuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICBpZiB2YWx1ZXNcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1swXS8xMDBcbiAgICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgY29uZmlnLm91dGVyUGFkZGluZyA9IHZhbHVlc1sxXS8xMDBcbiAgICAgIF9zY2FsZUxpc3QueC5yYW5nZVBhZGRpbmcoY29uZmlnKVxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2NvbHVtbkNsdXN0ZXJlZCcsICgkbG9nLCB1dGlscywgYmFyQ29uZmlnKS0+XG5cbiAgY2x1c3RlcmVkQmFyQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX2lkID0gXCJjbHVzdGVyZWRDb2x1bW4je2NsdXN0ZXJlZEJhckNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpLmtleSgoZCkgLT4gZC5rZXkpXG4gICAgICBfbWVyZ2VMYXllcnMgPSB1dGlscy5tZXJnZURhdGEoKS5rZXkoKGQpIC0+IGQubGF5ZXJLZXkpXG5cbiAgICAgIGJhclBhZGRpbmdPbGQgPSAwXG4gICAgICBiYXJPdXRlclBhZGRpbmdPbGQgPSAwXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICBpbml0aWFsID0gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zY2FsZUxpc3QgPSB7fVxuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgIyRsb2cuaW5mbyBcInJlbmRlcmluZyBjbHVzdGVyZWQtYmFyXCJcblxuICAgICAgICBiYXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcucGFkZGluZykgKiBjb25maWcucGFkZGluZ1xuICAgICAgICBiYXJPdXRlclBhZGRpbmcgPSB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAoMSAtIGNvbmZpZy5vdXRlclBhZGRpbmcpICogY29uZmlnLm91dGVyUGFkZGluZ1xuXG4gICAgICAgICMgbWFwIGRhdGEgdG8gdGhlIHJpZ2h0IGZvcm1hdCBmb3IgcmVuZGVyaW5nXG4gICAgICAgIGxheWVyS2V5cyA9IHkubGF5ZXJLZXlzKGRhdGEpXG5cbiAgICAgICAgY2x1c3RlclggPSBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKHkubGF5ZXJLZXlzKGRhdGEpKS5yYW5nZUJhbmRzKFswLHguc2NhbGUoKS5yYW5nZUJhbmQoKV0sIDAsIDApXG5cbiAgICAgICAgY2x1c3RlciA9IGRhdGEubWFwKChkKSAtPiBsID0ge1xuICAgICAgICAgIGtleTp4LnZhbHVlKGQpLCBkYXRhOmQsIHg6eC5tYXAoZCksIHdpZHRoOiB4LnNjYWxlKCkucmFuZ2VCYW5kKHgudmFsdWUoZCkpXG4gICAgICAgICAgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7bGF5ZXJLZXk6IGssIGNvbG9yOmNvbG9yLnNjYWxlKCkoayksIGtleTp4LnZhbHVlKGQpLCB2YWx1ZTogZFtrXSwgeDpjbHVzdGVyWChrKSwgeTogeS5zY2FsZSgpKGRba10pLCBoZWlnaHQ6eS5zY2FsZSgpKDApIC0geS5zY2FsZSgpKGRba10pLCB3aWR0aDpjbHVzdGVyWC5yYW5nZUJhbmQoayl9KX1cbiAgICAgICAgKVxuXG4gICAgICAgIF9tZXJnZShjbHVzdGVyKS5maXJzdCh7eDpiYXJQYWRkaW5nT2xkIC8gMiAtIGJhck91dGVyUGFkZGluZywgd2lkdGg6MH0pLmxhc3Qoe3g6b3B0aW9ucy53aWR0aCArIGJhclBhZGRpbmcvMiAtIGJhck91dGVyUGFkZGluZ09sZCwgd2lkdGg6MH0pXG4gICAgICAgIF9tZXJnZUxheWVycyhjbHVzdGVyWzBdLmxheWVycykuZmlyc3Qoe3g6MCwgd2lkdGg6MH0pLmxhc3Qoe3g6Y2x1c3RlclswXS53aWR0aCwgd2lkdGg6MH0pXG5cbiAgICAgICAgaWYgbm90IGxheWVyc1xuICAgICAgICAgIGxheWVycyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1sYXllcicpXG5cbiAgICAgICAgbGF5ZXJzID0gbGF5ZXJzLmRhdGEoY2x1c3RlciwgKGQpIC0+IGQua2V5KVxuXG4gICAgICAgIGxheWVycy5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWxheWVyJykuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLChkKSAtPiBcInRyYW5zbGF0ZSgje2lmIGluaXRpYWwgdGhlbiBkLnggZWxzZSBfbWVyZ2UuYWRkZWRQcmVkKGQpLnggKyBfbWVyZ2UuYWRkZWRQcmVkKGQpLndpZHRoICsgYmFyUGFkZGluZ09sZCAvIDJ9LDApIHNjYWxlKCN7aWYgaW5pdGlhbCB0aGVuIDEgZWxzZSAwfSwgMSlcIilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG5cbiAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwwKSBzY2FsZSgxLDEpXCIpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIGxheWVycy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkueCAtIGJhclBhZGRpbmcgLyAyfSwgMCkgc2NhbGUoMCwxKVwiKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgYmFycyA9IGxheWVycy5zZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICAgIC5kYXRhKFxuICAgICAgICAgICAgKGQpIC0+IGQubGF5ZXJzXG4gICAgICAgICAgLCAoZCkgLT4gZC5sYXllcktleSArICd8JyArIGQua2V5XG4gICAgICAgICAgKVxuXG4gICAgICAgIGJhcnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXIgd2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gaWYgaW5pdGlhbCB0aGVuIGQueCBlbHNlIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkueCArIF9tZXJnZUxheWVycy5hZGRlZFByZWQoZCkud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+aWYgaW5pdGlhbCB0aGVuIGQud2lkdGggZWxzZSAwKVxuXG4gICAgICAgIGJhcnMuc3R5bGUoJ2ZpbGwnLCAoZCkgLT4gY29sb3Iuc2NhbGUoKShkLmxheWVyS2V5KSkudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gZC54KVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+IE1hdGgubWluKHkuc2NhbGUoKSgwKSwgZC55KSlcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IE1hdGguYWJzKGQuaGVpZ2h0KSlcblxuICAgICAgICBiYXJzLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLDApXG4gICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgLT4gX21lcmdlTGF5ZXJzLmRlbGV0ZWRTdWNjKGQpLngpXG4gICAgICAgICAgLnJlbW92ZSgpXG5cbiAgICAgICAgaW5pdGlhbCA9IGZhbHNlXG4gICAgICAgIGJhclBhZGRpbmdPbGQgPSBiYXJQYWRkaW5nXG4gICAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IGJhck91dGVyUGFkZGluZ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ21heCcpLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICAgIEBnZXRLaW5kKCd4JykucmVzZXRPbk5ld0RhdGEodHJ1ZSkucmFuZ2VQYWRkaW5nKGNvbmZpZykuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBob3N0LmJlaGF2aW9yKCkudG9vbHRpcFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LngucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdjb2x1bW5TdGFja2VkJywgKCRsb2csIHV0aWxzLCBiYXJDb25maWcpIC0+XG5cbiAgc3RhY2tlZENvbHVtbkNudHIgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGhvc3QgPSBjb250cm9sbGVyLm1lXG4gICAgICAjJGxvZy5sb2cgJ2xpbmtpbmcgU3RhY2tlZCBiYXInXG5cbiAgICAgIF9pZCA9IFwic3RhY2tlZENvbHVtbiN7c3RhY2tlZENvbHVtbkNudHIrK31cIlxuXG4gICAgICBsYXllcnMgPSBudWxsXG5cbiAgICAgIHN0YWNrID0gW11cbiAgICAgIF90b29sdGlwID0gKCktPlxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcblxuICAgICAgYmFyUGFkZGluZ09sZCA9IDBcbiAgICAgIGJhck91dGVyUGFkZGluZ09sZCA9IDBcblxuICAgICAgX21lcmdlID0gdXRpbHMubWVyZ2VEYXRhKCkua2V5KChkKSAtPiBkLmtleSlcbiAgICAgIF9tZXJnZUxheWVycyA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAgIGluaXRpYWwgPSB0cnVlXG5cbiAgICAgIGNvbmZpZyA9IGJhckNvbmZpZ1xuXG4gICAgICB0dEVudGVyID0gKGRhdGEpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gZGF0YS5sYXllcnMubWFwKChsKSAtPiB7bmFtZTpsLmxheWVyS2V5LCB2YWx1ZTpfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUobC52YWx1ZSksIGNvbG9yOiB7J2JhY2tncm91bmQtY29sb3InOiBsLmNvbG9yfX0pXG4gICAgICAgIEBoZWFkZXJOYW1lID0gX3NjYWxlTGlzdC54LmF4aXNMYWJlbCgpXG4gICAgICAgIEBoZWFkZXJWYWx1ZSA9IF9zY2FsZUxpc3QueC5mb3JtYXRWYWx1ZShkYXRhLmtleSlcbiAgICAgICAgQGxheWVycyA9IEBsYXllcnMuY29uY2F0KHR0TGF5ZXJzKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvciwgc2l6ZSwgc2hhcGUpIC0+XG4gICAgICAgIGlmIG5vdCBsYXllcnNcbiAgICAgICAgICBsYXllcnMgPSBAc2VsZWN0QWxsKFwiLmxheWVyXCIpXG4gICAgICAgICMkbG9nLmRlYnVnIFwiZHJhd2luZyBzdGFja2VkLWJhclwiXG5cbiAgICAgICAgYmFyUGFkZGluZyA9IHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvICgxIC0gY29uZmlnLnBhZGRpbmcpICogY29uZmlnLnBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nID0geC5zY2FsZSgpLnJhbmdlQmFuZCgpIC8gKDEgLSBjb25maWcub3V0ZXJQYWRkaW5nKSAqIGNvbmZpZy5vdXRlclBhZGRpbmdcblxuICAgICAgICBsYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHN0YWNrID0gW11cbiAgICAgICAgZm9yIGQgaW4gZGF0YVxuICAgICAgICAgIHkwID0gMFxuICAgICAgICAgIGwgPSB7a2V5OngudmFsdWUoZCksIGxheWVyczpbXSwgZGF0YTpkLCB4OngubWFwKGQpLCB3aWR0aDppZiB4LnNjYWxlKCkucmFuZ2VCYW5kIHRoZW4geC5zY2FsZSgpLnJhbmdlQmFuZCgpIGVsc2UgMX1cbiAgICAgICAgICBpZiBsLnggaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgIGwubGF5ZXJzID0gbGF5ZXJLZXlzLm1hcCgoaykgLT5cbiAgICAgICAgICAgICAgbGF5ZXIgPSB7bGF5ZXJLZXk6aywga2V5Omwua2V5LCB2YWx1ZTpkW2tdLCBoZWlnaHQ6ICB5LnNjYWxlKCkoMCkgLSB5LnNjYWxlKCkoK2Rba10pLCB3aWR0aDogKGlmIHguc2NhbGUoKS5yYW5nZUJhbmQgdGhlbiB4LnNjYWxlKCkucmFuZ2VCYW5kKCkgZWxzZSAxKSwgeTogeS5zY2FsZSgpKCt5MCArICtkW2tdKSwgY29sb3I6IGNvbG9yLnNjYWxlKCkoayl9XG4gICAgICAgICAgICAgIHkwICs9ICtkW2tdXG4gICAgICAgICAgICAgIHJldHVybiBsYXllclxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgc3RhY2sucHVzaChsKVxuXG4gICAgICAgIF9tZXJnZShzdGFjaykuZmlyc3Qoe3g6IGJhclBhZGRpbmdPbGQgLyAyIC0gYmFyT3V0ZXJQYWRkaW5nLCB3aWR0aDowfSkubGFzdCh7eDpvcHRpb25zLndpZHRoICsgYmFyUGFkZGluZy8yIC0gYmFyT3V0ZXJQYWRkaW5nT2xkLCB3aWR0aDowfSlcbiAgICAgICAgX21lcmdlTGF5ZXJzKGxheWVyS2V5cylcblxuICAgICAgICBsYXllcnMgPSBsYXllcnNcbiAgICAgICAgICAuZGF0YShzdGFjaywgKGQpLT4gZC5rZXkpXG5cbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCkgLT4gXCJ0cmFuc2xhdGUoI3tpZiBpbml0aWFsIHRoZW4gZC54IGVsc2UgX21lcmdlLmFkZGVkUHJlZChkKS54ICsgX21lcmdlLmFkZGVkUHJlZChkKS53aWR0aCArIGJhclBhZGRpbmdPbGQgLyAyfSwwKSBzY2FsZSgje2lmIGluaXRpYWwgdGhlbiAxIGVsc2UgMH0sIDEpXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JyxpZiBpbml0aWFsIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcblxuICAgICAgICBsYXllcnNcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7ZC54fSwwKSBzY2FsZSgxLDEpXCIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBsYXllcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsKGQpIC0+IFwidHJhbnNsYXRlKCN7X21lcmdlLmRlbGV0ZWRTdWNjKGQpLnggLSBiYXJQYWRkaW5nIC8gMn0sIDApIHNjYWxlKDAsMSlcIilcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGJhcnMgPSBsYXllcnMuc2VsZWN0QWxsKCcud2stY2hhcnQtYmFyJylcbiAgICAgICAgICAuZGF0YShcbiAgICAgICAgICAgIChkKSAtPiBkLmxheWVyc1xuICAgICAgICAgICwgKGQpIC0+IGQubGF5ZXJLZXkgKyAnfCcgKyBkLmtleVxuICAgICAgICAgIClcblxuICAgICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQpIC0+XG4gICAgICAgICAgICBpZiBfbWVyZ2UucHJldihkLmtleSlcbiAgICAgICAgICAgICAgaWR4ID0gbGF5ZXJLZXlzLmluZGV4T2YoX21lcmdlTGF5ZXJzLmFkZGVkUHJlZChkLmxheWVyS2V5KSlcbiAgICAgICAgICAgICAgaWYgaWR4ID49IDAgdGhlbiBfbWVyZ2UucHJldihkLmtleSkubGF5ZXJzW2lkeF0ueSBlbHNlIHkuc2NhbGUoKSgwKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBkLnlcbiAgICAgICAgICApXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsKGQpIC0+IGQuaGVpZ2h0KVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcblxuICAgICAgICBiYXJzLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT4gZC55KVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpIC0+IGQud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpIC0+IGQuaGVpZ2h0KVxuXG4gICAgICAgIGJhcnMuZXhpdCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLDApXG4gICAgICAgICAgLmF0dHIoJ3knLCAoZCkgLT5cbiAgICAgICAgICAgIGlkeCA9IGxheWVyS2V5cy5pbmRleE9mKF9tZXJnZUxheWVycy5kZWxldGVkU3VjYyhkLmxheWVyS2V5KSlcbiAgICAgICAgICAgIGlmIGlkeCA+PSAwIHRoZW4gX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tpZHhdLnkgKyBfbWVyZ2UuY3VycmVudChkLmtleSkubGF5ZXJzW2lkeF0uaGVpZ2h0IGVsc2UgX21lcmdlLmN1cnJlbnQoZC5rZXkpLmxheWVyc1tsYXllcktleXMubGVuZ3RoIC0gMV0ueVxuICAgICAgICAgIClcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICBpbml0aWFsID0gZmFsc2VcbiAgICAgICAgYmFyUGFkZGluZ09sZCA9IGJhclBhZGRpbmdcbiAgICAgICAgYmFyT3V0ZXJQYWRkaW5nT2xkID0gYmFyT3V0ZXJQYWRkaW5nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvciddKVxuICAgICAgICBAZ2V0S2luZCgneScpLmRvbWFpbkNhbGMoJ3RvdGFsJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5yYW5nZVBhZGRpbmcoY29uZmlnKS5zY2FsZVR5cGUoJ29yZGluYWwnKVxuICAgICAgICBAbGF5ZXJTY2FsZSgnY29sb3InKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF9zZWxlY3RlZCA9IGhvc3QuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBkcmF3XG5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3BhZGRpbmcnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gMFxuICAgICAgICAgIGNvbmZpZy5vdXRlclBhZGRpbmcgPSAwXG4gICAgICAgIGVsc2UgaWYgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF8ubWVyZ2UoY29uZmlnLCBiYXJDb25maWcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZXMgPSB1dGlscy5wYXJzZUxpc3QodmFsKVxuICAgICAgICAgIGlmIHZhbHVlc1xuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgaWYgdmFsdWVzLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgIGNvbmZpZy5wYWRkaW5nID0gdmFsdWVzWzBdLzEwMFxuICAgICAgICAgICAgICBjb25maWcub3V0ZXJQYWRkaW5nID0gdmFsdWVzWzFdLzEwMFxuICAgICAgICBfc2NhbGVMaXN0LnkucmFuZ2VQYWRkaW5nKGNvbmZpZylcbiAgICAgICAgaG9zdC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdnYXVnZScsICgkbG9nLCB1dGlscykgLT5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG4gICAgY29udHJvbGxlcjogKCRzY29wZSwgJGF0dHJzKSAtPlxuICAgICAgbWUgPSB7Y2hhcnRUeXBlOiAnR2F1Z2VDaGFydCcsIGlkOnV0aWxzLmdldElkKCl9XG4gICAgICAkYXR0cnMuJHNldCgnY2hhcnQtaWQnLCBtZS5pZClcbiAgICAgIHJldHVybiBtZVxuICAgIFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBsYXlvdXQgPSBjb250cm9sbGVyLm1lXG5cbiAgICAgIGluaXRhbFNob3cgPSB0cnVlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAkbG9nLmluZm8gJ2RyYXdpbmcgR2F1Z2UgQ2hhcnQnXG5cbiAgICAgICAgZGF0ID0gW2RhdGFdXG5cbiAgICAgICAgeURvbWFpbiA9IHkuc2NhbGUoKS5kb21haW4oKVxuICAgICAgICBjb2xvckRvbWFpbiA9IGFuZ3VsYXIuY29weShjb2xvci5zY2FsZSgpLmRvbWFpbigpKVxuICAgICAgICBjb2xvckRvbWFpbi51bnNoaWZ0KHlEb21haW5bMF0pXG4gICAgICAgIGNvbG9yRG9tYWluLnB1c2goeURvbWFpblsxXSlcbiAgICAgICAgcmFuZ2VzID0gW11cbiAgICAgICAgZm9yIGkgaW4gWzEuLmNvbG9yRG9tYWluLmxlbmd0aC0xXVxuICAgICAgICAgIHJhbmdlcy5wdXNoIHtmcm9tOitjb2xvckRvbWFpbltpLTFdLHRvOitjb2xvckRvbWFpbltpXX1cblxuICAgICAgICAjZHJhdyBjb2xvciBzY2FsZVxuXG4gICAgICAgIGJhciA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1iYXInKVxuICAgICAgICBiYXIgPSBiYXIuZGF0YShyYW5nZXMsIChkLCBpKSAtPiBpKVxuICAgICAgICBpZiBpbml0YWxTaG93XG4gICAgICAgICAgYmFyLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMCkuYXR0cignd2lkdGgnLCA1MClcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiYXIuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKS5hdHRyKCd3aWR0aCcsIDUwKVxuXG4gICAgICAgIGJhci50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywoZCkgLT4geS5zY2FsZSgpKDApIC0geS5zY2FsZSgpKGQudG8gLSBkLmZyb20pKVxuICAgICAgICAgIC5hdHRyKCd5JywoZCkgLT4geS5zY2FsZSgpKGQudG8pKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPiBjb2xvci5zY2FsZSgpKGQuZnJvbSkpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcblxuICAgICAgICBiYXIuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgIyBkcmF3IHZhbHVlXG5cbiAgICAgICAgYWRkTWFya2VyID0gKHMpIC0+XG4gICAgICAgICAgcy5hcHBlbmQoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIDU1KS5hdHRyKCdoZWlnaHQnLCA0KS5zdHlsZSgnZmlsbCcsICdibGFjaycpXG4gICAgICAgICAgcy5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ3InLCAxMCkuYXR0cignY3gnLCA2NSkuYXR0cignY3knLDIpLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuXG4gICAgICAgIG1hcmtlciA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1tYXJrZXInKVxuICAgICAgICBtYXJrZXIgPSBtYXJrZXIuZGF0YShkYXQsIChkKSAtPiAnd2stY2hhcnQtbWFya2VyJylcbiAgICAgICAgbWFya2VyLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1tYXJrZXInKS5jYWxsKGFkZE1hcmtlcilcblxuICAgICAgICBpZiBpbml0YWxTaG93XG4gICAgICAgICAgbWFya2VyLmF0dHIoJ3RyYW5zZm9ybScsIChkKSAtPiBcInRyYW5zbGF0ZSgwLCN7eS5zY2FsZSgpKGQudmFsdWUpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAwKVxuXG4gICAgICAgIG1hcmtlclxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgLT4gXCJ0cmFuc2xhdGUoMCwje3kuc2NhbGUoKShkLnZhbHVlKX0pXCIpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLChkKSAtPiBjb2xvci5zY2FsZSgpKGQudmFsdWUpKS5zdHlsZSgnb3BhY2l0eScsIDEpXG5cbiAgICAgICAgaW5pdGFsU2hvdyA9IGZhbHNlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgdGhpcy5yZXF1aXJlZFNjYWxlcyhbJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGdldEtpbmQoJ2NvbG9yJykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5kaXJlY3RpdmUgJ2dlb01hcCcsICgkbG9nLCB1dGlscykgLT5cbiAgbWFwQ250ciA9IDBcblxuICBwYXJzZUxpc3QgPSAodmFsKSAtPlxuICAgIGlmIHZhbFxuICAgICAgbCA9IHZhbC50cmltKCkucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKS5zcGxpdCgnLCcpLm1hcCgoZCkgLT4gZC5yZXBsYWNlKC9eW1xcXCJ8J118W1xcXCJ8J10kL2csICcnKSlcbiAgICAgIGwgPSBsLm1hcCgoZCkgLT4gaWYgaXNOYU4oZCkgdGhlbiBkIGVsc2UgK2QpXG4gICAgICByZXR1cm4gaWYgbC5sZW5ndGggaXMgMSB0aGVuIHJldHVybiBsWzBdIGVsc2UgbFxuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJ1xuICAgIHJlcXVpcmU6ICdsYXlvdXQnXG4gICAgc2NvcGU6IHtcbiAgICAgIGdlb2pzb246ICc9J1xuICAgICAgcHJvamVjdGlvbjogJz0nXG4gICAgfVxuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICAgX3Rvb2x0aXAgPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBfaWQgPSAnZ2VvTWFwJyArIG1hcENudHIrK1xuICAgICAgX2RhdGFNYXBwaW5nID0gZDMubWFwKClcblxuICAgICAgX3NjYWxlID0gMVxuICAgICAgX3JvdGF0ZSA9IFswLDBdXG4gICAgICBfaWRQcm9wID0gJydcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cblxuICAgICAgICB2YWwgPSBfZGF0YU1hcHBpbmcuZ2V0KGRhdGEucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgQGxheWVycy5wdXNoKHtuYW1lOnZhbC5SUywgdmFsdWU6dmFsLkRFU30pXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcGF0aFNlbCA9IFtdXG5cbiAgICAgIF9wcm9qZWN0aW9uID0gZDMuZ2VvLm9ydGhvZ3JhcGhpYygpXG4gICAgICBfd2lkdGggPSAwXG4gICAgICBfaGVpZ2h0ID0gMFxuICAgICAgX3BhdGggPSB1bmRlZmluZWRcbiAgICAgIF96b29tID0gZDMuZ2VvLnpvb20oKVxuICAgICAgICAucHJvamVjdGlvbihfcHJvamVjdGlvbilcbiAgICAgICAgIy5zY2FsZUV4dGVudChbcHJvamVjdGlvbi5zY2FsZSgpICogLjcsIHByb2plY3Rpb24uc2NhbGUoKSAqIDEwXSlcbiAgICAgICAgLm9uIFwiem9vbS5yZWRyYXdcIiwgKCkgLT5cbiAgICAgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHBhdGhTZWwuYXR0cihcImRcIiwgX3BhdGgpO1xuXG4gICAgICBfZ2VvSnNvbiA9IHVuZGVmaW5lZFxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yKSAtPlxuICAgICAgICBfd2lkdGggPSBvcHRpb25zLndpZHRoXG4gICAgICAgIF9oZWlnaHQgPSBvcHRpb25zLmhlaWdodFxuICAgICAgICBpZiBkYXRhIGFuZCBkYXRhWzBdLmhhc093blByb3BlcnR5KF9pZFByb3BbMV0pXG4gICAgICAgICAgZm9yIGUgaW4gZGF0YVxuICAgICAgICAgICAgX2RhdGFNYXBwaW5nLnNldChlW19pZFByb3BbMV1dLCBlKVxuXG4gICAgICAgIGlmIF9nZW9Kc29uXG5cbiAgICAgICAgICBfcHJvamVjdGlvbi50cmFuc2xhdGUoW193aWR0aC8yLCBfaGVpZ2h0LzJdKVxuICAgICAgICAgIHBhdGhTZWwgPSB0aGlzLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShfZ2VvSnNvbi5mZWF0dXJlcywgKGQpIC0+IGQucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgICBwYXRoU2VsXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJzdmc6cGF0aFwiKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCdsaWdodGdyZXknKS5zdHlsZSgnc3Ryb2tlJywgJ2RhcmtncmV5JylcbiAgICAgICAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuICAgICAgICAgICAgICAuY2FsbChfem9vbSlcblxuICAgICAgICAgIHBhdGhTZWxcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBfcGF0aClcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChkKSAtPlxuICAgICAgICAgICAgICB2YWwgPSBfZGF0YU1hcHBpbmcuZ2V0KGQucHJvcGVydGllc1tfaWRQcm9wWzBdXSlcbiAgICAgICAgICAgICAgY29sb3IubWFwKHZhbClcbiAgICAgICAgICApXG5cbiAgICAgICAgICBwYXRoU2VsLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ2NvbG9yJ10pXG4gICAgICAgIF9zY2FsZUxpc3QuY29sb3IucmVzZXRPbk5ld0RhdGEodHJ1ZSlcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICBfc2VsZWN0ZWQgPSBsYXlvdXQuYmVoYXZpb3IoKS5zZWxlY3RlZFxuICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICAjIEdlb01hcCBzcGVjaWZpYyBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NvcGUuJHdhdGNoICdwcm9qZWN0aW9uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgJGxvZy5sb2cgJ3NldHRpbmcgUHJvamVjdGlvbiBwYXJhbXMnLCB2YWxcbiAgICAgICAgICBpZiBkMy5nZW8uaGFzT3duUHJvcGVydHkodmFsLnByb2plY3Rpb24pXG4gICAgICAgICAgICBfcHJvamVjdGlvbiA9IGQzLmdlb1t2YWwucHJvamVjdGlvbl0oKVxuICAgICAgICAgICAgX3Byb2plY3Rpb24uY2VudGVyKHZhbC5jZW50ZXIpLnNjYWxlKHZhbC5zY2FsZSkucm90YXRlKHZhbC5yb3RhdGUpLmNsaXBBbmdsZSh2YWwuY2xpcEFuZ2xlKVxuICAgICAgICAgICAgX2lkUHJvcCA9IHZhbC5pZE1hcFxuICAgICAgICAgICAgaWYgX3Byb2plY3Rpb24ucGFyYWxsZWxzXG4gICAgICAgICAgICAgIF9wcm9qZWN0aW9uLnBhcmFsbGVscyh2YWwucGFyYWxsZWxzKVxuICAgICAgICAgICAgX3NjYWxlID0gX3Byb2plY3Rpb24uc2NhbGUoKVxuICAgICAgICAgICAgX3JvdGF0ZSA9IF9wcm9qZWN0aW9uLnJvdGF0ZSgpXG4gICAgICAgICAgICBfcGF0aCA9IGQzLmdlby5wYXRoKCkucHJvamVjdGlvbihfcHJvamVjdGlvbilcbiAgICAgICAgICAgIF96b29tLnByb2plY3Rpb24oX3Byb2plY3Rpb24pXG5cbiAgICAgICAgICAgIGxheW91dC5saWZlQ3ljbGUoKS51cGRhdGUoKVxuXG4gICAgICAsIHRydWUgI2RlZXAgd2F0Y2hcblxuICAgICAgc2NvcGUuJHdhdGNoICdnZW9qc29uJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkIGFuZCB2YWwgaXNudCAnJ1xuICAgICAgICAgIF9nZW9Kc29uID0gdmFsXG4gICAgICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLnVwZGF0ZSgpXG5cblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdsaW5lJywgKCRsb2csIGJlaGF2aW9yLCB1dGlscywgdGltaW5nKSAtPlxuICBsaW5lQ250ciA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ2xheW91dCdcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgICAgaG9zdCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmxvZyAnbGlua2luZyBzLWxpbmUnXG4gICAgICBfbGF5ZXJLZXlzID0gW11cbiAgICAgIF9sYXlvdXQgPSBbXVxuICAgICAgX2RhdGFPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBbXVxuICAgICAgX3BhdGhWYWx1ZXNOZXcgPSBbXVxuICAgICAgX3BhdGhBcnJheSA9IFtdXG4gICAgICBfaW5pdGlhbE9wYWNpdHkgPSAwXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG4gICAgICBsaW5lID0gdW5kZWZpbmVkXG4gICAgICBtYXJrZXJzID0gdW5kZWZpbmVkXG5cbiAgICAgIGJydXNoTGluZSA9IHVuZGVmaW5lZFxuXG5cbiAgICAgICMtLS0gVG9vbHRpcCBFdmVudCBIYW5kbGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB0dEVudGVyID0gKGlkeCkgLT5cbiAgICAgICAgX3BhdGhBcnJheSA9IF8udG9BcnJheShfcGF0aFZhbHVlc05ldylcbiAgICAgICAgdHRNb3ZlRGF0YS5hcHBseSh0aGlzLCBbaWR4XSlcblxuICAgICAgdHRNb3ZlRGF0YSA9IChpZHgpIC0+XG4gICAgICAgIHR0TGF5ZXJzID0gX3BhdGhBcnJheS5tYXAoKGwpIC0+IHtuYW1lOmxbaWR4XS5rZXksIHZhbHVlOl9zY2FsZUxpc3QueS5mb3JtYXRWYWx1ZShsW2lkeF0ueXYpLCBjb2xvcjp7J2JhY2tncm91bmQtY29sb3InOiBsW2lkeF0uY29sb3J9LCB4djpsW2lkeF0ueHZ9KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueC5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnguZm9ybWF0VmFsdWUodHRMYXllcnNbMF0ueHYpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpLmRhdGEoX3BhdGhBcnJheSwgKGQpIC0+IGRbaWR4XS5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKCdjbGFzcycsXCJ3ay1jaGFydC1tYXJrZXItI3tfaWR9XCIpXG4gICAgICAgICAgLmF0dHIoJ3InLCBpZiBfc2hvd01hcmtlcnMgdGhlbiA4IGVsc2UgNSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkW2lkeF0uY29sb3IpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjYpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgX2NpcmNsZXMuYXR0cignY3knLCAoZCkgLT4gZFtpZHhdLnkpXG4gICAgICAgIF9jaXJjbGVzLmV4aXQoKS5yZW1vdmUoKVxuICAgICAgICB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X3BhdGhBcnJheVswXVtpZHhdLnggKyBvZmZzZXR9KVwiKVxuXG4gICAgICAjLS0tIERyYXcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cblxuICAgICAgICBtZXJnZWRYID0gdXRpbHMubWVyZ2VTZXJpZXMoeC52YWx1ZShfZGF0YU9sZCksIHgudmFsdWUoZGF0YSkpXG4gICAgICAgIF9sYXllcktleXMgPSB5LmxheWVyS2V5cyhkYXRhKVxuICAgICAgICBfbGF5b3V0ID0gW11cblxuICAgICAgICBfcGF0aFZhbHVlc05ldyA9IHt9XG5cbiAgICAgICAgZm9yIGtleSBpbiBfbGF5ZXJLZXlzXG4gICAgICAgICAgX3BhdGhWYWx1ZXNOZXdba2V5XSA9IGRhdGEubWFwKChkKS0+IHt4OngubWFwKGQpLHk6eS5zY2FsZSgpKHkubGF5ZXJWYWx1ZShkLCBrZXkpKSwgeHY6eC52YWx1ZShkKSwgeXY6eS5sYXllclZhbHVlKGQsa2V5KSwga2V5OmtleSwgY29sb3I6Y29sb3Iuc2NhbGUoKShrZXkpfSlcblxuICAgICAgICAgIGxheWVyID0ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6W119XG4gICAgICAgICAgIyBmaW5kIHN0YXJ0aW5nIHZhbHVlIGZvciBvbGRcbiAgICAgICAgICBpID0gMFxuICAgICAgICAgIHdoaWxlIGkgPCBtZXJnZWRYLmxlbmd0aFxuICAgICAgICAgICAgaWYgbWVyZ2VkWFtpXVswXSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICBvbGRMYXN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVttZXJnZWRYW2ldWzBdXVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICB3aGlsZSBpIDwgbWVyZ2VkWC5sZW5ndGhcbiAgICAgICAgICAgIGlmIG1lcmdlZFhbaV1bMV0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgbmV3TGFzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bbWVyZ2VkWFtpXVsxXV1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgZm9yIHZhbCwgaSBpbiBtZXJnZWRYXG4gICAgICAgICAgICB2ID0ge2NvbG9yOmxheWVyLmNvbG9yLCB4OnZhbFsyXX1cbiAgICAgICAgICAgICMgc2V0IHggYW5kIHkgdmFsdWVzIGZvciBvbGQgdmFsdWVzLiBJZiB0aGVyZSBpcyBhIGFkZGVkIHZhbHVlLCBtYWludGFpbiB0aGUgbGFzdCB2YWxpZCBwb3NpdGlvblxuICAgICAgICAgICAgaWYgdmFsWzFdIGlzIHVuZGVmaW5lZCAjaWUgYW4gb2xkIHZhbHVlIGlzIGRlbGV0ZWQsIG1haW50YWluIHRoZSBsYXN0IG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICB2LnlOZXcgPSBfcGF0aFZhbHVlc09sZFtrZXldW3ZhbFswXV0ueVxuICAgICAgICAgICAgICB2LnhOZXcgPSBuZXdMYXN0LnggIyBhbmltYXRlIHRvIHRoZSBwcmVkZXNlc3NvcnMgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgIHYuZGVsZXRlZCA9IHRydWVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdi55TmV3ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnlcbiAgICAgICAgICAgICAgdi54TmV3ID0gX3BhdGhWYWx1ZXNOZXdba2V5XVt2YWxbMV1dLnhcbiAgICAgICAgICAgICAgbmV3TGFzdCA9IF9wYXRoVmFsdWVzTmV3W2tleV1bdmFsWzFdXVxuICAgICAgICAgICAgICB2LmRlbGV0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiBfZGF0YU9sZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgIGlmICB2YWxbMF0gaXMgdW5kZWZpbmVkICMgaWUgYSBuZXcgdmFsdWUgaGFzIGJlZW4gYWRkZWRcbiAgICAgICAgICAgICAgICB2LnlPbGQgPSBfcGF0aFZhbHVlc05ld1trZXldW3ZhbFsxXV0ueVxuICAgICAgICAgICAgICAgIHYueE9sZCA9IG9sZExhc3QueCAjIHN0YXJ0IHgtYW5pbWF0aW9uIGZyb20gdGhlIHByZWRlY2Vzc29ycyBvbGQgcG9zaXRpb25cbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHYueU9sZCA9IF9wYXRoVmFsdWVzT2xkW2tleV1bdmFsWzBdXS55XG4gICAgICAgICAgICAgICAgdi54T2xkID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dLnhcbiAgICAgICAgICAgICAgICBvbGRMYXN0ID0gX3BhdGhWYWx1ZXNPbGRba2V5XVt2YWxbMF1dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHYueE9sZCA9IHYueE5ld1xuICAgICAgICAgICAgICB2LnlPbGQgPSB2LnlOZXdcblxuXG4gICAgICAgICAgICBsYXllci52YWx1ZS5wdXNoKHYpXG5cbiAgICAgICAgICBfbGF5b3V0LnB1c2gobGF5ZXIpXG5cbiAgICAgICAgb2Zmc2V0ID0gaWYgeC5pc09yZGluYWwoKSB0aGVuIHguc2NhbGUoKS5yYW5nZUJhbmQoKSAvIDIgZWxzZSAwXG5cbiAgICAgICAgaWYgX3Rvb2x0aXAgdGhlbiBfdG9vbHRpcC5kYXRhKGRhdGEpXG5cbiAgICAgICAgbWFya2VycyA9IChsYXllciwgZHVyYXRpb24pIC0+XG4gICAgICAgICAgaWYgX3Nob3dNYXJrZXJzXG4gICAgICAgICAgICBtID0gbGF5ZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtbWFya2VyJykuZGF0YShcbiAgICAgICAgICAgICAgICAobCkgLT4gbC52YWx1ZVxuICAgICAgICAgICAgICAsIChkKSAtPiBkLnhcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIG0uZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbWFya2VyIHdrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICAgICAgICAuYXR0cigncicsIDUpXG4gICAgICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCdub25lJylcbiAgICAgICAgICAgICAgIy5zdHlsZSgnb3BhY2l0eScsIF9pbml0aWFsT3BhY2l0eSlcbiAgICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+IGQuY29sb3IpXG4gICAgICAgICAgICBtXG4gICAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSAtPiBkLnlPbGQpXG4gICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkKSAtPiBkLnhPbGQgKyBvZmZzZXQpXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCd3ay1jaGFydC1kZWxldGVkJywoZCkgLT4gZC5kZWxldGVkKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpIC0+IGQueU5ldylcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpIC0+IGQueE5ldyArIG9mZnNldClcbiAgICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQpIC0+IGlmIGQuZGVsZXRlZCB0aGVuIDAgZWxzZSAxKVxuXG4gICAgICAgICAgICBtLmV4aXQoKVxuICAgICAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxheWVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LW1hcmtlcicpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbikuc3R5bGUoJ29wYWNpdHknLCAwKS5yZW1vdmUoKVxuXG4gICAgICAgIGxpbmVPbGQgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IGQueE9sZClcbiAgICAgICAgICAueSgoZCkgLT4gZC55T2xkKVxuXG4gICAgICAgIGxpbmVOZXcgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IGQueE5ldylcbiAgICAgICAgICAueSgoZCkgLT4gZC55TmV3KVxuXG4gICAgICAgIGJydXNoTGluZSA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAueCgoZCkgLT4geC5zY2FsZSgpKGQueCkpXG4gICAgICAgICAgLnkoKGQpIC0+IGQueU5ldylcblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgZW50ZXIgPSBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIFwid2stY2hhcnQtbGF5ZXJcIilcbiAgICAgICAgZW50ZXIuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cignZCcsIChkKSAtPiBsaW5lTmV3KGQudmFsdWUpKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIF9pbml0aWFsT3BhY2l0eSlcbiAgICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXG4gICAgICAgIGxheWVycy5zZWxlY3QoJy53ay1jaGFydC1saW5lJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tvZmZzZXR9KVwiKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmVPbGQoZC52YWx1ZSkpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGxpbmVOZXcoZC52YWx1ZSkpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKS5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG5cbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAgIGxheWVycy5jYWxsKG1hcmtlcnMsIG9wdGlvbnMuZHVyYXRpb24pXG5cbiAgICAgICAgX2luaXRpYWxPcGFjaXR5ID0gMFxuICAgICAgICBfZGF0YU9sZCA9IGRhdGFcbiAgICAgICAgX3BhdGhWYWx1ZXNPbGQgPSBfcGF0aFZhbHVlc05ld1xuXG4gICAgICBicnVzaCA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgbGF5ZXJzID0gdGhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtbGluZVwiKVxuICAgICAgICAgIC5hdHRyKCdkJywgKGQpIC0+IGJydXNoTGluZShkLnZhbHVlKSlcbiAgICAgICAgbGF5ZXJzLmNhbGwobWFya2VycywgMClcblxuICAgICAgIy0tLSBDb25maWd1cmF0aW9uIGFuZCByZWdpc3RyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICAgIF9zY2FsZUxpc3QgPSBAZ2V0U2NhbGVzKFsneCcsICd5JywgJ2NvbG9yJ10pXG4gICAgICAgIEBsYXllclNjYWxlKCdjb2xvcicpXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGhvc3QuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm1hcmtlclNjYWxlKF9zY2FsZUxpc3QueClcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuICAgICAgICBfdG9vbHRpcC5vbiBcIm1vdmVEYXRhLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZU1hcmtlci4je19pZH1cIiwgdHRNb3ZlTWFya2VyXG5cbiAgICAgIGhvc3QubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gICAgICBob3N0LmxpZmVDeWNsZSgpLm9uICdicnVzaERyYXcnLCBicnVzaFxuXG4gICAgICAjLS0tIFByb3BlcnR5IE9ic2VydmVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ21hcmtlcnMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJ1xuICAgICAgICAgIF9zaG93TWFya2VycyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VycyA9IGZhbHNlXG4gICAgICAgIGhvc3QubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnbGluZVZlcnRpY2FsJywgKCRsb2cpIC0+XG4gIGxpbmVDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIC0+XG4gICAgICBob3N0ID0gY29udHJvbGxlci5tZVxuICAgICAgIyRsb2cubG9nICdsaW5raW5nIHMtbGluZSdcbiAgICAgIGxheWVyS2V5cyA9IFtdXG4gICAgICBfbGF5b3V0ID0gW11cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfdHRIaWdobGlnaHQgPSB1bmRlZmluZWRcbiAgICAgIF9jaXJjbGVzID0gdW5kZWZpbmVkXG4gICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuICAgICAgX3NjYWxlTGlzdCA9IHt9XG4gICAgICBvZmZzZXQgPSAwXG4gICAgICBfaWQgPSAnbGluZScgKyBsaW5lQ250cisrXG5cbiAgICAgIHByZXBEYXRhID0gKHgsIHksIGNvbG9yKSAtPlxuICAgICAgICAjbGF5ZXJLZXlzID0geS5sYXllcktleXMoQClcbiAgICAgICAgI19sYXlvdXQgPSBsYXllcktleXMubWFwKChrZXkpID0+IHtrZXk6a2V5LCBjb2xvcjpjb2xvci5zY2FsZSgpKGtleSksIHZhbHVlOkBtYXAoKGQpLT4ge3g6eC52YWx1ZShkKSx5OnkubGF5ZXJWYWx1ZShkLCBrZXkpfSl9KVxuXG4gICAgICB0dEVudGVyID0gKGlkeCwgYXhpc1gsIGNudG5yKSAtPlxuICAgICAgICBjbnRuclNlbCA9IGQzLnNlbGVjdChjbnRucilcbiAgICAgICAgY250bnJXaWR0aCA9IGNudG5yU2VsLmF0dHIoJ3dpZHRoJylcbiAgICAgICAgcGFyZW50ID0gZDMuc2VsZWN0KGNudG5yLnBhcmVudEVsZW1lbnQpXG4gICAgICAgIF90dEhpZ2hsaWdodCA9IHBhcmVudC5hcHBlbmQoJ2cnKVxuICAgICAgICBfdHRIaWdobGlnaHQuYXBwZW5kKCdsaW5lJykuYXR0cih7eDE6MCwgeDI6Y250bnJXaWR0aH0pLnN0eWxlKHsncG9pbnRlci1ldmVudHMnOidub25lJywgc3Ryb2tlOidsaWdodGdyZXknLCAnc3Ryb2tlLXdpZHRoJzoxfSlcbiAgICAgICAgX2NpcmNsZXMgPSBfdHRIaWdobGlnaHQuc2VsZWN0QWxsKCdjaXJjbGUnKS5kYXRhKF9sYXlvdXQsKGQpIC0+IGQua2V5KVxuICAgICAgICBfY2lyY2xlcy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJykuYXR0cigncicsIDUpLmF0dHIoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKS5hdHRyKCdmaWxsLW9wYWNpdHknLCAwLjYpLmF0dHIoJ3N0cm9rZScsICdibGFjaycpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKVxuXG4gICAgICAgIF90dEhpZ2hsaWdodC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7X3NjYWxlTGlzdC55LnNjYWxlKCkoX2xheW91dFswXS52YWx1ZVtpZHhdLnkpK29mZnNldH0pXCIpXG5cbiAgICAgIHR0TW92ZURhdGEgPSAoaWR4KSAtPlxuICAgICAgICB0dExheWVycyA9IF9sYXlvdXQubWFwKChsKSAtPiB7bmFtZTpsLmtleSwgdmFsdWU6X3NjYWxlTGlzdC54LmZvcm1hdFZhbHVlKGwudmFsdWVbaWR4XS54KSwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzogbC5jb2xvcn19KVxuICAgICAgICBAaGVhZGVyTmFtZSA9IF9zY2FsZUxpc3QueS5heGlzTGFiZWwoKVxuICAgICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnkuZm9ybWF0VmFsdWUoX2xheW91dFswXS52YWx1ZVtpZHhdLnkpXG4gICAgICAgIEBsYXllcnMgPSBAbGF5ZXJzLmNvbmNhdCh0dExheWVycylcblxuICAgICAgdHRNb3ZlTWFya2VyID0gKGlkeCkgLT5cbiAgICAgICAgX2NpcmNsZXMgPSB0aGlzLnNlbGVjdEFsbCgnY2lyY2xlJykuZGF0YShfbGF5b3V0LCAoZCkgLT4gZC5rZXkpXG4gICAgICAgIF9jaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAuYXR0cigncicsIGlmIF9zaG93TWFya2VycyB0aGVuIDggZWxzZSA1KVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCktPiBkLmNvbG9yKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNilcbiAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnbm9uZScpXG4gICAgICAgIF9jaXJjbGVzLmF0dHIoJ2N4JywgKGQpIC0+IF9zY2FsZUxpc3QueC5zY2FsZSgpKGQudmFsdWVbaWR4XS54KSlcbiAgICAgICAgX2NpcmNsZXMuZXhpdCgpLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje19zY2FsZUxpc3QueS5zY2FsZSgpKF9sYXlvdXRbMF0udmFsdWVbaWR4XS55KSArIG9mZnNldH0pXCIpXG5cblxuICAgICAgc2V0VG9vbHRpcCA9ICh0b29sdGlwLCBvdmVybGF5KSAtPlxuICAgICAgICBfdG9vbHRpcCA9IHRvb2x0aXBcbiAgICAgICAgdG9vbHRpcChvdmVybGF5KVxuICAgICAgICB0b29sdGlwLmlzSG9yaXpvbnRhbCh0cnVlKVxuICAgICAgICB0b29sdGlwLnJlZnJlc2hPbk1vdmUodHJ1ZSlcbiAgICAgICAgdG9vbHRpcC5vbiBcIm1vdmUuI3tfaWR9XCIsIHR0TW92ZVxuICAgICAgICB0b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcbiAgICAgICAgdG9vbHRpcC5vbiBcImxlYXZlLiN7X2lkfVwiLCB0dExlYXZlXG5cblxuICAgICAgZHJhdyA9IChkYXRhLCBvcHRpb25zLCB4LCB5LCBjb2xvcikgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0geC5sYXllcktleXMoZGF0YSlcbiAgICAgICAgX2xheW91dCA9IGxheWVyS2V5cy5tYXAoKGtleSkgPT4ge2tleTprZXksIGNvbG9yOmNvbG9yLnNjYWxlKCkoa2V5KSwgdmFsdWU6ZGF0YS5tYXAoKGQpLT4ge3k6eS52YWx1ZShkKSx4OngubGF5ZXJWYWx1ZShkLCBrZXkpfSl9KVxuXG4gICAgICAgIG9mZnNldCA9IGlmIHkuaXNPcmRpbmFsKCkgdGhlbiB5LnNjYWxlKCkucmFuZ2VCYW5kKCkgLyAyIGVsc2UgMFxuXG4gICAgICAgIGlmIF90b29sdGlwIHRoZW4gX3Rvb2x0aXAuZGF0YShkYXRhKVxuXG4gICAgICAgIGxpbmUgPSBkMy5zdmcubGluZSgpXG4gICAgICAgICAgLngoKGQpIC0+IHguc2NhbGUoKShkLngpKVxuICAgICAgICAgIC55KChkKSAtPiB5LnNjYWxlKCkoZC55KSlcblxuICAgICAgICBsYXllcnMgPSB0aGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC1sYXllclwiKVxuICAgICAgICAgIC5kYXRhKF9sYXlvdXQsIChkKSAtPiBkLmtleSlcbiAgICAgICAgbGF5ZXJzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWxheWVyXCIpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtbGluZScpXG4gICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAoZCkgLT4gZC5jb2xvcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgIGxheWVycy5zZWxlY3QoJy53ay1jaGFydC1saW5lJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje29mZnNldH0pXCIpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgLT4gbGluZShkLnZhbHVlKSlcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgbGF5ZXJzLmV4aXQoKS50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5yZW1vdmUoKVxuXG4gICAgICAjLS0tIENvbmZpZ3VyYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgQGdldEtpbmQoJ3knKS5kb21haW5DYWxjKCdleHRlbnQnKS5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICBAZ2V0S2luZCgneCcpLnJlc2V0T25OZXdEYXRhKHRydWUpLmRvbWFpbkNhbGMoJ2V4dGVudCcpXG4gICAgICAgIF90b29sdGlwID0gaG9zdC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3Rvb2x0aXAubWFya2VyU2NhbGUoX3NjYWxlTGlzdC55KVxuICAgICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dE1vdmVEYXRhXG4gICAgICAgIF90b29sdGlwLm9uIFwibW92ZURhdGEuI3tfaWR9XCIsIHR0TW92ZURhdGFcbiAgICAgICAgX3Rvb2x0aXAub24gXCJtb3ZlTWFya2VyLiN7X2lkfVwiLCB0dE1vdmVNYXJrZXJcblxuICAgICAgaG9zdC5saWZlQ3ljbGUoKS5vbiAnZHJhdycsIGRyYXdcblxuICAgICAgIy0tLSBQcm9wZXJ0eSBPYnNlcnZlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdtYXJrZXJzJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZSdcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2hvd01hcmtlcnMgPSBmYWxzZVxuXG5cbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAncGllJywgKCRsb2csIHV0aWxzKSAtPlxuICBwaWVDbnRyID0gMFxuXG4gIHJldHVybiB7XG4gIHJlc3RyaWN0OiAnRUEnXG4gIHJlcXVpcmU6ICdebGF5b3V0J1xuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSAtPlxuICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcblxuICAgICMgc2V0IGNoYXJ0IHNwZWNpZmljIGRlZmF1bHRzXG5cbiAgICBfaWQgPSBcInBpZSN7cGllQ250cisrfVwiXG5cbiAgICBpbm5lciA9IHVuZGVmaW5lZFxuICAgIG91dGVyID0gdW5kZWZpbmVkXG4gICAgbGFiZWxzID0gdW5kZWZpbmVkXG4gICAgcGllQm94ID0gdW5kZWZpbmVkXG4gICAgcG9seWxpbmUgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gW11cbiAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgIF9zaG93TGFiZWxzID0gZmFsc2VcblxuICAgIF9tZXJnZSA9IHV0aWxzLm1lcmdlRGF0YSgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdHRFbnRlciA9IChkYXRhKSAtPlxuICAgICAgQGhlYWRlck5hbWUgPSBfc2NhbGVMaXN0LmNvbG9yLmF4aXNMYWJlbCgpXG4gICAgICBAaGVhZGVyVmFsdWUgPSBfc2NhbGVMaXN0LnNpemUuYXhpc0xhYmVsKClcbiAgICAgIEBsYXllcnMucHVzaCh7bmFtZTogX3NjYWxlTGlzdC5jb2xvci5mb3JtYXR0ZWRWYWx1ZShkYXRhLmRhdGEpLCB2YWx1ZTogX3NjYWxlTGlzdC5zaXplLmZvcm1hdHRlZFZhbHVlKGRhdGEuZGF0YSksIGNvbG9yOnsnYmFja2dyb3VuZC1jb2xvcic6IF9zY2FsZUxpc3QuY29sb3IubWFwKGRhdGEuZGF0YSl9fSlcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBpbml0aWFsU2hvdyA9IHRydWVcblxuICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IsIHNpemUpIC0+XG4gICAgICAjJGxvZy5kZWJ1ZyAnZHJhd2luZyBwaWUgY2hhcnQgdjInXG5cbiAgICAgIHIgPSBNYXRoLm1pbihvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCkgLyAyXG5cbiAgICAgIGlmIG5vdCBwaWVCb3hcbiAgICAgICAgcGllQm94PSBAYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC1waWVCb3gnKVxuICAgICAgcGllQm94LmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcblxuICAgICAgaW5uZXJBcmMgPSBkMy5zdmcuYXJjKClcbiAgICAgICAgLm91dGVyUmFkaXVzKHIgKiBpZiBfc2hvd0xhYmVscyB0aGVuIDAuOCBlbHNlIDEpXG4gICAgICAgIC5pbm5lclJhZGl1cygwKVxuXG4gICAgICBvdXRlckFyYyA9IGQzLnN2Zy5hcmMoKVxuICAgICAgICAub3V0ZXJSYWRpdXMociAqIDAuOSlcbiAgICAgICAgLmlubmVyUmFkaXVzKHIgKiAwLjkpXG5cbiAgICAgIGtleSA9IChkKSAtPiBfc2NhbGVMaXN0LmNvbG9yLnZhbHVlKGQuZGF0YSlcblxuICAgICAgcGllID0gZDMubGF5b3V0LnBpZSgpXG4gICAgICAgIC5zb3J0KG51bGwpXG4gICAgICAgIC52YWx1ZShzaXplLnZhbHVlKVxuXG4gICAgICBhcmNUd2VlbiA9IChhKSAtPlxuICAgICAgICBpID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgYSlcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IGkoMClcbiAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgIGlubmVyQXJjKGkodCkpXG5cbiAgICAgIHNlZ21lbnRzID0gcGllKGRhdGEpICMgcGllIGNvbXB1dGVzIGZvciBlYWNoIHNlZ21lbnQgdGhlIHN0YXJ0IGFuZ2xlIGFuZCB0aGUgZW5kIGFuZ2xlXG4gICAgICBfbWVyZ2Uua2V5KGtleSlcbiAgICAgIF9tZXJnZShzZWdtZW50cykuZmlyc3Qoe3N0YXJ0QW5nbGU6MCwgZW5kQW5nbGU6MH0pLmxhc3Qoe3N0YXJ0QW5nbGU6TWF0aC5QSSAqIDIsIGVuZEFuZ2xlOiBNYXRoLlBJICogMn0pXG5cbiAgICAgICMtLS0gRHJhdyBQaWUgc2VnbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBpZiBub3QgaW5uZXJcbiAgICAgICAgaW5uZXIgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtaW5uZXJBcmMnKVxuXG4gICAgICBpbm5lciA9IGlubmVyXG4gICAgICAgIC5kYXRhKHNlZ21lbnRzLGtleSlcblxuICAgICAgaW5uZXIuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuZWFjaCgoZCkgLT4gdGhpcy5fY3VycmVudCA9IGlmIGluaXRpYWxTaG93IHRoZW4gZCBlbHNlIHtzdGFydEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGUsIGVuZEFuZ2xlOl9tZXJnZS5hZGRlZFByZWQoZCkuZW5kQW5nbGV9KVxuICAgICAgICAuYXR0cignY2xhc3MnLCd3ay1jaGFydC1pbm5lckFyYyB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKGQpIC0+ICBjb2xvci5tYXAoZC5kYXRhKSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgaWYgaW5pdGlhbFNob3cgdGhlbiAwIGVsc2UgMSlcbiAgICAgICAgLmNhbGwoX3Rvb2x0aXAudG9vbHRpcClcbiAgICAgICAgLmNhbGwoX3NlbGVjdGVkKVxuXG4gICAgICBpbm5lclxuICAgICAgICAjLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7b3B0aW9ucy53aWR0aCAvIDJ9LCN7b3B0aW9ucy5oZWlnaHQgLyAyfSlcIilcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgLmF0dHJUd2VlbignZCcsYXJjVHdlZW4pXG5cbiAgICAgIGlubmVyLmV4aXQoKS5kYXR1bSgoZCkgLT4gIHtzdGFydEFuZ2xlOl9tZXJnZS5kZWxldGVkU3VjYyhkKS5zdGFydEFuZ2xlLCBlbmRBbmdsZTpfbWVyZ2UuZGVsZXRlZFN1Y2MoZCkuc3RhcnRBbmdsZX0pXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuYXR0clR3ZWVuKCdkJyxhcmNUd2VlbilcbiAgICAgICAgICAucmVtb3ZlKClcblxuICAgICAgIy0tLSBEcmF3IFNlZ21lbnQgTGFiZWwgVGV4dCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIG1pZEFuZ2xlID0gKGQpIC0+IGQuc3RhcnRBbmdsZSArIChkLmVuZEFuZ2xlIC0gZC5zdGFydEFuZ2xlKSAvIDJcblxuICAgICAgaWYgX3Nob3dMYWJlbHNcblxuICAgICAgICBsYWJlbHMgPSBwaWVCb3guc2VsZWN0QWxsKCcud2stY2hhcnQtbGFiZWwnKS5kYXRhKHNlZ21lbnRzLCBrZXkpXG5cbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtbGFiZWwnKVxuICAgICAgICAgIC5lYWNoKChkKSAtPiBAX2N1cnJlbnQgPSBkKVxuICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywnMS4zZW0nKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnRleHQoKGQpIC0+IHNpemUuZm9ybWF0dGVkVmFsdWUoZC5kYXRhKSlcblxuICAgICAgICBsYWJlbHMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywxKVxuICAgICAgICAgIC5hdHRyVHdlZW4oJ3RyYW5zZm9ybScsIChkKSAtPlxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKF90aGlzLl9jdXJyZW50LCBkKVxuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIF90aGlzLl9jdXJyZW50ID0gZDJcbiAgICAgICAgICAgICAgcG9zID0gb3V0ZXJBcmMuY2VudHJvaWQoZDIpXG4gICAgICAgICAgICAgIHBvc1swXSArPSAxNSAqIChpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIDEgZWxzZSAtMSlcbiAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKCN7cG9zfSlcIilcbiAgICAgICAgICAuc3R5bGVUd2VlbigndGV4dC1hbmNob3InLCAoZCkgLT5cbiAgICAgICAgICAgIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoQF9jdXJyZW50LCBkKVxuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIHJldHVybiBpZiBtaWRBbmdsZShkMikgPCBNYXRoLlBJIHRoZW4gIFwic3RhcnRcIiBlbHNlIFwiZW5kXCJcbiAgICAgICAgKVxuXG4gICAgICAgIGxhYmVscy5leGl0KClcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLnN0eWxlKCdvcGFjaXR5JywwKS5yZW1vdmUoKVxuXG4gICAgICAjLS0tIERyYXcgQ29ubmVjdG9yIExpbmVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBwb2x5bGluZSA9IHBpZUJveC5zZWxlY3RBbGwoXCJ3ay1jaGFydC1wb2x5bGluZVwiKS5kYXRhKHNlZ21lbnRzLCBrZXkpXG5cbiAgICAgICAgcG9seWxpbmUuZW50ZXIoKVxuICAgICAgICAuIGFwcGVuZChcInBvbHlsaW5lXCIpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtcG9seWxpbmUnKVxuICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMClcbiAgICAgICAgICAuZWFjaCgoZCkgLT4gIHRoaXMuX2N1cnJlbnQgPSBkKVxuXG4gICAgICAgIHBvbHlsaW5lLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgKGQpIC0+IGlmIGQuZGF0YS52YWx1ZSBpcyAwIHRoZW4gIDAgZWxzZSAuNSlcbiAgICAgICAgICAuYXR0clR3ZWVuKFwicG9pbnRzXCIsIChkKSAtPlxuICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHRoaXMuX2N1cnJlbnRcbiAgICAgICAgICAgIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUodGhpcy5fY3VycmVudCwgZClcbiAgICAgICAgICAgIF90aGlzID0gdGhpc1xuICAgICAgICAgICAgcmV0dXJuICh0KSAtPlxuICAgICAgICAgICAgICBkMiA9IGludGVycG9sYXRlKHQpXG4gICAgICAgICAgICAgIF90aGlzLl9jdXJyZW50ID0gZDI7XG4gICAgICAgICAgICAgIHBvcyA9IG91dGVyQXJjLmNlbnRyb2lkKGQyKVxuICAgICAgICAgICAgICBwb3NbMF0gKz0gMTAgKiAoaWYgbWlkQW5nbGUoZDIpIDwgTWF0aC5QSSB0aGVuICAxIGVsc2UgLTEpXG4gICAgICAgICAgICAgIHJldHVybiBbaW5uZXJBcmMuY2VudHJvaWQoZDIpLCBvdXRlckFyYy5jZW50cm9pZChkMiksIHBvc107XG4gICAgICAgICAgKVxuXG4gICAgICAgIHBvbHlsaW5lLmV4aXQoKVxuICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApXG4gICAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgICBlbHNlXG4gICAgICAgIHBpZUJveC5zZWxlY3RBbGwoJy53ay1jaGFydC1wb2x5bGluZScpLnJlbW92ZSgpXG4gICAgICAgIHBpZUJveC5zZWxlY3RBbGwoJy53ay1jaGFydC1sYWJlbCcpLnJlbW92ZSgpXG5cbiAgICAgIGluaXRpYWxTaG93ID0gZmFsc2VcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2NvbmZpZ3VyZScsIC0+XG4gICAgICBfc2NhbGVMaXN0ID0gdGhpcy5nZXRTY2FsZXMoWydzaXplJywgJ2NvbG9yJ10pXG4gICAgICBfc2NhbGVMaXN0LmNvbG9yLnNjYWxlVHlwZSgnY2F0ZWdvcnkyMCcpXG4gICAgICBfdG9vbHRpcCA9IGxheW91dC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgIF9zZWxlY3RlZCA9IGxheW91dC5iZWhhdmlvcigpLnNlbGVjdGVkXG4gICAgICBfdG9vbHRpcC5vbiBcImVudGVyLiN7X2lkfVwiLCB0dEVudGVyXG5cbiAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgYXR0cnMuJG9ic2VydmUgJ2xhYmVscycsICh2YWwpIC0+XG4gICAgICBpZiB2YWwgaXMgJ2ZhbHNlJ1xuICAgICAgICBfc2hvd0xhYmVscyA9IGZhbHNlXG4gICAgICBlbHNlIGlmIHZhbCBpcyAndHJ1ZScgb3IgdmFsIGlzIFwiXCJcbiAgICAgICAgX3Nob3dMYWJlbHMgPSB0cnVlXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkudXBkYXRlKClcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc2NhdHRlcicsICgkbG9nLCB1dGlscykgLT5cbiAgc2NhdHRlckNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnXG4gICAgcmVxdWlyZTogJ15sYXlvdXQnXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAgIF9pZCA9ICdzY2F0dGVyJyArIHNjYXR0ZXJDbnQrK1xuICAgICAgX3NjYWxlTGlzdCA9IFtdXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgZm9yIHNOYW1lLCBzY2FsZSBvZiBfc2NhbGVMaXN0XG4gICAgICAgICAgQGxheWVycy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IHNjYWxlLmF4aXNMYWJlbCgpLFxuICAgICAgICAgICAgdmFsdWU6IHNjYWxlLmZvcm1hdHRlZFZhbHVlKGRhdGEpLFxuICAgICAgICAgICAgY29sb3I6IGlmIHNOYW1lIGlzICdjb2xvcicgdGhlbiB7J2JhY2tncm91bmQtY29sb3InOnNjYWxlLm1hcChkYXRhKX0gZWxzZSB1bmRlZmluZWQsXG4gICAgICAgICAgICBwYXRoOiBpZiBzTmFtZSBpcyAnc2hhcGUnIHRoZW4gZDMuc3ZnLnN5bWJvbCgpLnR5cGUoc2NhbGUubWFwKGRhdGEpKS5zaXplKDgwKSgpIGVsc2UgdW5kZWZpbmVkXG4gICAgICAgICAgICBjbGFzczogaWYgc05hbWUgaXMgJ3NoYXBlJyB0aGVuICd3ay1jaGFydC10dC1zdmctc2hhcGUnIGVsc2UgJydcbiAgICAgICAgICB9KVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgaW5pdGlhbFNob3cgPSB0cnVlXG5cblxuXG4gICAgICBkcmF3ID0gKGRhdGEsIG9wdGlvbnMsIHgsIHksIGNvbG9yLCBzaXplLCBzaGFwZSkgLT5cbiAgICAgICAgIyRsb2cuZGVidWcgJ2RyYXdpbmcgc2NhdHRlciBjaGFydCdcbiAgICAgICAgaW5pdCA9IChzKSAtPlxuICAgICAgICAgIGlmIGluaXRpYWxTaG93XG4gICAgICAgICAgICBzLnN0eWxlKCdmaWxsJywgY29sb3IubWFwKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKS0+IFwidHJhbnNsYXRlKCN7eC5tYXAoZCl9LCN7eS5tYXAoZCl9KVwiKS5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgaW5pdGlhbFNob3cgPSBmYWxzZVxuXG4gICAgICAgIHBvaW50cyA9IEBzZWxlY3RBbGwoJy53ay1jaGFydC1wb2ludHMnKVxuICAgICAgICAgIC5kYXRhKGRhdGEpXG4gICAgICAgIHBvaW50cy5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXBvaW50cyB3ay1jaGFydC1zZWxlY3RhYmxlJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpLT4gXCJ0cmFuc2xhdGUoI3t4Lm1hcChkKX0sI3t5Lm1hcChkKX0pXCIpXG4gICAgICAgICAgLmNhbGwoaW5pdClcbiAgICAgICAgICAuY2FsbChfdG9vbHRpcC50b29sdGlwKVxuICAgICAgICAgIC5jYWxsKF9zZWxlY3RlZClcbiAgICAgICAgcG9pbnRzXG4gICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKCdkJywgZDMuc3ZnLnN5bWJvbCgpLnR5cGUoKGQpIC0+IHNoYXBlLm1hcChkKSkuc2l6ZSgoZCkgLT4gc2l6ZS5tYXAoZCkgKiBzaXplLm1hcChkKSkpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgY29sb3IubWFwKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCktPiBcInRyYW5zbGF0ZSgje3gubWFwKGQpfSwje3kubWFwKGQpfSlcIikuc3R5bGUoJ29wYWNpdHknLCAxKVxuXG4gICAgICAgIHBvaW50cy5leGl0KCkucmVtb3ZlKClcblxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdjb25maWd1cmUnLCAtPlxuICAgICAgICBfc2NhbGVMaXN0ID0gQGdldFNjYWxlcyhbJ3gnLCAneScsICdjb2xvcicsICdzaXplJywgJ3NoYXBlJ10pXG4gICAgICAgIEBnZXRLaW5kKCd5JykuZG9tYWluQ2FsYygnZXh0ZW50JykucmVzZXRPbk5ld0RhdGEodHJ1ZSlcbiAgICAgICAgQGdldEtpbmQoJ3gnKS5yZXNldE9uTmV3RGF0YSh0cnVlKS5kb21haW5DYWxjKCdleHRlbnQnKVxuICAgICAgICBfdG9vbHRpcCA9IGxheW91dC5iZWhhdmlvcigpLnRvb2x0aXBcbiAgICAgICAgX3NlbGVjdGVkID0gbGF5b3V0LmJlaGF2aW9yKCkuc2VsZWN0ZWRcbiAgICAgICAgX3Rvb2x0aXAub24gXCJlbnRlci4je19pZH1cIiwgdHRFbnRlclxuXG4gICAgICBsYXlvdXQubGlmZUN5Y2xlKCkub24gJ2RyYXcnLCBkcmF3XG4gIH1cbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc3BpZGVyJywgKCRsb2csIHV0aWxzKSAtPlxuICBzcGlkZXJDbnRyID0gMFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQSdcbiAgICByZXF1aXJlOiAnbGF5b3V0J1xuXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikgLT5cbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXIubWVcbiAgICAgICMkbG9nLmRlYnVnICdidWJibGVDaGFydCBsaW5rZWQnXG5cbiAgICAgIF90b29sdGlwID0gdW5kZWZpbmVkXG4gICAgICBfc2NhbGVMaXN0ID0ge31cbiAgICAgIF9pZCA9ICdzcGlkZXInICsgc3BpZGVyQ250cisrXG4gICAgICBheGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgX2RhdGEgPSB1bmRlZmluZWRcblxuICAgICAgIy0tLSBUb29sdGlwIEV2ZW50IEhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHR0RW50ZXIgPSAoZGF0YSkgLT5cbiAgICAgICAgQGxheWVycyA9IF9kYXRhLm1hcCgoZCkgLT4gIHtuYW1lOl9zY2FsZUxpc3QueC52YWx1ZShkKSwgdmFsdWU6X3NjYWxlTGlzdC55LmZvcm1hdFZhbHVlKGRbZGF0YV0pLCBjb2xvcjogeydiYWNrZ3JvdW5kLWNvbG9yJzpfc2NhbGVMaXN0LmNvbG9yLnNjYWxlKCkoZGF0YSl9fSlcblxuICAgICAgIy0tLSBEcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGRyYXcgPSAoZGF0YSwgb3B0aW9ucywgeCwgeSwgY29sb3IpIC0+XG4gICAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgICAkbG9nLmxvZyBkYXRhXG4gICAgICAgICMgY29tcHV0ZSBjZW50ZXIgb2YgYXJlYVxuICAgICAgICBjZW50ZXJYID0gb3B0aW9ucy53aWR0aC8yXG4gICAgICAgIGNlbnRlclkgPSBvcHRpb25zLmhlaWdodC8yXG4gICAgICAgIHJhZGl1cyA9IGQzLm1pbihbY2VudGVyWCwgY2VudGVyWV0pICogMC44XG4gICAgICAgIHRleHRPZmZzID0gMjBcbiAgICAgICAgbmJyQXhpcyA9IGRhdGEubGVuZ3RoXG4gICAgICAgIGFyYyA9IE1hdGguUEkgKiAyIC8gbmJyQXhpc1xuICAgICAgICBkZWdyID0gMzYwIC8gbmJyQXhpc1xuXG4gICAgICAgIGF4aXNHID0gdGhpcy5zZWxlY3QoJy53ay1jaGFydC1heGlzJylcbiAgICAgICAgaWYgYXhpc0cuZW1wdHkoKVxuICAgICAgICAgIGF4aXNHID0gdGhpcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1heGlzJylcblxuICAgICAgICB0aWNrcyA9IHkuc2NhbGUoKS50aWNrcyh5LnRpY2tzKCkpXG4gICAgICAgIHkuc2NhbGUoKS5yYW5nZShbcmFkaXVzLDBdKSAjIHRyaWNrcyB0aGUgd2F5IGF4aXMgYXJlIGRyYXduLiBOb3QgcHJldHR5LCBidXQgd29ya3MgOi0pXG4gICAgICAgIGF4aXMuc2NhbGUoeS5zY2FsZSgpKS5vcmllbnQoJ3JpZ2h0JykudGlja1ZhbHVlcyh0aWNrcykudGlja0Zvcm1hdCh5LnRpY2tGb3JtYXQoKSlcbiAgICAgICAgYXhpc0cuY2FsbChheGlzKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCN7Y2VudGVyWS1yYWRpdXN9KVwiKVxuICAgICAgICB5LnNjYWxlKCkucmFuZ2UoWzAscmFkaXVzXSlcblxuICAgICAgICBsaW5lcyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy1saW5lJykuZGF0YShkYXRhLChkKSAtPiBkLmF4aXMpXG4gICAgICAgIGxpbmVzLmVudGVyKClcbiAgICAgICAgICAuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcy1saW5lJylcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdkYXJrZ3JleScpXG5cbiAgICAgICAgbGluZXNcbiAgICAgICAgICAuYXR0cih7eDE6MCwgeTE6MCwgeDI6MCwgeTI6cmFkaXVzfSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywoZCxpKSAtPiBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KXJvdGF0ZSgje2RlZ3IgKiBpfSlcIilcblxuICAgICAgICBsaW5lcy5leGl0KCkucmVtb3ZlKClcblxuICAgICAgICAjZHJhdyB0aWNrIGxpbmVzXG4gICAgICAgIHRpY2tMaW5lID0gZDMuc3ZnLmxpbmUoKS54KChkKSAtPiBkLngpLnkoKGQpLT5kLnkpXG4gICAgICAgIHRpY2tQYXRoID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC10aWNrUGF0aCcpLmRhdGEodGlja3MpXG4gICAgICAgIHRpY2tQYXRoLmVudGVyKCkuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtdGlja1BhdGgnKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsICdub25lJykuc3R5bGUoJ3N0cm9rZScsICdsaWdodGdyZXknKVxuXG4gICAgICAgIHRpY2tQYXRoXG4gICAgICAgICAgLmF0dHIoJ2QnLChkKSAtPlxuICAgICAgICAgICAgcCA9IGRhdGEubWFwKChhLCBpKSAtPiB7eDpNYXRoLnNpbihhcmMqaSkgKiB5LnNjYWxlKCkoZCkseTpNYXRoLmNvcyhhcmMqaSkgKiB5LnNjYWxlKCkoZCl9KVxuICAgICAgICAgICAgdGlja0xpbmUocCkgKyAnWicpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7Y2VudGVyWH0sICN7Y2VudGVyWX0pXCIpXG5cbiAgICAgICAgdGlja1BhdGguZXhpdCgpLnJlbW92ZSgpXG5cbiAgICAgICAgYXhpc0xhYmVscyA9IHRoaXMuc2VsZWN0QWxsKCcud2stY2hhcnQtYXhpcy10ZXh0JykuZGF0YShkYXRhLChkKSAtPiB4LnZhbHVlKGQpKVxuICAgICAgICBheGlzTGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtYXhpcy10ZXh0JylcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgICAgIC5hdHRyKCdkeScsICcwLjhlbScpXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgIGF4aXNMYWJlbHNcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIHg6IChkLCBpKSAtPiBjZW50ZXJYICsgTWF0aC5zaW4oYXJjICogaSkgKiAocmFkaXVzICsgdGV4dE9mZnMpXG4gICAgICAgICAgICAgIHk6IChkLCBpKSAtPiBjZW50ZXJZICsgTWF0aC5jb3MoYXJjICogaSkgKiAocmFkaXVzICsgdGV4dE9mZnMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIC50ZXh0KChkKSAtPiB4LnZhbHVlKGQpKVxuXG4gICAgICAgICMgZHJhdyBkYXRhIGxpbmVzXG5cbiAgICAgICAgZGF0YVBhdGggPSBkMy5zdmcubGluZSgpLngoKGQpIC0+IGQueCkueSgoZCkgLT4gZC55KVxuXG4gICAgICAgIGRhdGFMaW5lID0gdGhpcy5zZWxlY3RBbGwoJy53ay1jaGFydC1kYXRhLWxpbmUnKS5kYXRhKHkubGF5ZXJLZXlzKGRhdGEpKVxuICAgICAgICBkYXRhTGluZS5lbnRlcigpLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWRhdGEtbGluZScpXG4gICAgICAgICAgLnN0eWxlKHtcbiAgICAgICAgICAgIHN0cm9rZTooZCkgLT4gY29sb3Iuc2NhbGUoKShkKVxuICAgICAgICAgICAgZmlsbDooZCkgLT4gY29sb3Iuc2NhbGUoKShkKVxuICAgICAgICAgICAgJ2ZpbGwtb3BhY2l0eSc6IDAuMlxuICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDJcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYWxsKF90b29sdGlwLnRvb2x0aXApXG4gICAgICAgIGRhdGFMaW5lLmF0dHIoJ2QnLCAoZCkgLT5cbiAgICAgICAgICAgIHAgPSBkYXRhLm1hcCgoYSwgaSkgLT4ge3g6TWF0aC5zaW4oYXJjKmkpICogeS5zY2FsZSgpKGFbZF0pLHk6TWF0aC5jb3MoYXJjKmkpICogeS5zY2FsZSgpKGFbZF0pfSlcbiAgICAgICAgICAgIGRhdGFQYXRoKHApICsgJ1onXG4gICAgICAgICAgKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2NlbnRlclh9LCAje2NlbnRlcll9KVwiKVxuXG5cbiAgICAgICMtLS0gQ29uZmlndXJhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGxheW91dC5saWZlQ3ljbGUoKS5vbiAnY29uZmlndXJlJywgLT5cbiAgICAgICAgX3NjYWxlTGlzdCA9IEBnZXRTY2FsZXMoWyd4JywgJ3knLCAnY29sb3InXSlcbiAgICAgICAgX3NjYWxlTGlzdC55LmRvbWFpbkNhbGMoJ21heCcpXG4gICAgICAgIF9zY2FsZUxpc3QueC5yZXNldE9uTmV3RGF0YSh0cnVlKVxuICAgICAgICAjQGxheWVyU2NhbGUoJ2NvbG9yJylcbiAgICAgICAgX3Rvb2x0aXAgPSBsYXlvdXQuYmVoYXZpb3IoKS50b29sdGlwXG4gICAgICAgIF90b29sdGlwLm9uIFwiZW50ZXIuI3tfaWR9XCIsIHR0RW50ZXJcblxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uICdkcmF3JywgZHJhd1xuXG4gIH0iLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvckJydXNoJywgKCRsb2csICR3aW5kb3csIHNlbGVjdGlvblNoYXJpbmcsIHRpbWluZykgLT5cblxuICBiZWhhdmlvckJydXNoID0gKCkgLT5cblxuICAgIG1lID0gKCkgLT5cblxuICAgIF9hY3RpdmUgPSBmYWxzZVxuICAgIF9vdmVybGF5ID0gdW5kZWZpbmVkXG4gICAgX2V4dGVudCA9IHVuZGVmaW5lZFxuICAgIF9zdGFydFBvcyA9IHVuZGVmaW5lZFxuICAgIF9ldlRhcmdldERhdGEgPSB1bmRlZmluZWRcbiAgICBfYXJlYSA9IHVuZGVmaW5lZFxuICAgIF9jaGFydCA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX2FyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICBfYXJlYUJveCA9IHVuZGVmaW5lZFxuICAgIF9iYWNrZ3JvdW5kQm94ID0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9zZWxlY3RhYmxlcyA9ICB1bmRlZmluZWRcbiAgICBfYnJ1c2hHcm91cCA9IHVuZGVmaW5lZFxuICAgIF94ID0gdW5kZWZpbmVkXG4gICAgX3kgPSB1bmRlZmluZWRcbiAgICBfdG9vbHRpcCA9IHVuZGVmaW5lZFxuICAgIF9icnVzaFhZID0gZmFsc2VcbiAgICBfYnJ1c2hYID0gZmFsc2VcbiAgICBfYnJ1c2hZID0gZmFsc2VcbiAgICBfYm91bmRzSWR4ID0gdW5kZWZpbmVkXG4gICAgX2JvdW5kc1ZhbHVlcyA9IHVuZGVmaW5lZFxuICAgIF9ib3VuZHNEb21haW4gPSB1bmRlZmluZWRcbiAgICBfYnJ1c2hFdmVudHMgPSBkMy5kaXNwYXRjaCgnYnJ1c2hTdGFydCcsICdicnVzaCcsICdicnVzaEVuZCcpXG5cbiAgICBsZWZ0ID0gdG9wID0gcmlnaHQgPSBib3R0b20gPSBzdGFydFRvcCA9IHN0YXJ0TGVmdCA9IHN0YXJ0UmlnaHQgPSBzdGFydEJvdHRvbSA9IHVuZGVmaW5lZFxuXG4gICAgIy0tLSBCcnVzaCB1dGlsaXR5IGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBwb3NpdGlvbkJydXNoRWxlbWVudHMgPSAobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKSAtPlxuICAgICAgd2lkdGggPSByaWdodCAtIGxlZnRcbiAgICAgIGhlaWdodCA9IGJvdHRvbSAtIHRvcFxuXG4gICAgICAjIHBvc2l0aW9uIHJlc2l6ZS1oYW5kbGVzIGludG8gdGhlIHJpZ2h0IGNvcm5lcnNcbiAgICAgIGlmIF9icnVzaFhZXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LW4nKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7dG9wfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtcycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sI3tib3R0b219KVwiKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC13JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LCN7dG9wfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uZScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7cmlnaHR9LCN7dG9wfSlcIilcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbncnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje2xlZnR9LCN7dG9wfSlcIilcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtc2UnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3JpZ2h0fSwje2JvdHRvbX0pXCIpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXN3JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0fSwje2JvdHRvbX0pXCIpXG4gICAgICAgIF9leHRlbnQuYXR0cignd2lkdGgnLCB3aWR0aCkuYXR0cignaGVpZ2h0JywgaGVpZ2h0KS5hdHRyKCd4JywgbGVmdCkuYXR0cigneScsIHRvcClcbiAgICAgIGlmIF9icnVzaFhcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtdycpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7bGVmdH0sMClcIikuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1lJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tyaWdodH0sMClcIikuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1lJykuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgX2FyZWFCb3guaGVpZ2h0KVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC13Jykuc2VsZWN0KCdyZWN0JykuYXR0cignaGVpZ2h0JywgX2FyZWFCb3guaGVpZ2h0KVxuICAgICAgICBfZXh0ZW50LmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIF9hcmVhQm94LmhlaWdodCkuYXR0cigneCcsIGxlZnQpLmF0dHIoJ3knLCAwKVxuICAgICAgaWYgX2JydXNoWVxuICAgICAgICBfb3ZlcmxheS5zZWxlY3RBbGwoJy53ay1jaGFydC1uJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwje3RvcH0pXCIpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgwLCN7Ym90dG9tfSlcIikuc2VsZWN0KCdyZWN0JykuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgX292ZXJsYXkuc2VsZWN0QWxsKCcud2stY2hhcnQtbicpLnNlbGVjdCgncmVjdCcpLmF0dHIoJ3dpZHRoJywgX2FyZWFCb3gud2lkdGgpXG4gICAgICAgIF9vdmVybGF5LnNlbGVjdEFsbCgnLndrLWNoYXJ0LXMnKS5zZWxlY3QoJ3JlY3QnKS5hdHRyKCd3aWR0aCcsIF9hcmVhQm94LndpZHRoKVxuICAgICAgICBfZXh0ZW50LmF0dHIoJ3dpZHRoJywgX2FyZWFCb3gud2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCkuYXR0cigneCcsIDApLmF0dHIoJ3knLCB0b3ApXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZ2V0U2VsZWN0ZWRPYmplY3RzID0gKCkgLT5cbiAgICAgIGVyID0gX2V4dGVudC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIF9zZWxlY3RhYmxlcy5lYWNoKChkKSAtPlxuICAgICAgICAgIGNyID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgIHhIaXQgPSBlci5sZWZ0IDwgY3IucmlnaHQgLSBjci53aWR0aCAvIDMgYW5kIGNyLmxlZnQgKyBjci53aWR0aCAvIDMgPCBlci5yaWdodFxuICAgICAgICAgIHlIaXQgPSBlci50b3AgPCBjci5ib3R0b20gLSBjci5oZWlnaHQgLyAzIGFuZCBjci50b3AgKyBjci5oZWlnaHQgLyAzIDwgZXIuYm90dG9tXG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGVkJywgeUhpdCBhbmQgeEhpdClcbiAgICAgICAgKVxuICAgICAgcmV0dXJuIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0ZWQnKS5kYXRhKClcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBzZXRTZWxlY3Rpb24gPSAobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKSAtPlxuICAgICAgaWYgX2JydXNoWFxuICAgICAgICBfYm91bmRzSWR4ID0gW21lLngoKS5pbnZlcnQobGVmdCksIG1lLngoKS5pbnZlcnQocmlnaHQpXVxuICAgICAgICBpZiBtZS54KCkuaXNPcmRpbmFsKClcbiAgICAgICAgICBfYm91bmRzVmFsdWVzID0gX2RhdGEubWFwKChkKSAtPiBtZS54KCkudmFsdWUoZCkpLnNsaWNlKF9ib3VuZHNJZHhbMF0sIF9ib3VuZHNJZHhbMV0gKyAxKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2JvdW5kc1ZhbHVlcyA9IFttZS54KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFswXV0pLCBtZS54KCkudmFsdWUoX2RhdGFbX2JvdW5kc0lkeFsxXV0pXVxuICAgICAgICBfYm91bmRzRG9tYWluID0gX2RhdGEuc2xpY2UoX2JvdW5kc0lkeFswXSwgX2JvdW5kc0lkeFsxXSArIDEpXG4gICAgICBpZiBfYnJ1c2hZXG4gICAgICAgIF9ib3VuZHNJZHggPSBbbWUueSgpLmludmVydChib3R0b20pLCBtZS55KCkuaW52ZXJ0KHRvcCldXG4gICAgICAgIGlmIG1lLnkoKS5pc09yZGluYWwoKVxuICAgICAgICAgIF9ib3VuZHNWYWx1ZXMgPSBfZGF0YS5tYXAoKGQpIC0+IG1lLnkoKS52YWx1ZShkKSkuc2xpY2UoX2JvdW5kc0lkeFswXSwgX2JvdW5kc0lkeFsxXSArIDEpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYm91bmRzVmFsdWVzID0gW21lLnkoKS52YWx1ZShfZGF0YVtfYm91bmRzSWR4WzBdXSksIG1lLnkoKS52YWx1ZShfZGF0YVtfYm91bmRzSWR4WzFdXSldXG4gICAgICAgIF9ib3VuZHNEb21haW4gPSBfZGF0YS5zbGljZShfYm91bmRzSWR4WzBdLCBfYm91bmRzSWR4WzFdICsgMSlcbiAgICAgIGlmIF9icnVzaFhZXG4gICAgICAgIF9ib3VuZHNJZHggPSBbXVxuICAgICAgICBfYm91bmRzVmFsdWVzID0gW11cbiAgICAgICAgX2JvdW5kc0RvbWFpbiA9IGdldFNlbGVjdGVkT2JqZWN0cygpXG5cbiAgICAjLS0tIEJydXNoU3RhcnQgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cblxuICAgIGJydXNoU3RhcnQgPSAoKSAtPlxuICAgICAgI3JlZ2lzdGVyIGEgbW91c2UgaGFuZGxlcnMgZm9yIHRoZSBicnVzaFxuICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgX2V2VGFyZ2V0RGF0YSA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpLmRhdHVtKClcbiAgICAgIF9hcmVhQm94ID0gX2FyZWEuZ2V0QkJveCgpXG4gICAgICBfc3RhcnRQb3MgPSBkMy5tb3VzZShfYXJlYSlcbiAgICAgIHN0YXJ0VG9wID0gdG9wXG4gICAgICBzdGFydExlZnQgPSBsZWZ0XG4gICAgICBzdGFydFJpZ2h0ID0gcmlnaHRcbiAgICAgIHN0YXJ0Qm90dG9tID0gYm90dG9tXG4gICAgICBkMy5zZWxlY3QoX2FyZWEpLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsJ25vbmUnKS5zZWxlY3RBbGwoXCIud2stY2hhcnQtcmVzaXplXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKVxuICAgICAgZDMuc2VsZWN0KCdib2R5Jykuc3R5bGUoJ2N1cnNvcicsIGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpLnN0eWxlKCdjdXJzb3InKSlcblxuICAgICAgZDMuc2VsZWN0KCR3aW5kb3cpLm9uKCdtb3VzZW1vdmUuYnJ1c2gnLCBicnVzaE1vdmUpLm9uKCdtb3VzZXVwLmJydXNoJywgYnJ1c2hFbmQpXG5cbiAgICAgIF90b29sdGlwLmhpZGUodHJ1ZSlcbiAgICAgIF9ib3VuZHNJZHggPSB1bmRlZmluZWRcbiAgICAgIF9zZWxlY3RhYmxlcyA9IF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtc2VsZWN0YWJsZScpXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2hTdGFydCgpXG4gICAgICB0aW1pbmcuY2xlYXIoKVxuICAgICAgdGltaW5nLmluaXQoKVxuXG4gICAgIy0tLSBCcnVzaEVuZCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGJydXNoRW5kID0gKCkgLT5cbiAgICAgICNkZS1yZWdpc3RlciBoYW5kbGVyc1xuXG4gICAgICBkMy5zZWxlY3QoJHdpbmRvdykub24gJ21vdXNlbW92ZS5icnVzaCcsIG51bGxcbiAgICAgIGQzLnNlbGVjdCgkd2luZG93KS5vbiAnbW91c2V1cC5icnVzaCcsIG51bGxcbiAgICAgIGQzLnNlbGVjdChfYXJlYSkuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywnYWxsJykuc2VsZWN0QWxsKCcud2stY2hhcnQtcmVzaXplJykuc3R5bGUoJ2Rpc3BsYXknLCBudWxsKSAjIHNob3cgdGhlIHJlc2l6ZSBoYW5kbGVyc1xuICAgICAgZDMuc2VsZWN0KCdib2R5Jykuc3R5bGUoJ2N1cnNvcicsIG51bGwpXG4gICAgICBpZiBib3R0b20gLSB0b3AgaXMgMCBvciByaWdodCAtIGxlZnQgaXMgMFxuICAgICAgICAjYnJ1c2ggaXMgZW1wdHlcbiAgICAgICAgZDMuc2VsZWN0KF9hcmVhKS5zZWxlY3RBbGwoJy53ay1jaGFydC1yZXNpemUnKS5zdHlsZSgnZGlzcGxheScsICdub25lJylcbiAgICAgIF90b29sdGlwLmhpZGUoZmFsc2UpXG4gICAgICBfYnJ1c2hFdmVudHMuYnJ1c2hFbmQoX2JvdW5kc0lkeClcbiAgICAgIHRpbWluZy5yZXBvcnQoKVxuXG4gICAgIy0tLSBCcnVzaE1vdmUgRXZlbnQgSGFuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGJydXNoTW92ZSA9ICgpIC0+XG4gICAgICAkbG9nLmluZm8gJ2JydXNobW92ZSdcbiAgICAgIHBvcyA9IGQzLm1vdXNlKF9hcmVhKVxuICAgICAgZGVsdGFYID0gcG9zWzBdIC0gX3N0YXJ0UG9zWzBdXG4gICAgICBkZWx0YVkgPSBwb3NbMV0gLSBfc3RhcnRQb3NbMV1cblxuICAgICAgIyB0aGlzIGVsYWJvcmF0ZSBjb2RlIGlzIG5lZWRlZCB0byBkZWFsIHdpdGggc2NlbmFyaW9zIHdoZW4gbW91c2UgbW92ZXMgZmFzdCBhbmQgdGhlIGV2ZW50cyBkbyBub3QgaGl0IHgveSArIGRlbHRhXG4gICAgICAjIGRvZXMgbm90IGhpIHRoZSAwIHBvaW50IG1heWUgdGhlcmUgaXMgYSBtb3JlIGVsZWdhbnQgd2F5IHRvIHdyaXRlIHRoaXMsIGJ1dCBmb3Igbm93IGl0IHdvcmtzIDotKVxuXG4gICAgICBsZWZ0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0TGVmdCArIGRlbHRhXG4gICAgICAgIGxlZnQgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydFJpZ2h0IHRoZW4gcG9zIGVsc2Ugc3RhcnRSaWdodCkgZWxzZSAwXG4gICAgICAgIHJpZ2h0ID0gaWYgcG9zIDw9IF9hcmVhQm94LndpZHRoIHRoZW4gKGlmIHBvcyA8IHN0YXJ0UmlnaHQgdGhlbiBzdGFydFJpZ2h0IGVsc2UgcG9zKSBlbHNlIF9hcmVhQm94LndpZHRoXG5cbiAgICAgIHJpZ2h0TXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIHBvcyA9IHN0YXJ0UmlnaHQgKyBkZWx0YVxuICAgICAgICBsZWZ0ID0gaWYgcG9zID49IDAgdGhlbiAoaWYgcG9zIDwgc3RhcnRMZWZ0IHRoZW4gcG9zIGVsc2Ugc3RhcnRMZWZ0KSBlbHNlIDBcbiAgICAgICAgcmlnaHQgPSBpZiBwb3MgPD0gX2FyZWFCb3gud2lkdGggdGhlbiAoaWYgcG9zIDwgc3RhcnRMZWZ0IHRoZW4gc3RhcnRMZWZ0IGVsc2UgcG9zKSBlbHNlIF9hcmVhQm94LndpZHRoXG5cbiAgICAgIHRvcE12ID0gKGRlbHRhKSAtPlxuICAgICAgICBwb3MgPSBzdGFydFRvcCArIGRlbHRhXG4gICAgICAgIHRvcCA9IGlmIHBvcyA+PSAwIHRoZW4gKGlmIHBvcyA8IHN0YXJ0Qm90dG9tIHRoZW4gcG9zIGVsc2Ugc3RhcnRCb3R0b20pIGVsc2UgMFxuICAgICAgICBib3R0b20gPSBpZiBwb3MgPD0gX2FyZWFCb3guaGVpZ2h0IHRoZW4gKGlmIHBvcyA+IHN0YXJ0Qm90dG9tIHRoZW4gcG9zIGVsc2Ugc3RhcnRCb3R0b20gKSBlbHNlIF9hcmVhQm94LmhlaWdodFxuXG4gICAgICBib3R0b21NdiA9IChkZWx0YSkgLT5cbiAgICAgICAgcG9zID0gc3RhcnRCb3R0b20gKyBkZWx0YVxuICAgICAgICB0b3AgPSBpZiBwb3MgPj0gMCB0aGVuIChpZiBwb3MgPCBzdGFydFRvcCB0aGVuIHBvcyBlbHNlIHN0YXJ0VG9wKSBlbHNlIDBcbiAgICAgICAgYm90dG9tID0gaWYgcG9zIDw9IF9hcmVhQm94LmhlaWdodCB0aGVuIChpZiBwb3MgPiBzdGFydFRvcCB0aGVuIHBvcyBlbHNlIHN0YXJ0VG9wICkgZWxzZSBfYXJlYUJveC5oZWlnaHRcblxuICAgICAgaG9yTXYgPSAoZGVsdGEpIC0+XG4gICAgICAgIGlmIHN0YXJ0TGVmdCArIGRlbHRhID49IDBcbiAgICAgICAgICBpZiBzdGFydFJpZ2h0ICsgZGVsdGEgPD0gX2FyZWFCb3gud2lkdGhcbiAgICAgICAgICAgIGxlZnQgPSBzdGFydExlZnQgKyBkZWx0YVxuICAgICAgICAgICAgcmlnaHQgPSBzdGFydFJpZ2h0ICsgZGVsdGFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByaWdodCA9IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgICBsZWZ0ID0gX2FyZWFCb3gud2lkdGggLSAoc3RhcnRSaWdodCAtIHN0YXJ0TGVmdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxlZnQgPSAwXG4gICAgICAgICAgcmlnaHQgPSBzdGFydFJpZ2h0IC0gc3RhcnRMZWZ0XG5cbiAgICAgIHZlcnRNdiA9IChkZWx0YSkgLT5cbiAgICAgICAgaWYgc3RhcnRUb3AgKyBkZWx0YSA+PSAwXG4gICAgICAgICAgaWYgc3RhcnRCb3R0b20gKyBkZWx0YSA8PSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgIHRvcCA9IHN0YXJ0VG9wICsgZGVsdGFcbiAgICAgICAgICAgIGJvdHRvbSA9IHN0YXJ0Qm90dG9tICsgZGVsdGFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBib3R0b20gPSBfYXJlYUJveC5oZWlnaHRcbiAgICAgICAgICAgIHRvcCA9IF9hcmVhQm94LmhlaWdodCAtIChzdGFydEJvdHRvbSAtIHN0YXJ0VG9wKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdG9wID0gMFxuICAgICAgICAgIGJvdHRvbSA9IHN0YXJ0Qm90dG9tIC0gc3RhcnRUb3BcblxuICAgICAgc3dpdGNoIF9ldlRhcmdldERhdGEubmFtZVxuICAgICAgICB3aGVuICdiYWNrZ3JvdW5kJ1xuICAgICAgICAgIGlmIGRlbHRhWCArIF9zdGFydFBvc1swXSA+IDBcbiAgICAgICAgICAgIGxlZnQgPSBpZiBkZWx0YVggPCAwIHRoZW4gX3N0YXJ0UG9zWzBdICsgZGVsdGFYIGVsc2UgX3N0YXJ0UG9zWzBdXG4gICAgICAgICAgICBpZiBsZWZ0ICsgTWF0aC5hYnMoZGVsdGFYKSA8IF9hcmVhQm94LndpZHRoXG4gICAgICAgICAgICAgIHJpZ2h0ID0gbGVmdCArIE1hdGguYWJzKGRlbHRhWClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcmlnaHQgPSBfYXJlYUJveC53aWR0aFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxlZnQgPSAwXG5cbiAgICAgICAgICBpZiBkZWx0YVkgKyBfc3RhcnRQb3NbMV0gPiAwXG4gICAgICAgICAgICB0b3AgPSBpZiBkZWx0YVkgPCAwIHRoZW4gX3N0YXJ0UG9zWzFdICsgZGVsdGFZIGVsc2UgX3N0YXJ0UG9zWzFdXG4gICAgICAgICAgICBpZiB0b3AgKyBNYXRoLmFicyhkZWx0YVkpIDwgX2FyZWFCb3guaGVpZ2h0XG4gICAgICAgICAgICAgIGJvdHRvbSA9IHRvcCArIE1hdGguYWJzKGRlbHRhWSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgYm90dG9tID0gX2FyZWFCb3guaGVpZ2h0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdG9wID0gMFxuXG4gICAgICAgIHdoZW4gJ2V4dGVudCdcbiAgICAgICAgICB2ZXJ0TXYoZGVsdGFZKTsgaG9yTXYoZGVsdGFYKVxuICAgICAgICB3aGVuICduJ1xuICAgICAgICAgIHRvcE12KGRlbHRhWSlcbiAgICAgICAgd2hlbiAncydcbiAgICAgICAgICBib3R0b21NdihkZWx0YVkpXG4gICAgICAgIHdoZW4gJ3cnXG4gICAgICAgICAgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnZSdcbiAgICAgICAgICByaWdodE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnbncnXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKTsgbGVmdE12KGRlbHRhWClcbiAgICAgICAgd2hlbiAnbmUnXG4gICAgICAgICAgdG9wTXYoZGVsdGFZKTsgcmlnaHRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ3N3J1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSk7IGxlZnRNdihkZWx0YVgpXG4gICAgICAgIHdoZW4gJ3NlJ1xuICAgICAgICAgIGJvdHRvbU12KGRlbHRhWSk7IHJpZ2h0TXYoZGVsdGFYKVxuXG4gICAgICBwb3NpdGlvbkJydXNoRWxlbWVudHMobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tKVxuICAgICAgc2V0U2VsZWN0aW9uKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSlcbiAgICAgIF9icnVzaEV2ZW50cy5icnVzaChfYm91bmRzSWR4LCBfYm91bmRzVmFsdWVzLCBfYm91bmRzRG9tYWluKVxuICAgICAgc2VsZWN0aW9uU2hhcmluZy5zZXRTZWxlY3Rpb24gX2JvdW5kc1ZhbHVlcywgX2JydXNoR3JvdXBcblxuICAgICMtLS0gQnJ1c2ggLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5icnVzaCA9IChzKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9vdmVybGF5XG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfYWN0aXZlIHRoZW4gcmV0dXJuXG4gICAgICAgIF9vdmVybGF5ID0gc1xuICAgICAgICBfYnJ1c2hYWSA9IG1lLngoKSBhbmQgbWUueSgpXG4gICAgICAgIF9icnVzaFggPSBtZS54KCkgYW5kIG5vdCBtZS55KClcbiAgICAgICAgX2JydXNoWSA9IG1lLnkoKSBhbmQgbm90IG1lLngoKVxuICAgICAgICAjIGNyZWF0ZSB0aGUgaGFuZGxlciBlbGVtZW50cyBhbmQgcmVnaXN0ZXIgdGhlIGhhbmRsZXJzXG4gICAgICAgIHMuc3R5bGUoeydwb2ludGVyLWV2ZW50cyc6ICdhbGwnLCBjdXJzb3I6ICdjcm9zc2hhaXInfSlcbiAgICAgICAgX2V4dGVudCA9IHMuYXBwZW5kKCdyZWN0JykuYXR0cih7Y2xhc3M6J3drLWNoYXJ0LWV4dGVudCcsIHg6MCwgeTowLCB3aWR0aDowLCBoZWlnaHQ6MH0pLnN0eWxlKCdjdXJzb3InLCdtb3ZlJykuZGF0dW0oe25hbWU6J2V4dGVudCd9KVxuICAgICAgICAjIHJlc2l6ZSBoYW5kbGVzIGZvciB0aGUgc2lkZXNcbiAgICAgICAgaWYgX2JydXNoWSBvciBfYnJ1c2hYWVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LW4nKS5zdHlsZSh7Y3Vyc29yOiducy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDowLCB5OiAtMywgd2lkdGg6MCwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonbid9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LXMnKS5zdHlsZSh7Y3Vyc29yOiducy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDowLCB5OiAtMywgd2lkdGg6MCwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZToncyd9KVxuICAgICAgICBpZiBfYnJ1c2hYIG9yIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtdycpLnN0eWxlKHtjdXJzb3I6J2V3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt5OjAsIHg6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6MH0pLmRhdHVtKHtuYW1lOid3J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtZScpLnN0eWxlKHtjdXJzb3I6J2V3LXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt5OjAsIHg6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6MH0pLmRhdHVtKHtuYW1lOidlJ30pXG4gICAgICAgICMgcmVzaXplIGhhbmRsZXMgZm9yIHRoZSBjb3JuZXJzXG4gICAgICAgIGlmIF9icnVzaFhZXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtbncnKS5zdHlsZSh7Y3Vyc29yOidud3NlLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidudyd9KVxuICAgICAgICAgIHMuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQtcmVzaXplIHdrLWNoYXJ0LW5lJykuc3R5bGUoe2N1cnNvcjonbmVzdy1yZXNpemUnLCBkaXNwbGF5Oidub25lJ30pXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmF0dHIoe3g6IC0zLCB5OiAtMywgd2lkdGg6NiwgaGVpZ2h0OjZ9KS5kYXR1bSh7bmFtZTonbmUnfSlcbiAgICAgICAgICBzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXJlc2l6ZSB3ay1jaGFydC1zdycpLnN0eWxlKHtjdXJzb3I6J25lc3ctcmVzaXplJywgZGlzcGxheTonbm9uZSd9KVxuICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt4OiAtMywgeTogLTMsIHdpZHRoOjYsIGhlaWdodDo2fSkuZGF0dW0oe25hbWU6J3N3J30pXG4gICAgICAgICAgcy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1yZXNpemUgd2stY2hhcnQtc2UnKS5zdHlsZSh7Y3Vyc29yOidud3NlLXJlc2l6ZScsIGRpc3BsYXk6J25vbmUnfSlcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JykuYXR0cih7eDogLTMsIHk6IC0zLCB3aWR0aDo2LCBoZWlnaHQ6Nn0pLmRhdHVtKHtuYW1lOidzZSd9KVxuICAgICAgICAjcmVnaXN0ZXIgaGFuZGxlci4gUGxlYXNlIG5vdGUsIGJydXNoIHdhbnRzIHRoZSBtb3VzZSBkb3duIGV4Y2x1c2l2ZWx5ICEhIVxuICAgICAgICBzLm9uICdtb3VzZWRvd24uYnJ1c2gnLCBicnVzaFN0YXJ0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBFeHRlbnQgcmVzaXplIGhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHJlc2l6ZUV4dGVudCA9ICgpIC0+XG4gICAgICBpZiBfYXJlYUJveFxuICAgICAgICAkbG9nLmluZm8gJ3Jlc2l6ZUhhbmRsZXInXG4gICAgICAgIG5ld0JveCA9IF9hcmVhLmdldEJCb3goKVxuICAgICAgICBob3Jpem9udGFsUmF0aW8gPSBfYXJlYUJveC53aWR0aCAvIG5ld0JveC53aWR0aFxuICAgICAgICB2ZXJ0aWNhbFJhdGlvID0gX2FyZWFCb3guaGVpZ2h0IC8gbmV3Qm94LmhlaWdodFxuICAgICAgICB0b3AgPSB0b3AgLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIHN0YXJ0VG9wID0gc3RhcnRUb3AgLyB2ZXJ0aWNhbFJhdGlvXG4gICAgICAgIGJvdHRvbSA9IGJvdHRvbSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgc3RhcnRCb3R0b20gPSBzdGFydEJvdHRvbSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgbGVmdCA9IGxlZnQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgc3RhcnRMZWZ0ID0gc3RhcnRMZWZ0IC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIHJpZ2h0ID0gcmlnaHQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgc3RhcnRSaWdodCA9IHN0YXJ0UmlnaHQgLyBob3Jpem9udGFsUmF0aW9cbiAgICAgICAgX3N0YXJ0UG9zWzBdID0gX3N0YXJ0UG9zWzBdIC8gaG9yaXpvbnRhbFJhdGlvXG4gICAgICAgIF9zdGFydFBvc1sxXSA9IF9zdGFydFBvc1sxXSAvIHZlcnRpY2FsUmF0aW9cbiAgICAgICAgX2FyZWFCb3ggPSBuZXdCb3hcbiAgICAgICAgcG9zaXRpb25CcnVzaEVsZW1lbnRzKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSlcblxuICAgICMtLS0gQnJ1c2ggUHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuY2hhcnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jaGFydFxuICAgICAgZWxzZVxuICAgICAgICBfY2hhcnQgPSB2YWxcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uICdyZXNpemUuYnJ1c2gnLCByZXNpemVFeHRlbnRcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS54ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfeFxuICAgICAgZWxzZVxuICAgICAgICBfeCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUueSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3lcbiAgICAgIGVsc2VcbiAgICAgICAgX3kgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmFyZWEgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hcmVhU2VsZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfYXJlYVNlbGVjdGlvblxuICAgICAgICAgIF9hcmVhU2VsZWN0aW9uID0gdmFsXG4gICAgICAgICAgX2FyZWEgPSBfYXJlYVNlbGVjdGlvbi5ub2RlKClcbiAgICAgICAgICAjX2FyZWFCb3ggPSBfYXJlYS5nZXRCQm94KCkgbmVlZCB0byBnZXQgd2hlbiBjYWxjdWxhdGluZyBzaXplIHRvIGRlYWwgd2l0aCByZXNpemluZ1xuICAgICAgICAgIG1lLmJydXNoKF9hcmVhU2VsZWN0aW9uKVxuXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICBfc2VsZWN0YWJsZXMgPSBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZGF0YSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX2RhdGEgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmJydXNoR3JvdXAgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9icnVzaEdyb3VwXG4gICAgICBlbHNlXG4gICAgICAgIF9icnVzaEdyb3VwID0gdmFsXG4gICAgICAgIHNlbGVjdGlvblNoYXJpbmcuY3JlYXRlR3JvdXAoX2JydXNoR3JvdXApXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50b29sdGlwID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdG9vbHRpcFxuICAgICAgZWxzZVxuICAgICAgICBfdG9vbHRpcCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUub24gPSAobmFtZSwgY2FsbGJhY2spIC0+XG4gICAgICBfYnJ1c2hFdmVudHMub24gbmFtZSwgY2FsbGJhY2tcblxuICAgIG1lLmV4dGVudCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JvdW5kc0lkeFxuXG4gICAgbWUuZXZlbnRzID0gKCkgLT5cbiAgICAgIHJldHVybiBfYnJ1c2hFdmVudHNcblxuICAgIG1lLmVtcHR5ID0gKCkgLT5cbiAgICAgIHJldHVybiBfYm91bmRzSWR4IGlzIHVuZGVmaW5lZFxuXG4gICAgcmV0dXJuIG1lXG4gIHJldHVybiBiZWhhdmlvckJydXNoIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnYmVoYXZpb3JTZWxlY3QnLCAoJGxvZykgLT5cbiAgc2VsZWN0SWQgPSAwXG5cbiAgc2VsZWN0ID0gKCkgLT5cblxuICAgIF9pZCA9IFwic2VsZWN0I3tzZWxlY3RJZCsrfVwiXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9hY3RpdmUgPSBmYWxzZVxuICAgIF9zZWxlY3Rpb25FdmVudHMgPSBkMy5kaXNwYXRjaCgnc2VsZWN0ZWQnKVxuXG4gICAgY2xpY2tlZCA9ICgpIC0+XG4gICAgICBpZiBub3QgX2FjdGl2ZSB0aGVuIHJldHVyblxuICAgICAgb2JqID0gZDMuc2VsZWN0KHRoaXMpXG4gICAgICBpZiBub3QgX2FjdGl2ZSB0aGVuIHJldHVyblxuICAgICAgaWYgb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGFibGUnKVxuICAgICAgICBpc1NlbGVjdGVkID0gb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGVkJylcbiAgICAgICAgb2JqLmNsYXNzZWQoJ3drLWNoYXJ0LXNlbGVjdGVkJywgbm90IGlzU2VsZWN0ZWQpXG4gICAgICAgIGFsbFNlbGVjdGVkID0gX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1zZWxlY3RlZCcpLmRhdGEoKS5tYXAoKGQpIC0+IGlmIGQuZGF0YSB0aGVuIGQuZGF0YSBlbHNlIGQpXG4gICAgICAgICMgZW5zdXJlIHRoYXQgb25seSB0aGUgb3JpZ2luYWwgdmFsdWVzIGFyZSByZXBvcnRlZCBiYWNrXG5cbiAgICAgICAgX3NlbGVjdGlvbkV2ZW50cy5zZWxlY3RlZChhbGxTZWxlY3RlZClcblxuICAgIG1lID0gKHNlbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBtZVxuICAgICAgZWxzZVxuICAgICAgICBzZWxcbiAgICAgICAgICAjIHJlZ2lzdGVyIHNlbGVjdGlvbiBldmVudHNcbiAgICAgICAgICAub24gJ2NsaWNrJywgY2xpY2tlZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmlkID0gKCkgLT5cbiAgICAgIHJldHVybiBfaWRcblxuICAgIG1lLmFjdGl2ZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FjdGl2ZVxuICAgICAgZWxzZVxuICAgICAgICBfYWN0aXZlID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5jb250YWluZXIgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9jb250YWluZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX2NvbnRhaW5lciA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuZXZlbnRzID0gKCkgLT5cbiAgICAgIHJldHVybiBfc2VsZWN0aW9uRXZlbnRzXG5cbiAgICBtZS5vbiA9IChuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgIF9zZWxlY3Rpb25FdmVudHMub24gbmFtZSwgY2FsbGJhY2tcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIHNlbGVjdCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2JlaGF2aW9yVG9vbHRpcCcsICgkbG9nLCAkZG9jdW1lbnQsICRyb290U2NvcGUsICRjb21waWxlLCAkdGVtcGxhdGVDYWNoZSwgdGVtcGxhdGVEaXIpIC0+XG5cbiAgYmVoYXZpb3JUb29sdGlwID0gKCkgLT5cblxuICAgIF9hY3RpdmUgPSBmYWxzZVxuICAgIF9oaWRlID0gZmFsc2VcbiAgICBfc2hvd01hcmtlckxpbmUgPSB1bmRlZmluZWRcbiAgICBfbWFya2VyRyA9IHVuZGVmaW5lZFxuICAgIF9tYXJrZXJMaW5lID0gdW5kZWZpbmVkXG4gICAgX2FyZWFTZWxlY3Rpb24gPSB1bmRlZmluZWRcbiAgICBfYXJlYT0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9tYXJrZXJTY2FsZSA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX3Rvb2x0aXBEaXNwYXRjaCA9IGQzLmRpc3BhdGNoKCdlbnRlcicsICdtb3ZlRGF0YScsICdtb3ZlTWFya2VyJywgJ2xlYXZlJylcblxuICAgIF90ZW1wbCA9ICR0ZW1wbGF0ZUNhY2hlLmdldCh0ZW1wbGF0ZURpciArICd0b29sVGlwLmh0bWwnKVxuICAgIF90ZW1wbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpXG4gICAgX2NvbXBpbGVkVGVtcGwgPSAkY29tcGlsZShfdGVtcGwpKF90ZW1wbFNjb3BlKVxuICAgIGJvZHkgPSAkZG9jdW1lbnQuZmluZCgnYm9keScpXG5cbiAgICBib2R5UmVjdCA9IGJvZHlbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0gaGVscGVyIEZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBwb3NpdGlvbkJveCA9ICgpIC0+XG4gICAgICByZWN0ID0gX2NvbXBpbGVkVGVtcGxbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNsaWVudFggPSBpZiBib2R5UmVjdC5yaWdodCAtIDIwID4gZDMuZXZlbnQuY2xpZW50WCArIHJlY3Qud2lkdGggKyAxMCB0aGVuIGQzLmV2ZW50LmNsaWVudFggKyAxMCBlbHNlIGQzLmV2ZW50LmNsaWVudFggLSByZWN0LndpZHRoIC0gMTBcbiAgICAgIGNsaWVudFkgPSBpZiBib2R5UmVjdC5ib3R0b20gLSAyMCA+IGQzLmV2ZW50LmNsaWVudFkgKyByZWN0LmhlaWdodCArIDEwIHRoZW4gZDMuZXZlbnQuY2xpZW50WSArIDEwIGVsc2UgZDMuZXZlbnQuY2xpZW50WSAtIHJlY3QuaGVpZ2h0IC0gMTBcbiAgICAgIF90ZW1wbFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICBsZWZ0OiBjbGllbnRYICsgJ3B4J1xuICAgICAgICB0b3A6IGNsaWVudFkgKyAncHgnXG4gICAgICAgICd6LWluZGV4JzogMTUwMFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9XG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKVxuXG4gICAgcG9zaXRpb25Jbml0aWFsID0gKCkgLT5cbiAgICAgIF90ZW1wbFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICBsZWZ0OiAwICsgJ3B4J1xuICAgICAgICB0b3A6IDAgKyAncHgnXG4gICAgICAgICd6LWluZGV4JzogMTUwMFxuICAgICAgICBvcGFjaXR5OiAwXG4gICAgICB9XG4gICAgICBfdGVtcGxTY29wZS4kYXBwbHkoKSAgIyBlbnN1cmUgdG9vbHRpcCBnZXRzIHJlbmRlcmVkXG4gICAgICAjd2F5aXQgdW50aWwgaXQgaXMgcmVuZGVyZWQgYW5kIHRoZW4gcmVwb3NpdGlvblxuICAgICAgXy50aHJvdHRsZSBwb3NpdGlvbkJveCwgMjAwXG5cbiAgICAjLS0tIFRvb2x0aXBTdGFydCBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcEVudGVyID0gKCkgLT5cbiAgICAgIGlmIG5vdCBfYWN0aXZlIG9yIF9oaWRlIHRoZW4gcmV0dXJuXG4gICAgICAjIGFwcGVuZCBkYXRhIGRpdlxuICAgICAgYm9keS5hcHBlbmQoX2NvbXBpbGVkVGVtcGwpXG4gICAgICBfdGVtcGxTY29wZS5sYXllcnMgPSBbXVxuXG4gICAgICAjIGdldCB0b29sdGlwIGRhdGEgdmFsdWVcblxuICAgICAgaWYgX3Nob3dNYXJrZXJMaW5lXG4gICAgICAgIF9wb3MgPSBkMy5tb3VzZSh0aGlzKVxuICAgICAgICB2YWx1ZSA9IF9tYXJrZXJTY2FsZS5pbnZlcnQoaWYgX21hcmtlclNjYWxlLmlzSG9yaXpvbnRhbCgpIHRoZW4gX3Bvc1swXSBlbHNlIF9wb3NbMV0pXG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlID0gZDMuc2VsZWN0KHRoaXMpLmRhdHVtKClcblxuICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gdHJ1ZVxuICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5lbnRlci5hcHBseShfdGVtcGxTY29wZSwgW3ZhbHVlXSkgIyBjYWxsIGxheW91dCB0byBmaWxsIGluIGRhdGFcbiAgICAgIHBvc2l0aW9uSW5pdGlhbCgpXG5cbiAgICAgICMgY3JlYXRlIGEgbWFya2VyIGxpbmUgaWYgcmVxdWlyZWRcbiAgICAgIGlmIF9zaG93TWFya2VyTGluZVxuICAgICAgICAjX2FyZWEgPSB0aGlzXG4gICAgICAgIF9hcmVhQm94ID0gX2FyZWFTZWxlY3Rpb24uc2VsZWN0KCcud2stY2hhcnQtYmFja2dyb3VuZCcpLm5vZGUoKS5nZXRCQm94KClcbiAgICAgICAgX3BvcyA9IGQzLm1vdXNlKF9hcmVhKVxuICAgICAgICBfbWFya2VyRyA9IF9jb250YWluZXIuYXBwZW5kKCdnJykgICMgbmVlZCB0byBhcHBlbmQgbWFya2VyIHRvIGNoYXJ0IGFyZWEgdG8gZW5zdXJlIGl0IGlzIG9uIHRvcCBvZiB0aGUgY2hhcnQgZWxlbWVudHMgRml4IDEwXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LXRvb2x0aXAtbWFya2VyJylcbiAgICAgICAgX21hcmtlckxpbmUgPSBfbWFya2VyRy5hcHBlbmQoJ2xpbmUnKVxuICAgICAgICBpZiBfbWFya2VyU2NhbGUuaXNIb3Jpem9udGFsKClcbiAgICAgICAgICBfbWFya2VyTGluZS5hdHRyKHtjbGFzczond2stY2hhcnQtbWFya2VyLWxpbmUnLCB4MDowLCB4MTowLCB5MDowLHkxOl9hcmVhQm94LmhlaWdodH0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfbWFya2VyTGluZS5hdHRyKHtjbGFzczond2stY2hhcnQtbWFya2VyLWxpbmUnLCB4MDowLCB4MTpfYXJlYUJveC53aWR0aCwgeTA6MCx5MTowfSlcblxuICAgICAgICBfbWFya2VyTGluZS5zdHlsZSh7c3Ryb2tlOiAnZGFya2dyZXknLCAncG9pbnRlci1ldmVudHMnOiAnbm9uZSd9KVxuXG4gICAgICAgIF90b29sdGlwRGlzcGF0Y2gubW92ZU1hcmtlci5hcHBseShfbWFya2VyRywgW3ZhbHVlXSlcblxuICAgICMtLS0gVG9vbHRpcE1vdmUgIEV2ZW50IEhhbmRsZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICB0b29sdGlwTW92ZSA9ICgpIC0+XG4gICAgICBpZiBub3QgX2FjdGl2ZSBvciBfaGlkZSB0aGVuIHJldHVyblxuICAgICAgX3BvcyA9IGQzLm1vdXNlKF9hcmVhKVxuICAgICAgcG9zaXRpb25Cb3goKVxuICAgICAgaWYgX3Nob3dNYXJrZXJMaW5lXG4gICAgICAgICNfbWFya2VyRy5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19wb3NbMF19KVwiKVxuICAgICAgICBkYXRhSWR4ID0gX21hcmtlclNjYWxlLmludmVydChpZiBfbWFya2VyU2NhbGUuaXNIb3Jpem9udGFsKCkgdGhlbiBfcG9zWzBdIGVsc2UgX3Bvc1sxXSlcbiAgICAgICAgX3Rvb2x0aXBEaXNwYXRjaC5tb3ZlTWFya2VyLmFwcGx5KF9tYXJrZXJHLCBbZGF0YUlkeF0pXG4gICAgICAgIF90ZW1wbFNjb3BlLmxheWVycyA9IFtdXG4gICAgICAgIF90b29sdGlwRGlzcGF0Y2gubW92ZURhdGEuYXBwbHkoX3RlbXBsU2NvcGUsIFtkYXRhSWR4XSlcbiAgICAgIF90ZW1wbFNjb3BlLiRhcHBseSgpXG5cbiAgICAjLS0tIFRvb2x0aXBMZWF2ZSBFdmVudCBIYW5kbGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdG9vbHRpcExlYXZlID0gKCkgLT5cbiAgICAgICMkbG9nLmRlYnVnICd0b29sdGlwTGVhdmUnLCBfYXJlYVxuICAgICAgaWYgX21hcmtlckdcbiAgICAgICAgX21hcmtlckcucmVtb3ZlKClcbiAgICAgIF9tYXJrZXJHID0gdW5kZWZpbmVkXG4gICAgICBfdGVtcGxTY29wZS50dFNob3cgPSBmYWxzZVxuICAgICAgX2NvbXBpbGVkVGVtcGwucmVtb3ZlKClcblxuICAgICMtLS0gSW50ZXJmYWNlIHRvIGJydXNoIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5oaWRlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaGlkZVxuICAgICAgZWxzZVxuICAgICAgICBfaGlkZSA9IHZhbFxuICAgICAgICBpZiBfbWFya2VyR1xuICAgICAgICAgIF9tYXJrZXJHLnN0eWxlKCd2aXNpYmlsaXR5JywgaWYgX2hpZGUgdGhlbiAnaGlkZGVuJyBlbHNlICd2aXNpYmxlJylcbiAgICAgICAgX3RlbXBsU2NvcGUudHRTaG93ID0gbm90IF9oaWRlXG4gICAgICAgIF90ZW1wbFNjb3BlLiRhcHBseSgpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cblxuICAgICMtLSBUb29sdGlwIHByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5hY3RpdmUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9hY3RpdmVcbiAgICAgIGVsc2VcbiAgICAgICAgX2FjdGl2ZSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXJlYSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FyZWFTZWxlY3Rpb25cbiAgICAgIGVsc2VcbiAgICAgICAgX2FyZWFTZWxlY3Rpb24gPSB2YWxcbiAgICAgICAgX2FyZWEgPSBfYXJlYVNlbGVjdGlvbi5ub2RlKClcbiAgICAgICAgaWYgX3Nob3dNYXJrZXJMaW5lXG4gICAgICAgICAgbWUudG9vbHRpcChfYXJlYVNlbGVjdGlvbilcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmNvbnRhaW5lciA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NvbnRhaW5lclxuICAgICAgZWxzZVxuICAgICAgICBfY29udGFpbmVyID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5tYXJrZXJTY2FsZSA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX21hcmtlclNjYWxlXG4gICAgICBlbHNlXG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgIF9zaG93TWFya2VyTGluZSA9IHRydWVcbiAgICAgICAgICBfbWFya2VyU2NhbGUgPSB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9zaG93TWFya2VyTGluZSA9IGZhbHNlXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5kYXRhID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZGF0YVxuICAgICAgZWxzZVxuICAgICAgICBfZGF0YSA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUub24gPSAobmFtZSwgY2FsbGJhY2spIC0+XG4gICAgICBfdG9vbHRpcERpc3BhdGNoLm9uIG5hbWUsIGNhbGxiYWNrXG5cbiAgICAjLS0tIFRvb2x0aXAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUudG9vbHRpcCA9IChzKSAtPiAjIHJlZ2lzdGVyIHRoZSB0b29sdGlwIGV2ZW50cyB3aXRoIHRoZSBzZWxlY3Rpb25cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBtZVxuICAgICAgZWxzZSAgIyBzZXQgdG9vbHRpcCBmb3IgYW4gb2JqZWN0cyBzZWxlY3Rpb25cbiAgICAgICAgcy5vbiAnbW91c2VlbnRlci50b29sdGlwJywgdG9vbHRpcEVudGVyXG4gICAgICAgICAgLm9uICdtb3VzZW1vdmUudG9vbHRpcCcsIHRvb2x0aXBNb3ZlXG4gICAgICAgICAgLm9uICdtb3VzZWxlYXZlLnRvb2x0aXAnLCB0b29sdGlwTGVhdmVcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBiZWhhdmlvclRvb2x0aXAiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdiZWhhdmlvcicsICgkbG9nLCAkd2luZG93LCBiZWhhdmlvclRvb2x0aXAsIGJlaGF2aW9yQnJ1c2gsIGJlaGF2aW9yU2VsZWN0KSAtPlxuXG4gIGJlaGF2aW9yID0gKCkgLT5cblxuICAgIF90b29sdGlwID0gYmVoYXZpb3JUb29sdGlwKClcbiAgICBfYnJ1c2ggPSBiZWhhdmlvckJydXNoKClcbiAgICBfc2VsZWN0aW9uID0gYmVoYXZpb3JTZWxlY3QoKVxuICAgIF9icnVzaC50b29sdGlwKF90b29sdGlwKVxuXG4gICAgYXJlYSA9IChhcmVhKSAtPlxuICAgICAgX2JydXNoLmFyZWEoYXJlYSlcbiAgICAgIF90b29sdGlwLmFyZWEoYXJlYSlcblxuICAgIGNvbnRhaW5lciA9IChjb250YWluZXIpIC0+XG4gICAgICBfYnJ1c2guY29udGFpbmVyKGNvbnRhaW5lcilcbiAgICAgIF9zZWxlY3Rpb24uY29udGFpbmVyKGNvbnRhaW5lcilcbiAgICAgIF90b29sdGlwLmNvbnRhaW5lcihjb250YWluZXIpXG5cbiAgICBjaGFydCA9IChjaGFydCkgLT5cbiAgICAgIF9icnVzaC5jaGFydChjaGFydClcblxuICAgIHJldHVybiB7dG9vbHRpcDpfdG9vbHRpcCwgYnJ1c2g6X2JydXNoLCBzZWxlY3RlZDpfc2VsZWN0aW9uLCBvdmVybGF5OmFyZWEsIGNvbnRhaW5lcjpjb250YWluZXIsIGNoYXJ0OmNoYXJ0fVxuICByZXR1cm4gYmVoYXZpb3IiLCJhbmd1bGFyLm1vZHVsZSgnd2suY2hhcnQnKS5mYWN0b3J5ICdjaGFydCcsICgkbG9nLCBzY2FsZUxpc3QsIGNvbnRhaW5lciwgYmVoYXZpb3IsIGQzQW5pbWF0aW9uKSAtPlxuXG4gIGNoYXJ0Q250ciA9IDBcblxuICBjaGFydCA9ICgpIC0+XG5cbiAgICBfaWQgPSBcImNoYXJ0I3tjaGFydENudHIrK31cIlxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgIy0tLSBWYXJpYWJsZSBkZWNsYXJhdGlvbnMgYW5kIGRlZmF1bHRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9sYXlvdXRzID0gW10gICAgICAgICAgICAgICAjIExpc3Qgb2YgbGF5b3V0cyBmb3IgdGhlIGNoYXJ0XG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZCAgICAjIHRoZSBjaGFydHMgZHJhd2luZyBjb250YWluZXIgb2JqZWN0XG4gICAgX2FsbFNjYWxlcyA9IHVuZGVmaW5lZCAgICAjIEhvbGRzIGFsbCBzY2FsZXMgb2YgdGhlIGNoYXJ0LCByZWdhcmRsZXNzIG9mIHNjYWxlIG93bmVyXG4gICAgX293bmVkU2NhbGVzID0gdW5kZWZpbmVkICAjIGhvbGRzIHRoZSBzY2xlcyBvd25lZCBieSBjaGFydCwgaS5lLiBzaGFyZSBzY2FsZXNcbiAgICBfZGF0YSA9IHVuZGVmaW5lZCAgICAgICAgICAgIyBwb2ludGVyIHRvIHRoZSBsYXN0IGRhdGEgc2V0IGJvdW5kIHRvIGNoYXJ0XG4gICAgX3Nob3dUb29sdGlwID0gZmFsc2UgICAgICAgICMgdG9vbHRpcCBwcm9wZXJ0eVxuICAgIF90aXRsZSA9IHVuZGVmaW5lZFxuICAgIF9zdWJUaXRsZSA9IHVuZGVmaW5lZFxuICAgIF9iZWhhdmlvciA9IGJlaGF2aW9yKClcbiAgICBfYW5pbWF0aW9uRHVyYXRpb24gPSBkM0FuaW1hdGlvbi5kdXJhdGlvblxuXG4gICAgIy0tLSBMaWZlQ3ljbGUgRGlzcGF0Y2hlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIF9saWZlQ3ljbGUgPSBkMy5kaXNwYXRjaCgnY29uZmlndXJlJywgJ3Jlc2l6ZScsICdwcmVwYXJlRGF0YScsICdzY2FsZURvbWFpbnMnLCAnc2l6ZUNvbnRhaW5lcicsICdkcmF3QXhpcycsICdkcmF3Q2hhcnQnLCAnbmV3RGF0YScsICd1cGRhdGUnLCAndXBkYXRlQXR0cnMnLCAnc2NvcGVBcHBseScgKVxuICAgIF9icnVzaCA9IGQzLmRpc3BhdGNoKCdkcmF3JywgJ2NoYW5nZScpXG5cbiAgICAjLS0tIEdldHRlci9TZXR0ZXIgRnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuaWQgPSAoaWQpIC0+XG4gICAgICByZXR1cm4gX2lkXG5cbiAgICBtZS5zaG93VG9vbHRpcCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dUb29sdGlwXG4gICAgICBlbHNlXG4gICAgICAgIF9zaG93VG9vbHRpcCA9IHRydWVGYWxzZVxuICAgICAgICBfYmVoYXZpb3IudG9vbHRpcC5hY3RpdmUoX3Nob3dUb29sdGlwKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnRpdGxlID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpdGxlID0gdmFsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuc3ViVGl0bGUgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zdWJUaXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfc3ViVGl0bGUgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRMYXlvdXQgPSAobGF5b3V0KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXlvdXRzXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXlvdXRzLnB1c2gobGF5b3V0KVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmFkZFNjYWxlID0gKHNjYWxlLCBsYXlvdXQpIC0+XG4gICAgICBfYWxsU2NhbGVzLmFkZChzY2FsZSlcbiAgICAgIGlmIGxheW91dFxuICAgICAgICBsYXlvdXQuc2NhbGVzKCkuYWRkKHNjYWxlKVxuICAgICAgZWxzZVxuICAgICAgICBfb3duZWRTY2FsZXMuYWRkKHNjYWxlKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hbmltYXRpb25EdXJhdGlvbiA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2FuaW1hdGlvbkR1cmF0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIF9hbmltYXRpb25EdXJhdGlvbiA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgIy0tLSBHZXR0ZXIgRnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmxpZmVDeWNsZSA9ICh2YWwpIC0+XG4gICAgICByZXR1cm4gX2xpZmVDeWNsZVxuXG4gICAgbWUubGF5b3V0cyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2xheW91dHNcblxuICAgIG1lLnNjYWxlcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX293bmVkU2NhbGVzXG5cbiAgICBtZS5hbGxTY2FsZXMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9hbGxTY2FsZXNcblxuICAgIG1lLmhhc1NjYWxlID0gKHNjYWxlKSAtPlxuICAgICAgcmV0dXJuICEhX2FsbFNjYWxlcy5oYXMoc2NhbGUpXG5cbiAgICBtZS5jb250YWluZXIgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9jb250YWluZXJcblxuICAgIG1lLmJydXNoID0gKCkgLT5cbiAgICAgIHJldHVybiBfYnJ1c2hcblxuICAgIG1lLmdldERhdGEgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9kYXRhXG5cbiAgICBtZS5iZWhhdmlvciA9ICgpIC0+XG4gICAgICByZXR1cm4gX2JlaGF2aW9yXG5cbiAgICAjLS0tIENoYXJ0IGRyYXdpbmcgbGlmZSBjeWNsZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZXhlY0xpZmVDeWNsZUZ1bGwgPSAoZGF0YSwgbm9BbmltYXRpb24pIC0+XG4gICAgICBpZiBkYXRhXG4gICAgICAgICRsb2cubG9nICdleGVjdXRpbmcgZnVsbCBsaWZlIGN5Y2xlJ1xuICAgICAgICBfZGF0YSA9IGRhdGFcbiAgICAgICAgX2xpZmVDeWNsZS5wcmVwYXJlRGF0YShkYXRhLCBub0FuaW1hdGlvbikgICAgIyBjYWxscyB0aGUgcmVnaXN0ZXJlZCBsYXlvdXQgdHlwZXNcbiAgICAgICAgX2xpZmVDeWNsZS5zY2FsZURvbWFpbnMoZGF0YSwgbm9BbmltYXRpb24pICAgIyBjYWxscyByZWdpc3RlcmVkIHRoZSBzY2FsZXNcbiAgICAgICAgX2xpZmVDeWNsZS5zaXplQ29udGFpbmVyKGRhdGEsIG5vQW5pbWF0aW9uKSAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyhub0FuaW1hdGlvbikgICAgICAgICAgICAgIyBjYWxscyBjb250YWluZXJcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoZGF0YSwgbm9BbmltYXRpb24pICAgICAjIGNhbGxzIGxheW91dFxuXG4gICAgbWUucmVzaXplTGlmZUN5Y2xlID0gKG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgX2RhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyByZXNpemUgbGlmZSBjeWNsZSdcbiAgICAgICAgX2xpZmVDeWNsZS5zaXplQ29udGFpbmVyKF9kYXRhLCBub0FuaW1hdGlvbikgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChfZGF0YSwgbm9BbmltYXRpb24pXG4gICAgICAgIF9saWZlQ3ljbGUuc2NvcGVBcHBseSgpXG5cbiAgICBtZS5uZXdEYXRhTGlmZUN5Y2xlID0gKGRhdGEsIG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgZGF0YVxuICAgICAgICAkbG9nLmxvZyAnZXhlY3V0aW5nIG5ldyBkYXRhIGxpZmUgY3ljbGUnXG4gICAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgICBfbGlmZUN5Y2xlLnByZXBhcmVEYXRhKGRhdGEsIG5vQW5pbWF0aW9uKSAgICAjIGNhbGxzIHRoZSByZWdpc3RlcmVkIGxheW91dCB0eXBlc1xuICAgICAgICBfbGlmZUN5Y2xlLnNjYWxlRG9tYWlucyhkYXRhLCBub0FuaW1hdGlvbilcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyhub0FuaW1hdGlvbikgICAgICAgICAgICAgICMgY2FsbHMgY29udGFpbmVyXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0NoYXJ0KGRhdGEsIG5vQW5pbWF0aW9uKVxuXG4gICAgbWUuYXR0cmlidXRlQ2hhbmdlID0gKG5vQW5pbWF0aW9uKSAtPlxuICAgICAgaWYgX2RhdGFcbiAgICAgICAgJGxvZy5sb2cgJ2V4ZWN1dGluZyBhdHRyaWJ1dGUgY2hhbmdlIGxpZmUgY3ljbGUnXG4gICAgICAgIF9saWZlQ3ljbGUuc2l6ZUNvbnRhaW5lcihfZGF0YSwgbm9BbmltYXRpb24pXG4gICAgICAgIF9saWZlQ3ljbGUuZHJhd0F4aXMobm9BbmltYXRpb24pICAgICAgICAgICAgICAjIGNhbGxzIGNvbnRhaW5lclxuICAgICAgICBfbGlmZUN5Y2xlLmRyYXdDaGFydChfZGF0YSwgbm9BbmltYXRpb24pXG5cbiAgICBtZS5icnVzaEV4dGVudENoYW5nZWQgPSAoKSAtPlxuICAgICAgaWYgX2RhdGFcbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3QXhpcyh0cnVlKSAgICAgICAgICAgICAgIyBObyBBbmltYXRpb25cbiAgICAgICAgX2xpZmVDeWNsZS5kcmF3Q2hhcnQoX2RhdGEsIHRydWUpXG5cbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAnbmV3RGF0YS5jaGFydCcsIG1lLmV4ZWNMaWZlQ3ljbGVGdWxsXG4gICAgbWUubGlmZUN5Y2xlKCkub24gJ3Jlc2l6ZS5jaGFydCcsIG1lLnJlc2l6ZUxpZmVDeWNsZVxuICAgIG1lLmxpZmVDeWNsZSgpLm9uICd1cGRhdGUuY2hhcnQnLCAobm9BbmltYXRpb24pIC0+IG1lLmV4ZWNMaWZlQ3ljbGVGdWxsKF9kYXRhLCBub0FuaW1hdGlvbilcbiAgICBtZS5saWZlQ3ljbGUoKS5vbiAndXBkYXRlQXR0cnMnLCBtZS5hdHRyaWJ1dGVDaGFuZ2VcblxuICAgICMtLS0gSW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfYmVoYXZpb3IuY2hhcnQobWUpXG4gICAgX2NvbnRhaW5lciA9IGNvbnRhaW5lcigpLmNoYXJ0KG1lKSAgICMgdGhlIGNoYXJ0cyBkcmF3aW5nIGNvbnRhaW5lciBvYmplY3RcbiAgICBfYWxsU2NhbGVzID0gc2NhbGVMaXN0KCkgICAgIyBIb2xkcyBhbGwgc2NhbGVzIG9mIHRoZSBjaGFydCwgcmVnYXJkbGVzcyBvZiBzY2FsZSBvd25lclxuICAgIF9vd25lZFNjYWxlcyA9IHNjYWxlTGlzdCgpICAjIGhvbGRzIHRoZSBzY2xlcyBvd25lZCBieSBjaGFydCwgaS5lLiBzaGFyZSBzY2FsZXNcblxuICAgIHJldHVybiBtZVxuXG4gIHJldHVybiBjaGFydCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2NvbnRhaW5lcicsICgkbG9nLCAkd2luZG93LCBkM0NoYXJ0TWFyZ2lucywgc2NhbGVMaXN0LCBheGlzQ29uZmlnLCBkM0FuaW1hdGlvbiwgYmVoYXZpb3IpIC0+XG5cbiAgY29udGFpbmVyQ250ID0gMFxuXG4gIGNvbnRhaW5lciA9ICgpIC0+XG5cbiAgICBtZSA9ICgpLT5cblxuICAgICMtLS0gVmFyaWFibGUgZGVjbGFyYXRpb25zIGFuZCBkZWZhdWx0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBfY29udGFpbmVySWQgPSAnY250bnInICsgY29udGFpbmVyQ250KytcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfZWxlbWVudCA9IHVuZGVmaW5lZFxuICAgIF9lbGVtZW50U2VsZWN0aW9uID0gdW5kZWZpbmVkXG4gICAgX2xheW91dHMgPSBbXVxuICAgIF9sZWdlbmRzID0gW11cbiAgICBfc3ZnID0gdW5kZWZpbmVkXG4gICAgX2NvbnRhaW5lciA9IHVuZGVmaW5lZFxuICAgIF9zcGFjZWRDb250YWluZXIgPSB1bmRlZmluZWRcbiAgICBfY2hhcnRBcmVhID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0QXJlYSA9IHVuZGVmaW5lZFxuICAgIF9tYXJnaW4gPSBhbmd1bGFyLmNvcHkoZDNDaGFydE1hcmdpbnMuZGVmYXVsdClcbiAgICBfaW5uZXJXaWR0aCA9IDBcbiAgICBfaW5uZXJIZWlnaHQgPSAwXG4gICAgX3RpdGxlSGVpZ2h0ID0gMFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX292ZXJsYXkgPSB1bmRlZmluZWRcbiAgICBfYmVoYXZpb3IgPSB1bmRlZmluZWRcbiAgICBfZHVyYXRpb24gPSAwXG5cbiAgICAjLS0tIEdldHRlci9TZXR0ZXIgRnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuaWQgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9jb250YWluZXJJZFxuXG4gICAgbWUuY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IGNoYXJ0XG4gICAgICAgICMgcmVnaXN0ZXIgdG8gbGlmZWN5Y2xlIGV2ZW50c1xuICAgICAgICAjX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwic2l6ZUNvbnRhaW5lci4je21lLmlkKCl9XCIsIG1lLnNpemVDb250YWluZXJcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwiZHJhd0F4aXMuI3ttZS5pZCgpfVwiLCBtZS5kcmF3Q2hhcnRGcmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmVsZW1lbnQgPSAoZWxlbSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZWxlbWVudFxuICAgICAgZWxzZVxuICAgICAgICBfcmVzaXplSGFuZGxlciA9ICgpIC0+ICBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnJlc2l6ZSh0cnVlKSAjIG5vIGFuaW1hdGlvblxuICAgICAgICBfZWxlbWVudCA9IGVsZW1cbiAgICAgICAgX2VsZW1lbnRTZWxlY3Rpb24gPSBkMy5zZWxlY3QoX2VsZW1lbnQpXG4gICAgICAgIGlmIF9lbGVtZW50U2VsZWN0aW9uLmVtcHR5KClcbiAgICAgICAgICAkbG9nLmVycm9yIFwiRXJyb3I6IEVsZW1lbnQgI3tfZWxlbWVudH0gZG9lcyBub3QgZXhpc3RcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgX2dlbkNoYXJ0RnJhbWUoKVxuICAgICAgICAgICMgZmluZCB0aGUgZGl2IGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBoYW5kbGVyIHRvXG4gICAgICAgICAgcmVzaXplVGFyZ2V0ID0gX2VsZW1lbnRTZWxlY3Rpb24uc2VsZWN0KCcud2stY2hhcnQnKS5ub2RlKClcbiAgICAgICAgICBuZXcgUmVzaXplU2Vuc29yKHJlc2l6ZVRhcmdldCwgX3Jlc2l6ZUhhbmRsZXIpXG5cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRMYXlvdXQgPSAobGF5b3V0KSAtPlxuICAgICAgX2xheW91dHMucHVzaChsYXlvdXQpXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmhlaWdodCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2lubmVySGVpZ2h0XG5cbiAgICBtZS53aWR0aCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2lubmVyV2lkdGhcblxuICAgIG1lLm1hcmdpbnMgPSAoKSAtPlxuICAgICAgcmV0dXJuIF9tYXJnaW5cblxuICAgIG1lLmdldENoYXJ0QXJlYSA9ICgpIC0+XG4gICAgICByZXR1cm4gX2NoYXJ0QXJlYVxuXG4gICAgbWUuZ2V0T3ZlcmxheSA9ICgpIC0+XG4gICAgICByZXR1cm4gX292ZXJsYXlcblxuICAgIG1lLmdldENvbnRhaW5lciA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NwYWNlZENvbnRhaW5lclxuXG4gICAgIy0tLSB1dGlsaXR5IGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBSZXR1cm46IHRleHQgaGVpZ2h0XG4gICAgZHJhd0FuZFBvc2l0aW9uVGV4dCA9IChjb250YWluZXIsIHRleHQsIHNlbGVjdG9yLCBmb250U2l6ZSwgb2Zmc2V0KSAtPlxuICAgICAgZWxlbSA9IGNvbnRhaW5lci5zZWxlY3QoJy4nICsgc2VsZWN0b3IpXG4gICAgICBpZiBlbGVtLmVtcHR5KClcbiAgICAgICAgZWxlbSA9IGNvbnRhaW5lci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKHtjbGFzczpzZWxlY3RvciwgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsIHk6aWYgb2Zmc2V0IHRoZW4gb2Zmc2V0IGVsc2UgMH0pXG4gICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLGZvbnRTaXplKVxuICAgICAgZWxlbS50ZXh0KHRleHQpXG4gICAgICAjbWVhc3VyZSBzaXplIGFuZCByZXR1cm4gaXRcbiAgICAgIHJldHVybiBlbGVtLm5vZGUoKS5nZXRCQm94KCkuaGVpZ2h0XG5cblxuICAgIGRyYXdUaXRsZUFyZWEgPSAodGl0bGUsIHN1YlRpdGxlKSAtPlxuICAgICAgdGl0bGVBcmVhSGVpZ2h0ID0gMFxuICAgICAgYXJlYSA9IF9jb250YWluZXIuc2VsZWN0KCcud2stY2hhcnQtdGl0bGUtYXJlYScpXG4gICAgICBpZiBhcmVhLmVtcHR5KClcbiAgICAgICAgYXJlYSA9IF9jb250YWluZXIuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCd3ay1jaGFydC10aXRsZS1hcmVhIHdrLWNlbnRlci1ob3InKVxuICAgICAgaWYgdGl0bGVcbiAgICAgICAgX3RpdGxlSGVpZ2h0ID0gZHJhd0FuZFBvc2l0aW9uVGV4dChhcmVhLCB0aXRsZSwgJ3drLWNoYXJ0LXRpdGxlJywgJzJlbScpXG4gICAgICBpZiBzdWJUaXRsZVxuICAgICAgICBkcmF3QW5kUG9zaXRpb25UZXh0KGFyZWEsIHN1YlRpdGxlLCAnd2stY2hhcnQtc3VidGl0bGUnLCAnMS44ZW0nLCBfdGl0bGVIZWlnaHQpXG5cbiAgICAgIHJldHVybiBhcmVhLm5vZGUoKS5nZXRCQm94KCkuaGVpZ2h0XG5cbiAgICBnZXRBeGlzUmVjdCA9IChkaW0pIC0+XG4gICAgICBheGlzID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgZGltLnNjYWxlKCkucmFuZ2UoWzAsMTAwXSlcbiAgICAgIGF4aXMuY2FsbChkaW0uYXhpcygpKVxuXG5cblxuICAgICAgaWYgZGltLnJvdGF0ZVRpY2tMYWJlbHMoKVxuICAgICAgICBheGlzLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgLmF0dHIoe2R5OictMC43MWVtJywgeDotOX0pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLFwidHJhbnNsYXRlKDAsOSkgcm90YXRlKCN7ZGltLnJvdGF0ZVRpY2tMYWJlbHMoKX0pXCIpXG4gICAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCBpZiBkaW0uYXhpc09yaWVudCgpIGlzICdib3R0b20nIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnKVxuXG4gICAgICBib3ggPSBheGlzLm5vZGUoKS5nZXRCQm94KClcbiAgICAgIGF4aXMucmVtb3ZlKClcbiAgICAgIHJldHVybiBib3hcblxuICAgIGRyYXdBeGlzID0gKGRpbSkgLT5cbiAgICAgIGF4aXMgPSBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7ZGltLmF4aXNPcmllbnQoKX1cIilcbiAgICAgIGlmIGF4aXMuZW1wdHkoKVxuICAgICAgICBheGlzID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1heGlzIHdrLWNoYXJ0LScgKyBkaW0uYXhpc09yaWVudCgpKVxuICAgICAgYXhpcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oX2R1cmF0aW9uKS5jYWxsKGRpbS5heGlzKCkpXG5cbiAgICAgIGlmIGRpbS5yb3RhdGVUaWNrTGFiZWxzKClcbiAgICAgICAgYXhpcy5zZWxlY3RBbGwoXCIud2stY2hhcnQtI3tkaW0uYXhpc09yaWVudCgpfS53ay1jaGFydC1heGlzIHRleHRcIilcbiAgICAgICAgICAuYXR0cih7ZHk6Jy0wLjcxZW0nLCB4Oi05fSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJyxcInRyYW5zbGF0ZSgwLDkpIHJvdGF0ZSgje2RpbS5yb3RhdGVUaWNrTGFiZWxzKCl9KVwiKVxuICAgICAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCBpZiBkaW0uYXhpc09yaWVudCgpIGlzICdib3R0b20nIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnKVxuICAgICAgZWxzZVxuICAgICAgICBheGlzLnNlbGVjdEFsbChcIi53ay1jaGFydC0je2RpbS5heGlzT3JpZW50KCl9LndrLWNoYXJ0LWF4aXMgdGV4dFwiKS5hdHRyKCd0cmFuc2Zvcm0nLCBudWxsKVxuXG4gICAgX3JlbW92ZUF4aXMgPSAob3JpZW50KSAtPlxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtYXhpcy53ay1jaGFydC0je29yaWVudH1cIikucmVtb3ZlKClcblxuICAgIF9yZW1vdmVMYWJlbCA9IChvcmllbnQpIC0+XG4gICAgICBfY29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1sYWJlbC53ay1jaGFydC0je29yaWVudH1cIikucmVtb3ZlKClcblxuICAgIGRyYXdHcmlkID0gKHMsIG5vQW5pbWF0aW9uKSAtPlxuICAgICAgZHVyYXRpb24gPSBpZiBub0FuaW1hdGlvbiB0aGVuIDAgZWxzZSBfZHVyYXRpb25cbiAgICAgIGtpbmQgPSBzLmtpbmQoKVxuICAgICAgdGlja3MgPSBpZiBzLmlzT3JkaW5hbCgpIHRoZW4gcy5zY2FsZSgpLnJhbmdlKCkgZWxzZSBzLnNjYWxlKCkudGlja3MoKVxuICAgICAgZ3JpZExpbmVzID0gX2NvbnRhaW5lci5zZWxlY3RBbGwoXCIud2stY2hhcnQtZ3JpZC53ay1jaGFydC0je2tpbmR9XCIpLmRhdGEodGlja3MsIChkKSAtPiBkKVxuICAgICAgZ3JpZExpbmVzLmVudGVyKCkuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCBcIndrLWNoYXJ0LWdyaWQgd2stY2hhcnQtI3traW5kfVwiKVxuICAgICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDApXG4gICAgICBpZiBraW5kIGlzICd5J1xuICAgICAgICBncmlkTGluZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgIHgxOjAsXG4gICAgICAgICAgICB4MjogX2lubmVyV2lkdGgsXG4gICAgICAgICAgICB5MTooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuICBkIGVsc2Ugcy5zY2FsZSgpKGQpLFxuICAgICAgICAgICAgeTI6KGQpIC0+IGlmIHMuaXNPcmRpbmFsKCkgdGhlbiBkIGVsc2Ugcy5zY2FsZSgpKGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLDEpXG4gICAgICBlbHNlXG4gICAgICAgIGdyaWRMaW5lcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgeTE6MCxcbiAgICAgICAgICAgIHkyOiBfaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICB4MTooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgZWxzZSBzLnNjYWxlKCkoZCksXG4gICAgICAgICAgICB4MjooZCkgLT4gaWYgcy5pc09yZGluYWwoKSB0aGVuIGQgZWxzZSBzLnNjYWxlKCkoZClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsMSlcbiAgICAgIGdyaWRMaW5lcy5leGl0KCkudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5zdHlsZSgnb3BhY2l0eScsMCkucmVtb3ZlKClcblxuICAgICMtLS0gQnVpbGQgdGhlIGNvbnRhaW5lciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBidWlsZCBnZW5lcmljIGVsZW1lbnRzIGZpcnN0XG5cbiAgICBfZ2VuQ2hhcnRGcmFtZSA9ICgpIC0+XG4gICAgICBfc3ZnID0gX2VsZW1lbnRTZWxlY3Rpb24uYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydCcpLmFwcGVuZCgnc3ZnJykuYXR0cignY2xhc3MnLCAnd2stY2hhcnQnKVxuICAgICAgX3N2Zy5hcHBlbmQoJ2RlZnMnKS5hcHBlbmQoJ2NsaXBQYXRoJykuYXR0cignaWQnLCBcIndrLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9XCIpLmFwcGVuZCgncmVjdCcpXG4gICAgICBfY29udGFpbmVyPSBfc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnd2stY2hhcnQtY29udGFpbmVyJylcbiAgICAgIF9vdmVybGF5ID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ2FsbCcpXG4gICAgICBfb3ZlcmxheS5hcHBlbmQoJ3JlY3QnKS5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1iYWNrZ3JvdW5kJykuZGF0dW0oe25hbWU6J2JhY2tncm91bmQnfSlcbiAgICAgIF9jaGFydEFyZWEgPSBfY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ3drLWNoYXJ0LWFyZWEnKVxuXG4gICAgIyBzdGFydCB0byBidWlsZCBhbmQgc2l6ZSB0aGUgZWxlbWVudHMgZnJvbSB0b3AgdG8gYm90dG9tXG5cbiAgICAjLS0tIGNoYXJ0IGZyYW1lICh0aXRsZSwgYXhpcywgZ3JpZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd0NoYXJ0RnJhbWUgPSAobm90QW5pbWF0ZWQpIC0+XG4gICAgICBib3VuZHMgPSBfZWxlbWVudFNlbGVjdGlvbi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIF9kdXJhdGlvbiA9IGlmIG5vdEFuaW1hdGVkIHRoZW4gMCBlbHNlIG1lLmNoYXJ0KCkuYW5pbWF0aW9uRHVyYXRpb24oKVxuICAgICAgX2hlaWdodCA9IGJvdW5kcy5oZWlnaHRcbiAgICAgIF93aWR0aCA9IGJvdW5kcy53aWR0aFxuICAgICAgdGl0bGVBcmVhSGVpZ2h0ID0gZHJhd1RpdGxlQXJlYShfY2hhcnQudGl0bGUoKSwgX2NoYXJ0LnN1YlRpdGxlKCkpXG5cbiAgICAgICMtLS0gZ2V0IHNpemluZyBvZiBmcmFtZSBjb21wb25lbnRzIGJlZm9yZSBwb3NpdGlvbmluZyB0aGVtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgYXhpc1JlY3QgPSB7dG9wOntoZWlnaHQ6MCwgd2lkdGg6MH0sYm90dG9tOntoZWlnaHQ6MCwgd2lkdGg6MH0sbGVmdDp7aGVpZ2h0OjAsIHdpZHRoOjB9LHJpZ2h0OntoZWlnaHQ6MCwgd2lkdGg6MH19XG4gICAgICBsYWJlbEhlaWdodCA9IHt0b3A6MCAsYm90dG9tOjAsIGxlZnQ6MCwgcmlnaHQ6MH1cblxuICAgICAgZm9yIGwgaW4gX2xheW91dHNcbiAgICAgICAgZm9yIGssIHMgb2YgbC5zY2FsZXMoKS5hbGxLaW5kcygpXG4gICAgICAgICAgaWYgcy5zaG93QXhpcygpXG4gICAgICAgICAgICBzLmF4aXMoKS5zY2FsZShzLnNjYWxlKCkpLm9yaWVudChzLmF4aXNPcmllbnQoKSkgICMgZW5zdXJlIHRoZSBheGlzIHdvcmtzIG9uIHRoZSByaWdodCBzY2FsZVxuICAgICAgICAgICAgYXhpc1JlY3Rbcy5heGlzT3JpZW50KCldID0gZ2V0QXhpc1JlY3QocylcbiAgICAgICAgICAgICMtLS0gZHJhdyBsYWJlbCAtLS1cbiAgICAgICAgICAgIGxhYmVsID0gX2NvbnRhaW5lci5zZWxlY3QoXCIud2stY2hhcnQtbGFiZWwud2stY2hhcnQtI3tzLmF4aXNPcmllbnQoKX1cIilcbiAgICAgICAgICAgIGlmIHMuc2hvd0xhYmVsKClcbiAgICAgICAgICAgICAgaWYgbGFiZWwuZW1wdHkoKVxuICAgICAgICAgICAgICAgIGxhYmVsID0gX2NvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3ay1jaGFydC1sYWJlbCB3ay1jaGFydC0nICArIHMuYXhpc09yaWVudCgpKVxuICAgICAgICAgICAgICBsYWJlbEhlaWdodFtzLmF4aXNPcmllbnQoKV0gPSBkcmF3QW5kUG9zaXRpb25UZXh0KGxhYmVsLCBzLmF4aXNMYWJlbCgpLCAnd2stY2hhcnQtbGFiZWwtdGV4dCcsICcxLjVlbScpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsYWJlbC5yZW1vdmUoKVxuICAgICAgICAgIGlmIHMuYXhpc09yaWVudE9sZCgpIGFuZCBzLmF4aXNPcmllbnRPbGQoKSBpc250IHMuYXhpc09yaWVudCgpXG4gICAgICAgICAgICBfcmVtb3ZlQXhpcyhzLmF4aXNPcmllbnRPbGQoKSlcbiAgICAgICAgICAgIF9yZW1vdmVMYWJlbChzLmF4aXNPcmllbnRPbGQoKSlcblxuXG5cbiAgICAgICMtLS0gY29tcHV0ZSBzaXplIG9mIHRoZSBkcmF3aW5nIGFyZWEgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2ZyYW1lSGVpZ2h0ID0gdGl0bGVBcmVhSGVpZ2h0ICsgYXhpc1JlY3QudG9wLmhlaWdodCArIGxhYmVsSGVpZ2h0LnRvcCArIGF4aXNSZWN0LmJvdHRvbS5oZWlnaHQgKyBsYWJlbEhlaWdodC5ib3R0b20gKyBfbWFyZ2luLnRvcCArIF9tYXJnaW4uYm90dG9tXG4gICAgICBfZnJhbWVXaWR0aCA9IGF4aXNSZWN0LnJpZ2h0LndpZHRoICsgbGFiZWxIZWlnaHQucmlnaHQgKyBheGlzUmVjdC5sZWZ0LndpZHRoICsgbGFiZWxIZWlnaHQubGVmdCArIF9tYXJnaW4ubGVmdCArIF9tYXJnaW4ucmlnaHRcblxuICAgICAgaWYgX2ZyYW1lSGVpZ2h0IDwgX2hlaWdodFxuICAgICAgICBfaW5uZXJIZWlnaHQgPSBfaGVpZ2h0IC0gX2ZyYW1lSGVpZ2h0XG4gICAgICBlbHNlXG4gICAgICAgIF9pbm5lckhlaWdodCA9IDBcblxuICAgICAgaWYgX2ZyYW1lV2lkdGggPCBfd2lkdGhcbiAgICAgICAgX2lubmVyV2lkdGggPSBfd2lkdGggLSBfZnJhbWVXaWR0aFxuICAgICAgZWxzZVxuICAgICAgICBfaW5uZXJXaWR0aCA9IDBcblxuICAgICAgIy0tLSByZXNldCBzY2FsZSByYW5nZXMgYW5kIHJlZHJhdyBheGlzIHdpdGggYWRqdXN0ZWQgcmFuZ2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIGsgaXMgJ3gnXG4gICAgICAgICAgICBzLnJhbmdlKFswLCBfaW5uZXJXaWR0aF0pXG4gICAgICAgICAgZWxzZSBpZiBrIGlzICd5J1xuICAgICAgICAgICAgcy5yYW5nZShbX2lubmVySGVpZ2h0LCAwXSlcbiAgICAgICAgICBpZiBzLnNob3dBeGlzKClcbiAgICAgICAgICAgIGRyYXdBeGlzKHMpXG5cbiAgICAgICMtLS0gcG9zaXRpb24gZnJhbWUgZWxlbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBsZWZ0TWFyZ2luID0gYXhpc1JlY3QubGVmdC53aWR0aCArIGxhYmVsSGVpZ2h0LmxlZnQgKyBfbWFyZ2luLmxlZnRcbiAgICAgIHRvcE1hcmdpbiA9IHRpdGxlQXJlYUhlaWdodCArIGF4aXNSZWN0LnRvcC5oZWlnaHQgICsgbGFiZWxIZWlnaHQudG9wICsgX21hcmdpbi50b3BcblxuICAgICAgX3NwYWNlZENvbnRhaW5lciA9IF9jb250YWluZXIuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tsZWZ0TWFyZ2lufSwgI3t0b3BNYXJnaW59KVwiKVxuICAgICAgX3N2Zy5zZWxlY3QoXCIjd2stY2hhcnQtY2xpcC0je19jb250YWluZXJJZH0gcmVjdFwiKS5hdHRyKCd3aWR0aCcsIF9pbm5lcldpZHRoKS5hdHRyKCdoZWlnaHQnLCBfaW5uZXJIZWlnaHQpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LW92ZXJsYXk+LndrLWNoYXJ0LWJhY2tncm91bmQnKS5hdHRyKCd3aWR0aCcsIF9pbm5lcldpZHRoKS5hdHRyKCdoZWlnaHQnLCBfaW5uZXJIZWlnaHQpXG4gICAgICBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWFyZWEnKS5zdHlsZSgnY2xpcC1wYXRoJywgXCJ1cmwoI3drLWNoYXJ0LWNsaXAtI3tfY29udGFpbmVySWR9KVwiKVxuICAgICAgX3NwYWNlZENvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1vdmVybGF5Jykuc3R5bGUoJ2NsaXAtcGF0aCcsIFwidXJsKCN3ay1jaGFydC1jbGlwLSN7X2NvbnRhaW5lcklkfSlcIilcblxuICAgICAgX2NvbnRhaW5lci5zZWxlY3RBbGwoJy53ay1jaGFydC1heGlzLndrLWNoYXJ0LXJpZ2h0JykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3tfaW5uZXJXaWR0aH0sIDApXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdEFsbCgnLndrLWNoYXJ0LWF4aXMud2stY2hhcnQtYm90dG9tJykuYXR0cigndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoMCwgI3tfaW5uZXJIZWlnaHR9KVwiKVxuXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LWxlZnQnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgjey1heGlzUmVjdC5sZWZ0LndpZHRoLWxhYmVsSGVpZ2h0LmxlZnQgLyAyIH0sICN7X2lubmVySGVpZ2h0LzJ9KSByb3RhdGUoLTkwKVwiKVxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1sYWJlbC53ay1jaGFydC1yaWdodCcpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGgrYXhpc1JlY3QucmlnaHQud2lkdGggKyBsYWJlbEhlaWdodC5yaWdodCAvIDJ9LCAje19pbm5lckhlaWdodC8yfSkgcm90YXRlKDkwKVwiKVxuICAgICAgX2NvbnRhaW5lci5zZWxlY3QoJy53ay1jaGFydC1sYWJlbC53ay1jaGFydC10b3AnKS5hdHRyKCd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje19pbm5lcldpZHRoIC8gMn0sICN7LWF4aXNSZWN0LnRvcC5oZWlnaHQgLSBsYWJlbEhlaWdodC50b3AgLyAyIH0pXCIpXG4gICAgICBfY29udGFpbmVyLnNlbGVjdCgnLndrLWNoYXJ0LWxhYmVsLndrLWNoYXJ0LWJvdHRvbScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGggLyAyfSwgI3tfaW5uZXJIZWlnaHQgKyBheGlzUmVjdC5ib3R0b20uaGVpZ2h0ICsgbGFiZWxIZWlnaHQuYm90dG9tIH0pXCIpXG5cbiAgICAgIF9jb250YWluZXIuc2VsZWN0QWxsKCcud2stY2hhcnQtdGl0bGUtYXJlYScpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7X2lubmVyV2lkdGgvMn0sICN7LXRvcE1hcmdpbiArIF90aXRsZUhlaWdodH0pXCIpXG5cbiAgICAgICMtLS0gZmluYWxseSwgZHJhdyBncmlkIGxpbmVzXG5cbiAgICAgIGZvciBsIGluIF9sYXlvdXRzXG4gICAgICAgIGZvciBrLCBzIG9mIGwuc2NhbGVzKCkuYWxsS2luZHMoKVxuICAgICAgICAgIGlmIHMuc2hvd0F4aXMoKSBhbmQgcy5zaG93R3JpZCgpXG4gICAgICAgICAgICBkcmF3R3JpZChzKVxuXG4gICAgICBfY2hhcnQuYmVoYXZpb3IoKS5vdmVybGF5KF9vdmVybGF5KVxuICAgICAgX2NoYXJ0LmJlaGF2aW9yKCkuY29udGFpbmVyKF9jaGFydEFyZWEpXG5cbiAgICAjLS0tIEJydXNoIEFjY2VsZXJhdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZHJhd1NpbmdsZUF4aXMgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBzY2FsZS5zaG93QXhpcygpXG4gICAgICAgIGEgPSBfc3BhY2VkQ29udGFpbmVyLnNlbGVjdChcIi53ay1jaGFydC1heGlzLndrLWNoYXJ0LSN7c2NhbGUuYXhpcygpLm9yaWVudCgpfVwiKVxuICAgICAgICBhLmNhbGwoc2NhbGUuYXhpcygpKVxuXG4gICAgICAgIGlmIHNjYWxlLnNob3dHcmlkKClcbiAgICAgICAgICBkcmF3R3JpZChzY2FsZSwgdHJ1ZSlcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGNvbnRhaW5lciIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xheW91dCcsICgkbG9nLCBzY2FsZSwgc2NhbGVMaXN0LCB0aW1pbmcpIC0+XG5cbiAgbGF5b3V0Q250ciA9IDBcblxuICBsYXlvdXQgPSAoKSAtPlxuICAgIF9pZCA9IFwibGF5b3V0I3tsYXlvdXRDbnRyKyt9XCJcbiAgICBfY29udGFpbmVyID0gdW5kZWZpbmVkXG4gICAgX2RhdGEgPSB1bmRlZmluZWRcbiAgICBfY2hhcnQgPSB1bmRlZmluZWRcbiAgICBfc2NhbGVMaXN0ID0gc2NhbGVMaXN0KClcbiAgICBfbGF5b3V0TGlmZUN5Y2xlID0gZDMuZGlzcGF0Y2goJ2NvbmZpZ3VyZScsICdkcmF3JywgJ3ByZXBhcmVEYXRhJywgJ2JydXNoJywgJ3JlZHJhdycsICdkcmF3QXhpcycsICd1cGRhdGUnLCAndXBkYXRlQXR0cnMnLCAnYnJ1c2hEcmF3JylcblxuICAgIG1lID0gKCkgLT5cblxuICAgIG1lLmlkID0gKGlkKSAtPlxuICAgICAgcmV0dXJuIF9pZFxuXG4gICAgbWUuY2hhcnQgPSAoY2hhcnQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2NoYXJ0XG4gICAgICBlbHNlXG4gICAgICAgIF9jaGFydCA9IGNoYXJ0XG4gICAgICAgIF9zY2FsZUxpc3QucGFyZW50U2NhbGVzKGNoYXJ0LnNjYWxlcygpKVxuICAgICAgICBfY2hhcnQubGlmZUN5Y2xlKCkub24gXCJjb25maWd1cmUuI3ttZS5pZCgpfVwiLCAoKSAtPiBfbGF5b3V0TGlmZUN5Y2xlLmNvbmZpZ3VyZS5hcHBseShtZS5zY2FsZXMoKSkgI3Bhc3N0aHJvdWdoXG4gICAgICAgIF9jaGFydC5saWZlQ3ljbGUoKS5vbiBcImRyYXdDaGFydC4je21lLmlkKCl9XCIsIG1lLmRyYXcgIyByZWdpc3RlciBmb3IgdGhlIGRyYXdpbmcgZXZlbnRcbiAgICAgICAgX2NoYXJ0LmxpZmVDeWNsZSgpLm9uIFwicHJlcGFyZURhdGEuI3ttZS5pZCgpfVwiLCBtZS5wcmVwYXJlRGF0YVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnNjYWxlcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX3NjYWxlTGlzdFxuXG4gICAgbWUuc2NhbGVQcm9wZXJ0aWVzID0gKCkgLT5cbiAgICAgIHJldHVybiBtZS5zY2FsZXMoKS5nZXRTY2FsZVByb3BlcnRpZXMoKVxuXG4gICAgbWUuY29udGFpbmVyID0gKG9iaikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY29udGFpbmVyXG4gICAgICBlbHNlXG4gICAgICAgIF9jb250YWluZXIgPSBvYmpcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5iZWhhdmlvciA9ICgpIC0+XG4gICAgICBtZS5jaGFydCgpLmJlaGF2aW9yKClcblxuICAgIG1lLnByZXBhcmVEYXRhID0gKGRhdGEpIC0+XG4gICAgICBhcmdzID0gW11cbiAgICAgIGZvciBraW5kIGluIFsneCcsJ3knLCAnY29sb3InXVxuICAgICAgICBhcmdzLnB1c2goX3NjYWxlTGlzdC5nZXRLaW5kKGtpbmQpKVxuICAgICAgX2xheW91dExpZmVDeWNsZS5wcmVwYXJlRGF0YS5hcHBseShkYXRhLCBhcmdzKVxuXG4gICAgbWUubGlmZUN5Y2xlID0gKCktPlxuICAgICAgcmV0dXJuIF9sYXlvdXRMaWZlQ3ljbGVcblxuXG4gICAgIy0tLSBEUllvdXQgZnJvbSBkcmF3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldERyYXdBcmVhID0gKCkgLT5cbiAgICAgIGNvbnRhaW5lciA9IF9jb250YWluZXIuZ2V0Q2hhcnRBcmVhKClcbiAgICAgIGRyYXdBcmVhID0gY29udGFpbmVyLnNlbGVjdChcIi4je21lLmlkKCl9XCIpXG4gICAgICBpZiBkcmF3QXJlYS5lbXB0eSgpXG4gICAgICAgIGRyYXdBcmVhID0gY29udGFpbmVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgKGQpIC0+IG1lLmlkKCkpXG4gICAgICByZXR1cm4gZHJhd0FyZWFcblxuICAgIGJ1aWxkQXJncyA9IChkYXRhLCBub3RBbmltYXRlZCkgLT5cbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGhlaWdodDpfY29udGFpbmVyLmhlaWdodCgpLFxuICAgICAgICB3aWR0aDpfY29udGFpbmVyLndpZHRoKCksXG4gICAgICAgIG1hcmdpbnM6X2NvbnRhaW5lci5tYXJnaW5zKCksXG4gICAgICAgIGR1cmF0aW9uOiBpZiBub3RBbmltYXRlZCB0aGVuIDAgZWxzZSBtZS5jaGFydCgpLmFuaW1hdGlvbkR1cmF0aW9uKClcbiAgICAgIH1cbiAgICAgIGFyZ3MgPSBbZGF0YSwgb3B0aW9uc11cbiAgICAgIGZvciBraW5kIGluIFsneCcsJ3knLCAnY29sb3InLCAnc2l6ZScsICdzaGFwZSddXG4gICAgICAgIGFyZ3MucHVzaChfc2NhbGVMaXN0LmdldEtpbmQoa2luZCkpXG4gICAgICByZXR1cm4gYXJnc1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLmRyYXcgPSAoZGF0YSwgbm90QW5pbWF0ZWQpIC0+XG4gICAgICBfZGF0YSA9IGRhdGFcblxuICAgICAgX2xheW91dExpZmVDeWNsZS5kcmF3LmFwcGx5KGdldERyYXdBcmVhKCksIGJ1aWxkQXJncyhkYXRhLCBub3RBbmltYXRlZCkpXG5cbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ3JlZHJhdycsIG1lLnJlZHJhd1xuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAndXBkYXRlJywgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS51cGRhdGVcbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ2RyYXdBeGlzJywgbWUuY2hhcnQoKS5saWZlQ3ljbGUoKS5kcmF3QXhpc1xuICAgICAgX2xheW91dExpZmVDeWNsZS5vbiAndXBkYXRlQXR0cnMnLCBtZS5jaGFydCgpLmxpZmVDeWNsZSgpLnVwZGF0ZUF0dHJzXG5cbiAgICAgIF9sYXlvdXRMaWZlQ3ljbGUub24gJ2JydXNoJywgKGF4aXMsIG5vdEFuaW1hdGVkKSAtPlxuICAgICAgICBfY29udGFpbmVyLmRyYXdTaW5nbGVBeGlzKGF4aXMpXG4gICAgICAgIF9sYXlvdXRMaWZlQ3ljbGUuYnJ1c2hEcmF3LmFwcGx5KGdldERyYXdBcmVhKCksIGJ1aWxkQXJncyhfZGF0YSwgbm90QW5pbWF0ZWQpKVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIGxheW91dCIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xlZ2VuZCcsICgkbG9nLCAkY29tcGlsZSwgJHJvb3RTY29wZSwgJHRlbXBsYXRlQ2FjaGUsIHRlbXBsYXRlRGlyKSAtPlxuXG4gIGxlZ2VuZENudCA9IDBcblxuICB1bmlxdWVWYWx1ZXMgPSAoYXJyKSAtPlxuICAgIHNldCA9IHt9XG4gICAgZm9yIGUgaW4gYXJyXG4gICAgICBzZXRbZV0gPSAwXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNldClcblxuICBsZWdlbmQgPSAoKSAtPlxuXG4gICAgX2lkID0gXCJsZWdlbmQtI3tsZWdlbmRDbnQrK31cIlxuICAgIF9wb3NpdGlvbiA9ICd0b3AtcmlnaHQnXG4gICAgX3NjYWxlID0gdW5kZWZpbmVkXG4gICAgX3RlbXBsYXRlUGF0aCA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmRTY29wZSA9ICRyb290U2NvcGUuJG5ldyh0cnVlKVxuICAgIF90ZW1wbGF0ZSA9IHVuZGVmaW5lZFxuICAgIF9wYXJzZWRUZW1wbGF0ZSA9IHVuZGVmaW5lZFxuICAgIF9jb250YWluZXJEaXYgPSB1bmRlZmluZWRcbiAgICBfbGVnZW5kRGl2ID0gdW5kZWZpbmVkXG4gICAgX3RpdGxlID0gdW5kZWZpbmVkXG4gICAgX2xheW91dCA9IHVuZGVmaW5lZFxuICAgIF9kYXRhID0gdW5kZWZpbmVkXG4gICAgX29wdGlvbnMgPSB1bmRlZmluZWRcbiAgICBfc2hvdyA9IGZhbHNlXG4gICAgX3Nob3dWYWx1ZXMgPSBmYWxzZVxuXG4gICAgbWUgPSB7fVxuXG4gICAgbWUucG9zaXRpb24gPSAocG9zKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wb3NpdGlvblxuICAgICAgZWxzZVxuICAgICAgICBfcG9zaXRpb24gPSBwb3NcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zaG93ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvdyA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuc2hvd1ZhbHVlcyA9ICh2YWwpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3Nob3dWYWx1ZXNcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dWYWx1ZXMgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmRpdiA9IChzZWxlY3Rpb24pIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2xlZ2VuZERpdlxuICAgICAgZWxzZVxuICAgICAgICBfbGVnZW5kRGl2ID0gc2VsZWN0aW9uXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5b3V0XG4gICAgICBlbHNlXG4gICAgICAgIF9sYXlvdXQgPSBsYXlvdXRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5zY2FsZSA9IChzY2FsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2NhbGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3NjYWxlID0gc2NhbGVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50aXRsZSA9ICh0aXRsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGl0bGVcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpdGxlID0gdGl0bGVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50ZW1wbGF0ZSA9IChwYXRoKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF90ZW1wbGF0ZVBhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgX3RlbXBsYXRlUGF0aCA9IHBhdGhcbiAgICAgICAgX3RlbXBsYXRlID0gJHRlbXBsYXRlQ2FjaGUuZ2V0KF90ZW1wbGF0ZVBhdGgpXG4gICAgICAgIF9wYXJzZWRUZW1wbGF0ZSA9ICRjb21waWxlKF90ZW1wbGF0ZSkoX2xlZ2VuZFNjb3BlKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmRyYXcgPSAoZGF0YSwgb3B0aW9ucykgLT5cbiAgICAgIF9kYXRhID0gZGF0YVxuICAgICAgX29wdGlvbnMgPSBvcHRpb25zXG4gICAgICAjJGxvZy5pbmZvICdkcmF3aW5nIExlZ2VuZCdcbiAgICAgIF9jb250YWluZXJEaXYgPSBfbGVnZW5kRGl2IG9yIGQzLnNlbGVjdChtZS5zY2FsZSgpLnBhcmVudCgpLmNvbnRhaW5lcigpLmVsZW1lbnQoKSkuc2VsZWN0KCcud2stY2hhcnQnKVxuICAgICAgaWYgbWUuc2hvdygpXG4gICAgICAgIGlmIF9jb250YWluZXJEaXYuc2VsZWN0KCcud2stY2hhcnQtbGVnZW5kJykuZW1wdHkoKVxuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChfY29udGFpbmVyRGl2Lm5vZGUoKSkuYXBwZW5kKF9wYXJzZWRUZW1wbGF0ZSlcblxuICAgICAgICBpZiBtZS5zaG93VmFsdWVzKClcbiAgICAgICAgICBsYXllcnMgPSB1bmlxdWVWYWx1ZXMoX3NjYWxlLnZhbHVlKGRhdGEpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJzID0gX3NjYWxlLmxheWVyS2V5cyhkYXRhKVxuXG4gICAgICAgIHMgPSBfc2NhbGUuc2NhbGUoKVxuICAgICAgICBpZiBtZS5sYXlvdXQoKT8uc2NhbGVzKCkubGF5ZXJTY2FsZSgpXG4gICAgICAgICAgcyA9IG1lLmxheW91dCgpLnNjYWxlcygpLmxheWVyU2NhbGUoKS5zY2FsZSgpXG4gICAgICAgIGlmIF9zY2FsZS5raW5kKCkgaXNudCAnc2hhcGUnXG4gICAgICAgICAgX2xlZ2VuZFNjb3BlLmxlZ2VuZFJvd3MgPSBsYXllcnMubWFwKChkKSAtPiB7dmFsdWU6ZCwgY29sb3I6eydiYWNrZ3JvdW5kLWNvbG9yJzpzKGQpfX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfbGVnZW5kU2NvcGUubGVnZW5kUm93cyA9IGxheWVycy5tYXAoKGQpIC0+IHt2YWx1ZTpkLCBwYXRoOmQzLnN2Zy5zeW1ib2woKS50eXBlKHMoZCkpLnNpemUoODApKCl9KVxuICAgICAgICAgICMkbG9nLmxvZyBfbGVnZW5kU2NvcGUubGVnZW5kUm93c1xuICAgICAgICBfbGVnZW5kU2NvcGUuc2hvd0xlZ2VuZCA9IHRydWVcbiAgICAgICAgX2xlZ2VuZFNjb3BlLnBvc2l0aW9uID0ge1xuICAgICAgICAgIHBvc2l0aW9uOiBpZiBfbGVnZW5kRGl2IHRoZW4gJ3JlbGF0aXZlJyBlbHNlICdhYnNvbHV0ZSdcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIG5vdCBfbGVnZW5kRGl2XG4gICAgICAgICAgY29udGFpbmVyUmVjdCA9IF9jb250YWluZXJEaXYubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgY2hhcnRBcmVhUmVjdCA9IF9jb250YWluZXJEaXYuc2VsZWN0KCcud2stY2hhcnQtb3ZlcmxheSByZWN0Jykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgZm9yIHAgaW4gX3Bvc2l0aW9uLnNwbGl0KCctJylcbiAgICAgICAgICAgICAgX2xlZ2VuZFNjb3BlLnBvc2l0aW9uW3BdID0gXCIje01hdGguYWJzKGNvbnRhaW5lclJlY3RbcF0gLSBjaGFydEFyZWFSZWN0W3BdKX1weFwiXG4gICAgICAgIF9sZWdlbmRTY29wZS50aXRsZSA9IF90aXRsZVxuICAgICAgZWxzZVxuICAgICAgICBfcGFyc2VkVGVtcGxhdGUucmVtb3ZlKClcbiAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucmVnaXN0ZXIgPSAobGF5b3V0KSAtPlxuICAgICAgbGF5b3V0LmxpZmVDeWNsZSgpLm9uIFwiZHJhdy4je19pZH1cIiwgbWUuZHJhd1xuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS50ZW1wbGF0ZSh0ZW1wbGF0ZURpciArICdsZWdlbmQuaHRtbCcpXG5cbiAgICBtZS5yZWRyYXcgPSAoKSAtPlxuICAgICAgaWYgX2RhdGEgYW5kIF9vcHRpb25zXG4gICAgICAgIG1lLmRyYXcoX2RhdGEsIF9vcHRpb25zKVxuICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcblxuICByZXR1cm4gbGVnZW5kIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnc2NhbGUnLCAoJGxvZywgbGVnZW5kLCBmb3JtYXREZWZhdWx0cykgLT5cblxuICBzY2FsZSA9ICgpIC0+XG4gICAgX2lkID0gJydcbiAgICBfc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgIF9zY2FsZVR5cGUgPSAnbGluZWFyJ1xuICAgIF9leHBvbmVudCA9IDFcbiAgICBfaXNPcmRpbmFsID0gZmFsc2VcbiAgICBfZG9tYWluID0gdW5kZWZpbmVkXG4gICAgX2RvbWFpbkNhbGMgPSB1bmRlZmluZWRcbiAgICBfY2FsY3VsYXRlZERvbWFpbiA9IHVuZGVmaW5lZFxuICAgIF9yZXNldE9uTmV3RGF0YSA9IGZhbHNlXG4gICAgX3Byb3BlcnR5ID0gJydcbiAgICBfbGF5ZXJQcm9wID0gJydcbiAgICBfbGF5ZXJFeGNsdWRlID0gW11cbiAgICBfcmFuZ2UgPSB1bmRlZmluZWRcbiAgICBfcmFuZ2VQYWRkaW5nID0gMC4zXG4gICAgX3JhbmdlT3V0ZXJQYWRkaW5nID0gMC4zXG4gICAgX2lucHV0Rm9ybWF0U3RyaW5nID0gdW5kZWZpbmVkXG4gICAgX2lucHV0Rm9ybWF0Rm4gPSAoZGF0YSkgLT4gaWYgaXNOYU4oK2RhdGEpIG9yIF8uaXNEYXRlKGRhdGEpIHRoZW4gZGF0YSBlbHNlICtkYXRhXG5cbiAgICBfc2hvd0F4aXMgPSBmYWxzZVxuICAgIF9heGlzT3JpZW50ID0gdW5kZWZpbmVkXG4gICAgX2F4aXNPcmllbnRPbGQgPSB1bmRlZmluZWRcbiAgICBfYXhpcyA9IHVuZGVmaW5lZFxuICAgIF90aWNrcyA9IHVuZGVmaW5lZFxuICAgIF90aWNrRm9ybWF0ID0gdW5kZWZpbmVkXG4gICAgX3JvdGF0ZVRpY2tMYWJlbHMgPSB1bmRlZmluZWRcbiAgICBfc2hvd0xhYmVsID0gZmFsc2VcbiAgICBfYXhpc0xhYmVsID0gdW5kZWZpbmVkXG4gICAgX3Nob3dHcmlkID0gZmFsc2VcbiAgICBfaXNIb3Jpem9udGFsID0gZmFsc2VcbiAgICBfaXNWZXJ0aWNhbCA9IGZhbHNlXG4gICAgX2tpbmQgPSB1bmRlZmluZWRcbiAgICBfcGFyZW50ID0gdW5kZWZpbmVkXG4gICAgX2NoYXJ0ID0gdW5kZWZpbmVkXG4gICAgX2xheW91dCA9IHVuZGVmaW5lZFxuICAgIF9sZWdlbmQgPSBsZWdlbmQoKVxuICAgIF9vdXRwdXRGb3JtYXRTdHJpbmcgPSB1bmRlZmluZWRcbiAgICBfb3V0cHV0Rm9ybWF0Rm4gPSB1bmRlZmluZWRcblxuICAgIG1lID0gKCkgLT5cblxuICAgICMtLS0tIHV0aWxpdHkgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGtleXMgPSAoZGF0YSkgLT4gaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gXy5yZWplY3QoXy5rZXlzKGRhdGFbMF0pLCAoZCkgLT4gZCBpcyAnJCRoYXNoS2V5JykgZWxzZSBfLnJlamVjdChfLmtleXMoZGF0YSksIChkKSAtPiBkIGlzICckJGhhc2hLZXknKVxuXG4gICAgbGF5ZXJUb3RhbCA9IChkLCBsYXllcktleXMpIC0+XG4gICAgICBsYXllcktleXMucmVkdWNlKFxuICAgICAgICAocHJldiwgbmV4dCkgLT4gK3ByZXYgKyArbWUubGF5ZXJWYWx1ZShkLG5leHQpXG4gICAgICAsIDApXG5cbiAgICBsYXllck1heCA9IChkYXRhLCBsYXllcktleXMpIC0+XG4gICAgICBkMy5tYXgoZGF0YSwgKGQpIC0+IGQzLm1heChsYXllcktleXMsIChrKSAtPiBtZS5sYXllclZhbHVlKGQsaykpKVxuXG4gICAgbGF5ZXJNaW4gPSAoZGF0YSwgbGF5ZXJLZXlzKSAtPlxuICAgICAgZDMubWluKGRhdGEsIChkKSAtPiBkMy5taW4obGF5ZXJLZXlzLCAoaykgLT4gbWUubGF5ZXJWYWx1ZShkLGspKSlcblxuICAgIHBhcnNlZFZhbHVlID0gKHYpIC0+XG4gICAgICBpZiBfaW5wdXRGb3JtYXRGbi5wYXJzZSB0aGVuIF9pbnB1dEZvcm1hdEZuLnBhcnNlKHYpIGVsc2UgX2lucHV0Rm9ybWF0Rm4odilcblxuICAgIGNhbGNEb21haW4gPSB7XG4gICAgICBleHRlbnQ6IChkYXRhKSAtPlxuICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgcmV0dXJuIFtsYXllck1pbihkYXRhLCBsYXllcktleXMpLCBsYXllck1heChkYXRhLCBsYXllcktleXMpXVxuICAgICAgbWF4OiAoZGF0YSkgLT5cbiAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgIHJldHVybiBbMCwgbGF5ZXJNYXgoZGF0YSwgbGF5ZXJLZXlzKV1cbiAgICAgIG1pbjogKGRhdGEpIC0+XG4gICAgICAgIGxheWVyS2V5cyA9IG1lLmxheWVyS2V5cyhkYXRhKVxuICAgICAgICByZXR1cm4gWzAsIGxheWVyTWluKGRhdGEsIGxheWVyS2V5cyldXG4gICAgICB0b3RhbEV4dGVudDogKGRhdGEpIC0+XG4gICAgICAgIGlmIGRhdGFbMF0uaGFzT3duUHJvcGVydHkoJ3RvdGFsJylcbiAgICAgICAgICByZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgZC50b3RhbCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYXllcktleXMgPSBtZS5sYXllcktleXMoZGF0YSlcbiAgICAgICAgICByZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgbGF5ZXJUb3RhbChkLCBsYXllcktleXMpKSlcbiAgICAgIHRvdGFsOiAoZGF0YSkgLT5cbiAgICAgICAgaWYgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eSgndG90YWwnKVxuICAgICAgICAgIHJldHVybiBbMCwgZDMubWF4KGRhdGEubWFwKChkKSAtPlxuICAgICAgICAgICAgZC50b3RhbCkpXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGF5ZXJLZXlzID0gbWUubGF5ZXJLZXlzKGRhdGEpXG4gICAgICAgICAgcmV0dXJuIFswLCBkMy5tYXgoZGF0YS5tYXAoKGQpIC0+XG4gICAgICAgICAgICBsYXllclRvdGFsKGQsIGxheWVyS2V5cykpKV1cbiAgICAgIH1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5pZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2tpbmQgKyAnLicgKyBfcGFyZW50LmlkKClcblxuICAgIG1lLmtpbmQgPSAoa2luZCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfa2luZFxuICAgICAgZWxzZVxuICAgICAgICBfa2luZCA9IGtpbmRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5wYXJlbnQgPSAocGFyZW50KSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wYXJlbnRcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhcmVudCA9IHBhcmVudFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmNoYXJ0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfY2hhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgX2NoYXJ0ID0gdmFsXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5sYXlvdXQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXlvdXRcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheW91dCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnNjYWxlID0gKCkgLT5cbiAgICAgIHJldHVybiBfc2NhbGVcblxuICAgIG1lLmxlZ2VuZCA9ICgpIC0+XG4gICAgICByZXR1cm4gX2xlZ2VuZFxuXG4gICAgbWUuaXNPcmRpbmFsID0gKCkgLT5cbiAgICAgIF9pc09yZGluYWxcblxuICAgIG1lLmlzSG9yaXpvbnRhbCA9ICh0cnVlRmFsc2UpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX2lzSG9yaXpvbnRhbFxuICAgICAgZWxzZVxuICAgICAgICBfaXNIb3Jpem9udGFsID0gdHJ1ZUZhbHNlXG4gICAgICAgIGlmIHRydWVGYWxzZVxuICAgICAgICAgIF9pc1ZlcnRpY2FsID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5pc1ZlcnRpY2FsID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaXNWZXJ0aWNhbFxuICAgICAgZWxzZVxuICAgICAgICBfaXNWZXJ0aWNhbCA9IHRydWVGYWxzZVxuICAgICAgICBpZiB0cnVlRmFsc2VcbiAgICAgICAgICBfaXNIb3Jpem9udGFsID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0gU2NhbGVUeXBlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2NhbGVUeXBlID0gKHR5cGUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlVHlwZVxuICAgICAgZWxzZVxuICAgICAgICBpZiBkMy5zY2FsZS5oYXNPd25Qcm9wZXJ0eSh0eXBlKSAjIHN1cHBvcnQgdGhlIGZ1bGwgbGlzdCBvZiBkMyBzY2FsZSB0eXBlc1xuICAgICAgICAgIF9zY2FsZSA9IGQzLnNjYWxlW3R5cGVdKClcbiAgICAgICAgICBfc2NhbGVUeXBlID0gdHlwZVxuICAgICAgICAgIG1lLmZvcm1hdChmb3JtYXREZWZhdWx0cy5udW1iZXIpXG4gICAgICAgIGVsc2UgaWYgdHlwZSBpcyAndGltZScgIyB0aW1lIHNjYWxlIGlzIGluIGQzLnRpbWUgb2JqZWN0LCBub3QgaW4gZDMuc2NhbGUuXG4gICAgICAgICAgX3NjYWxlID0gZDMudGltZS5zY2FsZSgpXG4gICAgICAgICAgX3NjYWxlVHlwZSA9ICd0aW1lJ1xuICAgICAgICAgIGlmIF9pbnB1dEZvcm1hdFN0cmluZ1xuICAgICAgICAgICAgbWUuZGF0YUZvcm1hdChfaW5wdXRGb3JtYXRTdHJpbmcpXG4gICAgICAgICAgbWUuZm9ybWF0KGZvcm1hdERlZmF1bHRzLmRhdGUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkbG9nLmVycm9yICdFcnJvcjogaWxsZWdhbCBzY2FsZSB0eXBlOicsIHR5cGVcblxuICAgICAgICBfaXNPcmRpbmFsID0gX3NjYWxlVHlwZSBpbiBbJ29yZGluYWwnLCAnY2F0ZWdvcnkxMCcsICdjYXRlZ29yeTIwJywgJ2NhdGVnb3J5MjBiJywgJ2NhdGVnb3J5MjBjJ11cbiAgICAgICAgaWYgX3JhbmdlXG4gICAgICAgICAgbWUucmFuZ2UoX3JhbmdlKVxuXG4gICAgICAgIGlmIF9zaG93QXhpc1xuICAgICAgICAgIF9heGlzLnNjYWxlKF9zY2FsZSlcblxuICAgICAgICBpZiBfZXhwb25lbnQgYW5kIF9zY2FsZVR5cGUgaXMgJ3BvdydcbiAgICAgICAgICBfc2NhbGUuZXhwb25lbnQoX2V4cG9uZW50KVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmV4cG9uZW50ID0gKHZhbHVlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9leHBvbmVudFxuICAgICAgZWxzZVxuICAgICAgICBfZXhwb25lbnQgPSB2YWx1ZVxuICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICdwb3cnXG4gICAgICAgICAgX3NjYWxlLmV4cG9uZW50KF9leHBvbmVudClcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAjLS0tIERvbWFpbiBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuZG9tYWluID0gKGRvbSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfZG9tYWluXG4gICAgICBlbHNlXG4gICAgICAgIF9kb21haW4gPSBkb21cbiAgICAgICAgaWYgXy5pc0FycmF5KF9kb21haW4pXG4gICAgICAgICAgX3NjYWxlLmRvbWFpbihfZG9tYWluKVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmRvbWFpbkNhbGMgPSAocnVsZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuICAgICAgICByZXR1cm4gaWYgX2lzT3JkaW5hbCB0aGVuIHVuZGVmaW5lZCBlbHNlIF9kb21haW5DYWxjXG4gICAgICBlbHNlXG4gICAgICAgIGlmIHJ1bGUgaW4gWydtaW4nLCAnbWF4JywgJ2V4dGVudCcsICd0b3RhbCcsICd0b3RhbEV4dGVudCddXG4gICAgICAgICAgX2RvbWFpbkNhbGMgPSBydWxlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkbG9nLmVycm9yICdpbGxlZ2FsIGRvbWFpbiBjYWxjdWxhdGlvbiBydWxlOicsIHJ1bGUsIFwiIGV4cGVjdGVkICdtaW4nLCAnbWF4JywgJ2V4dGVudCcsICd0b3RhbCcgb3IgJ3RvdGFsRXh0ZW50J1wiXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZ2V0RG9tYWluID0gKGRhdGEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3NjYWxlLmRvbWFpbigpXG4gICAgICBlbHNlXG4gICAgICAgIGlmIG5vdCBfZG9tYWluIGFuZCBtZS5kb21haW5DYWxjKClcbiAgICAgICAgICAgIHJldHVybiBfY2FsY3VsYXRlZERvbWFpblxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgX2RvbWFpblxuICAgICAgICAgICAgcmV0dXJuIF9kb21haW5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gbWUudmFsdWUoZGF0YSlcblxuICAgIG1lLnJlc2V0T25OZXdEYXRhID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfcmVzZXRPbk5ld0RhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgX3Jlc2V0T25OZXdEYXRhID0gdHJ1ZUZhbHNlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBSYW5nZSBGdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnJhbmdlID0gKHJhbmdlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zY2FsZS5yYW5nZSgpXG4gICAgICBlbHNlXG4gICAgICAgIF9yYW5nZSA9IHJhbmdlXG4gICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ29yZGluYWwnIGFuZCBtZS5raW5kKCkgaW4gWyd4JywneSddXG4gICAgICAgICAgICBfc2NhbGUucmFuZ2VCYW5kcyhyYW5nZSwgX3JhbmdlUGFkZGluZywgX3JhbmdlT3V0ZXJQYWRkaW5nKVxuICAgICAgICBlbHNlIGlmIG5vdCAoX3NjYWxlVHlwZSBpbiBbJ2NhdGVnb3J5MTAnLCAnY2F0ZWdvcnkyMCcsICdjYXRlZ29yeTIwYicsICdjYXRlZ29yeTIwYyddKVxuICAgICAgICAgIF9zY2FsZS5yYW5nZShyYW5nZSkgIyBpZ25vcmUgcmFuZ2UgZm9yIGNvbG9yIGNhdGVnb3J5IHNjYWxlc1xuXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUucmFuZ2VQYWRkaW5nID0gKGNvbmZpZykgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiB7cGFkZGluZzpfcmFuZ2VQYWRkaW5nLCBvdXRlclBhZGRpbmc6X3JhbmdlT3V0ZXJQYWRkaW5nfVxuICAgICAgZWxzZVxuICAgICAgICBfcmFuZ2VQYWRkaW5nID0gY29uZmlnLnBhZGRpbmdcbiAgICAgICAgX3JhbmdlT3V0ZXJQYWRkaW5nID0gY29uZmlnLm91dGVyUGFkZGluZ1xuICAgICAgICByZXR1cm4gbWVcblxuICAgICMtLS0gcHJvcGVydHkgcmVsYXRlZCBhdHRyaWJ1dGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5wcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9wcm9wZXJ0eVxuICAgICAgZWxzZVxuICAgICAgICBfcHJvcGVydHkgPSBuYW1lXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJQcm9wZXJ0eSA9IChuYW1lKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9sYXllclByb3BcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyUHJvcCA9IG5hbWVcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5sYXllckV4Y2x1ZGUgPSAoZXhjbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfbGF5ZXJFeGNsdWRlXG4gICAgICBlbHNlXG4gICAgICAgIF9sYXllckV4Y2x1ZGUgPSBleGNsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJLZXlzID0gKGRhdGEpIC0+XG4gICAgICBpZiBfcHJvcGVydHlcbiAgICAgICAgaWYgXy5pc0FycmF5KF9wcm9wZXJ0eSlcbiAgICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oX3Byb3BlcnR5LCBrZXlzKGRhdGEpKSAjIGVuc3VyZSBvbmx5IGtleXMgYWxzbyBpbiB0aGUgZGF0YSBhcmUgcmV0dXJuZWQgYW5kICQkaGFzaEtleSBpcyBub3QgcmV0dXJuZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBbX3Byb3BlcnR5XSAjYWx3YXlzIHJldHVybiBhbiBhcnJheSAhISFcbiAgICAgIGVsc2VcbiAgICAgICAgXy5yZWplY3Qoa2V5cyhkYXRhKSwgKGQpIC0+IGQgaW4gX2xheWVyRXhjbHVkZSlcblxuICAgICMtLS0gRGF0YSBGb3JtYXR0aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtZS5kYXRhRm9ybWF0ID0gKGZvcm1hdCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfaW5wdXRGb3JtYXRTdHJpbmdcbiAgICAgIGVsc2VcbiAgICAgICAgX2lucHV0Rm9ybWF0U3RyaW5nID0gZm9ybWF0XG4gICAgICAgIGlmIF9zY2FsZVR5cGUgaXMgJ3RpbWUnXG4gICAgICAgICAgX2lucHV0Rm9ybWF0Rm4gPSBkMy50aW1lLmZvcm1hdChmb3JtYXQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfaW5wdXRGb3JtYXRGbiA9IChkKSAtPiBkXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tLSBDb3JlIGRhdGEgdHJhbnNmb3JtYXRpb24gaW50ZXJmYWNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnZhbHVlID0gKGRhdGEpIC0+XG4gICAgICBpZiBfbGF5ZXJQcm9wXG4gICAgICAgIGlmIF8uaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBwYXJzZWRWYWx1ZShkW19wcm9wZXJ0eV1bX2xheWVyUHJvcF0pKSBlbHNlIHBhcnNlZFZhbHVlKGRhdGFbX3Byb3BlcnR5XVtfbGF5ZXJQcm9wXSlcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgXy5pc0FycmF5KGRhdGEpIHRoZW4gZGF0YS5tYXAoKGQpIC0+IHBhcnNlZFZhbHVlKGRbX3Byb3BlcnR5XSkpIGVsc2UgcGFyc2VkVmFsdWUoZGF0YVtfcHJvcGVydHldKVxuXG4gICAgbWUubGF5ZXJWYWx1ZSA9IChkYXRhLCBsYXllcktleSkgLT5cbiAgICAgIGlmIF9sYXllclByb3BcbiAgICAgICAgcGFyc2VkVmFsdWUoZGF0YVtsYXllcktleV1bX2xheWVyUHJvcF0pXG4gICAgICBlbHNlXG4gICAgICAgIHBhcnNlZFZhbHVlKGRhdGFbbGF5ZXJLZXldKVxuXG4gICAgbWUuZm9ybWF0dGVkVmFsdWUgPSAoZGF0YSkgLT5cbiAgICAgIG1lLmZvcm1hdFZhbHVlKG1lLnZhbHVlKGRhdGEpKVxuXG4gICAgbWUuZm9ybWF0VmFsdWUgPSAodmFsKSAtPlxuICAgICAgaWYgX291dHB1dEZvcm1hdFN0cmluZyBhbmQgdmFsIGFuZCAgKHZhbC5nZXRVVENEYXRlIG9yIG5vdCBpc05hTih2YWwpKVxuICAgICAgICBfb3V0cHV0Rm9ybWF0Rm4odmFsKVxuICAgICAgZWxzZVxuICAgICAgICB2YWxcblxuICAgIG1lLm1hcCA9IChkYXRhKSAtPlxuICAgICAgaWYgQXJyYXkuaXNBcnJheShkYXRhKSB0aGVuIGRhdGEubWFwKChkKSAtPiBfc2NhbGUobWUudmFsdWUoZGF0YSkpKSBlbHNlIF9zY2FsZShtZS52YWx1ZShkYXRhKSlcblxuICAgIG1lLmludmVydCA9IChtYXBwZWRWYWx1ZSkgLT5cbiAgICAgICMgdGFrZXMgYSBtYXBwZWQgdmFsdWUgKHBpeGVsIHBvc2l0aW9uICwgY29sb3IgdmFsdWUsIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgaW4gdGhlIGlucHV0IGRvbWFpblxuICAgICAgIyB0aGUgdHlwZSBvZiBpbnZlcnNlIGlzIGRlcGVuZGVudCBvbiB0aGUgc2NhbGUgdHlwZSBmb3IgcXVhbnRpdGF0aXZlIHNjYWxlcy5cbiAgICAgICMgT3JkaW5hbCBzY2FsZXMgLi4uXG5cbiAgICAgIGlmIF8uaGFzKG1lLnNjYWxlKCksJ2ludmVydCcpICMgaS5lLiB0aGUgZDMgc2NhbGUgc3VwcG9ydHMgdGhlIGludmVyc2UgY2FsY3VsYXRpb246IGxpbmVhciwgbG9nLCBwb3csIHNxcnRcbiAgICAgICAgX2RhdGEgPSBtZS5jaGFydCgpLmdldERhdGEoKVxuXG4gICAgICAgICMgYmlzZWN0LmxlZnQgbmV2ZXIgcmV0dXJucyAwIGluIHRoaXMgc3BlY2lmaWMgc2NlbmFyaW8uIFdlIG5lZWQgdG8gbW92ZSB0aGUgdmFsIGJ5IGFuIGludGVydmFsIHRvIGhpdCB0aGUgbWlkZGxlIG9mIHRoZSByYW5nZSBhbmQgdG8gZW5zdXJlXG4gICAgICAgICMgdGhhdCB0aGUgZmlyc3QgZWxlbWVudCB3aWxsIGJlIGNhcHR1cmVkLiBBbHNvIGVuc3VyZXMgYmV0dGVyIHZpc3VhbCBleHBlcmllbmNlIHdpdGggdG9vbHRpcHNcblxuICAgICAgICByYW5nZSA9IF9zY2FsZS5yYW5nZSgpXG4gICAgICAgIGludGVydmFsID0gKHJhbmdlWzFdIC0gcmFuZ2VbMF0pIC8gX2RhdGEubGVuZ3RoXG4gICAgICAgIHZhbCA9IG1lLnNjYWxlKCkuaW52ZXJ0KG1hcHBlZFZhbHVlIC0gaW50ZXJ2YWwvMilcblxuICAgICAgICBiaXNlY3QgPSBkMy5iaXNlY3RvcihtZS52YWx1ZSkubGVmdFxuICAgICAgICBpZHggPSBiaXNlY3QoX2RhdGEsIHZhbClcbiAgICAgICAgaWR4ID0gaWYgaWR4IDwgMCB0aGVuIDAgZWxzZSBpZiBpZHggPj0gX2RhdGEubGVuZ3RoIHRoZW4gX2RhdGEubGVuZ3RoIC0gMSBlbHNlIGlkeFxuICAgICAgICByZXR1cm4gaWR4ICMgdGhlIGludmVyc2UgdmFsdWUgZG9lcyBub3QgbmVjZXNzYXJpbHkgY29ycmVzcG9uZCB0byBhIHZhbHVlIGluIHRoZSBkYXRhXG5cbiAgICAgIGlmIF8uaGFzKG1lLnNjYWxlKCksJ2ludmVydEV4dGVudCcpICMgZDMgc3VwcG9ydHMgdGhpcyBmb3IgcXVhbnRpemUsIHF1YW50aWxlLCB0aHJlc2hvbGQuIHJldHVybnMgdGhlIHJhbmdlIHRoYXQgZ2V0cyBtYXBwZWQgdG8gdGhlIHZhbHVlXG4gICAgICAgIHJldHVybiBtZS5zY2FsZSgpLmludmVydEV4dGVudChtYXBwZWRWYWx1ZSkgI1RPRE8gSG93IHNob3VsZCB0aGlzIGJlIG1hcHBlZCBjb3JyZWN0bHkuIFVzZSBjYXNlPz8/XG5cbiAgICAgICMgZDMgZG9lcyBub3Qgc3VwcG9ydCBpbnZlcnQgZm9yIG9yZGluYWwgc2NhbGVzLCB0aHVzIHRoaW5ncyBiZWNvbWUgYSBiaXQgbW9yZSB0cmlja3kuXG4gICAgICAjIGluIGNhc2Ugd2UgYXJlIHNldHRpbmcgdGhlIGRvbWFpbiBleHBsaWNpdGx5LCB3ZSBrbm93IHRoYSB0aGUgcmFuZ2UgdmFsdWVzIGFuZCB0aGUgZG9tYWluIGVsZW1lbnRzIGFyZSBpbiB0aGUgc2FtZSBvcmRlclxuICAgICAgIyBpbiBjYXNlIHRoZSBkb21haW4gaXMgc2V0ICdsYXp5JyAoaS5lLiBhcyB2YWx1ZXMgYXJlIHVzZWQpIHdlIGNhbm5vdCBtYXAgcmFuZ2UgYW5kIGRvbWFpbiB2YWx1ZXMgZWFzaWx5LiBOb3QgY2xlYXIgaG93IHRvIGRvIHRoaXMgZWZmZWN0aXZlbHlcblxuICAgICAgaWYgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBkb21haW4gPSBfc2NhbGUuZG9tYWluKClcbiAgICAgICAgcmFuZ2UgPSBfc2NhbGUucmFuZ2UoKVxuICAgICAgICBpZiBfaXNWZXJ0aWNhbFxuICAgICAgICAgIGludGVydmFsID0gcmFuZ2VbMF0gLSByYW5nZVsxXVxuICAgICAgICAgIGlkeCA9IHJhbmdlLmxlbmd0aCAtIE1hdGguZmxvb3IobWFwcGVkVmFsdWUgLyBpbnRlcnZhbCkgLSAxXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpbnRlcnZhbCA9IHJhbmdlWzFdIC0gcmFuZ2VbMF1cbiAgICAgICAgICBpZHggPSBNYXRoLmZsb29yKG1hcHBlZFZhbHVlIC8gaW50ZXJ2YWwpXG4gICAgICAgIHJldHVybiBpZHhcblxuICAgIG1lLmludmVydE9yZGluYWwgPSAobWFwcGVkVmFsdWUpIC0+XG4gICAgICBpZiBtZS5pc09yZGluYWwoKSBhbmQgbWUucmVzZXRPbk5ld0RhdGEoKVxuICAgICAgICBpZHggPSBtZS5pbnZlcnQobWFwcGVkVmFsdWUpXG4gICAgICAgIHJldHVybiBfc2NhbGUuZG9tYWluKClbaWR4XVxuXG5cbiAgICAjLS0tIEF4aXMgQXR0cmlidXRlcyBhbmQgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbWUuc2hvd0F4aXMgPSAodHJ1ZUZhbHNlKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93QXhpc1xuICAgICAgZWxzZVxuICAgICAgICBfc2hvd0F4aXMgPSB0cnVlRmFsc2VcbiAgICAgICAgaWYgdHJ1ZUZhbHNlXG4gICAgICAgICAgX2F4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfYXhpcyA9IHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmF4aXNPcmllbnQgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9heGlzT3JpZW50XG4gICAgICBlbHNlXG4gICAgICAgIF9heGlzT3JpZW50T2xkID0gX2F4aXNPcmllbnRcbiAgICAgICAgX2F4aXNPcmllbnQgPSB2YWxcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLmF4aXNPcmllbnRPbGQgPSAodmFsKSAtPiAgI1RPRE8gVGhpcyBpcyBub3QgdGhlIGJlc3QgcGxhY2UgdG8ga2VlcCB0aGUgb2xkIGF4aXMgdmFsdWUuIE9ubHkgbmVlZGVkIGJ5IGNvbnRhaW5lciBpbiBjYXNlIHRoZSBheGlzIHBvc2l0aW9uIGNoYW5nZXNcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfYXhpc09yaWVudE9sZFxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc09yaWVudE9sZCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXhpcyA9ICgpIC0+XG4gICAgICByZXR1cm4gX2F4aXNcblxuICAgIG1lLnRpY2tzID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja3NcbiAgICAgIGVsc2VcbiAgICAgICAgX3RpY2tzID0gdmFsXG4gICAgICAgIGlmIG1lLmF4aXMoKVxuICAgICAgICAgIG1lLmF4aXMoKS50aWNrcyhfdGlja3MpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS50aWNrRm9ybWF0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfdGlja0Zvcm1hdFxuICAgICAgZWxzZVxuICAgICAgICBfdGlja0Zvcm1hdCA9IHZhbFxuICAgICAgICBpZiBtZS5heGlzKClcbiAgICAgICAgICBtZS5heGlzKCkudGlja0Zvcm1hdCh2YWwpXG4gICAgICAgIHJldHVybiBtZSAjdG8gZW5hYmxlIGNoYWluaW5nXG5cbiAgICBtZS5zaG93TGFiZWwgPSAodmFsKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9zaG93TGFiZWxcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dMYWJlbCA9IHZhbFxuICAgICAgICByZXR1cm4gbWUgI3RvIGVuYWJsZSBjaGFpbmluZ1xuXG4gICAgbWUuYXhpc0xhYmVsID0gKHRleHQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIGlmIF9heGlzTGFiZWwgdGhlbiBfYXhpc0xhYmVsIGVsc2UgbWUucHJvcGVydHkoKVxuICAgICAgZWxzZVxuICAgICAgICBfYXhpc0xhYmVsID0gdGV4dFxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHMgPSAobmJyKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwIHRoZW4gcmV0dXJuIF9yb3RhdGVUaWNrTGFiZWxzXG4gICAgICBlbHNlXG4gICAgICAgIF9yb3RhdGVUaWNrTGFiZWxzID0gbmJyXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUuZm9ybWF0ID0gKHZhbCkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfb3V0cHV0Rm9ybWF0U3RyaW5nXG4gICAgICBlbHNlXG4gICAgICAgIGlmIHZhbC5sZW5ndGggPiAwXG4gICAgICAgICAgX291dHB1dEZvcm1hdFN0cmluZyA9IHZhbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgX291dHB1dEZvcm1hdFN0cmluZyA9IGlmIG1lLnNjYWxlVHlwZSgpIGlzICd0aW1lJyB0aGVuIGZvcm1hdERlZmF1bHRzLmRhdGUgZWxzZSBmb3JtYXREZWZhdWx0cy5udW1iZXJcbiAgICAgICAgX291dHB1dEZvcm1hdEZuID0gaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnIHRoZW4gZDMudGltZS5mb3JtYXQoX291dHB1dEZvcm1hdFN0cmluZykgZWxzZSBkMy5mb3JtYXQoX291dHB1dEZvcm1hdFN0cmluZylcbiAgICAgICAgcmV0dXJuIG1lICN0byBlbmFibGUgY2hhaW5pbmdcblxuICAgIG1lLnNob3dHcmlkID0gKHRydWVGYWxzZSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfc2hvd0dyaWRcbiAgICAgIGVsc2VcbiAgICAgICAgX3Nob3dHcmlkID0gdHJ1ZUZhbHNlXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgIy0tIFJlZ2lzdGVyIGZvciBkcmF3aW5nIGxpZmVjeWNsZSBldmVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1lLnJlZ2lzdGVyID0gKCkgLT5cbiAgICAgIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkub24gXCJzY2FsZURvbWFpbnMuI3ttZS5pZCgpfVwiLCAoZGF0YSkgLT5cbiAgICAgICAgIyBzZXQgdGhlIGRvbWFpbiBpZiByZXF1aXJlZFxuICAgICAgICBpZiBtZS5yZXNldE9uTmV3RGF0YSgpXG4gICAgICAgICAgIyBlbnN1cmUgcm9idXN0IGJlaGF2aW9yIGluIGNhc2Ugb2YgcHJvYmxlbWF0aWMgZGVmaW5pdGlvbnNcbiAgICAgICAgICBkb21haW4gPSBtZS5nZXREb21haW4oZGF0YSlcbiAgICAgICAgICBpZiBfc2NhbGVUeXBlIGlzICdsaW5lYXInIGFuZCBfLnNvbWUoZG9tYWluLCBpc05hTilcbiAgICAgICAgICAgIHRocm93IFwiU2NhbGUgI3ttZS5raW5kKCl9LCBUeXBlICcje19zY2FsZVR5cGV9JzogY2Fubm90IGNvbXB1dGUgZG9tYWluIGZvciBwcm9wZXJ0eSAnI3tfcHJvcGVydHl9JyAuIFBvc3NpYmxlIHJlYXNvbnM6IHByb3BlcnR5IG5vdCBzZXQsIGRhdGEgbm90IGNvbXBhdGlibGUgd2l0aCBkZWZpbmVkIHR5cGUuIERvbWFpbjoje2RvbWFpbn1cIlxuXG4gICAgICAgICAgX3NjYWxlLmRvbWFpbihkb21haW4pXG5cbiAgICAgIG1lLmNoYXJ0KCkubGlmZUN5Y2xlKCkub24gXCJwcmVwYXJlRGF0YS4je21lLmlkKCl9XCIsIChkYXRhKSAtPlxuICAgICAgICAjIGNvbXB1dGUgdGhlIGRvbWFpbiByYW5nZSBjYWxjdWxhdGlvbiBpZiByZXF1aXJlZFxuICAgICAgICBjYWxjUnVsZSA9ICBtZS5kb21haW5DYWxjKClcbiAgICAgICAgaWYgbWUucGFyZW50KCkuc2NhbGVQcm9wZXJ0aWVzXG4gICAgICAgICAgbWUubGF5ZXJFeGNsdWRlKG1lLnBhcmVudCgpLnNjYWxlUHJvcGVydGllcygpKVxuICAgICAgICBpZiBjYWxjUnVsZSBhbmQgY2FsY0RvbWFpbltjYWxjUnVsZV1cbiAgICAgICAgICBfY2FsY3VsYXRlZERvbWFpbiA9IGNhbGNEb21haW5bY2FsY1J1bGVdKGRhdGEpXG5cbiAgICBtZS51cGRhdGUgPSAobm9BbmltYXRpb24pIC0+XG4gICAgICBtZS5wYXJlbnQoKS5saWZlQ3ljbGUoKS51cGRhdGUobm9BbmltYXRpb24pXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnVwZGF0ZUF0dHJzID0gKCkgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLnVwZGF0ZUF0dHJzKClcblxuICAgIG1lLmRyYXdBeGlzID0gKCkgLT5cbiAgICAgIG1lLnBhcmVudCgpLmxpZmVDeWNsZSgpLmRyYXdBeGlzKClcbiAgICAgIHJldHVybiBtZVxuXG4gICAgcmV0dXJuIG1lXG5cbiAgcmV0dXJuIHNjYWxlIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZmFjdG9yeSAnc2NhbGVMaXN0JywgKCRsb2cpIC0+XG4gIHJldHVybiBzY2FsZUxpc3QgPSAoKSAtPlxuICAgIF9saXN0ID0ge31cbiAgICBfa2luZExpc3QgPSB7fVxuICAgIF9wYXJlbnRMaXN0ID0ge31cbiAgICBfb3duZXIgPSB1bmRlZmluZWRcbiAgICBfcmVxdWlyZWRTY2FsZXMgPSBbXVxuICAgIF9sYXllclNjYWxlID0gdW5kZWZpbmVkXG5cbiAgICBtZSA9ICgpIC0+XG5cbiAgICBtZS5vd25lciA9IChvd25lcikgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMCB0aGVuIHJldHVybiBfb3duZXJcbiAgICAgIGVsc2VcbiAgICAgICAgX293bmVyID0gb3duZXJcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGQgPSAoc2NhbGUpIC0+XG4gICAgICBpZiBfbGlzdFtzY2FsZS5pZCgpXVxuICAgICAgICAkbG9nLmVycm9yIFwic2NhbGVMaXN0LmFkZDogc2NhbGUgI3tzY2FsZS5pZCgpfSBhbHJlYWR5IGRlZmluZWQgaW4gc2NhbGVMaXN0IG9mICN7X293bmVyLmlkKCl9LiBEdXBsaWNhdGUgc2NhbGVzIGFyZSBub3QgYWxsb3dlZFwiXG4gICAgICBfbGlzdFtzY2FsZS5pZCgpXSA9IHNjYWxlXG4gICAgICBfa2luZExpc3Rbc2NhbGUua2luZCgpXSA9IHNjYWxlXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmhhc1NjYWxlID0gKHNjYWxlKSAtPlxuICAgICAgcyA9IG1lLmdldEtpbmQoc2NhbGUua2luZCgpKVxuICAgICAgcmV0dXJuIHMuaWQoKSBpcyBzY2FsZS5pZCgpXG5cbiAgICBtZS5nZXRLaW5kID0gKGtpbmQpIC0+XG4gICAgICBpZiBfa2luZExpc3Rba2luZF0gdGhlbiBfa2luZExpc3Rba2luZF0gZWxzZSBpZiBfcGFyZW50TGlzdC5nZXRLaW5kIHRoZW4gX3BhcmVudExpc3QuZ2V0S2luZChraW5kKSBlbHNlIHVuZGVmaW5lZFxuXG4gICAgbWUuaGFzS2luZCA9IChraW5kKSAtPlxuICAgICAgcmV0dXJuICEhbWUuZ2V0S2luZChraW5kKVxuXG4gICAgbWUucmVtb3ZlID0gKHNjYWxlKSAtPlxuICAgICAgaWYgbm90IF9saXN0W3NjYWxlLmlkKCldXG4gICAgICAgICRsb2cud2FybiBcInNjYWxlTGlzdC5kZWxldGU6IHNjYWxlICN7c2NhbGUuaWQoKX0gbm90IGRlZmluZWQgaW4gc2NhbGVMaXN0IG9mICN7X293bmVyLmlkKCl9LiBJZ25vcmluZ1wiXG4gICAgICAgIHJldHVybiBtZVxuICAgICAgZGVsZXRlIF9saXN0W3NjYWxlLmlkKCldXG4gICAgICBkZWxldGUgbWVbc2NhbGUuaWRdXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLnBhcmVudFNjYWxlcyA9IChzY2FsZUxpc3QpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3BhcmVudExpc3RcbiAgICAgIGVsc2VcbiAgICAgICAgX3BhcmVudExpc3QgPSBzY2FsZUxpc3RcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5nZXRPd25lZCA9ICgpIC0+XG4gICAgICBfbGlzdFxuXG4gICAgbWUuYWxsS2luZHMgPSAoKSAtPlxuICAgICAgcmV0ID0ge31cbiAgICAgIGlmIF9wYXJlbnRMaXN0LmFsbEtpbmRzXG4gICAgICAgIGZvciBrLCBzIG9mIF9wYXJlbnRMaXN0LmFsbEtpbmRzKClcbiAgICAgICAgICByZXRba10gPSBzXG4gICAgICBmb3IgayxzIG9mIF9raW5kTGlzdFxuICAgICAgICByZXRba10gPSBzXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5yZXF1aXJlZFNjYWxlcyA9IChyZXEpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDAgdGhlbiByZXR1cm4gX3JlcXVpcmVkU2NhbGVzXG4gICAgICBlbHNlXG4gICAgICAgIF9yZXF1aXJlZFNjYWxlcyA9IHJlcVxuICAgICAgICBmb3IgayBpbiByZXFcbiAgICAgICAgICBpZiBub3QgbWUuaGFzS2luZChrKVxuICAgICAgICAgICAgdGhyb3cgXCJGYXRhbCBFcnJvcjogc2NhbGUgJyN7a30nIHJlcXVpcmVkIGJ1dCBub3QgZGVmaW5lZFwiXG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmdldFNjYWxlcyA9IChraW5kTGlzdCkgLT5cbiAgICAgIGwgPSB7fVxuICAgICAgZm9yIGtpbmQgaW4ga2luZExpc3RcbiAgICAgICAgaWYgbWUuaGFzS2luZChraW5kKVxuICAgICAgICAgIGxba2luZF0gPSBtZS5nZXRLaW5kKGtpbmQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBcIkZhdGFsIEVycm9yOiBzY2FsZSAnI3traW5kfScgcmVxdWlyZWQgYnV0IG5vdCBkZWZpbmVkXCJcbiAgICAgIHJldHVybiBsXG5cbiAgICBtZS5nZXRTY2FsZVByb3BlcnRpZXMgPSAoKSAtPlxuICAgICAgbCA9IFtdXG4gICAgICBmb3IgayxzIG9mIG1lLmFsbEtpbmRzKClcbiAgICAgICAgcHJvcCA9IHMucHJvcGVydHkoKVxuICAgICAgICBpZiBwcm9wXG4gICAgICAgICAgaWYgQXJyYXkuaXNBcnJheShwcm9wKVxuICAgICAgICAgICAgbC5jb25jYXQocHJvcClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsLnB1c2gocHJvcClcbiAgICAgIHJldHVybiBsXG5cbiAgICBtZS5sYXllclNjYWxlID0gKGtpbmQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgaWYgX2xheWVyU2NhbGVcbiAgICAgICAgICByZXR1cm4gbWUuZ2V0S2luZChfbGF5ZXJTY2FsZSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgZWxzZVxuICAgICAgICBfbGF5ZXJTY2FsZSA9IGtpbmRcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICByZXR1cm4gbWVcbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnY29sb3InLCAoJGxvZywgc2NhbGUsIGxlZ2VuZCwgc2NhbGVVdGlscykgLT5cbiAgc2NhbGVDbnQgPSAwXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcXVpcmU6IFsnY29sb3InLCdeY2hhcnQnLCAnP15sYXlvdXQnXVxuICAgIGNvbnRyb2xsZXI6ICgkZWxlbWVudCkgLT5cbiAgICAgIHRoaXMubWUgPSBzY2FsZSgpXG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVDb2xvcidcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG4gICAgICBsID0gdW5kZWZpbmVkXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnY29sb3InXG4gICAgICBtZS5raW5kKG5hbWUpXG4gICAgICBtZS5wYXJlbnQobGF5b3V0IG9yIGNoYXJ0KVxuICAgICAgbWUuY2hhcnQoY2hhcnQpXG4gICAgICBtZS5zY2FsZVR5cGUoJ2NhdGVnb3J5MjAnKVxuICAgICAgZWxlbWVudC5hZGRDbGFzcyhtZS5pZCgpKVxuXG4gICAgICBjaGFydC5hZGRTY2FsZShtZSwgbGF5b3V0KVxuICAgICAgbWUucmVnaXN0ZXIoKVxuXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlTGVnZW5kQXR0cmlidXRlcyhhdHRycywgbWUsIGxheW91dClcblxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAnc2NhbGVVdGlscycsICgkbG9nKSAtPlxuXG4gIHBhcnNlTGlzdCA9ICh2YWwpIC0+XG4gICAgaWYgdmFsXG4gICAgICBsID0gdmFsLnRyaW0oKS5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpLnNwbGl0KCcsJykubWFwKChkKSAtPiBkLnJlcGxhY2UoL15bXFxcInwnXXxbXFxcInwnXSQvZywgJycpKVxuICAgICAgbCA9IGwubWFwKChkKSAtPiBpZiBpc05hTihkKSB0aGVuIGQgZWxzZSArZClcbiAgICAgIHJldHVybiBpZiBsLmxlbmd0aCBpcyAxIHRoZW4gcmV0dXJuIGxbMF0gZWxzZSBsXG5cbiAgcmV0dXJuIHtcblxuICAgIG9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lKSAtPlxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3R5cGUnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiBkMy5zY2FsZS5oYXNPd25Qcm9wZXJ0eSh2YWwpIG9yIHZhbCBpcyAndGltZSdcbiAgICAgICAgICAgIG1lLnNjYWxlVHlwZSh2YWwpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgdmFsIGlzbnQgJydcbiAgICAgICAgICAgICAgIyMgbm8gc2NhbGUgZGVmaW5lZCwgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgICAgJGxvZy5lcnJvciBcIkVycm9yOiBpbGxlZ2FsIHNjYWxlIHZhbHVlOiAje3ZhbH0uIFVzaW5nICdsaW5lYXInIHNjYWxlIGluc3RlYWRcIlxuICAgICAgICAgIG1lLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdleHBvbmVudCcsICh2YWwpIC0+XG4gICAgICAgIGlmIG1lLnNjYWxlVHlwZSgpIGlzICdwb3cnIGFuZCBfLmlzTnVtYmVyKCt2YWwpXG4gICAgICAgICAgbWUuZXhwb25lbnQoK3ZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3Byb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgbWUucHJvcGVydHkocGFyc2VMaXN0KHZhbCkpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsYXllclByb3BlcnR5JywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGFuZCB2YWwubGVuZ3RoID4gMFxuICAgICAgICAgIG1lLmxheWVyUHJvcGVydHkodmFsKS51cGRhdGUoKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncmFuZ2UnLCAodmFsKSAtPlxuICAgICAgICByYW5nZSA9IHBhcnNlTGlzdCh2YWwpXG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkocmFuZ2UpXG4gICAgICAgICAgbWUucmFuZ2UocmFuZ2UpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdkYXRlRm9ybWF0JywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgaWYgbWUuc2NhbGVUeXBlKCkgaXMgJ3RpbWUnXG4gICAgICAgICAgICBtZS5kYXRhRm9ybWF0KHZhbCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RvbWFpbicsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbFxuICAgICAgICAgICRsb2cuaW5mbyAnZG9tYWluJywgdmFsXG4gICAgICAgICAgcGFyc2VkTGlzdCA9IHBhcnNlTGlzdCh2YWwpXG4gICAgICAgICAgaWYgQXJyYXkuaXNBcnJheShwYXJzZWRMaXN0KVxuICAgICAgICAgICAgbWUuZG9tYWluKHBhcnNlZExpc3QpLnVwZGF0ZSgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgJGxvZy5lcnJvciBcImRvbWFpbjogbXVzdCBiZSBhcnJheSwgb3IgY29tbWEtc2VwYXJhdGVkIGxpc3QsIGdvdFwiLCB2YWxcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuZG9tYWluKHVuZGVmaW5lZCkudXBkYXRlKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2RvbWFpblJhbmdlJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgbWUuZG9tYWluQ2FsYyh2YWwpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsYWJlbCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmF4aXNMYWJlbCh2YWwpLnVwZGF0ZUF0dHJzKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2Zvcm1hdCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmZvcm1hdCh2YWwpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb2JzZXJ2ZUF4aXNBdHRyaWJ1dGVzOiAoYXR0cnMsIG1lKSAtPlxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAndGlja0Zvcm1hdCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnRpY2tGb3JtYXQoZDMuZm9ybWF0KHZhbCkpLnVwZGF0ZSgpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd0aWNrcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnRpY2tzKCt2YWwpXG4gICAgICAgICAgaWYgbWUuYXhpcygpXG4gICAgICAgICAgICBtZS51cGRhdGVBdHRycygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdncmlkJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgbWUuc2hvd0dyaWQodmFsIGlzICcnIG9yIHZhbCBpcyAndHJ1ZScpLnVwZGF0ZUF0dHJzKClcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ3Nob3dMYWJlbCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLnNob3dMYWJlbCh2YWwgaXMgJycgb3IgdmFsIGlzICd0cnVlJykudXBkYXRlKHRydWUpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb2JzZXJ2ZUxlZ2VuZEF0dHJpYnV0ZXM6IChhdHRycywgbWUsIGxheW91dCkgLT5cblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2xlZ2VuZCcsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGwgPSBtZS5sZWdlbmQoKVxuICAgICAgICAgIGwuc2hvd1ZhbHVlcyhmYWxzZSlcbiAgICAgICAgICBzd2l0Y2ggdmFsXG4gICAgICAgICAgICB3aGVuICdmYWxzZSdcbiAgICAgICAgICAgICAgbC5zaG93KGZhbHNlKVxuICAgICAgICAgICAgd2hlbiAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCdcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbih2YWwpLmRpdih1bmRlZmluZWQpLnNob3codHJ1ZSlcbiAgICAgICAgICAgIHdoZW4gJ3RydWUnLCAnJ1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKCd0b3AtcmlnaHQnKS5zaG93KHRydWUpLmRpdih1bmRlZmluZWQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGxlZ2VuZERpdiA9IGQzLnNlbGVjdCh2YWwpXG4gICAgICAgICAgICAgIGlmIGxlZ2VuZERpdi5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJGxvZy53YXJuICdsZWdlbmQgcmVmZXJlbmNlIGRvZXMgbm90IGV4aXN0OicsIHZhbFxuICAgICAgICAgICAgICAgIGwuZGl2KHVuZGVmaW5lZCkuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGwuZGl2KGxlZ2VuZERpdikucG9zaXRpb24oJ3RvcC1sZWZ0Jykuc2hvdyh0cnVlKVxuXG4gICAgICAgICAgbC5zY2FsZShtZSkubGF5b3V0KGxheW91dClcbiAgICAgICAgICBpZiBtZS5wYXJlbnQoKVxuICAgICAgICAgICAgbC5yZWdpc3RlcihtZS5wYXJlbnQoKSlcbiAgICAgICAgICBsLnJlZHJhdygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICd2YWx1ZXNMZWdlbmQnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBsID0gbWUubGVnZW5kKClcbiAgICAgICAgICBsLnNob3dWYWx1ZXModHJ1ZSlcbiAgICAgICAgICBzd2l0Y2ggdmFsXG4gICAgICAgICAgICB3aGVuICdmYWxzZSdcbiAgICAgICAgICAgICAgbC5zaG93KGZhbHNlKVxuICAgICAgICAgICAgd2hlbiAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCdcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbih2YWwpLmRpdih1bmRlZmluZWQpLnNob3codHJ1ZSlcbiAgICAgICAgICAgIHdoZW4gJ3RydWUnLCAnJ1xuICAgICAgICAgICAgICBsLnBvc2l0aW9uKCd0b3AtcmlnaHQnKS5zaG93KHRydWUpLmRpdih1bmRlZmluZWQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGxlZ2VuZERpdiA9IGQzLnNlbGVjdCh2YWwpXG4gICAgICAgICAgICAgIGlmIGxlZ2VuZERpdi5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJGxvZy53YXJuICdsZWdlbmQgcmVmZXJlbmNlIGRvZXMgbm90IGV4aXN0OicsIHZhbFxuICAgICAgICAgICAgICAgIGwuZGl2KHVuZGVmaW5lZCkuc2hvdyhmYWxzZSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGwuZGl2KGxlZ2VuZERpdikucG9zaXRpb24oJ3RvcC1sZWZ0Jykuc2hvdyh0cnVlKVxuXG4gICAgICAgICAgbC5zY2FsZShtZSkubGF5b3V0KGxheW91dClcbiAgICAgICAgICBpZiBtZS5wYXJlbnQoKVxuICAgICAgICAgICAgbC5yZWdpc3RlcihtZS5wYXJlbnQoKSlcbiAgICAgICAgICBsLnJlZHJhdygpXG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdsZWdlbmRUaXRsZScsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIG1lLmxlZ2VuZCgpLnRpdGxlKHZhbCkucmVkcmF3KClcblxuICB9XG5cbiIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc2hhcGUnLCAoJGxvZywgc2NhbGUsIGQzU2hhcGVzLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydzaGFwZScsJ15jaGFydCcsICc/XmxheW91dCddXG4gICAgY29udHJvbGxlcjogKCRlbGVtZW50KSAtPlxuICAgICAgdGhpcy5tZSA9IHNjYWxlKClcbiAgICAgICMkbG9nLmxvZyAnY3JlYXRpbmcgY29udHJvbGxlciBzY2FsZVNpemUnXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykgLT5cbiAgICAgIG1lID0gY29udHJvbGxlcnNbMF0ubWVcbiAgICAgIGNoYXJ0ID0gY29udHJvbGxlcnNbMV0ubWVcbiAgICAgIGxheW91dCA9IGNvbnRyb2xsZXJzWzJdPy5tZVxuXG4gICAgICBpZiBub3QgKGNoYXJ0IG9yIGxheW91dClcbiAgICAgICAgJGxvZy5lcnJvciAnc2NhbGUgbmVlZHMgdG8gYmUgY29udGFpbmVkIGluIGEgY2hhcnQgb3IgbGF5b3V0IGRpcmVjdGl2ZSAnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuYW1lID0gJ3NoYXBlJ1xuICAgICAgbWUua2luZChuYW1lKVxuICAgICAgbWUucGFyZW50KGxheW91dCBvciBjaGFydClcbiAgICAgIG1lLmNoYXJ0KGNoYXJ0KVxuICAgICAgbWUuc2NhbGVUeXBlKCdvcmRpbmFsJylcbiAgICAgIG1lLnNjYWxlKCkucmFuZ2UoZDNTaGFwZXMpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICdzaXplJywgKCRsb2csIHNjYWxlLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWydzaXplJywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlU2l6ZSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAnc2l6ZSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG5cbiAgICAgICMkbG9nLmxvZyBcImxpbmtpbmcgc2NhbGUgI3tuYW1lfSBpZDpcIiwgbWUuaWQoKSwgJ2xheW91dDonLCAoaWYgbGF5b3V0IHRoZW4gbGF5b3V0LmlkKCkgZWxzZSAnJykgLCAnY2hhcnQ6JywgY2hhcnQuaWQoKVxuXG4gICAgICAjLS0tRGlyZWN0aXZlIEF0dHJpYnV0ZXMgaGFuZGxpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgc2NhbGVVdGlscy5vYnNlcnZlU2hhcmVkQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0JykuZGlyZWN0aXZlICd4JywgKCRsb2csIHNjYWxlLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWyd4JywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICAjJGxvZy5sb2cgJ2NyZWF0aW5nIGNvbnRyb2xsZXIgc2NhbGVYJ1xuICAgICAgdGhpcy5tZSA9IHNjYWxlKCkgIyBmb3IgQW5ndWxhciAxLjNcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAneCdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBtZS5pc0hvcml6b250YWwodHJ1ZSlcbiAgICAgIG1lLnJlZ2lzdGVyKClcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MobWUuaWQoKSlcblxuICAgICAgY2hhcnQuYWRkU2NhbGUobWUsIGxheW91dClcblxuICAgICAgIyRsb2cubG9nIFwibGlua2luZyBzY2FsZSAje25hbWV9IGlkOlwiLCBtZS5pZCgpLCAnbGF5b3V0OicsIChpZiBsYXlvdXQgdGhlbiBsYXlvdXQuaWQoKSBlbHNlICcnKSAsICdjaGFydDonLCBjaGFydC5pZCgpXG5cbiAgICAgICMtLS1EaXJlY3RpdmUgQXR0cmlidXRlcyBoYW5kbGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVTaGFyZWRBdHRyaWJ1dGVzKGF0dHJzLCBtZSlcblxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2F4aXMnLCAodmFsKSAtPlxuICAgICAgICBpZiB2YWwgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiB2YWwgaXNudCAnZmFsc2UnXG4gICAgICAgICAgICBpZiB2YWwgaW4gWyd0b3AnLCAnYm90dG9tJ11cbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCh2YWwpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1lLmF4aXNPcmllbnQoJ2JvdHRvbScpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAncm90YXRlVGlja0xhYmVscycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBhbmQgXy5pc051bWJlcigrdmFsKVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHMoK3ZhbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1lLnJvdGF0ZVRpY2tMYWJlbHModW5kZWZpbmVkKVxuICAgICAgICBtZS51cGRhdGUodHJ1ZSlcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAneScsICgkbG9nLCBzY2FsZSwgbGVnZW5kLCBzY2FsZVV0aWxzKSAtPlxuICBzY2FsZUNudCA9IDBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgcmVxdWlyZTogWyd5JywnXmNoYXJ0JywgJz9ebGF5b3V0J11cbiAgICBjb250cm9sbGVyOiAoJGVsZW1lbnQpIC0+XG4gICAgICB0aGlzLm1lID0gc2NhbGUoKVxuICAgICAgIyRsb2cubG9nICdjcmVhdGluZyBjb250cm9sbGVyIHNjYWxlWSdcblxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSAtPlxuICAgICAgbWUgPSBjb250cm9sbGVyc1swXS5tZVxuICAgICAgY2hhcnQgPSBjb250cm9sbGVyc1sxXS5tZVxuICAgICAgbGF5b3V0ID0gY29udHJvbGxlcnNbMl0/Lm1lXG5cbiAgICAgIGlmIG5vdCAoY2hhcnQgb3IgbGF5b3V0KVxuICAgICAgICAkbG9nLmVycm9yICdzY2FsZSBuZWVkcyB0byBiZSBjb250YWluZWQgaW4gYSBjaGFydCBvciBsYXlvdXQgZGlyZWN0aXZlICdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5hbWUgPSAneSdcbiAgICAgIG1lLmtpbmQobmFtZSlcbiAgICAgIG1lLnBhcmVudChsYXlvdXQgb3IgY2hhcnQpXG4gICAgICBtZS5jaGFydChjaGFydClcbiAgICAgIG1lLnNjYWxlVHlwZSgnbGluZWFyJylcbiAgICAgIG1lLmlzVmVydGljYWwodHJ1ZSlcbiAgICAgIG1lLnJlc2V0T25OZXdEYXRhKHRydWUpXG4gICAgICBlbGVtZW50LmFkZENsYXNzKG1lLmlkKCkpXG5cbiAgICAgIGNoYXJ0LmFkZFNjYWxlKG1lLCBsYXlvdXQpXG4gICAgICBtZS5yZWdpc3RlcigpXG4gICAgICAjJGxvZy5sb2cgXCJsaW5raW5nIHNjYWxlICN7bmFtZX0gaWQ6XCIsIG1lLmlkKCksICdsYXlvdXQ6JywgKGlmIGxheW91dCB0aGVuIGxheW91dC5pZCgpIGVsc2UgJycpICwgJ2NoYXJ0OicsIGNoYXJ0LmlkKClcblxuICAgICAgIy0tLURpcmVjdGl2ZSBBdHRyaWJ1dGVzIGhhbmRsaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHNjYWxlVXRpbHMub2JzZXJ2ZVNoYXJlZEF0dHJpYnV0ZXMoYXR0cnMsIG1lKVxuXG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnYXhpcycsICh2YWwpIC0+XG4gICAgICAgIGlmIHZhbCBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIHZhbCBpc250ICdmYWxzZSdcbiAgICAgICAgICAgIGlmIHZhbCBpbiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgICAgICAgICBtZS5heGlzT3JpZW50KHZhbCkuc2hvd0F4aXModHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbWUuYXhpc09yaWVudCgnbGVmdCcpLnNob3dBeGlzKHRydWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWUuc2hvd0F4aXMoZmFsc2UpLmF4aXNPcmllbnQodW5kZWZpbmVkKVxuICAgICAgICAgIG1lLnVwZGF0ZSh0cnVlKVxuXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVBeGlzQXR0cmlidXRlcyhhdHRycywgbWUpXG4gICAgICBzY2FsZVV0aWxzLm9ic2VydmVMZWdlbmRBdHRyaWJ1dGVzKGF0dHJzLCBtZSwgbGF5b3V0KVxuICB9IiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAnc2VsZWN0aW9uU2hhcmluZycsICgkbG9nKSAtPlxuICBzZWxlY3Rpb24gPSB7fVxuICBjYWxsYmFja3MgPSB7fVxuXG4gIHRoaXMuY3JlYXRlR3JvdXAgPSAoZ3JvdXApIC0+XG5cblxuICB0aGlzLnNldFNlbGVjdGlvbiA9IChzZWxlY3Rpb24sIGdyb3VwKSAtPlxuICAgIGlmIGdyb3VwXG4gICAgICBzZWxlY3Rpb25bZ3JvdXBdID0gc2VsZWN0aW9uXG4gICAgICBpZiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgIGZvciBjYiBpbiBjYWxsYmFja3NbZ3JvdXBdXG4gICAgICAgICAgY2Ioc2VsZWN0aW9uKVxuXG4gIHRoaXMuZ2V0U2VsZWN0aW9uID0gKGdyb3VwKSAtPlxuICAgIGdycCA9IGdyb3VwIG9yICdkZWZhdWx0J1xuICAgIHJldHVybiBzZWxlY3Rpb25bZ3JwXVxuXG4gIHRoaXMucmVnaXN0ZXIgPSAoZ3JvdXAsIGNhbGxiYWNrKSAtPlxuICAgIGlmIGdyb3VwXG4gICAgICBpZiBub3QgY2FsbGJhY2tzW2dyb3VwXVxuICAgICAgICBjYWxsYmFja3NbZ3JvdXBdID0gW11cbiAgICAgICNlbnN1cmUgdGhhdCBjYWxsYmFja3MgYXJlIG5vdCByZWdpc3RlcmVkIG1vcmUgdGhhbiBvbmNlXG4gICAgICBpZiBub3QgXy5jb250YWlucyhjYWxsYmFja3NbZ3JvdXBdLCBjYWxsYmFjaylcbiAgICAgICAgY2FsbGJhY2tzW2dyb3VwXS5wdXNoKGNhbGxiYWNrKVxuXG4gIHRoaXMudW5yZWdpc3RlciA9IChncm91cCwgY2FsbGJhY2spIC0+XG4gICAgaWYgY2FsbGJhY2tzW2dyb3VwXVxuICAgICAgaWR4ID0gY2FsbGJhY2tzW2dyb3VwXS5pbmRleE9mIGNhbGxiYWNrXG4gICAgICBpZiBpZHggPj0gMFxuICAgICAgICBjYWxsYmFja3NbZ3JvdXBdLnNwbGljZShpZHgsIDEpXG5cbiAgcmV0dXJuIHRoaXNcblxuIiwiYW5ndWxhci5tb2R1bGUoJ3drLmNoYXJ0Jykuc2VydmljZSAndGltaW5nJywgKCRsb2cpIC0+XG5cbiAgdGltZXJzID0ge31cbiAgZWxhcHNlZFN0YXJ0ID0gMFxuICBlbGFwc2VkID0gMFxuXG4gIHRoaXMuaW5pdCA9ICgpIC0+XG4gICAgZWxhcHNlZFN0YXJ0ID0gRGF0ZS5ub3coKVxuXG4gIHRoaXMuc3RhcnQgPSAodG9waWMpIC0+XG4gICAgdG9wID0gdGltZXJzW3RvcGljXVxuICAgIGlmIG5vdCB0b3BcbiAgICAgIHRvcCA9IHRpbWVyc1t0b3BpY10gPSB7bmFtZTp0b3BpYywgc3RhcnQ6MCwgdG90YWw6MCwgY2FsbENudDowLCBhY3RpdmU6IGZhbHNlfVxuICAgIHRvcC5zdGFydCA9IERhdGUubm93KClcbiAgICB0b3AuYWN0aXZlID0gdHJ1ZVxuXG4gIHRoaXMuc3RvcCA9ICh0b3BpYykgLT5cbiAgICBpZiB0b3AgPSB0aW1lcnNbdG9waWNdXG4gICAgICB0b3AuYWN0aXZlID0gZmFsc2VcbiAgICAgIHRvcC50b3RhbCArPSBEYXRlLm5vdygpIC0gdG9wLnN0YXJ0XG4gICAgICB0b3AuY2FsbENudCArPSAxXG4gICAgZWxhcHNlZCA9IERhdGUubm93KCkgLSBlbGFwc2VkU3RhcnRcblxuICB0aGlzLnJlcG9ydCA9ICgpIC0+XG4gICAgZm9yIHRvcGljLCB2YWwgb2YgdGltZXJzXG4gICAgICB2YWwuYXZnID0gdmFsLnRvdGFsIC8gdmFsLmNhbGxDbnRcbiAgICAkbG9nLmluZm8gdGltZXJzXG4gICAgJGxvZy5pbmZvICdFbGFwc2VkIFRpbWUgKG1zKScsIGVsYXBzZWRcbiAgICByZXR1cm4gdGltZXJzXG5cbiAgdGhpcy5jbGVhciA9ICgpIC0+XG4gICAgdGltZXJzID0ge31cblxuICByZXR1cm4gdGhpcyIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmZhY3RvcnkgJ2xheWVyZWREYXRhJywgKCRsb2cpIC0+XG5cbiAgbGF5ZXJlZCA9ICgpIC0+XG4gICAgX2RhdGEgPSBbXVxuICAgIF9sYXllcktleXMgPSBbXVxuICAgIF94ID0gdW5kZWZpbmVkXG4gICAgX2NhbGNUb3RhbCA9IGZhbHNlXG4gICAgX21pbiA9IEluZmluaXR5XG4gICAgX21heCA9IC1JbmZpbml0eVxuICAgIF90TWluID0gSW5maW5pdHlcbiAgICBfdE1heCA9IC1JbmZpbml0eVxuXG4gICAgbWUgPSAoKSAtPlxuXG4gICAgbWUuZGF0YSA9IChkYXQpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIElzIDBcbiAgICAgICAgcmV0dXJuIF9kYXRhXG4gICAgICBlbHNlXG4gICAgICAgIF9kYXRhID0gZGF0XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgbWUubGF5ZXJLZXlzID0gKGtleXMpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIF9sYXllcktleXNcbiAgICAgIGVsc2VcbiAgICAgICAgX2xheWVyS2V5cyA9IGtleXNcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS54ID0gKG5hbWUpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIF94XG4gICAgICBlbHNlXG4gICAgICAgIF94ID0gbmFtZVxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLmNhbGNUb3RhbCA9ICh0X2YpIC0+XG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0dXJuIF9jYWxjVG90YWxcbiAgICAgIGVsc2VcbiAgICAgICAgX2NhbGNUb3RhbCA9IHRfZlxuICAgICAgICByZXR1cm4gbWVcblxuICAgIG1lLm1pbiA9ICgpIC0+XG4gICAgICBfbWluXG5cbiAgICBtZS5tYXggPSAoKSAtPlxuICAgICAgX21heFxuXG4gICAgbWUubWluVG90YWwgPSAoKSAtPlxuICAgICAgX3RNaW5cblxuICAgIG1lLm1heFRvdGFsID0gKCkgLT5cbiAgICAgIF90TWF4XG5cbiAgICBtZS5leHRlbnQgPSAoKSAtPlxuICAgICAgW21lLm1pbigpLCBtZS5tYXgoKV1cblxuICAgIG1lLnRvdGFsRXh0ZW50ID0gKCkgLT5cbiAgICAgIFttZS5taW5Ub3RhbCgpLCBtZS5tYXhUb3RhbCgpXVxuXG4gICAgbWUuY29sdW1ucyA9IChkYXRhKSAtPlxuICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxXG4gICAgICAgICNfbGF5ZXJLZXlzLm1hcCgoaykgLT4ge2tleTprLCB2YWx1ZXM6ZGF0YS5tYXAoKGQpIC0+IHt4OiBkW194XSwgdmFsdWU6IGRba10sIGRhdGE6IGR9ICl9KVxuICAgICAgICByZXMgPSBbXVxuICAgICAgICBfbWluID0gSW5maW5pdHlcbiAgICAgICAgX21heCA9IC1JbmZpbml0eVxuICAgICAgICBfdE1pbiA9IEluZmluaXR5XG4gICAgICAgIF90TWF4ID0gLUluZmluaXR5XG5cbiAgICAgICAgZm9yIGssIGkgaW4gX2xheWVyS2V5c1xuICAgICAgICAgIHJlc1tpXSA9IHtrZXk6aywgdmFsdWU6W10sIG1pbjpJbmZpbml0eSwgbWF4Oi1JbmZpbml0eX1cbiAgICAgICAgZm9yIGQsIGkgaW4gZGF0YVxuICAgICAgICAgIHQgPSAwXG4gICAgICAgICAgeHYgPSBpZiB0eXBlb2YgX3ggaXMgJ3N0cmluZycgdGhlbiBkW194XSBlbHNlIF94KGQpXG5cbiAgICAgICAgICBmb3IgbCBpbiByZXNcbiAgICAgICAgICAgIHYgPSArZFtsLmtleV1cbiAgICAgICAgICAgIGwudmFsdWUucHVzaCB7eDp4diwgdmFsdWU6IHYsIGtleTpsLmtleX1cbiAgICAgICAgICAgIGlmIGwubWF4IDwgdiB0aGVuIGwubWF4ID0gdlxuICAgICAgICAgICAgaWYgbC5taW4gPiB2IHRoZW4gbC5taW4gPSB2XG4gICAgICAgICAgICBpZiBfbWF4IDwgdiB0aGVuIF9tYXggPSB2XG4gICAgICAgICAgICBpZiBfbWluID4gdiB0aGVuIF9taW4gPSB2XG4gICAgICAgICAgICBpZiBfY2FsY1RvdGFsIHRoZW4gdCArPSArdlxuICAgICAgICAgIGlmIF9jYWxjVG90YWxcbiAgICAgICAgICAgICN0b3RhbC52YWx1ZS5wdXNoIHt4OmRbX3hdLCB2YWx1ZTp0LCBrZXk6dG90YWwua2V5fVxuICAgICAgICAgICAgaWYgX3RNYXggPCB0IHRoZW4gX3RNYXggPSB0XG4gICAgICAgICAgICBpZiBfdE1pbiA+IHQgdGhlbiBfdE1pbiA9IHRcbiAgICAgICAgcmV0dXJuIHttaW46X21pbiwgbWF4Ol9tYXgsIHRvdGFsTWluOl90TWluLHRvdGFsTWF4Ol90TWF4LCBkYXRhOnJlc31cbiAgICAgIHJldHVybiBtZVxuXG5cblxuICAgIG1lLnJvd3MgPSAoZGF0YSkgLT5cbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMVxuICAgICAgICByZXR1cm4gZGF0YS5tYXAoKGQpIC0+IHt4OiBkW194XSwgbGF5ZXJzOiBsYXllcktleXMubWFwKChrKSAtPiB7a2V5OmssIHZhbHVlOiBkW2tdLCB4OmRbX3hdfSl9KVxuICAgICAgcmV0dXJuIG1lXG5cblxuICAgIHJldHVybiBtZSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLmRpcmVjdGl2ZSAnc3ZnSWNvbicsICgkbG9nKSAtPlxuICAjIyBpbnNlcnQgc3ZnIHBhdGggaW50byBpbnRlcnBvbGF0ZWQgSFRNTC4gUmVxdWlyZWQgcHJldmVudCBBbmd1bGFyIGZyb20gdGhyb3dpbmcgZXJyb3IgKEZpeCAyMilcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICAgdGVtcGxhdGU6ICc8c3ZnIG5nLXN0eWxlPVwic3R5bGVcIj48cGF0aD48L3BhdGg+PC9zdmc+J1xuICAgIHNjb3BlOlxuICAgICAgcGF0aDogXCI9XCJcbiAgICAgIHdpZHRoOiBcIkBcIlxuICAgIGxpbms6IChzY29wZSwgZWxlbSwgYXR0cnMgKSAtPlxuICAgICAgc2NvcGUuc3R5bGUgPSB7ICAjIGZpeCBJRSBwcm9ibGVtIHdpdGggaW50ZXJwb2xhdGluZyBzdHlsZSB2YWx1ZXNcbiAgICAgICAgaGVpZ2h0OiAnMjBweCdcbiAgICAgICAgd2lkdGg6IHNjb3BlLndpZHRoICsgJ3B4J1xuICAgICAgICAndmVydGljYWwtYWxpZ24nOiAnbWlkZGxlJ1xuICAgICAgfVxuICAgICAgc2NvcGUuJHdhdGNoICdwYXRoJywgKHZhbCkgLT5cbiAgICAgICAgaWYgdmFsXG4gICAgICAgICAgZDMuc2VsZWN0KGVsZW1bMF0pLnNlbGVjdCgncGF0aCcpLmF0dHIoJ2QnLCB2YWwpLmF0dHIoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKDgsOClcIilcbiAgfSIsImFuZ3VsYXIubW9kdWxlKCd3ay5jaGFydCcpLnNlcnZpY2UgJ3V0aWxzJywgKCRsb2cpIC0+XG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIEBkaWZmID0gKGEsYixkaXJlY3Rpb24pIC0+XG4gICAgbm90SW5CID0gKHYpIC0+XG4gICAgICBiLmluZGV4T2YodikgPCAwXG5cbiAgICByZXMgPSB7fVxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IGEubGVuZ3RoXG4gICAgICBpZiBub3RJbkIoYVtpXSlcbiAgICAgICAgcmVzW2FbaV1dID0gdW5kZWZpbmVkXG4gICAgICAgIGogPSBpICsgZGlyZWN0aW9uXG4gICAgICAgIHdoaWxlIDAgPD0gaiA8IGEubGVuZ3RoXG4gICAgICAgICAgaWYgbm90SW5CKGFbal0pXG4gICAgICAgICAgICBqICs9IGRpcmVjdGlvblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc1thW2ldXSA9ICBhW2pdXG4gICAgICAgICAgICBicmVha1xuICAgICAgaSsrXG4gICAgcmV0dXJuIHJlc1xuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBpZCA9IDBcbiAgQGdldElkID0gKCkgLT5cbiAgICByZXR1cm4gJ0NoYXJ0JyArIGlkKytcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgQHBhcnNlTGlzdCA9ICh2YWwpIC0+XG4gICAgaWYgdmFsXG4gICAgICBsID0gdmFsLnRyaW0oKS5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpLnNwbGl0KCcsJykubWFwKChkKSAtPiBkLnJlcGxhY2UoL15bXFxcInwnXXxbXFxcInwnXSQvZywgJycpKVxuICAgICAgcmV0dXJuIGlmIGwubGVuZ3RoIGlzIDEgdGhlbiByZXR1cm4gbFswXSBlbHNlIGxcbiAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIEBtZXJnZURhdGEgPSAoKSAtPlxuXG4gICAgX3ByZXZEYXRhID0gW11cbiAgICBfZGF0YSA9IFtdXG4gICAgX3ByZXZIYXNoID0ge31cbiAgICBfaGFzaCA9IHt9XG4gICAgX3ByZXZDb21tb24gPSBbXVxuICAgIF9jb21tb24gPSBbXVxuICAgIF9maXJzdCA9IHVuZGVmaW5lZFxuICAgIF9sYXN0ID0gdW5kZWZpbmVkXG5cbiAgICBfa2V5ID0gKGQpIC0+IGQgIyBpZGVudGl0eVxuICAgIF9sYXllcktleSA9IChkKSAtPiBkXG5cblxuICAgIG1lID0gKGRhdGEpIC0+XG4gICAgICAjIHNhdmUgX2RhdGEgdG8gX3ByZXZpb3VzRGF0YSBhbmQgdXBkYXRlIF9wcmV2aW91c0hhc2g7XG4gICAgICBfcHJldkRhdGEgPSBbXVxuICAgICAgX3ByZXZIYXNoID0ge31cbiAgICAgIGZvciBkLGkgIGluIF9kYXRhXG4gICAgICAgIF9wcmV2RGF0YVtpXSA9IGQ7XG4gICAgICAgIF9wcmV2SGFzaFtfa2V5KGQpXSA9IGlcblxuICAgICAgI2l0ZXJhdGUgb3ZlciBkYXRhIGFuZCBkZXRlcm1pbmUgdGhlIGNvbW1vbiBlbGVtZW50c1xuICAgICAgX3ByZXZDb21tb24gPSBbXTtcbiAgICAgIF9jb21tb24gPSBbXTtcbiAgICAgIF9oYXNoID0ge307XG4gICAgICBfZGF0YSA9IGRhdGE7XG5cbiAgICAgIGZvciBkLGogaW4gX2RhdGFcbiAgICAgICAga2V5ID0gX2tleShkKVxuICAgICAgICBfaGFzaFtrZXldID0galxuICAgICAgICBpZiBfcHJldkhhc2guaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICAgICNlbGVtZW50IGlzIGluIGJvdGggYXJyYXlzXG4gICAgICAgICAgX3ByZXZDb21tb25bX3ByZXZIYXNoW2tleV1dID0gdHJ1ZVxuICAgICAgICAgIF9jb21tb25bal0gPSB0cnVlXG4gICAgICByZXR1cm4gbWU7XG5cbiAgICBtZS5rZXkgPSAoZm4pIC0+XG4gICAgICBpZiBub3QgYXJndW1lbnRzIHRoZW4gcmV0dXJuIF9rZXlcbiAgICAgIF9rZXkgPSBmbjtcbiAgICAgIHJldHVybiBtZTtcblxuICAgIG1lLmZpcnN0ID0gKGZpcnN0KSAtPlxuICAgICAgaWYgbm90IGFyZ3VtZW50cyB0aGVuIHJldHVybiBfZmlyc3RcbiAgICAgIF9maXJzdCA9IGZpcnN0XG4gICAgICByZXR1cm4gbWVcblxuICAgIG1lLmxhc3QgPSAobGFzdCkgLT5cbiAgICAgIGlmIG5vdCBhcmd1bWVudHMgdGhlbiByZXR1cm4gX2xhc3RcbiAgICAgIF9sYXN0ID0gbGFzdFxuICAgICAgcmV0dXJuIG1lXG5cbiAgICBtZS5hZGRlZCA9ICgpIC0+XG4gICAgICByZXQgPSBbXTtcbiAgICAgIGZvciBkLCBpIGluIF9kYXRhXG4gICAgICAgIGlmICFfY29tbW9uW2ldIHRoZW4gcmV0LnB1c2goX2QpXG4gICAgICByZXR1cm4gcmV0XG5cbiAgICBtZS5kZWxldGVkID0gKCkgLT5cbiAgICAgIHJldCA9IFtdO1xuICAgICAgZm9yIHAsIGkgaW4gX3ByZXZEYXRhXG4gICAgICAgIGlmICFfcHJldkNvbW1vbltpXSB0aGVuIHJldC5wdXNoKF9wcmV2RGF0YVtpXSlcbiAgICAgIHJldHVybiByZXRcblxuICAgIG1lLmN1cnJlbnQgPSAoa2V5KSAtPlxuICAgICAgcmV0dXJuIF9kYXRhW19oYXNoW2tleV1dXG5cbiAgICBtZS5wcmV2ID0gKGtleSkgLT5cbiAgICAgIHJldHVybiBfcHJldkRhdGFbX3ByZXZIYXNoW2tleV1dXG5cbiAgICBtZS5hZGRlZFByZWQgPSAoYWRkZWQpIC0+XG4gICAgICBwcmVkSWR4ID0gX2hhc2hbX2tleShhZGRlZCldXG4gICAgICB3aGlsZSAhX2NvbW1vbltwcmVkSWR4XVxuICAgICAgICBpZiBwcmVkSWR4LS0gPCAwIHRoZW4gcmV0dXJuIF9maXJzdFxuICAgICAgcmV0dXJuIF9wcmV2RGF0YVtfcHJldkhhc2hbX2tleShfZGF0YVtwcmVkSWR4XSldXVxuXG4gICAgbWUuZGVsZXRlZFN1Y2MgPSAoZGVsZXRlZCkgLT5cbiAgICAgIHN1Y2NJZHggPSBfcHJldkhhc2hbX2tleShkZWxldGVkKV1cbiAgICAgIHdoaWxlICFfcHJldkNvbW1vbltzdWNjSWR4XVxuICAgICAgICBpZiBzdWNjSWR4KysgPj0gX3ByZXZEYXRhLmxlbmd0aCB0aGVuIHJldHVybiBfbGFzdFxuICAgICAgcmV0dXJuIF9kYXRhW19oYXNoW19rZXkoX3ByZXZEYXRhW3N1Y2NJZHhdKV1dXG5cbiAgICByZXR1cm4gbWU7XG5cbiAgQG1lcmdlU2VyaWVzID0gIChhT2xkLCBhTmV3KSAgLT5cbiAgICBpT2xkID0gMFxuICAgIGlOZXcgPSAwXG4gICAgbE9sZE1heCA9IGFPbGQubGVuZ3RoIC0gMVxuICAgIGxOZXdNYXggPSBhTmV3Lmxlbmd0aCAtIDFcbiAgICBsTWF4ID0gTWF0aC5tYXgobE9sZE1heCwgbE5ld01heClcbiAgICByZXN1bHQgPSBbXVxuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4IGFuZCBpTmV3IDw9IGxOZXdNYXhcbiAgICAgIGlmICthT2xkW2lPbGRdIGlzICthTmV3W2lOZXddXG4gICAgICAgIHJlc3VsdC5wdXNoKFtpT2xkLCBNYXRoLm1pbihpTmV3LGxOZXdNYXgpLGFPbGRbaU9sZF1dKTtcbiAgICAgICAgI2NvbnNvbGUubG9nKCdzYW1lJywgYU9sZFtpT2xkXSk7XG4gICAgICAgIGlPbGQrKztcbiAgICAgICAgaU5ldysrO1xuICAgICAgZWxzZSBpZiArYU9sZFtpT2xkXSA8ICthTmV3W2lOZXddXG4gICAgICAgICMgYU9sZFtpT2xkIGlzIGRlbGV0ZWRcbiAgICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSlcbiAgICAgICAgIyBjb25zb2xlLmxvZygnZGVsZXRlZCcsIGFPbGRbaU9sZF0pO1xuICAgICAgICBpT2xkKytcbiAgICAgIGVsc2VcbiAgICAgICAgIyBhTmV3W2lOZXddIGlzIGFkZGVkXG4gICAgICAgIHJlc3VsdC5wdXNoKFt1bmRlZmluZWQsIE1hdGgubWluKGlOZXcsbE5ld01heCksYU5ld1tpTmV3XV0pXG4gICAgICAgICMgY29uc29sZS5sb2coJ2FkZGVkJywgYU5ld1tpTmV3XSk7XG4gICAgICAgIGlOZXcrK1xuXG4gICAgd2hpbGUgaU9sZCA8PSBsT2xkTWF4XG4gICAgICAjIGlmIHRoZXJlIGlzIG1vcmUgb2xkIGl0ZW1zLCBtYXJrIHRoZW0gYXMgZGVsZXRlZFxuICAgICAgcmVzdWx0LnB1c2goW2lPbGQsdW5kZWZpbmVkLCBhT2xkW2lPbGRdXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdkZWxldGVkJywgYU9sZFtpT2xkXSk7XG4gICAgICBpT2xkKys7XG5cbiAgICB3aGlsZSBpTmV3IDw9IGxOZXdNYXhcbiAgICAgICMgaWYgdGhlcmUgaXMgbW9yZSBuZXcgaXRlbXMsIG1hcmsgdGhlbSBhcyBhZGRlZFxuICAgICAgcmVzdWx0LnB1c2goW3VuZGVmaW5lZCwgTWF0aC5taW4oaU5ldyxsTmV3TWF4KSxhTmV3W2lOZXddXSk7XG4gICAgICAjIGNvbnNvbGUubG9nKCdhZGRlZCcsIGFOZXdbaU5ld10pO1xuICAgICAgaU5ldysrO1xuXG4gICAgcmV0dXJuIHJlc3VsdFxuXG4gIHJldHVybiBAXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=