/**
* lodashMini.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Import and re-export of part of the lodash module. This helps reduce bundle size.
*/
import assign = require('lodash/assign');
import clone = require('lodash/clone');
import cloneDeep = require('lodash/cloneDeep');
import defer = require('lodash/defer');
import each = require('lodash/each');
import endsWith = require('lodash/endsWith');
import extend = require('lodash/extend');
import filter = require('lodash/filter');
import findIndex = require('lodash/findIndex');
import findLast = require('lodash/findLast');
import flatten = require('lodash/flatten');
import get = require('lodash/get');
import isArray = require('lodash/isArray');
import isEmpty = require('lodash/isEmpty');
import isEqual = require('lodash/isEqual');
import isNumber = require('lodash/isNumber');
import isObject = require('lodash/isObject');
import kebabCase = require('lodash/kebabCase');
import keys = require('lodash/keys');
import map = require('lodash/map');
import mapValues = require('lodash/mapValues');
import max = require('lodash/max');
import memoize = require('lodash/memoize');
import merge = require('lodash/merge');
import omit = require('lodash/omit');
import remove = require('lodash/remove');
import throttle = require('lodash/throttle');
import union = require('lodash/union');
export { assign, clone, cloneDeep, defer, each, endsWith, extend, filter, findIndex, findLast, flatten, get, isArray, isEmpty, isEqual, isNumber, isObject, kebabCase, keys, map, mapValues, max, memoize, merge, omit, remove, throttle, union };
