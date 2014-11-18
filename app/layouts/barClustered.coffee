angular.module('wk.chart').directive 'barClustered', ($log, utils)->

  clusteredBarCntr = 0
  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me

      _id = "clusteredBar#{clusteredBarCntr++}"

      layers = null

      _merge = utils.mergeData().key((d) -> d.key)
      _mergeLayers = utils.mergeData().key((d) -> d.layerKey)

      initial = true

      #-----------------------------------------------------------------------------------------------------------------

      _tooltip = undefined
      _scaleList = {}

      ttEnter = (data) ->
        ttLayers = data.layers.map((l) -> {name:l.layerKey, value:_scaleList.x.formatValue(l.value), color: {'background-color': l.color}})
        @headerName = _scaleList.y.axisLabel()
        @headerValue = _scaleList.y.formatValue(data.key)
        @layers = @layers.concat(ttLayers)

      #-----------------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->
        #$log.info "rendering clustered-bar"

        # map data to the right format for rendering
        layerKeys = x.layerKeys(data)

        clusterY = d3.scale.ordinal().domain(x.layerKeys(data)).rangeBands([0, y.scale().rangeBand()], 0.1)

        cluster = data.map((d) -> l = {
          key:y.value(d), data:d, y:y.map(d), height: y.scale().rangeBand(y.value(d))
          layers: layerKeys.map((k) -> {layerKey: k, color:color.scale()(k), key:y.value(d), value: d[k], y:clusterY(k), x: x.scale()(d[k]), width:x.scale()(d[k]), height:clusterY.rangeBand(k)})}
        )

        _merge(cluster).first({y:options.height, height:y.scale().rangeBand()}).last({y:y.scale().range()[y.scale().range().length-1], height:0})
        _mergeLayers(cluster[0].layers).first({y:clusterY.rangeBand() * 0.05, height:0}).last({y:cluster[0].height, height:0})

        if not layers
          layers = @selectAll('.layer')

        layers = layers.data(cluster, (d) -> d.key)

        layers.enter().append('g')
          .attr('class', 'layer').call(_tooltip.tooltip)
          .attr('transform', (d)->
            null
            "translate(0, #{if initial then d.y else _merge.addedPred(d).y}) scale(1,0)")
          .style('opacity', if initial then 1 else 0)

        layers
          .transition().duration(options.duration)
            .attr('transform',(d) -> "translate(0,#{d.y}) scale(1,1)")
            .style('opacity', 1)

        layers.exit()
          .transition().duration(options.duration)
            .attr('transform',(d) -> "translate(0, #{_merge.deletedSucc(d).y + _merge.deletedSucc(d).height * 1.05}) scale(1,0)")
            .remove()

        bars = layers.selectAll('.bar')
          .data(
            (d) -> d.layers
          , (d) -> d.layerKey + '|' + d.key
          )

        bars.enter().append('rect')
          .attr('class', 'bar selectable')
          .attr('y', (d) -> if initial then d.y else _mergeLayers.addedPred(d).y + _mergeLayers.addedPred(d).height * 1.05)
          .attr('height', (d) -> if initial then d.height else 0)
          .attr('x', x.scale()(0))


        bars.style('fill', (d) -> color.scale()(d.layerKey)).transition().duration(options.duration)
          .attr('width', (d) -> d.width)
          .attr('y', (d) -> d.y)
          .attr('x', (d) -> Math.min(x.scale()(0), d.x))
          .attr('height', (d) -> Math.abs(d.height))

        bars.exit()
          .transition().duration(options.duration)
            #.attr('width',0)
            .attr('height', 0)
            .attr('y', (d) -> _mergeLayers.deletedSucc(d).y)
            .remove()

        initial = false

      #-------------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('max').resetOnNewData(true)
        @getKind('y').resetOnNewData(true)
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'draw', draw
      host.lifeCycle().on 'brushDraw', draw
  }