'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');

require('./gulp/clean');
require('./gulp/build-webapp');
require('./gulp/build-nw');

gulp.task('default', () => {
  gutil.log(gutil.colors.red('Please use cordova CLI. Gulp tasks will be executed as hooks.'));
});
