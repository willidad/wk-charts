###*
  @ngdoc layout
  @name pie
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a pie chart layout

  @usesDimension size [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'pie', ($log, utils) ->
  pieCntr = 0

  return {
  restrict: 'EA'
  require: '^layout'
  link: (scope, element, attrs, controller) ->
    layout = controller.me

    # set chart specific defaults

    _id = "pie#{pieCntr++}"

    inner = undefined
    outer = undefined
    labels = undefined
    _labelStyle = undefined
    _pieStyle = undefined
    pieBox = undefined
    polyline = undefined
    _scaleList = []
    _selected = undefined
    _tooltip = undefined
    _showLabels = false
    _donat = false
    selectionOffset = 0
    animationDuration = 0

    _merge = utils.mergeData()

    #-------------------------------------------------------------------------------------------------------------------

    ttEnter = (data) ->
      @headerName = _scaleList.y.axisLabel()
      @headerValue = _scaleList.size.axisLabel()
      d = {}
      d.value = _scaleList.size.formattedValue(data)
      cVal = _scaleList.color.map(data)
      d.color = if typeof cVal is 'string' then {fill:cVal, stroke:cVal} else cVal
      @layers[d.value] = d

    #-------------------------------------------------------------------------------------------------------------------

    initialShow = true

    draw = (data, options, x, y, color, size) ->
      #$log.debug 'drawing pie chart v2'

      setStyle = (d) ->
        elem = d3.select(this)
        elem.style(_pieStyle)
        style = color.map(d.data)
        if typeof style is 'string'
          elem.style({fill:style, stroke:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      animationDuration = options.duration

      r = Math.min(options.width, options.height) / 2
      selectionOffset = r * 0.06

      if not pieBox
        pieBox= @append('g').attr('class','wk-chart-pieBox')
      pieBox.attr('transform', "translate(#{options.width / 2},#{options.height / 2})")

      outerR  = r * if _showLabels then 0.8 else 0.9
      innerR = outerR * if _donat then 0.6 else 0

      innerArc = d3.svg.arc()
        .outerRadius(outerR)
        .innerRadius(innerR)

      outerArc = d3.svg.arc()
        .outerRadius(r * 0.9)
        .innerRadius(r * 0.9)

      key = (d) -> _scaleList.y.value(d.data)

      pie = d3.layout.pie()
        .sort(null)
        .value(size.value)

      arcTween = (a) ->
        i = d3.interpolate(this._current, a)
        this._current = i(0)
        return (t) ->
          innerArc(i(t))

      segments = pie(data) # pie computes for each segment the start angle and the end angle
      _merge.key(key)
      _merge(segments).first({startAngle:0, endAngle:0}).last({startAngle:Math.PI * 2, endAngle: Math.PI * 2})

      #--- Draw Pie segments -------------------------------------------------------------------------------------------

      if not inner
        inner = pieBox.selectAll('.wk-chart-innerArc')

      inner = inner
        .data(segments,key)

      inner.enter().append('path')
        .each((d) -> this._current = if initialShow then d else {startAngle:_merge.addedPred(d).endAngle, endAngle:_merge.addedPred(d).endAngle})
        .attr('class','wk-chart-innerArc wk-chart-selectable')
        #.style('fill', (d) ->  color.map(d.data))
        #.style('stroke', (d) -> color.map(d.data))
        #.style('opacity', if initialShow then 0 else 1)
        .call(_tooltip.tooltip)
        .call(_selected)

      inner
        #.attr('transform', "translate(#{options.width / 2},#{options.height / 2})")
        .each(setStyle)
        .transition().duration(options.duration)
          #.style('opacity', 1)
          .attrTween('d',arcTween)

      inner.exit().datum((d) ->  {startAngle:_merge.deletedSucc(d).startAngle, endAngle:_merge.deletedSucc(d).startAngle})
        .transition().duration(options.duration)
          .attrTween('d',arcTween)
          .remove()

      #--- Draw Segment Label Text -------------------------------------------------------------------------------------

      midAngle = (d) -> d.startAngle + (d.endAngle - d.startAngle) / 2

      if _showLabels

        labels = pieBox.selectAll('.wk-chart-data-label').data(segments, key)

        labels.enter().append('text').attr('class', 'wk-chart-data-label')
          .each((d) -> @_current = d)
          .attr("dy", ".35em")
          .style(layout.dataLabelStyle())
          .style('opacity', 0)
          .text((d) -> size.formattedValue(d.data))

        labels.transition().duration(options.duration)
          .style('opacity',1)#.style(layout.dataLabelStyle())
          .text((d) -> size.formattedValue(d.data))
          .attrTween('transform', (d) ->
            _this = this
            interpolate = d3.interpolate(_this._current, d)
            return (t) ->
              d2 = interpolate(t)
              _this._current = d2
              pos = outerArc.centroid(d2)
              pos[0] += 15 * (if midAngle(d2) < Math.PI then  1 else -1)
              return "translate(#{pos})")
          .styleTween('text-anchor', (d) ->
            interpolate = d3.interpolate(@_current, d)
            return (t) ->
              d2 = interpolate(t)
              return if midAngle(d2) < Math.PI then  "start" else "end"
            )

        labels.exit()
          .transition().duration(options.duration).style('opacity',0).remove()

      #--- Draw Connector Lines ----------------------------------------------------------------------------------------

        polyline = pieBox.selectAll(".wk-chart-polyline").data(segments, key)

        polyline.enter()
        . append("polyline").attr('class','wk-chart-polyline')
          .style("opacity", 0)
          .style('pointer-events','none')
          .each((d) ->  this._current = d)

        polyline.transition().duration(options.duration)
          .style("opacity", (d) -> if d.data.value is 0 then  0 else .5)
          .attrTween("points", (d) ->
            this._current = this._current
            interpolate = d3.interpolate(this._current, d)
            _this = this
            return (t) ->
              d2 = interpolate(t)
              _this._current = d2;
              pos = outerArc.centroid(d2)
              pos[0] += 10 * (if midAngle(d2) < Math.PI then  1 else -1)
              return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
          )

        polyline.exit()
          .transition().duration(options.duration)
          .style('opacity',0)
          .remove();

      else
        pieBox.selectAll('.wk-chart-polyline').remove()
        pieBox.selectAll('.wk-chart-data-label').remove()

      initialShow = false

    highlightSelected = (s) ->
      obj = d3.select(this)
      if obj.classed('wk-chart-selected')
        arc = (s.startAngle + s.endAngle) / 2
        offsX = Math.sin(arc) * selectionOffset
        offsY = -Math.cos(arc) * selectionOffset
        obj.transition().duration(animationDuration)
          .attr('transform',"translate(#{offsX},#{offsY})")
      else
        obj.transition().duration(animationDuration)
          .attr('transform','translate(0,0)')

    selectionHandler = (objects) ->
      pieBox.selectAll('.wk-chart-innerArc').each(highlightSelected)

    #-------------------------------------------------------------------------------------------------------------------

    layout.lifeCycle().on 'configure', ->
      _scaleList = this.getScales(['size', 'y', 'color'])
      _scaleList.color.scaleType('category20')
      _scaleList.y.scaleType('ordinal')
      _tooltip = layout.behavior().tooltip
      _selected = layout.behavior().selected
      _tooltip.on "enter.#{_id}", ttEnter

    layout.lifeCycle().on "drawChart.#{_id}", draw
    layout.lifeCycle().on "objectsSelected.#{_id}", selectionHandler

    layout.lifeCycle().on "destroy.#{_id}", ->
      layout.lifeCycle().on ".#{_id}", null
      _tooltip.on ".#{_id}", null

    #-------------------------------------------------------------------------------------------------------------------

    ###*
        @ngdoc attr
        @name pie#labels
        @values true, false
        @param [labels=true] {boolean} controls the display of data labels for each of the pie segments.
    ###
    attrs.$observe 'labels', (val) ->
      if val is 'false'
        _showLabels = false
      else if val is 'true' or val is ""
        _showLabels = true
      layout.lifeCycle().update()

    attrs.$observe 'donat' , (val) ->
      if val is 'false'
        _donat = false
      else if val is 'true' or val is ""
        _donat = true
      layout.lifeCycle().update()

    ###*
      @ngdoc attr
      @name pie#labelStyle
      @param [labelStyle=font-size:"1.3em"] {object} defined the font style attributes for the labels.
    ###
    attrs.$observe 'labelStyle', (val) ->
      if val
        layout.dataLabelStyle(scope.$eval(val))
      layout.lifeCycle().update()

    ###*
      @ngdoc attr
      @name pie#pieStyle
      @param [pieStyle] {object} - Set the pie style for columns lines in the layout
    ###
    attrs.$observe 'pieStyle', (val) ->
      if val
        _pieStyle = scope.$eval(val)

  }
