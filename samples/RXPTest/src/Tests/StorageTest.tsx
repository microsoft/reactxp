/*
* Tests the basic functionality of a Storage APIs.
*/

import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { AutoExecutableTest, TestResult, TestType } from '../Test';

const _storageKey = 'storageKey1';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center'
    }),
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    })
};

class StorageBasicTest implements AutoExecutableTest {
    getPath(): string {
        return 'APIs/Storage';
    }

    getTestType(): TestType {
        return TestType.AutoExecutable;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <RX.View style={ _styles.container} ref={ onMount }>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'When the test is run, the storage APIs will be used to store, retrieve, delete and clear key/value pairs' }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        let results = new TestResult();

        RX.Storage.setItem(_storageKey, 'value1').then(() => {
            return RX.Storage.getItem(_storageKey).then(value => {
                if (value !== 'value1') {
                    results.errors.push('RX.Storage.getItem returned unexpected value: "' +
                        value + '"; expected value1');
                }
                return RX.Storage.setItem(_storageKey, 'value2');
            }).then(() => {
                return RX.Storage.getItem(_storageKey);
            }).then(value => {
                if (value !== 'value2') {
                    results.errors.push('RX.Storage.getItem returned unexpected value: "' +
                        value + '"; expected value2');
                }

                return RX.Storage.removeItem(_storageKey);
            }).then(() => {
                return RX.Storage.getItem(_storageKey);
            }).then(value => {
                if (value !== undefined) {
                    results.errors.push('RX.Storage.getItem returned unexpected value: "' +
                        value + '" after removing key; expected undefined');
                }

                return RX.Storage.setItem(_storageKey, 'value3');
            }).then(() => {
                return RX.Storage.clear();
            }).then(() => {
                return RX.Storage.getItem(_storageKey);
            }).then(value => {
                if (value !== undefined) {
                    results.errors.push('RX.Storage.getItem returned unexpected value: "' +
                        value + '" after clearing all keys; expected undefined');
                }
            });
        }).catch(error => {
            results.errors.push('Received unexpected error from RX.Storage');
        }).always(() => {
            complete(results);
        });
    }
}

export default new StorageBasicTest();
