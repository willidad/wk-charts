d3 = require('d3')
fs = require('fs')

catRangeColors = d3.scale.category20().range();
out = ''
for color in catRangeColors
  out += "linearGradient(id=\"lgrad-#{color.replace('#','')}\" x1=\"0%\" y1=\"100%\" x2=\"100%\" y2=\"0%\")\n
  stop(offset=\"0%\" style=\"stop-color:#{d3.rgb(color)};stop-opacity:1\")\n
  stop(offset=\"100%\" style=\"stop-color:#{d3.rgb(color).darker()};stop-opacity:1\")\n\n"
  out += "radialGradient(id=\"rgrad-#{color.replace('#','')}\" cx=\"50%\" cy=\"50%\" r=\"75%\")\n
  stop(offset=\"0%\" style=\"stop-color:#{d3.rgb(color)};stop-opacity:1\")\n
  stop(offset=\"100%\" style=\"stop-color:#{d3.rgb(color).darker()};stop-opacity:1\")\n
"

fs.writeFile('gradients.jade', out, (err) ->
  if err then return console.log(err)
  console.log('Gradients.jade created')
)