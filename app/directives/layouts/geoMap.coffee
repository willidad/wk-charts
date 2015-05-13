###*
  @ngdoc layout
  @name geoMap
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  Draws a map form the `geoJson` data provided. Colors the map elements according to the data provided in the cart data and the mapping rules provided in the `idMap` attribute.
  The map is drawn according to the properties provided in the `projection` attribute

  For a more detailed description of the various attributes, and a reference to geoJson, projections and other relevant topic please see the {@link guide/geoMap geoMap section in the guide}

  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'geoMap', (wkGeoMap, $log, utils) ->
  mapCntr = 0

  return {
    restrict: 'A'
    require: 'layout'
    scope: {
      geojson: '='
      projection: '='
    }

    link: (scope, element, attrs, controller) ->
      layout = controller.me
      model = wkGeoMap()
      model.layout(layout)

      # GeoMap specific properties -------------------------------------------------------------------------------------
      ###*
          @ngdoc attr
          @name geoMap#projection
          @param projection {object} sets the projection attributes for the map defined in `geojson`
      ###
      scope.$watch 'projection', (val) ->
        if val isnt undefined
          $log.log 'setting Projection params', val
          model.projection(val)
          layout.lifeCycle().update()

      , true #deep watch

      ###*
        @ngdoc attr
        @name geoMap#geojson
        @param geojson {object} the geojson object that describes the the map.
      ###
      scope.$watch 'geojson', (val) ->
        if val isnt undefined and val isnt ''
          model.geoJson(val)
          layout.lifeCycle().update()


  }
