###*
  @ngdoc layout
  @name barStacked
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a stacked bar chart layout

  @usesDimension x [type=linear, domainRange=total] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]


###
angular.module('wk.chart').directive 'barStacked', ($log, utils, barConfig, dataManagerFactory, tooltipHelperFactory) ->

  stackedBarCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking Stacked bar'

      _id = "stackedBar#{stackedBarCntr++}"

      layers = null

      _tooltip = undefined
      _scaleList = {}
      _selected = undefined
      _barStyle = {}

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
        xData.keyScale(y).valueScale(x).data(data, true)
        if not xData.isInitial()
          layoutData = xData.animationStartLayers()
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
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

        if not layers
          layers = @selectAll(".wk-chart-layer")
        #$log.debug "drawing stacked-bar"

        barPadding = y.scale().rangeBand() / (1 - config.paddingLeft) * config.paddingLeft

        stackLayout = stack(data)
        layers = layers
          .data(stackLayout, (d) -> d.layerKey)

        barHeight = y.scale().rangeBand()

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
          .style('opacity', 0)
          .call(_tooltip.tooltip)
          .call(_selected)

        bars
          .each(setStyle)

        (if doAnimate then bars.transition().duration(options.duration) else bars)
          .attr('x', (d) -> x.scale()(d.y0))
          .attr('width', (d) -> x.scale()(d.y))
          .attr('height', (d) -> if d.added or d.deleted then 0 else barHeight)
          .attr('y', (d) -> y.scale()(d.targetKey) + offset(d))
          .style('opacity', 1)

        bars.exit().remove()

      brush = (axis, idxRange) ->
        bars = this.selectAll(".wk-chart-rect")
        if axis.isOrdinal()
          bars
            .attr('y', (d) -> if (val = axis.scale()(d.key)) >= 0 then val else -1000)
            .attr('height', (d) -> axis.scale().rangeBand())
          ttHelper.brushRange(idxRange)

      #-----------------------------------------------------------------------------------------------------------------


      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('total').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _selected = host.behavior().selected
        _tooltip.on "enter.#{_id}", ttHelper.enter
        ttHelper
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)

      #host.lifeCycle().on "drawChart", draw
      host.lifeCycle().on "brushDraw.#{_id}", brush
      host.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      host.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      host.lifeCycle().on "destroy.#{_id}", ->
        host.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null

      ###*
        @ngdoc attr
        @name barStacked#padding
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
        _scaleList.y.rangePadding(config)
        host.lifeCycle().update()

      ###*
        @ngdoc attr
        @name barStacked#barStyle
        @param [barsStyle] {object} - Set the line style for columns lines in the layout
      ###
      attrs.$observe 'barStyle', (val) ->
        if val
          _barStyle = scope.$eval(val)
  }
