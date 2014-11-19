angular.module('wk.chart').directive 'line', ($log, behavior, utils, timing) ->
  lineCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking s-line'
      _layerKeys = []
      _layout = []
      _dataOld = []
      _pathValuesOld = []
      _pathValuesNew = []
      _pathArray = []
      _initialOpacity = 0

      _tooltip = undefined
      _ttHighlight = undefined
      _circles = undefined
      _showMarkers = false
      _scaleList = {}
      offset = 0
      _id = 'line' + lineCntr++
      line = undefined
      markers = undefined

      brushLine = undefined


      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

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
        _circles.enter().append('circle').attr('class',"wk-chart-marker-#{_id}")
          .attr('r', if _showMarkers then 8 else 5)
          .style('fill', (d)-> d[idx].color)
          .style('fill-opacity', 0.6)
          .style('stroke', 'black')
          .style('pointer-events','none')
        _circles.attr('cy', (d) -> d[idx].y)
        _circles.exit().remove()
        this.attr('transform', "translate(#{_pathArray[0][idx].x + offset})")

      #--- Draw --------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->

        mergedX = utils.mergeSeries(x.value(_dataOld), x.value(data))
        _layerKeys = y.layerKeys(data)
        _layout = []

        _pathValuesNew = {}

        for key in _layerKeys
          _pathValuesNew[key] = data.map((d)-> {x:x.map(d),y:y.scale()(y.layerValue(d, key)), xv:x.value(d), yv:y.layerValue(d,key), key:key, color:color.scale()(key)})

          layer = {key:key, color:color.scale()(key), value:[]}
          # find starting value for old
          i = 0
          while i < mergedX.length
            if mergedX[i][0] isnt undefined
              oldLast = _pathValuesOld[key][mergedX[i][0]]
              break
            i++

          while i < mergedX.length
            if mergedX[i][1] isnt undefined
              newLast = _pathValuesNew[key][mergedX[i][1]]
              break
            i++

          for val, i in mergedX
            v = {color:layer.color, x:val[2]}
            # set x and y values for old values. If there is a added value, maintain the last valid position
            if val[1] is undefined #ie an old value is deleted, maintain the last new position
              v.yNew = _pathValuesOld[key][val[0]].y
              v.xNew = newLast.x # animate to the predesessors new position
              v.deleted = true
            else
              v.yNew = _pathValuesNew[key][val[1]].y
              v.xNew = _pathValuesNew[key][val[1]].x
              newLast = _pathValuesNew[key][val[1]]
              v.deleted = false

            if _dataOld.length > 0
              if  val[0] is undefined # ie a new value has been added
                v.yOld = _pathValuesNew[key][val[1]].y
                v.xOld = oldLast.x # start x-animation from the predecessors old position
              else
                v.yOld = _pathValuesOld[key][val[0]].y
                v.xOld = _pathValuesOld[key][val[0]].x
                oldLast = _pathValuesOld[key][val[0]]
            else
              v.xOld = v.xNew
              v.yOld = v.yNew


            layer.value.push(v)

          _layout.push(layer)

        offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0

        if _tooltip then _tooltip.data(data)

        markers = (layer, duration) ->
          if _showMarkers
            m = layer.selectAll('.wk-chart-marker').data(
                (l) -> l.value
              , (d) -> d.x
            )
            m.enter().append('circle').attr('class','wk-chart-marker wk-chart-selectable')
              .attr('r', 5)
              .style('pointer-events','none')
              #.style('opacity', _initialOpacity)
              .style('fill', (d) -> d.color)
            m
              .attr('cy', (d) -> d.yOld)
              .attr('cx', (d) -> d.xOld + offset)
              .classed('wk-chart-deleted',(d) -> d.deleted)
            .transition().duration(duration)
              .attr('cy', (d) -> d.yNew)
              .attr('cx', (d) -> d.xNew + offset)
              .style('opacity', (d) -> if d.deleted then 0 else 1)

            m.exit()
              .remove()

          else
            layer.selectAll('.wk-chart-marker').transition().duration(duration).style('opacity', 0).remove()

        lineOld = d3.svg.line()
          .x((d) -> d.xOld)
          .y((d) -> d.yOld)

        lineNew = d3.svg.line()
          .x((d) -> d.xNew)
          .y((d) -> d.yNew)

        brushLine = d3.svg.line()
          .x((d) -> x.scale()(d.x))
          .y((d) -> d.yNew)

        layers = this.selectAll(".wk-chart-layer")
          .data(_layout, (d) -> d.key)
        enter = layers.enter().append('g').attr('class', "wk-chart-layer")
        enter.append('path')
          .attr('class','wk-chart-line')
          .attr('d', (d) -> lineNew(d.value))
          .style('opacity', _initialOpacity)
          .style('pointer-events', 'none')

        layers.select('.wk-chart-line').attr('transform', "translate(#{offset})")
          .attr('d', (d) -> lineOld(d.value))
          .transition().duration(options.duration)
          .attr('d', (d) -> lineNew(d.value))
          .style('stroke', (d) -> d.color)
          .style('opacity', 1).style('pointer-events', 'none')

        layers.exit().transition().duration(options.duration)
          .style('opacity', 0)
          .remove()

        layers.call(markers, options.duration)

        _initialOpacity = 0
        _dataOld = data
        _pathValuesOld = _pathValuesNew

      brush = (data, options, x, y, color) ->
        layers = this.selectAll(".wk-chart-line")
          .attr('d', (d) -> brushLine(d.value))
        layers.call(markers, 0)

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

      host.lifeCycle().on 'draw', draw
      host.lifeCycle().on 'brushDraw', brush

      #--- Property Observers ------------------------------------------------------------------------------------------

      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          _showMarkers = true
        else
          _showMarkers = false
        host.lifeCycle().update()
  }