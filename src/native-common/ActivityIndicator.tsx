/**
* ActivityIndicator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Control to display an animated activity indicator.
*/

import React = require('react');
/* tslint:disable:no-unused-variable */
import RN = require('react-native');
/* tslint:enable:no-unused-variable */
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export interface ActivityIndicatorState {
    isVisible?: boolean;
}

export class ActivityIndicator extends React.Component<Types.ActivityIndicatorProps, ActivityIndicatorState> {
    private _isMounted = false;

    constructor(props: Types.ActivityIndicatorProps) {
        super(props);

        this.state = { isVisible: false };
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.deferTime && this.props.deferTime > 0) {
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ isVisible: true });
                }
            }, this.props.deferTime);
        } else {
            this.setState({ isVisible: true });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let size: string;
        switch (this.props.size) {
            case 'tiny':
            case 'small' : size = 'small'; break;
            case 'medium': size = 'small'; break; // React Native ActivityIndicator does not support 'medium' size
            case 'large' : size = 'large'; break;
            default      : size = 'large'; break;
        }

        return (
            <RN.ActivityIndicator
                animating={ this.state.isVisible }
                color={ this.state.isVisible ? this.props.color : 'transparent' }
                size={ size }
            />
        );
    }
}

export default ActivityIndicator;
