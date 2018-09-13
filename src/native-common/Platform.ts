/**
 * Platform.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of Platform interface.
 */

import * as RN from 'react-native';

import * as RX from '../common/Interfaces';

export class Platform extends RX.Platform {
    getType(): RX.Types.PlatformType {
        return RN.Platform.OS;
    }

    select<T>(specifics: { [ platform in RX.Types.PlatformType | 'default' ]?: T }): T | undefined {
        const platformType = this.getType();
        return platformType in specifics ? specifics[platformType] : specifics.default;
    }
}

export default new Platform();
