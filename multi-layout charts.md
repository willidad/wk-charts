The discussion today leads to some interesting ideas how to restructure the internals and external interface of wk-charts

###Background

The current design of wk-charts is based on the idea that someone wants to draw e.g. a line chart, and to do so he defined x, y axes and a coloring scheme.
This definition is encapsulated inside the layout markup. Thus, he will write something like this (in Jade):

    chart(data="data")
        layout(line)
            x(axis, ticks="10", ... , property="a", type="time")
            y(axis, property="a,b,c", type="linear")
            color()
This is contained in a chart block, which, for simple charts, is redundant (resp. the layout directive is redundant, depending ont he viewpoint)
In case one wants to draw several layouts in a single container this can be done by attaching several layout blocks inside the chart containter:

    chart(data="data")
        layout(line)
            x(..)
            y(..)
            color(..)
        layout(area)
            x(..)
            y(..)
            color(..)
In this form the charts share the source data and the drawing container, thus two independent chart based ont he same data are drawn
The charts can share dimension in the following form

    chart(data="data")
        x(..)
        color(..)
        layout(line)
            y(..)
        layout(area)
            y(..)
The scale is only setup once and propagated nto the layout. this ensures that colors are shared between charts that brushing is applied to both charts automatically, etc,
While this works well, three are a few limitations there:

- since the two y-definitions are not connected domain ranges are calculated independently and may lead to undesirable mappings. Ths can be prevented by explicit defining the same
domain range values for both y dimensions, however ths is not always easy and natural to do.
- On tooltips an legends this may lead to name ambiguities. Esp. custom tooltips are presented with s somewhat confusing interface as result of this

###Todays discussion

Today's discussion suggests that we should implement a 'reverse' approach. For the use case it makes sense to assign a separate layout to each individual property or set of properties
(for stacked charts or rang charts an explicit property list is requires to make these function)

Thus, the dimension specification contains the layout definition, and, instead of inheriting shared dimension definitions into the layout, the layout is the shared and inherited element. Defining a layout at the chart level is a conveniance rather than an architecutral
 imperative, like it is today.

The example above would be written like this:

    chart(data="data")
            x(..)
            color(..)
            layout(line)
                y(..)
            layout(area)
                y(..)
A chart that uses a left and a right y-axis would look like this:

    chart(data="data")
            x(..)
            color(..)
            y(axis="left" ... )
                line(property="abc")
            y(axis="right" ... )
                stacked-column(property="d,e,f")
For a simple chart it could be written like:

    chart(data="data", line)
        x(property="abc")
        y()
        color()
In this case the line layout definition will be inherited to the child directives as required.

A pie chart, which does not have a natural x or y dimension could be defined like this:

    chart(data="data", pie)
        color(property="a")
        size(property="b")

a hierarchical pie chart (not implemented yet - and not sure if ever implemented) could be described like this:

    chart(data="data")
        color(property="a")
        size(property="b", donat)
            size(property="c", pie)

Implementing such an approach has quite a number of positive side effects:

- it makes it pretty intuitive to define charts that combine different layouts
- the layout directive as a pure syntax container would go away. It has been introduces to seal with the idiosyncrasies of angular directive scoping, and has limited semantic value
- the


Implementation Steps:

- refactor the dimension directives (and internal structures) into three independent pieces:
    - axis, holding all attributes that relate to the drawing of axis (ticks, tickFormat, axis position, ...)
    - scale type, holding the scale mapping related attributes (type, domain, range, domainRange, exponent, ...)
    - property, holding the property specific definition (name, inputFormat, outputFormat, ...)
    axis and scale type will be decorators on the dimension directives(x,y,color,size,shape), property will be a decorator or a stand a element itself
    layout directives (area, line,,,) will be decorators on chart and on specific properties, driven by the semantics of the layout
- remove the layout directive, as it adds no more value
- implement a new dimension object, which is the data container for the refactored pieces and manages the inheritance
- the layout code should not be too impacted, as it needs to ge the minimally necessary information, independent of the inheritance model. The lifecycle feeding the layouts need to change however.

