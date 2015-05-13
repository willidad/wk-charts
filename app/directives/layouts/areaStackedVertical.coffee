###*
  @ngdoc layout
  @name areaStackedVertical
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=total] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]

###
angular.module('wk.chart').directive 'areaStackedVertical', (wkAreaStackedVertical, $log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  areaStackedVertCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      model = wkAreaStackedVertical()
      model.layout(controller.me)
      #--- Property Observers ------------------------------------------------------------------------------------------

      ###*
          @ngdoc attr
          @name areaStackedVertical#areaStackedVertical
          @values zero, silhouette, expand, wiggle
          @param [areaStackedVertical=zero] {string} Defines how the areas are stacked.
          For a description of the stacking algorithms please see [d3 Documentation on Stack Layout](https://github.com/mbostock/d3/wiki/Stack-Layout#offset)

      ###
      attrs.$observe 'areaStackedVertical', (val) ->
        if val in ['zero', 'silhouette', 'expand', 'wiggle']
          model.offset(val)
          offset = val
        else
          model.offset("zero")
          offset = "zero"
        controller.me.lifeCycle().update()

      ###*
        @ngdoc attr
        @name areaStackedVertical#markers
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
        @name areaStackedVertical#spline
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
        @name areaStackedVertical#areaStyle
        @param [areaStyle] {object} - Set the pie style for columns lines in the layout
      ###
      attrs.$observe 'areaStyle', (val) ->
        if val
          model.areaStyle(scope.$eval(val))
  }
