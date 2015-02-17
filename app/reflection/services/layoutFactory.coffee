angular.module('wk.chart').service 'layoutFactory', ($log, dimensionFactory, modelTypes, modelUtils) ->

  CreateObj = (model) ->
    ((model) ->
      _data = {}
      _data.dimensions = {}
      _data.layout = model.name
      me = {}

      modelUtils.addProperties(model.properties, _data, me)

      modelUtils.addDecorators(model.decorators, _data, me)

      for name, dim of model.dimensions
        _data.dimensions[name] = dimensionFactory.create(name)

      modelUtils.addGetter(me, _data, 'dimensions')
      modelUtils.addGetter(me, _data, 'layout')
      me.addDimension = (name) ->
        _data.dimensions[name] = dimensionFactory.create(name)
        return _data.dimensions[name]
      me.removeDimension = (name) ->
        delete _data.dimensions[name]
        return undefined

      me.getDescriptor = () -> return model

      return me
    )(model)

  this.create = (type) ->
    if _.has(modelTypes.layouts, type)
      return CreateObj(modelTypes.layouts[type])

  ###
  this.getTypes = () ->
    return _.keys(layouts)

  this.verifyType = (type) ->
    return _.has(layouts, type)
  ###
  this.generateMarkup = (layoutModel) ->
    markup = ''
    for name, layout of layoutModel
      dModel = layout.getDescriptor()
      markup += "\n\t<layout"
      if not layout[modelUtils.dashToCamel(dModel.name)]
        markup += " #{modelUtils.camelToDash(dModel.name)}"

      markup += modelUtils.generateProperties(dModel.properties, layout)
      markup += modelUtils.generateDecorators(dModel.decorators, layout)
      markup += '>'

      markup += dimensionFactory.generateMarkup(layout.dimensions)
      markup += "\n\t</layout>"
    return markup





  return this