angular.module('wk.chart').service 'dataManager',($log) ->

  mergeSeriesKeys = (aOld,aNew) ->
    iOld = 0
    iNew = 0
    lOldMax = aOld.length - 1
    lNewMax = aNew.length - 1
    lMax = Math.max(lOldMax, lNewMax)
    result = []

    while iOld <= lOldMax and iNew <= lNewMax
      if aOld[iOld] is aNew[iNew]
        result.push({iOld: iOld, iNew: Math.min(iNew,lNewMax),key: aOld[iOld]});
        #console.log('same', aOld[iOld]);
        iOld++;
        iNew++;
      else if aNew.indexOf(aOld[iOld]) < 0 #TODO this is the root cause for some funny animation behavior. Fix it
        # aOld[iOld is deleted
        result.push({iOld: iOld, iNew: undefined, key: aOld[iOld]})
        # console.log('deleted', aOld[iOld]);
        iOld++
      else
        # aNew[iNew] is added
        result.push({iOld: undefined, iNew: Math.min(iNew,lNewMax), key: aNew[iNew]})
        # console.log('added', aNew[iNew]);
        iNew++

    while iOld <= lOldMax
      # if there is more old items, mark them as deleted
      result.push({iOld: iOld, iNew: undefined, key: aOld[iOld]});
      # console.log('deleted', aOld[iOld]);
      iOld++;

    while iNew <= lNewMax
      # if there is more new items, mark them as added
      result.push({iOld: undefined, iNew: Math.min(iNew,lNewMax), key: aNew[iNew]});
      # console.log('added', aNew[iNew]);
      iNew++;

    return result

  merge = () ->
    _dataOld = []
    _dataNew = []

    _keyOld = []
    _keyNew = []

    _key = undefined;

    _mergedKeys = []


    me = {}

    me.data = (data) ->
      _dataOld = _dataNew
      _keyOld = _keyNew
      _dataNew = _.cloneDeep(data)
      _keyNew = _.pluck(_dataNew, _key)
      _mergedKeys = mergeSeriesKeys(_keyOld, _keyNew)

      return me

    me.isInitial = () ->
      return _dataOld.length is 0

    me.getMergedOld = () ->
      ret = []
      lastOld = undefined
      lastKey = undefined
      i = 0
      while i < _mergedKeys.length
        cur = _mergedKeys[i]
        if cur.iOld isnt undefined
          ret.push({added:false, key:cur.key, data:_dataOld[cur.iOld]})
          lastOld = i
          lastKey = cur.key
        else
          ret.push({added:true, key:lastKey, data:_dataNew[cur.iNew]})
        i++
      return ret

    me.getMergedNew = () ->
      ret = []
      lastNew = undefined
      lastKey = undefined
      i = _mergedKeys.length - 1

      while i >= 0
        cur = _mergedKeys[i]
        lastKey = cur.key
        if cur.iNew isnt undefined
          ret.unshift({deleted:false, key: lastKey, data:_dataNew[cur.iNew]})
          lastNew = i
          lastKey = cur.key
        else
          ret.unshift({deleted:true, key:lastKey, data:_dataOld[cur.iOld]})
        i--
      return ret

    me.key = (key) ->
      _key = key

    return me

  return merge()

