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

import * as React from 'react';
import * as RN from 'react-native';

import assert from '../common/assert';
import { Types } from '../common/Interfaces';
import { PopupContainerViewBase, PopupContainerViewBaseProps, PopupContainerViewContext,
    recalcPositionFromLayoutData, RecalcResult } from '../common/PopupContainerViewBase';
import Timers from '../common/utils/Timers';

import AccessibilityUtil from './AccessibilityUtil';
import International from './International';
import { extend, isEqual } from './utils/lodashMini';
import UserInterface from './UserInterface';

export interface PopupContainerViewProps extends PopupContainerViewBaseProps<PopupContainerView> {
    popupOptions: Types.PopupOptions;
    anchorHandle?: number;
    onDismissPopup?: () => void;
}

export interface PopupContainerViewState extends RecalcResult {
    // We need to measure the popup before it can be positioned. This indicates that we're in the "measuring" phase.
    isMeasuringPopup: boolean;

    // Measured (unconstrained) dimensions of the popup; not valid if isMeasuringPopup is false.
    popupWidth: number;
    popupHeight: number;
}

export class PopupContainerView extends PopupContainerViewBase<PopupContainerViewProps, PopupContainerViewState, PopupContainerView> {
    private _mountedComponent: RN.View | undefined;
    private _viewHandle: number | null = null;
    private _respositionPopupTimer: number | undefined;

    constructor(props: PopupContainerViewProps, context?: PopupContainerViewContext) {
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
            constrainedPopupHeight: 0,
        };
    }

    UNSAFE_componentWillReceiveProps(prevProps: PopupContainerViewProps) {
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
            height: this.props.hidden ? 0 : undefined,
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
    };

    private _recalcPosition() {
        if (!this._mountedComponent) {
            return;
        }

        assert(!!this.props.anchorHandle);

        RN.NativeModules.UIManager.measureInWindow(
            this.props.anchorHandle,
            (x: number, y: number, width: number, height: number) => {
                if (!this._mountedComponent) {
                    return;
                }

                assert(!!this._viewHandle);

                const anchorRect: ClientRect = {
                    left: x, top: y, right: x + width, bottom: y + height,
                    width: width, height: height};

                RN.NativeModules.UIManager.measureInWindow(
                    this._viewHandle,
                    (x: number, y: number, width: number, height: number) => {
                        const popupRect: ClientRect = {
                            left: x, top: y, right: x + width, bottom: y + height,
                            width: width, height: height,
                        };

                        this._recalcPositionFromLayoutData(anchorRect, popupRect);
                    },
                );
            },
        );
    }

    private _recalcPositionFromLayoutData(anchorRect: ClientRect, popupRect: ClientRect): void {
        if (!this._mountedComponent) {
            return;
        }

        // If the popup hasn't been rendered yet, skip.
        if (popupRect.width <= 0 || popupRect.height <= 0) {
            return;
        }

        // Make a copy of the old state.
        const newState: PopupContainerViewState = extend({}, this.state);

        if (this.state.isMeasuringPopup) {
            newState.isMeasuringPopup = false;
            newState.popupWidth = popupRect.width;
            newState.popupHeight = popupRect.height;
        }

        // Get the width/height of root view window.
        const window = UserInterface.measureWindow(this.props.popupOptions.rootViewId);
        const windowDims = { width: window.width, height: window.height };

        // Run the common recalc function and see what magic it spits out.
        const result = recalcPositionFromLayoutData(windowDims, anchorRect, popupRect, this.props.popupOptions.positionPriorities,
            this.props.popupOptions.useInnerPositioning);
        if (!result) {
            this._dismissPopup();
            return;
        }

        extend(newState, result);

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
            Timers.clearInterval(this._respositionPopupTimer);
            this._respositionPopupTimer = undefined;
        }
    }
}

export default PopupContainerView;
