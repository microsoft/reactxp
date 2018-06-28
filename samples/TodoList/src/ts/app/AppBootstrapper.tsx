/**
* AppBootstrapper.tsx
* Copyright: Microsoft 2018
*
* Main entry point for the app, common to both native and web.
*/

import { DbProvider } from 'nosqlprovider';
import * as RX from 'reactxp';
import * as SyncTasks from 'synctasks';

import AppConfig from './AppConfig';
import DeepLinkConverter from './DeepLinkConverter';
import LocalDb from './LocalDb';
import NavContextStore from '../stores/NavContextStore';
import PageUrlService from '../services/PageUrlService';
import ResponsiveWidthStore from '../stores/ResponsiveWidthStore';
import RootView from '../views/RootView';
import ServiceManager, { Service } from '../services/ServiceManager';
import ServiceRegistrar from '../services/ServiceRegistrar';
import TodosStore from '../stores/TodosStore';

export default abstract class AppBootstrapper {
    constructor() {
        RX.App.initialize(__DEV__, __DEV__);

        ServiceRegistrar.init();

        // Open the DB and startup any critical services before displaying the UI.
        LocalDb.open(this._getDbProvidersToTry()).then(() => {
            return this._startCriticalServices();
        }).then(() => {
            RX.UserInterface.setMainView(this._renderRootView());

            // Convert the initial URL into a navigation context.
            this._getInitialUrl().then(url => {
                if (url) {
                    let context = DeepLinkConverter.getContextFromUrl(url, NavContextStore.isUsingStackNav());
                    if (context) {
                        NavContextStore.setNavContext(context);
                    }
                }
            });
        });
    }

    private _startCriticalServices(): SyncTasks.Promise<void> {
        let servicesToStart: Service[] = [TodosStore];

        if (AppConfig.getPlatformType() === 'web') {
            servicesToStart.push(PageUrlService);
        }

        return ServiceManager.ensureStarted(servicesToStart);
    }

    private _renderRootView() {
        return (
            <RootView
                onLayout={ this._onLayoutRootView }
            />
        );
    }

    private _onLayoutRootView = (e: RX.Types.ViewOnLayoutEvent) => {
        const { width, height } = e;
        ResponsiveWidthStore.putWindowSize(width, height);
    }

    // Subclasses must override.
    protected abstract _getDbProvidersToTry(): DbProvider[];
    protected abstract _getInitialUrl(): SyncTasks.Promise<string | undefined>;
}
