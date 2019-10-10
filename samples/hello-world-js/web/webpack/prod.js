const CompressionPlugin = require('compression-webpack-plugin');
const merge = require('webpack-merge');
const { buildConfig, DIST_PATH } = require('./common');

module.exports = (env, argv) => merge(buildConfig(env, argv), {
  devtool: false,

  output: {
    filename: 'bundle-[hash].js',
    path: DIST_PATH,
  },

  plugins: [
    new CompressionPlugin({ algorithm: 'gzip', filename: '[path].gz' }),
  ],
});
