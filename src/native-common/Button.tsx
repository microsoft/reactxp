/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Button abstraction.
*/

import assert = require('assert');
import React = require('react');
import RN = require('react-native');
import PropTypes = require('prop-types');

import AccessibilityUtil from './AccessibilityUtil';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import Animated from './Animated';
import AppConfig from '../common/AppConfig';
import EventHelpers from './utils/EventHelpers';
import Styles from './Styles';
import Types = require('../common/Types');
import { Button as ButtonBase } from '../common/Interfaces';
import { isEqual } from '../common/lodashMini';
import UserInterface from './UserInterface';

const _styles = {
    defaultButton: Styles.createButtonStyle({
        alignItems: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    }),
    disabled: Styles.createButtonStyle({
        opacity: 0.5
    })
};

const _defaultAccessibilityTrait = Types.AccessibilityTrait.Button;
const _defaultImportantForAccessibility = Types.ImportantForAccessibility.Yes;

const _defaultActiveOpacity = 0.2;
const _inactiveOpacityAnimationDuration = 250;
const _activeOpacityAnimationDuration = 0;
const _hideUnderlayTimeout = 100;
const _underlayInactive = 'transparent';

function noop() { /* noop */ }

function applyMixin(thisObj: any, mixin: {[propertyName: string]: any}, propertiesToSkip: string[]) {
    Object.getOwnPropertyNames(mixin).forEach(name => {
        if (name !== 'constructor' && propertiesToSkip.indexOf(name) === -1) {
            assert(
                !(name in thisObj),
                `An object cannot have a method with the same name as one of its mixins: "${name}"`
            );
            thisObj[name] = mixin[name].bind(thisObj);
        }
    });
}

export interface ButtonContext {
    hasRxButtonAscendant?: boolean;
    focusArbitrator?: FocusArbitratorProvider;
}

export class Button extends ButtonBase {
    static contextTypes = {
        hasRxButtonAscendant: PropTypes.bool,
        focusArbitrator: PropTypes.object
    };

    context!: ButtonContext;

    static childContextTypes: React.ValidationMap<any> = {
        hasRxButtonAscendant: PropTypes.bool
    };

    private _mixin_componentDidMount = RN.Touchable.Mixin.componentDidMount || noop;
    private _mixin_componentWillUnmount = RN.Touchable.Mixin.componentWillUnmount || noop;

    // These are provided by mixin applied in the constructor
    touchableGetInitialState!: () => RN.Touchable.State;
    touchableHandleStartShouldSetResponder!: () => boolean;
    touchableHandleResponderTerminationRequest!: () => boolean;
    touchableHandleResponderGrant!: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderMove!: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderRelease!: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderTerminate!: (e: React.SyntheticEvent<any>) => void;

    private _isMounted = false;
    protected _isMouseOver = false;
    protected _isHoverStarted = false;
    private _hideTimeout: number|undefined;
    private _buttonElement: any = null;
    private _defaultOpacityValue: number|undefined;
    private _opacityAnimatedValue: RN.Animated.Value|undefined;
    private _opacityAnimatedStyle: Types.AnimatedViewStyleRuleSet|undefined;

    constructor(props: Types.ButtonProps, context: ButtonContext) {
        super(props, context);
        applyMixin(this, RN.Touchable.Mixin, [
            // Properties that Button and RN.Touchable.Mixin have in common. Button needs
            // to dispatch these methods to RN.Touchable.Mixin manually.
            'componentDidMount',
            'componentWillUnmount'
        ]);
        this.state = this.touchableGetInitialState();
        this._setOpacityStyles(props);

        if (context.hasRxButtonAscendant) {
            if (AppConfig.isDevelopmentMode()) {
                console.warn('Button components should not be embedded. Some APIs, e.g. Accessibility, will not work.');
            }
        }
    }

    protected _render(internalProps: RN.ViewProps): JSX.Element {
        return (
            <RN.Animated.View
                { ...internalProps }
             >
                { this.props.children }
            </RN.Animated.View>
        );
    }

