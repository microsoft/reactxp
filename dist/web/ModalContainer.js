/**
* ModalContainer.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of a view that's used to render modals.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ModalContainer = (function (_super) {
    __extends(ModalContainer, _super);
    function ModalContainer() {
        return _super.call(this) || this;
    }
    ModalContainer.prototype.render = function () {
        var modalContainerStyle = {
            display: 'flex',
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            flex: '1 1 auto',
            alignSelf: 'stretch',
            overflow: 'hidden',
            zIndex: 10000
        };
        return (React.createElement("div", { style: modalContainerStyle }, this.props.children));
    };
    return ModalContainer;
}(React.Component));
exports.ModalContainer = ModalContainer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModalContainer;
