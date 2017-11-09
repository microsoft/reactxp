/*
* Main entry point for sample to-do app.
*/

import NoSqlProvider = require('nosqlprovider');
import RX = require('reactxp');

import LocalDb = require('./LocalDb');
import SyncTasks = require('synctasks');
import TodoAppRootView = require('./TodoAppRootView');
import TodosStore = require('./TodosStore');

abstract class TodoApp {
    init() {
        RX.App.initialize(true, true);

        // Open the DB and initialize all stores before displaying the UI.
        LocalDb.open(this._getDbProvidersToTry()).then(() => {
            return this._initStores();
        }).then(() => {
            RX.UserInterface.setMainView(this._renderRootView());
        });
    }

    // Subclasses must override.
    protected abstract _getDbProvidersToTry(): NoSqlProvider.DbProvider[];

    private _initStores() {
        let tasks = [TodosStore.init()];

        // Wait for all the stores in the app to initialize.
        return SyncTasks.all(tasks);
    }

    private _renderRootView() {
        return (
            <TodoAppRootView />
        );
    }
}

export = TodoApp;

