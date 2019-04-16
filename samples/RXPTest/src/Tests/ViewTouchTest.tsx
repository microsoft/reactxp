/*
* Tests mouse/touch/pointer functionality of a View component.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestType } from '../Test';

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
    testContainer1: RX.Styles.createTextStyle({
        backgroundColor: '#eee',
        borderColor: 'black',
        borderWidth: 1,
        margin: 20,
    }),
    wrapper: RX.Styles.createViewStyle({
        flexDirection: 'row'
    }),
    testContainer2: RX.Styles.createViewStyle({
        flex: 1,
        height: 120,
        margin: 20,        
        borderWidth: 1,
        backgroundColor: '#eee',
        borderColor: 'black',
    }),
    testContainer3: RX.Styles.createViewStyle({
        flex: 1,
        height: 120,
        margin: 20,        
        borderWidth: 1,
        backgroundColor: '#eee',
        borderColor: 'black',
    }),
    testContainer4: RX.Styles.createViewStyle({
        flex: 1,
        height: 150,
        margin: 20,        
        borderWidth: 1,
        backgroundColor: '#eee',
        borderColor: 'black',
    }),
    success: RX.Styles.createViewStyle({
        borderWidth: 2,
        backgroundColor: 'green'
    })
};

interface TouchViewState {
    view2TouchResponderTestStart: boolean;
    view2TouchResponderTestGrant: boolean;
    view2TouchResponderTestRelease: boolean;
    view3TouchResponderTestStart: boolean;
    view3TouchResponderTestGrant: boolean;
    view3TouchResponderTestRelease: boolean;
    touchPositionOnPage: {
        x: number | null
        y: number | null
    };
    nestedViewTouchTestParent: boolean;
    nestedViewTouchTestChild: boolean;
    pressEvent?: RX.Types.TouchEvent;
}

class ViewTouch extends RX.Component<RX.CommonProps, TouchViewState> {

    constructor(props: RX.CommonProps) {
        super(props);
        this.state = {
            view2TouchResponderTestStart: false,
            view2TouchResponderTestGrant: false,
            view2TouchResponderTestRelease: false,
            view3TouchResponderTestStart: false,
            view3TouchResponderTestGrant: false,
            view3TouchResponderTestRelease: false,
            touchPositionOnPage: {
                x: null,
                y: null
            },
            nestedViewTouchTestParent: false,
            nestedViewTouchTestChild: false,
        };
    }

    private static getTouchEventText(touchEvent?: RX.Types.TouchEvent): string {
        if (touchEvent) {
            return 'altKey = ' + touchEvent.altKey +
                ' changedTouches.length = ' + (touchEvent.changedTouches && touchEvent.changedTouches.length) +
                ' ctrlKey = ' + touchEvent.ctrlKey +
                ' metaKey = ' + touchEvent.metaKey +
                ' shiftKey = ' + touchEvent.shiftKey +
                ' targetTouches = ' + touchEvent.targetTouches +
                ' locationX = ' + touchEvent.locationX +
                ' locationY = ' + touchEvent.locationY +
                ' pageX = ' + touchEvent.pageX +
                ' pageY = ' + touchEvent.pageY +
                ' touches = ' + touchEvent.touches;
        }
        return 'N/A';
    }

    private isView2TouchResponderEventHasBeenAllFired = () => {
        return this.state.view2TouchResponderTestStart &&
            this.state.view2TouchResponderTestGrant && 
            this.state.view2TouchResponderTestRelease;
    }

    private isView3TouchResponderEventHasBeenAllFired = () => {
        return this.state.view3TouchResponderTestStart &&
            this.state.view3TouchResponderTestGrant && 
            this.state.view3TouchResponderTestRelease;
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
                    style={ _styles.testContainer1 }
                    onPress={ e => this.setState({ pressEvent: _.clone(e.nativeEvent as RX.Types.TouchEvent)}) }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'onPress: ' + ViewTouch.getTouchEventText(this.state.pressEvent) }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.explainTextContainer }>
                    <RX.Text style={ _styles.explainText }>
                        { 'The two views below should turn green if they received the `StartShouldSetResponder` event.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={_styles.wrapper}>
                    <RX.View
                        style={[_styles.testContainer2, this.isView2TouchResponderEventHasBeenAllFired() ? _styles.success : undefined]}
                        onStartShouldSetResponder={() => {
                            this.setState({
                                view2TouchResponderTestStart: true
                            });
                            return true;
                        }}
                        onResponderGrant={() => {
                            this.setState({
                                view2TouchResponderTestGrant: true
                            });
                        }}
                        onResponderRelease={() => {
                            this.setState({
                                view2TouchResponderTestRelease: true
                            });
                        }}
                    />
                    <RX.View
                        style={[_styles.testContainer3, this.isView3TouchResponderEventHasBeenAllFired() ? _styles.success : undefined]}
                        onPress={() => null}
                        onStartShouldSetResponder={() => {
                            this.setState({
                                view3TouchResponderTestStart: true
                            });
                            return true;
                        }}
                        onResponderGrant={() => {
                            this.setState({
                                view3TouchResponderTestGrant: true
                            });
                        }}
                        onResponderRelease={() => {
                            this.setState({
                                view3TouchResponderTestRelease: true
                            });
                        }}
                    />
                </RX.View>
                <RX.View style={ _styles.explainTextContainer }>
                    <RX.Text style={ _styles.explainText }>
                        { 'When touching this view, it will display the page coordinates of the touch position.' }
                    </RX.Text>
                </RX.View>
                <RX.View
                    style={ _styles.testContainer4 }
                    onResponderMove={ e => {
                        const touch = e.touches[0];
                        if (touch) {
                            this.setState({ touchPositionOnPage: {
                                x: Math.round(touch.pageX),
                                y: Math.round(touch.pageY)
                            }});
                        }
                    }}
                >
                    <RX.Text style={ _styles.labelText }>
                        { `Touch position on page: x: ${this.state.touchPositionOnPage.x} y: ${this.state.touchPositionOnPage.y}`}
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }
}

class ViewTouchTest implements Test {
    getPath(): string {
        return 'Components/View/Touch';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ViewTouch
                ref={ onMount }
            />
        );
    }
}

export default new ViewTouchTest();
