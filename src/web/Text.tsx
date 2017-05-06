/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Text abstraction.
*/

import React = require('react');
import ReactDOM = require('react-dom');

import AccessibilityUtil from './AccessibilityUtil';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');

const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flex: '0 0 auto',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flex: '0 0 auto',
        overflow: 'hidden',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};

export class Text extends RX.Text<void> {
    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: React.PropTypes.bool.isRequired
    };

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
        
        return (
            <div
                style={ this._getStyles() }
                aria-hidden={ isAriaHidden }
                onClick={ this.props.onPress }
            >
                { this.props.children }
            </div>
        );
    }

    _getStyles(): Types.TextStyleRuleSet {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        let combinedStyles = Styles.combine(this.props.numberOfLines === 1 ?
            _styles.ellipsis : _styles.defaultStyle, this.props.style);

        // Handle cursor styles
        if (this.props.selectable) {
            combinedStyles['cursor'] = 'text';
            combinedStyles['userSelect'] = 'text';
            combinedStyles['WebkitUserSelect'] = 'text';
            combinedStyles['MozUserSelect'] = 'text';
            combinedStyles['msUserSelect'] = 'text';
        } else {
            combinedStyles['cursor'] = 'inherit';
        }

        if (this.props.onPress) {
            combinedStyles['cursor'] = 'pointer';
        }

        return combinedStyles;
    }
    
    blur() {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            el.blur();
        }
    }

    focus() {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            el.focus();
        }
    }
}

export default Text;
