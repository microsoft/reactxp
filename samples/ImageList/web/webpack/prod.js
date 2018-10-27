const merge = require('webpack-merge');
const { buildConfig } = require('./common');

module.exports = (env, argv) => merge(buildConfig(env, argv), { devtool: false });
