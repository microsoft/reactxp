/**
 * VirtualListCell.tsx
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * This helper class is used in conjunction with VirtualListView. It represents the
 * container for a single list item.
 */

import { createRef } from 'react';
import * as RX from 'reactxp';

import assert from './assert';

export interface VirtualListCellInfo {
    key: string;

    disableTouchOpacityAnimation?: boolean;
}

export interface VirtualListCellRenderDetails<T extends VirtualListCellInfo> {
    item: T;
    selected: boolean;
    focused: boolean;
}

export interface VirtualListCellProps<ItemInfo extends VirtualListCellInfo> extends RX.CommonProps {
    // All callbacks should be prebound to optimize performance.
    onLayout?: (itemKey: string, height: number) => void;
    onAnimateStartStop?: (itemKey: string, start: boolean) => void;
    onItemFocused?: (item: ItemInfo | undefined) => void;
    onItemSelected?: (item: ItemInfo) => void;
    renderItem: (details: VirtualListCellRenderDetails<ItemInfo>) => JSX.Element | JSX.Element[];
    onKeyPress: (ev: RX.Types.KeyboardEvent) => void;

    // Props that do not impact render (position is set by animated style).
    itemKey: string | undefined;
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
    isSelected: boolean;
    tabIndex?: number;
    shouldUpdate: boolean;
    item: ItemInfo | undefined;
}

interface StaticRendererProps<ItemInfo extends VirtualListCellInfo> extends RX.CommonProps {
    shouldUpdate: boolean;
    isFocused: boolean;
    isSelected: boolean;
    item: ItemInfo | undefined;
    renderItem: (details: VirtualListCellRenderDetails<ItemInfo>) => JSX.Element | JSX.Element[];
}

const _styles = {
    cellView: RX.Styles.createViewStyle({
        position: 'absolute',
    }),
    overflowVisible: RX.Styles.createViewStyle({
        overflow: 'visible',
    }),
    overflowHidden: RX.Styles.createViewStyle({
        overflow: 'hidden',
    }),
};

const _isNativeMacOS = RX.Platform.getType() === 'macos';
const _skypeEaseInAnimationCurve = RX.Animated.Easing.CubicBezier(1, 0, 0.78, 1);
const _skypeEaseOutAnimationCurve = RX.Animated.Easing.CubicBezier(0.33, 0, 0, 1);
const _keyCodeEnter = 13;
const _keyCodeSpace = 32;
const _keyCodeReturn = 3;

export class VirtualListCell<ItemInfo extends VirtualListCellInfo> extends RX.Component<VirtualListCellProps<ItemInfo>, RX.Stateless> {
    // Helper class used to render child elements. If we know that none of the children changed - we would like to skip
    // the render completely, to improve performance.
    // eslint-disable-next-line @typescript-eslint/member-naming
    private static StaticRenderer = class <CellItemInfo extends VirtualListCellInfo>
        extends RX.Component<StaticRendererProps<CellItemInfo>, RX.Stateless> {

        constructor(props: StaticRendererProps<CellItemInfo>) {
            super(props);
        }

        shouldComponentUpdate(nextProps: StaticRendererProps<CellItemInfo>): boolean {
            return nextProps.shouldUpdate ||
                this.props.isFocused !== nextProps.isFocused ||
                this.props.isSelected !== nextProps.isSelected;
        }

        render() {
            // If we don't have an item to render, return null here
            if (!this.props.item) {
                return null;
            }

            return (
                <RX.Fragment>
                    { this.props.renderItem({
                        item: this.props.item,
                        selected: this.props.isSelected,
                        focused: this.props.isFocused,
                    }) }
                </RX.Fragment>
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
    private _ref = createRef<RX.Animated.View>();

    // we need to split style for position and width because we use native driver for position,
    // but native driver doesnt support width
    private _animatedStylePosition: RX.Types.AnimatedViewStyleRuleSet;
    private _animatedStyleWidth: RX.Types.AnimatedViewStyleRuleSet;
    private _topAnimation: RX.Types.Animated.CompositeAnimation | undefined;

    private _itemKey: string | undefined;

    constructor(props: VirtualListCellProps<ItemInfo>) {
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
                    translateY: this._topValue,
                }],
                left: this._leftValue,
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
            width: this._widthValue,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps: VirtualListCellProps<ItemInfo>) {
        // If it's inactive, it had better be invisible.
        assert(nextProps.isActive || !nextProps.isVisible);

        assert(nextProps.useNativeDriver === this.props.useNativeDriver);

        // All callbacks should be prebound to optimize performance.
        assert(this.props.onLayout === nextProps.onLayout, 'onLayout callback changed');
        assert(this.props.onItemSelected === nextProps.onItemSelected, 'onItemSelected callback changed');
        assert(this.props.onItemFocused === nextProps.onItemFocused, 'onItemFocused callback changed');
        assert(this.props.onAnimateStartStop === nextProps.onAnimateStartStop, 'onAnimateStartStop callback changed');
        assert(this.props.renderItem === nextProps.renderItem, 'renderItem callback changed');

        // We assume this prop doesn't change for perf reasons. Callers should modify
        // the key to force an unmount/remount if these need to change.
        assert(this.props.isScreenReaderModeEnabled === nextProps.isScreenReaderModeEnabled);

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

    shouldComponentUpdate(nextProps: VirtualListCellProps<ItemInfo>): boolean {
        // No need to update inactive (recycled) cells.
        if (!nextProps.isActive) {
            return false;
        }

        // Check if props important for rendering changed.
        if (this.props.tabIndex !== nextProps.tabIndex ||
            this.props.itemKey !== nextProps.itemKey ||
            this.props.isFocused !== nextProps.isFocused ||
            this.props.isSelected !== nextProps.isSelected) {
            return true;
        }

        return nextProps.shouldUpdate;
    }

    componentDidUpdate(prevProps: VirtualListCellProps<ItemInfo>) {
        // We need to simulate a layout event here because recycled cells may not
        // generate a layout event if the cell contents haven't changed.
        if (this.props.onLayout && this.props.isActive && this._calculatedHeight && this._itemKey) {
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
                    const animationToCancel = this._topAnimation;

                    // The call to stop() will invoke the stop callback. If we are
                    // going to replace a pending animation, we'll make it look like
                    // a continuous animation rather than calling the callback multiple
                    // times. If we're not replacing the animation with another animation,
                    // allow the onAnimateStartStop to proceed.
                    if (animate) {
                        this._topAnimation = undefined;
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
                            }),
                        ]);
                    } else {
                        this._topAnimation = RX.Animated.timing(this._topValue, {
                            toValue: top,
                            duration: 200,
                            delay: animationDelay,
                            easing: RX.Animated.Easing.InOut(),
                        });
                    }

