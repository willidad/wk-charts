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

angular.module('wk.chart').directive 'areaStacked', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  stackedAreaCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me

      stack = d3.layout.stack()
      offset = 'zero'
      layers = null
      _showMarkers = false
      stackLayout = []
      area = undefined
      _tooltip = undefined
      _scaleList = {}
      scaleY = undefined
      offs = 0
      _id = 'areaStacked' + stackedAreaCntr++

      xData = dataManagerFactory()
      markers = markerFactory()

      layoutData = undefined
      ttHelper = tooltipHelperFactory()

      #-----------------------------------------------------------------------------------------------------------------

      stack
        .values((d)->d.values)
        .y((d) -> d.value)
        .x((d) -> d.targetKey)

      #--- Draw --------------------------------------------------------------------------------------------------------

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

        stackLayout = stack(data)

        offs = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
        $log.log 'offset' ,offs

        if _tooltip
          _tooltip.data(data)
          ttHelper.layout(data)

        if not layers
          layers = this.selectAll('.wk-chart-layer')

        if offset is 'expand'
          scaleY = y.scale().copy()
          scaleY.domain([0, 1])
        else scaleY = y.scale()

        area = d3.svg.area()
          .x((d) ->  x.scale()(d.targetKey))
          .y0((d) ->  scaleY(d.y0 + d.y))
          .y1((d) ->  scaleY(d.y0))

        layers = layers
          .data(stackLayout, (d) -> d.layerKey)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter
          .append('path').attr('class', 'wk-chart-area-path')
            .style('pointer-events', 'none')
            .style('opacity', 0)

        pathLayers = layers.select('.wk-chart-area-path')
          .style('fill', (d, i) -> color.scale()(d.layerKey))
          .style('stroke', (d, i) -> color.scale()(d.layerKey))
          .attr('transform', "translate(#{offs})")

        updLayers = if doAnimate then pathLayers.transition().duration(options.duration) else pathLayers

        updLayers
          .attr('d', (d) -> area(d.values))
          .style('opacity', 1)

        layers.exit() #.transition().duration(options.duration)
          .remove()

        markers
          .x((d) -> x.scale()(d.targetKey))
          .y((d) -> scaleY(d.y + d.y0))
          .color((d) -> color.scale()(d.layerKey))

        layers.call(markers, doAnimate)

      brush = (axis, idxRange) ->
        layers = this.selectAll(".wk-chart-area-path")
        if axis.isOrdinal()
          layers.attr('d', (d) -> area(d.values.slice(idxRange[0],idxRange[1] + 1)))
            .attr('transform', "translate(#{axis.scale().rangeBand() / 2})")
          markers.brush(this, idxRange)
          ttHelper.brushRange(idxRange)
        else
          layers.attr('d', (d) -> area(d.values))
          markers.brush(this)

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('total').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        ttHelper
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
          .colorScale(_scaleList.color)
          .value((d) -> d.y + d.y0)
        _tooltip.markerScale(_scaleList.x)
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', brush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

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
        stack.offset(offset)
        host.lifeCycle().update()

      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          _showMarkers = true
        else
          _showMarkers = false
        host.lifeCycle().update()
  }

