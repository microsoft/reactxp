/**
 * ScrollView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform ScrollView abstraction.
 */

import * as React from 'react';
import * as RN from 'react-native';

import * as RX from '../common/Interfaces';
import ViewBase from './ViewBase';

// TODO: #737970 Remove special case for UWP/MacOS when this bug is fixed. The bug
//   causes you to have to click twice instead of once on some pieces of UI in
//   order for the UI to acknowledge your interaction.
const overrideKeyboardShouldPersistTaps = RN.Platform.OS === 'macos' || RN.Platform.OS === 'windows';
export class ScrollView extends ViewBase<RX.Types.ScrollViewProps, RX.Types.Stateless, RN.ScrollView> implements RX.ScrollView {
    private _scrollTop = 0;
    private _scrollLeft = 0;

    protected _render(nativeProps: RN.ScrollViewProps & React.Props<RN.ScrollView>): JSX.Element {
        if (this.props.scrollXAnimatedValue || this.props.scrollYAnimatedValue) {
            // Have to jump over to an Animated ScrollView to use an RN.Animated.event...
            return (
                <RN.Animated.ScrollView { ...nativeProps }>
                    { nativeProps.children }
                </RN.Animated.ScrollView>
            );
        } else {
            return (
                <RN.ScrollView { ...nativeProps }>
                    { nativeProps.children }
                </RN.ScrollView>
            );
        }
    }

    render() {
        let scrollThrottle = this.props.scrollEventThrottle || 16;

        if (scrollThrottle === 0) {
            // Fire at 60fps
            scrollThrottle = 16;
        }

        const layoutCallback = this.props.onLayout ?
            // We have a callback function, call the wrapper
            this._onLayout :
            undefined;

        let scrollHandler;
        if (this.props.scrollXAnimatedValue || this.props.scrollYAnimatedValue) {
            // For more details on this craziness, reference:
            // https://facebook.github.io/react-native/docs/animated#handling-gestures-and-other-events
            const handlerWrapper: RN.EventMapping = {
                nativeEvent: {
                    contentOffset: { }
                }
            };
            if (this.props.scrollXAnimatedValue) {
                handlerWrapper.nativeEvent.contentOffset.x = this.props.scrollXAnimatedValue;
            }
            if (this.props.scrollYAnimatedValue) {
                handlerWrapper.nativeEvent.contentOffset.y = this.props.scrollYAnimatedValue;
            }
            const eventConfig: RN.AnimatedEventConfig<RN.NativeScrollEvent> = {
                useNativeDriver: true
            };
            if (this.props.onScroll) {
                eventConfig.listener = this._onScroll;
            }
            // react-native.d.ts is wrong for the eventconfig typing, so casting to any for now.
            scrollHandler = RN.Animated.event([handlerWrapper], eventConfig as any);
        } else if (this.props.onScroll) {
            scrollHandler = this._onScroll;
        } else {
            scrollHandler = undefined;
        }

        const keyboardShouldPersistTaps = (overrideKeyboardShouldPersistTaps || this.props.keyboardShouldPersistTaps ? 'always' : 'never');

        // NOTE: We are setting `automaticallyAdjustContentInsets` to false
        // (http://facebook.github.io/react-native/docs/scrollview.html#automaticallyadjustcontentinsets). The
        // 'automaticallyAdjustContentInsets' property is designed to offset the ScrollView's content to account for the
        // navigation and tab bars in iOS.
        // (navigationBarHidden={true}). We believe that React Native may not be calculating the content insets for the
        // ScrollView correctly in this situation. Disabling this calculation seems to fix the ScrollView inset issues.
        // Currently RX does not expose any components that would require `automaticallyAdjustContentInsets` to be
        // set to true.
        // We also set removeClippedSubviews to false, overriding the default value. Most of the scroll views
        // we use are virtualized anyway.

        const internalProps: RN.ScrollViewProps & React.Props<RN.ScrollView> = {
            ref: this._setNativeComponent,
            // Bug in react-native.d.ts.  style should be "style?: StyleProp<ScrollViewStyle>;" but instead is ViewStyle.
            style: this.props.style as any,
            onScroll: scrollHandler,
            automaticallyAdjustContentInsets: false,
            showsHorizontalScrollIndicator: this.props.showsHorizontalScrollIndicator,
            showsVerticalScrollIndicator: this.props.showsVerticalScrollIndicator,
            keyboardDismissMode:  this.props.keyboardDismissMode,
            keyboardShouldPersistTaps: keyboardShouldPersistTaps,
            scrollEnabled: this.props.scrollEnabled,
            onContentSizeChange: this.props.onContentSizeChange,
            onLayout: layoutCallback,
            scrollEventThrottle: scrollThrottle,
            horizontal: this.props.horizontal,
            bounces: this.props.bounces,
            pagingEnabled: this.props.pagingEnabled,
            snapToInterval: this.props.snapToInterval,
            decelerationRate: typeof this.props.snapToInterval === 'number' ? 'fast' : undefined,
            scrollsToTop: this.props.scrollsToTop,
            removeClippedSubviews: false,
            overScrollMode: this.props.overScrollMode,
            scrollIndicatorInsets: this.props.scrollIndicatorInsets,
            onScrollBeginDrag: this.props.onScrollBeginDrag,
            onScrollEndDrag: this.props.onScrollEndDrag,
            children: this.props.children,
            testID: this.props.testId
        };

        return this._render(internalProps);
    }

    private _onScroll = (event: RN.NativeSyntheticEvent<RN.NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset;

        this._scrollTop = contentOffset.y;
        this._scrollLeft = contentOffset.x;

        if (this.props.onScroll) {
            this.props.onScroll(this._scrollTop, this._scrollLeft);
        }
    }

    setScrollTop(scrollTop: number, animate?: boolean): void {
        if (this._nativeComponent) {
            this._nativeComponent.scrollTo(
                { x: this._scrollLeft, y: scrollTop, animated: animate });
        }
    }

    setScrollLeft(scrollLeft: number, animate?: boolean): void {
        if (this._nativeComponent) {
            this._nativeComponent.scrollTo(
                { x: scrollLeft, y: this._scrollTop, animated: animate });
        }
    }

    static useCustomScrollbars() {
        // not needed
    }
}

export default ScrollView;
