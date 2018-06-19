/**
* AppVisibilityUtils.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific helpers for firing focus/activity related events
*/
import _ = require('./lodashMini');
import SubscribableEvent from 'subscribableevent';

const idleTimeInMs = 60 * 1000;

export class AppVisibilityUtils {
    private _isIdle = false;
    private _timer: number|undefined;
    
    onFocusedEvent = new SubscribableEvent<() => void>();
    onBlurredEvent = new SubscribableEvent<() => void>();
    onAppForegroundedEvent = new SubscribableEvent<() => void>();
    onAppBackgroundedEvent = new SubscribableEvent<() => void>();
    onIdleEvent = new SubscribableEvent<() => void>();
    onWakeUpEvent = new SubscribableEvent<() => void>();

    constructor() {
        window.addEventListener('focus', this._onFocus);
        window.addEventListener('blur', this._onBlur);
        document.addEventListener('visibilitychange', this._onAppVisibilityChanged);

        this._trackIdleStatus();
    }

    hasFocusAndActive() {
        return document.hasFocus() && !this._isIdle;
    }

    hasFocus() {
        return document.hasFocus();
    }

    private _trackIdleStatus() {
        document.addEventListener('mousemove', this._wakeUpAndSetTimerForIdle);
        document.addEventListener('keyup', this._wakeUpAndSetTimerForIdle);
        document.addEventListener('touchstart', this._wakeUpAndSetTimerForIdle);
        document.addEventListener('scroll', this._wakeUpAndSetTimerForIdle);

        this._wakeUpAndSetTimerForIdle();
    }

    private _wakeUpAndSetTimerForIdle = () => {
        if (!_.isUndefined(this._timer)) {
            clearTimeout(this._timer);
        }

        if (!this.hasFocus()) {
            return;
        }

        if (this.hasFocus() && this._isIdle) {
            this._onWakeUp();
        }

        this._timer = setTimeout(() => {
            if (this.hasFocus()) {
                this._onIdle();
            }
        }, idleTimeInMs);
    }

    private _onFocus = () => {
        this._wakeUpAndSetTimerForIdle();        
        this.onFocusedEvent.fire();
    }

    private _onBlur = () => {
        this._onIdle();        
        this.onBlurredEvent.fire();
    }

    private _onAppVisibilityChanged = () => {
        if (document.hidden) {
            this.onAppBackgroundedEvent.fire();
        } else {
            this.onAppForegroundedEvent.fire();
        }
    }

    private _onWakeUp = () => {
        this._isIdle = false;        
        this.onWakeUpEvent.fire();
    }
    private _onIdle = () => {
        this._isIdle = true;        
        this.onIdleEvent.fire();
    }
}

export default new AppVisibilityUtils();
