/**
* FrontLayerViewManager.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages the layering of the main view, modals and popups.
*/
import React = require('react');
import Types = require('../common/Types');
export declare class FrontLayerViewManager {
    private _mainView;
    private _modalStack;
    private _activePopupOptions;
    private _activePopupId;
    private _activePopupAutoDismiss;
    private _activePopupAutoDismissDelay;
    private _activePopupShowDelay;
    private _popupShowDelayTimer;
    setMainView(element: React.ReactElement<any>): void;
    isModalDisplayed(modalId: string): boolean;
    showModal(modal: React.ReactElement<Types.ViewProps>, modalId: string): void;
    dismissModal(modalId: string): void;
    dismissAllModals(): void;
    private _shouldPopupBeDismissed;
    showPopup(options: Types.PopupOptions, popupId: string, showDelay?: number): boolean;
    private _showPopup(options, popupId, showDelay?);
    autoDismissPopup(popupId: string, dismissDelay?: number): void;
    dismissPopup(popupId: string): void;
    dismissAllPopups(): void;
    private _renderRootView();
}
declare var _default: FrontLayerViewManager;
export default _default;
