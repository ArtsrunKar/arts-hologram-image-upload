import gulp from 'gulp';
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var webpack = require('webpack');
var webpackCfg = require('./webpack.config.js');


gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['build:js']);
  gulp.watch('../src/css/*.scss', ['build:scss']);
});

gulp.task('build:scss', function() {
  return gulp.src('./src/css/*.scss')
  .pipe(sass().on('error', sass.logError))
});

gulp.task('build:css', function(){
    return gulp.src('./src/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css/'))
});

gulp.task('build:js', function () {
  // run webpack
  webpack(webpackCfg, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
    }));
    //callback();
  });
  console.log('build');
});

gulp.task('build', [
  'build:scss',
  'build:css',
  'build:js']
);

gulp.task('default', ['build']);
