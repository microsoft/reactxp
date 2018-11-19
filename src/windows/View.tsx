/**
 * View.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Windows-specific implementation of View.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as RN from 'react-native';
import * as RNW from 'react-native-windows';

import AccessibilityUtil, { ImportantForAccessibilityValue } from '../native-common/AccessibilityUtil';
import AppConfig from '../common/AppConfig';
import EventHelpers from '../native-common/utils/EventHelpers';
import {
    applyFocusableComponentMixin,
    FocusManager,
    FocusManagerFocusableComponent
} from '../native-desktop/utils/FocusManager';
import { RestrictFocusType } from '../common/utils/FocusManager';
import { Types } from '../common/Interfaces';
import * as _ from '../native-common/utils/lodashMini';
import PopupContainerView from '../native-common/PopupContainerView';
import { PopupComponent } from '../common/PopupContainerViewBase';
import UserInterface from '../native-common/UserInterface';
import { View as ViewCommon, ViewContext as ViewContextCommon } from '../native-common/View';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;
const KEY_CODE_F10 = 121;
const KEY_CODE_APP = 500;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER, KEY_CODE_F10, KEY_CODE_APP];
const UP_KEYCODES = [KEY_CODE_SPACE];

export interface ViewContext extends ViewContextCommon {
    isRxParentAText?: boolean;
    focusManager?: FocusManager;
    popupContainer?: PopupContainerView;
    isRxParentAContextMenuResponder?: boolean;
    isRxParentAFocusableInSameFocusManager?: boolean;
}

const FocusableView = RNW.createFocusableComponent(RN.View);
const FocusableAnimatedView = RNW.createFocusableComponent(RN.Animated.View);

export class View extends ViewCommon implements React.ChildContextProvider<ViewContext>, FocusManagerFocusableComponent {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool,
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object,
        ...ViewCommon.contextTypes
    };
    // Context is provided by super - just re-typing here
    context!: ViewContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object,
        isRxParentAContextMenuResponder: PropTypes.bool,
        isRxParentAFocusableInSameFocusManager: PropTypes.bool,
        ...ViewCommon.childContextTypes
    };

    // Offset to show context menu using keyboard.
    protected _getContextMenuOffset() {
        return { x: 0, y: 0 };
    }

    private _onKeyDown: ((e: React.SyntheticEvent<any>) => void) | undefined;
    private _onMouseEnter: ((e: React.SyntheticEvent<any>) => void) | undefined;
    private _onMouseLeave: ((e: React.SyntheticEvent<any>) => void) | undefined;
    private _onMouseOver: ((e: React.SyntheticEvent<any>) => void) | undefined;
    private _onMouseMove: ((e: React.SyntheticEvent<any>) => void) | undefined;

    private _focusableElement : RNW.FocusableWindows<RN.ViewProps> | null = null;

    private _focusManager: FocusManager | undefined;
    private _limitFocusWithin = false;
    private _isFocusLimited = false;
    private _isFocusRestricted: boolean | undefined;

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

        if (this._focusManager) {
            this._focusManager.setRestrictionStateCallback(this._focusRestrictionCallback.bind(this));
        }

        // If we are mounted as visible, do our initialization now. If we are hidden, it will
        // be done later when the popup is shown.
        if (!this._isHidden()) {
            this.enableFocusManager();
        }

        if (this._focusManager && this._popupContainer) {
            this._popupToken = this._popupContainer.registerPopupComponent(
                () => this.enableFocusManager(), () => { this.disableFocusManager(); });
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.disableFocusManager();

        if (this._focusManager) {
            this._focusManager.setRestrictionStateCallback(undefined);
        }
        if (this._popupToken) {
            this._popupContainer!.unregisterPopupComponent(this._popupToken);
        }
    }

    private _hasTrait(trait: Types.AccessibilityTrait, traits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined) {
        return traits === trait || (Array.isArray(traits) && traits.indexOf(trait) !== -1);
    }

    private _showContextMenu(keyEvent: Types.KeyboardEvent) {
        if (this._isMounted) {
            UserInterface.measureLayoutRelativeToWindow(this).then( layoutInfo => {
                // need to simulate the mouse event so that we
                // can show the context menu in the right position
                if (this._isMounted) {
                    const mouseEvent = EventHelpers.keyboardToMouseEvent(keyEvent, layoutInfo, this._getContextMenuOffset());
                    if (this.props.onContextMenu) {
                        this.props.onContextMenu(mouseEvent);
                    }
                }
            });
        }
    }

    protected _buildInternalProps(props: Types.ViewProps) {
        // Base class does the bulk of _internalprops creation
        super._buildInternalProps(props);

        // On Windows a view with importantForAccessibility='Yes' or
        // non-empty accessibilityLabel and importantForAccessibility='Auto' (or unspecified) will hide its children.
        // However, a view that is also a group or a dialog should keep children visible to UI Automation.
        // The following condition checks and sets RN importantForAccessibility property
        // to 'yes-dont-hide-descendants' to keep view children visible.
        const hasGroup = this._hasTrait(Types.AccessibilityTrait.Group, props.accessibilityTraits);
        const hasDialog = this._hasTrait(Types.AccessibilityTrait.Dialog, props.accessibilityTraits);
        const i4aYes = props.importantForAccessibility === Types.ImportantForAccessibility.Yes;
        const i4aAuto = (props.importantForAccessibility === Types.ImportantForAccessibility.Auto
            || props.importantForAccessibility === undefined);
        const hasLabel = props.accessibilityLabel && props.accessibilityLabel.length > 0;
        if ((hasGroup || hasDialog) && (i4aYes || (i4aAuto && hasLabel))) {
            this._internalProps.importantForAccessibility = 'yes-dont-hide-descendants';
        }

        if (props.onKeyPress) {

            // Define the handler for "onKeyDown" on first use, it's the safest way when functions
            // called from super constructors are involved. Ensuring nothing happens here if a
            // tabIndex is specified else KeyDown is handled twice, in _onFocusableKeyDown as well.
            if (this.props.tabIndex === undefined) {
                if (!this._onKeyDown) {
                    this._onKeyDown =  (e: Types.SyntheticEvent) => {
                        const keyEvent = EventHelpers.toKeyboardEvent(e);
                        if (this.props.onKeyPress) {
                            // A conversion to a KeyboardEvent looking event is needed
                            this.props.onKeyPress(keyEvent);
                        }

                        // This needs to be handled when there is no
                        // tabIndex so we do not lose the bubbled events
                        if (this.props.onContextMenu) {
                            const key = keyEvent.keyCode;
                            if ((key === KEY_CODE_APP) || (key === KEY_CODE_F10 && keyEvent.shiftKey)) {
                                this._showContextMenu(keyEvent);
                            }
                        }
                    };
                }
                // "onKeyDown" is fired by native buttons and bubbles up to views
                this._internalProps.onKeyDown = this._onKeyDown;
            }
        }

        // Drag and drop related properties
        for (const name of ['onDragEnter', 'onDragOver', 'onDrop', 'onDragLeave']) {
            const handler = this._internalProps[name];

            if (handler) {
                this._internalProps.allowDrop = true;

                this._internalProps[name] = (e: React.SyntheticEvent<View>) => {
                    handler({
                        dataTransfer: (e.nativeEvent as any).dataTransfer,

                        stopPropagation() {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            }
                        },

                        preventDefault() {
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        }
                    });
                };
            }
        }

        // Drag and drop related properties
        for (const name of ['onDragStart', 'onDrag', 'onDragEnd']) {
            const handler = this._internalProps[name];

            if (handler) {
                if (name === 'onDragStart') {
                    this._internalProps.allowDrag = true;
                }

                this._internalProps[name] = (e: React.SyntheticEvent<View>) => {
                    handler({
                        dataTransfer: (e.nativeEvent as any).dataTransfer,

                        stopPropagation() {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            }
                        },

                        preventDefault() {
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        }
                    });
                };
            }
        }

        // Mouse events (using same lazy initialization as for onKeyDown)
        if (props.onMouseEnter) {
            if (!this._onMouseEnter) {
                this._onMouseEnter =  (e: React.SyntheticEvent<any>) => {
                    if (this.props.onMouseEnter) {
                         this.props.onMouseEnter(EventHelpers.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseEnter = this._onMouseEnter;
        }

        if (props.onMouseLeave) {
            if (!this._onMouseLeave) {
                this._onMouseLeave =  (e: React.SyntheticEvent<any>) => {
                    if (this.props.onMouseLeave) {
                         this.props.onMouseLeave(EventHelpers.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseLeave = this._onMouseLeave;
        }

        if (props.onMouseOver) {
            if (!this._onMouseOver) {
                this._onMouseOver =  (e: React.SyntheticEvent<any>) => {
                    if (this.props.onMouseOver) {
                         this.props.onMouseOver(EventHelpers.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseOver = this._onMouseOver;
        }

        if (props.onMouseMove) {
            if (!this._onMouseMove) {
                this._onMouseMove =  (e: React.SyntheticEvent<any>) => {
                    if (this.props.onMouseMove) {
                         this.props.onMouseMove(EventHelpers.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseMove = this._onMouseMove;
        }
    }

    render(): JSX.Element {
        if (this.props.tabIndex !== undefined) {
            const tabIndex: number = this.getTabIndex() || 0;
            const windowsTabFocusable: boolean =  tabIndex >= 0;
            const importantForAccessibility: string | undefined = this.getImportantForAccessibility();

            // We don't use 'string' ref type inside ReactXP
            const originalRef = this._internalProps.ref;
            if (typeof originalRef === 'string') {
                throw new Error('View: ReactXP must not use string refs internally');
            }
            const componentRef: Function = originalRef as Function;

            const focusableViewProps: RNW.FocusableWindowsProps<RN.ViewProps> = {
                ...this._internalProps,
                ref: this._onFocusableRef,
                componentRef: componentRef,
                isTabStop: windowsTabFocusable,
                tabIndex: tabIndex,
                importantForAccessibility: importantForAccessibility,
                disableSystemFocusVisuals: false,
                handledKeyDownKeys: DOWN_KEYCODES,
                handledKeyUpKeys: UP_KEYCODES,
                onKeyDown: this._onFocusableKeyDown,
                onKeyUp: this._onFocusableKeyUp,
                onFocus: this._onFocus,
                onBlur: this._onBlur,
                onAccessibilityTap: this._internalProps.onPress,
                testID: this.props.testId
            };

            const PotentiallyAnimatedFocusableView = this._isButton(this.props) ? FocusableAnimatedView : FocusableView;
            return (
                <PotentiallyAnimatedFocusableView
                    { ...focusableViewProps }
                />
            );
        } else {
            return super.render();
        }
    }

    private _onFocusableRef = (btn: RNW.FocusableWindows<RN.ViewProps>): void => {
        this._focusableElement = btn;
    }

    requestFocus() {
        if (!this._focusableElement) {
            // Views with no tabIndex (even if -1) can't receive focus
            if (AppConfig.isDevelopmentMode()) {
                console.error('View: requestFocus called on a non focusable element');
            }
            return;
        }

        super.requestFocus();
    }

    focus() {
        // Only forward to Button.
        // The other cases are RN.View based elements with no meaningful focus support
        if (this._focusableElement) {
            this._focusableElement.focus();
        } else {
            if (AppConfig.isDevelopmentMode()) {
                console.error('View: focus called on a non focusable element');
            }
        }
    }

    blur() {
        // Only forward to Button.
        // The other cases are RN.View based elements with no meaningful focus support
        if (this._focusableElement) {
            this._focusableElement.blur();
        }
    }

    getChildContext() {
        // Let descendant RX components know that their nearest RX ancestor is not an RX.Text.
        // Because they're in an RX.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        const childContext: ViewContext = super.getChildContext();

        childContext.isRxParentAText = false;

        // Provide the descendants with the focus manager (if any).
        if (this._focusManager) {
            childContext.focusManager = this._focusManager;

            // This FocusManager instance can restrict/limit the controls it tracks.
            // The count of keyboard focusable controls is relatively low, yet the "accessible focusable" (by screen reader) one can
            // trigger performance issues.
            // One way to narrow down to a manageable set is to ignore "accessible focusable" controls that are children of
            // focusable controls, as long as they are tracked by same FocusManager .
            childContext.isRxParentAFocusableInSameFocusManager = false;
        }
        if (this._popupContainer) {
            childContext.popupContainer = this._popupContainer;
        }

        // We use a context field to signal any component in the subtree to disable any system provided context menus.
        // This is not a bulletproof mechanism, context changes not being guaranteed to be detected by children, depending on factors
        // like shouldComponentUpdate methods on intermediate nodes, etc.
        // Fortunately press handlers are pretty stable.
        if (this._isButton(this.props)) {
            // This instance can be a responder. It may or may not have to invoke an onContextMenu handler, but
            // it will consume all corresponding touch events, so overwriting any parent-set value is the correct thing to do.
            childContext.isRxParentAContextMenuResponder = !!this.props.onContextMenu;
        }

        if (this.props.tabIndex !== undefined) {
            // This button will hide other "accessible focusable" controls as part of being restricted/limited by a focus manager
            childContext.isRxParentAFocusableInSameFocusManager = true;
        }

        return childContext;
    }

    private _isHidden(): boolean {
        return !!this._popupContainer && this._popupContainer.isHidden();
    }

    setFocusRestricted(restricted: boolean) {
        if (!this._focusManager || !this.props.restrictFocusWithin) {
            console.error('View: setFocusRestricted method requires restrictFocusWithin property to be set');
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
            console.error('View: setFocusLimited method requires limitFocusWithin property to be set');
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

    private _focusRestrictionCallback(restricted: RestrictFocusType) {
        // Complementary mechanism to ensure focus cannot get out (through tabbing) of this view
        // when restriction is enabled.
        // This covers cases where outside the view focusable controls are not controlled and/or not controllable
        // by FocusManager
        const viewProps: RNW.ViewProps = {
            tabNavigation: restricted !== RestrictFocusType.Unrestricted ? 'cycle' : 'local'
        };
        this.setNativeProps(viewProps);
    }

    setNativeProps(nativeProps: RN.ViewProps & RNW.ViewProps) {
        // Redirect to focusable component if present.
        if (this._focusableElement) {
            this._focusableElement.setNativeProps(nativeProps);
        } else {
            super.setNativeProps(nativeProps);
        }
    }

    protected _isButton(viewProps: Types.ViewProps): boolean {
        return super._isButton(viewProps) || !!viewProps.onContextMenu;
    }

    private _onFocusableKeyDown = (e: React.SyntheticEvent<any>): void => {

        const keyEvent = EventHelpers.toKeyboardEvent(e);
        if (this.props.onKeyPress) {
            this.props.onKeyPress(keyEvent);
        }

        if (this.props.onPress) {
            const key = keyEvent.keyCode;
            // ENTER triggers press on key down
            if (key === KEY_CODE_ENTER) {
                this.props.onPress(keyEvent);
            }
        }

        if (this.props.onContextMenu) {
            const key = keyEvent.keyCode;
            if ((key === KEY_CODE_APP) || (key === KEY_CODE_F10 && keyEvent.shiftKey)) {
                this._showContextMenu(keyEvent);
            }
        }
    }

    private _onFocusableKeyUp = (e: React.SyntheticEvent<any>): void => {
        const keyEvent = EventHelpers.toKeyboardEvent(e);
        if (keyEvent.keyCode === KEY_CODE_SPACE) {
            if (this.props.onPress) {
                this.props.onPress(keyEvent);
            }
        }
    }

    private _onFocus = (e: React.SyntheticEvent<any>): void => {
        if (e.currentTarget === e.target) {
            this.onFocus();
        }

        if (this.props.onFocus) {
            this.props.onFocus(EventHelpers.toFocusEvent(e));
        }
    }

    private _onBlur = (e: React.SyntheticEvent<any>): void => {
        if (this.props.onBlur) {
            this.props.onBlur(EventHelpers.toFocusEvent(e));
        }
    }

    // From FocusManagerFocusableComponent interface
    //
    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number | undefined {
        // Focus Manager may override this
        return this.props.tabIndex;
    }

    getImportantForAccessibility(): ImportantForAccessibilityValue | undefined {
        // Focus Manager may override this

        // Use a default of Auto if the computed value is undefined
        return this._internalProps.importantForAccessibility ||
            AccessibilityUtil.importantForAccessibilityToString(Types.ImportantForAccessibility.Auto);
    }

    updateNativeAccessibilityProps(): void {
        if (this._focusableElement) {
            const tabIndex: number = this.getTabIndex() || 0;
            const windowsTabFocusable: boolean = tabIndex >= 0;
            const importantForAccessibility: ImportantForAccessibilityValue | undefined = this.getImportantForAccessibility();

            this._focusableElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable,
                importantForAccessibility: importantForAccessibility
            });
        }
    }
}

// A value for tabIndex marks a View as being potentially keyboard/screen reader focusable
applyFocusableComponentMixin(View, function(this: View, nextProps?: Types.ViewProps) {
    const tabIndex = nextProps && ('tabIndex' in nextProps) ? nextProps.tabIndex : this.props.tabIndex;
    return tabIndex !== undefined;
});

export default View;
