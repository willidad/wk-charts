###*
  @ngdoc layout
  @name scatter
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a icon chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear]
  @usesDimension color [type=category20]
  @usesDimension size [type=linear]
  @usesDimension shape [type=ordinal]
###
angular.module('wk.chart').directive 'scatter', ($log, utils) ->
  scatterCnt = 0
  return {
    restrict: 'A'
    require: '^layout'
    link: (scope, element, attrs, controller) ->
      layout = controller.me
      _tooltip = undefined
      _selected = undefined
      _id = 'scatter' + scatterCnt++
      _scaleList = []

      ttEnter = (data) ->
        for sName, scale of _scaleList
          @layers.push({
            name: scale.axisLabel(),
            value: scale.formattedValue(data),
            color: if sName is 'color' then {'background-color':scale.map(data)} else undefined,
            path: if sName is 'shape' then d3.svg.symbol().type(scale.map(data)).size(80)() else undefined
            class: if sName is 'shape' then 'wk-chart-tt-svg-shape' else ''
          })

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

      layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color', 'size', 'shape'])
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = layout.behavior().tooltip
        _selected = layout.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      layout.lifeCycle().on 'drawChart', draw
  }

#TODO verify behavior with custom tooltips
#TODO Implement in new demo app