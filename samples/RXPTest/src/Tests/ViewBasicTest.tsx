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
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    labelText: RX.Styles.createTextStyle({
        margin: 8,
        fontSize: CommonStyles.generalFontSize,
    })
};

class BasicView extends RX.Component<RX.CommonProps, RX.Stateless> {
    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation' }>
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
                    onLongPress={ () => {} }
                    id={ 'testId' }
                    ariaLabelledBy={ 'aria label' }
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
                    onPress={ () => {} }
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
                    onPress={ () => {} }
                    disableTouchOpacityAnimation={ true }
                    tabIndex={ 2 }
                >
                    <RX.Text style={ _styles.labelText }>
                        { 'Press me (no opacity change)\n' +
                          'I have differing border radii' }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }
}

// TODO - need to add tests for the following props:
// blockPointerEvents: boolean = false; // iOS and Android only
// ignorePointerEvents: boolean = false; // web only
// restrictFocusWithin: boolean = false; // web only
// limitFocusWithin: boolean = false; // web only
// importantForLayout: boolean = false; // web only
// onDragEnter: (e: DragEvent) => void = undefined;
// onDragOver: (e: DragEvent) => void = undefined;
// onDragLeave: (e: DragEvent) => void = undefined;
// onDrop: (e: DragEvent) => void = undefined;
// onMouseEnter: (e: MouseEvent) => void = undefined;
// onMouseLeave: (e: MouseEvent) => void = undefined;
// onMouseMove: (e: MouseEvent) => void = undefined;
// onMouseOver: (e: MouseEvent) => void = undefined;
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
