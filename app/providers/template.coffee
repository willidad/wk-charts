###*
  @ngdoc provider
  @module wk.chart
  @name wkChartTemplatesProvider
  @description
  used to register a custom tooltip or legend default template and overwrite the default system templates.

###
angular.module('wk.chart').provider 'wkChartTemplates', () ->

  tooltipTemplateUrl = 'templates/toolTip.html'
  legendTemplateUrl = 'templates/legend.html'
  ###*
    @ngdoc method
    @name wkChartTemplatesProvider#setTooltipTemplate
    @param url {string} the url of the template file
  ###
  this.setTooltipTemplate = (url)  ->
    tooltipTemplateUrl = url

  ###*
      @ngdoc method
      @name wkChartTemplatesProvider#setLegendTemplate
      @param url {string} the url of the template file
    ###
  this.setLegendTemplate = (url) ->
    legendTemplateUrl = url

  ###*
    @ngdoc service
    @module wk.chart
    @name wkChartTemplates
    @description
    provides the default tooltip and legend template.
  ###
  this.$get = ['$log', '$templateCache',($log, $templateCache) ->
    return {
      ###*
        @ngdoc method
        @name wkChartTemplates#tooltipTemplate
        @returns {string} the tooltips template
      ###
      tooltipTemplate: () -> $templateCache.get(tooltipTemplateUrl)

      ###*
        @ngdoc method
        @name wkChartTemplates#legendTemplate
        @returns {string} the legends template
      ###
      legendTemplate: () -> $templateCache.get(legendTemplateUrl)}
  ]

  return this
