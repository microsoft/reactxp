/**
* Alert.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native Alert dialog boxes for ReactXP.
*/
"use strict";
var RN = require("react-native");
// Native implementation for alert dialog boxes
var Alert = (function () {
    function Alert() {
    }
    Alert.prototype.show = function (title, message, buttons) {
        RN.Alert.alert(title, message, buttons);
    };
    return Alert;
}());
exports.Alert = Alert;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Alert();
