angular.module('wk.chart').directive 'column', ($log, utils)->
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

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    _tooltip = undefined

    ttEnter = (data) ->
      @headerName = _scaleList.x.axisLabel()
      @headerValue = _scaleList.y.axisLabel()
      @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.y.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color) ->

      if not bars
        bars = @selectAll('.bars')
      #$log.log "rendering stacked-bar"

      layout = data.map((d) -> {data:d, key:x.value(d), x:x.map(d), y:y.map(d), color:color.map(d), width:x.scale().rangeBand(x.value(d))})

      _merge(layout).first({x:0}).last({x:options.width, width:0})

      bars = bars.data(layout, (d) -> d.key)

      bars.enter().append('rect')
        .attr('class', 'bar selectable')
        .attr('x', (d) -> if initial then d.x else _merge.addedPred(d).x  + _merge.addedPred(d).width * 1.05)
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
        .attr('x', (d) -> _merge.deletedSucc(d).x)
        .attr('width', 0)
        .remove()

      initial = false

    #--- Configuration and registration ------------------------------------------------------------------------------

    host.lifeCycle().on 'configure', ->
      _scaleList = @getScales(['x', 'y', 'color'])
      @getKind('y').domainCalc('max').resetOnNewData(true)
      @getKind('x').resetOnNewData(true)
      _tooltip = host.behavior().tooltip
      _selected = host.behavior().selected
      _tooltip.on "enter.#{_id}", ttEnter

    host.lifeCycle().on 'draw', draw

  }