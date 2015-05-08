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

    me = (s, doAnimate, style, backgroundStyle) ->
      _labelSelection = s
      #if _active
      #text = s.select('.wk-chart-data-label')#.data((d) -> d)
      barSize = _keyScale.scale().rangeBand()

      textGroup = s.select('g.wk-chart-data-label')
      text = s.select('text')
      if textGroup.empty()
        textGroup = s.append('g').attr('class', 'wk-chart-data-label')
          .style('opacity', 0)
          .attr('transform', (d) -> 
            v1 = if d.added or d.deleted then 0 else barSize / 2
            v2 = _margin + if _valueAxis is 'x' then Math.abs(_valueScale.scale()(0) - _valueScale.scale()(d.targetValue)) else Math.min(_valueScale.scale()(0), _valueScale.scale()(d.targetValue))
            return 'translate(' + (if _valueAxis is not 'x' then (v1 + ',' + v2) else  (v2 + ',' + v1) ) + ')'
          )
        textBg = textGroup.append('rect').attr('class', 'wk-chart-data-label-bg')
        text = textGroup.append('text')
          .attr(_anchor)
      else
        text = textGroup.select('text')
        textBg = textGroup.select('rect.wk-chart-data-label-bg')

      #textBg.attr('width', (d) -> )
      text
        .text((d) -> _valueScale.formatValue(d.targetValue))
        .style(style)
      (if doAnimate then textGroup.transition().duration(_duration) else textGroup)
        .attr('transform', (d) -> 
            v1 = if d.added or d.deleted then 0 else barSize / 2
            v2 = _margin + if _valueAxis is 'x' then Math.abs(_valueScale.scale()(0) - _valueScale.scale()(d.targetValue)) else Math.min(_valueScale.scale()(0), _valueScale.scale()(d.targetValue))
            return 'translate(' + (if _valueAxis is not 'x' then (v1 + ',' + v2) else  (v2 + ',' + v1) ) + ')'
        )
        .style('opacity', (d) -> if d.added or d.deleted or not _active then 0 else 1)

      # Update the background field of the number
      textGroup.each((d) ->
          bbox = @getBBox()
          d3.select(this).select('rect.wk-chart-data-label-bg').attr(bbox)
        )
      textBg.style(backgroundStyle)


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