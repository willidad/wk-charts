angular.module('wk.chart').factory 'wkBar', ($log, utils, barConfig, dataLabelFactory, dataManagerFactory, tooltipHelperFactory) ->
  sBarCntr = 0
  
  wkBar = () -> 
    me = () ->

    _id = "bars#{sBarCntr++}"
    _layout = undefined
    bars = null
    barPaddingOld = 0
    barOuterPaddingOld = 0
    _scaleList = {}
    _selected = undefined
    _barStyle = {}
    config = _.clone(barConfig, true)

    xData = dataManagerFactory()
    ttHelper = tooltipHelperFactory()
    dataLabels = dataLabelFactory()
    _tooltip = undefined

    #--- Draw --------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color) ->
      xData.keyScale(y).valueScale(x).data(data, true)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        #$log.debug layoutData
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color) ->
      layoutData = xData.animationEndLayers()
      dataLabels.duration(options.duration).active(_layout.showDataLabels()) # needs to be here to ensure right opacity animation !
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      setStyle = (d) ->
        elem = d3.select(this)
        elem.style(_barStyle)
        style = if color.property().length is 0 then color.scale()(d.layerKey) else color.map(d.data)
        if typeof style is 'string'
          elem.style({fill:style, stroke:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      _colorByKey = not color.property() and color.isOrdinal()
      ttHelper.colorByKey(_colorByKey)

      if not bars
        bars = @selectAll('.wk-chart-layer')
      #$log.log "rendering stacked-bar"

      barHeight = y.scale().rangeBand()
      barPadding = barHeight / (1 - config.paddingLeft) * config.paddingLeft
      barOuterPadding = barHeight / (1 - config.outerPaddingLeft) * config.outerPaddingLeft
      #$log.log 'barPadding', barPadding, data

      offset = (d) ->
        if y.reverse()
          if d.deleted and d.highBorder then return barHeight + barPadding / 2
          if d.deleted then return -barPadding / 2
          if d.added and d.atBorder then return barHeight + barPadding / 2
          if d.added then return -barPadding / 2
        else
          if d.deleted and d.highBorder then return -barPadding / 2
          if d.deleted then return barHeight + barPadding / 2
          if d.added and d.atBorder then return -barPadding / 2
          if d.added then return barHeight + barPadding / 2
        return 0

      bars = bars.data(data[0].values, (d, i) -> d.key)

      enter = bars.enter().append('g').attr('class','wk-chart-layer')
        .attr('transform', (d)-> "translate(#{x.scale()(0)}, #{y.scale()(d.targetKey) + offset(d)})")

      enter.append('rect')
        .attr('class', 'wk-chart-rect wk-chart-selectable')
        .attr('height', (d) -> if d.added or d.deleted then 0 else barHeight)
        .style('opacity', 0)
        .call(_tooltip.tooltip)
        .call(_selected)

      (if doAnimate then bars.transition().duration(options.duration) else bars)
          .attr('transform', (d) -> "translate(#{x.scale()(0)}, #{y.scale()(d.targetKey) + offset(d)}) scale(1,1)")

      rect = bars.select('rect.wk-chart-rect')
        #.style('fill', (d) -> if color.property().length is 0 then color.scale()(d.layerKey) else color.map(d.data))
        #.style('stroke', (d) -> if color.property().length is 0 then color.scale()(d.layerKey) else color.map(d.data))
        #.style(_barStyle)
        .each(setStyle)
      (if doAnimate then rect.transition().duration(options.duration) else rect)
        .attr('height', (d) -> if d.added or d.deleted then 0 else barHeight)
        .attr('width', (d) -> Math.abs(x.scale()(0) - x.scale()(d.targetValue)))
        .style('opacity', 1)

      bars.exit()
        .remove()

      bars.call(dataLabels, doAnimate, _layout.dataLabelStyle(), _layout.dataLabelBackgroundStyle())

    brush = (axis, idxRange) ->
      bars
        .attr('transform',(d) -> "translate(0, #{if (y = axis.scale()(d.key)) >= 0 then y else -1000})")
          .selectAll('.wk-chart-rect')
          .attr('height', (d) -> axis.scale().rangeBand())
      dataLabels.brush(bars)

    #--- Configuration and registration ------------------------------------------------------------------------------

    me.layout = (layout) -> 
      if arguments.length is 0 then return _layout
      _layout = layout;

      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('max').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        _tooltip = _layout.behavior().tooltip
        _selected = _layout.behavior().selected
        ttHelper
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)
        _tooltip.on "enter.#{_id}", ttHelper.enter
        dataLabels
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)

      _layout.lifeCycle().on "brushDraw.#{_id}", brush
      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me


    me.rangePadding = (config) ->
      if arguments.length is 0 then return _scaleList.y.rangePadding()
      _scaleList.y.rangePadding(config)
      return me

    me.barStyle = (val) ->
      if arguments.length is 0 then return _barStyle
      _barStyle = val
      return me



    return me

  return wkBar