    render() {
        // Accessibility props.
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility,
            _defaultImportantForAccessibility);
        const accessibilityTrait = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits,
             _defaultAccessibilityTrait, true);
        const accessibilityComponentType = AccessibilityUtil.accessibilityComponentTypeToString(this.props.accessibilityTraits,
            _defaultAccessibilityTrait);

        const opacityStyle = !this.props.disableTouchOpacityAnimation && this._opacityAnimatedStyle;
        let disabledStyle = this.props.disabled && _styles.disabled;

        if (this.props.disabled && this.props.disabledOpacity !== undefined) {
            disabledStyle = Styles.createButtonStyle({
                opacity: this.props.disabledOpacity
            }, false);
        }

        // Work around the fact that the current react-native type
        // definition is incomplete.
        let undefinedProps: any = {
            ref: this._onButtonRef,
            onAccessibilityTapIOS: this.props.onAccessibilityTapIOS,
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            tooltip: this.props.title
        };
        let internalProps: RN.ViewProps = {
            style: Styles.combine([_styles.defaultButton, this.props.style, opacityStyle,
                disabledStyle]),
            accessibilityLabel: this.props.accessibilityLabel || this.props.title,
            accessibilityTraits: accessibilityTrait,
            accessibilityComponentType: accessibilityComponentType,
            importantForAccessibility: importantForAccessibility,
            onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
            onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
            onResponderGrant: this.touchableHandleResponderGrant,
            onResponderMove: this.touchableHandleResponderMove,
            onResponderRelease: this.touchableHandleResponderRelease,
            onResponderTerminate: this.touchableHandleResponderTerminate,
            shouldRasterizeIOS: this.props.shouldRasterizeIOS,
            ...undefinedProps
        };

        return this._render(internalProps);
    }

    componentDidMount() {
        this._mixin_componentDidMount();
        this._isMounted = true;

        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    componentWillUnmount() {
        this._mixin_componentWillUnmount();
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps: Types.ButtonProps) {
        if (!isEqual(this.props, nextProps)) {
            // If opacity got updated as a part of props update, we need to reflect that in the opacity animation value
           this._setOpacityStyles(nextProps, this.props);
        }
    }

    getChildContext(): ButtonContext {
        return { hasRxButtonAscendant: true };
    }

    setNativeProps(nativeProps: RN.ViewProps) {
        if (this._buttonElement) {
            this._buttonElement.setNativeProps(nativeProps);
        }
    }

    touchableHandleActivePressIn = (e: Types.SyntheticEvent) => {
        if (this._isTouchFeedbackApplicable()) {
            if (this.props.underlayColor) {
                if (this._hideTimeout) {
                    clearTimeout(this._hideTimeout);
                    this._hideTimeout = undefined;
                }
                this._showUnderlay();
            }

             // We do not want to animate opacity if underlayColour is provided. Unless an explicit activeOpacity is provided
            if (!this.props.disableTouchOpacityAnimation && (this.props.activeOpacity || !this.props.underlayColor)) {
                this._opacityActive(_activeOpacityAnimationDuration);
            }
        }

        if (!this.props.disabled && this.props.onPressIn) {
            this.props.onPressIn(e);
        }
    }

    touchableHandleActivePressOut = (e: Types.SyntheticEvent) => {
        if (this._isTouchFeedbackApplicable()) {
            if (this.props.underlayColor) {
                if (this._hideTimeout) {
                    clearTimeout(this._hideTimeout);
                }
                this._hideTimeout = setTimeout(this._hideUnderlay, _hideUnderlayTimeout);
            }

            if (!this.props.disableTouchOpacityAnimation && (this.props.activeOpacity || !this.props.underlayColor)) {
                this._opacityInactive(_inactiveOpacityAnimationDuration);
            }
        }

        if (!this.props.disabled && this.props.onPressOut) {
            this.props.onPressOut(e);
        }
    }

    touchableHandlePress = (e: Types.SyntheticEvent) => {
        UserInterface.evaluateTouchLatency(e);
        if (!this.props.disabled) {
            if (EventHelpers.isRightMouseButton(e)) {
                if (this.props.onContextMenu) {
                    this.props.onContextMenu(EventHelpers.toMouseEvent(e));
                }
            } else {
                if (this.props.onPress) {
                    this.props.onPress(EventHelpers.toMouseEvent(e));
                }
            }
        }
    }

    touchableHandleLongPress = (e: Types.SyntheticEvent) => {
        if (!this.props.disabled && !EventHelpers.isRightMouseButton(e) && this.props.onLongPress) {
            this.props.onLongPress(EventHelpers.toMouseEvent(e));
        }
    }

    touchableGetHighlightDelayMS = () => {
        return 20;
    }

    touchableGetPressRectOffset = () => {
        return {top: 20, left: 20, right: 20, bottom: 100};
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => this._isMounted
        );
    }

    blur() {
         // native mobile platforms doesn't have the notion of blur for buttons, so ignore.
    }

    focus() {
        if (this._isMounted) {
            AccessibilityUtil.setAccessibilityFocus(this);
        }
    }

    private _setOpacityStyles(props: Types.ButtonProps, prevProps?: Types.ButtonProps) {
        const opacityValueFromProps = this._getDefaultOpacityValue(props);
        if (this._defaultOpacityValue !== opacityValueFromProps || (prevProps && props.disabled !== prevProps.disabled)) {
            this._defaultOpacityValue = opacityValueFromProps;
            this._opacityAnimatedValue = new Animated.Value(this._defaultOpacityValue);
            this._opacityAnimatedStyle = Styles.createAnimatedViewStyle({
                opacity: this._opacityAnimatedValue
            });
        }
    }

    private _onButtonRef = (btn: any): void => {
        this._buttonElement = btn;
    }

    private _isTouchFeedbackApplicable() {
        return this._isMounted && this._hasPressHandler() && this._buttonElement;
    }

    private _opacityActive(duration: number) {
        this.setOpacityTo(this.props.activeOpacity || _defaultActiveOpacity, duration);
    }

    private _opacityInactive(duration: number) {
        this.setOpacityTo(this._defaultOpacityValue!!!, duration);
    }

    private _getDefaultOpacityValue(props: Types.ButtonProps): number {
        let flattenedStyles: { [key: string]: any }|undefined;
        if (props && props.style) {
            flattenedStyles = RN.StyleSheet.flatten(props.style as RN.StyleProp<RN.ViewProps>);
        }

        return flattenedStyles && (flattenedStyles as Types.ButtonStyle).opacity || 1;
    }

    protected _onMouseEnter = (e: Types.SyntheticEvent) => {
        this._isMouseOver = true;
        this._onHoverStart(e);
    }

    protected _onMouseLeave = (e: Types.SyntheticEvent) => {
        this._isMouseOver = false;
        this._onHoverEnd(e);
    }

    protected _onHoverStart = (e: Types.SyntheticEvent) => {
        if (!this._isHoverStarted && this._isMouseOver) {
            this._isHoverStarted = true;

            if (this.props.onHoverStart) {
                this.props.onHoverStart(e);
            }
        }
    }

    protected _onHoverEnd = (e: Types.SyntheticEvent) => {
        if (this._isHoverStarted && !this._isMouseOver) {
            this._isHoverStarted = false;

            if (this.props.onHoverEnd) {
                this.props.onHoverEnd(e);
            }
        }
    }

    /**
    * Animate the touchable to a new opacity.
    */
    setOpacityTo(value: number, duration: number) {
       Animated.timing(
            this._opacityAnimatedValue!!!,
            {
                toValue: value,
                duration: duration,
                easing: Animated.Easing.InOut()
            }
        ).start();
    }

    private _hasPressHandler() {
        return !!(
            this.props.onPress ||
            this.props.onPressIn ||
            this.props.onPressOut ||
            this.props.onLongPress
        );
    }

    private _showUnderlay() {
        if (!this._buttonElement) {
            return;
        }

        this._buttonElement.setNativeProps({
            style: {
                backgroundColor: this.props.underlayColor
            }
        });
    }

    private _hideUnderlay = () => {
        if (!this._isMounted || !this._buttonElement) {
            return;
        }

        this._buttonElement.setNativeProps({
            style: [{
                backgroundColor: _underlayInactive
            }, this.props.style]
        });
    }
}

export default Button;
