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

const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',

        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};

export class Link extends RX.Link<void> {
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
                onMouseLeave={ this.props.onHoverEnd}
            >
                { this.props.children }
            </a>
        );
    }

    _getStyles(): Types.LinkStyleRuleSet {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        let combinedStyles = Styles.combine(
            this.props.numberOfLines === 1 ? _styles.ellipsis : _styles.defaultStyle,
            this.props.style);

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

            this.props.onPress();
        }
    }
}

export default Link;
