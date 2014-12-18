###*
  @ngdoc layout
  @name areaVertical
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]


###
angular.module('wk.chart').directive 'areaVertical', ($log, utils) ->
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
      areaBrush = undefined
      brushStartIdx = 0
      _id = 'area' + lineCntr++

      #--- Tooltip handlers --------------------------------------------------------------------------------------------

      ttEnter = (idx) ->
        _pathArray = _.toArray(_pathValuesNew)
        ttMoveData.apply(this, [idx])

      ttMoveData = (idx) ->
        offs = idx + brushStartIdx
        ttLayers = _pathArray.map((l) -> {name:l[offs].key, value:_scaleList.x.formatValue(l[offs].xv), color:{'background-color': l[offs].color}, yv:l[offs].yv})
        @headerName = _scaleList.y.axisLabel()
        @headerValue = _scaleList.y.formatValue(ttLayers[0].yv)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        offs = idx + brushStartIdx
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(_pathArray, (d) -> d[offs].key)
        _circles.enter().append('circle').attr('class',"wk-chart-marker-#{_id}")
          .attr('r', if _showMarkers then 8 else 5)
          .style('fill', (d)-> d[offs].color)
          .style('fill-opacity', 0.6)
          .style('stroke', 'black')
          .style('pointer-events','none')
        _circles.attr('cx', (d) -> d[offs].x)
        _circles.exit().remove()
        o = if _scaleList.y.isOrdinal then _scaleList.y.scale().rangeBand() / 2 else 0
        this.attr('transform', "translate(0,#{_scaleList.y.scale()(_pathArray[0][offs].yv) + o})") # need to compute form scale because of brushing

      #-----------------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->

        if y.isOrdinal()
          mergedY = utils.mergeSeriesUnsorted(y.value(_dataOld), y.value(data))
        else
          mergedY = utils.mergeSeriesSorted(y.value(_dataOld), y.value(data))
        _layerKeys = x.layerKeys(data)
        _layout = []
        _pathValuesNew = {}

        #_layout = layerKeys.map((key) => {key:key, color:color.scale()(key), value:data.map((d)-> {y:y.value(d),x:x.layerValue(d, key)})})

        for key in _layerKeys
          _pathValuesNew[key] = data.map((d)-> {y:y.map(d), x:x.scale()(x.layerValue(d, key)), yv:y.value(d), xv:x.layerValue(d,key), key:key, color:color.scale()(key), data:d})

          layer = {key:key, color:color.scale()(key), value:[]}
          # find starting value for old
          i = 0
          while i < mergedY.length
            if mergedY[i][0] isnt undefined
              oldFirst = _pathValuesOld[key][mergedY[i][0]]
              break
            i++

          while i < mergedY.length
            if mergedY[i][1] isnt undefined
              newFirst = _pathValuesNew[key][mergedY[i][1]]
              break
            i++

          for val, i in mergedY
            v = {color:layer.color, y:val[2]}
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

        offset = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0

        if _tooltip then _tooltip.data(data)

        areaOld = d3.svg.area()    # tricky. Draw this like a vertical chart and then rotate and position it.
          .x((d) -> options.width - d.yOld)
          .y0((d) ->  d.xOld)
          .y1((d) ->  x.scale()(0))

        areaNew = d3.svg.area()    # tricky. Draw this like a vertical chart and then rotate and position it.
          .x((d) -> options.width - d.yNew)
          .y0((d) ->  d.xNew)
          .y1((d) ->  x.scale()(0))

        areaBrush = d3.svg.area()    # tricky. Draw this like a vertical chart and then rotate and position it.
          .x((d) -> options.width - y.scale()(d.y))
          .y0((d) ->  d.xNew)
          .y1((d) ->  x.scale()(0))

        layers = this.selectAll(".wk-chart-layer")
          .data(_layout, (d) -> d.key)
        layers.enter().append('g')
          .attr('class', "wk-chart-layer")
          .append('path')
          .attr('class','wk-chart-line')
          .style('stroke', (d) -> d.color)
          .style('fill', (d) -> d.color)
          .style('opacity', 0)
          .style('pointer-events', 'none')
        layers.select('.wk-chart-line')
          .attr('transform', "translate(0,#{options.width + offset})rotate(-90)") #rotate and position chart
            .attr('d', (d) -> areaOld(d.value))
            .transition().duration(options.duration)
              .attr('d', (d) -> areaNew(d.value))
              .style('opacity', 0.7).style('pointer-events', 'none')
        layers.exit().transition().duration(options.duration)
          .style('opacity', 0)
          .remove()

        _dataOld = data
        _pathValuesOld = _pathValuesNew

      brush = (axis, idxRange, width, height) ->
        layers = this.selectAll(".wk-chart-line")
        if axis.isOrdinal()
          layers.attr('transform', "translate(0,#{width + axis.scale().rangeBand() / 2})rotate(-90)")
          layers.attr('d', (d) ->  areaBrush(d.value.slice(idxRange[0], idxRange[1] + 1)))
          brushStartIdx = idxRange[0]
        else
          layers.attr('d', (d) -> areaBrush(d.value))
        #layers.call(markers, 0)

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _tooltip.markerScale(_scaleList.y)
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