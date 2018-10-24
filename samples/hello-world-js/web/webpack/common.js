const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const ROOT_PATH = path.join(__dirname, '..', '..');
const DIST_PATH = path.join(ROOT_PATH, 'dist-web');
const APP_PATH = path.join(ROOT_PATH, 'src');
const WEB_PATH = path.join(ROOT_PATH, 'web');

const buildConfig = (env, argv) => ({
  entry: APP_PATH,
  output: {
    filename: 'bundle.js',
    path: DIST_PATH,
  },

  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'eslint-loader', include: APP_PATH, enforce: 'pre' },
      { test: /\.jsx?$/, loader: 'babel-loader', include: APP_PATH },
    ]
  },

  plugins: [
    new webpack.DefinePlugin({ __DEV__: argv.mode === 'development' }),
    new HtmlWebpackPlugin({ inject: true, template: path.join(WEB_PATH, 'template.html') }),
  ],
});

module.exports = { buildConfig, APP_PATH, DIST_PATH };
