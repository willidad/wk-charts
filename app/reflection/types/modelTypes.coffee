'use strict'

angular.module('wk.chart').service 'modelTypes', ($log, wkChartScales) ->
  
  #----Setup helpers ---------------------------------------------------------------------------------------------------

  layout = (name, layerDimension, properties, decorators) ->
    # generate the layout descriptor object

    ret =  {
      name: name
      clazz: 'layout'
      layerDimension: layerDimension
      properties: assign(properties)
      decorators: decorators
    }
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
  mapFunction = {mapFunction:propertyType.string}

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
    dateFormat:propertyType.string
    domain:propertyType.list
    domainMin:propertyType.string
    domainMax:propertyType.string
    reset:propertyType.bool
    range:propertyType.list
    domainRange:propertyType.enum(['min', 'max', 'extent','total'])
    label:propertyType.string
    labelStyle:propertyType.object
    exponent:propertyType.number
    reverse:propertyType.bool
  }
  
  #---- Decorators -----------------------------------------------------------------------------------------------------

  right = {
    name: 'right'
    clazz: 'decorator'
    key: 'right'
  }

  top = {
    name: 'top'
    clazz: 'decorator'
    key: 'top'
  }

  tooltips = {
    name: 'tooltips'
    clazz:'decorator'
    key:'tooltips'
    properties: {
      tooltipsTemplate:propertyType.string # templateUrl
    }
  }

  axis = {
    name:'axis'
    clazz:'decorator'
    key:'axis'
    properties: {
      grid: propertyType.bool
      gridStyle: propertyType.object
      format: propertyType.string
      showLabel: propertyType.bool
      ticks: propertyType.number
      tickInterval: propertyType.number
      tickFormat: propertyType.string
      tickLabelStyle: propertyType.object
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
      legendStyle: propertyType.object
    }
  }

  valuesLegend = {
    name:'valuesLegend'
    clazz:'decorator'
    key:'valuesLegend$set'
    value: propertyType.enum(['top-left','top-right','bottom-left','bottom-right'])
    properties: {
      templateUrl:propertyType.string
      legendStyle: propertyType.object
    }
  }

  selection = {
    name:'selection'
    clazz:'decorator'
    key:'selection'
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
      animationDuration: propertyType.number
      backgroundStyle: propertyType.object
    }
    decorators: [tooltips]
    dimensions: {} # shared dimension
    layouts: []    # layouts
  }
  
  #---------------------------------------------------------------------------------------------------------------------

  this.layouts = {
    line:               layout('line','y', [markers, spline])
    lineVertical:       layout('lineVertical','x', [markers, spline])
    area:               layout('area', 'x', [markers, spline])
    areaVertical:       layout('areaVertical', 'y', [markers, spline])
    areaStacked:        layout('areaStacked', false, 'y', [areaStacked, markers, spline])
    areaStackedVertical:layout('areaStackedVertical', false, 'x', [areaStackedVertical, markers, spline])
    bars:               layout('bars', false, [padding, outerPadding],[labels, selection])
    barStacked:         layout('barStacked', 'x', [padding, outerPadding],[selection])
    barClustered:       layout('barClustered', 'x', [padding, outerPadding],[selection])
    column:             layout('column', false, [padding, outerPadding],[labels, selection])
    columnStacked:      layout('columnStacked', 'y', [padding, outerPadding],[selection])
    columnClustered:    layout('columnClustered', 'y', [padding, outerPadding],[selection])
    rangeArea:          layout('rangeArea', false,[],[selection])
    rangeAreaVertical:  layout('rangeAreaVertical', false,[],[selection])
    rangeBars:          layout('rangeBars', false,[],[labels,selection])
    rangeColumn:        layout('rangeColumn', false,[],[labels,selection])
    histogram:          layout('histogram', false,[],[labels,selection])
    pie:                layout('pie', false,[donat],[labels,selection])
    spider:             layout('spider', false,[],[selection])
    bubble:             layout('bubble', false,[],[selection, brush])
    scatter:            layout('scatter', false,[],[selection, brush])
    geoMap:             layout('geo-map',false,[geojson,projection],[selection])
  }
   
  #---------------------------------------------------------------------------------------------------------------------

  this.dimension = {
    x: dim('x', [property, base, tickRotation], [axis, brush, brushed])
    'x top': dim('x top', [property, base, tickRotation], [axis, brush, brushed])
    y: dim('y', [property, base, tickRotation],[axis, brush, brushed])
    'y right': dim('y right', [property, base, tickRotation],[axis, brush, brushed])
    color: dim('color', [property, base, mapFunction],[legend, valuesLegend])
    size: dim('size', [property, base],[legend, valuesLegend])
    shape: dim('shape', [property, base],[legend, valuesLegend])
  }
  
  #---------------------------------------------------------------------------------------------------------------------

  return this