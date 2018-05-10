/*
* Tests the RX.Popup APIs in an automated manner.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';

const _indicatorWidth = 8;
const _popupMargin = 8;

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'flex-start'
    }),
    textContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    anyDisplayedText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        marginTop: 20,
    }),
    popupText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        margin: 8
    }),
    popupBox: RX.Styles.createTextStyle({
        margin: _popupMargin,
        backgroundColor: '#ffd',
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
    }),
    popupContainer: RX.Styles.createViewStyle({
        overflow: 'visible'
    }),
    anchorText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize
    }),
    popupAnchor: RX.Styles.createViewStyle({
        position: 'absolute',
        borderRadius: 15,
        height: 30,
        width: 160,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center'
    }),
    popupAnchor1: RX.Styles.createViewStyle({
        left: 10,
        top: 150
    }),
    popupAnchor2: RX.Styles.createViewStyle({
        right: 10,
        top: 250
    }),
    popupAnchor3: RX.Styles.createViewStyle({
        left: 10,
        bottom: 10
    }),
    popupAnchor4: RX.Styles.createViewStyle({
        right: 10,
        bottom: 10
    }),
    anchorIndicator: RX.Styles.createViewStyle({
        position: 'absolute',
        height: _indicatorWidth,
        width: _indicatorWidth,
        borderRadius: _indicatorWidth / 2,
        backgroundColor: 'black'
    })
};

const popup1Id = 'popup1';
const popup2Id = 'popup2';
const popup3Id = 'popup3';
const popup4Id = 'popup4';

interface PopupBoxProps extends RX.CommonProps {
    text: string;
    anchorPosition: RX.Types.PopupPosition;
    anchorOffset: number;
    popupHeight: number;
    popupWidth: number;
    onPress?: () => void;
}

class PopupBox extends RX.Component<PopupBoxProps, RX.Stateless> {
    render() {
        let top: number;
        let bottom: number;
        let left: number;
        let right: number;

        switch (this.props.anchorPosition) {
            case 'left':
                right = -_indicatorWidth / 2;
                top = this.props.anchorOffset - _popupMargin - _indicatorWidth / 2;
                break;

            case 'right':
                left = -_indicatorWidth / 2;
                top = this.props.anchorOffset - _popupMargin - _indicatorWidth / 2;
                break;

            case 'top':
                bottom = -_indicatorWidth / 2;
                left = this.props.anchorOffset - _popupMargin - _indicatorWidth / 2;
                break;

            case 'bottom':
                top = -_indicatorWidth / 2;
                left = this.props.anchorOffset - _popupMargin - _indicatorWidth / 2;
                break;
        }

        // Dynamically allocate a non-cached style to position the indicator.
        let indicatorPosition = RX.Styles.createViewStyle({
            top,
            left,
            bottom,
            right
        }, false);

        return (
            <RX.View style={ _styles.popupBox } onPress={ this.props.onPress }>
                <RX.View style={ _styles.popupContainer }>
                    <RX.Text style={ _styles.popupText }>
                        { this.props.text }
                    </RX.Text>
                    <RX.View style={ [_styles.anchorIndicator, indicatorPosition] }/>
                </RX.View>
            </RX.View>
        );
    }
}

class PopupView extends RX.Component<RX.CommonProps, RX.Stateless> {
    private _anchor1: RX.Button;
    private _anchor2: RX.Button;
    private _anchor3: RX.Button;
    private _anchor4: RX.Button;

    componentWillUnmount() {
        RX.Popup.dismissAll();
    }

    render() {
        return (
            <RX.View style={ _styles.container }>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Click or tap on anchor buttons to display popups. ' +
                          'The black circle should align to the anchor. ' }
                    </RX.Text>
                    <RX.Text style={ _styles.explainText }>
                        { 'Resize the window or rotate the device when a popup is displayed ' +
                          'to confirm that it follows the location of the anchor.' }
                    </RX.Text>
                    <RX.Text style={ _styles.anyDisplayedText }>
                        { `Any Popup displayed = ${RX.Popup.isDisplayed()}`}
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ [_styles.popupAnchor, _styles.popupAnchor1] }
                    ref={ (comp: RX.Button) => { this._anchor1 = comp; } }
                    onPress={ this._showPopup1 }
                >
                    <RX.Text style={ _styles.anchorText }>
                        { `1: isDisplayed = ${RX.Popup.isDisplayed(popup1Id)}` }
                    </RX.Text>
                </RX.Button>
                <RX.Button
                    style={ [_styles.popupAnchor, _styles.popupAnchor2] }
                    ref={ (comp: RX.Button) => { this._anchor2 = comp; } }
                    onPress={ this._showPopup2 }
                >
                    <RX.Text style={ _styles.anchorText }>
                        { `2: isDisplayed = ${RX.Popup.isDisplayed(popup2Id)}` }
                    </RX.Text>
                </RX.Button>
                <RX.Button
                    style={ [_styles.popupAnchor, _styles.popupAnchor3] }
                    ref={ (comp: RX.Button) => { this._anchor3 = comp; } }
                    onPress={ this._showPopup3 }
                >
                    <RX.Text style={ _styles.anchorText }>
                        { `3: isDisplayed = ${RX.Popup.isDisplayed(popup3Id)}` }
                    </RX.Text>
                </RX.Button>
                <RX.Button
                    style={ [_styles.popupAnchor, _styles.popupAnchor4] }
                    ref={ (comp: RX.Button) => { this._anchor4 = comp; } }
                    onPress={ this._showPopup4 }
                >
                    <RX.Text style={ _styles.anchorText }>
                        { `4: isDisplayed = ${RX.Popup.isDisplayed(popup4Id)}` }
                    </RX.Text>
                </RX.Button>
            </RX.View>
        );
    }

    private _showPopup1 = () => {
        RX.Popup.show({
            getAnchor: () => {
                return this._anchor1;
            },
            dismissIfShown: true,
            positionPriorities: ['right', 'top', 'bottom'],
            renderPopup: (anchorPosition: RX.Types.PopupPosition, anchorOffset: number,
                popupWidth: number, popupHeight: number) => {

                return (
                    <PopupBox
                        text={ 'Click on anchor to toggle' }
                        anchorOffset={ anchorOffset }
                        anchorPosition={ anchorPosition }
                        popupWidth={ popupWidth }
                        popupHeight={ popupHeight }
                    />
                );
            }
        }, popup1Id);
    }

    private _showPopup2 = () => {
        RX.Popup.show({
            getAnchor: () => {
                return this._anchor2;
            },
            preventDismissOnPress: true,
            positionPriorities: ['left', 'top', 'bottom'],
            renderPopup: (anchorPosition: RX.Types.PopupPosition, anchorOffset: number,
                popupWidth: number, popupHeight: number) => {

                return (
                    <PopupBox
                        text={ 'Must click on this\npopup to dismiss' }
                        anchorOffset={ anchorOffset }
                        anchorPosition={ anchorPosition }
                        popupWidth={ popupWidth }
                        popupHeight={ popupHeight }
                        onPress={ () => { RX.Popup.dismiss(popup2Id); } }
                    />
                );
            }
        }, popup2Id);
    }

    private _showPopup3 = () => {
        RX.Popup.show({
            getAnchor: () => {
                return this._anchor3;
            },
            getElementTriggeringPopup: () => {
                return this._anchor3;
            },
            positionPriorities: ['right', 'bottom', 'left', 'top'],
            renderPopup: (anchorPosition: RX.Types.PopupPosition, anchorOffset: number,
                popupWidth: number, popupHeight: number) => {

                return (
                    <PopupBox
                        text={ 'Auto-dismissing popup\n(after 2 seconds)' }
                        anchorOffset={ anchorOffset }
                        anchorPosition={ anchorPosition }
                        popupWidth={ popupWidth }
                        popupHeight={ popupHeight }
                    />
                );
            }
        }, popup3Id);

        RX.Popup.autoDismiss(popup3Id, 2000);
    }

    private _showPopup4 = () => {
        RX.Popup.show({
            dismissIfShown: true,
            cacheable: true,
            getAnchor: () => {
                return this._anchor4;
            },
            getElementTriggeringPopup: () => {
                return this._anchor3;
            },
            positionPriorities: ['left', 'top', 'bottom'],
            renderPopup: (anchorPosition: RX.Types.PopupPosition, anchorOffset: number,
                popupWidth: number, popupHeight: number) => {

                return (
                    <PopupBox
                        text={ 'Cacheable popup\n(may be still rendered when dismissed)' }
                        anchorOffset={ anchorOffset }
                        anchorPosition={ anchorPosition }
                        popupWidth={ popupWidth }
                        popupHeight={ popupHeight }
                    />
                );
            }
        }, popup4Id);
    }
}

class PopupTest implements Test {
    useFullScreenContainer = true;

    getPath(): string {
        return 'APIs/Popup';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <PopupView
                ref={ onMount }
            />
        );
    }
}

export default new PopupTest();
