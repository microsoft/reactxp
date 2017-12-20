/*
* This file provides a test framework for ReactXP.
*/

import RX = require('reactxp');
import { TestListView } from './TestListView';

class App extends RX.Component<{}, null> {
    render(): RX.Types.ReactNode {
        return <TestListView/>;
    }
}

export = App;
