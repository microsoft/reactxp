import { ComponentBase } from 'resub';
import RX = require('reactxp');

// should use require? for export=
import HelloStore =require('./helloStore');

interface HelloState {
    Hello?: string;
}

class Hello extends ComponentBase<{}, HelloState> {
    protected _buildState(props: {}, initialBuild: boolean): HelloState {
        return {
            Hello: HelloStore.getHello()
        }
    }

    render(): JSX.Element | null  {
        return (
            <RX.Text>
                { this.state.Hello }
            </RX.Text>
        );
    }
}

// notice it
export = Hello;
