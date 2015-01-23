angular.module('wk.chart').directive 'chartGenerator', ($log, chartFactory, modelTypes) ->

  return {
    restrict:'E'
    scope:
      markup:'='
      properties:'='
      error:'&'
      warning:'&'
    link: (scope, iElement, iAttrs) ->
      if iAttrs.properties
        scope.properties = chartFactory.create()

      scope.$watch('properties', (values) ->
        if chartFactory.verify()
          if iAttrs.markup
            scope.markup = chartFactory.generateMarkup(scope.properties)
          if iAttrs.warning and chartFactory.hasWarnings
            scope.warning({warnings:chartFactory.warnings})
        else
          if iAttrs.error
            scope.error({errors:chartFactory.errors})
      , true
      )
  }