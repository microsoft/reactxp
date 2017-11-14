/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Image abstraction.
*/

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

export class Image extends React.Component<Types.ImageProps, {}> {
    static prefetch(url: string): SyncTasks.Promise<boolean> {
        const defer = SyncTasks.Defer<boolean>();

        RN.Image.prefetch(url).then((value: boolean) => {
            defer.resolve(value);
        }).catch((error: any) => {
            defer.reject(error);
        });

        return defer.promise();
    }

    private _isMounted = false;
    private _nativeImageWidth: number|undefined;
    private _nativeImageHeight: number|undefined;

    protected _getAdditionalProps(): RN.ImageProperties | {} {
        return {};
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        // Check if require'd image resource
        let imageSource: RN.ImageSource | number;
        if ( _.isNumber(this.props.source)) {
            // Cast to any since the inbound types mismatch a bit for RN
            imageSource = this.props.source as any as number;
        } else {
            const imageSourceReq: RN.ImageSource = { uri: this.props.source as string };
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

        return (
            <RN.Image
                ref='nativeImage'
                style={ this.getStyles() }
                source={ imageSource }
                resizeMode={ resizeMode }
                resizeMethod= { this.props.resizeMethod }
                accessibilityLabel={ this.props.accessibilityLabel }
                onLoad={ this.props.onLoad ? this._onLoad : undefined }
                onError={ this._onError }
                shouldRasterizeIOS= { this.props.shouldRasterizeIOS }
                { ...additionalProps }
            >
                { this.props.children }
            </RN.Image>
        );
    }

    public setNativeProps(nativeProps: RN.ImageProperties) {
        (this.refs['nativeImage'] as RN.Image).setNativeProps(nativeProps);
    }

    protected getStyles() {
        return [_styles.defaultImage, this.props.style];
    }

    private _onLoad = (e: React.SyntheticEvent<Image>) => {
        if (!this._isMounted) {
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
        if (!this._isMounted) {
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
