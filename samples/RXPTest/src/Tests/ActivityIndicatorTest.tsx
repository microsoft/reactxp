/*
* Tests the basic functionality of an ActivityIndicator component.
*/

import _ = require('lodash');
import RX = require('reactxp');

import { Test, TestResult } from '../Test'

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center'
    }),
    aiContainer: RX.Styles.createViewStyle({
        margin: 20
    })
};

interface ActivityIndicatorViewState {
    renderIndicators?: boolean;
}

class ActivityIndicatorView extends RX.Component<RX.CommonProps, ActivityIndicatorViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            renderIndicators: false
        };
    }

    render() {
        let optionalIndicators: JSX.Element[] = [];

        if (this.state.renderIndicators) {
            // Render large indicator with no delay.
            optionalIndicators.push(
                <RX.View style={ _styles.aiContainer }  key={ 'large' }>
                    <RX.ActivityIndicator
                        size={ 'large' }
                        color={ '#333' }
                    />
                </RX.View>
            );

            // Render medium indicator with 250ms delay.
            optionalIndicators.push(
                <RX.View style={ _styles.aiContainer } key={ 'medium' }>
                    <RX.ActivityIndicator
                        size={ 'medium' }
                        color={ 'red' }
                        deferTime={ 250 }
                    />
                </RX.View>
            );

            // Render small indicator with 500ms delay.
            optionalIndicators.push(
                <RX.View style={ _styles.aiContainer } key={ 'small' }>
                    <RX.ActivityIndicator
                        size={ 'small' }
                        color={ 'green' }
                        deferTime={ 500 }
                    />
                </RX.View>
            );

            // Render tiny indicator with 1000ms delay.
            optionalIndicators.push(
                <RX.View style={ _styles.aiContainer } key={ 'tiny' }>
                    <RX.ActivityIndicator
                        size={ 'tiny' }
                        color={ 'black' }
                        deferTime={ 1000 }
                    />
                </RX.View>
            );
        }

        return (
            <RX.ScrollView>
                <RX.View style={ _styles.container}>
                    { optionalIndicators }
                </RX.View>
            </RX.ScrollView>
        );
    }

    execute(finished: () => void) {
        this.setState({ renderIndicators: true });

        _.delay(() => {
            this.setState({ renderIndicators: false });
            finished();
        }, 2000);
    }
}

class ActivityIndicatorTest implements Test {
    getPath(): string {
        return 'Components/ActivityIndicator';
    }
    
    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ActivityIndicatorView
                ref={ onMount }
            />
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        // Nothing to do but report success
        let results = new TestResult();

        let aiView = component as ActivityIndicatorView;
        aiView.execute(() => {
            complete(results);
        });
    }
}

export default new ActivityIndicatorTest();