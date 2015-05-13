###*
  @ngdoc layout
  @name columnHistogram
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a histogram chart layout

  @usesDimension rangeX [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'columnHistogramOld', (wkHistogram, $log, barConfig, utils, wkChartMargins) ->

  sHistoCntr = 0

  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me
      model = wkHistogram()
      model.layout(host)
      
      #-------------------------------------------------------------------------------------------------------------------
      ###*
          @ngdoc attr
          @name columnHistogram#labels
          @values true, false
          @param [labels=true] {boolean} controls the display of data labels for each of the bars.
      ###
      attrs.$observe 'labels', (val) ->
        if val is 'false'
          host.showDataLabels(false)
        else if val is 'true' or val is ""
          host.showDataLabels('y')
        host.lifeCycle().update()
  }
