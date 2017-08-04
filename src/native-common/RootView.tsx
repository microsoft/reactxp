/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
*/

import React = require('react');
import RN = require('react-native');
import { SubscriptionToken } from 'subscribableevent';

import Accessibility from './Accessibility';
import AccessibilityUtil from './AccessibilityUtil';
import { default as FrontLayerViewManager } from './FrontLayerViewManager';
import MainViewStore from './MainViewStore';
import Styles from './Styles';
import Types = require('../common/Types');

export interface RootViewState {
    mainView?: RN.ReactElement<any>;
    announcementText?: string;
}

const _styles = {
    rootViewStyle: Styles.createViewStyle ({
        flex: 1,
        alignItems: 'stretch',
        overflow: 'visible'
    }),
    liveRegionContainer: Styles.createViewStyle({
        position: 'absolute',
        opacity: 0,
        top: -30,
        bottom: 0,
        left: 0,
        right: 0,
        height: 30
    })
};

export class RootView extends React.Component<{}, RootViewState> {
    private _changeListener = this._onChange.bind(this);
    private _frontLayerViewChangedSubscription: SubscriptionToken = null;
    private _newAnnouncementEventChangedSubscription: SubscriptionToken = null;

    constructor() {
        super();
        this.state = {
            mainView: null,
            announcementText: ''
        };
    }

    componentWillMount(): void {
        MainViewStore.subscribe(this._changeListener);

        this._frontLayerViewChangedSubscription = FrontLayerViewManager.event_changed.subscribe(() => {
            // Setting empty state will trigger a render.
            this.setState({});
        });

        // Update announcement text.
        this._newAnnouncementEventChangedSubscription =
            Accessibility.newAnnouncementReadyEvent.subscribe(announcement => {
                this.setState({
                    announcementText: announcement
                });
        });

        this.setState(this._getStateFromStore());
    }

    componentWillUnmount(): void {
        this._frontLayerViewChangedSubscription.unsubscribe();
        this._frontLayerViewChangedSubscription = null;
        this._newAnnouncementEventChangedSubscription.unsubscribe();
        this._newAnnouncementEventChangedSubscription = null;
        MainViewStore.unsubscribe(this._changeListener);
    }

    render() {
        const modalLayerView = FrontLayerViewManager.getModalLayerView(this);
        const popupLayerView = FrontLayerViewManager.getPopupLayerView(this);

        // When showing a modal/popup we want to hide the mainView shown behind from an accessibility
        // standpoint to ensure that it won't get the focus and the screen reader's attention.
        const importantForAccessibility   =  (modalLayerView  ||  popupLayerView)  ? 
            AccessibilityUtil.importantForAccessibilityToString(Types.ImportantForAccessibility.NoHideDescendants)   :
            undefined;  // default

        return (
            <RN.Animated.View style={ _styles.rootViewStyle }>
                <RN.View 
                    style={ _styles.rootViewStyle }
                    importantForAccessibility={ importantForAccessibility }>
                    { this.state.mainView }
                </RN.View>
                { modalLayerView }
                { popupLayerView }
                <RN.View
                    style={ _styles.liveRegionContainer }
                    accessibilityLabel={ this.state.announcementText }
                    accessibilityLiveRegion={ AccessibilityUtil.accessibilityLiveRegionToString(Types.AccessibilityLiveRegion.Polite) }
                />
            </RN.Animated.View>
        );
    }

    private _onChange() {
        this.setState(this._getStateFromStore());
    }

    private _getStateFromStore(): RootViewState {
        let mainView = MainViewStore.getMainView();

        if (mainView && this.props) {
            mainView = React.cloneElement(mainView, this.props);
        }

        return {
            mainView: mainView
        };
    }
}

export default RootView;
