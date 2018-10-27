const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const ROOT_PATH = path.join(__dirname, '..', '..');
const DIST_PATH = path.join(ROOT_PATH, 'dist-web');
const APP_PATH = path.join(ROOT_PATH, 'src');
const WEB_PATH = path.join(ROOT_PATH, 'web');
const TS_CONFIG_PATH = path.join(ROOT_PATH, 'tsconfig.json');
const TSLINT_CONFIG_PATH = path.join(ROOT_PATH, 'tslint.json');

const buildConfig = (env, argv) => ({
  entry: APP_PATH,
  output: {
    filename: 'bundle.js',
    path: DIST_PATH,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [{ test: /\.tsx?$/, loader: 'babel-loader', include: APP_PATH }],
  },

  plugins: [
    new webpack.DefinePlugin({ __DEV__: argv.mode === 'development' }),
    new HtmlWebpackPlugin({ inject: true, template: path.join(WEB_PATH, 'template.html') }),
    new ForkTsCheckerWebpackPlugin({ tsconfig: TS_CONFIG_PATH, tslint: TSLINT_CONFIG_PATH, async: true }),
  ],
});

module.exports = { buildConfig, APP_PATH, DIST_PATH };
