import RX = require('../common/Interfaces');
export declare class Picker extends RX.Picker {
    render(): JSX.Element;
    onValueChange: (itemValue: any, itemPosition: number) => void;
}
export default Picker;
