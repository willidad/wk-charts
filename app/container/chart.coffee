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
  @param {string} [header] - The chart title
  @param {object} [headerStyle=font-size:"1.8em"]
  @param {string} [subHeader] - The chart subtitle
  @param {object} [subHeaderStyle=font-size:"1.3em"]
  @param {boolean} [edit=false] - sets chart to edit mode if true
  @param {function} [edit-selection] - called when and editable chart element is clicked in edit mode.
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
      editSelected: '&'
    controller: ($scope) ->
      this.me = chart()
      this.me.scope($scope)

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

      me.lifeCycle().on 'editSelected', (selection, object) ->
        scope.editSelected({selected:selection, object:object})
        scope.$apply()

      attrs.$observe 'animationDuration', (val) ->
        if val and _.isNumber(+val) and +val >= 0
          me.animationDuration(val)

      attrs.$observe 'header', (val) ->
        if val
          me.title(val)
        else
          me.title(undefined)

      attrs.$observe 'headerStyle', (val) ->
        if val
          me.titleStyle(scope.$eval(val))

      attrs.$observe 'subHeader', (val) ->
        if val
          me.subTitle(val)
        else
          me.subTitle(undefined)

      attrs.$observe 'subHeaderStyle', (val) ->
        if val
          me.subTitleStyle(scope.$eval(val))

      attrs.$observe 'backgroundStyle', (val) ->
        if val
          me.backgroundStyle(scope.$eval(val))

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

      attrs.$observe 'edit', (val) ->
        if val is '' or val is 'true'
          me.editMode(true)
        else
          me.editMode(false)

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

      scope.$on '$destroy', () ->
        'destroying chart scope'

      element.on '$destroy', () ->
        if watcherRemoveFn
          watcherRemoveFn()
        $log.log 'Destroying chart'
        me.lifeCycle().destroy()
        scope.$destroy()
  }