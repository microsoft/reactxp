/**
* MainViewStore.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A simple store that publishes changes to the main element
* provided by the app.
*/
import React = require('react');
import SubscribableEvent = require('../common/SubscribableEvent');
export declare class MainViewStore extends SubscribableEvent.SubscribableEvent<() => void> {
    private _mainView;
    getMainView(): React.ReactElement<any>;
    setMainView(view: React.ReactElement<any>): void;
}
declare var instance: MainViewStore;
export default instance;
