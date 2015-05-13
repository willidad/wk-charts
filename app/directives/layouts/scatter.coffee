###*
  @ngdoc layout
  @name scatter
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a icon chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear]
  @usesDimension color [type=category20]
  @usesDimension size [type=linear]
  @usesDimension shape [type=ordinal]
###
angular.module('wk.chart').directive 'scatter', (wkScatter, $log, utils) ->
  scatterCnt = 0
  return {
    restrict: 'A'
    require: '^layout'
    link: (scope, element, attrs, controller) ->
      layout = controller.me
      model = wkScatter()
      model.layout(layout)
      
  }

#TODO verify behavior with custom tooltips