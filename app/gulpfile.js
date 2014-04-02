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
var mocha = require('gulp-mocha');

var paths = {
  src: [
    './src/**/*.js',
    '!./src/public/**/*.js',
    '!./src/dist/**/*.js'
  ],
  js: [
    //'./src/public/js/*.js',
    './src/public/js/local.js',
    '!./src/public/js/jquery*.js',
    '!./src/public/js/bootstrap.js'
  ],
  css: './src/public/css/*.css',
  img: './src/public/img/*',
  fonts: './src/public/fonts/*',
  static: './src/public/*'
};

gulp.task('default', function() {
  return gulp.start('src', 'js', 'css', 'img', 'static', 'watch');
});

gulp.task('reset', ['clean'], function() {
  return gulp.start('src', 'js', 'css', 'img', 'static', 'watch');
});

gulp.task('test', function() {
  return gulp.start('mocha-unit', 'mocha-route');
});

gulp.task('clean', function() {
  return gulp.src('./src/dist/', {
    read: false
  })
  .pipe(clean());
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['src']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.img, ['img']);
  gulp.watch(paths.fonts, ['static']);
  gulp.watch(paths.static, ['static']);
});

//TODO: NOT USED ATM
gulp.task('dev', function() {
  nodemon({
    script: './src/money-trackr.js',
    env: {
      'NODE_ENV': 'development'
    },
    ignore: [
      './node_modules/**',
      './src/dist/**'
    ]
  })
  .on('change', ['default'])
  .on('restart', function () {
    console.log('restarted!');
  });
});

gulp.task('src', function() {
  return gulp.src(paths.src)
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));  //or 'fail'
});

gulp.task('js', function() {
  gulp.src(paths.js)
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));

  return gulp.src('./src/public/js/*.js')
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./src/dist/js/'));
});

gulp.task('css', function() {
  return gulp.src(paths.css)
  .pipe(minify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./src/dist/css/'));
});

gulp.task('img', function() {
  return gulp.src(paths.img)
  .pipe(cache(
    imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('./src/dist/img/'));
});

gulp.task('static', function() {
  gulp.src(paths.fonts)
  .pipe(gulp.dest('./src/dist/fonts/'));
  gulp.src(paths.static)
  .pipe(gulp.dest('./src/dist/'));
});

gulp.task('mocha-unit', function () {
  return gulp.src('./test/unit/*.js')
    .pipe(mocha({ reporter: 'list' }));
});

gulp.task('mocha-route', function () {
  return gulp.src('./test/route/*.js')
    .pipe(mocha({ reporter: 'list' }));
});
