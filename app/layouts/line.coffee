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
angular.module('wk.chart').directive 'line', ($log, behavior, utils, dataManagerFactory, tooltipHelperFactory, markerFactory) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'

      _tooltip = undefined
      _showMarkers = false
      _scaleList = {}
      offset = 0
      _id = 'line' + lineCntr++
      line = undefined
      markers = undefined
      layoutData = undefined

      xData = dataManagerFactory()
      markers = markerFactory()
      ttHelper = tooltipHelperFactory()

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

        offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
        if _tooltip
          _tooltip.data(data)
          ttHelper.layout(data)

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
          .style('opacity', 0)
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

        markers
          .x((d) -> x.scale()(d.key) + if x.isOrdinal() then x.scale().rangeBand() / 2 else 0)
          .y((d) -> y.scale()(if d.added or d.deleted then 0 else d.value))
          .color((d) -> color.scale()(d.layerKey))
        layers.call(markers, doAnimate)

      brush = (axis, idxRange) ->
        lines = this.selectAll(".wk-chart-line")
        if axis.isOrdinal()
          lines.attr('d', (d) -> line(d.values.slice(idxRange[0],idxRange[1] + 1)))
        else
          lines.attr('d', (d) -> line(d.values))
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