/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform TextInput abstraction.
*/

import React = require('react');
import RN = require('react-native');
import PropTypes = require('prop-types');

import AccessibilityUtil from './AccessibilityUtil';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import EventHelpers from '../native-common/utils/EventHelpers';
import Styles from '../native-common/Styles';
import Types = require('../common/Types');

const _styles = {
    defaultTextInput: Styles.createTextInputStyle({
        borderWidth: 0, // Needed for Windows UWP
        padding: 0
    })
};

export interface TextInputState {
    inputValue: string;
    isFocused: boolean;
}

export interface TextInputContext {
    focusArbitrator?: FocusArbitratorProvider;
}

export class TextInput extends React.Component<Types.TextInputProps, TextInputState> {
    static contextTypes: React.ValidationMap<any> = {
        focusArbitrator: PropTypes.object
    };

    context!: TextInputContext;

    private _selectionStart: number = 0;
    private _selectionEnd: number = 0;
    private _mountedComponent: any;

    constructor(props: Types.TextInputProps, context: TextInputContext) {
        super(props, context);

        this.state = {
            inputValue: props.value || '',
            isFocused: false
        };
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    componentWillReceiveProps(nextProps: Types.TextInputProps) {
        if (nextProps.value !== this.state.inputValue) {
            this.setState({
                inputValue: nextProps.value || ''
            });
        }
    }

    render() {
        const editable = this.props.editable !== false;
        const blurOnSubmit = this.props.blurOnSubmit || !this.props.multiline;

        // The react-native interface file doesn't currently define
        // onFocus or onBlur. Work around this limitation here.
        let undefinedProps: any = {
            onFocus: this._onFocus,
            onBlur: this._onBlur
        };

        return (
            <RN.TextInput
                ref={ this._onMount }
                multiline={ this.props.multiline }
                style={ Styles.combine([_styles.defaultTextInput, this.props.style]) as RN.StyleProp<RN.TextStyle> }
                value={ this.state.inputValue }

                autoCorrect={ this.props.autoCorrect }
                spellCheck={ this.props.spellCheck }
                autoCapitalize={ this.props.autoCapitalize }
                keyboardType={ this.props.keyboardType }
                editable={ editable }
                selectionColor={ this.props.selectionColor }
                maxLength={ this.props.maxLength }
                placeholder={ this.props.placeholder }
                defaultValue={ this.props.value }
                placeholderTextColor={ this.props.placeholderTextColor }
                onSubmitEditing={this.props.onSubmitEditing }
                onKeyPress={ this._onKeyPress as any }
                onChangeText={ this._onChangeText }
                onSelectionChange={ this._onSelectionChange as any }
                onScroll={ this._onScroll }
                selection={{ start: this._selectionStart, end: this._selectionEnd }}
                secureTextEntry={ this.props.secureTextEntry }

                keyboardAppearance={ this.props.keyboardAppearance }
                returnKeyType={ this.props.returnKeyType }
                disableFullscreenUI={ this.props.disableFullscreenUI }
                blurOnSubmit={ blurOnSubmit }
                textBreakStrategy={ 'simple' }
                accessibilityLabel={ this.props.accessibilityLabel }
                allowFontScaling={ this.props.allowFontScaling }
                maxContentSizeMultiplier={ this.props.maxContentSizeMultiplier }
                underlineColorAndroid='transparent'
                { ...undefinedProps }
            />
        );
    }

    protected _onMount = (component: any) => {
        this._mountedComponent = component;
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

    private _onSelectionChange = (selEvent: React.SyntheticEvent<TextInput>) => {
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

    private _onKeyPress = (e: React.SyntheticEvent<any>) => {

        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    }

    private _onScroll = (e: React.UIEvent<TextInput>) => {
        if (this.props.onScroll) {
            const { contentOffset } = (e.nativeEvent as any);
            this.props.onScroll(contentOffset.x, contentOffset.y);
        }
    }

    blur() {
        if (this._mountedComponent) {
            this._mountedComponent.blur();
        }
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => !!this._mountedComponent
        );
    }

    focus() {
        if (this._mountedComponent) {
            this._mountedComponent.focus();
        }
    }

    setAccessibilityFocus() {
        if (this._mountedComponent) {
            AccessibilityUtil.setAccessibilityFocus(this);
        }
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
