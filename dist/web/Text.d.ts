/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Text abstraction.
*/
import React = require('react');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Text extends RX.Text<void> {
    static childContextTypes: React.ValidationMap<any>;
    getChildContext(): {
        isRxParentAText: boolean;
    };
    render(): JSX.Element;
    _getStyles(): Types.TextStyleRuleSet;
    blur(): void;
    focus(): void;
}
export default Text;
