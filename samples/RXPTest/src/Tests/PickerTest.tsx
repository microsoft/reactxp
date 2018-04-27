/*
* Tests the functionality of the Picker component
* with manual user validation.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'flex-start'
    }),
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    resultText: RX.Styles.createTextStyle({
        marginLeft: 20,
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    }),
    pickerContainer: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        alignItems: 'center'
    }),
    picker: RX.Styles.createPickerStyle({
        alignSelf: 'stretch'
    }),
    pickerWeb: RX.Styles.createPickerStyle({
        alignSelf: 'center',
        marginVertical: 12,
        height: 24,
        width: 100
    })
};

interface PickerViewState {
    test1Value?: string;
    test2Value?: string;
}

class PickerView extends RX.Component<RX.CommonProps, PickerViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            test1Value: 'platform1',
            test2Value: ''
        };
    }

    render() {
        const picker1Items: RX.Types.PickerPropsItem[] = [
            {
                label: 'Windows',
                value: 'platform1'
            }, {
                label: 'iOS',
                value: 'platform2'
            }, {
                label: 'Android',
                value: 'platform3'
            }
        ];

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Select item from picker.' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.pickerContainer }>
                    <RX.Picker
                        style={ [_styles.picker, RX.Platform.getType() === 'web' && _styles.pickerWeb] }
                        selectedValue={ this.state.test1Value }
                        items={ picker1Items }
                        mode={ 'dialog' }
                        onValueChange={ this._onValueChanged1 }
                    />
                    <RX.Text style={ _styles.resultText }>
                        { 'You selected "' +
                            _.find(picker1Items, item => item.value ===
                            this.state.test1Value).label + '"'}
                    </RX.Text>
                </RX.View>

            </RX.View>
        );
    }

    private _onValueChanged1 = (itemValue: string, itemPosition: number) => {
        this.setState({ test1Value: itemValue });
    }
}

class PickerTest implements Test {
    getPath(): string {
        return 'Components/Picker';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <PickerView ref={ onMount }/>
        );
    }
}

export default new PickerTest();
