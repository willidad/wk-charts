###*
  @ngdoc layout
  @name line
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  Draws a horizontal line chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent] The vertical dimension
  @usesDimension color [type=category20] the line coloring dimension


###
angular.module('wk.chart').directive 'line', ($log, behavior, utils, tooltipUtils, dataManagerFactory) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'
      _layerKeys = []
      _layout = []
      _dataOld = []
      _pathValuesOld = []
      _pathValuesNew = []
      _pathArray = []
      _initialOpacity = 0

      _tooltip = undefined
      _circles = undefined
      _showMarkers = false
      _scaleList = {}
      offset = 0
      _id = 'line' + lineCntr++
      line = undefined
      markers = undefined
      markersBrushed = undefined

      lineBrush = undefined

      layerKeys = undefined
      layerKeysOld = undefined
      layoutData = undefined
      _initialMarkerOpacity = 0

      xData = dataManagerFactory()

      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      ttEnter = (idx) ->
        ttMoveData.apply(this, [idx])

      ttMoveData = (idx) ->
        ttLayers = layoutData.map((d) -> {name: d.key, value: d.value[idx].data[d.key],color:{'background-color':d.color}, x:_scaleList.x.formattedValue(d.value[idx].data)})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(ttLayers[0].x)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(layoutData, (d) -> d.key)
        _circles.enter().append('g').attr('class', "wk-chart-marker-#{_id}").call(tooltipUtils.createTooltipMarkers)
        _circles.selectAll('circle').attr('cy', (d) -> d.value[idx].y)
        _circles.exit().remove()
        this.attr('transform', "translate(#{_scaleList.x.map(layoutData[0].value[idx].data) + offset})") # need to compute form scale because of brushing

      #--- Draw --------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        #$log.log 'preparing animation start state'
        layerKeys = layerKeysOld
        if x.scaleType() is 'time'
          xData.key((d)-> +x.value(d)) # convert to number
        else
          xData.key(x.value)
        xData.data(data)
        animationStartPath = xData.getMergedOld()
        #$log.debug 'animationStartPath', animationStartPath
        if not xData.isInitial()
          layoutData = layerKeys.map((key) -> {key:key, color: color.scale()(key), value: animationStartPath.map((d) -> {x:x.scale()(d.key), y:y.scale()(y.layerValue(d.data,key)), color:color.scale()(key), data:d.data})})
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        #$log.log 'preparing animation end state'
        layerKeys = y.layerKeys(data)
        animationEndPath = xData.getMergedNew()
        #$log.debug 'animationEndPath', animationEndPath
        layoutData = layerKeys.map((key) -> {key:key, color: color.scale()(key), value: animationEndPath.map((d) -> {x:x.scale()(d.key), y:y.scale()(y.layerValue(d.data,key)), color:color.scale()(key), data:d.data})})
        drawPath.apply(this, [true, layoutData, options, x, y, color])
        layerKeysOld = layerKeys

      drawPath = (doAnimate, data, options, x, y, color) ->

        offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
        if _tooltip then _tooltip.data(data)

        line = d3.svg.line()
          .x((d) -> d.x)
          .y((d) -> d.y)

        lineBrush = d3.svg.line()
        .x((d) -> x.map(d.data))
        .y((d) -> d.y)

        drawLines = (s) ->
          s.attr('d', (d) -> line(d.value))
            .style('stroke', (d) -> d.color)
            .style('opacity', 1).style('pointer-events', 'none')

        layers = this.selectAll(".wk-chart-layer")
          .data(data, (d) -> d.key)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter.append('path')
          .attr('class','wk-chart-line')
          .attr('d', (d) -> line(d.value))
          .style('opacity', _initialOpacity)
          .style('pointer-events', 'none')
          .style('stroke', (d) -> d.color)

        if doAnimate
          layers.select('.wk-chart-line').attr('transform', "translate(#{offset})")
            .transition().duration( options.duration)
            .call(drawLines)
        else
          layers.select('.wk-chart-line').attr('transform', "translate(#{offset})")
            .call(drawLines)

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
              .style('opacity', 0)
            mUpdate = if doAnimate then m.transition().duration(duration) else m
            mUpdate
              .attr('cx', (d) -> d.x)
              .attr('cy', (d) -> d.y)
              .style('opacity', _initialMarkerOpacity)
            mExit = if doAnimate then m.exit().transition().duration(duration) else m.exit()
            mExit
              .remove()
            _initialMarkerOpacity = 1
          else
            s.selectAll('.wk-chart-marker').transition().duration(duration)
              .style('opacity', 0).remove()
            _initialMarkerOpacity = 0

        layers.call(markers, options.duration)

        _initialOpacity = 1

      markersBrushed = (layer) ->
        if _showMarkers
          layer.attr('cx', (d) ->  x.map(d.data))

      brush = (axis, idxRange) ->
        lines = this.selectAll(".wk-chart-line")
        if axis.isOrdinal()
          lines.attr('d', (d) -> lineBrush(d.value.slice(idxRange[0],idxRange[1] + 1)))
        else
          lines.attr('d', (d) -> lineBrush(d.value))
        #markers = this.selectAll('.wk-chart-marker').call(markersBrushed)

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

      # host.lifeCycle().on 'drawChart', draw ignore for now
      host.lifeCycle().on 'brushDraw', brush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

      #--- Property Observers ------------------------------------------------------------------------------------------

      ###*
        @ngdoc attr
        @name line#markers
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