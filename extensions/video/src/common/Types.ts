/*
* Types.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definitions to support the plugin.
*/

import { Types as RXTypes } from 'reactxp';

// Video interfaces from react-native-video
export interface VideoProgress {
    currentTime: number;
    playableDuration: number;
    atValue?: number;
    target?: number;
    atTimeScale?: number;
}

export interface VideoInfo {
    duration?: number;
    naturalSize?: {
        width: number;
        height: number;
    };
}

export interface VideoProps extends RXTypes.CommonStyledProps<RXTypes.ViewStyleRuleSet> {
    source: string;
    accessibilityLabel?: string;
    showControls?: boolean;
    preload?: 'auto'|'metadata'|'none';
    resizeMode?: 'contain'|'cover'|'stretch';
    loop?: boolean;
    authToken?: string;
    shouldRedirectForAndroidHLS?: boolean;

    onBuffer?: () => void;
    onCanPlay?: () => void;
    onCanPlayThrough?: () => void;
    onEnded?: () => void;
    onError?: () => void;
    onLoadStart?: () => void;
    onLoadedData?: (info: VideoInfo) => void;
    onProgress?: (progress: VideoProgress) => void;
}
