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
        # test if the non matching new is in old behind the current old. If yes, all old items until the match are deleted, if no, the non-match is added
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
    _keyScale = undefined
    _valueScale = undefined
    _mergedKeys = []
    _layerKeysNew = []
    _layerKeysOld = []
    _mergedLayerKeys = undefined
    _isOrdinal = true

    me = {}

    me.data = (data) ->
      _dataOld = _dataNew
      _keyOld = _keyNew
      _layerKeysOld = _layerKeysNew
      _layerKeysNew  = _valueScale.layerKeys(data)
      _dataNew = _.cloneDeep(data)
      _keyNew = _keyScale.value(data)
      if _keyScale.scaleType() is 'time'  # convert to number to ensure date equality works correctly
        _keyNew = _keyNew.map((d) -> +d)
      _mergedKeys = mergeSeriesKeys(_keyOld, _keyNew)
      _mergedLayerKeys = mergeSeriesKeys(_layerKeysOld, _layerKeysNew)
      _startLayerMap = {}
      _endLayerMap = {}
      return me

    me.isInitial = () ->
      return _dataOld.length is 0

    getMergedStart = () =>
      ret = []
      borderKeyLeft = _keyScale.value(_dataOld[0])
      lastKey = undefined
      lastOld = undefined
      cur = undefined
      i = 0

      borderKey = (cur) ->
          if _isOrdinal then lastKey or borderKeyLeft else cur.key

      while i < _mergedKeys.length
        cur = _mergedKeys[i]
        if cur.iOld isnt undefined
          ret.push({added:false, key:cur.key, data:_dataOld[cur.iOld]})
          lastKey = cur.key
          lastOld = cur.iOld
        else
          ret.push({added:true, key:(if cur.atBorder then borderKey(cur) else lastKey), data: if cur.atBorder then _dataNew[cur.iNew] else _dataOld[lastOld]})
        i++
      return ret

    getStartLayerKeyMap = (mergedKeys) ->
      map = {}
      first = _layerKeysOld[0]
      last = undefined
      for l in mergedKeys
        if l.iOld isnt undefined
          map[l.key] = l.key
          last = l.key
        map[l.key] = last or first
      $log.info 'startMap', map
      return map

    me.animationStartLayers = () ->
      layerKeys = _mergedLayerKeys.map((d) -> d.key)
      layerMap = getStartLayerKeyMap(_mergedLayerKeys)
      series =getMergedStart()
      return _mergedLayerKeys.map((layerKey) -> {layerKey:layerKey.key, added: layerKey.iOld is undefined, values: series.map((d) -> {key: d.key, layerKey: layerKey.key, added: layerKey.iOld is undefined, value: _valueScale.layerValue(d.data, layerKey.key), data:d})})

    getMergedEnd = () =>
      ret = []
      borderKeyRight = _keyScale.value(_dataNew[_dataNew.length - 1])
      lastKey = undefined
      lastNew = undefined
      i = _mergedKeys.length - 1

      borderKey = (cur) ->
        if _isOrdinal then lastKey or borderKeyRight else cur.key

      while i >= 0
        cur = _mergedKeys[i]
        if cur.iNew isnt undefined
          ret.unshift({deleted:false, key: cur.key, data:_dataNew[cur.iNew]})
          lastKey = cur.key
          lastNew = cur.iNew
        else
          ret.unshift({deleted:true, key:(if cur.atBorder then borderKey(cur) else lastKey), data: if cur.atBorder then _dataOld[cur.iOld] else _dataNew[lastNew]})
        i--
      return ret

    getEndLayerKeyMap = (mergedKeys) ->
      map = {}
      last = _layerKeysNew[_layerKeysNew.length - 1]
      lastSeen = undefined
      i = mergedKeys.length - 1
      while i >= 0
        l = mergedKeys[i]
        if l.iNew isnt undefined
          map[l.key] = l.key
          lastSeen = l.key
        else
          map[l.key] = lastSeen or last
        i--
      $log.info 'endMap', map
      return map

    me.animationEndLayers = () ->
      layerKeys = _mergedLayerKeys.map((d) -> d.key)
      layerMap = getEndLayerKeyMap(_mergedLayerKeys)
      series = getMergedEnd()
      return _mergedLayerKeys.map((layerKey) -> {layerKey:layerKey.key, deleted:layerKey.iNew is undefined, values: series.map((d) -> {key: d.key, layerKey: layerKey.key, deleted:layerKey.iNew is undefined, value: _valueScale.layerValue(d.data, layerKey.key), data:d})})

    me.keyScale = (scale) ->
      if arguments.length is 0 then return _keyScale
      _keyScale = scale
      _isOrdinal = scale.isOrdinal()
      return me

    me.valueScale = (scale) ->
      if arguments.length is 0 then return _valueScale
      _valueScale = scale
      return me

    return me

  return merge

  #---------------------------------------------------------------------------------------------------------------------


