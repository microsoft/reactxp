/*
* Tests the functionality of a Image component that can be
* auto-validated.
*/

import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { AutoExecutableTest, TestResult, TestType } from '../Test';

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
    image: RX.Styles.createImageStyle({
        height: 100,
        width: 100
    })
};

const image1ExpectedWidth = 118;
const image1ExpectedHeight = 200;

interface ImageViewState {
    isTestRunning?: boolean;
}

class ImageView extends RX.Component<RX.CommonProps, ImageViewState> {
    private _isMounted = false;
    private _image1Ref: RX.Image;
    private _test1Complete = false;
    private _test2Complete = false;
    private _testResult: TestResult;
    private _testCompletion: (result: TestResult) => void;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            isTestRunning: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let optionalImages: JSX.Element;
        if (this.state.isTestRunning) {
            optionalImages = (
                <RX.View>
                    <RX.Image
                        style={ _styles.image }
                        source={ 'https://microsoft.github.io/reactxp/img/tests/bulb.jpg' }
                        onLoad={ this._onLoadTest1 }
                        onError={ this._onErrorTest1 }
                        ref={ (comp: RX.Image) => { this._image1Ref = comp; } }
                    />
                    <RX.Image
                        style={ _styles.image }
                        source={ 'https://microsoft.github.io/reactxp/img/tests/bogus.jpg' }
                        onLoad={ this._onLoadTest2 }
                        onError={ this._onErrorTest2 }
                    />
                </RX.View>
            );
        }

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Tests various aspects of the Image component that can be automatically validated.' }
                    </RX.Text>
                </RX.View>
                { optionalImages }
            </RX.View>
        );
    }

    private _onLoadTest1 = (dimensions: RX.Types.Dimensions) => {
        this._test1Complete = true;

        if (this._testResult) {
            if (!dimensions) {
                this._testResult.errors.push('Received undefined dimensions from onLoad');
            } else if (dimensions.width !== image1ExpectedWidth || dimensions.height !== image1ExpectedHeight) {
                this._testResult.errors.push('Received unexpected dimensions from onLoad');
            }

            // Now call the component back to see if we get the same dimensions.
            if (this._image1Ref.getNativeWidth() !== image1ExpectedWidth) {
                this._testResult.errors.push('Received unexpected width from getNativeWidth');
            }
            if (this._image1Ref.getNativeHeight() !== image1ExpectedHeight) {
                this._testResult.errors.push('Received unexpected height from getNativeHeight');
            }
        }

        this._checkAllTestsComplete();
    }

    private _onErrorTest1 = () => {
        this._test1Complete = true;
        if (this._testResult) {
            this._testResult.errors.push('Could not load test image');
        }
        this._checkAllTestsComplete();
    }

    private _onLoadTest2 = (dimensions: RX.Types.Dimensions) => {
        this._test2Complete = true;
        if (this._testResult) {
            this._testResult.errors.push('Was unexpected able to load bogus test image');
        }
        this._checkAllTestsComplete();
    }

    private _onErrorTest2 = () => {
        this._test2Complete = true;
        this._checkAllTestsComplete();
    }

    private _checkAllTestsComplete() {
        // If all of the tests are complete, report the result.
        if (this._test1Complete && this._test2Complete) {

            // Make sure we report the result only once.
            if (this._testResult) {
                this._testCompletion(this._testResult);
                this._testResult = undefined;
            }

            if (this._isMounted) {
                this.setState({ isTestRunning: false });
            }
        }
    }

    execute(complete: (result: TestResult) => void): void {
        this._test1Complete = false;
        this._test2Complete = false;
        this._testResult = new TestResult();
        this._testCompletion = complete;

        // Re-render to kick off the test.
        this.setState({ isTestRunning: true });
    }
}

class ImageApiTest implements AutoExecutableTest {
    getPath(): string {
        return 'Components/Image/APIs';
    }

    getTestType(): TestType {
        return TestType.AutoExecutable;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ImageView ref={ onMount }/>
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        let imageView = component as ImageView;

        imageView.execute(complete);
    }
}

export default new ImageApiTest();
