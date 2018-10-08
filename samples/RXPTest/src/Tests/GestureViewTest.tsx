/*
* Tests the functionality of a GestureView component
* through user interaction.
*/

import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'flex-start'
    }),
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    gestureView: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        height: 150,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center'
    }),
    smallBox: RX.Styles.createViewStyle({
        height: 50,
        width: 50,
        backgroundColor: 'blue'
    }),
    button: RX.Styles.createButtonStyle({
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4
    }),
    modalDialog: RX.Styles.createTextStyle({
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center'
    }),
    modalBox1: RX.Styles.createTextStyle({
        padding: 20,
        backgroundColor: '#eee',
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }),
    modalText: RX.Styles.createViewStyle({
        margin: 8
    })
};

const _colors = ['red', 'green', 'blue'];
const _shades = ['#000', '#333', '#666', '#999', '#CCC', '#FFF'];

const modal1Id = 'modal1';

interface GestureViewState {
    test1ColorIndex: number;
    test2ColorIndex: number;
    test3ColorIndex: number;
    test4ColorIndex: number;
}

class GestureViewView extends RX.Component<RX.CommonProps, GestureViewState> {
    private _test1RotateValue = new RX.Animated.Value(0);
    private _test1ScaleNumericValue = 1;
    private _test1ScaleValue = new RX.Animated.Value(1);
    private _test1AnimatedStyle = RX.Styles.createAnimatedViewStyle({
        transform: [{
            scale: this._test1ScaleValue
        }, {
            rotate: this._test1RotateValue.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg']
            }),
        }]
    });

    private _test2HorizontalOffset = new RX.Animated.Value(0);
    private _test2VerticalOffset = new RX.Animated.Value(0);
    private _test2AnimatedStyle = RX.Styles.createAnimatedViewStyle({
        transform: [{
            translateX: this._test2HorizontalOffset
        }, {
            translateY: this._test2VerticalOffset
        }]
    });

    private _test3HorizontalOffset = new RX.Animated.Value(0);
    private _test3VerticalOffset = new RX.Animated.Value(0);
    private _test3AnimatedStyle = RX.Styles.createAnimatedViewStyle({
        transform: [{
            translateX: this._test3HorizontalOffset
        }, {
            translateY: this._test3VerticalOffset
        }]
    });

    private _test4HorizontalOffset = new RX.Animated.Value(0);
    private _test4VerticalOffset = new RX.Animated.Value(0);
    private _test4AnimatedStyle = RX.Styles.createAnimatedViewStyle({
        transform: [{
            translateX: this._test4HorizontalOffset
        }, {
            translateY: this._test4VerticalOffset
        }]
    });

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            test1ColorIndex: 0,
            test2ColorIndex: 1,
            test3ColorIndex: 2,
            test4ColorIndex: 3
        };
    }

    render() {
        // Create dynamic styles.
        let test1ColorStyle = RX.Styles.createViewStyle({
            backgroundColor: _colors[this.state.test1ColorIndex]
        }, false);

        let test2ColorStyle = RX.Styles.createViewStyle({
            backgroundColor: _colors[this.state.test2ColorIndex]
        }, false);

        let test3ColorStyle = RX.Styles.createViewStyle({
            backgroundColor: _colors[this.state.test3ColorIndex]
        }, false);

        let test4ColorStyle = RX.Styles.createViewStyle({
            backgroundColor: _shades[this.state.test4ColorIndex]
        }, false);

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Pinch-and-zoom and rotate gestures will grow and rotate the square (touch only). ' +
                            'Scroll wheel will grow the square (mouse). ' +
                            'Double-tap/click will change the color.' }
                    </RX.Text>
                </RX.View>
                <RX.GestureView
                    style={ _styles.gestureView }
                    onPinchZoom={ state => this._onPinchZoomTest1(state) }
                    onRotate={ state => this._onRotateTest1(state) }
                    onDoubleTap={ state => this._onDoubleTapTest1(state) }
                    mouseOverCursor={ RX.Types.GestureMouseCursor.Pointer }
                    onScrollWheel={ state => this._onScrollWheelTest1(state) }
                    testId={ 'gestureView1' }
                >
                    <RX.Animated.View
                        style={ [_styles.smallBox, test1ColorStyle, this._test1AnimatedStyle] }
                    />
                </RX.GestureView>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Horizontal and vertical panning (or dragging) will move the square. ' +
                          'Single tap/click will change the color.' }
                    </RX.Text>
                </RX.View>
                <RX.GestureView
                    style={ _styles.gestureView }
                    onTap={ state => this._onTapTest2(state) }
                    onPanHorizontal={ state => this._onPanHorizontalTest2(state) }
                    onPanVertical={ state => this._onPanVerticalTest2(state) }
                    preferredPan={ RX.Types.PreferredPanGesture.Vertical }
                    mouseOverCursor={ RX.Types.GestureMouseCursor.Grab }
                >
                    <RX.Animated.View
                        style={ [_styles.smallBox, test2ColorStyle, this._test2AnimatedStyle] }
                    />
                </RX.GestureView>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Panning and dragging will move the square (20-pixel threshold). ' +
                          'Long-pressing will change the color.' }
                    </RX.Text>
                </RX.View>
                <RX.GestureView
                    style={ _styles.gestureView }
                    onPan={ state => this._onPanTest3(state) }
                    onLongPress={ this._onLongPressTest3 }
                    panPixelThreshold={ 20 }
                    mouseOverCursor={ RX.Types.GestureMouseCursor.Grab }
                >
                    <RX.Animated.View
                        style={ [_styles.smallBox, test3ColorStyle, this._test3AnimatedStyle] }
                    />
                </RX.GestureView>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation4' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Desktop platforms: Left click will make the box lighter. ' +
                          'Right click (context menu) will make the box darker.' }
                    </RX.Text>
                </RX.View>
                <RX.GestureView
                    style={ _styles.gestureView }
                    onTap={ state => this._onTapTest4(state) }
                    onContextMenu={ e => this._onContextMenu4(e) }
                    mouseOverCursor={ RX.Types.GestureMouseCursor.Pointer }
                >
                    <RX.Animated.View
                        style={ [_styles.smallBox, test4ColorStyle, this._test4AnimatedStyle] }
                    />
                </RX.GestureView>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation5' }>
                    <RX.Button style={ _styles.button } onPress={ this._onShowModal }>
                        <RX.Text style={ _styles.explainText }>
                            { 'Show Modal Dialog' }
                        </RX.Text>
                    </RX.Button>
                </RX.View>
            </RX.View>
        );
    }

    private _onShowModal = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();
        RX.Modal.show((
            <RX.View style={ _styles.modalDialog }>
                <RX.View style={ _styles.modalBox1 } onPress={ this._onDismissDialog }>
                <RX.Text style={ _styles.modalText }>
                        { 'Gesture targets should be disabled' }
                    </RX.Text>
                    <RX.Text style={ _styles.modalText }>
                        { 'Click here to dismiss dialog' }
                    </RX.Text>
                </RX.View>
            </RX.View>
        ),
        modal1Id);
    }

    private _onDismissDialog = (e: RX.Types.SyntheticEvent) => {
        RX.Modal.dismiss(modal1Id);
    }

    private _onPinchZoomTest1(state: RX.Types.MultiTouchGestureState) {
        // Determine ratio of distance to initial distance.
        let zoomRatio = state.distance / state.initialDistance;

        // Clamp to range [0.25, 2].
        zoomRatio = Math.max(Math.min(zoomRatio, 2), 0.25);
        this._test1ScaleNumericValue = zoomRatio;
        this._test1ScaleValue.setValue(zoomRatio);
    }

    private _onRotateTest1(state: RX.Types.MultiTouchGestureState) {
        let relativeAngle = state.angle - state.initialAngle;

        this._test1RotateValue.setValue(relativeAngle);
    }

    private _onDoubleTapTest1(state: RX.Types.TapGestureState) {
        // Change the color.
        this.setState({
            test1ColorIndex: (this.state.test1ColorIndex + 1) % _colors.length
        });
    }

    private _onScrollWheelTest1(state: RX.Types.ScrollWheelGestureState) {
        let zoomRatio = this._test1ScaleNumericValue;
        zoomRatio *= Math.pow(1.01, state.scrollAmount);

        zoomRatio = Math.max(Math.min(zoomRatio, 2), 0.25);
        this._test1ScaleNumericValue = zoomRatio;
        this._test1ScaleValue.setValue(zoomRatio);
    }

    private _onTapTest2(gestureState: RX.Types.TapGestureState) {
        // Change the color.
        this.setState({
            test2ColorIndex: (this.state.test2ColorIndex + 1) % _colors.length
        });
    }

    private _onPanHorizontalTest2(state: RX.Types.PanGestureState) {
        if (state.isComplete) {
            this._test2HorizontalOffset.setValue(0);
        } else {
            this._test2HorizontalOffset.setValue(state.pageX - state.initialPageX);
        }
    }

    private _onPanVerticalTest2(state: RX.Types.PanGestureState) {
        if (state.isComplete) {
            this._test2VerticalOffset.setValue(0);
        } else {
            this._test2VerticalOffset.setValue(state.pageY - state.initialPageY);
        }
    }

    private _onPanTest3(state: RX.Types.PanGestureState) {
        if (state.isComplete) {
            this._test3HorizontalOffset.setValue(0);
            this._test3VerticalOffset.setValue(0);
        } else {
            this._test3HorizontalOffset.setValue(state.pageX - state.initialPageX);
            this._test3VerticalOffset.setValue(state.pageY - state.initialPageY);
        }
    }

    private _onLongPressTest3 = (state: RX.Types.TapGestureState) => {
        // Change the color.
        this.setState({
            test3ColorIndex: (this.state.test3ColorIndex + 1) % _colors.length
        });
    }

    private _onTapTest4(gestureState: RX.Types.TapGestureState) {
        // Change the color.
        this.setState({
            test4ColorIndex: Math.min(this.state.test4ColorIndex + 1, _shades.length - 1)
        });
    }

    private _onContextMenu4(gestureState: RX.Types.TapGestureState) {
        this.setState({
            test4ColorIndex: Math.max(this.state.test4ColorIndex - 1, 0)
        });
    }
}

class GestureViewTest implements Test {
    useFullScreenContainer = true;

    getPath(): string {
        return 'Components/GestureView';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <GestureViewView ref={ onMount }/>
        );
    }
}

export default new GestureViewTest();
