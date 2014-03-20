var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('lint', function() {
  gulp.src('./src/public/js/*.js')
    .pipe(jshint())
    //.pipe(jshint.reporter('fail'))
    .pipe(jshint.reporter(stylish));
});
