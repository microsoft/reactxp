/**
* index.windows.js
* Copyright: Microsoft 2018
*
* Javascript main entry point for native app.
*/

var AppBootstrapperNative = require('./temp/windows/rnapp/js/app/AppBootstrapperNative.js');

// This prevents bundlers/optimizers from stripping out the import above.
if (AppBootstrapperNative) {
    console.log('App started');
}
