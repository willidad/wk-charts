angular.module('wk.chart').service 'utils', ($log) ->

  #---------------------------------------------------------------------------------------------------------------------

  @diff = (a,b,direction) ->
    notInB = (v) ->
      b.indexOf(v) < 0

    res = {}
    i = 0
    while i < a.length
      if notInB(a[i])
        res[a[i]] = undefined
        j = i + direction
        while 0 <= j < a.length
          if notInB(a[j])
            j += direction
          else
            res[a[i]] =  a[j]
            break
      i++
    return res

  #---------------------------------------------------------------------------------------------------------------------

  id = 0
  @getId = () ->
    return 'Chart' + id++

  #---------------------------------------------------------------------------------------------------------------------

  @parseList = (val) ->
    if val
      l = val.trim().replace(/^\[|\]$/g, '').split(',').map((d) -> d.replace(/^[\"|']|[\"|']$/g, ''))
      return if l.length is 1 then return l[0] else l
    return undefined

  @parseTrueFalse = (val) ->
    if val is '' or val is 'true' then true else (if val is 'false' then false else undefined)

  #---------------------------------------------------------------------------------------------------------------------

  @mergeData = () ->

    _prevData = []
    _data = []
    _prevHash = {}
    _hash = {}
    _prevCommon = []
    _common = []
    _first = undefined
    _last = undefined

    _key = (d) -> d # identity
    _layerKey = (d) -> d


    me = (data) ->
      # save _data to _previousData and update _previousHash;
      _prevData = []
      _prevHash = {}
      for d,i  in _data
        _prevData[i] = d;
        _prevHash[_key(d)] = i

      #iterate over data and determine the common elements
      _prevCommon = [];
      _common = [];
      _hash = {};
      _data = data;

      for d,j in _data
        key = _key(d)
        _hash[key] = j
        if _prevHash.hasOwnProperty(key)
          #element is in both arrays
          _prevCommon[_prevHash[key]] = true
          _common[j] = true
      return me;

    me.key = (fn) ->
      if not arguments then return _key
      _key = fn;
      return me;

    me.first = (first) ->
      if not arguments then return _first
      _first = first
      return me

    me.last = (last) ->
      if not arguments then return _last
      _last = last
      return me

    me.added = () ->
      ret = [];
      for d, i in _data
        if !_common[i] then ret.push(_d)
      return ret

    me.deleted = () ->
      ret = [];
      for p, i in _prevData
        if !_prevCommon[i] then ret.push(_prevData[i])
      return ret

    me.current = (key) ->
      return _data[_hash[key]]

    me.prev = (key) ->
      return _prevData[_prevHash[key]]

    me.addedPred = (added) ->
      predIdx = _hash[_key(added)]
      while !_common[predIdx]
        if predIdx-- < 0 then return _first
      return _prevData[_prevHash[_key(_data[predIdx])]]

    me.addedPred.left = (added) ->
      me.addedPred(added).x

    me.addedPred.right = (added) ->
      obj = me.addedPred(added)
      if _.has(obj, 'width') then obj.x + obj.width else obj.x

    me.deletedSucc = (deleted) ->
      succIdx = _prevHash[_key(deleted)]
      while !_prevCommon[succIdx]
        if succIdx++ >= _prevData.length then return _last
      return _data[_hash[_key(_prevData[succIdx])]]

    return me;

  @mergeSeriesSorted =  (aOld, aNew)  ->  #TODO current version does not handle ordinal scales correctly. Assumes keys are sorted and can be to numeric
    iOld = 0
    iNew = 0
    lOldMax = aOld.length - 1
    lNewMax = aNew.length - 1
    lMax = Math.max(lOldMax, lNewMax)
    result = []

    while iOld <= lOldMax and iNew <= lNewMax
      if +aOld[iOld] is +aNew[iNew]
        result.push([iOld, Math.min(iNew,lNewMax),aOld[iOld]]);
        #console.log('same', aOld[iOld]);
        iOld++;
        iNew++;
      else if +aOld[iOld] < +aNew[iNew]
        # aOld[iOld is deleted
        result.push([iOld,undefined, aOld[iOld]])
        # console.log('deleted', aOld[iOld]);
        iOld++
      else
        # aNew[iNew] is added
        result.push([undefined, Math.min(iNew,lNewMax),aNew[iNew]])
        # console.log('added', aNew[iNew]);
        iNew++

    while iOld <= lOldMax
      # if there is more old items, mark them as deleted
      result.push([iOld,undefined, aOld[iOld]]);
      # console.log('deleted', aOld[iOld]);
      iOld++;

    while iNew <= lNewMax
      # if there is more new items, mark them as added
      result.push([undefined, Math.min(iNew,lNewMax),aNew[iNew]]);
      # console.log('added', aNew[iNew]);
      iNew++;

    return result

  @mergeSeriesUnsorted = (aOld,aNew) ->
    iOld = 0
    iNew = 0
    lOldMax = aOld.length - 1
    lNewMax = aNew.length - 1
    lMax = Math.max(lOldMax, lNewMax)
    result = []

    while iOld <= lOldMax and iNew <= lNewMax
      if aOld[iOld] is aNew[iNew]
        result.push([iOld, Math.min(iNew,lNewMax),aOld[iOld]]);
        #console.log('same', aOld[iOld]);
        iOld++;
        iNew++;
      else if aNew.indexOf(aOld[iOld]) < 0
        # aOld[iOld is deleted
        result.push([iOld,undefined, aOld[iOld]])
        # console.log('deleted', aOld[iOld]);
        iOld++
      else
        # aNew[iNew] is added
        result.push([undefined, Math.min(iNew,lNewMax),aNew[iNew]])
        # console.log('added', aNew[iNew]);
        iNew++

    while iOld <= lOldMax
      # if there is more old items, mark them as deleted
      result.push([iOld,undefined, aOld[iOld]]);
      # console.log('deleted', aOld[iOld]);
      iOld++;

    while iNew <= lNewMax
      # if there is more new items, mark them as added
      result.push([undefined, Math.min(iNew,lNewMax),aNew[iNew]]);
      # console.log('added', aNew[iNew]);
      iNew++;

    return result

  return @
