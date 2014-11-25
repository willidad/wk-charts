angular.module('wk.chart').directive 'column', ($log, utils, barConfig)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "simpleColumn#{sBarCntr++}"

    bars = null
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

      if not bars
        bars = @selectAll('.wk-chart-bars')
      #$log.log "rendering stacked-bar"

      barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding
      barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

      layout = data.map((d) -> {data:d, key:x.value(d), x:x.map(d), y:y.map(d), color:color.map(d), width:x.scale().rangeBand(x.value(d))})

      _merge(layout).first({x:barPaddingOld / 2 - barOuterPadding}).last({x:options.width + barPadding/2 - barOuterPaddingOld, width: 0})

      bars = bars.data(layout, (d) -> d.key)

      bars.enter().append('rect')
        .attr('class', 'wk-chart-bar wk-chart-selectable')
        .attr('x', (d) -> if initial then d.x else _merge.addedPred(d).x  + _merge.addedPred(d).width  + barPaddingOld / 2)
        .attr('width', (d) -> if initial then d.width else 0)
        .style('opacity', if initial then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)

      bars.style('fill', (d) -> d.color).transition().duration(options.duration)
        .attr('y', (d) -> Math.min(y.scale()(0), d.y))
        .attr('width', (d) -> d.width)
        .attr('height', (d) -> Math.abs(y.scale()(0) - d.y))
        .attr('x', (d) -> d.x)
        .style('opacity', 1)

      bars.exit()
        .transition().duration(options.duration)
        .attr('x', (d) -> _merge.deletedSucc(d).x - barPadding / 2)
        .attr('width', 0)
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

  }