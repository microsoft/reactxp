/*
* Tests the functionality of a ScrollView component 
* through user interaction.
*
* We need to split the ScrollView tests into multiple pages because
* we can't embed ScrollViews within a parent ScrollView.
*/

import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';
import { MultiTouchGestureState } from 'reactxp/dist/common/Types';

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
    scrollViewContainer: RX.Styles.createViewStyle({
        margin: 12,
        alignSelf: 'stretch',
        height: 150,
        width: 320
    }),
    scrollView1: RX.Styles.createScrollViewStyle({
    }),
    numberGrid: RX.Styles.createViewStyle({
        width: 400,
        backgroundColor: '#eef',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }),
    numberContainer: RX.Styles.createViewStyle({
        height: 50,
        width: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center'
    }),
    numberText: RX.Styles.createTextStyle({
        fontSize: 24
    }),
    listContainer: RX.Styles.createViewStyle({
    }),
    numberItem: RX.Styles.createViewStyle({
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center'
    })
};

const _colors = ['red', 'green', 'blue'];

interface ScrollViewState {
}

class ScrollViewView extends RX.Component<RX.CommonProps, ScrollViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
        };
    }

    render() {
        let numberBoxes: JSX.Element[] = [];
        for (let i = 0; i < 40; i++) {
            numberBoxes.push(
                <RX.View style={ _styles.numberContainer } key={ 'Box' + i }>
                    <RX.Text style={ _styles.numberText }>
                        { i }
                    </RX.Text>
                </RX.View>
            );
        }

        let numberItems: JSX.Element[] = [];
        for (let i = 0; i < 20; i++) {
            numberItems.push(
                <RX.View style={ _styles.numberItem } key={ 'Item' + i }>
                    <RX.Text style={ _styles.numberText }>
                        { 'List item ' + i }
                    </RX.Text>
                </RX.View>
            );
        }

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Scroll view with both vertical and horizontal scrolling. ' +
                          'Bouncing (iOS) and over-scroll (Android) are disabled. ' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.scrollViewContainer }>
                    <RX.ScrollView
                        style={ _styles.scrollView1 }
                        vertical={ true }
                        horizontal={ true }
                        bounces={ false }
                        overScrollMode={ 'never' }
                    >
                        <RX.View style={ _styles.numberGrid }>
                            { numberBoxes }
                        </RX.View>
                    </RX.ScrollView>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Scroll view with vertical paging with 50px pages.' +
                          'Scrolls to top (iOS) when tapping on the status bar.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.scrollViewContainer }>
                    <RX.ScrollView
                        style={ _styles.scrollView1 }
                        snapToInterval={ 50 }
                        scrollsToTop={ true }
                    >
                        <RX.View style={ _styles.listContainer }>
                            { numberItems }
                        </RX.View>
                    </RX.ScrollView>
                </RX.View>
            </RX.View>
        );
    }
}

class ScrollViewTest implements Test {
    useFullScreenContainer = true;

    getPath(): string {
        return 'Components/ScrollView/Basic';
    }
    
    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ScrollViewView ref={ onMount }/>
        );
    }
}

export default new ScrollViewTest();
