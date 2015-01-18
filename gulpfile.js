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
var gulpif          = require('gulp-if');
var annotate        = require('gulp-ng-annotate');
var uglify          = require('gulp-uglify');
var minifycss       = require('gulp-minify-css');
var minifyhtml      = require('gulp-minify-html');
var path         = require('path');

var prod = true;

var buildDir = './../wk-charts-build';

function errorAlert(error){
  notify.onError({title: "Gulp Error", message: "<%= error.message %>", sound: "Sosumi"})(error);
  console.log(error.toString());
  this.emit("end");
}

gulp.task('clean', function(done) {
    del([buildDir],{force:true}, done);
});

gulp.task('wkChartsDoc', function() {
  try {
    var dgeni = new Dgeni([require('./docs/wkchart-docs')]);
    return dgeni.generate();
  } catch(x) {
    console.log(x.stack);
    throw x;
  }
});

gulp.task('wkChartsDocCss', function() {
  return gulp.src('./docs/css/**/*.css')
      .pipe(gulpif(prod, minifycss()))
      .pipe(gulp.dest(buildDir + '/docs/css'))
      .pipe(notify({onLast:true, message:'Charts Doc build complete'}));
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

  //merge things together
  return es.merge(csJs, js, templ)
      .pipe(concat('wk-charts.js'))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(buildDir + '/lib'))
      .pipe(notify({onLast:true, message:'Charts Js build complete'}))
});

gulp.task('wkChartsJsProduction', function() {
    // compile an concatenate wk-charts library:
    //   Coffeescript
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

    //merge things together
    return es.merge(csJs, js, templ)
        .pipe(concat('wk-charts.min.js'))
        .pipe(annotate())
        .pipe(uglify())
        .pipe(gulp.dest(buildDir + '/lib'))
        .pipe(notify({onLast:true, message:'Charts Js Production build complete'}))
});

gulp.task('wkChartsCss', function() {
    // watch wk-charts project for changes
    return gulp.src('./app/**/*.css',{base:'./'})
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(sourcemaps.init())
        .pipe(concat('wk-charts.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(buildDir + '/lib'))
        .pipe(notify({onLast:true, message:'Charts CSS build complete'}))
});

gulp.task('wkChartsCssProduction', function() {
    // watch wk-charts project for changes
    return gulp.src('./app/**/*.css',{base:'./'})
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(concat('wk-charts.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(buildDir + '/lib'))
        .pipe(notify({onLast:true, message:'Charts CSS Production build complete'}))
});

gulp.task('buildProduction', ['wkChartsJsProduction', 'wkChartsCssProduction']);

gulp.task('default', function(cb) {
    runSequence('clean', 'wkChartsJs', 'wkChartsCss', 'wkChartsDoc', 'wkChartsDocCss', 'buildProduction',  cb);
});

gulp.task('buildDocs', function(cb) {
    runSequence('wkChartsDoc', 'wkChartsDocCss', cb)
});

gulp.task('rebuild', function(cb) {
    runSequence('wkChartsJs', 'wkChartsDoc', 'wkChartsDocCss',  cb);
});

gulp.task('watch', function() {
    gulp.watch(['docs/**/*.ngdoc', path.join(buildDir, '/lib/*.js')], ['buildDocs']);
    gulp.watch(['app/**/*.js','app/**/*.coffee','app/**/*.jade'], ['wkChartsJs']);
    gulp.watch(['app/**/*.css'], ['wkChartsCss']);
});