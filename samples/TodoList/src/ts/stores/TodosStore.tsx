/**
* TodosStore.tsx
* Copyright: Microsoft 2017
*
* Resub Basic Example https://github.com/Microsoft/ReSub
*/

import * as _ from 'lodash';
import { autoSubscribe, AutoSubscribeStore, StoreBase } from 'resub';

import LocalDb from '../app/LocalDb';
import { Todo } from '../models/TodoModels';

@AutoSubscribeStore
class TodosStore extends StoreBase {
    private _todos: Todo[] = [];

    startup() {
        return LocalDb.getAllTodos().then(todos => {
            this._todos = todos;
        });
    }

    addTodo(todoText: string) {
        const now = Date.now().valueOf();
        let newTodo: Todo = {
            id: now.toString(),
            creationTime: now,
            text: todoText,
            _searchTerms: todoText
        };

        this._todos = this._todos.concat(newTodo);

        // Asynchronously write the new todo item to the DB.
        LocalDb.putTodo(newTodo);

        this.trigger();

        return newTodo;
    }

    @autoSubscribe
    getTodos() {
        return this._todos;
    }

    @autoSubscribe
    getTodoById(todoId: string) {
        return _.find(this._todos, todo => todo.id === todoId);
    }

    deleteTodo(todoId: string) {
        this._todos = _.filter(this._todos, todo => todo.id !== todoId);
        this.trigger();
    }
}

export default new TodosStore();
