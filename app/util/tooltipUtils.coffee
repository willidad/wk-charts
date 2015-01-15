angular.module('wk.chart').service 'tooltipUtils', ($log) ->

  this.createTooltipMarkers = (selection, idx) ->
    hasIdx = arguments.length is 2
    selection.append('circle').attr('class', 'wk-charts-tt-marker')
    .attr('r', 9)
    .style('fill', (d)-> if hasIdx then d[idx].color else d.color)
    .style('fill-opacity', 0.3)
    .style('stroke', (d)-> if hasIdx then d[idx].color else d.color)
    .style('pointer-events', 'none')

    selection.append('circle')
    .attr('r', 4)
    .style('fill', (d)-> if hasIdx then d[idx].color else d.color)
    .style('fill-opacity', 0.6)
    .style('stroke', 'white')
    .style('pointer-events','none')

  return this