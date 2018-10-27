/**
 * Text.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform Text abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ExtendedTextProps, NativeSyntheticEvent } from 'react-native';
import { TextWindowsSelectionChangeEventData as SelectionChangeEventData } from 'react-native-windows';

import AccessibilityUtil, { ImportantForAccessibilityValue } from '../native-common/AccessibilityUtil';
import { Types } from '../common/Interfaces';
import { Text as TextBase, TextContext as TextContextBase } from '../native-common/Text';

import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';
export interface TextContext extends TextContextBase {
    isRxParentAFocusableInSameFocusManager?: boolean;
}

export class Text extends TextBase implements React.ChildContextProvider<TextContext>, FocusManagerFocusableComponent {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAFocusableInSameFocusManager: PropTypes.bool,
        ...TextBase.contextTypes
    };

    private _selectedText = '';

    // Context is provided by super - just re-typing here
    context!: TextContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAFocusableInSameFocusManager: PropTypes.bool,
        ...TextBase.childContextTypes
    };

    protected _getExtendedProperties(): ExtendedTextProps {
        const superExtendedProps: ExtendedTextProps = super._getExtendedProperties();
        return {
            ...superExtendedProps,
            onSelectionChange: this._onSelectionChange
        };
    }

    private _onSelectionChange = (event: NativeSyntheticEvent<SelectionChangeEventData>) => {
        this._selectedText = event.nativeEvent.selectedText;
    }

    requestFocus() {
        // UWP doesn't support casually focusing RN.Text elements. We override requestFocus in order to drop any focus requests
    }

    getChildContext(): TextContext {
        const childContext: TextContext = super.getChildContext();

        // This control will hide other "accessible focusable" controls as part of being restricted/limited by a focus manager
        // (more detailed description is in windows/View.tsx)
        childContext.isRxParentAFocusableInSameFocusManager = true;

        return childContext;
    }

    // From FocusManagerFocusableComponent interface
    //
    onFocus() {
        // Focus Manager hook
        // Not used
    }

    getTabIndex(): number {
        // Not used
        return -1;
    }

    getImportantForAccessibility(): ImportantForAccessibilityValue | undefined {
        // Focus Manager may override this

        // We force a default of Auto if no property is provided
        return AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility,
            Types.ImportantForAccessibility.Auto);
    }

    updateNativeAccessibilityProps(): void {
        if (this._mountedComponent) {
            const importantForAccessibility = this.getImportantForAccessibility();
            this._mountedComponent.setNativeProps({
                importantForAccessibility: importantForAccessibility
            });
        }
    }

    getSelectedText(): string {
        return this._selectedText;
    }
}

// Text is focusable just by screen readers
applyFocusableComponentMixin(Text, function(this: Text, nextProps?: Types.TextProps, nextState?: any, nextCtx?: TextContext) {
    // This control should be tracked by a FocusManager if there's no other control tracked by the same FocusManager in
    // the parent path
    return nextCtx && ('isRxParentAFocusableInSameFocusManager' in nextCtx)
        ? !nextCtx.isRxParentAFocusableInSameFocusManager : !this.context.isRxParentAFocusableInSameFocusManager;
}, true);

export default Text;
