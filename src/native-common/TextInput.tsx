/**
 * TextInput.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform TextInput abstraction.
 */
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as RN from 'react-native';

import AccessibilityUtil from './AccessibilityUtil';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import EventHelpers from './utils/EventHelpers';
import { Types } from '../common/Interfaces';
import Styles from './Styles';

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

interface Selection {
    start: number;
    end: number;
}

export class TextInput extends React.Component<Types.TextInputProps, TextInputState> {
    static contextTypes: React.ValidationMap<any> = {
        focusArbitrator: PropTypes.object
    };

    context!: TextInputContext;

    private _selectionToSet: Selection | undefined;
    private _selection: Selection = { start: 0, end: 0 };
    protected _mountedComponent: RN.TextInput | undefined;

    constructor(props: Types.TextInputProps, context: TextInputContext) {
        super(props, context);

        this.state = {
            inputValue: props.value || '',
            isFocused: false
        };
    }

    componentWillReceiveProps(nextProps: Types.TextInputProps) {
        if (nextProps.value !== undefined && nextProps.value !== this.state.inputValue) {
            this.setState({
                inputValue: nextProps.value || ''
            });
        }
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    protected _render(props: RN.TextInputProps, onMount: (textInput: RN.TextInput | null) => void): JSX.Element {
        return (
            <RN.TextInput { ...props } ref={ onMount } />
        );
    }

    render() {
        const editable = this.props.editable !== false;
        const blurOnSubmit = this.props.blurOnSubmit || !this.props.multiline;

        const internalProps: RN.ExtendedTextInputProps = {
            multiline: this.props.multiline,
            style: Styles.combine([_styles.defaultTextInput, this.props.style]) as RN.StyleProp<RN.TextStyle>,
            value: this.state.inputValue,

            autoCorrect: this.props.autoCorrect,
            spellCheck: this.props.spellCheck,
            autoCapitalize: this.props.autoCapitalize,
            keyboardType: this.props.keyboardType,
            editable: editable,
            selectionColor: this.props.selectionColor,
            maxLength: this.props.maxLength,
            placeholder: this.props.placeholder,
            defaultValue: this.props.value,
            placeholderTextColor: this.props.placeholderTextColor,
            onSubmitEditing: this.props.onSubmitEditing,
            onKeyPress: this._onKeyPress,
            onPaste: this._onPaste,
            onChangeText: this._onChangeText,
            onSelectionChange: this._onSelectionChange,
            onFocus: this._onFocus,
            onBlur: this._onBlur,
            onScroll: this._onScroll,
            selection: this._selectionToSet,
            secureTextEntry: this.props.secureTextEntry,

            keyboardAppearance: this.props.keyboardAppearance,
            returnKeyType: this.props.returnKeyType,
            disableFullscreenUI: this.props.disableFullscreenUI,
            blurOnSubmit: blurOnSubmit,
            textBreakStrategy: 'simple',
            accessibilityLabel: this.props.accessibilityLabel,
            allowFontScaling: this.props.allowFontScaling,
            maxContentSizeMultiplier: this.props.maxContentSizeMultiplier,
            underlineColorAndroid: 'transparent',
            clearButtonMode: this.props.clearButtonMode,
            testID: this.props.testId
        };

        this._selectionToSet = undefined;

        return this._render(internalProps, this._onMount);
    }

    protected _onMount = (component: RN.TextInput | null) => {
        this._mountedComponent = component || undefined;
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

    private _onSelectionChange = (e: RN.NativeSyntheticEvent<RN.TextInputSelectionChangeEventData>) => {
        const selection = e.nativeEvent.selection;

        /**
         * On Android, clamp the selection start and end indices to be within the bounds of the TextInput's value.
         * If we didn't do this, on Android some Java code would throw an index out of bounds exception when attempting
         * to set the selection. An important detail for this to work is that React Native Android fires `onChangeText`
         * before `onSelectionChange` which means we have the up-to-date TextInput value's length when this handler
         * runs. Whereas in React Native iOS and UWP, those events fire in the reverse order so this handler can't
         * clamp on those platforms.
         */
        const selectionStart = (RN.Platform.OS === 'android')
            ? Math.min(selection.start, this.state.inputValue.length)
            : selection.start;

        const selectionEnd = (RN.Platform.OS === 'android')
            ? Math.min(selection.end, this.state.inputValue.length)
            : selection.end;

        this._selection = { start: selectionStart, end: selectionEnd };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(selectionStart, selectionEnd);
        }
    }

    private _onKeyPress = (e: RN.NativeSyntheticEvent<RN.TextInputKeyPressEventData>) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    }

    private _onPaste = (e: React.ClipboardEvent<any>) => {
        if (this.props.onPaste) {
            this.props.onPaste(e);
        }
    }

    private _onScroll = (e: RN.NativeSyntheticEvent<RN.TextInputScrollEventData>) => {
        if (this.props.onScroll) {
            const { contentOffset } = e.nativeEvent;
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
        this._selectionToSet = { start: 0, end: this.state.inputValue.length };
        this._selection = this._selectionToSet;
        this.forceUpdate();
    }

    selectRange(start: number, end: number) {
        const constrainedStart = Math.min(start, this.state.inputValue.length);
        const constrainedEnd = Math.min(end, this.state.inputValue.length);

        this._selectionToSet = { start: constrainedStart, end: constrainedEnd };
        this._selection = this._selectionToSet;
        this.forceUpdate();
    }

    getSelectionRange(): { start: number; end: number } {
        return this._selection;
    }

    setValue(value: string): void {
        this._onChangeText(value);
    }
}

export default TextInput;
