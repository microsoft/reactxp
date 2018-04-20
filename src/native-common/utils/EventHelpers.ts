/**
* EventHelpers.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*/

import _ = require('../lodashMini');
import Types = require('../../common/Types');

//
// These helpers promote a SyntheticEvent to their higher level counterparts
export class EventHelpers {

    toKeyboardEvent(e: Types.SyntheticEvent): Types.KeyboardEvent {
        // Conversion to a KeyboardEvent-like event if needed
        let keyEvent = e as Types.KeyboardEvent;
        if (keyEvent.keyCode === undefined) {

            // Currently some key codes are dependent on platform. React Native proper (the iOS and Android platforms) have different
            // keycodes for arrow keys when comparing with React (JS).
            // We align the keycodes for native desktop platforms to the other native ones, as a workaround.
            // Ideally all key codes should be consistent OR a set of constants should be exposed by ReactXP.
            let keyName: string = (e.nativeEvent as any).key;
            let keyCode: number = 0;

            if (keyName.length === 1) {
                keyCode = keyName.charCodeAt(0);
            } else {
                switch (keyName) {
                    // Comma in UWP is not in VirtualKey enum and so comes as stringified int value.
                    case '188':
                        keyCode = 188;
                        break;

                    case 'Backspace':
                    case 'Back':
                        keyCode = 8;
                        break;

                    case 'Tab':
                        keyCode = 9;
                        break;

                    case 'Enter':
                        keyCode = 13;
                        break;

                    case 'Shift':
                        keyCode = 16;
                        break;

                    case 'Control':
                        keyCode = 17;
                        break;

                    case 'Alt':
                    case 'Menu':
                        keyCode = 18;
                        break;

                    case 'Escape':
                        keyCode = 27;
                        break;

                    case 'Space':
                        keyCode = 32;
                        break;

                    case 'Delete':
                        keyCode = 46;
                        break;

                    case 'PageUp':
                        keyCode = 92;
                        break;

                    case 'PageDown':
                        keyCode = 93;
                        break;

                    case 'Left':
                    case 'ArrowLeft':
                        keyCode = 21;
                        break;

                    case 'Up':
                    case 'ArrowUp':
                        keyCode = 19;
                        break;

                    case 'Right':
                    case 'ArrowRight':
                        keyCode = 22;
                        break;

                    case 'Down':
                    case 'ArrowDown':
                        keyCode = 20;
                        break;
                    
                    case 'Number0':
                        keyCode = 48;
                        break;

                    case 'Number1':
                        keyCode = 49;
                        break;

                    case 'Number2':
                        keyCode = 50;
                        break;

                    case 'Number3':
                        keyCode = 51;
                        break;

                    case 'Number4':
                        keyCode = 52;
                        break;

                    case 'Number5':
                        keyCode = 53;
                        break;

                    case 'Number6':
                        keyCode = 54;
                        break;

                    case 'Number7':
                        keyCode = 55;
                        break;

                    case 'Number8':
                        keyCode = 56;
                        break;

                    case 'Number9':
                        keyCode = 57;
                        break;
                }
            }

            // We need to add keyCode and other properties to the original event, but React Native
            // reuses events, so we're not allowed to modify the original.
            // Instead, we'll clone it.
            keyEvent = _.clone(keyEvent);
            keyEvent.keyCode = keyCode;

            const nativeEvent = e.nativeEvent;

            if (nativeEvent.shiftKey) {
                keyEvent.shiftKey = nativeEvent.shiftKey;
            }
            if (nativeEvent.ctrlKey) {
                keyEvent.ctrlKey = nativeEvent.ctrlKey;
            }
            if (nativeEvent.altKey) {
                keyEvent.altKey = nativeEvent.altKey;
            }
            if (nativeEvent.metaKey) {
                keyEvent.metaKey = nativeEvent.metaKey;
            }

            keyEvent.stopPropagation = () => {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            };

            keyEvent.preventDefault = () => {
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };
        }
        return keyEvent;
    }

    toFocusEvent(e: Types.SyntheticEvent): Types.FocusEvent {

        // Ideally we'd like to add a null set "relatedTarget", but the new typing doesn't allow that.
        // So keeping it a noop for now
        return e as Types.FocusEvent;
    }

    toMouseEvent(e: Types.SyntheticEvent): Types.MouseEvent {

        // We need to add various properties to the original event, but React Native
        // reuses events, so we're not allowed to modify the original.
        // Instead, we'll clone it.
        let mouseEvent = _.clone(e as Types.MouseEvent);
        
        const nativeEvent = e.nativeEvent;

        // We keep pageX/Y and clientX/Y coordinates in sync, similar to the React web behavior
        // RN (UWP flavor for this type of event) also pass coordinates in the target view (locationX/Y) that we don't use here.
        if (nativeEvent.pageX !== undefined) {
            mouseEvent.clientX = mouseEvent.pageX = nativeEvent.pageX;
        }

        if (nativeEvent.pageY !== undefined) {
            mouseEvent.clientY = mouseEvent.pageY = nativeEvent.pageY;
        }

        if (!!nativeEvent.IsRightButton) {
            mouseEvent.button = 2;
        } else if (!!nativeEvent.IsMiddleButton) {
            mouseEvent.button = 1;
        } else {
            mouseEvent.button = 0;
        }

        if (nativeEvent.shiftKey) {
            mouseEvent.shiftKey = nativeEvent.shiftKey;
        }
        if (nativeEvent.ctrlKey) {
            mouseEvent.ctrlKey = nativeEvent.ctrlKey;
        }
        if (nativeEvent.altKey) {
            mouseEvent.altKey = nativeEvent.altKey;
        }
        if (nativeEvent.metaKey) {
            mouseEvent.metaKey = nativeEvent.metaKey;
        }

        mouseEvent.stopPropagation = () => {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        };

        mouseEvent.preventDefault = () => {
            if (e.preventDefault) {
                e.preventDefault();
            }
        };

        return mouseEvent;
    }

    isRightMouseButton(e: Types.SyntheticEvent): boolean {
        return !!e.nativeEvent.isRightButton;
    }
}

export default new EventHelpers();
