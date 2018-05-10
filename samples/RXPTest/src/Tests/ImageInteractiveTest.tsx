/*
* Tests the functionality of the Image component
* that requires manual user validation.
*/

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
    image: RX.Styles.createImageStyle({
        height: 100,
        width: 250,
        marginHorizontal: 32,
        borderWidth: 1,
        borderColor: '#ccc'
    })
};

class ImageView extends RX.Component<RX.CommonProps, RX.Stateless> {
    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'JPEG image using "stretch" resize option. Hovering should display a tooltip.' }
                    </RX.Text>
                </RX.View>
                <RX.Image
                    style={ _styles.image }
                    source={ 'https://microsoft.github.io/reactxp/img/tests/bulb.jpg' }
                    resizeMode={ 'stretch' }
                    title={ 'This is a tooltip' }
                />

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'PNG image using "contain" resize option. Uses rasterize option on iOS.' }
                    </RX.Text>
                </RX.View>
                <RX.Image
                    style={ _styles.image }
                    source={ 'https://microsoft.github.io/reactxp/img/tests/globe.png' }
                    resizeMode={ 'contain' }
                    shouldRasterizeIOS={ true }
                />

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Animated GIF image using "cover" resize option.' }
                    </RX.Text>
                </RX.View>
                <RX.Image
                    style={ _styles.image }
                    source={ 'https://microsoft.github.io/reactxp/img/tests/heart.gif' }
                    resizeMode={ 'cover' }
                />

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation4' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'JPEG image using "repeat" resize option.' }
                    </RX.Text>
                </RX.View>
                <RX.Image
                    style={ _styles.image }
                    source={ 'https://microsoft.github.io/reactxp/img/tests/bulb.jpg' }
                    resizeMode={ 'repeat' }
                />

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation5' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'JPEG image using "auto" resize option.' }
                    </RX.Text>
                </RX.View>
                <RX.Image
                    style={ _styles.image }
                    source={ 'https://microsoft.github.io/reactxp/img/tests/bulb.jpg' }
                    resizeMode={ 'auto' }
                />

            </RX.View>
        );
    }
}

class ImageInteractiveTest implements Test {
    getPath(): string {
        return 'Components/Image/Interactive';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ImageView ref={ onMount }/>
        );
    }
}

export default new ImageInteractiveTest();
