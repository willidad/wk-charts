angular.module('wk.chart').directive 'column', ($log, utils, barConfig)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "simpleColumn#{sBarCntr++}"

    columns = null
    _scaleList = {}
    _selected = undefined
    _merge = utils.mergeData()
    _merge([]).key((d) -> d.key)
    initial = true
    barPaddingOld = 0
    barOuterPaddingOld = 0

    config = {}
    _.merge(config, barConfig)

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    _tooltip = undefined

    ttEnter = (data) ->
      @headerName = _scaleList.x.axisLabel()
      @headerValue = _scaleList.y.axisLabel()
      @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.y.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color) ->

      if not columns
        columns = @selectAll('.wk-chart-columns')
      #$log.log "rendering stacked-bar"

      barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding
      barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

      layout = data.map((d) -> {data:d, key:x.value(d), x:x.map(d), y:Math.min(y.scale()(0), y.map(d)), color:color.map(d), width:x.scale().rangeBand(x.value(d)), height:Math.abs(y.scale()(0) - y.map(d))})

      _merge(layout).first({x:0, width:0}).last({x:options.width + barPadding/2 - barOuterPaddingOld, width: barOuterPadding})


      columns = columns.data(layout, (d) -> d.key)

      enter = columns.enter().append('g').attr('class','wk-chart-columns wk-chart-selectable')
        .attr('transform', (d,i) -> "translate(#{if initial then d.x else _merge.addedPred(d).x  + _merge.addedPred(d).width + if i then barPaddingOld / 2 else barOuterPaddingOld},#{d.y}) scale(#{if initial then 1 else 0},1)")
      enter.append('rect')
        .attr('height', (d) -> d.height)
        .attr('width', (d) -> d.width)
        .style('fill',(d) -> d.color)
        .style('opacity', if initial then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)
      enter.append('text')
        .attr('x', (d) -> d.width / 2)
        .attr('y', -20)
        .attr({dy: '1em', 'text-anchor':'middle'})
        .style({'font-size':'1.3em', opacity: 0})

      columns.transition().duration(options.duration)
        .attr("transform", (d) -> "translate(#{d.x}, #{d.y}) scale(1,1)")
      columns.select('rect').transition().duration(options.duration)
        .attr('width', (d) -> d.width)
        .attr('height', (d) -> d.height)
        .style('opacity',1)
      columns.select('text')
        .text((d) -> y.formattedValue(d.data))
        .transition().duration(options.duration)
        .style('opacity', if host.showLabels() then 1 else 0)

      columns.exit().transition().duration(options.duration)
        .attr('transform', (d) -> "translate(#{_merge.deletedSucc(d).x - barPadding / 2},#{d.y}) scale(0,1)")
        .remove()

      initial = false
      barPaddingOld = barPadding
      barOuterPaddingOld = barOuterPadding

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @getKind('y').domainCalc('max').resetOnNewData(true)
      @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
      _tooltip = host.behavior().tooltip
      _selected = host.behavior().selected
      _tooltip.on "enter.#{_id}", ttEnter

    host.lifeCycle().on 'draw', draw

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
      _scaleList.x.rangePadding(config)
      host.lifeCycle().update()

    attrs.$observe 'labels', (val) ->
      if val is 'false'
        host.showLabels(false)
      else if val is 'true' or val is ""
        host.showLabels(true)
      host.lifeCycle().update()

  }