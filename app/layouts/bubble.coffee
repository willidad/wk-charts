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
          @layers.push({name: scale.axisLabel(), value: scale.formattedValue(data), color: if sName is 'color' then {'background-color':scale.map(data)} else undefined})

      #--- Draw --------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color, size) ->

        bubbles = @selectAll('.wk-chart-bubble').data(data, (d) -> color.value(d))
        bubbles.enter().append('circle').attr('class','wk-chart-bubble wk-chart-selectable')
          .style('opacity', 0)
          .call(_tooltip.tooltip)
          .call(_selected)
        bubbles
          .style('fill', (d) -> color.map(d))
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

      layout.lifeCycle().on 'draw', draw

  }

  #TODO verify and test custom tooltips behavior