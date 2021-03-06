###*
  @ngdoc behavior
  @name brush
  @module wk.chart
  @restrict A
  @element x, y or layout
  @description

  enable brushing behavior
###

###*
  @ngdoc attr
  @name brush#brush
  @values none
  @param brush {string} Brush name
  Brush will be published under this name for consumption by other layouts
###
angular.module('wk.chart').directive 'brush', ($log, behavior) ->
  brushId = 0
  return {
    restrict: 'A'
    require: ['^chart', '^?layout', '?x', '?y']
    scope:
      ###*
        @ngdoc attr
        @name brush#brushExtent
        @param brushExtent {array} Contains the data array index of the start and end item of teh brush area. Updates when brush is moved and can be set to position the brush. An empty array ´[]´ resets the brush to empty.
      ###
      brushExtent: '='

      ###*
        @ngdoc attr
        @name brush#selectedValues
        @param selectedValues {array} Contains array of the axis values of the selected the brush  area. Is undefined if brush is empty or is xy (layout) brushes
      ###
      selectedValues: '='

      ###*
        @ngdoc attr
        @name brush#selectedDomain
        @param selectedDomain {array} Contains an array of data objects for the selected brush area.
      ###
      selectedDomain: '='

      ###*
        @ngdoc attr
        @name brush#selectedDomainChange
        @param selectedDomainChange {expression} expression to evaluate upon a change of the brushes selected domain. The selected domain is available as ´domain´
      ###
      selectedDomainChange: '&'

      ###*
        @ngdoc attr
        @name brush#brushStart
        @param brushStart {expression} expression to evaluate upon a start of brushing. Is fired on 'mousedown'.
      ###
      brushStart: '&'

      ###*
        @ngdoc attr
        @name brush#brushEnd
        @param brushEnd {expression} expression to evaluate upon a end of brushing. is fired on 'mouseup'. The selected domain is available as ´domain´
      ###
      brushEnd: '&'

    link:(scope, element, attrs, controllers) ->
      $log.log 'brush-scope', scope.$id
      _id = brushId++
      chart = controllers[0].me
      layout = controllers[1]?.me
      x = controllers[2]?.me
      y = controllers[3]?.me
      xScale = undefined
      yScale = undefined
      _selectables = undefined
      _brushAreaSelection = undefined
      _isAreaBrush = not x and not y
      _brushGroup = undefined

      $log.log 'creating brush scope', scope.$id

      brush = chart.behavior().brush;

      host = chart or layout

      brush.x(x).y(y)
      #brush.active(false)

      scope.$watch 'brushExtent', (newVal) ->
        if _.isArray(newVal) and newVal.length is 0 # and _.isArray(oldVal) and oldVal.length isnt 0
          brush.clearBrush()
        else
          brush.setExtent(newVal)

      brush.events().on "brushStart.#{_id}", () ->
        if attrs.brushStart
          scope.brushStart()
          _.defer(() -> scope.$apply())

      brush.events().on "brush.#{_id}", (idxRange, valueRange, domain) ->
        if attrs.selectedValues
          scope.selectedValues = valueRange
        if attrs.selectedDomain
          scope.selectedDomain = domain
        scope.selectedDomainChange({domain:domain})
        _.defer(() -> scope.$apply())

      brush.events().on "brushEnd.#{_id}", (idxRange, valueRange, domain) ->
        if attrs.brushEnd
          scope.brushEnd({domain:domain})
          _.defer(() -> scope.$apply())

      chart.lifeCycle().on 'drawChart.brush', (data) ->
        brush.data(data)

      host.lifeCycle().on 'destroy.brush', () ->
        #scope.$apply()
        brush.events().on ".#{_id}", null #deregister handlers
        chart.lifeCycle().on ".#{_id}", null
        scope.$destroy()
        $log.log 'destroying brush scope', scope.$id

  }