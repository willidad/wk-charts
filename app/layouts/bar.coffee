###*
  @ngdoc layout
  @name bars
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @requires x
  @requires y
  @requires color
  @requires layout


###
angular.module('wk.chart').directive 'bars', ($log, utils, barConfig, wkChartMargins)->
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

    config = barConfig

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    _tooltip = undefined

    ttEnter = (data) ->
      @headerName = _scaleList.y.axisLabel()
      @headerValue = _scaleList.x.axisLabel()
      @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.x.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color) ->

      if not bars
        bars = @selectAll('.wk-chart-bars')
      #$log.log "rendering stacked-bar"

      barPadding = y.scale().rangeBand() / (1 - config.padding) * config.padding
      barOuterPadding = y.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

      layout = data.map((d) -> {key:y.value(d), x:x.map(d), y:y.map(d), color:color.map(d), height:y.scale().rangeBand(y.value(d)), data:d})

      _merge(layout).first({y:options.height + barPaddingOld / 2 - barOuterPadding}).last({y:0, height:barOuterPaddingOld - barPaddingOld / 2})  #y.scale().range()[y.scale().range().length-1]

      bars = bars.data(layout, (d) -> d.key)

      enter = bars.enter().append('g').attr('class','wk-chart-bar')
        .attr('transform', (d)-> "translate(0, #{if initial then d.y else _merge.addedPred(d).y - barPaddingOld / 2}) scale(1, #{if initial then 1 else 0})")
      enter.append('rect')
        .attr('class', 'wk-chart-rect wk-chart-selectable')
        #.attr('y', (d) -> if initial then d.y else _merge.addedPred(d).y - barPaddingOld / 2)
        .attr('height', (d) -> d.height)
        .style('opacity', if initial then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)
      enter.append('text')
        .attr('class':'wk-chart-data-label')
        .attr('y', (d) -> d.height / 2 )
        .attr('x', (d) -> d.x + wkChartMargins.dataLabelPadding.hor)
        .attr({dy: '0.35em', 'text-anchor':'start'})
        .style({opacity: 0})

      bars.transition().duration(options.duration)
        .attr('transform', (d) -> "translate(0, #{d.y}) scale(1,1)")
      bars.select('rect')
        .style('fill', (d) -> d.color)
        .transition().duration(options.duration)
          .attr('height', (d) -> d.height)
          .attr('width', (d) -> Math.abs(x.scale()(0) - d.x))
          .style('opacity', 1)
      bars.select('text')
        .text((d) -> x.formattedValue(d.data))
        .transition().duration(options.duration)
          .attr('y', (d) -> d.height / 2)
          .attr('x', (d) -> d.x + wkChartMargins.dataLabelPadding.hor)
          .style('opacity', if host.showDataLabels() then 1 else 0)


      bars.exit()
        .transition().duration(options.duration)
          .attr('transform', (d) -> "translate(0,#{_merge.deletedSucc(d).y + _merge.deletedSucc(d).height + barPadding / 2}) scale(1,0)")
          .attr('height', 0)
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
      _tooltip.on "enter.#{_id}", ttEnter

    host.lifeCycle().on 'drawChart', draw
    host.lifeCycle().on 'brushDraw', brush


    attrs.$observe 'padding', (val) ->
      if val is 'false'
        config.padding = 0
        config.outerPadding = 0
      else if val is 'true'
        _.merge(config, barConfig)
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

    attrs.$observe 'labels', (val) ->
      if val is 'false'
        host.showDataLabels(false)
      else if val is 'true' or val is ""
        host.showDataLabels('x')
      host.lifeCycle().update()
  }