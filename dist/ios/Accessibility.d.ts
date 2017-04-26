import { Accessibility as NativeAccessibility } from '../native-common/Accessibility';
export declare class Accessibility extends NativeAccessibility {
    private _announcementQueue;
    private _retryTimestamp;
    constructor();
    protected _updateScreenReaderStatus(isEnabled: boolean): void;
    announceForAccessibility(announcement: string): void;
    private _postAnnouncement(announcement, resetTimestamp?);
    private _recalcAnnouncement;
}
declare var _default: Accessibility;
export default _default;
