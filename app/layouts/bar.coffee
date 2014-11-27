angular.module('wk.chart').directive 'bars', ($log, utils, barConfig)->
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

      bars.enter().append('rect')
        .attr('class', 'wk-chart-bar wk-chart-selectable')
        .attr('y', (d) -> if initial then d.y else _merge.addedPred(d).y - barPaddingOld / 2)
        .attr('height', (d) -> if initial then d.height else 0)
        .style('opacity', if initial then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)

      bars.style('fill', (d) -> d.color).transition().duration(options.duration)
        .attr('x', (d) -> Math.min(x.scale()(0), d.x))
        .attr('height', (d) -> d.height)
        .attr('width', (d) -> Math.abs(x.scale()(0) - d.x))
        .attr('y', (d) -> d.y)
        .style('opacity', 1)

      bars.exit()
        .transition().duration(options.duration)
        .attr('y', (d) -> _merge.deletedSucc(d).y + _merge.deletedSucc(d).height + barPadding / 2)
        .attr('height', 0)
        .remove()

      initial = false

      barPaddingOld = barPadding
      barOuterPaddingOld = barOuterPadding

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @getKind('x').domainCalc('max').resetOnNewData(true)
      @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
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
      _scaleList.y.rangePadding(config)
      host.lifeCycle().update()
  }

#TODO implement external brushing optimizations