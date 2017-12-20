/*
* Tests the basic functionality of a View component.
*/

import RX = require('reactxp');

import { Test, TestResult } from '../Test'

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'green'
    })
};

class BasicView extends RX.Component<{}, RX.Stateless> {
    render() {
        return (
            <RX.View style={ _styles.container}/>
        );
    }
}

class ViewBasicTest implements Test {
    getPath(): string {
        return 'Components/View/Basic';
    }
    
    render(): RX.Types.ReactNode {
        return (
            <BasicView/>
        );
    }

    execute(complete: (result: TestResult) => void): void {
        // Nothing to do but report success
        let results = new TestResult();

        complete(results);
    }
}

export default new ViewBasicTest();