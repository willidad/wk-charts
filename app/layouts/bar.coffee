angular.module('wk.chart').directive 'bars', ($log, utils)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me

    _id = "bars#{sBarCntr++}"

    bars = null
    oldLayout = []
    oldKeys = []
    _scaleList = {}
    _selected = undefined

    _merge = utils.mergeData()
    _merge([]).key((d) -> d.key)

    initial = true

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    _tooltip = undefined

    ttEnter = (data) ->
      @headerName = _scaleList.y.axisLabel()
      @headerValue = _scaleList.x.axisLabel()
      @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.x.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color) ->

      if not bars
        bars = @selectAll('.bars')
      #$log.log "rendering stacked-bar"

      layout = data.map((d) -> {data:d, key:y.value(d), x:x.map(d), y:y.map(d), color:color.map(d), height:y.scale().rangeBand(y.value(d))})

      _merge(layout).first({y:options.height}).last({y:y.scale().range()[y.scale().range().length-1], height:0})

      bars = bars.data(layout, (d) -> d.key)

      bars.enter().append('rect')
        .attr('class', 'bar selectable')
        .attr('y', (d) -> if initial then d.y else _merge.addedPred(d).y)
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
        .attr('y', (d) -> _merge.deletedSucc(d).y + _merge.deletedSucc(d).height * 1.05)
        .attr('height', 0)
        .remove()

      initial = false

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @getKind('x').domainCalc('max').resetOnNewData(true)
      @getKind('y').resetOnNewData(true)
      _tooltip = host.behavior().tooltip
      _selected = host.behavior().selected
      _tooltip.on "enter.#{_id}", ttEnter

    host.lifeCycle().on 'draw', draw

  }