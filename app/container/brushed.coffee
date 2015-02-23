###*
  @ngdoc behavior
  @name brushed
  @module wk.chart
  @restrict A
  @description

  enables an axis to be scaled by a named brush in a different layout


###
angular.module('wk.chart').directive 'brushed', ($log,selectionSharing, timing) ->
  sBrushedCnt = 0
  return {
    restrict: 'A'
    require: ['^chart', '?^layout', '?x', '?y', '?rangeX', '?rangeY']
    link: (scope, element, attrs, controllers) ->
      $log.log 'brushed-scope', scope.$id
      _id = sBrushedCnt++
      chart = controllers[0].me
      layout = controllers[1]?.me
      x = controllers[2]?.me
      y = controllers[3]?.me
      rangeX = controllers[4]?.me
      rangeY = controllers[5]?.me

      axis = x or y or rangeX or rangeY
      _brushGroup = undefined

      brusher = (extent, idxRange) ->
        #timing.start("brusher#{axis.id()}")
        if not axis then return
        #axis
        if extent.length > 0
          axis.domain(extent).scale().domain(extent)
        else
          # reset domain to initial state
          axis.domain(undefined)
          axis.scale().domain(axis.getDomain(chart.getData()))
          if axis.isOrdinal()
            idxRange = [0, axis.scale().domain().length - 1]

        for l in chart.layouts() when l.scales().getKind(axis.kind()).id() is axis.id()  #need to do it this way to ensure the right axis is chosen in case of several layouts w. different axis  in a container
          l.lifeCycle().brush(axis, true, idxRange) #no animation
        #timing.stop("brusher#{axis.id()}")

      attrs.$observe 'brushed', (val) ->
        if _.isString(val) and val.length > 0
          _brushGroup = val
          selectionSharing.register _brushGroup, brusher
        else
          _brushGroup = undefined

      chart.lifeCycle().on "destroy.#{_id}", () ->
        selectionSharing.unregister _brushGroup, brusher
        chart.lifeCycle().on ".#{_id}", null

  }