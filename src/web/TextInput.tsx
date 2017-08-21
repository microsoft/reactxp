/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform TextInput abstraction.
*/

import _ = require('./utils/lodashMini');
import React = require('react');
import ReactDOM = require('react-dom');

import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');
import { applyFocusableComponentMixin } from './utils/FocusManager';

export interface TextInputState {
    inputValue?: string;
}

let _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexBasis: 'auto',
        flexGrow: 0,
        flexShrink: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        alignItems: 'stretch'
    }
};

export class TextInput extends React.Component<Types.TextInputProps, TextInputState> {
    private _selectionStart: number = 0;
    private _selectionEnd: number = 0;

    constructor(props: Types.TextInputProps) {
        super(props);

        this.state = {
            inputValue: props.value || props.defaultValue || ''
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
            this.focus();
        }
    }

    render() {
        let combinedStyles = Styles.combine([_styles.defaultStyle, this.props.style]) as any;

        // Always hide the outline.
        combinedStyles.outline = 'none';
        combinedStyles.resize = 'none';

        // Set the border to zero width if not otherwise specified.
        if (combinedStyles.borderWidth === undefined) {
            combinedStyles.borderWidth = 0;
        }

        // By default, the control is editable.
        const editable = (this.props.editable !== undefined ? this.props.editable : true);
        const spellCheck = (this.props.spellCheck !== undefined ? this.props.spellCheck : this.props.autoCorrect);

        // Use a textarea for multi-line and a regular input for single-line.
        if (this.props.multiline) {
            return (
                <textarea
                    style={ combinedStyles }
                    value={ this.state.inputValue }

                    autoCorrect={ this.props.autoCorrect }
                    spellCheck={ spellCheck }
                    disabled={ !editable }
                    maxLength={ this.props.maxLength }
                    placeholder={ this.props.placeholder }

                    onInput={ this._onInput }
                    onKeyDown={ this._onKeyDown }
                    onKeyUp={ this._checkSelectionChanged }
                    onFocus={ this.props.onFocus }
                    onBlur={ this.props.onBlur }
                    onMouseDown={ this._checkSelectionChanged }
                    onMouseUp={ this._checkSelectionChanged }
                    onPaste={ this._onPaste }
                    onScroll={ this._onScroll }
                    aria-label={ this.props.accessibilityLabel }
                />
            );
        } else {
            return (
                <input
                    style={ combinedStyles }
                    value={ this.state.inputValue }

                    autoCorrect={ this.props.autoCorrect }
                    spellCheck={ spellCheck }
                    disabled={ !editable }
                    maxLength={ this.props.maxLength }
                    placeholder={ this.props.placeholder }

                    onInput={ this._onInput }
                    onKeyDown={ this._onKeyDown }
                    onKeyUp={ this._checkSelectionChanged }
                    onFocus={ this.props.onFocus }
                    onBlur={ this.props.onBlur }
                    onMouseDown={ this._checkSelectionChanged }
                    onMouseUp={ this._checkSelectionChanged }
                    onPaste={ this._onPaste }
                    aria-label={ this.props.accessibilityLabel }
                    type={ this.props.secureTextEntry ? 'password' : 'text' }
                />
            );
        }
    }

    private _onPaste = (e: Types.ClipboardEvent) => {
        if (this.props.onPaste) {
            this.props.onPaste(e);
        }

        this._checkSelectionChanged();
    }

    private _onInput = (e: React.FormEvent) => {
        if (!e.defaultPrevented) {
            let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
            if (el) {
                // Has the input value changed?
                const value = el.value || '';
                if (this.state.inputValue !== value) {
                    // If the parent component didn't specify a value, we'll keep
                    // track of the modified value.
                    if (this.props.value === undefined) {
                        this.setState({
                            inputValue: value
                        });
                    }

                    if (this.props.onChangeText) {
                        this.props.onChangeText(value);
                    }
                }

                this._checkSelectionChanged();
            }
        }
    }

    private _checkSelectionChanged = () => {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            if (this._selectionStart !== el.selectionStart || this._selectionEnd !== el.selectionEnd) {
                this._selectionStart = el.selectionStart;
                this._selectionEnd = el.selectionEnd;

                if (this.props.onSelectionChange) {
                    this.props.onSelectionChange(this._selectionStart, this._selectionEnd);
                }
            }
        }
    }

    private _onKeyDown = (e: Types.KeyboardEvent) => {
        // Generate a "submit editing" event if the user
        // pressed enter or return.
        if (e.keyCode === 13 && (!this.props.multiline || this.props.blurOnSubmit)) {
            if (this.props.onSubmitEditing) {
                this.props.onSubmitEditing();
            }

            if (this.props.blurOnSubmit) {
                this.blur();
            }
        }

        if (this.props.onKeyPress) {
            this.props.onKeyPress(e);
        }

        this._checkSelectionChanged();
    }

    private _onScroll = (e: Types.UIEvent) => {
        if (this.props.onScroll) {
            const {scrollLeft, scrollTop} = (e.target as Element);
            this.props.onScroll(scrollLeft, scrollTop);
        }
    }

    private _focus = () => {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            el.focus();
        }
    }

    blur() {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            el.blur();
        }
    }

    focus() {
        this._focus();
    }

    setAccessibilityFocus() {
        this._focus();
    }

    isFocused() {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            return document.activeElement === el;
        }
        return false;
    }

    selectAll() {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            el.select();
        }
    }

    selectRange(start: number, end: number) {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            el.setSelectionRange(start, end);
        }
    }

    getSelectionRange(): { start: number, end: number } {
        let range = {
            start: 0,
            end: 0
        };
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            range.start = el.selectionStart;
            range.end = el.selectionEnd;
        }

        return range;
    }

    setValue(value: string): void {
        const inputValue = value || '';
        if (this.state.inputValue !== inputValue) {
            // It's important to set the actual value in the DOM immediately. This allows us to call other related methods
            // like selectRange synchronously afterward.
            let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
            if (el) {
                el.value = inputValue;
            }

            this.setState({
                inputValue: inputValue
            });

            if (this.props.onChangeText) {
                this.props.onChangeText(value);
            }
        }
    }
}

applyFocusableComponentMixin(TextInput);

export default TextInput;
