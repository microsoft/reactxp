import { AccessibilityUtil as CommonAccessibilityUtil } from '../common/AccessibilityUtil';
import Types = require('../common/Types');
export declare class AccessibilityUtil extends CommonAccessibilityUtil {
    accessibilityTraitToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[], defaultTrait?: Types.AccessibilityTrait): string[];
    accessibilityComponentTypeToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[], defaultTrait?: Types.AccessibilityTrait): string;
    accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string;
}
declare var _default: AccessibilityUtil;
export default _default;
