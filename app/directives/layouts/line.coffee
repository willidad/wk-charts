###*
  @ngdoc layout
  @name line
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  Draws a horizontal line chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent] The vertical dimension
  @usesDimension color [type=category20] the line coloring dimension


###
angular.module('wk.chart').directive 'line', (wkLine, $log, behavior, utils, dataManagerFactory, tooltipHelperFactory, markerFactory, timing) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'
      model = wkLine()
      model.layout(host)
      #--- Property Observers ------------------------------------------------------------------------------------------

      ###*
        @ngdoc attr
        @name line#markers
        @values true, false
        @param [markers=false] {boolean} - show a data maker icon for each data point
      ###
      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          model.markers(true)
        else
          model.markers(false)
        host.lifeCycle().update()

      ###*
        @ngdoc attr
        @name line#spline
        @values true, false
        @param [spline=false] {boolean} - interpolate the line using bSpline
      ###
      attrs.$observe 'spline', (val) ->
        if val is '' or val is 'true'
          model.spline(true)
        else
          model.spline(false)
        host.lifeCycle().update()

      ###*
        @ngdoc attr
        @name line#lineStyle
        @param [lineStyle] {object} - Set the line style for all lines in the layout
      ###
      attrs.$observe 'lineStyle', (val) ->
        if val
          model.lineStyle(scope.$eval(val))

  }