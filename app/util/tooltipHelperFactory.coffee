angular.module('wk.chart').factory 'tooltipHelperFactory', ($log) ->

  helperCnt = 0

  ttHelpers = () ->
    _keyScale = undefined
    _valueScale = undefined
    _colorScale = undefined
    _layout = undefined
    _value = undefined
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
      return me

    me.value = (val) ->
      if arguments.length is 0 then return _value
      _value = val
      return me

    _getLayoutIdx = (idx) ->
      if _keyScale.isOrdinal()
        domainVal = _keyScale.scale().domain()[idx] # the index returned is really an index into the domain values, not into _layout or data. Is different if brushed or has deleted items at beginning
        if idx is domainVal then return idx # do not need to search if the same (true if not brushed or deleted items at beginning
        for d, i in _layout[0].values
          key = _keyScale.value(d.data.data)
          if domainVal is key then return i
          if +key is +domainVal then return i  # deal with date values and implicitly converted string numbers
        return undefined
      else
        return idx

    me.moveData = (idx) ->
      lIdx = _getLayoutIdx(idx) # for ordinal scales, the index returned is really an index into the domain values, not into _layout or data. Is different if brushed or has deleted items at beginning
      ttLayers = _layout.filter((d) -> not d.deleted).map((d) -> {name: d.layerKey, value: _valueScale.formatValue(d.values[lIdx].value), color: {'background-color': _colorScale.scale()(d.layerKey)}})
      @headerName = _keyScale.axisLabel()
      @headerValue = _keyScale.formattedValue(_layout[0].values[lIdx].data.data)
      @layers = @layers.concat(ttLayers)

    me.moveMarkers = (idx) ->
      lIdx = _getLayoutIdx(idx)
      _circles = this.selectAll(".wk-chart-tt-marker-#{_id}").data(_layout.filter((d) -> not d.deleted), (d) -> d.layerKey)
      enter = _circles.enter().append('g').attr('class', "wk-chart-tt-marker-#{_id}") # TODO ensure markers are unique for multi-layout charts
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
        this.attr('transform', "translate(#{_keyScale.map(_layout[0].values[lIdx].data.data) + offset})") # need to compute from scale because of brushing
      else
        this.attr('transform', "translate(0,#{_keyScale.map(_layout[0].values[lIdx].data.data) + offset})") # need to compute from scale because of brushing + offset
    return me

  return ttHelpers



