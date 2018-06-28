/**
* NavContextStore.ts
* Copyright: Microsoft 2018
*
* In-memory singleton store that tracks the current navigation context.
*/

import * as assert from 'assert';
import * as RX from 'reactxp';
import { autoSubscribe, AutoSubscribeStore, disableWarnings, StoreBase } from 'resub';

import NavActions from '../app/NavActions';
import * as NavModels from '../models/NavModels';
import { ResponsiveWidth, WidthBreakPoints } from '../models/ResponsiveWidthModels';
import ResponsiveWidthStore from '../stores/ResponsiveWidthStore';

@AutoSubscribeStore
export class NavContextStore extends StoreBase {
    private _navContext: NavModels.RootNavContext;
    private _isUsingStackNav = false;

    constructor() {
        super();

        // Subscribe for changes to the responsive width.
        this._isUsingStackNav = this._shouldUseStackNavigation();
        ResponsiveWidthStore.subscribe(() => {
            const useStackNav = this._shouldUseStackNavigation();
            if (useStackNav !== this._isUsingStackNav) {
                this._isUsingStackNav = useStackNav;

                // Force navigation to the top level. This will also trigger
                // a subscription change event.
                this.navigateToTodoList();
            }
        });

        if (this._isUsingStackNav) {
            let stackNavContext = new NavModels.StackRootNavContext();
            stackNavContext.stack.push(new NavModels.TodoListViewNavContext());
            this._navContext = stackNavContext;
        } else {
            this._navContext = new NavModels.TodoRootNavContext();
        }
    }

    @disableWarnings
    private _shouldUseStackNavigation(): boolean {
        // Never use stack navigation on desktop platforms.
        const platformType = RX.Platform.getType();
        if (platformType === 'macos' || platformType === 'windows') {
            return false;
        }

        if (ResponsiveWidthStore.isHeightSmallerThanThresholdNoSubscription(WidthBreakPoints.small) &&
            ResponsiveWidthStore.isWidthSmallerThanThresholdNoSubscription(WidthBreakPoints.small)) {
            return true;
        }

        if (ResponsiveWidthStore.getResponsiveWidth() <= ResponsiveWidth.Small) {
            return true;
        }

        return false;
    }

    @autoSubscribe
    getNavContext(): NavModels.RootNavContext {
        return this._navContext;
    }

    setNavContext(newContext: NavModels.RootNavContext) {
        this._navContext = newContext;

        // Notify all subscribers that the nav context changed.
        this.trigger();
    }

    // Indicates whether the app is currently using stack-based navigation
    // mode or "composite" navigation.
    @autoSubscribe
    isUsingStackNav(): boolean {
        return this._isUsingStackNav;
    }

    navigateToTodoList(selectedTodoId?: string, showNewTodoPanel = false) {
        this.setNavContext(NavActions.createTodoListContext(this._isUsingStackNav, selectedTodoId, showNewTodoPanel));
    }

    popNavigationStack() {
        assert.ok(this._navContext.isStackNav);
        let stackContext = this._navContext.clone() as NavModels.StackRootNavContext;
        assert.ok(stackContext.stack.length >= 2);
        stackContext.stack.pop();
        this.setNavContext(stackContext);
    }
}

export default new NavContextStore();
