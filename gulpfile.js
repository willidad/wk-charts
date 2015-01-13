var gulp            = require('gulp');
var Dgeni           = require('dgeni');
var del             = require('del');
var runSequence     = require('run-sequence');
var es              = require('event-stream');
var coffee          = require('gulp-coffee');
var sourcemaps      = require('gulp-sourcemaps');
var concat          = require('gulp-concat');
var tplCache        = require('gulp-angular-templatecache');
var jade            = require('gulp-jade');
var plumber         = require('gulp-plumber');
var notify          = require('gulp-notify');
var annotate        = require('gulp-ng-annotate');
var uglify          = require('gulp-uglify');
var minifycss       = require('gulp-minify-css');
var minifyhtml      = require('gulp-minify-html');
var gzip            = require('gulp-gzip');


function errorAlert(error){
  notify.onError({title: "Gulp Error", message: "<%= error.message %>", sound: "Sosumi"})(error);
  console.log(error.toString());
  this.emit("end");
}

var buildDir = './dist';

gulp.task('wkChartsDoc', function() {
  try {
    var dgeni = new Dgeni([require('./docs/wkchart-docs')]);
    return dgeni.generate();
  } catch(x) {
    console.log(x.stack);
    throw x;
  }
});

gulp.task('clean', function(done) {
  del([buildDir], done);
});

gulp.task('rebuild', function () {
    runSequence('wkChartsJs', 'wkChartsCss','wkChartsDoc')
})

gulp.task('watch', function() {
    gulp.watch(['docs/**/*.ngdoc'], ['wkChartsDoc', 'wkChartsDocCss']);
    gulp.watch(['app/**/*.js','app/**/*.coffee','app/**/*.jade'], ['rebuild']);
    gulp.watch(['app/**/*.css'], ['wkChartsCss']);
});

gulp.task('wkChartsDocCss', function() {
  return gulp.src('./docs/css/**/*.css')
      .pipe(gulp.dest('./dist/docs/css'));
});

gulp.task('default', function(cb) {
  runSequence('clean', 'wkChartsJs', 'wkChartsCss', 'wkChartsDoc', 'wkChartsDocCss',   cb);
});

gulp.task('wkChartsJs', function() {
  // compile an concatenate wk-charts library:
  //   Coffeescript
  var csJs = gulp.src('./app/**/*.coffee',{base:'/'})
      .pipe(plumber({errorHandler: errorAlert}))
      .pipe(sourcemaps.init())
      .pipe(coffee({bare:true, doctype:'html'}));

  // Jade templates
  var templ = gulp.src('./app/**/*.jade')
      .pipe(plumber({errorHandler: errorAlert}))
      .pipe(jade({pretty:true, doctype:'html'}))
      .pipe(tplCache({module:'wk.chart'}));

  // Javascript components
  var js = gulp.src('./app/**/*.js',{base:'/'})
      .pipe(plumber({errorHandler: errorAlert}))
      .pipe(sourcemaps.init());

  return es.merge(csJs, js, templ)
      .pipe(concat('wk-charts.js'))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(buildDir + '/lib'))
});

gulp.task('wkChartsCss', function() {
    // watch wk-charts project for changes
    return gulp.src('./app/**/*.css',{base:'./'})
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(concat('wk-charts.css'))
        .pipe(gulp.dest(buildDir + '/lib'))
});

gulp.task('prodClean', function(done) {
    del(['./prod/'], done);
});

gulp.task('prodJs', function() {
    var csJs = gulp.src('./app/**/*.coffee',{base:'/'})
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(coffee({bare:true, doctype:'html'}));

    // Jade templates
    var templ = gulp.src('./app/**/*.jade')
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(jade({pretty:true, doctype:'html'}))
        .pipe(tplCache({module:'wk.chart'}));

    // Javascript components
    var js = gulp.src('./app/**/*.js',{base:'/'})
        .pipe(plumber({errorHandler: errorAlert}))

    return es.merge(csJs, js, templ)
        .pipe(concat('wk-charts.js'))
        .pipe(annotate())
        .pipe(uglify())
        .pipe(gulp.dest('./prod/lib'))
});

gulp.task('prodCss', function() {
    // watch wk-charts project for changes
    return gulp.src('./app/**/*.css',{base:'./'})
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(concat('wk-charts.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./prod/lib'))
});

gulp.task('prodDocCss', function() {
    return gulp.src(buildDir + '/docs/**/*.css',{base:buildDir + '/docs'})
        .pipe(minifycss())
        .pipe(gulp.dest('./prod/lib/docs'))

})

gulp.task('prodDocs', function() {
    return gulp.src(buildDir + '/docs/**/*.html',{base:buildDir})
        .pipe(minifyhtml())
        .pipe(gulp.dest('./prod/lib'))
});

gulp.task('prodBuild', function(cb) {
    runSequence('prodClean', ['prodJs', 'prodCss', 'prodDocs', 'prodDocCss'],cb)
});