/**
 * PopupContainerViewBase.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common parent of all components rendered into a popup. Calls onShow and onHide
 * callbacks when the popup is hidden (i.e. "closed" but still rendered as hidden)
 * and re-shown. Abstract class to be overriden per platform.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';

import FocusManagerBase from './utils/FocusManager';
import { Types } from './Interfaces';
import { Dimensions, PopupPosition } from './Types';

export interface PopupContainerViewBaseProps<C> extends Types.CommonProps<C> {
    hidden?: boolean;
}

export interface PopupContainerViewContext {
    focusManager?: FocusManagerBase;
}

export interface PopupComponent {
    onShow: () => void;
    onHide: () => void;
}

export interface RecalcResult {
    // Absolute window location of the popup
    popupY: number;
    popupX: number;

    // Top or left offset of the popup relative to the center of the anchor
    anchorOffset: number;

    // Position of popup relative to its anchor (top, bottom, left, right)
    anchorPosition: PopupPosition;

    // Constrained dimensions of the popup once it is placed
    constrainedPopupWidth: number;
    constrainedPopupHeight: number;
}

// Width of the "alley" around popups so they don't get too close to the boundary of the screen boundary.
const ALLEY_WIDTH = 2;

// How close to the edge of the popup should we allow the anchor offset to get before
// attempting a different position?
const MIN_ANCHOR_OFFSET = 16;

// Undefined response means to dismiss the popup
export function recalcPositionFromLayoutData(windowDims: Dimensions, anchorRect: ClientRect, popupRect: Dimensions,
        positionPriorities?: PopupPosition[], useInnerPositioning?: boolean): RecalcResult | undefined {
    // If the anchor has disappeared, dismiss the popup.
    if (!(anchorRect.width > 0 && anchorRect.height > 0)) {
        return undefined;
    }

    // If the anchor is no longer in the window's bounds, cancel the popup.
    if (anchorRect.left >= windowDims.width || anchorRect.right <= 0 ||
            anchorRect.bottom <= 0 || anchorRect.top >= windowDims.height) {
        return undefined;
    }

    let positionsToTry = positionPriorities;
    if (!positionsToTry || positionsToTry.length === 0) {
        positionsToTry = ['bottom', 'right', 'top', 'left'];
    }
    if (positionsToTry.length === 1 && positionsToTry[0] === 'context') {
        // Context only works with exact matches, so fall back to walking around the compass if it doesn't fit exactly.
        positionsToTry.push('bottom', 'right', 'top', 'left');
    }

    if (useInnerPositioning) {
        // If the popup is meant to be shown inside the anchor we need to recalculate
        // the position differently.
        return recalcInnerPosition(anchorRect, positionsToTry[0], popupRect.width, popupRect.height);
    }

    // Start by assuming that we'll be unconstrained.
    const result: RecalcResult = {
        popupX: 0,
        popupY: 0,
        anchorOffset: 0,
        anchorPosition: 'top',
        constrainedPopupWidth: popupRect.width,
        constrainedPopupHeight: popupRect.height,
    };

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
                    absX = anchorRect.left + (anchorRect.width - popupRect.width) / 2;
                    anchorOffset = popupRect.width / 2;

                    if (popupRect.height <= windowDims.height - ALLEY_WIDTH - anchorRect.bottom) {
                        foundPerfectFit = true;
                    } else if (!foundPartialFit) {
                        constrainedHeight = windowDims.height - ALLEY_WIDTH - anchorRect.bottom;
                    }
                    break;

                case 'top':
                    absY = anchorRect.top - popupRect.height;
                    absX = anchorRect.left + (anchorRect.width - popupRect.width) / 2;
                    anchorOffset = popupRect.width / 2;

                    if (popupRect.height <= anchorRect.top - ALLEY_WIDTH) {
                        foundPerfectFit = true;
                    } else if (!foundPartialFit) {
                        constrainedHeight = anchorRect.top - ALLEY_WIDTH;
                    }
                    break;

                case 'right':
                    absX = anchorRect.right;
                    absY = anchorRect.top + (anchorRect.height - popupRect.height) / 2;
                    anchorOffset = popupRect.height / 2;

                    if (popupRect.width <= windowDims.width - ALLEY_WIDTH - anchorRect.right) {
                        foundPerfectFit = true;
                    } else if (!foundPartialFit) {
                        constrainedWidth = windowDims.width - ALLEY_WIDTH - anchorRect.right;
                    }
                    break;

                case 'left':
                    absX = anchorRect.left - popupRect.width;
                    absY = anchorRect.top + (anchorRect.height - popupRect.height) / 2;
                    anchorOffset = popupRect.height / 2;

                    if (popupRect.width <= anchorRect.left - ALLEY_WIDTH) {
                        foundPerfectFit = true;
                    } else if (!foundPartialFit) {
                        constrainedWidth = anchorRect.left - ALLEY_WIDTH;
                    }
                    break;

                case 'context': {
                    // Search for perfect fits on the LR, LL, TR, and TL corners.
                    const fitsAbove = anchorRect.top - popupRect.height >= ALLEY_WIDTH;
                    const fitsBelow = anchorRect.top + anchorRect.height + popupRect.height <= windowDims.height - ALLEY_WIDTH;
                    const fitsLeft = anchorRect.left - popupRect.width >= ALLEY_WIDTH;
                    const fitsRight = anchorRect.left + anchorRect.width + popupRect.width <= windowDims.width - ALLEY_WIDTH;
                    if (fitsBelow && fitsRight) {
                        foundPerfectFit = true;
                        absX = anchorRect.left + anchorRect.width;
                        absY = anchorRect.top + anchorRect.height;
                    } else if (fitsBelow && fitsLeft) {
                        foundPerfectFit = true;
                        absX = anchorRect.left - popupRect.width;
                        absY = anchorRect.top + anchorRect.height;
                    } else if (fitsAbove && fitsRight) {
                        foundPerfectFit = true;
                        absX = anchorRect.left + anchorRect.width;
                        absY = anchorRect.top - popupRect.height;
                    } else if (fitsAbove && fitsLeft) {
                        foundPerfectFit = true;
                        absX = anchorRect.left - popupRect.width;
                        absY = anchorRect.top - popupRect.height;
                    }
                    break;
                }
            }

            const effectiveWidth = constrainedWidth || popupRect.width;
            const effectiveHeight = constrainedHeight || popupRect.height;

            // Make sure we're not hanging off the bounds of the window.
            if (absX < ALLEY_WIDTH) {
                if (pos === 'top' || pos === 'bottom') {
                    anchorOffset -= ALLEY_WIDTH - absX;
                    if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveWidth - MIN_ANCHOR_OFFSET) {
                        foundPerfectFit = false;
                    }
                }
                absX = ALLEY_WIDTH;
            } else if (absX > windowDims.width - ALLEY_WIDTH - effectiveWidth) {
                if (pos === 'top' || pos === 'bottom') {
                    anchorOffset -= (windowDims.width - ALLEY_WIDTH - effectiveWidth - absX);
                    if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveWidth - MIN_ANCHOR_OFFSET) {
                        foundPerfectFit = false;
                    }
                }
                absX = windowDims.width - ALLEY_WIDTH - effectiveWidth;
            }

            if (absY < ALLEY_WIDTH) {
                if (pos === 'right' || pos === 'left') {
                    anchorOffset += absY - ALLEY_WIDTH;
                    if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveHeight - MIN_ANCHOR_OFFSET) {
                        foundPerfectFit = false;
                    }
                }
                absY = ALLEY_WIDTH;
            } else if (absY > windowDims.height - ALLEY_WIDTH - effectiveHeight) {
                if (pos === 'right' || pos === 'left') {
                    anchorOffset -= (windowDims.height - ALLEY_WIDTH - effectiveHeight - absY);
                    if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveHeight - MIN_ANCHOR_OFFSET) {
                        foundPerfectFit = false;
                    }
                }
                absY = windowDims.height - ALLEY_WIDTH - effectiveHeight;
            }

            if (foundPerfectFit || effectiveHeight > 0 || effectiveWidth > 0) {
                result.popupY = absY;
                result.popupX = absX;
                result.anchorOffset = anchorOffset;
                result.anchorPosition = pos;
                result.constrainedPopupWidth = effectiveWidth;
                result.constrainedPopupHeight = effectiveHeight;

                foundPartialFit = true;
            }
        }
    });

    return result;
}

function recalcInnerPosition(anchorRect: ClientRect, positionToUse: PopupPosition, popupWidth: number, popupHeight: number) {
    // For inner popups we only accept the first position of the priorities since there
    // should always be room for the bubble.
    let popupX = 0;
    let popupY = 0;
    let anchorOffset = 0;
    switch (positionToUse) {
        case 'top':
            popupY = anchorRect.top + anchorRect.height - popupHeight;
            popupX = anchorRect.left + anchorRect.height / 2 - popupWidth / 2;
            anchorOffset = popupWidth / 2;
            break;

        case 'bottom':
            popupY = anchorRect.top + popupHeight;
            popupX = anchorRect.left + anchorRect.height / 2 - popupWidth / 2;
            anchorOffset = popupWidth / 2;
            break;

        case 'left':
            popupY = anchorRect.top + anchorRect.height / 2 - popupHeight / 2;
            popupX = anchorRect.left + anchorRect.width - popupWidth;
            anchorOffset = popupHeight / 2;
            break;

        case 'right':
            popupY = anchorRect.top + anchorRect.height / 2 - popupHeight / 2;
            popupX = anchorRect.left;
            anchorOffset = popupHeight / 2;
            break;

        case 'context':
            throw new Error('Context popup mode not allowed with inner positioning');
    }

    const result: RecalcResult = {
        popupX,
        popupY,
        anchorOffset,
        anchorPosition: positionToUse,
        constrainedPopupWidth: popupWidth,
        constrainedPopupHeight: popupHeight,
    };
    return result;
}

export abstract class PopupContainerViewBase<P extends PopupContainerViewBaseProps<C>, S, C> extends React.Component<P, S> {
    static contextTypes: React.ValidationMap<any> = {
        focusManager: PropTypes.object,
    };
    static childContextTypes: React.ValidationMap<any> = {
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object,
    };

    private _popupComponentStack: PopupComponent[] = [];

    constructor(props: P, context?: PopupContainerViewContext) {
        super(props, context);
    }

    getChildContext() {
        return {
            focusManager: this.context.focusManager,
            popupContainer: this as PopupContainerViewBase<P, S, C>,
        };
    }

    registerPopupComponent(onShow: () => void, onHide: () => void): PopupComponent {
        const component = {
            onShow,
            onHide,
        };
        this._popupComponentStack.push(component);
        return component;
    }

    unregisterPopupComponent(component: PopupComponent) {
        this._popupComponentStack = this._popupComponentStack.filter(c => c !== component);
    }

    isHidden(): boolean {
        return !!this.props.hidden;
    }

    componentDidUpdate(prevProps: P, prevState: S) {
        if (prevProps.hidden && !this.props.hidden) {
            // call onShow on all registered components (iterate front to back)
            for (let i = 0; i < this._popupComponentStack.length; i++) {
                this._popupComponentStack[i].onShow();
            }
        }
        if (!prevProps.hidden && this.props.hidden) {
            // call onHide on all registered components (iterate back to front)
            for (let i = this._popupComponentStack.length - 1; i >= 0; i--) {
                this._popupComponentStack[i].onHide();
            }
        }
    }

    abstract render(): JSX.Element;
}

export default PopupContainerViewBase;
