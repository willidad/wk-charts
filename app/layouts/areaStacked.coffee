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

angular.module('wk.chart').directive 'areaStacked', ($log, utils, tooltipUtils, dataManagerFactory) ->
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

      xData = dataManagerFactory()
      layoutData = undefined

      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      ttMoveData = (idx) ->
        ttLayers = layerData.map((l) -> {name:l.key, value:_scaleList.y.formatValue(l.layer[idx].yy), color: {'background-color': l.color}})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(layerData[0].layer[idx].x)
        @layers = @layers.concat(ttLayers)

      ttMoveMarker = (idx) ->
        _circles = this.selectAll(".wk-chart-marker-#{_id}").data(layerData, (d) -> d.key)
        _circles.enter().append('g').attr('class',"wk-chart-marker-#{_id}").call(tooltipUtils.createTooltipMarkers)
        _circles.selectAll('circle').attr('cy', (d) -> scaleY(d.layer[idx].y + d.layer[idx].y0))
        _circles.exit().remove()

        this.attr('transform', "translate(#{_scaleList.x.scale()(layerData[0].layer[idx].x)+offs})")

      #-------------------------------------------------------------------------------------------------------------------

      getLayerByKey = (key, layout) ->
        for l in layout
          if l.key is key
            return l

      stackLayout = stack.values((d)->d.value).y((d) -> d.y)

      #--- Draw --------------------------------------------------------------------------------------------------------

      setAnimationStart = (data, options, x, y, color) ->
        layerKeys = y.layerKeys(data)
        if x.scaleType() is 'time'
          xData.key((d)-> +x.value(d)) # convert to number
        else
          xData.key(x.value)
        xData.data(data).keyScale(x)

        if not xData.isInitial()
          animationStartPath = xData.getMergedOld()
          layoutData = layerKeys.map((key) -> {key:key, color: color.scale()(key), value: animationStartPath.map((d) -> {x:d.key, y:y.layerValue(d.data,key), color:color.scale()(key), data:d.data})})
          drawPath.apply(this, [false, layoutData, options, x, y, color])

      setAnimationEnd = (data, options, x, y, color) ->
        layerKeys = y.layerKeys(data)
        animationEndPath = xData.getMergedNew()
        layoutData = layerKeys.map((key) -> {key:key, color: color.scale()(key), value: animationEndPath.map((d) -> {x:d.key, y:y.layerValue(d.data,key), y0:0, color:color.scale()(key), data:d.data})})
        drawPath.apply(this, [true, layoutData, options, x, y, color])
        layerKeysOld = layerKeys

      drawPath = (doAnimate, data, options, x, y, color) ->


      #draw = (data, options, x, y, color) ->
        #$log.log "rendering Area Chart"


        #layerKeys = y.layerKeys(data)
        #deletedSucc = utils.diff(layerKeysOld, layerKeys, 1)
        #addedPred = utils.diff(layerKeys, layerKeysOld, -1)

        #layerData = layerKeys.map((k) => {key: k, color:color.scale()(k), layer: data.map((d) -> {x: x.value(d), yy: +y.layerValue(d,k), y0: 0, data:d})}) # yy: need to avoid overwriting by layout calc -> see stack y accessor
        layoutNew = stackLayout(data)

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

        enter = layers.enter()
          .append('path').attr('class', 'wk-chart-area-path')
          .style('pointer-events', 'none')
          .style('opacity', 0)
        #if layoutOld.length > 0
        #  enter.attr('d', (d) -> if addedPred[d.key] then getLayerByKey(addedPred[d.key], layoutOld).path else area(d.layer.map((p) ->  {x: p.x, y: 0, y0: 0})))

        updLayers = layers
          .style('fill', (d, i) -> color.scale()(d.key))
          .style('stroke', (d, i) -> color.scale()(d.key))

        updLayers = if doAnimate then updLayers.transition().duration(options.duration) else updLayers

        updLayers
          .attr('transform', "translate(#{offs})")
          .attr('d', (d) -> area(d.value))
          .style('opacity', 1)

        layers.exit() #.transition().duration(options.duration)
          #.attr('d', (d) ->
          #  succ = deletedSucc[d.key]
          #  if succ then area(getLayerByKey(succ, layoutNew).layer.map((p) -> {x: p.x, y: 0, y0: p.y0})) else area(layoutNew[layoutNew.length - 1].layer.map((p) -> {x: p.x, y: 0, y0: p.y0 + p.y}))
          #)
          .remove()

        #layoutOld = layoutNew.map((d) -> {key: d.key, path: area(d.layer.map((p) -> {x: p.x, y: 0, y0: p.y + p.y0}))})
        #layerKeysOld = layerKeys

      brush = (axis, idxRange) ->
        layers = this.selectAll(".wk-chart-area-path")
        if axis.isOrdinal()
          layers.attr('d', (d) -> area(d.value.slice(idxRange[0],idxRange[1] + 1)))
        else
          layers.attr('d', (d) -> area(d.value))

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

      #host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', brush
      host.lifeCycle().on 'animationStartState', setAnimationStart
      host.lifeCycle().on 'animationEndState', setAnimationEnd

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