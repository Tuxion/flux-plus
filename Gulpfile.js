var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var cachingCoffeeify = require('caching-coffeeify');
var transform = require('vinyl-transform');
var del = require('del');

var paths = {
  entry: './src/index.coffee',
  scripts: './src/**/*.coffee',
  testEntry: './test/unit/src/index.coffee',
  tests: './test/unit/src/**/*.coffee',
  output: './dist'
};

var getBundleName = function () {
  var name = require('./package.json').name;
  return name + '.' + 'min.js';
};

var coffeeBrowserify = function(standalone){
  return transform(function(filename){
    var b = browserify(filename, {
      extensions: ['.coffee'],
      paths: ['.'],
      standalone: standalone || null
    });
    b.transform(cachingCoffeeify)
    return b.bundle();
  });
};

gulp.task('clean', function(cb) {
  del([paths.output], cb);
});

gulp.task('build', function() {
  
  return gulp.src(paths.entry)
    .pipe(coffeeBrowserify('FluxPlus'))
    .pipe(uglify())
    .pipe(rename(getBundleName()))
    .pipe(gulp.dest(paths.output));
  
});

gulp.task('build-tests', function() {
  
  return gulp.src(paths.testEntry)
    .pipe(coffeeBrowserify())
    .pipe(rename('tests.js'))
    .pipe(gulp.dest(paths.output));
  
});

gulp.task('watch', function() {
  
  livereload.listen();
  
  gulp.watch([paths.entry, paths.scripts], ['build'])
    .on('change', livereload.changed);
  
  gulp.watch([paths.testEntry, paths.tests], ['build-tests'])
    .on('change', livereload.changed);
  
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'build-tests', 'watch']);