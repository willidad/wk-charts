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

    me.domain = d3Scale.domain
    me.range = d3Scale.domain

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
      return mapFn.apply(me, [value, me.domain()])

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
  ######################################################################################################################
  #
  #  d3 scale ordinal clone with modified handling of padding
  #
  ######################################################################################################################

  ordinalPadding = () ->
    d3Scale = d3.scale.ordinal()
    _paddingLeft = 0;
    _paddingRight = 0;
    _outerLeft = 0;
    _outerRight = 0;
    _domain = []
    _index = undefined;
    _defaultBehavior = false;
    _range = []
    _rangeBand = 0

    me = (value) ->
      if not arguments then return me
      if _defaultBehavior then return d3Scale(value)
      return _range[_index.get(value)];

    me.range = (x) ->
      if arguments.length is 0
        if _defaultBehavior then d3Scale.range() else _range
      else
        d3Scale.range(x)

    me.domain = (x) ->
      if arguments.length is 0 then return _domain;
      d3Scale.domain(x);
      _domain = [];
      _index = d3.map();
      i = -1; n = x.length; xi;
      while (++i < n)
        if !_index.has(xi = x[i])
          _index.set(xi, _domain.push(xi) - 1);

    me.rangePoint = d3Scale.rangePoints
    me.rangeBands = (x, padding, outerPadding) ->
      d3Scale.rangeBands.apply(this,arguments)
      if arguments.length = 1
        _defaultBehavior = false;
        _reverse = x[1] < x[0]
        if _reverse
          start = x[1]
          stop = x[0]
        else
          start = x[0]
          stop = x[1]
        _step = (stop - start) / (_domain.length + _outerLeft + _outerRight);
        _rangeBand = _step * (1 - _paddingLeft - _paddingRight)
        # setup range
        offs = if _reverse then _paddingRight + _outerRight else _paddingLeft + _outerLeft
        r0 = start + _step *  offs
        _range = []
        for i in [0 .. _domain.length - 1]
          _range[i] = r0 + i * _step
        if _reverse then _range.reverse()
        return me

    me.rangeRoundBands = d3Scale.rangeRoundBands

    me.rangeBand = () ->
      if _defaultBehavior then d3Scale.rangeBand() else _rangeBand

    me.rangeExtent = d3Scale.rangeExtent
    me.copy = d3Scale.copy
    me.padding = (left, right) ->
      _paddingLeft = left;
      if (arguments.length is 2)
        _paddingRight = right
      else
        _paddingRight = _paddingLeft
    me.outerPadding = (left, right) ->
      _outerLeft = left
      if (arguments.length is 2)
        _outerRight = right
      else
        _outerRight = _outerLeft

    return me

  #---------------------------------------------------------------------------------------------------------------------

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
      ordinalPadding: ordinalPadding
    }
  ]

  return this