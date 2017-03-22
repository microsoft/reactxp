---
id: apis/audio
title: Audio
layout: docs
category: Interfaces
permalink: docs/apis/audio.html
next: apis/clipboard
---

This interface allows for the playback of audio files. The Audio.openFile method returns an AudioPlayer object which can be used to control and monitor the playback.

## Types
``` javascript
// Metadata about the audio file
interface AudioInfo {
    duration: number;
}

// Progress information
interface AudioPlayerProgress {
    currentPosition: number;
    bufferedDuration: number;
}
```

## Audio Methods
``` javascript
// Returns an AudioPlayer object loaded from the specified URL.
openFile(fileUrl: string): AudioPlayer;
```

## AudioPlayer Methods
``` javascript
// Initiates or resumes playback of the sound. It does nothing if
// the sound is already playing. May delay while sound is loaded.
play(loop: boolean): void;

// Stop playing and leave the position as is
pause(): void;

// Move to the specified position. If playing, continue playing,
// and if paused, remain paused
seek(position: number): void;

// Stop playing and reset the position to the beginning
stop(): void;

// A refcount is maintained between openFile and release.
// The player will remain cached as long as the refcount is non-zero.
// This call is optional.
release(): void;

// Returns the duration of the sound if loaded, otherwise zero
getDuration(): number;
```

## AudioPlayer Events
``` javascript
// Triggered when playback position changed
progressEvent: SubscribableEvent<(eventData: Types.AudioPlayerProgress)
    => void>();

// Triggered when sound loads and playback can proceed without delay
loadedEvent: SubscribableEvent<(info: Types.AudioInfo) => void>();

// Triggered when playback reaches the end of the sound without looping
endedEvent: SubscribableEvent<() => void>();

// Triggered on unrecoverable errors
errorEvent: SubscribableEvent<() => void>();
```

