/**
* ScrollView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform ScrollView abstraction.
*/

import React = require('react');
import RN = require('react-native');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import ViewBase from './ViewBase';

export class ScrollView extends ViewBase<Types.ScrollViewProps, Types.Stateless> implements RX.ScrollView {
    private _scrollTop = 0;
    private _scrollLeft = 0;
    protected _nativeView: any;

    protected _render(props: Types.ScrollViewProps): JSX.Element {
        let nativeProps = props as RN.ScrollViewProps;

        return (
            <RN.ScrollView { ...nativeProps }>
                { props.children }
            </RN.ScrollView>
        );
    }

    render() {
        let scrollThrottle = this.props.scrollEventThrottle || 16;

        if (scrollThrottle === 0) {
            // Fire at 60fps
            scrollThrottle = 16;
        }

        var layoutCallback = this.props.onLayout ?
            // We have a callback function, call the wrapper
            this._onLayout :
            undefined;

        var scrollCallback = this.props.onScroll ?
            // We have a callback function, call the wrapper
            this._onScroll :
            undefined;

        const keyboardShouldPersistTaps = (this.props.keyboardShouldPersistTaps ? 'always' : 'never');

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

        const internalProps: any = {
            ref: this._setNativeView,
            style: this.props.style,
            onScroll: scrollCallback,
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
            scrollsToTop: this.props.scrollsToTop,
            removeClippedSubviews: false,
            overScrollMode: this.props.overScrollMode,
            scrollIndicatorInsets: this.props.scrollIndicatorInsets,
            onScrollBeginDrag: this.props.onScrollBeginDrag,
            onScrollEndDrag: this.props.onScrollEndDrag,
            children: this.props.children
        };

        return this._render(internalProps);
    }

    private _onScroll = (event: React.SyntheticEvent<ScrollView>) => {
        const nativeEvent = event.nativeEvent as any;
        this._scrollTop = nativeEvent.contentOffset.y;
        this._scrollLeft = nativeEvent.contentOffset.x;

        if (this.props.onScroll) {
            this.props.onScroll(this._scrollTop, this._scrollLeft);
        }
    }

    setScrollTop(scrollTop: number, animate?: boolean): void {
        if (this._nativeView) {
            this._nativeView.scrollTo(
                { x: this._scrollLeft, y: scrollTop, animated: animate });
        }
    }

    setScrollLeft(scrollLeft: number, animate?: boolean): void {
        if (this._nativeView) {
            this._nativeView.scrollTo(
                { x: scrollLeft, y: this._scrollTop, animated: animate });
        }
    }

    addToScrollTop(deltaTop: number, animate?: boolean): void {
        if (this._nativeView) {
            this._nativeView.scrollBy(
                { deltaX: 0, deltaY: deltaTop, animated: animate });
        }
    }

    addToScrollLeft(deltaLeft: number, animate?: boolean): void {
        if (this._nativeView) {
            this._nativeView.scrollBy(
                { deltaX: deltaLeft, deltaY: 0, animated: animate });
        }
    }

    static useCustomScrollbars() {
        // not needed
    }
}

export default ScrollView;
