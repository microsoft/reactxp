/**
* Basic store based on ReSub.
*/

import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

import GiphyClient from './GiphyClient';

export interface Image {
    smallUrl: string;
    originalUrl: string;
}

@AutoSubscribeStore
export class ImageStore extends StoreBase {
    private _lastSearchQuery = '';
    private _isSearchPending = false;
    private _searchGenerationCount = 0;
    private _images: Image[] = [];

    @autoSubscribe
    getImageList() {
        return this._images;
    }

    @autoSubscribe
    isPerformingSearch() {
        return this._isSearchPending;
    }

    updateImageList(searchQuery: string) {
        // Capture and bump the generation count. This prevents us
        // from overwriting results with stale information.
        this._searchGenerationCount++;
        const curGenerationCount = this._searchGenerationCount;

        let trimmedQuery = searchQuery.trim();

        // If this is the same as the last query, don't bother.
        if (trimmedQuery === this._lastSearchQuery) {
            return;
        }

        this._lastSearchQuery = trimmedQuery;
        this._images = [];

        // If the query is empty, don't bother with the API call.
        if (trimmedQuery.length === 0) {
            this.trigger();
            return;
        }

        this._isSearchPending = true;
        this.trigger();

        // Perform an async call to the Giphy service.
        GiphyClient.searchImages(searchQuery).then(images => {
            // If the results are not associated with the latest search,
            // discard them.
            if (curGenerationCount === this._searchGenerationCount) {
                this._images = images.map(image => {
                    return {
                        smallUrl: image.smallUrl,
                        originalUrl: image.originalUrl
                    };
                });

                this._isSearchPending = false;
                this.trigger();
            }
        }).catch(error => {
            this._isSearchPending = false;
            this.trigger();
        });
    }
}

export default new ImageStore();
