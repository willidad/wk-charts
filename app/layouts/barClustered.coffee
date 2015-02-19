###*
  @ngdoc layout
  @name barClustered
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a clustered bar layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]


###
angular.module('wk.chart').directive 'barClustered', ($log, utils, barConfig, dataManagerFactory, tooltipHelperFactory)->

  clusteredBarCntr = 0
  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me

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
        drawPath.apply(this, [true, layoutData, options, x, y, color])

      drawPath = (doAnimate, data, options, x, y, color) ->
        #$log.info "rendering clustered-bar"

        # map data to the right format for rendering
        layerKeys = data.filter((d) -> not d.added and not d.deleted).map((d) -> d.layerKey)
        clusterHeight = y.scale().rangeBand()
        clusterY = d3.scale.ordinal().domain(layerKeys).rangeBands([0, clusterHeight], 0, 0)
        barHeight = clusterY.rangeBand()
        barPadding = barHeight / (1 - config.padding) * config.padding
        barOuterPadding = barHeight / (1 - config.outerPadding) * config.outerPadding

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

        stackLayout = stack(data)
        $log.log stackLayout
        if not layers
          layers = @selectAll('.wk-chart-layer')

        layers = layers.data(stackLayout, (d) -> d.layerKey)

        layers.enter().append('g')
          .attr('class', 'wk-chart-layer')

        layers.exit()
          .remove()

        bars = layers.selectAll('.wk-chart-rect')
          .data(
            (d) -> d.values
          , (d) -> d.layerKey + '|' + d.key
          )

        bars.enter().append('rect')
          .attr('class', 'wk-chart-rect wk-chart-selectable')
          .style('fill', (d) -> color.scale()(d.layerKey))
          .style('opacity', 0)
          .call(_tooltip.tooltip)
          .call(_selected)

        bars
          .style(_barStyle)

        (if doAnimate then bars.transition().duration(options.duration) else bars)
          .attr('y', (d) -> y.scale()(d.targetKey) + d.y0 + offset(d))
          .attr('height', (d) -> d.y)
          .attr('width', (d) -> Math.abs(x.scale()(d.targetValue) or 0))
          .attr('x', (d) -> Math.min(x.scale()(0), x.scale()(d.targetValue)))
          .style('opacity', 1)

        bars.exit()
          .remove()

        initial = false
        barPaddingOld = barPadding
        barOuterPaddingOld = barOuterPadding

      drawBrush = (axis, idxRange) ->
        clusterY.rangeBands([0,axis.scale().rangeBand()], 0, 0)
        height = clusterY.rangeBand()
        bars = this.selectAll(".wk-chart-rect")
        if axis.isOrdinal()
          bars
          .attr('y', (d) -> if (val = axis.scale()(d.targetKey)) >= 0 then val + clusterY(d.layerKey) else -1000)
          .attr('height', (d) -> height)
          ttHelper.brushRange(idxRange)

      #-------------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('max').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _tooltip.on "enter.#{_id}", ttHelper.enter
        _selected = host.behavior().selected
        ttHelper
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', drawBrush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

      ###*
        @ngdoc attr
        @name barClustered#padding
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

      ###*
        @ngdoc attr
        @name barClustered#barsStyle
        @param [barStyle] {object} - Set the line style for columns lines in the layout
      ###
      attrs.$observe 'barStyle', (val) ->
        if val
          _barStyle = scope.$eval(val)
  }

