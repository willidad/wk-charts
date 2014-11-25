angular.module('wk.chart').directive 'histogram', ($log, barConfig) ->

  sHistoCntr = 0

  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me

      _id = "histogram#{sHistoCntr++}"

      _scaleList = {}
      buckets = undefined
      config = {}
      _.merge(config, barConfig)

      initial = true

      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      _tooltip = undefined

      ttEnter = (data) ->
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.y.axisLabel()
        @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.y.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

      #--- Draw --------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->

        if data?.length > 0
          nbrBuckets = data.length
          range = x.scale().range()
          rangeWidth = range[1] - range[0]
          bucketWidth = rangeWidth / nbrBuckets

          layout = data.map((d,i) -> {x:bucketWidth * i, xVal:x.value(d), y:y.map(d), width:bucketWidth, height: options.height - y.map(d), color:color.map(d)})
        else
          layout = []

        if not buckets
          buckets = @selectAll('.bucket')

        buckets = buckets.data(layout, (d) -> d.xVal)

        buckets.enter().append('rect').attr('class','bucket')

        buckets
          .attr('x', (d) -> d.x)
          .attr('width', (d) -> d.width)
          .attr('y', (d) -> d.y)
          .attr('height', (d) -> d.height)
          .style('fill',(d) -> d.color)

        buckets.exit().remove()

      #-----------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('y').domainCalc('max').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).scaleType('linear').domainCalc('extent')
        _tooltip = host.behavior().tooltip
        _selected = host.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'draw', draw
  }