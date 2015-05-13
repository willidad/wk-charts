angular.module('wk.chart').directive 'printButton', ($log) ->

  return {
    require:'chart'
    restrict: 'A'
    link:(scope, element, attrs, controller) ->
      chart = controller.me

      draw = () ->
        _containerDiv = d3.select(chart.container().element()).select('div.wk-chart')
        _containerDiv.append('button')
          .attr('class','wk-chart-print-button')
          .style({position:'absolute', top:0, right:0})
          .text('Print')
          .on 'click', ()->
            $log.log 'Clicked Print Button'

            svg  = _containerDiv.select('svg.wk-chart').node()
            saveSvgAsPng(svg, 'print.png',5)


      chart.lifeCycle().on 'drawChart.print', draw
  }