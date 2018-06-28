/*
* NavActions.tsx
* Copyright: Microsoft 2018
*
* Constructs navigation contexts.
*/

import * as NavModels from '../models/NavModels';

export default class NavActions {
    static createTodoListContext(useStackNav: boolean, selectedTodoId?: string, showNewTodoPanel = false) {
        if (useStackNav) {
            let navContext = new NavModels.StackRootNavContext();
            navContext.stack.push(new NavModels.TodoListViewNavContext(selectedTodoId));
            if (showNewTodoPanel) {
                navContext.stack.push(new NavModels.NewTodoViewNavContext());
            } else if (selectedTodoId !== undefined) {
                navContext.stack.push(new NavModels.ViewTodoViewNavContext(selectedTodoId));
            }
            return navContext;
        } else {
            return new NavModels.TodoRootNavContext(selectedTodoId, showNewTodoPanel);
        }
    }
}
