import React = require('react');
import RN = require('react-native');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Button extends RX.Button<{}> {
    private _mixin_componentDidMount;
    private _mixin_componentWillUnmount;
    touchableGetInitialState: () => RN.Touchable.State;
    touchableHandleStartShouldSetResponder: () => boolean;
    touchableHandleResponderTerminationRequest: () => boolean;
    touchableHandleResponderGrant: (e: React.SyntheticEvent) => void;
    touchableHandleResponderMove: (e: React.SyntheticEvent) => void;
    touchableHandleResponderRelease: (e: React.SyntheticEvent) => void;
    touchableHandleResponderTerminate: (e: React.SyntheticEvent) => void;
    private _isMounted;
    private _hideTimeout;
    private _buttonElement;
    private _defaultOpacityValue;
    private _opacityAnimatedValue;
    private _opacityAnimatedStyle;
    constructor(props: Types.ButtonProps);
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: Types.ButtonProps): void;
    setNativeProps(nativeProps: RN.ViewProps): void;
    touchableHandleActivePressIn: (e: React.SyntheticEvent) => void;
    touchableHandleActivePressOut: (e: React.SyntheticEvent) => void;
    touchableHandlePress: (e: React.MouseEvent) => void;
    touchableHandleLongPress: (e: React.MouseEvent) => void;
    touchableGetHighlightDelayMS: () => number;
    touchableGetPressRectOffset: () => {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    focus(): void;
    blur(): void;
    private _setOpacityStyles(props);
    private _onButtonRef;
    private _isTouchFeedbackApplicable();
    private _opacityActive(duration);
    private _opacityInactive(duration);
    private _getDefaultOpacityValue(props);
    /**
    * Animate the touchable to a new opacity.
    */
    setOpacityTo(value: number, duration: number): void;
    private _hasPressHandler();
    private _showUnderlay();
    private _hideUnderlay;
}
export default Button;
