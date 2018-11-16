/**
 * Image.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Image abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as RN from 'react-native';
import * as SyncTasks from 'synctasks';

import { DEFAULT_RESIZE_MODE } from '../common/Image';
import { Types } from '../common/Interfaces';
import * as _ from './utils/lodashMini';
import Platform from './Platform';
import Styles from './Styles';

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

export interface ImageState {
    forceCache?: boolean;
    lastNativeError?: any;
    headers?: Types.Headers;
}

export class Image extends React.Component<Types.ImageProps, ImageState> implements React.ChildContextProvider<ImageContext> {
    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired
    };

    static prefetch(url: string): SyncTasks.Promise<boolean> {
        return SyncTasks.fromThenable(RN.Image.prefetch(url));
    }

    static getMetadata(url: string): SyncTasks.Promise<Types.ImageMetadata> {
        return SyncTasks.fromThenable(Image.prefetch(url)).then(success => {
            if (!success) {
                return SyncTasks.Rejected(`Prefetching url ${ url } did not succeed.`);
            } else {
                const defer = SyncTasks.Defer<Types.ImageMetadata>();
                RN.Image.getSize(url, (width, height) => {
                    defer.resolve({ width, height });
                }, error => {
                    defer.reject(error);
                });
                return defer.promise();
            }
        });
    }

    protected _mountedComponent: RN.Image | undefined;
    private _nativeImageWidth: number | undefined;
    private _nativeImageHeight: number | undefined;
    readonly state: ImageState = { forceCache: false, lastNativeError: undefined, headers: this._buildHeaders() };

    protected _getAdditionalProps(): RN.ImageProperties | {} {
        return {};
    }

    render() {
        const styles = this.getStyles();
        const extendedProps: RN.ExtendedImageProps = {
            source: this._buildSource(),
            tooltip: this.props.title
        };

        const props = {
            accessibilityLabel: this.props.accessibilityLabel,
            resizeMethod: this.props.resizeMethod,
            resizeMode: this._buildResizeMode(),
            testID: this.props.testId,
            onError: this._onError,
            onLoad: this.props.onLoad ? this._onLoad : undefined,
            ref: this._onMount,
            ...this._getAdditionalProps(),
            ...extendedProps
        };

        /**
         * The <RN.Image> component cannot contain "children" elements.
         * This functionality was removed in the version 0.50.0 - @see https://github.com/facebook/react-native/releases/tag/v0.50.0,
         * The following changes add similar functionality as <RN.ImageBackground>, to continue support previous and new versions of RN
         */
        if (this.props.children) {
            return (
                <RN.View
                    style={ styles as RN.StyleProp<RN.ViewStyle> }
                >
                    <RN.Image
                        style={ RN.StyleSheet.absoluteFill }
                        { ...props }
                    />

                    { this.props.children }
                </RN.View>
            );
        }

        return (
            <RN.Image
                style={ styles as RN.StyleProp<RN.ImageStyle> }
                { ...props }
            />
        );
    }

    componentWillReceiveProps(nextProps: Types.ImageProps) {
        const sourceOrHeaderChanged = (nextProps.source !== this.props.source ||
            !_.isEqual(nextProps.headers || {}, this.props.headers || {}));
        if (sourceOrHeaderChanged) {
            this.setState({ forceCache: false, lastNativeError: undefined, headers: this._buildHeaders() });
        }
    }

    protected _onMount = (component: RN.Image | null) => {
        this._mountedComponent = component || undefined;
    }

    setNativeProps(nativeProps: RN.ImageProps) {
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

    private _buildResizeMode(): RN.ImageResizeMode {
        const { resizeMode = DEFAULT_RESIZE_MODE } = this.props;

        if (resizeMode === 'auto') {
            return 'center' as RN.ImageResizeMode;
        }

        // Prevents unknown resizeMode values
        const isValidResizeModeValue = ['contain', 'cover', 'stretch', 'repeat'].indexOf(resizeMode) >= 0;
        if (isValidResizeModeValue) {
            return resizeMode as RN.ImageResizeMode;
        }

        return DEFAULT_RESIZE_MODE as RN.ImageResizeMode;
    }

    private _onLoad = (e: RN.NativeSyntheticEvent<RN.ImageLoadEventData>) => {
        if (!this._mountedComponent) {
            return;
        }

        this._nativeImageWidth = e.nativeEvent.source.width;
        this._nativeImageHeight = e.nativeEvent.source.height;

        if (this.props.onLoad) {
            this.props.onLoad({ width: this._nativeImageWidth, height: this._nativeImageHeight });
        }
    }

    private _onError = (e: RN.NativeSyntheticEvent<RN.ImageErrorEventData>) => {
        if (!this._mountedComponent) {
            return;
        }

        if (!this.state.forceCache && !!this._getMaxStaleHeader()) {
            // Some platforms will not use expired cache data unless explicitly told so.
            // Let's try again with cache: 'only-if-cached'.
            this.setState({ forceCache: true, lastNativeError: e.nativeEvent.error });
        } else if (this.props.onError) {
            if (this.state.forceCache) {
                // Fire the callback with the error we got when we failed without forceCache.
                this.props.onError(new Error(this.state.lastNativeError));
            } else {
                this.props.onError(new Error(e.nativeEvent.error));
            }
        }
    }

    private _buildHeaders(): Types.Headers | undefined {
        if (this.props.headers) {
            const cacheControlHeader = this._getMaxStaleHeader();
            if (cacheControlHeader) {
                // Filter out Cache-Control: max-stale. It has the opposite effect on iOS: instead of having
                // the cache return stale data it disables the cache altogether. We emulate the header by
                // retrying with cache: 'only-if-cached'.
                return _.omit(this.props.headers, [cacheControlHeader]);
            }
        }
        return this.props.headers;
    }

    private _buildSource(): RN.ImageSourcePropType {
        // Check if require'd image resource
        if (typeof this.props.source === 'number') {
            return this.props.source;
        }

        const source: RN.ImageSourcePropType = { uri: this.props.source, headers: this.state.headers };
        if (this.state.forceCache) {
            source.cache = 'only-if-cached';
        }

        return source;
    }

    private _getMaxStaleHeader(): string | undefined {
        if (Platform.getType() === 'ios' && this.props.headers) {
            for (const key in this.props.headers) {
                // We don't know how stale the cached data is so we're matching only the simple 'max-stale' attribute
                // without a value.
                if (key.toLowerCase() === 'cache-control' && this.props.headers[key].toLowerCase() === 'max-stale') {
                    return key;
                }
            }
        }
        return undefined;
    }

    // Note: This works only if you have an onLoaded handler and wait for the image to load.
    getNativeWidth(): number | undefined {
        return this._nativeImageWidth;
    }

    getNativeHeight(): number | undefined {
        return this._nativeImageHeight;
    }
}

export default Image;
