/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Image abstraction.
*/

import PropTypes = require('prop-types');
import React = require('react');
import RN = require('react-native');
import SyncTasks = require('synctasks');
import _ = require('./lodashMini');

import Styles from './Styles';
import Types = require('../common/Types');

const _styles = {
    defaultImage: Styles.createImageStyle({
        flex: 0,
        overflow: 'hidden',
        width: undefined,
        height: undefined
    })
};

export interface ImageContext {
    isRxParentAText?: boolean;
}

export class Image extends React.Component<Types.ImageProps, Types.Stateless> implements React.ChildContextProvider<ImageContext> {
    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
    };

    static prefetch(url: string): SyncTasks.Promise<boolean> {
        const defer = SyncTasks.Defer<boolean>();

        RN.Image.prefetch(url).then((value: boolean) => {
            defer.resolve(value);
        }).catch((error: any) => {
            defer.reject(error);
        });

        return defer.promise();
    }

    static getMetadata(url: string): SyncTasks.Promise<Types.ImageMetadata> {
        const defer = SyncTasks.Defer<Types.ImageMetadata>();

        Image.prefetch(url).then(success => {
            if (!success) {
                defer.reject('Prefetching url ' + url + ' did not succeed.');
            } else {
                RN.Image.getSize(url, (width, height) => {
                    defer.resolve({
                        width: width,
                        height: height
                    });
                }, error => {
                    defer.reject(error);
                });
            }
        }).catch((error: any) => {
            defer.reject(error);
        });

        return defer.promise();
    }

    protected _mountedComponent: RN.ReactNativeBaseComponent<any, any>|null = null;
    private _nativeImageWidth: number|undefined;
    private _nativeImageHeight: number|undefined;

    protected _getAdditionalProps(): RN.ImageProperties | {} {
        return {};
    }

    render() {
        // Use the width/height provided in the style if it's not provided in the image itself.
        let resizeMode = 'contain';
        if (this.props.resizeMode !== undefined &&
            (this.props.resizeMode === 'contain' ||
             this.props.resizeMode === 'cover' ||
             this.props.resizeMode === 'stretch')) {
            resizeMode = this.props.resizeMode;
        }

        const additionalProps = this._getAdditionalProps();
        const extendedProps: RN.ExtendedImageProps = {
            source: this._buildSource(),
            tooltip: this.props.title
        };

        return (
            <RN.Image
                ref={ this._onMount as any }
                style={ this.getStyles() as RN.StyleProp<RN.ImageStyle> }
                resizeMode={ resizeMode as any }
                resizeMethod={ this.props.resizeMethod }
                accessibilityLabel={ this.props.accessibilityLabel }
                onLoad={ this.props.onLoad ? this._onLoad : undefined }
                onError={ this._onError }
                testID={ this.props.testId }
                { ...additionalProps }
                { ...extendedProps }
            >
                { this.props.children }
            </RN.Image>
        );
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }

    public setNativeProps(nativeProps: RN.ImageProperties) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    }

    getChildContext() {
        // Let descendant RX components know that their nearest RX ancestor is not an RX.Text.
        // Because they're in an RX.View/etc, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: false };
    }

    protected getStyles() {
        return [_styles.defaultImage, this.props.style];
    }

    private _onLoad = (e: RN.NativeSyntheticEvent<RN.ImageLoadEventData>) => {
        if (!this._mountedComponent) {
            return;
        }

        this._nativeImageWidth = e.nativeEvent.source.width;
        this._nativeImageHeight = e.nativeEvent.source.height;

        if (this.props.onLoad) {
            this.props.onLoad({ width: this._nativeImageWidth!, height: this._nativeImageHeight! });
        }
    }

    private _onError = (e: React.SyntheticEvent<Image>) => {
        if (!this._mountedComponent) {
            return;
        }

        if (this.props.onError) {
            const event = e.nativeEvent as any;
            this.props.onError(new Error(event.error));
        }
    }

    private _buildSource(): RN.ImageSourcePropType {
        // Check if require'd image resource
        if (_.isNumber(this.props.source)) {
            return this.props.source;
        }

        const source: RN.ImageSourcePropType = { uri: this.props.source };
        if (this.props.headers) {
            source.headers = this.props.headers;
        }

        return source;
    }

    // Note: This works only if you have an onLoaded handler and wait for the image to load.
    getNativeWidth(): number|undefined {
        return this._nativeImageWidth;
    }

    getNativeHeight(): number|undefined {
        return this._nativeImageHeight;
    }
}

export default Image;
