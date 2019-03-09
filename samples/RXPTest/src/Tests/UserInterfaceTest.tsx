/*
* Tests the RX.UserInterface APIs in an automated manner.
*/

import _ = require('lodash');
import RX = require('reactxp');
import SyncTasks = require('synctasks');

import * as CommonStyles from '../CommonStyles';
import { AutoExecutableTest, TestResult, TestType } from '../Test';
import { approxEquals } from '../Utilities';

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
    parentContainer: RX.Styles.createViewStyle({
        marginHorizontal: 32,
        height: 100,
        width: 100,
        padding: 12,
        backgroundColor: '#eee'
    }),
    childView: RX.Styles.createViewStyle({
        height: 24,
        width: 24,
        margin: 8,
        backgroundColor: 'red'
    })
};

interface UserInterfaceState {
}

class UserInterfaceView extends RX.Component<RX.CommonProps, UserInterfaceState> {
    private _isMounted = false;
    private _parentView: RX.View | undefined;
    private _childView: RX.View | undefined;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <RX.View style={ _styles.container }>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This test executes the various APIs in the UserInterface namespace. ' +
                          'It uses the views below to test the measurement APIs.' }
                    </RX.Text>
                </RX.View>

                <RX.View
                    style={ _styles.parentContainer }
                    ref={ (comp: any) => { this._parentView = comp; } }
                >
                    <RX.View
                        style={ _styles.childView }
                        ref={ (comp: any) => { this._childView = comp; } }
                    >
                    </RX.View>
                </RX.View>
            </RX.View>
        );
    }

    execute(complete: (result: TestResult) => void) {
        let result = new TestResult();

        // Start by calling all of the synchronous APIs.

        // We can't call setMainView because it is called as part of
        // the app's initialization.

        // We can't call useCustomScrollbars because it must be called
        // only once before setMainView.

        // measureWindow
        let screenSize = RX.UserInterface.measureWindow();

        // isHighPixelDensityScreen
        let isHighDensity = RX.UserInterface.isHighPixelDensityScreen();

        // setMaxContentSizeMultiplier
        try {
            RX.UserInterface.setMaxContentSizeMultiplier(1.3);
            RX.UserInterface.setMaxContentSizeMultiplier(0);
        } catch (e) {
            // Some versions of RN don't implement this call, which can result
            // in an exception.
            result.errors.push('Caught exception when calling RX.UserInterface.setMaxContentSizeMultiplier');
        }

        // dismissKeyboard
        RX.UserInterface.dismissKeyboard();

        // enableTouchLatencyEvents
        RX.UserInterface.enableTouchLatencyEvents(2000);
        RX.UserInterface.enableTouchLatencyEvents(0);

        // isNavigatingWithKeyboard
        let isUsingKeyboard = RX.UserInterface.isNavigatingWithKeyboard();

        // Subscribe to events
        let sizeMultiplierEvent = RX.UserInterface.contentSizeMultiplierChangedEvent.subscribe(multiplier => {
            // Nothing to do
        });
        sizeMultiplierEvent.unsubscribe();

        let touchLatencyEvent = RX.UserInterface.touchLatencyEvent.subscribe(observedLatency => {
            // Nothing to do
        });
        touchLatencyEvent.unsubscribe();

        let keyboardNavigationEvent = RX.UserInterface.keyboardNavigationEvent.subscribe(isNav => {
            // Nothing to do
        });
        keyboardNavigationEvent.unsubscribe();

        let parentAbsolute: RX.Types.LayoutInfo;
        let childAbsolute: RX.Types.LayoutInfo;
        let childRelative: RX.Types.LayoutInfo;

        // Now execute the async APIs.
        let measureTask = RX.UserInterface.measureLayoutRelativeToWindow(this._parentView!).then(layoutInfo => {
            parentAbsolute = layoutInfo;
            return RX.UserInterface.measureLayoutRelativeToWindow(this._childView!);
        }).then(layoutInfo => {
            childAbsolute = layoutInfo;
            return RX.UserInterface.measureLayoutRelativeToAncestor(this._childView!, this._parentView!);
        }).then(layoutInfo => {
            childRelative = layoutInfo;

            if (!approxEquals(parentAbsolute.width, 100) || !approxEquals(parentAbsolute.height, 100)) {
                result.errors.push(`Expected parent view to be 100x100. Got ${parentAbsolute.width}x${parentAbsolute.height}`);
            }

            if (!approxEquals(childAbsolute.width, 24) || !approxEquals(childAbsolute.height, 24)) {
                result.errors.push(`Expected child view to be 24x24. Got ${childAbsolute.width}x${childAbsolute.height}`);
            }

            const xValue = childAbsolute.x - parentAbsolute.x;
            const yValue = childAbsolute.y - parentAbsolute.y;
            if (!approxEquals(xValue, 20) || !approxEquals(yValue, 20)) {
                result.errors.push(`Expected absolute position of child view to be 20x20 from parent. Got ${xValue}x${yValue}`);
            }

            if (!approxEquals(childRelative.x, 20) || !approxEquals(childRelative.y, 20)) {
                result.errors.push(`Expected relative position of child view to be 20x20 from parent. Got ${childRelative.x}x${childRelative.y}`);
            }
        }).catch(err => {
            result.errors.push('Error occurred when measuring views.');
        });

        // Execute the content size multiplier API.
        let multiplierTask = RX.UserInterface.getContentSizeMultiplier().then(mult => {
            // Nothing to do.
        }).catch(err => {
            result.errors.push('Error occurred when calling RX.UserInterface.getContentSizeMultiplier');
        });

        // Wait for all async tasks to complete.
        SyncTasks.all([measureTask, multiplierTask]).then(() => {
            // Mark the test as complete.
            complete(result);
        });
    }
}

class UserInterfaceTest implements AutoExecutableTest {
    getPath(): string {
        return 'APIs/UserInterface';
    }

    getTestType(): TestType {
        return TestType.AutoExecutable;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <UserInterfaceView
                ref={ onMount }
            />
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        let UserInterfaceView = component as UserInterfaceView;
        UserInterfaceView.execute(complete);
    }
}

export default new UserInterfaceTest();
