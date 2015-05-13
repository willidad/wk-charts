angular.module('wk.chart').factory 'wkBubble', ($log, utils) ->
  bubbleCntr = 0
  wkBubble = () ->
    me = () ->

    _layout = undefined
    _tooltip = undefined
    _scaleList = {}
    _id = 'bubble' + bubbleCntr++
    _selected = undefined

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    ttEnter = (data) ->
      for sName, scale of _scaleList
        @layers[scale.axisLabel()] = {value: scale.formattedValue(data), color: if sName is 'color' then {fill:(if typeof scale.map(data) is 'string' then scale.map(data) else scale.map(data).color)} else {fill:'none'}}

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color, size) ->

      setStyle = (d) ->
        elem = d3.select(this)
        #elem.style(_areaStyle)
        style = color.map(d)
        if typeof style is 'string'
          elem.style({fill:style, stroke:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      bubbles = @selectAll('.wk-chart-bubble').data(data, (d) -> color.value(d))
      bubbles.enter().append('circle').attr('class','wk-chart-bubble wk-chart-selectable')
        .style('opacity', 0)
        .call(_tooltip.tooltip)
        .call(_selected)
      bubbles
        .each(setStyle)
        .transition().duration(options.duration)
          .attr({
            r:  (d) -> size.map(d)
            cx: (d) -> x.map(d)
            cy: (d) -> y.map(d)
          })
          .style('opacity', 1)
      bubbles.exit()
        .transition().duration(options.duration)
          .style('opacity',0).remove()

    #--- Configuration and registration ------------------------------------------------------------------------------

    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color', 'size'])
        @getKind('y').resetOnNewData(true)
        @getKind('x').resetOnNewData(true)
        _tooltip = _layout.behavior().tooltip
        _selected = _layout.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      _layout.lifeCycle().on "drawChart.#{_id}", draw

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me

    return me
  return wkBubble