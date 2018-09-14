/**
 * lodashMini.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Imports a subset of lodash library needed for ReactXP's implementation.
 */

import assign from 'lodash/assign';
import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

export interface Dictionary<T> {
    [index: string]: T;
}

export {
    assign,
    clone,
    cloneDeep,
    flatten,
    get,
    isArray,
    isEmpty,
    isEqual,
    isNumber,
    map,
    mapValues,
};
