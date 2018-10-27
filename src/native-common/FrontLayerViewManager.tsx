/**
 * FrontLayerViewManager.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages stackable modals and popup views that are posted and dismissed
 * by the Types showModal/dismissModal/showPopup/dismissPopup methods.
 */

import * as React from 'react';
import * as RN from 'react-native';
import SubscribableEvent from 'subscribableevent';

import { Types } from '../common/Interfaces';
import * as _ from './utils/lodashMini';
import { ModalContainer } from '../native-common/ModalContainer';
import PopupContainerView from './PopupContainerView';

class ModalStackContext {
    constructor(public modalId: string, public modal: React.ReactElement<Types.ViewProps>, public modalOptions?: Types.ModalOptions) {}
}

class PopupStackContext {
    constructor(public popupId: string, public popupOptions: Types.PopupOptions, public anchorHandle: number) {}
}

const _styles = {
    fullScreenView: {
        flex: 1,
        alignSelf: 'stretch',
        overflow: 'visible',
        backgroundColor: 'transparent' // otherwise in UWP it will be removed from the tree and won't receive mouse events
    }
};

const MAX_CACHED_POPUPS = 4;

export class FrontLayerViewManager {
    private _overlayStack: (ModalStackContext | PopupStackContext)[] = [];
    private _cachedPopups: PopupStackContext[] = [];

    event_changed = new SubscribableEvent<() => void>();

    showModal(modal: React.ReactElement<Types.ViewProps>, modalId: string, options?: Types.ModalOptions): void {
        const index = this._findIndexOfModal(modalId);

        if (index === -1) {
            this._overlayStack.push(new ModalStackContext(modalId, modal, options));
            this.event_changed.fire();
        }
    }

    isModalDisplayed(modalId?: string) : boolean {
        if (modalId) {
            return this._findIndexOfModal(modalId) !== -1;
        }

        return this._overlayStack.some(iter => iter instanceof ModalStackContext);
    }

    dismissModal(modalId: string): void {
        const index = this._findIndexOfModal(modalId);

        if (index >= 0) {
            this._overlayStack.splice(index, 1);
            this.event_changed.fire();
        }
    }

