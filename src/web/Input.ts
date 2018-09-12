/**
 * Input.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web implementation of Input interface.
 */

import * as RX from '../common/Interfaces';

export class Input extends RX.Input {
    dispatchKeyDown(e: RX.Types.KeyboardEvent) {
        this.keyDownEvent.fire(e);
    }

    dispatchKeyUp(e: RX.Types.KeyboardEvent) {
        if (this.keyUpEvent.fire(e)) {
            e.stopPropagation();
        }
    }
}

export default new Input();
