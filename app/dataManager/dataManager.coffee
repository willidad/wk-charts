angular.module('wk.chart').factory 'dataManagerFactory',($log) ->

  mergeSeriesKeys = (aOld,aNew, moveItemsMove) ->
    iOld = 0
    iNew = 0
    lOldMax = aOld.length - 1
    lNewMax = aNew.length - 1
    lMax = Math.max(lOldMax, lNewMax)
    result = []

    iPred = 0

    if moveItemsMove
      while iOld <= lOldMax and iNew <= lNewMax
        if (idx = aNew.indexOf(aOld[iOld])) >= 0 # old is also in new (start at iNew since items before have ben considered already
          result.push({iOld: iOld, iNew: idx,key: aOld[iOld]});
          iPred = iOld
          #console.log('same', aOld[iOld]);
          iOld++
        else
          # old is not in new, i.e. deleted
          # aOld[iOld is deleted
          result.push({deleted: true, iOld: iOld, key: aOld[iOld], atBorder: iNew is 0, lowBorder: iNew is 0})
          # console.log('deleted', aOld[iOld]);
          iOld++
        if aOld.indexOf(aNew[iNew]) < 0 # new is not in old
          # aNew[iNew] is added
          result.push({added: true, iPred: iPred, predKey: aOld[iPred], iNew: Math.min(iNew,lNewMax), key: aNew[iNew], atBorder:iOld is 0, lowBorder:iOld is 0})
          # console.log('added', aNew[iNew]);
          iNew++
        else
          iNew++ # this item exists in aOld, it will be handled with the old-side tests. Just skip it

      while iOld <= lOldMax
        if (idx = aNew.indexOf(aOld[iOld])) >= 0 # old is also in new (start at iNew since items before have ben considered already
          result.push({iOld: iOld, iNew: idx,key: aOld[iOld]});
          iPred = iOld
          #console.log('same', aOld[iOld]);
          iOld++
        else
          # old is not in new, i.e. deleted
          # aOld[iOld is deleted
          result.push({deleted: true, iOld: iOld, key: aOld[iOld], atBorder: true, highBorder: true})
          # console.log('deleted', aOld[iOld]);
          iOld++

      while iNew <= lNewMax
        if aOld.indexOf(aNew[iNew]) < 0 # new is not in old
          # aNew[iNew] is added
          result.push({added: true, iPred: iPred, predKey: aOld[iPred], iNew: Math.min(iNew,lNewMax), key: aNew[iNew], atBorder:true, highBorder:true})
          # console.log('added', aNew[iNew]);
          iNew++
        else
          iNew++ # this item exists in aOld, it will be handled with the old-side tests. Just skip it

    else
      while iOld <= lOldMax and iNew <= lNewMax
        if aOld[iOld] is aNew[iNew] # old is also in new
          result.push({iOld: iOld, iNew: Math.min(iNew,lNewMax),key: aOld[iOld]});
          iPred = iOld
          #console.log('same', aOld[iOld]);
          iOld++;
          iNew++;
        else if aOld.indexOf(aNew[iNew], iOld) >= 0
          # test if the non matching new is in old behind the current old. If yes, all old items until the match are deleted, if no, the non-match is added
          # aOld[iOld is deleted
          result.push({deleted: true, iOld: iOld, key: aOld[iOld], atBorder: iNew is 0, lowBorder: iNew is 0})
          # console.log('deleted', aOld[iOld]);
          iOld++
        else
          # aNew[iNew] is added
          result.push({added: true, iPred: iPred, predKey: aOld[iPred], iNew: Math.min(iNew,lNewMax), key: aNew[iNew], atBorder:iOld is 0, lowBorder:iOld is 0})
          # console.log('added', aNew[iNew]);
          iNew++

      while iOld <= lOldMax
        # if there is more old items, mark them as deleted
        result.push({deleted: true, iOld: iOld, key: aOld[iOld], atBorder:true, highBorder: true});
        # console.log('deleted', aOld[iOld]);
        iOld++;

      while iNew <= lNewMax
        # if there is more new items, mark them as added
        result.push({added: true, iPred: iPred, predKey: aOld[iPred], iNew: Math.min(iNew,lNewMax), key: aNew[iNew], atBorder:true, highBorder: true });
        # console.log('added', aNew[iNew]);
        iNew++;

    # set the deleteSuccessor by traversing form the end

    i = result.length - 1
    atBorder = true
    iSucc = aNew.length - 1
    while i >= 0
      cur = result[i]
      if cur.deleted
        cur.iSucc = iSucc
        cur.succKey = aNew[iSucc]
      else
        iSucc = cur.iNew
        atBorder = false
      i--

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
    _isRangeScale = false

    me = {}

    me.data = (data, moveItemsMove) ->
      _dataOld = _dataNew
      _keyOld = _keyNew
      _layerKeysOld = _layerKeysNew
      _layerKeysNew  = _valueScale.layerKeys(data)
      _dataNew = _.cloneDeep(data)
      _keyNew = _keyScale.value(data)
      if _keyScale.scaleType() is 'time'  # convert to number to ensure date equality works correctly
        _keyNew = _keyNew.map((d) -> +d)
      _mergedKeys = mergeSeriesKeys(_keyOld, _keyNew, moveItemsMove)
      _mergedLayerKeys = mergeSeriesKeys(_layerKeysOld, _layerKeysNew)
      return me

    me.isInitial = () ->
      return _dataOld.length is 0

    getMergedStart = () =>
      ret = []
      lastKey = _keyOld[0]
      atBorder = true
      lastOld = undefined
      cur = undefined
      i = 0

      borderKey = (cur) ->
          if _isOrdinal then lastKey else cur.key

      while i < _mergedKeys.length
        cur = _mergedKeys[i]
        if cur.iOld isnt undefined
          ret.push({
            added:false,
            key:cur.key,
            targetKey: cur.key,
            data:_dataOld[cur.iOld]
            targetData :_dataOld[cur.iOld]
            newData:_dataNew[cur.iNew]
          })
          lastKey = cur.key
          lastOld = cur.iOld
          atBorder = false
        else
          ret.push({
            added:true,
            atBorder: cur.atBorder,
            lowBorder: cur.lowBorder,
            highBorder: cur.highBorder
            targetKey: (if cur.atBorder and not _isOrdinal then cur.key else lastKey),
            key:cur.key,
            data: if cur.atBorder then _dataNew[cur.iNew] else _dataOld[lastOld],
            targetData: _dataNew[cur.iNew]
          })
        i++
      return ret

    me.animationStartLayers = () ->
      series =getMergedStart()
      return _mergedLayerKeys.map((layer) -> {
        layerKey: if layer.iOld is undefined then _layerKeysNew[layer.iNew] else layer.key,
        added: layer.added,
        values: series.map((d) -> {
          key: d.key,
          targetKey: d.targetKey,
          layerKey: layer.key,
          layerAdded: layer.added,
          added: d.added,
          atBorder: d.atBorder,
          lowBorder: d.lowBorder,
          highBorder: d.highBorder
          value: _valueScale.layerValue(d.data, layer.key)
          targetValue: if layer.added then _valueScale.layerValue(d.newData, layer.key) else _valueScale.layerValue(d.targetData, layer.key)
          data:d.data
      })})

    getMergedEnd = () =>
      ret = []
      lastKey = _keyNew[_keyNew.length - 1]
      lastNew = undefined
      atBorder = true
      i = _mergedKeys.length - 1

      borderKey = (cur) ->
        if _isOrdinal then lastKey else cur.key

      while i >= 0
        cur = _mergedKeys[i]
        if cur.iNew isnt undefined
          ret.unshift({
            deleted:false,
            key: cur.key,
            targetKey: cur.key,
            data:_dataNew[cur.iNew]
            targetData: _dataNew[cur.iNew]
            oldData: _dataOld[cur.iOld]
          })
          lastKey = cur.key
          lastNew = cur.iNew
          atBorder = false
        else
          ret.unshift({
            deleted:true,
            atBorder: atBorder,
            lowBorder: cur.lowBorder,
            highBorder: cur.highBorder
            targetKey: (if cur.atBorder and not _isOrdinal then cur.key else lastKey),
            key:cur.key,
            data: if cur.deleted then _dataOld[cur.iOld] else _dataNew[lastNew],
            targetData: _dataOld[cur.iOld]
          })
        i--
      return ret


    me.animationEndLayers = () ->
      series = getMergedEnd()
      return _mergedLayerKeys.map((layer) ->
        return {
          layerKey: layer.key,
          deleted:layer.iNew is undefined,
          values: series.map((d) ->
            return {
              key: d.key,
              targetKey: d.targetKey,
              layerKey: layer.key,
              layerDeleted: layer.deleted,
              deleted:d.deleted,
              atBorder: d.atBorder,
              lowBorder: d.lowBorder,
              highBorder: d.highBorder
              value: if d.deleted then _valueScale.layerValue(d.targetData, layer.key) else _valueScale.layerValue(d.data, layer.key)
              targetValue: if layer.deleted then _valueScale.layerValue(d.oldData, layer.key) else _valueScale.layerValue(d.targetData, layer.key)
              data:d.data
        })})

    me.keyScale = (scale) ->
      if arguments.length is 0 then return _keyScale
      _keyScale = scale
      _isOrdinal = scale.isOrdinal()
      return me

    me.valueScale = (scale) ->
      if arguments.length is 0 then return _valueScale
      _valueScale = scale
      _isRangeScale = scale.kind() is 'rangeX' or scale.kind() is 'rangeY'

      return me

    return me

  return merge

  #---------------------------------------------------------------------------------------------------------------------


