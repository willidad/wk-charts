angular.module('wk.chart').factory 'behaviorAxisBrush', ($log, $window, selectionSharing, d3Animation) ->

  behaviorAxisBrush = () ->
    _area = undefined
    _container = undefined
    _chart = undefined;
    _x = undefined
    _y = undefined
    _horizontal = true;
    _axis = undefined;
    _axisName = 'x';
    _axisAttr = 'width';
    _cursor = 'ew-resize'
    _axisG = undefined
    _axisBox = undefined
    _areaBox = undefined
    _axisBG = undefined
    _axisRect1 = undefined
    _axisRect2 = undefined
    _axisExtent = undefined
    _handle1 = undefined
    _handle2 = undefined
    _box1 = undefined
    _box2 = undefined
    _text1 = undefined
    _text2 = undefined
    _box1Bg = undefined
    _box2Bg = undefined
    _fullSize = undefined

    _startPos = undefined
    _pos1 = undefined
    _pos2 = undefined
    _pos1Start = undefined
    _pos2Start = undefined

    _pos1Value = ''
    _pos2Value = ''
    _empty = true


    me = {}

    me.area = (val) ->
      if arguments.length is 0 then return _area
      _area = val
      return me

    me.chart = (val) ->
      if arguments.length is 0 then return _chart
      _chart = val
      return me

    me.x = (val) ->
      if arguments.length is 0 then return _x
      _x = val
      if val
        _axis = _x
        _horizontal = true
        _axisName = 'x'
        _axisAttr = 'width'
        _cursor = 'ew-resize'
      return me

    me.y = (val) ->
      if arguments.length is 0 then return _y
      _y = val
      if val
        _axis = _y
        _horizontal = false
        _axisName = 'y';
        _axisAttr = 'height';
        _cursor = 'ns-resize'
      return me

    me.axisBrush = (s) -> # expects axis selector
      return me

    me.container = (val) ->
      if arguments.length is 0 then return _container
      _container = val
      # create brush elements
      if not _axis then return
      _fullSize = not _axis.isOrdinal()
      _axisG = _container.select(".wk-chart-axis.wk-chart-#{_axis.axisOrient()}")
      _axisBox = _axisG.node().getBBox()
      _areaBox = _area.node().getBBox()

      _axisBG = _container.select('.wk-chart-axis-brush')
      if _axisBG.empty()  # create the brush elements
        _axisBG = _axisG.append('rect').attr('class','wk-chart-axis-bg').style('opacity', 0).style('cursor','crosshair')
        _axisRect1 = _axisG.append('rect').attr('class','wk-chart-axis-brush').style('opacity', 0.05).style('cursor','crosshair').style('pointer-events', 'none')
        _axisExtent = _axisG.append('rect').attr('class','wk-chart-axis-brush-extent').style('opacity', 0.2).style('cursor','move')
        _axisRect2 = _axisG.append('rect').attr('class','wk-chart-axis-brush').style('opacity', 0.05).style('cursor','crosshair').style('pointer-events', 'none')
        _handle1 = _axisG.append('rect').attr('class','wk-chart-axis-brush-line').style('cursor',_cursor)
        _handle2 = _axisG.append('rect').attr('class','wk-chart-axis-brush-line').style('cursor',_cursor)
        _box1 = _axisG.append('g').attr('class','wk-chart-axis-brush-box')
        _box2Bg = _box1.append('rect')
        _box2 = _axisG.append('g').attr('class','wk-chart-axis-brush-box')
        _box1Bg = _box2.append('rect')

      if _horizontal
        _axisBG.attr({x:0, y:0, height:_axisBox.height + 3, width:_areaBox.width})
        _axisRect1.attr('height', _axisBox.height + 3 + if _fullSize then _areaBox.height else 0).attr('y', if _fullSize then -_areaBox.height else 0)
        _axisRect2.attr('height', _axisBox.height + 3 + if _fullSize then _areaBox.height else 0).attr('y', if _fullSize then -_areaBox.height else 0)
        _axisExtent.attr('height', _axisBox.height + 3)
        _handle1.attr({y:-_areaBox.height, width: 3, height:_areaBox.height + _axisBox.height + 6})
        _handle2.attr({y:-_areaBox.height, width: 3, height:_areaBox.height + _axisBox.height + 6})
        _text1 = _box1.append('text').attr('class','wk-chart-axis-brush-text').attr('text-anchor', 'left').attr('dy', '.71em')
        _text2 = _box2.append('text').attr('class','wk-chart-axis-brush-text').attr('text-anchor', 'left').attr('dy', '.71em')
      else
        _axisBG.attr({x:-_axisBox.width, y:0, height:_areaBox.height + 3, width:_axisBox.width})
        _axisRect1.attr('x', -_axisBox.width - 6).attr('width', _axisBox.width + 3 + if _fullSize then _areaBox.width else 0)
        _axisRect2.attr('x', -_axisBox.width - 6).attr('width', _axisBox.width + 3 + if _fullSize then _areaBox.width else 0)
        _axisExtent.attr('x', -_axisBox.width - 6).attr('width', _axisBox.width + 3)
        _handle1.attr({x:-_axisBox.width - 6, height: 3, width:_areaBox.width + _axisBox.width + 6})
        _handle2.attr({x:-_axisBox.width - 6, height: 3, width:_areaBox.width + _axisBox.width + 6})
        _text1 = _box1.append('text').attr('class','wk-chart-axis-brush-text').attr('text-anchor', 'left').attr('dy', '.31em')
        _text2 = _box2.append('text').attr('class','wk-chart-axis-brush-text').attr('text-anchor', 'left').attr('dy', '.31em')

      _axisBG.on('mousedown.axisBrushSet', brushStart)
      _axisExtent.on('mousedown.axisBrushExtent', extentStart)
      _handle1.on('mousedown.axisBrushLeft', leftStart)
      _handle2.on('mousedown.axisBrushRight', rightStart)

      return me

    getAxisValue = (value) ->
      if _horizontal then _x.formatValue(_x.invert(value)) else _y.formatValue(_y.invert(value))

    limit = (pos) ->
      if _horizontal then _areaBox.width else _areaBox.height

    setPos1 = (pos) ->
      if pos >= 0 and pos <= limit()
        _pos1 = pos
      _pos1Value = getAxisValue(_pos1)

    setPos2 = (pos) ->
      if pos >= 0 and pos <= limit()
        _pos2 = pos
      _pos2Value = getAxisValue(_pos2)

    setSelection = () ->
      # get values from data
      if (_axis.isOrdinal())
        range = _axis.range()
        reverse = range[0] > range[range.length - 1]
        keys  = _axis.getDomain()
        band = _axis.scale().rangeBand()
        # get the lower index
        minVal = Math.min(_pos1, _pos2)
        maxVal = Math.max(_pos1, _pos2)

        if reverse
          i = 0
          l = range.length
          upperIdx = range.length - 1
          while i < l
            if minVal >= range[i] + band
              upperIdx = i - 1;
              break
            i++
          i = range.length
          lowerIdx = 0
          while i >= 0
            if maxVal <= range[i]
              lowerIdx = i + 1
              break
            i--
        else
          i = 0
          l = range.length
          lowerIdx = range.length - 1
          while i < l
            if minVal <= range[i] + band
              lowerIdx = i;
              break
            i++
          i = range.length
          upperIdx = 0
          while i >= 0
            if maxVal >= range[i]
              upperIdx = i
              break
            i--

        if upperIdx >= lowerIdx or (_axis.isVertical() and upperIdx <= lowerIdx)
          _selectedKeys = keys.slice(Math.min(lowerIdx, upperIdx), Math.max(lowerIdx,upperIdx) + 1)
        else
          _selectedKeys = []
        _container.selectAll('.wk-chart-selectable').each((d) -> d3.select(this).classed('wk-chart-selected', d.key in _selectedKeys).classed('wk-chart-not-selected', not (d.key in _selectedKeys)))

    positionBrush = () ->
      _axisRect1.attr(_axisName, 0).attr(_axisAttr, Math.min(_pos1, _pos2))
      _axisRect2.attr(_axisName, Math.max(_pos1, _pos2)).attr(_axisAttr, _areaBox.width - Math.max(_pos1, _pos2))
      _axisExtent.attr(_axisName, Math.min(_pos1, _pos2)).attr(_axisAttr, Math.abs(_pos2 - _pos1))
      _handle1.attr(_axisName, _pos1)
      _handle2.attr(_axisName, _pos2)
      _text1.text(_pos1Value)
      _box1Rect = _text1.node().getBBox()
      _box1Bg.attr(_box1Rect)
      _text2.text(_pos2Value)
      _box2Rect = _text2.node().getBBox()
      _box2Bg.attr(_box2Rect)
      if _horizontal
        _box1.attr('transform', "translate(#{Math.min(Math.max(_pos1 - _box1Rect.width / 2, 0),_areaBox.width - _box1Rect.width)}, #{-_areaBox.height})")
        _box2.attr('transform', "translate(#{Math.min(Math.max(_pos2 - _box2Rect.width / 2, 0),_areaBox.width - _box2Rect.width)}, #{-_areaBox.height})")
      else
        _box1.attr('transform', "translate(#{_areaBox.width - _box1Rect.width}, #{Math.min(Math.max(_pos1, _box1Rect.height / 2),_areaBox.height - _box1Rect.height / 2)})")
        _box2.attr('transform', "translate(#{_areaBox.width - _box2Rect.width}, #{Math.min(Math.max(_pos2, _box1Rect.height / 2),_areaBox.height - _box2Rect.height / 2)})")
      setSelection()

    mousePos = () ->
      if _horizontal then d3.mouse(_axisBG.node())[0] else d3.mouse(_axisBG.node())[1]


    brushStart = (d) ->
      _startPos = mousePos()
      w = d3.select($window)

      w.on('mousemove.axisBrush', brushMove)
      w.on('mouseup.axisBrush', brushEnd)
      d3.select('body').style('cursor', 'crosshair')

    extentStart = (d) ->
      _startPos = mousePos()
      _pos1Start = _pos1
      _pos2Start = _pos2
      w = d3.select($window)
      w.on('mousemove.axisBrushExtent', extentMove)
      w.on('mouseup.axisBrush', brushEnd)
      d3.select('body').style('cursor', 'move')

    leftStart = (d) ->
      w = d3.select($window)
      w.on('mousemove.axisBrushLeft', leftMove)
      w.on('mouseup.axisBrush', brushEnd)
      d3.select('body').style('cursor', 'ew-resize')

    rightStart = (d) ->
      w = d3.select($window)
      w.on('mousemove.axisBrushRight', rightMove)
      w.on('mouseup.axisBrush', brushEnd)
      d3.select('body').style('cursor', 'ew-resize')

    brushMove = (d) ->
      p = mousePos()
      setPos1(Math.min(_startPos, p))
      setPos2(Math.max(_startPos, p))
      positionBrush()

    extentMove = (d) ->
      delta = mousePos() - _startPos
      if not (_pos1Start + delta <= 0 or _pos2Start + delta > limit())
        setPos1(_pos1Start + delta)
        setPos2(_pos2Start + delta)
        positionBrush()

    leftMove = (d) ->
      p = mousePos()
      setPos1(p)
      positionBrush()

    rightMove = (d) ->
      p = mousePos()
      setPos2(p)
      positionBrush()

    brushEnd = (d) ->
      w = d3.select($window)
      w.on('mousemove.axisBrush', undefined)
      w.on('mousemove.axisBrushExtent', undefined)
      w.on('mousemove.axisBrushLeft', undefined)
      w.on('mousemove.axisBrushRight', undefined)
      w.on('mouseup.axisBrush', undefined)
      d3.select('body').style('cursor', undefined)


    return me
  return behaviorAxisBrush
