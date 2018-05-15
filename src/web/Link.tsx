/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Link abstraction.
*/

import PropTypes = require('prop-types');
import React = require('react');
import ReactDOM = require('react-dom');

import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import Styles from './Styles';
import Types = require('../common/Types');
import EventHelpers from '../native-common/utils/EventHelpers';
import { applyFocusableComponentMixin } from './utils/FocusManager';

const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',

        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};

const _longPressTime = 1000;

export interface LinkContext {
    focusArbitrator?: FocusArbitratorProvider;
}

export class Link extends React.Component<Types.LinkProps, Types.Stateless> {
    static contextTypes = {
        focusArbitrator: PropTypes.object
    };

    context!: LinkContext;

    private _isMounted = false;
    private _longPressTimer: number|undefined;

    render() {
        // SECURITY WARNING:
        //   Note the use of rel='noreferrer'
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        return (
            <a
                style={ this._getStyles() as any }
                title={ this.props.title }
                href={ this.props.url }
                target={ '_blank' }
                rel={ 'noreferrer' }
                onClick={ this._onClick }
                onMouseEnter={ this.props.onHoverStart }
                onMouseLeave={ this.props.onHoverEnd }
                onMouseDown={ this._onMouseDown }
                onMouseUp={ this._onMouseUp }
                tabIndex={ this.props.tabIndex }
                onContextMenu={ this.props.onContextMenu ? this._onContextMenu : undefined }
            >
                { this.props.children }
            </a>
        );
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => this._isMounted
        );
    }

    focus() {
        if (this._isMounted) {
            const el = ReactDOM.findDOMNode(this) as HTMLAnchorElement;
            if (el) {
                el.focus();
            }
        }
    }

    blur() {
        if (this._isMounted) {
            const el = ReactDOM.findDOMNode(this) as HTMLAnchorElement;
            if (el) {
                el.blur();
            }
        }
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

    private _onClick = (e: React.MouseEvent<any>) => {
        e.stopPropagation();

        if (this.props.onPress) {
            e.preventDefault();
            this.props.onPress(e, this.props.url);
        }
    }

    private _onMouseDown = (e: React.SyntheticEvent<any>) => {
        if (this.props.onLongPress) {
            e.persist();

            this._longPressTimer = setTimeout(() => {
                this._longPressTimer = undefined;

                const mouseEvent = e as React.MouseEvent<any>;
                // Ignore right mouse button for long press. Context menu will
                // be always displayed on mouseUp no matter the press length.
                if (this.props.onLongPress && mouseEvent.button !== 2) {
                    this.props.onLongPress(e, this.props.url);
                }
            }, _longPressTime);
        }
    }

    private _onMouseUp = (e: Types.SyntheticEvent) => {
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = undefined;
        }
    }

    private _onContextMenu = (e: Types.SyntheticEvent) => {
        if (this.props.onContextMenu) {
            e.stopPropagation();
            e.preventDefault();
            this.props.onContextMenu(EventHelpers.toMouseEvent(e));
        }
    }
}

applyFocusableComponentMixin(Link);

export default Link;
