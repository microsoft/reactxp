/*
* react-native-video.d.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definition for the React Native implementation
* of video player:
* https://github.com/brentvatne/react-native-video
*/

declare module 'react-native-video' {

    import React = require('react');
    import RN = require('react-native');

    interface VideoProgress {
        atValue: number;
        target: number;
        playableDuration: number;
        atTimeScale: number;
        currentTime: number;
    }

    interface VideoInfo {
        duration?: number;
        naturalSize?: {
            width: number;
            height: number;
        };
    }

    interface VideoBufferInfo {
        isBuffering: boolean;
    }

    interface VideoProps extends RN.ComponentPropsBase {
        source: {
            uri: string;
            type?: string;

            // Some versions of react-native-video may not support this option.
            authToken?: string;
        };

        resizeMode?: string;
        poster?: string;
        repeat?: boolean;
        paused?: boolean;
        muted?: boolean;
        volume?: number; // 0 is muted, 1 is normal
        rate?: number; // 0 is paused, 1 is normal
        playInBackground?: boolean;
        playWhenInactive?: boolean;
        ignoreSilentSwitch?: 'ignore'|'obey';
        disableFocus?: boolean;
        controls?: boolean;
        currentTime?: number;
        progressUpdateInterval?: number;
        onLoadStart?: () => void;
        onLoad?: (info: VideoInfo) => void;
        onBuffer?: (bufferInfo: VideoBufferInfo) => void;
        onError?: () => void;
        onProgress?: (progress: VideoProgress) => void;
        onSeek?: () => void;
        onEnd?: () => void;
        onFullscreenPlayerWillPresent?: () => void;
        onFullscreenPlayerDidPresent?: () => void;
        onFullscreenPlayerWillDismiss?: () => void;
        onFullscreenPlayerDidDismiss?: () => void;
        onReadyForDisplay?: () => void;
        onPlaybackStalled?: () => void;
        onPlaybackResume?: () => void;
        onPlaybackRateChange?: () => void;
        onAudioFocusChanged?: () => void;
        onAudioBecomingNoisy?: () => void;

        style?: any
    }

    export default class Video extends React.Component<VideoProps, {}> { }
}
