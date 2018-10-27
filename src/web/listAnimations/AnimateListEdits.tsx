/**
 * AnimateListEdits.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Each time the component receives new children, animates insertions, removals,
 * and moves that occurred since the previous render.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import executeTransition from '../animated/executeTransition';
import { Types } from '../../common/Interfaces';
import { clone } from './../utils/lodashMini';
import { Edits, MonitorListEdits } from './MonitorListEdits';

export interface AnimateListEditsProps {
    animateChildEnter?: boolean;
    animateChildLeave?: boolean;
    animateChildMove?: boolean;
}

export class AnimateListEdits extends React.Component<AnimateListEditsProps, Types.Stateless> {
    private _handleWillAnimate(edits: Edits, done: () => void) {
        let counter = 1;
        const animationCompleted = function() {
            --counter;
            if (counter === 0) {
                done();
            }
        };

        let delay = 0;
        if (edits.removed.length > 0 && this.props.animateChildLeave) {
            edits.removed.forEach(function(move) {
                try {
                    const domNode = ReactDOM.findDOMNode(move.element) as HTMLElement | null;
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
                } catch {
                    // Exception probably due to race condition in unmounting. Ignore.
                }
            });
            delay += 75;
        }

        if (edits.moved.length > 0 && this.props.animateChildMove) {
            edits.moved.forEach(function(move) {
                counter++;

                try {
                    const domNode = ReactDOM.findDOMNode(move.element) as HTMLElement | null;
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
                } catch {
                    // Exception probably due to race condition in unmounting. Ignore.
                }
            });
        }
        delay += 75;

        if (edits.added.length > 0 && this.props.animateChildEnter) {
            edits.added.forEach(function(move) {
                counter++;

                try {
                    const domNode = ReactDOM.findDOMNode(move.element) as HTMLElement | null;
                    if (domNode) {
                        executeTransition(domNode, [{
                            property: 'opacity',
                            from: 0,
                            to: 1,
                            delay: delay,
                            duration: 150,
                            timing: 'linear'
                        }], animationCompleted);
                    }
                } catch {
                    // Exception probably due to race condition in unmounting. Ignore.
                }
            });
        }
        animationCompleted();
    }
    render() {
        // Do a shallow clone and remove the props that don't
        // apply to the MontiroListEdits component.
        const props = clone(this.props) as AnimateListEditsProps;
        delete props.animateChildEnter;
        delete props.animateChildLeave;
        delete props.animateChildMove;

        return (
            <MonitorListEdits
                componentWillAnimate={ (edits: Edits, done: () => void) => this._handleWillAnimate(edits, done) }
                { ...props }
            >
                { this.props.children }
            </MonitorListEdits>
        );
    }
}

export default AnimateListEdits;
