/**
* ImageListPanel.tsx
*
* Display first screen of the image list sample application.
*/

import RX = require('reactxp');

import ImageList = require('./ImageList');
import ImageStore from './ImageStore';

interface ImageListPanelState {
    inputValue?: string;
}

const _styles = {
    listContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    }),
    textInput: RX.Styles.createTextInputStyle({
        margin: 12,
        padding: 4,
        borderColor: '#999',
        borderWidth: 1,
        borderStyle: 'solid',
        height: 30,
        fontSize: 16
    }),
    statusSpacer: RX.Styles.createViewStyle({
        marginTop: 22
    })
};

class ImageListPanel extends RX.Component<{}, ImageListPanelState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            inputValue: ''
        };
    }

    render() {
        return (
            <RX.View style={ [_styles.listContainer, RX.StatusBar.isOverlay() && _styles.statusSpacer] }>
                <RX.TextInput
                    style={ _styles.textInput }
                    value={ this.state.inputValue }
                    onChangeText={ this._onTextInputChanged }
                    autoFocus={ true }
                    placeholder={ 'Search for a GIF' }
                />
                <ImageList />
            </RX.View>
        );
    }

    private _onTextInputChanged = (newValue: string) => {
        this.setState({ inputValue: newValue });

        ImageStore.updateImageList(newValue);
    }
}

export = ImageListPanel;
