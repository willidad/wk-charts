angular.module('wk.chart')
.run(['$templateCache', function($templateCache) {
  return $templateCache.put('app/templates/legend.jade', [
'',
'<div ng-style="position" ng-show="showLegend" class="d3ChartColorLegend">',
'  <div ng-show="title" class="legend-title">{{title}}</div>',
'  <ul class="list-unstyled">',
'    <li ng-repeat="legendRow in legendRows track by legendRow.value" class="d3ChartColorLegendItem"><span ng-if="legendRow.color" ng-style="legendRow.color">&nbsp;&nbsp;&nbsp;</span>',
'      <svg-icon ng-if="legendRow.path" path="legendRow.path" width="20"></svg-icon>&nbsp;{{legendRow.value}}',
'    </li>',
'  </ul>',
'</div>',''].join("\n"));
}])
.run(['$templateCache', function($templateCache) {
  return $templateCache.put('app/templates/toolTip.jade', [
'',
'<div ng-show="ttShow" ng-style="position" class="d3ChartsToolTip">',
'  <table class="table table-condensed table-bordered">',
'    <thead ng-show="headerValue">',
'      <tr>',
'        <th colspan="2">{{headerName}}</th>',
'        <th>{{headerValue}}</th>',
'      </tr>',
'    </thead>',
'    <tbody>',
'      <tr ng-repeat="ttRow in layers">',
'        <td ng-style="ttRow.color" ng-class="ttRow.class">',
'          <svg-icon ng-if="ttRow.path" path="ttRow.path" width="15"></svg-icon>',
'        </td>',
'        <td>{{ttRow.name}}</td>',
'        <td>{{ttRow.value}}</td>',
'      </tr>',
'    </tbody>',
'  </table>',
'</div>',''].join("\n"));
}]);
