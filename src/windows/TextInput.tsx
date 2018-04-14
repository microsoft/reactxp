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

import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';

import { TextInput as TextInputBase } from '../native-common/TextInput';

export class TextInput extends TextInputBase implements FocusManagerFocusableComponent {

    protected _render(props: RN.TextInputProps): JSX.Element {
        return (
            <RN.TextInput
                { ...props }
                tabIndex={ this.getTabIndex() }
                onFocus={ (e: React.FocusEvent<any>) => this._onFocusEx(e, props.onFocus) }
            />
        );
    }

    private _onFocusEx (e: React.FocusEvent<any>, origHandler: ((e: React.FocusEvent<any>) => void) | undefined) {
        if (e.currentTarget === e.target) {
            this.onFocus();
        }

        if (origHandler) {
            origHandler(e);
        }
    }

    // From FocusManagerFocusableComponent interface
    //
    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number {
        // Focus Manager may override this
        return this.props.tabIndex || 0;
    }

    updateNativeTabIndex(): void {
        if (this._mountedComponent) {
            let tabIndex = this.getTabIndex();
            this._mountedComponent.setNativeProps({
                tabIndex: tabIndex,
                value: this.state.inputValue, // mandatory for some reason
                isTabStop: this.props.editable && tabIndex >= 0
            });
        }
    }
}

applyFocusableComponentMixin(TextInput);

export default TextInput;
