const gulp = require('gulp');
const babel = require('gulp-babel');
const typescript = require('gulp-typescript');

gulp.task('build:ts', ['clean'], () => {
  const tsProject = typescript.createProject('tsconfig.json');

  return tsProject.src()
    .pipe(tsProject())
    .pipe(babel())
    .pipe(gulp.dest('www'));
});

gulp.task('build', ['clean', 'build:ts'], () => {
  return gulp.src('src/index.html').pipe(gulp.dest('www'));
});
