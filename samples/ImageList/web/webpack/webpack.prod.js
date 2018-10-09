const merge = require('webpack-merge');
const { buildConfig } = require('./webpack.common');

module.exports = (env, argv) => merge(buildConfig(env, argv), { devtool: false });
