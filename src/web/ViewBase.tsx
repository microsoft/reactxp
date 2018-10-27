/**
 * ViewBase.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * A base class for the Web-specific implementation of the cross-platform View abstraction.
 */

import * as SyncTasks from 'synctasks';

import AppConfig from '../common/AppConfig';
import FrontLayerViewManager from './FrontLayerViewManager';
import * as RX from '../common/Interfaces';
import * as _ from './utils/lodashMini';
import Timers from '../common/utils/Timers';

// We create a periodic timer to detect layout changes that are performed behind
// our back by the browser's layout engine. We do this more aggressively when
// the app is known to be active and in the foreground.
const _layoutTimerActiveDuration = 1000;
const _layoutTimerInactiveDuration = 10000;

export abstract class ViewBase<P extends RX.Types.ViewProps, S> extends RX.ViewBase<P, S> {
    private static _viewCheckingTimer: number | undefined;
    private static _isResizeHandlerInstalled = false;
    private static _viewCheckingList: ViewBase<RX.Types.ViewProps, RX.Types.Stateless>[] = [];
    private static _appActivationState = RX.Types.AppActivationState.Active;

    abstract render(): JSX.Element;
    protected abstract _getContainer(): HTMLElement | null;
    protected _isMounted = false;
    private _isPopupDisplayed = false;

    // Sets the activation state so we can stop our periodic timer
    // when the app is in the background.
    static setActivationState(newState: RX.Types.AppActivationState) {
        if (ViewBase._appActivationState !== newState) {
            ViewBase._appActivationState = newState;

            // Cancel any existing timers.
            if (ViewBase._viewCheckingTimer) {
                clearInterval(ViewBase._viewCheckingTimer);
                ViewBase._viewCheckingTimer = undefined;
            }

            if (ViewBase._viewCheckingList.length > 0) {
                // If we're becoming active, check and report layout changes immediately.
                if (newState === RX.Types.AppActivationState.Active) {
                    ViewBase._checkViews();
                }

                ViewBase._viewCheckingTimer = Timers.setInterval(ViewBase._checkViews,
                    newState === RX.Types.AppActivationState.Active ?
                        _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
            }
        }
    }

    componentWillReceiveProps(nextProps: RX.Types.ViewProps) {
        if (!!this.props.onLayout !== !!nextProps.onLayout) {
            if (this.props.onLayout) {
                this._checkViewCheckerUnbuild();
            }

            if (nextProps.onLayout) {
                this._checkViewCheckerBuild();
            }
        }
    }

    protected static _checkViews() {
        _.each(ViewBase._viewCheckingList, view => {
            view._checkAndReportLayout();
        });
    }

    private static _layoutReportList: Function[] = [];
    private static _layoutReportingTimer: number | undefined;
    private static _reportLayoutChange(func: Function) {
        this._layoutReportList.push(func);

        if (!ViewBase._layoutReportingTimer) {
            ViewBase._layoutReportingTimer = Timers.setTimeout(() => {
                ViewBase._layoutReportingTimer = undefined;
                ViewBase._reportDeferredLayoutChanges();
            }, 0);
        }
    }

    protected static _reportDeferredLayoutChanges() {
        const reportList = this._layoutReportList;
        this._layoutReportList = [];

        _.each(reportList, func => {
            try {
                func();
            } catch (e) {
                if (AppConfig.isDevelopmentMode()) {
                    console.error('Caught exception on onLayout response: ', e);
                }
            }
        });
    }

    protected _lastX = 0;
    protected _lastY = 0;
    protected _lastWidth = 0;
    protected _lastHeight = 0;

    // Returns a promise to indicate when firing of onLayout event has completed (if any)
    protected _checkAndReportLayout(): SyncTasks.Promise<void> {
        if (!this._isMounted) {
            return SyncTasks.Resolved<void>();
        }

        const container = this._getContainer();
        if (!container) {
            return SyncTasks.Resolved<void>();
        }

        const newX = container.offsetLeft;
        const newY = container.offsetTop;
        const marginTop = !container.style.marginTop ? 0 : parseInt(container.style.marginTop, 10) || 0;
        const marginBottom = !container.style.marginBottom ? 0 : parseInt(container.style.marginBottom, 10) || 0;
        const marginRight = !container.style.marginRight ? 0 : parseInt(container.style.marginRight, 10) || 0;
        const marginLeft = !container.style.marginLeft ? 0 : parseInt(container.style.marginLeft, 10) || 0;
        const newWidth = container.offsetWidth + marginRight + marginLeft;
        const newHeight = container.offsetHeight + marginTop + marginBottom;

        if (this._lastX !== newX || this._lastY !== newY || this._lastWidth !== newWidth || this._lastHeight !== newHeight) {
            this._lastX = newX;
            this._lastY = newY;
            this._lastWidth = newWidth;
            this._lastHeight = newHeight;

            const deferred = SyncTasks.Defer<void>();
            ViewBase._reportLayoutChange(() => {
                if (!this._isMounted || !this.props.onLayout) {
                    deferred.resolve(void 0);
                    return;
                }

                this.props.onLayout({
                    x: newX,
                    y: newY,
                    width: this._lastWidth,
                    height: this._lastHeight
                });
                deferred.resolve(void 0);
            });
            return deferred.promise();
        }

        return SyncTasks.Resolved<void>();
    }

    private _checkViewCheckerBuild() {
        // Enable the timer to check for layout changes. Use a different duration
        // when the app is active versus inactive.
        if (!ViewBase._viewCheckingTimer) {
            ViewBase._viewCheckingTimer = Timers.setInterval(ViewBase._checkViews,
                ViewBase._appActivationState === RX.Types.AppActivationState.Active ?
                    _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
        }

        if (!ViewBase._isResizeHandlerInstalled) {
            window.addEventListener('resize', ViewBase._onResize);
            ViewBase._isResizeHandlerInstalled = true;
        }

        ViewBase._viewCheckingList.push(this);
    }

    private _checkViewCheckerUnbuild() {
        ViewBase._viewCheckingList = _.filter(ViewBase._viewCheckingList, v => v !== this);

        if (ViewBase._viewCheckingList.length === 0) {
            if (ViewBase._viewCheckingTimer) {
                clearInterval(ViewBase._viewCheckingTimer);
                ViewBase._viewCheckingTimer = undefined;
            }

            if (ViewBase._isResizeHandlerInstalled) {
                window.removeEventListener('resize', ViewBase._onResize);
                ViewBase._isResizeHandlerInstalled = false;
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.onLayout) {
            this._checkViewCheckerBuild();
        }

        // Chain through to the same render-checking code
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const isPopupDisplayed = FrontLayerViewManager.isPopupDisplayed();
        if (this.props.onLayout) {
            if (isPopupDisplayed && !this._isPopupDisplayed) {
                // A popup was just added to DOM. Checking layout now would stall script
                // execution because the browser would have to do a reflow. Avoid that
                // by deferring the work.
                setTimeout(() => {
                    this._checkAndReportLayout();
                }, 0);
            } else {
                this._checkAndReportLayout();
            }
        }
        this._isPopupDisplayed = isPopupDisplayed;
    }

    private static _onResize() {
        // Often views change size in response to an overall window resize. Rather than
        // wait for the next timer to fire, do it immediately.
        ViewBase._checkViews();
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.props.onLayout) {
            this._checkViewCheckerUnbuild();
        }
    }
}

export default ViewBase;
