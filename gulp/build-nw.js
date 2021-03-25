const argv = require('minimist')(process.argv.slice(2));
const spawn = require('cross-spawn');
const gulp = require('gulp');
const merge = require('merge-stream');
const path = require('path');
const typescript = require('gulp-typescript');
const NwBuilder = require('nw-builder');

const NW_PATH = path.join('platforms', 'nw');
const NW_WAR_PATH = path.join('platforms', 'browser', 'www');
const NW_TEMP_PATH = path.join(NW_PATH, 'temp');
const NW_VERSION = argv.NW_VERSION || process.env.NW_VERSION || '0.52.0';
const NW_CACHE_DIR = process.env.NW_CACHE_DIR || './cache';

gulp.task('transpile', ['clean:nw'], () => {
  const tsProject = typescript.createProject('./src/nw/tsconfig.json');

  return tsProject.src()
    .pipe(tsProject(typescript.reporter.longReporter()))
    .pipe(gulp.dest(path.join(NW_TEMP_PATH)));
});

gulp.task('copy:nw-files', ['clean:nw'], () => {
  const war = gulp
    .src([ `${NW_WAR_PATH}/**/*` ])
    .pipe(gulp.dest(path.join(NW_TEMP_PATH, 'webview/')));

  const assets = gulp
    .src(['src/nw/**/*.{html,css,png,ico,json}', '!src/nw/node_modules/**'])
    .pipe(gulp.dest(NW_TEMP_PATH));

  return merge(war, assets);
});

gulp.task('resolve:node', ['copy:nw-files'], done => {
  const npm = spawn.sync('npm', ['ci'], {
    env: process.env, // eslint-disable-line no-process-env
    cwd: path.join(process.cwd(), NW_TEMP_PATH),
    stdio: 'inherit'
  });

  if (npm.status > 0) {
    done(new Error('failed resolving node dependencies'));
    return;
  }

  done();
});

gulp.task('build:nw', ['transpile', 'copy:nw-files', 'resolve:node'], () => {
  const options = {
    files: `${NW_TEMP_PATH}/**/*`,
    platforms: ['osx64', 'win64'],
    cacheDir: NW_CACHE_DIR,
    version: NW_VERSION,
    flavor: 'sdk',
    buildDir: NW_PATH,
    buildType: () => 'build',
    zip: false
  };

  const nw = new NwBuilder(options);

  nw.on('log', console.log);
  nw.on('error', console.error);

  return nw.build();
});
