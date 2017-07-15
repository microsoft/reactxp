/*
* Video.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Video abstraction.
*/

import extend = require('lodash/extend');
import React = require('react');
import RX = require('reactxp');
import ReactDOM = require('react-dom');

import Interfaces = require('../common/Interfaces');
import Types = require('../common/Types');

let _styles = {
    defaultStyle: {
        display: 'flex'
    }
};

class Video extends RX.Component<Types.VideoProps, {}> {
    componentDidMount() {
        // We need to manually install the onEnded handler because. React doesn't support this.
        let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
        videoDOM.onended = () => {
            if (this.props.onEnded) {
                this.props.onEnded();
            }
        };
    }

    componentWillUnmount() {
        let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
        if (videoDOM) {
            // Prevent Chrome based browsers  to leak video elements
            videoDOM.src = '';
        }
    }

    render() {
        let combinedStyles = RX.Styles.combine([_styles.defaultStyle, this.props.style]);

        if (this.props.resizeMode === 'cover') {
            combinedStyles = extend(combinedStyles, {
                position: 'absolute',
                minWidth: '100%',
                minHeight: '100%',
                width: 'auto',
                height: 'auto',
                top: '50%',
                left: '50%',
                WebkitTransform: 'translate(-50%,-50%)',
                MozTransform: 'translate(-50%,-50%)',
                msTransform: 'translate(-50%,-50%)',
                transform: 'translate(-50%,-50%)'
            });
        } else if (this.props.resizeMode === 'contain') {
            combinedStyles = extend(combinedStyles, {
                width: '100%',
                height: '100%'
            });
        } else {
            combinedStyles = extend(combinedStyles, {
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%'
            });
        }

        return (
            <video
                ref='video'
                style={ combinedStyles }
                src={ this.props.source }
                alt={ this.props.accessibilityLabel }
                controls={ this.props.showControls }
                loop={ this.props.loop }
                onLoadedData={ this._onLoadedData }
                onError={ this.props.onError }
                onEnded={ this.props.onEnded }
                onLoadStart={ this.props.onLoadStart}
                onCanPlay={ this.props.onCanPlay }
                onCanPlayThrough={ this.props.onCanPlayThrough }
                onTimeUpdate={ this.props.onProgress ? this._onTimeUpdate : null }
            />
        );
    }

    seek(position: number) {
        let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
        if (videoDOM) {
            videoDOM.currentTime = position;
        }
    }

    seekPercent(percentage: number) {
        let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
        if (videoDOM) {
            videoDOM.currentTime = percentage * videoDOM.duration;
        }
    }

    play() {
        let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
        if (videoDOM) {
            videoDOM.play();
        }
    }

    pause() {
        let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
        if (videoDOM) {
            videoDOM.pause();
        }
    }

    stop() {
        let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
        if (videoDOM) {
            videoDOM.pause();
            videoDOM.currentTime = 0;
        }
    }

    mute(muted: boolean) {
        let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
        if (videoDOM) {
            videoDOM.muted = muted;
        }
    }

    private _onLoadedData = () => {
        if (this.props.onLoadedData) {
            let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);

            if (videoDOM) {
                const loadInfo: Types.VideoInfo = {
                    duration: videoDOM.duration,
                    naturalSize: {
                        width: videoDOM.videoWidth,
                        height: videoDOM.videoHeight
                    }
                };
                this.props.onLoadedData(loadInfo);
            }
        }
    }

    private _onTimeUpdate = () => {
        if (this.props.onProgress) {
            let videoDOM = ReactDOM.findDOMNode<HTMLVideoElement>(this);
            if (videoDOM) {
                this.props.onProgress({
                    currentTime: videoDOM.currentTime,
                    playableDuration: videoDOM.duration
                });
            }
        }
    }
}

export default Video;
