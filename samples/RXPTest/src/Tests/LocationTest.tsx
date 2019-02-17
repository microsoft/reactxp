/*
* Tests the RX.Location APIs in an automated manner.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { AutoExecutableTest, TestResult, TestType } from '../Test';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'flex-start'
    }),
    textContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    labelContainer: RX.Styles.createViewStyle({
        alignSelf: 'center',
        margin: 8
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    labelText: RX.Styles.createTextStyle({
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    }),
    historyText: RX.Styles.createTextStyle({
        marginHorizontal: 32,
        marginBottom: 12,
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    })
};

const msPerSample = 2000;
const totalSamplesInTest = 3;

interface LocationState {
    isLocationAvailable?: boolean;

    // Used for polling the location
    polledPositionHistory?: string;

    // Used for "watching" the location (geofencing)
    watchPositionHistory?: string;
}

class LocationView extends RX.Component<RX.CommonProps, LocationState> {
    private _isMounted = false;
    private _locationWatchId: RX.Types.LocationWatchId | undefined;
    private _timerId = 0;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            isLocationAvailable: RX.Location.isAvailable(),
            polledPositionHistory: '',
            watchPositionHistory: ''
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        if (this._locationWatchId !== undefined) {
            RX.Location.clearWatch(this._locationWatchId);
        }

        this._isMounted = false;
    }

    render() {
        return (
            <RX.View style={ _styles.container }>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Are geolocation services available on this platform?' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this.state.isLocationAvailable ? 'Geolocation Available' : 'Geolocation Not Available' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Polled location (low accuracy):' }
                    </RX.Text>
                </RX.View>
                <RX.Text style={ _styles.historyText }>
                    { this.state.polledPositionHistory || '(no history available)' }
                </RX.Text>

                <RX.View style={ _styles.textContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Watched location (high accuracy):' }
                    </RX.Text>
                </RX.View>
                <RX.Text style={ _styles.historyText }>
                    { this.state.watchPositionHistory || '(no history available)' }
                </RX.Text>
            </RX.View>
        );
    }

    execute(complete: (result: TestResult) => void) {
        let result = new TestResult();

        // If services are not available, return success immediately.
        if (!this.state.isLocationAvailable) {
            return complete(result);
        }

        this.setState({
            polledPositionHistory: '',
            watchPositionHistory: ''
        });

        let loggedPolledLocationError = false;
        let sampleCount = 0;

        let loggedWatchedLocationError = false;
        let watchId: RX.Types.LocationWatchId;

        let pollLocation = () => {
            RX.Location.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: msPerSample * 0.9
            }).then(position => {
                this.setState({
                    polledPositionHistory: this.state.polledPositionHistory +
                        this._formatPosition(position) + '\n'
                });
            }).catch(err => {
                // Log the error, but make sure we don't log it more than once.
                const errCode = err.code as RX.Types.LocationErrorType;

                // Don't log a timeout as an error.
                if (errCode !== RX.Types.LocationErrorType.Timeout) {
                    if (!loggedPolledLocationError) {
                        result.errors.push('RX.Location.getCurrentPosition returned error: ' +
                            this._formatError(errCode));
                        loggedPolledLocationError = true;
                    }
                }

                this.setState({
                    polledPositionHistory: this.state.polledPositionHistory +
                        '(' + this._formatError(err.code as RX.Types.LocationErrorType) + ')\n'
                });
            }).always(() => {
                sampleCount++;
                if (sampleCount < totalSamplesInTest) {
                    _.delay(() => {
                        pollLocation();
                    }, msPerSample);
                } else {
                    // Stop watching the position.
                    if (watchId !== undefined) {
                        RX.Location.clearWatch(watchId);
                    }

                    // Mark the test as complete.
                    complete(result);
                }
            });
        };
        _.defer(() => {
            // Start polling, but do it in a deferred manner to allow
            // for setState to take effect first.
            pollLocation();
        });

        let logWatchedLocationError = (err: RX.Types.LocationErrorType) => {
            // Log the error, but make sure we don't log it more than once.
            const errCode = err as RX.Types.LocationErrorType;
            
            // Don't log a timeout as an error.
            if (errCode !== RX.Types.LocationErrorType.Timeout) {
                if (!loggedWatchedLocationError) {
                    result.errors.push('RX.Location.watchPosition returned error: ' +
                        this._formatError(errCode));
                    loggedWatchedLocationError = true;
                }
            }

            this.setState({
                watchPositionHistory: this.state.watchPositionHistory +
                    '(' + this._formatError(err as RX.Types.LocationErrorType) + ')\n'
            });
        };

        // Start the watched position in parallel.
        RX.Location.watchPosition(position => {
            this.setState({
                watchPositionHistory: this.state.watchPositionHistory +
                    this._formatPosition(position) + '\n'
            });
        }, err => {
            logWatchedLocationError(err);
        }, {
            enableHighAccuracy: true,
            timeout: msPerSample * (totalSamplesInTest - 1),
            maximumAge: msPerSample
        }).then(id => {
            watchId = id;
        }).catch(err => {
            logWatchedLocationError(err.code);
        });
    }

    private _formatPosition(pos: Position) {
        return 'Lat: ' + pos.coords.latitude +
            ', Long: ' + pos.coords.longitude +
            ', Alt: ' + pos.coords.altitude +
            ', Speed: ' + pos.coords.speed +
            ', Heading: ' + pos.coords.heading +
            ', Accur: ' + pos.coords.accuracy +
            ', AltAccur: ' + pos.coords.altitudeAccuracy;
    }

    private _formatError(error: RX.Types.LocationErrorType): string {
        switch (error) {
            case RX.Types.LocationErrorType.PermissionDenied:
                return 'Permission Denied';

            case RX.Types.LocationErrorType.Timeout:
                return 'Timeout';

            case RX.Types.LocationErrorType.PositionUnavailable:
                return 'Position Unavailable';

            default:
                return 'Unknown Error (' + error + ')';
        }
    }
}

class LocationTest implements AutoExecutableTest {
    getPath(): string {
        return 'APIs/Location';
    }

    getTestType(): TestType {
        return TestType.AutoExecutable;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <LocationView
                ref={ onMount }
            />
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        let locationView = component as LocationView;
        locationView.execute(complete);
    }
}

export default new LocationTest();
