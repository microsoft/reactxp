/*
* REST client "adapter" for talking to Giphy service.
*/

import { GenericRestClient } from 'simplerestclients';
import SyncTasks = require('synctasks');

interface GiphyImageDescriptor {
    url: string;
    width: string;
    height: string;
}

interface GiphySearchResponse {
    data: {
        images: {
            fixed_height: GiphyImageDescriptor;
            fixed_height_still: GiphyImageDescriptor;
            fixed_height_downsampled: GiphyImageDescriptor;
            fixed_width: GiphyImageDescriptor;
            fixed_width_still: GiphyImageDescriptor;
            original: GiphyImageDescriptor;
        }
    }[];
}

export interface GiphySearchResult {
    smallUrl: string;
    originalUrl: string;
}

const _giphyApiUrl = 'https://api.giphy.com/v1/gifs/search';

export class GiphyClient extends GenericRestClient {
    searchImages(queryTerm: string, limitCount: number = 25, offset: number = 0, rating: string = 'g'): 
            SyncTasks.Promise<GiphySearchResult[]> {

        const url: string =
            '?api_key=dc6zaTOxFJmzC' +
            '&q=' + encodeURIComponent(queryTerm) +
            '&limit=' + limitCount.toString() +
            '&offset=' + offset.toString() +
            '&rating=' + rating;
        return this._performApiCall<GiphySearchResponse>(url, 'GET', undefined, undefined).then(response => {
            if (!response.body || !response.body.data) {
                return [];
            }

            return response.body.data.map(image => {
                return {
                    smallUrl: image.images.fixed_height.url,
                    originalUrl: image.images.original.url
                };
            });
        });
    }
}

export default new GiphyClient(_giphyApiUrl);
