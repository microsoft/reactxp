/**
* Displays a simple list of images.
*/

import RX = require('reactxp');
import { ComponentBase } from 'resub';
import { VirtualListView, VirtualListViewItemInfo } from 'reactxp-virtuallistview';

import { default as ImageStore, Image } from './ImageStore';

interface ImageListItemInfo extends VirtualListViewItemInfo {
    image: Image;
}

interface ImageListState {
    isPerformingSearch?: boolean;
    imageItems?: ImageListItemInfo[];
}

const _itemHeight = 100;

const _styles = {
    listScroll: RX.Styles.createViewStyle({
        flexDirection: 'column',
        alignSelf: 'stretch',
        backgroundColor: 'white'
    }),
    itemCell: RX.Styles.createViewStyle({
        flex: 1,
        flexDirection: 'row',
        height: _itemHeight,
        alignItems: 'center'
    }),
    image: RX.Styles.createImageStyle({
        height: 100,
        width: 133
    }),
    spinnerContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    }),
    linkText: RX.Styles.createLinkStyle({
        flex: -1,
        fontSize: 14,
        color: 'blue',
        padding: 12
    })
};

class ImageList extends ComponentBase<{}, ImageListState> {
    protected _buildState(props: {}, initialBuild: boolean): ImageListState {
        return {
            isPerformingSearch: ImageStore.isPerformingSearch(),
            imageItems: ImageStore.getImageList().map(image => {
                return {
                    key: image.smallUrl,
                    height: _itemHeight,
                    template: 'image',
                    image: image
                };
            })
        };
    }

    render() {
        // If the search is pending, render a spinner.
        if (this.state.isPerformingSearch) {
            return (
                <RX.View style={ _styles.spinnerContainer }>
                    <RX.ActivityIndicator color={ '#ccc' } size={ 'large' }/>
                </RX.View>
            );
        }

        return (
            <VirtualListView
                itemList={ this.state.imageItems }
                renderItem={ this._renderItem }
                style={ _styles.listScroll }
            />
        );
    }

    private _renderItem = (item: ImageListItemInfo, hasFocus?: boolean) => {
        return (
            <RX.View style={ _styles.itemCell }>
                <RX.Image
                    style={ _styles.image }
                    source={ item.image.smallUrl }
                    resizeMode={ 'cover' }
                />
                <RX.Link style={ _styles.linkText } url={ item.image.originalUrl }>
                    { item.image.originalUrl }
                </RX.Link>
            </RX.View>
        );
    }
}

export = ImageList;
