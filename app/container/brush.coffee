###*
  @ngdoc behavior
  @name brush
  @module wk.chart
  @restrict A
  @description

  enable brushing behavior
###
angular.module('wk.chart').directive 'brush', ($log, selectionSharing, behavior) ->
  return {
    restrict: 'A'
    require: ['^chart', '^layout', '?x', '?y','?rangeX', '?rangeY']
    scope:
      brushExtent: '='
      selectedValues: '='
      selectedDomain: '='
      selectedDomainChange: '&'

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

      ###*
              @ngdoc attr
              @name brush#brush
              @values none
              @param brush {string} Brush name
              Brush will be published under this name for consumption by other layouts
            ###
      attrs.$observe 'brush', (val) ->
        if _.isString(val) and val.length > 0
          brush.brushGroup(val)
        else
          brush.brushGroup(undefined)

      ###*
        @ngdoc attr
        @name brush#selectedDomainChange
        @param selectedDomainChange {expression} expression to evaluate upon a change od the brushes selected domain. The selected domain is available as ´domain´
      ###
      brush.events().on 'brush', (idxRange, valueRange, domain) ->
        if attrs.brushExtent
          scope.brushExtent = idxRange
        if attrs.selectedValues
          scope.selectedValues = valueRange
        if attrs.selectedDomain
          scope.selectedDomain = domain
        scope.selectedDomainChange({domain:domain})
        scope.$apply()

      layout.lifeCycle().on 'drawChart.brush', (data) ->
        brush.data(data)


  }