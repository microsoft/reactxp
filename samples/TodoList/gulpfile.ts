/**
* gulpfile.js
* Copyright: Microsoft 2018
*
* Script for building the app.
*/

import del = require('del');
import gulp = require('gulp');
import gutil = require('gulp-util');
import _ = require('lodash');
import { argv } from 'yargs';

import buildConfig from './buildconfig';
import GulpHelpers = require('./gulphelpers');

const PLATFORMS = {
    WEB: 'web',
    IOS: 'ios',
    ANDROID: 'android',
    WINDOWS: 'windows',
    MACOS: 'macos',
    TESTS: 'tests'
};

// Utility functions
// --------------------------------------------------------------------- //

function getPlatform() {
    const targetPlatform = argv.platform as string;

    if (!targetPlatform) {
        return PLATFORMS.WEB;
    }

    if ([PLATFORMS.ANDROID, PLATFORMS.IOS, PLATFORMS.WEB, PLATFORMS.WINDOWS, PLATFORMS.TESTS, PLATFORMS.MACOS]
            .indexOf(targetPlatform) < 0) {
        throw new Error('Unsupported platform - ' + targetPlatform);
    }

    return targetPlatform;
}

function usesWebpack() {
    return (platform === PLATFORMS.WEB || platform === PLATFORMS.TESTS);
}

// Configurations
// --------------------------------------------------------------------- //

const platform = getPlatform();
gutil.log(gutil.colors.yellow('platform: ' + platform));

const isDevEnv = (process.env.NODE_ENV === 'development');
gutil.log(gutil.colors.yellow('developer mode: ' + (isDevEnv ? 'enabled' : 'disabled')));

const enableSrcMaps = (argv.usesourcemaps !== 'no');
gutil.log(gutil.colors.yellow('source maps: ' + enableSrcMaps));

// Compute the build config
const config = buildConfig(platform);

const webpackEnv = _.merge({
    PLATFORM: platform,
    USESOURCEMAPS: argv.usesourcemaps,
    USECODECOVERAGE: argv.usecodecoverage,
    USEBABEL: argv.usebabel,
    NOLODASHMINI: 'true'
}, process.env);

// Gulp Tasks
// --------------------------------------------------------------------- //

gulp.task('clean', function() {
    return del(_.flatten([config.clean.temp, (config.clean as Record<string, string | string[]>)[platform] ||
        config.clean.rnApp]), { force: true });
});

gulp.task('watchprereqs', function (callback) {
    GulpHelpers.watchInfraFiles(config.infrastructure.files);
    GulpHelpers.watchList(config.copy);

    callback();
});

gulp.task('copy', function(callback) {
    GulpHelpers.copyMultiple(config.copy, callback);
});

gulp.task('webpack-js', GulpHelpers.taskWebpack(false, webpackEnv, !usesWebpack()));
gulp.task('webpack-js-watch', GulpHelpers.taskWebpack(true, webpackEnv, !usesWebpack()));

gulp.task('common', gulp.series('clean', 'copy'));

gulp.task('build', gulp.series('common', 'webpack-js'));
gulp.task('watch', gulp.series('common', 'watchprereqs', 'webpack-js-watch'));
