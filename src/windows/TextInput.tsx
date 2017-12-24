/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Windows-specific implementation of the cross-platform TextInput abstraction.
*/

import React = require('react');
import RN = require('react-native');
import RNW = require('react-native-windows');

import {applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';

import {TextInput as TextInputBase} from '../native-common/TextInput';

// The enhanced TextInput can be accessed through the RN realm
RNW.TextInput = RN.TextInput;

export class TextInput extends TextInputBase implements FocusManagerFocusableComponent {

    protected _render(props: RN.TextInputProps): JSX.Element {

        return (
            <RNW.TextInput
            {...props}
            tabIndex = {this.getTabIndex()}
            onFocus = { (e: React.FocusEvent<any>) => this._onFocusEx(e, props.onFocus)}
        />)
            ;
    }

    private _onFocusEx (e: React.FocusEvent<any>, origHandler: ((e: React.FocusEvent<any>) => void) | undefined) {
        this.onFocus();

        if (origHandler) {
            origHandler(e);
        }
    }

    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number | undefined {
        // Focus Manager may override this
        return this.props.tabIndex;
    }

    updateNativeTabIndex(): void {
        let tabIndex: number | undefined = this.getTabIndex();
        (this.refs['nativeTextInput'] as any).setNativeProps({
            tabIndex: tabIndex
        });
    }
}

applyFocusableComponentMixin(TextInput);

export default TextInput;
