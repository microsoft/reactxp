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
    private _contextWrapper: ((rootView: React.ReactElement<any>) => React.ReactElement<any>) | undefined;


    getMainView(): React.ReactElement<any> | undefined {
        return this._mainView;
    }

    setMainView(view: React.ReactElement<any>): void {
        this._mainView = view;
        this.fire();
    }

    getContextWrapper(): ((rootView: React.ReactElement<any>) => React.ReactElement<any>) | undefined {
        return this._contextWrapper;
    }

    setContextWrapper(contextWrapper: ((rootView: React.ReactElement<any>) => React.ReactElement<any>)): void {
        this._contextWrapper = contextWrapper;
        this.fire();
    }
}

export default new MainViewStore();
