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
        $log.log 'y-range', y.scale().range(), 'y-domain', y.scale().domain()
        $log.log 'x-range', x.scale().range(), 'x-domain', x.scale().domain()
        $log.log 'color-range', color.scale().range(), 'color-domain', color.scale().domain()

        if not options.skip
          _layerKeys = y.layerKeys(data)
          _layout = _layerKeys.map((key) => {key:key, color:color.scale()(key), value:data.map((d)-> {x:x.value(d),y:y.layerValue(d, key), color:color.scale()(key), key:key, __data$$:d})})

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
          .x((d) -> x.scale()(d.x))
          .y((d) -> y.scale()(d.y))

        layers = this.selectAll(".layer")
          .data(_layout, (d) -> d.key)
        enter = layers.enter().append('g').attr('class', "layer")
        enter.append('path')
          .attr('class','line')

          .style('opacity', _initialOpacity)
          .style('pointer-events', 'none')
        layers.select('.line').attr('transform', "translate(#{offset})").transition().duration(options.duration)
          .attr('d', (d) -> line(d.value))
          .style('stroke', (d) -> d.color)
          .style('opacity', 1).style('pointer-events', 'none')

        layers.exit().transition().duration(options.duration)
          .style('opacity', 0)
          .remove()

        layers.call(markers, options.duration)

        _initialOpacity = 0

      brush = (data, options, x, y, color) ->
        layers = this.selectAll(".layer")
        layers.select('.line')
          .attr('d', (d) -> line(d.value))
        layers.call(markers, 0)

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('extent').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _tooltip.markerScale(_scaleList.x)
        _tooltip.on "enter.#{_id}", ttMoveData
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