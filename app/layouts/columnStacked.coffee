###*
  @ngdoc layout
  @name columnStacked
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a stacked column chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=total]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'columnStacked', ($log, utils, barConfig, dataManagerFactory, markerFactory, tooltipHelperFactory) ->

  stackedColumnCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking Stacked bar'

      _id = "stackedColumn#{stackedColumnCntr++}"

      layers = null

      _tooltip = undefined
      _scaleList = {}
      _selected = undefined

      config = _.clone(barConfig, true)

      xData = dataManagerFactory()
      ttHelper = tooltipHelperFactory()
      stack = d3.layout.stack()
      stack
        .values((d)->d.values)
        .y((d) -> d.targetValue or 0)
        .x((d) -> d.targetKey)

      #-----------------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        xData.keyScale(x).valueScale(y).data(data)
        if not xData.isInitial()
          layoutData = xData.animationStartLayers()
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        layoutData = xData.animationEndLayers()
        drawPath.apply(this, [true, layoutData, options, x, y, color])

      drawPath = (doAnimate, data, options, x, y, color) ->

        barWidth = x.scale().rangeBand()
        barPadding = barWidth / (1 - config.padding) * config.padding

        offset = (d) ->
          if d.deleted and d.atBorder then return barWidth
          if d.deleted then return -barPadding / 2
          if d.added and d.atBorder then return  barPadding / 2
          if d.added then return barWidth + barPadding / 2
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
          .attr('fill', (d) -> color.scale()(d.layerKey))
          .call(_tooltip.tooltip)
          .call(_selected)

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
        else
          layers.attr('d', (d) -> area(d.values))

      #-----------------------------------------------------------------------------------------------------------------


      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('y').domainCalc('total').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _selected = host.behavior().selected
        _tooltip.on "enter.#{_id}", ttHelper.enter
        ttHelper
        .keyScale(_scaleList.x)
        .valueScale(_scaleList.y)
        .colorScale(_scaleList.color)
        .value((d) -> d.value)

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', brush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

      ###*
        @ngdoc attr
        @name columnStacked#padding
        @values true, false, [padding, outerPadding]
        @param [padding=true] {boolean | list}
      * Defines the inner and outer padding between the bars.
      *
      * `padding` and `outerPadding` are measured in % of the total bar space occupied, i.e. a padding of 20 implies a bar height of 80%, padding 50 implies bar and space have the same size.
      *
      * `padding` is 10, `outerPadding` is 0 unless explicitly specified differently.
      *
      * Setting `padding="false"` is equivalent to [0,0]
      ###
      attrs.$observe 'padding', (val) ->
        if val is 'false'
          config.padding = 0
          config.outerPadding = 0
        else if val is 'true'
          config = _.clone(barConfig, true)
        else
          values = utils.parseList(val)
          if values
            if values.length is 1
              config.padding = values[0]/100
              config.outerPadding = values[0]/100
            if values.length is 2
              config.padding = values[0]/100
              config.outerPadding = values[1]/100
        _scaleList.x.rangePadding(config)
        host.lifeCycle().update()
  }
