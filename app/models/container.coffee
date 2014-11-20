angular.module('wk.chart').factory 'container', ($log, $window, d3ChartMargins, scaleList, axisConfig, d3Animation, behavior) ->

  containerCnt = 0

  container = () ->

    me = ()->

    #--- Variable declarations and defaults ----------------------------------------------------------------------------

    _containerId = 'cntnr' + containerCnt++
    _chart = undefined
    _element = undefined
    _elementSelection = undefined
    _layouts = []
    _legends = []
    _svg = undefined
    _container = undefined
    _spacedContainer = undefined
    _chartArea = undefined
    _chartArea = undefined
    _margin = angular.copy(d3ChartMargins.default)
    _innerWidth = 0
    _innerHeight = 0
    _titleHeight = 0
    _data = undefined
    _overlay = undefined
    _behavior = undefined
    _duration = 0

    #--- Getter/Setter Functions ---------------------------------------------------------------------------------------

    me.id = () ->
      return _containerId

    me.chart = (chart) ->
      if arguments.length is 0 then return _chart
      else
        _chart = chart
        # register to lifecycle events
        #_chart.lifeCycle().on "sizeContainer.#{me.id()}", me.sizeContainer
        _chart.lifeCycle().on "drawAxis.#{me.id()}", me.drawChartFrame
        return me

    me.element = (elem) ->
      if arguments.length is 0 then return _element
      else
        _resizeHandler = () ->  me.chart().lifeCycle().resize(true) # no animation
        _element = elem
        _elementSelection = d3.select(_element)
        if _elementSelection.empty()
          $log.error "Error: Element #{_element} does not exist"
        else
          _genChartFrame()
          # find the div element to attach the handler to
          resizeTarget = _elementSelection.select('.wk-chart').node()
          new ResizeSensor(resizeTarget, _resizeHandler)

        return me

    me.addLayout = (layout) ->
      _layouts.push(layout)
      return me

    me.height = () ->
      return _innerHeight

    me.width = () ->
      return _innerWidth

    me.margins = () ->
      return _margin

    me.getChartArea = () ->
      return _chartArea

    me.getOverlay = () ->
      return _overlay

    me.getContainer = () ->
      return _spacedContainer

    #--- utility functions ---------------------------------------------------------------------------------------------
    #  Return: text height
    drawAndPositionText = (container, text, selector, fontSize, offset) ->
      elem = container.select('.' + selector)
      if elem.empty()
        elem = container.append('text')
          .attr({class:selector, 'text-anchor': 'middle', y:if offset then offset else 0})
          .style('font-size',fontSize)
      elem.text(text)
      #measure size and return it
      return elem.node().getBBox().height


    drawTitleArea = (title, subTitle) ->
      titleAreaHeight = 0
      area = _container.select('.wk-chart-title-area')
      if area.empty()
        area = _container.append('g').attr('class','wk-chart-title-area wk-center-hor')
      if title
        _titleHeight = drawAndPositionText(area, title, 'wk-chart-title', '2em')
      if subTitle
        drawAndPositionText(area, subTitle, 'wk-chart-subtitle', '1.8em', _titleHeight)

      return area.node().getBBox().height

    getAxisRect = (dim) ->
      axis = _container.append('g')
      dim.scale().range([0,100])
      axis.call(dim.axis())

      if dim.rotateTickLabels()
        axis.selectAll("text")
        .attr({dy:'-0.71em', x:-9})
        .attr('transform',"translate(0,9) rotate(#{dim.rotateTickLabels()})")
        .style('text-anchor','end')

      box = axis.node().getBBox()
      axis.remove()
      return box

    drawAxis = (dim) ->
      axis = _container.select(".wk-chart-axis.wk-chart-#{dim.axisOrient()}")
      if axis.empty()
        axis = _container.append('g').attr('class', 'wk-chart-axis wk-chart-' + dim.axisOrient())
      axis.transition().duration(_duration).call(dim.axis())

      if dim.rotateTickLabels()
        axis.selectAll(".#{dim.axisOrient()}.wk-chart-axis wk-chart-text")
          .attr({dy:'-0.71em', x:-9})
          .attr('transform',"translate(0,9) rotate(#{dim.rotateTickLabels()})")
          .style('text-anchor','end')
      else
        axis.selectAll(".#{dim.axisOrient()}.wk-chart-axis wk-chart-text").attr('transform', null)

    _removeAxis = (orient) ->
      _container.select(".wk-chart-axis.wk-chart-#{orient}").remove()

    _removeLabel = (orient) ->
      _container.select(".wk-chart-label.wk-chart-#{orient}").remove()

    drawGrid = (s, noAnimation) ->
      duration = if noAnimation then 0 else _duration
      kind = s.kind()
      ticks = if s.isOrdinal() then s.scale().range() else s.scale().ticks()
      gridLines = _container.selectAll(".wk-chart-grid.wk-chart-#{kind}").data(ticks, (d) -> d)
      gridLines.enter().append('line').attr('class', "wk-chart-grid wk-chart-#{kind}")
        .style('pointer-events', 'none')
        .style('opacity',0)
      if kind is 'y'
        gridLines.transition().duration(duration)
          .attr({
            x1:0,
            x2: _innerWidth,
            y1:(d) -> if s.isOrdinal() then  d else s.scale()(d),
            y2:(d) -> if s.isOrdinal() then d else s.scale()(d)
          })
          .style('opacity',1)
      else
        gridLines.transition().duration(duration)
          .attr({
            y1:0,
            y2: _innerHeight,
            x1:(d) -> if s.isOrdinal() then d else s.scale()(d),
            x2:(d) -> if s.isOrdinal() then d else s.scale()(d)
          })
          .style('opacity',1)
      gridLines.exit().transition().duration(duration).style('opacity',0).remove()

    #--- Build the container -------------------------------------------------------------------------------------------
    # build generic elements first

    _genChartFrame = () ->
      _svg = _elementSelection.append('div').attr('class', 'wk-chart').append('svg').attr('class', 'wk-chart')
      _svg.append('defs').append('clipPath').attr('id', "wk-chart-clip-#{_containerId}").append('rect')
      _container= _svg.append('g').attr('class','wk-chart-container')
      _overlay = _container.append('g').attr('class', 'wk-chart-overlay').style('pointer-events', 'all')
      _overlay.append('rect').style('visibility', 'hidden').attr('class', 'wk-chart-background').datum({name:'background'})
      _chartArea = _container.append('g').attr('class', 'wk-chart-area')

    # start to build and size the elements from top to bottom

    #--- chart frame (title, axis, grid) -------------------------------------------------------------------------------

    me.drawChartFrame = (notAnimated) ->
      bounds = _elementSelection.node().getBoundingClientRect()
      _duration = if notAnimated then 0 else me.chart().animationDuration()
      _height = bounds.height
      _width = bounds.width
      titleAreaHeight = drawTitleArea(_chart.title(), _chart.subTitle())

      #--- get sizing of frame components before positioning them -------------------------------------------------------

      axisRect = {top:{height:0, width:0},bottom:{height:0, width:0},left:{height:0, width:0},right:{height:0, width:0}}
      labelHeight = {top:0 ,bottom:0, left:0, right:0}

      for l in _layouts
        for k, s of l.scales().allKinds()
          if s.showAxis()
            s.axis().scale(s.scale()).orient(s.axisOrient())  # ensure the axis works on the right scale
            axisRect[s.axisOrient()] = getAxisRect(s)
            #--- draw label ---
            label = _container.select(".wk-chart-label.wk-chart-#{s.axisOrient()}")
            if s.showLabel()
              if label.empty()
                label = _container.append('g').attr('class', 'wk-chart-label wk-chart-'  + s.axisOrient())
              labelHeight[s.axisOrient()] = drawAndPositionText(label, s.axisLabel(), 'wk-chart-label-text', '1.5em');
            else
              label.remove()
          if s.axisOrientOld() and s.axisOrientOld() isnt s.axisOrient()
            _removeAxis(s.axisOrientOld())
            _removeLabel(s.axisOrientOld())



      #--- compute size of the drawing area  ---------------------------------------------------------------------------

      _innerHeight = _height - titleAreaHeight -  axisRect.top.height - labelHeight.top  - axisRect.bottom.height - labelHeight.bottom - _margin.top - _margin.bottom
      _innerWidth = _width - axisRect.right.width - labelHeight.right  - axisRect.left.width  - labelHeight.left - _margin.left - _margin.right

      #--- reset scale ranges and redraw axis with adjusted range ------------------------------------------------------

      for l in _layouts
        for k, s of l.scales().allKinds()
          if k is 'x'
            s.range([0, _innerWidth])
          else if k is 'y'
            s.range([_innerHeight, 0])
          if s.showAxis()
            drawAxis(s)

      #--- position frame elements -------------------------------------------------------------------------------------

      leftMargin = axisRect.left.width + labelHeight.left + _margin.left
      topMargin = titleAreaHeight + axisRect.top.height  + labelHeight.top + _margin.top

      _spacedContainer = _container.attr('transform', "translate(#{leftMargin}, #{topMargin})")
      _svg.select("#wk-chart-clip-#{_containerId} rect").attr('width', _innerWidth).attr('height', _innerHeight)
      _spacedContainer.select('.wk-chart-overlay>.wk-chart-background').attr('width', _innerWidth).attr('height', _innerHeight)
          #TODO Fix the potentially negative _innerWidth and _innerHeight case (width:-18, height:-16)
      _spacedContainer.select('.wk-chart-area').style('clip-path', "url(#wk-chart-clip-#{_containerId})")
      _spacedContainer.select('.wk-chart-overlay').style('clip-path', "url(#wk-chart-clip-#{_containerId})")

      _container.selectAll('.wk-chart-axis.wk-chart-right').attr('transform', "translate(#{_innerWidth}, 0)")
      _container.selectAll('.wk-chart-axis.wk-chart-bottom').attr('transform', "translate(0, #{_innerHeight})")

      _container.select('.wk-chart-label.wk-chart-left').attr('transform', "translate(#{-axisRect.left.width-labelHeight.left / 2 }, #{_innerHeight/2}) rotate(-90)")
      _container.select('.wk-chart-label.wk-chart-right').attr('transform', "translate(#{_innerWidth+axisRect.right.width + labelHeight.right / 2}, #{_innerHeight/2}) rotate(90)")
      _container.select('.wk-chart-label.wk-chart-top').attr('transform', "translate(#{_innerWidth / 2}, #{-axisRect.top.height - labelHeight.top / 2 })")
      _container.select('.wk-chart-label.wk-chart-bottom').attr('transform', "translate(#{_innerWidth / 2}, #{_innerHeight + axisRect.bottom.height + labelHeight.bottom })")

      _container.selectAll('.wk-chart-title-area').attr('transform', "translate(#{_innerWidth/2}, #{-topMargin + _titleHeight})")

      #--- finally, draw grid lines

      for l in _layouts
        for k, s of l.scales().allKinds()
          if s.showAxis() and s.showGrid()
            drawGrid(s)

      _chart.behavior().overlay(_overlay)
      _chart.behavior().container(_chartArea)

    #--- Brush Accelerator ---------------------------------------------------------------------------------------------

    me.drawSingleAxis = (scale) ->
      if scale.showAxis()
        a = _spacedContainer.select(".wk-chart-axis.wk-chart-#{scale.axis().orient()}")
        a.call(scale.axis())

        if scale.showGrid()
          drawGrid(scale, true)
      return me

    return me

  return container