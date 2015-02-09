angular.module('wk.chart').factory 'scale', ($log, legend, formatDefaults, wkChartScales, wkChartLocale) ->

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
    _reverse = false
    _isHorizontal = false
    _isVertical = false
    _kind = undefined
    _parent = undefined
    _chart = undefined
    _layout = undefined
    _legend = legend()
    _outputFormatString = undefined
    _outputFormatFn = undefined

    _tickFormat = wkChartLocale.timeFormat.multi([
      [".%L", (d) ->  d.getMilliseconds()],
      [":%S", (d) ->  d.getSeconds()],
      ["%I:%M", (d) ->  d.getMinutes()],
      ["%I %p", (d) ->  d.getHours()],
      ["%a %d", (d) ->  d.getDay() and d.getDate() isnt 1],
      ["%b %d", (d) ->  d.getDate() isnt 1],
      ["%B", (d) ->  d.getMonth()],
      ["%Y", () ->  true]
    ])

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

        _isOrdinal = _.has(_scale,'rangeBand') #_scaleType in ['ordinal', 'category10', 'category20', 'category20b', 'category20c']
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

    me.scaleMapFn = (fn) ->
      if arguments.length is 0
        if _scale.mapFn
          return _scale.mapFn()
        return undefined
      else
        if _.isFunction(fn) and _scale.mapFn
          _scale.mapFn(fn)
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
        if _isOrdinal and me.kind() in ['x','y', 'rangeX', 'rangeY']
            _scale.rangeBands(range, _rangePadding, _rangeOuterPadding)  # if ordinal, set range only for horizontal and vertical dimensions
        else if not (_scaleType in ['category10', 'category20', 'category20b', 'category20c']) #ordinal scales with pre-et range
          _scale.range(range)
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
          _inputFormatFn = wkChartLocale.timeFormat(format)
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
      if _.isArray(data) then data.map((d) -> me.formatValue(me.value(d))) else me.formatValue(me.value(data))

    me.formattedLayerValue = (data, layerKey) ->
      if _.isArray(data) then data.map((d) -> me.formatValue(me.layerValue(d, layerKey))) else me.formatValue(me.layerValue(data, layerKey))


    me.formatValue = (val) ->
      if _outputFormatString and val and  (val.getUTCDate or not isNaN(val))
        _outputFormatFn(val)
      else
        val

    me.map = (data, layerKey) ->
      if layerKey
        if Array.isArray(data) then data.map((d) -> _scale(me.layerValue(data, layerKey))) else _scale(me.layerValue(data, layerKey))
      else
        if Array.isArray(data) then data.map((d) -> _scale(me.value(data))) else _scale(me.value(data))

    me.invert = (mappedValue) ->
      # Returns the value in the input domain x for the corresponding value in the output range.
      # There are four different cases how this is done:
      #  - d3 support the invert function on the scale  - will use invert then
      #  - d3 support invertRange function on the scale - will use invertRange then, however the handling of the inverted values needs to be special (in tooltips)
      #  - d3 does not support inverting on ordinal scales. In this case we are using our own invert algorithm, which makes a few assumptions:
      #     - the scale domain is explicitly set whenever the data changes. wk-charts does this for x and y dimensions automatically.
      #       For other dimensions this only happens when the reset attribute is true on the dimension. In this case invert returns the domain value tht is the closest match ti the input value
      #     - the scale domain is not explicitly set. In this case it inverts based on the domains default. The resulting values may not be meaningful. It is up to the consumer of invert to assure
      #       that the prerequisites are met and the returned values are interpreted in a meaningful fashion
      # Returns: input domain value

      if _.has(me.scale(),'invert') # i.e. the d3 scale supports the inverse calculation: linear, log, pow, sqrt
        interv = (_scale.range()[1] - _scale.range()[0]) / _chart.getData().length
        return _scale.invert(mappedValue - interv/2) # ensure the marker flips in teh middle between the data points
        # NOTE: THIS VERSION DOES NOT RETURN A INDEX INTO THE DATA ANYMORE. FINDING THE DATA REFERENCE IS LEFT TO THE CONSUMER OF THE RESULT

      if _.has(me.scale(),'invertExtent') # d3 supports this for quantize, quantile, threshold. returns the range that gets mapped to the value
        return me.scale().invertExtent(mappedValue)

      # d3 does not support invert for ordinal scales. Can only invert if domain is explicitly set whenever data changes.

      if me.isOrdinal() and me.resetOnNewData()
        domain = _scale.domain()
        range = _scale.range()
        if range[0] > range[1]
          interval = range[0] - range[1]
          idx = range.length - Math.floor(mappedValue / interval) - 1
          if idx < 0 then idx = 0
        else
          interval = range[1] - range[0]
          idx = Math.floor(mappedValue / interval)
          if idx >= range.length then idx = range.length - 1
        return domain[idx]

      # in all other cases we cannot meaningfully invert.
      return undefined

    me.findIndex = (value) -> # used to find the data object after inverting a range value
      # returns the index to data first object in the data array that holds the value in the dimension
      _data = me.chart().getData()
      if _isOrdinal
        return _.findIndex(_data,(d) -> return value is me.value(d)) # assumes the value exists in data.
      if _.isArray(value) and value.length is 2
        # we are finding the range extend bounds
        #TODO  IMPLEMENT THIS CASE
        return

      # we cannot assume that an exact match in the data. use d3.bisect to find the entry
      bisect = d3.bisector(me.value).left
      idx = bisect(_data, value)
      idx = if idx < 0 then 0 else if idx >= _data.length then _data.length - 1 else idx
      return idx # the inverse value does not necessarily correspond to a value in the data

    me.find = (value) ->
      return  me.chart().getData()[me.findIndex(value)]
    #--- Axis Attributes and functions ---------------------------------------------------------------------------------

    me.showAxis = (trueFalse) ->
      if arguments.length is 0 then return _showAxis
      else
        _showAxis = trueFalse
        if trueFalse
          _axis = d3.svg.axis()
          if me.scaleType() is 'time'
            _axis.tickFormat(_tickFormat)
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

    _axisLabelStyle = {'font-size': '1.5em'}
    me.axisLabelStyle = (val) ->
      if arguments.length is 0 then return _axisLabelStyle
      if _.isObject(val)
        _.assign(_axisLabelStyle, val)
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
        _outputFormatFn = if me.scaleType() is 'time' then wkChartLocale.timeFormat(_outputFormatString) else wkChartLocale.numberFormat(_outputFormatString)
        return me #to enable chainingF

    me.showGrid = (trueFalse) ->
      if arguments.length is 0 then return _showGrid
      else
        _showGrid = trueFalse
        return me

    me.reverse = (trueFalse) ->
      if arguments.length is 0 then return _reverse 
      else
        _reverse = trueFalse
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