/**
 * ImageBackground.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 */

import * as React from 'react';
import * as RN from 'react-native';

export class ImageBackground extends React.Component<RN.ImageBackgroundProps> {

    private _mountedComponent: RN.View | null = null;

    render() {
        const { children, style, ...imageProps } = this.props;

        /**
         * Use RN implementation if it exists
         */
        if (RN.ImageBackground) {
            return (
                <RN.ImageBackground style={style} { ...imageProps }>
                    { children }
                </RN.ImageBackground>
            );
        }

        return (
            <RN.View
                style={style}
                ref={this._onMount}
            >
                <RN.Image
                    { ...imageProps }
                    style={RN.StyleSheet.absoluteFill}
                />

                { children }
            </RN.View>
        );
    }

    private _onMount = (component: RN.View | null) => {
        this._mountedComponent = component;
    }

    public setNativeProps(nativeProps: RN.ViewProps) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    }

}

export default ImageBackground;
