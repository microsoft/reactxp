/**
 * Input.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of Input interface.
 */

import * as RN from 'react-native';

import * as RX from '../common/Interfaces';

export class Input extends RX.Input {
    constructor() {
        super();

        RN.BackHandler.addEventListener('hardwareBackPress', () => {
            return this.backButtonEvent.fire();
        });
    }
}

export default new Input();
