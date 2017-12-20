/*
* A registry of all tests indexed by path along with
* the last result of each test run.
*/

import { Test, TestResult } from './Test';

import ViewBasicTest from './Tests/ViewBasicTest';
import StorageTest from './Tests/StorageTest';

class TestRegistry {
    private _tests: {[path: string]: Test } = {};
    private _results: {[path: string]: TestResult } = {};
    
    constructor() {
        // API tests
        this.registerTest(StorageTest);

        // Component tests
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
