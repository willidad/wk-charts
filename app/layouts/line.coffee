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


      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      ttMoveData = (idx) ->
        ttLayers = _layout.map((l) -> {name:l.key, value:_scaleList.y.formatValue(l.value[idx].y), color:{'background-color': l.color}})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(_layout[0].value[idx].x)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".marker-#{_id}").data(_layout, (d) -> d.key)
        _circles.enter().append('circle').attr('class',"marker-#{_id}")
          .attr('r', if _showMarkers then 8 else 5)
          .style('fill', (d)-> d.color)
          .style('fill-opacity', 0.6)
          .style('stroke', 'black')
          .style('pointer-events','none')
        _circles.attr('cy', (d) -> _scaleList.y.scale()(d.value[idx].y))
        _circles.exit().remove()
        this.attr('transform', "translate(#{_scaleList.x.scale()(_layout[0].value[idx].x) + offset})")

      #--- Draw --------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->

        mergedX = utils.mergeSeries(x.value(_dataOld), x.value(data))
        _layerKeys = y.layerKeys(data)
        _layout = []

        _pathValuesNew = {}

        for key in _layerKeys
          _pathValuesNew[key] = data.map((d)-> {x:x.map(d),y:y.scale()(y.layerValue(d, key))})

          layer = {key:key, color:color.scale()(key), valueOld:[], valueNew:[]}
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
            # set x and y values for old values. If there is a added value, maintain the last valid position
            if _dataOld.length > 0
              if  val[0] is undefined # ie a new value has been added
                vo = {}
                vo.y = _pathValuesNew[key][val[1]].y
                vo.x = oldLast.x # start x-animation from the predecessors old position
              else
                vo = _pathValuesOld[key][val[0]]
                oldLast = _pathValuesOld[key][val[0]]
              layer.valueOld.push(vo)

            if val[1] is undefined #ie an old value is deleted, maintain the last new position
              vn = {}
              vn.y = _pathValuesOld[key][val[0]].y
              vn.x = newLast.x # animate to the predesessors new position
            else
              vn = _pathValuesNew[key][val[1]]
              newLast = _pathValuesNew[key][val[1]]
            layer.valueNew.push(vn)

          _layout.push(layer)

        offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0

        if _tooltip then _tooltip.data(data)

        markers = (layer, duration) ->
          if _showMarkers
            m = layer.selectAll('.marker').data(
                (l) -> l.value
              , (d) -> d.x
            )
            m.enter().append('circle').attr('class','marker selectable')
              .attr('r', 5)
              .style('pointer-events','none')
              .style('opacity', _initialOpacity)
            m.transition().duration(duration)
              .attr('cy', (d) -> y.scale()(d.y))
              .attr('cx', (d) -> x.scale()(d.x) + offset)
              .style('opacity', 1)
              .style('fill', (d) -> d.color)
            m.exit().transition().duration(duration).style('opacity', 0).remove()
          else
            layer.selectAll('.marker').transition().duration(duration).style('opacity', 0).remove()

        line = d3.svg.line()
          .x((d) -> d.x)
          .y((d) -> d.y)

        layers = this.selectAll(".line")
          .data(_layout, (d) -> d.key)
        #enter = layers.enter().append('g').attr('class', "layer")
        layers.enter().append('path')
          .attr('class','line')
          .attr('d', (d) -> line(d.valueOld))
          .style('opacity', _initialOpacity)
          .style('pointer-events', 'none')

        layers.attr('transform', "translate(#{offset})")
          .attr('d', (d) -> line(d.valueOld))
          .transition().duration(options.duration)
          .attr('d', (d) -> line(d.valueNew))
          .style('stroke', (d) -> d.color)
          .style('opacity', 1).style('pointer-events', 'none')

        layers.exit().transition().duration(options.duration)
          .style('opacity', 0)
          .remove()

        #layers.call(markers, options.duration)

        _initialOpacity = 0
        _dataOld = data
        _pathValuesOld = _pathValuesNew

      brush = (data, options, x, y, color) ->
        layers = this.selectAll(".line")
          .attr('d', (d) -> line(d.valueNew))
        #layers.call(markers, 0)

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        #_tooltip = host.behavior().tooltip
        #_tooltip.markerScale(_scaleList.x)
        #_tooltip.on "enter.#{_id}", ttMoveData
        #_tooltip.on "moveData.#{_id}", ttMoveData
        #_tooltip.on "moveMarker.#{_id}", ttMoveMarker

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