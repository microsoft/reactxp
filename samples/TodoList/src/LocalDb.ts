/*
* Local database implementation for Todo sample app.
*/

import NoSqlProvider = require('nosqlprovider');
import SyncTasks = require('synctasks');

import TodoModels = require('./TodoModels');

// The actual value is just a string, but the type system can extract this extra info.
type DBStore<Name extends string, ObjectType, KeyFormat> = string & { name?: Name, objectType?: ObjectType, keyFormat?: KeyFormat };
type DBIndex<Store extends DBStore<string, any, any>, IndexKeyFormat> = string & { store?: Store, indexKeyFormat?: IndexKeyFormat };

const _todoDatabaseName = 'todoDb';
const _todoSchemaVersion = 1;
const Stores = {
    todoItems: 'todoItems_v1' as DBStore<'TodoItemsStore', TodoModels.Todo, string>
};
const Indexes = {
    todoSearchTerms: 'todoItems_searchTerms_v1' as DBIndex<typeof Stores.todoItems, string>
};

const _todoSchema: NoSqlProvider.DbSchema = {
    version: _todoSchemaVersion,
    lastUsableVersion: _todoSchemaVersion,
    stores: [
        {
            name: Stores.todoItems,
            primaryKeyPath: 'id',
            indexes: [
                {
                    name: Indexes.todoSearchTerms,
                    keyPath: '_searchTerms',
                    fullText: true
                }
            ]
        }
    ]
};

class LocalDb {
    private _db: NoSqlProvider.DbProvider;

    open(providersToTry: NoSqlProvider.DbProvider[]): SyncTasks.Promise<void> {
        return this._openListOfProviders(providersToTry, _todoDatabaseName, _todoSchema).then(prov => {
            this._db = prov;
        });
    }

    private _openListOfProviders(providersToTry: NoSqlProvider.DbProvider[], dbName: string, schema: NoSqlProvider.DbSchema):
            SyncTasks.Promise<NoSqlProvider.DbProvider> {

        const task = SyncTasks.Defer<NoSqlProvider.DbProvider>();
        let providerIndex = 0;
        let errorList: any[] = [];

        console.log('Opening Database: Providers: ' + providersToTry.length);

        const tryNext = () => {
            if (providerIndex >= providersToTry.length) {
                task.reject(errorList.length <= 1 ? errorList[0] : errorList);
                return;
            }

            let provider = providersToTry[providerIndex];
            provider.open(dbName, schema, false, false).then(() => {
                console.log('Provider ' + providerIndex + ': Open Success!');
                task.resolve(provider);
            }, err => {
                console.error('Provider ' + providerIndex + ': Open Failure: ' + JSON.stringify(err));
                errorList.push(err);
                providerIndex++;
                tryNext();
            });
        };

        tryNext();

        return task.promise();
    }

    // Returns all todo items from the DB.
    getAllTodos(): SyncTasks.Promise<TodoModels.Todo[]> {
        return this._db.openTransaction([Stores.todoItems], false).then(tx => {
            return tx.getStore(Stores.todoItems);
        }).then(store => {
            return store.openPrimaryKey().getAll();
        }).fail(this._handleDbFail);
    }

    // Adds a new todo item to the DB.
    putTodo(todo: TodoModels.Todo): SyncTasks.Promise<void> {
        return this._db.openTransaction([Stores.todoItems], true).then(tx => {
            return tx.getStore(Stores.todoItems);
        }).then(store => {
            return store.put(todo);
        }).fail(this._handleDbFail);
    }

    private _handleDbFail = (err: any) => {
        if (err.target) {
            if (err.target.error) {
                const error = err.target.error;
                console.error(`IDBRequest: ${error.name}: ${error.message}`);
            }
            if (err.target.transaction && err.target.transaction.error) {
                const error = err.target.transaction.error;
                console.error(`IDBTransaction: ${error.name}: ${error.message}`);
            }
            if (err.target.source) {
                const source = err.target.source;
                console.error(`IDBStore: ${source.name}, ${source.keyPath}, indexes: ${source.indexNames.join()}`);
            }
        }
    };
}


export = new LocalDb();


