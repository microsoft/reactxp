/**
 * FrontLayerViewManager.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages the layering of the main view, modals and popups.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Types } from '../common/Interfaces';
import MouseResponder from './utils/MouseResponder';
import { PopupDescriptor, RootView } from './RootView';
import Timers from '../common/utils/Timers';

const MAX_CACHED_POPUPS = 4;

export class FrontLayerViewManager {
    private _mainView: React.ReactElement<any> | undefined;
    private _modalStack: { modal: React.ReactElement<Types.ViewProps>; id: string }[] = [];

    private _activePopupOptions: Types.PopupOptions | undefined;
    private _activePopupId: string | undefined;
    private _activePopupAutoDismiss = false;
    private _activePopupAutoDismissDelay = 0;
    private _activePopupShowDelay = 0;
    private _popupShowDelayTimer: number | undefined;
    private _cachedPopups: PopupDescriptor[] = [];

    // We need to be careful accessing document because it may not be defined
    // in some environments like Electron.
    private _isRtlDefault = typeof document !== 'undefined' &&
        typeof document.documentElement !== 'undefined' && document.documentElement.dir === 'rtl';
    private _isRtlAllowed = true;
    private _isRtlForced = false;

    setMainView(element: React.ReactElement<any>): void {
        this._mainView = element;
        this._renderRootView();
    }

    isModalDisplayed(modalId?: string): boolean {
        if (modalId) {
            return this._modalStack.some(d => d.id === modalId);
        } else {
            return this._modalStack.length > 0;
        }
    }

    showModal(modal: React.ReactElement<Types.ViewProps>, modalId: string, options?: Types.ModalOptions) {
        // Dismiss any active popups.
        if (this._activePopupOptions) {
            this.dismissPopup(this._activePopupId!);
        }

        this._modalStack.push({ modal: modal, id: modalId });
        this._renderRootView();
    }

    dismissModal(modalId: string) {
        this._modalStack = this._modalStack.filter(d => d.id !== modalId);
        this._renderRootView();
    }

    dismissAllModals() {
        if (this._modalStack.length > 0) {
            this._modalStack = [];
            this._renderRootView();
        }
    }

    private _shouldPopupBeDismissed = (options: Types.PopupOptions): boolean => {
        return !!this._activePopupOptions &&
            this._activePopupOptions.getAnchor() === options.getAnchor();
    }

    private _updateModalDisplayedState() {
        MouseResponder.setModalIsDisplayed(this.isModalDisplayed());
    }

    showPopup(options: Types.PopupOptions, popupId: string, showDelay?: number): boolean {
        // If options.dismissIfShown is true, calling this method will behave like a toggle.
        // On one call, it will open the popup. If it is called when pop up is seen, it will
        // dismiss the popup. If options.dismissIfShown is false, we will simply show the
        // popup always.
        if (options.dismissIfShown) {
            if (this._shouldPopupBeDismissed(options)) {
                this.dismissPopup(popupId);
                return false;
            }
        }

        this._showPopup(options, popupId, showDelay);
        return true;
    }

    private _showPopup(options: Types.PopupOptions, popupId: string, showDelay?: number) : void {
        // New popup is transitioning from maybe cached to active.
        this._cachedPopups = this._cachedPopups.filter(popup => popup.popupId !== popupId);
        if (this._activePopupOptions && this._activePopupOptions.cacheable && this._activePopupId !== popupId) {
            // Old popup is transitioning from active to cached.
            this._cachedPopups.push({ popupOptions: this._activePopupOptions, popupId: this._activePopupId! });
            this._cachedPopups = this._cachedPopups.slice(-MAX_CACHED_POPUPS);
        }

        // Update fields before calling onDismiss to guard against reentry.
        const oldPopupOptions = this._activePopupOptions;
        this._activePopupOptions = options;
        this._activePopupId = popupId;
        this._activePopupAutoDismiss = false;
        this._activePopupAutoDismissDelay = 0;
        this._activePopupShowDelay = showDelay || 0;

        if (this._popupShowDelayTimer) {
            clearTimeout(this._popupShowDelayTimer);
            this._popupShowDelayTimer = undefined;
        }
        if (this._activePopupShowDelay > 0) {
            this._popupShowDelayTimer = Timers.setTimeout(() => {
                this._activePopupShowDelay = 0;
                this._popupShowDelayTimer = undefined;
                this._renderRootView();
            }, this._activePopupShowDelay);
        }

        if (oldPopupOptions) {
            if (oldPopupOptions.onDismiss) {
                oldPopupOptions.onDismiss();
            }
        }

        this._renderRootView();
    }

    autoDismissPopup(popupId: string, dismissDelay?: number): void {
        if (popupId === this._activePopupId && this._activePopupOptions) {
            if (this._popupShowDelayTimer) {
                clearTimeout(this._popupShowDelayTimer);
                this._popupShowDelayTimer = undefined;
            }

            this._activePopupAutoDismiss = true;
            this._activePopupAutoDismissDelay = dismissDelay || 0;
            this._renderRootView();
        }
    }

    dismissPopup(popupId: string): void {
        if (popupId === this._activePopupId && this._activePopupOptions) {
            if (this._popupShowDelayTimer) {
                clearTimeout(this._popupShowDelayTimer);
                this._popupShowDelayTimer = undefined;
            }

            if (this._activePopupOptions.cacheable) {
                // The popup is transitioning from active to cached.
                this._cachedPopups.push({ popupOptions: this._activePopupOptions, popupId: this._activePopupId });
                this._cachedPopups = this._cachedPopups.slice(-MAX_CACHED_POPUPS);
            }

            // Reset fields before calling onDismiss to guard against reentry.
            const activePopupOptions = this._activePopupOptions;
            this._activePopupOptions = undefined;
            this._activePopupId = undefined;

            if (activePopupOptions.onDismiss) {
                activePopupOptions.onDismiss();
            }

            this._renderRootView();
        }
    }

    dismissAllPopups() {
        if (this._activePopupId) {
            this.dismissPopup(this._activePopupId);
        }
    }

    private _renderRootView() {
        const topModal = this._modalStack.length > 0 ?
            this._modalStack[this._modalStack.length - 1].modal : undefined;
        const activePopup = (!this._activePopupOptions || this._activePopupShowDelay > 0) ? undefined :
            { popupOptions: this._activePopupOptions, popupId: this._activePopupId! };

        this._updateModalDisplayedState();

        const rootView = (
            <RootView
                mainView={ this._mainView }
                keyBoardFocusOutline={ this._mainView!.props.keyBoardFocusOutline }
                mouseFocusOutline={ this._mainView!.props.mouseFocusOutline }
                modal={ topModal }
                activePopup={ activePopup }
                cachedPopup={ this._cachedPopups }
                autoDismiss={ this._activePopupAutoDismiss }
                autoDismissDelay={ this._activePopupAutoDismissDelay }
                onDismissPopup={ () => this.dismissPopup(this._activePopupId!) }
                writingDirection={ this._isRtlForced ? 'rtl' : (this._isRtlAllowed ? 'auto' : 'ltr') }
            />
        );

        const container = document.getElementsByClassName('app-container')[0];

        ReactDOM.render(rootView, container);
    }

    isPopupDisplayed(popupId?: string): boolean {
        if (popupId) {
            return popupId === this._activePopupId;
        } else {
            return !!this._activePopupId;
        }
    }

    allowRTL(allow: boolean) {
        if (this._isRtlAllowed !== allow) {
            this._isRtlAllowed = allow;
            this._renderRootView();
        }
    }

    forceRTL(force: boolean) {
        if (this._isRtlForced !== force) {
            this._isRtlForced = force;
            this._renderRootView();
        }
    }

    isRTL(): boolean {
        return this._isRtlForced || (this._isRtlDefault && this._isRtlAllowed);
    }
}

export default new FrontLayerViewManager();
