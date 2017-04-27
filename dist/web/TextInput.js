/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform TextInput abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./utils/lodashMini");
var React = require("react");
var ReactDOM = require("react-dom");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexBasis: 'auto',
        flex: '0 0 auto',
        overflowX: 'hidden',
        overflowY: 'auto',
        alignItems: 'stretch'
    }
};
var TextInput = (function (_super) {
    __extends(TextInput, _super);
    function TextInput(props) {
        var _this = _super.call(this, props) || this;
        _this._selectionStart = 0;
        _this._selectionEnd = 0;
        _this._onPaste = function (e) {
            if (_this.props.onPaste) {
                _this.props.onPaste(e);
            }
            _this._checkSelectionChanged();
        };
        _this._onInput = function (e) {
            if (!e.defaultPrevented) {
                var el = ReactDOM.findDOMNode(_this);
                if (el) {
                    // Has the input value changed?
                    var value = el.value || '';
                    if (_this.state.inputValue !== value) {
                        // If the parent component didn't specify a value, we'll keep
                        // track of the modified value.
                        if (_this.props.value === undefined) {
                            _this.setState({
                                inputValue: value
                            });
                        }
                        if (_this.props.onChangeText) {
                            _this.props.onChangeText(value);
                        }
                    }
                    _this._checkSelectionChanged();
                }
            }
        };
        _this._checkSelectionChanged = function () {
            var el = ReactDOM.findDOMNode(_this);
            if (el) {
                if (_this._selectionStart !== el.selectionStart || _this._selectionEnd !== el.selectionEnd) {
                    _this._selectionStart = el.selectionStart;
                    _this._selectionEnd = el.selectionEnd;
                    if (_this.props.onSelectionChange) {
                        _this.props.onSelectionChange(_this._selectionStart, _this._selectionEnd);
                    }
                }
            }
        };
        _this._onKeyDown = function (e) {
            // Generate a "submit editing" event if the user
            // pressed enter or return.
            if (e.keyCode === 13 && (!_this.props.multiline || _this.props.blurOnSubmit)) {
                if (_this.props.onSubmitEditing) {
                    _this.props.onSubmitEditing();
                }
                if (_this.props.blurOnSubmit) {
                    _this.blur();
                }
            }
            if (_this.props.onKeyPress) {
                _this.props.onKeyPress(e);
            }
            _this._checkSelectionChanged();
        };
        _this._onScroll = function (e) {
            if (_this.props.onScroll) {
                var _a = e.target, scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
                _this.props.onScroll(scrollLeft, scrollTop);
            }
        };
        _this.state = {
            inputValue: props.value || props.defaultValue || ''
        };
        return _this;
    }
    TextInput.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.value !== undefined && nextProps.value !== this.state.inputValue) {
            this.setState({
                inputValue: nextProps.value || ''
            });
        }
    };
    TextInput.prototype.componentDidMount = function () {
        if (this.props.autoFocus) {
            this.focus();
        }
    };
    TextInput.prototype.render = function () {
        var combinedStyles = Styles_1.default.combine(_styles.defaultStyle, this.props.style);
        // Always hide the outline and border.
        combinedStyles = _.extend({
            outline: 'none',
            border: 'none',
            resize: 'none'
        }, combinedStyles);
        // By default, the control is editable.
        var editable = (this.props.editable !== undefined ? this.props.editable : true);
        var spellCheck = (this.props.spellCheck !== undefined ? this.props.spellCheck : this.props.autoCorrect);
        // Use a textarea for multi-line and a regular input for single-line.
        if (this.props.multiline) {
            return (React.createElement("textarea", { style: combinedStyles, value: this.state.inputValue, autoCorrect: this.props.autoCorrect, spellCheck: spellCheck, disabled: !editable, maxLength: this.props.maxLength, placeholder: this.props.placeholder, onInput: this._onInput, onKeyDown: this._onKeyDown, onKeyUp: this._checkSelectionChanged, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onMouseDown: this._checkSelectionChanged, onMouseUp: this._checkSelectionChanged, onPaste: this._onPaste, onScroll: this._onScroll, "aria-label": this.props.accessibilityLabel }));
        }
        else {
            return (React.createElement("input", { style: combinedStyles, value: this.state.inputValue, autoCorrect: this.props.autoCorrect, spellCheck: spellCheck, disabled: !editable, maxLength: this.props.maxLength, placeholder: this.props.placeholder, onInput: this._onInput, onKeyDown: this._onKeyDown, onKeyUp: this._checkSelectionChanged, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onMouseDown: this._checkSelectionChanged, onMouseUp: this._checkSelectionChanged, onPaste: this._onPaste, "aria-label": this.props.accessibilityLabel, type: this.props.secureTextEntry ? 'password' : 'text' }));
        }
    };
    TextInput.prototype.blur = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.blur();
        }
    };
    TextInput.prototype.focus = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.focus();
        }
    };
    TextInput.prototype.isFocused = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            return document.activeElement === el;
        }
        return false;
    };
    TextInput.prototype.selectAll = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.select();
        }
    };
    TextInput.prototype.selectRange = function (start, end) {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.setSelectionRange(start, end);
        }
    };
    TextInput.prototype.getSelectionRange = function () {
        var range = {
            start: 0,
            end: 0
        };
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            range.start = el.selectionStart;
            range.end = el.selectionEnd;
        }
        return range;
    };
    TextInput.prototype.setValue = function (value) {
        var inputValue = value || '';
        if (this.state.inputValue !== inputValue) {
            // It's important to set the actual value in the DOM immediately. This allows us to call other related methods
            // like selectRange synchronously afterward.
            var el = ReactDOM.findDOMNode(this);
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
    };
    return TextInput;
}(RX.TextInput));
exports.TextInput = TextInput;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextInput;
