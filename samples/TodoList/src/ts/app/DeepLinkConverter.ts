/*
* DeepLinkConverter.tsx
* Copyright: Microsoft 2018
*
* Converts between app (deep-link) URLs and navigation contexts.
*/

import * as assert from 'assert';
import * as _ from 'lodash';

import AppConfig from './AppConfig';
import NavActions from '../app/NavActions';
import * as NavModels from '../models/NavModels';

export default class DeepLinkConverter {
    static getUrlFromContext(context: NavModels.RootNavContext): string {
        let url = AppConfig.getFrontendBaseUrl();

        if (context.isStackNav) {
            const stackContext = context as NavModels.StackRootNavContext;
            const topViewContext = stackContext.stack[stackContext.stack.length - 1];

            if (topViewContext instanceof NavModels.TodoListViewNavContext) {
                url += '/todos';
                return url;
            } else if (topViewContext instanceof NavModels.ViewTodoViewNavContext) {
                url += '/todos?selected=' + encodeURIComponent(topViewContext.todoId);
                return url;
            } else if (topViewContext instanceof NavModels.NewTodoViewNavContext) {
                url += '/todos?selected=new';
                return url;
            }
        } else {
            let compositeContext = context as NavModels.CompositeRootNavContext;
            if (compositeContext instanceof NavModels.TodoRootNavContext) {
                url += '/todos';
                let todoListContext = context as NavModels.TodoRootNavContext;
                if (todoListContext.showNewTodoPanel) {
                    url += '?selected=new';
                } else if (todoListContext.todoList.selectedTodoId) {
                    url += '?selected=' + encodeURIComponent(todoListContext.todoList.selectedTodoId);
                }
                return url;
            } else {
                // TODO - need to implement
                assert.fail('Unimplemented');
            }
        }

        return '';
    }

    static getContextFromUrl(url: string, isStackNav: boolean): NavModels.RootNavContext | undefined {
        let urlObj = new URL(url);
        if (!urlObj) {
            return undefined;
        }

        let pathElements = _.map(_.split(urlObj.pathname, '/'), elem => decodeURIComponent(elem));
        if (pathElements.length < 2) {
            return undefined;
        }

        switch (pathElements[1]) {
            case 'todos':
                let selectedTodoId: string | undefined;
                let showNewPanel = false;

                let selectedValue = urlObj.searchParams.get('selected');
                if (selectedValue === 'new') {
                    showNewPanel = true;
                } else if (selectedValue) {
                    selectedTodoId = selectedValue;
                }

                return NavActions.createTodoListContext(isStackNav, selectedTodoId, showNewPanel);

            default:
                assert.fail('Unimplemented');
                return undefined;
        }
    }
}
