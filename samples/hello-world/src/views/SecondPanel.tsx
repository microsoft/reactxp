import * as React from 'react';
import * as RX from 'reactxp';
import RXVideo from 'reactxp-video';

import { ProgressIndicator } from '../controls/ProgressIndicator';
import { ToggleSwitch } from '../controls/ToggleSwitch';

interface SecondPanelProps extends RX.CommonProps {
    onNavigateBack: () => void;
}

interface SecondPanelState {
    progressValue?: number;
    toggleValue?: boolean;
}

const styles = {
    scroll: RX.Styles.createScrollViewStyle({
        alignSelf: 'stretch',
        backgroundColor: '#f5fcff'
    }),
    container: RX.Styles.createViewStyle({
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }),
    titleText: RX.Styles.createTextStyle({
        fontSize: 16,
        textAlign: 'center',
        marginTop: 12,
        color: 'black'
    }),
    videoTitleText: RX.Styles.createTextStyle({
        marginBottom: 8
    }),
    progressMargin: RX.Styles.createViewStyle({
        margin: 8
    }),
    video: RX.Styles.createViewStyle({
        height: 176,
        width: 320
    }),
    roundButton: RX.Styles.createViewStyle({
        margin: 16,
        borderRadius: 16,
        backgroundColor: '#7d88a9'
    }),
    buttonText: RX.Styles.createTextStyle({
        fontSize: 16,
        marginVertical: 6,
        marginHorizontal: 12,
        color: 'white'
    })
};

export class SecondPanel extends RX.Component<SecondPanelProps, SecondPanelState> {
    readonly state: SecondPanelState = {
        progressValue: 0,
        toggleValue: true
    };

    private _progressTimerToken: number | undefined;
    private _mountedVideo: RXVideo | undefined;

    componentDidMount() {
        this._startProgressIndicator();
    }

    componentWillUnmount() {
        this._stopProgressIndicator();
    }

    render() {
        return (
            <RX.View useSafeInsets={ true }>
                <RX.ScrollView style={ styles.scroll }>
                    <RX.View style={ styles.container }>
                        <RX.Button style={ styles.roundButton } onPress={ this._onPressBack }>
                            <RX.Text style={ styles.buttonText }>
                                Go Back
                            </RX.Text>
                        </RX.Button>

                        <RX.Text style={ styles.titleText }>
                            Here is a simple control built using ReactXP
                        </RX.Text>
                        <ToggleSwitch
                            value={ this.state.toggleValue }
                            onChange={ this._onChangeToggle }
                        />

                        <RX.Text style={ styles.titleText }>
                            Here is an SVG image using the ImageSvg extension
                        </RX.Text>
                        <ProgressIndicator
                            fillColor={ '#ddd' }
                            style={ styles.progressMargin as any }
                            size={ 32 }
                            progress={ this.state.progressValue! }
                        />

                        <RX.Text style={ [styles.titleText, styles.videoTitleText] }>
                            Here is a video using the Video extension
                        </RX.Text>
                        <RXVideo
                            source={ 'https://www.w3schools.com/html/mov_bbb.mp4' }
                            style={ styles.video as any }
                            loop={ true }
                            ref={ this._onMountVideo }
                            onCanPlay={ this._playVideo }
                        />
                    </RX.View>
                </RX.ScrollView>
            </RX.View>
        );
    }

    private _onMountVideo = (component: any) => {
        this._mountedVideo = component;
    }

    private _onPressBack = () => {
        this.props.onNavigateBack();
    }

    private _playVideo = () => {
        if (this._mountedVideo) {
            this._mountedVideo.mute(true);
            this._mountedVideo.play();
        }
    }

    private _startProgressIndicator() {
        this._progressTimerToken = window.setInterval(() => {
            const newProgressValue = (this.state.progressValue! + 0.02) % 1;
            this.setState({ progressValue: newProgressValue });
        }, 1000 / 15);
    }

    private _stopProgressIndicator() {
        if (this._progressTimerToken) {
            window.clearInterval(this._progressTimerToken);
            this._progressTimerToken = undefined;
        }
    }

    // Note that we define this as a variable rather than a normal method. Using this
    // method, we prebind the method to this component instance. This prebinding ensures
    // that each time we pass the variable as a prop in the render function, it will
    // not change. We want to avoid unnecessary prop changes because this will trigger
    // extra work within React's virtual DOM diffing mechanism.
    private _onChangeToggle = (toggleValue: boolean) => {
        this.setState({ toggleValue });
    }
}
