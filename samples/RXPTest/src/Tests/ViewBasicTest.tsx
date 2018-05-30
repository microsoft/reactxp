/*
* Tests the basic functionality of a View component.
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
    view1: RX.Styles.createViewStyle({
        margin: 20,
        backgroundColor: '#ccf'
    }),
    view2: RX.Styles.createViewStyle({
        margin: 20,
        backgroundColor: 'orange',
        borderWidth: 2,
        borderColor: 'black'
    }),
    view3: RX.Styles.createViewStyle({
        margin: 20,
        backgroundColor: 'yellow',
        borderWidth: 1,
        borderColor: 'green',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 4,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }),
    view4: RX.Styles.createViewStyle({
        backgroundColor: 'green',
        width: 50,
        height: 50,
        margin: 20,
        shadowColor: 'red',
        shadowOffset: { width: 1, height: 4 },
        shadowRadius: 5
    }),
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    labelContainer: RX.Styles.createViewStyle({
        alignSelf: 'center',
        margin: 8
    }),
    labelText: RX.Styles.createTextStyle({
        margin: 8,
        fontSize: CommonStyles.generalFontSize,
    })
};

function accessibilityLabelAndImportantForAccessibilityTestUI(important: RX.Types.ImportantForAccessibility) {
    return (
        <RX.View
            style={ _styles.labelContainer }
            importantForAccessibility={ important }
        >
            <RX.View
                style={ _styles.labelContainer }
                importantForAccessibility={ RX.Types.ImportantForAccessibility.Auto}
            >
                <RX.Text style={ _styles.labelText }>
                    { 'Alpha' }
                </RX.Text>
            </RX.View>
            <RX.View style={ _styles.labelContainer }>
                <RX.View
                    style={ _styles.labelContainer }
                    importantForAccessibility={ RX.Types.ImportantForAccessibility.No }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'Beta' }
                    </RX.Text>
                </RX.View>
                <RX.View
                    style={ _styles.labelContainer }
                    accessibilityLabel={ 'Gamma' }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'Orange' }
                    </RX.Text>
                </RX.View>
            </RX.View>
            <RX.Text style={ _styles.labelText }>
                { 'Delta' }
            </RX.Text>
            <RX.View
                style={ _styles.labelContainer }
                importantForAccessibility={ RX.Types.ImportantForAccessibility.NoHideDescendants }
            >
                <RX.View
                    style={ _styles.labelContainer }
                    importantForAccessibility={ RX.Types.ImportantForAccessibility.Yes }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'Epsilon' }
                    </RX.Text>
                </RX.View>
            </RX.View>
        </RX.View>
    );
}

class BasicView extends RX.Component<RX.CommonProps, RX.Stateless> {
    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'A variety of views with different styles should appear below. ' +
                          'Interact with them to test.' }
                    </RX.Text>
                </RX.View>
                <RX.View
                    style={ _styles.view1 }
                    shouldRasterizeIOS={ true }
                    viewLayerTypeAndroid={ 'hardware' }
                    tabIndex={ 1 }
                    title={ 'shouldRasterizeIOS = true\nviewLayerTypeAndroid = true' }
                    onLongPress={ () => {
                        // no-op
                    } }
                    id={ 'testId' }
                    ariaLabelledBy={ 'aria label' }
                    ariaRoleDescription={ 'custom role' }
                    accessibilityLabel={ 'accessibility label' }
                    accessibilityLiveRegion={ RX.Types.AccessibilityLiveRegion.Polite }
                    importantForAccessibility={ RX.Types.ImportantForAccessibility.Yes }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'Long press me' }
                    </RX.Text>
                </RX.View>

                <RX.View
                    style={ _styles.view2 }
                    onPress={ () => {
                        // no-op
                    } }
                    activeOpacity={ 0.5 }
                    underlayColor={ '#fee' }
                    tabIndex={ 3 }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'Press me' }
                    </RX.Text>
                </RX.View>

                <RX.View
                    style={ _styles.view3 }
                    onPress={ () => {
                        // no-op
                    } }
                    disableTouchOpacityAnimation={ true }
                    tabIndex={ 2 }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'Press me (no opacity change)\n' +
                          'I have differing border radii' }
                    </RX.Text>
                </RX.View>

                {/* View's accessibilityLabel (both explicit and automatic recursive generation)
                  * and importantForAccessibility all possible values and hierarchical combinations. */}

                <RX.View
                    style={ _styles.explainTextContainer }
                    key={ 'explanation2' }
                >
                    <RX.Text style={ _styles.explainText }>
                        { 'Should be read by screen reader as a single text element \"Alpha Beta Gamma Delta\" ' +
                          'and screen reader should not be able to get to individual texts.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    { accessibilityLabelAndImportantForAccessibilityTestUI(RX.Types.ImportantForAccessibility.Yes) }
                </RX.View>

                <RX.View
                    style={ _styles.explainTextContainer }
                    key={ 'explanation3' }
                >
                    <RX.Text style={ _styles.explainText }>
                        { 'Should be read by screen reader as four separate text elements: ' +
                          '\"Alpha\", \"Beta\", \"Gamma\", \"Delta\".' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    { accessibilityLabelAndImportantForAccessibilityTestUI(RX.Types.ImportantForAccessibility.No) }
                </RX.View>

                <RX.View
                    style={ _styles.explainTextContainer }
                    key={ 'explanation4' }
                >
                    <RX.Text style={ _styles.explainText }>
                        { 'Box shadow can be applied with the shadow props.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.view4 } />
            </RX.View>
        );
    }
}

// TODO - need to add tests for the following props:
// blockPointerEvents: boolean = false; // iOS and Android only
// ignorePointerEvents: boolean = false; // web only
// restrictFocusWithin: boolean = false; // web only
// limitFocusWithin: LimitFocusType = LimitFocusType.Unlimited;
// importantForLayout: boolean = false; // web only
// onDragEnter: (e: DragEvent) => void = undefined;
// onDragOver: (e: DragEvent) => void = undefined;
// onDragLeave: (e: DragEvent) => void = undefined;
// onDrop: (e: DragEvent) => void = undefined;
// onContextMenu: (e: React.SyntheticEvent) => void;
// onMoveShouldSetResponder: (e: React.SyntheticEvent) => boolean =
// onMoveShouldSetResponderCapture: (e: React.SyntheticEvent) => boolean =
// onResponderGrant: (e: React.SyntheticEvent) => void = undefined;
// onResponderReject: (e: React.SyntheticEvent) => void = undefined;
// onResponderRelease: (e: React.SyntheticEvent) => void = undefined;
// onResponderStart: (e: React.TouchEvent) => void = undefined;
// onResponderMove: (e: React.TouchEvent) => void = undefined;
// onResponderEnd: (e: React.TouchEvent) => void = undefined;
// onResponderTerminate: (e: React.SyntheticEvent) => void = undefined;
// onResponderTerminationRequest: (e: React.SyntheticEvent) => boolean =
// onStartShouldSetResponder: (e: React.SyntheticEvent) => boolean =
// onStartShouldSetResponderCapture: (e: React.SyntheticEvent) => boolean =
// onLayout: (e: ViewOnLayoutEvent) => void = undefined;

// TODO - need to add tests for the following methods:
// focus
// setFocusRestricted
// setFocusLimited

class ViewBasicTest implements Test {
    getPath(): string {
        return 'Components/View/Basic';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <BasicView ref={ onMount }/>
        );
    }
}

export default new ViewBasicTest();
