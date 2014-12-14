#wtf?

 Splits angular-file-sorter into two streams, one which injects angular
 depdencies into files and another which updates the dependency list each
 time it receives data. This allows one to use angular-files-sort with a
 watcher and intelligently perform injection on different file sets.

#Usage

 The injector  consumes an identifier, a glob describing the angular files
 being injected, and a glob describing the injection target and returns a
 stream generator which produces a stream that injects the specified angular
 dependencies into the files passed into it. If the dependency list is
 updated all of the target files specified by the second glob expression will
 be updated.

 The updater consumes an identifier and returns a stream generator which
 generates a stream that updates the dependency list associated with an
 injector sharing the identifier each time data is piped into it.

#Example

##lazy-gulp usage

```javascript
var angular = require('lg-angular-file-sort');
var lg = require('lazy-gulp');

var ruleset = [ 
  {
      files: '\*js',
      description = [ updater('main') ]
  }, 
  { 
      files: '\*html',
      description = [ injector('main', '\*js', '\*html') ]
  }
];

gulp.task('watch', lg.compile(ruleset, 'build', 'watch'));
```

##regular gulp file

```javascript
var watch = require('gulp-watch');
var angular = require('lg-angular-file-sort');

watch('\*.js')
  .pipe(angular.updater('main')());
  .pipe(gulp.dest('output'));

watch('\*.js')
  .pipe(angular.injector('main', '\*.js', '\*.html')());
  .pipe(gulp.dest('output'));
```
