/*
* Tests the basic functionality of a View component.
*/

import RX = require('reactxp');

import { Test, TestResult } from '../Test'

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center'
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
    })
};

class BasicView extends RX.Component<RX.CommonProps, RX.Stateless> {
    render() {
        return (
            <RX.View style={ _styles.container}>
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
    
    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <BasicView ref={ onMount }/>
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        // Nothing to do but report success
        let results = new TestResult();

        complete(results);
    }
}

export default new ViewBasicTest();