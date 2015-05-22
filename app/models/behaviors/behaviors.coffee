angular.module('wk.chart').factory 'behavior', ($log, $window, behaviorTooltip, behaviorSelect, behaviorAxisBrush) ->

  behavior = () ->

    _tooltip = behaviorTooltip()
    _axisBrush = behaviorAxisBrush()
    _selection = behaviorSelect()

    chartArea = (chartArea) ->
      _axisBrush.area(chartArea)
      _tooltip.area(chartArea)
      _selection.area(chartArea)

    container = (container, axisSizing, width, height) ->
      _axisBrush.container(container, axisSizing, width, height)
      _axisBrush.tooltip(_tooltip)
      _tooltip.container(container)

    chart = (chart) ->
      _axisBrush.chart(chart)
      _tooltip.chart(chart)

    return {tooltip:_tooltip, selected:_selection, brush: _axisBrush, chartArea:chartArea, container:container, chart:chart}
  return behavior