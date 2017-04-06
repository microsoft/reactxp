/**
* Picker.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Select abstraction.
*/

import _ = require('./utils/lodashMini');
import React = require('react');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Picker extends RX.Picker {
    render() {
        return (
            <select value={ this.props.selectedValue } onChange={ this.onValueChange } style={ this.props.style }>
                { _.map(this.props.items, (i, idx) => <option value={ i.value } key={ idx }>{ i.label }</option> ) }
            </select>
        );
    }

    onValueChange = (e: Types.SyntheticEvent) => {
        const selectEl = e.target as HTMLSelectElement;
        const selectedValue = selectEl.value;
        const selectedItemPosition = _.findIndex(this.props.items, i => i.value === selectedValue);

        this.props.onValueChange(selectedValue, selectedItemPosition);
    }
}

export default Picker;
