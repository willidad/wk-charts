angular.module('wk.chart').factory 'chart', ($log, scaleList, container, behavior, d3Animation) ->

  chartCntr = 0

  chart = () ->

    _id = "chart#{chartCntr++}"

    me = () ->

    #--- Variable declarations and defaults ----------------------------------------------------------------------------

    _layouts = []               # List of layouts for the chart
    _container = undefined    # the charts drawing container object
    _allScales = undefined    # Holds all scales of the chart, regardless of scale owner
    _ownedScales = undefined  # holds the scles owned by chart, i.e. share scales
    _data = undefined           # pointer to the last data set bound to chart
    _showTooltip = false        # tooltip property
    _scope = undefined          # holds a reference to the chart isolated scope
    _toolTipTemplate = ''
    _title = undefined
    _subTitle = undefined
    _editMode = false
    _behavior = behavior()
    _animationDuration = d3Animation.duration

    #--- LifeCycle Dispatcher ------------------------------------------------------------------------------------------

    _lifeCycle = d3.dispatch('configure', 'resize', 'prepareData', 'scaleDomains', 'rescaleDomains', 'sizeContainer', 'drawAxis', 'drawChart', 'newData', 'update', 'updateAttrs', 'scopeApply', 'destroy', 'animationStartState', 'animationEndState', 'editSelected' )
    _brush = d3.dispatch('draw', 'change')

    #--- Getter/Setter Functions ---------------------------------------------------------------------------------------

    me.id = (id) ->
      return _id

    me.scope = (scope) ->
      if arguments.length is 0 then return _scope
      else
        _scope = scope
        return me

    me.showTooltip = (trueFalse) ->
      if arguments.length is 0 then return _showTooltip
      else
        _showTooltip = trueFalse
        _behavior.tooltip.active(_showTooltip)
        return me

    me.toolTipTemplate = (path) ->
      if arguments.length is 0 then return _toolTipTemplate
      else
        _toolTipTemplate = path
        _behavior.tooltip.template(path)
        return me

    _tooltipStyle = {}
    me.tooltipStyle = (val) ->
      if arguments.length is 0 then return _tooltipStyle
      if _.isObject(val)
        _.assign(_tooltipStyle, val)
      return me

    me.title = (val) ->
      if arguments.length is 0 then return _title
      else
        _title = val
        return me

    _titleStyle = {'font-size': '1.8em'}
    me.titleStyle = (val) ->
      if arguments.length is 0 then return _titleStyle
      if _.isObject(val)
        _.assign(_titleStyle, val)
      return me

    me.subTitle = (val) ->
      if arguments.length is 0 then return _subTitle
      else
        _subTitle = val
        return me

    _subTitleStyle = {'font-size': '1.3em'}
    me.subTitleStyle = (val) ->
      if arguments.length is 0 then return _subTitleStyle
      if _.isObject(val)
        _.assign(_subTitleStyle, val)
      return me

    _backgroundStyle = {position:'relative'}
    me.backgroundStyle = (val) ->
      if arguments.length is 0 then return _backgroundStyle
      if _.isObject(val)
        _.assign(_backgroundStyle, val)
        _backgroundStyle.position = 'relative'
      return me

    me.addLayout = (layout) ->
      if arguments.length is 0 then return _layouts
      else
        _layouts.push(layout)
        return me

    me.addScale = (scale, layout) ->
      _allScales.add(scale)
      if layout
        layout.scales().add(scale)
        if _ownedScales.hasKind(scale.kind())
          scale.parentScale(_ownedScales.getKind(scale.kind()))
      else
        _ownedScales.add(scale)
      return me

    me.animationDuration = (val) ->
      if arguments.length is 0 then return _animationDuration
      else
        _animationDuration = val
        return me #to enable chaining

    #--- Edit Mode ----------------------------------------------------------------------------------------------

    me.editMode = (val) ->
      if arguments.length is 0 then return _editMode
      if val isnt _editMode
        _editMode = val
        if _editMode
          me.container().registerEditHooks()
        else
          me.container().deregisterEditHooks()
      return me

    #--- Getter Functions ----------------------------------------------------------------------------------------------

    me.lifeCycle = (val) ->
      return _lifeCycle

    me.layouts = () ->
      return _layouts

    me.scales = () ->
      return _ownedScales

    me.allScales = () ->
      return _allScales

    me.hasScale = (scale) ->
      return !!_allScales.has(scale)

    me.container = () ->
      return _container

    me.brush = () ->
      return _brush

    me.getData = () ->
      return _data

    me.behavior = () ->
      return _behavior

    #--- Chart drawing life cycle --------------------------------------------------------------------------------------

    lifecycleFull = (data,noAnimation) ->
      if data
        $log.log 'executing full life cycle'
        _data = data
        _scope.filteredData = data                    # put data on scope so tooltip and legend can access it
        _scope.scales = _allScales
        _lifeCycle.prepareData(data, noAnimation)    # calls the registered layout types
        _lifeCycle.animationStartState(data)         # call after prepareData to ensure scales are set up correctly
        _lifeCycle.scaleDomains(data, noAnimation)   # calls registered the scales
        _lifeCycle.sizeContainer(data, noAnimation)  # calls container
        _lifeCycle.drawAxis(noAnimation)             # calls container
        _lifeCycle.animationEndState(data)
        _lifeCycle.drawChart(data, noAnimation)     # calls layout
        _lifeCycle.scopeApply()                     # need a digest cycle after the debouce to ensure legend animations execute
        _container.registerEditHooks()

    debounced = _.debounce(lifecycleFull, 100)

    me.execLifeCycleFull = debounced

    me.resizeLifeCycle = (noAnimation) ->
      if _data
        $log.log 'executing resize life cycle'
        _lifeCycle.sizeContainer(_data, noAnimation)  # calls container
        _lifeCycle.drawAxis(noAnimation)              # calls container
        _lifeCycle.drawChart(_data, noAnimation)
        _lifeCycle.scopeApply()

    me.newDataLifeCycle = (data, noAnimation) ->
      if data
        $log.log 'executing new data life cycle'
        _data = data
        _scope.filteredData = data
        _lifeCycle.prepareData(data, noAnimation)    # calls the registered layout types
        _lifeCycle.scaleDomains(data, noAnimation)
        _lifeCycle.drawAxis(noAnimation)              # calls container
        _lifeCycle.drawChart(data, noAnimation)

    me.attributeChange = (noAnimation) ->
      if _data
        $log.log 'executing attribute change life cycle'
        _lifeCycle.sizeContainer(_data, noAnimation)
        _lifeCycle.drawAxis(noAnimation)              # calls container
        _lifeCycle.drawChart(_data, noAnimation)

    me.brushExtentChanged = () ->
      if _data
        _lifeCycle.drawAxis(true)              # No Animation
        _lifeCycle.drawChart(_data, true)

    me.lifeCycle().on 'newData.chart', me.execLifeCycleFull
    me.lifeCycle().on 'resize.chart', me.resizeLifeCycle
    me.lifeCycle().on 'update.chart', (noAnimation) -> me.execLifeCycleFull(_data, noAnimation)
    me.lifeCycle().on 'updateAttrs', me.attributeChange
    me.lifeCycle().on 'rescaleDomains', _lifeCycle.scaleDomains(_data, true) #no animation

    #--- Initialization ------------------------------------------------------------------------------------------------

    _behavior.chart(me)
    _container = container().chart(me)   # the charts drawing container object
    _allScales = scaleList()    # Holds all scales of the chart, regardless of scale owner
    _ownedScales = scaleList()  # holds the scales owned by chart, i.e. share scales

    return me

  return chart