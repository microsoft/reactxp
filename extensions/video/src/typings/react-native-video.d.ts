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

    interface VideoProps extends RN.ComponentPropsBase {
        source: {
            uri: string,
            type?: string,
            
            // Some versions of react-native-video may not support this option.
            authToken?: string

        }, // Can be a URL or a local file.
        rate?: number,         // 0 is paused, 1 is normal.
        volume?: number,       // 0 is muted, 1 is normal.
        muted?: boolean,       // Mutes the audio entirely.
        paused?: boolean,      // Pauses playback entirely.
        resizeMode?: string,   // Fill the whole screen at aspect ratio.
        repeat?: boolean,      // Repeat forever.

        onLoadStart?: ()=> void, // Callback when video starts to load
        onLoad?: (info: VideoInfo) => void, // Callback when video loads
        onProgress?: (progress: VideoProgress) => void,  // Callback every ~250ms with currentTime
        onReadyForDisplay?: () => void,
        onEnd?: () => void,     // Callback when playback finishes
        onWaiting?: () => void,
        onPlaying?: () => void,
        onError?: () => void,
        style?: any
    }

    export default class Video extends React.Component<VideoProps, {}> { }
}
