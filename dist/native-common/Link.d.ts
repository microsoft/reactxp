import RN = require('react-native');
import RX = require('../common/Interfaces');
export declare class Link extends RX.Link<{}> {
    setNativeProps(nativeProps: RN.TextProps): void;
    render(): JSX.Element;
    private _onPress;
    private _onLongPress;
}
export default Link;
