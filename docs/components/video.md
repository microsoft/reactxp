---
id: components/video
title: Video
layout: docs
category: Components
permalink: docs/components/video.html
next: components/view
---

This component displays a video, which can come from a local source or from the network. The types of videos supported differ by platform and browser.

If child elements are specified, the video acts as a background, and the children are rendered on top of it.

## Props
``` javascript
// Alternate text to display if the video cannot be loaded or by screen readers
accessibilityLabel: string = undefined;

// Called when enough of the video has been loaded that it can be played
onCanPlay: () => void;

// Called when enough of the video has been buffered that it can play all the way to the end without stopping
onCanPlayThrough: () => void;

// Called when the video has reached the end
onEnded: () => void;

// Called when an error occurs that prevents the video from loading
onError: (e: RX.SyntheticEvent) => void;

// Called when the video successfully loads
onLoad: (e: RX.SyntheticEvent) => void;

// Should the contents of the video be downloaded automatically?
preload: enum { 'auto', 'metadata', 'none' }

// Determines how to resize the image if its natural size does not match the size of the container
resizeMode: enum { 'stretch', 'contain', 'cover' }

// Display play, pause, and scrubber controls?
showControls: boolean = true;

// URL to image
source: string = undefined;

// See below for supported styles
style: RX.VideoStyleRuleSet | RX.VideoStyleRuleSet[] = [];
```

## Styles
[**Flexbox Styles**](docs/styles.html#flexbox-style-attributes)

[**View Styles**](docs/styles.html#view-style-attributes)

[**Transform Styles**](docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Plays the video from the start or the last pause location
play(): void;

// Pauses playback at the current location
pause(): void;

// Stops the video at the current location and resets the current location to the start
stop(): void;
```



