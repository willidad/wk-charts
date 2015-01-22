angular.module('wk.chart').service 'modelUtils', ($log, $templateCache, modelTypes) ->

  this.stringList = (list) ->
    return /(\[(.*)\])|(.*)/g.test(list)

  this.string  = (value) ->
    return _.isString(value)

  this.number = (value) ->
    return _.isNumber(value)

  this.trueFalse = (value) ->
    return _.isBoolean(value)

  this.templateUrl = (value) ->
    return not _.isEmpty($templateCache.get(value))

  this.listVerifier = () ->
    return (value) ->
      return value in this.values

  this.attributeGenerator = (name, value) ->
    if value
      return "#{name}=\"#{value}\""
    else
      return name

  this.attributeListGenerator = (model) ->
    val = ''
    for name, value of model
      if value.type isnt 'object'
        if _.has(value, 'generator')
          val += ' ' + value.generator(value)
        else
          if value.value
            val += ' ' + this.attributeGenerator(name, value.value)
    return val


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
          if _.has(dataType, 'validator')
            _data[name].validator = dataType.validator
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
      if _.has(deco, 'validator')
        _data[deco.name].validator = deco.value.validator
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
      if iModel[name]
        if _.has(dProperties[name], 'generator')
          markup += dProperties[name].generator(iModel[name])
        else
          markup += " #{name}=\"#{iModel[name]}\""
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
              markup += " #{deco.name}=\"#{iModel[deco.name]}\""
            else
              markup += ' ' + deco.name
          markup += this.generateProperties(deco.properties, iModel)
      return markup
    return ''

  return this
