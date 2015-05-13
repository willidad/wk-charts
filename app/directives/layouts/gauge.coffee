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
angular.module('wk.chart').directive 'gauge', ($log, utils, wkGauge) ->
  return {
    restrict: 'A'
    require: '^layout'
    controller: ($scope, $attrs) ->
      $scope.me = wkGauge()
      return me
      
    link: (scope, element, attrs, controller) ->
      layout = controller.me
      scope.me.layout(layout)
  }

  #todo refector