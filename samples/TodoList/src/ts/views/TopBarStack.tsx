/*
* TopBarStack.tsx
* Copyright: Microsoft 2018
*
* Horizontal bar that appears on the top of every view within the app
* when it's using stack-based layout.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import HoverButton from '../controls/HoverButton';
import { Colors, Fonts, FontSizes, Styles } from '../app/Styles';

const _styles = {
    background: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        height: 36,
        borderBottomWidth: 1,
        borderColor: Colors.gray66,
        flexDirection: 'row',
        justifyContent: 'center'
    }),
    leftRightContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
        width: 60
    }),
    titleContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }),
    titleText: RX.Styles.createTextStyle({
        flex: -1,
        font: Fonts.displaySemibold,
        fontSize: FontSizes.size16,
        color: Colors.menuText,
        textAlign: 'center'
    }),
    backText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        color: Colors.menuText,
        margin: 8
    }),
    backTextHover: RX.Styles.createTextStyle({
        color: Colors.menuTextHover
    })
};

export interface TopBarStackProps extends RX.CommonProps {
    title: string;
    showBackButton: boolean;
    onBack?: () => void;
}

export default class TopBarStack extends ComponentBase<TopBarStackProps, RX.Stateless> {
    render(): JSX.Element | null {
        let leftContents: JSX.Element | undefined;
        let rightContents: JSX.Element | undefined;

        if (this.props.showBackButton) {
            leftContents = (
                <HoverButton onPress={ this._onPressBack } onRenderChild={ this._renderBackButton }/>
            );
        }

        return (
            <RX.View style={ [_styles.background, Styles.statusBarTopMargin] }>
                <RX.View style={ _styles.leftRightContainer }>
                    { leftContents }
                </RX.View>
                <RX.View style={ _styles.titleContainer }>
                    <RX.Text style={ _styles.titleText } numberOfLines={ 1 }>
                        { this.props.title }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.leftRightContainer }>
                    { rightContents }
                </RX.View>
            </RX.View>
        );
    }

    private _onPressBack = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        if (this.props.onBack) {
            this.props.onBack();
        }
    }

    private _renderBackButton = (isHovering: boolean) => {
        return (
            <RX.Text style={ [_styles.backText, isHovering ? _styles.backTextHover : undefined] }>
                { 'Back' }
            </RX.Text>
        );
    }
}
