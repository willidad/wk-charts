###*
  @ngdoc layout
  @name areaStacked
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a horizontally stacked area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=total]
  @usesDimension color [type=category20]
###

angular.module('wk.chart').directive 'areaStacked', (wkAreaStacked, $log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      model = wkAreaStacked()
      model.layout(controller.me)
      #--- Property Observers ------------------------------------------------------------------------------------------

      ###*
          @ngdoc attr
          @name areaStacked#areaStacked
          @values zero, silhouette, expand, wiggle
          @param [areaStacked=zero] {string} Defines how the areas are stacked.
          For a description of the stacking algorithms please see [d3 Documentation on Stack Layout](https://github.com/mbostock/d3/wiki/Stack-Layout#offset)
      ###
      attrs.$observe 'areaStacked', (val) ->
        if val in ['zero', 'silhouette', 'expand', 'wiggle']
          offset = val
        else
          offset = "zero"
        model.offset(offset);
        controller.me.lifeCycle().update()

      ###*
        @ngdoc attr
        @name areaStacked#markers
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
        @name areaStacked#spline
        @values true, false
        @param [spline=false] {boolean} - interpolate the area shape using bSpline
      ###
      attrs.$observe 'spline', (val) ->
        if val is '' or val is 'true'
          model.sline(true)
        else
          model.spline(false)
        controller.me.lifeCycle().update()

      ###*
        @ngdoc attr
        @name areaStacked#areaStyle
        @param [areaStyle] {object} - Set the pie style for columns lines in the layout
      ###
      attrs.$observe 'areaStyle', (val) ->
        if val
          model.areaStyle(scope.$eval(val))
  }

