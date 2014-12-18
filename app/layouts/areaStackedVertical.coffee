###*
  @ngdoc layout
  @name areaStackedVertical
  @module wk.chart
  @restrict A
  @area api
  @description

  draws a area chart layout

  @usesDimension x [type=linear, domainRange=total] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]

###
angular.module('wk.chart').directive 'areaStackedVertical', ($log, utils) ->
  areaStackedVertCntr = 0
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
      scaleX = undefined
      offs = 0
      _id = 'area-stacked-vert' + areaStackedVertCntr++

      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      ttMoveData = (idx) ->
        ttLayers = layerData.map((l) -> {name:l.key, value:_scaleList.x.formatValue(l.layer[idx].xx), color: {'background-color': l.color}})
        @headerName = _scaleList.y.axisLabel()
        @headerValue = _scaleList.y.formatValue(layerData[0].layer[idx].yy)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(layerData, (d) -> d.key)
        _circles.enter().append('circle').attr('class',"wk-chart-marker-#{_id}")
          .attr('r', if _showMarkers then 8 else 5)
          .style('fill', (d)-> d.color)
          .style('fill-opacity', 0.6)
          .style('stroke', 'black')
          .style('pointer-events','none')
        _circles.attr('cx', (d) -> scaleX(d.layer[idx].y + d.layer[idx].y0))  # weird!!! however, the data is for a horizontal chart which gets transformed
        _circles.exit().remove()

        this.attr('transform', "translate(0,#{_scaleList.y.scale()(layerData[0].layer[idx].yy)+offs})")

      #-------------------------------------------------------------------------------------------------------------------

      getLayerByKey = (key, layout) ->
        for l in layout
          if l.key is key
            return l

      layout = stack.values((d)->d.layer).y((d) -> d.xx)


      #-------------------------------------------------------------------------------------------------------------------
      ###
      prepData = (x,y,color) ->

        layoutOld = layoutNew.map((d) -> {key: d.key, path: area(d.layer.map((p) -> {x: p.x, y: 0, y0: p.y + p.y0}))})
        layerKeysOld = layerKeys

        layerKeys = y.layerKeys(@)
        layerData = layerKeys.map((k) => {key: k, color:color.scale()(k), layer: @map((d) -> {x: x.value(d), yy: +y.layerValue(d,k), y0: 0})}) # yy: need to avoid overwriting by layout calc -> see stack y accessor
        #layoutNew = layout(layerData)

        deletedSucc = utils.diff(layerKeysOld, layerKeys, 1)
        addedPred = utils.diff(layerKeys, layerKeysOld, -1)
      ###
      #--- Draw --------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->
        #$log.log "rendering Area Chart"


        layerKeys = x.layerKeys(data)
        deletedSucc = utils.diff(layerKeysOld, layerKeys, 1)
        addedPred = utils.diff(layerKeys, layerKeysOld, -1)

        layerData = layerKeys.map((k) => {key: k, color:color.scale()(k), layer: data.map((d) -> {yy: y.value(d), xx: +x.layerValue(d,k), y0: 0, data:d})}) # yy: need to avoid overwriting by layout calc -> see stack y accessor
        layoutNew = layout(layerData)

        offs = if y.isOrdinal() then y.scale().rangeBand() / 2 else 0

        if _tooltip then _tooltip.data(data)

        if not layers
          layers = this.selectAll('.wk-chart-layer')

        if offset is 'expand'
          scaleX = x.scale().copy()
          scaleX.domain([0, 1])
        else scaleX = x.scale()

        area = d3.svg.area()
          .x((d) ->  y.scale()(d.yy))
          .y0((d) ->  scaleX(d.y0 + d.y))
          .y1((d) ->  scaleX(d.y0))

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
            .attr('d', (d) -> if addedPred[d.key] then getLayerByKey(addedPred[d.key], layoutOld).path else area(d.layer.map((p) ->  {yy: p.yy, y: 0, y0: 0})))
            .style('fill', (d, i) -> color.scale()(d.key))
            .style('pointer-events', 'none')
            .style('opacity', 0.7)

        layers
          .attr('transform', "rotate(90) scale(1,-1)")
          .transition().duration(options.duration)
            .attr('d', (d) -> area(d.layer))
            .style('fill', (d, i) -> color.scale()(d.key))


        layers.exit().transition().duration(options.duration)
          .attr('d', (d) ->
            succ = deletedSucc[d.key]
            if succ then area(getLayerByKey(succ, layoutNew).layer.map((p) -> {yy: p.yy, y: 0, y0: p.y0})) else area(layoutNew[layoutNew.length - 1].layer.map((p) -> {yy: p.yy, y: 0, y0: p.y0 + p.y}))
          )
          .remove()

        layoutOld = layoutNew.map((d) -> {key: d.key, path: area(d.layer.map((p) -> {yy: p.yy, y: 0, y0: p.y + p.y0}))})
        layerKeysOld = layerKeys

      #--- Configuration and registration ------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @layerScale('color')
        @getKind('x').domainCalc('total').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _tooltip.markerScale(_scaleList.y)
        _tooltip.on "enter.#{_id}", ttMoveData
        _tooltip.on "moveData.#{_id}", ttMoveData
        _tooltip.on "moveMarker.#{_id}", ttMoveMarker

      host.lifeCycle().on 'drawChart', draw

      #--- Property Observers ------------------------------------------------------------------------------------------

      ###*
          @ngdoc attr
          @name areaStackedVertical#areaStackedVertical
          @param [areaStackedVertical=zero] {expression}
      ###
      attrs.$observe 'areaStackedVertical', (val) ->
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