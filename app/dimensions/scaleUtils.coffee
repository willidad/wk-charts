angular.module('wk.chart').service 'scaleUtils', ($log, wkChartScales, utils) ->

  parseList = (val) ->
    if val
      l = val.trim().replace(/^\[|\]$/g, '').split(',').map((d) -> d.replace(/^[\"|']|[\"|']$/g, ''))
      l = l.map((d) -> if isNaN(d) then d else +d)
      return if l.length is 1 then return l[0] else l

  return {

    observeSharedAttributes: (attrs, me) ->
      ###*
        @ngdoc attr
        @name type
        @usedBy dimension
        @param [type=layout specific - see layout docs] {scale}
        Defines the d3 scale applied to transform the input data to a dimensions display value. All d3 scales are supported, as well as wk-chart specific extensions described here. #TODO insert correct links
      ###
      attrs.$observe 'type', (val) ->
        if val isnt undefined
          if d3.scale.hasOwnProperty(val) or val is 'time' or wkChartScales.hasOwnProperty(val)
            me.scaleType(val)
          else
            if val isnt ''
              ## no scale defined, use default
              $log.error "Error: illegal scale value: #{val}. Using 'linear' scale instead"
          me.update()

      ###*
        @ngdoc attr
        @name exponent
        @usedBy dimension
        @param [exponent] {number}
        This attribute is only evaluated with pow and log scale types - defines the exponent for the d3 pow and log scale #TODO insert correct links
      ###
      attrs.$observe 'exponent', (val) ->
        if me.scaleType() is 'pow' and _.isNumber(+val)
          me.exponent(+val).update()

      ###*
        @ngdoc attr
        @name property
        @usedBy dimension
        @param property{expression}
          the input data property (properties) used to compute this dimension. In case the charts supports a the data layer dimension this attribute can be a list of data properties.
          In this case the property field can be omitted, for non-layer dimension it is required.
      ###
      attrs.$observe 'property', (val) ->
        me.property(parseList(val)).update()

      ###*
        @ngdoc attr
        @name layerProperty
        @usedBy dimension
        @param [layerProperty] {expression}
        defines the container object for property in case the data is a hierachical structure. See (#todo define link)
         for more detail
      ###
      attrs.$observe 'layerProperty', (val) ->
        if val and val.length > 0
          me.layerProperty(val).update()

      ###*
        @ngdoc attr
        @name range
        @usedBy dimension
        @param [range] {expression}
        The scale types range attribute. For x and y scales the range is set to the pixel width and height of the drawing container, for category... scales the range is set to the scales color range
      ###
      attrs.$observe 'range', (val) ->
        range = parseList(val)
        if Array.isArray(range)
          me.range(range).update()

      ###*
        @ngdoc attr
        @name dateFormat
        @usedBy dimension
        @param [dateFormat] {expression}
        applies to Time scale type only. Describes the date display format of the property field content. can be omitted if the field is already a javascript Date object, otherwise the format is used to transform
        the property values into a Javascript Date object.Date Format is described using d3's [Time Format](https://github.com/mbostock/d3/wiki/Time-Formatting#format)
      ###
      attrs.$observe 'dateFormat', (val) ->
        if val
         if me.scaleType() is 'time'
           me.dataFormat(val).update()

      ###*
        @ngdoc attr
        @name domain
        @usedBy dimension
        @param [domain] {expression}
        the scale types domain property. Meaning and acceptable values for domain depend on teh scale type, thus please see (TODO: define link)
        for further explanation
      ###
      attrs.$observe 'domain', (val) ->
        if val
          $log.info 'domain', val
          parsedList = parseList(val)
          if Array.isArray(parsedList)
            me.domain(parsedList).update()
          else
            $log.error "domain: must be array, or comma-separated list, got", val
        else
            me.domain(undefined).update()
      ###*
        @ngdoc attr
        @name domainRange
        @usedBy dimension
        @param [domainRange] {expression}
        Certain scale type and dimensions require a calculation of the data range to perform the correct mapping onto the scale output.domainRange defined the rule to be used to calculate this. Possible values are:
        min: [0 .. minimum data value]
        max: [0 .. maximum data value]
        extent: [minimum data value .. maximum data value]
        total: applies only layer dimensions, calculates as 0 ..  maximum of the layer value totals]
      ###
      attrs.$observe 'domainRange', (val) ->
        if val
          me.domainCalc(val).update()

      ###*
        @ngdoc attr
        @name label
        @usedBy dimension
        @param [label] {expression}
        defined the dimensions label text. If not specified, the value of teh 'property' attribute is used
      ###
      attrs.$observe 'label', (val) ->
        if val isnt undefined
          me.axisLabel(val).updateAttrs()

      ###*
        @ngdoc attr
        @name format
        @usedBy dimension
        @param [format] {expression}
         a formatting string used to display tooltip and legend values for the dimension. if omitted, a default format will be applied
        please note tha this is different from the 'tickFormat' attribute
      ###
      attrs.$observe 'format', (val) ->
        if val isnt undefined
          me.format(val)

      ###*
        @ngdoc attr
        @name reset
        @usedBy dimension
        @param [reset] {expression}
         If sepcified or set to true, the domain values are reset every time the carts data changes.
      ###
      attrs.$observe 'reset', (val) ->
        me.resetOnNewData(utils.parseTrueFalse(val))

      #-------------------------------------------------------------------------------------------------------------------

    observeAxisAttributes: (attrs, me, scope) ->
      ###*
          @ngdoc attr
          @name labelStyle
          @usedBy dimension.x, dimension.y
          @param [labelStyle=font-size:"1.3em"] {object}
      ###

      attrs.$observe 'labelStyle', (val) ->
        if val
          me.axisLabelStyle(scope.$eval(val))

      ###*
          @ngdoc attr
          @name tickFormat
          @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
          @param [tickFormat] {expression}
      ###
      attrs.$observe 'tickFormat', (val) ->
        if val isnt undefined
          me.tickFormat(d3.format(val)).update()

      ###*
        @ngdoc attr
        @name ticks
        @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
        @param [ticks] {expression}
      ###
      attrs.$observe 'ticks', (val) ->
        if val isnt undefined
          me.ticks(+val)
          if me.axis()
            me.updateAttrs()
      ###*
          @ngdoc attr
          @name tickLabelStyle
          @usedBy dimension.x, dimension.y
          @param [tickLabelStyle=font-size:"1em"] {object}
      ###
      attrs.$observe 'tickLabelStyle', (val) ->
        if val
          me.tickLabelStyle(scope.$eval(val))

      ###*
        @ngdoc attr
        @name grid
        @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
        @param [grid] {expression}
      ###
      attrs.$observe 'grid', (val) ->
        if val isnt undefined
          me.showGrid(val is '' or val is 'true').updateAttrs()

      ###*
          @ngdoc attr
          @name gridStyle
          @usedBy dimension.x, dimension.y
          @param [gridStyle] {object}
      ###
      attrs.$observe 'gridStyle', (val) ->
        if val
          me.gridStyle(scope.$eval(val))


      ###*
        @ngdoc attr
        @name showLabel
        @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
        @param [showLabel] {expression}
      ###
      attrs.$observe 'showLabel', (val) ->
        if val isnt undefined
          me.showLabel(val is '' or val is 'true').update(true)

      ###*
        @ngdoc attr
        @name axisFormatters
        @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
        @param [axisFormatters] {expression}
      ###
      scope.$watch attrs.axisFormatters,  (val) ->
        if _.isObject(val)
          if _.has(val, 'tickFormat') and _.isFunction(val.tickFormat)
            me.tickFormat(val.tickFormat)
          else if _.isString(val.tickFormat)
            me.tickFormat(d3.format(val))
          if _.has(val,'tickValues') and _.isArray(val.tickValues)
            me.tickValues(val.tickValues)
          me.update()

      ###*
        @ngdoc attr
        @name reverse
        @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
        @param [reverse] {boolean}
        reverses the direction of the axes if `true` , i.e. values are displayed in reverse order.
      ###
      attrs.$observe 'reverse' , (val) ->
        if val isnt undefined
          me.reverse(val is '' or val is 'true').update()

      ###*
        @ngdoc attr
        @name rotateTickLabels
        @usedBy dimension.x, dimension.y, dimension.rangeX, dimension.rangeY
        @param [rotateTickLabels] {number}
        rotates tick labels by ´number´ degrees.
      ###
      attrs.$observe 'rotateTickLabels', (val) ->
        if val and _.isNumber(+val)
          me.rotateTickLabels(+val)
        else
          me.rotateTickLabels(undefined)
        me.update(true)

    #-------------------------------------------------------------------------------------------------------------------

    observeLegendAttributes: (attrs, me, layout, scope) ->

      ###*
        @ngdoc attr
        @name legend
        @usedBy dimension
        @values true, false, top-right, top-left, bottom-left, bottom-right, #divName
        @param [legend=true] {expression}
      ###
      attrs.$observe 'legend', (val) ->
        if val isnt undefined
          l = me.legend()
          l.showValues(false)
          switch val
            when 'false'
              l.show(false)
            when 'top-left', 'top-right', 'bottom-left', 'bottom-right'
              l.position(val).div(undefined).show(true)
            when 'true', ''
              l.position('top-right').show(true).div(undefined)
            else
              legendDiv = d3.select(val)
              if legendDiv.empty()
                $log.warn 'legend reference does not exist:', val
                l.div(undefined).show(false)
              else
                l.div(legendDiv).position('top-left').show(true)

          l.scale(me).layout(layout)
          if me.parent()
            l.register(me.parent())
          l.redraw()

      ###*
        @ngdoc attr
        @name valuesLegend
        @usedBy dimension
        @param [valuesLegend] {expression}
      ###
      attrs.$observe 'valuesLegend', (val) ->
        if val isnt undefined
          l = me.legend()
          l.showValues(true)
          switch val
            when 'false'
              l.show(false)
            when 'top-left', 'top-right', 'bottom-left', 'bottom-right'
              l.position(val).div(undefined).show(true)
            when 'true', ''
              l.position('top-right').show(true).div(undefined)
            else
              legendDiv = d3.select(val)
              if legendDiv.empty()
                $log.warn 'legend reference does not exist:', val
                l.div(undefined).show(false)
              else
                l.div(legendDiv).position('top-left').show(true)

          l.scale(me).layout(layout)
          if me.parent()
            l.register(me.parent())
          l.redraw()

      ###*
        @ngdoc attr
        @name legendTitle
        @usedBy dimension
        @param [legendTitle] {expression}
      ###
      attrs.$observe 'legendTitle', (val) ->
        if val isnt undefined
          me.legend().title(val).redraw()

      ###*
        @ngdoc attr
        @name legendStyle
        @usedBy dimension
        @param [legendStyle] {object}
      ###
      attrs.$observe 'legendStyle', (val) ->
        if val isnt undefined
          me.legend().legendStyle(scope.$eval(val)).redraw()

    #--- Observe Range attributes --------------------------------------------------------------------------------------

    observerRangeAttributes: (attrs, me) ->

      ###*
        @ngdoc attr
        @name lowerProperty
        @usedBy dimension.rangeX, dimension.rangeY
        @param [lowerProperty] {expression}
      ###
      attrs.$observe 'lowerProperty', (val) ->
        me.lowerProperty(parseList(val)).update()

      ###*
        @ngdoc attr
        @name upperProperty
        @usedBy dimension.rangeX, dimension.rangeY
        @param [upperProperty] {expression}
      ###
      attrs.$observe 'upperProperty', (val) ->
        me.upperProperty(parseList(val)).update()

    }

