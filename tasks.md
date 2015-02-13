Defects

Applying a brush does not work under certain conditions:
    - an entry / exit animation has removed / added entries on the key scale

fix: 79cd6ee Line charts show orphan lines att he chart border after moving elements out of the chart area

Fix: Elements moving in their position in the data cause an exception in d3

Fix: scatter chart shows no color on shapes when brush is enabled (probably CSS problem, verify)

Fix: column chart does not show tooltip correctly

Fix: e3c73d9 bar chart does not show tooltip category color correctly

enter / exit animations on reverse charts do not work correctly
    -> animate to/from wrong target

Fix: 5566ae7 Tooltip markers on stacked area charts are not correctly positioned

Fix: 1554895 Tooltip markers do not snap to data values anymore

Tooltip on non-zero stacked area chart positions markers wrong

Fix: acecfab Tooltip range-area, area, line does not display left-most value (range-area Monatl. Temperatur)

Fix: 19bce28 tooltips cause page to jump - tt reaches outside the viewport and causes scroll bar to appear

Fix: browser crashes if interval is too small limit interval to some reasonable number

TODO

change charts to new animation method

- barClustered
Done:  - columnChart
- columnClustered
- pie
- spider

Finish removal of range dimension
- rewrite histogram 

Verify animation change impact on bubble and Scatter charts
- new method does not add value, just complicates things there

Implemented: c711c07 Spline interpolation for line and area charts : layout attribute `spline`
Implemented: 3d981ee Rotate tick labels on y axis : axis attribute `rotate-tick-labels`
Implemented: 3d981ee Switch text direction of tick labels instead of drawing them into the chart area
Implemented: 5b20512 Enable grid lines styling via style object: axis attribute `grid-style`
Implemented: da6dcda Chart area background color and borders: chart attribute `background-style`
Implemented: 2a19af0 Legends style object: legend attribute `legend-style`
Implemented: 6532898 tooltips style object: tooltips attribute `tooltip-style`
Implemented: f848d7b Allow to specify just domain minimum or domain maximum: dimension attributes `domain-min`, `domain-max`
Implemented: 715faff Allow to specify a tick interval: axis attribute `tick-interval`. See docu pages for how to specify the interval for time scales
enable to show marker line independent of tooltips in line and area chart
separate axis definition from dimension property to allow axis and domain sharing between layouts while allowing separate properties for each layout
