/**
 * Video.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Video abstraction.
 */

import * as React from 'react';
import * as RX from 'reactxp';
import { default as RNVideo, VideoInfo, VideoBufferInfo } from 'react-native-video';

import * as Types from '../common/Types';

export interface VideoState {
    isPlaying?: boolean;
    isMuted?: boolean;
    duration?: number;
}

class Video extends RX.Component<Types.VideoProps, VideoState> {
    private _mountedComponent: RNVideo|null = null;

    constructor(props: Types.VideoProps) {
        super(props);

        this.state = {
            isPlaying: false,
            isMuted: false
        };
    }

    render() {
        const source = typeof this.props.source === 'number'
            ? this.props.source
            : { uri: this.props.source };
        return (
            <RNVideo
                ref={ this._onMount }
                controls={ this.props.showControls }
                paused={ !this.state.isPlaying }
                muted={ this.state.isMuted }
                repeat={ this.props.loop }
                source={ source }
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

    private _onMount = (component: any) => {
        this._mountedComponent = component as RNVideo;
    }

    private _onError = () => {
        if (!this._mountedComponent) {
            return;
        }

        if (this.props.onError) {
            this.props.onError();
        }
    }

    private _onLoad = () => {
        if (!this._mountedComponent) {
            return;
        }

        // The native control calls _onLoad only if you are
        // not displaying the native play controls.
        if (!this.props.showControls && this.props.onCanPlay) {
            this.props.onCanPlay();
        }
    }

    private _onLoadData = (loadInfo: VideoInfo) => {
        if (!this._mountedComponent) {
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
        if (!this._mountedComponent) {
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
        if (!this._mountedComponent) {
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
        if (this._mountedComponent) {
            this._mountedComponent.seek(position);
        }
    }

    seekPercent(percentage: number) {
        if (this._mountedComponent) {
            this._mountedComponent.seek(this.state.duration * percentage);
        }
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
