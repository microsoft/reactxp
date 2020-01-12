/*
 * Interfaces.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Interface definition for cross-platform ReactXP plugin for a control that allows the
 * display of an independent web page. This was extracted from the reactxp core
 */

import * as Types from './Types';

export interface PluginInterface {
    Types: typeof Types;

    default: typeof Types.WebView;
}
