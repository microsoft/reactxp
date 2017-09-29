/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform View abstraction.
*/

import React = require('react');
import ReactDOM = require('react-dom');
import PropTypes = require('prop-types');

import AccessibilityUtil from './AccessibilityUtil';
import AnimateListEdits from './listAnimations/AnimateListEdits';
import restyleForInlineText = require('./utils/restyleForInlineText');
import Styles from './Styles';
import Types = require('../common/Types');
import ViewBase from './ViewBase';
import { FocusManager, applyFocusableComponentMixin } from './utils/FocusManager';

const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch'
    },

    // See resize detector comments in renderResizeDetectorIfNeeded() method below.
    resizeDetectorContainerStyles: {
        position: 'absolute',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        overflow: 'scroll',
        zIndex: '-1',
        visibility: 'hidden'
    },

    resizeGrowDetectorStyles: {
        position: 'absolute',
        left: '100500px',
        top: '100500px',
        width: '1px',
        height: '1px'
    },

    resizeShrinkDetectorStyles: {
        position: 'absolute',
        width: '150%',
        height: '150%'
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
    focusManager?: FocusManager;
}

export class View extends ViewBase<Types.ViewProps, {}> {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool,
        focusManager: PropTypes.object
    };
    context: ViewContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
        focusManager: PropTypes.object
    };

    private _focusManager: FocusManager;
    private _isFocusLimited: boolean;

    private _resizeDetectorAnimationFrame: number;
    private _resizeDetectorNodes: { grow?: HTMLElement, shrink?: HTMLElement } = {};

    constructor(props: Types.ViewProps, context: ViewContext) {
        super(props, context);

        if (props.restrictFocusWithin || props.limitFocusWithin) {
            this._focusManager = new FocusManager(context && context.focusManager);

            if (props.limitFocusWithin) {
                this.setFocusLimited(true);
            }
        }
    }

    private _renderResizeDetectorIfNeeded(containerStyles: any): React.ReactNode {
        // If needed, additional invisible DOM elements will be added inside the
        // view to track the size changes that are performed behind our back by
        // the browser's layout engine faster (ViewBase checks for the layout
        // updates once a second and sometimes it's not fast enough).

        // Unfortunately <div> doesn't have `resize` event, so we're trying to
        // detect the fact that the view has been resized with `scroll` events.
        // To do that, we create two scrollable <div>s and we put them into a
        // state in which `scroll` event is triggered by the browser when the
        // container gets resized (one element triggers `scroll` when the
        // container gets bigger, another triggers `scroll` when the container
        // gets smaller).

        if (!this.props.importantForLayout) {
            return null;
        }

        if (containerStyles.position !== 'relative') {
            console.error('View: importantForLayout property is applicable only for a view with relative position');
            return null;
        }

        let initResizer = (key: 'grow' | 'shrink', ref: React.DOMComponent<React.HTMLAttributes>) => {
            const cur: HTMLElement = this._resizeDetectorNodes[key];
            const element = ReactDOM.findDOMNode<HTMLElement>(ref);

            if (cur) {
                delete this._resizeDetectorNodes[key];
            }

            if (element) {
                this._resizeDetectorNodes[key] = element;
            }

            this._resizeDetectorOnScroll();
        };

        return [
            (
                <div
                    key={ 'grow' }
                    style={ _styles.resizeDetectorContainerStyles }
                    ref={ (ref) => initResizer('grow', ref) }
                    onScroll={ () => this._resizeDetectorOnScroll() }>

                    <div style={ _styles.resizeGrowDetectorStyles }></div>
                </div>
            ),
            (
                <div
                    key={ 'shrink' }
                    style={ _styles.resizeDetectorContainerStyles }
                    ref={ (ref) => initResizer('shrink', ref) }
                    onScroll={ () => this._resizeDetectorOnScroll() }>

                    <div style={ _styles.resizeShrinkDetectorStyles }></div>
                </div>
            )
        ];
    }

    private _resizeDetectorReset() {
        // Scroll the detectors to the bottom-right corner so
        // that `scroll` events will be triggered when the container
        // is resized.
        const scrollMax = 100500;

        let node = this._resizeDetectorNodes.grow;

        if (node) {
            node.scrollLeft = scrollMax;
            node.scrollTop = scrollMax;
        }

        node = this._resizeDetectorNodes.shrink;

        if (node) {
            node.scrollLeft = scrollMax;
            node.scrollTop = scrollMax;
        }
    }

    private _resizeDetectorOnScroll() {
        if (this._resizeDetectorAnimationFrame) {
            // Do not execute action more often than once per animation frame.
            return;
        }

        this._resizeDetectorAnimationFrame = window.requestAnimationFrame(() => {
            this._resizeDetectorReset();
            this._resizeDetectorAnimationFrame = undefined;
            ViewBase._checkViews();
        });

    }

    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is not an Types.Text.
        // Because they're in an Types.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        let childContext: ViewContext = {
            isRxParentAText: false
        };

        // Provide the descendants with the focus manager (if any).
        if (this._focusManager) {
            childContext.focusManager = this._focusManager;
        }

        return childContext;
    }

    protected _getContainerRef(): React.Component<any, any> {
        return this;
    }

    setFocusRestricted(restricted: boolean) {
        if (!this._focusManager || !this.props.restrictFocusWithin) {
            console.error('View: setFocusRestricted method requires restrictFocusWithin property to be set to true');
            return;
        }

        if (restricted) {
            this._focusManager.restrictFocusWithin();
        } else {
            this._focusManager.removeFocusRestriction();
        }
    }

    setFocusLimited(limited: boolean) {
        if (!this._focusManager || !this.props.limitFocusWithin) {
            console.error('View: setFocusLimited method requires limitFocusWithin property to be set to true');
            return;
        }

        if (limited && !this._isFocusLimited) {
            this._isFocusLimited = true;
            this._focusManager.limitFocusWithin();
        } else if (!limited && this._isFocusLimited) {
            this._isFocusLimited = false;
            this._focusManager.removeFocusLimitation();
        }
    }

    render() {
        let combinedStyles = Styles.combine([_styles.defaultStyle, this.props.style]) as any;
        const ariaRole = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits);
        const ariaSelected = AccessibilityUtil.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        const isAriaHidden = AccessibilityUtil.isHidden(this.props.importantForAccessibility);
        const ariaLive = AccessibilityUtil.accessibilityLiveRegionToString(this.props.accessibilityLiveRegion);

        let props: Types.AccessibilityHtmlAttributes = {
            role: ariaRole,
            tabIndex: this.props.tabIndex,
            style: combinedStyles,
            title: this.props.title,
            'aria-label': this.props.accessibilityLabel,
            'aria-hidden': isAriaHidden,
            'aria-selected': ariaSelected,
            'aria-labelledby': this.props.ariaLabelledBy,
            'aria-live': ariaLive,
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
            id: this.props.id
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
                    { ...props }
                    animateChildEnter={ this.props.animateChildEnter }
                    animateChildMove={ this.props.animateChildMove }
                    animateChildLeave={ this.props.animateChildLeave }
                >
                    { this.props.children }
                </AnimateListEdits>
            );
        } else {
            reactElement = (
                <div { ...props } >
                    { this._renderResizeDetectorIfNeeded(combinedStyles) }
                    { this.props.children }
                </div>
            );
        }

        return this.context.isRxParentAText ?
            restyleForInlineText(reactElement) :
            reactElement;
    }

    componentWillReceiveProps(nextProps: Types.ViewProps) {
        super.componentWillReceiveProps(nextProps);

        if (!!this.props.restrictFocusWithin !== !!nextProps.restrictFocusWithin) {
            console.error('View: restrictFocusWithin is readonly and changing it during the component life cycle has no effect');
        } else if (!!this.props.limitFocusWithin !== !!nextProps.limitFocusWithin) {
            console.error('View: limitFocusWithin is readonly and changing it during the component life cycle has no effect');
        }
    }

    componentDidMount() {
        super.componentDidMount();

        if (this._focusManager) {
            if (this.props.restrictFocusWithin) {
                this._focusManager.restrictFocusWithin();
            }

            if (this.props.limitFocusWithin && this._isFocusLimited) {
                this._focusManager.limitFocusWithin();
            }
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        if (this._focusManager) {
            this._focusManager.release();
        }
    }
}

applyFocusableComponentMixin(View, function (nextProps?: Types.ViewProps) {
    let tabIndex: number = nextProps && ('tabIndex' in nextProps) ? nextProps.tabIndex : this.props.tabIndex;
    return tabIndex !== undefined && tabIndex !== -1;
});

export default View;
