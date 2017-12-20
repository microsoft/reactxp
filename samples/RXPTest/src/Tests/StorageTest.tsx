/*
* Tests the basic functionality of a Storage APIs.
*/

import RX = require('reactxp');

import { Test, TestResult } from '../Test'

const _storageKey = 'storageKey1';

class StorageBasicTest implements Test {
    getPath(): string {
        return 'APIs/Storage/Basic';
    }
    
    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <RX.View ref={ onMount } />
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
