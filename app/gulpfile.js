var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

gulp.task('default', ['clean'], function() {
  gulp.start('src', 'js', 'css', 'img');
});

gulp.task('clean', function() {
  return gulp.src([
    './src/public/'
  ], {
    read: false
  })
  .pipe(clean());
});

//TODO: not needed?
gulp.task('watch', function() {
  gulp.watch(paths.src, ['src']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.img, ['img']);
});

gulp.task('dev', function() {
  nodemon({
    script: './src/money-trackr.js',
    env: {
      'NODE_ENV': 'development'
    },
    ignore: [
      './node_modules/**',
      './src/public/**'
    ]
  })
  .on('change', ['default'])
  .on('restart', function () {
    console.log('restarted!');
  });
});

var paths = {
  src: [
    './src/**/*.js',
    '!./src/build/**/*.js',
    '!./src/public/**/*.js'
  ],
  js: [
    './src/build/js/*.js',
    '!./src/build/js/jquery*.js',
    '!./src/build/js/bootstrap.js'
  ],
  css: './src/build/css/*.css',
  img: './src/build/img/'
};

gulp.task('src', function() {
  return gulp.src(paths.src)
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));  //or 'fail'
});

gulp.task('js', function() {
  gulp.src(paths.js)
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));

  return gulp.src('./src/build/js/*.js')
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./src/public/js/'));
});

gulp.task('css', function() {
  return gulp.src(paths.css)
  .pipe(minify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./src/public/css/'));
});

gulp.task('img', function() {
  return gulp.src(paths.img)
  .pipe(cache(
    imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('./src/public/img/'));
});
