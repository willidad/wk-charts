###*
  @ngdoc layout
  @name pie
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a pie chart layout

  @usesDimension size [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'pie', (wkPie, $log, utils) ->
  return {
  restrict: 'A'
  require: '^layout'
  link: (scope, element, attrs, controller) ->
    layout = controller.me
    model = wkPie()
    model.layout(layout)

    #-------------------------------------------------------------------------------------------------------------------

    ###*
        @ngdoc attr
        @name pie#labels
        @values true, false
        @param [labels=true] {boolean} controls the display of data labels for each of the pie segments.
    ###
    attrs.$observe 'labels', (val) ->
      if val is 'false'
        model.labels(false) 
      else if val is 'true' or val is ""
        model.labels(true)
      layout.lifeCycle().update()

    attrs.$observe 'donat' , (val) ->
      if val is 'false'
        model.donat(false)
      else if val is 'true' or val is ""
        model.donat(true)
      layout.lifeCycle().update()

    ###*
      @ngdoc attr
      @name pie#labelStyle
      @param [labelStyle=font-size:"1.3em"] {object} defined the font style attributes for the labels.
    ###
    attrs.$observe 'labelStyle', (val) ->
      if val
        layout.dataLabelStyle(scope.$eval(val))
      layout.lifeCycle().update()

    ###*
      @ngdoc attr
      @name pie#pieStyle
      @param [pieStyle] {object} - Set the pie style for columns lines in the layout
    ###
    attrs.$observe 'pieStyle', (val) ->
      if val
        layout.pieStyle(scope.$eval(val))

  }
