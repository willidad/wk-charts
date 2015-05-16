angular.module('wk.chart').factory 'behaviorBrush', ($log, $window, selectionSharing, d3Animation) ->

  behaviorBrush = () ->

    me = () ->

    _active = false
    _overlay = undefined
    _extent = undefined
    _startPos = undefined
    _evTargetData = undefined
    _areaNode = undefined
    _chart = undefined
    _data = undefined
    _chartArea = undefined
    _areaBox = undefined
    _backgroundBox = undefined
    _container = undefined
    _selectables =  undefined
    _brushGroup = undefined
    _x = undefined
    _y = undefined
    _tooltip = undefined
    _brushXY = false
    _brushX = false
    _brushY = false
    _boundsIdx = undefined
    _boundsValues = undefined
    _boundsDomain = []
    _lastLeftVal = undefined
    _lastRightVal = undefined
    _lastBottomVal = undefined
    _lastTopVal = undefined
    _brushEvents = d3.dispatch('brushStart', 'brush', 'brushEnd')

    left = top = right = bottom = startTop = startLeft = startRight = startBottom = undefined

    #--- Brush utility functions ----------------------------------------------------------------------------------------

    getD3Selection = (s, animate) ->
      if animate
        _overlay.selectAll(s).transition().duration(d3Animation.duration)
      else
        _overlay.selectAll(s)

    positionBrushElements = (left, right, top, bottom, animate) ->
      width = Math.abs(right - left)
      height = Math.abs(bottom - top)

      # position resize-handles into the right corners
      if _brushXY
        _overlay.selectAll('.wk-chart-n').attr('transform', "translate(#{left},#{top})").select('rect').attr('width', width)
        _overlay.selectAll('.wk-chart-s').attr('transform', "translate(#{left},#{bottom})").select('rect').attr('width', width)
        _overlay.selectAll('.wk-chart-w').attr('transform', "translate(#{left},#{top})").select('rect').attr('height', height)
        _overlay.selectAll('.wk-chart-e').attr('transform', "translate(#{right},#{top})").select('rect').attr('height', height)
        _overlay.selectAll('.wk-chart-ne').attr('transform', "translate(#{right},#{top})")
        _overlay.selectAll('.wk-chart-nw').attr('transform', "translate(#{left},#{top})")
        _overlay.selectAll('.wk-chart-se').attr('transform', "translate(#{right},#{bottom})")
        _overlay.selectAll('.wk-chart-sw').attr('transform', "translate(#{left},#{bottom})")
        _extent.attr('width', width).attr('height', height).attr('x', left).attr('y', top)
      if _brushX
        getD3Selection('.wk-chart-w', animate).attr('transform', "translate(#{left},0)").select('rect').attr('height', height)
        getD3Selection('.wk-chart-e', animate).attr('transform', "translate(#{right},0)").select('rect').attr('height', height)
        _overlay.selectAll('.wk-chart-e').select('rect').attr('height', _areaBox.height)
        _overlay.selectAll('.wk-chart-w').select('rect').attr('height', _areaBox.height)
        (if animate then _extent.transition().duration(d3Animation.duration) else _extent).attr('width', width).attr('height', _areaBox.height).attr('x', left).attr('y', 0)
      if _brushY
        getD3Selection('.wk-chart-n', animate).attr('transform', "translate(0,#{top})").select('rect').attr('width', width)
        getD3Selection('.wk-chart-s', animate).attr('transform', "translate(0,#{bottom})").select('rect').attr('width', width)
        _overlay.selectAll('.wk-chart-n').select('rect').attr('width', _areaBox.width)
        _overlay.selectAll('.wk-chart-s').select('rect').attr('width', _areaBox.width)
        (if animate then _extent.transition().duration(d3Animation.duration) else _extent).attr('width', _areaBox.width).attr('height', height).attr('x', 0).attr('y', top)

    hideBrushElements = () ->
      d3.select(_areaNode).selectAll('.wk-chart-resize').style('display', 'none')
      _extent.attr('width',0).attr('height', 0).attr('x', 0).attr('y', 0).style('display', 'none')

    showBrushElements = () ->
      d3.select(_areaNode).selectAll(".wk-chart-resize").style("display", null)
      _extent.style('display',null)

    clearBrushElements = () ->
      d3.select(_areaNode).selectAll(".wk-chart-resize.wk.chart-n>rect, .wk-chart-resize.wk.chart-s>rect").attr('x',0).attr('width', 0)
      d3.select(_areaNode).selectAll(".wk-chart-resize.wk.chart-e>rect, .wk-chart-resize.wk.chart-e>rect").attr('y',0).attr('height', 0)
    #-------------------------------------------------------------------------------------------------------------------

    getSelectedObjects = () ->
      er = _extent.node().getBoundingClientRect()
      _selectables.each((d) ->
          cr = this.getBoundingClientRect()
          xHit = er.left < cr.right - cr.width / 3 and cr.left + cr.width / 3 < er.right
          yHit = er.top < cr.bottom - cr.height / 3 and cr.top + cr.height / 3 < er.bottom
          d3.select(this).classed('wk-chart-selected', yHit and xHit)
        )
      allSelected = _chartArea.selectAll('.wk-chart-selected').data()
      _chartArea.classed('wk-chart-has-selected-items', allSelected.length > 0)
      return allSelected

    #-------------------------------------------------------------------------------------------------------------------

    setSelection = (left, right, top, bottom) ->
      if _brushX
        if me.x().reverse()
          s = left
          left = right
          right = s
        #test if selected elements are changed
        _leftVal = me.x().invert(left)
        _rightVal = me.x().invert(right)
        if _lastLeftVal isnt _leftVal or _lastRightVal isnt _rightVal
          _lastRightVal = _rightVal
          _lastLeftVal = _leftVal
          _left = me.x().findIndex(_leftVal)
          _right = me.x().findIndex(_rightVal)
          _boundsIdx = [_left, _right]
          # bounds have changed, update bounds values array
          if me.x().isOrdinal()
            _boundsValues = me.x().value(_data).slice(_left, _right + 1)
          else
            _boundsValues = [me.x().value(_data[_boundsIdx[0]]), me.x().value(_data[_right])]
          _boundsDomain = _data.slice(_left, _right+ 1)
          _brushEvents.brush(_boundsIdx, _boundsValues, _boundsDomain)
          selectionSharing.setSelection _boundsValues, _boundsIdx, _brushGroup
      if _brushY
        #test if selected elements are changed
        if me.y().reverse()
          s = top
          top = bottom
          bottom = s
        _bottomVal = me.y().invert(bottom)
        _topVal = me.y().invert(top)
        if _lastBottomVal isnt _bottomVal or _lastTopVal isnt _topVal
          _lastBottomVal = _bottomVal
          _lastTopVal = _topVal
          _bottom = me.y().findIndex(_bottomVal)
          _top = me.y().findIndex(_topVal)
          _boundsIdx = [_bottom, _top]
          if me.y().isOrdinal()
            _boundsValues = me.y().value(_data).slice(_bottom, _top + 1)
          else
            _boundsValues = [me.y().value(_data[_bottom]), me.y().value(_data[_top])]
          _boundsDomain = _data.slice(_bottom, _top + 1)
          _brushEvents.brush(_boundsIdx, _boundsValues, _boundsDomain)
          selectionSharing.setSelection _boundsValues, _boundsIdx, _brushGroup
      if _brushXY
        newDomain = getSelectedObjects()
        if _.xor(_boundsDomain, newDomain).length > 0
          _boundsIdx = []
          _boundsValues = []
          _boundsDomain = newDomain
          _brushEvents.brush(_boundsIdx, _boundsValues, _boundsDomain)
          selectionSharing.setSelection _boundsValues, _boundsIdx, _brushGroup
      #$log.info 'Brush Bounds:', _boundsValues[0], _boundsValues[_boundsValues.length - 1], _boundsValues

    clearSelection = () ->
      _boundsIdx = []
      _boundsValues = []
      _boundsDomain = []
      _selectables.classed('wk-chart-selected', false)
      _chartArea.classed('wk-chart-has-selected-items', false)
      selectionSharing.setSelection _boundsValues, _boundsIdx, _brushGroup
      _.delay(   # ensure digest cycle from button pressed is completed
          () ->
            _brushEvents.brush(_boundsIdx, _boundsValues, _boundsDomain)
            _brushEvents.brushEnd(_boundsIdx, _boundsValues, _boundsDomain)
        , 20
      )

    #--- BrushStart Event Handler --------------------------------------------------------------------------------------

    brushStart = () ->
      #register a mouse handlers for the brush
      d3.event.preventDefault()
      _eventTarget = d3.select(d3.event.target)
      _evTargetData = _eventTarget.datum()
      if _eventTarget.classed('wk-chart-selectable')
        _evTargetData = {name:'forwarded'}
      _areaBox = _areaNode.getBBox()
      _startPos = d3.mouse(_areaNode)
      startTop = top
      startLeft = left
      startRight = right
      startBottom = bottom
      d3.select(_areaNode).select('.wk-chart-selectable').style('pointer-events','none')
      d3.select('body').style('cursor', d3.select(d3.event.target).style('cursor'))
      #showBrushElements()

      d3.select($window).on('mousemove.brush', brushMove).on('mouseup.brush', brushEnd)
      _tooltip.hide(true)
      _boundsIdx = [undefined, undefined]
      _boundsDomain = [undefined]
      _selectables = _chartArea.selectAll('.wk-chart-selectable')
      _brushEvents.brushStart()
      #timing.clear()
      #timing.init()

    #--- BrushEnd Event Handler ----------------------------------------------------------------------------------------

    brushEnd = () ->
      #de-register handlers
      d3.select($window).on 'mousemove.brush', null
      d3.select($window).on 'mouseup.brush', null
      d3.select(_areaNode).select('.wk-chart-selectable').style('pointer-events',null)
      d3.select('body').style('cursor', null)
      _tooltip.hide(false)
      _brushEvents.brushEnd(_boundsIdx, _boundsValues, _boundsDomain)
      #timing.report()

    #--- BrushMove Event Handler ---------------------------------------------------------------------------------------

    brushMove = () ->
      #$log.info 'brushmove'
      pos = d3.mouse(_areaNode)
      deltaX = pos[0] - _startPos[0]
      deltaY = pos[1] - _startPos[1]
      showBrushElements()

      # this elaborate code is needed to deal with scenarios when mouse moves fast and the events do not hit x/y + delta
      # does not hi the 0 point maye there is a more elegant way to write this, but for now it works :-)

      leftMv = (delta) ->
        pos = startLeft + delta
        left = if pos >= 0 then (if pos < startRight then pos else startRight) else 0
        right = if pos <= _areaBox.width then (if pos < startRight then startRight else pos) else _areaBox.width

      rightMv = (delta) ->
        pos = startRight + delta
        left = if pos >= 0 then (if pos < startLeft then pos else startLeft) else 0
        right = if pos <= _areaBox.width then (if pos < startLeft then startLeft else pos) else _areaBox.width

      topMv = (delta) ->
        pos = startTop + delta
        top = if pos >= 0 then (if pos < startBottom then pos else startBottom) else 0
        bottom = if pos <= _areaBox.height then (if pos > startBottom then pos else startBottom ) else _areaBox.height

      bottomMv = (delta) ->
        pos = startBottom + delta
        top = if pos >= 0 then (if pos < startTop then pos else startTop) else 0
        bottom = if pos <= _areaBox.height then (if pos > startTop then pos else startTop ) else _areaBox.height

      horMv = (delta) ->
        if startLeft + delta >= 0
          if startRight + delta <= _areaBox.width
            left = startLeft + delta
            right = startRight + delta
          else
            right = _areaBox.width
            left = _areaBox.width - (startRight - startLeft)
        else
          left = 0
          right = startRight - startLeft

      vertMv = (delta) ->
        if startTop + delta >= 0
          if startBottom + delta <= _areaBox.height
            top = startTop + delta
            bottom = startBottom + delta
          else
            bottom = _areaBox.height
            top = _areaBox.height - (startBottom - startTop)
        else
          top = 0
          bottom = startBottom - startTop

      switch _evTargetData.name
        when 'background', 'forwarded'
          if deltaX + _startPos[0] > 0
            left = if deltaX < 0 then _startPos[0] + deltaX else _startPos[0]
            if left + Math.abs(deltaX) < _areaBox.width
              right = left + Math.abs(deltaX)
            else
              right = _areaBox.width
          else
            left = 0

          if deltaY + _startPos[1] > 0
            top = if deltaY < 0 then _startPos[1] + deltaY else _startPos[1]
            if top + Math.abs(deltaY) < _areaBox.height
              bottom = top + Math.abs(deltaY)
            else
              bottom = _areaBox.height
          else
            top = 0
        when 'extent'
          vertMv(deltaY); horMv(deltaX)
        when 'n'
          topMv(deltaY)
        when 's'
          bottomMv(deltaY)
        when 'w'
          leftMv(deltaX)
        when 'e'
          rightMv(deltaX)
        when 'nw'
          topMv(deltaY); leftMv(deltaX)
        when 'ne'
          topMv(deltaY); rightMv(deltaX)
        when 'sw'
          bottomMv(deltaY); leftMv(deltaX)
        when 'se'
          bottomMv(deltaY); rightMv(deltaX)

      positionBrushElements(left, right, top, bottom)
      setSelection(left, right, top, bottom)

    #--- Brush ---------------------------------------------------------------------------------------------------------

    me.brush = (s) ->
      if arguments.length is 0 then return _overlay
      else
        if not _active then return
        _overlay = s
        _brushXY = me.x() and me.y()
        _brushX = me.x() and not me.y()
        _brushY = me.y() and not me.x()
        # create the handler elements and register the handlers
        s.style({'pointer-events': 'all', cursor: 'crosshair'})
        _extent = s.append('rect').attr({class:'wk-chart-extent', x:0, y:0, width:0, height:0}).style({'cursor':'move'}).datum({name:'extent'})
        # resize handles for the sides
        if _brushY or _brushXY
          s.append('g').attr('class', 'wk-chart-resize wk-chart-n').style({cursor:'ns-resize', display:'none'})
            .append('rect').attr({x:0, y: -3, width:0, height:6}).datum({name:'n'})
          s.append('g').attr('class', 'wk-chart-resize wk-chart-s').style({cursor:'ns-resize', display:'none'})
            .append('rect').attr({x:0, y: -3, width:0, height:6}).datum({name:'s'})
        if _brushX or _brushXY
          s.append('g').attr('class', 'wk-chart-resize wk-chart-w').style({cursor:'ew-resize', display:'none'})
            .append('rect').attr({y:0, x: -3, width:6, height:0}).datum({name:'w'})
          s.append('g').attr('class', 'wk-chart-resize wk-chart-e').style({cursor:'ew-resize', display:'none'})
            .append('rect').attr({y:0, x: -3, width:6, height:0}).datum({name:'e'})
        # resize handles for the corners
        if _brushXY
          s.append('g').attr('class', 'wk-chart-resize wk-chart-nw').style({cursor:'nwse-resize', display:'none'})
          .append('rect').attr({x: -3, y: -3, width:6, height:6}).datum({name:'nw'})
          s.append('g').attr('class', 'wk-chart-resize wk-chart-ne').style({cursor:'nesw-resize', display:'none'})
          .append('rect').attr({x: -3, y: -3, width:6, height:6}).datum({name:'ne'})
          s.append('g').attr('class', 'wk-chart-resize wk-chart-sw').style({cursor:'nesw-resize', display:'none'})
          .append('rect').attr({x: -3, y: -3, width:6, height:6}).datum({name:'sw'})
          s.append('g').attr('class', 'wk-chart-resize wk-chart-se').style({cursor:'nwse-resize', display:'none'})
          .append('rect').attr({x: -3, y: -3, width:6, height:6}).datum({name:'se'})
        #register handler. Please note, brush wants the mouse down exclusively !!!
        s.on 'mousedown.brush', brushStart  # de-registered by container when deleting chart area

        return me

    #--- Extent resize handler -----------------------------------------------------------------------------------------

    resizeExtent = () ->
      if _areaBox
        #$log.info 'resizeHandler'
        newBox = _areaNode.getBBox()
        horizontalRatio = _areaBox.width / newBox.width
        verticalRatio = _areaBox.height / newBox.height
        top = top / verticalRatio
        startTop = startTop / verticalRatio
        bottom = bottom / verticalRatio
        startBottom = startBottom / verticalRatio
        left = left / horizontalRatio
        startLeft = startLeft / horizontalRatio
        right = right / horizontalRatio
        startRight = startRight / horizontalRatio
        _startPos[0] = _startPos[0] / horizontalRatio
        _startPos[1] = _startPos[1] / verticalRatio
        _areaBox = newBox
        positionBrushElements(left, right, top, bottom)

    #--- Brush Properties --------------------------------------------------------------------------------------------

    me.chart = (val) ->
      if arguments.length is 0 then return _chart
      else
        _chart = val
        _chart.lifeCycle().on 'resize.brush', resizeExtent
        return me #to enable chaining

    me.active = (val) ->
      if arguments.length is 0 then return _active
      else
        _active = val
        return me #to enable chaining

    me.x = (val) ->
      if arguments.length is 0 then return _x
      else
        _x = val
        return me #to enable chaining

    me.y = (val) ->
      if arguments.length is 0 then return _y
      else
        _y = val
        return me #to enable chaining

    me.area = (val) ->
      if arguments.length is 0 then return _chartArea
      else
        if val is undefined
          _areaNode = undefined
          _chartArea = undefined
        else if not _chartArea
          _chartArea = val
          _areaNode = _chartArea.node()
          #_areaBox = _area.getBBox() need to get when calculating size to deal with resizing
          me.brush(_chartArea)
          _selectables = _chartArea.selectAll('.wk-chart-selectable')

        return me #to enable chaining

    me.container = (val) ->
      if arguments.length is 0 then return _container
      else
        _container = val

        return me #to enable chaining

    me.data = (val) ->
      if arguments.length is 0 then return _data
      else
        _lastLeftVal = _lastRightVal = _lastTopVal = _lastBottomVal = undefined;
        _data = val
        # verify that current brush extent can be meaningfully mapped into new data, depending on scale type.
        if _brushX and _x.isOrdinal()
          _boundsValues = _.intersection(_x.value(_data), _boundsValues)
        if _brushY and _y.isOrdinal()
          _boundsValues = _.intersection(_y.value(_data), _boundsValues)

        if _boundsValues and _boundsValues.length > 0
          me.setExtent([_boundsValues[0], _boundsValues[_boundsValues.length - 1]], true) # do not parse
        else
          me.clearBrush()

        return me #to enable chaining

    me.brushGroup = (val) ->
      if arguments.length is 0 then return _brushGroup
      else
        _brushGroup = val
        selectionSharing.createGroup(_brushGroup)
        return me #to enable chaining

    me.tooltip = (val) ->
      if arguments.length is 0 then return _tooltip
      else
        _tooltip = val
        return me #to enable chaining

    me.on = (name, callback) ->
      _brushEvents.on name, callback

    me.extent = () ->
      return _boundsIdx

    me.setExtent = (val, noParse) ->
      if _.isArray(val) and val.length is 2
        start = val[0]
        end = val[1]
        startPos = undefined
        endPos = undefined
        _areaBox = _areaNode.getBBox()
        # scale values to get the pixel position of the selected start/end elements
        if _brushX
          left = _x.scale()(if noParse then start else _x.parsedValue(start)) + if _x.isOrdinal() then _x.scale().rangeBand() / 2 else 0
          right = _x.scale()(if noParse then end else _x.parsedValue(end)) + if _x.isOrdinal() then _x.scale().rangeBand() / 2 else 0
          if _x.reverse()
            v = left
            left = right
            right = v
          if not _.isFinite(left)
            left = 0
            $log.info 'setting left to 0'
          if not _.isFinite(right)
            right = _areaBox.width
            $log.info 'setting right to ', right
          top = 0
          bottom = _areaBox.height
          _.delay(() -> # ensure digest cycle form button pressed is completed
            positionBrushElements(left, right, top, bottom, noParse)
            setSelection(left, right, top, bottom)
            showBrushElements()
          )
        else if _brushY
          top = _y.scale()(if noParse then end else _y.parsedValue(end)) + if _y.isOrdinal() then _y.scale().rangeBand() / 2 else 0
          bottom = _y.scale()(if noParse then start else _y.parsedValue(start)) + if _y.isOrdinal() then _y.scale().rangeBand() / 2 else 0
          if _y.reverse()
            v = top
            top = bottom
            bottom = v
          if not _.isFinite(top)
            top = 0
            $log.info 'setting top to 0'
          if not _.isFinite(bottom)
            bottom = _areaBox.height
            $log.info 'setting bottom to ', bottom
          left = 0
          right = _areaBox.width
          _.delay(() -> # ensure digest cycle form button pressed is completed
            positionBrushElements(left ,right ,top, bottom, noParse)
            setSelection(left, right, top, bottom)
            showBrushElements()
          )
      return me

    me.events = () ->
      return _brushEvents

    me.empty = () ->
      return _boundsDomain.length is 0

    me.clearBrush = () ->
      console.log 'Brush cleared'
      hideBrushElements()
      clearSelection()
      clearBrushElements();


    return me
  return behaviorBrush