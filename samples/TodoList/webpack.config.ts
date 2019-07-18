/**
* webpack.config.ts
* Copyright: Microsoft 2018
*
* Configuration for webpack, the bundling tool used for the web.
*/

import ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
import _ = require('lodash');
import path = require('path');
import * as webpack from 'webpack';

// The TS types built into the plugin don't work right...
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

import getConfig from './buildconfig';

const passedPlatform = process.env.PLATFORM || 'web';
const isWebpack = ['web', 'tests'].includes(passedPlatform);
const isDev = (process.env.NODE_ENV === 'development');
const isTest = (passedPlatform === 'tests');

function buildConfig({ platform }: { platform: string }, defaults: webpack.Configuration) {
    console.log(platform, defaults);

    const config = getConfig(platform);

    const webpackConfig: webpack.Configuration = _.extend({}, defaults);

    webpackConfig.entry = (platform === 'web') ? './src/ts/index.web.tsx' : './src/ts/index.native.tsx';
    webpackConfig.mode = isDev ? 'development' : 'production';
    webpackConfig.output = (platform === 'web') ? {
        filename: 'app.js',
        path: __dirname + '/web/js'
    } : {
        filename: `index${platform !== 'ios' ? '.' + platform : ''}.bundle`
    };

    // Enable sourcemaps for debugging webpack's output.
    webpackConfig.devtool = 'source-map';

    webpackConfig.resolve = webpackConfig.resolve || {};
    webpackConfig.resolve.modules = _.compact([
        path.resolve('.'),
        path.resolve('./node_modules'),
        isWebpack ? undefined : path.resolve('./node_modules/react-native/node_modules'),
    ]);

    // Add '.ts' and '.tsx' as resolvable extensions.
    webpackConfig.resolve.extensions = _.compact([
        `.${platform}.ts`,
        `.${platform}.tsx`,
        isWebpack ? undefined : '.native.ts',
        isWebpack ? undefined : '.native.tsx',
        '.ts',
        '.tsx',
        ...(webpackConfig.resolve.extensions || []),
    ]);

    webpackConfig.resolve.alias = Object.assign({}, webpackConfig.resolve.alias, config.bundling.aliases);

    webpackConfig.module = webpackConfig.module || { rules: [] };
    webpackConfig.module.rules = [
        {
            test: /\.(t|j)sx?$/,
            exclude: /node_modules[\/\\].*lodash/,
            loader: 'babel-loader',
            query: { compact: !isDev },
        },
        {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: {
                configFile: 'tsconfig.json'
            }
        },
        ...webpackConfig.module.rules,
    ];

    webpackConfig.plugins = [
        // Replace flags in the code based on the build variables. This is similar to
        // the replaceFlags method in gulpfile.js. If you make a change here, reflect
        // the same change in the other location.
        new webpack.DefinePlugin({
            '__DEV__': isDev,
            '__TEST__': isTest,
            '__WEB__': platform === 'web',
            '__ANDROID__': platform === 'android',
            '__IOS__': platform === 'ios',
            '__WINDOWS__': platform === 'windows',
            '__MACOS__': platform === 'macos',
        }),
        new ForkTsCheckerPlugin({
            tslint: './tslint.json',
            tsconfig: './tsconfig.json',
            tslintAutoFix: true,
            checkSyntacticErrors: false,    // Dealt with by ts-loader
            watch: [path.resolve('./src') + '/**/*.ts*'],
            useTypescriptIncrementalApi: !!process.env.WATCH_MODE,
            workers: process.env.WATCH_MODE ? 1 : ForkTsCheckerPlugin.TWO_CPUS_FREE,
        }),
        process.env.WATCH_MODE ? new WebpackBuildNotifierPlugin({
            title: 'TodoList Build Tools',
            suppressSuccess: false,
            // Intentionally ignore click since we're usually just trying to dismiss the header
            onClick: () => undefined,
        }) : undefined,
        ...(webpackConfig.plugins || [])
    ];

    console.log(webpackConfig);

    return webpackConfig;
}

const webpackConfig = isWebpack ? buildConfig({ platform: passedPlatform },
    { resolve: {}, module: { rules: [] } }) : buildConfig;

export default webpackConfig;
