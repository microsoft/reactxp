/**
* gulphelpers.js
*
* Reusable gulp helper scripts.
*
* Package.json dev-dependency requirements:
    "async": "3.0.1",
    "@types/async": "^3.0.0",
    "cross-spawn": "^6.0.5",
    "@types/cross-spawn": "^6.0.0",
    "gulp": "4.0",
    "@types/gulp": "^4.0.6",
    "gulp-rename": "1.4.0",
    "@types/gulp-rename": "0.0.33",
    "gulp-tslint": "8.1.4",
    "gulp-util": "3.0.8",
    "@types/gulp-util": "^3.0.34",
    "gulp-watch": "5.0.1",
    "@types/gulp-watch": "^4.1.34",
    "lodash": "^4.17.11",
    "@types/lodash": "^4.14.134",
    "mkdirp": "^0.5.1",
    "@types/mkdirp": "^0.5.2",
    "node-notifier": "5.4.0",
    "@types/node-notifier": "^5.4.0",
    "ps-tree": "^1.2.0",
    "@types/ps-tree": "^1.1.0",
*/

import async = require('async');
import cp = require('child_process');
import crossSpawn = require('cross-spawn');
import fs = require('fs');
import gulp = require('gulp');
import rename = require('gulp-rename');
import tslint from 'gulp-tslint';
import gutil = require('gulp-util');
import watch = require('gulp-watch');
import _ = require('lodash');
import mkdirp = require('mkdirp');
import notifier = require('node-notifier');
import path = require('path');
import psTree = require('ps-tree');
import * as VinylFile from 'vinyl';

type CopyInfo = { src: string, dest: string, options?: any, renameTo?: string };

// Define a generic error handler.
export const handleError = function(err: any) {
    console.log(err.toString());

    beepOnce();
    notifyOnce({
      'title': 'Gulp Error',
      'message': err.toString(),
    });
};

// Produce a beep only once, even if called several times.
export const beepOnce = _.throttle(function() {
    gutil.beep();
}, 3000, { trailing: false });

// Produce a notification only once, even if called several times.
const notifyOnce = _.throttle(notifier.notify.bind(notifier), 3000, { trailing: false });

// Fix for "EventEmitter memory leak detected" errors. These aren't memory
// leaks -- we're just running a lot of concurrent tasks and runSequence
// is registering them simultaneously.
gulp.setMaxListeners(100);

// Workaround for https://github.com/gulpjs/gulp/issues/71
const origSrc = gulp.src;
gulp.src = function() {
    // tslint:disable-next-line
    return fixPipe(origSrc.apply(this, arguments as any));
};

