/**
* AppBootstrapperWeb.tsx
* Copyright: Microsoft 2018
*
* Main entry point for the web app.
*/

// Do shimming before anything else.
import * as ShimHelpers from '../utilities/ShimHelpers';
ShimHelpers.shimEnvironment(__DEV__, false);

// Initialize AppConfig.
import AppConfig from './AppConfig';
const appVersionElement = document.getElementById('appVersion')!;
const appVersion = (appVersionElement as HTMLInputElement).value;
appVersionElement.parentElement!.removeChild(appVersionElement);
AppConfig.initialize({
    appVersion
});

import { DbProvider } from 'nosqlprovider';
import { IndexedDbProvider } from 'nosqlprovider/dist/IndexedDbProvider';
import { InMemoryProvider } from 'nosqlprovider/dist/InMemoryProvider';
import { WebSqlProvider } from 'nosqlprovider/dist/WebSqlProvider';
import * as SyncTasks from 'synctasks';

import AppBootstrapper from './AppBootstrapper';

class AppBootstrapperWeb extends AppBootstrapper {
    protected _getDbProvidersToTry(): DbProvider[] {
        // Specify the DB providers that are valid on browser platforms.
        return [
            new IndexedDbProvider(),
            new WebSqlProvider(),
            new InMemoryProvider()
        ];
    }

    protected _getInitialUrl(): SyncTasks.Promise<string | undefined> {
        return SyncTasks.Resolved(window.location.href);
    }
}

export default new AppBootstrapperWeb();
