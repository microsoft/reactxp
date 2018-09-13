/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Android-specific implementation of GestureView component.
 */

import { GestureView as BaseGestureView } from '../native-common/GestureView';
import { Types } from '../common/Interfaces';

const _preferredPanRatio = 2;

export class GestureView extends BaseGestureView {

    constructor(props: Types.GestureViewProps) {
        super(props);
    }

    protected _getPreferredPanRatio(): number {
        return _preferredPanRatio;
    }

    protected _getEventTimestamp(e: Types.TouchEvent): number {
        let timestamp = e.timeStamp;

        // Work around a bug in some versions of RN where "timestamp" is
        // capitalized differently for some events.
        if (!timestamp) {
            timestamp = (e as any).timestamp;
        }

        if (!timestamp) {
            return 0;
        }

        return timestamp.valueOf();
    }
}

export default GestureView;
