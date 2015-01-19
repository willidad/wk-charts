###*
  @ngdoc layout
  @name rangeArea
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a range-area chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension rangeY [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
  @example
###

angular.module('wk.chart').directive 'rangeArea', ($log, utils, tooltipUtils) ->
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
    _id = 'rangeArea' + lineCntr++
    area = undefined
    areaBrush = undefined
    m = []

    #--- Tooltip handlers --------------------------------------------------------------------------------------------

    ttEnter = (idx) ->
      _pathArray = _pathValuesNew
      ttMoveData.apply(this, [idx])
      _circles = undefined
      m = [
        {i:1, y:_pathArray[idx].y0, color:_pathArray[idx].color},
        {i:2, y:_pathArray[idx].y1, color:_pathArray[idx].color}
      ]

    ttMoveData = (idx) ->
      datum = _pathArray[idx].data
      ttLayers = []
      ttLayers.push({name:_scaleList.rangeY.lowerProperty(),value:_scaleList.rangeY.formatValue(_scaleList.rangeY.lowerValue(datum)), color:{'background-color': _pathArray[idx].color}})
      ttLayers.push({name:_scaleList.rangeY.upperProperty(),value:_scaleList.rangeY.formatValue(_scaleList.rangeY.upperValue(datum)), color:{'background-color': _pathArray[idx].color}})
      @headerName = _scaleList.x.axisLabel()
      @headerValue = _scaleList.x.formattedValue(datum)
      @layers = @layers.concat(ttLayers)

    ttMoveMarker = (idx) ->
      m[0].y = _pathArray[idx].y0
      m[1].y = _pathArray[idx].y1
      if not _circles
        _circles = this.selectAll(".wk-chart-marker-#{_id}")
      _circles = _circles.data(m, (d) -> d.i)
      _circles.enter().append('g').attr('class', "wk-chart-marker-#{_id}").call(tooltipUtils.createTooltipMarkers)
      _circles.selectAll('circle').attr('cy', (d) -> d.y)
      _circles.exit().remove()
      this.attr('transform', "translate(#{_scaleList.x.scale()(_pathArray[idx].xv) + offset})")

    #-----------------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color, size, shape, rangeX, rangeY) ->

      mergedX = utils.mergeSeriesUnsorted(x.value(_dataOld), x.value(data))
      _layout = []

      _pathValuesNew = []

      _pathValuesNew = data.map((d)-> {x:x.map(d),y1:rangeY.scale()(rangeY.upperValue(d)), y0:rangeY.scale()(rangeY.lowerValue(d)), xv:x.value(d), yv1:rangeY.upperValue(d), yv0:rangeY.lowerValue(d), color:color.scale()(0), data:d})

      oldFirst = newFirst = undefined

      layer = {value:[], color:color.scale()(0)}
      # find starting value for old
      i = 0
      while i < mergedX.length
        if mergedX[i][0] isnt undefined
          oldFirst = _pathValuesOld[mergedX[i][0]]
          break
        i++
      # find starting value for new

      while i < mergedX.length
        if mergedX[i][1] isnt undefined
          newFirst = _pathValuesNew[mergedX[i][1]]
          break
        i++
      for val, i in mergedX
        v = {x:val[2]}
        # set x and y values for old values. If there is a added value, maintain the last valid position
        if val[1] is undefined #ie an old value is deleted, maintain the last new position
          v.y0New = newFirst.y0
          v.y1New = newFirst.y1
          v.xNew = newFirst.x # animate to the predesessors new position
          v.deleted = true
        else
          v.y0New = _pathValuesNew[val[1]].y0
          v.y1New = _pathValuesNew[val[1]].y1
          v.xNew = _pathValuesNew[val[1]].x
          newFirst = _pathValuesNew[val[1]]
          v.deleted = false

        if _dataOld.length > 0
          if  val[0] is undefined # ie a new value has been added
            v.y0Old = oldFirst.y0
            v.y1Old = oldFirst.y1
            v.xOld = oldFirst.x # start x-animation from the predecessors old position
          else
            v.y0Old = _pathValuesOld[val[0]].y0
            v.y1Old = _pathValuesOld[val[0]].y1
            v.xOld = _pathValuesOld[val[0]].x
            oldFirst = _pathValuesOld[val[0]]
        else
          v.xOld = v.xNew
          v.y0Old = v.y0New
          v.y1Old = v.y1New

        layer.value.push(v)

      offset = if x.isOrdinal() then x.scale().rangeBand() / 2 else 0

      if _tooltip then _tooltip.data(data)

      areaOld = d3.svg.area()
      .x((d) ->  d.xOld)
      .y0((d) ->  d.y0Old)
      .y1((d) ->  d.y1Old)

      areaNew = d3.svg.area()
      .x((d) ->  d.xNew)
      .y0((d) ->  d.y0New)
      .y1((d) ->  d.y1New)

      areaBrush = d3.svg.area()
      .x((d) ->  x.scale()(d.x))
      .y0((d) ->  d.y0New)
      .y1((d) ->  d.y1New)

      path = this.selectAll(".wk-chart-area-path").data([layer])
      enter = path.enter().append('path')
        .attr('class','wk-chart-area-path')
        .style('stroke', (d) -> d.color)
        .style('fill', (d) -> d.color)
        .style('opacity', 0)
        .style('pointer-events', 'none')

      path.attr('transform', "translate(#{offset})")
        .attr('d', (d) -> areaOld(d.value))
        .transition().duration(options.duration)
          .attr('d', (d) -> areaNew(d.value))
          .style('opacity', 0.7).style('pointer-events', 'none')

      path.exit().transition().duration(options.duration)
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
      _scaleList = @getScales(['x', 'rangeY', 'color'])
      @layerScale('color')
      @getKind('rangeY').domainCalc('extent').resetOnNewData(true)
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