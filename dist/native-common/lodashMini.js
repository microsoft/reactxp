/**
* lodashMini.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Import and re-export of part of the lodash module. This helps reduce bundle size.
*/
"use strict";
var clone = require("lodash/clone");
exports.clone = clone;
var compact = require("lodash/compact");
exports.compact = compact;
var extend = require("lodash/extend");
exports.extend = extend;
var filter = require("lodash/filter");
exports.filter = filter;
var findIndex = require("lodash/findIndex");
exports.findIndex = findIndex;
var findLast = require("lodash/findLast");
exports.findLast = findLast;
var isArray = require("lodash/isArray");
exports.isArray = isArray;
var isEqual = require("lodash/isEqual");
exports.isEqual = isEqual;
var isNumber = require("lodash/isNumber");
exports.isNumber = isNumber;
var last = require("lodash/last");
exports.last = last;
var map = require("lodash/map");
exports.map = map;
var max = require("lodash/max");
exports.max = max;
var omit = require("lodash/omit");
exports.omit = omit;
var union = require("lodash/union");
exports.union = union;
