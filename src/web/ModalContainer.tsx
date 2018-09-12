/**
 * ModalContainer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of a view that's used to render modals.
 */

import * as React from 'react';

import { Types } from '../common/Interfaces';

const _styles = {
    modalContainerStyle: {
        display: 'flex',
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: '1 1 auto',
        alignSelf: 'stretch',
        overflow: 'hidden',
        zIndex: 10000
    }
};

export class ModalContainer extends React.Component<Types.CommonProps, Types.Stateless> {
    constructor(props: Types.CommonProps) {
        super(props);
    }

    render() {
        return (
            <div style={ _styles.modalContainerStyle as any }>
                { this.props.children }
            </div>
        );
    }
}

export default ModalContainer;
