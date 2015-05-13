angular.module('wk.chart').factory 'wkRangeColumn', ($log, utils, barConfig, dataManagerFactory, markerFactory, tooltipHelperFactory)->
  sBarCntr = 0
  wkRangeColumn = ()->
    me = ()->
    _layout = undefined

    _id = "rangeColumn#{sBarCntr++}"

    _columnStyle = {}

    _tooltip = undefined
    _selected = undefined
    _scaleList = {}
    _showMarkers = false
    offset = 0
    layoutData = undefined
    config = _.clone(barConfig, true)

    xData = dataManagerFactory()
    markers = markerFactory()
    ttHelper = tooltipHelperFactory()

    #-----------------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color, size) ->
      xData.keyScale(x).valueScale(y).data(data, true)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color, size) ->
      markers.active(_showMarkers)
      layoutData = xData.animationEndLayers()
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      setStyle = (d) ->
        elem = d3.select(this)
        elem.style(_columnStyle)
        style = color.scale()(d.layerKey)
        if typeof style is 'string'
          elem.style({fill:style, stroke:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      barHeight = x.scale().rangeBand()
      barPadding = barHeight / (1 - config.paddingLeft) * config.paddingLeft
      offset = if y.isOrdinal() then barHeight / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      offset = (d) ->
        if d.deleted and d.atBorder then return barHeight
        if d.deleted then return -barPadding / 2
        if d.added and d.atBorder then return  barHeight + barPadding / 2
        if d.added then return -barPadding / 2
        return 0

      i = 0
      rangeData = [{values:data[1].values, layerKey:data[1].layerKey}]
      while i < rangeData[0].values.length
        rangeData[0].values[i].value1 = data[0].values[i].targetValue
        i++

      layers = this.selectAll(".wk-chart-layer")
        .data(data, (d) -> d.layerKey)
      layers.enter()
        .append('g').attr('class','wk-chart-layer')

      range = this.selectAll('.wk-chart-rect')
        .data(rangeData[0].values, (d) -> d.key)
      range.enter().append('rect')
        .attr('class','wk-chart-rect')
        .style('opacity', 0)
        #.style('fill', color.scale()(range[0].layerKey))
        .call(_tooltip.tooltip)
        .call(_selected)
        .attr('transform',(d) -> "translate(#{x.scale()(d.targetKey)})")

      range
        .each(setStyle)

      (if doAnimate then range.transition().duration( options.duration) else range)
        .attr('transform',(d) -> "translate(#{x.scale()(d.targetKey) + offset(d)})")
        .attr('width', (d) -> if d.added or d.deleted then 0 else barHeight)
        .attr('height', (d) -> Math.abs(y.scale()(d.targetValue) - y.scale()(d.value1)))
        .attr('y', (d) -> y.scale()(d.targetValue))
        .style('stroke', (d) -> color.scale()(d.layerKey))
        .style('opacity', 1)

      range.exit().remove()

      layers.exit()
      .remove()

    brush = (axis, idxRange) ->
      this.selectAll('.wk-chart-rect')
          .attr('transform',(d) -> "translate(0, #{if (x = axis.scale()(d.targetKey)) >= 0 then x else -1000})")
        .selectAll('.wk-chart-rect')
          .attr('height', (d) -> axis.scale().rangeBand())

    #--- Configuration and registration ------------------------------------------------------------------------------
    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        _tooltip = _layout.behavior().tooltip
        ttHelper
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)
        _selected = _layout.behavior().selected
        _tooltip.on "enter.#{_id}", ttHelper.enter

      #host.lifeCycle().on "drawChart", draw
      _layout.lifeCycle().on "brushDraw.#{_id}", brush
      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me

      me.rangePadding = (val) ->
        if arguments.length is 0 then return _scaleList.x.rangePadding()
        _scaleList.x.rangePadding(val)
        return me

      me.columnStyle = (val) ->
        if arguments.length is 0 then return _columnStyle
        _columnStyle = val
        return me


    return me
  return wkRangeColumn