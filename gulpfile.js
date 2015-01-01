var gulp = require('gulp');
var Dgeni = require('dgeni');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('dgeni', function() {
  try {
    var dgeni = new Dgeni([require('./docs/wkchart-docs')]);
    return dgeni.generate();
  } catch(x) {
    console.log(x.stack);
    throw x;
  }
});

gulp.task('clean', function(done) {
  del(['./dist/docs'], done);
});

gulp.task('watch', ['default'], function() {
  return gulp.watch(['docs/**/*', 'dist/lib/**/*'], ['default']);
});

gulp.task('css', function() {
  return gulp.src('./docs/css/**/*.css').pipe(gulp.dest('./dist/docs/css'));
})

gulp.task('default', function(cb) {
  runSequence('clean', 'dgeni', 'css', cb);
});