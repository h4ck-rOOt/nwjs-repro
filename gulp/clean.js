const del = require('del');
const gulp = require('gulp');

const NW_PATH = 'platforms/nw';
const WWW_PATH = 'www';

gulp.task('clean', [ 'clean:www', 'clean:nw' ]);

gulp.task('clean:www', () => del([ `${WWW_PATH}/**`, `!${WWW_PATH}`, `!${WWW_PATH}/.gitkeep` ]));

gulp.task('clean:nw', () => del([`${NW_PATH}`]));
