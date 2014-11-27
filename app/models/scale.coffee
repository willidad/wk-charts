angular.module('wk.chart').factory 'scale', ($log, legend, formatDefaults, wkChartScales) ->

  scale = () ->
    _id = ''
    _scale = d3.scale.linear()
    _scaleType = 'linear'
    _exponent = 1
    _isOrdinal = false
    _domain = undefined
    _domainCalc = undefined
    _calculatedDomain = undefined
    _resetOnNewData = false
    _property = ''
    _layerProp = ''
    _layerExclude = []
    _lowerProperty = ''
    _upperProperty = ''
    _range = undefined
    _rangePadding = 0.3
    _rangeOuterPadding = 0.3
    _inputFormatString = undefined
    _inputFormatFn = (data) -> if isNaN(+data) or _.isDate(data) then data else +data

    _showAxis = false
    _axisOrient = undefined
    _axisOrientOld = undefined
    _axis = undefined
    _ticks = undefined
    _tickFormat = undefined
    _tickValues = undefined
    _rotateTickLabels = undefined
    _showLabel = false
    _axisLabel = undefined
    _showGrid = false
    _isHorizontal = false
    _isVertical = false
    _kind = undefined
    _parent = undefined
    _chart = undefined
    _layout = undefined
    _legend = legend()
    _outputFormatString = undefined
    _outputFormatFn = undefined

    me = () ->

    #---- utility functions ----------------------------------------------------------------------------------------

    keys = (data) -> if _.isArray(data) then _.reject(_.keys(data[0]), (d) -> d is '$$hashKey') else _.reject(_.keys(data), (d) -> d is '$$hashKey')

    layerTotal = (d, layerKeys) ->
      layerKeys.reduce(
        (prev, next) -> +prev + +me.layerValue(d,next)
      , 0)

    layerMax = (data, layerKeys) ->
      d3.max(data, (d) -> d3.max(layerKeys, (k) -> me.layerValue(d,k)))

    layerMin = (data, layerKeys) ->
      d3.min(data, (d) -> d3.min(layerKeys, (k) -> me.layerValue(d,k)))

    parsedValue = (v) ->
      if _inputFormatFn.parse then _inputFormatFn.parse(v) else _inputFormatFn(v)

    calcDomain = {
      extent: (data) ->
        layerKeys = me.layerKeys(data)
        return [layerMin(data, layerKeys), layerMax(data, layerKeys)]
      max: (data) ->
        layerKeys = me.layerKeys(data)
        return [0, layerMax(data, layerKeys)]
      min: (data) ->
        layerKeys = me.layerKeys(data)
        return [0, layerMin(data, layerKeys)]
      totalExtent: (data) ->
        if data[0].hasOwnProperty('total')
          return d3.extent(data.map((d) ->
            d.total))
        else
          layerKeys = me.layerKeys(data)
          return d3.extent(data.map((d) ->
            layerTotal(d, layerKeys)))
      total: (data) ->
        if data[0].hasOwnProperty('total')
          return [0, d3.max(data.map((d) ->
            d.total))]
        else
          layerKeys = me.layerKeys(data)
          return [0, d3.max(data.map((d) ->
            layerTotal(d, layerKeys)))]
      rangeExtent: (data) ->
        if me.upperProperty()
          return [d3.min(me.lowerValue(data)), d3.max(me.upperValue(data))]
        else
          if data.length > 1
            start = me.lowerValue(data[0])
            step = me.lowerValue(data[1]) - start
            return [me.lowerValue(data[0]), start + step * (data.length) ]
      rangeMin: (data) ->
        return [0, d3.min(me.lowerValue(data))]
      rangeMax: (data) ->
        if me.upperProperty()
          return [0, d3.max(me.upperValue(data))]
        else
          start = me.lowerValue(data[0])
          step = me.lowerValue(data[1]) - start
          return [0, start + step * (data.length) ]
      }

    #-------------------------------------------------------------------------------------------------------------------

    me.id = () ->
      return _kind + '.' + _parent.id()

    me.kind = (kind) ->
      if arguments.length is 0 then return _kind
      else
        _kind = kind
        return me

    me.parent = (parent) ->
      if arguments.length is 0 then return _parent
      else
        _parent = parent
        return me

    me.chart = (val) ->
      if arguments.length is 0 then return _chart
      else
        _chart = val
        return me #to enable chaining

    me.layout = (val) ->
      if arguments.length is 0 then return _layout
      else
        _layout = val
        return me #to enable chaining

    #-------------------------------------------------------------------------------------------------------------------

    me.scale = () ->
      return _scale

    me.legend = () ->
      return _legend

    me.isOrdinal = () ->
      _isOrdinal

    me.isHorizontal = (trueFalse) ->
      if arguments.length is 0 then return _isHorizontal
      else
        _isHorizontal = trueFalse
        if trueFalse
          _isVertical = false
        return me

    me.isVertical = (trueFalse) ->
      if arguments.length is 0 then return _isVertical
      else
        _isVertical = trueFalse
        if trueFalse
          _isHorizontal = false
        return me

    #-- ScaleType ------------------------------------------------------------------------------------------------------

    me.scaleType = (type) ->
      if arguments.length is 0 then return _scaleType
      else
        if d3.scale.hasOwnProperty(type) # support the full list of d3 scale types
          _scale = d3.scale[type]()
          _scaleType = type
          me.format(formatDefaults.number)
        else if type is 'time' # time scale is in d3.time object, not in d3.scale.
          _scale = d3.time.scale()
          _scaleType = 'time'
          if _inputFormatString
            me.dataFormat(_inputFormatString)
          me.format(formatDefaults.date)
        else if wkChartScales.hasOwnProperty(type)
          _scaleType = type
          _scale = wkChartScales[type]()
        else
          $log.error 'Error: illegal scale type:', type

        _isOrdinal = _scaleType in ['ordinal', 'category10', 'category20', 'category20b', 'category20c']
        if _range
          me.range(_range)

        if _showAxis
          _axis.scale(_scale)

        if _exponent and _scaleType is 'pow'
          _scale.exponent(_exponent)
        return me

    me.exponent = (value) ->
      if arguments.length is 0 then return _exponent
      else
        _exponent = value
        if _scaleType is 'pow'
          _scale.exponent(_exponent)
        return me

    #--- Domain functions ----------------------------------------------------------------------------------------------

    me.domain = (dom) ->
      if arguments.length is 0 then return _domain
      else
        _domain = dom
        if _.isArray(_domain)
          _scale.domain(_domain)
        return me

    me.domainCalc = (rule) ->
      if arguments.length is 0
        return if _isOrdinal then undefined else _domainCalc
      else
        if calcDomain.hasOwnProperty(rule)
          _domainCalc = rule
        else
          $log.error 'illegal domain calculation rule:', rule, " expected", _.keys(calcDomain)
        return me

    me.getDomain = (data) ->
      if arguments.length is 0 then return _scale.domain()
      else
        if not _domain and me.domainCalc()
            return _calculatedDomain
        else
          if _domain
            return _domain
          else
            return me.value(data)

    me.resetOnNewData = (trueFalse) ->
      if arguments.length is 0 then return _resetOnNewData
      else
        _resetOnNewData = trueFalse
        return me

    #--- Range Functions -----------------------------------------------------------------------------------------------

    me.range = (range) ->
      if arguments.length is 0 then return _scale.range()
      else
        _range = range
        if _scaleType is 'ordinal' and me.kind() in ['x','y']
            _scale.rangeBands(range, _rangePadding, _rangeOuterPadding)
        else if not (_scaleType in ['category10', 'category20', 'category20b', 'category20c'])
          _scale.range(range) # ignore range for color category scales

        return me

    me.rangePadding = (config) ->
      if arguments.length is 0 then return {padding:_rangePadding, outerPadding:_rangeOuterPadding}
      else
        _rangePadding = config.padding
        _rangeOuterPadding = config.outerPadding
        return me

    #--- property related attributes -----------------------------------------------------------------------------------

    me.property = (name) ->
      if arguments.length is 0 then return _property
      else
        _property = name
        return me

    me.layerProperty = (name) ->
      if arguments.length is 0 then return _layerProp
      else
        _layerProp = name
        return me

    me.layerExclude = (excl) ->
      if arguments.length is 0 then return _layerExclude
      else
        _layerExclude = excl
        return me

    me.layerKeys = (data) ->
      if _property
        if _.isArray(_property)
          return _.intersection(_property, keys(data)) # ensure only keys also in the data are returned and $$hashKey is not returned
        else
          return [_property] #always return an array !!!
      else
        _.reject(keys(data), (d) -> d in _layerExclude)

    me.lowerProperty = (name) ->
      if arguments.length is 0 then return _lowerProperty
      else
        _lowerProperty = name
        return me

    me.upperProperty = (name) ->
      if arguments.length is 0 then return _upperProperty
      else
        _upperProperty = name
        return me

    #--- Data Formatting -----------------------------------------------------------------------------------------------

    me.dataFormat = (format) ->
      if arguments.length is 0 then return _inputFormatString
      else
        _inputFormatString = format
        if _scaleType is 'time'
          _inputFormatFn = d3.time.format(format)
        else
          _inputFormatFn = (d) -> d
        return me

    #--- Core data transformation interface ----------------------------------------------------------------------------

    me.value = (data) ->
      if _layerProp
        if _.isArray(data) then data.map((d) -> parsedValue(d[_property][_layerProp])) else parsedValue(data[_property][_layerProp])
      else
        if _.isArray(data) then data.map((d) -> parsedValue(d[_property])) else parsedValue(data[_property])

    me.layerValue = (data, layerKey) ->
      if _layerProp
        parsedValue(data[layerKey][_layerProp])
      else
        parsedValue(data[layerKey])

    me.lowerValue = (data) ->
      if _.isArray(data) then data.map((d) -> parsedValue(d[_lowerProperty])) else parsedValue(data[_lowerProperty])

    me.upperValue = (data) ->
      if _.isArray(data) then data.map((d) -> parsedValue(d[_upperProperty])) else parsedValue(data[_upperProperty])

    me.formattedValue = (data) ->
      me.formatValue(me.value(data))

    me.formatValue = (val) ->
      if _outputFormatString and val and  (val.getUTCDate or not isNaN(val))
        _outputFormatFn(val)
      else
        val

    me.map = (data) ->
      if Array.isArray(data) then data.map((d) -> _scale(me.value(data))) else _scale(me.value(data))

    me.invert = (mappedValue) ->
      # takes a mapped value (pixel position , color value, returns the corresponding value in the input domain
      # the type of inverse is dependent on the scale type for quantitative scales.
      # Ordinal scales ...

      if _.has(me.scale(),'invert') # i.e. the d3 scale supports the inverse calculation: linear, log, pow, sqrt
        _data = me.chart().getData()

        # bisect.left never returns 0 in this specific scenario. We need to move the val by an interval to hit the middle of the range and to ensure
        # that the first element will be captured. Also ensures better visual experience with tooltips
        if me.kind() is 'rangeX' or me.kind() is 'rangeY'
          val = me.scale().invert(mappedValue)
          if me.upperProperty()
            bisect = d3.bisector(me.upperValue).left
          else
            step = me.lowerValue(_data[1]) - me.lowerValue(_data[0])
            bisect = d3.bisector((d) -> me.lowerValue(d) + step).left
        else
          range = _scale.range()
          interval = (range[1] - range[0]) / _data.length
          val = me.scale().invert(mappedValue - interval/2)
          bisect = d3.bisector(me.value).left

        idx = bisect(_data, val)
        idx = if idx < 0 then 0 else if idx >= _data.length then _data.length - 1 else idx
        return idx # the inverse value does not necessarily correspond to a value in the data

      if _.has(me.scale(),'invertExtent') # d3 supports this for quantize, quantile, threshold. returns the range that gets mapped to the value
        return me.scale().invertExtent(mappedValue) #TODO How should this be mapped correctly. Use case???

      # d3 does not support invert for ordinal scales, thus things become a bit more tricky.
      # in case we are setting the domain explicitly, we know tha the range values and the domain elements are in the same order
      # in case the domain is set 'lazy' (i.e. as values are used) we cannot map range and domain values easily. Not clear how to do this effectively

      if me.resetOnNewData()
        domain = _scale.domain()
        range = _scale.range()
        if _isVertical
          interval = range[0] - range[1]
          idx = range.length - Math.floor(mappedValue / interval) - 1
        else
          interval = range[1] - range[0]
          idx = Math.floor(mappedValue / interval)
        return idx

    me.invertOrdinal = (mappedValue) ->
      if me.isOrdinal() and me.resetOnNewData()
        idx = me.invert(mappedValue)
        return _scale.domain()[idx]


    #--- Axis Attributes and functions ---------------------------------------------------------------------------------

    me.showAxis = (trueFalse) ->
      if arguments.length is 0 then return _showAxis
      else
        _showAxis = trueFalse
        if trueFalse
          _axis = d3.svg.axis()
        else
          _axis = undefined
        return me

    me.axisOrient = (val) ->
      if arguments.length is 0 then return _axisOrient
      else
        _axisOrientOld = _axisOrient
        _axisOrient = val
        return me #to enable chaining

    me.axisOrientOld = (val) ->  #TODO This is not the best place to keep the old axis value. Only needed by container in case the axis position changes
      if arguments.length is 0 then return _axisOrientOld
      else
        _axisOrientOld = val
        return me #to enable chaining

    me.axis = () ->
      return _axis

    me.ticks = (val) ->
      if arguments.length is 0 then return _ticks
      else
        _ticks = val
        if me.axis()
          me.axis().ticks(_ticks)
        return me #to enable chaining

    me.tickFormat = (val) ->
      if arguments.length is 0 then return _tickFormat
      else
        _tickFormat = val
        if me.axis()
          me.axis().tickFormat(val)
        return me #to enable chaining

    me.tickValues = (val) ->
      if arguments.length is 0 then return _tickValues
      else
        _tickValues = val
        if me.axis()
          me.axis().tickValues(val)
        return me

    me.showLabel = (val) ->
      if arguments.length is 0 then return _showLabel
      else
        _showLabel = val
        return me #to enable chaining

    me.axisLabel = (text) ->
      if arguments.length is 0
        return if _axisLabel then _axisLabel else me.property()
      else
        _axisLabel = text
        return me

    me.rotateTickLabels = (nbr) ->
      if arguments.length is 0 then return _rotateTickLabels
      else
        _rotateTickLabels = nbr
        return me

    me.format = (val) ->
      if arguments.length is 0 then return _outputFormatString
      else
        if val.length > 0
          _outputFormatString = val
        else
          _outputFormatString = if me.scaleType() is 'time' then formatDefaults.date else formatDefaults.number
        _outputFormatFn = if me.scaleType() is 'time' then d3.time.format(_outputFormatString) else d3.format(_outputFormatString)
        return me #to enable chaining

    me.showGrid = (trueFalse) ->
      if arguments.length is 0 then return _showGrid
      else
        _showGrid = trueFalse
        return me

    #-- Register for drawing lifecycle events --------------------------------------------------------------------------

    me.register = () ->
      me.chart().lifeCycle().on "scaleDomains.#{me.id()}", (data) ->
        # set the domain if required
        if me.resetOnNewData()
          # ensure robust behavior in case of problematic definitions
          domain = me.getDomain(data)
          if _scaleType is 'linear' and _.some(domain, isNaN)
            throw "Scale #{me.kind()}, Type '#{_scaleType}': cannot compute domain for property '#{_property}' . Possible reasons: property not set, data not compatible with defined type. Domain:#{domain}"

          _scale.domain(domain)

      me.chart().lifeCycle().on "prepareData.#{me.id()}", (data) ->
        # compute the domain range calculation if required
        calcRule =  me.domainCalc()
        if me.parent().scaleProperties
          me.layerExclude(me.parent().scaleProperties())
        if calcRule and calcDomain[calcRule]
          _calculatedDomain = calcDomain[calcRule](data)

    me.update = (noAnimation) ->
      me.parent().lifeCycle().update(noAnimation)
      return me

    me.updateAttrs = () ->
      me.parent().lifeCycle().updateAttrs()

    me.drawAxis = () ->
      me.parent().lifeCycle().drawAxis()
      return me

    return me

  return scale