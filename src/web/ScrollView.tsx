/**
* ScrollView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform ScrollView abstraction.
*/

import _ = require('./utils/lodashMini');
import React = require('react');
import ReactDOM = require('react-dom');

import CustomScrollbar from './CustomScrollbar';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import ScrollViewConfig from './ScrollViewConfig';
import Types = require('../common/Types');
import ViewBase from './ViewBase';

let _styles = {
    defaultStyle: {
        position: 'relative',
        overflow: 'hidden',
        alignSelf: 'stretch',
        flexGrow: 1,
        flexShrink: 1,

        // This forces some browsers (like Chrome) to create a new render context,
        // which can significantly speed up scrolling.
        transform: 'translateZ(0)'
    },
    verticalStyle: {
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    horizontalStyle: {
        flexDirection: 'row',
        overflowY: 'hidden',
        overflowX: 'auto'
    },
    bothStyle: {
        overflowY: 'auto',
        overflowX: 'auto'
    }
};

let _initializedCustomStyles = false;
let _customStyles = {
    defaultStyle: {
        overflow: 'hidden',
        msOverflowStyle: 'auto',
        flexDirection: 'column',

        // This forces some browsers (like Chrome) to create a new render context,
        // which can significantly speed up scrolling.
        transform: 'translateZ(0)'
    },
    verticalStyle: {},
    horizontalStyle: {},
    bothStyle: {},
    customScrollContainer: {
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        alignSelf: 'stretch'
    },
    customScrollVertical: {
        // Set flex only for vertical scroll view.
        // Don't set flex for horizontal scroll view, otherwise it disappears.
        display: 'flex',
        flex: '1 1 0px'
    }
};

// Default to once per frame.
const _defaultScrollThrottleValue = 1000 / 60;

export class ScrollView extends ViewBase<Types.ScrollViewProps, {}> implements RX.IScrollView {
    constructor(props: Types.ScrollViewProps) {
        super(props);

        // Set final styles upon initialization of the first ScrollView. This was previously done in the head
        // of this file, but it broke the pattern of not doing external work (such as accessing the document
        // object) on Types initialization.
        if (!_initializedCustomStyles) {
            _initializedCustomStyles = true;

            const nativeScrollbarWidth = CustomScrollbar.getNativeScrollbarWidth();

            _customStyles.verticalStyle = {
                overflowY: 'scroll',
                paddingRight: 30 - nativeScrollbarWidth,
                marginRight: -30,
                // Fixes a bug for Chrome beta where the parent flexbox (customScrollContainer) doesn't 
                // recognize that its child got populated with items. Smallest default width gives an 
                // indication that content will exist here.
                minHeight: 0
            };

            _customStyles.horizontalStyle = {
                // The display needs to be set to flex, otherwise the scrollview incorrectly shows up vertically.
                display: 'flex',
                overflowX: 'scroll',
                paddingBottom: 30 - nativeScrollbarWidth,
                marginBottom: -30,
                // Fixes a bug for Chrome beta where the parent flexbox (customScrollContainer) doesn't 
                // recognize that its child got populated with items. Smallest default width gives an 
                // indication that content will exist here.
                minWidth: 0
            };

            _customStyles.bothStyle = Styles.combine([_customStyles.verticalStyle, _customStyles.horizontalStyle]);
        }
    }

    private _mounted = false;
    private _customScrollbar: CustomScrollbar;
    private _customScrollbarEnabled = true;
    private _dragging = false;

    componentDidUpdate() {
        super.componentDidUpdate();
        if (!this.props.onContentSizeChange) {
            return;
        }

        _.defer(() => {
            if (this.props.onContentSizeChange) {
                const container = this._getContainer();
                if (!container) {
                    return;
                }
                this.props.onContentSizeChange(container.scrollWidth, container.scrollHeight);
            }
        });
    }

    render() {
        return this._customScrollbarEnabled ? this._renderWithCustomScrollbar() : this._renderNormal();
    }

    componentWillMount() {
        this._onPropsChange(this.props);
    }

    componentDidMount() {
        super.componentDidMount();
        this._mounted = true;

        if (this._customScrollbarEnabled) {
            let element = ReactDOM.findDOMNode<HTMLElement>(this);
            if (element) {
                this._customScrollbar = new CustomScrollbar(element);
                this._customScrollbar.init({ horizontal: this.props.horizontal, vertical: this.props.vertical });
            }
        }
    }

    componentWillReceiveProps(newProps: Types.ScrollViewProps) {
        super.componentWillReceiveProps(newProps);
        this._onPropsChange(newProps);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this._mounted = false;

        if (this._customScrollbarEnabled) {
            this._customScrollbar.dispose();
        }
    }

    protected _getContainerRef(): React.Component<any, any> {
        return this.refs['scrollView'];
    }

    // Throttled scroll handler
    private _onScroll = _.throttle((e: React.SyntheticEvent) => {
        if (!this._mounted) {
            return;
        }

        if (this._customScrollbarEnabled) {
            this._customScrollbar.update();
        }

        // Check if this should be also fire an onLayout event
        // The browser sends a scroll event when resizing
        const onLayoutPromise = this._checkAndReportLayout();

        // Recent versions of Chrome have started to defer all timers until
        // after scrolling has completed. Because of this, our deferred layout
        // reporting sometimes doesn't get handled for up to seconds at a time.
        // Force the list of deferred changes to be reported now.
        ViewBase._reportDeferredLayoutChanges();

        if (this.props.onScroll) {
            onLayoutPromise.then(() => {
                const container = this._getContainer();
                if (!container) {
                    return;
                }
                this.props.onScroll(container.scrollTop, container.scrollLeft);
            });
        }
    }, (this.props.scrollEventThrottle || _defaultScrollThrottleValue), { leading: true, trailing: true });

    private _onPropsChange(props: Types.ScrollViewProps) {
        this._customScrollbarEnabled = ScrollViewConfig.useCustomScrollbars();
    }

    private _getContainerStyle(): Types.ScrollViewStyleRuleSet {
        let styles: any = [{ display: 'block' }];
        let sourceStyles = this._customScrollbarEnabled ? _customStyles : _styles;

        styles.push(sourceStyles.defaultStyle);

        if (this.props.horizontal && this.props.vertical) {
            styles.push(sourceStyles.bothStyle);
        } else if (this.props.horizontal) {
            styles.push(sourceStyles.horizontalStyle);
        } else {
            styles.push(sourceStyles.verticalStyle);
        }

        return Styles.combine([styles, this.props.style]);
    }

    private _renderNormal() {
        return (
            <div
                ref='scrollView'
                onScroll={ this._onScroll }
                onTouchStart={ this._onTouchStart }
                onTouchEnd={ this._onTouchEnd }
                style={ this._getContainerStyle() }
            >
                { this.props.children }
            </div>
        );
    }

    private _renderWithCustomScrollbar() {
        let containerStyles: any = _customStyles.customScrollContainer;
        if (this.props.justifyEnd) {
            containerStyles = _.extend({ justifyContent: 'flex-end' }, containerStyles);
        }

        let scrollComponentClassNames = ['scrollViewport'];
        if (this.props.horizontal) {
            scrollComponentClassNames.push('scrollViewportH');
        }
        if (this.props.vertical || this.props.vertical === undefined) {
            scrollComponentClassNames.push('scrollViewportV');
            containerStyles = _.extend({}, _customStyles.customScrollVertical, containerStyles);
        }

        return (
            <div
                className = 'rxCustomScroll'
                style={ containerStyles }
            >
                <div
                    ref='scrollView'
                    className={ scrollComponentClassNames.join(' ') }
                    onScroll={ this._onScroll }
                    style={ this._getContainerStyle() }
                    onKeyDown={ this.props.onKeyPress }
                    onFocus={ this.props.onFocus }
                    onBlur={ this.props.onBlur }
                    onTouchStart={ this._onTouchStart }
                    onTouchEnd={ this._onTouchEnd }
                >
                    { this.props.children }
                </div>
            </div>
        );
    }

    setScrollTop(scrollTop: number, animate = false): void {
        const container = this._getContainer();
        if (!container) {
            return;
        }
        this._onScroll.cancel();
        if (animate) {
            const start = container.scrollTop;
            const change = scrollTop - start;
            const increment = 20;
            const duration = 200;

            const animateScroll = (elapsedTime: number) => {
                elapsedTime += increment;
                var position = this._easeInOut(elapsedTime, start, change, duration);
                container.scrollTop = position;
                if (elapsedTime < duration) {
                    window.setTimeout(function() {
                        animateScroll(elapsedTime);
                    }, increment);
                }
            };

            animateScroll(0);
        } else {
            container.scrollTop = scrollTop;
        }
    }

    setScrollLeft(scrollLeft: number, animate = false): void {
        const container = this._getContainer();
        if (!container) {
            return;
        }
        this._onScroll.cancel();
        if (animate) {
            const start = container.scrollLeft;
            const change = scrollLeft - start;
            const increment = 20;
            const duration = 200;

            const animateScroll = (elapsedTime: number) => {
                elapsedTime += increment;
                var position = this._easeInOut(elapsedTime, start, change, duration);
                container.scrollLeft = position;
                if (elapsedTime < duration) {
                    window.setTimeout(function() {
                        animateScroll(elapsedTime);
                    }, increment);
                }
            };

            animateScroll(0);
        } else {
            container.scrollLeft = scrollLeft;
        }
    }

    addToScrollTop(deltaTop: number, animate: boolean): void {
        const container = this._getContainer();
        if (!container) {
            return;
        }
        this.setScrollTop(container.scrollTop + deltaTop, animate);
    }

    addToScrollLeft(deltaLeft: number, animate: boolean): void {
        const container = this._getContainer();
        if (!container) {
            return;
        }
        this.setScrollLeft(container.scrollLeft + deltaLeft, animate);
    }

    private _easeInOut(currentTime: number, start: number, change: number, duration: number) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }

    private _onTouchStart = () => {
        if (!this._dragging) {
            this._dragging = true;
            if (this.props.onScrollBeginDrag) {
                this.props.onScrollBeginDrag();
            }
        }
    }

    private _onTouchEnd = () => {
        this._dragging = false;
        if (this.props.onScrollEndDrag) {
            this.props.onScrollEndDrag();
        }
    }
}

export default ScrollView;
