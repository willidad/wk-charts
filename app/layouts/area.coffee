###*
  @ngdoc layout
  @name area
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
  @example
###

angular.module('wk.chart').directive 'area', ($log, utils, tooltipUtils) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'
      layerKeys = []
      _layout = []
      _dataOld = []
      _pathValuesOld = []
      _pathValuesNew = []
      _pathArray = []
      _tooltip = undefined
      _ttHighlight = undefined
      _circles = undefined
      _scaleList = {}
      _showMarkers = false
      offset = 0
      _id = 'line' + lineCntr++
      area = undefined
      areaBrush = undefined

      #--- Tooltip handlers --------------------------------------------------------------------------------------------

      ttEnter = (idx) ->
        _pathArray = _.toArray(_pathValuesNew)
        ttMoveData.apply(this, [idx])

      ttMoveData = (idx) ->
        ttLayers = _pathArray.map((l) -> {name:l[idx].key, value:_scaleList.y.formatValue(l[idx].yv), color:{'background-color': l[idx].color}, xv:l[idx].xv})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(ttLayers[0].xv)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(_pathArray, (d) -> d[idx].key)
        _circles.enter().append('g').attr('class', "wk-chart-marker-#{_id}").call(tooltipUtils.createTooltipMarkers, idx)
        _circles.selectAll('circle').attr('cy', (d) -> d[idx].y)
        _circles.exit().remove()
        this.attr('transform', "translate(#{_scaleList.x.scale()(_pathArray[0][idx].xv) + offset})")

      #-----------------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->

        mergedX = utils.mergeSeriesSorted(x.value(_dataOld), x.value(data))
        _layerKeys = y.layerKeys(data)
        _layout = []

        _pathValuesNew = {}

        for key in _layerKeys
          _pathValuesNew[key] = data.map((d)-> {x:x.map(d),y:y.scale()(y.layerValue(d, key)), xv:x.value(d), yv:y.layerValue(d,key), key:key, color:color.scale()(key), data:d})

          oldFirst = newFirst = undefined

          layer = {key:key, color:color.scale()(key), value:[]}
          # find starting value for old
          i = 0
          while i < mergedX.length
            if mergedX[i][0] isnt undefined
              oldFirst = _pathValuesOld[key][mergedX[i][0]]
              break
            i++
          # find starting value for new

          while i < mergedX.length
            if mergedX[i][1] isnt undefined
              newFirst = _pathValuesNew[key][mergedX[i][1]]
              break
            i++

          for val, i in mergedX
            v = {color:layer.color, x:val[2]}
            # set x and y values for old values. If there is a added value, maintain the last valid position
            if val[1] is undefined #ie an old value is deleted, maintain the last new position
              v.yNew = newFirst.y
              v.xNew = newFirst.x # animate to the predesessors new position
              v.deleted = true
            else
              v.yNew = _pathValuesNew[key][val[1]].y
              v.xNew = _pathValuesNew[key][val[1]].x
              newFirst = _pathValuesNew[key][val[1]]
              v.deleted = false

            if _dataOld.length > 0
              if  val[0] is undefined # ie a new value has been added
                v.yOld = oldFirst.y
                v.xOld = oldFirst.x # start x-animation from the predecessors old position
              else
                v.yOld = _pathValuesOld[key][val[0]].y
                v.xOld = _pathValuesOld[key][val[0]].x
                oldFirst = _pathValuesOld[key][val[0]]
            else
              v.xOld = v.xNew
              v.yOld = v.yNew


            layer.value.push(v)

          _layout.push(layer)

        offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0

        if _tooltip then _tooltip.data(data)

        areaOld = d3.svg.area()
          .x((d) ->  d.xOld)
          .y0((d) ->  d.yOld)
          .y1((d) ->  y.scale()(0))

        areaNew = d3.svg.area()
          .x((d) ->  d.xNew)
          .y0((d) ->  d.yNew)
          .y1((d) ->  y.scale()(0))

        areaBrush = d3.svg.area()
          .x((d) ->  x.scale()(d.x))
          .y0((d) ->  d.yNew)
          .y1((d) ->  y.scale()(0))

        layers = this.selectAll(".wk-chart-layer")
          .data(_layout, (d) -> d.key)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter.append('path')
          .attr('class','wk-chart-area-path')
          .style('stroke', (d) -> d.color)
          .style('fill', (d) -> d.color)
          .style('opacity', 0)
          .style('pointer-events', 'none')

        layers.select('.wk-chart-area-path').attr('transform', "translate(#{offset})")
          .attr('d', (d) -> areaOld(d.value))
          .transition().duration(options.duration)
            .attr('d', (d) -> areaNew(d.value))
            .style('opacity', 0.7).style('pointer-events', 'none')
        layers.exit().transition().duration(options.duration)
          .style('opacity', 0)
          .remove()

        _dataOld = data
        _pathValuesOld = _pathValuesNew

      brush = (axis, idxRange) ->
        layers = this.select('.wk-chart-area-path')
        if axis.isOrdinal()
          layers.attr('d', (d) -> areaBrush(d.value.slice(idxRange[0],idxRange[1] + 1)))
        else
          layers.attr('d', (d) -> areaBrush(d.value))


      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _tooltip.markerScale(_scaleList.x)
        _tooltip.on "enter.#{_id}", ttEnter
        _tooltip.on "moveData.#{_id}", ttMoveData
        _tooltip.on "moveMarker.#{_id}", ttMoveMarker

      host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', brush

      #--- Property Observers ------------------------------------------------------------------------------------------

      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          _showMarkers = true
        else
          _showMarkers = false

  }