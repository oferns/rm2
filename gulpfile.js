var
    // Generic imports
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    when = require('gulp-if'),
    tap = require('gulp-tap'),
    livereload = require('gulp-livereload'),
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
    mocha = require('gulp-spawn-mocha');

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

// Main work is done here
var process = function (options) {

    var processStyles = function () {
        gulp.src('styl/rm.styl')
            .pipe(when(!options.production, maps.init()))
            .pipe(stylus({ use: [jeet(), rupture(), axis()], errors: true, 'include css:': true, paths: ['node_modules'] })).on('error', error)
            .pipe(prefix('> 5% in RO')).on('error', error)
            .pipe(when(!options.production, maps.write()))
            .pipe(when(options.production, nano()))
            .pipe(gulp.dest('public/css'))
            .pipe(tap(done));
    };
    if (options.watch) {
        gulp.watch('styl/**/*', processStyles);
    }
    processStyles();

    fs.readdirSync('scripts/')
        .filter(function (item) { return fs.statSync('scripts/' + item).isFile(); })
        .forEach(function (item) {
            var itemInfo = path.parse('scripts/' + item);

            var bundler = browserify({
                entries: 'scripts/' + item,
                plugin: collapse,
                debug: !options.production,
                cache: {},
                packageCache: {}
            });
            if (options.watch) {
                bundler = watchify(bundler);
            }

            var processScript = function () {
                bundler.bundle()
                    .on('error', gutil.log)
                    .pipe(source(itemInfo.name + '.js'))
                    .pipe(when(options.production, streamify(uglify())))
                    .pipe(when(!options.production, transform(function () { return exorcist('js/maps/' + item + '.map'); })))
                    .pipe(gulp.dest('public/js'))
                    .pipe(tap(done));
            };

            if (options.watch) {
                bundler.on('update', processScript);
            }
            processScript();
        });

    if (options.watch) {
        gutil.log('Starting livereload server...');
        livereload.listen();
        gulp.watch('styl/**/*', function (e) { livereload.changed(path.relative('static', e.path)); });
        gulp.watch('scripts/**/*', function (e) { livereload.changed(path.relative('static', e.path)); });
        gulp.watch('routes/**/*', function (e) { livereload.changed('/'); });
        gutil.log(
            'Watching sources for changes,',
            gutil.colors.yellow('press Ctrl+C to exit') + '...'
        );
    } else {
        options.cb();
    }
};

gulp.task('clean', function (cb) {
    gutil.log('Cleaning scripts, styles and source maps in', gutil.colors.green('public'), 'folder...');
    rimraf('public/**/*', cb);
});

gulp.task('default', ['clean', 'watch'], function (cb) {
    process({ cb: cb });
});

gulp.task('production', ['clean'], function (cb) {
    process({ production: true, cb: cb });
});

gulp.task('watch', ['clean'], function (cb) {
    process({ watch: true, cb: cb });
});

gulp.task('pre-test', function () {
    return gulp.src(['routes/**/*.js', '!routes/**/*-tests.js', 'app/**/*.js', '!app/**/*-tests.js'])
        .pipe(istanbul({ includeUntested: true }))
        .pipe(istanbul.hookRequire({ verbose: true }));
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src(['routes/**/*-tests.js', 'app/**/*-tests.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports({
            dir: './public/coverage'
        }))
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 95 } }));
});