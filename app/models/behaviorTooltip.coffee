angular.module('wk.chart').factory 'behaviorTooltip', ($log, $document, $rootScope, $compile, $templateCache, wkChartTemplates) ->

  behaviorTooltip = () ->

    _active = false
    _path = ''
    _hide = false
    _showMarkerLine = undefined
    _markerG = undefined
    _markerLine = undefined
    _areaSelection = undefined
    _chart = undefined
    _area= undefined
    _container = undefined
    _scales = undefined
    _markerScale = undefined
    _data = undefined
    _reEntered = false
    _tooltipDispatch = d3.dispatch('enter', 'moveData', 'moveMarker', 'leave')

    _templ = wkChartTemplates.tooltipTemplate()
    _templScope = undefined #_chart.scope().$new(true)
    _compiledTempl = undefined #$compile(_templ)(_templScope)
    body = $document.find('body')

    bodyRect = body[0].getBoundingClientRect()

    me = () ->

    #--- helper Functions ----------------------------------------------------------------------------------------------

    positionBox = () ->
      rect = _compiledTempl[0].getBoundingClientRect()
      clientX = if bodyRect.right - 20 > d3.event.clientX + rect.width + 10 then d3.event.clientX + 10 else d3.event.clientX - rect.width - 10
      clientY = if bodyRect.bottom - 20 > d3.event.clientY + rect.height + 10 then d3.event.clientY + 10 else d3.event.clientY - rect.height - 10
      _.assign(_templScope.tooltipStyle, {
        position: 'absolute'
        left: clientX + 'px'
        top: clientY + 'px'
        'z-index': 1500
        opacity: 1
      })
      _templScope.$apply()

    positionInitial = () ->
      _.assign(_templScope.tooltipStyle, {
        position: 'absolute'
        left: '0px'
        top: '0px'
        'z-index': 1500
        opacity: 0
      })
      _templScope.$apply()  # ensure tooltip gets rendered and size attributes get set correctly

    #--- TooltipStart Event Handler ------------------------------------------------------------------------------------

    tooltipEnter = () ->
      if not _active or _hide then return
      # append data div

      _templScope.layers = {}

      # get tooltip data value depending on the scenario
      if _showMarkerLine # show tooltip based on mouse position. Invert the position and find the corresponding data value #TODO Better name for the indicator value
        _pos = d3.mouse(this)
        keyValue = _markerScale.invert(if _markerScale.isHorizontal() then _pos[0] else _pos[1])
        dataObj = _markerScale.find(keyValue)
        _templScope.ttData = dataObj
      else # show tooltip from element the mouse is over. Get the linked datum of the object
        value = d3.select(this).datum()
        dataObj = _templScope.ttData = if value.data then value.data else value
      _tooltipDispatch.enter.apply(_templScope, [dataObj, dataObj]) # get the data so the TT can be positioned correctly

      # append and position the tooltp box
      ttElem = d3.select('.wk-chart-tooltip')
      if ttElem.empty()
        body.append(_compiledTempl)
        _templScope.tooltipStyle = me.chart().tooltipStyle()
        positionInitial() #position in upper left corner to compute the space requirements. positionBox() will the move it to the right
                        # place and ensure that box does not move outside the borders

      # create a marker line if required
      if _showMarkerLine
        _markerG = _areaSelection.select('.wk-chart-tooltip-marker')
        if _markerG.empty()
          _areaBox = _areaSelection.select('.wk-chart-background').node().getBBox()
          _markerG = _areaSelection.append('g')  # need to append marker to chart area to ensure it is on top of the chart elements Fix 10
            .attr('class', 'wk-chart-tooltip-marker')
          _markerLine = _markerG.append('line')
          if _markerScale.isHorizontal()
            _markerLine.attr({class:'wk-chart-marker-line', x0:0, x1:0, y0:0,y1:_areaBox.height})
          else
            _markerLine.attr({class:'wk-chart-marker-line', x0:0, x1:_areaBox.width, y0:0,y1:0})

          _markerLine.style({stroke: 'darkgrey', 'pointer-events': 'none'})

        _tooltipDispatch.moveMarker.apply(_markerG, [keyValue, dataObj])

    #--- TooltipMove  Event Handler ------------------------------------------------------------------------------------

    tooltipMove = () ->
      if not _active or _hide then return
      _pos = d3.mouse(_area)

      if _showMarkerLine
        if not _markerG
          # mouse entered chart area with mouse button down.
          tooltipEnter.apply(this,arguments) # pass event context along
          return
        keyValue = _markerScale.invert(if _markerScale.isHorizontal() then _pos[0] else _pos[1])
        dataObj = _markerScale.find(keyValue)
        _tooltipDispatch.moveMarker.apply(_markerG, [keyValue, dataObj])
        _templScope.ttData = dataObj
        _tooltipDispatch.moveData.apply(_templScope, [keyValue, dataObj])
      #_templScope.$apply()
      positionBox()

    #--- TooltipLeave Event Handler ------------------------------------------------------------------------------------

    tooltipLeave = () ->
      if _markerG
        _markerG.remove()
      _markerG = undefined
      _compiledTempl.remove()



    #--- Interface to brush --------------------------------------------------------------------------------------------

    forwardToBrush = (e) ->
      # forward the mousdown event to the brush overlay to ensure that brushing can start at any point in the drawing area

      brush_elm = _container.node();
      if d3.event.target isnt brush_elm #do not dispatch if target is overlay
        new_click_event = new Event('mousedown');
        new_click_event.pageX = d3.event.pageX;
        new_click_event.clientX = d3.event.clientX;
        new_click_event.pageY = d3.event.pageY;
        new_click_event.clientY = d3.event.clientY;
        brush_elm.dispatchEvent(new_click_event);

    forwardToSelection = (e) ->
      # forward click event to selection module
      $log.debug e, d3.event


    me.hide = (val) ->
      if arguments.length is 0 then return _hide
      else
        _hide = val
        if _markerG
          _markerG.style('visibility', if _hide then 'hidden' else 'visible')
        _templScope.ttHide = _hide
        _templScope.$apply()
        return me #to enable chaining


    #-- Tooltip properties ---------------------------------------------------------------------------------------------

    me.chart = (chart) ->
      if arguments.length is 0 then return _chart
      else
        _chart = chart
        _chart.lifeCycle().on 'destroy.tooltip', () ->
          if _templScope
            $log.log 'destroying tooltip scope', _templScope.$id, _chart.id()
            _templScope.$destroy()
        return me

    me.active = (val) ->
      if arguments.length is 0 then return _active
      else
        _active = val
        return me #to enable chaining

    me.template = (path) ->
      if arguments.length is 0 then return _path
      else
        _path = path
        if _path.length > 0
          _customTempl = $templateCache.get(_path)
          # wrap template into positioning div
          _templ = "<div class=\"wk-chart-tooltip\" ng-style=\"tooltipStyle\" ng-hide=\"ttHide\">#{_customTempl}</div>"

        return me

    me.area = (val) ->
      if arguments.length is 0 then return _areaSelection
      else
        _areaSelection = val
        _area = _areaSelection.node()
        #if _showMarkerLine
        #  me.tooltip(_container)
        return me #to enable chaining

    me.container = (val) ->
      if arguments.length is 0 then return _container
      else
        _container = val
        if _showMarkerLine
          me.tooltip(_container)
        return me #to enable chaining

    me.markerScale = (val) ->
      if arguments.length is 0 then return _markerScale
      else
        if val
          _showMarkerLine = true
          _markerScale = val
        else
          _showMarkerLine = false
        return me #to enable chaining

    me.data = (val) ->
      if arguments.length is 0 then return _data
      else
        _data = val
        return me #to enable chaining

    me.on = (name, callback) ->
      _tooltipDispatch.on name, callback

    #--- Utility functions ---------------------------------------------------------------------------------------------

    createClosure = (scaleFn) ->
      return () ->
        if _templScope.ttData then scaleFn(_templScope.ttData)

    compileTemplate = (template) ->
      if not _templScope

        _templScope = _chart.scope().$new(true)   ## create the template scope as child of the chart's scope
        $log.log 'creating tooltip scope', _templScope.$id, _chart.id()
        # add scale access functions to scope
        _templScope.properties = {}
        _templScope.map = {}
        _templScope.scale = {}
        _templScope.label = {}
        _templScope.value = {}
        _templScope.ttHide = false
        for name, scale of _chart.allScales().allKinds()
          #_templScope.map[name] = createClosure(scale.map)  #TODO Find memory-leak save implementation
          #_templScope.scale[name] = scale.scale() #TODO Find memory-leak save implementation
          #_templScope.properties[name] = createClosure(scale.layerKeys) #TODO Find memory-leak save implementation
          #_templScope.label[name] = scale.axisLabel() #TODO Find memory-leak save implementation
          #_templScope.value[name] = createClosure(scale.value) #TODO Find memory-leak save implementation
          null

      if not _compiledTempl
        _compiledTempl = $compile(_templ)(_templScope) # and bind it to the tooltip template

    #--- Tooltip -------------------------------------------------------------------------------------------------------

    me.tooltip = (s) -> # register the tooltip events with the selection
      if arguments.length is 0 then return me
      else  # set tooltip for an objects selection
        compileTemplate(_templ) # set up tooltip template
        #me.chart().lifeCycle().on 'destroy.tooltip', tooltipLeave

        if not _showMarkerLine or s.classed('wk-chart-area')  #Note: handlers are cleaned up when wk-chart-area is destroyed
          s.on 'mouseenter.tooltip', tooltipEnter
            .on 'mousemove.tooltip', tooltipMove
            .on 'mouseleave.tooltip', tooltipLeave

        #if not s.empty() and not s.classed('wk-chart-area')
        #  s.on 'mousedown.tooltip', forwardToBrush

    return me

  return behaviorTooltip