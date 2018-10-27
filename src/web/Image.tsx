/**
 * Image.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Image abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as SyncTasks from 'synctasks';

import { DEFAULT_RESIZE_MODE } from '../common/Image';
import { Types } from '../common/Interfaces';
import * as _ from './utils/lodashMini';
import restyleForInlineText from './utils/restyleForInlineText';
import Styles from './Styles';

const _styles = {
    image: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        opacity: 0,
        maxWidth: '100%',
        maxHeight: '100%'
    },
    defaultContainer: Styles.createImageStyle({
        position: 'relative',
        flex: 0,
        overflow: 'visible',
        backgroundColor: 'transparent'
    })
};

export interface ImageState {
    showImgTag: boolean;
    xhrRequest: boolean;
    displayUrl: string;
}

export interface ImageContext {
    isRxParentAText?: boolean;
}

interface XhrBlobUrlCacheEntry {
    xhrBlobUrl: string;
    insertionDate: number;
    refCount: number;
}

class XhrBlobUrlCache {
    // Use a global cache to work around the image loading delays introduced by the xhr requests. This is especially
    // visible when scrolling a virtual list view which contains xhr images.
    private static _maximumItems = 128;
    private static _cachedXhrBlobUrls: { [source: string]: XhrBlobUrlCacheEntry } = {};

    static get(source: string): string | undefined {
        if (this._cachedXhrBlobUrls[source]) {
            this._cachedXhrBlobUrls[source].refCount++;

            return this._cachedXhrBlobUrls[source].xhrBlobUrl;
        }

        return undefined;
    }

    static insert(source: string, xhrBlobUrl: string) {
        XhrBlobUrlCache._cleanupIfCapacityExceeded();

        if (this._cachedXhrBlobUrls[source]) {
            XhrBlobUrlCache._cachedXhrBlobUrls[source].refCount++;
        } else {
            const xhrBlobUrlCacheEntry: XhrBlobUrlCacheEntry = {
                xhrBlobUrl: xhrBlobUrl,
                insertionDate: Date.now(),
                refCount: 1
            };

            XhrBlobUrlCache._cachedXhrBlobUrls[source] = xhrBlobUrlCacheEntry;
        }
    }

    static release(source: string) {
        // Keep track of which cache entries are being used as we don't want to clean up a resource that someone is
        // still relying on.
        if (this._cachedXhrBlobUrls[source]) {
            XhrBlobUrlCache._cachedXhrBlobUrls[source].refCount--;
        }
    }

    private static _cleanupIfCapacityExceeded() {
        // If we've reached maximum capacity, clean up the oldest freeable cache entry if any. An entry is freeable is
        // it's not currently in use (refCount == 0). Return whether we have room to add more entries to the cache.
        if (Object.keys(XhrBlobUrlCache._cachedXhrBlobUrls).length + 1 > XhrBlobUrlCache._maximumItems) {
            let oldestFreeableKey: string | undefined;
            let oldestFreeableEntry: XhrBlobUrlCacheEntry | undefined;

            Object.keys(XhrBlobUrlCache._cachedXhrBlobUrls).forEach(key => {
                if ((!oldestFreeableEntry || XhrBlobUrlCache._cachedXhrBlobUrls[key].insertionDate < oldestFreeableEntry.insertionDate) &&
                    XhrBlobUrlCache._cachedXhrBlobUrls[key].refCount === 0) {
                    oldestFreeableKey = key;
                    oldestFreeableEntry = XhrBlobUrlCache._cachedXhrBlobUrls[key];
                }
            });

            if (oldestFreeableKey) {
                URL.revokeObjectURL(oldestFreeableEntry!.xhrBlobUrl);
                delete XhrBlobUrlCache._cachedXhrBlobUrls[oldestFreeableKey];
            }
        }
    }
}

export class Image extends React.Component<Types.ImageProps, ImageState> {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool
    };

    // Provided by super, just re-typing here
    context!: ImageContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired
    };

    private _mountedComponent: HTMLImageElement | null = null;

    getChildContext() {
        // Let descendant RX components know that their nearest RX ancestor is not an RX.Text.
        // Because they're in an RX.Image, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: false };
    }

    static prefetch(url: string): SyncTasks.Promise<boolean> {
        const defer = SyncTasks.Defer<boolean>();

        const img = new window.Image();

        img.onload = ((event: Event) => {
            defer.resolve(true);
        });

        img.onerror = ((event: Event) => {
            defer.reject('Failed to prefetch url ' + url);
        });

        img.onabort = ((event: Event) => {
            defer.reject('Prefetch cancelled for url ' + url);
        });
        img.src = url;

        return defer.promise();
    }

    static getMetadata(url: string): SyncTasks.Promise<Types.ImageMetadata> {
        const defer = SyncTasks.Defer<Types.ImageMetadata>();

        const img = new window.Image();

        img.onload = ((event: Event) => {
            defer.resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        });

        img.onerror = ((event: Event) => {
            defer.reject('Failed to prefetch url ' + url);
        });

        img.onabort = ((event: Event) => {
            defer.reject('Prefetch cancelled for url ' + url);
        });
        img.src = url;

        return defer.promise();
    }

    private _isMounted = false;
    private _nativeImageWidth: number | undefined;
    private _nativeImageHeight: number | undefined;

    constructor(props: Types.ImageProps) {
        super(props);

        const performXhrRequest = this._initializeAndSetState(props, true);

        if (performXhrRequest) {
            this._startXhrImageFetch(props);
        }
    }

    componentWillReceiveProps(nextProps: Types.ImageProps) {
        const sourceOrHeaderChanged = (nextProps.source !== this.props.source ||
            !_.isEqual(nextProps.headers || {}, this.props.headers || {}));

        if (!nextProps.onLoad !== !this.props.onLoad || !nextProps.onError !== !this.props.onError || sourceOrHeaderChanged) {
            const performXhrRequest = this._initializeAndSetState(nextProps, false);

            if (sourceOrHeaderChanged && performXhrRequest) {
                this._startXhrImageFetch(nextProps);
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        if (this.state.displayUrl && this.state.xhrRequest) {
           XhrBlobUrlCache.release(this.props.source);
        }
    }

    private _initializeAndSetState(props: Types.ImageProps, initial: boolean): boolean {
        // Retrieve the xhr blob url from the cache if it exists. This is a performance optimization as we've seen xhr
        // requests take some time and cause flicker during rendering. Even when we're hitting the browser cache, we've
        // seen it stall and take some time.
        const cachedXhrBlobUrl = props.headers ? XhrBlobUrlCache.get(props.source) : null;
        const displayUrl = !!cachedXhrBlobUrl ? cachedXhrBlobUrl :
            !!props.headers ? '' : props.source;

        // Only make the xhr request if headers are specified and there was no cache hit.
        const performXhrRequest = !!props.headers && !cachedXhrBlobUrl;

        // We normally don't show an img tag because we use background images.  However, if the caller has supplied an
        // onLoad or onError callback, we'll use the img tag until we receive an onLoad or onError.  But if we need to
        // perform an XHR first to convert to a blob url, then wait on showing the img tag until we get the blob url
        // since the basic IMG tag will fail to load it without headers.
        const newState: ImageState = {
            showImgTag: (!performXhrRequest || !!cachedXhrBlobUrl) && (!!props.onLoad || !!props.onError),
            xhrRequest: !!props.headers,
            displayUrl: displayUrl
        };
        if (initial) {
            this.state = newState;
        } else {
            this.setState(newState);
        }

        return performXhrRequest;
    }

    private _handleXhrBlob(blob: Blob) {
        if (!this._isMounted) {
            return;
        }

        const newUrl = URL.createObjectURL(blob);

        // Save the newly fetched xhr blob url in the cache.
        XhrBlobUrlCache.insert(this.props.source, newUrl);

        this.setState({
            displayUrl: newUrl,

            // If we have an onload handler, we need to now load the img tag to get dimensions for the load.
            showImgTag: !!this.props.onLoad
        });
    }

    private _startXhrImageFetch(props: Types.ImageProps) {
        // Test hook to simulate a slower hxr request.
        // window.setTimeout(() => this._actuallyStartXhrImageFetch(props), 2500);
        this._actuallyStartXhrImageFetch(props);
    }

    private _actuallyStartXhrImageFetch(props: Types.ImageProps) {
        // Fetch Implementation

        // If an 'origin' header is passed, we assume this is intended to be a crossorigin request.
        // In order to send the cookies with the request, the withCredentials: true / credentials: 'include' flag needs to be set.
        const withCredentials = props.headers
            && Object.keys(props.headers).some(header => header.toLowerCase() === 'origin');

        if (window.fetch) {
            const headers = new Headers();

            if (props.headers) {
                Object.keys(props.headers).forEach(key => {
                    headers.append(key, props.headers![key]);
                });
            }

            const xhr = new Request(props.source, {
                credentials: withCredentials ? 'include' : 'same-origin',
                method: 'GET',
                mode: 'cors',
                headers
            });

            fetch(xhr)
                .then(response => {
                    if (!response.ok) {
                        this._onError(new Error(response.statusText));
                    }

                    return response.blob().then(blob => {
                        this._handleXhrBlob(blob);
                    });
                }, (err: Error) => {
                    this._onError(err);
                });
        } else {
            const req = new XMLHttpRequest();
            req.open('GET', props.source, true);
            if (withCredentials) {
                req.withCredentials = true;
            }
            req.responseType = 'blob';
            if (props.headers) {
                Object.keys(props.headers).forEach(key => {
                    req.setRequestHeader(key, props.headers![key]);
                });
            }

            req.onload = () => {
                if (req.status >= 400 || req.status < 600) {
                    this._onError(new Error(req.statusText));
                } else {
                    this._handleXhrBlob(req.response as Blob);
                }
            };

            req.onerror = () => {
                this._onError(new Error('Network issue downloading the image.'));
            };

            req.send();
        }
    }

    render() {
        const { source } = this.props;

        // Prepare image source (necessary as iOS implementation also allows objects)
        if (typeof source !== 'string' && typeof source !== 'undefined') {
            throw new Error(`Types/web/Image only accepts string sources! You passed: ${ source } of type ${ typeof source }`);
        }

        let optionalImg: JSX.Element | null = null;

        if (this.state.showImgTag) {
            optionalImg = (
                <img
                    style={ _styles.image as any }
                    src={ this.state.displayUrl }
                    alt={ this.props.accessibilityLabel }
                    onError={ this._imgOnError }
                    onLoad={ this._onLoad }
                    ref={ this._onMount }
                />
            );
        }

        const reactElement = (
            <div
                style={ this._getStyles() }
                title={ this.props.title }
                data-test-id={ this.props.testId }
                onMouseUp={ this._onMouseUp }
            >
                { optionalImg }
                { this.props.children }
            </div>
        );

        return this.context.isRxParentAText ?
            restyleForInlineText(reactElement) :
            reactElement;
    }

    protected _onMount = (component: HTMLImageElement | null) => {
        this._mountedComponent = component;
    }

    private _getStyles(): React.CSSProperties {
        const { resizeMode } = this.props;
        const styles = (Styles.combine([_styles.defaultContainer, this.props.style]) || {}) as React.CSSProperties;

        const backgroundRepeat = resizeMode === 'repeat' ? 'repeat' : 'no-repeat';
        const backgroundSize = this._buildBackgroundSize(resizeMode);

        // It is necessary to wrap the url in quotes as in url("a.jpg?q=(a and b)").
        // If the url is unquoted and contains paranthesis, e.g. a.jpg?q=(a and b), it will become url(a.jpg?q=(a and b))
        // which will not render on the screen.
        const backgroundImage = `url("${ this.state.displayUrl }")`;

        // Types doesn't support border styles other than "solid" for images.
        const borderStyle = styles.borderWidth ? 'solid' : 'none';

        return {
            ...styles,
            backgroundPosition: 'center center',
            backgroundRepeat,
            backgroundImage,
            backgroundSize,
            borderStyle,
            display: 'flex'
        };
    }

    private _buildBackgroundSize(resizeMode: Types.ImageResizeMode = DEFAULT_RESIZE_MODE): string {
        switch (resizeMode) {
            case 'repeat':
                return 'auto';

            case 'stretch':
                return '100% 100%';

            // contain | cover | auto are valid BackgroundSize values
            case 'contain':
            case 'cover':
            case 'auto':
                return resizeMode as string;

            // Prevents unknown resizeMode values
            default:
                return DEFAULT_RESIZE_MODE as string;
        }
    }

    private _onLoad = () => {
        if (!this._isMounted || !this._mountedComponent) {
            return;
        }

        const imageDOM = this._mountedComponent;

        // Measure the natural width & height of the image.
        this._nativeImageWidth = undefined;
        this._nativeImageHeight = undefined;

        this._nativeImageWidth = imageDOM.naturalWidth;
        this._nativeImageHeight = imageDOM.naturalHeight;

        // We can hide the img now. We assume that if the img. URL resolved without error,
        // then the background img. URL also did.
        this.setState({
            showImgTag: false
        });

        if (this.props.onLoad) {
            this.props.onLoad({ width: this._nativeImageWidth, height: this._nativeImageHeight });
        }
    }

    private _imgOnError = () => {
        this._onError();
    }

    private _onError(err?: Error) {
        if (!this._isMounted) {
            return;
        }

        // We can hide the img now. We assume that if the img. URL failed to resolve,
        // then the background img. URL also did.
        this.setState({
            showImgTag: false
        });

        if (this.props.onError) {
            this.props.onError(err);
        }
    }

    private _onMouseUp = (e: React.MouseEvent<any>) => {
        if (e.button === 0) {
            // Types.Image doesn't officially support an onClick prop, but when it's
            // contained within a button, it may have this prop.
            const onClick: (e: Types.MouseEvent) => void = (this.props as any).onClick;
            if (onClick) {
                onClick(e);
            }
        }
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
