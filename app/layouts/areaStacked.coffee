###*
  @ngdoc layout
  @name areaStacked
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a horizontally stacked area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=total]
  @usesDimension color [type=category20]
###

angular.module('wk.chart').directive 'areaStacked', ($log, utils, tooltipUtils) ->
  stackedAreaCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me

      stack = d3.layout.stack()
      offset = 'zero'
      layers = null
      _showMarkers = false
      layerKeys = []
      layerData = []
      layoutNew = []
      layoutOld = []
      layerKeysOld = []
      area = undefined
      deletedSucc = {}
      addedPred = {}
      _tooltip = undefined
      _ttHighlight = undefined
      _circles = undefined
      _scaleList = {}
      scaleY = undefined
      offs = 0
      _id = 'areaStacked' + stackedAreaCntr++

      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      ttMoveData = (idx) ->
        ttLayers = layerData.map((l) -> {name:l.key, value:_scaleList.y.formatValue(l.layer[idx].yy), color: {'background-color': l.color}})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(layerData[0].layer[idx].x)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(layerData, (d) -> d.key)
        _circles.enter().append('g').attr('class',"wk-chart-marker-#{_id}").call(tooltipUtils.styleTooltipMarker)
        ###
          .attr('r', if _showMarkers then 8 else 5)
          .style('fill', (d)-> d.color)
          .style('fill-opacity', 0.6)
          .style('stroke', 'black')
          .style('pointer-events','none')
  ###
        _circles.selectAll('circle').attr('cy', (d) -> scaleY(d.layer[idx].y + d.layer[idx].y0))
        _circles.exit().remove()

        this.attr('transform', "translate(#{_scaleList.x.scale()(layerData[0].layer[idx].x)+offs})")

      #-------------------------------------------------------------------------------------------------------------------

      getLayerByKey = (key, layout) ->
        for l in layout
          if l.key is key
            return l

      stackLayout = stack.values((d)->d.layer).y((d) -> d.yy)

      #--- Draw --------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->
        #$log.log "rendering Area Chart"


        layerKeys = y.layerKeys(data)
        deletedSucc = utils.diff(layerKeysOld, layerKeys, 1)
        addedPred = utils.diff(layerKeys, layerKeysOld, -1)

        layerData = layerKeys.map((k) => {key: k, color:color.scale()(k), layer: data.map((d) -> {x: x.value(d), yy: +y.layerValue(d,k), y0: 0, data:d})}) # yy: need to avoid overwriting by layout calc -> see stack y accessor
        layoutNew = stackLayout(layerData)

        offs = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0

        if _tooltip then _tooltip.data(data)

        if not layers
          layers = this.selectAll('.wk-chart-layer')

        if offset is 'expand'
          scaleY = y.scale().copy()
          scaleY.domain([0, 1])
        else scaleY = y.scale()

        area = d3.svg.area()
          .x((d) ->  x.scale()(d.x))
          .y0((d) ->  scaleY(d.y0 + d.y))
          .y1((d) ->  scaleY(d.y0))

        layers = layers
          .data(layoutNew, (d) -> d.key)

        if layoutOld.length is 0
          layers.enter()
            .append('path').attr('class', 'wk-chart-area')
            .style('fill', (d, i) -> color.scale()(d.key)).style('opacity', 0)
            .style('pointer-events', 'none')
            .style('opacity', 0.7)
        else
          layers.enter()
            .append('path').attr('class', 'wk-chart-area')
            .attr('d', (d) -> if addedPred[d.key] then getLayerByKey(addedPred[d.key], layoutOld).path else area(d.layer.map((p) ->  {x: p.x, y: 0, y0: 0})))
            .style('fill', (d, i) -> color.scale()(d.key))
            .style('pointer-events', 'none')
            .style('opacity', 0.7)

        layers
          .attr('transform', "translate(#{offs})")
          .transition().duration(options.duration)
            .attr('d', (d) -> area(d.layer))
            .style('fill', (d, i) -> color.scale()(d.key))


        layers.exit().transition().duration(options.duration)
          .attr('d', (d) ->
            succ = deletedSucc[d.key]
            if succ then area(getLayerByKey(succ, layoutNew).layer.map((p) -> {x: p.x, y: 0, y0: p.y0})) else area(layoutNew[layoutNew.length - 1].layer.map((p) -> {x: p.x, y: 0, y0: p.y0 + p.y}))
          )
          .remove()

        layoutOld = layoutNew.map((d) -> {key: d.key, path: area(d.layer.map((p) -> {x: p.x, y: 0, y0: p.y + p.y0}))})
        layerKeysOld = layerKeys

      brush = (axis, idxRange) ->
        layers = this.selectAll(".wk-chart-area")
        layers
          .attr('d', (d) -> area(d.layer))

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('y').domainCalc('total').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _tooltip.markerScale(_scaleList.x)
        _tooltip.on "enter.#{_id}", ttMoveData
        _tooltip.on "moveData.#{_id}", ttMoveData
        _tooltip.on "moveMarker.#{_id}", ttMoveMarker

      host.lifeCycle().on 'drawChart', draw

      #--- Property Observers ------------------------------------------------------------------------------------------

      ###*
          @ngdoc attr
          @name areaStacked#areaStacked
          @values zero, silhouette, expand, wiggle
          @param [areaStacked=zero] {string} Defines how the areas are stacked.
          For a description of the stacking algorithms please see [d3 Documentation on Stack Layout](https://github.com/mbostock/d3/wiki/Stack-Layout#offset)
      ###
      attrs.$observe 'areaStacked', (val) ->
        if val in ['zero', 'silhouette', 'expand', 'wiggle']
          offset = val
        else
          offset = "zero"
        stack.offset(offset)
        host.lifeCycle().update()

      attrs.$observe 'markers', (val) ->
        if val is '' or val is 'true'
          _showMarkers = true
        else
          _showMarkers = false
  }

#TODO implement enter / exit animations like in line
#TODO implement external brushing optimizations