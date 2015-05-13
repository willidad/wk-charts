###*
  @ngdoc layout
  @name rangeBars
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a range bar chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'rangeBars', ($log, utils, barConfig, dataManagerFactory, markerFactory, tooltipHelperFactory)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

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
          elem.style({fill:style, stroke:style})
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
        .attr('class','wk-chart-rect')
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

    brush = (axis, idxRange) ->
      this.selectAll('.wk-chart-rect')
        .attr('transform',(d) -> "translate(0, #{if (y = axis.scale()(d.targetKey)) >= 0 then y else -1000})")
        .selectAll('.wk-chart-rect')
          .attr('height', (d) -> axis.scale().rangeBand())

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @getKind('x').domainCalc('extent').resetOnNewData(true)
      @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
      _tooltip = host.behavior().tooltip
      ttHelper
        .keyScale(_scaleList.y)
        .valueScale(_scaleList.x)
        .colorScale(_scaleList.color)
        .value((d) -> d.value)
      _selected = host.behavior().selected
      _tooltip.on "enter.#{_id}", ttHelper.enter

    #host.lifeCycle().on "drawChart", draw
    host.lifeCycle().on "brushDraw.#{_id}", brush
    host.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
    host.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

    host.lifeCycle().on "destroy.#{_id}", ->
      host.lifeCycle().on ".#{_id}", null
      _tooltip.on ".#{_id}", null


    ###*
      @ngdoc attr
      @name rangeBars#padding
      @values true, false, [padding-left, padding-right, outerPadding-left, outerPadding-right]
      @param [padding=true] {boolean | list}
      * Defines the inner and outer padding between the bars.
      *
      * paddings are measured in % of the total bar space occupied, i.e. a padding of 20 implies a bar width of 80%, padding 50 implies column and space have the same size.
      *
      * similar to CSS padding definitions the padding attribute allows for a couple of shortcuts:
      *
      * - n,m implies both, paddings are n, both outerPaddings are m
      * - n implies all paddings are set to n,
      * - n,m, o implies left padding is n, right padding is m, outerPaddings are o
      *
      * Default `padding` is 10, `outerPadding` is 0.
      *
      * Setting `padding="false"` is equivalent to [0,0]
    ###
    attrs.$observe 'padding', (val) ->
      config = utils.parsePadding(val, config, barConfig)
      model.rangePadding(config)
      host.lifeCycle().update()

    ###*
        @ngdoc attr
        @name rangeBars#labels
        @values true, false
        @param [labels=true] {boolean} controls the display of data labels for each of the bars.
    ###
    attrs.$observe 'labels', (val) ->
      if val is 'false'
        host.showDataLabels(false)
      else if val is 'true' or val is ""
        host.showDataLabels('x')
      host.lifeCycle().update()

    ###*
      @ngdoc attr
      @name rangeBars#barStyle
      @param [barStyle] {object} - Set the line style for columns lines in the layout
    ###
    attrs.$observe 'barStyle', (val) ->
      if val
        model.barStyle(scope.$eval(val))
  }