angular.module('wk.chart').factory 'layout', ($log, scale, scaleList, timing) ->

  layoutCntr = 0

  layout = () ->
    _id = "layout#{layoutCntr++}"
    _container = undefined
    _data = undefined
    _chart = undefined
    _scaleList = scaleList()
    _showLabels = false
    _layoutLifeCycle = d3.dispatch('configure', 'drawChart', 'prepareData', 'brush', 'redraw', 'drawAxis', 'update', 'updateAttrs', 'brushDraw', 'destroy', 'objectsSelected', 'animationStartState', 'animationEndState')

    me = () ->

    me.id = (id) ->
      return _id

    me.chart = (chart) ->
      if arguments.length is 0 then return _chart
      else
        _chart = chart
        _scaleList.parentScales(chart.scales())
        _chart.lifeCycle().on "configure.#{me.id()}", () -> _layoutLifeCycle.configure.apply(me.scales()) #passthrough
        _chart.lifeCycle().on "drawChart.#{me.id()}", me.draw # register for the drawing event
        _chart.lifeCycle().on "prepareData.#{me.id()}", me.prepareData

        _chart.lifeCycle().on "animationStartState..#{me.id()}", me.animationStartState
        _chart.lifeCycle().on "animationEndState..#{me.id()}", me.animationEndState
        _chart.lifeCycle().on "destroy.#{me.id()}", () ->
          _layoutLifeCycle.destroy() #passthrough
          _chart.lifeCycle().on ".#{me.id()}", null #de-register all handlers
        return me

    me.scales = () ->
      return _scaleList

    me.scaleProperties = () ->
      return me.scales().getScaleProperties()

    me.container = (obj) ->
      if arguments.length is 0 then return _container
      else
        _container = obj
        return me

    me.showDataLabels = (trueFalse) ->
      if arguments.length is 0 then return _showLabels
      else
        _showLabels = trueFalse
        return me

    _dataLabelStyle = {'font-size':'1.3em'}
    me.dataLabelStyle = (val) ->
      if arguments.length is 0 then return _dataLabelStyle
      if _.isObject(val)
        _.assign(_dataLabelStyle, val)
      return me

    _dataLabelBackgroundStyle = {}
    me.dataLabelBackgroundStyle = (val) ->
      if arguments.length is 0 then return _dataLabelBackgroundStyle
      if _.isObject(val)
        _.assign(_dataLabelBackgroundStyle, val)
      return me

    me.behavior = () ->
      me.chart().behavior()

    me.prepareData = (data) ->
      args = []
      for kind in ['x','y', 'color', 'size', 'shape', 'rangeX', 'rangeY']
        args.push(_scaleList.getKind(kind))
      _layoutLifeCycle.prepareData.apply(data, args)

    me.lifeCycle = ()->
      return _layoutLifeCycle


    #--- DRYout from draw ----------------------------------------------------------------------------------------------

    getDrawArea = () ->
      container = _container.getChartArea()
      drawArea = container.select(".#{me.id()}")
      if drawArea.empty()
        drawArea = container.append('g').attr('class', (d) -> me.id())
      return drawArea

    buildArgs = (data, notAnimated) ->
      options = {
        height:_container.height(),
        width:_container.width(),
        margins:_container.margins(),
        duration: if notAnimated then 0 else me.chart().animationDuration()
      }
      args = [data, options]
      for kind in ['x','y', 'color', 'size', 'shape']
        scale = _scaleList.getKind(kind)
        args.push(scale)
      return args

    #-------------------------------------------------------------------------------------------------------------------

    me.draw = (data, notAnimated) ->
      _data = data

      _layoutLifeCycle.drawChart.apply(getDrawArea(), buildArgs(data, notAnimated))

      _layoutLifeCycle.on "redraw.#{_id}", me.redraw
      _layoutLifeCycle.on "update.#{_id}", me.chart().lifeCycle().update
      _layoutLifeCycle.on "drawAxis.#{_id}", me.chart().lifeCycle().drawAxis
      _layoutLifeCycle.on "updateAttrs.#{_id}", me.chart().lifeCycle().updateAttrs

      _layoutLifeCycle.on "brush.#{_id}", (axis, notAnimated, idxRange) ->
          _container.drawSingleAxis(axis)
          _layoutLifeCycle.brushDraw.apply(getDrawArea(), [axis, idxRange, _container.width(), _container.height()])
          
      _layoutLifeCycle.on "destroy.#{_id}", () ->
        _layoutLifeCycle.on ".#{_id}", null

    me.animationStartState = (data) ->
      _layoutLifeCycle.animationStartState.apply(getDrawArea(), buildArgs(data, true))

    me.animationEndState = (data) ->
      _layoutLifeCycle.animationEndState.apply(getDrawArea(), buildArgs(data, false))

    return me

  return layout