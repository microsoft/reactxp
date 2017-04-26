/**
* Modal.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Modal abstraction.
*/
import React = require('react');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Modal extends RX.Modal {
    isDisplayed(modalId: string): boolean;
    show(modal: React.ReactElement<Types.ViewProps>, modalId: string): void;
    dismiss(modalId: string): void;
    dismissAll(): void;
}
declare var _default: Modal;
export default _default;
