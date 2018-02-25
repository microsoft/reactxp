/**
* MonitorListEdits.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Looks for insertions, removals, and moves each time the component receives new
* children. Communicates these list edits to the consumer giving it the opportunity
* to animate the edits.
*/

import _ = require('./../utils/lodashMini');
import assert = require('assert');
import React = require('react');
import ReactDOM = require('react-dom');

function getPosition(el: HTMLElement): { left: number; top: number; } {
    return {
        left: el.offsetLeft,
        top: el.offsetTop
    };
}

type ChildKey = string | number;
function extractChildrenKeys(children: React.ReactNode|undefined): ChildKey[] {
    var keys: ChildKey[] = [];
    if (children) {
        React.Children.forEach(children, function (child, index) {
            if (child) {
                let childReactElement = child as React.ReactElement<any>;
                assert(
                    childReactElement.key !== undefined && childReactElement.key !== null,
                    'Children passed to a `View` with child animations enabled must have a `key`'
                );
                if (childReactElement.key !== null) {
                    keys.push(childReactElement.key);
                }
            }
        });
    }
    return keys;
}

// Returns true if the children were edited (e.g. an item was added, moved, or removed).
// We use this information to determine whether or not we'll need to play any list edit
// animations.
function childrenEdited(prevChildrenKeys: ChildKey[], nextChildrenKeys: ChildKey[]): boolean {
    return !_.isEqual(prevChildrenKeys, nextChildrenKeys);
}

type ChildrenMap = { [key: string]: React.ReactElement<any> };
function createChildrenMap(children: React.ReactNode|undefined): ChildrenMap {
    var map: ChildrenMap = {};
    if (children) {
        React.Children.forEach(children, function (child, index) {
            if (child) {
                let childReactElement = child as React.ReactElement<any>;
                assert(
                    'key' in childReactElement,
                    'Children passed to a `View` with child animations enabled must have a `key`'
                );
                let index = childReactElement['key'];
                if (index !== null) {
                    map[index] = childReactElement;
                }
            }
        });
    }
    return map;
}

function computePositions(refs: { [key: string]: MountedChildrenRef }) {
    var positions: {[key: string]: { left: number; top: number }} = {};
    _.each(refs, (ref, key) => {
        positions[key] = getPosition(ref.domElement);
    });
    return positions;
}

export interface IAddEdit {
    element: React.Component<any, any> | Element;
}
export interface IMoveEdit {
    element: React.Component<any, any> | Element;
    leftDelta: number;
    topDelta: number;
}
export interface IRemoveEdit {
    element: React.Component<any, any> | Element;
    leftDelta: number;
    topDelta: number;
}

export interface IEdits {
    added: IAddEdit[];
    moved: IMoveEdit[];
    removed: IRemoveEdit[];
}

// The states the React component can be in.
enum ComponentPhaseEnum {
    // The rest state. The component is not in the middle of anything.
    rest,
    // The component is about to play an animation. This occurs when the component
    // detected a list edit in componentWillUpdate but hasn't yet gotten the opportunity
    // to start the animation in componentDidUpdate.
    willAnimate,
    // The component is in the middle of playing an animation. The component should not
    // rerender while in this state.
    animating
}

// Pieces of information we calculate in componentWillUpdate and consume in componentDidUpdate.
// More specifically, we calculate animation information in componentWillUpdate and start the
// animation in componentDidUpdate.
interface IWillAnimatePhaseInfo {
    added: React.ReactElement<any>[];
    removed: React.ReactElement<any>[];
    other: React.ReactElement<any>[];
    prevPositions: {[key: string]: { left: number; top: number; }};
    prevChildrenMap: ChildrenMap;
}

interface MountedChildrenRef {
    reactElement: React.Component<any, any> | Element;
    domElement: HTMLElement;
}

export interface MonitorListEditsProps extends React.HTMLAttributes<any> {
    // Called when list edits are detected. Gives you an opportunity to animate them.
    // Call `done` when the animations are finished. Until `done` is called, the component
    // will refuse to rerender.
    componentWillAnimate: (edits: IEdits, done: () => void) => void;
}

export class MonitorListEdits extends React.Component<MonitorListEditsProps, {}> {
    private _itemRefs: { [key: string]: MountedChildrenRef } = {}; // Updated after render but before componentDidUpdate
    private _refReplacementCache: {
        [key: string]: {
            replacement: (ref: React.Component<any, any>) => any
            exisiting: string | ((ref: React.Component<any, any>) => any)
        }
    } = {};

    private _isMounted = false;
    // These are assigned in component will mount - will get value before used
    private _childrenKeys!: ChildKey[]; // Updated in componentWillUpdate
    private _childrenMap!: ChildrenMap; // Updated in componentWillUpdate
    // Extracted to don't leak it, shouldn't be a problem as js is singlethreaded
    private _childrenToRender!: JSX.Element[];

    private _phase: ComponentPhaseEnum = ComponentPhaseEnum.rest;
    private _willAnimatePhaseInfo: IWillAnimatePhaseInfo|undefined;

