/**
* AnimateListEdits.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Each time the component receives new children, animates insertions, removals,
* and moves that occurred since the previous render.
*/

import React = require('react');
import ReactDOM = require('react-dom');

import MonitorListEdits = require('./MonitorListEdits');
import executeTransition from '../animated/executeTransition';

export interface AnimateListEditsProps extends React.HTMLAttributes {
    animateChildEnter?: boolean;
    animateChildLeave?: boolean;
    animateChildMove?: boolean;
}

export class AnimateListEdits extends React.Component<AnimateListEditsProps, {}> {
    _handleWillAnimate(edits: MonitorListEdits.IEdits, done: () => void) {
        let counter = 1;
        let animationCompleted = function () {
            --counter;
            if (counter === 0) {
                done();
            }
        };

        let delay = 0;
        if (edits.removed.length > 0 && this.props.animateChildLeave) {
            edits.removed.forEach(function (move) {
                let domNode = ReactDOM.findDOMNode<HTMLElement>(move.element);
                if (domNode) {
                    domNode.style.transform = 'translateY(' + -move.topDelta + 'px)';

                    counter++;
                    executeTransition(domNode, [{
                        property: 'opacity',
                        from: 1,
                        to: 0,
                        delay: delay,
                        duration: 150,
                        timing: 'linear'
                    }], animationCompleted);
                }
            });
            delay += 75;
        }

        if (edits.moved.length > 0 && this.props.animateChildMove) {
            edits.moved.forEach(function (move) {
                counter++;
                let domNode = ReactDOM.findDOMNode<HTMLElement>(move.element);
                if (domNode) {
                    executeTransition(domNode, [{
                        property: 'transform',
                        from: 'translateY(' + -move.topDelta + 'px)',
                        to: '',
                        delay: delay,
                        duration: 300,
                        timing: 'ease-out'
                    }], animationCompleted);
                }
            });
        }
        delay += 75;

        if (edits.added.length > 0 && this.props.animateChildEnter) {
            edits.added.forEach(function (move) {
                counter++;
                executeTransition(ReactDOM.findDOMNode<HTMLElement>(move.element), [{
                    property: 'opacity',
                    from: 0,
                    to: 1,
                    delay: delay,
                    duration: 150,
                    timing: 'linear'
                }], animationCompleted);
            });
        }
        animationCompleted();
    }
    render() {
        return (
            <MonitorListEdits.MonitorListEdits
                componentWillAnimate={ (edits: MonitorListEdits.IEdits, done: () => void) => this._handleWillAnimate(edits, done) }
                {...this.props}
            >
                {this.props.children}
            </MonitorListEdits.MonitorListEdits>
        );
    }
}

export default AnimateListEdits;
