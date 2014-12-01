angular.module('wk.chart').provider 'wkChartScales', () ->

  _customColors = ['red', 'green','blue','yellow','orange']

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

  categoryColors = () -> return d3.scale.ordinal().range(_customColors)

  categoryColorsHashed = () -> return hashed().range(_customColors)

  this.colors = (colors) ->
    _customColors = colors

  this.$get = ['$log',($log) ->
    return {hashed:hashed,colors:categoryColors, colorsHashed: categoryColorsHashed}
  ]

  return this