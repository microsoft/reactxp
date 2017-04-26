import Types = require('../common/Types');
export declare class StyleLeakDetector {
    private _fingerprintRegistry;
    private _getFingerprint<T>(object);
    /**
     * We need to sort objects before using JSON.stringify as otherwise objects
     * {a: 1, b: 2} and {b: 2, a: 1} would have a different fingerprints
     */
    private _sortAny(object);
    private _sortObject(object);
    private _sortArray(object);
    protected isDisabled(): boolean;
    detectLeaks<T extends Types.ViewAndImageCommonStyle>(style: T): void;
}
declare var instance: StyleLeakDetector;
export default instance;
