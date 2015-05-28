angular.module('wk.chart').factory 'wkRangeArea', ($log, utils, dataManagerFactory, markerFactory, tooltipHelperFactory) ->
  lineCntr = 0
  wkRangeArea = () ->
    me = ()->
    _layout = undefined
    #$log.log 'linking s-line'

    _tooltip = undefined
    _scaleList = {}
    _showMarkers = false
    _spline = false
    offset = 0
    _id = 'rangearea' + lineCntr++
    area = undefined
    layoutData = undefined
    _initialOpacity = 0
    _areaStyle = {}

    xData = dataManagerFactory()
    markers = markerFactory()
    ttHelper = tooltipHelperFactory()

    #-----------------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color, size, shape, rangeX, rangeY) ->
      xData.keyScale(x).valueScale(y).data(data)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color, size, shape, rangeX, rangeY])

    setAnimationEnd = (data, options, x, y, color, size, shape, rangeX, rangeY) ->
      markers.active(_showMarkers)
      layoutData = xData.animationEndLayers()
      drawPath.apply(this, [true, layoutData, options, x, y, color, size, shape, rangeX, rangeY])

    drawPath = (doAnimate, data, options, x, y, color, size, shape, rangeX, rangeY) ->

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

      offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      area = d3.svg.area()
        .x((d) -> x.scale()(d.targetKey))
        .y((d) -> y.scale()(d.value))
        .y1((d) -> y.scale()(d.value1))

      if _spline
        area.interpolate('cardinal')

      i = 0
      rangeData = [{values:data[1].values, layerKey:data[1].layerKey}]
      while i < rangeData[0].values.length
        rangeData[0].values[i].value1 = data[0].values[i].value
        i++

      layers = this.selectAll(".wk-chart-layer")
        .data(data, (d) -> d.layerKey)
      layers.enter()
        .append('g').attr('class','wk-chart-layer')

      range = this.selectAll('.wk-chart-area-path')
        .data(rangeData, (d) -> d.layerKey)
      range.enter().append('path')
        .attr('class','wk-chart-area-path wk-chart-edit-selectable')
        .attr('d', (d) -> area(d.values))
        .style('opacity', _initialOpacity)
        .style('pointer-events', 'none')
        #.style('stroke', (d) -> color.scale()(d.layerKey))
        #.style('fill', (d) -> color.scale()(d.layerKey))
        .attr('transform', "translate(#{offset})")

      range
        .style('stroke', (d) -> color.scale()(d.layerKey))
        .style('pointer-events', 'none')
        .each(setStyle)

      (if doAnimate then range.transition().duration( options.duration) else range)
        .attr('d', (d) -> area(d.values))
        .style('opacity', (d) -> if d.added or d.deleted then 0 else 1)

      range.exit().remove()

      layers.exit()
        .remove()

      markers
        .x((d) -> x.scale()(d.targetKey) + if x.isOrdinal() then x.scale().rangeBand() / 2 else 0)
        .y((d) -> y.scale()(d.value))
        .color((d) -> color.scale()(d.layerKey))
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
        .keyScale(_scaleList.x)
        .valueScale(_scaleList.y)
        .colorScale(_scaleList.color)
        .value((d) -> d.value)
        _tooltip.markerScale(_scaleList.x)
        _tooltip.on "enter.#{_id}", ttHelper.moveData
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers

      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me

    me.spline = (val) ->
      if arguments.length is 0 then return _spline
      _spline = val
      return me
    
    me.markers = (val) ->
      if arguments.length is 0 then return _showMarkers
      _showMarkers = val
      return me 

    me.areaStyle = (val) ->
      if arguments.length is 0 then return _areaStyle
      _areaStyle = val
      return me


    return me

  return wkRangeArea