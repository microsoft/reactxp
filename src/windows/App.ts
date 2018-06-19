/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows implementation of App API namespace.
*/
import RN = require('react-native');

import { ComponentProvider } from 'react-native';
import { RootView, RootViewUsingProps } from './RootView';
import { App as AppCommon } from '../native-common/App';

export class App extends AppCommon {
    private _isAppFocued = false;
    constructor() {
        super();

        RN.NativeAppEventEmitter.addListener('WindowDeactivatedEventName', () => {
            this._setAppFocusState(false);
        });

        RN.NativeAppEventEmitter.addListener('WindowActivatedEventName', () => {
            this._setAppFocusState(true);
        });
    }

    private _setAppFocusState(currentFocusState: boolean) {
        if (currentFocusState !== this._isAppFocued) {
            this._isAppFocued = currentFocusState;
            this.appFocusChangedEvent.fire(currentFocusState);            
        }
    }
    
    protected getRootViewFactory(): ComponentProvider {
        return () => RootView;
    }

    protected getRootViewUsingPropsFactory(): ComponentProvider {
        return () => RootViewUsingProps;
    }

    isAppFocused() {
        return this._isAppFocued;
    }
}

export default new App();
