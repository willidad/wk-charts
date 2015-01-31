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
angular.module('wk.chart').directive 'areaStackedVertical', ($log, utils, tooltipUtils, dataManagerFactory) ->
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
      _circles = undefined
      _scaleList = {}
      scaleY = undefined
      offs = 0
      _id = 'areaStacked' + areaStackedVertCntr++

      xData = dataManagerFactory()
      layoutData = undefined
      _initialMarkerOpacity = 0
      _markerOpacity = 0
      _initialOpacity = 0

      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      ttEnter = (idx) ->
        ttMoveData.apply(this, [idx])

      ttMoveData = (idx) ->
        ttLayers = layoutData.map((d) -> {name: d.layerKey, value: _scaleList.x.formatValue(d.values[idx].value),color:{'background-color':_scaleList.color.scale()(d.layerKey)}})
        @headerName = _scaleList.y.axisLabel()
        @headerValue = _scaleList.y.formattedValue(layoutData[0].values[idx].data.data)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(stackLayout, (d) -> d.layerKey)
        _circles.enter().append('g').attr('class', "wk-chart-marker-#{_id}").call(tooltipUtils.createTooltipMarkers)
        _circles.selectAll('circle').attr('cx', (d) -> _scaleList.x.scale()(d.values[idx].y + d.values[idx].y0))
        _circles.exit().remove()
        this.attr('transform', "translate(0,#{_scaleList.y.map(stackLayout[0].values[idx].data.data) + offs})") # need to compute form scale because of brushing

      #-------------------------------------------------------------------------------------------------------------------

      stack.values((d)->d.values).y((d) -> if d.added or d.deleted then 0 else d.value).x((d) -> d.key)

      #--- Draw --------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        xData.keyScale(y).valueScale(x).data(data)
        if not xData.isInitial()
          layoutData = xData.animationStartLayers()
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        if _showMarkers
          _markerOpacity = 1  #ensure makers show up animated when markers property changes
        layoutData = xData.animationEndLayers()
        drawPath.apply(this, [true, layoutData, options, x, y, color])

      drawPath = (doAnimate, data, options, x, y, color) ->

        stackLayout = stack(data)

        offs = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0

        if _tooltip then _tooltip.data(data)

        if not layers
          layers = this.selectAll('.wk-chart-layer')

        if offset is 'expand'
          scaleX = x.scale().copy()
          scaleX.domain([0, 1])
        else scaleX = x.scale()

        area = d3.svg.area()
          .x((d) ->  -y.scale()(d.key))
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

        markers = (s, duration) ->
          if _showMarkers
            m = s.selectAll('.wk-chart-marker').data(
              (d) -> d.values
            , (d, i) -> i
            )

            m.enter().append('circle').attr('class', 'wk-chart-marker')
              .style('fill', (d) -> color.scale()(d.layerKey))
              .attr('r', 5)
              .style('pointer-events', 'none')
              .style('opacity', _initialMarkerOpacity)
            mUpdate = if doAnimate then m.transition().duration(duration) else m
            mUpdate
              .attr('cy', (d) -> y.scale()(d.key))
              .attr('cx', (d) -> x.scale()(d.y + d.y0))
              .style('opacity', (d) -> (if d.added or d.deleted then 0 else 1) * _markerOpacity)
            mExit = if doAnimate then m.exit().transition().duration(duration) else m.exit()
            mExit
            .remove()
          else
            s.selectAll('.wk-chart-marker').transition().duration(duration)
            .style('opacity', 0).remove()
            _initialMarkerOpacity = 0
            _markerOpacity = 0

        layers.call(markers, options.duration)

      markersBrushed = (m, axis) ->
        if _showMarkers
          m.attr('cy', (d) ->  axis.scale()(d.key) +  if axis.isOrdinal() then axis.scale().rangeBand() / 2 else 0)

      brush = (axis, idxRange) ->
        layers = this.selectAll(".wk-chart-area-path")
        if axis.isOrdinal()
          layers.attr('d', (d) -> area(d.values.slice(idxRange[0],idxRange[1] + 1)))
            .attr('transform', "translate(#{axis.scale().rangeBand() / 2})")
        else
          layers.attr('d', (d) -> area(d.values))
        markers = this.selectAll('.wk-chart-marker').call(markersBrushed, axis)

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('x').domainCalc('total').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _tooltip.markerScale(_scaleList.y)
        _tooltip.on "enter.#{_id}", ttMoveData
        _tooltip.on "moveData.#{_id}", ttMoveData
        _tooltip.on "moveMarker.#{_id}", ttMoveMarker

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