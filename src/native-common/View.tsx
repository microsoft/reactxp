/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform View abstraction.
*/

import _ = require('./lodashMini');

import assert = require('assert');
import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from './AccessibilityUtil';

import Types = require('../common/Types');
import UserInterface from './UserInterface';
import ViewBase from './ViewBase';

let LayoutAnimation = RN.LayoutAnimation;

function applyMixin(thisObj: any, mixin: {[propertyName: string]: any}) {
    Object.getOwnPropertyNames(mixin).forEach(name => {
        if (name !== 'constructor') {
            assert(
                !(name in thisObj),
                `An object cannot have a method with the same name as one of its mixins: "${name}"`
            );
            thisObj[name] = mixin[name].bind(thisObj);
        }
    });
}

function removeMixin(thisObj: any, mixin: {[propertyName: string]: any}) {
    Object.getOwnPropertyNames(mixin).forEach(name => {
        if (name !== 'constructor') {
            assert(
                (name in thisObj),
                `An object is missing a mixin method: "${name}"`
            );
            delete thisObj[name];
        }
    });
}

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
            if (childReactElement.key !== null) {
                keys.push(childReactElement.key);
            }
        }
    });
    return keys;
}

function findInvalidRefs(children: React.ReactNode) {
    let invalidRefs: string[] = [];
    React.Children.forEach(children, function (child) {
        if (child) {
            let childElement = child as any;
            if (typeof childElement.ref !== 'function' && childElement.ref !== undefined && childElement.ref !== null) {
                invalidRefs.push(childElement.ref as string);
            }
        }
    });
    return invalidRefs;
}

