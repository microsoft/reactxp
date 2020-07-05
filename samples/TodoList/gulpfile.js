/**
* gulpfile.js
* Copyright: Microsoft 2018
*
* Script for building the app.
*/

var _ = require('lodash');
var argv = require('yargs').argv;
var async = require('async');
var buildConfig = require('./buildconfig');
var cached = require('gulp-cached');
var del = require('del');
var eol = require('gulp-eol');
var eventStream = require('event-stream');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var notifier = require('node-notifier');
var os = require('os');
var path = require('path-posix');
var prettyTime = require('pretty-hrtime');
var rename = require('gulp-rename');
var replaceWithSM = require('gulp-replace-with-sourcemaps');
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');
var stylish = require('jshint-stylish');
var ts = require('gulp-typescript');
var eslint = require('gulp-eslint');
var eslintEng = require('eslint');
var util = require('util');
var watch = require('gulp-watch');

var PLATFORMS = {
    WEB: 'web',
    IOS: 'ios',
    ANDROID: 'android',
    WINDOWS: 'windows',
    MACOS: 'macos',
    TESTS: 'tests'
};

// Configurations
// --------------------------------------------------------------------- //

var webpackEnv = _.merge({
    PLATFORM: platform,
    USESOURCEMAPS: argv.usesourcemaps,
    USECODECOVERAGE: argv.usecodecoverage,
    USEBABEL: argv.usebabel,
    NOLODASHMINI: 'true'
}, process.env);

// Utility functions
// --------------------------------------------------------------------- //

function getPlatform() {
    var targetPlatform = argv.platform;

    if (!targetPlatform) {
        return PLATFORMS.WEB;
    }

    if ([PLATFORMS.ANDROID, PLATFORMS.IOS, PLATFORMS.WEB, PLATFORMS.WINDOWS, PLATFORMS.TESTS, PLATFORMS.MACOS].indexOf(targetPlatform) < 0) {
        throw 'Unsupported platform - ' + targetPlatform;
    }

    return targetPlatform;
}

// Handle args
var platform = getPlatform();
gutil.log(gutil.colors.yellow('platform: ' + platform));

var isDevEnv = (process.env.NODE_ENV === 'development');
gutil.log(gutil.colors.yellow('developer mode: ' + (isDevEnv ? 'enabled' : 'disabled')));

var enableSrcMaps = (argv.usesourcemaps !== 'no');
gutil.log(gutil.colors.yellow('source maps: ' + enableSrcMaps));

// Compute the build config
var config = buildConfig(platform, isDevEnv);

// Define a generic error handler.
var handleError = function(err) {
    console.log(err.toString());

    beepOnce();
    notifyOnce({
      'title': 'Gulp Error',
      'message': err.toString()
    });
};

// Produce a beep only once, even if called several times.
var beepOnce = _.throttle(function() {
    gutil.beep();
}, 3000, { trailing: false });

// Produce a notification only once, even if called several times.
var notifyOnce = _.throttle(notifier.notify.bind(notifier), 3000, { trailing: false });

// Fix for "EventEmitter memory leak detected" errors. These aren't memory
// leaks -- we're just running a lot of concurrent tasks and runSequence
// is registering them simultaneously.
gulp.setMaxListeners(100);

// Workaround for https://github.com/gulpjs/gulp/issues/71
var origSrc = gulp.src;
gulp.src = function() {
    return fixPipe(origSrc.apply(this, arguments));
};

function fixPipe(stream) {
    var origPipe = stream.pipe;
    stream.pipe = function (dest) {
        arguments[0] = dest.on('error', function (error) { // jshint ignore:line
            var nextStreams = dest._nextStreams;
            if (nextStreams) {
                nextStreams.forEach(function (nextStream) {
                    nextStream.emit('error', error);
                });
            } else if (dest.listeners('error').length === 1) {
                throw error;
            }
        });
        var nextStream = fixPipe(origPipe.apply(this, arguments));
        (this._nextStreams || (this._nextStreams = [])).push(nextStream);
        return nextStream;
    };
    return stream;
}

