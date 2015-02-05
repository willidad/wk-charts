Defects

Applying a brush does not work under certain conditions:
    - an entry / exit animation has removed / added entries on the key scale

Line charts show orphan lines att he chart border after moving elements out of the chart area

Elements moving in their position in the data cause an exception in d3

scatter chart shows no color on shapes when brush is enabled (probably CSS problem, verify)

Fix: column chart does not show tooltip correctly

Fix: e3c73d9 bar chart does not show tooltip category color correctly

enter / exit animations on reverse charts do not work correctly
    -> animate to/from wrong target

Fix: 5566ae7 Tooltip markers on stacked area charts are not correctly positioned

Fix: 1554895 Tooltip markers do not snap to data values anymore

Tooltip on non-zero stacked area chart positions markers wrong

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




