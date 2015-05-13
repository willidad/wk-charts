###*
  @ngdoc dimension
  @name y
  @module wk.chart
  @restrict E
  @description

  This dimension defined the vertical axis of the chart

  @param {string} axis
  Define if a vertical axis should be displayed Possible values:

###
angular.module('wk.chart').directive 'y', ($log, scale, legend, scaleUtils) ->
  scaleCnt = 0
  return {
    restrict: 'E'
    require: ['y','^chart', '?^layout']
    controller: ($element) ->
      this.me = scale()
      #$log.log 'creating controller scaleY'

    link: (scope, element, attrs, controllers) ->
      $log.log 'color-scope', scope.$id
      me = controllers[0].me
      chart = controllers[1].me
      layout = controllers[2]?.me

      if not (chart or layout)
        $log.error 'scale needs to be contained in a chart or layout directive '
        return

      if attrs.hasOwnProperty('right')
        me.orientation('right')
      else
        me.orientation('left')

      name = 'y'
      me.kind(name)
      me.parent(layout or chart)
      me.chart(chart)
      me.scaleType('linear')
      me.isVertical(true)
      me.resetOnNewData(true)
      element.addClass(me.id())

      chart.addScale(me, layout)
      me.register()
      #$log.log "linking scale #{name} id:", me.id(), 'layout:', (if layout then layout.id() else '') , 'chart:', chart.id()

      #---Directive Attributes handling --------------------------------------------------------------------------------

      scaleUtils.observeSharedAttributes(attrs, me)
      scaleUtils.observeAxisAttributes(attrs, me, scope)
      scaleUtils.observeLegendAttributes(attrs, me, layout)
  }