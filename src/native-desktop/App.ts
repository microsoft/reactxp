/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native desktop implementation of App API namespace.
*/

import { ComponentProvider } from 'react-native';
import { RootView, RootViewUsingProps } from './RootView';
import { App as AppCommon } from '../native-common/App';

export class App extends AppCommon {

    protected getRootViewFactory(): ComponentProvider {
        return () => RootView;
    }

    protected getRootViewUsingPropsFactory(): ComponentProvider {
        return () => RootViewUsingProps;
    }
}

export default new App();
