###*
  @ngdoc layout
  @name columnClustered
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a clustered Column layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]


###
angular.module('wk.chart').directive 'columnClustered', (wkColumnClustered, $log, utils, barConfig, dataManagerFactory, tooltipHelperFactory)->

  clusteredColumnCntr = 0
  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me
      model = wkColumnClustered()
      model.layout(host)

      ###*
        @ngdoc attr
        @name columnClustered#padding
        @values true, false, [padding-left, padding-right, outerPadding-left, outerPadding-right]
        @param [padding=true] {boolean | list}
        * Defines the inner and outer padding between the columns.
        *
        * paddings are measured in % of the total bar space occupied, i.e. a padding of 20 implies a column width of 80%, padding 50 implies column and space have the same size.
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
        @name columnClustered#columnStyle
        @param [columnStyle] {object} - Set the line style for columns lines in the layout
      ###
      attrs.$observe 'columnStyle', (val) ->
        if val
          model.columnStyle(scope.$eval(val))
  }

