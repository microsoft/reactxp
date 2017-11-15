/**
* VirtualListCell.tsx
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* This helper class is used in conjunction with VirtualListView. It represents the
* container for a single list item.
**/

import assert = require('assert');
import RX = require('reactxp');

export interface VirtualListCellInfo {
    key: string;
}

export interface VirtualListCellProps extends RX.CommonProps {
    // All callbacks should be prebound to optimize performance.
    onLayout: (itemKey: string, height: number) => void;
    onAnimateStartStop?: (itemKey: string, start: boolean) => void;
    onCellFocus?: (itemKey: string) => void;
    renderItem: (item: VirtualListCellInfo, focused: boolean) => JSX.Element | JSX.Element[];

    // Props that do not impact render (position is set by animated style).
    itemKey: string;
    left: number;
    top: number;
    width: number;
    isVisible: boolean;
    useNativeDriver?: boolean;
    showOverflow?: boolean;

    // We need to disable animation and the native animation driver in screen reader mode.
    isScreenReaderModeEnabled?: boolean;

    // Props that impact render, should be validated in shouldComponentUpdate.
    isActive: boolean;
    isFocused: boolean;
    tabIndex?: number;
    shouldUpdate: boolean;
    item: VirtualListCellInfo;
}

interface StaticRendererProps extends RX.CommonProps {
    animatedStyle: RX.Types.AnimatedViewStyleRuleSet;
    shouldUpdate: boolean;
    showOverflow: boolean;
    item: VirtualListCellInfo;
    isFocused: boolean;
    renderItem: (item: VirtualListCellInfo, focused: boolean) => JSX.Element | JSX.Element[];
}

const _styles = {
    itemBase: RX.Styles.createViewStyle({
        position: 'absolute'
    }),
    overflowVisible: RX.Styles.createViewStyle({
        overflow: 'visible'
    })
};

const _isNativeMacOS = RX.Platform.getType() === 'macos';
const _skypeEaseInAnimationCurve = RX.Animated.Easing.CubicBezier(1, 0, 0.78, 1);
const _skypeEaseOutAnimationCurve = RX.Animated.Easing.CubicBezier(0.33, 0, 0, 1);
const _virtualCellRef = 'virtualCell';

export class VirtualListCell extends RX.Component<VirtualListCellProps, null> {
    // Helper class used to render child elements inside RX.Animated.View only when parent
    // allows that. If we know that none of the children changed - we would like to skip
    // the render completely, to improve performance.
    private static StaticRenderer = class extends RX.Component<StaticRendererProps, null> {
        constructor(props?: StaticRendererProps) {
            super(props);
        }

        shouldComponentUpdate(nextProps: StaticRendererProps): boolean {
            return nextProps.shouldUpdate || this.props.isFocused !== nextProps.isFocused;
        }

        render() {
            // Because of the React limitation that Render should returm single element and not array,
            // we have to wrap results of this.props.render() into the View.
            return (
                <RX.Animated.View style={ [_styles.overflowVisible, this.props.animatedStyle] } >
                    { this.props.renderItem(this.props.item, this.props.isFocused) }
                </RX.Animated.View>
            );
        }
    };

    private static _hiddenTopValue = -32768;

    private _isVisible = false;
    private _top: number = VirtualListCell._hiddenTopValue;
    private _calculatedHeight = 0;

    private _topValue: RX.Animated.Value;
    private _leftValue: RX.Animated.Value;
    private _widthValue: RX.Animated.Value;

    // we need to split style for position and width because we use native driver for position,
    // but native driver doesnt support width
    private _animatedStylePosition: RX.Types.AnimatedViewStyleRuleSet;
    private _animatedStyleWidth: RX.Types.AnimatedViewStyleRuleSet;
    private _topAnimation: RX.Types.Animated.CompositeAnimation;

    private _itemKey = '';

    constructor(props?: VirtualListCellProps) {
        super(props);

        this._isVisible = props.isVisible;
        this._top = props.top;
        this._itemKey = props.itemKey;

        const topValue = this._isVisible ? this._top : VirtualListCell._hiddenTopValue;
        this._topValue = RX.Animated.createValue(topValue);

        const leftValue = props.left || 0;
        this._leftValue = RX.Animated.createValue(leftValue);

        if (!props.isScreenReaderModeEnabled && !_isNativeMacOS) {
            // On native platforms, we'll stick with translate[X|Y] because it has a performance advantage.
            this._animatedStylePosition = RX.Styles.createAnimatedViewStyle({
                transform: [{
                    translateY: this._topValue
                }],
                left: this._leftValue
            });
        } else {
            // We need to work around an IE-specific bug. It doesn't properly handle
            // translateY in this case. In particular, if separate translations are used
            // within the item itself, it doesn't handle that combination.
            this._animatedStylePosition = RX.Styles.createAnimatedViewStyle({
                top: this._topValue,
                left: this._leftValue,
            });
        }

        this._widthValue = RX.Animated.createValue(props.width || 0);

        this._animatedStyleWidth = RX.Styles.createAnimatedViewStyle({
            width: this._widthValue
        });
    }

    componentWillReceiveProps(nextProps: VirtualListCellProps) {
        // If it's inactive, it had better be invisible.
        assert.ok(nextProps.isActive || !nextProps.isVisible);

        assert.ok(nextProps.useNativeDriver === this.props.useNativeDriver);

        // All callbacks should be prebound to optimize performance.
        assert.ok(this.props.onLayout === nextProps.onLayout);
        assert.ok(this.props.onCellFocus === nextProps.onCellFocus);
        assert.ok(this.props.onAnimateStartStop === nextProps.onAnimateStartStop);
        assert.ok(this.props.renderItem === nextProps.renderItem);

        // We assume this prop doesn't change for perf reasons. Callers should modify
        // the key to force an unmount/remount if these need to change.
        assert.ok(this.props.isScreenReaderModeEnabled === nextProps.isScreenReaderModeEnabled);

        this.setItemKey(nextProps.itemKey);

        if (this.props.left !== nextProps.left) {
            this._leftValue.setValue(nextProps.left);
        }

        if (this.props.width !== nextProps.width) {
            this._widthValue.setValue(nextProps.width);
        }

        if (this.props.itemKey !== nextProps.itemKey) {
            this.setVisibility(nextProps.isVisible);
            this.setTop(nextProps.top);
        }
    }

