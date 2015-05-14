###*
  @ngdoc layout
  @name bars
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a bar chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'bars', (wkBar, $log, utils, barConfig, dataLabelFactory, dataManagerFactory, tooltipHelperFactory)->
  sBarCntr = 0
  return {
  restrict: 'A'
  require: '^layout'

  link: (scope, element, attrs, controller) ->
    host = controller.me
    model = wkBar()
    model.layout(host)

    ###*
    @ngdoc attr
      @name bars#padding
      @values true, false, [padding-left, padding-right, outerPadding-left, outerPadding-right]
      @param [padding=true] {boolean | list}
      * Defines the inner and outer padding between the bars.
      *
      * paddings are measured in % of the total bar space occupied, i.e. a padding of 20 implies a bar width of 80%, padding 50 implies column and space have the same size.
      *
      * similar to CSS padding definitions the padding attribute allows for a couple of shortcuts:
      *
      * - n,m implies both, paddings are n, both outerPaddings are m
      * - n implies all paddings are set to n,
      * - n,m, o implies left padding is n, right padding is m, outerPaddings are o
      *
      * Default `padding` is 10, `outerPadding` is 0.
      *
      * Setting `padding="false"` is equivalent to [0,0]
    ###
    attrs.$observe 'padding', (val) ->
      model.rangePadding(val)
      lifeCycle().update()

    ###*
        @ngdoc attr
        @name bars#labels
        @values true, false
        @param [labels=true] {boolean} controls the display of data labels for each of the bars.
    ###
    attrs.$observe 'labels', (val) ->
      if val is 'false'
        host.showDataLabels(false)
      else if val is 'true' or val is ""
        host.showDataLabels('x')
      host.lifeCycle().update()

    ###*
        @ngdoc attr
        @name bars#labelStyle
        @param [labelStyle=font-size:"1.3em"] {object} defined the font style attributes for the labels.
    ###
    attrs.$observe 'labelStyle', (val) ->
      if val
        host.dataLabelStyle(scope.$eval(val))
      host.lifeCycle().update()

    ###*
      @ngdoc attr
      @name bars#labelBackgroundStyle
      @param [labelBackgroundStyle] {object} Sets the backgorund style for attributes on the labels.
    ###
    attrs.$observe 'labelBackgroundStyle', (val) ->
      if val
        host.dataLabelBackgroundStyle(scope.$eval(val))
      host.lifeCycle().update()

    ###*
        @ngdoc attr
        @name bars#barStyle
        @param [barsStyle] {object} - Set the line style for columns lines in the layout
      ###
    attrs.$observe 'barStyle', (val) ->
      if val
        model.barStyle(scope.$eval(val))
  }