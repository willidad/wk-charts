var path = require('canonical-path');
var Package = require('dgeni').Package;

module.exports = new Package('dgeniDocsPackage', [
    require('dgeni-packages/ngdoc'),
    require('dgeni-packages/jsdoc'),
    require('./package'),
    require('dgeni-packages/nunjucks')
])

    .config(function(log, readFilesProcessor, writeFilesProcessor, templateFinder, debugDumpProcessor) {

        log.level = 'info';

        readFilesProcessor.basePath = path.resolve(__dirname, '..');

        readFilesProcessor.sourceFiles = [
            { include: 'dist/lib/**/*.js', basePath:'/'},
            { include: 'docs/guide/**/*.ngdoc', basePath:'/'}
        ];
        writeFilesProcessor.outputFolder = 'dist/docs';

        templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));
        //templateFinder.templatePatterns.unshift('common.template.html');
    })
    .config(function(computePathsProcessor, computeIdsProcessor) {
        computePathsProcessor.pathTemplates.push({
            docTypes: ['provider', 'service', 'directive', 'input', 'object', 'function', 'filter', 'type' ],
            pathTemplate: '/${docType}/${name}',
            outputPathTemplate: '${docType}/${name}.html'
        });
        computePathsProcessor.pathTemplates.push({
            docTypes: ['module' ],
            pathTemplate: '/',
            outputPathTemplate: 'index.html'
        });
        computePathsProcessor.pathTemplates.push({
            docTypes: ['componentGroup' ],
            pathTemplate: '/${groupType}',
            outputPathTemplate: '${groupType}/index.html'
        });
        computePathsProcessor.pathTemplates.push({
            docTypes: ['dimension', 'container', 'behavior', 'layout'],
            pathTemplate: '/${docType}/${name}',
            outputPathTemplate: '${docType}/${name}.html'
        });
        computePathsProcessor.pathTemplates.push({
            docTypes: ['guide'],
            pathTemplate: '/${docType}/${name}',
            outputPathTemplate: '${docType}/${name}.html'
        });
        computeIdsProcessor.idTemplates.push({
            docTypes: ['dimension', 'container', 'behavior', 'layout', 'attrs'],
            getId: function(doc) {
                return doc.name;
            },
            getAliases: function(doc) { return [doc.id]; }
        });
        computeIdsProcessor.idTemplates.push({
            docTypes: ['guide'],
            getId: function(doc) {
                return doc.docType + '/' + doc.name;
            },
            getAliases: function(doc) { return [doc.id]; }
        });
    });