/**
* AlertModalContent.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web Alert dialog boxes modal content.
*/

import React = require('react');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import { ViewProps } from '../common/Types';
import { default as Button } from './Button';
import { default as Modal } from './Modal';
import { default as Styles } from './Styles';
import { default as Text } from './Text';
import { default as View } from './View';

export interface AppModalContentProps extends ViewProps {
    buttons?: Types.AlertButtonSpec[];
    title: string;
    message?: string;
    modalId: string;
    theme?: Types.AlertModalTheme;
}

const modalStyles = {
    background: Styles.createViewStyle({
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
        alignSelf: 'stretch'
    }),
    verticalRoot: Styles.createViewStyle({
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }),
    defaultBodyStyle: Styles.createViewStyle({
        width: 300,
        backgroundColor: '#FFF',
        borderColor: '#333',
        borderWidth: 1,
        alignItems: 'stretch'
    }),
    defaultTitleStyle: Styles.createTextStyle({
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 20,
        flex: 1
    }),
    defaultMessageStyle: Styles.createTextStyle({
        fontSize: 18,
        alignSelf: 'center',
        padding: 10,
        flex: 1
    }),
    defaultButtonContainerStyle: Styles.createButtonStyle({
        padding: 10,
        flex: 1
    }),
    defaultButtonStyle: Styles.createButtonStyle({
        padding: 5,
        alignItems: 'center',
        flex: 1
    }),
    defaultBtnTextStyle: Styles.createTextStyle({
        padding: 5,
        color: '#333'
    })
};

export class AlertModalContent extends RX.Component<AppModalContentProps, {}> {
    public render() {
        const theme = this.props.theme;
        return <View style={modalStyles.background} onPress={(e) => this.backgroundClicked(e)}>
                <View style={modalStyles.verticalRoot}>
                    <View style={[modalStyles.defaultBodyStyle, (theme ? theme.bodyStyle : null)]}
                        onPress={(e) => this.bodyClicked(e)}>
                        <View>
                            <Text style={[modalStyles.defaultTitleStyle, (theme ? theme.titleStyle : null)]}>
                                {this.props.title}
                            </Text>
                        </View>
                        <View>
                            <Text style={[modalStyles.defaultMessageStyle, (theme ? theme.messageStyle : null)]}>
                                {this.props.message}
                            </Text>
                        </View>
                        {this.props.buttons.map((btnSpec) =>
                            <View key={btnSpec.text} style={modalStyles.defaultButtonContainerStyle}>
                                <Button onPress={(e) => btnSpec.style === 'cancel' ? Modal.dismiss(this.props.modalId) : btnSpec.onPress()}
                                    style={[
                                        modalStyles.defaultButtonStyle
                                        , (theme ? theme.buttonStyle : null)
                                        , {backgroundColor: btnSpec.style === 'cancel' ?
                                            (theme && theme.cancelButtonColor ?
                                                theme.cancelButtonColor : '#00BFFF') : 
                                            (theme && theme.defaultButtonColor ?
                                                theme.defaultButtonColor : '#DDD')
                                        }
                                    ]}>
                                    <Text style={[modalStyles.defaultBtnTextStyle, (theme ? theme.buttonTextStyle : null)]}>
                                        {btnSpec.text}
                                    </Text>
                                </Button>
                            </View>
                        )}
                    </View>
                </View>
            </View>;
    }
    private bodyClicked(e: Types.SyntheticEvent) {
        e.stopPropagation();
    }
    private backgroundClicked(e: Types.SyntheticEvent) {
        Modal.dismiss(this.props.modalId);
    }
}

export default AlertModalContent;
