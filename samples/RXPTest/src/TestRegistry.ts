/*
* A registry of all tests indexed by path along with
* the last result of each test run.
*/

import { Test, TestResult } from './Test';

import AccessibilityTest from './Tests/AccessibilityTest';
import AlertTest from './Tests/AlertTest';
import AppTest from './Tests/AppTest';
import ActivityIndicatorTest from './Tests/ActivityIndicatorTest';
import AnimationTest from './Tests/AnimationTest';
import ButtonTest from './Tests/ButtonTest';
import ClipboardTest from './Tests/ClipboardTest';
import DragAndDropTest from './Tests/DragAndDropTest';
import GestureViewTest from './Tests/GestureViewTest';
import ImageApiTest from './Tests/ImageApiTest';
import ImageInteractiveTest from './Tests/ImageInteractiveTest';
import InputTest from './Tests/InputTest';
import InternationalTest from './Tests/InternationalTest';
import LinkTest from './Tests/LinkTest';
import LinkingTest from './Tests/LinkingTest';
import LocationTest from './Tests/LocationTest';
import ModalTest from './Tests/ModalTest';
import NetworkTest from './Tests/NetworkTest';
import PickerTest from './Tests/PickerTest';
import PlatformTest from './Tests/PlatformTest';
import PopupTest from './Tests/PopupTest';
import ScrollViewBasicTest from './Tests/ScrollViewBasicTest';
import ScrollViewEventTest from './Tests/ScrollViewEventTest';
import StatusBarTest from './Tests/StatusBarTest';
import StorageTest from './Tests/StorageTest';
import TextTest from './Tests/TextTest';
import TextInputApiTest from './Tests/TextInputApiTest';
import TextInputInteractiveTest from './Tests/TextInputInteractiveTest';
import UserInterfaceTest from './Tests/UserInterfaceTest';
import UserPresenceTest from './Tests/UserPresenceTest';
import ViewBasicTest from './Tests/ViewBasicTest';
import ViewMouseTest from './Tests/ViewMouseTest';
import ViewTouchTest from './Tests/ViewTouchTest';
import WebViewBasicTest from './Tests/WebViewBasicTest';
import WebViewDynamicTest from './Tests/WebViewDynamicTest';

class TestRegistry {
    private _tests: {[path: string]: Test } = {};
    private _results: {[path: string]: TestResult } = {};

    constructor() {
        // API tests
        this.registerTest(AccessibilityTest);
        this.registerTest(AlertTest);
        this.registerTest(AnimationTest);
        this.registerTest(AppTest);
        this.registerTest(ClipboardTest);
        this.registerTest(DragAndDropTest);
        this.registerTest(InputTest);
        this.registerTest(InternationalTest);
        this.registerTest(LinkingTest);
        this.registerTest(LocationTest);
        this.registerTest(ModalTest);
        this.registerTest(NetworkTest);
        this.registerTest(PlatformTest);
        this.registerTest(PopupTest);
        this.registerTest(StatusBarTest);
        this.registerTest(StorageTest);
        this.registerTest(UserInterfaceTest);
        this.registerTest(UserPresenceTest);

        // Component tests
        this.registerTest(ActivityIndicatorTest);
        this.registerTest(ButtonTest);
        this.registerTest(GestureViewTest);
        this.registerTest(ImageApiTest);
        this.registerTest(ImageInteractiveTest);
        this.registerTest(LinkTest);
        this.registerTest(PickerTest);
        this.registerTest(ScrollViewBasicTest);
        this.registerTest(ScrollViewEventTest);
        this.registerTest(TextTest);
        this.registerTest(TextInputApiTest);
        this.registerTest(TextInputInteractiveTest);
        this.registerTest(ViewBasicTest);
        this.registerTest(ViewMouseTest);
        this.registerTest(ViewTouchTest);
        this.registerTest(WebViewBasicTest);
        this.registerTest(WebViewDynamicTest);

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
