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
import Styles from './Styles';
import Types = require('../common/Types');

export class Picker extends RX.Picker {
    render() {
        return (
            <select
                style={ this._getStyles() as any }
                value={ this.props.selectedValue }
                onChange={ this._onValueChange }
            >
                { _.map(this.props.items, (i, idx) => <option value={ i.value } key={ idx }>{ i.label }</option> ) }
            </select>
        );
    }

    private _getStyles(): Types.PickerStyleRuleSet {
        return Styles.combine(this.props.style) as any;
    }

    private _onValueChange = (e: React.SyntheticEvent<any>) => {
        const selectEl = e.target as HTMLSelectElement;
        const selectedValue = selectEl.value;
        const selectedItemPosition = _.findIndex(this.props.items, i => i.value === selectedValue);

        this.props.onValueChange(selectedValue, selectedItemPosition);
    }
}

export default Picker;
