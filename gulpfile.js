var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var contains = require('gulp-contains');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require('browserify');
var bs = require('browser-sync').create();
var fs = require('fs');
const { exec } = require('child_process');
var config = require('./config/default.js'); // Default config

var env = ''
if (process.argv.indexOf("--pro") > -1) env = 'pro';
if (process.argv.indexOf("--dev") > -1) env = 'dev';

var environment = {}

function createEnvironment () {
  return {
    baseDirectory: 'pub/',
    configFile: config.environment[env].configFile,
    source: config.source,
    destination: config.environment[env].destination,
    app: {
      name: config.app.name,
      source: config.app.source,
      destination: config.environment[env].destination + config.app.destination
    }
  }

}
function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}

/* Build */

gulp.task('Compile-App', function () {
  if (env === '') {
    errorEnvironment()
    return
  }
  environment = createEnvironment()
  if (env === 'dev') {
    var source = environment.source + '**/*'
    gulp.watch(source, ['Compile'])
    bs.init({
      server: {
        baseDir: environment.baseDirectory + environment.destination
      }
    });
  }

  gulp.start('Compile')
});

gulp.task('Compile', ['Copy-Assets'], function () {
  var stream = browserify({
    entries: [environment.configFile, environment.app.source],
    transform: [babelify]
  }).bundle()
    .pipe(source(environment.app.name))
    .pipe(buffer())
    .pipe(gulp.dest(environment.baseDirectory + environment.app.destination));
  if (env === 'dev') {
      stream.pipe(bs.reload({stream: true}))
  }
})

gulp.task('Copy-Assets', ['Delete-Destination'], function () {
  return gulp.src(environment.source+'**/*').pipe(gulp.dest(environment.baseDirectory + environment.destination));
});

gulp.task('Delete-Destination', function () {
  environment = createEnvironment()
  return gulp.src(environment.baseDirectory + environment.destination, {read: false}).pipe(clean());
});


function errorEnvironment(){
  console.error('\x1b[35m', '\nWe do not have a defined environment:\n=====================================\n');
  console.error('\x1b[37m','Production:');
  console.error('\x1b[36m%s\x1b[0m', '   gulp build --pro\n');
  console.error(' Development:');
  console.error('\x1b[36m%s\x1b[0m', '   gulp build --dev\n');
  process.exit()
}

// Commands:
gulp.task('build', () => gulp.start('Compile-App'));
