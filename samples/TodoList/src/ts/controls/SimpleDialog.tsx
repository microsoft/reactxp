/**
* SimpleDialog.tsx
* Copyright: Microsoft 2018
*
* Defines the contents (including a title and buttons) for
* a dialog box. Typically embedded within an RX.Modal component.
*/

import * as _ from 'lodash';
import * as RX from 'reactxp';
import { ComponentBase } from 'resub';
import * as SyncTasks from 'synctasks';

import KeyCodes from '../utilities/KeyCodes';
import Modal from './Modal';
import SimpleButton from './SimpleButton';
import { Colors, Fonts, FontSizes } from '../app/Styles';

export interface SimpleDialogButton {
    text?: string;
    onPress?: () => void;
    buttonStyle?: RX.Types.ButtonStyleRuleSet;
    textStyle?: RX.Types.TextStyleRuleSet;
    isCancel?: boolean;
    isSubmit?: boolean;
    isDisabled?: boolean;
}

// Note: This class is meant to handle only simple dialogs. If you need somewhat more
// complicated behavior, you may be tempted to extend this class. Please don't do this
// because it will no longer be "simple" if everyone adds these tweaks to it. Instead,
// implement your custom logic within your own dialog class.
export interface SimpleDialogProps {
    dialogId: string;

    maxWidth?: number;
    maxHeight?: number;

    containerStyle?: RX.Types.ViewStyleRuleSet;

    title?: string;
    text?: string;
    children?: RX.Types.ReactNode;
    buttons?: SimpleDialogButton[];
}

const _modalPadding = 16;
const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        backgroundColor: Colors.simpleDialogBackground,
        borderWidth: 1,
        borderColor: Colors.simpleDialogBorder
    }),
    titleText: RX.Styles.createTextStyle({
        font: Fonts.displaySemibold,
        fontSize: FontSizes.size16,
        color: Colors.simpleDialogText,
        textAlign: 'center',
        paddingVertical: _modalPadding
    }),
    contentText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        color: Colors.simpleDialogText,
        textAlign: 'left',
        paddingVertical: _modalPadding
    }),
    contentContainer: RX.Styles.createViewStyle({
        flex: 1,
        paddingHorizontal: _modalPadding
    }),
    buttonContainer: RX.Styles.createViewStyle({
        alignItems: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: _modalPadding
    }),
    button: RX.Styles.createViewStyle({
        marginLeft: 12
    }),
    panelHeader: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size16,
        color: Colors.gray66
    }),
    displayText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        color: Colors.gray66
    })
};

export default class SimpleDialog extends ComponentBase<SimpleDialogProps, RX.Stateless> {
    componentDidMount() {
        super.componentDidMount();

        RX.Input.backButtonEvent.subscribe(this._onBack);
        RX.Input.keyUpEvent.subscribe(this._onKeyUp);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        RX.Input.backButtonEvent.unsubscribe(this._onBack);
        RX.Input.keyUpEvent.unsubscribe(this._onKeyUp);
    }

    render() {
        // Title Text
        let optionalTitleText: JSX.Element | undefined;
        if (this.props.title) {
            optionalTitleText = (
                <RX.View importantForAccessibility={ RX.Types.ImportantForAccessibility.Yes }>
                    <RX.Text
                        style={ [_styles.panelHeader, _styles.titleText] }
                        importantForAccessibility={ RX.Types.ImportantForAccessibility.NoHideDescendants }
                    >
                        { this.props.title }
                    </RX.Text>
                </RX.View>
            );
        }

        // Content (children)
        let optionalContent: RX.Types.ReactNode | undefined;
        if (this.props.children) {
            optionalContent = this.props.children;
        } else if (this.props.text) {
            optionalContent = (
                <RX.Text style={ [_styles.displayText, _styles.contentText] }>
                    { this.props.text }
                </RX.Text>
            );
        }

        // Buttons
        let optionalButtonsContainer: JSX.Element | undefined;
        if (this.props.buttons && this.props.buttons.length > 0) {
            const optionalButtons = _.map(this.props.buttons, this._renderButton);

            optionalButtonsContainer = (
                <RX.View style={ _styles.buttonContainer }>
                    { optionalButtons }
                </RX.View>
            );
        }

        return (
            <Modal
                modalId={ this.props.dialogId }
                modalWidth={ this.props.maxWidth || 450 }
                modalHeight={ this.props.maxHeight }
            >
                <RX.View style={ [_styles.container, this.props.containerStyle] } >
                    { optionalTitleText }
                    <RX.View style={ _styles.contentContainer }>
                        { optionalContent }
                    </RX.View>
                    { optionalButtonsContainer }
                </RX.View>
            </Modal>
        );
    }

    private _renderButton = (buttonDef: SimpleDialogButton, index: number): JSX.Element => {
        return (
            <SimpleButton
                key={ index }
                onPress={ e => this._onButtonPress(e, buttonDef) }
                title={ buttonDef.text }
                text={ buttonDef.text || '' }
                disabled={ buttonDef.isDisabled }
                buttonStyle={ [_styles.button, buttonDef.buttonStyle] }
                textStyle={ buttonDef.textStyle }
            />
        );
    };

    private _onButtonPress(e: RX.Types.SyntheticEvent, buttonDef: SimpleDialogButton) {
        e.stopPropagation();
        this._completeButtonPress(buttonDef);
    }

    private _completeButtonPress(buttonDef: SimpleDialogButton) {
        if (buttonDef.onPress) {
            buttonDef.onPress();
        }
    }

    private _onKeyUp = (event: RX.Types.KeyboardEvent) => {
        let buttonToCall: SimpleDialogButton | undefined;

        if (event.keyCode === KeyCodes.Escape) {
            _.each(this.props.buttons, button => {
                if (button.isCancel) {
                    buttonToCall = button;
                }
            });

            if (buttonToCall) {
                this._completeButtonPress(buttonToCall);
                return true;
            }
        }

        return false;
    }

    private _onBack = () => {
        let buttonToCall: SimpleDialogButton | undefined;

        // Map the hardware back button to "cancel".
        _.each(this.props.buttons, button => {
            if (button.isCancel) {
                buttonToCall = button;
            }
        });

        if (buttonToCall) {
            this._completeButtonPress(buttonToCall);
            return true;
        }

        return false;
    }

    static dismissAnimated(dialogId: string): SyncTasks.Promise<void> {
        return Modal.dismissAnimated(dialogId);
    }
}
