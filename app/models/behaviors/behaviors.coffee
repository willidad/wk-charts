angular.module('wk.chart').factory 'behavior', ($log, $window, behaviorTooltip, behaviorBrush, behaviorSelect) ->

  behavior = () ->

    _tooltip = behaviorTooltip()
    _brush = behaviorBrush()
    _selection = behaviorSelect()
    _brush.tooltip(_tooltip)

    chartArea = (chartArea) ->
      _brush.area(chartArea)
      _tooltip.area(chartArea)
      _selection.area(chartArea)

    container = (container) ->
      _brush.container(container)

      _tooltip.container(container)

    chart = (chart) ->
      _brush.chart(chart)
      _tooltip.chart(chart)

    return {tooltip:_tooltip, brush:_brush, selected:_selection, chartArea:chartArea, container:container, chart:chart}
  return behavior