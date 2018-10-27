/**
 * AlertModalContent.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web Alert dialog boxes modal content.
 */

import * as React from 'react';

import Button from './Button';
import * as RX from '../common/Interfaces';
import Modal from './Modal';
import Styles from './Styles';
import Text from './Text';
import View from './View';

export interface AppModalContentProps extends RX.Types.ViewProps {
    buttons?: RX.Types.AlertButtonSpec[];
    title: string;
    message?: string;
    modalId: string;
    theme?: RX.Types.AlertModalTheme;
    preventDismissOnPress?: boolean;
}

export interface AppModalContentState {
    hoverIndex: number;
}

const _styles = {
    background: Styles.createViewStyle({
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        alignSelf: 'stretch'
    }),
    verticalRoot: Styles.createViewStyle({
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }),
    defaultBody: Styles.createViewStyle({
        width: 300,
        backgroundColor: '#fff',
        borderColor: '#bbb',
        borderWidth: 1,
        alignItems: 'stretch',
        paddingHorizontal: 8,
        paddingVertical: 4
    }),
    defaultTitleText: Styles.createTextStyle({
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 12,
        flex: 1
    }),
    defaultMessageText: Styles.createTextStyle({
        fontSize: 16,
        alignSelf: 'center',
        padding: 12,
        flex: 1
    }),
    defaultButtonContainer: Styles.createButtonStyle({
        padding: 8,
        flex: 1
    }),
    defaultButton: Styles.createButtonStyle({
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#bbb'
    }),
    defaultButtonHover: Styles.createButtonStyle({
        backgroundColor: '#eee'
    }),
    defaultCancelButton: Styles.createButtonStyle({
        borderColor: 'red'
    }),
    defaultBtnText: Styles.createTextStyle({
        fontSize: 14,
        padding: 8,
        color: '#333'
    }),
    defaultCancelBtnText: Styles.createTextStyle({
        color: 'red'
    })
};

export class AlertModalContent extends RX.Component<AppModalContentProps, AppModalContentState> {
    constructor(props: AppModalContentProps) {
        super(props);
        this.state = {
            hoverIndex: -1
        };
    }

    render() {
        const theme = this.props.theme;

        const buttons = this.props.buttons && this.props.buttons.map((btnSpec, i) => {
            const isCancel = btnSpec.style === 'cancel';
            const buttonStyle = [_styles.defaultButton, isCancel ? _styles.defaultCancelButton : undefined];
            const buttonTextStyle = [_styles.defaultBtnText, isCancel ? _styles.defaultCancelBtnText : undefined];

            // Is the mouse pointer currently hovering over this button?
            if (this.state.hoverIndex === i) {
                buttonStyle.push(_styles.defaultButtonHover);
            }

            if (theme) {
                buttonStyle.push(theme.buttonStyle);
                buttonTextStyle.push(theme.buttonTextStyle);
                if (isCancel) {
                    buttonStyle.push(theme.cancelButtonStyle);
                    buttonTextStyle.push(theme.cancelButtonTextStyle);
                }

                if (this.state.hoverIndex === i) {
                    buttonStyle.push(isCancel ? theme.cancelButtonHoverStyle : theme.buttonHoverStyle);
                }
            }

            return (
                <View key={ 'button_' + i } style={ _styles.defaultButtonContainer }>
                    <Button
                        onPress={ e => this._onPressButton(btnSpec) }
                        onHoverStart={ () => this.setState({ hoverIndex: i }) }
                        onHoverEnd={ () => this.setState({ hoverIndex: -1 }) }
                        style={ buttonStyle }
                    >
                        <Text style={ buttonTextStyle }>
                            { btnSpec.text }
                        </Text>
                    </Button>
                </View>
            );
        });

        return (
            <View style={ _styles.background } onPress={ this._onPressBackground }>
                <View style={ _styles.verticalRoot }>
                    <View
                        style={ [_styles.defaultBody, theme && theme.bodyStyle] }
                        onPress={ this._onPressBody }
                    >
                        <View>
                            <Text style={ [_styles.defaultTitleText, theme && theme.titleTextStyle] }>
                                { this.props.title }
                            </Text>
                        </View>
                        <View>
                            <Text style={ [_styles.defaultMessageText, theme && theme.messageTextStyle] }>
                                { this.props.message }
                            </Text>
                        </View>
                        { buttons }
                    </View>
                </View>
            </View>
        );
    }

    private _onPressButton(btnSpec: RX.Types.AlertButtonSpec) {
        Modal.dismiss(this.props.modalId);

        if (btnSpec.onPress) {
            btnSpec.onPress();
        }
    }

    private _onPressBody = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();
    }

    private _onPressBackground = (e: RX.Types.SyntheticEvent) => {
        if (!this.props.preventDismissOnPress) {
            Modal.dismiss(this.props.modalId);
        }
    }
}

export default AlertModalContent;
