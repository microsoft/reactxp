/*
* A view that includes a list of all tests, allowing the user to
* select or deselect particular tests and run them.
*/

import RX = require('reactxp');

import { Test } from './Test';
import TestRegistry from './TestRegistry';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    }),
    header: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        flex: 0,
        backgroundColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }),
    button: RX.Styles.createButtonStyle({
        flex: 0,
        margin: 8,
        height: 28,
        backgroundColor: '#aaa',
        borderRadius: 8
    }),
    buttonText: RX.Styles.createTextStyle({
        fontSize: 16,
        marginHorizontal: 12
    }),
    scrollView: RX.Styles.createScrollViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    }),
    itemContainer: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        height: 32,
        justifyContent: 'center',
        cursor: 'pointer'
    }),
    itemContainerSelected: RX.Styles.createViewStyle({
        backgroundColor: '#ccccff'
    }),
    itemText: RX.Styles.createTextStyle({
        fontSize: 16,
        marginHorizontal: 12
    })
};

export interface TestListViewState {
    selected?: {[path: string]: boolean };
}

export class TestListView extends RX.Component<RX.CommonProps, TestListViewState> {
    private _tests: Test[];

    constructor(props: RX.CommonProps) {
        super(props);

        this._tests = TestRegistry.getTests();

        this.state = {
            selected: {}
        }

        // By default, select all
        this._tests.forEach(test => {
            this.state.selected[test.getPath()] = true;
        });
    }

    render() {
        let testListItems: JSX.Element[] = this._tests.map((test, index) => {
            let testPath = test.getPath();
            return (
                <RX.View
                    style={ [_styles.itemContainer, this.state.selected[testPath] && _styles.itemContainerSelected] }
                    key={ index }
                    onPress={ () => this._toggleSelection(testPath) }
                >
                    <RX.Text style={ _styles.itemText }>
                        { test.getPath().replace(/\//ig, ' - ') }
                    </RX.Text>
                </RX.View>
            );
        });

        return (
            <RX.View style={ _styles.container }>
                <RX.View style={ _styles.header }>
                    <RX.Button style={ _styles.button } onPress={ this._selectAll }>
                        <RX.Text style={ _styles.buttonText }>
                            { 'Select All' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Button style={ _styles.button } onPress={ this._clearAll }>
                        <RX.Text style={ _styles.buttonText }>
                            { 'Clear All' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Button style={ _styles.button } onPress={ this._runSelected }>
                        <RX.Text style={ _styles.buttonText }>
                            { 'Run Selected' }
                        </RX.Text>
                    </RX.Button>
                </RX.View>
                <RX.View>
                    <RX.ScrollView style={ _styles.scrollView }>
                        { testListItems }
                    </RX.ScrollView>
                </RX.View>
            </RX.View>
        );
    }

    private _selectAll = (e: RX.Types.SyntheticEvent) => {
        let newState: TestListViewState = {};
        newState.selected = {};
        this._tests.forEach(test => {
            newState.selected[test.getPath()] = true;
        });
        this.setState(newState);
    }

    private _clearAll = (e: RX.Types.SyntheticEvent) => {
        let newState: TestListViewState = {};
        newState.selected = {};
        this.setState(newState);
    }

    private _toggleSelection(path: string) {
        let newState: TestListViewState = {};
        newState.selected = {};
        this._tests.forEach(test => {
            let p = test.getPath();
            newState.selected[test.getPath()] = p === path ?
                !this.state.selected[p] : this.state.selected[p];
        });
        this.setState(newState);
    }

    private _runSelected = (e: RX.Types.SyntheticEvent) => {
        
    }
}
