/**
* Input.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of Input interface.
*/

import RN = require('react-native');
import SubscribableEvent from 'subscribableevent';

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Input extends RX.Input {
    
    static nativeCommonPointerUpEvent = new SubscribableEvent<(e: Types.MouseEvent) => void>();
    
    constructor() {
        super();

        RN.BackHandler.addEventListener('hardwareBackPress', () => {
            return this.backButtonEvent.fire();
        });
    }

    dispatchPointerUpEvent(e: Types.MouseEvent) {
        if (this.pointerUpEvent.fire(e)) {
            e.stopPropagation();
        }
        Input.nativeCommonPointerUpEvent.fire(e);
    }
}

export default new Input();
