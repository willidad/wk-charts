angular.module('wk.chart').factory 'wkColumnStacked', ($log, utils, barConfig, dataManagerFactory, markerFactory, tooltipHelperFactory) ->
  stackedColumnCntr = 0
  wkColumnStacked = () ->
    me = () ->

    _layout = undefined 
    #$log.log 'linking Stacked bar'

    _id = "stackedColumn#{stackedColumnCntr++}"

    layers = null
    _columnStyle = {}

    _tooltip = undefined
    _scaleList = {}
    _selected = undefined

    config = _.clone(barConfig, true)

    xData = dataManagerFactory()
    ttHelper = tooltipHelperFactory()
    stack = d3.layout.stack()
    stack
      .values((d)->d.values)
      .y((d) -> if d.layerAdded or d.layerDeleted then 0 else d.targetValue)
      .x((d) -> d.targetKey)

    #-----------------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color) ->
      xData.keyScale(x).valueScale(y).data(data, true)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color) ->
      layoutData = xData.animationEndLayers()
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      setStyle = (d) ->
        elem = d3.select(this)
        elem.style(_columnStyle)
        style = color.scale()(d.layerKey)
        if typeof style is 'string'
          elem.style({fill:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      barWidth = x.scale().rangeBand()
      barPadding = barWidth / (1 - config.paddingLeft) * config.paddingLeft

      offset = (d) ->
        if x.reverse()
          if d.deleted and d.highBorder then return  -barPadding / 2
          if d.deleted then return barWidth + barPadding / 2
          if d.added and d.atBorder then return -barPadding / 2
          if d.added then return barWidth + barPadding / 2
        else
          if d.deleted and d.highBorder then return barWidth
          if d.deleted then return -barPadding / 2
          if d.added and d.atBorder then return  barWidth + barPadding / 2
          if d.added then return -barPadding / 2
        return 0

      if not layers
        layers = @selectAll(".wk-chart-layer")

      stackLayout = stack(data)
      layers = layers.data(stackLayout, (d) -> d.layerKey)
      layers.enter().append('g').attr('class', "wk-chart-layer")
      layers.exit().remove()

      bars = layers.selectAll('.wk-chart-rect')
      bars = bars.data(
        (d) -> d.values,
        (d) -> d.key.toString() + '|' + d.layerKey.toString()
      )
      bars.enter().append('rect').attr('class','wk-chart-rect wk-chart-selectable')
        .style('opacity', 0)
        #.attr('fill', (d) -> color.scale()(d.layerKey))
        .call(_tooltip.tooltip)
        .call(_selected)

      bars
        .each(setStyle)

      (if doAnimate then bars.transition().duration(options.duration) else bars)
        .attr('y', (d) -> y.scale()(d.y0  + d.y))
        .attr('height', (d) ->  y.scale()(0) - y.scale()(d.y))
        .attr('width', (d) -> if d.added or d.deleted then 0 else barWidth)
        .attr('x', (d) -> x.scale()(d.targetKey) + offset(d))
        .style('opacity', 1)

      bars.exit().remove()

    brush = (axis, idxRange) ->
      bars = this.selectAll(".wk-chart-rect")
      if axis.isOrdinal()
        bars
        .attr('x', (d) -> if (val = axis.scale()(d.key)) >= 0 then val else -1000)
        .attr('width', (d) -> axis.scale().rangeBand())
        ttHelper.brushRange(idxRange)

    #-----------------------------------------------------------------------------------------------------------------


    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('y').domainCalc('total').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = _layout.behavior().tooltip
        _selected = _layout.behavior().selected
        _tooltip.on "enter.#{_id}", ttHelper.enter
        ttHelper
        .keyScale(_scaleList.x)
        .valueScale(_scaleList.y)
        .colorScale(_scaleList.color)
        .value((d) -> d.value)

      #host.lifeCycle().on 'drawChart', draw
      _layout.lifeCycle().on "brushDraw.#{_id}", brush
      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me

    me.rangePadding = (val) ->
      if arguments.length is 0 then return _scaleList.y.rangePadding()
      config = utils.parsePadding(val, config, barConfig)
      _scaleList.x.rangePadding(config)
      return me

    me.columnStyle = (val) ->
      if arguments.length is 0 then return _columnStyle
      _columnStyle = val
      return me

    me.offset = (val) ->
      if arguments.length is 0 then return stack.offset()
      stack.offset(val)
      return me

    return me
  return wkColumnStacked
