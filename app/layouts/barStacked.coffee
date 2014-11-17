angular.module('wk.chart').directive 'barStacked', ($log, utils) ->

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
      oldKeys = []
      oldXKeys = []
      oldStack = []
      _tooltip = ()->
      _scaleList = {}
      _selected = undefined

      ttEnter = (data) ->
        ttLayers = data.layers.map((l) -> {name:l.layerKey, value:_scaleList.y.formatValue(l.value), color: {'background-color': l.color}})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(data.key)
        @layers = @layers.concat(ttLayers)

      #-----------------------------------------------------------------------------------------------------------------

      getXByKey = (stack, key) ->
        i = 0
        while i < stack.length
          if stack[i].key is key
            return stack[i]
          i++

      getLayerByKey = (stack, xKey, layerKey) ->
        s = getXByKey(stack, xKey)
        if s
          i = 0
          while i < s.layers.length
            if s.layers[i].layerKey is layerKey
              return s.layers[i]
            i++

      #-----------------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color, size, shape) ->

        if not layers
          layers = @selectAll(".layer")
        #$log.debug "drawing stacked-bar"


        layerKeys = x.layerKeys(data)
        xKeys = y.value(data)

        lDeletedSucc = utils.diff(oldKeys,layerKeys,1)
        lAddedPred = utils.diff(layerKeys, oldKeys, -1)
        xDeletedSucc = utils.diff(oldXKeys, xKeys,1)
        xAddedPred = utils.diff(xKeys,oldXKeys,-1)

        NaNto0 = (n) ->
          if isNaN(n) then 0 else n

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

        layers = layers
          .data(stack, (d)-> d.key)

        if oldStack.length is 0
          layers.enter().append('g')
            .attr('class', "layer").attr('transform',(d) -> "translate(0, #{d.y}) scale(1,1)").style('opacity',0).call(_tooltip.tooltip)
        else
          layers.enter().append('g')
            .attr('class', "layer").attr('transform',(d) ->
              pred = getXByKey(oldStack, xAddedPred[d.key])
              tx = if pred then pred.x + pred.width * 1.05 else 0
              return "translate(#{NaNto0(tx)},0) scale(0,1)"
            ).call(_tooltip.tooltip)

        layers
          .transition().duration(options.duration)
          .attr('transform',(d) ->
            return "translate(0, #{d.y}) scale(1,1)").style('opacity', 1)

        layers.exit()
          .transition().duration(options.duration)
          .attr('transform',(d, i) ->
            succ = getXByKey(stack, xDeletedSucc[d.key])
            tx = if succ then succ.x - succ.width * 0.05 else if stack.length > 0 then stack[stack.length-1].x + stack[stack.length-1].width else 0
            return "translate(#{tx},#{y.scale()(0)}) scale(0,0)")
          .remove()

        bars = layers.selectAll('.bar')
          .data(
            (d) -> d.layers
          , (d) -> d.layerKey + '|' + d.key
          )

        if oldStack.length is 0
          bars.enter().append('rect')
            .attr('class', 'bar')
            .call(_selected)
        else
          bars.enter().append('rect')
            .attr('class', 'bar selectable')
            .attr('x', (d) ->
              pred = getLayerByKey(oldStack, d.key, lAddedPred[d.layerKey])
              return if pred then pred.x else x.scale()(0)
            )
            .attr('width', 0).attr('height',(d) -> d.height)
            .call(_selected)

        bars.style('fill', (d) -> d.color)
          .transition().duration(options.duration)
            .attr('x', (d) -> d.x)
            .attr('width', (d) -> d.width)
            .attr('height', (d) -> d.height)

        bars.exit()
          .transition().duration(options.duration)
          .attr('height',0)
          .attr('x', (d) ->
            succ = getLayerByKey(stack, d.key, lDeletedSucc[d.layerKey])
            if succ
              return succ.x + succ.height
            else
              x = getXByKey(stack, d.key)
              return x.layers[x.layers.length - 1].y
          )
          .remove()

        oldKeys = layerKeys
        oldXKeys = xKeys
        oldStack = stack

      #-----------------------------------------------------------------------------------------------------------------


      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('total').resetOnNewData(true)
        @getKind('y').resetOnNewData(true)
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _selected = host.behavior().selected
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'draw', draw
      host.lifeCycle().on 'brushDraw', draw
  }