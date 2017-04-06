/**
* AnimateListEdits.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Each time the component receives new children, animates insertions, removals,
* and moves that occurred since the previous render. Uses React Native's
* LayoutAnimation API to achieve this.
*
* Caveats:
*   - The animations are not scoped. All layout changes in the app that occur during the
*     next bridge transaction will be animated. This is due to a limitation in React Native's
*     LayoutAnimation API.
*   - Removals are not animated. The removed item disappears instantly. Items whose positions
*     were affected by the removal are animated into their new positions. This is due to a
*     limitation in React Native's LayoutAnimation API.
*/

import assert = require('assert');
import React = require('react');
import RN = require('react-native');

let LayoutAnimation = RN.LayoutAnimation;

type ChildKey = string | number;
function extractChildrenKeys(children: React.ReactNode): ChildKey[] {
    var keys: ChildKey[] = [];
    React.Children.forEach(children, function (child, index) {
        if (child) {
            let childReactElement = child as React.ReactElement<any>;
            assert(
                childReactElement.key !== undefined && childReactElement.key !== null,
                'Children passed to a `View` with child animations enabled must have a `key`'
            );
            keys.push(childReactElement.key);
        }
    });
    return keys;
}

function findInvalidRefs(children: React.ReactNode) {
    let invalidRefs: string[] = [];
    React.Children.forEach(children, function (child) {
        if (child) {
            let childElement = child as React.ReactElement<any>;
            if (typeof childElement.ref !== 'function' && childElement.ref !== undefined && childElement.ref !== null) {
                invalidRefs.push(childElement.ref as string);
            }
        }
    });
    return invalidRefs;
}

export interface AnimateListEditsProps extends RN.ViewProps {
    animateChildEnter?: boolean;
    animateChildLeave?: boolean;
    animateChildMove?: boolean;
}

export class AnimateListEdits extends React.Component<AnimateListEditsProps, {}> {
    private _childrenKeys: ChildKey[];

    // Returns true if an item was added or moved. We use this information to determine
    // whether or not we'll need to play any list edit animations.
    private _childrenEdited(prevChildrenKeys: ChildKey[], nextChildrenKeys: ChildKey[]): boolean {
        const prevLength = prevChildrenKeys ? prevChildrenKeys.length : 0;
        const nextLength = nextChildrenKeys ? nextChildrenKeys.length : 0;

        // Were new items added?
        if (nextLength > prevLength) {
            return true;
        }

        // See if changes were limited to removals. Any additions or moves should return true.
        let prevIndex = 0;
        for (let nextIndex = 0; nextIndex < nextLength; nextIndex++) {
            if (prevChildrenKeys[prevIndex] === nextChildrenKeys[nextIndex]) {
                prevIndex++;
            } else {
                // If there are more "next" items left than there are "prev" items left,
                // then we know that something has been added or moved.
                if (nextLength - nextIndex > prevLength - prevIndex) {
                    return true;
                }
            }
        }

        return false;
    }

    componentWillUpdate(nextProps: AnimateListEditsProps, nextState: {}) {
        // The web implementation doesn't support string refs. For consistency, do the same assert
        // in the native implementation.
        assert(
            findInvalidRefs(this.props.children).length === 0,
            'Invalid ref(s): ' + JSON.stringify(findInvalidRefs(this.props.children)) +
            ' Only callback refs are supported when using child animations on a `View`'
        );

        let prevChildrenKeys = this._childrenKeys;
        let nextChildrenKeys = extractChildrenKeys(nextProps.children);
        this._childrenKeys = nextChildrenKeys;
        if (this._childrenEdited(prevChildrenKeys, nextChildrenKeys)) {
            let updateConfig: RN.IUpdateLayoutAnimationConfig = {
                delay: 0,
                duration: 300,
                type: LayoutAnimation.Types.easeOut
            };
            let createConfig: RN.ICreateLayoutAnimationConfig = {
                delay: 75,
                duration: 150,
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity
            };
            var configDictionary: RN.ILayoutAnimationConfig = {
                duration: 300,
            };

            if (this.props.animateChildMove) {
                configDictionary.update = updateConfig;
            }

            if (this.props.animateChildEnter) {
                configDictionary.create = createConfig;
            }

            LayoutAnimation.configureNext(configDictionary);
        }
    }

    render() {
        return (
            <RN.View ref='nativeView' { ...this.props }>
                { this.props.children }
            </RN.View>
        );
    }

    public setNativeProps(nativeProps: AnimateListEditsProps) {
        (this.refs['nativeView'] as RN.ReactNativeBaseComponent<any, any>).setNativeProps(nativeProps);
    }
}

export default AnimateListEdits;
