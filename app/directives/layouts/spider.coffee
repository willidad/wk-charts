###*
  @ngdoc layout
  @name spider
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a spider chart layout

  @usesDimension x [type=ordinal] The horizontal dimension
  @usesDimension y [type=linear, domainRange=max]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'spider', (wkSpider, $log, utils) ->
  spiderCntr = 0
  return {
    restrict: 'A'
    require: 'layout'

    link: (scope, element, attrs, controller) ->
      layout = controller.me
      #$log.debug 'bubbleChart linked'
      model = wkSpider()
      model.layout(layout)


  }

#TODO verify behavior with custom tooltips
#TODO fix 'tooltip attribute list too long' problem
#TODO add enter / exit animation behavior
#TODO Implement data labels
#TODO implement and test object selection