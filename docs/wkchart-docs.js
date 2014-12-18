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
            { include: 'docs/content/**/*.ngdoc', basePath:'/'}
        ];
        writeFilesProcessor.outputFolder = 'docs/build';

        templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));
        //templateFinder.templatePatterns.unshift('common.template.html');
    })
    .config(function(computePathsProcessor, computeIdsProcessor) {
        computePathsProcessor.pathTemplates.push({
            docTypes: ['provider', 'service', 'directive', 'input', 'object', 'function', 'filter', 'type' ],
            pathTemplate: '/${area}/${module}/${docType}/${name}',
            outputPathTemplate: 'partials/${area}/${module}/${docType}/${name}.html'
        });
        computePathsProcessor.pathTemplates.push({
            docTypes: ['module' ],
            pathTemplate: '/${area}/${name}',
            outputPathTemplate: 'partials/${area}/${name}/index.html'
        });
        computePathsProcessor.pathTemplates.push({
            docTypes: ['componentGroup' ],
            pathTemplate: '/${area}/${moduleName}/${groupType}',
            outputPathTemplate: 'partials/${area}/${moduleName}/${groupType}/index.html'
        })
        computePathsProcessor.pathTemplates.push({
            docTypes: ['dimension', 'container', 'behavior', 'layout'],
            pathTemplate: '/${docType}/${name}',
            outputPathTemplate: 'partials/${docType}/${name}.html'
        })
        computePathsProcessor.pathTemplates.push({
            docTypes: ['content', 'sharedParams'],
            pathTemplate: '/${docType}/${name}',
            outputPathTemplate: 'partials/${docType}/${name}.html'
        })
        computeIdsProcessor.idTemplates.push({
            docTypes: ['dimension', 'container', 'behavior', 'layout', 'attrs'],
            getId: function(doc) {
                return doc.name;
            },
            getAliases: function(doc) { return [doc.id]; }
        });
        computeIdsProcessor.idTemplates.push({
            docTypes: ['content', 'sharedParams'],
            getId: function(doc) {
                return doc.docType + '/' + doc.name;
            },
            getAliases: function(doc) { return [doc.id]; }
        });
    });