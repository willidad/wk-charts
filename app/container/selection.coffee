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

    require: 'layout'

    link: (scope, element, attrs, controller) ->
      $log.log 'selection-scope', scope.$id
      layout = controller.me
      _selection = undefined
      _id = objId++

      scope.$watch 'selectedDomain', (val) ->
        if _.isArray(val) and val.length is 0
          _selection.clearSelection()
          scope.selectedDomainChange({domain:[]})

      layout.lifeCycle().on "configure.selection#{_id}", ->
        _selection = layout.behavior().selected
        _selection.layout(layout)
        _selection.active(true)
        _selection.on "selected.selection#{_id}", (selectedObjects) ->
          if scope.selectedDomain then scope.selectedDomain = selectedObjects
          scope.selectedDomainChange({domain:selectedObjects})
          scope.$apply()

        layout.lifeCycle().on "destroy.selection#{_id}", () ->
          _selection.on ".selection#{_id}", null
          layout.lifeCycle().on ".selection#{_id}", null
          scope.$destroy()

  }