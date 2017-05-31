/**
* TodosStore.tsx
* Copyright: Microsoft 2017
*
* Resub Basic Example https://github.com/Microsoft/ReSub
*/

import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

@AutoSubscribeStore
class TodosStore extends StoreBase {
    private _todos: string[] = [];

    addTodo(todo: string) {
        this._todos = this._todos.concat(todo);
        this.trigger();
    }

    @autoSubscribe
    getTodos() {
        return this._todos;
    }
}

export = new TodosStore();