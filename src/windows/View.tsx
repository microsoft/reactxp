/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of View.
*/

import React = require('react');
import RNW = require('react-native-windows');
import Types = require('../common/Types');
import PropTypes = require('prop-types');

import {View as ViewCommon} from '../native-common/View';
import EventHelpers from '../native-common/utils/EventHelpers';
import { applyFocusableComponentMixin, FocusManagerFocusableComponent, FocusManager } from '../native-desktop/utils/FocusManager';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER];
const UP_KEYCODES = [KEY_CODE_SPACE];

export interface ViewContext {
    isRxParentAText?: boolean;
    focusManager?: FocusManager;
}

// Simple check for the presence of the updated React Native for Windows
const HasFocusableWindows = (RNW.FocusableWindows !== undefined);

export class View extends ViewCommon implements React.ChildContextProvider<ViewContext>, FocusManagerFocusableComponent {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool,
        focusManager: PropTypes.object
    };
    context: ViewContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
        focusManager: PropTypes.object
    };

    private _onKeyDown: (e: React.SyntheticEvent<any>) => void;
    private _onMouseEnter: (e: React.SyntheticEvent<any>) => void;
    private _onMouseLeave: (e: React.SyntheticEvent<any>) => void;
    private _onMouseOver: (e: React.SyntheticEvent<any>) => void;
    private _onMouseMove: (e: React.SyntheticEvent<any>) => void;

    private _focusableElement : RNW.FocusableWindows | null = null;

    private _focusManager: FocusManager;
    private _isFocusLimited: boolean;

    constructor(props: Types.ViewProps, context: ViewContext) {
        super(props);

        if (props.restrictFocusWithin || props.limitFocusWithin) {
            this._focusManager = new FocusManager(context && context.focusManager);

            if (props.limitFocusWithin) {
                this.setFocusLimited(true);
            }
        }
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
        // Mixins may have added this
        if (super.componentWillUnmount !== undefined) {
            super.componentWillUnmount();
        }
    }

    protected _buildInternalProps(props: Types.ViewProps) {

        // Base class does the bulk of _internalprops creation
        super._buildInternalProps(props);

        if (props.onKeyPress) {

            // Define the handler for "onKeyDown" on first use, it's the safest way when functions
            // called from super constructors are involved.
            if (this._onKeyDown === undefined) {
                this._onKeyDown =  (e: Types.SyntheticEvent) => {
                    if (this.props.onKeyPress) {
                        // A conversion to a KeyboardEvent looking event is needed
                        this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
                    }
                };
            }
            // "onKeyDown" is fired by native buttons and bubbles up to views
            this._internalProps.onKeyDown = this._onKeyDown;
        }

        // Drag and drop related properties
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

        // Mouse events (using same lazy initialization as for onKeyDown)
        if (props.onMouseEnter) {
            if (this._onMouseEnter === undefined) {
                this._onMouseEnter =  (e: React.SyntheticEvent<any>) => {
                    if (this.props.onMouseEnter) {
                         this.props.onMouseEnter(EventHelpers.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseEnter = this._onMouseEnter;
        }

        if (props.onMouseLeave) {
            if (this._onMouseLeave === undefined) {
                this._onMouseLeave =  (e: React.SyntheticEvent<any>) => {
                    if (this.props.onMouseLeave) {
                         this.props.onMouseLeave(EventHelpers.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseLeave = this._onMouseLeave;
        }

        if (props.onMouseOver) {
            if (this._onMouseOver === undefined) {
                this._onMouseOver =  (e: React.SyntheticEvent<any>) => {
                    if (this.props.onMouseOver) {
                         this.props.onMouseOver(EventHelpers.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseOver = this._onMouseOver;
        }

        if (props.onMouseMove) {
            if (this._onMouseMove === undefined) {
                this._onMouseMove =  (e: React.SyntheticEvent<any>) => {
                    if (this.props.onMouseMove) {
                         this.props.onMouseMove(EventHelpers.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseMove = this._onMouseMove;
        }
    }

    render(): JSX.Element {

        let content: JSX.Element = super.render();

        // Exit fast if the keyboard enabled component is not available
        if (!HasFocusableWindows) {
            return content;
        }

        if (this.props.tabIndex !== undefined) {
            let tabIndex: number = this.getTabIndex() || 0;
            let windowsTabFocusable: boolean =  tabIndex >= 0;

            // RNW.FocusableWindows doesn't participate in layouting, it basically mimics the position/size of the child
            let focusableViewProps: RNW.FocusableProps = {
                ref: this._onFocusableRef,
                isTabStop: windowsTabFocusable,
                tabIndex: tabIndex,
                disableSystemFocusVisuals: false,
                handledKeyDownKeys: DOWN_KEYCODES,
                handledKeyUpKeys: UP_KEYCODES,
                onKeyDown: this._onFocusableKeyDown,
                onKeyUp: this._onFocusableKeyUp,
                onFocus: this._onFocus,
                onBlur: this._onBlur
            };

            content = (
                <RNW.FocusableWindows
                    {...focusableViewProps}
                >
                    {content}
                </RNW.FocusableWindows>
            );
        }

        return content;
    }

    private _onFocusableRef = (btn: RNW.FocusableWindows): void => {
        this._focusableElement = btn;
    }

    focus() {
        super.focus();
        // Only forward to Button.
        // The other cases are RN.View based elements with no meaningful focus support
        if (this._focusableElement) {
            this._focusableElement.focus();
        }
    }

    blur() {
        super.blur();
        // Only forward to Button.
        // The other cases are RN.View based elements with no meaningful focus support
        if (this._focusableElement) {
            this._focusableElement.blur();
        }
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

    private _onFocusableKeyDown = (e: React.SyntheticEvent<any>): void => {

        let keyEvent = EventHelpers.toKeyboardEvent(e);
        if (this.props.onKeyPress) {
            this.props.onKeyPress(keyEvent);
        }

        if (this.props.onPress) {
            let key = keyEvent.keyCode;
            // ENTER triggers press on key down
            if (key === KEY_CODE_ENTER) {
                this.props.onPress(keyEvent);
                return;
            }
        }
    }

    private _onFocusableKeyUp = (e: React.SyntheticEvent<any>): void => {

        let keyEvent = EventHelpers.toKeyboardEvent(e);
        if (keyEvent.keyCode === KEY_CODE_SPACE) {
            if (this.props.onPress) {
                this.props.onPress(keyEvent);
            }
        }
    }

    private _onFocus = (e: React.SyntheticEvent<any>): void => {
        this.onFocus();
        if (this.props.onFocus) {
            this.props.onFocus(EventHelpers.toFocusEvent(e));
        }
    }

    private _onBlur = (e: React.SyntheticEvent<any>): void => {
        if (this.props.onBlur) {
            this.props.onBlur(EventHelpers.toFocusEvent(e));
        }
    }

    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number | undefined {
        // Focus Manager may override this
        return this.props.tabIndex;
    }

    updateNativeTabIndex(): void {
        if (this._focusableElement) {
            let tabIndex: number = this.getTabIndex() || 0;
            let windowsTabFocusable: boolean = tabIndex >= 0;

            this._focusableElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable
            });
        }
    }
}

// A value for tabIndex (even <0) marks a View as being potentially keyboard focusable
applyFocusableComponentMixin(View, function (this: View, nextProps?: Types.ViewProps) {
    let tabIndex = nextProps && ('tabIndex' in nextProps) ? nextProps.tabIndex : this.props.tabIndex;
    return tabIndex !== undefined;
});

export default View;
