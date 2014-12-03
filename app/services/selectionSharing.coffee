angular.module('wk.chart').service 'selectionSharing', ($log) ->
  _selection = {}
  _selectionIdxRange = {}
  callbacks = {}

  this.createGroup = (group) ->


  this.setSelection = (selection, selectionIdxRange, group) ->
    if group
      _selection[group] = selection
      _selectionIdxRange[group] = selectionIdxRange
      if callbacks[group]
        for cb in callbacks[group]
          cb(selection, selectionIdxRange)

  this.getSelection = (group) ->
    grp = group or 'default'
    return selection[grp]

  this.register = (group, callback) ->
    if group
      if not callbacks[group]
        callbacks[group] = []
      #ensure that callbacks are not registered more than once
      if not _.contains(callbacks[group], callback)
        callbacks[group].push(callback)

  this.unregister = (group, callback) ->
    if callbacks[group]
      idx = callbacks[group].indexOf callback
      if idx >= 0
        callbacks[group].splice(idx, 1)

  return this

