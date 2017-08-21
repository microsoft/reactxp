/**
* FrontLayerViewManager.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages the layering of the main view, modals and popups.
*/

import React = require('react');
import ReactDOM = require('react-dom');

import { RootView } from './RootView';

import Types = require('../common/Types');

export class FrontLayerViewManager {
    private _mainView: React.ReactElement<any> = null;
    private _modalStack: { modal: React.ReactElement<Types.ViewProps>, id: string }[] = [];

    private _activePopupOptions: Types.PopupOptions = null;
    private _activePopupId: string = null;
    private _activePopupAutoDismiss: boolean = false;
    private _activePopupAutoDismissDelay: number = 0;
    private _activePopupShowDelay: number = 0;
    private _popupShowDelayTimer: any = null;

    setMainView(element: React.ReactElement<any>): void {
        this._mainView = element;
        this._renderRootView();
    }

    isModalDisplayed(modalId: string): boolean {
        return this._modalStack.some(d => d.id === modalId);
    }

    showModal(modal: React.ReactElement<Types.ViewProps>, modalId: string) {
        if (!modalId) {
            console.error('modal must have valid ID');
        }

        // Dismiss any active popups.
        if (this._activePopupOptions) {
            this.dismissPopup(this._activePopupId);
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
        return this._activePopupOptions &&
            this._activePopupOptions.getAnchor() === options.getAnchor();
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
        if (this._activePopupOptions) {
            if (this._activePopupOptions.onDismiss) {
                this._activePopupOptions.onDismiss();
            }
        }

        if (this._popupShowDelayTimer) {
            clearTimeout(this._popupShowDelayTimer);
            this._popupShowDelayTimer = null;
        }

        this._activePopupOptions = options;
        this._activePopupId = popupId;
        this._activePopupAutoDismiss = false;
        this._activePopupAutoDismissDelay = 0;
        this._activePopupShowDelay = showDelay || 0;
        this._renderRootView();

        if (this._activePopupShowDelay > 0) {
            this._popupShowDelayTimer = window.setTimeout(() => {
                this._activePopupShowDelay = 0;
                this._popupShowDelayTimer = null;
                this._renderRootView();
            }, this._activePopupShowDelay);
        }
    }

    autoDismissPopup(popupId: string, dismissDelay?: number): void {
        if (popupId === this._activePopupId && this._activePopupOptions) {
            if (this._popupShowDelayTimer) {
                clearTimeout(this._popupShowDelayTimer);
                this._popupShowDelayTimer = null;
            }

            this._activePopupAutoDismiss = true;
            this._activePopupAutoDismissDelay = dismissDelay || 0;
            this._renderRootView();
        }
    }

    dismissPopup(popupId: string): void {
        if (popupId === this._activePopupId && this._activePopupOptions) {
            if (this._activePopupOptions.onDismiss) {
                this._activePopupOptions.onDismiss();
            }

            if (this._popupShowDelayTimer) {
                clearTimeout(this._popupShowDelayTimer);
                this._popupShowDelayTimer = null;
            }

            this._activePopupOptions = null;
            this._activePopupId = null;
            this._renderRootView();
        }
    }

    dismissAllPopups() {
        this.dismissPopup(this._activePopupId);
    }

    private _renderRootView() {
        let topModal = this._modalStack.length > 0 ?
            this._modalStack[this._modalStack.length - 1].modal : null;

        let rootView = (
            <RootView
                mainView={ this._mainView }
                keyBoardFocusOutline={ this._mainView.props.keyBoardFocusOutline }
                mouseFocusOutline={ this._mainView.props.mouseFocusOutline }
                modal={ topModal }
                activePopupOptions={ this._activePopupShowDelay > 0 ? null : this._activePopupOptions }
                autoDismiss={ this._activePopupAutoDismiss }
                autoDismissDelay={ this._activePopupAutoDismissDelay }
                onDismissPopup={ () => this.dismissPopup(this._activePopupId) }
            />
        );

        const container = document.getElementsByClassName('app-container')[0];

        ReactDOM.render(rootView, container);
    }
}

export default new FrontLayerViewManager();
