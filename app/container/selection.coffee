###*
  @ngdoc behavior
  @name selection
  @element layout
  @module wk.chart
  @restrict A
  @description
  enables selection of individual chart objects
###
angular.module('wk.chart').directive 'selection', ($log) ->
  objId = 0

  return {
    restrict: 'A'
    scope:
      ###*
        @ngdoc attr
        @name selection#selectedDomain
        @param selectedDomain {array} Array containing the selected data objects.
      ###
      selectedDomain: '='

      ###*
        @ngdoc attr
        @name selection#selectedDomainChange
        @param selectedDomainChange {expression} expression to evaluate upon a change of the brushes selected domain. The selected domain is available as ´domain´
      ###
      selectedDomainChange: '&'

      ###*
        @ngdoc attr
        @name selection#clearSelection
        @param clearSelection {function} assigns a function that clears the selection when called via a bound scope variable.
        * Usage: bind a scope variable to the attribute: `clear-selection="scopeVar"`. `selection` assigns a function to scopeVar that can be called to reset the brush, e.g. in a button: `<button ng-click="scopeVar()">Clear Selection</button>`
      ###
      clearSelection: "="

    require: 'layout'

    link: (scope, element, attrs, controller) ->
      layout = controller.me

      layout.lifeCycle().on 'configure.selection', ->
        _selection = layout.behavior().selected
        scope.$watch 'clearSelection' , (val) ->
          scope.clearSelection = _selection.clearSelection

        _selection.active(true)
        _selection.on 'selected', (selectedObjects) ->
          scope.selectedDomain = selectedObjects
          scope.selectedDomainChange({domain:selectedObjects})
          scope.$apply()

  }