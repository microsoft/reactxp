/**
 * Text.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform Text abstraction.
 */

import * as PropTypes from 'prop-types';

import AccessibilityUtil, { ImportantForAccessibilityValue } from '../native-common/AccessibilityUtil';
import React = require('react');
import RN = require('react-native');
import { Text as TextBase, TextContext as TextContextBase } from '../native-common/Text';
import { Types } from '../common/Interfaces';

import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';
export interface TextContext extends TextContextBase {
    isRxParentAFocusableInSameFocusManager?: boolean;
}

export class Text extends TextBase implements React.ChildContextProvider<TextContext>, FocusManagerFocusableComponent {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAFocusableInSameFocusManager: PropTypes.bool,
        ...TextBase.contextTypes
    };

    private _selectedText: string = '';

    // Context is provided by super - just re-typing here
    context!: TextContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAFocusableInSameFocusManager: PropTypes.bool,
        ...TextBase.childContextTypes
    };

    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility);

        // The presence of any of the onPress or onContextMenu makes the RN.Text a potential touch responder
        const onPress = (this.props.onPress || this.props.onContextMenu) ? this._onPress : undefined;

        // The presence of an onContextMenu on this instance or on the first responder parent up the tree
        // should disable any system provided context menu
        const disableContextMenu = !!this.props.onContextMenu || !!this.context.isRxParentAContextMenuResponder;

        const extendedProps: RN.ExtendedTextProps = {
            maxContentSizeMultiplier: this.props.maxContentSizeMultiplier,
            disableContextMenu: disableContextMenu,
            onSelectionChange: this._onSelectionChange
        };

        return (
            <RN.Text
                style={ this._getStyles() as RN.StyleProp<RN.TextStyle> }
                ref={ this._onMount as any }
                importantForAccessibility={ importantForAccessibility }
                numberOfLines={ this.props.numberOfLines }
                allowFontScaling={ this.props.allowFontScaling }
                onPress={ onPress }
                selectable={ this.props.selectable }
                textBreakStrategy={ 'simple' }
                ellipsizeMode={ this.props.ellipsizeMode }
                testID={ this.props.testId }
                { ...extendedProps }
            >
                { this.props.children }
            </RN.Text>
        );
    }

    private _onSelectionChange = (selEvent: React.SyntheticEvent<RN.Text>) => {
        this._selectedText = (selEvent.nativeEvent as any).selectedText;
    }

    requestFocus() {
        // UWP doesn't support casually focusing RN.Text elements. We override requestFocus in order to drop any focus requests
    }

    getChildContext(): TextContext {
        let childContext: TextContext = super.getChildContext();

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
            let importantForAccessibility = this.getImportantForAccessibility();
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
applyFocusableComponentMixin(Text, function (this: Text, nextProps?: Types.TextProps, nextState?: any, nextCtx?: TextContext) {
    // This control should be tracked by a FocusManager if there's no other control tracked by the same FocusManager in
    // the parent path
    return nextCtx && ('isRxParentAFocusableInSameFocusManager' in nextCtx)
        ? !nextCtx.isRxParentAFocusableInSameFocusManager : !this.context.isRxParentAFocusableInSameFocusManager;
}, true);

export default Text;
