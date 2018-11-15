/**
 * PopupContainerView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The view containing the Popup to show. This view does its own position
 * calculation on rendering as directed by position instructions received
 * through properties.
 */

import * as assert from 'assert';
import * as React from 'react';
import * as RN from 'react-native';

import AccessibilityUtil from './AccessibilityUtil';
import { Types } from '../common/Interfaces';
import International from './International';
import { extend, isEqual } from './utils/lodashMini';
import { PopupContainerViewBase, PopupContainerViewBaseProps, PopupContainerViewContext } from '../common/PopupContainerViewBase';
import Timers from '../common/utils/Timers';
import UserInterface from './UserInterface';

// Width of the "alley" around popups so they don't get too close to the boundary of the screen boundary.
const ALLEY_WIDTH = 2;

// How close to the edge of the popup should we allow the anchor offset to get before
// attempting a different position?
const MIN_ANCHOR_OFFSET = 16;

export interface PopupContainerViewProps extends PopupContainerViewBaseProps {
    popupOptions: Types.PopupOptions;
    anchorHandle?: number;
    onDismissPopup?: () => void;
}

export interface PopupContainerViewState {
    // We need to measure the popup before it can be positioned. This indicates that we're in the "measuring" phase.
    isMeasuringPopup: boolean;

    // Measured (unconstrained) dimensions of the popup; not valid if isMeasuringPopup is false.
    popupWidth: number;
    popupHeight: number;

    // Position of popup relative to its anchor (top, bottom, left, right)
    anchorPosition: Types.PopupPosition;

    // Top or left offset of the popup relative to the center of the anchor
    anchorOffset: number;

    // Absolute window location of the popup
    popupY: number;
    popupX: number;

    // Constrained dimensions of the popup once it is placed
    constrainedPopupWidth: number;
    constrainedPopupHeight: number;
}

export class PopupContainerView extends PopupContainerViewBase<PopupContainerViewProps, PopupContainerViewState> {
    private _mountedComponent: RN.View | undefined;
    private _viewHandle: number | null = null;
    private _respositionPopupTimer: number | undefined;

    constructor(props: PopupContainerViewProps, context: PopupContainerViewContext) {
        super(props, context);
        this.state = this._getInitialState();
    }

    private _getInitialState(): PopupContainerViewState {
        return {
            isMeasuringPopup: true,
            anchorPosition: 'left',
            anchorOffset: 0,
            popupY: 0,
            popupX: 0,
            popupWidth: 0,
            popupHeight: 0,
            constrainedPopupWidth: 0,
            constrainedPopupHeight: 0
        };
    }

    componentWillReceiveProps(prevProps: PopupContainerViewProps) {
        if (this.props.popupOptions !== prevProps.popupOptions) {
            // If the popup changes, reset our state.
            this.setState(this._getInitialState());
        }
    }

    componentDidUpdate(prevProps: PopupContainerViewProps, prevState: PopupContainerViewState) {
        super.componentDidUpdate(prevProps, prevState);

        if (this.props.popupOptions && !this.props.hidden) {
            this._recalcPosition();

            if (!this._respositionPopupTimer) {
                this._startRepositionPopupTimer();
            }
        } else {
            this._stopRepositionPopupTimer();
        }
    }

    componentDidMount() {
        if (this._mountedComponent) {
            this._viewHandle = RN.findNodeHandle(this._mountedComponent);
        }

        if (this.props.popupOptions && !this.props.hidden) {
            this._recalcPosition();
            this._startRepositionPopupTimer();
        }
    }

    componentWillUnmount() {
        this._stopRepositionPopupTimer();
    }

    render() {
        const popupView = (this.props.hidden ?
            this.props.popupOptions.renderPopup('top', 0, 0, 0) :
            this.props.popupOptions.renderPopup(
                this.state.anchorPosition, this.state.anchorOffset,
                this.state.constrainedPopupWidth,
                this.state.constrainedPopupHeight)
            );
        const isRTL = International.isRTL();
        const style = {
            position: 'absolute',
            top: this.state.popupY,
            right: isRTL ? this.state.popupX : undefined,
            left: !isRTL ? this.state.popupX : undefined,
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            opacity: this.state.isMeasuringPopup ? 0 : 1,
            overflow: this.props.hidden ? 'hidden' : 'visible',
            width: this.props.hidden ? 0 : undefined,
            height: this.props.hidden ? 0 : undefined
        };

        const importantForAccessibility = this.props.hidden
            ? AccessibilityUtil.importantForAccessibilityToString(Types.ImportantForAccessibility.NoHideDescendants)
            : undefined;

        return (
            <RN.View
                style={ style as RN.StyleProp<RN.ViewStyle> }
                ref={ this._onMount }
                importantForAccessibility={ importantForAccessibility }
            >
                { popupView }
            </RN.View>
        );
    }

