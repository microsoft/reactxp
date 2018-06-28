/**
* index.native.ts
* Copyright: Microsoft 2018
*
* Native implementation of "fonts" module.
*/

import { FontBase } from './Fonts';

class Fonts implements FontBase {
    monospace = 'System';

    displayLight = 'System';
    displayRegular = 'System';
    displaySemibold = 'System';
    displayBold = 'System';
}

export default new Fonts();
