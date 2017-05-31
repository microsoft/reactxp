/*
* This file demonstrates a basic ReactXP app.
*/

import RX = require('reactxp');
import { default as RXVideo } from 'reactxp-video';

import ProgressIndicator from './ProgressIndicator';
import ToggleSwitch from './ToggleSwitch';

interface SecondPanelProps {
    onNavigateBack: () => void;
}

interface SecondPanelState {
    toggleValue?: boolean;
    progressValue?: number;
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

class SecondPanel extends RX.Component<SecondPanelProps, SecondPanelState> {
    private _progressTimerToken: number;

    constructor() {
        super();

        this.state = {
            toggleValue: true,
            progressValue: 0
        };
    }

    componentDidMount() {
        this._startProgressIndicator();
    }

    componentWillUnmount() {
        this._stopProgressIndicator();
    }

    render() {
        return (
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
                        style={ styles.progressMargin }
                        progress={ this.state.progressValue }
                        fillColor={ '#ddd' }
                        size={ 32 }
                    />

                    <RX.Text style={ [styles.titleText, styles.videoTitleText] }>
                        Here is a video using the Video extension
                    </RX.Text>
                    <RXVideo
                        ref='video'
                        style={ styles.video }
                        source={ 'https://www.w3schools.com/html/mov_bbb.mp4' }
                        loop={ true }
                        onCanPlay={ this._playVideo }
                    />
                </RX.View>
            </RX.ScrollView>
        );
    }

    private _onPressBack = () => {
        this.props.onNavigateBack();
    }

    private _playVideo = () => {
        const video = this.refs['video'] as RXVideo;
        if (video) {
            video.mute(true);
            video.play();
        }
    }

    private _startProgressIndicator() {
        this._progressTimerToken = window.setInterval(() => {
            const newProgressValue = (this.state.progressValue + 0.02) % 1;
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
    private _onChangeToggle = (newValue: boolean) => {
        this.setState({ toggleValue: newValue });
    }
}

export = SecondPanel;
