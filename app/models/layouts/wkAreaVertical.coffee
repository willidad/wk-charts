angular.module('wk.chart').factory 'wkAreaVertical', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  lineCntr = 0
  wkAreaVertical = () ->
    me = () ->

    _layout = undefined
    #$log.log 'linking s-line'
    _tooltip = undefined
    _ttHighlight = undefined
    _circles = undefined
    _scaleList = {}
    _spline = false
    _showMarkers = false
    _areaStyle = {}
    offset = 0
    area = undefined
    _id = 'areaVertical' + lineCntr++
    _showOpacity = 0.5

    layoutData = undefined
    _initialOpacity = 0

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

      setStyle = (d) ->
        elem = d3.select(this)
        elem.style(_areaStyle)
        style = color.scale()(d.layerKey)
        if typeof style is 'string'
          elem.style({fill:style, stroke:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      offset = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      area = d3.svg.area() # tricky. Draw this like a horizontal chart and then rotate and position it.
        .x((d) -> -y.scale()(d.targetKey))
        .y((d) -> x.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
        .y1((d) ->  x.scale()(0))

      if _spline
        area.interpolate('cardinal')

      layers = this.selectAll(".wk-chart-layer")
        .data(data, (d) -> d.layerKey)
      enter = layers.enter().append('g').attr('class', "wk-chart-layer")
      enter.append('path')
        .attr('class','wk-chart-area-path')
        .attr('d', (d) -> area(d.values))
        .style('opacity', _initialOpacity)
        .style('pointer-events', 'none')

      path = layers.select('.wk-chart-area-path')
        .attr('transform', "translate(0,#{offset})rotate(-90)") #rotate and position chart
        #.style(_areaStyle)
        #.style('stroke', (d) -> color.scale()(d.layerKey))
        #.style('fill', (d) -> color.scale()(d.layerKey))
        .style('pointer-events', 'none')
      path.each(setStyle)
      path = if doAnimate then path.transition().duration( options.duration) else path
      path
        .attr('d', (d) -> area(d.values))
        .style('opacity', (d) -> if d.added or d.deleted then 0 else _showOpacity)

      layers.exit()
        .remove()

      markers
        .isVertical(true)
        .x((d) -> x.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
        .y((d) -> y.scale()(d.targetKey) + if y.isOrdinal() then y.scale().rangeBand() / 2 else 0)
        .color( (d)->
          style = color.scale()(d.layerKey)
          return if typeof style is 'string' then style else style.color
        )
        .keyScale(y.scale())
      layers.call(markers, doAnimate)

    brush = (axis, idxRange, width, height) ->
      areaPath = this.selectAll(".wk-chart-area-path")
      if axis.isOrdinal()
        areaPath.attr('d', (d) ->
          null
          area(d.values.slice(idxRange[0],idxRange[1] + 1)))
        .attr('transform', "translate(0,#{axis.scale().rangeBand() / 2})rotate(-90)")
        markers.brush(this, idxRange)
        ttHelper.brushRange(idxRange)
      else
        areaPath.attr('d', (d) -> area(d.values))
        markers.brush(this)

    #--- Configuration and registration ------------------------------------------------------------------------------

    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = _layout.behavior().tooltip
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
      _layout.lifeCycle().on "brushDraw.#{_id}", brush
      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me


    me.markers = (val) ->
      if arguments.length is 0 then return _showMarkers
      _showMarkers = val
      return me

    me.spline = (val) ->
      if arguments.length is 0 then return _spline
      _spline = val
      return me

    me.areaStyle = (val) ->
      if arguments.length is 0 then return _areaStyle
      _areaStyle = val
      return me


    return me
  return wkAreaVertical
