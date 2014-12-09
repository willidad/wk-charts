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
        @headerName = _scaleList.rangeX.axisLabel()
        @headerValue = _scaleList.y.axisLabel()
        @layers.push({name: _scaleList.color.formattedValue(data.data), value: _scaleList.y.formattedValue(data.data), color:{'background-color': _scaleList.color.map(data.data)}})

      #--- Draw --------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color, size, shape, rangeX) ->

        if rangeX.upperProperty()
          layout = data.map((d) -> {x:rangeX.scale()(rangeX.lowerValue(d)), xVal:rangeX.lowerValue(d), width:rangeX.scale()(rangeX.upperValue(d)) - rangeX.scale()(rangeX.lowerValue(d)), y:y.map(d), height:options.height - y.map(d), color:color.map(d), data:d})
        else
          if data.length > 0
            start = rangeX.lowerValue(data[0])
            step = rangeX.lowerValue(data[1]) - start
            width = options.width / data.length
            layout = data.map((d, i) -> {x:rangeX.scale()(start + step * i), xVal:rangeX.lowerValue(d), width:width, y:y.map(d), height:options.height - y.map(d), color:color.map(d), data:d})

        _merge(layout).first({x:0, width:0}).last({x:options.width, width: 0})

        if not buckets
          buckets = @selectAll('.wk-chart-bucket')

        buckets = buckets.data(layout, (d) -> d.xVal)

        enter = buckets.enter().append('g').attr('class','wk-chart-bucket wk-chart-selectable')
          .attr('transform', (d) -> "translate(#{if initial then d.x else _merge.addedPred(d).x  + _merge.addedPred(d).width},#{d.y}) scale(#{if initial then 1 else 0},1)")
        enter.append('rect')
          .attr('height', (d) -> d.height)
          .attr('width', (d) -> d.width)
          .style('fill',(d) -> d.color)
          .style('opacity', if initial then 0 else 1)
          .call(_tooltip.tooltip)
          .call(_selected)
        enter.append('text')
          .attr('x', (d) -> d.width / 2)
          .attr('y', -20)
          .attr({dy: '1em', 'text-anchor':'middle'})
          .style({'font-size':'1.3em', opacity: 0})

        buckets.transition().duration(options.duration)
          .attr("transform", (d) -> "translate(#{d.x}, #{d.y}) scale(1,1)")
        buckets.select('rect').transition().duration(options.duration)
          .attr('width', (d) -> d.width)
          .attr('height', (d) -> d.height)
          .style('fill',(d) -> d.color)
          .style('opacity',1)
        buckets.select('text')
          .text((d) -> y.formattedValue(d.data))
          .transition().duration(options.duration)
            .style('opacity', if host.showDataLabels() then 1 else 0)

        buckets.exit().transition().duration(options.duration)
          .attr('transform', (d) -> "translate(#{_merge.deletedSucc(d).x},#{d.y}) scale(0,1)")
          .remove()

        initial = false

      #-----------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['rangeX', 'y', 'color'])
        @getKind('y').domainCalc('max').resetOnNewData(true)
        @getKind('rangeX').resetOnNewData(true).scaleType('linear').domainCalc('rangeExtent')
        @getKind('color').resetOnNewData(true)
        _tooltip = host.behavior().tooltip
        _selected = host.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'drawChart', draw

      #-------------------------------------------------------------------------------------------------------------------

      attrs.$observe 'labels', (val) ->
        if val is 'false'
          host.showDataLabels(false)
        else if val is 'true' or val is ""
          host.showDataLabels('y')
        host.lifeCycle().update()
  }

#TODO implement external brushing optimizations
#TODO test selection behavior