angular.module('wk.chart').factory 'behaviorBrush', ($log, $window, d3Animation) ->

  behaviorBrush = () ->
    _labelInAxis = false
    _area = undefined
    _container = undefined
    _chart = undefined;
    _tooltip = undefined;
    _svg = undefined
    _x = undefined
    _y = undefined
    _data = []
    _horizontal = true;
    _axis = undefined;
    _brushAxis = 'x';
    _brushAttr = 'width';
    _fixAxis = 'y'
    _fixAttr = 'height'
    _cursor = 'ew-resize'
    _axisG = undefined
    _chartAreaBg = undefined
    _brushElements = undefined
    _brushVisible = undefined
    _scaleWidth = 0;
    _scaleHeight = 0;

    _idxRange = []
    _selectedKeys = []
    _selectedDomain = []

    _startPos = undefined
    _pos1 = undefined
    _pos2 = undefined
    _pos1Start = undefined
    _pos2Start = undefined
    _lastPos = undefined

    _pos1Value = ''
    _pos2Value = ''
    _empty = true

    _brushEvents = d3.dispatch('brushStart', 'brush', 'brushEnd')

    me = {}

    me.area = (val) ->
      if arguments.length is 0 then return _area
      _area = val
      return me

    me.chart = (val) ->
      if arguments.length is 0 then return _chart
      _chart = val
      _chart.lifeCycle().on 'drawAxis.brush', resizeExtent
      return me

    me.tooltip = (tt) ->
      if arguments.length is 0 then return _tooltip
      _tooltip = tt
      return me

    me.svg = (val) ->
      if arguments.length is 0 then return _svg
      _svg = val
      return me

    me.x = (val) ->
      if arguments.length is 0 then return _x
      _x = val
      if val
        _axis = _x
        _horizontal = true
        _brushAxis= 'x'
        _brushAttr = 'width'
        _fixAxis = 'y'
        _fixAttr = 'height'
        _cursor = 'ew-resize'
      return me

    me.y = (val) ->
      if arguments.length is 0 then return _y
      _y = val
      if val
        _axis = _y
        _horizontal = false
        _brushAxis = 'y'
        _brushAttr = 'height'
        _fixAxis = 'x'
        _fixAttr = 'width'
        _cursor = 'ns-resize'
      return me

    me.brush = (s) -> # expects axis selector
      return me

    me.container = (val, axisSizing, scaleWidth, scaleHeight) ->
      if arguments.length is 0 then return _container
      _container = val
      _scaleWidth = scaleWidth
      _scaleHeight = scaleHeight

      if not _axis then return

      # create brush elements
      _axisG = _container.select(".wk-chart-axis.wk-chart-#{_axis.axisOrient()}")
      _chartAreaBg = _container.select('.wk-chart-background').node()
      _brushElements = _svg.selectAll('.wk-chart-brush')
      _brushVisible = _svg.selectAll('.wk-chart-brush-vis')
      _container.selectAll('.wk-chart-brush-line1, .wk-chart-brush-line2').attr(_brushAttr, 3).style('cursor', _cursor)
      if _horizontal
        _brushElements.attr('y',0).attr('height', _scaleHeight + axisSizing.bottom.height + 3)
        _container.selectAll('.wk-chart-brush-extent-marker').attr('y', _scaleHeight).attr('height', axisSizing.bottom.height + 3)
        _container.selectAll('.wk-chart-brush-label-text').attr('dy', '.71em')
      else
        _brushElements.attr('x', -axisSizing.left.width - 3).attr('width', axisSizing.left.width + _scaleWidth +  3)
        _container.selectAll('.wk-chart-brush-extent-marker').attr('x', -axisSizing.left.width - 3).attr('width', axisSizing.left.width + 3)
        _container.selectAll('.wk-chart-brush-label-text').attr('dy', '.31em')

      _container.on('mousedown.brush', brushDispatch)
      return me

    me.data = (data) ->
      if arguments.length is 0 then return _data
      _data = data

    me.events = () ->
      _brushEvents

    me.clearBrush = () ->
      clearBrush()

    me.setExtent = (val) ->
      if _.isArray(val) and val.length is 2
        p1 = _axis.scale()(_axis.parsedValue(val[0]))
        p2 = _axis.scale()(_axis.parsedValue(val[1]))
        _pos1 = Math.min(p1, p2)
        _pos2 = Math.max(p1,p2)
        _brushElements.style({visibility: null, 'pointer-events': 'all'})
        positionBrush()

    getAxisValue = (pos) ->
      _axis.value(_axis.find(_axis.invert(pos)))

    mousePos = () ->
      p = if _horizontal then d3.mouse(_area.node())[0] else d3.mouse(_area.node())[1]
      if p < 0 then 0 else if p > limit() then limit(p) else p

    limit = (pos) ->
      if _horizontal then _scaleWidth else _scaleHeight

    setPos1 = (pos) ->
      _pos1 = pos
      _pos1Value = getAxisValue(_pos1)

    setPos2 = (pos) ->
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
          _idxRange = [lowerIdx, upperIdx]
          _selectedKeys = keys.slice(Math.min(lowerIdx, upperIdx), Math.max(lowerIdx,upperIdx) + 1)
          _selectedDomain = _data.slice(Math.min(lowerIdx, upperIdx), Math.max(lowerIdx,upperIdx) + 1)
        else
          _idxRange = []
          _selectedKeys = []
          _selectedDomain = []
        _brushEvents.brush(_idxRange, _selectedKeys, _selectedDomain)

        _container.selectAll('.wk-chart-selectable').each((d) -> d3.select(this).classed('wk-chart-selected', d.key in _selectedKeys).classed('wk-chart-not-selected', not (d.key in _selectedKeys)))
      else
        pos1Value = _axis.invert(_pos1)
        pos2Value = _axis.invert(_pos2)
        pos1Idx = _axis.findIndex(pos1Value)
        pos2Idx = _axis.findIndex(pos2Value)
        _idxRange = [Math.min(pos1Idx, pos2Idx), Math.max(pos1Idx, pos2Idx)]
        _selectedDomain = _data.slice(_idxRange[0], _idxRange[1] + 1)
        _brushEvents.brush(_idxRange, _selectedKeys, _selectedDomain)

    clearSelection = () ->
      $log.log 'selection cleared'
      _container.selectAll('.wk-chart-selectable').classed('wk-chart-selected',false).classed('wk-chart-not-selected',false)
      _idxRange = []
      _selectedKeys = []
      _selectedDomain = []
      _brushEvents.brush(_idxRange, _selectedKeys, _selectedDomain)

    resizeExtent = (noAnimation) ->
      if _axis
        if _axis.isOrdinal()
          newKeys = _.intersection(_selectedKeys, _axis.scale().domain())
          if newKeys.length > 0
            if newKeys.length > 1
              lv = newKeys[0]
              hv = newKeys[newKeys.length - 1]
            else
              lv = hv = newKeys[0]
            lvp = _axis.scale()(lv) + _axis.scale().rangeBand() / 2
            hvp = _axis.scale()(hv) + _axis.scale().rangeBand() / 2
            if lvp < hvp and _pos1 < _pos2 or lvp > hvp and _pos1 > _pos2 #ensure pos1, pos2 order stays as before
              _pos1 = lvp
              _pos1Value = lv
              _pos2 = hvp
              _pos2Value = hv
            else
              _pos2 = lvp
              _pos2Value = lv
              _pos1 = hvp
              _pos1Value = hv
            positionBrush(not noAnimation)
          else
            clearBrush()
        else
          if _pos1Value and _pos2Value
            _pos1 = _axis.scale()(_pos1Value)
            _pos2 = _axis.scale()(_pos2Value)
            positionBrush(not noAnimation)


    clearBrush = () ->
      _pos1 = 0
      _pos2 = 0
      _brushVisible.style({visibility: 'hidden', 'pointer-events' : 'none'})
      _svg.selectAll('.wk-chart-brush-extent').attr(_brushAxis, 0).attr(_brushAttr, if _horizontal then _scaleWidth else _scaleHeight)
      _svg.selectAll('.wk-chart-brush-rect1').attr(_brushAttr, 0)
      _svg.selectAll('.wk-chart-brush-rect2').attr(_brushAxis, if _horizontal then _scaleWidth else _scaleHeight).attr(_brushAttr, 0)
      d3.select('body').style('cursor', undefined)
      clearSelection()
      brushEnd()

      _empty = true;

    setText = (selector, text) ->
      s = _container.select(selector)
      rect = s.select('text').attr('transform', 'translate(5,2)').text(text).node().getBBox()
      rect.width += 10
      rect.height += 3
      return s.select('rect').attr(rect).node().getBBox()

    positionBrush = (animate) ->
      if (_pos1 is 0 and _pos2 is limit()) or (_pos1 is 0 and _pos2 is 0) or (_pos1 is limit() and _pos2 is limit())
        #full range is selected, hide brush
        clearBrush()
      else
        sel = (s) ->
          if typeof s is 'string'
            s = _svg.selectAll(s)
          if animate then s.transition().duration(d3Animation.duration) else s

        empty = false;
        _attrLimit = if _horizontal then _scaleWidth else _scaleHeight
        _minPos = Math.max(Math.min(_pos1, _pos2), 0)
        _maxPos = Math.min(Math.max(_pos1, _pos2), _attrLimit)
        sel('.wk-chart-brush-rect1').attr(_brushAxis, 0).attr(_brushAttr, _minPos)
        sel('.wk-chart-brush-rect2').attr(_brushAxis, _maxPos).attr(_brushAttr, Math.abs(_attrLimit - _maxPos))
        sel('.wk-chart-brush-extent').attr(_brushAxis, _minPos).attr(_brushAttr, Math.abs(_maxPos - _minPos))
        sel('.wk-chart-brush-extent-marker').attr(_brushAxis, _minPos).attr(_brushAttr, Math.abs(_maxPos - _minPos))
        sel('.wk-chart-brush-line1').attr(_brushAxis, _minPos-3)
        sel('.wk-chart-brush-line2').attr(_brushAxis, _maxPos)
        t1Size = setText('.wk-chart-brush-label1',_axis.formatValue(getAxisValue(_minPos)))
        t2Size = setText('.wk-chart-brush-label2',_axis.formatValue(getAxisValue(_maxPos)))
        if _horizontal
          lPos = if _labelInAxis then _scaleHeight + 4 else 0
          sel('.wk-chart-brush-label1').attr('transform', "translate(#{Math.min(Math.max(_minPos - t1Size.width, 0), _scaleWidth - t1Size.width)}, #{lPos})")
          sel('.wk-chart-brush-label2').attr('transform', "translate(#{Math.min(Math.max(_maxPos, 0), _scaleWidth - t2Size.width)}, #{lPos})")
        else
          lPos = if _labelInAxis then -t1Size.width else _scaleWidth - t1Size.width
          sel('.wk-chart-brush-label1').attr('transform', "translate(#{lPos}, #{Math.min(Math.max(_minPos - t1Size.height / 2, t1Size.height / 2),_scaleHeight - t1Size.height / 2)})")
          sel('.wk-chart-brush-label2').attr('transform', "translate(#{lPos}, #{Math.min(Math.max(_maxPos + t1Size.height / 2, t2Size.height / 2),_scaleHeight - t2Size.height / 2)})")
        setSelection()

    brushDispatch = () ->
      # see which element is being hit in case it is emitted from a chart element
      p = mousePos();
      if p > _pos1 - 4 and p <= _pos1
        handle1Start()
      else if p > _pos1 and p < _pos2
        extentStart()
      else if p >= _pos2 and p < _pos2 + 4
        handle2Start()
      else brushStart()

      _brushEvents.brushStart()

    brushStart = (d) ->
      d3.event.stopPropagation()
      _brushVisible.style({visibility: null, 'pointer-events': 'all'})
      _tooltip.hide(true)
      _startPos = mousePos()
      setPos1(_startPos)
      setPos2(_startPos)
      positionBrush()
      w = d3.select($window)
      w.on('mousemove.brush', brushMove)
      w.on('mouseup.brush', brushEnd)
      d3.select('body').style('cursor', 'crosshair')

    extentStart = (d) ->
      d3.event.stopPropagation()
      _tooltip.hide(true)
      _startPos = mousePos()
      _pos1Start = _pos1
      _pos2Start = _pos2
      w = d3.select($window)
      w.on('mousemove.brush', extentMove)
      w.on('mouseup.brush', brushEnd)
      d3.select('body').style('cursor', 'move')

    handle1Start = (d) ->
      d3.event.stopPropagation()
      _tooltip.hide(true)
      w = d3.select($window)
      _lastPos = mousePos()
      w.on('mousemove.brush', handle1Move)
      w.on('mouseup.brush', brushEnd)
      d3.select('body').style('cursor', _cursor)

    handle2Start = (d) ->
      d3.event.stopPropagation()
      _tooltip.hide(true)
      w = d3.select($window)
      _lastPos = mousePos()
      w.on('mousemove.brush', handle2Move)
      w.on('mouseup.brush', brushEnd)
      d3.select('body').style('cursor', _cursor)

    brushMove = (d) ->
      d3.event.stopPropagation()
      p = mousePos()
      setPos1(Math.min(_startPos, p))
      setPos2(Math.max(_startPos, p))
      positionBrush()

    extentMove = (d) ->
      d3.event.stopPropagation()
      delta = mousePos() - _startPos
      if _pos1Start + delta >= 0 and _pos2Start + delta <= limit()
        p1 = _pos1Start + delta
        p2 = _pos2Start + delta
      else if delta <= 0
        p1 = 0
        p2 = _pos2Start - _pos1Start
      else
        p2 = limit()
        p1 = limit() - (_pos2Start - _pos1Start)

      setPos1(p1)
      setPos2(p2)
      positionBrush()

    handle1Move = (d) ->
      d3.event.stopPropagation()
      p = mousePos()
      setPos1(p)
      positionBrush()

    handle2Move = (d) ->
      d3.event.stopPropagation()
      p = mousePos()
      setPos2(p)
      positionBrush()

    brushEnd = (d) ->
      if _tooltip
        _.defer(() -> _tooltip.hide(false))
      w = d3.select($window)
      w.on('mousemove.brush', undefined)
      w.on('mouseup.brush', undefined)
      d3.select('body').style('cursor', undefined)
      _brushEvents.brushEnd(_idxRange, _selectedKeys, _selectedDomain)

    return me
  return behaviorBrush
