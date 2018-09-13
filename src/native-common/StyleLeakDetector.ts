/**
 * StyleLeakDetector.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of debugging logic that detects style leaks.
 */

import * as RN from 'react-native';

import { StyleLeakDetector as CommonStyleLeakDetector } from '../common/StyleLeakDetector';

export class StyleLeakDetector extends CommonStyleLeakDetector {
    protected isDisabled(): boolean {
        // Disable StyleLeakDetector in UWP apps because the way Chakra reports
        // line numbers breaks the leak detector. Specifically, function calls
        // in an object literal are all reported to be on the same line. For
        // example, suppose we have this code:
        //
        //   1:  const _styles = {
        //   2:      fillScreen: RX.Styles.createViewStyle({
        //   3:          flex: 1,
        //   4:          flexDirection: 'column',
        //   5:          alignSelf: 'stretch'
        //   6:      }),
        //   7:      content: RX.Styles.createViewStyle({
        //   8:          flex: 1,
        //   9:          flexDirection: 'column',
        //   10:         alignSelf: 'stretch'
        //   11:     })
        //   12: };
        //
        // The StyleLeakDetector expects the JS engine to report to it that
        // the style for `fillScreen` occurs on line 2 and the style for `content`
        // occurs on line 7. However, Chakra reports that both `fillScreen` and
        // `content` occur on the same line (1) causing the StyleLeakDetector to
        // falsely report a style leak.

        return RN.Platform.OS === 'windows';
    }
}

export default new StyleLeakDetector();
