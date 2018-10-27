/**
 * MainViewStore.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * A simple store that publishes changes to the main element
 * provided by the app.
 */

import * as React from 'react';
import SubscribableEvent from 'subscribableevent';

export class MainViewStore extends SubscribableEvent<() => void> {
    private _mainView: React.ReactElement<any> | undefined;

    getMainView() {
        return this._mainView;
    }

    setMainView(view: React.ReactElement<any>) {
        this._mainView = view;
        this.fire();
    }
}

export default new MainViewStore();
