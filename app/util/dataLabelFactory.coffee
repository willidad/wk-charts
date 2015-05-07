angular.module('wk.chart').factory 'dataLabelFactory', ($log, wkChartMargins) ->

  labelCnt = 0

  dataLabels = () ->

    _labelSelection = undefined
    _active = false
    _keyScale = undefined
    _valueScale = undefined
    _keyAxis = undefined
    _valueAxis = undefined
    _anchor = undefined
    _margin = undefined
    _duration = undefined
    _style = {'font-size':'1.3em'}

    me = (s, doAnimate, style) ->
      _labelSelection = s
      #if _active
      #text = s.select('.wk-chart-data-label')#.data((d) -> d)
      barSize = _keyScale.scale().rangeBand()

      text = s.select('text')
      if text.empty()
        text = s.append('text').attr('class', 'wk-chart-data-label')
        .attr(_anchor)
        .style('opacity', 0)
        .attr(_keyAxis, (d) -> if d.added or d.deleted then 0 else barSize / 2)
        .attr(_valueAxis, (d) -> _margin + if _valueAxis is 'x' then Math.abs(_valueScale.scale()(0) - _valueScale.scale()(d.targetValue)) else Math.min(_valueScale.scale()(0), _valueScale.scale()(d.targetValue)))

      text
        .text((d) -> _valueScale.formatValue(d.targetValue))
        .style(style)
      (if doAnimate then text.transition().duration(_duration) else text)
        .attr(_keyAxis, (d) -> if d.added or d.deleted then 0 else barSize / 2)
        .attr(_valueAxis, (d) -> _margin + if _valueAxis is 'x' then Math.abs(_valueScale.scale()(0) - _valueScale.scale()(d.targetValue)) else Math.min(_valueScale.scale()(0), _valueScale.scale()(d.targetValue)))
        .style('opacity', (d) -> if d.added or d.deleted or not _active then 0 else 1)

    me.brush = (s) ->
      s.select('text').attr(_keyAxis,_keyScale.scale().rangeBand() / 2)

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
        _anchor = {'text-anchor':'middle'}
        _margin = -wkChartMargins.dataLabelPadding.vert
      else
        _keyAxis = 'y'
        _valueAxis = 'x'
        _anchor = {'text-anchor':'start', 'dy':'0.35em'}
        _margin = wkChartMargins.dataLabelPadding.hor
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

    return me