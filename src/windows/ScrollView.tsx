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

    protected _render(nativeProps: RN.ScrollViewProps & React.Props<RN.ScrollView>): JSX.Element {
        var onKeyDownCallback = this.props.onKeyPress ? this._onKeyDown : undefined;

        // Have to hack the windows-specific onKeyDown into the props here.
        const updatedNativeProps: any = {
            ...nativeProps,
            onKeyDown: onKeyDownCallback,
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