    shouldComponentUpdate(nextProps: VirtualListCellProps): boolean {
        // No need to update inactive (recycled) cells.
        if (!nextProps.isActive) {
            return false;
        }

        // Check if props important for rendering changed.
        if (this.props.tabIndex !== nextProps.tabIndex ||
            this.props.itemKey !== nextProps.itemKey ||
            this.props.isFocused !== nextProps.isFocused) {
            return true;
        }

        return nextProps.shouldUpdate;
    }

    componentDidUpdate(prevProps: VirtualListCellProps) {
        // We need to simulate a layout event here because recycled cells may not
        // generate a layout event if the cell contents haven't changed.
        if (this.props.onLayout && this.props.isActive && this._calculatedHeight) {
            this.props.onLayout(this._itemKey, this._calculatedHeight);
        }
    }

    componentWillUnmount() {
        // Stop any pending animation.
        if (this._topAnimation) {
            this._topAnimation.stop();
        }
    }

    setVisibility(isVisible: boolean) {
        if (isVisible !== this._isVisible) {
            this._isVisible = isVisible;

            if (this._topAnimation) {
                this._topAnimation.stop();
            }

            this._topValue.setValue(this._isVisible ? this._top : VirtualListCell._hiddenTopValue);
        }
    }

    isVisible() {
        return this._isVisible;
    }

    setTop(top: number, animate = false, animationDelay = 0, animationOvershoot = 0) {
        if (top !== this._top) {
            this._top = top;

            if (this._isVisible) {
                let isReplacingPendingAnimation = false;

                // Stop any pending animation.
                if (this._topAnimation) {
                    let animationToCancel = this._topAnimation;

                    // The call to stop() will invoke the stop callback. If we are
                    // going to replace a pending animation, we'll make it look like
                    // a continuous animation rather than calling the callback multiple
                    // times. If we're not replacing the animation with another animation,
                    // allow the onAnimateStartStop to proceed.
                    if (animate) {
                        this._topAnimation = null;
                    }
                    animationToCancel.stop();
                    isReplacingPendingAnimation = true;
                }

                if (animate) {
                    if (animationOvershoot !== 0) {
                        this._topAnimation = RX.Animated.sequence([
                            RX.Animated.timing(this._topValue, {
                                toValue: top + animationOvershoot,
                                duration: 200,
                                delay: animationDelay,
                                easing: _skypeEaseInAnimationCurve,
                            }),
                            RX.Animated.timing(this._topValue, {
                                toValue: top,
                                duration: 400,
                                easing: _skypeEaseOutAnimationCurve,
                            })
                        ]);
                    } else {
                        this._topAnimation = RX.Animated.timing(this._topValue, {
                            toValue: top,
                            duration: 200,
                            delay: animationDelay,
                            easing: RX.Animated.Easing.InOut(),
                        });
                    }

                    if (!isReplacingPendingAnimation) {
                        this.props.onAnimateStartStop(this._itemKey, true);
                    }
                    this._topAnimation.start(() => {
                        // Has the animation been canceled?
                        if (this._topAnimation) {
                            this._topAnimation = null;
                            if (this.props.onAnimateStartStop) {
                                this.props.onAnimateStartStop(this._itemKey, false);
                            }
                        }
                    });
                } else {
                    this._topValue.setValue(top);
                }
            }
        }
    }

    cancelPendingAnimation() {
        if (this._topAnimation) {
            this._topAnimation.stop();
        }
    }

    setItemKey(key: string) {
        this._itemKey = key;
    }

    getTop() {
        return this._top;
    }

    focus() {
        if (this.refs && this.refs[_virtualCellRef] && this.props.tabIndex) {
            const virtualCellComponent = this.refs[_virtualCellRef] as RX.View;
            virtualCellComponent.focus();
        }
    }

    render() {
        return (
            <RX.Animated.View
                style={ [_styles.itemBase, _styles.overflowVisible, this._animatedStylePosition] }
                onLayout={ this.props.onLayout ? this._onLayout : null }
                ref={ _virtualCellRef }
                tabIndex={ this.props.tabIndex }
                onFocus={ this._onFocus }
                onBlur={ this._onBlur }
            >
                <VirtualListCell.StaticRenderer
                    animatedStyle={ this._animatedStyleWidth }
                    shouldUpdate={ this.props.shouldUpdate }
                    showOverflow={ this.props.showOverflow }
                    item={ this.props.item }
                    isFocused= { this.props.isFocused }
                    renderItem={ this.props.renderItem }
                />
            </RX.Animated.View>
        );
    }

    private _onFocus = (e: RX.Types.FocusEvent) => {
        if (this.props.onCellFocus) {
            this.props.onCellFocus(this.props.itemKey);
        }
    }

    private _onBlur = (e: RX.Types.FocusEvent) => {
        if (this.props.onCellFocus) {
            this.props.onCellFocus(null);
        }
    }

    private _onLayout = (layoutInfo: RX.Types.ViewOnLayoutEvent) => {
        if (this.props.onLayout && this.props.isActive) {
            this._calculatedHeight = layoutInfo.height;
            this.props.onLayout(this._itemKey, layoutInfo.height);
        }
    }
}
