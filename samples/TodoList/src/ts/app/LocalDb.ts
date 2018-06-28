/**
* LocalDb.tsx
* Copyright: Microsoft 2018
*
* Local database implementation and interface for the app.
*/

import { DbProvider, DbSchema } from 'nosqlprovider';
import * as SyncTasks from 'synctasks';

import * as TodoModels from '../models/TodoModels';

// The actual value is just a string, but the type system can extract this extra info.
type DBStore<Name extends string, ObjectType, KeyFormat> = string & { name?: Name, objectType?: ObjectType, keyFormat?: KeyFormat };
type DBIndex<Store extends DBStore<string, any, any>, IndexKeyFormat> = string & { store?: Store, indexKeyFormat?: IndexKeyFormat };

const _appDatabaseName = 'todoDb';
const _appSchemaVersion = 1;
const Stores = {
    todoItems: 'todoItems_v1' as DBStore<'TodoItemsStore', TodoModels.Todo, string>
};
const Indexes = {
    todoSearchTerms: 'todoItems_searchTerms_v1' as DBIndex<typeof Stores.todoItems, string>
};

const _appSchema: DbSchema = {
    version: _appSchemaVersion,
    lastUsableVersion: _appSchemaVersion,
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
    private _db: DbProvider | undefined;

    open(providersToTry: DbProvider[]): SyncTasks.Promise<void> {
        return this._openListOfProviders(providersToTry, _appDatabaseName, _appSchema).then(prov => {
            this._db = prov;
        });
    }

    private _openListOfProviders(providersToTry: DbProvider[], dbName: string, schema: DbSchema):
            SyncTasks.Promise<DbProvider> {

        const task = SyncTasks.Defer<DbProvider>();
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
        if (!this._db) {
            return SyncTasks.Rejected('Database not open');
        }

        return this._db.openTransaction([Stores.todoItems], false).then(tx => {
            return tx.getStore(Stores.todoItems);
        }).then(store => {
            return store.openPrimaryKey().getAll() as SyncTasks.Promise<TodoModels.Todo[]>;
        }).fail(this._handleDbFail);
    }

    // Adds a new todo item to the DB.
    putTodo(todo: TodoModels.Todo): SyncTasks.Promise<void> {
        if (!this._db) {
            return SyncTasks.Rejected('Database not open');
        }

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
    }
}

export default new LocalDb();
