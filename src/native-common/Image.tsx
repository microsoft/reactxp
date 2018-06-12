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
        // Check if require'd image resource
        let imageSource: RN.ImageURISource | number;
        if ( _.isNumber(this.props.source)) {
            // Cast to any since the inbound types mismatch a bit for RN
            imageSource = this.props.source as any as number;
        } else {
            const imageSourceReq: RN.ImageURISource = { uri: this.props.source as string };
            if (this.props.headers) {
                imageSourceReq.headers = this.props.headers;
            }
            imageSource = imageSourceReq;
        }

        // Use the width/height provided in the style if it's not provided in the image itself.
        let resizeMode = 'contain';
        if (this.props.resizeMode !== undefined &&
            (this.props.resizeMode === 'contain' ||
             this.props.resizeMode === 'cover' ||
             this.props.resizeMode === 'stretch')) {
            resizeMode = this.props.resizeMode;
        }

        const additionalProps = this._getAdditionalProps();

        // Work around the fact that the current react-native type definition
        // doesn't include shouldRasterizeIOS.
        const undefinedProps: any = {
            shouldRasterizeIOS: this.props.shouldRasterizeIOS
        };

        return (
            <RN.Image
                ref={ this._onMount as any }
                style={ this.getStyles() as RN.StyleProp<RN.ImageStyle> }
                source={ imageSource }
                resizeMode={ resizeMode as any }
                resizeMethod={ this.props.resizeMethod }
                accessibilityLabel={ this.props.accessibilityLabel }
                onLoad={ this.props.onLoad ? this._onLoad as any : undefined }
                onError={ this._onError }
                tooltip={ this.props.title }
                { ...additionalProps }
                { ...undefinedProps }
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

    private _onLoad = (e: React.SyntheticEvent<Image>) => {
        if (!this._mountedComponent) {
            return;
        }

        const nativeEvent = e.nativeEvent as any;
        this._nativeImageWidth = nativeEvent.source.width;
        this._nativeImageHeight = nativeEvent.source.height;

        if (this.props.onLoad) {
            this.props.onLoad({ width: this._nativeImageWidth!!!, height: this._nativeImageHeight!!! });
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

    // Note: This works only if you have an onLoaded handler and wait for the image to load.
    getNativeWidth(): number|undefined {
        return this._nativeImageWidth;
    }

    getNativeHeight(): number|undefined {
        return this._nativeImageHeight;
    }
}

export default Image;
