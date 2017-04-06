/**
 * View.tsx
 * Copyright: Microsoft 2017
 *
 * Android-specific implementation of View component.
 */

import AccessibilityUtil from './AccessibilityUtil';
import { View as CommonView } from '../native-common/View';

export class View extends CommonView {
    focus() {
        AccessibilityUtil.setAccessibilityFocus(this);
    }
}

export default View;
