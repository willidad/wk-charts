angular.module('wk.chart').factory 'wkSpider', ($log, utils) ->
  spiderCntr = 0

  wkSpider = () ->
    me = ()->
    _layout = undefined
    #$log.debug 'bubbleChart linked'

    _tooltip = undefined
    _scaleList = {}
    _id = 'spider' + spiderCntr++
    axis = d3.svg.axis()
    _data = undefined

    #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

    ttEnter = (data) ->
      for d in _data
        style = _scaleList.color.scale()(data)
        @layers[_scaleList.x.value(d)] = {value:_scaleList.y.formatValue(d[data]), color: {fill:(if typeof style is 'string' then style else style.color)}}

    #--- Draw --------------------------------------------------------------------------------------------------------

    draw = (data, options, x, y, color) ->

      setStyle = (d) ->
        elem = d3.select(this)
        #elem.style(_areaStyle)
        style = color.scale()(d)
        if typeof style is 'string'
          elem.style({fill:'none', stroke:style, 'stroke-width':3})
        else
          cVal = style.color
          style.stroke = cVal
          elem.style(style)

      _data = data
      $log.log data
      # compute center of area
      centerX = options.width/2
      centerY = options.height/2
      radius = d3.min([centerX, centerY]) * 0.8
      textOffs = 20
      nbrAxis = data.length
      arc = Math.PI * 2 / nbrAxis
      degr = 360 / nbrAxis

      axisG = this.select('.wk-chart-axis')
      if axisG.empty()
        axisG = this.append('g').attr('class', 'wk-chart-axis')

      ticks = y.scale().ticks(y.ticks())
      y.scale().range([radius,0]) # tricks the way axis are drawn. Not pretty, but works :-)
      axis.scale(y.scale()).orient('right').tickValues(ticks).tickFormat(y.tickFormat())
      axisG.call(axis).attr('transform', "translate(#{centerX},#{centerY-radius})")
      y.scale().range([0,radius])

      lines = this.selectAll('.wk-chart-axis-line').data(data,(d) -> x.value(d))
      lines.enter()
        .append('line').attr('class', 'wk-chart-axis-line')
        .style('stroke', 'darkgrey')

      lines
        .attr({x1:0, y1:0, x2:0, y2:radius})
        .attr('transform',(d,i) -> "translate(#{centerX}, #{centerY})rotate(#{degr * i + 180})")

      lines.exit().remove()

      #draw tick lines
      tickLine = d3.svg.line().x((d) -> d.x).y((d)->d.y)
      tickPath = this.selectAll('.wk-chart-tickPath').data(ticks)
      tickPath.enter().append('path').attr('class', 'wk-chart-tickPath')
        .style('fill', 'none').style('stroke', 'lightgrey')

      tickPath
        .attr('d',(d) ->
          p = data.map((a, i) -> {x:Math.sin(arc*i + Math.PI) * y.scale()(d),y:Math.cos(arc*i + Math.PI) * y.scale()(d)})
          tickLine(p) + 'Z')
        .attr('transform', "translate(#{centerX}, #{centerY})")

      tickPath.exit().remove()

      axisLabels = this.selectAll('.wk-chart-axis-text').data(data,(d) -> x.value(d))
      axisLabels.enter().append('text')
        .attr('class', 'wk-chart-axis-text')
        .style('fill', 'black')
        .attr('dy', '0.8em')
        .attr('text-anchor', 'middle')
      axisLabels
        .attr({
            x: (d, i) -> centerX + Math.sin(arc * i + Math.PI) * (radius + textOffs)
            y: (d, i) -> centerY + Math.cos(arc * i + Math.PI) * (radius + textOffs)
          })
        .text((d) -> x.value(d))
      axisLabels.exit().remove()

      # draw data lines

      dataPath = d3.svg.line().x((d) -> d.x).y((d) -> d.y)

      dataLine = this.selectAll('.wk-chart-data-line').data(y.layerKeys(data))
      dataLine.enter().append('path').attr('class', 'wk-chart-data-line')
        #.style({
        #  stroke:(d) -> color.scale()(d)
        #  fill:(d) -> 'none' #color.scale()(d)
        #  #'fill-opacity': 0.2
        #  'stroke-width': 2
        #})
        .call(_tooltip.tooltip)
      dataLine.attr('d', (d) ->
          p = data.map((a, i) -> {x:Math.sin(arc*i + Math.PI) * y.scale()(a[d]),y:Math.cos(arc*i + Math.PI) * y.scale()(a[d])})
          dataPath(p) + 'Z'
        )
        .each(setStyle)
        .attr('transform', "translate(#{centerX}, #{centerY})")


    #--- Configuration and registration --------------------------------------------------------------------------------

    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout
      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        _scaleList.y.domainCalc('max')
        _scaleList.x.resetOnNewData(true).scaleType('ordinal')
        #@layerScale('color')
        _tooltip = _layout.behavior().tooltip
        _tooltip.on "enter.#{_id}", ttEnter

      _layout.lifeCycle().on "drawChart.#{_id}", draw

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
      return me
    return me
  return wkSpider
  