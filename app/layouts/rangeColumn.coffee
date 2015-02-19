###*
  @ngdoc layout
  @name rangeColumn
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a column range chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'rangeColumn', ($log, utils, barConfig, dataManagerFactory, markerFactory, tooltipHelperFactory)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "rangeColumn#{sBarCntr++}"

    _columnStyle = {}

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
      xData.keyScale(x).valueScale(y).data(data, true)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color, size) ->
      markers.active(_showMarkers)
      layoutData = xData.animationEndLayers()
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      barHeight = x.scale().rangeBand()
      barPadding = barHeight / (1 - config.padding) * config.padding
      offset = if y.isOrdinal() then barHeight / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      offset = (d) ->
        if d.deleted and d.atBorder then return barHeight
        if d.deleted then return -barPadding / 2
        if d.added and d.atBorder then return  barHeight + barPadding / 2
        if d.added then return -barPadding / 2
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
        .style('fill', color.scale()(range[0].layerKey))
        .call(_tooltip.tooltip)
        .call(_selected)
        .attr('transform',(d) -> "translate(#{x.scale()(d.targetKey)})")

      range
        .style(_columnStyle)

      (if doAnimate then range.transition().duration( options.duration) else range)
        .attr('transform',(d) -> "translate(#{x.scale()(d.targetKey) + offset(d)})")
        .attr('width', (d) -> if d.added or d.deleted then 0 else barHeight)
        .attr('height', (d) -> Math.abs(y.scale()(d.targetValue) - y.scale()(d.value1)))
        .attr('y', (d) -> y.scale()(d.targetValue))
        .style('stroke', (d) -> color.scale()(d.layerKey))
        .style('opacity', 1)

      range.exit().remove()

      layers.exit()
      .remove()

    brush = (axis, idxRange) ->
      this.selectAll('.wk-chart-rect')
          .attr('transform',(d) -> "translate(0, #{if (x = axis.scale()(d.targetKey)) >= 0 then x else -1000})")
        .selectAll('.wk-chart-rect')
          .attr('height', (d) -> axis.scale().rangeBand())

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @getKind('y').domainCalc('extent').resetOnNewData(true)
      @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
      _tooltip = host.behavior().tooltip
      ttHelper
        .keyScale(_scaleList.x)
        .valueScale(_scaleList.y)
        .colorScale(_scaleList.color)
        .value((d) -> d.value)
      _selected = host.behavior().selected
      _tooltip.on "enter.#{_id}", ttHelper.enter

    #host.lifeCycle().on 'drawChart', draw
    host.lifeCycle().on 'brushDraw', brush
    host.lifeCycle().on 'animationStartState', setAnimationStart
    host.lifeCycle().on 'animationEndState', setAnimationEnd

    ###*
    @ngdoc attr
      @name rangeColumn#padding
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
    ###*
        @ngdoc attr
        @name rangeColumn#labels
        @values true, false
        @param [labels=true] {boolean} controls the display of data labels for each of the bars.
    ###
    attrs.$observe 'labels', (val) ->
      if val is 'false'
        host.showDataLabels(false)
      else if val is 'true' or val is ""
        host.showDataLabels('y')
      host.lifeCycle().update()

    ###*
      @ngdoc attr
      @name rangeColumn#columnStyle
      @param [columnStyle] {object} - Set the line style for columns lines in the layout
    ###
    attrs.$observe 'columnStyle', (val) ->
      if val
        _columnStyle = scope.$eval(val)

  }
