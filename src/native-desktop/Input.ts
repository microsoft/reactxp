/**
 * Input.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Desktop implementation of Input interface.
 */

import { Input as InputCommon } from '../native-common/Input';
import { Types } from '../common/Interfaces';

export class Input extends InputCommon {
    constructor() {
        super();
    }

    dispatchKeyDown(e: Types.KeyboardEvent) {
        this.keyDownEvent.fire(e);
    }

    dispatchKeyUp(e: Types.KeyboardEvent) {
        if (this.keyUpEvent.fire(e)) {
            e.stopPropagation();
        }
    }
}

export default new Input();
