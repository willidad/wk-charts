angular.module('wk.chart').factory 'wkGeoMap', ($log, utils) ->
  mapCntr = 0

  parseList = (val) ->
    if val
      l = val.trim().replace(/^\[|\]$/g, '').split(',').map((d) -> d.replace(/^[\"|']|[\"|']$/g, ''))
      l = l.map((d) -> if isNaN(d) then d else +d)
      return if l.length is 1 then return l[0] else l

  wkGeoMap = () ->
    me = ()->
    _layout = undefined

    _tooltip = undefined
    _selected = undefined
    _scaleList = {}
    _id = 'geoMap' + mapCntr++
    _dataMapping = d3.map()

    _scale = 1
    _rotate = [0,0]
    _idProp = ''

    #-----------------------------------------------------------------------------------------------------------------

    ttEnter = (data) ->

      val = _dataMapping.get(data.properties[_idProp[0]])
      style = _scaleList.color.map(val)
      @layers[val.RS] = {value:val.DES, color: {fill:if typeof style is 'string' then style else style.color}}

    #-----------------------------------------------------------------------------------------------------------------
    pathSel = []

    _projection = d3.geo.orthographic()
    _width = 0
    _height = 0
    _path = undefined
    _zoom = d3.geo.zoom()
      .projection(_projection)
      #.scaleExtent([projection.scale() * .7, projection.scale() * 10])
      .on "zoom.redraw", () ->
        d3.event.sourceEvent.preventDefault();
        pathSel.attr("d", _path);

    _geoJson = undefined

    draw = (data, options, x, y, color) ->

      setStyle = (d) ->
        elem = d3.select(this)
        val = _dataMapping.get(d.properties[_idProp[0]])
        style = color.map(val)
        if typeof style is 'string'
          elem.style({fill:style, stroke:style})
        else
          cVal = style.color
          style.fill = cVal
          elem.style(style)

      _width = options.width
      _height = options.height
      if data and data[0].hasOwnProperty(_idProp[1])
        for e in data
          _dataMapping.set(e[_idProp[1]], e)

      if _geoJson

        _projection.translate([_width/2, _height/2])
        pathSel = this.selectAll("path").data(_geoJson.features, (d) -> d.properties[_idProp[0]])
        pathSel
          .enter().append("svg:path")
            .style('fill','lightgrey').style('stroke', 'darkgrey')
            .call(_tooltip.tooltip)
            .call(_selected)
            .call(_zoom)

        pathSel
          .attr("d", _path)
          .each(setStyle)

        pathSel.exit().remove()

    #-----------------------------------------------------------------------------------------------------------------
    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      _layout = layout

      _layout.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['color'])
        _scaleList.color.resetOnNewData(true)

      _layout.lifeCycle().on 'drawChart', draw
      _tooltip = _layout.behavior().tooltip
      _selected = _layout.behavior().selected
      _tooltip.on "enter.#{_id}", ttEnter

      _layout.lifeCycle().on "destroy.#{_id}", ->
        _layout.lifeCycle().on ".#{_id}", null
        _tooltip.on ".#{_id}", null
        scope.$destroy()
      return me
    return me
  return wkGeoMap