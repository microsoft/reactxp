/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Image abstraction.
*/

import _ = require('./utils/lodashMini');
import React = require('react');
import ReactDOM = require('react-dom');
import SyncTasks = require('synctasks');
import PropTypes = require('prop-types');

import restyleForInlineText = require('./utils/restyleForInlineText');
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');

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
    showImgTag?: boolean;
    xhrRequest?: boolean;
    displayUrl?: string;
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
    private static _maximumItems: number = 128;
    private static _cachedXhrBlobUrls: { [source: string]: XhrBlobUrlCacheEntry } = {};

    static get(source: string): string {
        if (this._cachedXhrBlobUrls[source]) {
            this._cachedXhrBlobUrls[source].refCount++;

            return this._cachedXhrBlobUrls[source].xhrBlobUrl;
        }

        return null;
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
            let oldestFreeableKey: string;
            let oldestFreeableEntry: XhrBlobUrlCacheEntry;

            Object.keys(XhrBlobUrlCache._cachedXhrBlobUrls).forEach(key => {
                if ((!oldestFreeableEntry || XhrBlobUrlCache._cachedXhrBlobUrls[key].insertionDate < oldestFreeableEntry.insertionDate) &&
                    XhrBlobUrlCache._cachedXhrBlobUrls[key].refCount === 0) {
                    oldestFreeableKey = key;
                    oldestFreeableEntry = XhrBlobUrlCache._cachedXhrBlobUrls[key];
                }
            });

            if (oldestFreeableKey) {
                URL.revokeObjectURL(oldestFreeableEntry.xhrBlobUrl);
                delete XhrBlobUrlCache._cachedXhrBlobUrls[oldestFreeableKey];
            }
        }
    }
}

