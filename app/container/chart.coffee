angular.module('wk.chart').directive 'chart', ($log, chart, $filter, container) ->
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

      attrs.$observe 'tooltips', (val) ->
        if val isnt undefined and (val is '' or val is 'true')
          me.showTooltip(true)
        else
          me.showTooltip(false)

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

        watcherRemoveFn = scope.$watch 'data', (val) ->
          if val
            _data = val
            if _filter
              me.lifeCycle().newData($filter('filter')(val, _filter))
            else
              me.lifeCycle().newData(val)
        , deepWatch
  }