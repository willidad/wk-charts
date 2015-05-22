angular.module('wk.chart').factory 'behavior', ($log, $window, behaviorTooltip, behaviorSelect, behaviorBrush) ->

  behavior = () ->

    _tooltip = behaviorTooltip()
    _brush = behaviorBrush()
    _selection = behaviorSelect()

    chartArea = (chartArea) ->
      _brush.area(chartArea)
      _tooltip.area(chartArea)
      _selection.area(chartArea)

    container = (container, axisSizing, width, height) ->
      _brush.container(container, axisSizing, width, height)
      _brush.tooltip(_tooltip)
      _tooltip.container(container)

    chart = (chart) ->
      _brush.chart(chart)
      _tooltip.chart(chart)

    return {tooltip:_tooltip, selected:_selection, brush: _brush, chartArea:chartArea, container:container, chart:chart}
  return behavior