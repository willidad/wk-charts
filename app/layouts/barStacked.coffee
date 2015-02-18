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
        xData.keyScale(y).valueScale(x).data(data, true)
        if not xData.isInitial()
          layoutData = xData.animationStartLayers()
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        layoutData = xData.animationEndLayers()
        drawPath.apply(this, [true, layoutData, options, x, y, color])

      drawPath = (doAnimate, data, options, x, y, color) ->

        if not layers
          layers = @selectAll(".wk-chart-layer")
        #$log.debug "drawing stacked-bar"

        barPadding = y.scale().rangeBand() / (1 - config.padding) * config.padding

        stackLayout = stack(data)
        layers = layers
          .data(stackLayout, (d) -> d.layerKey)

        barHeight = y.scale().rangeBand()

        offset = (d) ->
          if d.deleted and d.atBorder then return -barPadding / 2
          if d.deleted then return barHeight + barPadding / 2
          if d.added and d.atBorder then return -barPadding / 2
          if d.added then return barHeight + barPadding / 2
          return 0

        layers.enter().append('g').attr('class', "wk-chart-layer")
        layers.exit().remove()

        bars = layers.selectAll('.wk-chart-rect')
        bars = bars.data((d) -> d.values
          ,
          (d) -> d.key.toString() + '|' + d.layerKey.toString()
          )
        bars.enter().append('rect').attr('class','wk-chart-rect wk-chart-selectable')
          .style('opacity', 0)
          .attr('fill', (d) -> color.scale()(d.layerKey))
          .call(_tooltip.tooltip)
          .call(_selected)

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
        else
          layers.attr('d', (d) -> area(d.values))

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

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', brush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

      ###*
          @ngdoc attr
          @name barStacked#padding
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
        _scaleList.y.rangePadding(config)
        host.lifeCycle().update()
  }
