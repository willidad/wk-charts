###*
  @ngdoc layout
  @name rangeBars
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a range bar chart layout

  @usesDimension rangeX [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'rangeBars', ($log, utils, barConfig, wkChartMargins)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "rangebars#{sBarCntr++}"

    bars = null
    barPaddingOld = 0
    barOuterPaddingOld = 0
    _scaleList = {}
    _selected = undefined

    _merge = utils.mergeData()
    _merge([]).key((d) -> d.key)

    initial = true

    config = _.clone(barConfig, true)

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    _tooltip = undefined

    ttEnter = (data) ->
      @headerName = _scaleList.y.axisLabel()
      @headerValue = _scaleList.y.formattedValue(data.data)
      @layers.push({name: _scaleList.rangeX.lowerProperty(), value: _scaleList.rangeX.formatValue(_scaleList.rangeX.lowerValue(data.data)), color:{'background-color': _scaleList.color.map(data.data)}})
      @layers.push({name: _scaleList.rangeX.upperProperty(), value: _scaleList.rangeX.formatValue(_scaleList.rangeX.upperValue(data.data)), color:{'background-color': _scaleList.color.map(data.data)}})

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color, size, shape, rangeX, rangeY) ->

      if not bars
        bars = @selectAll('.wk-chart-bars')
      #$log.log "rendering stacked-bar"

      barPadding = y.scale().rangeBand() / (1 - config.padding) * config.padding
      barOuterPadding = y.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

      layout = data.map((d) -> {
        key:y.value(d),
        x:rangeX.scale()(rangeX.lowerValue(d)),
        width:Math.abs(rangeX.scale()(rangeX.upperValue(d)) - rangeX.scale()(rangeX.lowerValue(d)))
        y:y.map(d),
        color:color.map(d),
        height:y.scale().rangeBand(y.value(d)),
        data:d
      })

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
          .attr('x',(d) -> d.x)
          .attr('height', (d) -> d.height)
          .attr('width', (d) -> d.width)
          .style('opacity', 1)
      bars.select('text')
        .text((d) -> rangeX.formatValue(rangeX.lowerValue(d.data)))
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
      _scaleList = @getScales(['rangeX', 'y', 'color'])
      @getKind('rangeX').domainCalc('extent').resetOnNewData(true)
      @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
      _tooltip = host.behavior().tooltip
      _selected = host.behavior().selected
      _tooltip.on "enter.#{_id}", ttEnter

    host.lifeCycle().on 'drawChart', draw
    host.lifeCycle().on 'brushDraw', brush


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