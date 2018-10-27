/**
 * PopupContainerView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common parent of all components rendered into a popup, web version.
 */

import * as React from 'react';

import { Types } from '../common/Interfaces';
import { clone } from './utils/lodashMini';
import { PopupContainerViewBase, PopupContainerViewBaseProps, PopupContainerViewContext } from '../common/PopupContainerViewBase';

export interface PopupContainerViewProps extends PopupContainerViewBaseProps {
    style: React.CSSProperties;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export class PopupContainerView extends PopupContainerViewBase<PopupContainerViewProps, Types.Stateless> {
    constructor(props: PopupContainerViewProps, context: PopupContainerViewContext) {
        super(props, context);
    }

    render() {
        const style = clone(this.props.style);
        if (this.props.hidden) {
            style.visibility = 'hidden';
        }
        return (
            <div
                style={ style }
                onMouseEnter={ this.props.onMouseEnter }
                onMouseLeave={ this.props.onMouseLeave }
            >
                { this.props.children }
            </div>
        );
    }
}

export default PopupContainerView;
