/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform TextInput abstraction.
*/

import _ = require('../native-common/lodashMini');
import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from './AccessibilityUtil';
import RX = require('../common/Interfaces');
import Styles from '../native-common/Styles';
import Types = require('../common/Types');

const _styles = {
    defaultTextInput: Styles.createTextInputStyle({
        borderWidth: 0, // Needed for Windows UWP
        padding: 0
    })
};

export interface TextInputState {
    inputValue?: string;
    isFocused?: boolean;
}

export class TextInput extends React.Component<Types.TextInputProps, TextInputState> {
    private _selectionStart: number = 0;
    private _selectionEnd: number = 0;

    constructor(props: Types.TextInputProps) {
        super(props);

        this.state = {
            inputValue: props.value || '',
            isFocused: false
        };
    }

    componentWillReceiveProps(nextProps: Types.TextInputProps) {
        if (nextProps.value !== this.state.inputValue) {
            this.setState({
                inputValue: nextProps.value
            });
        }
    }

    render() {
        const editable = (this.props.editable !== undefined ? this.props.editable : true);
        const blurOnSubmit = this.props.blurOnSubmit || !this.props.multiline;
        const submitTextOnEnter = this.props.submitTextOnEnter && this.props.multiline;
        return (
            <RN.TextInput
                ref='nativeTextInput'
                multiline={ this.props.multiline }
                style={ Styles.combine([_styles.defaultTextInput, this.props.style]) }
                value={ this.state.inputValue }

                autoCorrect={ this.props.autoCorrect }
                spellCheck={ this.props.spellCheck }
                autoCapitalize={ this.props.autoCapitalize }
                autoFocus= { this.props.autoFocus }
                keyboardType={ this.props.keyboardType }
                editable={ editable }
                selectionColor={ this.props.selectionColor }
                maxLength={ this.props.maxLength }
                placeholder={ this.props.placeholder }
                defaultValue={ this.props.value }
                placeholderTextColor={ this.props.placeholderTextColor }
                onSubmitEditing={this.props.onSubmitEditing }
                onKeyPress={ this._onKeyPress }
                onChangeText={ this._onChangeText }
                onSelectionChange={ this._onSelectionChange }
                onFocus={ this._onFocus }
                onBlur={ this._onBlur }
                onScroll={ this._onScroll }
                selection={{ start: this._selectionStart, end: this._selectionEnd }}
                secureTextEntry={ this.props.secureTextEntry }

                textAlign={ this.props.textAlign }
                keyboardAppearance={ this.props.keyboardAppearance }
                returnKeyType={ this.props.returnKeyType }
                disableFullscreenUI={ this.props.disableFullscreenUI }
                blurOnSubmit={ blurOnSubmit }
                textBreakStrategy={ 'simple' }
                accessibilityLabel={ this.props.accessibilityLabel }
                allowFontScaling={ this.props.allowFontScaling }
                maxContentSizeMultiplier={ this.props.maxContentSizeMultiplier }
                underlineColorAndroid='transparent'
                submitTextOnEnter={ submitTextOnEnter }
            />
        );
    }

    private _onFocus = (e: Types.FocusEvent) => {
        this.setState({ isFocused: true });

        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    }

    private _onBlur = (e: Types.FocusEvent) => {
        this.setState({ isFocused: false });

        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    }

    private _onChangeText = (newText: string) => {
        this.setState({ inputValue: newText });

        if (this.props.onChangeText) {
            this.props.onChangeText(newText);
        }
    }

    private _onSelectionChange = (selEvent: React.SyntheticEvent) => {
        let selection: { start: number, end: number } =
            (selEvent.nativeEvent as any).selection;

        /**
         * On iOS/macOS this callback is called BEFORE the _onChangeText, which means the inputValue hasn't had time to get updated yet
         * and cursor would always be one character behind. Fix this problem on Android only.
         */
        this._selectionStart = selection.start;
        this._selectionEnd   = selection.end;

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(this._selectionStart, this._selectionEnd);
        }

        this.forceUpdate();
    }

    private _onKeyPress = (e: React.KeyboardEvent) => {
        if (this.props.onKeyPress) {
            let keyName: string = (e.nativeEvent as any).key;
            let keyCode: number = 0;

            if (keyName.length === 1) {
                keyCode = keyName.charCodeAt(0);
            } else {
                switch (keyName) {
                    case 'Backspace':
                        keyCode = 8;
                        break;

                    case 'Tab':
                        keyCode = 9;
                        break;

                    case 'Enter':
                        keyCode = 13;
                        break;

                    case 'Shift':
                        keyCode = 16;
                        break;

                    case 'Control':
                        keyCode = 17;
                        break;

                    case 'Alt':
                        keyCode = 18;
                        break;

                    case 'Escape':
                        keyCode = 27;
                        break;

                    case 'Space':
                        keyCode = 32;
                        break;

                    case 'PageUp':
                        keyCode = 92;
                        break;

                    case 'PageDown':
                        keyCode = 93;
                        break;

                    case 'ArrowLeft':
                        keyCode = 21;
                        break;

                    case 'ArrowUp':
                        keyCode = 19;
                        break;

                    case 'ArrowRight':
                        keyCode = 22;
                        break;

                    case 'ArrowDown':
                        keyCode = 20;
                        break;

                    case 'Delete':
                        keyCode = 8;
                        break;
                }
            }

            // We need to add keyCode to the original event, but React Native
            // reuses events, so we're not allowed to modify the original.
            // Instead, we'll clone it.
            let keyEvent = _.clone(e);
            keyEvent.keyCode = keyCode;
            const nativeEvent = e.nativeEvent as KeyboardEvent;
            if (nativeEvent.shiftKey) {
                keyEvent.shiftKey = nativeEvent.shiftKey;
            }
            if (nativeEvent.ctrlKey) {
                keyEvent.ctrlKey = nativeEvent.ctrlKey;
            }
            if (nativeEvent.altKey) {
                keyEvent.altKey = nativeEvent.altKey;
            }
            if (nativeEvent.metaKey) {
                keyEvent.metaKey = nativeEvent.metaKey;
            }
            keyEvent.stopPropagation = () => {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            };
            keyEvent.preventDefault = () => {
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };

            this.props.onKeyPress(keyEvent);
        }
    }

    private _onScroll = (e: React.UIEvent) => {
        if (this.props.onScroll) {
            const { contentOffset } = (e.nativeEvent as any);
            this.props.onScroll(contentOffset.x, contentOffset.y);
        }
    }

    blur() {
        (this.refs['nativeTextInput'] as any).blur();
    }

    focus() {
        (this.refs['nativeTextInput'] as any).focus();
    }

    setAccessibilityFocus() {
        AccessibilityUtil.setAccessibilityFocus(this);
    }

    isFocused() {
        return this.state.isFocused;
    }

    selectAll() {
        // to make selection visible we have to implement it in native
        // http://stackoverflow.com/questions/1689911/programatically-select-all-text-in-uitextfield
    }

    selectRange(start: number, end: number) {
        const constrainedStart = Math.min(start, this.state.inputValue.length);
        const constrainedEnd = Math.min(end, this.state.inputValue.length);

        this._selectionStart = constrainedStart;
        this._selectionEnd = constrainedEnd;
        this.forceUpdate();
    }

    getSelectionRange(): { start: number, end: number } {
        let range = {
            start: this._selectionStart,
            end: this._selectionEnd
        };

        return range;
    }

    setValue(value: string): void {
        this._onChangeText(value);
    }
}

export default TextInput;
