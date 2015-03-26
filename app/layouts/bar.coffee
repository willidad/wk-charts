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
angular.module('wk.chart').directive 'bars', ($log, utils, barConfig, dataLabelFactory, dataManagerFactory, tooltipHelperFactory)->
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
    _barStyle = {}
    config = _.clone(barConfig, true)

    xData = dataManagerFactory()
    ttHelper = tooltipHelperFactory()
    dataLabels = dataLabelFactory()
    _tooltip = undefined

    #--- Draw --------------------------------------------------------------------------------------------------------

    setAnimationStart = (data, options, x, y, color) ->
      xData.keyScale(y).valueScale(x).data(data, true)
      if not xData.isInitial()
        layoutData = xData.animationStartLayers()
        #$log.debug layoutData
        drawPath.apply(this, [false, layoutData, options, x, y, color])

    setAnimationEnd = (data, options, x, y, color) ->
      layoutData = xData.animationEndLayers()
      dataLabels.duration(options.duration).active(host.showDataLabels()) # needs to be here to ensure right opacity animation !
      drawPath.apply(this, [true, layoutData, options, x, y, color])

    drawPath = (doAnimate, data, options, x, y, color) ->

      setStyle = (d) ->
        elem = d3.select(this)
        elem.style(_barStyle)
        style = if color.property().length is 0 then color.scale()(d.layerKey) else color.map(d.data)
        if typeof style is 'string'
          elem.style({fill:style, stroke:style})
        else
          elem.style(style)

      _colorByKey = not color.property() and color.isOrdinal()
      ttHelper.colorByKey(_colorByKey)

      if not bars
        bars = @selectAll('.wk-chart-layer')
      #$log.log "rendering stacked-bar"

      barHeight = y.scale().rangeBand()
      barPadding = barHeight / (1 - config.padding) * config.padding
      barOuterPadding = barHeight / (1 - config.outerPadding) * config.outerPadding
      #$log.log 'barPadding', barPadding, data

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

      bars = bars.data(data[0].values, (d, i) -> d.key)

      enter = bars.enter().append('g').attr('class','wk-chart-layer')
        .attr('transform', (d)-> "translate(#{x.scale()(0)}, #{y.scale()(d.targetKey) + offset(d)})")

      enter.append('rect')
        .attr('class', 'wk-chart-rect wk-chart-selectable')
        .attr('height', (d) -> if d.added or d.deleted then 0 else barHeight)
        .style('opacity', 0)
        .call(_tooltip.tooltip)
        .call(_selected)

      (if doAnimate then bars.transition().duration(options.duration) else bars)
          .attr('transform', (d) -> "translate(#{x.scale()(0)}, #{y.scale()(d.targetKey) + offset(d)}) scale(1,1)")

      rect = bars.select('rect')
        #.style('fill', (d) -> if color.property().length is 0 then color.scale()(d.layerKey) else color.map(d.data))
        #.style('stroke', (d) -> if color.property().length is 0 then color.scale()(d.layerKey) else color.map(d.data))
        #.style(_barStyle)
        .each(setStyle)
      (if doAnimate then rect.transition().duration(options.duration) else rect)
        .attr('height', (d) -> if d.added or d.deleted then 0 else barHeight)
        .attr('width', (d) -> Math.abs(x.scale()(0) - x.scale()(d.targetValue)))
        .style('opacity', 1)

      bars.exit()
        .remove()

      bars.call(dataLabels, doAnimate, host.dataLabelStyle())

    brush = (axis, idxRange) ->
      bars
        .attr('transform',(d) -> "translate(0, #{if (y = axis.scale()(d.key)) >= 0 then y else -1000})")
          .selectAll('.wk-chart-rect')
          .attr('height', (d) -> axis.scale().rangeBand())
      dataLabels.brush(bars)

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
      dataLabels
        .keyScale(_scaleList.y)
        .valueScale(_scaleList.x)

    host.lifeCycle().on "brushDraw.#{_id}", brush
    host.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
    host.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

    host.lifeCycle().on "destroy.#{_id}", ->
      host.lifeCycle().on ".#{_id}", null
      _tooltip.on ".#{_id}", null

    ###*
      @ngdoc attr
      @name bars#padding
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

    ###*
        @ngdoc attr
        @name bars#labelStyle
        @param [labelStyle=font-size:"1.3em"] {object} defined the font style attributes for the labels.
    ###
    attrs.$observe 'labelStyle', (val) ->
      if val
        host.dataLabelStyle(scope.$eval(val))
      host.lifeCycle().update()

    ###*
        @ngdoc attr
        @name bars#barStyle
        @param [barsStyle] {object} - Set the line style for columns lines in the layout
      ###
    attrs.$observe 'barStyle', (val) ->
      if val
        _barStyle = scope.$eval(val)
  }