Defects

Tooltips does not honor pie-style (probably true for all layout styles)
Layout padding on shared axis does not work. Padding for 2nd axis is used by default, padding for 1st axis is ignored. (column overlayed shared axis)
Brushing for all bar / column charts: any data update positions all bars/columns outside of brush window at pos 0 (NaN)
Brushing for all bar / column charts: removing a element in the brushing area removes rects, but not axis entry 
Brush all charts: Adding /deleting entries does not adjust brush overlay to reflect brush window

BoxPlot reverse axis: Animation starts / ends at wrong position
BoxPlot ordinalPadding: delete last animates tp wrong position

Fixed
-----

Fix: 79cd6ee Line charts show orphan lines att he chart border after moving elements out of the chart area
Fix: various Elements moving in their position in the data cause an exception in d3
Fix: ??????? scatter chart shows no color on shapes when brush is enabled (probably CSS problem, verify)
Fix: ??????? column chart does not show tooltip correctly
Fix: e3c73d9 bar chart does not show tooltip category color correctly
Fix: 5566ae7 Tooltip markers on stacked area charts are not correctly positioned
Fix: 1554895 Tooltip markers do not snap to data values anymore
Fix: acecfab Tooltip range-area, area, line does not display left-most value (range-area Monatl. Temperatur)
Fix: 19bce28 tooltips cause page to jump - tt reaches outside the viewport and causes scroll bar to appear
Fix: browser crashes if interval is too small limit interval to some reasonable number
Fix: d57a198 adjust grid when tickInterval is specified
Fix: c57e2f8 Domain not set correctly for y in case y right is specified
Fix: a67d0da Chart is not updated on data change
Fix: 5218efb bar and column chart enter/exit animations wrong
Fix: 10629bf bar and column: bar switched color on exit animation
Fix: fb2ccda stacked bar / column x enter animation wrong
Fix: eb00f0e clustered bar category enter animations wrong
Fix: eb00f0e clustered bar shuffle animation wrong
Fix: 08a60d9 range Bars/Columns shuffle wrong
Fix: 0ab4151 ColumnCluster various, finalize change to new animation method
Fix: 78b8566 Area Stacked markers ordinal: Marker offset after brushing incorrect
Fix: 78b8566 Area Stacked Vertical Brushed: Markers do not move when brushed
Fix: 78b8566 Area Stacked Vertical Brushed silhouette: Markers do not mve when brushed
Fix: ce47c91 Bar Clustered Brushed Padding no bars shown when brushing
Fix: ce47c91 Column Clustered Brushed Padding no bars shown when brushing
Fix: 4a9f6ab Bar w Reverse Y Axis Legend: enter / exit animations start / end at wrong target enter / exit animations on reverse charts do not work correctly                                                                                                  -> animate to/from wrong target
Fix: 66577ab Bar Axis New: looks like enter / exit animations do not honor paddings / charts w global key axis ignore padding definition
Fix: d02ee2b Custom Template does not work
Fix: 2114aba Line Ordinal Marker Bug: Line does not interpolate correctly when exit
Fix: 501f813 line vertical does not show markers with time scale (non-ordinal scale)
Fix: 8a8b59b data markers are cut at chart borders
Fix: 939319d tooltip w mixed format charts(line and column): tooltip box position jumps up and down when cursor moves over column borders
Fix: cd7692d Tooltips: Does not show values from column / bar charts if mixed w. line/area
Fix: a481674 Tab 'Applying brush to chart' does not work
Fix: a481674 Tab 'Brushing Multiple Charts' does not brush upper chart (lower chart is brushed)
Fix: b21cd9e Brush on global axis does not work 'Controller layout required by directive brush not found'
Fix: 137850b leaking tooltip scopes and tooltip and brush event handlers
Fix: 8d7f490 Tooltips for chart with layer property do not display value correctly ('Brushing Multiple Charts' tab)
Fix: 8d7f490 Tooltip does not display for charts with shape dimension
Fix: 8d7f490 Pie/donat, spider,scatter, bubble charts do not display tooltips
Fix: dd15d68 (and several other commits) remove memory leaks and dangling objects and scopes. Also resolves:
    More general: area and line charts produce path errors when path contains only one data point. Summarizes
    - area markers brushed ordinal produces d3 invalid path errors when brush area contains only a single data point (displays correctly through)
    - line markers brushed ordinal produces d3 invalid path errors when brush area contains only a single data point (displays correctly through)
