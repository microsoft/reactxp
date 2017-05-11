/*
* Video.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Video abstraction.
*/

import React = require('react');
import { default as RNVideo, VideoInfo } from 'react-native-video';

import Interfaces = require('../common/Interfaces');
import Types = require('../common/Types');

export interface VideoState {
    isPlaying?: boolean;
    isMuted?: boolean;
    duration?: number;
}

class Video extends Interfaces.Video<VideoState> {
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
                paused={ !this.state.isPlaying }
                muted={ this.state.isMuted }
                repeat={ this.props.loop }
                source={ { uri: this.props.source } }
                style={ this.props.style }
                onEnd={ this._onEnd }
                onWaiting={ this.props.onWaiting }
                onPlaying={ this.props.onPlaying }
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

        if (this.props.onCanPlay) {
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

        this.setState({ duration: loadInfo.duration });
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
