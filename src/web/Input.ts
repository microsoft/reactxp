/**
* Input.ts
* Copyright: Microsoft 2017
*
* Web implementation of Input interface.
*/

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Input extends RX.Input {
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
};

export default new Input();
