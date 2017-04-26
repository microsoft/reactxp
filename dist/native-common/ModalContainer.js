/**
* ModalContainer.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Modal abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var RN = require("react-native");
var _styles = {
    defaultContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    }
};
var ModalContainer = (function (_super) {
    __extends(ModalContainer, _super);
    function ModalContainer(props) {
        return _super.call(this, props) || this;
    }
    ModalContainer.prototype.render = function () {
        return (React.createElement(RN.View, { style: _styles.defaultContainer }, this.props.children));
    };
    return ModalContainer;
}(React.Component));
exports.ModalContainer = ModalContainer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModalContainer;
