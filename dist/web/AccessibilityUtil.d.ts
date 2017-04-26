import { AccessibilityUtil as CommonAccessibiltiyUtil } from '../common/AccessibilityUtil';
import Types = require('../common/Types');
export declare class AccessibilityUtil extends CommonAccessibiltiyUtil {
    accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string;
    accessibilityTraitToString(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[], defaultTrait?: Types.AccessibilityTrait): string;
    accessibilityTraitToAriaSelected(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[]): boolean;
}
declare var _default: AccessibilityUtil;
export default _default;
