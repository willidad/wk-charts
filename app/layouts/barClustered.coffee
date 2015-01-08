###*
  @ngdoc layout
  @name barClustered
  @module wk.chart
  @restrict A
  @area api
  @element layout
  @description

  draws a clustered bar layout

  @usesDimension x [type=linear, domainRange=extent] The horizontal dimension
  @usesDimension y [type=linear, domainRange=extent]
  @usesDimension color [type=category20]


###
angular.module('wk.chart').directive 'barClustered', ($log, utils, barConfig)->

  clusteredBarCntr = 0
  return {
    restrict: 'A'
    require: '^layout'

    link: (scope, element, attrs, controller) ->
      host = controller.me

      _id = "clusteredBar#{clusteredBarCntr++}"

      layers = null
      clusterY = undefined

      _merge = utils.mergeData().key((d) -> d.key)
      _mergeLayers = utils.mergeData().key((d) -> d.layerKey)

      barPaddingOld = 0
      barOuterPaddingOld = 0
      config = barConfig

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

        barPadding = y.scale().rangeBand() / (1 - config.padding) * config.padding
        barOuterPadding = y.scale().rangeBand() / (1 - config.outerPadding) * config.outerPadding

        # map data to the right format for rendering
        layerKeys = x.layerKeys(data)

        clusterY = d3.scale.ordinal().domain(x.layerKeys(data)).rangeBands([0, y.scale().rangeBand()], 0, 0)

        cluster = data.map((d) -> l = {
          key:y.value(d), data:d, y:y.map(d), height: y.scale().rangeBand(y.value(d))
          layers: layerKeys.map((k) -> {layerKey: k, color:color.scale()(k), key:y.value(d), value: d[k], y:clusterY(k), x: x.scale()(d[k]), width:x.scale()(d[k]), height:clusterY.rangeBand(k)})}
        )

        _merge(cluster).first({y:options.height + barPaddingOld / 2 - barOuterPadding, height:y.scale().rangeBand()}).last({y:0, height:barOuterPaddingOld - barPaddingOld / 2})
        _mergeLayers(cluster[0].layers).first({y:0, height:0}).last({y:cluster[0].height, height:0})

        if not layers
          layers = @selectAll('.wk-chart-layer')

        layers = layers.data(cluster, (d) -> d.key)

        layers.enter().append('g')
          .attr('class', 'wk-chart-layer').call(_tooltip.tooltip)
          .attr('transform', (d)->
            null
            "translate(0, #{if initial then d.y else _merge.addedPred(d).y - barPaddingOld / 2}) scale(1,#{if initial then 1 else 0})")
          .style('opacity', if initial then 0 else 1)

        layers
          .transition().duration(options.duration)
            .attr('transform',(d) -> "translate(0,#{d.y}) scale(1,1)")
            .style('opacity', 1)

        layers.exit()
          .transition().duration(options.duration)
            .attr('transform',(d) -> "translate(0, #{_merge.deletedSucc(d).y + _merge.deletedSucc(d).height + barPadding / 2}) scale(1,0)")
            .remove()

        bars = layers.selectAll('.wk-chart-bar')
          .data(
            (d) -> d.layers
          , (d) -> d.layerKey + '|' + d.key
          )

        bars.enter().append('rect')
          .attr('class', 'wk-chart-bar wk-chart-selectable')
          .attr('y', (d) -> if initial then d.y else _mergeLayers.addedPred(d).y + _mergeLayers.addedPred(d).height)
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
        barPaddingOld = barPadding
        barOuterPaddingOld = barOuterPadding

      drawBrush = (axis, idxRange) ->
        clusterY.rangeBands([0,axis.scale().rangeBand()], 0, 0)
        height = clusterY.rangeBand()
        layers
          .attr('transform',(d) -> "translate(0, #{if (y = axis.scale()(d.key)) >= 0 then y else -1000})")
          .selectAll('.wk-chart-bar')
            .attr('height', height)
            .attr('y', (d) -> clusterY(d.layerKey))

      #-------------------------------------------------------------------------------------------------------------------

      host.lifeCycle().on 'configure', ->
        _scaleList = @getScales(['x', 'y', 'color'])
        @getKind('x').domainCalc('max').resetOnNewData(true)
        @getKind('y').resetOnNewData(true).rangePadding(config).scaleType('ordinal')
        @layerScale('color')
        _tooltip = host.behavior().tooltip
        _tooltip.on "enter.#{_id}", ttEnter

      host.lifeCycle().on 'drawChart', draw
      host.lifeCycle().on 'brushDraw', drawBrush

      ###*
        @ngdoc attr
        @name barClustered#padding
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
        _scaleList.y.rangePadding(config)
        host.lifeCycle().update()
  }

