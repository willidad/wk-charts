###*
  @ngdoc layout
  @name areaVertical
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]


###
angular.module('wk.chart').directive 'areaVertical', ($log, utils, tooltipHelperFactory, dataManagerFactory, markerFactory) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'
      _tooltip = undefined
      _ttHighlight = undefined
      _circles = undefined
      _scaleList = {}
      _spline = false
      _showMarkers = false
      _areaStyle = {}
      offset = 0
      area = undefined
      _id = 'areaVertical' + lineCntr++

      layoutData = undefined
      _initialOpacity = 0

      xData = dataManagerFactory()
      markers = markerFactory()
      ttHelper = tooltipHelperFactory()

      #-----------------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        xData.keyScale(y).valueScale(x).data(data)
        if not xData.isInitial()
          layoutData = xData.animationStartLayers()
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        markers.active(_showMarkers)
        layoutData = xData.animationEndLayers()
        drawPath.apply(this, [true, layoutData, options, x, y, color])

      drawPath = (doAnimate, data, options, x, y, color) ->

        offset = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0
        if _tooltip
          _tooltip.data(data)
          ttHelper.layout(data)

        area = d3.svg.area() # tricky. Draw this like a horizontal chart and then rotate and position it.
          .x((d) -> -y.scale()(d.targetKey))
          .y((d) -> x.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
          .y1((d) ->  x.scale()(0))

        if _spline
          area.interpolate('cardinal')

        layers = this.selectAll(".wk-chart-layer")
          .data(data, (d) -> d.layerKey)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter.append('path')
          .attr('class','wk-chart-area-path')
          .attr('d', (d) -> area(d.values))
          .style('opacity', _initialOpacity)
          .style('pointer-events', 'none')
          .style('stroke', (d) -> color.scale()(d.layerKey))
          .style('fill', (d) -> color.scale()(d.layerKey))

        path = layers.select('.wk-chart-area-path')
          .attr('transform', "translate(0,#{offset})rotate(-90)") #rotate and position chart
          .style(_areaStyle)
          .style('stroke', (d) -> color.scale()(d.layerKey))
          .style('fill', (d) -> color.scale()(d.layerKey))
          .style('pointer-events', 'none')
        path = if doAnimate then path.transition().duration( options.duration) else path
        path
          .attr('d', (d) -> area(d.values))
          .style('opacity', (d) -> if d.added or d.deleted then 0 else 1)

        layers.exit()
          .remove()

        markers
          .isVertical(true)
          .x((d) -> x.scale()(if d.layerAdded or d.layerDeleted then 0 else d.value))
          .y((d) -> y.scale()(d.targetKey) + if y.isOrdinal() then y.scale().rangeBand() / 2 else 0)
          .color((d) -> color.scale()(d.layerKey))
        layers.call(markers, doAnimate)

      brush = (axis, idxRange, width, height) ->
        areaPath = this.selectAll(".wk-chart-area-path")
        if axis.isOrdinal()
          areaPath.attr('d', (d) ->
            null
            area(d.values.slice(idxRange[0],idxRange[1] + 1)))
          .attr('transform', "translate(0,#{axis.scale().rangeBand() / 2})rotate(-90)")
          markers.brush(this, idxRange)
          ttHelper.brushRange(idxRange)
        else
          areaPath.attr('d', (d) -> area(d.values))
          markers.brush(this)

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        ttHelper
          .keyScale(_scaleList.y)
          .valueScale(_scaleList.x)
          .colorScale(_scaleList.color)
          .value((d) -> d.value)
        _tooltip.markerScale(_scaleList.y)
        _tooltip.on "enter.#{_id}", ttHelper.enter
        _tooltip.on "moveData.#{_id}", ttHelper.moveData
        _tooltip.on "moveMarker.#{_id}", ttHelper.moveMarkers

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on "brushDraw.#{_id}", brush
      host.lifeCycle().on "animationStartState.#{_id}", setAnimationStart
      host.lifeCycle().on "animationEndState.#{_id}", setAnimationEnd

      host.lifeCycle().on "destroy.#{_id}", ->
        host.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null

      #--- Property Observers ------------------------------------------------------------------------------------------
      ###*
        @ngdoc attr
        @name areaVertical#markers
        @values true, false
        @param [markers=false] {boolean} - show a data maker icon for each data point
      ###
      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          _showMarkers = true
        else
          _showMarkers = false
        host.lifeCycle().update()
      ###*
        @ngdoc attr
        @name areaVertical#spline
        @values true, false
        @param [spline=false] {boolean} - interpolate the area shape using bSpline
      ###
      attrs.$observe 'spline', (val) ->
        if val is '' or val is 'true'
          _spline = true
        else
          _spline = false
        host.lifeCycle().update()

      ###*
        @ngdoc attr
        @name areaVertical#areaStyle
        @param [areaStyle] {object} - Set the pie style for columns lines in the layout
      ###
      attrs.$observe 'areaStyle', (val) ->
        if val
          _areaStyle = scope.$eval(val)
    }