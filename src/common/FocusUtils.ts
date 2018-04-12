/**
* FocusUtils.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Publicly accessible functions for managing the focus.
*/

import RXInterfaces = require('./Interfaces');
import RXTypes = require('./Types');

import { autoFocusIfNeeded } from './utils/AutoFocusHelper';

export class FocusUtils implements RXInterfaces.FocusUtils {
    autoFocus(value: RXTypes.AutoFocus|RXTypes.AutoFocus[], focus: () => void, isAvailable: () => boolean): boolean {
        return autoFocusIfNeeded(value, focus, isAvailable);
    }
}

export default new FocusUtils();
