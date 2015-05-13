###*
  @ngdoc layout
  @name rangeAreaVertical
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a range-area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
  @example
###
angular.module('wk.chart').directive 'rangeAreaVertical', (wkRangeAreaVertical, $log, utils, dataManagerFactory, markerFactory, tooltipHelperFactory) ->
  lineCntr = 0
  return {
  restrict: 'A'
  require: 'layout'
  link: (scope, element, attrs, controller) ->
    host = controller.me
    #$log.log 'linking s-line'
    model = wkRangeAreaVertical()
    model.layout(host)
    
    #--- Property Observers ------------------------------------------------------------------------------------------
    ###*
      @ngdoc attr
      @name rangeAreaVertical#markers
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
      @name rangeAreaVertical#spline
      @values true, false
      @param [spline=false] {boolean} - interpolate the area shape using bSpline
    ###
    attrs.$observe 'spline', (val) ->
      if val is '' or val is 'true'
        model.spline(true)
      else
        model.spline(false)
      host.lifeCycle().update()

    ###*
      @ngdoc attr
      @name rangeAreaVertical#areaStyle
      @param [areaStyle] {object} - Set the pie style for columns lines in the layout
    ###
    attrs.$observe 'areaStyle', (val) ->
      if val
        model.areaStyle(scope.$eval(val))

  }
