/**
* index.native.tsx
* Copyright: Microsoft 2018
*
* Javascript main entry point for RN apps.
*/

import AppBootstrapperNative from './app/AppBootstrapperNative';

// This prevents bundlers/optimizers from stripping out the import above.
if (AppBootstrapperNative) {
    console.log('App started');
}
