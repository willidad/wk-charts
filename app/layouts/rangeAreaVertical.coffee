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

angular.module('wk.chart').directive 'rangeAreaVertical', ($log, utils, dataManagerFactory, markerFactory, tooltipHelperFactory) ->
  lineCntr = 0
  return {
  restrict: 'A'
  require: 'layout'
  link: (scope, element, attrs, controller) ->
    host = controller.me
    #$log.log 'linking s-line'

    _tooltip = undefined
    _scaleList = {}
    _showMarkers = false
    _spline = false
    offset = 0
    _id = 'rangeareavertical' + lineCntr++
    area = undefined
    layoutData = undefined
    _initialOpacity = 0
    _areaStyle = {}

    xData = dataManagerFactory()
    markers = markerFactory()
    ttHelper = tooltipHelperFactory()

    #-----------------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color, size) ->
      xData.keyScale(y).valueScale(x).data(data)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color, size) ->
      markers.active(_showMarkers)
      layoutData = xData.animationEndLayers()
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      offset = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      area = d3.svg.area()
        .x((d) -> -y.scale()(d.targetKey))
        .y((d) -> x.scale()(d.value))
        .y1((d) -> x.scale()(d.value1))

      if _spline
        area.interpolate('cardinal')

      i = 0
      rangeData = [{values:data[1].values, layerKey:data[1].layerKey}]
      while i < rangeData[0].values.length
        rangeData[0].values[i].value1 = data[0].values[i].value
        i++

      layers = this.selectAll(".wk-chart-layer")
        .data(data, (d) -> d.layerKey)
      layers.enter()
        .append('g').attr('class','wk-chart-layer')

      range = this.selectAll('.wk-chart-area-path')
        .data(rangeData, (d) -> d.layerKey)
      range.enter().append('path')
        .attr('class','wk-chart-area-path')
        .attr('d', (d) -> area(d.values))
        .style('opacity', _initialOpacity)
        .style('pointer-events', 'none')
        .style('stroke', (d) -> color.scale()(d.layerKey))
        .style('fill', (d) -> color.scale()(d.layerKey))
        .attr('transform', "translate(0,#{offset})rotate(-90)") #rotate and position chart

      range
        .style('stroke', (d) -> color.scale()(d.layerKey))
        .style('pointer-events', 'none')
        .style(_areaStyle)
      (if doAnimate then range.transition().duration( options.duration) else range)
        .attr('d', (d) -> area(d.values))
        .style('opacity', (d) -> if d.added or d.deleted then 0 else 1)

      range.exit().remove()

      layers.exit()
        .remove()

      markers
        .y((d) -> y.scale()(d.targetKey) + if y.isOrdinal() then y.scale().rangeBand() / 2 else 0)
        .x((d) -> x.scale()(d.value))
        .color((d) -> color.scale()(d.layerKey))
      layers.call(markers, doAnimate)

    brush = (axis, idxRange) ->
      rangeArea = this.selectAll(".wk-chart-area-path")
      if axis.isOrdinal()
        rangeArea.attr('d', (d) -> area(d.values.slice(idxRange[0],idxRange[1] + 1)))
        .attr('transform', "translate(#{axis.scale().rangeBand() / 2})")
        markers.brush(this, idxRange)
        ttHelper.brushRange(idxRange)
      else
        rangeArea.attr('d', (d) -> area(d.values))
        markers.brush(this, idxRange)

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @layerScale('color')
      @getKind('x').domainCalc('extent').resetOnNewData(true)
      @getKind('y').resetOnNewData(true).domainCalc('extent')
      _tooltip = host.behavior().tooltip
      ttHelper
      .keyScale(_scaleList.y)
      .valueScale(_scaleList.x)
      .colorScale(_scaleList.color)
      .value((d) -> d.value)
      _tooltip.markerScale(_scaleList.y)
      _tooltip.on "enter.#{_id}", ttHelper.moveData
      _tooltip.on "moveData.#{_id}", ttHelper.moveData
      _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers

    #host.lifeCycle().on "drawChart", draw
    host.lifeCycle().on "brushDraw.#{_id}", brush
    host.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
    host.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

    host.lifeCycle().on "destroy.#{_id}", ->
      host.lifeCycle().on ".#{_id}", null
      _tooltip.on ".#{_id}", null

    #--- Property Observers ------------------------------------------------------------------------------------------
    ###*
      @ngdoc attr
      @name rangeAreaVertical#markers
      @values true, false
      @param [markers=false] {boolean} - show a data maker icon for each data point
    ###
    attrs.$observe 'markers', (val) ->
      if val is '' or val is 'true'
        _showMarkers = true
      else
        _showMarkers = false
      host.lifeCycle().update()

    ###*
      @ngdoc attr
      @name rangeAreaVertical#spline
      @values true, false
      @param [spline=false] {boolean} - interpolate the area shape using bSpline
    ###
    attrs.$observe 'spline', (val) ->
      if val is '' or val is 'true'
        _spline = true
      else
        _spline = false
      host.lifeCycle().update()

    ###*
      @ngdoc attr
      @name rangeAreaVertical#areaStyle
      @param [areaStyle] {object} - Set the pie style for columns lines in the layout
    ###
    attrs.$observe 'areaStyle', (val) ->
      if val
        _areaStyle = scope.$eval(val)

  }
