/**
* webpack.haul.js
* Copyright: Microsoft 2018
*
* Wrapping webpack configuration for haul
*/

require('ts-node').register({});

var webpackConfig = require('./webpack.config');

module.exports = webpackConfig;
