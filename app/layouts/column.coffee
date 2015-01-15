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
angular.module('wk.chart').directive 'column', ($log, utils, barConfig, wkChartMargins)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "column#{sBarCntr++}"

    columns = null
    _scaleList = {}
    _selected = undefined
    _merge = utils.mergeData()
    _merge([]).key((d) -> d.key)
    initial = true
    barPaddingOld = 0
    barOuterPaddingOld = 0

    config = _.clone(barConfig, true)

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    _tooltip = undefined

    ttEnter = (data) ->
      @headerName = _scaleList.x.axisLabel()
      @headerValue = _scaleList.y.axisLabel()
      @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.y.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color) ->

      if not columns
        columns = @selectAll('.wk-chart-column')
      #$log.log "rendering stacked-bar"

      barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding
      barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

      layout = data.map((d) -> {data:d, key:x.value(d), x:x.map(d), y:Math.min(y.scale()(0), y.map(d)), color:color.map(d), width:x.scale().rangeBand(x.value(d)), height:Math.abs(y.scale()(0) - y.map(d))})

      _merge(layout).first({x:0, width:0}).last({x:options.width + barPadding/2 - barOuterPaddingOld, width: barOuterPadding})


      columns = columns.data(layout, (d) -> d.key)

      enter = columns.enter().append('g').attr('class','wk-chart-column')
        .attr('transform', (d,i) -> "translate(#{if initial then d.x else _merge.addedPred(d).x  + _merge.addedPred(d).width + if i then barPaddingOld / 2 else barOuterPaddingOld},#{d.y}) scale(#{if initial then 1 else 0},1)")
      enter.append('rect')
        .attr('class', 'wk-chart-rect wk-chart-selectable')
        .attr('height', (d) -> d.height)
        .attr('width', (d) -> d.width)
        .style('fill',(d) -> d.color)
        .style('opacity', if initial then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)
      enter.append('text')
        .attr('class', 'wk-chart-data-label')
        .attr('x', (d) -> d.width / 2)
        .attr('y', - wkChartMargins.dataLabelPadding.vert)
        .attr({'text-anchor':'middle'})
        .style({opacity: 0})

      columns.transition().duration(options.duration)
        .attr("transform", (d) -> "translate(#{d.x}, #{d.y}) scale(1,1)")
      columns.select('rect').transition().duration(options.duration)
        .attr('width', (d) -> d.width)
        .attr('height', (d) -> d.height)
        .style('opacity',1)
      columns.select('text')
        .text((d) -> y.formattedValue(d.data))
        .transition().duration(options.duration)
          .attr('x', (d) -> d.width / 2)
          .style('opacity', if host.showDataLabels() then 1 else 0)

      columns.exit().transition().duration(options.duration)
        .attr('transform', (d) -> "translate(#{_merge.deletedSucc(d).x - barPadding / 2},#{d.y}) scale(0,1)")
        .remove()

      initial = false
      barPaddingOld = barPadding
      barOuterPaddingOld = barOuterPadding

    brush = (axis, idxRange) ->
      columns
        .attr('transform',(d) -> "translate(#{if (x = axis.scale()(d.key)) >= 0 then x else -1000}, #{d.y})")
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
      _tooltip.on "enter.#{_id}", ttEnter

    host.lifeCycle().on 'drawChart', draw
    host.lifeCycle().on 'brushDraw', brush
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
