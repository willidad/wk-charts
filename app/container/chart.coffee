###*
  @ngdoc container
  @name chart
  @module wk.chart
  @restrict E
  @description

  chart is the container directive for all charts.
  @param {array} data - Data to be graphed, {@link guide/data ...more}
  @param {boolean} [deep-watch=false]
  @param {string} [filter] - filters the data using the angular filter function
  @param {string} [title] - The chart title
  @param {string} [subtitle] - The chart subtitle
  @param {number} [animation-duration=300] - animation duration in milliseconds
###
angular.module('wk.chart').directive 'chart', ($log, chart, $filter) ->
  chartCnt = 0
  return {
    restrict: 'E'
    require: 'chart'
    scope:
      data: '='
      filter: '='
    controller: () ->
      this.me = chart()

    link: (scope, element, attrs, controller) ->
      me = controller.me

      deepWatch = false
      watcherRemoveFn = undefined
      element.addClass(me.id())

      _data = undefined
      _filter = undefined

      me.container().element(element[0])

      me.lifeCycle().configure()

      me.lifeCycle().on 'scopeApply', () ->
        scope.$apply()
      ###
      attrs.$observe 'tooltips', (val) ->
        me.toolTipTemplate('')
        if val isnt undefined and (val is '' or val is 'true')
          me.showTooltip(true)
        else if val.length > 0 and val isnt 'false'
          me.toolTipTemplate(val)
          me.showTooltip(true)
        else me.showToolTip(false)
      ###
      attrs.$observe 'animationDuration', (val) ->
        if val and _.isNumber(+val) and +val >= 0
          me.animationDuration(val)

      attrs.$observe 'title', (val) ->
        if val
          me.title(val)
        else
          me.title(undefined)

      attrs.$observe 'subtitle', (val) ->
        if val
          me.subTitle(val)
        else
          me.subTitle(undefined)

      scope.$watch 'filter', (val) ->
        if val
          _filter = val # scope.$eval(val)
          if _data
            me.lifeCycle().newData($filter('filter')(_data, _filter))
        else
          _filter = undefined
          if _data
            me.lifeCycle().newData(_data)

      attrs.$observe 'deepWatch', (val) ->
        if val isnt undefined and val isnt 'false'
          deepWatch = true
        else
          deepWatch = false
        if watcherRemoveFn
          watcherRemoveFn()
        watcherRemoveFn = scope.$watch 'data', dataWatchFn, deepWatch

      dataWatchFn = (val) ->
        if val
          _data = val
          if _.isArray(_data) and _data.length is 0 then return
          if _filter
            me.lifeCycle().newData($filter('filter')(val, _filter))
          else
            me.lifeCycle().newData(val)

      watcherRemoveFn = scope.$watch 'data', dataWatchFn, deepWatch

      # cleanup when destroyed

      element.on '$destroy', () ->
        if watcherRemoveFn
          watcherRemoveFn()
        $log.log 'Destroying chart'
  }