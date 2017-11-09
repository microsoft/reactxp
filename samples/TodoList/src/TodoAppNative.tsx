/*
* Main entry point for sample to-do app.
* RN-specific code.
*/

import { CordovaNativeSqliteProvider } from 'nosqlprovider/dist/CordovaNativeSqliteProvider';
import { InMemoryProvider } from 'nosqlprovider/dist/InMemoryProvider';
import NoSqlProvider = require('nosqlprovider');

import TodoApp = require('./TodoApp');

class TodoAppWeb extends TodoApp {
    protected _getDbProvidersToTry(): NoSqlProvider.DbProvider[] {
        let rnSqliteProvider = require('react-native-sqlite-storage');

        // Specify the DB providers that are valid on the RN platforms.
        return [
            new CordovaNativeSqliteProvider(rnSqliteProvider),
            new InMemoryProvider()
        ];
    }
}

export = new TodoAppWeb();

