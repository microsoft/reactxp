/*
* Tests the functionality of a Image component that can be
* auto-validated.
*/

import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { AutoExecutableTest, TestResult, TestType } from '../Test';
import { approxEquals } from '../Utilities';

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
    private _image1Ref: RX.Image | undefined;
    private _textRef: RX.Text | undefined;
    private _test1Complete = false;
    private _test2Complete = false;
    private _test3Complete = false;
    private _test4Complete = false;
    private _test5Complete = false;
    private _testResult: TestResult | undefined;
    private _testCompletion: ((result: TestResult) => void) | undefined;

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
        let optionalImages: JSX.Element | undefined;
        if (this.state.isTestRunning) {
            optionalImages = (
                <RX.View>
                    <RX.Image
                        style={ _styles.image }
                        source={ 'https://microsoft.github.io/reactxp/img/tests/bulb.jpg' }
                        onLoad={ this._onLoadTest1 }
                        onError={ this._onErrorTest1 }
                        ref={ (comp: any) => { this._image1Ref = comp; } }
                        testId={ 'image1' }
                    />
                    <RX.Image
                        style={ _styles.image }
                        source={ 'https://microsoft.github.io/reactxp/img/tests/bogus.jpg' }
                        onLoad={ this._onLoadTest2 }
                        onError={ this._onErrorTest2 }
                    />

                    <RX.Image
                        style={ _styles.image }
                        source={ 'https://microsoft.github.io/reactxp/img/tests/bulb.jpg' }
                        ref={ this._onMountImageChildTest }
                    >
                        <RX.Text ref={(comp: any) => { this._textRef = comp; }}>Child Text</RX.Text>
                    </RX.Image>
                </RX.View>
            );

            // Kicking-off Image API calls
            RX.Image.prefetch('https://microsoft.github.io/reactxp/img/tests/bogus.jpg')
                .then(this._prefetchedTest3)
                .catch(this._prefetchedFailedTest3);

            RX.Image.getMetadata('https://microsoft.github.io/reactxp/img/tests/bulb.jpg')
                .then(this._getMetadataTest4)
                .catch(this._getMetadataFailedTest4);
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
            } else if (!approxEquals(dimensions.width, image1ExpectedWidth) || !approxEquals(dimensions.height, image1ExpectedHeight)) {
                this._testResult.errors.push(`Expected dimensions from onLoad to be ${image1ExpectedWidth}x${image1ExpectedHeight}. Got ${dimensions.width}x${dimensions.height}`);
            }

            // Now call the component back to see if we get the same dimensions.
            const width = this._image1Ref!.getNativeWidth();
            const height = this._image1Ref!.getNativeHeight();
            if (width == null || !approxEquals(width, image1ExpectedWidth)) {
                this._testResult.errors.push(`Expected width from getNativeWidth to be ${image1ExpectedWidth}. Got ${width}`);
            }
            if (height == null || !approxEquals(height, image1ExpectedHeight)) {
                this._testResult.errors.push(`Expected height from getNativeHeight to be ${image1ExpectedHeight}. Got ${height}`);
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

    private _prefetchedTest3 = (success: boolean) => {
        this._test3Complete = true;
        if (success && this._testResult) {
            this._testResult.errors.push('Was unexpected able to prefetch bogus test image');
        }
        this._checkAllTestsComplete();
    }

    private _prefetchedFailedTest3 = (error: any) => {
        this._test3Complete = true;
        if (this._testResult && !error) {
            this._testResult.errors.push('Prefetching bogus test image failed but error is empty.');
        }
        this._checkAllTestsComplete();
    }

    private _getMetadataTest4 = (metaData: RX.Types.ImageMetadata) => {
        this._test4Complete = true;
        if (this._testResult) {
            if (!metaData) {
                this._testResult.errors.push('Received undefined image data from getMetadata');
            }

            if (metaData.height !== image1ExpectedHeight) {
                this._testResult.errors.push('Received unexpected height from getMetadata');
            }

            if (metaData.width !== image1ExpectedWidth) {
                this._testResult.errors.push('Received unexpected width from getMetadata');
            }
        }
        this._checkAllTestsComplete();
    }

    private _getMetadataFailedTest4 = (error: any) => {
        this._test4Complete = true;
        if (this._testResult) {
            this._testResult.errors.push('getMetadata for bulb test image failed with error: ', error);
        }
        this._checkAllTestsComplete();
    }

    private _checkAllTestsComplete() {
        // If all of the tests are complete, report the result.
        if (this._test1Complete && this._test2Complete && this._test3Complete && this._test4Complete) {

            // Make sure we report the result only once.
            if (this._testResult) {
                this._testCompletion!(this._testResult);
                this._testResult = undefined;
            }

            if (this._isMounted) {
                this.setState({ isTestRunning: false });
            }
        }
    }

    private _onMountImageChildTest = (image: any) => {
        this._test5Complete = true;

        if (this._isMounted && image && !this._textRef) {
            if (this._testResult) {
                this._testResult.errors.push('"children" elements were not rendered');
            }
        }

        this._checkAllTestsComplete();
    }

    execute(complete: (result: TestResult) => void): void {
        this._test1Complete = false;
        this._test2Complete = false;
        this._test3Complete = false;
        this._test4Complete = false;
        this._test5Complete = false;
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
