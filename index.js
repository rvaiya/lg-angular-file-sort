var plumber = require('gulp-plumber');
var angularFileSort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var through = require('through2');
var gulp = require('gulp');
var EventEmitter = require('events').EventEmitter;

var states = {};

// Returns a function which generates a stream that updates angular files

function updater(identifier) {
  states[identifier] = states[identifier] || { depChange: new EventEmitter() };
  var state = states[identifier];
  state.targets = state.targets || {};

  return function updaterGen() {
      return through.obj(function(file, enc, cb) {
        var stream = this;
        stream.push(file);

        var injector = inject (
            gulp.src(state.angularFiles).pipe(plumber()).pipe(angularFileSort()),
            { relative: true }
        )
        .on('data', function(f) { stream.push(f); })
        .on('end', function() { 
          cb(); 
          state.depChange.emit('changed');
        });

        for(var k in state.targets) {
          injector.write(state.targets[k]);

        };
        injector.end();
    });
  };
}

//Generate a dynamic dependency injector which listens for changes

function injector(identifier, angularFiles) {
  states[identifier] = states[identifier] || { depChange: new EventEmitter() };
  var state = states[identifier];
  state.angularFiles = angularFiles;
  state.targets = {};


  return function genDepInjectStream () {
    var injector = inject (
      gulp.src(angularFiles).pipe(plumber()).pipe(angularFileSort()),
      { relative: true }
    );

    state.depChange.on('changed', function() {
      injector = inject (
        gulp.src(state.angularFiles).pipe(plumber()).pipe(angularFileSort()),
        { relative: true }
      );
    });

    return through.obj(function(file, enc, cb) {
      state.targets[file.path] = file;
      var stream = this;
      injector.write(file);
      injector.once('data', function flush(file) {
        stream.push(file);
        cb();
      });
    });

  };
}


module.exports = {
  updater: updater,
  injector: injector
};
