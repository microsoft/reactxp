/**
* TodosStore.tsx
* Copyright: Microsoft 2017
*
* Resub Basic Example https://github.com/Microsoft/ReSub
*/

import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

import LocalDb = require('./LocalDb');
import TodoModels = require('./TodoModels');

@AutoSubscribeStore
class TodosStore extends StoreBase {
    private _todos: TodoModels.Todo[] = [];

    init() {
        return LocalDb.getAllTodos().then(todos => {
            this._todos = todos;
        });
    }

    addTodo(todoText: string) {
        const now = Date.now().valueOf();
        let newTodo: TodoModels.Todo = {
            id: now.toString(),
            creationTime: now,
            text: todoText,
            _searchTerms: todoText
        }

        this._todos = this._todos.concat(newTodo);

        // Asynchronously write the new todo item to the DB.
        LocalDb.putTodo(newTodo);

        this.trigger();
    }

    @autoSubscribe
    getTodos() {
        return this._todos;
    }
}

export = new TodosStore();