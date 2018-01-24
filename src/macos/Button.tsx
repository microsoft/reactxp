/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Mac-specific implementation of the cross-platform Button abstraction.
*/
import {Button as ButtonBase, ButtonContext} from '../native-common/Button';
import Types = require('../common/Types');
import React = require('react');
import RN = require('react-native');

export class Button extends ButtonBase {

    private _isMouseOver = false;
    private _isHoverStarted = false;

    constructor(props: Types.ButtonProps, context: ButtonContext) {
        super(props, context);
    }

    protected _render(internalProps: RN.ViewProps): JSX.Element {

        let combinedProps = {
            ...internalProps,
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave
        };

        return (
            <RN.Animated.View
                { ...combinedProps
                }
             >
                { this.props.children }
            </RN.Animated.View>
        );
    }

    private _onMouseEnter = (e: Types.SyntheticEvent) => {
        this._isMouseOver = true;
        this._onHoverStart(e);
    }

    private _onMouseLeave = (e: Types.SyntheticEvent) => {
        this._isMouseOver = false;
        this._onHoverEnd(e);
    }

    private _onHoverStart = (e: Types.SyntheticEvent) => {
        if (!this._isHoverStarted && this._isMouseOver) {
            this._isHoverStarted = true;

            if (this.props.onHoverStart) {
                this.props.onHoverStart(e);
            }
        }
    }

    private _onHoverEnd = (e: Types.SyntheticEvent) => {
        if (this._isHoverStarted && !this._isMouseOver) {
            this._isHoverStarted = false;

            if (this.props.onHoverEnd) {
                this.props.onHoverEnd(e);
            }
        }
    }
}

export default Button;
