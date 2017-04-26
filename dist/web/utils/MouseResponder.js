/**
* MouseResponder.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Handles tracking of mouse movements.
*/
"use strict";
var _ = require("./../utils/lodashMini");
var _compareDOMOrder = function (a, b) {
    if (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
    }
    else {
        return -1;
    }
};
var MouseResponder = (function () {
    function MouseResponder() {
    }
    MouseResponder.create = function (config) {
        MouseResponder._initializeEventHandlers();
        MouseResponder._responders = MouseResponder._responders || [];
        var responder = {
            id: config.id,
            target: config.target,
            shouldBecomeFirstResponder: function (event, gestureState) {
                if (!config.shouldBecomeFirstResponder) {
                    return false;
                }
                return config.shouldBecomeFirstResponder(event, gestureState);
            },
            onMove: function (event, gestureState) {
                if (!config.onMove) {
                    return;
                }
                config.onMove(event, gestureState);
            },
            onTerminate: function (event, gestureState) {
                if (!config.onTerminate) {
                    return;
                }
                config.onTerminate(event, gestureState);
            }
        };
        MouseResponder._responders.push(responder);
        return {
            dispose: function () {
                _.remove(MouseResponder._responders, function (r) { return r.id === responder.id; });
                if (MouseResponder._responders.length === 0) {
                    MouseResponder._removeEventHandlers();
                }
            }
        };
    };
    MouseResponder._initializeEventHandlers = function () {
        if (MouseResponder._initialized) {
            return;
        }
        window.addEventListener('mousedown', MouseResponder._onMouseDown);
        window.addEventListener('mousemove', MouseResponder._onMouseMove);
        window.addEventListener('mouseup', MouseResponder._onMouseUp);
        MouseResponder._initialized = true;
    };
    MouseResponder._removeEventHandlers = function () {
        if (!MouseResponder._initialized) {
            return;
        }
        window.removeEventListener('mousedown', MouseResponder._onMouseDown);
        window.removeEventListener('mousemove', MouseResponder._onMouseMove);
        window.removeEventListener('mouseup', MouseResponder._onMouseUp);
        MouseResponder._initialized = false;
    };
    return MouseResponder;
}());
MouseResponder._currentResponder = null;
MouseResponder._pendingGestureState = null;
MouseResponder._initialized = false;
MouseResponder._onMouseDown = function (event) {
    // We need to skip new gesture starts when there is already on in progress
    if (MouseResponder._currentResponder) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    MouseResponder._pendingGestureState = {
        initialClientX: event.clientX,
        initialClientY: event.clientY,
        initialPageX: event.pageX,
        initialPageY: event.pageY,
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        velocityX: 0,
        velocityY: 0,
        timeStamp: new Date(),
        isComplete: false
    };
    // We must sort them properly to be consistent with native PanResponder picks it's first responders
    // In native there is no z-index and PanResponder picks always the last registered element.
    // in case of native, that's last element in "DOM"
    MouseResponder._responders.sort(_compareDOMOrder);
    // We need to pick a responder that will handle this GestureView
    var firstResponder = _.findLast(MouseResponder._responders, function (responder) {
        return responder.shouldBecomeFirstResponder(event, MouseResponder._pendingGestureState);
    });
    if (firstResponder) {
        MouseResponder._currentResponder = firstResponder;
    }
};
MouseResponder._onMouseMove = function (event) {
    if (MouseResponder._currentResponder && MouseResponder._pendingGestureState) {
        var _a = MouseResponder._calcVelocity(event, MouseResponder._pendingGestureState), velocityX = _a.velocityX, velocityY = _a.velocityY;
        MouseResponder._pendingGestureState = _.merge({}, MouseResponder._pendingGestureState, {
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            velocityX: velocityX,
            velocityY: velocityY,
            isComplete: false
        });
        if (event.buttons === 0) {
            MouseResponder._onMouseUp(event);
        }
        else {
            MouseResponder._currentResponder.onMove(event, MouseResponder._pendingGestureState);
        }
    }
};
MouseResponder._onMouseUp = function (event) {
    // We check whether there is still some buttom pressed
    // in case there are still some buttons left,
    // we don't stop terminate the gesture.
    if (event.buttons !== 0) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    if (MouseResponder._currentResponder && MouseResponder._pendingGestureState) {
        var _a = MouseResponder._calcVelocity(event, MouseResponder._pendingGestureState), velocityX = _a.velocityX, velocityY = _a.velocityY;
        MouseResponder._pendingGestureState = _.merge({}, MouseResponder._pendingGestureState, {
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            velocityX: velocityX,
            velocityY: velocityY,
            isComplete: true
        });
        MouseResponder._currentResponder.onTerminate(event, MouseResponder._pendingGestureState);
        MouseResponder._currentResponder = null;
        MouseResponder._pendingGestureState = null;
    }
};
MouseResponder._calcVelocity = function (e, gestureState) {
    var time = Date.now() - gestureState.timeStamp.getTime();
    var velocityX = (e.clientX - gestureState.initialClientX) / time;
    var velocityY = (e.clientY - gestureState.initialClientY) / time;
    return {
        velocityX: velocityX,
        velocityY: velocityY
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MouseResponder;
