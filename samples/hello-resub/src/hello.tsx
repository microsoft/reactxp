import { ComponentBase } from 'resub';
import RX = require('reactxp');

// should use require? for export=
import HelloStore =require('./helloStore');

interface HelloState {
    Hello?: string;
    showTitle: boolean;
}

class Hello extends ComponentBase<{}, HelloState> {
    protected _buildState(props: {}, initialBuild: boolean): HelloState {
        return {
            Hello: HelloStore.getHello(),
            showTitle: HelloStore.getShowTitle(),
        }
    }

    //add onclick to show/hide hello resub.
    render(): JSX.Element | null  {
        return (
            <RX.View>
                <RX.Button title="click here for show/hide text" 
                    onPress={() => HelloStore.switchShowTitle()}>
                    {"click here to show/hide"}
                </RX.Button>
                < RX.Text>
                    { this.state.showTitle? this.state.Hello :null }
                </RX.Text>            
            </RX.View>
        );
    }
}

// notice it
export = Hello;
