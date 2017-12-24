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
import RNW = require('react-native-windows');
import {ScrollView as ScrollViewBase} from '../native-common/ScrollView';

import EventHelpers from '../native-common/utils/EventHelpers';

// The enhanced ScrollView can be accessed through the RN realm
RNW.ScrollView = RN.ScrollView;

export class ScrollView extends ScrollViewBase {

    protected _render(props: RN.ScrollViewProps): JSX.Element {

        var onKeyDownCallback = this.props.onKeyPress ?
                // We have a callback function, call the wrapper
                this._onKeyDown :
                undefined;

        // TODO: #737970 Remove special case for UWP when this bug is fixed. The bug
        //   causes you to have to click twice instead of once on some pieces of UI in
        //   order for the UI to acknowledge your interaction.
        const keyboardShouldPersistTaps = 'always';

        return (

            <RNW.ScrollView
                {...props}
                onKeyDown={ onKeyDownCallback }
                keyboardShouldPersistTaps={ keyboardShouldPersistTaps }
                tabNavigation={ this.props.tabNavigation }
                disableKeyboardBasedScrolling={true}
            >
                {props.children}
            </RNW.ScrollView>
        );
    }

    private _onKeyDown = (e: React.SyntheticEvent<any>) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    }
}

export default ScrollView;
