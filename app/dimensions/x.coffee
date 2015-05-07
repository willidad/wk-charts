###*
  @ngdoc dimension
  @name x
  @module wk.chart
  @restrict E
  @description

  This dimension defined the horizontal axis of the chart

  @param {string} axis
  Define if a horizontal axis should be displayed Possible values:

###
angular.module('wk.chart').directive 'x', ($log, scale, scaleUtils) ->
  scaleCnt = 0
  return {
    restrict: 'E'
    require: ['x','^chart', '?^layout']
    controller: ($element) ->
      #$log.log 'creating controller scaleX'
      this.me = scale() # for Angular 1.3

    link: (scope, element, attrs, controllers) ->
      $log.log 'x-scope', scope.$id
      me = controllers[0].me
      chart = controllers[1].me
      layout = controllers[2]?.me

      if not (chart or layout)
        $log.error 'scale needs to be contained in a chart or layout directive '
        return

      if attrs.hasOwnProperty('top')
        me.orientation('top')
      else
        me.orientation('bottom')

      name = 'x'
      me.kind(name)
      me.parent(layout or chart)
      me.chart(chart)
      me.scaleType('linear')
      me.resetOnNewData(true)
      me.isHorizontal(true)
      me.register()
      element.addClass(me.id())
      chart.addScale(me, layout)

      #$log.log "linking scale #{name} id:", me.id(), 'layout:', (if layout then layout.id() else '') , 'chart:', chart.id()

      #---Directive Attributes handling --------------------------------------------------------------------------------

      scaleUtils.observeSharedAttributes(attrs, me)
      scaleUtils.observeAxisAttributes(attrs, me, scope)
      scaleUtils.observeLegendAttributes(attrs, me, layout)

  }