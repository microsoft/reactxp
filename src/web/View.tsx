/**
 * View.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform View abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import AccessibilityUtil from './AccessibilityUtil';
import AnimateListEdits from './listAnimations/AnimateListEdits';
import AppConfig from '../common/AppConfig';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { applyFocusableComponentMixin, FocusManager } from './utils/FocusManager';
import { RestrictFocusType } from '../common/utils/FocusManager';
import { Types } from '../common/Interfaces';
import PopupContainerView from './PopupContainerView';
import { PopupComponent } from '../common/PopupContainerViewBase';
import restyleForInlineText from './utils/restyleForInlineText';
import Styles from './Styles';
import ViewBase from './ViewBase';

const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch'
    },

    // See resize detector comments in renderResizeDetectorIfNeeded() method below.
    resizeDetectorContainerStyles: {
        position: 'absolute',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        overflow: 'scroll',
        zIndex: '-1',
        visibility: 'hidden'
    },

    resizeGrowDetectorStyles: {
        position: 'absolute',
        left: '100500px',
        top: '100500px',
        width: '1px',
        height: '1px'
    },

    resizeShrinkDetectorStyles: {
        position: 'absolute',
        width: '150%',
        height: '150%'
    }
};

if (typeof document !== 'undefined') {
    const ignorePointerEvents = '.reactxp-ignore-pointer-events  * { pointer-events: auto; }';
    const head = document.head;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(ignorePointerEvents));
    head.appendChild(style);
}

export interface ViewContext {
    isRxParentAText?: boolean;
    focusManager?: FocusManager;
    popupContainer?: PopupContainerView;
    focusArbitrator?: FocusArbitratorProvider;
}

export class View extends ViewBase<Types.ViewProps, Types.Stateless> {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool,
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object,
        focusArbitrator: PropTypes.object
    };
    // Context is provided by super - just re-typing here
    context!: ViewContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object,
        focusArbitrator: PropTypes.object
    };

    private _focusManager: FocusManager | undefined;
    private _limitFocusWithin = false;
    private _isFocusLimited = false;
    private _isFocusRestricted: boolean | undefined;

    private _focusArbitratorProvider: FocusArbitratorProvider | undefined;

    private _resizeDetectorAnimationFrame: number | undefined;
    private _resizeDetectorNodes: { grow?: HTMLDivElement; shrink?: HTMLDivElement } = {};

    private _popupContainer: PopupContainerView | undefined;
    private _popupToken: PopupComponent | undefined;

    constructor(props: Types.ViewProps, context: ViewContext) {
        super(props, context);

        this._limitFocusWithin =
            (props.limitFocusWithin === Types.LimitFocusType.Limited) ||
            (props.limitFocusWithin === Types.LimitFocusType.Accessible);

        if (this.props.restrictFocusWithin || this._limitFocusWithin) {
            this._focusManager = new FocusManager(context && context.focusManager);

            if (this._limitFocusWithin) {
                this.setFocusLimited(true);
            }
        }

        this._popupContainer = context.popupContainer;

        if (props.arbitrateFocus) {
            this._updateFocusArbitratorProvider(props);
        }
    }

    private _renderResizeDetectorIfNeeded(containerStyles: any): React.ReactNode | null {
        // If needed, additional invisible DOM elements will be added inside the
        // view to track the size changes that are performed behind our back by
        // the browser's layout engine faster (ViewBase checks for the layout
        // updates once a second and sometimes it's not fast enough).

        // Unfortunately <div> doesn't have `resize` event, so we're trying to
        // detect the fact that the view has been resized with `scroll` events.
        // To do that, we create two scrollable <div>s and we put them into a
        // state in which `scroll` event is triggered by the browser when the
        // container gets resized (one element triggers `scroll` when the
        // container gets bigger, another triggers `scroll` when the container
        // gets smaller).

        if (!this.props.importantForLayout) {
            return null;
        }

        if (containerStyles.position !== 'relative') {
            if (AppConfig.isDevelopmentMode()) {
                console.error('View: importantForLayout property is applicable only for a view with relative position');
            }
            return null;
        }

        return [
            (
                <div
                    key={ 'grow' }
                    style={ _styles.resizeDetectorContainerStyles as any }
                    ref={ this._onResizeDetectorGrowRef }
                    onScroll={ this._resizeDetectorOnScroll }
                >
                    <div style={ _styles.resizeGrowDetectorStyles as any } />
                </div>
            ),
            (
                <div
                    key={ 'shrink' }
                    style={ _styles.resizeDetectorContainerStyles as any }
                    ref={ this._onResizeDetectorShrinkRef }
                    onScroll={ this._resizeDetectorOnScroll }
                >
                    <div style={ _styles.resizeShrinkDetectorStyles as any } />
                </div>
            )
        ];
    }

    private _onResizeDetectorGrowRef = (node: HTMLDivElement | null) => {
        this._resizeDetectorNodes.grow = node || undefined;
        this._resizeDetectorOnScroll();
    }

    private _onResizeDetectorShrinkRef = (node: HTMLDivElement | null) => {
        this._resizeDetectorNodes.shrink = node || undefined;
        this._resizeDetectorOnScroll();
    }

    private _resizeDetectorReset() {
        // Scroll the detectors to the bottom-right corner so
        // that `scroll` events will be triggered when the container
        // is resized.
        const scrollMax = 100500;

        let node = this._resizeDetectorNodes.grow;

        if (node) {
            node.scrollLeft = scrollMax;
            node.scrollTop = scrollMax;
        }

        node = this._resizeDetectorNodes.shrink;

        if (node) {
            node.scrollLeft = scrollMax;
            node.scrollTop = scrollMax;
        }
    }

    private _resizeDetectorOnScroll = () => {
        if (this._resizeDetectorAnimationFrame) {
            // Do not execute action more often than once per animation frame.
            return;
        }

        this._resizeDetectorAnimationFrame = window.requestAnimationFrame(() => {
            if (this._isMounted) {
                this._resizeDetectorReset();
                this._resizeDetectorAnimationFrame = undefined;
                ViewBase._checkViews();
            }
        });
    }

    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is not an Types.Text.
        // Because they're in an Types.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        const childContext: ViewContext = {
            isRxParentAText: false
        };

        // Provide the descendants with the focus manager and popup container (if any).
        if (this._focusManager) {
            childContext.focusManager = this._focusManager;
        }

        if (this._popupContainer) {
            childContext.popupContainer = this._popupContainer;
        }

        if (this._focusArbitratorProvider) {
            childContext.focusArbitrator = this._focusArbitratorProvider;
        }

        return childContext;
    }

    protected _getContainer(): HTMLElement | null {
        if (!this._isMounted) {
            return null;
        }
        try {
            return ReactDOM.findDOMNode(this) as HTMLElement | null;
        } catch {
            // Handle exception due to potential unmount race condition.
            return null;
        }
    }

    private _isHidden(): boolean {
        return !!this._popupContainer && this._popupContainer.isHidden();
    }

    private _updateFocusArbitratorProvider(props: Types.ViewProps) {
        if (props.arbitrateFocus) {
            if (this._focusArbitratorProvider) {
                this._focusArbitratorProvider.setCallback(props.arbitrateFocus);
            } else {
                this._focusArbitratorProvider = new FocusArbitratorProvider(this, props.arbitrateFocus);
            }
        } else if (this._focusArbitratorProvider) {
            delete this._focusArbitratorProvider;
        }
    }

    setFocusRestricted(restricted: boolean) {
        if (!this._focusManager || !this.props.restrictFocusWithin) {
            if (AppConfig.isDevelopmentMode()) {
                console.error('View: setFocusRestricted method requires restrictFocusWithin property to be set');
            }
            return;
        }

        if (!this._isHidden()) {
            if (restricted) {
                this._focusManager.restrictFocusWithin(RestrictFocusType.RestrictedFocusFirst);
            } else {
                this._focusManager.removeFocusRestriction();
            }
        }

        this._isFocusRestricted = restricted;
    }

    setFocusLimited(limited: boolean) {
        if (!this._focusManager || !this._limitFocusWithin) {
            if (AppConfig.isDevelopmentMode()) {
                console.error('View: setFocusLimited method requires limitFocusWithin property to be set');
            }
            return;
        }

        if (!this._isHidden()) {
            if (limited && !this._isFocusLimited) {
                this._focusManager.limitFocusWithin(this.props.limitFocusWithin!);
            } else if (!limited && this._isFocusLimited) {
                this._focusManager.removeFocusLimitation();
            }
        }

        this._isFocusLimited = limited;
    }

    render() {
        const combinedStyles = Styles.combine([_styles.defaultStyle, this.props.style]) as any;
        let ariaRole = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits);
        const tabIndex = this.props.tabIndex;
        const ariaSelected = AccessibilityUtil.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        const isAriaHidden = AccessibilityUtil.isHidden(this.props.importantForAccessibility);
        const accessibilityLabel = this.props.accessibilityLabel;
        const ariaLabelledBy = this.props.ariaLabelledBy;
        const ariaRoleDescription = this.props.ariaRoleDescription;
        const ariaLive = this.props.accessibilityLiveRegion ?
            AccessibilityUtil.accessibilityLiveRegionToString(this.props.accessibilityLiveRegion) :
            undefined;
        const ariaValueNow = this.props.ariaValueNow;

        if (!ariaRole && !accessibilityLabel && !ariaLabelledBy && !ariaRoleDescription && !ariaLive &&
                (ariaSelected === undefined) && (ariaValueNow === undefined) && (tabIndex === undefined)) {
            // When the accessibility properties are not specified, set role to none.
            // It tells the screen readers to skip the node, but unlike setting
            // aria-hidden to true, allows the sub DOM to be processed further.
            // This signigicantly improves the screen readers performance.
            ariaRole = 'none';
        }

        const props: React.HTMLAttributes<any> = {
            role: ariaRole,
            tabIndex: tabIndex,
            style: combinedStyles,
            title: this.props.title,
            'aria-label': accessibilityLabel,
            'aria-hidden': isAriaHidden,
            'aria-selected': ariaSelected,
            'aria-labelledby': ariaLabelledBy,
            'aria-roledescription': ariaRoleDescription,
            'aria-live': ariaLive,
            'aria-valuenow': ariaValueNow,
            onContextMenu: this.props.onContextMenu,
            onMouseEnter: this.props.onMouseEnter,
            onMouseLeave: this.props.onMouseLeave,
            onMouseOver: this.props.onMouseOver,
            onMouseMove: this.props.onMouseMove,
            draggable: this.props.onDragStart ? true : undefined,
            onDragStart: this.props.onDragStart,
            onDrag: this.props.onDrag,
            onDragEnd: this.props.onDragEnd,
            onDragEnter: this.props.onDragEnter,
            onDragOver: this.props.onDragOver,
            onDragLeave: this.props.onDragLeave,
            onDrop: this.props.onDrop,
            onClick: this.props.onPress,
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur,
            onKeyDown: this.props.onKeyPress,
            id: this.props.id
        };

        if (this.props.ignorePointerEvents) {
            props.className = 'reactxp-ignore-pointer-events';
            combinedStyles.pointerEvents = 'none';
        }

        let reactElement: React.ReactElement<any>;
        const childAnimationsEnabled = this.props.animateChildEnter || this.props.animateChildMove || this.props.animateChildLeave;
        if (childAnimationsEnabled) {
            reactElement = (
                <AnimateListEdits
                    { ...props }
                    data-test-id={ this.props.testId }
                    animateChildEnter={ this.props.animateChildEnter }
                    animateChildMove={ this.props.animateChildMove }
                    animateChildLeave={ this.props.animateChildLeave }
                >
                    { this.props.children }
                </AnimateListEdits>
            );
        } else {
            reactElement = (
                <div { ...props } data-test-id={ this.props.testId }>
                    { this._renderResizeDetectorIfNeeded(combinedStyles) }
                    { this.props.children }
                </div>
            );
        }

        return this.context.isRxParentAText ?
            restyleForInlineText(reactElement) :
            reactElement;
    }

    componentWillReceiveProps(nextProps: Types.ViewProps) {
        super.componentWillReceiveProps(nextProps);

        if (AppConfig.isDevelopmentMode()) {
            if (this.props.restrictFocusWithin !== nextProps.restrictFocusWithin) {
                console.error('View: restrictFocusWithin is readonly and changing it during the component life cycle has no effect');
            }
            if (this.props.limitFocusWithin !== nextProps.limitFocusWithin) {
                console.error('View: limitFocusWithin is readonly and changing it during the component life cycle has no effect');
            }
        }

        if (('arbitrateFocus' in nextProps) && (this.props.arbitrateFocus !== nextProps.arbitrateFocus)) {
            this._updateFocusArbitratorProvider(nextProps);
        }
    }

    enableFocusManager() {
        if (this._focusManager) {
            if (this.props.restrictFocusWithin && this._isFocusRestricted !== false) {
                this._focusManager.restrictFocusWithin(RestrictFocusType.RestrictedFocusFirst);
            }

            if (this._limitFocusWithin && this._isFocusLimited) {
                this._focusManager.limitFocusWithin(this.props.limitFocusWithin!);
            }
        }
    }

    disableFocusManager() {
        if (this._focusManager) {
            this._focusManager.release();
        }
    }

    componentDidMount() {
        super.componentDidMount();

        if (this.props.autoFocus) {
            this.requestFocus();
        }

        // If we are mounted as visible, do our initialization now. If we are hidden, it will
        // be done later when the popup is shown.
        if (!this._isHidden()) {
            this.enableFocusManager();
        }

        if (this._focusManager && this._popupContainer) {
            this._popupToken = this._popupContainer.registerPopupComponent(
                () => this.enableFocusManager(), () => this.disableFocusManager());
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.disableFocusManager();

        if (this._popupToken) {
            this._popupContainer!.unregisterPopupComponent(this._popupToken);
        }
    }

    blur() {
        const el = this._getContainer();
        if (el) {
            el.blur();
        }
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => this._isMounted
        );
    }

    focus() {
        const el = this._getContainer();
        if (el) {
            el.focus();
        }
    }
}

applyFocusableComponentMixin(View, function(this: View, nextProps?: Types.ViewProps) {
    // VoiceOver with the VoiceOver key combinations (Ctrl+Option+Left/Right) focuses
    // <div>s when whatever tabIndex is set (even if tabIndex=-1). So, View is focusable
    // when tabIndex is not undefined.
    const tabIndex = nextProps && ('tabIndex' in nextProps) ? nextProps.tabIndex : this.props.tabIndex;
    return tabIndex !== undefined;
});

export default View;