    dismissAllmodals(): void {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, iter => !(iter instanceof ModalStackContext));
            this.event_changed.fire();
        }
    }

    showPopup(popupOptions: Types.PopupOptions, popupId: string, delay?: number): boolean {
        const index = this._findIndexOfPopup(popupId);
        if (index === -1) {
            const nodeHandle = RN.findNodeHandle(popupOptions.getAnchor());
            if (nodeHandle) {
                if (popupOptions.cacheable) {
                    // The popup is transitioning from cached to active.
                    this._cachedPopups = this._cachedPopups.filter(popup => popup.popupId !== popupId);
                }

                this._overlayStack.push(new PopupStackContext(popupId, popupOptions, nodeHandle));
                this.event_changed.fire();
                return true;
            }
        }
        return false;
    }

    dismissPopup(popupId: string): void {
        const index = this._findIndexOfPopup(popupId);
        if (index >= 0) {
            const popupContext = this._overlayStack[index] as PopupStackContext;
            if (popupContext.popupOptions.cacheable) {
                // The popup is transitioning from active to cached.
                this._cachedPopups.push(popupContext);
                this._cachedPopups = this._cachedPopups.slice(-MAX_CACHED_POPUPS);
            }

            this._overlayStack.splice(index, 1);

            if (popupContext.popupOptions.onDismiss) {
                popupContext.popupOptions.onDismiss();
            }

            this.event_changed.fire();
        }
    }

    dismissAllPopups(): void {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, iter => !(iter instanceof PopupStackContext));
            this.event_changed.fire();
        }
    }

    getModalLayerView(rootViewId?: string | null): React.ReactElement<any> | null {
        if (rootViewId === null) {
            // The Modal layer is only supported on root views that have set an id, or
            // the default root view (which has an undefined id)
            return null;
        }

        const overlayContext =
            _.findLast(
                this._overlayStack,
                context => context instanceof ModalStackContext && this._modalOptionsMatchesRootViewId(context.modalOptions, rootViewId)
            ) as ModalStackContext;

        if (overlayContext) {
            return (
                <ModalContainer>
                    { overlayContext.modal }
                </ModalContainer>
            );
        }

        return null;
    }

    getActivePopupId() : string | null {
        const activeOverlay = this._getActiveOverlay();
        if (activeOverlay && (activeOverlay instanceof PopupStackContext)) {
            return activeOverlay.popupId;
        }
        return null;
    }

    releaseCachedPopups(): void {
        this._cachedPopups = [];
    }

    // Returns true if both are undefined, or if there are options and the rootViewIds are equal.
    private _modalOptionsMatchesRootViewId(options?: Types.ModalOptions, rootViewId?: string): boolean {
        return !!(options === rootViewId || options && options.rootViewId === rootViewId);
    }

    private _renderPopup(context: PopupStackContext, hidden: boolean): JSX.Element {
        const key = (context.popupOptions.cacheable ? 'CP:' : 'P:') + context.popupId;
        return (
            <PopupContainerView
                key={ key }
                popupOptions={ context.popupOptions }
                anchorHandle={ hidden ? undefined : context.anchorHandle }
                onDismissPopup={ hidden ? undefined : () => this.dismissPopup(context.popupId) }
                hidden={ hidden }
            />
        );
    }

    private _getOverlayContext(rootViewId?: string | null): PopupStackContext | undefined {
        return _.findLast(
            this._overlayStack,
            context => context instanceof PopupStackContext && context.popupOptions.rootViewId === rootViewId
        ) as PopupStackContext | undefined;
    }

    isPopupActiveFor(rootViewId?: string | null): boolean {
        return this._getOverlayContext(rootViewId) !== undefined;
    }

    getPopupLayerView(rootViewId?: string | null): JSX.Element | null {
        if (rootViewId === null) {
            // The Popup layer is supported only on root views that have set an id and
            // the default root view (which has an undefined id).
            return null;
        }

        const popupContainerViews: JSX.Element[] = [];

        const overlayContext = this._getOverlayContext(rootViewId);
        if (overlayContext) {
            popupContainerViews.push(this._renderPopup(overlayContext, false));
        }
        this._cachedPopups.forEach(context => popupContainerViews.push(this._renderPopup(context, true)));

        if (popupContainerViews.length > 0) {
            return (
                <ModalContainer hidden={ !overlayContext }>
                    <RN.TouchableWithoutFeedback
                        onPressOut={ this._onBackgroundPressed }
                        importantForAccessibility={ 'no' }
                    >
                        <RN.View style={ _styles.fullScreenView as RN.StyleProp<RN.ViewStyle>}>
                            { popupContainerViews }
                        </RN.View>
                    </RN.TouchableWithoutFeedback>
                </ModalContainer>
            );
        }
        return null;
    }

    private _onBackgroundPressed = (e: RN.GestureResponderEvent) => {
        e.persist();

        const activePopupContext = this._getActiveOverlay();
        if (!(activePopupContext instanceof PopupStackContext)) {
            return;
        }

        if (activePopupContext.popupOptions) {
            if (activePopupContext.popupOptions.onAnchorPressed) {
                RN.NativeModules.UIManager.measureInWindow(
                    activePopupContext.anchorHandle,
                    (x: number, y: number, width: number, height: number) => {
                        const touchEvent = e.nativeEvent;
                        const anchorRect: ClientRect = { left: x, top: y, right: x + width,
                                bottom: y + height, width: width, height: height };

                        // Find out if the press event was on the anchor so we can notify the caller about it.
                        if (!_.isUndefined(touchEvent.pageX) && !_.isUndefined(touchEvent.pageY) &&
                                touchEvent.pageX >= anchorRect.left && touchEvent.pageX < anchorRect.right
                                && touchEvent.pageY >= anchorRect.top && touchEvent.pageY < anchorRect.bottom) {
                            // Showing another animation while dimissing the popup creates a conflict in the
                            // UI making it not doing one of the two animations (i.e.: Opening an actionsheet
                            // while dismissing a popup). We introduce this delay to make sure the popup
                            // dimissing animation has finished before we call the event handler.
                            setTimeout(() => { activePopupContext.popupOptions.onAnchorPressed!(e); }, 500);
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

    private _dismissActivePopup(): void {
        // Dismiss any currently visible popup:
        const activePopupContext = this._getActiveOverlay();
        if (activePopupContext instanceof PopupStackContext) {
            this.dismissPopup(activePopupContext.popupId);
        }
    }

    private _findIndexOfModal(modalId: string): number {
        return _.findIndex(this._overlayStack, iter => iter instanceof ModalStackContext && iter.modalId === modalId);
    }

    private _findIndexOfPopup(popupId: string): number {
        return _.findIndex(this._overlayStack, iter => iter instanceof PopupStackContext && iter.popupId === popupId);
    }

    private _getActiveOverlay() {
        // Check for any Popup in queue
        return this._overlayStack.length === 0 ? null : _.last(this._overlayStack);
    }

    isPopupDisplayed(popupId?: string): boolean {
        if (popupId) {
            return this._findIndexOfPopup(popupId) !== -1;
        }

        return this._overlayStack.some(iter => iter instanceof PopupStackContext);
    }
}

export default new FrontLayerViewManager();
