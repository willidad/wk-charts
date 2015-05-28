angular.module('wk.chart').factory 'wkLineVertical', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  lineCntr = 0
  wkLineVertical = () ->
    me = () ->
    _layout = undefined
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
    _lineStyle = {}

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
        elem.style(_lineStyle)
        style = color.scale()(d.layerKey)
        if typeof style is 'string'
          elem.style({stroke:style})
        else
          cVal = style.color
          style.stroke = cVal
          elem.style(style)

      offset = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      moveOutside = (options.height / data[0].values.length)*2

      line = d3.svg.line()
        .x((d) -> x.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))

      if _spline
        line.interpolate('cardinal')

      if y.isOrdinal()
        line.y((d) -> if d.lowBorder then options.height + moveOutside else if d.highBorder then -moveOutside else y.scale()(d.targetKey))
      else
        line.y((d) -> y.scale()(d.targetKey))

      layers = this.selectAll(".wk-chart-layer")
      .data(data, (d) -> d.layerKey)
      enter = layers.enter().append('g').attr('class', "wk-chart-layer")
      enter.append('path')
        .attr('class','wk-chart-line')
        .attr('d', (d) -> line(d.values))
        .style('opacity', 0)
        .style('pointer-events', 'none')
        .style('stroke', (d) -> color.scale()(d.layerKey))

      path = layers.select('.wk-chart-line')
        .attr('transform', "translate(0,#{offset})")
      path.each(setStyle)
      (if doAnimate then path.transition().duration( options.duration) else path)
        .attr('d', (d) -> line(d.values))
        .style('opacity', (d) -> if d.added or d.deleted then 0 else 1)
        .style('pointer-events', 'none')

      layers.exit()
        .remove()

      markers
        .isVertical(true)
        .x((d) -> x.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
        .color( (d)->
          style = color.scale()(d.layerKey)
          return if typeof style is 'string' then style else style.color
        )
        .keyScale(y.scale())

      if y.isOrdinal()
        markers.y((d) -> if d.lowBorder then options.height + moveOutside else if d.highBorder then -moveOutside else y.scale()(d.targetKey) +  y.scale().rangeBand() / 2)
      else
        markers.y((d) -> y.scale()(d.targetKey))

      layers.call(markers, doAnimate)

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

    me.lineStyle = (val) ->
      if arguments.length is 0 then return _lineStyle
      _lineStyle = val
      return me
    
    return me
  return wkLineVertical