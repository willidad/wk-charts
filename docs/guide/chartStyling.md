@ngdoc guide
@module guide
@name Styling Charts
@description

# Styling Charts #

wk-charts provides various options to determine the style of the chart components, globally, per chart as well as per rendered element in the chart

## Global Styling ##

All graphical elements in wk-charts can be styled via css. Each type of element has a CSS Selector, thus a style for the element can be defined in a stylesheet.
These styles can be set globally, or, by setting an id or class property at the chart level, styles an be applied to to individual charts or groups or charts using the standard CSS selector techniques.
> The opacity attribute should not be set. It is used form ost elements to control the entry / exit animations. Setting Opacity via style attributes will lead to unpredictable results.
Opacity settings in stylesheets will be overwritten unless they are marked as . Do not use `!important` with opacity.

### Identifying an styled element ###

The css-selectors for the individual graphical elements are documented TBD, resp can be determined using the browsers style inspector tools

# Chart specific style attributes #

Beyond styling per css, certain elements can be styled by setting style attributes in the chart, layout or dimension definitions. Each of these attributes takes a style object in the form `{property:value}`. Supported properties
depend on the styled element. The following style attributes are implemented currently:


| chart type | property | (meaningful) style properties |
| -- | -- | -- |
| line, line-vertical | line-style | stroke-width, stroke-dasharray |
| area, area-vertical, area-stacked, area-stacked-vertical, range-area, range-area-vertical | area-style | mask, stroke-width |
| bars, range-bars | label-style | font attributes |
| | bars-style | mask, stroke-width
| column, range-column | label-style | font-attributes |
| | column-style | mask, stroke-width
| bar-stacked, bar-clustered | bar-style | mask, stroke-width |
| column-stacked, column-clustered | column-style | mask, stroke-width |
| pie | label-style | font-attributes |
| | pie-style | mask, stroke-width

In support of the mask attribute a number of pattern urls are predefined:

- largeDots
- smallDots
- stripes

### opacity  ###
The opacity attribute should not be set. It is used form ost elements to control the entry / exit animations. Setting Opacity directly will lead to unpredictable results.
Opacity settings in stylesheets will be overwritten unless they are marked as `!important`. Do not use this with opacity.

# Color Styling #

The color of the objects is generally set using the color dimensions. There are several means ot determine the color used:
Automatically assign a color from a predefined color set based on data:

- type: category10, category20, category20b, category20c: predefined by d3
- type: ordinal, with color values defined in the range attributes
- type: customColor: list of application specific color values using a provider setting

the colors are assigned by sequence of arrival of unique data values. For an instance of a chart the colors remain stable, different chats can show different colors for the same value

- type: hashed
    - maps data values to a color using a standard hash algorithm. The list of colors is defined int eh range attribute.
    - Due to the hash algorithm, the color mapping is consistent across different charts.
- type: customCategoryHashed
    - as above, list of colors provided via application-wide provider setting

## customScale ##
In addition the color dimension implements a `customScale` type. This type accepts a callback function in the map-function attribute. The function gets the data value to be transformed into a color value. The
return value is used as color value

# Use Cases #
## Categorial Data ##
### automatic color mapping ###
The standard d3 categorial scales handle the color assignment automatically, however they do not guarantee a repeatable, predictable color assignment. While the assignment is deterministic, it depends on the arrival sequence of
data values, and will change if this sequence changes.
### repeatable automatic color mapping ###
The various has types implement a repeatable color mapping. The same value will always be mapped tot he same color, regardless of arrival sequence
### color values in data ###
In case the data contains the color value use the `identity` type. This scale does not do any mapping at all.

## Numeric Data ##
There are several ways to map numeric data to a color scheme:
### threshold based mapping ###
d3 has a threshold scale type that can be used. to set this up, use the `threshold` type , set the range to the target color, and provide a ordered list of threshold values in the domain attribute.
If the number of colors is n, the domain needs to provide n-1 threshold values.
### 'Bucket' based mapping ###
the d3 quantile and quantize scales implement 'bucketing' algoriths. Please see d3 docu for details on the algoriths.

## other ##
in case none of the available mechanisms fit use the `customScale` and provide a callback function. PLease note that this callback is called each time a color value is set during the rendering, so the function needs to be idempotent and efficient.


