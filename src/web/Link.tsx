/**
 * Link.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Link abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';

import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { applyFocusableComponentMixin } from './utils/FocusManager';
import { Types } from '../common/Interfaces';
import Styles from './Styles';
import Timers from '../common/utils/Timers';

const _styles = {
    defaultStyle: {
        overflowWrap: 'break-word',
        msHyphens: 'auto',
        overflow: 'hidden',
        flexShrink: 0,
        flexGrow: 0,
        position: 'relative',
        display: 'inline',
        cursor: 'pointer'
    },
    ellipsis: {
        textOverflow: 'ellipsis',
        whiteSpace: 'pre',
        msHyphens: 'none'
    },
    selectable: {
        WebkitUserSelect: 'text',
        MozUserSelect: 'text',
        msUserSelect: 'text',
        userSelect: 'text'
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

    private _mountedAnchor: HTMLAnchorElement | null = null;
    private _longPressTimer: number | undefined;

    render() {
        // SECURITY WARNING:
        //   Note the use of rel='noreferrer'
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        return (
            <a
                ref={ this._onMount }
                style={ this._getStyles() }
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
                data-test-id={ this.props.testId }
            >
                { this.props.children }
            </a>
        );
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => this._mountedAnchor !== null
        );
    }

    focus() {
        if (this._mountedAnchor) {
            this._mountedAnchor.focus();
        }
    }

    blur() {
        if (this._mountedAnchor) {
            this._mountedAnchor.blur();
        }
    }

    private _onMount = (ref: HTMLAnchorElement | null) => {
        this._mountedAnchor = ref;
    }

    private _getStyles(): React.CSSProperties {
        // There's no way in HTML to properly handle numberOfLines > 1,
        //  but we can correctly handle the common case where numberOfLines is 1.
        const ellipsisStyles = this.props.numberOfLines === 1 ? _styles.ellipsis : {};
        const selectableStyles = this.props.selectable ? _styles.selectable : {};

        return Styles.combine([ _styles.defaultStyle, ellipsisStyles, this.props.style, selectableStyles ]) as React.CSSProperties;
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

            this._longPressTimer = Timers.setTimeout(() => {
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

    private _onContextMenu = (e: React.MouseEvent<any>) => {
        if (this.props.onContextMenu) {
            e.stopPropagation();
            e.preventDefault();
            this.props.onContextMenu(e);
        }
    }
}

applyFocusableComponentMixin(Link);

export default Link;
