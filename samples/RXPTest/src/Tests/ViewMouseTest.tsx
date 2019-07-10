/*
* Tests mouse/touch/pointer functionality of a View component.
*/

import * as _ from 'lodash';
import * as RX from 'reactxp';

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';

const _styles = {
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12,
        maxWidth: 800
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

    row: RX.Styles.createViewStyle({
        flexDirection: 'row'
    }),
    outerPointerEventsBox: RX.Styles.createViewStyle({
        width: 200,
        height: 200,
        backgroundColor: '#AAAAAA',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }),
    outerPointerEventsBoxHover: RX.Styles.createViewStyle({
        width: 200,
        height: 200,
        backgroundColor: 'yellow',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }),
    innerPointerEventsBox: RX.Styles.createViewStyle({
        width: 100,
        height: 100,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center'
    }),
    innerPointerEventsBoxHover: RX.Styles.createViewStyle({
        width: 100,
        height: 100,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    })
};

interface MouseViewState {
    mouseEnterEvent?: RX.Types.MouseEvent;
    mouseLeaveEvent?: RX.Types.MouseEvent;
    mouseOverEvent?: RX.Types.MouseEvent;
    mouseMoveEvent?: RX.Types.MouseEvent;
    blockPointerEvents: boolean;
    ignorePointerEvents: boolean;
    mouseOverOuter: boolean;
    mouseOverInner: boolean;
}

class MouseView extends RX.Component<RX.CommonProps, MouseViewState> {

    constructor(props: RX.CommonProps) {
        super(props);
        this.state = { 
            blockPointerEvents: false,
            ignorePointerEvents: false,
            mouseOverOuter: false,
            mouseOverInner: false
        };
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

    private toggleBlockPointerEvents = () => {
        this.setState((prevState) => ({
            blockPointerEvents: !prevState.blockPointerEvents
        }));
    }

    private toggleIgnorePointerEvents = () => {
        this.setState((prevState) => ({
            ignorePointerEvents: !prevState.ignorePointerEvents
        }));
    }

    private onOuterMouseEnter = () => {
        this.setState({ mouseOverOuter: true });
    }
    private onOuterMouseLeave = () => {
        this.setState({ mouseOverOuter: false });
    }    
    private onInnerMouseEnter = (e: RX.Types.MouseEvent) => {
        this.setState({ mouseOverInner: true });
    }
    private onInnerMouseLeave = (e: RX.Types.MouseEvent) => {
        this.setState({ mouseOverInner: false });
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

                <RX.View style={ _styles.explainTextContainer }>
                    <RX.Text style={ _styles.explainText }>
                        The views below are designed to test View.blockPointerEvents and View.ignorePointerEvents. 
                        Each view changes color when the mouse hovers over it.
                    </RX.Text>
                    <RX.Text style={ _styles.explainText }>
                        blockPointerEvents is applied to the outer view. When it is enabled, mouse events should be blocked
                        on both views and neither view should change color on hover.
                    </RX.Text>
                    <RX.Text style={ _styles.explainText }>
                        ignorePointerEvents is applied to the outer view. When it is enabled, mouse events should only be blocked
                        on the outer view. The inner view should trigger color changes on both views as the mouse events cascade upwards.
                    </RX.Text>
                </RX.View>
                <RX.View 
                    style={this.state.mouseOverOuter ? _styles.outerPointerEventsBoxHover : _styles.outerPointerEventsBox}
                    blockPointerEvents={this.state.blockPointerEvents}
                    ignorePointerEvents={this.state.ignorePointerEvents}
                    onMouseEnter={this.onOuterMouseEnter} 
                    onMouseLeave={this.onOuterMouseLeave}>
                    <RX.Text>Outer View</RX.Text>
                    <RX.View style={this.state.mouseOverInner ? _styles.innerPointerEventsBoxHover : _styles.innerPointerEventsBox}
                        onMouseEnter={this.onInnerMouseEnter} 
                        onMouseLeave={this.onInnerMouseLeave}>
                        <RX.Text>Inner View</RX.Text>
                    </RX.View>
                </RX.View>
                <RX.View style={_styles.row}>
                    <RX.Text style={ _styles.labelText }>
                        blockPointerEvents: {this.state.blockPointerEvents ? 'true' : 'false' }
                    </RX.Text>
                    <RX.Button onPress={this.toggleBlockPointerEvents}>
                    {    this.state.blockPointerEvents ? 'Enable' : 'Disable' }
                    </RX.Button>
                </RX.View>
                <RX.View style={_styles.row}>
                    <RX.Text style={ _styles.labelText }>
                        ignorePointerEvents: {this.state.ignorePointerEvents ? 'true' : 'false' }
                    </RX.Text>
                    <RX.Button onPress={this.toggleIgnorePointerEvents}>
                    {    this.state.ignorePointerEvents ? 'Enable' : 'Disable' }
                    </RX.Button>
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
