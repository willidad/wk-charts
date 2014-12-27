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
      selectedDomain: '='
    require: 'layout'

    link: (scope, element, attrs, controller) ->
      layout = controller.me

      layout.lifeCycle().on 'configure.selection', ->

        _selection = layout.behavior().selected
        _selection.active(true)
        _selection.on 'selected', (selectedObjects) ->
          scope.selectedDomain = selectedObjects
          scope.$apply()

  }