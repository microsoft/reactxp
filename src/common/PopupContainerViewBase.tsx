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

export interface PopupContainerViewBaseProps extends Types.CommonProps {
    hidden?: boolean;
}

export interface PopupContainerViewContext {
    focusManager?: FocusManagerBase;
}

export interface PopupComponent {
    onShow: () => void;
    onHide: () => void;
}

export abstract class PopupContainerViewBase<P extends PopupContainerViewBaseProps, S> extends React.Component<P, S> {
    static contextTypes: React.ValidationMap<any> = {
        focusManager: PropTypes.object
    };
    static childContextTypes: React.ValidationMap<any> = {
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object
    };

    private _popupComponentStack: PopupComponent[] = [];

    constructor(props: P, context: PopupContainerViewContext) {
        super(props, context);
    }

    getChildContext() {
        return {
            focusManager: this.context.focusManager,
            popupContainer: this as PopupContainerViewBase<P, S>
        };
    }

    registerPopupComponent(onShow: () => void, onHide: () => void): PopupComponent {
        const component = {
            onShow,
            onHide
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
