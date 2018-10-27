/**
 * ModalContainer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Modal abstraction.
 */

import * as React from 'react';
import * as RN from 'react-native';

import { Types } from '../common/Interfaces';

const _styles = {
    defaultContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // On Android, we need to provide some color to prevent
        // removal of the view.
        backgroundColor: 'transparent'
    },
    hiddenContainer: {
        width: 0,
        height: 0
    }
};

export interface ModalContainerProps extends Types.CommonProps {
    hidden?: boolean;
}

export class ModalContainer extends React.Component<ModalContainerProps, Types.Stateless> {
    constructor(props: ModalContainerProps) {
        super(props);
    }

    render() {
        const style = this.props.hidden ? _styles.hiddenContainer : _styles.defaultContainer;

        return (
            <RN.View style={ style as RN.StyleProp<RN.ViewStyle> }>
                { this.props.children }
            </RN.View>
        );
    }
}

export default ModalContainer;
