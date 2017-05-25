/**
* Alert.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native Alert dialog boxes for ReactXP.
*/

import RN = require('react-native');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

// Native implementation for alert dialog boxes
export class Alert implements RX.Alert {
    public show(title: string, message?: string, buttons?: Types.AlertButtonSpec[], icon?: string): void {
        RN.Alert.alert(title, message, buttons);
    }
}

export default new Alert();
