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
import MonitorListEdits = require('./MonitorListEdits');
export interface AnimateListEditsProps extends React.HTMLAttributes {
    animateChildEnter?: boolean;
    animateChildLeave?: boolean;
    animateChildMove?: boolean;
}
export declare class AnimateListEdits extends React.Component<AnimateListEditsProps, {}> {
    _handleWillAnimate(edits: MonitorListEdits.IEdits, done: () => void): void;
    render(): JSX.Element;
}
export default AnimateListEdits;
