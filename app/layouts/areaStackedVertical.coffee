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
angular.module('wk.chart').directive 'areaStackedVertical', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  areaStackedVertCntr = 0
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
      offs = 0
      _id = 'areaStacked' + areaStackedVertCntr++

      xData = dataManagerFactory()
      markers = markerFactory()
      ttHelper = tooltipHelperFactory()
      layoutData = undefined

      #-------------------------------------------------------------------------------------------------------------------

      stack
        .values((d)->d.values)
        .y((d) -> d.value)
        .x((d) -> d.targetKey)

      #--- Draw --------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        xData.keyScale(y).valueScale(x).data(data)
        if not xData.isInitial()
          layoutData = xData.animationStartLayers()
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        markers.active(_showMarkers)
        layoutData = xData.animationEndLayers()
        drawPath.apply(this, [true, layoutData, options, x, y, color])

      drawPath = (doAnimate, data, options, x, y, color) ->

        stackLayout = stack(data)

        offs = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0

        if _tooltip
          _tooltip.data(data)
          ttHelper.layout(data)

        if not layers
          layers = this.selectAll('.wk-chart-layer')

        if offset is 'expand'
          scaleX = x.scale().copy()
          scaleX.domain([0, 1])
        else scaleX = x.scale()

        area = d3.svg.area()
          .x((d) ->  -y.scale()(d.targetKey))
          .y0((d) ->  scaleX(d.y0 + d.y))
          .y1((d) ->  scaleX(d.y0))

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
          .attr('transform', "translate(#{offs})rotate(-90)")

        updLayers = if doAnimate then pathLayers.transition().duration(options.duration) else pathLayers

        updLayers
          .attr('d', (d) -> area(d.values))
          .style('opacity', 1)

        layers.exit() #.transition().duration(options.duration)
          .remove()

        markers
          .x((d) -> x.scale()(d.y + d.y0))
          .y((d) -> y.scale()(d.targetKey) +  if y.isOrdinal() then y.scale().rangeBand() / 2 else 0)
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
        @getKind('x').domainCalc('total').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        ttHelper
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)
          .isStacked(true)
          .colorScale(_scaleList.color)
          .value((d) -> d.y + d.y0)
        _tooltip.markerScale(_scaleList.y)
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers

      host.lifeCycle().on 'brushDraw', brush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

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