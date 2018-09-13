/**
 * lodashMini.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Import and re-export of part of the lodash module. This helps reduce bundle size.
 */

import clone from 'lodash/clone';
import compact from 'lodash/compact';
import extend from 'lodash/extend';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import findLast from 'lodash/findLast';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import last from 'lodash/last';
import map from 'lodash/map';
import max from 'lodash/max';
import omit from 'lodash/omit';
import union from 'lodash/union';

export {
    clone,
    compact,
    extend,
    filter,
    findIndex,
    findLast,
    isArray,
    isEqual,
    isUndefined,
    last,
    map,
    max,
    omit,
    union
};
