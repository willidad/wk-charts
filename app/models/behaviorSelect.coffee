angular.module('wk.chart').factory 'behaviorSelect', ($log) ->
  selectId = 0

  select = () ->

    _id = "select#{selectId++}"
    _container = undefined
    _layout = undefined
    _active = false
    _selectionEvents = d3.dispatch('selected')

    clicked = () ->
      if not _active then return
      obj = d3.select(this)
      if not _active then return
      if obj.classed('wk-chart-selectable')
        isSelected = obj.classed('wk-chart-selected')
        obj.classed('wk-chart-selected', not isSelected)
        selectedObjects = _container.selectAll('.wk-chart-selected')
        selectedObjectsData = selectedObjects.data().map((d) -> if d.data then d.data else d)
        _container.classed('wk-chart-has-selected-items', selectedObjectsData.length > 0)
        # ensure that only the original values are reported back

        _layout.lifeCycle().objectsSelected(selectedObjects)
        _selectionEvents.selected(selectedObjectsData)

    me = (sel) ->
      if arguments.length is 0 then return me
      else
        sel
          # register selection events
          .on 'click', clicked
        return me

    me.id = () ->
      return _id

    me.active = (val) ->
      if arguments.length is 0 then return _active
      else
        _active = val
        return me #to enable chaining

    me.clearSelection = () ->
      $log.log 'selection Cleared'
      _container.selectAll('.wk-chart-selected').classed('wk-chart-selected', false)
      _container.classed('wk-chart-has-selected-items', false)
      _.delay(
        () ->
          _selectionEvents.selected([])
      ,
        20
      )

    me.container = (val) ->
      if arguments.length is 0 then return _container
      else
        _container = val
        return me #to enable chaining

    me.layout = (val) ->
      if arguments.length is 0 then return _layout
      else
        _layout = val
        return me

    me.events = () ->
      return _selectionEvents

    me.on = (name, callback) ->
      _selectionEvents.on name, callback
      return me

    return me

  return select