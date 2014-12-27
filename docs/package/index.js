var Package = require('dgeni').Package;

module.exports = new Package('dgeni', ['jsdoc'])
    .processor(require('./processors/assignAttrs'))
    .factory(require('./services/extractDimension'))

.config(function(parseTagsProcessor, getInjectables) {
  parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(
    getInjectables([
      require('./tags/usedBy'),
      require('./tags/usesDimension'),
      require('./tags/values')
    ]));
});