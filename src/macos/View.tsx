/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Mac-specific implementation of View.
*/
import React = require('react');
import Types = require('../common/Types');

import { View as ViewCommon } from '../native-common/View';

export class View extends ViewCommon {

    protected _buildInternalProps(props: Types.ViewProps) {
        // Base class does the bulk of _internalprops creation
        super._buildInternalProps(props);

        // Drag and drop related properties
        for (const name of ['onDragEnter', 'onDragOver', 'onDrop', 'onDragLeave']) {
            const handler = this._internalProps[name];

            if (handler) {
                this._internalProps.allowDrop = true;

                this._internalProps[name] = (e: React.SyntheticEvent<View>) => {
                    handler({
                        dataTransfer: (e.nativeEvent as any).dataTransfer,

                        stopPropagation() {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            }
                        },

                        preventDefault() {
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        },
                    });
                };
            }
        }
    }

}

export default View;
