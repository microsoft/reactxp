/*
* Main entry point for sample to-do app.
* Web-specific code.
*/

import { IndexedDbProvider } from 'nosqlprovider/dist/IndexedDbProvider';
import { InMemoryProvider } from 'nosqlprovider/dist/InMemoryProvider';
import NoSqlProvider = require('nosqlprovider');
import { WebSqlProvider } from 'nosqlprovider/dist/WebSqlProvider';

import TodoApp = require('./TodoApp');

class TodoAppWeb extends TodoApp {
    protected _getDbProvidersToTry(): NoSqlProvider.DbProvider[] {
        // Specify the DB providers that are valid on browser platforms.
        return [
            new IndexedDbProvider(),
            new WebSqlProvider(),
            new InMemoryProvider()
        ];
    }
}

export = new TodoAppWeb();

