###*
  @ngdoc behavior
  @name brush
  @module wk.chart
  @restrict A
  @element x, y, range-x, range-y or layout
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
angular.module('wk.chart').directive 'brush', ($log, selectionSharing, behavior) ->
  return {
    restrict: 'A'
    require: ['^chart', '^layout', '?x', '?y','?rangeX', '?rangeY']
    scope:
      ###*
        @ngdoc attr
        @name brush#brushExtent
        @param brushExtent {array} Contains the start and end index into the data array for the brushed axis. Is undefined if brush is empty or is a xy (layout) brush
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

      ###*
        @ngdoc attr
        @name brush#clearBrush
        @param clearBrush {function} assigns a function that clears the brush selection when called to the bound scope variable.
      ###
      clearBrush: "="

    link:(scope, element, attrs, controllers) ->
      chart = controllers[0].me
      layout = controllers[1]?.me
      x = controllers[2]?.me
      y = controllers[3]?.me
      rangeX = controllers[4]?.me
      rangeY = controllers[5]?.me
      xScale = undefined
      yScale = undefined
      _selectables = undefined
      _brushAreaSelection = undefined
      _isAreaBrush = not x and not y
      _brushGroup = undefined

      brush = chart.behavior().brush

      if not x and not y and not rangeX and not rangeY
        #layout brush, get x and y from layout scales
        scales = layout.scales().getScales(['x', 'y'])
        brush.x(scales.x)
        brush.y(scales.y)
      else
        brush.x(x or rangeX)
        brush.y(y or rangeY)
      brush.active(true)

      scope.$watch 'clearBrush' , (val) ->
        scope.clearBrush = brush.clearBrush

      attrs.$observe 'brush', (val) ->
        if _.isString(val) and val.length > 0
          brush.brushGroup(val)
        else
          brush.brushGroup(undefined)

      brush.events().on 'brushStart', () ->
        scope.brushStart()
        scope.$apply()

      brush.events().on 'brush', (idxRange, valueRange, domain) ->
        if attrs.brushExtent
          scope.brushExtent = idxRange
        if attrs.selectedValues
          scope.selectedValues = valueRange
        if attrs.selectedDomain
          scope.selectedDomain = domain
        scope.selectedDomainChange({domain:domain})
        scope.$apply()

      brush.events().on 'brushEnd', (idxRange, valueRange, domain) ->
        scope.brushEnd({domain:domain})
        scope.$apply()

      layout.lifeCycle().on 'drawChart.brush', (data) ->
        brush.data(data)


  }