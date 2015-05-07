angular.module('wk.chart').service 'chartFactory', ($log, modelTypes, dimensionFactory, layoutFactory, modelUtils) ->

  CreateObj = (model) ->
    ((model) ->
      _data = {}
      _data.dimensions = {}
      _data.layouts = {}
      _data.properties = []
      me = {}

      modelUtils.addProperties(model.properties, _data, me)

      modelUtils.addDecorators(model.decorators, _data, me)

      modelUtils.addGetter(me, _data, 'dimensions')
      modelUtils.addGetter(me, _data, 'layouts')
      modelUtils.addGetter(me, _data, 'properties')

      me.availableDimensions = () ->
        return _.keys(modelTypes.dimension)
      me.addDimension = (name) ->
        _data.dimensions[name] = dimensionFactory.create(name)
        return _data.dimensions[name]
      me.removeDimension = (name) ->
        delete _data.dimensions[name]
        return undefined
      me.availableLayouts = () ->
        return _.keys(modelTypes.layouts)
      me.addLayout = (name, layout) ->
        l = layoutFactory.create(layout)
        _data.layouts[name]  = l
        _data.layouts[name].layoutName = name
        return l
      me.removeLayout = (name) ->
        delete _data.layouts[name]
        return undefined

      me.addProperty = (property, dimName, layout) ->
        layoutName = if _data.dimensions[dimName] then layout + '.' + dimName else layout
        l = _data.layouts[layoutName]
        if not l
          l = me.addLayout(layoutName, layout)
        layoutDim = l.dimensions[dimName]
        if not layoutDim
          layoutDim = l.addDimension(dimName)
        prop = layoutDim.property
        if prop
          props = prop.split(',')
          if props.indexOf(property.trim()) < 0
            props.push(property.trim())
            layoutDim.property = props.join(',')
            _data.properties.push({property:property, dimName: dimName, dimension:layoutDim, layoutName:layout, layout:l})
        else
          layoutDim.property = property.trim()
          _data.properties.push({property:property, dimName: dimName, dimension:layoutDim, layoutName:layout, layout:l})

      me.removeProperty = (property, dimName, layoutName) ->
        l = _data.layouts[layoutName]
        layoutDim = l.dimensions[dimName]
        prop = layoutDim.property
        props = prop.split(',')
        props.splice(props.indexOf(property), 1)
        if props.length > 0
          layoutDim.property = props.join(',')
        else
          layoutDim.property = ''
          l.removeDimension(dimName)
          if _.keys(l.dimensions).length is 0
            me.removeLayout(layoutName)

        toDelete = _data.properties.filter((p) -> p.property is property and p.dimName is dimName and p.layoutName = layoutName )
        for del in toDelete
          _data.properties.splice(_data.properties.indexOf(del),1)

        return

      me.getDescriptor = () -> return model
      return me
    )(model)

  this.create = () ->
    return CreateObj(modelTypes.chart)

  this.verify = () ->
    return true

  this.generateMarkup = (iModel) ->
    dModel = iModel.getDescriptor()
    markup = "<#{dModel.name}"
    markup += modelUtils.generateProperties(dModel.properties, iModel)
    markup += modelUtils.generateDecorators(dModel.decorators, iModel)
    markup += '>'

    markup += dimensionFactory.generateMarkup(iModel.dimensions)
    markup += layoutFactory.generateMarkup(iModel.layouts)

    markup += "\n</#{dModel.name}>"
    return markup

  this.hasErrors = false
  this.errors = []

  this.hasWarnings = false
  this.warnings = []

  return this




