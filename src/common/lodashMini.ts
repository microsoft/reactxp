/**
 * lodashMini.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Imports a subset of lodash library needed for ReactXP's implementation.
 */

import clone from 'lodash/clone';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import pull from 'lodash/pull';
import sortBy from 'lodash/sortBy';

export interface Dictionary<T> {
    [index: string]: T;
}

export {
    clone,
    compact,
    filter,
    isEqual,
    pull,
    sortBy
};
