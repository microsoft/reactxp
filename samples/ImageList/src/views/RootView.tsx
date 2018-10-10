/**
 * RootView.tsx
 *
 * Display first screen of the image list sample application.
 */

import * as RX from 'reactxp';

import ImageStore from '../stores/ImageStore';
import SearchField from '../controls/SearchField';
import ImageList from './ImageList';

const _styles = {
    main: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        flex: 1
    }),
    images: RX.Styles.createViewStyle({
        marginTop: 10,
        padding: 10,
        alignSelf: 'stretch',
        flex: 1
    }),
    statusSpacer: RX.Styles.createViewStyle({
        marginTop: 22
    })
};

class RootView extends RX.Component {
    render() {
        return (
            <RX.View
                useSafeInsets={ true }
                style={ [_styles.main, RX.StatusBar.isOverlay() ? _styles.statusSpacer : undefined] }
            >
                <SearchField onChange={ this._updateImages } />
                <RX.View style={ _styles.images }>
                    <ImageList />
                </RX.View>
            </RX.View>
        );
    }

    private _updateImages = (query: string) => (
        ImageStore.updateImages(query)
    )
}

export default RootView;
