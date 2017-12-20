/*
* A registry of all tests indexed by path.
*/

import { Test } from './Test';

import ViewBasicTest from './Tests/ViewBasicTest';

class TestRegistry {
    private _tests: Test[] = [];

    constructor() {
        this.registerTest(ViewBasicTest);

        // Add more tests here...
    }

    registerTest(test: Test) {
        this._tests.push(test);
    }

    getTests(): Test[] {
        return this._tests;
    }
}

export default new TestRegistry();