// Returns true if an item was added or moved. We use this information to determine
// whether or not we'll need to play any list edit animations.
function _childrenEdited(prevChildrenKeys: ChildKey[], nextChildrenKeys: ChildKey[]): boolean {
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

export class View extends ViewBase<Types.ViewProps, {}> {
    private _internalProps: any = {};

    touchableGetInitialState: () => RN.Touchable.State;
    touchableHandleStartShouldSetResponder: () => boolean;
    touchableHandleResponderTerminationRequest: () => boolean;
    touchableHandleResponderGrant: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderMove: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderRelease: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderTerminate: (e: React.SyntheticEvent<any>) => void;

    private _mixinIsApplied = false;
    private _childrenKeys: ChildKey[];

    constructor(props: Types.ViewProps) {
        super(props);
        this._updateMixin(props, true);
        this._buildInternalProps(props);
    }

    componentWillReceiveProps(nextProps: Types.ViewProps) {
        this._updateMixin(nextProps, false);
        this._buildInternalProps(nextProps);
    }

    componentWillUpdate(nextProps: Types.ViewProps, nextState: {}) {
        //
        // Exit fast if not an "animated children" case
        if (!(nextProps.animateChildEnter || nextProps.animateChildMove || nextProps.animateChildLeave)) {
            return;
        }

        // Each time the component receives new children, animates insertions, removals,
        // and moves that occurred since the previous render. Uses React Native's
        // LayoutAnimation API to achieve this.
        //
        // Caveats:
        //   - The animations are not scoped. All layout changes in the app that occur during the
        //     next bridge transaction will be animated. This is due to a limitation in React Native's
        //     LayoutAnimation API.
        //   - Removals are not animated. The removed item disappears instantly. Items whose positions
        //     were affected by the removal are animated into their new positions. This is due to a
        //     limitation in React Native's LayoutAnimation API.
        //

        // The web implementation doesn't support string refs. For consistency, do the same assert
        // in the native implementation.
        assert(
            findInvalidRefs(this.nextProps.children).length === 0,
            'Invalid ref(s): ' + JSON.stringify(findInvalidRefs(this.nextProps.children)) +
            ' Only callback refs are supported when using child animations on a `View`'
        );

        let prevChildrenKeys = this._childrenKeys;
        let nextChildrenKeys = extractChildrenKeys(nextProps.children);
        this._childrenKeys = nextChildrenKeys;
        if (_childrenEdited(prevChildrenKeys, nextChildrenKeys)) {
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

            if (this.nextProps.animateChildMove) {
                configDictionary.update = updateConfig;
            }

            if (this.nextProps.animateChildEnter) {
                configDictionary.create = createConfig;
            }

            LayoutAnimation.configureNext(configDictionary);
        }
    }

    private _updateMixin(props: Types.ViewProps, initial: boolean) {
        let isButton = this._isButton(props);
        if (isButton && !this._mixinIsApplied) {
            applyMixin(this, RN.Touchable.Mixin);

            if (initial) {
                this.state = this.touchableGetInitialState();
            } else {
                this.setState(this.touchableGetInitialState());
            }
            this._mixinIsApplied = true;
        } else if (!isButton && this._mixinIsApplied) {
            removeMixin(this, RN.Touchable.Mixin);
            this._mixinIsApplied = false;
        }
    }

    /**
     * Attention:
     * be careful with setting any non layout properties unconditionally in this method to any value
     * as on android that would lead to extra layers of Views.
     */
    private _buildInternalProps(props: Types.ViewProps) {
        this._internalProps = _.clone(props) as any;
        this._internalProps.style = this._getStyles(props);
        this._internalProps.ref = this._setNativeView;

        // Translate accessibilityProps from RX to RN, there are type diferrences for example:
        // accessibilityLiveRegion prop is number (RX.Types.AccessibilityLiveRegion) in RX, but
        // string is expected by RN.View.
        const accessibilityProps = {
            importantForAccessibility: AccessibilityUtil.importantForAccessibilityToString(props.importantForAccessibility),
            accessibilityLabel: props.accessibilityLabel || props.title,
            accessibilityTraits: AccessibilityUtil.accessibilityTraitToString(props.accessibilityTraits),
            accessibilityComponentType: AccessibilityUtil.accessibilityComponentTypeToString(props.accessibilityTraits),
            accessibilityLiveRegion: AccessibilityUtil.accessibilityLiveRegionToString(props.accessibilityLiveRegion),
        };
        this._internalProps = _.extend(this._internalProps, accessibilityProps);

        if (props.onLayout) {
            this._internalProps.onLayout = this._onLayout;
        }

        if (props.blockPointerEvents) {
            this._internalProps.pointerEvents = 'none';
        } else {
            if (props.ignorePointerEvents) {
                this._internalProps.pointerEvents = 'box-none';
            }
        }

        if (this._mixinIsApplied) {
            const responderProps = {
                onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
                onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
                onResponderGrant: this.touchableHandleResponderGrant,
                onResponderMove: this.touchableHandleResponderMove,
                onResponderRelease: this.touchableHandleResponderRelease,
                onResponderTerminate: this.touchableHandleResponderTerminate
            };
            this._internalProps = _.extend(this._internalProps, responderProps);
        }

        if (RN.Platform.OS === 'windows') {
            this._processDragAndDropProps();
        }
    }

    private _processDragAndDropProps() {
        for (const name of ['onDragEnter', 'onDragOver', 'onDrop', 'onDragLeave']) {
            const handler = this._internalProps[name];

            if (handler) {
                this._internalProps.allowDrop = true;

                this._internalProps[name] = (e: React.SyntheticEvent<View>) => {
                    handler({
                        dataTransfer: (e.nativeEvent as any).dataTransfer,

                        stopPropagation() {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            }
                        },

                        preventDefault() {
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        },
                    });
                };
            }
        }
    }

    private _isButton(viewProps: Types.ViewProps): boolean {
        return !!(viewProps.onPress || viewProps.onLongPress);
    }

    render() {
        return (
            <RN.View { ...this._internalProps }>
                { this.props.children }
            </RN.View>
        );
    }

    touchableHandlePress = (e: Types.MouseEvent) => {
        UserInterface.evaluateTouchLatency(e);
        if (this.props.onPress) {
            this.props.onPress(e);
        }
    }

    touchableHandleLongPress = (e: Types.MouseEvent) => {
        if (this.props.onLongPress) {
            this.props.onLongPress(e);
        }
    }

    touchableGetPressRectOffset = () => {
        return {top: 20, left: 20, right: 20, bottom: 100};
    }

    focus() {
        AccessibilityUtil.setAccessibilityFocus(this);
    }

    setFocusRestricted(restricted: boolean) {
        // Nothing to do.
    }

    setFocusLimited(limited: boolean) {
        // Nothing to do.
    }
}

export default View;
