angular.module('wk.chart').factory 'dataManagerFactory',($log) ->

  mergeSeriesKeys = (aOld,aNew) ->
    iOld = 0
    iNew = 0
    lOldMax = aOld.length - 1
    lNewMax = aNew.length - 1
    lMax = Math.max(lOldMax, lNewMax)
    result = []

    while iOld <= lOldMax and iNew <= lNewMax
      if aOld[iOld] is aNew[iNew] # old is also in new
        result.push({iOld: iOld, iNew: Math.min(iNew,lNewMax),key: aOld[iOld]});
        #console.log('same', aOld[iOld]);
        iOld++;
        iNew++;
      else if aOld.indexOf(aNew[iNew], iOld) >= 0
        # test if the non matching new is in old behind the current old. If yes, all olds until the match are deleted, if no, the non-match is added
        # aOld[iOld is deleted
        result.push({iOld: iOld, iNew: undefined, key: aOld[iOld], atBorder: iNew is 0})
        # console.log('deleted', aOld[iOld]);
        iOld++
      else
        # aNew[iNew] is added
        result.push({iOld: undefined, iNew: Math.min(iNew,lNewMax), key: aNew[iNew], atBorder:iOld is 0})
        # console.log('added', aNew[iNew]);
        iNew++

    while iOld <= lOldMax
      # if there is more old items, mark them as deleted
      result.push({iOld: iOld, iNew: undefined, key: aOld[iOld], atBorder:true});
      # console.log('deleted', aOld[iOld]);
      iOld++;

    while iNew <= lNewMax
      # if there is more new items, mark them as added
      result.push({iOld: undefined, iNew: Math.min(iNew,lNewMax), key: aNew[iNew], atBorder:true});
      # console.log('added', aNew[iNew]);
      iNew++;

    return result

  merge = () ->
    _dataOld = []
    _dataNew = []
    _keyOld = []
    _keyNew = []
    _keyFn = undefined;
    _valueFn = undefined
    _mapFn = undefined
    _keyScale = undefined
    _valueScale = undefined
    _mergedKeys = []
    _layerKeysNew = []
    _layerKeysOld = []
    _mergedLayerKeys = undefined
    _isOrdinal = true

    me = {}

    me.convertToLayers = (key) ->
      if key and key.length > 0
        data = this
        return key.map((k) -> {layerKey:k, values: data.map((d) -> {key:d.key, value:_valueFn(d.data,k), data:d})})
      else
        return this

    me.data = (data) ->
      _dataOld = _dataNew
      _keyOld = _keyNew
      _dataNew = _.cloneDeep(data)
      _keyNew = _.pluck(_dataNew, _keyFn)
      _mergedKeys = mergeSeriesKeys(_keyOld, _keyNew)
      return me

    me.isInitial = () ->
      return _dataOld.length is 0

    me.getMergedOld = () =>
      ret = []
      borderKeyLeft = _keyFn(_dataOld[0])
      lastKey = undefined
      lastOld = undefined
      cur = undefined
      i = 0

      borderKey = () ->
        if _isOrdinal
          if not lastKey
             return borderKeyLeft
          else
          return lastKey
        else
          return cur.key

      while i < _mergedKeys.length
        cur = _mergedKeys[i]
        if cur.iOld isnt undefined
          ret.push({added:false, key:cur.key, data:_dataOld[cur.iOld]})
          lastKey = cur.key
          lastOld = cur.iOld
        else
          ret.push({added:true, key:(if cur.atBorder then borderKey() else lastKey), data: if cur.atBorder then _dataNew[cur.iNew] else _dataOld[lastOld]})
        i++
      return ret

    me.getAnimationStartLayers = () ->



    me.getAnimationEndLayers = () ->


    me.getMergedNew = () =>
      ret = []
      borderKeyRight = _keyFn(_dataNew[_dataNew.length - 1])
      lastKey = undefined
      lastNew = undefined
      i = _mergedKeys.length - 1

      borderKey = () ->
        if _isOrdinal
          if not lastKey
            return borderKeyRight
          else
          return lastKey
        else
          return cur.key

      while i >= 0
        cur = _mergedKeys[i]
        if cur.iNew isnt undefined
          ret.unshift({deleted:false, key: cur.key, data:_dataNew[cur.iNew]})
          lastKey = cur.key
          lastNew = cur.iNew
        else
          ret.unshift({deleted:true, key:(if cur.atBorder then borderKey() else lastKey), data: if cur.atBorder then _dataOld[cur.iOld] else _dataNew[lastNew]})
        i--
      return ret

    me.key = (key) ->
      if arguments.length is 0 then return _keyFn
      _keyFn = key
      return me

    me.keyScale = (scale) ->
      if arguments.length is 0 then return _keyScale
      _keyScale = scale
      _isOrdinal = scale.isOrdinal()
      return me

    me.valueScale = (scale) ->
      if arguments.length is 0 then return _valueScale
      _valueScale = scale
      return me

    me.value = (value) ->
      if arguments.length is 0 then return _valueFn
      _valueFn = value
      return me

    me.map = (value) ->
      if arguments.length is 0 then return _mapFn
      _mapFn = value
      return me

    me.layerKeys = (lk) ->
      _layerKeysOld = _.clone(_layerKeysNew)
      _layerKeysNew = lk
      _mergedLayerKeys = mergeSeriesKeys(_layerKeysOld, _layerKeysNew)
      return me

    return me

  return merge

  #---------------------------------------------------------------------------------------------------------------------


