angular.module('wk.chart').factory 'tooltipHelperFactory', ($log) ->

  helperCnt = 0

  ttHelpers = () ->
    _keyScale = undefined
    _valueScale = undefined
    _colorScale = undefined
    _layout = undefined
    _value = undefined
    _indexer = undefined
    _brushRange = []
    _id = helperCnt++

    me = {}

    me.keyScale = (val) ->
      if arguments.length is 0 then return _keyScale
      _keyScale = val
      return me

    me.valueScale = (val) ->
      if arguments.length is 0 then return _valueScale
      _valueScale = val
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

    _getLayoutIdx = (idx) ->
      return _indexer[idx] + _brushRange[0]
      ###
      if _keyScale.isOrdinal()
        domainVal = _keyScale.scale().domain()[idx] # the index returned is really an index into the domain values, not into _layout or data. Is different if brushed or has deleted items at beginning
        if idx is domainVal then return idx # do not need to search if the same (true if not brushed or deleted items at beginning
        for d, i in _layout[0].values
          key = _keyScale.value(d.data)
          if domainVal is key then return i
          if +key is +domainVal then return i  # deal with date values and implicitly converted string numbers
        return undefined
      else
        return idx
      ###
    me.enter = (value) ->
      @headerName = _keyScale.axisLabel()
      @headerValue  = _valueScale.axisLabel()
      @layers = @layers.concat({name:_keyScale.formatValue(value.targetKey), value:_valueScale.formatValue(value.value), color: {'background-color': _colorScale.map(value.data)}})

    me.moveData = (idx) ->
      lIdx = _getLayoutIdx(idx) # for ordinal scales, the index returned is really an index into the domain values, not into _layout or data. Is different if brushed or has deleted items at beginning
      ttLayers = _layout.filter((d) -> not d.deleted).map((d) -> {name: d.layerKey, value: _valueScale.formatValue(d.values[lIdx].value), color: {'background-color': _colorScale.scale()(d.layerKey)}})
      @headerName = _keyScale.axisLabel()
      @headerValue = _keyScale.formattedValue(_layout[0].values[lIdx].data)
      @layers = @layers.concat(ttLayers)

    me.moveMarkers = (idx) ->
      lIdx = _getLayoutIdx(idx)
      _circles = this.selectAll(".wk-chart-tt-marker-#{_id}").data(_layout.filter((d) -> not d.deleted), (d) -> d.layerKey)
      enter = _circles.enter().append('g').attr('class', "wk-chart-tt-marker-#{_id}") # make markers unique for multi-layout charts
      enter.append('circle').attr('class', 'wk-chart-tt-marker')
        .attr('r', 9)
        .style('fill', (d)-> _colorScale.scale()(d.layerKey))
        .style('fill-opacity', 0.3)
        .style('stroke', (d)-> _colorScale.scale()(d.layerKey))
        .style('pointer-events', 'none')
      enter.append('circle').attr('class', 'wk-chart-tt-marker')
        .attr('r', 4)
        .style('fill', (d)-> _colorScale.scale()(d.layerKey))
        .style('fill-opacity', 0.6)
        .style('stroke', 'white')
        .style('pointer-events', 'none')
      _circles.selectAll('circle')
        .attr((if _keyScale.isHorizontal() then 'cy' else 'cx'), (d) -> _valueScale.scale()(_value(d.values[lIdx])))
      _circles.exit()
        .remove()
      offset = if _keyScale.isOrdinal() then _keyScale.scale().rangeBand() / 2 else 0
      if _keyScale.isHorizontal()
        this.attr('transform', "translate(#{_keyScale.map(_layout[0].values[lIdx].data) + offset})") # need to compute from scale because of brushing
      else
        this.attr('transform', "translate(0,#{_keyScale.map(_layout[0].values[lIdx].data) + offset})") # need to compute from scale because of brushing + offset
    return me

  return ttHelpers



