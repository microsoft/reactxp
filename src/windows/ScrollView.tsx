/**
 * ScrollView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform ScrollView abstraction.
 */

import * as React from 'react';
import * as RN from 'react-native';

import { ScrollView as ScrollViewBase } from '../native-common/ScrollView';
import EventHelpers from '../native-common/utils/EventHelpers';

export class ScrollView extends ScrollViewBase {

    protected _render(nativeProps: RN.ScrollViewProps&React.Props<RN.ScrollView>): JSX.Element {
        var onKeyDownCallback = this.props.onKeyPress ? this._onKeyDown : undefined;

        // TODO: #737970 Remove special case for UWP when this bug is fixed. The bug
        //   causes you to have to click twice instead of once on some pieces of UI in
        //   order for the UI to acknowledge your interaction.
        const keyboardShouldPersistTaps = 'always';

        // Have to hack the windows-specific onKeyDown into the props here.
        const updatedNativeProps: any = {
            ...nativeProps,
            onKeyDown: onKeyDownCallback,
            keyboardShouldPersistTaps: keyboardShouldPersistTaps,
            tabNavigation: this.props.tabNavigation,
            disableKeyboardBasedScrolling: true,
        };

        return super._render(updatedNativeProps);
    }

    private _onKeyDown = (e: React.SyntheticEvent<any>) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    }
}

export default ScrollView;
