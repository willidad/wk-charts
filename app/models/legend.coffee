angular.module('wk.chart').factory 'legend', ($log, $compile, $rootScope, $templateCache, wkChartTemplates) ->

  legendCnt = 0

  uniqueValues = (arr) ->
    set = {}
    for e in arr
      set[e] = 0
    return Object.keys(set)

  legend = () ->

    _id = "legend-#{legendCnt++}"
    _position = 'top-right'
    _scale = undefined
    _templatePath = undefined
    _legendScope = undefined #$rootScope.$new(true)
    _template = wkChartTemplates.legendTemplate()
    _parsedTemplate = undefined
    _containerDiv = undefined
    _legendDiv = undefined
    _title = undefined
    _layout = undefined
    _data = undefined
    _options = undefined
    _show = false
    _showValues = false

    me = {}

    me.position = (pos) ->
      if arguments.length is 0 then return _position
      else
        _position = pos
        return me

    me.show = (val) ->
      if arguments.length is 0 then return _show
      else
        if val is _show then return me # ensure scopes are only created when necessary
        _show = val
        if _show
          _legendScope = $rootScope.$new(true)
          $log.log 'creating legend scope', _legendScope.$id
          _parsedTemplate = $compile(_template)(_legendScope)
        else
          $log.log 'destroying legend scope', _legendScope.$id
        return me #to enable chaining

    me.showValues = (val) ->
      if arguments.length is 0 then return _showValues
      else
        _showValues = val
        return me #to enable chaining

    me.div = (selection) ->
      if arguments.length is 0 then return _legendDiv
      else
        _legendDiv = selection
        return me

    me.layout = (layout) ->
      if arguments.length is 0 then return _layout
      else
        _layout = layout
        return me

    me.scale = (scale) ->
      if arguments.length is 0 then return _scale
      else
        _scale = scale
        return me

    me.title = (title) ->
      if arguments.length is 0 then return _title
      else
        _title = title
        return me

    me.template = (path) ->
      if arguments.length is 0 then return _templatePath
      else
        _templatePath = path
        _template = $templateCache.get(_templatePath)
        #_parsedTemplate = $compile(_template)(_legendScope)
        return me

    _legendStyle = {}
    me.legendStyle = (val) ->
      if arguments.length is 0 then return _legendStyle
      if _.isObject(val)
        _.assign(_legendStyle, val)
      return me

    me.draw = (data, options) ->
      _data = data
      _options = options
      #$log.info 'drawing Legend'
      _containerDiv = _legendDiv or d3.select(me.scale().parent().container().element()).select('.wk-chart')
      if me.show()
        if _containerDiv.select('.wk-chart-legend').empty()
          angular.element(_containerDiv.node()).append(_parsedTemplate)

        if me.showValues()
          layers = uniqueValues(_scale.value(data))
        else
          layers = _scale.layerKeys(data)

        s = _scale.scale()
        if me.layout()?.scales().layerScale()
          s = me.layout().scales().layerScale().scale()
        colorScale = _scale.parent().scales().getKind('color').scale()
        if _scale.kind() isnt 'shape'
          _legendScope.legendRows = layers.map((d) -> {value:d, color:{'background-color':colorScale(d)}})
        else
          _legendScope.legendRows = layers.map((d) -> {value:d, path:d3.svg.symbol().type(s(d)).size(80)()})
        _legendScope.showLegend = true
        _legendScope.legendStyle = me.legendStyle()
        _legendScope.legendStyle.position = if _legendDiv then 'relative' else 'absolute'

        if not _legendDiv
          containerRect = _containerDiv.node().getBoundingClientRect()
          chartAreaRect = _containerDiv.select('.wk-chart-area .wk-chart-background').node().getBoundingClientRect()
          for p in _position.split('-')
              _legendScope.legendStyle[p] = "#{Math.abs(containerRect[p] - chartAreaRect[p])}px"
        _legendScope.title = _title
      else
        _parsedTemplate.remove()
      return me

    #_parsedTemplate = $compile(wkChartTemplates.legendTemplate())(_legendScope)

    me.register = (layout) ->
      layout.lifeCycle().on "drawChart.#{_id}", me.draw
      layout.lifeCycle().on "destroy.#{_id}", () ->
        _legendScope.$destroy()
        _parsedTemplate.remove()
        layout.lifeCycle().on ".#{_id}", null
      return me

    me.redraw = () ->
      if _data and _options
        me.draw(_data, _options)
      return me

    return me

  return legend