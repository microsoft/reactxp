/*
* Tests the functionality of a ScrollView event callbacks
* through user interaction.
*
* We need to split the ScrollView tests into multiple pages because
* we can't embed ScrollViews within a parent ScrollView.
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
    scrollViewContainer: RX.Styles.createViewStyle({
        margin: 12,
        alignSelf: 'stretch',
        height: 150,
        width: 320
    }),
    scrollView1: RX.Styles.createScrollViewStyle({
        alignSelf: 'stretch'
    }),
    numberText: RX.Styles.createTextStyle({
        fontSize: 24
    }),
    numberItem: RX.Styles.createViewStyle({
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center'
    }),
    labelText: RX.Styles.createTextStyle({
        marginVertical: 8,
        marginHorizontal: 24,
        fontSize: CommonStyles.generalFontSize
    })
};

const _colors = ['red', 'green', 'blue'];

interface ScrollViewState {
    test1ScrollTop: number;
    test1ContentWidth: number;
    test1ContentHeight: number;
    test1ItemCount: number;
    test1DragStartTime: number;
    test1DragEndTime: number;
}

class ScrollViewView extends RX.Component<RX.CommonProps, ScrollViewState> {
    private _isMounted = false;
    private _test1Timer: number | undefined;

    private _scrollAnimEventValue = RX.Animated.createValue(0);
    private _coupledOpacityValue = this._scrollAnimEventValue.interpolate({
        inputRange: [0, 500],
        outputRange: [1, 0.2]
    });
    private _coupledTranslateXValue = this._scrollAnimEventValue.interpolate({
        inputRange: [0, 500],
        outputRange: [500, 0]
    });
    private _coupledAnimStyle = RX.Styles.createAnimatedViewStyle({
        opacity: this._coupledOpacityValue,
        transform: [{ translateX: this._coupledTranslateXValue }]
    });

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            test1ScrollTop: 0,
            test1ContentWidth: 0,
            test1ContentHeight: 0,
            test1ItemCount: 20,
            test1DragStartTime: 0,
            test1DragEndTime: 0
        };
    }

    componentDidMount() {
        this._isMounted = true;

        // Start a timer to update the number of items to display.
        this._test1Timer = window.setInterval(() => {
            // Go from 20 to 29
            this.setState({
                test1ItemCount: (this.state.test1ItemCount + 1) % 10 + 20
            });
        }, 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;

        window.clearInterval(this._test1Timer);
    }

    render() {
        let numberItems: JSX.Element[] = [];
        for (let i = 0; i < this.state.test1ItemCount; i++) {
            numberItems.push(
                <RX.View style={ _styles.numberItem } key={ 'Item' + i }>
                    <RX.Text style={ _styles.numberText }>
                        { 'List item ' + i }
                    </RX.Text>
                </RX.View>
            );
        }

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This scroll view has 20px indicator insets.' +
                          'Has event handlers for scroll begin/end, scroll (throttled ' +
                          'to 1 sec) and content size changes. Content size should ' +
                          'change each second.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.scrollViewContainer }>
                    <RX.ScrollView
                        style={ _styles.scrollView1 }
                        scrollEventThrottle={ 1000 }
                        scrollIndicatorInsets={ { top: 20, left: 0, bottom: 20, right: 0 } }
                        onScroll={ this._onScrollTest1 }
                        scrollYAnimatedValue={ this._scrollAnimEventValue }
                        onContentSizeChange={ this._onContentSizeChangeTest1 }
                        onScrollBeginDrag={ this._onScrollBeginDragTest1 }
                        onScrollEndDrag={ this._onScrollEndDragTest1 }
                    >
                        <RX.View>
                            { numberItems }
                        </RX.View>
                    </RX.ScrollView>
                </RX.View>
                <RX.Animated.View style={ this._coupledAnimStyle }>
                    <RX.Text style={ _styles.labelText }>
                        { 'This should move left and go translucent as you scroll.' }
                    </RX.Text>
                </RX.Animated.View>
                <RX.View>
                    <RX.Text style={ _styles.labelText }>
                        { 'Scroll top: ' + this.state.test1ScrollTop }
                    </RX.Text>
                </RX.View>
                <RX.View>
                    <RX.Text style={ _styles.labelText }>
                        { 'Content size: W=' + this.state.test1ContentWidth +
                            ' H=' + this.state.test1ContentHeight }
                    </RX.Text>
                </RX.View>
                <RX.View>
                    <RX.Text style={ _styles.labelText }>
                        { 'Drag start time: ' + this.state.test1DragStartTime }
                    </RX.Text>
                </RX.View>
                <RX.View>
                    <RX.Text style={ _styles.labelText }>
                        { 'Drag end time: ' + this.state.test1DragEndTime }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    private _onScrollTest1 = (newScrollTop: number, newScrollLeft: number) => {
        this.setState({
            test1ScrollTop: newScrollTop
        });
    }

    private _onContentSizeChangeTest1 = (width: number, height: number) => {
        this.setState({
            test1ContentWidth: width,
            test1ContentHeight: height
        });
    }

    private _onScrollBeginDragTest1 = () => {
        this.setState({
            test1DragStartTime: Date.now()
        });
    }

    private _onScrollEndDragTest1 = () => {
        this.setState({
            test1DragEndTime: Date.now()
        });
    }
}

// TODO: need to add tests for the following props
// showsHorizontalScrollIndicator?: boolean;
// showsVerticalScrollIndicator?: boolean;
// scrollEnabled?: boolean;
// keyboardDismissMode?: 'none' | 'interactive' | 'on-drag';
// keyboardShouldPersistTaps?: boolean;

// TODO: need to add tests for the following methods
// focus
// setScrollLeft
// setScrollTop

class ScrollViewTest implements Test {
    useFullScreenContainer = true;

    getPath(): string {
        return 'Components/ScrollView/Events';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ScrollViewView ref={ onMount }/>
        );
    }
}

export default new ScrollViewTest();
