###*
  @ngdoc dimension
  @name color
  @module wk.chart
  @restrict E
  @description

  describes how the chart data is translated into colors for chart objects


###
angular.module('wk.chart').directive 'color', ($log, scale, legend, scaleUtils) ->
  scaleCnt = 0
  return {
    restrict: 'E'
    require: ['color','^chart', '?^layout']
    controller: ($element) ->
      this.me = scale()
      #$log.log 'creating controller scaleColor'
    scope:
      mapFunction: '='

    link: (scope, element, attrs, controllers) ->
      me = controllers[0].me
      chart = controllers[1].me
      layout = controllers[2]?.me
      l = undefined

      if not (chart or layout)
        $log.error 'scale needs to be contained in a chart or layout directive '
        return

      name = 'color'
      me.kind(name)
      me.parent(layout or chart)
      me.chart(chart)
      me.scaleType('category20')
      element.addClass(me.id())

      chart.addScale(me, layout)
      me.register()

      #$log.log "linking scale #{name} id:", me.id(), 'layout:', (if layout then layout.id() else '') , 'chart:', chart.id()

      #---Directive Attributes handling --------------------------------------------------------------------------------

      scaleUtils.observeSharedAttributes(attrs, me)
      scaleUtils.observeLegendAttributes(attrs, me, layout)

      scope.$watch 'mapFunction', (fn) ->
        if fn and _.isFunction(fn)
          me.scaleMapFn(fn)

  }