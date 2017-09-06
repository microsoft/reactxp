---
id: extensions/video
title: Video
layout: docs
category: Extensions
permalink: docs/extensions/video.html
next: extensions/virtuallistview
---

This component provides video playback capabilities, presenting optional controls for play, pause, etc.

To install: ```npm install reactxp-video```

## Types
``` javascript
// Used to return progress information in the onProgress callback 
interface VideoProgress {
    currentTime: number;
    playableDuration: number;
    atValue?: number;
    target?: number;
    atTimeScale?: number;
}

// Used to return information about the video once its metadata
// has been loaded; returned by the onLoadedData callback
interface VideoInfo {
    duration?: number;
    naturalSize?: {
        width: number;
        height: number;
    };
}
```

## Props
``` javascript
// Alternate text to display if the image cannot be loaded
// or by screen readers
accessibilityLabel: string = undefined;

// Authentication token to include in request (not supported
// on some React Native implementations)
authToken: string = undefined;

// Should video playback loop to beginning after it completes?
loop: boolean = false;

// Called when the video is paused for buffering
onBuffer: () => void = undefined;

// Called when enough of the video has been loaded that playback
// is possible
onCanPlay: () => void = undefined;

// Called when enough of the video has been loaded that playback
// can proceed all the way to the end without buffering pauses
onCanPlayThrough: () => void = undefined;

// Called when the video playback reaches the end
onEnded: () => void = undefined;

// Called when the video cannot be loaded
onError: () => void = undefined;

// Called when the video's metadata has been loaded; returns
// information about the video
onLoadedData: (info: VideoInfo) => void = undefined;

// Called when the video data is starting to load
onLoadStart: () => void = undefined;

// Called periodically when the video is playing; reports
// progress information
onProgress: (progress: VideoProgress) => void = undefined;

// Indiciates which portion of the video should be pre-loaded
// when the component is mounted
preload: 'auto'|'metadata'|'none' = 'none';

// Determines how to resize the image if its natural size
// does not match the size of the container
resizeMode: 'contain'|'cover'|'stretch' = 'contain';

// Displays controls for play, pause, etc.
showControls: boolean = false;

// Source of video (URL)
source: string;

// See below for supported styles
style: ViewStyleRuleSet | ViewStyleRuleSet[] = [];
```

## Styles
[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)


## Methods
``` javascript
// Mutes or unmutes the sound for the video
mute(muted: boolean): void;

// Pauses the video
pause(): void;

// Plays the video at its current position
play(): void;

// Seeks to the specified position (specified in seconds)
seek(position: number): void;
```

## Sample Usage
``` javascript
return (
    <RX.Video
        source={ 'http://mydomain.com/coolvideo.mp4' }
    />
);
```
