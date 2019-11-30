/**
 * EventHelpers.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

export function toMouseButton(nativeEvent: any): number {
    if (nativeEvent.button !== undefined) {
        return nativeEvent.button;
    } else if (nativeEvent.isRightButton || nativeEvent.IsRightButton) {
        return 2;
    } else if (nativeEvent.isMiddleButton || nativeEvent.IsMiddleButton) {
        return 1;
    }

    return 0;
}
