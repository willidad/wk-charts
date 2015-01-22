angular.module('wk.chart').service 'chartFactory', ($log, modelTypes, dimensionFactory, layoutFactory, modelUtils) ->

  CreateObj = (model) ->
    ((model) ->
      _data = {}
      _data.dimensions = {}
      _data.layouts = []
      me = {}

      modelUtils.addProperties(model.properties, _data, me)

      modelUtils.addDecorators(model.decorators, _data, me)

      modelUtils.addGetter(me, _data, 'dimensions')
      modelUtils.addGetter(me, _data, 'layouts')

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
      me.addLayout = (type) ->
        l = layoutFactory.create(type)
        _data.layouts.push(l)
        return l
      me.removeLayout = (layout) ->
        idx = _data.layouts.indexOf(layout)
        if idx >= 0
          _data.layouts.splice(idx,1)
        return undefined

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