export const crossSpawns: cp.ChildProcess[] = [];
(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach(sig => {
    process.on(sig, () => {
        console.log('Gracefully shutting down crossSpawns after ' + sig);
        cleanupSpawnsAndExit();
    });
});
process.on('uncaughtException', function(err) {
    console.error('Uncaught Exception thrown: ' + err);
    cleanupSpawnsAndExit();
});

function cleanupSpawnsAndExit() {
    const processKiller = process.platform === 'win32' ? killWin32 : killUnix;
    _.each(crossSpawns, processKiller); //function(cs) { cs.kill(); });
    process.exit();
}

function killWin32(cs: cp.ChildProcess) {
    crossSpawn('taskkill', ['/F', '/T', '/PID', cs.pid.toString()]);
}

function killUnix(cs: cp.ChildProcess) {
    psTree(cs.pid, function (err, child) {
        if (err) {
            return;
        }

        child.forEach(function (treeInfo) {
            const pid = Number(treeInfo.PID);
            try {
                process.kill(pid);
            } catch (err) {
                console.warn('Unable to kill process PID: ' + pid + '\nError: ' + err);
            }
        });
    });
}

function fixPipe(stream: any) {
    const origPipe = stream.pipe;
    stream.pipe = function(this: any, dest: any) {
        arguments[0] = dest.on('error', (error: any) => {
            const nextStreams = dest._nextStreams;
            if (nextStreams) {
                nextStreams.forEach((nextStream: any) => {
                    nextStream.emit('error', error);
                });
            } else if (dest.listeners('error').length === 1) {
                throw error;
            }
        });
        // tslint:disable-next-line
        const nextStream = fixPipe(origPipe.apply(this, arguments));
        (this._nextStreams || (this._nextStreams = [])).push(nextStream);
        return nextStream;
    };
    return stream;
}

export function copyMultiple(copyList: CopyInfo[], callback: (err?: any) => void) {
    // Iterate over each entry in the copy list. Each has a src
    // and dest (or possibly multiple of each).
    async.eachSeries(copyList, function(copyOrder, asyncCallback) {
        if (!copyOrder) {
            return;
        }
        const dests = (_.isArray(copyOrder.dest) ? copyOrder.dest : [copyOrder.dest]);
        async.each(dests, function(dest, innerCallback) {
            mkdirp.sync(dest);
            gulp.src(copyOrder.src, copyOrder.options)
                .pipe(rename(function (pathVal) {
                    if (copyOrder.renameTo) {
                        pathVal.basename = copyOrder.renameTo;
                    }
                }))
                .pipe(gulp.dest(dest))
                .on('end', innerCallback)
                .on('error', innerCallback);
        }, asyncCallback);
    }, callback);
}

function fixRelativePathGlob(pathOrGlob: string[]): string[];
function fixRelativePathGlob(pathOrGlob: string): string;
function fixRelativePathGlob(pathOrGlob: string | string[]): string | string[] {
    if (_.isArray(pathOrGlob)) {
        return _.map(pathOrGlob, function (part) {
            return fixRelativePathGlob(part);
        });
    }

    if (pathOrGlob && typeof pathOrGlob === 'string' && pathOrGlob.length >= 2) {
        const parsed = path.parse(pathOrGlob);
        if (parsed && pathOrGlob.search(/^\.[\/\\]/) === 0) {
            // Looks like a relative path starting with './'!
            // Remove './' since 'foo.js' does not match the glob './foo.js' and that breaks gulp-watch.
            // Note: globs are based from the current directory anyways.
            return pathOrGlob.substr(2);
        }
    }

    return pathOrGlob;
}

export function watcher(glob: string[], callback: (file: VinylFile) => void) {
    const fixedGlob = fixRelativePathGlob(glob);
    watch(fixedGlob, { read: false }, callback);
}

export function watchList(copyList: CopyInfo[]) {
    _.each(copyList, function(copyInfo) {
        // Calculate a base source path from the wildcard-riddled path
        let srcRawDir = copyInfo.src.substr(0, copyInfo.src.lastIndexOf(path.sep));
        if (srcRawDir.indexOf('**') === srcRawDir.length - 2) {
            srcRawDir = srcRawDir.substr(0, srcRawDir.length - 3);
        }
        gutil.log(gutil.colors.yellow('Watching for changes: ' + copyInfo.src + ' -> ' + copyInfo.dest));
        watcher([copyInfo.src], function(whatChanged) {
            const fileName = whatChanged.history[0];
            const relativePath = fileName.substr(srcRawDir.length);
            console.log('CopyWatch Change: ' + relativePath);
            const destPath = path.join(copyInfo.dest, relativePath);
            try {
                mkdirp.sync(copyInfo.dest);
                fs.copyFileSync(fileName, destPath);
            } catch (ex) {
                console.error('Error copying file: ' + fileName + ' to ' + destPath);
            }
        });
    });
}

export function watchInfraFiles(filePaths: string[]) {
    // Watch for changes in the gulpfile or other package lists.
    // If changes are made, notify the user.
    watcher(filePaths, file => {
        const stats = fs.statSync(file.path);

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
                'message': 'Gulp infrastructure files were modified, and you likely need to update and re-run gulp.',
            });
        }, 500);
    });
}

export function taskTypescriptBuild(watchMode: boolean, customTsConfigFile?: string) {
    return () => {
        return new Promise((resolve, reject) => {
            const cmd = 'node';
            const args = ['node_modules/typescript/bin/tsc'];
            if (customTsConfigFile) {
                args.push('-p', customTsConfigFile);
            }

            if (watchMode) {
                args.push('-w', '--preserveWatchOutput');
            }

            const tsc = cp.spawn(cmd, args);
            const sanitizeTSCOutput = (data: any) => data.toString().trim();

            tsc.stdout.on('data', (data: any) => {
                const message = sanitizeTSCOutput(data);
                console.log(message);

                // Hack to let gulp know we have the watcher online
                if (watchMode && message.includes('Watching for file changes')) {
                    resolve();
                }
            });

            tsc.stderr.on('data', (data: any) => {
                console.log(sanitizeTSCOutput(data));
            });

            tsc.on('error', console.error);

            tsc.on('close', (code: number) => {
                if (!watchMode) {
                    code !== 0 ? reject('TSC failed') : resolve();
                }
            });
        });
    };
}

export function taskTsLint(globs: string | string[], customTsLintFile?: string) {
    return () => {
        return gulp.src(globs)
        .pipe(tslint(
            {
                configuration: customTsLintFile || './tslint.json',
                formatter: 'stylish',
                fix: true,
            }))
        .pipe(tslint.report());
    };
}

export function taskWebpack(watchMode = false, webpackEnv: NodeJS.ProcessEnv = {}, useHaul = false) {
    return (callback: Function) => {
        const binaryName = useHaul ? 'haul/bin/cli.js' : 'webpack/bin/webpack.js';
        const args = ['./node_modules/' + binaryName, '--hide-modules'];
        if (watchMode) {
            args.push('--watch', '--env.beep');

            webpackEnv = _.merge({
                WATCH_MODE: true,
            }, webpackEnv);
        } else {
            args.push('--bail');
        }
        const proc = crossSpawn('node', args, { stdio: 'inherit', env: webpackEnv });
        crossSpawns.push(proc);
        if (watchMode) {
            callback();
        } else {
            proc.on('exit', function() {
                callback();
            });
        }
    };
}
