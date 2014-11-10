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

    #-------------------------------------------------------------------------------------------------------------------

    getXByKey = (key, layout) ->
      for l in layout
        if l.key is key
          return l

    getPredY = (key, layout) ->
      pred = getXByKey(key, layout)
      if pred then pred.y + pred.height * 1.05 else 0

    getSuccY = (key, layout) ->
      succ = getXByKey(key, layout)
      if succ then succ.y - succ.height * 0.05 else layout[layout.length - 1].x + layout[layout.length - 1].height * 1.05


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

      layout = data.map((d) -> {data:d, key:y.value(d), value:y.value(d), x:x.map(d), y:y.map(d), color:color.map(d), height:y.scale().rangeBand(y.value(d))})
      newKeys = layout.map((d) -> d.key)

      deletedSucc = utils.diff(oldKeys, newKeys, 1)
      addedPred = utils.diff(newKeys, oldKeys, -1)

      bars = bars.data(layout, (d) -> d.key)

      if oldLayout.length is 0
        bars.enter().append('rect')
          .attr('class', 'bar selectable')
          .style('opacity', 0)
          .call(_tooltip.tooltip)
          .call(_selected)
      else
        bars.enter().append('rect')
          .attr('class', 'bar selectable')
          .attr('y', (d) -> getPredY(addedPred[d.key], oldLayout))
          .attr('width', 0)
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
        .attr('y', (d) -> getSuccY(deletedSucc[d.key], layout))
        .attr('width', 0)
        .remove()

      oldLayout = layout
      oldKeys = newKeys

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