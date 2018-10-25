import * as React from 'react';
import * as RX from 'reactxp';
import { DEBUG, DEV	} from './config';
import { RootView } from './views/RootView';

class App {
    init() {
        RX.App.initialize(DEBUG, DEV);
        RX.UserInterface.setMainView(this._renderRootView());
    }

    private _renderRootView() {
        return (
            <RootView />
        );
    }
}

export default new App();
