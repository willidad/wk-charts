angular.module('wk.chart').directive 'columnHistogram', ($log, barConfig, utils) ->

  sHistoCntr = 0

  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me

      _id = "histogram#{sHistoCntr++}"

      _scaleList = {}
      buckets = undefined
      labels = undefined
      config = {}

      _tooltip = undefined
      _selected = undefined
      _.merge(config, barConfig)

      _merge = utils.mergeData().key((d)-> d.xVal)

      initial = true

      #--- Tooltip Event Handlers --------------------------------------------------------------------------------------

      _tooltip = undefined

      ttEnter = (data) ->
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.y.axisLabel()
        @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.y.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

      #--- Draw --------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color, size, shape, xRange) ->

        if xRange.upperProperty()
          layout = data.map((d) -> {x:xRange.scale()(xRange.lowerValue(d)), xVal:xRange.lowerValue(d), width:xRange.scale()(xRange.upperValue(d)) - xRange.scale()(xRange.lowerValue(d)), y:y.map(d), height:options.height - y.map(d), color:color.map(d), data:d})
        else
          if data.length > 0
            start = xRange.lowerValue(data[0])
            step = xRange.lowerValue(data[1]) - start
            width = options.width / data.length
            layout = data.map((d, i) -> {x:xRange.scale()(start + step * i), xVal:xRange.lowerValue(d), width:width, y:y.map(d), height:options.height - y.map(d), color:color.map(d), data:d})

        _merge(layout).first({x:0}).last({x:options.width, width: 0})

        if not buckets
          buckets = @selectAll('.wk-chart-bucket')

        buckets = buckets.data(layout, (d) -> d.xVal)

        buckets.enter().append('rect').attr('class','wk-chart-bucket')
          .style('fill',(d) -> d.color)
          .attr('x', (d) -> if initial then d.x else _merge.addedPred(d).x  + _merge.addedPred(d).width)
          .attr('width', (d) -> if initial then d.width else 0)
          .attr('y', (d) -> d.y)
          .attr('height', (d) -> d.height)
          .style('opacity', if initial then 0 else 1)
          .call(_tooltip.tooltip)
          .call(_selected)

        buckets.transition().duration(options.duration)
          .attr('x', (d) -> d.x)
          .attr('width', (d) -> d.width)
          .attr('y', (d) -> d.y)
          .attr('height', (d) -> d.height)
          .style('opacity',1)

        buckets.exit().transition().duration(options.duration)
          .attr('x', (d) -> _merge.deletedSucc(d).x)
          .attr('width', 0)
          .remove()

        #if host.showLabels()

        if not labels
          labels = @selectAll('.wk-chart-label')
        labels = labels.data((if host.showLabels() then layout else []), (d) -> d.xVal)

        labels.enter().append('text').attr('class', 'wk-chart-label')
          .style('opacity', 0)

        labels
          .attr('x', (d) -> d.x + d.width / 2)
          .attr('y', (d) -> d.y - 20)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .style('font-size', '1.3em')
          .text((d) -> y.formattedValue(d.data))
          .transition().duration(options.duration)
            .style('opacity', 1)

        labels.exit()
          .transition().duration(options.duration)
            .style('opacity', 0)
            .remove()
        ###
        else
          if labels
            labels = labels.transition().duration(options.duration)
              .style('opacity', 0)
              .remove()
        ###
        initial = false

      #-----------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['rangeX', 'y', 'color'])
        @getKind('y').domainCalc('max').resetOnNewData(true)
        @getKind('rangeX').resetOnNewData(true).scaleType('linear').domainCalc('rangeExtent')
        _tooltip = host.behavior().tooltip
        _selected = host.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'draw', draw

      #-------------------------------------------------------------------------------------------------------------------

      attrs.$observe 'labels', (val) ->
        if val is 'false'
          host.showLabels(false)
        else if val is 'true' or val is ""
          host.showLabels(true)
        host.lifeCycle().update()
  }