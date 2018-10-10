/**
 * Basic store based on ReSub.
 */

import * as SyncTasks from 'synctasks';
import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

import GiphyClient from '../services/GiphyClient';

export interface Image {
    originalUrl: string;
    smallUrl: string;
}

@AutoSubscribeStore
export class ImageStore extends StoreBase {
    private _isSearchPending = false;
    private _isFirstSearch = true;
    private _lastSearchQuery = '';
    private _searchQuery = '';
    private _images: Image[] = [];

    private _request: SyncTasks.STPromise<void> | null = null;

    @autoSubscribe
    getImages() {
        return this._images;
    }

    @autoSubscribe
    getSearchQuery() {
        return this._searchQuery;
    }

    @autoSubscribe
    isPerformingSearch() {
        return this._isSearchPending;
    }

    @autoSubscribe
    isFirstSearch() {
        return this._isFirstSearch;
    }

    updateImages(searchQuery: string) {
        const searchQueryTrimmed = searchQuery.trim();
        this._searchQuery = searchQuery;

        if (this._shouldSkipSearch(searchQueryTrimmed)) {
            return;
        }

        this._isFirstSearch = false;
        this._lastSearchQuery = searchQueryTrimmed;
        this._images = [];

        // If the query is empty, don't bother with the API call.
        if (!searchQuery) {
            this._cancelPreviousSearch();
            this.trigger();
            return;
        }

        this._isSearchPending = true;
        this.trigger();

        this._cancelPreviousSearch();
        this._request = this._searchImages(searchQuery);
    }

    private _searchImages(query: string): SyncTasks.STPromise<void> {
        return GiphyClient.searchImages(query)
            .then(images => {
                this._images = images;
                this._isSearchPending = false;
                this.trigger();
            })
            .catch(({ canceled }) => {
                if (!canceled) {
                    this._isSearchPending = false;
                    this.trigger();
                }
            });
    }

    private _cancelPreviousSearch(): void {
        if (this._request) {
            this._request.cancel();
            this._request = null;
        }
    }

    // If this is the same as the last query or initial query is empty - don't bother.
    private _shouldSkipSearch(query: string): boolean {
        return (!query && !this._images.length) || (query === this._lastSearchQuery);
    }
}

export default new ImageStore();
