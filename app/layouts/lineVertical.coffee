###*
  @ngdoc layout
  @name lineVertical
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  Draws a vertical line chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent] The vertical dimension
  @usesDimension color [type=category20] the line coloring dimension


###
angular.module('wk.chart').directive 'lineVertical', ($log, utils, tooltipUtils) ->
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
      lineBrush = undefined
      markersBrushed = undefined
      brushStartIdx = 0
      _tooltip = undefined
      _ttHighlight = undefined
      _circles = undefined
      _showMarkers = false
      _scaleList = {}
      offset = 0
      _id = 'line' + lineCntr++

      prepData = (x, y, color) ->
        #layerKeys = y.layerKeys(@)
        #_layout = layerKeys.map((key) => {key:key, color:color.scale()(key), value:@map((d)-> {x:x.value(d),y:y.layerValue(d, key)})})

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
        _circles.enter().append('g').attr('class', "wk-chart-marker-#{_id}").call(tooltipUtils.styleTooltipMarker, offs)
        _circles.selectAll('circle').attr('cx', (d) -> d[offs].x)
        _circles.exit().remove()
        o = if _scaleList.y.isOrdinal then _scaleList.y.scale().rangeBand() / 2 else 0
        this.attr('transform', "translate(0,#{_scaleList.y.scale()(_pathArray[0][offs].yv) + o})") # need to compute form scale because of brushing


      #-----------------------------------------------------------------------------------------------------------------

      markers = (layer, duration) ->
        if _showMarkers
          m = layer.selectAll('.wk-chart-marker').data(
            (l) -> l.value
          , (d) -> d.y
          )
          m.enter().append('circle').attr('class','wk-chart-marker wk-chart-selectable')
            .attr('r', 5)
            .style('pointer-events','none')
            .style('opacity',0)
            .style('fill', (d) -> d.color)
          m
            .attr('cy', (d) -> d.yOld + offset)
            .attr('cx', (d) -> d.xOld)
            .classed('wk-chart-deleted',(d) -> d.deleted)
            .transition().duration(duration)
            .attr('cy', (d) -> d.yNew + offset)
            .attr('cx', (d) -> d.xNew)
            .style('opacity', (d) -> if d.deleted then 0 else 1)

          m.exit()
            .remove()
        else
          layer.selectAll('.wk-chart-marker').transition().duration(duration).style('opacity', 0).remove()

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

        markersBrushed = (layer) ->
          if _showMarkers
            layer
            .attr('cy', (d) ->
              null
              y.scale()(d.y) + if y.isOrdinal() then y.scale().rangeBand() / 2 else 0
            )

        if _tooltip then _tooltip.data(data)

        lineOld = d3.svg.line()
          .x((d) -> d.xOld)
          .y((d) -> d.yOld)

        lineNew = d3.svg.line()
          .x((d) -> d.xNew)
          .y((d) -> d.yNew)

        lineBrush = d3.svg.line()
          .x((d) -> d.xNew)
          .y((d) -> y.scale()(d.y))


        layers = this.selectAll(".wk-chart-layer")
          .data(_layout, (d) -> d.key)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter.append('path')
          .attr('class','wk-chart-line')
          .style('stroke', (d) -> d.color)
          .style('opacity', 0)
          .style('pointer-events', 'none')
        layers.select('.wk-chart-line')
          .attr('transform', "translate(0,#{offset})")
          .attr('d', (d) -> lineOld(d.value))
          .transition().duration(options.duration)
            .attr('d', (d) -> lineNew(d.value))
            .style('opacity', 1).style('pointer-events', 'none')
        layers.exit().transition().duration(options.duration)
          .style('opacity', 0)
          .remove()

        layers.call(markers, options.duration)

        _dataOld = data
        _pathValuesOld = _pathValuesNew

      brush = (axis, idxRange) ->
        layers = this.selectAll(".wk-chart-line")
        if axis.isOrdinal()
          brushStartIdx = idxRange[0]
          layers.attr('d', (d) -> lineBrush(d.value.slice(idxRange[0],idxRange[1] + 1)))
            .attr('transform', "translate(0,#{axis.scale().rangeBand() / 2})")
        else
          layers.attr('d', (d) -> lineBrush(d.value))
        markers = this.selectAll('.wk-chart-marker').call(markersBrushed)

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

      ###*
        @ngdoc attr
        @name lineVertical#markers
        @values true, false
        @param [markers=false] {boolean} - show a data maker icon for each data point
      ###
      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          _showMarkers = true
        else
          _showMarkers = false
        host.lifeCycle().update()
  }