/**
* Input.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web implementation of Input interface.
*/
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Input extends RX.Input {
    constructor();
    dispatchKeyDown(e: Types.KeyboardEvent): void;
    dispatchKeyUp(e: Types.KeyboardEvent): void;
}
declare var _default: Input;
export default _default;
