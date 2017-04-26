/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform View abstraction.
*/
import React = require('react');
import Types = require('../common/Types');
import ViewBase from './ViewBase';
export interface ViewContext {
    isRxParentAText?: boolean;
}
export declare class View extends ViewBase<Types.ViewProps, {}> {
    static contextTypes: React.ValidationMap<any>;
    context: ViewContext;
    static childContextTypes: React.ValidationMap<any>;
    getChildContext(): {
        isRxParentAText: boolean;
    };
    protected _getContainerRef(): React.Component<any, any>;
    render(): React.ReactElement<any>;
}
export default View;
