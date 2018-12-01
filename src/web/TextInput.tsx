/**
 * TextInput.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform TextInput abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';

import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { applyFocusableComponentMixin } from './utils/FocusManager';
import { Types } from '../common/Interfaces';
import Styles from './Styles';

export interface TextInputState {
    inputValue?: string;
}

const _isMac = (typeof navigator !== 'undefined') && (typeof navigator.platform === 'string') && (navigator.platform.indexOf('Mac') >= 0);

const _styles = {
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
    },
    formStyle: {
        display: 'flex',
        flex: 1
    }
};

export interface TextInputContext {
    focusArbitrator?: FocusArbitratorProvider;
}

interface TextInputPlaceholderCacheItem {
    refCounter: number;
    styleElement: HTMLStyleElement;
}

class TextInputPlaceholderSupport {
    private static _cachedStyles: { [color: string]: TextInputPlaceholderCacheItem } = {};

    static getClassName(color: string): string {
        const key = this._colorKey(color);

        return `reactxp-placeholder-${key}`;
    }

    static addRef(color: string) {
        if (typeof document === undefined) {
            return;
        }

        const cache = this._cachedStyles;
        const key = this._colorKey(color);

        if (cache.hasOwnProperty(key)) {
            cache[key].refCounter++;
        } else {
            const className = this.getClassName(color);
            const style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = this._getStyle(className, color);

            document.head.appendChild(style);

            cache[key] = {
                refCounter: 1,
                styleElement: style
            };
        }
    }

    static removeRef(color: string) {
        const cache = this._cachedStyles;
        const key = this._colorKey(color);

        if (cache.hasOwnProperty(key)) {
            const item = cache[key];

            if (--item.refCounter < 1) {
                const styleElement = item.styleElement;
                if (styleElement.parentNode) {
                    styleElement.parentNode.removeChild(styleElement);
                }
                delete cache[key];
            }
        }
    }

    private static _colorKey(color: string): string {
        return color.toLowerCase()
            .replace(/(,|\.|#)/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    }

    private static _getStyle(className: string, placeholderColor: string): string {
        const selectors = [
            '::placeholder', // Modern browsers
            '::-webkit-input-placeholder',  // Webkit
            '::-moz-placeholder', // Firefox 19+
            ':-moz-placeholder', // Firefox 18-
            ':-ms-input-placeholder' // IE 10+
        ];

        return selectors
            .map(pseudoSelector =>
                `.${className}${pseudoSelector} {\n` +
                    `  opacity: 1;\n` +
                    `  color: ${placeholderColor};\n` +
                    `}`
                ).join('\n');
    }
}

export class TextInput extends React.Component<Types.TextInputProps, TextInputState> {
    static contextTypes: React.ValidationMap<any> = {
        focusArbitrator: PropTypes.object
    };

    context!: TextInputContext;

    private _mountedComponent: HTMLInputElement | HTMLTextAreaElement | null = null;
    private _selectionStart = 0;
    private _selectionEnd = 0;

    private _isFocused = false;
    private _ariaLiveEnabled = false;

    constructor(props: Types.TextInputProps, context: TextInputContext) {
        super(props, context);

        this.state = {
            inputValue: props.value !== undefined ? props.value : (props.defaultValue || '')
        };
    }

    componentWillReceiveProps(nextProps: Types.TextInputProps) {
        if (nextProps.value !== undefined && nextProps.value !== this.state.inputValue) {
            this.setState({
                inputValue: nextProps.value
            });
        }

        if (nextProps.placeholderTextColor !== this.props.placeholderTextColor) {
            if (nextProps.placeholderTextColor) {
                TextInputPlaceholderSupport.addRef(nextProps.placeholderTextColor);
            }

            if (this.props.placeholderTextColor) {
                TextInputPlaceholderSupport.removeRef(this.props.placeholderTextColor);
            }
        }
    }

    componentDidMount() {
        if (this.props.placeholderTextColor) {
            TextInputPlaceholderSupport.addRef(this.props.placeholderTextColor);
        }

        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    componentWillUnmount() {
        if (this.props.placeholderTextColor) {
            TextInputPlaceholderSupport.removeRef(this.props.placeholderTextColor);
        }
    }

    render() {
        const combinedStyles = Styles.combine([_styles.defaultStyle, this.props.style]) as any;

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

        const className = this.props.placeholderTextColor !== undefined ?
            TextInputPlaceholderSupport.getClassName(this.props.placeholderTextColor) : undefined;

        // Use a textarea for multi-line and a regular input for single-line.
        if (this.props.multiline) {
            return (
                <textarea
                    ref={ this._onMount }
                    style={ combinedStyles }
                    value={ this.state.inputValue }
                    title={ this.props.title }
                    tabIndex={ this.props.tabIndex }

                    autoCorrect={ this.props.autoCorrect === false ? 'off' : undefined }
                    spellCheck={ spellCheck }
                    disabled={ !editable }
                    maxLength={ this.props.maxLength }
                    placeholder={ this.props.placeholder }

                    className={className}

                    onChange={ this._onInputChanged }
                    onKeyDown={ this._onKeyDown }
                    onKeyUp={ this._checkSelectionChanged }
                    onInput={ this._onInput }
                    onFocus={ this._onFocus }
                    onBlur={ this._onBlur }
                    onMouseDown={ this._checkSelectionChanged }
                    onMouseUp={ this._checkSelectionChanged }
                    onPaste={ this._onPaste }
                    onScroll={ this._onScroll }
                    aria-label={ this.props.accessibilityLabel || this.props.title }
                    data-test-id={ this.props.testId }
                />
            );
        } else {
            const { keyboardTypeValue, wrapInForm, pattern } = this._getKeyboardType();

            let input = (
                <input
                    ref={ this._onMount }
                    style={ combinedStyles }
                    value={ this.state.inputValue }
                    title={ this.props.title }
                    tabIndex={ this.props.tabIndex }

                    className={className}

                    autoCorrect={ this.props.autoCorrect === false ? 'off' : undefined }
                    spellCheck={ spellCheck }
                    disabled={ !editable }
                    maxLength={ this.props.maxLength }
                    placeholder={ this.props.placeholder }
                    size={ 1 }

                    onChange= { this._onInputChanged }
                    onKeyDown={ this._onKeyDown }
                    onKeyUp={ this._checkSelectionChanged }
                    onInput={ this._onInput }
                    onFocus={ this._onFocus }
                    onBlur={ this._onBlur }
                    onMouseDown={ this._checkSelectionChanged }
                    onMouseUp={ this._checkSelectionChanged }
                    onPaste={ this._onPaste }
                    aria-label={ this.props.accessibilityLabel || this.props.title }
                    type={ keyboardTypeValue }
                    pattern={ pattern }
                    data-test-id={ this.props.testId }
                />
            );

            if (wrapInForm) {
                // Wrap the input in a form tag if required
                input = (
                    <form action='' onSubmit={ev => { /* prevent form submission/page reload */ ev.preventDefault(); this.blur(); } }
                          style={ _styles.formStyle }>
                        { input }
                    </form>
                );
            }

            return input;
        }
    }

    private _onMount = (comp: HTMLInputElement | HTMLTextAreaElement | null) => {
        this._mountedComponent = comp;
    }

    private _onInput = () => {
        if (_isMac && this._mountedComponent && this._isFocused && !this._ariaLiveEnabled) {
            // VoiceOver does not handle text inputs properly at the moment, aria-live is a temporary workaround.
            // And we're adding aria-live only for the focused input which is being edited, otherwise it might
            // interrupt some required announcements.
            this._mountedComponent.setAttribute('aria-live', 'assertive');
            this._ariaLiveEnabled = true;
        }
    }

    private _onFocus = (e: Types.FocusEvent) => {
        if (this._mountedComponent) {
            this._isFocused = true;

            if (this.props.onFocus) {
                this.props.onFocus(e);
            }
        }
    }

    private _onBlur = (e: Types.FocusEvent) => {
        if (this._mountedComponent) {
            this._isFocused = false;

            if (_isMac && this._ariaLiveEnabled) {
                this._mountedComponent.removeAttribute('aria-live');
                this._ariaLiveEnabled = false;
            }

            if (this.props.onBlur) {
                this.props.onBlur(e);
            }
        }
    }

    private _getKeyboardType(): { keyboardTypeValue: string; wrapInForm: boolean; pattern: string | undefined } {
        // Determine the correct virtual keyboardType in HTML 5.
        // Some types require the <input> tag to be wrapped in a form.
        // Pattern is used on numeric keyboardType to display numbers only.
        let keyboardTypeValue = 'text';
        let wrapInForm = false;
        let pattern;

        if (this.props.keyboardType === 'numeric') {
            pattern = '\\d*';
        } else if (this.props.keyboardType === 'number-pad') {
            keyboardTypeValue = 'tel';
        } else if (this.props.keyboardType === 'email-address') {
            keyboardTypeValue = 'email';
        }

        if (this.props.returnKeyType === 'search') {
            keyboardTypeValue = 'search';
            wrapInForm = true;
        }

        if (this.props.secureTextEntry) {
            keyboardTypeValue = 'password';
        }

        return { keyboardTypeValue, wrapInForm, pattern };
    }

    private _onPaste = (e: Types.ClipboardEvent) => {
        if (this.props.onPaste) {
            this.props.onPaste(e);
        }

        this._checkSelectionChanged();
    }

    private _onInputChanged = (event: React.ChangeEvent<HTMLElement>) => {
        if (!event.defaultPrevented) {
            if (this._mountedComponent) {
                // Has the input value changed?
                const value = this._mountedComponent.value || '';
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
        if (this._mountedComponent) {
            if (this._selectionStart !== this._mountedComponent.selectionStart ||
                    this._selectionEnd !== this._mountedComponent.selectionEnd) {
                this._selectionStart = this._mountedComponent.selectionStart || 0;
                this._selectionEnd = this._mountedComponent.selectionEnd || 0;

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

    private _onScroll = (e: React.UIEvent<any>) => {
        if (this.props.onScroll) {
            const { scrollLeft, scrollTop } = (e.target as Element);
            this.props.onScroll(scrollLeft, scrollTop);
        }
    }

    private _focus = () => {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => !!this._mountedComponent
        );
    }

    blur() {
        if (this._mountedComponent) {
            this._mountedComponent.blur();
        }
    }

    requestFocus() {
        this._focus();
    }

    focus() {
        if (this._mountedComponent) {
            this._mountedComponent.focus();
        }
    }

    setAccessibilityFocus() {
        this._focus();
    }

    isFocused() {
        if (this._mountedComponent) {
            return document.activeElement === this._mountedComponent;
        }
        return false;
    }

    selectAll() {
        if (this._mountedComponent) {
            this._mountedComponent.select();
        }
    }

    selectRange(start: number, end: number) {
        if (this._mountedComponent) {
            const component = this._mountedComponent as HTMLInputElement;
            component.setSelectionRange(start, end);
        }
    }

    getSelectionRange(): { start: number; end: number } {
        const range = {
            start: 0,
            end: 0
        };
        if (this._mountedComponent) {
            range.start = this._mountedComponent.selectionStart || 0;
            range.end = this._mountedComponent.selectionEnd || 0;
        }

        return range;
    }

    setValue(value: string): void {
        const inputValue = value || '';
        if (this.state.inputValue !== inputValue) {
            // It's important to set the actual value in the DOM immediately. This allows us to call other related methods
            // like selectRange synchronously afterward.
            if (this._mountedComponent) {
                this._mountedComponent.value = inputValue;
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
