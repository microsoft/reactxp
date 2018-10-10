/**
 * Displays a simple list of images.
 */

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';
import { VirtualListView, VirtualListViewItemInfo } from 'reactxp-virtuallistview';

import ImageStore, { Image } from '../stores/ImageStore';

interface ImageListItemInfo extends VirtualListViewItemInfo {
    image: Image;
}

interface ImageListState {
    isPerformingSearch: boolean;
    isFirstSearch: boolean;
    searchQuery: string;
    images: ImageListItemInfo[];
}

const _itemHeight = 120;

const _styles = {
    list: RX.Styles.createViewStyle({
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignSelf: 'stretch',
        margin: 0
    }),
    row: RX.Styles.createViewStyle({
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        height: _itemHeight
    }),
    image: RX.Styles.createImageStyle({
        height: 100,
        width: 133
    }),
    main: RX.Styles.createViewStyle({
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1
    }),
    labelText: RX.Styles.createTextStyle({
        textAlign: 'center',
        fontSize: 30
    }),
    linkText: RX.Styles.createLinkStyle({
        padding: 12,
        fontSize: 14,
        color: 'blue',
        flex: -1
    }),
    searchQueryText: RX.Styles.createTextStyle({
        fontWeight: 'bold',
        fontSize: 30
    })
};

export class ImageList extends ComponentBase<{}, ImageListState> {
    render() {
        const { isPerformingSearch, isFirstSearch, searchQuery, images } = this.state;

        // If the search is pending, render a spinner.
        if (isPerformingSearch) {
            return (
                <RX.View style={ _styles.main }>
                    <RX.ActivityIndicator color={ '#ccc' } size={ 'large' } />
                </RX.View>
            );
        }

        if (!isFirstSearch && !images.length && searchQuery) {
            return (
                <RX.View style={ _styles.main }>
                    <RX.Text style={ _styles.labelText }>
                        No Results for <RX.Text style={ _styles.searchQueryText }>{ searchQuery }</RX.Text>
                    </RX.Text>
                </RX.View>
            );
        }

        return (
            <VirtualListView
                itemList={ images }
                style={ _styles.list }
                renderItem={ this._renderItem }
            />
        );
    }

    protected _buildState(): ImageListState {
        return {
            isPerformingSearch: ImageStore.isPerformingSearch(),
            isFirstSearch: ImageStore.isFirstSearch(),
            searchQuery: ImageStore.getSearchQuery(),
            images: ImageStore.getImages().map(this._normilizeImage)
        };
    }

    private _renderItem = (item: ImageListItemInfo) => {
        return (
            <RX.View style={ _styles.row }>
                <RX.Image
                    resizeMode={ 'cover' }
                    source={ item.image.smallUrl }
                    style={ _styles.image }
                />

                <RX.Link style={ _styles.linkText } url={ item.image.originalUrl }>
                    { item.image.originalUrl }
                </RX.Link>
            </RX.View>
        );
    }

    private _normilizeImage = (image: Image) => ({
        template: 'image',
        height: _itemHeight,
        image,
        key: image.smallUrl
    })
}

export default ImageList;
