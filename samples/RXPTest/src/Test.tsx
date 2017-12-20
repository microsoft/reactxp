/*
* A base class for all tests.
*/

import RX = require('reactxp');

export class TestResult {
    constructor() {
        this.warnings = [];
        this.errors = [];
    }

    warnings: string[];
    errors: string[];
}

export interface Test {
    // Returns slash-delimited path of the test (e.g. "Components/View/OnPress")
    getPath(): string;

    // Renders the UI for the test
    render(onMount: (component: any) => void): RX.Types.ReactNode;

    // Runs the test, calling back the "complete" callback when finished
    execute(component: any, complete: (result: TestResult) => void): void;
}
