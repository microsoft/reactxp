/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform View abstraction.
*/

import React = require('react');

import AccessibilityUtil from './AccessibilityUtil';
import AnimateListEdits from './listAnimations/AnimateListEdits';
import restyleForInlineText = require('./utils/restyleForInlineText');
import Styles from './Styles';
import Types = require('../common/Types');
import ViewBase from './ViewBase';

const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch'
    }
};

if (typeof document !== 'undefined') {
    const ignorePointerEvents = '.reactxp-ignore-pointer-events  * { pointer-events: auto; }';
    const head = document.head;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(ignorePointerEvents));
    head.appendChild(style);
}

export interface ViewContext {
    isRxParentAText?: boolean;
}

export class View extends ViewBase<Types.ViewProps, {}> {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: React.PropTypes.bool
    };
    context: ViewContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: React.PropTypes.bool.isRequired
    };

    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is not an Types.Text.
        // Because they're in an Types.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: false };
    }

    protected _getContainerRef(): React.Component<any, any> {
        return this;
    }

    render() {
        let combinedStyles = Styles.combine(_styles.defaultStyle, this.props.style);
        const ariaRole = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits);
        const ariaSelected = AccessibilityUtil.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        const isAriaHidden = AccessibilityUtil.isHidden(this.props.importantForAccessibility);
        
        let props: Types.AccessibilityHtmlAttributes = {
            role: ariaRole,
            tabIndex: this.props.tabIndex,
            style: combinedStyles,
            title: this.props.title,
            'aria-label': this.props.accessibilityLabel,
            'aria-hidden': isAriaHidden,
            'aria-selected': ariaSelected,
            onContextMenu: this.props.onContextMenu,
            onMouseEnter: this.props.onMouseEnter,
            onMouseLeave: this.props.onMouseLeave,
            onMouseOver: this.props.onMouseOver,
            onMouseMove: this.props.onMouseMove,
            onDragEnter: this.props.onDragEnter,
            onDragOver: this.props.onDragOver,
            onDragLeave: this.props.onDragLeave,
            onDrop: this.props.onDrop,
            onClick: this.props.onPress,
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur,
            onKeyDown: this.props.onKeyPress,
        };

        if (this.props.ignorePointerEvents) {
            props.className = 'reactxp-ignore-pointer-events';
            combinedStyles['pointerEvents'] = 'none';
        }

        let reactElement: React.ReactElement<any>;
        let childAnimationsEnabled = this.props.animateChildEnter || this.props.animateChildMove || this.props.animateChildLeave;
        if (childAnimationsEnabled) {
            reactElement = (
                <AnimateListEdits
                    {...props}
                    animateChildEnter={this.props.animateChildEnter}
                    animateChildMove={this.props.animateChildMove}
                    animateChildLeave={this.props.animateChildLeave}
                >
                    {this.props.children}
                </AnimateListEdits>
            );
        } else {
            reactElement = (
                <div {...props} >
                    {this.props.children}
                </div>
            );
        }

        return this.context.isRxParentAText ?
            restyleForInlineText(reactElement) :
            reactElement;
    }
}

export default View;
