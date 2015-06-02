angular.module('wk.chart').factory 'dataLabelFactory', ($log, wkChartMargins) ->

  labelCnt = 0

  dataLabels = () ->

    _active = false
    _keyScale = undefined
    _valueScale = undefined
    _keyAxis = undefined
    _valueAxis = undefined
    _anchor = undefined
    _margin = undefined
    _duration = undefined
    _style = {'font-size':'1.3em'}
    _markerLabels = false
    _labelPosition = 'auto'

    me = (s, doAnimate, style, backgroundStyle) ->
      if _markerLabels
        _transformFun = (d) ->
          return 'translate(' + (if _keyScale.isHorizontal() then ('0,' + _margin) else (_margin + ', 0') ) + ')'
      else
        barSize = _keyScale.scale().rangeBand()
        _v1Fun = (d) ->
          return if d.added or d.deleted then 0 else barSize / 2
        _v2Fun = (d) ->
          return _margin + if _keyScale.isHorizontal() then Math.min(_valueScale.scale()(0), _valueScale.scale()(d.targetValue)) else Math.max(_valueScale.scale()(0), _valueScale.scale()(d.targetValue))
        _transformFun = (d) ->
          v1 = _v1Fun(d)
          v2 = _v2Fun(d)
          return 'translate(' + (if _keyScale.isHorizontal() then (v1 + ',' + v2) else  (v2 + ',' + v1) ) + ')'

      textGroup = s.select('g.wk-chart-data-label')
      text = s.select('text')
      if textGroup.empty()
        textGroup = s.append('g').attr('class', 'wk-chart-data-label')
          .style('opacity', 1)
          .attr('transform', _transformFun)
        textBg = textGroup.append('rect').attr('class', 'wk-chart-data-label-bg')
        text = textGroup.append('text')
          .attr(_anchor)
      else
        text = textGroup.select('text')
        textBg = textGroup.select('rect.wk-chart-data-label-bg')

      text
        .text((d) -> _valueScale.formatValue(d.targetValue))
        .style(style)
      console.log(_active)
      (if doAnimate then textGroup.transition().duration(_duration) else textGroup)
        .attr('transform', _transformFun)
        .style('opacity', (d) -> if d.added or d.deleted or not _active then 0 else 1)

      # Update the background field of the number
      textGroup.each((d) ->
          bbox = @getBBox()
          d3.select(this).select('rect.wk-chart-data-label-bg').attr(bbox)
        )
      textBg.style(backgroundStyle)

    me.active = (val) ->
      if arguments.length is 0 then return _active
      _active = val
      return me

    me.keyScale = (val) ->
      if arguments.length is 0 then return _keyScale
      _keyScale = val
      if _keyScale.isHorizontal()
        _keyAxis = 'x'
        _valueAxis = 'y'
        me.labelPosition('above')
      else
        _keyAxis = 'y'
        _valueAxis = 'x'
        me.labelPosition('right')
      return me

    me.labelPosition = (val) ->
      if arguments.length is 0 then return _labelPosition
      _labelPosition = val

      if _labelPosition is 'above'
        _anchor = { 'text-anchor': 'middle' }
        _margin = -wkChartMargins.dataLabelPadding.vert

      else if _labelPosition is 'below'
        _anchor = { 'text-anchor': 'middle' }
        _margin = wkChartMargins.dataLabelPadding.vert

      else if _labelPosition is 'right'
        _anchor = { 'text-anchor': 'start', 'dy': '0.35em' }
        _margin = wkChartMargins.dataLabelPadding.hor

      else if _labelPosition is 'left'
        _anchor = { 'text-anchor': 'end', 'dy': '0.35em' }
        _margin = -wkChartMargins.dataLabelPadding.hor

      return me

    me.valueScale = (val) ->
      if arguments.length is 0 then return _valueScale
      _valueScale = val
      return me

    me.duration = (val) ->
      if arguments.length is 0 then return _duration
      _duration = val
      return me

    me.style = (val) ->
      if arguments.length is 0 then return _style
      _style = val
      return me

    me.markerLabels = (val) ->
      if arguments.length is 0 then return _markerLabels
      _markerLabels = val
      return me

    return me