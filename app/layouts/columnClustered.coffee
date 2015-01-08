###*
  @ngdoc layout
  @name columnClustered
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a clustered column chart layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]
###
angular.module('wk.chart').directive 'columnClustered', ($log, utils, barConfig)->

  clusteredBarCntr = 0
  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me

      _id = "clusteredColumn#{clusteredBarCntr++}"

      layers = null

      _merge = utils.mergeData().key((d) -> d.key)
      _mergeLayers = utils.mergeData().key((d) -> d.layerKey)

      barPaddingOld = 0
      barOuterPaddingOld = 0

      config = _.clone(barConfig, true)
      drawBrush = undefined
      clusterX = undefined

      initial = true

      #-----------------------------------------------------------------------------------------------------------------

      _tooltip = undefined
      _scaleList = {}

      ttEnter = (data) ->
        ttLayers = data.layers.map((l) -> {name:l.layerKey, value:_scaleList.y.formatValue(l.value), color: {'background-color': l.color}})
        @headerName = _scaleList.x.axisLabel()
        @headerValue = _scaleList.x.formatValue(data.key)
        @layers = @layers.concat(ttLayers)

      #-----------------------------------------------------------------------------------------------------------------

      draw = (data, options, x, y, color) ->
        #$log.info "rendering clustered-bar"

        barPadding = x.scale().rangeBand() / (1 - config.padding) * config.padding
        barOuterPadding = x.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

        # map data to the right format for rendering
        layerKeys = y.layerKeys(data)

        clusterX = d3.scale.ordinal().domain(y.layerKeys(data)).rangeBands([0,x.scale().rangeBand()], 0, 0)

        cluster = data.map((d) -> l = {
          key:x.value(d), data:d, x:x.map(d), width: x.scale().rangeBand(x.value(d))
          layers: layerKeys.map((k) -> {layerKey: k, color:color.scale()(k), key:x.value(d), value: d[k], x:clusterX(k), y: y.scale()(d[k]), height:y.scale()(0) - y.scale()(d[k]), width:clusterX.rangeBand(k)})}
        )

        _merge(cluster).first({x:barPaddingOld / 2 - barOuterPadding, width:0}).last({x:options.width + barPadding/2 - barOuterPaddingOld, width:0})
        _mergeLayers(cluster[0].layers).first({x:0, width:0}).last({x:cluster[0].width, width:0})

        if not layers
          layers = @selectAll('.wk-chart-layer')

        layers = layers.data(cluster, (d) -> d.key)

        layers.enter().append('g')
          .attr('class', 'wk-chart-layer').call(_tooltip.tooltip)
          .attr('transform',(d) -> "translate(#{if initial then d.x else _merge.addedPred(d).x + _merge.addedPred(d).width + barPaddingOld / 2},0) scale(#{if initial then 1 else 0}, 1)")
          .style('opacity', if initial then 0 else 1)

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
          .attr('x', (d) -> if initial then d.x else _mergeLayers.addedPred(d).x + _mergeLayers.addedPred(d).width)
          .attr('width', (d) ->if initial then d.width else 0)

        bars.style('fill', (d) -> color.scale()(d.layerKey)).transition().duration(options.duration)
          .attr('width', (d) -> d.width)
          .attr('x', (d) -> d.x)
          .attr('y', (d) -> Math.min(y.scale()(0), d.y))
          .attr('height', (d) -> Math.abs(d.height))

        bars.exit()
          .transition().duration(options.duration)
          .attr('width',0)
          .attr('x', (d) -> _mergeLayers.deletedSucc(d).x)
          .remove()

        initial = false
        barPaddingOld = barPadding
        barOuterPaddingOld = barOuterPadding

      drawBrush = (axis, idxRange) ->
        clusterX.rangeBands([0,axis.scale().rangeBand()], 0, 0)
        width = clusterX.rangeBand()
        layers
          .attr('transform',(d) -> "translate(#{if (x = axis.scale()(d.key)) >= 0 then x else -1000},0)")
          .selectAll('.wk-chart-bar')
            .attr('width', width)
            .attr('x', (d) -> clusterX(d.layerKey))

      #-------------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('y').domainCalc('max').resetOnNewData(true)
        @getKind('x').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', drawBrush

      ###*
        @ngdoc attr
        @name columnClustered#padding
        @values true, false, [padding, outerPadding]
        @param [padding=true] {boolean | list}
      * Defines the inner and outer padding between the bars.
      *
      * `padding` and `outerPadding` are measured in % of the total bar space occupied, i.e. a padding of 20 implies a bar height of 80%, padding 50 implies bar and space have the same size.
      *
      * `padding` is 10, `outerPadding` is 0 unless explicitly specified differently.
      *
      * Setting `padding="false"` is equivalent to [0,0]
      ###

      attrs.$observe 'padding', (val) ->
        if val is 'false'
          config.padding = 0
          config.outerPadding = 0
        else if val is 'true'
          config = _.clone(barConfig, true)
        else
          values = utils.parseList(val)
          if values
            if values.length is 1
              config.padding = values[0]/100
              config.outerPadding = values[0]/100
            if values.length is 2
              config.padding = values[0]/100
              config.outerPadding = values[1]/100
        _scaleList.x.rangePadding(config)
        host.lifeCycle().update()
  }
