angular.module('wk.chart').service 'dimensionFactory', ($log, modelUtils, modelTypes) ->

  CreateObj = (model) ->
    ((model) ->
      _data = {}
      me = {}

      modelUtils.addProperties(model.properties, _data, me)

      modelUtils.addDecorators(model.decorators, _data, me)

      me.getDescriptor = () -> return model

      return me
    )(model)


  this.create = (type) ->
    if _.has(modelTypes.dimension,type)
      return CreateObj(modelTypes.dimension[type])

  this.generateMarkup = (iDimensions) ->
    markup = ''
    for name, dim of iDimensions
      dModel = dim.getDescriptor()
      markup += "\n\t\t<#{dModel.name}"
      markup += modelUtils.generateProperties(dModel.properties, dim)
      markup += modelUtils.generateDecorators(dModel.decorators, dim)
      markup += ' />'
    return markup

  return this