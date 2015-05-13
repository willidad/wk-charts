###*
  @ngdoc layout
  @name barClustered
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a clustered bar layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]


###
angular.module('wk.chart').directive 'barClustered', (wkBarClustered, $log, utils, barConfig, dataManagerFactory, tooltipHelperFactory)->

  clusteredBarCntr = 0
  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me
      model = wkBarClustered()
      model.layout(host)

      ###*
        @ngdoc attr
        @name barClustered#padding
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
        host.lifeCycle().update()

      ###*
        @ngdoc attr
        @name barClustered#barsStyle
        @param [barStyle] {object} - Set the line style for columns lines in the layout
      ###
      attrs.$observe 'barStyle', (val) ->
        if val
          model.barStyle(scope.$eval(val))
  }

