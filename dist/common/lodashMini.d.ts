/**
* lodashMini.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Imports a subset of lodash library needed for ReactXP's implementation.
*/
import clone = require('lodash/clone');
import filter = require('lodash/filter');
import pull = require('lodash/pull');
import sortBy = require('lodash/sortBy');
export interface Dictionary<T> {
    [index: string]: T;
}
export { clone, filter, pull, sortBy };
