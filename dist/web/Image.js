/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Image abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./utils/lodashMini");
var React = require("react");
var ReactDOM = require("react-dom");
var SyncTasks = require("synctasks");
var restyleForInlineText = require("./utils/restyleForInlineText");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var _styles = {
    image: {
        position: 'absolute',
        display: 'flex',
        opacity: 0,
        maxWidth: '100%',
        maxHeight: '100%'
    },
    defaultContainer: Styles_1.default.createImageStyle({
        position: 'relative',
        flex: 0,
        overflow: 'visible',
        backgroundColor: 'transparent'
    })
};
var XhrBlobUrlCache = (function () {
    function XhrBlobUrlCache() {
    }
    XhrBlobUrlCache.get = function (source) {
        if (this._cachedXhrBlobUrls[source]) {
            this._cachedXhrBlobUrls[source].refCount++;
            return this._cachedXhrBlobUrls[source].xhrBlobUrl;
        }
        return null;
    };
    XhrBlobUrlCache.insert = function (source, xhrBlobUrl) {
        XhrBlobUrlCache._cleanupIfCapacityExceeded();
        if (this._cachedXhrBlobUrls[source]) {
            XhrBlobUrlCache._cachedXhrBlobUrls[source].refCount++;
        }
        else {
            var xhrBlobUrlCacheEntry = {
                xhrBlobUrl: xhrBlobUrl,
                insertionDate: Date.now(),
                refCount: 1
            };
            XhrBlobUrlCache._cachedXhrBlobUrls[source] = xhrBlobUrlCacheEntry;
        }
    };
    XhrBlobUrlCache.release = function (source) {
        // Keep track of which cache entries are being used as we don't want to clean up a resource that someone is
        // still relying on.
        if (this._cachedXhrBlobUrls[source]) {
            XhrBlobUrlCache._cachedXhrBlobUrls[source].refCount--;
        }
    };
    XhrBlobUrlCache._cleanupIfCapacityExceeded = function () {
        // If we've reached maximum capacity, clean up the oldest freeable cache entry if any. An entry is freeable is
        // it's not currently in use (refCount == 0). Return whether we have room to add more entries to the cache.
        if (Object.keys(XhrBlobUrlCache._cachedXhrBlobUrls).length + 1 > XhrBlobUrlCache._maximumItems) {
            var oldestFreeableKey_1;
            var oldestFreeableEntry_1;
            Object.keys(XhrBlobUrlCache._cachedXhrBlobUrls).forEach(function (key) {
                if ((!oldestFreeableEntry_1 || XhrBlobUrlCache._cachedXhrBlobUrls[key].insertionDate < oldestFreeableEntry_1.insertionDate) &&
                    XhrBlobUrlCache._cachedXhrBlobUrls[key].refCount === 0) {
                    oldestFreeableKey_1 = key;
                    oldestFreeableEntry_1 = XhrBlobUrlCache._cachedXhrBlobUrls[key];
                }
            });
            if (oldestFreeableKey_1) {
                URL.revokeObjectURL(oldestFreeableEntry_1.xhrBlobUrl);
                delete XhrBlobUrlCache._cachedXhrBlobUrls[oldestFreeableKey_1];
            }
        }
    };
    return XhrBlobUrlCache;
}());
// Use a global cache to work around the image loading delays introduced by the xhr requests. This is especially
// visible when scrolling a virtual list view which contains xhr images.
XhrBlobUrlCache._maximumItems = 128;
XhrBlobUrlCache._cachedXhrBlobUrls = {};
var Image = (function (_super) {
    __extends(Image, _super);
    function Image(props) {
        var _this = _super.call(this, props) || this;
        _this._isMounted = false;
        _this._onLoad = function () {
            if (!_this._isMounted) {
                return;
            }
            // Measure the natural width & height of the image.
            _this._nativeImageWidth = undefined;
            _this._nativeImageHeight = undefined;
            var imageDOM = ReactDOM.findDOMNode(_this.refs['image']);
            if (imageDOM) {
                _this._nativeImageWidth = imageDOM.naturalWidth;
                _this._nativeImageHeight = imageDOM.naturalHeight;
            }
            // We can hide the img now. We assume that if the img. URL resolved without error,
            // then the background img. URL also did.
            _this.setState({
                showImgTag: false
            });
            if (_this.props.onLoad) {
                _this.props.onLoad({ width: _this._nativeImageWidth, height: _this._nativeImageHeight });
            }
        };
        _this._imgOnError = function () {
            _this._onError();
        };
        _this._onMouseUp = function (e) {
            if (e.button === 0) {
                // Types.Image doesn't officially support an onClick prop, but when it's
                // contained within a button, it may have this prop.
                var onClick = _this.props.onClick;
                if (onClick) {
                    onClick(e);
                }
            }
        };
        var performXhrRequest = _this._initializeAndSetState(props);
        if (performXhrRequest) {
            _this._startXhrImageFetch(props);
        }
        return _this;
    }
    Image.prototype.getChildContext = function () {
        // Let descendant RX components know that their nearest RX ancestor is not an RX.Text.
        // Because they're in an RX.Image, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: false };
    };
    Image.prefetch = function (url) {
        var defer = SyncTasks.Defer();
        var img = new window.Image();
        img.src = url;
        img.onload = (function (event) {
            defer.resolve(true);
        });
        img.onerror = (function (event) {
            defer.reject('Failed to prefetch url ' + url);
        });
        img.onabort = (function (event) {
            defer.reject('Prefetch cancelled for url ' + url);
        });
        return defer.promise();
    };
    Image.prototype.componentWillReceiveProps = function (nextProps) {
        var sourceOrHeaderChanged = (nextProps.source !== this.props.source ||
            !_.isEqual(nextProps.headers || {}, this.props.headers || {}));
        if (!nextProps.onLoad !== !this.props.onLoad || !nextProps.onError !== !this.props.onError || sourceOrHeaderChanged) {
            var performXhrRequest = this._initializeAndSetState(nextProps);
            if (sourceOrHeaderChanged && performXhrRequest) {
                this._startXhrImageFetch(nextProps);
            }
        }
    };
    Image.prototype.componentDidMount = function () {
        this._isMounted = true;
    };
    Image.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        if (this.state.displayUrl && this.state.xhrRequest) {
            XhrBlobUrlCache.release(this.props.source);
        }
    };
    Image.prototype._initializeAndSetState = function (props) {
        // Retrieve the xhr blob url from the cache if it exists. This is a performance optimization as we've seen xhr
        // requests take some time and cause flicker during rendering. Even when we're hitting the browser cache, we've
        // seen it stall and take some time.
        var cachedXhrBlobUrl = props.headers ? XhrBlobUrlCache.get(props.source) : null;
        var displayUrl = !!cachedXhrBlobUrl ? cachedXhrBlobUrl :
            !!props.headers ? '' : props.source;
        // Only make the xhr request if headers are specified and there was no cache hit.
        var performXhrRequest = !!props.headers && !cachedXhrBlobUrl;
        // We normally don't show an img tag because we use background images. However, if the caller has supplied an
        // onLoad or onError callback, we'll use the img tag until we receive an onLoad or onError.
        this.state = {
            showImgTag: (!performXhrRequest || !!cachedXhrBlobUrl) && (!!props.onLoad || !!props.onError),
            xhrRequest: !!props.headers,
            displayUrl: displayUrl
        };
        return performXhrRequest;
    };
    Image.prototype._handleXhrBlob = function (blob) {
        if (!this._isMounted) {
            return;
        }
        this.setState({
            displayUrl: URL.createObjectURL(blob)
        });
        // Save the newly fetched xhr blob url in the cache.
        XhrBlobUrlCache.insert(this.props.source, this.state.displayUrl);
        this._onLoad();
    };
    Image.prototype._startXhrImageFetch = function (props) {
        // Test hook to simulate a slower hxr request.
        // window.setTimeout(() => this._actuallyStartXhrImageFetch(props), 2500);
        this._actuallyStartXhrImageFetch(props);
    };
    Image.prototype._actuallyStartXhrImageFetch = function (props) {
        var _this = this;
        // Fetch Implementation
        if (window.fetch) {
            var headers = new Headers();
            Object.keys(props.headers).forEach(function (key) {
                headers.append(key, props.headers[key]);
            });
            var xhr = new Request(props.source, {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            });
            fetch(xhr)
                .then(function (response) {
                if (!response.ok) {
                    _this._onError(new Error(response.statusText));
                }
                response.blob().then(function (blob) {
                    _this._handleXhrBlob(blob);
                });
            }, function (err) {
                _this._onError(err);
            });
        }
        else {
            var req = new XMLHttpRequest();
            req.open('GET', props.source, true);
            req.responseType = 'blob';
            Object.keys(props.headers).forEach(function (key) {
                req.setRequestHeader(key, props.headers[key]);
            });
            req.onload = function () {
                if (req.status >= 400 || req.status < 600) {
                    _this._onError(new Error(req.statusText));
                }
                else {
                    _this._handleXhrBlob(req.response);
                }
            };
            req.onerror = function () {
                _this._onError(new Error('Network issue downloading the image.'));
            };
            req.send();
        }
    };
    Image.prototype.render = function () {
        // Prepare image source (necessary as iOS implementation also allows objects)
        if (typeof this.props.source !== 'string' && typeof this.props.source !== 'undefined') {
            var errorText = 'Types/web/Image only accepts string sources! You passed: '
                + this.props.source + ' of type ' + (typeof this.props.source);
            throw new Error(errorText);
        }
        var optionalImg = null;
        if (this.state.showImgTag) {
            optionalImg = (React.createElement("img", { style: _styles.image, src: this.state.displayUrl, alt: this.props.accessibilityLabel, onLoad: this._onLoad, onError: this._imgOnError, key: 'image', ref: 'image' }));
        }
        var reactElement = (React.createElement("div", { style: this._getStyles(), onMouseUp: this._onMouseUp, title: this.props.title },
            optionalImg,
            this.props.children));
        return this.context.isRxParentAText ?
            restyleForInlineText(reactElement) :
            reactElement;
    };
    Image.prototype._getStyles = function () {
        var combinedStyles = Styles_1.default.combine(_styles.defaultContainer, this.props.style);
        combinedStyles['display'] = 'flex';
        // It is necessary to wrap the url in quotes as in url("a.jpg?q=(a and b)").
        // If the url is unquoted and contains paranthesis, e.g. a.jpg?q=(a and b), it will become url(a.jpg?q=(a and b))
        // which will not render on the screen.
        combinedStyles['backgroundImage'] = 'url("' + this.state.displayUrl + '")';
        // Types doesn't support border styles other than "solid" for images.
        if (combinedStyles.borderWidth) {
            combinedStyles['borderStyle'] = 'solid';
        }
        var resizeMode = 'contain';
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
    };
    Image.prototype._onError = function (err) {
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
    };
    // Note: This works only if you have an onLoaded handler and wait for the image to load.
    Image.prototype.getNativeWidth = function () {
        return this._nativeImageWidth;
    };
    Image.prototype.getNativeHeight = function () {
        return this._nativeImageHeight;
    };
    return Image;
}(RX.Image));
Image.contextTypes = {
    isRxParentAText: React.PropTypes.bool
};
Image.childContextTypes = {
    isRxParentAText: React.PropTypes.bool.isRequired
};
exports.Image = Image;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Image;
