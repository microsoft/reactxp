/*
* Tests the RX.Platform APIs.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { AutoExecutableTest, TestResult, TestType } from '../Test';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center'
    }),
    textContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    platformText: RX.Styles.createTextStyle({
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    })
};

interface PlatformState {
    platformType?: RX.Types.PlatformType;
}

class PlatformView extends RX.Component<RX.CommonProps, PlatformState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            platformType: undefined
        };
    }

    render() {
        const platformTypeText = RX.Platform.select({
            'web': 'Browser (web)',
            'ios': 'iOS',
            'android': 'Android',
            'windows': 'Windows (UWP)',
            'default': `Unknown (${JSON.stringify(this.state.platformType)})`
        });

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'When the test is run, the platform type will be displayed below.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.textContainer } key={ 'platform' }>
                    <RX.Text style={ _styles.platformText }>
                        { platformTypeText }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    execute() {
        this.setState({
            platformType: RX.Platform.getType()
        });
    }
}

class PlatformTest implements AutoExecutableTest {
    getPath(): string {
        return 'APIs/Platform';
    }

    getTestType(): TestType {
        return TestType.AutoExecutable;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <PlatformView
                ref={ onMount }
            />
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        // Nothing to do but report success
        let results = new TestResult();

        let platformView = component as PlatformView;
        platformView.execute();

        complete(results);
    }
}

export default new PlatformTest();
