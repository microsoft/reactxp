/**
 * Text.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Text abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';

import AccessibilityUtil from './AccessibilityUtil';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { Text as TextBase, Types } from '../common/Interfaces';
import Styles from './Styles';

// Adding a CSS rule to display non-selectable texts. Those texts
// will be displayed as pseudo elements to prevent them from being copied
// to clipboard. It's not possible to style pseudo elements with inline
// styles, so, we're dynamically creating a <style> tag with the rule.
if (typeof document !== 'undefined') {
    const textAsPseudoElement = '[data-text-as-pseudo-element]::before { content: attr(data-text-as-pseudo-element); }';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(textAsPseudoElement));
    document.head.appendChild(style);
}

const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
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

export interface TextContext {
    isRxParentAText: boolean;
    focusArbitrator?: FocusArbitratorProvider;
}

export class Text extends TextBase {
    static contextTypes = {
        focusArbitrator: PropTypes.object
    };

    context!: TextContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired
    };

    private _mountedText: HTMLDivElement | null = null;

    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is an Types.Text.
        // Because they're in an Types.Text, they should style themselves specially for appearing
        // inline with text.
        return { isRxParentAText: true };
    }

    render() {
        // Handle special case
        if (typeof this.props.children === 'string' && this.props.children === '\n') {
            return <br/>;
        }

        const isAriaHidden = AccessibilityUtil.isHidden(this.props.importantForAccessibility);

        if (this.props.selectable || typeof this.props.children !== 'string') {
            return (
                <div
                    ref={ this._onMount }
                    style={ this._getStyles() as any }
                    aria-hidden={ isAriaHidden }
                    onClick={ this.props.onPress }
                    id={ this.props.id }
                    onContextMenu={ this.props.onContextMenu }
                    data-test-id={ this.props.testId }
                >
                    { this.props.children }
                </div>
            );
        } else {
            // user-select CSS property doesn't prevent the text from being copied to clipboard.
            // To avoid getting to clipboard, the text from data-text-as-pseudo-element attribute
            // will be displayed as pseudo element.
            return (
                <div
                    ref={ this._onMount }
                    style={ this._getStyles() as any }
                    aria-hidden={ isAriaHidden }
                    onClick={ this.props.onPress }
                    onContextMenu={ this.props.onContextMenu }
                    data-text-as-pseudo-element={ this.props.children }
                    id={ this.props.id }
                    data-test-id={ this.props.testId }
                />
            );
        }
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    private _onMount = (ref: HTMLDivElement | null) => {
        this._mountedText = ref;
    }

    private _getStyles(): Types.TextStyleRuleSet {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        const combinedStyles = Styles.combine([this.props.numberOfLines === 1 ?
            _styles.ellipsis : _styles.defaultStyle, this.props.style]) as any;

        if (this.props.selectable) {
            combinedStyles.userSelect = 'text';
            combinedStyles.WebkitUserSelect = 'text';
            combinedStyles.MozUserSelect = 'text';
            combinedStyles.msUserSelect = 'text';
        }

        // Handle cursor styles
        if (!combinedStyles.cursor) {
            if (this.props.selectable) {
                combinedStyles.cursor = 'text';
            } else {
                combinedStyles.cursor = 'inherit';
            }

            if (this.props.onPress) {
                combinedStyles.cursor = 'pointer';
            }
        }

        return combinedStyles;
    }

    blur() {
        if (this._mountedText) {
            this._mountedText.blur();
        }
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => this._mountedText !== null
        );
    }

    focus() {
        if (this._mountedText) {
            this._mountedText.focus();
        }
    }

    getSelectedText(): string {
        return ''; // Not implemented yet.
    }
}

export default Text;
