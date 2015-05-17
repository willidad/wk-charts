angular.module('wk.chart').factory 'behaviorAxisBrush', ($log, $window, selectionSharing, d3Animation) ->

  behaviorAxisBrush = () ->
    _area = undefined
    _container = undefined
    _chart = undefined;
    _x = undefined
    _y = undefined
    _axis = undefined;
    _axisG = undefined
    _axisBox = undefined
    _areaBox = undefined
    _axisRect = undefined
    _axisRectLeft = undefined
    _axisRectRight = undefined
    _axisExtent = undefined
    _leftHandle = undefined
    _rightHandle = undefined
    _leftBox = undefined
    _rightBox = undefined
    _leftText = undefined
    _rightText = undefined
    _rightBoxBg = undefined
    _leftBoxBg = undefined

    _startX = undefined
    _leftPos = undefined
    _rightPos = undefined
    _leftStartPos = undefined
    _rightStartPos = undefined

    _leftValue = ''
    _rightValue = ''
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
      axis = _y || _x
      return me

    me.y = (val) ->
      if arguments.length is 0 then return _y
      _y = val
      _axis = _y || _x
      return me

    me.axisBrush = (s) -> # expects axis selector
      return me

    me.container = (val) ->
      if arguments.length is 0 then return _container
      _container = val
      # create brush elements
      if not _axis then return
      _axisG = _container.select(".wk-chart-axis.wk-chart-#{_axis.axisOrient()}")
      _axisBox = _axisG.node().getBBox()
      _areaBox = _area.node().getBBox()

      _axisRect = _container.select('.wk-chart-axis-brush')
      if _axisRect.empty()  # create the brush elements
        _axisRect = _axisG.append('rect').attr('class','wk-chart-axis-brush').style('opacity', 0).style('cursor','crosshair')
        _axisRectLeft = _axisG.append('rect').attr('class','wk-chart-axis-brush-left').style('opacity', 0.1).style('cursor','crosshair').style('pointer-events', 'none')
        _axisExtent = _axisG.append('rect').attr('class','wk-chart-axis-brush-extent').style('opacity', 0.2).style('cursor','move')
        _axisRectRight = _axisG.append('rect').attr('class','wk-chart-axis-brush-right').style('opacity', 0.1).style('cursor','crosshair').style('pointer-events', 'none')
        _leftHandle = _axisG.append('rect').attr('class','wk-chart-axis-brush-line-left').style('cursor','ew-resize')
        _rightHandle = _axisG.append('rect').attr('class','wk-chart-axis-brush-line-right').style('cursor','ew-resize')
        _leftBox = _axisG.append('g').attr('class','wk-chart-axis-brush-box-left')
        _leftBoxBg = _leftBox.append('rect')
        _rightBox = _axisG.append('g').attr('class','wk-chart-axis-brush-box-right')
        _rightBoxBg = _rightBox.append('rect')
        _leftText = _leftBox.append('text').attr('class','wk-chart-axis-brush-box-left').attr('text-anchor', 'left').attr('dy', '.71em')
        _rightText = _rightBox.append('text').attr('class','wk-chart-axis-brush-text-right').attr('text-anchor', 'left').attr('dy', '.71em')
      _axisRect.attr({x:0, y:0, height:_axisBox.height + 6, width:_areaBox.width})
      _axisRectLeft.attr('height', _axisBox.height + 6)
      _axisRectRight.attr('height', _axisBox.height + 6)
      _axisExtent.attr('height', _axisBox.height + 6)
      _leftHandle.attr({y:-_areaBox.height, width: 3, height:_areaBox.height + _axisBox.height + 6})
      _rightHandle.attr({y:-_areaBox.height, width: 3, height:_areaBox.height + _axisBox.height + 6})

      _axisRect.on('mousedown.axisBrushSet', brushStart)
      _axisExtent.on('mousedown.axisBrushExtent', extentStart)
      _leftHandle.on('mousedown.axisBrushLeft', leftStart)
      _rightHandle.on('mousedown.axisBrushRight', rightStart)

      return me

    getAxisValue = (value) ->
      return _x.formatValue(_x.invert(value))

    setLeft = (pos) ->
      if pos >= 0 and pos <= _areaBox.width
        _leftPos = pos
      _leftValue = getAxisValue(_leftPos)

    setRight = (pos) ->
      if pos >= 0 and pos <= _areaBox.width
        _rightPos = pos
      _rightValue = getAxisValue(_rightPos)

    positionBrush = () ->
      _axisRectLeft.attr('x', 0).attr('width', Math.min(_leftPos, _rightPos))
      _axisRectRight.attr('x', Math.max(_leftPos, _rightPos)).attr('width', _areaBox.width - Math.max(_leftPos, _rightPos))
      _axisExtent.attr('x', Math.min(_leftPos, _rightPos)).attr('width', Math.abs(_rightPos - _leftPos))
      _leftHandle.attr('x', _leftPos - 3)
      _rightHandle.attr('x', _rightPos)
      _leftText.text(_leftValue)
      _leftTextBox = _leftBox.node().getBBox()
      _leftBoxBg.attr(_leftTextBox)
      _rightText.text(_rightValue)
      _rightTextBox = _rightBox.node().getBBox()
      _rightBoxBg.attr(_rightTextBox)
      _leftBox.attr('transform', "translate(#{Math.min(Math.max(_leftPos - _leftTextBox.width / 2, 0),_areaBox.width - _leftTextBox.width)}, #{-_areaBox.height})")
      _rightBox.attr('transform', "translate(#{Math.min(Math.max(_rightPos - _rightTextBox.width / 2, 0),_areaBox.width - _rightTextBox.width)}, #{-_areaBox.height})")


    brushStart = (d) ->
      _startX = d3.mouse(_axisRect.node())[0]
      w = d3.select($window)
      w.on('mousemove.axisBrush', brushMove)
      w.on('mouseup.axisBrush', brushEnd)
      d3.select('body').style('cursor', 'crosshair')

    extentStart = (d) ->
      _startX = d3.mouse(_axisRect.node())[0]
      _leftStartPos = _leftPos
      _rightStartPos = _rightPos
      w = d3.select($window)
      w.on('mousemove.axisBrushExtent', extentMove)
      w.on('mouseup.axisBrush', brushEnd)
      d3.select('body').style('cursor', 'move')

    leftStart = (d) ->
      x = d3.mouse(_axisRect.node())[0]
      w = d3.select($window)
      w.on('mousemove.axisBrushLeft', leftMove)
      w.on('mouseup.axisBrush', brushEnd)
      d3.select('body').style('cursor', 'ew-resize')

    rightStart = (d) ->
      x = d3.mouse(_axisRect.node())[0]
      w = d3.select($window)
      w.on('mousemove.axisBrushRight', rightMove)
      w.on('mouseup.axisBrush', brushEnd)
      d3.select('body').style('cursor', 'ew-resize')

    brushMove = (d) ->
      x = d3.mouse(_axisRect.node())[0]
      setLeft(Math.min(_startX, x))
      setRight(Math.max(_startX, x))
      positionBrush()

    extentMove = (d) ->
      delta = d3.mouse(_axisRect.node())[0] - _startX
      if not (_leftStartPos + delta <= 0 or _rightStartPos + delta > _areaBox.width)
        setLeft(_leftStartPos + delta)
        setRight(_rightStartPos + delta)
        positionBrush()

    leftMove = (d) ->
      x = d3.mouse(_axisRect.node())[0]
      setLeft(x)
      positionBrush()

    rightMove = (d) ->
      x = d3.mouse(_axisRect.node())[0]
      setRight(x)
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
