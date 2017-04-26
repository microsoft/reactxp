import { Accessibility as CommonAccessibility } from '../common/Accessibility';
export declare class Accessibility extends CommonAccessibility {
    protected _isScreenReaderEnabled: boolean;
    constructor();
    protected _updateScreenReaderStatus(isEnabled: boolean): void;
    isScreenReaderEnabled(): boolean;
}
declare var _default: Accessibility;
export default _default;
