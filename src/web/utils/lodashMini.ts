/**
 * lodashMini.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Import and re-export of part of the lodash module. This helps reduce bundle size.
 */

import assign from 'lodash/assign';
import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import defer from 'lodash/defer';
import each from 'lodash/each';
import endsWith from 'lodash/endsWith';
import extend from 'lodash/extend';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import findLast from 'lodash/findLast';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import kebabCase from 'lodash/kebabCase';
import keys from 'lodash/keys';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import max from 'lodash/max';
import memoize from 'lodash/memoize';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import remove from 'lodash/remove';
import throttle from 'lodash/throttle';
import union from 'lodash/union';

export {
    assign,
    clone,
    cloneDeep,
    defer,
    each,
    endsWith,
    extend,
    filter,
    findIndex,
    findLast,
    flatten,
    get,
    isArray,
    isEmpty,
    isEqual,
    isObject,
    isUndefined,
    kebabCase,
    keys,
    map,
    mapValues,
    max,
    memoize,
    merge,
    omit,
    remove,
    throttle,
    union
};
