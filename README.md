#Description

 Splits angular-file-sorter into two streams, one which injects angular
 depdencies into files and another which updates the dependency list each
 time it is written to. This allows one to use angular-files-sort with a
 watcher to intelligently perform injection on different file sets.

#Usage

 The injector  consumes an identifier and a glob describing the angular files
 being injected and returns a stream generator which produces a stream that
 injects the specified angular dependencies into the files passed into it.

 The updater consumes an identifier and returns a stream generator which
 generates a stream that updates the dependency list associated with the
 injector sharing the identifier. Each time data is piped into the stream the
 dep list is updated and all files that have flowed through the injector are
 re-injected.

#Example

##lazy-gulp usage

```javascript
var angular = require('lg-angular-file-sort');
var lg = require('lazy-gulp');

var ruleset = [ 
  {
      files: '*js',
      description = [ updater('main') ]
  }, 
  { 
      files: '*html',
      description = [ injector('main', '*js') ]
  }
];

gulp.task('watch', lg.compile(ruleset, 'build', 'watch'));
```

##regular gulp file

```javascript
var watch = require('gulp-watch');
var angular = require('lg-angular-file-sort');

watch('*.js')
  .pipe(angular.updater('main')());
  .pipe(gulp.dest('output'));

watch('*.html')
  .pipe(angular.injector('main', '*.js')());
  .pipe(gulp.dest('output'));
```
