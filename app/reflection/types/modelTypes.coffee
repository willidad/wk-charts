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
    return _.assign.apply(this, [{}].concat(list))

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
  donat = {donat:propertyType.bool}
  padding = {padding:propertyType.number}
  outerPadding = {outerPadding:propertyType.number}
  areaStacked = {areaStacked:propertyType.enum(['zero', 'silhouette','expand','wiggle'])}
  areaStackedVertical = {areaStackedVertical:propertyType.enum(['zero', 'silhouette','expand','wiggle'])}
  geojson = {geojson:propertyType.object}
  projection = {projection:propertyType.object}
  spline = {spline:propertyType.bool}

  property = {
    property:propertyType.list
  }

  tickRotation = {
    rotateTickLabels:propertyType.number
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
    labelStyle:propertyType.object
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
    value: propertyType.enum(['top-left','top-right','bottom-left','bottom-right'])
    properties: {
      templateUrl:propertyType.string
    }
  }

  valuesLegend = {
    name:'valuesLegend'
    clazz:'decorator'
    key:'valuesLegend$set'
    value: propertyType.enum(['top-left','top-right','bottom-left','bottom-right'])
    properties: {
      templateUrl:propertyType.string
    }
  }

  selection = {
    name:'selection'
    clazz:'decorator'
    key:'selection$set'
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
    value:  propertyType.string
  }

  labels = {
    name: 'labels',
    clazz: 'decorator'
    key: 'labels$set'
    properties: {
      labelStyle: propertyType.object
    }
  }
  
  #---------------------------------------------------------------------------------------------------------------------
  #---- Chart ----------------------------------------------------------------------------------------------------------
  #---------------------------------------------------------------------------------------------------------------------

  this.chart = {
    name:'chart'
    clazz:'chart'
    properties: {
      data: propertyType.objArray
      header: propertyType.string
      headerStyle: propertyType.object
      subHeader: propertyType.string
      subHeaderStyle:propertyType.object
      deepWatch: propertyType.bool
      filter: propertyType.string
      edit: propertyType.bool
      editSelected: propertyType.event
    }
    decorators: [tooltips]
    dimensions: {} # shared dimension
    layouts: []    # layouts
  }
  
  #---------------------------------------------------------------------------------------------------------------------

  this.layouts = {
    line:               layout('line','x,y,color',false,'y', [markers, spline])
    lineVertical:       layout('lineVertical','x,y,color', false,'x', [markers, spline])
    area:               layout('area','x,y,color', false, 'x', [markers, spline])
    areaVertical:       layout('areaVertical','x,y,color', false, 'y', [markers, spline])
    areaStacked:        layout('areaStacked','x,y,color', false, 'y', [areaStacked, markers, spline])
    areaStackedVertical:layout('areaStackedVertical','x,y,color', false, 'x', [areaStackedVertical, markers, spline])
    bars:               layout('bars','x,y,color', false, false, [padding, outerPadding],[labels, selection])
    barStacked:         layout('barStacked','x,y,color', false, 'x', [padding, outerPadding],[selection])
    barClustered:       layout('barClustered','x,y,color', false, 'x', [padding, outerPadding],[selection])
    column:             layout('column','x,y,color', false, false, [padding, outerPadding],[labels, selection])
    columnStacked:      layout('columnStacked','x,y,color', false, 'y', [padding, outerPadding],[selection])
    columnClustered:    layout('columnClustered','x,y,color', false, 'y', [padding, outerPadding],[selection])
    rangeArea:          layout('rangeArea','x,y,color', false, false,[],[selection])
    rangeAreaVertical:  layout('rangeAreaVertical','x,y,color', false, false,[],[selection])
    rangeBars:          layout('rangeBars','x,y,color', false, false,[],[labels,selection])
    rangeColumn:        layout('rangeColumn','x,y,color', false, false,[],[labels,selection])
    histogram:          layout('histogram','x,y,color', false, false,[],[labels,selection])
    pie:                layout('pie','size,color', false, false,[donat],[labels,selection])
    spider:             layout('spider','x,y,color', false, false,[],[selection])
    bubble:             layout('bubble','x,y,color,size', false, false,[],[selection, brush])
    scatter:            layout('scatter','x,y,color,size,shape', false, false,[],[selection, brush])
    geoMap:             layout('geo-map','color',false,false,[geojson,projection],[selection])
  }
   
  #---------------------------------------------------------------------------------------------------------------------

  this.dimension = {
    x: dim('x', [property, base, tickRotation], [axis, brush, brushed])
    y: dim('y', [property, base],[axis, brush, brushed])
    color: dim('color', [property, base],[legend, valuesLegend])
    size: dim('size', [property, base],[legend, valuesLegend])
    shape: dim('shape', [property, base],[legend, valuesLegend])
  }
  
  #---------------------------------------------------------------------------------------------------------------------

  return this