/**
* PageUrlService.tsx
* Copyright: Microsoft 2018
*
* Monitors the NavigationStore and updates the current URL to reflect
* the current deep link location.
*/

import * as SyncTasks from 'synctasks';

import DeepLinkConverter from '../app/DeepLinkConverter';
import NavContextStore from '../stores/NavContextStore';

class PageUrlService {
    private _handlingPopState = false;
    private _navigatingToNewPlace = false;

    startup() {
        NavContextStore.subscribe(() => this._onNavigationChange());

        // Handle back and forward button actions.
        window.addEventListener('popstate', e => this._onUrlChange(e));

        return SyncTasks.Resolved<void>();
    }

    private _onNavigationChange() {
        // Prevent reentrancy.
        if (!this._handlingPopState) {
            const navContext = NavContextStore.getNavContext();
            const newUrl = DeepLinkConverter.getUrlFromContext(navContext);

            this._navigatingToNewPlace = true;
            window.history.pushState(null, '', newUrl);
            this._navigatingToNewPlace = false;
        }
    }

    private _onUrlChange(e: any) {
        // If the URL is changing because we're programatically changing it, ignore.
        if (this._navigatingToNewPlace) {
            return;
        }

        // Remember that we're popping state. When we navigate, there's no need to push a new state because we're just
        // returning to an existing one on the stack.
        this._handlingPopState = true;

        // Check if we're going back to a previous nav context.
        const navContext = DeepLinkConverter.getContextFromUrl(window.location.href, NavContextStore.isUsingStackNav());
        if (navContext) {
            NavContextStore.setNavContext(navContext);
        }

        // We're done with the navigation change.
        this._handlingPopState = false;
    }
}

export default new PageUrlService();
