/**
* Modal.ts
* Copyright: Microsoft 2018
*
* Modal dialog container, typically embedded within RX.Modal.
*/

import * as assert from 'assert';
import * as RX from 'reactxp';
import { ComponentBase } from 'resub';
import * as SyncTasks from 'synctasks';

import KeyCodes from '../utilities/KeyCodes';
import { Colors } from '../app/Styles';

interface ModalProps extends RX.CommonProps {
    modalId: string;
    children?: JSX.Element | JSX.Element[];
    modalWidth?: number;
    modalHeight?: number;
}

interface ModalState {
    widthStyle?: RX.Types.ViewStyleRuleSet;
    heightStyle?: RX.Types.ViewStyleRuleSet;
}

const _opacityAnimationDuration = 150;
const _scalingAnimationDuration = 250;
const _initialScalingRatio = 0.95;

const _styles = {
    modalContainerBackground: RX.Styles.createViewStyle({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.simpleDialogBehind,
        flexDirection: 'row'
    }),
    modalContainer: RX.Styles.createViewStyle({
        flex: -1,
        flexDirection: 'row'
    }),
    modalBox: RX.Styles.createViewStyle({
        flex: -1,
        margin: 32
    })
};

export default class Modal extends ComponentBase<ModalProps, ModalState> {
    private static _visibleModalMap: { [modalId: string]: Modal } = {};

    private _contentOpacityValue = new RX.Animated.Value(1);
    private _contentScaleValue = new RX.Animated.Value(_initialScalingRatio);
    private _contentScaleAnimationStyle = RX.Styles.createAnimatedViewStyle({
        opacity: this._contentOpacityValue,
        transform: [{
            scale: this._contentScaleValue
        }]
    });

    private _opacityAnimationValue = new RX.Animated.Value(1);
    private _opacityAnimationStyle = RX.Styles.createAnimatedViewStyle({
        opacity: this._opacityAnimationValue
    });

    protected _buildState(props: ModalProps, initialBuild: boolean): Partial<ModalState> {
        let newState: Partial<ModalState> = {
        };

        newState.widthStyle = props.modalWidth ? RX.Styles.createViewStyle({
            width: props.modalWidth
        }, false) : undefined;

        newState.heightStyle = props.modalHeight ? RX.Styles.createViewStyle({
            height: props.modalHeight
        }, false) : undefined;

        return newState;
    }

    componentWillMount() {
        // To give children a chance to cancel the ESC handler,
        // subscribing in componentWillMount so that the children
        // could subscribe after.
        super.componentWillMount();

        RX.Input.keyUpEvent.subscribe(this._onKeyUp);
    }

    componentDidMount() {
        super.componentDidMount();

        Modal._visibleModalMap[this.props.modalId] = this;

        RX.Animated.timing(this._contentScaleValue, {
            toValue: 1,
            duration: _scalingAnimationDuration,
            easing: RX.Animated.Easing.OutBack(),
            useNativeDriver: true
        }).start();
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        delete Modal._visibleModalMap[this.props.modalId];

        RX.Input.keyUpEvent.unsubscribe(this._onKeyUp);
    }

    componentWillUpdate(newProps: ModalProps, newState: ModalState, newContext: any) {
        super.componentWillUpdate(newProps, newState, newContext);

        // We assume the modalId doesn't change.
        assert.ok(newProps.modalId === this.props.modalId);
    }

    render() {
        const modalBoxStyles = [_styles.modalBox, this.state.widthStyle];
        const modalContentStyles = [_styles.modalContainer, this._contentScaleAnimationStyle, this.state.heightStyle];

        let modalContent = (
            <RX.Animated.View style={ modalContentStyles }>
                <RX.View
                    style={ modalBoxStyles }
                    onPress={ this._clickInside }
                    accessibilityTraits={ RX.Types.AccessibilityTrait.Dialog }
                    restrictFocusWithin={ true }
                    disableTouchOpacityAnimation={ true }
                    tabIndex={ -1 }
                >
                    { this.props.children }
                </RX.View>
            </RX.Animated.View>
        );

        return (
            <RX.Animated.View
                style={ [_styles.modalContainerBackground, this._opacityAnimationStyle] }
                onPress={ this._clickOutside }
                onLongPress={ this._onLongPressOutside }
                disableTouchOpacityAnimation={ true }
            >
                { modalContent }
            </RX.Animated.View>
        );
    }

    private _onKeyUp = (e: RX.Types.KeyboardEvent) => {
        if (e.keyCode === KeyCodes.Escape) {
            this._clickOutside(e);
            return true;
        }
        return false;
    }

    private _clickInside = (e: RX.Types.SyntheticEvent) => {
        // Do nothing, keeps click/press from propogating up to the dismissal action.
        e.stopPropagation();
    }

    private _onLongPressOutside = (e: RX.Types.SyntheticEvent) => {
        // Do nothing, required to keep onPress from firing on long press.
        e.stopPropagation();
    }

    private _clickOutside = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();
    }

    private _animateClose(onAnimationComplete: () => void) {
        RX.Animated.parallel([
            RX.Animated.timing(this._opacityAnimationValue, {
                toValue: 0,
                duration: _opacityAnimationDuration,
                easing: RX.Animated.Easing.Out(),
                useNativeDriver: true
            }),
            RX.Animated.timing(this._contentOpacityValue, {
                toValue: 0,
                duration: _opacityAnimationDuration,
                easing: RX.Animated.Easing.Out(),
                useNativeDriver: true
            }),
            RX.Animated.timing(this._contentScaleValue, {
                toValue: _initialScalingRatio,
                duration: _scalingAnimationDuration,
                easing: RX.Animated.Easing.Out(),
                useNativeDriver: true
            })
        ]).start(() => {
            onAnimationComplete();
        });
    }

    static dismissAnimated(modalId: string): SyncTasks.Promise<void> {
        let modal = Modal._visibleModalMap[modalId];
        if (!modal) {
            return SyncTasks.Rejected('Modal ID not found');
        }

        let deferred = SyncTasks.Defer<void>();
        modal._animateClose(() => {
            RX.Modal.dismiss(modalId);
            deferred.resolve(void 0);
        });

        return deferred.promise();
    }
}
