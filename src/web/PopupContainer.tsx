/**
* PopupContainer.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common parent of all components rendered into a popup. Calls onShow and onHide
* callbacks when the popup is hidden (i.e. "closed" but still rendered as hidden)
* and re-shown.
*/

import _ = require('./utils/lodashMini');
import React = require('react');
import PropTypes = require('prop-types');
import FocusManager from './utils/FocusManager';
import Types = require('../common/Types');

export interface PopupContainerProps extends Types.CommonProps {
    style: React.CSSProperties;
    onMouseEnter?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    hidden?: boolean;
}

export interface PopupContainerContext {
    focusManager?: FocusManager;
}

export interface PopupComponent {
    onShow: () => void;
    onHide: () => void;
}

export class PopupContainer extends React.Component<PopupContainerProps, {}> {
    static contextTypes: React.ValidationMap<any> = {
        focusManager: PropTypes.object
    };
    static childContextTypes: React.ValidationMap<any> = {
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object
    };

    private _popupComponentStack: PopupComponent[] = [];

    constructor(props: PopupContainerProps, context: PopupContainerContext) {
        super(props, context);
    }

    getChildContext() {
        return {
            focusManager: this.context.focusManager,
            popupContainer: this as PopupContainer
        };
    }

    render() {
        let style = _.clone(this.props.style);
        if (this.props.hidden) {
            style.visibility = 'hidden';
        }
        return (
            <div
                style={ style }
                onMouseEnter={ this.props.onMouseEnter }
                onMouseLeave={ this.props.onMouseLeave }
            >
                { this.props.children }
            </div>
        );
    }

    public registerPopupComponent(onShow: () => void, onHide: () => void): PopupComponent {
        const component = {
            onShow,
            onHide
        };
        this._popupComponentStack.push(component);
        return component;
    }

    public unregisterPopupComponent(component: PopupComponent) {
        this._popupComponentStack = this._popupComponentStack.filter(c => c !== component);
    }

    public isHidden(): boolean {
        return this.props.hidden || false;
    }

    componentDidUpdate(prevProps: PopupContainerProps) {
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

}

export default PopupContainer;
