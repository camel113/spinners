var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var cp = require('child_process');
var gutil = require('gulp-util');
var run = require('gulp-run');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var runSequence  = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
const imagemin = require('gulp-imagemin');

const base_path = './';
var assetsDevDir = {
  path: base_path + '_assets/',
}
assetsDevDir.styles = assetsDevDir.path + 'styles/**/*.scss';
var siteDir = {
  path: base_path + '_site/',
  assets: {}
};
siteDir.assets.path = siteDir.path + 'assets/';
siteDir.assets.styles = siteDir.assets.path + 'styles/';
var jekyllDir = {
  assets: {
    path: base_path + 'assets/',
  }
};
jekyllDir.assets.styles = jekyllDir.assets.path + 'styles/';
includes = base_path + '/_includes';
jekyllDir.jekyll = ['./*.html', '_posts/*', '_layouts/*', '_includes/*']

// watch files for changes and reload
gulp.task('serve',['build'], function() {
  browserSync({
    server: {
      baseDir: '_site',
      serveStaticOptions: {
        extensions: ["html"]
      }
    },
    port: 4000
  });
  gulp.watch(jekyllDir.jekyll, ['build:jekyll:watch']);
  gulp.watch(assetsDevDir.styles, ['sass:prod']);
});
gulp.task('build:jekyll', function() {
    var shellCommand = 'bundle exec jekyll build --incremental --config _config.yml';
    return gulp.src('')
      .pipe(run(shellCommand))
      .on('error', gutil.log);
});
gulp.task('build:jekyll:watch', ['build:jekyll'], function(cb) {
  browserSync.reload();
  cb();
});
gulp.task('build', function(cb) {
  runSequence(['sass:prod'],'build:jekyll',cb);
});
gulp.task('sass:prod', function () {
  return gulp.src(assetsDevDir.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(jekyllDir.assets.styles))
    .pipe(gulp.dest(siteDir.assets.styles))
    .pipe(sourcemaps.write('./maps'))
    .pipe(reload({stream: true}));
});

gulp.task('imagemin', () =>
  gulp.src('_images/*')
    .pipe(imagemin([imagemin.jpegtran({progressive: true})]))
    .pipe(gulp.dest('images'))
);