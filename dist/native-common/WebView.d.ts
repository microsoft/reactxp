import RX = require('../common/Interfaces');
export declare class WebView extends RX.WebView<{}> {
    render(): JSX.Element;
    reload(): void;
    goBack(): void;
    goForward(): void;
}
export default WebView;