    protected _onMount = (component: RN.View | null) => {
        this._mountedComponent = component || undefined;
    }

    private _recalcPosition() {
        if (!this._mountedComponent) {
            return;
        }

        assert.ok(!!this.props.anchorHandle);
        RN.NativeModules.UIManager.measureInWindow(
            this.props.anchorHandle,
            (x: number, y: number, width: number, height: number) => {
                if (!this._mountedComponent) {
                    return;
                }

                assert.ok(!!this._viewHandle);

                const anchorRect: ClientRect = {
                    left: x, top: y, right: x + width, bottom: y + height,
                    width: width, height: height};

                RN.NativeModules.UIManager.measureInWindow(
                    this._viewHandle,
                    (x: number, y: number, width: number, height: number) => {
                        const popupRect: ClientRect = {
                            left: x, top: y, right: x + width, bottom: y + height,
                            width: width, height: height
                        };

                        this._recalcPositionFromLayoutData(anchorRect, popupRect);
                    }
                );
            }
        );
    }

    private _recalcPositionFromLayoutData(anchorRect: ClientRect, popupRect: ClientRect): void {
        if (!this._mountedComponent) {
            return;
        }

        // If the popup hasn't been rendered yet, skip.
        if (popupRect.width > 0 && popupRect.height > 0) {
            // Make a copy of the old state.
            const newState: PopupContainerViewState = extend({}, this.state);

            if (this.state.isMeasuringPopup) {
                newState.isMeasuringPopup = false;
                newState.popupWidth = popupRect.width;
                newState.popupHeight = popupRect.height;
            }

            // If the anchor has disappeared, dismiss the popup.
            if (!(anchorRect.width > 0 && anchorRect.height > 0)) {
                this._dismissPopup();
                return;
            }

            // Start by assuming that we'll be unconstrained.
            newState.constrainedPopupHeight = newState.popupHeight;
            newState.constrainedPopupWidth = newState.popupWidth;

            // Get the width/height of root view window.
            const window = UserInterface.measureWindow(this.props.popupOptions.rootViewId);

            const windowWidth = window.width;
            const windowHeight = window.height;

            // If the anchor is no longer in the window's bounds, cancel the popup.
            if (anchorRect.left >= windowWidth || anchorRect.right <= 0 ||
                    anchorRect.bottom <= 0 || anchorRect.top >= windowHeight) {
                this._dismissPopup();
                return;
            }

            let positionsToTry = this.props.popupOptions.positionPriorities;
            if (!positionsToTry || positionsToTry.length === 0) {
                positionsToTry = ['bottom', 'right', 'top', 'left'];
            }

            if (this.props.popupOptions.useInnerPositioning) {
                // If the popup is meant to be shown inside the anchor we need to recalculate
                // the position differently.
                this._recalcInnerPosition(anchorRect, newState);
                return;
            }

            let foundPerfectFit = false;
            let foundPartialFit = false;

            positionsToTry.forEach(pos => {
                if (!foundPerfectFit) {
                    let absX = 0;
                    let absY = 0;
                    let anchorOffset = 0;
                    let constrainedWidth = 0;
                    let constrainedHeight = 0;

                    switch (pos) {
                        case 'bottom':
                            absY = anchorRect.bottom;
                            absX = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                            anchorOffset = newState.popupWidth / 2;

                            if (newState.popupHeight <= windowHeight - ALLEY_WIDTH - anchorRect.bottom) {
                                foundPerfectFit = true;
                            } else if (!foundPartialFit) {
                                constrainedHeight = windowHeight - ALLEY_WIDTH - anchorRect.bottom;
                            }
                            break;

                        case 'top':
                            absY = anchorRect.top - newState.popupHeight;
                            absX = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                            anchorOffset = newState.popupWidth / 2;

                            if (newState.popupHeight <= anchorRect.top - ALLEY_WIDTH) {
                                foundPerfectFit = true;
                            } else if (!foundPartialFit) {
                                constrainedHeight = anchorRect.top - ALLEY_WIDTH;
                            }
                            break;

                        case 'right':
                            absX = anchorRect.right;
                            absY = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                            anchorOffset = newState.popupHeight / 2;

                            if (newState.popupWidth <= windowWidth - ALLEY_WIDTH - anchorRect.right) {
                                foundPerfectFit = true;
                            } else if (!foundPartialFit) {
                                constrainedWidth = windowWidth - ALLEY_WIDTH - anchorRect.right;
                            }
                            break;

                        case 'left':
                            absX = anchorRect.left - newState.popupWidth;
                            absY = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                            anchorOffset = newState.popupHeight / 2;

                            if (newState.popupWidth <= anchorRect.left - ALLEY_WIDTH) {
                                foundPerfectFit = true;
                            } else if (!foundPartialFit) {
                                constrainedWidth = anchorRect.left - ALLEY_WIDTH;
                            }
                            break;
                    }

                    const effectiveWidth = constrainedWidth || newState.popupWidth;
                    const effectiveHeight = constrainedHeight || newState.popupHeight;

                    // Make sure we're not hanging off the bounds of the window.
                    if (absX < ALLEY_WIDTH) {
                        if (pos === 'top' || pos === 'bottom') {
                            anchorOffset -= ALLEY_WIDTH - absX;
                            if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveWidth - MIN_ANCHOR_OFFSET) {
                                foundPerfectFit = false;
                            }
                        }
                        absX = ALLEY_WIDTH;
                    } else if (absX > windowWidth - ALLEY_WIDTH - effectiveWidth) {
                        if (pos === 'top' || pos === 'bottom') {
                            anchorOffset -= (windowWidth - ALLEY_WIDTH - effectiveWidth - absX);
                            if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveWidth - MIN_ANCHOR_OFFSET) {
                                foundPerfectFit = false;
                            }
                        }
                        absX = windowWidth - ALLEY_WIDTH - effectiveWidth;
                    }

                    if (absY < ALLEY_WIDTH) {
                        if (pos === 'right' || pos === 'left') {
                            anchorOffset += absY - ALLEY_WIDTH;
                            if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveHeight - MIN_ANCHOR_OFFSET) {
                                foundPerfectFit = false;
                            }
                        }
                        absY = ALLEY_WIDTH;
                    } else if (absY > windowHeight - ALLEY_WIDTH - effectiveHeight) {
                        if (pos === 'right' || pos === 'left') {
                            anchorOffset -= (windowHeight - ALLEY_WIDTH - effectiveHeight - absY);
                            if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveHeight - MIN_ANCHOR_OFFSET) {
                                foundPerfectFit = false;
                            }
                        }
                        absY = windowHeight - ALLEY_WIDTH - effectiveHeight;
                    }

                    if (foundPerfectFit || effectiveHeight > 0 || effectiveWidth > 0) {
                        newState.popupY = absY;
                        newState.popupX = absX;
                        newState.anchorOffset = anchorOffset;
                        newState.anchorPosition = pos;
                        newState.constrainedPopupWidth = effectiveWidth;
                        newState.constrainedPopupHeight = effectiveHeight;

                        foundPartialFit = true;
                    }
                }
            });

            if (!isEqual(newState, this.state)) {
                this.setState(newState);
            }
        }
    }

    private _recalcInnerPosition(anchorRect: ClientRect, newState: PopupContainerViewState) {
        // For inner popups we only accept the first position of the priorities since there
        // should always be room for the bubble.
        const pos = this.props.popupOptions.positionPriorities![0];

        switch (pos) {
            case 'top':
                newState.popupY = anchorRect.top + anchorRect.height - newState.constrainedPopupHeight;
                newState.popupX = anchorRect.left + anchorRect.height / 2 - newState.constrainedPopupWidth / 2;
                newState.anchorOffset = newState.popupWidth / 2;
                break;

            case 'bottom':
                newState.popupY = anchorRect.top + newState.constrainedPopupHeight;
                newState.popupX = anchorRect.left + anchorRect.height / 2 - newState.constrainedPopupWidth / 2;
                newState.anchorOffset = newState.popupWidth / 2;
                break;

            case 'left':
                newState.popupY = anchorRect.top + anchorRect.height / 2 - newState.constrainedPopupHeight / 2;
                newState.popupX = anchorRect.left + anchorRect.width - newState.constrainedPopupWidth;
                newState.anchorOffset = newState.popupHeight / 2;
                break;

            case 'right':
                newState.popupY = anchorRect.top + anchorRect.height / 2 - newState.constrainedPopupHeight / 2;
                newState.popupX = anchorRect.left;
                newState.anchorOffset = newState.popupHeight / 2;
                break;
        }

        newState.anchorPosition = pos;

        if (!isEqual(newState, this.state)) {
            this.setState(newState);
        }
    }

    private _dismissPopup() {
        if (this.props.onDismissPopup) {
            this.props.onDismissPopup();
        }
    }

    private _startRepositionPopupTimer() {
        this._respositionPopupTimer = Timers.setInterval(() => {
            this._recalcPosition();
        }, 1000);
    }

    private _stopRepositionPopupTimer() {
        if (this._respositionPopupTimer) {
            clearInterval(this._respositionPopupTimer);
            this._respositionPopupTimer = undefined;
        }
    }
}

export default PopupContainerView;
