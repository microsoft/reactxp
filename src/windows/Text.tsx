/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Windows-specific implementation of the cross-platform Text abstraction.
*/

import { Text as TextBase } from '../native-common/Text';

export class Text extends TextBase {
    requestFocus() {
        // UWP doesn't support casually focusing RN.Text elements. We override requestFocus in order to drop any focus requests
    }
}

export default Text;
