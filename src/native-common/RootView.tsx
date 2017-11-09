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
import _ = require('./lodashMini');

import Accessibility from './Accessibility';
import AccessibilityUtil from './AccessibilityUtil';
import { default as FrontLayerViewManager } from './FrontLayerViewManager';
import MainViewStore from './MainViewStore';
import Styles from './Styles';
import Types = require('../common/Types');

// Fields should be prefixed with 'reactxp' to help avoid naming collisions.
// All fields should be removed from this.props before passing downwards.
interface BaseRootViewProps {
    reactxp_rootViewId?: string;
}

interface RootViewPropsWithMainViewType extends BaseRootViewProps {
    reactxp_mainViewType: string;
}

interface RootViewState {
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

// Abstract RootView class which handles rendering, front layer view changes and announcement
// changes. Subclasses must set the mainView state value.
abstract class BaseRootView<P extends BaseRootViewProps> extends React.Component<P, RootViewState> {
    private _frontLayerViewChangedSubscription: SubscriptionToken|undefined;
    private _newAnnouncementEventChangedSubscription: SubscriptionToken|undefined;
    protected _mainViewProps: {};
    protected _rootViewId?: string | null;

    protected abstract _getPropsForMainView(): {};

    constructor(props: P) {
        super(props);
        this._mainViewProps = this._getPropsForMainView();
    }

    componentWillMount(): void {
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
    }

    componentWillUnmount(): void {
        if (this._frontLayerViewChangedSubscription) {
            this._frontLayerViewChangedSubscription.unsubscribe();
            this._frontLayerViewChangedSubscription = undefined;
        }

        if (this._newAnnouncementEventChangedSubscription) {
            this._newAnnouncementEventChangedSubscription.unsubscribe();
            this._newAnnouncementEventChangedSubscription = undefined;
        }
    }

    render() {
        const modalLayerView = FrontLayerViewManager.getModalLayerView(this._rootViewId);
        const popupLayerView = FrontLayerViewManager.getPopupLayerView(this._rootViewId);

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
}

// BaseRootView implementation that uses MainStore to set the main view.
class RootViewUsingStore extends BaseRootView<BaseRootViewProps> {
    private _changeListener = this._onChange.bind(this);

    constructor(props: BaseRootViewProps) {
        super(props);

        this.state = {
            mainView: undefined,
            announcementText: ''
        };
    }

    componentWillMount(): void {
        super.componentWillMount();

        MainViewStore.subscribe(this._changeListener);
        this.setState(this._getStateFromStore());
    }

    componentWillUnmount(): void {
        MainViewStore.unsubscribe(this._changeListener);
    }

    private _onChange() {
        this.setState(this._getStateFromStore());
    }

    private _getStateFromStore(): RootViewState {
        let mainView = MainViewStore.getMainView();

        if (mainView && _.isEqual(mainView.props, this._mainViewProps)) {
            mainView = React.cloneElement(mainView, this._mainViewProps);
        }

        return {
            mainView: mainView
        };
    }

    protected _getPropsForMainView(): {} {
        const { reactxp_rootViewId, ...mainViewProps } = this.props;
        return mainViewProps;
    }
}

// BaseRootView implementation that uses the value in props to set main view.
class RootViewUsingProps extends BaseRootView<RootViewPropsWithMainViewType> {
    constructor(props: RootViewPropsWithMainViewType) {
        super(props);

        if (!props.reactxp_rootViewId) {
            console.warn('Some APIs require a value for reactxp_rootViewId');
            this._rootViewId = null;
        } else {
            this._rootViewId = props.reactxp_rootViewId;
        }

        this.state = {
            mainView: React.createElement(props.reactxp_mainViewType, this._mainViewProps),
            announcementText: ''
        };
    }

    protected _getPropsForMainView(): {} {
        const { reactxp_mainViewType, reactxp_rootViewId, ...mainViewProps } = this.props;
        return mainViewProps;
    }
}

export {
    BaseRootViewProps,
    RootViewPropsWithMainViewType,
    RootViewState,
    BaseRootView,
    RootViewUsingStore as RootView,
    RootViewUsingProps,
};

export default RootViewUsingStore;
