/**
 * REST client "adapter" for talking to Giphy service.
 */

import * as SyncTasks from 'synctasks';
import { GenericRestClient } from 'simplerestclients';

interface GiphyImageDescriptor {
    height: string;
    width: string;
    url: string;
}

interface GiphyImages {
    fixed_height_downsampled: GiphyImageDescriptor;
    fixed_height_still: GiphyImageDescriptor;
    fixed_height: GiphyImageDescriptor;
    fixed_width_still: GiphyImageDescriptor;
    fixed_width: GiphyImageDescriptor;
    original: GiphyImageDescriptor;
}

interface GiphyDataImage {
    images: GiphyImages;
}

interface GiphySearchResponse {
    data: GiphyDataImage[];
}

export interface GiphySearchResult {
    originalUrl: string;
    smallUrl: string;
}

const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/search';
const GIPHY_API_KEY = 'dc6zaTOxFJmzC';

export class GiphyClient extends GenericRestClient {
    searchImages(query: string, limit: number = 25, offset: number = 0, rating: string = 'g')
            : SyncTasks.Promise<GiphySearchResult[]> {
        const url = this._buildUrl(query, limit, offset, rating);

        return this._performApiCall<GiphySearchResponse>(url, 'GET', undefined, undefined)
            .then(response => {
                if (!response.body || !response.body.data) {
                    return [];
                }

                return response.body.data.map(this._normilizeResponse);
            });
    }

    private _buildUrl = (query: string, limit: number, offset: number, rating: string): string => (
        `?api_key=${ GIPHY_API_KEY }&q=${ encodeURIComponent(query) }&limit=${ limit }&offset=${ offset }&rating=${ rating }`
    )

    private _normilizeResponse = ({ images }: GiphyDataImage): GiphySearchResult => ({
        originalUrl: images.original.url,
        smallUrl: images.fixed_height.url
    })
}

export default new GiphyClient(GIPHY_API_URL);
