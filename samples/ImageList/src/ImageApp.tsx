/*
* Main entry point for sample image fetching app.
*/

import RX = require('reactxp');

import ImageListPanel = require('./ImageListPanel');

class ImageApp {
    init() {
        RX.App.initialize(true, true);
        RX.UserInterface.setMainView(this._renderRootView());
    }

    private _renderRootView() {
        return (
            <ImageListPanel />
        );
    }
}

export = new ImageApp();

