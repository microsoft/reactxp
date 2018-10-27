const merge = require('webpack-merge');
const { buildConfig, APP_PATH } = require('./common');

module.exports = (env, argv) => (
  merge(buildConfig(env, argv), {
    devtool: 'inline-source-map',
    devServer: {
      contentBase: APP_PATH,
      openPage: '',
      stats: 'minimal',
      open: true,
      port: 9999,
    },
  })
);
