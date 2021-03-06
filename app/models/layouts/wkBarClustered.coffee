angular.module('wk.chart').factory 'wkBarClustered', ($log, utils, barConfig, dataManagerFactory, dataLabelFactory, tooltipHelperFactory)->

  clusteredBarCntr = 0
  wkBarClustered = () ->
    me = () ->

    _layout = undefined

    _id = "clusteredBar#{clusteredBarCntr++}"

    layers = null
    _barStyle = {}
    clusterY = undefined

    barPaddingOld = 0
    barOuterPaddingOld = 0
    barHeight = 0
    config = _.clone(barConfig, true)

    xData = dataManagerFactory()
    ttHelper = tooltipHelperFactory()
    dataLabels = dataLabelFactory()

    initial = true

    stack = d3.layout.stack()
    stack
      .values((d)-> d.values)
      .y((d) -> if d.layerDeleted or d.layerAdded or d.deleted or d.added then 0 else barHeight)
      .x((d) -> d.layerKey)

    #-----------------------------------------------------------------------------------------------------------------

    _tooltip = undefined
    _selected = undefined
    _scaleList = {}

    #-----------------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color) ->
      xData.keyScale(y).valueScale(x).data(data, true)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color) ->
      layoutData = xData.animationEndLayers()
      dataLabels.duration(options.duration).active(_layout.showDataLabels())
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->
      #$log.info "rendering clustered-bar"

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

      # map data to the right format for rendering
      layerKeys = data.filter((d) -> not d.added and not d.deleted).map((d) -> d.layerKey)
      clusterHeight = y.scale().rangeBand()
      clusterY = d3.scale.ordinal().domain(layerKeys).rangeBands([0, clusterHeight], 0, 0)
      barHeight = clusterY.rangeBand()
      clusterPadding = clusterHeight / (1 - config.paddingLeft) * config.paddingLeft
      barOuterPadding = clusterHeight / (1 - config.outerPaddingLeft) * config.outerPaddingLeft

      offset = (d) ->
        if y.reverse()
          if d.deleted and d.highBorder then return clusterHeight + clusterPadding / 2
          if d.deleted then return -clusterPadding / 2
          if d.added and d.atBorder then return clusterHeight + clusterPadding / 2
          if d.added then return -clusterPadding / 2
        else
          if d.deleted and d.highBorder then return -clusterPadding / 2
          if d.deleted then return clusterHeight + clusterPadding / 2
          if d.added and d.atBorder then return -clusterPadding / 2
          if d.added then return clusterHeight + clusterPadding / 2
        return 0

      stackLayout = stack(data)
      $log.log stackLayout
      if not layers
        layers = @selectAll('.wk-chart-layer')

      layers = layers.data(stackLayout, (d) -> d.layerKey)

      layers.enter().append('g')
        .attr('class', 'wk-chart-layer')

      layers.exit()
        .remove()

      barsGroup = layers.selectAll('g.wk-chart-rect-container')
        .data(
          (d) -> d.values
        , (d) -> d.layerKey + '|' + d.key
        )

      barsGroupEnter = barsGroup.enter().append('g').attr('class', 'wk-chart-rect-container')
         .attr('transform', (d)-> "translate(0,#{y.scale()(d.targetKey) + d.y0 + offset(d)})")

      bars = barsGroupEnter.append('rect')
        .attr('class', 'wk-chart-rect wk-chart-selectable')
        #.style('fill', (d) -> color.scale()(d.layerKey))
        .style('opacity', 0)
        .call(_tooltip.tooltip)
        .call(_selected)

      bars.each(setStyle)

      (if doAnimate then bars.transition().duration(options.duration) else bars)
        .attr('height', (d) -> d.y)
        .attr('width', (d) -> Math.abs(x.scale()(d.targetValue) or 0))
        .attr('x', (d) -> Math.min(x.scale()(0), x.scale()(d.targetValue)))
        .style('opacity', 1)


      barsGroup.call(dataLabels, doAnimate, _layout.dataLabelStyle(), _layout.dataLabelBackgroundStyle())
      barsGroup.exit()
        .remove()

      initial = false
      barPaddingOld = clusterPadding
      barOuterPaddingOld = barOuterPadding

    #-------------------------------------------------------------------------------------------------------------------
    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('max').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = _layout.behavior().tooltip
        _tooltip.on "enter.#{_id}", ttHelper.enter
        _selected = _layout.behavior().selected
        ttHelper
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)
        dataLabels
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)

      #host.lifeCycle().on "drawChart", draw
      _layout.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      _layout.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me

    me.rangePadding = (val) ->
      if arguments.length is 0 then return _scaleList.y.rangePadding()
      config = utils.parsePadding(val, config, barConfig)
      _scaleList.y.rangePadding(config)
      return me

    me.barStyle = (val) ->
      if arguments.length is 0 then return _barStyle
      _barStyle = val
      return me


    return me
  return wkBarClustered
      