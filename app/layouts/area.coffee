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

angular.module('wk.chart').directive 'area', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
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
      offset = 0
      _id = 'area' + lineCntr++
      area = undefined
      layoutData = undefined
      _initialOpacity = 0

      xData = dataManagerFactory()
      markers = markerFactory()
      ttHelper = tooltipHelperFactory()

      #-----------------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        xData.keyScale(x).valueScale(y).data(data)
        if not xData.isInitial()
          layoutData = xData.animationStartLayers()
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        markers.active(_showMarkers)
        layoutData = xData.animationEndLayers()
        drawPath.apply(this, [true, layoutData, options, x, y, color])

      drawPath = (doAnimate, data, options, x, y, color) ->

        offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
        if _tooltip
          _tooltip.data(data)
          ttHelper.layout(data)

        area = d3.svg.area()
          .x((d) -> x.scale()(d.targetKey))
          .y((d) -> y.scale()(d.value))
          .y1((d) ->  y.scale()(0))

        layers = this.selectAll(".wk-chart-layer")
          .data(data, (d) -> d.layerKey)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter.append('path')
          .attr('class','wk-chart-area-path')
          .attr('d', (d) -> area(d.values))
          .style('opacity', _initialOpacity)
          .style('pointer-events', 'none')
          .style('stroke', (d) -> color.scale()(d.layerKey))
          .style('fill', (d) -> color.scale()(d.layerKey))

        path = layers.select('.wk-chart-area-path')
          .attr('transform', "translate(#{offset})")
        path = if doAnimate then path.transition().duration( options.duration) else path
        path.attr('d', (d) -> area(d.values))
          .style('stroke', (d) -> color.scale()(d.layerKey))
          .style('opacity', (d) -> if d.added or d.deleted then 0 else 1)
          .style('pointer-events', 'none')

        layers.exit()
          .remove()

        markers
          .x((d) -> x.scale()(d.targetKey) + if x.isOrdinal() then x.scale().rangeBand() / 2 else 0)
          .y((d) -> y.scale()(d.value))
          .color((d) -> color.scale()(d.layerKey))
        layers.call(markers, doAnimate)

      brush = (axis, idxRange) ->
        lines = this.selectAll(".wk-chart-area-path")
        if axis.isOrdinal()
          lines.attr('d', (d) -> area(d.values.slice(idxRange[0],idxRange[1] + 1)))
            .attr('transform', "translate(#{axis.scale().rangeBand() / 2})")
          markers.brush(this, idxRange)
          ttHelper.brushRange(idxRange)
        else
          lines.attr('d', (d) -> area(d.values))
          markers.brush(this)

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        ttHelper
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)
        _tooltip.markerScale(_scaleList.x)
        _tooltip.on "enter.#{_id}", ttHelper.moveData
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', brush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

      #--- Property Observers ------------------------------------------------------------------------------------------

      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          _showMarkers = true
        else
          _showMarkers = false
        host.lifeCycle().update()

  }