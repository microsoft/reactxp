/*
* Tests mouse/touch/pointer functionality of a View component.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';

const _styles = {
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12,
        alignItems: 'center'
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    labelText: RX.Styles.createTextStyle({
        margin: 8,
        fontSize: CommonStyles.generalFontSize,
    }),
    modalBox1: RX.Styles.createTextStyle({
        backgroundColor: '#eee',
        borderColor: 'black',
        borderWidth: 1,
        margin: 20,
    }),
};

interface MousePopupViewState {
    mouseEnterEvent?: RX.Types.MouseEvent;
    mouseLeaveEvent?: RX.Types.MouseEvent;
    mouseOverEvent?: RX.Types.MouseEvent;
    mouseMoveEvent?: RX.Types.MouseEvent;
    wheelEvent?: RX.Types.WheelEvent;
}

class MousePopupView extends RX.Component<RX.CommonProps, MousePopupViewState> {

    constructor(props: RX.CommonProps) {
        super(props);
        this.state = { };
    }

    private static getMouseEventText(mouseEvent?: RX.Types.MouseEvent): string {
        if (mouseEvent) {
            return 'altKey = ' + mouseEvent.altKey +
                ' button = ' + mouseEvent.button +
                ' clientX = ' + mouseEvent.clientX +
                ' clientY = ' + mouseEvent.clientY +
                ' ctrlKey = ' + mouseEvent.ctrlKey +
                ' metaKey = ' + mouseEvent.metaKey +
                ' shiftKey = ' + mouseEvent.shiftKey +
                ' pageX = ' + mouseEvent.pageX +
                ' pageY = ' + mouseEvent.pageY;
        }
        return 'N/A';
    }

    private static getWheelEventText(wheelEvent?: RX.Types.WheelEvent): string {
        if (wheelEvent) {
            return 'deltaMode = ' + wheelEvent.deltaMode +
                ' deltaX = ' + wheelEvent.deltaX +
                ' deltaY = ' + wheelEvent.deltaY +
                ' deltaZ = ' + wheelEvent.deltaZ;
        }
        return 'N/A';
    }

    render(): any {
        const screenSize = RX.UserInterface.measureWindow();
        let style = RX.Styles.combine(
            _styles.modalBox1,
            {
                width: screenSize.width * .5,
                height: screenSize.height * .5
            }
        );

        return (
            <RX.View
                style={ style }
                onMouseEnter={ e => this.setState({ mouseEnterEvent: _.clone(e) }) }
                onMouseLeave={ e => this.setState({ mouseLeaveEvent: _.clone(e) }) }
                onMouseOver={ e => this.setState({ mouseOverEvent: _.clone(e) }) }
                onMouseMove={ e => this.setState({ mouseMoveEvent: _.clone(e) }) }
                onWheel={ e => this.setState({ wheelEvent: _.clone(e) }) }
            >
                <RX.Text style={ _styles.labelText }>
                    { 'onMouseEnter: ' + MousePopupView.getMouseEventText(this.state.mouseEnterEvent) }
                </RX.Text>
                <RX.Text style={ _styles.labelText }>
                    { 'onMouseLeave: ' + MousePopupView.getMouseEventText(this.state.mouseLeaveEvent) }
                </RX.Text>
                <RX.Text style={ _styles.labelText }>
                    { 'onMouseOver: ' + MousePopupView.getMouseEventText(this.state.mouseOverEvent) }
                </RX.Text>
                <RX.Text style={ _styles.labelText }>
                    { 'onMouseMove: ' + MousePopupView.getMouseEventText(this.state.mouseMoveEvent) }
                </RX.Text>
                <RX.Text style={ _styles.labelText }>
                    { 'onWheel: ' + MousePopupView.getWheelEventText(this.state.wheelEvent) }
                </RX.Text>
            </RX.View>
        );
    }
}

const _popupId = 'mouse_event_popup';

class MouseView extends RX.Component<RX.CommonProps, RX.Stateless> {
    private _ref: RX.View|null;

    _showPopup(): void {
        RX.Popup.show({
            getAnchor: () => {
                return this._ref;
            },
            positionPriorities: ['bottom'],
            preventDismissOnPress: false,
            dismissIfShown: true,
            renderPopup: (anchorPosition: RX.Types.PopupPosition, anchorOffset: number,
                popupWidth: number, popupHeight: number) => {
                return <MousePopupView />;
            }
        }, _popupId);
    }

    render(): any {
        return (
            <RX.View
                style={ _styles.explainTextContainer }
                key={ 'explanation1' }
                onPress={ () => this._showPopup() }
                >
                <RX.Text
                    style={ _styles.explainText }
                    ref={ (ref: any) => this._onMount(ref) }
                >
                { 'Click or tap here to show a popup with textual representation of the last mouse events ' +
                  'received by its top-level view.' }
                </RX.Text>
            </RX.View>
        );
    }

    _onMount(ref: RX.View|null) {
        this._ref = ref;
    }

    componentWillUnmount() {
        RX.Popup.dismiss(_popupId);
    }
}

class ViewMouseTest implements Test {
    getPath(): string {
        return 'Components/View/Mouse';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <MouseView
                ref={ onMount }
            />
        );
    }
}

export default new ViewMouseTest();
