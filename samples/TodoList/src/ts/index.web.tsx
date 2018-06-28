/**
* index.web.tsx
* Copyright: Microsoft 2018
*
* Javascript main entry point for web app.
*/

import AppBootstrapperWeb from './app/AppBootstrapperWeb';

// This prevents bundlers/optimizers from stripping out the import above.
if (AppBootstrapperWeb) {
    console.log('App started');
}
