exports.config =
    modules:
        definition: false
        wrapper: false
    paths:
        #'public': '../cpm4/frontend/src/main/webapp/vendor/wk-charts'
        'public': '../wk-charts-build/lib'
        'watched': [ 'app', 'wk.chart' ]
    files:
        javascripts:
            joinTo:
                'js/vendor.js': /^bower_components|^vendor/
                'js/wk.chart.js': /^app/
            order:
                before: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/angular/angular.js'
                ]

        stylesheets:
            joinTo: 'css/wk-charts.css'
        templates:
            joinTo:
                'js/dontUseMe' : /^wk.chart/ # dirty hack for Jade compiling.
    plugins:
        jade:
            pretty: yes # Adds pretty-indentation whitespaces to output (false by default)
        jade_angular:
            locals: {}
        #jshint:
        #    pattern: /^app\/.*.js$/
        #    reporter: 'jshint-stylish'
        #    warnOnly: true
        uglify:
            mangle: false
            compress:
                global_defs:
                    DEBUG: false
        autoReload:
            enabled: false
            delay: 1000
        sass:
            mode: 'native' # 'ruby' / 'native'
            options: ['--compass']
        autoprefixer:
            browsers: ["last 1 version", "ie 9", "ie 10"]
            cascade: false
    minify: true