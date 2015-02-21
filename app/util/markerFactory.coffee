angular.module('wk.chart').factory 'markerFactory', ($log, d3Animation) ->

  markersCnt = 0

  markers = () ->

    _x = undefined
    _y = undefined
    _color = undefined
    _active = false
    _opacity = 0
    _initialOpacity = 0
    _duration = d3Animation.duration;
    _isVertical = false
    _markerSelection = undefined
    _id = markersCnt++

    me = (s, doAnimate) ->
      _markerSelection = s
      if _active
        m = s.selectAll(".wk-chart-marker-#{_id}").data(
          (d) -> d.values
        , (d, i) -> i
        )

        m.enter().append('circle').attr('class', "wk-chart-marker-#{_id}")
          .style('fill', _color)
          .attr('r', 5)
          .style('pointer-events', 'none')
          .style('opacity', _initialOpacity)
        mUpdate = if doAnimate then m.transition().duration(_duration) else m
        mUpdate
          .attr('cx', _x)
          .attr('cy', _y)
          .style('opacity', (d) -> (if d.added or d.deleted or d.layerAdded or d.layerDeleted then 0 else 1) * _opacity)
        mExit = if doAnimate then m.exit().transition().duration(_duration) else m.exit()
        mExit
          .remove()
      else
        s.selectAll(".wk-chart-marker-#{_id}").transition().duration(_duration)
          .style('opacity', 0).remove()

    me.brush = (selection, idxRange) ->
      if _active
        if _isVertical
          c = 'cy'
          v = _y
        else
          c = 'cx'
          v = _x
        if idxRange
          _markerSelection.selectAll(".wk-chart-marker-#{_id}").each((d, i) ->
            if idxRange[0] <= i and i <= idxRange[1]
              d3.select(this).attr(c,v).style('opacity', 1)
            else
              d3.select(this).style('opacity', 0)
          )
        else
          _markerSelection.selectAll(".wk-chart-marker-#{_id}").attr(c, v)

    me.active = (trueFalse) ->
      if arguments.length is 0 then return _active
      _initialOpacity = if not _active and trueFalse then 0 else 1
      _active = trueFalse
      _opacity = if _active then 1 else 0
      return me

    me.x = (val) ->
      if arguments.length is 0 then return _x
      _x = val
      return me

    me.y = (val) ->
      if arguments.length is 0 then return _y
      _y = val
      return me

    me.color = (val) ->
      if arguments.length is 0 then return _color
      _color = val
      return me

    me.opacity = (val) ->
      if arguments.length is 0 then return _opacity
      _opacity = val
      return me

    me.duration = (val) ->
      if arguments.length is 0 then return _duration
      _duration = val
      return me

    me.isVertical = (val) ->
      if arguments.length is 0 then return _isVertical
      _isVertical = val
      return me

    return me