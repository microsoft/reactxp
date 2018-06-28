/**
* NavModels.ts
* Copyright: Microsoft 2018
*
* Interface and enumeration definitions used for app navigation.
* A "navigation context" describes a location within the app and
* any associated state that may be expressed within a deep link.
*
* A "view nav context" describes the state of a view.
*
* A "root nav context" describes the nav context for the app's
* root view - the top of the visual hierarchy. Depending on the
* screen size, the root nav context may be stack-based (consisting
* of a stack of individual panels) or composite (in which multiple
* views are displayed side by side).
*/

import * as _ from 'lodash';

export enum NavViewId {
    TodoComposite = 1,
    TodoList,
    NewTodo,
    ViewTodo
}

//----------------------------------------
// Root nav contexts
//----------------------------------------
export abstract class RootNavContext {
    constructor(public isStackNav: boolean) {
    }

    abstract clone(): RootNavContext;
}

export abstract class CompositeRootNavContext extends RootNavContext {
    constructor(public viewId: NavViewId) {
        super(false);
    }
}

export class StackRootNavContext extends RootNavContext {
    stack: ViewNavContext[];

    constructor() {
        super(true);
        this.stack = [];
    }

    clone(): StackRootNavContext {
        let clone = new StackRootNavContext();
        _.each(this.stack, navContext => {
            clone.stack.push(navContext.clone());
        });
        return clone;
    }
}

export class TodoRootNavContext extends CompositeRootNavContext {
    todoList: TodoListViewNavContext;

    constructor(selectedTodoId?: string, public showNewTodoPanel = false) {
        super(NavViewId.TodoComposite);
        this.todoList = new TodoListViewNavContext(selectedTodoId);
    }

    clone(): TodoRootNavContext {
        return new TodoRootNavContext(this.todoList.selectedTodoId, this.showNewTodoPanel);
    }
}

//----------------------------------------
// View nav contexts
//----------------------------------------

export abstract class ViewNavContext {
    constructor(public viewId: NavViewId) {
    }

    abstract clone(): ViewNavContext;
}

export class TodoListViewNavContext extends ViewNavContext {
    constructor(public selectedTodoId?: string) {
        super(NavViewId.TodoList);
    }

    clone(): TodoListViewNavContext {
        return new TodoListViewNavContext(this.selectedTodoId);
    }
}

export class NewTodoViewNavContext extends ViewNavContext {
    constructor() {
        super(NavViewId.NewTodo);
    }

    clone(): NewTodoViewNavContext {
        return new NewTodoViewNavContext();
    }
}

export class ViewTodoViewNavContext extends ViewNavContext {
    constructor(public todoId: string) {
        super(NavViewId.ViewTodo);
    }

    clone(): ViewTodoViewNavContext {
        return new ViewTodoViewNavContext(this.todoId);
    }
}
