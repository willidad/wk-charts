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
angular.module('wk.chart').directive 'lineVertical', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'

      brushStartIdx = 0
      _tooltip = undefined
      _showMarkers = false
      _spline = false
      _scaleList = {}
      offset = 0
      _id = 'lineVertical' + lineCntr++

      layoutData = undefined
      line = undefined

      xData = dataManagerFactory()
      markers = markerFactory()
      ttHelper = tooltipHelperFactory()

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
        if _tooltip
          _tooltip.data(data)
          ttHelper.layout(data)

        moveOutside = (options.height / data[0].values.length)*2

        line = d3.svg.line()
          .x((d) -> x.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))

        if _spline
          line.interpolate('cardinal')

        if y.isOrdinal
          line.y((d) -> if d.lowBorder then options.height + moveOutside else if d.highBorder then -moveOutside else y.scale()(d.targetKey))
        else
          line.y((d) -> y.scale()(d.targetKey))

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
          layers.select('.wk-chart-line').attr('transform', "translate(0,#{offset})")
          .transition().duration( options.duration)
          .call(drawLines)
        else
          layers.select('.wk-chart-line').attr('transform', "translate(0,#{offset})")
          .call(drawLines)

        layers.exit()
          .remove()

        markers
          .isVertical(true)
          .x((d) -> x.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
          .color((d) -> color.scale()(d.layerKey))

        if y.isOrdinal
          markers.y((d) -> if d.lowBorder then options.height + moveOutside else if d.highBorder then -moveOutside else y.scale()(d.targetKey) +  y.scale().rangeBand() / 2)
        else
          markers.y((d) -> y.scale()(d.targetKey))

        layers.call(markers, doAnimate)

      brush = (axis, idxRange) ->
        layers = this.selectAll(".wk-chart-line")
        if axis.isOrdinal()
          layers.attr('d', (d) -> line(d.values.slice(idxRange[0],idxRange[1] + 1)))
              .attr('transform', "translate(0,#{axis.scale().rangeBand() / 2})")
          markers.brush(this, idxRange)
          ttHelper.brushRange(idxRange)
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
        ttHelper
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)
        _tooltip.markerScale(_scaleList.y)
        _tooltip.on "enter.#{_id}", ttHelper.enter
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers

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

      ###*
        @ngdoc attr
        @name lineVertical#spline
        @values true, false
        @param [spline=false] {boolean} - interpolate the line using bSpline
      ###
      attrs.$observe 'spline', (val) ->
        if val is '' or val is 'true'
          _spline = true
        else
          _spline = false
        host.lifeCycle().update()
  }