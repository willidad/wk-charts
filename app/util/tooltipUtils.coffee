angular.module('wk.chart').service 'tooltipUtils', ($log) ->

  this.styleTooltipMarker = (selection, idx) ->
    selection.append('circle')
    .attr('r', 9)
    .style('fill', (d)-> if idx then d[idx].color else d.color)
    .style('fill-opacity', 0.3)
    .style('pointer-events', 'none')

    selection.append('circle')
    .attr('r', 4)
    .style('fill', (d)-> if idx then d[idx].color else d.color)
    .style('fill-opacity', 0.6)
    .style('stroke', 'white')
    .style('pointer-events','none')

  return this