var
    // Generic imports
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    when = require('gulp-if'),
    tap = require('gulp-tap'),
    zip = require('gulp-zip'),
    livereload = require('gulp-livereload'),
    minimist = require('minimist'),
    requirejsOptimize = require('gulp-requirejs-optimize'),
    // CSS-related
    maps = require('gulp-sourcemaps'),
    stylus = require('gulp-stylus'),
    prefix = require('gulp-autoprefixer'),
    nano = require('gulp-cssnano'),
    jeet = require("jeet"),
    rupture = require("rupture"),
    axis = require('axis'),
    // JS-related
    browserify = require('browserify'),
    collapse = require('bundle-collapser/plugin'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    transform = require('vinyl-transform'),
    exorcist = require('exorcist'),
    // test related
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha');

var knownOptions = {
    string: ['packageName', 'packagePath', 'env'],
    default: {
        packageName: "Package.zip",
        packagePath: path.join(__dirname, '_package'),
        env: process.env.NODE_ENV || 'development'
    }
}

var options = minimist(process.argv.slice(2), knownOptions);


// Error logging utility
var error = function (err) {
    gutil.log(err.name + ': ' + gutil.colors.red(err.message));
};

// File processing complete logging utility
var done = function (file) {
    if (path.extname(file.path) !== '.map') {
        gutil.log('Wrote', gutil.colors.green(path.basename(file.path)) + '...');
    }
};

gulp.task('clean', function (cb) {
    gutil.log('Cleaning scripts, styles and source maps in', gutil.colors.green('public'), 'folder...');
    rimraf('public/**/*', cb);
});

gulp.task('package', function () {

    var packagePaths = [
        '!**/_package/**',
        '!**/styl/**',
        '!**/scripts/**',
        '!gulpfile.js',
        '!wallaby.js',
        '!*-tests.js',
        '!**/**/*-tests.js',
        '!*Mock.js',
        '!**/**/*Mock.js',
        '**/*.js',
        'public/**/*'
    ];

    //add exclusion patterns for all dev dependencies
    var packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    var devDeps = packageJSON.devDependencies;

    for (var propName in devDeps) {
        var excludePattern1 = "!**/node_modules/" + propName + "/**";
        var excludePattern2 = "!**/node_modules/" + propName;
        packagePaths.push(excludePattern1);
        packagePaths.push(excludePattern2);
    }

    return gulp.src(packagePaths)
        .pipe(zip(options.packageName))
        .pipe(gulp.dest(options.packagePath));
});

gulp.task('watch', function () {
    gutil.log('Starting livereload server...');
    livereload.listen();
    gulp.watch('styl/**/*', function (e) { livereload.changed(path.relative('static', e.path)); });
    gulp.watch('scripts/**/*', function (e) { livereload.changed(path.relative('static', e.path)); });
    gulp.watch('routes/**/*', function (e) { livereload.changed('/'); });
    gutil.log(
        'Watching sources for changes,',
        gutil.colors.yellow('press Ctrl+C to exit') + '...'
    )
});

gulp.task('pretest', function () {
    return gulp.src([
        '!node_modules/**/*.*',
        '!*/**/*-tests.js',
        '!*-tests.js',
        '!gulpfile.js',
        '!public/**/*.*',
        '!.*/**/*.*',
        '!server.js',
        '!app.js',
        '!wallaby.js',
        '**/*.js',
    ])
        .pipe(istanbul({ includeUntested: true }))
        .pipe(istanbul.hookRequire({ verbose: true }));
});

gulp.task('test', ['pretest'], function () {
    return gulp.src([
        '!node_modules/**/*.*',
        '!public/**/*.*',
        '!.*/**/*.*',
        '*/**/*-tests.js',
        '*-tests.js'
    ])
        .pipe(mocha({
            bin: 'node_modules/mocha/bin/_mocha',
            timeout: 50000
        }))
        .pipe(istanbul.writeReports({
            dir: './public/coverage'
        }))
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));
});

gulp.task('stylus', ['clean'], function () {
    return gulp.src('styl/**/*.styl')
        .pipe(when(!options.production, maps.init()))
        .pipe(stylus({ use: [jeet(), rupture(), axis()], errors: true, 'include css:': true, paths: ['node_modules'] })).on('error', error)
        .pipe(prefix('> 5% in RO')).on('error', error)
        .pipe(when(!options.production, maps.write()))
        .pipe(when(options.production, nano()))
        .pipe(gulp.dest('public/css'))
        .pipe(tap(done));
});

gulp.task('clientscript', ['clean'], function () {
    return gulp.src('./scripts/**/*.js')
        .pipe(gulp.dest('./public/js'));
});


gulp.task('build', ['test', 'stylus', 'clientscript', 'package']);
