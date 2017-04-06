/**
 * Button.tsx
 * Copyright: Microsoft 2017
 *
 * Android-specific implementation of Button component.
 */

import AccessibilityUtil from './AccessibilityUtil';
import { Button as CommonButton } from '../native-common/Button';

export class Button extends CommonButton {
    focus() {
        AccessibilityUtil.setAccessibilityFocus(this);
    }
}

export default Button;
