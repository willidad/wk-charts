angular.module('wk.chart').factory 'wkScatter', ($log, utils) ->
  scatterCnt = 0
  wkScatter = ()->
    me = ()->
    _layout = undefined
    _tooltip = undefined
    _selected = undefined
    _id = 'scatter' + scatterCnt++
    _scaleList = []

    ttEnter = (data) ->
      for sName, scale of _scaleList
        @layers[scale.axisLabel()] =
          {
            value: scale.formattedValue(data),
            color: if sName is 'color' then {fill:(if typeof scale.map(data) is 'string' then scale.map(data) else scale.map(data).color)} else {fill:'none'},
            path: if sName is 'shape' then d3.svg.symbol().type(scale.map(data)).size(80)() else undefined
            class: if sName is 'shape' then 'wk-chart-tt-svg-shape' else ''
          }

    #-----------------------------------------------------------------------------------------------------------------

    initialOpacity = 0



    draw = (data, options, x, y, color, size, shape) ->
      #$log.debug 'drawing scatter chart'

      points = @selectAll('.wk-chart-shape')
        .data(data,(d,i) -> i)
      points.enter()
        .append('path').attr('class', 'wk-chart-shape wk-chart-selectable')
          .attr('transform', (d)-> "translate(#{x.map(d)},#{y.map(d)})")
          .style('opacity', initialOpacity)
          .call(_tooltip.tooltip)
          .call(_selected)
      points
        .style('fill', (d) -> color.map (d))
        .attr('d', d3.svg.symbol().type((d) -> shape.map(d)).size((d) -> size.map(d) * size.map(d)))
        .transition().duration(options.duration)
          .attr('transform', (d)-> "translate(#{x.map(d)},#{y.map(d)})")
          .style('opacity', 1)

      initialOpacity = 1

      points.exit().remove()

    #-----------------------------------------------------------------------------------------------------------------

    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color', 'size', 'shape'])
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = _layout.behavior().tooltip
        _selected = _layout.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      _layout.lifeCycle().on "drawChart.#{_id}", draw

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me
    return me
  return wkScatter