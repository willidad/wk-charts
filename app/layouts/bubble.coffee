###*
  @ngdoc layout
  @name bubble
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a bubble chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear]
  @usesDimension color [type=category20]
  @usesDimension size [type=linear]
###
angular.module('wk.chart').directive 'bubble', ($log, utils) ->
  bubbleCntr = 0
  return {
    restrict: 'A'
    require: 'layout'

    link: (scope, element, attrs, controller) ->
      #$log.debug 'bubbleChart linked'
      layout = controller.me
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

      layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color', 'size'])
        @getKind('y').resetOnNewData(true)
        @getKind('x').resetOnNewData(true)
        _tooltip = layout.behavior().tooltip
        _selected = layout.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      layout.lifeCycle().on "drawChart.#{_id}", draw

      layout.lifeCycle().on "destroy.#{_id}", ->
        layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null

  }

  #TODO verify and test custom tooltips behavior