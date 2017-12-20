/*
* Tests the basic functionality of a View component.
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
    view1: RX.Styles.createViewStyle({
        width: 40,
        height: 40,
        margin: 20,
        backgroundColor: 'blue'
    }),
    view2: RX.Styles.createViewStyle({
        width: 40,
        height: 60,
        margin: 20,
        backgroundColor: 'orange',
        borderWidth: 2,
        borderColor: 'black'
    }),
    view3: RX.Styles.createViewStyle({
        width: 60,
        height: 40,
        margin: 20,
        backgroundColor: 'yellow',
        borderWidth: 1,
        borderColor: 'green',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 4,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 10
    }),
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    })
};

class BasicView extends RX.Component<RX.CommonProps, RX.Stateless> {
    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'A variety of views with different styles should appear below' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.view1 }/>
                <RX.View style={ _styles.view2 }/>
                <RX.View style={ _styles.view3 }/>
            </RX.View>
        );
    }
}

class ViewBasicTest implements Test {
    getPath(): string {
        return 'Components/View/Basic';
    }
    
    getTestType(): TestType {
        return TestType.RenderOnly;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <BasicView ref={ onMount }/>
        );
    }
}

export default new ViewBasicTest();