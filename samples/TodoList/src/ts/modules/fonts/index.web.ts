/**
* index.web.ts
* Copyright: Microsoft 2018
*
* Web implementation of "fonts" module.
*/

import { FontBase } from './Fonts';

class Fonts implements FontBase {
    monospace = 'monospace';

    displayLight = '"SF Semilight", "Segoe System UI Semilight", "Segoe UI Semilight", sans-serif';
    displayRegular = '"SF Regular", "Segoe System UI Regular", "Segoe UI Regular", sans-serif';
    displaySemibold = '"SF Semibold", "Segoe System UI Semibold", "Segoe UI Semibold", sans-serif';
    displayBold = '"SF Bold", "Segoe System UI Bold", "Segoe UI Bold", sans-serif';
}

export default new Fonts();
