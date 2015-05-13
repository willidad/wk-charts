###*
  @ngdoc layout
  @name bubble
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a bubble chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear]
  @usesDimension color [type=category20]
  @usesDimension size [type=linear]
###
angular.module('wk.chart').directive 'bubble', (wkBubble, $log, utils) ->
  bubbleCntr = 0
  return {
    restrict: 'A'
    require: 'layout'

    link: (scope, element, attrs, controller) ->
      #$log.debug 'bubbleChart linked'
      layout = controller.me
      model = wkBubble()
      model.layout(layout)
  }

  #TODO verify and test custom tooltips behavior