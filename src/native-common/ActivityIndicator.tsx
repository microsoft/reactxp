/**
 * ActivityIndicator.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Control to display an animated activity indicator.
 */

import * as React from 'react';
import * as RN from 'react-native';

import { Types } from '../common/Interfaces';

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
        let size: 'small' | 'large';
        switch (this.props.size) {
            case 'tiny':
            case 'small':
            case 'medium':
                size = 'small';
                break; // React Native ActivityIndicator does not support 'tiny' or medium' size

            case 'large':
            default:
                size = 'large';
                break;
        }

        return (
            <RN.ActivityIndicator
                animating={ true }
                color={ this.state.isVisible ? this.props.color : 'transparent' }
                size={ size }
                testID={ this.props.testId }
            />
        );
    }
}

export default ActivityIndicator;
