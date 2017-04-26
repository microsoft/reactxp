/**
* ViewBase.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A base class for the Web-specific implementation of the cross-platform View abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./utils/lodashMini");
var ReactDOM = require("react-dom");
var RX = require("../common/Interfaces");
var SyncTasks = require("synctasks");
var Types = require("../common/Types");
// We create a periodic timer to detect layout changes that are performed behind
// our back by the browser's layout engine. We do this more aggressively when
// the app is known to be active and in the foreground.
var _layoutTimerActiveDuration = 1000;
var _layoutTimerInactiveDuration = 10000;
var ViewBase = (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isMounted = false;
        _this._lastX = 0;
        _this._lastY = 0;
        _this._lastWidth = 0;
        _this._lastHeight = 0;
        return _this;
    }
    ViewBase.prototype._getContainer = function () {
        // Perf: Don't prefetch this since we might never need it
        var containerRef = this._getContainerRef();
        if (!this._container && containerRef) {
            this._container = ReactDOM.findDOMNode(containerRef);
        }
        return this._container;
    };
    // Sets the activation state so we can stop our periodic timer
    // when the app is in the background.
    ViewBase.setActivationState = function (newState) {
        if (ViewBase._appActivationState !== newState) {
            ViewBase._appActivationState = newState;
            // Cancel any existing timers.
            if (ViewBase._viewCheckingTimer) {
                window.clearInterval(ViewBase._viewCheckingTimer);
                ViewBase._viewCheckingTimer = null;
            }
            if (ViewBase._viewCheckingList.length > 0) {
                // If we're becoming active, check and report layout changes immediately.
                if (newState === Types.AppActivationState.Active) {
                    ViewBase._checkViews();
                }
                ViewBase._viewCheckingTimer = setInterval(ViewBase._checkViews, newState === Types.AppActivationState.Active ?
                    _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
            }
        }
    };
    ViewBase.prototype.componentWillReceiveProps = function (nextProps) {
        if (!!this.props.onLayout !== !!nextProps.onLayout) {
            if (this.props.onLayout) {
                this._checkViewCheckerUnbuild();
            }
            if (nextProps.onLayout) {
                this._checkViewCheckerBuild();
            }
        }
    };
    ViewBase._checkViews = function () {
        _.each(ViewBase._viewCheckingList, function (view) {
            view._checkAndReportLayout();
        });
    };
    ViewBase._reportLayoutChange = function (func) {
        this._layoutReportList.push(func);
        if (!ViewBase._layoutReportingTimer) {
            ViewBase._layoutReportingTimer = window.setTimeout(function () {
                ViewBase._layoutReportingTimer = null;
                ViewBase._reportDeferredLayoutChanges();
            }, 0);
        }
    };
    ViewBase._reportDeferredLayoutChanges = function () {
        var reportList = this._layoutReportList;
        this._layoutReportList = [];
        _.each(reportList, function (func) {
            try {
                func();
            }
            catch (e) {
                console.error('Caught exception on onLayout response: ', e);
            }
        });
    };
    // Returns a promise to indicate when firing of onLayout event has completed (if any)
    ViewBase.prototype._checkAndReportLayout = function () {
        var _this = this;
        if (!this._isMounted) {
            return SyncTasks.Resolved();
        }
        var container = this._getContainer();
        if (!container) {
            return SyncTasks.Resolved();
        }
        var newX = container.offsetLeft;
        var newY = container.offsetTop;
        var marginTop = !container.style.marginTop ? 0 : parseInt(container.style.marginTop, 10) || 0;
        var marginBottom = !container.style.marginBottom ? 0 : parseInt(container.style.marginBottom, 10) || 0;
        var marginRight = !container.style.marginRight ? 0 : parseInt(container.style.marginRight, 10) || 0;
        var marginLeft = !container.style.marginLeft ? 0 : parseInt(container.style.marginLeft, 10) || 0;
        var newWidth = container.offsetWidth + marginRight + marginLeft;
        var newHeight = container.offsetHeight + marginTop + marginBottom;
        if (this._lastX !== newX || this._lastY !== newY || this._lastWidth !== newWidth || this._lastHeight !== newHeight) {
            this._lastX = newX;
            this._lastY = newY;
            this._lastWidth = newWidth;
            this._lastHeight = newHeight;
            var deferred_1 = SyncTasks.Defer();
            ViewBase._reportLayoutChange(function () {
                if (!_this._isMounted || !_this.props.onLayout) {
                    deferred_1.resolve();
                    return;
                }
                _this.props.onLayout({
                    x: newX,
                    y: newY,
                    width: _this._lastWidth,
                    height: _this._lastHeight
                });
                deferred_1.resolve();
            });
            return deferred_1.promise();
        }
        return SyncTasks.Resolved();
    };
    ViewBase.prototype._checkViewCheckerBuild = function () {
        // Enable the timer to check for layout changes. Use a different duration
        // when the app is active versus inactive.
        if (!ViewBase._viewCheckingTimer) {
            ViewBase._viewCheckingTimer = setInterval(ViewBase._checkViews, ViewBase._appActivationState === Types.AppActivationState.Active ?
                _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
        }
        if (!ViewBase._isResizeHandlerInstalled) {
            window.addEventListener('resize', ViewBase._onResize);
            ViewBase._isResizeHandlerInstalled = true;
        }
        ViewBase._viewCheckingList.push(this);
    };
    ViewBase.prototype._checkViewCheckerUnbuild = function () {
        var _this = this;
        ViewBase._viewCheckingList = _.filter(ViewBase._viewCheckingList, function (v) { return v !== _this; });
        if (ViewBase._viewCheckingList.length === 0) {
            if (ViewBase._viewCheckingTimer) {
                clearInterval(ViewBase._viewCheckingTimer);
                ViewBase._viewCheckingTimer = null;
            }
            if (ViewBase._isResizeHandlerInstalled) {
                window.removeEventListener('resize', ViewBase._onResize);
                ViewBase._isResizeHandlerInstalled = false;
            }
        }
    };
    ViewBase.prototype.componentDidMount = function () {
        this._isMounted = true;
        if (this.props.onLayout) {
            this._checkViewCheckerBuild();
        }
        // Chain through to the same render-checking code
        this.componentDidUpdate();
    };
    ViewBase.prototype.componentDidUpdate = function () {
        if (this.props.onLayout) {
            this._checkAndReportLayout();
        }
    };
    ViewBase._onResize = function () {
        // Often views change size in response to an overall window resize. Rather than
        // wait for the next timer to fire, do it immediately.
        ViewBase._checkViews();
    };
    ViewBase.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        // Don't retain a reference to a DOM object. This can cause memory leaks
        // because the GC may not be able to clean them up.
        this._container = null;
        if (this.props.onLayout) {
            this._checkViewCheckerUnbuild();
        }
    };
    ViewBase.prototype.blur = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.blur();
        }
    };
    ViewBase.prototype.focus = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.focus();
        }
    };
    return ViewBase;
}(RX.ViewBase));
ViewBase._viewCheckingTimer = null;
ViewBase._isResizeHandlerInstalled = false;
ViewBase._viewCheckingList = [];
ViewBase._appActivationState = Types.AppActivationState.Active;
ViewBase._layoutReportList = [];
ViewBase._layoutReportingTimer = null;
exports.ViewBase = ViewBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewBase;
