###*
  @ngdoc dimension
  @name size
  @module wk.chart
  @restrict E
  @description

  describes how the chart data is translated into the size of chart objects


###

angular.module('wk.chart').directive 'size', ($log, scale, scaleUtils) ->
  scaleCnt = 0
  return {
    restrict: 'E'
    require: ['size','^chart', '?^layout']
    controller: ($element) ->
      this.me = scale()
      #$log.log 'creating controller scaleSize'

    link: (scope, element, attrs, controllers) ->
      $log.log 'size-scope', scope.$id
      me = controllers[0].me
      chart = controllers[1].me
      layout = controllers[2]?.me

      if not (chart or layout)
        $log.error 'scale needs to be contained in a chart or layout directive '
        return

      name = 'size'
      me.kind(name)
      me.parent(layout or chart)
      me.chart(chart)
      me.scaleType('linear')
      me.resetOnNewData(true)
      element.addClass(me.id())

      chart.addScale(me, layout)
      me.register()

      #$log.log "linking scale #{name} id:", me.id(), 'layout:', (if layout then layout.id() else '') , 'chart:', chart.id()

      #---Directive Attributes handling --------------------------------------------------------------------------------

      scaleUtils.observeSharedAttributes(attrs, me)
      scaleUtils.observeLegendAttributes(attrs, me, layout, scope)
  }