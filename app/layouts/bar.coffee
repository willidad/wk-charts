###*
  @ngdoc layout
  @name bars
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a bar chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'bars', ($log, utils, barConfig, wkChartMargins, dataManagerFactory, tooltipHelperFactory)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "bars#{sBarCntr++}"

    bars = null
    barPaddingOld = 0
    barOuterPaddingOld = 0
    _scaleList = {}
    _selected = undefined

    _merge = utils.mergeData()
    _merge([]).key((d) -> d.key)

    initial = true

    config = _.clone(barConfig, true)

    xData = dataManagerFactory()
    ttHelper = tooltipHelperFactory()

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    _tooltip = undefined
    ###
    ttEnter = (data) ->
      @headerName = _scaleList.y.axisLabel()
      @headerValue = _scaleList.x.axisLabel()
      @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.x.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})
    ###
    #--- Draw --------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color) ->
      xData.keyScale(y).valueScale(x).data(data)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color) ->
      layoutData = xData.animationEndLayers()
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      if not bars
        bars = @selectAll('.wk-chart-bars')
      #$log.log "rendering stacked-bar"

      barHeight = y.scale().rangeBand()
      barPadding = barHeight / (1 - config.padding) * config.padding
      barOuterPadding = barHeight / (1 - config.outerPadding) * config.outerPadding

      offset = (d) ->
        if d.deleted and d.atBorder then return -barPadding / 2
        if d.deleted then return barHeight + barPadding / 2
        if d.added and d.atBorder then return barHeight + barPadding / 2
        if d.added then return -barPadding / 2
        return 0

      bars = bars.data(data[0].values, (d) -> d.key)

      enter = bars.enter().append('g').attr('class','wk-chart-bar')
        .attr('transform', (d)-> "translate(0, #{y.scale()(d.targetKey)})")
      enter.append('rect')
        .attr('class', 'wk-chart-rect wk-chart-selectable')
        .attr('height', (d) -> if d.added or d.deleted then 0 else barHeight)
        .style('opacity', if initial then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)
      enter.append('text')
        .attr('class':'wk-chart-data-label')
        .attr('y', (d) -> barHeight / 2 )
        .attr('x', (d) -> x.scale()(d.value) + wkChartMargins.dataLabelPadding.hor)
        .attr({dy: '0.35em', 'text-anchor':'start'})
        .style({opacity: 0})

      (if doAnimate then bars.transition().duration(options.duration) else bars)
          .attr('transform', (d) -> "translate(0, #{y.scale()(d.targetKey) + offset(d)}) scale(1,1)")

      rect = bars.select('rect')
        .style('fill', (d) -> color.scale()(d.key))
      (if doAnimate then rect.transition().duration(options.duration) else rect)
          .attr('height', (d) -> if d.added or d.deleted then 0 else barHeight)
          .attr('width', (d) -> Math.abs(x.scale()(0) - x.scale()(d.value)))
          .style('opacity', 1)
      text = bars.select('text')
        .text((d) -> x.formatValue(d.value))
      (if doAnimate then text.transition().duration(options.duration) else text)
          .attr('y', (d) -> barHeight / 2)
          .attr('x', (d) -> x.scale()(d.value) + wkChartMargins.dataLabelPadding.hor)
          .style('opacity', if host.showDataLabels() then 1 else 0)

      bars.exit()
        .remove()

      initial = false

      barPaddingOld = barPadding
      barOuterPaddingOld = barOuterPadding

    brush = (axis, idxRange) ->
      bars
        .attr('transform',(d) -> "translate(0, #{if (y = axis.scale()(d.key)) >= 0 then y else -1000})")
        .selectAll('.wk-chart-rect')
        .attr('height', (d) -> axis.scale().rangeBand())
      bars.selectAll('text')
        .attr('y',axis.scale().rangeBand() / 2)

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @getKind('x').domainCalc('max').resetOnNewData(true)
      @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
      _tooltip = host.behavior().tooltip
      _selected = host.behavior().selected
      ttHelper
        .keyScale(_scaleList.y)
        .valueScale(_scaleList.x)
        .colorScale(_scaleList.color)
        .value((d) -> d.value)
      _tooltip.on "enter.#{_id}", ttHelper.enter

    #host.lifeCycle().on 'drawChart', draw
    host.lifeCycle().on 'brushDraw', brush
    host.lifeCycle().on 'animationStartState', setAnimationStart
    host.lifeCycle().on 'animationEndState', setAnimationEnd

    ###*
      @ngdoc attr
      @name bars#padding
      @values true, false, [padding, outerPadding]
      @description bla bla
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
        @name bars#labels
        @values true, false
        @param [labels=true] {boolean} controls the display of data labels for each of the bars.
    ###
    attrs.$observe 'labels', (val) ->
      if val is 'false'
        host.showDataLabels(false)
      else if val is 'true' or val is ""
        host.showDataLabels('x')
      host.lifeCycle().update()
  }