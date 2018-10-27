/**
 * TextInput.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform TextInput abstraction.
 */

import * as React from 'react';
import * as RN from 'react-native';

import AccessibilityUtil, { ImportantForAccessibilityValue } from '../native-common/AccessibilityUtil';
import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';
import { Types } from '../common/Interfaces';
import { TextInput as TextInputBase } from '../native-common/TextInput';

export class TextInput extends TextInputBase implements FocusManagerFocusableComponent {

    protected _render(props: RN.TextInputProps, onMount: (textInput: any) => void): JSX.Element {
        const extendedProps: RN.ExtendedTextInputProps = {
            tabIndex: this.getTabIndex()
        };

        return (
            <RN.TextInput
                { ...props }
                { ...extendedProps }
                ref={ onMount }
                importantForAccessibility={ this.getImportantForAccessibility() }
                onFocus={ (e: RN.NativeSyntheticEvent<RN.TextInputFocusEventData>) => { this._onFocusEx(e, props.onFocus); } }
            />
        );
    }

    private _onFocusEx(e: RN.NativeSyntheticEvent<RN.TextInputFocusEventData>, origHandler:
            ((e: RN.NativeSyntheticEvent<RN.TextInputFocusEventData>) => void) | undefined) {
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

    getImportantForAccessibility(): ImportantForAccessibilityValue | undefined {
        // Focus Manager may override this

        // Note: currently native-common flavor doesn't pass any accessibility properties to RN.TextInput.
        // This should ideally be fixed.
        // We force a default of Auto if no property is provided
        return AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility,
            Types.ImportantForAccessibility.Auto);
    }

    updateNativeAccessibilityProps(): void {
        if (this._mountedComponent) {
            const tabIndex = this.getTabIndex();
            const importantForAccessibility = this.getImportantForAccessibility();
            this._mountedComponent.setNativeProps({
                tabIndex: tabIndex,
                value: this.state.inputValue, // mandatory for some reason
                isTabStop: this.props.editable && tabIndex >= 0,
                importantForAccessibility: importantForAccessibility
            });
        }
    }
}

applyFocusableComponentMixin(TextInput);

export default TextInput;
