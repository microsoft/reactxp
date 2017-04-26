/**
* lodashMini.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Import and re-export of part of the lodash module. This helps reduce bundle size.
*/
import clone = require('lodash/clone');
import compact = require('lodash/compact');
import extend = require('lodash/extend');
import filter = require('lodash/filter');
import findIndex = require('lodash/findIndex');
import findLast = require('lodash/findLast');
import isArray = require('lodash/isArray');
import isEqual = require('lodash/isEqual');
import isNumber = require('lodash/isNumber');
import last = require('lodash/last');
import map = require('lodash/map');
import max = require('lodash/max');
import omit = require('lodash/omit');
import union = require('lodash/union');
export { clone, compact, extend, filter, findIndex, findLast, isArray, isEqual, isNumber, last, map, max, omit, union };
