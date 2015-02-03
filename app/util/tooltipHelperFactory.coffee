angular.module('wk.chart').factory 'tooltipHelperFactory', ($log) ->

  helperCnt = 0

  ttHelpers = () ->
    _keyScale = undefined
    _valueScale = undefined
    _isStacked = false
    _colorScale = undefined
    _layout = undefined
    _value = undefined
    _indexer = undefined
    _brushRange = []
    _circles = undefined
    _id = helperCnt++

    me = {}

    me.keyScale = (val) ->
      if arguments.length is 0 then return _keyScale
      _keyScale = val
      return me

    me.valueScale = (val) ->
      if arguments.length is 0 then return _valueScale
      _valueScale = val
      _isRangeScale = _valueScale.kind() is 'rangeX' or _valueScale.kind() is 'rangeY'
      return me

    me.isStacked = (val) ->
      if arguments.length is 0 then return _isStacked
      _isStacked = val
      return me

    me.colorScale = (val) ->
      if arguments.length is 0 then return _colorScale
      _colorScale = val
      return me

    me.layout = (val) ->
      if arguments.length is 0 then return _layout
      _layout = val
      _indexer = []
      _brushRange = [0, _layout[0].values.length - 1]
      for d, i in _layout[0].values
        if not d.deleted
          _indexer.push(i)
      return me

    me.brushRange = (val) ->
      if arguments.length is 0 then return _brushRange
      _brushRange = val

    me.value = (val) ->
      if arguments.length is 0 then return _value
      _value = val
      return me

    me.enter = (data) ->
      @headerName = _keyScale.axisLabel()
      @headerValue  = _keyScale.formattedValue(data)
      layerKeys = _valueScale.layerKeys(data)
      @layers = @layers.concat(layerKeys.map((key) -> {name:key, value:_valueScale.formatValue(data[key]), color: {'background-color': _colorScale.scale()(key)}}))

    me.moveData = (key, data) ->
      me.enter.apply(this, [data])

    me.moveMarkers = (key, data) ->
      markerKey = _keyScale.value(data) # use the data objects key instead of the inversion result to ensure marker snaps to data.
      layerKeys = _valueScale.layerKeys(data)
      cData = layerKeys.map((key) -> {key: key, value: _valueScale.layerValue(data, key)})
      if _isStacked
        #total up the values to position the markers correctly
        sum = 0
        for l in cData
          sum = sum + l.value
          l.value = sum

      _circles = this.selectAll(".wk-chart-tt-marker-#{_id}").data(cData, (d) -> d.key)
      enter = _circles.enter().append('g').attr('class', "wk-chart-tt-marker-#{_id}") # make markers unique for multi-layout charts
      enter.append('circle').attr('class', 'wk-chart-tt-marker')
        .attr('r', 9)
        .style('fill', (d)-> _colorScale.scale()(d.key))
        .style('fill-opacity', 0.3)
        .style('stroke', (d)-> _colorScale.scale()(d.key))
        .style('pointer-events', 'none')
      enter.append('circle').attr('class', 'wk-chart-tt-inner-marker')
        .attr('r', 4)
        .style('fill', (d)-> _colorScale.scale()(d.key))
        .style('fill-opacity', 0.6)
        .style('stroke', 'white')
        .style('pointer-events', 'none')
      c = if _keyScale.isHorizontal() then 'cy' else 'cx'
      _circles.select('.wk-chart-tt-marker')
        .attr(c, (d) -> _valueScale.scale()(d.value))
      _circles.select('.wk-chart-tt-inner-marker')
      .attr(c, (d) -> _valueScale.scale()(d.value))
      _circles.exit()
        .remove()
      offset = if _keyScale.isOrdinal() then _keyScale.scale().rangeBand() / 2 else 0
      if _keyScale.isHorizontal()
        this.attr('transform', "translate(#{_keyScale.scale()(markerKey) + offset})") # need to compute from scale because of brushing
      else
        this.attr('transform', "translate(0,#{_keyScale.scale()(markerKey) + offset})")  # need to compute from scale because of brushing + offset
    return me

  return ttHelpers



