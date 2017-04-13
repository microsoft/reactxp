/**
* Picker.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Picker abstraction.
*/

import _ = require('./lodashMini');
import React = require('react');
import RN = require('react-native');

import RX = require('../common/Interfaces');

export class Picker extends RX.Picker {
    render() {
        return (
            <RN.Picker
                selectedValue={ this.props.selectedValue }
                onValueChange={ this.onValueChange }
                style={ this.props.style }
            >
                { _.map(this.props.items, (i, idx) => <RN.Picker.Item { ...i } key={ idx } /> ) }
            </RN.Picker>
        );
    }

    onValueChange = (itemValue: any, itemPosition: number) => {
        this.props.onValueChange(itemValue, itemPosition);
    }
}

export default Picker;
