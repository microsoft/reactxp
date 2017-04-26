/**
* lodashMini.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Imports a subset of lodash library needed for ReactXP's implementation.
*/
"use strict";
var clone = require("lodash/clone");
exports.clone = clone;
var filter = require("lodash/filter");
exports.filter = filter;
var pull = require("lodash/pull");
exports.pull = pull;
var sortBy = require("lodash/sortBy");
exports.sortBy = sortBy;
