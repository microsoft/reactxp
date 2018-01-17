/**
* UserInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.) - desktop version.
*/

import React = require('react');
import RN = require('react-native');

import { RootViewUsingProps } from './RootView';
import { UserInterface as UserInterfaceCommon } from '../native-common/UserInterface';

export class UserInterface extends UserInterfaceCommon {
    private _isNavigatingWithKeyboard: boolean = false;
    constructor() {
        super();
        this.keyboardNavigationEvent.subscribe(this._keyboardNavigationStateChanged);
    }

    isNavigatingWithKeyboard(): boolean {
        return this._isNavigatingWithKeyboard;
    }

    private _keyboardNavigationStateChanged = (isNavigatingWithKeyboard: boolean) => {
        this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;
    }

    registerRootView(viewKey: string, getComponentFunc: Function) {
        RN.AppRegistry.registerComponent(viewKey, () => {
            class RootViewWrapper extends React.Component<any, any> {
                render() {
                    return (
                        <RootViewUsingProps
                            reactxp_mainViewType={ getComponentFunc() }
                            { ...this.props }
                        />
                    );
                }
            }

            return RootViewWrapper;
        });
    }
}

export default new UserInterface();
