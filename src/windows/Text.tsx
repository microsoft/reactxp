/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Windows-specific implementation of the cross-platform Text abstraction.
*/

import AccessibilityUtil from '../native-common/AccessibilityUtil';
import PropTypes = require('prop-types');
import { Text as TextBase, TextContext as TextContextBase } from '../native-common/Text';
import Types = require('../common/Types');

import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';
export interface TextContext extends TextContextBase {
    isRxParentAFocusableInSameFMRealm?: boolean;
}

export class Text extends TextBase implements React.ChildContextProvider<TextContext>, FocusManagerFocusableComponent {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAFocusableInSameFMRealm: PropTypes.bool,
        ...TextBase.contextTypes
    };

    // Context is provided by super - just re-typing here
    context!: TextContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAFocusableInSameFMRealm: PropTypes.bool,
        ...TextBase.childContextTypes
    };

    requestFocus() {
        // UWP doesn't support casually focusing RN.Text elements. We override requestFocus in order to drop any focus requests
    }

    getChildContext(): TextContext {
        let childContext: TextContext = super.getChildContext();

        // This control will hide other "accessible focusable" controls as part of being restricted/limited by a focus manager
        // (more detailed description is in windows/View.tsx)
        childContext.isRxParentAFocusableInSameFMRealm = true;

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

    getImportantForAccessibility(): string | undefined {
        // Focus Manager may override this

        // Note: currently native-common flavor doesn't pass any accessibility properties to RN.TextInput.
        // This should ideally be fixed.
        // We force a default of Auto if no property is provided
        return AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility,
            Types.ImportantForAccessibility.Auto);
    }

    updateNativeTabIndexAndIFA(): void {
        if (this._mountedComponent) {
            let importantForAccessibility = this.getImportantForAccessibility();
            this._mountedComponent.setNativeProps({
                importantForAccessibility: importantForAccessibility
            });
        }
    }
}

// Text is focusable just by screen readers
applyFocusableComponentMixin(Text, function (this: Text, nextProps?: Types.TextProps, nextState?: any, nextCtx?: TextContext) {
    // This control should be tracked by a FocusManager if there's no other control tracked by the same focus manager in
    // the parent path
    return nextCtx && ('isRxParentAFocusableInSameFMRealm' in nextCtx)
        ? !nextCtx.isRxParentAFocusableInSameFMRealm : !this.context.isRxParentAFocusableInSameFMRealm;
}, true);

export default Text;
