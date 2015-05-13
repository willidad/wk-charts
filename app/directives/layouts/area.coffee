###*
  @ngdoc layout
  @name area
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
  @example
###

angular.module('wk.chart').directive 'area', (wkArea, $log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  return {
    restrict: 'A'
    require: 'layout'
    controller: () ->
    link: (scope, element, attrs, controller) ->
      model = wkArea()
      model.layout(controller.me)

      #--- Property Observers ------------------------------------------------------------------------------------------
      ###*
        @ngdoc attr
        @name area#markers
        @values true, false
        @param [markers=false] {boolean} - show a data maker icon for each data point
      ###
      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          model.markers(true)
        else
          model.markers(false)
        controller.me.lifeCycle().update()

      ###*
        @ngdoc attr
        @name area#spline
        @values true, false
        @param [spline=false] {boolean} - interpolate the area shape using bSpline
      ###
      attrs.$observe 'spline', (val) ->
        if val is '' or val is 'true'
          model.spline(true)
        else
          model.spline(false)
        controller.me.lifeCycle().update()


      ###*
        @ngdoc attr
        @name area#areaStyle
        @param [areaStyle] {object} - Set the pie style for columns lines in the layout
      ###
      attrs.$observe 'areaStyle', (val) ->
        if val
          model.areaStyle(scope.$eval(val))
          controller.me.lifeCycle().update()
  }