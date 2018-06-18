/**
* ScrollView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Windows-specific implementation of the cross-platform ScrollView abstraction.
*/

import React = require('react');
import RN = require('react-native');

import { ScrollView as ScrollViewBase } from '../native-common/ScrollView';
import EventHelpers from '../native-common/utils/EventHelpers';
import Types = require('../common/Types');

export class ScrollView extends ScrollViewBase {

    protected _render(props: Types.ScrollViewProps): JSX.Element {
        var onKeyDownCallback = this.props.onKeyPress ? this._onKeyDown : undefined;

        // TODO: #737970 Remove special case for UWP when this bug is fixed. The bug
        //   causes you to have to click twice instead of once on some pieces of UI in
        //   order for the UI to acknowledge your interaction.
        const keyboardShouldPersistTaps = 'always';

        let nativeProps = {
            ...props,
            onKeyDown: onKeyDownCallback,
            keyboardShouldPersistTaps: keyboardShouldPersistTaps,
            tabNavigation: this.props.tabNavigation,
            disableKeyboardBasedScrolling: true
    } as RN.ScrollViewProps;

        return (
            <RN.ScrollView { ...nativeProps }>
                { props.children }
            </RN.ScrollView>
        );
    }

    private _onKeyDown = (e: React.SyntheticEvent<any>) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    }
}

export default ScrollView;
