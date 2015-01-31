###*
  @ngdoc layout
  @name lineVertical
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  Draws a vertical line chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent] The vertical dimension
  @usesDimension color [type=category20] the line coloring dimension


###
angular.module('wk.chart').directive 'lineVertical', ($log, utils, tooltipUtils, dataManagerFactory, markerFactory) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'

      markersBrushed = undefined
      brushStartIdx = 0
      _tooltip = undefined
      _ttHighlight = undefined
      _circles = undefined
      _showMarkers = false
      _scaleList = {}
      offset = 0
      _id = 'lineVertical' + lineCntr++

      layoutData = undefined
      _initialMarkerOpacity = 0
      _markerOpacity = 0
      _initialOpacity = 0
      line = undefined

      xData = dataManagerFactory()
      markers = markerFactory()

      #-----------------------------------------------------------------------------------------------------------------

      ttMoveData = (idx) ->
        ttLayers = layoutData.map((d) -> {name: d.layerKey, value: _scaleList.x.formatValue(d.values[idx].value),color:{'background-color':_scaleList.color.scale()(d.layerKey)}})
        @headerName = _scaleList.y.axisLabel()
        @headerValue = _scaleList.y.formattedValue(layoutData[0].values[idx].data.data)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(layoutData, (d) -> d.layerKey)
        _circles.enter().append('g').attr('class', "wk-chart-marker-#{_id}").call(tooltipUtils.createTooltipMarkers)
        _circles.selectAll('circle').attr('cx', (d) -> _scaleList.x.scale()(d.values[idx].value))
        _circles.exit().remove()
        offs = if _scaleList.y.isOrdinal then _scaleList.y.scale().rangeBand() / 2 else 0
        this.attr('transform', "translate(0,#{_scaleList.y.scale()(layoutData[0].values[idx].key) + offs})") # need to compute form scale because of brushing

      #-----------------------------------------------------------------------------------------------------------------

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

        offset = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0
        if _tooltip then _tooltip.data(data)

        line = d3.svg.line()
          .x((d) -> x.scale()(if d.added or d.deleted then 0 else d.value))
          .y((d) -> y.scale()(d.key))

        drawLines = (s) ->
          s.attr('d', (d) -> line(d.values))
            .style('stroke', (d) -> color.scale()(d.layerKey))
            .style('opacity', (d) -> if d.added or d.deleted then 0 else 1)
            .style('pointer-events', 'none')

        layers = this.selectAll(".wk-chart-layer")
        .data(data, (d) -> d.layerKey)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter.append('path')
          .attr('class','wk-chart-line')
          .attr('d', (d) -> line(d.values))
          .style('opacity', _initialMarkerOpacity)
          .style('pointer-events', 'none')
          .style('stroke', (d) -> color.scale()(d.layerKey))

        if doAnimate
          layers.select('.wk-chart-line')#.attr('transform', "translate(#{offset})")
          .transition().duration( options.duration)
          .call(drawLines)
        else
          layers.select('.wk-chart-line')#.attr('transform', "translate(#{offset})")
          .call(drawLines)

        layers.exit()
          .remove()

        markers
          .isVertical(true)
          .x((d) -> x.scale()(if d.added or d.deleted then 0 else d.value))
          .y((d) -> y.scale()(d.key) + if y.isOrdinal() then y.scale().rangeBand() / 2 else 0)
          .color((d) -> color.scale()(d.layerKey))
        layers.call(markers, doAnimate)

      brush = (axis, idxRange) ->
        layers = this.selectAll(".wk-chart-line")
        if axis.isOrdinal()
          brushStartIdx = idxRange[0]
          layers.attr('d', (d) -> line(d.values.slice(idxRange[0],idxRange[1] + 1)))
              .attr('transform', "translate(0,#{axis.scale().rangeBand() / 2})")
        else
          layers.attr('d', (d) -> line(d.value))
        markers.brush(this)

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _tooltip.markerScale(_scaleList.y)
        _tooltip.on "enter.#{_id}", ttMoveData
        _tooltip.on "moveData.#{_id}", ttMoveData
        _tooltip.on "moveMarker.#{_id}", ttMoveMarker

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', brush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

      #--- Property Observers ------------------------------------------------------------------------------------------

      ###*
        @ngdoc attr
        @name lineVertical#markers
        @values true, false
        @param [markers=false] {boolean} - show a data maker icon for each data point
      ###
      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          _showMarkers = true
        else
          _showMarkers = false
        host.lifeCycle().update()
  }