/*
* Tests the basic functionality of a Button component rendering
* (without user interactions).
*/

import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test'

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'flex-start'
    }),
    button1: RX.Styles.createButtonStyle({
        margin: 20,
        padding: 12,
        alignSelf: 'stretch',
        backgroundColor: 'blue'
    }),
    button1Text: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'white'
    }),
    button2: RX.Styles.createButtonStyle({
        backgroundColor: '#ddd',
        borderWidth: 2,
        margin: 20,
        padding: 12,
        borderRadius: 8,
        borderColor: 'black'
    }),
    button2Text: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    }),
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    })
};

class ButtonView extends RX.Component<RX.CommonProps, RX.Stateless> {
    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should be blue, full width, and have left-justified text with a tooltip that says "Hello"' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button1 }
                    accessibilityLabel={ 'Label' }
                    accessibilityTraits={ RX.Types.AccessibilityTrait.Button }
                    ariaControls={ 'testId1' }
                    id={ 'testId2' }
                    importantForAccessibility={ RX.Types.ImportantForAccessibility.Yes }
                    disabled={ false }
                    shouldRasterizeIOS={ true }
                    title={ 'Hello' }
                    onPress={ () => {} }
                >
                    <RX.Text style={ _styles.button1Text }>
                        { 'Simple Text Button' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should be light gray with a rounded border and disabled' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button2 }
                    disabled={ true }
                    onPress={ () => {} }
                >
                    <RX.Text style={ _styles.button2Text }>
                        { 'Disabled Button' }
                    </RX.Text>
                </RX.Button>
            </RX.View>
        );
    }
}

class ButtonBasicTest implements Test {
    getPath(): string {
        return 'Components/Button/Basic';
    }
    
    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ButtonView ref={ onMount }/>
        );
    }
}

export default new ButtonBasicTest();