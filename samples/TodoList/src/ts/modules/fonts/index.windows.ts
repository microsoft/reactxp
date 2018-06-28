/**
* index.windows.ts
* Copyright: Microsoft 2018
*
* Windows implementation of "fonts" module.
*/

import { FontBase } from './Fonts';

class Fonts implements FontBase {
    monospace = 'Courier New';

    displayLight = 'Segoe UI';
    displayRegular = 'Segoe UI';
    displaySemibold = 'Segoe UI';
    displayBold = 'Segoe UI';
}

export default new Fonts();
