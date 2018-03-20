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
    testContainer: RX.Styles.createTextStyle({
        backgroundColor: '#eee',
        borderColor: 'black',
        borderWidth: 1,
        margin: 20,
    }),
};

interface MouseViewState {
    mouseEnterEvent?: RX.Types.MouseEvent;
    mouseLeaveEvent?: RX.Types.MouseEvent;
    mouseOverEvent?: RX.Types.MouseEvent;
    mouseMoveEvent?: RX.Types.MouseEvent;
}

class MouseView extends RX.Component<RX.CommonProps, MouseViewState> {

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

    render(): any {
        return (
            <RX.View>
                <RX.View style={ _styles.explainTextContainer }>
                    <RX.Text style={ _styles.explainText }>
                        { 'The view below shows textual representation of the last mouse events it has received.' }
                    </RX.Text>
                </RX.View>
                <RX.View
                    style={ _styles.testContainer }
                    onMouseEnter={ e => this.setState({ mouseEnterEvent: _.clone(e) }) }
                    onMouseLeave={ e => this.setState({ mouseLeaveEvent: _.clone(e) }) }
                    onMouseOver={ e => this.setState({ mouseOverEvent: _.clone(e) }) }
                    onMouseMove={ e => this.setState({ mouseMoveEvent: _.clone(e) }) }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'onMouseEnter: ' + MouseView.getMouseEventText(this.state.mouseEnterEvent) }
                    </RX.Text>
                    <RX.Text style={ _styles.labelText }>
                        { 'onMouseLeave: ' + MouseView.getMouseEventText(this.state.mouseLeaveEvent) }
                    </RX.Text>
                    <RX.Text style={ _styles.labelText }>
                        { 'onMouseOver: ' + MouseView.getMouseEventText(this.state.mouseOverEvent) }
                    </RX.Text>
                    <RX.Text style={ _styles.labelText }>
                        { 'onMouseMove: ' + MouseView.getMouseEventText(this.state.mouseMoveEvent) }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
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
