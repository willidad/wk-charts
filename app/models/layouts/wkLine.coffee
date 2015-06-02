angular.module('wk.chart').factory 'wkLine', ($log, utils, barConfig, dataLabelFactory, markerFactory, dataManagerFactory, tooltipHelperFactory, timing) ->
  lineCntr = 0
  wkLine = () ->
    me = () ->

    _layout = undefined
    _tooltip = undefined
    _showMarkers = false
    _spline = false
    _lineStyle = {'stroke-width':1}
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
      timing.init()
      timing.start('chart')
      xData.keyScale(x).valueScale(y).data(data)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color) ->
      markers.active(_showMarkers)
      layoutData = xData.animationEndLayers()
      drawPath.apply(this, [true, layoutData, options, x, y, color])
      timing.stop('chart')
      timing.report()

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

      offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      moveOutside = (options.width / data[0].values.length)*2

      line = d3.svg.line()
        .y((d) -> y.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))

      if _spline
        line.interpolate('cardinal')

      if x.isOrdinal()
        line.x((d) -> (if d.highBorder then options.width + moveOutside else if d.lowBorder then -moveOutside else x.scale()(d.targetKey)) + offset)
      else
        line.x((d) -> x.scale()(d.targetKey))

      layers = this.selectAll(".wk-chart-layer")
        .data(data, (d) -> d.layerKey)
      enter = layers.enter().append('g').attr('class', "wk-chart-layer")
      enter.append('path')
        .attr('class','wk-chart-line')
        .attr('d', (d) -> line(d.values))
        .style('opacity', 0)
        .style('pointer-events', 'none')
        #.style('stroke', (d) -> color.scale()(d.layerKey))

      path = layers.select('.wk-chart-line')
      path.each(setStyle)
      (if doAnimate then path.transition().duration( options.duration) else path)
        .attr('d', (d) -> line(d.values))
        .style('opacity', (d) -> if d.added or d.deleted then 0 else 1)
        .style('pointer-events', 'none')

      layers.exit()
        .remove()

      markers
        #.x((d) -> x.scale()(d.targetKey) + if x.isOrdinal() then x.scale().rangeBand() / 2 else 0)
        .y((d) -> y.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
        .color( (d)->
          style = color.scale()(d.layerKey)
          return if typeof style is 'string' then style else style.color
        )
        .keyScale(x.scale())

      if x.isOrdinal()
        markers.x((d) -> if d.highBorder then options.width + moveOutside else if d.lowBorder then -moveOutside else x.scale()(d.targetKey) + x.scale().rangeBand() / 2)
      else
        markers.x((d) -> x.scale()(d.targetKey))

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
        _tooltip.on "enter.#{_id}", ttHelper.enter
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers
        markers.duration(_layout.chart().animationDuration())
        markers.dataLabels()
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
          .active(layout.showDataLabels())

      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null



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
  return wkLine