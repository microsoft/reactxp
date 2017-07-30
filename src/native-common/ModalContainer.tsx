/**
* ModalContainer.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Modal abstraction.
*/

import React = require('react');
import RN = require('react-native');

import Types= require('../common/Types');

const _styles = {
    defaultContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // On Android, we need to provide some color to prevent
        // removal of the view.
        backgroundColor: 'transparent'
    }
};

export interface ModalContainerProps extends Types.CommonProps {
}

export class ModalContainer extends React.Component<ModalContainerProps, null> {
    constructor(props: ModalContainerProps) {
        super(props);
    }

    render() {
        return (
            <RN.View style={ _styles.defaultContainer }>
                { this.props.children }
            </RN.View>
        );
    }
}

export default ModalContainer;
