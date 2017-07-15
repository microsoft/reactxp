/*
* Video.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of the cross-platform Video abstraction.
*/

import React = require('react');
import RN = require('react-native');
import RX = require('reactxp');

import Interfaces = require('../common/Interfaces');
import Types = require('../common/Types');

var _styles = RN.StyleSheet.create({
    bg: {
        backgroundColor: 'red'
    }
});

export interface VideoState {
    isPlaying?: boolean;
    duration?: number;
}

class Video extends RX.Component<Types.VideoProps, VideoState> {
    // TODO(uwp): #694149 Not implemented
    render() {
        return (
            <RN.View
                style={ [this.props.style, _styles.bg] }
            >
                <RN.Text>Video</RN.Text>
            </RN.View>
        );
    }

    seek(position: number) {
        // TODO(uwp): #694149 Not implemented
    }

    seekPercent(percentage: number) {
        // TODO(uwp): #694149 Not implemented
    }

    play() {
        // TODO(uwp): #694149 Not implemented
    }

    pause() {
        // TODO(uwp): #694149 Not implemented
    }

    stop() {
        this.pause();
        this.seek(0);
    }

    mute(muted: boolean) {
        // TODO(uwp): #694149 Not implemented
    }
}

export default Video;
