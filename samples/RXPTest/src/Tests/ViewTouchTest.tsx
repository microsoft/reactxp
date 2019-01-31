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
    success: RX.Styles.createViewStyle({
        borderWidth: 2,
        backgroundColor: 'green'
    })
};

interface TouchViewState {
    touchResponderTest: {
        view2TouchResponderEventHandlerState: {
            start: boolean;
            grant: boolean;
            release: boolean;
            terminationRequest: boolean;
            terminate: boolean;
        };
        view3TouchResponderEventHandlerState: {
            start: boolean;
            grant: boolean;
            release: boolean;
            terminationRequest: boolean;
            terminate: boolean;
        };
    };
    nestedViewTouchTest: {
        parentOnPress: boolean;
        childOnPress: boolean;
    };
    pressEvent?: RX.Types.TouchEvent;
}

class ViewTouch extends RX.Component<RX.CommonProps, TouchViewState> {

    constructor(props: RX.CommonProps) {
        super(props);
        this.state = {
            touchResponderTest: {
                view2TouchResponderEventHandlerState: {
                    start: false,
                    grant: false,
                    release: false,
                    terminationRequest: false,
                    terminate: false,
                },
                view3TouchResponderEventHandlerState: {
                    start: false,
                    grant: false,
                    release: false,
                    terminationRequest: false,
                    terminate: false,
                },
            },
            nestedViewTouchTest: {
                parentOnPress: false,
                childOnPress: false,
            }
        };
    }

    private static getTouchEventText(touchEvent?: RX.Types.TouchEvent): string {
        if (touchEvent) {
            return 'altKey = ' + touchEvent.altKey +
                ' changedTouches.length = ' + touchEvent.changedTouches.length +
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
        return this.state.touchResponderTest.view2TouchResponderEventHandlerState.start &&
            this.state.touchResponderTest.view2TouchResponderEventHandlerState.grant && 
            this.state.touchResponderTest.view2TouchResponderEventHandlerState.release && 
            this.state.touchResponderTest.view2TouchResponderEventHandlerState.terminationRequest && 
            this.state.touchResponderTest.view2TouchResponderEventHandlerState.terminate;
    }

    private isView3TouchResponderEventHasBeenAllFired = () => {
        return this.state.touchResponderTest.view3TouchResponderEventHandlerState.start &&
            this.state.touchResponderTest.view3TouchResponderEventHandlerState.grant && 
            this.state.touchResponderTest.view3TouchResponderEventHandlerState.release && 
            this.state.touchResponderTest.view3TouchResponderEventHandlerState.terminationRequest && 
            this.state.touchResponderTest.view3TouchResponderEventHandlerState.terminate;
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
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view2TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view2TouchResponderEventHandlerState,
                                        start: true
                                    }
                                }
                            });
                            return true;
                        }}
                        onResponderGrant={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view2TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view2TouchResponderEventHandlerState,
                                        grant: true
                                    }
                                }
                            });
                        }}
                        onResponderRelease={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view2TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view2TouchResponderEventHandlerState,
                                        release: true
                                    }
                                }
                            });
                        }}
                        onResponderTerminationRequest={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view2TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view2TouchResponderEventHandlerState,
                                        terminationRequest: true
                                    }
                                }
                            });
                            return true;
                        }}
                        onResponderTerminate={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view2TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view2TouchResponderEventHandlerState,
                                        terminate: true
                                    }
                                }
                            });
                        }}
                    />
                    <RX.View
                        style={[_styles.testContainer3, this.isView3TouchResponderEventHasBeenAllFired() ? _styles.success : undefined]}
                        onPress={() => null}
                        onStartShouldSetResponder={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view3TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view3TouchResponderEventHandlerState,
                                        start: true
                                    }
                                }
                            });
                            return true;
                        }}
                        onResponderGrant={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view3TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view3TouchResponderEventHandlerState,
                                        grant: true
                                    }
                                }
                            });
                        }}
                        onResponderRelease={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view3TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view3TouchResponderEventHandlerState,
                                        release: true
                                    }
                                }
                            });
                        }}
                        onResponderTerminationRequest={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view3TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view3TouchResponderEventHandlerState,
                                        terminationRequest: true
                                    }
                                }
                            });
                            return true;
                        }}
                        onResponderTerminate={() => {
                            this.setState({
                                touchResponderTest: {
                                    ...this.state.touchResponderTest,
                                    view3TouchResponderEventHandlerState: {
                                        ...this.state.touchResponderTest.view3TouchResponderEventHandlerState,
                                        terminate: true
                                    }
                                }
                            });
                        }}
                    />
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
