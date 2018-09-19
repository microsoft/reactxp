/**
 * Main entry point for sample image fetching app.
 */

import * as RX from 'reactxp';
import RootView from './views/RootView';

class App {
    init() {
        RX.App.initialize(true, true);
        RX.UserInterface.setMainView(this._renderRootView());
    }

    private _renderRootView() {
        return (
            <RootView />
        );
    }
}

export default new App();
