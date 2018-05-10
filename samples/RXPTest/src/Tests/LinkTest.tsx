/*
* Tests the functionality of the Link component
* with manual user validation.
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
    resultText: RX.Styles.createTextStyle({
        marginLeft: 20,
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    }),
    linkContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        marginHorizontal: 24,
        marginBottom: 12
    }),
    constrainedLinkContainer: RX.Styles.createViewStyle({
        maxWidth: 150,
        marginHorizontal: 24,
        marginBottom: 12
    }),
    link: RX.Styles.createLinkStyle({
        fontSize: CommonStyles.generalFontSize,
        color: '#00f',
        textDecorationLine: 'underline',
        textDecorationColor: '#00f'
    }),
    linkHover: RX.Styles.createLinkStyle({
        color: '#88f',
        textDecorationColor: '#88f'
    })
};

interface LinkViewState {
    test1Hovering?: boolean;
    test1Result?: string;
}

class LinkView extends RX.Component<RX.CommonProps, LinkViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            test1Hovering: false,
            test1Result: ''
        };
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press on this link to test press callback. Hold to test long presses. ' +
                          'Right click to test context menu callback. ' +
                          ' Move mouse pointer to test hovering.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.linkContainer }>
                    <RX.Link
                        style={ [_styles.link, this.state.test1Hovering && _styles.linkHover] }
                        url={ '' }
                        onPress={ () => { this.setState({ test1Result: 'Press detected' }); } }
                        onLongPress={ () => { this.setState({ test1Result: 'Long press detected' }); } }
                        onHoverStart={ () => { this.setState({ test1Hovering: true }); } }
                        onHoverEnd={ () => { this.setState({ test1Hovering: false }); } }
                        onContextMenu={ () => { this.setState({ test1Result: 'Context menu detected' }); } }
                        allowFontScaling={ false }
                    >
                        { 'Press or hold' }
                    </RX.Link>
                    <RX.Text style={ _styles.resultText }>
                        { this.state.test1Result }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This link is artificially constrained to one line and should appear ' +
                          'truncated. Press to open a browser target. Hover to display tooltip.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.constrainedLinkContainer }>
                    <RX.Link
                        style={ _styles.link }
                        url={ 'https://microsoft.github.io/reactxp/docs/components/link.html' }
                        title={ 'Open RX.Link documentation in browser' }
                        maxContentSizeMultiplier={ 1.5 }
                        numberOfLines={ 1 }
                    >
                        { 'Documentation for RX.Link' }
                    </RX.Link>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        <RX.Text selectable={ true }>
                            { 'Links can also be used with other ' }
                        </RX.Text>
                        <RX.Link
                            style={ _styles.link }
                            title={ 'Open RX.Text documentation in browser' }
                            url={ 'https://microsoft.github.io/reactxp/docs/components/text.html' }
                            selectable={ true }
                        >
                            { 'RX.Text' }
                        </RX.Link>
                        <RX.Text selectable={ true }>
                            { ' components. The link and text should be selectable. '}
                        </RX.Text>
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }
}

class LinkTest implements Test {
    getPath(): string {
        return 'Components/Link';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <LinkView ref={ onMount }/>
        );
    }
}

export default new LinkTest();
