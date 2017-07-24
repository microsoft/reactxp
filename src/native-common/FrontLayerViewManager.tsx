/**
* FrontLayerViewManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages stackable modals and popup views that are posted and dismissed
* by the Types showModal/dismissModal/showPopup/dismissPopup methods.
*/

import _ = require('./lodashMini');
import React = require('react');
import RN = require('react-native');
import SubscribableEvent from 'subscribableevent';

import { ModalContainer } from '../native-common/ModalContainer';
import PopupContainerView from './PopupContainerView';
import RootView from './RootView';
import Types = require('../common/Types');

class ModalStackContext {
    constructor(public modalId: string, public modal: React.ReactElement<Types.ViewProps>) {}
}

class PopupStackContext {
    constructor(public popupId: string, public popupOptions: Types.PopupOptions, public anchorHandle: number) {}
}

const _styles = {
    fullScreenView: {
        flex: 1,
        alignSelf: 'stretch',
        overflow: 'visible'
    }
};

export class FrontLayerViewManager {
    private _overlayStack: (ModalStackContext | PopupStackContext)[] = [];

    event_changed = new SubscribableEvent<() => void>();

    public showModal(modal: React.ReactElement<Types.ViewProps>, modalId: string): void {
        const index = this._findIndexOfModal(modalId);

        if (index === -1) {
            this._overlayStack.push(new ModalStackContext(modalId, modal));
            this.event_changed.fire();
        }
    }

    public isModalDisplayed(modalId: string) : boolean {
        return this._findIndexOfModal(modalId) !== -1;
    }

    public dismissModal(modalId: string): void {
        const index = this._findIndexOfModal(modalId);

        if (index >= 0) {
            this._overlayStack.splice(index, 1);
            this.event_changed.fire();
        }
    }

    public dismissAllmodals(): void {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, iter => !(iter instanceof ModalStackContext));
            this.event_changed.fire();
        }
    }

    public showPopup(
        popupOptions: Types.PopupOptions, popupId: string, delay?: number): boolean {

        if (!popupId || popupId === '') {
            console.error('FrontLayerViewManager: popupId must be valid!');
            return false;
        }

        if (!popupOptions.getAnchor()) {
            console.error('FrontLayerViewManager: getAnchor() must be valid!');
            return false;
        }

        const index = this._findIndexOfPopup(popupId);
        if (index === -1) {
            this._overlayStack.push(new PopupStackContext(popupId, popupOptions, RN.findNodeHandle(popupOptions.getAnchor())));

            this.event_changed.fire();
            return true;
        }

        return false;
    }

    public dismissPopup(popupId: string): void {
        const index = this._findIndexOfPopup(popupId);
        if (index >= 0) {
            const popupContext = this._overlayStack[index] as PopupStackContext;
            if (popupContext.popupOptions.onDismiss) {
                popupContext.popupOptions.onDismiss();
            }

            this._overlayStack.splice(index, 1);
            this.event_changed.fire();
        }
    }

    public dismissAllPopups(): void {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, iter => !(iter instanceof PopupStackContext));
            this.event_changed.fire();
        }
    }

    public getModalLayerView(rootView: RootView): any {
        const overlayContext = _.findLast(this._overlayStack, context => context instanceof ModalStackContext) as ModalStackContext;

        if (overlayContext) {
            return (
                <ModalContainer>
                    { overlayContext.modal }
                </ModalContainer>
            );
        }

        return null;
    }

    public getPopupLayerView(rootView: RootView): any {
        const overlayContext = _.findLast(this._overlayStack, context => context instanceof PopupStackContext) as PopupStackContext;

        if (overlayContext) {
            return (
                <ModalContainer>
                    <RN.TouchableWithoutFeedback
                        onPressOut={ this._onBackgroundPressed }
                        importantForAccessibility={ 'no' }
                    >
                        <RN.View style={ _styles.fullScreenView }>
                            <PopupContainerView
                                activePopupOptions={ overlayContext.popupOptions }
                                anchorHandle={ overlayContext.anchorHandle }
                                onDismissPopup={ () => this.dismissPopup(overlayContext.popupId) }
                            />
                        </RN.View>
                    </RN.TouchableWithoutFeedback>
                </ModalContainer>
            );
        }

        return null;
    }

    private _onBackgroundPressed = (e: Types.SyntheticEvent) => {
        e.persist();

        const activePopupContext = this._getActiveOverlay();
        if (!(activePopupContext instanceof PopupStackContext)) {
            return;
        }

        if (activePopupContext.popupOptions) {
            if (activePopupContext.popupOptions.onAnchorPressed) {
                RN.NativeModules.UIManager.measureInWindow(
                    activePopupContext.anchorHandle,
                    (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                        const touchEvent = (e.nativeEvent as any) as Types.TouchEvent;
                        let anchorRect: ClientRect = { left: x, top: y, right: x + width, 
                                bottom: y + height, width: width, height: height };

                        // Find out if the press event was on the anchor so we can notify the caller about it.
                        if (touchEvent.pageX >= anchorRect.left && touchEvent.pageX < anchorRect.right
                            && touchEvent.pageY >= anchorRect.top && touchEvent.pageY < anchorRect.bottom) {
                            // Showing another animation while dimissing the popup creates a conflict in the 
                            // UI making it not doing one of the two animations (i.e.: Opening an actionsheet
                            // while dismissing a popup). We introduce this delay to make sure the popup 
                            // dimissing animation has finished before we call the event handler.
                            setTimeout(() => { activePopupContext.popupOptions.onAnchorPressed(e); }, 500);
                        }
                    }
                );
            }

            // Avoid dismissing if the caller has explicitly asked to prevent
            // dismissal on clicks.
            if (activePopupContext.popupOptions.preventDismissOnPress) {
                return;
            }
        }

        this._dismissActivePopup();
    }

    private _onRequestClose = () => {
        this._dismissActivePopup();
    }

    private _dismissActivePopup(): void {
        // Dismiss any currently visible popup:
        const activePopupContext = this._getActiveOverlay();
        if (activePopupContext instanceof PopupStackContext) {
            this.dismissPopup(activePopupContext.popupId);
        }
    }

    private _findIndexOfModal(modalId: string): number {
        return _.findIndex(this._overlayStack, (iter) => iter instanceof ModalStackContext && iter.modalId === modalId);
    }

    private _findIndexOfPopup(popupId: string): number {
        return _.findIndex(this._overlayStack, (iter) => iter instanceof PopupStackContext && iter.popupId === popupId);
    }

    private _getActiveOverlay() {
        // Check for any Popup in queue
        return this._overlayStack.length === 0 ? null : _.last(this._overlayStack);
    }
}

export default new FrontLayerViewManager();
