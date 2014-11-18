angular.module('wk.chart', [])

angular.module('wk.chart').constant 'd3OrdinalScales', [
  'ordinal'
  'category10'
  'category20'
  'category20b'
  'category20c'
]

angular.module('wk.chart').constant 'd3ChartMargins', {
  top: 10
  left: 50
  bottom: 40
  right: 20
  topBottomMargin:{axis:25, label:18}
  leftRightMargin:{axis:40, label:20}
  minMargin:8
  default:
    top: 8
    left:8
    bottom:8
    right:10
  axis:
    top:25
    bottom:25
    left:40
    right:40
  label:
    top:18
    bottom:18
    left:20
    right:20
}

angular.module('wk.chart').constant 'd3Shapes', [
  'circle',
  'cross',
  'triangle-down',
  'triangle-up',
  'square',
  'diamond'
]

angular.module('wk.chart').constant 'axisConfig', {
  labelFontSize: '1.6em'
  x:
    axisPositions: ['top', 'bottom']
    axisOffset: {bottom:'height'}
    axisPositionDefault: 'bottom'
    direction: 'horizontal'
    measure: 'width'
    labelPositions:['outside', 'inside']
    labelPositionDefault: 'outside'
    labelOffset:
      top: '1em'
      bottom: '-0.8em'
  y:
    axisPositions: ['left', 'right']
    axisOffset: {right:'width'}
    axisPositionDefault: 'left'
    direction: 'vertical'
    measure: 'height'
    labelPositions:['outside', 'inside']
    labelPositionDefault: 'outside'
    labelOffset:
      left: '1.2em'
      right: '1.2em'
}

angular.module('wk.chart').constant 'd3Animation', {
  duration:2000
}

angular.module('wk.chart').constant 'templateDir', 'templates/'

angular.module('wk.chart').constant 'formatDefaults', {
  date: '%d.%m.%Y'
  number :  ',.2f'
}

angular.module('wk.chart').constant 'barConfig', {
  padding: 0.1
}