export class Image extends React.Component<Types.ImageProps, ImageState> {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool
    };
    context: ImageContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired
    };
    getChildContext() {
        // Let descendant RX components know that their nearest RX ancestor is not an RX.Text.
        // Because they're in an RX.Image, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: false };
    }

    static prefetch(url: string): SyncTasks.Promise<boolean> {
        const defer = SyncTasks.Defer<boolean>();

        const img = new (window as any).Image();
        img.src = url;

        img.onload = ((event: Event) => {
            defer.resolve(true);
        });

        img.onerror = ((event: Event) => {
            defer.reject('Failed to prefetch url ' + url);
        });

        img.onabort = ((event: Event) => {
            defer.reject('Prefetch cancelled for url ' + url);
        });

        return defer.promise();
    }

    private _isMounted = false;
    private _nativeImageWidth: number;
    private _nativeImageHeight: number;

    constructor(props: Types.ImageProps) {
        super(props);

        const performXhrRequest = this._initializeAndSetState(props, true);

        if (performXhrRequest) {
            this._startXhrImageFetch(props);
        }
    }

    componentWillReceiveProps(nextProps: Types.ImageProps) {
        let sourceOrHeaderChanged = (nextProps.source !== this.props.source ||
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

        // We normally don't show an img tag because we use background images. However, if the caller has supplied an
        // onLoad or onError callback, we'll use the img tag until we receive an onLoad or onError.
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

        this.setState({
            displayUrl: URL.createObjectURL(blob)
        });

        // Save the newly fetched xhr blob url in the cache.
        XhrBlobUrlCache.insert(this.props.source, this.state.displayUrl);

        this._onLoad();
    }

    private _startXhrImageFetch(props: Types.ImageProps) {
        // Test hook to simulate a slower hxr request.
        // window.setTimeout(() => this._actuallyStartXhrImageFetch(props), 2500);
        this._actuallyStartXhrImageFetch(props);
    }

    private _actuallyStartXhrImageFetch(props: Types.ImageProps) {
        // Fetch Implementation
        if (window.fetch) {
            var headers = new Headers();

            Object.keys(props.headers).forEach(key => {
                headers.append(key, props.headers[key]);
            });

            var xhr = new Request(props.source, {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            });

            fetch(xhr)
                .then(response => {
                    if (!response.ok) {
                        this._onError(new Error(response.statusText));
                    }

                    response.blob().then(blob => {
                        this._handleXhrBlob(blob);
                    });
                }, (err: Error) => {
                    this._onError(err);
                });
        } else {
            var req = new XMLHttpRequest();
            req.open('GET', props.source, true);

            req.responseType = 'blob';
            Object.keys(props.headers).forEach(key => {
                req.setRequestHeader(key, props.headers[key]);
            });

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
        // Prepare image source (necessary as iOS implementation also allows objects)
        if (typeof this.props.source !== 'string' && typeof this.props.source !== 'undefined') {
            let errorText = 'Types/web/Image only accepts string sources! You passed: '
                + this.props.source + ' of type ' + (typeof this.props.source);
            throw new Error(errorText);
        }

        let optionalImg: JSX.Element = null;

        if (this.state.showImgTag) {
            optionalImg = (
                <img
                    style={ _styles.image }
                    src={ this.state.displayUrl }
                    alt={ this.props.accessibilityLabel }
                    onLoad={ this._onLoad }
                    onError={ this._imgOnError }
                    key='image'
                    ref='image'
                />
            );
        }

        let reactElement = (
            <div
                style={ this._getStyles() }
                onMouseUp={ this._onMouseUp }
                title={ this.props.title }
            >
                { optionalImg }
                { this.props.children }
            </div>
        );

        return this.context.isRxParentAText ?
            restyleForInlineText(reactElement) :
            reactElement;
    }

    private _getStyles() {
        let combinedStyles = Styles.combine([_styles.defaultContainer, this.props.style]) as any;

        combinedStyles['display'] = 'flex';

        // It is necessary to wrap the url in quotes as in url("a.jpg?q=(a and b)").
        // If the url is unquoted and contains paranthesis, e.g. a.jpg?q=(a and b), it will become url(a.jpg?q=(a and b))
        // which will not render on the screen.
        combinedStyles['backgroundImage'] = 'url("' + this.state.displayUrl + '")';

        // Types doesn't support border styles other than "solid" for images.
        if (combinedStyles.borderWidth) {
            combinedStyles['borderStyle'] = 'solid';
        }

        let resizeMode = 'contain';
        switch (this.props.resizeMode) {
            case 'cover':
                resizeMode = 'cover';
                break;

            case 'stretch':
                resizeMode = '100% 100%';
                break;

            case 'repeat':
                resizeMode = 'auto';
                break;
        }

        combinedStyles['backgroundPosition'] = 'center center';
        combinedStyles['backgroundSize'] = resizeMode;
        combinedStyles['backgroundRepeat'] = this.props.resizeMode === 'repeat' ? 'repeat' : 'no-repeat';

        return combinedStyles;
    }

    private _onLoad = () => {
        if (!this._isMounted) {
            return;
        }

        // Measure the natural width & height of the image.
        this._nativeImageWidth = undefined;
        this._nativeImageHeight = undefined;
        let imageDOM = ReactDOM.findDOMNode<HTMLImageElement>(this.refs['image']);
        if (imageDOM) {
            this._nativeImageWidth = imageDOM.naturalWidth;
            this._nativeImageHeight = imageDOM.naturalHeight;
        }

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

    private _onMouseUp = (e: Types.MouseEvent) => {
        if (e.button === 0) {
            // Types.Image doesn't officially support an onClick prop, but when it's
            // contained within a button, it may have this prop.
            let onClick: (e: Types.MouseEvent) => void = (this.props as any).onClick;
            if (onClick) {
                onClick(e);
            }
        }
    }

    // Note: This works only if you have an onLoaded handler and wait for the image to load.
    getNativeWidth(): number {
        return this._nativeImageWidth;
    }

    getNativeHeight(): number {
        return this._nativeImageHeight;
    }
}

export default Image;
