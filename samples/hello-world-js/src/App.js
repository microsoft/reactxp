import * as RX from 'reactxp';
import React from 'react';

import { DEBUG, DEV	} from './config';
import { RootView } from './views/RootView';

class App {
    init() {
        RX.App.initialize(DEBUG, DEV);
        RX.UserInterface.setMainView(this._renderRootView());
    }

    _renderRootView() {
        return (
            <RootView />
        );
    }
}

export default new App();