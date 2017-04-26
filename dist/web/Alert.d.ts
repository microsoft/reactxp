/**
* Alert.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web Alert dialog boxes.
*/
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Alert extends RX.Alert {
    show(title: string, message?: string, buttons?: Types.AlertButtonSpec[]): void;
}
declare var _default: Alert;
export default _default;
