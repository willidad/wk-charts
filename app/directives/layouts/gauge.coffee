###*
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


###
angular.module('wk.chart').directive 'gauge', (wkGauge, $log, utils) ->
  return {
    restrict: 'A'
    require: '^layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      model = wkGauge()
      model.layout(host)
  }

  #todo refector