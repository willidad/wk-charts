###*
  @ngdoc layout
  @name column
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a column chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'column', ($log, utils, barConfig, wkChartMargins, dataManagerFactory, tooltipHelperFactory)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "column#{sBarCntr++}"

    columns = null
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
    _tooltip = undefined

    #--- Draw --------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color) ->
      xData.keyScale(x).valueScale(y).data(data)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color) ->
      layoutData = xData.animationEndLayers()
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      if not columns
        columns = @selectAll('.wk-chart-columns')
      #$log.log "rendering stacked-bar"

      barWidth = x.scale().rangeBand()
      barPadding = barWidth / (1 - config.padding) * config.padding
      barOuterPadding = barWidth / (1 - config.outerPadding) * config.outerPadding

      offset = (d) ->
        if d.deleted and d.atBorder then return barWidth
        if d.deleted then return -barPadding / 2
        if d.added and d.atBorder then return  barPadding / 2
        if d.added then return barWidth + barPadding / 2
        return 0

      columns = columns.data(data[0].values, (d) -> d.key)

      enter = columns.enter().append('g').attr('class','wk-chart-columns')
        .attr('transform', (d)-> "translate(#{x.scale()(d.targetKey)})")

      enter.append('rect')
        .attr('class', 'wk-chart-rect wk-chart-selectable')
        .attr('width', (d) -> if d.added or d.deleted then 0 else barWidth)
        .style('opacity', if initial then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)

      enter.append('text')
      .attr('class':'wk-chart-data-label')
      .attr('x', (d) -> barWidth / 2 )
      .attr('y', (d) -> Math.min(y.scale()(0), y.scale()(d.targetValue)) - wkChartMargins.dataLabelPadding.vert)
      .attr({'text-anchor':'middle'})
      .style({opacity: 0})

      (if doAnimate then columns.transition().duration(options.duration) else columns)
        .attr('transform', (d) -> "translate(#{x.scale()(d.targetKey) + offset(d)})")

      rect = columns.select('rect')
        .style('fill', (d) -> color.scale()(d.key))
        .style('stroke', (d) -> color.scale()(d.key))
      (if doAnimate then rect.transition().duration(options.duration) else rect)
        .attr('width', (d) -> if d.added or d.deleted then 0 else barWidth)
        .attr('height', (d) -> Math.abs(y.scale()(0) - y.scale()(d.targetValue)))
        .attr('y', (d) -> Math.min(y.scale()(0), y.scale()(d.targetValue)))
        .style('opacity', 1)
      text = columns.select('text')
        .text((d) -> y.formatValue(d.value))
      (if doAnimate then text.transition().duration(options.duration) else text)
        .attr('x', (d) -> barWidth / 2)
        .attr('y', (d) -> Math.min(y.scale()(0), y.scale()(d.targetValue) - wkChartMargins.dataLabelPadding.hor))
        .style('opacity', if host.showDataLabels() then 1 else 0)

      columns.exit()
      .remove()

      initial = false

      barPaddingOld = barPadding
      barOuterPaddingOld = barOuterPadding

    brush = (axis, idxRange) ->
      columns
        .attr('transform',(d) -> "translate(#{if (x = axis.scale()(d.key)) >= 0 then x else -1000})")
        .selectAll('.wk-chart-rect')
        .attr('width', (d) -> axis.scale().rangeBand())
      columns.selectAll('text')
        .attr('x',axis.scale().rangeBand() / 2)

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @getKind('y').domainCalc('max').resetOnNewData(true)
      @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
      _tooltip = host.behavior().tooltip
      _selected = host.behavior().selected
      ttHelper
        .keyScale(_scaleList.x)
        .valueScale(_scaleList.y)
        .colorScale(_scaleList.color)
        .colorByKey(true)
        .value((d) -> d.value)
      _tooltip.on "enter.#{_id}", ttHelper.enter

    host.lifeCycle().on 'brushDraw', brush
    host.lifeCycle().on 'animationStartState', setAnimationStart
    host.lifeCycle().on 'animationEndState', setAnimationEnd

    ###*
    @ngdoc attr
      @name column#padding
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
        @name column#labels
        @values true, false
        @param [labels=true] {boolean} controls the display of data labels for each of the bars.
    ###
    attrs.$observe 'labels', (val) ->
      if val is 'false'
        host.showDataLabels(false)
      else if val is 'true' or val is ""
        host.showDataLabels('y')
      host.lifeCycle().update()

  }
