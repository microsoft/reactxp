/*
* Tests the RX.Modal APIs in an automated manner.
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
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    modalText: RX.Styles.createViewStyle({
        margin: 8
    }),
    modalBox1: RX.Styles.createTextStyle({
        flex: 1,
        alignSelf: 'stretch',
        margin: 50,
        backgroundColor: '#eee',
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }),
    modalBox2: RX.Styles.createTextStyle({
        alignSelf: 'stretch',
        marginHorizontal: 25,
        backgroundColor: '#ccf',
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    })
};

const modal1Id = 'modal1';
const modal2Id = 'modal2';

class ModalView extends RX.Component<RX.CommonProps, RX.Stateless> {
    render() {
        return (
            <RX.View style={ _styles.container }>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This test displays and then dismisses several modals in succession. ' +
                          'You should see a large gray modal cover nearly the entire screen followed ' +
                          'by a wide, short purple modal.' }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    execute(complete: (result: TestResult) => void) {
        let result = new TestResult();

        // Show modal 1.
        RX.Modal.show(
            <RX.View style={ _styles.modalBox1 }>
                <RX.Text style={ _styles.modalText }>
                    { 'This is modal 1' }
                </RX.Text>
            </RX.View>,
        modal1Id);

        // Wait for a brief time, then show modal 2.
        _.delay(() => {
            RX.Modal.show(
                <RX.View style={ _styles.modalBox2 }>
                    <RX.Text style={ _styles.modalText }>
                        { 'This is modal 2' }
                    </RX.Text>
                </RX.View>,
            modal2Id);

            // Wait for a brief time, then dismiss modal 1.
            _.delay(() => {
                // Validate that both modals are "displayed" (even though only one is visible).
                if (!RX.Modal.isDisplayed(modal1Id)) {
                    result.errors.push('Expected RX.Modal.isDisplayed to return true for modal 1');
                }
                if (!RX.Modal.isDisplayed(modal2Id)) {
                    result.errors.push('Expected RX.Modal.isDisplayed to return true for modal 2');
                }

                // Dismiss the first modal.
                RX.Modal.dismiss(modal1Id);

                // Validate that only modal 2 is now displayed.
                if (RX.Modal.isDisplayed(modal1Id)) {
                    result.errors.push('Expected RX.Modal.isDisplayed to return false for modal 1');
                }
                if (!RX.Modal.isDisplayed(modal2Id)) {
                    result.errors.push('Expected RX.Modal.isDisplayed to return true for modal 2');
                }
                if (!RX.Modal.isDisplayed()) {
                    result.errors.push('Expected RX.Modal.isDisplayed to return true for undefined');
                }

                // Dismiss all modals.
                RX.Modal.dismissAll();

                if (RX.Modal.isDisplayed(modal2Id)) {
                    result.errors.push('Expected RX.Modal.isDisplayed to return false for modal 2');
                }
                if (RX.Modal.isDisplayed()) {
                    result.errors.push('Expected RX.Modal.isDisplayed to return false for undefined');
                }

                _.delay(() => {
                    complete(result);
                }, 250);
            }, 500);
        }, 500);
    }
}

class ModalTest implements AutoExecutableTest {
    getPath(): string {
        return 'APIs/Modal';
    }

    getTestType(): TestType {
        return TestType.AutoExecutable;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ModalView
                ref={ onMount }
            />
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        let ModalView = component as ModalView;
        ModalView.execute(complete);
    }
}

export default new ModalTest();
