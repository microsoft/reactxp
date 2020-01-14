/**
* buildconfig.js
* Copyright: Microsoft 2018
*
* Configuration parameters for building the app.
*/

'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path-posix');

var targetPlatform = 'web';
var isDevEnv = false;

// Base paths to specific folders
var basePaths = {
    nodeModulesPath: './node_modules',
    sourcePath : './src/',
    tempPath: './temp/',
    webAppPath : './web/'
};

function getTempPath(mypath) {
    return path.join(basePaths.tempPath, targetPlatform, mypath);
}

function getSourcePath(mypath) {
    return path.join(basePaths.sourcePath, mypath);
}

function getObjPath(mypath) {
    return path.join(getTempPath('obj'), mypath);
}

function getWebAppPath(mypath) {
    return path.join(basePaths.webAppPath, mypath);
}

function getBuildPath(mypath) {
    if (targetPlatform === 'web') {
        return getWebAppPath(mypath);
    } else {
        return path.join(basePaths.tempPath, targetPlatform, 'rnapp', mypath);
    }
}

function setTargetPlatform(target) {
    switch (target) {
        case 'ios':
        case 'android':
        case 'web':
        case 'windows':
        case 'electron':
        case 'macos':
        case 'tests':
            targetPlatform = target;
            break;

        default:
            targetPlatform = 'web';
            break;
    }
}

function setIsDevEnv(dev) {
    isDevEnv = dev;
}

function getCommonFallback(targetPlatform) {
    switch (targetPlatform) {
        case 'android':
        case 'ios':
        case 'windows':
        case 'macos':
            return 'native';
        case 'web':
        case 'electron':
        case 'tests':
        default:
            return 'web';
    }
}

// Scan the platform-specific modules directory and determines which alias
// to use for the target platform. It searches in the following order:
// 1. modules/<name>/index.<platform>.ts[x]
// 2. modules/<name>/index.<web|native>.ts[x]
// 3. modules/<name>/index.ts[x]
function getModuleAliases(targetPlatform) {
    var aliases = {};
    var fallbackSearchOrder = ['index.' + getCommonFallback(targetPlatform), 'index'];

    var modules = fs.readdirSync('./src/ts/modules/');

    _.each(modules, function (moduleName) {
        var fileNameSearchOrder = [];
        var moduleVariant = 'index.' + targetPlatform;

        _.each(fallbackSearchOrder, function (fallback) {
            var variantPath = './src/ts/modules/' + moduleName + '/' + moduleVariant;
            if (fs.existsSync(variantPath + '.ts') || fs.existsSync(variantPath + '.tsx')) {
                return true;
            }
            moduleVariant = fallback;
        });

        var modulePath = (targetPlatform === 'web' || targetPlatform === 'tests' || targetPlatform === 'electron') ?
            getSourcePath('ts/modules') : './' + getObjPath('modules');
        aliases['modules/' + moduleName] = modulePath + '/' + moduleName + '/' + moduleVariant;
    });

    return aliases;
}

function getConfigInternal() {
    return {
        // Clean
        // --------------------------------------------------------------------- //
        clean: {
            temp: getTempPath('*'),
            web: [
                getBuildPath('fonts/'),
                getBuildPath('images/'),
                getBuildPath('js/')
            ],
            tests: getTempPath('tests/'),
            rnApp: getBuildPath('*')
        },

        // Copy
        // --------------------------------------------------------------------- //
        copy: [
            // fonts
            {
                src: getSourcePath('resources/fonts/**/*.*'),
                dest: getBuildPath('fonts/')
            },
            // images
            {
                src: getSourcePath('resources/images/**/*.*'),
                dest: getBuildPath('images/')
            }
        ],

        // Bundling
        // --------------------------------------------------------------------- //
        bundling: {
            aliases: getModuleAliases(targetPlatform)
        },

        // Build infrastructure
        // --------------------------------------------------------------------- //
        infrastructure: {
            files: [
                './gulpfile.js',
                './buildconfig.js',
                './package.json',
                './webpack.config.js'
            ],
            gulpfile: './gulpfile.js'
        },

        // TypeScript
        // --------------------------------------------------------------------- //
        ts: {
            src: [getSourcePath('ts/**/*.{ts,tsx}')],
            srcRoot: getSourcePath('ts'),
            obj: getObjPath(''),
            config: './tsconfig.json',
            RNDest: getBuildPath('js')
        }
    }
}

module.exports = function getConfig(newTargetPlatform, isDev) {
    setTargetPlatform(newTargetPlatform);
    setIsDevEnv(isDev);
    return getConfigInternal();
}
