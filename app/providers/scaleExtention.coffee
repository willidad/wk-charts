angular.module('wk.chart').provider 'wkChartScales', () ->

  _customColors = ['red', 'orange', 'yellow', 'green', 'blue']
  _customMapFn = undefined

  ordinalIdentity = () ->
    d3Scale = d3.scale.ordinal()

    me = (value) ->
      if arguments.length is 0 then return me
      return value

    me.invert = (val) ->
      return val

    me.domain = d3.scale.domain
    me.range = d3.scale.domain

    return me

  hashed = () ->
    d3Scale = d3.scale.ordinal()

    _hashFn = (value) ->
      hash = 0;
      m = d3Scale.range().length - 1
      for i in [0 .. value.length]
        hash = (31 * hash + value.charAt(i)) % m;

    me = (value) ->
      if not arguments then return me
      d3Scale(_hashFn(value))

    me.range = (range) ->
      if not arguments then return d3Scale.range()
      d3Scale.domain(d3.range(range.length))
      d3Scale.range(range)

    me.domain = d3Scale.domain
    me.rangePoint = d3Scale.rangePoints
    me.rangeBands = d3Scale.rangeBands
    me.rangeRoundBands = d3Scale.rangeRoundBands
    me.rangeBand = d3Scale.rangeBand
    me.rangeExtent = d3Scale.rangeExtent

    me.hash = (fn) ->
      if not arguments then return _hashFn
      _hashFn = fn
      return me

    return me

  customScale = () ->
    d3Scale = d3.scale.ordinal()
    mapFn = _customMapFn || d3Scale # use the d3 function unless a mapFn is configured

    me = (value) ->
      if not arguments then return me
      # use the mapFn to compute the return value
      return mapFn.apply(me, [value])

    me.mapFn = (fn) ->
      if not arguments then return mapFn
      if _.isFunction(fn)
        mapFn = fn
      return me

    me.domain = d3Scale.domain
    me.range = d3Scale.range
    me.rangePoint = d3Scale.rangePoints
    me.rangeBands = d3Scale.rangeBands
    me.rangeRoundBands = d3Scale.rangeRoundBands
    me.rangeBand = d3Scale.rangeBand
    me.rangeExtent = d3Scale.rangeExtent

    return me


  categoryColors = () -> return d3.scale.ordinal().range(_customColors)
  category20Linear = () -> return d3.scale.ordinal().range(d3.scale.category20().range().map((c) -> "url(#lgrad-#{c.replace('#','')})"))
  category20Radial = () -> return d3.scale.ordinal().range(d3.scale.category20().range().map((c) -> "url(#rgrad-#{c.replace('#','')})"))

  categoryColorsHashed = () -> return hashed().range(_customColors)

  this.colors = (colors) ->
    _customColors = colors

  this.customMapFn = (fn) ->
    if _.isFunction(fn)
      mapFn = fn

  this.$get = ['$log',($log) ->
    return {
      hashed: hashed,
      customCategory: categoryColors,
      customCategoryHashed: categoryColorsHashed
      customScale: customScale
      category20Linear: category20Linear
      category20Radial: category20Radial
      ordinalIdentity: ordinalIdentity
    }
  ]

  return this