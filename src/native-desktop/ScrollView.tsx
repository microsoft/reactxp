/**
 * ScrollView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows/OSX-specific implementation of the cross-platform ScrollView abstraction.
 */

import * as React from 'react';
import * as RN from 'react-native';

import EventHelpers from '../native-common/utils/EventHelpers';
import { ScrollView as ScrollViewBase } from '../native-common/ScrollView';

type ScrollViewProps = RN.ScrollViewProps & React.Props<RN.ScrollView>;

const isNativeWindows = RN.Platform.OS === 'windows';

export class ScrollView extends ScrollViewBase {
    protected _render(nativeProps: ScrollViewProps): JSX.Element {
        // Have to hack the windows/osx-specific onKeyDown into the props here.
        const updatedNativeProps: RN.ExtendedDesktopScrollViewProps = nativeProps;
        if (this.props.onKeyPress) {
            updatedNativeProps.onKeyDown = this._onKeyDown;
        }

        if (isNativeWindows) {
            updatedNativeProps.tabNavigation = this.props.tabNavigation;
            updatedNativeProps.disableKeyboardBasedScrolling = true;
        }

        return super._render(updatedNativeProps);
    }

    private _onKeyDown = (e: React.SyntheticEvent<any>) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    }
}

export default ScrollView;
