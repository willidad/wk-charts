###*
  @ngdoc behavior
  @name tooltips
  @element chart
  @module wk.chart
  @restrict A
  @description
  enables the display of tooltips. See  the {@link guide/tooltips tooltips section} in the guide for more details
###
angular.module('wk.chart').directive 'tooltips', ($log, behavior) ->

  return {
    restrict: 'A'
    require: 'chart'
    link: (scope, element, attrs, chartCtrl) ->
      chart = chartCtrl.me

      ###*
        @ngdoc attr
        @name tooltips#tooltips
        @values true, false, path/to/custom-template.html
        @param tooltips {boolean|url} - enable / disable tooltips, resp. supply a custom tooltip template url.
        If no template url is supplied, a (configurable) default template is used (see {@link wkChartTemplatesProvider here} for how to configure the default template),
      ###
      attrs.$observe 'tooltips', (val) ->
        chart.toolTipTemplate('')
        if val isnt undefined and (val is '' or val is 'true')
          chart.showTooltip(true)
        else if val.length > 0 and val isnt 'false'
          chart.toolTipTemplate(val)
          chart.showTooltip(true)
        else chart.showTooltip(false)

      attrs.$observe 'tooltipStyle', (val) ->
        if val
          chart.tooltipStyle(scope.$eval(val))
  }

