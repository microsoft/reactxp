/*
* This file provides a test framework for ReactXP.
*/

import _ = require('lodash');
import RX = require('reactxp');

import { TestContainer } from './TestContainer';
import { TestListView } from './TestListView';
import TestRegistry from './TestRegistry';

interface AppState {
    selectedTest: string;
    runAll: boolean;
}

class App extends RX.Component<RX.CommonProps, AppState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            selectedTest: undefined,
            runAll: false
        };
    }

    render(): RX.Types.ReactNode {
        if (this.state.selectedTest) {
            return (
                <TestContainer
                    key={ this.state.selectedTest }
                    test={ this.state.selectedTest }
                    prevResult={ TestRegistry.getResult(this.state.selectedTest) }
                    autoRun={ this.state.runAll }
                    onBack={ this._onBack }
                />
            );
        } else {
            return (
                <TestListView
                    onSelectTest={ this._onSelectTest }
                    onRunAll={ this._onRunAll }
                />
            );
        }
    }

    private _onBack = () => {
        if (this.state.runAll) {
            let testPaths = _.keys(TestRegistry.getAllTests());
            let curTestIndex = _.indexOf(testPaths, this.state.selectedTest);

            // If there are more tests to run, move on to the next one.
            if (curTestIndex + 1 < testPaths.length) {
                this.setState({ selectedTest: testPaths[curTestIndex + 1] });
                return;
            }
        }

        // Clear the selected test.
        this.setState({ runAll: false, selectedTest: undefined });
    }

    private _onSelectTest = (path: string) => {
        this.setState({ selectedTest: path });
    }

    private _onRunAll = () => {
        let firstTest = _.first(_.keys(TestRegistry.getAllTests()));

        this.setState({ runAll: true, selectedTest: firstTest });
    }
}

export = App;
