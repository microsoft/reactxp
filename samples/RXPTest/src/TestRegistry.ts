/*
* A registry of all tests indexed by path along with
* the last result of each test run.
*/

import { Test, TestResult } from './Test';

import ActivityIndicatorTest from './Tests/ActivityIndicatorTest';
import ButtonBasicTest from './Tests/ButtonBasicTest';
import ButtonInteractiveTest from './Tests/ButtonInteractiveTest';
import InputTest from './Tests/InputTest';
import PlatformTest from './Tests/PlatformTest';
import StatusBarTest from './Tests/StatusBarTest';
import StorageTest from './Tests/StorageTest';
import ViewBasicTest from './Tests/ViewBasicTest';

class TestRegistry {
    private _tests: {[path: string]: Test } = {};
    private _results: {[path: string]: TestResult } = {};
    
    constructor() {
        // API tests
        this.registerTest(InputTest);
        this.registerTest(PlatformTest);
        this.registerTest(StatusBarTest);
        this.registerTest(StorageTest);
        
        // Component tests
        this.registerTest(ActivityIndicatorTest);
        this.registerTest(ButtonBasicTest);
        this.registerTest(ButtonInteractiveTest);
        this.registerTest(ViewBasicTest);

        // Add more tests here...
    }

    registerTest(test: Test) {
        this._tests[test.getPath()] = test;
    }

    getAllTests(): {[path: string]: Test } {
        return this._tests;
    }

    getTest(path: string): Test {
        return this._tests[path];
    }

    getResult(path: string): TestResult {
        return this._results[path];
    }

    setResult(path: string, result: TestResult): void {
        this._results[path] = result;
    }

    formatPath(path: string): string {
        return path.replace(/\//ig, ' - ');
    }
}

export default new TestRegistry();