// Get a list of file config from config entry in their pre-copy location.
var getFilePathsFromConfig = _.memoize(function(configEntry) {
    var files = [];

    for (var copyOrderKey in configEntry) {
        if (configEntry.hasOwnProperty(copyOrderKey)) {
            if (typeof configEntry[copyOrderKey].files === 'string') {
                files.push(configEntry[copyOrderKey].files);
            } else if (util.isArray(configEntry[copyOrderKey].files)) {
                files = files.concat(configEntry[copyOrderKey].files);
            }
        }
    }

    return _.uniq(files);
});

function usesWebpack() {
    return (platform === PLATFORMS.WEB || platform === PLATFORMS.TESTS);
}

function getPlatformSpecificResources() {
    var configKey = {
        'ios': 'iOS',
        'android': 'android',
        'windows': 'windows',
        'macos':'macos'
    }[platform];

    return config[configKey] || {};
}

//var defaultFormatter = new eslintEng.Formatters.StylishFormatter();
var createCacheInvalidator = function(cacheName) {
    function formatter() {}
    formatter.prototype.format = function(ruleFailures) {
        // Remove affected files from the cache.
        if (ruleFailures && ruleFailures.length && cached.caches[cacheName]) {
            ruleFailures.forEach(function(ruleFailure) {
                var path = ruleFailure.path || ruleFailure.fileName;
                // Note: The path does not always use the same folder separator as the cache's key.
                var pathForwards = path.replace(/\\/g, '/');
                var pathBackwards = path.replace(/\//g, '\\');
                delete cached.caches[cacheName][path];
                delete cached.caches[cacheName][pathForwards];
                delete cached.caches[cacheName][pathBackwards];
            });
        }

        // Print the rule failures using a real formatter.
        return defaultFormatter.format(ruleFailures);
    };
    return formatter;
};

// Note: Cannot have multiple instances of a gulp.task running at the same time. Pass the last parameter to make this print like a task.
var eslintRunning = false;
var eslintNeedsRun = true;
function _runEsLintInternal(src, cacheName, fakeTaskName) {
    if (eslintRunning) {
        eslintNeedsRun = true;
        return Promise.resolve();
    }

    eslintRunning = true;
    eslintNeedsRun = false;

    // Setup for fake gulp.task.
    var start = process.hrtime();
    if (fakeTaskName) {
        gutil.log('Starting \'' + gutil.colors.cyan(fakeTaskName) + '\'...');
    }

    // Run eslint.
    var stream = gulp.src(src, { base: './' }) // specify base to preserve folder structure
        .pipe(cached(cacheName, {optimizeMemory: true}))
        .pipe(eslint({
            eslint: eslintEng,
            reporter: 'verbose',
            formatter: createCacheInvalidator(cacheName),
            fix: !!argv.fix
        }))
        //.pipe(eslint.report({
        //    // Break non-dev builds on lint
        //    emitError: !isDevEnv
        //}))
        .on('error', handleError);

    // Print duration for the fake gulp.task.
    if (fakeTaskName) {
        stream = stream.on('end', function () {
            var time = process.hrtime(start);
            gutil.log('Finished \'' + gutil.colors.cyan(fakeTaskName) + '\' after ',
                gutil.colors.magenta(prettyTime(time)));
        });
    }

    return stream.on('end', function() {
        eslintRunning = false;
        if (eslintNeedsRun) {
            runEsLintFromWatcher();
        }
    });
}

// Debounce running es-lint. We don't need to call it once per change since it runs over all changed files.
function _debounceEsLintRunner(runner, fakeTaskName) {
    return _.debounce(function () {
        runner(fakeTaskName);
    }, 100, { leading: true, trailing: true });
}

function runEsLint(fakeTaskName) {
    var src = config.ts.src;
    var esLintCacheName = 'esLint';
    return _runEsLintInternal(src, esLintCacheName, fakeTaskName);
}
var runEsLintFromWatcher = _debounceEsLintRunner(runEsLint, 'esLint');

function copyMultiple(copyList, callback) {
    // Iterate over each entry in the copy list. Each has a src
    // and dest (or possibly multiple of each).
    async.eachSeries(copyList, function(copyOrder, asyncCallback) {
        if (!copyOrder){
            return;
        }
        var dests = (_.isArray(copyOrder.dest) ? copyOrder.dest : [copyOrder.dest]);
        async.each(dests, function(dest, innerCallback) {
            gulp.src(copyOrder.src, copyOrder.options)
                .pipe(rename(function (path) {
                    if (copyOrder.renameTo) {
                        path.basename = copyOrder.renameTo;
                    }
                }))
                .pipe(gulp.dest(dest))
                .on('end', innerCallback)
                .on('error', innerCallback);
        }, asyncCallback);
    }, callback);
}

// helper for creating paths that require accepts
function normalizePath(mypath) {
    return mypath
        .replace(/^(?!\.(?:\/|\\))/, './') // add ./ at beginning if not present
        .replace(/\\/g, '/');              // change path separators
}

// Search for absolute require paths that correspond to specified aliases and
// replace them with the corresponding relative path.
function aliasify(aliases) {
    var reqPattern = new RegExp(/require\(['"]([^'"]+)['"]\)/g); // matches requires

    // for all files in the stream apply the replacer
    return eventStream.map(function(file, done) {
        if (!file.isNull()) {
            var fileContent = file.contents.toString();
            if (reqPattern.test(fileContent)) {
                file.contents = new Buffer(fileContent.replace(reqPattern, function(req, oldPath) {
                    if (!aliases[oldPath]) {
                        return req;
                    }

                    if (aliases[oldPath][0] === '.') {
                        var oldFolder = path.dirname(path.resolve(file.path));
                        var targetFile = path.resolve(aliases[oldPath]);
                        var newPath = path.relative(oldFolder, targetFile);

                        return "require('" + normalizePath(newPath) + "')";
                    } else {
                        return "require('" + aliases[oldPath] + "')";
                    }
                }));
            }
        }

        done(null, file);
    });
}

// Replace flags within the code. This replacement method is used
// only for native platforms. For web, see webpack.config.ts for
// a similar replacement mechanism. If you make a change here,
// reflect the same change in the other location.
function replaceFlags(stream) {
    return stream
        .pipe(replaceWithSM(/__DEV__(?!\s*:\s*boolean)/g, isDevEnv))
        .pipe(replaceWithSM(/__TEST__(?!\s*:\s*boolean)/g, platform === PLATFORMS.TESTS))
        .pipe(replaceWithSM(/__WEB__(?!\s*:\s*boolean)/g, false))
        .pipe(replaceWithSM(/__ANDROID__(?!\s*:\s*boolean)/g, platform === PLATFORMS.ANDROID))
        .pipe(replaceWithSM(/__IOS__(?!\s*:\s*boolean)/g, platform === PLATFORMS.IOS))
        .pipe(replaceWithSM(/__WINDOWS__(?!\s*:\s*boolean)/g, platform === PLATFORMS.WINDOWS))
        .pipe(replaceWithSM(/__MACOS__(?!\s*:\s*boolean)/g, platform === PLATFORMS.MACOS));
}

function fixRelativePathGlob(pathOrGlob) {
    if (_.isArray(pathOrGlob)) {
        return _.map(pathOrGlob, function (part) {
            return fixRelativePathGlob(part);
        });
    }

    if (pathOrGlob && typeof pathOrGlob === 'string' && pathOrGlob.length >= 2) {
        var parsed = path.parse(pathOrGlob);
        if (parsed && pathOrGlob.search(/^\.[\/\\]/) === 0) {
            // Looks like a relative path starting with './'!
            // Remove './' since 'foo.js' does not match the glob './foo.js' and that breaks gulp-watch.
            // Note: globs are based from the current directory anyways.
            return pathOrGlob.substr(2);
        }
    }
    return pathOrGlob;
}

function watcher(glob, callback) {
    var fixedGlob = fixRelativePathGlob(glob);
    watch(fixedGlob, { read: false }, callback);
}

// Gulp Tasks
// --------------------------------------------------------------------- //
gulp.task('watch', function(callback) {
    // Watch for changes in the gulpfile or other package lists.
    // If changes are made, notify the user.
    watcher(config.infrastructure.files, function(file) {
        var stats = fs.statSync(file.path);

        if (!stats || !stats.isFile()) {
            return;
        }

        console.log(gutil.colors.bgRed.bold('\nThe following files were modified, and you likely need to update and re-run gulp:'));

        console.log(gutil.colors.bgRed.bold('- ' + path.relative('./', file.path)));

        setTimeout(function() {
            console.log('\n');

            beepOnce();
            notifier.notify({
                'title': 'Project Changes',
                'message': 'Gulp infrastructure files were modified, and you likely need to update and re-run gulp.'
            });
        }, 500);
    });

    // Watch external files to copy.
    watcher(getFilePathsFromConfig(config.copy), gulp.series('copy'));

    if (!usesWebpack()) {
        // Watch for ts change & run linter
        watcher(config.ts.src, gulp.series('compile-rn', 'apply-aliases', runEsLintFromWatcher));
    }

    callback();
});

gulp.task('clean', function() {
    return del(_.flatten([config.clean.temp, config.clean[platform] || config.clean.rnApp]), { force: true });
});

gulp.task('es-lint', function() {
    // Webpack runs eslint
    if (!usesWebpack()) {
        return runEsLint();
    }
    return Promise.resolve();
});

gulp.task('gulpfile-lint', function() {
    return gulp.src(config.infrastructure.gulpfile)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .on('error', handleError);
});

gulp.task('compile-rn', function () {
    if (platform === PLATFORMS.WEB || platform === PLATFORMS.TESTS) {
        return Promise.resolve();
    }

    var tsProject = ts.createProject(config.ts.config);
    var rnSource = config.ts.src;
    var stream = gulp.src(rnSource)
        .pipe(eol(os.EOL, false))
        .pipe(enableSrcMaps ? sourcemaps.init() : gutil.noop())
        .pipe(tsProject());

    if (enableSrcMaps) {
        stream = stream.pipe(sourcemaps.write('.',
            { sourceRoot: path.join(process.cwd(), config.ts.srcRoot) }));
    }

    return stream
        .pipe(gulp.dest(config.ts.obj))
        .on('error', handleError);
});

gulp.task('apply-aliases', function() {
    var aliases = _.assign({}, config.bundling.aliases, getPlatformSpecificResources().aliases);
    var stream = gulp.src(path.join(config.ts.obj, '**/*.{js,js.map}'))
        .pipe(cached('aliases', {optimizeMemory: true}))
        .pipe(aliasify(aliases));

    // Replace flags in source since RN Packager won't do it for us
    stream = replaceFlags(stream);

    return stream
        .pipe(gulp.dest(config.ts.RNDest))
        .on('error', handleError);
});

gulp.task('copy', function(callback) {
    copyMultiple(config.copy, callback);
});

gulp.task('lint', gulp.series('es-lint', 'gulpfile-lint'));

gulp.task('build', gulp.series('copy', 'compile-rn'));

gulp.task('webpack-js', shell.task('node --max_old_space_size=4096 ./node_modules/webpack/bin/webpack.js --bail --hide-modules', { env: webpackEnv }));
gulp.task('webpack-js-watch', shell.task('node --max_old_space_size=4096 ./node_modules/webpack/bin/webpack.js --watch --hide-modules', { env: webpackEnv }));

gulp.task('noop', function(callback) {
    // NOOP!
    callback();
});

gulp.task('run-once', gulp.series('clean', 'lint', 'copy', 'build', 'apply-aliases', usesWebpack() ? 'webpack-js' : 'noop'));

gulp.task('run', gulp.series('clean', 'copy', 'build', 'apply-aliases', 'watch',
    (usesWebpack() ? 'webpack-js-watch' : 'noop'), 'lint'));
