/**
* AppBootstrapperNative.tsx
* Copyright: Microsoft 2018
*
* Main entry point for the native app.
*/

// Do shimming before anything else.
import * as ShimHelpers from '../utilities/ShimHelpers';
ShimHelpers.shimEnvironment(__DEV__, true);

// Initialize AppConfig.
import AppConfig from './AppConfig';
AppConfig.initialize({});

import { DbProvider } from 'nosqlprovider';
import { CordovaNativeSqliteProvider } from 'nosqlprovider/dist/CordovaNativeSqliteProvider';
import { InMemoryProvider } from 'nosqlprovider/dist/InMemoryProvider';
import * as RX from 'reactxp';
import * as SyncTasks from 'synctasks';

import AppBootstrapper from './AppBootstrapper';

class AppBootstrapperNative extends AppBootstrapper {
    protected _getDbProvidersToTry(): DbProvider[] {
        let rnSqliteProvider = require('react-native-sqlite-storage');

        // Specify the DB providers that are valid on the RN platforms.
        return [
            new CordovaNativeSqliteProvider(rnSqliteProvider),
            new InMemoryProvider()
        ];
    }

    protected _getInitialUrl(): SyncTasks.Promise<string | undefined> {
        return RX.Linking.getInitialUrl();
    }
}

export default new AppBootstrapperNative();
