import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export interface WebViewState {
    postComplete?: boolean;
    webFormIdentifier?: string;
    webFrameIdentifier?: string;
}
export declare class WebView extends RX.WebView<WebViewState> {
    private static _webFrameNumber;
    constructor(props: Types.WebViewProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Types.WebViewProps, prevState: WebViewState): void;
    private _postRender();
    render(): JSX.Element;
    private _onLoad;
    private _sandboxToStringValue;
    postMessage(message: string, targetOrigin?: string): void;
    reload(): void;
    goBack(): void;
    goForward(): void;
}
export default WebView;
