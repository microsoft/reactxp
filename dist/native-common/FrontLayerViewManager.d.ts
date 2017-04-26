import React = require('react');
import SubscribableEvent = require('../common/SubscribableEvent');
import RootView from './RootView';
import Types = require('../common/Types');
export declare class FrontLayerViewManager {
    private _overlayStack;
    event_changed: SubscribableEvent.SubscribableEvent<() => void>;
    showModal(modal: React.ReactElement<Types.ViewProps>, modalId: string): void;
    isModalDisplayed(modalId: string): boolean;
    dismissModal(modalId: string): void;
    dismissAllmodals(): void;
    showPopup(popupOptions: Types.PopupOptions, popupId: string, delay?: number): boolean;
    dismissPopup(popupId: string): void;
    dismissAllPopups(): void;
    getModalLayerView(rootView: RootView): any;
    getPopupLayerView(rootView: RootView): any;
    private _onBackgroundPressed;
    private _onRequestClose;
    private _dismissActivePopup();
    private _findIndexOfModal(modalId);
    private _findIndexOfPopup(popupId);
    private _getActiveOverlay();
}
declare var _default: FrontLayerViewManager;
export default _default;
