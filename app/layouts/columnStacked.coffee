angular.module('wk.chart').directive 'columnStacked', ($log, utils, barConfig) ->

  stackedColumnCntr = 0
  return {
    restrict: 'A'
    require: 'layout'
    link: (scope, element, attrs, controller) ->
      host = controller.me
      #$log.log 'linking Stacked bar'

      _id = "stackedColumn#{stackedColumnCntr++}"

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
          layers = @selectAll(".layer")
        #$log.debug "drawing stacked-bar"

        barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding
        barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

        layerKeys = y.layerKeys(data)

        stack = []
        for d in data
          y0 = 0
          l = {key:x.value(d), layers:[], data:d, x:x.map(d), width:if x.scale().rangeBand then x.scale().rangeBand() else 1}
          if l.x isnt undefined
            l.layers = layerKeys.map((k) ->
              layer = {layerKey:k, key:l.key, value:d[k], height:  y.scale()(0) - y.scale()(+d[k]), width: (if x.scale().rangeBand then x.scale().rangeBand() else 1), y: y.scale()(+y0 + +d[k]), color: color.scale()(k)}
              y0 += +d[k]
              return layer
            )
            stack.push(l)

        _merge(stack).first({x: barPaddingOld / 2 - barOuterPadding, width:0}).last({x:options.width + barPadding/2 - barOuterPaddingOld, width:0})
        _mergeLayers(layerKeys)

        layers = layers
          .data(stack, (d)-> d.key)

        layers.enter().append('g')
          .attr('transform',(d) -> "translate(#{if initial then d.x else _merge.addedPred(d).x + _merge.addedPred(d).width + barPaddingOld / 2},0) scale(#{if initial then 1 else 0}, 1)")
          .style('opacity',if initial then 0 else 1)
          .call(_tooltip.tooltip)

        layers
          .transition().duration(options.duration)
          .attr('transform',(d) -> "translate(#{d.x},0) scale(1,1)")
          .style('opacity', 1)

        layers.exit()
          .transition().duration(options.duration)
            .attr('transform',(d) -> "translate(#{_merge.deletedSucc(d).x - barPadding / 2}, 0) scale(0,1)")
            .remove()

        bars = layers.selectAll('.wk-chart-bar')
          .data(
            (d) -> d.layers
          , (d) -> d.layerKey + '|' + d.key
          )

        bars.enter().append('rect')
          .attr('class', 'wk-chart-bar wk-chart-selectable')
          .attr('y', (d) ->
            if _merge.prev(d.key)
              idx = layerKeys.indexOf(_mergeLayers.addedPred(d.layerKey))
              if idx >= 0 then _merge.prev(d.key).layers[idx].y else y.scale()(0)
            else
              d.y
          )
          .attr('height',(d) -> d.height)
          .call(_selected)

        bars.style('fill', (d) -> d.color)
          .transition().duration(options.duration)
            .attr('y', (d) -> d.y)
            .attr('width', (d) -> d.width)
            .attr('height', (d) -> d.height)

        bars.exit()
          .transition().duration(options.duration)
          .attr('height',0)
          .attr('y', (d) ->
            idx = layerKeys.indexOf(_mergeLayers.deletedSucc(d.layerKey))
            if idx >= 0 then _merge.current(d.key).layers[idx].y + _merge.current(d.key).layers[idx].height else _merge.current(d.key).layers[layerKeys.length - 1].y
          )
          .remove()

        initial = false
        barPaddingOld = barPadding
        barOuterPaddingOld = barOuterPadding

      #-----------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('y').domainCalc('total').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _selected = host.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'draw', draw
      host.lifeCycle().on 'brushDraw', draw


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