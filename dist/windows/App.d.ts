/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows implementation of App API namespace.
*/
import { ComponentProvider } from 'react-native';
import { App as AppCommon } from '../native-common/App';
export declare class App extends AppCommon {
    protected getRootViewFactory(): ComponentProvider;
    protected getRootViewUsingPropsFactory(): ComponentProvider;
}
declare const _default: App;
export default _default;
