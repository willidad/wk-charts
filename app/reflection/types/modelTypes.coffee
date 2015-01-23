'use strict'

angular.module('wk.chart').service 'modelTypes', ($log, wkChartScales) ->
  
  #----Setup helpers ---------------------------------------------------------------------------------------------------

  layout = (name, dimensionList, value, layerDimension, properties, decorators) ->
    # generate the layout descriptor object

    ret =  {
      name: name
      clazz: 'layout'
      value: value
      layerDimension: layerDimension
      properties: assign(properties)
      decorators: decorators
      dimensions:{}
    }
    dims = dimensionList.trim().split(',')
    for d in dims
      ret.dimensions[d.trim()] = {}

    return ret

  dim = (name, properties, decorators) ->
    return {
    clazz:'dimension'
    name:name
    properties : assign(properties)
    decorators : decorators
    }

  getScaleTypes = () ->
    return _.keys(d3.scale).concat('time').concat(_.keys(wkChartScales))

  assign = (list) ->
    ret = {}
    return _.assign.apply(this, [].concat(list))

  propertyType = {
    string:'string'
    number:'number'
    bool:'boolean'
    list:'list'
    enum:(list) ->
      return {
        type:'enum'
        values:list
      }
    object: 'scope variable'
    event: 'scope event'
    callback: 'callback'
    objArray: 'scope variable'
  }

  this.getValidator = (type) ->
    switch type
      when propertyType.string then return _.isString
      when propertyType.number then return _.isNumber
      when propertyType.bool then return _.isBoolean
      when propertyType.list then return (val) ->
        /^\[(.*)\]$|^[^\[](?=[^\]\[]*$)/.test(val) # string surrounded w. [] or not without any []
      else
        if _.isObject(type) and type.type is 'enum'
          return (val) -> val in this.enum
        else
          return () -> true
    
  #--- property Definitions --------------------------------------------------------------------------------------------

  markers = {markers:propertyType.bool}
  labels = {labels:propertyType.bool}
  padding = {padding:propertyType.number}
  outerPadding = {outerPadding:propertyType.number}
  areaStyle = propertyType.enum(['zero', 'silhouette','expand','wiggle'])
  geojson = {geojson:propertyType.object}
  projection = {projection:propertyType.object}

  property = {
    property:propertyType.list
  }
  range = {
    lowerProperty:propertyType.string
    upperProperty:propertyType.string
  }
  base = {
    type:propertyType.enum(getScaleTypes())
    domain:propertyType.list
    reset:propertyType.bool
    range:propertyType.list
    domainRange:propertyType.enum(['min', 'max', 'extent','total'])
    label:propertyType.string
    exponent:propertyType.number
    reverse:propertyType.bool
  }
  
  #---- Decorators -----------------------------------------------------------------------------------------------------

  tooltips = {
    name: 'tooltips'
    clazz:'decorator'
    key:'tooltips$set'
    show: propertyType.bool
    value: propertyType.bool
    properties: {
      tooltipsTemplate:propertyType.string # templateUrl
    }
  }

  axis = {
    name:'axis'
    clazz:'decorator'
    key:'axis$set'
    show: propertyType.bool
    value: propertyType.enum(['top', 'bottom','left','right'])
    properties: {
      grid: propertyType.bool
      format: propertyType.string
      showLabel: propertyType.bool
      ticks: propertyType.number
      tickFormat: propertyType.string
      axisFormatter: propertyType.object
    }
  }

  legend = {
    name:'legend'
    clazz:'decorator'
    key:'legend$set'
    show: propertyType.bool
    value: propertyType.enum(['top-left','top-right','bottom-left','bottom-right'])
    properties: {
      templateUrl:propertyType.string
    }
  }

  valuesLegend = {
    name:'valuesLegend'
    clazz:'decorator'
    key:'valuesLegend$set'
    show: propertyType.bool
    value: propertyType.enum(['top-left','top-right','bottom-left','bottom-right'])
    properties: {
      templateUrl:propertyType.string
    }
  }

  selection = {
    name:'selection'
    clazz:'decorator'
    key:'selection$set'
    show: propertyType.bool
    properties: {
      selectedDomain: propertyType.object
      clearSelection: propertyType.callback
      selectedDomainChange: propertyType.event
    }
  }

  brush = {
    name:'brush'
    key:'brush$set'
    clazz:'decorator'
    show: propertyType.bool
    value: propertyType.string
    properties: {
      selectedDomain: propertyType.object
      selectedValues: propertyType.object
      brushExtent: propertyType.object
      selectedDomainChange: propertyType.event
      brushStart: propertyType.event
      brushEnd: propertyType.event
      clearBrush: propertyType.callback
    }
  }

  brushed = {
    name:'brushed'
    clazz:'decorator'
    key:'brushed$set'
    show: propertyType.bool
    value:  propertyType.string
  }
  
  #---------------------------------------------------------------------------------------------------------------------
  #---- Chart ----------------------------------------------------------------------------------------------------------
  #---------------------------------------------------------------------------------------------------------------------

  this.chart = {
    name:'chart'
    clazz:'chart'
    properties: {
      data: propertyType.objArray
      title: propertyType.string
      subtitle: propertyType.string
      deepWatch: propertyType.bool
      filter: propertyType.string
    }
    decorators: [tooltips]
    dimensions: {} # shared dimension
    layouts: []    # layouts
  }
  
  #---------------------------------------------------------------------------------------------------------------------


  this.layouts = {
    line:               layout('line','x,y,color',false,'y', [markers])
    lineVertical:       layout('line-vertical','x,y,color', false,'x', [markers])
    area:               layout('area','x,y,color', false, 'x')
    areaVertical:       layout('area-vertical','x,y,color', false, 'y')
    areaStacked:        layout('area-stacked','x,y,color', areaStyle, 'y')
    areaStackedVertical:layout('area-stacked-vertical','x,y,color', areaStyle, 'x')
    bars:               layout('bars','x,y,color', false, false, [labels, padding, outerPadding],[selection])
    barStacked:         layout('barStacked','x,y,color', false, 'x', [padding, outerPadding],[selection])
    barClustered:       layout('barClustered','x,y,color', false, 'x', [padding, outerPadding],[selection])
    column:             layout('column','x,y,color', false, false, [labels, padding, outerPadding],[selection])
    columnStacked:      layout('columnStacked','x,y,color', false, 'y', [padding, outerPadding],[selection])
    columnClustered:    layout('columnClustered','x,y,color', false, 'y', [padding, outerPadding],[selection])
    rangeArea:          layout('range-area','x,rangeY,color', false, false,[],[selection])
    rangeAreaVertical:  layout('range-area-vertical','x,rangeX,color', false, false,[],[selection])
    rangeBars:          layout('range-bars','x,rangeX,color', false, false,[labels],[selection])
    rangeColumn:        layout('range-column','x,rangeY,color', false, false,[labels],[selection])
    histogram:          layout('histogram','x,rangeX,color', false, false,[labels],[selection])
    pie:                layout('pie','size,color', false, false,[labels],[selection])
    spider:             layout('spider','x,y,color', false, false,[],[selection])
    bubble:             layout('bubble','x,y,color,size', false, false,[],[selection, brush])
    scatter:            layout('scatter','x,y,color,size,shape', false, false,[],[selection, brush])
    geoMap:             layout('geo-map','color',false,false,[geojson,projection],[selection])
  }
   
  #---------------------------------------------------------------------------------------------------------------------

  this.dimension = {
    x: dim('x', [property, base], [axis, brush, brushed])
    y: dim('y', [property, base],[axis, brush, brushed])
    rangeX : dim('rangeX', [range, base],[axis, brush, brushed])
    rangeY : dim('rangeY', [range, base],[axis, brush, brushed])
    color: dim('color', [property, base],[legend, valuesLegend])
    size: dim('size', [property, base],[legend, valuesLegend])
    shape: dim('shape', [property, base],[legend, valuesLegend])
  }
  
  #---------------------------------------------------------------------------------------------------------------------

  return this