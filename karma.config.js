// karma.conf.js
module.exports = function(config) {
    config.set({
        //basePath: './',
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/lodash/dist/lodash.js',
            'bower_components/d3/d3.js',
            './../wk-charts-build/lib/wk-charts.js',
            'app/reflection/tests/*.js'
        ],
        reporters:['progress', 'coverage'],
        //preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            //'**/src/*.coffee': ['coffee', 'coverage']
        //},
        singleRun:true,
        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        }

        //...
    });
};
