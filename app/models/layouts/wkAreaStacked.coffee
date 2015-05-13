angular.module('wk.chart').factory 'wkAreaStacked', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  stackedAreaCntr = 0

  wkAreaStacked = () ->
    me = ()->

    _layout = undefined
    stack = d3.layout.stack()
    offset = 'zero'
    layers = null
    _showMarkers = false
    _spline = false
    stackLayout = []
    area = undefined
    _areaStyle = undefined
    _tooltip = undefined
    _scaleList = {}
    scaleY = undefined
    offs = 0
    _id = 'areaStacked' + stackedAreaCntr++
    _showOpacity = 0.5

    xData = dataManagerFactory()
    markers = markerFactory()

    layoutData = undefined
    ttHelper = tooltipHelperFactory()

    #-----------------------------------------------------------------------------------------------------------------

    stack
      .values((d)->d.values)
      .y((d) -> if d.layerAdded or d.layerDeleted then 0 else d.value)
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

      if _spline
        area.interpolate('cardinal')

      layers = layers
        .data(stackLayout, (d) -> d.layerKey)
      enter = layers.enter().append('g').attr('class', "wk-chart-layer")
      enter
        .append('path').attr('class', 'wk-chart-area-path')
          .style('pointer-events', 'none')
          .style('opacity', 0)


      pathLayers = layers.select('.wk-chart-area-path')
        #.style('fill', (d, i) -> color.scale()(d.layerKey))
        #.style('stroke', (d, i) -> color.scale()(d.layerKey))
        #.style(_areaStyle)
        .attr('transform', "translate(#{offs})")
        .each(setStyle)

      updLayers = if doAnimate then pathLayers.transition().duration(options.duration) else pathLayers

      updLayers
        .attr('d', (d) -> area(d.values))
        .style('opacity', _showOpacity)

      layers.exit() #.transition().duration(options.duration)
        .remove()

      markers
        .x((d) -> x.scale()(d.targetKey) + if x.isOrdinal() then x.scale().rangeBand() / 2 else 0)
        .y((d) -> scaleY(d.y + d.y0))
        .color( (d)->
          style = color.scale()(d.layerKey)
          return if typeof style is 'string' then style else style.color
        )
        .keyScale(x.scale())

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
    me.layout = (layout) -> 
      if arguments.length is 0 then return _layout
      _layout = layout;
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('total').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = _layout.behavior().tooltip
        ttHelper
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
          .isStacked(true)
          .colorScale(_scaleList.color)
          .value((d) -> d.y + d.y0)
        _tooltip.markerScale(_scaleList.x)
        _tooltip.on "enter.#{_id}", ttHelper.enter
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers

      #host.lifeCycle().on "drawChart", draw
      _layout.lifeCycle().on "brushDraw.#{_id}", brush
      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me

    me.offset = (val) ->
      if arguments.length is 0 then return stack.offset() 
      stack.offset(val)
      return me

    me.markers = (val) ->
      if arguments.length is 0 then return _showMarkers
      _showMarkers = val
      return me

    me.spline = (val) ->
      if arguments.length is 0  then return _spline
      _spline = val
      return me

    me.areaStyle = (val) ->
      if arguments.length is 0 then return _areaStyle
      _areaStyle = val
      return me

    return me

  return wkAreaStacked