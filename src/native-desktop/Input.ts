/**
* Input.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Desktop implementation of Input interface.
*/

import Types = require('../common/Types');

import { Input as InputCommon } from '../native-common/Input';

export class Input extends InputCommon {
    constructor() {
        super();
        InputCommon.nativeCommonPointerUpEvent.subscribe(e => this.dispatchPointerUpEvent(e));
    }

    dispatchKeyDown(e: Types.KeyboardEvent) {
        this.keyDownEvent.fire(e);
    }

    dispatchKeyUp(e: Types.KeyboardEvent) {
        if (this.keyUpEvent.fire(e)) {
            e.stopPropagation();
        }
    }

    dispatchPointerUpEvent(e: Types.MouseEvent) {
        if (this.pointerUpEvent.fire(e)) {
            e.stopPropagation();
        }
    }
}

export default new Input();
