/**
 * Link.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Link abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as RN from 'react-native';

import AccessibilityUtil from './AccessibilityUtil';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import EventHelpers from './utils/EventHelpers';
import * as RX from '../common/Interfaces';
import Linking from '../native-common/Linking';

export interface LinkContext {
    focusArbitrator?: FocusArbitratorProvider;
    isRxParentAText?: boolean;
}

export class LinkBase<S> extends React.Component<RX.Types.LinkProps, S> {
    static contextTypes = {
        focusArbitrator: PropTypes.object,
        isRxParentAText: PropTypes.bool
    };

    context!: LinkContext;

    protected _mountedComponent: RN.Text | undefined;
    protected _isMounted = false;

    // To be able to use Link inside TouchableHighlight/TouchableOpacity
    setNativeProps(nativeProps: RN.TextProps) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    }

    render() {
        const internalProps: RN.ExtendedTextProps = {
            style: this.props.style as any,
            numberOfLines: this.props.numberOfLines === 0 ? undefined : this.props.numberOfLines,
            onPress: this._onPress,
            onLongPress: this._onLongPress,
            allowFontScaling: this.props.allowFontScaling,
            maxContentSizeMultiplier: this.props.maxContentSizeMultiplier,
            children: this.props.children,
            tooltip: this.props.title,
            testID: this.props.testId
        };

        return this._render(internalProps, this._onMount);
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    protected _render(internalProps: RN.TextProps, onMount: (text: RN.Text | null) => void) {
        return (
            <RN.Text { ...internalProps } ref={ onMount }/>
        );
    }

    protected _onMount = (component: RN.Text | null) => {
        this._mountedComponent = component || undefined;
    }

    protected _onPress = (e: RX.Types.SyntheticEvent) => {
        if (EventHelpers.isRightMouseButton(e)) {
            if (this.props.onContextMenu) {
                this.props.onContextMenu(EventHelpers.toMouseEvent(e));
            }
            return;
        }

        if (this.props.onPress) {
            this.props.onPress(EventHelpers.toMouseEvent(e), this.props.url);
            return;
        }

        // The default action is to launch a browser.
        if (this.props.url) {
            Linking.openUrl(this.props.url).catch(err => {
                // Catch the exception so it doesn't propagate.
            });
        }
    }

    protected _onLongPress = (e: RX.Types.SyntheticEvent) => {
        // Right mouse button doesn't change behavior based on press length.
        if (EventHelpers.isRightMouseButton(e)) {
            if (this.props.onContextMenu) {
                this.props.onContextMenu(EventHelpers.toMouseEvent(e));
            }
            return;
        }

        if (!EventHelpers.isRightMouseButton(e) && this.props.onLongPress) {
            this.props.onLongPress(EventHelpers.toMouseEvent(e), this.props.url);
        }
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => !!this._mountedComponent
        );
    }

    focus() {
        if (this._mountedComponent) {
            AccessibilityUtil.setAccessibilityFocus(this);
        }
        if (this._mountedComponent && this._mountedComponent.focus) {
            this._mountedComponent.focus();
        }
    }

    blur() {
        if (this._mountedComponent && this._mountedComponent.blur) {
            this._mountedComponent.blur();
        }
    }
}

export class Link extends LinkBase<{}> {

}

export default Link;
