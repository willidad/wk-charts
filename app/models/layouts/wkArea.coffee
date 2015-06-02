angular.module('wk.chart').factory 'wkArea', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  areaCntr = 0
  wkArea = () ->
    me = () ->

    _layout = undefined
    _tooltip = undefined
    _scaleList = {}
    _showMarkers = false
    _areaStyle = false
    _lineStyle = false
    _spline = false
    offset = 0
    _id = 'area' + areaCntr++
    area = undefined
    layoutData = undefined
    _initialOpacity = 0
    _showOpacity = 0.5

    xData = dataManagerFactory()
    markers = markerFactory()
    ttHelper = tooltipHelperFactory()

    #-----------------------------------------------------------------------------------------------------------------

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

      offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      area = d3.svg.area()
        .x((d) -> x.scale()(d.targetKey))
        .y((d) -> y.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
        .y1((d) ->  y.scale()(0))

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
        #.style('stroke', (d) -> color.scale()(d.layerKey))
        #.style('fill', (d) -> color.scale()(d.layerKey))

      path = layers.select('.wk-chart-area-path')
        .attr('transform', "translate(#{offset})")
      path = if doAnimate then path.transition().duration( options.duration) else path
      path.each(setStyle)

      targetOpacity = _showOpacity
      if me.areaStyle() and me.areaStyle().opacity
        targetOpacity = me.areaStyle().opacity

      path.attr('d', (d) -> area(d.values))
        .style('opacity', (d) -> if d.added or d.deleted then 0 else targetOpacity)
        #.style('pointer-events', 'none')
      layers.exit()
        .remove()

      markers
        .x((d) -> x.scale()(d.targetKey) + if x.isOrdinal() then x.scale().rangeBand() / 2 else 0)
        .y((d) -> y.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
        .color( (d)->
          style = color.scale()(d.layerKey)
          return if typeof style is 'string' then style else style.color
        )
        .keyScale(x.scale())
      layers.call(markers, doAnimate)

    #--- Configuration and registration ------------------------------------------------------------------------------
    me.layout = (layout) -> 
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on "configure", ->
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
        _tooltip.on "enter.#{_id}", ttHelper.enter
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers
        markers.duration(_layout.chart().animationDuration())
        markers.dataLabels()
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
          .active(layout.showDataLabels())

      #host.lifeCycle().on 'drawChart', draw
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

    me.lineStyle = (val) ->
      if arguments.length is 0 then return _lineStyle
      _lineStyle = val
      return me


    return me
  return wkArea