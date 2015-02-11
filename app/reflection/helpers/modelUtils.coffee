angular.module('wk.chart').service 'modelUtils', ($log, $templateCache, modelTypes) ->

  this.camelToDash = camelToDash = (str) ->
    return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();


  this.dashToCamel = (str) ->
    return str.replace(/\W+(.)/g, (x, chr) -> return chr.toUpperCase())


  this.addProperty = (obj, store, name) ->
    return Object.defineProperty(obj, name, {
      get: () -> store[name].value
      set: (val) -> store[name].value = val
      enumerable:true
    })

  this.addGetter = (obj, store, name) ->
    return Object.defineProperty(obj, name, {
      get: () -> store[name]
      enumerable:true
    })


  this.addProperties = (props, _data, me) ->
    for name, dataType of props
      if not _.has(me, name)
        _data[name] = {}
        this.addProperty(me, _data, name)
        if _.isString(dataType)
          _data[name].validator = modelTypes.getValidator(dataType)
        else
          if dataType.type is 'enum'
            _data[name].enum = dataType.values
            _data[name].validator = modelTypes.getValidator(dataType)

    me.validate = (name, value) -> return _data[name].validator.apply(_data[name], [value])
    me.acceptedValues = (name) -> return _data[name].enum

  this.addDecorator = (deco, _data, me) ->
    _data[deco.name] = {}
    _data[deco.name + '$set'] = {}
    this.addProperty(me, _data, deco.name + '$set')
    if _.has(deco, 'value')
      this.addProperty(me, _data, deco.name)
      if _.isString(deco.value)
        _data[deco.name].validator = modelTypes.getValidator(deco.value)
      else
      if deco.value.type is 'enum'
        _data[deco.name].enum = deco.value.values
        _data[deco.name].validator = modelTypes.getValidator(deco.value)

    this.addProperties(deco.properties, _data, me)

  this.addDecorators = (decorators, _data, me) ->
    if decorators
      for deco in decorators
        this.addDecorator(deco, _data, me)

  this.generateProperties = (dProperties, iModel) ->
    markup = ''
    for name, type of dProperties
      if iModel[name] isnt undefined and iModel[name] isnt null and iModel[name] isnt ''
        if _.has(dProperties[name], 'generator')
          markup += dProperties[name].generator(iModel[name])
        else
          markup += " #{camelToDash(name)}=\"#{iModel[name]}\""
    return markup

  this.generateDecorators = (dDecorators, iModel) ->
    markup = ''
    if dDecorators
      for deco in dDecorators
        if iModel[deco.name + '$set']
          if _.has(deco, 'generator')
            markup += deco.generator(iModel[deco.name])
          else
            if iModel[deco.name]
              markup += " #{camelToDash(deco.name)}=\"#{iModel[deco.name]}\""
            else
              markup += ' ' + camelToDash(deco.name)
          markup += this.generateProperties(deco.properties, iModel)
      return markup
    return ''

  return this
