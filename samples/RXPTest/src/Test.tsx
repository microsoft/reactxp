/*
* A base class for all tests.
*/

import RX = require('reactxp');

export const enum TestType {
    // The test needs to be executed but requires no user interaction or validation
    AutoExecutable,

    // The test requires interaction with the user for validation
    Interactive
}

export class TestResult {
    constructor() {
        this.errors = [];
        this.userValidated = false;
    }

    errors: string[];
    userValidated: boolean;
}

export interface Test {
    // Returns slash-delimited path of the test (e.g. "Components/View/OnPress")
    getPath(): string;

    // Returns the type of test
    getTestType(): TestType;

    // Optional value that allows a test to specify that the test container
    // should be a full-screen view rather than a scrolling view (which
    // accommodates arbitrary-sized contents).
    useFullScreenContainer?: boolean;

    // Renders the UI for the test
    render(onMount: (component: any) => void): RX.Types.ReactNode;
}

export interface AutoExecutableTest extends Test {
    // Runs the test, calling back the "complete" callback when finished
    execute(component: any, complete: (result: TestResult) => void): void;
}
