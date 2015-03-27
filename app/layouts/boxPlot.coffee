###*
  @ngdoc layout
  @name boxPlot
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
angular.module('wk.chart').directive 'boxPlot', ($log, utils, barConfig, dataManagerFactory, markerFactory, tooltipHelperFactory)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "boxPlot#{sBarCntr++}"

    _boxStyle = {}

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

      setStyle = (s, key) ->
        s.each((d) ->
          elem = d3.select(this)
          elem.style(_boxStyle)
          style = color.scale()(d[key].property)
          if typeof style is 'string'
            elem.style({fill:style, stroke:style})
          else
            elem.style(style)
          )
      barWidth = x.scale().rangeBand()
      barPadding = barWidth / (1 - config.padding) * config.padding
      offset = if y.isOrdinal() then barWidth / 2 else 0
      if _tooltip
        _tooltip.data(data)
        ttHelper.layout(data)

      offset = (d) ->
        if d.deleted and d.atBorder then return barWidth
        if d.deleted then return -barPadding / 2
        if d.added and d.atBorder then return  barWidth + barPadding / 2
        if d.added then return -barPadding / 2
        return 0

      # re-format data
      ranges = []
      i = 0
      showMin = false
      showMax = false
      if data.length is 3
        prop = ['lq', 'med', 'uq']
      else if data.length is 5
        prop = ['min','lq', 'med', 'uq', 'max']
        showMin = showMax = true

      layerKeys = y.property()
      while i < data[0].values.length
        r = {}
        r.key = data[0].values[i].key
        r.targetKey = data[0].values[i].targetKey
        r.data = data[0].values[i].data
        r.added = data[0].values[i].added
        r.deleted = data[0].values[i].deleted
        for p, j in prop
          r[p] = {}
          r[p].val = data[j].values[i].targetValue
          r[p].property = layerKeys[j]
        ranges.push(r)
        i++

      box = this.selectAll(".wk-chart-box")
        .data(ranges, (d) -> d.key)
      boxEnter = box.enter()
        .append('g').attr('class','wk-chart-box wk-chart-selectable')
        .attr('transform',(d) -> "translate(#{x.scale()(d.targetKey) + offset(d)})")
        .classed('wk-chart-hidden', true)
        .style('opacity', 0)
        .call(_selected)
      boxEnter.append('rect')
        .attr('class', 'wk-chart-box-uq wk-chart-selectable')
        .classed('wk-chart-hidden', true)
        .style('opacity', 0)
        .style('fill', 'white')
        .style('stroke', 'black')
        .call(_tooltip.tooltip)

      boxEnter.append('rect')
        .attr('class', 'wk-chart-box-lq  wk-chart-selectable')
        .classed('wk-chart-hidden', true)
        .style('opacity', 0)
        .style('fill', 'white')
        .style('stroke', 'black')
        .call(_tooltip.tooltip)

      boxEnter.append('line')
        .attr('class', 'wk-chart-box-med')
        .classed('wk-chart-hidden', true)
        .style({opacity: 0})
      boxEnter.append('line')
        .attr('class', 'wk-chart-box-lw')
        .classed('wk-chart-hidden', true)
        .style({opacity: 0})
      boxEnter.append('line')
        .attr('class', 'wk-chart-box-lw-conn')
        .classed('wk-chart-hidden', true)
        .style({opacity: 0, 'stroke-dasharray':'2.2'})
      boxEnter.append('line')
        .attr('class', 'wk-chart-box-uw')
        .classed('wk-chart-hidden', true)
        .style({stroke: 'black', opacity: 0})
      boxEnter.append('line')
        .attr('class', 'wk-chart-box-uw-conn')
        .classed('wk-chart-hidden', true)
        .style({opacity: 0, 'stroke-dasharray':'2.2'})
      (if doAnimate then box.transition().duration( options.duration) else box)
        .attr('transform',(d) -> "translate(#{x.scale()(d.targetKey) + offset(d)})")
        .style('opacity', (d) -> if d.deleted then 0 else 1)

      uq = box.select('.wk-chart-box-uq')
        .call(setStyle, 'uq')
      (if doAnimate then uq.transition().duration( options.duration) else uq)
        .attr('y', (d) -> y.scale()(d.uq.val))
        .attr('height', (d) -> Math.abs(y.scale()(d.uq.val) - y.scale()(d.med.val)))
        .attr('width', (d) -> if d.added or d.deleted then 0 else barWidth)
        .style('opacity', 1)

      lq = box.select('.wk-chart-box-lq')
        .call(setStyle, 'lq')
      (if doAnimate then lq.transition().duration( options.duration) else lq)
        .attr('y', (d) -> y.scale()(d.med.val))
        .attr('height', (d) -> Math.abs(y.scale()(d.med.val) - y.scale()(d.lq.val)))
        .attr('width', (d) -> if d.added or d.deleted then 0 else barWidth)
        .style('opacity', 1)

      med = box.select('.wk-chart-box-med')
        .call(setStyle, 'med')
      (if doAnimate then med.transition().duration( options.duration) else med)
        .attr('x1', -barWidth * 0.2)
        .attr('x2', (d) -> if d.added or d.deleted then 0 else barWidth*1.3)
        .attr('y1', (d) -> y.scale()(d.med.val))
        .attr('y2', (d) -> y.scale()(d.med.val))
        .style({'opacity':1, 'stroke-width':2})

      lWhisker =  box.select('.wk-chart-box-lw')
        .call(setStyle, 'min')
      (if doAnimate then lWhisker.transition().duration( options.duration) else lWhisker)
        .attr('x1', 0)
        .attr('x2', (d) -> if d.added or d.deleted then 0 else barWidth)
        .attr('y1', (d) -> if showMin then y.scale()(d.min.val) else 0)
        .attr('y2', (d) -> if showMin then y.scale()(d.min.val) else 0)
        .style({'opacity':1, 'stroke-width':3})#.style('stroke', 'black')
        .style('visibility', if showMin then 'visible' else 'none')

      lwConn = box.select('.wk-chart-box-lw-conn')
      (if doAnimate then lwConn.transition().duration( options.duration) else lwConn)
        .attr('x1', (d) -> if d.added or d.deleted then 0 else barWidth/2)
        .attr('x2', (d) -> if d.added or d.deleted then 0 else barWidth/2)
        .attr('y1', (d) -> if showMin then y.scale()(d.lq.val) else 0)
        .attr('y2', (d) -> if showMin then y.scale()(d.min.val) else 0)
        .style('opacity', 1).style('stroke', 'black')
        .style('visibility', if showMin then 'visible' else 'none')

      uWhisker =  box.select('.wk-chart-box-uw')
        .call(setStyle, 'max')
      (if doAnimate then uWhisker.transition().duration( options.duration) else uWhisker)
        .attr('x1', 0)
        .attr('x2', (d) -> if d.added or d.deleted then 0 else barWidth)
        .attr('y1', (d) -> if showMax then y.scale()(d.max.val) else 0)
        .attr('y2', (d) -> if showMax then y.scale()(d.max.val) else 0)
        .style({'opacity':1, 'stroke-width':3}) #.style('stroke', 'black')
        .style('visibility', if showMax then 'visible' else 'none')

      uwConn = box.select('.wk-chart-box-uw-conn')
      (if doAnimate then uwConn.transition().duration( options.duration) else uwConn)
        .attr('x1', (d) -> if d.added or d.deleted then 0 else barWidth/2)
        .attr('x2', (d) -> if d.added or d.deleted then 0 else barWidth/2)
        .attr('y1', (d) -> if showMax then y.scale()(d.uq.val) else 0)
        .attr('y2', (d) -> if showMax then y.scale()(d.max.val) else 0)
        .style('opacity', 1).style('stroke', 'black')
        .style('visibility', if showMax then 'visible' else 'none')


      box.exit()
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

    #host.lifeCycle().on "drawChart", draw
    host.lifeCycle().on "brushDraw.#{_id}", brush
    host.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
    host.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

    host.lifeCycle().on "destroy.#{_id}", ->
      host.lifeCycle().on ".#{_id}", null
      _tooltip.on ".#{_id}", null

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
      @name rangeColumn#boxStyle
      @param [columnStyle] {object} - Set the line style for columns lines in the layout
    ###
    attrs.$observe 'boxStyle', (val) ->
      if val
        _boxStyle = scope.$eval(val)

  }
