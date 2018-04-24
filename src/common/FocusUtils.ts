/**
* FocusUtils.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Publicly accessible functions for managing the focus.
*/

import RXInterfaces = require('./Interfaces');

import { FirstFocusableId, requestFocus } from './utils/AutoFocusHelper';

export class FocusUtils implements RXInterfaces.FocusUtils {
    FirstFocusableId = FirstFocusableId;
    requestFocus = requestFocus;
}

export default new FocusUtils();
