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

angular.module('wk.chart').directive 'area', ($log, utils, tooltipUtils, dataManagerFactory) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'

      _tooltip = undefined
      _circles = undefined
      _scaleList = {}
      _showMarkers = false
      offset = 0
      _id = 'area' + lineCntr++
      area = undefined
      areaBrush = undefined

      layerKeys = []
      layerKeysOld = []
      layoutData = undefined
      _initialMarkerOpacity = 0
      _markerOpacity = 0
      _initialOpacity = 0

      xData = dataManagerFactory()

      #--- Tooltip handlers --------------------------------------------------------------------------------------------

      ttEnter = (idx) ->
        ttMoveData.apply(this, [idx])

      ttMoveData = (idx) ->
        ttLayers = layoutData.map((d) -> {name: d.key, value: _scaleList.y.layerValue(d.value[idx].data,d.key),color:{'background-color':d.color}, x:_scaleList.x.formattedValue(d.value[idx].data)})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(ttLayers[0].x)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(layoutData, (d) -> d.key)
        _circles.enter().append('g').attr('class', "wk-chart-marker-#{_id}").call(tooltipUtils.createTooltipMarkers)
        _circles.selectAll('circle').attr('cy', (d) -> d.value[idx].y)
        _circles.exit().remove()
        this.attr('transform', "translate(#{_scaleList.x.map(layoutData[0].value[idx].data) + offset})") # need to compute form scale because of brushing

      #-----------------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        layerKeys = y.layerKeys(data)
        if x.scaleType() is 'time'
          xData.key((d)-> +x.value(d)) # convert to number
        else
          xData.key(x.value)
        xData.data(data).keyScale(x)

        if not xData.isInitial()
          animationStartPath = xData.getMergedOld()
          layoutData = layerKeys.map((key) -> {key:key, color: color.scale()(key), value: animationStartPath.map((d) -> {x:x.scale()(d.key), y:y.scale()(y.layerValue(d.data,key)), color:color.scale()(key), data:d.data})})
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        if _showMarkers
          _markerOpacity = 1  #ensure makers show up animated when markers property changes
        layerKeys = y.layerKeys(data)
        animationEndPath = xData.getMergedNew()
        layoutData = layerKeys.map((key) -> {key:key, color: color.scale()(key), value: animationEndPath.map((d) -> {x:x.scale()(d.key), y:y.scale()(y.layerValue(d.data,key)), color:color.scale()(key), data:d.data})})
        drawPath.apply(this, [true, layoutData, options, x, y, color])
        layerKeysOld = layerKeys


      drawPath = (doAnimate, data, options, x, y, color) ->

        offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
        if _tooltip then _tooltip.data(data)

        area = d3.svg.area()
        .x((d) -> d.x)
        .y((d) -> d.y)
        .y1((d) ->  y.scale()(0))

        areaBrush = d3.svg.area()
        .x((d) -> x.map(d.data))
        .y((d) -> d.y)
        .y1((d) ->  y.scale()(0))

        drawAreas = (s) ->
          s.attr('d', (d) -> area(d.value))
          .style('stroke', (d) -> d.color)
          .style('opacity', 1).style('pointer-events', 'none')

        layers = this.selectAll(".wk-chart-layer")
        .data(data, (d) -> d.key)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter.append('path')
        .attr('class','wk-chart-area-path')
        .attr('d', (d) -> area(d.value))
        .style('opacity', _initialMarkerOpacity)
        .style('pointer-events', 'none')
        .style('stroke', (d) -> d.color)
        .style('fill', (d) -> d.color)

        if doAnimate
          layers.select('.wk-chart-area-path').attr('transform', "translate(#{offset})")
          .transition().duration( options.duration)
          .call(drawAreas)
        else
          layers.select('.wk-chart-area-path').attr('transform', "translate(#{offset})")
          .call(drawAreas)

        layers.exit()
        .remove()

        markers = (s, duration) ->
          if _showMarkers
            m = s.selectAll('.wk-chart-marker').data(
              (d) -> d.value
            , (d, i) -> i
            )

            m.enter().append('circle').attr('class', 'wk-chart-marker')
            .style('fill', (d) -> d.color)
            .attr('r', 5)
            .style('pointer-events', 'none')
            .style('opacity', _initialMarkerOpacity)
            mUpdate = if doAnimate then m.transition().duration(duration) else m
            mUpdate
            .attr('cx', (d) -> d.x)
            .attr('cy', (d) -> d.y)
            .style('opacity', _markerOpacity)
            mExit = if doAnimate then m.exit().transition().duration(duration) else m.exit()
            mExit
            .remove()
          else
            s.selectAll('.wk-chart-marker').transition().duration(duration)
            .style('opacity', 0).remove()
            _initialMarkerOpacity = 0
            _markerOpacity = 0

        layers.call(markers, options.duration)

        _initialOpacity = 1


      markersBrushed = (m) ->
        if _showMarkers
          m.attr('cx', (d) ->  _scaleList.x.map(d.data))

      brush = (axis, idxRange) ->
        lines = this.selectAll(".wk-chart-line")
        if axis.isOrdinal()
          lines.attr('d', (d) -> areaBrush(d.value.slice(idxRange[0],idxRange[1] + 1)))
        else
          lines.attr('d', (d) -> areaBrush(d.value))
        markers = this.selectAll('.wk-chart-marker').call(markersBrushed)


      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _tooltip.markerScale(_scaleList.x)
        _tooltip.on "enter.#{_id}", ttEnter
        _tooltip.on "moveData.#{_id}", ttMoveData
        _tooltip.on "moveMarker.#{_id}", ttMoveMarker

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

  }