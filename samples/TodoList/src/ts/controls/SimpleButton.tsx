/*
* SimpleButton.tsx
* Copyright: Microsoft 2018
*
* A "classic" button with text as a label.
*/

import * as RX from 'reactxp';

import HoverButton from './HoverButton';
import { Colors, Fonts, FontSizes } from '../app/Styles';

export interface SimpleButtonProps {
    onPress?: (e: RX.Types.SyntheticEvent) => void;
    title?: string;
    text: string;
    disabled?: boolean;

    textStyle?: RX.Types.StyleRuleSetRecursive<RX.Types.TextStyle>;
    textHoverStyle?: RX.Types.StyleRuleSetRecursive<RX.Types.TextStyle>;
    buttonStyle?: RX.Types.StyleRuleSetRecursive<RX.Types.ViewStyle>;
    buttonHoverStyle?: RX.Types.StyleRuleSetRecursive<RX.Types.ViewStyle>;
}

const _styles = {
    button: RX.Styles.createViewStyle({
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: Colors.simpleButtonBackground,
        borderColor: Colors.simpleButtonBorder
    }),
    buttonHover: RX.Styles.createViewStyle({
        backgroundColor: Colors.simpleButtonBackgroundHover
    }),
    text: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        color: Colors.simpleButtonText
    }),
    textHover: RX.Styles.createTextStyle({
        color: Colors.simpleButtonTextHover
    })
};

export default class SimpleButton extends RX.Component<SimpleButtonProps, RX.Stateless> {
    render(): JSX.Element | null {
        return (
            <HoverButton
                title={ this.props.title }
                disabled={ this.props.disabled }
                onPress={ this.props.onPress }
                onRenderChild={ this._onRenderButton }
            />
        );
    }

    private _onRenderButton = (isHovering: boolean) => {
        let buttonStyles = [_styles.button, this.props.buttonStyle];
        let textStyles = [_styles.text, this.props.textStyle];
        if (isHovering) {
            buttonStyles.push(_styles.buttonHover);
            buttonStyles.push(this.props.buttonHoverStyle);
            textStyles.push(_styles.textHover);
            textStyles.push(this.props.textHoverStyle);
        }

        return (
            <RX.View style={ buttonStyles }>
                <RX.Text style={ textStyles }>
                    { this.props.text }
                </RX.Text>
            </RX.View>
        );
    }
}
