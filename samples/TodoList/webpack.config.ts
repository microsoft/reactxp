/**
* webpack.config.ts
* Copyright: Microsoft 2018
*
* Configuration for webpack, the bundling tool used for the web.
*/

import path = require('path');
import * as webpack from 'webpack';

const platform = process.env.PLATFORM || 'web';
const isDev = (process.env.NODE_ENV === 'development');
const isTest = (platform === 'tests');

const getConfig = require('./buildconfig.js');
const config = getConfig(platform, isDev);

const webpackConfig: webpack.Configuration = {
    entry: './src/ts/index.web.tsx',
    mode: isDev ? 'development' : 'production',
    output: {
        filename: 'app.js',
        path: __dirname + '/web/js'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        modules: [
            path.resolve('.'),
            path.resolve('./node_modules')
        ],
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        alias: config.bundling.aliases
    },

    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                exclude: /node_modules[\/\\].*lodash/,
                loader: 'babel-loader'
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.json'
                }
            }
        ]
    },

    plugins: [
        // Replace flags in the code based on the build variables. This is similar to
        // the replaceFlags method in gulpfile.js. If you make a change here, reflect
        // the same change in the other location.
        new webpack.DefinePlugin({
            '__DEV__': isDev,
            '__TEST__': isTest,
            '__WEB__': true,
            '__ANDROID__': false,
            '__IOS__': false,
            '__WINDOWS__': false,
            '__MACOS__': false
        })
    ]
};

export default webpackConfig;
