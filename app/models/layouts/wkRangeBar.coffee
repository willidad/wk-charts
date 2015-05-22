angular.module('wk.chart').factory 'wkRangeBar', ($log, utils, barConfig, dataManagerFactory, markerFactory, tooltipHelperFactory)->
  sBarCntr = 0
  wkRangeBar = ()->
    me = ()->
    _layout = undefined

    _id = "rangebars#{sBarCntr++}"

    _barStyle = {}

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
      xData.keyScale(y).valueScale(x).data(data, true)
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
        elem.style(_barStyle)
        style = color.scale()(d.layerKey)
        if typeof style is 'string'
          elem.style({fill:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      barHeight = y.scale().rangeBand()
      barPadding = barHeight / (1 - config.paddingLeft) * config.paddingLeft
      offset = if y.isOrdinal() then barHeight / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      offset = (d) ->
        if d.deleted and d.atBorder then return -barPadding / 2
        if d.deleted then return barHeight + barPadding / 2
        if d.added and d.atBorder then return -barPadding / 2
        if d.added then return barHeight + barPadding / 2
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
        .attr('class','wk-chart-rect wk-chart-selectable')
        .style('opacity', 0)
        #.style('fill', color.scale()(range[0].layerKey))
        .call(_tooltip.tooltip)
        .call(_selected)
        .attr('transform',(d) -> "translate(0, #{y.scale()(d.targetKey)})")

      range
        .each(setStyle)

      (if doAnimate then range.transition().duration( options.duration) else range)
        .attr('transform',(d) -> "translate(0, #{y.scale()(d.targetKey) + offset(d)})")
        .attr('height', (d) -> if d.added or d.deleted then 0 else barHeight)
        .attr('width', (d) -> Math.abs(x.scale()(d.targetValue) - x.scale()(d.value1)))
        .attr('x', (d) -> x.scale()(d.value1))
        .style('stroke', (d) -> color.scale()(d.layerKey))
        .style('opacity', 1)

      range.exit().remove()

      layers.exit()
      .remove()

    #--- Configuration and registration ------------------------------------------------------------------------------
    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout

      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('extent').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        _tooltip = _layout.behavior().tooltip
        ttHelper
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)
        _selected = _layout.behavior().selected
        _tooltip.on "enter.#{_id}", ttHelper.enter

      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me


    me.rangePadding = (val) ->
      if arguments.length is 0 then return _scaleList.y.rangePadding()
      config = utils.parsePadding(val, config, barConfig)
      _scaleList.y.rangePadding(val)
      return me


    me.barStyle = (val) ->
      if arguments.length is 0 then return _barStyle
      _barStyle = val
      return me


    return me
  return wkRangeBar
  