angular.module('wk.chart').factory 'wkHistogram', ($log, barConfig, utils, wkChartMargins) ->
  sHistoCntr = 0

  wkHistogram = ()->
    me = ()->

    _layout = undefined
    _id = "histogram#{sHistoCntr++}"
    _scaleList = {}
    buckets = undefined
    labels = undefined
    config = {}

    _tooltip = undefined
    _selected = undefined
    config = _.clone(barConfig, true)

    _merge = utils.mergeData().key((d)-> d.xVal)

    initial = true

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    _tooltip = undefined

    ttEnter = (data) ->
      @headerName = _scaleList.rangeX.axisLabel()
      @headerValue = _scaleList.y.axisLabel()
      lower = _scaleList.rangeX.formatValue(_scaleList.rangeX.lowerValue(data.data))
      if _scaleList.rangeX.upperProperty()
        upper = _scaleList.rangeX.formatValue(_scaleList.rangeX.upperValue(data.data))
        name = lower + ' - ' + upper
      else
        name = _scaleList.rangeX.formatValue(_scaleList.rangeX.lowerValue(data.data))

      @layers.push({name: name, value: _scaleList.y.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color, size, shape, rangeX) ->

      if rangeX.upperProperty()
        layout = data.map((d) -> {x:rangeX.scale()(rangeX.lowerValue(d)), xVal:rangeX.lowerValue(d), width:rangeX.scale()(rangeX.upperValue(d)) - rangeX.scale()(rangeX.lowerValue(d)), y:y.map(d), height:options.height - y.map(d), color:color.map(d), data:d})
      else
        if data.length > 0
          start = rangeX.lowerValue(data[0])
          step = rangeX.lowerValue(data[1]) - start
          width = options.width / data.length
          layout = data.map((d, i) -> {x:rangeX.scale()(start + step * i), xVal:rangeX.lowerValue(d), width:width, y:y.map(d), height:options.height - y.map(d), color:color.map(d), data:d})

      _merge(layout).first({x:0, width:0}).last({x:options.width, width: 0})

      if not buckets
        buckets = @selectAll('.wk-chart-bucket')

      buckets = buckets.data(layout, (d) -> d.xVal)

      enter = buckets.enter().append('g').attr('class','wk-chart-bucket')
        .attr('transform', (d) -> "translate(#{if initial then d.x else _merge.addedPred(d).x  + _merge.addedPred(d).width},#{d.y}) scale(#{if initial then 1 else 0},1)")
      enter.append('rect')
        .attr('class', 'wk-chart-selectable')
        .attr('height', (d) -> d.height)
        .attr('width', (d) -> d.width)
        .style('fill',(d) -> d.color)
        .style('opacity', if initial then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)
      enter.append('text')
        .attr('class','wk-chart-data-label')
        .attr('x', (d) -> d.width / 2)
        .attr('y', -wkChartMargins.dataLabelPadding.vert)
        .attr({'text-anchor':'middle'})
        .style({opacity: 0})

      buckets.transition().duration(options.duration)
        .attr("transform", (d) -> "translate(#{d.x}, #{d.y}) scale(1,1)")
      buckets.select('rect').transition().duration(options.duration)
        .attr('width', (d) -> d.width)
        .attr('height', (d) -> d.height)
        .style('fill',(d) -> d.color)
        .style('opacity',1)
      buckets.select('text')
        .text((d) -> y.formattedValue(d.data))
        .transition().duration(options.duration)
          .attr('x', (d) -> d.width / 2)
          .style('opacity', if host.showDataLabels() then 1 else 0)

      buckets.exit().transition().duration(options.duration)
        .attr('transform', (d) -> "translate(#{_merge.deletedSucc(d).x},#{d.y}) scale(0,1)")
        .remove()

      initial = false

    brush = (axis, idxRange, width, height) ->
      bucketWidth = (axis, d) ->
        if axis.upperProperty()
          return axis.scale()(axis.upperValue(d.data)) - axis.scale()(axis.lowerValue(d.data))
        else
          return width / Math.max(idxRange[1] - idxRange[0] + 1, 1)

      buckets
        .attr('transform',(d) ->
          null
          "translate(#{if (x = axis.scale()(d.xVal)) >= 0 then x else -1000}, #{d.y})")
      buckets.select('rect')
        .attr('width', (d) -> bucketWidth(axis, d))
      buckets.selectAll('text')
        .attr('x',(d) -> bucketWidth(axis, d) / 2)

    #-----------------------------------------------------------------------------------------------------------------
    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['rangeX', 'y', 'color'])
        @getKind('y').domainCalc('max').resetOnNewData(true)
        @getKind('rangeX').resetOnNewData(true).scaleType('linear').domainCalc('rangeExtent')
        @getKind('color').resetOnNewData(true)
        _tooltip = _layout.behavior().tooltip
        _selected = _layout.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      _layout.lifeCycle().on 'drawChart', draw
      _layout.lifeCycle().on 'brushDraw', brush
      return me
    return me
  return wkHistogram