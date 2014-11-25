var gulp = require('gulp');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
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

var reloader = null;

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
    return b.bundle()
      .on('error', coffeeError);
  });
};

var coffeeError = function(error){
  notify.onError({
    title: "Build error",
    message: error.toString()
  })(error);
  this.emit('end');
}

gulp.task('clean', function(cb) {
  del([paths.output], cb);
});

gulp.task('build', function() {
  
  var stream = gulp.src(paths.entry)
    .pipe(plumber())
    .pipe(coffeeBrowserify('FluxPlus'))
    .pipe(uglify())
    .pipe(rename(getBundleName()))
    .pipe(gulp.dest(paths.output));
  
  if(reloader){
    stream.on('end', livereload.changed);
  }
  
  return stream;
  
});

gulp.task('build-tests', function() {
  
  var stream = gulp.src(paths.testEntry)
    .pipe(plumber())
    .pipe(coffeeBrowserify())
    .pipe(rename('tests.js'))
    .pipe(gulp.dest(paths.output));
  
  if(reloader){
    stream.on('end', livereload.changed);
  }
  
  return stream;
  
});

gulp.task('watch', function() {
  
  reloader = livereload.listen();
  
  gulp.watch([paths.entry, paths.scripts], ['build']);
  gulp.watch([paths.testEntry, paths.tests], ['build-tests']);
  
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'build-tests', 'watch']);
