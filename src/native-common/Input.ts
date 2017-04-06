/**
* Input.ts
* Copyright: Microsoft 2017
*
* Native implementation of Input interface.
*/

import RN = require('react-native');

import RX = require('../common/Interfaces');

export class Input extends RX.Input {
    constructor() {
        super();

        RN.BackAndroid.addEventListener('BackButton', () => {
            return this.backButtonEvent.fire();
        });
    }
};

export default new Input();
