/*
* Tests the functionality of a GestureView component 
* through user interaction.
*/

import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';
import { MultiTouchGestureState } from 'reactxp/dist/common/Types';

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
    })
};

const _colors = ['red', 'green', 'blue'];

interface GestureViewState {
    test1ColorIndex?: number;
    test2ColorIndex?: number;
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

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            test1ColorIndex: 0,
            test2ColorIndex: 1
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
                        { 'Panning and dragging will move the square (20-pixel threshold).' }
                    </RX.Text>
                </RX.View>
                <RX.GestureView
                    style={ _styles.gestureView }
                    onPan={ state => this._onPanTest3(state) }
                    panPixelThreshold={ 20 }
                    mouseOverCursor={ RX.Types.GestureMouseCursor.Grab }
                >
                    <RX.Animated.View
                        style={ [_styles.smallBox, this._test3AnimatedStyle] }
                    />
                </RX.GestureView>
            </RX.View>
        );
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
