/**
 * RootView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The top-most view that's used for proper layering or modals and popups.
 */

import * as React from 'react';
import * as RN from 'react-native';
import * as RNW from 'react-native-windows';

import { AccessibilityAnnouncer } from './AccessibilityAnnouncer';
import {
    BaseRootView,
    BaseRootViewProps,
    RootView as RootViewBase,
    RootViewPropsWithMainViewType,
    RootViewState,
    RootViewUsingProps as RootViewUsingPropsBase
} from '../native-desktop/RootView';

//
// We use a custom RNW provided component to capture key input before being dispatched to native controls.
// If support not present, we fallback to the base class implementation.
const _isRootInputViewSupported = !!RNW.RootInputViewWindows;

const _styles = RN.StyleSheet.create({
    appWrapperStyle : {
        flex: 1
    }
});

type Handler = (e: RN.NativeSyntheticEvent<any>) => void;

function _renderTopView(
    content: JSX.Element, onKeyDown: Handler, onKeyDownCapture: Handler, onKeyUp: Handler, onTouchStartCapture: Handler): JSX.Element {
    return (
        <RNW.RootInputViewWindows
            onTouchStartCapture={ onTouchStartCapture }
            onAccelKeyDown={ (e: RN.NativeSyntheticEvent<any>) => {onKeyDownCapture(e); onKeyDown(e); } }
            onAccelKeyUp={ onKeyUp }
            style={ _styles.appWrapperStyle }
        >
            { content }
        </RNW.RootInputViewWindows>
    );
}

class RootViewUsingStore extends RootViewBase {
    renderTopView(content: JSX.Element): JSX.Element {
        if (_isRootInputViewSupported) {
            return _renderTopView(
                content,
                this._onKeyDown,
                this._onKeyDownCapture,
                this._onKeyUp,
                this._onTouchStartCapture
            );
        } else {
            return super.renderTopView(content);
        }
    }

    protected _renderAnnouncerView(): JSX.Element {
        return (
            <AccessibilityAnnouncer />
        );
    }
}

class RootViewUsingProps extends RootViewUsingPropsBase {
    renderTopView(content: JSX.Element): JSX.Element {
        if (_isRootInputViewSupported) {
            return _renderTopView (
                content,
                this._onKeyDown,
                this._onKeyDownCapture,
                this._onKeyUp,
                this._onTouchStartCapture
            );
        } else {
            return super.renderTopView(content);
        }
    }

    protected _renderAnnouncerView(): JSX.Element {
        return (
            <AccessibilityAnnouncer />
        );
    }
}

export {
    BaseRootViewProps,
    RootViewPropsWithMainViewType,
    RootViewState,
    BaseRootView,
    RootViewUsingStore as RootView,
    RootViewUsingProps
};

export default RootViewUsingStore;
