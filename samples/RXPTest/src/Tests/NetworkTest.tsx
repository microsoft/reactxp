/*
* Tests the RX.Network APIs in an interactive manner.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';

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
    })
};

interface NetworkState {
    connectionState?: string;
    networkType?: string;
}

class NetworkView extends RX.Component<RX.CommonProps, NetworkState> {
    private _isMounted = false;
    private _connectivityChangedEvent: RX.Types.SubscriptionToken;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            connectionState: '',
            networkType: ''
        };
    }

    componentDidMount() {
        this._isMounted = true;

        this._connectivityChangedEvent = RX.Network.connectivityChangedEvent.subscribe(isConnected => {
            this.setState({
                connectionState: isConnected ? 'Connected' : 'Disconnected'
            });

            this._queryNetworkState();
        });

        this._queryConnectivityState();
        this._queryNetworkState();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    private _queryConnectivityState() {
        RX.Network.isConnected().then(isConnected => {
            if (this._isMounted) {
                this.setState({
                    connectionState: isConnected ? 'Connected' : 'Disconnected'
                });
            }
        }).catch(err => {
            if (this._isMounted) {
                this.setState({
                    connectionState: 'Error: (' + err + ')'
                });
            }
        });
    }

    private _queryNetworkState() {
        RX.Network.getType().then(type => {
            if (this._isMounted) {
                this.setState({
                    networkType: this._formatNetworkType(type)
                });
            }
        }).catch(err => {
            if (this._isMounted) {
                this.setState({
                    networkType: 'Error: (' + err + ')'
                });
            }
        });
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Current network connectivity:' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this.state.connectionState }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Device network type:' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this.state.networkType }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    private _formatNetworkType(type: RX.Types.DeviceNetworkType): string {
        switch (type) {
            case RX.Types.DeviceNetworkType.Unknown:
                return 'Unknown';

            case RX.Types.DeviceNetworkType.None:
                return 'None';

            case RX.Types.DeviceNetworkType.Wifi:
                return 'WiFi';

            case RX.Types.DeviceNetworkType.Mobile2G:
                return 'Mobile 2G';

            case RX.Types.DeviceNetworkType.Mobile3G:
                return 'Mobile 3G';

            case RX.Types.DeviceNetworkType.Mobile4G:
                return 'Mobile 4G';

            default:
                return 'Unknown (' + type + ')';
        }
    }
}

class NetworkTest implements Test {
    getPath(): string {
        return 'APIs/Network';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <NetworkView
                ref={ onMount }
            />
        );
    }
}

export default new NetworkTest();
