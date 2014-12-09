angular.module('wk.chart').directive 'barStacked', ($log, utils, barConfig) ->

  stackedBarCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking Stacked bar'

      _id = "stackedColumn#{stackedBarCntr++}"

      layers = null

      stack = []
      _tooltip = ()->
      _scaleList = {}
      _selected = undefined
      barPaddingOld = 0
      barOuterPaddingOld = 0

      _merge = utils.mergeData().key((d) -> d.key)
      _mergeLayers = utils.mergeData()

      initial = true

      config = barConfig

      ttEnter = (data) ->
        ttLayers = data.layers.map((l) -> {name:l.layerKey, value:_scaleList.y.formatValue(l.value), color: {'background-color': l.color}})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(data.key)
        @layers = @layers.concat(ttLayers)

      #-----------------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color, size, shape) ->

        if not layers
          layers = @selectAll(".wk-chart-layer")
        #$log.debug "drawing stacked-bar"

        barPadding = y.scale().rangeBand() / (1 - config.padding) * config.padding
        barOuterPadding = y.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

        layerKeys = x.layerKeys(data)

        stack = []
        for d in data
          x0 = 0
          l = {key:y.value(d), layers:[], data:d, y:y.map(d), height:if y.scale().rangeBand then y.scale().rangeBand() else 1}
          if l.y isnt undefined
            l.layers = layerKeys.map((k) ->
              layer = {layerKey:k, key:l.key, value:d[k], width: x.scale()(+d[k]), height: (if y.scale().rangeBand then y.scale().rangeBand() else 1), x: x.scale()(+x0), color: color.scale()(k)}
              x0 += +d[k]
              return layer
            )
            stack.push(l)

        _merge(stack).first({y:options.height + barPaddingOld / 2 - barOuterPadding, height:0}).last({y:0, height:barOuterPaddingOld - barPaddingOld / 2})
        _mergeLayers(layerKeys)

        layers = layers
          .data(stack, (d)-> d.key)

        layers.enter().append('g')
          .attr('class', "wk-chart-layer").attr('transform',(d) -> "translate(0,#{if initial then d.y else _merge.addedPred(d).y - barPaddingOld / 2}) scale(1,#{if initial then 1 else 0})")
          .style('opacity',if initial then 0 else 1)
          .call(_tooltip.tooltip)

        layers
          .transition().duration(options.duration)
          .attr('transform',(d) -> return "translate(0, #{d.y}) scale(1,1)").style('opacity', 1)

        layers.exit()
          .transition().duration(options.duration)
          .attr('transform',(d) -> "translate(0,#{_merge.deletedSucc(d).y + _merge.deletedSucc(d).height + barPadding / 2}) scale(1,0)")
          .remove()

        bars = layers.selectAll('.wk-chart-bar')
          .data(
            (d) -> d.layers
          , (d) -> d.layerKey + '|' + d.key
          )

        bars.enter().append('rect')
          .attr('class', 'wk-chart-bar wk-chart-selectable')
          .attr('x', (d) ->
            if _merge.prev(d.key)
              idx = layerKeys.indexOf(_mergeLayers.addedPred(d.layerKey))
              if idx >= 0 then _merge.prev(d.key).layers[idx].x + _merge.prev(d.key).layers[idx].width else x.scale()(0)
            else
              d.x
          )
          .attr('width', (d) -> if _merge.prev(d.key) then 0 else d.width)
          .attr('height',(d) -> d.height)
          .call(_selected)

        bars.style('fill', (d) -> d.color)
          .transition().duration(options.duration)
            .attr('x', (d) -> d.x)
            .attr('width', (d) -> d.width)
            .attr('height', (d) -> d.height)

        bars.exit()
          .transition().duration(options.duration)
          .attr('x', (d) ->
            idx = layerKeys.indexOf(_mergeLayers.deletedSucc(d.layerKey))
            if idx >= 0 then _merge.current(d.key).layers[idx].x else _merge.current(d.key).layers[layerKeys.length - 1].x + _merge.current(d.key).layers[layerKeys.length - 1].width
          )
          .attr('width', 0)
          .remove()

        initial = false
        barPaddingOld = barPadding
        barOuterPaddingOld = barOuterPadding

      drawBrush = (axis, idxRange) ->
        layers
          .attr('transform',(d) -> "translate(0, #{if (x = axis.scale()(d.key)) >= 0 then x else -1000})")
          .selectAll('.wk-chart-bar')
            .attr('height', (d) -> axis.scale().rangeBand())

      #-----------------------------------------------------------------------------------------------------------------


      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('total').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _selected = host.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', drawBrush


      attrs.$observe 'padding', (val) ->
        if val is 'false'
          config.padding = 0
          config.outerPadding = 0
        else if val is 'true'
          _.merge(config, barConfig)
        else
          values = utils.parseList(val)
          if values
            if values.length is 1
              config.padding = values[0]/100
              config.outerPadding = values[0]/100
            if values.length is 2
              config.padding = values[0]/100
              config.outerPadding = values[1]/100
        _scaleList.y.rangePadding(config)
        host.lifeCycle().update()
  }
