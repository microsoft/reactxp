/**
* AppRegistry.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Implements AppRegistry interface for ReactXP.
*/

import React = require('react');
import RN = require('react-native');

import { RootView } from './RootView';
import RX = require('../common/Interfaces');
import { default as UserInterface } from './UserInterface';

export class AppRegistry extends RX.AppRegistry {
    registerComponent(appKey: string, getComponentFunc: Function): any {
        RN.AppRegistry.registerComponent(appKey, () => {
            class RootViewWrapper extends React.Component<any, any> {
                private wrappedComponent: React.ReactElement<any>;

                componentWillMount() {
                    this.wrappedComponent = this.wrappedComponent || React.createElement(getComponentFunc(), this.props);
                    UserInterface.setMainView(this.wrappedComponent);
                }

                render() {
                    return <RootView {...this.props} />;
                }
            }

            return RootViewWrapper;
        });
    }
}

export default new AppRegistry();
