###*
  @ngdoc dimension
  @name rangeX
  @module wk.chart
  @restrict E
  @description

  describes how the chart data is translated into horizontal ranges for the chart objects


###
angular.module('wk.chart').directive 'rangeX', ($log, scale, scaleUtils) ->
  scaleCnt = 0
  return {
    restrict: 'E'
    require: ['rangeX','^chart', '?^layout']
    controller: ($element) ->
      #$log.log 'creating controller scaleX'
      this.me = scale() # for Angular 1.3

    link: (scope, element, attrs, controllers) ->
      me = controllers[0].me
      chart = controllers[1].me
      layout = controllers[2]?.me

      if not (chart or layout)
        $log.error 'scale needs to be contained in a chart or layout directive '
        return

      name = 'rangeX'
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

      attrs.$observe 'axis', (val) ->
        if val isnt undefined
          if val isnt 'false'
            if val in ['top', 'bottom']
              me.axisOrient(val).showAxis(true)
            else
              me.axisOrient('bottom').showAxis(true)
          else
            me.showAxis(false).axisOrient(undefined)
          me.update(true)

      scaleUtils.observeAxisAttributes(attrs, me, scope)
      scaleUtils.observeLegendAttributes(attrs, me, layout)
      scaleUtils.observerRangeAttributes(attrs,me)

      attrs.$observe 'rotateTickLabels', (val) ->
        if val and _.isNumber(+val)
          me.rotateTickLabels(+val)
        else
          me.rotateTickLabels(undefined)
        me.update(true)
  }