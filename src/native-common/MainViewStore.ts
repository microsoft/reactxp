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
import SubscribableEvent from 'subscribableevent';

export class MainViewStore extends SubscribableEvent<() => void> {
    private _mainView: React.ReactElement<any> = null;

    getMainView() {
        return this._mainView;
    }

    setMainView(view: React.ReactElement<any>) {
        this._mainView = view;
        this.fire();
    }
}

var instance = new MainViewStore();
export default instance;
