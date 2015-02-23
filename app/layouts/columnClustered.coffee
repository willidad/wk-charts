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
angular.module('wk.chart').directive 'columnClustered', ($log, utils, barConfig, dataManagerFactory, tooltipHelperFactory)->

  clusteredColumnCntr = 0
  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me

      _id = "clusteredColumn#{clusteredColumnCntr++}"

      _columnStyle = {}

      layers = null
      clusterX = undefined

      barPaddingOld = 0
      barOuterPaddingOld = 0
      barWidth = 0
      config = _.clone(barConfig, true)

      xData = dataManagerFactory()
      ttHelper = tooltipHelperFactory()

      initial = true

      stack = d3.layout.stack()
      stack
        .values((d)-> d.values)
        .y((d) -> if d.layerDeleted or d.layerAdded or d.deleted or d.added then 0 else barWidth)
        .x((d) -> d.layerKey)

      #-----------------------------------------------------------------------------------------------------------------

      _tooltip = undefined
      _selected = undefined
      _scaleList = {}

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
        #$log.info "rendering clustered-bar"

        layerKeys = data.filter((d) -> not d.added and not d.deleted).map((d) -> d.layerKey)
        clusterWidth = x.scale().rangeBand()
        clusterX = d3.scale.ordinal().domain(layerKeys).rangeBands([0, clusterWidth], 0, 0)

        barWidth = clusterX.rangeBand()
        barPadding = barWidth / (1 - config.padding) * config.padding
        barOuterPadding = barWidth / (1 - config.outerPadding) * config.outerPadding

        offset = (d) ->
          if x.reverse()
            if d.deleted and d.highBorder then return barPadding / 2
            if d.deleted then return clusterWidth + barPadding / 2
            if d.added and d.atBorder then return barPadding / 2
            if d.added then return clusterWidth + barPadding / 2
          else
            if d.deleted and d.highBorder then return clusterWidth
            if d.deleted then return 0 -barPadding / 2
            if d.added and d.atBorder then return  clusterWidth + barPadding / 2
            if d.added then return 0 -barPadding / 2
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
          .style(_columnStyle)

        (if doAnimate then bars.transition().duration(options.duration) else bars)
          .attr('x', (d) -> x.scale()(d.targetKey) + d.y0 + offset(d))
          .attr('width', (d) -> d.y)
          .attr('height', (d) -> Math.abs(y.scale()(0) - y.scale()(d.targetValue)))
          .attr('y', (d) -> Math.min(y.scale()(0), y.scale()(d.targetValue)))
          .style('opacity', 1)

        bars.exit()
          .remove()

        initial = false
        barPaddingOld = barPadding
        barOuterPaddingOld = barOuterPadding

      drawBrush = (axis, idxRange) ->
        clusterX.rangeBands([0,axis.scale().rangeBand()], 0, 0)
        height = clusterX.rangeBand()
        bars = this.selectAll(".wk-chart-rect")
        if axis.isOrdinal()
          bars
            .attr('x', (d) -> if (val = axis.scale()(d.targetKey)) >= 0 then val + clusterX(d.layerKey) else -1000)
            .attr('width', (d) -> height)
          ttHelper.brushRange(idxRange)

      #-------------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('y').domainCalc('max').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _tooltip.on "enter.#{_id}", ttHelper.enter
        _selected = host.behavior().selected
        ttHelper
          .keyScale(_scaleList.x)
          .valueScale(_scaleList.y)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on "brushDraw.#{_id}", drawBrush
      host.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      host.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      host.lifeCycle().on "destroy.#{_id}", ->
        host.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null

      ###*
        @ngdoc attr
        @name columnClustered#padding
        @values true, false, [padding, outerPadding]
        @param [padding=true] {boolean | list}
      * Defines the inner and outer padding between the columns.
      *
      * `padding` and `outerPadding` are measured in % of the total column space occupied, i.e. a padding of 20 implies a bar height of 80%, padding 50 implies bar and space have the same size.
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
        @name columnClustered#columnStyle
        @param [columnStyle] {object} - Set the line style for columns lines in the layout
      ###
      attrs.$observe 'columnStyle', (val) ->
        if val
          _columnStyle = scope.$eval(val)
  }

