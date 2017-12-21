/*
* A registry of all tests indexed by path along with
* the last result of each test run.
*/

import { Test, TestResult } from './Test';

import AccessibilityTest from './Tests/AccessibilityTest';
import AlertTest from './Tests/AlertTest';
import AppTest from './Tests/AppTest';
import ActivityIndicatorTest from './Tests/ActivityIndicatorTest';
import ButtonBasicTest from './Tests/ButtonBasicTest';
import ButtonInteractiveTest from './Tests/ButtonInteractiveTest';
import ClipboardTest from './Tests/ClipboardTest';
import InputTest from './Tests/InputTest';
import InternationalTest from './Tests/InternationalTest';
import LinkingTest from './Tests/LinkingTest';
import LocationTest from './Tests/LocationTest';
import ModalTest from './Tests/ModalTest';
import PlatformTest from './Tests/PlatformTest';
import StatusBarTest from './Tests/StatusBarTest';
import StorageTest from './Tests/StorageTest';
import UserPresenceTest from './Tests/UserPresenceTest';
import ViewBasicTest from './Tests/ViewBasicTest';

class TestRegistry {
    private _tests: {[path: string]: Test } = {};
    private _results: {[path: string]: TestResult } = {};
    
    constructor() {
        // API tests
        this.registerTest(AccessibilityTest);
        this.registerTest(AlertTest);
        this.registerTest(AppTest);
        this.registerTest(ClipboardTest);
        this.registerTest(InputTest);
        this.registerTest(InternationalTest);
        this.registerTest(LinkingTest);
        this.registerTest(LocationTest);
        this.registerTest(ModalTest);
        this.registerTest(PlatformTest);
        this.registerTest(StatusBarTest);
        this.registerTest(StorageTest);
        this.registerTest(UserPresenceTest);
        
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