    componentWillMount() {
        this._childrenKeys = extractChildrenKeys(this.props.children);
        this._childrenMap = createChildrenMap(this.props.children);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    shouldComponentUpdate() {
        return this._phase !== ComponentPhaseEnum.animating;
    }

    componentWillUpdate(nextProps: MonitorListEditsProps) {
        assert(
            this._phase !== ComponentPhaseEnum.animating,
            'componentWillUpdate should never run while the component is animating due to the implementation of shouldComponentUpdate'
        );

        let prevChildrenKeys = this._childrenKeys;
        let nextChildrenKeys = extractChildrenKeys(nextProps.children);
        this._childrenKeys = nextChildrenKeys;
        if (childrenEdited(prevChildrenKeys, nextChildrenKeys)) {
            let prevChildrenMap = this._childrenMap;
            let nextChildrenMap = createChildrenMap(nextProps.children);
            this._childrenMap = nextChildrenMap;

            let removed: React.ReactElement<any>[] = [];
            let added: React.ReactElement<any>[] = [];
            let other: React.ReactElement<any>[] = [];

            Object.keys(prevChildrenMap).forEach(function (key) {
                if (!(key in nextChildrenMap)) {
                    removed.push(prevChildrenMap[key]);
                }
            });

            Object.keys(nextChildrenMap).forEach(function (key) {
                if (!(key in prevChildrenMap)) {
                    added.push(nextChildrenMap[key]);
                } else {
                    other.push(nextChildrenMap[key]);
                }
            });

            this._phase = ComponentPhaseEnum.willAnimate;
            this._willAnimatePhaseInfo = {
                added: added,
                removed: removed,
                other: other,
                prevPositions: computePositions(this._itemRefs),
                prevChildrenMap: prevChildrenMap
            };
        }
    }

    render() {
        this._childrenToRender = [];

        // We need to cast this to "any" because of a recent bug introduced
        // into React @types where children is redfined as ReactNode rather
        // than ReactNode[].
        _.each(this.props.children as any, child => {
            if (child) {
                let childElement = child;
                let refData = this._refReplacementCache[childElement.key];

                // Reuse the cached replacement ref function instead of recreating it every render, unless the child's ref changes.
                if (!refData || refData.exisiting !== childElement.ref) {
                    refData = {
                        replacement: refValue => { this._saveRef(childElement, refValue); },
                        exisiting: childElement.ref
                    };
                    this._refReplacementCache[childElement.key] = refData;
                }

                this._childrenToRender.push(React.cloneElement(childElement, { ref: refData.replacement }));
            }
        });

        if (this._phase === ComponentPhaseEnum.willAnimate) {
            _.each(this._willAnimatePhaseInfo!!!.removed, childElement => {
                if (childElement) {
                    this._childrenToRender.push(React.cloneElement(childElement, {
                        ref: (refValue: React.Component<any, any>) => {
                            this._saveRef(childElement, refValue);
                        }
                    }));
                }
            });
        }

        return (
            <div {...this.props}>
                { this._childrenToRender }
            </div>
        );
    }

    componentDidUpdate(prevProps: MonitorListEditsProps) {
        assert(
            this._phase !== ComponentPhaseEnum.animating,
            'componentDidUpdate should never run while the component is animating due to the implementation of shouldComponentUpdate'
        );

        if (this._phase === ComponentPhaseEnum.willAnimate) {
            let phaseInfo = this._willAnimatePhaseInfo!!!;
            let prevPositions = phaseInfo.prevPositions;
            let nextPositions = computePositions(this._itemRefs);

            let added: IAddEdit[] = phaseInfo.added.map(child => {
                return {
                    element: this._itemRefs[(child as any).key].reactElement
                };
            });

            let removed: IRemoveEdit[] = phaseInfo.removed.map(child => {
                let key = child.key as any;
                let prevPos = prevPositions[key];
                let nextPos = nextPositions[key];

                return {
                    leftDelta: nextPos.left - prevPos.left,
                    topDelta: nextPos.top - prevPos.top,
                    element: this._itemRefs[key].reactElement
                };
            });

            let moved: IMoveEdit[] = [];
            phaseInfo.other.map(child => {
                let key = child.key as any;
                let prevPos = prevPositions[key];
                let nextPos = nextPositions[key];
                if (prevPos.left !== nextPos.left || prevPos.top !== nextPos.top) {
                    moved.push({
                        leftDelta: nextPos.left - prevPos.left,
                        topDelta: nextPos.top - prevPos.top,
                        element: this._itemRefs[key].reactElement
                    });
                }
            });

            this._phase = ComponentPhaseEnum.animating;
            this._willAnimatePhaseInfo = undefined;
            this.props.componentWillAnimate({
                added: added,
                moved: moved,
                removed: removed
            }, () => {
                this._phase = ComponentPhaseEnum.rest;
                if (this._isMounted) {
                    this.forceUpdate();
                }
                phaseInfo.removed.forEach(child => {
                    let key = child.key as any;
                    delete this._refReplacementCache[key];
                });
            });
        }
    }

    private _saveRef(reactElement: any, refValue: React.Component<any, any>) {
        if (refValue === null) {
            delete this._itemRefs[reactElement.key];
        } else {
            // Cache both the react component reference and the corresponding HTML DOM node (for perf reasons).
            this._itemRefs[reactElement.key] = {
                reactElement: refValue,
                domElement: ReactDOM.findDOMNode(refValue) as HTMLElement
            };
        }

        assert(
            typeof reactElement.ref === 'function' || reactElement.ref === undefined || reactElement.ref === null,
            'Invalid ref: ' + reactElement.ref + '. Only callback refs are supported when using child animations on a `View`'
        );

        // If the creator of the reactElement also provided a ref, call it.
        if (typeof reactElement.ref === 'function') {
            reactElement.ref(refValue);
        }
    }
}
