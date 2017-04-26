/**
* ScrollView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform ScrollView abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./utils/lodashMini");
var React = require("react");
var ReactDOM = require("react-dom");
var CustomScrollbar_1 = require("./CustomScrollbar");
var Styles_1 = require("./Styles");
var ScrollViewConfig_1 = require("./ScrollViewConfig");
var ViewBase_1 = require("./ViewBase");
var _styles = {
    defaultStyle: {
        position: 'relative',
        overflow: 'hidden',
        alignSelf: 'stretch',
        flex: '1 1 auto',
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
var _initializedCustomStyles = false;
var _customStyles = {
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
var _defaultScrollThrottleValue = 1000 / 60;
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView(props) {
        var _this = _super.call(this, props) || this;
        _this._customScrollbarEnabled = true;
        _this._dragging = false;
        // Throttled scroll handler
        _this._onScroll = _.throttle(function (e) {
            if (_this._customScrollbarEnabled) {
                _this._customScrollbar.update();
            }
            // Check if this should be also fire an onLayout event
            // The browser sends a scroll event when resizing
            var onLayoutPromise = _this._checkAndReportLayout();
            // Recent versions of Chrome have started to defer all timers until
            // after scrolling has completed. Because of this, our deferred layout
            // reporting sometimes doesn't get handled for up to seconds at a time.
            // Force the list of deferred changes to be reported now.
            ViewBase_1.default._reportDeferredLayoutChanges();
            if (_this.props.onScroll) {
                onLayoutPromise.then(function () {
                    var container = _this._getContainer();
                    if (!container) {
                        return;
                    }
                    _this.props.onScroll(container.scrollTop, container.scrollLeft);
                });
            }
        }, (_this.props.scrollEventThrottle || _defaultScrollThrottleValue), { leading: true, trailing: true });
        _this._onTouchStart = function () {
            if (!_this._dragging) {
                _this._dragging = true;
                _this.props.onScrollBeginDrag();
            }
        };
        _this._onTouchEnd = function () {
            _this._dragging = false;
            _this.props.onScrollEndDrag();
        };
        // Set final styles upon initialization of the first ScrollView. This was previously done in the head
        // of this file, but it broke the pattern of not doing external work (such as accessing the document
        // object) on Types initialization.
        if (!_initializedCustomStyles) {
            _initializedCustomStyles = true;
            var nativeScrollbarWidth = CustomScrollbar_1.default.getNativeScrollbarWidth();
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
            _customStyles.bothStyle = Styles_1.default.combine(null, [_customStyles.verticalStyle, _customStyles.horizontalStyle]);
        }
        return _this;
    }
    ScrollView.prototype.componentDidUpdate = function () {
        var _this = this;
        _super.prototype.componentDidUpdate.call(this);
        if (!this.props.onContentSizeChange) {
            return;
        }
        _.defer(function () {
            if (_this.props.onContentSizeChange) {
                var container = _this._getContainer();
                if (!container) {
                    return;
                }
                _this.props.onContentSizeChange(container.scrollWidth, container.scrollHeight);
            }
        });
    };
    ScrollView.prototype.render = function () {
        return this._customScrollbarEnabled ? this._renderWithCustomScrollbar() : this._renderNormal();
    };
    ScrollView.prototype.componentWillMount = function () {
        this._onPropsChange(this.props);
    };
    ScrollView.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (this._customScrollbarEnabled) {
            var element = ReactDOM.findDOMNode(this);
            if (element) {
                this._customScrollbar = new CustomScrollbar_1.default(element);
                this._customScrollbar.init({ horizontal: this.props.horizontal, vertical: this.props.vertical });
            }
        }
    };
    ScrollView.prototype.componentWillReceiveProps = function (newProps) {
        _super.prototype.componentWillReceiveProps.call(this, newProps);
        this._onPropsChange(newProps);
    };
    ScrollView.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (this._customScrollbarEnabled) {
            this._customScrollbar.dispose();
        }
    };
    ScrollView.prototype._getContainerRef = function () {
        return this.refs['scrollView'];
    };
    ScrollView.prototype._onPropsChange = function (props) {
        this._customScrollbarEnabled = ScrollViewConfig_1.default.useCustomScrollbars();
    };
    ScrollView.prototype._getContainerStyle = function () {
        var styles = [{ display: 'block' }];
        var sourceStyles = this._customScrollbarEnabled ? _customStyles : _styles;
        styles.push(sourceStyles.defaultStyle);
        if (this.props.horizontal && this.props.vertical) {
            styles.push(sourceStyles.bothStyle);
        }
        else if (this.props.horizontal) {
            styles.push(sourceStyles.horizontalStyle);
        }
        else {
            styles.push(sourceStyles.verticalStyle);
        }
        var defaultStyle = Styles_1.default.combine(null, styles);
        return Styles_1.default.combine(defaultStyle, this.props.style);
    };
    ScrollView.prototype._renderNormal = function () {
        return (React.createElement("div", { ref: 'scrollView', onScroll: this._onScroll, onTouchStart: this._onTouchStart, onTouchEnd: this._onTouchEnd, style: this._getContainerStyle() }, this.props.children));
    };
    ScrollView.prototype._renderWithCustomScrollbar = function () {
        var containerStyles = _customStyles.customScrollContainer;
        if (this.props.justifyEnd) {
            containerStyles = _.extend({ justifyContent: 'flex-end' }, containerStyles);
        }
        var scrollComponentClassNames = ['scrollViewport'];
        if (this.props.horizontal) {
            scrollComponentClassNames.push('scrollViewportH');
        }
        if (this.props.vertical || this.props.vertical === undefined) {
            scrollComponentClassNames.push('scrollViewportV');
            containerStyles = _.extend({}, _customStyles.customScrollVertical, containerStyles);
        }
        return (React.createElement("div", { className: 'rxCustomScroll', style: containerStyles },
            React.createElement("div", { ref: 'scrollView', className: scrollComponentClassNames.join(' '), onScroll: this._onScroll, style: this._getContainerStyle(), onKeyDown: this.props.onKeyPress, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onTouchStart: this._onTouchStart, onTouchEnd: this._onTouchEnd }, this.props.children)));
    };
    ScrollView.prototype.setScrollTop = function (scrollTop, animate) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        var container = this._getContainer();
        if (!container) {
            return;
        }
        if (animate) {
            var start_1 = container.scrollTop;
            var change_1 = scrollTop - start_1;
            var increment_1 = 20;
            var duration_1 = 200;
            var animateScroll_1 = function (elapsedTime) {
                elapsedTime += increment_1;
                var position = _this._easeInOut(elapsedTime, start_1, change_1, duration_1);
                container.scrollTop = position;
                if (elapsedTime < duration_1) {
                    window.setTimeout(function () {
                        animateScroll_1(elapsedTime);
                    }, increment_1);
                }
            };
            animateScroll_1(0);
        }
        else {
            container.scrollTop = scrollTop;
        }
    };
    ScrollView.prototype.setScrollLeft = function (scrollLeft, animate) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        var container = this._getContainer();
        if (!container) {
            return;
        }
        if (animate) {
            var start_2 = container.scrollLeft;
            var change_2 = scrollLeft - start_2;
            var increment_2 = 20;
            var duration_2 = 200;
            var animateScroll_2 = function (elapsedTime) {
                elapsedTime += increment_2;
                var position = _this._easeInOut(elapsedTime, start_2, change_2, duration_2);
                container.scrollLeft = position;
                if (elapsedTime < duration_2) {
                    window.setTimeout(function () {
                        animateScroll_2(elapsedTime);
                    }, increment_2);
                }
            };
            animateScroll_2(0);
        }
        else {
            container.scrollLeft = scrollLeft;
        }
    };
    ScrollView.prototype.addToScrollTop = function (deltaTop, animate) {
        var container = this._getContainer();
        if (!container) {
            return;
        }
        this.setScrollTop(container.scrollTop + deltaTop, animate);
    };
    ScrollView.prototype.addToScrollLeft = function (deltaLeft, animate) {
        var container = this._getContainer();
        if (!container) {
            return;
        }
        this.setScrollLeft(container.scrollLeft + deltaLeft, animate);
    };
    ScrollView.prototype._easeInOut = function (currentTime, start, change, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    };
    return ScrollView;
}(ViewBase_1.default));
exports.ScrollView = ScrollView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollView;
