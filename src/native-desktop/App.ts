/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native desktop implementation of App API namespace.
*/

import { RootView } from './RootView';
import { App as AppCommon } from '../native-common/App';

export class App extends AppCommon {

    protected getRootViewFactory(): Function {
        return () => RootView;
    }
}

export default new App();
