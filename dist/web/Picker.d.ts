import React = require('react');
import RX = require('../common/Interfaces');
export declare class Picker extends RX.Picker {
    render(): JSX.Element;
    onValueChange: (e: React.SyntheticEvent) => void;
}
export default Picker;
