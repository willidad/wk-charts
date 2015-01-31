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

      _tooltip = undefined
      _circles = undefined
      _showMarkers = false
      _scaleList = {}
      offset = 0
      _id = 'line' + lineCntr++
      line = undefined
      markers = undefined
      markersBrushed = undefined
      layoutData = undefined
      _initialMarkerOpacity = 0
      _markerOpacity = 0
      _initialOpacity = 0

      xData = dataManagerFactory()

      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      ttEnter = (idx) ->
        ttMoveData.apply(this, [idx])

      ttMoveData = (idx) ->
        ttLayers = layoutData.map((d) -> {name: d.layerKey, value: _scaleList.y.formatValue(d.values[idx].value),color:{'background-color':_scaleList.color.scale()(d.layerKey)}})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formattedValue(layoutData[0].values[idx].data.data)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(layoutData, (d) -> d.layerKey)
        _circles.enter().append('g').attr('class', "wk-chart-marker-#{_id}").call(tooltipUtils.createTooltipMarkers)
        _circles.selectAll('circle').attr('cy', (d) -> _scaleList.y.scale()(d.values[idx].value))
        _circles.exit().remove()
        this.attr('transform', "translate(#{_scaleList.x.map(layoutData[0].values[idx].data.data) + offset})") # need to compute form scale because of brushing

      #--- Draw --------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        xData.keyScale(x).valueScale(y).data(data)
        if not xData.isInitial()
          layoutData = xData.animationStartLayers()
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        if _showMarkers
          _markerOpacity = 1  #ensure makers show up animated when markers property changes
        layoutData = xData.animationEndLayers()
        drawPath.apply(this, [true, layoutData, options, x, y, color])

      drawPath = (doAnimate, data, options, x, y, color) ->

        offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
        if _tooltip then _tooltip.data(data)

        line = d3.svg.line()
          .x((d) -> x.scale()(d.key))
          .y((d) -> y.scale()(if d.added or d.deleted then 0 else d.value))

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
              .attr('cx', (d) -> x.scale()(d.key))
              .attr('cy', (d) -> y.scale()(if d.added or d.deleted then 0 else d.value))
              .style('opacity', (d)-> (if d.added or d.deleted then 0 else 1) * _markerOpacity)
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
          m.attr('cx', (d) ->  _scaleList.x.scale()(d.key))

      brush = (axis, idxRange) ->
        lines = this.selectAll(".wk-chart-line")
        if axis.isOrdinal()
          lines.attr('d', (d) -> line(d.values.slice(idxRange[0],idxRange[1] + 1)))
        else
          lines.attr('d', (d) -> line(d.values))
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