/**
* FocusUtils.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Publicly accessible functions for managing the focus.
*/

import RXInterfaces = require('./Interfaces');
import { FocusArbitrator } from './Types';
import { FocusArbitratorProvider, setFocusFirstEnabled, setRootFocusArbitrator } from './utils/AutoFocusHelper';

export class FocusUtils implements RXInterfaces.FocusUtils {
    setFocusFirstEnabled(enabled: boolean): void {
        setFocusFirstEnabled(enabled);
    }

    requestFocus(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean): void {
        FocusArbitratorProvider.requestFocus(component, focus, isAvailable);
    }

    setDefaultFocusArbitrator(arbitrator: FocusArbitrator | undefined): void {
        setRootFocusArbitrator(arbitrator);
    }
}

export default new FocusUtils();
