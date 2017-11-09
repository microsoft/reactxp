/*
* Video.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Video abstraction.
*/

import React = require('react');
import { default as RNVideo, VideoInfo, VideoBufferInfo } from 'react-native-video';
import RX = require('reactxp');

import Interfaces = require('../common/Interfaces');
import Types = require('../common/Types');

export interface VideoState {
    isPlaying?: boolean;
    isMuted?: boolean;
    duration?: number;
}

class Video extends RX.Component<Types.VideoProps, VideoState> {
    private _isMounted = false;

    constructor(props: Types.VideoProps) {
        super(props);

        this.state = {
            isPlaying: false,
            isMuted: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <RNVideo
                ref='video'
                controls={ this.props.showControls }
                paused={ !this.state.isPlaying }
                muted={ this.state.isMuted }
                repeat={ this.props.loop }
                source={ { uri: this.props.source } }
                style={ this.props.style }
                onEnd={ this._onEnd }
                onBuffer={ this._onBuffer }
                onLoadStart={ this.props.onLoadStart}
                onProgress={ this.props.onProgress }
                onReadyForDisplay={ this._onLoad }
                onLoad={ this._onLoadData }
                onError={ this._onError }
                resizeMode={ this.props.resizeMode || 'contain' }
            />
        );
    }

    private _onError = () => {
        if (!this._isMounted) {
            return;
        }

        if (this.props.onError) {
            this.props.onError();
        }
    }

    private _onLoad = () => {
        if (!this._isMounted) {
            return;
        }

        // The native control calls _onLoad only if you are
        // not displaying the native play controls.
        if (!this.props.showControls && this.props.onCanPlay) {
            this.props.onCanPlay();
        }
    }

    private _onLoadData = (loadInfo: VideoInfo) => {
        if (!this._isMounted) {
            return;
        }

        if (this.props.onLoadedData) {
            this.props.onLoadedData(loadInfo);
        }

        // The native control calls _onLoad only if you are
        // not displaying the native play controls.
        if (this.props.showControls && this.props.onCanPlay) {
            this.props.onCanPlay();
        }

        this.setState({ duration: loadInfo.duration });
    }

    private _onBuffer = (bufferInfo: VideoBufferInfo) => {
        if (!this._isMounted) {
            return;
        }

        if (bufferInfo.isBuffering) {
            if (this.props.onBuffer) {
                this.props.onBuffer();
            }
        } else {
            if (this.props.onCanPlayThrough) {
                this.props.onCanPlayThrough();
            }
        }
    }

    private _onEnd = () => {
        if (!this._isMounted) {
            return;
        }

        if (!this.props.loop) {
            // Stop it so it doesn't auto-start.
            this.setState({ isPlaying: false });

            // Seek video to start.
            this.seek(0);
        }

        if (this.props.onEnded) {
            this.props.onEnded();
        }
    }

    seek(position: number) {
        (this.refs['video'] as any).seek(position);
    }

    seekPercent(percentage: number) {
        (this.refs['video'] as any).seek(this.state.duration * percentage);
    }

    play() {
        this.setState({ isPlaying: true });
    }

    pause() {
        this.setState({ isPlaying: false });
    }

    stop() {
        this.pause();
        this.seek(0);
    }

    mute(muted: boolean) {
        this.setState({ isMuted: muted });
    }
}

export default Video;
