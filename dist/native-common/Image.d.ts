import RN = require('react-native');
import SyncTasks = require('synctasks');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Image extends RX.Image<{}> {
    static prefetch(url: string): SyncTasks.Promise<boolean>;
    private _isMounted;
    private _nativeImageWidth;
    private _nativeImageHeight;
    protected _getAdditionalProps(): RN.ImageProps;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    setNativeProps(nativeProps: RN.ImageProps): void;
    protected getStyles(): Types.ImageStyleRuleSet;
    private _onLoad;
    private _onError;
    getNativeWidth(): number;
    getNativeHeight(): number;
}
export default Image;
