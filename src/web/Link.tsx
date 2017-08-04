/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Link abstraction.
*/

import React = require('react');

import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');
import { applyFocusableComponentMixin } from './utils/FocusManager';

const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',

        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};

const _longPressTime = 1000;

export class Link extends React.Component<Types.LinkProps, {}> {

    private _longPressTimer: number;

    render() {
       // SECURITY WARNING:
       //   Note the use of rel='noreferrer'
       //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
       //   See: https://mathiasbynens.github.io/rel-noopener/
        return (
            <a
                style={ this._getStyles() }
                title={ this.props.title }
                href={ this.props.url }
                target='_blank'
                rel='noreferrer'
                onClick={ this._onClick }
                onMouseEnter={ this.props.onHoverStart }
                onMouseLeave={ this.props.onHoverEnd }
                onMouseDown={ this._onMouseDown }
            >
                { this.props.children }
            </a>
        );
    }

    _getStyles(): Types.LinkStyleRuleSet {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        let combinedStyles = Styles.combine(
            [this.props.numberOfLines === 1 ? _styles.ellipsis : _styles.defaultStyle,
            this.props.style]) as any;

        // Handle cursor styles
        if (this.props.selectable) {
            combinedStyles['userSelect'] = 'text';
            combinedStyles['WebkitUserSelect'] = 'text';
            combinedStyles['MozUserSelect'] = 'text';
            combinedStyles['msUserSelect'] = 'text';
        }

        combinedStyles['cursor'] = 'pointer';

        return combinedStyles;
    }

    private _onClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (this.props.onPress) {
            e.preventDefault();
            this.props.onPress(e, this.props.url);
        }
    }

    private _onMouseDown = (e: Types.SyntheticEvent) => {
        if (this.props.onLongPress) {
            e.persist();

            this._longPressTimer = window.setTimeout(() => {
                this._longPressTimer = undefined;
                if (this.props.onLongPress) {
                    this.props.onLongPress(e, this.props.url);
                }
            }, _longPressTime);
        }
    }

    private _onMouseUp = (e: Types.SyntheticEvent) => {
        if (this._longPressTimer) {
            window.clearTimeout(this._longPressTimer);
            this._longPressTimer = undefined;
        }
    }
}

applyFocusableComponentMixin(Link);

export default Link;
