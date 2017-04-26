/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific implementation for deep linking.
*/
import Types = require('../common/Types');
import { Linking as CommonLinking } from '../native-common/Linking';
export declare class Linking extends CommonLinking {
    protected _createSmsUrl(smsInfo: Types.SmsInfo): string;
}
declare var _default: Linking;
export default _default;
