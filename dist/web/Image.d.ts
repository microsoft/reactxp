import React = require('react');
import SyncTasks = require('synctasks');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export interface ImageState {
    showImgTag?: boolean;
    xhrRequest?: boolean;
    displayUrl?: string;
}
export interface ImageContext {
    isRxParentAText?: boolean;
}
export declare class Image extends RX.Image<ImageState> {
    static contextTypes: React.ValidationMap<any>;
    context: ImageContext;
    static childContextTypes: React.ValidationMap<any>;
    getChildContext(): {
        isRxParentAText: boolean;
    };
    static prefetch(url: string): SyncTasks.Promise<boolean>;
    private _isMounted;
    private _nativeImageWidth;
    private _nativeImageHeight;
    constructor(props: Types.ImageProps);
    componentWillReceiveProps(nextProps: Types.ImageProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private _initializeAndSetState(props);
    private _handleXhrBlob(blob);
    private _startXhrImageFetch(props);
    private _actuallyStartXhrImageFetch(props);
    render(): JSX.Element;
    private _getStyles();
    private _onLoad;
    private _imgOnError;
    private _onError(err?);
    private _onMouseUp;
    getNativeWidth(): number;
    getNativeHeight(): number;
}
export default Image;
