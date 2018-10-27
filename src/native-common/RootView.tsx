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
import { SubscriptionToken } from 'subscribableevent';

import Accessibility from './Accessibility';
import AccessibilityUtil from './AccessibilityUtil';
import App from './App';
import AppConfig from '../common/AppConfig';
import FrontLayerViewManager from './FrontLayerViewManager';
import { Types } from '../common/Interfaces';
import { isEqual } from './utils/lodashMini';
import MainViewStore from './MainViewStore';
import Styles from './Styles';
import UserInterface from '../native-common/UserInterface';

// Fields should be prefixed with 'reactxp' to help avoid naming collisions.
// All fields should be removed from this.props before passing downwards.
interface BaseRootViewProps {
    reactxp_rootViewId?: string;
}

interface RootViewPropsWithMainViewType extends BaseRootViewProps {
    reactxp_mainViewType: string;
}

interface RootViewState {
    mainView?: any;
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
    private _frontLayerViewChangedSubscription: SubscriptionToken | undefined;
    private _newAnnouncementEventChangedSubscription: SubscriptionToken | undefined;
    private _memoryWarningEventSubscription: SubscriptionToken | undefined;
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

        this._memoryWarningEventSubscription = App.memoryWarningEvent.subscribe(() => {
            FrontLayerViewManager.releaseCachedPopups();
            this.forceUpdate();
        });
    }

    componentDidMount(): void {
        if (this._rootViewId) {
            UserInterface.notifyRootViewInstanceCreated(this._rootViewId, RN.findNodeHandle(this)!);
        }
    }

    componentWillUnmount(): void {
        if (this._rootViewId) {
            UserInterface.notifyRootViewInstanceDestroyed(this._rootViewId);
        }

        if (this._frontLayerViewChangedSubscription) {
            this._frontLayerViewChangedSubscription.unsubscribe();
            this._frontLayerViewChangedSubscription = undefined;
        }

        if (this._newAnnouncementEventChangedSubscription) {
            this._newAnnouncementEventChangedSubscription.unsubscribe();
            this._newAnnouncementEventChangedSubscription = undefined;
        }

        if (this._memoryWarningEventSubscription) {
            this._memoryWarningEventSubscription.unsubscribe();
            this._memoryWarningEventSubscription = undefined;
        }
    }

    render() {
        const modalLayerView = FrontLayerViewManager.getModalLayerView(this._rootViewId);
        const popupLayerView = FrontLayerViewManager.getPopupLayerView(this._rootViewId);
        const isActivePopup = FrontLayerViewManager.isPopupActiveFor(this._rootViewId);
        const announcerView = this._renderAnnouncerView();

        // When showing a modal/popup we want to hide the mainView shown behind from an accessibility
        // standpoint to ensure that it won't get the focus and the screen reader's attention.
        const importantForAccessibility = (modalLayerView || isActivePopup) ?
            AccessibilityUtil.importantForAccessibilityToString(Types.ImportantForAccessibility.NoHideDescendants) :
            undefined;  // default

        const content = (
            <RN.Animated.View style={ _styles.rootViewStyle }>
                <RN.View
                    style={ _styles.rootViewStyle as RN.StyleProp<RN.ViewStyle> }
                    importantForAccessibility={ importantForAccessibility }
                >
                    { this.state.mainView }
                </RN.View>
                { modalLayerView }
                { popupLayerView }
                { announcerView }
            </RN.Animated.View>
        );

        return this.renderTopView(content);
    }

    protected _renderAnnouncerView(): JSX.Element {
        return (
            <RN.View
                style={ _styles.liveRegionContainer as RN.StyleProp<RN.ViewStyle> }
                accessibilityLabel={ this.state.announcementText }
                accessibilityLiveRegion={ AccessibilityUtil.accessibilityLiveRegionToString(Types.AccessibilityLiveRegion.Assertive) }
            />
        );
    }

    renderTopView(content: JSX.Element): JSX.Element {
        return  content;
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
        super.componentWillUnmount();
        MainViewStore.unsubscribe(this._changeListener);
    }

    private _onChange() {
        this.setState(this._getStateFromStore());
    }

    private _getStateFromStore(): RootViewState {
        let mainView = MainViewStore.getMainView();

        if (mainView && !isEqual(mainView.props, this._mainViewProps)) {
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
            if (AppConfig.isDevelopmentMode()) {
                console.warn('Some APIs require a value for reactxp_rootViewId');
            }
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
    RootViewUsingProps
};

export default RootViewUsingStore;
