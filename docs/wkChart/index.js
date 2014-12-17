var Package = require('dgeni').Package;

module.exports = new Package('dgeni', ['jsdoc'])
    .processor(require('./processors/assignParams'))

.config(function(parseTagsProcessor, getInjectables) {
  parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(
    getInjectables([
      require('./tags/paramUse')
    ]));
});