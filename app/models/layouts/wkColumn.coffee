angular.module('wk.chart').factory 'wkColumn', ($log, utils, barConfig, dataManagerFactory, dataLabelFactory, tooltipHelperFactory)->
  sBarCntr = 0
  wkColumn = () ->
    me = () ->
    _layout = undefined
    _id = "column#{sBarCntr++}"

    columns = null
    _scaleList = {}
    _selected = undefined

    config = _.clone(barConfig, true)

    xData = dataManagerFactory()
    ttHelper = tooltipHelperFactory()
    dataLabels = dataLabelFactory()
    _tooltip = undefined
    _columnStyle = {}

    #--- Draw --------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color) ->
      xData.keyScale(x).valueScale(y).data(data, true)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color) ->
      layoutData = xData.animationEndLayers()
      dataLabels.duration(options.duration).active(_layout.showDataLabels()) # needs to be here to ensure right opacity animation !
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      setStyle = (d) ->
        elem = d3.select(this)
        elem.style(_columnStyle)
        style = if color.property().length is 0 then color.scale()(d.layerKey) else color.map(d.data)
        if typeof style is 'string'
          elem.style({fill:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      _colorByKey = not color.property() and color.isOrdinal()
      ttHelper.colorByKey(_colorByKey)

      if not columns
        columns = @selectAll('.wk-chart-layer')
      #$log.log "rendering stacked-bar"

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

      columns = columns.data(data[0].values, (d) -> d.key)

      enter = columns.enter().append('g').attr('class','wk-chart-layer')
        .attr('transform', (d)-> "translate(#{x.scale()(d.targetKey)})")

      enter.append('rect')
        .attr('class', 'wk-chart-rect wk-chart-selectable')
        .attr('width', (d) -> if d.added or d.deleted then 0 else barWidth)
        .style('opacity', 0)
        .call(_tooltip.tooltip)
        .call(_selected)

      (if doAnimate then columns.transition().duration(options.duration) else columns)
        .attr('transform', (d) -> "translate(#{x.scale()(d.targetKey) + offset(d)})")

      rect = columns.select('rect')
        #.style('fill', (d) -> if color.property().length is 0 then color.scale()(d.layerKey) else color.map(d.data))
        #.style('stroke', (d) -> if color.property().length is 0 then color.scale()(d.layerKey)  else color.map(d.data))
        .each(setStyle)
      (if doAnimate then rect.transition().duration(options.duration) else rect)
        .attr('width', (d) -> if d.added or d.deleted then 0 else barWidth)
        .attr('height', (d) -> Math.abs(y.scale()(0) - y.scale()(d.targetValue)))
        .attr('y', (d) -> Math.min(y.scale()(0), y.scale()(d.targetValue)))
        .style('opacity', 1)

      columns.call(dataLabels, doAnimate, _layout.dataLabelStyle(), _layout.dataLabelBackgroundStyle())

      columns.exit()
      .remove()

    #--- Configuration and registration ------------------------------------------------------------------------------

    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('y').domainCalc('max').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        _tooltip = _layout.behavior().tooltip
        _selected = _layout.behavior().selected
        ttHelper
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)
        dataLabels
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
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
      _scaleList.x.rangePadding(config)
      return me


    me.columnStyle = (val) ->
      if arguments.length is 0 then return _columnStyle
      _columnStyle = val
      return me

    me.columnConfig = (val) ->
      if arguments.length is 0 then return config
      _.assign(config, val)
      return me

    return me
  return wkColumn

  
