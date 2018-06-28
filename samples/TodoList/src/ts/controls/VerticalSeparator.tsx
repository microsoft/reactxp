/*
* VerticalSeparator.tsx
* Copyright: Microsoft 2018
*
* A simple vertical line that separates items.
*/

import * as RX from 'reactxp';

import { Colors } from '../app/Styles';

export interface VerticalSeparatorProps {
    style?: RX.Types.StyleRuleSetRecursive<RX.Types.ViewStyle>;
}

const _styles = {
    separator: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        marginVertical: 12,
        marginHorizontal: 8,
        width: 1,
        backgroundColor: Colors.separator
    })
};

export default class VerticalSeparator extends RX.Component<VerticalSeparatorProps, RX.Stateless> {
    render(): JSX.Element | null {
        return (
            <RX.View style={ [_styles.separator, this.props.style] } />
        );
    }
}