                    if (!isReplacingPendingAnimation && this.props.onAnimateStartStop && this._itemKey) {
                        this.props.onAnimateStartStop(this._itemKey, true);
                    }
                    this._topAnimation.start(() => {
                        // Has the animation been canceled?
                        if (this._topAnimation) {
                            this._topAnimation = undefined;
                            if (this.props.onAnimateStartStop && this._itemKey) {
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

    setItemKey(key: string | undefined) {
        this._itemKey = key;
    }

    getTop() {
        return this._top;
    }

    focus() {
        if (this._ref.current && this.props.tabIndex) {
            const virtualCellComponent = this._ref.current;
            virtualCellComponent.focus();
        }
    }

    render() {
        const overflow = this.props.showOverflow ? _styles.overflowVisible : _styles.overflowHidden;

        return (
            <RX.Animated.View
                style={ [_styles.cellView, overflow, this._animatedStylePosition, this._animatedStyleWidth] }
                ref={ this._ref }
                tabIndex={ this.props.tabIndex }
                onLayout={ this.props.onLayout ? this._onLayout : undefined }
                onFocus={ this.props.onItemFocused ? this._onFocus : undefined }
                onBlur={ this.props.onItemFocused ? this._onBlur : undefined }
                onPress={ this.props.onItemSelected ? this._onPress : undefined }
                onKeyPress={ this.props.onKeyPress || this.props.onItemSelected ? this._onKeyPress : undefined }
                disableTouchOpacityAnimation={ this.props.item ? this.props.item.disableTouchOpacityAnimation : undefined }
            >
                <VirtualListCell.StaticRenderer
                    shouldUpdate={ this.props.shouldUpdate }
                    isFocused={ this.props.isFocused }
                    isSelected={ this.props.isSelected }
                    item={ this.props.item }
                    renderItem={ this.props.renderItem }
                />
            </RX.Animated.View>
        );
    }

    private _onKeyPress = (e: RX.Types.KeyboardEvent) => {
        const isSelectItemKeyPress = e.keyCode === _keyCodeEnter ||
            e.keyCode === _keyCodeSpace ||
            e.keyCode === _keyCodeReturn;
        if (isSelectItemKeyPress && this.props.onItemSelected && this.props.item) {
            this.props.onItemSelected(this.props.item);
            e.stopPropagation();
        }
        if (this.props.onKeyPress) {
            this.props.onKeyPress(e);
        }
    };

    private _onFocus = (e: RX.Types.FocusEvent) => {
        if (this.props.onItemFocused) {
            this.props.onItemFocused(this.props.item);
        }
    };

    private _onPress = (e: RX.Types.SyntheticEvent) => {
        if (this.props.onItemSelected && this.props.item) {
            this.props.onItemSelected(this.props.item);
            e.stopPropagation();
        }
    };

    private _onBlur = (e: RX.Types.FocusEvent) => {
        if (this.props.onItemFocused) {
            this.props.onItemFocused(undefined);
        }
    };

    private _onLayout = (layoutInfo: RX.Types.ViewOnLayoutEvent) => {
        if (this.props.onLayout && this.props.isActive && this._itemKey) {
            this._calculatedHeight = layoutInfo.height;
            this.props.onLayout(this._itemKey, layoutInfo.height);
        }
    };
}