Fix: ca424f5 line w time scale u markers brushed: if empty brush selection shows many marker bubbles at left axis (for all area and line charts with non-ordinal scales)
Fix: f843b1f Brush from a reverse axis does not work correctly
Fix: a885fa2 barClustered wrong animation start
Fix: 44d3a06 label text accumulates when property changes
Fix: aa4565d tooltip marker circles cut at edge of chart area
Fix: 8c71885 set drawpadding to 0
Fix: 56206e3 Selection does not work for boxplot
Fix: mapFunction attribute not available in color scale
Fix: 07aa217 Line with ordinal scale and makers: line is offset from data point (Brushing -> Axis Brushing)


Features Implemented
--------------------

Implemented: c711c07 Spline interpolation for line and area charts : layout attribute `spline`
Implemented: 3d981ee Rotate tick labels on y axis : axis attribute `rotate-tick-labels`
Implemented: 3d981ee Switch text direction of tick labels instead of drawing them into the chart area
Implemented: 5b20512 Enable grid lines styling via style object: axis attribute `grid-style`
Implemented: da6dcda Chart area background color and borders: chart attribute `background-style`
Implemented: 2a19af0 Legends style object: legend attribute `legend-style`
Implemented: 6532898 tooltips style object: tooltips attribute `tooltip-style`
Implemented: f848d7b Allow to specify just domain minimum or domain maximum: dimension attributes `domain-min`, `domain-max`
Implemented: 715faff Allow to specify a tick interval: axis attribute `tick-interval`. See docu pages for how to specify the interval for time scales
Implemented: d49f70b separate axis definition from dimension property to allow axis and domain sharing between layouts while allowing separate properties for each layout
Implemented: e06442a enable line chart line styling (dashed lines)
Implemented: 4f14cf2 Patterns for line, bar, column and range(bar/column) charts
Implemented: a9bc925 Patterns for pie, range area charts
Implemented: 5bf50bc Box Chart
Implemented: 06b52be explicit styling for all charts, support for gradients, masks, and SVG element supported style properties.
Implemented: 9c77be8 separate left / right padding for all bar and column charts to allow flexible positioning of multiple layouts.

Open
----
More General: Legends on dual axis does not work as expected
- Line Scale Bug: Legend does not display correct list (only from left axis) Is this a bug or a feature ????
- if legend defined for both, left and right y axis, only one is displayed

Area Stacked Vertical Brushed silhouette: Tooltip markers are not positioned correctly
Dup: Tooltip on non-zero stacked area chart positions markers wrong

More general: Brush does not re-evaluate brush selection after a data update. Should either clear selection or re-position brush to the old range points on new data
- Line / area charts w ordinal scales: brush selection corrupted after data update
- Line / area charts w time scale: brush selection not updated after data change

More General: Tooltip and brush combined event handling does not work as desired
- Tooltips / Brush: Tooltips are not shown when brush extend covers an item
- Brush: when mousedown over an object, crosshair cursor is displayed but brush extent dragging is not triggered
- Brush: when mousedown over brushExtent crosshair cursor is displayed (should be move cursor) - draggs correctly though

Browser Zooming does not resize chart
Responsive pages (css @media based resizing) does not always trigger chart resize




TODO / Features
---------------

change charts to new animation method

- pie
- spider

Finish removal of range dimension
- rewrite histogram

Verify animation change impact on bubble and Scatter charts
- new method does not add value, just complicates things there

enable to show marker line independent of tooltips in line and area chart

clickable axis labels for edit mode
clickable line overlay in linecharts for edit mode
invert brush area visual appearance (selected area should be transparent, non-selected greyed out)
extent brush overlay into axis 
brush handle tooltips showing exact border values. 