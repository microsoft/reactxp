/**
 * ImageListPanel.tsx
 *
 * Display first screen of the image list sample application.
 */

import * as RX from 'reactxp';

export interface SearchFieldProps {
    onChange: (value: string) => void;
}

interface SearchFieldState {
    value: string;
}

const _styles = {
    input: RX.Styles.createTextInputStyle({
        borderStyle: 'solid',
        borderColor: '#999',
        borderWidth: 1,
        fontSize: 16,
        padding: 5,
        margin: 10,
        height: 30
    })
};

export class SearchField extends RX.Component<SearchFieldProps, SearchFieldState> {
    readonly state: SearchFieldState = { value: '' };

    render() {
        return (
            <RX.TextInput
                accessibilityId={ 'SearchFieldInput' }
                placeholder={ 'Search for a GIF' }
                autoFocus={ true }
                style={ _styles.input }
                value={ this.state.value }
                onChangeText={ this._handleChangeText }
            />
        );
    }

    private _handleChangeText = (value: string) => (
        this.setState({ value }, () => this.props.onChange(value))
    )
}

export default SearchField;
