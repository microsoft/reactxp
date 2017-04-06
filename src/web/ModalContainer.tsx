/**
* ModalContainer.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of a view that's used to render modals.
*/

import React = require('react');

import Types = require('../common/Types');

export class ModalContainer extends React.Component<Types.CommonProps, {}> {
    constructor() {
        super();
    }

    render() {
        let modalContainerStyle = {
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
        };

        return (
            <div style={ modalContainerStyle }>
                { this.props.children }
            </div>
        );
    }
}

export default ModalContainer;
